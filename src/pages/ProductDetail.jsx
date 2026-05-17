import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { products } from '../data/products-enriched'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NOTE_EMOJI = {
  bergamota:'🍋', limón:'🍋', limon:'🍋', naranja:'🍊', mandarina:'🍊',
  manzana:'🍎', canela:'🟤', vainilla:'🤍', rosa:'🌹', jazmín:'🌸',
  jazmin:'🌸', sándalo:'🪵', sandalo:'🪵', ámbar:'🟡', ambar:'🟡',
  almizcle:'🤍', musgo:'🌿', oud:'🪵', pachulí:'🌿', pachuli:'🌿',
  vetiver:'🌾', cedro:'🌲', iris:'💜', violeta:'💜', incienso:'🕯️',
  cardamomo:'🌿', jengibre:'🔥', pimienta:'⚫', lavanda:'💜',
  neroli:'🌸', caramelo:'🍬', chocolate:'🍫', menta:'🌿',
  fresia:'🌺', tuberosa:'🌺', tonka:'🫘', benjuí:'🟤', benjui:'🟤',
  mirra:'🪨', patchouli:'🌿', azafrán:'🌼', azafran:'🌼',
  resina:'🟤',
}
function getNoteEmoji(nota) {
  const lower = nota.toLowerCase().trim()
  for (const [key, emoji] of Object.entries(NOTE_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return '✦'
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
const CUANDO_POR_FAMILIA = {
  'Oriental':         { clima:[['Época seca','☀️',false],['Lluviosa','🌧️',true]],  momentos:[['Día','🌤️',false],['Noche','🌙',true]] },
  'Amaderado':        { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',true]],  momentos:[['Día','🌤️',true], ['Noche','🌙',true]] },
  'Floral':           { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',false]], momentos:[['Día','🌤️',true], ['Noche','🌙',false]] },
  'Gourmand':         { clima:[['Época seca','☀️',false],['Lluviosa','🌧️',true]],  momentos:[['Día','🌤️',false],['Noche','🌙',true]] },
  'Cítrico':          { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',false]], momentos:[['Día','🌤️',true], ['Noche','🌙',false]] },
  'Floral Oriental':  { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',true]],  momentos:[['Día','🌤️',true], ['Noche','🌙',true]] },
  'Floral Amaderado': { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',false]], momentos:[['Día','🌤️',true], ['Noche','🌙',true]] },
  'Frutal':           { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',false]], momentos:[['Día','🌤️',true], ['Noche','🌙',false]] },
  'Frutal Amaderado': { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',true]],  momentos:[['Día','🌤️',true], ['Noche','🌙',false]] },
  'Aromático':        { clima:[['Época seca','☀️',true], ['Lluviosa','🌧️',false]], momentos:[['Día','🌤️',true], ['Noche','🌙',false]] },
}
const DEFAULT_CUANDO = {
  clima:[['Época seca','☀️',false],['Lluviosa','🌧️',true]],
  momentos:[['Día','🌤️',false],['Noche','🌙',true]],
}

const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCartContext()
  const [mounted,      setMounted]      = useState(false)
  const [barsReady,    setBarsReady]    = useState(false)
  const [added,        setAdded]        = useState(false)
  const [imgHover,     setImgHover]     = useState(false)
  const [waHover,      setWaHover]      = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t1 = setTimeout(() => setMounted(true), 60)
    const t2 = setTimeout(() => setBarsReady(true), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [id])

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <Header />
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

  const waMsg = encodeURIComponent(`Hola, me interesa *${product.house} ${product.name}*. ¿Podrías darme más información?`)
  const waUrl = `https://wa.me/584120221983?text=${waMsg}`

  const notas = {
    salida:  parseNotes(product.notasSalida),
    corazon: parseNotes(product.notasCorazon),
    fondo:   parseNotes(product.notasFondo),
  }
  const acordes = ACORDES_POR_FAMILIA[product.familia] || ACORDES_POR_FAMILIA['Oriental']
  const cuando  = CUANDO_POR_FAMILIA[product.familia] || DEFAULT_CUANDO

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
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

                {product.descripcion && (
                  <div className="pd-desc-wrap" style={rv(340)}>
                    <div className="pd-desc-text" style={{
                      maxHeight: descExpanded ? '400px' : '72px',
                      overflow: 'hidden',
                      transition: 'max-height .45s cubic-bezier(.22,1,.36,1)',
                      position: 'relative',
                    }}>
                      <p className="pd-desc">{product.descripcion}</p>
                      {!descExpanded && <div className="pd-desc-fade"></div>}
                    </div>
                    <button className="pd-expand-btn" onClick={() => setDescExpanded(v => !v)}>
                      {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
                    </button>
                  </div>
                )}

                {notas.salida.length > 0 && (
                  <div className="pd-notes-preview" style={rv(400)}>
                    <div className="pd-notes-label">
                      <div className="gold-line" style={{ width: 24 }}></div>
                      <span>Notas de salida</span>
                    </div>
                    <div className="pd-notes-chips">
                      {notas.salida.slice(0, 4).map(n => (
                        <span key={n} className="pd-note-chip">
                          <span className="pd-note-emoji">{getNoteEmoji(n)}</span>{n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pd-actions" style={rv(460)}>
                  <button
                    onClick={handleAdd}
                    style={{
                      fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '.2em',
                      textTransform: 'uppercase', padding: '16px 32px', width: '100%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      border: '1px solid var(--gold)',
                      background: added ? 'var(--gold)' : 'var(--gold)',
                      color: '#0A0A0A',
                      transition: 'background .2s ease, transform .2s ease',
                    }}
                    onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#E8C96A' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)' }}
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
                <div className="pd-pyramid">
                  <div className="pd-pyramid-line"></div>
                  <div className="pd-pyramid-layers">
                    {[
                      { label: 'Notas de Salida',  notes: notas.salida,  sub: '0–30 min',  bg: 'rgba(201,168,76,.15)' },
                      { label: 'Notas de Corazón', notes: notas.corazon, sub: '30 min–3 h', bg: 'rgba(201,168,76,.09)' },
                      { label: 'Notas de Fondo',   notes: notas.fondo,   sub: '3+ h',       bg: 'rgba(201,168,76,.04)' },
                    ].filter(l => l.notes.length > 0).map(({ label, notes, sub, bg }) => (
                      <div key={label} className="pd-pyramid-layer">
                        <div className="pd-pyramid-layer-head">
                          <span className="pd-pyramid-layer-title">{label}</span>
                          <span className="pd-pyramid-layer-sub">{sub}</span>
                        </div>
                        <div className="pd-chips">
                          {notes.map(n => (
                            <span key={n} className="pd-chip" style={{ background: bg }}>
                              <span className="pd-note-emoji">{getNoteEmoji(n)}</span>{n}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    {items.map(([nombre, icono, activo]) => (
                      <div key={nombre} className="pd-cuando-item">
                        <span className="pd-cuando-icon" style={{
                          opacity: activo ? 1 : 0.18,
                          filter: activo ? 'none' : 'grayscale(1)',
                          boxShadow: activo ? '0 0 22px rgba(201,168,76,.35)' : 'none',
                        }}>{icono}</span>
                        <span className="pd-cuando-text" style={{ color: activo ? 'var(--gold)' : 'rgba(247,242,234,.2)' }}>
                          {nombre}
                        </span>
                      </div>
                    ))}
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
