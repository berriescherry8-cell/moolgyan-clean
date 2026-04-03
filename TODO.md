# Cloudflare Static Deploy Fix - Progress Tracker

## Plan Steps (Next.js 14.2.35 → Static Export on Cloudflare Pages)

### 1. [x] Config Updates
   - Update next.config.js for Cloudflare static + next-pwa ✅
   - Add preview script to package.json ✅
   - Add public/_headers for caching ✅

### 2. [x] Suppress Warnings
   - Add .env.example with VAPID keys ✅
   - Set NEXT_PUBLIC_VAPID_PUBLIC_KEY='' in .env.local if needed

### 3. [ ] Local Test
   - `npm run build`
   - `npm run preview`
   - Verify static site at http://localhost:3000 (npx serve dist)

### 4. [ ] Cloudflare Pages Settings (Manual via Dashboard)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: **None** (important: disable Next.js detection)
   - Root directory: `/` (repo root)

### 5. [ ] Deploy & Verify
   - Commit/push changes
   - Trigger redeploy on Cloudflare Pages
   - Check live site + PWA works

### 6. [ ] Fallback if Fails
   - Upgrade Next.js to latest stable (^15.x)
   - Or add `--dangerouslyUseUnsupportedNextVersion` to deploy command (hacky)

**Status: Configs updated. Run local test with `npm run build && npm run preview` then update Cloudflare settings and redeploy.**

k# Cloudflare Static Deploy Fix - Progress Tracker

## Plan Steps (Next.js 14.2.35 → Static Export on Cloudflare Pages)

### 1. [ ] Config Updates
   - Update next.config.js for Cloudflare static + next-pwa
   - Add preview script to package.json
   - Add static.json for headers/routing

### 2. [ ] Suppress Warnings
   - Add VAPID keys to .env.local (dummy if no web push)

### 3. [ ] Local Test
   - `npm run build`
   - `npm run preview`
   - Verify static site at http://localhost:3000

### 4. [ ] Cloudflare Pages Settings (Manual)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: None (disable Next.js auto-adapter)
   - Root directory: `/` (repo root)

### 5. [ ] Deploy & Verify
   - Commit/push changes
   - Trigger redeploy on Cloudflare
   - Check live site

### 6. [ ] Fallback if Fails
   - Upgrade Next.js to ^15.5.0
   - Use OpenNext with flag

**Current Status: Starting config updates...**

