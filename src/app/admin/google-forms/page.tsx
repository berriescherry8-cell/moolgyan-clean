'use client';

import { useState, useCallback } from 'react';
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
  AlertCircle,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  MessageSquare,
  Users,
  Clipboard,
  HelpCircle,
  HandHeart,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/data-manager';

interface GoogleForm {
  id: string;
  title: string;
  description?: string;
  form_url: string;
  form_type: 'contact' | 'registration' | 'feedback' | 'volunteer' | 'donation';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface GoogleFormFormData {
  title: string;
  description: string;
  form_url: string;
  form_type: 'contact' | 'registration' | 'feedback' | 'volunteer' | 'donation';
  is_active: boolean;
}

export default function GoogleFormsManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<GoogleForm | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GoogleFormFormData>({
    title: '',
    description: '',
    form_url: '',
    form_type: 'contact',
    is_active: true
  });

  const formTypes = [
    { value: 'contact', label: 'Contact Form', icon: <MessageSquare className="h-4 w-4" />, color: 'bg-blue-500' },
    { value: 'registration', label: 'Registration Form', icon: <Users className="h-4 w-4" />, color: 'bg-green-500' },
    { value: 'feedback', label: 'Feedback Form', icon: <Clipboard className="h-4 w-4" />, color: 'bg-purple-500' },
    { value: 'volunteer', label: 'Volunteer Form', icon: <HandHeart className="h-4 w-4" />, color: 'bg-orange-500' },
    { value: 'donation', label: 'Donation Form', icon: <CreditCard className="h-4 w-4" />, color: 'bg-red-500' }
  ];

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('google_forms')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error: any) {
      console.error('Fetch forms error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch Google Forms'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useState(() => {
    fetchForms();
  });

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || form.form_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSaveForm = async () => {
    if (!formData.title || !formData.form_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and form URL are required' });
      return;
    }

    // Validate Google Forms URL
    if (!formData.form_url.includes('forms.gle') && !formData.form_url.includes('google.com/forms')) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a valid Google Forms URL' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const formDataToSave = {
        title: formData.title,
        description: formData.description,
        form_url: formData.form_url,
        form_type: formData.form_type,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingForm?.id) {
        await supabase.from('google_forms').update(formDataToSave).eq('id', editingForm.id);
        toast({ title: 'Success', description: 'Google Form updated successfully' });
      } else {
        const newForm = {
          ...formDataToSave,
          sort_order: forms.length,
          created_at: new Date().toISOString()
        };
        await supabase.from('google_forms').insert(newForm);
        toast({ title: 'Success', description: 'Google Form added successfully' });
      }

      resetForm();
      fetchForms();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save Google Form' 
      });
    }
  };

  const handleDeleteForm = async (form: GoogleForm) => {
    setProcessingId(form.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('google_forms').delete().eq('id', form.id);

      toast({ title: 'Success', description: 'Google Form deleted successfully' });
      fetchForms();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete Google Form' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const toggleActiveStatus = async (form: GoogleForm) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('google_forms').update({ 
        is_active: !form.is_active 
      }).eq('id', form.id);

      toast({ 
        title: 'Success', 
        description: `Google Form ${form.is_active ? 'deactivated' : 'activated'} successfully` 
      });
      fetchForms();
    } catch (error: any) {
      console.error('Toggle active status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update form status' 
      });
    }
  };

  const openEditDialog = (form: GoogleForm) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description || '',
      form_url: form.form_url,
      form_type: form.form_type,
      is_active: form.is_active
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      form_url: '',
      form_type: 'contact',
      is_active: true
    });
    setEditingForm(null);
  };

  const moveForm = async (form: GoogleForm, direction: 'up' | 'down') => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const currentIndex = forms.findIndex(f => f.id === form.id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= forms.length) return;

      const otherForm = forms[newIndex];
      
      // Swap sort orders
      await supabase.from('google_forms').update({ 
        sort_order: otherForm.sort_order 
      }).eq('id', form.id);
      
      await supabase.from('google_forms').update({ 
        sort_order: form.sort_order 
      }).eq('id', otherForm.id);

      fetchForms();
    } catch (error: any) {
      console.error('Move form error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to reorder form' 
      });
    }
  };

  const getFormTypeInfo = (type: string) => {
    return formTypes.find(ft => ft.value === type) || formTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Google Forms Management</h1>
          <p className="text-muted-foreground">Manage form links for user interactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setEditingForm({} as GoogleForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Form
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(editingForm || formData.title) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingForm?.id ? 'Edit Google Form' : 'Add New Google Form'}</CardTitle>
            <CardDescription>
              Add Google Forms links for users to contact, register, provide feedback, volunteer, or donate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Form description"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Form Details</h3>
              <div>
                <Label htmlFor="form_type">Form Type *</Label>
                <Select
                  value={formData.form_type}
                  onValueChange={(value: 'contact' | 'registration' | 'feedback' | 'volunteer' | 'donation') => setFormData({ ...formData, form_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    {formTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="form_url">Google Forms URL *</Label>
                <Input
                  id="form_url"
                  value={formData.form_url}
                  onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                  placeholder="https://forms.gle/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the complete Google Forms URL (forms.gle or google.com/forms)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSaveForm}>
                {editingForm?.id ? 'Update Form' : 'Add Form'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {formTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid/List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
              <p>Loading Google Forms...</p>
            </CardContent>
          </Card>
        ) : filteredForms.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredForms.map((form, index) => {
              const typeInfo = getFormTypeInfo(form.form_type);
              return (
                <Card key={form.id} className="overflow-hidden">
                  {viewMode === 'grid' ? (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${typeInfo.color} bg-opacity-10`}>
                          <div className={typeInfo.color.replace('bg-', 'text-')}>
                            {typeInfo.icon}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={form.is_active ? "default" : "secondary"}>
                            {form.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{form.description}</p>
                      )}
                      <Badge variant="outline" className="w-fit">
                        {typeInfo.label}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center p-4">
                      <div className={`p-3 rounded-lg mr-4 ${typeInfo.color} bg-opacity-10`}>
                        <div className={typeInfo.color.replace('bg-', 'text-')}>
                          {typeInfo.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{form.title}</h3>
                        <p className="text-sm text-gray-500">{typeInfo.label}</p>
                        {form.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Badge variant={form.is_active ? "default" : "secondary"}>
                          {form.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(form)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(form.form_url, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleActiveStatus(form)}
                      >
                        {form.is_active ? 'Deactivate' : 'Activate'}
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
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Google Forms found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add your first Google Form to get started'
                }
              </p>
              <Button onClick={() => setEditingForm({} as GoogleForm)}>
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
