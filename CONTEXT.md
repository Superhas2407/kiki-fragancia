# KiKi Fragancia — Project Context

## What this is

E-commerce catalog for a Venezuelan perfume store. Single-page landing + catalog page + product detail. No backend — all data is static. Contact/purchase through WhatsApp.

---

## Tech stack

| Tool | Version |
|------|---------|
| React | 19.2.6 |
| Vite | 8.0.12 |
| Tailwind CSS | v4.3 (uses `@import "tailwindcss"` + `@theme {}` block — NOT v3 config file) |
| React Router | v7.15 |
| framer-motion | v12.38 (only used in Tienda.jsx and WheelPagination.jsx — NOT in landing or product detail) |

Dev: `npm run dev` — runs on localhost:5173 by default.

---

## File structure

```
src/
  App.jsx                       — router, CartProvider, CursorTrail, ErrorBoundary
  main.jsx
  index.css                     — ALL CSS lives here: Tailwind + full kiki design system
  pages/
    Landing.jsx                 — Header + Hero + BrandsMarquee + Guarantee + Catalog + FamiliasSection + BrandStory + Footer
    Tienda.jsx                  — Full catalog page (dark theme, filters, pagination) — uses Tailwind + framer-motion
    ProductDetail.jsx           — Single product page (redesigned, no framer-motion)
  components/
    Header.jsx                  — Fixed nav, CSS transitions only (no framer-motion), mobile fullscreen menu
    Hero.jsx                    — Landing hero with VaporCanvas particles + parallax scroll
    VaporCanvas.jsx             — Canvas-based gold vapor particle animation (used in Hero)
    CursorTrail.jsx             — Fixed canvas cursor trail with gold particles (global, in App.jsx)
    BrandsMarquee.jsx           — Infinite auto-scroll ticker with 18 brands
    Catalog.jsx                 — Featured 6 products on landing (uses FEATURED_IDS)
    ProductCard.jsx             — Card with 3D tilt + gold ripple on hover (dark/light theme prop)
    FamiliasSection.jsx         — 7 olfactory family cards, horizontal drag-scroll + arrows
    Guarantee.jsx               — 3 trust pillars on ivory background
    BrandStory.jsx              — About section (id="nosotros") with animated stat counters
    CartFab.jsx                 — Floating cart button
    CartDrawer.jsx              — Slide-in cart panel
    InstagramFeed.jsx           — Instagram section (not used in landing anymore)
    Footer.jsx                  — Footer (id="contacto"), 3-column grid
    ui/
      gradient-wave.jsx         — WebGL animated gradient canvas (not used anymore — kept for reference)
      WheelPagination.jsx       — Animated pagination for Tienda (uses framer-motion)
  context/
    CartContext.jsx             — Cart state (add/remove/quantity)
  hooks/
    useScrollReveal.js          — IntersectionObserver fade+rise, uses --reveal-dur CSS var
    useAnimCounter.js           — Animated number counter tied to IntersectionObserver
    useCart.js
  data/
    products.js                 — 228 products, exported arrays: products, marcas, familias, tipos, generos
    products-enriched.js        — extended product data (notasSalida, notasCorazon, notasFondo, ocasion, etc.)
public/
  products/                     — product photos (IMG_XXXX.jpg/.JPG)  ← note: /products/ not /images/
  khamrah-hero.jpg              — hero background photo
  hero-hand.png                 — desktop hero right column photo
```

---

## Routes

```
/             → Landing.jsx
/tienda       → Tienda.jsx
/tienda/:id   → ProductDetail.jsx
```

---

## Design system

All component CSS classes live in `src/index.css` under the comment block `/* KiKi Design System v2 — Component Classes */`.

### Colors (CSS variables)

```css
--ivory:    #F7F2EA   /* guarantee section, text light backgrounds */
--ivory-2:  #EDE5D8
--carbon:   #1A1208
--gold:     #C9A84C   /* ← CORRECT gold — NOT #B8892A */
--amber:    #C4781A
--dark:     #0A0A0A
--dark-2:   #111111
--warm:     #1C1408   /* brand story section bg */
--font-d:   'Cormorant Garamond', serif
--font-s:   'DM Sans', sans-serif
--reveal-dur: 0.9s    /* animation speed, overridable */
```

Also defined in `@theme {}` block for Tailwind compatibility (used by Tienda).

**Theme rules:**
- Landing/Hero/Catalog: dark backgrounds (`#0A0602`, `#0D0B08`, `#0A0A0A`)
- Guarantee section: ivory (`var(--ivory)`)
- Brand story: warm dark (`var(--warm)`)
- Tienda: full dark theme `#0A0A0A` page, `#111111` sidebar
- ProductDetail: dark page (`#0A0A0A`), dark detail section (`#161310`)

### Fonts

- Display/headings: `'Cormorant Garamond'` — serif, italic style, weights 300/400/500
- Body/UI: `'DM Sans'` — sans-serif, weights 200/300/400/500
- Both loaded from Google Fonts in `index.css`

### Breakpoints

