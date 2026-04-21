'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';
import { useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  cover_url?: string;
  pdf_url?: string;
  stock_status: 'in-stock' | 'out-of-stock';
  type: 'book' | 'franchise_item';
  for_sale: boolean;
  created_at: string;
}

export default function ManageBooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const collectionBooks = useCollection<Book>('books');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    description: '',
    cover_url: '',
    pdf_url: '',
    stock_status: 'in-stock' as const,
    type: 'book' as const,
    for_sale: true,
  });
  const [saving, setSaving] = useState(false);

  // Load books
  useEffect(() => {
    setBooks(collectionBooks);
    setLoading(false);
  }, [collectionBooks]);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: 0,
      description: '',
      cover_url: '',
      pdf_url: '',
      stock_status: 'in-stock',
      type: 'book',
      for_sale: true,
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      toast({ variant: "destructive", description: "Title and author required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('books', formData, editingBook?.id);
      toast({ description: editingBook ? "Book updated" : "Book added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('books', id);
      toast({ description: "Book deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description || '',
      cover_url: book.cover_url || '',
      pdf_url: book.pdf_url || '',
      stock_status: book.stock_status as 'in-stock' | 'out-of-stock',
      type: book.type as 'book' | 'franchise_item',
      for_sale: book.for_sale,
    });
    setEditingBook(book);
    setShowForm(true);
  };

  const availableBooks = books.filter(b => b.for_sale === true);
  const notForSaleBooks = books.filter(b => b.for_sale === false);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Manage Bookstore
            </h1>
            <p className="text-slate-400 mt-1">Books & Franchise Items (Stock, Sale Toggle)</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingBook ? 'Edit' : 'Add New'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>For Sale ({availableBooks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : availableBooks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No books for sale. Add some!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>${book.price}</TableCell>
                        <TableCell>
                          <Badge variant={book.stock_status === 'in-stock' ? "default" : "secondary"}>
                            {book.stock_status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge>{book.type.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Book?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {book.title}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(book.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Not For Sale ({notForSaleBooks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {notForSaleBooks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">All books available for sale</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notForSaleBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                            Edit / Toggle Sale
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <Label>Author / Writer *</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Author name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="franchise_item">Franchise Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Stock Status</Label>
                  <Select value={formData.stock_status} onValueChange={(v) => setFormData({...formData, stock_status: v as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.for_sale}
                    onCheckedChange={(checked) => setFormData({...formData, for_sale: checked})}
                  />
                  <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    For Sale
                  </Label>
                </div>
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Book description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cover Image URL (optional)</Label>
                  <Input
                    value={formData.cover_url}
                    onChange={(e) => setFormData({...formData, cover_url: e.target.value})}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
                <div>
                  <Label>PDF URL (optional)</Label>
                  <Input
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                    placeholder="https://example.com/book.pdf"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription>
              {books.length} total items | {availableBooks.length} for sale | {notForSaleBooks.length} not for sale
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
  );
}
