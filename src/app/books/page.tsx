'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, Expand, Shirt, Notebook, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);
=======
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, Sparkles, Book, Badge } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';

import BookOrderDialog from '@/components/BookOrderDialog';
import { useLocale } from '@/lib/i18n';


>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

interface Book {
  id: string;
  title: string;
  author: string;
<<<<<<< HEAD
  price: number;
=======
  price: number | string;
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  description: string;
  cover_url: string;
  pdf_url?: string;
  stock_status: 'in-stock' | 'out-of-stock' | 'read-only';
  category?: string;
}

export default function BooksPage() {
<<<<<<< HEAD
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOrderClick = () => {
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegbq8uEHe7g3-QZB1qZme4h5uOH-DcwlHbmTx5qJeO-F_8tw/viewform`;
    window.open(googleFormUrl, '_blank');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('books')
          .select('*');

        if (error) throw error;

        // Custom sorting
        const orderMap: { [key: string]: number } = {
          "विदेही ज्ञान": 1,
          "संतों का सार संदेश": 2,
          "हर हर गीता": 3,
        };

        const sortedBooks = [...(data || [])].sort((a, b) => {
          const orderA = orderMap[a.title] ?? 100;
          const orderB = orderMap[b.title] ?? 100;
          return orderA - orderB;
        });

        setBooks(sortedBooks);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Upcoming Merchandise Section (T-Shirt + Diary)
=======
  const books = useCollection<Book>('books');
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = React.useState(false);
  const { t } = useLocale();

  const handleOrderClick = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBook(book);
    setIsOrderDialogOpen(true);
  };

  // Custom sorting
  const orderMap: { [key: string]: number } = {
    "विदेही ज्ञान": 1,
    "संतों का सार संदेश": 2,
    "हर हर गीता": 3,
  };

  const sortedBooks = [...books].sort((a, b) => {
    const orderA = orderMap[a.title] ?? 100;
    const orderB = orderMap[b.title] ?? 100;
    return orderA - orderB;
  });

  // Upcoming Merchandise Section
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  const upcomingMerch = [
    {
      title: "नितिनदास जी टी-शर्ट",
      description: "नितिनदास जी के प्रेरणादायक संदेशों और आध्यात्मिक चित्रण के साथ बनाया गया विशेष टी-शर्ट। उच्च गुणवत्ता वाले कपड़े और आरामदायक फिट।",
      image: "https://i.ibb.co/hFNq1zd7/t-shirt.png",
      status: "जल्द आ रहा है"
    },
    {
      title: "आध्यात्मिक डायरी",
      description: "नितिनदास जी के ज्ञानवर्धक उद्धरणों और आध्यात्मिक प्रेरणा से भरी हुई विशेष डायरी। रोज़ाना लिखने और चिंतन के लिए आदर्श।",
<<<<<<< HEAD
      image: "https://i.ibb.co/YB8m1tzv/Chat-GPT-Image-Mar-25-2026-12-19-40-PM.png",   // ← Yeh wali image add ki hai
=======
      image: "https://i.ibb.co/YB8m1tzv/Chat-GPT-Image-Mar-25-2026-12-19-40-PM.png",
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      status: "जल्द आ रहा है"
    }
  ];

  return (
<<<<<<< HEAD
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">मूल ज्ञान की पुस्तकें</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => {
          const isReadOnly = book.stock_status === 'read-only' || book.price === 0;

          return (
            <Card key={book.id} className="overflow-hidden shadow-lg bg-zinc-900 border-zinc-800">
              <div className="relative h-64 cursor-pointer" onClick={() => window.open(book.cover_url, '_blank')}>
                <Image src={book.cover_url} alt={book.title} fill className="object-cover" unoptimized />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-white line-clamp-2">{book.title}</h2>
                <p className="text-zinc-400 text-sm mt-1">{book.author}</p>

                <div className="mt-3">
                  {isReadOnly ? (
                    <Badge variant="secondary">केवल पढ़ने हेतु</Badge>
                  ) : (
                    <span className="text-2xl font-semibold text-amber-500">₹{book.price}</span>
                  )}
                </div>

                <p className="text-sm text-zinc-500 mt-3 line-clamp-3">{book.description}</p>

                <div className="mt-5 flex gap-3">
                  {book.pdf_url && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={book.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" /> पढ़ें
                      </a>
                    </Button>
                  )}
                  {!isReadOnly && (
                    <Button onClick={handleOrderClick} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                      <ShoppingCart className="mr-2 h-4 w-4" /> ऑर्डर करें
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Merchandise Section - Updated with Diary Image */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-4">आगामी मर्चेंडाइज़</h2>
        <p className="text-center text-zinc-400 mb-10">नितिनदास जी के संदेशों के साथ विशेष उत्पाद</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {upcomingMerch.map((item, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative h-80">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover" 
                  unoptimized 
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-red-600 font-semibold px-4 py-1 text-sm">
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" disabled className="flex-1 border-zinc-700">
                    <Shirt className="mr-2 h-4 w-4" />
                    जल्द उपलब्ध
                  </Button>
                  <Button variant="outline" disabled className="flex-1 border-zinc-700">
                    अधिसूचना प्राप्त करें
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
=======
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-indigo-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl divine-rays animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Enhanced Hero Header */}
        <div className="text-center space-y-12 pt-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl shadow-3xl shadow-purple-500/50 divine-rays">
              <BookOpen className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-600 bg-clip-text text-transparent drop-shadow-4xl mb-4">
                BOOKSTORE
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                <p className="text-indigo-300 font-medium text-lg">{t('spiritual_books') || 'Spiritual Knowledge Books'}</p>
                <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Discover transformative spiritual books revealing Kabir Sahib&apos;s 13th path through Sadguru Nitin Sahib&apos;s divine knowledge.
          </p>
        </div>



        
        {/* Books Grid */}
        <div className="space-y-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-6">
              <BookOpen className="h-20 w-20 text-orange-500 drop-shadow-2xl glow-pulse" />
              Spiritual Bookstore
              <Badge className="text-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 font-bold shadow-lg shadow-orange-500/50">
                {books.length} Books
              </Badge>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedBooks.map((book) => {
              const isReadOnly = book.stock_status === 'read-only' || book.price === 0;

              return (
                <Card key={book.id} className="bg-white/5 backdrop-blur-xl border-orange-400/40 overflow-hidden group cursor-pointer hover:border-orange-500/70 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 glow-pulse" onClick={() => window.open(book.cover_url, '_blank')}>
                  <div className="relative h-64 overflow-hidden">
                    <Image src={book.cover_url} alt={book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <CardContent className="p-6 pt-0">
                    <h3 className="font-black text-white text-xl mb-2 line-clamp-2 drop-shadow-lg">{book.title}</h3>
                    <p className="text-orange-300 font-medium mb-1">{book.author}</p>

                    <div className="mt-3 mb-4">
                      {isReadOnly ? (
                        <Badge variant="secondary" className="bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white font-bold">
                          केवल पढ़ने हेतु
                        </Badge>
                      ) : (
                        <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                          ₹{book.price}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 leading-relaxed text-sm line-clamp-3 mb-6">{book.description}</p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {book.pdf_url && (
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-white/10 border-orange-400/50 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = book.pdf_url!;
                            link.download = book.title.replace(/[^a-zA-Z0-9\s]/g, '') + '.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <BookOpen className="mr-2 h-4 w-4" /> PDF डाउनलोड
                        </Button>
                      )}
                      {!isReadOnly && (
                        <Button onClick={(e) => handleOrderClick(e, book)} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold shadow-lg shadow-orange-500/25">
                          <ShoppingCart className="mr-2 h-4 w-4" /> ऑर्डर करें
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {books.length === 0 && (
            <div className="text-center py-32 bg-white/3 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-12">
              <div className="bg-gradient-to-br from-orange-500/30 to-amber-500/30 w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-orange-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text">
                No Books Available
              </h2>
              <p className="text-xl text-slate-400 max-w-lg mx-auto">
                Spiritual books will appear here when added.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Merchandise */}
        <div className="space-y-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-center flex items-center gap-6 justify-center mx-auto">
            <Sparkles className="h-20 w-20 text-amber-500 drop-shadow-2xl" />
            Upcoming Merchandise
          </h2>
          <p className="text-center text-slate-300 text-xl max-w-3xl mx-auto">
            Special products infused with Sadguru Nitin Sahib&apos;s divine messages
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {upcomingMerch.map((item, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-orange-400/30 overflow-hidden group hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/30 transition-all glow-pulse">
                <div className="relative h-80 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-4 py-2 shadow-lg">
                    {item.status}
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-8">{item.description}</p>
                  <Button variant="outline" disabled className="w-full border-orange-400/50 text-orange-300 hover:bg-orange-500/20 backdrop-blur">
                    Soon Available
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Order Dialog */}
      <BookOrderDialog 
        book={selectedBook}
        isOpen={isOrderDialogOpen}
        onClose={() => {
          setIsOrderDialogOpen(false);
          setSelectedBook(null);
        }}
      />
    </div>
  );
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
