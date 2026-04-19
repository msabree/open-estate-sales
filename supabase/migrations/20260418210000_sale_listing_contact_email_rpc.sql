-- Public listing contact: operator email for published sale (mailto / inquiry UI).
-- Estate listings commonly surface a host email; operators table email is the account email.

create or replace function public.get_sale_listing_contact_email (p_sale_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select o.email::text
  from public.sales s
  inner join public.operators o on o.id = s.operator_id
  where s.id = p_sale_id
    and s.status = 'published';
$$;

comment on function public.get_sale_listing_contact_email (uuid) is
  'Operator account email for a published sale (for public contact UI).';

grant execute on function public.get_sale_listing_contact_email (uuid) to anon, authenticated;
