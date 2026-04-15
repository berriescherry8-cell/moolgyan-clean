import { createSupabaseServerClient } from './supabase/server'
import type { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient()
  
  if (!supabase) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentAdmin() {
  const supabase = createSupabaseServerClient()
  
  if (!supabase) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role || profile.role !== 'admin') {
    return null
  }

  return { ...user, role: 'admin' }
}

export async function isAdmin() {
  const admin = await getCurrentAdmin()
  return !!admin
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return admin
}

