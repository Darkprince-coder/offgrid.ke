import { Link } from 'react-router-dom'
import styles from '../styles/Footer.module.css'

const GUIDE_LINKS = [
  ['/posts/how-many-solar-panels',  'How many solar panels?'],
  ['/posts/solar-3-bedroom-house',  'Solar for a 3-bedroom house'],
  ['/posts/best-water-tanks-kenya', 'Best water tanks in Kenya'],
  ['/posts',                        'All guides →'],
]

const TOOL_LINKS = [
  ['/tools/solar-calculator',        'Solar Calculator'],
  ['/tools/cost-comparison',         'Cost Comparison'],
  ['/tools/water-tank-calculator',   'Water Tank Calculator'],
]

const ABOUT_LINKS = [
  ['/about',      'About Offgrid.ke'],
  ['/contact',    'Contact'],
  ['/newsletter', 'Newsletter'],
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* Brand */}
          <div>
            <Link to="/" className={styles.logoLink}>
              OFFGRID<em className={styles.logoAccent}>.KE</em>
            </Link>
            <p className={styles.tagline}>
              Kenya's free guide to off-grid living. Practical, honest, and always local.
            </p>
            <div className={styles.tags}>
              {['☀️ Solar', '💧 Water', '🔒 Security', '🇰🇪 Kenya'].map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div>
            <h5 className={styles.colTitle}>Guides</h5>
            <div className={styles.links}>
              {GUIDE_LINKS.map(([to, label]) => (
                <Link key={to} to={to} className={styles.link}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h5 className={styles.colTitle}>Tools</h5>
            <div className={styles.links}>
              {TOOL_LINKS.map(([to, label]) => (
                <Link key={to} to={to} className={styles.link}>{label}</Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h5 className={styles.colTitle}>About</h5>
            <div className={styles.links}>
              {ABOUT_LINKS.map(([to, label]) => (
                <Link key={to} to={to} className={styles.link}>{label}</Link>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Offgrid.ke — All rights reserved.</span>
          <span>Made for Kenya 🇰🇪</span>
        </div>
      </div>
    </footer>
  )
}
