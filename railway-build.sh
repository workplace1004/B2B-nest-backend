#!/bin/bash
set -e

echo "🔧 Running Prisma generate..."
npm run generate

echo "📦 Running database migrations..."
npm run migrate:deploy || npm run migrate

echo "🏗️  Building NestJS application..."
npm run build

echo "🌱 Running seed script (optional)..."
npm run seed1 || echo "⚠️  Seed script failed, but continuing..."

echo "✅ Build completed!"

