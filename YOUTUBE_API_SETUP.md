# YouTube API Setup Guide

## How to Get a YouTube API Key

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on "Select a project" dropdown
4. Click "New Project"
5. Enter a project name (e.g., "Mool Gyan App")
6. Click "Create"

### Step 2: Enable YouTube Data API v3
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on "YouTube Data API v3"
4. Click "Enable"

### Step 3: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Copy the generated API key

### Step 4: Set Up Environment Variable
1. In your project root directory, create or edit the `.env.local` file
2. Add the following line:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with the actual API key you copied

### Step 5: Restart Your Development Server
After adding the environment variable, restart your Next.js development server for the changes to take effect.

## Important Notes
- **API Limits**: The YouTube Data API has usage limits. For most applications, the free quota should be sufficient.
- **Security**: Never commit your `.env.local` file to version control (it should already be in your `.gitignore`)
- **Billing**: You may need to enable billing on your Google Cloud project to use the YouTube API, though there is a free tier

## Testing the Setup
Once you've set up the API key and restarted your server, the YouTube playlist should load properly in your satsang page.

## Alternative: Direct Embed
If you prefer not to use the YouTube API, you can embed the playlist directly using an iframe:
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/videoseries?list=PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

However, using the API provides better control over the display and search functionality.