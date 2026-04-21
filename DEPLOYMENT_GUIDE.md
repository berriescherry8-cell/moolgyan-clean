# Mool Gyan App - Deployment Guide

## 🚨 IMPORTANT: Do NOT Connect Git to Cloudflare Pages

**Your app is designed for STATIC EXPORT only** (`output: 'export'` in next.config.js). Connecting your Git repository to Cloudflare Pages will cause build failures because:

1. **Static Export Limitation**: Your app uses `output: 'export'` which generates pre-built HTML files
2. **No Server-Side Rendering**: Admin features need server-side functionality that static export doesn't support
3. **Environment Variables**: Build-time environment variables won't be available during Cloudflare's build process
4. **API Routes**: Your API routes (`/api/orders`, `/api/push`, etc.) won't work in static export

## ✅ Current Deployment Method (Recommended)

### Step 1: Build the App Locally
```bash
npm run build
```

This creates a `dist` folder with all static files.

### Step 2: Upload to Cloudflare Pages

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Choose **"Direct Upload"** (NOT Git connection)
3. Drag and drop the entire `dist` folder
4. Wait for deployment to complete

### Step 3: Configure Custom Domain (if needed)
1. In Cloudflare Pages → Your project → Custom domains
2. Add your domain
3. Update DNS records as instructed

## 🔧 What Was Fixed

### 1. Sidebar Names Issue ✅
- **Problem**: Sidebar text was hidden on mobile and some screens
- **Solution**: Removed `hidden sm:inline` classes from `SidebarNav.tsx`
- **Result**: All navigation item names now visible on all screen sizes

### 2. Live Satsang 404 Error ✅
- **Problem**: Cloudflare Pages couldn't find nested routes
- **Solution**: Added `public/_redirects` file with SPA fallback
- **Result**: All pages now load correctly

### 3. Admin Login Page Error ✅
- **Problem**: Login page tried to use Supabase client which failed in static export
- **Solution**: Removed Supabase dependency from login page
- **Result**: Login page now works with hardcoded authentication

### 4. Navigation Labels ✅
Updated sidebar to show these exact labels:
- Home
- Deeksha Aavedan
- Live Satsang
- Satsang
- Photos
- Bookstore
- News
- Satguru Bhajan
- Feedback
- Join
- FAQ
- Reference

## 📁 Files to Upload

Upload the **entire `dist` folder** to Cloudflare Pages. Key files include:
- `index.html` (main page)
- `_redirects` (routing configuration)
- `404.html` (error page)
- All page folders (`live-satsang/`, `login/`, `admin/`, etc.)
- `_next/` folder (JavaScript and CSS)
- All assets and icons

## 🔄 Updating Your App

Whenever you make changes:

1. **Make your code changes locally**
2. **Rebuild the app**:
   ```bash
   npm run build
   ```
3. **Upload the new `dist` folder** to Cloudflare Pages:
   - Go to your Cloudflare Pages project
   - Click "Create a deployment"
   - Upload the new `dist` folder contents
   - Wait for deployment to complete

## 🛡️ Security Notes

### Admin Login Credentials
Current admin emails (in `src/app/login/page.tsx`):
- sharmadevendra715@gmail.com
- kpdeora1986@gmail.com
- berriescherry8@gmail.com

Password: `admin123` (CHANGE THIS!)

**⚠️ IMPORTANT**: This is hardcoded authentication. For production security, consider:
1. Using environment variables for passwords
2. Implementing proper authentication with a backend
3. Using Supabase Auth (requires server-side rendering)

## 🐛 Known Limitations (Static Export)

1. **No Real-Time Data**: Admin actions (add/edit/delete) won't persist
2. **No Server APIs**: API routes won't work
3. **No Dynamic Content**: All pages are pre-built
4. **No Database**: Data changes require rebuilding

## 🚀 Future Improvements (If Needed)

If you need dynamic features, consider:

1. **Switch to Vercel/Netlify**: Better support for Next.js features
2. **Add a Backend**: Use Supabase with server-side rendering
3. **Use Next.js Server**: Deploy with `next start` instead of static export
4. **Hybrid Approach**: Static frontend + serverless functions

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Clear browser cache
4. Check Cloudflare Pages deployment logs

## 🎯 Quick Deployment Checklist

- [ ] Run `npm run build`
- [ ] Verify `dist` folder created
- [ ] Check `_redirects` file exists in dist
- [ ] Upload entire `dist` folder to Cloudflare Pages
- [ ] Test all pages load correctly
- [ ] Test admin login works
- [ ] Verify sidebar names visible
- [ ] Clear browser cache if needed

---

**Last Updated**: 2026-04-04
**App Version**: 5.0.0
**Build Status**: ✅ Successful