insert into public.collections (slug, title, description, published)
values ('launch-001', 'Launch 001', 'Three heavyweight oversized tees in a controlled neutral palette.', true)
on conflict (slug) do nothing;

with launch as (
  select id from public.collections where slug = 'launch-001'
), inserted_products as (
  insert into public.products (collection_id, slug, name, description, price_inr, compare_at_inr, fit, gsm, images)
  select launch.id, p.slug, p.name, p.description, 2490, 2990, 'Oversized', '240 GSM', p.images
  from launch,
  (values
    ('jet-black-oversized-tee', 'Jet Black Oversized Tee', 'Heavyweight comfort. Quiet confidence.', array['jet-black-01.jpg', 'jet-black-02.jpg']),
    ('stone-beige-oversized-tee', 'Stone Beige Oversized Tee', 'Uniform for disciplined men.', array['stone-beige-01.jpg', 'stone-beige-02.jpg']),
    ('soft-white-oversized-tee', 'Soft White Oversized Tee', 'Three colors. Zero noise.', array['soft-white-01.jpg', 'soft-white-02.jpg'])
  ) as p(slug, name, description, images)
  on conflict (slug) do update set name = excluded.name
  returning id, slug, name
)
insert into public.variants (product_id, sku, color, color_hex, size, price_inr)
select p.id,
  upper(replace(p.slug, '-oversized-tee', '')) || '-' || size,
  case
    when p.slug like 'jet-black%' then 'Jet Black'
    when p.slug like 'stone-beige%' then 'Stone Beige'
    else 'Soft White'
  end,
  case
    when p.slug like 'jet-black%' then '#0D0D0D'
    when p.slug like 'stone-beige%' then '#D8CBB8'
    else '#F5F5F2'
  end,
  size,
  2490
from inserted_products p
cross join unnest(array['S', 'M', 'L', 'XL', 'XXL']) as size
on conflict (sku) do nothing;

insert into public.inventory (variant_id, stock_quantity)
select id, 12 from public.variants
on conflict (variant_id) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, published_at)
values
  ('the-uniform-mindset', 'The Uniform Mindset', 'Why disciplined wardrobes remove noise from ambitious days.', 'CAVVE begins with fewer decisions and stronger defaults.', now()),
  ('heavyweight-not-heavy', 'Heavyweight, Not Heavy', 'A close look at 240 GSM cotton, structure, and drape.', 'The tee is cut to hold shape without feeling rigid.', now()),
  ('quiet-confidence', 'Quiet Confidence', 'How restraint became the most modern form of presence.', 'Nothing loud. Nothing wasted.', now())
on conflict (slug) do nothing;