| Name | Value | What changes |
|------|-------|-------------|
| mobile | < 768px | Hero column layout, product grid 1-col (<480px) or 2-col |
| tablet | 768–1279px | Hero fullscreen overlay, sidebar hidden, nav hidden |
| desktop | ≥ 1024px | Header desktop nav shows, mobile controls hide |
| desktop-xl | ≥ 1280px | Tienda sidebar shows, filter button hides |
| wide | ≥ 1440px | Product grid goes 4 columns |

---

## CSS architecture

Tailwind v4 is imported first in `index.css`. All kiki design system classes are appended after. Both coexist without conflict:
- Landing page components → kiki CSS classes (`.kiki-header`, `.hero-section`, `.pd-layout`, etc.)
- Tienda + cart components → Tailwind utility classes

**Critical rule**: inline styles (`style={{}}`) cannot be overridden by CSS without `!important`. When a component sets an inline style that needs to change at a breakpoint, the CSS class must use `!important`.

### Key CSS classes (kiki design system)

**Layout**
```css
.kiki-container       /* max-width:1280px, padding clamp(20px,5vw,80px) */
.section-pad          /* padding clamp(72px,9vw,120px) 0 */
```

**Header**
```css
.kiki-header          /* fixed, 76px → 68px scrolled, blur + gold border */
.kiki-header.scrolled /* blur backdrop, gold logo, stronger border */
.kiki-desktop-nav     /* display:none base → display:flex at ≥1024px */
.kiki-mobile-controls /* display:flex base → display:none at ≥1024px */
.kiki-mobile-menu     /* fullscreen menu, translateY(-100%) → (0) when .open */
.nav-pill / .nav-pill-item /* desktop nav pill with hover gold fill */
```

**Hero**
```css
.hero-section         /* min-height:100dvh, background:#0A0602 */
.hero-bg / .hero-bg-gradient /* parallax background layer */
.hero-content-wrap    /* positioned content, z-index:3 */
.hero-main-title      /* clamp(38px,5.5vw,80px), Cormorant italic */
.kiki-scroll-indicator /* bottom scroll animation, hidden on mobile */
```

**Marquee**
```css
.marquee-section / .marquee-inner /* 40s infinite scroll, pauses on hover */
```

**Guarantee**
```css
.guarantee-section    /* background: var(--ivory) */
.pillars-grid         /* 1col → 2col@640 → 3col@1024 */
.pillar-card / .pillar-title / .pillar-desc
```

**Catalog / ProductCard**
```css
.catalog-dark / .catalog-light    /* section backgrounds */
.catalog-grid         /* 2col → 3col@768 */
.kiki-product-card    /* flex column, cursor pointer */
.kiki-product-card-dark / .kiki-product-card-light
.card-ripple          /* gold ripple keyframe on mouse enter */
.card-img-wrap / .card-img-placeholder / .card-img-photo
.card-btn             /* full-width CTA, gold border */
```

**Familias**
```css
.familias-section     /* background:#0A0602 */
.familias-scroll      /* overflow-x:auto, snap, no scrollbar, grab cursor */
.familia-card         /* 210px wide, snap-align:start, hover translateY(-5px) */
.familias-arrows      /* prev/next buttons, hidden on mobile */
```

**Brand Story**
```css
.brand-story-section  /* background:var(--warm) */
.brand-story-inner    /* 1col → 2col@1024 */
.brand-story-quote    /* large Cormorant italic with quote-mark pseudo */
.stats-row / .stat-item / .stat-value /* animated counter row */
.brand-story-img-wrap /* hidden on <1024px */
```

**Product Detail**
```css
.pd-page              /* background:#0A0A0A, padding-top:76px */
.pd-main / .pd-layout /* main section, grid 400px 1fr → responsive */
.pd-img-wrap / .pd-img-photo / .pd-img-placeholder / .pd-img-badge
.pd-info / .pd-house / .pd-title / .pd-meta / .pd-desc
.pd-notes-preview / .pd-note-chip / .pd-notes-chips
.pd-actions / .pd-btn-wa
.pd-dark / .pd-dark-inner   /* dark details section */
.pd-pyramid / .pd-pyramid-line / .pd-pyramid-layers
.pd-acordes / .pd-acorde-track / .pd-acorde-bar  /* animated bars */
.pd-cuando-grid / .pd-cuando-card / .pd-cuando-item
.pd-back / .pd-back-link
```

**Footer**
```css
.kiki-footer          /* background:#0A0A0A */
.footer-top-line      /* gold gradient line */
.footer-grid          /* 1col → 2col@640 → 3col@1024 */
.footer-logo / .footer-nav-link / .footer-badge
```

**Animations**
```css
.btn-cta / .btn-shimmer-kiki  /* CTA button with shimmer hover */
.card-ripple                  /* gold ripple keyframe */
@keyframes marqueeScroll      /* 40s infinite ticker */
@keyframes scrollDrop         /* hero scroll line animation */
@keyframes rippleExpand       /* card hover ripple */
```

---

## Header behavior

