
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
    </div>
  );
}
