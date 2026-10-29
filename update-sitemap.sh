#!/bin/bash

# Configuration
DB_PATH="/var/www/my-website/backend/visits.db"
BASE_SITEMAP="/var/www/my-website/dist/sitemap.xml" # Where your build outputs it
SITE_URL="https://your-domain.com" # Replace with your real domain!

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database not found at $DB_PATH"
    exit 1
fi

# We will generate a temporary file with the new dynamic XML
TEMP_XML=$(mktemp)

# Query SQLite for all published dynamic blogs and append them to the temporary XML block
sqlite3 "$DB_PATH" "SELECT id FROM blogs WHERE COALESCE(draft, 0) = 0;" | while read -r id; do
    echo "    <url>" >> "$TEMP_XML"
    echo "        <loc>${SITE_URL}/blog/${id}</loc>" >> "$TEMP_XML"
    echo "        <changefreq>monthly</changefreq>" >> "$TEMP_XML"
    echo "        <priority>0.6</priority>" >> "$TEMP_XML"
    echo "    </url>" >> "$TEMP_XML"
done

# Add your older static fallback blogs
STATIC_BLOGS=("1" "2" "self-hosting-minecraft-server-on-an-old-s10-")
for id in "${STATIC_BLOGS[@]}"; do
    echo "    <url>" >> "$TEMP_XML"
    echo "        <loc>${SITE_URL}/blog/${id}</loc>" >> "$TEMP_XML"
    echo "        <changefreq>monthly</changefreq>" >> "$TEMP_XML"
    echo "        <priority>0.6</priority>" >> "$TEMP_XML"
    echo "    </url>" >> "$TEMP_XML"
done

# Read the temporary block we just generated
NEW_CONTENT=$(cat "$TEMP_XML")

# Inject the new dynamic blogs into the base sitemap exactly between our placeholder tags!
# We use sed to replace everything between <!-- DYNAMIC_BLOGS_START --> and <!-- DYNAMIC_BLOGS_END -->
sed -i "/<!-- DYNAMIC_BLOGS_START -->/!b;n;c\\
$NEW_CONTENT
" "$BASE_SITEMAP"

echo "Sitemap successfully updated with all latest blog posts!"
rm "$TEMP_XML"
