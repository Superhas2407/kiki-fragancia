import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { useCartContext } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { STORE_PROMOTIONS, promotionForProduct } from '../data/store-promotions'

export default function ArmarCombo() {
  const { promoId } = useParams()
  const navigate = useNavigate()
  const products = useIndexProducts()
  const { addItem, setDrawerOpen } = useCartContext()
  const { currency } = useCurrency()
  const promo = STORE_PROMOTIONS.find(p => p.id === promoId && p.active && p.count >= 2)
  const [selection, setSelection] = useState({})
  const eligible = useMemo(() => products.filter(p => promotionForProduct(p)?.id === promoId)
    .sort((a,b) => String(a.name).localeCompare(String(b.name))), [products, promoId])
  const total = Object.values(selection).reduce((sum,n) => sum+n,0)

  if (!promo) return <main style={{ minHeight: '65vh', padding: '180px 24px 50px', textAlign: 'center' }}>
    <h1>Esta promoción no está disponible</h1><Link to="/tienda">Volver a tienda</Link>
  </main>

  function adjust(id, delta) {
    setSelection(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta)
      if (delta > 0 && total >= promo.count) return prev
      return { ...prev, [id]: next }
    })
  }

  function addCombo() {
    if (total !== promo.count || currency !== 'usd') return
    const chosen = eligible.filter(p => selection[p.id] > 0)
    // Todos los productos son comprobados en el índice activo de Sanity.
    if (chosen.reduce((sum,p) => sum + selection[p.id],0) !== promo.count) return
    chosen.forEach(p => addItem(p, selection[p.id]))
    setDrawerOpen(true)
    navigate('/tienda')
  }

  return <main style={{ maxWidth: 1180, margin: '0 auto', minHeight: '75vh', padding: 'calc(var(--bar-h, 0px) + var(--kiki-header-h, 76px) + 35px) 20px 80px', color: 'var(--ink)', fontFamily: "'KikiGotham', sans-serif" }}>
    <Link to="/tienda?promos=1" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: 12 }}>← Ver promociones</Link>
    <p style={{ marginTop: 35, letterSpacing: '.18em', fontSize: 10, color: '#AE7381' }}>KIKI FRAGANCIA · PROMOCIONES</p>
    <h1 style={{ fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 300, margin: '12px 0' }}>Arma tu combo {promo.name}</h1>
    <p style={{ opacity: .7, fontSize: 14 }}>Selecciona {promo.count} fragancias participantes. Puedes combinar o repetir modelos según disponibilidad.</p>
    <div style={{ display: 'inline-block', background: '#873F50', color: '#fff', padding: '9px 18px', margin: '15px 0 25px', fontWeight: 600, fontSize: 14 }}>
      {promo.count} por ${promo.price} · Pago en divisas
    </div>
    {currency !== 'usd' && <p role="status" style={{ padding: 14, border: '1px solid #873F50', marginBottom: 22 }}>
      La promoción solo aplica para pagos en divisas. Cambia el selector de moneda a USD para agregar este combo.
    </p>}
    {!eligible.length && <p>No hay productos participantes confirmados disponibles en el catálogo. Consulta existencias por WhatsApp.</p>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 18 }}>
      {eligible.map(p => <article key={p.id} style={{ border: '1px solid var(--line)', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 160, display: 'grid', placeItems: 'center', background: 'var(--raised)' }}>
          {resolveProductImage(p) && <img src={resolveProductImage(p)} alt={p.name} loading="lazy" style={{ maxWidth: '100%', height: 145, objectFit: 'contain' }}/>}
        </div>
        <div style={{ fontSize: 10, opacity: .55, letterSpacing: '.12em' }}>{p.house} · {p.ml} ML</div>
        <strong style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{p.name}</strong>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" aria-label={`Quitar ${p.name}`} disabled={!selection[p.id]} onClick={() => adjust(p.id,-1)} style={{ width: 38, height: 38, border: '1px solid var(--line)', color: 'var(--ink)', background: 'transparent', cursor: 'pointer' }}>−</button>
          <strong>{selection[p.id] || 0}</strong>
          <button type="button" aria-label={`Agregar ${p.name}`} disabled={total >= promo.count || currency !== 'usd'} onClick={() => adjust(p.id,1)} style={{ width: 38, height: 38, border: '1px solid var(--line)', color: 'var(--ink)', background: 'transparent', cursor: 'pointer' }}>+</button>
        </div>
      </article>)}
    </div>
    <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg2)', borderTop: '1px solid var(--line)', padding: 16, marginTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 15, zIndex: 10 }}>
      <div><strong>{total} de {promo.count} seleccionados</strong><div style={{ fontSize: 12, opacity: .65 }}>Total del combo: {total === promo.count ? `REF $${promo.price}` : 'Completa tu selección'}</div></div>
      <button type="button" disabled={total !== promo.count || currency !== 'usd'} onClick={addCombo} style={{ background: '#873F50', color: '#fff', border: 0, padding: '14px 22px', opacity: total === promo.count && currency === 'usd' ? 1 : .45, cursor: 'pointer', fontFamily: 'inherit' }}>Agregar combo al carrito</button>
    </div>
    <p style={{ opacity: .5, fontSize: 11, marginTop: 18 }}>Promoción sujeta a inventario y confirmación de la tienda.</p>
  </main>
}
