-- No SQL needed - CODE FIX for YouTube Live URLs

-- Issue: Admin live satsang page regex missing /live/ support
-- File: src/app/admin/live-satsang/page.tsx (line ~304)

-- Replace this line:
-- const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;

-- With this:
-- const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/(?:live\/|embed\/))([^&\n?#]+)/;

-- Test URL: https://www.youtube.com/live/iveKAHZy8tw?si=LB6KyWlcJtO89PUi
-- Video ID: iveKAHZy8tw ✓

-- After fix: Paste URL → thumbnail loads → save works ✅

