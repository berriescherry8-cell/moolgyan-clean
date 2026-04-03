export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate?: string;
  imageUrl: string;
  storagePath?: string;
  showInTicker?: boolean; 
}

export interface AppSettings {
    fontSize?: number;
    dailyWisdom?: DailyWisdom;
}

export interface SatsangVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadDate: string;
  storagePath?: string;
  thumbnailUrl?: string;
  videoId?: string;
  isFeatured?: boolean;
  isLive?: boolean;
}

export interface SatguruBhajan {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadDate: string;
  storagePath?: string;
  thumbnailUrl?: string;
  videoId?: string;
  lyrics?: string;
}


export interface SpiritualPhoto {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  uploadDate: string;
  folder?: string;
  storagePath?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  coverUrl: string;          // GitHub raw link (permanent)
  pdfUrl?: string;           // optional
  category?: string;
  stockStatus: 'in-stock' | 'out-of-stock' | 'read-only';
  sequence: number;
  altText?: string;
}

export interface Order {
  id: string;
  orderDate: string;
  status: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  bookTitle: string;
  quantity: number;
}

export interface FaqSubmission {
    id: string;
    name: string;
    email: string;
    question: string;
    submittedAt: string;
}

export interface DeekshaSubmission {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  pincode: string;
  deekshaType: 'pratham' | 'dvitiya';
  submittedAt: string;
}

export interface Feedback {
    id: string;
    name: string;
    email: string;
    message: string;
    submittedAt: string;
}

export interface KGFMember {
    id: string;
    name: string;
    fathersName: string;
    mobile: string;
    email: string;
    joinedAt: string;
}

export interface SaarSangrahPhoto {
  id: string;
  imageUrl: string;
  uploadDate: string;
  storagePath: string;
}

export interface ReferenceDocument {
  id: string;
  title: string;
  fileUrl: string;
  uploadDate: string;
  storagePath: string;
}

export interface ReferenceItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string;
  uploadDate: string;
  storagePath?: string;
}

export interface FcmToken {
    id: string;
    subscribedAt: string;
}

export interface DailyWisdom {
  id: string;
  textEn: string;
  textHi: string;
  authorEn?: string;
  authorHi?: string;
  updatedAt: string;
}

// Supabase-specific types
export interface SupabaseNewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  publication_date?: string;
  image_url: string;
  storage_path?: string;
  show_in_ticker?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseBook {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  cover_url: string;
  pdf_url?: string;
  category?: string;
  stock_status: 'in-stock' | 'out-of-stock' | 'read-only';
  alt_text?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrder {
  id: string;
  order_date: string;
  status: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  book_title: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFeedback {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SupabaseKGFMember {
  id: string;
  name: string;
  fathers_name: string;
  mobile: string;
  email: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseDailyWisdom {
  id: string;
  text_en: string;
  text_hi: string;
  author_en?: string;
  author_hi?: string;
  updated_at: string;
}
