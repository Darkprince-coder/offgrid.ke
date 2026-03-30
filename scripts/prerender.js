// scripts/prerender.js
// Generates a real HTML file for every route in dist/
// so Google gets actual <title>, <meta>, and content — not just <div id="root">
//
// Run after build: node scripts/prerender.js
// netlify.toml command:
//   "npm ci --include=dev && node scripts/generate-sitemap.js && npm run build && node scripts/prerender.js"

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const DIST      = join(ROOT, 'dist')
const SITE_URL  = 'https://offgrid.ke'

// ── Post metadata (keep in sync with posts.js) ────────────────────────────────
const POSTS = [
  {
    slug:        'solar-panels-price-kenya',
    title:       'Solar Panels Price in Kenya 2026: What You Actually Pay Per Panel and Per System',
    description: 'Real KSh prices for every panel size and complete system — plus why prices are rising in 2026, which brands are worth it, and how to avoid overpaying installers.',
    date:        '2026-03-30',
    tag:         'Solar',
    image:       '/images/solar-panels-price-kenya.jpg',
  },
  {
    slug:        'how-many-solar-panels',
    title:       'How Many Solar Panels Do I Need? A Practical Kenya Guide',
    description: 'Step-by-step calculation using real Kenyan sunshine hours and county data so you know your number before talking to any installer.',
    date:        '2026-03-01',
    tag:         'Solar',
    image:       '/images/how-many-solar-panels.jpg',
  },
  {
    slug:        'solar-3-bedroom-house',
    title:       'Solar for a 3-Bedroom House in Kenya: What You Need and What It Costs',
    description: 'Real KSh price ranges, brand recommendations, and 5 questions to ask every installer before you sign anything.',
    date:        '2026-03-05',
    tag:         'Solar',
    image:       '/images/solar-3-bedroom-house.jpg',
  },
  {
    slug:        'best-water-tanks-kenya',
    title:       'Best Water Tanks in Kenya: Brands, Sizes, and Current Prices (2026)',
    description: 'An honest comparison of Kentank, Roto, Toptank, and more with real KSh price tables and a guide to choosing the right size for your household.',
    date:        '2026-03-08',
    tag:         'Water',
    image:       '/images/best-water-tanks-kenya.jpg',
  },
  {
    slug:        'lithium-vs-lead-acid',
    title:       'Lithium vs Lead-Acid Batteries in Kenya: Which Should You Buy?',
    description: 'A no-nonsense comparison of LiFePO4 and lead-acid batteries using real Kenyan prices so you can make the right call for your budget and situation.',
    date:        '2026-03-10',
    tag:         'Solar',
    image:       '/images/lithium-vs-lead-acid.jpg',
  },
  {
    slug:        'rainwater-harvesting-kenya',
    title:       'Rainwater Harvesting in Kenya: A Complete Setup Guide (2026)',
    description: 'Everything you need to collect, filter, and store rainwater in Kenya from rooftop collection to first-flush filters with real material costs.',
    date:        '2026-03-11',
    tag:         'Water',
    image:       '/images/rainwater-harvesting-kenya.jpg',
  },
  {
    slug:        'welcome-to-offgrid-ke',
    title:       'Welcome to OFFGRID.KE',
    description: "Kenya's free practical guide to off-grid living — solar, water, food and security for homeowners, farmers and small businesses.",
    date:        '2026-03-13',
    tag:         'Solar',
    image:       '',
  },
]

// ── Static pages ──────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  {
    route:       '/',
    title:       "OFFGRID.KE — Kenya's Free Off-Grid Guide",
    description: 'Free guides, real local prices, and practical advice for going off-grid in Kenya. Solar, water, and security for homeowners, farmers, and small businesses.',
    canonical:   '/',
    image:       '/og-default.jpg',
  },
  {
    route:       '/posts',
    title:       'All Guides — Solar, Water & Security for Kenya | OFFGRID.KE',
    description: 'Browse all free off-grid guides for Kenya: solar system sizing, water tanks, rainwater harvesting, battery comparisons, and more. Real KSh prices.',
    canonical:   '/posts',
    image:       '/og-default.jpg',
  },
  {
    route:       '/tools/solar-calculator',
    title:       'Free Solar System Calculator for Kenya — Panels, Batteries & Inverter | OFFGRID.KE',
    description: 'Enter your appliances and county. Get an instant solar system recommendation with real Kenyan prices for panels, batteries, and inverter. Free tool, no sign-up.',
    canonical:   '/tools/solar-calculator',
    image:       '/og-default.jpg',
  },
  {
    route:       '/tools/cost-comparison',
    title:       'KPLC vs Solar vs Generator Cost Comparison Kenya 2026 | OFFGRID.KE',
    description: 'Compare the real 10-year cost of KPLC grid power, solar, and generator in Kenya. See payback periods and KSh savings with our free tool.',
    canonical:   '/tools/cost-comparison',
    image:       '/og-default.jpg',
  },
  {
    route:       '/about',
    title:       "About OFFGRID.KE — Kenya's Free Off-Grid Resource",
    description: 'OFFGRID.KE provides free, Kenya-specific guides on solar, water, and security for homeowners, farmers, and small businesses. No paywalls, no paid placements.',
    canonical:   '/about',
    image:       '/og-default.jpg',
  },
  {
    route:       '/contact',
    title:       'Contact OFFGRID.KE — Questions & Corrections',
    description: 'Get in touch with the OFFGRID.KE team via WhatsApp or email. We reply to every question about solar, water, and off-grid living in Kenya.',
    canonical:   '/contact',
    image:       '/og-default.jpg',
  },
]

