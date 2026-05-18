import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import VaporCanvas from './VaporCanvas'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const bgRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rv = (delay) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  return (
    <section className="hero-section">
      {/* Background */}
      <div className="hero-bg" ref={bgRef}>
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="hero-video"
        >
          <source src="/hero.webm" type="video/webm" />
        </video>
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-pattern"></div>
        <VaporCanvas />
      </div>

      {/* Content */}
      <div className="kiki-container" style={{ width: '100%', position: 'relative', zIndex: 3 }}>
        <div className="hero-content-wrap">

          <div className="hero-eyebrow" style={rv(0)}>
            <div className="gold-line"></div>
            <span className="eyebrow-text">Perfumería de lujo · Venezuela</span>
          </div>

          <h1 className="hero-main-title" style={rv(120)}>
            El arte de<br />la fragancia
          </h1>

          <p className="hero-tagline" style={rv(240)}>
            228 referencias · Originales verificados · Envío a todo el país
          </p>

          <p className="hero-quote" style={rv(320)}>
            «Un perfume es la memoria de quien lo usa,<br />
            la firma que permanece cuando ya te fuiste.»
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', ...rv(420) }}>
            <Link to="/tienda" className="btn-cta btn-shimmer-kiki">
              Explorar colección <span className="btn-arrow">→</span>
            </Link>
            <a
              href="https://wa.me/584120221983"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(250,250,248,.45)',
                border: '1px solid rgba(250,250,248,.15)', padding: '15px 32px',
                textDecoration: 'none',
                transition: 'color .25s ease, border-color .25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FAFAF8'; e.currentTarget.style.borderColor = 'rgba(250,250,248,.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,250,248,.45)'; e.currentTarget.style.borderColor = 'rgba(250,250,248,.15)' }}
            >
              WhatsApp
            </a>
          </div>

          <div className="hero-instagram" style={rv(520)}>
            <div className="gold-line" style={{ width: 20 }}></div>
            <a href="https://instagram.com/kiki_fragancia" target="_blank" rel="noopener noreferrer" className="instagram-link">
              @kiki_fragancia
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="kiki-scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line-wrap">
          <div className="scroll-line-drop"></div>
        </div>
      </div>
    </section>
  )
}
