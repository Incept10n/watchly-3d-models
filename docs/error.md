### purpose:
"что-то пошло не так" page — shown when a render error is caught by the `ErrorBoundary`, when a
global `error`/`unhandledrejection` fires, or directly at the `/error` route (preview/testing).

### structure:
```
frontend/src/modules/error
  index.ts                 (exports ErrorPage, ErrorBoundary)
  page/
    index.ts
    ErrorPage.tsx          (component imported by App.tsx — thin shell, no app Header/Footer)
    ErrorPage.module.scss  (positional only: 100vh flex centering)
  components/
    index.ts               (exports ErrorBoundary, ErrorContent)
    ErrorContent/          (hero "ой!", heading, shared Buttons)
      ErrorContent.tsx
      ErrorContent.module.scss
    ErrorBoundary/         (class component guard)
      ErrorBoundary.tsx
  hooks/
    index.ts
    useGlobalErrorRedirect.ts  (window error/unhandledrejection → /error, ignores AbortError)
```

### guard behaviour (App.tsx):
- `<ErrorBoundary>` wraps the whole UI (Routes + ModalHost): any React render/lifecycle error
  swaps in `<ErrorPage/>` inline (SPA, no reload)
- `useGlobalErrorRedirect` (modules/error/hooks) registers `window` `error` + `unhandledrejection`
  listeners; non-`AbortError` failures are `console.error`-logged then routed to `/error` via
  `useNavigate()` (SPA navigation — no reload, so console output survives). `App.tsx` itself stays
  routing-only.
- route `/error` → `<ErrorPage />`; `*` → 404 page

### behaviour of the page:
- hero "ой!" (Anonymous Pro, 280px — 70% of the design's 400px, documented display-glyph exception)
- heading "Что-то пошло не так" (`$font-size-xl` from shared variables)
- `Button` primary "Вернуться на главную" → `useNavigate()("/")`
- `Button` secondary "Перезагрузить" → `window.location.reload()`
- shared `Button` used as-is (no overrides, no `!important`)
- font: "Anonymous Pro" from Google Fonts in `index.html`, `"Courier New", monospace` fallback

### source of truth:
Figma node `39:2296` in file `9or5aLYMZbKPzc5FWl7zU4` (1440x1024 white frame, copy provided
by the designer; artwork intentionally omitted by design decision).