# Plan: SIM-35 — Dashboard Shell & Layout

## Context

Static dashboard shell — no data fetching. `(dashboard)/layout.tsx` and `AuthGuard` already exist. `LogoutButton` already built. All `/dashboard/notes` redirects updated to `/dashboard`.

## Files to create/modify

| File | Action |
|------|--------|
| `public/boba-empty.png` | Boba illustration asset |
| `app/(dashboard)/page.tsx` | Thin page |
| `components/layout/DashboardShell.tsx` | Two-column wrapper |
| `components/layout/Sidebar.tsx` | Left sidebar + LogoutButton |
| `components/layout/NotesArea.tsx` | Right area + empty state |
| `features/auth/components/LoginForm.tsx` | `/dashboard/notes` → `/dashboard` |
| `features/auth/components/AuthGuard.tsx` | `/dashboard/notes` → `/dashboard` |
| `features/auth/components/LoginForm.test.tsx` | Update redirect assertion |

## Tasks

1. Save spec docs ✓
2. PM → SIM-35 In Progress ✓
3. nextjs-engineer implements
4. QA verifies done criteria
5. PM → Done (only if QA READY)
