-- SEO URL shape: /sales/{region_slug}/{listing_slug}
-- e.g. region_slug = atlanta-ga, listing_slug = smith-family-estate-2026

drop view if exists public.sales_public_listing;

alter table public.sales
  add column if not exists region_slug text,
  add column if not exists listing_slug text;

-- Backfill from legacy `slug` (city-state/title-year) or derive region from city + state
update public.sales
set
  region_slug = split_part(slug, '/', 1),
  listing_slug = trim(split_part(slug, '/', 2))
where
  region_slug is null
  and slug ~ '/'
  and split_part(slug, '/', 1) <> ''
  and trim(split_part(slug, '/', 2)) <> '';

update public.sales
set
  region_slug = lower(regexp_replace(trim(city), '\s+', '-', 'g'))
    || '-'
    || lower(trim(state)),
  listing_slug = slug
where region_slug is null;

alter table public.sales
  alter column region_slug set not null,
  alter column listing_slug set not null;

alter table public.sales drop constraint if exists sales_slug_key;

alter table public.sales drop column if exists slug;

alter table public.sales
  add constraint sales_region_listing_unique unique (region_slug, listing_slug);

create index if not exists sales_region_slug_idx on public.sales (region_slug);

comment on column public.sales.region_slug is 'SEO segment: {city}-{state}, lowercase, e.g. atlanta-ga';
comment on column public.sales.listing_slug is 'SEO segment: {title}-{year}, unique per region_slug';

create or replace view public.sales_public_listing
with (security_invoker = false) as
select
  s.id,
  s.operator_id,
  s.title,
  s.region_slug,
  s.listing_slug,
  s.description,
  s.city,
  s.state,
  s.zip,
  s.lat_fuzzy,
  s.lng_fuzzy,
  case
    when s.address_reveal_at <= now() then s.address
  end as address,
  case
    when s.address_reveal_at <= now() then s.lat
  end as lat,
  case
    when s.address_reveal_at <= now() then s.lng
  end as lng,
  s.address_reveal_at,
  s.start_date,
  s.end_date,
  s.preview_times,
  s.status,
  s.view_count,
  s.published_at,
  s.created_at
from public.sales s
where s.status = 'published';

comment on view public.sales_public_listing is 'Published sales; public path /sales/{region_slug}/{listing_slug}';

grant select on public.sales_public_listing to anon, authenticated;
