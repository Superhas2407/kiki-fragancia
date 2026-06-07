/**
 * Sube las fotos de productos a Sanity y las vincula a cada documento.
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
  throw new Error('SANITY_TOKEN no encontrado')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

const publicDir = join(__dirname, '../public/products')

// Carga el índice de productos para obtener los nombres de imagen
const dataPath = join(__dirname, '../src/data/products-index.js')
const raw = readFileSync(dataPath, 'utf8')
const match = raw.match(/export const products\s*=\s*(\[[\s\S]*\])/)
if (!match) { console.error('No se pudo parsear products-index.js'); process.exit(1) }
const products = JSON.parse(match[1])

console.log(`Subiendo fotos de ${products.length} productos...\n`)

let ok = 0, skip = 0, err = 0

for (const p of products) {
  if (!p.image) { skip++; continue }

  const imgPath = join(publicDir, p.image)
  if (!existsSync(imgPath)) {
    console.warn(`  ⚠ No encontrada: ${p.image}`)
    skip++
    continue
  }

  try {
    const fileBuffer = readFileSync(imgPath)
    const asset = await client.assets.upload('image', fileBuffer, {
      filename: p.image,
      contentType: 'image/webp',
    })

    await client.patch(`product-${p.id}`).set({
      imagen: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    }).commit()

    ok++
    if (ok % 20 === 0) console.log(`  ${ok} fotos subidas...`)
  } catch (e) {
    console.error(`  ✗ Error en ${p.image}: ${e.message}`)
    err++
  }
}

console.log(`\nListo: ${ok} subidas, ${skip} sin foto, ${err} errores.`)
