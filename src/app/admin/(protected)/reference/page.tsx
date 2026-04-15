'use client';

import { useState, useEffect } from 'react';
import { useCollection } from '@/lib/data-manager';
import { ReferenceItem } from '@/lib/types';
import ReferenceForm from '@/components/ReferenceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Loader2, Plus, Edit, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';
import { formatDate } from '@/lib/utils'; // or inline

export default function ManageReferencePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ReferenceItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const referenceItems = useCollection<ReferenceItem>('reference_items');
  const [items, setItems] = useState<ReferenceItem[]>([]);

  useEffect(() => {
    if (referenceItems) {
      setItems(referenceItems);
      setLoading(false);
    }
  }, [referenceItems]);

  const handleDelete = async (id: string) => {
    try {
      await dataManager.deleteDoc('reference_items', id);
      toast({ description: "Reference item deleted" });
    } catch (error) {
      toast({ variant: "destructive", description: "Delete failed" });
    }
  };

  const handleEdit = (item: ReferenceItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return <div className="p-8"><Loader2 className="animate-spin mx-auto h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Manage Reference
          </h1>
          <p className="text-slate-400 mt-1">Reference items ({items.length})</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {editingItem ? 'Edit' : 'Add New'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reference Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No reference items. Add some!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.sort((a, b) => new Date(b.uploadDate || b.created_at || '').getTime() - new Date(a.uploadDate || a.created_at || '').getTime()).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-md">{item.title}</TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs">No Image</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.pdfUrl ? 'PDF Available' : 'No PDF'}
                    </TableCell>
                    <TableCell>{formatDate(item.uploadDate || item.created_at || '')}</TableCell>
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
                            <AlertDialogTitle>Delete Reference?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{item.title}". This action cannot be undone.
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
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ReferenceForm 
          initialData={editingItem || undefined} 
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
