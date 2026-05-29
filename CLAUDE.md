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
- `Tienda.jsx` — grid de productos, lee `?genero=` y `?q=` de URL, filtros por marca y categoría en drawer
- `ProductDetail.jsx` — detalle de producto con pirámide de notas olfativas con imágenes

## Datos de productos
| Archivo | Descripción |
|---|---|
| `src/data/products-enriched.js` | 416 productos completos: imagen, notas, descripción, precioUSD, variantIds (fuente de verdad) |
| `src/data/products-index.js` | 416 productos ligeros — solo campos de catálogo, sin descripción/notas largas |
| `src/data/all-products.js` | Re-exporta `products-index` como `allProducts` — usado por Tienda, VitrinaCard, Header autocomplete |
| `src/data/catalog.js` | Catálogo del PDF de precios sin imágenes (no usado por la app) |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (390 entradas, todas WebP) |
| `src/data/dia-del-padre.js` | IDs numéricos de los 10 productos de la campaña Día del Padre 2026 |

**Campos por producto:** `id, house, name, image (.webp), familia, tipo, genero, ml, description, notasSalida, notasCorazon, notasFondo, precioUSD, categoria ('arabes'|'disenador'|'nicho'), variantIds[]`

**Code splitting intencional:** `all-products` → `products-index` (ligero) para Tienda/VitrinaCard/autocomplete. `ProductDetail` importa `products-enriched` directamente para tener notas y descripción completas.

**Precios:** solo `precioUSD` — el sistema de bolívares fue eliminado completamente.

## Imágenes públicas
| Ruta | Contenido |
|---|---|
| `public/hero/` | Imágenes del carrusel: `{nombre}-desktop.webp` y `{nombre}-mobile.webp` |
| `public/notes/` | 245 WebP de ingredientes/notas olfativas |
| `public/products/` | 644 WebP de productos |

**Todas las imágenes son WebP.** Convertidas con `scripts/convert-to-webp.mjs` (sharp + `.rotate()` para corregir EXIF).

## SEO
- `react-helmet-async` — `HelmetProvider` en `App.jsx` envuelve toda la app
- `ProductDetail` tiene `<Helmet>` con `<title>`, `<meta description>`, canonical, OG tags, y JSON-LD `schema.org/Product`
- `DiaDeLPadrePage` tiene `<Helmet>` con meta/OG propios de campaña
- `scripts/generate-sitemap.js` — genera `public/sitemap.xml` con 419 URLs en cada `npm run build`
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

## Hero carrusel
- Video: 14s, fotos: 7s por slide (`getSlideDuration(idx)`)
- Crossfade real: slide anterior en z=1, nuevo entra con `heroFadeIn` CSS animation en z=2
- Buscador global → navega a `/tienda?q=...`

## Search Autocomplete (Header)
- `useMemo` sobre `allProducts` (products-index) con min 2 chars, max 6 resultados
- Filtra por `name`, `house`, `familia`
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

## Campaña Día del Padre 2026
- **Ruta:** `/dia-del-padre` — `src/pages/DiaDeLPadrePage.jsx`
- **Productos:** 10 fragancias masculinas Antonio Banderas 100ml (IDs: 359, 412, 375, 366, 391, 410, 367, 377, 346, 376)
- **Entrada homepage:** `DiaDeLPadrePromo.jsx` — sección editorial después del Hero en `Landing.jsx`
- **AnnouncementBar:** barra dorada en desktop + bottom sheet pop-up en móvil
- **Badge:** prop `badge="Para papá"` en VitrinaCard, CSS `.badge-regalo` con `z-index: 9`
- **WhatsApp:** mensaje pre-cargado específico + `ref=dia_del_padre`, número `584149112002`
- **Grid mobile:** siempre 2 columnas (`.diadel-padre-grid { grid-template-columns: repeat(4, 1fr) }` → override a 2 cols en ≤768px)
- **Teardown post-campaña (después del 21 de junio):** agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Hombre", "status": 302 }
  ```

## Scripts útiles
| Script | Uso |
|---|---|
| `scripts/convert-to-webp.mjs` | Convierte jpg/png → webp con `.rotate()` EXIF, actualiza data files. Requiere `sharp`. |
| `scripts/download-notes.mjs` | Descarga imágenes de notas desde Pexels API |
| `scripts/check-missing-notes.mjs` | Reporta notas sin imagen |
| `scripts/enrich-designer-notes.mjs` | Aplicó notas estructuradas a IDs 249–416 |
| `scripts/generate-sitemap.js` | Corre automáticamente en cada `npm run build` |
| `scripts/sync-prices.mjs` | Sincroniza precios desde `C:/Users/Azael/Downloads/LISTA DE PRECIOS PDF ABRIL 2.md` → products-enriched.js + products-index.js. Parsea formato BS+USD concatenado (ratio 650). Filtra TESTER, BODY SPRAY y SET. |
| `scripts/export-prices.mjs` | Exporta todos los productos con precios a `precios.csv` para edición manual en Excel |
| `scripts/import-prices.mjs` | Reimporta `precios.csv` editado → products-enriched.js + products-index.js |

## Pendiente
- Foto lifestyle real para BrandStory (columna derecha oculta hasta tenerla)
- Teardown DDP post-21-junio (redirect en vercel.json)

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
