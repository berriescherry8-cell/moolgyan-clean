'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Loader2, Plus, Edit, Trash2, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';

interface Bhajan {
  id: string;
  youtube_url: string;
  title: string;
  lyrics?: string;
  created_at: string;
}

export default function ManageSatguruBhajanPage() {
  const { toast } = useToast();
  const bhajans = useCollection<Bhajan>('satguru_bhajan');
  const [editingBhajan, setEditingBhajan] = useState<Bhajan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    youtube_url: '',
    title: '',
    lyrics: '',
  });

  const resetForm = () => {
    setFormData({ youtube_url: '', title: '', lyrics: '' });
    setEditingBhajan(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.youtube_url.trim() || !formData.title.trim()) {
      toast({ variant: "destructive", description: "URL and title required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('satguru_bhajan', formData, editingBhajan?.id);
      toast({ description: editingBhajan ? "Bhajan updated" : "Bhajan added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('satguru_bhajan', id);
      toast({ description: "Bhajan deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (bhajan: Bhajan) => {
    setFormData({
      youtube_url: bhajan.youtube_url,
      title: bhajan.title,
      lyrics: bhajan.lyrics || '',
    });
    setEditingBhajan(bhajan);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Music className="h-8 w-8" />
              Manage Satguru Bhajan
            </h1>
            <p className="text-slate-400 mt-1">YouTube videos + lyrics ({bhajans.length})</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingBhajan ? 'Edit' : 'Add Bhajan'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bhajans ({bhajans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bhajans.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No bhajans. Add one!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Has Lyrics</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bhajans.map((bhajan) => (
                    <TableRow key={bhajan.id}>
                      <TableCell className="font-medium">{bhajan.title}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        <a href={bhajan.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {bhajan.youtube_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={bhajan.lyrics ? "default" : "secondary"}>
                          {bhajan.lyrics ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(bhajan.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(bhajan)}>
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
                              <AlertDialogTitle>Delete Bhajan?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes {bhajan.title}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(bhajan.id)}>
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
              <CardTitle>{editingBhajan ? 'Edit Bhajan' : 'Add Bhajan'}</CardTitle>
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
                  placeholder="Bhajan title"
                />
              </div>
              <div>
                <Label>Lyrics (optional)</Label>
                <Textarea
                  value={formData.lyrics}
                  onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
                  placeholder="Bhajan lyrics..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingBhajan ? 'Update Bhajan' : 'Add Bhajan'}
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
