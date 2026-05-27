# KiKi Fragancia

Catálogo de perfumería venezolana de lujo. Landing page estática + tienda + detalle de producto. Sin backend — todo el proceso de compra es vía WhatsApp.

## Stack

| Herramienta | Versión |
|-------------|---------|
| React | 19.2.6 |
| Vite | 8.0.12 |
| Tailwind CSS | v4.3 (`@import "tailwindcss"` + `@theme {}` — sin `tailwind.config.js`) |
| React Router | v7.15 |
| framer-motion | v12.38 (solo en Tienda y WheelPagination) |

## Desarrollo

```bash
npm install
npm run dev      # localhost:5173
npm run build    # dist/
npm run preview  # preview del build
```

## Rutas

```
/             → Landing (Hero, Catálogo, Familias, Marcas, BrandStory, Instagram, Footer)
/tienda       → Catálogo completo (filtros, búsqueda, paginación)
/tienda/:id   → Detalle de producto
```

## Arquitectura CSS

Dos sistemas coexistiendo sin conflicto:

- **Landing + ProductDetail** → clases custom en `src/index.css` (`.kiki-container`, `.hero-section`, `.pd-layout`, etc.)
- **Tienda + CartDrawer** → utilidades de Tailwind

No mezclar en nuevos componentes. Ver `DESIGN.md` para las reglas completas.

## Datos

416+ productos en `src/data/products-enriched.js`. Cada producto tiene campo `precioUSD`. Imágenes en `public/products/`.

| Archivo | Descripción |
|---|---|
| `src/data/products-enriched.js` | Fuente principal: 416+ productos con imagen, notas, descripción y precio |
| `src/data/all-products.js` | Re-exporta products-enriched como `allProducts` |
| `src/data/notes-images.js` | Mapeo nota → imagen (78 entradas, fotos reales de ingredientes) |
| `src/data/dia-del-padre.js` | IDs de los 10 productos de la campaña Día del Padre 2026 |

## Deployment

Vercel — auto-deploy desde `Superhas2407/kiki-fragancia` (branch `main`).

## Rutas

```
/                → Landing
/tienda          → Catálogo completo
/tienda/:id      → Detalle de producto
/dia-del-padre   → Landing campaña Día del Padre 2026
```

## Estado actual (2026-05-27)

- 416+ productos con precios, notas y descripciones en `products-enriched.js`
- Campaña Día del Padre 2026 activa: `/dia-del-padre`, AnnouncementBar, popup móvil
- Selector de variantes de tamaño en ProductDetail (60ml / 100ml / 200ml)
- Pirámide de notas con 78 fotos reales de ingredientes
- ProductDetail: CTA (precio + botones) visible above the fold en todos los viewports
- Bug fix: popup de AnnouncementBar solo aparece en homepage (no en todas las páginas)

## Documentos del proyecto

| Archivo | Contenido |
|---------|-----------|
| `DESIGN.md` | Sistema de diseño: paleta, tipografía, reglas de CSS, decisiones |
| `PLAN.md` | Historial de mejoras y decisiones acumuladas |
| `CONTEXT.md` | Contexto técnico completo (en `.gitignore`, solo local) |
