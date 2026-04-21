'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const WORKSHEETS = [
  {
    title: 'Order Worksheet',
    url: 'https://docs.google.com/spreadsheets/d/1lA2c6iX0r1x0HGJcnPDeDVNBLnU5UDbhpAv8ub7unU8/edit?usp=sharing',
  },
  {
    title: 'Deeksha Aavedan Worksheet',
    url: 'https://docs.google.com/spreadsheets/d/10FjkQV7VA0xr1b71W9LkM9ovv2Lb0qRgWdpSrRmYR1M/edit?usp=sharing',
  },
  {
    title: 'Join KGF Worksheet',
    url: 'https://docs.google.com/spreadsheets/d/1FW72PWXZ78Ba0v7mW1RpB9TXwOwFQE-PMeCl8UihABs/edit?usp=sharing',
  },
  {
    title: 'Feedback Worksheet',
    url: 'https://docs.google.com/spreadsheets/d/1Rnnw8Wqau2m2N06ReCeidIzE59a5rY1T1_gRTptA6jo/edit?usp=sharing',
  },
];

export default function AdminWorksheetsPage() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Admin Worksheets</h1>
        <p className="text-slate-400 mt-1">Quick links to Google Sheets (click to open)</p>
      </div>

      <div className="grid gap-4">
        {WORKSHEETS.map((ws) => (
          <Card key={ws.url}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ws.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild size="lg" className="w-full">
                <a href={ws.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Worksheet
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}