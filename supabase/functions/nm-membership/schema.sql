-- Numbers of Magic — membership / admin / manual worksheet SMS (private schema + single service-role RPC)
-- NOT applied by this file's author. Root reviews, applies, then seeds the admin account privately (see bottom comment).
-- Touches only: new schema nm_private, new function public.nm_membership_rpc. Reads auth.users, public.nm_profiles,
-- public.nm_contacts; writes public.nm_profiles ONLY via admin_link (owner_id) and admin_set_learning (state keys
-- adminPlan/roadSpeed/roadAmount/roadCadence[/schoolAge]) and, via register_contact/admin_link, nm_contacts rows of
-- the actor's own profile. Never touches auth.users writes, passwords, or other apps.
-- Signup policy: one student per email (partial unique index on nm_profiles.owner_id); the same phone MAY be used by
-- several accounts, so phone is never globally unique anywhere.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists nm_private;
revoke all on schema nm_private from public, anon, authenticated;
alter default privileges in schema nm_private revoke all on tables from public, anon, authenticated;
alter default privileges in schema nm_private revoke all on functions from public, anon, authenticated;

-- ===== tables (RLS on, no policies, no grants => only the SECURITY DEFINER owner can read/write) =====

create table if not exists nm_private.admin_accounts (
  username   text primary key check (username = lower(username) and char_length(username) between 1 and 64),
  code_hash  text not null,                      -- extensions.crypt(code, gen_salt('bf')) ; seeded privately by root
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists nm_private.admin_sessions (
  token_hash text primary key,                   -- sha256(opaque 256-bit token); the token itself is never stored
  username   text not null references nm_private.admin_accounts(username) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists nm_private.login_attempts (
  key_hash     text primary key,                 -- sha256(ip_hash || ':' || username)
  window_start timestamptz not null,
  attempts     integer not null
);

create table if not exists nm_private.memberships (
  owner_id         uuid primary key references auth.users(id) on delete cascade,
  trial_started_at timestamptz not null default now(),
  plan_code        text check (plan_code in ('six_month', 'annual')),
  starts_at        timestamptz,
  ends_at          timestamptz,
  revoked_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check ((plan_code is null and starts_at is null and ends_at is null)
      or (plan_code is not null and starts_at is not null and ends_at is not null and ends_at > starts_at))
);

create table if not exists nm_private.learning_settings (
  profile_name  text primary key,                -- = public.nm_profiles.name (no FK: uniqueness of that column is not assumed)
  course_key    text not null check (course_key ~ '^C(0|[1-9][0-9]?)$'),
  session_index integer not null check (session_index between 1 and 1000),
  speed         numeric(4,2) not null check (speed in (0.7, 0.85, 1, 1.25, 1.5)),
  amount        numeric(4,2) not null check (amount in (0.7, 0.85, 1, 1.25, 1.5)),
  cadence       text not null check (cadence in ('w1', 'w2')),
  entry_year    integer check (entry_year between 1990 and 2100),
  start_date    date not null,
  version       bigint not null default 1,
  updated_at    timestamptz not null default now()
);

-- Raw guardian phone lives only here and in public.nm_contacts. NO unique constraint on phone (siblings may share it).
create table if not exists nm_private.guardian_contacts (
  owner_id           uuid primary key references auth.users(id) on delete cascade,
  phone              text not null check (phone ~ '^01[0-9]{8,9}$'),
  collection_consent boolean not null check (collection_consent),
  sms_consent        boolean not null default false,
  consent_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  privacy_version    text,                          -- NM_PRIVACY.VERSION the guardian accepted; null = re-consent needed
  guardian_consent   boolean not null default false, -- learner or legal representative confirmation
  privacy_consent_at timestamptz
);
alter table nm_private.guardian_contacts add column if not exists privacy_version text;
alter table nm_private.guardian_contacts add column if not exists guardian_consent boolean not null default false;
alter table nm_private.guardian_contacts add column if not exists privacy_consent_at timestamptz;

-- One student profile per account/email. Partial, so unlinked profiles (owner_id NULL) are unaffected.
-- Fails (without changing data) if duplicates exist; nothing is deleted or reassigned here.
create unique index if not exists nm_profiles_one_student_per_owner_idx
  on public.nm_profiles (owner_id) where owner_id is not null;

create table if not exists nm_private.admin_audit (
  id         bigserial primary key,
  at         timestamptz not null default now(),
  admin_user text not null,
  action     text not null,
  target     text,
  detail     jsonb
);

create table if not exists nm_private.worksheet_previews (
  id               uuid primary key default gen_random_uuid(),
  token_hash       text not null unique,         -- sha256(128-bit token embedded in the link)
  admin_user       text not null,
  admin_session    text not null,                -- admin_sessions.token_hash that created it (send must come from same session)
  profile_name     text not null,
  owner_id         uuid not null,
  k                smallint not null check (k in (1, 2)),
  config           jsonb not null,               -- {courseKey,week,k,amount,cadence,sessionIndex} only — no identity
  message          text not null,
  title            text not null,
  message_type     text not null check (message_type in ('SMS', 'LMS')),
  phone_hash       text not null,                -- sha256(digits); raw phone is re-read from nm_contacts at send time
  phone_masked     text not null,
  settings_version bigint not null,
  send_expires_at  timestamptz not null,         -- +10 min
  share_expires_at timestamptz not null,         -- +14 days
  used_at          timestamptz,                  -- set exactly once, atomically, at send
  send_ok          boolean,
  send_status      text check (send_status in ('sent', 'queued', 'failed')),
  created_at       timestamptz not null default now()
);

alter table nm_private.admin_accounts     enable row level security;
alter table nm_private.admin_sessions     enable row level security;
alter table nm_private.login_attempts     enable row level security;
alter table nm_private.memberships        enable row level security;
alter table nm_private.learning_settings  enable row level security;
alter table nm_private.admin_audit        enable row level security;
alter table nm_private.worksheet_previews enable row level security;
alter table nm_private.guardian_contacts  enable row level security;
revoke all on all tables    in schema nm_private from public, anon, authenticated;
revoke all on all sequences in schema nm_private from public, anon, authenticated;

-- trial_started_at is immutable after first insert (also blocks owner change)
create or replace function nm_private.memberships_guard() returns trigger
language plpgsql set search_path = pg_catalog as $f$
begin
  if new.trial_started_at is distinct from old.trial_started_at or new.owner_id is distinct from old.owner_id then
    raise exception 'immutable';
  end if;
  new.updated_at := pg_catalog.now();
  return new;
end $f$;
drop trigger if exists memberships_guard on nm_private.memberships;
create trigger memberships_guard before update on nm_private.memberships
  for each row execute function nm_private.memberships_guard();

-- ===== helpers (not exposed: no grants; callable only from the definer RPC) =====

create or replace function nm_private.iso(p timestamptz) returns text
language sql immutable set search_path = pg_catalog as
$f$ select case when p is null then null else pg_catalog.to_char(p at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') end $f$;

create or replace function nm_private.sha256_hex(p text) returns text
language sql immutable set search_path = pg_catalog as
$f$ select pg_catalog.encode(extensions.digest(p, 'sha256'), 'hex') $f$;

create or replace function nm_private.jstr(p jsonb, k text, maxlen integer) returns text
language sql immutable set search_path = pg_catalog as
$f$ select case when pg_catalog.jsonb_typeof(p -> k) = 'string'
                 and pg_catalog.char_length(p ->> k) between 1 and maxlen
                 and (p ->> k) !~ '[\x01-\x1f\x7f]'
            then p ->> k end $f$;

create or replace function nm_private.jnum(p jsonb, k text) returns numeric
language sql immutable set search_path = pg_catalog as
$f$ select case when pg_catalog.jsonb_typeof(p -> k) = 'number' then (p ->> k)::numeric end $f$;

create or replace function nm_private.mask_phone(p text) returns text
language plpgsql immutable set search_path = pg_catalog as $f$
declare d text := pg_catalog.regexp_replace(coalesce(p, ''), '\D', '', 'g');
begin
  if pg_catalog.char_length(d) < 8 then return null; end if;
  return pg_catalog.substr(d, 1, 3) || '-****-' || pg_catalog.right(d, 4);
end $f$;

create or replace function nm_private.admin_hash(p_token text) returns text
language sql stable set search_path = pg_catalog as
$f$ select s.token_hash
      from nm_private.admin_sessions s
      join nm_private.admin_accounts a on a.username = s.username and a.active
     where p_token ~ '^[0-9a-f]{64}$'
       and s.token_hash = nm_private.sha256_hex(p_token)
       and s.expires_at > pg_catalog.now() $f$;

create or replace function nm_private.audit(p_user text, p_action text, p_target text, p_detail jsonb) returns void
language sql set search_path = pg_catalog as
$f$ insert into nm_private.admin_audit(admin_user, action, target, detail) values (p_user, p_action, p_target, p_detail) $f$;

-- status: revoked > paid > trial > expired. trial = trial_started_at + 30 days.
create or replace function nm_private.member_json(p_uid uuid) returns jsonb
language plpgsql stable set search_path = pg_catalog as $f$
declare
  m nm_private.memberships%rowtype;
  v_now timestamptz := pg_catalog.now();
  v_trial_end timestamptz;
  v_status text;
begin
  select * into m from nm_private.memberships where owner_id = p_uid;
  if not found then
    return pg_catalog.jsonb_build_object('userId', p_uid, 'trialStartedAt', null, 'trialEndsAt', null, 'plan', null,
      'startsAt', null, 'endsAt', null, 'status', 'none', 'canUse', false, 'serverNow', nm_private.iso(v_now));
  end if;
  v_trial_end := m.trial_started_at + interval '30 days';
  if m.revoked_at is not null then v_status := 'revoked';
  elsif m.plan_code is not null and m.starts_at <= v_now and v_now < m.ends_at then v_status := 'paid';
  elsif v_now < v_trial_end then v_status := 'trial';
  else v_status := 'expired';
  end if;
  return pg_catalog.jsonb_build_object('userId', p_uid, 'trialStartedAt', nm_private.iso(m.trial_started_at),
    'trialEndsAt', nm_private.iso(v_trial_end), 'plan', m.plan_code, 'startsAt', nm_private.iso(m.starts_at),
    'endsAt', nm_private.iso(m.ends_at), 'status', v_status, 'canUse', v_status in ('paid', 'trial'),
    'serverNow', nm_private.iso(v_now));
end $f$;

create or replace function nm_private.settings_json(p_name text) returns jsonb
language sql stable set search_path = pg_catalog as
$f$ select pg_catalog.jsonb_build_object('profileName', s.profile_name, 'courseKey', s.course_key, 'sessionIndex', s.session_index,
         'speed', s.speed, 'amount', s.amount, 'cadence', s.cadence, 'entryYear', s.entry_year, 'startDate', s.start_date,
         'version', s.version, 'updatedAt', nm_private.iso(s.updated_at))
      from nm_private.learning_settings s where s.profile_name = p_name $f$;

-- "M월 N주차" (Monday-based, KST) / w2: "M월 N-k주차" — same rule as weekly-notify calLabel
create or replace function nm_private.cal_label(p_cadence text, p_k integer) returns text
language plpgsql stable set search_path = pg_catalog as $f$
declare
  d date := (pg_catalog.now() at time zone 'Asia/Seoul')::date;
  mon date;
  nth integer;
  m integer;
begin
  mon := d - (EXTRACT(isodow from d)::integer - 1);
  nth := ((EXTRACT(day from mon)::integer - 1) / 7) + 1;
  m := EXTRACT(month from mon)::integer;
  if p_cadence = 'w2' then return m::text || '월 ' || nth::text || '-' || p_k::text || '주차'; end if;
  return m::text || '월 ' || nth::text || '주차';
end $f$;

-- Mirror a guardian phone into nm_contacts for ONE profile (matched by profile_name only; contacts of other
-- profiles/owners that happen to share the phone are never touched). Sends nothing.
-- nm_contacts.consent/active both follow SMS consent; other numbers of this profile are deactivated.
create or replace function nm_private.sync_contact(p_name text, p_phone text, p_sms boolean, p_at timestamptz) returns void
language plpgsql set search_path = pg_catalog as $f$
begin
  update public.nm_contacts c set active = false
   where c.profile_name = p_name and c.active
     and pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') <> p_phone;
  update public.nm_contacts c set consent = p_sms, active = p_sms, consent_at = p_at
   where c.profile_name = p_name
     and pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') = p_phone;
  if not found then
    insert into public.nm_contacts(profile_name, phone, consent, consent_at, active)
    values (p_name, p_phone, p_sms, p_at, p_sms)
    on conflict (profile_name, phone) do update set consent = excluded.consent, active = excluded.active, consent_at = excluded.consent_at;
  end if;
end $f$;

-- A newly created learner inherits only its own account's saved contact. This covers self-signup
-- after the phone step, as well as admin linking. No messages are dispatched by this trigger.
create or replace function nm_private.profile_contact_sync() returns trigger
language plpgsql security definer set search_path = pg_catalog as $f$
declare g nm_private.guardian_contacts%rowtype;
begin
  if new.owner_id is not null then
    select * into g from nm_private.guardian_contacts where owner_id = new.owner_id;
    if found then perform nm_private.sync_contact(new.name, g.phone, g.sms_consent, g.consent_at); end if;
  end if;
  return new;
end $f$;
drop trigger if exists nm_profile_contact_sync on public.nm_profiles;
create trigger nm_profile_contact_sync after insert or update of owner_id on public.nm_profiles
  for each row execute function nm_private.profile_contact_sync();

revoke all on all functions in schema nm_private from public, anon, authenticated;

-- ===== the ONE public entry point =====

create or replace function public.nm_membership_rpc(
  p_action  text,
  p_payload jsonb,
  p_actor   uuid default null,
  p_ip_hash text default null
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog
as $fn$
declare
  v_p     jsonb := p_payload;
  v_now   timestamptz := pg_catalog.now();
  v_sess  text;
  v_user  text;
  v_uid   uuid;
  v_email text;
  v_conf  timestamptz;
  v_name  text;
  v_text  text;
  v_q     text;
  v_hash  text;
  v_key   text;
  v_att   integer;
  v_token text;
  v_plan  text;
  v_cnt   integer;
  v_k     integer;
  v_phone text;
  v_out   jsonb;
  v_set   jsonb;
  v_profiles jsonb;
  v_members  jsonb;
  v_base  timestamptz;
  v_start timestamptz;
  v_end   timestamptz;
  v_cal   text;
  v_msg   text;
  v_title text;
  v_type  text;
  v_link  text;
  v_week  text;
  v_pid   uuid;
  v_speed numeric;
  v_amount numeric;
  v_sidx  numeric;
  v_year  numeric;
  v_cadence text;
  v_date  date;
  v_ver   bigint;
  v_reg   boolean;
  v_sms   boolean;
  v_cphone text;
  v_pver  text;
  v_pat   timestamptz;
  r       record;
  m       nm_private.memberships%rowtype;
  ls      nm_private.learning_settings%rowtype;
  pv      nm_private.worksheet_previews%rowtype;
begin
  if v_p is null or pg_catalog.jsonb_typeof(v_p) <> 'object' then v_p := '{}'::jsonb; end if;

  -- ---------------- status (verified JWT actor) ----------------
  if p_action = 'status' then
    if p_actor is null then return pg_catalog.jsonb_build_object('error', 'unauthorized', 'status', 401); end if;
    select u.email, u.email_confirmed_at into v_email, v_conf from auth.users u where u.id = p_actor;
    if not found or v_email is null or v_conf is null then
      return pg_catalog.jsonb_build_object('error', 'email_not_verified', 'status', 403);
    end if;
    insert into nm_private.memberships(owner_id) values (p_actor) on conflict (owner_id) do nothing;
    v_out := pg_catalog.jsonb_build_object('membership', nm_private.member_json(p_actor));
    -- contact summary: private guardian contact first, else a valid active legacy nm_contacts row of an owned profile
    v_reg := false; v_sms := false; v_cphone := null; v_pver := null; v_pat := null;
    select g.phone, g.sms_consent, g.privacy_version, g.privacy_consent_at into v_cphone, v_sms, v_pver, v_pat
      from nm_private.guardian_contacts g where g.owner_id = p_actor;
    if found then
      v_reg := true;
    else
      select pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g'), coalesce(c.consent, false) into v_cphone, v_sms
        from public.nm_contacts c join public.nm_profiles p on p.name = c.profile_name
       where p.owner_id = p_actor and c.active
         and pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') ~ '^01[0-9]{8,9}$'
       order by c.consent desc, c.id desc limit 1;
      if found then v_reg := true; else v_cphone := null; v_sms := false; end if;
    end if;
    v_out := v_out || pg_catalog.jsonb_build_object('contact', pg_catalog.jsonb_build_object(
      'registered', v_reg, 'phoneMasked', nm_private.mask_phone(v_cphone), 'smsConsent', coalesce(v_sms, false),
      'privacyVersion', v_pver, 'consentedAt', nm_private.iso(v_pat)));
    v_name := nm_private.jstr(v_p, 'profileName', 100);
    if v_name is not null and exists (select 1 from public.nm_profiles p where p.name = v_name and p.owner_id = p_actor) then
      v_set := nm_private.settings_json(v_name);
      if v_set is not null then v_out := v_out || pg_catalog.jsonb_build_object('settings', v_set); end if;
    end if;
    return v_out;
  end if;

  -- ---------------- register_contact (verified JWT actor only; client-supplied ids are never read) ----------------
  if p_action = 'register_contact' then
    if p_actor is null then return pg_catalog.jsonb_build_object('error', 'unauthorized', 'status', 401); end if;
    select u.email, u.email_confirmed_at into v_email, v_conf from auth.users u where u.id = p_actor;
    if not found or v_email is null or v_conf is null then
      return pg_catalog.jsonb_build_object('error', 'email_not_verified', 'status', 403);
    end if;
    -- phone omitted = keep the number on file (private contact first, else a valid legacy nm_contacts row);
    -- only a client on the current notice may do that. privacyVersion omitted = a client from before the
    -- 2026-10-22 notice (deploy window): its contact is saved but the stored consent version is kept, so
    -- the new app still asks for renewal.
    v_pver := v_p ->> 'privacyVersion';
    if v_p ? 'phone' then
      v_phone := nm_private.jstr(v_p, 'phone', 11);
    elsif v_pver is not null then
      select g.phone into v_phone from nm_private.guardian_contacts g where g.owner_id = p_actor;
      if not found then
        select pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') into v_phone
          from public.nm_contacts c join public.nm_profiles p on p.name = c.profile_name
         where p.owner_id = p_actor and c.active
           and pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') ~ '^01[0-9]{8,9}$'
         order by c.consent desc, c.id desc limit 1;
      end if;
    else
      v_phone := null;
    end if;
    if v_phone is null or v_phone !~ '^01[0-9]{8,9}$'
       or (v_p -> 'collectionConsent') is distinct from 'true'::jsonb
       or pg_catalog.jsonb_typeof(v_p -> 'smsConsent') is distinct from 'boolean'
       or (v_pver is not null and (v_pver <> '2026-10-22-v1' or (v_p -> 'guardianConsent') is distinct from 'true'::jsonb))
       or (v_pver is null and v_p ? 'guardianConsent') then
      return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
    end if;
    v_sms := (v_p ->> 'smsConsent')::boolean;
    insert into nm_private.guardian_contacts as g (owner_id, phone, collection_consent, sms_consent, consent_at, updated_at,
      privacy_version, guardian_consent, privacy_consent_at)
    values (p_actor, v_phone, true, v_sms, v_now, v_now, v_pver, v_pver is not null, case when v_pver is not null then v_now end)
    on conflict (owner_id) do update set phone = excluded.phone, collection_consent = true,
      sms_consent = excluded.sms_consent, consent_at = v_now, updated_at = v_now,
      privacy_version = coalesce(excluded.privacy_version, g.privacy_version),
      guardian_consent = g.guardian_consent or excluded.guardian_consent,
      privacy_consent_at = coalesce(excluded.privacy_consent_at, g.privacy_consent_at);
    for r in select p.name from public.nm_profiles p where p.owner_id = p_actor loop
      perform nm_private.sync_contact(r.name, v_phone, v_sms, v_now);
    end loop;
    return pg_catalog.jsonb_build_object('ok', true);
  end if;

  -- Internal cron context. The HTTP handler has no matching action; only service_role can call
  -- this RPC. Legacy unowned records retain their previous delivery behavior.
  if p_action = 'system_delivery' then
    v_name := nm_private.jstr(v_p, 'profileName', 100);
    v_phone := nm_private.jstr(v_p, 'phone', 11);
    v_k := case when nm_private.jnum(v_p, 'k') in (1,2) then nm_private.jnum(v_p, 'k')::integer end;
    v_week := nm_private.jstr(v_p, 'week', 8);
    if v_name is null or v_phone !~ '^01[0-9]{8,9}$' or v_k is null
       or v_week is null or v_week !~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$' then
      return pg_catalog.jsonb_build_object('error','bad_request','status',400);
    end if;
    select owner_id into v_uid from public.nm_profiles where name=v_name;
    if not found then return pg_catalog.jsonb_build_object('managed',true,'canUse',false); end if;
    if v_uid is null then return pg_catalog.jsonb_build_object('managed',false); end if;
    select * into ls from nm_private.learning_settings where profile_name=v_name;
    v_cadence := coalesce(ls.cadence, (select case when state->>'roadCadence'='w2' then 'w2' else 'w1' end from public.nm_profiles where name=v_name), 'w1');
    if not (nm_private.member_json(v_uid)->>'canUse')::boolean or (v_k=2 and v_cadence<>'w2')
       or not exists (select 1 from public.nm_contacts c where c.profile_name=v_name and c.active and c.consent
                       and pg_catalog.regexp_replace(c.phone,'\D','','g')=v_phone) then
      return pg_catalog.jsonb_build_object('managed',true,'canUse',false,'cadence',v_cadence);
    end if;
    if ls.profile_name is null then
      return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',null);
    end if;
    v_token := pg_catalog.encode(extensions.gen_random_bytes(16),'hex');
    v_link := 'https://lete-on.gfieldacademy.net/w/?m='||v_token;
    insert into nm_private.worksheet_previews(token_hash,admin_user,admin_session,profile_name,owner_id,k,config,
      message,title,message_type,phone_hash,phone_masked,settings_version,send_expires_at,share_expires_at)
    values(nm_private.sha256_hex(v_token),'automatic','cron',v_name,v_uid,v_k::smallint,
      pg_catalog.jsonb_build_object('courseKey',ls.course_key,'week',v_week,'k',v_k,'amount',ls.amount,
        'cadence',ls.cadence,'sessionIndex',ls.session_index),
      '','','SMS',nm_private.sha256_hex(v_phone),nm_private.mask_phone(v_phone),ls.version,
      v_now, v_now+interval '14 days');
    return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',v_link);
  end if;

  -- ---------------- public: resolve (does not consume, no writes) ----------------
  if p_action = 'resolve_worksheet' then
    v_text := nm_private.jstr(v_p, 'token', 32);
    if v_text is null or v_text !~ '^[0-9a-f]{32}$' then return pg_catalog.jsonb_build_object('error', 'not_found', 'status', 404); end if;
    select * into pv from nm_private.worksheet_previews
     where token_hash = nm_private.sha256_hex(v_text) and share_expires_at > v_now;
    if not found then return pg_catalog.jsonb_build_object('error', 'not_found', 'status', 404); end if;
    return pg_catalog.jsonb_build_object('config', pv.config);
  end if;

  -- ---------------- admin_login ----------------
  if p_action = 'admin_login' then
    -- fail closed: no usable rate-limit key => refuse
    if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
      return pg_catalog.jsonb_build_object('error', 'rate_limit_unavailable', 'status', 503);
    end if;
    v_user := nm_private.jstr(v_p, 'username', 64);
    v_text := nm_private.jstr(v_p, 'code', 128);
    if v_user is null or v_text is null then return pg_catalog.jsonb_build_object('error', 'invalid_credentials', 'status', 401); end if;
    v_user := pg_catalog.lower(v_user);
    v_key := nm_private.sha256_hex(p_ip_hash || ':' || v_user);
    insert into nm_private.login_attempts as la (key_hash, window_start, attempts) values (v_key, v_now, 1)
    on conflict (key_hash) do update set
      attempts     = case when la.window_start <= v_now - interval '15 minutes' then 1 else la.attempts + 1 end,
      window_start = case when la.window_start <= v_now - interval '15 minutes' then v_now else la.window_start end
    returning attempts into v_att;
    if v_att > 8 then return pg_catalog.jsonb_build_object('error', 'rate_limited', 'status', 429); end if;
    select a.code_hash into v_hash from nm_private.admin_accounts a where a.username = v_user and a.active;
    if v_hash is not null and extensions.crypt(v_text, v_hash) = v_hash then
      delete from nm_private.login_attempts where key_hash = v_key;
      delete from nm_private.admin_sessions where expires_at <= v_now;
      delete from nm_private.login_attempts where window_start <= v_now - interval '1 day';
      v_token := pg_catalog.encode(extensions.gen_random_bytes(32), 'hex');
      v_end := v_now + interval '2 hours';
      insert into nm_private.admin_sessions(token_hash, username, expires_at) values (nm_private.sha256_hex(v_token), v_user, v_end);
      perform nm_private.audit(v_user, 'login', null, null);
      return pg_catalog.jsonb_build_object('token', v_token, 'expiresAt', nm_private.iso(v_end));
    end if;
    perform extensions.crypt(v_text, extensions.gen_salt('bf'));   -- equalise timing for unknown user
    return pg_catalog.jsonb_build_object('error', 'invalid_credentials', 'status', 401);
  end if;

  -- ---------------- everything below needs an admin session ----------------
  if p_action in ('admin_logout','admin_list','admin_grant','admin_revoke','admin_link','admin_set_learning',
                  'admin_preview_worksheet','admin_send_begin','admin_send_finish') then
    v_text := nm_private.jstr(v_p, 'adminToken', 64);
    if p_action = 'admin_logout' then
      if v_text is not null and v_text ~ '^[0-9a-f]{64}$' then
        delete from nm_private.admin_sessions where token_hash = nm_private.sha256_hex(v_text);
      end if;
      return pg_catalog.jsonb_build_object('ok', true);
    end if;
    v_sess := nm_private.admin_hash(v_text);
    if v_sess is null then return pg_catalog.jsonb_build_object('error', 'unauthorized', 'status', 401); end if;
    select s.username into v_user from nm_private.admin_sessions s where s.token_hash = v_sess;

    -- ----- admin_list -----
    if p_action = 'admin_list' then
      v_q := nm_private.jstr(v_p, 'query', 254);
      v_members := '[]'::jsonb;
      for r in
        select u.id, u.email from auth.users u
         where u.email_confirmed_at is not null and u.email is not null
           and ( exists (select 1 from nm_private.memberships ms where ms.owner_id = u.id)
              or exists (select 1 from public.nm_profiles p where p.owner_id = u.id)
              or (v_q is not null and pg_catalog.lower(u.email) = pg_catalog.lower(v_q)) )   -- exact verified-email candidate
           and ( v_q is null
              or pg_catalog.strpos(pg_catalog.lower(u.email), pg_catalog.lower(v_q)) > 0
              or exists (select 1 from public.nm_profiles p where p.owner_id = u.id
                          and pg_catalog.strpos(pg_catalog.lower(p.name), pg_catalog.lower(v_q)) > 0) )
         order by u.email limit 200
      loop
        select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
                 'name', p.name,
                 'settings', nm_private.settings_json(p.name),
                 'phoneMasked', (select nm_private.mask_phone(c.phone) from public.nm_contacts c
                                  where c.profile_name = p.name and c.active order by c.consent desc limit 1),
                 'hasConsent', exists (select 1 from public.nm_contacts c where c.profile_name = p.name and c.active and c.consent)
               ) order by p.name), '[]'::jsonb)
          into v_profiles from public.nm_profiles p where p.owner_id = r.id;
        v_members := v_members || pg_catalog.jsonb_build_array(
          nm_private.member_json(r.id) || pg_catalog.jsonb_build_object('email', r.email, 'profiles', v_profiles));
      end loop;
      select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('name', x.name) order by x.name), '[]'::jsonb)
        into v_profiles
        from (select p.name from public.nm_profiles p
               where p.owner_id is null
                 and (v_q is null or pg_catalog.strpos(pg_catalog.lower(p.name), pg_catalog.lower(v_q)) > 0)
               order by p.name limit 500) x;
      return pg_catalog.jsonb_build_object('members', v_members, 'unlinkedProfiles', v_profiles);
    end if;

    -- ----- admin_grant -----
    if p_action = 'admin_grant' then
      v_email := pg_catalog.lower(coalesce(nm_private.jstr(v_p, 'email', 254), ''));
      v_plan := nm_private.jstr(v_p, 'plan', 16);
      if v_plan is null or v_plan not in ('six_month', 'annual') then
        return pg_catalog.jsonb_build_object('error', 'bad_plan', 'status', 400);
      end if;
      select u.id into v_uid from auth.users u
       where pg_catalog.lower(u.email) = v_email and u.email_confirmed_at is not null limit 1;
      if v_uid is null then return pg_catalog.jsonb_build_object('error', 'member_not_eligible', 'status', 404); end if;
      insert into nm_private.memberships(owner_id) values (v_uid) on conflict (owner_id) do nothing;
      select * into m from nm_private.memberships where owner_id = v_uid for update;
      v_base := v_now; v_start := v_now;
      if m.revoked_at is null and m.plan_code is not null and m.ends_at > v_now then
        v_base := m.ends_at; v_start := m.starts_at;     -- extend from existing unrevoked plan end
      end if;
      v_end := case v_plan when 'six_month' then v_base + interval '6 months' else v_base + interval '1 year' end;
      update nm_private.memberships
         set plan_code = v_plan, starts_at = v_start, ends_at = v_end, revoked_at = null
       where owner_id = v_uid;
      perform nm_private.audit(v_user, 'grant', v_uid::text, pg_catalog.jsonb_build_object('plan', v_plan));
      return pg_catalog.jsonb_build_object('member', nm_private.member_json(v_uid) || pg_catalog.jsonb_build_object('email', v_email));
    end if;

    -- ----- admin_revoke (records preserved; revoke wins over trial and plan) -----
    if p_action = 'admin_revoke' then
      v_text := nm_private.jstr(v_p, 'userId', 36);
      if v_text is null or v_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      v_uid := v_text::uuid;
      if not exists (select 1 from auth.users u where u.id = v_uid) then
        return pg_catalog.jsonb_build_object('error', 'member_not_found', 'status', 404);
      end if;
      insert into nm_private.memberships(owner_id, revoked_at) values (v_uid, v_now)
      on conflict (owner_id) do update set revoked_at = coalesce(nm_private.memberships.revoked_at, v_now);
      perform nm_private.audit(v_user, 'revoke', v_uid::text, null);
      return pg_catalog.jsonb_build_object('ok', true);
    end if;

    -- ----- admin_link (NULL owner or same owner only; never by name alone) -----
    if p_action = 'admin_link' then
      v_email := pg_catalog.lower(coalesce(nm_private.jstr(v_p, 'email', 254), ''));
      v_name := nm_private.jstr(v_p, 'profileName', 100);
      if v_name is null then return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400); end if;
      select u.id into v_uid from auth.users u
       where pg_catalog.lower(u.email) = v_email and u.email_confirmed_at is not null limit 1;
      if v_uid is null then return pg_catalog.jsonb_build_object('error', 'member_not_eligible', 'status', 404); end if;
      select pg_catalog.count(*) into v_cnt from public.nm_profiles p where p.name = v_name;
      if v_cnt = 0 then return pg_catalog.jsonb_build_object('error', 'profile_not_found', 'status', 404); end if;
      if v_cnt > 1 then return pg_catalog.jsonb_build_object('error', 'profile_ambiguous', 'status', 409); end if;
      select p.owner_id into v_pid from public.nm_profiles p where p.name = v_name for update;
      if v_pid is not null and v_pid <> v_uid then
        return pg_catalog.jsonb_build_object('error', 'profile_owned', 'status', 409);
      end if;
      -- one student per email: the target email must not already own a different profile
      if exists (select 1 from public.nm_profiles p where p.owner_id = v_uid and p.name <> v_name) then
        return pg_catalog.jsonb_build_object('error', 'email_already_linked', 'status', 409);
      end if;
      if v_pid is null then
        begin
          update public.nm_profiles set owner_id = v_uid where name = v_name and owner_id is null;
        exception when unique_violation then   -- race against nm_profiles_one_student_per_owner_idx
          return pg_catalog.jsonb_build_object('error', 'email_already_linked', 'status', 409);
        end;
      end if;
      -- bridge the saved private guardian contact into nm_contacts for this profile (no SMS is sent)
      select g.phone, g.sms_consent into v_cphone, v_sms from nm_private.guardian_contacts g where g.owner_id = v_uid;
      if found then perform nm_private.sync_contact(v_name, v_cphone, v_sms, v_now); end if;
      perform nm_private.audit(v_user, 'link', v_uid::text, pg_catalog.jsonb_build_object('profile', v_name));
      return pg_catalog.jsonb_build_object('ok', true);
    end if;

    -- ----- admin_set_learning -----
    if p_action = 'admin_set_learning' then
      v_name := nm_private.jstr(v_p, 'profileName', 100);
      v_text := nm_private.jstr(v_p, 'courseKey', 4);
      v_sidx := nm_private.jnum(v_p, 'sessionIndex');
      v_speed := nm_private.jnum(v_p, 'speed');
      v_amount := nm_private.jnum(v_p, 'amount');
      v_cadence := nm_private.jstr(v_p, 'cadence', 2);
      v_year := nm_private.jnum(v_p, 'entryYear');
      if v_name is null or v_text is null or v_text !~ '^C(0|[1-9][0-9]?)$' or pg_catalog.substr(v_text, 2)::integer > 73
         or v_sidx is null or v_sidx <> pg_catalog.trunc(v_sidx) or v_sidx < 1 or v_sidx > 1000
         or v_speed is null or v_speed not in (0.7, 0.85, 1, 1.25, 1.5)
         or v_amount is null or v_amount not in (0.7, 0.85, 1, 1.25, 1.5)
         or v_cadence is null or v_cadence not in ('w1', 'w2')
         or (pg_catalog.jsonb_typeof(v_p -> 'entryYear') not in ('number', 'null') and v_p ? 'entryYear')
         or (v_year is not null and (v_year <> pg_catalog.trunc(v_year) or v_year < 1990 or v_year > 2100))
         or nm_private.jstr(v_p, 'startDate', 10) is null or nm_private.jstr(v_p, 'startDate', 10) !~ '^\d{4}-\d{2}-\d{2}$' then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      begin
        v_date := (v_p ->> 'startDate')::date;
      exception when others then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end;
      if v_date < date '2020-01-01' or v_date > date '2100-12-31' then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      select pg_catalog.count(*) into v_cnt from public.nm_profiles p where p.name = v_name;
      if v_cnt = 0 then return pg_catalog.jsonb_build_object('error', 'profile_not_found', 'status', 404); end if;
      if v_cnt > 1 then return pg_catalog.jsonb_build_object('error', 'profile_ambiguous', 'status', 409); end if;
      select p.owner_id into v_uid from public.nm_profiles p where p.name = v_name;
      if v_uid is null then return pg_catalog.jsonb_build_object('error', 'profile_unlinked', 'status', 409); end if;
      insert into nm_private.learning_settings as s
        (profile_name, course_key, session_index, speed, amount, cadence, entry_year, start_date)
      values (v_name, v_text, v_sidx::integer, v_speed, v_amount, v_cadence, v_year::integer, v_date)
      on conflict (profile_name) do update set
        course_key = excluded.course_key, session_index = excluded.session_index, speed = excluded.speed,
        amount = excluded.amount, cadence = excluded.cadence, entry_year = excluded.entry_year,
        start_date = excluded.start_date, version = s.version + 1, updated_at = v_now
      returning s.version into v_ver;
      -- Mirror into the profile state: ONLY these keys are written (jsonb concat keeps progress/diagnostics/records intact).
      -- schoolAge uses the client's shape {entryYear, setAt(epoch ms)}; the March transition is computed at read time.
      update public.nm_profiles
         set state = coalesce(state, '{}'::jsonb)
           || pg_catalog.jsonb_build_object(
                'adminPlan', nm_private.settings_json(v_name),
                'roadSpeed', v_speed, 'roadAmount', v_amount, 'roadCadence', v_cadence)
           || case when v_year is not null
                   then pg_catalog.jsonb_build_object('schoolAge',
                          pg_catalog.jsonb_build_object('entryYear', v_year::integer,
                            'setAt', pg_catalog.floor(EXTRACT(epoch from v_now) * 1000)::bigint))
                   else '{}'::jsonb end
       where name = v_name;
      perform nm_private.audit(v_user, 'set_learning', v_name, pg_catalog.jsonb_build_object('course', v_text, 'version', v_ver));
      return pg_catalog.jsonb_build_object('settings', nm_private.settings_json(v_name));
    end if;

    -- ----- admin_preview_worksheet (stores a snapshot; sends nothing) -----
    if p_action = 'admin_preview_worksheet' then
      v_name := nm_private.jstr(v_p, 'profileName', 100);
      v_k := case when nm_private.jnum(v_p, 'k') in (1, 2) then nm_private.jnum(v_p, 'k')::integer end;
      if v_name is null or v_k is null or v_k not in (1, 2) then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      select pg_catalog.count(*) into v_cnt from public.nm_profiles p where p.name = v_name;
      if v_cnt = 0 then return pg_catalog.jsonb_build_object('error', 'profile_not_found', 'status', 404); end if;
      if v_cnt > 1 then return pg_catalog.jsonb_build_object('error', 'profile_ambiguous', 'status', 409); end if;
      select p.owner_id into v_uid from public.nm_profiles p where p.name = v_name;
      if v_uid is null then return pg_catalog.jsonb_build_object('error', 'profile_unlinked', 'status', 409); end if;
      if not (nm_private.member_json(v_uid) ->> 'canUse')::boolean then
        return pg_catalog.jsonb_build_object('error', 'plan_required', 'status', 403);
      end if;
      select * into ls from nm_private.learning_settings where profile_name = v_name;
      if not found then return pg_catalog.jsonb_build_object('error', 'settings_required', 'status', 409); end if;
      if v_k = 2 and ls.cadence <> 'w2' then return pg_catalog.jsonb_build_object('error', 'bad_k', 'status', 400); end if;
      select pg_catalog.count(*) into v_cnt from public.nm_contacts c where c.profile_name = v_name and c.active and c.consent;
      if v_cnt = 0 then return pg_catalog.jsonb_build_object('error', 'consent_required', 'status', 409); end if;
      if v_cnt > 1 then return pg_catalog.jsonb_build_object('error', 'contact_ambiguous', 'status', 409); end if;
      select pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') into v_phone
        from public.nm_contacts c where c.profile_name = v_name and c.active and c.consent;
      if v_phone !~ '^01[0-9]{8,9}$' then return pg_catalog.jsonb_build_object('error', 'bad_phone', 'status', 409); end if;

      v_token := pg_catalog.encode(extensions.gen_random_bytes(16), 'hex');
      v_link := 'https://lete-on.gfieldacademy.net/w/?m=' || v_token;
      v_cal := nm_private.cal_label(ls.cadence, v_k);
      v_week := pg_catalog.to_char((pg_catalog.now() at time zone 'Asia/Seoul')::date
                  - (EXTRACT(isodow from (pg_catalog.now() at time zone 'Asia/Seoul')::date)::integer - 1), 'IYYY-"W"IW');
      v_msg := '[numbers of magic] ' || v_name || ' ' || v_cal || E'\n' || v_link;
      if pg_catalog.char_length(v_msg) + pg_catalog.char_length(pg_catalog.regexp_replace(v_msg, '[\x01-\x7f]', '', 'g')) <= 90 then
        v_type := 'SMS'; v_title := '';
      else
        v_type := 'LMS'; v_title := v_cal || ' 학습지';
        v_msg := '[numbers of magic] ' || v_cal || ' 학습지' || E'\n' || v_name || ' 학생' || E'\n' || v_link || E'\n문의·수신해지: 학원';
      end if;
      insert into nm_private.worksheet_previews
        (token_hash, admin_user, admin_session, profile_name, owner_id, k, config, message, title, message_type,
         phone_hash, phone_masked, settings_version, send_expires_at, share_expires_at)
      values (nm_private.sha256_hex(v_token), v_user, v_sess, v_name, v_uid, v_k::smallint,
              pg_catalog.jsonb_build_object('courseKey', ls.course_key, 'week', v_week, 'k', v_k, 'amount', ls.amount,
                                            'cadence', ls.cadence, 'sessionIndex', ls.session_index),
              v_msg, v_title, v_type, nm_private.sha256_hex(v_phone), nm_private.mask_phone(v_phone), ls.version,
              v_now + interval '10 minutes', v_now + interval '14 days')
      returning id into v_pid;
      perform nm_private.audit(v_user, 'preview', v_name, pg_catalog.jsonb_build_object('previewId', v_pid, 'k', v_k));
      return pg_catalog.jsonb_build_object('previewId', v_pid, 'message', v_msg, 'link', v_link,
        'phoneMasked', nm_private.mask_phone(v_phone), 'messageType', v_type, 'expiresAt', nm_private.iso(v_now + interval '10 minutes'));
    end if;

    -- ----- admin_send_begin: validate + consume exactly once; returns the server-built payload to the edge only -----
    if p_action = 'admin_send_begin' then
      v_text := nm_private.jstr(v_p, 'previewId', 36);
      if v_text is null or v_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      select * into pv from nm_private.worksheet_previews
       where id = v_text::uuid and admin_session = v_sess for update;      -- row lock serialises concurrent sends
      if not found then return pg_catalog.jsonb_build_object('error', 'preview_not_found', 'status', 404); end if;
      if pv.used_at is not null then      -- idempotent replay: never dispatch again
        return pg_catalog.jsonb_build_object('replay', pg_catalog.jsonb_build_object(
          'ok', pv.send_ok, 'status', coalesce(pv.send_status, 'failed'), 'phoneMasked', pv.phone_masked));
      end if;
      if pv.send_expires_at <= v_now then return pg_catalog.jsonb_build_object('error', 'preview_expired', 'status', 410); end if;
      if not exists (select 1 from public.nm_profiles p where p.name = pv.profile_name and p.owner_id = pv.owner_id) then
        return pg_catalog.jsonb_build_object('error', 'profile_changed', 'status', 409);
      end if;
      if not (nm_private.member_json(pv.owner_id) ->> 'canUse')::boolean then
        return pg_catalog.jsonb_build_object('error', 'plan_required', 'status', 403);
      end if;
      select s.version into v_ver from nm_private.learning_settings s where s.profile_name = pv.profile_name;
      if v_ver is distinct from pv.settings_version then
        return pg_catalog.jsonb_build_object('error', 'settings_changed', 'status', 409);
      end if;
      select pg_catalog.count(*) into v_cnt from public.nm_contacts c where c.profile_name = pv.profile_name and c.active and c.consent;
      if v_cnt = 0 then return pg_catalog.jsonb_build_object('error', 'consent_required', 'status', 409); end if;
      if v_cnt > 1 then return pg_catalog.jsonb_build_object('error', 'contact_ambiguous', 'status', 409); end if;
      select pg_catalog.regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') into v_phone
        from public.nm_contacts c where c.profile_name = pv.profile_name and c.active and c.consent;
      if v_phone !~ '^01[0-9]{8,9}$' or nm_private.sha256_hex(v_phone) <> pv.phone_hash then
        return pg_catalog.jsonb_build_object('error', 'contact_changed', 'status', 409);
      end if;
      update nm_private.worksheet_previews set used_at = v_now where id = pv.id and used_at is null;
      perform nm_private.audit(v_user, 'send_begin', pv.profile_name, pg_catalog.jsonb_build_object('previewId', pv.id));
      return pg_catalog.jsonb_build_object('phoneMasked', pv.phone_masked, 'payload', pg_catalog.jsonb_build_object(
        'phone', v_phone, 'title', pv.title, 'msg', pv.message, 'msgType', pv.message_type));
    end if;

    -- ----- admin_send_finish: record the outcome once -----
    if p_action = 'admin_send_finish' then
      v_text := nm_private.jstr(v_p, 'previewId', 36);
      v_plan := nm_private.jstr(v_p, 'status', 10);
      if v_text is null or v_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
         or v_plan is null or v_plan not in ('sent', 'queued', 'failed') then
        return pg_catalog.jsonb_build_object('error', 'bad_request', 'status', 400);
      end if;
      update nm_private.worksheet_previews
         set send_status = v_plan,
             send_ok = case pg_catalog.jsonb_typeof(v_p -> 'ok') when 'boolean' then (v_p ->> 'ok')::boolean else null end
       where id = v_text::uuid and admin_session = v_sess and used_at is not null and send_status is null;
      perform nm_private.audit(v_user, 'send_finish', v_text, pg_catalog.jsonb_build_object('status', v_plan));
      return pg_catalog.jsonb_build_object('ok', true);
    end if;
  end if;

  return pg_catalog.jsonb_build_object('error', 'bad_action', 'status', 400);
exception when others then
  -- never leak SQL errors / internals
  return pg_catalog.jsonb_build_object('error', 'server_error', 'status', 503);
end
$fn$;

revoke all on function public.nm_membership_rpc(text, jsonb, uuid, text) from public, anon, authenticated;
grant execute on function public.nm_membership_rpc(text, jsonb, uuid, text) to service_role;

-- ===== Root-only bootstrap, run privately AFTER deploying this file (never commit the real values): =====
--   insert into nm_private.admin_accounts(username, code_hash)
--   values (lower('<private-username>'), extensions.crypt('<private-code>', extensions.gen_salt('bf', 10)));
