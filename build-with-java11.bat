@echo off
echo ============================================
echo Building Mool Gyan APK with Java 11
echo ============================================
echo.

echo Step 1: Setting Java 11 path...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.26.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME set to: %JAVA_HOME%
echo.

echo Step 2: Checking Java version...
java -version
echo.

echo Step 3: Navigating to Android directory...
cd android
echo Current directory: %CD%
echo.

echo Step 4: Stopping any running Gradle daemons...
call ./gradlew --stop
echo.

echo Step 5: Building Debug APK...
echo This may take several minutes...
call ./gradlew assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo SUCCESS: Debug APK built successfully!
    echo ============================================
    echo.
    echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Step 6: Building Release APK...
    call ./gradlew assembleRelease
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================
        echo SUCCESS: Release APK built successfully!
        echo ============================================
        echo.
        echo Release APK location: android\app\build\outputs\apk\release\app-release.apk
        echo.
        echo Step 7: Building AAB (Android App Bundle)...
        call ./gradlew bundleRelease
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ============================================
            echo SUCCESS: All builds completed successfully!
            echo ============================================
            echo.
            echo Files created:
            echo - Debug APK:  android\app\build\outputs\apk\debug\app-debug.apk
            echo - Release APK: android\app\build\outputs\apk\release\app-release.apk
            echo - AAB File:    android\app\build\outputs\bundle\release\app-release.aab
            echo.
            echo Your app now has:
            echo ✅ Custom app icon (replaces default Capacitor icon)
            echo ✅ Yellow-orange gradient splash screen
            echo ✅ Larger, more prominent logo
            echo ✅ Fixed loading issues (no more stuck splash screen)
            echo.
        ) else (
            echo ERROR: AAB build failed
        )
    ) else (
        echo ERROR: Release APK build failed
    )
) else (
    echo.
    echo ERROR: Debug APK build failed
    echo.
    echo This might be due to Java compatibility issues.
    echo.
    echo SOLUTION: Use Android Studio to build the project:
    echo 1. Open Android Studio
    echo 2. File -> Open -> Select the 'android' folder
    echo 3. Wait for Gradle sync to complete
    echo 4. Build -> Build Bundle(s) / APK(s)
    echo 5. Select "Build APK(s)" for APK file
    echo 6. Select "Build Bundle(s)" for AAB file
)

echo.
echo ============================================
pause