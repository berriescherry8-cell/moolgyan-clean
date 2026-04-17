import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const ADMIN_EMAILS = [
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com',
  'berriescherry8@gmail.com'
];

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    if (!supabase) {
      // URL to redirect to after sign in process completes
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/admin/dashboard', request.url));
}

export async function POST(request: NextRequest) {
  try {
    // Log environment variables for debugging (without exposing sensitive data)
    console.log('Environment check - NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Environment check - NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Environment check - NEXT_PUBLIC_SUPABASE_URL length:', process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0);
    console.log('Environment check - NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0);

    const requestUrl = new URL(request.url);
    const body = await request.json();
    const email = body.email;
    const password = body.password;
    console.log('API auth login attempt:', email);
    
    const supabase = await createSupabaseServerClient();
    
    if (!supabase) {
      console.error('Supabase client unavailable - server config issue');
      return NextResponse.json({ 
        error: 'Server configuration error. Supabase client not initialized.', 
        details: 'Environment variables may not be properly configured.' 
      }, { status: 500 });
    }

    // Non-blocking admin email check with logging
    const isAdminEmail = ADMIN_EMAILS.includes(email);
    console.log('Email check for', email, '- is admin email:', isAdminEmail, 'in ADMIN_EMAILS?', ADMIN_EMAILS.includes(email));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Supabase auth error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.log('Auth success, user:', data.user.id, data.user.email);

    // Non-blocking email verification with logging
    const isAdminUser = ADMIN_EMAILS.includes(data.user.email || '');
    console.log('User email verification for', data.user.email, '- is admin:', isAdminUser);

    // CHECK PROFILE ROLE for logged user (with error handling)
    let profile = null;
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      profile = profileData;
      console.log('Profile for logged user', data.user.id, ':', profile?.role);
    } catch (profileError) {
      console.warn('Could not fetch profile for user', data.user.id, ':', profileError);
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        email: data.user.email, 
        id: data.user.id, 
        profileRole: profile?.role,
        isAdminEmail: isAdminEmail,
        isAdminUser: isAdminUser
      } 
    });
  } catch (error: any) {
    console.error('Auth API POST error:', error);
    console.error('Error stack:', error.stack);
    
    // Return proper JSON error instead of letting Next.js return HTML
    return NextResponse.json({ 
      error: 'Login failed. Check server logs for details.',
      type: error.constructor.name,
      message: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error. Contact admin.' }, { status: 500 });
  }
  
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}

