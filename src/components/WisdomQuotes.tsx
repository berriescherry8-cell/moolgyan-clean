<<<<<<< HEAD
import React from 'react';

export function WisdomQuotes() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Wisdom Quotes</h1>
      <p className="text-zinc-400">This feature is under development.</p>
    </div>
=======
'use client';

import { useCollection } from '@/lib/data-manager';
import { Quote } from 'lucide-react';

interface WisdomQuote {
  id: string;
  quote: string;
  author?: string;
  is_daily?: boolean;
  created_at: string;
}

export default function WisdomQuotes() {
  const quotes = useCollection<WisdomQuote>('wisdom_quotes');
  
  // Get a random quote or the latest daily quote
  const currentQuote = quotes.length > 0 
    ? quotes.find(q => q.is_daily) || quotes[Math.floor(Math.random() * quotes.length)]
    : null;

  if (!currentQuote) {
    return null;
  }

  return (
    <section className="flex justify-center px-4">
      <div className="relative p-3 rounded-2xl glass-card overflow-hidden text-center group max-w-sm w-full border-primary/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
        <div className="absolute top-1 right-2 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote size={16} className="text-primary" />
        </div>
        <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-[8px] mb-1">Daily Wisdom</h2>
        
        <div className="px-2">
          <p className="text-sm md:text-base font-headline text-white/90 leading-snug italic">
            "{currentQuote.quote}"
          </p>
          {currentQuote.author && (
            <p className="mt-1 text-[9px] font-bold tracking-widest text-primary/80 uppercase">
              — {currentQuote.author}
            </p>
          )}
        </div>
        
        <div className="mt-2 h-0.5 w-6 bg-primary/30 mx-auto rounded-full" />
      </div>
    </section>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  );
}