- Fixed, `z-index: 40`, height 76px (68px when scrolled)
- Background `#0A0A0A` → `rgba(10,8,4,0.93)` + backdrop blur when scrolled
- Logo: "KiKi Fragancia" Cormorant italic, white → gold on scroll
- Desktop nav (≥1024px): pill nav + WhatsApp button
- Mobile (<1024px): hamburger → fullscreen black overlay menu
- No framer-motion — pure CSS transitions

---

## ProductCard behavior

- Accepts `theme` prop: `'dark'` (default) or `'light'`
- On mouse enter: creates gold ripple element at cursor position
- On mouse move: 3D tilt via `perspective(800px) rotateY/rotateX`
- On mouse leave: spring back with cubic-bezier transition
- Image: renders `<img src="/products/${product.image}">` if `product.image` exists, else placeholder
- `product.genero` determines badge color (gold=Masculino, pink=Femenino, white=Unisex)

---

## ProductDetail page

Full redesign — no framer-motion. Key sections:

1. **Main (dark bg)**: image with 3D hover + verified badge + familia label on hover | info column with house/name/meta/description (expand/collapse via `maxHeight` CSS transition) + notes preview + cart button + WhatsApp CTA
2. **Dark section (`#161310`)**: Pirámide del perfume (notes pyramid with gold vertical line) | Acordes principales (animated bars, width transitions from 0% on mount) | Cuándo usarlo (clima + momento grid)

Data lookups:
- `ACORDES_POR_FAMILIA` → bar widths per olfactive family
- `ACORDE_COLOR` → bar color per accord name
- `CUANDO_POR_FAMILIA` → active/inactive clima+momento per family
- `getNoteEmoji()` → emoji per note string
- `parseNotes()` → splits comma-separated note strings

---

## Product data

228 products in `src/data/products-enriched.js`. Each product:
```js
{
  id: number,
  house: string,         // LATTAFA, ARMAF, DIOR, CHANEL, etc.
  name: string,
  image: string,         // filename in public/products/
  familia: string,       // Amaderado, Floral, Oriental, Cítrico, Gourmand, etc.
  tipo: string,          // Eau de Parfum, Eau de Toilette, Extrait, Parfum
  genero: string,        // Masculino, Femenino, Unisex
  ml: number,
  descripcion: string,
  notasSalida: string,   // comma-separated
  notasCorazon: string,
  notasFondo: string,
  ocasion: string,
  estela: string,
  paraQuien: string,
}
```

**Featured product IDs** (used in Catalog.jsx): `[20, 47, 159, 160, 169, 181]`

Filter arrays exported from `products.js`: `marcas`, `familias`, `tipos`, `generos`.

**Image path**: `/products/IMG_XXXX.jpg` (served from `public/products/`) — NOT `/images/`.

---

## Tienda page (Tienda.jsx)

Dark theme throughout. Uses Tailwind + framer-motion. Key features:
- Left sidebar (≥1280px): sticky, `height: calc(100vh - 76px)`, scrollable, `#111111` bg
- Mobile/tablet: filter drawer triggered by "Filtros" button — framer-motion spring slide
- Search: filters by name + house
- Filters: genero, familia, tipo checkboxes
- Pagination: 12 per page, WheelPagination component
- Product grid: CSS class `tienda-product-grid` (responsive cols)

---

## Global components (in App.jsx)

- **CursorTrail**: fixed canvas at `z-index:9999`, gold particles following cursor. Always active.
- **CartFab + CartDrawer**: wrapped in ErrorBoundary

---

## Cart

`CartContext.jsx` provides `cart`, `addItem`, `removeFromCart`, `updateQty`. CartFab shows badge count with pulse animation. CartDrawer slides in from right.

---

## WhatsApp

All purchase/contact CTAs: `https://wa.me/584120221983`

WA message format for product detail:
```js
`Hola, me interesa *${product.house} ${product.name}*. ¿Podrías darme más información?`
```

---

## Known architectural decisions

1. **Dual CSS systems**: Tailwind v4 for Tienda/cart, kiki custom CSS for landing/product-detail. They coexist — don't mix them on new landing components.
2. **Gold color**: `#C9A84C` is the correct gold everywhere. The old `#B8892A` in Tailwind `@theme` was incorrect — updated.
3. **No framer-motion on landing**: Landing page and ProductDetail use only CSS transitions. Framer Motion stays in Tienda.jsx and WheelPagination.jsx only.
4. **Inline styles vs CSS**: Dynamic values (hover state, scroll state, mount animation) → inline `style={{}}`. Static/responsive layout → CSS classes. When both conflict, CSS needs `!important`.
5. **No prices**: Products intentionally have no price field — customers ask via WhatsApp.
6. **No backend**: Everything is static. No auth, no cart persistence, no checkout.
7. **useScrollReveal**: The hook applies inline styles directly to the element (opacity + transform). `--reveal-dur` CSS variable controls duration (default 0.9s).
8. **useAnimCounter**: Ties an animated number to IntersectionObserver. Returns `{ val, ref }` — attach `ref` to the container element.
