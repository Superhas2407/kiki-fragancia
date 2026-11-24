import { responsiveImage, responsiveSrcSet } from '../lib/responsiveImages'
import { Link } from 'react-router-dom'

const GENEROS = [
  {
    key: 'Masculino',
    label: 'Hombre',
    href: '/tienda?genero=Masculino',
    img: '/hero/sauvage-desktop.webp',
    imgMobile: '/hero/sauvage-mobile.webp',
  },
  {
    key: 'Femenino',
    label: 'Mujer',
    href: '/tienda?genero=Femenino',
    img: '/hero/paraella-desktop.webp',
    imgMobile: '/hero/paraella-mobile.webp',
  },
  {
    key: 'Unisex',
    label: 'Unisex',
    href: '/tienda?genero=Unisex',
    img: '/hero/unisex-desktop.webp',
    imgMobile: '/hero/unisex-desktop.webp',
  },
]

export default function QuickGenero() {
  return (
    <section className="explore-section" aria-labelledby="explore-heading">
      <div className="explore-heading"><h2 id="explore-heading">Explora a tu manera</h2><Link to="/tienda">Ver todo <span aria-hidden="true">→</span></Link></div>
      <div className="qg-section">
      {GENEROS.map(g => (
        <Link key={g.key} to={g.href} className="qg-tile">
          <picture className="qg-picture">
            <source media="(max-width: 767px)" srcSet={responsiveSrcSet(g.imgMobile) || g.imgMobile} sizes="(max-width: 767px) 50vw, 33vw" type="image/webp" />
            <img src={responsiveImage(g.img)} srcSet={responsiveSrcSet(g.img)} sizes="(max-width: 767px) 50vw, 33vw" decoding="async" alt={g.label} className="qg-img" loading="lazy" />
          </picture>
          <div className="qg-overlay" />
          <div className="qg-label-wrap">
            <span className="qg-label">{g.label}</span>
            <span className="qg-cta" aria-hidden="true">→</span>
          </div>
        </Link>
      ))}
      </div>
    </section>
  )
}
