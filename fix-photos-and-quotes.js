const fs = require('fs');

// ============================================================
// FIX 1: Admin Photos Page - Use user's buckets, save correct columns
// ============================================================
console.log('Fixing admin photos page...');
let adminPhotos = fs.readFileSync('src/app/admin/photos/page.tsx', 'utf8');

// Replace the upload section to use user's buckets
// Change from single bucket 'moolgyan-media' to bucket selection
adminPhotos = adminPhotos.replace(
  /const categories = \[\s*\{ value: 'general', label: 'General Gallery' \},\s*\{ value: 'prachar', label: 'Prachar aur Prasar' \},\s*\{ value: 'videsh', label: 'Videsh Bhraman' \},\s*\{ value: 'events', label: 'Events' \},\s*\{ value: 'satsang', label: 'Satsang' \},\s*\{ value: 'deeksha', label: 'Deeksha' \}\s*\];/,
  `const buckets = [
    { value: 'prachar-aur-prasar', label: 'Prachar aur Prasar' },
    { value: 'general gallery', label: 'General Gallery' },
    { value: 'saar-sangrah', label: 'Saar Sangrah' }
  ];`
);

// Replace category state with bucket state
adminPhotos = adminPhotos.replace(
  /const \[filterCategory, setFilterCategory\] = useState<string>\('all'\);/,
  `const [selectedBucket, setSelectedBucket] = useState<string>('prachar-aur-prasar');
  const [filterBucket, setFilterBucket] = useState<string>('all');`
);

// Replace formData category with folder
adminPhotos = adminPhotos.replace(
  /category: string;\s*image_url: string;/,
  `folder: string;\n  public_url: string;`
);
adminPhotos = adminPhotos.replace(
  /category: 'general',\s*image_url: '',\s*thumbnail_url: '',/,
  `folder: 'prachar-aur-prasar',\n    public_url: '',\n    file_name: '',`
);

// Replace all category references in formData
adminPhotos = adminPhotos.replace(/formData\.category/g, 'formData.folder');
adminPhotos = adminPhotos.replace(/setFilterCategory/g, 'setFilterBucket');
adminPhotos = adminPhotos.replace(/filterCategory/g, 'filterBucket');

// Replace categories.find with buckets.find
adminPhotos = adminPhotos.replace(/categories\.find/g, 'buckets.find');
adminPhotos = adminPhotos.replace(/categories\.map/g, 'buckets.map');

// Replace the upload logic
adminPhotos = adminPhotos.replace(
  /const filePath = `photos\/\${fileName}`;\s*\/\/ Upload to Supabase Storage\s*const \{ error: uploadError, data \} = await supabase\.storage\s*\.from\('moolgyan-media'\)\s*\.upload\(filePath, file, \{\s*cacheControl: '3600',\s*upsert: false\s*\}\);/,
  `const filePath = fileName;\n        // Upload to selected bucket\n        const { error: uploadError } = await supabase.storage\n          .from(selectedBucket)\n          .upload(filePath, file, {\n            cacheControl: '3600',\n            upsert: false\n          });`
);

// Replace public URL retrieval
adminPhotos = adminPhotos.replace(
  /const \{ data: \{ publicUrl \} \} = supabase\.storage\s*\.from\('moolgyan-media'\)\s*\.getPublicUrl\(filePath\);/,
  `const { data: { publicUrl } } = supabase.storage\n          .from(selectedBucket)\n          .getPublicUrl(filePath);`
);

// Replace photoData to save correct columns
adminPhotos = adminPhotos.replace(
  /const photoData = \{\s*id: crypto\.randomUUID\(\),\s*title: file\.name\.replace\(\/\\\.\\\[\^\/\.\]\+\$\/, ""\),\s*description: '',\s*category: 'general',\s*image_url: publicUrl,\s*thumbnail_url: thumbnailUrl,\s*file_size: file\.size,\s*file_type: file\.type,\s*is_active: true,\s*sort_order: 0\s*\};/,
  `const photoData = {\n          id: crypto.randomUUID(),\n          title: file.name.replace(/\\.[^/.]+$/, ""),\n          folder: selectedBucket,\n          public_url: publicUrl,\n          file_name: file.name,\n          uploaded_at: new Date().toISOString()\n        };`
);

// Replace delete storage path
adminPhotos = adminPhotos.replace(
  /if \(photo\.image_url\.includes\('moolgyan-media'\)\) \{\s*const filePath = photo\.image_url\.split\('\/'\)\.pop\(\);\s*if \(filePath\) \{\s*await supabase\.storage\.from\('moolgyan-media'\)\.remove\(\[`photos\/\${filePath}`\]\);\s*\}\s*\}/,
  `const filePath = photo.public_url?.split('/').pop();\n      if (filePath && photo.folder) {\n        await supabase.storage.from(photo.folder).remove([filePath]);\n      }`
);

