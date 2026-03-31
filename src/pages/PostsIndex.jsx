import { useState, useMemo } from 'react'
import { getAllPosts } from '../data/posts'
import PostCard from '../components/PostCard'
import SEOHead from '../components/SEOHead'
import { Search, X } from 'lucide-react'

export default function PostsIndex() {
  const posts      = getAllPosts()
  const [query, setQuery]   = useState('')
  const [activeTag, setTag] = useState('all')

  const tags = ['all', ...Array.from(new Set(posts.map(p => p.tagColor)))]
  const tagLabels = { all: 'All', solar: '☀️ Solar', water: '💧 Water', how: '📋 How-To', security: '🔒 Security' }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return posts.filter(p => {
      const matchesTag   = activeTag === 'all' || p.tagColor === activeTag
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
      return matchesTag && matchesQuery
    })
  }, [posts, query, activeTag])

  const solar    = filtered.filter(p => p.tagColor === 'solar')
  const water    = filtered.filter(p => p.tagColor === 'water')
  const other    = filtered.filter(p => p.tagColor !== 'solar' && p.tagColor !== 'water')
  const showFlat = query.trim().length > 0 || activeTag !== 'all'

  const Section = ({ emoji, title, items }) => items.length === 0 ? null : (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '2px solid var(--color-ink)', paddingBottom: '0.6rem', marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>{emoji} {title}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.8rem' }}>
        {items.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '3.5rem 5%', maxWidth: '1280px', margin: '0 auto' }}>
      <SEOHead
        title="All Guides — Solar, Water & Security for Kenya"
        description="Browse all free off-grid guides for Kenya: solar system sizing, water tanks, rainwater harvesting, battery comparisons, and more. Real KSh prices."
        canonical="/posts"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Guides', url: '/posts' }]}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-sun)', display: 'block', marginBottom: '0.75rem' }}>Knowledge Base</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '1rem' }}>
          All Guides
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '500px', marginBottom: '1.5rem' }}>
          Free, Kenya-specific guides on solar, water, and security — with real local prices.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: 220, maxWidth: 380 }}>
            <Search size={15} strokeWidth={2.5} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search guides..."
              style={{ width: '100%', padding: '0.6rem 2.2rem 0.6rem 2.2rem', border: '1.5px solid var(--color-rule)', borderRadius: '8px', fontSize: '0.88rem', background: '#fff', color: 'var(--color-ink)', outline: 'none', boxSizing: 'border-box' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', padding: 0 }}>
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Tag filter pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {tags.map(t => (
              <button key={t} onClick={() => setTag(t)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, border: `1.5px solid ${activeTag === t ? 'var(--color-ink)' : 'var(--color-rule)'}`, background: activeTag === t ? 'var(--color-ink)' : '#fff', color: activeTag === t ? '#fff' : 'var(--color-ink-2)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {tagLabels[t] || t}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {(query || activeTag !== 'all') && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.75rem' }}>
            {filtered.length === 0 ? 'No guides found' : `${filtered.length} guide${filtered.length !== 1 ? 's' : ''} found`}
            {query && <span> for "<strong style={{ color: 'var(--color-ink)' }}>{query}</strong>"</span>}
          </p>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No guides match your search.</p>
          <button onClick={() => { setQuery(''); setTag('all') }} style={{ background: 'none', border: 'none', color: 'var(--color-sky)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Flat results when searching */}
      {showFlat && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.8rem' }}>
          {filtered.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
        </div>
      )}

      {/* Sectioned results when browsing */}
      {!showFlat && (
        <>
          <Section emoji="☀️" title="Solar Guides"  items={solar} />
          <Section emoji="💧" title="Water Guides"  items={water} />
          <Section emoji="📋" title="How-To Guides" items={other} />
        </>
      )}
    </div>
  )
}
