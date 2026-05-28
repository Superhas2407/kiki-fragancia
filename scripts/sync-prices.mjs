/**
 * Sincroniza precios desde LISTA DE PRECIOS PDF ABRIL 2.md → products-enriched.js + products-index.js
 * Run: node scripts/sync-prices.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MD_FILE   = 'C:/Users/Azael/Downloads/LISTA DE PRECIOS PDF ABRIL 2.md'
const ENRICHED  = path.join(__dirname, '../src/data/products-enriched.js')
const INDEX     = path.join(__dirname, '../src/data/products-index.js')

// ── Brand normalization: price-list brand → DB house ────────────────────────
const BRAND_MAP = {
  'ADIDAS':             ['ADIDAS'],
  'AFNAN':              ['AFNAN'],
  'AL HARAMAIN':        ['AL HARAMAIN'],
  'ANIMALE':            ['ANIMALE'],
  'ANTONIO BANDERAS':   ['ANTONIO BANDERAS'],
  'ARABIYAT SUGAR':     ['ARABIYAT'],
  'ARAMIS':             ['ARAMIS'],
  'ARIANA GRANDE':      ['ARIANA GRANDE'],
  'ARMAF':              ['ARMAF'],
  'ARMANI':             ['GIORGIO ARMANI'],
  'AZZARO':             ['AZZARO'],
  'BENETTON':           ['BENETTON'],
  'BHARARA':            ['BHARARA'],
  'BILLIE EILISH':      ['BILLIE EILISH'],
  'BOUCHERON':          ['BOUCHERON'],
  'BRITNEY SPEARS':     ['BRITNEY SPEARS'],
  'BVLGARI':            ['BVLGARI'],
  'CACHAREL':           ['CACHAREL'],
  'CALVIN KLEIN':       ['CALVIN', 'CALVIN KLEIN'],
  'CAROLINA HERRERA':   ['CAROLINA HERRERA'],
  'CLINIQUE':           ['CLINIQUE'],
  'CREED':              ['CREED'],
  'CUBA':               ['CUBA'],
  'D&G':                ['DOLCE & GABBANA'],
  'DANIELA KOSAN':      [],
  'DAVIDOFF':           ['DAVIDOFF'],
  'DIESEL':             ['DIESEL'],
  'DIOR':               ['DIOR'],
  'DOLCE & GABANNA':    ['DOLCE & GABBANA'],
  'DOLCE & GABBANA':    ['DOLCE & GABBANA'],
  'DUMONT':             ['DUMONT'],
  'DUMONT PARIS':       ['DUMONT'],
  'ELIZABETH ARDEN':    ['ELIZABETH ARDEN'],
  'EMPER':              ['EMPER'],
  'EMPORIO ARMANI':     ['EMPORIO ARMANI'],
  'ESCADA':             ['ESCADA'],
  'ESTEE LAUDER':       ['ESTÉE LAUDER'],
  'FERRARI SCUDERIA':   ['FERRARI SCUDERIA'],
  'GIORGIO ARMANI':     ['GIORGIO ARMANI'],
  'GIVENCHY':           ['GIVENCHY'],
  'GRANDEUR TUBBEES':   ['GRANDEUR TUBBEES'],
  'GRANDEUR TUBBES':    ['GRANDEUR TUBBEES'],
  'RANDEUR TUBBEES':    ['GRANDEUR TUBBEES'],
  'GUCCI':              ['GUCCI'],
  'GUESS':              ['GUESS'],
  'HALLOWEEN':          ['HALLOWEEN'],
  'HUGO BOSS':          ['HUGO BOSS'],
  'ISSEY MIYAKE':       ['ISSEY MIYAKE'],
  'JEAN PAUL GAULTIER': ['JEAN PAUL GAULTIER'],
  'JIMMY CHOO':         ['JIMMY CHOO'],
  'JO MILANO':          ['JO MILANO PARIS'],
  'JOOP':               ['JOOP!'],
  'JOOP!':              ['JOOP!'],
  'KATY PERRY':         ['KATY PERRY'],
  'KENZO':              ['KENZO'],
  'LACOSTE':            ['LACOSTE'],
  'LATAFA':             ['LATTAFA'],
  'LATAFFA':            ['LATTAFA'],
  'LATAIFA':            ['LATTAFA'],
  'LATTAFA':            ['LATTAFA'],
  'LATTAFA - ARMAF':    ['LATTAFA', 'ARMAF'],
  'LATTAFA, ARMAF, VARIADO ARABE': [],
  'LE LABO':            ['LE LABO'],
  'LOMANI':             ['LOMANI'],
  'MACARENA':           ['MACARENA'],
  'MAISON ALHAMBRA':    ['MAISON ALHAMBRA'],
  'MAISON MARGIELA':    ['MAISON MARGIELA'],
  'MANCERA':            ['MANCERA'],
  'MARC JACOBS':        ['MARC JACOBS'],
  'MONT BLANC':         ['MONTBLANC'],
  'MONTALE':            ['MONTALE'],
  'MOSCHINO':           ['MOSCHINO'],
  'MUGLER':             ['MUGLER'],
  'NAUTICA':            ['NAUTICA'],
  'NEW BRAND':          ['NEW BRAND'],
  'NUSUK':              ['NUSUK'],
  'ORIENTICA':          ['ORIENTICA'],
  'PACO RABANNE':       ['PACO RABANNE', 'RABANNE'],
  'PARIS HILTON':       ['PARIS HILTON'],
  'PERRY ELLIS':        ['PERRY ELLIS'],
  'PERRYS ELLIS':       ['PERRY ELLIS'],
  'PHILIPP PLEIN':      ['PHILIPP PLEIN'],
  'PHILLIP PLEIN':      ['PHILIPP PLEIN'],
  'RALPH LAUREN':       ['RALPH LAUREN'],
  'RASASI':             ['RASASI'],
  'RAYHAAN':            ['RAYHAAN'],
  'REVLON':             ['REVLON'],
  'SALVATORE FERRAGAMO':['SALVATORE FERRAGAMO'],
  'SEAN JOHN':          ['SEAN'],
  'SWISS ARABIAN':      ['SWISS ARABIAN'],
  'TAXI':               ['COFINLUXE'],
  'THIERRY MUGLER':     ['MUGLER'],
  'TOM FORD':           ['TOM FORD'],
  'TOMMY HILFILGER':    ['TOMMY HILFIGER'],
  'TOMMY HILFIGER':     ['TOMMY HILFIGER'],
  'UDV':                ['UDV'],
  'VALENTINO':          ['VALENTINO'],
  'VARIADOS':           [],
  'VERSACE':            ['VERSACE'],
  'VICTORINOX':         ['VICTORINOX'],
  'VIKTOR & ROLF':      ['VIKTOR&ROLF'],
  'WATT':               ['WATT'],
  'XERJOFF':            ['XERJOFF'],
  'YVES SAINT LAURENT': ['YVES SAINT LAURENT', 'YSL'],
  'ZIMAYA':             ['ZIMAYA'],
}

const BRAND_KEYS = Object.keys(BRAND_MAP).sort((a, b) => b.length - a.length)

function normalize(str) {
  return str.toLowerCase()
    .replace(/'/g, '')  // strip apostrophes before splitting (l'eau→leau, d'issey→dissey)
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

// ── Parse BS+USD concatenated number (ratio always 650) ──────────────────────
function parseConcatBsUsd(str) {
  // Try last 2 digits as USD
  if (str.length >= 4) {
    const usd = parseInt(str.slice(-2))
    const bs  = parseInt(str.slice(0, -2))
    if (usd > 0 && bs / usd === 650) return usd
  }
  // Try last 3 digits as USD (for prices >= $100)
  if (str.length >= 5) {
    const usd = parseInt(str.slice(-3))
    const bs  = parseInt(str.slice(0, -3))
    if (usd > 0 && bs / usd === 650) return usd
  }
  return null
}

// ── Parse price list ─────────────────────────────────────────────────────────
const mdRaw = fs.readFileSync(MD_FILE, 'utf-8')
const lines = mdRaw.split('\n')
  .map(l => l.replace(/^##\s*/, '').trim())
  .filter(l => l.length > 5)

