# Frontend Code Style

## Arrow Functions — Always

Use arrow functions for all components, hooks, and utilities. Never `function` declarations.

```tsx
// correct
const NoteCard = ({ note }: NoteCardProps): JSX.Element => {
  return <div>{note.title}</div>;
};
export default NoteCard;

// wrong — function declaration
export default function NoteCard({ note }: NoteCardProps) { ... }

// wrong — React.FC (hides return type, adds implicit children)
const NoteCard: React.FC<NoteCardProps> = ({ note }) => { ... };
```

## Quotes

Double quotes everywhere — enforced by Prettier.

```tsx
const label = "My Note";
<Button variant="primary">Save</Button>
```

## TypeScript

- Type all props with an explicit `interface` or `type` — never `any`
- Explicit return types on all components and hooks: `: JSX.Element`, `: void`, `: string`
- Avoid `as` assertions — fix the type properly
- `unknown` over `any` for uninspected values

```tsx
interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps): JSX.Element => { ... };
```

## Hooks

```ts
// features/notes/hooks/useNotes.ts
export const useNotes = (categoryId?: string) =>
  useQuery({
    queryKey: ["notes", categoryId],
    queryFn: () => getNotes(categoryId),
  });

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};
```

## Styling

This project uses **Tailwind v4** + **shadcn/ui**. Before writing any Tailwind classes or UI elements:

1. Read `app/globals.css` first — color tokens, font families, typography utility classes
2. Read `components/ui/` — use existing shadcn components before building anything new

```tsx
// wrong — hardcoded hex, builds a custom input
<input className="border border-[#957139] text-[#5c3d1e]" />

// correct — uses design tokens, reuses shadcn Input
import { Input } from "@/components/ui/input";
<Input className="text-brown" />
```

## Linting

Run `npm run lint` before every commit. ESLint rules enforce:
- Arrow functions (no function declarations in components/hooks)
- No underscore-prefixed identifiers (`_retry` → `retried`)
- Double quotes
- Explicit return types
