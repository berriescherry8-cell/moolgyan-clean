'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Image, 
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
  List
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { Photo } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface PhotoFormData {
  title: string;
  description: string;
  category: string;
  image_url: string;
  thumbnail_url: string;
  file_size: number;
  file_type: string;
}

export default function PhotosManagementPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState<PhotoFormData>({
    title: '',
    description: '',
    category: 'general',
    image_url: '',
    thumbnail_url: '',
    file_size: 0,
    file_type: ''
  });

  const photos = useCollection<Photo>('photos');

  const categories = [
    { value: 'general', label: 'General Gallery' },
    { value: 'prachar', label: 'Prachar aur Prasar' },
    { value: 'videsh', label: 'Videsh Bhraman' },
    { value: 'events', label: 'Events' },
    { value: 'satsang', label: 'Satsang' },
    { value: 'deeksha', label: 'Deeksha' }
  ];

  const filteredPhotos = photos?.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = getSupabase();
    if (!supabase) {
      toast({ variant: 'destructive', title: 'Error', description: 'Supabase client not available' });
      setUploading(false);
      return;
    }

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('moolgyan-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('moolgyan-media')
          .getPublicUrl(filePath);

        // Create thumbnail for images
        let thumbnailUrl = publicUrl;
        if (file.type.startsWith('image/')) {
          thumbnailUrl = `${publicUrl}?width=200&height=200`;
        }

        // Save to database
        const photoData = {
          id: crypto.randomUUID(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: '',
          category: 'general',
          image_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          file_size: file.size,
          file_type: file.type,
          is_active: true,
          sort_order: 0
        };

        await supabase.from('photos').insert(photoData);
      }

      toast({ title: 'Success', description: `${files.length} photos uploaded successfully` });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Upload Failed', 
        description: error.message || 'Failed to upload photos' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!formData.title || !formData.image_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and image are required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const photoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        thumbnail_url: formData.thumbnail_url,
        file_size: formData.file_size,
        file_type: formData.file_type,
        updated_at: new Date().toISOString()
      };

      if (editingPhoto) {
        await supabase.from('photos').update(photoData).eq('id', editingPhoto.id);
        toast({ title: 'Success', description: 'Photo updated successfully' });
      } else {
        const newPhoto = {
          ...photoData,
          id: crypto.randomUUID(),
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString()
        };
        await supabase.from('photos').insert(newPhoto);
        toast({ title: 'Success', description: 'Photo added successfully' });
      }

      setFormData({
        title: '',
        description: '',
        category: 'general',
        image_url: '',
        thumbnail_url: '',
        file_size: 0,
        file_type: ''
      });
      setEditingPhoto(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save photo' 
      });
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    setProcessingId(photo.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      // Delete from database
      await supabase.from('photos').delete().eq('id', photo.id);

      // Delete from storage if it's a storage file
      if (photo.image_url.includes('moolgyan-media')) {
        const filePath = photo.image_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('moolgyan-media').remove([`photos/${filePath}`]);
        }
      }

      toast({ title: 'Success', description: 'Photo deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete photo' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openEditDialog = (photo: Photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      category: photo.category,
      image_url: photo.image_url,
      thumbnail_url: photo.thumbnail_url || '',
      file_size: photo.file_size || 0,
      file_type: photo.file_type || ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photos Management</h1>
          <p className="text-muted-foreground">Upload and manage photo galleries</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Photos
          </CardTitle>
          <CardDescription>
            Upload multiple photos directly to Supabase storage. They will be automatically synced to the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drop photos here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: JPG, PNG, GIF, WebP (Max 10MB per file)
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Photos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {(editingPhoto || formData.title) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPhoto ? 'Edit Photo' : 'Add Photo'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Photo title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
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
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Photo description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSavePhoto}>
                {editingPhoto ? 'Update' : 'Save'} Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPhoto(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'general',
                    image_url: '',
                    thumbnail_url: '',
                    file_size: 0,
                    file_type: ''
                  });
                }}
              >
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
                  placeholder="Search photos..."
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
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid/List */}
      <div className="space-y-4">
        {filteredPhotos.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="aspect-square relative">
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {categories.find(c => c.value === photo.category)?.label || photo.category}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4">
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.title}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{photo.title}</h3>
                      <p className="text-sm text-gray-500">
                        {categories.find(c => c.value === photo.category)?.label || photo.category}
                      </p>
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{photo.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(photo)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(photo.image_url, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePhoto(photo)}
                      disabled={processingId === photo.id}
                    >
                      {processingId === photo.id ? (
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
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No photos found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Upload your first photo to get started'
                }
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
