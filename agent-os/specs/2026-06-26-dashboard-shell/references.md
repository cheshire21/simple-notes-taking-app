# References for Dashboard Shell

### `app/(dashboard)/layout.tsx`

- **Relevance:** Already exists, do not modify. Wraps all dashboard routes with `<AuthGuard requireAuth>`.

### `features/auth/components/LogoutButton.tsx`

- **Relevance:** Import into `Sidebar.tsx` at the bottom (`mt-auto`).

### `globals.css`

- **Relevance:** `bg-cream`, `text-brown`, `font-serif` tokens already defined. Check before writing any colors.

### `features/auth/components/LoginForm.tsx` + `AuthGuard.tsx`

- **Relevance:** Both redirect to `/dashboard/notes` — update to `/dashboard`.
