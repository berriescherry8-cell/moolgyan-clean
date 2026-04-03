'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

export default function PhotosPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('folder, public_url, file_name')
        .order('uploaded_at', { ascending: false });

      const grouped = data?.reduce((acc: any, photo: any) => {
        if (!acc[photo.folder]) acc[photo.folder] = [];
        acc[photo.folder].push(photo);
        return acc;
      }, {}) || {};

      // Custom Order: Prachar first, then General, then Saar Sangrah
      const order = ['prachar-aur-prasar', 'general-gallery', 'saar-sangrah'];

      const result = order
        .map(folder => {
          if (!grouped[folder]) return null;
          return {
            folder,
            displayName: folder === 'general-gallery' ? 'General Gallery' :
                         folder === 'prachar-aur-prasar' ? 'Pravas aur Prachar-Prasar' :
                         folder === 'saar-sangrah' ? 'Saar Sangrah' : folder,
            photos: grouped[folder],
            total: grouped[folder].length,
            route: folder === 'saar-sangrah' ? '/saar-sangrah' : `/photos/${folder}`
          };
        })
        .filter(Boolean); // Remove null entries

      setGalleries(result as any[]);
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  // Auto Slide
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    galleries.forEach(gallery => {
      const container = scrollRefs.current[gallery.folder];
      if (!container) return;

      const interval = setInterval(() => {
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          if (currentScroll >= maxScroll - 50) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }
      }, 4500);

      intervals.push(interval);
    });

    return () => intervals.forEach(i => clearInterval(i));
  }, [galleries]);

  if (loading) return <div className="text-center py-20 text-2xl">Loading beautiful moments...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold font-headline mb-12 text-center">Photos</h1>

      {galleries.map((gallery) => (
        <div key={gallery.folder} className="mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{gallery.displayName}</h2>
            <Link
              href={gallery.route}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              View All ({gallery.total}) <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="relative group">
            <div
              ref={(el) => { scrollRefs.current[gallery.folder] = el; }}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 scroll-smooth"
            >
              {gallery.photos.map((photo: any, idx: number) => (
                <div
                  key={idx}
                  className="min-w-[300px] snap-start rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03]"
                >
                  <Image
                    src={photo.public_url}
                    alt={photo.file_name}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {/* Clean Arrows */}
            <button
              onClick={() => scrollRefs.current[gallery.folder]?.scrollBy({ left: -340, behavior: 'smooth' })}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <button
              onClick={() => scrollRefs.current[gallery.folder]?.scrollBy({ left: 340, behavior: 'smooth' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}