import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { allProducts } from '../data/all-products'

const PRODUCT_COUNT = allProducts.filter(p => p.ml !== 200 || !p.variantIds).length

export default function ProductWall() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0 })
  const numberRef  = useScrollReveal({ threshold: 0.2, delay: 100 })
  const titleRef   = useScrollReveal({ threshold: 0.2, delay: 200 })
  const ctaRef     = useScrollReveal({ threshold: 0.1, delay: 0 })

  return (
    <section style={{ background: 'var(--bg)', padding: '80px 0 60px' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <span ref={eyebrowRef} className="eyebrow-gold">Colección</span>

        <div ref={numberRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <span style={{
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 200,
            color: '#C9A84C',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {PRODUCT_COUNT}
          </span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>

        <h2 ref={titleRef} style={{
          fontSize: 'clamp(20px, 3vw, 32px)',
          fontWeight: 300,
          color: 'var(--ink)',
          lineHeight: 1.4,
          margin: '0 0 48px',
          letterSpacing: '0.01em',
        }}>
          fragancias <em style={{ fontStyle: 'italic', color: 'var(--ink-mute)' }}>100% originales</em>
          <br />disponibles para ti
        </h2>

        <div ref={ctaRef}>
          <Link to="/tienda" className="btn-cta btn-shimmer-kiki">
            Explorar colección <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
