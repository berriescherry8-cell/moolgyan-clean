import os

content = r"""'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Image, Upload, Trash2, Eye, Edit, Loader2, Search, Grid3X3, List, FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import { getSupabase } from '@/lib/data-manager';

interface PhotoRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  is_active?: boolean;
}

const CATEGORIES = [
  { value: 'general', label: 'General Gallery' },
  { value: 'prachar', label: 'Prachar aur Prasar' },
  { value: 'videsh', label: 'Videsh Bhraman' },
  { value: 'events', label: 'Events' },
  { value: 'satsang', label: 'Satsang' },
  { value: 'deeksha', label: 'Deeksha' },
  { value: 'saar-sangrah', label: 'Saar Sangrah' }
];

export default function PhotosManagementPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<PhotoRecord | null>(null);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ title: '', description: '', category: 'general' });
  
  const photos = useCollection<PhotoRecord>('photos');
  const filteredPhotos = photos.filter(p => 
    searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) { toast({ title: 'Error', description: 'Supabase not connected', variant: 'destructive' }); return; }
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = Date.now() + '_' + Math.random().toString(36).substring(7) + '.' + fileExt;
        const filePath = uploadCategory + '/' + fileName;
        const { error: uploadError } = await supabase.storage.from('moolgyan-media').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('moolgyan-media').getPublicUrl(filePath);
        await supabase.from('photos').insert({
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          category: uploadCategory,
          folder: uploadCategory,
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      toast({ title: 'Success', description: files.length + ' photo(s) uploaded to ' + (CATEGORIES.find(c => c.value === uploadCategory)?.label || uploadCategory) });
      event.target.value = '';
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (photo: PhotoRecord) => {
    setEditingPhoto(photo);
    setEditForm({ title: photo.title, description: photo.description || '', category: photo.category });
  };

  const saveEdit = async () => {
    if (!editingPhoto) return;
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      await supabase.from('photos').update({
        title: editForm.title, description: editForm.description, category: editForm.category, updated_at: new Date().toISOString()
      }).eq('id', editingPhoto.id);
      toast({ title: 'Success', description: 'Photo updated' });
      setEditingPhoto(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deletePhoto = async (photo: PhotoRecord) => {
    setProcessingId(photo.id);
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      await supabase.from('photos').delete().eq('id', photo.id);
      toast({ title: 'Success', description: 'Photo deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photos Management</h1>
          <p className="text-muted-foreground">Upload and manage photo galleries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Photos</CardTitle>
          <CardDescription>Choose a folder first, then upload photos. All photos will be saved to the selected folder automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select folder" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Badge variant="secondary">{CATEGORIES.find(c => c.value === uploadCategory)?.label}</Badge>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Click to upload photos to {CATEGORIES.find(c => c.value === uploadCategory)?.label}</p>
            <p className="text-sm text-gray-500 mb-4">All photos will be saved automatically. Supports: JPG, PNG, GIF, WebP</p>
            <Button disabled={uploading} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              {uploading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" /> Select Photos</>)}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search photos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {editingPhoto && (
        <Card>
          <CardHeader><CardTitle>Edit Photo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Title</label><Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} /></div>
            <div><label className="text-sm font-medium">Category</label><Select value={editForm.category} onValueChange={(v) => setEditForm({...editForm, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows={2} /></div>
            <div className="flex gap-2"><Button onClick={saveEdit}>Save Changes</Button><Button variant="outline" onClick={() => setEditingPhoto(null)}>Cancel</Button></div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredPhotos.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className={viewMode === 'grid' ? 'aspect-square relative' : 'flex items-center p-4 gap-4'}>
                  <img src={photo.thumbnail_url || photo.image_url} alt={photo.title} className={viewMode === 'grid' ? 'w-full h-full object-cover' : 'w-20 h-20 object-cover rounded'} />
                  {viewMode === 'grid' && (<div className="absolute top-2 right-2"><Badge variant="secondary">{CATEGORIES.find(c => c.value === photo.category)?.label || photo.category}</Badge></div>)}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{photo.title}</h3>
                    {viewMode === 'list' && (<Badge variant="secondary">{CATEGORIES.find(c => c.value === photo.category)?.label || photo.category}</Badge>)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(photo)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(photo.image_url, '_blank')}><Eye className="h-4 w-4 mr-1" /> View</Button>
                    <Button variant="destructive" size="sm" onClick={() => deletePhoto(photo)} disabled={processingId === photo.id}>{processingId === photo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="text-center py-12"><Image className="h-12 w-12 mx-auto text-gray-400 mb-4" /><p className="text-gray-500">No photos found. Upload some photos first!</p></CardContent></Card>
        )}
      </div>
  );
}
"""

with open('src/app/admin/photos/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done writing admin photos page')
