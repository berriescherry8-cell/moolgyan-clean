// YouTube Automation Service
// Automatically fetches live and uploaded videos from your channels

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  isLive: boolean;
  duration?: string;
  viewCount?: number;
}

interface LiveSatsangData {
  title: string;
  description?: string;
  youtube_url: string;
  is_live: boolean;
  thumbnail_url?: string;
  channel_name?: string;
  channel_id?: string;
  view_count?: number;
  duration?: string;
  published_at?: string;
}

const YOUTUBE_API_KEY = 'AIzaSyAI06x00qzKKtlUeGQmrezUIKKgtOW7284';
const CHANNEL_IDS = [
  'UCvXJhRv0vZGQlJl8bLjJQw', // @nitin.dasssatsang
  'UCvXJhRv0vZGQlJl8bLjJQw', // @nitin-kabir-krishna-nanak-ram - will extract actual ID
];

// Extract channel ID from YouTube URL
export function extractChannelId(url: string): string | null {
  const patterns = [
    /youtube\.com\/@([^\/]+)/,
    /youtube\.com\/channel\/([^\/]+)/,
    /youtube\.com\/c\/([^\/]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get channel ID from handle using YouTube API
export async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handle}&type=channel&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }
    return null;
  } catch (error) {
    console.error('Error getting channel ID:', error);
    return null;
  }
}

// Fetch live videos from a channel
export async function fetchLiveVideos(channelId: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    const videos: YouTubeVideo[] = [];
    
    for (const item of data.items || []) {
      // Get video details including duration and view count
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${item.id.videoId}&key=${YOUTUBE_API_KEY}`
      );
      const detailsData = await detailsResponse.json();
      
      const videoDetails = detailsData.items?.[0];
      
      videos.push({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        isLive: true,
        duration: videoDetails?.contentDetails?.duration,
        viewCount: videoDetails?.statistics?.viewCount ? parseInt(videoDetails.statistics.viewCount) : undefined
      });
    }
    
    return videos;
  } catch (error) {
    console.error(`Error fetching live videos for channel ${channelId}:`, error);
    return [];
  }
}

// Fetch recent uploaded videos from a channel
export async function fetchRecentVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    const videos: YouTubeVideo[] = [];
    
    for (const item of data.items || []) {
      // Get video details
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${item.id.videoId}&key=${YOUTUBE_API_KEY}`
      );
      const detailsData = await detailsResponse.json();
      
      const videoDetails = detailsData.items?.[0];
      
      videos.push({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        isLive: false,
        duration: videoDetails?.contentDetails?.duration,
        viewCount: videoDetails?.statistics?.viewCount ? parseInt(videoDetails.statistics.viewCount) : undefined
      });
    }
    
    return videos;
  } catch (error) {
    console.error(`Error fetching recent videos for channel ${channelId}:`, error);
    return [];
  }
}

// Sync videos to Supabase
export async function syncVideosToSupabase(videos: YouTubeVideo[]): Promise<{ success: number; skipped: number; errors: number }> {
  const results = { success: 0, skipped: 0, errors: 0 };
  
  for (const video of videos) {
    try {
      // Check if video already exists
      const existingCheck = await fetch(`/api/check-video-exists?videoId=${video.videoId}`);
      const exists = await existingCheck.json();
      
      if (exists.exists) {
        results.skipped++;
        continue;
      }
      
      // Prepare data for Supabase
      const satsangData: LiveSatsangData = {
        title: video.title,
        description: video.description,
        youtube_url: `https://www.youtube.com/watch?v=${video.videoId}`,
        is_live: video.isLive,
        thumbnail_url: video.thumbnail,
        channel_name: video.channelTitle,
        channel_id: video.channelId,
        view_count: video.viewCount,
        duration: video.duration,
        published_at: video.publishedAt
      };
      
      // Insert into Supabase
      const response = await fetch('/api/live-satsangs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(satsangData),
      });
      
      if (response.ok) {
        results.success++;
        console.log(`Successfully synced: ${video.title}`);
      } else {
        results.errors++;
        console.error(`Failed to sync: ${video.title}`);
      }
    } catch (error) {
      results.errors++;
      console.error(`Error syncing video ${video.videoId}:`, error);
    }
  }
  
  return results;
}

// Main automation function
export async function runYouTubeAutomation(): Promise<{
  liveVideos: YouTubeVideo[];
  recentVideos: YouTubeVideo[];
  syncResults: { success: number; skipped: number; errors: number };
}> {
  console.log('Starting YouTube automation...');
  
  // Your channel handles
  const channelHandles = [
    '@nitin.dasssatsang',
    '@nitin-kabir-krishna-nanak-ram'
  ];
  
  const allLiveVideos: YouTubeVideo[] = [];
  const allRecentVideos: YouTubeVideo[] = [];
  
  // Get channel IDs and fetch videos
  for (const handle of channelHandles) {
    const channelId = await getChannelIdFromHandle(handle);
    if (!channelId) {
      console.error(`Could not find channel ID for ${handle}`);
      continue;
    }
    
    console.log(`Fetching videos for channel: ${handle} (${channelId})`);
    
    // Fetch live videos
    const liveVideos = await fetchLiveVideos(channelId);
    allLiveVideos.push(...liveVideos);
    
    // Fetch recent uploaded videos (last 24 hours)
    const recentVideos = await fetchRecentVideos(channelId, 5);
    allRecentVideos.push(...recentVideos);
  }
  
  // Sync all videos to Supabase
  const allVideos = [...allLiveVideos, ...allRecentVideos];
  const syncResults = await syncVideosToSupabase(allVideos);
  
  console.log('YouTube automation completed:', {
    liveVideosFound: allLiveVideos.length,
    recentVideosFound: allRecentVideos.length,
    syncResults
  });
  
  return {
    liveVideos: allLiveVideos,
    recentVideos: allRecentVideos,
    syncResults
  };
}

// Clean title and description
function cleanText(text: string): string {
  return text
    .replace(/[^\w\s\-.,!?()[\]{}:"']/g, '') // Remove special characters except basic punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Format duration from ISO 8601 to readable format
export function formatDuration(duration?: string): string {
  if (!duration) return '';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
