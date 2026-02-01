#!/bin/bash
set -e

echo "🔧 Running Prisma generate..."
npm run generate

echo "📦 Running database migrations..."
npm run migrate:deploy || npm run migrate

echo "🏗️  Building NestJS application..."
npm run build

# Verify build succeeded
if [ ! -f "dist/main.js" ]; then
  echo "❌ Build failed - dist/main.js not found"
  echo "📁 Checking if dist directory exists:"
  ls -la dist/ 2>/dev/null || echo "dist directory does not exist"
  echo "❌ Build verification failed, exiting..."
  exit 1
fi

echo "✅ Build verification passed - dist/main.js exists"

echo "🌱 Running seed script (optional)..."
npm run seed1 || echo "⚠️  Seed script failed, but continuing..."

echo "✅ Build completed!"

