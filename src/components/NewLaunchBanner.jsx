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
    // slug estimado con toSlug() — French Avenue Vulcan Feu aún no está
    // sincronizado desde Sanity en este checkout; verificar contra
    // products-enriched.js una vez que corra el sync (o `/tienda`).
    slug: 'french-avenue-vulcan-feu-100ml',
    house: 'French Avenue',
    name: 'Vulcan Feu',
    desktop: '/hero/vulcan-feu-desktop.webp',
    mobile: '/hero/vulcan-feu-mobile.webp',
  },
  {
    // slug estimado con toSlug() — Lattafa Khamrah Waha aún no está
    // sincronizado desde Sanity en este checkout; verificar igual que arriba.
    slug: 'lattafa-khamrah-waha-100ml',
    house: 'Lattafa',
    name: 'Khamrah Waha',
    desktop: '/hero/khamrah-waha-desktop.webp',
    mobile: '/hero/khamrah-waha-mobile.webp',
  },
  {
    // slug confirmado — id 463 en products-enriched.js (BHARARA, 100ml, $45)
    slug: 'bharara-rome-la-bomba-100ml',
    house: 'Bharara',
    name: 'Rome La Bomba',
    desktop: '/hero/rome-la-bomba-desktop.webp',
    mobile: '/hero/rome-la-bomba-mobile.webp',
  },
]

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
            <h2 className="nlb-title">Nuevos en<br />KiKi Fragancia</h2>
            <p className="nlb-name">{launch.house.toUpperCase()} · {launch.name.toUpperCase()}</p>
            <div className="nlb-ctas">
              <Link to={`/tienda/${launch.slug}`} className="nlb-btn-primary">
                Compra ahora
              </Link>
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
