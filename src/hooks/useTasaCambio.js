/**
 * useTasaCambio — tasa de cambio USDT→VES
 * Prioridad: manual (kiki_tasa_manual) > API (kiki_tasa_bs, TTL 30min)
 */

const CACHE_KEY  = 'kiki_tasa_bs'
const MANUAL_KEY = 'kiki_tasa_manual'
const CACHE_TTL  = 30 * 60 * 1000 // 30 min

let _promise = null
let _rate    = null

function readManual() {
  try {
    const m = JSON.parse(localStorage.getItem(MANUAL_KEY) || 'null')
    if (m && m.rate > 0) return m.rate
  } catch {}
  return null
}

export function setTasaManual(rate) {
  const r = Number(rate)
  if (!r || r <= 0) return
  try { localStorage.setItem(MANUAL_KEY, JSON.stringify({ rate: r, ts: Date.now() })) } catch {}
  _rate    = r
  _promise = null
}

export function clearTasaManual() {
  try { localStorage.removeItem(MANUAL_KEY) } catch {}
  _rate    = null
  _promise = null
}

export function getTasaManualInfo() {
  try {
    const m = JSON.parse(localStorage.getItem(MANUAL_KEY) || 'null')
    return m ?? null
  } catch { return null }
}

function readCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (c && Date.now() - c.ts < CACHE_TTL && c.rate > 0) return c.rate
  } catch {}
  return null
}

function writeCache(rate) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() })) } catch {}
}

async function fetchRate() {
  const manual = readManual()
  if (manual) { _rate = manual; return _rate }
  if (_rate)   return _rate
  if (!_promise) {
    _promise = (async () => {
      try {
        const cached = readCache()
        if (cached) { _rate = cached; return _rate }

        const res  = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo', { signal: AbortSignal.timeout(8000) })
        const data = await res.json()

        if (data?.promedio > 0) {
          _rate = data.promedio
          writeCache(_rate)
        }
      } catch {
        _promise = null
      }
      return _rate
    })()
  }
  return _promise
}

// ------------------------------------------------------------------
// Hook React
// ------------------------------------------------------------------
import { useState, useEffect } from 'react'

export function useTasaCambio() {
  const [tasa, setTasa] = useState(() => readManual() || readCache() || _rate)

  useEffect(() => {
    if (tasa) return
    fetchRate().then(r => { if (r) setTasa(r) })
  }, [tasa])

  return tasa
}
