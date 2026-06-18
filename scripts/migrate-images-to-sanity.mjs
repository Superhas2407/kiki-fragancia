/**
 * Sube las fotos locales de productos a Sanity como sanityImage.
 * Solo sube productos que aún no tienen sanityImage en Sanity.
 * Uso: node scripts/migrate-images-to-sanity.mjs
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
  throw new Error('SANITY_TOKEN no encontrado en .env.local')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

const publicDir = join(__dirname, '../public/products')

// 1. Cargar productos locales
const dataPath = join(__dirname, '../src/data/products-index.js')
const raw = readFileSync(dataPath, 'utf8')
const m = raw.match(/export const products\s*=\s*(\[[\s\S]*\])/)
if (!m) { console.error('No se pudo parsear products-index.js'); process.exit(1) }
const localProducts = JSON.parse(m[1])

// 2. Obtener cuáles ya tienen sanityImage en Sanity (para no re-subir)
console.log('Consultando Sanity para ver qué productos ya tienen sanityImage...')
const existing = await client.fetch(
  `*[_type == "product" && defined(sanityImage)] { id }`
)
const existingIds = new Set(existing.map(p => p.id))
console.log(`  ${existingIds.size} productos ya tienen sanityImage — se saltarán\n`)

// 3. Filtrar solo los que tienen imagen local y no tienen sanityImage
const toMigrate = localProducts.filter(p =>
  p.image &&
  !existingIds.has(p.id) &&
  existsSync(join(publicDir, p.image))
)
const noFile = localProducts.filter(p => p.image && !existsSync(join(publicDir, p.image)))

console.log(`Total productos: ${localProducts.length}`)
console.log(`Ya migrados: ${existingIds.size}`)
console.log(`Sin archivo local: ${noFile.length}`)
console.log(`A migrar ahora: ${toMigrate.length}\n`)

if (toMigrate.length === 0) {
  console.log('¡Nada que migrar! Todos los productos ya tienen sanityImage.')
  process.exit(0)
}

let ok = 0, err = 0

for (const p of toMigrate) {
  const imgPath = join(publicDir, p.image)
  try {
    const fileBuffer = readFileSync(imgPath)
    const asset = await client.assets.upload('image', fileBuffer, {
      filename: p.image,
      contentType: 'image/webp',
    })

    await client.patch(`product-${p.id}`).set({
      sanityImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    }).commit()

    ok++
    process.stdout.write(`\r  ✓ ${ok}/${toMigrate.length} — ${p.house} ${p.name}`.padEnd(80))
  } catch (e) {
    err++
    console.error(`\n  ✗ Error en ${p.image}: ${e.message}`)
  }
}

console.log(`\n\nListo: ${ok} subidas, ${err} errores.`)
if (noFile.length > 0) {
  console.log(`\nProductos sin archivo local (requieren foto manual en Sanity):`)
  noFile.forEach(p => console.log(`  - [${p.id}] ${p.house} ${p.name} → ${p.image}`))
}
