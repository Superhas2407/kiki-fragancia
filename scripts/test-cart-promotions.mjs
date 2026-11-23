import assert from 'node:assert/strict'
import { sanitizePromotions, promotionForProduct } from '../src/data/store-promotions.js'
import { calculateCartPromotions } from '../src/lib/cart-promotions.js'

const NOW='2026-11-23T15:00:00Z'
const confirmed=[
 {id:'benetton-3x60',name:'Benetton Colors / United Dreams',active:true,count:3,priceUSD:60,productIds:[382,392],startsAt:'2026-11-01T00:00:00Z'},
 {id:'guess-2x70',name:'Guess Woman y Guess Gold',active:true,count:2,priceUSD:70,productIds:[110,617]},
 {id:'stallion-53',name:'Stallion 53 + decant',active:true,count:1,priceUSD:30,productIds:[102]},
]
const available=sanitizePromotions(confirmed,NOW)
assert.equal(available.length,3)
assert.equal(available[0].label,'3 × $60')
assert.equal(sanitizePromotions([{id:'nautica',name:'Nautica',active:false,count:3,priceUSD:60,productIds:[383]}],NOW).length,0)
assert.equal(sanitizePromotions([{id:'old',name:'Expired',active:true,count:3,priceUSD:60,productIds:[383],endsAt:'2026-11-22T00:00:00Z'}],NOW).length,0)
assert.equal(sanitizePromotions([{id:'future',name:'Future',active:true,count:2,priceUSD:70,productIds:[110],startsAt:'2026-12-01T00:00:00Z'}],NOW).length,0)
assert.equal(sanitizePromotions([{id:'incomplete',name:'Incomplete',active:true,count:3,priceUSD:60,productIds:[]}],NOW).length,0)
assert.equal(sanitizePromotions([{id:'invalid',name:'Invalid',active:true,count:3,priceUSD:-5,productIds:[123]}],NOW).length,0)
assert.equal(sanitizePromotions([{id:'foo',name:'one',active:true,count:1,priceUSD:30,productIds:[102]},{id:'foo',name:'two',active:true,count:2,priceUSD:60,productIds:[102]}],NOW).length,1)
assert.equal(sanitizePromotions(null,NOW).length,0)
// A $40 image is just an ordinary price; it is not in any active promotion.
const ninePm={id:3,house:'AFNAN',name:'9PM',ml:100,precioUSD:40,quantity:1}
assert.equal(promotionForProduct(ninePm,available),null)
const item=(id,price,quantity=1,agotado=false)=>({id,precioUSD:price,quantity,agotado})
assert.equal(promotionForProduct(item(382,25),available)?.id,'benetton-3x60')
assert.equal(promotionForProduct(item(382,25,1,true),available),null)
assert.equal(promotionForProduct(item(383,25),available),null)
assert.equal(promotionForProduct(item(382,25),[]),null)
const three=[item(382,25),item(392,25),item(382,25)]
assert.equal(calculateCartPromotions(three,'usd',available).total,60)
assert.equal(calculateCartPromotions(three,'bs',available).total,75)
assert.equal(calculateCartPromotions(three,'usd',[]).total,75)
assert.equal(calculateCartPromotions([item(382,25,4)],'usd',available).total,85)
assert.equal(calculateCartPromotions([item(382,25,3)],'usd',available).total,60)
assert.equal(calculateCartPromotions([item(382,25,3,true)],'usd',available).total,75)
assert.equal(calculateCartPromotions([item(110,35),item(617,35)],'usd',available).total,70)
assert.equal(calculateCartPromotions([item(102,35)],'usd',available).total,30)
assert.equal(calculateCartPromotions([ninePm],'usd',available).total,40)
assert.equal(calculateCartPromotions([item(382,25),item(392,25),item(382,25),item(999,20)],'usd',available).total,80)
console.log('Sanity promotions: inactive/expired/offline, eligible products, divisas, cart and no false 9PM discount pass')
