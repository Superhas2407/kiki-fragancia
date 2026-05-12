import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Colección', to: '/tienda',                              type: 'route'    },
  { label: 'Nosotros',  to: '/#nosotros',                           type: 'anchor'   },
  { label: 'Instagram', to: 'https://instagram.com/kiki_fragancia', type: 'external' },
  { label: 'Contacto',  to: '/#contacto',                           type: 'anchor'   },
]

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="3" y1="7"  x2="21" y2="7"  />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
)

function DesktopNavItem({ link, isActive }) {
  const [hovered, setHovered] = useState(false)
  const active = isActive || hovered
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '10px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: active ? '#C9A84C' : 'rgba(250,250,248,0.5)',
    transition: 'color 0.25s ease',
    paddingBottom: '2px',
    borderBottom: `1px solid ${active ? 'rgba(201,168,76,0.6)' : 'transparent'}`,
    display: 'inline-block',
  }
  const props = {
    style: base,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
  if (link.type === 'route')    return <Link to={link.to} {...props}>{link.label}</Link>
  if (link.type === 'external') return <a href={link.to} target="_blank" rel="noopener noreferrer" {...props}>{link.label}</a>
  return <a href={link.to} {...props}>{link.label}</a>
}

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [location])

  const headerH = scrolled ? '60px' : '72px'

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          height: headerH,
          background: scrolled ? 'rgba(10,8,4,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.18)' : '1px solid rgba(201,168,76,0.06)',
          transition: 'height 0.4s ease, background 0.4s ease, border-color 0.4s ease',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px', fontWeight: 500, fontStyle: 'italic',
              color: scrolled ? '#C9A84C' : '#FAFAF8',
              letterSpacing: '-0.02em', textDecoration: 'none',
              transition: 'color 0.4s ease',
              lineHeight: 1,
            }}
          >
            KiKi Fragancia
          </Link>

          {/* Nav desktop */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            {NAV_LINKS.map(link => (
              <DesktopNavItem
                key={link.label}
                link={link}
                isActive={link.type === 'route' && location.pathname === link.to}
              />
            ))}

            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#C9A84C',
                textDecoration: 'none',
                border: '1px solid rgba(201,168,76,0.35)',
                padding: '7px 14px',
                transition: 'border-color 0.25s ease, background 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.background = 'transparent' }}
              aria-label="Contactar por WhatsApp"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: '20px' }}>
            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#C9A84C', display: 'flex' }}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={20} />
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{ color: '#FAFAF8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay — slide down */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', inset: 0, zIndex: 39,
          background: 'rgba(8,6,2,0.97)',
          backdropFilter: 'blur(20px)',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: menuOpen ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
          pointerEvents: menuOpen ? 'auto' : 'none',
          display: 'flex', flexDirection: 'column',
        }}
        aria-hidden={!menuOpen}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '72px', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 500, fontStyle: 'italic', color: '#C9A84C', letterSpacing: '-0.02em' }}>
            KiKi Fragancia
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(201,168,76,0.12)', margin: '0 24px' }} />

        {/* Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '36px', paddingBottom: '48px' }}>
          {NAV_LINKS.map((link, i) => {
            const st = {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(250,250,248,0.65)', textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.4s ease ${i * 60 + 100}ms, transform 0.4s ease ${i * 60 + 100}ms, color 0.2s ease`,
            }
            if (link.type === 'route')    return <Link    key={link.label} to={link.to} style={st} onMouseEnter={e => e.currentTarget.style.color='#C9A84C'} onMouseLeave={e => e.currentTarget.style.color='rgba(250,250,248,0.65)'}>{link.label}</Link>
            if (link.type === 'external') return <a       key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" style={st} onMouseEnter={e => e.currentTarget.style.color='#C9A84C'} onMouseLeave={e => e.currentTarget.style.color='rgba(250,250,248,0.65)'}>{link.label}</a>
            return <a key={link.label} href={link.to} style={st} onMouseEnter={e => e.currentTarget.style.color='#C9A84C'} onMouseLeave={e => e.currentTarget.style.color='rgba(250,250,248,0.65)'}>{link.label}</a>
          })}

          <div style={{ width: '32px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />

          <a
            href="https://wa.me/584120221983"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#C9A84C', textDecoration: 'none',
            }}
          >
            <WhatsAppIcon size={16} />
            Escribir por WhatsApp
          </a>
        </nav>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.18)', textAlign: 'center', paddingBottom: '28px' }}>
          KiKi Fragancia · Venezuela
        </p>
      </div>
    </>
  )
}
