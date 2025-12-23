#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install root dependencies
echo "Installing server dependencies..."
npm install

# Install client dependencies and build
echo "Installing client dependencies..."
cd client

echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

npm install

echo "Running Vite build..."
npm run build 2>&1 | tee build.log

echo "After build - checking for dist folder:"
ls -la

# Verify build output
echo "Verifying build output..."
if [ -f "dist/index.html" ]; then
    echo "Build successful - index.html found"
    ls -la dist/
else
    echo "ERROR: Build failed - index.html not found"
    echo "Build log:"
    cat build.log
    echo "Contents of current directory:"
    ls -laR
    exit 1
fi

cd ..
echo "Build complete!"
