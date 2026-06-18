# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React + Vite. Dominio: **kikifragancia.com**

## Comandos
```
npm run dev    # servidor de desarrollo
npm run build  # sync Sanity → local + sitemap + vite build + generate-product-pages
```

## Arquitectura general
- `App.jsx` — `HelmetProvider` > `BrowserRouter` > `AuthProvider` > `CartProvider` > `ErrorBoundary`. Rutas especiales (`/coming-soon`, `/kiki-login`, `/kiki-desk`) fuera del AppShell. Resto (`/*`) dentro de `SanityProductsProvider > WishlistProvider > CurrencyProvider > ThemeProvider > AppShell`.
- `AppShell` — AnnouncementBar + Header + GlobalSidebar + Routes + CartDrawer + WishlistDrawer + WhatsAppFab + ConsentBanner + BottomNav
- `AnnouncementBar.jsx` — barra dorada fija encima del header (z-index 41). Gestiona también el bottom sheet pop-up en móvil (<768px). Ambos usan `sessionStorage` para mostrarse solo una vez por sesión. Ajusta `--bar-h` en `:root` para bajar el header.
- `GlobalSidebar.jsx` — links por género y tipo (solo ≥1024px, oculto en móvil)
- `Header.jsx` — logo centrado (grid 1fr auto 1fr), hamburger a la IZQUIERDA, búsqueda/carrito/wishlist/cuenta a la derecha. Logo siempre blanco (`.kiki-header .kiki-logo-img { filter: brightness(0) invert(1) }`). En modo warm fuera de landing, fondo `#140E06`. En landing/dark, transparente. **Mega menú desktop**: al hover en "Colección" abre panel con 6 tiles (Hombre/Mujer/Unisex/Árabes/Diseñador/Nicho) usando imágenes `public/silhouettes/mega-*.jpeg`. Switcher moneda REF/Bs. Sidebar móvil 290px. Escucha `kiki:open-search` desde BottomNav.
- `BottomNav.jsx` — barra fija inferior en móvil (≤1023px): Inicio · Tienda · Buscar · Carrito. Buscar dispara `kiki:open-search`. WhatsAppFab flota en `bottom: calc(60px + safe-area + 16px)`.
- `Hero.jsx` — carrusel: 1 video (`/hero.webm`) + 5 imágenes, crossfade CSS, `<picture>` desktop/mobile
- `Tienda.jsx` — **Desktop**: layout grid `220px sidebar | 1fr main`. Sidebar fijo sticky con acordeones (Género, Categoría, Concentración, Por ocasión, Marca) + barra superior con conteo y select Ordenar. **Mobile**: barra `Filtrar | Ordenar` + drawer. Sin paginación — infinite scroll. Banner full-bleed al tope (ver sección Banners Tienda).
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
- `src/lib/sanityClient.js` — cliente público (`useCdn: true`). Exporta `sanityClient` y `sanityImageUrl(source)`. También exporta `sanityWriteClient` (usa `VITE_SANITY_WRITE_TOKEN`, `useCdn: false`) para escrituras desde el cliente.
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
- `.env.local` — `SANITY_TOKEN`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_WRITE_TOKEN`
- `SANITY_TOKEN` y `VITE_SANITY_WRITE_TOKEN` también configurados en Vercel → Settings → Environment Variables
- `VITE_SANITY_WRITE_TOKEN` es el mismo valor que `SANITY_TOKEN` — necesario para escrituras desde el cliente (tasa de cambio)

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
| `public/fonts/` | `GothamThin.otf` + `GothamThin.woff2` — fuente KikiGotham servida desde public |
| `public/silhouettes/` | `mega-{arabes,disenador,hombre,mujer,nicho,unisex}.jpeg` — tiles del mega menú desktop del Header |
| `public/BANNERTIENDA*.webp` | Banners de la página Tienda por categoría — ver sección Banners Tienda |

**Todas las imágenes son WebP.** Convertidas con `scripts/convert-to-webp.mjs` (sharp + `.rotate()` para corregir EXIF).

## Banners Tienda
Banner full-bleed al tope de `/tienda` (encima del sidebar+grid, sin maxWidth). Altura `clamp(200px, 28vw, 360px)`.

Lógica en `Tienda.jsx` — prioridad: tipo > género > default:
| Condición | Imagen |
|---|---|
| `?tipo=arabes` | `BANNERTIENDAARABE.webp` |
| `?tipo=disenador` | `BANNERTIENDADISEÑADOR.webp` |
| `?tipo=nicho` | `BANNERTIENDANICHO.webp` |
| `?genero=Masculino` | `BANNERTIENDAHOMBRE.webp` |
| `?genero=Femenino` | `BANNERTIENDAMUJER.webp` |
| `?genero=Unisex` | `BANNERTIENDAUNISEX.webp` |
| Sin filtro (todos) | `BANNERTIENDATODOS.webp` |

Overlay: `linear-gradient(to top, rgba(10,8,4,0.75) 0%, rgba(10,8,4,0.20) 50%, rgba(10,8,4,0.05) 100%)`. Texto: `sectionTitle` italic 200 + conteo de fragancias.

## SEO
- `react-helmet-async` — `HelmetProvider` en `App.jsx` envuelve toda la app
- `ProductDetail` tiene `<Helmet>` con `<title>`, `<meta description>`, canonical, OG tags, y JSON-LD `schema.org/Product`
- `DiaDeLPadrePage` tiene `<Helmet>` con meta/OG propios de campaña
- `scripts/generate-sitemap.js` — genera `public/sitemap.xml` con todas las URLs (slugs) en cada `npm run build`
- `public/robots.txt` → `Sitemap: https://kikifragancia.com/sitemap.xml`
- WhatsApp `?ref=` tracking en todos los links WA: `ref=detalle_{id}`, `ref=carrito`, `ref=fab_general`, `ref=fab_detalle_{id}`, `ref=fab_dia_del_padre`, `ref=dia_del_padre`
- **OG tags estáticos para bots (Telegram, WhatsApp, Twitter):** `scripts/generate-product-pages.mjs` corre al final del build y genera `dist/tienda/[slug]/index.html` por cada producto con los meta tags correctos. Bots reciben HTML estático con OG tags; humanos reciben el mismo HTML → React SPA carga normalmente. Vercel sirve archivos estáticos primero (`{ "handle": "filesystem" }` en `vercel.json`).

