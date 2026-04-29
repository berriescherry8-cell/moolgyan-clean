import os

# Write PhotoLightbox.tsx
lightbox = r"""'use client';

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
  );
}
"""

with open('src/components/PhotoLightbox.tsx', 'w', encoding='utf-8') as f:
    f.write(lightbox)
print('PhotoLightbox.tsx written')

# Write photos page
photos_page = r"""'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Aperture, Compass, Landmark } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import PhotoLightbox from '@/components/PhotoLightbox';

interface Photo {
  folder: string;
  public_url: string;
  file_name: string;
  uploaded_at?: string;
}

const SUPABASE_URL = 'https://lqymwrhfirszrakuevqm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA';

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);

const GALLERIES = [
  {
    id: 'prachar-aur-prasar',
    title: 'प्रवास और प्रचार-प्रसार',
    subtitle: 'Prachar aur Prasar',
    desc: 'नितिनदास जी के प्रेरणादायक प्रवास और प्रचार कार्यक्रमों की झलकियाँ',
    icon: Compass,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgGlow: 'bg-orange-500/10',
    textGlow: 'orange',
  },
  {
    id: 'general gallery',
    title: 'सामान्य गैलरी',
    subtitle: 'General Gallery',
    desc: 'सत्संग, कार्यक्रम और आध्यात्मिक क्षणों की सुंदर तस्वीरें',
    icon: Aperture,
    gradient: 'from-cyan-400 via-blue-500 to-purple-500',
    bgGlow: 'bg-blue-500/10',
    textGlow: 'blue',
  },
  {
    id: 'saar-sangrah',
    title: 'सार संग्रह',
    subtitle: 'Saar Sangrah',
    desc: 'मूल ज्ञान की पुस्तकों और महत्वपूर्ण दस्तावेजों का संग्रह',
    icon: Landmark,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    bgGlow: 'bg-emerald-500/10',
    textGlow: 'emerald',
  },
];

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<Photo[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('folder, public_url, file_name, uploaded_at')
      .order('uploaded_at', { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  };

  const byFolder = (folder: string) => photos.filter((p) => p.folder === folder);

  const openLightbox = (folderPhotos: Photo[], index: number) => {
    setCurrentGallery(folderPhotos);
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
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

      <div className="space-y-24 pb-24">
        {GALLERIES.map((gallery) => {
          const folderPhotos = byFolder(gallery.id);
          const Icon = gallery.icon;
          if (folderPhotos.length === 0) return null;

          return (
            <section key={gallery.id} className="relative">
              <div className="max-w-7xl mx-auto px-6 mb-8 flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div className={'w-14 h-14 rounded-2xl bg-gradient-to-br ' + gallery.gradient + ' flex items-center justify-center shadow-lg'}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold">{gallery.title}</h2>
                    <p className="text-sm text-zinc-500 font-medium mt-1">{gallery.subtitle}</p>
                  </div>
                <Link
                  href={'/photos/' + encodeURIComponent(gallery.id)}
                  className={'group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ' + gallery.gradient + ' text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'}
                >
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <p className="max-w-7xl mx-auto px-6 text-zinc-400 text-sm mb-6">{gallery.desc}</p>

              <div className={'relative ' + gallery.bgGlow + ' py-8 overflow-hidden'}>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-5 animate-marquee" style={{ width: 'max-content' }}>
                  {[...folderPhotos, ...folderPhotos].map((photo, i) => (
                    <button
                      key={photo.file_name + '-' + i}
                      onClick={() => openLightbox(folderPhotos, i % folderPhotos.length)}
                      className="relative group flex-shrink-0 w-[320px] h-[220px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1"
                    >
                      <img
                        src={photo.public_url}
                        alt={photo.file_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <p className="text-white text-sm font-medium truncate">{photo.file_name}</p>
                      </div>
                    </button>
                  ))}
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
"""

with open('src/app/photos/page.tsx', 'w', encoding='utf-8') as f:
    f.write(photos_page)
