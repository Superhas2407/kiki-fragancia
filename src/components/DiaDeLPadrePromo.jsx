import { Link } from 'react-router-dom'

export default function DiaDeLPadrePromo() {
  return (
    <section className="ddp-promo">
      <div className="ddp-promo-inner kiki-container">
        <div className="ddp-promo-text">
          <p className="ddp-promo-eyebrow">Día del Padre · 21 de junio</p>
          <h2 className="ddp-promo-headline">El regalo que no olvidará</h2>
          <div className="ddp-promo-rule" aria-hidden="true" />
          <p className="ddp-promo-body">
            Fragancias de lujo seleccionadas para él. Colección curada especialmente para el Día del Padre.
          </p>
          <Link to="/dia-del-padre" className="ddp-promo-btn">
            Ver la colección →
          </Link>
        </div>
        <div className="ddp-promo-visual" aria-hidden="true">
          <div className="ddp-promo-ring ddp-promo-ring-1" />
          <div className="ddp-promo-ring ddp-promo-ring-2" />
          <div className="ddp-promo-ring ddp-promo-ring-3" />
          <span className="ddp-promo-icon">🎁</span>
        </div>
      </div>
    </section>
  )
}
