'use client';

import { useEffect } from 'react';
import { X, Share2, ExternalLink, Music, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getEmbedUrl } from '@/lib/youtube-utils';
import { formatDate } from '@/lib/utils';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl?: string;
  title?: string;
  description?: string;
  lyrics?: string;
  createdAt?: string;
  onClose: () => void;
}

export default function VideoModal({
  isOpen,
  videoUrl,
  title = 'Video Player',
  description,
  lyrics,
  createdAt,
  onClose,
}: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const embedSrc = videoUrl ? getEmbedUrl(videoUrl, { autoplay: 1 }) : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label={title}
    >
      <div className="w-full max-w-6xl max-h-[95vh] mx-auto">
        {/* Close Button - Mobile friendly */}
        <button
          onClick={onClose}
          className="fixed md:relative top-4 md:top-[-3rem] right-4 z-[1001] w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all md:hover:scale-110"
          aria-label="Close video"
        >
          <X className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        <Card className="bg-black/60 backdrop-blur-xl border-white/20 overflow-hidden w-full">
          {/* Video Iframe - Responsive full height */}
          <div className="aspect-video w-full bg-black md:min-h-[60vh] lg:min-h-[70vh]">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title={title}
                className="w-full h-full rounded-t-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
                <Music className="h-16 w-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white line-clamp-2">{title}</h2>
            
            {description && (
              <p className="text-slate-300 line-clamp-3">{description}</p>
            )}

            {lyrics && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-gold-400 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lyrics
                </h3>
                <div className="max-h-32 overflow-y-auto text-sm text-slate-200 whitespace-pre-line pr-2">
                  {lyrics}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between pt-2">
              {createdAt && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
                  {formatDate(createdAt as string)}
                </span>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 bg-black/50 backdrop-blur hover:bg-white/10 text-white flex-1 sm:flex-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(videoUrl || '');
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                {videoUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
            className="bg-gradient-to-r from-gold-500 via-orange-500 to-red-500 hover:from-gold-600 hover:via-orange-600 hover:to-red-600 shadow-gold-500/25"
                  >
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      YouTube
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

