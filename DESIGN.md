# KiKi Fragancia — Design System

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#C9A84C` | Primary accent: borders, icons, CTAs, hover states |
| `--ivory` | `#F7F2EA` | Text on dark backgrounds |
| `--dark` | `#0A0A0A` | Section backgrounds (landing dark sections) |
| `--warm` | `#1C1408` | Hero / warm dark backgrounds |
| Gold hover | `#E8C96A` | Hover variant of gold (buttons) |
| WA green | `#25D366` | WhatsApp-specific: WA button, cart success toast, add-to-cart success |
| Amber | `#C4781A` | Cart price accent |

**Critical:** The correct gold is `#C9A84C`. Never use `#B8892A` (old, incorrect value).

## Typography

| Role | Font | Weights |
|------|------|---------|
| Headings / quotes | Cormorant Garamond | 300, 400, 500 |
| Body / UI | DM Sans | 300, 400, 500 |

Load order in `index.html`: Cormorant Garamond → DM Sans.

## Theme Rules

### Dark (landing page)
- Background: `#0A0602` (root) / `#0A0A0A` (sections) / `#1C1408` (warm accent sections)
- Text: `var(--ivory)` / `rgba(247,242,234,0.X)` for muted
- Borders: `rgba(201,168,76,0.1–0.35)`

### Ivory (exception)
- Guarantee/Pilares section uses `#FAFAF8` background with dark text (`#0A0A0A`)
- This is intentional contrast. Do NOT revert to dark.

## CSS Architecture

**Two separate systems — never mix on new components:**

| System | Where used | How |
|--------|-----------|-----|
| kiki CSS classes | Landing page, ProductDetail, BrandStory, Hero, Guarantee | `src/index.css` class names: `.kiki-container`, `.brand-story-section`, etc. |
| Tailwind utilities | Tienda, CartDrawer, InstagramFeed | `@import "tailwindcss"` — Tailwind v4 (no `tailwind.config.js`) |

**Exception:** InstagramFeed uses Tailwind (`grid grid-cols-3 gap-1`) despite being on the landing page. This is a known, intentional exception. Do NOT migrate it.

## Component Rules

### No framer-motion on landing page
`framer-motion` is only used in Tienda (`AnimatePresence`, `motion.div`, `motion.ul`). Landing components use `useScrollReveal` (IntersectionObserver + CSS transition) instead.

### Touch targets
All interactive elements: `minHeight: '44px'`, `minWidth: '44px'`. Enforced via padding or explicit min-height.

### Decorative elements
`<video>`, `<canvas>` elements that are purely decorative must have `aria-hidden="true"`:
- `src/components/Hero.jsx` — `<video aria-hidden="true">`
- `src/components/VaporCanvas.jsx` — `<canvas aria-hidden="true">`
- `src/components/CursorTrail.jsx` — `<canvas aria-hidden="true">`

### Cart / WA flow
- No prices shown in ProductDetail (intentional — catalog pricing strategy)
- Cart shows prices only when `item.price` is a non-zero numeric string
- On WhatsApp consult: drawer closes, green toast (#25D366) shows for 3s
- Add-to-cart button turns #25D366 (green) for 1.8s when `added === true`, then reverts to gold

## Key Decisions Log

| ID | Decision | File |
|----|----------|------|
| D2 | BrandStory right column hidden until real photo exists | `src/components/BrandStory.jsx` |
| D3 | Follower count unified at 110k+ everywhere | `src/components/InstagramFeed.jsx` |
| D4 | Add-to-cart button turns green on success | `src/pages/ProductDetail.jsx` |
| D5 | Tienda empty state: icon + warm copy + 2 CTAs | `src/pages/Tienda.jsx` |
| D6 | CartDrawer closes + green toast on WA click | `src/components/CartDrawer.jsx` |
| D7 | Guarantee/Pilares: minimal gold-line, no icons (intentional) | `src/components/Guarantee.jsx` |
| D9 | InstagramFeed Tailwind: known exception, do not migrate | `src/components/InstagramFeed.jsx` |
| D10 | aria-hidden on video + two canvases | Hero, VaporCanvas, CursorTrail |
