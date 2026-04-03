'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, UploadCloud, ImageIcon, Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';

// Hardcoded saar-sangrah photos data
const saarSangrahPhotos = [
  {
    id: '1',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo1.jpg',
    uploadDate: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo2.jpg',
    uploadDate: '2024-01-20T14:45:00Z',
  },
  {
    id: '3',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo3.jpg',
    uploadDate: '2024-01-25T09:15:00Z',
  },
  {
    id: '4',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo4.jpg',
    uploadDate: '2024-02-01T16:20:00Z',
  },
  {
    id: '5',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo5.jpg',
    uploadDate: '2024-02-05T11:10:00Z',
  },
  {
    id: '6',
    imageUrl: 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/photos/saarSangrah/photo6.jpg',
    uploadDate: '2024-02-10T13:30:00Z',
  },
];

export default function AdminSaarSangrahPage() {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Sort photos by upload date (newest first)
  const sortedPhotos = [...saarSangrahPhotos].sort((a, b) =>
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Upload functionality is disabled in demo mode. Photos are loaded from hardcoded data.');
  };

  const handleDelete = async (photo: typeof saarSangrahPhotos[0]) => {
    setIsDeleting(photo.id);

    // Simulate delete process
    setTimeout(() => {
      setIsDeleting(null);
      alert('Delete functionality is disabled in demo mode. Photos are loaded from hardcoded data.');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <UploadCloud /> Manage Saar Sangrah
          </CardTitle>
          <CardDescription>Upload photos to the Saar Sangrah gallery. Photos appear without a title.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="photoFile">New Photo</Label>
              <Input
                id="photoFile"
                type="file"
                accept="image/*"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Upload Photo
              </Button>
              <Button variant="secondary" asChild>
                <a href="https://github.com/berriescherry8-cell/mool-gyan-assets/tree/main/photos/saarSangrah" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View in GitHub
                </a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Photo Gallery</CardTitle>
          <CardDescription>Manage uploaded photos.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedPhotos && sortedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedPhotos.map(photo => (
                <Card key={photo.id} className="group relative">
                  <Image
                    src={photo.imageUrl}
                    alt={'Saar Sangrah Photo'}
                    width={200}
                    height={200}
                    className="object-cover aspect-square rounded-lg"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/assets/photo-placeholder.svg';
                    }}
                  />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="h-7 w-7" disabled={isDeleting === photo.id}>
                          {isDeleting === photo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete this photo. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(photo)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Photos Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a photo using the form above to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
