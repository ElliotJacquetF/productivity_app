# productivity_app

Productivity app for deep work sessions built with Next.js, TypeScript, Tailwind, and shadcn/ui. The goal is to make it easy to plan, run, and review focused work blocks using a Pomodoro-style cadence and lightweight task tracking.

## What the app does (initial scope)
- Plan a deep work session in blocks (default 25/5 Pomodoro) with a start time and selectable end time.
- Track one active session at a time; timer shows whether you’re in work or break and the time remaining.
- Manage tasks/subtasks: add, edit, reorder by priority, delete, and mark as done (done items move to a separate section).
- Keep a live history of the current session: each time slot lists what was done; you can annotate the current or past slots.
- Automatically save sessions locally so history survives reloads; no syncing between machines.
- Allow editing of time slots mid-session to handle longer breaks or early stops.
- Show desktop notifications (no sound) for work/break transitions.

## Original workflow inspiration
Deep work is planned as sequential time slots (e.g., 9:05–9:30, 9:35–10:00, etc.). A TODO list of tasks/subtasks is defined before starting. As each slot ends, you note which tasks were advanced. This app mirrors that flow with timers, editable slot history, and task management in one place.

## Feature list
### Main
- Timer for deep work sessions: Pomodoro technique (25 min work, 5 min break) with editable slots.
- Task management: add, edit, delete tasks.
- Subtasks: break down tasks into smaller, manageable parts.
- Easy prioritization: drag and drop tasks to reorder them.
- Work session history: log completed time slots with associated tasks.
- Work session planning: visualize all Pomodoro slots in a session with the ability to edit them.

### Secondary (future)
- Statistics: charts to track productivity over time.
- Notifications: reminders for work/break transitions (pop-up only).

## Getting started (dev)
```bash
npm install
npm run dev
# open http://localhost:3000
```
Edit `src/app/page.tsx` (or feature folders you add under `src/app/`) to start building. The app auto-reloads on save.

## Helpful scripts
- `npm run dev` — start the Next.js dev server.
- `npm run build` — production build.
- `npm run lint` — ESLint (with Tailwind plugin).
- `npm run test` — Vitest/RTL (add after installing test tooling).

## Project structure (planned)
- `src/app/` — routes, layouts, feature pages (e.g., `sessions`, `tasks`).
- `src/components/` — shared UI primitives (including shadcn/ui components).
- `src/lib/domain/` — pure business logic for sessions/tasks (start/pause/resume/complete).
- `src/lib/storage/` — persistence adapters (IndexedDB now, swap later).
- `public/` — static assets.

## Notes
- This is a personal, single-user app running locally; no syncing between machines.
- No AI features in v1; architecture leaves room to add them later.
