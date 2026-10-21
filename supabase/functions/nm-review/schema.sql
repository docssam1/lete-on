-- Learning-only review credentials. No admin, membership, contacts or student privileges.
create table if not exists nm_private.review_accounts (
 username text primary key check(username=lower(username) and username ~ '^[a-z0-9_.-]{1,64}$'),
 code_hash text not null,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists nm_private.review_sessions (
 token_hash text primary key,
 username text not null references nm_private.review_accounts(username) on delete cascade,
 expires_at timestamptz not null,
 created_at timestamptz not null default now()
);
alter table nm_private.review_accounts enable row level security;
alter table nm_private.review_sessions enable row level security;
revoke all on nm_private.review_accounts,nm_private.review_sessions from public,anon,authenticated;
create or replace function public.nm_review_rpc(p_action text,p_payload jsonb,p_ip_hash text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u text; c text; h text; tok text; exp timestamptz;
 k text; uk text; a integer; ua integer; ts timestamptz:=clock_timestamp();
begin
 if p_action='login' then
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
   return jsonb_build_object('error','unavailable','status',503);
  end if;
  u:=lower(nm_private.jstr(p_payload,'username',64));
  c:=nm_private.jstr(p_payload,'code',128);
  if u is null or u !~ '^[a-z0-9_.-]{1,64}$' or c is null or octet_length(c)>72 then
   return jsonb_build_object('error','invalid_credentials','status',401);
  end if;
  k:=nm_private.sha256_hex('review-ip:'||p_ip_hash||':'||u);
  uk:=nm_private.sha256_hex('review-user:'||u);
  insert into nm_private.login_attempts as la(key_hash,window_start,attempts) values(k,ts,1)
   on conflict(key_hash) do update set
    attempts=case when la.window_start<=ts-interval '15 minutes' then 1 else la.attempts+1 end,
    window_start=case when la.window_start<=ts-interval '15 minutes' then ts else la.window_start end
   returning attempts into a;
  insert into nm_private.login_attempts as la(key_hash,window_start,attempts) values(uk,ts,1)
   on conflict(key_hash) do update set
    attempts=case when la.window_start<=ts-interval '15 minutes' then 1 else la.attempts+1 end,
    window_start=case when la.window_start<=ts-interval '15 minutes' then ts else la.window_start end
   returning attempts into ua;
  if a>8 or ua>20 then return jsonb_build_object('error','rate_limited','status',429); end if;
  select code_hash into h from nm_private.review_accounts where username=u and active;
  if h is null then
   perform extensions.crypt(c,extensions.gen_salt('bf',12));
   return jsonb_build_object('error','invalid_credentials','status',401);
  end if;
  if extensions.crypt(c,h)<>h then return jsonb_build_object('error','invalid_credentials','status',401); end if;
  delete from nm_private.login_attempts where key_hash in(k,uk);
  delete from nm_private.review_sessions where expires_at<=ts;
  tok:=encode(extensions.gen_random_bytes(32),'hex');exp:=ts+interval '2 hours';
  insert into nm_private.review_sessions(token_hash,username,expires_at) values(nm_private.sha256_hex(tok),u,exp);
  return jsonb_build_object('token',tok,'username',u,'expiresAt',nm_private.iso(exp),'scope','learning_review');
 end if;
 if p_action not in('status','logout') then return jsonb_build_object('error','action_invalid','status',400); end if;
 tok:=nm_private.jstr(p_payload,'token',64);
 if tok is null or tok !~ '^[0-9a-f]{64}$' then return jsonb_build_object('error','unauthorized','status',401); end if;
 if p_action='logout' then
  delete from nm_private.review_sessions where token_hash=nm_private.sha256_hex(tok);
  return jsonb_build_object('ok',true);
 end if;
 select s.username,s.expires_at into u,exp from nm_private.review_sessions s
  join nm_private.review_accounts a on a.username=s.username and a.active
  where s.token_hash=nm_private.sha256_hex(tok) and s.expires_at>ts;
 if not found then return jsonb_build_object('error','unauthorized','status',401); end if;
 return jsonb_build_object('username',u,'expiresAt',nm_private.iso(exp),'scope','learning_review');
end $$;
revoke all on function public.nm_review_rpc(text,jsonb,text) from public,anon,authenticated;
grant execute on function public.nm_review_rpc(text,jsonb,text) to service_role;
