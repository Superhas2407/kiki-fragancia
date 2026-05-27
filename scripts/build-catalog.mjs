// Genera products-enriched.js desde las fotos renombradas + renamer-progress.json
import { readFileSync, writeFileSync, readdirSync, copyFileSync } from 'fs'
import { join } from 'path'

const ICLOUD_DIR  = 'C:/Users/Azael/Pictures/FOTOS PERFUMES/Fotos en iCloud'
const JSON_FILE   = 'C:/Users/Azael/Pictures/FOTOS PERFUMES/renamer-progress.json'
const PRODUCTS_DIR = './public/products'
const OUTPUT_FILE  = './src/data/products-enriched.js'

// Brand slug → display name (ordered longest-first to avoid prefix conflicts)
const BRAND_ENTRIES = [
  ['al-haramain',        'AL HARAMAIN'],
  ['antonio-banderas',   'ANTONIO BANDERAS'],
  ['britney-spears',     'BRITNEY SPEARS'],
  ['calvin-klein',       'CALVIN KLEIN'],
  ['carolina-herrera',   'CAROLINA HERRERA'],
  ['dolcegabbana',       'DOLCE & GABBANA'],
  ['donna-karan',        'DONNA KARAN'],
  ['elizabeth-arden',    'ELIZABETH ARDEN'],
  ['giorgio-armani',     'GIORGIO ARMANI'],
  ['hugo-boss',          'HUGO BOSS'],
  ['issey-miyake',       'ISSEY MIYAKE'],
  ['jacques-saint-pres', 'JACQUES SAINT PRÉ'],
  ['jimmy-choo',         'JIMMY CHOO'],
  ['jo-milano-paris',    'JO MILANO PARIS'],
  ['katy-perry',         'KATY PERRY'],
  ['maison-alhambra',    'MAISON ALHAMBRA'],
  ['paris-hilton',       'PARIS HILTON'],
  ['perry-ellis',        'PERRY ELLIS'],
  ['ralph-lauren',       'RALPH LAUREN'],
  ['salvatore-ferragamo','SALVATORE FERRAGAMO'],
  ['yves-saint-laurent', 'YSL'],
  ['afnan',     'AFNAN'],
  ['armaf',     'ARMAF'],
  ['benetton',  'BENETTON'],
  ['bharara',   'BHARARA'],
  ['bvlgari',   'BVLGARI'],
  ['cacharel',  'CACHAREL'],
  ['clinique',  'CLINIQUE'],
  ['davidoff',  'DAVIDOFF'],
  ['diesel',    'DIESEL'],
  ['dior',      'DIOR'],
  ['dumont',    'DUMONT'],
  ['emper',     'EMPER'],
  ['gucci',     'GUCCI'],
  ['guess',     'GUESS'],
  ['halloween', 'HALLOWEEN'],
  ['kenzo',     'KENZO'],
  ['lacoste',   'LACOSTE'],
  ['lattafa',   'LATTAFA'],
  ['lomani',    'LOMANI'],
  ['montblanc', 'MONTBLANC'],
  ['moschino',  'MOSCHINO'],
  ['orientica', 'ORIENTICA'],
  ['prada',     'PRADA'],
  ['rasasi',    'RASASI'],
  ['rayhaan',   'RAYHAAN'],
  ['rave',      'RAVE'],
  ['revlon',    'REVLON'],
  ['valentino', 'VALENTINO'],
  ['versace',   'VERSACE'],
  ['zimaya',    'ZIMAYA'],
].sort((a, b) => b[0].length - a[0].length)

function getBrand(slug) {
  for (const [key, name] of BRAND_ENTRIES) {
    if (slug === key || slug.startsWith(key + '-')) return { slug: key, name }
  }
  const first = slug.split('-')[0]
  return { slug: first, name: first.toUpperCase() }
}

