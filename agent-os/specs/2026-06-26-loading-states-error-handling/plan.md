# Plan: SIM-21 — Loading States & Error Handling

## Context

SIM-21 asks for loading spinners, skeleton states, and user-friendly error messages throughout the app. An audit of the codebase shows that loading/error states already exist but are all plain text ("Loading…", "Failed to load notes."). This plan upgrades them to skeleton UIs and improves error recovery with retry actions.

## Files to create/modify

| File | Change |
|------|--------|
| `components/ui/Skeleton.tsx` | Create — base animate-pulse component |
| `components/ui/NoteCardSkeleton.tsx` | Create — skeleton card matching NoteCard shape |
| `components/layout/NotesArea.tsx` | Replace text loading with skeleton grid; add retry to error |
| `components/layout/Sidebar.tsx` | Replace text loading with skeleton items; add retry to error |

## Pipeline

Task 1: Save spec docs
Task 2: PM → SIM-21 In Progress
Task 3: nextjs-engineer implements 4 files above
Task 4: QA verifies done criteria
Task 5: PM → SIM-21 Done (only if QA READY)
