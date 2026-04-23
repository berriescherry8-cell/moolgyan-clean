'use client';

import { useCollection } from '@/lib/data-manager';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Video,
  AlertCircle,
  RefreshCw,
  Play,
  Archive,
  Eye,
  Clock,
  Calendar,
  X,
  ChevronRight,
  Sparkles,
  Radio,
  Heart,
  Star,
} from 'lucide-react';
import { 
  getEmbedUrl as generateEmbedUrl,
  getThumbnailUrl as generateThumbnailUrl,
  getNextQuality,
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
  const [selectedVideo, setSelectedVideo] = useState<LiveVideo | null>(null);
  const collectionLiveVideos = useCollection<LiveVideo>('live_satsangs');

  useEffect(() => {
    const liveOnly = collectionLiveVideos.filter((v) => v.is_live);
    const archiveOnly = collectionLiveVideos.filter((v) => !v.is_live);
    setLiveVideos(liveOnly);
    setArchiveVideos(archiveOnly);
  }, [collectionLiveVideos]);

  const embedUrl = (url: string) => {
    return generateEmbedUrl(url, { autoplay: 1 });
  };

  const getThumbnailUrl = (url: string, quality = 'hqdefault') => {
    return generateThumbnailUrl(url, quality);
  };

  const getFallbackThumbnail = () => {
    return 'https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png';
  };

  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>, videoUrl: string) => {
    const img = e.currentTarget;
    let currentQuality = 'hqdefault';
    if (img.src.includes('maxresdefault')) currentQuality = 'maxresdefault';
    else if (img.src.includes('hqdefault')) currentQuality = 'hqdefault';
    else if (img.src.includes('mqdefault')) currentQuality = 'mqdefault';
    else if (img.src.includes('/default.')) currentQuality = 'default';
    
    const nextQuality = getNextQuality(currentQuality as any);
    if (nextQuality) {
      const nextUrl = generateThumbnailUrl(videoUrl, nextQuality);
      if (nextUrl) {
        img.src = nextUrl;
        return;
      }
    }
    
    img.src = getFallbackThumbnail();
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const openVideoModal = (video: LiveVideo) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-gold-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background - OLD DESIGN */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gold-400 to-orange-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Bookstore Style Header - Orange & Black Pattern */}
        <div className="text-center space-y-12 pt-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl shadow-3xl shadow-orange-500/50">
              <Radio className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent drop-shadow-4xl mb-4">
                LIVE SATSANG
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-orange-400 animate-pulse" />
                <p className="text-amber-300 font-medium text-lg">Spiritual Broadcasts</p>
                <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Experience divine presence through live spiritual discourses and explore complete archive of sacred teachings from Sadguru Nitin Sahib
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-white backdrop-blur-sm mb-8">
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

        {/* LIVE VIDEOS SECTION - TOP */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold text-white">Live Now</h2>
              <Badge className="bg-red-500 text-white px-3 py-1">
                {liveVideos.length} Live
              </Badge>
            </div>
          </div>

          {liveVideos.length > 0 ? (
            <div className="space-y-8">
              {/* Featured Live Video */}
              <Card className="bg-black/60 backdrop-blur-xl border border-gold-500/30 overflow-hidden shadow-2xl shadow-gold-500/20">
                <div className="relative aspect-video bg-gradient-to-br from-black/80 to-slate-900/50">
                  {embedUrl(liveVideos[0].youtube_url) ? (
                    <iframe
                      src={embedUrl(liveVideos[0].youtube_url)!}
                      title={liveVideos[0].title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      onLoad={() => console.log('YouTube video loaded successfully')}
                      onError={() => {
                        console.error('YouTube embed error, trying fallback');
                        setError('YouTube video could not be loaded. The video may be private or restricted.');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-400">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-xl">Invalid YouTube URL</p>
                        <p className="text-sm mt-2 text-slate-400">Please check the video URL</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Live Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="font-bold">LIVE</span>
                    </div>
                  </div>

                  {/* Viewers Count */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gold-400" />
                      <span className="text-white text-sm">Watching</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ color: '#fbbf24' }}>
                    {liveVideos[0].title}
                  </h3>
                  {liveVideos[0].description && (
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {liveVideos[0].description}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold-400" />
                      {formatDate(liveVideos[0].created_at)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold-400" />
                      Live Now
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Live Videos Grid */}
              {liveVideos.length > 1 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">More Live Streams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveVideos.slice(1).map((video) => (
                      <Card
                        key={video.id}
                        className="bg-black/60 backdrop-blur-xl border border-gold-500/30 overflow-hidden group cursor-pointer hover:border-gold-400/60 transition-all duration-300 hover:scale-105"
                        onClick={() => openVideoModal(video)}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={getThumbnailUrl(video.youtube_url)}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => handleThumbnailError(e, video.youtube_url)}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              LIVE
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2 line-clamp-2" style={{ color: '#fbbf24' }}>
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {formatDate(video.created_at)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/40 backdrop-blur-xl rounded-2xl border border-gold-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Radio className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Live Streams</h3>
              <p className="text-slate-400 mb-8">
                Live satsangs will appear here when scheduled. Check back soon or explore our archive below.
              </p>
              <div className="flex items-center justify-center gap-2 text-gold-400 animate-bounce">
                <ChevronRight className="h-5 w-5" />
                <span className="text-sm">Scroll down to explore archive</span>
              </div>
            </div>
          )}
        </div>

        {/* ARCHIVE SECTION */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Archive className="h-6 w-6 text-gold-400" />
              <h2 className="text-3xl font-bold text-white">Complete Archive</h2>
              <Badge className="bg-gold-500/20 text-gold-300 border border-gold-500/30 px-3 py-1">
                {archiveVideos.length} Videos
              </Badge>
            </div>
          </div>

          {archiveVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archiveVideos.map((video) => (
                <Card
                  key={video.id}
                  className="bg-black/60 backdrop-blur-xl border border-gold-500/30 overflow-hidden group cursor-pointer hover:border-gold-400/60 transition-all duration-300 hover:scale-105"
                  onClick={() => openVideoModal(video)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={getThumbnailUrl(video.youtube_url)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => handleThumbnailError(e, video.youtube_url)}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-black ml-1" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {Math.floor(Math.random() * 60) + 20}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-white mb-2 line-clamp-2 text-sm" style={{ color: '#fbbf24' }}>
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(video.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {Math.floor(Math.random() * 1000) + 100}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/40 backdrop-blur-xl rounded-2xl border border-gold-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Archive className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Archive Coming Soon</h3>
              <p className="text-slate-400">
                Our archive of past satsangs will be available here soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gold-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {embedUrl(selectedVideo.youtube_url) ? (
                <iframe
                  src={embedUrl(selectedVideo.youtube_url, { autoplay: 1 })!}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  onLoad={() => console.log('Modal YouTube video loaded successfully')}
                  onError={() => console.error('Modal YouTube embed error')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gold-400">
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl">Unable to load video</p>
                    <p className="text-sm mt-2 text-slate-400">Invalid YouTube URL</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-2" style={{ color: '#fbbf24' }}>
                {selectedVideo.title}
              </h3>
              {selectedVideo.description && (
                <p className="text-slate-300">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

