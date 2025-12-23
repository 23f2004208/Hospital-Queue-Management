#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install root dependencies
echo "Installing server dependencies..."
npm install

# Install client dependencies and build
echo "Installing client dependencies..."
cd client
npm install

echo "Building React app..."
npm run build

# Verify build output
echo "Verifying build output..."
if [ -f "dist/index.html" ]; then
    echo "Build successful - index.html found"
    ls -la dist/
else
    echo "ERROR: Build failed - index.html not found"
    exit 1
fi

cd ..
echo "Build complete!"
