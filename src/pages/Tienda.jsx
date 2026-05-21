import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
import { allProducts as products } from '../data/all-products'
import VitrinaCard from '../components/VitrinaCard'
import WheelPagination from '../components/ui/WheelPagination'

const ITEMS_PER_PAGE = 20

const SORT_OPTIONS = [
  { label: 'Destacados',    key: 'featured'   },
  { label: 'Nombre A – Z',  key: 'name'       },
  { label: 'Nombre Z – A',  key: 'name-desc'  },
  { label: 'Precio: menor', key: 'price-asc'  },
  { label: 'Precio: mayor', key: 'price-desc' },
]

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function GoldCheckbox({ label, checked, onToggle, count }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '6px 0', width: '100%', textAlign: 'left',
      }}
    >
      <span style={{
        width: 15, height: 15, flexShrink: 0,
        border: checked ? '1px solid #C9A84C' : '1px solid rgba(250,250,248,0.2)',
        background: checked ? '#C9A84C' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.18s, border-color 0.18s',
      }}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: checked ? 400 : 300,
        color: checked ? '#FAFAF8' : 'rgba(250,250,248,0.5)',
        letterSpacing: '0.03em', flex: 1, transition: 'color 0.18s',
      }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10,
          color: checked ? '#C9A84C' : 'rgba(250,250,248,0.22)', transition: 'color 0.18s',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

