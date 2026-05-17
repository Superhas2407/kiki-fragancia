import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { products } from '../data/products-enriched'
import ProductCard from '../components/ProductCard'
import WheelPagination from '../components/ui/WheelPagination'

const ITEMS_PER_PAGE = 24

const MARCAS   = [...new Set(products.map(p => p.house))].sort()
const FAMILIAS = [...new Set(products.map(p => p.familia))].sort()
const TIPOS    = [...new Set(products.map(p => p.tipo))].sort()
const GENEROS  = ['Masculino', 'Femenino', 'Unisex']

const SORT_OPTIONS = [
  { label: 'Destacados',   key: 'featured'  },
  { label: 'Nombre A – Z', key: 'name'      },
  { label: 'Nombre Z – A', key: 'name-desc' },
]

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

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
      <span style={{
        width: '15px', height: '15px', flexShrink: 0,
        border: checked ? '1px solid #C9A84C' : '1px solid rgba(250,250,248,0.2)',
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
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
        fontWeight: checked ? 400 : 300,
        color: checked ? '#FAFAF8' : 'rgba(250,250,248,0.5)',
        letterSpacing: '0.03em', flex: 1,
        transition: 'color 0.18s ease',
      }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
          color: checked ? '#C9A84C' : 'rgba(250,250,248,0.22)',
          transition: 'color 0.18s ease',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

function FilterSection({ title, children }) {
  return (
    <div style={{ paddingTop: '24px', marginTop: '24px', borderTop: '1px solid rgba(250,250,248,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ width: '18px', height: '1px', background: '#C9A84C', flexShrink: 0 }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: '#C9A84C',
        }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

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
          border: active ? '1px solid #C9A84C' : '1px solid rgba(250,250,248,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.18s ease',
        }}>
          {active && <span style={{ width: '6px', height: '6px', background: '#C9A84C' }} />}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
          fontWeight: active ? 400 : 300,
          color: active ? '#FAFAF8' : 'rgba(250,250,248,0.5)',
          transition: 'color 0.18s ease',
        }}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
          fontWeight: 400, color: '#FAFAF8', fontStyle: 'italic', margin: 0,
        }}>
          Filtrar
        </h2>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Limpiar todo
          </button>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ width: '18px', height: '1px', background: '#C9A84C' }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#C9A84C',
          }}>
            Ordenar
          </span>
        </div>
        {SORT_OPTIONS.map(opt => <RadioItem key={opt.key} label={opt.label} value={opt.key} />)}
      </div>

      <FilterSection title="Marca">
        {MARCAS.map(m => (
          <GoldCheckbox key={m} label={m} checked={selectedMarcas.includes(m)} onToggle={() => toggleMarca(m)} count={countFor('house', m)} />
        ))}
      </FilterSection>

      <FilterSection title="Familia Olfativa">
        {FAMILIAS.map(f => (
          <GoldCheckbox key={f} label={f} checked={selectedFamilias.includes(f)} onToggle={() => toggleFamilia(f)} count={countFor('familia', f)} />
        ))}
      </FilterSection>

      <FilterSection title="Tipo">
        {TIPOS.map(t => (
          <GoldCheckbox key={t} label={t} checked={selectedTipos.includes(t)} onToggle={() => toggleTipo(t)} count={countFor('tipo', t)} />
        ))}
      </FilterSection>

      <FilterSection title="Género">
        {GENEROS.map(g => (
          <GoldCheckbox key={g} label={g} checked={selectedGeneros.includes(g)} onToggle={() => toggleGenero(g)} count={countFor('genero', g)} />
        ))}
      </FilterSection>
    </div>
  )
}

