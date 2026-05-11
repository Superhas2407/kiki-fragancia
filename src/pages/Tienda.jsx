import { useState, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { products, getProductImage } from '../data/products'
import { useCartContext } from '../context/CartContext'

// ─── Constantes de filtro ──────────────────────────────────────────────────────
const MARCAS    = [...new Set(products.map(p => p.house))].sort()
const FAMILIAS  = [...new Set(products.map(p => p.familia))].sort()
const TIPOS     = [...new Set(products.map(p => p.tipo))].sort()
const GENEROS   = ['Masculino', 'Femenino', 'Unisex']

const SORT_OPTIONS = [
  { label: 'Destacados',    key: 'featured'   },
  { label: 'Menor precio',  key: 'price-asc'  },
  { label: 'Mayor precio',  key: 'price-desc' },
  { label: 'Nombre A – Z', key: 'name'        },
]

// ─── Íconos ───────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ─── Checkbox custom gold ──────────────────────────────────────────────────────
function GoldCheckbox({ label, checked, onToggle, count }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '6px 0', width: '100%', textAlign: 'left',
      }}
    >
      {/* Caja */}
      <span style={{
        width: '15px', height: '15px', flexShrink: 0,
        border: checked ? '1px solid #C9A84C' : '1px solid rgba(10,10,10,0.18)',
        background: checked ? '#C9A84C' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.18s ease, border-color 0.18s ease',
      }}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {/* Label */}
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        fontWeight: checked ? 400 : 300,
        color: checked ? '#0A0A0A' : 'rgba(10,10,10,0.55)',
        letterSpacing: '0.03em',
        flex: 1,
        transition: 'color 0.18s ease',
      }}>
        {label}
      </span>

      {/* Conteo */}
      {count !== undefined && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px',
          color: checked ? '#C9A84C' : 'rgba(10,10,10,0.25)',
          transition: 'color 0.18s ease',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

// ─── Sección de filtro con línea decorativa ────────────────────────────────────
function FilterSection({ title, children }) {
  return (
    <div style={{ paddingTop: '24px', marginTop: '24px', borderTop: '1px solid rgba(10,10,10,0.07)' }}>
      {/* Encabezado con línea gold */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ width: '18px', height: '1px', background: '#C9A84C', flexShrink: 0 }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
        }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Panel de filtros completo ─────────────────────────────────────────────────
function FilterPanel({ sortBy, setSortBy, selectedMarcas, toggleMarca, selectedFamilias, toggleFamilia, selectedTipos, toggleTipo, selectedGeneros, toggleGenero, hasFilters, clearFilters, allProducts }) {

  function countFor(field, value) {
    return allProducts.filter(p => p[field] === value).length
  }

  function RadioItem({ label, value }) {
    const active = sortBy === value
    return (
      <button
        onClick={() => setSortBy(value)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 0', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{
          width: '15px', height: '15px', flexShrink: 0,
          border: active ? '1px solid #C9A84C' : '1px solid rgba(10,10,10,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.18s ease',
        }}>
          {active && <span style={{ width: '6px', height: '6px', background: '#C9A84C' }} />}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px', fontWeight: active ? 400 : 300,
          color: active ? '#0A0A0A' : 'rgba(10,10,10,0.55)',
          transition: 'color 0.18s ease',
        }}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: '#0A0A0A', fontStyle: 'italic', margin: 0 }}>
          Filtrar
        </h2>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#C9A84C', background: 'none', border: 'none',
            cursor: 'pointer', padding: 0,
          }}>
            Limpiar todo
          </button>
        )}
      </div>

      {/* Ordenar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ width: '18px', height: '1px', background: '#C9A84C' }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
            Ordenar
          </span>
        </div>
        {SORT_OPTIONS.map(opt => <RadioItem key={opt.key} label={opt.label} value={opt.key} />)}
      </div>

      {/* Marca */}
      <FilterSection title="Marca">
        {MARCAS.map(m => (
          <GoldCheckbox
            key={m} label={m}
            checked={selectedMarcas.includes(m)}
            onToggle={() => toggleMarca(m)}
            count={countFor('house', m)}
          />
        ))}
      </FilterSection>

      {/* Familia Olfativa */}
      <FilterSection title="Familia Olfativa">
        {FAMILIAS.map(f => (
          <GoldCheckbox
            key={f} label={f}
            checked={selectedFamilias.includes(f)}
            onToggle={() => toggleFamilia(f)}
            count={countFor('familia', f)}
          />
        ))}
      </FilterSection>

      {/* Tipo */}
      <FilterSection title="Tipo">
        {TIPOS.map(t => (
          <GoldCheckbox
            key={t} label={t}
            checked={selectedTipos.includes(t)}
            onToggle={() => toggleTipo(t)}
            count={countFor('tipo', t)}
          />
        ))}
      </FilterSection>

      {/* Género */}
      <FilterSection title="Género">
        {GENEROS.map(g => (
          <GoldCheckbox
            key={g} label={g}
            checked={selectedGeneros.includes(g)}
            onToggle={() => toggleGenero(g)}
            count={countFor('genero', g)}
          />
        ))}
      </FilterSection>
    </div>
  )
}

