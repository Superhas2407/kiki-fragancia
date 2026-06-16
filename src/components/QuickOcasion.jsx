import { Link } from 'react-router-dom'

const OCASIONES = [
  {
    key: 'trabajo',
    label: 'Para el trabajo',
    href: '/tienda?coleccion=trabajo',
    img: '/hero/ocasion-trabajo-desktop.webp',
    imgMobile: '/hero/ocasion-trabajo-mobile.webp',
  },
  {
    key: 'salir',
    label: 'Para salir',
    href: '/tienda?coleccion=noche',
    img: '/hero/ocasion-salir-desktop.webp',
    imgMobile: '/hero/ocasion-salir-mobile.webp',
  },
  {
    key: 'diario',
    label: 'Para el diario',
    href: '/tienda?coleccion=diario',
    img: '/hero/ocasion-diario-desktop.webp',
    imgMobile: '/hero/ocasion-diario-mobile.webp',
    objPos: '70% center',
  },
  {
    key: 'jovenes',
    label: 'Para jóvenes',
    href: '/tienda?coleccion=joven',
    img: '/hero/ocasion-jovenes-desktop.webp',
    imgMobile: '/hero/ocasion-jovenes-mobile.webp',
    objPos: '70% center',
  },
]

export default function QuickOcasion() {
  return (
    <section className="qg-section qo-section">
      {OCASIONES.map(o => (
        <Link key={o.key} to={o.href} className="qg-tile">
          <picture className="qg-picture">
            <source media="(max-width: 767px)" srcSet={o.imgMobile} type="image/webp" />
            <img src={o.img} alt={o.label} className="qg-img" loading="lazy" style={o.objPos ? { objectPosition: o.objPos } : undefined} />
          </picture>
          <div className="qg-overlay" />
          <div className="qg-label-wrap">
            <span className="qg-label">{o.label}</span>
          </div>
        </Link>
      ))}
    </section>
  )
}
