import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { session } = useAuth()
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kiki-wishlist') || '[]') }
    catch { return [] }
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Cuando el usuario inicia sesión: fusionar wishlist local con la de Supabase
  useEffect(() => {
    if (!session) return
    supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', session.user.id)
      .then(({ data }) => {
        if (!data) return
        const remoteIds = data.map(r => r.product_id)
        setIds(prev => {
          const merged = [...new Set([...prev, ...remoteIds])]
          // Subir a Supabase los items que solo están en local
          const localOnly = prev.filter(id => !remoteIds.includes(id))
          if (localOnly.length > 0) {
            supabase.from('wishlists').upsert(
              localOnly.map(id => ({ user_id: session.user.id, product_id: id }))
            )
          }
          try { localStorage.setItem('kiki-wishlist', JSON.stringify(merged)) } catch {}
          return merged
        })
      })
  }, [session])

  function toggle(id) {
    setIds(prev => {
      const adding = !prev.includes(id)
      const next = adding ? [...prev, id] : prev.filter(x => x !== id)
      try { localStorage.setItem('kiki-wishlist', JSON.stringify(next)) } catch {}
      if (session) {
        if (adding) {
          supabase.from('wishlists').insert({ user_id: session.user.id, product_id: id })
        } else {
          supabase.from('wishlists').delete()
            .eq('user_id', session.user.id).eq('product_id', id)
        }
      }
      return next
    })
  }

  function isWishlisted(id) { return ids.includes(id) }

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, drawerOpen, setDrawerOpen, authModalOpen, setAuthModalOpen }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
