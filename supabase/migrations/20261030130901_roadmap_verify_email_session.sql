-- A still-signed JWT must not resurrect a logged-out email proof or admin session.
create schema if not exists roadmap_private;
revoke all on schema roadmap_private from public,anon,authenticated;
grant usage on schema roadmap_private to service_role;
create function roadmap_private.email_session_active(p_user_id uuid,p_session_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.sessions where id=p_session_id and user_id=p_user_id
    and (not_after is null or not_after>now()));
$$;
revoke all on function roadmap_private.email_session_active(uuid,uuid) from public,anon,authenticated;
grant execute on function roadmap_private.email_session_active(uuid,uuid) to service_role;
create function public.roadmap_email_session_active(p_user_id uuid,p_session_id uuid)
returns boolean language sql stable security invoker set search_path = '' as $$
  select roadmap_private.email_session_active(p_user_id,p_session_id);
$$;
revoke all on function public.roadmap_email_session_active(uuid,uuid) from public,anon,authenticated;
grant execute on function public.roadmap_email_session_active(uuid,uuid) to service_role;
