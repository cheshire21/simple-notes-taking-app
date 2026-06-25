# Plan: SIM-62 — FE Design System & Global Styles Setup

## Context

SIM-62 is the foundation ticket for all frontend styling work. Before any component or page can use consistent design tokens, the Tailwind theme must be extended with the project's custom color palette, the correct Google Fonts must be loaded, and global typography must be defined. This ticket is a prerequisite for Phase 2 (Dashboard Layout) and all subsequent frontend tickets. The product uses a warm aesthetic: cream background, brown text, and accent colors (salmon, yellow-soft, teal-soft, olive-soft).

**Linear ticket:** SIM-62 | Status: Todo → In Progress → Done  
**Milestone:** Phase 2: Dashboard Layout

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-06-24-1130-design-system-global-styles/` with plan, shape, standards, and references files.

---

## Task 2: Project-Manager Agent — Move SIM-62 to In Progress

Project-manager agent updates SIM-62 status from **Todo → In Progress** in Linear before code work begins.

---

## Task 3: nextjs-engineer — Implement Design System

### 3a. `frontend/app/layout.tsx` (modify)

Replace Geist font imports with `Linter` and `Inria Serif` from `next/font/google`, exposing CSS variables `--font-linter` and `--font-inria-serif` on `<html>`.

### 3b. `frontend/tailwind.config.ts` (new file)

Extend `theme.extend` with 6 custom colors (cream, brown, salmon, yellow-soft, teal-soft, olive-soft) and 2 font families (linter, inria-serif).

### 3c. `frontend/app/globals.css` (modify)

Replace default CSS variables with the design system: base body font, typography scale (h1–h3, p, a), and `.note-title` utility class.

### 3d. `frontend/app/design-test/page.tsx` (new, smoke test)

Server component showing all color swatches and typography hierarchy to verify font rendering.

---

## Task 4: Project-Manager Agent — Move SIM-62 to Done

After engineer confirms `npm run lint` passes and fonts render correctly.

---

## Verification

1. `cd frontend && npm run lint` — 0 errors
2. `npm run dev` → visit `/design-test` — Linter and Inria Serif fonts visible
3. DevTools → `<html>` has `--font-linter` and `--font-inria-serif` CSS vars
4. Tailwind classes `bg-cream`, `text-brown`, `font-inria-serif` resolve without error
