import { useState, useEffect, useMemo } from 'react'
import { setTasaSanity, clearTasaSanity, getTasaSanityCache } from '../hooks/useTasaCambio'
import {
  setOfertaDelDiaSanity, clearOfertaDelDiaSanity, getOfertaDelDiaCache,
  fetchOfertaDelDiaHistory, OFERTA_DURATION_MS,
} from '../hooks/useOfertaDelDia'
import { setAgotadoSanity, setPrecioSanity } from '../hooks/useProductAdmin'
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

function searchProducts(products, query) {
  const q = norm(query.trim())
  if (q.length < 2) return []
  return products
    .filter(p => norm(`${p.house} ${p.name}`).includes(q))
    .slice(0, 8)
}

export default function KikiDeskPage() {
  const products = useIndexProducts()

  // ── Tasa de cambio ────────────────────────────────────────────────────────
  const [input, setInput]   = useState('')
  const [info, setInfo]     = useState(() => getTasaSanityCache())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState(null)

  // ── Oferta del día ────────────────────────────────────────────────────────
  const [ofertaQuery, setOfertaQuery]     = useState('')
  const [ofertaInfo, setOfertaInfo]       = useState(() => getOfertaDelDiaCache())
  const [ofertaSaving, setOfertaSaving]   = useState(false)
  const [ofertaMsg, setOfertaMsg]         = useState(null)
  const [ofertaStatus, setOfertaStatus]   = useState({ msLeft: 0, expired: false })
  const [ofertaHistory, setOfertaHistory] = useState([])

  // ── Gestión de productos (agotado / precio) ─────────────────────────────
  const [prodQuery, setProdQuery]     = useState('')
  const [selected, setSelected]       = useState(null) // copia local editable del producto elegido
  const [precioInput, setPrecioInput] = useState('')
  const [prodSaving, setProdSaving]   = useState(false)
  const [prodMsg, setProdMsg]         = useState(null)

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
    fetchOfertaDelDiaHistory().then(setOfertaHistory)
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

  const ofertaResults = useMemo(() => searchProducts(products, ofertaQuery), [ofertaQuery, products])
  const prodResults   = useMemo(() => searchProducts(products, prodQuery), [prodQuery, products])

  // ── Resumen ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total     = products.length
    const agotados  = products.filter(p => p.agotado).length
    const conOferta = products.filter(p => p.descuento > 0).length
    const marcas    = new Set(products.map(p => p.house)).size
    return { total, agotados, conOferta, marcas }
  }, [products])

  function flashOferta(text, ok = true) {
    setOfertaMsg({ text, ok })
    setTimeout(() => setOfertaMsg(null), 3500)
  }

  async function handleSetOferta(product) {
    setOfertaSaving(true)
    try {
      await setOfertaDelDiaSanity(product.id)
      const setAt = new Date().toISOString()
      setOfertaInfo({ id: product.id, setAt })
      setOfertaHistory(h => [{ _key: `local-${Date.now()}`, id: product.id, setAt }, ...h].slice(0, 20))
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

  // ── Gestión de productos ─────────────────────────────────────────────────
  function flashProd(text, ok = true) {
    setProdMsg({ text, ok })
    setTimeout(() => setProdMsg(null), 3500)
  }

  function selectProduct(p) {
    setSelected(p)
    setPrecioInput(String(p.precioUSD ?? ''))
    setProdQuery('')
  }

  async function handleToggleAgotado() {
    if (!selected) return
    setProdSaving(true)
    const next = !selected.agotado
    try {
      await setAgotadoSanity(selected.id, next)
      setSelected(s => ({ ...s, agotado: next }))
      flashProd(next ? 'Marcado como agotado' : 'Desmarcado — vuelve a mostrar stock')
    } catch {
      flashProd('Error al guardar en Sanity.', false)
    } finally {
      setProdSaving(false)
    }
  }

  async function handleSavePrecio(e) {
    e.preventDefault()
    if (!selected) return
    const val = parseFloat(precioInput.replace(',', '.'))
    if (!val || val <= 0) { flashProd('Ingresa un precio válido', false); return }
    setProdSaving(true)
    try {
      await setPrecioSanity(selected.id, val)
      setSelected(s => ({ ...s, precioUSD: val }))
      flashProd(`Precio actualizado a REF ${val}`)
    } catch {
      flashProd('Error al guardar en Sanity.', false)
    } finally {
      setProdSaving(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <p style={styles.eyebrow}>kiki fragancia</p>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>
            Cerrar sesión
          </button>
        </div>
        <h1 style={styles.title}>Resumen</h1>

        <div style={styles.statsGrid}>
          <div style={styles.statTile}>
            <p style={styles.statTileNum}>{stats.total}</p>
            <p style={styles.statTileLabel}>Productos</p>
          </div>
          <div style={styles.statTile}>
            <p style={styles.statTileNum}>{stats.agotados}</p>
            <p style={styles.statTileLabel}>Agotados</p>
          </div>
          <div style={styles.statTile}>
            <p style={styles.statTileNum}>{stats.conOferta}</p>
            <p style={styles.statTileLabel}>Con descuento</p>
          </div>
          <div style={styles.statTile}>
            <p style={styles.statTileNum}>{stats.marcas}</p>
            <p style={styles.statTileLabel}>Marcas</p>
          </div>
        </div>

        <div style={styles.divider} />

        <h1 style={styles.title}>Tasa de cambio</h1>

        <div style={styles.statusBox}>
          {info ? (
            <>
              <span style={styles.dot('var(--gold)')} />
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
          <p style={{ ...styles.msg, color: msg.ok ? 'var(--gold)' : '#E07070' }}>
            {msg.text}
          </p>
        )}

        <div style={styles.divider} />

        <h1 style={styles.title}>Oferta del día</h1>

        <div style={styles.statusBox}>
          {ofertaInfo && ofertaProduct && !ofertaExpired ? (
            <>
              <span style={styles.dot('var(--gold)')} />
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
          <p style={{ ...styles.msg, color: ofertaMsg.ok ? 'var(--gold)' : '#E07070' }}>
            {ofertaMsg.text}
          </p>
        )}

        {ofertaHistory.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <label style={styles.label}>Historial (últimas activaciones)</label>
            <div style={styles.historyBox}>
              {ofertaHistory.slice(0, 8).map(h => {
                const p = products.find(pr => pr.id === h.id)
                return (
                  <div key={h._key} style={styles.historyItem}>
                    <span style={styles.historyName}>{p ? `${p.house} ${p.name}` : `#${h.id}`}</span>
                    <span style={styles.historyDate}>{fmt(new Date(h.setAt).getTime())}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={styles.divider} />

        <h1 style={styles.title}>Gestión de productos</h1>

        <label style={styles.label}>Buscar producto (casa o nombre)</label>
        <input
          type="text"
          placeholder="ej: Kouros"
          value={prodQuery}
          onChange={e => setProdQuery(e.target.value)}
          style={{ ...styles.input, width: '100%', marginBottom: prodResults.length ? 8 : 12 }}
          autoComplete="off"
        />

        {prodResults.length > 0 && (
          <div style={styles.resultsBox}>
            {prodResults.map(p => (
              <button key={p.id} onClick={() => selectProduct(p)} style={styles.resultItem}>
                <span>{p.house} {p.name} {p.agotado ? '· agotado' : ''}</span>
                <span style={styles.resultMeta}>{p.ml ? `${p.ml}ml` : ''} · REF {p.precioUSD}</span>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div style={styles.statusBox}>
            <span style={styles.dot(selected.agotado ? '#E07070' : '#6B9B6B')} />
            <div style={{ flex: 1 }}>
              <p style={styles.statusLabel}>{selected.agotado ? 'Agotado' : 'En stock'}</p>
              <p style={styles.statusValue}>{selected.house} {selected.name}</p>
              <p style={styles.statusMeta}>{selected.ml ? `${selected.ml}ml` : ''} · REF {selected.precioUSD}</p>

              <button
                onClick={handleToggleAgotado}
                disabled={prodSaving}
                style={{ ...styles.btnGhost, width: 'auto', marginTop: 12, marginBottom: 0, padding: '8px 14px' }}
              >
                {selected.agotado ? 'Desmarcar agotado' : 'Marcar agotado'}
              </button>

              <form onSubmit={handleSavePrecio} style={{ ...styles.row, marginTop: 12 }}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={precioInput}
                  onChange={e => setPrecioInput(e.target.value)}
                  style={styles.input}
                  autoComplete="off"
                />
                <button type="submit" style={styles.btnPrimary} disabled={prodSaving}>
                  {prodSaving ? '…' : 'Guardar precio'}
                </button>
              </form>
            </div>
          </div>
        )}

        {prodMsg && (
          <p style={{ ...styles.msg, color: prodMsg.ok ? 'var(--gold)' : '#E07070' }}>
            {prodMsg.text}
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
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '48px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    height: 'fit-content',
    background: 'var(--raised)',
    border: '1px solid var(--line)',
    borderRadius: 4,
    padding: '40px 36px',
    boxShadow: 'var(--shadow)',
  },
  eyebrow: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    margin: '0 0 12px',
  },
  title: {
    fontFamily: 'var(--font-d, serif)',
    fontStyle: 'italic',
    fontSize: 28,
    fontWeight: 400,
    color: 'var(--ink)',
    margin: '0 0 28px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    marginBottom: 28,
  },
  statTile: {
    background: 'var(--chip)',
    border: '1px solid var(--line2)',
    borderRadius: 4,
    padding: '12px 6px',
    textAlign: 'center',
  },
  statTileNum: {
    fontFamily: 'var(--font-d, serif)',
    fontSize: 22,
    color: 'var(--gold)',
    margin: '0 0 2px',
  },
  statTileLabel: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 9,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint)',
    margin: 0,
  },
  statusBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: 'var(--chip)',
    border: '1px solid var(--line2)',
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
    color: 'var(--ink-faint)',
    margin: '0 0 4px',
  },
  statusValue: {
    fontFamily: 'var(--font-d, serif)',
    fontSize: 22,
    color: 'var(--ink)',
    margin: '0 0 2px',
  },
  unit: {
    fontSize: 14,
    color: 'var(--ink-faint)',
  },
  statusMeta: {
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 11,
    color: 'var(--ink-faint)',
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
    color: 'var(--ink-faint)',
    marginBottom: 8,
  },
  row: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    background: 'var(--chip)',
    border: '1px solid var(--line)',
    borderRadius: 3,
    padding: '10px 14px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 15,
    color: 'var(--ink)',
    outline: 'none',
  },
  btnPrimary: {
    background: 'var(--gold)',
    color: 'var(--gold-fill-ink)',
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
    border: '1px solid var(--line2)',
    borderRadius: 3,
    padding: '10px 20px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint)',
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
    background: 'var(--line2)',
    margin: '32px 0 28px',
  },
  resultsBox: {
    border: '1px solid var(--line)',
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
    background: 'var(--chip)',
    border: 'none',
    borderBottom: '1px solid var(--line2)',
    padding: '10px 14px',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 13,
    color: 'var(--ink)',
    cursor: 'pointer',
    textAlign: 'left',
  },
  resultMeta: {
    flexShrink: 0,
    fontSize: 10,
    color: 'var(--ink-faint)',
  },
  historyBox: {
    border: '1px solid var(--line2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    padding: '8px 12px',
    borderBottom: '1px solid var(--line2)',
    fontFamily: 'var(--font-s, sans-serif)',
    fontSize: 12,
  },
  historyName: {
    color: 'var(--ink)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  historyDate: {
    flexShrink: 0,
    color: 'var(--ink-faint)',
    fontSize: 10,
  },
}
