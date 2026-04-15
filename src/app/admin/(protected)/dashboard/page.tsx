import { requireAdmin } from '@/lib/adminAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import {
  LayoutDashboard,
  Newspaper,
  Video,
  Camera,
  BookOpen,
  UserPlus,
  HelpCircle,
  ShoppingCart,
  Music,
  MessageSquareQuote,
  FileText,
  Sparkles,
  ExternalLink,
  LogOut,
  Bell,
  Users,
  Settings,
  Database,
  Library,
  BarChart3,
  Activity,
  UsersRound
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function Page() {
  const dashboardCards = [
    { href: "/admin/books", label: "Manage Bookstore", icon: BookOpen, color: "from-orange-500 to-amber-500", description: "Add/edit books, franchise items, stock & sale status" },
    { href: "/admin/live-satsang", label: "Manage Live Satsang", icon: Video, color: "from-red-500 to-orange-500", description: "YouTube URLs, titles, live toggle" },
    { href: "/admin/satsang-playlist", label: "Manage Satsang", icon: Music, color: "from-indigo-500 to-purple-500", description: "YouTube videos for satsang section" },
    { href: "/admin/wisdom-quotes", label: "Wisdom Quotes", icon: FileText, color: "from-amber-500 to-orange-500", description: "Daily quotes + pre-filled wisdom" },
    { href: "/admin/news", label: "Manage News", icon: Newspaper, color: "from-blue-500 to-cyan-500", description: "News posts + ribbon ticker" },
    { href: "/admin/google-forms", label: "Google Forms", icon: ExternalLink, color: "from-blue-500 to-indigo-500", description: "Edit form URLs for orders/FAQ/etc" },
    { href: "/admin/worksheets", label: "Admin Worksheets", icon: FileText, color: "from-cyan-500 to-blue-500", description: "Order/deeksha/join/feedback sheets" },
    { href: "/admin/photos", label: "Manage Photos", icon: Camera, color: "from-purple-500 to-violet-500", description: "Upload/sync photo gallery" },
  ];

  const admin = await requireAdmin()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Welcome back, {admin.email}</p>
          </div>
          <form action="/admin/logout/action">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Management Pages</p>
                <p className="text-3xl font-bold text-white mt-1">{dashboardCards.length}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-3xl font-bold text-green-400 mt-1">Active</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Admin Access</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">Verified</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <UsersRound className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Security Level</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">High</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Access - Management Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      {card.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-sm py-4">
          <p>Admin Dashboard • Secure Management System • All rights reserved</p>
        </div>
      </div>
    </AdminLayout>
  )
}