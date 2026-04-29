'use client';

import { useCollection } from '@/lib/data-manager';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Newspaper, Sparkles } from 'lucide-react';

import { useLocale } from '@/lib/i18n';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const collectionNews = useCollection<NewsItem>('news_items');
  const { t } = useLocale();

  useEffect(() => {
    setNewsItems(collectionNews);
  }, [collectionNews]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-cyan-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl divine-rays animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Enhanced Hero Header */}
        <div className="text-center space-y-12 pt-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-3xl shadow-blue-500/50 divine-rays">
              <Newspaper className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-4xl mb-4">
                NEWS
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
                <p className="text-cyan-300 font-medium text-lg">Latest Updates</p>
                <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Stay updated with the latest announcements, spiritual events, and divine messages from Sadguru Nitin Sahib.
          </p>
        </div>

        {/* News List */}
        <div className="space-y-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-4">
              <Newspaper className="h-8 w-8 text-blue-500 drop-shadow-2xl glow-pulse" />
              Latest Announcements
              <Badge className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 font-bold shadow-lg shadow-blue-500/50">
                {newsItems.length} Updates
              </Badge>
            </h2>
          </div>

          {newsItems.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {newsItems.map((news) => (
                <Card key={news.id} className="bg-white/10 backdrop-blur-xl border-blue-400/40 overflow-hidden group cursor-pointer hover:border-blue-500/70 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 glow-pulse">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">{news.title}</CardTitle>
                        <div className="flex items-center gap-6 text-slate-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span>{formatDate(news.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            <span>{new Date(news.created_at).toLocaleTimeString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-4 py-2 shadow-lg">
                        <Eye className="h-4 w-4 mr-1" />
                        News
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="bg-black/20 rounded-b-2xl p-8 border-t border-blue-500/20">
                      <div className="prose prose-invert max-w-none">
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                          {news.content}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0 flex items-center justify-between">
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300 bg-blue-500/10">
                        Latest Update
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white font-bold">
                        Important
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/3 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-12">
              <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Newspaper className="h-12 w-12 text-blue-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                No News Available
              </h2>
              <p className="text-xl text-slate-400 max-w-lg mx-auto">
                Latest announcements will appear here when admin adds them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
