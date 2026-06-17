import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const IGIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const WAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
  </svg>
)

export default function Footer() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleNewsletter(e) {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
  }

  return (
    <footer id="contacto" className="kiki-footer">
      <div className="kf-inner">

        {/* ── Grid de columnas ── */}
        <div className="kf-grid">

          {/* Col 1 — Brand */}
          <div className="kf-col">
            <Link to="/">
              <img
                src={theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'}
                alt="KiKi Fragancia"
                className="kf-logo"
              />
            </Link>
            <p className="kf-tagline">
              La fragancia que te define,<br />verificada y original.
            </p>
            <p className="kf-sub">
              Perfumería de lujo venezolana.<br />
              Fragancias 100% originales de las mejores casas del mundo.
            </p>
          </div>

          {/* Col 2 — Colección */}
          <div className="kf-col">
            <span className="kf-label">Colección</span>
            <nav className="kf-nav">
              <Link to="/tienda" className="kf-link">Todas las fragancias</Link>
              <Link to="/tienda?genero=Masculino" className="kf-link">Para hombre</Link>
              <Link to="/tienda?genero=Femenino" className="kf-link">Para mujer</Link>
              <Link to="/tienda?genero=Unisex" className="kf-link">Unisex</Link>
              <Link to="/tienda?tipo=arabes" className="kf-link">Árabes</Link>
              <Link to="/tienda?tipo=disenador" className="kf-link">Diseñador</Link>
              <Link to="/tienda?tipo=nicho" className="kf-link">Nicho</Link>
            </nav>
          </div>

          {/* Col 3 — Información */}
          <div className="kf-col">
            <span className="kf-label">Información</span>
            <nav className="kf-nav">
              <Link to="/#nosotros" className="kf-link">Nosotros</Link>
              <Link to="/terminos-y-condiciones" className="kf-link">Términos y condiciones</Link>
              <a
                href="https://maps.app.goo.gl/HnYgeV6sxFbWJVN39"
                target="_blank"
                rel="noopener noreferrer"
                className="kf-link"
              >
                CC Todo Tecnología, Local #29<br />
                <span style={{ opacity: 0.6, fontSize: 10 }}>Los Cortijos · Caracas</span>
              </a>
            </nav>
          </div>

          {/* Col 4 — Contacto */}
          <div className="kf-col">
            <span className="kf-label">Atención al cliente</span>
            <nav className="kf-nav">
              <a
                href="https://wa.me/584149112002?text=Hola%20KiKi%20Fragancia%2C%20tengo%20una%20consulta&ref=footer"
                target="_blank"
                rel="noopener noreferrer"
                className="kf-link kf-link-icon"
              >
                <WAIcon /> WhatsApp
              </a>
              <a
                href="https://instagram.com/kiki_fragancia"
                target="_blank"
                rel="noopener noreferrer"
                className="kf-link kf-link-icon"
              >
                <IGIcon /> @kiki_fragancia
              </a>
              <span className="kf-link" style={{ cursor: 'default' }}>
                Lun – Sáb · 9am – 7pm
              </span>
            </nav>
          </div>

          {/* Col 5 — Newsletter */}
          <div className="kf-col">
            <Link to="/">
              <img
                src={theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'}
                alt="KiKi Fragancia"
                className="kf-logo kf-logo-sm"
              />
            </Link>
            <span className="kf-label" style={{ marginTop: 20 }}>Newsletter</span>
            <p className="kf-sub" style={{ marginBottom: 14 }}>
              Recibe lanzamientos exclusivos y ofertas antes que nadie.
            </p>
            {sent ? (
              <p style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: '0.08em' }}>
                ¡Gracias! Te escribiremos pronto.
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="kf-newsletter">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="kf-newsletter-input"
                  required
                />
                <button type="submit" className="kf-newsletter-btn">
                  Suscribir
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ── Divisor ── */}
        <div className="kf-divider" />

        {/* ── Bottom bar ── */}
        <div className="kf-bottom">
          <div className="kf-socials">
            <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="kf-social-icon" aria-label="Instagram">
              <IGIcon />
            </a>
            <a href="https://wa.me/584149112002" target="_blank" rel="noopener noreferrer" className="kf-social-icon" aria-label="WhatsApp">
              <WAIcon />
            </a>
            <a href="https://tiktok.com/@kiki_fragancia" target="_blank" rel="noopener noreferrer" className="kf-social-icon" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
          <span className="kf-copy">
            © {new Date().getFullYear()} · KiKi Fragancia · Caracas, Venezuela
          </span>
          <div className="kf-trust">
            <span>✓ 100% originales</span>
            <span>✓ Envío nacional</span>
            <span>✓ Pago en Bs o divisa</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
