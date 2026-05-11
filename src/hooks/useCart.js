import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kiki-cart'

function loadCart() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : []
  } catch { return [] }
}

export function useCart() {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product) => setItems(prev => {
    const found = prev.find(i => i.id === product.id)
    if (found) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    return [...prev, { ...product, quantity: 1 }]
  })

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = items.reduce((sum, i) => {
    const unit = parseFloat((i.price || '$0').replace('$', '')) || 0
    return sum + unit * i.quantity
  }, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }
}
