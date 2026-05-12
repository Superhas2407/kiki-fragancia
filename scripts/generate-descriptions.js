import { readFileSync, writeFileSync, existsSync } from 'fs'
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const PRODUCTS_FILE   = path.join(ROOT, 'src', 'data', 'products.js')
const OUT_FILE        = path.join(ROOT, 'src', 'data', 'products-enriched.js')
const API_KEY         = process.env.ANTHROPIC_API_KEY
const MODEL           = 'claude-sonnet-4-20250514'
const DELAY_MS        = 1100

if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY no está definida.')
  process.exit(1)
}

// --- Load source products ---
// products.js uses ES module syntax, so we read + eval via a temp conversion
const raw = readFileSync(PRODUCTS_FILE, 'utf8')
// Strip the export keyword so we can eval it as a plain assignment
const code = raw.replace(/^export const products\s*=\s*/, 'const products = ')
let products
{
  // Use Function constructor to evaluate in module-like scope
  const fn = new Function(code + '\nreturn products;')
  products = fn()
}

// --- Load already-enriched products (for resume) ---
let enriched = []
const existingIds = new Set()

if (existsSync(OUT_FILE)) {
  const outRaw = readFileSync(OUT_FILE, 'utf8')
  const outCode = outRaw.replace(/^export const products\s*=\s*/, 'const products = ')
  try {
    const fn = new Function(outCode + '\nreturn products;')
    enriched = fn()
    for (const p of enriched) existingIds.add(p.id)
    console.log(`Retomando: ${enriched.length} productos ya procesados, saltando sus IDs.`)
  } catch {
    console.log('No se pudo parsear el archivo existente, empezando desde cero.')
  }
}

// --- Helpers ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function saveProgress() {
  const lines = enriched.map(p => '  ' + JSON.stringify(p)).join(',\n')
  writeFileSync(OUT_FILE, `export const products = [\n${lines}\n]\n`, 'utf8')
}

function buildPrompt(product) {
  return `Fragancia: ${product.name} de ${product.house}. Familia olfativa: ${product.familia}. Género: ${product.genero}.

Genera una descripción detallada con este formato JSON exacto, sin markdown ni backticks, solo el objeto JSON:
{
  "notasSalida": "lista de notas reales de salida",
  "notasCorazon": "lista de notas reales de corazón",
  "notasFondo": "lista de notas reales de fondo",
  "descripcion": "descripción sensorial evocadora de 3-4 oraciones",
  "paraQuien": "a quién va dirigida",
  "ocasion": "ocasión ideal",
  "estela": "estela y duración esperada"
}`
}

async function fetchDescription(product) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system:
        'Eres un experto en perfumería de nicho con conocimiento enciclopédico de fragancias árabes, orientales y nicho. Escribes en español con lenguaje poético, sensorial y lujoso. Nunca inventas notas — solo usas las notas reales y conocidas de cada fragancia.',
      messages: [
        { role: 'user', content: buildPrompt(product) },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`HTTP ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  // Extract JSON — strip any accidental markdown fences
  const cleaned = text.replace(/```json?\s*/gi, '').replace(/```/g, '').trim()

  // Find the first { ... } block
  const start = cleaned.indexOf('{')
  const end   = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error(`No JSON found in response: ${text}`)

  return JSON.parse(cleaned.slice(start, end + 1))
}

// --- Main loop ---
const todo = products.filter(p => !existingIds.has(p.id))
const total = products.length
let done = enriched.length

console.log(`Total: ${total} productos. Por procesar: ${todo.length}.\n`)

for (const product of todo) {
  done++
  const label = `[${done}/${total}] ${product.name} — ${product.house}`

  try {
    const extra = await fetchDescription(product)
    const enrichedProduct = { ...product, ...extra }
    enriched.push(enrichedProduct)
    saveProgress()
    console.log(`✓ ${label}`)
  } catch (err) {
    console.error(`✗ ${label} → ${err.message}`)
    // Still push the original so the index stays consistent; mark as failed
    enriched.push({ ...product, _error: err.message })
    saveProgress()
  }

  if (done < total) await sleep(DELAY_MS)
}

console.log(`\nListo. Archivo guardado en: ${OUT_FILE}`)
