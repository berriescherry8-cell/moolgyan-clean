import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Youtube } from 'lucide-react';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import { getYouTubePlaylist, type YouTubeVideo } from '@/lib/youtube';
import { getEmbedUrl } from '@/lib/youtube-utils';
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
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const playlist = playlistId || 'PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-';

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
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  // Removed modal logic - VideoCard handles inline player
  const handleVideoSelect = (video: YouTubeVideo) => {
    // Optional: Global select for playlist navigation
    console.log('Video selected:', video.title);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {t('satsang_videos') || 'Satsang Videos'}
          </h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t('search_videos') || 'Search videos...'}
              value=""
              className="w-64 bg-white/5 backdrop-blur border-white/20"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-white/5 rounded-2xl p-6 h-[400px]">
              <div className="aspect-video bg-white/10 rounded-xl mb-4"></div>
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {t('satsang_videos') || 'Satsang Videos'}
          </h2>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t('search_videos') || 'Search videos...'}
              value=""
              className="w-64 bg-white/5 backdrop-blur border-white/20"
              disabled
            />
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <Youtube className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
          <p className="text-slate-400">Check your connection and try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard 
            key={video.videoId} 
            video={video}
            title={video.title}
            onVideoSelect={handleVideoSelect}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && searchTerm && (
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

