# Repository Guidelines

## Project Scope
- Personal deep-work tracker with one active task/session at a time.
- Users create tasks, start/pause/resume a timer, and mark sessions complete.
- Session history (task, duration, date) persists locally via IndexedDB; no syncing, AI, or automation in v1.

## Project Structure & Module Organization
- Next.js + React + Tailwind + shadcn/ui. Use the `app/` directory for routes, shared layouts, and metadata.
- Feature folders (`app/sessions`, `app/tasks`) bundle pages, components, hooks, and tests for each concern.
- `components/` stores reusable UI primitives; `lib/domain/` contains pure business logic; `lib/storage/` wraps persistence (IndexedDB adapter now, swappable later).

## Build, Test, and Development Commands
- `npm install`: install dependencies and sync the lockfile.
- `npm run dev`: Next.js dev server with hot reload at `http://localhost:3000`.
- `npm run build`: production bundle; run before packaging or deployment.
- `npm run lint`: ESLint + Prettier via Next.js to verify formatting and imports.
- `npm run test`: Vitest + React Testing Library (configured in `vitest.config.ts`).

## Coding Style & Naming Conventions
- TypeScript everywhere, 2-space indentation, functional React components and hooks (`useSessionTimer`, `useTaskManager`).
- File names follow the feature (`SessionTimer.tsx`, `TaskList.tsx`); tests end in `.test.ts` or `.test.tsx`.
- Tailwind utilities inline; shared styles and shadcn/ui overrides go in `components/ui/`. Run `npm run lint` before commits.

## Testing Guidelines
- Unit-test domain logic (timer math, session transitions) with Vitest.
- React Testing Library for user flows (start/pause/resume, history rendering) using descriptive test names.
- Use `npm run test -- --coverage` to watch critical logic; target ≥85% coverage on `lib/domain` to avoid regressions.

## Commit & Pull Request Guidelines
- Conventional Commits (`feat: add session timer hook`, `fix: persist history on reload`).
- Keep PRs scoped to one feature; include summary, screenshots/gifs for UI, and testing notes.
- Link issues or TODOs for follow-up items; request review when possible, even for solo work, to practice the habit.

## Architecture Overview
1. **Next.js shell** supplies routing, layouts, and optional API routes.
2. **UI layer** combines React, Tailwind, and shadcn/ui components organized per feature.
3. **Hooks + state** mediate between UI and domain logic; start with local state, grow into context/Zustand if needed.
4. **Domain layer** defines models and rules (one active session, duration rounding, validation).
5. **Persistence adapter** abstracts IndexedDB so migrating to Supabase/Postgres later only touches that layer.
6. **Utilities** host time-format helpers, configuration, and future notification logic.
