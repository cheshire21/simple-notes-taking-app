# Auth Flow

## Two-layer pattern

**Layer 1 — AuthProvider** (state only, zero routing knowledge)
- Reads `access_token` from `localStorage` via `useSyncExternalStore`
- `getServerSnapshot` returns `null` — SSR-safe, no hydration flash
- Mounted once in `app/providers.tsx`; broadcasts `{ token, isAuthenticated }`
- Never holds redirect logic

**Layer 2 — AuthGuard** (enforcement only)
- The only component allowed to redirect based on auth state
- `requireAuth={true}` — redirects to `/login` if unauthenticated
- `requireAuth={false}` — redirects to `/dashboard/notes` if authenticated
- Returns `null` (blocks render) synchronously, fires `router.replace()` in `useEffect`
- Used in route group layouts (`(auth)/layout.tsx`, `(dashboard)/layout.tsx`) — never in pages

```tsx
// (auth)/layout.tsx — keeps logged-in users away from /login and /register
<AuthGuard requireAuth={false}>{children}</AuthGuard>

// (dashboard)/layout.tsx — keeps unauthenticated users away from the app
<AuthGuard requireAuth>{children}</AuthGuard>
```

## useRegister does NOT store tokens

The `useRegister` mutation returns tokens from the API but intentionally does not write them to localStorage. Token storage is the login flow's responsibility — registration sends the user to `/login` so they authenticate explicitly.

```ts
// correct — no onSuccess storage
export const useRegister = () => useMutation({ mutationFn: register });

// wrong — storing tokens here would bypass the login step
export const useRegister = () => useMutation({
  mutationFn: register,
  onSuccess: ({ access, refresh }) => {
    localStorage.setItem("access_token", access);   // ✗ don't do this
  }
});
```

## useSyncExternalStore — why not useState + useEffect

`useState + useEffect` causes a hydration mismatch: the server renders with `null` but the client immediately re-renders with the stored token, causing a flash. `useSyncExternalStore` with `getServerSnapshot = () => null` eliminates this.

```ts
const subscribe = (cb) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = () => localStorage.getItem("access_token");
const getServerSnapshot = () => null; // SSR returns null, no hydration flash
```
