'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, BookOpen, Camera, Video, Wifi, Quote } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import NewsTicker from '@/components/NewsTicker';

export default function Home() {
  const { t } = useLocale();

  const sections = [
    {
      title: t.nav_live_satsang,
      description: 'Watch the latest featured spiritual talks and discourses.',
      icon: Wifi,
      href: '/live-satsang',
      cta: 'Watch Now',
    },
    {
      title: t.nav_satsang,
      description: 'Explore the complete archive of all satsang videos.',
      icon: Video,
      href: '/satsang',
      cta: 'View Archive',
    },
    {
      title: t.nav_photos,
      description: 'View a curated gallery of spiritual and inspirational images.',
      icon: Camera,
      href: '/photos',
      cta: 'Explore Gallery',
    },
    {
      title: t.nav_bookstore,
      description: 'Order spiritual books and materials to aid your journey.',
      icon: BookOpen,
      href: '/books',
      cta: 'Visit Store',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden rounded-[2rem] p-8 md:p-12 text-center h-[40vh] md:h-[50vh] flex flex-col justify-center items-center -mx-4 md:-mx-6 lg:-mx-8 border border-white/5 shadow-2xl bg-black">
        <div 
          className="absolute inset-0 -z-10 h-full w-full bg-fixed animate-pan-background"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=100&w=3840&auto=format&fit=crop')",
            backgroundSize: '200% 100%',
            backgroundRepeat: 'repeat-x'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-bold font-headline leading-[1.1] tracking-tighter text-gold-foil">
            {t.app_name}
          </h1>
          
          <div className="mt-4 max-w-2xl mx-auto text-base md:text-xl text-white/90 font-medium">
            <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 inline-block">
              "सोई गुरु पूरा कहावे दो अक्षर का भेद बताये<br/>
              एक छुडाये एक लखाए तब प्राणी निज घर को पाए ......"<br/>
              <div className="my-1 opacity-50">......</div>
              <span className="text-primary not-italic block font-bold tracking-widest uppercase text-[10px] md:text-xs">साहिब बंदगी सतनाम</span>
            </div>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="px-2">
        <NewsTicker />
      </div>

      {/* Daily Wisdom (Static - No Firebase) */}
      <section className="flex justify-center px-4">
        <div className="relative p-3 rounded-2xl glass-card overflow-hidden text-center group max-w-sm w-full border-primary/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
          <div className="absolute top-1 right-2 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
            <Quote size={16} className="text-primary" />
          </div>
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-[8px] mb-1">Daily Wisdom</h2>
          
          <div className="px-2">
            <p className="text-sm md:text-base font-headline text-white/90 leading-snug italic">
              "सतगुरु की कृपा से ही जीवात्मा को मुक्ति मिलती है।"
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-widest text-primary/80 uppercase">— श्री नितिनदास जी साहिब</p>
          </div>
          
          <div className="mt-2 h-0.5 w-6 bg-primary/30 mx-auto rounded-full" />
        </div>
      </section>

      {/* Feature Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {sections.map((section, index) => (
          <Link 
            href={section.href} 
            key={section.title} 
            className="group block animate-fade-in-up relative overflow-hidden rounded-[1.5rem] h-full"
          >
            <Card className="h-full bg-zinc-950/60 border-white/10 backdrop-blur-2xl text-white transition-all duration-500 hover:bg-zinc-900/80 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:-translate-y-1">
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline tracking-tight group-hover:text-primary transition-colors duration-300">{section.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 relative z-10">
                <CardDescription className="text-white/60 text-base leading-relaxed">{section.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-2 relative z-10 border-t border-white/5 mt-auto">
                <div className="text-[10px] font-bold text-primary flex items-center gap-2 tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3">
                  {section.cta} <ArrowRight className="h-4 w-4" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}