# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React + Vite. Dominio: **kikifragancia.com**

## Comandos
```
npm run dev    # servidor de desarrollo
npm run build  # build de producción
```

## Arquitectura general
- `App.jsx` — `CartProvider` > `ErrorBoundary` > `AppShell` (AnnouncementBar + Header + GlobalSidebar + Routes)
- `AnnouncementBar.jsx` — barra dorada fija encima del header (z-index 41). Gestiona también el bottom sheet pop-up en móvil (<768px). Ambos usan `sessionStorage` para mostrarse solo una vez por sesión. Ajusta `--bar-h` en `:root` para bajar el header.
- `GlobalSidebar.jsx` — links por género y tipo (solo ≥1024px, oculto en móvil)
- `Header.jsx` — logo, CartButton, search autocomplete, menú móvil (sidebar deslizante 290px desde la izquierda). Usa `top: var(--bar-h, 0px)` para ceder espacio al AnnouncementBar.
- `Hero.jsx` — carrusel: 1 video (`/hero.webm`) + 5 imágenes, crossfade CSS, `<picture>` desktop/mobile
- `Tienda.jsx` — grid de productos, lee `?genero=` y `?q=` de URL, filtros por marca y categoría en drawer. **Sin paginación** — muestra todos los productos filtrados de una vez.
- `ProductDetail.jsx` — detalle de producto con pirámide de notas olfativas, acordes y cuando usar

## Datos de productos
| Archivo | Descripción |
|---|---|
| `src/data/products-enriched.js` | 442 productos completos: imagen, notas, descripción, precioUSD, variantIds (fuente de verdad) |
| `src/data/products-index.js` | 442 productos ligeros — solo campos de catálogo, sin descripción/notas largas |
| `src/data/all-products.js` | Re-exporta `products-index` como `allProducts` — usado por Tienda, VitrinaCard, Header autocomplete |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (390 entradas, todas WebP) |
| `src/data/dia-del-padre.js` | IDs numéricos de los 10 productos de la campaña Día del Padre 2026 |

**Campos por producto:** `id, house, name, image (.webp), familia, tipo, genero, ml, description, notasSalida, notasCorazon, notasFondo, precioUSD, categoria ('arabes'|'disenador'|'nicho'), variantIds[]`

**Code splitting intencional:** `all-products` → `products-index` (ligero) para Tienda/VitrinaCard/autocomplete. `ProductDetail` importa `products-enriched` directamente para tener notas y descripción completas.

**Precios:** `precioUSD` en todos los productos. El sistema de bolívares está activo vía `CurrencyContext` + `useTasaCambio` (tasa paralelo de `ve.dolarapi.com`).

## Imágenes públicas
| Ruta | Contenido |
|---|---|
| `public/hero/` | Imágenes del carrusel: `{nombre}-desktop.webp` y `{nombre}-mobile.webp` |
| `public/notes/` | 245 WebP de ingredientes/notas olfativas |
| `public/products/` | 669 WebP de productos |

**Todas las imágenes son WebP.** Convertidas con `scripts/convert-to-webp.mjs` (sharp + `.rotate()` para corregir EXIF).

## SEO
- `react-helmet-async` — `HelmetProvider` en `App.jsx` envuelve toda la app
- `ProductDetail` tiene `<Helmet>` con `<title>`, `<meta description>`, canonical, OG tags, y JSON-LD `schema.org/Product`
- `DiaDeLPadrePage` tiene `<Helmet>` con meta/OG propios de campaña
- `scripts/generate-sitemap.js` — genera `public/sitemap.xml` con ~445 URLs en cada `npm run build`
- `public/robots.txt` → `Sitemap: https://kikifragancia.com/sitemap.xml`
- WhatsApp `?ref=` tracking en todos los links WA: `ref=detalle_{id}`, `ref=carrito`, `ref=fab_general`, `ref=fab_detalle_{id}`, `ref=fab_dia_del_padre`, `ref=dia_del_padre`

## Performance
- FOUC eliminado: `<style>html,body{background:#0A0A0A;color:#F7F2EA}</style>` inline en `index.html`
- Todas las imágenes en WebP (quality 82)

## WhatsAppFab
`src/components/WhatsAppFab.jsx` — context-aware usando `useLocation()`:
- En `/tienda/:id` → mensaje con el nombre del producto + `ref=fab_detalle_{id}`
- En `/dia-del-padre` → mensaje específico de la campaña + `ref=fab_dia_del_padre`
- En cualquier otra página → mensaje genérico + `ref=fab_general`

## Acordes y Cuando usar (ProductDetail)
Datos por producto (no por familia) definidos directamente en `ProductDetail.jsx`:
- `ACORDES_POR_PRODUCTO` — objeto keyed por `product.id`, valor: array de 4 `[label, pct]` ordenados de mayor a menor
- `CUANDO_POR_PRODUCTO` — objeto keyed por `product.id`, valor: `{ clima: [[...],[...]], momentos: [[...],[...]] }`
- `ACORDES_POR_PRODUTO_FALLBACK` y `DEFAULT_CUANDO` — fallbacks si el ID no existe
- Lookup: `const acordes = ACORDES_POR_PRODUCTO[product.id] || ACORDES_POR_PRODUTO_FALLBACK`
- Labels de acordes válidos: dulce, cálido especiado, avainillado, ámbar, amaderado, terroso, seco, floral, frutal, cítrico, fresco, verde, gourmand, caramelo, aromático, powder, especiado, acuático, ahumado, cuero, resinoso, chipre, oud, oriental, amoscado, herbal, marino
- Para agregar/editar datos de un producto, editar directamente los objetos en `ProductDetail.jsx` (líneas ~136 y ~581)

## Notas olfativas en ProductDetail
- `src/data/notes-images.js` — mapeo nota→imagen (WebP)
- `NoteIcon({ nota, size })` — muestra foto circular si existe, SVG icon dorado si no
- En chips de preview: `size=22`, en pirámide completa: `size=56`

## Pirámide olfativa (`.pd-pyr`)
Forma de pirámide real con tier-based max-width, centrada con `margin: 0 auto`:
- `.pd-pyr-tier-0` (Salida): `max-width: 280px`
- `.pd-pyr-tier-1` (Corazón): `max-width: 460px`
- `.pd-pyr-tier-2` (Fondo): `max-width: 660px`
- Notas centradas (`justify-content: center`), separador dorado entre tiers
- `.pd-pyr-tier-label` — texto dorado italic uppercase
- `.pd-pyr-footer` — pie con casa · nombre · familia

## ProductWall (`src/components/ProductWall.jsx`)
Sección "Colección" en la landing. Muestra el número de productos + heading + marquee 3D + CTA.
- **Scroll reveal:** eyebrow → número → título en cascada (0 / 100 / 200ms) via `useScrollReveal`
- **CTA:** `<Link to="/tienda" className="btn-cta btn-shimmer-kiki">` debajo del marquee
- **Imágenes:** 16 WebP hardcodeadas de `public/products-thumb/`
- **Número dinámico:** `allProducts.filter(p => p.ml !== 200 || !p.variantIds).length` — no hardcodeado

## ThreeDMarquee (`src/components/ui/ThreeDMarquee.jsx`)
Grid 3D inclinado (`rotateX(55deg) rotateZ(-45deg)`) de 4 columnas, columnas animan en Y alterna.
- **Separadores dorados:** 3 líneas de 2px en `24.5% / 50% / 75.5%` del contenedor (centros de los gaps), `rgba(201,168,76,0.6)` con fade en extremos, `zIndex: 20`, **fijas** (no animadas — están en el grid container, no en los `motion.div` de columnas).
- Las `GridLineHorizontal` / `GridLineVertical` internas (dotted, `zIndex: 30`) son decoración adicional sobre las fotos.

## Hero carrusel (Opción A — 2026-05-29)
- Video: 14s, fotos: 7s por slide (`getSlideDuration(idx)`)
- Crossfade real: slide anterior en z=1, nuevo entra con `heroFadeIn` CSS animation en z=2
- **Layout Opción A:** título `clamp(40px,6vw,88px)` italic, eyebrow margin-bottom 40px, quote margin-bottom 44px
- CTA "Explorar colección" + link "Buscar fragancia" con ícono lupa (en lugar de barra de búsqueda en hero)
- **Barra inferior unificada** (`.hero-bottom-bar`): `@kiki_fragancia · Instagram` | dots carrusel | scroll indicator — en una sola fila con `backdrop-filter: blur(8px)`. Oculta en ≤767px.
- Sin viñetas radiales en `hero-bg-gradient` (solo `linear-gradient` para legibilidad del texto)

## Search Autocomplete (Header)
- `useMemo` sobre `allProducts` (products-index) con min 2 chars, max 6 resultados
- Filtra por `name`, `house`, `familia` — **excluye 200ml con variantes** (`p.ml !== 200 || !p.variantIds`)
- Lista debajo del input: imagen circular 36px, casa uppercase, nombre italic
- ArrowDown/ArrowUp navega sugerencias, Enter navega al producto seleccionado
- Click en sugerencia → navega a `/tienda/:id`

## Menú móvil
- Sidebar deslizante desde la izquierda (290px), backdrop oscuro
- `.kiki-mobile-menu`: `transform: translateX(-100%)` → `translateX(0)`
- Sección "Fragancias": Todas, Hombre, Mujer, Unisex, Kids
- Sección "Menú": Colección, Nosotros, Instagram, Contacto

## Filtros Tienda
- URL params: `?genero=Masculino|Femenino|Unisex|Niño` y `?tipo=arabes|disenador|nicho`
- Drawer "Filtrar": marcas + Categoría (Árabes/Nicho/Diseñador)
- GlobalSidebar (≥1024px): género + tipo
- **Productos 200ml:** se excluyen del grid si tienen `variantIds` (son variante de 100ml). Los 200ml standalone (sin `variantIds`) sí aparecen. Filtro: `p.ml !== 200 || !p.variantIds`.
- **Sin paginación** — `WheelPagination` eliminado; el grid renderiza `filtered` completo.

## VitrinaCard
- Prop `ribbon` — cinta diagonal dorada en esquina superior derecha (`.vitrina-ribbon`). Cuando hay ribbon, la familia olfativa se oculta (evita solapamiento).
- Prop `badge` — etiqueta en esquina inferior-izquierda (`bottom: 54px; left: 16px`). **Oculta en ≤768px** (`.badge-regalo { display:none }`) — las cards de 2 columnas son demasiado pequeñas.
- "Original Verificado" en ProductDetail: movido a `bottom: 16px; left: 16px` con fondo `rgba(8,5,2,0.78)` — visible sobre cualquier fondo de foto.

## Campaña Día del Padre 2026
- **Ruta:** `/dia-del-padre` — `src/pages/DiaDeLPadrePage.jsx`
- **Productos del grid:** 15 fragancias curadas — 10 Antonio Banderas (`antoniobanderasIds`) + 5 Armaf Odyssey (`armafOdysseyIds.slice(0,5)`) — definidos en `src/data/dia-del-padre.js`. El export `diaDeLPadreIds` es la unión; `antoniobanderasIds` y `armafOdysseyIds` se exportan también para uso independiente.
- **Entrada homepage:** `DiaDeLPadrePromo.jsx` — sección editorial en `Landing.jsx` **después de ProductWall** (no antes)
- **AnnouncementBar:** marquee scrolling `10% OFF EN FRAGANCIAS DEL DÍA DEL PADRE` + popup modal en móvil (≤767px)
- **Ribbon:** `ribbon="Día del Padre"` solo por `diaDeLPadreIds.includes(product.id)` — nunca por `genero === 'Masculino'`
- **Badge:** `badge="Más vendido"` / `"Editor's pick"` solo en los 2 primeros productos de la página DDP. Oculto en mobile.
- **Descuento:** 10% solo en modo `$` (divisa). En modo Bs se muestra precio base sin descuento.
- **GiftWrapOverlay:** solo en cards de "¿Qué tipo de papá?" y editor's pick — NO en el grid de 15 fragancias. `sessionStorage` clave `ddp-cards-unwrapped`.
- **WhatsApp:** mensaje pre-cargado específico + `ref=dia_del_padre`, número `584149112002`
- **Grid mobile:** siempre 2 columnas
- **Teardown post-campaña (después del 21 de junio):** agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Masculino", "status": 302 }
  ```

## Scripts útiles
| Script | Uso |
|---|---|
| `scripts/convert-to-webp.mjs` | Convierte jpg/png → webp con `.rotate()` EXIF, actualiza data files. Requiere `sharp`. |
| `scripts/download-notes.mjs` | Descarga imágenes de notas desde Pexels API |
| `scripts/check-missing-notes.mjs` | Reporta notas sin imagen |
| `scripts/add-new-products.mjs` | Agrega nuevos perfumes al catálogo (copia fotos + appends a products-enriched.js y products-index.js) |
| `scripts/generate-sitemap.js` | Corre automáticamente en cada `npm run build` |
| `scripts/sync-prices.mjs` | Sincroniza precios desde `C:/Users/Azael/Downloads/LISTA DE PRECIOS PDF ABRIL 2.md` → products-enriched.js + products-index.js. Parsea formato BS+USD concatenado (ratio 650). Filtra TESTER, BODY SPRAY y SET. |
| `scripts/export-prices.mjs` | Exporta todos los productos con precios a `precios.csv` para edición manual en Excel |
| `scripts/import-prices.mjs` | Reimporta `precios.csv` editado → products-enriched.js + products-index.js |

## Sistema de moneda
- `src/context/CurrencyContext.jsx` — `{ currency, setCurrency }` via `useCurrency()`. Persiste en `localStorage` clave `kiki_currency`. Valores: `'usd' | 'bs'`.
- `src/hooks/useTasaCambio.js` — fetcha `ve.dolarapi.com/v1/dolares/paralelo`, lee `data.promedio`. Cache 30min en `kiki_tasa_bs`. Promise module-level previene fetches duplicados.
- Switcher en Header: pill `$` / `Bs` en desktop + sección MONEDA en menú móvil.
- En modo Bs: se muestra `Bs. XXXXX` sin ningún badge de oferta/descuento.

## Tema
- `src/context/ThemeContext.jsx` — `{ theme, toggleTheme }` via `useTheme()`. **El export es `toggleTheme`** (no `toggle` — usar `toggle` da undefined).
- Persiste en `localStorage` clave `kiki-theme`. Default: preferencia del sistema.
- Dark: sin `data-theme` attribute. Warm: `data-theme="warm"` en `<html>`.
- Ver `DESIGN.md` para reglas completas de colores por tema.

## BrandStory
- Foto del local: `/store-interior.webp` (convertida de `IMG_8651.PNG`, 256KB)
- Layout: texto/quote columna izquierda, foto columna derecha
- Marco editorial: `::before` rectángulo gold offset `inset: 14px -14px -14px 14px`

## Pendiente
- Teardown DDP post-21-junio (redirect en vercel.json):
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Masculino", "status": 302 }
  ```
  Agregar en `vercel.json` antes de `{ "handle": "filesystem" }` después del 21 de junio 2026.

---

## Herramienta Renombrador
La app Electron para renombrar las fotos está en `tools/renamer-app/`. Ver `tools/renamer-app/CLAUDE.md` para contexto completo.

---

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
