import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Droplets, Leaf, Shield, ChevronDown, Calculator, Menu, X } from 'lucide-react'

const CATEGORIES = [
  {
    key: 'solar',
    label: 'Solar',
    Icon: Sun,
    color: '#d4721a',
    bg: '#fff8f0',
    links: [
      { to: '/tools/solar-calculator',      label: 'Solar Calculator',      desc: 'Free system sizing tool' },
      { to: '/posts/solar-3-bedroom-house', label: 'Solar System Guides',   desc: 'Full setup walkthroughs' },
      { to: '/posts/how-many-solar-panels', label: 'How Many Panels?',      desc: 'Calculate your needs' },
      { to: '/posts/lithium-vs-lead-acid',  label: 'Battery Comparisons',   desc: 'LiFePO4 vs lead-acid' },
      { to: '/posts/solar-panels-price-kenya', label: 'Solar Prices Kenya', desc: 'Current market rates' },
    ],
  },
  {
    key: 'water',
    label: 'Water',
    Icon: Droplets,
    color: '#1d5c7a',
    bg: '#eef6fb',
    links: [
      { to: '/posts/rainwater-harvesting-kenya', label: 'Rainwater Harvesting', desc: 'Collection and storage' },
      { to: '/posts/best-water-tanks-kenya',     label: 'Water Tank Guide',     desc: 'Brands and sizing' },
      { to: '/tools/water-tank-calculator',      label: 'Tank Size Calculator', desc: 'Find your ideal size' },
    ],
  },
  {
    key: 'food',
    label: 'Food',
    Icon: Leaf,
    color: '#2d6a2d',
    bg: '#f0f8f0',
    links: [
      { to: '/posts/backyard-farming', label: 'Backyard Farming', desc: 'Coming soon' },
      { to: '/posts/greenhouse-kenya', label: 'Greenhouses',      desc: 'Coming soon' },
      { to: '/posts/chicken-farming',  label: 'Chicken Farming',  desc: 'Coming soon' },
    ],
  },
  {
    key: 'security',
    label: 'Security',
    Icon: Shield,
    color: '#7c3aed',
    bg: '#f5f0ff',
    links: [
      { to: '/posts/solar-security-cameras', label: 'Solar Security Cameras', desc: 'Coming soon' },
      { to: '/posts/backup-power-systems',   label: 'Backup Power',           desc: 'Coming soon' },
      { to: '/posts/blackout-survival',      label: 'Blackout Survival Tips', desc: 'Coming soon' },
    ],
  },
]

// ── Animation variants ─────────────────────────────────────────────────────────
const megaMenuVariants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' } },
}

const mobileMenuVariants = {
  hidden:  { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, x: '100%', transition: { duration: 0.22, ease: 'easeIn' } },
}

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

const mobileItemVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.22, ease: 'easeOut' } }),
}

const accordionVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, height: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [activeMenu,     setActiveMenu]     = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const location = useLocation()
  const navRef   = useRef(null)

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close on route change
  useEffect(() => { setMobileOpen(false); setActiveMenu(null); setMobileExpanded(null) }, [location])

  // Close mega menu when clicking outside
  useEffect(() => {
    const fn = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setActiveMenu(null) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Topbar */}
      <div style={{ background: 'var(--color-ink)', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 5%' }}>
        <span>Kenya's Free Off-Grid Resource — Solar · Water · Food · Security</span>
        <div className="hide-mobile" style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/about"   style={{ color: 'rgba(255,255,255,0.4)' }}>About</Link>
          <Link to="/contact" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link>
        </div>
      </div>

      {/* Main nav */}
      <nav ref={navRef} style={{ position: 'sticky', top: 0, zIndex: 999, background: 'var(--color-paper)', borderBottom: '2px solid var(--color-ink)', boxShadow: scrolled ? '0 6px 30px rgba(26,18,8,0.1)' : 'none', transition: 'box-shadow 0.3s' }}>
        <div style={{ padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', gap: '2px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px', color: 'var(--color-ink)', lineHeight: 1 }}>
              OFFGRID<em style={{ color: 'var(--color-sun)', fontStyle: 'normal' }}>.KE</em>
            </span>
            <span style={{ fontSize: '0.61rem', color: 'var(--color-muted)', fontWeight: 500, letterSpacing: '0.2px', lineHeight: 1 }}>Your Guide To Independent Living</span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            {CATEGORIES.map(cat => {
              const isOpen = activeMenu === cat.key
              return (
                <button key={cat.key}
                  onMouseEnter={() => setActiveMenu(cat.key)}
                  onClick={() => setActiveMenu(isOpen ? null : cat.key)}
                  style={{ background: isOpen ? cat.bg : 'none', border: 'none', padding: '0.42rem 0.85rem', borderRadius: '7px', fontSize: '0.8rem', fontWeight: 600, color: isOpen ? cat.color : 'var(--color-ink-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.18s' }}>
                  <cat.Icon size={15} strokeWidth={2.5} />
                  {cat.label}
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={12} strokeWidth={2.5} style={{ opacity: 0.5 }} />
                  </motion.div>
                </button>
              )
            })}
            <div style={{ width: '1px', height: '20px', background: 'var(--color-rule)', margin: '0 0.6rem' }} />
            <Link to="/tools/solar-calculator" style={{ background: 'var(--color-sun)', color: '#fff', padding: '0.42rem 0.95rem', borderRadius: '7px', fontSize: '0.79rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calculator size={14} strokeWidth={2.5} /> Calculator
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="hide-desktop"
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', cursor: 'pointer', color: 'var(--color-ink)', borderRadius: '8px' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}>
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Desktop mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              variants={megaMenuVariants}
              initial="hidden" animate="visible" exit="exit"
              onMouseLeave={() => setActiveMenu(null)}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderBottom: '2px solid var(--color-ink)', boxShadow: '0 20px 50px rgba(26,18,8,0.12)', zIndex: 998, padding: '2rem 5%' }}>
              {CATEGORIES.filter(c => c.key === activeMenu).map(cat => (
                <div key={cat.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: cat.color, marginBottom: '1rem' }}>
                    <cat.Icon size={14} strokeWidth={2.5} /> {cat.label} — Guides and Tools
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.5rem' }}>
                    {cat.links.map((link, i) => (
                      <motion.div key={link.to} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.16 }}>
                        <Link to={link.to} style={{ padding: '0.7rem 0.9rem', borderRadius: '8px', background: cat.bg, display: 'block', transition: 'filter 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
                          onMouseLeave={e => e.currentTarget.style.filter = ''}>
                          <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-ink)', marginBottom: '0.15rem' }}>{link.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{link.desc}</div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile overlay + slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,18,8,0.55)', zIndex: 1000, backdropFilter: 'blur(2px)' }}
            />

            {/* Slide-in panel */}
            <motion.div
              key="panel"
              variants={mobileMenuVariants}
              initial="hidden" animate="visible" exit="exit"
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px, 88vw)', background: 'var(--color-paper)', zIndex: 1001, display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(26,18,8,0.18)' }}>

              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem', borderBottom: '1px solid var(--color-rule)', flexShrink: 0 }}>
                <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--color-ink)' }}>
                  OFFGRID<em style={{ color: 'var(--color-sun)', fontStyle: 'normal' }}>.KE</em>
                </Link>
                <button onClick={() => setMobileOpen(false)}
                  style={{ background: 'var(--color-paper-2)', border: 'none', borderRadius: '8px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-ink)' }}>
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Calculator CTA */}
              <motion.div custom={0} variants={mobileItemVariants} initial="hidden" animate="visible"
                style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--color-rule)' }}>
                <Link to="/tools/solar-calculator" onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-sun)', color: '#fff', padding: '0.85rem 1.1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                  <Calculator size={17} strokeWidth={2.5} /> Solar Calculator — Free Tool
                </Link>
              </motion.div>

              {/* Category accordions */}
              <div style={{ padding: '0.5rem 0', flex: 1 }}>
                {CATEGORIES.map((cat, catIdx) => (
                  <motion.div key={cat.key} custom={catIdx + 1} variants={mobileItemVariants} initial="hidden" animate="visible">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === cat.key ? null : cat.key)}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-ink)', padding: '0.9rem 1.4rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rule)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <span style={{ width: 30, height: 30, borderRadius: 7, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <cat.Icon size={15} strokeWidth={2.5} color={cat.color} />
                        </span>
                        {cat.label}
                      </span>
                      <motion.div animate={{ rotate: mobileExpanded === cat.key ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} strokeWidth={2.5} style={{ color: 'var(--color-muted)' }} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileExpanded === cat.key && (
                        <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit"
                          style={{ overflow: 'hidden', background: cat.bg }}>
                          {cat.links.map(link => (
                            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                              style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1.4rem 0.75rem 2.8rem', borderBottom: `1px solid ${cat.bg === '#fff8f0' ? '#f5e8d4' : cat.bg === '#eef6fb' ? '#d4eaf5' : cat.bg === '#f0f8f0' ? '#d5ecd5' : '#e5dcf5'}`, textDecoration: 'none' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-ink)' }}>{link.label}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '1px' }}>{link.desc}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Footer links */}
              <motion.div custom={CATEGORIES.length + 1} variants={mobileItemVariants} initial="hidden" animate="visible"
                style={{ padding: '1rem 1.4rem', borderTop: '1px solid var(--color-rule)', display: 'flex', gap: '1rem', flexShrink: 0 }}>
                {[['About', '/about'], ['Contact', '/contact'], ['All Guides', '/posts']].map(([label, to]) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                    style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-ink-2)', textDecoration: 'none' }}>
                    {label}
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
      `}</style>
    </>
  )
}
