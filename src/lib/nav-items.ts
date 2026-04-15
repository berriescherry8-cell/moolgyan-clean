import type { LucideIcon } from "lucide-react";
import { Home, Newspaper, Video, Camera, BookOpen, UserPlus, HelpCircle, LayoutDashboard, FileText, Wifi, Music, ExternalLink, MessageSquare, ShieldAlert, LogIn, Package } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isAdmin?: boolean;
  isHidden?: boolean; 
}

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

