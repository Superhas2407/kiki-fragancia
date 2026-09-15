import { useTheme } from '../context/ThemeContext'

/**
 * HalloweenDecor — capa decorativa del tema 🎃 (admin-only, ver ThemeContext.jsx
 * y el botón 🎃 en Header.jsx). Telarañas en las esquinas, murciélagos flotando
 * y una mano esquelética asomando abajo. Todo `pointer-events: none` y
 * `aria-hidden` — nunca bloquea clicks ni interfiere con lectores de pantalla.
 * Se auto-oculta (`return null`) salvo que `theme === 'halloween'`.
 */

const Cobweb = ({ style, className }) => (
  <svg viewBox="0 0 140 140" width="140" height="140" style={style} className={className} aria-hidden="true">
    <g fill="none" stroke="rgba(245,233,216,0.38)" strokeWidth="1">
      {/* radios */}
      <path d="M0 0 L140 140" />
      <path d="M0 46 L94 140" />
      <path d="M0 93 L47 140" />
      <path d="M46 0 L140 94" />
      <path d="M93 0 L140 47" />
      <path d="M0 0 L140 0" opacity="0" />
      {/* arcos concéntricos */}
      <path d="M14 0 C14 8, 8 14, 0 14" />
      <path d="M34 0 C34 20, 20 34, 0 34" />
      <path d="M58 0 C58 34, 34 58, 0 58" />
      <path d="M86 0 C86 50, 50 86, 0 86" />
      <path d="M116 0 C116 68, 68 116, 0 116" />
    </g>
    {/* araña chiquita */}
    <g transform="translate(30,30)" fill="rgba(245,233,216,0.5)">
      <circle r="3.4" />
      <circle cy="-4.6" r="2.2" />
      <g stroke="rgba(245,233,216,0.5)" strokeWidth="0.8">
        <path d="M-3 -1 L-7 -3 M3 -1 L7 -3 M-3 1 L-7 3 M3 1 L7 3 M-2.5 -2.5 L-5 -6 M2.5 -2.5 L5 -6" />
      </g>
    </g>
  </svg>
)

const Bat = ({ style }) => (
  <svg viewBox="0 0 48 24" width="100%" height="100%" style={style} aria-hidden="true">
    <path
      d="M24 8
         C21 2, 14 0, 8 3
         C11 5, 13 7, 14 9
         C9 7, 3 6, 0 9
         C4 10, 9 12, 13 12
         C9 14, 5 17, 4 21
         C9 18, 14 15, 18 14
         C20 16, 22 17, 24 17
         C26 17, 28 16, 30 14
         C34 15, 39 18, 44 21
         C43 17, 39 14, 35 12
         C39 12, 44 10, 48 9
         C45 6, 39 7, 34 9
         C35 7, 37 5, 40 3
         C34 0, 27 2, 24 8 Z"
      fill="currentColor"
    />
    {/* ojitos verde tóxico con glow — el único detalle en --gold-alt del murciélago, para
        que no se pierda contra el naranja del fondo (el bicho es chico, así que el glow
        ayuda a que el punto verde se note aunque el círculo mida menos de 1px renderizado) */}
    <circle cx="21.5" cy="8" r="2.4" fill="var(--gold-alt)" opacity="0.45" />
    <circle cx="26.5" cy="8" r="2.4" fill="var(--gold-alt)" opacity="0.45" />
    <circle cx="21.5" cy="8" r="1" fill="var(--gold-alt)" />
    <circle cx="26.5" cy="8" r="1" fill="var(--gold-alt)" />
  </svg>
)

const SkeletonHand = ({ style, className }) => (
  <svg viewBox="0 0 100 120" width="100" height="120" style={style} className={className} aria-hidden="true">
    <g fill="none" stroke="rgba(245,233,216,0.55)" strokeWidth="4" strokeLinecap="round">
      {/* palma / muñeca */}
      <path d="M50 120 L50 78" />
      <path d="M36 120 L38 80" />
      <path d="M64 120 L62 80" />
      {/* dedos */}
      <path d="M50 78 C50 60, 46 48, 44 30" />
      <circle cx="44" cy="30" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M38 80 C34 64, 32 50, 28 36" />
      <circle cx="28" cy="36" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M62 80 C64 64, 66 50, 68 34" />
      <circle cx="68" cy="34" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M28 82 C20 70, 16 60, 12 50" />
      <circle cx="12" cy="50" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M72 82 C80 72, 84 64, 88 56" />
      <circle cx="88" cy="56" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
    </g>
  </svg>
)

export default function HalloweenDecor() {
  const { theme } = useTheme()
  if (theme !== 'halloween') return null

  return (
    <div className="hwd-layer" aria-hidden="true">
      <Cobweb className="hwd-cobweb" style={{ position: 'fixed', top: 0, left: 0 }} />
      <Cobweb className="hwd-cobweb" style={{ position: 'fixed', top: 0, right: 0, transform: 'scaleX(-1)' }} />

      <div className="hwd-bat hwd-bat-1"><div className="hwd-bat-flap"><Bat /></div></div>
      <div className="hwd-bat hwd-bat-2"><div className="hwd-bat-flap"><Bat /></div></div>
      <div className="hwd-bat hwd-bat-3"><div className="hwd-bat-flap"><Bat /></div></div>

      <SkeletonHand className="hwd-skeleton-hand" style={{ position: 'fixed', bottom: -8, left: 18 }} />
    </div>
  )
}
