# Mool Gyan App

A spiritual content management app built with Next.js and Capacitor for Android APK deployment.

## Features

- 📱 **Mobile-First Design**: Built with Next.js and Radix UI components
- 📺 **Video Management**: Add YouTube videos or upload files directly
- 📚 **Book Store**: Manage spiritual books and documents
- 🖼️ **Photo Gallery**: Organize spiritual photos and events
- 📝 **News & Updates**: Content management system
- 🔔 **Notifications**: Push notification support
- 🌐 **Multi-language**: Internationalization support

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Radix UI, Tailwind CSS
- **State Management**: React Context API
- **Storage**: Supabase
- **Mobile**: Capacitor for Android APK builds
- **Build Tools**: Vite, PostCSS, Autoprefixer

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for APK builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mool-new-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and configure:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME="Mool Gyan"
   NEXT_PUBLIC_APP_VERSION="5.0.0"
   ```

4. **Set up Supabase**
   
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Set up authentication and storage buckets
   - Configure tables for books, photos, videos, news, etc.
   - Copy the project URL and API keys to your `.env.local` file

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Building for Android

### Prerequisites

- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK)

### Build Process

1. **Initialize Capacitor (first time only)**
   ```bash
   npm run cap:init
   npm run cap:add:android
   ```

2. **Build the app**
   ```bash
   npm run cap:build:apk
   ```

3. **Locate the APK**
   
   The APK will be generated at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Alternative Build Commands

```bash
# Prepare Android project
npm run cap:prepare:android

# Run on connected device/emulator
npm run cap:run:android

# Open Android Studio
npm run cap:open:android
```

## Supabase Setup

This app uses Supabase for authentication, database, and storage.

### Database Tables

Create these tables in your Supabase dashboard:

1. **books** - Store book information
2. **photos** - Store photo metadata
3. **videos** - Store video information
4. **news** - Store news articles
5. **orders** - Store book orders
6. **wisdom_quotes** - Store inspirational quotes

### Storage Buckets

Create these storage buckets:

1. **books** - PDF files and book covers
2. **photos** - Image files
3. **videos** - Video files
4. **documents** - Other documents

### Authentication

Set up email authentication in Supabase dashboard:
- Enable email sign-in
- Configure email templates
- Set up admin users

## Data Management

The app uses Supabase for data persistence and file storage. All data is synchronized with your Supabase project.

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify your Supabase URL and API keys
   - Check Supabase project status
   - Ensure proper table permissions

2. **Android Build Failures**
   - Ensure Android SDK is properly configured
   - Check Gradle version compatibility
   - Verify Java version (Java 11 recommended)

3. **Authentication Failures**
   - Check Supabase authentication settings
   - Verify user permissions
   - Ensure proper API key configuration

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for API errors
- Use Android Studio's Logcat for mobile debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the GitHub Issues
- Review the documentation
- Contact the development team

## Notes

- This app uses Supabase for cost-effective storage and authentication
- All user data is stored in your Supabase project
- The app works offline with cached data
- Regular backups are handled automatically through Supabase
