
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Loader2, AlertCircle, Search, Music } from 'lucide-react';
import type { SatguruBhajan } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useLocale } from '@/lib/i18n';
import { useCollection } from '@/lib/data-manager';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


function BhajanVideoCard({ video }: { video: SatguruBhajan }) {
    return (
      <Card className="overflow-hidden group transition-shadow hover:shadow-xl flex flex-col bg-card/80 backdrop-blur-sm">
        <VideoPlayer video={video} />
        <CardContent className="p-4 flex-grow">
          <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
          {video.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>}
        </CardContent>
        {video.lyrics && (
            <CardFooter className="p-4 pt-0">
                <Collapsible className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                        <span className="flex items-center">
                            <Music size={16} className="mr-2" />
                            View Lyrics
                        </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 p-4 bg-background/50 rounded-lg border max-h-48 overflow-y-auto">
                        <p className="whitespace-pre-line leading-relaxed text-sm text-muted-foreground">
                            {video.lyrics}
                        </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
            </CardFooter>
        )}
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
    <div>
      <h1 className="text-4xl font-bold mb-8 font-headline">{t.nav_satguru_bhajan}</h1>
      
      <div className="space-y-8">
          <div className="mb-8 flex justify-center">
              <div className="relative w-32 h-32 p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 shadow-lg shadow-yellow-500/30">
                  <div className="w-full h-full bg-background rounded-full p-1 relative overflow-hidden border-2 border-yellow-300/50">
                      <Image 
                          src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/images.jpg"
                          alt="Satguru Bhajan Logo" 
                          fill
                          className="object-cover rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/20 to-transparent"></div>
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
                  <Music className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold">No Bhajans Found</h3>
                  <p className="text-muted-foreground mt-2">
                      {searchQuery ? "Your search did not match any bhajans." : "No bhajans have been added yet."}
                  </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
