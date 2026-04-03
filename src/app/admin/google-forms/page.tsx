'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n';
import { dataManager } from '@/lib/data-manager';
import { Loader2, ExternalLink, Save } from 'lucide-react';

const googleFormsSchema = z.object({
  deekshaFormLink: z.string().url({ message: 'Please enter a valid URL.' }),
  feedbackFormLink: z.string().url({ message: 'Please enter a valid URL.' }),
  joinFormLink: z.string().url({ message: 'Please enter a valid URL.' }),
  worksheetLink: z.string().url({ message: 'Please enter a valid URL.' }),
});

type GoogleFormsValues = z.infer<typeof googleFormsSchema>;

export default function GoogleFormsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing links from data manager
  const existingLinks = dataManager.getDoc('googleForms', 'links');
  const defaultValues: GoogleFormsValues = {
    deekshaFormLink: (existingLinks as any)?.deekshaFormLink || '',
    feedbackFormLink: (existingLinks as any)?.feedbackFormLink || '',
    joinFormLink: (existingLinks as any)?.joinFormLink || '',
    worksheetLink: (existingLinks as any)?.worksheetLink || '',
  };

  const form = useForm<GoogleFormsValues>({
    resolver: zodResolver(googleFormsSchema),
    defaultValues,
  });

  const onSubmit = async (data: GoogleFormsValues) => {
    setIsSubmitting(true);
    try {
      dataManager.setDoc('googleForms', data as any, 'links');
      toast({
        title: t.toast_success,
        description: 'Google Form links updated successfully!',
      });
    } catch (error: any) {
      console.error("Google Forms Update Error:", error);
      toast({
        variant: 'destructive',
        title: t.toast_error,
        description: 'Failed to update Google Form links.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t.admin_google_forms}</CardTitle>
          <CardDescription>{t.admin_google_forms_desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="deekshaFormLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin_deeksha_form_link}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://docs.google.com/forms/d/e/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedbackFormLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin_feedback_form_link}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://docs.google.com/forms/d/e/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinFormLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin_join_form_link}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://docs.google.com/forms/d/e/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="worksheetLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin_worksheet_link}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://docs.google.com/spreadsheets/d/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.admin_update_links}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.admin_update_links}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}