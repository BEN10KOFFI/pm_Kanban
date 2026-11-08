# Detailed implementation plan

This document breaks the project into explicit, testable stages. Each part is treated as a checkpoint with concrete checklist items, verification commands, and success criteria. Work should not proceed to the next phase until the current phase passes its checks and the user approves the plan.

## Current project status and local runtime

- Parts 1 and 2 are complete and approved.
- Part 3 is complete: the user confirmed the Kanban board displays from the Docker app.
- Part 4 is complete: sign-in uses the required `user` / `password` credentials and remains active for the current browser session until sign-out or session end.
- The sign-in is an MVP-only client-side gate, not server-side authentication or a security boundary.
- The frontend is a static Next.js export served by FastAPI from `/`.
- Docker maps host port `8001` to container port `8000`. Use `http://localhost:8001/`; port `8000` previously returned the old placeholder page in the user's environment. The exact cause of that port-8000 response was not established.
- Drag-and-drop targeting uses pointer intersection first with a nearest-corner fallback. A real browser check and the user confirmed moving a card between columns works and the card leaves its source column. The browser test asserts both conditions.
- On Windows, from the repository root, start with `.\scripts\start.ps1` and stop with `.\scripts\stop.ps1`. The start script builds and starts the Compose service and reports a non-zero Compose exit code.
- On macOS/Linux, use `./scripts/start.sh` and `./scripts/stop.sh`.
- Confirm the service with `docker compose ps`; the host port should show `8001->8000`. The root page should show Kanban Studio with five columns. API checks are `http://localhost:8001/api/health` and `http://localhost:8001/api/hello`.
- The current board is demo-only in-memory frontend state. Changes are lost on page reload; database persistence is planned for later phases.

## Part 1: Planning and repo guidance

Goal: confirm scope, document the current frontend architecture, and gain approval before implementation begins.

Checklist:
- [ ] Review the root project requirements and constraints from [AGENTS.md](../AGENTS.md).
- [ ] Review the existing frontend codebase and summarize the current app structure.
- [ ] Add a detailed execution plan to this document with milestones, substeps, and verification gates.
- [ ] Create [frontend/AGENTS.md](../frontend/AGENTS.md) to describe the current frontend code, test harness, and implementation conventions.
- [ ] Present the plan to the user and wait for approval before starting the next phase.

Tests and validation:
- Verify that the planning document explicitly lists all major phases and checkpoints.
- Verify that the frontend guidance file describes the current app shape and commands.
- Confirm there are no code changes beyond documentation and repo guidance in this phase.

Success criteria:
- The project roadmap is clear and approved.
- The frontend codebase has a written guide for future agent work.
- The team is ready to begin scaffolding without ambiguity.

---

## Part 2: Scaffolding the app runtime

Goal: create the containerized local stack with Docker, a Python FastAPI app, and startup/shutdown scripts.

Checklist:
- [x] Create the Docker configuration needed to run the app locally.
- [x] Set up the backend directory with a FastAPI application that exposes a simple health or example endpoint.
- [x] Add a minimal root route or example HTML page to prove the service is serving content locally.
- [x] Add an API endpoint that can be called from the running app to confirm backend connectivity.
- [x] Add Mac, Windows, and Linux start/stop scripts under [scripts/](../scripts/).
- [x] Verify the project boots locally and both static and API responses are available.

Tests and validation:
- Run the startup scripts and confirm the app serves a page on `/`.
- Hit the backend API endpoint and confirm a successful response payload.
- Confirm the app can be stopped cleanly without leaving processes behind.

Success criteria:
- A working local development stack is running.
- The app serves sample content and responds over HTTP.
- The backend and scripts are ready for the frontend to be attached.

---

## Part 3: Frontend integration and production serving

Goal: adapt the frontend so it is built and served by the backend, with the Kanban board visible at `/`.

Checklist:
- [x] Review the existing Next.js frontend and ensure it is compatible with the backend-serving architecture.
- [x] Configure the app to build as static assets or Next output that can be served by FastAPI.
- [x] Update the app entry point to render the current demo Kanban board at `/`.
- [x] Verify the integrated app in the containerized local environment, not only as a standalone front-end dev server. The user confirmed the board displays after publishing the app on host port 8001.
- [x] Add unit and integration tests covering the Kanban rendering and the page-level structure.

Tests and validation:
- [x] Run the frontend unit tests for the Kanban board and data logic.
- [x] Run the Playwright/browser test to confirm the page loads and renders the board.
- [x] Confirm the app loads from the served backend route, not only via `npm run dev`.

Success criteria:
- The board is visible at `/` in the integrated app.
- Demo board interactions work in the served environment.
- Frontend behavior is protected by automated tests.

---

## Part 4: Fake sign-in flow

Goal: gate access to the board behind a simple login screen using the required dummy credentials.

Checklist:
- [x] Add a sign-in screen that appears before the board is visible.
- [x] Implement the hardcoded credentials `user` / `password`.
- [x] Reject invalid credentials with a visible error state.
- [x] Add a sign-out flow that returns the user to the login view.
- [x] Persist the sign-in state for the current session only, consistent with the MVP requirement.
- [x] Add tests for successful login, failed login, and logout behavior.

Tests and validation:
- [x] Unit tests for authentication and login/logout behavior (9 frontend unit tests passed).
- [x] Browser tests for invalid credentials, valid login, session persistence on reload, logout, and board interactions (4 tests passed against FastAPI serving the static export).
- [x] Validate that the board is hidden until login; the exported page renders the login screen initially.

