package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

type IPStackResponse struct {
	CountryName string `json:"country_name"`
}

func main() {
	// Load local .env if it exists (ignored in production)
	_ = godotenv.Load()

	// Initialize SQLite Database
	db, err := sql.Open("sqlite3", "./visits.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create table if it doesn't exist. The IP is the PRIMARY KEY, enforcing deduplication.
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (ip TEXT PRIMARY KEY, country TEXT)`)
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
