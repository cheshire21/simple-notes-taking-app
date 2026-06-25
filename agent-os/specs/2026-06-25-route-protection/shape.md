# Route Protection — Shaping Notes

## Scope

Add client-side auth guards to both route group layouts to protect dashboard routes and redirect authenticated users away from auth pages.

## Decisions

- **No middleware** — ticket suggested middleware + cookies but project uses localStorage only; middleware has no access to localStorage
- **Client-side guard pattern** — `useEffect` checks localStorage on mount, `router.replace` for redirect, return `null` while pending to prevent flash
- `router.replace` over `router.push` — prevents back-button loop after redirect
- `useState(false)` + set to `true` only when authed — ensures children never render for unauthorized users

## Context

- **Visuals:** None
- **References:** `features/auth/hooks/useLogin.ts` — confirms localStorage keys are `access_token` / `refresh_token`
- **Product alignment:** JWT in localStorage, no server-side session
