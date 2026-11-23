import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { excludeVariantDuplicates } from '../src/lib/variants.js'
import { sanitizePromotions,promotionForProduct } from '../src/data/store-promotions.js'

const p100={id:410,name:'The Secret',ml:100,variantIds:[411],agotado:false}
const p200={id:411,name:'The Secret',ml:200,agotado:false}
const products=[p100,p200]
const active=sanitizePromotions([{
 id:'grande',name:'GRANDE Antonio Banderas 200 ml',active:true,
 count:3,priceUSD:90,productIds:[411]
}],'2026-11-23T17:00:00Z')
assert.equal(excludeVariantDuplicates(products).length,1)
assert.equal(excludeVariantDuplicates(products).some(p=>p.id===411),false)
assert.equal(products.filter(p=>promotionForProduct(p,active)).length,1,
 'The 200 ml item must remain eligible even when normally collapsed')
const store=readFileSync('src/pages/Tienda.jsx','utf8')
assert.match(store,/soloPromociones \? products : excludeVariantDuplicates\(products\)/,
 'Promotion filter must not hide alternate 200 ml variants')
assert.match(store,/\[products, urlGenero, urlTipo, coleccionData, soloPromociones\]/)
assert.match(store,/setSoloPromociones\(searchParams\.get\('promos'\) === '1'\)/,
 'Homepage promotion link should activate store filter on route updates')
assert.equal(promotionForProduct({...p200,agotado:true},active),null)
console.log('GRANDE 200 ml variants are visible in promotion listing; normal listings remain deduplicated')
