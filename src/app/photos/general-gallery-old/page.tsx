'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, ArrowLeft, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

export default function GeneralGalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('folder', 'general-gallery')
        .order('uploaded_at', { ascending: false });
      setPhotos(data || []);
      setLoading(false);
    };
    fetchPhotos();
  }, []);

  const goToNext = () => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) => (prev! + 1) % photos.length);
  };

  const goToPrevious = () => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) => (prev! - 1 + photos.length) % photos.length);
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading photos...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/photos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold font-headline">General Photo Gallery</h1>
      </div>

      {photos.length > 0 ? (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className="mb-4 break-inside-avoid group block cursor-pointer relative rounded-lg overflow-hidden"
            >
              <Image
                src={photo.public_url}
                alt={photo.file_name}
                width={500}
                height={500}
                className="h-auto w-full object-cover rounded-lg transition-transform group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Expand className="h-8 w-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Photos Found</h3>
        </div>
      )}

      {/* FIXED Lightbox Dialog */}
      {currentIndex !== null && photos[currentIndex] && (
        <Dialog open={true} onOpenChange={() => setCurrentIndex(null)}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-black/95 p-0 border-white/10 overflow-hidden">
            {/* SINGLE WRAPPER DIV */}
            <div className="relative w-full h-full flex flex-col">
              
              <DialogClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogClose>

              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 text-white h-14 w-14 rounded-full"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-9 w-9" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 text-white h-14 w-14 rounded-full"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-9 w-9" />
                  </Button>
                </>
              )}

              <div className="flex-1 flex items-center justify-center p-8">
                <Image
                  src={photos[currentIndex].public_url}
                  alt={photos[currentIndex].file_name || 'Gallery Photo'}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="max-h-full"
                  unoptimized
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}