function FilterPanel({ sortBy, setSortBy, selectedMarcas, toggleMarca, hasFilters, clearFilters, productPool }) {
  // Marcas disponibles en el pool actual (ya filtrado por género del sidebar)
  const marcas = useMemo(() => {
    const set = new Set(productPool.map(p => p.house))
    return [...set].sort()
  }, [productPool])

  function countFor(house) {
    return productPool.filter(p => p.house === house).length
  }

  function RadioItem({ label, value }) {
    const active = sortBy === value
    return (
      <button
        onClick={() => setSortBy(value)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 0', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{
          width: 15, height: 15, flexShrink: 0,
          border: active ? '1px solid #C9A84C' : '1px solid rgba(250,250,248,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.18s',
        }}>
          {active && <span style={{ width: 6, height: 6, background: '#C9A84C' }}/>}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: active ? 400 : 300,
          color: active ? '#FAFAF8' : 'rgba(250,250,248,0.5)', transition: 'color 0.18s',
        }}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
          fontWeight: 400, color: '#FAFAF8', fontStyle: 'italic', margin: 0,
        }}>
          Filtrar
        </h2>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 9,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Limpiar
          </button>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Ordenar
          </span>
        </div>
        {SORT_OPTIONS.map(opt => <RadioItem key={opt.key} label={opt.label} value={opt.key}/>)}
      </div>

      <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid rgba(250,250,248,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Marca
          </span>
        </div>
        {marcas.map(m => (
          <GoldCheckbox
            key={m}
            label={m}
            checked={selectedMarcas.includes(m)}
            onToggle={() => toggleMarca(m)}
            count={countFor(m)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Tienda() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sortBy, setSortBy]           = useState('featured')
  const [selectedMarcas, setSelectedMarcas] = useState([])
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchFocused, setSearchFocused] = useState(false)
  const topRef = useRef(null)
  const mountRef = useRef(true)

  // Leer ?genero= de la URL (viene del GlobalSidebar)
  const urlGenero = searchParams.get('genero') || null

  // Cuando cambia la URL, resetear filtros adicionales
  useEffect(() => {
    setSelectedMarcas([])
    setCurrentPage(1)
  }, [urlGenero])

  const toggleMarca = v => setSelectedMarcas(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])

  const hasFilters = selectedMarcas.length > 0 || sortBy !== 'featured'
  const clearFilters = () => { setSortBy('featured'); setSelectedMarcas([]) }
  const activeFilterCount = selectedMarcas.length + (sortBy !== 'featured' ? 1 : 0)

  // Pool base: filtrado por la selección del sidebar global
  const basePool = useMemo(() => {
    if (!urlGenero) return products
    return products.filter(p => p.genero === urlGenero)
  }, [urlGenero])

  const filtered = useMemo(() => {
    let result = [...basePool]
    if (selectedMarcas.length) result = result.filter(p => selectedMarcas.includes(p.house))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.house.toLowerCase().includes(q))
    }
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'name-desc')  result.sort((a, b) => b.name.localeCompare(a.name))
    if (sortBy === 'price-asc')  result.sort((a, b) => (a.precioUSD || 9999) - (b.precioUSD || 9999))
    if (sortBy === 'price-desc') result.sort((a, b) => (b.precioUSD || 0) - (a.precioUSD || 0))
    return result
  }, [basePool, selectedMarcas, searchQuery, sortBy])

  useEffect(() => {
    if (mountRef.current) { mountRef.current = false; return }
    setCurrentPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sortBy, selectedMarcas, searchQuery, urlGenero])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  function handlePageChange(page) {
    setCurrentPage(page)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Label del título según selección del sidebar
  const LABEL_MAP = { Masculino: 'Hombre', Femenino: 'Mujer', Unisex: 'Unisex', 'Niño': 'Kids' }
  const sectionTitle = urlGenero ? (LABEL_MAP[urlGenero] || urlGenero) : 'Fragancias'

  const filterProps = { sortBy, setSortBy, selectedMarcas, toggleMarca, hasFilters, clearFilters, productPool: basePool }

  return (
    <>
      <div style={{ background: '#0A0A0A', minHeight: '100dvh', paddingTop: 76 }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>

          {/* Barra superior */}
          <div
            ref={topRef}
            className="tienda-pad"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 32, paddingBottom: 0, marginBottom: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 400, color: '#FAFAF8',
                letterSpacing: '-0.02em', lineHeight: 1.08,
                fontStyle: 'italic', margin: 0,
              }}>
                {sectionTitle}
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#C9A84C', marginTop: 6, letterSpacing: '0.05em' }}>
                {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
              </p>
            </motion.div>

            {/* Botón Filtrar — visible en todos los tamaños */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'transparent', color: '#C9A84C',
                border: '1px solid #C9A84C', cursor: 'pointer', padding: '11px 16px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A0A0A' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}
            >
              <FilterIcon />
              Filtrar
              {activeFilterCount > 0 && (
                <span style={{ background: '#C9A84C', color: '#0A0A0A', fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Chips de género — visible solo en mobile/tablet (< 1024px) */}
          <div className="tienda-genero-chips tienda-pad">
            {[
              { key: null,        label: 'Todos' },
              { key: 'Masculino', label: 'Hombre' },
              { key: 'Femenino',  label: 'Mujer' },
              { key: 'Unisex',    label: 'Unisex' },
              { key: 'Niño',      label: 'Kids' },
            ].map(({ key, label }) => {
              const isActive = urlGenero === key
              return (
                <button
                  key={label}
                  onClick={() => key === null ? navigate('/tienda') : navigate(`/tienda?genero=${key}`)}
                  className={`tienda-genero-chip${isActive ? ' active' : ''}`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Buscador — oculto en mobile (usa lupa del header) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="tienda-pad tienda-search-desktop"
            style={{ marginBottom: 28 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center',
              border: `1px solid ${searchFocused ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
              background: '#1a1a1a', padding: '0 16px', gap: 12,
              transition: 'border-color 0.2s',
            }}>
              <span style={{ color: searchFocused ? '#C9A84C' : 'rgba(250,250,248,0.3)', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300,
                  color: '#FAFAF8', background: 'none', border: 'none', outline: 'none',
                  padding: '12px 0', letterSpacing: '0.02em',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,250,248,0.35)', display: 'flex', padding: 4 }}
                  aria-label="Limpiar búsqueda"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </motion.div>

          {/* Grid de productos */}
          <div className="tienda-pad" style={{ paddingBottom: 80 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'rgba(250,250,248,0.45)', fontStyle: 'italic', marginBottom: 8 }}>
                  No encontramos esa fragancia
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.25)', marginBottom: 28 }}>
                  Intenta con otros filtros
                </p>
                <button
                  onClick={clearFilters}
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: '#C9A84C', background: 'none',
                    border: '1px solid rgba(201,168,76,0.35)', padding: '10px 20px', cursor: 'pointer',
                  }}
                >
                  Ver todas
                </button>
              </div>
            ) : (
              <>
                <motion.div layout className="vitrina-grid">
                  <AnimatePresence mode="popLayout">
                    {paginated.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                      >
                        <VitrinaCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <WheelPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Backdrop */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }}
          />
        )}
      </AnimatePresence>

      {/* Drawer de filtros */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: 300, maxWidth: '88vw',
              background: '#0A0A0A', zIndex: 100,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', height: 60,
              borderBottom: '1px solid rgba(250,250,248,0.07)', flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', color: '#FAFAF8', fontWeight: 400 }}>
                Filtros
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,250,248,0.45)', padding: 4, display: 'flex' }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
              <FilterPanel {...filterProps} />
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(250,250,248,0.07)', flexShrink: 0 }}>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: '100%', background: '#C9A84C', color: '#0A0A0A', border: 'none',
                  padding: 14, fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                Ver resultados
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
