
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ManageDeekshaPage() {
  const worksheetLink = 'https://docs.google.com/spreadsheets/d/10FjkQV7VA0xr1b71W9LkM9ovv2Lb0qRgWdpSrRmYR1M/edit?usp=sharing';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Manage Deeksha Aavedan</CardTitle>
        <CardDescription>Access the Deeksha application submissions in Google Sheets</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-4">
            View and manage Deeksha applications through the Google Sheets worksheet.
          </p>
          <p className="text-sm text-muted-foreground">
            This worksheet contains all Deeksha application submissions and their status.
          </p>
        </div>
        
        <Button 
          asChild 
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <a href={worksheetLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            Open Deeksha Worksheet
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
