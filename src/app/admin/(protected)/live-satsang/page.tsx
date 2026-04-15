'use client';

import { useState, useEffect } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Loader2, Plus, Edit, Trash2, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';

interface LiveSatsang {
  id: string;
  youtube_url: string;
  title: string;
  description?: string;
  is_live: boolean;
  created_at: string;
}

export default function ManageLiveSatsangPage() {
  const { toast } = useToast();
  const [liveVideos, setLiveVideos] = useState<LiveSatsang[]>([]);
  const collectionVideos = useCollection<LiveSatsang>('live_satsangs');
  const [editingVideo, setEditingVideo] = useState<LiveSatsang | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    youtube_url: '',
    title: '',
    description: '',
    is_live: false,
  });

  // Load
  useEffect(() => {
    setLiveVideos(collectionVideos);
  }, [collectionVideos]);

  const resetForm = () => {
    setFormData({
      youtube_url: '',
      title: '',
      description: '',
      is_live: false,
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.youtube_url.trim() || !formData.title.trim()) {
      toast({ variant: "destructive", description: "URL and title required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('live_satsangs', formData, editingVideo?.id);
      toast({ description: editingVideo ? "Video updated" : "Video added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('live_satsangs', id);
      toast({ description: "Video deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (video: LiveSatsang) => {
    setFormData({
      youtube_url: video.youtube_url,
      title: video.title,
      description: video.description || '',
      is_live: video.is_live,
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const liveVideosCount = liveVideos.filter(v => v.is_live).length;
  const archiveVideosCount = liveVideos.filter(v => !v.is_live).length;
  const totalVideos = liveVideos.length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Video className="h-8 w-8" />
              Manage Live Satsang
            </h1>
            <p className="text-slate-400 mt-1">YouTube videos | {liveVideosCount} live / {archiveVideosCount} archive / {totalVideos} total</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingVideo ? 'Edit' : 'Add Video'}
          </Button>
        </div>

        {/* Live Videos Section */}
        <Card>
          <CardHeader>
            <CardTitle>Live Videos ({liveVideosCount})</CardTitle>
            <CardDescription>Currently showing on public page - toggle to archive</CardDescription>
          </CardHeader>
          <CardContent>
            {liveVideosCount === 0 ? (
              <p className="text-slate-400 text-center py-8">No live videos. Add one and mark as LIVE!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveVideos.filter(v => v.is_live).map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {video.youtube_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          LIVE
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
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
                              <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes {video.title} permanently.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(video.id)}>
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

        {/* Archive Videos Section */}
        <Card>
          <CardHeader>
            <CardTitle>Archive Videos ({archiveVideosCount})</CardTitle>
            <CardDescription>Previously live videos - toggle to make live again</CardDescription>
          </CardHeader>
          <CardContent>
            {archiveVideosCount === 0 ? (
              <p className="text-slate-400 text-center py-8">No archived videos. Videos become archived when you unmark them as LIVE.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveVideos.filter(v => !v.is_live).map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {video.youtube_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          ARCHIVED
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                          Make Live
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes {video.title} permanently.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(video.id)}>
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

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingVideo ? 'Edit Live Video' : 'Add Live Video'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label>YouTube URL *</Label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Satsang Title"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Event details..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_live}
                  onCheckedChange={(checked) => setFormData({...formData, is_live: checked})}
                />
                <Label className="text-sm font-medium leading-none">
                  Mark as LIVE (shows on public page)
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingVideo ? 'Update Video' : 'Add Video'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
