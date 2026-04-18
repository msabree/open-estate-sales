-- Operator selling context (private vs company) and optional company logo URL (HTTPS).

alter table public.operators
  add column if not exists operator_kind text not null default 'individual'
    check (operator_kind in ('individual', 'company')),
  add column if not exists company_logo_url text;

comment on column public.operators.operator_kind is
  'individual: private / one-off seller; company: business.';
comment on column public.operators.company_logo_url is
  'Optional HTTPS URL for company logo when operator_kind is company.';

-- Extend public operator RPC (no email/phone). Return type changed → drop first.
drop function if exists public.get_public_operator (uuid);

create function public.get_public_operator (operator_id uuid)
returns table (
  id uuid,
  name text,
  company_name text,
  slug text,
  city text,
  state text,
  operator_kind text,
  company_logo_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    o.id,
    o.name,
    o.company_name,
    o.slug,
    o.city,
    o.state,
    o.operator_kind,
    o.company_logo_url
  from public.operators o
  where o.id = operator_id
    and exists (
      select 1
      from public.sales s
      where s.operator_id = o.id
        and s.status = 'published'
    );
$$;

comment on function public.get_public_operator (uuid) is
  'Single operator row without email/phone, only if they have a published sale.';

grant execute on function public.get_public_operator (uuid) to anon, authenticated;
