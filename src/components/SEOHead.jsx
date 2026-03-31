import { useEffect } from 'react'
import { SITE_URL } from '../data/constants'

/**
 * SEOHead — sets <title>, meta description, OG, Twitter, canonical,
 * BreadcrumbList, Article, and FAQPage JSON-LD for every page.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  image,
  type = 'website',
  article = null,    // { publishedTime, tag }
  breadcrumbs = null,// [{ name, url }]
  faqs = null,       // [{ q, a }] — unlocks FAQ rich results in Google
  schema = null,     // override with a full custom JSON-LD object
}) {
  const siteName  = 'OFFGRID.KE'
  const defaultImg = `${SITE_URL}/og-default.jpg`

  const fullTitle = title
    ? (title.includes('OFFGRID') ? title : `${title} | ${siteName}`)
    : `${siteName} — Kenya's Free Off-Grid Guide`
  const fullDesc  = description || 'Free guides, real local prices, and practical advice for going off-grid in Kenya. Solar, water, and security for homeowners, farmers, and small businesses.'
  const fullImg   = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : defaultImg
  const fullUrl   = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const parts = selector.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(parts[0].trim(), parts[1].replace(/"/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el) }
      el.href = href
    }

    const setSchema = (id, data) => {
      let el = document.getElementById(id)
      if (!el) {
        el = document.createElement('script')
        el.id = id
        el.type = 'application/ld+json'
        document.head.appendChild(el)
      }
      el.textContent = JSON.stringify(data)
    }

    // Standard
    setMeta('meta[name="description"]',         'content', fullDesc)
    setMeta('meta[name="robots"]',              'content', 'index, follow, max-image-preview:large')
    setMeta('meta[name="geo.region"]',          'content', 'KE')
    setLink('canonical', fullUrl)

    // Open Graph
    setMeta('meta[property="og:title"]',        'content', fullTitle)
    setMeta('meta[property="og:description"]',  'content', fullDesc)
    setMeta('meta[property="og:url"]',          'content', fullUrl)
    setMeta('meta[property="og:image"]',        'content', fullImg)
    setMeta('meta[property="og:image:width"]',  'content', '1200')
    setMeta('meta[property="og:image:height"]', 'content', '630')
    setMeta('meta[property="og:type"]',         'content', type)
    setMeta('meta[property="og:site_name"]',    'content', siteName)
    setMeta('meta[property="og:locale"]',       'content', 'en_KE')

    // Twitter
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]',       'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', fullDesc)
    setMeta('meta[name="twitter:image"]',       'content', fullImg)

    // Article
    if (article) {
      setMeta('meta[property="article:published_time"]', 'content', article.publishedTime)
      setMeta('meta[property="article:section"]',        'content', article.tag)
    }

    // Main schema (Article, WebPage, WebSite, or custom)
    setSchema('json-ld-schema', schema || {
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      name:        siteName,
      url:         SITE_URL,
      description: fullDesc,
      potentialAction: {
        '@type':       'SearchAction',
        target:        `${SITE_URL}/posts?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })

    // Breadcrumb schema — shows path in Google search results
    if (breadcrumbs && breadcrumbs.length > 0) {
      setSchema('json-ld-breadcrumb', {
        '@context':        'https://schema.org',
        '@type':           'BreadcrumbList',
        itemListElement:    breadcrumbs.map((crumb, i) => ({
          '@type':   'ListItem',
          position:   i + 1,
          name:       crumb.name,
          item:       crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
        })),
      })
    }

    // FAQ schema — unlocks expandable Q&A rich results in Google
    if (faqs && faqs.length > 0) {
      setSchema('json-ld-faq', {
        '@context':   'https://schema.org',
        '@type':      'FAQPage',
        mainEntity:    faqs.map(({ q, a }) => ({
          '@type':         'Question',
          name:             q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      })
    }

  }, [fullTitle, fullDesc, fullImg, fullUrl, type, article, breadcrumbs, faqs, schema])

  return null
}
