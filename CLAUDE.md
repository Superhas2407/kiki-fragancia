# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React 19 + Vite 8. Dominio: **kikifragancia.com**.
Sin checkout propio — el cierre de compra es por WhatsApp (`584149112002`).

## Stack
React 19 · Vite 8 · Tailwind v4 (`@import "tailwindcss"` + `@theme {}`, **sin config file**) ·
React Router v7 · framer-motion v12 (solo Tienda) · three.js (`ShaderAnimation`) ·
`@sanity/client` v7 (CMS) · `@supabase/supabase-js` v2 (auth + wishlist) ·
`@vercel/analytics` + `speed-insights` (en `main.jsx`).

## Comandos
```
npm run dev      # servidor de desarrollo (localhost:5173)
npm run build    # sync-from-sanity → generate-sitemap → generate-meta-feed → vite build → generate-product-pages
npm run lint     # eslint
npm run preview  # sirve dist/
```

## Lo que NO se toca

- **`src/data/products-index.js`, `products-enriched.js`, `notes-lookup.js`** — generados por
  `sync-from-sanity.mjs`. Se sobrescriben en cada `npm run build` y cada 2 h por CI. Editar en Sanity.
- **`.env` / `.env.local` / `.env*`** — están en `.gitignore`. Nunca commitear tokens.
- **Rutas `/kiki-login` y `/kiki-desk`** — admin por *security by obscurity*. No linkear en ninguna UI.
- **Badge azul de Día del Padre** en `ProductDetail.jsx` (gradiente `#0A2D72 → #1A52CC`) — color de
  campaña **intencional**, aunque viole la regla gold-only de `DESIGN.md`. No cambiar a dorado.
- **Oferta Halloween** (paleta naranja→morado) — misma situación, excepción sancionada. Ver `DESIGN.md`.
- **`ThemeContext` exporta `toggleTheme`** (no `toggle`). El default es `'warm'`, clave `kiki-theme-v2`,
  atada al script anti-FOUC inline de `index.html`.
- **Gating admin**: `isAdmin = !!session` en `SanityProductsContext.jsx` y `Tienda.jsx` — hoy es
  *cualquier usuario logueado*, no un email específico. Si se necesita restringir a un correo, es un cambio aparte.
- **`vercel.json`**: `{ "handle": "filesystem" }` debe ir antes del fallback SPA, para que las
  páginas OG estáticas (`dist/tienda/[slug]/index.html`) se sirvan primero a los bots.
- El `<noscript><img>` del Meta Pixel vive en `<body>` de `index.html` (no en `<head>` — rompe el parser).

## Arquitectura general
- `App.jsx` — `HelmetProvider` > `BrowserRouter` > `AuthProvider` > `CartProvider` > `ErrorBoundary`. Rutas especiales (`/coming-soon`, `/kiki-login`, `/kiki-desk`) fuera del AppShell. Resto (`/*`) dentro de `SanityProductsProvider > WishlistProvider > CurrencyProvider > ThemeProvider > AppShell`.
- `AppShell` — CursorTrail (solo no-touch) + MetaPixel + ScrollToTop + AnnouncementBar + Header + GlobalSidebar + Routes + CartDrawer + WishlistDrawer + WhatsAppFab + ConsentBanner + InstallBanner + OfertaDelDia + BottomNav
- `AnnouncementBar.jsx` — barra fija encima del header (`BAR_H = 40px`). Marquee genérico (`Fragancias 100% Originales ✦ Envíos en Venezuela ✦ Originales Verificadas`), sin campaña. `sessionStorage` clave `kiki-bar-closed` (una vez por sesión). Ajusta `--bar-h` = `calc(40px + env(safe-area-inset-top))` para bajar el header. El pop-up modal móvil de campaña fue eliminado.
- `MetaPixel` — componente en `App.jsx` que inyecta `fbq` con guard `if (window.fbq) return`. El pixel también está inline en `index.html` (ese corre primero). El `<noscript>` fallback está en `<body>`.
- `GlobalSidebar.jsx` — links por género y tipo (solo ≥1024px, oculto en móvil)
- `Header.jsx` — logo centrado (grid 1fr auto 1fr), hamburger a la IZQUIERDA, búsqueda/carrito/wishlist/cuenta a la derecha. Logo por tema: `theme === 'warm' ? '/logo-warm.svg' : '/logo vector letras.svg'`. En modo warm fuera de landing, fondo `#140E06`. En landing/dark, transparente. **Mega menú desktop**: al hover en "Colección" abre panel con 6 tiles (Hombre/Mujer/Unisex/Árabes/Diseñador/Nicho) usando imágenes `public/silhouettes/mega-*.jpeg`. Switcher moneda REF/Bs. Sidebar móvil 290px. Escucha `kiki:open-search` desde BottomNav. Las miniaturas del buscador usan `resolveProductImage` (ver § Búsqueda).
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

