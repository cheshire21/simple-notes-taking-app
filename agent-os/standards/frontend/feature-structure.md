# Feature-Based Frontend Structure

## Folder Layout

```
frontend/
├── app/                # Next.js routing — thin pages only
│   ├── (auth)/         # route group, no URL segment
│   └── (dashboard)/
├── components/
│   ├── ui/             # shadcn components: button, input, form, dialog, label + PasswordInput
│   └── layout/         # Navbar, Sidebar, PageWrapper
├── features/           # all real logic lives here
│   ├── auth/
│   │   ├── components/ # LoginForm, RegisterForm
│   │   ├── hooks/      # useLogin, useRegister, useLogout
│   │   ├── schemas/    # register.schema.ts, login.schema.ts
│   │   ├── api.ts
│   │   └── types.ts
│   └── notes/
│       ├── components/ # NoteCard, NoteList, NoteModal
│       ├── hooks/      # useNotes, useCreateNote, useDeleteNote
│       ├── schemas/    # note.schema.ts, category.schema.ts
│       ├── api.ts
│       └── types.ts
├── hooks/              # shared hooks used by 2+ features
├── lib/                # third-party setup only (axios, react-query)
├── types/              # shared TypeScript types
└── utils/              # pure helper functions
```

## Before Writing Any UI or Styles

**Always read these two files first — in this order:**

1. `app/globals.css` — design tokens (`cream`, `brown`, `salmon`, `yellow-soft`, `teal-soft`, `olive-soft`), font families (`font-linter`, `font-inria-serif`), typography utility classes (`.page-heading`, `.body-text`, `.note-title`), and shadcn CSS variable mappings.
2. `components/ui/` — all available shadcn components. Never build a new primitive if one already exists here.

**Hard rules:**
- Never use hardcoded hex colors — use named tokens (`text-brown`) or shadcn semantic tokens (`text-foreground`, `border-input`)
- Never build a new UI component if one already exists in `components/ui/`
- Never define typography styles inline if a utility class already exists in `globals.css`

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
