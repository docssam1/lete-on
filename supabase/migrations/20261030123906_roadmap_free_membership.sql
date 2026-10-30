-- Roadmap-only membership. No changes to other GFIELD accounts or credentials.
create table public.roadmap_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (email = lower(email)),
  student_name text not null check (char_length(student_name) between 1 and 30),
  guardian_phone text not null check (guardian_phone ~ '^01[0-9]{8,9}$'),
  school text not null check (school in ('preschool','elementary','middle','high')),
  age integer,
  grade integer,
  pin_hash text not null,
  session_version integer not null default 1,
  privacy_version text not null,
  privacy_agreed_at timestamptz not null default now(),
  guardian_agreed_at timestamptz not null default now(),
  email_verified_at timestamptz not null default now(),
  marketing_email boolean not null default false,
  marketing_sms boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roadmap_school_level check (
    (school = 'preschool' and age between 3 and 7 and age is not null and grade is null)
    or (school = 'elementary' and grade between 1 and 6 and grade is not null and age is null)
    or (school in ('middle','high') and grade between 1 and 3 and grade is not null and age is null)
  )
);
create table public.roadmap_consent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.roadmap_members(user_id) on delete cascade,
  kind text not null check (kind in ('privacy','guardian','marketing_email','marketing_sms')),
  agreed boolean not null,
  version text not null,
  recorded_at timestamptz not null default now()
);
create index roadmap_consent_user_time on public.roadmap_consent_events(user_id, recorded_at desc);
create table public.roadmap_sessions (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references public.roadmap_members(user_id) on delete cascade,
  session_version integer not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index roadmap_session_owner on public.roadmap_sessions(user_id);
create index roadmap_session_expiry on public.roadmap_sessions(expires_at);
create table public.roadmap_auth_limits (
  bucket text primary key,
  hits integer not null default 1,
  window_start timestamptz not null default now()
);
alter table public.roadmap_members enable row level security;
alter table public.roadmap_consent_events enable row level security;
alter table public.roadmap_sessions enable row level security;
alter table public.roadmap_auth_limits enable row level security;
revoke all on public.roadmap_members, public.roadmap_consent_events, public.roadmap_sessions, public.roadmap_auth_limits from public, anon, authenticated;
grant all on public.roadmap_members, public.roadmap_consent_events, public.roadmap_sessions, public.roadmap_auth_limits to service_role;
grant usage, select on sequence public.roadmap_consent_events_id_seq to service_role;

-- Atomic rate limit. Buckets contain keyed hashes, never email addresses or IPs.
create function public.roadmap_take_attempt(p_bucket text, p_limit integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if char_length(p_bucket) > 90 or p_limit not between 1 and 100 then return false; end if;
  delete from public.roadmap_auth_limits where window_start < now() - interval '1 day';
  insert into public.roadmap_auth_limits(bucket) values(p_bucket)
  on conflict(bucket) do update set
    hits = case when roadmap_auth_limits.window_start < now() - interval '15 minutes' then 1 else roadmap_auth_limits.hits + 1 end,
    window_start = case when roadmap_auth_limits.window_start < now() - interval '15 minutes' then now() else roadmap_auth_limits.window_start end
  returning hits into n;
  return n <= p_limit;
end;
$$;

-- Entire registration, PIN rotation, session revocation and consent history are one transaction.
create function public.roadmap_register(p_user_id uuid, p_email text, p_pin text, p_profile jsonb, p_consent jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare previous public.roadmap_members; item text; v text := 'roadmap-2026-10-30-v1';
begin
  if p_pin !~ '^[0-9]{8,12}$' then raise exception 'pin_invalid'; end if;
  if p_consent->>'version' is distinct from v or p_consent->>'privacy' is distinct from 'true'
    or p_consent->>'guardian' is distinct from 'true' then raise exception 'consent_required'; end if;
  select * into previous from public.roadmap_members where user_id=p_user_id for update;
  insert into public.roadmap_members(user_id,email,student_name,guardian_phone,school,age,grade,pin_hash,privacy_version,marketing_email,marketing_sms)
    values(p_user_id,lower(p_email),p_profile->>'studentName',p_profile->>'guardianPhone',p_profile->>'school',
      (p_profile->>'age')::integer,(p_profile->>'grade')::integer,
      extensions.crypt(p_pin,extensions.gen_salt('bf',10)),v,
      coalesce((p_consent->>'marketing_email')::boolean,false),coalesce((p_consent->>'marketing_sms')::boolean,false))
  on conflict(user_id) do update set email=excluded.email,student_name=excluded.student_name,guardian_phone=excluded.guardian_phone,
    school=excluded.school,age=excluded.age,grade=excluded.grade,pin_hash=excluded.pin_hash,
    privacy_version=v,privacy_agreed_at=now(),guardian_agreed_at=now(),email_verified_at=now(),
    marketing_email=excluded.marketing_email,marketing_sms=excluded.marketing_sms,
    session_version=roadmap_members.session_version+1,updated_at=now();
  delete from public.roadmap_sessions where user_id=p_user_id;
  foreach item in array array['privacy','guardian','marketing_email','marketing_sms'] loop
    insert into public.roadmap_consent_events(user_id,kind,agreed,version)
      values(p_user_id,item,coalesce((p_consent->>item)::boolean,false),v);
  end loop;
end;
$$;

-- Unknown email takes the same bcrypt path. The hash never leaves the database.
create function public.roadmap_verify_pin(p_email text,p_pin text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare m public.roadmap_members; candidate text;
begin
  select * into m from public.roadmap_members where email=lower(p_email);
  candidate := extensions.crypt(p_pin,coalesce(m.pin_hash,'$2a$10$0N8D6wslGiJ9a0iD2EwAY.TpTmgYOrJu0bA3eSIhyE8NC7LkC9M7u'));
  if m.user_id is not null and candidate=m.pin_hash then return m.user_id; end if;
  return null;
end;
$$;

create function public.roadmap_update_profile(p_user_id uuid,p_profile jsonb,p_marketing jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare m public.roadmap_members; item text; wanted boolean;
begin
  select * into m from public.roadmap_members where user_id=p_user_id for update;
  if m.user_id is null then raise exception 'member_missing'; end if;
  foreach item in array array['marketing_email','marketing_sms'] loop
    wanted := coalesce((p_marketing->>item)::boolean,false);
    if wanted is distinct from (to_jsonb(m)->>item)::boolean then
      insert into public.roadmap_consent_events(user_id,kind,agreed,version)
      values(p_user_id,item,wanted,'roadmap-2026-10-30-v1');
    end if;
  end loop;
  update public.roadmap_members set student_name=p_profile->>'studentName',guardian_phone=p_profile->>'guardianPhone',
    school=p_profile->>'school',age=(p_profile->>'age')::integer,grade=(p_profile->>'grade')::integer,
    marketing_email=coalesce((p_marketing->>'marketing_email')::boolean,false),
    marketing_sms=coalesce((p_marketing->>'marketing_sms')::boolean,false),updated_at=now() where user_id=p_user_id;
end;
$$;
revoke all on function public.roadmap_take_attempt(text,integer),public.roadmap_register(uuid,text,text,jsonb,jsonb),public.roadmap_verify_pin(text,text),public.roadmap_update_profile(uuid,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.roadmap_take_attempt(text,integer),public.roadmap_register(uuid,text,text,jsonb,jsonb),public.roadmap_verify_pin(text,text),public.roadmap_update_profile(uuid,jsonb,jsonb) to service_role;

create function public.roadmap_rotate_pin(p_user_id uuid,p_pin text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_pin !~ '^[0-9]{8,12}$' then raise exception 'pin_invalid'; end if;
  update public.roadmap_members set pin_hash=extensions.crypt(p_pin,extensions.gen_salt('bf',10)),
    session_version=session_version+1,updated_at=now() where user_id=p_user_id;
  if not found then raise exception 'member_missing'; end if;
  delete from public.roadmap_sessions where user_id=p_user_id;
end;
$$;
revoke all on function public.roadmap_rotate_pin(uuid,text) from public,anon,authenticated;
grant execute on function public.roadmap_rotate_pin(uuid,text) to service_role;
