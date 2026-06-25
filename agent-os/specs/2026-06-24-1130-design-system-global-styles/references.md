# References for FE Design System & Global Styles

## Similar Implementations

### Root Layout (font loading pattern)

- **Location:** `frontend/app/layout.tsx`
- **Relevance:** The existing pattern for loading Google Fonts via `next/font/google` and applying CSS variables to `<html>`
- **Key patterns:** Font object with `variable` + `subsets` + `weight`, interpolated className on `<html>`

### Global CSS (CSS variable pattern)

- **Location:** `frontend/app/globals.css`
- **Relevance:** Where global base styles and design tokens live; Tailwind v4 entry point
- **Key patterns:** `@import "tailwindcss"` at top, CSS variable definitions, element-level typography

### PostCSS Config

- **Location:** `frontend/postcss.config.mjs`
- **Relevance:** Confirms `@tailwindcss/postcss` processes both `globals.css` and `tailwind.config.ts`
