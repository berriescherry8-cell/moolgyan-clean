import type { LucideIcon } from "lucide-react";
import { Home, Newspaper, Video, Camera, BookOpen, UserPlus, HelpCircle, ShoppingCart, LayoutDashboard, FileText, BookCopy, Library, LogIn, MessageSquareQuote, Shield, Wifi, Music, BellRing, HandHeart, Quote, Sparkles, ExternalLink } from "lucide-react";
import type { Translation } from './i18n/locales';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isAdmin?: boolean;
  isHidden?: boolean; 
}

export const getNavItems = (t: Translation): NavItem[] => [
  { href: "/", label: "Home", icon: Home },
  { href: "/deeksha-aavedan", label: t.nav_deeksha_aavedan || 'Deeksha Aavedan', icon: HandHeart },
  { href: "/live-satsang", label: t.nav_live_satsang || 'Live Satsang', icon: Wifi },
  { href: "/satsang", label: t.nav_satsang || 'Satsang', icon: Video },
  { href: "/photos", label: t.nav_photos || 'Photos', icon: Camera },
  { href: "/books", label: t.nav_bookstore || 'Bookstore', icon: BookOpen },
  { href: "/news", label: t.nav_news || 'News', icon: Newspaper },
  { href: "/join", label: t.nav_join || 'Join', icon: UserPlus },
  { href: "/satguru-bhajan", label: t.nav_satguru_bhajan || 'Satguru Bhajan', icon: Music },
  { href: "/reference", label: t.nav_reference || 'Reference', icon: Library },
  { href: "/faq", label: t.nav_faq || 'FAQ', icon: HelpCircle },
  { href: "/feedback", label: t.nav_feedback || 'Feedback', icon: MessageSquareQuote },
  { href: "/privacy-policy", label: "Privacy Policy", icon: Shield, isHidden: true },
  { href: "/login", label: "Admin Login", icon: LogIn, isHidden: true },
  { href: "/admin", label: t.admin_dashboard || 'Dashboard', icon: LayoutDashboard, isAdmin: true },
  { href: "/admin/orders", label: t.admin_manage_orders || 'Orders', icon: ShoppingCart, isAdmin: true },
  { href: "/admin/notifications", label: t.admin_manage_notifications || 'Notifications', icon: BellRing, isAdmin: true },
  { href: "/admin/deeksha", label: t.admin_manage_deeksha || 'Deeksha', icon: HandHeart, isAdmin: true },
  { href: "/admin/news", label: t.admin_manage_news || 'News', icon: Newspaper, isAdmin: true },
  { href: "/admin/books", label: t.admin_manage_books || 'Books', icon: BookOpen, isAdmin: true },
  { href: "/admin/satguru-bhajan", label: t.admin_manage_bhajans || 'Bhajans', icon: Music, isAdmin: true },
  { href: "/admin/faqs", label: t.admin_manage_faqs || 'FAQs', icon: HelpCircle, isAdmin: true },
  { href: "/admin/feedback", label: t.admin_manage_feedback || 'Feedback', icon: MessageSquareQuote, isAdmin: true },
  { href: "/admin/members", label: t.admin_manage_members || 'Members', icon: UserPlus, isAdmin: true },
  { href: "/admin/photos", label: t.admin_manage_photos || 'Photos', icon: Camera, isAdmin: true },
  { href: "/admin/live-satsang", label: "Live Satsang Management", icon: Video, isAdmin: true },
  { href: "/admin/saar-sangrah", label: t.admin_manage_saar_sangrah || 'Saar Sangrah', icon: BookCopy, isAdmin: true },
  { href: "/admin/reference", label: t.admin_manage_reference || 'Reference', icon: FileText, isAdmin: true },
  { href: "/admin/tools/storage-browser", label: t.admin_storage_browser || 'Storage Browser', icon: Sparkles, isAdmin: true },
  { href: "/admin/google-forms", label: t.admin_google_forms || 'Google Forms', icon: ExternalLink, isAdmin: true },
  { href: "/admin/worksheet", label: t.google_form_worksheet || 'Worksheet', icon: ExternalLink, isAdmin: true },
  { href: "/test-data", label: "Test Data", icon: Sparkles, isAdmin: true },
];

