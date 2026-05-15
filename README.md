# CAVVE Commerce

Original premium React + Vite commerce platform for CAVVE with luxury editorial UI, Supabase-powered auth/data, and secure India-first payment and shipping integrations.

## Stack

- React, Vite, TypeScript, Tailwind CSS
- React Router, Zustand, Framer Motion, GSAP
- React Hook Form and Zod
- Supabase Auth, PostgreSQL, Storage-ready schema
- Express API scaffold for Razorpay and Shiprocket

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev:all
```

Frontend: `http://localhost:5174`  
Backend health: `http://localhost:8787/api/health`

## Supabase

1. Create a Supabase project.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env`.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the backend API. Never expose the service role key in the Vite frontend.
4. Run `supabase/schema.sql` in the SQL editor.
5. Run `supabase/seed.sql` for the three launch tees and journal posts.
6. Configure Google OAuth in Supabase Auth if needed.

The schema creates a `profiles` row automatically after sign up, enables RLS for customer records, and allows admin/staff reads through the `profiles.role` field.

To grant staff access:

```sql
update public.profiles
set role = 'admin'
where id = '<user_uuid>';
```

The React app uses the Supabase URL and publishable key in the Vite client. Service-role access, order creation, payment verification, and shipment creation stay in the backend.

## Payments

The frontend checkout posts to `/api/payments/create-order`. The backend creates the Razorpay order with `RAZORPAY_KEY_SECRET`, returns the public order data, and exposes `/api/payments/verify` for server-side signature verification.

Checkout now requires a signed-in Supabase user. The API creates:

- saved checkout address
- synced cart and cart items
- pending order
- order items
- created payment row

Webhook endpoint:

```txt
POST /api/webhooks/razorpay
```

Handle `payment.captured`, `payment.failed`, and `order.paid` there for reconciliation.

After verified payment, the API marks the order paid, updates the payment row, and starts Shiprocket shipment creation. If Shiprocket is unavailable, a failed shipment row is stored with retry metadata instead of breaking payment success.

## Shipping

Shiprocket shipment creation lives in `server/shiprocket.ts`. It is called after verified payment and is intentionally retry-safe: payment success should not fail just because the shipping API is temporarily unavailable.

Store `shipment_id`, `awb_code`, courier name, tracking URL, status, retry count, and last error in the `shipments` table.

Customers can see database-backed order history in `/account` and can track by app order id or Razorpay order id in `/order-tracking`.

## Key Routes

- `/` homepage
- `/collections`
- `/products/:slug`
- `/cart`
- `/checkout`
- `/account`
- `/wishlist`
- `/search`
- `/drop`
- `/order-tracking`
- `/admin`
- `/journal`
- `/about`

## Production Notes

- Move all admin writes, Razorpay verification, webhook updates, and Shiprocket calls to authenticated backend handlers.
- Enforce stricter role policies for `admin` and `staff` using JWT custom claims or a backend authorization layer.
- Replace placeholder editorial imagery with licensed campaign photography or generated brand assets before launch.
- Add a retry worker for failed Shiprocket shipment rows before production.
- Code split auth/admin/checkout routes to remove the Vite bundle-size warning.
# cavve_site
