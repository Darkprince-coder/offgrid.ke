import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPostBySlug, getAllPosts, formatDate } from '../data/posts'
import PostContent from '../components/PostContent'
import SEOHead from '../components/SEOHead'
import { SITE_URL } from '../data/constants'
import { ChevronUp, List, X } from 'lucide-react'

const tagClass = { solar: 'tag-solar', water: 'tag-water', how: 'tag-how', security: 'tag-security' }

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// ── Table of Contents ─────────────────────────────────────────────────────────
function extractHeadings(content = []) {
  return content.filter(b => b.type === 'h2').map(b => ({ text: b.text, id: slugify(b.text) }))
}

function TableOfContents({ headings }) {
  const [active, setActive] = useState('')
  const [open, setOpen]     = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { const vis = entries.find(e => e.isIntersecting); if (vis) setActive(vis.target.id) },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    headings.forEach(h => { const el = document.getElementById(h.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="toc-desktop" style={{ position: 'sticky', top: '90px', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 12, padding: '1.2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-muted)', marginBottom: '0.8rem' }}>In this guide</div>
        <nav>
          {headings.map(h => (
            <a key={h.id} href={`#${h.id}`}
              style={{ display: 'block', fontSize: '0.82rem', padding: '0.3rem 0', paddingLeft: active === h.id ? '0.75rem' : '0', borderLeft: active === h.id ? '2px solid var(--color-sun)' : '2px solid transparent', color: active === h.id ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: active === h.id ? 600 : 400, transition: 'all 0.2s', lineHeight: 1.4, textDecoration: 'none' }}>
              {h.text}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile floating TOC */}
      <div className="toc-mobile" style={{ position: 'fixed', bottom: '5rem', right: '1rem', zIndex: 100 }}>
        <button onClick={() => setOpen(o => !o)}
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-ink)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {open ? <X size={18} strokeWidth={2.5} /> : <List size={18} strokeWidth={2.5} />}
        </button>
        {open && (
          <div style={{ position: 'absolute', bottom: '3.2rem', right: 0, width: 260, background: '#fff', border: '1px solid var(--color-rule)', borderRadius: 12, padding: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>In this guide</div>
            {headings.map(h => (
              <a key={h.id} href={`#${h.id}`} onClick={() => setOpen(false)}
                style={{ display: 'block', fontSize: '0.82rem', padding: '0.3rem 0', color: active === h.id ? 'var(--color-sun)' : 'var(--color-ink-2)', fontWeight: active === h.id ? 600 : 400, textDecoration: 'none', borderBottom: '1px solid var(--color-rule)', lineHeight: 1.4 }}>
                {h.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Back to top ───────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.22 }}
      style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 100, width: 44, height: 44, borderRadius: '50%', background: 'var(--color-sun)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', pointerEvents: visible ? 'auto' : 'none' }}>
      <ChevronUp size={20} strokeWidth={2.5} />
    </motion.button>
  )
}

// ── Related posts ─────────────────────────────────────────────────────────────
function RelatedPosts({ currentPost }) {
  const related = getAllPosts()
    .filter(p => p.slug !== currentPost.slug && p.tagColor === currentPost.tagColor)
    .slice(0, 3)
  if (related.length === 0) return null
  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-rule)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>Related guides</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {related.map(p => (
          <Link key={p.slug} to={`/posts/${p.slug}`}
            style={{ display: 'block', padding: '1rem', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 10, textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-sun)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-rule)'}>
            <span className={`tag ${tagClass[p.tagColor] || 'tag-how'}`} style={{ fontSize: '0.6rem', marginBottom: '0.4rem', display: 'inline-block' }}>{p.tag}</span>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35, marginBottom: '0.3rem' }}>{p.title}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{p.readTime} read →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── FAQ extraction from callouts ──────────────────────────────────────────────
function extractFAQs(content = []) {
  const faqs = []
  let lastH2 = ''
  content.forEach(block => {
    if (block.type === 'h2') lastH2 = block.text
    if (block.type === 'callout' && block.title && block.text && lastH2) faqs.push({ q: lastH2, a: block.text })
  })
  return faqs.slice(0, 6)
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  if (!post) return <Navigate to="/404" replace />

  const headings    = extractHeadings(post.content)
  const faqs        = extractFAQs(post.content)
  const hasHeadings = headings.length >= 3

  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.excerpt || post.title,
    url: `${SITE_URL}/posts/${post.slug}`,
    datePublished: post.date, dateModified: post.date,
    author:    { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'OFFGRID.KE', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-default.jpg` } },
    image: post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : `${SITE_URL}/og-default.jpg`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/posts/${post.slug}` },
    keywords: `${post.tag}, Kenya, off-grid, solar Kenya, ${post.title}`,
    articleSection: post.tag, inLanguage: 'en-KE',
  }

  return (
    <div>
      <SEOHead
        title={post.title}
        description={post.excerpt || `${post.title} — Kenya-specific guide from OFFGRID.KE`}
        canonical={`/posts/${post.slug}`}
        image={post.image}
        type="article"
        article={{ publishedTime: post.date, tag: post.tag }}
        schema={articleSchema}
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Guides', url: '/posts' }, { name: post.title, url: `/posts/${post.slug}` }]}
        faqs={faqs.length > 0 ? faqs : null}
      />

      {/* Breadcrumb bar */}
      <div style={{ background: 'var(--color-paper-2)', borderBottom: '1px solid var(--color-rule)', padding: '0.8rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
          <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link to="/posts" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Guides</Link>
          <span>/</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{post.title}</span>
        </div>
        <Link to="/posts" style={{ background: 'var(--color-ink)', color: '#fff', padding: '0.42rem 1.1rem', borderRadius: '7px', fontWeight: 600, fontSize: '0.8rem' }}>← All Guides</Link>
      </div>

      {/* Article layout */}
      <article style={{ padding: '3rem 5% 6rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: hasHeadings ? '220px 1fr' : '1fr', gap: '3rem', alignItems: 'start' }} className="post-grid">

          {hasHeadings && <TableOfContents headings={headings} />}

          <div style={{ maxWidth: '740px', minWidth: 0 }}>
            {post.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ width: '100%', height: '280px', overflow: 'hidden', marginBottom: '2rem', borderRadius: '12px' }}>
                <img src={post.image} alt={`${post.title} — offgrid.ke guide`} loading="lazy" width="740" height="280"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {post.tag} Guide · {post.readTime} read
              </p>
              <div style={{ marginBottom: '0.9rem' }}>
                <span className={`tag ${tagClass[post.tagColor] || 'tag-how'}`}>{post.tag}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--color-ink)', marginBottom: '1rem' }}>
                {post.title}
              </h1>
              {post.excerpt && (
                <p style={{ fontSize: '1.05rem', color: 'var(--color-ink-2)', lineHeight: 1.75, fontStyle: 'italic', borderLeft: '3px solid var(--color-sun)', paddingLeft: '1.2rem', marginBottom: '1.6rem' }}>
                  {post.excerpt}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center', padding: '0.9rem 0', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)', marginBottom: '2.5rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                <span>📅 {post.date ? formatDate(post.date) : '2026'}</span>
                <span>·</span><span>⏱ {post.readTime} read</span>
                <span>·</span><span>🇰🇪 Kenya-specific</span>
                <span>·</span><span>✍️ Offgrid.ke</span>
              </div>
            </motion.div>

            <PostContent content={post.content} />
            <RelatedPosts currentPost={post} />

            {/* Footer CTA */}
            <div style={{ marginTop: '3rem', background: 'linear-gradient(135deg, var(--color-sky), #0e3f57)', borderRadius: '14px', padding: '2rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fff', marginBottom: '0.3rem' }}>More guides coming soon</h4>
                <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)' }}>Subscribe to get notified when new guides are published.</p>
              </div>
              <Link to="/contact" style={{ background: 'var(--color-sun)', color: '#fff', padding: '0.72rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>Subscribe →</Link>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', border: '1px solid var(--color-rule)', padding: '0.6rem 1.3rem', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}>← Back to all guides</Link>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-paper-2)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', padding: '0.6rem 1.3rem', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}>🏠 Home</Link>
            </div>
          </div>
        </div>
      </article>

      <BackToTop />

      <style>{`
        @media (max-width: 900px) { .post-grid { grid-template-columns: 1fr !important; } .toc-desktop { display: none !important; } }
        @media (min-width: 901px) { .toc-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}
