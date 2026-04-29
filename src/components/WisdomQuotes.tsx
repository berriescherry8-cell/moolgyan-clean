'use client';

import React from 'react';
import { useCollection } from '@/lib/data-manager';
import { Quote as QuoteIcon } from 'lucide-react';

interface WisdomQuote {
  id: string;
  text?: string;
  quote_text?: string;
  author: string;
  category?: string;
}

export function WisdomQuotes() {
  const quotes = useCollection<WisdomQuote>('wisdom_quotes');

  if (!quotes || quotes.length === 0) {
    return (
      <div className="py-20 text-center">
        <QuoteIcon className="h-24 w-24 text-amber-500 mx-auto mb-6 opacity-50" />
        <p className="text-xl text-zinc-500">Wisdom quotes loading...</p>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-r from-amber-50/20 to-orange-50/20 backdrop-blur-sm rounded-3xl">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <QuoteIcon className="h-20 w-20 mx-auto mb-6 text-amber-500 drop-shadow-lg" />
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
            Wisdom Quotes
          </h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Timeless wisdom to guide your spiritual journey and daily life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.slice(0, 9).map((quote, index) => (
            <div
              key={quote.id}
              className="group bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/50 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <QuoteIcon className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
                <div>
                  <p className="text-2xl leading-relaxed font-medium text-zinc-800 mb-4 italic group-hover:text-amber-800 transition-colors line-clamp-4">
                    {quote.quote_text || quote.text || ''}
                  </p>
                  <p className="text-lg font-semibold text-zinc-700 group-hover:text-amber-700 transition-colors">
                    — {quote.author}
                  </p>
                </div>
              </div>
              {quote.category && (
                <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
                  {quote.category}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <button className="px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-2xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25">
            View All Quotes
          </button>
        </div>
      </div>
    </div>
  );
}

export default WisdomQuotes;
