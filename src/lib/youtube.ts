
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyBu3BhPoa28k5WtPPHiHll8wG2YlasivP8';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export async function getYouTubePlaylist(playlistId: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    console.error('YouTube API key is not configured. Please set the NEXT_PUBLIC_YOUTUBE_API_KEY environment variable in your .env.local file.');
    throw new Error('YouTube API Key is missing or invalid.');
  }

  let allVideos: YouTubeVideo[] = [];
  let nextPageToken: string | null = null;

  try {
    do {
      const params = new URLSearchParams({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: '50',
        key: YOUTUBE_API_KEY,
      });

      if (nextPageToken) {
        params.append('pageToken', nextPageToken);
      }

      const response = await fetch(`${YOUTUBE_API_URL}/playlistItems?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API Error:', errorData);
        throw new Error(`Failed to fetch playlist data: ${errorData.error.message}`);
      }

      const data = await response.json();

      const videos = data.items
        .filter((item: any) => item.snippet?.resourceId?.videoId && item.snippet?.thumbnails) // Ensure videoId and thumbnails exist
        .map((item: any) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
        }));

      allVideos = [...allVideos, ...videos];
      nextPageToken = data.nextPageToken || null;

    } while (nextPageToken);
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    throw error;
  }

  return allVideos;
}
