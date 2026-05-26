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
const ArabeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
)
const DisenadorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const NichoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"/>
  </svg>
)

const GENERO_ITEMS = [
  { key: 'Masculino', label: 'Hombre',  icon: <MenIcon />    },
  { key: 'Femenino',  label: 'Mujer',   icon: <WomenIcon />  },
  { key: 'Unisex',    label: 'Unisex',  icon: <UnisexIcon /> },
  { key: 'Niño',      label: 'Kids',    icon: <KidsIcon />   },
]

const TIPO_ITEMS = [
  { key: 'arabes',    label: 'Árabes',    icon: <ArabeIcon />     },
  { key: 'disenador', label: 'Diseñador', icon: <DisenadorIcon /> },
  { key: 'nicho',     label: 'Nicho',     icon: <NichoIcon />     },
]

export default function GlobalSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname !== '/tienda') return null

  const params = new URLSearchParams(location.search)
  const activeGenero = params.get('genero') || null
  const activeTipo   = params.get('tipo')   || null

  function handleGenero(key) {
    const p = new URLSearchParams()
    if (activeTipo) p.set('tipo', activeTipo)
    if (key) p.set('genero', key)
    navigate(p.toString() ? `/tienda?${p}` : '/tienda')
  }

  function handleTipo(key) {
    const p = new URLSearchParams()
    if (activeGenero) p.set('genero', activeGenero)
    p.set('tipo', key)
    navigate(`/tienda?${p}`)
  }

  function handleAll() {
    navigate('/tienda')
  }

  const isAll = !activeGenero && !activeTipo

  return (
    <aside className="global-sidebar">
      <div className="global-sidebar-inner">

        {/* Colección */}
        <span className="global-sidebar-label">Colección</span>
        <nav style={{ marginBottom: 0 }}>
          <button
            onClick={handleAll}
            className={`global-sidebar-link${isAll ? ' active' : ''}`}
          >
            <span className="global-sidebar-icon"><AllIcon /></span>
            <span className="global-sidebar-text">Todas las fragancias</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="global-sidebar-divider" />

        {/* Género */}
        <span className="global-sidebar-label">Género</span>
        <nav style={{ marginBottom: 0 }}>
          {GENERO_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => handleGenero(item.key)}
              className={`global-sidebar-link${activeGenero === item.key ? ' active' : ''}`}
            >
              <span className="global-sidebar-icon">{item.icon}</span>
              <span className="global-sidebar-text">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="global-sidebar-divider" />

        {/* Tipo */}
        <span className="global-sidebar-label">Tipo</span>
        <nav>
          {TIPO_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => handleTipo(item.key)}
              className={`global-sidebar-link${activeTipo === item.key ? ' active' : ''}`}
            >
              <span className="global-sidebar-icon">{item.icon}</span>
              <span className="global-sidebar-text">{item.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </aside>
  )
}
