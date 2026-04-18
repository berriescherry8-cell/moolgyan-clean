'use client';

import { useCollection } from '@/lib/data-manager';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Video,
  AlertCircle,
  RefreshCw,
  Play,
  Archive,
  Eye,
  Clock,
  Calendar,
  Maximize,
  Share2,
  Radio,
  Film,
  X,
  ChevronRight,
  Sparkles,
  Youtube,
  Loader2,
} from 'lucide-react';
import { 
  getVideoId as extractVideoIdFromUrl, 
  getThumbnailUrl as generateThumbnailUrl, 
  getEmbedUrl as generateEmbedUrl,
  getNextQuality,
  FALLBACK_THUMBNAIL_URL
} from '@/lib/youtube-utils';

interface LiveVideo {
  id: string;
  youtube_url: string;
  title: string;
  description?: string;
  is_live: boolean;
  created_at: string;
  thumbnail_url?: string;
  view_count?: number;
  duration?: string;
}

export default function LiveSatsangPage() {
  const [liveVideos, setLiveVideos] = useState<LiveVideo[]>([]);
  const [archiveVideos, setArchiveVideos] = useState<LiveVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LiveVideo | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Get all live satsangs from database
  const collectionLiveVideos = useCollection<LiveVideo>('live_satsangs');

  useEffect(() => {
    console.log('=== LIVE SATSANG DEBUG ===');
    console.log('Raw collection data:', collectionLiveVideos);
    console.log('Collection length:', collectionLiveVideos?.length || 0);
    
    if (collectionLiveVideos && collectionLiveVideos.length > 0) {
      // Debug each video
      collectionLiveVideos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, {
          id: video.id,
          title: video.title,
          is_live: video.is_live,
          youtube_url: video.youtube_url,
          created_at: video.created_at
        });
      });
      
      const liveOnly = collectionLiveVideos.filter((v) => v.is_live === true);
      const archiveOnly = collectionLiveVideos.filter((v) => v.is_live === false);
      
      console.log('Live videos filtered:', liveOnly.length, liveOnly);
      console.log('Archive videos filtered:', archiveOnly.length, archiveOnly);
      
      setLiveVideos(liveOnly);
      setArchiveVideos(archiveOnly);
      setDebugInfo({
        total: collectionLiveVideos.length,
        live: liveOnly.length,
        archive: archiveOnly.length
      });
    } else {
      console.log('No videos found in collection');
      setDebugInfo({ total: 0, live: 0, archive: 0 });
    }
    
    setLoading(false);
  }, [collectionLiveVideos]);

  // Use centralized utility functions
  const embedUrl = (url: string) => {
    return generateEmbedUrl(url, { autoplay: 1 });
  };

  // Wrapper for thumbnail URL with quality parameter
  const getThumbnailUrl = (url: string, quality = 'hqdefault') => {
    return generateThumbnailUrl(url, quality);
  };

  // Fallback thumbnail for broken YouTube thumbnails
  const getFallbackThumbnail = () => {
    return 'https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png';
  };

  // Complete fallback chain handler for thumbnails
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>, videoUrl: string) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // Extract current quality from URL
    let currentQuality = 'hqdefault';
    if (currentSrc.includes('maxresdefault')) currentQuality = 'maxresdefault';
    else if (currentSrc.includes('hqdefault')) currentQuality = 'hqdefault';
    else if (currentSrc.includes('mqdefault')) currentQuality = 'mqdefault';
    else if (currentSrc.includes('/default.')) currentQuality = 'default';
    
    // Try next quality
    const nextQuality = getNextQuality(currentQuality as any);
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

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const openVideoModal = (video: LiveVideo) => {
    setSelectedVideo(video);
    setCurrentPlaying(video.id);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setCurrentPlaying(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    return duration;
  };

  // Enhanced Video Card Component with better debugging
  const VideoCard = ({ video, isLive = false }: { video: LiveVideo; isLive?: boolean }) => {
    console.log('Rendering VideoCard:', { title: video.title, isLive, youtube_url: video.youtube_url });
    
    return (
      <Card
        key={video.id}
        className="bg-white/10 backdrop-blur-xl border-gold-400/40 overflow-hidden group cursor-pointer hover:border-gold-500/70 hover:shadow-2xl hover:shadow-gold-500/30 transition-all duration-300 glow-pulse"
        onClick={() => openVideoModal(video)}
      >
        <div className="relative aspect-video bg-gradient-to-br from-black/80 to-slate-900/50">
          <img
            src={getThumbnailUrl(video.youtube_url)}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => handleThumbnailError(e, video.youtube_url)}
            onLoad={() => console.log('Thumbnail loaded for:', video.title)}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>
          {isLive && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-gradient-to-r from-gold-500 to-orange-500 text-white animate-pulse px-3 py-1 text-xs font-bold">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                LIVE
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
          {video.description && (
            <p className="text-slate-300 text-sm mb-3 line-clamp-2">{video.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(video.created_at)}
            </span>
            {video.view_count && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {video.view_count.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-gold-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gold-400 to-orange-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Enhanced Hero Header - Satsang Style */}
        <div className="text-center space-y-12 pt-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-gold-500 to-orange-500 rounded-3xl shadow-3xl shadow-gold-500/50 divine-rays">
              <Video className="h-16 w-16 text-white drop-shadow-lg" />
              <Radio className="h-8 w-8 text-white -mt-2 absolute animate-pulse" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gold-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-4xl mb-4">
                LIVE SATSANG
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-gold-400 animate-pulse" />
                <p className="text-gold-300 font-medium text-lg">Spiritual Broadcasts</p>
                <Sparkles className="h-8 w-8 text-orange-400 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Join live satsang sessions and access complete archive of spiritual teachings from Sadguru Nitin Sahib. Experience divine connection instantly.
          </p>
        </div>

        {/* Debug Info Panel */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="bg-black/50 border border-gold-500/30 rounded-xl p-4 text-white backdrop-blur-sm">
            <h3 className="text-gold-400 font-semibold mb-2">Debug Info:</h3>
            <div className="text-sm space-y-1">
              <p>Total Videos: {debugInfo.total}</p>
              <p>Live Videos: {debugInfo.live}</p>
              <p>Archive Videos: {debugInfo.archive}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-white backdrop-blur-sm animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="font-semibold">Connection Error</span>
            </div>
            <p className="text-sm text-red-200/80">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 flex items-center gap-2 text-sm bg-gold-500/20 hover:bg-gold-500/30 px-4 py-2 rounded-lg border border-gold-500/30 text-gold-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4 animate-spin" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Main Content with Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'live' | 'archive')}
          className="w-full animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 bg-white/5 backdrop-blur-lg border border-gold-500/30 p-2 rounded-2xl shadow-xl shadow-gold-500/20">
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-gold-500/50 rounded-xl transition-all group data-[state=active]:glow-pulse"
            >
              <Radio className="h-5 w-5 mr-2 group-data-[state=active]:text-gold-300" />
              Live Now ({liveVideos.length})
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white data-[state=active]:shadow-orange-500/50 rounded-xl transition-all group data-[state=active]:glow-pulse"
            >
              <Archive className="h-5 w-5 mr-2 group-data-[state=active]:text-orange-300" />
              Archive ({archiveVideos.length})
            </TabsTrigger>
          </TabsList>

          {/* Live Videos Tab */}
          <TabsContent value="live" className="mt-12">
            {loading ? (
              <div className="text-center py-32">
                <Loader2 className="h-12 w-12 text-gold-400 animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Loading live satsangs...</p>
              </div>
            ) : liveVideos.length > 0 ? (
              <>
                {/* Featured Live Video */}
                <Card className="bg-white/5 backdrop-blur-xl border-gold-400/30 overflow-hidden shadow-2xl shadow-gold-500/20 glow-pulse mb-8">
                  <div className="relative aspect-video bg-gradient-to-br from-black/80 to-slate-900/50">
                    {embedUrl(liveVideos[0].youtube_url) ? (
                      <iframe
                        src={embedUrl(liveVideos[0].youtube_url)!}
                        title={liveVideos[0].title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        allowFullScreen
                        onError={() => setError('YouTube refused to connect. Please try again later.')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold-400">
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-lg">Preparing Live Stream</p>
                        </div>
                      </div>
                    )}
                    {/* Live Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-gold-500 to-orange-500 text-white animate-pulse px-4 py-2 text-sm font-bold shadow-lg shadow-gold-500/50">
                        <Radio className="h-4 w-4 mr-2 animate-pulse" />
                        LIVE NOW
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-gold-400 to-orange-400 bg-clip-text">{liveVideos[0].title}</h2>
                    {liveVideos[0].description && (
                      <p className="text-slate-300 mb-6 leading-relaxed">{liveVideos[0].description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gold-400" />
                        Live - {formatDate(liveVideos[0].created_at)}
                      </span>
                      {liveVideos[0].view_count && (
                        <span className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-gold-400" />
                          {liveVideos[0].view_count.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Live Videos */}
                {liveVideos.length > 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Video className="h-7 w-7 text-gold-400" />
                      Additional Live Streams
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {liveVideos.slice(1).map((video) => (
                        <VideoCard key={video.id} video={video} isLive />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white/3 backdrop-blur-xl rounded-3xl border border-gold-500/20 p-12">
                <div className="bg-gradient-to-br from-gold-500/30 to-orange-500/30 w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <Radio className="h-12 w-12 text-gold-400 animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-gold-400 to-orange-400 bg-clip-text">
                  No Live Broadcast
                </h2>
                <p className="text-xl text-slate-400 max-w-lg mx-auto mb-10">
                  Live satsangs will appear here when scheduled. Check back soon or explore the archive.
                </p>
                <Button
                  onClick={() => setActiveTab('archive')}
                  className="bg-gradient-to-r from-gold-500 to-orange-500 hover:from-gold-600 hover:to-orange-600 text-white shadow-lg shadow-gold-500/25 text-lg px-8 py-6 rounded-2xl"
                >
                  Explore Archive
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Archive Tab - Completely Redesigned */}
          <TabsContent value="archive" className="mt-12">
            {loading ? (
              <div className="text-center py-32">
                <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Loading archive...</p>
              </div>
            ) : archiveVideos.length > 0 ? (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Archive className="h-8 w-8" />
                    Complete Archive
                  </h3>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-lg">
                    {archiveVideos.length} Sessions
                  </Badge>
                </div>

                {/* Debug: Show first few archive videos */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-black/30 border border-orange-500/30 rounded-xl p-4 text-white">
                    <h4 className="text-orange-400 font-semibold mb-2">Archive Videos Debug:</h4>
                    <div className="text-sm space-y-2">
                      {archiveVideos.slice(0, 3).map((video, index) => (
                        <div key={video.id} className="p-2 bg-black/20 rounded">
                          <p className="text-orange-300">{index + 1}. {video.title}</p>
                          <p className="text-slate-400 text-xs">URL: {video.youtube_url}</p>
                          <p className="text-slate-400 text-xs">is_live: {video.is_live}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archive Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {archiveVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-white/3 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-12">
                <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <Archive className="h-12 w-12 text-orange-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text">
                  No Archive Yet
                </h2>
                <p className="text-xl text-slate-400 max-w-lg mx-auto mb-10">
                  Archived satsangs will appear here. Live sessions automatically move to archive when ended.
                </p>
                <Button
                  onClick={() => setActiveTab('live')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 text-lg px-8 py-6 rounded-2xl"
                >
                  Check Live Streams
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeVideoModal}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="aspect-video">
              <iframe
                src={embedUrl(selectedVideo.youtube_url)!}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
            {selectedVideo.description && (
              <div className="p-4 border-t border-slate-700">
                <p className="text-slate-300">{selectedVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
