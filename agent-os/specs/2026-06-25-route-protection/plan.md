# Plan: SIM-27 — Route Protection

## Context

Client-side auth guards in the two existing route group layouts. No middleware — token is in localStorage only.

## Files to modify

- `frontend/app/(dashboard)/layout.tsx` — guard: no token → redirect to /login
- `frontend/app/(auth)/layout.tsx` — guard: has token → redirect to /dashboard/notes

## Pipeline

Task 1: Spec docs ✓ | Task 2: PM → In Progress | Task 3: nextjs-engineer | Task 4: QA | Task 5: PM → Done
