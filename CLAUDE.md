# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React + Vite. Dominio: **kikifragancia.com**

## Comandos
```
npm run dev    # servidor de desarrollo
npm run build  # build de producción
```

## Arquitectura general
- `App.jsx` — `CurrencyProvider` > `CartProvider` > `AppShell` (AnnouncementBar + Header + GlobalSidebar + Routes)
- `AnnouncementBar.jsx` — barra dorada fija encima del header (z-index 41). Gestiona también el bottom sheet pop-up en móvil (<768px). Ambos usan `sessionStorage` para mostrarse solo una vez por sesión. Ajusta `--bar-h` en `:root` para bajar el header.
- `GlobalSidebar.jsx` — links por género (solo ≥1024px, oculto en móvil)
- `Header.jsx` — logo, CurrencyToggle, CartButton, menú móvil (sidebar deslizante 290px desde la izquierda). Usa `top: var(--bar-h, 0px)` para ceder espacio al AnnouncementBar.
- `Hero.jsx` — carrusel: 1 video (`/hero.webm`) + 5 imágenes, crossfade CSS, `<picture>` desktop/mobile
- `Tienda.jsx` — grid de productos, lee `?genero=` y `?q=` de URL, filtros por marca en drawer
- `ProductDetail.jsx` — detalle de producto con pirámide de notas olfativas con imágenes

## Datos de productos
| Archivo | Descripción |
|---|---|
| `src/data/products-enriched.js` | 416 productos completos: imagen, notas, descripción, precioUSD, variantIds (fuente de verdad) |
| `src/data/products-index.js` | 416 productos ligeros (115KB) — solo campos de catálogo, sin descripción/notas largas |
| `src/data/all-products.js` | Re-exporta `products-index` como `allProducts` — usado por Tienda, VitrinaCard, Header autocomplete |
| `src/data/catalog.js` | Catálogo del PDF de precios sin imágenes (no usado por la app) |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (78 entradas) |
| `src/data/dia-del-padre.js` | IDs numéricos de los 10 productos de la campaña Día del Padre 2026 |

**Code splitting intencional:** `all-products` → `products-index` (ligero) para Tienda/VitrinaCard/autocomplete. `ProductDetail` importa `products-enriched` directamente para tener notas y descripción completas.

## Imágenes públicas
| Ruta | Contenido |
|---|---|
| `public/hero/` | 10 imágenes del carrusel: `{nombre}-desktop.jpg` y `{nombre}-mobile.jpg` |
| `public/notes/` | 56 JPEGs de ingredientes/notas olfativas |
| `public/products/` | Fotos de productos (las que ya están renombradas con la app) |

## SEO
- `react-helmet-async` — `HelmetProvider` en `App.jsx` envuelve toda la app
- `ProductDetail` tiene `<Helmet>` con `<title>`, `<meta description>`, canonical, OG tags, y JSON-LD `schema.org/Product`
- `DiaDeLPadrePage` tiene `<Helmet>` con meta/OG propios de campaña
- `scripts/generate-sitemap.js` — genera `public/sitemap.xml` con 419 URLs en cada `npm run build`
- `public/robots.txt` → `Sitemap: https://kikifragancia.com/sitemap.xml`
- WhatsApp `?ref=` tracking en todos los links WA: `ref=detalle_{id}`, `ref=carrito`, `ref=fab_general`, `ref=fab_detalle_{id}`, `ref=fab_dia_del_padre`, `ref=dia_del_padre`

## WhatsAppFab
`src/components/WhatsAppFab.jsx` — context-aware usando `useLocation()`:
- En `/tienda/:id` → mensaje con el nombre del producto + `ref=fab_detalle_{id}`
- En `/dia-del-padre` → mensaje específico de la campaña + `ref=fab_dia_del_padre`
- En cualquier otra página → mensaje genérico + `ref=fab_general`

## Notas olfativas en ProductDetail
- `src/data/notes-images.js` — mapeo nota→imagen
- `NoteIcon({ nota, size })` — muestra foto circular si existe, SVG icon si no
- En chips de preview: `size=22`, en pirámide completa: `size=40`

## Pirámide olfativa (`.pd-pyr`)
Layout flex con línea de tiempo dorada vertical:
- `.pd-pyr` — `max-width: 660px`, `padding-right: 12px`, flex columna
- `.pd-pyr::before` — línea dorada vertical (timeline)
- `.pd-pyr-row` — flex, dot dorado (`.pd-pyr-row::before`) en intersección con línea
- `.pd-pyr-time` — `width: 80px`, texto muted "SALIDA / CORAZÓN / FONDO"
- `.pd-pyr-notes` — `flex: 1`, flex-wrap con fotos circulares 64px
- `.pd-pyr-label` — `width: 68px`, texto dorado italic
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

## Campaña Día del Padre 2026
- **Ruta:** `/dia-del-padre` — `src/pages/DiaDeLPadrePage.jsx`
- **Productos:** 10 fragancias masculinas Antonio Banderas 100ml (IDs: 359, 412, 375, 366, 391, 410, 367, 377, 346, 376)
- **Entrada homepage:** `DiaDeLPadrePromo.jsx` — sección editorial después del Hero en `Landing.jsx`
- **AnnouncementBar:** barra dorada en desktop + bottom sheet pop-up en móvil
- **Badge:** prop `badge="Para papá"` en VitrinaCard, CSS `.badge-regalo` con `z-index: 9`
- **WhatsApp:** mensaje pre-cargado específico + `ref=dia_del_padre`, número `584149112002`
- **Página rediseñada (2026-05-27):** 5 secciones editoriales:
  1. Hero split: headline + panel editorial con cornerbrackets dorados (`.ddp-hero`)
  2. Countdown dinámico: días hasta 21-jun + fecha límite 18-jun (`.ddp-countdown`)
  3. Guía de regalo: 3 personas cards con botellas (`.ddp-personas`) — El Clásico, El Aventurero, El Sibarita
  4. Editor's Pick: featured card producto 412 (Antonio Banderas The Icon) con precio y CTAs (`.ddp-featured`)
  5. Grid 10 fragancias + CTA WhatsApp (`.diadel-padre-grid`, `.ddp-wa-section`)
- **Teardown post-campaña (después del 21 de junio):** agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Hombre", "status": 302 }
  ```

## Pendiente
- Notas y descripciones de ~46 productos sin actualizar (BHARARA, AFNAN, JO MILANO, Lattafa menores)
- ~26 ingredientes sin imagen en `/public/notes/`
- Foto lifestyle real para BrandStory (columna derecha oculta hasta tenerla)

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
