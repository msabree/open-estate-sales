-- Operator billing tier (photo limits enforced in app) + public storage for sale images.
-- Object path shape: sales/{operator_id}/{sale_id}/{filename}

alter table public.operators
  add column if not exists tier text not null default 'free'
    check (tier in ('free', 'pro'));

comment on column public.operators.tier is
  'free = per-sale photo cap in app; pro = unlimited listing photos (fair use / infra limits).';

-- ---------------------------------------------------------------------------
-- Storage: public bucket for listing photos (read open; write restricted by path + sale ownership)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sale-photos',
  'sale-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path: sales/{operator_id}/{sale_id}/{file}
-- INSERT: authenticated, first folder sales, second = auth.uid(), sale exists and owned by operator
create policy "sale_photos_storage_insert_own_sale"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sale-photos'
    and split_part(name, '/', 1) = 'sales'
    and split_part(name, '/', 2) = (select auth.uid()::text)
    and exists (
      select 1
      from public.sales s
      where s.id::text = split_part(name, '/', 3)
        and s.operator_id = (select auth.uid())
    )
  );

create policy "sale_photos_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sale-photos'
    and split_part(name, '/', 1) = 'sales'
    and split_part(name, '/', 2) = (select auth.uid()::text)
  );

-- Public read is handled by bucket public = true; no extra SELECT policy needed for anon.
