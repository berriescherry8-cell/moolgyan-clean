'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Upload, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

const folders = [
  { value: 'general-gallery', label: 'General Gallery' },
  { value: 'prachar-aur-prasar', label: 'Prachar aur Prachar-Prasar' },
  { value: 'saar-sangrah', label: 'Saar Sangrah' },
  { value: 'app-logo-qr', label: 'App Logo & QR' },
];

interface Photo {
  id: string;
  file_name: string;
  folder: string;
  public_url: string;
}

export default function AdminPhotosPage() {
  const { toast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState('general-gallery');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('folder', selectedFolder)
      .order('uploaded_at', { ascending: false });

    if (error) toast({ variant: 'destructive', description: error.message });
    else setPhotos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedFolder]);

  // ==================== UPLOAD NEW FILES ====================
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${selectedFolder}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('moolgyan-media')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('moolgyan-media')
          .getPublicUrl(filePath);

        await supabase.from('photos').insert({
          file_name: file.name,
          folder: selectedFolder,
          public_url: urlData.publicUrl,
        });

        toast({ title: 'Uploaded', description: file.name });
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Upload Failed', description: err.message });
      }
    }

    setUploading(false);
    e.target.value = '';
    fetchPhotos();
  };

  // ==================== SYNC ALL FILES ====================
  const syncAllFiles = async () => {
    if (!confirm('Saari files Storage se Table mein sync karni hain?')) return;

    setSyncing(true);
    try {
      const { data: files, error } = await supabase.storage
        .from('moolgyan-media')
        .list(selectedFolder, { limit: 1000 });

      if (error) throw error;
      if (!files?.length) {
        toast({ title: "No files", description: "Folder khali hai" });
        setSyncing(false);
        return;
      }

      const inserts = files.map((file: any) => ({
        file_name: file.name,
        folder: selectedFolder,
        public_url: supabase.storage.from('moolgyan-media')
          .getPublicUrl(`${selectedFolder}/${file.name}`).data.publicUrl,
      }));

      const { error: insertError } = await supabase.from('photos').insert(inserts);

      if (insertError && !insertError.message.includes('duplicate')) throw insertError;

      toast({ title: '✅ Sync Done!', description: `${files.length} files synced!` });
      fetchPhotos();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Photo permanently delete karni hai?')) return;
    await supabase.from('photos').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchPhotos();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">📸 Supabase Photo Manager</CardTitle>
          <CardDescription>Upload + Sync Storage Files to Table</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 items-center flex-wrap">
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {folders.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={syncAllFiles} disabled={syncing}>
            {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Sync All Files from Storage
          </Button>

          <label>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload New Files
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {folders.find(f => f.value === selectedFolder)?.label} — {photos.length} Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin" /></div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              No photos in this folder yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {photos.map(photo => (
                <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                  <div className="relative aspect-square">
                    <Image src={photo.public_url} alt={photo.file_name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-end p-3">
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(photo.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}