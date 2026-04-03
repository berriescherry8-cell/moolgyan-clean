'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Download } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function PdfViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pdfUrl = searchParams.get('url');
  const bookTitle = searchParams.get('title') || 'document';
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!pdfUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <p className="text-white/60">No PDF URL provided.</p>
      </div>
    );
  }

  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  const handleDownload = async () => {
    if (!pdfUrl) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'No URL is available for this document.',
      });
      return;
    }

    setIsDownloading(true);
    const fileName = `${bookTitle}.pdf`;

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Network response was not ok.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: `"${fileName}" is being saved to your device.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      window.open(pdfUrl, '_blank');
      toast({
        title: 'Download Started',
        description: 'Opening in a new tab for download.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-shrink-0 mb-4 flex justify-between items-center px-2">
        <Button variant="outline" onClick={() => router.back()} className="border-white/10 hover:bg-white/5 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleDownload} disabled={isDownloading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download PDF
        </Button>
      </div>
      <div className="flex-grow relative border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
         <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-black">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-4 mt-4 text-white/60 font-medium">Preparing Viewer...</p>
        </div>
        <iframe
          src={viewerUrl}
          title={bookTitle}
          className="w-full h-full border-0 relative z-10"
        />
      </div>
    </div>
  );
}

export default function PdfViewerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-black"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <PdfViewer />
    </Suspense>
  );
}