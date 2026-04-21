# Supabase Admin Authentication System - Complete Setup

## Overview

This document describes the complete Supabase admin authentication system that has been implemented for the Mool Gyan application.

## Environment Configuration

The following environment variables are configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://lqymwrhfirszrakuevqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Admin Users

The following admin accounts are configured:

| Email | Password |
|-------|----------|
| sharmadevendra715@gmail.com | Ernashdev@7886 |
| kpdeora1986@gmail.com | Ernashkapil@1245 |
| berriescherry8@gmail.com | Sunita@kapil7886 |

## File Structure

### Core Authentication Files

1. **`src/lib/supabase.ts`** - Browser-side Supabase client
2. **`src/lib/supabaseServer.ts`** - Server-side Supabase client
3. **`src/lib/adminAuthStore.ts`** - Zustand store for admin authentication state
4. **`src/lib/auth.ts`** - Server-side authentication utilities
5. **`src/lib/admin.ts`** - Admin-specific utilities

### Admin Pages

1. **`src/app/admin/login/page.tsx`** - Admin login page with Supabase authentication
2. **`src/app/admin/page.tsx`** - Admin dashboard (client-side rendered)
3. **`src/app/admin/layout.tsx`** - Admin layout with navigation and user menu

### API Routes

1. **`src/app/api/auth/route.ts`** - Authentication API endpoints (GET, POST, DELETE)

### Middleware

1. **`middleware.ts`** - Route protection for all `/admin/*` routes

## Authentication Flow

### Login Flow

1. User visits `/admin/login`
2. Enters email and password
3. System validates email is in admin list
4. Supabase authenticates credentials
5. On success, user is redirected to `/admin`
6. On failure, error message is displayed

### Route Protection

1. Middleware checks all `/admin/*` routes
2. Verifies user has valid Supabase session
3. Checks if user email is in admin list
4. Redirects to `/admin/login` if not authenticated

### Session Management

- Supabase handles session cookies automatically
- Zustand store maintains client-side auth state
- Session persists across page refreshes
- Sign out clears session and redirects to login

## Key Features

### Security

- ✅ Supabase authentication with secure session management
- ✅ Email-based admin verification
- ✅ Middleware-based route protection
- ✅ Server-side and client-side validation
- ✅ Automatic session refresh

### User Experience

- ✅ Beautiful login UI with gradient design
- ✅ Password visibility toggle
- ✅ Loading states and error handling
- ✅ Admin dashboard with user info
- ✅ Quick logout functionality

### Static Export Compatibility

- ✅ Works with Next.js static export (`output: 'export'`)
- ✅ Client-side authentication for admin pages
- ✅ No server-side rendering required for admin dashboard

## Usage

### Starting the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Accessing Admin Panel

1. Navigate to `http://localhost:9002/admin/login`
2. Enter one of the admin credentials
3. Access the admin dashboard at `/admin`

## Troubleshooting

### "Supabase client called server-side" Warning

This warning appears during static export when the server-side Supabase client is initialized. It's expected behavior and doesn't affect functionality.

### "VAPID keys are not configured" Warning

This warning relates to push notifications and is unrelated to authentication. Add VAPID keys to `.env.local` if push notifications are needed.

### Authentication Not Working

1. Verify `.env.local` has correct Supabase credentials
2. Ensure admin users exist in Supabase with correct passwords
3. Check browser console for any errors
4. Clear browser cache and cookies

## Migration Notes

The previous localStorage-based authentication has been replaced with proper Supabase authentication. The new system provides:

- Secure session management via Supabase
- Automatic token refresh
- Better security practices
- Production-ready authentication

## Support

For issues or questions, please refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs