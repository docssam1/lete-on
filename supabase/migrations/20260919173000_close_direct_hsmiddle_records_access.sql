drop policy if exists hsm_students_insert on public.hsm_students;
drop policy if exists hsm_students_select on public.hsm_students;
drop policy if exists hsm_attempts_insert on public.hsm_attempts;
drop policy if exists hsm_attempts_select on public.hsm_attempts;

revoke all on public.hsm_students from public, anon, authenticated;
revoke all on public.hsm_attempts from public, anon, authenticated;

grant select, insert, update, delete on public.hsm_students to service_role;
grant select, insert, update, delete on public.hsm_attempts to service_role;
