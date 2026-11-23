import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { activeNovemberCampaigns } from '../src/data/november-campaigns.js'
assert.deepEqual(activeNovemberCampaigns(new Date('2026-11-23T15:00:00Z')), [])
const home = readFileSync('src/components/BlackFridaySection.jsx','utf8')
assert.match(home, /usePromotions/)
assert.doesNotMatch(home, /activeNovemberCampaigns|Antonio Banderas.*\$90/)
const provider = readFileSync('src/context/SanityProductsContext.jsx','utf8')
assert.doesNotMatch(provider, /p\.precioUSD\s*=\s*sp\.precioPromoHalloween/)
assert.doesNotMatch(readFileSync('src/components/Header.jsx','utf8'), /toggleHalloween|hweenFlash/)
assert.doesNotMatch(readFileSync('src/App.jsx','utf8'), /HalloweenDecor/)
assert.doesNotMatch(readFileSync('index.html','utf8'), /t === 'halloween'/)
console.log('November campaigns are managed exclusively from Sanity; retired Halloween stays disabled')