## Performance
- FOUC eliminado: `<style>html,body{background:#EAE0CC;color:#1A1208}</style>` inline en `index.html` (warm/light por defecto). Script anti-FOUC usa `localStorage.getItem('kiki-theme-v2')` — si es `'dark'` aplica colores oscuros, si no aplica `data-theme="warm"`.
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

## Componentes eliminados (junio 2026)
Los siguientes archivos fueron borrados — no existen en el repo:
- `ProductWall.jsx`, `BrandsMarquee.jsx`, `ColeccionesSection.jsx`, `DiaDeLPadrePromo.jsx`
- `CartFab.jsx`, `InstagramFeed.jsx`, `VaporCanvas.jsx`
- `ui/ThreeDMarquee.jsx`, `ui/WheelPagination.jsx`, `ui/gradient-wave.jsx`
- `data/promo-divisa.js`

## Landing — orden de secciones
`src/pages/Landing.jsx` — orden actual:
1. `<Hero />` — carrusel hero
2. `<NewLaunchBanner />` — banner de nuevos lanzamientos
3. `<BestsellerRow />` — fila de bestsellers
4. `<QuickGenero />` — 3 tiles de género (Para él / Para ella / Unisex)
5. `<MustHaveMen />` — carrusel horizontal de fragancias masculinas
6. `<QuickOcasion />` — 4 tiles por ocasión (trabajo / salir / diario / jóvenes)
7. `<MustHaveWomen />` — carrusel horizontal de fragancias femeninas
8. `<BrandStory />` — historia de la marca
9. `<Testimonials />` — testimonios
10. `<Guarantee />` — garantías

