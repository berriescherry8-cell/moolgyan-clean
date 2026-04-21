import { getCurrentAdmin } from './auth';
import { createServerSupabaseClient } from './supabaseServer';

export async function checkAdminAccess() {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    return { allowed: false, error: 'Unauthorized access' };
  }
  
  return { allowed: true, admin };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    console.error('Supabase client not available');
    return;
  }
  
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return null;
  }
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }
  
  return session;
}

export const ADMIN_EMAILS = [
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com',
  'berriescherry8@gmail.com'
];

export function isValidAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}