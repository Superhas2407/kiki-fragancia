/**
 * useTasaCambio — tasa de cambio USDT→VES
 * Prioridad: Sanity (kiki-ajustes, TTL 5min) > API dolarapi (TTL 30min)
 */
import { sanityClient } from '../lib/sanityClient'

const CACHE_KEY    = 'kiki_tasa_bs'
const SANITY_CACHE = 'kiki_tasa_sanity'
const API_TTL      = 30 * 60 * 1000
const SANITY_TTL   =  5 * 60 * 1000

let _promise = null
let _rate    = null

// ── Sanity helpers ────────────────────────────────────────────────────────────

export async function setTasaSanity(rate) {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  const r = Number(rate)
  if (!r || r <= 0) return
  await sanityWriteClient.createOrReplace({
    _id:   'kiki-ajustes',
    _type: 'ajustes',
    tasaManual: r,
    updatedAt: new Date().toISOString(),
  })
  _rate    = r
  _promise = null
  try { localStorage.setItem(SANITY_CACHE, JSON.stringify({ rate: r, ts: Date.now() })) } catch {}
}

export async function clearTasaSanity() {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  await sanityWriteClient.patch('kiki-ajustes').unset(['tasaManual']).commit()
  _rate    = null
  _promise = null
  try { localStorage.removeItem(SANITY_CACHE) } catch {}
}

export function getTasaSanityCache() {
  try {
    const c = JSON.parse(localStorage.getItem(SANITY_CACHE) || 'null')
    return c ?? null
  } catch { return null }
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

function readSanityCache() {
  try {
    const c = JSON.parse(localStorage.getItem(SANITY_CACHE) || 'null')
    if (c && Date.now() - c.ts < SANITY_TTL && c.rate > 0) return c.rate
  } catch {}
  return null
}

function readApiCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (c && Date.now() - c.ts < API_TTL && c.rate > 0) return c.rate
  } catch {}
  return null
}

function writeApiCache(rate) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() })) } catch {}
}

// ── Fetch pipeline ────────────────────────────────────────────────────────────

async function fetchRate() {
  if (_rate) return _rate
  if (!_promise) {
    _promise = (async () => {
      try {
        // 1. Sanity local cache (5 min)
        const sanityCache = readSanityCache()
        if (sanityCache) { _rate = sanityCache; return _rate }

        // 2. Sanity fetch
        const doc = await sanityClient.fetch(
          `*[_id == "kiki-ajustes"][0]{ tasaManual, updatedAt }`
        )
        if (doc?.tasaManual > 0) {
          _rate = doc.tasaManual
          try {
            localStorage.setItem(SANITY_CACHE, JSON.stringify({ rate: _rate, ts: Date.now() }))
          } catch {}
          return _rate
        }

        // 3. API dolarapi local cache (30 min)
        const apiCache = readApiCache()
        if (apiCache) { _rate = apiCache; return _rate }

        // 4. API dolarapi fetch
        const res  = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo', { signal: AbortSignal.timeout(8000) })
        const data = await res.json()
        if (data?.promedio > 0) {
          _rate = data.promedio
          writeApiCache(_rate)
        }
      } catch {
        _promise = null
      }
      return _rate
    })()
  }
  return _promise
}

// ── Hook React ────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

export function useTasaCambio() {
  const [tasa, setTasa] = useState(() => readSanityCache() || readApiCache() || _rate)

  useEffect(() => {
    if (tasa) return
    fetchRate().then(r => { if (r) setTasa(r) })
  }, [tasa])

  return tasa
}