**Precios:** `precioUSD` en todos los productos. El sistema de bolívares está activo vía `CurrencyContext` + `useTasaCambio` (tasa Sanity `kiki-ajustes.tasaManual` > paralelo de `ve.dolarapi.com`). Ver § Sistema de moneda.

## Sanity CMS
Studio en **kiki-fragancia.sanity.studio** — projectId `7j25mwk7`, dataset `production`.

### Arquitectura
- **Sanity es la fuente primaria de productos.** Es **la única forma** de agregar/editar perfumes.
  Los archivos locales son fallback de carga inicial y se regeneran en cada `npm run build` y cada 2 h por CI.
- Productos nuevos creados en Studio aparecen en /tienda sin tocar código (vía fetch del contexto).
  Un producto sin `id` (o con `id` repetido) **se descarta en silencio** — no aparece y no da error.
- `src/lib/sanityClient.js` — cliente público (`useCdn: true`, `apiVersion 2024-01-01`, projectId `7j25mwk7`, dataset `production`). Exporta `sanityClient` y `sanityImageUrl(source)`. También `sanityWriteClient` (`VITE_SANITY_WRITE_TOKEN`, `useCdn: false`) para escrituras desde el cliente (solo la tasa de cambio).
- `src/context/SanityProductsContext.jsx` — provider + hooks:
  - `<SanityProductsProvider>` — envuelve la app; hace `sanityClient.fetch` de todos los productos al montar y en cada cambio de `isAdmin`.
  - **Merge:** parte de `products-index.js` local (fallback), y encima aplica los campos **no-null** de Sanity. `variantIds` se prefiere de Sanity si viene con largo, si no del local. Filtra los que no tengan `id && name && house`.
  - `useIndexProducts()` — array de productos fusionados
  - `useSanityProduct(id)` / `useLivePrice(id)` — leen del array fusionado (no hacen fetch propio)
  - `resolveProductImage(product)` — `sanityImage` (CDN Sanity, `.width(800).auto('format')`) > `/products/{image}` (local) > `null`. **Usarlo siempre** para imágenes de producto — lo usan VitrinaCard, ProductDetail y el buscador del Header (grilla "Destacados" + autocomplete).
- **`isAdmin = !!session`** (Supabase) — cualquier usuario logueado. Gatea: campos `promoHalloween`/`precioPromoHalloween` (solo se piden a Sanity con sesión), filtros "Solo agotados" y "Oferta Halloween" en Tienda.

### GitHub Actions
| Workflow | Disparo | Qué hace |
|---|---|---|
| `sync-sanity.yml` | cron `0 */2 * * *` + manual | baja productos de Sanity → regenera los 3 archivos → commit `chore: sync products from Sanity [skip ci]` → `git pull --rebase` → push |
| `deploy-studio.yml` | push a `studio/**` + manual | `npx sanity deploy` (usa `secrets.SANITY_TOKEN`) |
| `set-agotado.yml` | manual (inputs `ids`, `value`) | corre `scripts/set-agotado.mjs` → marca/desmarca `agotado` en Sanity (usa `secrets.SANITY_SYNC`) |

**Consecuencia del sync:** `origin/main` avanza solo cada 2 h. Antes de cualquier push local:
`git fetch && git rebase origin/main` (o `git pull --rebase`).