export default function Tienda() {
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy]                       = useState('featured')
  const [selectedMarcas, setSelectedMarcas]       = useState([])
  const [selectedFamilias, setSelectedFamilias]   = useState([])
  const [selectedTipos, setSelectedTipos]         = useState([])
  const [selectedGeneros, setSelectedGeneros]     = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery]             = useState('')
  const [filterBtnHover, setFilterBtnHover]       = useState(false)
  const [currentPage, setCurrentPage]             = useState(1)
  const [searchFocused, setSearchFocused]         = useState(false)
  const topRef = useRef(null)
  const filterMountRef = useRef(true)

  useEffect(() => {
    const marca = searchParams.get('marca')
    const familia = searchParams.get('familia')
    if (marca) {
      const matched = MARCAS.find(m => m.toLowerCase() === marca.toLowerCase())
      if (matched) setSelectedMarcas([matched])
    }
    if (familia) {
      const matched = FAMILIAS.find(f => f.toLowerCase() === familia.toLowerCase())
      if (matched) setSelectedFamilias([matched])
    }
  }, [])

  const toggleMarca   = v => setSelectedMarcas(p   => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleFamilia = v => setSelectedFamilias(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleTipo    = v => setSelectedTipos(p    => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleGenero  = v => setSelectedGeneros(p  => p.includes(v) ? p.filter(x => x !== v) : [...p, v])

  const hasFilters   = selectedMarcas.length > 0 || selectedFamilias.length > 0 || selectedTipos.length > 0 || selectedGeneros.length > 0 || sortBy !== 'featured' || searchQuery.trim() !== ''
  const clearFilters = () => { setSortBy('featured'); setSelectedMarcas([]); setSelectedFamilias([]); setSelectedTipos([]); setSelectedGeneros([]); setSearchQuery('') }
  const activeFilterCount = selectedMarcas.length + selectedFamilias.length + selectedTipos.length + selectedGeneros.length + (sortBy !== 'featured' ? 1 : 0)

  const filtered = useMemo(() => {
    let result = [...products]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.house.toLowerCase().includes(q) ||
        p.familia.toLowerCase().includes(q)
      )
    }
    if (selectedMarcas.length)   result = result.filter(p => selectedMarcas.includes(p.house))
    if (selectedFamilias.length) result = result.filter(p => selectedFamilias.includes(p.familia))
    if (selectedTipos.length)    result = result.filter(p => selectedTipos.includes(p.tipo))
    if (selectedGeneros.length)  result = result.filter(p => selectedGeneros.includes(p.genero))
    if (sortBy === 'name')      result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name))
    return result
  }, [sortBy, selectedMarcas, selectedFamilias, selectedTipos, selectedGeneros, searchQuery])

  useEffect(() => {
    if (filterMountRef.current) { filterMountRef.current = false; return }
    setCurrentPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sortBy, selectedMarcas, selectedFamilias, selectedTipos, selectedGeneros, searchQuery])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  function handlePageChange(page) {
    setCurrentPage(page)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filterProps = { sortBy, setSortBy, selectedMarcas, toggleMarca, selectedFamilias, toggleFamilia, selectedTipos, toggleTipo, selectedGeneros, toggleGenero, hasFilters, clearFilters, allProducts: products }

  return (
    <>
      <Header />

      <div style={{ background: '#0A0A0A', minHeight: '100dvh', paddingTop: '76px' }}>
        <div className="tienda-layout" style={{ maxWidth: '1440px', margin: '0 auto' }}>

          {/* ── Sidebar desktop (≥ 1280px) ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="tienda-sidebar filter-sidebar"
            style={{
              position: 'sticky',
              top: '76px',
              height: 'calc(100vh - 76px)',
              overflowY: 'auto',
              borderRight: '1px solid rgba(201,168,76,0.1)',
              padding: '40px 28px',
              background: '#0A0A0A',
            }}
          >
            <FilterPanel {...filterProps} />
          </motion.aside>

          {/* ── Columna de productos ── */}
          <div ref={topRef} style={{ minWidth: 0 }}>

            {/* Barra superior: título + botón filtros */}
            <div
              className="tienda-pad"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '32px', paddingBottom: '0', marginBottom: '20px',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 400, color: '#FAFAF8',
                  letterSpacing: '-0.02em', lineHeight: 1.08,
                  fontStyle: 'italic', margin: 0,
                }}>
                  Fragancias
                </h1>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                  color: '#C9A84C', marginTop: '6px', letterSpacing: '0.05em',
                }}>
                  {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
                </p>
              </motion.div>

              {/* Botón filtros — visible en < 1280px */}
              <button
                className="filter-toggle-btn"
                onClick={() => setMobileFiltersOpen(true)}
                onMouseEnter={() => setFilterBtnHover(true)}
                onMouseLeave={() => setFilterBtnHover(false)}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: filterBtnHover ? '#C9A84C' : 'transparent',
                  color: filterBtnHover ? '#0A0A0A' : '#C9A84C',
                  border: '1px solid #C9A84C',
                  cursor: 'pointer', padding: '9px 16px',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <FilterIcon />
                Filtros
                {activeFilterCount > 0 && (
                  <span style={{
                    background: filterBtnHover ? '#0A0A0A' : '#C9A84C',
                    color: filterBtnHover ? '#C9A84C' : '#0A0A0A',
                    fontSize: '10px', fontWeight: 600, padding: '1px 6px', marginLeft: '6px',
                    transition: 'background 0.2s ease, color 0.2s ease',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Buscador */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="tienda-pad"
              style={{ marginBottom: '28px' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1px solid ${searchFocused ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
                borderRadius: '2px',
                background: '#1a1a1a',
                padding: '0 16px', gap: '12px',
                transition: 'border-color 0.2s ease',
              }}>
                <span style={{
                  color: searchFocused ? '#C9A84C' : 'rgba(250,250,248,0.3)',
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                  transition: 'color 0.2s ease',
                }}>
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, marca o familia..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    flex: 1,
                    fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 300,
                    color: '#FAFAF8', background: 'none', border: 'none', outline: 'none',
                    padding: '12px 0', letterSpacing: '0.02em',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(250,250,248,0.35)', display: 'flex',
                      alignItems: 'center', padding: '4px', flexShrink: 0,
                    }}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Lista de productos */}
            <div className="tienda-pad" style={{ paddingBottom: '80px' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '24px',
                    color: 'rgba(250,250,248,0.3)', fontStyle: 'italic',
                  }}>
                    Sin resultados para esos filtros
                  </p>
                  <button
                    onClick={clearFilters}
                    style={{
                      marginTop: '20px', fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    Limpiar filtros →
                  </button>
                </div>
              ) : (
                <>
                  <motion.div layout className="tienda-product-grid">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.28, delay: Math.min(index * 0.05, 0.35) }}
                        >
                          <ProductCard product={product} />
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
      </div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileFiltersOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 99,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer desde la izquierda ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, bottom: 0,
              width: '290px', maxWidth: '85vw',
              background: '#0A0A0A',
              zIndex: 100,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', height: '60px',
              borderBottom: '1px solid rgba(250,250,248,0.07)',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px', fontStyle: 'italic', color: '#FAFAF8', fontWeight: 400,
              }}>
                Filtros
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(250,250,248,0.45)', padding: '4px', display: 'flex', alignItems: 'center',
                }}
                aria-label="Cerrar filtros"
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
              <FilterPanel {...filterProps} />
            </div>

            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(250,250,248,0.07)',
              flexShrink: 0,
            }}>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  width: '100%', background: '#C9A84C', color: '#0A0A0A', border: 'none',
                  padding: '14px', fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                Aplicar filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
