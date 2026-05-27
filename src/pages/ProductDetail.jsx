import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartContext } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { products } from '../data/products-enriched'
import { NOTES_IMAGES } from '../data/notes-images'
import Header from '../components/Header'
import Footer from '../components/Footer'

// SVG icons per note family — no emoji, consistent with luxury aesthetic
const NOTE_ICONS = {
  // Cítricos
  bergamota: 'citrus', limón: 'citrus', limon: 'citrus', naranja: 'citrus', mandarina: 'citrus', pomelo: 'citrus',
  // Florales
  rosa: 'floral', jazmín: 'floral', jazmin: 'floral', neroli: 'floral', fresia: 'floral',
  tuberosa: 'floral', iris: 'floral', violeta: 'floral', lavanda: 'floral', ylang: 'floral',
  // Amaderados
  sándalo: 'wood', sandalo: 'wood', cedro: 'wood', oud: 'wood', patchouli: 'wood',
  pachulí: 'wood', pachuli: 'wood', vetiver: 'wood', musgo: 'wood',
  // Especiados
  pimienta: 'spice', cardamomo: 'spice', canela: 'spice', jengibre: 'spice', azafrán: 'spice', azafran: 'spice',
  // Gourmand
  vainilla: 'sweet', caramelo: 'sweet', chocolate: 'sweet', tonka: 'sweet',
  // Balsámicos / resinas
  ámbar: 'resin', ambar: 'resin', incienso: 'resin', benjuí: 'resin', benjui: 'resin',
  mirra: 'resin', resina: 'resin',
  // Frescos
  menta: 'fresh', almizcle: 'fresh',
}

const NOTE_SVG = {
  citrus: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="3" x2="12" y2="21" /><path d="M3 12 Q7 8 12 12 Q17 16 21 12" />
    </svg>
  ),
  floral: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2 Q14 7 12 9 Q10 7 12 2" /><path d="M12 15 Q14 17 12 22 Q10 17 12 15" />
      <path d="M2 12 Q7 10 9 12 Q7 14 2 12" /><path d="M15 12 Q17 10 22 12 Q17 14 15 12" />
    </svg>
  ),
  wood: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2 L12 22" /><path d="M5 6 Q8 9 12 8 Q16 9 19 6" /><path d="M4 13 Q8 16 12 15 Q16 16 20 13" />
    </svg>
  ),
  spice: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
    </svg>
  ),
  sweet: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2 Q18 2 20 8 Q22 14 17 18 Q14 22 12 22 Q10 22 7 18 Q2 14 4 8 Q6 2 12 2" />
      <path d="M9 10 Q12 14 15 10" />
    </svg>
  ),
  resin: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3 L20 8 L20 16 L12 21 L4 16 L4 8 Z" /><path d="M12 3 L12 21" /><path d="M4 8 L20 8" />
    </svg>
  ),
  fresh: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 22 Q4 16 4 10 A8 8 0 0 1 20 10 Q20 16 12 22Z" />
    </svg>
  ),
}

function getNoteIcon(nota) {
  const lower = nota.toLowerCase().trim()
  for (const [key, family] of Object.entries(NOTE_ICONS)) {
    if (lower.includes(key)) return NOTE_SVG[family]
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="2" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function getNoteImage(nota) {
  const lower = nota.toLowerCase().trim()
  if (NOTES_IMAGES[lower]) return NOTES_IMAGES[lower]
  for (const [key, src] of Object.entries(NOTES_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) return src
  }
  return null
}

function NoteIcon({ nota, size = 22 }) {
  const img = getNoteImage(nota)
  if (img) {
    return (
      <span style={{
        display: 'inline-flex', width: size, height: size,
        borderRadius: '50%', flexShrink: 0,
        background: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.25)',
        overflow: 'hidden',
      }}>
        <img
          src={img}
          alt={nota}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    )
  }
  return <span className="pd-note-emoji">{getNoteIcon(nota)}</span>
}
function parseNotes(str) {
  if (!str) return []
  return str.split(',').map(n => n.trim()).filter(Boolean)
}

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
  dulce:'#E8566C','cálido especiado':'#D4724A', avainillado:'#D4C07A',
  ámbar:'#C4722A', canela:'#A0522D', amaderado:'#8B6914', seco:'#8B7355',
  terroso:'#8B7355', floral:'#E8A0B4', cítrico:'#F4C842', aromático:'#7FB069',
  powder:'#C9A0DC', gourmand:'#D4956A', fresco:'#7FB069', verde:'#6B8E4E',
  especiado:'#D4724A', frutal:'#C0392B', caramelo:'#D4956A',
}
const SunIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const RainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
    <line x1="8" y1="19" x2="8" y2="21" /><line x1="8" y1="13" x2="8" y2="15" />
    <line x1="16" y1="19" x2="16" y2="21" /><line x1="16" y1="13" x2="16" y2="15" />
    <line x1="12" y1="21" x2="12" y2="23" /><line x1="12" y1="15" x2="12" y2="17" />
  </svg>
)
const MoonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const CUANDO_ICONS = { sun: SunIcon, rain: RainIcon, moon: MoonIcon }

