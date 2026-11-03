#!/usr/bin/env bash
# Build Script for Android APK generation using Bubblewrap CLI
# Make executable with: chmod +x build-apk.sh

echo "=========================================="
echo "My General Store - Android APK Builder"
echo "=========================================="

if ! command -v bubblewrap &> /dev/null
then
    echo "Bubblewrap CLI is not installed."
    echo "Installing Bubblewrap globally via npm..."
    npm install -g @bubblewrap/cli
fi

echo "Verifying environment and building APK..."
bubblewrap build

echo "=========================================="
echo "Build complete! Check output directory for app-release-signed.apk"
echo "=========================================="
