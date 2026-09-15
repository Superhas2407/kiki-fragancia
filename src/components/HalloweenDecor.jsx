import { useId } from 'react'
import { useTheme } from '../context/ThemeContext'

/**
 * HalloweenDecor — capa decorativa del tema 🎃 (admin-only, ver ThemeContext.jsx
 * y el botón 🎃 en Header.jsx). Slime en las esquinas, murciélagos flotando
 * y una mano esquelética asomando abajo. Todo `pointer-events: none` y
 * `aria-hidden` — nunca bloquea clicks ni interfiere con lectores de pantalla.
 * Se auto-oculta (`return null`) salvo que `theme === 'halloween'`.
 */

/* Exportado para poder clavar un chorretón de slime puntual en otros componentes
   (ProductDetail, VitrinaCard) cuando theme === 'halloween', sin duplicar el SVG.
   Reemplaza el diseño viejo de telaraña (feedback: "no me convencen las
   telarañas, algo tipo slime"). `useId()` evita que el <linearGradient>
   choque cuando el componente se repite muchas veces en una misma página
   (ej. una telaraña—ahora slime—por card en la grilla de Tienda). */
export const SlimeDrip = ({ style, className }) => {
  const gradId = `slime-grad-${useId()}`
  return (
    <svg viewBox="0 0 140 140" width="140" height="140" style={style} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold-alt)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--gold-alt)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* masa de slime pegada a la esquina */}
      <path
        d="M0,0 L60,0 C65,7 58,16 49,13 C52,22 41,27 34,20 C32,29 19,29 15,20 C9,27 1,22 0,15 Z"
        fill={`url(#${gradId})`}
      />
      {/* chorretones colgando, largos distintos */}
      <path d="M9,17 C4,28 4,44 9,53 C14,44 14,28 9,17 Z" fill={`url(#${gradId})`} />
      <path d="M24,21 C18,37 18,60 24,71 C30,60 30,37 24,21 Z" fill={`url(#${gradId})`} />
      <circle cx="24" cy="80" r="4.5" fill="var(--gold-alt)" opacity="0.65" />
      <path d="M41,14 C36,24 36,35 41,42 C46,35 46,24 41,14 Z" fill={`url(#${gradId})`} />
      <path d="M56,3 C51,12 51,23 56,30 C61,23 61,12 56,3 Z" fill={`url(#${gradId})`} />
      <circle cx="56" cy="37" r="3.5" fill="var(--gold-alt)" opacity="0.6" />
      {/* brillo gelatinoso */}
      <ellipse cx="15" cy="7" rx="7" ry="3" fill="rgba(255,255,255,0.55)" transform="rotate(-28 15 7)" />
      <ellipse cx="24" cy="30" rx="2.2" ry="6" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

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
      <SlimeDrip className="hwd-slime" style={{ position: 'fixed', top: 0, left: 0 }} />
      <SlimeDrip className="hwd-slime" style={{ position: 'fixed', top: 0, right: 0, transform: 'scaleX(-1)' }} />
      <SlimeDrip className="hwd-slime hwd-slime-br" style={{ position: 'fixed', bottom: 0, right: 0, transform: 'rotate(180deg)' }} />

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
