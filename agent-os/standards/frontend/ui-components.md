# UI Components

## Component library

This project uses **shadcn/ui** for all primitive UI components. Before building anything new, check `components/ui/` first.

Available components: `button`, `input`, `form`, `dialog`, `label`, `PasswordInput`

## Component-as-folder pattern

When a component has more than one logical piece (sub-components, private icons, internal helpers), convert it from a single file to a folder:

```
components/ui/PasswordInput/
├── index.tsx          # main component — public entry point
├── EyeClosedIcon.tsx  # private SVG icon
└── EyeOpenIcon.tsx    # private SVG icon
```

- `index.tsx` is the public entry — external imports stay unchanged (`@/components/ui/PasswordInput`)
- Sub-files are private — never import `EyeClosedIcon` from outside the folder
- Use this pattern for any component with icons, sub-components, or internal helpers

## Custom SVG icons

Custom icons live as separate `.tsx` files inside the component folder — never inline SVG paths in the component itself.

```tsx
// EyeClosedIcon.tsx
import type { JSX } from "react";

const EyeClosedIcon = (): JSX.Element => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    ...
  </svg>
);

export default EyeClosedIcon;
```

- Always use `currentColor` for stroke/fill — icon inherits color from parent's `text-*` class
- Size via `width`/`height` on the SVG element, not Tailwind classes
- Export as default
