import { Component, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import Landing from './pages/Landing'
import Tienda from './pages/Tienda'
import ProductDetail from './pages/ProductDetail'
import DiaDeLPadrePage from './pages/DiaDeLPadrePage'
import CartDrawer from './components/CartDrawer'
import CursorTrail from './components/CursorTrail'
import Header from './components/Header'
import GlobalSidebar from './components/GlobalSidebar'
import WhatsAppFab from './components/WhatsAppFab'
import AnnouncementBar from './components/AnnouncementBar'

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

function AppShell() {
  return (
    <>
      <CursorTrail />
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <div className="app-shell">
        <GlobalSidebar />
        <div className="app-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/:id" element={<ProductDetail />} />
            <Route path="/dia-del-padre" element={<DiaDeLPadrePage />} />
          </Routes>
        </div>
      </div>
      <ErrorBoundary>
        <CartDrawer />
      </ErrorBoundary>
      <WhatsAppFab />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </CurrencyProvider>
    </BrowserRouter>
  )
}
