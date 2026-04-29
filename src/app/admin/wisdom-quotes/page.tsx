'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Quote, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  Plus,
  Search,
  Filter,
  Star,
  BookOpen,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { WisdomQuote } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface QuoteFormData {
  quote: string;
  author: string;
  source: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

export default function WisdomQuotesManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingQuote, setEditingQuote] = useState<WisdomQuote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<QuoteFormData>({
    quote: '',
    author: '',
    source: '',
    category: 'general',
    is_active: true,
    is_featured: false,
    sort_order: 0
  });

  const quotes = useCollection<WisdomQuote>('wisdom_quotes');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'karma', label: 'Karma' },
    { value: 'dharma', label: 'Dharma' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'love', label: 'Love' },
    { value: 'peace', label: 'Peace' }
  ];

  const filteredQuotes = quotes?.filter((quote): boolean => {
    if (!quote) return false;
    const quoteText = quote.quote || '';
    const authorText = quote.author || '';
    const sourceText = quote.source || '';
    const matchesSearch = quoteText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         authorText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sourceText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || quote.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && quote.is_active) ||
                         (filterStatus === 'inactive' && !quote.is_active) ||
                         (filterStatus === 'featured' && quote.is_featured);
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const sortedQuotes = filteredQuotes?.sort((a, b) => {
    // Featured quotes first
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    // Then by sort order
    return (a.sort_order || 0) - (b.sort_order || 0);
  }) || [];

  const handleSaveQuote = async () => {
    if (!formData.quote) {
      toast({ variant: 'destructive', title: 'Error', description: 'Quote text is required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const quoteData = {
        quote: formData.quote,
        author: formData.author,
        source: formData.source,
        category: formData.category,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingQuote) {
        await supabase.from('wisdom_quotes').update(quoteData).eq('id', editingQuote.id);
        toast({ title: 'Success', description: 'Quote updated successfully' });
      } else {
        const newQuote = {
          ...quoteData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('wisdom_quotes').insert(newQuote);
        toast({ title: 'Success', description: 'Quote added successfully' });
      }

      setFormData({
        quote: '',
        author: '',
        source: '',
        category: 'general',
        is_active: true,
        is_featured: false,
        sort_order: 0
      });
      setEditingQuote(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save quote' 
      });
    }
  };

  const handleDeleteQuote = async (quote: WisdomQuote) => {
    setProcessingId(quote.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('wisdom_quotes').delete().eq('id', quote.id);
      toast({ title: 'Success', description: 'Quote deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete quote' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleActive = async (quote: WisdomQuote) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('wisdom_quotes').update({
        is_active: !quote.is_active,
        updated_at: new Date().toISOString()
      }).eq('id', quote.id);

      toast({ 
        title: 'Success', 
        description: `Quote ${quote.is_active ? 'deactivated' : 'activated'}` 
      });
    } catch (error: any) {
      console.error('Toggle active error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to toggle active status' 
      });
    }
  };

  const handleToggleFeatured = async (quote: WisdomQuote) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('wisdom_quotes').update({
        is_featured: !quote.is_featured,
        updated_at: new Date().toISOString()
      }).eq('id', quote.id);

      toast({ 
        title: 'Success', 
        description: `Quote ${quote.is_featured ? 'removed from' : 'added to'} featured` 
      });
    } catch (error: any) {
      console.error('Toggle featured error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to toggle featured status' 
      });
    }
  };

  const openEditDialog = (quote: WisdomQuote) => {
    setEditingQuote(quote);
    setFormData({
      quote: quote.quote,
      author: quote.author || '',
      source: quote.source || '',
      category: quote.category || 'general',
      is_active: quote.is_active !== false,
      is_featured: quote.is_featured || false,
      sort_order: quote.sort_order || 0
    });
  };

  const getStatusBadge = (quote: WisdomQuote) => {
    if (quote.is_featured) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Star className="h-3 w-3 mr-1" />Featured</Badge>;
    }
    if (quote.is_active) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wisdom Quotes Management</h1>
          <p className="text-muted-foreground">Manage inspirational quotes and wisdom teachings</p>
        </div>
        <Button onClick={() => setEditingQuote(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Quote
        </Button>
      </div>

      {/* Quote Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingQuote ? 'Edit Quote' : 'Add New Quote'}</CardTitle>
          <CardDescription>
            Add inspirational quotes and wisdom teachings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="quote">Quote *</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Enter the quote text..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Book, scripture, or source"
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
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveQuote}>
              {editingQuote ? 'Update' : 'Save'} Quote
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingQuote(null);
                setFormData({
                  quote: '',
                  author: '',
                  source: '',
                  category: 'general',
                  is_active: true,
                  is_featured: false,
                  sort_order: 0
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
                  placeholder="Search quotes..."
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
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedQuotes.map((quote) => (
          <Card key={quote.id} className="relative">
            {quote.is_featured && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="mb-4">
                <Quote className="h-8 w-8 text-blue-500 mb-2" />
                <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                  "{quote.quote}"
                </blockquote>
              </div>
              
              <div className="space-y-2 mb-4">
                {quote.author && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {quote.author}
                  </div>
                )}
                {quote.source && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {quote.source}
                  </div>
                )}
                {quote.category && (
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === quote.category)?.label || quote.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                {getStatusBadge(quote)}
                <div className="text-xs text-gray-500">
                  Order: {quote.sort_order || 0}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(quote)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleActive(quote)}
                >
                  {quote.is_active !== false ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleFeatured(quote)}
                >
                  {quote.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteQuote(quote)}
                  disabled={processingId === quote.id}
                >
                  {processingId === quote.id ? (
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

      {sortedQuotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Quote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Add your first wisdom quote to get started'
              }
            </p>
            <Button onClick={() => setEditingQuote(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Quote
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
