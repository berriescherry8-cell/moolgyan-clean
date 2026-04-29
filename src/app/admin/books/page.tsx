'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Package,
  DollarSign,
  Archive,
  ShoppingCart,
  FileText,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/data-manager';

interface Book {
  id: string;
  title: string;
  slug: string;
  description?: string;
  author_name?: string;
  cover_image_url?: string;
  pdf_url?: string;
  price: number;
  stock_status: 'in_stock' | 'out_of_stock';
  access_mode: 'read_only' | 'sell_only';
  isbn?: string;
  publisher?: string;
  publication_date?: string;
  pages?: number;
  language: string;
  category?: string;
  tags?: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BookFormData {
  title: string;
  slug: string;
  description: string;
  author_name: string;
  cover_image_url: string;
  pdf_url: string;
  price: number;
  stock_status: 'in_stock' | 'out_of_stock';
  access_mode: 'read_only' | 'sell_only';
  isbn: string;
  publisher: string;
  publication_date: string;
  pages: number;
  language: string;
  category: string;
  tags: string[];
  is_featured: boolean;
}

export default function BooksManagementPage() {
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    slug: '',
    description: '',
    author_name: '',
    cover_image_url: '',
    pdf_url: '',
    price: 0,
    stock_status: 'in_stock',
    access_mode: 'sell_only',
    isbn: '',
    publisher: '',
    publication_date: '',
    pages: 0,
    language: 'Hindi',
    category: '',
    tags: [],
    is_featured: false
  });

  const categories = [
    'Spiritual', 'Philosophy', 'Meditation', 'Yoga', 'Self-Help', 
    'Biography', 'Religion', 'Culture', 'History', 'Other'
  ];

  const languages = ['Hindi', 'English', 'Sanskrit', 'Other'];

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Fetch books error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch books'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useState(() => {
    fetchBooks();
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || book.stock_status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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
      const filePath = `${type === 'cover' ? 'book-covers' : 'book-pdfs'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(type === 'cover' ? 'book-covers' : 'book-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(type === 'cover' ? 'book-covers' : 'book-pdfs')
        .getPublicUrl(filePath);

      if (type === 'cover') {
        setFormData({ ...formData, cover_image_url: publicUrl });
      } else {
        setFormData({ ...formData, pdf_url: publicUrl });
      }

      toast({ title: 'Success', description: `${type === 'cover' ? 'Cover image' : 'PDF'} uploaded successfully` });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Upload Failed', 
        description: error.message || `Failed to upload ${type}` 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBook = async () => {
    // Auto-generate slug if empty
    const slug = formData.slug || generateSlug(formData.title);
    
    if (!formData.title || !slug) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title is required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      // Clean data before sending - remove empty strings for date/number fields
      const bookData: any = {
        title: formData.title,
        slug: slug,
        description: formData.description || null,
        author_name: formData.author_name || null,
        cover_image_url: formData.cover_image_url || null,
        pdf_url: formData.pdf_url || null,
        price: formData.price || 0,
        stock_status: formData.stock_status || 'in_stock',
        access_mode: formData.access_mode || 'sell_only',
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publication_date: formData.publication_date || null,
        pages: formData.pages || null,
        language: formData.language || 'Hindi',
        category: formData.category || null,
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : null,
        is_featured: formData.is_featured || false,
        updated_at: new Date().toISOString()
      };

      // Remove null values for insert to avoid type issues
      const cleanBookData = Object.fromEntries(
        Object.entries(bookData).filter(([_, v]) => v !== undefined)
      );

      if (editingBook?.id) {
        await supabase.from('books').update(cleanBookData).eq('id', editingBook.id);
        toast({ title: 'Success', description: 'Book updated successfully' });
      } else {
        const newBook = {
          ...cleanBookData,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('books').insert(newBook);
        if (error) {
          console.error('Supabase insert error:', error);
          throw new Error(error.message || 'Failed to insert book');
        }
        toast({ title: 'Success', description: 'Book added successfully' });
      }

      resetForm();
      fetchBooks();
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

      // Delete from storage
      if (book.cover_image_url) {
        const coverPath = book.cover_image_url.split('/').pop();
        if (coverPath) {
          await supabase.storage.from('book-covers').remove([`book-covers/${coverPath}`]);
        }
      }
      if (book.pdf_url) {
        const pdfPath = book.pdf_url.split('/').pop();
        if (pdfPath) {
          await supabase.storage.from('book-pdfs').remove([`book-pdfs/${pdfPath}`]);
        }
      }

      // Delete from database
      await supabase.from('books').delete().eq('id', book.id);

      toast({ title: 'Success', description: 'Book deleted successfully' });
      fetchBooks();
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
      slug: book.slug,
      description: book.description || '',
      author_name: book.author_name || '',
      cover_image_url: book.cover_image_url || '',
      pdf_url: book.pdf_url || '',
      price: book.price,
      stock_status: book.stock_status,
      access_mode: book.access_mode,
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      publication_date: book.publication_date || '',
      pages: book.pages || 0,
      language: book.language,
      category: book.category || '',
      tags: book.tags || [],
      is_featured: book.is_featured
    });
  };

  const toggleBookStatus = async (book: Book) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('books').update({ 
        is_active: !book.is_active 
      }).eq('id', book.id);

      toast({ 
        title: 'Success', 
        description: `Book ${book.is_active ? 'deactivated' : 'activated'} successfully` 
      });
      fetchBooks();
    } catch (error: any) {
      console.error('Toggle status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update book status' 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      author_name: '',
      cover_image_url: '',
      pdf_url: '',
      price: 0,
      stock_status: 'in_stock',
      access_mode: 'sell_only',
      isbn: '',
      publisher: '',
      publication_date: '',
      pages: 0,
      language: 'Hindi',
      category: '',
      tags: [],
      is_featured: false
    });
    setEditingBook(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books Management</h1>
          <p className="text-muted-foreground">Manage books and merchandise inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setEditingBook({} as Book)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Add/Edit Book Form */}
      {(editingBook || formData.title) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBook?.id ? 'Edit Book' : 'Add New Book'}</CardTitle>
            <CardDescription>
              Fill in the book details. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title,
                        slug: generateSlug(title)
                      });
                    }}
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="book-slug"
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    placeholder="Publisher name"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cover Image</Label>
                  <div className="space-y-2">
                    <Input
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      placeholder="Cover image URL"
                    />
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Cover
                    </Button>
                    {formData.cover_image_url && (
                      <img
                        src={formData.cover_image_url}
                        alt="Cover preview"
                        className="w-20 h-28 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label>PDF (Optional)</Label>
                  <div className="space-y-2">
                    <Input
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      placeholder="PDF URL"
                    />
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload PDF
                    </Button>
                    {formData.pdf_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.pdf_url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Stock Status</Label>
                  <Select
                    value={formData.stock_status}
                    onValueChange={(value: 'in_stock' | 'out_of_stock') => setFormData({ ...formData, stock_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          In Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="out_of_stock">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Out of Stock
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Access Mode</Label>
                  <Select
                    value={formData.access_mode}
                    onValueChange={(value: 'read_only' | 'sell_only') => setFormData({ ...formData, access_mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sell_only">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Sell Only
                        </div>
                      </SelectItem>
                      <SelectItem value="read_only">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Read Only
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                    placeholder="Number of pages"
                  />
                </div>
                <div>
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="featured">Featured Book</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSaveBook}>
                {editingBook?.id ? 'Update Book' : 'Add Book'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Package className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid/List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
              <p>Loading books...</p>
            </CardContent>
          </Card>
        ) : filteredBooks.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="aspect-[3/4] relative">
                    {book.cover_image_url ? (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {book.is_featured && (
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={book.stock_status === 'in_stock' ? "default" : "secondary"}>
                        {book.stock_status === 'in_stock' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {book.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4">
                    {book.cover_image_url ? (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded mr-4">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author_name}</p>
                      <p className="text-lg font-bold text-green-600">{formatPrice(book.price)}</p>
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{book.title}</h3>
                  {book.author_name && (
                    <p className="text-sm text-gray-600 mb-2">by {book.author_name}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">{formatPrice(book.price)}</span>
                    <Badge variant={book.access_mode === 'sell_only' ? "default" : "secondary"}>
                      {book.access_mode === 'sell_only' ? 'Sell Only' : 'Read Only'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(book)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/books/${book.slug}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleBookStatus(book)}
                    >
                      {book.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
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
        ) : (
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
              <Button onClick={() => setEditingBook({} as Book)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
