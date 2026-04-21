@echo off
echo ============================================
echo Mool Gyan App - Final Build Script
echo ============================================
echo.
echo This script will build your Android APK and AAB files
echo with the fixed app icons and splash screen.
echo.
echo IMPORTANT: If you encounter Java compatibility issues,
echo please use Android Studio to build the project instead.
echo.
echo Files created:
echo - build-android.bat - Main build script
echo - create-release-keystore.bat - Creates signing keystore
echo - android/gradle.properties - Java configuration
echo.
echo ============================================
echo Step 1: Creating release keystore...
call create-release-keystore.bat
echo.
echo ============================================
echo Step 2: Syncing Capacitor...
npx cap sync android
echo.
echo ============================================
echo Step 3: Attempting to build APK files...
cd android
echo.
echo Building Debug APK...
call ./gradlew assembleDebug || (
    echo.
    echo ERROR: Gradle build failed due to Java compatibility.
    echo.
    echo SOLUTION: Use Android Studio to build the project:
    echo 1. Open Android Studio
    echo 2. File -> Open -> Select the 'android' folder
    echo 3. Wait for Gradle sync to complete
    echo 4. Build -> Build Bundle(s) / APK(s)
    echo 5. Select "Build APK(s)" for APK file
    echo 6. Select "Build Bundle(s)" for AAB file
    echo.
    echo OR try setting JAVA_HOME to Java 11 or 17:
    echo set JAVA_HOME=C:\path\to\java11
    echo.
    goto :end
)
echo.
echo Building Release APK...
call ./gradlew assembleRelease
echo.
echo Building AAB (Android App Bundle)...
call ./gradlew bundleRelease
echo.
echo ============================================
echo SUCCESS: Build completed!
echo ============================================
echo.
echo APK and AAB files location:
echo.
echo Debug APK:  android\app\build\outputs\apk\debug\app-debug.apk
echo Release APK: android\app\build\outputs\apk\release\app-release.apk
echo AAB File:    android\app\build\outputs\bundle\release\app-release.aab
echo.
echo Your app now has:
echo ✅ Custom app icon (replaces default Capacitor icon)
echo ✅ Yellow-orange gradient splash screen
echo ✅ Larger, more prominent logo
echo ✅ Fixed loading issues (no more stuck splash screen)
echo.
echo To install on your device:
echo 1. Copy the APK file to your Android device
echo 2. Install it (you may need to allow "Unknown sources")
echo 3. Enjoy your app with the new look!
echo.
:end
pause