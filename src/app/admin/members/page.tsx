
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ManageMembersPage() {
  const worksheetLink = 'https://docs.google.com/spreadsheets/d/1FW72PWXZ78Ba0v7mW1RpB9TXwOwFQE-PMeCl8UihABs/edit?usp=sharing';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Manage Members (KGF)</CardTitle>
        <CardDescription>Access the KGF member records in Google Sheets</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-4">
            View and manage all registered KGF members through the Google Sheets worksheet.
          </p>
          <p className="text-sm text-muted-foreground">
            This worksheet contains all member information submitted through the KGF form.
          </p>
        </div>
        
        <Button 
          asChild 
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <a href={worksheetLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            Open KGF Members Worksheet
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
