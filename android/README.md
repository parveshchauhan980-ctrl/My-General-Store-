# Android App & APK Build Directory

This folder contains configuration files to generate a standalone Android `.apk` package from the **My General Store** web app.

## Files
- `twa-manifest.json`: Configuration for Google's Trusted Web Activity (TWA) Bubblewrap CLI.
- `assetlinks.json`: Android Digital Asset Links file for domain ownership verification.
- `build-apk.sh`: Helper bash script to run Bubblewrap.

## Easiest Ways to Get the Android APK
1. **Instant WebAPK (Zero file transfer)**: Open the web store in Chrome on Android and tap "Install App" or "Add to Home screen". Android creates and installs a WebAPK directly.
2. **Microsoft PWABuilder (Online 1-click APK generator)**:
   - Go to [PWABuilder.com](https://www.pwabuilder.com)
   - Paste your app's deployed URL
   - Click "Package for Android" -> Download `.apk` file!
3. **Local CLI Build**: Run `./build-apk.sh` with Node.js and Android SDK configured.
