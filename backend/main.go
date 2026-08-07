package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/term"
)

var devlogCache struct {
	sync.RWMutex
	content string
}

func fetchDevlog() {
	resp, err := http.Get("https://raw.githubusercontent.com/michioD/led-matrix-esp32/main/DEVLOG.md")
	if err != nil {
		log.Println("Error fetching devlog:", err)
		return
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading devlog:", err)
		return
	}
	devlogCache.Lock()
	devlogCache.content = string(body)
	devlogCache.Unlock()
	log.Println("Successfully fetched and cached devlog")
}

type IPStackResponse struct {
	CountryName string `json:"country_name"`
}

func main() {
	// Load local .env if it exists (ignored in production)
	_ = godotenv.Load()

	setPwd := flag.Bool("setpwd", false, "Set the admin password interactively and store its hash in the database")
	flag.Parse()

	// Initialize SQLite Database
	db, err := sql.Open("sqlite3", "./visits.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create admin table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, hash TEXT)`)
	if err != nil {
		log.Fatal(err)
	}

	if *setPwd {
		var existingHash string
		err := db.QueryRow("SELECT hash FROM admin WHERE id = 1").Scan(&existingHash)
		if err == nil && existingHash != "" {
			fmt.Print("An admin password already exists. Do you want to change your password? [y/N]: ")
			var response string
			fmt.Scanln(&response)
			response = strings.TrimSpace(strings.ToLower(response))
			if response != "y" && response != "yes" {
				fmt.Println("Password setup aborted.")
				return
			}
		}

		fmt.Print("Enter new admin password: ")
		bytePassword, err := term.ReadPassword(int(syscall.Stdin))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println()

		hash, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Failed to hash password:", err)
		}

		_, err = db.Exec("INSERT OR REPLACE INTO admin (id, hash) VALUES (1, ?)", string(hash))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Password hashed and saved to database successfully.")
		return
	}

	// Start background fetch for devlog
	go func() {
		fetchDevlog()
		ticker := time.NewTicker(24 * time.Hour)
		for range ticker.C {
			fetchDevlog()
		}
	}()

	// Create table if it doesn't exist. The IP is the PRIMARY KEY, enforcing deduplication.
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (ip TEXT PRIMARY KEY, country TEXT)`)
	if err != nil {
		log.Fatal(err)
	}

	// Create blogs table for the Custom CMS
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS blogs (id TEXT PRIMARY KEY, title TEXT, excerpt TEXT, content TEXT, date TEXT, category TEXT)`)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()

	// Endpoint 1: Called silently by your React frontend when a user visits
	mux.HandleFunc("/api/track", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		ip := getIP(r)

		// Check if IP already exists in our database
		var exists string
		err := db.QueryRow("SELECT ip FROM users WHERE ip = ?", ip).Scan(&exists)

		if err == sql.ErrNoRows {
			// New user! Call IPstack securely
			apiKey := os.Getenv("IPSTACK_KEY")
			url := fmt.Sprintf("http://api.ipstack.com/%s?access_key=%s", ip, apiKey)

			resp, err := http.Get(url)
			if err == nil {
				defer resp.Body.Close()
				body, _ := io.ReadAll(resp.Body)

				var ipData IPStackResponse
				json.Unmarshal(body, &ipData)

				if ipData.CountryName != "" {
					// Save to database so we never call IPstack for this IP again
					db.Exec("INSERT INTO users (ip, country) VALUES (?, ?)", ip, ipData.CountryName)
				}
			}
		}
		w.WriteHeader(http.StatusOK) // Always return 200 OK so the frontend doesn't hang
	})

	// Endpoint 2: Called by your Dashboard to get the aggregated data
	mux.HandleFunc("/api/stats", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT country, COUNT(*) as count FROM users GROUP BY country")
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		stats := make(map[string]int)
		for rows.Next() {
			var country string
			var count int
			rows.Scan(&country, &count)
			stats[country] = count
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(stats)
	})

	// Endpoint 3: Devlog
	mux.HandleFunc("/api/devlog", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		devlogCache.RLock()
		content := devlogCache.content
		devlogCache.RUnlock()
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte(content))
	})

	// Endpoint 4: Custom CMS Blogs
	mux.HandleFunc("/api/blogs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			rows, err := db.Query("SELECT id, title, excerpt, content, date, category FROM blogs")
			if err != nil {
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			type Blog struct {
				ID       string `json:"id"`
				Title    string `json:"title"`
				Excerpt  string `json:"excerpt"`
				Content  string `json:"content"`
				Date     string `json:"date"`
				Category string `json:"category"`
			}
			var blogs []Blog
			for rows.Next() {
				var b Blog
				rows.Scan(&b.ID, &b.Title, &b.Excerpt, &b.Content, &b.Date, &b.Category)
				blogs = append(blogs, b)
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(blogs)
			return
		}

		if r.Method == "POST" {
			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			password := strings.TrimPrefix(authHeader, "Bearer ")

			var hash string
			err := db.QueryRow("SELECT hash FROM admin WHERE id = 1").Scan(&hash)
			if err != nil {
				if err == sql.ErrNoRows {
					http.Error(w, "Admin password not set up. Run pwdsetup.sh.", http.StatusUnauthorized)
					return
				}
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}

			if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var b struct {
				ID       string `json:"id"`
				Title    string `json:"title"`
				Excerpt  string `json:"excerpt"`
				Content  string `json:"content"`
				Date     string `json:"date"`
				Category string `json:"category"`
			}
			if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
				http.Error(w, "Invalid body", http.StatusBadRequest)
				return
			}

			_, err = db.Exec("INSERT OR REPLACE INTO blogs (id, title, excerpt, content, date, category) VALUES (?, ?, ?, ?, ?, ?)", b.ID, b.Title, b.Excerpt, b.Content, b.Date, b.Category)
			if err != nil {
				http.Error(w, "DB error", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "DELETE" {
			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			password := strings.TrimPrefix(authHeader, "Bearer ")

			var hash string
			err := db.QueryRow("SELECT hash FROM admin WHERE id = 1").Scan(&hash)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			id := r.URL.Query().Get("id")
			if id == "" {
				http.Error(w, "Missing id parameter", http.StatusBadRequest)
				return
			}

			_, err = db.Exec("DELETE FROM blogs WHERE id = ?", id)
			if err != nil {
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			return
		}
	})

	log.Println("Go backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

// Helper function to extract real IP behind Nginx
func getIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip != "" {
		return strings.Split(ip, ",")[0]
	}
	return strings.Split(r.RemoteAddr, ":")[0]
}
