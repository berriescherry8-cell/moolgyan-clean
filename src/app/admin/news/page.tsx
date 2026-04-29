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
  Calendar,
  User,
  Tag,
  Star,
  Globe,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/data-manager';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author?: string;
  category?: string;
  tags?: string[];
  language: string;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface NewsFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  author: string;
  category: string;
  tags: string[];
  language: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
}

const preWrittenNews = [
  {
    title: 'मूल ग्यान केंद्र में नए आध्यात्मिक कार्यक्रमों की शुरुआत',
    slug: 'mool-gyan-centre-new-spiritual-programs',
    content: `मूल ग्यान केंद्र में इस माह से कई नए आध्यात्मिक कार्यक्रम शुरू हो रहे हैं। इनमें सुबह की साधना, सायं की सत्संग, और साप्ताहिक भजन संध्या शामिल हैं। सभी भक्तजनों का स्वागत है।

केंद्र प्रबंधक ने बताया कि ये कार्यक्रम लोगों के जीवन में आध्यात्मिकता लाने के लिए शुरू किए गए हैं। सुबह 6 बजे से 8 बजे तक मुक्त ध्यान का आयोजन किया जाएगा, जिसमें कोई भी भाग ले सकता है। शाम 7 बजे से 9 बजे तक सत्संग में गुरुजी के प्रवचन सुनाए जाएंगे और भजन होंगे।

इन कार्यक्रमों में भाग लेने के लिए कोई पंजीकरण शुल्क नहीं है। बस आपको समय पर केंद्र पहुंचना है। केंद्र पर सभी जरूरी सुविधाएं उपलब्ध हैं।`,
    excerpt: 'मूल ग्यान केंद्र में इस माह से कई नए आध्यात्मिक कार्यक्रम शुरू हो रहे हैं। सुबह की साधना, सायं की सत्संग, और साप्ताहिक भजन संध्या शामिल हैं।',
    author: 'मूल ग्यान प्रशासन',
    category: 'आध्यात्मिक कार्यक्रम',
    tags: ['आध्यात्मिक', 'कार्यक्रम', 'सत्संग', 'भजन'],
    language: 'hi'
  },
  {
    title: 'गुरु पूर्णिमा महोत्सव की तैयारियां शुरू',
    slug: 'guru-purnima-preparations-start',
    content: `आगामी गुरु पूर्णिमा महोत्सव को भव्यता से मनाने की तैयारियां शुरू हो गई हैं। केंद्र पर विशेष भजन, कथा, और भंडारे का आयोजन किया जाएगा।

गुरु पूर्णिमा हिंदू धर्म में एक बहुत ही पवित्र त्योहार है, जिसे गुरुओं के प्रति सम्मान जताने के लिए मनाया जाता है। इस दिन भक्तजन अपने गुरुओं का आशीर्वाद करते हैं और उनके उपदेशों का पालन करते हैं।

मूल ग्यान केंद्र में इस बार गुरु पूर्णिमा विशेष रूप से मनाई जाएगी। कार्यक्रम सुबह 5 बजे से शुरू होगा, जिसमें सुबह की आरती, गुरु पूजा, और विशेष भजन संध्या शामिल होगी। दोपहर में भंडारे का आयोजन किया जाएगा, जिसमें सभी भक्तजनों को प्रसाद वितरित किया जाएगा।

केंद्र प्रबंधक ने बताया कि इस महोत्सव में भाग लेने के लिए दूर-दूर से भक्तजन आएंगे। उन्हें ठहरने की व्यवस्था भी की जाएगी।`,
    excerpt: 'आगामी गुरु पूर्णिमा महोत्सव को भव्यता से मनाने की तैयारियां शुरू हो गई हैं। केंद्र पर विशेष भजन, कथा, और भंडारे का आयोजन किया जाएगा।',
    author: 'मूल ग्यान प्रशासन',
    category: 'त्योहार',
    tags: ['गुरु पूर्णिमा', 'महोत्सव', 'भजन', 'कथा', 'भंडारा'],
    language: 'hi'
  },
  {
    title: 'नई आध्यात्मिक पुस्तकें प्रकाशित',
    slug: 'new-spiritual-books-published',
    content: `मूल ग्यान प्रकाशन द्वारा तीन नई आध्यात्मिक पुस्तकें प्रकाशित की गई हैं। इनमें ध्यान की तकनीक, भक्ति के मार्ग, और जीवन के सिद्धांत शामिल हैं।

प्रकाशन के अवसर पर केंद्र पर एक विशेष कार्यक्रम का आयोजन किया गया, जिसमें प्रसिद्ध लेखकों और आध्यात्मिक गुरुओं ने भाग लिया। इन पुस्तकों को लिखने वाले लेखकों ने अपने अनुभव साझा किए।

पहली पुस्तक "ध्यान की आधार भूमि" है, जिसमें ध्यान के विभिन्न पहलुओं और उनके लाभों के बारे में विस्तृत रूप से बताया गया है। दूसरी पुस्तक "भक्ति के मार्ग" में भक्ति के विभिन्न मार्गों और उन्हें अपनाने के तरीकों पर प्रकाश डाला गया है। तीसरी पुस्तक "जीवन के सिद्धांत" में जीवन जीने के मूल सिद्धांतों पर चर्चा की गई है।

ये पुस्तकें केंद्र पर उपलब्ध हैं और ऑनलाइन भी खरीदी जा सकती हैं। प्रकाशन ने इन पुस्तकों की कीमत भी बहुत कम रखी है ताकि अधिक से अधिक लोग इन्हें पढ़ सकें।`,
    excerpt: 'मूल ग्यान प्रकाशन द्वारा तीन नई आध्यात्मिक पुस्तकें प्रकाशित की गई हैं। इनमें ध्यान की तकनीक, भक्ति के मार्ग, और जीवन के सिद्धांत शामिल हैं।',
    author: 'मूल ग्यान प्रकाशन',
    category: 'पुस्तकें',
    tags: ['पुस्तक', 'प्रकाशन', 'आध्यात्मिक', 'ध्यान', 'भक्ति'],
    language: 'hi'
  },
  {
    title: 'ऑनलाइन सत्संग की सुविधा शुरू',
    slug: 'online-satsang-facility-started',
    content: `दूर दराज के भक्तजनों के लिए अब ऑनलाइन सत्संग की सुविधा शुरू कर दी गई है। यूट्यूब और जूम के माध्यम से रोजाना सुबह 6 बजे सत्संग होगा।

इस सुविधा को शुरू करने का मुख्य उद्देश्य उन भक्तजनों तक पहुंचना है जो केंद्र तक नहीं आ सकते हैं या जो दूर से आध्यात्मिक सत्संग में भाग लेना चाहते हैं। अब वे अपने घर बैठे ही सत्संग में भाग ले सकेंगे।

ऑनलाइन सत्संग के लिए भक्तजनों को यूट्यूब चैनल "मूल ग्यान सत्संग" को सब्सक्राइब करना होगा। सुबह 6 बजे लाइव सत्संग शुरू होगा और यह एक घंटे तक चलेगा। भक्तजन लाइव कमेंट के माध्यम से अपने प्रश्न भी पूछ सकेंगे।

केंद्र के तकनीकी विशेषज्ञ ने बताया कि इस सुविधा की गुणवत्ता सुनिश्चित करने के लिए हाई-स्पीड इंटरनेट कनेक्शन का इंतजाम किया गया है। अगर किसी को तकनीकी समस्या आती है, तो केंद्र की टीम मदद करेगी।`,
    excerpt: 'दूर दराज के भक्तजनों के लिए अब ऑनलाइन सत्संग की सुविधा शुरू कर दी गई है। यूट्यूब और जूम के माध्यम से रोजाना सुबह 6 बजे सत्संग होगा।',
    author: 'मूल ग्यान टेक टीम',
    category: 'डिजिटल',
    tags: ['ऑनलाइन', 'सत्संग', 'यूट्यूब', 'जूम', 'लाइव'],
    language: 'hi'
  },
  {
    title: 'सामुदायिक भोजन का आयोजन सफल',
    slug: 'community-bhojan-successful',
    content: `पिछले दिनों आयोजित सामुदायिक भोजन कार्यक्रम में सैकड़ों भक्तजनों ने भाग लिया। सभी को प्रसाद वितरित किया गया और आध्यात्मिक चर्चा हुई।

यह कार्यक्रम मूल ग्यान केंद्र के प्रांगण में आयोजित किया गया था। सुबह 11 बजे से शाम 4 बजे तक चले इस कार्यक्रम में न केवल भोजन का आयोजन किया गया, बल्कि आध्यात्मिक गतिविधियां भी सिखाई गईं।

भोजन कार्यक्रम में स्वयंसेवकों ने बहुत सक्रिय भूमिका निभाई। उन्होंने भोजन तैयार करने से लेकर सेवा तक सभी कामों को बहुत ही इमानदारी से निभाया। केंद्र के सेवादल ने उनके प्रयास की सराहना की।

कार्यक्रम के दौरान, प्रसिद्ध आध्यात्मिक वक्ताओं ने भक्तजनों को सेवा के महत्व के बारे में बताया। उन्होंने कहा कि सेवा ही सच्ची भक्ति है और यह हमें ईश्वर के करीब के और करीब होने में मदद करती है।

भोजन कार्यक्रम के अंत में सभी भक्तजनों ने एक साथ मिलकर प्रसाद ग्रहण किया और एक-दूसरे को शुभकामनाएं दीं।`,
    excerpt: 'पिछले दिनों आयोजित सामुदायिक भोजन कार्यक्रम में सैकड़ों भक्तजनों ने भाग लिया। सभी को प्रसाद वितरित किया गया और आध्यात्मिक चर्चा हुई।',
    author: 'मूल ग्यान सेवा दल',
    category: 'सेवा',
    tags: ['भोजन', 'सेवा', 'समुदाय', 'प्रसाद', 'भक्तजन'],
    language: 'hi'
  }
];