### Schema de Sanity (campos editables desde Studio)
`studio/schemas/product.js`. Enums: `genero` = Masculino/Femenino/Unisex/Niño ·
`tipo` = Eau de Parfum/Eau de Toilette/Parfum/Extrait de Parfum/Elixir/Eau de Cologne ·
`categoria` = arabes/disenador/nicho. `acordes`: 27 labels válidos (ver abajo).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | **Único y obligatorio.** Validación en el schema. Al duplicar en Studio queda vacío → asignar uno nuevo. Sin ID válido el producto no aparece. |
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
| `agotado` | boolean | Sin stock — el sitio muestra badge "Agotado" y desactiva la compra. |
| `promoHalloween` | boolean | Marca el producto en la Oferta Halloween 🎃. **Admin-only**: el sitio SOLO muestra la cinta, el badge de precio y el filtro de `/tienda` cuando el visitante está logueado como admin (mismo `useAuth()`/`session` que gatea "Solo agotados" en Tienda). Cualquier visitante o cliente normal no ve absolutamente nada de esto — ni el ribbon, ni el precio promocional, ni el filtro. Pensado para preparar/probar la campaña antes de lanzarla al público. Paleta propia (`vitrina-ribbon--halloween` / `vitrina-price-badge--halloween` / `pd-ddp-strip--halloween`): gradiente naranja calabaza → morado medianoche `#FF7A18 → #3D1766` + ícono de calabaza (`PumpkinIcon` en `VitrinaCard.jsx`) — **excepción intencional a la regla gold-only**, igual que el azul de Día del Padre. No cambiar a dorado plano. |
| `precioPromoHalloween` | number | Precio especial mientras `promoHalloween` esté activo — solo se aplica y se ve con sesión admin. **No reemplaza `precioUSD`** — el precio normal queda guardado intacto para todos los demás. Solo visible en Studio cuando `promoHalloween` está activo. |

**Cómo funciona el gating admin-only:** `SanityProductsContext.jsx` arma la query GROQ dinámicamente — `promoHalloween`/`precioPromoHalloween` solo se piden a Sanity cuando hay `session` (así ni siquiera viajan por la red hacia un visitante anónimo), y el merge solo aplica el precio promocional y expone el flag cuando `isAdmin` es true. `scripts/sync-from-sanity.mjs` (el build público) NO incluye estos campos en absoluto — el bundle estático que se sirve a todos los visitantes nunca los lleva.

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
- **Header autocomplete:** min 2 chars, max 12 resultados. Campos: `name`, `house`, `familia`, `acordes`, **notas olfativas** (`notes-lookup.js`). Excluye 200ml con variantes. Las miniaturas (autocomplete + grilla "Destacados") usan `resolveProductImage(p)` → funcionan con foto solo-Sanity.
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
- **Variantes (otras presentaciones):** un producto listado en el `variantIds` de otro se excluye del grid — solo se muestra el producto "canónico" (el que tiene `variantIds`), con un selector de tamaño (`.vitrina-size-pills` en `VitrinaCard`) para elegir entre sus presentaciones. Helper: `excludeVariantDuplicates()` en `src/lib/variants.js`, usado en `basePool` de `Tienda.jsx`.

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

## Campaña Día del Padre 2026 (finalizada)
- `/dia-del-padre` → redirect 302 a `/tienda?genero=Masculino` (`vercel.json`). La página, el promo
  de homepage y el `GiftWrapOverlay` fueron retirados.
- **Persiste:** `src/data/dia-del-padre.js` — exports `diaDeLPadreIds`, `diaDeLPadreDiscounts`,
  `antoniobanderasIds`, `armafOdysseyIds`.
- **Badge DDP en ProductDetail:** gradiente azul `#0A2D72 → #1A52CC`, texto `#E8F0FF` — sigue activo
  para IDs en `diaDeLPadreIds`. **Color de campaña intencional**, no cambiar (memory del proyecto).
- **Descuento:** Sanity `p.descuento` > `diaDeLPadreDiscounts[p.id]`, solo en modo `$`.

## Componentes con punteros hardcodeados
Cuando cambie el producto destacado, editar el archivo:
- `NewLaunchBanner.jsx` — `PRODUCT_SLUG = 'carolina-herrera-la-bomba-80ml'`.
- `MustHaveMen.jsx` / `MustHaveWomen.jsx` — arrays de IDs curados (ver secciones abajo).

`OfertaDelDia.jsx` **ya NO usa un ID hardcodeado** — se gestiona desde `/kiki-desk` (ver sección
siguiente).

## Oferta del Día (gestionada desde /kiki-desk, sin tocar código)
- `src/hooks/useOfertaDelDia.js` — fuente: Sanity `kiki-ajustes.ofertaDelDiaId` +
  `ofertaDelDiaSetAt` (mismo documento singleton que `tasaManual`, escritos con `.patch()` para no
  pisarse entre sí — nunca `createOrReplace` sobre `kiki-ajustes`). `useOfertaDelDia()` devuelve
  `{ id, setAt }` o `null` si no hay oferta activa o si ya pasaron **24h** desde `ofertaDelDiaSetAt`
  (`OFERTA_DURATION_MS`). Caché local 5min en `localStorage['kiki_oferta_dia_sanity']`.
  `setOfertaDelDiaSanity(productId)` / `clearOfertaDelDiaSanity()` / `getOfertaDelDiaCache()`.
