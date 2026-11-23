import { Link } from 'react-router-dom'
import { usePromotions } from '../context/PromotionsContext'

// No older advertising calendar or static campaigns: only approved Sanity offers.
export default function BlackFridaySection() {
  const promotions = usePromotions()
  if (!promotions.length) return null
  return (
    <section id="promociones" className="bf-section" aria-labelledby="bf-title">
      <div className="kiki-container">
        <p className="bf-eyebrow">KIKI FRAGANCIA · PROMOCIONES</p>
        <div className="bf-heading">
          <h2 id="bf-title">Promociones <em>especiales.</em></h2>
          <p>Ofertas vigentes seleccionadas por Kiki Fragancia.<br />Elige tus perfumes participantes según disponibilidad.</p>
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
