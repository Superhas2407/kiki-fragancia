# KiKi Fragancia

Tienda de perfumería venezolana de lujo. Landing editorial + catálogo + detalle de producto.
**Sin checkout propio:** todo el cierre de compra es por WhatsApp. Dominio: **kikifragancia.com**.

> Contexto operativo completo (arquitectura, reglas, "lo que no se toca") → **`CLAUDE.md`**
> Sistema de diseño (paleta, tipografía, reglas CSS) → **`DESIGN.md`**

---

## Stack

| Herramienta | Versión | Nota |
|---|---|---|
| React | 19 | |
| Vite | 8 | |
| Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme {}` en `src/index.css` — **sin `tailwind.config.js`** |
| React Router | v7 | |
| framer-motion | v12 | solo en Tienda |
| three.js | 0.184 | `ShaderAnimation` (fondo) |
| @sanity/client | v7 | CMS de productos |
| @supabase/supabase-js | v2 | auth + wishlist |
| @vercel/analytics + speed-insights | v2 | montados en `main.jsx` |

## Desarrollo

```bash
npm install
npm run dev      # localhost:5173
npm run build    # sync Sanity → sitemap → meta-feed → vite build → páginas OG
npm run preview  # sirve dist/
npm run lint     # eslint
```

`npm run build` corre, en orden:
`sync-from-sanity.mjs` → `generate-sitemap.js` → `generate-meta-feed.mjs` → `vite build` → `generate-product-pages.mjs`.

## Rutas

```
/                         Landing
/tienda                   Catálogo (filtros + búsqueda, infinite scroll, sin paginación)
/tienda/:slug             Detalle de producto (acepta slug o ID numérico legacy)
/terminos-y-condiciones   Términos
/dia-del-padre            → redirect 302 a /tienda?genero=Masculino (campaña 2026 finalizada)
/coming-soon              Página standalone
/kiki-login               Login admin (oscuro, no linkeado)
/kiki-desk                Panel admin — protegido, gestiona la tasa de cambio
```

`/kiki-login` y `/kiki-desk` viven **fuera** del AppShell (sin Header/Footer). El resto va dentro de
`SanityProductsProvider > WishlistProvider > CurrencyProvider > ThemeProvider > AppShell`.

## Datos de productos

**Sanity es la fuente primaria.** Los archivos locales (`src/data/products-*.js`) son fallback de
carga inicial y **se regeneran en cada `npm run build`** y cada 2 h por CI. No editarlos a mano.

| Archivo | Descripción |
|---|---|
| `src/data/products-index.js` | Catálogo ligero (~454 productos) — **generado** |
| `src/data/products-enriched.js` | Productos completos: notas, descripción, precio — **generado** |
| `src/data/notes-lookup.js` | Mapeo id → notas para el buscador — **generado** |
| `src/data/notes-images.js` | Mapeo nota → foto WebP (415 notas) |
| `src/data/dia-del-padre.js` | IDs de la campaña Día del Padre 2026 (histórico) |

Flujo para agregar/editar un producto: **Studio → Publish → `npm run build` → commit → push**
(Vercel despliega). Ver `CLAUDE.md` § Sanity CMS.

## Arquitectura CSS

Dos sistemas coexistiendo, **no mezclar en componentes nuevos**:

- **Landing + ProductDetail + editoriales** → clases custom `src/index.css` (`.kiki-*`, `.pd-*`, `.vitrina-*`, `.hero-*`)
- **Tienda + drawers + filtros** → utilidades Tailwind

## PWA

`public/manifest.json` + `public/sw.js` (registrado en `index.html`). Cache-first para assets
estáticos, network-first para el resto. `InstallBanner.jsx` ofrece instalar en iOS/Android.

## CI (GitHub Actions)

| Workflow | Disparo | Qué hace |
|---|---|---|
| `sync-sanity.yml` | cada 2 h + manual | baja productos de Sanity, commitea `chore: sync products from Sanity [skip ci]` |
| `deploy-studio.yml` | push a `studio/**` | `sanity deploy` |
| `set-agotado.yml` | manual (IDs) | marca/desmarca productos agotados en Sanity |

> El sync automático hace que `origin/main` avance solo. Antes de push: `git pull --rebase`.

## Deployment

Vercel — auto-deploy desde `Superhas2407/kiki-fragancia`, branch `main`. `vercel.json` define
headers de cache (1 año para `/products`, `/notes`, `/hero`), el redirect de `/dia-del-padre` y el
fallback SPA a `index.html` (después de `{ "handle": "filesystem" }`, que sirve las páginas OG estáticas).

## Herramienta interna

`tools/renamer-app/` — app Electron para renombrar fotos de productos. Fuera del sitio
(`tools/` está en `.gitignore`). Ver `tools/renamer-app/CLAUDE.md`.
