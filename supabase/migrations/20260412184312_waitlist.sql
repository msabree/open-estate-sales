-- Landing-page waitlist signups. Inserts are performed by the `waitlist` Edge Function
-- using the service role (bypasses RLS). Direct anon access is denied.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness; Edge Function normalizes to lower(trim(email)).
create unique index waitlist_email_lower_idx on public.waitlist (lower(trim(email)));

comment on table public.waitlist is 'Email waitlist for launch notifications; written via Edge Function only.';

alter table public.waitlist enable row level security;
