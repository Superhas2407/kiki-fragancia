import { Link } from 'react-router-dom'

const GENEROS = [
  {
    key: 'Masculino',
    label: 'Para él',
    sub: 'Fragancias masculinas',
    symbol: '♂',
    href: '/tienda?genero=Masculino',
  },
  {
    key: 'Femenino',
    label: 'Para ella',
    sub: 'Fragancias femeninas',
    symbol: '♀',
    href: '/tienda?genero=Femenino',
  },
  {
    key: 'Unisex',
    label: 'Unisex',
    sub: 'Para cualquier ocasión',
    symbol: '∞',
    href: '/tienda?genero=Unisex',
  },
]

export default function QuickGenero() {
  return (
    <section className="quick-genero-section">
      <div className="quick-genero-inner">
        <p className="quick-genero-eyebrow">¿Para quién?</p>
        <div className="quick-genero-grid">
          {GENEROS.map(g => (
            <Link key={g.key} to={g.href} className="quick-genero-tile">
              <span className="quick-genero-symbol">{g.symbol}</span>
              <span className="quick-genero-label">{g.label}</span>
              <span className="quick-genero-sub">{g.sub}</span>
              <span className="quick-genero-cta">Ver fragancias →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
