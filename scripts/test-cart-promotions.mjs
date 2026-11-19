import assert from 'node:assert/strict'
import { calculateCartPromotions } from '../src/lib/cart-promotions.js'
import { promotionForProduct } from '../src/data/store-promotions.js'

const nautica = (id, name, quantity, precioUSD = 30) => ({
  id, house: 'NAUTICA', name, quantity, precioUSD, ml: 100
})
const a = nautica(1, 'Nautica Voyage', 1)
const b = nautica(2, 'Nautica Classic', 1)
const c = nautica(3, 'Nautica Blue', 1)
assert.equal(promotionForProduct(a)?.id, 'nautica')
assert.equal(calculateCartPromotions([a,b,c]).total, 60)
assert.equal(calculateCartPromotions([nautica(1,'Nautica Voyage',3)]).total, 60)
assert.equal(calculateCartPromotions([nautica(1,'Nautica Voyage',6)]).total, 120)
assert.equal(calculateCartPromotions([nautica(1,'Nautica Voyage',4)]).total, 90)
assert.equal(calculateCartPromotions([a,b,c], 'bs').total, 90)
assert.equal(calculateCartPromotions([a,b]).total, 60)
assert.equal(calculateCartPromotions([{...a, agotado: true},b,c]).total, 90)
assert.equal(promotionForProduct({ house:'BENETTON', name:'Benetton Tribe', ml:100 }), null)
assert.equal(promotionForProduct({ house:'ANTONIO BANDERAS', name:'Black Seduction', ml:100 }), null)
assert.equal(calculateCartPromotions([a,b,c,{id:8,house:'OTHER',name:'Other',ml:50,precioUSD:20,quantity:1}]).total, 80)
console.log('Cart combo promotion scenarios passed')
