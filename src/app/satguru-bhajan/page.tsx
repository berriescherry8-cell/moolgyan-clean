<<<<<<< HEAD

'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Loader2, AlertCircle, Search, Music } from 'lucide-react';
import type { SatguruBhajan } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useLocale } from '@/lib/i18n';
import { useCollection } from '@/lib/data-manager';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


function BhajanVideoCard({ video }: { video: SatguruBhajan }) {
    return (
      <Card className="overflow-hidden group transition-shadow hover:shadow-xl flex flex-col bg-card/80 backdrop-blur-sm">
        <VideoPlayer video={video} />
        <CardContent className="p-4 flex-grow">
          <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
          {video.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>}
        </CardContent>
        {video.lyrics && (
            <CardFooter className="p-4 pt-0">
                <Collapsible className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                        <span className="flex items-center">
                            <Music size={16} className="mr-2" />
                            View Lyrics
                        </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 p-4 bg-background/50 rounded-lg border max-h-48 overflow-y-auto">
                        <p className="whitespace-pre-line leading-relaxed text-sm text-muted-foreground">
                            {video.lyrics}
                        </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
            </CardFooter>
        )}
      </Card>
    );
}


export default function SatguruBhajanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLocale();
  const videos = useCollection<SatguruBhajan>('satguruBhajans');
  
  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    return videos.filter(video =>
      (video.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [videos, searchQuery]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 font-headline">{t.nav_satguru_bhajan}</h1>
      
      <div className="space-y-8">
          <div className="mb-8 flex justify-center">
              <div className="relative w-32 h-32 p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 shadow-lg shadow-yellow-500/30">
                  <div className="w-full h-full bg-background rounded-full p-1 relative overflow-hidden border-2 border-yellow-300/50">
                      <Image 
                          src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/images.jpg"
                          alt="Satguru Bhajan Logo" 
                          fill
                          className="object-cover rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/20 to-transparent"></div>
                  </div>
              </div>
          </div>
          <div>
            <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                placeholder="Search bhajans..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {filteredVideos.map((video) => (
                      <BhajanVideoCard key={video.id} video={video} />
                  ))}
              </div>
            ): (
              <div className="text-center py-16">
                  <Music className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold">No Bhajans Found</h3>
                  <p className="text-muted-foreground mt-2">
                      {searchQuery ? "Your search did not match any bhajans." : "No bhajans have been added yet."}
                  </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
=======
'use client';

import { useCollection } from '@/lib/data-manager';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Eye,
  Clock,
  FileText,
  Video,
  X,
  Share2,
  Calendar,
  Heart,
  Headphones,
} from 'lucide-react';
import { 
  getVideoId, 
  getValidatedVideoId,
  getThumbnailUrl as generateThumbnailUrl, 
  getEmbedUrl as generateEmbedUrl,
  getNextQuality,
  FALLBACK_THUMBNAIL_URL
} from '@/lib/youtube-utils';

interface Bhajan {
  id: string;
  title: string;
  lyrics?: string;
  youtube_url?: string;
  created_at: string;
}

