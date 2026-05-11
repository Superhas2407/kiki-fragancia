import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Colección', type: 'route',    to: '/tienda' },
  { label: 'Nosotros',  type: 'anchor',   id: 'nosotros' },
  { label: 'Instagram', type: 'external', to: 'https://instagram.com/kiki_fragancia' },
  { label: 'Contacto',  type: 'anchor',   id: 'contacto' },
]

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleAnchor = (id) => (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }

  return (
    <footer id="contacto" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <a
              href="#"
              className="font-display italic leading-none"
              style={{ fontSize: '32px', color: '#C9A84C', letterSpacing: '-0.02em' }}
            >
              KiKi Fragancia
            </a>
            <p
              className="font-sans"
              style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(250,250,248,0.4)', lineHeight: 1.75, maxWidth: '240px' }}
            >
              Perfumería de nicho 100&nbsp;% original. Verificada. Entregada a toda Venezuela.
            </p>

            {/* Badge verificación */}
            <div
              className="flex items-center gap-2 self-start"
              style={{
                border: '1px solid rgba(201,168,76,0.35)',
                padding: '7px 12px',
                color: '#C9A84C',
              }}
            >
              <ShieldIcon />
              <span
                className="font-sans"
                style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                100% Originales Verificados
              </span>
            </div>
          </div>

          {/* Col 2 — Navegación */}
          <div className="flex flex-col gap-4">
            <p
              className="font-sans uppercase tracking-[0.2em]"
              style={{ fontSize: '10px', color: 'rgba(250,250,248,0.3)', marginBottom: '4px' }}
            >
              Navegación
            </p>
            {NAV_LINKS.map(link => {
              const sharedStyle = { fontSize: '13px', fontWeight: 300, color: 'rgba(250,250,248,0.5)', letterSpacing: '0.02em', textDecoration: 'none' }
              const hoverOn  = e => { e.currentTarget.style.color = '#C9A84C' }
              const hoverOff = e => { e.currentTarget.style.color = 'rgba(250,250,248,0.5)' }

              if (link.type === 'route') return (
                <Link key={link.label} to={link.to}
                  className="font-sans transition-colors duration-200"
                  style={sharedStyle}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  {link.label}
                </Link>
              )
              if (link.type === 'external') return (
                <a key={link.label} href={link.to}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans transition-colors duration-200"
                  style={sharedStyle}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  {link.label}
                </a>
              )
              return (
                <a key={link.label} href={`#${link.id}`}
                  onClick={handleAnchor(link.id)}
                  className="font-sans transition-colors duration-200"
                  style={sharedStyle}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Col 3 — Contacto */}
          <div className="flex flex-col gap-4">
            <p
              className="font-sans uppercase tracking-[0.2em]"
              style={{ fontSize: '10px', color: 'rgba(250,250,248,0.3)', marginBottom: '4px' }}
            >
              Contacto
            </p>
            <p
              className="font-sans"
              style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(250,250,248,0.45)', lineHeight: 1.7 }}
            >
              Consultas, pedidos y asesoría olfativa por WhatsApp. Respondemos en menos de 2 horas.
            </p>

            {/* Botón WhatsApp */}
            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 self-start font-sans transition-opacity duration-200 hover:opacity-85"
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: '#25D366',
                color: '#FFFFFF',
                padding: '11px 20px',
                fontWeight: 400,
              }}
            >
              <WhatsAppIcon />
              Escribir por WhatsApp
            </a>
          </div>

        </div>

        {/* Línea divisoria */}
        <div style={{ height: '1px', background: 'rgba(232,228,220,0.08)', marginBottom: '24px' }} />

        {/* Pie */}
        <p
          className="font-sans text-center"
          style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(250,250,248,0.2)', letterSpacing: '0.05em', lineHeight: 1.8 }}
        >
          Hecho con obsesión por el detalle&nbsp;·&nbsp;Venezuela&nbsp;·&nbsp;© 2025 KiKi Fragancia
        </p>

      </div>
    </footer>
  )
}
