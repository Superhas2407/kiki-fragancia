import { Link } from 'react-router-dom'

const GENEROS = [
  {
    key: 'Masculino',
    label: 'Para él',
    href: '/tienda?genero=Masculino',
    img: '/hero/ddp-hero-desktop.webp',
    imgMobile: '/hero/ddp-hero-mobile.webp',
  },
  {
    key: 'Femenino',
    label: 'Para ella',
    href: '/tienda?genero=Femenino',
    img: '/hero/gucci-bloom-desktop.webp',
    imgMobile: '/hero/gucci-bloom-mobile.webp',
  },
  {
    key: 'Unisex',
    label: 'Unisex',
    href: '/tienda?genero=Unisex',
    img: '/hero/ysl-desktop.webp',
    imgMobile: '/hero/ysl-mobile.webp',
  },
]

export default function QuickGenero() {
  return (
    <section className="qg-section">
      {GENEROS.map(g => (
        <Link key={g.key} to={g.href} className="qg-tile">
          <picture className="qg-picture">
            <source media="(max-width: 767px)" srcSet={g.imgMobile} type="image/webp" />
            <img src={g.img} alt={g.label} className="qg-img" loading="lazy" />
          </picture>
          <div className="qg-overlay" />
          <div className="qg-label-wrap">
            <span className="qg-label">{g.label}</span>
            <span className="qg-cta">Explorar →</span>
          </div>
        </Link>
      ))}
    </section>
  )
}
