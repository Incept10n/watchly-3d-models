### functional requirements:
- as a user i want to view all available parts grouped by their type
- as a user i want to switch between part types (tabs)
- as a user i want to pick a part for every watch component (CASE, MOVEMENT, BEZEL, DIAL, HANDS, ROTOR, CRYSTAL)
- as a user i want to see only parts that are compatible with the current assembly
- as a user i want to see the assembled watch in interactive 3D
- as a user i want to see the total price of the assembled watch
- as a user i want to place an order for the assembled watch
- as a user i want to contact the studio for a custom order

### non functional requirements:
- for frontend use shared ui as much as possible (BasePage/Header/Button/Heading/RublesIcon/Modal + useModalStore); when it does not fit, suggest a change to the shared ui instead of duplicating styles
- the assembler must never produce an invalid watch: any selected part that breaks a dependency is corrected server-side
- 3D scene must use offline (no network fetch) studio-like environment lighting, auto-fit the camera to the model and support rotate/zoom
- backend compatibility algorithm should be cheap: the fixed 2-level tree allows just 2 DB queries per swap

### dependency tree (fixed, hardcoded):
the compatibility model is a fixed 2-level tree, stored in `PartCompatibility` as
`part1Id -> part2Id` (parent -> child):

```
        CASE
      /      \
   MOVEMENT  BEZEL
   /  |  |  \
 HANDS ROTOR DIAL CRYSTAL
```

- `CASE` -> `MOVEMENT`, `CASE` -> `BEZEL`, `MOVEMENT` -> `HANDS/ROTOR/DIAL/CRYSTAL`
- it is implemented as hardcoded sequences in `watch.service.ts` / `db-seeder.service.ts`, NOT generic — there is an open TODO to generalize it to arbitrary trees. Do not assume it handles deeper or wider trees.

### algorithms:

- `GET /api/watch/initial-parts` -> `getFirstCompatableSequence()`:
  picks the FIRST `CASE` from the db, then the FIRST compatible `MOVEMENT` and `BEZEL` for it,
  then the FIRST `HANDS/ROTOR/DIAL/CRYSTAL` for that `MOVEMENT`.
  Returns `{ ids: number[], compatability: CompatabilityArray }` where `ids` is the
  full legal watch [CASE, MOVEMENT, BEZEL, HANDS, ROTOR, DIAL, CRYSTAL].
  Throws if the db has no part of some type reachable this way (`cannot start app because...`).

- `GET /api/watch/correctTreeData?currentTree=<json>` -> `formDependencyTree(currentTree)`:
  takes the client's current assembly (`ChosenWatch = Record<PartType, Part>`), runs exactly 2 queries:
    1. `partCompatibility` rows where `part1Id = currentTree.CASE.id`
    2. `partCompatibility` rows where `part1Id = currentTree.MOVEMENT.id` (MOVEMENT already corrected from query 1)
  For every other part type it checks whether the chosen part is among the compatible ids; if not,
  it silently **replaces it with the first compatible part** of that type (movement/bezel from query 1,
  hands/rotor/dial/crystal from query 2). If no compatible part exists at all it throws.
  Returns `{ currentTree: ChosenWatch, compatability: CompatabilityArray }` (costs as numbers).

- `getCompatible(partIds)` -> `CompatabilityArray`:
  for each `baseId` returns `{ baseId, compatableIds: [...] }` (its `part2` ids), PLUS a self-loop
  `{ baseId: caseId, compatableIds: [caseId] }` for EVERY `CASE` — this makes all cases always
  available (they have no parent in the tree).

- frontend availability (`getAllCompatibleIds` in `utils/partCoverter.ts`):
  flattens `compatableIds` and `baseIds` into a single id list; a part is `chosen`,
  `available` (id in the list) or `disabled` (not in the list) in `TextPartPicker`/`ImageCarousel`.

- cost handling: `cost` is Prisma `Decimal`; every watch response is converted via `withNumberCost`
  (backend) so the frontend always receives `number`.

### backend endpoints:
- `GET /api/watch/parts` -> `Part[]` (cost as number)
- `GET /api/watch/initial-parts` -> `{ ids: number[], compatability: CompatabilityArray }`
- `GET /api/watch/correctTreeData?currentTree=<json>` -> `{ currentTree, compatability }`
- `POST /api/order` (body `{ partIds: number[] }`) -> `{ uid }` — used by the constructor's order flow
  (admin order list/detail endpoints are documented in `docs/orders-client.txt`)

