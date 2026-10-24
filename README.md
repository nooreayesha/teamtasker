# TeamTasker

A simple, accessible task manager front-end built with **React**, **TypeScript**, **Vite** and **Tailwind CSS**.

> **Status:** early development. The app shell (sign-in, dashboard, light/dark theme) is in place; task management is the next milestone. See the [roadmap](#roadmap).

<!-- Add a screenshot or GIF here once the task board is built:
![TeamTasker screenshot](docs/screenshot.png) -->

## Features

- Sign in with a display name (front-end only demo session, remembered in `localStorage`)
- Light / dark theme: follows your OS setting, can be toggled, and is remembered
- Keyboard-friendly, labelled form with clear validation messages
- Typed codebase (TypeScript, strict mode) with automated tests and CI

> **Security note:** the sign-in is a demo only. There is no backend and no real authentication, so do not store sensitive data in this app.

## Tech stack

| Area     | Tools                                          |
| -------- | ---------------------------------------------- |
| UI       | React 18, Tailwind CSS 3                       |
| Language | TypeScript (strict)                            |
| Tooling  | Vite 5, ESLint 9, Prettier                     |
| Testing  | Vitest, React Testing Library, user-event      |
| CI       | GitHub Actions (type check, lint, test, build) |

## Getting started

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev      # start the dev server
```

### Scripts

| Command              | What it does                                          |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                             |
| `npm run build`      | Type-check, then create a production build in `dist/` |
| `npm run preview`    | Serve the production build locally                    |
| `npm run typecheck`  | Run the TypeScript compiler (no emit)                 |
| `npm run lint`       | Lint with ESLint                                      |
| `npm run format`     | Format all files with Prettier                        |
| `npm test`           | Run the test suite once                               |
| `npm run test:watch` | Run tests in watch mode                               |

## Project structure

```
src/
  contexts/     AuthContext (demo session) and ThemeContext (light/dark)
  pages/        SignIn and Dashboard screens
  test/         Test setup
  App.tsx       Chooses the screen based on sign-in state
  main.tsx      Entry point
```

## Roadmap

- [x] Project tooling, TypeScript, tests and CI
- [ ] Tasks: create, edit, complete, delete (saved in the browser)
- [ ] Filters, search, priorities and due dates
- [ ] Responsive layout and accessibility audit
- [ ] Upgrade to React 19, Tailwind 4 and a currently supported Vite version
- [ ] Deploy to static hosting and add end-to-end tests

## License

Personal portfolio project. Add a license of your choice before accepting contributions.
