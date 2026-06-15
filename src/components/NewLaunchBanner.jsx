import { Link } from 'react-router-dom'

const WA_NUMBER = '584149112002'
const WA_MSG = encodeURIComponent(
  'Hola! Vi el nuevo lanzamiento de Carolina Herrera en la web. ¿Cuándo estará disponible y cuánto cuesta?'
)
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}&ref=new_launch_ch`

// Cuando el producto esté en Sanity, poner el slug real aquí
const PRODUCT_SLUG = null

export default function NewLaunchBanner() {
  return (
    <section className="nlb-section">
      <picture className="nlb-picture">
        <source media="(max-width: 767px)" srcSet="/hero/carolina-herrera-mobile.webp" type="image/webp" />
        <source srcSet="/hero/carolina-herrera-desktop.webp" type="image/webp" />
        <img
          src="/hero/carolina-herrera-desktop.webp"
          alt="Nuevo lanzamiento — Carolina Herrera"
          className="nlb-img"
          loading="lazy"
        />
      </picture>

      <div className="nlb-overlay" aria-hidden="true" />

      <div className="nlb-content">
        <h2 className="nlb-title">Llegando a<br />KiKi Fragancia</h2>
        <p className="nlb-name">CAROLINA HERRERA</p>
        <div className="nlb-ctas">
          {PRODUCT_SLUG ? (
            <Link to={`/tienda/${PRODUCT_SLUG}`} className="nlb-btn-primary">
              Ver fragancia
            </Link>
          ) : (
            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="nlb-btn-primary">
              Notificarme
            </a>
          )}
          <Link to="/tienda?tipo=disenador" className="nlb-btn-outline">
            Explorar colección
          </Link>
        </div>
      </div>
    </section>
  )
}
