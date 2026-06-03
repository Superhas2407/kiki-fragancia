import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ThreeDMarquee } from './ui/ThreeDMarquee'

const IMAGES = [
  '/products-thumb/gucci-bloom-100ml-f.webp',
  '/products-thumb/lattafa-khamrah-qahwa-100ml-u.webp',
  '/products-thumb/armaf-odyssey-aoud-100ml-m.webp',
  '/products-thumb/prada-paradoxe-intense-90ml-f.webp',
  '/products-thumb/versace-eros-flame-100ml-m.webp',
  '/products-thumb/carolina-herrera-ch-men-hot-hot-hot-100ml-m.webp',
  '/products-thumb/ariana-grande-sweet-like-candy-100ml-f.webp',
  '/products-thumb/jean-paul-gaultier-scandal-pour-homme-100ml-m.webp',
  '/products-thumb/ralph-lauren-polo-67-ralph-lauren-100ml-m.webp',
  '/products-thumb/lattafa-winners-trophy-gold-100ml-u.webp',
  '/products-thumb/montblanc-explorer-100ml-m.webp',
  '/products-thumb/lattafa-petra-100ml-u.webp',
  '/products-thumb/hugo-boss-hugo-man-125ml-m.webp',
  '/products-thumb/armaf-the-pride-of-armaf-for-women-100ml-f.webp',
  '/products-thumb/elizabeth-arden-sunflowers-100ml-f.webp',
  '/products-thumb/boucheron-pour-homme-collector-eau-de-parfum-100ml-m.webp',
]


export default function ProductWall() {
  const eyebrowRef = useScrollReveal({ threshold: 0.2, delay: 0 })
  const numberRef  = useScrollReveal({ threshold: 0.2, delay: 100 })
  const titleRef   = useScrollReveal({ threshold: 0.2, delay: 200 })
  const ctaRef     = useScrollReveal({ threshold: 0.1, delay: 0 })

  return (
    <section className="product-wall-section" style={{ padding: '80px 0 60px' }}>

      {/* Heading centrado */}
      <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}>
        <span ref={eyebrowRef} className="eyebrow-gold">Colección</span>

        <div ref={numberRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
          <span style={{
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 200,
            color: 'var(--gold)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            416
          </span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
        </div>

        <h2 ref={titleRef} style={{
          fontSize: 'clamp(20px, 3vw, 32px)',
          fontWeight: 300,
          color: 'var(--ink)',
          lineHeight: 1.4,
          margin: 0,
          letterSpacing: '0.01em',
        }}>
          fragancias <em style={{ fontStyle: 'italic', color: 'var(--ink-mute)' }}>100% originales</em>
          <br />disponibles para ti
        </h2>
      </div>

      <ThreeDMarquee images={IMAGES} />

      {/* CTA */}
      <div ref={ctaRef} style={{ textAlign: 'center', marginTop: 48 }}>
        <Link to="/tienda" className="btn-cta btn-shimmer-kiki">
          Explorar colección <span className="btn-arrow">→</span>
        </Link>
      </div>
    </section>
  )
}
