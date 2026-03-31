// scripts/generate-sitemap.js
// Run at build time: node scripts/generate-sitemap.js
// netlify.toml: "npm ci --include=dev && node scripts/generate-sitemap.js && npm run build && node scripts/prerender.js"

import { writeFileSync, readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://offgrid.ke'
const TODAY    = new Date().toISOString().split('T')[0]

// Static pages — add new tools here
const staticPages = [
  { url: '/',                              changefreq: 'daily',   priority: '1.0' },
  { url: '/posts',                         changefreq: 'daily',   priority: '0.9' },
  { url: '/tools/solar-calculator',        changefreq: 'monthly', priority: '0.9' },
  { url: '/tools/cost-comparison',         changefreq: 'monthly', priority: '0.8' },
  { url: '/tools/water-tank-calculator',   changefreq: 'monthly', priority: '0.8' },
  { url: '/about',                         changefreq: 'monthly', priority: '0.5' },
  { url: '/contact',                       changefreq: 'monthly', priority: '0.5' },
  { url: '/newsletter',                    changefreq: 'monthly', priority: '0.4' },
]

// Hardcoded posts (keep in sync with posts.js)
const hardcodedSlugs = [
  { slug: 'solar-panels-price-kenya',    date: '2026-03-30' },
  { slug: 'how-many-solar-panels',       date: '2026-03-01' },
  { slug: 'solar-3-bedroom-house',       date: '2026-03-05' },
  { slug: 'best-water-tanks-kenya',      date: '2026-03-08' },
  { slug: 'lithium-vs-lead-acid',        date: '2026-03-10' },
  { slug: 'rainwater-harvesting-kenya',  date: '2026-03-11' },
  { slug: 'welcome-to-offgrid-ke',       date: '2026-03-13' },
]

// Auto-read CMS posts from content/posts/
function getCMSSlugs() {
  try {
    const dir = join(process.cwd(), 'content', 'posts')
    if (!existsSync(dir)) return []
    return readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const raw       = readFileSync(join(dir, file), 'utf-8')
        const slugMatch = raw.match(/^slug:\s*["']?(.+?)["']?\s*$/m)
        const dateMatch = raw.match(/^date:\s*["']?(.+?)["']?\s*$/m)
        return {
          slug: slugMatch ? slugMatch[1].trim() : file.replace('.md', ''),
          date: dateMatch ? dateMatch[1].trim().slice(0, 10) : TODAY,
        }
      })
  } catch {
    return []
  }
}

// Merge, deduplicating CMS posts that match hardcoded slugs
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`

writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
console.log(`✅ sitemap.xml — ${staticPages.length + allSlugs.length} URLs`)

// robots.txt
const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`
writeFileSync(join(process.cwd(), 'public', 'robots.txt'), robots)
console.log('✅ robots.txt')