- `OfertaDelDia.jsx` — lee `useOfertaDelDia()`; si no hay oferta activa el componente no renderiza
  nada (`return null`) para nadie. El countdown (card desktop + barra móvil) cuenta hacia
  `setAt + 24h` (ya no hacia medianoche) y el widget se auto-oculta solo al llegar a 0, sin reload.
- **Panel en `/kiki-desk`** (`KikiDeskPage.jsx`) — sección "Oferta del día" debajo de la tasa de
  cambio: buscador de producto (casa/nombre) con `norm()`, click en un resultado activa la oferta
  (`setOfertaDelDiaSanity`) y arranca el countdown de 24h; botón "Desactivar oferta del día" la
  quita antes de tiempo. Muestra el producto activo y el tiempo restante en vivo.

## PWA
- `public/manifest.json` — `standalone`, theme `#C9A84C`, iconos `icon-192.png` / `icon-512.png` (any maskable), shortcut a `/tienda`.
- `public/sw.js` — `CACHE_NAME = 'kiki-v1'`. Precache de `/`, `/tienda`, manifest, fuente, logo.
  Estrategia: network-first con fallback a cache; solo GET same-origin. Registrado desde `index.html` en `load`.
- `InstallBanner.jsx` — banner para instalar en iOS (instrucciones) y Android (`beforeinstallprompt`).
- iOS PWA: `index.html` tiene metas `apple-mobile-web-app-*`; hay fixes de notch/status-bar en `src/index.css`.

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
- `src/hooks/useTasaCambio.js` — **devuelve un número** (no un objeto — nunca destructurar, rompe el sitio). Prioridad de fuentes:
  1. **Sanity** (`kiki-ajustes.tasaManual`) con cache 5min en `localStorage['kiki_tasa_sanity']`
  2. **dolarapi** (`ve.dolarapi.com/v1/dolares/paralelo`, campo `data.promedio`) con cache 30min en `localStorage['kiki_tasa_bs']`
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
| `scripts/sync-from-sanity.mjs` | **Principal.** Sanity → products-index.js + products-enriched.js + notes-lookup.js. Corre en cada build y cada 2 h por CI. |
| `scripts/migrate-to-sanity.mjs` | Local → Sanity. Para migraciones masivas. Usa batches de 50. |
| `scripts/migrate-images-to-sanity.mjs` | Sube las fotos locales de `public/products/` al campo `sanityImage`. |
| `scripts/generate-notes-lookup.mjs` | Regenera notes-lookup.js desde products-enriched.js local (sin Sanity). |
| `scripts/convert-to-webp.mjs` | Convierte jpg/png → webp con `.rotate()` EXIF. Requiere `sharp` (+ `heic-convert` para HEIC). |
| `scripts/add-new-products.mjs` | **Legacy** — agrega al catálogo local. Hoy usar Sanity (el build lo sobrescribe). |
| `scripts/set-agotado.mjs` | Marca/desmarca `agotado` en Sanity por IDs. Lo llama el workflow `set-agotado.yml`. |
| `scripts/check-missing-notes.mjs` | Lista productos sin notas olfativas. |
| `scripts/download-notes.mjs` | Descarga imágenes de notas a `public/notes/`. |
| `scripts/generate-sitemap.js` | Corre en cada `npm run build`. URLs con slugs → `public/sitemap.xml`. |
| `scripts/generate-meta-feed.mjs` | Corre en cada `npm run build`. Genera `public/meta-product-feed.xml` (catálogo Meta/Facebook). |
| `scripts/generate-product-pages.mjs` | Genera `dist/tienda/[slug]/index.html` por producto con OG tags. Al final de cada build. |
| `scripts/sync-prices.mjs` / `export-prices.mjs` / `import-prices.mjs` | Sincroniza / exporta a `precios.csv` / reimporta precios. |
| `scripts/cleanup-promo-verano.mjs` | Limpieza puntual de la promo de verano (histórico). |

## Pendiente
- (nada crítico abierto)

**Hecho:** el teardown de Día del Padre ya está aplicado — `vercel.json` redirige
`/dia-del-padre` → `/tienda?genero=Masculino` (302).

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
