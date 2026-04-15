'use client';

import { useCollection } from '@/lib/data-manager';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const collectionNews = useCollection<NewsItem>('news_items');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            News & Updates
          </h1>
          <Badge className="text-xl px-6 py-2 bg-blue-500/90 text-white">Latest Announcements</Badge>
        </div>

        {/* News List */}
        {newsItems.length > 0 ? (
          <div className="space-y-8">
            {newsItems.map((news) => (
              <Card key={news.id} className="bg-black/30 backdrop-blur-lg border-white/20 overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{news.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-slate-400 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(news.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(news.created_at).toLocaleTimeString('en-IN')}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Newspaper className="h-5 w-5" />
                      <span className="text-sm">News</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                        {news.content}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Latest Update</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Important
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Newspaper className="mx-auto h-24 w-24 text-slate-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-400 mb-4">No News Available</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              News and announcements will appear here when admin adds them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}