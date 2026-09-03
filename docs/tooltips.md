# tooltips feature

reason: when an item is not available it's a good idea to explain to the customer the reason why a certain part is unavailable.

## status: implemented (frontend)

## user stories
- as a user i want to see tooltips when i cannot choose the element (i understand this by either trying to pick the item which is not available or hovering upon the item which is not available, where item is a part which is not available)

## non-functional requirements
- done similarly to the 'modals' feature in the project (shared ui) so tooltips can be used everywhere any time
- use styles similar to the ones already used, but so that tooltips look good

## functional requirements
- tooltips must appear when hovering an unavailable watch part
- proper position must be calculated so it doesn't overflow the screen (right/left + bottom/top flip via viewport detection)

## implementation
- `shared/constants/partTypeNames.ts` — `PART_TYPE_NAMES` (Russian names for every `PartType` in nominative + instrumental case)
- `shared/ui/atoms/Tooltip` —
    - `Tooltip.tsx` — bare positional tooltip (portaled to `document.body`, `position: fixed`, `pointer-events: none`); exposes `TooltipPosition`
    - `HoverTooltip.tsx` — hover wrapper (tracks cursor, `cloneElement`s the caller-injected tooltip with the current `position`, full edge detection)
- `modules/watchConstructor/utils/partConflict.ts` — `getPartConflictInfo` (walks the fixed 2-level tree: MOVEMENT/BEZEL -> CASE, HANDS/ROTOR/DIAL/CRYSTAL -> MOVEMENT) + `getTooltipText`
- used in `TextPartPicker` (position "right", wrapper `display: contents`) and `ImageCarousel` (position "left")

## how tooltips are composed
`HoverTooltip` does NOT know what a tooltip looks like. The caller injects the full tooltip element via the
typed `tooltip` prop (typed as `ReactElement<{ children, position }>` so it is forced to accept `children` +
`position`). `HoverTooltip` injects the live cursor `position` into it via `cloneElement` and shows it on hover.
The caller controls styling (e.g. a `className` on the shared `Tooltip`). The shared `Tooltip` is just the
position-aware primitive; any component accepting `children + position` can be injected instead.

Part items show two different tooltips:
- **disabled part** -> warning tooltip `<Tooltip>` with the incompatibility text (white bg)
- **available/chosen part** -> description tooltip `<Tooltip className={...infoTooltip}>` with `part.description`
  (tinted bg styled in the module, overriding via `!important` per the shared-UI Button-override convention)

## copywriting
when the user hovers on an unavailable part, the tooltip says:
`Эта часть несовместима с выбранным <part type, instrumental> «<name of the chosen conflicting part>». Чтобы использовать её, выберите другой <part type, instrumental>, совместимый с этой частью.`

two required things are always present:
1. tells the user the part is not compatible with another chosen part
2. displays the name of that conflicting chosen part

## TODO
- (optional) reuse `PART_TYPE_NAMES` in `PartTabs` instead of its local `PartTypeToRussianName` map
- generalize conflict detection when the backend dependency tree is generalized (currently hardcoded to the fixed 2-level tree)
