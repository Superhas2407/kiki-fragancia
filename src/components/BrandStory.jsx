import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const STATS = [
  { value: '228+',  label: 'Fragancias' },
  { value: '100%',  label: 'Verificadas' },
  { value: '33k',   label: 'Seguidores' },
]

export default function BrandStory() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0   })
  const quoteRef   = useScrollReveal({ threshold: 0.2, delay: 120  })
  const textRef    = useScrollReveal({ threshold: 0.2, delay: 260  })
  const statsRef   = useScrollReveal({ threshold: 0.2, delay: 380  })
  const imgRef     = useScrollReveal({ threshold: 0.1, delay: 80   })
  const [imgHover, setImgHover] = useState(false)

  return (
    <section id="nosotros" style={{ background: '#1C1408', padding: '128px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }} className="flex-col md:flex-row">

          {/* ── Columna izquierda ── */}
          <div style={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

            {/* Eyebrow */}
            <div ref={eyebrowRef} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <div style={{ width: '32px', height: '1px', background: '#C9A84C' }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
                color: '#C9A84C', margin: 0,
              }}>
                Nuestra historia
              </p>
            </div>

            {/* Cita con comilla decorativa */}
            <div ref={quoteRef} style={{ position: 'relative', marginBottom: '36px' }}>
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '140px', lineHeight: 1,
                  color: 'rgba(201,168,76,0.10)',
                  position: 'absolute',
                  top: '-28px', left: '-20px',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >"</span>
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 5.5vw, 60px)',
                fontWeight: 300, fontStyle: 'italic',
                color: '#F7F2EA',
                letterSpacing: '-0.025em', lineHeight: 1.12,
                margin: 0,
                position: 'relative', zIndex: 1,
              }}>
                Un perfume no se compra.<br />Se elige.
              </blockquote>
            </div>

            {/* Divisor */}
            <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.35)', marginBottom: '32px' }} />

            {/* Texto */}
            <div ref={textRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '460px', marginBottom: '52px' }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px', fontWeight: 300,
                color: 'rgba(247,242,234,0.60)', lineHeight: 1.85,
                margin: 0,
              }}>
                KiKi Fragancia nació de una obsesión: acercar las casas más exclusivas del mundo a quienes entienden que un aroma es la expresión más íntima del carácter.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px', fontWeight: 300,
                color: 'rgba(247,242,234,0.35)', lineHeight: 1.85,
                margin: 0,
              }}>
                Cada frasco que llega a tus manos ha pasado por nuestra revisión de autenticidad. No vendemos perfumes. Garantizamos experiencias verificadas.
              </p>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px', fontWeight: 300, fontStyle: 'italic',
                color: '#C9A84C', letterSpacing: '0.02em',
                margin: '8px 0 0',
              }}>
                — KiKi Fragancia, Venezuela
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} style={{ display: 'flex', gap: '0', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: '28px 0 0',
                    paddingRight: '32px',
                    borderRight: i < STATS.length - 1 ? '1px solid rgba(201,168,76,0.12)' : 'none',
                    marginRight: i < STATS.length - 1 ? '32px' : '0',
                  }}
                >
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '36px', fontWeight: 400,
                    color: '#C9A84C', letterSpacing: '-0.02em',
                    margin: '0 0 6px',
                    lineHeight: 1,
                  }}>
                    {s.value}
                  </p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(247,242,234,0.30)',
                    margin: 0,
                  }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Columna derecha — imagen ── */}
          <div
            ref={imgRef}
            className="hidden md:block"
            style={{ flex: '0 0 44%', position: 'relative' }}
          >
            {/* Marco offset dorado */}
            <div style={{
              position: 'absolute',
              top: '20px', left: '20px', right: '-20px', bottom: '-20px',
              border: '1px solid rgba(201,168,76,0.25)',
              pointerEvents: 'none',
              transition: 'border-color 0.4s ease',
              borderColor: imgHover ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.25)',
            }} />

            {/* Imagen */}
            <div
              style={{ overflow: 'hidden', position: 'relative', cursor: 'default' }}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              <img
                src="/products/IMG_8643.JPG"
                alt="Khamrah · KiKi Fragancia"
                style={{
                  width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block',
                  transform: imgHover ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
              {/* Overlay sutil en hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: imgHover ? 'rgba(10,6,2,0.18)' : 'rgba(10,6,2,0)',
                transition: 'background 0.4s ease',
              }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
