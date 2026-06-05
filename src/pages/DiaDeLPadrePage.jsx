import { useRef, useState } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { allProducts } from '../data/all-products'
import { diaDeLPadreIds, diaDeLPadreDiscounts } from '../data/dia-del-padre'
import VitrinaCard from '../components/VitrinaCard'
import { useCartContext } from '../context/CartContext'
import GiftWrapOverlay, { useShowWraps } from '../components/GiftWrapOverlay'

const WA_NUMBER = '584149112002'
const WA_MSG = encodeURIComponent(
  'Hola Kiki! 🎁 Quiero regalarle una fragancia a mi papá por el Día del Padre 2026. ' +
  '¿Me pueden asesorar para elegir la indicada según su estilo?'
)
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}&ref=dia_del_padre`

const EDITOR_PICK_ID = 412

const PERSONAS = [
  {
    num: '01',
    label: 'El Clásico',
    headline: 'Maderas, ámbar, sobrio',
    desc: 'El padre de saco y reloj. Fragancias atemporales que no se discuten.',
    ids: [375, 346, 376],
  },
  {
    num: '02',
    label: 'El Aventurero',
    headline: 'Frescos, cítricos, libres',
    desc: 'Carro abierto y ventanas abiertas. Aromas que respiran salitre y bosque.',
    ids: [391, 366, 410],
  },
  {
    num: '03',
    label: 'El Sibarita',
    headline: 'Especiados, intensos',
    desc: 'Tabaco, oud y noches largas. Para el padre que sabe lo que pide.',
    ids: [412, 377, 367],
  },
  {
    num: '04',
    label: 'El Fresco',
    headline: 'Cítrico, limpio, vital',
    desc: 'Energía desde la primera hora. Aromas que acompañan todo el día sin cansar.',
    ids: [4, 5, 61],
  },
  {
    num: '05',
    label: 'El Elegante',
    headline: 'Floral amaderado, refinado',
    desc: 'Presencia sin esfuerzo. El tipo que huele bien en cualquier reunión.',
    ids: [19, 26, 43],
  },
  {
    num: '06',
    label: 'El Misterioso',
    headline: 'Oriental, profundo, seductor',
    desc: 'Ámbar, especias y algo que no puedes definir. Fragancias que se recuerdan.',
    ids: [27, 30, 88],
  },
]

function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((target - now) / 86400000))
}


const CornerBracket = ({ pos }) => {
  const isTop = pos.includes('t')
  const isLeft = pos.includes('l')
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', zIndex: 2,
      [isTop ? 'top' : 'bottom']: 16,
      [isLeft ? 'left' : 'right']: 16,
      width: 22, height: 22,
      borderTop: isTop ? '1.5px solid rgba(201,168,76,.7)' : 'none',
      borderBottom: !isTop ? '1.5px solid rgba(201,168,76,.7)' : 'none',
      borderLeft: isLeft ? '1.5px solid rgba(201,168,76,.7)' : 'none',
      borderRight: !isLeft ? '1.5px solid rgba(201,168,76,.7)' : 'none',
    }} />
  )
}

export default function DiaDeLPadrePage() {
  const gridRef  = useRef(null)
  const guideRef = useRef(null)
  const { addItem } = useCartContext()
  const showWraps = useShowWraps()
  const navigate = useNavigate()
  const { currency } = useCurrency()

const todosLosMasculinos = diaDeLPadreIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean)

  const featured = allProducts.find(p => p.id === EDITOR_PICK_ID)

  const daysLeft     = daysUntil('2026-06-18')
  const daysUntilDad = daysUntil('2026-06-21')

  function scrollToGrid()  { gridRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  function scrollToGuide() { guideRef.current?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <main className="ddp-page">
      <Helmet>
        <title>Día del Padre 2026 — Fragancias de Lujo para Papá · KiKi Fragancia</title>
        <meta name="description" content="10 fragancias curadas para el Día del Padre 2026. Pide antes del 18 de junio y llega a tiempo. Antonio Banderas 100% originales." />
        <link rel="canonical" href="https://kikifragancia.com/dia-del-padre" />
        <meta property="og:title" content="Día del Padre 2026 — KiKi Fragancia" />
        <meta property="og:description" content="Una fragancia que él recordará cada vez que se vista. 10 ediciones curadas, una para cada tipo de padre." />
        <meta property="og:image" content="https://kikifragancia.com/hero/ysl-desktop.jpg" />
        <meta property="og:url" content="https://kikifragancia.com/dia-del-padre" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="ddp-hero">
        <div className="ddp-hero-left">
          <p className="ddp-eyebrow">— Edición Día del Padre · 2026</p>
          <h1 className="ddp-headline">El abrazo<br />que dura<br />en la piel.</h1>
          <p className="ddp-subhead">
            Una fragancia que él recordará cada vez que se vista.<br />
            10 ediciones curadas, una para cada tipo de padre.
          </p>
          <div className="ddp-hero-ctas">
            <button className="ddp-cta-primary" onClick={scrollToGrid}>Ver la colección →</button>
            <button className="ddp-cta-outline" onClick={scrollToGuide}>Guía de regalo</button>
          </div>
        </div>

        <div className="ddp-hero-editorial">
          <img src="/ddp-editorial.jpg" alt="" aria-hidden="true" className="ddp-editorial-photo" />
          <div className="ddp-editorial-overlay" aria-hidden="true" />
          <CornerBracket pos="tl" />
          <CornerBracket pos="tr" />
          <CornerBracket pos="bl" />
          <CornerBracket pos="br" />
          <div className="ddp-editorial-caption">
            <p className="ddp-editorial-caption-eyebrow">— Día del Padre · 2026</p>
            <p className="ddp-editorial-caption-text">Un abrazo que<br />dura en la piel.</p>
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section className="ddp-countdown">
        <div className="ddp-countdown-item">
          <span className="ddp-count-num">{daysUntilDad}</span>
          <span className="ddp-count-label">días restantes</span>
        </div>
        <div className="ddp-countdown-sep" />
        <div className="ddp-countdown-item">
          <span className="ddp-count-label">Pedido antes del</span>
          <span className="ddp-count-date">18 de junio · entrega a tiempo</span>
        </div>
        <div className="ddp-countdown-sep" />
        <div className="ddp-countdown-item">
          <span className="ddp-count-label">Exclusivo</span>
          <span className="ddp-count-date">regalo · sin costo</span>
        </div>
      </section>

      {/* ── Guía de regalo ── */}
      <section className="ddp-guide" ref={guideRef}>
        <div className="kiki-container">
          <div className="ddp-section-head">
            <p className="ddp-section-eyebrow">Guía de Regalo</p>
            <h2 className="ddp-section-title">¿Qué tipo de papá?</h2>
            <p className="ddp-section-sub">
              Hay un perfume para cada historia. Elige por su estilo y te llevamos a la sección curada.
            </p>
          </div>
          <div className="ddp-personas">
            {PERSONAS.map(({ num, label, headline, desc, ids }) => {
              const coverProduct = allProducts.find(x => x.id === ids[0])
              return (
                <div key={num} style={{ position: 'relative' }}>
                  <Link
                    to={`/tienda/${ids[0]}`}
                    className="ddp-persona-card"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    {coverProduct?.image && (
                      <img
                        src={`/products/${coverProduct.image}`}
                        alt={coverProduct.name}
                        className="ddp-persona-cover-img"
                      />
                    )}
                    <div className="ddp-persona-body">
                      <p className="ddp-persona-num-label">{num} · {label.toUpperCase()}</p>
                      <h3 className="ddp-persona-headline">{headline}</h3>
                      <p className="ddp-persona-desc">{desc}</p>
                      <span className="ddp-persona-link">Ver fragancia →</span>
                    </div>
                  </Link>
                  {showWraps && <GiftWrapOverlay />}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Editor's Pick ── */}
      {featured && (
        <section className="ddp-featured">
          <div className="kiki-container">
            <div className="ddp-featured-card">
              <div className="ddp-featured-img-wrap" style={{ position: 'relative' }}>
                <p className="ddp-featured-num">N° 004</p>
                {featured.image && (
                  <img
                    src={`/products/${featured.image}`}
                    alt={featured.name}
                    className="ddp-featured-img"
                  />
                )}
                <div className="ddp-featured-img-labels">
                  <span>FRAGANCIA</span>
                  <span>EDP · 100 ML</span>
                </div>
                {showWraps && <GiftWrapOverlay />}
              </div>
              <div className="ddp-featured-info">
                <p className="ddp-featured-pick">★ Editor's Pick</p>
                <p className="ddp-featured-brand">★ {featured.house}</p>
                <h2 className="ddp-featured-title">{featured.name}</h2>
                <p className="ddp-featured-quote">
                  "Cuero, tabaco y un fondo de bourbon. La fragancia más vendida de la colección — un clásico moderno que cruza generaciones."
                </p>
                {featured.precioUSD > 0 && (
                  <p className="ddp-featured-price">
                    <span className="ddp-featured-price-num">REF {featured.precioUSD}</span>
                    <span className="ddp-featured-price-meta">EDP · 100 ML</span>
                  </p>
                )}
                <div className="ddp-featured-actions">
                  <Link to={`/tienda/${featured.id}`} className="ddp-btn-primary">
                    Ver detalle →
                  </Link>
                  <button
                    className="ddp-btn-outline"
                    onClick={() => addItem(featured)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Grid ── */}
      <section ref={gridRef} className="ddp-grid-section">
        <div className="kiki-container">
          <div className="ddp-grid-header">
            <div>
              <p className="ddp-section-eyebrow">Colección Completa</p>
              <h2 className="ddp-grid-title">{todosLosMasculinos.length} fragancias para él</h2>
            </div>
            <p className="ddp-grid-meta">REF 25 — REF 30 · 100 ml</p>
          </div>
          <div className="diadel-padre-grid">
            {todosLosMasculinos.map((p, i) => (
              <VitrinaCard
                key={p.id}
                product={p}
                ribbon={currency === 'usd' ? (diaDeLPadreDiscounts[p.id] ? `${diaDeLPadreDiscounts[p.id]}% EXTRA · DÍA DEL PADRE` : 'DÍA DEL PADRE') : null}
                ribbonVariant={currency === 'usd' ? 'ddp' : null}
                discount={currency === 'usd' ? (diaDeLPadreDiscounts[p.id] || null) : null}
                badge={p.id === EDITOR_PICK_ID ? 'Editor\'s pick' : (i === 0 ? 'Más vendido' : null)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="ddp-wa-section">
        <div className="ddp-wa-inner">
          <p className="ddp-wa-eyebrow">¿No sabes cuál elegir?</p>
          <h2 className="ddp-wa-title">Te ayudamos a encontrar el perfecto para él</h2>
          <p className="ddp-wa-sub">Respondemos en menos de 2 horas · {daysLeft > 0 ? `${daysLeft} días para pedir a tiempo` : 'Últ. días para entrega garantizada'}</p>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="ddp-btn-wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </section>

    </main>
  )
}
