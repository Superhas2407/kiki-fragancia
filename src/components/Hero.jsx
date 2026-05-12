import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Parallax sutil en la imagen de fondo
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return
      const y = window.scrollY
      imgRef.current.style.transform = `translateY(${y * 0.22}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const reveal = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  })

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100dvh' }}>

      {/* Imagen de fondo con parallax */}
      <img
        ref={imgRef}
        src="/khamrah-hero.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10% 0 -10% 0',
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          objectPosition: '60% center',
          display: 'block',
          willChange: 'transform',
        }}
      />

      {/* Overlay direccional */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(10,6,2,0.82) 0%, rgba(10,6,2,0.45) 50%, rgba(10,6,2,0.08) 100%)',
      }} />

      {/* Gradiente inferior */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%',
        background: 'linear-gradient(to bottom, transparent, rgba(10,6,2,0.95))',
        pointerEvents: 'none',
      }} />

      {/* Grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
          opacity: 0.03, pointerEvents: 'none', mixBlendMode: 'overlay',
        }}
      />

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col items-start justify-center"
        style={{
          minHeight: '100dvh',
          paddingLeft:  'clamp(40px, 8vw, 120px)',
          paddingRight: '24px',
          paddingTop:   '96px',
          paddingBottom: '96px',
          maxWidth: '600px',
        }}
      >
        {/* Kicker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', ...reveal(120) }}>
          <div style={{ width: '36px', height: '1px', background: '#C9A84C' }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 300, color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
            Perfumería · Venezuela
          </p>
        </div>

        {/* Titular */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(44px, 8vw, 76px)',
            fontWeight: 400, fontStyle: 'italic',
            color: '#FAFAF8',
            letterSpacing: '-0.025em', lineHeight: 1.03,
            margin: '0 0 28px',
            textWrap: 'balance',
            ...reveal(260),
          }}
        >
          El Aroma de la<br />Autenticidad
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', fontWeight: 300,
            color: 'rgba(250,250,248,0.45)',
            letterSpacing: '0.22em', lineHeight: 2,
            textTransform: 'uppercase',
            margin: '0 0 32px',
            ...reveal(380),
          }}
        >
          Fragancias 100&nbsp;% originales.<br />Verificadas. Exclusivas.
        </p>

        {/* Slogan */}
        <div style={{ marginBottom: '48px', ...reveal(480) }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(17px, 2vw, 22px)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(250,250,248,0.68)',
              lineHeight: 1.6, letterSpacing: '0.01em',
              margin: 0,
            }}
          >
            Oler bien deja gratos recuerdos,<br />con KiKi Fragancia nunca te olvidarán.
          </p>
        </div>

        {/* CTA */}
        <div style={reveal(580)}>
          <Link
            to="/tienda"
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', fontWeight: 400,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: ctaHover ? '#0A0A0A' : '#FAFAF8',
              background: ctaHover ? '#C9A84C' : 'transparent',
              border: `1px solid ${ctaHover ? '#C9A84C' : 'rgba(201,168,76,0.55)'}`,
              padding: '15px 40px',
              transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            }}
          >
            Ver Colección
            <span style={{ fontSize: '13px', transform: ctaHover ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>→</span>
          </Link>
        </div>

        {/* Badge Instagram */}
        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '10px', ...reveal(680) }}>
          <div style={{ width: '28px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />
          <a
            href="https://instagram.com/kiki_fragancia"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(250,250,248,0.35)', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,250,248,0.35)'}
          >
            @kiki_fragancia · 33k seguidores
          </a>
        </div>
      </div>

      {/* Scroll indicator animado */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '36px',
          left: 'clamp(40px, 8vw, 120px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 900ms',
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.25)' }}>
          Scroll
        </span>
        <div style={{ width: '1px', height: '56px', background: 'rgba(201,168,76,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '40%',
            background: '#C9A84C',
            animation: 'scrollDrop 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 1; }
          70%  { transform: translateY(260%);  opacity: 1; }
          71%  { opacity: 0; }
          100% { transform: translateY(260%);  opacity: 0; }
        }
      `}</style>
    </section>
  )
}
