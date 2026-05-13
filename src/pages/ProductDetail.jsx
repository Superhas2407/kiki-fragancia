import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  'resina':'🟤','ámbar gris':'🌊',
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
  'Oriental':         { clima:[['época seca','☀️',false],['época de lluvia','🌧️',true]],  momentos:[['día','🌤️',false],['noche','🌙',true]] },
  'Amaderado':        { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',true]],  momentos:[['día','🌤️',true], ['noche','🌙',true]] },
  'Floral':           { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',false]], momentos:[['día','🌤️',true], ['noche','🌙',false]] },
  'Gourmand':         { clima:[['época seca','☀️',false],['época de lluvia','🌧️',true]],  momentos:[['día','🌤️',false],['noche','🌙',true]] },
  'Cítrico':          { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',false]], momentos:[['día','🌤️',true], ['noche','🌙',false]] },
  'Floral Oriental':  { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',true]],  momentos:[['día','🌤️',true], ['noche','🌙',true]] },
  'Floral Amaderado': { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',false]], momentos:[['día','🌤️',true], ['noche','🌙',true]] },
  'Frutal':           { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',false]], momentos:[['día','🌤️',true], ['noche','🌙',false]] },
  'Frutal Amaderado': { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',true]],  momentos:[['día','🌤️',true], ['noche','🌙',false]] },
  'Aromático':        { clima:[['época seca','☀️',true], ['época de lluvia','🌧️',false]], momentos:[['día','🌤️',true], ['noche','🌙',false]] },
}
const DEFAULT_CUANDO = { clima:[['época seca','☀️',false],['época de lluvia','🌧️',true]], momentos:[['día','🌤️',false],['noche','🌙',true]] }

// ─── Iconos ──────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCartContext()
  const [added,        setAdded]        = useState(false)
  const [acordesReady, setAcordesReady] = useState(false)
  const [mounted,      setMounted]      = useState(false)
  const [imgHover,     setImgHover]     = useState(false)
  const [waHover,      setWaHover]      = useState(false)
  const [cartHover,    setCartHover]    = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 60)
    const t2 = setTimeout(() => setAcordesReady(true), 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', background: '#0A0A0A' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: 'rgba(250,250,248,0.25)', margin: 0 }}>
            Fragancia no encontrada
          </p>
          <Link
            to="/tienda"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}
          >
            ← Volver al catálogo
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const whatsappMsg = encodeURIComponent(`Hola, me interesa *${product.house} ${product.name}*. ¿Podrías darme más información?`)
  const whatsappUrl = `https://wa.me/584120221983?text=${whatsappMsg}`

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const reveal = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  })

  // Preview de notas para mostrar sobre el producto (primeras 4 de salida)
  const notasPreview = parseNotes(product.notasSalida).slice(0, 4)

  return (
    <>
      <Header />

      {/* ── Sección principal (clara) ── */}
      <div style={{ background: '#0A0A0A', minHeight: 'auto', paddingTop: '76px' }}>
        <div className="product-detail-inner" style={{ maxWidth: '1152px', margin: '0 auto', padding: '52px 24px 88px' }}>

          {/* Breadcrumb */}
          <div className="product-detail-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', ...reveal(0) }}>
            <Link
              to="/tienda"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,250,248,0.4)'}
            >
              Catálogo
            </Link>
            <span style={{ color: 'rgba(250,250,248,0.2)', fontSize: '10px' }}>/</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)' }}>
              {product.name}
            </span>
          </div>

          {/* Layout imagen + info */}
          <div className="product-detail-layout" style={{ alignItems: 'start' }}>

            {/* ── Imagen ── */}
            <div
              className="product-detail-img"
              style={{ ...reveal(80) }}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              <div className="product-detail-img-wrap" style={{
                position: 'relative', overflow: 'hidden',
                background: '#111111',
                boxShadow: imgHover
                  ? '0 32px 64px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)'
                  : '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.5s ease',
              }}>
                <img
                  className="product-detail-img-photo"
                  src={`/products/${product.image}`}
                  alt={`${product.house} ${product.name}`}
                  style={{
                    width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block',
                    transform: imgHover ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />

                {/* Badge verificado */}
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'rgba(201,168,76,0.15)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: '7px',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C' }}>
                    Original Verificado
                  </span>
                </div>

                {/* Familia en esquina inferior */}
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  background: 'rgba(10,8,4,0.65)', backdropFilter: 'blur(8px)',
                  padding: '5px 11px',
                  opacity: imgHover ? 1 : 0,
                  transform: imgHover ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C' }}>
                    {product.familia}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Info ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>

              {/* Casa */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 14px', ...reveal(140) }}>
                {product.house}
              </p>

              {/* Nombre */}
              <h1 className="product-detail-title" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(38px, 4.5vw, 58px)',
                fontWeight: 400, fontStyle: 'italic',
                color: '#FAFAF8',
                letterSpacing: '-0.03em', lineHeight: 1.04,
                margin: '0 0 14px',
                ...reveal(200),
              }}>
                {product.name}
              </h1>

              {/* ml · tipo · género */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px', fontWeight: 300,
                color: 'rgba(250,250,248,0.6)', letterSpacing: '0.06em',
                margin: '0 0 22px',
                ...reveal(250),
              }}>
                {[product.ml && `${product.ml} ml`, product.tipo, product.genero].filter(Boolean).join(' · ')}
              </p>

              {/* Precio */}
              {product.price && (
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '34px', fontWeight: 400,
                  color: '#C4781A', letterSpacing: '-0.02em',
                  margin: '0 0 28px',
                  ...reveal(300),
                }}>
                  {product.price}
                </p>
              )}

              {/* Divisor */}
              <div style={{ height: '1px', background: 'rgba(201,168,76,0.2)', margin: '0 0 28px', ...reveal(340) }} />

              {/* Descripción */}
              {product.descripcion && (
                <div style={{ marginBottom: '32px', position: 'relative', ...reveal(380) }}>
                  <motion.div
                    className="product-desc-collapsible"
                    animate={{ height: descExpanded ? 'auto' : 72 }}
                    initial={false}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px', fontWeight: 300,
                      color: 'rgba(250,250,248,0.8)', lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {product.descripcion}
                    </p>
                  </motion.div>
                  <AnimatePresence>
                    {!descExpanded && (
                      <motion.div
                        className="desc-fade-mask"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: '2.5em',
                          background: 'linear-gradient(transparent, #0A0A0A)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <button
                    className="desc-expand-btn"
                    onClick={() => setDescExpanded(v => !v)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
                      color: '#C9A84C', background: 'none', border: 'none',
                      cursor: 'pointer', padding: '8px 0 0', letterSpacing: '0.04em',
                    }}
                  >
                    {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
                  </button>
                </div>
              )}

              {/* Preview notas de salida */}
              {notasPreview.length > 0 && (
                <div style={{ marginBottom: '36px', ...reveal(420) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', margin: 0 }}>
                      Notas de salida
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {notasPreview.map((nota, i) => (
                      <span key={nota} style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '11px', fontWeight: 300,
                        color: '#FAFAF8',
                        background: 'rgba(250,250,248,0.08)',
                        border: '1px solid rgba(250,250,248,0.15)',
                        padding: '5px 13px',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        <span style={{ fontSize: '12px' }}>{getNoteEmoji(nota)}</span>
                        {nota}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', ...reveal(480) }}>

                {/* Agregar al carrito */}
                <button
                  onClick={handleAdd}
                  onMouseEnter={() => !added && setCartHover(true)}
                  onMouseLeave={() => setCartHover(false)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '16px 32px', width: '100%',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    border: '1px solid #C9A84C',
                    background: cartHover && !added ? '#E8C96A' : '#C9A84C',
                    color: '#0A0A0A',
                    transform: cartHover && !added ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: cartHover && !added ? '0 8px 24px rgba(201,168,76,0.25)' : 'none',
                    transition: 'background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                >
                  {added ? <><CheckIcon /> Agregado</> : 'Agregar al carrito'}
                </button>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setWaHover(true)}
                  onMouseLeave={() => setWaHover(false)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '16px 32px', width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    textDecoration: 'none',
                    border: '1px solid #C9A84C',
                    background: waHover ? '#C9A84C' : 'transparent',
                    color: waHover ? '#0A0A0A' : '#C9A84C',
                    transform: waHover ? 'translateY(-2px)' : 'translateY(0)',
                    transition: 'border-color 0.25s ease, color 0.25s ease, background 0.25s ease, transform 0.25s ease',
                  }}
                >
                  <WhatsAppIcon size={15} />
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Trust micro-copy */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', fontWeight: 300,
                color: 'rgba(250,250,248,0.3)', letterSpacing: '0.03em',
                margin: '18px 0 0',
                ...reveal(540),
              }}>
                Respondemos en menos de 2 horas · 100% original verificado
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* ── Secciones oscuras ── */}
      <div style={{ background: '#161310' }}>
        <div className="pd-dark-inner" style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px 96px' }}>

          {/* — 1: PIRÁMIDE — */}
          {(product.notasSalida || product.notasCorazon || product.notasFondo) && (<>
            <div style={{ marginBottom: '72px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:0 }}>
                  Composición
                </p>
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3vw,34px)', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 44px' }}>
                Pirámide del perfume
              </h2>
              <div style={{ position:'relative', paddingLeft:'24px' }}>
                <div style={{
                  position:'absolute', left:0, top:0, bottom:0, width:'2px',
                  background:'linear-gradient(to bottom, rgba(201,168,76,0.9) 0%, rgba(201,168,76,0.35) 65%, transparent 100%)',
                }} />
                <div style={{ display:'flex', flexDirection:'column', gap:'36px' }}>
                  {[
                    { label:'Notas de Salida',   notes: parseNotes(product.notasSalida),  sub:'0–30 min',  chipBg:'rgba(201,168,76,0.15)' },
                    { label:'Notas de Corazón',  notes: parseNotes(product.notasCorazon), sub:'30 min–3 h', chipBg:'rgba(201,168,76,0.09)' },
                    { label:'Notas de Fondo',    notes: parseNotes(product.notasFondo),   sub:'3+ h',       chipBg:'rgba(201,168,76,0.04)' },
                  ].map(({ label, notes, sub, chipBg }) => notes.length > 0 && (
                    <div key={label}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'14px' }}>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'14px', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#C9A84C', margin:0 }}>
                          {label}
                        </p>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:'rgba(247,242,234,0.25)', letterSpacing:'0.06em' }}>
                          {sub}
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                        {notes.map(nota => (
                          <span key={nota} style={{
                            fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:300,
                            color:'rgba(247,242,234,0.72)',
                            border:'1px solid rgba(201,168,76,0.22)',
                            padding:'7px 15px',
                            display:'flex', alignItems:'center', gap:'7px',
                            background: chipBg,
                            transition: 'border-color 0.2s ease',
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
            <div style={{ height:'1px', background:'rgba(201,168,76,0.1)', marginBottom:'72px' }} />
          </>)}

          {/* — 2: ACORDES — */}
          <div style={{ marginBottom:'72px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px' }}>
              <div style={{ width:'24px', height:'1px', background:'#C9A84C' }} />
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:0 }}>
                Perfil olfativo
              </p>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3vw,34px)', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 40px' }}>
              Acordes principales
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              {(ACORDES_POR_FAMILIA[product.familia] || ACORDES_POR_FAMILIA['Oriental']).map(([nombre, pct]) => {
                const color = ACORDE_COLOR[nombre] || '#C9A84C'
                return (
                  <div key={nombre}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(247,242,234,0.55)', letterSpacing:'0.06em', textTransform:'capitalize' }}>
                        {nombre}
                      </span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(247,242,234,0.25)', letterSpacing:'0.04em' }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                      <div style={{
                        height:'100%',
                        width: acordesReady ? `${pct}%` : '0%',
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        transition:'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ height:'1px', background:'rgba(201,168,76,0.1)', marginBottom:'72px' }} />

          {/* — 3: CUÁNDO USARLO — */}
          {(() => {
            const cuando = CUANDO_POR_FAMILIA[product.familia] || DEFAULT_CUANDO
            return (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px' }}>
                  <div style={{ width:'24px', height:'1px', background:'#C9A84C' }} />
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#C9A84C', margin:0 }}>
                    Contexto ideal
                  </p>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3vw,34px)', fontWeight:400, fontStyle:'italic', color:'#F7F2EA', letterSpacing:'-0.01em', margin:'0 0 40px' }}>
                  Cuándo usarlo
                </h2>
                <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
                  {[
                    { titulo:'Clima ideal',     items: cuando.clima },
                    { titulo:'Momento del día', items: cuando.momentos },
                  ].map(({ titulo, items }) => (
                    <div key={titulo} style={{
                      flex:1, minWidth:'220px',
                      border:'1px solid rgba(201,168,76,0.12)',
                      padding:'32px',
                      background:'rgba(201,168,76,0.02)',
                    }}>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(247,242,234,0.25)', margin:'0 0 28px' }}>
                        {titulo}
                      </p>
                      <div style={{ display:'flex', gap:'32px', justifyContent:'center' }}>
                        {items.map(([nombre, icono, activo]) => (
                          <div key={nombre} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
                            <span style={{
                              fontSize:'2.8rem', lineHeight:1,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              width:'68px', height:'68px',
                              borderRadius:'50%',
                              opacity: activo ? 1 : 0.18,
                              filter: activo ? 'none' : 'grayscale(1)',
                              boxShadow: activo ? '0 0 24px rgba(201,168,76,0.35)' : 'none',
                              transition: 'box-shadow 0.3s ease, opacity 0.3s ease',
                            }}>
                              {icono}
                            </span>
                            <span style={{
                              fontFamily:"'DM Sans',sans-serif",
                              fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase',
                              color: activo ? '#C9A84C' : 'rgba(247,242,234,0.2)',
                              textAlign:'center', lineHeight:1.4,
                            }}>
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

          {/* Volver al catálogo */}
          <div style={{ marginTop:'72px', paddingTop:'48px', borderTop:'1px solid rgba(201,168,76,0.1)', display:'flex', justifyContent:'center' }}>
            <Link
              to="/tienda"
              style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase',
                color:'rgba(247,242,234,0.3)', textDecoration:'none',
                transition:'color 0.25s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,242,234,0.3)'}
            >
              ← Volver al catálogo
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}
