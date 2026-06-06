import { createContext, useContext, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kiki-wishlist') || '[]') }
    catch { return [] }
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  function toggle(id) {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem('kiki-wishlist', JSON.stringify(next)) } catch {}
      return next
    })
  }

  function isWishlisted(id) { return ids.includes(id) }

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, drawerOpen, setDrawerOpen }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
