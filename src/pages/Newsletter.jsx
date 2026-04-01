import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Sun, Droplets, Shield, Leaf } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { FORMSPREE_URL } from '../data/constants'
import styles from '../styles/Newsletter.module.css'

const TOPICS = [
  { Icon: Sun,      color: 'var(--color-sun)', label: 'Solar guides',       desc: 'Panel prices, system sizing, inverter reviews' },
  { Icon: Droplets, color: 'var(--color-sky)', label: 'Water guides',       desc: 'Tank sizing, rainwater, boreholes' },
  { Icon: Shield,   color: '#7c3aed',           label: 'Security guides',   desc: 'Solar cameras, backup power, blackout prep' },
  { Icon: Leaf,     color: '#2d6a2d',           label: 'Food & farming',    desc: 'Backyard farming, greenhouses, food storage' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }),
}

export default function Newsletter() {
  const [email,   setEmail]   = useState('')
  const [name,    setName]    = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({
          email,
          name,
          _subject: `New newsletter signup: ${name || email}`,
          source: 'newsletter-page',
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <SEOHead
        title="OFFGRID.KE Newsletter — Off-Grid Tips for Kenya"
        description="Sign up for free guides, real local prices, and practical advice on solar, water, and security for Kenya. No spam, unsubscribe any time."
        canonical="/newsletter"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Newsletter', url: '/newsletter' }]}
      />

      <div className={styles.hero}>
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <span className={styles.eyebrow}>Free Newsletter</span>
          <h1 className={styles.title}>
            Stay ahead of Kenya's<br />
            <em className={styles.accent}>off-grid revolution.</em>
          </h1>
          <p className={styles.subtitle}>
            New guides, real local prices, product reviews, and tool launches — straight to your inbox. No spam, no paid placements, unsubscribe any time.
          </p>
        </motion.div>

        {/* Signup form */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className={styles.formWrap}>
          {status === 'done' ? (
            <div className={styles.successBox}>
              <CheckCircle size={28} strokeWidth={2} color="#2d6a2d" />
              <div>
                <strong>You're in.</strong> We'll send you the next guide as soon as it's live.
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="nl-name" className={styles.label}>Your name</label>
                  <input
                    id="nl-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. James Kamau"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="nl-email" className={styles.label}>Email address *</label>
                  <input
                    id="nl-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={styles.input}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={styles.submitBtn}>
                <Mail size={16} strokeWidth={2.5} />
                {status === 'loading' ? 'Subscribing...' : 'Subscribe — it\'s free'}
              </button>
              {status === 'error' && (
                <p className={styles.errorMsg}>Something went wrong. Please try again or email us directly.</p>
              )}
              <p className={styles.disclaimer}>No spam. Unsubscribe any time. Kenya-specific content only.</p>
            </form>
          )}
        </motion.div>
      </div>

      {/* What you'll get */}
      <div className={styles.topicsSection}>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.topicsTitle}>
          What you'll receive
        </motion.h2>
        <div className={styles.topicsGrid}>
          {TOPICS.map((t, i) => (
            <motion.div key={t.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.topicCard}>
              <div className={styles.topicIcon} style={{ background: t.color + '18' }}>
                <t.Icon size={20} strokeWidth={2.5} color={t.color} />
              </div>
              <div className={styles.topicLabel}>{t.label}</div>
              <div className={styles.topicDesc}>{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.proofBar}>
        <div className={styles.proofItem}>
          <span className={styles.proofNum}>Free</span>
          <span className={styles.proofLabel}>Always, no paywall</span>
        </div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}>
          <span className={styles.proofNum}>🇰🇪</span>
          <span className={styles.proofLabel}>Kenya-specific only</span>
        </div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}>
          <span className={styles.proofNum}>0</span>
          <span className={styles.proofLabel}>Sponsored content</span>
        </div>
      </motion.div>

      <div className={styles.backLink}>
        <Link to="/">← Back to home</Link>
      </div>
    </div>
  )
}
