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
  tags?: string[];
  isFeatured?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  price: number;
  category: string;
  language: string;
  publicationDate?: string;
  isbn?: string;
  pages?: number;
  storagePath?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  rating?: number;
  tags?: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  newsletter: boolean;
}

export interface LiveSatsang {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration?: number;
  streamUrl?: string;
  isLive: boolean;
  hasEnded: boolean;
  viewerCount?: number;
  thumbnailUrl?: string;
  storagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WisdomQuote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  category?: string;
  isFeatured?: boolean;
  displayDate?: string;
  createdAt: string;
}

export interface DailyWisdom {
  quote: WisdomQuote;
  date: string;
  isDisplayed: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  type: 'general' | 'bug' | 'feature' | 'content';
  subject: string;
  message: string;
  rating?: number;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
  lastChecked: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalBooks: number;
  totalPhotos: number;
  totalVideos: number;
  totalNews: number;
  recentActivity: AdminActivityLog[];
  systemHealth: SystemHealth;
}
