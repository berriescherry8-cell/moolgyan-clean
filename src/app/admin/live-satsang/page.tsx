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
  Video, 
  Calendar, 
  Users, 
  Link, 
  Eye, 
  Edit, 
  Trash2, 
  Loader2, 
  Plus,
  Search,
  Filter,
  Youtube,
  Facebook,
  Monitor,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { LiveSatsang } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface LiveSatsangFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  scheduled_date: string;
  duration: number;
  is_live: boolean;
  is_active: boolean;
  youtube_live_url: string;
  facebook_live_url: string;
  zoom_link: string;
  max_participants: number;
  registration_required: boolean;
}

export default function LiveSatsangManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingSatsang, setEditingSatsang] = useState<LiveSatsang | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<LiveSatsangFormData>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    scheduled_date: '',
    duration: 0,
    is_live: false,
    is_active: true,
    youtube_live_url: '',
    facebook_live_url: '',
    zoom_link: '',
    max_participants: 0,
    registration_required: false
  });

  const liveSatsangs = useCollection<LiveSatsang>('live_satsangs');

  const filteredSatsangs = liveSatsangs?.filter(satsang => {
    const matchesSearch = satsang.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         satsang.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'live' && satsang.is_live) ||
                         (filterStatus === 'scheduled' && !satsang.is_live) ||
                         (filterStatus === 'active' && satsang.is_active) ||
                         (filterStatus === 'inactive' && !satsang.is_active);
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSaveSatsang = async () => {
    if (!formData.title) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title is required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const satsangData = {
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url,
        scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
        duration: formData.duration,
        is_live: formData.is_live,
        is_active: formData.is_active,
        youtube_live_url: formData.youtube_live_url,
        facebook_live_url: formData.facebook_live_url,
        zoom_link: formData.zoom_link,
        max_participants: formData.max_participants,
        registration_required: formData.registration_required,
        updated_at: new Date().toISOString()
      };

      if (editingSatsang) {
        await supabase.from('live_satsangs').update(satsangData).eq('id', editingSatsang.id);
        toast({ title: 'Success', description: 'Live satsang updated successfully' });
      } else {
        const newSatsang = {
          ...satsangData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('live_satsangs').insert(newSatsang);
        toast({ title: 'Success', description: 'Live satsang created successfully' });
      }

      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        scheduled_date: '',
        duration: 0,
        is_live: false,
        is_active: true,
        youtube_live_url: '',
        facebook_live_url: '',
        zoom_link: '',
        max_participants: 0,
        registration_required: false
      });
      setEditingSatsang(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save live satsang' 
      });
    }
  };

  const handleDeleteSatsang = async (satsang: LiveSatsang) => {
    setProcessingId(satsang.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('live_satsangs').delete().eq('id', satsang.id);
      toast({ title: 'Success', description: 'Live satsang deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete live satsang' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleLive = async (satsang: LiveSatsang) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('live_satsangs').update({
        is_live: !satsang.is_live,
        updated_at: new Date().toISOString()
      }).eq('id', satsang.id);

      toast({ 
        title: 'Success', 
        description: `Live satsang ${satsang.is_live ? 'stopped' : 'started'}` 
      });
    } catch (error: any) {
      console.error('Toggle live error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to toggle live status' 
      });
    }
  };

  const openEditDialog = (satsang: LiveSatsang) => {
    setEditingSatsang(satsang);
    setFormData({
      title: satsang.title,
      description: satsang.description || '',
      video_url: satsang.video_url || '',
      thumbnail_url: satsang.thumbnail_url || '',
      scheduled_date: satsang.scheduled_date ? new Date(satsang.scheduled_date).toISOString().slice(0, 16) : '',
      duration: satsang.duration || 0,
      is_live: satsang.is_live || false,
      is_active: satsang.is_active !== false,
      youtube_live_url: satsang.youtube_live_url || '',
      facebook_live_url: satsang.facebook_live_url || '',
      zoom_link: satsang.zoom_link || '',
      max_participants: satsang.max_participants || 0,
      registration_required: satsang.registration_required || false
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusBadge = (satsang: LiveSatsang) => {
    if (satsang.is_live) {
      return <Badge variant="destructive" className="animate-pulse">LIVE NOW</Badge>;
    }
    if (satsang.scheduled_date && new Date(satsang.scheduled_date) > new Date()) {
      return <Badge variant="outline">Scheduled</Badge>;
    }
    if (!satsang.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="default">Completed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Satsang Management</h1>
          <p className="text-muted-foreground">Schedule and manage live satsang sessions</p>
        </div>
        <Button onClick={() => setEditingSatsang(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Live Satsang
        </Button>
      </div>

      {/* Satsang Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingSatsang ? 'Edit Live Satsang' : 'Schedule New Live Satsang'}</CardTitle>
          <CardDescription>
            Set up live streaming details and schedule for the satsang session
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
                  placeholder="Satsang title"
                />
              </div>
              <div>
                <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_live"
                  checked={formData.is_live}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })}
                />
                <Label htmlFor="is_live">Currently Live</Label>
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
                  id="registration_required"
                  checked={formData.registration_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
                />
                <Label htmlFor="registration_required">Registration Required</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Satsang description and details"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="youtube_live_url">YouTube Live URL</Label>
                <Input
                  id="youtube_live_url"
                  value={formData.youtube_live_url}
                  onChange={(e) => setFormData({ ...formData, youtube_live_url: e.target.value })}
                  placeholder="https://youtube.com/live/..."
                />
              </div>
              <div>
                <Label htmlFor="facebook_live_url">Facebook Live URL</Label>
                <Input
                  id="facebook_live_url"
                  value={formData.facebook_live_url}
                  onChange={(e) => setFormData({ ...formData, facebook_live_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="zoom_link">Zoom Link</Label>
                <Input
                  id="zoom_link"
                  value={formData.zoom_link}
                  onChange={(e) => setFormData({ ...formData, zoom_link: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveSatsang}>
              {editingSatsang ? 'Update' : 'Schedule'} Live Satsang
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingSatsang(null);
                setFormData({
                  title: '',
                  description: '',
                  video_url: '',
                  thumbnail_url: '',
                  scheduled_date: '',
                  duration: 0,
                  is_live: false,
                  is_active: true,
                  youtube_live_url: '',
                  facebook_live_url: '',
                  zoom_link: '',
                  max_participants: 0,
                  registration_required: false
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
                  placeholder="Search live satsangs..."
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
                <SelectItem value="live">Live Now</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Live Satsangs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSatsangs.map((satsang) => (
          <Card key={satsang.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {satsang.thumbnail_url ? (
                <img
                  src={satsang.thumbnail_url}
                  alt={satsang.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                {getStatusBadge(satsang)}
              </div>
              {satsang.is_live && (
                <div className="absolute top-2 left-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-1">{satsang.title}</h3>
              {satsang.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{satsang.description}</p>
              )}
              <div className="space-y-2 mb-4">
                {satsang.scheduled_date && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(satsang.scheduled_date).toLocaleString()}
                  </div>
                )}
                {satsang.duration && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDuration(satsang.duration)}
                  </div>
                )}
                {satsang.max_participants > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    Max {satsang.max_participants} participants
                  </div>
                )}
              </div>
              <div className="flex gap-2 mb-3">
                {satsang.youtube_live_url && (
                  <Badge variant="outline" className="text-xs">
                    <Youtube className="h-3 w-3 mr-1" />
                    YouTube
                  </Badge>
                )}
                {satsang.facebook_live_url && (
                  <Badge variant="outline" className="text-xs">
                    <Facebook className="h-3 w-3 mr-1" />
                    Facebook
                  </Badge>
                )}
                {satsang.zoom_link && (
                  <Badge variant="outline" className="text-xs">
                    <Monitor className="h-3 w-3 mr-1" />
                    Zoom
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(satsang)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {satsang.video_url && (
                  <Button variant="outline" size="sm" onClick={() => window.open(satsang.video_url, '_blank')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant={satsang.is_live ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleLive(satsang)}
                >
                  {satsang.is_live ? 'Stop Live' : 'Go Live'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteSatsang(satsang)}
                  disabled={processingId === satsang.id}
                >
                  {processingId === satsang.id ? (
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

      {filteredSatsangs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No live satsangs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Schedule your first live satsang to get started'
              }
            </p>
            <Button onClick={() => setEditingSatsang(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Live Satsang
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
