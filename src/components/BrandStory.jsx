import { useScrollReveal } from '../hooks/useScrollReveal'

export default function BrandStory() {
  const lineRef  = useScrollReveal({ threshold: 0.3, delay: 0 })
  const quoteRef = useScrollReveal({ threshold: 0.2, delay: 150 })
  const textRef  = useScrollReveal({ threshold: 0.2, delay: 300 })

  return (
    <section id="nosotros" style={{ background: '#0A0A0A', padding: '112px 0' }}>
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Línea decorativa dorada */}
        <div
          ref={lineRef}
          style={{ width: '60px', height: '1px', background: '#C9A84C', marginBottom: '52px' }}
        />

        {/* Cita principal */}
        <blockquote
          ref={quoteRef}
          className="font-display italic"
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: '#FAFAF8',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '40px',
          }}
        >
          "Un perfume no se compra.<br />Se elige."
        </blockquote>

        {/* Línea separadora */}
        <div
          style={{ width: '32px', height: '1px', background: '#C9A84C', opacity: 0.35, marginBottom: '36px' }}
        />

        {/* Texto de marca */}
        <div ref={textRef} className="flex flex-col gap-5 max-w-lg">
          <p
            className="font-sans"
            style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(250,250,248,0.55)', lineHeight: 1.8 }}
          >
            KiKi Fragancia nació de una obsesión: acercar las casas de nicho más exclusivas del mundo a quienes entienden que un aroma es la expresión más íntima del carácter.
          </p>
          <p
            className="font-sans"
            style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(250,250,248,0.35)', lineHeight: 1.8 }}
          >
            Cada frasco que llega a tus manos ha pasado por nuestra revisión de autenticidad. No vendemos perfumes. Entregamos experiencias verificadas.
          </p>

          {/* Firma */}
          <p
            className="font-display italic mt-4"
            style={{ fontSize: '18px', color: '#C9A84C', fontWeight: 300, letterSpacing: '0.02em' }}
          >
            — KiKi Fragancia, Venezuela
          </p>
        </div>

      </div>
    </section>
  )
}
