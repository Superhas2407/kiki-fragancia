import { Link } from 'react-router-dom'

const PRODUCT_SLUG = 'carolina-herrera-la-bomba-80ml'

const FlowerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" />
    <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" transform="rotate(72 12 12)" />
    <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" transform="rotate(144 12 12)" />
    <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" transform="rotate(216 12 12)" />
    <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" transform="rotate(288 12 12)" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default function NewLaunchBanner() {
  return (
    <section className="nlb-section">
      <picture className="nlb-picture">
        <source media="(max-width: 767px)" srcSet="/hero/carolina-herrera-mobile.webp" type="image/webp" />
        <source srcSet="/hero/carolina-herrera-desktop.webp" type="image/webp" />
        <img
          src="/hero/carolina-herrera-desktop.webp"
          alt="Nuevo lanzamiento — Carolina Herrera La Bomba"
          className="nlb-img"
          loading="lazy"
        />
      </picture>

      <div className="nlb-overlay" aria-hidden="true" />

      <div className="nlb-content">
        <h2 className="nlb-title">Nueva en<br />KiKi Fragancia</h2>
        <p className="nlb-name">CAROLINA HERRERA</p>
        <div className="nlb-ctas">
          <Link to={`/tienda/${PRODUCT_SLUG}`} className="nlb-btn-pink">
            <FlowerIcon />
            Compra ahora
            <FlowerIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
