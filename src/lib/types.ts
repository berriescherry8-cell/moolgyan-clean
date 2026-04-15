export interface ReferenceItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string;
  uploadDate: string;
  created_at?: string;
  updated_at?: string;
}

export interface FaqQuestion {
  id: string;
  name: string;
  email: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'deleted';
  submittedAt: string;
  answered_at?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  showInTicker: boolean;
  createdAt: string;
  updatedAt?: string;
}
