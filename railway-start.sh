#!/bin/bash
set -e

echo "🚀 Starting application..."

# Ensure dist/main.js exists
if [ ! -f "dist/main.js" ]; then
  echo "⚠️  dist/main.js not found, building..."
  npm run build
  
  # Verify build succeeded
  if [ ! -f "dist/main.js" ]; then
    echo "❌ Build failed - dist/main.js still not found"
    echo "📁 Checking dist directory contents:"
    ls -la dist/ || echo "dist directory does not exist"
    exit 1
  fi
fi

echo "✅ Found dist/main.js, starting application..."
# Start the application
node dist/main.js

