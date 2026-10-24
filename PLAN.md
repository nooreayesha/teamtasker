# TeamTasker plan

Goal: turn the front-end demo into a full-stack team task manager (auth, workspaces, kanban, realtime) with a tested API, e2e tests, CI and a live deployment.

How to use: start a session with "do task N from PLAN.md". One task per session, then commit, tick the box and `/clear`.
Model hint: **S** = Sonnet is enough, **O** = use the stronger model (design or security-sensitive).

## Data model (reference)

```
User ──< Membership(role: OWNER|ADMIN|MEMBER) >── Workspace
Workspace ──< Project ──< Task ──< Comment
Task: title, description, status(TODO|DOING|DONE), priority, dueDate, position, assigneeId?, deletedAt?
Task >──< Label        ActivityLog(workspace, actor, action, entity, createdAt)
```

## Phase 1: Foundation

- [x] **1. Monorepo setup (S).** Convert to npm workspaces: move current app to `apps/web`, add empty `apps/api` and `packages/shared`, root scripts fan out. _Done when:_ existing 12 tests, lint, typecheck and build still pass from the root and CI is green.
- [ ] **2. Database and API skeleton (O).** Neon Postgres connection (`DATABASE_URL`), Prisma schema for the model above, first migration, seed script, Fastify app with `GET /health`, env validation with Zod, `.env.example`. _Done when:_ migrate, seed and `GET /health` all work against Neon, and a test hits `/health`.

## Phase 2: Auth

- [ ] **3. Shared schemas (S).** Zod schemas and types for auth, workspace, project, task in `packages/shared`. _Done when:_ both apps import them and typecheck.
- [ ] **4. Auth API (O).** Register, login, refresh, logout, `GET /me`. Argon2 password hashing, short-lived JWT access token, refresh token in an httpOnly cookie (rotated), auth middleware, rate limiting on login, helmet and CORS. _Done when:_ integration tests cover success, wrong password, duplicate email, expired and invalid tokens.
- [ ] **5. Auth in the web app (S).** Replace the localStorage `AuthContext` with API calls, add React Router with a protected-route wrapper, TanStack Query setup, and sign-in and register pages (keep the a11y and tests). _Done when:_ you can register, log in, reload and stay logged in, and log out; tests updated.

## Phase 3: Core product

- [ ] **6. Workspaces and membership API (O).** Create and list workspaces, roles, a permission helper (`requireRole`), member list. _Done when:_ tests prove a non-member gets 403/404 and a MEMBER cannot do admin actions.
- [ ] **7. Projects and tasks API (S).** CRUD with pagination, filters (status, assignee, priority, text search), soft delete, ordering via `position`. _Done when:_ integration tests cover CRUD, filters, validation errors and permissions.
- [ ] **8. Task list UI (S).** Workspace switcher, project page, task list with create, edit, complete, delete (with undo), filters and search, empty and error states, optimistic updates. _Done when:_ component tests pass and the flow works against the real API.
- [ ] **9. Kanban board (O).** Columns by status, drag-and-drop (dnd-kit) with a keyboard alternative, persisted `position` ordering. _Done when:_ moving a card survives a reload and ordering logic has unit tests.

## Phase 4: Collaboration

- [ ] **10. Invites and members UI (O).** Invite by email with an expiring token (log the link in dev), accept flow, role changes, remove member. _Done when:_ tests cover expired and reused tokens.
- [ ] **11. Comments and activity feed (S).** Comments on tasks, an `ActivityLog` entry for each change, activity panel in the UI.
- [ ] **12. Realtime (O).** Server-Sent Events (or WebSocket) per workspace so board changes appear live for teammates; reconnect handling. _Done when:_ two browser sessions stay in sync (shown in an e2e test).

## Phase 5: Quality and shipping

- [ ] **13. E2E tests (S).** Playwright against the locally running web + API: register, create workspace and task, move a card, reload, permissions check. Add axe accessibility checks.
- [ ] **14. CI hardening (S).** Add `format:check`, coverage with thresholds and a badge, Postgres service for API tests, Playwright job with report artifact, Dependabot, npm cache.
- [ ] **15. Deploy (O).** Web on Vercel, API on Render or Railway, DB on Neon. Env vars, CORS and cookie settings for production, migrations on deploy, seeded demo account and a "Try demo" button. _Done when:_ the live URL works end to end.
- [ ] **16. Portfolio polish (S).** README with live link, screenshot or GIF, architecture diagram and feature list; `TESTING.md`; OpenAPI/Swagger docs at `/docs`; MIT license; favicon and Open Graph tags; short LinkedIn write-up.

## Stretch (only if time allows)

Notifications, file attachments, dashboard charts, CSV export, "system" theme option, React 19 / Tailwind 4 / Vite upgrade.

## Decisions log

- Backend: Fastify + Prisma + PostgreSQL (custom, to show backend skills) instead of Supabase.
- Database for dev: hosted Neon Postgres (Docker not installed; no WSL/virtualization). `docker-compose.yml` is optional later. CI uses a Postgres service container.
- Realtime: SSE first (simpler); switch to WebSocket only if bi-directional messages are needed.
- Open questions: none yet.
