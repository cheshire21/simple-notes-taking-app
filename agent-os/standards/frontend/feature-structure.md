# Feature-Based Frontend Structure

## Folder Layout

```
frontend/
├── app/                # Next.js routing — thin pages only
│   ├── (auth)/         # route group, no URL segment
│   └── (dashboard)/
├── components/
│   ├── ui/             # Button, Input, Modal, Badge, Spinner
│   └── layout/         # Navbar, Sidebar, PageWrapper
├── features/           # all real logic lives here
│   ├── auth/
│   │   ├── components/ # LoginForm, RegisterForm
│   │   ├── hooks/      # useLogin, useRegister, useLogout
│   │   ├── api.ts
│   │   └── types.ts
│   └── notes/
│       ├── components/ # NoteCard, NoteList, NoteModal
│       ├── hooks/      # useNotes, useCreateNote, useDeleteNote
│       ├── api.ts
│       └── types.ts
├── hooks/              # shared hooks used by 2+ features
├── lib/                # third-party setup only (axios, react-query)
├── types/              # shared TypeScript types
└── utils/              # pure helper functions
```

## Pages Are Thin

`app/` pages import and render from features — no logic, no API calls, no state.

```tsx
// app/(dashboard)/notes/page.tsx
import { NoteList } from "@/features/notes/components/NoteList";

const NotesPage = (): JSX.Element => <NoteList />;
export default NotesPage;
```

## Dependency Rules

Dependencies flow downward only. Features never import from other features.

```
app/        → features, components, lib
features/   → components, hooks, lib, types, utils
components/ → lib, types, utils
hooks/      → lib, types
lib/        → nothing internal
```

If two features need the same thing, extract it to the shared layer (`hooks/`, `utils/`, `types/`).
