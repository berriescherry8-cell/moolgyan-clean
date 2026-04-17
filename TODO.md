# Cloudflare Build Fix - TODO Steps

## Completed:
1. Update wrangler.toml with comprehensive assets.exclude patterns (cache/server files)
2. Add postbuild cleanup script to package.json and update deploy:static

## Pending:

3. Optimize next.config.js (swcMinify, explicit output: 'export') ✓
4. 🔄 Test `npm run build` - confirm dist/cache/webpack/server-production/0.pack exists and size >25MiB
5. Test `npm run postbuild` - verify cache removed
6. Test full `npm run deploy:static` locally - should succeed
7. git add/commit/push changes
8. Monitor Cloudflare Pages build success
3. ✅ Optimize next.config.js (swcMinify, explicit output: 'export')
4. 🔄 Test `npm run build` - confirm dist/cache/webpack/server-production/0.pack exists and size >25MiB
5. Test `npm run postbuild` - verify cache removed
6. Test full `npm run deploy:static` locally - should succeed
7. git add/commit/push changes
8. Monitor Cloudflare Pages build success

**Next step:** Starting with wrangler.toml update.

