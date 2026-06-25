# FE Design System & Global Styles — Shaping Notes

## Scope

Configure the Tailwind design system and global typography so all FE tickets can use consistent tokens. Three files are modified/created: `layout.tsx` (font loading), `tailwind.config.ts` (theme extension), `globals.css` (base styles + typography). A smoke-test page is added to satisfy the done criteria.

## Decisions

- Use `tailwind.config.ts` as specified in ticket, even though project uses Tailwind v4 CSS-first config — `@tailwindcss/postcss` picks up both
- Add `frontend/app/design-test/page.tsx` as a smoke-test server component (deletable after verification)
- Replace all default Next.js Geist font vars — no backwards compat needed since no components use them yet
- "Linter" font name to be verified at build time (may not exist on Google Fonts — engineer should confirm)

## Context

- **Visuals:** Ticket itself (Linear SIM-62) contains full color palette table and typography scale table
- **References:** `frontend/app/layout.tsx` (current font loading pattern), `frontend/app/globals.css` (current CSS vars)
- **Product alignment:** Warm aesthetic (cream/brown) matches product mission of minimal, clean interface

## Standards Applied

- **code-style** — Arrow functions, double quotes, explicit TypeScript types
- **feature-structure** — Thin `app/` pages, global styles in `app/globals.css`
