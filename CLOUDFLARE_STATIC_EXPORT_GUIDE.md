# How to Deploy <25MB Static Folder to Cloudflare

## Problem
Manual upload fails on 0.pack files >25MB and TypeScript/server files.

## Solution 1: Git Deployment (Recommended - No size limit)
1. Push to GitHub.
2. Cloudflare Dashboard → Pages → Connect Git → Select repo.
3. Build: `npm run build`
4. Output: `dist`
5. Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Solution 2: Wrangler CLI (No size limit)
```
npx wrangler login
npx wrangler pages project create mool-gyan-app
npx wrangler pages deploy dist --project-name=mool-gyan-app
```

## Solution 3: Pure Static Export (~10MB folder)
Add `output: 'export'` to next.config.js (but fix dynamic params first).
 - Add generateStaticParams() to /order/[bookId].
 - Remove api/ routes or handle client-side.

Current dist ready for CLI/git deploy. Perfect PWA hosting with remote assets.

Folder has optimizations: minified JS, no maps, PWA ready.

