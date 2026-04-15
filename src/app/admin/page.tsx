import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createSupabaseServerClient()
  
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
