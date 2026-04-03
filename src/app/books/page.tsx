'use client';

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

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  cover_url: string;
  pdf_url?: string;
  stock_status: 'in-stock' | 'out-of-stock' | 'read-only';
  category?: string;
}

export default function BooksPage() {
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
      image: "https://i.ibb.co/YB8m1tzv/Chat-GPT-Image-Mar-25-2026-12-19-40-PM.png",   // ← Yeh wali image add ki hai
      status: "जल्द आ रहा है"
    }
  ];

  return (
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