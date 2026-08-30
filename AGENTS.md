# AGENTS.md

Watch customizer: two independent apps (`backend`, `frontend`), each with its own `package.json`/`node_modules`. There is **no root workspace** — run npm commands inside the relevant app dir. Default branch is `master`.

## Docs (`docs/`)

- Per-module/client documentation lives in `docs/*.txt`, one per feature plus shared UI:
  `docs/watch-constructor.txt`, `docs/db-seeder-client.txt`, `docs/orders-client.txt`, `docs/shared-ui.txt`.
- Read the relevant `docs/*` file **before** working on a module, and keep it in sync with the implementation (update endpoints/module structure, mark TODO items done).

## Shared UI (`frontend/src/shared/ui`)

- Prefer shared UI for every feature; when it doesn't fit, extend the shared UI (new atom/variant/prop) instead of duplicating styles in a module. See `docs/shared-ui.txt` (incl. the modal system: `ModalHost` mounted once in `App.tsx`, `pushModal`/`runSequence`, `RublesIcon` instead of `$`).

## Backend (`backend/`) — NestJS 11 + Prisma 7 + Postgres

- Setup order matters (also what the Dockerfile does): `npm install` → `npx prisma generate` → `npm run build` → `npx prisma migrate deploy` before starting.
- Prisma's new `prisma-client` generator writes to `backend/generated/prisma` (gitignored) — regenerate after **any** `schema.prisma` change. Import from `generated/prisma/client` or `generated/prisma/enums`.
- Prisma 7 requires a driver adapter: every `PrismaClient` is built with `new PrismaPg(new Pool({ connectionString: WH_DATABASE_URL }))` (see `prisma.service.ts`, `seed.ts`). DB URL comes from env var `WH_DATABASE_URL` (not `DATABASE_URL`), wired via `prisma.config.ts`. `.env` lives at `backend/.env`. Local Postgres: `docker compose -f backend/devDb/docker-compose.yml up` (`network_mode: host`, port 5432).
- NestJS global prefix is `api`; controllers: `watch/*` (constructor/compat logic), `db-seeder/*` (CRUD for parts/compatibility), `order/*` (`POST /order`, `GET /order?uid=&page=&limit=`, `GET /order/:uid` — see `docs/orders-client.txt`).
- Dev/run: `npm run start:dev`; prod runs `node dist/src/main`. Lint is `npm run lint` (eslint with `--fix`). Jest is configured for `*.spec.ts` under `src/` but **no spec files exist yet** — `npm test` currently runs nothing.
- Import convention: absolute paths from `src/...` (e.g. `src/prisma/prisma.service`), not relative.
- Compatibility logic (`watch.service.ts`) is **hardcoded to one fixed dependency tree** (`CASE` → `MOVEMENT`/`BEZEL`; `MOVEMENT` → `HANDS`/`ROTOR`/`DIAL`/`CRYSTAL`), not generic — there's an open TODO to generalize. Don't assume it handles arbitrary trees.
- Reseed the DB with `npm run db:seed` in `backend/` (compiles `seed.ts`, deletes all parts + compatibilities, recreates them with `/models/...` + `/pictures/...` URLs). Against prod: `kubectl port-forward postgresql-0 2398:5432 -n watchly-3d-models`, then `npm run db:seed`.

## Frontend (`frontend/`) — Vite + React 19 + zustand + ramda + SCSS modules

- Routes: `/` = watch constructor UI, `/seeder` = DB seeding UI, `/orders` = admin order list (`src/App.tsx`). No tests, no typecheck script; `npm run build` runs `tsc -b && vite build`. `npm run lint` = `eslint .`.
- `@/` path alias maps to `src/` (vite + tsconfig). Modules use `.module.scss`, `clsx`, zustand stores. New `VITE_*` env vars must be declared in `src/env.d.ts` too.
- API base comes from `VITE_BASE_URL` (frontend `.env`, e.g. `http://localhost:3000/api`) and must include the `/api` prefix; shared `request.ts` wraps `fetch`.
- React Router v8: import from `react-router`, not `react-router-dom`.
- 3D rendering (`ThreeDModelDisplayer`) uses `three` + `@react-three/fiber` + `@react-three/drei` (drei `Bounds` auto-fits the camera, `OrbitControls` for rotate/zoom). New part exports: **copy GLBs from `3dModels/` to `frontend/public/models/`** (served at `/models/...`) **and** add a thumbnail to `frontend/public/pictures/` (`/pictures/...`). Empty `modelUrl` = part not rendered. All part exports share a dial-center origin (no per-part offsets).

## Deploy / infra

- CI on push to `master`, path-filtered (`backend/**` or `frontend/**`): builds Docker images `incept1on/watchly-3d-models:back` / `:front`, then `kubectl rollout restart` in namespace `watchly-3d-models`. `VITE_BASE_URL` is passed as a Docker build arg (repo `vars.VITE_BASE_URL`) and baked into the SPA build, not read at runtime.
- Migrations deploy via `.github/k8s/db-migration-job.yaml` (a `db-migration` Job running `npx prisma migrate deploy` with `WH_DATABASE_URL` from the k8s secret).