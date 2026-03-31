import { Suspense, lazy, Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// ── Eagerly loaded (always needed) ───────────────────────────────────────────
import Home    from './pages/Home'
import NotFound from './pages/NotFound'

// ── Lazy loaded — only downloaded when the user navigates to that route ───────
// This cuts the initial bundle by ~60%
const PostsIndex     = lazy(() => import('./pages/PostsIndex'))
const Post           = lazy(() => import('./pages/Post'))
const About          = lazy(() => import('./pages/About'))
const Contact        = lazy(() => import('./pages/Contact'))
const SolarCalculator = lazy(() => import('./pages/tools/SolarCalculator'))
const CostComparison  = lazy(() => import('./pages/tools/CostComparison'))

// ── Page loading skeleton ─────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 5%' }}>
      {/* Breadcrumb skeleton */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {[60, 40, 120].map((w, i) => (
          <div key={i} style={{ height: 12, width: w, borderRadius: 6, background: 'var(--color-rule)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      {/* Title skeleton */}
      <div style={{ height: 36, width: '70%', borderRadius: 8, background: 'var(--color-rule)', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 36, width: '50%', borderRadius: 8, background: 'var(--color-rule)', marginBottom: '2rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
      {/* Content blocks */}
      {[100, 90, 75, 85, 60, 95, 80].map((w, i) => (
        <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 6, background: 'var(--color-rule)', marginBottom: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
    </div>
  )
}

// ── Error boundary — catches any runtime crash and shows a recovery UI ────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console in dev — swap for Sentry/LogRocket in production
    console.error('Page error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--color-rule)', marginBottom: '1rem' }}>!</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: 400 }}>
            This page hit an unexpected error. Try refreshing — if the problem persists, contact us.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              style={{ background: 'var(--color-ink)', color: '#fff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Refresh page
            </button>
            <a href="/" style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              Go home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/"                       element={<Home />} />
              <Route path="/posts"                  element={<PostsIndex />} />
              <Route path="/posts/:slug"            element={<Post />} />
              <Route path="/about"                  element={<About />} />
              <Route path="/contact"                element={<Contact />} />
              <Route path="/tools/solar-calculator" element={<SolarCalculator />} />
              <Route path="/tools/cost-comparison"  element={<CostComparison />} />
              <Route path="*"                       element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
