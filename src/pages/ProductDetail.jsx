import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { products } from '../data/products'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NOTAS_POR_FAMILIA = {
  'Oriental':   ['Oud', 'Vainilla', 'Ámbar', 'Almizcle', 'Sándalo'],
  'Floral':     ['Rosa', 'Jazmín', 'Peonia', 'Iris', 'Nardo'],
  'Amaderado':  ['Sándalo', 'Cedro', 'Vetiver', 'Pachuli', 'Cachemira'],
  'Fresco':     ['Bergamota', 'Limón', 'Pomelo', 'Menta', 'Ozono'],
  'Acuático':   ['Brisa marina', 'Algas marinas', 'Ozono', 'Musgo de agua', 'Notas salinas'],
  'Especiado':  ['Cardamomo', 'Pimienta negra', 'Canela', 'Jengibre', 'Clavo'],
  'Aromático':  ['Lavanda', 'Romero', 'Salvia', 'Tomillo', 'Geranio'],
  'Gourmand':   ['Vainilla', 'Caramelo', 'Chocolate', 'Café', 'Miel'],
  'Cítrico':    ['Limón', 'Bergamota', 'Naranja', 'Lima', 'Mandarina'],
  'Aldehídico': ['Aldehídos', 'Rosa', 'Lirio de los valles', 'Iris', 'Violeta'],
  'Chipre':     ['Musgos de roble', 'Labdano', 'Bergamota', 'Pachuli', 'Rosa'],
  'Fougère':    ['Lavanda', 'Bergamota', 'Musgo de roble', 'Cumarina', 'Geranio'],
}
const DEFAULT_NOTAS = ['Oud', 'Ámbar', 'Almizcle', 'Sándalo', 'Vainilla']

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCartContext()
  const [added, setAdded] = useState(false)

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: '#F5F0E8' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontStyle: 'italic', color: 'rgba(10,10,10,0.3)' }}>
            Fragancia no encontrada
          </p>
          <Link to="/tienda" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>
            ← Volver al catálogo
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const notas = NOTAS_POR_FAMILIA[product.familia] || DEFAULT_NOTAS
  const whatsappMsg = encodeURIComponent(`Hola! Me interesa el perfume *${product.house} ${product.name}*. ¿Podrías darme más información?`)
  const whatsappUrl = `https://wa.me/584120221983?text=${whatsappMsg}`

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <Header />

      <div style={{ background: '#F5F0E8', minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
            <Link
              to="/tienda"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(10,10,10,0.4)'}
            >
              Catálogo
            </Link>
            <span style={{ color: 'rgba(10,10,10,0.2)', fontSize: '12px' }}>→</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.55)' }}>
              {product.name}
            </span>
          </div>

          {/* Layout principal */}
          <div className="product-detail-layout" style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>

            {/* Imagen */}
            <div className="product-detail-img" style={{ width: '420px', flexShrink: 0 }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={`/products/${product.image}`}
                  alt={`${product.house} ${product.name}`}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'rgba(10,10,10,0.72)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C' }}>
                    Original Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '8px' }}>

              {/* Casa */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '12px' }}>
                {product.house}
              </p>

              {/* Nombre */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(36px, 4vw, 54px)',
                fontWeight: 400, fontStyle: 'italic',
                color: '#0A0A0A',
                letterSpacing: '-0.03em', lineHeight: 1.05,
                margin: 0, marginBottom: '16px',
              }}>
                {product.name}
              </h1>

              {/* Precio */}
              {product.price && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: '#C9A84C', letterSpacing: '-0.02em', marginBottom: '20px' }}>
                  {product.price}
                </p>
              )}

              {/* Chips de metadata */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {[product.familia, product.tipo, product.genero].filter(Boolean).map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    border: '1px solid rgba(10,10,10,0.15)',
                    padding: '4px 10px', color: 'rgba(10,10,10,0.5)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Descripción */}
              {product.descripcion && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px', fontWeight: 300,
                  color: 'rgba(10,10,10,0.6)', lineHeight: 1.75,
                  marginBottom: '32px', maxWidth: '480px',
                }}>
                  {product.descripcion}
                </p>
              )}

              {/* Notas olfativas */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <span style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', margin: 0 }}>
                    Notas olfativas
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {notas.map((nota, i) => (
                    <span key={nota} style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px', fontWeight: 300,
                      color: i === 0 ? '#C9A84C' : 'rgba(10,10,10,0.55)',
                      background: i === 0 ? 'rgba(201,168,76,0.08)' : 'rgba(10,10,10,0.04)',
                      border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.3)' : 'rgba(10,10,10,0.08)'}`,
                      padding: '6px 14px',
                    }}>
                      {nota}
                    </span>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <button
                  onClick={handleAdd}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '15px 32px',
                    border: added ? '1px solid #C9A84C' : '1px solid #0A0A0A',
                    background: added ? '#C9A84C' : '#0A0A0A',
                    color: added ? '#0A0A0A' : '#FAFAF8',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease',
                    width: '100%',
                  }}
                >
                  {added ? <><CheckIcon /> ¡Agregado!</> : 'Agregar al carrito'}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '15px 32px',
                    border: '1px solid rgba(10,10,10,0.15)',
                    background: 'transparent',
                    color: 'rgba(10,10,10,0.65)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    textDecoration: 'none', width: '100%',
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,10,10,0.15)'; e.currentTarget.style.color = 'rgba(10,10,10,0.65)' }}
                >
                  <WhatsAppIcon />
                  Consultar por WhatsApp
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}
