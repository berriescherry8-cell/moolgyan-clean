'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Upload {
  id: string;
  fileName: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

interface UploadContextType {
  uploads: Upload[];
  addUpload: (id: string, fileName: string) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  finishUpload: (id: string, status: 'completed' | 'error') => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const addUpload = useCallback((id: string, fileName: string) => {
    setUploads(prev => [...prev, { id, fileName, status: 'uploading', progress: 0 }]);
  }, []);

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, progress } : upload
    ));
  }, []);

  const finishUpload = useCallback((id: string, status: 'completed' | 'error') => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, status } : upload
    ));
  }, []);

  return (
    <UploadContext.Provider value={{ uploads, addUpload, updateUploadProgress, finishUpload }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}