const entries = []

for (const line of lines) {
  // Extract concatenated BS+USD number (last digit sequence)
  const rawMatch = line.match(/(\d+)$/)
  if (!rawMatch) continue
  const usdPrice = parseConcatBsUsd(rawMatch[1])
  if (!usdPrice) continue

  // Extract ml (first occurrence of number + ML/MIL/OZ pattern)
  const mlMatch = line.match(/(\d+)\s*(?:ML|MIL)\b/i)
  const ml = mlMatch ? parseInt(mlMatch[1]) : null

  // Remove trailing numbers (BS + USD), size info
  let text = line
    .replace(/\d+\s*(?:ML|MIL)[^,]*/gi, '')
    .replace(/\d+\s*(?:FL\.?\s*OZ|OZ)\b[^,]*/gi, '')
    .replace(/\s+(?:EDT|EDP|PARFUM|EXTRAIT|BODY|SPRAY|SET|SP|TESTER)[^a-z]*/gi, ' ')
    .replace(/\d+\s*(PC|PIEZ[AO]S?|PZ)\b.*/gi, '')
    .replace(/\d+$/, '').replace(/\d{5,}/, '').trim()

  // Find brand
  let brand = null
  let dbHouses = []
  for (const key of BRAND_KEYS) {
    const norm = normalize(key)
    if (normalize(text).startsWith(norm)) {
      brand = key
      dbHouses = BRAND_MAP[key]
      text = text.slice(key.length).trim()
      break
    }
  }
  if (!brand || dbHouses.length === 0) continue

  // Clean up description: remove brand/house prefix repetition (longest match first)
  const toStrip = [brand, ...dbHouses]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b.length - a.length)
  for (const h of toStrip) {
    if (normalize(text).startsWith(normalize(h))) {
      text = text.slice(h.length).trim()
      break
    }
  }

  const desc = text.replace(/\s+/g, ' ').trim()
  if (!desc) continue

  const normDesc = normalize(desc)
  if (normDesc.startsWith('tester')) continue  // skip testers (discounted)
  if (normDesc.startsWith('body ')) continue   // skip body sprays (wrong category)
  const isSet = normDesc.startsWith('set ')

  entries.push({ brand, dbHouses, desc, ml, usdPrice, isSet, raw: line })
}

