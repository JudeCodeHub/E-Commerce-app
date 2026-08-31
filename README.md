<div align="center">
  <h1><img src="https://raw.githubusercontent.com/JudeCodeHub/E-Commerce-app/main/app/favicon.ico" width="20" height="20" alt="NexBuy Favicon">
   NexBuy</h1>
  <p>
    A multi-vendor e-commerce platform built with Next.js, Tailwind CSS, and Prisma/Postgres.
  </p>
</div>

---

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [Overview](#overview)
- [Features](#features)
  - [Storefront (Buyer)](#storefront-buyer)
  - [Seller Dashboard](#seller-dashboard)
  - [Admin Panel](#admin-panel)
  - [Platform](#platform)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗂️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)

---

## Overview

NexBuy is a full-stack multi-vendor marketplace: buyers browse and purchase products across many independent stores, sellers apply to open a store and manage their own catalog/orders, and admins approve stores and oversee the platform. It supports both cash-on-delivery and Stripe card payments, sends transactional email, and runs background jobs (user sync, scheduled coupon expiry, order-confirmation email) via Inngest.

## Features

### Storefront (Buyer)

- Product browsing with category filtering and search
- Product detail pages with image gallery, ratings, and reviews
- Shopping cart with per-item quantity control and select/deselect-for-checkout
- **Wishlist** — save products from listings or the detail page, dedicated `/wishlist` page with add-to-cart/remove, stale (out-of-stock/archived) items shown disabled rather than hidden
- Checkout with **COD** or **Stripe** payment, coupon codes, shipping fee logic (waived for Plus members)
- Multiple saved **addresses** — add, edit, delete, and set a default, via a custom dropdown with inline actions
- **Order history** with color-coded status (Order Placed / Processing / Shipped / Delivered), rate-a-product flow once delivered
- **Order confirmation email** (branded HTML, sent automatically on order placement)
- Free / Plus subscription tiers (Clerk Billing) with plan-gated perks (e.g. free shipping)
- Fully dark-themed, responsive UI throughout; custom 404 and error pages

### Seller Dashboard

- Store application flow (pending admin approval before going live)
- Dashboard with lifetime stats (products, earnings, orders, ratings), a **revenue trend chart** (7/30/90-day toggle), **top-5 products by revenue**, and a customer reviews feed
- Product management: add, edit (in-page modal, per-slot image updates), archive/restore, delete (auto-falls back to "archive" if the product has order history and can't be hard-deleted)
- Order management with a color-coded status dropdown (matches the buyer-side order status colors)
- Auto-refilling "featured" product slots (promotes a replacement, preferring category variety, whenever a featured product is deleted/archived/goes out of stock)

### Admin Panel

- Platform-wide dashboard: totals + an orders-over-time chart
- Store approval/rejection workflow
- Store management (enable/disable a store)
- Coupon management (create/list; coupons auto-delete on expiry via a scheduled background job)
- Admin access restricted to an email allowlist

### Platform

- Three roles — **Buyer**, **Seller**, **Admin** — all backed by a single Clerk identity, with a self-healing user record (created on first API touch even if the signup webhook hasn't landed yet)
- Background jobs via **Inngest**: Clerk user sync (create/update/delete), scheduled coupon expiry, order-confirmation email
- Transactional email via **Resend** + **React Email**, styled to match the app's branding
- Image uploads/transformations via **ImageKit**
- Reusable custom UI kit: dropdown selects, confirm modals, status pills — all built from scratch to match the design system rather than native browser controls

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, custom design tokens) |
| Database | [Neon](https://neon.tech/) (serverless Postgres) |
| ORM | [Prisma](https://www.prisma.io/) (with the Neon serverless driver adapter) |
| Auth & Billing | [Clerk](https://clerk.com/) (auth, org-free multi-role access, subscription plans) |
| Payments | [Stripe](https://stripe.com/) (checkout + webhooks), Cash on Delivery |
| Background Jobs | [Inngest](https://www.inngest.com/) (event-driven functions, scheduled jobs, retries) |
| Transactional Email | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| Image Hosting | [ImageKit](https://imagekit.io/) |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/), [Hugeicons](https://hugeicons.com/) |
| Notifications (UI) | [react-hot-toast](https://react-hot-toast.com/) |

## 🗂️ Architecture

```
app/
  (public)/        buyer-facing routes: home, shop, cart, orders, wishlist, product/[id], pricing, create-store
  admin/            admin-only routes: dashboard, stores, approve, coupons
  store/            seller-only routes: dashboard, add-product, manage-product, orders
  api/               route handlers for all of the above, plus /api/inngest and /api/stripe webhooks
components/          shared UI (Navbar, ProductCard, modals, custom dropdowns, seller-side components under components/store/)
lib/                 Prisma client, Resend client, Redux store + feature slices
inngest/             background job definitions and the Inngest client
emails/              React Email templates
prisma/              schema.prisma (single source of truth for the data model)
docs/features/       design docs for larger features (written before implementation)
```

Buyer, seller, and admin surfaces are three separate route trees sharing one Clerk identity — a user becomes a "seller" once their store is admin-approved, and an "admin" if their email is in the `ADMIN_EMAIL` allowlist. There is no separate signup flow per role.

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Set up your `.env` file (see [Environment Variables](#-environment-variables) below), then push the Prisma schema to your database:

```bash
npx prisma db push
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

If you're working on anything that touches background jobs (order emails, coupon expiry, user sync), also run the Inngest dev server alongside it, in a separate terminal:

```bash
npx inngest-cli dev
```

That opens a dashboard at [http://localhost:8288](http://localhost:8288) showing every event and function run live.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load Outfit as its font.

## 🔑 Environment Variables

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | Image uploads |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Card payments |
| `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` | Background jobs (production) |
| `RESEND_API_KEY` | Transactional email |
| `APP_URL` | Base URL used for links inside emails (e.g. `http://localhost:3000` locally) |
| `ADMIN_EMAIL` | Comma-separated allowlist of admin emails |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | Currency symbol shown throughout the UI (defaults to `$`) |

Note: `RESEND_API_KEY` defaults to Resend's sandbox mode, which only delivers to the email address your Resend account itself is registered with — verify a domain in Resend's dashboard to send to real recipients.
