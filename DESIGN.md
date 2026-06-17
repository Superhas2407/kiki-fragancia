# KiKi Fragancia — Design System

Perfumería de lujo venezolana. Ultra-premium, editorial, dark-first con modo claro (warm).

---

## Principios

1. **Dark-first.** El modo oscuro es el default. El modo claro (warm) es alternativo — todos los colores deben funcionar en ambos.
2. **Una tipografía, dos roles.** Solo existe KikiGotham. Nunca usar Inter, Roboto, Arial, system-ui.
3. **Gold como acento único.** `--gold` es el único color de acento. No agregar azules, verdes ni morados.
4. **Una función por sección.** Cada bloque de la landing tiene un trabajo. No agregar secciones decorativas.
5. **Sin cards en hero.** El hero es una composición, no un dashboard.
6. **Colores siempre vía variables.** Nunca hardcodear `#F7F2EA`, `rgba(250,250,248,...)`, `#0A0A0A` en JSX. Usar `var(--ink)`, `var(--bg)`, etc.

---

## Tipografía

| Token | Valor | Uso |
|---|---|---|
| `--font-d` | `'KikiGotham', sans-serif` | Display / headlines / italic |
| `--font-s` | `'KikiGotham', sans-serif` | Sans / UI labels / navigation |

**Una sola fuente: KikiGotham** (`src/assets/GothamThin.otf`, `font-weight: 100 900`).
- `--font-d`: uso italic, peso 100–200, `letter-spacing: -0.01em`
- `--font-s`: uso uppercase, peso 300–400, `letter-spacing: 0.08–0.25em`

### Escala tipográfica usada

| Uso | Tamaño | Token |
|---|---|---|
| Hero headline | `clamp(40px, 6vw, 88px)` | `--font-d` |
| Sección grande | `clamp(26px, 4.5vw, 56px)` | `--font-d` |
| Número colección | `clamp(64px, 10vw, 120px)` | directo |
| Heading sección | `clamp(20px, 3vw, 32px)` | `--font-d` |
| Body texto | `clamp(15px, 1.3vw, 19px)` | `--font-d` |
| Label uppercase | `9–11px` | `--font-s` + `letter-spacing: 0.22em` |
| Precio producto | `22–26px` | `--font-d` |
| Eyebrow | `9–10px` | `--font-s` + `letter-spacing: 0.25–0.30em` + uppercase |

---

## Colores — Tokens CSS

### Dark mode (`:root`, default)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0A0A0A` | Fondo principal |
| `--bg2` | `#0E0C08` | Fondo elevado (drawers, modales) |
| `--bg-warm` | `#140E06` | Fondo cálido oscuro (secciones interiores) |
| `--raised` | `#15110A` | Superficies elevadas sutiles |
| `--ink` | `#F7F2EA` | Texto principal |
| `--ink-mute` | `rgba(247,242,234,0.60)` | Texto secundario |
| `--ink-faint` | `rgba(247,242,234,0.30)` | Texto terciario / placeholder |
| `--line` | `rgba(201,168,76,0.18)` | Bordes dorados sutiles |
| `--line2` | `rgba(247,242,234,0.10)` | Bordes neutros |
| `--gold` | `#C9A84C` | Acento principal (gold) |
| `--gold-ink` | `#E8C96A` | Gold sobre fondo oscuro (más brillante) |
| `--gold-fill-ink` | `#0A0A0A` | Texto sobre fondo gold |
| `--photo-floor` | `rgba(8,5,2,0.55)` | Overlay oscuro sobre fotos |
| `--chip` | `rgba(247,242,234,0.05)` | Fondo chips / tags |
| `--shadow` | `0 24px 60px -28px rgba(0,0,0,0.8)` | Sombra de cards |

### Warm mode (`[data-theme='warm']`)

| Token | Valor dark | Valor warm |
|---|---|---|
| `--bg` | `#0A0A0A` | `#EAE0CC` |
| `--bg2` | `#0E0C08` | `#F2E9D6` |
| `--ink` | `#F7F2EA` | `#1A1208` |
| `--ink-mute` | `rgba(247,242,234,0.60)` | `rgba(35,26,13,0.80)` |
| `--gold` | `#C9A84C` | `#9A6820` |
| `--gold-ink` | `#E8C96A` | `#6B4012` |

**Regla:** Todo color hardcodeado que sea blanco/crema o negro rompe el warm mode. Siempre usar tokens.

---

## Dos sistemas CSS en el mismo proyecto

Este proyecto tiene **dos sistemas CSS coexistiendo**. No mezclarlos en componentes nuevos.

| Sistema | Archivos | Clases |
|---|---|---|
| **KiKi custom** | `src/index.css` | `.kiki-header`, `.pd-page`, `.brand-story-*`, `.vitrina-*`, `.hero-*`, etc. |
| **Tailwind v4** | via `@import "tailwindcss"` | `flex`, `grid`, `relative`, `overflow-hidden`, etc. |

- **Landing / ProductDetail / componentes editoriales** → clases kiki custom
- **Tienda / CartDrawer / filtros** → Tailwind

---

## Tema

### Implementación

`ThemeContext.jsx` — `{ theme, toggleTheme }` via `useTheme()`

