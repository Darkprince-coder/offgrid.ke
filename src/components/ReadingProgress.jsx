import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'

/**
 * ReadingProgress — a thin bar fixed below the navbar that fills
 * as the user scrolls through the page. Only visible on /posts/:slug.
 * Uses a spring for smooth, physical-feeling motion.
 */
export default function ReadingProgress() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)

  // Only show on individual post pages
  const isPost = /^\/posts\/[^/]+$/.test(pathname)

  useEffect(() => {
    if (!isPost) return

    const update = () => {
      const scrollTop  = window.scrollY
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isPost, pathname])

  // Spring for smooth motion — feels physical rather than linear
  const spring = useSpring(progress, { stiffness: 120, damping: 30 })
  const width  = useTransform(spring, v => `${v * 100}%`)

  if (!isPost) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      zIndex: 1000,
      background: 'rgba(212, 114, 26, 0.12)',
    }}>
      <motion.div style={{
        height: '100%',
        width,
        background: 'var(--color-sun)',
        transformOrigin: 'left',
        boxShadow: '0 0 8px rgba(212, 114, 26, 0.4)',
      }} />
    </div>
  )
}
