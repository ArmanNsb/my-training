-- Separate one-owner sync storage for My Training.
-- Safe to create in the SAME Supabase project as the friend's training app.
create table if not exists public.my_training_owner_records (
  record_type text not null check (record_type in ('workout', 'settings')),
  record_key text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (record_type, record_key)
);

create index if not exists my_training_owner_records_updated_at_idx
  on public.my_training_owner_records (updated_at);

alter table public.my_training_owner_records enable row level security;
revoke all on table public.my_training_owner_records from anon, authenticated;
grant all on table public.my_training_owner_records to service_role;
-- No browser policies: only the Edge Function accesses this table.
