import { Link } from 'react-router-dom'
import { usePromotions } from '../context/PromotionsContext'
import { usePromotionBanner } from '../hooks/usePromotionBanner'

// No older advertising calendar or static campaigns: only approved Sanity offers.
export default function BlackFridaySection() {
  const promotions = usePromotions()
  const banner = usePromotionBanner()
  if (!promotions.length) return null
  return (
    <section id="promociones" className={`bf-section${banner ? " bf-section--banner" : ""}`} aria-label="Promociones de Kiki Fragancia">
      {banner && <Link className="bf-banner-link" to="/tienda?promos=1" aria-label={banner.altText}>
        <picture className="bf-banner-picture">
          <source media="(max-width: 767px)" srcSet={banner.mobileUrl} />
          <img className="bf-banner-image" src={banner.desktopUrl} alt={banner.altText} decoding="async" loading="lazy" />
        </picture>
      </Link>}
      <div className="kiki-container bf-inner">
        <div className="bf-section-intro">
          <span className="bf-intro-line" aria-hidden="true" />
          <p className="bf-eyebrow">SELECCIÓN ESPECIAL · KIKI FRAGANCIA</p>
          <h2 className="bf-intro-title">Elige tu próximo favorito</h2>
          <p className="bf-intro-copy">Combina tus fragancias favoritas en nuestras ofertas vigentes.</p>
        </div>
        <div className="bf-offers">
          {promotions.map(promo => (
            <article className="bf-offer" key={promo.id}>
              <div className="bf-offer-topline">
                <p className="bf-offer-label">KIKI FRAGANCIA</p>
                <span className="bf-offer-tag">PROMOCIÓN VIGENTE</span>
              </div>
              <h3>{promo.name}</h3>
              <p className="bf-price">
                <span>{promo.count === 1 ? 'Precio especial' : promo.count + ' fragancias por'}</span>
                <strong>{'$' + promo.price}</strong>
              </p>
              {promo.conditions && <p className="bf-detail">{promo.conditions}</p>}
              <Link className="bf-cta" to={promo.count >= 2 ? '/promociones/' + promo.id : '/tienda?promos=1'}>
                <span>{promo.count >= 2 ? 'Armar combo' : 'Ver perfume'}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
        <p className="bf-conditions">Promociones en divisas · Solo modelos participantes · Sujeto a disponibilidad · Los Cortijos, Caracas</p>
      </div>
    </section>
  )
}
