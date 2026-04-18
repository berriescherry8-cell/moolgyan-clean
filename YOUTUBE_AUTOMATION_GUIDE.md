# YouTube Automation System for Daily Live Satsangs

## Overview
Yes, it's absolutely possible to automatically fetch and upload YouTube videos from your channels! Here's a complete solution:

## Options Available

### Option 1: YouTube Data API (Recommended)
**Automatically fetch new videos when they're uploaded**

#### Setup Steps:
1. **Get YouTube Data API Key**
   - Go to Google Cloud Console
   - Enable YouTube Data API v3
   - Create API credentials

2. **Create Automation Script**
```javascript
// lib/youtube-automation.ts
export async function fetchLatestVideos(channelIds: string[]) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const videos = [];
  
  for (const channelId of channelIds) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${API_KEY}`
    );
    const data = await response.json();
    
    for (const item of data.items) {
      videos.push({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high.url
      });
    }
  }
  
  return videos;
}
```

3. **Create Scheduled Job**
```javascript
// app/api/sync-youtube/route.ts
export async function POST() {
  const videos = await fetchLatestVideos([
    'YOUR_CHANNEL_ID_1',
    'YOUR_CHANNEL_ID_2'
  ]);
  
  for (const video of videos) {
    // Check if video already exists
    const existing = await supabase
      .from('live_satsangs')
      .select('*')
      .eq('youtube_url', `https://www.youtube.com/watch?v=${video.videoId}`)
      .single();
    
    if (!existing.data) {
      // Insert new video
      await supabase.from('live_satsangs').insert({
        title: video.title,
        description: video.description,
        youtube_url: `https://www.youtube.com/watch?v=${video.videoId}`,
        is_live: false, // Archive videos
        thumbnail_url: video.thumbnail
      });
    }
  }
  
  return Response.json({ success: true, videosProcessed: videos.length });
}
```

### Option 2: YouTube RSS Feed (Simpler)
**Use YouTube's built-in RSS feeds**

```javascript
// lib/youtube-rss.ts
export async function fetchFromRSS(channelId: string) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(rssUrl);
  const xml = await response.text();
  
  // Parse XML and extract video info
  // Then insert into database
}
```

### Option 3: Webhook Integration (Real-time)
**Get instant notifications when videos are uploaded**

1. **Use YouTube PubSubHubbub**
2. **Set up webhook endpoint**
3. **Process notifications in real-time**

## Implementation Plan

### Step 1: Get Your Channel IDs
1. Go to your YouTube channel
2. View page source
3. Search for `channelId`
4. Copy the channel ID

### Step 2: Set Up Environment Variables
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID_1=your_first_channel_id
YOUTUBE_CHANNEL_ID_2=your_second_channel_id
```

### Step 3: Create Admin Interface
```typescript
// src/app/admin/(protected)/youtube-sync/page.tsx
export default function YouTubeSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  const handleManualSync = async () => {
    setIsSyncing(true);
    await fetch('/api/sync-youtube', { method: 'POST' });
    setLastSync(new Date());
    setIsSyncing(false);
  };
  
  return (
    <div className="p-6">
      <h1>YouTube Automation</h1>
      <Button onClick={handleManualSync} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </Button>
      {lastSync && <p>Last sync: {lastSync.toLocaleString()}</p>}
    </div>
  );
}
```

### Step 4: Set Up Automatic Sync
```javascript
// Use Vercel Cron Jobs or similar
// vercel.json
{
  "crons": [
    {
      "path": "/api/sync-youtube",
      "schedule": "0 */6 * * *" // Every 6 hours
    }
  ]
}
```

## Benefits

1. **Zero Manual Work** - Videos appear automatically
2. **Real-time Updates** - New videos within minutes
3. **Multiple Channels** - Support for unlimited channels
4. **Smart Filtering** - Avoid duplicates
5. **Archive Management** - Auto-categorize live vs archive

## Quick Start

1. **Run the SQL script** to fix your database
2. **Get YouTube API key**
3. **Add your channel IDs**
4. **Test with manual sync**
5. **Set up automatic scheduling**

## Advanced Features

- **Auto-detect live streams** vs regular videos
- **Smart title/description cleaning**
- **Automatic thumbnail generation**
- **Batch processing for efficiency**
- **Error handling and retry logic**

Would you like me to implement any of these options for you? I recommend starting with Option 1 (YouTube Data API) as it's the most reliable and feature-rich.
