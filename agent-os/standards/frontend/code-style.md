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

## Linting

Run `npm run lint` before every commit. ESLint rules enforce:
- Arrow functions (no function declarations in components/hooks)
- No underscore-prefixed identifiers (`_retry` → `retried`)
- Double quotes
- Explicit return types
