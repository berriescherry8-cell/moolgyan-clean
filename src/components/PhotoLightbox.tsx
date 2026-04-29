'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoLightboxProps {
  isOpen: boolean;
  photos: { public_url: string; file_name: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PhotoLightbox(props: PhotoLightboxProps) {
  const { isOpen, photos, currentIndex, onClose, onPrev, onNext } = props;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
        <X className="h-7 w-7" />
      </button>

      <div className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white/80 font-medium text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-8 z-50 p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all">
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-8 z-50 p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all">
        <ChevronRight className="h-8 w-8" />
      </button>

<div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img src={currentPhoto.public_url} alt={currentPhoto.file_name} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" draggable={false} />
      </div>
    </div>
  );
}