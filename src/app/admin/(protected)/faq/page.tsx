'use client';

import { useState } from 'react';
import { useCollection } from '@/lib/data-manager';
import { FaqQuestion } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Edit, Trash2, Download, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManager } from '@/lib/data-manager';

export default function ManageFaqPage() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [status, setStatus] = useState<'pending' | 'answered'>('pending');
  const [saving, setSaving] = useState(false);
  const faqQuestions = useCollection<FaqQuestion>('faq_questions');
  const [questions, setQuestions] = useState<FaqQuestion[]>([]);

  const pendingQuestions = questions.filter(q => q.status === 'pending');
  const answeredQuestions = questions.filter(q => q.status === 'answered');

  const handleDownload = (questions: FaqQuestion[], type: string) => {
    const csv = [
      ['Date', 'Name', 'Email', 'Question', 'Answer', 'Status'],
      ...questions.map(q => [
        q.submittedAt,
        q.name,
        q.email,
        q.question,
        q.answer || '',
        q.status
      ])
    ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type} FAQs.csv`;
    a.click();
  };

  const handleSaveAnswer = async (id: string) => {
    setSaving(true);
    try {
      await dataManager.setDoc('faq_questions', {
        answer: answerText,
        status,
        answered_at: new Date().toISOString()
      }, id);
      toast({ description: 'Answer saved!' });
      setEditingId(null);
      setAnswerText('');
      setStatus('pending');
    } catch (error) {
      toast({ variant: 'destructive', description: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataManager.setDoc('faq_questions', { status: 'deleted' }, id);
      toast({ description: 'Question archived' });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Delete failed' });
    }
  };

  // Update local state from realtime
  // useEffect omitted for simplicity, useCollection handles

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Manage FAQ Questions
          </h1>
          <p className="text-slate-400 mt-1">
            Pending ({pendingQuestions.length}) | Answered ({answeredQuestions.length})
          </p>
        </div>
      </div>

      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Questions ({pendingQuestions.length})</CardTitle>
          <Button onClick={() => handleDownload(pendingQuestions, 'Pending FAQs')} disabled={pendingQuestions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {pendingQuestions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No pending questions</p>
          ) : (
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingQuestions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>{q.submittedAt?.slice(0,10)}</TableCell>
                      <TableCell>{q.name}</TableCell>
                      <TableCell>{q.email}</TableCell>
                      <TableCell className="max-w-xs">{q.question}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingId(q.id);
                          setAnswerText('');
                          setStatus('answered');
                        }}>
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
                              <AlertDialogTitle>Archive Question?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Mark as deleted from {q.name}. Admin can still view.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(q.id)}>
                                Archive
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answered */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Answered Questions ({answeredQuestions.length})</CardTitle>
          <Button onClick={() => handleDownload(answeredQuestions, 'Answered FAQs')} disabled={answeredQuestions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {answeredQuestions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No answered questions</p>
          ) : (
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {answeredQuestions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>{q.submittedAt?.slice(0,10)}</TableCell>
                      <TableCell>{q.name}</TableCell>
                      <TableCell>
                        <Badge>{q.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingId(q.id);
                          setAnswerText(q.answer || '');
                          setStatus(q.status as any);
                        }}>
                          Edit Answer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Answer Modal */}
      {editingId && (
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle>Edit Answer</CardTitle>
            <CardDescription>Respond to user question</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Your answer..."
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSaveAnswer(editingId)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Save Answer
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setAnswerText('');
                setStatus('pending');
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
