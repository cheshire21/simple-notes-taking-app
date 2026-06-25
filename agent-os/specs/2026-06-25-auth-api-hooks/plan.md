# Plan: SIM-26 — Auth API & Hooks

## Context

Creates the auth feature module on top of the existing `lib/api.ts` axios instance.

## Files to create

- `frontend/features/auth/types.ts` — LoginPayload, RegisterPayload, AuthTokens, AuthUser
- `frontend/features/auth/api.ts` — login(), register(), logout()
- `frontend/features/auth/hooks/useLogin.ts`
- `frontend/features/auth/hooks/useRegister.ts`
- `frontend/features/auth/hooks/useLogout.ts`

## Pipeline

Task 1: Spec docs ✓ | Task 2: PM → In Progress | Task 3: nextjs-engineer | Task 4: QA | Task 5: PM → Done
