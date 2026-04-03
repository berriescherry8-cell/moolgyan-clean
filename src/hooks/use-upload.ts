'use client';

import { useToast } from '@/hooks/use-toast';
import { useUpload as useUploadContext } from '@/context/UploadProvider';

export function useUpload() {
  const { toast } = useToast();
  const { addUpload, updateUploadProgress, finishUpload } = useUploadContext();

  // GitHub API configuration
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO; // Format: owner/repo
  const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';

  const uploadFile = async <T extends { id?: string }>(
    collectionName: string,
    data: Partial<Omit<T, 'id' | 'imageUrl' | 'storagePath' | 'fileUrl'>>,
    file: File | null,
    fileMetadata: { fieldName: string; path: string } | null,
    docId?: string
  ): Promise<string> => {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      const error = new Error('GitHub configuration not set. Please set NEXT_PUBLIC_GITHUB_TOKEN and NEXT_PUBLIC_GITHUB_REPO environment variables.');
      toast({ variant: 'destructive', title: error.message });
      throw error;
    }

    const isUpdating = !!docId;
    const finalDocId = docId || crypto.randomUUID();

    // Case 1: No file to upload, just a database write.
    if (!file || !fileMetadata) {
      // For now, we'll store data in localStorage as a simple alternative to Firebase
      const existingData = JSON.parse(localStorage.getItem(collectionName) || '[]');
      const newData = isUpdating 
        ? existingData.map(item => item.id === finalDocId ? { ...data, id: finalDocId } : item)
        : [...existingData, { ...data, id: finalDocId }];
      
      localStorage.setItem(collectionName, JSON.stringify(newData));
      toast({ title: 'Success', description: isUpdating ? 'Record updated.' : 'Record created.' });
      return finalDocId;
    }

    // Case 2: File upload required.
    const uploadId = finalDocId;
    addUpload(uploadId, file.name);
    
    try {
      // Read file as base64
      const base64Data = await fileToBase64(file);
      
      // Create GitHub API URL
      const fileName = `${finalDocId}_${file.name}`;
      const filePath = `${fileMetadata.path}/${fileName}`;
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

      // Check if file exists (for updates)
      let sha = null;
      if (isUpdating) {
        try {
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (response.ok) {
            const result = await response.json();
            sha = result.sha;
          }
        } catch (error) {
          console.log('File does not exist, will create new one');
        }
      }

      // Upload to GitHub
      const uploadResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: isUpdating ? `Update ${fileName}` : `Add ${fileName}`,
          content: base64Data.split(',')[1], // Remove data URL prefix
          branch: GITHUB_BRANCH,
          sha: sha // Include SHA for updates
        })
      });

      if (!uploadResponse.ok) {
        throw new Error(`GitHub upload failed: ${uploadResponse.status}`);
      }

      const result = await uploadResponse.json();
      const downloadURL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

      // Save metadata to localStorage
      const existingData = JSON.parse(localStorage.getItem(collectionName) || '[]');
      const finalData: Record<string, any> = {
        ...data,
        [fileMetadata.fieldName]: downloadURL,
        storagePath: filePath,
      };

      const newData = isUpdating 
        ? existingData.map(item => item.id === finalDocId ? { ...finalData, id: finalDocId } : item)
        : [...existingData, { ...finalData, id: finalDocId }];
      
      localStorage.setItem(collectionName, JSON.stringify(newData));

      finishUpload(uploadId, 'completed');
      toast({ title: 'Upload Complete!', description: `"${file.name}" has been successfully saved to GitHub.` });
      
      return finalDocId;

    } catch (error: any) {
      console.error("Upload process failed:", error);
      finishUpload(uploadId, 'error');
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
      throw error;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return { uploadFile };
}