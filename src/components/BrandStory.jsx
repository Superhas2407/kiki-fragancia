import { useScrollReveal } from '../hooks/useScrollReveal'

export default function BrandStory() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0 })
  const quoteRef   = useScrollReveal({ threshold: 0.2, delay: 120 })
  const textRef    = useScrollReveal({ threshold: 0.2, delay: 260 })
  const imgRef     = useScrollReveal({ threshold: 0.15, delay: 180 })
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
              Cada fragancia<br />cuenta una historia.<br />La tuya empieza aquí.
            </div>
          </div>

          {/* Right: foto + texto */}
          <div className="brand-story-right">
            <div ref={imgRef} className="brand-story-img-wrap">
              <img
                src="/store-interior.webp"
                alt="Local KiKi Fragancia — CC Todo Tecnología, Caracas"
                className="brand-story-img"
                loading="lazy"
              />
              <div className="brand-story-img-caption">CC Todo Tecnología · Los Cortijos · Caracas</div>
            </div>
            <p ref={textRef} className="brand-story-text">
              KiKi Fragancia nació en Caracas con una sola obsesión: traer a Venezuela
              las fragancias originales de las grandes casas del mundo. Cada frasco es
              100% verificado, y nuestro equipo te ayuda a encontrar la que realmente
              va contigo — no la que simplemente está de moda.
            </p>
            <p ref={textRef} className="brand-story-attr">— KiKi Fragancia, Caracas</p>
          </div>

        </div>
      </div>
    </section>
  )
}
