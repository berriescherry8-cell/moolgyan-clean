import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Youtube, Play } from 'lucide-react';
import { getYouTubePlaylist, type YouTubeVideo } from '@/lib/youtube';
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
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

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
  };

  if (loading) {
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
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <Youtube className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          />
        </div>
      </div>

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
        ))}
      </div>

      {filteredVideos.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          {t.no_videos_found}
        </div>
      )}
    </div>
  );
}