const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.controller.ts')) files.push(p);
  }
  return files;
}

const authImportPatterns = [
  /import\s+\{\s*JwtAuthGuard\s*\}\s+from\s+['"][^'"]+['"];\s*\n/g,
  /import\s+\{\s*RolesGuard\s*\}\s+from\s+['"][^'"]+['"];\s*\n/g,
  /import\s+\{\s*Roles\s*\}\s+from\s+['"][^'"]+['"];\s*\n/g,
  /import\s+\{\s*UserRole\s*\}\s+from\s+['"]@prisma\/client['"];\s*\n/g,
];

for (const file of walk(root)) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(/@UseGuards\(JwtAuthGuard\)\s*\n/g, '');
  content = content.replace(/@UseGuards\(RolesGuard\)\s*\n/g, '');
  content = content.replace(/@Roles\([^)]+\)\s*\n/g, '');

  for (const pat of authImportPatterns) {
    content = content.replace(pat, '');
  }

  content = content.replace(
    /import\s+\{([^}]+)\}\s+from\s+['"]@nestjs\/common['"];/g,
    (m, imports) => {
      const parts = imports.split(',').map((s) => s.trim()).filter(Boolean);
      const filtered = parts.filter((p) => p !== 'UseGuards');
      if (filtered.length === parts.length) return m;
      if (filtered.length === 0) return m;
      return `import { ${filtered.join(', ')} } from '@nestjs/common';`;
    },
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated:', path.relative(root, file));
  }
}

console.log('Done');
