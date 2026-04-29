'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, ImageIcon } from 'lucide-react';
import { useCollection } from '@/lib/data-manager';
import type { SpiritualPhoto } from '@/lib/types';
import PhotoLightbox from '@/components/PhotoLightbox';

interface PhotoRecord {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category: string;
  folder?: string;
  is_active?: boolean;
  created_at?: string;
}

const GALLERY_META: Record<string, { title: string; subtitle: string; desc: string; gradient: string }> = {
  prachar: {
    title: 'प्रवास और प्रचार-प्रसार',
    subtitle: 'Prachar aur Prasar',
    desc: 'नितिनदास जी के प्रेरणादायक प्रवास और प्रचार कार्यक्रमों की झलकियाँ',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
  },
  general: {
    title: 'सामान्य गैलरी',
    subtitle: 'General Gallery',
    desc: 'सत्संग, कार्यक्रम और आध्यात्मिक क्षणों की सुंदर तस्वीरें',
    gradient: 'from-cyan-400 via-blue-500 to-purple-500',
  },
  'saar-sangrah': {
    title: 'सार संग्रह',
    subtitle: 'Saar Sangrah',
    desc: 'मूल ज्ञान की पुस्तकों और महत्वपूर्ण दस्तावेजों का संग्रह',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
  },
  videsh: {
    title: 'विदेश भ्रमण',
    subtitle: 'Videsh Bhraman',
    desc: 'विदेशों में आध्यात्मिक यात्राएँ और कार्यक्रम',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
  },
  events: {
    title: 'कार्यक्रम',
    subtitle: 'Events',
    desc: 'विशेष आयोजन और कार्यक्रमों की तस्वीरें',
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
  },
  satsang: {
    title: 'सत्संग',
    subtitle: 'Satsang',
    desc: 'सत्संग और धार्मिक कार्यक्रम',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
  },
  deeksha: {
    title: 'दीक्षा',
    subtitle: 'Deeksha',
    desc: 'दीक्षा समारोह और विशेष क्षण',
    gradient: 'from-lime-400 via-green-500 to-emerald-500',
  },
};

export default function PhotosPage() {
  const rawPhotos = useCollection<PhotoRecord>('photos');
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<{ public_url: string; file_name: string }[]>([]);

  useEffect(() => {
    const active = (rawPhotos || []).filter((p) => p.is_active !== false);
    setPhotos(active);
    setLoading(false);
  }, [rawPhotos]);

  const byCategory = (cat: string) => photos.filter((p) => p.category === cat || p.folder === cat);

  const categoriesWithPhotos = Object.keys(GALLERY_META).filter((cat) => byCategory(cat).length > 0);

  const openLightbox = (catPhotos: PhotoRecord[], index: number) => {
    setCurrentGallery(
      catPhotos.map((p) => ({ public_url: p.image_url, file_name: p.title || 'Photo' }))
    );
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? currentGallery.length - 1 : i - 1));
  }, [currentGallery.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === currentGallery.length - 1 ? 0 : i + 1));
  }, [currentGallery.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm tracking-wider">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
        <div className="text-center space-y-4">
          <Camera className="h-16 w-16 mx-auto text-zinc-600" />
          <h1 className="text-3xl font-bold">दिव्य झलकियाँ</h1>
          <p className="text-zinc-400">No photos have been added yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="relative pt-20 pb-12 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Camera className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-zinc-300 tracking-widest uppercase">Photo Gallery</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            दिव्य झलकियाँ
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Explore beautiful moments from satsangs, spiritual journeys, and divine gatherings
          </p>
        </div>
      </div>

      {/* Gallery Sections */}
      <div className="space-y-24 pb-24">
        {categoriesWithPhotos.map((cat) => {
          const catPhotos = byCategory(cat);
          const meta = GALLERY_META[cat];
          if (!meta || catPhotos.length === 0) return null;

          return (
            <section key={cat} className="relative">
              <div className="max-w-7xl mx-auto px-6 mb-8 flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                    <ImageIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold">{meta.title}</h2>
                    <p className="text-sm text-zinc-500 font-medium mt-1">{meta.subtitle}</p>
                  </div>
                </div>
                <Link
                  href={`/photos/${encodeURIComponent(cat)}`}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${meta.gradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <p className="max-w-7xl mx-auto px-6 text-zinc-400 text-sm mb-6">{meta.desc}</p>

              {/* Photo Strip */}
              <div className="relative py-8 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-5 animate-marquee" style={{ width: 'max-content' }}>
                  {[...catPhotos, ...catPhotos].map((photo, i) => (
                    <button
                      key={`${photo.id}-${i}`}
                      onClick={() => openLightbox(catPhotos, i % catPhotos.length)}
                      className="relative group flex-shrink-0 w-[320px] h-[220px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1"
                    >
                      <img
                        src={photo.thumbnail_url || photo.image_url}
                        alt={photo.title || 'Photo'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <p className="text-white text-sm font-medium truncate">{photo.title || 'Untitled'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <PhotoLightbox
        isOpen={lightboxOpen}
        photos={currentGallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}

