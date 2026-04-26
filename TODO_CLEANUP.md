# TODO: Fix Cloudflare 404 + Remove Duplicate Files

## Phase 1: Fix Cloudflare 404 (Static Export)
- [ ] 1.1 Update `next.config.js` — uncomment `output: 'export'`, add `distDir: 'dist'`
- [ ] 1.2 Update `wrangler.toml` — fix for static export
- [ ] 1.3 Update GitHub workflow `deploy.yml` — use `wrangler pages deploy`
- [ ] 1.4 Fix `middleware.ts` — skip auth during static build phase
- [ ] 1.5 Test build locally with `npm run build`

## Phase 2: Remove Root-Level SQL & Doc Clutter
- [ ] 2.1 Delete root SQL scripts (move to `Docs/` or keep selected ones)
- [ ] 2.2 Delete outdated markdown guides
- [ ] 2.3 Keep only essential docs

## Phase 3: Consolidate Supabase Clients
- [ ] 3.1 Delete `lib/supabase.ts` (root)
- [ ] 3.2 Delete `src/lib/supabaseServer.ts`
- [ ] 3.3 Merge client.ts logic into `src/lib/supabase.ts`
- [ ] 3.4 Merge static-server.ts logic into `src/lib/supabase.ts`
- [ ] 3.5 Update all imports to use `@/lib/supabase` or `@/lib/supabase/server`

## Phase 4: Consolidate Auth Files
- [ ] 4.1 Delete `src/lib/auth.ts` — unused by most components
- [ ] 4.2 Keep `src/lib/adminAuthStore.ts` as primary client auth
- [ ] 4.3 Delete `src/lib/adminAuth.ts` — duplicate with adminAuthStore.ts logic

## Phase 5: Remove Duplicate/Broken Admin Components
- [ ] 5.1 Delete `src/components/AdminLayout.tsx` (broken imports)
- [ ] 5.2 Delete `src/components/AdminGuard.tsx` (old client version)
- [ ] 5.3 Delete `src/components/AdminGuard-old.tsx`
- [ ] 5.4 Delete `src/components/AdminDashboard-old.tsx`
- [ ] 5.5 Keep `src/components/admin/AdminLayout.tsx` and `src/components/admin/AdminGuard.tsx`

## Phase 6: Remove Backup/Temp Files
- [ ] 6.1 Delete `src/app/photos/FIXED_page.tsx`
- [ ] 6.2 Delete `src/app/admin/login/page-old.tsx`
- [ ] 6.3 Delete `twa-manifest.json` (root)

## Phase 7: Clean Build Output Dirs
- [ ] 7.1 Delete `cf-ready-dist/` (entire dir, old build output)
- [ ] 7.2 Ensure `.gitignore` covers dist, build, and cf-ready-dist

## Phase 8: Final Verification
- [ ] 8.1 Run `npm run build` locally
- [ ] 8.2 Verify `dist/index.html` exists
- [ ] 8.3 Run `npm run preview` and check no 404
- [ ] 8.4 Push to GitHub and verify Cloudflare deployment

