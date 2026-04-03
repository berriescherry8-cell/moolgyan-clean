
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
  DialogClose,
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
import type { SpiritualPhoto } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';
import { useState } from 'react';
import { Textarea } from './ui/textarea';

const photoFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  folder: z.string().optional(),
});

type PhotoFormValues = z.infer<typeof photoFormSchema>;

interface EditPhotoDialogProps {
  photo: SpiritualPhoto;
  onOpenChange: (open: boolean) => void;
  onPhotoUpdated: (updatedPhoto: SpiritualPhoto) => void;
}

export default function EditPhotoDialog({ photo, onOpenChange, onPhotoUpdated }: EditPhotoDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      title: photo.title || '',
      description: photo.description || '',
      folder: photo.folder || '',
    },
  });

  const onSubmit = async (values: PhotoFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        id: photo.id,
        title: values.title || 'Untitled',
        description: values.description || '',
        folder: values.folder || 'general',
      };
      dataManager.setDoc('spiritualPhotos', updatedData, photo.id);
      
      const updatedPhoto = { ...photo, ...updatedData };
      
      toast({
        title: 'Photo Updated',
        description: `The details for the photo have been successfully updated.`,
      });
      onPhotoUpdated(updatedPhoto);
      onOpenChange(false);
    } catch (e: any) {
      console.error('Error updating photo: ', e);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the photo. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Photo Details</DialogTitle>
        <DialogDescription>
          Modify the title, description, and folder for this photo.
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
                    <Input {...field} placeholder="Enter a title" />
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
                    <Textarea {...field} placeholder="Enter a description" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="folder"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Folder</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="e.g., 'Events', 'Nature'" />
                </FormControl>
                <FormMessage />
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
