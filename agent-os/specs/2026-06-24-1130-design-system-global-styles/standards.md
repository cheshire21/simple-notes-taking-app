# Standards for FE Design System & Global Styles

The following standards apply to this work.

---

## code-style

Arrow functions always (never `function` declarations or `React.FC`). Double quotes everywhere (Prettier enforced). TypeScript: explicit interfaces/types, explicit return types (`: JSX.Element`, `: void`, `: string`), avoid `as`, use `unknown` over `any`. ESLint rules enforce arrow functions, no underscore-prefixed identifiers, double quotes, explicit return types.

---

## feature-structure

Folder layout: `app/` (thin pages only), `components/` (ui/, layout/), `features/` (per-feature: components/hooks/api/types), `hooks/`, `lib/`, `types/`, `utils/`.

Dependency rules (downward only):
- `app/` → features, components, lib
- `features/` → components, hooks, lib, types, utils
- `components/` → lib, types, utils
- Features never import from other features

Global styles live in `app/globals.css`. Pages in `app/` should be thin — no logic.
