import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { allProducts } from '../data/all-products'

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

function CartButton() {
  const { items, setDrawerOpen } = useCartContext()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label={`Carrito (${count} items)`}
      className="header-icon-btn"
      style={{
        position: 'relative', background: 'none', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '4px', minHeight: 44,
        transition: 'color .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
      onMouseLeave={e => e.currentTarget.style.color = ''}
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
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const searchInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q.length < 2) return []
    return allProducts
      .filter(p =>
        p.ml !== 200 && (
          p.name.toLowerCase().includes(q) ||
          p.house.toLowerCase().includes(q) ||
          (p.familia && p.familia.toLowerCase().includes(q))
        )
      )
      .slice(0, 6)
  }, [searchQuery])

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
    setActiveSuggestion(-1)
  }, [searchQuery])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setSearchOpen(false); return }
      if (!suggestions.length) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveSuggestion(i => Math.max(i - 1, -1)) }
    }
    if (searchOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, suggestions])

  const mobileParams = new URLSearchParams(location.search)
  const mActiveTipo   = mobileParams.get('tipo')
  const mActiveGenero = mobileParams.get('genero')

  function generoTo(key) {
    const p = new URLSearchParams()
    if (mActiveTipo) p.set('tipo', mActiveTipo)
    if (key) p.set('genero', key)
    return p.toString() ? `/tienda?${p}` : '/tienda'
  }

  function tipoTo(key) {
    const p = new URLSearchParams()
    if (mActiveGenero) p.set('genero', mActiveGenero)
    p.set('tipo', key)
    return `/tienda?${p}`
  }

  function handleSearch(e) {
    e.preventDefault()
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      navigate(`/tienda/${suggestions[activeSuggestion].id}`)
      setSearchOpen(false)
      return
    }
    if (searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  function handleSuggestionClick(product) {
    navigate(`/tienda/${product.id}`)
    setSearchOpen(false)
  }

  return (
    <>
      <header className={`kiki-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="kiki-logo">
            <img src={theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'} alt="KiKi Fragancia" className="kiki-logo-img" />
          </Link>

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
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
                className="header-icon-btn"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', padding: 12, minWidth: 44, minHeight: 44,
                  transition: 'color .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = ''}
              >
                <SearchIcon />
              </button>
              <button
                onClick={toggle}
                className="theme-toggle-btn"
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              >
                {theme === 'dark' ? '☀' : '☾'}
              </button>
              <CartButton />
            </div>
          </nav>

          <div className="kiki-mobile-controls">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="header-icon-btn"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                padding: 4, minWidth: 36, minHeight: 36, justifyContent: 'center',
                transition: 'color .2s',
              }}
            >
              <SearchIcon />
            </button>
            <button
              onClick={toggle}
              className="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
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
          <img src={theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'} alt="KiKi Fragancia" className="kiki-logo-img" />
          <button onClick={() => setMenuOpen(false)} style={{ color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8, minWidth: 44, minHeight: 44 }} aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>

        <nav className="kiki-mobile-nav">

          {/* Sección: Género */}
          <div style={{ padding: '20px 24px 8px', width: '100%' }}>
            <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-ink)' }}>
              Género
            </span>
          </div>
          {[
            { key: null,        label: 'Todas'  },
            { key: 'Masculino', label: 'Hombre' },
            { key: 'Femenino',  label: 'Mujer'  },
            { key: 'Unisex',    label: 'Unisex' },
            { key: 'Niño',      label: 'Kids'   },
          ].map((l, i) => (
            <Link key={l.label} to={generoTo(l.key)} className="mobile-nav-link" style={{ transitionDelay: `${i * 40 + 60}ms` }}>
              {l.label}
            </Link>
          ))}

          {/* Divisor */}
          <div style={{ width: 'calc(100% - 48px)', margin: '12px 24px', height: 1, background: 'var(--line)', flexShrink: 0 }} />

          {/* Sección: Tipo */}
          <div style={{ padding: '8px 24px 8px', width: '100%' }}>
            <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-ink)' }}>
              Tipo
            </span>
          </div>
          {[
            { key: 'arabes',    label: 'Árabes'    },
            { key: 'disenador', label: 'Diseñador' },
            { key: 'nicho',     label: 'Nicho'     },
          ].map((l, i) => (
            <Link key={l.key} to={tipoTo(l.key)} className="mobile-nav-link" style={{ transitionDelay: `${i * 40 + 280}ms` }}>
              {l.label}
            </Link>
          ))}

          {/* Divisor */}
          <div style={{ width: 'calc(100% - 48px)', margin: '12px 24px', height: 1, background: 'var(--line)', flexShrink: 0 }} />

          {/* Sección: Navegación general */}
          <div style={{ padding: '8px 24px 8px', width: '100%' }}>
            <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-ink)' }}>
              Menú
            </span>
          </div>
          {NAV_LINKS.map((link, i) => {
            const delay = i * 40 + 440
            const linkProps = { className: 'mobile-nav-link', style: { transitionDelay: `${delay}ms` } }
            if (link.type === 'route')
              return <Link key={link.label} to={link.to} {...linkProps}>{link.label}</Link>
            if (link.type === 'external')
              return <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" {...linkProps}>{link.label}</a>
            return <a key={link.label} href={link.to} {...linkProps}>{link.label}</a>
          })}

        </nav>

        {/* Moneda en menú móvil */}
        <p className="mobile-footer-label">KiKi Fragancia · Venezuela</p>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: theme === 'warm' ? 'rgba(243,234,217,0.96)' : 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(12px)',
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
              color: 'var(--ink-mute)', padding: 8,
              transition: 'color .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-mute)'}
          >
            <CloseIcon />
          </button>

          <p style={{
            fontFamily: 'var(--font-d)', fontSize: 'clamp(11px, 1.5vw, 13px)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--gold-ink)', marginBottom: 32,
          }}>
            Buscar fragancia
          </p>

          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 560 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              borderBottom: '1px solid var(--gold)',
              gap: 16, paddingBottom: 12,
            }}>
              <span style={{ color: 'var(--gold-ink)', display: 'flex', flexShrink: 0 }}>
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
                  fontWeight: 100, fontStyle: 'italic',
                  color: 'var(--ink)', letterSpacing: '-0.01em',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', display: 'flex', padding: 4 }}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            {suggestions.length > 0 ? (
              <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
                {suggestions.map((p, i) => (
                  <li
                    key={p.id}
                    onMouseDown={() => handleSuggestionClick(p)}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '10px 12px', cursor: 'pointer', borderRadius: 4,
                      background: i === activeSuggestion ? 'rgba(201,168,76,0.12)' : 'transparent',
                      transition: 'background .15s',
                    }}
                  >
                    {p.image && (
                      <img
                        src={`/products/${p.image}`}
                        alt=""
                        loading="lazy"
                        style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0, opacity: 0.85 }}
                      />
                    )}
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-s)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-ink)', display: 'block' }}>
                        {p.house}
                      </span>
                      <span style={{ fontFamily: 'var(--font-d)', fontSize: 15, fontStyle: 'italic', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {p.name}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-faint)', flexShrink: 0 }}>
                      {p.ml}ml
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{
                fontFamily: 'var(--font-s)', fontSize: 11, letterSpacing: '0.08em',
                color: 'var(--ink-faint)', marginTop: 16, textAlign: 'center',
              }}>
                Presiona Enter para buscar · Esc para cerrar
              </p>
            )}
          </form>
        </div>
      )}
    </>
  )
}
