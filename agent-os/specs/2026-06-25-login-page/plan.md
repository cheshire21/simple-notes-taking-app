# Plan: SIM-31 — Login Page

## Context

Frontend Login Page. Backend endpoint (`POST /api/auth/token/`) already live. `useLogin`, `login()` API, and `LoginPayload` type all already implemented. This task builds the form, schema, page route, and tests — mirroring RegisterForm exactly.

## Files to create

| File | Notes |
|------|-------|
| `public/cactus-login.png` | Cactus illustration |
| `features/auth/schemas/login.schema.ts` | Zod schema |
| `features/auth/components/LoginForm.tsx` | Client component |
| `app/(auth)/login/page.tsx` | Thin page |
| `features/auth/hooks/useLogin.test.tsx` | Hook tests |
| `features/auth/components/LoginForm.test.tsx` | Component tests |

## Tasks

1. Save spec docs ✓
2. PM → SIM-31 In Progress ✓
3. nextjs-engineer implements
4. QA verifies done criteria
5. PM → Done (only if QA READY)
