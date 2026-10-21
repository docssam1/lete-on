-- Run inside BEGIN/ROLLBACK after schema.sql. Fixtures are synthetic; dispatch is never called.
do $test$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
  n text := 'nm-test-'||substr(a::text,1,8); n2 text := 'nm-test-'||substr(b::text,1,8);
  email_a text := a::text||'@example.test'; email_b text := b::text||'@example.test';
  r jsonb; first_status jsonb; token text; preview jsonb; share text; t timestamptz; amount integer;
begin
  insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
    values(a,'authenticated','authenticated',email_a,now(),now(),now()),
          (b,'authenticated','authenticated',email_b,now(),now(),now());
  insert into nm_private.admin_accounts(username,code_hash)
    values(n,extensions.crypt('mock-test-password',extensions.gen_salt('bf')));
  r := public.nm_membership_rpc('admin_login',jsonb_build_object('username',n,'code','incorrect'),null,repeat('a',64));
  assert r->>'error'='invalid_credentials','incorrect code accepted';
  r := public.nm_membership_rpc('admin_login',jsonb_build_object('username',n,'code','mock-test-password'),null,repeat('a',64));
  token := r->>'token'; assert length(token)=64,'login session missing';
  first_status := public.nm_membership_rpc('status','{}',a,null);
  assert first_status#>>'{membership,status}'='trial','trial not created';
  assert (first_status#>>'{membership,trialEndsAt}')::timestamptz-(first_status#>>'{membership,trialStartedAt}')::timestamptz=interval '30 days','trial length';
  r := public.nm_membership_rpc('status','{}',a,null);
  assert r#>>'{membership,trialStartedAt}'=first_status#>>'{membership,trialStartedAt}','trial restarted';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true}',a,null);
  assert r->>'ok'='true';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true}',b,null);
  assert r->>'ok'='true','shared phone rejected';
  insert into public.nm_profiles(name,owner_id,state)
    values(n,a,'{"progress":{"keep":true},"diagnostics":{"keep":true}}'),(n2,b,'{"progress":{"keep":true}}');
  select count(*) into amount from public.nm_contacts where profile_name in(n,n2) and phone='01000001234' and active and consent;
  assert amount=2,'contact bridge or shared phone failed';
  begin
    insert into public.nm_profiles(name,owner_id,state) values(n||'-duplicate',a,'{}');
    raise exception 'duplicate student allowed';
  exception when unique_violation then null; end;
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":false}',a,null);
  assert not exists(select 1 from public.nm_contacts where profile_name=n and active and consent),'opt-out did not deactivate';
  assert exists(select 1 from public.nm_contacts where profile_name=n2 and active and consent),'sibling contact affected';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true}',a,null);
  insert into public.nm_profiles(name,state) values(n||'-unlinked','{}');
  r := public.nm_membership_rpc('admin_link',jsonb_build_object('adminToken',token,'email',email_a,'profileName',n||'-unlinked'),null,null);
  assert r->>'error'='email_already_linked','one-email rule bypassed';
  r := public.nm_membership_rpc('admin_set_learning',jsonb_build_object('adminToken',token,'profileName',n,'courseKey','C4','sessionIndex',2,'speed',0.85,'amount',0.7,'cadence','w2','entryYear',2028,'startDate','2026-10-21'),null,null);
  assert r#>>'{settings,courseKey}'='C4' and r#>>'{settings,sessionIndex}'='2','settings not saved';
  assert (select state#>>'{progress,keep}' from public.nm_profiles where name=n)='true','progress overwritten';
  assert (select state#>>'{schoolAge,entryYear}' from public.nm_profiles where name=n)='2028','schoolAge shape';
  assert (select state#>>'{adminPlan,cadence}' from public.nm_profiles where name=n)='w2','adminPlan incomplete';
  r := public.nm_membership_rpc('admin_grant',jsonb_build_object('adminToken',token,'email',email_a,'plan','six_month'),null,null);
  assert r#>>'{member,status}'='paid' and r#>>'{member,plan}'='six_month';
  assert (r#>>'{member,endsAt}')::timestamptz=(r#>>'{member,startsAt}')::timestamptz+interval '6 months','six month expiry';
  t := (r#>>'{member,endsAt}')::timestamptz;
  r := public.nm_membership_rpc('admin_grant',jsonb_build_object('adminToken',token,'email',email_a,'plan','annual'),null,null);
  assert (r#>>'{member,endsAt}')::timestamptz=t+interval '1 year','annual extension';
  preview := public.nm_membership_rpc('admin_preview_worksheet',jsonb_build_object('adminToken',token,'profileName',n,'k',2),null,null);
  assert preview->>'phoneMasked'='010-****-1234','unmasked phone';
  assert preview->>'previewId' is not null,'preview missing';
  share := split_part(preview->>'link','?m=',2);
  r := public.nm_membership_rpc('resolve_worksheet',jsonb_build_object('token',share),null,null);
  assert r#>>'{config,courseKey}'='C4' and r#>>'{config,sessionIndex}'='2' and r#>>'{config,amount}'='0.70','personalized share';
  assert not(r::text like '%'||n||'%') and not(r::text like '%01000001234%'),'share leaked identity';
  r := public.nm_membership_rpc('admin_send_begin',jsonb_build_object('adminToken',token,'previewId',preview->>'previewId'),null,null);
  assert r ? 'payload','dispatch payload missing';
  r := public.nm_membership_rpc('admin_send_begin',jsonb_build_object('adminToken',token,'previewId',preview->>'previewId'),null,null);
  assert r ? 'replay','send replay not blocked';
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n,'phone','01000001234','k',2,'week','2026-W43'),null,null);
  assert r->>'canUse'='true' and r->>'link' is not null,'automatic personal context';
  r := public.nm_membership_rpc('admin_revoke',jsonb_build_object('adminToken',token,'userId',a),null,null);
  r := public.nm_membership_rpc('status','{}',a,null);
  assert r#>>'{membership,status}'='revoked' and r#>>'{membership,canUse}'='false','revocation';
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n,'phone','01000001234','k',1,'week','2026-W43'),null,null);
  assert r->>'canUse'='false','revoked automatic delivery';
  r := public.nm_membership_rpc('admin_logout',jsonb_build_object('adminToken',token),null,null);
  r := public.nm_membership_rpc('admin_list',jsonb_build_object('adminToken',token),null,null);
  assert r->>'error'='unauthorized','logout did not invalidate';
  assert not has_function_privilege('anon','public.nm_membership_rpc(text,jsonb,uuid,text)','EXECUTE'),'anon RPC grant';
  assert not has_function_privilege('authenticated','public.nm_membership_rpc(text,jsonb,uuid,text)','EXECUTE'),'authenticated RPC grant';
  assert not has_table_privilege('authenticated','nm_private.guardian_contacts','SELECT'),'private contacts exposed';
end $test$;
