'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, BookOpen, Camera, Video, Wifi, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import NewsTicker from '@/components/NewsTicker';
import WisdomQuotes from '@/components/WisdomQuotes';

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
          {[...Array(50)].map((_, i) => (
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
          {[...Array(30)].map((_, i) => (
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

      {/* News Ticker */}
      <NewsTicker />

      <div className="relative z-10 container mx-auto px-4 py-24 max-w-7xl">
        {/* Hero Section */}
        <div className="relative z-10 space-y-4 max-w-4xl">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold font-headline leading-[1.1] tracking-tighter text-gold-foil">
            Mool Gyan
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-300 max-w-3xl leading-relaxed">
            Experience the divine path of self-realization with Sadguru Nitin Sahib&apos;s profound spiritual teachings and satsangs.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32">
          {sections.map((section, index) => (
            <Link href={section.href} key={index} className="group">
              <Card className="h-full bg-white/5 backdrop-blur-xl border-white/20 hover:border-gold-500/50 hover:bg-white/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-gold-500/20">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-all">
                    <section.icon className="h-8 w-8 text-black drop-shadow-lg" />
                  </div>
                  <CardTitle className="text-2xl font-black text-white mb-2 leading-tight">{section.title}</CardTitle>
                  <CardDescription className="text-slate-300 leading-relaxed">{section.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 pb-6">
                  <Button size="lg" variant="ghost" className="w-full bg-gradient-to-r from-gold-500/20 to-amber-500/20 border-white/20 hover:bg-gold-500/30 text-white font-semibold group-hover:scale-105 transition-all backdrop-blur-sm">
                    {section.cta}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Wisdom Quotes */}
        <div className="mt-32">
          <WisdomQuotes />
        </div>
      </div>
    </div>
  );
}
