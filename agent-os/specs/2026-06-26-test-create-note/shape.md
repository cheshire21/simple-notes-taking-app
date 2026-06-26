# Test Create Note — Shaping Notes

## Decisions
- NoteFactory uses SubFactory(CategoryFactory) — no user SubFactory (ownership via category)
- Test title="" to verify full_clean() catches blank CharField
- Test nonexistent UUID to verify category ownership check
