import { Suspense, lazy, Component } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ReadingProgress from './components/ReadingProgress'

// ── Eagerly loaded ─────────────────────────────────────────────────────────────
import Home     from './pages/Home'
import NotFound from './pages/NotFound'

// ── Lazy loaded ────────────────────────────────────────────────────────────────
// IMPORTANT: Only import files that actually exist in your project.
// If you get a "Cannot find module" error, that file hasn't been created yet.
const PostsIndex      = lazy(() => import('./pages/PostsIndex'))
const Post            = lazy(() => import('./pages/Post'))
const About           = lazy(() => import('./pages/About'))
const Contact         = lazy(() => import('./pages/Contact'))
const Newsletter      = lazy(() => import('./pages/Newsletter'))
const Tools           = lazy(() => import('./pages/Tools'))
const SolarCalculator = lazy(() => import('./pages/tools/SolarCalculator'))
const CostComparison  = lazy(() => import('./pages/tools/CostComparison'))
const WaterTankCalc   = lazy(() => import('./pages/tools/WaterTankCalculator'))

// ── Page transition variants ───────────────────────────────────────────────────
const pageVariants = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
}

// ── Skeleton shown while lazy chunks load ──────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 5%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {[60, 40, 120].map((w, i) => (
          <div key={i} style={{ height: 12, width: w, borderRadius: 6, background: 'var(--color-rule)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <div style={{ height: 40, width: '65%', borderRadius: 8, background: 'var(--color-rule)', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 40, width: '45%', borderRadius: 8, background: 'var(--color-rule)', marginBottom: '2.5rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
      {[100, 88, 75, 92, 60, 95, 80, 70].map((w, i) => (
        <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 6, background: 'var(--color-rule)', marginBottom: '0.8rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.04}s` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>
    </div>
  )
}

// ── Error boundary ─────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('Page error:', error, info) }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--color-rule)' }}>!</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', margin: '1rem 0 0.5rem' }}>Something went wrong</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: 400 }}>Try refreshing — if the problem persists, contact us.</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            style={{ background: 'var(--color-ink)', color: '#fff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
            Refresh page
          </button>
          <a href="/" style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            Go home
          </a>
        </div>
      </div>
    )
    return this.props.children
  }
}

// ── Animated routes ────────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/"                            element={<Home />} />
            <Route path="/posts"                       element={<PostsIndex />} />
            <Route path="/posts/:slug"                 element={<Post />} />
            <Route path="/about"                       element={<About />} />
            <Route path="/contact"                     element={<Contact />} />
            <Route path="/newsletter"                  element={<Newsletter />} />
            <Route path="/tools"                       element={<Tools />} />
            <Route path="/tools/solar-calculator"      element={<SolarCalculator />} />
            <Route path="/tools/cost-comparison"       element={<CostComparison />} />
            <Route path="/tools/water-tank-calculator" element={<WaterTankCalc />} />
            <Route path="*"                            element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ReadingProgress />
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
