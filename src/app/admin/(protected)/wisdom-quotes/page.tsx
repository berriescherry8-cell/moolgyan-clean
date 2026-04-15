'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';

interface WisdomQuote {
  id: string;
  quote: string;
  author?: string;
  is_daily: boolean;
  created_at: string;
}

const PRE_FILLED_QUOTES = [
  { quote: "The greatest wisdom is to know oneself.", author: "Paramhansa Yogananda", is_daily: false },
  { quote: "Silence is the language of God.", author: "Rumi", is_daily: false },
  { quote: "In the midst of movement and chaos, keep stillness in your heart.", author: "Deepak Chopra", is_daily: false },
  { quote: "The soul always knows what to do to heal itself. The challenge is to silence the mind.", author: "Caroline Myss", is_daily: false },
  { quote: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi", is_daily: false },
  { quote: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer", is_daily: false },
  { quote: "The quieter you become, the more you can hear.", author: "Ram Dass", is_daily: false },
  { quote: "Wisdom comes when you stop looking for it and start living with the questions.", author: "Unknown", is_daily: false },
  { quote: "True meditation is witnessing without judgement.", author: "Swami Nirmalananda", is_daily: false },
  { quote: "Let go of what no longer serves you and embrace what aligns with your soul.", author: "Unknown", is_daily: false },
];

export default function WisdomQuotesPage() {
  const { toast } = useToast();
  const quotes = useCollection<WisdomQuote>('wisdom_quotes');
  const [editingQuote, setEditingQuote] = useState<WisdomQuote | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    is_daily: false,
  });

  const resetForm = () => {
    setFormData({ quote: '', author: '', is_daily: false });
    setEditingQuote(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.quote.trim()) {
      toast({ variant: "destructive", description: "Quote required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('wisdom_quotes', formData, editingQuote?.id);
      toast({ description: editingQuote ? "Quote updated" : "Quote added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('wisdom_quotes', id);
      toast({ description: "Quote deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (quote: WisdomQuote) => {
    setFormData({
      quote: quote.quote,
      author: quote.author || '',
      is_daily: quote.is_daily,
    });
    setEditingQuote(quote);
    setShowForm(true);
  };

  const dailyQuotes = quotes.filter(q => q.is_daily);
  const regularQuotes = quotes.filter(q => !q.is_daily);

  const addPreFilled = async () => {
    for (const preQuote of PRE_FILLED_QUOTES) {
      try {
        await dataManager.setDoc('wisdom_quotes', preQuote);
      } catch (error) {
        // Ignore duplicates
      }
    }
    toast({ description: "10 pre-filled quotes added!" });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Wisdom Quotes
          </h1>
          <p className="text-slate-400 mt-1">Daily quotes for home + library ({quotes.length} total)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addPreFilled}>
            Add 10 Pre-filled Quotes
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingQuote ? 'Edit' : 'Add Quote'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Quotes ({dailyQuotes.length})</CardTitle>
            <CardDescription>Featured on home screen</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="max-w-md font-medium">{quote.quote}</TableCell>
                    <TableCell>{quote.author}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(quote)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quote?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the quote.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(quote.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regular Quotes ({regularQuotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="max-w-md font-medium">{quote.quote}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(quote)}>
                        Edit / Make Daily
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingQuote ? 'Edit Quote' : 'Add Quote'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label>Quote *</Label>
              <Textarea
                value={formData.quote}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                placeholder="Enter wisdom quote..."
                rows={4}
              />
            </div>
            <div>
              <Label>Author (optional)</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Author name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_daily}
                onCheckedChange={(checked) => setFormData({...formData, is_daily: checked})}
              />
              <Label className="text-sm font-medium leading-none">
                Daily Quote (home screen)
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingQuote ? 'Update Quote' : 'Add Quote'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
