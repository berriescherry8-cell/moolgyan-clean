<<<<<<< HEAD

import type { LucideIcon } from "lucide-react";
import { Home, Newspaper, Video, Camera, BookOpen, UserPlus, HelpCircle, ShoppingCart, LayoutDashboard, FileText, BookCopy, Library, LogIn, MessageSquareQuote, Shield, Wifi, Music, BellRing, HandHeart, Quote, Sparkles, ExternalLink } from "lucide-react";
import type { Translation } from './i18n/locales';
=======
import type { LucideIcon } from "lucide-react";
import { Home, Newspaper, Video, Camera, BookOpen, UserPlus, HelpCircle, LayoutDashboard, FileText, Wifi, Music, ExternalLink, MessageSquare, ShieldAlert, LogIn, Package } from "lucide-react";
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isAdmin?: boolean;
  isHidden?: boolean; 
}

<<<<<<< HEAD
export const getNavItems = (t: Translation): NavItem[] => [
  { href: "/", label: "Home", icon: Home },
  { href: "/deeksha-aavedan", label: t.nav_deeksha_aavedan, icon: HandHeart },
  { href: "/live-satsang", label: t.nav_live_satsang, icon: Wifi },
  { href: "/satsang", label: t.nav_satsang, icon: Video },
  { href: "/photos", label: t.nav_photos, icon: Camera },
  { href: "/books", label: t.nav_bookstore, icon: BookOpen },
  { href: "/news", label: t.nav_news, icon: Newspaper },
  { href: "/join", label: t.nav_join, icon: UserPlus },
  { href: "/satguru-bhajan", label: t.nav_satguru_bhajan, icon: Music },
  { href: "/reference", label: t.nav_reference, icon: Library },
  { href: "/faq", label: t.nav_faq, icon: HelpCircle },
  { href: "/feedback", label: t.nav_feedback, icon: MessageSquareQuote },
  { href: "/privacy-policy", label: "Privacy Policy", icon: Shield, isHidden: true },
  { href: "/login", label: "Admin Login", icon: LogIn, isHidden: true },
  { href: "/admin", label: t.admin_dashboard, icon: LayoutDashboard, isAdmin: true },
  { href: "/admin/orders", label: t.admin_manage_orders, icon: ShoppingCart, isAdmin: true },
  { href: "/admin/notifications", label: t.admin_manage_notifications, icon: BellRing, isAdmin: true },
  { href: "/admin/deeksha", label: t.admin_manage_deeksha, icon: HandHeart, isAdmin: true },
  { href: "/admin/news", label: t.admin_manage_news, icon: Newspaper, isAdmin: true },
  { href: "/admin/books", label: t.admin_manage_books, icon: BookOpen, isAdmin: true },
  { href: "/admin/satguru-bhajan", label: t.admin_manage_bhajans, icon: Music, isAdmin: true },
  { href: "/admin/faqs", label: t.admin_manage_faqs, icon: HelpCircle, isAdmin: true },
  { href: "/admin/feedback", label: t.admin_manage_feedback, icon: MessageSquareQuote, isAdmin: true },
  { href: "/admin/members", label: t.admin_manage_members, icon: UserPlus, isAdmin: true },
  { href: "/admin/photos", label: t.admin_manage_photos, icon: Camera, isAdmin: true },
  { href: "/admin/live-satsang", label: "Live Satsang Management", icon: Video, isAdmin: true },
  { href: "/admin/saar-sangrah", label: t.admin_manage_saar_sangrah, icon: BookCopy, isAdmin: true },
  { href: "/admin/reference", label: t.admin_manage_reference, icon: FileText, isAdmin: true },
  { href: "/admin/tools/storage-browser", label: t.admin_storage_browser, icon: Sparkles, isAdmin: true },
  { href: "/admin/google-forms", label: t.admin_google_forms, icon: ExternalLink, isAdmin: true },
  { href: "/admin/worksheet", label: t.google_form_worksheet, icon: ExternalLink, isAdmin: true },
  { href: "/test-data", label: "Test Data", icon: Sparkles, isAdmin: true },
];
=======
export const getNavItems = (t: any): NavItem[] => [
  { href: "/", label: "Home", icon: Home },
  { href: "/deeksha-aavedan", label: "Deeksha Aavedan", icon: UserPlus },
  { href: "/live-satsang", label: "Live Satsang", icon: Wifi },
  { href: "/satsang", label: "Satsang", icon: Video },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/books", label: "Bookstore", icon: BookOpen },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/satguru-bhajan", label: "Satguru Bhajan", icon: Music },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/join", label: "Join", icon: UserPlus },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/reference", label: "Reference", icon: FileText },
  { href: "/privacy-policy", label: "Privacy Policy", icon: ShieldAlert, isHidden: true },
  { href: "/admin/login", label: "Admin Login", icon: LogIn, isHidden: true },
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, isAdmin: true },
  { href: "/admin/books", label: "Books", icon: BookOpen, isAdmin: true },
  { href: "/admin/satguru-bhajan", label: "Satguru Bhajan", icon: Music, isAdmin: true },
  { href: "/admin/news", label: "News", icon: Newspaper, isAdmin: true },
  { href: "/admin/photos", label: "Photos", icon: Camera, isAdmin: true },
  { href: "/admin/live-satsang", label: "Live Satsang", icon: Video, isAdmin: true },
  { href: "/admin/google-forms", label: "Google Forms", icon: ExternalLink, isAdmin: true },
  { href: "/admin/satsang-playlist", label: "Satsang Playlist", icon: Music, isAdmin: true },
  { href: "/admin/worksheets", label: "Worksheets", icon: FileText, isAdmin: true },
  { href: "/admin/wisdom-quotes", label: "Wisdom Quotes", icon: MessageSquare, isAdmin: true },
  { href: "/admin/orders", label: "Orders", icon: Package, isAdmin: true },
];

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
