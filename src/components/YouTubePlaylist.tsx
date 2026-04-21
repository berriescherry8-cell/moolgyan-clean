import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Youtube, Play } from 'lucide-react';
import { getYouTubePlaylist, type YouTubeVideo } from '@/lib/youtube';
=======
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Youtube } from 'lucide-react';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import { getYouTubePlaylist, type YouTubeVideo } from '@/lib/youtube';
import { getEmbedUrl } from '@/lib/youtube-utils';
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
import { useLocale } from '@/lib/i18n';

interface YouTubePlaylistProps {
  playlistId?: string;
}

export default function YouTubePlaylist({ playlistId }: YouTubePlaylistProps) {
  const { t } = useLocale();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const playlist = playlistId || process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID || 'PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-';
  
  // Validate playlist ID
  if (!playlist || playlist === 'YOUR_PLAYLIST_ID') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t.satsang_videos}</h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t.search_videos}
              className="w-64"
              disabled
            />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Youtube className="h-5 w-5" />
            <span>YouTube playlist ID is not configured. Please set NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID in your environment variables.</span>
          </div>
        </div>
      </div>
    );
  }
=======
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const playlist = playlistId || 'PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-';
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const playlistVideos = await getYouTubePlaylist(playlist);
        setVideos(playlistVideos);
        setFilteredVideos(playlistVideos);
        setError(null);
      } catch (err) {
        console.error('Error fetching YouTube playlist:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlist]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
<<<<<<< HEAD
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
=======
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

<<<<<<< HEAD
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
=======
  // Removed modal logic - VideoCard handles inline player
  const handleVideoSelect = (video: YouTubeVideo) => {
    // Optional: Global select for playlist navigation
    console.log('Video selected:', video.title);
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
<<<<<<< HEAD
          <h2 className="text-2xl font-bold">{t.satsang_videos}</h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t.search_videos}
              className="w-64"
=======
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {t('satsang_videos') || 'Satsang Videos'}
          </h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t('search_videos') || 'Search videos...'}
              value=""
              className="w-64 bg-white/5 backdrop-blur border-white/20"
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
              disabled
            />
          </div>
        </div>
<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
=======
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-white/5 rounded-2xl p-6 h-[400px]">
              <div className="aspect-video bg-white/10 rounded-xl mb-4"></div>
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
<<<<<<< HEAD
          <h2 className="text-2xl font-bold">{t.satsang_videos}</h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t.search_videos}
              className="w-64"
=======
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {t('satsang_videos') || 'Satsang Videos'}
          </h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t('search_videos') || 'Search videos...'}
              value=""
              className="w-64 bg-white/5 backdrop-blur border-white/20"
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
              disabled
            />
          </div>
        </div>
<<<<<<< HEAD
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <Youtube className="h-5 w-5" />
            <span>{error}</span>
          </div>
=======
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <Youtube className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
          <p className="text-slate-400">Check your connection and try refreshing.</p>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.satsang_videos}</h2>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t.search_videos}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
=======
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-purple-100 to-slate-200 bg-clip-text text-transparent flex items-center gap-3">
          Satsang Videos
          <span className="text-2xl text-purple-400 font-normal">({filteredVideos.length})</span>
        </h2>
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <Input
            placeholder={t('search_videos') || 'Search satsang videos...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-72 bg-white/5 backdrop-blur-lg border-white/20 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
          />
        </div>
      </div>

<<<<<<< HEAD
      {selectedVideo && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <Card 
            key={video.videoId} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleVideoSelect(video.videoId)}
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPublishedDate(video.publishedAt)}
              </p>
            </CardHeader>
          </Card>
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard 
            key={video.videoId} 
            video={video}
            title={video.title}
            onVideoSelect={handleVideoSelect}
          />
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        ))}
      </div>

      {filteredVideos.length === 0 && searchTerm && (
<<<<<<< HEAD
        <div className="text-center py-8 text-muted-foreground">
          {t.no_videos_found}
        </div>
      )}
    </div>
  );
}
=======
        <div className="text-center py-24 bg-white/3 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
          <Youtube className="h-24 w-24 text-slate-500 mx-auto mb-8 opacity-50" />
          <h3 className="text-3xl font-bold text-white mb-4">No Videos Found</h3>
          <p className="text-xl text-slate-400 max-w-lg mx-auto mb-8">Try different search terms or clear the search to see all satsang videos</p>
          <Button 
            onClick={() => setSearchTerm('')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Inline player now handled in VideoCard - Modal removed */}
    </div>
  );
}

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
