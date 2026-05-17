import { Link } from 'react-router-dom'

const WhatsAppIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

export default function Footer() {
  return (
    <footer id="contacto" className="kiki-footer">
      <div className="footer-top-line"></div>
      <div className="footer-glow"></div>

      <div className="footer-inner">
        <div className="footer-grid">

          {/* Col 1 — Brand */}
          <div>
            <Link to="/" className="footer-logo">KiKi Fragancia</Link>
            <p className="footer-tagline">
              La fragancia que te define,<br />verificada y original.
            </p>
            <p className="footer-sub">
              Perfumería de lujo venezolana.<br />
              Más de 228 referencias de las mejores casas del mundo.
            </p>
            <div className="footer-badge">
              <ShieldIcon />
              <span className="footer-badge-text">100% originales verificados</span>
            </div>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <span className="footer-col-label">Explorar</span>
            <nav className="footer-nav">
              <Link to="/tienda" className="footer-nav-link">Colección completa</Link>
              <a href="/#nosotros" className="footer-nav-link">Nuestra historia</a>
              <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Instagram</a>
              <a href="/#catalogo" className="footer-nav-link">Destacados</a>
            </nav>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <span className="footer-col-label">Contacto</span>
            <p className="footer-contact-desc">
              Respondemos en menos de 2 horas.<br />
              Asesoría personalizada sin costo.
            </p>
            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--font-s)', fontSize: 10,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                background: '#25D366', color: '#FFF',
                padding: '12px 22px', textDecoration: 'none',
                marginBottom: 14,
                transition: 'background .25s ease, transform .25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1da851'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <WhatsAppIcon size={15} />
              Escribir por WhatsApp
            </a>
            <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="footer-insta">
              @kiki_fragancia
            </a>
          </div>

        </div>

        <div className="footer-bottom"></div>
        <div className="footer-meta">
          <span className="footer-copy">© {new Date().getFullYear()} KiKi Fragancia. Todos los derechos reservados.</span>
          <span className="footer-craft">Perfumería de lujo venezolana</span>
        </div>
      </div>
    </footer>
  )
}
