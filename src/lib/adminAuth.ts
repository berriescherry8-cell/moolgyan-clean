import { createSupabaseServerClient as createServerClient } from './supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type User } from '@supabase/supabase-js'

export interface AdminUser extends User {
  role: 'admin'
}

export async function getAdminUser(): Promise<AdminUser | null> {
  // Skip auth during static build/export to avoid cookies() call
  if (typeof window === 'undefined' && process.env.NEXT_PHASE?.includes('build')) {
    return null
  }
  
  const supabase = await createServerClient()
  
  if (!supabase) {
    return null
  }
  
  // Get session user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get profile role from DB
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Admin auth profile error:', profileError);
    return null;
  }

  if (!profile?.role || profile.role !== 'admin') {
    console.error('Admin auth failed: user', user.id, 'role:', profile?.role);
    return null
  }

  return { ...user, role: 'admin' } as AdminUser
}

export async function requireAdmin() {
  const admin = await getAdminUser()
  if (!admin) {
    redirect('/admin/login?error=unauthorized')
  }
  return admin
}

export async function isAdminUser(): Promise<boolean> {
  const admin = await getAdminUser()
  return !!admin
}
