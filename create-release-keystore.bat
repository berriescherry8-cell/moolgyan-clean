@echo off
echo Creating release keystore for signing APK...
echo =============================================

if not exist "android/app/moolgyan.keystore" (
    echo Creating new keystore...
    keytool -genkeypair -v -keystore android/app/moolgyan.keystore -alias moolgyan -keyalg RSA -keysize 2048 -validity 10000 -storetype PKCS12 -dname "CN=Mool Gyan, OU=Development, O=Mool Gyan, L=YourCity, S=YourState, C=IN" -storepass moolgyan123 -keypass moolgyan123
    echo Keystore created successfully!
) else (
    echo Keystore already exists.
)

echo.
echo Keystore location: android\app\moolgyan.keystore
echo Password: moolgyan123
echo Alias: moolgyan
echo.
echo =============================================
pause