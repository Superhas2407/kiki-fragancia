import { useCallback, useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { ProductImagePreview } from './ProductImagePreview'
import { legacyImageUrl } from '../lib/productImage'
import { changeStock } from '../lib/stock'

const QUERY = `*[_type == "product" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(name asc) {
  _id, name, house, ml, tipo, agotado, image, "photo": sanityImage.asset->url
}`
const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const controlStyle = { font: 'inherit', color: 'inherit', border: '1px solid #8888', borderRadius: 6, padding: '9px 12px', background: 'transparent' }

export default function QuickStock() {
  const studioClient = useClient({ apiVersion: '2024-01-01' })
  const client = useMemo(() => studioClient.withConfig({ useCdn: false, perspective: 'raw' }), [studioClient])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try { setProducts(await client.fetch(QUERY)) }
    catch { setError('No se pudo cargar el catálogo. Pulsa Actualizar para intentar de nuevo.') }
    finally { setLoading(false) }
  }, [client])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    normalize([p.name, p.house, p.ml, p.tipo].join(' ')).includes(normalize(search)) &&
    (filter === 'todos' || (filter === 'agotados' ? p.agotado === true : p.agotado !== true)),
  )

  async function toggle(product) {
    if (saving[product._id]) return
    const agotado = product.agotado !== true
    setSaving(s => ({ ...s, [product._id]: true }))
    setError('')
    setMessage('')
    try {
      await changeStock(client, product, agotado)
      setProducts(items => items.map(p => p._id === product._id ? { ...p, agotado } : p))
      setMessage(`${product.name}: ${agotado ? 'Agotado' : 'En stock'}. Cambio guardado.`)
    } catch (err) {
      setError(err.statusCode === 409
        ? 'La ficha cambió mientras guardabas. Pulsa Actualizar e inténtalo de nuevo.'
        : (err.message || 'No se pudo guardar el cambio. Actualiza la lista.'))
    } finally {
      setSaving(s => ({ ...s, [product._id]: false }))
    }
  }

  return (
    <section style={{ padding: 24, overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Stock rápido</h1>
        <p>Activa el switch para indicar En stock; desactívalo para marcar Agotado.</p>
        <p style={{ opacity: 0.75, fontSize: 14 }}>Los cambios se guardan directamente para la web. Solo se actualiza el stock; los demás cambios en borrador se conservan.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '20px 0' }}>
          <input type="search" aria-label="Buscar perfume o marca" placeholder="Buscar perfume o marca…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...controlStyle, flex: '1 1 220px' }} />
          <select aria-label="Filtrar disponibilidad" value={filter} onChange={e => setFilter(e.target.value)} style={controlStyle}>
            <option value="todos">Todos</option>
            <option value="disponibles">En stock</option>
            <option value="agotados">Agotados</option>
          </select>
          <button onClick={load} disabled={loading || Object.values(saving).some(Boolean)} style={controlStyle}>Actualizar</button>
        </div>
        {error && <p role="alert" style={{ color: '#d33', fontWeight: 600 }}>{error}</p>}
        <p role="status" aria-live="polite">{loading ? 'Cargando perfumes…' : message || `${filtered.length} perfumes publicados`}</p>
        {!loading && filtered.length === 0 && <p>No hay perfumes con esta búsqueda.</p>}
        <div aria-label="Perfumes publicados">
          {filtered.map(p => {
            const src = p.photo ? `${p.photo}?w=100&h=100&fit=max&auto=format` : legacyImageUrl(p.image)
            const inStock = p.agotado !== true
            return (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #8884' }}>
                <div style={{ width: 56, height: 64, flexShrink: 0 }}>{src && <ProductImagePreview key={src} src={src} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>{[p.house, p.ml ? `${p.ml} ml` : '', p.tipo].filter(Boolean).join(' · ')}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 82 }}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={inStock}
                    aria-label={`En stock: ${p.name}, ${p.house}, ${p.ml || '?'} ml`}
                    disabled={!!saving[p._id] || loading}
                    onClick={() => toggle(p)}
                    style={{ width: 48, height: 28, border: 0, borderRadius: 20, padding: 3, background: inStock ? '#227c55' : '#777', cursor: saving[p._id] ? 'wait' : 'pointer', opacity: saving[p._id] ? 0.6 : 1 }}
                  >
                    <span style={{ display: 'block', width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: inStock ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 120ms' }} />
                  </button>
                  <div style={{ fontSize: 12, marginTop: 5 }}>{saving[p._id] ? 'Guardando…' : inStock ? 'En stock' : 'Agotado'}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
