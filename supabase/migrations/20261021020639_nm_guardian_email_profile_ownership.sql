alter table public.nm_profiles add column if not exists owner_id uuid references auth.users(id) on delete set null;
create index if not exists nm_profiles_owner_id_idx on public.nm_profiles(owner_id);
comment on column public.nm_profiles.owner_id is 'Verified guardian Auth user. Legacy rows stay unassigned until the academy verifies ownership.';
alter table public.nm_profiles enable row level security;
drop policy if exists "nm_profiles anon select" on public.nm_profiles;
drop policy if exists "nm_profiles anon insert" on public.nm_profiles;
drop policy if exists "nm_profiles anon update" on public.nm_profiles;
revoke all on public.nm_profiles from anon, public;
grant select, insert, update on public.nm_profiles to authenticated;
create policy nm_profiles_guardian_select on public.nm_profiles for select to authenticated using ((select auth.uid()) = owner_id);
create policy nm_profiles_guardian_insert on public.nm_profiles for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy nm_profiles_guardian_update on public.nm_profiles for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
alter table public.nm_contacts enable row level security;
drop policy if exists nm_contacts_anon_insert on public.nm_contacts;
revoke insert on public.nm_contacts from anon, public;
grant insert on public.nm_contacts to authenticated;
create policy nm_contacts_guardian_insert on public.nm_contacts for insert to authenticated with check (
 consent is true and exists (select 1 from public.nm_profiles p where p.name = profile_name and p.owner_id = (select auth.uid()))
);
