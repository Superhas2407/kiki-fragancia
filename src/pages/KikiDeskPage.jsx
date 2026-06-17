import { useState, useEffect } from 'react'
import { setTasaSanity, clearTasaSanity, getTasaSanityCache } from '../hooks/useTasaCambio'
import { sanityClient } from '../lib/sanityClient'
import { supabase } from '../lib/supabaseClient'

function fmt(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })
}

export default function KikiDeskPage() {
  const [input, setInput]   = useState('')
  const [info, setInfo]     = useState(() => getTasaSanityCache())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState(null)

  // Fetch live value from Sanity on mount
  useEffect(() => {
    sanityClient.fetch(`*[_id == "kiki-ajustes"][0]{ tasaManual, updatedAt }`)
      .then(doc => {
        if (doc?.tasaManual > 0) setInfo({ rate: doc.tasaManual, ts: new Date(doc.updatedAt).getTime() })
        else setInfo(null)
      })
      .catch(() => {})
  }, [])

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
}
