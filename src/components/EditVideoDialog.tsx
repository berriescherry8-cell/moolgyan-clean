
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { SatsangVideo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

const videoFormSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

interface EditVideoDialogProps {
  video: SatsangVideo;
  onOpenChange: (open: boolean) => void;
  onVideoUpdated: () => void;
}

export default function EditVideoDialog({ video, onOpenChange, onVideoUpdated }: EditVideoDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: video.title || '',
      description: video.description || '',
      isFeatured: video.isFeatured || false,
    },
  });

  const onSubmit = async (values: VideoFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('satsang_videos')
        .update({
          title: values.title,
          description: values.description,
          is_featured: values.isFeatured
        })
        .eq('id', video.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Video Updated',
        description: `The details for "${values.title}" have been successfully updated.`,
      });
      onVideoUpdated();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Error updating video: ', e);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: e.message || 'Could not update the video. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Video Details</DialogTitle>
        <DialogDescription>
          Modify the title, description, and featured status for this video.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Feature this video?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
