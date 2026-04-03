'use client';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, X } from 'lucide-react';

const supabase = createClient(
  'https://lqymwrhfirszrakuevqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
);

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  imageUrl: z.string().optional(),
  showInTicker: z.boolean().default(false),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type NewsFormData = z.infer<typeof newsSchema>;

interface NewsFormProps {
  onSuccess?: () => void;
  initialData?: Partial<NewsFormData> & { id?: string };
}

export default function NewsForm({ onSuccess, initialData }: NewsFormProps) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      author: initialData?.author || 'Admin',
      imageUrl: initialData?.imageUrl || '',
      showInTicker: initialData?.showInTicker || false,
      link: initialData?.link || '',
    },
  });

  // Direct Supabase Upload (No more useUpload hook issue)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('moolgyan-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('moolgyan-media')
        .getPublicUrl(filePath);

      form.setValue('imageUrl', urlData.publicUrl);
      setImagePreview(urlData.publicUrl);

      toast({
        title: '✅ Image Uploaded',
        description: 'Image successfully uploaded to Supabase.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: '❌ Upload Failed',
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '');
    setImagePreview(null);
  };

  const onSubmit = async (data: NewsFormData) => {
    if (!isAuthenticated) {
      toast({ variant: 'destructive', title: 'Authentication required' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newsData = {
        ...data,
        publicationDate: new Date().toISOString(),
      };

      console.log('Saving news:', newsData);

      toast({
        title: initialData ? 'News Updated' : 'News Created',
        description: 'Successfully saved.',
      });

      onSuccess?.();
      form.reset();
      setImagePreview(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please log in as admin.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit News Article' : 'Create New News Article'}</CardTitle>
        <CardDescription>Create or update news articles.</CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register('title')} placeholder="Enter news title" />
              {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...form.register('author')} placeholder="Author name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" {...form.register('content')} rows={6} placeholder="Write full content..." />
            {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">External Link (Optional)</Label>
            <Input id="link" {...form.register('link')} placeholder="https://example.com" />
          </div>

          <div className="space-y-2">
            <Label>News Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            {imagePreview && (
              <div className="relative mt-4 inline-block">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="showInTicker"
              checked={form.watch('showInTicker')}
              onCheckedChange={(checked) => form.setValue('showInTicker', checked)}
            />
            <Label htmlFor="showInTicker">Show in News Ticker</Label>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {initialData ? 'Update Article' : 'Create Article'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}