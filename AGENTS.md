# AGENTS.md

Watch customizer: two independent apps (`backend`, `frontend`), each with its own `package.json`/`node_modules`. There is **no root workspace** — run npm commands inside the relevant app dir. Default branch is `master`.

## Docs (`docs/`)

- Per-module/client documentation lives in `docs/*.txt` (e.g. `docs/orders-client.txt`, `docs/db-seeder-client.txt`): functional/non-functional requirements, design decisions, backend endpoints, and frontend module structure.
- When building or changing a feature/module, read the relevant `docs/*` file first, and keep it in sync with the implementation (update endpoints/module structure, mark TODO items done).

## Shared UI (`frontend/src/shared/ui`)

- Prefer shared UI as much as possible for every feature; when it doesn't fit, suggest a change to the shared UI (new atom/variant/prop) rather than duplicating styles in a module. See `docs/shared-ui.txt`.

## Backend (`backend/`) — NestJS 11 + Prisma 7 + Postgres

- Setup order matters (also what the Dockerfile does): `npm install` → `npx prisma generate` → `npm run build` → `npx prisma migrate deploy` before starting.
- Prisma's new `prisma-client` generator writes to `backend/generated/prisma` (gitignored) — run `npx prisma generate` after **any** `schema.prisma` change. Import from `generated/prisma/client` or `generated/prisma/enums`.
- DB URL comes from env var `WH_DATABASE_URL` (not `DATABASE_URL`), wired via `prisma.config.ts`. `.env` lives at `backend/.env`. Local Postgres: `docker compose -f backend/devDb/docker-compose.yml up`.
- NestJS global prefix is `api`; controllers: `watch/*` (constructor logic) and `db-seeder/*` (CRUD for parts/compatibility).
- Dev/run: `npm run start:dev`; prod runs `node dist/src/main`. Lint is `npm run lint` (eslint with `--fix`). Tests: `npm test` (jest, only `*.spec.ts` under `src/`).
- Import convention: absolute paths from `src/...` (e.g. `src/prisma/prisma.service`), not relative.
- Compatibility logic (`watch.service.ts`) is **hardcoded to one fixed dependency tree** (`CASE` → `MOVEMENT`/`BEZEL`; `MOVEMENT` → `HANDS`/`ROTOR`/`DIAL`/`CRYSTAL`), not generic — there's an open TODO to generalize. Don't assume it handles arbitrary trees.

## Frontend (`frontend/`) — Vite + React 19 + zustand + ramda + SCSS modules

- Routes: `/` = watch constructor UI, `/seeder` = DB seeding UI (`src/App.tsx`). No tests, no typecheck script; `npm run build` runs `tsc -b && vite build`. `npm run lint` = `eslint .`.
- `@/` path alias maps to `src/` (vite + tsconfig). Modules use `.module.scss`, `clsx`, zustand stores.
- API base comes from `VITE_BASE_URL` (frontend `.env`, e.g. `http://localhost:3000/api`) and must include the `/api` prefix; shared `request.ts` wraps `fetch`.
- React Router v8: import from `react-router`, not `react-router-dom`.
- 3D rendering (`ThreeDModelDisplayer`) uses `three` + `@react-three/fiber` + `@react-three/drei` (drei `Bounds` auto-fits the camera, `OrbitControls` for rotate/zoom). GLB files are served from `frontend/public/models/` — **copy new exports from `3dModels/` there**; each part's `modelUrl` is the served path (e.g. `/models/bezel/standardBezel.glb`). Empty `modelUrl` = part not rendered. All part exports share a dial-center origin (no per-part offsets).

## Deploy / infra

- CI on push to `master`, path-filtered (`backend/**` or `frontend/**`): builds Docker images `incept1on/watchly-3d-models:back` / `:front`, then `kubectl rollout restart` in namespace `watchly-3d-models`. `VITE_BASE_URL` is passed as a Docker build arg (repo `vars.VITE_BASE_URL`), not read at runtime.
- Migrations deploy via `.github/k8s/db-migration-job.yaml` (runs `npx prisma migrate deploy` with `WH_DATABASE_URL` from the k8s secret).
- Reseed the local DB with `npm run db:seed` in `backend/` (runs `backend/seed.ts`, deletes all parts then recreates them + compatibilities with `/models/...` URLs).