```jsx
const { theme, toggleTheme } = useTheme()
// theme: 'dark' | 'warm'
// Dark: document.documentElement sin data-theme
// Warm: document.documentElement.setAttribute('data-theme', 'warm')
```

Persiste en `localStorage` clave `kiki-theme`. Default: preferencia del sistema.

**CRÍTICO:** El contexto exporta `toggleTheme` (no `toggle`). Cualquier componente que destructure `toggle` del contexto obtendrá `undefined`.

### Modo claro — reglas de visibilidad

- SVG icons: `stroke="currentColor"` siempre, nunca `stroke="white"`
- Colores inline: `color: 'var(--ink)'` nunca `color: '#F7F2EA'`
- Fondos: `background: 'var(--bg)'` nunca `background: '#0A0A0A'`
- Excepciones válidas: `color: '#0A0A0A'` sobre fondo `#C9A84C` (texto en botones gold)

---

## Moneda

`CurrencyContext.jsx` — `{ currency, setCurrency }` via `useCurrency()`

```jsx
const { currency, setCurrency } = useCurrency()
// currency: 'usd' | 'bs'
// Persiste en localStorage clave 'kiki_currency'
```

`useTasaCambio()` — fetcha `ve.dolarapi.com/v1/dolares/paralelo`, clave `data.promedio`.
- Cache 30 min en localStorage clave `kiki_tasa_bs`
- Module-level promise previene fetches duplicados

**Regla de negocio:** Las ofertas (OFERTA DIVISA, PROMO DIVISA) solo aplican en modo `$`. Al cambiar a Bs se muestra el precio base sin descuento.

---

## Componentes clave

### AnnouncementBar
- Fondo: `linear-gradient(90deg, #2A1505, #5C3210 50%, #2A1505)` dark / cognac en warm
- Texto marquee: `10% OFF EN FRAGANCIAS DEL DÍA DEL PADRE` — 6 copias, `translateX(-50%)` loop
- Popup mobile (≤767px): fondo `#100C06`, franja gold superior, `10%` italic 72px
- `sessionStorage` clave `ddp-bar-closed` / `ddp-popup-closed` — una vez por sesión

### Header
- Logo: `theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'`
- Currency switcher: `$` / `Bs` pill — borde `rgba(201,168,76,0.35)`
- Theme toggle: `☀` / `☾` — clase `.theme-toggle-btn`
- Mobile: sidebar 290px desde izquierda, backdrop oscuro

### VitrinaCard
- `ribbon` prop → `.vitrina-ribbon` diagonal gold, oculta la familia olfativa
- `badge` prop → etiqueta bottom-left, oculta en ≤768px
- En modo Bs: precio en bolívares sin descuento, sin badge OFERTA/PROMO

### BrandStory (bs2 — full-bleed, junio 2026)
- Sección `#nosotros`, clases `bs2-*`, altura 80vh desktop / auto mobile
- Foto `/store-interior.webp` con `position: absolute; inset: 0; object-fit: cover`
- `.bs2-overlay` — gradiente oscuro a la derecha (desktop) / de abajo a arriba (mobile)
- `.bs2-content` — 44% ancho alineado a la derecha en desktop; `position: absolute; bottom: 0` en mobile
- Scroll reveal con `useScrollReveal` en eyebrow / quote / text / cta

### Footer
- Logo: mismo sistema que Header (`logo-warm.svg` / `logo vector letras.svg`)
- Colores de contacto: `var(--ink-mute)` — nunca hardcodeado

---

## Landing — orden de secciones (actualizado junio 2026)

```
Hero
NewLaunchBanner     ← nuevos lanzamientos
BestsellerRow       ← bestsellers
QuickGenero         ← 3 tiles género
MustHaveMen         ← carrusel masculino
QuickOcasion        ← 4 tiles por ocasión
MustHaveWomen       ← carrusel femenino
BrandStory (bs2)    ← historia full-bleed
Testimonials
Guarantee
Footer
```

**Eliminados (junio 2026):** BrandsMarquee (×2), ProductWall, DiaDeLPadrePromo, ColeccionesSection.

---

## Campaña Día del Padre 2026

- IDs DDP: `src/data/dia-del-padre.js` — 10 Antonio Banderas 100ml
- Ribbon: solo productos en `diaDeLPadreIds` — nunca por `genero === 'Masculino'`
- Descuento 10%: solo en modo `$`, no en Bs
- GiftWrapOverlay: solo en sección "¿Qué tipo de papá?" y editor's pick — NO en el grid de 182 fragancias
- `sessionStorage` clave `ddp-cards-unwrapped` — los envoltorios se abren una vez por sesión

---

## Colores a evitar

| Color | Por qué |
|---|---|
| `stroke="white"` en SVG | Invisible en warm mode |
| `color: '#F7F2EA'` / `rgba(250,250,248,...)` inline | Invisible en warm mode |
| `background: '#0A0A0A'` en secciones | No respeta warm |
| Gradientes azul/morado | No existe en este sistema de color |
| `border-left: 3px solid accent` | Patrón AI slop |
| Cards 3-columnas con icono + título + descripción | Patrón AI slop |
