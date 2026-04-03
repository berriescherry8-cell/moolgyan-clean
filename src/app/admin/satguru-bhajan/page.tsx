'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Music, Trash2, AlertCircle, FilePenLine, PlusCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { SatguruBhajan } from '@/lib/types';
import { dataManager } from '@/lib/data-manager';

// Video extraction logic (same as in videos page)
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

const bhajanSchema = z.object({
  title: z.string().min(3, 'A title is required.'),
  videoInput: z.string().refine(val => extractVideoDetails(val) !== null, {
      message: "Please enter a valid YouTube URL or embed code.",
  }),
  description: z.string().optional(),
  lyrics: z.string().optional(),
});

type BhajanFormValues = z.infer<typeof bhajanSchema>;

export default function ManageSatguruBhajanPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingBhajan, setEditingBhajan] = useState<SatguruBhajan | null>(null);

  const bhajans = useCollection<SatguruBhajan>('satguruBhajans');

  const form = useForm<BhajanFormValues>({
    resolver: zodResolver(bhajanSchema),
    defaultValues: { videoInput: '', title: '', description: '', lyrics: '' },
  });

  const sortedBhajans = useMemo(() => {
    return bhajans?.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()) || [];
  }, [bhajans]);

  const handleSubmit = async (values: BhajanFormValues) => {
    const details = extractVideoDetails(values.videoInput);
    if (!details) {
        toast({ variant: 'destructive', title: 'Invalid Input', description: 'Could not extract a video from the provided text.'});
        return;
    }
    
    const bhajanData = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description || '',
      lyrics: values.lyrics || '',
      videoId: details.videoId ?? undefined,
      videoUrl: details.embedUrl,
      uploadDate: new Date().toISOString(),
      thumbnailUrl: details.videoId ? `https://i.ytimg.com/vi/${details.videoId}/hqdefault.jpg` : undefined,
    };
    
    try {
        await dataManager.setDoc('satguruBhajans', bhajanData, bhajanData.id);
        toast({ title: 'Bhajan Added!', description: `"${values.title}" is now in your bhajan collection.` });
        form.reset();
    } catch(e: any) {
        console.error('Error adding bhajan:', e);
        toast({ variant: 'destructive', title: 'Add Failed', description: e.message || 'Could not add the bhajan. Please try again.' });
    }
  };

  const handleDelete = async (bhajan: SatguruBhajan) => {
    setProcessingId(bhajan.id);
    try {
      dataManager.deleteDoc('satguruBhajans', bhajan.id);
      toast({ title: 'Bhajan Deleted', description: 'The bhajan has been permanently removed.' });
    } catch (e: any) {
      console.error("Delete error:", e);
      toast({ variant: 'destructive', title: 'Deletion Failed', description: e.message });
    } finally {
      setProcessingId(null);
    }
  };

  const openEditDialog = (bhajan: SatguruBhajan) => {
    setEditingBhajan(bhajan);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Music /> Add Satguru Bhajan
          </CardTitle>
          <CardDescription>
            Add a bhajan by pasting its YouTube URL and adding other details.
          </CardDescription>
          <div className="flex justify-center">
            <Image
              src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/images.jpg"
              alt="Satguru Bhajan Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Bhajan Title</label>
              <Input 
                placeholder="Title" 
                {...form.register('title')}
                className="mt-1"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">YouTube URL</label>
              <Input 
                placeholder="https://www.youtube.com/watch?v=..." 
                {...form.register('videoInput')}
                className="mt-1"
              />
              {form.formState.errors.videoInput && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.videoInput.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea 
                placeholder="A brief description of the bhajan..." 
                rows={3}
                {...form.register('description')}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lyrics (Optional)</label>
              <Textarea 
                placeholder="Enter the bhajan lyrics here..." 
                rows={10}
                {...form.register('lyrics')}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="w-full">
                Add Bhajan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Bhajan Gallery</CardTitle>
          <CardDescription>Manage existing bhajans.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedBhajans && sortedBhajans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBhajans.map(bhajan => (
                <Card key={bhajan.id}>
                  <VideoPlayer video={bhajan} />
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold">{bhajan.title}</h3>
                    {bhajan.description && <p className="text-sm text-muted-foreground">{bhajan.description}</p>}
                    {bhajan.lyrics && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="secondary" size="sm" className="mt-2 w-full">
                            <Music size={16} className="mr-2" />
                            View Lyrics
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-4 p-3 bg-muted rounded-md max-h-48 overflow-y-auto">
                            <p className="whitespace-pre-line leading-relaxed text-sm text-muted-foreground">
                              {bhajan.lyrics}
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(bhajan)}><FilePenLine className="h-4 w-4 mr-2" />Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={processingId === bhajan.id}>
                            {processingId === bhajan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete "{bhajan.title}"?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(bhajan)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Bhajans Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add a bhajan using the form above to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}