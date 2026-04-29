# Fix Satguru Bhajan Videos Not Showing

## Root Cause
`NEXT_PUBLIC_SUPABASE_URL` in `.env.local` contains `/rest/v1`, causing duplicate `/rest/v1` in API calls (`/rest/v1/rest/v1/satguru_bhajan`).

## Steps
- [x] Analyze codebase and identify root cause
- [x] Fix `src/lib/supabase-config.ts` — normalize URL to strip `/rest/v1` and trailing slashes
- [x] Fix `src/components/Header.tsx` — add `style={{ width: 'auto', height: 'auto' }}` to Image to suppress Next.js warning
- [ ] Instruct user to update `.env.local` and restart dev server

