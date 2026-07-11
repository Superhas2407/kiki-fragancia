import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  { desktop: '/hero/ysl-desktop.webp',              mobile: '/hero/ysl-mobile.webp'              },
  { desktop: '/hero/carolina-herrera-desktop.webp', mobile: '/hero/carolina-herrera-mobile.webp' },
  { desktop: '/hero/gucci-bloom-desktop.webp',      mobile: '/hero/gucci-bloom-mobile.webp'      },
  { desktop: '/hero/mandarin-sky-desktop.webp',     mobile: '/hero/mandarin-sky-mobile.webp'     },
  { desktop: '/hero/nitro-red-desktop.webp',        mobile: '/hero/nitro-red-mobile.webp'        },
  { desktop: '/hero/yara-desktop.webp',             mobile: '/hero/yara-mobile.webp'             },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 7000)
    return () => clearInterval(id)
  }, [])

  const rv = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  return (
    <section className="hero-section">
      {/* Slides de fondo */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="hero-bg"
          style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: i === current ? 1 : 0, transition: 'opacity 0.85s ease', zIndex: i === current ? 1 : 0 }}
        >
          <picture style={{ position: 'absolute', inset: 0, display: 'block' }}>
            <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
            <source srcSet={slide.desktop} type="image/webp" />
            <img
              src={slide.desktop}
              alt=""
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </picture>
          <div className="hero-bg-gradient" style={{ zIndex: 2 }} />
        </div>
      ))}

      {/* Contenido */}
      <div className="kiki-container" style={{ width: '100%', zIndex: 5 }}>
        <div className="hero-content-wrap">
          <p className="hero-eyebrow" style={rv(0)}>Fragancias 100% Originales</p>
          <h1 className="hero-title" style={rv(120)}>
            Oler bien<br />deja gratos<br /><em>recuerdos</em>
          </h1>
          <p className="hero-quote" style={rv(240)}>
            con KiKi Fragancia nunca te olvidarán
          </p>
          <div className="hero-actions" style={rv(360)}>
            <Link to="/tienda" className="hero-btn-primary">Explorar colección</Link>
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
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`hero-dot${i === current ? ' active' : ''}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
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
