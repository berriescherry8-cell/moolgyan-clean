'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  Plus,
  Search,
  Filter,
  DollarSign,
  Package,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { Book } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface BookFormData {
  title: string;
  description: string;
  author: string;
  price: number;
  isbn: string;
  category: string;
  tags: string[];
  cover_image_url: string;
  pdf_url: string;
  is_active: boolean;
  for_sale: boolean;
  stock_quantity: number;
}

export default function BooksManagementPage() {
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    author: '',
    price: 0,
    isbn: '',
    category: 'general',
    tags: [],
    cover_image_url: '',
    pdf_url: '',
    is_active: true,
    for_sale: false,
    stock_quantity: 0
  });

  const books = useCollection<Book>('books');

  const categories = [
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'bhajans', label: 'Bhajans' },
    { value: 'stories', label: 'Stories' },
    { value: 'general', label: 'General' }
  ];

  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && book.is_active) ||
                         (filterStatus === 'inactive' && !book.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = getSupabase();
    if (!supabase) {
      toast({ variant: 'destructive', title: 'Error', description: 'Supabase client not available' });
      setUploading(false);
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `books/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('moolgyan-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('moolgyan-media')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'cover' ? 'cover_image_url' : 'pdf_url']: publicUrl
      }));

      toast({ 
        title: 'Success', 
        description: `${type === 'cover' ? 'Cover image' : 'PDF'} uploaded successfully` 
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Upload Failed', 
        description: error.message || 'Failed to upload file' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveBook = async () => {
    if (!formData.title || !formData.author) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and author are required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const bookData = {
        title: formData.title,
        description: formData.description,
        author: formData.author,
        price: formData.price,
        isbn: formData.isbn,
        category: formData.category,
        tags: formData.tags,
        cover_image_url: formData.cover_image_url,
        pdf_url: formData.pdf_url,
        is_active: formData.is_active,
        for_sale: formData.for_sale,
        stock_quantity: formData.stock_quantity,
        updated_at: new Date().toISOString()
      };

      if (editingBook) {
        await supabase.from('books').update(bookData).eq('id', editingBook.id);
        toast({ title: 'Success', description: 'Book updated successfully' });
      } else {
        const newBook = {
          ...bookData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('books').insert(newBook);
        toast({ title: 'Success', description: 'Book added successfully' });
      }

      setFormData({
        title: '',
        description: '',
        author: '',
        price: 0,
        isbn: '',
        category: 'general',
        tags: [],
        cover_image_url: '',
        pdf_url: '',
        is_active: true,
        for_sale: false,
        stock_quantity: 0
      });
      setEditingBook(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save book' 
      });
    }
  };

  const handleDeleteBook = async (book: Book) => {
    setProcessingId(book.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('books').delete().eq('id', book.id);

      // Delete files from storage
      if (book.cover_image_url?.includes('moolgyan-media')) {
        const filePath = book.cover_image_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('moolgyan-media').remove([`books/cover/${filePath}`]);
        }
      }
      if (book.pdf_url?.includes('moolgyan-media')) {
        const filePath = book.pdf_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('moolgyan-media').remove([`books/pdf/${filePath}`]);
        }
      }

      toast({ title: 'Success', description: 'Book deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete book' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description || '',
      author: book.author || '',
      price: book.price || 0,
      isbn: book.isbn || '',
      category: book.category || 'general',
      tags: book.tags || [],
      cover_image_url: book.cover_image_url || '',
      pdf_url: book.pdf_url || '',
      is_active: book.is_active !== false,
      for_sale: book.for_sale || false,
      stock_quantity: book.stock_quantity || 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books Management</h1>
          <p className="text-muted-foreground">Manage books, pricing, and inventory</p>
        </div>
        <Button onClick={() => setEditingBook(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Book Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
          <CardDescription>
            Fill in the book details and upload cover image and PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Book title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="ISBN number"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  id="for_sale"
                  checked={formData.for_sale}
                  onCheckedChange={(checked) => setFormData({ ...formData, for_sale: checked })}
                />
                <Label htmlFor="for_sale">Available for Sale</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Book description"
              rows={4}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Cover Image</Label>
              <div className="mt-2">
                {formData.cover_image_url ? (
                  <div className="relative">
                    <img
                      src={formData.cover_image_url}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Upload cover image</p>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>PDF File</Label>
              <div className="mt-2">
                {formData.pdf_url ? (
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="text-sm">PDF uploaded</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(formData.pdf_url, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData({ ...formData, pdf_url: '' })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Upload PDF file</p>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveBook}>
              {editingBook ? 'Update' : 'Save'} Book
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingBook(null);
                setFormData({
                  title: '',
                  description: '',
                  author: '',
                  price: 0,
                  isbn: '',
                  category: 'general',
                  tags: [],
                  cover_image_url: '',
                  pdf_url: '',
                  is_active: true,
                  for_sale: false,
                  stock_quantity: 0
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative bg-gray-100">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={book.is_active !== false ? 'default' : 'secondary'}>
                  {book.is_active !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {book.for_sale && (
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${book.price || 0}
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              {book.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
              )}
              <div className="flex flex-wrap gap-1 mb-3">
                {book.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(book)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {book.pdf_url && (
                  <Button variant="outline" size="sm" onClick={() => window.open(book.pdf_url, '_blank')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteBook(book)}
                  disabled={processingId === book.id}
                >
                  {processingId === book.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Add your first book to get started'
              }
            </p>
            <Button onClick={() => setEditingBook(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
