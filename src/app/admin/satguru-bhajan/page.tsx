'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Music, 
  Upload, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  Plus,
  Search,
  Filter,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { SatguruBhajan } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface BhajanFormData {
  title: string;
  description: string;
  lyrics: string;
  video_id: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  is_active: boolean;
  sort_order: number;
}

export default function SatguruBhajanManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingBhajan, setEditingBhajan] = useState<SatguruBhajan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<BhajanFormData>({
    title: '',
    description: '',
    lyrics: '',
    video_id: '',
    video_url: '',
    thumbnail_url: '',
    duration: 0,
    is_active: true,
    sort_order: 0
  });

  const bhajans = useCollection<SatguruBhajan>('satguru_bhajan');

  const extractVideoDetails = (input: string): { embedUrl: string; videoId: string } | null => {
    if (!input || typeof input !== 'string') {
      return null;
    }
    
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return null;
    }
    
    // Handle various YouTube URL formats
    const youtubeIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|v\/|e(?:mbed)?\/|live\/|watch\?v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const idMatch = trimmedInput.match(youtubeIdRegex);

    if (idMatch && idMatch[1]) {
      const videoId = idMatch[1];
      return { embedUrl: `https://www.youtube.com/embed/${videoId}`, videoId: videoId };
    }
    
    // Handle direct embed URLs
    const embedRegex = /(?:youtube\.com\/embed\/)([^"&?\/ ]+)/;
    const embedMatch = trimmedInput.match(embedRegex);
    
    if (embedMatch && embedMatch[1]) {
      const videoId = embedMatch[1];
      return { embedUrl: `https://www.youtube.com/embed/${videoId}`, videoId: videoId };
    }
    
    return null;
  };

  const filteredBhajans = bhajans?.filter(bhajan => {
    const matchesSearch = bhajan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bhajan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bhajan.lyrics?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && bhajan.is_active) ||
                         (filterStatus === 'inactive' && !bhajan.is_active);
    return matchesSearch && matchesStatus;
  }) || [];

  const sortedBhajans = useMemo(() => {
    return filteredBhajans?.sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0)) || [];
  }, [filteredBhajans]);

  const handleVideoUrlChange = (url: string) => {
    const details = extractVideoDetails(url);
    if (details) {
      setFormData(prev => ({
        ...prev,
        video_url: details.embedUrl,
        video_id: details.videoId,
        thumbnail_url: details.videoId ? `https://i.ytimg.com/vi/${details.videoId}/hqdefault.jpg` : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        video_url: url,
        video_id: '',
        thumbnail_url: ''
      }));
    }
  };

  const handleSaveBhajan = async () => {
    if (!formData.title || !formData.video_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and video URL are required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const bhajanData = {
        title: formData.title,
        description: formData.description,
        lyrics: formData.lyrics,
        video_id: formData.video_id,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url,
        duration: formData.duration,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingBhajan) {
        await supabase.from('satguru_bhajan').update(bhajanData).eq('id', editingBhajan.id);
        toast({ title: 'Success', description: 'Bhajan updated successfully' });
      } else {
        const newBhajan = {
          ...bhajanData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('satguru_bhajan').insert(newBhajan);
        toast({ title: 'Success', description: 'Bhajan added successfully' });
      }

      setFormData({
        title: '',
        description: '',
        lyrics: '',
        video_id: '',
        video_url: '',
        thumbnail_url: '',
        duration: 0,
        is_active: true,
        sort_order: 0
      });
      setEditingBhajan(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save bhajan' 
      });
    }
  };

  const handleDeleteBhajan = async (bhajan: SatguruBhajan) => {
    setProcessingId(bhajan.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('satguru_bhajan').delete().eq('id', bhajan.id);
      toast({ title: 'Success', description: 'Bhajan deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete bhajan' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleActive = async (bhajan: SatguruBhajan) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('satguru_bhajan').update({
        is_active: !bhajan.is_active,
        updated_at: new Date().toISOString()
      }).eq('id', bhajan.id);

      toast({ 
        title: 'Success', 
        description: `Bhajan ${bhajan.is_active ? 'deactivated' : 'activated'}` 
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

  const openEditDialog = (bhajan: SatguruBhajan) => {
    setEditingBhajan(bhajan);
    setFormData({
      title: bhajan.title,
      description: bhajan.description || '',
      lyrics: bhajan.lyrics || '',
      video_id: bhajan.video_id || '',
      video_url: bhajan.video_url || '',
      thumbnail_url: bhajan.thumbnail_url || '',
      duration: bhajan.duration || 0,
      is_active: bhajan.is_active !== false,
      sort_order: bhajan.sort_order || 0
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Satguru Bhajan Management</h1>
          <p className="text-muted-foreground">Manage satguru bhajans and video content</p>
        </div>
        <Button onClick={() => setEditingBhajan(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bhajan
        </Button>
      </div>

      {/* Bhajan Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingBhajan ? 'Edit Bhajan' : 'Add New Bhajan'}</CardTitle>
          <CardDescription>
            Add bhajan details and YouTube video information
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
                  placeholder="Bhajan title"
                />
              </div>
              <div>
                <Label htmlFor="video_url">YouTube URL *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {formData.video_id && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Video detected: {formData.video_id}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="300"
                />
              </div>
            </div>

            <div className="space-y-4">
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
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              {formData.thumbnail_url && (
                <div>
                  <Label>Thumbnail Preview</Label>
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    className="w-32 h-24 object-cover rounded mt-2"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Bhajan description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea
              id="lyrics"
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              placeholder="Bhajan lyrics..."
              rows={8}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveBhajan}>
              {editingBhajan ? 'Update' : 'Save'} Bhajan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingBhajan(null);
                setFormData({
                  title: '',
                  description: '',
                  lyrics: '',
                  video_id: '',
                  video_url: '',
                  thumbnail_url: '',
                  duration: 0,
                  is_active: true,
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
                  placeholder="Search bhajans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
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

      {/* Bhajans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBhajans.map((bhajan) => (
          <Card key={bhajan.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {bhajan.thumbnail_url ? (
                <img
                  src={bhajan.thumbnail_url}
                  alt={bhajan.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Music className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={bhajan.is_active !== false ? 'default' : 'secondary'}>
                  {bhajan.is_active !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {bhajan.duration && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="bg-black/50 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(bhajan.duration)}
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{bhajan.title}</h3>
              {bhajan.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bhajan.description}</p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(bhajan)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {bhajan.video_url && (
                  <Button variant="outline" size="sm" onClick={() => window.open(bhajan.video_url, '_blank')}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleActive(bhajan)}
                >
                  {bhajan.is_active !== false ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteBhajan(bhajan)}
                  disabled={processingId === bhajan.id}
                >
                  {processingId === bhajan.id ? (
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

      {sortedBhajans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bhajans found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Add your first bhajan to get started'
              }
            </p>
            <Button onClick={() => setEditingBhajan(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bhajan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
