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
| `src/data/products-enriched.js` | 416+ productos con imagen, notas reales y descripción (fuente principal) |
| `src/data/catalog.js` | Catálogo completo del PDF de precios sin imágenes (no usado por la app) |
| `src/data/all-products.js` | Re-exporta products-enriched como `allProducts` |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (78 entradas) |
| `src/data/dia-del-padre.js` | IDs numéricos de los 10 productos de la campaña Día del Padre 2026 |

## Imágenes públicas
| Ruta | Contenido |
|---|---|
| `public/hero/` | 10 imágenes del carrusel: `{nombre}-desktop.jpg` y `{nombre}-mobile.jpg` |
| `public/notes/` | 56 JPEGs de ingredientes/notas olfativas |
| `public/products/` | Fotos de productos (las que ya están renombradas con la app) |

## Notas olfativas en ProductDetail
- `src/data/notes-images.js` — mapeo nota→imagen
- `NoteIcon({ nota, size })` — muestra foto circular si existe, SVG icon si no
- En chips de preview: `size=22`, en pirámide completa: `size=40`

## Hero carrusel
- Video: 14s, fotos: 7s por slide (`getSlideDuration(idx)`)
- Crossfade real: slide anterior en z=1, nuevo entra con `heroFadeIn` CSS animation en z=2
- Buscador global → navega a `/tienda?q=...`

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
- **WhatsApp:** mensaje pre-cargado específico para la ocasión, número `584149112002`
- **Teardown post-campaña:** después del 21 de junio, agregar en `vercel.json` antes de `{ "handle": "filesystem" }`:
  ```json
  { "src": "/dia-del-padre", "dest": "/tienda?genero=Hombre", "status": 302 }
  ```

## Pendiente
- Notas y descripciones de ~46 productos sin actualizar (BHARARA, AFNAN, JO MILANO, Lattafa menores)
- ~26 ingredientes sin imagen en `/public/notes/`

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
