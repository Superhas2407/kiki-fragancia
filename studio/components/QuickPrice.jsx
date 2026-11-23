import { useCallback, useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { ProductImagePreview } from './ProductImagePreview'
import { legacyImageUrl } from '../lib/productImage'
import { changePrice } from '../lib/price'

const QUERY = `*[_type == "product" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(name asc) {
  _id, name, house, ml, tipo, precioUSD, agotado, image, "photo": sanityImage.asset->url
}`
const normalize = value => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase()
const controlStyle = { font: 'inherit', color: 'inherit', border: '1px solid #8888', borderRadius: 6, padding: '9px 12px', background: 'transparent' }
const displayPrice = value => Number.isFinite(Number(value)) && Number(value) > 0 ? `$${Number(value).toFixed(2)}` : 'Sin precio'

export default function QuickPrice() {
  const studioClient = useClient({ apiVersion: '2024-01-01' })
  const client = useMemo(() => studioClient.withConfig({ useCdn: false, perspective: 'raw' }), [studioClient])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [draftPrices, setDraftPrices] = useState({})
  const [saving, setSaving] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      setProducts(await client.fetch(QUERY))
      setDraftPrices({})
    } catch {
      setError('No se pudo cargar el catálogo. Pulsa Actualizar para intentar de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    normalize([p.name, p.house, p.ml, p.tipo].join(' ')).includes(normalize(search)) &&
    (filter === 'todos' || (filter === 'agotados' ? p.agotado === true : p.agotado !== true)),
  )
  const anySaving = Object.values(saving).some(Boolean)

  async function save(product) {
    if (saving[product._id]) return
    const text = draftPrices[product._id]
    if (text === undefined || text.trim() === '') return
    setSaving(prev => ({ ...prev, [product._id]: true }))
    setError('')
    setMessage('')
    try {
      const price = await changePrice(client, product, text)
      setProducts(items => items.map(p => p._id === product._id ? { ...p, precioUSD: price } : p))
      setDraftPrices(items => { const next = { ...items }; delete next[product._id]; return next })
      setMessage(`${product.name}: precio actualizado a ${displayPrice(price)} USD.`)
    } catch (err) {
      setError(err.statusCode === 409
        ? 'La ficha se modificó mientras guardabas. Pulsa Actualizar e inténtalo de nuevo.'
        : (err.message || 'No se pudo guardar. Actualiza la lista.'))
    } finally {
      setSaving(prev => ({ ...prev, [product._id]: false }))
    }
  }

  return (
    <section style={{ padding: 24, overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Cambio de precio rápido</h1>
        <p>Busca el perfume, modifica su precio individual en USD y pulsa Guardar.</p>
        <p style={{ opacity: 0.75, fontSize: 14 }}>Cada precio se guarda directamente en Sanity para la web. No cambia el stock, no activa promociones ni publica otros cambios pendientes en borrador.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '20px 0' }}>
          <input type="search" aria-label="Buscar perfume o marca" placeholder="Buscar perfume o marca…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...controlStyle, flex: '1 1 220px' }} />
          <select aria-label="Filtrar disponibilidad" value={filter} onChange={e => setFilter(e.target.value)} style={controlStyle}>
            <option value="todos">Todos</option>
            <option value="disponibles">En stock</option>
            <option value="agotados">Agotados</option>
          </select>
          <button type="button" onClick={load} disabled={loading || anySaving} style={controlStyle}>Actualizar</button>
        </div>
        {error && <p role="alert" style={{ color: '#d33', fontWeight: 600 }}>{error}</p>}
        <p role="status" aria-live="polite">{loading ? 'Cargando perfumes…' : message || `${filtered.length} perfumes publicados`}</p>
        {!loading && filtered.length === 0 && <p>No hay perfumes con esta búsqueda.</p>}
        <div aria-label="Precios de perfumes publicados">
          {filtered.map(p => {
            const src = p.photo ? `${p.photo}?w=100&h=100&fit=max&auto=format` : legacyImageUrl(p.image)
            const edited = draftPrices[p._id]
            const busy = !!saving[p._id]
            const changed = edited !== undefined && edited.trim() !== '' && Number(edited.replace(',', '.')) !== Number(p.precioUSD)
            return (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #8884', flexWrap: 'wrap' }}>
                <div style={{ width: 56, height: 64, flexShrink: 0 }}>{src && <ProductImagePreview key={src} src={src} />}</div>
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>{[p.house, p.ml ? `${p.ml} ml` : '', p.tipo].filter(Boolean).join(' · ')}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{p.agotado ? 'Agotado' : 'En stock'}</div>
                </div>
                <div style={{ minWidth: 112 }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Precio actual</div>
                  <strong>{displayPrice(p.precioUSD)}</strong>
                </div>
                <form onSubmit={e => { e.preventDefault(); save(p) }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                    Nuevo precio (USD)
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Nuevo precio de ${p.name}, ${p.ml || '?'} ml`}
                      autoComplete="off"
                      placeholder="Ej. 40.00"
                      value={edited ?? ''}
                      onChange={e => setDraftPrices(items => ({ ...items, [p._id]: e.target.value }))}
                      disabled={busy || loading}
                      style={{ ...controlStyle, width: 110, boxSizing: 'border-box' }}
                    />
                  </label>
                  <button type="submit" disabled={!changed || busy || loading} style={{ ...controlStyle, cursor: changed && !busy ? 'pointer' : 'not-allowed', opacity: !changed || busy ? 0.5 : 1 }}>
                    {busy ? 'Guardando…' : 'Guardar'}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
