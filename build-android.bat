@echo off
echo Building Android APK and AAB files...
echo ======================================

echo Step 1: Syncing Capacitor...
npx cap sync android

echo.
echo Step 2: Building Debug APK...
cd android
call ./gradlew assembleDebug

echo.
echo Step 3: Building Release APK...
call ./gradlew assembleRelease

echo.
echo Step 4: Building AAB (Android App Bundle)...
call ./gradlew bundleRelease

echo.
echo Build process completed!
echo ======================================

echo APK files location:
echo - Debug: android\app\build\outputs\apk\debug\app-debug.apk
echo - Release: android\app\build\outputs\apk\release\app-release.apk
echo.
echo AAB file location:
echo - android\app\build\outputs\bundle\release\app-release.aab

echo.
echo If you encounter Java compatibility issues, try:
echo 1. Installing Java 11 or 17
echo 2. Setting JAVA_HOME to the compatible Java version
echo 3. Or using Android Studio to build the project

pause