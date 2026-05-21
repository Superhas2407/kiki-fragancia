import { useNavigate, useLocation } from 'react-router-dom'

const AllIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const MenIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const WomenIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="7" r="4"/><line x1="12" y1="11" x2="12" y2="20"/><line x1="9" y1="16" x2="15" y2="16"/>
  </svg>
)
const UnisexIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="10" cy="8" r="3.5"/><circle cx="16" cy="8" r="3.5"/><path d="M5 20c0-3 2.5-5 5-5s5 2 5 5"/>
  </svg>
)
const KidsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="7" r="3"/><path d="M5 21c0-3 3-5 7-5s7 2 7 5"/>
  </svg>
)

const NAV_ITEMS = [
  { key: null,        label: 'Todas las fragancias', icon: <AllIcon />    },
  { key: 'Masculino', label: 'Hombre',               icon: <MenIcon />   },
  { key: 'Femenino',  label: 'Mujer',                icon: <WomenIcon /> },
  { key: 'Unisex',    label: 'Unisex',               icon: <UnisexIcon />},
  { key: 'Niño',      label: 'Kids',                 icon: <KidsIcon />  },
]

export default function GlobalSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Only show on /tienda (exact) — not on landing or product detail
  if (location.pathname !== '/tienda') return null

  // Detect active item from URL search params
  const params = new URLSearchParams(location.search)
  const activeGenero = params.get('genero') || null

  function handleNav(key) {
    if (key === null) {
      navigate('/tienda')
    } else {
      navigate(`/tienda?genero=${key}`)
    }
  }

  const onTienda = true

  return (
    <aside className="global-sidebar">
      <div className="global-sidebar-inner">
        <span className="global-sidebar-label">Colección</span>
        <nav>
          {NAV_ITEMS.map(item => {
            const isActive = onTienda && item.key === activeGenero
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.key)}
                className={`global-sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="global-sidebar-icon">{item.icon}</span>
                <span className="global-sidebar-text">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
