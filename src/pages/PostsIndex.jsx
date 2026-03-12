import { getAllPosts } from '../data/posts'
import PostCard from '../components/PostCard'

export default function PostsIndex() {
  const posts  = getAllPosts()
  const solar  = posts.filter(p => p.tagColor === 'solar')
  const water  = posts.filter(p => p.tagColor === 'water')
  const other  = posts.filter(p => p.tagColor !== 'solar' && p.tagColor !== 'water')

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
      <div style={{ marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-sun)', display: 'block', marginBottom: '0.75rem' }}>Knowledge Base</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '1rem' }}>All Guides</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '500px' }}>
          Free, Kenya-specific guides on solar, water, and security — with real local prices.
        </p>
      </div>
      <Section emoji="☀️" title="Solar Guides"  items={solar} />
      <Section emoji="💧" title="Water Guides"  items={water} />
      <Section emoji="📋" title="How-To Guides" items={other} />
    </div>
  )
}
