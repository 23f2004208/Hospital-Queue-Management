#!/bin/bash

# Build script for Render deployment
echo "🏗️  Starting build process..."

# Install root dependencies
echo "📦 Installing server dependencies..."
npm install

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React app..."
npm run build

echo "✅ Build complete!"
