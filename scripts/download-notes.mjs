/**
 * Descarga imágenes de ingredientes desde Wikipedia API
 * Uso: node scripts/download-notes.mjs
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = path.join(__dirname, '../public/notes')
const MAP_FILE  = path.join(__dirname, '../src/data/notes-images.js')

fs.mkdirSync(OUT_DIR, { recursive: true })

const NOTES_MAP = {
  // Cítricos
  'bergamota':          'Bergamot_orange',
  'limón':              'Lemon',
  'limon':              'Lemon',
  'naranja':            'Orange_(fruit)',
  'mandarina':          'Mandarin_orange',
  'pomelo':             'Grapefruit',
  'yuzu':               'Yuzu',
  'lima':               'Key_lime',
  'petit grain':        'Petitgrain',
  'petitgrain':         'Petitgrain',
  'neroli':             'Neroli',
  'azahar':             'Orange_blossom',

  // Especias
  'pimienta negra':     'Black_pepper',
  'pimienta rosa':      'Pink_peppercorn',
  'cardamomo':          'Cardamom',
  'canela':             'Cinnamon',
  'clavo':              'Clove',
  'clavo de olor':      'Clove',
  'jengibre':           'Ginger',
  'nuez moscada':       'Nutmeg',
  'azafrán':            'Saffron',
  'azafran':            'Saffron',
  'anís':               'Anise',
  'anis':               'Anise',
  'anís estrellado':    'Star_anise',
  'incienso':           'Frankincense',

  // Flores
  'rosa':               'Rose',
  'rosa búlgara':       'Rosa_damascena',
  'rosa damascena':     'Rosa_damascena',
  'rosa de taif':       'Rose',
  'rosa turca':         'Rose',
  'jazmín':             'Jasmine',
  'jazmin':             'Jasmine',
  'jazmín sambac':      'Jasmine',
  'geranio':            'Geranium',
  'lavanda':            'Lavender',
  'lirio de los valles':'Lily_of_the_valley',
  'peonía':             'Peony',
  'peonia':             'Peony',
  'iris':               'Iris_(plant)',
  'tuberosa':           'Tuberose',
  'fresia':             'Freesia',
  'violeta':            'Viola_(plant)',
  'amarilis':           'Amaryllis',
  'camelia':            'Camellia',
  'magnolia':           'Magnolia',
  'mimosa':             'Mimosa',
  'azucena':            'Lilium',
  'nardo':              'Tuberose',

  // Maderas & bases
  'sándalo':            'Sandalwood',
  'sandalo':            'Sandalwood',
  'cedro':              'Cedar',
  'vetiver':            'Vetiver',
  'pachulí':            'Patchouli',
  'pachuli':            'Patchouli',
  'patchouli':          'Patchouli',
  'musgo de roble':     'Oakmoss',
  'abedul':             'Birch',
  'bambú':              'Bamboo',
  'bambu':              'Bamboo',
  'oud':                'Agarwood',

  // Ambarinos
  'ámbar':              'Ambergris',
  'ambar':              'Ambergris',
  'ámbar gris':         'Ambergris',
  'ambergris':          'Ambergris',
  'almizcle':           'Musk',
  'benjuí':             'Benzoin_resin',
  'benjui':             'Benzoin_resin',
  'labdano':            'Labdanum',

  // Dulces
  'vainilla':           'Vanilla',
  'cacao':              'Cacao',
  'caramelo':           'Caramel',
  'almendra':           'Almond',
  'café':               'Coffee',
  'cafe':               'Coffee',
  'tonka':              'Tonka_bean',
  'miel':               'Honey',
  'praliné':            'Praline',
  'castaña':            'Chestnut',

  // Frutas
  'manzana':            'Apple',
  'manzana verde':      'Apple',
  'pera':               'Pear',
  'melocotón':          'Peach',
  'durazno':            'Peach',
  'piña':               'Pineapple',
  'higo':               'Common_fig',
  'cassis':             'Blackcurrant',
  'casis':              'Blackcurrant',
  'grosella negra':     'Blackcurrant',
  'arándano':           'Blueberry',
  'frambuesa':          'Raspberry',
  'ciruela':            'Plum',
  'cereza':             'Cherry',
  'albaricoque':        'Apricot',
  'caqui':              'Persimmon',
  'coco':               'Coconut',

  // Verdes & frescos
  'menta':              'Mint',
  'menta fresca':       'Spearmint',
  'romero':             'Rosemary',
  'salvia':             'Salvia_officinalis',
  'tomillo':            'Thyme',
  'albahaca':           'Basil',
  'bayas de enebro':    'Juniper_berry',
  'enebro':             'Juniper',
  'aloe vera':          'Aloe_vera',
  'té verde':           'Green_tea',
  'te verde':           'Green_tea',
  'té blanco':          'White_tea',
}

// Fallbacks para páginas sin thumbnail
const FALLBACKS = {
  'Bergamot_orange': 'Citrus_bergamia', 'Lemon': 'Citrus_limon',
  'Orange_(fruit)': 'Citrus_sinensis', 'Grapefruit': 'Citrus_paradisi',
  'Key_lime': 'Persian_lime', 'Petitgrain': 'Citrus_aurantium',
  'Black_pepper': 'Piper_nigrum', 'Pink_peppercorn': 'Schinus_molle',
  'Cardamom': 'Elettaria_cardamomum', 'Clove': 'Syzygium_aromaticum',
  'Ginger': 'Zingiber_officinale', 'Saffron': 'Crocus_sativus',
  'Anise': 'Pimpinella_anisum', 'Star_anise': 'Illicium_verum',
  'Frankincense': 'Boswellia', 'Rose': 'Rosa_(plant)',
  'Rosa_damascena': 'Rose', 'Jasmine': 'Jasminum',
  'Geranium': 'Pelargonium', 'Lavender': 'Lavandula',
  'Lily_of_the_valley': 'Convallaria_majalis', 'Peony': 'Paeonia_(plant)',
  'Iris_(plant)': 'Iris_germanica', 'Tuberose': 'Agave_amica',
  'Freesia': 'Freesia_(plant)', 'Viola_(plant)': 'Viola_odorata',
  'Sandalwood': 'Santalum_album', 'Cedar': 'Cedrus',
  'Vetiver': 'Chrysopogon_zizanioides', 'Patchouli': 'Pogostemon_cablin',
  'Oakmoss': 'Evernia_prunastri', 'Agarwood': 'Aquilaria_malaccensis',
  'Musk': 'Musk_deer', 'Benzoin_resin': 'Styrax_benzoin',
  'Labdanum': 'Cistus_ladanifer', 'Vanilla': 'Vanilla_planifolia',
  'Cacao': 'Theobroma_cacao', 'Caramel': 'Caramel_color',
  'Almond': 'Prunus_dulcis', 'Coffee': 'Coffea',
  'Tonka_bean': 'Dipteryx_odorata', 'Honey': 'Honeybee',
  'Praline': 'Confectionery', 'Chestnut': 'Castanea',
  'Apple': 'Malus_domestica', 'Pear': 'Pyrus_communis',
  'Peach': 'Prunus_persica', 'Pineapple': 'Ananas_comosus',
  'Common_fig': 'Ficus_carica', 'Blackcurrant': 'Ribes_nigrum',
  'Blueberry': 'Vaccinium_corymbosum', 'Raspberry': 'Rubus_idaeus',
  'Plum': 'Prunus_domestica', 'Cherry': 'Prunus_avium',
  'Apricot': 'Prunus_armeniaca', 'Persimmon': 'Diospyros_kaki',
  'Coconut': 'Cocos_nucifera', 'Mint': 'Mentha',
  'Spearmint': 'Mentha_spicata', 'Rosemary': 'Salvia_rosmarinus',
  'Salvia_officinalis': 'Salvia', 'Thyme': 'Thymus_vulgaris',
  'Basil': 'Ocimum_basilicum', 'Juniper_berry': 'Juniperus_communis',
  'Juniper': 'Juniperus', 'Aloe_vera': 'Aloe',
  'Green_tea': 'Camellia_sinensis', 'White_tea': 'Camellia_sinensis',
  'Bamboo': 'Bambusoideae', 'Birch': 'Betula', 'Ambergris': 'Ambergris',
  'Neroli': 'Orange_blossom', 'Amaryllis': 'Hippeastrum',
  'Camellia': 'Camellia_(plant)', 'Mimosa': 'Acacia_dealbata',
  'Lilium': 'Lily', 'Magnolia': 'Magnolia_(plant)',
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'KikiFragancia/1.0 (fragrance note images; https://github.com/Superhas2407/kiki-fragancia)' }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return resolve(httpsGet(res.headers.location))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function getWikiImage(pageTitle) {
  const titles = [pageTitle, FALLBACKS[pageTitle]].filter(Boolean)
  for (const title of titles) {
    try {
      const { status, body } = await httpsGet(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      )
      if (status !== 200) continue
      const data = JSON.parse(body.toString())
      const src = data.thumbnail?.source
      if (src && !src.endsWith('.svg')) return src
    } catch { continue }
  }
  return null
}

function isRealImage(filePath) {
  if (!fs.existsSync(filePath)) return false
  const size = fs.statSync(filePath).size
  if (size < 8000) return false
  const buf = Buffer.alloc(4)
  const fd = fs.openSync(filePath, 'r')
  fs.readSync(fd, buf, 0, 4, 0)
  fs.closeSync(fd)
  return (buf[0] === 0xFF && buf[1] === 0xD8) || // JPEG
         (buf[0] === 0x89 && buf[1] === 0x50) || // PNG
         (buf.toString('ascii', 0, 4) === 'RIFF')  // WebP
}

async function downloadImage(imageUrl, destPath) {
  return new Promise(resolve => {
    const url = new URL(imageUrl)
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://en.wikipedia.org/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }
    const req = https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        req.destroy()
        return resolve(downloadImage(res.headers.location, destPath))
      }
      if (res.statusCode !== 200) { res.resume(); return resolve(false) }
      const out = fs.createWriteStream(destPath)
      res.pipe(out)
      out.on('finish', () => { out.close(); resolve(isRealImage(destPath)) })
      out.on('error', () => resolve(false))
    })
    req.on('error', () => resolve(false))
    req.setTimeout(25000, () => { req.destroy(); resolve(false) })
  })
}

async function main() {
  // Paso 1: recolectar todas las URLs (sin descargar aún)
  console.log('\n🔍 Paso 1: Recolectando URLs de Wikipedia...\n')
  const uniquePages = {}
  for (const [keyword, page] of Object.entries(NOTES_MAP)) {
    if (!uniquePages[page]) uniquePages[page] = []
    uniquePages[page].push(keyword)
  }

  const queue = [] // { filename, imgUrl, keywords }
  for (const [page, keywords] of Object.entries(uniquePages)) {
    const filename = page.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg'
    const destPath = path.join(OUT_DIR, filename)
    if (isRealImage(destPath)) {
      console.log(`  ⏭ ya existe: ${filename}`)
      queue.push({ filename, imgUrl: null, keywords, exists: true })
      continue
    }
    await sleep(400) // delay corto para la API
    const imgUrl = await getWikiImage(page)
    if (imgUrl) {
      process.stdout.write(`  📋 ${keywords[0].padEnd(22)} → ${filename}\n`)
      queue.push({ filename, imgUrl, keywords, exists: false })
    } else {
      console.log(`  ❌ sin imagen: ${keywords[0]}`)
      queue.push({ filename, imgUrl: null, keywords, exists: false })
    }
  }

  // Paso 2: descargar con pausa de 2s entre cada una
  console.log(`\n📦 Paso 2: Descargando ${queue.filter(q => q.imgUrl).length} imágenes (2s entre cada una)...\n`)
  const mapping = {}
  let downloaded = 0

  for (const item of queue) {
    const destPath = path.join(OUT_DIR, item.filename)

    if (item.exists) {
      for (const kw of item.keywords) mapping[kw] = `/notes/${item.filename}`
      continue
    }
    if (!item.imgUrl) continue

    await sleep(2000)
    const ok = await downloadImage(item.imgUrl, destPath)

    if (ok) {
      console.log(`  ✅ ${item.keywords[0].padEnd(22)} → ${item.filename}`)
      for (const kw of item.keywords) mapping[kw] = `/notes/${item.filename}`
      downloaded++
    } else {
      console.log(`  ❌ ${item.keywords[0]}`)
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
    }
  }

  // Paso 3: generar mapeo JS
  const lines = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  '${k}': '${v}',`)
    .join('\n')

  fs.writeFileSync(MAP_FILE, `// Auto-generado por scripts/download-notes.mjs — no editar manualmente
export const NOTES_IMAGES = {\n${lines}\n}\n`)

  console.log(`\n✅ Total: ${downloaded} nuevas + ${queue.filter(q => q.exists).length} ya existían`)
  console.log(`📄 Mapeo: src/data/notes-images.js\n`)
}

main().catch(console.error)
