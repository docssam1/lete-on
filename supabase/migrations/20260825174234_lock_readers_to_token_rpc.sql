drop policy if exists readers_anon_select on public.readers;
drop policy if exists readers_anon_insert on public.readers;
drop policy if exists readers_anon_update on public.readers;

revoke all privileges on table public.readers from anon, authenticated;
grant select, insert, update, delete on table public.readers to service_role;
