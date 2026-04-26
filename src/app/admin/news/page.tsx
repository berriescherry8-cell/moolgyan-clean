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
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  Plus,
  Search,
  Filter,
  Calendar,
  Star,
  Globe,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { NewsItem } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface NewsFormData {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  image_url: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  sort_order: number;
}

export default function NewsManagementPage() {
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    summary: '',
    author: '',
    category: 'general',
    image_url: '',
    is_published: false,
    is_featured: false,
    published_at: '',
    sort_order: 0
  });

  const news = useCollection<NewsItem>('news_items');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'event', label: 'Event' },
    { value: 'satsang', label: 'Satsang' },
    { value: 'deeksha', label: 'Deeksha' },
    { value: 'spiritual', label: 'Spiritual' }
  ];

  const filteredNews = news?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && item.is_published) ||
                         (filterStatus === 'draft' && !item.is_published) ||
                         (filterStatus === 'featured' && item.is_featured);
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const filePath = `news/${fileName}`;

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

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Upload Failed', 
        description: error.message || 'Failed to upload image' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNews = async () => {
    if (!formData.title || !formData.content) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and content are required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const newsData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        author: formData.author,
        category: formData.category,
        image_url: formData.image_url,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        published_at: formData.is_published && formData.published_at ? 
          new Date(formData.published_at).toISOString() : 
          formData.is_published ? new Date().toISOString() : null,
        sort_order: formData.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingNews) {
        await supabase.from('news_items').update(newsData).eq('id', editingNews.id);
        toast({ title: 'Success', description: 'News updated successfully' });
      } else {
        const newNews = {
          ...newsData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('news_items').insert(newNews);
        toast({ title: 'Success', description: 'News created successfully' });
      }

      setFormData({
        title: '',
        content: '',
        summary: '',
        author: '',
        category: 'general',
        image_url: '',
        is_published: false,
        is_featured: false,
        published_at: '',
        sort_order: 0
      });
      setEditingNews(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save news' 
      });
    }
  };

  const handleDeleteNews = async (newsItem: NewsItem) => {
    setProcessingId(newsItem.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').delete().eq('id', newsItem.id);

      // Delete image from storage if it's a storage file
      if (newsItem.image_url?.includes('moolgyan-media')) {
        const filePath = newsItem.image_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('moolgyan-media').remove([`news/${filePath}`]);
        }
      }

      toast({ title: 'Success', description: 'News deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete news' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleTogglePublish = async (newsItem: NewsItem) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').update({
        is_published: !newsItem.is_published,
        published_at: !newsItem.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }).eq('id', newsItem.id);

      toast({ 
        title: 'Success', 
        description: `News ${newsItem.is_published ? 'unpublished' : 'published'}` 
      });
    } catch (error: any) {
      console.error('Toggle publish error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to toggle publish status' 
      });
    }
  };

  const handleToggleFeatured = async (newsItem: NewsItem) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').update({
        is_featured: !newsItem.is_featured,
        updated_at: new Date().toISOString()
      }).eq('id', newsItem.id);

      toast({ 
        title: 'Success', 
        description: `News ${newsItem.is_featured ? 'removed from' : 'added to'} featured` 
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

  const openEditDialog = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary || '',
      author: newsItem.author || '',
      category: newsItem.category || 'general',
      image_url: newsItem.image_url || '',
      is_published: newsItem.is_published || false,
      is_featured: newsItem.is_featured || false,
      published_at: newsItem.published_at ? new Date(newsItem.published_at).toISOString().slice(0, 16) : '',
      sort_order: newsItem.sort_order || 0
    });
  };

  const getStatusBadge = (newsItem: NewsItem) => {
    if (newsItem.is_featured) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Star className="h-3 w-3 mr-1" />Featured</Badge>;
    }
    if (newsItem.is_published) {
      return <Badge className="bg-green-100 text-green-800"><Globe className="h-3 w-3 mr-1" />Published</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800"><Lock className="h-3 w-3 mr-1" />Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Create and manage news articles and announcements</p>
        </div>
        <Button onClick={() => setEditingNews(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Create News Article
        </Button>
      </div>

      {/* News Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingNews ? 'Edit News Article' : 'Create News Article'}</CardTitle>
          <CardDescription>
            Write your news content and manage publication settings
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
                  placeholder="News title"
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
                <Label htmlFor="published_at">Publish Date</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
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

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief summary of the news article"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full news content..."
              rows={10}
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            <div className="mt-2">
              {formData.image_url ? (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Featured image preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload featured image</p>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveNews}>
              {editingNews ? 'Update' : 'Save'} News Article
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingNews(null);
                setFormData({
                  title: '',
                  content: '',
                  summary: '',
                  author: '',
                  category: 'general',
                  image_url: '',
                  is_published: false,
                  is_featured: false,
                  published_at: '',
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
                  placeholder="Search news articles..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((newsItem) => (
          <Card key={newsItem.id} className="overflow-hidden">
            {newsItem.image_url && (
              <div className="aspect-video relative">
                <img
                  src={newsItem.image_url}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {getStatusBadge(newsItem)}
                {newsItem.category && (
                  <Badge variant="outline">{newsItem.category}</Badge>
                )}
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{newsItem.title}</h3>
              {newsItem.summary && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{newsItem.summary}</p>
              )}
              {newsItem.author && (
                <p className="text-sm text-gray-500 mb-3">By {newsItem.author}</p>
              )}
              {newsItem.published_at && (
                <p className="text-sm text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(newsItem.published_at).toLocaleDateString()}
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(newsItem)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`/news/${newsItem.id}`, '_blank')}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTogglePublish(newsItem)}
                >
                  {newsItem.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteNews(newsItem)}
                  disabled={processingId === newsItem.id}
                >
                  {processingId === newsItem.id ? (
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

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No news articles found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Create your first news article to get started'
              }
            </p>
            <Button onClick={() => setEditingNews(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create News Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