console.log(`📋 ${entries.length} entradas parseadas del PDF`)

// ── Load products ────────────────────────────────────────────────────────────
const { products } = await import('../src/data/products-enriched.js')

// ── Matching ─────────────────────────────────────────────────────────────────
function wordScore(a, b) {
  const wa = new Set(normalize(a).split(/\s+/).filter(w => w.length > 2))
  const wb = new Set(normalize(b).split(/\s+/).filter(w => w.length > 2))
  let matches = 0
  for (const w of wa) if (wb.has(w)) matches++
  return matches / Math.max(wa.size, 1)
}

const changes = []
const noMatch = []
const updated = products.map(p => {
  const productIsSet = normalize(p.name).includes('set')
  // Filter candidates by house (and exclude set entries for non-set products)
  const candidates = entries.filter(e =>
    e.dbHouses.some(h => normalize(h) === normalize(p.house)) &&
    (e.ml === null || e.ml === p.ml || Math.abs((e.ml || 0) - (p.ml || 0)) <= 5) &&
    (!e.isSet || productIsSet)
  )
  if (candidates.length === 0) { noMatch.push(p); return p }

  // Score by name similarity
  const scored = candidates.map(e => ({
    ...e,
    score: wordScore(e.desc, p.name),
  })).sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (best.score < 0.4) { noMatch.push(p); return p }

  if (best.usdPrice !== p.precioUSD) {
    changes.push({ id: p.id, name: p.name, ml: p.ml, old: p.precioUSD, new: best.usdPrice, score: best.score, matched: best.desc })
  }

  return { ...p, precioUSD: best.usdPrice }
})

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\n✅ Cambios de precio: ${changes.length}`)
for (const c of changes) {
  const flag = c.score < 0.5 ? ' ⚠️ ' : '   '
  console.log(`${flag}[${c.id}] ${c.name} (${c.ml}ml): $${c.old} → $${c.new}  (match: "${c.matched}", score: ${c.score.toFixed(2)})`)
}

console.log(`\n⚪ Sin match (${noMatch.length} productos):`)
for (const p of noMatch) {
  console.log(`   [${p.id}] ${p.house} - ${p.name} (${p.ml}ml)`)
}

// ── Write files ───────────────────────────────────────────────────────────────
fs.writeFileSync(ENRICHED, `export const products = ${JSON.stringify(updated, null, 2)}\n`)

// Also update products-index
const { products: idxProds } = await import('../src/data/products-index.js?t=' + Date.now())
const priceMap = Object.fromEntries(updated.map(p => [p.id, p.precioUSD]))
const updatedIdx = idxProds.map(p => priceMap[p.id] !== undefined ? { ...p, precioUSD: priceMap[p.id] } : p)
fs.writeFileSync(INDEX, `export const products = ${JSON.stringify(updatedIdx, null, 2)}\n`)

console.log('\n💾 products-enriched.js y products-index.js actualizados')
