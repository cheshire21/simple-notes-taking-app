# Auth API & Hooks — Shaping Notes

## Scope

Feature-layer auth module: types, API functions, React Query mutation hooks.

## Decisions

- `lib/api.ts` already exists — all API calls go through it, never raw axios
- Tokens stored in localStorage under `access_token` and `refresh_token` keys (already used by interceptors)
- Silent refresh on 401 already handled by `lib/api.ts` interceptor — hooks don't need to handle it
- `logout()` sends `{ refresh }` to `/api/auth/logout/` to blacklist the token server-side

## Context

- **Visuals:** None
- **References:** `frontend/lib/api.ts`, `frontend/lib/query-client.ts`
- **Product alignment:** JWT auth with localStorage storage, email-only login