Success criteria:
- The board is inaccessible without valid credentials.
- The login experience is easy to use and tested.
- The sign-out flow returns to a clean authenticated state.

---

## Part 5: Database modeling and schema proposal

Goal: define the persistent board model for multiple users and one board per user, then document it and obtain sign-off.

Checklist:
- [ ] Define a schema for users, boards, columns, and cards.
- [ ] Keep the MVP limited to one board per signed-in user, while leaving room for future multi-user support.
- [ ] Save the schema as JSON under [docs/](../docs/).
- [ ] Document the database approach, data lifecycle, and migration strategy for local SQLite.
- [ ] Present the schema to the user and confirm the design before backend implementation.

Tests and validation:
- Validate the schema is consistent with the application model.
- Check that it supports board persistence, column editing, and card movement.
- Confirm the file is machine-readable JSON and easy to review.

Success criteria:
- The database design is approved by the user.
- The schema covers the required MVP and future extensibility.
- The implementation can proceed without architectural confusion.

---

## Part 6: Backend API and database persistence

Goal: add backend routes to read and update the Kanban board for a signed-in user.

Checklist:
- [ ] Create SQLite database initialization logic so the DB is created automatically when missing.
- [ ] Define the backend models and repository functions for board, column, and card persistence.
- [ ] Add read endpoints for fetching the current board state.
- [ ] Add write endpoints for renaming columns, creating cards, deleting cards, and moving cards.
- [ ] Add backend unit tests that cover each mutation and fetch operation.
- [ ] Validate that routes operate precisely for the current user context.

Tests and validation:
- Run backend unit tests for all endpoints and data mutation paths.
- Test database creation when no SQLite file exists.
- Confirm the board state remains consistent after repeated moves and edits.

Success criteria:
- The backend writes and reads the board reliably.
- Database creation is automatic and safe.
- There is clear evidence that each API route behaves correctly.

---

## Part 7: Frontend connected to the backend

Goal: replace local in-memory board state with persistent backend-backed state.

Checklist:
- [ ] Replace the current demo-only state management with API calls to the backend.
- [ ] Fetch the board on login and after updates.
- [ ] Update the frontend to send card moves, renames, and creation/deletion actions to the API.
- [ ] Handle loading, error, and refresh states without breaking the user experience.
- [ ] Add end-to-end tests covering the real UI flow against the running backend.

Tests and validation:
- Browser tests verifying board loads from persistent data.
- State transition tests for drag-and-drop and column changes.
- Ensure the UI stays consistent after refresh or re-login.

Success criteria:
- The board is persistent across API-backed updates.
- The UI reflects backend changes with no stale state.
- The application behaves like a real project management tool rather than a demo.

---

## Part 8: AI connectivity via Groq

Goal: ensure the backend can successfully call Groq using the configured model and API key.

Checklist:
- [ ] Configure the Groq client code with the environment setting from the project root `.env`.
- [ ] Use the model `openai/gpt-oss-120b` as specified in the project requirements.
- [ ] Add a minimal connectivity test that asks the model a trivial prompt such as `2 + 2`.
- [ ] Confirm the backend returns a valid result and the service is responding.
- [ ] Document any required environment setup and error handling for missing credentials.

Tests and validation:
- Run a backend test that sends a simple prompt and expects a valid response.
- Confirm the model returns a proper answer rather than a connection or auth error.

Success criteria:
- AI connectivity is proven in the local environment.
- The project is ready to attach board-aware prompting workflows.

---

## Part 9: Structured AI board assistance

Goal: send the board JSON plus user question and conversation history to the model, then parse structured output containing user-facing content and optional board updates.

Checklist:
- [ ] Build a backend request payload that includes the current board JSON, the user question, and relevant conversation history.
- [ ] Define a strict structured-output schema for AI responses with both message text and optional card/board updates.
- [ ] Validate that the model can produce structured updates without malformed output.
- [ ] Add backend logic to apply valid AI changes to the board if they are present.
- [ ] Add thorough tests for standard prompts, invalid outputs, and valid board edits.

Tests and validation:
- Unit tests for payload composition and schema parsing.
- Tests covering AI responses that do and do not update the board.
- Validation of message content and structured update logic.

Success criteria:
- The AI can answer questions about the board and optionally modify it.
- Board updates are applied only when the response is valid and safe.
- The system is ready for a user-facing chat UI.

---

## Part 10: AI sidebar chat and automatic refresh

Goal: add the sidebar chat experience and let AI-driven board changes refresh the board automatically in the UI.

Checklist:
- [ ] Add a persistent AI chat sidebar to the frontend layout.
- [ ] Connect the chat to the backend AI route.
- [ ] Send the current board state and chat history to the backend.
- [ ] Display AI responses in the sidebar and render board updates when the model requests them.
- [ ] Refresh the UI automatically after valid AI-driven board changes.
- [ ] Add tests for chat interactions and AI-triggered board updates.

Tests and validation:
- End-to-end tests for sending a prompt and receiving a reply.
- Tests for AI updates to cards, columns, or board ordering.
- Confirm the UI refreshes after AI changes without a full page reload.

Success criteria:
- The user can chat with the AI and see a live board update when applicable.
- The sidebar experience is polished, functional, and test-covered.
- The MVP matches the original business requirements.

---

## Definition of done

The project is considered complete only when all ten phases above pass their tests and the required user sign-off checkpoints are complete. Implementation should remain simple, local-first, and aligned to the original MVP constraints.
