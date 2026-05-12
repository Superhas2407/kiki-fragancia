import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { products } from '../data/products-enriched'
import Header from '../components/Header'
import Footer from '../components/Footer'

// ─── Pirámide ───────────────────────────────────────────────
const NOTE_EMOJI = {
  'bergamota':'🍋','limón':'🍋','limon':'🍋','naranja':'🍊','mandarina':'🍊',
  'manzana':'🍎','canela':'🟤','vainilla':'🤍','rosa':'🌹','jazmín':'🌸',
  'jazmin':'🌸','sándalo':'🪵','sandalo':'🪵','ámbar':'🟡','ambar':'🟡',
  'almizcle':'🤍','musgo':'🌿','oud':'🪵','pachulí':'🌿','pachuli':'🌿',
  'vetiver':'🌾','cedro':'🌲','iris':'💜','violeta':'💜','incienso':'🕯️',
  'cardamomo':'🌿','jengibre':'🔥','pimienta':'⚫','lavanda':'💜',
  'neroli':'🌸','caramelo':'🍬','chocolate':'🍫','menta':'🌿',
  'fresia':'🌺','tuberosa':'🌺','tonka':'🫘','benjuí':'🟤','benjui':'🟤',
  'mirra':'🪨','patchouli':'🌿','azafrán':'🌼','azafran':'🌼',
  'resina':'🟤','ámbar gris':'🌊','limón verde':'🍋','bergamota rosa':'🌹',
}
function getNoteEmoji(nota) {
  const lower = nota.toLowerCase().trim()
  for (const [key, emoji] of Object.entries(NOTE_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return '🌸'
}
function parseNotes(str) {
  if (!str) return []
  return str.split(',').map(n => n.trim()).filter(Boolean)
}

// ─── Acordes ────────────────────────────────────────────────
const ACORDES_POR_FAMILIA = {
  'Oriental':         [['dulce',90],['cálido especiado',80],['avainillado',70],['ámbar',65]],
  'Amaderado':        [['amaderado',85],['terroso',70],['especiado',60],['seco',55]],
  'Floral':           [['floral',90],['fresco',75],['powder',65],['verde',50]],
  'Gourmand':         [['dulce',95],['gourmand',85],['avainillado',80],['caramelo',70]],
  'Cítrico':          [['cítrico',90],['fresco',85],['verde',70],['aromático',55]],
  'Floral Oriental':  [['floral',80],['dulce',70],['especiado',65],['ámbar',60]],
  'Floral Amaderado': [['floral',75],['amaderado',70],['powder',60],['fresco',50]],
  'Frutal':           [['frutal',85],['fresco',75],['floral',60],['dulce',55]],
  'Frutal Amaderado': [['frutal',80],['amaderado',70],['fresco',60],['dulce',50]],
  'Aromático':        [['aromático',85],['fresco',75],['verde',65],['especiado',55]],
}
const ACORDE_COLOR = {
  'dulce':'#E8566C','cálido especiado':'#D4724A','avainillado':'#D4C07A',
  'ámbar':'#C4722A','canela':'#A0522D','amaderado':'#8B6914','seco':'#8B7355',
  'terroso':'#8B7355','floral':'#E8A0B4','cítrico':'#F4C842','aromático':'#7FB069',
  'powder':'#C9A0DC','gourmand':'#D4956A','fresco':'#7FB069','verde':'#6B8E4E',
  'especiado':'#D4724A','frutal':'#C0392B','caramelo':'#D4956A',
}

// ─── Cuándo usarlo ──────────────────────────────────────────
const CUANDO_POR_FAMILIA = {
  'Oriental':         { estaciones:[['otoño','🍂',true],['invierno','❄️',true],['primavera','🌿',false],['verano','☀️',false]],   momentos:[['noche','🌙',true],['día','🌤️',false]] },
  'Amaderado':        { estaciones:[['otoño','🍂',true],['invierno','❄️',true],['primavera','🌿',true],['verano','☀️',false]],    momentos:[['noche','🌙',true],['día','🌤️',true]] },
  'Floral':           { estaciones:[['primavera','🌿',true],['verano','☀️',true],['otoño','🍂',false],['invierno','❄️',false]],   momentos:[['día','🌤️',true],['noche','🌙',false]] },
  'Gourmand':         { estaciones:[['otoño','🍂',true],['invierno','❄️',true],['primavera','🌿',false],['verano','☀️',false]],   momentos:[['noche','🌙',true],['día','🌤️',false]] },
  'Cítrico':          { estaciones:[['primavera','🌿',true],['verano','☀️',true],['otoño','🍂',false],['invierno','❄️',false]],   momentos:[['día','🌤️',true],['noche','🌙',false]] },
  'Floral Oriental':  { estaciones:[['primavera','🌿',true],['otoño','🍂',true],['invierno','❄️',true],['verano','☀️',false]],    momentos:[['noche','🌙',true],['día','🌤️',true]] },
  'Floral Amaderado': { estaciones:[['primavera','🌿',true],['otoño','🍂',true],['verano','☀️',false],['invierno','❄️',false]],   momentos:[['día','🌤️',true],['noche','🌙',true]] },
  'Frutal':           { estaciones:[['primavera','🌿',true],['verano','☀️',true],['otoño','🍂',false],['invierno','❄️',false]],   momentos:[['día','🌤️',true],['noche','🌙',false]] },
  'Frutal Amaderado': { estaciones:[['primavera','🌿',true],['verano','☀️',true],['otoño','🍂',true],['invierno','❄️',false]],    momentos:[['día','🌤️',true],['noche','🌙',false]] },
  'Aromático':        { estaciones:[['primavera','🌿',true],['verano','☀️',true],['otoño','🍂',true],['invierno','❄️',false]],    momentos:[['día','🌤️',true],['noche','🌙',false]] },
}
const DEFAULT_CUANDO = { estaciones:[['otoño','🍂',true],['invierno','❄️',true],['primavera','🌿',false],['verano','☀️',false]], momentos:[['noche','🌙',true],['día','🌤️',false]] }

// ─── Legado ─────────────────────────────────────────────────
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
  const [acordesReady, setAcordesReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAcordesReady(true), 60); return () => clearTimeout(t) }, [])

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: '#EDE5D8' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontStyle: 'italic', color: 'rgba(10,10,10,0.3)' }}>
            Fragancia no encontrada
          </p>
          <Link to="/tienda" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4781A', textDecoration: 'none' }}>
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

      <div style={{ background: '#EDE5D8', minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
            <Link
              to="/tienda"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C4781A'}
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
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4781A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4781A' }}>
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
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: '#C4781A', letterSpacing: '-0.02em', marginBottom: '20px' }}>
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
                  <span style={{ width: '24px', height: '1px', background: '#C4781A' }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', margin: 0 }}>
                    Notas olfativas
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {notas.map((nota, i) => (
                    <span key={nota} style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px', fontWeight: 300,
                      color: i === 0 ? '#C4781A' : 'rgba(10,10,10,0.55)',
                      background: i === 0 ? 'rgba(196,120,26,0.08)' : 'rgba(10,10,10,0.04)',
                      border: `1px solid ${i === 0 ? 'rgba(196,120,26,0.3)' : 'rgba(10,10,10,0.08)'}`,
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
                    border: added ? '1px solid #C4781A' : '1px solid #0A0A0A',
                    background: added ? '#C4781A' : '#0A0A0A',
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

      {/* ===== SECCIONES OSCURAS ===== */}
      <div style={{ background: '#1C1A16' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 88px' }}>

          {/* — 1: PIRÁMIDE — */}
          {(product.notasSalida || product.notasCorazon || product.notasFondo) && (<>
            <div style={{ marginBottom: '64px' }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:'0 0 6px' }}>
                Composición
              </p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 40px' }}>
                Pirámide del perfume
              </h2>
              <div style={{ position:'relative', paddingLeft:'20px' }}>
                {/* línea vertical dorada */}
                <div style={{
                  position:'absolute', left:0, top:0, bottom:0, width:'2px',
                  background:'linear-gradient(to bottom, rgba(201,168,76,0.9) 0%, rgba(201,168,76,0.4) 60%, rgba(201,168,76,0.05) 100%)',
                }} />
                <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
                  {[
                    { label:'Notas de Salida',   notes: parseNotes(product.notasSalida),  sub:'Primeras impresiones · 0–30 min',  chipBg:'rgba(201,168,76,0.15)' },
                    { label:'Notas de Corazón',  notes: parseNotes(product.notasCorazon), sub:'El alma del perfume · 30 min–3 h', chipBg:'rgba(201,168,76,0.10)' },
                    { label:'Notas de Fondo',    notes: parseNotes(product.notasFondo),   sub:'La huella que permanece · 3+ h',   chipBg:'rgba(201,168,76,0.05)' },
                  ].map(({ label, notes, sub, chipBg }) => notes.length > 0 && (
                    <div key={label}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'12px' }}>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'15px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C', margin:0 }}>
                          {label}
                        </p>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(247,242,234,0.3)', letterSpacing:'0.04em' }}>
                          {sub}
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                        {notes.map(nota => (
                          <span key={nota} style={{
                            fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:300,
                            color:'rgba(247,242,234,0.75)',
                            border:'1px solid rgba(201,168,76,0.25)',
                            padding:'6px 14px',
                            display:'flex', alignItems:'center', gap:'6px',
                            background: chipBg,
                          }}>
                            <span>{getNoteEmoji(nota)}</span>{nota}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ height:'1px', background:'rgba(201,168,76,0.12)', marginBottom:'64px' }} />
          </>)}

          {/* — 2: ACORDES — */}
          <div style={{ marginBottom:'64px' }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:'0 0 6px' }}>
              Perfil olfativo
            </p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 36px' }}>
              Acordes principales
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'18px', maxWidth:'560px' }}>
              {(ACORDES_POR_FAMILIA[product.familia] || ACORDES_POR_FAMILIA['Oriental']).map(([nombre, pct]) => {
                const color = ACORDE_COLOR[nombre] || '#C9A84C'
                return (
                  <div key={nombre}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(247,242,234,0.6)', letterSpacing:'0.06em', textTransform:'capitalize' }}>
                        {nombre}
                      </span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(247,242,234,0.3)' }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'1px', overflow:'hidden' }}>
                      <div style={{
                        height:'100%',
                        width: acordesReady ? `${pct}%` : '0%',
                        background: `linear-gradient(90deg, ${color}cc, ${color})`,
                        transition:'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ height:'1px', background:'rgba(201,168,76,0.12)', marginBottom:'64px' }} />

          {/* — 3: CUÁNDO USARLO — */}
          {(() => {
            const cuando = CUANDO_POR_FAMILIA[product.familia] || DEFAULT_CUANDO
            return (
              <div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:'0 0 6px' }}>
                  Contexto ideal
                </p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 36px' }}>
                  Cuándo usarlo
                </h2>
                <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
                  {[
                    { titulo:'Estaciones', items: cuando.estaciones },
                    { titulo:'Momentos',   items: cuando.momentos },
                  ].map(({ titulo, items }) => (
                    <div key={titulo} style={{ flex:1, minWidth:'220px', border:'1px solid rgba(201,168,76,0.15)', padding:'28px 32px' }}>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(247,242,234,0.3)', margin:'0 0 24px' }}>
                        {titulo}
                      </p>
                      <div style={{ display:'flex', gap:'28px', justifyContent:'center' }}>
                        {items.map(([nombre, icono, activo]) => (
                          <div key={nombre} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
                            <span style={{
                              fontSize:'3rem',
                              opacity: activo ? 1 : 0.2,
                              filter: activo ? 'none' : 'grayscale(1)',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              width:'64px', height:'64px',
                              borderRadius:'50%',
                              boxShadow: activo ? '0 0 20px rgba(201,168,76,0.4)' : 'none',
                              transition:'box-shadow 0.3s ease',
                            }}>
                              {icono}
                            </span>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', color: activo ? '#C9A84C' : '#444' }}>
                              {nombre}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

        </div>
      </div>

      <Footer />
    </>
  )
}