// Replace image_url references with public_url
adminPhotos = adminPhotos.replace(/photo\.image_url/g, 'photo.public_url');
adminPhotos = adminPhotos.replace(/photo\.thumbnail_url/g, 'photo.public_url');
adminPhotos = adminPhotos.replace(/formData\.image_url/g, 'formData.public_url');

// Add bucket selection UI in upload section
adminPhotos = adminPhotos.replace(
  /<CardDescription>\s*Upload multiple photos directly to Supabase storage\. They will be automatically synced to the app\.\s*<\/CardDescription>/,
  `<CardDescription>\n            Select a bucket and upload multiple photos directly to Supabase storage.\n          </CardDescription>`
);

adminPhotos = adminPhotos.replace(
  /<input\s*ref=\{fileInputRef\}\s*type="file"\s*multiple\s*accept="image\/\*"\s*onChange=\{handleFileUpload\}\s*className="hidden"\s*\/>/,
  `<div className="mb-4">\n              <label className="text-sm font-medium mb-2 block">Select Bucket</label>\n              <select\n                value={selectedBucket}\n                onChange={(e) => setSelectedBucket(e.target.value)}\n                className="w-full p-2 border rounded-md"\n              >\n                {buckets.map((bucket) => (\n                  <option key={bucket.value} value={bucket.value}>{bucket.label}</option>\n                ))}\n              </select>\n            </div>\n            <input\n              ref={fileInputRef}\n              type="file"\n              multiple\n              accept="image/*"\n              onChange={handleFileUpload}\n              className="hidden"\n            />`
);

// Fix the edit form to use folder instead of category
adminPhotos = adminPhotos.replace(
  /<label className="text-sm font-medium">Category<\/label>\s*<Select\s*value=\{formData\.folder\}\s*onValueChange=\{\(value\) => setFormData\(\{ \.\.\.formData, folder: value \}\)\}\s*>\s*<SelectTrigger>\s*<SelectValue placeholder="Select category" \/>\s*<\/SelectTrigger>\s*<SelectContent>\s*\{categories\.map\(\(cat\) => \(/,
  `<label className="text-sm font-medium">Bucket</label>\n                <Select\n                  value={formData.folder}\n                  onValueChange={(value) => setFormData({ ...formData, folder: value })}\n                >\n                  <SelectTrigger>\n                    <SelectValue placeholder="Select bucket" />\n                  </SelectTrigger>\n                  <SelectContent>\n                    {buckets.map((bucket) => (`
);

adminPhotos = adminPhotos.replace(
  /<SelectItem key=\{cat\.value\} value=\{cat\.value\}>\s*\{cat\.label\}\s*<\/SelectItem>\s*\)\)\}\s*<\/SelectContent>\s*<\/Select>/,
  `<SelectItem key={bucket.value} value={bucket.value}>\n                        {bucket.label}\n                      </SelectItem>\n                    ))}\n                  </SelectContent>\n                </Select>`
);

// Fix filter dropdown
adminPhotos = adminPhotos.replace(
  /<Select value=\{filterBucket\} onValueChange=\{setFilterBucket\}>\s*<SelectTrigger className="w-full md:w-48">\s*<Filter className="h-4 w-4 mr-2" \/>\s*<SelectValue placeholder="Filter by category" \/>\s*<\/SelectTrigger>\s*<SelectContent>\s*<SelectItem value="all">All Categories<\/SelectItem>\s*\{categories\.map\(\(cat\) => \(/,
  `<Select value={filterBucket} onValueChange={setFilterBucket}>\n              <SelectTrigger className="w-full md:w-48">\n                <Filter className="h-4 w-4 mr-2" />\n                <SelectValue placeholder="Filter by bucket" />\n              </SelectTrigger>\n              <SelectContent>\n                <SelectItem value="all">All Buckets</SelectItem>\n                {buckets.map((bucket) => (`
);

adminPhotos = adminPhotos.replace(
  /<SelectItem key=\{cat\.value\} value=\{cat\.value\}>\s*\{cat\.label\}\s*<\/SelectItem>\s*\)\)\}\s*<\/SelectContent>\s*<\/Select>/,
  `<SelectItem key={bucket.value} value={bucket.value}>\n                    {bucket.label}\n                  </SelectItem>\n                ))}\n              </SelectContent>\n            </Select>`
);

// Fix filteredPhotos to use folder instead of category
adminPhotos = adminPhotos.replace(
  /const matchesCategory = filterBucket === 'all' \|\| photo\.category === filterBucket;/,
  `const matchesBucket = filterBucket === 'all' || photo.folder === filterBucket;`
);
adminPhotos = adminPhotos.replace(
  /return matchesSearch && matchesCategory;/,
  `return matchesSearch && matchesBucket;`
);

