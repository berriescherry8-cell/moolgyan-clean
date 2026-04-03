
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ManageFeedbackPage() {
  const worksheetLink = 'https://docs.google.com/spreadsheets/d/1Rnnw8Wqau2m2N06ReCeidIzE59a5rY1T1_gRTptA6jo/edit?usp=sharing';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Manage Feedback</CardTitle>
        <CardDescription>Access the feedback submissions in Google Sheets</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-4">
            View and manage all feedback submitted by users through the Google Sheets worksheet.
          </p>
          <p className="text-sm text-muted-foreground">
            This worksheet contains all user feedback and suggestions for the application.
          </p>
        </div>
        
        <Button 
          asChild 
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <a href={worksheetLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            Open Feedback Worksheet
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
