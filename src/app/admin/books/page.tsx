'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EditBookDialog from '@/components/EditBookDialog';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

interface SupabaseBook {
  id: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  cover_url: string;
  pdf_url?: string;
  stock_status: 'in-stock' | 'out-of-stock' | 'read-only';
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<SupabaseBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<SupabaseBook | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load books.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Delete this book?')) return;
    try {
      await supabase.from('books').delete().eq('id', bookId);
      setBooks(books.filter(b => b.id !== bookId));
      toast({ title: 'Success', description: 'Book deleted.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete book.' });
    }
  };

  const handleBookUpdated = (updatedBook: SupabaseBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setEditingBook(null);
  };

  return (
    <div className="p-6 space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <h1 className="text-3xl font-bold">Manage Books</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image src={book.cover_url} alt={book.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="font-bold mt-2">₹{book.price}</p>

                <div className="mt-4 flex gap-2">
                  <Dialog open={editingBook?.id === book.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditingBook(book)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>

                    {editingBook?.id === book.id && (
                      <EditBookDialog
                        book={editingBook}
                        onOpenChange={(open) => !open && setEditingBook(null)}
                        onBookUpdated={handleBookUpdated}
                      />
                    )}
                  </Dialog>

                  <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}