const CUANDO_POR_FAMILIA = {
  'Oriental':         { clima:[['Época seca','sun',false],['Lluviosa','rain',true]],  momentos:[['Día','sun',false],['Noche','moon',true]] },
  'Amaderado':        { clima:[['Época seca','sun',true], ['Lluviosa','rain',true]],  momentos:[['Día','sun',true], ['Noche','moon',true]] },
  'Floral':           { clima:[['Época seca','sun',true], ['Lluviosa','rain',false]], momentos:[['Día','sun',true], ['Noche','moon',false]] },
  'Gourmand':         { clima:[['Época seca','sun',false],['Lluviosa','rain',true]],  momentos:[['Día','sun',false],['Noche','moon',true]] },
  'Cítrico':          { clima:[['Época seca','sun',true], ['Lluviosa','rain',false]], momentos:[['Día','sun',true], ['Noche','moon',false]] },
  'Floral Oriental':  { clima:[['Época seca','sun',true], ['Lluviosa','rain',true]],  momentos:[['Día','sun',true], ['Noche','moon',true]] },
  'Floral Amaderado': { clima:[['Época seca','sun',true], ['Lluviosa','rain',false]], momentos:[['Día','sun',true], ['Noche','moon',true]] },
  'Frutal':           { clima:[['Época seca','sun',true], ['Lluviosa','rain',false]], momentos:[['Día','sun',true], ['Noche','moon',false]] },
  'Frutal Amaderado': { clima:[['Época seca','sun',true], ['Lluviosa','rain',true]],  momentos:[['Día','sun',true], ['Noche','moon',false]] },
  'Aromático':        { clima:[['Época seca','sun',true], ['Lluviosa','rain',false]], momentos:[['Día','sun',true], ['Noche','moon',false]] },
}
const DEFAULT_CUANDO = {
  clima:[['Época seca','sun',false],['Lluviosa','rain',true]],
  momentos:[['Día','sun',false],['Noche','moon',true]],
}

