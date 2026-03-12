import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
      { to: '/posts/solar-prices-kenya',    label: 'Solar Prices in Kenya', desc: 'Current market rates' },
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
      { to: '/tools/water-tank-calculator',      label: 'Tank Size Calculator', desc: 'Coming soon' },
      { to: '/posts/borehole-kenya',             label: 'Borehole Information', desc: 'Coming soon' },
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
      { to: '/posts/food-storage',     label: 'Food Storage',     desc: 'Coming soon' },
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
      { to: '/posts/emergency-preparedness', label: 'Emergency Preparedness', desc: 'Coming soon' },
      { to: '/posts/blackout-survival',      label: 'Blackout Survival Tips', desc: 'Coming soon' },
    ],
  },
]

export default function Navbar() {
  const [scrolled,        setScrolled]        = useState(false)
  const [mobileOpen,      setMobileOpen]      = useState(false)
  const [activeMenu,      setActiveMenu]      = useState(null)
  const [mobileExpanded,  setMobileExpanded]  = useState(null)
  const location = useLocation()
  const navRef   = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setActiveMenu(null) }, [location])

  useEffect(() => {
    const fn = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setActiveMenu(null) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <>
      {/* Topbar */}
      <div style={{ background:'var(--color-ink)', color:'rgba(255,255,255,0.4)', fontSize:'0.68rem', letterSpacing:'0.8px', textTransform:'uppercase', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.45rem 5%' }}>
        <span>Kenya's Free Off-Grid Resource — Solar · Water · Food · Security</span>
        <div className="hide-mobile" style={{ display:'flex', gap:'1.5rem' }}>
          <Link to="/about"   style={{ color:'rgba(255,255,255,0.4)' }}>About</Link>
          <Link to="/contact" style={{ color:'rgba(255,255,255,0.4)' }}>Contact</Link>
        </div>
      </div>

      {/* Main nav */}
      <nav ref={navRef} style={{ position:'sticky', top:0, zIndex:999, background:'var(--color-paper)', borderBottom:'2px solid var(--color-ink)', transition:'box-shadow 0.3s', boxShadow: scrolled ? '0 6px 30px rgba(26,18,8,0.1)' : 'none' }}>
        <div style={{ padding:'0 5%', display:'flex', alignItems:'center', justifyContent:'space-between', height:'68px' }}>

          {/* Logo + tagline */}
          <Link to="/" style={{ display:'flex', flexDirection:'column', gap:'2px', textDecoration:'none' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, letterSpacing:'-1px', color:'var(--color-ink)', lineHeight:1 }}>
              OFFGRID<em style={{ color:'var(--color-sun)', fontStyle:'normal' }}>.KE</em>
            </span>
            <span style={{ fontSize:'0.61rem', color:'var(--color-muted)', fontWeight:500, letterSpacing:'0.2px', lineHeight:1 }}>Your Guide To Independent Living</span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:'0.15rem' }}>
            {CATEGORIES.map(cat => {
              const isOpen = activeMenu === cat.key
              return (
                <button key={cat.key}
                  onMouseEnter={() => setActiveMenu(cat.key)}
                  onClick={() => setActiveMenu(isOpen ? null : cat.key)}
                  style={{ background: isOpen ? cat.bg : 'none', border:'none', padding:'0.42rem 0.85rem', borderRadius:'7px', fontSize:'0.8rem', fontWeight:600, color: isOpen ? cat.color : 'var(--color-ink-2)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', transition:'all 0.18s' }}>
                  <cat.Icon size={15} strokeWidth={2.5} />
                  {cat.label}
                  <ChevronDown size={12} strokeWidth={2.5} style={{ opacity:0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
                </button>
              )
            })}
            <div style={{ width:'1px', height:'20px', background:'var(--color-rule)', margin:'0 0.6rem' }} />
            <Link to="/tools/solar-calculator" style={{ background:'var(--color-sun)', color:'#fff', padding:'0.42rem 0.95rem', borderRadius:'7px', fontSize:'0.79rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <Calculator size={14} strokeWidth={2.5} /> Calculator
            </Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} className="hide-desktop"
            style={{ background:'none', border:'none', display:'flex', alignItems:'center', justifyContent:'center', padding:'6px', cursor:'pointer', color:'var(--color-ink)' }} aria-label="Menu">
            {mobileOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Mega-menu */}
        {activeMenu && (
          <div onMouseLeave={() => setActiveMenu(null)}
            style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', borderBottom:'2px solid var(--color-ink)', boxShadow:'0 20px 50px rgba(26,18,8,0.12)', zIndex:998, padding:'2rem 5%', animation:'fadeDown 0.18s ease' }}>
            {CATEGORIES.filter(c => c.key === activeMenu).map(cat => (
              <div key={cat.key}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:cat.color, marginBottom:'1rem' }}>
                  <cat.Icon size={14} strokeWidth={2.5} /> {cat.label} — Guides and Tools
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))', gap:'0.5rem' }}>
                  {cat.links.map(link => (
                    <Link key={link.to} to={link.to} style={{ padding:'0.7rem 0.9rem', borderRadius:'8px', background:cat.bg, display:'block' }}>
                      <div style={{ fontWeight:600, fontSize:'0.86rem', color:'var(--color-ink)', marginBottom:'0.15rem' }}>{link.label}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--color-muted)' }}>{link.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background:'var(--color-paper)', borderBottom:'2px solid var(--color-ink)', padding:'1rem 5%', position:'sticky', top:'68px', zIndex:997, maxHeight:'75vh', overflowY:'auto' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ borderBottom:'1px solid var(--color-rule)', marginBottom:'0.3rem' }}>
              <button onClick={() => setMobileExpanded(mobileExpanded === cat.key ? null : cat.key)}
                style={{ background:'none', border:'none', width:'100%', textAlign:'left', fontWeight:700, fontSize:'0.9rem', color:'var(--color-ink)', padding:'0.65rem 0', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <cat.Icon size={16} strokeWidth={2.5} color={cat.color} /> {cat.label}
                </span>
                <ChevronDown size={14} strokeWidth={2.5} style={{ opacity:0.4, transform: mobileExpanded === cat.key ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
              </button>
              {mobileExpanded === cat.key && (
                <div style={{ paddingLeft:'1.6rem', paddingBottom:'0.6rem', display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                  {cat.links.map(l => <Link key={l.to} to={l.to} style={{ fontSize:'0.86rem', color:'var(--color-ink-2)', padding:'0.2rem 0' }}>{l.label}</Link>)}
                </div>
              )}
            </div>
          ))}
          <div style={{ paddingTop:'0.8rem', display:'flex', flexDirection:'column', gap:'0.7rem' }}>
            <Link to="/tools/solar-calculator" style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:700, color:'var(--color-sun)', fontSize:'0.9rem' }}>
              <Calculator size={16} strokeWidth={2.5} /> Solar Calculator
            </Link>
            <Link to="/about"   style={{ fontSize:'0.88rem', color:'var(--color-ink-2)' }}>About</Link>
            <Link to="/contact" style={{ fontSize:'0.88rem', color:'var(--color-ink-2)' }}>Contact</Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
      `}</style>
    </>
  )
}
