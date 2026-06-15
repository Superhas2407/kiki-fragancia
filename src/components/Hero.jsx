import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const rv = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  return (
    <section className="hero-section">
      {/* Foto de fondo */}
      <div className="hero-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <picture style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <source media="(max-width: 767px)" srcSet="/hero/ddp-hero-mobile.webp" type="image/webp" />
          <source srcSet="/hero/ddp-hero-desktop.webp" type="image/webp" />
          <img
            src="/hero/ddp-hero-desktop.webp"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-bg-gradient" style={{ zIndex: 2 }} />
      </div>

      {/* Contenido — izquierda, estilo Afnan DDP */}
      <div className="kiki-container" style={{ width: '100%', position: 'relative', zIndex: 5 }}>
        <div className="hero-content-wrap hero-ddp-layout">

          <p className="hero-ddp-eyebrow" style={rv(0)}>— Edición Día del Padre · 2026</p>

          <h1 className="hero-ddp-title" style={rv(120)}>
            ESTE DÍA<br />DEL PADRE,
          </h1>

          <p className="hero-ddp-sub" style={rv(240)}>
            REGÁLALE SU FRAGANCIA
          </p>

          <p className="hero-ddp-desc" style={rv(320)}>
            Fragancias de diseñador 100% originales.<br />
            Colección masculina curada para él.
          </p>

          <div style={rv(420)}>
            <Link to="/dia-del-padre" className="hero-ddp-btn">
              Ver colección →
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="hero-bottom-bar" style={{ zIndex: 10 }}>
        <a
          href="https://instagram.com/kiki_fragancia"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-bottom-handle"
          style={rv(500)}
        >
          @kiki_fragancia · Instagram
        </a>
        <div />
        <div className="kiki-scroll-indicator" style={{ position: 'static', bottom: 'auto', left: 'auto' }}>
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line-wrap">
            <div className="scroll-line-drop" />
          </div>
        </div>
      </div>
    </section>
  )
}
