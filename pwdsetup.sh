#!/bin/bash

# Change to the backend directory
cd backend || { echo "Backend directory not found"; exit 1; }

echo "=== Password Setup Utility ==="

# Check if a compiled binary exists (for production servers)
if [ -f "./backend" ]; then
    ./backend -setpwd
else
    # Fallback to 'go run' (for local development)
    go run main.go -setpwd
fi
