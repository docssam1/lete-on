begin;

alter table public.hf_asset_url_events
  add column id uuid primary key default gen_random_uuid();

create index hf_entitlements_permission_key_idx
  on public.hf_entitlements(permission_key);

create policy hf_asset_url_events_no_client_access
on public.hf_asset_url_events for all to authenticated
using (false)
with check (false);

commit;
