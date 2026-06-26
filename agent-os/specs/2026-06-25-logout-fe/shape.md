# Logout FE — Shaping Notes

## Scope

Build `LogoutButton` component (SIM-34). `useLogout` hook and `logout()` API are already implemented. Component calls the hook, then explicitly redirects to `/login` on success.

## Decisions

- `useLogout` already clears both tokens in its `onSuccess` — component must NOT touch localStorage
- Must call `router.push("/login")` explicitly after success — `useSyncExternalStore` only fires on `storage` events (cross-tab), so same-tab token removal does NOT auto-redirect
- Button states: "Logout" (default), "Logging out…" (pending), disabled while pending
- No output serializer — hook returns void

## Context

- **Visuals:** None
- **References:** `useLogout.ts`, `api.ts`, `LoginForm.test.tsx` (vi.hoisted pattern)
- **Product alignment:** Phase 1 Authentication — last ticket to close SIM-8 (User Logout epic)

## Standards Applied

- frontend/auth-flow — useLogout clears tokens; explicit router.push after success
- frontend/code-style — arrow functions, double quotes, explicit return types
- frontend/testing — MSW, vi.hoisted, localStorage.clear() in afterEach
