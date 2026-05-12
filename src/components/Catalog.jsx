import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { products } from '../data/products-enriched'

function ProductCard({ product, delay }) {
  const ref = useScrollReveal({ threshold: 0.08, delay })
  const [hovered, setHovered] = useState(false)

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#EDE8DF',
        display: 'flex', flexDirection: 'column',
        boxShadow: hovered
          ? '0 20px 48px rgba(10,6,2,0.14), 0 4px 12px rgba(10,6,2,0.08)'
          : '0 2px 8px rgba(10,6,2,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
      }}
    >
      {/* Imagen */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
        <img
          src={`/products/${product.image}`}
          alt={`${product.house} ${product.name}`}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {/* Overlay hover con familia */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered ? 'rgba(10,6,2,0.42)' : 'rgba(10,6,2,0)',
          transition: 'background 0.4s ease',
          display: 'flex', alignItems: 'flex-end', padding: '20px',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C9A84C',
            border: '1px solid rgba(201,168,76,0.6)',
            padding: '4px 10px',
            background: 'rgba(10,6,2,0.6)',
            backdropFilter: 'blur(4px)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
          }}>
            {product.familia}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '22px 20px 20px', gap: 0 }}>

        {/* Casa */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
          margin: '0 0 8px',
        }}>
          {product.house}
        </p>

        {/* Nombre */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.15,
          color: '#0A0A0A',
          margin: '0 0 10px',
        }}>
          {product.name}
        </h3>

        {/* Tipo + ml */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px', fontWeight: 300,
          color: 'rgba(10,10,10,0.38)',
          letterSpacing: '0.04em',
          margin: '0 0 14px',
        }}>
          {[product.ml && `${product.ml} ml`, product.tipo].filter(Boolean).join(' · ')}
        </p>

        {/* Precio */}
        {product.price && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px', fontWeight: 400,
            color: '#C4781A',
            margin: '0 0 18px',
          }}>
            {product.price}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Divisor */}
        <div style={{ height: '1px', background: 'rgba(10,10,10,0.08)', margin: '0 0 16px' }} />

        {/* CTA */}
        <Link
          to={`/tienda/${product.id}`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
            textDecoration: 'none',
            color: hovered ? '#C4781A' : 'rgba(10,10,10,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'color 0.25s ease',
          }}
        >
          Ver producto
          <span style={{
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
            color: '#C4781A',
          }}>→</span>
        </Link>
      </div>
    </article>
  )
}

export default function Catalog() {
  const headRef = useScrollReveal({ threshold: 0.15 })
  const [linkHover, setLinkHover] = useState(false)

  return (
    <section id="catalogo" className="catalog-section" style={{ background: '#F2EEE6', padding: '120px 0' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div
          ref={headRef}
          style={{
            display: 'flex', flexDirection: 'column', gap: '8px',
            marginBottom: '64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '1px', background: '#C4781A' }} />
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#C4781A', margin: 0,
            }}>
              Esta semana en KiKi
            </p>
          </div>

          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(34px, 5vw, 50px)',
              fontWeight: 400, fontStyle: 'italic',
              letterSpacing: '-0.02em', lineHeight: 1.08,
              color: '#0A0A0A', margin: 0,
            }}>
              Lo que estamos<br />vendiendo ahora
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem', fontWeight: 300, lineHeight: 1.75,
              color: 'rgba(10,10,10,0.60)',
              margin: '20px 0 0',
            }}>
              Todo lo que ves aquí, lo tenemos. Todo lo que vendemos, lo conocemos.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}
          className="md:grid-cols-3"
        >
          {products.filter(p => p.featured).map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 90} />
          ))}
        </div>

        {/* Ver catálogo */}
        <div style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/tienda"
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: linkHover ? '#0A0A0A' : 'rgba(10,10,10,0.45)',
              border: `1px solid ${linkHover ? 'rgba(10,10,10,0.35)' : 'rgba(10,10,10,0.15)'}`,
              padding: '13px 36px',
              transition: 'color 0.25s ease, border-color 0.25s ease',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
            }}
          >
            Ver catálogo completo
            <span style={{
              color: '#C4781A',
              transform: linkHover ? 'translateX(4px)' : 'translateX(0)',
              transition: 'transform 0.3s ease',
            }}>→</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
