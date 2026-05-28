/**
 * Analiza products-enriched y reporta qué notas no tienen imagen.
 * Uso: node scripts/check-missing-notes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { products } from '../src/data/products-enriched.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Leer notas-images.js para saber qué tiene imagen
const notesFile = path.join(__dirname, '../src/data/notes-images.js')
const notesRaw = fs.readFileSync(notesFile, 'utf-8')
const mappedKeys = [...notesRaw.matchAll(/'([^']+)':\s*'\/notes\//g)].map(m => m[1].toLowerCase().trim())
const mappedSet = new Set(mappedKeys)

// Leer NOTES_MAP del script de descarga
const dlFile = path.join(__dirname, './download-notes.mjs')
const dlRaw = fs.readFileSync(dlFile, 'utf-8')
const inScript = [...dlRaw.matchAll(/'([^']+)':\s*[\{']/g)].map(m => m[1].toLowerCase().trim())
const inScriptSet = new Set(inScript)

// Extraer todas las notas únicas de los productos
const allNotes = new Set()
for (const p of products) {
  for (const field of ['notasSalida', 'notasCorazon', 'notasFondo']) {
    if (!p[field]) continue
    for (const n of p[field].split(',')) {
      const clean = n.trim().toLowerCase()
      if (clean) allNotes.add(clean)
    }
  }
}

const sorted = [...allNotes].sort()

const conImagen   = sorted.filter(n => mappedSet.has(n))
const enScript    = sorted.filter(n => !mappedSet.has(n) && inScriptSet.has(n))
const sinScript   = sorted.filter(n => !mappedSet.has(n) && !inScriptSet.has(n))

console.log(`\n📊 Total notas únicas en productos: ${sorted.length}`)
console.log(`   ✅ Con imagen ya descargada:       ${conImagen.length}`)
console.log(`   📥 En script, sin descargar aún:  ${enScript.length}`)
console.log(`   ⚠️  Sin cobertura alguna:          ${sinScript.length}\n`)

if (enScript.length) {
  console.log('📥 Se descargarán al correr download-notes.mjs:')
  for (const n of enScript) console.log(`   - ${n}`)
}

if (sinScript.length) {
  console.log('\n⚠️  Faltan en el script — hay que agregar:')
  for (const n of sinScript) console.log(`   - ${n}`)
}

console.log()
