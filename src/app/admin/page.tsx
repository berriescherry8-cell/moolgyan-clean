import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AdminPage() {
  // Skip auth during static build/export
  if (typeof window === 'undefined' && process.env.NEXT_PHASE?.includes('build')) {
    return <div>Admin panel requires authentication (static preview)</div>
  }

  const supabase = await createSupabaseServerClient()
  
  if (!supabase) {
    redirect('/admin/login')
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/admin/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role || profile.role !== 'admin') redirect('/')

  redirect('/admin/dashboard')
}
