'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Camera, Video, Wifi, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';

export default function Home() {
  const { t } = useLocale();

  const sections = [
    {
      title: t('nav_live_satsang') || "Live Satsang",
      description: 'Watch the latest featured spiritual talks and discourses.',
      icon: Wifi,
      href: '/live-satsang',
      cta: 'Watch Now',
    },
    {
      title: t('nav_satsang') || "Satsang",
      description: 'Explore the complete archive of all satsang videos.',
      icon: Video,
      href: '/satsang',
      cta: 'View Archive',
    },
    {
      title: t('nav_photos') || "Photos",
      description: 'View a curated gallery of spiritual and inspirational images.',
      icon: Camera,
      href: '/photos',
      cta: 'Explore Gallery',
    },
    {
      title: t('nav_bookstore') || "Bookstore",
      description: 'Order spiritual books and materials to aid your journey.',
      icon: BookOpen,
      href: '/books',
      cta: 'Shop Now',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        {/* Moving stars animation */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
          {/* Moving stars left to right */}
          {[...Array(80)].map((_, i) => (
            <div
              key={`moving-${i}`}
              className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full"
              style={{
                left: '-10px',
                top: `${Math.random() * 100}%`,
                animation: `moveLeftToRight ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 max-w-7xl">
        {/* Hero Section - Centered */}
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold font-headline leading-[1.1] tracking-tighter text-gold-foil">
            Mool Gyan
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the divine path of self-realization with Sadguru Nitin Sahib&apos;s profound spiritual teachings and satsangs.
          </p>
        </div>

        {/* Wisdom Quotes Section */}
        <div className="mt-8 mb-6">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-amber-900/20 to-gold-900/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-center">
                {/* Quote Icon on Top */}
                <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-gold-500/40">
                  <Quote className="h-4 w-4 text-black" />
                </div>
                
                {/* Content */}
                <h3 className="text-xs font-bold text-gold-300 mb-1 tracking-wide">Wisdom Quotes</h3>
                <p className="text-xs text-gold-200 italic leading-relaxed mb-1">
                  "The divine path awaits those who seek with pure heart."
                </p>
                <p className="text-xs text-gold-300/80 font-medium"> Sadguru Nitin Sahib</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Golden Design with Icons - PRESERVING THE EXACT DESIGN YOU LOVE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto md:max-w-full">
          {sections.map((section, index) => (
            <Link href={section.href} key={index} className="group">
              <div className="relative h-full">
                {/* Advanced hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-amber-500/20 to-gold-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-black/60 backdrop-blur-xl rounded-2xl border border-gold-500/30 hover:border-gold-400/60 transition-all duration-500 p-4 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-gold-500/30">
                  {/* Floating icon */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-gold-500/50"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                      }}
                    >
                      <section.icon className="h-7 w-7 text-black" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center pt-8">
                    <h3 
                      className="text-xl font-bold mb-3 transition-all duration-500 group-hover:scale-105"
                      style={{ color: '#fbbf24' }}
                    >
                      {section.title}
                    </h3>
                    
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 opacity-80">
                      {section.description}
                    </p>
                    
                    {/* Interactive button */}
                    <div className="mt-auto">
                      <div 
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-500 flex items-center justify-center group-hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))',
                          color: '#fbbf24',
                          border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}
                      >
                        {section.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
