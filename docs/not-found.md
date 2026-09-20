### purpose:
catch-all 404 page rendered for any unknown route (react-router `<Route path="*">` in `src/App.tsx`).

### structure:
```
frontend/src/modules/notFound
  index.ts                 (exports NotFoundPage via ./page)
  page/
    index.ts
    NotFoundPage.tsx       (component imported by App.tsx — thin shell, no app Header/Footer)
    NotFoundPage.module.scss (positional only: 100vh flex centering)
  components/
    index.ts               (exports NotFoundContent, NotFoundWatchIcon)
    NotFoundContent/       (the 404 visuals + shared Buttons)
      NotFoundContent.tsx  (hero "404", tagline, "Вернуться на главную" / "Перезагрузить")
      NotFoundContent.module.scss
    NotFoundWatchIcon/     (the "0" of the 404 — SVG-as-component, AvitoIcon pattern,
      NotFoundWatchIcon.tsx  IconComponent, exported Figma nodes: Ellipse 8 red ring +
                            Ellipse 7 black ring + Group 8 dial, merged in one <svg>)
```

### behavior:
- hero "404": two Anonymous Pro 280px "4"s flanking `<NotFoundWatchIcon width={190} height={190} />`
  (70% of the original Figma size; digits keep an explicit size — documented display-glyph exception)
- headline "К сожалению, такой страницы не существует" (`$font-size-xl` from shared variables)
- `Button` primary "Вернуться на главную" → `useNavigate()("/")`
- `Button` secondary "Перезагрузить" → `window.location.reload()`
- shared `Button` is used as-is (no style overrides, no `!important`)
- font: "Anonymous Pro" loaded from Google Fonts in `index.html`, with
  `"Courier New", monospace` fallback so the page degrades offline

### source of truth:
Figma frame 35 ("404", 1440x1024) in file `9or5aLYMZbKPzc5FWl7zU4`. The icon markup was
exported via `GET /v1/images/{key}?ids=25:434,25:426,25:433&format=svg` and merged into one
svg (viewBox 0 0 272 272, Group 8 translated by 75.08/79.27, Ellipse 7 by 8/8).