import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PostsIndex from './pages/PostsIndex'
import Post from './pages/Post'
import About from './pages/About'
import Contact from './pages/Contact'
import SolarCalculator from './pages/tools/SolarCalculator'
import CostComparison from './pages/tools/CostComparison'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"                             element={<Home />} />
          <Route path="/posts"                        element={<PostsIndex />} />
          <Route path="/posts/:slug"                  element={<Post />} />
          <Route path="/about"                        element={<About />} />
          <Route path="/contact"                      element={<Contact />} />
          <Route path="/tools/solar-calculator"       element={<SolarCalculator />} />
          <Route path="/tools/cost-comparison"        element={<CostComparison />} />
          <Route path="*"                             element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
