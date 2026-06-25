# Next.js Architecture Rules

## Pattern: Next.js App Router + Feature-Based

Pages live in `app/` (Next.js owns routing). All real logic lives in `src/` organized by feature. Pages are thin — they only import and render from features.

---

## Folder Structure

```
frontend/
├── app/                        # Next.js routing (thin pages only)
│   ├── layout.tsx              # root layout — mounts Providers
│   ├── providers.tsx           # QueryClientProvider + AuthProvider
│   ├── (auth)/                 # route group — no URL segment
│   │   ├── layout.tsx          # Server Component — <AuthGuard requireAuth={false}>
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/
│       ├── layout.tsx          # Server Component — <AuthGuard requireAuth>
│       └── notes/
│           └── page.tsx
├── components/                 # shared reusable UI
│   ├── ui/                     # Button, Input, Modal, Badge...
│   └── layout/                 # Navbar, Sidebar, PageWrapper...
├── features/                   # feature logic
│   ├── auth/
│   │   ├── components/         # AuthGuard (route protection wrapper)
│   │   ├── context/            # AuthContext + AuthProvider
│   │   ├── hooks/              # useAuth, useLogin, useRegister, useLogout
│   │   ├── api.ts
│   │   └── types.ts
│   └── notes/
├── hooks/                      # shared hooks (used by 2+ features)
├── lib/                        # third-party setup (axios, react-query...)
├── types/                      # shared TypeScript types
└── utils/                      # pure helper functions
```

---

## Feature Structure

Each feature follows the same internal structure:

```
features/
├── auth/
│   ├── components/             # LoginForm, RegisterForm
│   ├── hooks/                  # useLogin, useRegister, useAuth
│   ├── api.ts                  # all API calls for this feature
│   ├── types.ts                # User, LoginPayload, RegisterPayload
│   └── utils.ts                # token helpers, validation
└── notes/
    ├── components/             # NoteCard, NoteList, NoteForm, CategoryBadge
    ├── hooks/                  # useNotes, useCreateNote, useCategories
    ├── api.ts                  # all API calls for this feature
    ├── types.ts                # Note, Category
    └── utils.ts                # note formatting helpers
```

---

## Rules Per Layer

### `app/` — Pages
- Thin wrappers only — no logic, no API calls, no state
- Import and render from `features/`
- Use route groups `(auth)`, `(dashboard)` to organize without affecting the URL

```tsx
// app/(dashboard)/notes/page.tsx
import { NoteList } from "@/features/notes/components/NoteList";

const NotesPage = (): JSX.Element => <NoteList />;

export default NotesPage;
```

---

### `features/` — Feature Logic
- Self-contained — components, hooks, API, types all collocated
- A feature can only import from `components/`, `hooks/`, `lib/`, `types/`, `utils/` — never from another feature directly
- If two features need the same thing, extract it to the shared layer

```tsx
// features/notes/components/NoteCard.tsx
import { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

export const NoteCard = ({ note, onDelete }: NoteCardProps): JSX.Element => { ... };
```

```ts
// features/notes/hooks/useNotes.ts
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../api";

export const useNotes = (categoryId?: number) =>
  useQuery({
    queryKey: ["notes", categoryId],
    queryFn: () => getNotes(categoryId),
  });
```

```ts
// features/notes/api.ts
import api from "@/lib/api";
import { Note, NotePayload } from "./types";

export const getNotes = (categoryId?: number) =>
  api.get<Note[]>("/notes/", { params: { category_id: categoryId } });

export const createNote = (payload: NotePayload) =>
  api.post<Note>("/notes/", payload);

export const deleteNote = (id: number) =>
  api.delete(`/notes/${id}/`);
```

---

### `components/` — Shared UI
- Only generic, reusable components with no feature-specific logic
- `ui/` — primitive components (Button, Input, Modal, Badge, Spinner)
- `layout/` — structural components (Navbar, Sidebar, PageWrapper)

```tsx
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export const Button = ({ variant = "primary", loading, children, ...props }: ButtonProps): JSX.Element => { ... };
```

---

### `lib/` — Third-Party Setup
- One file per library — setup and export only, no business logic
- Axios instance, React Query client, etc.

```ts
// lib/api.ts — axios instance with auth interceptors (tokens in localStorage)
// lib/query-client.ts — React Query client setup
```

---

## Route Protection

This project uses a two-layer pattern for client-side auth guards. Tokens live in `localStorage` — no cookies, no middleware.

### Layer 1 — `AuthProvider` (state)

`features/auth/context/AuthContext.tsx` reads `localStorage` via `useSyncExternalStore` (SSR-safe — no `useState` + `useEffect`). It broadcasts `{ token, isAuthenticated }` to the whole tree and is mounted once in `app/providers.tsx`. It has **zero routing knowledge**.

```tsx
// features/auth/context/AuthContext.tsx
"use client";
import { createContext, useMemo, useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = () => localStorage.getItem("access_token");
const getServerSnapshot = () => null;

export const AuthProvider = ({ children }) => {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ token, isAuthenticated: token !== null }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Layer 2 — `AuthGuard` (enforcement)

`features/auth/components/AuthGuard.tsx` is the **only** `"use client"` file with redirect logic. It accepts `requireAuth: boolean`, blocks rendering synchronously, and fires `router.replace()` in `useEffect`.

```tsx
// features/auth/components/AuthGuard.tsx
"use client";
const AuthGuard = ({ children, requireAuth }) => {
  const { token } = useAuth();
  useEffect(() => {
    if (requireAuth && token === null) router.replace("/login");
    else if (!requireAuth && token !== null) router.replace("/dashboard/notes");
  }, [token, requireAuth, router]);

  if (requireAuth && token === null) return null;   // block + prevent flash
  if (!requireAuth && token !== null) return null;
  return <>{children}</>;
};
```

### Route group layouts (Server Components)

Layouts are thin Server Components — no hooks, no `"use client"`. They delegate the client boundary entirely to `AuthGuard`:

```tsx
// app/(dashboard)/layout.tsx — protects all dashboard routes
const DashboardLayout = ({ children }) => (
  <AuthGuard requireAuth>
    <div className="flex flex-1 flex-col">{children}</div>
  </AuthGuard>
);

// app/(auth)/layout.tsx — redirects logged-in users away from login/register
const AuthLayout = ({ children }) => (
  <AuthGuard requireAuth={false}>
    <div className="flex flex-1 flex-col items-center justify-center p-8">{children}</div>
  </AuthGuard>
);
```

**Rules:**
- Never add redirect logic inside a page component — `AuthGuard` via the layout handles it
- Never add auth logic to `AuthProvider` — it is a pure state provider
- `useAuth()` (`features/auth/hooks/useAuth.ts`) is the only way to read auth state in components

---

## Dependency Rules

Dependencies only flow **downward**. Features never import from other features.

```
app/           → features, components, lib
features/      → components, hooks, lib, types, utils
components/    → lib, types, utils
hooks/         → lib, types
lib/           → nothing internal
utils/         → nothing internal
types/         → nothing internal
```

If `notes` needs the current user → get it from `lib/auth` or a shared context, not from `features/auth`.

---

## Features

There is no fixed list of required features. Each feature is added as the product grows. When adding a new feature:

- Create a new folder under `features/<feature-name>/`
- Follow the internal structure: `components/`, `hooks/`, `api.ts`, `types.ts`, `utils.ts`
- Register its routes under `app/` as needed
- A feature may only import from shared layers (`components/`, `hooks/`, `lib/`, `types/`, `utils/`) — never from another feature directly
