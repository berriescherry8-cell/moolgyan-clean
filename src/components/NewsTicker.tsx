
'use client';

import { Newspaper } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useCollection } from '@/lib/data-manager';
import { NewsArticle } from '@/lib/types';

const NewsTicker = () => {
  const [isPaused, setIsPaused] = useState(false);
  const articles = useCollection<NewsArticle>('news');

  if (!articles || articles.length === 0) {
    return null;
  }

  const headlines = articles.filter(a => a.showInTicker).map(article => article.title || '').filter(Boolean);
  const singlePassContent = headlines.join('  •  ');
  // Repeat content to ensure it's long enough for a smooth marquee effect on all screen sizes
  const repeatedContent = (singlePassContent + '  •  ').repeat(10);

  return (
    <div
        className="relative flex w-full items-center overflow-hidden bg-zinc-900/70 backdrop-blur-sm rounded-lg border border-white/10 group p-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-white/5 opacity-80 animate-shine pointer-events-none" />

      <div className="flex-shrink-0 px-2">
        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
            <Newspaper className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 whitespace-nowrap overflow-hidden">
        <div
          className="inline-block animate-marquee"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          <span className="font-semibold mx-4 text-sm tracking-wider" style={{ textShadow: '0 0 5px hsl(var(--primary) / 0.5)' }}>{repeatedContent}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
