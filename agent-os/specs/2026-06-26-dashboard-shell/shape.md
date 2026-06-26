# Dashboard Shell — Shaping Notes

## Scope

Static two-column dashboard layout (SIM-35). Sidebar left, notes area right. Empty state with boba illustration when no notes. No data fetching in this ticket.

## Decisions

- Route: `app/(dashboard)/page.tsx` (not `/notes/page.tsx`)
- All `/dashboard/notes` redirects updated to `/dashboard`
- Sidebar: hardcoded placeholder categories (real data comes in Phase 2)
- LogoutButton: bottom of sidebar (`mt-auto`)
- Empty state: boba illustration + italic serif text centered in notes area
- Responsive: sidebar `hidden md:flex`, full-width content on mobile
- No unit tests — pure layout, lint + build are sufficient verification

## Context

- **Visuals:** `visuals/mockup.png`
- **References:** `app/(dashboard)/layout.tsx`, `LogoutButton.tsx`, `globals.css`
- **Product alignment:** Phase 2 Dashboard Layout — SIM-9 parent epic

## Standards Applied

- frontend/feature-structure — `components/layout/` for shared layout
- frontend/code-style — arrow functions, double quotes, explicit return types, Tailwind + shadcn