### frontend module structure (`frontend/src/modules/watchConstructor`):
```
api
  watchConstructorApi.ts  (getAllParts, getInitialPartsSequence, formDependencyTree)
  orderApi.ts             (createOrder)
page
  WatchConstructorPage.tsx + .module.scss
store
  store.ts                (zustand)
  types.ts                (ChosenWatch = Record<PartType, Part>, CompatabilityArray, ...)
utils
  finder.tsx              (findPart, getAllOfType)
  partCoverter.ts         (getAllCompatibleIds)
  communicationLinks.ts   (CommunicationChannel: avito | vk | email, links from VITE_* env)
ui
  3dModel/ThreeDModelDisplayer    (ThreeDModelDisplayer.tsx, PartModel.tsx)
  topBar/PartTabs
  leftSidebar/TextPartPicker      (text list, chosen/available/disabled states)
  leftSidebar/ImageCarousel       (vertical image strip)
  rightSidebar/Order              (total price + "Оформить заказ")
  rightSidebar/RandomizeModel     (dummy)
  rightSidebar/FavouritesButton   (dummy)
  rightSidebar/MakeCutomButton -> ContactUsModal   (custom order)
  rightSidebar/AdditionalActionButton (shared Button wrapper)
  rightSidebar/Separator
  orderFlow/orderSequence.tsx     (buildOrderSequence)
  orderFlow/Modals: CommunicationChoiceModal, OrderLinkConfirmModal, OrderThanksModal, ContactUsModal
  layout: ConstructorContainer, LeftSidebarWrapper, SideFeatures, ContactsWrapper
  icons (domain-specific): UserIcon, MessageIcon, HeartIcon, RubiksCubeIcon, PhoneIcon, ArrowIcon, CopyIcon, CheckedIcon
index.ts
```

additional frontend files/folders used by this module:
- `frontend/scripts/compress-models.mjs`  (generate `.draco.glb` siblings via `npm run models:compress`)
- `frontend/public/draco/`                  (self-hosted Draco decoder, see "model optimization" section)

### data flow:
- initial load (`WatchConstructorPage`): `Promise.all([getAllParts(), getInitialPartsSequence()])`,
  then `setParts` + `changeCurrentWatch(match ids to parts by type)` + `setCompatability`.
- part selection (picker or carousel): optimistically swap `{ ...currentWatch, [tab]: part }`,
  call `formDependencyTree(updatedWatch)`, store the **corrected** tree + new `compatability`.
- order (`rightSidebar/Order`): total = sum of `currentWatch` costs -> `createOrder(part ids)` ->
  `runSequence(buildOrderSequence(uid))` (communication choice -> copy message + chat link -> thanks).

### design decisions (made during implementation):
- 3D (`ThreeDModelDisplayer`): React Three Fiber Canvas + drei `Bounds` (auto-fit) + `OrbitControls`
  (damping, auto-rotate toggle), offline `RoomEnvironment` PMREM (no network HDR), light setup,
  loading progress via `useProgress`; "Сбросить камеру"/"Остановить вращение" use shared `Button`.
- GLB part models: served from `/models/...`, all exports share a dial-center origin (no per-part offsets);
  empty `modelUrl` or oversized exports (`MAX_MODEL_DIMENSION` > 0.5m, e.g. Blender default cube) are skipped.
- every GLB bakes a glass dome onto the dial; `PartModel` hides translucent glass (material opacity < 0.95)
  on non-CRYSTAL parts (children reparented so only glass geometry is hidden, not the whole subtree).
- part tabs show Russian names; `currentTab` drives which type the pickers edit.

### model optimization (Draco):
- every model has a `.draco.glb` sibling (e.g. `case.glb` -> `case.draco.glb`) produced by
  `npm run models:compress` in `frontend/` (`scripts/compress-models.mjs` wraps the `@gltf-transform/cli`
  `draco` command, runs over ALL `public/models/**/*.glb`, skips already-present variants).
- conversion is automated: `predev`/`prebuild` run `npm run models:compress` before `vite dev`/`vite build`,
  so any new `.glb` dropped into `public/models/` automatically gets its `.draco.glb` sibling.
- the Draco decoder is **self-hosted** in `frontend/public/draco/` (copied from
  `node_modules/three/examples/jsm/libs/draco/`, root files only: `draco_decoder.js`, `draco_wasm_wrapper.js`,
  `draco_decoder.wasm`). The three-stdlib `DRACOLoader` used by drei fetches exactly these three from
  the decoder path.
- `PartModel` prefers the compressed variant at runtime: it HEAD-checks the `*.draco.glb` existence once per
  model (memoized) and falls back to the original `.glb` if missing — DB URLs (`/models/....glb`) stay
  unchanged. Loading uses `useGLTF(url, "/draco/")`: the string 2nd arg makes drei attach a `DRACOLoader`
  pointed at `/draco/`; plain GLBs (no `KHR_draco` extension) load fine through the same loader.
- nginx long-caches `.glb` and `.wasm` (previously only images/css/js), so models aren't re-downloaded
  each visit.

TODO:
- backend
    * generalize the dependency tree (currently hardcoded CASE->MOVEMENT/BEZEL, MOVEMENT->HANDS/ROTOR/DIAL/CRYSTAL) -- pending
- frontend
    * RandomizeModel (dummy randomizing) and FavouritesButton (dummy) -- pending real logic
    * consider sharing more atoms with other modules (part list/edit reused by dbSeeder client) -- pending

### shared ui used by this module:
`BasePage` + `Header` + `WatchlyLogo` page shell, `Button` (primary for order), `Heading`
(modal titles), `RublesIcon` (price), and the modal layer via `useModalStore` (`pushModal`,
`runSequence`) rendered by `ModalHost`. See `docs/shared-ui.txt`.