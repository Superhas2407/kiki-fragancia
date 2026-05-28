/**
 * Converts all product and note images to WebP, then updates data references.
 * Run: node scripts/convert-to-webp.mjs
 * Requires: npm i -D sharp
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('❌  sharp no instalado. Corre: npm i -D sharp')
  process.exit(1)
}

const DIRS = [
  path.join(ROOT, 'public/products'),
  path.join(ROOT, 'public/notes'),
]
const EXTS = new Set(['.jpg', '.jpeg', '.png'])

// ── 1. Convert images ────────────────────────────────────────────────────────

let converted = 0
let skipped = 0
let failed = 0

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) { console.log(`⚠️  No existe: ${dir}`); continue }
  const files = fs.readdirSync(dir).filter(f => EXTS.has(path.extname(f).toLowerCase()))
  console.log(`\n📁 ${path.basename(dir)}: ${files.length} archivos a convertir`)

  for (const file of files) {
    const src = path.join(dir, file)
    const dest = path.join(dir, path.basename(file, path.extname(file)) + '.webp')

    if (fs.existsSync(dest)) {
      fs.unlinkSync(src)
      skipped++
      continue
    }

    try {
      await sharp(src).webp({ quality: 82, effort: 4 }).toFile(dest)
      fs.unlinkSync(src)
      converted++
      process.stdout.write(`\r  ✅ ${converted + skipped}/${files.length}`)
    } catch (e) {
      console.error(`\n  ❌ ${file}: ${e.message}`)
      failed++
    }
  }
  console.log()
}

console.log(`\n✅ Convertidos: ${converted}  |  Ya existían: ${skipped}  |  Errores: ${failed}`)

// ── 2. Update notes-images.js ────────────────────────────────────────────────

const notesFile = path.join(ROOT, 'src/data/notes-images.js')
let notesContent = fs.readFileSync(notesFile, 'utf-8')
const notesBefore = (notesContent.match(/\.jpe?g/gi) || []).length
notesContent = notesContent.replace(/\.(jpg|jpeg|png)/gi, '.webp')
fs.writeFileSync(notesFile, notesContent)
console.log(`📝 notes-images.js: ${notesBefore} referencias actualizadas → .webp`)

// ── 3. Update products-enriched.js ──────────────────────────────────────────

const enrichedFile = path.join(ROOT, 'src/data/products-enriched.js')
let enrichedContent = fs.readFileSync(enrichedFile, 'utf-8')
const enrichedBefore = (enrichedContent.match(/\.jpe?g/gi) || []).length
enrichedContent = enrichedContent.replace(/\.(jpg|jpeg|png)(?=")/gi, '.webp')
fs.writeFileSync(enrichedFile, enrichedContent)
console.log(`📝 products-enriched.js: ${enrichedBefore} referencias actualizadas → .webp`)

// ── 4. Update products-index.js ──────────────────────────────────────────────

const indexFile = path.join(ROOT, 'src/data/products-index.js')
let indexContent = fs.readFileSync(indexFile, 'utf-8')
const indexBefore = (indexContent.match(/\.jpe?g/gi) || []).length
indexContent = indexContent.replace(/\.(jpg|jpeg|png)(?=")/gi, '.webp')
fs.writeFileSync(indexFile, indexContent)
console.log(`📝 products-index.js: ${indexBefore} referencias actualizadas → .webp`)

console.log('\n🎉 Listo. Corre npm run build para verificar.')
