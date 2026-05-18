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

228 productos en `src/data/products-enriched.js`. Sin precios — los clientes consultan por WhatsApp. Todas las imágenes están en `public/products/`.

## Deployment

Vercel — auto-deploy desde `Superhas2407/kiki-fragancia` (branch `main`).

## Documentos del proyecto

| Archivo | Contenido |
|---------|-----------|
| `DESIGN.md` | Sistema de diseño: paleta, tipografía, reglas de CSS, decisiones |
| `PLAN.md` | Plan de mejoras de diseño (design review + eng review completados) |
| `CONTEXT.md` | Contexto completo del proyecto (en `.gitignore`, solo local) |
