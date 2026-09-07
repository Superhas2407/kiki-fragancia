import { useState, useEffect, useMemo } from 'react'
import { setTasaSanity, clearTasaSanity, getTasaSanityCache } from '../hooks/useTasaCambio'
import { setOfertaDelDiaSanity, clearOfertaDelDiaSanity, getOfertaDelDiaCache, OFERTA_DURATION_MS } from '../hooks/useOfertaDelDia'
import { sanityClient } from '../lib/sanityClient'
import { supabase } from '../lib/supabaseClient'
import { useIndexProducts } from '../context/SanityProductsContext'
import { norm } from '../lib/search'

function fmt(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })
}

function fmtCountdown(ms) {
  if (ms <= 0) return 'expirada'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m restantes`
}

export default function KikiDeskPage() {
  const [input, setInput]   = useState('')
  const [info, setInfo]     = useState(() => getTasaSanityCache())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState(null)

  const products = useIndexProducts()
  const [ofertaQuery, setOfertaQuery]     = useState('')
  const [ofertaInfo, setOfertaInfo]       = useState(() => getOfertaDelDiaCache())
  const [ofertaSaving, setOfertaSaving]   = useState(false)
  const [ofertaMsg, setOfertaMsg]         = useState(null)
  const [ofertaStatus, setOfertaStatus]   = useState({ msLeft: 0, expired: false })

  // Fetch live value from Sanity on mount
  useEffect(() => {
    sanityClient.fetch(`*[_id == "kiki-ajustes"][0]{ tasaManual, updatedAt, ofertaDelDiaId, ofertaDelDiaSetAt }`)
      .then(doc => {
        if (doc?.tasaManual > 0) setInfo({ rate: doc.tasaManual, ts: new Date(doc.updatedAt).getTime() })
        else setInfo(null)
        if (doc?.ofertaDelDiaId) setOfertaInfo({ id: doc.ofertaDelDiaId, setAt: doc.ofertaDelDiaSetAt })
        else setOfertaInfo(null)
      })
      .catch(() => {})
  }, [])

  // Countdown de la oferta activa — se recalcula en un efecto (no en el
  // cuerpo del render) para no llamar Date.now() de forma impura.
  useEffect(() => {
    const tick = () => {
      if (!ofertaInfo) { setOfertaStatus({ msLeft: 0, expired: false }); return }
      const end = new Date(ofertaInfo.setAt).getTime() + OFERTA_DURATION_MS
      const msLeft = Math.max(0, end - Date.now())
      setOfertaStatus({ msLeft, expired: msLeft <= 0 })
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [ofertaInfo])

  const ofertaProduct = ofertaInfo ? products.find(p => p.id === ofertaInfo.id) : null
  const { msLeft: ofertaMsLeft, expired: ofertaExpired } = ofertaStatus

  const ofertaResults = useMemo(() => {
    const q = norm(ofertaQuery.trim())
    if (q.length < 2) return []
    return products
      .filter(p => norm(`${p.house} ${p.name}`).includes(q))
      .slice(0, 8)
  }, [ofertaQuery, products])

  function flashOferta(text, ok = true) {
    setOfertaMsg({ text, ok })
    setTimeout(() => setOfertaMsg(null), 3500)
  }

  async function handleSetOferta(product) {
    setOfertaSaving(true)
    try {
      await setOfertaDelDiaSanity(product.id)
      setOfertaInfo({ id: product.id, setAt: new Date().toISOString() })
      setOfertaQuery('')
      flashOferta(`Oferta del día activada: ${product.house} ${product.name} — dura 24h`)
    } catch {
      flashOferta('Error al guardar en Sanity. Revisa el token de escritura.', false)
    } finally {
      setOfertaSaving(false)
    }
  }

  async function handleClearOferta() {
    setOfertaSaving(true)
    try {
      await clearOfertaDelDiaSanity()
      setOfertaInfo(null)
      flashOferta('Oferta del día desactivada', true)
    } catch {
      flashOferta('Error al limpiar en Sanity.', false)
    } finally {
      setOfertaSaving(false)
    }
  }

  function flash(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3500)
  }

  async function handleSet(e) {
    e.preventDefault()
    const val = parseFloat(input.replace(',', '.'))
    if (!val || val <= 0) { flash('Ingresa un número válido', false); return }
    setSaving(true)
    try {
      await setTasaSanity(val)
      setInfo({ rate: val, ts: Date.now() })
      setInput('')
      flash(`Tasa guardada: ${val.toLocaleString('es-VE')} Bs/$ — visible para todos`)
    } catch {
      flash('Error al guardar en Sanity. Revisa el token de escritura.', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleClear() {
    setSaving(true)
    try {
      await clearTasaSanity()
      setInfo(null)
      flash('Tasa eliminada — todos verán la API automática', true)
    } catch {
      flash('Error al limpiar en Sanity.', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <p style={styles.eyebrow}>kiki fragancia</p>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(247,242,234,0.3)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>
            Cerrar sesión
          </button>
        </div>
        <h1 style={styles.title}>Tasa de cambio</h1>

        <div style={styles.statusBox}>
          {info ? (
            <>
              <span style={styles.dot('#C9A84C')} />
              <div>
                <p style={styles.statusLabel}>Tasa manual activa</p>
                <p style={styles.statusValue}>{info.rate.toLocaleString('es-VE')} <span style={styles.unit}>Bs/$</span></p>
                <p style={styles.statusMeta}>Guardada el {fmt(info.ts)} · Sanity · visible para todos</p>
              </div>
            </>
          ) : (
            <>
              <span style={styles.dot('#6B9B6B')} />
              <div>
                <p style={styles.statusLabel}>Usando API automática</p>
                <p style={styles.statusMeta}>ve.dolarapi.com · paralelo · caché 30 min</p>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSet} style={styles.form}>
          <label style={styles.label}>Nueva tasa (Bs por $1 USD)</label>
          <div style={styles.row}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="ej: 91.50"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={styles.input}
              autoComplete="off"
            />
            <button type="submit" style={styles.btnPrimary} disabled={saving}>
              {saving ? '…' : 'Guardar'}
            </button>
          </div>
        </form>

        {info && (
          <button onClick={handleClear} style={styles.btnGhost} disabled={saving}>
            Volver a usar API automática
          </button>
        )}

        {msg && (
          <p style={{ ...styles.msg, color: msg.ok ? '#C9A84C' : '#E07070' }}>
            {msg.text}
          </p>
        )}

        <div style={styles.divider} />

        <h1 style={styles.title}>Oferta del día</h1>

        <div style={styles.statusBox}>
          {ofertaInfo && ofertaProduct && !ofertaExpired ? (
            <>
              <span style={styles.dot('#C9A84C')} />
              <div>
                <p style={styles.statusLabel}>Activa</p>
                <p style={styles.statusValue}>{ofertaProduct.house} {ofertaProduct.name}</p>
                <p style={styles.statusMeta}>Activada el {fmt(new Date(ofertaInfo.setAt).getTime())} · {fmtCountdown(ofertaMsLeft)}</p>
              </div>
            </>
          ) : (
            <>
              <span style={styles.dot('#7A7468')} />
              <div>
                <p style={styles.statusLabel}>Sin oferta activa</p>
                <p style={styles.statusMeta}>El widget no se muestra a nadie hasta que actives una</p>
              </div>
            </>
          )}
        </div>

        <label style={styles.label}>Buscar producto (casa o nombre)</label>
        <input
          type="text"
          placeholder="ej: Yara Moi"
          value={ofertaQuery}
          onChange={e => setOfertaQuery(e.target.value)}
          style={{ ...styles.input, width: '100%', marginBottom: ofertaResults.length ? 8 : 12 }}
          autoComplete="off"
        />

        {ofertaResults.length > 0 && (
          <div style={styles.resultsBox}>
            {ofertaResults.map(p => (
              <button
                key={p.id}
                onClick={() => handleSetOferta(p)}
                disabled={ofertaSaving}
                style={styles.resultItem}
              >
                <span>{p.house} {p.name}</span>
                <span style={styles.resultMeta}>{p.ml ? `${p.ml}ml` : ''} · REF {p.precioUSD}</span>
              </button>
            ))}
          </div>
        )}

        {ofertaInfo && (
          <button onClick={handleClearOferta} style={styles.btnGhost} disabled={ofertaSaving}>
            Desactivar oferta del día
          </button>
        )}

        {ofertaMsg && (
          <p style={{ ...styles.msg, color: ofertaMsg.ok ? '#C9A84C' : '#E07070' }}>
            {ofertaMsg.text}
          </p>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg, #0A0A0A)',
    padding: '24px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--surface, #131310)',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: 4,
    padding: '40px 36px',
  },
  eyebrow: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--gold, #C9A84C)',
    margin: '0 0 12px',
  },
  title: {
    fontFamily: 'var(--font-d, serif)',
    fontStyle: 'italic',
    fontSize: 28,
    fontWeight: 400,
    color: 'var(--ink, #F7F2EA)',
    margin: '0 0 28px',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 4,
    padding: '16px 18px',
    marginBottom: 28,
  },
  dot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    marginTop: 5,
    flexShrink: 0,
  }),
  statusLabel: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint, #7A7468)',
    margin: '0 0 4px',
  },
  statusValue: {
    fontFamily: 'var(--font-d, serif)',
    fontSize: 22,
    color: 'var(--ink, #F7F2EA)',
    margin: '0 0 2px',
  },
  unit: {
    fontSize: 14,
    color: 'var(--ink-faint, #7A7468)',
  },
  statusMeta: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 11,
    color: 'var(--ink-faint, #7A7468)',
    margin: 0,
  },
  form: {
    marginBottom: 12,
  },
  label: {
    display: 'block',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint, #7A7468)',
    marginBottom: 8,
  },
  row: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: 3,
    padding: '10px 14px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 15,
    color: 'var(--ink, #F7F2EA)',
    outline: 'none',
  },
  btnPrimary: {
    background: 'var(--gold, #C9A84C)',
    color: '#0A0A0A',
    border: 'none',
    borderRadius: 3,
    padding: '10px 20px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnGhost: {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 3,
    padding: '10px 20px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint, #7A7468)',
    cursor: 'pointer',
    marginBottom: 12,
  },
  msg: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 11,
    letterSpacing: '0.1em',
    marginTop: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.08)',
    margin: '32px 0 28px',
  },
  resultsBox: {
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  resultItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.03)',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 14px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 13,
    color: 'var(--ink, #F7F2EA)',
    cursor: 'pointer',
    textAlign: 'left',
  },
  resultMeta: {
    flexShrink: 0,
    fontSize: 10,
    color: 'var(--ink-faint, #7A7468)',
  },
}
