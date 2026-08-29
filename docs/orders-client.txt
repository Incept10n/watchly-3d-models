### functional requirments: 
- as a user i want to view all orders
- as a user i want to select needed order
- as a user i want to be able to filter the order by its uid

### non functional requirements:
- for frontend use shared ui like primary button for actions and also layouts
- the display of order should be in a grid as small cards for better preview, user can click on each card and when he does it shows the whole content in the convenient place 

### design decisions (made during implementation):
- layout: two-pane like DbSeederPage - orders grid on the left sidebar, selected order full content in the right panel
- uid filter: server-side via `GET /order?uid=...`, partial & case-insensitive match, debounced 300ms on the client, resets to page 1
- pagination: server-side on the same list endpoint (`?page=&limit=`), fixed limit 12
- loading UI: **infinite scroll** on the frontend - `OrdersGrid` renders a sentinel div at the end of the grid and uses an `IntersectionObserver` (rootMargin 300px) to request the next page; new pages are appended (deduped by uid); filter change / Refresh reset to page 1 and remount the grid (keyed by uid+refreshKey) to reset scroll
- module name: `ordersClient` (mirrors `dbSeeder`), route `/orders`
- shared ui in use: `BasePage` + `Header` + `WatchlyLogo` shell (like WatchConstructorPage), `Button` (primary) for Refresh, `RublesIcon` for all cost displays
- `RublesIcon` was moved from `modules/watchConstructor/ui/icons` into the shared domain as `shared/ui/icons/RublesIcon`; all cost values are shown with it instead of `$`

#### backend endpoints (added to existing `order` module):
- `GET /order?uid=&page=&limit=` -> `{ items: OrderSummary[], pagination: { page, limit, total, totalPages } }`
  - `OrderSummary` = `{ id, uid, createdAt, itemCount, totalCost }`, ordered by `createdAt desc`
  - defaults: page 1, limit 12 (clamped 1..100)
- `GET /order/:uid` -> `{ id, uid, createdAt, items: [{ id, part: { id, name, type, cost, pictureUrl } }], totalCost }` or `null`

#### frontend module structure (`frontend/src/modules/ordersClient`):
```
 api
  ordersClientApi.ts   (getAllOrders, getOrderByUid)
  dto.ts               (OrderSummary, OrderDetails, PaginatedOrders)
 components
  OrderCard
  OrdersGrid
  OrderDetails
 page
  OrdersClientPage.tsx + .module.scss
index.ts
```

TODO:
- backend
    * add new endpoints so that all functional requirements can be done -- done
- frontend
    * create a completely new module (like dbSeeder), use similar structure (
       api
       components
       page
        index.ts) to implement your solution -- done