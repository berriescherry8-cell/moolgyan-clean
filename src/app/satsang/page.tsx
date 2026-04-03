
'use client';

import { useLocale } from '@/lib/i18n';
import { useCollection } from '@/lib/data-manager';
import ChannelSubscribe from '@/components/ChannelSubscribe';
import YouTubePlaylist from '@/components/YouTubePlaylist';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, Video, Play } from 'lucide-react';
import { SatsangVideo } from '@/lib/types';

function LiveSatsangAlert({ liveVideo }: { liveVideo: SatsangVideo }) {
  return (
    <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 mb-8">
      <Bell className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800 dark:text-green-400">Live Satsang Now!</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-300">
        <div className="mt-2">
          <strong>{liveVideo.title}</strong>
        </div>
        <div className="mt-2 text-sm">
          Join the live satsang session now. The video will be available for replay after the session ends.
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default function SatsangPage() {
  const { t } = useLocale();
  const playlistId = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID || 'PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-';
  const videos = useCollection<SatsangVideo>('satsangVideos');
  const liveVideos = useCollection<SatsangVideo>('live_satsang_videos');
  
  // Check for live videos from the live_satsang_videos collection
  const liveVideo = liveVideos?.find(video => video.isLive);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 font-headline">{t.nav_satsang}</h1>
      
      {liveVideo && <LiveSatsangAlert liveVideo={liveVideo} />}
      
      <ChannelSubscribe />

      <YouTubePlaylist playlistId={playlistId} />
    </div>
  );
}
