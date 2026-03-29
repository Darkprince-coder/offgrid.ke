import { useEffect } from 'react'

/**
 * SEOHead — sets <title>, meta description, OG tags, canonical, and JSON-LD
 * for every page dynamically. No external library needed.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  image,
  type = 'website',
  article = null,   // { publishedTime, tag }
  schema = null,    // raw JSON-LD object
}) {
  const siteName   = 'OFFGRID.KE'
  const siteUrl    = 'https://offgrid.ke'
  const defaultImg = `${siteUrl}/og-default.jpg`

  const fullTitle  = title ? `${title} | ${siteName}` : `${siteName} — Kenya's Free Off-Grid Guide`
  const fullDesc   = description || 'Free guides, real local prices, and practical advice for going off-grid in Kenya. Solar, water, and security for homeowners, farmers, and small businesses.'
  const fullImg    = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImg
  const fullUrl    = canonical ? `${siteUrl}${canonical}` : siteUrl

  useEffect(() => {
    // Title
    document.title = fullTitle

    // Helper to set/create a meta tag
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(attrName.trim(), attrVal.replace(/"/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el) }
      el.href = href
    }

    // Standard meta
    setMeta('meta[name="description"]',         'content', fullDesc)
    setMeta('meta[name="robots"]',              'content', 'index, follow, max-image-preview:large')

    // Canonical
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

    // Twitter card
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]',       'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', fullDesc)
    setMeta('meta[name="twitter:image"]',       'content', fullImg)

    // Article-specific
    if (article) {
      setMeta('meta[property="article:published_time"]', 'content', article.publishedTime)
      setMeta('meta[property="article:section"]',        'content', article.tag)
    }

    // JSON-LD structured data
    const schemaId = 'json-ld-schema'
    let schemaEl   = document.getElementById(schemaId)
    if (!schemaEl) { schemaEl = document.createElement('script'); schemaEl.id = schemaId; schemaEl.type = 'application/ld+json'; document.head.appendChild(schemaEl) }
    schemaEl.textContent = JSON.stringify(schema || {
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      name:       siteName,
      url:        siteUrl,
      description: fullDesc,
      potentialAction: {
        '@type':       'SearchAction',
        target:        `${siteUrl}/posts?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })
  }, [fullTitle, fullDesc, fullImg, fullUrl, type, article, schema])

  return null
}
