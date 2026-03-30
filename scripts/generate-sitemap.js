// scripts/generate-sitemap.js
// Run this at build time: node scripts/generate-sitemap.js
// Add to netlify.toml command: "npm ci --include=dev && node scripts/generate-sitemap.js && npm run build"

import { writeFileSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://offgrid.ke'
const TODAY    = new Date().toISOString().split('T')[0]

// Static pages
const staticPages = [
  { url: '/',                       changefreq: 'daily',   priority: '1.0' },
  { url: '/posts',                  changefreq: 'daily',   priority: '0.9' },
  { url: '/tools/solar-calculator', changefreq: 'monthly', priority: '0.9' },
  { url: '/tools/cost-comparison',  changefreq: 'monthly', priority: '0.8' },
  { url: '/about',                  changefreq: 'monthly', priority: '0.5' },
  { url: '/contact',                changefreq: 'monthly', priority: '0.5' },
]

// Hardcoded posts slugs (keep in sync with posts.js)
const hardcodedSlugs = [
  {slug: 'solar-panels-price-kenya',       date: '2026-03-30'},
  { slug: 'how-many-solar-panels',         date: '2026-03-01' },
  { slug: 'solar-3-bedroom-house',          date: '2026-03-05' },
  { slug: 'best-water-tanks-kenya',         date: '2026-03-08' },
  { slug: 'lithium-vs-lead-acid',           date: '2026-03-10' },
  { slug: 'rainwater-harvesting-kenya',     date: '2026-03-11' },
]

// Read CMS posts from content/posts/
function getCMSSlugs() {
  try {
    const dir = join(process.cwd(), 'content', 'posts')
    const files = readdirSync(dir).filter(f => f.endsWith('.md'))
    return files.map(file => {
      const raw = readFileSync(join(dir, file), 'utf-8')
      const slugMatch    = raw.match(/^slug:\s*["']?(.+?)["']?\s*$/m)
      const dateMatch    = raw.match(/^date:\s*["']?(.+?)["']?\s*$/m)
      const slug = slugMatch ? slugMatch[1].trim() : file.replace('.md', '')
      const date = dateMatch ? dateMatch[1].trim().slice(0, 10) : TODAY
      return { slug, date }
    })
  } catch {
    return []
  }
}

const allSlugs = [
  ...hardcodedSlugs,
  ...getCMSSlugs().filter(c => !hardcodedSlugs.find(h => h.slug === c.slug)),
]

const postEntries = allSlugs.map(({ slug, date }) =>
  `  <url>
    <loc>${SITE_URL}/posts/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
).join('\n')

const staticEntries = staticPages.map(({ url, changefreq, priority }) =>
  `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticEntries}
${postEntries}
</urlset>`

writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
console.log(`✅ sitemap.xml generated — ${staticPages.length + allSlugs.length} URLs`)

// Also generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# Block admin
User-agent: *
Disallow: /admin/
`
writeFileSync(join(process.cwd(), 'public', 'robots.txt'), robots)
console.log('✅ robots.txt generated')
