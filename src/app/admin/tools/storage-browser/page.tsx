'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ImagePlus, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StorageBrowserPage() {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFolder, setTargetFolder] = useState('general');
  const [images, setImages] = useState<Array<{id: string, url: string, title: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GitHub repository details
  const GITHUB_REPO = 'berriescherry8-cell/mool-gyan-assets';
  const GITHUB_BRANCH = 'main';

  const fetchImagesFromGitHub = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the directory listing from GitHub API
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/photos/${targetFolder}?ref=${GITHUB_BRANCH}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images from GitHub');
      }
      
      const files = await response.json();
      
      // Filter for image files and create URLs
      const imageFiles = files
        .filter((file: any) => file.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
        .map((file: any, index: number) => ({
          id: `${targetFolder}-${index}`,
          url: file.download_url,
          title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
        }));
      
      setImages(imageFiles);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images from GitHub. Please check your internet connection.');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesFromGitHub();
  }, [targetFolder]);

  const toggleSelection = (url: string) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(url)) {
        newSelection.delete(url);
      } else {
        newSelection.add(url);
      }
      return newSelection;
    });
  };

  const handleAddSelectedToFirestore = async () => {
    if (selectedImages.size === 0) {
      alert('Please select one or more images to add.');
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would normally add the images to your database
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully added ${selectedImages.size} images to ${targetFolder} collection!`);
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error adding images:', error);
      alert('Failed to add images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = () => {
    fetchImagesFromGitHub();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary" />
          GitHub Storage Browser
        </h1>
        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>GitHub Integration</AlertTitle>
        <AlertDescription>
          This page connects directly to your GitHub repository ({GITHUB_REPO}). 
          Admins can browse images from GitHub and add them to the app. 
          Changes in GitHub are reflected immediately in the app without requiring users to update.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="target-folder">Browse Folder:</Label>
          <Select value={targetFolder} onValueChange={setTargetFolder}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Photos</SelectItem>
              <SelectItem value="pravas">Pravas Photos</SelectItem>
              <SelectItem value="saarSangrah">Saar Sangrah</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddSelectedToFirestore}
          disabled={selectedImages.size === 0 || isProcessing || isLoading}
          className="ml-auto"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              Add Selected ({selectedImages.size})
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="animate-spin h-6 w-6 text-primary" />
            <span>Loading images from GitHub...</span>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className={cn(
              "relative cursor-pointer transition-all hover:scale-105",
              selectedImages.has(image.url) && "ring-2 ring-primary"
            )}
            onClick={() => toggleSelection(image.url)}
          >
            <Image
              src={image.url}
              alt={image.title}
              width={200}
              height={200}
              className="object-cover aspect-square rounded-lg"
              onError={(e) => {
                // Fallback to a default image if loading fails
                (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/assets/photo-placeholder.svg';
              }}
            />
            {selectedImages.has(image.url) && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
              <p className="text-xs truncate">{image.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {images.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No Images Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No images found in the {targetFolder} folder on GitHub.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Add images to: https://github.com/{GITHUB_REPO}/tree/{GITHUB_BRANCH}/photos/{targetFolder}
          </p>
        </div>
      )}
    </div>
  );
}
