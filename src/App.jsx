import { Component, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Landing from './pages/Landing'
import Tienda from './pages/Tienda'
import ProductDetail from './pages/ProductDetail'
import CartDrawer from './components/CartDrawer'
import CartFab from './components/CartFab'
import CursorTrail from './components/CursorTrail'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return null
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.error('[KiKi] Error capturado:', err) }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <CursorTrail />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:id" element={<ProductDetail />} />
        </Routes>
        <ErrorBoundary>
          <CartFab />
          <CartDrawer />
        </ErrorBoundary>
      </CartProvider>
    </BrowserRouter>
  )
}
