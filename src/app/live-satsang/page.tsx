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
} from 'lucide-react';
import { 
  getVideoId as extractVideoIdFromUrl, 
  getThumbnailUrl as generateThumbnailUrl, 
  getEmbedUrl as generateEmbedUrl,
  getThumbnails,
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
}



export default function LiveSatsangPage() {
  const [liveVideos, setLiveVideos] = useState<LiveVideo[]>([]);
  const [archiveVideos, setArchiveVideos] = useState<LiveVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LiveVideo | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live');
  const collectionLiveVideos = useCollection<LiveVideo>('live_satsangs');

  useEffect(() => {
    const liveOnly = collectionLiveVideos.filter((v) => v.is_live);
    const archiveOnly = collectionLiveVideos.filter((v) => !v.is_live);
    setLiveVideos(liveOnly);
    setArchiveVideos(archiveOnly);
  }, [collectionLiveVideos]);



  // Use centralized utility functions
  const embedUrl = (url: string) => {
    return generateEmbedUrl(url, { autoplay: 1 });
  };

  // Wrapper for thumbnail URL with quality parameter
  const getThumbnailUrl = (url: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'maxresdefault') => {
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

  // Debug function to log extracted video IDs
  const debugVideoId = (url: string) => {
    const videoId = extractVideoIdFromUrl(url);
    console.log('[Live Satsang] Video URL:', url);
    console.log('[Live Satsang] Extracted Video ID:', videoId);
    return videoId;
  };

  const playlistEmbed = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/playlist') {
          const playlistId = urlObj.searchParams.get('list');
          return playlistId ? `https://www.youtube.com/embed/videoseries?list=${playlistId}` : null;
        } else if (urlObj.pathname.includes('/embed/')) {
          return url.replace('embed/', 'embed/videoseries?list=');
        }
      }
    } catch (e) {
      console.error('Invalid playlist URL:', url, e);
    }
    return null;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg shadow-red-500/30">
              <Radio className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Live Satsang</h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join live spiritual gatherings and access archived satsangs for your spiritual journey
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-white backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="font-semibold">Connection Error</span>
            </div>
            <p className="text-sm text-red-200/80">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 flex items-center gap-2 text-sm bg-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Main Content with Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'live' | 'archive')}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Radio className="h-4 w-4 mr-2" />
              Live Now ({liveVideos.length})
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive ({archiveVideos.length})
            </TabsTrigger>
          </TabsList>

          {/* Live Videos Tab */}
          <TabsContent value="live" className="mt-8 space-y-8">
            {liveVideos.length > 0 ? (
              <>
                {/* Featured Live Video */}
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    {embedUrl(liveVideos[0].youtube_url) ? (
                      <iframe
                        src={embedUrl(liveVideos[0].youtube_url)!}
                        title={liveVideos[0].title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onError={() => setError('YouTube refused to connect. Please try again later.')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-2" />
                          <p>Invalid YouTube URL</p>
                        </div>
                      </div>
                    )}
                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge className="bg-red-500 text-white animate-pulse px-4 py-1.5 text-sm font-semibold">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE NOW
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{liveVideos[0].title}</h2>
                    {liveVideos[0].description && (
                      <p className="text-slate-400 mb-4">{liveVideos[0].description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(liveVideos[0].created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Live Videos Grid */}
                {liveVideos.length > 1 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-400" />
                      More Live Streams
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {liveVideos.slice(1).map((video) => {
                        // Debug: Log video ID extraction
                        const videoId = extractVideoIdFromUrl(video.youtube_url);
                        const thumbUrl = getThumbnailUrl(video.youtube_url, 'hqdefault');
                        console.log('[Live Satsang] Video:', video.title, '| ID:', videoId, '| Thumb:', thumbUrl);
                        
                        return (
                          <Card
                            key={video.id}
                            className="bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden group cursor-pointer hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                            onClick={() => openVideoModal(video)}
                          >
                            <div className="relative aspect-video bg-black overflow-hidden">
                              {thumbUrl ? (
                                <>
                                  <img
                                    src={thumbUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => handleThumbnailError(e, video.youtube_url)}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/40 to-purple-900/40">
                                  <Video className="h-12 w-12 text-white/30" />
                                </div>
                              )}

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Play className="h-6 w-6 text-black ml-1" />
                              </div>
                            </div>

                            {/* Live Badge */}
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs">
                              <Radio className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>

                            {/* Duration Badge */}
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Maximize className="h-3 w-3" />
                              Watch
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-white line-clamp-2 mb-2">{video.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(video.created_at)}
                              </span>
                            </div>
                          </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Radio className="h-12 w-12 text-red-400/50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Live Satsang Right Now</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Live satsangs will appear here when they are scheduled. Check back later or browse the archive.
                </p>
                <Button
                  onClick={() => setActiveTab('archive')}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  Browse Archive
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Archive Videos Tab */}
          <TabsContent value="archive" className="mt-8">
            {archiveVideos.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Archive className="h-6 w-6 text-purple-400" />
                    Archived Satsangs
                  </h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                    {archiveVideos.length} Videos
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archiveVideos.map((video) => {
                    // Debug: Log video ID extraction
                    const videoId = extractVideoIdFromUrl(video.youtube_url);
                    const thumbUrl = getThumbnailUrl(video.youtube_url, 'hqdefault');
                    console.log('[Live Satsang Archive] Video:', video.title, '| ID:', videoId, '| Thumb:', thumbUrl);
                    
                    return (
                      <Card
                        key={video.id}
                        className="bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden group cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        onClick={() => openVideoModal(video)}
                      >
                        <div className="relative aspect-video bg-black overflow-hidden">
                          {thumbUrl ? (
                            <>
                              <img
                                src={thumbUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => handleThumbnailError(e, video.youtube_url)}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-indigo-900/40">
                              <Video className="h-12 w-12 text-white/30" />
                            </div>
                          )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Play className="h-6 w-6 text-black ml-1" />
                          </div>
                        </div>

                        {/* Archive Badge */}
                        <Badge className="absolute top-3 left-3 bg-purple-500/90 text-white text-xs">
                          <Archive className="h-3 w-3 mr-1" />
                          ARCHIVE
                        </Badge>

                        {/* Info Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Click to Play
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h4 className="font-semibold text-white text-lg line-clamp-2 mb-2">{video.title}</h4>
                        {video.description && (
                          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{video.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(video.created_at)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Archive className="h-12 w-12 text-purple-400/50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Archived Videos</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Archived satsangs will appear here once live sessions end.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            <Card className="bg-black/50 backdrop-blur-lg border-white/10 overflow-hidden">
              <div className="aspect-video bg-black">
                {embedUrl(selectedVideo.youtube_url) ? (
                  <iframe
                    src={`${embedUrl(selectedVideo.youtube_url)}&autoplay=1`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Video className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                {selectedVideo.description && (
                  <p className="text-slate-400 mb-4">{selectedVideo.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedVideo.created_at)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedVideo.youtube_url);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}