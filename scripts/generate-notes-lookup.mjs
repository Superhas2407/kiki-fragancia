/**
 * Genera src/data/notes-lookup.js desde products-enriched.js.
 * Las notas de salida, corazón y fondo se concatenan en una sola string por producto.
 *
 * Uso: node scripts/generate-notes-lookup.mjs
 */

import { createRequire } from 'module'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Importar usando require para evitar el parse de ES modules con top-level await
const { createServer } = await import('vite').catch(() => null) ?? {}

// Leer directamente el archivo como texto y evaluar
import { readFileSync } from 'fs'

const enrichedPath = join(__dirname, '../src/data/products-enriched.js')
const raw = readFileSync(enrichedPath, 'utf-8')

// Extraer el array usando una evaluación controlada
const match = raw.match(/export const products\s*=\s*(\[[\s\S]*\])/)
if (!match) {
  console.error('No se encontró el array de productos en products-enriched.js')
  process.exit(1)
}

const products = JSON.parse(match[1])

function toStr(val) {
  if (!val) return ''
  if (Array.isArray(val)) return val.join(', ')
  return val
}

const entries = products.map(p => {
  const parts = [toStr(p.notasSalida), toStr(p.notasCorazon), toStr(p.notasFondo)].filter(Boolean)
  const notes = parts.join(', ')
  return `  ${p.id}: ${JSON.stringify(notes)}`
})

const output = `// Notas olfativas por producto ID — generado automáticamente
// Regenerar: node scripts/generate-notes-lookup.mjs
export const notesLookup = {
${entries.join(',\n')}
}
`

const outPath = join(__dirname, '../src/data/notes-lookup.js')
writeFileSync(outPath, output, 'utf-8')
console.log(`✓ notes-lookup.js generado con ${products.length} productos`)
