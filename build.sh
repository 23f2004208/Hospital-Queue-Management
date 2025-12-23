#!/bin/bash
set -e  # Exit on any error

# Build script for Render deployment
echo "Starting build process..."

# Install root dependencies
echo "Installing server dependencies..."
npm install

# Install client dependencies and build
echo "Installing client dependencies..."
cd client

echo "Current directory: $(pwd)"
echo "Files before npm install:"
ls -la

echo "Installing client packages..."
npm install

echo "Files after npm install:"
ls -la

echo "Running Vite build..."
NODE_ENV=production npm run build

echo "Build completed. Checking output:"
ls -la

# Verify build output
echo "Verifying build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "Build successful - dist folder and index.html found"
    echo "Contents of dist:"
    ls -la dist/
else
    echo "ERROR: Build failed - dist folder or index.html not found"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

cd ..
echo "Build complete!"
