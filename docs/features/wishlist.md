# Feature Design: Wishlist / Favorites

Status: Implemented.

## Understanding Summary

- Buyers can save products they're interested in without adding them to the cart.
- Exists to round out standard e-commerce UX for a portfolio-quality demo.
- Users: signed-in buyers, on shop/home/category listings and the product detail page.
- Heart-icon toggle on product cards (listings) and the product detail page.
- Saved items live on a dedicated `/wishlist` page, linked from the Navbar.
- Non-goals: no shared/public wishlists, no price-drop or back-in-stock notifications, no multiple named collections — one flat list per user.

## Assumptions

- Clicking the heart while signed out opens Clerk's sign-in modal, reusing `useClerk().openSignIn()` exactly as `components/Navbar.jsx` already does.
- Visual design follows existing tokens (`bg-panel`, `text-accent`) and `react-hot-toast` for feedback.
- Portfolio-scale traffic — no caching/infra work needed beyond a normal Prisma query.

## Decision Log

| # | Decision | Alternatives considered | Why |
|---|---|---|---|
| 1 | Relational `Wishlist` table | JSON field on `User` (cart-style); client-only Redux/localStorage | DB-enforced uniqueness (`@@unique([userId, productId])`) and cascade delete on genuine product deletion, for free. Matches the `Rating`/`Address`/`Order` convention already dominant in the schema. Fully additive — no existing model fields touched. |
| 2 | Heart icon on both listing cards and product detail page | Listing cards only | Consistency — users expect the same affordance wherever they see a product. |
| 3 | Dedicated `/wishlist` page | Navbar dropdown/slide-out panel | Matches the existing `/orders`/`/cart` page pattern; simpler, no new UI paradigm. |
| 4 | Wishlist items get Add-to-Cart + Remove actions | Link-through to product page only | Faster UX — no forced extra navigation to act on a saved item. |
| 5 | Stale (out-of-stock/archived) items shown with disabled Add-to-Cart | Auto-remove; show with no special handling | Keeps user's intent visible without letting them attempt an add that would fail server-side. |
| 6 | State managed via a new Redux slice (`wishlistSlice`), fetched once in `app/(public)/layout.jsx` | React Context; per-component fetch on each card | Mirrors the existing `addressSlice`/`ratingSlice` pattern exactly — same thunk shape, same dispatch-on-mount location, no new state paradigm introduced. |
| 7 | Auth gating reuses `openSignIn()` from Navbar | New redirect-to-login flow | Consistency; avoids duplicate auth-gating logic. |

## Final Design

### 1. Data Model

```prisma
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}
```

Additive-only changes to existing models:
```prisma
model User {
  // ...existing fields unchanged
  wishlist Wishlist[]
}

model Product {
  // ...existing fields unchanged
  wishlistedBy Wishlist[]
}
```

`@@unique([userId, productId])` makes "add" idempotent (catch `P2002` as a no-op). `onDelete: Cascade` on both relations means user deletion or genuine product deletion cleans up wishlist rows automatically — no cleanup job. Requires `prisma db push` + `prisma generate`; no data migration (new table).

### 2. API Routes — `app/api/wishlist/route.js`

Auth pattern matches existing buyer routes (`getAuth(request)` server-side, `Authorization: Bearer <token>` client-side via `getToken()`), and self-heals the user record via `prisma.user.upsert` the same way `app/api/cart/route.js` does.

- `GET /api/wishlist` — `prisma.wishlist.findMany({ where: { userId }, include: { product: true } })`, returns saved products joined with product data in one query.
- `POST /api/wishlist` — body `{ productId }`. Creates a row; a `P2002` conflict (already saved) is caught and treated as success.
- `DELETE /api/wishlist` — body `{ productId }`. Uses `deleteMany` (not `delete`) so a repeat/race call can't throw.

No changes to `products`, `cart`, `orders`, or any other existing route.

### 3. State Management

**`lib/features/wishlist/wishlistSlice.js`** (new)
- `fetchWishlist` thunk — same shape as `fetchAddress`: takes `{ getToken }`, calls `GET /api/wishlist`, returns the list.
- State: `{ list: [] }` — array of `{ id, productId, product }`.
- Reducers: `addToWishlist(product)` / `removeFromWishlist(productId)` for optimistic UI, mirroring `addAddress`.

Wiring (two one-line additions, nothing existing removed or changed):
- `lib/store.js` — add `wishlist: wishlistReducer` alongside `cart`/`address`/`rating`.
- `app/(public)/layout.jsx` — add `dispatch(fetchWishlist({ getToken }))` next to the existing `dispatch(fetchAddress({ getToken }))`.

### 4. Components

**`components/WishlistButton.jsx`** (new, reusable)
- Props: `productId`.
- Reads `state.wishlist.list` to determine saved/not-saved → filled amber heart (`text-accent`) vs outline heart.
- Click while signed out → `openSignIn()`. Click while signed in → optimistic Redux update, then `POST`/`DELETE /api/wishlist`; on failure, revert + `toast.error`.
- Inserted as an absolute top-right overlay on `components/ProductCard.jsx`, and inline near the price on the product detail page — no existing layout structure altered, just one new element added in each.

**`app/(public)/wishlist/page.jsx`** (new page, same structure as `orders/page.jsx`)
- Reads `state.wishlist.list` directly (already populated by the layout-level fetch).
- Grid of cards, each with Add to Cart + Remove (`WishlistButton` in its "remove" state).
- Out-of-stock/archived items: reduced opacity, "Out of stock" badge, disabled Add to Cart — matches existing disabled-button styling conventions.
- Empty state matches the existing `/orders`/`/cart` empty-state pattern.

**Navbar** (`components/Navbar.jsx`)
- One new icon-link next to the existing cart icon (`Heart` from `lucide-react`, same sizing/styling convention as `ShoppingCart size={18}`), linking to `/wishlist`. No existing nav items removed or reordered.

### 5. Edge Cases & Error Handling

- Sign-out mid-session: `fetchWishlist` simply isn't dispatched (mirrors `fetchAddress` today); state resets to empty on next load.
- Optimistic update fails: revert Redux state + `toast.error`, same recovery pattern as cart/rating flows.
- Duplicate rapid clicks: harmless — `@@unique` + `deleteMany` make both operations idempotent server-side regardless of client state.
- Product genuinely deleted: cascades out of `Wishlist` automatically; only archived/out-of-stock (product still exists) needs the disabled-UI treatment.

## Non-Functional Notes

- Performance/scale: portfolio-scale traffic, a plain indexed Prisma query is sufficient — no caching layer needed.
- Security/privacy: wishlist rows are scoped to `userId` from the authenticated Clerk session, same as cart/orders/addresses — no cross-user access path.
- Reliability: no special SLA; follows the same self-healing user-upsert pattern as `cart` route for resilience against unsynced accounts.
- Maintenance: fully additive — zero existing files' behavior changes, only new files plus two one-line wiring additions (`lib/store.js`, `app/(public)/layout.jsx`).
