import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { activeNovemberCampaigns } from '../data/november-campaigns'
import './BlackFridayPreview.css'

// Ruta experimental. No reemplaza la portada ni altera los tokens globales.
export default function BlackFridayPreview() {
  const offers = activeNovemberCampaigns(new Date())
  return (
    <main className="kbf26" id="black-friday-preview">
      <Helmet>
        <title>Black Edition — Vista previa | KiKi Fragancia</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="kbf26__ribbon">EVENTO BLACK FRIDAY <span aria-hidden="true">✦</span> PROMOCIONES ESPECIALES <span aria-hidden="true">✦</span> HASTA AGOTAR EXISTENCIAS</div>
      <section className="kbf26__hero" aria-labelledby="kbf26-title">
        <div className="kbf26__ambient" aria-hidden="true" />
        <picture className="kbf26__hero-photo">
          <img src="/black-friday/kiki-hero-desktop.webp" alt="Black Friday Kiki Fragancia: avión con pancarta, perfumes Nautica, Benetton y Antonio Banderas y promociones" fetchPriority="high" onError={event => event.currentTarget.parentElement.classList.add("is-missing")} />
        </picture>
        <div className="kbf26__hero-content kbf26__hero-content--with-photo">
          <p className="kbf26__overline">KIKI FRAGANCIA PRESENTA · BLACK FRIDAY 2026</p>
          <div className="kbf26__event-mark"><span className="kbf26__event-pulse" /> EVENTO ESPECIAL · STOCK LIMITADO</div>
          <h1 id="kbf26-title">BLACK<br /><span>FRIDAY.</span></h1>
          <p className="kbf26__lead">No es un viernes cualquiera.</p>
          <p className="kbf26__sublead">Tres fragancias. Precios extraordinarios. Una edición que no estará siempre aquí.</p>
          <a className="kbf26__button" href="#kbf26-promos">QUIERO VER LAS OFERTAS <span aria-hidden="true">↗</span></a>
          <p className="kbf26__hero-disclaimer">Promociones sujetas a disponibilidad · Sin fecha de cierre anunciada</p>
        </div>
        <div className="kbf26__hero-visual kbf26__hero-visual--with-photo" aria-hidden="true">
          <div className="kbf26__halo" />
          <span className="kbf26__monogram">BF<span>26</span></span>
          <div className="kbf26__visual-offer"><span>OFERTAS ESPECIALES</span><strong>3 × $60</strong><span>Y 3 × $90 EN 200 ML</span></div>
          <span className="kbf26__visual-caption">KIKI BLACK FRIDAY · POR TIEMPO LIMITADO</span>
        </div>
        <span className="kbf26__hero-index">01 / LA EDICIÓN</span>
      </section>
      <section className="kbf26__offers" id="kbf26-promos" aria-labelledby="kbf26-offers-title">
        <div className="kbf26__section-heading">
          <div><p className="kbf26__overline">02 / OFERTAS BLACK FRIDAY</p><h2 id="kbf26-offers-title">Esta vez,<br /><em>llévate tres.</em></h2></div>
          <p>No son descuentos de todos los días. Elige tu combinación mientras haya disponibilidad.</p>
        </div>
        <div className="kbf26__grid">
          {offers.map((offer, index) => (
            <article className="kbf26__offer" key={offer.id}>
              <div className="kbf26__offer-head"><span>ANTONIO BANDERAS</span><span>BLACK FRIDAY / 0{index + 1}</span></div>
              <div className="kbf26__offer-art" aria-hidden="true"><span>{offer.id === 'grande' ? '200 ML' : '3 × 60'}</span><small>EDICIÓN PROMOCIONAL</small></div>
              <div className="kbf26__offer-body">
                <p className="kbf26__offer-kicker">OFERTA ESPECIAL · 3 FRAGANCIAS POR</p>
                <div className="kbf26__price"><span>$</span>{offer.price}</div>
                <h3>{offer.title}</h3>
                <p className="kbf26__offer-size">{offer.size}</p>
                <p className="kbf26__offer-description">{offer.detail}</p>
                <a className="kbf26__offer-link" href="https://www.instagram.com/kiki_fragancia/" target="_blank" rel="noopener noreferrer">Escribe {offer.keyword} al DM <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </div>
        <p className="kbf26__limited-note">DISPONIBILIDAD LIMITADA · NO DEJES ESCAPAR TU COMBINACIÓN</p>
        <p className="kbf26__legal">Precios en USD · Sujeto a disponibilidad · Condiciones aplican · Caracas, Venezuela</p>
      </section>
      <section className="kbf26__closing">
        <p className="kbf26__overline">UNA FRAGANCIA, UN RECUERDO</p>
        <h2>Tu próxima historia<br /><em>empieza aquí.</em></h2>
        <Link to="/tienda" className="kbf26__button kbf26__button--outline">Explorar toda la colección <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  )
}
