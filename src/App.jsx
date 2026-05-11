import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Landing from './pages/Landing'
import Tienda from './pages/Tienda'
import CartDrawer from './components/CartDrawer'
import CartFab from './components/CartFab'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Tienda />} />
        </Routes>
        <CartFab />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  )
}
