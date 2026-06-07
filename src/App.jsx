import { Component, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { WishlistProvider } from './context/WishlistContext'
import Landing from './pages/Landing'
import CartDrawer from './components/CartDrawer'
import CursorTrail from './components/CursorTrail'
import Header from './components/Header'
import GlobalSidebar from './components/GlobalSidebar'
import WhatsAppFab from './components/WhatsAppFab'
import AnnouncementBar from './components/AnnouncementBar'
import ConsentBanner from './components/ConsentBanner'
const WishlistDrawer  = lazy(() => import('./components/WishlistDrawer'))
const Tienda          = lazy(() => import('./pages/Tienda'))
const ProductDetail   = lazy(() => import('./pages/ProductDetail'))
const DiaDeLPadrePage = lazy(() => import('./pages/DiaDeLPadrePage'))
const TerminosPage    = lazy(() => import('./pages/TerminosPage'))
const ComingSoon      = lazy(() => import('./pages/ComingSoon'))

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
    if (this.state.hasError) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <p style={{ fontFamily: 'var(--font-d)', fontSize: 28, fontStyle: 'italic', color: 'var(--ink-faint)' }}>
          Algo salió mal
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', padding: '14px 32px', border: '1px solid var(--gold)', background: 'transparent', color: 'var(--gold)', cursor: 'pointer' }}
        >
          Recargar página
        </button>
      </div>
    )
    return this.props.children
  }
}

function AppShell() {
  const isTouch = (() => { try { return window.matchMedia('(hover: none)').matches } catch { return true } })()
  return (
    <>
      {!isTouch && <CursorTrail />}
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <div className="app-shell">
        <GlobalSidebar />
        <div className="app-main">
          <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/tienda/:id" element={<ProductDetail />} />
              <Route path="/dia-del-padre" element={<DiaDeLPadrePage />} />
              <Route path="/terminos-y-condiciones" element={<TerminosPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <CartDrawer />
      <Suspense fallback={null}><WishlistDrawer /></Suspense>
      <WhatsAppFab />
      <ConsentBanner />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/coming-soon" element={<ComingSoon />} />
<Route path="*" element={<WishlistProvider><CurrencyProvider><ThemeProvider><AppShell /></ThemeProvider></CurrencyProvider></WishlistProvider>} />
            </Routes>
          </ErrorBoundary>
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
