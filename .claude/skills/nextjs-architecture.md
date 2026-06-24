# Next.js Architecture Rules

## Pattern: Next.js App Router + Feature-Based

Pages live in `app/` (Next.js owns routing). All real logic lives in `src/` organized by feature. Pages are thin — they only import and render from features.

---

## Folder Structure

```
frontend/
├── app/                        # Next.js routing (thin pages only)
│   ├── (auth)/                 # route group — no URL segment
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/
│       └── notes/
│           └── page.tsx
├── components/                 # shared reusable UI
│   ├── ui/                     # Button, Input, Modal, Badge...
│   └── layout/                 # Navbar, Sidebar, PageWrapper...
├── features/                   # feature logic
│   ├── auth/
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
