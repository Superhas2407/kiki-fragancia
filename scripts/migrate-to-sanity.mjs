/**
 * Migra todos los productos de products-enriched.js a Sanity.
 * Uso: node scripts/migrate-to-sanity.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
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
  throw new Error('SANITY_TOKEN no encontrado')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

// Carga los productos desde el archivo JS existente
const dataPath = join(__dirname, '../src/data/products-enriched.js')
const raw = readFileSync(dataPath, 'utf8')
const match = raw.match(/export const products\s*=\s*(\[[\s\S]*\])/)
if (!match) {
  console.error('No se pudo parsear products-enriched.js')
  process.exit(1)
}
const products = JSON.parse(match[1])

console.log(`Migrando ${products.length} productos a Sanity...`)

let ok = 0
let err = 0

for (const p of products) {
  try {
    await client.createOrReplace({
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
      notasSalida: p.notasSalida ?? null,
      notasCorazon: p.notasCorazon ?? null,
      notasFondo: p.notasFondo ?? null,
    })
    ok++
    if (ok % 50 === 0) console.log(`  ${ok}/${products.length}...`)
  } catch (e) {
    console.error(`Error en ID ${p.id}:`, e.message)
    err++
  }
}

console.log(`\nListo: ${ok} subidos, ${err} errores.`)
