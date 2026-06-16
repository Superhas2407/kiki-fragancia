import { Link } from 'react-router-dom'

const PRODUCT_SLUG = 'carolina-herrera-la-bomba-80ml'

const FloralFrame = () => (
  <svg
    className="nlb-floral-frame"
    viewBox="0 0 320 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    {/* Border rect */}
    <rect x="14" y="14" width="292" height="44" rx="0" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />

    {/* Corner flower TL */}
    <g transform="translate(14,14)">
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="2" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Corner flower TR */}
    <g transform="translate(306,14)">
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="2" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Corner flower BL */}
    <g transform="translate(14,58)">
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="2" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Corner flower BR */}
    <g transform="translate(306,58)">
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-2 3, -2 7, 0 8 C2 7, 2 3, 0 0Z" fill="white" opacity="0.9" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="2" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Mid-left flower */}
    <g transform="translate(14,36)">
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(90 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(180 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(270 0 0)"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Mid-right flower */}
    <g transform="translate(306,36)">
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(90 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(180 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(270 0 0)"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Mid-top flower */}
    <g transform="translate(160,14)">
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(255,180,200,1)"/>
    </g>

    {/* Mid-bottom flower */}
    <g transform="translate(160,58)">
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(72 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(144 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(216 0 0)"/>
      <path d="M0 0 C-1.5 2.5, -1.5 5.5, 0 6.5 C1.5 5.5, 1.5 2.5, 0 0Z" fill="white" opacity="0.7" transform="rotate(288 0 0)"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(255,180,200,1)"/>
    </g>
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
          <div className="nlb-btn-flower-wrap">
            <FloralFrame />
            <Link to={`/tienda/${PRODUCT_SLUG}`} className="nlb-btn-pink">
              Compra ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
