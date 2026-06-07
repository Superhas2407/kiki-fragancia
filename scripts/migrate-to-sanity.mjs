/**
 * Migra todos los productos de products-enriched.js a Sanity.
 * Uso: node scripts/migrate-to-sanity.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BATCH_SIZE = 50

function toNotesArray(val) {
  if (!val) return null
  if (Array.isArray(val)) return val.filter(Boolean)
  return val.split(',').map(n => n.trim()).filter(Boolean)
}

function loadToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN
  const envPath = join(__dirname, '../.env.local')
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf8').match(/SANITY_TOKEN=(.+)/)
    if (match) return match[1].trim()
  }
  throw new Error('SANITY_TOKEN no encontrado')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

const dataPath = join(__dirname, '../src/data/products-enriched.js')
const raw = readFileSync(dataPath, 'utf8')
const match = raw.match(/export const products\s*=\s*(\[[\s\S]*\])/)
if (!match) {
  console.error('No se pudo parsear products-enriched.js')
  process.exit(1)
}
const products = JSON.parse(match[1])
console.log(`Migrando ${products.length} productos en batches de ${BATCH_SIZE}...`)

let ok = 0
let err = 0

for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = products.slice(i, i + BATCH_SIZE)
  const transaction = client.transaction()

  for (const p of batch) {
    transaction.createOrReplace({
      _type: 'product',
      _id: `product-${p.id}`,
      id: p.id,
      house: p.house,
      name: p.name,
      image: p.image ?? null,
      precioUSD: p.precioUSD ?? null,
      ml: p.ml ?? null,
      genero: p.genero ?? null,
      familia: p.familia ?? null,
      tipo: p.tipo ?? null,
      categoria: p.categoria ?? null,
      descripcion: p.descripcion ?? null,
      notasSalida: toNotesArray(p.notasSalida),
      notasCorazon: toNotesArray(p.notasCorazon),
      notasFondo: toNotesArray(p.notasFondo),
    })
  }

  try {
    await transaction.commit()
    ok += batch.length
    console.log(`  ${ok}/${products.length}...`)
  } catch (e) {
    console.error(`Error en batch ${i}–${i + batch.length}:`, e.message)
    err += batch.length
  }
}

console.log(`\nListo: ${ok} subidos, ${err} errores.`)
