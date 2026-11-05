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
      <div className="kbf26__ribbon">BLACK FRIDAY 2026 <span aria-hidden="true">✦</span> KIKI FRAGANCIA <span aria-hidden="true">✦</span> EDICIÓN ESPECIAL</div>
      <section className="kbf26__hero" aria-labelledby="kbf26-title">
        <div className="kbf26__ambient" aria-hidden="true" />
        <div className="kbf26__hero-content">
          <p className="kbf26__overline">KIKI FRAGANCIA / EDICIÓN LIMITADA</p>
          <h1 id="kbf26-title">BLACK<br /><span>EDITION.</span></h1>
          <p className="kbf26__lead">El lujo de elegir más.</p>
          <p className="kbf26__sublead">Las fragancias que dejan recuerdos, ahora con promociones especiales.</p>
          <a className="kbf26__button" href="#kbf26-promos">Descubrir las promociones <span aria-hidden="true">↗</span></a>
        </div>
        <div className="kbf26__hero-visual" aria-hidden="true">
          <div className="kbf26__halo" />
          <span className="kbf26__monogram">BLACK</span>
          <span className="kbf26__visual-caption">THE BLACK FRIDAY EDITION · 2026</span>
        </div>
        <span className="kbf26__hero-index">01 / LA EDICIÓN</span>
      </section>
      <section className="kbf26__offers" id="kbf26-promos" aria-labelledby="kbf26-offers-title">
        <div className="kbf26__section-heading">
          <div><p className="kbf26__overline">02 / PROMOCIONES SELECCIONADAS</p><h2 id="kbf26-offers-title">Elige más.<br /><em>Recuerda siempre.</em></h2></div>
          <p>Ofertas disponibles según existencias. Escríbenos para conocer las fragancias participantes.</p>
        </div>
        <div className="kbf26__grid">
          {offers.map((offer, index) => (
            <article className="kbf26__offer" key={offer.id}>
              <div className="kbf26__offer-head"><span>ANTONIO BANDERAS</span><span>0{index + 1} / SELECCIÓN</span></div>
              <div className="kbf26__offer-art" aria-hidden="true"><span>{offer.id === 'grande' ? 'XL' : '03'}</span></div>
              <div className="kbf26__offer-body">
                <p className="kbf26__offer-kicker">TRES FRAGANCIAS POR</p>
                <div className="kbf26__price"><span>$</span>{offer.price}</div>
                <h3>{offer.title}</h3>
                <p className="kbf26__offer-size">{offer.size}</p>
                <p className="kbf26__offer-description">{offer.detail}</p>
                <a className="kbf26__offer-link" href="https://www.instagram.com/kiki_fragancia/" target="_blank" rel="noopener noreferrer">Escribe {offer.keyword} al DM <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </div>
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
