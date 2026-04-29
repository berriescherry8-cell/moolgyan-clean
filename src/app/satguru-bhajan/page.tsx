'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Loader2, AlertCircle, Search, Sparkles, Music } from 'lucide-react';
import type { SatguruBhajan } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useLocale } from '@/lib/i18n';
import { useCollection } from '@/lib/data-manager';

function BhajanVideoCard({ video }: { video: SatguruBhajan }) {
    return (
      <Card className="overflow-hidden group transition-shadow hover:shadow-xl flex flex-col bg-card/80 backdrop-blur-sm">
        <VideoPlayer video={video} />
        <CardContent className="p-4 flex-grow">
          <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
          {video.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>}
        </CardContent>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-gold-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl divine-rays animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Bookstore Style Header - Orange & Black Pattern */}
        <div className="text-center space-y-8 pt-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-2xl shadow-orange-500/50">
              <Music className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div>
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl mb-2">
    SATGURU BHAJAN
  </h1>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
                <p className="text-amber-300 font-medium text-sm">Divine Melodies</p>
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Experience divine bliss through sacred bhajans and spiritual melodies from Sadguru Nitin Sahib
          </p>
        </div>

        <div className="space-y-8">
          <div className="mb-6 flex justify-center">
              <div className="relative w-20 h-20 p-1 rounded-full bg-gradient-to-tr from-orange-400 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/30">
                  <div className="w-full h-full bg-background rounded-full p-1 relative overflow-hidden border-2 border-orange-300/50">
                      <Image 
                          src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/images.jpg"
                          alt="Satguru Bhajan Logo" 
                          fill
                          className="object-cover rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/20 to-transparent"></div>
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
                  <Youtube className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold">No Bhajans Found</h3>
                  <p className="text-muted-foreground mt-2">
                      {searchQuery ? "Your search did not match any bhajans." : "No bhajans have been added yet."}
                  </p>
              </div>
            )}
          </div>
      </div>
      </div>
    </div>
  );
}
