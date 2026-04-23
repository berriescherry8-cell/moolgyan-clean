/**
 * YouTube Utility Functions (FINAL FIXED VERSION)
 * 
 * Provides robust video ID extraction and thumbnail generation
 * with proper validation and fallback handling.
 */

/**
 * Supported YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=10s (with timestamp)
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID (with playlist)
 */

/**
 * Thumbnail quality options from highest to lowest resolution
 */
export type ThumbnailQuality = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default';

/**
 * Quality chain for fallback - ordered from best to worst
 */
export const QUALITY_CHAIN: ThumbnailQuality[] = ['maxresdefault', 'hqdefault', 'mqdefault', 'default'];

/**
 * Extract video ID from a YouTube URL
 * @param url - The YouTube URL to extract the video ID from
 * @returns The video ID or null if extraction fails
 */
export function getVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const cleanUrl = url.trim();

    // Try regex patterns first (faster)
    const patterns = [
      /youtube\.com\/watch\?v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // URL parsing fallback for edge cases
    try {
      const urlObj = new URL(cleanUrl);

      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          const v = urlObj.searchParams.get('v');
          if (v) return v;
        }

        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
          return parts[1] || null;
        }
      }

      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch {
      // URL parsing failed - not a valid URL
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate if a string is a valid YouTube video ID
 * YouTube video IDs are exactly 11 characters, alphanumeric plus - and _
 */
export function isValidVideoId(id: string | null | undefined): boolean {
  return !!id && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

/**
 * Extract and validate video ID
 * Returns null if extraction fails OR if the ID is invalid
 */
export function getValidatedVideoId(url: string | null | undefined): string | null {
  const id = getVideoId(url);
  if (!isValidVideoId(id)) {
    console.warn('[YouTube Utils] Invalid video ID extracted:', id, 'from URL:', url);
    return null;
  }
  return id;
}

/**
 * Default fallback thumbnail URL (placeholder)
 * Replace with your own image or use a data URI
 */
export const FALLBACK_THUMBNAIL_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+PHBhdGggZD0iTTExMCA5MGw1MC0zMHY2MHoiIGZpbGw9IiM1NTU1NTUiLz48L3N2Zz4=';

/**
 * Get next quality in the fallback chain
 * @param currentQuality - Current quality that failed
 * @returns Next quality or null if no more fallbacks
 */
export function getNextQuality(currentQuality: ThumbnailQuality): ThumbnailQuality | null {
  const currentIndex = QUALITY_CHAIN.indexOf(currentQuality);
  if (currentIndex < QUALITY_CHAIN.length - 1) {
    return QUALITY_CHAIN[currentIndex + 1];
  }
  return null;
}

/**
 * Generate thumbnail URLs object with all qualities
 * Use this for preloading or manual fallback handling
 */
export function getThumbnails(url: string | null | undefined): {
  maxres: string | null;
  hq: string | null;
  mq: string | null;
  fallback: string;
  videoId: string | null;
} {
  const videoId = getValidatedVideoId(url);

  if (!videoId) {
    return {
      maxres: null,
      hq: null,
      mq: null,
      fallback: FALLBACK_THUMBNAIL_URL,
      videoId: null,
    };
  }

  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    fallback: FALLBACK_THUMBNAIL_URL,
    videoId,
  };
}

/**
 * Generate a single thumbnail URL
 * @param url - YouTube video URL
 * @param quality - Thumbnail quality (default: 'hqdefault' - safest choice)
 * @returns Thumbnail URL or null if extraction fails
 */
export function getThumbnailUrl(
  url: string | null | undefined,
  quality: ThumbnailQuality = 'hqdefault'
): string | null {
  const videoId = getValidatedVideoId(url);  // FIXED: Use validated ID
  if (!videoId) {
    return null;
  }
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Generate embed URL with proper parameters
 */
export function getEmbedUrl(
  url: string | null | undefined,
  params: Record<string, string | number | boolean> = {}
): string | null {
  const videoId = getValidatedVideoId(url);
  if (!videoId) return null;

  const defaultParams = {
    rel: 0,
    modestbranding: 1,
    autoplay: 0,
    showinfo: 0,
    controls: 1,
    disablekb: 0,
    fs: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,
    hl: 'en',
    enablejsapi: 1,
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  };

  const allParams = { ...defaultParams, ...params };
  const query = new URLSearchParams(
    Object.entries(allParams)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)]) as [string, string][]
  ).toString();

  return `https://www.youtube.com/embed/${videoId}?${query}`;
}

/**
 * Check if a YouTube thumbnail URL is likely to exist
 * maxresdefault only exists for videos uploaded in 720p or higher
 */
export function isThumbnailLikelyToExist(quality: ThumbnailQuality): boolean {
  // maxresdefault only exists for HD videos
  // hqdefault and lower qualities always exist for valid video IDs
  return quality !== 'maxresdefault';
}