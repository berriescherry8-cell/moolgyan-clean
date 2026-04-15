'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getVideoId, getValidatedVideoId, getThumbnailUrl, getNextQuality, FALLBACK_THUMBNAIL_URL, type ThumbnailQuality, QUALITY_CHAIN } from '@/lib/youtube-utils';
import { Video } from 'lucide-react';

interface YouTubeThumbnailProps {
  url: string | null | undefined;
  alt?: string;
  className?: string;
  quality?: ThumbnailQuality;
  onClick?: () => void;
  showPlayOverlay?: boolean;
  fallbackIcon?: boolean;
}

/**
 * Reusable YouTube Thumbnail Component with proper fallback chain
 * 
 * FIXED ISSUES:
 * 1. Now properly chains through quality fallbacks instead of just showing error
 * 2. Uses validated video ID to prevent invalid URLs
 * 3. Prevents infinite re-render loops
 * 4. Uses built-in fallback image instead of requiring external file
 */
export default function YouTubeThumbnail({
  url,
  alt = 'YouTube video thumbnail',
  className = '',
  quality = 'hqdefault',
  onClick,
  showPlayOverlay = false,
  fallbackIcon = true,
}: YouTubeThumbnailProps) {
  const [currentQuality, setCurrentQuality] = useState<ThumbnailQuality>(quality);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExhaustedFallbacks, setHasExhaustedFallbacks] = useState(false);
  
  // Track if we're currently retrying to prevent infinite loops
  const isRetryingRef = useRef(false);
  const previousUrlRef = useRef(url);

  // Extract and validate video ID
  const videoId = getValidatedVideoId(url);
  
  // Debug logging
  useEffect(() => {
    if (url) {
      console.log('[YouTubeThumbnail] URL:', url);
      console.log('[YouTubeThumbnail] Video ID:', videoId);
    }
  }, [url, videoId]);

  // Reset state when URL changes
  useEffect(() => {
    if (url !== previousUrlRef.current) {
      previousUrlRef.current = url;
      setCurrentQuality(quality);
      setImageError(false);
      setIsLoading(true);
      setHasExhaustedFallbacks(false);
      isRetryingRef.current = false;
    }
  }, [url, quality]);

  // Generate thumbnail URL
  const thumbnailUrl = videoId ? getThumbnailUrl(url, currentQuality) : null;

  const handleError = useCallback(() => {
    // Prevent infinite retry loops
    if (isRetryingRef.current) {
      return;
    }

    isRetryingRef.current = true;

    // Try next quality in the chain
    const nextQuality = getNextQuality(currentQuality);
    
    if (nextQuality) {
      console.log(`[YouTubeThumbnail] ${currentQuality} failed, trying ${nextQuality}`);
      // Reset the retry flag after a short delay to allow image to load
      setTimeout(() => {
        isRetryingRef.current = false;
      }, 100);
      setCurrentQuality(nextQuality);
    } else {
      // No more qualities to try
      console.log('[YouTubeThumbnail] All qualities exhausted, showing fallback');
      setIsLoading(false);
      setImageError(true);
      setHasExhaustedFallbacks(true);
      isRetryingRef.current = false;
    }
  }, [currentQuality]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
    isRetryingRef.current = false;
  }, []);

  // No URL or couldn't extract/validate video ID
  if (!url || !videoId) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 ${className}`}>
        {fallbackIcon && (
          <>
            <Video className="h-12 w-12 text-zinc-600" />
            <span className="absolute bottom-2 text-xs text-zinc-500">
              {!url ? 'No video URL' : 'Invalid video ID'}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state - show fallback icon */}
      {imageError && fallbackIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
          <Video className="h-12 w-12 text-zinc-600" />
        </div>
      )}

      {/* Main image */}
      <img
        src={thumbnailUrl || FALLBACK_THUMBNAIL_URL}
        alt={alt}
        className={`w-full h-full object-cover ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} ${imageError ? 'invisible' : ''}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Show current quality for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && !isLoading && !imageError && (
        <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {currentQuality}
        </span>
      )}

      {/* Play overlay */}
      {showPlayOverlay && !isLoading && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors duration-300">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
            <Video className="h-6 w-6 text-black ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * YouTube Thumbnail with automatic quality fallback starting from maxresdefault
 * This is the recommended component to use for best quality thumbnails
 */
export function YouTubeThumbnailWithFallback({
  url,
  alt = 'YouTube video thumbnail',
  className = '',
  onClick,
  showPlayOverlay = false,
  fallbackIcon = true,
}: Omit<YouTubeThumbnailProps, 'quality'>) {
  return (
    <YouTubeThumbnail
      url={url}
      alt={alt}
      className={className}
      quality="maxresdefault"
      onClick={onClick}
      showPlayOverlay={showPlayOverlay}
      fallbackIcon={fallbackIcon}
    />
  );
}

/**
 * Lightweight thumbnail component that only uses hqdefault (safest, always exists)
 * Use this when you don't need the best quality and want to avoid fallback complexity
 */
export function YouTubeThumbnailHQ({
  url,
  alt = 'YouTube video thumbnail',
  className = '',
  onClick,
  showPlayOverlay = false,
  fallbackIcon = true,
}: Omit<YouTubeThumbnailProps, 'quality'>) {
  return (
    <YouTubeThumbnail
      url={url}
      alt={alt}
      className={className}
      quality="hqdefault"
      onClick={onClick}
      showPlayOverlay={showPlayOverlay}
      fallbackIcon={fallbackIcon}
    />
  );
}