/**
 * Actualiza precios según lista de junio 2026.
 * Fuente: compare-pdf.mjs (50 diferencias confirmadas).
 * Ratio BS: 650 (consistente con sync-prices.mjs).
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RATIO = 650

// ID → nuevo precioUSD
const UPDATES = {
  391: 25,   // AB Blue Seduction Men 100ml ↓10
  378: 40,   // AB The Secret 200ml ↑5
  260: 55,   // Ariana Grande Cloud ↓20
  262: 75,   // Ariana Grande Thank U Next ↑10
  427: 40,   // Armaf Club de Nuit Intense Woman ↑5
  28:  35,   // Armaf Connoisseur Women ↓10
  46:  35,   // Armaf Odyssey Mandarin Sky ↓10
  36:  60,   // Armaf Odyssey Bahamas ↑25
  47:  55,   // Armaf Odyssey Mandarin Sky Elixir ↑10
  42:  45,   // Armaf Odyssey Go Mango ↑10
  40:  60,   // Armaf Odyssey Montagne ↑25
  44:  45,   // Armaf Odyssey Homme White Edition ↑5
  52:  35,   // Armaf Tag Her ↓10
  56:  45,   // Armaf Tres Nuit ↑15
  268: 180,  // Armani My Way Ylang ↑20
  291: 110,  // Azzaro Most Wanted Intense ↑20
  438: 30,   // Benetton Paradiso Inferno Pink ↑10
  60:  90,   // Bharara Champagne Pink ↑45
  61:  75,   // Bharara King EDP ↓25
  74:  45,   // CK IN2U for Her ↑15
  75:  40,   // CK One Shock for Her ↑5
  328: 110,  // CH 212 Sexy Men ↑20
  279: 180,  // CH 212 VIP Black Elixir ↑5
  80:  80,   // CH Eau de Parfum ↓20
  85:  200,  // Dior Homme ↓20
  299: 110,  // D&G The One Pour Homme EDP ↑25
  90:  130,  // D&G Devotion Pour Homme ↑20
  406: 45,   // Hugo Boss Boss Selection ↑5
  266: 150,  // JPG Scandal Pour Homme ↑50
  297: 180,  // JPG Scandal Intense ↑80
  120: 120,  // Jo Milano Game of Spades Full House ↑10
  157: 50,   // Lattafa Eclair Banoffi ↑15
  158: 60,   // Lattafa Eclair Pistache ↑25
  161: 30,   // Lattafa Fakhar Black ↓5
  171: 45,   // Lattafa Ishq Al Shuyukh Silver ↑5
  172: 35,   // Lattafa Khamrah ↓5
  424: 50,   // Lattafa Musamam White Intense ↓10
  185: 25,   // Lattafa Qaed Al Fursan Unlimited ↓10
  186: 40,   // Lattafa Qaed Al Fursan Untamed ↑5
  188: 40,   // Lattafa Sakeena ↓5
  196: 65,   // Lattafa The Kingdom for Women ↑25
  201: 45,   // Lattafa Yara Elixir ↑15
  398: 80,   // Montblanc Legend EDP ↑10
  215: 90,   // Orientica Royal Bleu ↓10
  270: 180,  // Rabanne Fame Parfum ↓20
  225: 85,   // Ralph Lauren Big Pony 2 ↑45
  294: 60,   // Ralph Lauren Polo Red EDP ↓20
  229: 35,   // Rasasi Hawas for Her ↓10
  240: 70,   // SF Signorina EDT ↑25
  285: 110,  // Versace Eros Flame ↑10
}

function patchFile(filePath) {
  let src = readFileSync(filePath, 'utf8')
  let count = 0

  for (const [idStr, newPrice] of Object.entries(UPDATES)) {
    const id = Number(idStr)
    const newBS = newPrice * RATIO

    // Match the id block and update precioUSD (and precioBS if present)
    const idRe = new RegExp(
      `("id":\\s*${id},(?:[^}](?!"id":))*?"precioUSD":\\s*)\\d+(\\.?\\d*)`,
      's'
    )
    if (idRe.test(src)) {
      src = src.replace(idRe, (_, pre) => `${pre}${newPrice}`)
      count++
    }

    const bsRe = new RegExp(
      `("id":\\s*${id},(?:[^}](?!"id":))*?"precioBS":\\s*)\\d+(\\.?\\d*)`,
      's'
    )
    if (bsRe.test(src)) {
      src = src.replace(bsRe, (_, pre) => `${pre}${newBS}`)
    }
  }

  writeFileSync(filePath, src, 'utf8')
  return count
}

const enriched = join(__dirname, '../src/data/products-enriched.js')
const index    = join(__dirname, '../src/data/products-index.js')

const c1 = patchFile(enriched)
const c2 = patchFile(index)
console.log(`products-enriched.js: ${c1} precios actualizados`)
console.log(`products-index.js:    ${c2} precios actualizados`)
