import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', color: 'rgba(255,255,255,0.55)', padding: '4rem 5% 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          <div>
            <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px', display: 'block', marginBottom: '1rem' }}>
              OFFGRID<em style={{ color: 'var(--color-sun)', fontStyle: 'normal' }}>.KE</em>
            </Link>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.7, maxWidth: '250px' }}>
              Kenya&apos;s free guide to off-grid living. Practical, honest, and always local.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
              {['☀️ Solar', '💧 Water', '🔒 Security', '🇰🇪 Kenya'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Guides</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                ['/posts/how-many-solar-panels',  'How many solar panels?'],
                ['/posts/solar-3-bedroom-house',  'Solar for a 3-bedroom house'],
                ['/posts/best-water-tanks-kenya', 'Best water tanks in Kenya'],
                ['/posts',                        'All guides →'],
              ].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.87rem' }}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Tools</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Solar Calculator', 'Cost Comparison', 'Vendor Directory'].map(t => (
                <Link key={t} to="/#tools" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.87rem' }}>{t}</Link>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>About</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['About Offgrid.ke', '/about'], ['Newsletter', '/newsletter'], ['Contact', '/contact']].map(([label, to]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.87rem' }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '1.8rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.76rem', color: 'rgba(255,255,255,0.22)' }}>
          <span>© {new Date().getFullYear()} Offgrid.ke — All rights reserved.</span>
          <span>Made for Kenya 🇰🇪</span>
        </div>
      </div>
    </footer>
  )
}
