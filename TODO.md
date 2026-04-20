# Cloudflare Static Deploy Fix - TODO

## Status: [ ] 0/5 Complete

**Step 1: ✅ Edit API routes to add static export config**
- src/app/api/orders/route.ts
- src/app/api/sync-youtube/route.ts  
- src/app/api/check-video-exists/route.ts

**Step 2: [ ] Fix wrangler.toml config**

**Step 3: ✅ Test local build: `npm run build` (no errors)**

**Step 4: [ ] Test local preview: `npx serve dist`**

**Step 5: [ ] Push to GitHub → Cloudflare redeploy → Test live site**

**Next APIs:** Migrate dynamic APIs (orders/auth/youtube) to Supabase Edge Functions (post-fix).

