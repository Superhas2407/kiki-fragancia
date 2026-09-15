import { useTheme } from '../context/ThemeContext'

/**
 * HalloweenDecor — capa decorativa del tema 🎃 (admin-only, ver ThemeContext.jsx
 * y el botón 🎃 en Header.jsx). Telarañas en las esquinas, murciélagos flotando
 * y una mano esquelética asomando abajo. Todo `pointer-events: none` y
 * `aria-hidden` — nunca bloquea clicks ni interfiere con lectores de pantalla.
 * Se auto-oculta (`return null`) salvo que `theme === 'halloween'`.
 */

/* Exportada para poder clavar una telaraña puntual en otros componentes
   (ProductDetail, VitrinaCard) cuando theme === 'halloween', sin duplicar el SVG. */
export const Cobweb = ({ style, className }) => (
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
    {/* araña chiquita — cuerpo relleno en verde tóxico, no solo cream (pedido explícito:
        el verde también como relleno, no solo líneas/bordes) */}
    <g transform="translate(30,30)" fill="var(--gold-alt)" opacity="0.75">
      <circle r="3.4" />
      <circle cy="-4.6" r="2.2" />
      <g stroke="var(--gold-alt)" strokeWidth="0.8">
        <path d="M-3 -1 L-7 -3 M3 -1 L7 -3 M-3 1 L-7 3 M3 1 L7 3 M-2.5 -2.5 L-5 -6 M2.5 -2.5 L5 -6" />
      </g>
    </g>
  </svg>
)

/* Silueta de murciélago clásica: cuerpo ovalado + orejas puntudas en el centro,
   dos alas por lado con lóbulos sólidos y bien definidos (a propósito, NADA de
   líneas finas radiales tipo araña — esa era la confusión con el diseño viejo). */
const Bat = ({ style }) => (
  <svg viewBox="0 0 60 30" width="100%" height="100%" style={style} aria-hidden="true">
    {/* ala izquierda */}
    <path
      d="M27,15 C20,8 10,4 2,2 C8,10 13,13 13,16 C7,17 2,19 0,23 C10,22 19,19 26,18 Z"
      fill="currentColor"
    />
    {/* ala derecha (espejo) */}
    <path
      d="M33,15 C40,8 50,4 58,2 C52,10 47,13 47,16 C53,17 58,19 60,23 C50,22 41,19 34,18 Z"
      fill="currentColor"
    />
    {/* cuerpo */}
    <ellipse cx="30" cy="17" rx="3.2" ry="6" fill="currentColor" />
    {/* orejas */}
    <path d="M26.5,13 L27.5,6 L30,12 Z" fill="currentColor" />
    <path d="M33.5,13 L32.5,6 L30,12 Z" fill="currentColor" />
    {/* ojitos verde tóxico con glow — único detalle en --gold-alt, para que no se
        pierda contra el naranja del fondo aunque el bicho sea chico en pantalla */}
    <circle cx="28.3" cy="15.5" r="2.6" fill="var(--gold-alt)" opacity="0.45" />
    <circle cx="31.7" cy="15.5" r="2.6" fill="var(--gold-alt)" opacity="0.45" />
    <circle cx="28.3" cy="15.5" r="1.1" fill="var(--gold-alt)" />
    <circle cx="31.7" cy="15.5" r="1.1" fill="var(--gold-alt)" />
  </svg>
)

const Moon = ({ style, className }) => (
  <svg viewBox="0 0 60 60" width="60" height="60" style={style} className={className} aria-hidden="true">
    <path
      d="M38 6 C24 6 12 18 12 32 C12 46 24 58 38 58 C28 54 21 44 21 32 C21 20 28 10 38 6 Z"
      fill="var(--gold-alt)"
      opacity="0.55"
    />
  </svg>
)

const Pumpkin = ({ style, className }) => (
  <svg viewBox="0 0 80 76" width="80" height="76" style={style} className={className} aria-hidden="true">
    {/* tallo — relleno verde (color natural de tallo de calabaza, de paso suma más verde-relleno) */}
    <path d="M38 10 C36 4 42 2 44 6 C45 9 41 12 38 10 Z" fill="var(--gold-alt)" opacity="0.65" />
    {/* cuerpo — 3 gajos superpuestos */}
    <ellipse cx="24" cy="42" rx="15" ry="24" fill="var(--gold)" opacity="0.5" />
    <ellipse cx="56" cy="42" rx="15" ry="24" fill="var(--gold)" opacity="0.5" />
    <ellipse cx="40" cy="42" rx="17" ry="26" fill="var(--gold)" opacity="0.75" />
    {/* cara tallada — glow verde */}
    <g fill="var(--gold-alt)">
      <path d="M31 36 L37 36 L34 44 Z" opacity="0.9" />
      <path d="M43 36 L49 36 L46 44 Z" opacity="0.9" />
      <path d="M27 54 C33 60 47 60 53 54 C48 58 32 58 27 54 Z" opacity="0.9" />
    </g>
  </svg>
)

const SkeletonHand = ({ style, className }) => (
  <svg viewBox="0 0 100 120" width="100" height="120" style={style} className={className} aria-hidden="true">
    <g fill="none" stroke="rgba(245,233,216,0.55)" strokeWidth="4" strokeLinecap="round">
      {/* palma / muñeca */}
      <path d="M50 120 L50 78" />
      <path d="M36 120 L38 80" />
      <path d="M64 120 L62 80" />
      {/* dedos — 2 de las 5 "uñas" en verde tóxico relleno (glow de descomposición),
          el resto se queda cream para no perder legibilidad de la silueta */}
      <path d="M50 78 C50 60, 46 48, 44 30" />
      <circle cx="44" cy="30" r="3.4" fill="var(--gold-alt)" stroke="none" opacity="0.85" />
      <path d="M38 80 C34 64, 32 50, 28 36" />
      <circle cx="28" cy="36" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M62 80 C64 64, 66 50, 68 34" />
      <circle cx="68" cy="34" r="3" fill="rgba(245,233,216,0.55)" stroke="none" />
      <path d="M28 82 C20 70, 16 60, 12 50" />
      <circle cx="12" cy="50" r="3.4" fill="var(--gold-alt)" stroke="none" opacity="0.85" />
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
      <Cobweb className="hwd-cobweb hwd-cobweb-br" style={{ position: 'fixed', bottom: 0, right: 0, transform: 'rotate(180deg)' }} />

      <Moon className="hwd-moon" style={{ position: 'fixed', top: '6%', right: '8%' }} />
      <Pumpkin className="hwd-pumpkin" style={{ position: 'fixed', bottom: -4, right: 16 }} />

      <div className="hwd-bat hwd-bat-1"><div className="hwd-bat-flap"><Bat /></div></div>
      <div className="hwd-bat hwd-bat-2"><div className="hwd-bat-flap"><Bat /></div></div>
      <div className="hwd-bat hwd-bat-3"><div className="hwd-bat-flap"><Bat /></div></div>
      <div className="hwd-bat hwd-bat-4"><div className="hwd-bat-flap"><Bat /></div></div>

      <SkeletonHand className="hwd-skeleton-hand" style={{ position: 'fixed', bottom: -8, left: 18 }} />
    </div>
  )
}
