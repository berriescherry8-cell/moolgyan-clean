'use client';

import { useState } from 'react';
import { dataManager, useCollection } from '@/lib/data-manager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Star, Play } from 'lucide-react';
import type { SatsangVideo } from '@/lib/types';
import { VideoPlayer } from '@/components/VideoPlayer';

function VideoGrid({
  videos,
  processingId,
  onFeatureToggle,
  onLiveToggle,
  onDelete,
}: {
  videos: SatsangVideo[];
  processingId: string | null;
  onFeatureToggle: (video: SatsangVideo) => void;
  onLiveToggle: (video: SatsangVideo) => void;
  onDelete: (video: SatsangVideo) => void;
}) {
  if (videos.length === 0) {
    return <p className="text-center py-10">No Videos Found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id}>
          <VideoPlayer video={video} />

          <CardContent className="p-3">
            <h3 className="font-bold text-sm">{video.title}</h3>

            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => onFeatureToggle(video)}>
                <Star className="h-4 w-4" />
              </Button>

              <Button size="sm" onClick={() => onLiveToggle(video)}>
                <Play className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(video)}
              >
                {processingId === video.id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminLiveSatsangPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 🔥 IMPORTANT: dono collections load karo
  const liveVideos = useCollection<SatsangVideo>('live_satsang_videos');
  const generalVideos = useCollection<SatsangVideo>('satsangVideos');

  // merge all
  const allVideos = [...(liveVideos || []), ...(generalVideos || [])];

  // ================= DELETE =================
  const handleDelete = async (video: SatsangVideo) => {
    setProcessingId(video.id);

    try {
      if (video.isFeatured || video.isLive) {
        await dataManager.deleteDoc('live_satsang_videos', video.id);
      } else {
        await dataManager.deleteDoc('satsangVideos', video.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  // ================= FEATURE TOGGLE =================
  const handleFeatureToggle = async (video: SatsangVideo) => {
    setProcessingId(video.id);

    try {
      const updated = { ...video, isFeatured: !video.isFeatured };

      if (updated.isFeatured) {
        // 👉 move to LIVE collection
        await dataManager.setDoc('live_satsang_videos', updated);
        await dataManager.deleteDoc('satsangVideos', video.id);
      } else {
        // 👉 move to GENERAL
        await dataManager.setDoc('satsangVideos', updated);
        await dataManager.deleteDoc('live_satsang_videos', video.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  // ================= LIVE TOGGLE =================
  const handleLiveToggle = async (video: SatsangVideo) => {
    setProcessingId(video.id);

    try {
      const updated = { ...video, isLive: !video.isLive };

      if (updated.isLive) {
        // 👉 move to LIVE collection
        await dataManager.setDoc('live_satsang_videos', updated);
        await dataManager.deleteDoc('satsangVideos', video.id);
      } else {
        // 👉 back to GENERAL
        await dataManager.setDoc('satsangVideos', updated);
        await dataManager.deleteDoc('live_satsang_videos', video.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Live Satsang</h1>

      {!allVideos && <Loader2 className="animate-spin" />}

      {allVideos && (
        <VideoGrid
          videos={allVideos}
          processingId={processingId}
          onFeatureToggle={handleFeatureToggle}
          onLiveToggle={handleLiveToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}