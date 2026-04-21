'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Loader2, Plus, Edit, Trash2, Newspaper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  is_ribbon: boolean;
  created_at: string;
}

export default function ManageNewsPage() {
  const { toast } = useToast();
  const newsItems = useCollection<NewsItem>('news_items');
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_ribbon: false,
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', is_ribbon: false });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ variant: "destructive", description: "Title and content required" });
      return;
    }

    setSaving(true);
    try {
      await dataManager.setDoc('news_items', formData, editingItem?.id);
      toast({ description: editingItem ? "News updated" : "News added" });
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('news_items', id);
      toast({ description: "News deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (item: NewsItem) => {
    setFormData({
      title: item.title,
      content: item.content,
      is_ribbon: item.is_ribbon,
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const ribbonItems = newsItems.filter(i => i.is_ribbon);
  const regularNews = newsItems.filter(i => !i.is_ribbon);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Newspaper className="h-8 w-8" />
              Manage News
            </h1>
            <p className="text-slate-400 mt-1">Posts + Ribbon ticker ({ribbonItems.length} ribbon / {regularNews.length} regular)</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingItem ? 'Edit' : 'Add News'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ribbon News ({ribbonItems.length})</CardTitle>
              <CardDescription>Short news for ticker/ribbon</CardDescription>
            </CardHeader>
            <CardContent>
              {ribbonItems.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No ribbon news. Enable ribbon toggle!</p>
              ) : (
                <div className="space-y-2">
                  {ribbonItems.map((item) => (
                    <div key={item.id} className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.content.substring(0, 100)}...</div>
                      <Button variant="ghost" size="sm" className="mt-1 h-auto p-0 text-xs" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regular News ({regularNews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regularNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
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
                              <AlertDialogTitle>Delete News?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes {item.title}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingItem ? 'Edit News' : 'Add News'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="News title"
                />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="News content..."
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_ribbon}
                  onCheckedChange={(checked) => setFormData({...formData, is_ribbon: checked})}
                />
                <Label className="text-sm font-medium leading-none">
                  News Ribbon (ticker)
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingItem ? 'Update' : 'Add News'}
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

