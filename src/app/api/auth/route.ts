import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', request.url));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;
    const password = body.password;

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({
        error: 'Server configuration error. Supabase client not initialized.',
      }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // CHECK PROFILE ROLE for logged user
    let profile = null;
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      profile = profileData;
    } catch (profileError) {
      console.warn('Could not fetch profile for user', data.user.id);
    }

    return NextResponse.json({
      success: true,
      user: {
        email: data.user.email,
        id: data.user.id,
        profileRole: profile?.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Login failed. Please try again.',
      message: error.message,
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}

