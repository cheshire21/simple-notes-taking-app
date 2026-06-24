# React Best Practices

Complements `nextjs-architecture.md` (structure) and `nextjs-best-practices.md` (Next.js specifics).
Focus: how to write good React code within the established structure.

---

## Components

- One component per file, filename matches the export name
- Keep components small — if it scrolls, split it
- Prefer composition over configuration: pass `children` or slot props rather than a growing list of boolean flags
- Avoid prop drilling beyond 2 levels — lift state or use context

```tsx
// bad — configuration props that should be composition
<Modal title="Delete?" showFooter showCancelButton showConfirmButton confirmLabel="Yes" />

// good — composable
<Modal>
  <Modal.Header>Delete?</Modal.Header>
  <Modal.Footer>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    <Button variant="danger" onClick={onConfirm}>Yes</Button>
  </Modal.Footer>
</Modal>
```

---

## Props

- Destructure at the function signature, not inside the body
- Set default values in destructuring
- Use `ComponentProps<typeof X>` to extend an existing component's props without repeating them
- Avoid `React.FC` — just type props directly on the function

```tsx
// good
function NoteCard({ title, category = "Uncategorized", onClick }: NoteCardProps) { ... }

// avoid
const NoteCard: React.FC<NoteCardProps> = ({ title }) => { ... }
```

---

## State

- Keep state as local as possible — only lift when two components genuinely share it
- Derive values from existing state instead of storing them separately

```tsx
// bad — redundant derived state
const [notes, setNotes] = useState<Note[]>([]);
const [noteCount, setNoteCount] = useState(0); // derived!

// good
const [notes, setNotes] = useState<Note[]>([]);
const noteCount = notes.length; // computed
```

- Use `useReducer` when multiple state fields change together or transitions have names

```tsx
type State = { loading: boolean; data: Note[] | null; error: string | null };
type Action =
  | { type: "fetch_start" }
  | { type: "fetch_success"; payload: Note[] }
  | { type: "fetch_error"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch_start":  return { loading: true, data: null, error: null };
    case "fetch_success": return { loading: false, data: action.payload, error: null };
    case "fetch_error":  return { loading: false, data: null, error: action.payload };
  }
}
```

- Never mutate state directly — always return a new object or array

```tsx
// bad
state.notes.push(newNote);
setState(state);

// good
setState((prev) => ({ ...prev, notes: [...prev.notes, newNote] }));
```

---

## Effects

`useEffect` is for syncing with external systems (DOM, subscriptions, timers). It is not for data fetching in Next.js — use Server Components or React Query.

- Always clean up subscriptions and timers
- Every variable used inside the effect belongs in the deps array — fix the root cause rather than suppressing the lint warning
- If you're computing a value from state/props, use `useMemo` — not an effect

```tsx
// bad — derived state in an effect
useEffect(() => {
  setFilteredNotes(notes.filter((n) => n.categoryId === selectedCategory));
}, [notes, selectedCategory]);

// good — compute directly
const filteredNotes = useMemo(
  () => notes.filter((n) => n.categoryId === selectedCategory),
  [notes, selectedCategory]
);
```

```tsx
// effect with proper cleanup
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 50);
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);
```

---

## Custom Hooks

- Extract into a custom hook when logic is used by 2+ components, or when a component's state logic is complex enough to obscure its render output
- Name with `use` prefix — never call hooks conditionally or in loops
- A hook should return a stable, minimal interface — not the full internal state

```tsx
// features/notes/hooks/useNotes.ts
export function useNotes(categoryId?: number) {
  return useQuery({
    queryKey: ["notes", categoryId],
    queryFn: () => getNotes(categoryId),
  });
}

// features/notes/hooks/useCreateNote.ts
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
```

---

## Event Handlers

- Name local handlers `handleX`, prop callbacks `onX`
- Extract handlers out of JSX when they exceed one expression

```tsx
// bad
<button onClick={() => { validate(data); submit(data); setLoading(true); }}>

// good
<button onClick={handleSubmit}>
```

---

## Performance

Do not over-optimize. Profile before you `memo`.

- `memo` — wrap a component when it re-renders often with the same props and rendering is measurably slow
- `useMemo` — memoize expensive computations or referentially stable values passed to memoized children
- `useCallback` — stabilize a callback that is a dependency of an effect or passed to a `memo`'d child
- Never use array index as a key for reorderable or dynamic lists — use a stable unique id

```tsx
// bad key
{notes.map((note, i) => <NoteCard key={i} note={note} />)}

// good key
{notes.map((note) => <NoteCard key={note.id} note={note} />)}
```

---

## Context

- Use for truly global concerns: authenticated user, theme, locale
- Split by concern — one context per domain, not one giant `AppContext`
- Always memoize the context value

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, logout }), [user, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

---

## Forms

- Controlled inputs for forms needing real-time validation or dynamic fields
- Uncontrolled inputs + `FormData` for simple submit-only forms
- Validate on the client for UX, always re-validate on the server for security
- Use React Hook Form for complex forms — don't hand-roll validation logic

---

## TypeScript

- Type all props with an explicit `interface` or `type`
- Avoid `as` type assertions — fix the type properly
- Use `satisfies` for config objects where you want inference but also type-checking
- Prefer `unknown` over `any` for values you haven't inspected yet

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Storing derived values in state | Compute them inline or with `useMemo` |
| Missing effect cleanup | Return a cleanup function |
| `useEffect` for data fetching | Use React Query or Server Components |
| Defining components inside render | Move them to module scope |
| Index as list key | Use a stable unique id |
| Mutating state directly | Return a new object/array |
| `any` on prop types | Proper `interface` / `type` |
