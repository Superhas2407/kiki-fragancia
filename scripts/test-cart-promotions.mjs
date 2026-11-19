import assert from 'node:assert/strict'
import { calculateCartPromotions } from '../src/lib/cart-promotions.js'
import { promotionForProduct } from '../src/data/store-promotions.js'

const nautica = (id, name, quantity, precioUSD = 25) => ({
  id, house: 'NAUTICA', name, quantity, precioUSD, ml: 100
})
const voyage = nautica(383, 'Nautica Voyage', 1)
const blue = nautica(413, 'Nautica Blue', 1)
const pure = nautica(588, 'Pure Blue', 1)
assert.equal(promotionForProduct(voyage)?.id, 'nautica')
assert.equal(calculateCartPromotions([voyage, blue, pure]).total, 60)
assert.equal(calculateCartPromotions([nautica(383, 'Nautica Voyage', 3)]).total, 60)
assert.equal(calculateCartPromotions([nautica(383, 'Nautica Voyage', 6)]).total, 120)
assert.equal(calculateCartPromotions([nautica(383, 'Nautica Voyage', 4)]).total, 85)
assert.equal(calculateCartPromotions([voyage, blue, pure], 'bs').total, 75)
assert.equal(calculateCartPromotions([voyage, blue]).total, 50)
assert.equal(calculateCartPromotions([{ ...voyage, agotado: true }, blue, pure]).total, 75)
assert.equal(promotionForProduct({ id: 488, house: 'BENETTON', name: 'We Are Tribe', ml: 90 }), null)
assert.equal(promotionForProduct({ id: 355, house: 'ANTONIO BANDERAS', name: 'Black Seduction', ml: 100 }), null)
assert.equal(promotionForProduct({ id: 375, house: 'ANTONIO BANDERAS', name: 'Black Seduction', ml: 100 }), null)
assert.equal(calculateCartPromotions([voyage,blue,pure,{id:999,house:'OTHER',name:'Other',ml:50,precioUSD:20,quantity:1}]).total, 80)
const stallion = { id: 102, house: 'EMPER', name: 'Emper Stallion 53', ml: 100, precioUSD: 35, quantity: 1 }
assert.equal(promotionForProduct(stallion)?.id, 'stallion')
assert.equal(calculateCartPromotions([stallion]).total, 30)
assert.equal(calculateCartPromotions([stallion], 'bs').total, 35)
const guess = [{ id: 110, house:'GUESS', name:'Guess for Women', ml:75, precioUSD:35, quantity:1 },
               { id: 617, house:'GUESS', name:'Guess Gold', ml:75, precioUSD:35, quantity:1 }]
assert.equal(calculateCartPromotions(guess).total, 70)
assert.equal(calculateCartPromotions(guess).applied.length, 1)
const banderas = {id:355,house:'ANTONIO BANDERAS',name:'Antonio Banderas Black Seduction',ml:200,precioUSD:35,quantity:3}
assert.equal(calculateCartPromotions([banderas]).total,90)
console.log('Cart campaign tests pass')
