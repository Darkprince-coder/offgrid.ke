import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function ReadingProgress() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)

  const isPost = /^\/posts\/[^/]+$/.test(pathname)

  // Scroll tracking — resets when leaving a post
  useEffect(() => {
    if (!isPost) {
      setProgress(0)
      return
    }

    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isPost, pathname])

  // These MUST be before any conditional return — Rules of Hooks
  const spring = useSpring(progress, { stiffness: 120, damping: 30 })
  const width  = useTransform(spring, v => `${v * 100}%`)

  // Only render on post pages — but all hooks above have already run
  if (!isPost) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      zIndex: 1001,
      background: 'rgba(212, 114, 26, 0.15)',
      pointerEvents: 'none',
    }}>
      <motion.div style={{
        height: '100%',
        width,
        background: 'var(--color-sun)',
        transformOrigin: 'left',
        boxShadow: '0 0 6px rgba(212, 114, 26, 0.5)',
      }} />
    </div>
  )
}
