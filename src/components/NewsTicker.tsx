'use client';

import React, { useState, useEffect } from 'react';
import { useCollection } from '@/lib/data-manager';
import { NewsArticle } from '@/lib/types';

export default function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const articles = useCollection<NewsArticle>('news_items');

  if (!articles || articles.length === 0) {
    return null;
  }

  const repeatedContent = Array(50).fill(0).map((_, i) => (
    <span key={i}>
      {articles.map((article, j) => (
        <span key={j} className="mx-8 hover:underline cursor-pointer text-sm font-medium">
          {article.title}
        </span>
      ))}
    </span>
  )).flat();

  return (
    <div 
      className="bg-gradient-to-r from-black/80 via-amber-500/20 to-black/80 backdrop-blur-lg border-b border-amber-500/30 overflow-hidden py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div className="inline-block animate-marquee-reverse whitespace-nowrap"
             style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
          {repeatedContent}
        </div>
      </div>
    </div>
  );
}
