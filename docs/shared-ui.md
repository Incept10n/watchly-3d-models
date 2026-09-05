### purpose:
single place for shared, domain-agnostic frontend building blocks in `frontend/src/shared/ui`
(plus the modal store in `frontend/src/shared/store` and styles in `shared/styles/_variables.scss`).
Domain modules (watchConstructor, dbSeeder, ordersClient) consume these so the UI stays consistent.

### principles:
- use shared ui as the default for every feature; reach for it BEFORE writing custom markup/styles
- when shared ui does not fit a use case, propose a change to shared ui (new atom/variant/prop,
  generalize an existing one) and implement it there — do not silently duplicate styles in a module
- keep everything here domain-agnostic: no watch/order/part vocabulary in shared components
- a module's own, single-use visuals live in the module (`*.module.scss`); shared = used in 2+ places
- expose new components via the barrel exports (`atoms/index.ts`, `orgaisms/index.ts`,
  `icons/index.ts`, `templates/index.ts`, `ui/index.ts`)

### structure:
```
frontend/src/shared/ui
  atoms/
    Button        (variants: secondary (default), primary; props extend <button>, className appended last)
    Heading       (h2, font-size-xl from _variables)
    WatchlyLogo   (SVG icon, IconComponent)
    WatchlyLink   (link styled per theme; renders react-router Link for `/internal` paths, <a> otherwise)
    Tooltip       (bare positional tooltip: children + position, portaled to body, pointer-events:none)
    HoverTooltip  (hover wrapper: tracks cursor, cloneElement's caller tooltip with position, edge-flipping)
  molecules/      (reserved — currently empty)
  orgaisms/
    Header        (leftIcon | headerName | rightInfo)
    Footer        (Heading + legal links (/public-offer, /privacy-policy) + social icons from VITE_* urls)
    Modal         (portal overlay + panel, dismissible CloseIcon, zIndex, overlay-click close)
    ModalHost     (renders modal queue + sequence from useModalStore, Escape handling)
  templates/
    BasePage      (header / children / footer slots)
  icons/
    CloseIcon
    RublesIcon    (money displays — use instead of "$")
frontend/src/shared/store
  modalStore.ts   (zustand: queue + sequence)
frontend/src/shared/styles
  _variables.scss ($font-size-xl/base/sm, $color-primary, $watchly-inset-shadow)
frontend/src/shared/types
  models.ts  (Part, PartType, PART_TYPES)
  props.ts   (IconComponent = FC<SVGProps<SVGSVGElement>>)
  utils.ts   (Nullable<T>)
```

### modal system (useModalStore + ModalHost):
- modal *content* components receive no Modal wrapper — ModalHost wraps queue/sequence content in `Modal`
  portals itself (see `ContactUsModal`, `CommunicationChoiceModal`, `DeletePartConfirmModal`)
- `pushModal({ id, content, dismissible?, onClose? })` opens a modal; `closeTop()` closes the newest
- `runSequence(steps)` opens a stepper sequence (`confirmCurrentStep`/`dismissCurrentStep` advance/back,
  `onConfirm`/`onDismiss` hooks run before moving); Escape handled centrally in `ModalHost`
- `ModalHost` is mounted once in `App.tsx` — do not render separate `Modal` instances

### tooltip system (Tooltip + HoverTooltip):
- `Tooltip` is a bare, position-aware primitive: renders `children` + `position: {x, y}` portaled to `document.body`,
  `position: fixed`, `pointer-events: none`. Export `TooltipPosition` type.
- `HoverTooltip` drives when/where: tracks the mouse on its wrapper and, on hover,
  `cloneElement`s the injected `tooltip` element with a fresh `position`. Full edge-flipping (right/left + bottom/top).
- the injected `tooltip` is typed `ReactElement<{ children; position }>` so any component accepting
  `children + position` can be injected (not just `Tooltip`). The caller styles it (e.g. via a `className` on `Tooltip`);
  styling overrides use `!important` per the Button convention.
- usage: `<HoverTooltip tooltip={<Tooltip>...</Tooltip>}>children</HoverTooltip>` (see `docs/tooltips.md`)

### shared ui currently in use:
- `WatchConstructorPage` / `OrdersClientPage` / `DbSeederPage`: BasePage + Header + WatchlyLogo shell
- `WatchConstructorPage` footer: `Footer` (legal docs = internal routes, social icons = VITE_* urls)
- legal pages: `modules/legal/page/LegalPage` (title + markdown via react-markdown; hardcoded texts
  in `frontend/src/data/legalDocs.ts`, routes `/public-offer` and `/privacy-policy` in `App.tsx`)
- `Order`, `DbSeederPage`, orders/db-seeder crud: `Button` (primary actions)
- cost displays (orders list/detail, part cards, order total): `RublesIcon`
- order flow, contact us, delete confirmation: `useModalStore` + `ModalHost`

### suggested shared ui changes (proposals, not yet done):
- `Button` needs a `danger` variant (delete actions currently override colors via className +
  `!important` in `DbSeederPage.module.scss` / `DeletePartConfirmModal.module.scss`)
- no shared form atoms: `PartForm` still uses raw `<input>/<textarea>/<select>` — a shared
  `Input`/`Textarea`/`Select` (+ labels) would let dbSeeder/orders reuse them
- domain icons live in `modules/watchConstructor/ui/icons`; promote ones used elsewhere
  (e.g. `PhoneIcon`) into `shared/ui/icons`
- `useModalStore` sequence looks up `activeModal` even when a sequence modal is up — fine today,
  but a regression test/warning would prevent silent misbehavior

### tests / tooling:
- no frontend tests; type-check + build via `npm run build` (tsc -b && vite), lint via `npm run lint`