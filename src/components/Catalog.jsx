import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { products } from '../data/products-enriched'

function ProductCard({ product, delay }) {
  const ref = useScrollReveal({ threshold: 0.1, delay })

  return (
    <article
      ref={ref}
      className="group flex flex-col"
      style={{
        background: '#EDE5D8',
        border: '1px solid rgba(196,120,26,0.12)',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#C4781A'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(196,120,26,0.12)'}
    >
      {/* Imagen */}
      <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img
          src={`/products/${product.image}`}
          alt={`${product.house} ${product.name}`}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.55s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Badge */}
        <span
          className="font-sans self-start"
          style={{
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C4781A',
            border: '1px solid rgba(196,120,26,0.4)',
            padding: '3px 8px',
          }}
        >
          Disponible
        </span>

        {/* Casa */}
        <p
          className="font-sans text-carbon/40"
          style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          {product.house}
        </p>

        {/* Nombre */}
        <h3
          className="font-display text-carbon leading-tight"
          style={{ fontSize: '21px', fontWeight: 400, letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h3>

        {/* Precio */}
        {product.price && (
          <p
            className="font-display"
            style={{ fontSize: '20px', color: '#C4781A', fontWeight: 400 }}
          >
            {product.price}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <Link
          to={`/tienda/${product.id}`}
          className="font-sans text-carbon hover:text-gold transition-colors duration-200 flex items-center gap-2 mt-1"
          style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          Ver producto
          <span style={{ color: '#C4781A' }}>→</span>
        </Link>
      </div>
    </article>
  )
}

export default function Catalog() {
  const headRef = useScrollReveal({ threshold: 0.2 })

  return (
    <section id="catalogo" style={{ background: '#F3F1EC', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p
              className="font-sans uppercase tracking-[0.25em] mb-4"
              style={{ fontSize: '10px', color: '#C4781A' }}
            >
              Esta semana en KiKi
            </p>
            <h2
              className="font-display text-carbon"
              style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}
            >
              Lo que estamos<br />vendiendo ahora
            </h2>
          </div>

          <p
            className="font-sans text-carbon/45 max-w-xs"
            style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.7 }}
          >
            Todo lo que ves aquí, lo tenemos. Todo lo que vendemos, lo conocemos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.filter(p => p.featured).map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 80} />
          ))}
        </div>

        {/* Línea inferior */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/tienda"
            className="font-sans text-carbon/50 hover:text-gold transition-colors duration-200"
            style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Ver Catálogo Completo →
          </Link>
        </div>

      </div>
    </section>
  )
}
