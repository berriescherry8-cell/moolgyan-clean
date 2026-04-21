'use client';

<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, X, Download, Share2, Heart } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Get Supabase client using environment variables
const getSupabase = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Use the provided Supabase credentials
  const SUPABASE_URL = 'https://lqymwrhfirszrakuevqm.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA';

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Custom Image component with error handling
const PhotoImage = ({ src, alt, className, fill = false, width, height }: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    // Try to load a fallback image or use a placeholder
    setImageSrc('/api/placeholder-image?width=400&height=300');
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500 text-sm">
          Image not available
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        unoptimized
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={false}
      />
    </div>
  );
};

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
  
  // Modal states
  const [showCollage, setShowCollage] = useState(false);
  const [collagePhotos, setCollagePhotos] = useState<Photo[]>([]);
  const [collageTitle, setCollageTitle] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Keyboard nav for single lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setShowCollage(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch photos
  useEffect(() => {
    const fetchPhotos = async () => {
      const supabaseClient = getSupabase();
      if (!supabaseClient) {
        console.warn('Supabase client not available');
        setLoading(false);
        return;
      }

      const { data } = await supabaseClient
        .from("photos")
        .select("folder, public_url, file_name, uploaded_at")
        .order("uploaded_at", { ascending: false });

      const grouped = data?.reduce((acc: any, photo: Photo) => {
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        if (!acc[photo.folder]) acc[photo.folder] = [];
        acc[photo.folder].push(photo);
        return acc;
      }, {}) || {};

<<<<<<< HEAD
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
=======
      const galleryConfig = {
        "prachar-aur-prasar": {
          displayName: "प्रवास और प्रचार-प्रसार",
          description: "नितिनदास जी के प्रेरणादायक प्रवास और प्रचार कार्यक्रमों की झलकियाँ",
          icon: "🌍",
          color: "from-amber-500 to-orange-600"
        },
        "general-gallery": {
          displayName: "सामान्य गैलरी",
          description: "सत्संग, कार्यक्रम और आध्यात्मिक क्षणों की सुंदर तस्वीरें",
          icon: "📸",
          color: "from-blue-500 to-purple-600"
        },
        "saar-sangrah": {
          displayName: "सार संग्रह",
          description: "मूल ज्ञान की पुस्तकों और महत्वपूर्ण दस्तावेजों का संग्रह",
          icon: "📚",
          color: "from-emerald-500 to-teal-600"
        }
      };

      const order = ["prachar-aur-prasar", "general-gallery", "saar-sangrah"];
      const result: Gallery[] = order
        .map((folder) => {
          if (!grouped[folder]) return null;
          const config = galleryConfig[folder as keyof typeof galleryConfig] || {
            displayName: folder,
            description: "",
            icon: "📷",
            color: "from-gray-500 to-gray-600"
          };
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

      setGalleries(result);
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      setLoading(false);
    };

    fetchPhotos();
  }, []);

<<<<<<< HEAD
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
=======
  // Auto scroll galleries
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    galleries.forEach((gallery) => {
      const container = scrollRefs.current[gallery.folder];
      if (!container) return;
      const interval = setInterval(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        if (currentScroll >= maxScroll - 50) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 340, behavior: "smooth" });
        }
      }, 4500);
      intervals.push(interval);
    });
    return () => intervals.forEach((i) => clearInterval(i));
  }, [galleries]);

  const filteredGalleries = activeFilter === "all" ? galleries : galleries.filter((g) => g.folder === activeFilter);

  const openCollage = (photos: Photo[], title: string) => {
    setCollagePhotos(photos);
    setCollageTitle(title);
    setShowCollage(true);
  };

  const openSinglePhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowCollage(false);
  };

  const closeModals = () => {
    setShowCollage(false);
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 text-lg">सुंदर पल लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                फोटो गैलरी
              </span>
            </h1>
            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              नितिनदास जी के प्रेरणादायक प्रवास, सत्संग कार्यक्रमों और आध्यात्मिक क्षणों की सुंदर झलकियाँ
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                सभी (All)
              </Button>
              {galleries.map((gallery) => (
                <Button
                  key={gallery.folder}
                  variant={activeFilter === gallery.folder ? "default" : "outline"}
                  onClick={() => setActiveFilter(gallery.folder)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeFilter === gallery.folder
                      ? `bg-gradient-to-r ${gallery.color} text-white border-0`
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span className="mr-2">{gallery.icon}</span>
                  {gallery.displayName.split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Galleries */}
      <div className="container mx-auto px-6 pb-20">
        {filteredGalleries.map((gallery) => (
          <div key={gallery.folder} className="mb-24">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{gallery.icon}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{gallery.displayName}</h2>
                  </div>
                  <p className="text-zinc-400 text-lg ml-12">{gallery.description}</p>
                </div>
                <Button
                  onClick={() => openCollage(gallery.photos, gallery.displayName)}
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors group bg-transparent hover:bg-amber-500/10 border-transparent p-3 rounded-xl"
                >
                  <span className="text-lg">सभी देखें ({gallery.total})</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gallery.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(gallery.total * 2, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Horizontal Scroll Preview */}
            <div className="relative group">
              <div
                ref={(el) => {
                  scrollRefs.current[gallery.folder] = el;
                }}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 scroll-smooth"
              >
                {gallery.photos.slice(0, 10).map((photo: Photo, idx: number) => (
                  <div
                    key={idx}
                    className="min-w-[320px] md:min-w-[380px] snap-start rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-amber-500/20 cursor-pointer"
                    onClick={() => openSinglePhoto(photo)}
                  >
                    <div className="relative aspect-[4/3]">
                      <PhotoImage src={photo.public_url} alt={photo.file_name} className="object-cover" fill />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-medium truncate">{photo.file_name}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full">
                          <Maximize2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollRefs.current[gallery.folder]?.scrollBy({ left: -340, behavior: "smooth" })}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-zinc-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg border border-zinc-700"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => scrollRefs.current[gallery.folder]?.scrollBy({ left: 340, behavior: "smooth" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-zinc-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg border border-zinc-700"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Collage Modal */}
      {showCollage && collagePhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          onClick={() => setShowCollage(false)}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between z-10 bg-black/50 backdrop-blur-sm sticky top-0">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCollage(false)}
                className="h-10 w-10 text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-xl font-bold text-white">{collageTitle}</h3>
              <Badge className="bg-zinc-800 text-zinc-200">{collagePhotos.length} images</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCollage(false)}
              className="h-10 w-10 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 p-8 overflow-y-auto flex-1">
            {collagePhotos.map((photo, idx) => (
              <div
                key={idx}
                className="break-inside-avoid mb-4 cursor-pointer group rounded-xl overflow-hidden shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => openSinglePhoto(photo)}
              >
                <div className="relative aspect-[4/3]">
                  <PhotoImage
                    src={photo.public_url}
                    alt={photo.file_name}
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium truncate">{photo.file_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-8 w-8" />
          </button>

          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-8" onClick={(e) => e.stopPropagation()}>
            <PhotoImage
              src={selectedPhoto.public_url}
              alt={selectedPhoto.file_name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              fill
            />
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20">
                {selectedPhoto.file_name}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Floating Stats */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-xl">
              {/* Heart icon removed */}
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Photos</p>
              <p className="text-lg font-bold text-white">
                {galleries.reduce((sum, g) => sum + g.total, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
