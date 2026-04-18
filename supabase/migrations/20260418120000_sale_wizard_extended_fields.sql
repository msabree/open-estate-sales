-- Extended operator wizard fields: sale kind, phone visibility, directions, terms, structured dates.

alter table public.sales
  add column if not exists sale_kind text not null default 'estate_sale',
  add column if not exists phone_display text not null default 'hidden'
    check (phone_display in ('show_account', 'hidden', 'custom')),
  add column if not exists contact_phone_custom text,
  add column if not exists directions_parking text,
  add column if not exists terms_html text,
  add column if not exists sale_dates_json jsonb;

comment on column public.sales.sale_kind is
  'Listing category (extend app enum): estate_sale, moving_sale, warehouse_estate_sale, business_closing, …';
comment on column public.sales.phone_display is
  'show_account: use operators.phone; hidden: none; custom: contact_phone_custom.';
comment on column public.sales.contact_phone_custom is 'Shown when phone_display = custom.';
comment on column public.sales.directions_parking is 'Directions and parking notes for shoppers.';
comment on column public.sales.terms_html is 'Terms and conditions (HTML or plain text).';
comment on column public.sales.sale_dates_json is
  'Array of { date: YYYY-MM-DD, startTime, endTime }; up to 4 consecutive calendar days.';
