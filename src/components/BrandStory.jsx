import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function BrandStory() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0 })
  const quoteRef   = useScrollReveal({ threshold: 0.2, delay: 120 })
  const textRef    = useScrollReveal({ threshold: 0.2, delay: 240 })
  const ctaRef     = useScrollReveal({ threshold: 0.2, delay: 340 })

  return (
    <section id="nosotros" className="bs2-section">
      <img src="/store-interior.webp" alt="Local KiKi Fragancia" className="bs2-img" loading="lazy" />
      <div className="bs2-overlay" />
      <div className="bs2-content">
        <p ref={eyebrowRef} className="bs2-eyebrow">Nuestra historia</p>
        <h2 ref={quoteRef} className="bs2-quote">
          Cada fragancia<br />cuenta una historia.<br />La tuya empieza aquí.
        </h2>
        <p ref={textRef} className="bs2-text">
          KiKi Fragancia nació en Caracas con una sola obsesión: traer a Venezuela
          las fragancias originales de las grandes casas del mundo. Cada frasco es
          100% verificado, y nuestro equipo te ayuda a encontrar la que realmente
          va contigo.
        </p>
        <p ref={textRef} className="bs2-attr">— KiKi Fragancia, Caracas</p>
        <div ref={ctaRef} className="bs2-ctas">
          <Link to="/tienda" className="bs2-btn">Explorar colección</Link>
        </div>
      </div>
    </section>
  )
}
