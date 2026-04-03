
'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { supabase } from '@/lib/supabase';
import type { SpiritualPhoto } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Flower2 } from 'lucide-react';

export default function PhotoCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [photos, setPhotos] = React.useState<SpiritualPhoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('spiritual_photos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        throw error;
      }

      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validPhotos = photos?.filter(p => p.imageUrl);

  if (isLoading) {
    return (
      <div className="w-full">
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                <div className="p-1">
                  <Card>
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (!validPhotos || validPhotos.length === 0) {
    return null; // Don't render the carousel if there are no photos
  }

  return (
    <div className="w-full">
        <h2 className="text-2xl font-bold font-headline mb-4">Photo Gallery</h2>
        <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
            loop: true,
            align: "start"
        }}
        >
        <CarouselContent>
            {validPhotos.map((photo) => (
            <CarouselItem key={photo.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                <div className="p-1">
                <Card className="overflow-hidden bg-background/80 backdrop-blur-sm">
                    <div className="relative aspect-square bg-muted/30">
                    <Image
                        src={photo.imageUrl}
                        alt={photo.title || 'Spiritual Photo'}
                        fill
                        className="object-cover"
                    />
                    </div>
                </Card>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
        </Carousel>
    </div>
  );
}
