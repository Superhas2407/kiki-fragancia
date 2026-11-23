// Single source of truth: published Sanity "promotion" documents.
// No campaign is enabled from historical ads, old application source or prices
// displayed in a product story. If the live query fails, promotions = [].
export function sanitizePromotions(rows=[],now=new Date()){
  const when=+new Date(now)
  if(!Array.isArray(rows)||!Number.isFinite(when))return []
  const used=new Set()
  const checked=rows.flatMap(raw=>{
    const id=String(raw?.id||'').trim()
    const name=String(raw?.name||'').trim()
    const count=Number(raw?.count)
    const price=Number(raw?.priceUSD)
    const start=raw?.startsAt?Date.parse(raw.startsAt):null
    const end=raw?.endsAt?Date.parse(raw.endsAt):null
    const productIds=[...new Set((Array.isArray(raw?.productIds)?raw.productIds:[])
      .map(Number).filter(x=>Number.isSafeInteger(x)&&x>0))]
    if(raw?.active!==true||!id||!/^[a-z0-9-]+$/.test(id)||used.has(id)||!name||
       !Number.isInteger(count)||count<1||count>10||!Number.isFinite(price)||price<=0||
       !productIds.length||(start!==null&&(!Number.isFinite(start)||when<start))||
       (end!==null&&(!Number.isFinite(end)||when>=end)))return []
    used.add(id)
    return [{id,name,count,price,active:true,label:count===1?'$'+price:count+' × $'+price,
      productIds,startsAt:raw.startsAt||null,endsAt:raw.endsAt||null,
      conditions:String(raw.conditions||'').slice(0,500)}]
  })
  // Fail closed when two campaigns overlap in eligible SKUs; never select
  // a random discount for the same perfume.
  const totals=new Map()
  for(const p of checked)for(const id of p.productIds)totals.set(id,(totals.get(id)||0)+1)
  return checked.filter(p=>p.productIds.every(id=>totals.get(id)===1))
}

export function promotionForProduct(product,promotions=[]){
  if(!product||product.agotado===true||!Array.isArray(promotions))return null
  const productId=Number(product.id)
  if(!Number.isSafeInteger(productId)||productId<=0)return null
  return promotions.find(p=>p.active===true&&Array.isArray(p.productIds)&&p.productIds.includes(productId))||null
}
