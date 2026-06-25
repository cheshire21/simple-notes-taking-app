# FE Base UI Components — Shaping Notes

## Scope

Four reusable components in `components/ui/`: Button, NoteCard, CategoryDropdown, Modal. These are display/interaction primitives — no data fetching, no feature logic.

## Decisions

- `Note` and `Category` types go in `types/index.ts` (shared, used across all features)
- `Button` and `NoteCard` are Server Components (pure display)
- `CategoryDropdown` and `Modal` are Client Components (need useState/useEffect)
- Card colors passed as props — no hardcoded category colors inside components
- Click-outside for CategoryDropdown via `useRef` + `useEffect` with `mousedown`
- Modal uses standard fixed positioning (no React portal needed at this stage)

## Context

- **Visuals:** Figma mockup screenshot provided — shows NoteCard with teal bg, CategoryDropdown open/closed states, Button pill shape, Modal X button
- **References:** `frontend/app/globals.css` (design tokens), `frontend/types/index.ts` (existing types to extend)
- **Product alignment:** Phase 2: Dashboard Layout milestone

## Standards Applied

- **code-style** — Arrow functions, double quotes, explicit TypeScript return types
- **feature-structure** — Shared UI in `components/ui/`, no cross-feature imports
- **react-best-practices** — Client components only where state/effects needed
