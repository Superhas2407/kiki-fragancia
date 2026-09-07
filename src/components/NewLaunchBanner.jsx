import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const AUTO_MS = 6000

// Cada entrada necesita su par /hero/{slug}-desktop.webp (2752×1536) y
// /hero/{slug}-mobile.webp (1536×2752) — mismas proporciones que el de
// Carolina Herrera para que el crossfade no salte de tamaño.
const LAUNCHES = [
  {
    slug: 'carolina-herrera-la-bomba-80ml',
    house: 'Carolina Herrera',
    name: 'La Bomba',
    desktop: '/hero/carolina-herrera-desktop.webp',
    mobile: '/hero/carolina-herrera-mobile.webp',
  },
  {
    slug: 'french-avenue-vulcan-feu-100ml',
    house: 'French Avenue',
    name: 'Vulcan Feu',
    desktop: '/hero/vulcan-feu-desktop.webp',
    mobile: '/hero/vulcan-feu-mobile.webp',
  },
  {
    slug: 'lattafa-khamrah-waha-100ml',
    house: 'Lattafa',
    name: 'Khamrah Waha',
    desktop: '/hero/khamrah-waha-desktop.webp',
    mobile: '/hero/khamrah-waha-mobile.webp',
  },
  {
    slug: 'bharara-rome-la-bomba-100ml',
    house: 'Bharara',
    name: 'Rome La Bomba',
    desktop: '/hero/rome-la-bomba-desktop.webp',
    mobile: '/hero/rome-la-bomba-mobile.webp',
  },
]

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
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % LAUNCHES.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="nlb-section">
      {LAUNCHES.map((launch, i) => (
        <div key={launch.slug} className={`nlb-slide${i === current ? ' nlb-slide-active' : ''}`} aria-hidden={i !== current}>
          <picture className="nlb-picture">
            <source media="(max-width: 767px)" srcSet={launch.mobile} type="image/webp" />
            <source srcSet={launch.desktop} type="image/webp" />
            <img
              src={launch.desktop}
              alt={`Nuevo lanzamiento — ${launch.house} ${launch.name}`}
              className="nlb-img"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </picture>

          <div className="nlb-overlay" aria-hidden="true" />

          <div className="nlb-content">
            <h2 className="nlb-title">Nueva en<br />KiKi Fragancia</h2>
            <p className="nlb-name">{launch.house.toUpperCase()} · {launch.name.toUpperCase()}</p>
            <div className="nlb-ctas">
              <div className="nlb-btn-flower-wrap">
                <FloralFrame />
                <Link to={`/tienda/${launch.slug}`} className="nlb-btn-pink">
                  Compra ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="nlb-dots" role="tablist" aria-label="Nuevos lanzamientos">
        {LAUNCHES.map((launch, i) => (
          <button
            key={launch.slug}
            className={`nlb-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Ver ${launch.house} ${launch.name}`}
          />
        ))}
      </div>
    </section>
  )
}
