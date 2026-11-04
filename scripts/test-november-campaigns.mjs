import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { activeNovemberCampaigns } from '../src/data/november-campaigns.js'
const before = activeNovemberCampaigns(new Date('2026-11-04T13:59:59Z'))
const after = activeNovemberCampaigns(new Date('2026-11-04T14:00:00Z'))
assert.deepEqual(before.map(c => c.keyword), ['BANDERAS'])
assert.deepEqual(after.map(c => [c.keyword, c.price]), [['BANDERAS', 60], ['GRANDE', 90]])
assert.match(after[1].size, /200 ml cada uno/)
const provider = readFileSync('src/context/SanityProductsContext.jsx','utf8')
assert.doesNotMatch(provider, /p\.precioUSD\s*=\s*sp\.precioPromoHalloween/)
assert.doesNotMatch(readFileSync('src/components/Header.jsx','utf8'), /toggleHalloween|hweenFlash/)
assert.doesNotMatch(readFileSync('src/App.jsx','utf8'), /HalloweenDecor/)
assert.doesNotMatch(readFileSync('index.html','utf8'), /t === 'halloween'/)
console.log('November campaign timing, exact sizes/prices, and Halloween retirement pass')
