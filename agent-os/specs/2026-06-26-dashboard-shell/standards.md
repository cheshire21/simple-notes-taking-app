# Standards for Dashboard Shell

## frontend/feature-structure

- Shared layout components go in `components/layout/` (not inside features/)
- Pages are thin — import and render a single layout/shell component
- Check `globals.css` and `components/ui/` before writing custom styles

## frontend/code-style

- Arrow functions only — no `function` declarations
- Double quotes everywhere
- Explicit return types: `: JSX.Element`
- No hardcoded hex — use Tailwind tokens (`bg-cream`, `text-brown`)
- Use `next/image` for all `<img>` tags
