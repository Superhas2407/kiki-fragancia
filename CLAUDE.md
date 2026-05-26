# Kiki Fragancia — Contexto del Proyecto

Sitio web de tienda de perfumería de lujo. React + Vite. Dominio: **kikifragancia.com**

## Comandos
```
npm run dev    # servidor de desarrollo
npm run build  # build de producción
```

## Arquitectura general
- `App.jsx` — `CurrencyProvider` > `CartProvider` > `AppShell` (Header + GlobalSidebar + Routes)
- `GlobalSidebar.jsx` — links por género (solo ≥1024px, oculto en móvil)
- `Header.jsx` — logo, CurrencyToggle, CartButton, menú móvil (sidebar deslizante 290px desde la izquierda)
- `Hero.jsx` — carrusel: 1 video (`/hero.webm`) + 5 imágenes, crossfade CSS, `<picture>` desktop/mobile
- `Tienda.jsx` — grid de productos, lee `?genero=` y `?q=` de URL, filtros por marca en drawer
- `ProductDetail.jsx` — detalle de producto con pirámide de notas olfativas con imágenes

## Datos de productos
| Archivo | Descripción |
|---|---|
| `src/data/products-enriched.js` | ~95 productos con imagen, notas reales y descripción (fuente principal) |
| `src/data/catalog.js` | Catálogo completo del PDF de precios sin imágenes |
| `src/data/all-products.js` | Fusiona ambos — enriched tiene prioridad |
| `src/data/notes-images.js` | Mapeo nota → ruta imagen (78 entradas) |

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
