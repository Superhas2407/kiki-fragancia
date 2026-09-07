/**
 * useOfertaDelDia — producto activo en el widget "Oferta del día"
 * Fuente: Sanity (kiki-ajustes.ofertaDelDiaId + ofertaDelDiaSetAt)
 * Expira automáticamente 24h después de activarse (ver DURATION_MS).
 * Mismo patrón de caché que useTasaCambio.js.
 */
import { sanityClient } from '../lib/sanityClient'

const CACHE_KEY   = 'kiki_oferta_dia_sanity'
const CACHE_TTL   =  5 * 60 * 1000
export const OFERTA_DURATION_MS = 24 * 60 * 60 * 1000

let _promise = null
let _data    = undefined // undefined = aún no se consultó, null = ninguna activa

// ── Sanity helpers ────────────────────────────────────────────────────────────

const HISTORY_LIMIT = 20

export async function setOfertaDelDiaSanity(productId) {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  const id = Number(productId)
  if (!id) return
  const setAt = new Date().toISOString()
  // patch (no createOrReplace) para no pisar otros campos del singleton
  // (ej. tasaManual, que vive en el mismo documento kiki-ajustes)
  await sanityWriteClient.createIfNotExists({ _id: 'kiki-ajustes', _type: 'ajustes' })

  // Antepone la nueva activación al historial (más reciente primero, tope 20)
  const current = await sanityWriteClient.fetch(`*[_id == "kiki-ajustes"][0]{ ofertaDelDiaHistory }`)
  const prevHistory = Array.isArray(current?.ofertaDelDiaHistory) ? current.ofertaDelDiaHistory : []
  const entry = { _key: `oferta-${Date.now()}`, id, setAt }
  const history = [entry, ...prevHistory].slice(0, HISTORY_LIMIT)

  await sanityWriteClient
    .patch('kiki-ajustes')
    .set({ ofertaDelDiaId: id, ofertaDelDiaSetAt: setAt, ofertaDelDiaHistory: history })
    .commit()
  _data = { id, setAt }
  _promise = null
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ..._data, ts: Date.now() })) } catch {}
}

/** Últimas activaciones de la oferta del día, más reciente primero. */
export async function fetchOfertaDelDiaHistory() {
  try {
    const doc = await sanityClient.fetch(`*[_id == "kiki-ajustes"][0]{ ofertaDelDiaHistory }`)
    return Array.isArray(doc?.ofertaDelDiaHistory) ? doc.ofertaDelDiaHistory : []
  } catch {
    return []
  }
}

export async function clearOfertaDelDiaSanity() {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  await sanityWriteClient.patch('kiki-ajustes').unset(['ofertaDelDiaId', 'ofertaDelDiaSetAt']).commit()
  _data    = null
  _promise = null
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

export function getOfertaDelDiaCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return c ?? null
  } catch { return null }
}

// ── Fetch pipeline ────────────────────────────────────────────────────────────

function readCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (c && Date.now() - c.ts < CACHE_TTL) return { id: c.id, setAt: c.setAt }
  } catch {}
  return null
}

async function fetchOfertaDelDia() {
  if (_data !== undefined) return _data
  if (!_promise) {
    _promise = (async () => {
      try {
        const cached = readCache()
        if (cached) { _data = cached; return _data }

        const doc = await sanityClient.fetch(
          `*[_id == "kiki-ajustes"][0]{ ofertaDelDiaId, ofertaDelDiaSetAt }`
        )
        _data = doc?.ofertaDelDiaId ? { id: doc.ofertaDelDiaId, setAt: doc.ofertaDelDiaSetAt } : null
        if (_data) {
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ..._data, ts: Date.now() })) } catch {}
        }
      } catch {
        _promise = null
        _data = null
      }
      return _data
    })()
  }
  return _promise
}

// ── Hook React ────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

/** Devuelve { id, setAt } mientras esté dentro de las 24h, o null si no hay/expiró. */
export function useOfertaDelDia() {
  const [data, setData]       = useState(() => readCache())
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    fetchOfertaDelDia().then(d => setData(d))
  }, [])

  // El check de expiración vive en un efecto (no en el cuerpo del render)
  // para no llamar Date.now() de forma impura durante el render.
  useEffect(() => {
    const check = () => {
      if (!data) { setExpired(false); return }
      const end = new Date(data.setAt).getTime() + OFERTA_DURATION_MS
      setExpired(Date.now() >= end)
    }
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [data])

  return (!data || expired) ? null : data
}