Eliminados de Landing en junio 2026: `BrandsMarquee` (×2), `ProductWall`, `ThreeDMarquee`, `ColeccionesSection`.

## Footer (rediseñado junio 2026)
`src/components/Footer.jsx` — 5 columnas en desktop, stack en móvil. Clases `kf-*`.
| Col | Contenido |
|---|---|
| Brand | Logo + tagline + descripción |
| Colección | Links: Todas, Hombre, Mujer, Unisex, Árabes, Diseñador, Nicho |
| Información | Nosotros, Términos y condiciones, Dirección (CC Todo Tecnología #29, Los Cortijos) |
| Atención al cliente | WhatsApp, Instagram, horario Lun–Sáb 9am–7pm |
| Newsletter | Logo pequeño + form email/suscribir (submit local, no integración externa aún) |

Bottom bar: íconos sociales (IG, WA, TikTok) + copyright + crédito.

## Mega menú Header (desktop)
Al hover en "Colección" en el nav desktop, abre un panel full-width con 6 tiles:
- `MEGA_CATS` en `Header.jsx`: Hombre · Mujer · Unisex · Árabes · Diseñador · Nicho
- Imágenes: `public/silhouettes/mega-{hombre,mujer,unisex,arabes,disenador,nicho}.jpeg`
- Delay de 180ms al cerrar (timer ref) para evitar cierre accidental al mover el mouse

## QuickGenero (`src/components/QuickGenero.jsx`)
3 tiles de género en la landing. Imágenes actuales en `public/hero/`:
- Para él: `sauvage-desktop.webp` / `sauvage-mobile.webp` (Dior Sauvage)
- Para ella: `paraella-desktop.webp` / `paraella-mobile.webp`
- Unisex: `unisex-desktop.webp` / `unisex-mobile.webp`

**Mobile layout (≤767px):** grid 2 columnas. Para él + Para ella en `aspect-ratio: 2/3`. Unisex ocupa el ancho completo (`grid-column: 1 / -1`) con `aspect-ratio: 4/3`.
**Label style:** texto uppercase `font-size: 11px`, borde blanco `1px solid rgba(255,255,255,0.75)`, hover → dorado. Sin CTA visible.

## QuickOcasion (`src/components/QuickOcasion.jsx`)
4 tiles por ocasión. Reutiliza clases `.qg-section.qo-section` y `.qg-tile`.
- Para el trabajo → `/tienda?coleccion=trabajo`
- Para salir → `/tienda?coleccion=noche`
- Para el diario → `/tienda?coleccion=diario`
- Para jóvenes → `/tienda?coleccion=joven`

Imágenes en `public/hero/ocasion-{key}-{desktop|mobile}.webp`. Las tiles de "diario" y "jovenes" usan `objectPosition: '70% center'` para centrar los frascos.

**Desktop:** 4 columnas (`grid-template-columns: repeat(4, 1fr)`), altura `80vh`.
**Mobile:** 4 tiles en columna única `aspect-ratio: 9/16` cada una.

## MustHaveMen (`src/components/MustHaveMen.jsx`)
Carrusel horizontal de fragancias masculinas. IDs: `[88, 20, 256, 255, 279, 272, 104, 247, 266, 311]` — todos género Masculino. Heading: "DEBERÍAS COMPRAR" + subtitle italic "Para hombres". CTA → `/tienda?genero=Masculino`. Reutiliza clases CSS: `bestseller-section`, `bs-card`, `bs-row`, `bs-row-desktop`.

## MustHaveWomen (`src/components/MustHaveWomen.jsx`)
Carrusel horizontal de fragancias femeninas. IDs: `[107, 108, 240, 241, 87, 131, 81, 78, 208, 209]` — todos género Femenino. Heading: "DEBERÍAS COMPRAR" + subtitle italic "Para mujeres". CTA → `/tienda?genero=Femenino`.

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
- **Header autocomplete:** min 2 chars, max 12 resultados. Campos: `name`, `house`, `familia`, `acordes`, **notas olfativas** (`notes-lookup.js`). Excluye 200ml con variantes.
- **Tienda:** mismos campos + notas. Todos normalizados con `norm()`.
- ArrowDown/ArrowUp navega sugerencias, Enter navega al producto seleccionado.
- **Overlay estilo panel** (no full-screen): `.kiki-search-backdrop` (fondo oscuro 30%, `z-index 299`) + `.kiki-search-overlay` (`position: fixed; top: 0; left: 0; right: 0; max-height: 82vh; z-index 300`). Clic en backdrop cierra.
- **Productos en fila horizontal:** `.kiki-search-grid` es `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`. Cards con `flex: 0 0 130px` (mobile) / `180px` (≥768px). Imágenes con `aspect-ratio: 1/1; object-fit: cover`.
- **Labels de sección:** "Tendencias" y "Destacados" — dorados itálicos con línea dorada `::after`.
- **Navegación:** usa slugs — `navigate(\`/tienda/${toSlug(p.house, p.name, p.ml)}\`)`.

## Menú móvil
- Sidebar deslizante desde la izquierda (290px), backdrop oscuro
- Links: **Todas las fragancias** · **Día del Padre** (azul `#1A52CC`) · Hombre · Mujer · Unisex · — · Árabes · Diseñador · Nicho · — · Nosotros · Instagram
- `.mobile-nav-ddp` — solo aplica `color: #1A52CC !important`, mismo tamaño/itálica que los demás links
- Kids eliminado (junio 2026)

## Filtros Tienda
- URL params: `?genero=Masculino|Femenino|Unisex` y `?tipo=arabes|disenador|nicho`
- **Desktop (≥1024px):** sidebar sticky 220px con acordeones: Género (DDP button + radio), **Precio**, Categoría, Concentración, Por ocasión, Marca. Topbar con conteo + select Ordenar.
- **Mobile:** barra `Filtrar | Ordenar` (transparent select overlay). Drawer con Género incluido (radio DDP + opciones) + **Precio**.
- **Barra de precio dual:** `PriceRangeSlider` — dos `<input type="range">` superpuestos sobre un track div. El relleno dorado (`.price-slider-fill`) se ajusta con `left: pct(lo)%` y `right: (100-pct(hi))%`. `priceBounds` se deriva de `basePool` vía `useMemo`; **CRÍTICO: `basePool` debe declararse antes que `priceBounds`** (temporal dead zone). `useEffect` sincroniza `priceRange` cuando `priceBounds` cambian.
- **Productos 200ml:** se excluyen del grid si tienen `variantIds`. Filtro: `p.ml !== 200 || !p.variantIds`.

## Slugs / URLs de productos
- `src/lib/slugs.js` — `toSlug(house, name, ml)`:
  - Usa `norm()` de `search.js` para quitar tildes y bajar a minúsculas
  - **Deduplicación:** si `name` ya empieza con `house` (ej: house="Afnan", name="Afnan 9 PM"), recorta el prefijo para evitar `afnan-afnan-9-pm`
  - Formato resultante: `afnan-9-pm-100ml`, `al-haramain-amber-oud-100ml`
- **Rutas:** `/tienda/[slug]` — `VitrinaCard`, `Header` y variantes en `ProductDetail` navegan con slug
- **Lookup en ProductDetail:** acepta slug o ID numérico (legacy). Si el param `id` no es numérico, busca por `toSlug(p.house, p.name, p.ml) === id`. Resuelve `canonicalUrl` al slug limpio.
- **Sitemap y OG pages:** ambos scripts usan la misma lógica `toSlug` (copiada inline en los scripts ESM)

## VitrinaCard
- Display oscuro simplificado: gradiente sólido `#161210 → #0A0806`, overlay reducido (22% alto, 0.28 opacidad). Sin esquinas de marco editorial ni N° numeración.
- Prop `ribbon` — cinta diagonal dorada en esquina superior derecha (180×180px overflow hidden, `rotate(45deg)`). Cuando hay ribbon, la familia olfativa se oculta.
- Prop `badge` — etiqueta en esquina inferior-izquierda. **Oculta en ≤768px**.
- Heart button: `rgba(10,8,4,0.72)` base con color `rgba(247,242,234,0.80)` — visible sobre ribbon dorado.
- "Original Verificado" en ProductDetail: `bottom: 16px; left: 16px` con fondo `rgba(8,5,2,0.78)`.

## Campaña Día del Padre 2026
- **Ruta:** `/dia-del-padre` — `src/pages/DiaDeLPadrePage.jsx`
- **Productos del grid:** 15 fragancias curadas — definidos en `src/data/dia-del-padre.js`
- **Entrada homepage:** `DiaDeLPadrePromo.jsx` — **eliminado en junio 2026**. La campaña es accesible desde la ruta `/dia-del-padre` y el AnnouncementBar.
- **AnnouncementBar:** marquee scrolling `10% OFF EN FRAGANCIAS DEL DÍA DEL PADRE` + popup modal en móvil
- **Ribbon:** `ribbon="Día del Padre"` solo por `diaDeLPadreIds.includes(product.id)`
- **Descuento:** Sanity (`p.descuento`) tiene prioridad sobre `diaDeLPadreDiscounts[p.id]` (hardcodeado). Solo en modo `$` (divisa).
- **Badge DDP en ProductDetail:** gradiente azul `#0A2D72 → #1A52CC` con texto `#E8F0FF` — **color de campaña intencional**, no cambiar aunque viole la regla gold-only de DESIGN.md.
- **WhatsApp:** mensaje pre-cargado específico + `ref=dia_del_padre`, número `584149112002`
- **Teardown post-campaña (después del 21 de junio):** agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Masculino", "status": 302 }
  ```

## Supabase / Autenticación

Proyecto Supabase: `dgyjwztiwkricpbkxaxd.supabase.co`

- `src/lib/supabaseClient.js` — `createClient` con URL y anon key públicas. Exporta `supabase`.
- `src/context/AuthContext.jsx` — `{ session, loading }` via `useAuth()`. `session` es `null` (no autenticado) o el objeto de sesión de Supabase. `loading: true` mientras se resuelve la sesión inicial.
- `src/components/AuthModal.jsx` — modal de login/registro con tabs "Entrar" / "Crear cuenta" + Google OAuth. Se cierra automáticamente al detectar sesión activa. Se controla con `open` / `onClose` props.
- `src/pages/AdminLoginPage.jsx` — ruta `/kiki-login`: login simplificado solo email+password para el admin. Navega a `/kiki-desk` tras autenticarse.
- `ProtectedRoute` en `App.jsx` — redirige a `/kiki-login` si no hay sesión. Protege `/kiki-desk`.

### Wishlist con Supabase
`WishlistContext.jsx` — `{ ids, toggle, isWishlisted, drawerOpen, setDrawerOpen, authModalOpen, setAuthModalOpen }`:
- Sin sesión: wishlist solo en `localStorage` clave `kiki-wishlist`
- Con sesión: al iniciar sesión, fusiona local + Supabase tabla `wishlists` (`user_id`, `product_id`). Los items solo-locales se suben a Supabase.
- `toggle(id)` — agrega/quita; si hay sesión, persiste en Supabase.

### Rutas admin (security by obscurity — NO linkear en UI)
- `/kiki-login` — login admin (sustituyó la ruta directa a `/kiki-desk`)
- `/kiki-desk` — panel admin protegido por `ProtectedRoute`

---

## Sistema de moneda
- `src/context/CurrencyContext.jsx` — `{ currency, setCurrency }` via `useCurrency()`. Valores: `'usd' | 'bs'`.
- `src/hooks/useTasaCambio.js` — prioridad de fuentes:
  1. **Sanity** (`kiki-ajustes.tasaManual`) con cache 5min en localStorage
  2. **dolarapi** (`ve.dolarapi.com/v1/dolares/paralelo`) con cache 30min
  - `setTasaSanity(rate)` — escribe tasa en Sanity vía `sanityWriteClient` (visible para todos los usuarios) + actualiza cache local
  - `clearTasaSanity()` — borra `tasaManual` de Sanity + limpia cache local
  - `getTasaSanityCache()` — devuelve `{ rate, ts }` del cache local o `null`
  - En mount: fetcha Sanity en vivo (`*[_id == "kiki-ajustes"][0]{ tasaManual }`)
- **Admin `/kiki-desk`** — `src/pages/KikiDeskPage.jsx`. Página standalone (sin Header/Footer) para gestionar la tasa manualmente. Ruta intencionalmente oscura (security by obscurity). **No linkear en ningún lugar del UI.** Cuando hay tasa manual activa muestra "· Sanity · visible para todos".
- Switcher en Header: pill `REF` / `Bs` en desktop + sección MONEDA en menú móvil.
- **Documento Sanity:** `kiki-ajustes` (singleton `_id: "kiki-ajustes"`). Campo `tasaManual: number`. La tasa de Sanity es global — cuando el admin la cambia, todos los usuarios la ven (con 5min de delay por cache).

## Tema
- `src/context/ThemeContext.jsx` — `{ theme, toggleTheme }` via `useTheme()`. **El export es `toggleTheme`** (no `toggle`).
- Persiste en `localStorage` clave **`kiki-theme-v2`** (v2 forzó reset de sesiones que tenían el tema oscuro guardado). Default: `'warm'` (no sigue preferencia del sistema).
- Dark: sin `data-theme` attribute. Warm: `data-theme="warm"` en `<html>`.

## BrandStory
Rediseñada en junio 2026 a estilo full-bleed (clases `bs2-*`):
- Sección `#nosotros`, `.bs2-section` — 80vh desktop, auto en móvil
- `<img class="bs2-img">` — `position: absolute; inset: 0; object-fit: cover` (foto `/store-interior.webp`)
- `.bs2-overlay` — gradiente oscuro a la derecha en desktop, de abajo a arriba en móvil
- `.bs2-content` — 44% ancho desktop (alineado a la derecha), absolute bottom en móvil
- Scroll reveal con `useScrollReveal` en eyebrow / quote / text / cta

## Scripts útiles
| Script | Uso |
|---|---|
| `scripts/sync-from-sanity.mjs` | **Principal.** Sanity → products-index.js + products-enriched.js + notes-lookup.js. Corre en cada build. |
| `scripts/migrate-to-sanity.mjs` | Local → Sanity. Para migraciones masivas. Usa batches de 50. |
| `scripts/generate-notes-lookup.mjs` | Regenera notes-lookup.js desde products-enriched.js local (sin Sanity). |
| `scripts/convert-to-webp.mjs` | Convierte jpg/png → webp con `.rotate()` EXIF. Requiere `sharp`. |
| `scripts/add-new-products.mjs` | Agrega nuevos perfumes al catálogo local. |
| `scripts/generate-sitemap.js` | Corre automáticamente en cada `npm run build`. URLs con slugs. |
| `scripts/generate-product-pages.mjs` | Genera `dist/tienda/[slug]/index.html` por producto con OG tags correctos. Corre al final de cada `npm run build`. |
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
