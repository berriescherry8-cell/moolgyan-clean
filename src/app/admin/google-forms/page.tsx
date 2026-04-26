'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Trash2, 
  Eye, 
  Edit, 
  Loader2, 
  Plus,
  Search,
  Filter,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/lib/data-manager';
import type { GoogleForm } from '@/lib/types';
import { getSupabase } from '@/lib/data-manager';

interface GoogleFormFormData {
  title: string;
  description: string;
  form_url: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

export default function GoogleFormsManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<GoogleForm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<GoogleFormFormData>({
    title: '',
    description: '',
    form_url: '',
    category: 'general',
    is_active: true,
    sort_order: 0
  });

  const googleForms = useCollection<GoogleForm>('google_forms');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'registration', label: 'Registration' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'contact', label: 'Contact' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'donation', label: 'Donation' },
    { value: 'prayer', label: 'Prayer Request' },
    { value: 'event', label: 'Event Registration' }
  ];

  const filteredForms = googleForms?.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.form_url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || form.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && form.is_active) ||
                         (filterStatus === 'inactive' && !form.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const sortedForms = filteredForms?.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const handleSaveForm = async () => {
    if (!formData.title || !formData.form_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and form URL are required' });
      return;
    }

    // Validate URL
    try {
      new URL(formData.form_url);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a valid URL' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const formDataToSave = {
        title: formData.title,
        description: formData.description,
        form_url: formData.form_url,
        category: formData.category,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingForm) {
        await supabase.from('google_forms').update(formDataToSave).eq('id', editingForm.id);
        toast({ title: 'Success', description: 'Form updated successfully' });
      } else {
        const newForm = {
          ...formDataToSave,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        await supabase.from('google_forms').insert(newForm);
        toast({ title: 'Success', description: 'Form added successfully' });
      }

      setFormData({
        title: '',
        description: '',
        form_url: '',
        category: 'general',
        is_active: true,
        sort_order: 0
      });
      setEditingForm(null);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save form' 
      });
    }
  };

  const handleDeleteForm = async (form: GoogleForm) => {
    setProcessingId(form.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('google_forms').delete().eq('id', form.id);
      toast({ title: 'Success', description: 'Form deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete form' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleActive = async (form: GoogleForm) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('google_forms').update({
        is_active: !form.is_active,
        updated_at: new Date().toISOString()
      }).eq('id', form.id);

      toast({ 
        title: 'Success', 
        description: `Form ${form.is_active ? 'deactivated' : 'activated'}` 
      });
    } catch (error: any) {
      console.error('Toggle active error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to toggle active status' 
      });
    }
  };

  const openEditDialog = (form: GoogleForm) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description || '',
      form_url: form.form_url,
      category: form.category || 'general',
      is_active: form.is_active !== false,
      sort_order: form.sort_order || 0
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Success', description: 'URL copied to clipboard' });
  };

  const getStatusBadge = (form: GoogleForm) => {
    return (
      <Badge variant={form.is_active !== false ? 'default' : 'secondary'}>
        {form.is_active !== false ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getFormUrlDisplay = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'forms.gle' || urlObj.hostname === 'docs.google.com') {
        return 'Google Forms';
      }
      return urlObj.hostname;
    } catch {
      return 'External Form';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Google Forms Management</h1>
          <p className="text-muted-foreground">Manage Google Forms and external form links</p>
        </div>
        <Button onClick={() => setEditingForm(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Form
        </Button>
      </div>

      {/* Form Management */}
      <Card>
        <CardHeader>
          <CardTitle>{editingForm ? 'Edit Form' : 'Add New Form'}</CardTitle>
          <CardDescription>
            Add Google Forms or external form links for various purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Form title"
                />
              </div>
              <div>
                <Label htmlFor="form_url">Form URL *</Label>
                <Input
                  id="form_url"
                  value={formData.form_url}
                  onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                  placeholder="https://forms.google.com/..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Form description and purpose"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveForm}>
              {editingForm ? 'Update' : 'Save'} Form
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingForm(null);
                setFormData({
                  title: '',
                  description: '',
                  form_url: '',
                  category: 'general',
                  is_active: true,
                  sort_order: 0
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      <div className="space-y-4">
        {sortedForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedForms.map((form) => (
              <Card key={form.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{form.description}</p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusBadge(form)}
                        {form.category && (
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.value === form.category)?.label || form.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {getFormUrlDisplay(form.form_url)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(form)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(form.form_url, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.form_url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleActive(form)}
                    >
                      {form.is_active !== false ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteForm(form)}
                      disabled={processingId === form.id}
                    >
                      {processingId === form.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No forms found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add your first form to get started'
                }
              </p>
              <Button onClick={() => setEditingForm(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Form
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
