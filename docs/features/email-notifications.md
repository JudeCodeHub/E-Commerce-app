# Feature Design: Email Notifications

Status: Implemented (scope reduced after initial build — see note below).

## Scope note

Originally designed and built with four email types: order confirmed (buyer), order shipped (buyer), order delivered (buyer), and new order received (seller). After testing, the buyer confirmation was the only one the user actually wanted — **shipped/delivered and the seller alert were removed**. This doc describes the final, reduced scope. The removed pieces (`sendNewOrderAlertEmail`, `sendOrderStatusEmail`, `app/order.status-updated` event, `emails/NewOrderEmail.jsx`, `emails/OrderStatusEmail.jsx`) are gone from the codebase; the architecture below (events via Inngest, Resend, React Email) is unchanged and still the pattern to follow if more email types are added later.

## Understanding Summary

- One transactional email: **order confirmed**, sent to the buyer.
- Sent via **Resend**, triggered as a background job through the existing Inngest setup (`inngest/functions.jsx`) — decoupled from the request path, automatic retries on failure.
- Styled as a branded HTML template matching NexBuy's amber/dark theme, built with React Email.
- Non-goals: no shipped/delivered emails, no seller-facing new-order alert, no SMS/push, no user-configurable notification preferences, no marketing/newsletter emails.

## Assumptions

- No domain verified with Resend — built against the test sender `onboarding@resend.dev`. Real delivery only reaches the Resend account owner's inbox until a domain is verified; code doesn't need to change when that happens, just the `FROM_ADDRESS` constant in `lib/resend.js`.
- Email failures must never block order placement.
- `RESEND_API_KEY` stays server-side only.

## Final Design

### Event & Trigger Points

**`app/order.placed`** — payload: `{ orderId }`
- Fired in `app/api/orders/route.js`, per order, immediately after `prisma.order.create()` — only for COD (`paymentMethod !== "STRIPE"`).
- Fired in `app/api/stripe/route.js`, inside `handlePaymentIntent`'s `isPaid === true` branch, once per `orderId`, after `isPaid: true` is set.
- One listener: `sendOrderConfirmedEmail`, fetches the order fresh via Prisma using `orderId`, sends to `order.user.email`.

### Email Template

- `emails/components/EmailLayout.jsx` — shared wrapper: dark panel background, amber "NexBuy." wordmark header, consistent footer.
- `emails/OrderConfirmedEmail.jsx` — order ID, itemized table, total, shipping address, **View Order** button → `/orders`.

### Resend Client & Config

**`lib/resend.js`**
```js
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_ADDRESS = "NexBuy <onboarding@resend.dev>";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
```

**`inngest/functions.jsx`** — `.jsx` extension needed for the `react:` field passed to Resend.

**Env vars** (`.env`): `RESEND_API_KEY` (free Resend account), `NEXT_PUBLIC_APP_URL` (base URL for email CTA links, since Inngest functions have no request object to derive origin from).

### Error Handling

- Email send failure inside the Inngest function: error **propagates** (not caught) so Inngest's automatic retry handles it.
- Order not found when the function runs: early return, no throw.
- `inngest.send()` failure at the trigger point: caught locally, never breaks order placement.

## Confirmed Working (testing notes)

- End-to-end pipeline verified: order placed → `app/order.placed` fires → `sendOrderConfirmedEmail` runs → Resend accepts → email delivered (landed in spam initially, expected for the shared `onboarding@resend.dev` sender domain with no custom SPF/DKIM/DMARC — a verified domain fixes this).
- Sandbox mode (no verified domain) only delivers to the Resend account's own signup email — any other recipient is rejected by Resend itself, which is exactly why the seller-alert email (removed) kept failing during testing before the scope was cut.
