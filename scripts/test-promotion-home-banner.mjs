import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const section = readFileSync('src/components/BlackFridaySection.jsx','utf8')
const source = readFileSync('src/hooks/usePromotionBanner.js','utf8')
const schema = readFileSync('studio/schemas/promotionBanner.js','utf8')
assert.match(section, /<picture className=/)
assert.match(section, /max-width: 767px/)
assert.match(section, /banner\.desktopUrl/)
assert.match(section, /banner\.mobileUrl/)
assert.match(section, /to="\/tienda\?promos=1"/)
assert.match(section, /if \(!promotions\.length\) return null/)
assert.doesNotMatch(section, /KIKIFRAGANCIA.*logo|logo.*KIKIFRAGANCIA/)
assert.match(source, /home-promotion-banner/)
assert.match(source, /portada-desktop\.jpg/)
assert.match(source, /portada-mobile\.jpg/)
assert.match(source, /DEFAULT_PROMOTION_BANNER/)
assert.match(source, /enabled === true/)
assert.match(source, /desktopUrl/)
assert.match(source, /mobileUrl/)
assert.match(schema, /name: 'desktopImage'/)
assert.match(schema, /name: 'mobileImage'/)
assert.match(schema, /Mostrar portada/)
console.log('Desktop/mobile banner uses Sanity, keeps full artwork, and hides without active promotions.')

for (const path of ['public/promociones/portada-desktop.jpg', 'public/promociones/portada-mobile.jpg']) {
  const {readFileSync,statSync}=await import('node:fs')
  const image=readFileSync(path)
  assert.ok(statSync(path).size > 100000, 'Original image is too small: '+path)
  assert.equal(image[0],255, 'Missing JPEG start marker')
  assert.equal(image[1],216, 'Missing JPEG start marker')
}
