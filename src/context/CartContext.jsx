import { createContext, useContext, useState } from 'react'
import { useCart } from '../hooks/useCart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const cart = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <CartContext.Provider value={{ ...cart, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => useContext(CartContext)
