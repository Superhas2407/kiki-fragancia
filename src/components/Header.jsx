import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

const NAV_LINKS = [
  { label: 'Colección', to: '/tienda',                              type: 'route'    },
  { label: 'Nosotros',  to: '/#nosotros',                           type: 'anchor'   },
  { label: 'Instagram', to: 'https://instagram.com/kiki_fragancia', type: 'external' },
  { label: 'Contacto',  to: '/#contacto',                           type: 'anchor'   },
]

const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(c) {
    if (c !== currency) toggleCurrency()
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: '1px solid rgba(201,168,76,0.3)',
          color: '#C9A84C', cursor: 'pointer',
          fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '0.15em',
          padding: '6px 10px', transition: 'border-color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.7)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
        aria-label="Cambiar moneda"
      >
        {currency}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#141414', border: '1px solid rgba(201,168,76,0.2)',
          minWidth: 80, zIndex: 200,
        }}>
          {['USD', 'BS'].map(c => (
            <button
              key={c}
              onClick={() => select(c)}
              style={{
                display: 'block', width: '100%', padding: '9px 14px',
                background: c === currency ? 'rgba(201,168,76,0.1)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '0.15em',
                color: c === currency ? '#C9A84C' : 'rgba(250,250,248,0.6)',
              }}
            >
              {c === 'USD' ? 'USD — Dólares' : 'Bs — Bolívares'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CartButton() {
  const { items, setDrawerOpen } = useCartContext()
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label={`Carrito (${count} items)`}
      style={{
        position: 'relative', background: 'none', border: 'none',
        cursor: 'pointer', color: 'rgba(250,250,248,0.75)',
        display: 'flex', alignItems: 'center', padding: '4px',
        transition: 'color .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,250,248,0.75)'}
    >
      <CartIcon size={20} />
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -2, right: -4,
          background: '#C9A84C', color: '#0A0A0A',
          fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-s)',
          width: 16, height: 16, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, searchOpen])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80)
    else setSearchQuery('')
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    if (searchOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header className={`kiki-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="kiki-logo">KiKi Fragancia</Link>

          <nav className="kiki-desktop-nav">
            <div className="nav-pill">
              {NAV_LINKS.map(link => {
                const isActive = link.type === 'route' && location.pathname === link.to
                const style = isActive ? { color: '#C9A84C', background: 'rgba(201,168,76,.1)' } : {}
                if (link.type === 'route')
                  return <Link key={link.label} to={link.to} className="nav-pill-item" style={style}>{link.label}</Link>
                if (link.type === 'external')
                  return <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" className="nav-pill-item">{link.label}</a>
                return <a key={link.label} href={link.to} className="nav-pill-item">{link.label}</a>
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {location.pathname !== '/tienda' && (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Buscar"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(250,250,248,0.6)', display: 'flex', alignItems: 'center',
                    padding: 4, transition: 'color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,250,248,0.6)'}
                >
                  <SearchIcon />
                </button>
              )}
              <CurrencyToggle />
              <CartButton />
            </div>
          </nav>

          <div className="kiki-mobile-controls">
            {location.pathname !== '/tienda' && (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(250,250,248,0.6)', display: 'flex', alignItems: 'center',
                  padding: 4, minWidth: 36, minHeight: 36, justifyContent: 'center',
                  transition: 'color .2s',
                }}
              >
                <SearchIcon />
              </button>
            )}
            <CartButton />
            <button className="hamburger-btn" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`kiki-mobile-backdrop${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar deslizante */}
      <div className={`kiki-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-header">
          <span style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 500, fontStyle: 'italic', color: 'var(--gold)', letterSpacing: '-0.02em' }}>
            KiKi Fragancia
          </span>
          <button onClick={() => setMenuOpen(false)} style={{ color: 'rgba(250,250,248,.45)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8, minWidth: 44, minHeight: 44 }} aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>

        <nav className="kiki-mobile-nav">

          {/* Sección: Fragancias por género */}
          <div style={{ padding: '20px 24px 8px', width: '100%' }}>
            <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
              Fragancias
            </span>
          </div>
          {[
            { to: '/tienda',                    label: 'Todas' },
            { to: '/tienda?genero=Masculino',   label: 'Hombre' },
            { to: '/tienda?genero=Femenino',    label: 'Mujer' },
            { to: '/tienda?genero=Unisex',      label: 'Unisex' },
            { to: '/tienda?genero=Niño',        label: 'Kids' },
          ].map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className="mobile-nav-link"
              style={{ transitionDelay: `${i * 40 + 60}ms` }}
            >
              {l.label}
            </Link>
          ))}

          {/* Divisor */}
          <div style={{ width: 'calc(100% - 48px)', margin: '12px 24px', height: 1, background: 'rgba(201,168,76,0.08)', flexShrink: 0 }} />

          {/* Sección: Navegación general */}
          <div style={{ padding: '8px 24px 8px', width: '100%' }}>
            <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
              Menú
            </span>
          </div>
          {NAV_LINKS.map((link, i) => {
            const delay = i * 40 + 280
            const linkProps = { className: 'mobile-nav-link', style: { transitionDelay: `${delay}ms` } }
            if (link.type === 'route')
              return <Link key={link.label} to={link.to} {...linkProps}>{link.label}</Link>
            if (link.type === 'external')
              return <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" {...linkProps}>{link.label}</a>
            return <a key={link.label} href={link.to} {...linkProps}>{link.label}</a>
          })}

        </nav>

        <p className="mobile-footer-label">KiKi Fragancia · Venezuela</p>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '0 24px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar búsqueda"
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(250,250,248,0.5)', padding: 8,
              transition: 'color .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#FAFAF8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,250,248,0.5)'}
          >
            <CloseIcon />
          </button>

          <p style={{
            fontFamily: 'var(--font-d)', fontSize: 'clamp(11px, 1.5vw, 13px)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#C9A84C', marginBottom: 32,
          }}>
            Buscar fragancia
          </p>

          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 560 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              borderBottom: '1px solid rgba(201,168,76,0.6)',
              gap: 16, paddingBottom: 12,
            }}>
              <span style={{ color: 'rgba(201,168,76,0.7)', display: 'flex', flexShrink: 0 }}>
                <SearchIcon />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nombre, marca o familia..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-d)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 300, fontStyle: 'italic',
                  color: '#FAFAF8', letterSpacing: '-0.01em',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,250,248,0.3)', display: 'flex', padding: 4 }}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            <p style={{
              fontFamily: 'var(--font-s)', fontSize: 11, letterSpacing: '0.08em',
              color: 'rgba(250,250,248,0.25)', marginTop: 16, textAlign: 'center',
            }}>
              Presiona Enter para buscar · Esc para cerrar
            </p>
          </form>
        </div>
      )}
    </>
  )
}
