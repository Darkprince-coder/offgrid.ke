import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calculator, BarChart2, Droplets, MapPin, ArrowRight, Clock } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import styles from '../styles/Tools.module.css'

const LIVE_TOOLS = [
  {
    to:      '/tools/solar-calculator',
    Icon:    Calculator,
    color:   'var(--color-sun)',
    bg:      '#fff3e0',
    badge:   'Live',
    badgeBg: '#fff3e0',
    badgeColor: 'var(--color-sun)',
    title:   'Solar System Calculator',
    desc:    'Enter your appliances and county. Get a complete panel, battery, and inverter recommendation with real Kenyan prices. Download your estimate as a branded PDF.',
    cta:     'Use calculator',
    stats:   ['Covers all 10 counties', 'PDF download', 'Shareable results'],
  },
  {
    to:      '/tools/cost-comparison',
    Icon:    BarChart2,
    color:   'var(--color-sky)',
    bg:      '#eef6fb',
    badge:   'Live',
    badgeBg: '#eef6fb',
    badgeColor: 'var(--color-sky)',
    title:   'Grid vs Solar vs Generator',
    desc:    'Compare the real 10 to 25-year cost of KPLC, solar, and generator for your home size. See exact payback periods and KSh savings at a glance.',
    cta:     'Compare costs',
    stats:   ['25-year projections', 'Real KSh figures', 'Inflation-adjusted'],
  },
  {
    to:      '/tools/water-tank-calculator',
    Icon:    Droplets,
    color:   'var(--color-sky)',
    bg:      '#eef6fb',
    badge:   'Live',
    badgeBg: '#eef6fb',
    badgeColor: 'var(--color-sky)',
    title:   'Water Tank Size Calculator',
    desc:    'Find the right tank capacity for your household and water supply situation. Compare prices from Kentank, Roto, Toptank, and Techno Tanks side by side.',
    cta:     'Calculate tank size',
    stats:   ['4 supply types', 'Brand comparison', 'Live KSh pricing'],
  },
]

const COMING_SOON = [
  {
    Icon:  MapPin,
    color: '#7c3aed',
    bg:    '#f5f0ff',
    title: 'Installer Directory',
    desc:  'Find vetted solar, water, and security installers near you with verified reviews from real Kenyan homeowners.',
  },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } }),
}

export default function Tools() {
  return (
    <div className={styles.page}>
      <SEOHead
        title="Free Off-Grid Tools for Kenya — Solar Calculator, Cost Comparison, Tank Sizing"
        description="Free Kenya-specific tools for going off-grid. Size your solar system, compare grid vs solar costs, and calculate the right water tank capacity — all with real KSh prices."
        canonical="/tools"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }]}
      />

      {/* Header */}
      <div className={styles.header}>
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <span className={styles.eyebrow}>Free Tools</span>
          <h1 className={styles.title}>
            Kenya's off-grid toolkit.
          </h1>
          <p className={styles.subtitle}>
            Every tool on this page is free, requires no sign-up, and uses real Kenyan prices. Built specifically for homeowners, farmers, and small businesses in Kenya.
          </p>
        </motion.div>
      </div>

      {/* Live tools */}
      <div className={styles.toolsGrid}>
        {LIVE_TOOLS.map((tool, i) => (
          <motion.div key={tool.to} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <Link to={tool.to} className={styles.toolCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap} style={{ background: tool.bg }}>
                  <tool.Icon size={24} strokeWidth={2.5} color={tool.color} />
                </div>
                <span className={styles.badge} style={{ background: tool.badgeBg, color: tool.badgeColor }}>
                  {tool.badge}
                </span>
              </div>

              <h2 className={styles.cardTitle}>{tool.title}</h2>
              <p className={styles.cardDesc}>{tool.desc}</p>

              <div className={styles.statsList}>
                {tool.stats.map(s => (
                  <span key={s} className={styles.stat}>✓ {s}</span>
                ))}
              </div>

              <div className={styles.cardCta} style={{ color: tool.color }}>
                {tool.cta} <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Coming soon */}
      <div className={styles.comingSoonSection}>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.comingSoonTitle}>
          Coming soon
        </motion.h2>
        <div className={styles.comingSoonGrid}>
          {COMING_SOON.map((tool, i) => (
            <motion.div key={tool.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.comingSoonCard}>
              <div className={styles.comingSoonIcon} style={{ background: tool.bg }}>
                <tool.Icon size={20} strokeWidth={2.5} color={tool.color} />
              </div>
              <div>
                <div className={styles.comingSoonLabel}>
                  {tool.title}
                  <span className={styles.soonBadge}><Clock size={10} strokeWidth={2.5} /> Coming soon</span>
                </div>
                <div className={styles.comingSoonDesc}>{tool.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggest a tool CTA */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.suggestCta}>
        <div>
          <strong>Missing a tool you need?</strong>
          <p>Tell us what would help you most and we'll build it.</p>
        </div>
        <Link to="/contact" className={styles.suggestBtn}>Suggest a tool →</Link>
      </motion.div>
    </div>
  )
}
