const vm   = require('vm')
const fs   = require('fs')
const path = require('path')

const PRODUCTS_FILE = path.resolve(__dirname, '../src/data/products.js')
const OUT_FILE      = path.resolve(__dirname, '../src/data/products-enriched.js')
const API_KEY       = process.env.OPENROUTER_API_KEY
const MODEL         = 'anthropic/claude-sonnet-4'
const DELAY_MS      = 1100

// --- Load source products ---
const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8')
const arrMatch = raw.match(/export const products\s*=\s*(\[[\s\S]*?\n\])/)
if (!arrMatch) { console.error('No se encontró el array products en el archivo.'); process.exit(1) }
const products = vm.runInNewContext('(' + arrMatch[1] + ')', {})

if (!API_KEY) {
  console.error('Error: OPENROUTER_API_KEY no está definida.')
  process.exit(1)
}

// --- Load already-enriched products (for resume) ---
let enriched = []
const existingIds = new Set()

if (fs.existsSync(OUT_FILE)) {
  try {
    const outRaw  = fs.readFileSync(OUT_FILE, 'utf8')
    const outMatch = outRaw.match(/export const products\s*=\s*(\[[\s\S]*?\n\])/)
    if (outMatch) {
      enriched = vm.runInNewContext('(' + outMatch[1] + ')', {})
      for (const p of enriched)
        if (p.descripcion && p.descripcion.length > 100) existingIds.add(p.id)
      console.log(`Retomando: ${enriched.length} productos ya procesados, saltando sus IDs.`)
    }
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
  fs.writeFileSync(OUT_FILE, `export const products = [\n${lines}\n]\n`, 'utf8')
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
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'HTTP-Referer': 'https://kiki-fragancia.vercel.app',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en perfumería de nicho con conocimiento enciclopédico de fragancias árabes, orientales y nicho. Escribes en español con lenguaje poético, sensorial y lujoso. Nunca inventas notas — solo usas las notas reales y conocidas de cada fragancia.',
        },
        { role: 'user', content: buildPrompt(product) },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`HTTP ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? ''

  const stripped = text.replace(/```json?\s*/gi, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{')
  const end   = stripped.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error(`No JSON en respuesta: ${text}`)

  return JSON.parse(stripped.slice(start, end + 1))
}

// --- Main loop ---
async function main() {
  const todo  = products.filter(p => !existingIds.has(p.id))
  const total = products.length
  let done    = enriched.length

  console.log(`Total: ${total} productos. Por procesar: ${todo.length}.\n`)

  for (const product of todo) {
    done++
    const label = `[${done}/${total}] ${product.name} — ${product.house}`

    try {
      const extra = await fetchDescription(product)
      enriched.push({ ...product, ...extra })
      saveProgress()
      console.log(`✓ ${label}`)
    } catch (err) {
      console.error(`✗ ${label} → ${err.message}`)
      enriched.push({ ...product, _error: err.message })
      saveProgress()
    }

    if (done < total) await sleep(DELAY_MS)
  }

  console.log(`\nListo. Archivo guardado en: ${OUT_FILE}`)
}

main()
