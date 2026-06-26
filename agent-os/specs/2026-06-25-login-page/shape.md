# Login Page — Shaping Notes

## Scope

Build the Login Page (SIM-31): schema, LoginForm component, page route, and unit tests. The backend endpoint and all auth hooks are already in place.

## Decisions

- Mirror RegisterForm exactly — same layout, same shadcn Form pattern, same error handling
- Image: cactus illustration (not the cat from register)
- Title: "Yay, You're Back!"
- Button: "Login" / "Logging in…"
- Link: "Oops! I've never been here before" → /register
- On success: `router.push("/dashboard/notes")` — useLogin already stores tokens in its onSuccess, no localStorage writes in the component
- Password schema: `min(1)` not `min(8)` — login shouldn't re-validate password complexity

## Context

- **Visuals:** `visuals/mockup.png` (full page), `visuals/cactus.png` (illustration)
- **References:** RegisterForm.tsx, useLogin.ts, register.schema.ts, RegisterForm.test.tsx
- **Product alignment:** Phase 1 Authentication — closes SIM-7 (User Login epic)

## Standards Applied

- frontend/forms — react-hook-form + zod + shadcn Form
- frontend/auth-flow — useLogin stores tokens; AuthGuard handles post-login redirect
- frontend/code-style — arrow functions, double quotes, explicit return types
- frontend/testing — MSW, vi.hoisted, localStorage.clear() in afterEach
