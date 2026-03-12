import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800, color: 'var(--color-rule)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink)', margin: '1rem 0 0.5rem' }}>Page not found</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ background: 'var(--color-ink)', color: '#fff', padding: '0.75rem 1.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
        ← Go home
      </Link>
    </div>
  )
}
