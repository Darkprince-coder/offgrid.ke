import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Droplets, Leaf, Shield, Battery, Home as HomeIcon, Sprout, Store, Calculator, BarChart2, MapPin, ArrowRight } from 'lucide-react'
import PostCard from '../components/PostCard'
import SEOHead from '../components/SEOHead'
import { getAllPosts } from '../data/posts'
import { FORMSPREE_URL } from '../data/constants'

// ── Max posts shown on homepage ───────────────────────────────────────────────
const HOME_POST_LIMIT = 6

// ── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ── Newsletter box ─────────────────────────────────────────────────────────────
function NewsletterBox() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async () => {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, _subject: 'New newsletter signup: ' + email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ padding: '2rem', background: 'var(--color-sky)' }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Get the Off-Grid Newsletter</h4>
      <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.72)', marginBottom: '1.1rem', lineHeight: 1.6 }}>New guides, local prices, and product reviews straight to your inbox.</p>
      {status === 'done' ? (
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '7px', padding: '0.7rem 1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>You are in. We will be in touch.</div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="your@email.com"
              style={{ flex: 1, padding: '0.55rem 0.8rem', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem', outline: 'none' }} />
            <button onClick={submit} disabled={status === 'loading'}
              style={{ background: 'var(--color-sun)', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </div>
          {status === 'error' && <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.4rem' }}>Something went wrong. Try again.</p>}
        </>
      )}
    </div>
  )
}

export default function Home() {
  const allPosts      = getAllPosts()
  const homepagePosts = allPosts.slice(0, HOME_POST_LIMIT)
  const hasMorePosts  = allPosts.length > HOME_POST_LIMIT

  return (
    <>
      <SEOHead
        title="Kenya's Free Off-Grid Guide — Solar, Water & Security"
        description="Free guides, real local prices, and practical advice for homeowners, farmers, and small businesses going off-grid in Kenya. Solar calculators, water tanks, security systems."
        canonical="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'OFFGRID.KE',
          url: 'https://offgrid.ke',
          description: "Kenya's free resource for off-grid solar, water, and security systems.",
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://offgrid.ke/posts?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--color-rule)', padding: '0 5%', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', borderLeft: '1px solid var(--color-rule)', borderRight: '1px solid var(--color-rule)' }} className="hero-grid">

          {/* Left */}
          <div style={{ borderRight: '1px solid var(--color-rule)', padding: '3.5rem 2.8rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,114,26,0.08), transparent 70%)', pointerEvents: 'none' }} />

            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} custom={0} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.6rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-sun)', whiteSpace: 'nowrap' }}>Kenya's Off-Grid Authority</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.8vw, 3.6rem)', fontWeight: 800, lineHeight: 1.07, letterSpacing: '-1.5px', color: 'var(--color-ink)', marginBottom: '1.2rem' }}>
                Everything you need to go{' '}
                <em style={{ color: 'var(--color-sun)', fontStyle: 'italic' }}>off-grid</em>{' '}
                in Kenya.
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '480px', marginBottom: '2rem' }}>
                Free guides, real local prices, and practical advice for homeowners, farmers, and small businesses making the switch to solar, water independence, and security systems.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'var(--color-ink)', color: '#fff', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                  Start Reading →
                </Link>
                <a href="#tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'transparent', color: 'var(--color-ink)', border: '1.5px solid var(--color-rule)', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                  Explore Tools
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-rule)', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { num: `${allPosts.length}`, label: 'Guides live now' },
                { num: 'Free',              label: 'Always free to read' },
                { num: '🇰🇪',              label: 'Kenya-specific content' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-sun)', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-muted)', marginTop: '0.3rem' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column' }} className="hero-sidebar">
            <div style={{ flex: 1, padding: '2rem', borderBottom: '1px solid var(--color-rule)', background: 'var(--color-paper-2)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.2rem' }}>Popular Guides</h3>
              {allPosts.slice(0, 4).map((post, i) => (
                <Link key={post.slug} to={`/posts/${post.slug}`} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: i < 3 ? '1px solid var(--color-rule)' : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-rule)', lineHeight: 1, minWidth: '28px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.3, marginBottom: '0.25rem' }}>{post.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>{post.tag} · {post.readTime} read</div>
                  </div>
                </Link>
              ))}
            </div>
            <NewsletterBox />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-sidebar { display: none !important; }
        }
      `}</style>

      {/* ── TOPICS BAND ───────────────────────────────────────── */}
      <div style={{ background: 'var(--color-ink)', padding: '2rem 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Browse</span>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { label: 'Solar Systems',     Icon: Sun,      to: '/tools/solar-calculator' },
              { label: 'Water & Boreholes', Icon: Droplets, to: '/posts/rainwater-harvesting-kenya' },
              { label: 'Security',          Icon: Shield,   to: '/posts' },
              { label: 'Batteries',         Icon: Battery,  to: '/posts/lithium-vs-lead-acid' },
              { label: 'Off-Grid Homes',    Icon: HomeIcon, to: '/posts' },
              { label: 'Farming',           Icon: Sprout,   to: '/posts' },
              { label: 'Small Business',    Icon: Store,    to: '/posts' },
            ].map(({ label, Icon: TopicIcon, to }) => (
              <Link key={label} to={to} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 500, padding: '0.35rem 0.85rem', borderRadius: '100px' }}>
                <TopicIcon size={13} strokeWidth={2.5} /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── LATEST GUIDES ─────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--color-rule)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5%' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '2px solid var(--color-ink)', paddingBottom: '0.65rem', marginBottom: '2.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Latest Guides</h2>
            <Link to="/posts" style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-sun)' }}>
              {hasMorePosts ? `View all ${allPosts.length} guides →` : 'View all guides →'}
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {homepagePosts.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
          </div>

          {/* Show more CTA if there are more posts than the limit */}
          {hasMorePosts && (
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-paper-2)', border: '1.5px solid var(--color-rule)', color: 'var(--color-ink)', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                See all {allPosts.length} guides <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── TOOLS ─────────────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--color-rule)' }} id="tools">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5%' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '2px solid var(--color-ink)', paddingBottom: '0.65rem', marginBottom: '2.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Free Tools</h2>
            <Link to="/newsletter" style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-sun)' }}>Get notified of new tools →</Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {/* Solar calculator */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0, duration: 0.4 }}>
              <Link to="/tools/solar-calculator" style={{ border: '2px solid var(--color-sun)', borderRadius: '12px', padding: '1.8rem', background: '#fff', position: 'relative', display: 'block', color: 'inherit' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: '#fff3e0', color: 'var(--color-sun)', padding: '0.18rem 0.55rem', borderRadius: '4px' }}>Live</span>
                <div style={{ width: '50px', height: '50px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#fff3e0' }}>
                  <Calculator size={24} strokeWidth={2.5} color="var(--color-sun)" />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.45rem' }}>Solar System Calculator</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.2rem' }}>Enter your appliances and county. Get an instant panel, battery, and inverter recommendation with current Kenyan prices.</p>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-sun)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Use the calculator <ArrowRight size={13} strokeWidth={2.5} /></span>
              </Link>
            </motion.div>

            {/* Cost comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }}>
              <Link to="/tools/cost-comparison" style={{ border: '2px solid var(--color-sky)', borderRadius: '12px', padding: '1.8rem', background: '#fff', position: 'relative', display: 'block', color: 'inherit' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: '#e0f0f8', color: 'var(--color-sky)', padding: '0.18rem 0.55rem', borderRadius: '4px' }}>Live</span>
                <div style={{ width: '50px', height: '50px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#e0f0f8' }}>
                  <BarChart2 size={24} strokeWidth={2.5} color="var(--color-sky)" />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.45rem' }}>Cost Comparison Tool</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.2rem' }}>Compare KPLC grid vs solar vs generator over 5 to 25 years. See payback period and real KSh savings.</p>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-sky)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Compare costs <ArrowRight size={13} strokeWidth={2.5} /></span>
              </Link>
            </motion.div>

            {/* Vendor directory — coming soon */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }}>
              <div style={{ border: '1.5px solid var(--color-rule)', borderRadius: '12px', padding: '1.8rem', background: '#fff', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--color-paper-2)', color: 'var(--color-muted)', padding: '0.18rem 0.55rem', borderRadius: '4px' }}>Coming Soon</span>
                <div style={{ width: '50px', height: '50px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#ece8f5' }}>
                  <MapPin size={24} strokeWidth={2.5} color="#7c3aed" />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.45rem' }}>Vendor Directory</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.2rem' }}>Find vetted solar, water, and security installers near you with verified reviews from real homeowners.</p>
                <Link to="/contact" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-sky)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Suggest an installer <ArrowRight size={13} strokeWidth={2.5} /></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ───────────────────────────────────────── */}
      <div style={{ background: 'var(--color-paper-2)', borderBottom: '1px solid var(--color-rule)', padding: '3rem 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
          {[
            { num: 'Free.',  title: 'Always free to read',    body: 'Every guide on Offgrid.ke is free. No paywalls, no sign-up required. Good information should be accessible to every Kenyan.' },
            { num: 'Local.', title: 'Kenya-specific, always', body: 'Our guides use real prices from Nairobi, Mombasa, and upcountry suppliers. Local brands, local climate data, local context.' },
            { num: 'Real.',  title: 'No sponsored fluff',     body: 'Recommendations based on research — not paid placements. If we mention a product, it is because we genuinely believe it is worth it.' },
          ].map((b, i) => (
            <motion.div key={b.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-sun)', lineHeight: 1, marginBottom: '0.4rem' }}>{b.num}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.45rem' }}>{b.title}</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
