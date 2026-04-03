'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { ExternalLink } from 'lucide-react';
import { dataManager } from '@/lib/data-manager';

export default function WorksheetPage() {
  const { t } = useLocale();
  const [isOpening, setIsOpening] = useState(false);

  // Get the worksheet link from data manager
  const googleForms = dataManager.getDoc('googleForms', 'links') as any;
  const worksheetLink = googleForms?.worksheetLink || 'https://docs.google.com/spreadsheets/d/1Rnnw8Wqau2m2N06ReCeidIzE59a5rY1T1_gRTptA6jo/edit?usp=sharing';

  const handleOpenWorksheet = () => {
    setIsOpening(true);
    setTimeout(() => {
      window.open(worksheetLink, '_blank', 'noopener,noreferrer');
      setIsOpening(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t.google_form_worksheet}</CardTitle>
          <CardDescription>{t.google_form_worksheet_desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">{t.admin_worksheet_link}</h3>
            <p className="text-sm text-muted-foreground mb-4">{worksheetLink}</p>
            <Button 
              onClick={handleOpenWorksheet} 
              disabled={isOpening}
              className="w-full sm:w-auto"
            >
              {isOpening ? (
                <>
                  <ExternalLink className="mr-2 h-4 w-4 animate-spin" />
                  {t.google_form_worksheet_button}...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t.google_form_worksheet_button}
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.admin_manage_deeksha}</CardTitle>
                <CardDescription>{t.admin_deeksha_desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/deeksha'}>
                  {t.admin_go_to_section}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.admin_manage_feedback}</CardTitle>
                <CardDescription>{t.admin_feedback_desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/feedback'}>
                  {t.admin_go_to_section}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.admin_manage_members}</CardTitle>
                <CardDescription>{t.admin_members_desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/members'}>
                  {t.admin_go_to_section}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}