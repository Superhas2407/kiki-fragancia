import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VaporCanvas from './VaporCanvas'

const SLIDES = [
  { type: 'video', src: '/hero.webm' },
  { type: 'image', desktop: '/hero/gucci-bloom-desktop.webp',  mobile: '/hero/gucci-bloom-mobile.webp'  },
  { type: 'image', desktop: '/hero/mandarin-sky-desktop.webp', mobile: '/hero/mandarin-sky-mobile.webp' },
  { type: 'image', desktop: '/hero/nitro-red-desktop.webp',    mobile: '/hero/nitro-red-mobile.webp'    },
  { type: 'image', desktop: '/hero/yara-desktop.webp',         mobile: '/hero/yara-mobile.webp'         },
  { type: 'image', desktop: '/hero/ysl-desktop.webp',          mobile: '/hero/ysl-mobile.webp'          },
]

const FADE_MS = 1600

// El video tiene más tiempo que las fotos
function getSlideDuration(idx) {
  return idx === 0 ? 14000 : 7000
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function Hero() {
  const [mounted, setMounted]       = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767
  // En mobile saltamos el video (slide 0) para evitar el botón de play nativo
  const SLIDES_ACTIVE = isMobile ? SLIDES.filter(s => s.type !== 'video') : SLIDES
  const initialSlide = 0
  const [current, setCurrent]       = useState(initialSlide)
  const [prev, setPrev]             = useState(null)
  const [entering, setEntering]     = useState(false)
  const timerRef = useRef(null)
  const currentRef = useRef(initialSlide)
  const touchStartX = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Precarga todas las imágenes del carrusel al montar para evitar lag en transiciones
  useEffect(() => {
    const mobile = window.innerWidth <= 767
    SLIDES_ACTIVE.forEach(slide => {
      if (slide.type !== 'image') return
      const img = new Image()
      img.src = mobile ? slide.mobile : slide.desktop
    })
  }, [])

  function advance(from) {
    const next = (from + 1) % SLIDES_ACTIVE.length
    currentRef.current = next
    setPrev(from)
    setEntering(true)
    setCurrent(next)
    setTimeout(() => { setPrev(null); setEntering(false) }, FADE_MS + 200)
    timerRef.current = setTimeout(() => advance(next), getSlideDuration(SLIDES_ACTIVE[next].type === 'video' ? 0 : 1))
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => advance(0), getSlideDuration(SLIDES_ACTIVE[0].type === 'video' ? 0 : 1))
    return () => clearTimeout(timerRef.current)
  }, [])

  function goTo(idx) {
    if (idx === currentRef.current || entering) return
    clearTimeout(timerRef.current)
    const from = currentRef.current
    currentRef.current = idx
    setPrev(from)
    setEntering(true)
    setCurrent(idx)
    setTimeout(() => { setPrev(null); setEntering(false) }, FADE_MS + 200)
    timerRef.current = setTimeout(() => advance(idx), getSlideDuration(idx))
  }

  const rv = (delay) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  // isEntering: el slide está entrando (fade 0→1). isPrev: el slide queda atrás estático.
  function SlideMedia({ slide, z, isEntering, isPrev, index }) {
    const wrapStyle = {
      position: 'absolute', inset: 0, zIndex: z,
      opacity: isPrev ? 1 : 1,
      animation: isEntering ? `heroFadeIn ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
    }
    const mediaStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    if (slide.type === 'video') {
      return (
        <div style={wrapStyle}>
          <video autoPlay muted loop playsInline aria-hidden="true" style={mediaStyle}>
            <source src={slide.src} type="video/webm" />
          </video>
        </div>
      )
    }
    return (
      <div style={wrapStyle}>
        <picture style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
          <source srcSet={slide.desktop} type="image/webp" />
          <img
            src={slide.desktop}
            alt=""
            aria-hidden="true"
            style={mediaStyle}
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        </picture>
      </div>
    )
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    const total = SLIDES_ACTIVE.length
    const next = delta > 0
      ? (currentRef.current + 1) % total
      : (currentRef.current - 1 + total) % total
    goTo(next)
  }

  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background carousel */}
      <div className="hero-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Slide anterior — se queda estático atrás mientras el nuevo entra */}
        {prev !== null && (
          <SlideMedia slide={SLIDES_ACTIVE[prev]} z={1} isPrev index={prev} />
        )}
        {/* Slide actual — entra en fade-in cuando entering=true */}
        <SlideMedia slide={SLIDES_ACTIVE[current]} z={2} isEntering={entering} index={current} />

        <div className="hero-bg-gradient" style={{ zIndex: 3 }}></div>
        <div className="hero-bg-pattern" style={{ zIndex: 3 }}></div>
        <div style={{ zIndex: 4 }}>
          <VaporCanvas />
        </div>
      </div>

      {/* Content */}
      <div className="kiki-container" style={{ width: '100%', position: 'relative', zIndex: 5 }}>
        <div className="hero-content-wrap">

          <div className="hero-eyebrow" style={rv(0)}>
            <div className="gold-line"></div>
            <span className="eyebrow-text">Perfumería de lujo · Venezuela</span>
          </div>

          <h1 className="hero-main-title" style={rv(120)}>
            El arte de<br />la fragancia
          </h1>

          <p className="hero-quote" style={rv(240)}>
            Oler bien deja gratos recuerdos y con KiKi Fragancia nunca te olvidarán
          </p>

          {/* Buscador global — oculto en mobile (usa lupa del header) */}
          <div className="hero-search-desktop" style={{ width: '100%', maxWidth: 480, ...rv(380) }}>
            <form
              onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`) }}
              style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(250,250,248,0.06)',
                border: '1px solid rgba(250,250,248,0.18)',
                backdropFilter: 'blur(8px)',
                padding: '0 16px', gap: 10,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(250,250,248,0.18)'}
            >
              <span style={{ color: 'rgba(250,250,248,0.45)', display: 'flex', flexShrink: 0 }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Buscar fragancia o marca..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-s)', fontSize: 12, letterSpacing: '0.05em',
                  color: '#FAFAF8', padding: '14px 0',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#C9A84C', color: '#0A0A0A', border: 'none', cursor: 'pointer',
                  padding: '7px 16px', fontFamily: 'var(--font-s)', fontSize: 9,
                  letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400,
                  flexShrink: 0,
                }}
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="hero-cta-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 28, ...rv(420) }}>
            <Link to="/tienda" className="btn-cta btn-shimmer-kiki">
              Explorar colección <span className="btn-arrow">→</span>
            </Link>
            <a
              href="https://instagram.com/kiki_fragancia"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-s)', fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: 300, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(250,250,248,.70)',
                border: '1px solid rgba(250,250,248,.30)', padding: '13px clamp(20px, 5vw, 32px)',
                textDecoration: 'none', minHeight: '46px', display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box',
                transition: 'color .25s ease, border-color .25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FAFAF8'; e.currentTarget.style.borderColor = 'rgba(250,250,248,.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,250,248,.70)'; e.currentTarget.style.borderColor = 'rgba(250,250,248,.30)' }}
            >
              Instagram
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

      {/* Dots de navegación */}
      <div style={{
        position: 'absolute', bottom: 'clamp(20px, 5vh, 80px)', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 0, zIndex: 10,
      }}>
        {SLIDES_ACTIVE.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              height: 44, padding: '0 4px',
              background: 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
          >
            <span aria-hidden="true" style={{
              display: 'block',
              width: i === current ? 28 : 8, height: 8,
              background: i === current ? '#C9A84C' : 'rgba(250,250,248,0.35)',
              transition: 'width 0.4s ease, background 0.4s ease',
            }} />
          </button>
        ))}
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
