import { useEffect, useState } from 'react'
import { activeNovemberCampaigns } from '../data/november-campaigns'

export default function BlackFridaySection() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])
  return (
    <section id="promociones" className="bf-section" aria-labelledby="bf-title">
      <div className="kiki-container">
        <p className="bf-eyebrow">BLACK FRIDAY · KIKI FRAGANCIA</p>
        <div className="bf-heading">
          <h2 id="bf-title">Black Friday,<br /><em>en grande.</em></h2>
          <p>Promociones seleccionadas de Antonio Banderas.<br />Elige tu combinación y escríbenos al DM.</p>
        </div>
        <div className="bf-offers">
          {activeNovemberCampaigns(now).map(c => (
            <article className={`bf-offer bf-offer--${c.id}`} key={c.id}>
              <div className="bf-offer-topline">
                <p className="bf-offer-label">ANTONIO BANDERAS</p>
                <span className="bf-offer-tag">PROMO {c.id === 'grande' ? 'XL' : 'SELECCIÓN'}</span>
              </div>
              <h3>{c.title}</h3>
              <p className="bf-price"><span>3 fragancias por</span> <strong>${c.price}</strong></p>
              <p className="bf-size">{c.size}</p>
              <p className="bf-detail">{c.detail}</p>
              <a className="bf-cta" href="https://www.instagram.com/kiki_fragancia/" target="_blank" rel="noopener noreferrer">
                <span>Escribe</span> <strong>{c.keyword}</strong> <span>al DM</span> <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="bf-conditions">Precio promocional en divisas · Sujeto a disponibilidad · Ciertas condiciones aplican · Los Cortijos, Caracas</p>
      </div>
    </section>
  )
}
