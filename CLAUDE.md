# TeamTasker

Full-stack team task manager (portfolio project). Work is tracked in `PLAN.md`: do one task per session, then commit.

## Stack

- **Web:** React 18, TypeScript (strict), Vite, Tailwind 3, React Router, TanStack Query
- **API:** Node, TypeScript, Fastify, Prisma, PostgreSQL, Zod, JWT (access token + httpOnly refresh cookie)
- **Shared:** Zod schemas and types in `packages/shared`
- **Tests:** Vitest + React Testing Library (web), Vitest + Fastify `inject` (API), Playwright (e2e)
- **Infra:** npm workspaces monorepo, hosted Postgres (Neon free tier) for dev, GitHub Actions CI. Docker is not installed on the dev machine; a `docker-compose.yml` is optional later.

## Layout (target)

```
apps/web/          React app
apps/api/          Fastify API, Prisma schema in apps/api/prisma/
packages/shared/   Zod schemas + shared types
e2e/               Playwright tests
```

## Commands

Run from the repo root (they fan out to the workspaces):

- `npm run dev` start the web app
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
- `npm run format` / `npm run format:check`
- `npm run <script> --workspace @teamtasker/web` (or `/api`, `/shared`) runs a script in one package
- API: `npm run dev --workspace @teamtasker/api` (port 3000); DB scripts in `apps/api`: `db:migrate`, `db:seed`, `db:studio`
- Database: `DATABASE_URL` in `apps/api/.env` points at a Neon Postgres (use a separate Neon branch/database for tests)

Before committing, `typecheck`, `lint` and `test` must pass.

## Conventions

- Match the existing style: strict TS, small files, no `any`, Prettier formatting, double quotes.
- Validate every API input with a Zod schema from `packages/shared`; never trust the client.
- Authorize on the server for every route (workspace membership + role). Never rely on the UI hiding things.
- Never commit secrets. Use `.env` (ignored) and keep `.env.example` current.
- Accessibility matters: labelled controls, visible focus, keyboard support, `role="alert"` for errors.
- Every feature ships with tests. API routes get integration tests against a real test database.
- Commits: Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`), one logical change each.
- The old front-end-only sign-in (localStorage) is a demo; it is replaced by real auth in PLAN tasks 4-5.

## Working style (keep token use low)

- Read only the files a task needs; prefer targeted edits over rewriting files.
- Don't start the next PLAN task without being asked. Tick the finished task in `PLAN.md`.
