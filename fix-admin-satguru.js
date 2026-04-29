const fs = require('fs');
const file = 'src/app/admin/satguru-bhajan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Add useEffect to imports
content = content.replace(
  "import { useState, useCallback } from 'react';",
  "import { useState, useCallback, useEffect } from 'react';"
);

// Fix 2: Change useState(() => { fetchBhajans(); }) to useEffect
content = content.replace(
  /useState\(\(\) => \{\s*fetchBhajans\(\);\s*\}\);/,
  "useEffect(() => {\n    fetchBhajans();\n  }, [fetchBhajans]);"
);

fs.writeFileSync(file, content);
console.log('Fixed admin satguru-bhajan page');
