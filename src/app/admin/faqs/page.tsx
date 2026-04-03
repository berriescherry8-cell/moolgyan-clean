
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Trash2, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Hardcoded FAQ submissions
const HARDCODED_FAQS = [
  {
    id: '1',
    name: 'राम कुमार',
    email: 'ram@example.com',
    question: 'सतगुरु की कृपा कैसे प्राप्त करें?',
    answer: 'सतगुरु की कृपा प्राप्त करने के लिए नियमित सत्संग में भाग लें और भक्ति करें।',
    status: 'answered',
    submittedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'सीता देवी',
    email: 'sita@example.com',
    question: 'मूल ज्ञान क्या है?',
    answer: null,
    status: 'pending',
    submittedAt: '2024-01-20',
  }
];

type FaqSubmission = {
  id: string;
  name: string;
  email: string;
  question: string;
  answer: string | null;
  status: string;
  submittedAt: string;
};

const SubmissionsTable = ({ submissions, isProcessing, onDelete, formatDate }: { submissions: FaqSubmission[], isProcessing: string | null, onDelete: (id: string) => void, formatDate: (date: any) => string }) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">No FAQ Submissions Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no FAQ submissions yet.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell>{formatDate(sub.submittedAt)}</TableCell>
            <TableCell>{sub.name}</TableCell>
            <TableCell>{sub.email}</TableCell>
            <TableCell className="max-w-xs truncate">{sub.question}</TableCell>
            <TableCell>
              <Badge variant={sub.status === 'answered' ? 'default' : 'secondary'}>
                {sub.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!!isProcessing}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the FAQ submission from {sub.name}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(sub.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isProcessing === sub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function ManageFaqsPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FaqSubmission[]>(HARDCODED_FAQS);

  const formatDate = (date: any): string => {
    if (!date) return 'N/A';
    // Handle ISO strings or other date formats
    try {
      return new Date(date).toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(id);
    try {
      // Simulate delete operation
      setTimeout(() => {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        toast({
          title: 'FAQ Deleted',
          description: 'The FAQ submission has been successfully deleted.',
        });
        setIsProcessing(null);
      }, 500);
    } catch (e: any) {
      console.error("Error deleting FAQ: ", e);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: e.message || "Could not delete the FAQ.",
      });
      setIsProcessing(null);
    }
  };

  const handleDownloadPdf = (dataToDownload: FaqSubmission[], title: string) => {
    if (!dataToDownload || dataToDownload.length === 0) return;

    const printWindow = window.open('', '', 'height=800,width=1200');
    if (printWindow) {
      let tableHtml = `
        <style>
          body { font-family: sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { text-align: center; }
        </style>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
      `;

      dataToDownload.forEach(sub => {
        tableHtml += `
          <tr>
            <td>${formatDate(sub.submittedAt)}</td>
            <td>${sub.name}</td>
            <td>${sub.email}</td>
            <td>${sub.question}</td>
            <td>${sub.answer || 'Not answered yet'}</td>
            <td>${sub.status}</td>
          </tr>
        `;
      });

      tableHtml += '</tbody></table>';

      printWindow.document.write(tableHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const answeredFaqs = submissions?.filter(sub => sub.status === 'answered') || [];
  const pendingFaqs = submissions?.filter(sub => sub.status === 'pending') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Manage FAQs</CardTitle>
        <CardDescription>View and manage FAQ submissions from users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Answered FAQs ({answeredFaqs.length})</h3>
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleDownloadPdf(answeredFaqs, 'Answered FAQs')} disabled={answeredFaqs.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </Button>
            </div>
            <SubmissionsTable submissions={answeredFaqs} isProcessing={isProcessing} onDelete={handleDelete} formatDate={formatDate} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Pending FAQs ({pendingFaqs.length})</h3>
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleDownloadPdf(pendingFaqs, 'Pending FAQs')} disabled={pendingFaqs.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </Button>
            </div>
            <SubmissionsTable submissions={pendingFaqs} isProcessing={isProcessing} onDelete={handleDelete} formatDate={formatDate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

