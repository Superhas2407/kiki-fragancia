import { responsiveImage, responsiveSrcSet } from '../lib/responsiveImages'
import { Link } from 'react-router-dom'

const GENEROS = [
  {
    key: 'Masculino',
    label: 'Para él',
    href: '/tienda?genero=Masculino',
    img: '/hero/sauvage-desktop.webp',
    imgMobile: '/hero/sauvage-mobile.webp',
  },
  {
    key: 'Femenino',
    label: 'Para ella',
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
    <section className="qg-section">
      {GENEROS.map(g => (
        <Link key={g.key} to={g.href} className="qg-tile">
          <picture className="qg-picture">
            <source media="(max-width: 767px)" srcSet={responsiveSrcSet(g.imgMobile) || g.imgMobile} sizes="(max-width: 767px) 50vw, 33vw" type="image/webp" />
            <img src={responsiveImage(g.img)} srcSet={responsiveSrcSet(g.img)} sizes="(max-width: 767px) 50vw, 33vw" decoding="async" alt={g.label} className="qg-img" loading="lazy" />
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
