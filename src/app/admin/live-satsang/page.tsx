'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
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
  Calendar,
  Clock,
  Users,
  Youtube,
  Archive,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/data-manager';

interface LiveSatsang {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url?: string;
  is_live: boolean;
  scheduled_at?: string;
  duration_minutes?: number;
  view_count: number;
  is_archived: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface LiveSatsangFormData {
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string;
  is_live: boolean;
  scheduled_at: string;
  duration_minutes: number;
}

export default function LiveSatsangManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingSatsang, setEditingSatsang] = useState<LiveSatsang | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [satsangs, setSatsangs] = useState<LiveSatsang[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LiveSatsangFormData>({
    title: '',
    description: '',
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_url: '',
    is_live: false,
    scheduled_at: '',
    duration_minutes: 0
  });

  const fetchSatsangs = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('live_satsangs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSatsangs(data || []);
    } catch (error: any) {
      console.error('Fetch satsangs error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch live satsangs'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useState(() => {
    fetchSatsangs();
  });

  const filteredSatsangs = satsangs.filter(satsang => {
    const matchesSearch = satsang.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         satsang.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'live' && satsang.is_live) ||
                         (filterStatus === 'archived' && satsang.is_archived) ||
                         (filterStatus === 'upcoming' && !satsang.is_live && !satsang.is_archived);
    return matchesSearch && matchesStatus;
  });

  const extractYouTubeVideoId = (url: string) => {
   const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/(?:live\/|embed\/))([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const generateThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleYouTubeUrlChange = (url: string) => {
    const videoId = extractYouTubeVideoId(url);
    const thumbnailUrl = videoId ? generateThumbnailUrl(videoId) : '';
    
    setFormData({
      ...formData,
      youtube_url: url,
      youtube_video_id: videoId,
      thumbnail_url: thumbnailUrl
    });
  };

  const handleSaveSatsang = async () => {
    if (!formData.title || !formData.youtube_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and YouTube URL are required' });
      return;
    }

    if (!formData.youtube_video_id) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid YouTube URL' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const satsangData = {
        title: formData.title,
        description: formData.description,
        youtube_url: formData.youtube_url,
        youtube_video_id: formData.youtube_video_id,
        thumbnail_url: formData.thumbnail_url,
        is_live: formData.is_live,
        scheduled_at: formData.scheduled_at || null,
        duration_minutes: formData.duration_minutes || null,
        updated_at: new Date().toISOString()
      };

      if (editingSatsang?.id) {
        await supabase.from('live_satsangs').update(satsangData).eq('id', editingSatsang.id);
        toast({ title: 'Success', description: 'Live satsang updated successfully' });
      } else {
        const newSatsang = {
          ...satsangData,
          view_count: 0,
          is_archived: false,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString()
        };
        await supabase.from('live_satsangs').insert(newSatsang);
        toast({ title: 'Success', description: 'Live satsang added successfully' });
      }

      resetForm();
      fetchSatsangs();
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
      fetchSatsangs();
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

  const toggleLiveStatus = async (satsang: LiveSatsang) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      // If making live, archive other live satsangs
      if (!satsang.is_live) {
        await supabase
          .from('live_satsangs')
          .update({ is_live: false, is_archived: true })
          .eq('is_live', true);
      }

      await supabase.from('live_satsangs').update({ 
        is_live: !satsang.is_live,
        is_archived: satsang.is_live ? true : satsang.is_archived
      }).eq('id', satsang.id);

      toast({ 
        title: 'Success', 
        description: `Live satsang ${satsang.is_live ? 'archived' : 'made live'} successfully` 
      });
      fetchSatsangs();
    } catch (error: any) {
      console.error('Toggle live status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update live status' 
      });
    }
  };

  const toggleArchiveStatus = async (satsang: LiveSatsang) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('live_satsangs').update({ 
        is_archived: !satsang.is_archived,
        is_live: satsang.is_archived ? false : satsang.is_live
      }).eq('id', satsang.id);

      toast({ 
        title: 'Success', 
        description: `Live satsang ${satsang.is_archived ? 'unarchived' : 'archived'} successfully` 
      });
      fetchSatsangs();
    } catch (error: any) {
      console.error('Toggle archive status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update archive status' 
      });
    }
  };

  const openEditDialog = (satsang: LiveSatsang) => {
    setEditingSatsang(satsang);
    setFormData({
      title: satsang.title,
      description: satsang.description || '',
      youtube_url: satsang.youtube_url,
      youtube_video_id: satsang.youtube_video_id,
      thumbnail_url: satsang.thumbnail_url || '',
      is_live: satsang.is_live,
      scheduled_at: satsang.scheduled_at || '',
      duration_minutes: satsang.duration_minutes || 0
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      youtube_video_id: '',
      thumbnail_url: '',
      is_live: false,
      scheduled_at: '',
      duration_minutes: 0
    });
    setEditingSatsang(null);
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString();
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Satsang Management</h1>
          <p className="text-muted-foreground">Manage YouTube live sessions and archives</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setEditingSatsang({} as LiveSatsang)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Satsang
          </Button>
        </div>
      </div>

      {/* Add/Edit Satsang Form */}
      {(editingSatsang || formData.title) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSatsang?.id ? 'Edit Live Satsang' : 'Add New Live Satsang'}</CardTitle>
            <CardDescription>
              Add YouTube video URL and schedule live sessions. Videos marked as "Live" will appear on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Satsang description"
                  rows={3}
                />
              </div>
            </div>

            {/* YouTube Integration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">YouTube Integration</h3>
              <div>
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
                </p>
              </div>
              {formData.youtube_video_id && (
                <div>
                  <Label>Thumbnail Preview</Label>
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="w-64 h-36 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${formData.youtube_video_id}/mqdefault.jpg`;
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scheduling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduled_at">Schedule Date & Time</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    placeholder="60"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_live"
                  checked={formData.is_live}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })}
                />
                <Label htmlFor="is_live" className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Make Live Now
                </Label>
              </div>
              {formData.is_live && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Making this satsang live will archive any currently live satsang and display this one on the home page.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSaveSatsang}>
                {editingSatsang?.id ? 'Update Satsang' : 'Add Satsang'}
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
                  placeholder="Search satsangs..."
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
                <SelectItem value="live">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-red-500" />
                    Live Now
                  </div>
                </SelectItem>
                <SelectItem value="upcoming">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Upcoming
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-gray-500" />
                    Archived
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Satsangs Grid/List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
              <p>Loading live satsangs...</p>
            </CardContent>
          </Card>
        ) : filteredSatsangs.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredSatsangs.map((satsang) => (
              <Card key={satsang.id} className="overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="aspect-video relative">
                    {satsang.thumbnail_url ? (
                      <img
                        src={satsang.thumbnail_url}
                        alt={satsang.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Youtube className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {satsang.is_live && (
                        <Badge className="bg-red-500 animate-pulse">
                          <Radio className="h-3 w-3 mr-1" />
                          LIVE
                        </Badge>
                      )}
                      {satsang.is_archived && (
                        <Badge variant="secondary">
                          <Archive className="h-3 w-3 mr-1" />
                          Archived
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-black/70 text-white border-0">
                        <Users className="h-3 w-3 mr-1" />
                        {formatViewCount(satsang.view_count)} views
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4">
                    {satsang.thumbnail_url ? (
                      <img
                        src={satsang.thumbnail_url}
                        alt={satsang.title}
                        className="w-32 h-20 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded mr-4">
                        <Youtube className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{satsang.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDuration(satsang.duration_minutes || 0)} • {formatViewCount(satsang.view_count)} views
                      </p>
                      {satsang.scheduled_at && (
                        <p className="text-xs text-gray-400">
                          {formatDateTime(satsang.scheduled_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{satsang.title}</h3>
                  {satsang.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{satsang.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    {satsang.scheduled_at && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDateTime(satsang.scheduled_at)}
                      </div>
                    )}
                    {satsang.duration_minutes && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(satsang.duration_minutes)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(satsang)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(satsang.youtube_url, '_blank')}>
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleLiveStatus(satsang)}
                    >
                      {satsang.is_live ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Archive
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Go Live
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleArchiveStatus(satsang)}
                    >
                      {satsang.is_archived ? 'Unarchive' : 'Archive'}
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
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No live satsangs found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add your first live satsang to get started'
                }
              </p>
              <Button onClick={() => setEditingSatsang({} as LiveSatsang)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Satsang
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
