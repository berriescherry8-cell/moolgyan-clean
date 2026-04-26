'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { useCollection } from '@/lib/data-manager';
import BookOrderDialog from '@/components/BookOrderDialog';
import { useLocale } from '@/lib/i18n';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number | string;
  description: string;
  cover_url: string;
  pdf_url?: string;
  stock_status: 'in-stock' | 'out-of-stock' | 'read-only';
  category?: string;
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
    link.download = book.title.replace(/[^a-zA-Z0-9\s]/g, '') + '.pdf';
    link.setAttribute('target', '_blank');
    link.setAttribute('type', 'application/pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedBooks = [...books];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center pt-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2">Bookstore</h1>
          <p className="text-slate-400">{t('spiritual_books') || 'Spiritual Knowledge Books'}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBooks.map((book) => {
            const isReadOnly = book.stock_status === 'read-only' || book.price === 0;
            return (
              <Card key={book.id} className="bg-slate-900 border-slate-700 overflow-hidden">
                <div className="relative h-56">
                  <Image src={book.cover_url} alt={book.title} fill className="object-cover" unoptimized />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-white">{book.title}</h3>
                  <p className="text-orange-400 text-sm">{book.author}</p>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">{book.description}</p>
                  <div className="flex flex-col gap-2 mt-4">
                    {book.pdf_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-orange-500/40 text-orange-300 hover:bg-orange-500/20"
                        onClick={(e) => handlePdfDownload(e, book)}
                      >
                        <BookOpen className="mr-2 h-4 w-4" /> PDF Download
                      </Button>
                    )}
                    {!isReadOnly && (
                      <Button size="sm" onClick={(e) => handleOrderClick(e, book)} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Order Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {books.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl text-white">No Books Available</h2>
            <p className="text-slate-400">Books will appear here when added.</p>
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
