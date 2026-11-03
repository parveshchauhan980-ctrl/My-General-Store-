# 📱 Android APK & Mobile App Installation Guide

This document explains how to obtain and install the **My General Store** mobile app on Android devices, including how to generate a standalone `.apk` file and how to install it instantly via WebAPK / PWA without needing manual file transfer.

---

## ⚡ Method 1: Instant Direct Install on Android (Recommended - No APK download needed)

Because this app is built with modern **PWA (Progressive Web App)** and **WebAPK** standards, Android can build and install a genuine native app directly from Chrome:

1. Open your store website URL on your Android phone using **Google Chrome** or **Samsung Internet**.
2. Tap the **three dots menu (⋮)** in the top right corner of the browser.
3. Tap **"Install app"** or **"Add to Home screen"** (or click the green **"Install App"** button at the top of the store).
4. Android will automatically download the WebAPK and add the **My General Store** icon to your app drawer and home screen.
5. The app launches full-screen without any browser address bar, supports offline caching, and runs at native speed.

---

## 📦 Method 2: Generate & Download Standalone `.apk` File (Via Microsoft PWABuilder)

If you want a physical `.apk` file to share over WhatsApp, upload to Google Drive, or submit to the Google Play Store:

1. Open [https://www.pwabuilder.com](https://www.pwabuilder.com) in your browser.
2. Enter your live store URL (e.g. your AI Studio deployment URL or custom domain).
3. Click **"Start"**. PWABuilder analyzes the web app manifest and icons.
4. Under **"Android"**, click **"Package for Android"** (or **"Generate APK"**).
5. Download the generated `.apk` file (signed or unsigned) or the complete Android Studio project zip.
6. Transfer the `.apk` file to any Android device, tap it, allow "Install from Unknown Sources", and enjoy!

---

## 🛠️ Method 3: Build APK with Bubblewrap / Trusted Web Activity (Command Line)

To build a production signed `.apk` on your local machine using Google's official Bubblewrap CLI:

```bash
# 1. Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project using the manifest in android/twa-manifest.json
cd android
bubblewrap init --manifest="https://<your-store-url>/manifest.webmanifest"

# 3. Build debug or release APK
bubblewrap build
```

This generates `app-release-signed.apk` ready for sideloading or publishing to the Google Play Store.

---

## 📱 Method 4: Build Native APK with Capacitor

If you want to wrap the project in a native Android Studio project using Capacitor:

```bash
# 1. Build the web app
npm run build

# 2. Install Capacitor core and CLI
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. Initialize Capacitor
npx cap init "My General Store" "com.mygeneralstore.kirana" --web-dir="dist"

# 4. Add Android platform
npx cap add android

# 5. Open in Android Studio to build APK
npx cap open android
```

In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to output `app-debug.apk` or `app-release.apk`.

---

## 📁 Android Files in this Repository

- `android/twa-manifest.json`: Android Trusted Web Activity metadata and package configuration.
- `android/assetlinks.json`: Digital Asset Links for seamless Android WebAPK integration.
- `android/build-apk.sh`: Quick build helper script for Bubblewrap.
- `capacitor.config.json`: Capacitor mobile runtime configuration.
- `public/.well-known/assetlinks.json`: Public assetlinks for domain verification.
