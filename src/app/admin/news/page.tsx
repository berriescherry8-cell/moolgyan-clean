'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Newspaper, Trash2, Edit, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCollection } from '@/lib/data-manager';
import { dataManager } from '@/lib/data-manager';
import NewsForm from '@/components/NewsForm';

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  publicationDate: string;
  author: string;
  showInTicker: boolean;
  imageUrl: string | null;
  link?: string;
};

export default function ManageNewsPage() {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const articles = useCollection<NewsArticle>('newsArticles');

  const handleDeleteArticle = async (article: NewsArticle) => {
    setProcessingId(article.id);
    try {
      dataManager.deleteDoc('newsArticles', article.id);
      toast({
        title: 'Article Deleted',
        description: `"${article.title}" has been removed.`,
      });
    } catch (e: any) {
      console.error("Error deleting article: ", e);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: e.message || "Could not delete the article.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setShowAddForm(false);
  };

  const handleAddArticle = () => {
    setEditingArticle(null);
    setShowAddForm(true);
  };

  const handleFormSuccess = () => {
    setEditingArticle(null);
    setShowAddForm(false);
  };

  const templateNews = [
    {
      title: 'सत्संग शुरू हो गया है',
      content: 'आज से सत्संग का कार्यक्रम शुरू हो गया है। सभी भक्तों से अनुरोध है कि नियमित रूप से भाग लें।',
      showInTicker: true,
    },
    {
      title: 'पुस्तकें उपलब्ध हैं, जल्दी करें',
      content: 'हमारी आध्यात्मिक पुस्तकें अब उपलब्ध हैं। ज्ञान प्राप्ति के लिए अभी ऑर्डर करें।',
      showInTicker: true,
    },
    {
      title: 'नया भजन संग्रह जारी',
      content: 'हमारे सतगुरु का नया भजन संग्रह अब उपलब्ध है। आध्यात्मिक आनंद के लिए डाउनलोड करें।',
      showInTicker: true,
    },
    {
      title: 'सत्संग स्थल पर निर्माण कार्य चल रहा है',
      content: 'सत्संग स्थल पर निर्माण कार्य जारी है। सभी भक्तों से सहयोग की अपेक्षा है।',
      showInTicker: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="font-headline text-3xl">Manage News</CardTitle>
            <CardDescription>Add, edit, and manage news articles and their visibility in the news ribbon.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddArticle}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Quick Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {templateNews.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingArticle({
                        id: '',
                        title: template.title,
                        content: template.content,
                        publicationDate: new Date().toISOString(),
                        author: 'Admin',
                        showInTicker: template.showInTicker,
                        imageUrl: null,
                      });
                      setShowAddForm(false);
                    }}
                    className="text-xs"
                  >
                    {template.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New News Article</CardTitle>
            <CardDescription>Create a new news article for the website.</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsForm onSuccess={handleFormSuccess} />
          </CardContent>
        </Card>
      )}

      {editingArticle && (
        <Card>
          <CardHeader>
            <CardTitle>Edit News Article</CardTitle>
            <CardDescription>Update the details of the selected news article.</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsForm 
              onSuccess={handleFormSuccess} 
              initialData={editingArticle}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>News Articles</CardTitle>
          <CardDescription>Manage existing news articles and their visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>In Ticker</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.sort((a, b) => new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()).map((article) => (
                  <TableRow key={article.id} className={processingId === article.id ? 'opacity-50' : ''}>
                    <TableCell>
                      {article.imageUrl ? (
                        <Image src={article.imageUrl} alt={article.title || ''} width={64} height={64} className="rounded-md object-cover" />
                      ) : (
                        <div className='w-16 h-16 bg-muted rounded-md flex items-center justify-center'>
                          <Newspaper className='h-8 w-8 text-muted-foreground' />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-sm truncate">{article.title}</TableCell>
                    <TableCell>
                      {article.showInTicker ?
                        <Badge variant='default'>Yes</Badge> :
                        <Badge variant='outline'>No</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditArticle(article)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={!!processingId}
                          >
                            {processingId === article.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the article "{article.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteArticle(article)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
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
          ) : (
            <div className="text-center py-12">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No News Articles Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add a new article to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
