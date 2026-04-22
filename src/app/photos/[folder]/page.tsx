'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Maximize2, X, Download, Heart } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Supabase client
const supabaseUrl = 'https://lqymwrhfirszrakuevqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA';

const supabase = createBrowserClient(supabaseUrl, supabaseKey);

interface Photo {
  folder: string;
  public_url: string;
  file_name: string;
  uploaded_at?: string;
}

export async function generateStaticParams() {
  return [
    { folder: 'prachar-aur-prasar' },
    { folder: 'general-gallery' },
    { folder: 'videsh-bhraman' }
  ];
}

export default function PhotoFolderPage() {
  const params = useParams();
  const router = useRouter();
  const folder = params.folder as string;
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const galleryConfig = {
    "prachar-aur-prasar": {
      displayName: "Prachar aur Prasar-Prasar",
      description: "Inspirational moments from Nitin Das Ji's travels and outreach programs",
      color: "from-amber-500 to-orange-600"
    },
    "general-gallery": {
      displayName: "General Gallery",
      description: "Beautiful collection of spiritual moments and divine experiences",
      color: "from-blue-500 to-purple-600"
    },
    "videsh-bhraman": {
      displayName: "Videsh Bhraman",
      description: "Spiritual journeys and international discourses",
      color: "from-green-500 to-teal-600"
    }
  };

  const config = galleryConfig[folder as keyof typeof galleryConfig];

  useEffect(() => {
    if (folder) {
      fetchPhotos();
    }
  }, [folder]);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('folder, public_url, file_name, uploaded_at')
      .eq('folder', folder)
      .order('uploaded_at', { ascending: false });

    setPhotos(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Gallery Not Found</h1>
          <Button onClick={() => router.push('/photos')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Photos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-20`}></div>
        <div className="relative p-6">
          <Button
            onClick={() => router.push('/photos')}
            variant="ghost"
            className="mb-6 text-white hover:text-white/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Photos
          </Button>
          
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{config.displayName}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{config.description}</p>
            <Badge className="mt-4 bg-white/20 text-white border-white/30">
              {photos.length} Photos
            </Badge>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="p-6">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.file_name}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.public_url}
                  alt={photo.file_name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm truncate">{photo.file_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-white/60 text-xl">No photos found in this gallery</div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <Button
              onClick={() => setSelectedPhoto(null)}
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:text-white/80 z-10"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="relative">
              <Image
                src={selectedPhoto.public_url}
                alt={selectedPhoto.file_name}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{selectedPhoto.file_name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