function titleCase(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Normalize name: strip tipo words that belong in the tipo field
const TIPO_WORDS = ['-eau-de-toilette', '-eau-de-parfum']
const GENDER_SUFFIXES = ['-for-women', '-for-men', '-for-woman', '-for-man', '-pour-femme', '-pour-homme']
// NOTE: we keep -pour-femme/-pour-homme in the NAME (they're part of the product identity)
//       we only strip them if they create a near-duplicate with an existing product

function parseFilename(filename) {
  const noExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const m = noExt.match(/^(.+?)-(\d+(?:\.\d+)?)ml-([mfuk])$/)
  if (!m) return null

  const fullSlug = m[1]
  const ml = parseInt(m[2])
  const genderCode = m[3]

  const brand = getBrand(fullSlug)
  let nameSlug = fullSlug.slice(brand.slug.length + 1)

  // Remove tipo words from name slug
  for (const w of TIPO_WORDS) nameSlug = nameSlug.replace(w, '')

  // Determine tipo
  let tipo = 'Eau de Parfum'
  if (noExt.includes('eau-de-toilette'))   tipo = 'Eau de Toilette'
  else if (noExt.includes('extrait'))      tipo = 'Extrait de Parfum'
  else if (brand.slug === 'jo-milano-paris') tipo = 'Parfum'

  const name = titleCase(nameSlug)
  const genderMap = { m: 'Masculino', f: 'Femenino', u: 'Unisex', k: 'Niño' }

  return { brandName: brand.name, name, ml, genero: genderMap[genderCode] || 'Unisex', tipo }
}

function deriveFamilia(notes, desc) {
  const t = (notes + ' ' + desc).toLowerCase()

  if (/\b(cacao|galleta|cookie|praliné|praline|dulce de leche|toffee|bizcocho|chocolate)\b/.test(t)) return 'Gourmand'
  if (/\b(oud|madera de oud)\b/.test(t) && /\b(incienso|ámbar|ambar|benjuí|mirra)\b/.test(t)) return 'Oriental'
  if (/\b(incienso|mirra|benjuí|benjui|ládano|ladano)\b/.test(t) && !/\b(rosa|jazmín|jazmin)\b/.test(t)) return 'Oriental'

  const hasFloral = /\b(rosa|jazmín|jazmin|tuberosa|nardo|gardenia|peonía|peonia|fresia|lirio)\b/.test(t)
  const hasFrutal = /\b(fresa|frambuesa|cereza|durazno|melocotón|melocoton|mango|lichi|piña|manzana|pera)\b/.test(t)
  const hasWood   = /\b(sándalo|sandalo|cedro|vetiver|pachulí|pachuli|madera)\b/.test(t)
  const hasCitrus = /\b(bergamota|limón|limon|naranja|mandarina|pomelo|toronja)\b/.test(t)

  if (hasFloral && hasFrutal)  return 'Floral Frutal'
  if (hasFloral && hasWood)    return 'Floral Amaderado'
  if (hasFloral && hasCitrus)  return 'Floral Frutal'
  if (hasFloral)               return 'Floral'
  if (hasFrutal && hasWood)    return 'Frutal'
  if (hasWood)                 return 'Amaderado'
  if (hasCitrus)               return 'Cítrico'
  if (/\b(lavanda|romero|menta|salvia)\b/.test(t)) return 'Aromático'

  return 'Amaderado'
}

// Strip Wikipedia-style citations like [1][2] from descriptions
function cleanDesc(str) {
  return str.replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim()
}

// ---- Main ----

const json  = JSON.parse(readFileSync(JSON_FILE, 'utf8'))
const files = readdirSync(ICLOUD_DIR).filter(f => !/^IMG_/i.test(f)).sort()

let id = 1
const products = []
const warnings = []

for (const filename of files) {
  const parsed = parseFilename(filename)
  if (!parsed) { warnings.push(`SKIP (unparseable): ${filename}`); continue }

  const jsonData = json[filename]
  if (!jsonData)              { warnings.push(`SKIP (no JSON key): ${filename}`); continue }
  if (!jsonData.notes && !jsonData.description) { warnings.push(`SKIP (no data): ${filename}`); continue }

  const notes = (jsonData.notes       || '').trim()
  const desc  = cleanDesc(jsonData.description || '')

  const genderMap = { m: 'Masculino', f: 'Femenino', u: 'Unisex', k: 'Niño' }
  const genero = jsonData.gender ? (genderMap[jsonData.gender] || parsed.genero) : parsed.genero
  const ml     = jsonData.ml ? parseInt(jsonData.ml) : parsed.ml

  // Split notes into thirds for pyramid display
  const notesList = notes.split(',').map(n => n.trim()).filter(Boolean)
  const t1 = Math.ceil(notesList.length / 3)
  const t2 = Math.ceil(notesList.length * 2 / 3)
  const notasSalida   = notesList.slice(0, t1).join(', ')
  const notasCorazon  = notesList.slice(t1, t2).join(', ')
  const notasFondo    = notesList.slice(t2).join(', ')

  const familia = deriveFamilia(notes, desc)

  // Copy file
  try {
    copyFileSync(join(ICLOUD_DIR, filename), join(PRODUCTS_DIR, filename))
  } catch (e) {
    warnings.push(`COPY ERROR ${filename}: ${e.message}`)
  }

  products.push({
    id: id++,
    house: parsed.brandName,
    name: parsed.name,
    image: filename,
    familia,
    tipo: parsed.tipo,
    genero,
    descripcion: desc,
    notasSalida,
    notasCorazon,
    notasFondo,
    ml,
  })
}

writeFileSync(OUTPUT_FILE, `export const products = ${JSON.stringify(products, null, 2)}\n`)

console.log(`\n✓ ${products.length} productos generados → ${OUTPUT_FILE}`)
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} advertencias:`)
  warnings.forEach(w => console.log('  -', w))
}
