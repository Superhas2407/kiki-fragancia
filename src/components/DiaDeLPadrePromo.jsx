import { Link } from 'react-router-dom'

const WA_NUMBER = '584149112002'

function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const PROFILES = [
  {
    id: 359,
    image: 'antonio-banderas-the-icon-100ml-m.webp',
    badge: 'El Clásico',
    name: 'The Icon',
    familia: 'Ámbar Fougère',
    precio: 30,
    tipo: 'EDT',
  },
  {
    id: 366,
    image: 'antonio-banderas-king-of-seduction-100ml-m.webp',
    badge: 'El Aventurero',
    name: 'King of Seduction',
    familia: 'Aromático Amaderado',
    precio: 25,
    tipo: 'EDT',
  },
  {
    id: 377,
    image: 'antonio-banderas-the-secret-100ml-m.webp',
    badge: 'El Romántico',
    name: 'The Secret',
    familia: 'Oriental Especiado',
    precio: 25,
    tipo: 'EDT',
  },
]

const STAR_PRODUCT = PROFILES[0]

const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Me interesa la colección Día del Padre 2026')}&ref=dia_del_padre`

const WhatsAppSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function DiaDeLPadrePromo() {
  const days = daysUntil('2026-06-18')

  return (
    <section className="ddp-campaign">
      {/* Bloque 1 — Franja de urgencia */}
      <div className="kiki-container">
        <div className="ddp-urgency-row">
          <div className="ddp-countdown-box">
            <div className="ddp-countdown-num">{days}</div>
            <div className="ddp-countdown-label">días restantes</div>
            <div style={{ width: '100%', height: 1, background: 'rgba(201,168,76,0.3)', margin: '10px 0 8px' }} />
            <div className="ddp-deadline">Pide antes del<br />18 de junio</div>
          </div>
          <div>
            <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: 12 }}>
              ★ Campaña Día del Padre 2026
            </p>
            <h2 style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 100, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.05, marginBottom: 14 }}>
              Esta vez, regálale algo que recuerde
            </h2>
            <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 13, fontWeight: 100, color: 'var(--ink-mute)', lineHeight: 1.6 }}>
              10 fragancias para él. Pedido antes del 18 jun para entrega a tiempo · envoltura sin costo.
            </p>
          </div>
        </div>

        {/* Bloque 2 — Grid 2 columnas */}
        <div className="ddp-content-row">
          {/* Izquierda — Guía de regalo */}
          <div>
            <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: 16 }}>
              Elige por su estilo
            </p>
            <div className="ddp-profiles-grid">
              {PROFILES.map(p => (
                <Link key={p.id} to={`/tienda/${p.id}`} className="ddp-profile-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <img
                    src={`/products/${p.image}`}
                    alt={p.name}
                    className="ddp-profile-img"
                    loading="lazy"
                  />
                  <div className="ddp-profile-info">
                    <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: 4 }}>
                      {p.badge}
                    </p>
                    <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 16, fontStyle: 'italic', fontWeight: 100, color: 'var(--ink)', marginBottom: 3, lineHeight: 1.2 }}>
                      {p.name}
                    </p>
                    <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 10, color: 'var(--ink-faint)', marginBottom: 6 }}>
                      {p.familia}
                    </p>
                    <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 15, color: 'var(--gold-ink)', fontWeight: 100 }}>
                      ${p.precio} <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{p.tipo}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
              <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 11, fontWeight: 100, color: 'var(--ink-faint)', lineHeight: 1.7, marginBottom: 14 }}>
                10 fragancias masculinas · Antonio Banderas<br />
                Envoltura sin costo · Envíos a todo Venezuela
              </p>
              <Link
                to="/dia-del-padre"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontFamily: 'KikiGotham, sans-serif', fontSize: 10,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--gold-ink)', textDecoration: 'none',
                  borderBottom: '1px solid rgba(201,168,76,0.35)',
                  paddingBottom: 3,
                  transition: 'color .2s, border-color .2s',
                }}
              >
                Ver la campaña completa →
              </Link>
            </div>
          </div>

          {/* Derecha — Producto estrella */}
          <div className="ddp-star-card">
            <div className="ddp-star-badge">★ Más vendido</div>
            <img
              src={`/products/${STAR_PRODUCT.image}`}
              alt={STAR_PRODUCT.name}
              className="ddp-star-img"
              loading="lazy"
            />
            <div style={{ padding: '16px 0 0' }}>
              <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: 4 }}>
                Antonio Banderas
              </p>
              <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 22, fontStyle: 'italic', fontWeight: 100, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.1 }}>
                {STAR_PRODUCT.name}
              </p>
              <p style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 26, color: 'var(--gold-ink)', fontWeight: 100, marginBottom: 16 }}>
                ${STAR_PRODUCT.precio} <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{STAR_PRODUCT.tipo}</span>
              </p>
              <a href={WA_URL} className="ddp-wa-btn" target="_blank" rel="noopener noreferrer">
                <WhatsAppSVG />
                Pedir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque 3 — Franja de beneficios */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px', padding: '18px 48px', marginTop: 40 }}>
        {['🎁 Envoltura sin costo', '🚚 Entrega antes del 21 jun', '✓ Original verificado', '📍 Envíos a todo el país'].map(item => (
          <span key={item} style={{ fontFamily: 'KikiGotham, sans-serif', fontSize: 11, fontWeight: 100, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
