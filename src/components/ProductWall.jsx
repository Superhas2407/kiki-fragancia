import { ThreeDMarquee } from './ui/ThreeDMarquee'

const IMAGES = [
  '/products/gucci-bloom-100ml-f.webp',
  '/products/lattafa-khamrah-qahwa-100ml-u.webp',
  '/products/armaf-odyssey-aoud-100ml-m.webp',
  '/products/prada-paradoxe-intense-90ml-f.webp',
  '/products/versace-eros-flame-100ml-m.webp',
  '/products/carolina-herrera-ch-men-hot-hot-hot-100ml-m.webp',
  '/products/ariana-grande-sweet-like-candy-100ml-f.webp',
  '/products/jean-paul-gaultier-scandal-pour-homme-100ml-m.webp',
  '/products/ralph-lauren-polo-67-ralph-lauren-100ml-m.webp',
  '/products/lattafa-winners-trophy-gold-100ml-u.webp',
  '/products/montblanc-explorer-100ml-m.webp',
  '/products/lattafa-petra-100ml-u.webp',
  '/products/hugo-boss-hugo-man-125ml-m.webp',
  '/products/armaf-the-pride-of-armaf-for-women-100ml-f.webp',
  '/products/elizabeth-arden-sunflowers-100ml-f.webp',
  '/products/boucheron-pour-homme-collector-eau-de-parfum-100ml-m.webp',
]

export default function ProductWall() {
  return (
    <section style={{ background: '#0A0A0A', padding: '80px 0 60px' }}>
      {/* Heading centrado */}
      <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          fontWeight: 500,
          marginBottom: 20,
        }}>
          Colección
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <span style={{
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 200,
            color: '#C9A84C',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            416
          </span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 32px)',
          fontWeight: 300,
          color: '#F7F2EA',
          lineHeight: 1.4,
          margin: 0,
          letterSpacing: '0.01em',
        }}>
          fragancias <em style={{ fontStyle: 'italic', color: 'rgba(247,242,234,0.5)' }}>100% originales</em>
          <br />disponibles para ti
        </h2>
      </div>

      <ThreeDMarquee images={IMAGES} />
    </section>
  )
}
