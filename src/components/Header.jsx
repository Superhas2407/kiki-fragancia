import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { useIndexProducts } from '../context/SanityProductsContext'
import { notesLookup } from '../data/notes-lookup'
import { acordesByProduct } from '../data/acordes-index'
import { norm, productMatchesQuery } from '../lib/search'
import { toSlug } from '../lib/slugs'

const NAV_LINKS = [
  { label: 'Colección', to: '/tienda',                              type: 'route'    },
  { label: 'Nosotros',  to: '/#nosotros',                           type: 'anchor'   },
  { label: 'Instagram', to: 'https://instagram.com/kiki_fragancia', type: 'external' },
  { label: 'Contacto',  to: '/#contacto',                           type: 'anchor'   },
]

const TRENDING_TERMS = ['Khamrah', 'Oud', '9 PM', 'Lattafa', 'Floral', 'Afnan']

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

function WishlistButton() {
  const { ids, setDrawerOpen } = useWishlist()
  const count = ids.length

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label={`Lista de deseos (${count} items)`}
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
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
  const allProducts = useIndexProducts()
  const { theme, toggleTheme: toggle } = useTheme()
  const { currency, setCurrency } = useCurrency()
  const { ids: wishlistIds, setDrawerOpen: openWishlist } = useWishlist()
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const searchInputRef = useRef(null)

  const suggestions = useMemo(() => {
    const raw = norm(searchQuery.trim())
    if (raw.length < 2) return []
    const terms = raw.split(/\s+/).filter(Boolean)
    return allProducts
      .filter(p => {
        if (p.ml === 200 && p.variantIds) return false
        const fields = [
          norm(p.name),
          norm(p.house),
          norm(p.familia),
          norm(notesLookup[p.id]),
          ...(acordesByProduct[p.id] || []).map(norm),
        ]
        return productMatchesQuery(terms, fields)
      })
      .slice(0, 6)
  }, [searchQuery])

  const topProducts = useMemo(() =>
    allProducts.filter(p => !(p.ml === 200 && p.variantIds) && p.image).slice(0, 12),
    [allProducts]
  )

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
    const handler = () => setSearchOpen(true)
    window.addEventListener('kiki:open-search', handler)
    return () => window.removeEventListener('kiki:open-search', handler)
  }, [])

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
      const s = suggestions[activeSuggestion]
      navigate(`/tienda/${toSlug(s.house, s.name, s.ml)}`)
      setSearchOpen(false)
      return
    }
    if (searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  function handleSuggestionClick(p) {
    navigate(`/tienda/${toSlug(p.house, p.name, p.ml)}`)
    setSearchOpen(false)
  }

  return (
    <>
      <header className={`kiki-header${isLanding ? ' on-landing' : ''}`}>
        <div className="header-inner">
          {/* LEFT — mobile: hamburger | desktop: currency + theme */}
          <div className="header-util-left">
            <button className="hamburger-btn header-desktop-hide" onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <span className="header-mobile-hide">
              <div className="currency-pill">
                {[{ val: 'usd', label: 'REF' }, { val: 'bs', label: 'Bs' }].map(({ val, label }) => {
                  const active = currency === val
                  return (
                    <button key={val} onClick={() => setCurrency(val)}
                      title={val === 'usd' ? 'Ver precios en divisa' : 'Ver precios en bolívares'}
                      className={`currency-btn${active ? ' active' : ''}`}
                    >{label}</button>
                  )
                })}
              </div>
              <button onClick={toggle} className="theme-toggle-btn"
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
                {theme === 'dark' ? '☀' : '☾'}
              </button>
            </span>
          </div>

          {/* CENTER — logo */}
          <Link to="/" className="kiki-logo">
            <img src={theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'} alt="KiKi Fragancia" className="kiki-logo-img" />
          </Link>

          {/* RIGHT — search + wishlist (desktop) + cart */}
          <div className="header-util-right">
            <button onClick={() => setSearchOpen(true)} aria-label="Buscar" className="header-icon-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, minWidth: 44, minHeight: 44, transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >
              <SearchIcon />
            </button>
            <span className="header-mobile-hide"><WishlistButton /></span>
            <CartButton />
          </div>
        </div>

        {/* NAV HORIZONTAL — desktop only */}
        {(() => {
          const sp = new URLSearchParams(location.search)
          const g = sp.get('genero'); const t = sp.get('tipo'); const ddp = sp.get('ddp') === '1'
          const isPath = (p) => location.pathname === p
          return (
            <nav className="header-cat-nav">
              {[
                { label: 'Hombre',    href: '/tienda?genero=Masculino', active: g === 'Masculino' && !ddp },
                { label: 'Mujer',     href: '/tienda?genero=Femenino',  active: g === 'Femenino'  && !ddp },
                { label: 'Unisex',    href: '/tienda?genero=Unisex',    active: g === 'Unisex'    && !ddp },
                { label: 'Kids',      href: '/tienda?genero=Niño',      active: g === 'Niño'      && !ddp },
              ].map(l => (
                <Link key={l.label} to={l.href} className={`header-cat-link${l.active ? ' active' : ''}`}>{l.label}</Link>
              ))}
              <span className="header-cat-sep" />
              {[
                { label: 'Árabes',    href: '/tienda?tipo=arabes',    active: t === 'arabes'    },
                { label: 'Diseñador', href: '/tienda?tipo=disenador', active: t === 'disenador' },
                { label: 'Nicho',     href: '/tienda?tipo=nicho',     active: t === 'nicho'     },
              ].map(l => (
                <Link key={l.label} to={l.href} className={`header-cat-link${l.active ? ' active' : ''}`}>{l.label}</Link>
              ))}
              <span className="header-cat-sep" />
              <a href="/#nosotros" className={`header-cat-link${isPath('/') ? ' active' : ''}`}>Nosotros</a>
              <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="header-cat-link">Instagram</a>
              <Link to="/tienda?ddp=1" className={`header-cat-link header-cat-ddp${ddp ? ' active' : ''}`}>🎁 Día del Padre</Link>
            </nav>
          )
        })()}

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
          <button onClick={() => setMenuOpen(false)} className="mobile-menu-close">
            <CloseIcon />
          </button>
        </div>

        <nav className="kiki-mobile-nav">
          <Link to="/tienda?ddp=1" className="mobile-nav-link mobile-nav-ddp" style={{ transitionDelay: '40ms' }}>
            Día del Padre
          </Link>

          {[
            { key: 'Masculino', label: 'Hombre' },
            { key: 'Femenino',  label: 'Mujer'  },
            { key: 'Unisex',    label: 'Unisex' },
            { key: 'Niño',      label: 'Kids'   },
          ].map((l, i) => (
            <Link key={l.label} to={generoTo(l.key)} className="mobile-nav-link" style={{ transitionDelay: `${i * 40 + 80}ms` }}>
              {l.label}
            </Link>
          ))}

          <div className="mobile-nav-divider" />

          {[
            { key: 'arabes',    label: 'Árabes'    },
            { key: 'disenador', label: 'Diseñador' },
            { key: 'nicho',     label: 'Nicho'     },
          ].map((l, i) => (
            <Link key={l.key} to={tipoTo(l.key)} className="mobile-nav-link" style={{ transitionDelay: `${i * 40 + 260}ms` }}>
              {l.label}
            </Link>
          ))}

          <div className="mobile-nav-divider" />

          <a href="/#nosotros" className="mobile-nav-link" style={{ transitionDelay: '380ms' }}>Nosotros</a>
          <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" style={{ transitionDelay: '420ms' }}>Instagram</a>
        </nav>

        {/* Utilidades al fondo — compactas */}
        <div className="mobile-menu-utils">
          <button onClick={() => { openWishlist(true); setMenuOpen(false) }} className="mobile-util-link">
            ♡ Deseos{wishlistIds.length > 0 ? ` (${wishlistIds.length})` : ''}
          </button>
          <button onClick={toggle} className="mobile-util-link">
            {theme === 'dark' ? '☀ Modo claro' : '☾ Modo oscuro'}
          </button>
          <div className="mobile-currency-row">
            {[{ val: 'usd', label: 'REF' }, { val: 'bs', label: 'Bs' }].map(({ val, label }) => (
              <button key={val} onClick={() => setCurrency(val)} className={`mobile-currency-btn${currency === val ? ' active' : ''}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search overlay — panel style */}
      {searchOpen && (
        <>
        <div className="kiki-search-backdrop" onClick={() => setSearchOpen(false)} />
        <div className="kiki-search-overlay">
          {/* Barra superior: input + X */}
          <div className="kiki-search-bar-row">
            <form onSubmit={handleSearch} className="kiki-search-form">
              <span className="kiki-search-icon"><SearchIcon /></span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar fragancia…"
                className="kiki-search-input"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="kiki-search-clear">
                  <CloseIcon />
                </button>
              )}
            </form>
            <button onClick={() => setSearchOpen(false)} aria-label="Cerrar búsqueda" className="kiki-search-close">
              <CloseIcon />
            </button>
          </div>

          {/* Contenido */}
          <div className="kiki-search-body">
            {searchQuery.length < 2 ? (
              <>
                {/* Trending */}
                <div className="kiki-search-section">
                  <p className="kiki-search-label">Tendencias</p>
                  <div className="kiki-search-chips">
                    {TRENDING_TERMS.map(t => (
                      <button key={t} className="kiki-search-chip"
                        onClick={() => { setSearchQuery(t); searchInputRef.current?.focus() }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top productos */}
                {topProducts.length > 0 && (
                  <div className="kiki-search-section">
                    <p className="kiki-search-label">Destacados</p>
                    <div className="kiki-search-grid">
                      {topProducts.map(p => {
                        const sale = p.descuento ? Math.round(p.precioUSD * (1 - p.descuento / 100)) : null
                        return (
                          <div key={p.id} className="kiki-search-product" onClick={() => handleSuggestionClick(p)}>
                            <div className="kiki-search-product-img-bg">
                              <img src={`/products/${p.image}`} alt={p.name} loading="lazy" className="kiki-search-product-img" />
                            </div>
                            <p className="kiki-search-product-house">{p.house}</p>
                            <p className="kiki-search-product-name">{p.name}</p>
                            <div className="kiki-search-product-price">
                              {sale ? (
                                <>
                                  <del className="kiki-search-price-orig">${p.precioUSD}</del>
                                  <span className="kiki-search-price-sale">${sale}</span>
                                </>
                              ) : (
                                <span className="kiki-search-price-normal">${p.precioUSD}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : suggestions.length > 0 ? (
              <ul className="kiki-search-suggestions">
                {suggestions.map((p, i) => (
                  <li key={p.id}
                    onClick={() => handleSuggestionClick(p)}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    className={`kiki-search-suggestion${i === activeSuggestion ? ' active' : ''}`}
                  >
                    {p.image && <img src={`/products/${p.image}`} alt="" loading="lazy" className="kiki-search-sug-img" />}
                    <span className="kiki-search-sug-info">
                      <span className="kiki-search-sug-house">{p.house}</span>
                      <span className="kiki-search-sug-name">{p.name}</span>
                    </span>
                    <span className="kiki-search-sug-ml">{p.ml}ml</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="kiki-search-empty">Sin resultados para "{searchQuery}"</p>
            )}
          </div>
        </div>
        </>
      )}
    </>
  )
}
