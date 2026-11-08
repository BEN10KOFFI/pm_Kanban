# Frontend agent guide

This directory contains the Next.js frontend for the project management MVP. The app is a browser-based Kanban board demo, statically exported to `out/` and served by the FastAPI backend in the Docker image.

## Current state

The frontend is a React + Next.js application built with TypeScript.

Key files and responsibilities:
- `src/app/page.tsx`: app entry page used to mount the app shell.
- `src/components/AuthGate.tsx`: login gate and session-based sign-in/sign-out flow.
- `src/components/KanbanBoard.tsx`: main board UI; renders the column layout, drag-and-drop logic, and board-level actions.
- `src/components/KanbanColumn.tsx`: column container and per-column card list.
- `src/components/KanbanCard.tsx`: individual card presentation.
- `src/components/KanbanCardPreview.tsx`: drag overlay preview for the active card.
- `src/components/NewCardForm.tsx`: form used to add a new card to a column.
- `src/lib/kanban.ts`: board data model, movement logic, and helper functions such as `moveCard` and `createId`.
- `src/lib/auth.ts`: dummy credential validation and session authentication state.
- `src/components/AuthGate.test.tsx`: tests for login visibility, credential validation, and sign-out.
- `src/lib/kanban.test.ts`: unit tests for board logic.
- `src/components/KanbanBoard.test.tsx`: component tests for rendering, editing, and card creation.

## Stack

- Next.js 16
- React 19
- TypeScript
- Next.js static export (`output: "export"`)
- Vitest for unit tests
- Playwright for end-to-end browser tests
- `@dnd-kit` for drag-and-drop interactions

## Coding patterns

- Prefer small, focused components over large monolithic UI files.
- Keep business logic in `src/lib` when it is reusable and testable.
- Use server-safe patterns for app code; no browser-only assumptions outside the client boundary when a component is marked with `"use client"`.
- Keep the implementation simple and aligned with the MVP requirement rather than adding abstraction that is not yet needed.

## Test commands

Run all unit tests:
```bash
npm run test:unit
```

Run the browser tests:
```bash
npm run test:e2e
```

Run the full frontend suite:
```bash
npm run test:all
```

## Important implementation notes

- The current demo board is local in-memory state, not yet persisted to a backend.
- The sign-in is an MVP-only client-side gate using `user` / `password`; it is not server-side authentication or a security boundary.
- A successful sign-in is stored in `sessionStorage` and survives reloads in the same browser tab/session.
- `npm run build` creates the static site in `out/`; FastAPI serves this content at `/` in the integrated Docker app.
- The board uses a fixed set of columns that are currently editable by title.
- Cards can be moved by drag-and-drop and added/deleted from within each column.
- The app is expected to evolve into a login-gated, backend-backed Kanban board later in the project.

## Working assumptions for future changes

- Keep the board data model consistent with the future SQLite-backed backend.
- Preserve test coverage when changing card movement or board state updates.
- Treat the current state as a front-end prototype rather than the final persistent architecture.
