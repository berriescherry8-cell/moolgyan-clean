'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Maximize2, Volume2, X, Share2 } from 'lucide-react';
import VideoModal from './VideoModal';
import { YouTubeVideo } from '@/lib/youtube';
import { getThumbnailUrl, getEmbedUrl, getValidatedVideoId } from '@/lib/youtube-utils';

interface VideoCardProps {
  video: YouTubeVideo;
  title: string;
  onVideoSelect?: (video: YouTubeVideo) => void;
}

export default function VideoCard({ video, title, onVideoSelect }: VideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoId = video.videoId; // Use direct videoId from API
  const thumbnailUrl = getThumbnailUrl(`https://youtube.com/watch?v=${videoId}`);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedParams = { 
    autoplay: isExpanded ? 1 : 0, 
    playsinline: 1,
    enablejsapi: 1,
    origin,
    mute: 0,
    controls: 1,
    rel: 0,
    modestbranding: 1
  };
  const embedUrl = videoId ? getEmbedUrl(`https://youtube.com/watch?v=${videoId}`, embedParams) : null;

  const toggleExpand = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
      setError(null);
    } else {
      setIsLoading(true);
      setIsExpanded(true);
      // Simulate load time for smooth UX
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isExpanded]);

  const handleFullscreen = () => {
    onVideoSelect?.(video);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Post message to set speed/volume if supported
    const iframe = document.querySelector('iframe');
    if (iframe && playbackSpeed !== 1) {
      (iframe as any).contentWindow.postMessage({
        event: 'command',
        func: 'setPlaybackRate',
        args: [playbackSpeed]
      }, '*');
    }
  };

  if (!videoId) {
    return (
      <Card className="bg-gradient-to-br from-rose-500/20 to-red-500/20 border-red-500/30 p-6 text-center">
        <Play className="h-12 w-12 text-red-400 mx-auto mb-4 opacity-50" />
        <p className="text-slate-400">Invalid video URL</p>
      </Card>
    );
  }

  return (
    <>
      <Card 
        className={`
          overflow-hidden group cursor-pointer transition-all duration-300 
          h-[400px] flex flex-col relative
          bg-gradient-to-br from-slate-900/50 to-black/70 backdrop-blur-xl border-white/20
          hover:border-gold-400/50 hover:shadow-2xl hover:shadow-gold-500/25
          ${isExpanded ? 'card-expand glow-pulse divine-rays z-10 shadow-3xl shadow-gold-500/50 border-gold-400/70 max-h-[700px]' : 'hover:scale-[1.02]'}
        `}
        style={{ maxHeight: isExpanded ? '700px' : '400px' }}
        onClick={toggleExpand}
      >
        {/* Thumbnail / Loading */}
        <div className="relative flex-1 bg-gradient-to-br from-black/80 to-slate-900/50">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {!isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center">
              <div className="text-center p-8">
                <Play className="h-20 w-20 text-gold-400 mx-auto mb-4 play-icon-bounce shadow-2xl shadow-gold-500/50" />
              </div>
            </div>
          )}

          
          {/* Inline Player */}
          {isExpanded && (
            <div className="absolute inset-0">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-500/20 to-orange-500/20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-rose-500/20 to-red-500/20">
                  <Play className="h-16 w-16 text-red-400 mb-4" />
                  <p className="text-white font-bold text-lg mb-2">Player Error</p>
                  <p className="text-slate-400 text-sm">{error}</p>
                </div>
              ) : embedUrl ? (
                <iframe
                  src={embedUrl || ''}
                  title={title}
                  className="w-full h-full rounded-t-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; volume"
                  allowFullScreen
                  loading="lazy"
                  onLoad={handleIframeLoad}
                  onError={() => {
                    setError('Failed to load video player');
                    setIsLoading(false);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-black/70">
                  <Play className="h-16 w-16 text-slate-400" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <CardContent className="p-6 pt-0 flex-shrink-0">
          {!isExpanded ? (
            <>
              <CardTitle className="text-lg font-bold text-white line-clamp-2 mb-2 drop-shadow-lg">{title}</CardTitle>
              <p className="text-sm text-slate-400 line-clamp-2">{video.description}</p>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gold-400 to-orange-400 bg-clip-text text-transparent">
                  {title}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 border-gold-400/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Player Controls */}
              <div className="flex flex-wrap gap-2 items-center p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-gold-500/30">
                <Volume2 className="h-4 w-4 text-gold-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 h-2 bg-gold-500/30 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                
                <span className="text-xs text-slate-400">Speed:</span>
                <select 
                  value={playbackSpeed} 
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-black/50 border-gold-500/50 text-gold-300 text-xs px-2 py-1 rounded-lg focus:ring-gold-500"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto border-gold-400/50 bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreen();
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Fullscreen</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional Modal for true fullscreen */}
      {isExpanded && (
        <VideoModal
          isOpen={false}
          videoUrl={video.videoUrl}
          title={title}
          description={video.description}
          onClose={() => {}}
        />
      )}
    </>
  );
}