export default function NewsManagementPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    author: '',
    category: '',
    tags: [],
    language: 'hi',
    is_featured: false,
    is_published: false,
    published_at: ''
  });

  const categories = [
    'आध्यात्मिक कार्यक्रम',
    'त्योहार',
    'पुस्तकें',
    'डिजिटल',
    'सेवा',
    'घोषणा',
    'शिक्षा',
    'स्वास्थ्य',
    'अन्य'
  ];

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error: any) {
      console.error('Fetch news error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch news items'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useState(() => {
    fetchNews();
  });

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || news.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && news.is_published) ||
                         (filterStatus === 'draft' && !news.is_published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSaveNews = async () => {
    if (!formData.title || !formData.content) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and content are required' });
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      const newsData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        featured_image_url: formData.featured_image_url,
        author: formData.author,
        category: formData.category,
        tags: formData.tags,
        language: formData.language,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        published_at: formData.is_published ? (formData.published_at || new Date().toISOString()) : null,
        updated_at: new Date().toISOString()
      };

      if (editingNews?.id) {
        await supabase.from('news_items').update(newsData).eq('id', editingNews.id);
        toast({ title: 'Success', description: 'News item updated successfully' });
      } else {
        const newNews = {
          ...newsData,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString()
        };
        await supabase.from('news_items').insert(newNews);
        toast({ title: 'Success', description: 'News item added successfully' });
      }

      resetForm();
      fetchNews();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Save Failed', 
        description: error.message || 'Failed to save news item' 
      });
    }
  };

  const handleDeleteNews = async (news: NewsItem) => {
    setProcessingId(news.id);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').delete().eq('id', news.id);

      toast({ title: 'Success', description: 'News item deleted successfully' });
      fetchNews();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Delete Failed', 
        description: error.message || 'Failed to delete news item' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const togglePublishStatus = async (news: NewsItem) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').update({ 
        is_published: !news.is_published,
        published_at: !news.is_published ? new Date().toISOString() : news.published_at
      }).eq('id', news.id);

      toast({ 
        title: 'Success', 
        description: `News item ${news.is_published ? 'unpublished' : 'published'} successfully` 
      });
      fetchNews();
    } catch (error: any) {
      console.error('Toggle publish status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update publish status' 
      });
    }
  };

  const toggleFeaturedStatus = async (news: NewsItem) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');

      await supabase.from('news_items').update({ 
        is_featured: !news.is_featured 
      }).eq('id', news.id);

      toast({ 
        title: 'Success', 
        description: `News item ${news.is_featured ? 'removed from' : 'added to'} featured successfully` 
      });
      fetchNews();
    } catch (error: any) {
      console.error('Toggle featured status error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update featured status' 
      });
    }
  };

  const openEditDialog = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      slug: news.slug,
      content: news.content,
      excerpt: news.excerpt || '',
      featured_image_url: news.featured_image_url || '',
      author: news.author || '',
      category: news.category || '',
      tags: news.tags || [],
      language: news.language,
      is_featured: news.is_featured,
      is_published: news.is_published,
      published_at: news.published_at || ''
    });
  };

  const loadPreWrittenNews = (preWrittenItem: any) => {
    setFormData({
      title: preWrittenItem.title,
      slug: preWrittenItem.slug,
      content: preWrittenItem.content,
      excerpt: preWrittenItem.excerpt,
      featured_image_url: '',
      author: preWrittenItem.author,
      category: preWrittenItem.category,
      tags: preWrittenItem.tags,
      language: preWrittenItem.language,
      is_featured: false,
      is_published: false,
      published_at: ''
    });
    setEditingNews({} as NewsItem);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      author: '',
      category: '',
      tags: [],
      language: 'hi',
      is_featured: false,
      is_published: false,
      published_at: ''
    });
    setEditingNews(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Success', description: 'Copied to clipboard' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Publish and manage news articles</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setEditingNews({} as NewsItem)}>
            <Plus className="h-4 w-4 mr-2" />
            Add News
          </Button>
        </div>
      </div>

      {/* Pre-written News Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Pre-written Hindi News Templates
          </CardTitle>
          <CardDescription>
            Click on any template to load it into the editor. You can modify and publish it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preWrittenNews.map((item, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => loadPreWrittenNews(item)}>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit News Form */}
      {(editingNews || formData.title) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingNews?.id ? 'Edit News Item' : 'Add New News Item'}</CardTitle>
            <CardDescription>
              Create news articles in Hindi. Featured items will appear prominently on the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title,
                        slug: generateSlug(title)
                      });
                    }}
                    placeholder="News title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="news-slug"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the news"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Author</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content</h3>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full news content in Hindi"
                  rows={10}
                />
              </div>
              <div>
                <Label htmlFor="featured_image_url">Featured Image URL</Label>
                <Input
                  id="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Publishing Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="published_at">Publish Date</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSaveNews}>
                {editingNews?.id ? 'Update News' : 'Publish News'}
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
                  placeholder="Search news..."
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
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Grid/List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
              <p>Loading news...</p>
            </CardContent>
          </Card>
        ) : filteredNews.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredNews.map((news) => (
              <Card key={news.id} className="overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="aspect-video relative">
                    {news.featured_image_url ? (
                      <img
                        src={news.featured_image_url}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {news.is_featured && (
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={news.is_published ? "default" : "secondary"}>
                        {news.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4">
                    {news.featured_image_url ? (
                      <img
                        src={news.featured_image_url}
                        alt={news.title}
                        className="w-32 h-20 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded mr-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{news.title}</h3>
                      <p className="text-sm text-gray-500">
                        {news.author} • {news.category}
                      </p>
                      {news.published_at && (
                        <p className="text-xs text-gray-400">
                          {formatDate(news.published_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{news.title}</h3>
                  {news.excerpt && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                  )}
                  {news.category && (
                    <Badge variant="outline" className="mb-4">
                      {news.category}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(news)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/news/${news.slug}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => togglePublishStatus(news)}
                    >
                      {news.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFeaturedStatus(news)}
                    >
                      {news.is_featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteNews(news)}
                      disabled={processingId === news.id}
                    >
                      {processingId === news.id ? (
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
              <h3 className="text-lg font-semibold mb-2">No news items found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add your first news item or use a template to get started'
                }
              </p>
              <Button onClick={() => setEditingNews({} as NewsItem)}>
                <Plus className="h-4 w-4 mr-2" />
                Add News
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