// ── HTML generator ────────────────────────────────────────────────────────────
function buildHTML({ title, description, canonical, image, date, tag, schema }) {
  const baseHTML   = readFileSync(join(DIST, 'index.html'), 'utf-8')
  const fullUrl    = `${SITE_URL}${canonical}`
  const fullImage  = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : `${SITE_URL}/og-default.jpg`
  const fullTitle  = title.includes('OFFGRID') ? title : `${title} | OFFGRID.KE`

  const metaTags = `
    <title>${fullTitle}</title>
    <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${fullUrl}" />
    <meta property="og:title" content="${fullTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:image" content="${fullImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="${date ? 'article' : 'website'}" />
    <meta property="og:site_name" content="OFFGRID.KE" />
    <meta property="og:locale" content="en_KE" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${fullTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${fullImage}" />
    ${date ? `<meta property="article:published_time" content="${date}" />` : ''}
    ${tag  ? `<meta property="article:section" content="${tag}" />` : ''}
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`

  // Replace the existing <title> in the built index.html with full meta block
  return baseHTML
    .replace(/<title>.*?<\/title>/, metaTags)
    // Remove any duplicate meta description from base html
    .replace(/<meta name="description"[^>]*>/, '')
}

// ── Write a route's HTML to dist ──────────────────────────────────────────────
function writeRoute(route, html) {
  const dirPath  = join(DIST, route === '/' ? '' : route)
  const filePath = join(dirPath, 'index.html')
  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true })
  writeFileSync(filePath, html)
  console.log(`✅ Pre-rendered: ${route}`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('\n🔄 Pre-rendering routes for SEO...\n')

// Static pages
for (const page of STATIC_PAGES) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'WebPage',
    name:        page.title,
    description: page.description,
    url:         `${SITE_URL}${page.canonical}`,
    isPartOf: { '@type': 'WebSite', name: 'OFFGRID.KE', url: SITE_URL },
  }
  const html = buildHTML({ ...page, schema })
  writeRoute(page.route, html)
}

// Post pages
for (const post of POSTS) {
  const canonical = `/posts/${post.slug}`
  const schema = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:          post.title,
    description:       post.description,
    url:              `${SITE_URL}${canonical}`,
    datePublished:     post.date,
    dateModified:      post.date,
    author:          { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL },
    publisher:       { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL,
                       logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-default.jpg` } },
    image:             post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/og-default.jpg`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${canonical}` },
    keywords:         `${post.tag}, Kenya, off-grid, solar Kenya, ${post.title}`,
    articleSection:    post.tag,
    inLanguage:       'en-KE',
  }
  const html = buildHTML({
    title:       post.title,
    description: post.description,
    canonical,
    image:       post.image,
    date:        post.date,
    tag:         post.tag,
    schema,
  })
  writeRoute(canonical, html)
}

// Also handle CMS posts from content/posts/
import { readdirSync } from 'fs'
try {
  const cmsDir = join(ROOT, 'content', 'posts')
  if (existsSync(cmsDir)) {
    const files = readdirSync(cmsDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const raw          = readFileSync(join(cmsDir, file), 'utf-8')
      const slugMatch    = raw.match(/^slug:\s*["']?(.+?)["']?\s*$/m)
      const titleMatch   = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)
      const excerptMatch = raw.match(/^excerpt:\s*["']?(.+?)["']?\s*$/m)
      const dateMatch    = raw.match(/^date:\s*["']?(.+?)["']?\s*$/m)
      const tagMatch     = raw.match(/^tag:\s*["']?(.+?)["']?\s*$/m)
      const imageMatch   = raw.match(/^image:\s*["']?(.+?)["']?\s*$/m)

      const slug    = slugMatch    ? slugMatch[1].trim()    : file.replace('.md', '')
      const title   = titleMatch   ? titleMatch[1].trim()   : 'Guide'
      const desc    = excerptMatch ? excerptMatch[1].trim() : title
      const date    = dateMatch    ? dateMatch[1].trim().slice(0, 10) : ''
      const tag     = tagMatch     ? tagMatch[1].trim()     : 'Solar'
      const image   = imageMatch   ? imageMatch[1].trim()   : ''
      const canonical = `/posts/${slug}`

      // Skip if already handled in POSTS above
      if (POSTS.find(p => p.slug === slug)) continue

      const schema = {
        '@context':  'https://schema.org',
        '@type':     'Article',
        headline:     title,
        description:  desc,
        url:         `${SITE_URL}${canonical}`,
        datePublished: date,
        author:      { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL },
        publisher:   { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL },
        inLanguage:  'en-KE',
      }
      const html = buildHTML({ title, description: desc, canonical, image, date, tag, schema })
      writeRoute(canonical, html)
    }
  }
} catch (e) {
  console.log('No CMS posts folder found, skipping.')
}

console.log('\n✅ Pre-rendering complete.\n')
