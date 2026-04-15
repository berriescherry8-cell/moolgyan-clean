'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, X, Download, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

interface Photo {
  folder: string;
  public_url: string;
  file_name: string;
  uploaded_at?: string;
}

interface Gallery {
  folder: string;
  displayName: string;
  description: string;
  icon: string;
  photos: Photo[];
  total: number;
  color: string;
}

export default function PhotosPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // ... (keep all useEffect same for fetch, scroll, auto-slide)

  const openGalleryModal = (photos: Photo[]) => {
    setGalleryPhotos(photos);
    setCurrentGalleryIndex(0);
    setSelectedPhoto(photos[0]);
  };

  const prevGalleryPhoto = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const nextGalleryPhoto = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setGalleryPhotos([]);
    setCurrentGalleryIndex(0);
  };

  // fetchPhotos useEffect stays the same, remove routeMap

  const galleryConfig = {
    // same
  };

  const order = ['prachar-aur-prasar', 'general-gallery', 'saar-sangrah'];

  const result: Gallery[] = order
    .map(folder => {
      if (!grouped[folder]) return null;
      const config = galleryConfig[folder] || { displayName: folder, description: '', icon: '📷', color: 'from-gray-500 to-gray-600' };
      return {
        folder,
        displayName: config.displayName,
        description: config.description,
        icon: config.icon,
        photos: grouped[folder],
        total: grouped[folder].length,
        color: config.color
      };
    })
    .filter(Boolean) as Gallery[];

  // ... rest JSX same until gallery header

  // In gallery header replace Link with:
  <Button
    onClick={() => openGalleryModal(gallery.photos)}
    className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors group bg-transparent border-transparent hover:bg-amber-500/10 p-3 rounded-xl"
  >
    <span className="text-lg">सभी देखें ({gallery.total})</span>
    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
  </Button>

  // Modal update:
  {(galleryPhotos.length > 0 || selectedPhoto) && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeModal}>
      <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" onClick={closeModal}>
        <X className="h-8 w-8" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
        <Image
          src={galleryPhotos[currentGalleryIndex]?.public_url || selectedPhoto!.public_url}
          alt={galleryPhotos[currentGalleryIndex]?.file_name || selectedPhoto!.file_name}
          width={1200}
          height={800}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
          unoptimized
        />

        {galleryPhotos.length > 1 && (
          <>
            <button onClick={prevGalleryPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button onClick={nextGalleryPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all">
              <ChevronRight className="h-8 w-8" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-2 rounded-full">
              {currentGalleryIndex + 1} / {galleryPhotos.length}
            </div>
          </>
        )}

        {/* Keep download/share */}
      </div>
    </div>
  )}

  // rest same

Keep full JSX structure. Since complex, use create_file with full fixed content.

