import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../data/posts'

// Real topic images from Unsplash (free, no API key needed)
const topicImages = {
  solar: [
    '/images/lead-lithium.jpg', 
    '/images/3-bedroom-solar.jpg', 
    '/images/how-many-solars.jpg',
  ],
  water: [
    '/images/rainwater-harvesting.jpg', // water tank
    '/images/water-tanks.jpg', // clean water
  ],
  security: [
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80', // security camera
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80', // gate/fence
  ],
  how: [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', // tools/workshop
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', // construction
  ],
}

// Fallback gradients if image fails to load
const fallbackGradients = {
  solar:    'linear-gradient(135deg,#1a2e1a,#2c5f2e,#d4721a)',
  water:    'linear-gradient(135deg,#0d2535,#1d5c7a,#0e4a5e)',
  security: 'linear-gradient(135deg,#1a0d00,#3d1515,#7a2222)',
  how:      'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
}

const tagClass = { solar: 'tag-solar', water: 'tag-water', how: 'tag-how', security: 'tag-security' }

export default function PostCard({ post, index = 0 }) {
  const [hovered, setHovered]   = useState(false)
  const [imgError, setImgError] = useState(false)

  const images  = topicImages[post.tagColor] || topicImages.how
  const imgUrl  = post.image || images[index % images.length]
  const fallback = fallbackGradients[post.tagColor] || fallbackGradients.how

  return (
    <Link
      to={`/posts/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff',
        border: '1px solid var(--color-rule)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        textDecoration: 'none', color: 'inherit',
        transition: 'transform var(--transition), box-shadow var(--transition)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-card)' : 'none',
      }}
    >
      {/* Image strip */}
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: fallback }}>
        {!imgError && (
          <img
            src={imgUrl}
            alt={post.tag}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        )}
        {/* Dark overlay for text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
        {/* Tag badge bottom-left */}
        <span style={{ position: 'absolute', bottom: '1.1rem', left: '1.3rem', zIndex: 1, background: 'var(--color-sun)', color: '#fff', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '0.22rem 0.65rem', borderRadius: '5px' }}>
          {post.tag}
        </span>
        {/* Read time badge top-right */}
        <span style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.66rem', fontWeight: 600, padding: '0.22rem 0.6rem', borderRadius: '20px' }}>
          {post.readTime}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1.4rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span className={`tag ${tagClass[post.tagColor] || 'tag-how'}`} style={{ marginBottom: '0.65rem' }}>{post.tag}</span>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, color: hovered ? 'var(--color-sky)' : 'var(--color-ink)', marginBottom: '0.65rem', flex: 1, transition: 'color var(--transition)' }}>
          {post.title}
        </h3>

        {post.excerpt && (
          <p style={{ fontSize: '0.86rem', color: 'var(--color-muted)', lineHeight: 1.65, marginBottom: '1.1rem' }}>
            {post.excerpt}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.73rem', color: 'var(--color-muted)', paddingTop: '0.9rem', borderTop: '1px solid var(--color-rule)', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span>{post.tag}</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-rule)', display: 'inline-block' }} />
          <span>{post.readTime} read</span>
          {post.date && <>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-rule)', display: 'inline-block' }} />
            <span>{formatDate(post.date)}</span>
          </>}
        </div>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: hovered ? 'var(--color-sun)' : 'var(--color-ink)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.83rem', alignSelf: 'flex-start', transition: 'background var(--transition)' }}>
          Read Guide →
        </span>
      </div>
    </Link>
  )
}

