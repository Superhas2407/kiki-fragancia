import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FAMILIAS = [
  { name: 'Amaderado',  count: 48, color: '#8B6914', desc: 'Cedro, sándalo y vetiver. Cálidos, secos y atemporales.' },
  { name: 'Oriental',   count: 36, color: '#C4722A', desc: 'Oud, ámbar y especias. Intensos y envolventes.' },
  { name: 'Floral',     count: 52, color: '#E8A0B4', desc: 'Rosa, jazmín y tuberosa. Románticos y luminosos.' },
  { name: 'Cítrico',    count: 29, color: '#F4C842', desc: 'Bergamota, limón y naranja. Frescos y vibrantes.' },
  { name: 'Gourmand',   count: 18, color: '#E8566C', desc: 'Vainilla, café y cacao. Dulces y adictivos.' },
  { name: 'Marino',     count: 14, color: '#7FB0C4', desc: 'Brisa salina y notas acuáticas. Limpios y libres.' },
  { name: 'Especiado',  count: 31, color: '#C4781A', desc: 'Pimienta, cardamomo y jengibre. Audaces y con carácter.' },
]

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
