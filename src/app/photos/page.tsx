'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, X, Download, Share2, Heart } from "lucide-react";
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

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  const galleryConfig = {
    "prachar-aur-prasar": {
      displayName: "प्रवास और प्रचार-प्रसार",
      description: "नितिनदास जी के प्रेरणादायक प्रवास और प्रचार कार्यक्रमों की झलकियाँ",
      color: "from-amber-500 to-orange-600"
    },
    "general-gallery": {
      displayName: "सामान्य गैलरी",
      description: "सत्संग, कार्यक्रम और आध्यात्मिक क्षणों की सुंदर तस्वीरें",
      color: "from-blue-500 to-purple-600"
    },
    "saar-sangrah": {
      displayName: "सार संग्रह",
      description: "मूल ज्ञान की पुस्तकों और महत्वपूर्ण दस्तावेजों का संग्रह",
      color: "from-emerald-500 to-teal-600"
    }
  };

  const groupedPhotos = photos.reduce((acc: any, photo: Photo) => {
    if (!acc[photo.folder]) acc[photo.folder] = [];
    acc[photo.folder].push(photo);
    return acc;
  }, {});

  const orderedFolders = ["prachar-aur-prasar", "general-gallery", "saar-sangrah"];

  if (loading) {
    return <div>Loading photos...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">Photos Gallery</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Beautiful moments from satsangs, spiritual gatherings and divine events
          </p>
        </div>

        {orderedFolders.map(folder => {
          const galleryPhotos = groupedPhotos[folder] || [];
          const config = galleryConfig[folder as keyof typeof galleryConfig];
          
          if (galleryPhotos.length === 0) return null;

          return (
            <div key={folder} className="mb-24">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold">{config?.displayName || folder}</h2>
                <Link href={`/photos/${folder}`} className="text-amber-500 hover:text-amber-400 font-semibold">
                  View All ({galleryPhotos.length})
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </Link>
              </div>
              
              <div 
                ref={el => { scrollRefs.current[folder] = el; }}
                className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
              >
                {galleryPhotos.slice(0, 12).map((photo, idx) => (
                  <div key={idx} className="min-w-[300px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <Image
                      src={photo.public_url}
                      alt={photo.file_name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