export default function SatguruBhajanPage() {
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'with-lyrics'>('all');
  const collectionBhajans = useCollection<Bhajan>('satguru_bhajan');

  useEffect(() => {
    setBhajans(collectionBhajans);
  }, [collectionBhajans]);

  // Use centralized utility functions from youtube-utils.ts
  const embedUrl = (url: string) => {
    return generateEmbedUrl(url, { autoplay: 0 });
  };

  // Wrapper for thumbnail URL with quality parameter
  const getThumbnailUrl = (url: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'hqdefault') => {
    return generateThumbnailUrl(url, quality);
  };

  // Fallback thumbnail URL (your custom image)
  const getFallbackThumbnail = () => {
    return 'https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png';
  };

  // Complete fallback chain handler for thumbnails
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>, videoUrl: string) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // Extract current quality from URL
    let currentQuality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'default' = 'hqdefault';
    if (currentSrc.includes('maxresdefault')) currentQuality = 'maxresdefault';
    else if (currentSrc.includes('hqdefault')) currentQuality = 'hqdefault';
    else if (currentSrc.includes('mqdefault')) currentQuality = 'mqdefault';
    else if (currentSrc.includes('/default.')) currentQuality = 'default';
    
    // Try next quality
    const nextQuality = getNextQuality(currentQuality);
    if (nextQuality) {
      const nextUrl = generateThumbnailUrl(videoUrl, nextQuality);
      if (nextUrl) {
        img.src = nextUrl;
        return;
      }
    }
    
    // All qualities exhausted, use fallback
    img.src = getFallbackThumbnail();
  };

  const togglePlay = (bhajanId: string) => {
    if (currentPlaying === bhajanId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(bhajanId);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openBhajanModal = (bhajan: Bhajan) => {
    setSelectedBhajan(bhajan);
    setCurrentPlaying(bhajan.id);
  };

  const closeBhajanModal = () => {
    setSelectedBhajan(null);
    setCurrentPlaying(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const bhajansWithLyrics = bhajans.filter((b) => b.lyrics);
  const filteredBhajans = activeTab === 'with-lyrics' ? bhajansWithLyrics : bhajans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30">
              <Music className="h-8 w-8 text-white" />
            </div>
<h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-4xl">SATGURU BHAJAN</h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Devotional songs and bhajans to uplift your spirit and connect with the divine
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'with-lyrics')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Headphones className="h-4 w-4 mr-2" />
              All Bhajans ({bhajans.length})
            </TabsTrigger>
            <TabsTrigger
              value="with-lyrics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <FileText className="h-4 w-4 mr-2" />
              With Lyrics ({bhajansWithLyrics.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {bhajans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bhajans.map((bhajan) => (
                  <BhajanCard
                    key={bhajan.id}
                    bhajan={bhajan}
                    isPlaying={currentPlaying === bhajan.id}
                    onPlay={() => openBhajanModal(bhajan)}
                    onTogglePlay={() => togglePlay(bhajan.id)}
                    getThumbnailUrl={getThumbnailUrl}
                    handleThumbnailError={handleThumbnailError}
                    formatDate={formatDate}
                    embedUrl={embedUrl}
                    isMuted={isMuted}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="with-lyrics" className="mt-8">
            {filteredBhajans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBhajans.map((bhajan) => (
                  <BhajanCard
                    key={bhajan.id}
                    bhajan={bhajan}
                    isPlaying={currentPlaying === bhajan.id}
                    onPlay={() => openBhajanModal(bhajan)}
                    onTogglePlay={() => togglePlay(bhajan.id)}
                    getThumbnailUrl={getThumbnailUrl}
                    handleThumbnailError={handleThumbnailError}
                    formatDate={formatDate}
                    embedUrl={embedUrl}
                    isMuted={isMuted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-indigo-400/50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Bhajans with Lyrics</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Bhajans with lyrics will appear here when admin adds them.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Modal */}
      {selectedBhajan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeBhajanModal}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            <Card className="bg-black/50 backdrop-blur-lg border-white/10 overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedBhajan.youtube_url && embedUrl(selectedBhajan.youtube_url) ? (
                  <iframe
                    src={`${embedUrl(selectedBhajan.youtube_url)}&autoplay=1${isMuted ? '&mute=1' : ''}`}
                    title={selectedBhajan.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Music className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedBhajan.title}</h2>
                {selectedBhajan.lyrics && (
                  <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lyrics
                    </h3>
                    <p className="text-slate-300 whitespace-pre-line">{selectedBhajan.lyrics}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedBhajan.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBhajan.youtube_url || '');
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {selectedBhajan.youtube_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        asChild
                      >
                        <a
                          href={selectedBhajan.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
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
      )}
    </div>
  );
}

// Bhajan Card Component
function BhajanCard({
  bhajan,
  isPlaying,
  onPlay,
  onTogglePlay,
  getThumbnailUrl,
  handleThumbnailError,
  formatDate,
  embedUrl,
  isMuted,
}: {
  bhajan: Bhajan;
  isPlaying: boolean;
  onPlay: () => void;
  onTogglePlay: () => void;
  getThumbnailUrl: (url: string, quality?: 'maxresdefault' | 'hqdefault' | 'mqdefault') => string | null;
  handleThumbnailError: (e: React.SyntheticEvent<HTMLImageElement>, videoUrl: string) => void;
  formatDate: (dateString: string) => string;
  embedUrl: (url: string) => string | null;
  isMuted: boolean;
}) {
  // Debug: Log video ID extraction (use validated ID)
  const videoId = bhajan.youtube_url ? getValidatedVideoId(bhajan.youtube_url) : null;
  const thumbUrl = bhajan.youtube_url ? getThumbnailUrl(bhajan.youtube_url) : null;
  console.log('[Satguru Bhajan] Video:', bhajan.title, '| ID:', videoId, '| Thumb:', thumbUrl);

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden group cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-black overflow-hidden">
        {bhajan.youtube_url && videoId ? (
          <>
            <img
              src={thumbUrl || ''}
              alt={bhajan.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => handleThumbnailError(e, bhajan.youtube_url!)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-indigo-900/40">
            <Music className="h-16 w-16 text-white/30" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Play className="h-6 w-6 text-black ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-purple-500/90 text-white text-xs">
            <Music className="h-3 w-3 mr-1" />
            BHAJAN
          </Badge>
          {bhajan.lyrics && (
            <Badge className="bg-indigo-500/90 text-white text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Lyrics
            </Badge>
          )}
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-purple-400 animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-purple-400 animate-pulse rounded-full delay-75" />
                <span className="w-1 h-2 bg-purple-400 animate-pulse rounded-full delay-150" />
              </span>
              <span className="ml-1">Playing</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{bhajan.title}</h3>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(bhajan.created_at)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {bhajan.youtube_url && (
              <a
                href={bhajan.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/40 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4 text-blue-300" />
              </a>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/40 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-purple-300" />
              ) : (
                <Play className="h-4 w-4 text-purple-300" />
              )}
            </button>
          </div>
        </div>

        {/* Lyrics Preview */}
        {bhajan.lyrics && (
          <div className="mt-3 bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-300 line-clamp-2">{bhajan.lyrics}</p>
          </div>
        )}
      </CardContent>

      {/* Embedded Player */}
      {isPlaying && bhajan.youtube_url && embedUrl(bhajan.youtube_url) && (
        <div className="border-t border-white/10">
          <div className="aspect-video bg-black">
            <iframe
              src={`${embedUrl(bhajan.youtube_url)}&autoplay=1${isMuted ? '&mute=1' : ''}`}
              title={bhajan.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </Card>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Music className="h-12 w-12 text-purple-400/50" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">No Bhajans Available</h2>
      <p className="text-slate-400 max-w-md mx-auto">
        Devotional songs will appear here when admin adds them.
      </p>
    </div>
  );
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
