import { writeFileSync } from 'fs';
import { globby } from 'globby';

async function generateSitemap() {
  const pages = await globby([
    'src/pages/**/*.tsx',
    '!src/pages/_*.tsx',
    '!src/pages/api',
  ]);

  const urlset = pages
    .map((page) => {
      const path = page
        .replace('src/pages', '')
        .replace('.tsx', '')
        .replace('/index', '');
      return `<url><loc>https://franco-colapinto-f1-live-tracker.netlify.app${path}</loc></url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;

  writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap();