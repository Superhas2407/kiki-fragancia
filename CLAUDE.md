# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React + Vite. Dominio: **kikifragancia.com**

## Comandos
npm run dev    # servidor de desarrollo
npm run build  # sync Sanity → local + sitemap + vite build
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
| `src/data/products-enriched.js` | Productos completos: imagen, notas, descripción, precioUSD, variantIds (**generado por sync-from-sanity**) |
| `src/data/products-index.js` | Productos ligeros — solo campos de catálogo (**generado por sync-from-sanity**) |
| `src/data/all-products.js` | Re-exporta `products-index` como `allProducts` — legacy, preferir `useIndexProducts()` |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (415 entradas, todas WebP) |
| `src/data/notes-lookup.js` | Mapeo id → notas concatenadas — **generado por sync-from-sanity**, usado por el buscador |
| `src/data/dia-del-padre.js` | IDs numéricos de los productos de la campaña Día del Padre 2026 |

**Campos por producto:** `id, house, name, image (.webp), familia, tipo, genero, ml, description, notasSalida, notasCorazon, notasFondo, precioUSD, descuento, categoria ('arabes'|'disenador'|'nicho'), variantIds[]`

**Code splitting intencional:** `products-index` (ligero) para bundle principal. `ProductDetail` importa `products-enriched` directamente. `notes-lookup` está en el bundle principal para búsqueda inmediata.

**Precios:** `precioUSD` en todos los productos. El sistema de bolívares está activo vía `CurrencyContext` + `useTasaCambio` (tasa paralelo de `ve.dolarapi.com`).

## Sanity CMS
Studio en **kiki-fragancia.sanity.studio** — projectId `7j25mwk7`, dataset `production`.

### Arquitectura
- **Sanity es la fuente primaria de productos.** Los archivos locales son fallback de carga inicial y se regeneran en cada `npm run build`.
- Productos nuevos creados en Studio aparecen en /tienda sin tocar código (vía fetch del contexto).
- `src/lib/sanityClient.js` — cliente público (`useCdn: true`). Exporta `sanityClient` y `sanityImageUrl(source)`.
- `src/context/SanityProductsContext.jsx` — provider + hooks:
  - `<SanityProductsProvider>` — en `App.jsx` envuelve la app
  - `useIndexProducts()` — array de productos fusionados (local + Sanity)
  - `useSanityProduct(id)` — producto individual con todos los campos de Sanity
  - `useLivePrice(id)` — precio en vivo por ID
  - `resolveProductImage(product)` — resuelve la mejor imagen: `sanityImage` (CDN Sanity) > `/products/{image}` (local)

### Schema de Sanity (campos editables desde Studio)
| Campo | Tipo | Descripción |
|---|---|---|
| `name`, `house` | string | Nombre y marca |
| `precioUSD` | number | Precio — se refleja al instante en el sitio |
| `sanityImage` | image | Foto subida directo al Studio (CDN Sanity, prioridad alta) |
| `image` | string | Nombre de archivo local (ej: `lattafa-hayaati-100ml-m.webp`) |
| `genero`, `familia`, `tipo`, `categoria` | string | Campos de catálogo |
| `ml`, `variantIds` | number/array | Tamaño y variantes |
| `descripcion` | text | Descripción del producto |
| `notasSalida`, `notasCorazon`, `notasFondo` | array de strings | Notas olfativas — selección con autocomplete de 415 notas disponibles. `parseNotes()` en ProductDetail acepta array o string. |
| `acordes` | array `{label, pct}` | Hasta 4 acordes — dropdown con 27 labels válidos. Si están en Sanity, reemplazan los hardcodeados. |
| `cuandoEpocaSeca`, `cuandoLluviosa`, `cuandoDia`, `cuandoNoche` | boolean | Cuándo usar — si alguno está en Sanity, reemplaza el hardcodeado |
| `descuento` | number | Porcentaje de descuento activo (1-99). Sanity tiene prioridad sobre el hardcodeado en `dia-del-padre.js`. Dejar vacío si no hay descuento. |

### Flujo para agregar o editar un producto
1. En Studio: crear/editar el documento → **Publish**
2. En la terminal:
   ```
   npm run build
   git add -A
   git commit -m "feat/update: [nombre del producto]"
   git push
   ```
3. Vercel detecta el push y despliega automáticamente (~2 min)

El `npm run build` corre `sync-from-sanity.mjs` que descarga todos los productos de Sanity y actualiza los archivos locales antes de compilar.

### CORS configurado en sanity.io/manage
- `https://kikifragancia.com`
- `http://localhost:5173`

### Credenciales (NO commitear)
- `.env.local` — `SANITY_TOKEN`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`
- `SANITY_TOKEN` también configurado en Vercel → Settings → Environment Variables

### Scripts de migración
| Script | Uso |
|---|---|
| `scripts/sync-from-sanity.mjs` | **Principal.** Descarga todos los productos de Sanity → actualiza products-index.js, products-enriched.js y notes-lookup.js. Corre automáticamente en `npm run build`. |
| `scripts/migrate-to-sanity.mjs` | Sube/actualiza los productos locales a Sanity. Útil para migraciones masivas. Convierte notas string → array. |
| `scripts/generate-notes-lookup.mjs` | Regenera notes-lookup.js desde products-enriched.js local (sin Sanity). |

## Imágenes públicas
| Ruta | Contenido |
|---|---|
| `public/hero/` | Imágenes del carrusel: `{nombre}-desktop.webp` y `{nombre}-mobile.webp` |
| `public/notes/` | 245 WebP de ingredientes/notas olfativas |
| `public/products/` | WebP de productos |

**Todas las imágenes son WebP.** Convertidas con `scripts/convert-to-webp.mjs` (sharp + `.rotate()` para corregir EXIF).

## SEO
- `react-helmet-async` — `HelmetProvider` en `App.jsx` envuelve toda la app
- `ProductDetail` tiene `<Helmet>` con `<title>`, `<meta description>`, canonical, OG tags, y JSON-LD `schema.org/Product`
- `DiaDeLPadrePage` tiene `<Helmet>` con meta/OG propios de campaña
- `scripts/generate-sitemap.js` — genera `public/sitemap.xml` con todas las URLs en cada `npm run build`
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
**Prioridad: Sanity > hardcodeado en ProductDetail.jsx**

Si el producto tiene acordes o cuándo-usar en Sanity, se usan esos. Si no, se usan los hardcodeados.

Hardcodeados en `ProductDetail.jsx`:
- `ACORDES_POR_PRODUCTO` — objeto keyed por `product.id`, valor: array de 4 `[label, pct]` ordenados de mayor a menor
- `CUANDO_POR_PRODUCTO` — objeto keyed por `product.id`, valor: `{ clima: [[label,icon,bool],...], momentos: [[label,icon,bool],...] }`
- `ACORDES_POR_PRODUTO_FALLBACK` y `DEFAULT_CUANDO` — fallbacks si el ID no existe
- Labels de acordes válidos: acuático, ahumado, ámbar, amaderado, aromático, avainillado, cálido especiado, caramelo, chipre, cítrico, cuero, dulce, especiado, floral, fresco, frutal, gourmand, herbal, marino, amoscado, oriental, oud, powder, resinoso, seco, terroso, verde
- Para editar sin Sanity: editar directamente los objetos en `ProductDetail.jsx` (líneas ~140 y ~585)

## Notas olfativas en ProductDetail
- `src/data/notes-images.js` — mapeo nota→imagen (WebP), 415 entradas
- `NoteIcon({ nota, size })` — muestra foto circular si existe, SVG icon dorado si no
- `parseNotes(val)` — acepta string (legacy) o array (Sanity nuevo)
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
- **Número dinámico:** `allProducts.filter(p => p.ml !== 200 || !p.variantIds).length`

## ThreeDMarquee (`src/components/ui/ThreeDMarquee.jsx`)
Grid 3D inclinado (`rotateX(55deg) rotateZ(-45deg)`) de 4 columnas, columnas animan en Y alterna.
- **Separadores dorados:** 3 líneas de 2px en `24.5% / 50% / 75.5%` del contenedor, `rgba(201,168,76,0.6)` con fade en extremos, `zIndex: 20`, fijas.

## Hero carrusel (Opción A — 2026-05-29)
- Video: 14s, fotos: 7s por slide (`getSlideDuration(idx)`)
- Crossfade real: slide anterior en z=1, nuevo entra con `heroFadeIn` CSS animation en z=2
- **Layout Opción A:** título `clamp(40px,6vw,88px)` italic, eyebrow margin-bottom 40px, quote margin-bottom 44px
- CTA "Explorar colección" + link "Buscar fragancia" con ícono lupa
- **Barra inferior unificada** (`.hero-bottom-bar`): `@kiki_fragancia · Instagram` | dots carrusel | scroll indicator. Oculta en ≤767px.

## Búsqueda (Header autocomplete + Tienda)
- `src/lib/search.js` — utilidades compartidas:
  - `norm(s)` — normaliza tildes (NFD + strip diacríticos) y pone en minúsculas. "cítrico" = "citrico".
  - `productMatchesQuery(terms, searchFields)` — todos los términos deben matchear algún campo (AND).
  - Fuzzy con Levenshtein: tolerancia 0 (≤3 chars), 1 (4-5 chars), 2 (≥6 chars).
- **Header autocomplete:** min 2 chars, max 6 resultados. Campos: `name`, `house`, `familia`, `acordes`, **notas olfativas** (`notes-lookup.js`). Excluye 200ml con variantes.
- **Tienda:** mismos campos + notas. Todos normalizados con `norm()`.
- ArrowDown/ArrowUp navega sugerencias, Enter navega al producto seleccionado.

## Menú móvil
- Sidebar deslizante desde la izquierda (290px), backdrop oscuro
- Sección "Fragancias": Todas, Hombre, Mujer, Unisex, Kids
- Sección "Menú": Colección, Nosotros, Instagram, Contacto

## Filtros Tienda
- URL params: `?genero=Masculino|Femenino|Unisex|Niño` y `?tipo=arabes|disenador|nicho`
- Drawer "Filtrar": marcas + Categoría (Árabes/Nicho/Diseñador)
- GlobalSidebar (≥1024px): género + tipo
- **Productos 200ml:** se excluyen del grid si tienen `variantIds`. Filtro: `p.ml !== 200 || !p.variantIds`.

## VitrinaCard
- Prop `ribbon` — cinta diagonal dorada en esquina superior derecha. Cuando hay ribbon, la familia olfativa se oculta.
- Prop `badge` — etiqueta en esquina inferior-izquierda. **Oculta en ≤768px**.
- "Original Verificado" en ProductDetail: `bottom: 16px; left: 16px` con fondo `rgba(8,5,2,0.78)`.

## Campaña Día del Padre 2026
- **Ruta:** `/dia-del-padre` — `src/pages/DiaDeLPadrePage.jsx`
- **Productos del grid:** 15 fragancias curadas — definidos en `src/data/dia-del-padre.js`
- **Entrada homepage:** `DiaDeLPadrePromo.jsx` — sección editorial en `Landing.jsx` después de ProductWall
- **AnnouncementBar:** marquee scrolling `10% OFF EN FRAGANCIAS DEL DÍA DEL PADRE` + popup modal en móvil
- **Ribbon:** `ribbon="Día del Padre"` solo por `diaDeLPadreIds.includes(product.id)`
- **Descuento:** Sanity (`p.descuento`) tiene prioridad sobre `diaDeLPadreDiscounts[p.id]` (hardcodeado). Solo en modo `$` (divisa).
- **Badge DDP en ProductDetail:** gradiente azul `#0A2D72 → #1A52CC` con texto `#E8F0FF` — **color de campaña intencional**, no cambiar aunque viole la regla gold-only de DESIGN.md.
- **WhatsApp:** mensaje pre-cargado específico + `ref=dia_del_padre`, número `584149112002`
- **Teardown post-campaña (después del 21 de junio):** agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Masculino", "status": 302 }
  ```

## Sistema de moneda
- `src/context/CurrencyContext.jsx` — `{ currency, setCurrency }` via `useCurrency()`. Valores: `'usd' | 'bs'`.
- `src/hooks/useTasaCambio.js` — fetcha `ve.dolarapi.com/v1/dolares/paralelo`. Cache 30min en `kiki_tasa_bs`. Soporta override manual vía `kiki_tasa_manual` en localStorage.
  - `setTasaManual(rate)` — guarda tasa manual con timestamp
  - `clearTasaManual()` — elimina el override, vuelve a usar la API
  - `getTasaManualInfo()` — devuelve `{ rate, savedAt }` o `null`
  - Prioridad: manual localStorage > cache API > fetch API
- **Admin `/kiki-desk`** — `src/pages/KikiDeskPage.jsx`. Página standalone (sin Header/Footer) para gestionar la tasa manualmente. Ruta intencionalmente oscura (security by obscurity). **No linkear en ningún lugar del UI.**
- Switcher en Header: pill `REF` / `Bs` en desktop + sección MONEDA en menú móvil.

## Tema
- `src/context/ThemeContext.jsx` — `{ theme, toggleTheme }` via `useTheme()`. **El export es `toggleTheme`** (no `toggle`).
- Persiste en `localStorage` clave `kiki-theme`. Default: preferencia del sistema.
- Dark: sin `data-theme` attribute. Warm: `data-theme="warm"` en `<html>`.

## BrandStory
- Foto del local: `/store-interior.webp`
- Layout: texto/quote columna izquierda, foto columna derecha
- Marco editorial: `::before` rectángulo gold offset `inset: 14px -14px -14px 14px`

## Scripts útiles
| Script | Uso |
|---|---|
| `scripts/sync-from-sanity.mjs` | **Principal.** Sanity → products-index.js + products-enriched.js + notes-lookup.js. Corre en cada build. |
| `scripts/migrate-to-sanity.mjs` | Local → Sanity. Para migraciones masivas. Usa batches de 50. |
| `scripts/generate-notes-lookup.mjs` | Regenera notes-lookup.js desde products-enriched.js local (sin Sanity). |
| `scripts/convert-to-webp.mjs` | Convierte jpg/png → webp con `.rotate()` EXIF. Requiere `sharp`. |
| `scripts/add-new-products.mjs` | Agrega nuevos perfumes al catálogo local. |
| `scripts/generate-sitemap.js` | Corre automáticamente en cada `npm run build`. |
| `scripts/sync-prices.mjs` | Sincroniza precios desde lista PDF → products-enriched.js + products-index.js. |
| `scripts/export-prices.mjs` | Exporta todos los productos con precios a `precios.csv`. |
| `scripts/import-prices.mjs` | Reimporta `precios.csv` editado → archivos locales. |

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
