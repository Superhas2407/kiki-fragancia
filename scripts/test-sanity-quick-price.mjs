import assert from 'node:assert/strict'
import { parsePrice, pricePatches, changePrice } from '../studio/lib/price.js'

assert.equal(parsePrice('40'), 40)
assert.equal(parsePrice('40.50'), 40.5)
assert.equal(parsePrice('40,50'), 40.5)
for (const value of ['0', '-1', '', 'abc', '40.333', '1e2', '1000001']) {
  assert.throws(() => parsePrice(value), undefined, 'Invalid price: ' + value)
}

const published = { _id:'perfume-3', _rev:'published-revision', precioUSD:40, agotado:false }
const draft = { _id:'drafts.perfume-3', _rev:'draft-revision', precioUSD:39, descripcion:'Texto pendiente' }
assert.deepEqual(pricePatches(published,draft,45),[
  { patch:{id:'perfume-3',ifRevisionID:'published-revision',set:{precioUSD:45}}},
  { patch:{id:'drafts.perfume-3',ifRevisionID:'draft-revision',set:{precioUSD:45}}}
])
assert.equal(pricePatches(published,null,45).length,1)
assert.throws(()=>pricePatches({...published,_rev:null},draft,45))

let transaction=null
const client={
  getDocuments:async()=>[published,draft],
  transaction:ops=>{
    transaction=ops
    return {commit:async()=>({transactionId:'ok'})}
  }
}
assert.equal(await changePrice(client,published,'45.50'),45.5)
assert.equal(transaction.length,2)
assert.deepEqual(Object.keys(transaction[0].patch.set),['precioUSD'])
assert.deepEqual(Object.keys(transaction[1].patch.set),['precioUSD'])
assert.ok(!('descripcion' in transaction[1].patch.set),'Do not publish or overwrite pending draft changes')

const stale={...published,precioUSD:35}
await assert.rejects(()=>changePrice(client,stale,'60'),/cambió/)
assert.equal(await changePrice({...client,getDocuments:async()=>[null,null]},published,'45').catch(e=>e.message),
 'Este producto ya no está publicado. Actualiza la lista.')
console.log('Sanity Quick Price: prices, draft safety, revision conflicts and field isolation passed')
