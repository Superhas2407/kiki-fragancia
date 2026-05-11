import { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Landing from './pages/Landing'
import Tienda from './pages/Tienda'
import CartDrawer from './components/CartDrawer'
import CartFab from './components/CartFab'

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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Tienda />} />
        </Routes>
        <ErrorBoundary>
          <CartFab />
          <CartDrawer />
        </ErrorBoundary>
      </CartProvider>
    </BrowserRouter>
  )
}
