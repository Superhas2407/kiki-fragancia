/**
 * Sincroniza Sanity → archivos locales.
 * Actualiza products-index.js, products-enriched.js y notes-lookup.js.
 *
 * Uso: node scripts/sync-from-sanity.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN
  const envPath = join(__dirname, '../.env.local')
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf8').match(/SANITY_TOKEN=(.+)/)
    if (match) return match[1].trim()
  }
  throw new Error('SANITY_TOKEN no encontrado en .env.local')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

const QUERY = `*[_type == "product"] | order(id asc) {
  id, house, name, image, sanityImage, familia, tipo, genero,
  ml, precioUSD, descuento, agotado, categoria, variantIds, descripcion,
  notasSalida, notasCorazon, notasFondo, acordes,
  cuandoEpocaSeca, cuandoLluviosa, cuandoDia, cuandoNoche
}`

async function fetchWithRetry(query, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.fetch(query)
    } catch (err) {
      const isServerError = err?.statusCode >= 500
      if (isServerError && attempt < retries) {
        console.warn(`  ⚠ Sanity error (intento ${attempt}/${retries}): ${err.message}. Reintentando en ${delayMs / 1000}s...`)
        await new Promise(r => setTimeout(r, delayMs))
        delayMs *= 2
      } else {
        throw err
      }
    }
  }
}

console.log('Obteniendo productos desde Sanity...')
const raw = await fetchWithRetry(QUERY)
console.log(`  ${raw.length} productos recibidos`)

function toStr(val) {
  if (!val) return null
  if (Array.isArray(val)) return val.join(', ')
  return val
}

function toArr(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  return val.split(',').map(n => n.trim()).filter(Boolean)
}

// ── products-index.js ────────────────────────────────────────────────────────
const indexProducts = raw.map(p => {
  const obj = {
    id:        p.id,
    house:     p.house,
    name:      p.name,
    image:     p.image ?? null,
    familia:   p.familia ?? null,
    tipo:      p.tipo ?? null,
    genero:    p.genero ?? null,
    ml:        p.ml ?? null,
    precioUSD: p.precioUSD ?? null,
    categoria: p.categoria ?? null,
  }
  if (p.variantIds?.length) obj.variantIds = p.variantIds
  if (p.descuento)          obj.descuento  = p.descuento
  if (p.agotado)            obj.agotado    = true
  return obj
})

writeFileSync(
  join(__dirname, '../src/data/products-index.js'),
  `export const products = ${JSON.stringify(indexProducts, null, 2)}\n`,
  'utf-8'
)
console.log('✓ products-index.js actualizado')

// ── products-enriched.js ─────────────────────────────────────────────────────
const enrichedProducts = raw.map(p => {
  const notasSalida  = toStr(p.notasSalida)
  const notasCorazon = toStr(p.notasCorazon)
  const notasFondo   = toStr(p.notasFondo)
  const notes = [
    ...toArr(p.notasSalida),
    ...toArr(p.notasCorazon),
    ...toArr(p.notasFondo),
  ]

  const obj = {
    id:          p.id,
    house:       p.house,
    name:        p.name,
    image:       p.image ?? null,
    familia:     p.familia ?? null,
    tipo:        p.tipo ?? null,
    genero:      p.genero ?? null,
    descripcion: p.descripcion ?? null,
    description: p.descripcion ?? null,
    notasSalida:  notasSalida,
    notasCorazon: notasCorazon,
    notasFondo:   notasFondo,
    notes,
    ml:        p.ml ?? null,
    precioUSD: p.precioUSD ?? null,
    categoria: p.categoria ?? null,
  }
  if (p.variantIds?.length) obj.variantIds = p.variantIds
  if (p.descuento)          obj.descuento  = p.descuento
  if (p.agotado)            obj.agotado    = true
  return obj
})

writeFileSync(
  join(__dirname, '../src/data/products-enriched.js'),
  `export const products = ${JSON.stringify(enrichedProducts, null, 2)}\n`,
  'utf-8'
)
console.log('✓ products-enriched.js actualizado')

// ── notes-lookup.js ──────────────────────────────────────────────────────────
const entries = enrichedProducts.map(p => {
  const parts = [p.notasSalida, p.notasCorazon, p.notasFondo].filter(Boolean)
  return `  ${p.id}: ${JSON.stringify(parts.join(', '))}`
})

writeFileSync(
  join(__dirname, '../src/data/notes-lookup.js'),
  `// Notas olfativas por producto ID — generado automáticamente\n// Regenerar: node scripts/sync-from-sanity.mjs\nexport const notesLookup = {\n${entries.join(',\n')}\n}\n`,
  'utf-8'
)
console.log('✓ notes-lookup.js actualizado')

console.log(`\nListo. ${raw.length} productos sincronizados.`)