// Fix badge display
adminPhotos = adminPhotos.replace(
  /\{categories\.find\(c => c\.value === photo\.category\)\?\.label \|\| photo\.category\}/g,
  `{buckets.find(b => b.value === photo.folder)?.label || photo.folder}`
);

// Fix openEditDialog
adminPhotos = adminPhotos.replace(
  /category: photo\.category,/,
  `folder: photo.folder || 'prachar-aur-prasar',`
);
adminPhotos = adminPhotos.replace(
  /image_url: photo\.image_url,/,
  `public_url: photo.public_url || '',`
);
adminPhotos = adminPhotos.replace(
  /thumbnail_url: photo\.thumbnail_url \|\| '',/,
  `file_name: photo.file_name || '',`
);

// Fix form reset
adminPhotos = adminPhotos.replace(
  /category: 'general',\s*image_url: '',\s*thumbnail_url: '',\s*file_size: 0,\s*file_type: ''/,
  `folder: 'prachar-aur-prasar',\n        public_url: '',\n        file_name: ''`
);

fs.writeFileSync('src/app/admin/photos/page.tsx', adminPhotos);
console.log('✅ Admin photos page fixed');

// ============================================================
// FIX 2: Frontend Photos Page - Match user's bucket names
// ============================================================
console.log('Fixing frontend photos page...');
let frontendPhotos = fs.readFileSync('src/app/photos/page.tsx', 'utf8');

// Fix bucket name: general-gallery -> general gallery
frontendPhotos = frontendPhotos.replace(
  /"general-gallery": \{\s*displayName: "सामान्य गैलरी",/,
  `"general gallery": {\n      displayName: "सामान्य गैलरी",`
);

// Also update orderedFolders
frontendPhotos = frontendPhotos.replace(
  /const orderedFolders = \["prachar-aur-prasar", "general-gallery", "saar-sangrah"\];/,
  `const orderedFolders = ["prachar-aur-prasar", "general gallery", "saar-sangrah"];`
);

fs.writeFileSync('src/app/photos/page.tsx', frontendPhotos);
console.log('✅ Frontend photos page fixed');

// ============================================================
// FIX 3: WisdomQuotes - Handle both text and quote_text
// ============================================================
console.log('Fixing WisdomQuotes component...');
let wisdomQuotes = fs.readFileSync('src/components/WisdomQuotes.tsx', 'utf8');

// Update interface to accept both field names
wisdomQuotes = wisdomQuotes.replace(
  /interface WisdomQuote \{\s*id: string;\s*text: string;\s*author: string;\s*category\?: string;\s*\}/,
  `interface WisdomQuote {\n  id: string;\n  text?: string;\n  quote_text?: string;\n  author: string;\n  category?: string;\n}`
);

// Update the quote display to handle both field names
wisdomQuotes = wisdomQuotes.replace(
  /"\{quote\.text\}"/g,
  '{quote.quote_text || quote.text || \'\'}'
);

fs.writeFileSync('src/components/WisdomQuotes.tsx', wisdomQuotes);
console.log('✅ WisdomQuotes component fixed');

// ============================================================
// FIX 4: Admin Wisdom Quotes - useState -> useEffect
// ============================================================
console.log('Fixing admin wisdom quotes page...');
let adminQuotes = fs.readFileSync('src/app/admin/wisdom-quotes/page.tsx', 'utf8');

// Fix useState bug -> useEffect
adminQuotes = adminQuotes.replace(
  /useState\(\(\) => \{\s*fetchQuotes\(\);\s*\}\);/,
  `useEffect(() => {\n    fetchQuotes();\n  }, [fetchQuotes]);`
);

// Need to add useEffect import
if (!adminQuotes.includes('useEffect')) {
  adminQuotes = adminQuotes.replace(
    /import \{ useState, useCallback \} from 'react';/,
    `import { useState, useCallback, useEffect } from 'react';`
  );
}

fs.writeFileSync('src/app/admin/wisdom-quotes/page.tsx', adminQuotes);
console.log('✅ Admin wisdom quotes page fixed');

console.log('\n🎉 All fixes applied successfully!');
console.log('\nSummary:');
console.log('1. Photos admin: Now uploads to user buckets (prachar-aur-prasar, general gallery, saar-sangrah)');
console.log('2. Photos admin: Saves correct columns (folder, public_url, file_name, uploaded_at)');
console.log('3. Photos frontend: Bucket name "general-gallery" → "general gallery"');
console.log('4. WisdomQuotes: Handles both text and quote_text fields');
console.log('5. Admin quotes: Fixed useState() → useEffect() for data fetching');
