'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast';
import { dataManager, useCollection } from '@/lib/data-manager';
import { Loader2 } from 'lucide-react';

interface GoogleForm {
  id: string;
  form_type: 'bookstore_order' | 'faq' | 'feedback' | 'join_kgf' | 'deeksha_aavedan';
  url: string;
  created_at: string;
}

export default function ManageGoogleFormsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const forms = useCollection<GoogleForm>('google_forms');

  const FORM_TYPES = [
    { key: 'bookstore_order' as const, label: 'Bookstore Order' },
    { key: 'faq' as const, label: 'FAQ' },
    { key: 'feedback' as const, label: 'Feedback' },
    { key: 'join_kgf' as const, label: 'Join KGF' },
    { key: 'deeksha_aavedan' as const, label: 'Deeksha Aavedan' },
  ] as const;

  const handleUpdateForm = async (form: GoogleForm) => {
    if (!form.url.trim()) {
      toast({ variant: "destructive", description: "URL required" });
      return;
    }

    setSaving(true);
    setSavingId(form.id);
    try {
      await dataManager.setDoc('google_forms', form, form.id);
      toast({ description: `${form.form_type} updated` });
    } catch (error) {
      toast({ variant: "destructive", description: "Update failed" });
    } finally {
      setSaving(false);
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            Manage Google Forms
          </h1>
          <p className="text-slate-400">Edit URLs for 5 forms (used in buttons across app)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form URLs ({forms.length}/5)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FORM_TYPES.map((ft) => {
                  const form = forms.find(f => f.form_type === ft.key);
                  return (
                    <TableRow key={ft.key}>
                      <TableCell className="font-medium">{ft.label}</TableCell>
                      <TableCell>
                        <Input
                          value={form?.url || ''}
                          onChange={(e) => {
                            const updated = form ? {...form, url: e.target.value} : {
                              id: '',
                              form_type: ft.key,
                              url: e.target.value,
                              created_at: new Date().toISOString(),
                            };
                            dataManager.setDoc('google_forms', updated, form?.id);
                          }}
                          placeholder="Paste Google Form/Sheets URL"
                          className="max-w-md"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateForm(form || { id: '', form_type: ft.key, url: '', created_at: '' })}
                          disabled={saving && savingId === form?.id}
                        >
                          {saving && savingId === form?.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            'Save'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}
