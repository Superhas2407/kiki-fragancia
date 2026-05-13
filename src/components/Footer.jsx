import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Colección', type: 'route',    to: '/tienda' },
  { label: 'Nosotros',  type: 'anchor',   id: 'nosotros' },
  { label: 'Instagram', type: 'external', to: 'https://instagram.com/kiki_fragancia' },
  { label: 'Contacto',  type: 'anchor',   id: 'contacto' },
]

const WhatsAppIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

function NavItem({ link }) {
  const [hovered, setHovered] = useState(false)
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px', fontWeight: 300,
    letterSpacing: '0.04em',
    color: hovered ? '#F7F2EA' : 'rgba(247,242,234,0.42)',
    textDecoration: 'none',
    transition: 'color 0.25s ease',
    display: 'inline-block',
    paddingBottom: '1px',
    borderBottom: `1px solid ${hovered ? 'rgba(247,242,234,0.3)' : 'transparent'}`,
  }
  const events = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
  if (link.type === 'route')    return <Link to={link.to} style={base} {...events}>{link.label}</Link>
  if (link.type === 'external') return <a href={link.to} target="_blank" rel="noopener noreferrer" style={base} {...events}>{link.label}</a>
  return <Link to={`/#${link.id}`} style={base} {...events}>{link.label}</Link>
}

export default function Footer() {
  const [waHover, setWaHover] = useState(false)

  return (
    <footer id="contacto" style={{ background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>

      {/* Línea de entrada dorada */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent 100%)' }} />

      {/* Resplandor ambiental */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px 48px', position: 'relative' }}>

        {/* Grid 3 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '48px', marginBottom: '72px' }} className="md:grid-cols-3">

          {/* Col 1 — Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link
              to="/"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '30px', fontWeight: 500, fontStyle: 'italic',
                color: '#C9A84C', letterSpacing: '-0.02em',
                textDecoration: 'none', lineHeight: 1,
              }}
            >
              KiKi Fragancia
            </Link>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '16px', fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(247,242,234,0.45)', lineHeight: 1.65,
              maxWidth: '240px', margin: 0,
            }}>
              Oler bien deja gratos recuerdos, y con KiKi Fragancia nunca te olvidarán.
            </p>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px', fontWeight: 300,
              color: 'rgba(247,242,234,0.28)', lineHeight: 1.8,
              maxWidth: '240px', margin: 0,
            }}>
              Perfumes 100&nbsp;% originales. Verificados.<br />Disponibles en Venezuela.
            </p>

            {/* Badge verificación */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(201,168,76,0.28)',
              padding: '8px 14px',
              alignSelf: 'flex-start',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#C9A84C',
              }}>
                100% Originales Verificados
              </span>
            </div>
          </div>

          {/* Col 2 — Navegación */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(247,242,234,0.22)', margin: '0 0 4px',
            }}>
              Navegación
            </p>
            {NAV_LINKS.map(link => (
              <NavItem key={link.label} link={link} />
            ))}
          </div>

          {/* Col 3 — Contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(247,242,234,0.22)', margin: '0 0 4px',
            }}>
              Contacto
            </p>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px', fontWeight: 300,
              color: 'rgba(247,242,234,0.38)', lineHeight: 1.8,
              margin: 0,
            }}>
              Consultas, pedidos y asesoría olfativa por WhatsApp. Respondemos en menos de 2 horas.
            </p>

            {/* Botón WhatsApp */}
            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setWaHover(true)}
              onMouseLeave={() => setWaHover(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                alignSelf: 'flex-start',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: 400,
                background: waHover ? '#1da851' : '#25D366',
                color: '#FFFFFF',
                padding: '12px 22px',
                textDecoration: 'none',
                transition: 'background 0.25s ease, transform 0.25s ease',
                transform: waHover ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <WhatsAppIcon />
              Escribir por WhatsApp
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/kiki_fragancia"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px', fontWeight: 300,
                color: 'rgba(247,242,234,0.35)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,242,234,0.35)'}
            >
              <InstagramIcon />
              @kiki_fragancia · 110k seguidores
            </a>
          </div>

        </div>

        {/* Divisor */}
        <div style={{ height: '1px', background: 'rgba(201,168,76,0.15)', marginBottom: '28px' }} />

        {/* Pie */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px', fontWeight: 300,
            color: 'rgba(247,242,234,0.18)', letterSpacing: '0.06em',
            margin: 0,
          }}>
            © 2026 KiKi Fragancia · Venezuela
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px', fontStyle: 'italic',
            color: 'rgba(247,242,234,0.18)',
            margin: 0,
          }}>
            Hecho con obsesión por el detalle
          </p>
        </div>

      </div>
    </footer>
  )
}
