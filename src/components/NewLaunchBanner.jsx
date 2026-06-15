import { Link } from 'react-router-dom'

const WA_NUMBER = '584149112002'
const WA_MSG = encodeURIComponent(
  'Hola! Vi el nuevo lanzamiento de Carolina Herrera en la web. ¿Cuándo estará disponible y cuánto cuesta?'
)
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}&ref=new_launch_ch`

// Placeholder: cuando el producto esté en Sanity, reemplazar PRODUCT_SLUG
// con el slug real (ej: 'carolina-herrera-good-girl-blush-100ml')
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
        <p className="nlb-eyebrow">— Nuevo lanzamiento</p>
        <h2 className="nlb-title">NUEVO LANZAMIENTO</h2>
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
