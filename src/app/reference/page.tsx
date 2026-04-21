<<<<<<< HEAD

'use client';

import { useCollection } from '@/lib/data-manager';
import type { ReferenceItem } from '@/lib/types';
import { Loader2, AlertCircle, FileText, Download } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import Image from 'next/image';

export default function ReferencePage() {
  const { t } = useLocale();
  const referenceItems = useCollection<ReferenceItem>('referenceItems');

  const sortedItems = referenceItems?.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  const guruParichayImage = "https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/general-gallery/1774365251330-WhatsApp%20Image%202025-12-30%20at%208.39.57%20AM%20(1)%20-%20Copy.jpeg";

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 font-headline">{t.nav_reference}</h1>

      {/* Guru Parichay Section */}
      <Card className="relative mb-12 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={guruParichayImage}
            alt="Satguru Nitin Das Ji"
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="relative p-6 md:p-8 text-white flex flex-col justify-end min-h-[500px]">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="font-headline text-4xl text-white drop-shadow-lg">{t.nav_guru_parichay}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-white/80 whitespace-pre-line leading-relaxed text-base max-h-60 overflow-y-auto pr-4">
              {t.guru_parichay_content}
            </p>
          </CardContent>
        </div>
      </Card>


      {/* Reference Items Section */}
      {sortedItems && sortedItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow">
              {item.imageUrl && (
                <div className="relative h-48">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Reference Image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {item.title || 'Untitled'}
                </CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                {item.pdfUrl ? (
                  <p className="text-sm text-muted-foreground">Click the button below to view or download the PDF document.</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No PDF document available for this item.</p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                {item.pdfUrl && (
                  <Button asChild className="flex-1">
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                )}
                {item.imageUrl && (
                  <Button asChild variant="outline" className={item.pdfUrl ? "flex-1" : "w-full"}>
                    <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      View Image
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-2xl font-semibold">No Reference Items Found</h3>
          <p className="mt-2 text-muted-foreground">
            Reference materials will be available here soon.
          </p>
        </div>
      )}
=======
'use client';

import { useCollection } from '@/lib/data-manager';
import { ReferenceItem } from '@/lib/types';
import Link from 'next/link';
import { FileText, Download, Image, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function ReferencePage() {
  const referenceItems = useCollection<ReferenceItem>('reference_items');

  const sortedItems = referenceItems?.sort((a, b) => 
    new Date(b.uploadDate || b.created_at || '1970-01-01').getTime() - 
    new Date(a.uploadDate || a.created_at || '1970-01-01').getTime()
  ) || [];

  if (!referenceItems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/30 backdrop-blur-lg border-white/20 text-center">
          <CardContent className="p-12 space-y-6">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Loading...</h1>
            <p className="text-slate-300">Fetching reference materials...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/50 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
            Reference Materials
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Sacred texts, photos, and documents shared by Sadguru Nitin Sahib for spiritual guidance.
          </p>
        </div>

        {sortedItems.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="mx-auto h-24 w-24 text-slate-600 mb-6" />
            <h2 className="text-3xl font-bold text-slate-200 mb-4">No Reference Items Yet</h2>
            <p className="text-xl text-slate-500 max-w-md mx-auto mb-8">
              Reference materials will be available here soon. Check back later!
            </p>
            <Badge className="text-lg px-6 py-3 bg-purple-500/20 border-purple-500/30">Coming Soon</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-2xl hover:shadow-purple-500/10 border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="p-0 relative">
                  {item.imageUrl ? (
                    <div className="relative h-48">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Image className="h-16 w-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(item.uploadDate || item.created_at || '')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardTitle className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </CardTitle>
{item.description && (
                    <CardDescription className="line-clamp-3 mb-6">
                      {item.description}
                    </CardDescription>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {item.pdfUrl ? (
                      <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </a>
                    ) : (
                      <div className="flex-1 bg-slate-800/50 rounded-md p-6 text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-500 mb-2" />
                        <p className="text-slate-500 text-sm">No PDF</p>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="flex-0">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="text-center text-slate-500 mt-12 text-sm">
          Last updated: {formatDate(new Date().toISOString())}
        </p>
      </div>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
    </div>
  );
}
