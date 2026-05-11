import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Colección', to: '/tienda',                              type: 'route'    },
  { label: 'Nosotros',  to: '/#nosotros',                           type: 'anchor'   },
  { label: 'Instagram', to: 'https://instagram.com/kiki_fragancia', type: 'external' },
  { label: 'Contacto',  to: '/#contacto',                           type: 'anchor'   },
]

const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea scroll del body cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : '#1A1714',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display italic select-none leading-none"
            style={{ fontSize: '28px', fontWeight: 500, color: '#FAFAF8', letterSpacing: '-0.02em', textDecoration: 'none' }}
          >
            KiKi Fragancia
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              const cls = "font-sans text-ivory/60 hover:text-gold transition-colors duration-200"
              const st  = { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }
              if (link.type === 'route')    return <Link key={link.label} to={link.to} className={cls} style={st}>{link.label}</Link>
              if (link.type === 'external') return <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" className={cls} style={st}>{link.label}</a>
              return <a key={link.label} href={link.to} className={cls} style={st}>{link.label}</a>
            })}

            <a
              href="https://wa.me/58000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:opacity-80 transition-opacity"
              aria-label="Contactar por WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </nav>

          {/* Mobile: WhatsApp + hamburger */}
          <div className="flex md:hidden items-center gap-5">
            <a
              href="https://wa.me/58000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="text-ivory p-1 -mr-1"
              aria-label="Abrir menú"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay fullscreen */}
      <div
        className="fixed inset-0 z-50 flex flex-col md:hidden transition-all duration-300"
        style={{
          background: 'rgba(10,10,10,0.97)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        {/* Top bar del overlay: nombre + cerrar */}
        <div className="flex justify-between items-center px-6 h-16">
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="font-display italic select-none leading-none"
            style={{ fontSize: '28px', fontWeight: 500, color: '#FAFAF8', letterSpacing: '-0.02em' }}
          >
            KiKi Fragancia
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-ivory/70 hover:text-ivory transition-colors p-1"
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Links centrados */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-10 pb-16">
          {NAV_LINKS.map(link => {
            const cls = "font-sans text-ivory/70 hover:text-gold transition-colors duration-200"
            const st  = { fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }
            const close = () => setMenuOpen(false)
            if (link.type === 'route')    return <Link key={link.label} to={link.to} onClick={close} className={cls} style={st}>{link.label}</Link>
            if (link.type === 'external') return <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" onClick={close} className={cls} style={st}>{link.label}</a>
            return <a key={link.label} href={link.to} onClick={close} className={cls} style={st}>{link.label}</a>
          })}

          {/* Separador */}
          <div style={{ width: '40px', height: '1px', background: '#C9A84C', opacity: 0.4 }} />

          <a
            href="https://wa.me/58000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gold"
            style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
        </nav>

        {/* Línea decorativa inferior */}
        <div className="px-6 pb-10 text-center">
          <p
            className="font-sans text-ivory/20"
            style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            KiKi Fragancia · Venezuela
          </p>
        </div>
      </div>
    </>
  )
}
