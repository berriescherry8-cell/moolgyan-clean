'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';
import { useUpload } from '@/hooks/use-upload';
import { Loader2, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const referenceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  pdfFile: z.any().optional(),
  imageFile: z.any().optional(),
});

type ReferenceFormValues = z.infer<typeof referenceSchema>;

interface ReferenceFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    pdfUrl?: string;
    imageUrl?: string;
  } | null;
}

export default function ReferenceForm({ onSuccess, initialData }: ReferenceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { uploadFile } = useUpload();

  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file.',
        });
        return;
      }
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
    } else {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file.',
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = (type: 'pdf' | 'image') => {
    if (type === 'pdf') {
      setPdfFile(null);
      setPdfPreview(null);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (values: ReferenceFormValues) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let pdfUrl = initialData?.pdfUrl;
      let imageUrl = initialData?.imageUrl;

      // Upload PDF file if provided
      if (pdfFile) {
        const pdfResult = await uploadFile('referenceItems', {}, pdfFile, {
          fieldName: 'pdfUrl',
          path: 'reference'
        });
        if (pdfResult) {
          pdfUrl = pdfResult;
        } else {
          throw new Error('Failed to upload PDF');
        }
      }

      // Upload image file if provided
      if (imageFile) {
        const imageResult = await uploadFile('referenceItems', {}, imageFile, {
          fieldName: 'imageUrl',
          path: 'reference'
        });
        if (imageResult) {
          imageUrl = imageResult;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const referenceData = {
        id: initialData?.id || crypto.randomUUID(),
        title: values.title,
        description: values.description || '',
        pdfUrl: pdfUrl,
        imageUrl: imageUrl,
        uploadDate: new Date().toISOString(),
        storagePath: '', // Will be set by dataManager
      };

      await dataManager.setDoc('referenceItems', referenceData, referenceData.id);
      
      toast({
        title: initialData ? 'Reference Updated' : 'Reference Added',
        description: initialData 
          ? `"${values.title}" has been updated successfully.`
          : `"${values.title}" has been added to the reference section.`,
      });

      form.reset();
      setPdfFile(null);
      setImageFile(null);
      setPdfPreview(null);
      setImagePreview(null);
      setUploadProgress(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving reference:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'Could not save the reference item. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Reference Item' : 'Add New Reference Item'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'Update the details of the reference item.'
            : 'Add a new reference item with optional PDF and image files.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              rows={4}
              {...form.register('description')}
            />
          </div>

          {/* PDF Upload */}
          <div>
            <Label htmlFor="pdfFile">PDF File (Optional)</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative">
                <Input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'pdf')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('pdfFile')?.click()}
                  disabled={isSubmitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {pdfFile ? 'Change PDF' : 'Upload PDF'}
                </Button>
              </div>
              {pdfFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{pdfFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('pdf')}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {initialData?.pdfUrl && !pdfFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Existing PDF</span>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageFile">Image (Optional)</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('imageFile')?.click()}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
              {imageFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>{imageFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('image')}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {initialData?.imageUrl && !imageFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>Existing Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PDF Preview */}
            {pdfPreview && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">PDF Preview</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('pdf')}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted rounded p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">PDF File Selected</p>
                  <p className="text-xs text-muted-foreground mt-1">{pdfFile?.name}</p>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Image Preview</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('image')}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">{uploadProgress}% uploaded</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                initialData ? 'Update Reference' : 'Add Reference'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}