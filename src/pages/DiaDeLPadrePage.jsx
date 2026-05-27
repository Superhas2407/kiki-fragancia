import { useEffect, useRef } from 'react'
import { allProducts } from '../data/all-products'
import { diaDeLPadreIds } from '../data/dia-del-padre'
import VitrinaCard from '../components/VitrinaCard'

const MSG = encodeURIComponent(
  'Hola Kiki! Busco una fragancia de regalo para mi papá\n' +
  'por el Día del Padre. ¿Me pueden ayudar a elegir?'
)

const WA_HREF = `https://wa.me/584149112002?text=${MSG}`

export default function DiaDeLPadrePage() {
  const gridRef = useRef(null)

  useEffect(() => {
    document.title = 'Día del Padre 2026 — Kiki Fragancia'

    const setMeta = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title', 'Día del Padre 2026 — Kiki Fragancia')
    setMeta('og:description', 'Fragancias de lujo para regalar a papá. Colección curada · Día del Padre 2026.')
    setMeta('og:url', 'https://kikifragancia.com/dia-del-padre')
    setMeta('og:image', 'https://kikifragancia.com/hero/ysl-desktop.jpg')

    return () => {
      document.title = 'Kiki Fragancia'
    }
  }, [])

  const productos = diaDeLPadreIds
    .map(id => {
      const p = allProducts.find(p => p.id === id)
      if (!p && import.meta.env.DEV) console.warn('[DiaDeLPadre] ID no encontrado:', id)
      return p
    })
    .filter(Boolean)

  function scrollToGrid() {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="ddp-page">

      {/* ── Hero ── */}
      <section className="ddp-hero">
        <div className="ddp-hero-inner">
          <p className="ddp-eyebrow">Día del Padre 2026</p>
          <h1 className="ddp-headline">El regalo que no olvidará</h1>
          <div className="ddp-gold-rule" aria-hidden="true" />
          <p className="ddp-subhead">Fragancias de lujo para papá · Día del Padre 2026</p>
          <button className="ddp-cta-scroll" onClick={scrollToGrid}>
            Ver la colección
          </button>
        </div>
      </section>

      {/* ── Grid curado ── */}
      <section ref={gridRef} className="ddp-grid-section">
        <div className="kiki-container">
          {productos.length === 0 ? (
            <p className="ddp-empty">Colección próximamente.</p>
          ) : (
            <div className="diadel-padre-grid">
              {productos.map(p => (
                <VitrinaCard key={p.id} product={p} badge="Para papá" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="ddp-wa-section">
        <div className="ddp-wa-inner">
          <p className="ddp-wa-title">¿No sabes cuál elegir?</p>
          <p className="ddp-wa-sub">Escríbenos y te ayudamos a elegir el perfecto para él</p>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-padre"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      {/* ── Footer de ocasión ── */}
      <div className="ddp-footer-note">
        Pedidos antes del 18 de junio para entrega a tiempo
      </div>

    </main>
  )
}
