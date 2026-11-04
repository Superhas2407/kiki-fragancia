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
          <h2 id="bf-title">Noviembre se vive<br /><em>en grande.</em></h2>
          <p>Tres fragancias. Tu combinación.<br />Descubre las promos de Antonio Banderas.</p>
        </div>
        <div className="bf-offers">
          {activeNovemberCampaigns(now).map(c => (
            <article className="bf-offer" key={c.id}>
              <p className="bf-offer-label">ANTONIO BANDERAS</p>
              <h3>{c.title}</h3>
              <p className="bf-price"><span>3 por</span> ${c.price}</p>
              <p className="bf-size">{c.size}</p>
              <p className="bf-detail">{c.detail}</p>
              <a className="bf-cta" href="https://www.instagram.com/kiki_fragancia/" target="_blank" rel="noopener noreferrer">
                Escribe <strong>{c.keyword}</strong> al DM <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="bf-conditions">Precios promocionales en divisas. Sujeto a disponibilidad. Consulta las condiciones al armar tu combo.</p>
      </div>
    </section>
  )
}
