'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { translations } from '@/lib/i18n/locales';
import type { NewsArticle } from '@/lib/types';
import { Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useCollection } from '@/lib/data-manager';

export default function NewsPage() {
  const t = translations['en']; 
  const articles = useCollection<NewsArticle>('newsArticles');

  return (
      <div>
        <h1 className="text-4xl font-bold mb-2 font-headline">{t.news_title}</h1>
        <p className="text-lg text-muted-foreground mb-8">आप इस पेज पर वर्तमान और आगामी सत्संग की सूचना प्राप्त कर सकते हैं</p>
        {articles && articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            {articles.sort((a, b) => new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()).map((article) => {
              return (
                 <Dialog key={article.id}>
                    <DialogTrigger asChild>
                        <Card className="flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 group cursor-pointer">
                        <div className="md:w-1/3 w-full h-48 md:h-auto relative block overflow-hidden">
                            {article.imageUrl ? (
                                <Image
                                src={article.imageUrl}
                                alt={article.title || 'News article image'}
                                fill
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted">
                                    <Newspaper className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="md:w-2/3 w-full p-6">
                            <CardHeader className="p-0">
                            <CardTitle>{article.title}</CardTitle>
                            <CardDescription>{new Date(article.publicationDate || '').toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                            <p className={cn("text-muted-foreground leading-snug line-clamp-3")}>{article.content}</p>
                            </CardContent>
                        </div>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                        <DialogHeader className="p-2 absolute top-2 right-2 z-10">
                           <DialogClose asChild>
                             <button className="bg-background/50 rounded-full p-1 text-foreground/70 hover:text-foreground/100">
                               <span className="sr-only">Close</span>
                             </button>
                           </DialogClose>
                        </DialogHeader>
                        {article.imageUrl && (
                          <div className="relative w-full h-[85vh]">
                              <Image src={article.imageUrl} alt={`Enlarged news image for ${article.title}`} fill className="object-contain" />
                          </div>
                        )}
                    </DialogContent>
                </Dialog>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-2xl font-semibold">No News Yet</h3>
              <p className="text-muted-foreground mt-2">Check back soon for the latest spiritual news and updates.</p>
            </div>
        )}
      </div>
  );
}
