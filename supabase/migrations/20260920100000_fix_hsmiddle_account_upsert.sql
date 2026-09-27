create or replace function public.hsm_upsert_access_account(
  p_name text,
  p_code text,
  p_permissions jsonb,
  p_is_admin boolean default false
)
returns table(student_name text, permissions jsonb, is_admin boolean, active boolean, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.hsm_access_accounts%rowtype;
begin
  select account.* into existing from public.hsm_access_accounts account where account.student_name = btrim(p_name);
  if existing.student_name is null and coalesce(length(btrim(p_code)), 0) < 6 then
    raise exception 'code_required';
  end if;
  if jsonb_typeof(p_permissions) <> 'array' then
    raise exception 'permissions_invalid';
  end if;
  return query
  insert into public.hsm_access_accounts as account(student_name, code_hash, permissions, is_admin, active, updated_at)
  values (
    btrim(p_name),
    case when coalesce(length(btrim(p_code)), 0) >= 6 then extensions.crypt(upper(btrim(p_code)), extensions.gen_salt('bf', 12)) else existing.code_hash end,
    p_permissions,
    p_is_admin,
    true,
    now()
  )
  on conflict on constraint hsm_access_accounts_pkey do update set
    code_hash = excluded.code_hash,
    permissions = excluded.permissions,
    is_admin = case when account.is_admin then true else excluded.is_admin end,
    active = true,
    updated_at = now()
  returning account.student_name, account.permissions, account.is_admin, account.active, account.updated_at;
end;
$$;

revoke all on function public.hsm_upsert_access_account(text, text, jsonb, boolean) from public, anon, authenticated;
grant execute on function public.hsm_upsert_access_account(text, text, jsonb, boolean) to service_role;
