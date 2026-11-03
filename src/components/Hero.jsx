import { responsiveImage, responsiveSrcSet } from '../lib/responsiveImages'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const SLIDES = [
  { desktop: '/hero/ysl-desktop.webp',              mobile: '/hero/ysl-mobile.webp'              },
  { desktop: '/hero/carolina-herrera-desktop.webp', mobile: '/hero/carolina-herrera-mobile.webp' },
  { desktop: '/hero/gucci-bloom-desktop.webp',      mobile: '/hero/gucci-bloom-mobile.webp'      },
  { desktop: '/hero/mandarin-sky-desktop.webp',     mobile: '/hero/mandarin-sky-mobile.webp'     },
  { desktop: '/hero/nitro-red-desktop.webp',        mobile: '/hero/nitro-red-mobile.webp'        },
  { desktop: '/hero/yara-desktop.webp',             mobile: '/hero/yara-mobile.webp'             },
]

export default function Hero() {
  const { theme } = useTheme()
  const [{ current, visited }, setSlides] = useState(() => ({ current: 0, visited: new Set([0]) }))
  const [mounted, setMounted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSlides(prev => { const current = (prev.current + 1) % SLIDES.length; return { current, visited: new Set([...prev.visited, current]) } }), 7000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    let timer
    const update = () => {
      clearTimeout(timer)
      setIsDesktop(window.matchMedia('(min-width: 768px)').matches)
      const allowed = media.matches && !navigator.connection?.saveData
      if (!allowed) setVideoEnabled(false)
      else timer = setTimeout(() => setVideoEnabled(true), 1500)
    }
    update()
    media.addEventListener('change', update)
    return () => { clearTimeout(timer); media.removeEventListener('change', update) }
  }, [])

  // Parallax del video de fondo — solo desktop, throttled con rAF
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    let ticking = false

    const update = () => {
      ticking = false
      if (!mq.matches || !sectionRef.current || !videoRef.current) return
      const offset = window.scrollY * 0.3
      videoRef.current.style.transform = `translateY(${offset}px)`
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rv = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    color: '#F7F2EA',
  })

  return (
    <section className="hero-section" ref={sectionRef}>
      {/* Video parallax — solo desktop */}
      <div className="hero-video-bg" style={{ backgroundImage: `url(${responsiveImage(SLIDES[0].desktop, 1600)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {videoEnabled && <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="none"
          className="hero-video-fixed"
        >
          <source src="/hero/hero-parallax-optimized.mp4" type="video/mp4" />
        </video>}
        <div className="hero-bg-gradient" style={{ zIndex: 2 }} />
      </div>

      {/* Slides de imágenes — solo mobile */}
      {!isDesktop && SLIDES.map((slide, i) => (
        <div
          key={i}
          className="hero-bg hero-bg-mobile-only"
          style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: i === current ? 1 : 0, transition: 'opacity 0.85s ease', zIndex: i === current ? 1 : 0 }}
        >
          <picture style={{ position: 'absolute', inset: 0, display: 'block' }}>
            <source media="(max-width: 767px)" srcSet={visited.has(i) ? responsiveSrcSet(slide.mobile) || slide.mobile : undefined} sizes="100vw" type="image/webp" />
            <source srcSet={visited.has(i) ? responsiveSrcSet(slide.desktop) || slide.desktop : undefined} sizes="100vw" type="image/webp" />
            <img
              src={visited.has(i) ? responsiveImage(slide.desktop, 960) : undefined} srcSet={visited.has(i) ? responsiveSrcSet(slide.desktop) : undefined} sizes="100vw" decoding="async"
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

      {/* Niebla — solo tema Halloween, capa puramente decorativa */}
      {theme === 'halloween' && (
        <div className="hero-mist" aria-hidden="true">
          <div className="hero-mist-layer hero-mist-1" />
          <div className="hero-mist-layer hero-mist-2" />
        </div>
      )}

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
              onClick={() => setSlides(prev => ({ current: i, visited: new Set([...prev.visited, i]) }))}
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
