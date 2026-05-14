create type public.app_role as enum ('admin', 'staff', 'customer');
create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed');
create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');
create type public.shipment_status as enum ('queued', 'created', 'awb_assigned', 'in_transit', 'delivered', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  price_inr integer not null,
  compare_at_inr integer,
  fit text,
  gsm text,
  status text not null default 'active',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  color text not null,
  color_hex text,
  size text not null,
  price_inr integer not null,
  created_at timestamptz not null default now()
);

create table public.inventory (
  variant_id uuid primary key references public.variants(id) on delete cascade,
  stock_quantity integer not null default 0,
  low_stock_threshold integer not null default 8,
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  status order_status not null default 'pending',
  subtotal_inr integer not null,
  discount_inr integer not null default 0,
  shipping_inr integer not null default 0,
  total_inr integer not null,
  shipping_address_id uuid references public.addresses(id),
  razorpay_order_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.variants(id),
  name text not null,
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  unit_price_inr integer not null
);

create table public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index cart_user_unique_idx on public.cart(user_id);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.cart(id) on delete cascade,
  variant_id uuid not null references public.variants(id),
  quantity integer not null default 1
);

create table public.wishlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer,
  discount_amount_inr integer,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  status payment_status not null default 'created',
  amount_inr integer not null,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  shiprocket_order_id text,
  shipment_id text,
  awb_code text,
  courier_name text,
  status shipment_status not null default 'queued',
  retry_count integer not null default 0,
  last_error text,
  tracking_url text,
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  subject text not null,
  status text not null default 'open',
  body text,
  created_at timestamptz not null default now()
);

create index products_collection_idx on public.products(collection_id);
create index variants_product_idx on public.variants(product_id);
create index orders_user_idx on public.orders(user_id);
create index order_items_order_idx on public.order_items(order_id);
create index payments_order_idx on public.payments(order_id);
create index shipments_order_idx on public.shipments(order_id);
create index notifications_user_idx on public.notifications(user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.phone,
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.has_staff_access()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff')
  );
$$;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.notifications enable row level security;

create policy "Customers read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Customers create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Customers update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Staff read profiles" on public.profiles for select using (public.has_staff_access());
create policy "Customers manage own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "Staff manage addresses" on public.addresses for all using (public.has_staff_access());
create policy "Customers read own orders" on public.orders for select using (auth.uid() = user_id or public.has_staff_access());
create policy "Customers read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  or public.has_staff_access()
);
create policy "Customers manage own cart" on public.cart for all using (auth.uid() = user_id);
create policy "Customers manage own cart items" on public.cart_items for all using (
  exists (select 1 from public.cart where cart.id = cart_items.cart_id and cart.user_id = auth.uid())
);
create policy "Customers manage own wishlist" on public.wishlist for all using (auth.uid() = user_id);
create policy "Customers read own payments" on public.payments for select using (
  exists (select 1 from public.orders where orders.id = payments.order_id and orders.user_id = auth.uid())
  or public.has_staff_access()
);
create policy "Customers read own shipments" on public.shipments for select using (
  exists (select 1 from public.orders where orders.id = shipments.order_id and orders.user_id = auth.uid())
  or public.has_staff_access()
);
create policy "Customers read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Staff manage notifications" on public.notifications for all using (public.has_staff_access());
