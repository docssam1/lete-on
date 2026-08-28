alter function public.readers_set_updated_at()
  set search_path = pg_catalog, public;

alter function public.lesson_content_touch()
  set search_path = pg_catalog, public;

revoke execute on function public.rls_auto_enable()
  from public, anon, authenticated;
