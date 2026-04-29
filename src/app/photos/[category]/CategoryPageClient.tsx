'use client';

import { useCollection } from '@/lib/data-manager';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PhotoLightbox from '@/components/PhotoLightbox';
import { useState, useCallback } from 'react';

interface CategoryPageClientProps {
  category: string;
  displayName: string;
}

export default function CategoryPageClient({ category, displayName }: CategoryPageClientProps) {
  const photos = useCollection<any>('photos');
  const categoryPhotos = photos.filter(
    (p) => p.category === category || p.folder === category
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const gallery = categoryPhotos.map((p) => ({
    public_url: p.image_url,
    file_name: p.title || 'Photo',
  }));

  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i === 0 ? gallery.length - 1 : i - 1)),
    [gallery.length]
  );
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i === gallery.length - 1 ? 0 : i + 1)),
    [gallery.length]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/photos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">{displayName}</h1>
          <span className="text-zinc-500">{categoryPhotos.length} photos</span>
        </div>

        {categoryPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryPhotos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ImageIcon className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400">No photos in this category yet.</p>
          </div>
        )}

        <PhotoLightbox
          isOpen={lightboxOpen}
          photos={gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </div>
  );
}