print('photos/page.tsx written')

# Write admin photos page
admin_page = r"""'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Upload, 
  Trash2, 
  Loader2, 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { Photo } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

const BUCKETS = [
  { value: 'prachar-aur-prasar', label: 'प्रवास और प्रचार-प्रसार' },
  { value: 'general gallery', label: 'सामान्य गैलरी' },
  { value: 'saar-sangrah', label: 'सार संग्रह' },
];

export default function PhotosManagementPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<string>('all');
  const [selectedBucket, setSelectedBucket] = useState<string>('prachar-aur-prasar');

  const photos = useCollection<Photo>('photos');

  const filteredPhotos = photos?.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBucket = filterBucket === 'all' || photo.folder === filterBucket;
    return matchesSearch && matchesBucket;
  }) || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = getSupabase();
    if (!supabase) {
      toast({ variant: 'destructive', title: 'Error', description: 'Supabase client not available' });
      setUploading(false);
      return;
    }

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = Date.now() + '-' + Math.random().toString(36).substring(7) + '.' + fileExt;
        const filePath = selectedBucket + '/' + fileName;

        const { error: uploadError } = await supabase.storage
          .from('moolgyan-media')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('moolgyan-media')
          .getPublicUrl(filePath);

        const photoData = {
          id: crypto.randomUUID(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          folder: selectedBucket,
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString()
        };

        await supabase.from('photos').insert(photoData);
      }

      toast({ title: 'Success', description: files.length + ' photos uploaded to ' + selectedBucket });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message || 'Failed to upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    setProcessingId(photo.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('photos').delete().eq('id', photo.id);

      if (photo.image_url.includes('moolgyan-media')) {
        const parts = photo.image_url.split('/moolgyan-media/');
        if (parts.length > 1) {
          await supabase.storage.from('moolgyan-media').remove([parts[1]]);
        }
      }

      toast({ title: 'Success', description: 'Photo deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message || 'Failed to delete' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photos Management</h1>
          <p className="text-muted-foreground">Upload and manage photos in 3 gallery sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Photos
          </CardTitle>
          <CardDescription>
            Select a gallery section and upload photos. They will be synced to the corresponding Supabase storage bucket.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Gallery Section</label>
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Choose gallery section" />
              </SelectTrigger>
              <SelectContent>
                {BUCKETS.map((bucket) => (
                  <SelectItem key={bucket.value} value={bucket.value}>
                    {bucket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drop photos here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Photos will be saved to: <Badge variant="secondary">{BUCKETS.find(b => b.value === selectedBucket)?.label}</Badge></p>
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Photos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search photos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            <Select value={filterBucket} onValueChange={setFilterBucket}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {BUCKETS.map((bucket) => (
                  <SelectItem key={bucket.value} value={bucket.value}>
                    {bucket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPhotos.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="aspect-square relative">
                    <img src={photo.thumbnail_url || photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {BUCKETS.find(b => b.value === photo.folder)?.label || photo.folder}
                      </Badge>
                    </div>
                ) : (
                  <div className="flex items-center p-4">
                    <img src={photo.thumbnail_url || photo.image_url} alt={photo.title} className="w-16 h-16 object-cover rounded mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">{photo.title}</h3>
                      <p className="text-sm text-gray-500">
                        {BUCKETS.find(b => b.value === photo.folder)?.label || photo.folder}
                      </p>
                    </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{photo.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(photo.image_url, '_blank')}>
                      View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePhoto(photo)} disabled={processingId === photo.id}>
                      {processingId === photo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No photos found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterBucket !== 'all' ? 'Try adjusting your search or filter' : 'Upload your first photo to get started'}
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
"""

with open('src/app/admin/photos/page.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_page)
print('admin/photos/page.tsx written')
print('All files written successfully!')
"""

with open('write_photos.py', 'w', encoding='utf-8') as f:
    f.write(script_content)
print('write_photos.py created')
