import { useParams, Link, Navigate } from 'react-router-dom'
import { getPostBySlug, formatDate } from '../data/posts'
import PostContent from '../components/PostContent'
import SEOHead from '../components/SEOHead'

const tagClass = { solar: 'tag-solar', water: 'tag-water', how: 'tag-how', security: 'tag-security' }

export default function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/404" replace />

  // Build Article JSON-LD schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `https://offgrid.ke/posts/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'OFFGRID.KE',
      url: 'https://offgrid.ke',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OFFGRID.KE',
      url: 'https://offgrid.ke',
      logo: {
        '@type': 'ImageObject',
        url: 'https://offgrid.ke/og-default.jpg',
      },
    },
    image: post.image
      ? (post.image.startsWith('http') ? post.image : `https://offgrid.ke${post.image}`)
      : 'https://offgrid.ke/og-default.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://offgrid.ke/posts/${post.slug}`,
    },
    keywords: `${post.tag}, Kenya, off-grid, solar Kenya, ${post.title}`,
    articleSection: post.tag,
    inLanguage: 'en-KE',
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
      />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--color-paper-2)', borderBottom: '1px solid var(--color-rule)', padding: '0.8rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
          <Link to="/"      style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link to="/posts" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Guides</Link>
          <span>/</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{post.title}</span>
        </div>
        <Link to="/posts" style={{ background: 'var(--color-ink)', color: '#fff', padding: '0.42rem 1.1rem', borderRadius: '7px', fontWeight: 600, fontSize: '0.8rem' }}>
          ← All Guides
        </Link>
      </div>

      {/* Article */}
      <article style={{ padding: '4rem 5% 6rem' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>

          {post.image && (
            <div style={{ width: '100%', height: '280px', overflow: 'hidden', marginBottom: '2rem', borderRadius: '12px' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

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
            <span>📅 {post.date ? formatDate(post.date) : '2024'}</span>
            <span>·</span>
            <span>⏱ {post.readTime} read</span>
            <span>·</span>
            <span>🇰🇪 Kenya-specific</span>
            <span>·</span>
            <span>✍️ Offgrid.ke</span>
          </div>

          <PostContent content={post.content} />

          {/* Footer CTA */}
          <div style={{ marginTop: '4rem', background: 'linear-gradient(135deg, var(--color-sky), #0e3f57)', borderRadius: '14px', padding: '2rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fff', marginBottom: '0.3rem' }}>More guides coming soon</h4>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)' }}>Subscribe to get notified when new guides are published.</p>
            </div>
            <Link to="/newsletter" style={{ background: 'var(--color-sun)', color: '#fff', padding: '0.72rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
              Subscribe →
            </Link>
          </div>

          {/* Nav */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', border: '1px solid var(--color-rule)', padding: '0.6rem 1.3rem', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}>
              ← Back to all guides
            </Link>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-paper-2)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', padding: '0.6rem 1.3rem', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}>
              🏠 Home
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
