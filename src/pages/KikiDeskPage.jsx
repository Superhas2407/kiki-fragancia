import { useState } from 'react'
import { setTasaManual, clearTasaManual, getTasaManualInfo } from '../hooks/useTasaCambio'

function fmt(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })
}

export default function KikiDeskPage() {
  const [input, setInput]   = useState('')
  const [info, setInfo]     = useState(() => getTasaManualInfo())
  const [msg, setMsg]       = useState(null)

  function flash(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3000)
  }

  function handleSet(e) {
    e.preventDefault()
    const val = parseFloat(input.replace(',', '.'))
    if (!val || val <= 0) { flash('Ingresa un número válido', false); return }
    setTasaManual(val)
    setInfo(getTasaManualInfo())
    setInput('')
    flash(`Tasa manual guardada: ${val.toLocaleString('es-VE')} Bs/$`)
  }

  function handleClear() {
    clearTasaManual()
    setInfo(null)
    flash('Tasa manual eliminada — usando API', true)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>kiki fragancia</p>
        <h1 style={styles.title}>Tasa de cambio</h1>

        <div style={styles.statusBox}>
          {info ? (
            <>
              <span style={styles.dot('#C9A84C')} />
              <div>
                <p style={styles.statusLabel}>Tasa manual activa</p>
                <p style={styles.statusValue}>{info.rate.toLocaleString('es-VE')} <span style={styles.unit}>Bs/$</span></p>
                <p style={styles.statusMeta}>Guardada el {fmt(info.ts)}</p>
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
            <button type="submit" style={styles.btnPrimary}>Guardar</button>
          </div>
        </form>

        {info && (
          <button onClick={handleClear} style={styles.btnGhost}>
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
