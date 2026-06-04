/**
 * useTasaCambio — tasa de cambio USDT→VES
 * Fuente: API pública venezolana (paralelo/cripto)
 * Caché: localStorage, TTL 30 minutos
 * Un solo fetch por sesión de JS aunque haya múltiples consumidores
 */

const CACHE_KEY = 'kiki_tasa_bs'
const CACHE_TTL = 30 * 60 * 1000 // 30 min

let _promise = null   // promesa compartida para evitar fetches duplicados
let _rate    = null   // valor en memoria una vez resuelto

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
  if (_rate) return _rate
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
        _promise = null // permite reintentar si la red se recupera
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
  const [tasa, setTasa] = useState(() => readCache() || _rate)

  useEffect(() => {
    if (tasa) return
    fetchRate().then(r => { if (r) setTasa(r) })
  }, [tasa])

  return tasa   // null mientras carga, número cuando listo
}
