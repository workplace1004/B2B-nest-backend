#!/bin/bash
set -e

echo "🚀 Starting application..."

# Ensure dist exists
if [ ! -d "dist" ]; then
  echo "⚠️  dist directory not found, building..."
  npm run build
fi

# Start the application
node dist/main

