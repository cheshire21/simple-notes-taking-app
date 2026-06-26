# Create Category FE — Shaping Notes

## Scope

Inline form in sidebar. "+ Add Category" button toggles a name input. Submit → POST /api/categories/ → invalidate ["categories"] query → close form.

## Decisions

- Inline form (not modal) — single text input for name, color defaults to "#94a3b8"
- Esc key cancels form
- Placeholder categories stay until SIM-42 replaces them with real data
- No user FK on Category — global resource
- Query invalidation uses ["categories"] key to match SIM-42's future useGetCategories hook

## Context

- **Visuals:** Sidebar mockup from SIM-35
- **References:** features/auth/ API/hook/schema/form patterns
