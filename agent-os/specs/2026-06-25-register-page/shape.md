# Register Page — Shaping Notes

## Scope

Register page at `/register` matching the provided mockup. Email + password form. On success → redirect to `/login` (no auto-login). Field-level error display from API.

## Decisions

- **No auto-login on register** — per ticket spec: no localStorage writes after registration; user must log in separately
- **`useRegister` fix required** — current hook stores tokens in `onSuccess`; must remove that to avoid AuthGuard bouncing user away from `/login`
- **No form library** — use controlled `useState`; project has no react-hook-form/zod installed
- **Reuse `Button` component** — `components/ui/Button.tsx` with `variant="outline" fullWidth`
- **Cat illustration** — no asset in `/public/`; engineer leaves a TODO placeholder

## Context

- **Visuals:** `visuals/mockup.png` — warm cream background, sleeping cat, "Yay, New Friend!" heading
- **References:** `features/auth/hooks/useLogin.ts` (similar mutation pattern), `components/ui/Button.tsx`
- **Product alignment:** Phase 1 Authentication — prerequisite for SIM-31 (Login Page)

## Standards Applied

- `frontend/feature-structure` — thin page, form logic in `features/auth/components/`
- `frontend/code-style` — arrow functions, double quotes, explicit return types
- `frontend/auth-tokens` — no token reads/writes in components
