# React Best Practices

Complements `nextjs-architecture.md` (structure) and `nextjs-best-practices.md` (Next.js specifics).
Focus: how to write good React code within the established structure.

---

## Components

- **Use arrow functions** for all components and utilities — `const MyComponent = (): JSX.Element => ...` with a separate `export default`
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
const NoteCard = ({ title, category = "Uncategorized", onClick }: NoteCardProps): JSX.Element => {
  ...
};
export default NoteCard;

// avoid — function declaration
export default function NoteCard({ title }: NoteCardProps): JSX.Element { ... }

// avoid — React.FC adds implicit children and hides return type
const NoteCard: React.FC<NoteCardProps> = ({ title }) => { ... };
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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "fetch_start":   return { loading: true, data: null, error: null };
    case "fetch_success": return { loading: false, data: action.payload, error: null };
    case "fetch_error":   return { loading: false, data: null, error: action.payload };
  }
};
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
export const useNotes = (categoryId?: number) =>
  useQuery({
    queryKey: ["notes", categoryId],
    queryFn: () => getNotes(categoryId),
  });

// features/notes/hooks/useCreateNote.ts
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};
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
- Always memoize the context value with `useMemo`
- For state backed by an external store (localStorage, sessionStorage), use `useSyncExternalStore` — not `useState` + `useEffect` (the `react-hooks/set-state-in-effect` rule forbids calling `setState` synchronously inside an effect)

```tsx
// features/auth/context/AuthContext.tsx
"use client";
import { createContext, useMemo, useSyncExternalStore } from "react";

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue>({ token: null, isAuthenticated: false });

// Stable module-level references — never recreate inside the component
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = () => localStorage.getItem("access_token");
const getServerSnapshot = () => null; // SSR-safe: returns null on the server

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ token, isAuthenticated: token !== null }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// features/auth/hooks/useAuth.ts
export const useAuth = (): AuthContextValue => useContext(AuthContext);
```

### AuthGuard — enforcing access via context

When a context value should gate rendering or trigger navigation, use a dedicated wrapper component rather than putting that logic in the provider or in each page:

```tsx
// features/auth/components/AuthGuard.tsx — the only place redirect logic lives
"use client";
const AuthGuard = ({ children, requireAuth }: { children: React.ReactNode; requireAuth: boolean }) => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (requireAuth && token === null) router.replace("/login");
    else if (!requireAuth && token !== null) router.replace("/dashboard/notes");
  }, [token, requireAuth, router]);

  if (requireAuth && token === null) return null;
  if (!requireAuth && token !== null) return null;
  return <>{children}</>;
};
```

Pages and layouts consume `AuthGuard` — they never contain redirect logic themselves. See `nextjs-architecture.md` → Route Protection for the full pattern.

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

## Unit Testing

### Setup

This project uses **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker):

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom msw
```

Configure in `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

Setup file `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom";
```

---

### What to test

| Layer | Test |
|---|---|
| **Hooks** | State changes, side effects, returned values |
| **Components** | Renders correctly, responds to user interaction |
| **Utils** | Pure function input/output |
| **API functions** | Correct endpoint, payload, response mapping |

Do **not** test implementation details — test behaviour the user or caller can observe.

---

### Testing hooks

Use `renderHook` from `@testing-library/react`. Wrap with `QueryClientProvider` for React Query hooks:

```ts
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLogin", () => {
  it("stores tokens in localStorage on success", async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: "user@example.com", password: "password" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(localStorage.getItem("access_token")).toBeTruthy();
    expect(localStorage.getItem("refresh_token")).toBeTruthy();
  });
});
```

---

### Testing components

Use `render` + `screen` + `userEvent`:

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Queries in priority order** (most accessible → least):
1. `getByRole` — preferred, queries by ARIA role
2. `getByLabelText` — for form fields
3. `getByPlaceholderText` — fallback for inputs
4. `getByText` — for visible text content
5. `getByTestId` — last resort only

---

### Mocking API calls

Use **MSW** to intercept HTTP — never mock the axios instance or API functions directly:

```ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.post("/api/auth/token/", () =>
    HttpResponse.json({ access: "access-token", refresh: "refresh-token" })
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Override per test for error cases:

```ts
it("handles login failure", async () => {
  server.use(
    http.post("/api/auth/token/", () =>
      HttpResponse.json({ detail: "No active account" }, { status: 401 })
    ),
  );
  // ... assert error state
});
```

---

### Test file location and naming

- Co-locate tests next to the file: `hooks/useLogin.ts` → `hooks/useLogin.test.ts`
- One `describe` block per file, one `it` per behaviour
- Describe block name = module name; `it` name = what it does in plain English

```
features/auth/
├── api.ts
├── api.test.ts
├── hooks/
│   ├── useLogin.ts
│   ├── useLogin.test.ts
```

---

### Rules

- Arrow functions only in test files — consistent with production code
- Never use `it.only` or `describe.only` in committed code — use `it.skip` temporarily
- Never mock localStorage manually — use `@testing-library/jest-dom`'s built-in jsdom localStorage
- Clear localStorage between tests: `afterEach(() => localStorage.clear())`
- Each test must be fully independent — no shared mutable state between tests

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
| Mocking axios/api directly | Use MSW to intercept HTTP |
| `getByTestId` as first query | Use `getByRole` first |
| Shared state between tests | `afterEach` cleanup |
