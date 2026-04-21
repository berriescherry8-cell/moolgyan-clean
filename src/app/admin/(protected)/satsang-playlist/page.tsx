'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Loader2, Plus, Edit, Trash2, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';

interface Playlist {
  id: string;
  playlist_url: string;
  title: string;
  created_at: string;
}

export default function ManageSatsangPlaylistPage() {
  const { toast } = useToast();
  const playlists = useCollection<Playlist>('satsang_playlists');
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    playlist_url: '',
    title: '',
  });

  const resetForm = () => {
    setFormData({ playlist_url: '', title: '' });
    setEditingPlaylist(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.playlist_url.trim() || !formData.title.trim()) {
      toast({ variant: "destructive", description: "URL and title required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('satsang_playlists', formData, editingPlaylist?.id);
      toast({ description: editingPlaylist ? "Playlist updated" : "Playlist added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('satsang_playlists', id);
      toast({ description: "Playlist deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (playlist: Playlist) => {
    setFormData({
      playlist_url: playlist.playlist_url,
      title: playlist.title,
    });
    setEditingPlaylist(playlist);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            Manage Satsang Playlists
          </h1>
          <p className="text-slate-400 mt-1">YouTube playlists for live satsang page ({playlists.length})</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {editingPlaylist ? 'Edit' : 'Add Playlist'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Playlists ({playlists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No playlists. Add one to show videos on live page!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Playlist URL</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playlists.map((playlist) => (
                  <TableRow key={playlist.id}>
                    <TableCell className="font-medium">{playlist.title}</TableCell>
                    <TableCell className="truncate max-w-md">
                      <a href={playlist.playlist_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {playlist.playlist_url}
                      </a>
                    </TableCell>
                    <TableCell>{new Date(playlist.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(playlist)}>
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
                            <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes {playlist.title}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(playlist.id)}>
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
            <CardTitle>{editingPlaylist ? 'Edit Playlist' : 'Add Playlist'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label>YouTube Playlist URL *</Label>
              <Input
                value={formData.playlist_url}
                onChange={(e) => setFormData({...formData, playlist_url: e.target.value})}
                placeholder="https://www.youtube.com/playlist?list=PL..."
              />
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Satsang Playlist Title"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingPlaylist ? 'Update' : 'Add Playlist'}
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