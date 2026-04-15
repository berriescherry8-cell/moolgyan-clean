# Cloudflare Pages Deployment Guide

## 🚀 Quick Deploy Steps

1. **Connect GitHub Repo**
   ```
   Cloudflare Dashboard → Pages → Connect to Git → Select repo
   ```

2. **Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: `npm run build`
   Build Output Directory: `dist`
   Root Directory: `/` (default)
   ```

3. **Environment Variables** (Required!)
   Add these in Cloudflare Pages dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lqymwrhfirszrakuevqm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA
   ```

4. **Custom Domain** (Optional)
   ```
   Pages → Custom Domains → Add domain
   ```

## ✅ Fixed Issues
- **Supabase prerender errors**: Added null checks for static builds
- **PWA service worker**: Auto-configured via next-pwa
- **Static export ready**: `npm run build` succeeds without env vars locally

## 🧪 Local Testing
```bash
# Build & preview static site
npm run build
npm run preview

# Deploy command (if using Wrangler CLI)
npx wrangler pages deploy dist --project-name=mool-gyan-app
```

## 📱 PWA Features
- Installable app (manifest.json + service worker)
- Offline support
- Push notifications ready

**Deployment successful when `npm run build` completes without Supabase errors!**

