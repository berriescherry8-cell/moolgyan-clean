'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, ShoppingCart, Sparkles, Library, Star, 
  Heart, TrendingUp, ArrowRight, Package, Gift
} from 'lucide-react';
import { useCollection } from '@/lib/data-manager';
import BookOrderDialog from '@/components/BookOrderDialog';
import { useLocale } from '@/lib/i18n';

interface Book {
  id: string;
  title: string;
  author_name?: string;
  author?: string;
  price: number | string;
  description: string;
  cover_image_url?: string;
  cover_url?: string;
  pdf_url?: string;
  stock_status: string;
  category?: string;
  is_featured?: boolean;
}

export default function BooksPage() {
  const books = useCollection<Book>('books');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { t } = useLocale();

  const handleOrderClick = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBook(book);
    setIsOrderDialogOpen(true);
  };

  const handlePdfDownload = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    if (!book.pdf_url) return;
    const link = document.createElement('a');
    link.href = book.pdf_url;
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCoverUrl = (book: Book): string | null => {
    return book.cover_image_url || book.cover_url || null;
  };

  const getAuthor = (book: Book): string => {
    return book.author_name || book.author || '';
  };

  const isReadOnly = (book: Book): boolean => {
    return book.stock_status?.includes('read') || Number(book.price) === 0;
  };

  // Custom book ordering
  const bookOrderMap: Record<string, number> = {
    'विदेही ज्ञान': 1,
    'संतो का सार सन्देश': 2,
    'हर-हर गीता 4': 3,
    'हर-हर गीता 3': 4,
    'हर-हर गीता 2': 5,
    'हर-हर गीता 1': 6,
    'हर-हर गीता': 7,
    'मूलज्ञान का दिव्य प्रकाश': 8,
    'सत्यनाम': 9,
  };

  const getBookSortOrder = (book: Book): number => {
    // Check for exact matches first
    for (const [title, order] of Object.entries(bookOrderMap)) {
      if (book.title?.includes(title)) return order;
    }
    return 100; // Default to end
  };

  const sortedBooks = [...books].sort((a, b) => getBookSortOrder(a) - getBookSortOrder(b));
  const featuredBooks = sortedBooks.filter(b => b.is_featured);
  const regularBooks = sortedBooks.filter(b => !b.is_featured);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center pt-8 pb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-2xl shadow-orange-500/30 mb-8">
            <Library className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Divine <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent">Bookstore</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('spiritual_books') || 'Discover spiritual wisdom through sacred texts and divine literature'}
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-400" /> {books.length} Books
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" /> {featuredBooks.length} Featured
            </span>
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" /> Sacred Knowledge
            </span>
          </div>
        </div>

        {/* Featured Books Section */}
        {featuredBooks.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-3xl font-bold text-white">Featured Books</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent ml-4" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredBooks.map((book, index) => {
                const coverUrl = getCoverUrl(book);
                const author = getAuthor(book);
                const readOnly = isReadOnly(book);
                
                return (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Card className="relative bg-slate-900/80 backdrop-blur-xl border-slate-700/50 overflow-hidden rounded-2xl">
                      <div className="relative h-64 overflow-hidden">
                        {coverUrl ? (
                          <Image 
                            src={coverUrl} 
                            alt={book.title} 
                            fill 
                            className="object-contain transition-transform duration-700 group-hover:scale-110" 
                            unoptimized 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <BookOpen className="h-20 w-20 text-slate-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        
                        <Badge className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold px-3 py-1">
                          <Star className="h-3 w-3 mr-1 fill-black" /> Featured
                        </Badge>
                        
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {book.pdf_url && (
                            <Button 
                              size="sm"
                              className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0"
                              onClick={(e) => handlePdfDownload(e, book)}
                            >
                              <BookOpen className="mr-1 h-4 w-4" /> PDF
                            </Button>
                          )}
                          {!readOnly && (
                            <Button 
                              size="sm"
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold"
                              onClick={(e) => handleOrderClick(e, book)}
                            >
                              <ShoppingCart className="mr-1 h-4 w-4" /> Order
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-lg text-white mb-1">{book.title}</h3>
                        {author && <p className="text-orange-400 text-sm mb-2">{author}</p>}
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3">{book.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-bold text-lg">
                            {readOnly ? 'Free' : `₹${book.price}`}
                          </span>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {book.category || 'Spiritual'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* All Books Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">All Books</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent ml-4" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regularBooks.map((book, index) => {
              const coverUrl = getCoverUrl(book);
              const author = getAuthor(book);
              const readOnly = isReadOnly(book);
              
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-800 overflow-hidden rounded-xl hover:border-orange-500/30 transition-colors duration-300">
                    <div className="relative h-56 overflow-hidden group">
                      {coverUrl ? (
                        <Image 
                          src={coverUrl} 
                          alt={book.title} 
                          fill 
                          className="object-contain transition-transform duration-500 group-hover:scale-105" 
                          unoptimized 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
                      {author && <p className="text-orange-400/80 text-xs mb-2">{author}</p>}
                      <p className="text-slate-500 text-xs line-clamp-2 mb-3">{book.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-400 font-semibold">
                          {readOnly ? 'Free' : `₹${book.price}`}
                        </span>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
                          {book.stock_status?.replace('_', ' ') || 'Available'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {book.pdf_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                            onClick={(e) => handlePdfDownload(e, book)}
                          >
                            <BookOpen className="mr-1 h-3 w-3" /> PDF
                          </Button>
                        )}
                        {!readOnly && (
                          <Button 
                            size="sm"
                            className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 text-black font-bold"
                            onClick={(e) => handleOrderClick(e, book)}
                          >
                            <ShoppingCart className="mr-1 h-3 w-3" /> Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Divine Merchandise Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Gift className="h-6 w-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">दिव्य मर्चेंडाइज़</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent ml-4" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* T-Shirt */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative bg-slate-900/80 backdrop-blur-xl border-slate-700/50 overflow-hidden rounded-2xl">
                <div className="relative h-72 overflow-hidden">
                  <Image 
                    src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/t%20shirt%20.png"
                    alt="Mool Gyan T-Shirt"
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-purple-500/90 text-white font-bold px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" /> जल्द आ रहा है
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-xl text-white mb-2">मूल ज्ञान दिव्य टी-शर्ट</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Join KGF (Kabir Guru Fouj) - श्री नितिनदास जी के सानिध्य में सत्संग और भजन के लिए विशेष।
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      <Package className="h-3 w-3 mr-1" /> जल्द आ रहा है
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Diary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative bg-slate-900/80 backdrop-blur-xl border-slate-700/50 overflow-hidden rounded-2xl">
                <div className="relative h-72 overflow-hidden">
                  <Image 
                    src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/ChatGPT%20Image%20Mar%2025,%202026,%2012_19_40%20PM.png"
                    alt="Mool Gyan Diary"
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-emerald-500/90 text-white font-bold px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" /> जल्द आ रहा है
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-xl text-white mb-2">मूल ज्ञान आध्यात्मिक डायरी</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    KGF (Kabir Guru Fouj) द्वारा - अपनी साधना और दैनिक ज्ञान वचन लिखने के लिए एक सुंदर साथी।
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                      <Package className="h-3 w-3 mr-1" /> जल्द आ रहा है
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {books.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl text-white">No Books Available</h2>
            <p className="text-slate-500">Books will appear here when added.</p>
          </div>
        )}
      </div>

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
