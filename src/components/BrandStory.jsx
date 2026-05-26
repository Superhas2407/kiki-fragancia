import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAnimCounter } from '../hooks/useAnimCounter'

function StatCounter({ target, suffix = '', label }) {
  const { val, ref } = useAnimCounter(target)
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-value">{val}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function BrandStory() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0 })
  const quoteRef   = useScrollReveal({ threshold: 0.2, delay: 120 })
  const textRef    = useScrollReveal({ threshold: 0.2, delay: 260 })
  const statsRef   = useScrollReveal({ threshold: 0.2, delay: 380 })
  return (
    <section id="nosotros" className="brand-story-section section-pad">
      <div className="kiki-container">
        <div className="brand-story-inner">

          {/* Left: título grande */}
          <div className="brand-story-left">
            <div ref={eyebrowRef} className="brand-story-eyebrow">
              <div className="gold-line"></div>
              <span className="eyebrow-gold" style={{ marginBottom: 0 }}>Nuestra historia</span>
            </div>

            <div ref={quoteRef} className="brand-story-quote">
              No vendemos perfumes.<br />Vendemos la fragancia<br />que te representa.
            </div>
          </div>

          {/* Right: texto, firma y estadísticas */}
          <div className="brand-story-right">
            <p ref={textRef} className="brand-story-text">
              KiKi Fragancia nació del amor por las fragancias originales y la convicción
              de que cada persona merece encontrar su firma olfativa. Con más de 228 referencias
              de las mejores casas del mundo, somos la perfumería de confianza de Venezuela.
            </p>
            <p ref={textRef} className="brand-story-attr">— KiKi Fragancia, Caracas</p>

            <div ref={statsRef} className="stats-row">
              <StatCounter target={228} suffix="+" label="Fragancias" />
              <StatCounter target={100} suffix="%" label="Originales verificadas" />
              <StatCounter target={110} suffix="k" label="Seguidores" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
