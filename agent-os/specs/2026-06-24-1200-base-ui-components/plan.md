# Plan: SIM-63 — FE Base UI Components

## Context

Builds the four core reusable UI components (NoteCard, CategoryDropdown, Button, Modal) that are shared across dashboard, notes list, and modals. These block tickets SIM-53, SIM-50, SIM-42, and SIM-35. The design system from SIM-62 is already in place.

## Files

- `frontend/types/index.ts` — add Note + Category types
- `frontend/components/ui/Button.tsx` — new
- `frontend/components/ui/NoteCard.tsx` — new
- `frontend/components/ui/CategoryDropdown.tsx` — new (Client Component)
- `frontend/components/ui/Modal.tsx` — new (Client Component)

## Verification

1. `npm run lint` — 0 errors
2. All 4 components exist under `components/ui/`
3. No `function` declarations, no hardcoded hex colors in components
4. CategoryDropdown opens/closes and calls onChange
5. Modal returns null when isOpen=false, closes on overlay click
