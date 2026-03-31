import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop — resets window scroll to top on every route change.
 * Fixes the issue where navigating from the bottom of one post
 * to another post leaves you at the bottom of the new page.
 * Place this once inside <BrowserRouter> in App.jsx.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
