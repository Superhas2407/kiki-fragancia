import { Link, useLocation } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { supabase } from '../lib/supabaseClient'

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const StoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

const UserIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function BottomNav() {
  const location = useLocation()
  const { items, setDrawerOpen } = useCartContext()
  const { session } = useAuth()
  const { setAuthModalOpen } = useWishlist()
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  const isHome = location.pathname === '/'
  const isStore = location.pathname === '/tienda' || location.pathname.startsWith('/tienda/')

  function openSearch() {
    window.dispatchEvent(new CustomEvent('kiki:open-search'))
  }

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item${isHome ? ' active' : ''}`}>
        <HomeIcon />
        <span>Inicio</span>
      </Link>

      <Link to="/tienda" className={`bottom-nav-item${isStore ? ' active' : ''}`}>
        <StoreIcon />
        <span>Tienda</span>
      </Link>

      <button className="bottom-nav-item" onClick={openSearch}>
        <SearchIcon />
        <span>Buscar</span>
      </button>

      <button className="bottom-nav-item" onClick={() => setDrawerOpen(true)} style={{ position: 'relative' }}>
        <span style={{ position: 'relative', display: 'flex' }}>
          <CartIcon />
          {cartCount > 0 && (
            <span className="bottom-nav-badge">{cartCount > 9 ? '9+' : cartCount}</span>
          )}
        </span>
        <span>Carrito</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={() => session ? supabase.auth.signOut() : setAuthModalOpen(true)}
      >
        <UserIcon filled={!!session} />
        <span>{session ? 'Cuenta' : 'Entrar'}</span>
      </button>
    </nav>
  )
}
