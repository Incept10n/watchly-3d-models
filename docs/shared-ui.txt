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
  molecules/      (reserved — currently empty)
  orgaisms/
    Header        (leftIcon | headerName | rightInfo)
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

### shared ui currently in use:
- `WatchConstructorPage` / `OrdersClientPage` / `DbSeederPage`: BasePage + Header + WatchlyLogo shell
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