const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartContext()
  const { formatPrice } = useCurrency()
  const [mounted,      setMounted]      = useState(false)
  const [barsReady,    setBarsReady]    = useState(false)
  const [added,        setAdded]        = useState(false)
  const [imgHover,     setImgHover]     = useState(false)
  const [waHover,      setWaHover]      = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMounted(false)
    setDescExpanded(false)
    const raf = requestAnimationFrame(() => setMounted(true))
    const t2 = setTimeout(() => setBarsReady(true), 500)
    return () => { cancelAnimationFrame(raf); clearTimeout(t2) }
  }, [id])

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <div className="pd-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
          <p style={{ fontFamily: 'var(--font-d)', fontSize: 36, fontStyle: 'italic', color: 'rgba(250,250,248,.25)' }}>
            Fragancia no encontrada
          </p>
          <Link to="/tienda" className="pd-back-link">← Volver al catálogo</Link>
        </div>
        <Footer />
      </>
    )
  }

  const rv = (d) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity .75s ease ${d}ms, transform .75s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  const waPrecio = product.precioUSD > 0 ? ` — $${product.precioUSD} USD` : ''
  const waMl = product.ml ? ` ${product.ml}ml` : ''
  const waMsg = encodeURIComponent(
    `Hola, me interesa *${product.house} ${product.name}*${waMl}${waPrecio}. ¿Está disponible?`
  )
  const waUrl = `https://wa.me/584149112002?text=${waMsg}&ref=detalle_${product.id}`

  const descripcion = product.descripcion || (product.description ? product.description.replace(/\*\*/g, '') : null)

  const hasStructuredNotes = product.notasSalida || product.notasCorazon || product.notasFondo
  const notas = hasStructuredNotes ? {
    salida:  parseNotes(product.notasSalida),
    corazon: parseNotes(product.notasCorazon),
    fondo:   parseNotes(product.notasFondo),
  } : {
    salida:  Array.isArray(product.notes) ? product.notes.slice(0, 4) : [],
    corazon: Array.isArray(product.notes) ? product.notes.slice(4, 8) : [],
    fondo:   Array.isArray(product.notes) ? product.notes.slice(8) : [],
  }
  const acordes = ACORDES_POR_FAMILIA[product.familia] || ACORDES_POR_FAMILIA['Oriental']
  const cuando  = CUANDO_POR_FAMILIA[product.familia] || DEFAULT_CUANDO

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const metaTitle = `${product.house} ${product.name} ${product.ml}ml — KiKi Fragancia`
  const metaDesc = descripcion
    ? descripcion.slice(0, 155).replace(/\s\S+$/, '…')
    : `${product.house} ${product.name} ${product.ml}ml ${product.tipo}. Fragancia 100% original en Venezuela.`
  const canonicalUrl = `https://kikifragancia.com/tienda/${product.id}`
  const productImage = product.image ? `https://kikifragancia.com/products/${product.image}` : 'https://kikifragancia.com/khamrah-hero.jpg'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.house} ${product.name}`,
    image: productImage,
    description: descripcion || metaDesc,
    brand: { '@type': 'Brand', name: product.house },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'USD',
      price: product.precioUSD || undefined,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <div className="pd-page">

        {/* ── Main section ── */}
        <div className="pd-main">
          <div className="kiki-container">

            <div style={rv(0)}>
              <Link to="/tienda" className="pd-back">← Catálogo</Link>
            </div>

            <div className="pd-layout">

              {/* Image */}
              <div style={rv(80)} onMouseEnter={() => setImgHover(true)} onMouseLeave={() => setImgHover(false)}>
                <div className="pd-img-wrap" style={{
                  boxShadow: imgHover ? '0 32px 64px rgba(0,0,0,.5)' : '0 8px 32px rgba(0,0,0,.3)',
                  transition: 'box-shadow .5s ease',
                }}>
                  {product.image ? (
                    <img
                      className="pd-img-photo"
                      src={`/products/${product.image}`}
                      alt={`${product.house} ${product.name}`}
                      style={{ transform: imgHover ? 'scale(1.04)' : 'scale(1)' }}
                    />
                  ) : (
                    <div className="pd-img-placeholder" style={{ transform: imgHover ? 'scale(1.04)' : 'scale(1)' }}>
                      <span className="pd-img-label">{product.house}<br />{product.name}<br />product photo</span>
                    </div>
                  )}

                  <div className="pd-img-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span className="pd-img-badge-text">Original Verificado</span>
                  </div>

                  <div className="pd-img-familia" style={{
                    opacity: imgHover ? 1 : 0,
                    transform: imgHover ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity .3s ease, transform .3s ease',
                  }}>
                    <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      {product.familia}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pd-info">
                <p className="pd-house" style={rv(140)}>{product.house}</p>
                <h1 className="pd-title" style={rv(200)}>{product.name}</h1>
                <p className="pd-meta" style={rv(260)}>
                  {[product.ml && `${product.ml} ml`, product.tipo, product.genero].filter(Boolean).join(' · ')}
                </p>
                <div className="pd-divider" style={rv(300)}></div>

                {product.variantIds && (() => {
                  const variantGroup = products
                    .filter(p => product.variantIds.includes(p.id))
                    .sort((a, b) => a.ml - b.ml)
                  return variantGroup.length > 1 ? (
                    <div className="pd-size-selector" style={rv(330)}>
                      <span className="pd-size-label">Tamaño</span>
                      <div className="pd-size-btns">
                        {variantGroup.map(v => (
                          <button
                            key={v.id}
                            type="button"
                            className={`pd-size-btn${v.id === product.id ? ' active' : ''}`}
                            onClick={() => navigate(`/tienda/${v.id}`)}
                          >
                            {v.ml} ml
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}

                {product.precioUSD > 0 && (
                  <div className="pd-price" style={rv(350)}>
                    <span className="pd-price-amount">{formatPrice(product.precioUSD)}</span>
                  </div>
                )}

                <div className="pd-actions" style={rv(380)}>
                  <button
                    onClick={handleAdd}
                    style={{
                      fontFamily: 'var(--font-s)', fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: 400, letterSpacing: '.2em',
                      textTransform: 'uppercase', padding: 'clamp(13px, 3vw, 16px) clamp(20px, 5vw, 32px)', width: '100%', minHeight: '46px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      border: added ? '1px solid #25D366' : '1px solid var(--gold)',
                      background: added ? '#25D366' : 'var(--gold)',
                      color: added ? '#FFF' : '#0A0A0A',
                      transition: 'background .25s ease, border-color .25s ease, color .25s ease',
                    }}
                    onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#E8C96A' }}
                    onMouseLeave={e => { if (!added) e.currentTarget.style.background = 'var(--gold)' }}
                  >
                    {added ? '✓ Agregado' : 'Agregar al carrito'}
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-btn-wa"
                    style={{
                      background: waHover ? 'var(--gold)' : 'transparent',
                      color: waHover ? '#0A0A0A' : 'var(--gold)',
                      transform: waHover ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setWaHover(true)}
                    onMouseLeave={() => setWaHover(false)}
                  >
                    <WhatsAppIcon />
                    Consultar por WhatsApp
                  </a>

                  <p className="pd-trust">Respondemos en menos de 2 horas · 100% original verificado</p>
                </div>

                {descripcion && (
                  <div className="pd-desc-wrap" style={rv(440)}>
                    <div className="pd-desc-text" style={{
                      maxHeight: descExpanded ? '400px' : '72px',
                      overflow: 'hidden',
                      transition: 'max-height .45s cubic-bezier(.22,1,.36,1)',
                      position: 'relative',
                    }}>
                      <p className="pd-desc">{descripcion}</p>
                      {!descExpanded && <div className="pd-desc-fade"></div>}
                    </div>
                    <button className="pd-expand-btn" onClick={() => setDescExpanded(v => !v)}>
                      {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
                    </button>
                  </div>
                )}

                {notas.salida.length > 0 && (
                  <div className="pd-notes-preview" style={rv(500)}>
                    <div className="pd-notes-label">
                      <div className="gold-line" style={{ width: 24 }}></div>
                      <span>Notas de salida</span>
                    </div>
                    <div className="pd-notes-chips">
                      {notas.salida.slice(0, 4).map(n => (
                        <span key={n} className="pd-note-chip">
                          <NoteIcon nota={n} />{n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Dark section ── */}
        <div className="pd-dark">
          <div className="kiki-container pd-dark-inner">

            {/* Pirámide */}
            {(notas.salida.length || notas.corazon.length || notas.fondo.length) ? (
              <>
                <div className="pd-section-head">
                  <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Composición</span></div>
                  <h2 className="pd-section-title">Pirámide del perfume</h2>
                </div>

                <div className="pd-pyr">
                  {[
                    { label: 'Salida',  time: '0–30 min',   notes: notas.salida  },
                    { label: 'Corazón', time: '30 min–3 h', notes: notas.corazon },
                    { label: 'Fondo',   time: '3+ h',       notes: notas.fondo   },
                  ].filter(l => l.notes.length > 0).map(({ label, time, notes }) => (
                    <div key={label} className="pd-pyr-row">
                      <span className="pd-pyr-time">{time}</span>
                      <div className="pd-pyr-notes">
                        {notes.map(n => (
                          <div key={n} className="pd-pyr-note">
                            <NoteIcon nota={n} size={64} />
                            <span className="pd-pyr-note-name">{n}</span>
                          </div>
                        ))}
                      </div>
                      <span className="pd-pyr-label">{label}</span>
                    </div>
                  ))}

                  <p className="pd-pyr-footer">
                    {product.house} · {product.name} · {product.familia}
                  </p>
                </div>

                <div className="pd-sep"></div>
              </>
            ) : null}

            {/* Acordes */}
            <div className="pd-section-head">
              <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Perfil olfativo</span></div>
              <h2 className="pd-section-title">Acordes principales</h2>
            </div>
            <div className="pd-acordes">
              {acordes.map(([nombre, pct]) => {
                const color = ACORDE_COLOR[nombre] || '#C9A84C'
                return (
                  <div key={nombre} className="pd-acorde">
                    <div className="pd-acorde-meta">
                      <span className="pd-acorde-name">{nombre}</span>
                      <span className="pd-acorde-pct">{pct}%</span>
                    </div>
                    <div className="pd-acorde-track">
                      <div className="pd-acorde-bar" style={{
                        width: barsReady ? `${pct}%` : '0%',
                        background: `linear-gradient(90deg, ${color}88, ${color})`,
                      }}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pd-sep"></div>

            {/* Cuándo */}
            <div className="pd-section-head">
              <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Contexto ideal</span></div>
              <h2 className="pd-section-title">Cuándo usarlo</h2>
            </div>
            <div className="pd-cuando-grid">
              {[
                { titulo: 'Clima ideal',     items: cuando.clima },
                { titulo: 'Momento del día', items: cuando.momentos },
              ].map(({ titulo, items }) => (
                <div key={titulo} className="pd-cuando-card">
                  <p className="pd-cuando-label">{titulo}</p>
                  <div className="pd-cuando-items">
                    {items.map(([nombre, iconKey, activo]) => {
                      const Icon = CUANDO_ICONS[iconKey]
                      return (
                        <div key={nombre} className="pd-cuando-item">
                          <span className="pd-cuando-icon" style={{
                            opacity: activo ? 1 : 0.18,
                            color: activo ? 'var(--gold)' : 'rgba(247,242,234,.4)',
                            boxShadow: activo ? '0 0 22px rgba(201,168,76,.25)' : 'none',
                          }}>
                            {Icon && <Icon />}
                          </span>
                          <span className="pd-cuando-text" style={{ color: activo ? 'var(--gold)' : 'rgba(247,242,234,.2)' }}>
                            {nombre}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pd-back-bottom">
              <Link to="/tienda" className="pd-back-link">← Volver al catálogo</Link>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