// ─── Fila de producto editorial ────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const { items, addItem, updateQuantity } = useCartContext()
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cartItem = items.find(i => i.id === product.id)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1100)
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '28px',
        padding: '20px 0',
        borderBottom: '1px solid rgba(10,10,10,0.07)',
        alignItems: 'stretch',
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* ── Foto 200px ── */}
      <div style={{ width: '200px', height: '180px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        <img
          src={getProductImage(product.image)}
          alt={`${product.house} ${product.name}`}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        {/* Overlay sutil en hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,10,0.08)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Info ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>

        {/* Número + metadatos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '13px', color: 'rgba(10,10,10,0.2)',
            fontStyle: 'italic', fontWeight: 400, flexShrink: 0,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ height: '1px', background: 'rgba(10,10,10,0.08)', flex: 1 }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.35)', whiteSpace: 'nowrap',
          }}>
            {product.familia}&nbsp;·&nbsp;{product.tipo}
          </p>
        </div>

        {/* Casa */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)', marginBottom: '6px',
        }}>
          {product.house}
        </p>

        {/* Nombre — protagonista */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(28px, 2.8vw, 38px)',
          fontWeight: 400, fontStyle: 'italic',
          color: '#0A0A0A',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: 0,
        }}>
          {product.name}
        </h2>

        {/* Precio */}
        {product.price && (
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px', fontWeight: 400,
            color: '#C9A84C', letterSpacing: '-0.02em', lineHeight: 1,
            marginTop: '6px',
          }}>
            {product.price}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* ── Pie: acciones ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          borderTop: '1px solid rgba(10,10,10,0.07)',
          paddingTop: '14px', marginTop: '14px',
          gap: '16px', flexWrap: 'wrap',
        }}>
          {/* Acciones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Selector cantidad (solo si está en carrito) */}
            {cartItem && (
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid rgba(10,10,10,0.15)',
              }}>
                <button
                  onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                  style={{ width: '32px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >−</button>
                <span style={{
                  width: '36px', textAlign: 'center',
                  fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#0A0A0A',
                  borderLeft: '1px solid rgba(10,10,10,0.1)', borderRight: '1px solid rgba(10,10,10,0.1)',
                  lineHeight: '36px',
                }}>
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  style={{ width: '32px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>
            )}

            {/* Botón agregar */}
            <button
              onClick={handleAdd}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '12px 28px',
                border: added ? '1px solid #C9A84C' : '1px solid #0A0A0A',
                background: added ? '#C9A84C' : 'transparent',
                color: added ? '#0A0A0A' : '#0A0A0A',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!added) { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#FAFAF8' }}}
              onMouseLeave={e => { if (!added) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0A0A0A' }}}
            >
              {added ? <><CheckIcon /> Agregado</> : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function Tienda() {
  const [sortBy, setSortBy]                   = useState('featured')
  const [selectedMarcas, setSelectedMarcas]   = useState([])
  const [selectedFamilias, setSelectedFamilias] = useState([])
  const [selectedTipos, setSelectedTipos]       = useState([])
  const [selectedGeneros, setSelectedGeneros]   = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleMarca   = v => setSelectedMarcas(p   => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleFamilia = v => setSelectedFamilias(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleTipo    = v => setSelectedTipos(p    => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleGenero  = v => setSelectedGeneros(p  => p.includes(v) ? p.filter(x => x !== v) : [...p, v])

  const hasFilters   = selectedMarcas.length > 0 || selectedFamilias.length > 0 || selectedTipos.length > 0 || selectedGeneros.length > 0 || sortBy !== 'featured'
  const clearFilters = () => { setSortBy('featured'); setSelectedMarcas([]); setSelectedFamilias([]); setSelectedTipos([]); setSelectedGeneros([]) }

  const activeFilterCount = selectedMarcas.length + selectedFamilias.length + selectedTipos.length + selectedGeneros.length + (sortBy !== 'featured' ? 1 : 0)

  const filtered = useMemo(() => {
    let result = [...products]
    if (selectedMarcas.length)   result = result.filter(p => selectedMarcas.includes(p.house))
    if (selectedFamilias.length) result = result.filter(p => selectedFamilias.includes(p.familia))
    if (selectedTipos.length)    result = result.filter(p => selectedTipos.includes(p.tipo))
    if (selectedGeneros.length)  result = result.filter(p => selectedGeneros.includes(p.genero))
    if (sortBy === 'price-asc')  result.sort((a,b) => parseFloat((a.price||'$0').replace('$','')) - parseFloat((b.price||'$0').replace('$','')))
    if (sortBy === 'price-desc') result.sort((a,b) => parseFloat((b.price||'$0').replace('$','')) - parseFloat((a.price||'$0').replace('$','')))
    if (sortBy === 'name')       result.sort((a,b) => a.name.localeCompare(b.name))
    return result
  }, [sortBy, selectedMarcas, selectedFamilias, selectedTipos, selectedGeneros])

  const filterProps = { sortBy, setSortBy, selectedMarcas, toggleMarca, selectedFamilias, toggleFamilia, selectedTipos, toggleTipo, selectedGeneros, toggleGenero, hasFilters, clearFilters, allProducts: products }

  return (
    <>
      <Header />

      <div style={{ background: '#F5F0E8', minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-start' }}>

          {/* ── Sidebar desktop (≥ 768px) ── */}
          <aside
            className="hidden md:block"
            style={{
              width: '260px',
              flexShrink: 0,
              position: 'sticky',
              top: '64px',
              alignSelf: 'flex-start',
              borderRight: '1px solid rgba(10,10,10,0.08)',
              padding: '40px 28px',
            }}
          >
            <FilterPanel {...filterProps} />
          </aside>

          {/* ── Columna de productos ── */}
          <div style={{ flex: 1, padding: '40px 32px 80px' }}>

            {/* Barra superior */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Fragancias
                </h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(10,10,10,0.4)', marginTop: '6px', letterSpacing: '0.05em' }}>
                  {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
                </p>
              </div>

              {/* Botón filtros mobile */}
              <button
                className="flex md:hidden items-center gap-2"
                onClick={() => setMobileFiltersOpen(true)}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: '#0A0A0A', color: '#FAFAF8',
                  border: 'none', cursor: 'pointer',
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <FilterIcon />
                Filtros
                {activeFilterCount > 0 && (
                  <span style={{ background: '#C9A84C', color: '#0A0A0A', fontSize: '10px', fontWeight: 600, padding: '1px 6px' }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Lista de productos */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'rgba(10,10,10,0.3)', fontStyle: 'italic' }}>
                  Sin resultados para esos filtros
                </p>
                <button
                  onClick={clearFilters}
                  style={{ marginTop: '20px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Limpiar filtros →
                </button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid rgba(10,10,10,0.07)' }}>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Drawer de filtros mobile ── */}
      <>
        <div
          onClick={() => setMobileFiltersOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90,
            opacity: mobileFiltersOpen ? 1 : 0,
            pointerEvents: mobileFiltersOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        />
        <div
          style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: '85%', maxWidth: '320px',
            background: '#F5F0E8',
            borderRight: '1px solid rgba(10,10,10,0.1)',
            zIndex: 100, padding: '24px',
            overflowY: 'auto',
            transform: mobileFiltersOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,0.5)' }}>
              <CloseIcon />
            </button>
          </div>
          <FilterPanel {...filterProps} />
        </div>
      </>

      <Footer />
    </>
  )
}
