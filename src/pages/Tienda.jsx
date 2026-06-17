import { useState, useMemo, useEffect, useRef, Component, useTransition, startTransition } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useIndexProducts } from '../context/SanityProductsContext'
import VitrinaCard from '../components/VitrinaCard'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { diaDeLPadreIds, diaDeLPadreDiscounts } from '../data/dia-del-padre'
import { COLECCIONES, coleccionById } from '../data/colecciones'
import { notesLookup } from '../data/notes-lookup'
import { norm, productMatchesQuery } from '../lib/search'

const PAGE_SIZE = 48

class GridBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(e) { return { err: e } }
  render() {
    if (this.state.err) return (
      <div style={{ gridColumn: '1/-1', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-d)', fontSize: 18, color: 'var(--ink-faint)', fontStyle: 'italic', marginBottom: 8 }}>
          Error al cargar productos
        </p>
        <p style={{ fontFamily: 'var(--font-s)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: 24 }}>
          {this.state.err?.message || 'Error desconocido'}
        </p>
        <button onClick={() => window.location.reload()} style={{ fontFamily: 'var(--font-s)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '12px 28px', border: '1px solid var(--gold)', background: 'transparent', color: 'var(--gold)', cursor: 'pointer' }}>
          Recargar
        </button>
      </div>
    )
    return this.props.children
  }
}

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
const ChevronIcon = ({ open }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9" />
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
        border: checked ? '1px solid #C9A84C' : '1px solid var(--line)',
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
        fontFamily: "'KikiGotham', sans-serif", fontSize: 12, fontWeight: checked ? 400 : 300,
        color: checked ? 'var(--ink)' : 'var(--ink-mute)',
        letterSpacing: '0.03em', flex: 1, transition: 'color 0.18s',
      }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{
          fontFamily: "'KikiGotham', sans-serif", fontSize: 10,
          color: checked ? '#C9A84C' : 'var(--ink-faint)', transition: 'color 0.18s',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

const TIPO_OPTIONS = [
  { label: 'EDP',              value: 'Eau de Parfum'     },
  { label: 'EDT',              value: 'Eau de Toilette'   },
  { label: 'Parfum',           value: 'Parfum'            },
  { label: 'Elixir',           value: 'Elixir'            },
  { label: 'Extrait de Parfum',value: 'Extrait de Parfum' },
  { label: 'EDC',              value: 'Eau de Cologne'    },
]

const GENERO_OPTIONS = [
  { key: null,        label: 'Todos' },
  { key: 'Masculino', label: 'Hombre' },
  { key: 'Femenino',  label: 'Mujer' },
  { key: 'Unisex',    label: 'Unisex' },
]

const CATEGORIA_OPTIONS = [
  { key: 'arabes',    label: 'Árabes' },
  { key: 'disenador', label: 'Diseñador' },
  { key: 'nicho',     label: 'Nicho' },
]

function SidebarSection({ title, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line2)' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '13px 0', color: 'var(--ink-mute)',
        }}
      >
        <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase' }}>
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div style={{ paddingBottom: 12 }}>{children}</div>}
    </div>
  )
}

function PriceRangeSlider({ min, max, value, onChange, step = 5 }) {
  const [lo, hi] = value
  const pct = v => ((v - min) / (max - min)) * 100

  return (
    <div style={{ paddingBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'KikiGotham', sans-serif", fontSize: 11, letterSpacing: '0.04em', color: 'var(--ink-mute)', marginBottom: 14 }}>
        <span>${lo}</span>
        <span>${hi}{hi >= max ? '+' : ''}</span>
      </div>
      <div className="price-slider-track-wrap">
        <div className="price-slider-track" />
        <div
          className="price-slider-fill"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={lo}
          className="price-slider-input"
          onChange={e => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        />
        <input
          type="range" min={min} max={max} step={step} value={hi}
          className="price-slider-input"
          onChange={e => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        />
      </div>
    </div>
  )
}

function DesktopSidebar({ urlGenero, urlTipo, urlDdp, urlColeccion, navigate, selectedMarcas, toggleMarca, selectedTipos, toggleTipo, hasFilters, clearFilters, basePool, priceRange, setPriceRange, priceBounds }) {
  const [open, setOpen] = useState({ genero: true, categoria: true, concentracion: false, precio: true, marca: false, ocasion: false })
  const toggle = k => setOpen(s => ({ ...s, [k]: !s[k] }))

  const marcas = useMemo(() => [...new Set(basePool.map(p => p.house))].sort(), [basePool])

  function navGenero(key) {
    const p = new URLSearchParams()
    if (urlTipo) p.set('tipo', urlTipo)
    if (key) p.set('genero', key)
    if (urlColeccion) p.set('coleccion', urlColeccion)
    navigate(p.toString() ? `/tienda?${p}` : '/tienda')
  }

  function navCategoria(key) {
    const p = new URLSearchParams()
    if (urlTipo !== key) p.set('tipo', key)
    if (urlGenero) p.set('genero', urlGenero)
    if (urlColeccion) p.set('coleccion', urlColeccion)
    navigate(p.toString() ? `/tienda?${p}` : '/tienda')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 4, borderBottom: '1px solid var(--line2)' }}>
        <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink)' }}>
          Filtrar
        </span>
        {hasFilters && (
          <button onClick={clearFilters} style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Día del Padre */}
      <button
        onClick={() => navigate('/tienda?ddp=1')}
        style={{
          width: '100%', margin: '12px 0',
          fontFamily: "'KikiGotham', sans-serif", fontSize: 9.5,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '9px 12px', cursor: 'pointer', textAlign: 'left',
          border: `1px solid ${urlDdp ? '#1A52CC' : 'rgba(26,82,204,0.30)'}`,
          background: urlDdp ? 'rgba(26,82,204,0.08)' : 'transparent',
          color: urlDdp ? '#6B9FFF' : 'var(--ink-mute)',
          transition: 'all 0.18s',
        }}
      >
        🎁 Día del Padre
      </button>

      {/* Género */}
      <SidebarSection title="Género" open={open.genero} onToggle={() => toggle('genero')}>
        {GENERO_OPTIONS.map(({ key, label }) => {
          const active = !urlDdp && urlGenero === key
          return (
            <button
              key={label}
              onClick={() => navGenero(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'all 0.18s',
                background: active ? '#C9A84C' : 'transparent',
                border: `1px solid ${active ? '#C9A84C' : 'var(--line)'}`,
                boxShadow: active ? '0 0 0 2px rgba(201,168,76,0.18)' : 'none',
              }} />
              <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 12, fontWeight: active ? 400 : 300, color: active ? 'var(--ink)' : 'var(--ink-mute)', letterSpacing: '0.03em', transition: 'color 0.18s' }}>
                {label}
              </span>
            </button>
          )
        })}
      </SidebarSection>

      {/* Categoría */}
      <SidebarSection title="Categoría" open={open.categoria} onToggle={() => toggle('categoria')}>
        {CATEGORIA_OPTIONS.map(({ key, label }) => (
          <GoldCheckbox
            key={key}
            label={label}
            checked={urlTipo === key}
            onToggle={() => navCategoria(key)}
            count={basePool.filter(p => p.categoria === key).length}
          />
        ))}
      </SidebarSection>

      {/* Concentración */}
      <SidebarSection title="Concentración" open={open.concentracion} onToggle={() => toggle('concentracion')}>
        {TIPO_OPTIONS.filter(opt => basePool.some(p => p.tipo === opt.value)).map(opt => (
          <GoldCheckbox
            key={opt.value}
            label={opt.label}
            checked={selectedTipos.includes(opt.value)}
            onToggle={() => toggleTipo(opt.value)}
            count={basePool.filter(p => p.tipo === opt.value).length}
          />
        ))}
      </SidebarSection>

      {/* Por ocasión */}
      <SidebarSection title="Por ocasión" open={open.ocasion} onToggle={() => toggle('ocasion')}>
        <select
          value={urlColeccion || ''}
          onChange={e => {
            const p = new URLSearchParams()
            if (urlTipo) p.set('tipo', urlTipo)
            if (urlGenero) p.set('genero', urlGenero)
            if (e.target.value) p.set('coleccion', e.target.value)
            navigate(p.toString() ? `/tienda?${p}` : '/tienda')
          }}
          style={{
            width: '100%',
            fontFamily: "'KikiGotham', sans-serif", fontSize: 11, fontWeight: 100,
            color: urlColeccion ? 'var(--ink)' : 'var(--ink-mute)',
            background: 'var(--raised)', border: '1px solid var(--line)',
            padding: '8px 10px', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">Todas las ocasiones</option>
          {COLECCIONES.map(col => (
            <option key={col.key} value={col.key}>{col.emoji} {col.titulo}</option>
          ))}
        </select>
      </SidebarSection>

      {/* Precio */}
      {priceBounds[0] < priceBounds[1] && (
        <SidebarSection title="Precio" open={open.precio} onToggle={() => toggle('precio')}>
          <PriceRangeSlider
            min={priceBounds[0]} max={priceBounds[1]}
            value={priceRange}
            onChange={setPriceRange}
          />
        </SidebarSection>
      )}

      {/* Marca */}
      <SidebarSection title="Marca" open={open.marca} onToggle={() => toggle('marca')}>
        {marcas.map(m => (
          <GoldCheckbox
            key={m}
            label={m}
            checked={selectedMarcas.includes(m)}
            onToggle={() => toggleMarca(m)}
            count={basePool.filter(p => p.house === m).length}
          />
        ))}
      </SidebarSection>
    </div>
  )
}

function FilterPanel({ sortBy, setSortBy, selectedMarcas, toggleMarca, selectedTipos, toggleTipo, hasFilters, clearFilters, productPool, urlTipo, urlGenero, urlDdp, navigate, urlColeccion, priceRange, setPriceRange, priceBounds }) {
  const marcas = useMemo(() => {
    const set = new Set(productPool.map(p => p.house))
    return [...set].sort()
  }, [productPool])

  function countFor(house) {
    return productPool.filter(p => p.house === house).length
  }

  function countForTipo(tipo) {
    return productPool.filter(p => p.tipo === tipo).length
  }

  function navGenero(key) {
    const p = new URLSearchParams()
    if (urlTipo) p.set('tipo', urlTipo)
    if (key) p.set('genero', key)
    if (urlColeccion) p.set('coleccion', urlColeccion)
    navigate(p.toString() ? `/tienda?${p}` : '/tienda')
  }

  function RadioItem({ label, value }) {
    const active = sortBy === value
    return (
      <button
        onClick={() => startTransition(() => setSortBy(value))}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 0', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{
          width: 15, height: 15, flexShrink: 0,
          border: active ? '1px solid #C9A84C' : '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.18s',
        }}>
          {active && <span style={{ width: 6, height: 6, background: '#C9A84C' }}/>}
        </span>
        <span style={{
          fontFamily: "'KikiGotham', sans-serif", fontSize: 12, fontWeight: active ? 400 : 300,
          color: active ? 'var(--ink)' : 'var(--ink-mute)', transition: 'color 0.18s',
        }}>
          {label}
        </span>
      </button>
    )
  }

  const sectionLabel = (text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
      <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
        {text}
      </span>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'KikiGotham', sans-serif", fontSize: 22,
          fontWeight: 100, color: 'var(--ink)', fontStyle: 'italic', margin: 0,
        }}>
          Filtrar
        </h2>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            fontFamily: "'KikiGotham', sans-serif", fontSize: 9,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Género — solo en mobile drawer */}
      <div style={{ marginBottom: 24 }}>
        {sectionLabel('Género')}
        <button
          onClick={() => navigate('/tienda?ddp=1')}
          style={{
            width: '100%', marginBottom: 6,
            fontFamily: "'KikiGotham', sans-serif", fontSize: 9.5,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
            border: `1px solid ${urlDdp ? '#1A52CC' : 'rgba(26,82,204,0.30)'}`,
            background: urlDdp ? 'rgba(26,82,204,0.08)' : 'transparent',
            color: urlDdp ? '#6B9FFF' : 'var(--ink-mute)',
          }}
        >
          🎁 Día del Padre
        </button>
        {GENERO_OPTIONS.map(({ key, label }) => {
          const active = !urlDdp && urlGenero === key
          return (
            <button key={label} onClick={() => navGenero(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'all 0.18s',
                background: active ? '#C9A84C' : 'transparent',
                border: `1px solid ${active ? '#C9A84C' : 'var(--line)'}`,
              }} />
              <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 12, fontWeight: active ? 400 : 300, color: active ? 'var(--ink)' : 'var(--ink-mute)', letterSpacing: '0.03em' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--line2)', paddingTop: 20, marginBottom: 0 }}>
        {sectionLabel('Ordenar')}
        {SORT_OPTIONS.map(opt => <RadioItem key={opt.key} label={opt.label} value={opt.key}/>)}
      </div>

      <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--line2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Por ocasión
          </span>
        </div>
        <select
          value={urlColeccion || ''}
          onChange={e => {
            const p = new URLSearchParams()
            if (urlTipo) p.set('tipo', urlTipo)
            if (urlGenero) p.set('genero', urlGenero)
            if (e.target.value) p.set('coleccion', e.target.value)
            navigate(p.toString() ? `/tienda?${p}` : '/tienda')
          }}
          style={{
            width: '100%',
            fontFamily: "'KikiGotham', sans-serif", fontSize: 12, fontWeight: 100,
            color: urlColeccion ? 'var(--ink)' : 'var(--ink-mute)',
            background: 'var(--raised)', border: '1px solid var(--line)',
            padding: '9px 12px', cursor: 'pointer', outline: 'none',
            letterSpacing: '0.03em',
          }}
        >
          <option value="">Todas las ocasiones</option>
          {COLECCIONES.map(col => (
            <option key={col.key} value={col.key}>{col.emoji} {col.titulo}</option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--line2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Categoría
          </span>
        </div>
        {[
          { key: 'arabes',    label: 'Árabes' },
          { key: 'nicho',     label: 'Nicho' },
          { key: 'disenador', label: 'Diseñador' },
        ].map(({ key, label }) => (
          <GoldCheckbox
            key={key}
            label={label}
            checked={urlTipo === key}
            onToggle={() => {
              const p = new URLSearchParams()
              if (urlTipo !== key) p.set('tipo', key)
              if (urlGenero) p.set('genero', urlGenero)
              if (urlColeccion) p.set('coleccion', urlColeccion)
              navigate(p.toString() ? `/tienda?${p}` : '/tienda')
            }}
            count={productPool.filter(p => p.categoria === key).length}
          />
        ))}
      </div>

      <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--line2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Concentración
          </span>
        </div>
        {TIPO_OPTIONS.filter(opt => countForTipo(opt.value) > 0).map(opt => (
          <GoldCheckbox
            key={opt.value}
            label={opt.label}
            checked={selectedTipos.includes(opt.value)}
            onToggle={() => toggleTipo(opt.value)}
            count={countForTipo(opt.value)}
          />
        ))}
      </div>

      {priceBounds[0] < priceBounds[1] && (
        <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--line2)' }}>
          {sectionLabel('Precio')}
          <PriceRangeSlider
            min={priceBounds[0]} max={priceBounds[1]}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>
      )}

      <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--line2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 18, height: 1, background: '#C9A84C', flexShrink: 0 }}/>
          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C' }}>
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
  const products = useIndexProducts()
  const { theme } = useTheme()
  const { currency } = useCurrency()
  const isDark = theme === 'dark'
  const C = {
    bg:       isDark ? '#0A0A0A'               : '#EAE0CC',
    bg2:      isDark ? '#0E0C08'               : '#F2E9D6',
    ink:      isDark ? '#F7F2EA'               : '#1A1208',
    inkMute:  isDark ? 'rgba(247,242,234,0.5)' : 'rgba(35,26,13,0.80)',
    inkFaint: isDark ? 'rgba(247,242,234,0.3)' : 'rgba(35,26,13,0.58)',
    line:     isDark ? 'rgba(201,168,76,0.18)' : 'rgba(150,118,52,0.38)',
    line2:    isDark ? 'rgba(247,242,234,0.07)': 'rgba(35,26,13,0.15)',
    gold:     '#C9A84C',
    goldInk:  isDark ? '#E8C96A'               : '#6B5010',
    chip:     isDark ? 'rgba(247,242,234,0.05)': 'rgba(35,26,13,0.07)',
  }
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [, startTransition] = useTransition()
  const [sortBy, setSortBy]           = useState('featured')
  const [selectedMarcas, setSelectedMarcas] = useState([])
  const [selectedTipos, setSelectedTipos]   = useState([])
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [priceRange, setPriceRange]   = useState(() => {
    const lo = parseInt(searchParams.get('precioMin'))
    const hi = parseInt(searchParams.get('precioMax'))
    return (lo >= 0 && hi > 0) ? [lo, hi] : [0, 9999]
  })
  const [searchFocused, setSearchFocused] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const topRef    = useRef(null)
  const mountRef  = useRef(true)
  const sentinelRef = useRef(null)

  const urlGenero     = searchParams.get('genero')     || null
  const urlTipo       = searchParams.get('tipo')       || null
  const urlDdp        = searchParams.get('ddp') === '1'
  const urlColeccion  = searchParams.get('coleccion')  || null
  const coleccionData = urlColeccion ? coleccionById[urlColeccion] : null

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams.get('q')])

  useEffect(() => {
    setSelectedMarcas([])
    setSelectedTipos([])
    setPriceRange([0, 9999])
  }, [urlGenero, urlTipo])

  const toggleMarca = v => startTransition(() => setSelectedMarcas(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]))
  const toggleTipo  = v => startTransition(() => setSelectedTipos(p  => p.filter(x => x !== v).concat(p.includes(v) ? [] : [v])))

  const basePool = useMemo(() => {
    let pool = products.filter(p => p.ml !== 200 || !p.variantIds)
    if (urlDdp)        pool = pool.filter(p => diaDeLPadreIds.includes(p.id))
    if (urlGenero)     pool = pool.filter(p => p.genero === urlGenero)
    if (urlTipo)       pool = pool.filter(p => p.categoria === urlTipo)
    if (coleccionData) pool = pool.filter(p => coleccionData.ids.includes(p.id))
    return pool
  }, [urlGenero, urlTipo, urlDdp, coleccionData])

  const priceBounds = useMemo(() => {
    const prices = basePool.map(p => p.precioUSD).filter(v => v > 0)
    if (!prices.length) return [0, 200]
    return [Math.floor(Math.min(...prices) / 5) * 5, Math.ceil(Math.max(...prices) / 5) * 5]
  }, [basePool])

  useEffect(() => {
    const lo = parseInt(searchParams.get('precioMin'))
    const hi = parseInt(searchParams.get('precioMax'))
    if (lo >= 0 && hi > 0 && lo >= priceBounds[0] && hi <= priceBounds[1]) {
      setPriceRange([lo, hi])
    } else {
      setPriceRange(priceBounds)
    }
  }, [priceBounds[0], priceBounds[1]])

  function handlePriceChange(newRange) {
    setPriceRange(newRange)
    const params = new URLSearchParams(searchParams)
    if (newRange[0] === priceBounds[0] && newRange[1] === priceBounds[1]) {
      params.delete('precioMin')
      params.delete('precioMax')
    } else {
      params.set('precioMin', newRange[0])
      params.set('precioMax', newRange[1])
    }
    setSearchParams(params, { replace: true })
  }

  const isPriceFiltered = priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1]
  const hasFilters = selectedMarcas.length > 0 || selectedTipos.length > 0 || sortBy !== 'featured' || isPriceFiltered
  const clearFilters = () => {
    setSortBy('featured'); setSelectedMarcas([]); setSelectedTipos([])
    setPriceRange(priceBounds)
    const params = new URLSearchParams(searchParams)
    params.delete('precioMin'); params.delete('precioMax')
    setSearchParams(params, { replace: true })
  }
  const activeFilterCount = selectedMarcas.length + selectedTipos.length + (sortBy !== 'featured' ? 1 : 0) + (urlTipo ? 1 : 0) + (urlDdp ? 1 : 0) + (urlColeccion ? 1 : 0)

  const filtered = useMemo(() => {
    let result = [...basePool]
    if (selectedMarcas.length) result = result.filter(p => selectedMarcas.includes(p.house))
    if (selectedTipos.length)  result = result.filter(p => selectedTipos.includes(p.tipo))
    if (isPriceFiltered) result = result.filter(p => (p.precioUSD || 0) >= priceRange[0] && (p.precioUSD || 0) <= priceRange[1])
    if (searchQuery.trim()) {
      const terms = norm(searchQuery.trim()).split(/\s+/).filter(Boolean)
      result = result.filter(p => productMatchesQuery(terms, [
        norm(p.name),
        norm(p.house),
        norm(p.familia),
        norm(notesLookup[p.id]),
      ]))
    }
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'name-desc')  result.sort((a, b) => b.name.localeCompare(a.name))
    if (sortBy === 'price-asc')  result.sort((a, b) => (a.precioUSD || 9999) - (b.precioUSD || 9999))
    if (sortBy === 'price-desc') result.sort((a, b) => (b.precioUSD || 0) - (a.precioUSD || 0))
    return result
  }, [basePool, selectedMarcas, selectedTipos, searchQuery, sortBy, priceRange, priceBounds])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filtered])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [filtered.length, visibleCount])

  useEffect(() => {
    if (mountRef.current) { mountRef.current = false; return }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sortBy, selectedMarcas, searchQuery, urlGenero])

  const LABEL_MAP   = { Masculino: 'Hombre', Femenino: 'Mujer', Unisex: 'Unisex' }
  const TIPO_MAP    = { arabes: 'Árabes', disenador: 'Diseñador', nicho: 'Nicho' }
  const sectionTitle = [
    urlTipo   ? TIPO_MAP[urlTipo]     : null,
    urlGenero ? LABEL_MAP[urlGenero]  : null,
  ].filter(Boolean).join(' · ') || 'Fragancias'

  const filterProps = { sortBy, setSortBy, selectedMarcas, toggleMarca, selectedTipos, toggleTipo, hasFilters, clearFilters, productPool: basePool, urlTipo, urlGenero, urlDdp, navigate, urlColeccion, priceRange, setPriceRange: handlePriceChange, priceBounds }
  const sidebarProps = { urlGenero, urlTipo, urlDdp, urlColeccion, navigate, selectedMarcas, toggleMarca, selectedTipos, toggleTipo, hasFilters, clearFilters, basePool, priceRange, setPriceRange: handlePriceChange, priceBounds }

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const BANNER_IMG = {
    'Masculino': '/BANNERTIENDAHOMBRE.webp',
    'Femenino':  '/BANNERTIENDAMUJER.webp',
    'Unisex':    '/BANNERTIENDAUNISEX.webp',
  }
  const bannerSrc = BANNER_IMG[urlGenero] || '/BANNERTIENDA.webp'

  return (
    <>
      <div ref={topRef} style={{ background: C.bg, minHeight: '100dvh', paddingTop: 'calc(var(--bar-h, 0px) + var(--kiki-header-h, 76px))' }}>
        <div style={{ position: 'relative', width: '100%', height: 'clamp(200px, 28vw, 360px)', overflow: 'hidden' }}>
          <img
            src={bannerSrc}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,4,0.75) 0%, rgba(10,8,4,0.20) 50%, rgba(10,8,4,0.05) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 'clamp(24px, 4vw, 48px)', gap: 8 }}>
            <h1 style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 'clamp(36px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 200, color: 'rgba(247,242,234,0.95)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1 }}>
              {sectionTitle}
            </h1>
            <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, fontWeight: 400, color: 'rgba(247,242,234,0.50)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
            </span>
          </div>
        </div>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="tienda-layout">

            {/* === SIDEBAR DESKTOP === */}
            <aside className="tienda-sidebar-desktop">
              <DesktopSidebar {...sidebarProps} />
            </aside>

            {/* === CONTENIDO PRINCIPAL === */}
            <div className="tienda-main">

              {/* Barra superior — desktop */}
              <div className="tienda-topbar-desktop tienda-main-pad">
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '0.05em' }}>
                  {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
                    Ordenar
                  </span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{
                      fontFamily: "'KikiGotham', sans-serif", fontSize: 11, fontWeight: 300,
                      color: 'var(--ink)', background: 'var(--raised)',
                      border: '1px solid var(--line)', padding: '6px 10px',
                      cursor: 'pointer', outline: 'none', letterSpacing: '0.03em',
                    }}
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Barra Filtrar | Ordenar — mobile */}
              <div className="tienda-mobile-bar tienda-mobile-only">
                <button
                  className="tienda-mobile-bar-btn"
                  onClick={() => setDrawerOpen(true)}
                >
                  <FilterIcon />
                  <span>Filtrar</span>
                  {activeFilterCount > 0 && (
                    <span className="tienda-mobile-bar-badge">{activeFilterCount}</span>
                  )}
                </button>
                <div className="tienda-mobile-bar-sep" />
                <div className="tienda-mobile-bar-sort">
                  <span className="tienda-mobile-bar-sort-label">Ordenar</span>
                  <ChevronIcon open={false} />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="tienda-mobile-bar-sort-select"
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Conteo — mobile */}
              <div className="tienda-pad tienda-mobile-only" style={{ paddingTop: 14, paddingBottom: 4 }}>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>
                  {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'}
                  {sectionTitle !== 'Fragancias' && ` · ${sectionTitle}`}
                </span>
              </div>

              {/* Banner colección activa */}
              {coleccionData && (
                <div className="tienda-coleccion-banner tienda-pad">
                  <span>{coleccionData.emoji} {coleccionData.titulo}</span>
                  <a href="/tienda" onClick={e => { e.preventDefault(); navigate('/tienda') }}>
                    Ver toda la tienda ×
                  </a>
                </div>
              )}

              {/* Buscador */}
              <div
                className="tienda-pad tienda-search-desktop"
                style={{ marginBottom: 28, animation: 'vitrina-fadein 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: `1px solid ${searchFocused ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
                  background: 'var(--raised)', padding: '0 16px', gap: 12,
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ color: searchFocused ? '#C9A84C' : 'var(--ink-faint)', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>
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
                      flex: 1, fontFamily: "'KikiGotham', sans-serif", fontSize: 13, fontWeight: 100,
                      color: 'var(--ink)', background: 'none', border: 'none', outline: 'none',
                      padding: '12px 0', letterSpacing: '0.02em',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', display: 'flex', padding: 4 }}
                      aria-label="Limpiar búsqueda"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de productos */}
              <div className="tienda-main-pad" style={{ paddingBottom: 80 }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 26, color: 'var(--ink-mute)', fontStyle: 'italic', marginBottom: 8 }}>
                      No encontramos esa fragancia
                    </p>
                    <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 13, color: 'var(--ink-faint)', marginBottom: 28 }}>
                      Intenta con otros filtros
                    </p>
                    <button
                      onClick={clearFilters}
                      style={{
                        fontFamily: "'KikiGotham', sans-serif", fontSize: 11,
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
                    <GridBoundary>
                      <div className="vitrina-grid">
                        {visibleProducts.map((product, index) => (
                          <div
                            key={product.id}
                            style={{
                              animation: 'vitrina-fadein 0.35s ease both',
                              animationDelay: `${Math.min(index * 0.03, 0.18)}s`,
                            }}
                          >
                            <VitrinaCard
                              product={product}
                              ribbon={currency === 'usd' ? (
                                diaDeLPadreIds.includes(product.id)
                                  ? (diaDeLPadreDiscounts[product.id] ? `${diaDeLPadreDiscounts[product.id]}% EXTRA · DÍA DEL PADRE` : 'DÍA DEL PADRE')
                                  : product.precioUSD > 0 ? 'Promo en divisa' : null
                              ) : null}
                              ribbonVariant={currency === 'usd' && diaDeLPadreIds.includes(product.id) ? 'ddp' : null}
                              discount={diaDeLPadreIds.includes(product.id) && currency === 'usd' ? diaDeLPadreDiscounts[product.id] : null}
                            />
                          </div>
                        ))}
                      </div>
                    </GridBoundary>

                    {hasMore && <div ref={sentinelRef} style={{ height: 1, marginTop: 40 }} />}

                    {hasMore && (
                      <div style={{ textAlign: 'center', padding: '32px 0', opacity: 0.4 }}>
                        <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                          Cargando más…
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Backdrop drawer (mobile) */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 99,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Drawer de filtros (mobile) */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 300, maxWidth: '88vw',
          background: C.bg, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: 60,
          borderBottom: '1px solid var(--line2)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', fontWeight: 100 }}>
            Filtros
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', padding: 4, display: 'flex' }}
          >
            <CloseIcon />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
          <FilterPanel {...filterProps} />
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line2)', flexShrink: 0 }}>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: '100%', background: '#C9A84C', color: '#0A0A0A', border: 'none',
              padding: 14, fontFamily: "'KikiGotham', sans-serif",
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 100, cursor: 'pointer',
            }}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  )
}
