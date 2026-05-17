import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { products } from '../data/products-enriched'

const FAMILIA_META = {
  'Amaderado':       { color: '#8B6914', desc: 'Cedro, sándalo y vetiver. Cálidos, secos y atemporales.' },
  'Oriental':        { color: '#C4722A', desc: 'Oud, ámbar y especias. Intensos y envolventes.' },
  'Floral':          { color: '#E8A0B4', desc: 'Rosa, jazmín y tuberosa. Románticos y luminosos.' },
  'Cítrico':         { color: '#F4C842', desc: 'Bergamota, limón y naranja. Frescos y vibrantes.' },
  'Gourmand':        { color: '#E8566C', desc: 'Vainilla, café y cacao. Dulces y adictivos.' },
  'Aromático':       { color: '#7CB9A8', desc: 'Lavanda, romero y salvia. Frescos, herbáceos y limpios.' },
  'Floral Amaderado':{ color: '#C9A0A8', desc: 'Flores sobre base de madera. Elegantes y sofisticados.' },
  'Floral Frutal':   { color: '#E8A86C', desc: 'Pétalos y frutos. Alegres, frescos y femeninos.' },
  'Floral Oriental': { color: '#C48B5A', desc: 'Flores con especias y ámbar. Sensuales y complejos.' },
  'Frutal':          { color: '#E87A6C', desc: 'Durazno, pera y frutos rojos. Vivaces y golosos.' },
  'Frutal Amaderado':{ color: '#B09070', desc: 'Frutos sobre madera. Modernos y equilibrados.' },
}

const FAMILIAS = Object.keys(FAMILIA_META).map(name => ({
  name,
  color: FAMILIA_META[name].color,
  desc:  FAMILIA_META[name].desc,
  count: products.filter(p => p.familia === name).length,
})).filter(f => f.count > 0)

function RevealWrap({ children, delay = 0 }) {
  const ref = useScrollReveal({ delay })
  return <div ref={ref}>{children}</div>
}

export default function FamiliasSection() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 270, behavior: 'smooth' })
  }

  return (
    <section className="familias-section section-pad">
      <div className="familias-head-pad">
        <RevealWrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div className="gold-line"></div>
            <span className="eyebrow-gold" style={{ marginBottom: 0 }}>Por familia olfativa</span>
          </div>
          <h2 className="kiki-section-title title-light" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            Encuentra tu fragancia
          </h2>
        </RevealWrap>
      </div>

      <div className="familias-scroll" ref={scrollRef}>
        <div className="familias-track">
          {FAMILIAS.map((f, i) => (
            <Link
              key={f.name}
              to={`/tienda?familia=${encodeURIComponent(f.name)}`}
              className="familia-card"
              style={{
                borderColor: `${f.color}30`,
                animationDelay: `${i * 60}ms`,
                textDecoration: 'none',
              }}
            >
              <div className="familia-count" style={{ color: `${f.color}55` }}>
                {String(f.count).padStart(2, '0')}
              </div>
              <div className="familia-name">{f.name}</div>
              <div className="familia-divider" style={{ background: `${f.color}60` }}></div>
              <p className="familia-desc">{f.desc}</p>
              <div className="familia-bg-circle" style={{ background: f.color }}></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="familias-arrows">
        <button className="familias-arrow" onClick={() => scroll(-1)} aria-label="Anterior">←</button>
        <button className="familias-arrow" onClick={() => scroll(1)} aria-label="Siguiente">→</button>
      </div>
    </section>
  )
}
