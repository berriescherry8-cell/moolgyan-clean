
import { requireAdmin } from '@/lib/adminAuth'
import AdminGuard from './AdminGuard'
import AdminSidebar from './AdminSidebar'

export const dynamic = 'force-dynamic'

interface AdminUser {
  email: string
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin() as AdminUser
  
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-400">Welcome back, {admin.email}</p>
                </div>
                <div className="text-sm text-slate-400">
                  Protected • Secure
                </div>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

