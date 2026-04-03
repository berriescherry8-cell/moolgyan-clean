
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Loader2, AlertCircle, Search, Wifi, VideoIcon, Play, Star } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { useCollection } from '@/lib/data-manager';
import type { SatsangVideo } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from '@/components/VideoPlayer';
import ChannelSubscribe from '@/components/ChannelSubscribe';

function SatsangVideoCard({ video }: { video: SatsangVideo }) {
    return (
      <Card className="overflow-hidden group transition-shadow hover:shadow-xl flex flex-col">
        <VideoPlayer video={video} />
        <CardContent className="p-3 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {video.isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                <Play className="h-3 w-3" />
                Live
              </span>
            )}
            {video.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3">{video.description || ''}</p>
        </CardContent>
      </Card>
    );
}

export default function LiveSatsangPage() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'live' | 'general'>('live');
  
  // Get videos from both collections
  const liveVideos = useCollection<SatsangVideo>('live_satsang_videos');
  const generalVideos = useCollection<SatsangVideo>('satsangVideos');
  
  // Filter videos based on active tab
  const liveSatsangVideos = useMemo(() => {
    if (!liveVideos) return [];
    return liveVideos.filter(v => v.isLive);
  }, [liveVideos]);
  
  const generalSatsangVideos = useMemo(() => {
    if (!generalVideos) return [];
    // Include all videos from satsangVideos collection that are NOT featured
    // This includes regular videos and videos that are not marked as featured
    return generalVideos.filter(v => !v.isFeatured);
  }, [generalVideos]);

  // Filter videos based on search and active tab
  const filteredVideos = useMemo(() => {
    const videos = activeTab === 'live' ? liveSatsangVideos : generalSatsangVideos;
    return videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [liveSatsangVideos, generalSatsangVideos, activeTab, searchQuery]);

  // Get featured video (for live section)
  const featuredVideo = useMemo(() => {
    if (activeTab === 'live' && liveVideos) {
      return liveVideos.find(v => v.isFeatured);
    } else if (activeTab === 'general' && generalVideos) {
      return generalVideos.find(v => v.isFeatured);
    }
    return null;
  }, [liveVideos, generalVideos, activeTab]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 font-headline">{t.nav_live_satsang}</h1>
      
      <ChannelSubscribe />
      
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b">
          <Button
            variant={activeTab === 'live' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-2"
          >
            <Wifi className="h-4 w-4" />
            Live Satsang
            {liveSatsangVideos.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {liveSatsangVideos.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'general' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('general')}
            className="flex items-center gap-2"
          >
            <VideoIcon className="h-4 w-4" />
            General Videos
            {generalSatsangVideos.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {generalSatsangVideos.length}
              </span>
            )}
          </Button>
        </div>

        {/* Featured Video Section */}
        {featuredVideo ? (
            <div className="space-y-4">
                <Alert>
                    <Wifi className="h-4 w-4" />
                    <AlertTitle>{activeTab === 'live' ? 'Live Satsang' : 'Featured Video'}!</AlertTitle>
                    <AlertDescription>
                        Watch the currently featured: <strong>{featuredVideo.title}</strong>
                    </AlertDescription>
                </Alert>
                <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
                    <VideoPlayer video={featuredVideo} />
                </div>
            </div>
        ) : (
            <Alert variant="secondary">
              <Wifi className="h-4 w-4" />
              <AlertTitle>No Featured Video</AlertTitle>
              <AlertDescription>
                There is no featured video at this moment. Check the list below for all available videos.
              </AlertDescription>
            </Alert>
        )}
        
        {/* Search and Video Grid */}
        <div>
          <div className="relative mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
              placeholder={`Search ${activeTab === 'live' ? 'live' : 'general'} videos...`}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {filteredVideos.map((video) => (
                    <SatsangVideoCard key={video.id} video={video} />
                ))}
            </div>
          ): (
             <div className="text-center py-16">
                <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-2xl font-semibold">No Videos Found</h3>
                <p className="text-muted-foreground mt-2">
                    {searchQuery ? "Your search did not match any videos." : 
                     activeTab === 'live' ? "No live satsang videos available." : "No general videos available."}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
