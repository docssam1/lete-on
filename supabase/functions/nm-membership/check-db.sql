-- Run inside BEGIN/ROLLBACK after schema.sql. Fixtures are synthetic; dispatch is never called.
do $test$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
  n text := 'nm-test-'||substr(a::text,1,8); n2 text := 'nm-test-'||substr(b::text,1,8);
  email_a text := a::text||'@example.test'; email_b text := b::text||'@example.test';
  r jsonb; first_status jsonb; token text; preview jsonb; share text; t timestamptz; amount integer;
  c_key text; plan_version text; snapshot_state jsonb; legacy_share text; legacy_config jsonb;
  personal_plan jsonb; baseline_plan jsonb; invalid_plan jsonb; personal_config jsonb; personal_share text;
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
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"privacyVersion":"2026-10-22-v1","guardianConsent":true}',a,null);
  assert r->>'ok'='true';
  r := public.nm_membership_rpc('status','{}',a,null);
  assert r#>>'{contact,privacyVersion}'='2026-10-22-v1' and r#>>'{contact,consentedAt}' is not null,'consent version not returned';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"privacyVersion":"2026-10-22-v1"}',a,null);
  assert r->>'error'='bad_request','guardian consent not required';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"privacyVersion":"old","guardianConsent":true}',a,null);
  assert r->>'error'='bad_request','stale consent version accepted';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"guardianConsent":true}',a,null);
  assert r->>'error'='bad_request','guardian consent without notice version accepted';
  r := public.nm_membership_rpc('register_contact','{"collectionConsent":true,"smsConsent":true}',a,null);
  assert r->>'error'='bad_request','pre-notice request without phone accepted';
  -- pre-notice client during the deploy window: saved, stored version kept
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true}',a,null);
  assert r->>'ok'='true','pre-notice request rejected';
  r := public.nm_membership_rpc('status','{}',a,null);
  assert r#>>'{contact,privacyVersion}'='2026-10-22-v1','pre-notice request cleared consent version';
  -- renewal without a phone keeps the number on file
  r := public.nm_membership_rpc('register_contact','{"collectionConsent":true,"smsConsent":true,"privacyVersion":"2026-10-22-v1","guardianConsent":true}',a,null);
  assert r->>'ok'='true','renewal without phone rejected';
  assert (select phone from nm_private.guardian_contacts where owner_id=a)='01000001234','phone not kept on renewal';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"privacyVersion":"2026-10-22-v1","guardianConsent":true}',b,null);
  assert r->>'ok'='true','shared phone rejected';
  insert into public.nm_profiles(name,owner_id,state)
    values(n,a,'{"progress":{"keep":true},"diagnostics":{"keep":true}}'),(n2,b,'{"progress":{"keep":true}}');
  select count(*) into amount from public.nm_contacts where profile_name in(n,n2) and phone='01000001234' and active and consent;
  assert amount=2,'contact bridge or shared phone failed';
  begin
    insert into public.nm_profiles(name,owner_id,state) values(n||'-duplicate',a,'{}');
    raise exception 'duplicate student allowed';
  exception when unique_violation then null; end;
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":false,"privacyVersion":"2026-10-22-v1","guardianConsent":true}',a,null);
  assert not exists(select 1 from public.nm_contacts where profile_name=n and active and consent),'opt-out did not deactivate';
  assert exists(select 1 from public.nm_contacts where profile_name=n2 and active and consent),'sibling contact affected';
  r := public.nm_membership_rpc('register_contact','{"phone":"01000001234","collectionConsent":true,"smsConsent":true,"privacyVersion":"2026-10-22-v1","guardianConsent":true}',a,null);
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
  -- Simulate a pre-version C70 share. New settings and snapshots must not rewrite it.
  legacy_share := pg_catalog.encode(extensions.gen_random_bytes(16),'hex');
  legacy_config := jsonb_build_object('courseKey','C70','week','2026-W43','k',1,'amount',0.7,'cadence','w1','sessionIndex',3);
  insert into nm_private.worksheet_previews
    (token_hash,admin_user,admin_session,profile_name,owner_id,k,config,message,title,message_type,
     phone_hash,phone_masked,settings_version,send_expires_at,share_expires_at)
  select nm_private.sha256_hex(legacy_share),admin_user,admin_session,profile_name,owner_id,1,legacy_config,
    message,title,message_type,phone_hash,phone_masked,settings_version,send_expires_at,share_expires_at
  from nm_private.worksheet_previews where id=(preview->>'previewId')::uuid;
  -- These create synthetic snapshots only. No HTTP dispatch or real learner record is used.
  for c_key,plan_version in
    select * from (values ('C29','20261023-middle25'),('C37','20261023-middle25'),
      ('C38','20261023-high3m'),('C69','20261023-high3m'),
      ('C70','20261024-calculus3m'),('C73','20261024-calculus3m')) as plans(course_key,version)
  loop
    r := public.nm_membership_rpc('admin_set_learning',jsonb_build_object('adminToken',token,'profileName',n,
      'courseKey',c_key,'sessionIndex',3,'speed',1.25,'amount',1,'cadence','w2','entryYear',2028,'startDate','2026-10-26'),null,null);
    assert r#>>'{settings,courseKey}'=c_key,'synthetic settings failed';
    select state into snapshot_state from public.nm_profiles where name=n;
    preview := public.nm_membership_rpc('admin_preview_worksheet',jsonb_build_object('adminToken',token,'profileName',n,'k',2),null,null);
    assert preview->>'previewId' is not null,'planned preview missing';
    share := split_part(preview->>'link','?m=',2);
    r := public.nm_membership_rpc('resolve_worksheet',jsonb_build_object('token',share),null,null);
    assert r#>>'{config,courseKey}'=c_key and r#>>'{config,highPlanVersion}'=plan_version,'preview plan version mismatch';
    assert r#>>'{config,highStartDate}'='2026-10-26' and (r#>>'{config,highSpeed}')::numeric=1.25,'preview schedule context missing';
    assert r#>>'{config,sessionIndex}'='3' and r#>>'{config,k}'='2','preview source anchor changed';
    r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n,'phone','01000001234','k',2,'week','2026-W44'),null,null);
    assert r->>'canUse'='true' and r->>'link' is not null,'planned automatic snapshot missing';
    share := split_part(r->>'link','?m=',2);
    r := public.nm_membership_rpc('resolve_worksheet',jsonb_build_object('token',share),null,null);
    assert r#>>'{config,courseKey}'=c_key and r#>>'{config,highPlanVersion}'=plan_version,'automatic plan version mismatch';
    assert r#>>'{config,highStartDate}'='2026-10-26' and (r#>>'{config,highSpeed}')::numeric=1.25,'automatic schedule context missing';
    assert r#>>'{config,sessionIndex}'='3' and r#>>'{config,k}'='2','automatic source anchor changed';
    assert (select state from public.nm_profiles where name=n)=snapshot_state,'snapshot action changed learner state';
    assert snapshot_state#>>'{progress,keep}'='true' and snapshot_state#>>'{diagnostics,keep}'='true','synthetic progress lost';
    r := public.nm_membership_rpc('resolve_worksheet',jsonb_build_object('token',legacy_share),null,null);
    assert r->'config'=legacy_config,'legacy exact-session C70 snapshot rewritten';
  end loop;
  -- Personal delivery fixtures: owned profile b has no authoritative admin settings.
  -- No dispatch RPC is invoked. Keep this file inside the caller's BEGIN/ROLLBACK.
  r := public.nm_membership_rpc('status','{}',b,null);
  personal_plan := '{"courseKey":"C31","sessionIndex":11,"startDate":"2026-10-19","speed":1.25,"amount":0.85,"cadence":"w2","pace":"p2","middleExtensions":{"1":"20261024-middle-extension1"},"extensionAnchor":{"grade":1,"index":4,"resume":{"courseKey":"C32","sessionIndex":3}}}'::jsonb;
  baseline_plan := '{"courseKey":"C4","sessionIndex":2,"startDate":"2026-10-05","speed":1,"amount":1,"cadence":"w1","pace":"p2","legacy":true}'::jsonb;
  assert nm_private.canonical_delivery_plan(personal_plan)=personal_plan,'canonical extension changed';
  for invalid_plan in select value from pg_catalog.jsonb_array_elements(pg_catalog.jsonb_build_array(
    personal_plan||'{"sessionIndex":12}'::jsonb,personal_plan||'{"sessionIndex":"11"}'::jsonb,
    personal_plan||'{"speed":2}'::jsonb,personal_plan||'{"amount":"1"}'::jsonb,
    personal_plan||'{"pace":"p5"}'::jsonb,personal_plan||'{"startDate":"2026-02-29"}'::jsonb,
    personal_plan||'{"middleExtensions":null}'::jsonb,personal_plan||'{"middleExtensions":{"1":"future"}}'::jsonb,
    personal_plan||'{"extensionAnchor":{"grade":1,"index":12}}'::jsonb,
    personal_plan||'{"extensionAnchor":{"grade":"1","index":0}}'::jsonb,
    personal_plan||'{"extensionAnchor":{"grade":1,"index":0,"resume":{"courseKey":"C35","sessionIndex":1}}}'::jsonb,
    personal_plan||'{"extensionAnchor":{"grade":1,"index":0,"resume":{"courseKey":"C32","sessionIndex":9}}}'::jsonb))
  loop assert nm_private.canonical_delivery_plan(invalid_plan) is null,'invalid canonical plan accepted'; end loop;
  assert nm_private.delivery_week('2020-W53') is not null and nm_private.delivery_week('2025-W53') is null,'ISO week53 validation';
  update public.nm_profiles set state=state||pg_catalog.jsonb_build_object('learningPlan',personal_plan,'roadCadence','w1') where name=n2;
  select state into snapshot_state from public.nm_profiles where name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W43'),null,null);
  assert r->>'canUse'='true' and r->>'wholeWeek'='true' and r->>'cadence'='w2','personal whole-week policy';
  assert r->>'deliveryPlanVersion'='20261024-personal1' and r#>'{config,learningPlan}'=personal_plan,'personal snapshot mismatch';
  assert r#>>'{config,k}'='1' and not(r->'config' ? 'highPlanVersion'),'personal/managed snapshot mixed';
  personal_config := r->'config'; personal_share := split_part(r->>'link','?m=',2);
  assert personal_share ~ '^[0-9a-f]{32}$','personal share missing';
  assert not(personal_config::text like '%'||n2||'%') and not(personal_config::text like '%01000001234%') and not(personal_config::text like '%'||b::text||'%'),'personal config identity leak';
  select count(*) into amount from nm_private.worksheet_previews where profile_name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',2,'week','2026-W43'),null,null);
  assert r->>'canUse'='false' and (select count(*) from nm_private.worksheet_previews where profile_name=n2)=amount,'personal k2 duplicated';
  assert (select state from public.nm_profiles where name=n2)=snapshot_state,'delivery wrote learner state';
  -- Select the historical plan for the requested week, not today's newer plan.
  update public.nm_profiles set state=state||pg_catalog.jsonb_build_object('learningPlanHistory',pg_catalog.jsonb_build_array(
    pg_catalog.jsonb_build_object('effectiveWeek',null,'settings',baseline_plan),
    pg_catalog.jsonb_build_object('effectiveWeek','2026-W43','settings',personal_plan),
    pg_catalog.jsonb_build_object('effectiveWeek','2026-W45','settings',personal_plan||'{"speed":0.7}'::jsonb))) where name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W44'),null,null);
  assert r#>>'{config,learningPlan,speed}'='1.25','historical speed ignored';
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W46'),null,null);
  assert r#>>'{config,learningPlan,speed}'='0.7','newer historical speed ignored';
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W42'),null,null);
  assert r->>'personalPlanLegacy'='true' and r->'link'='null'::jsonb and not(r ? 'deliveryPlanVersion'),'legacy history baseline changed';
  -- Same-week edits use the last one; absent applicable history uses current plan.
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',personal_plan,'learningPlanHistory',jsonb_build_array(
    jsonb_build_object('effectiveWeek','2026-W43','settings',personal_plan),
    jsonb_build_object('effectiveWeek','2026-W43','settings',personal_plan||'{"amount":1.5}'::jsonb))),'2026-W43')#>>'{learningPlan,amount}'='1.5','history tie must use last';
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',personal_plan,'learningPlanHistory',jsonb_build_array(
    jsonb_build_object('effectiveWeek','2026-W45','settings',personal_plan||'{"speed":0.7}'::jsonb))),'2026-W43')->'learningPlan'=personal_plan,'current-plan fallback differs';
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',null),'2026-W43')->>'status'='invalid','null selected plan silently fell back';
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',personal_plan,'learningPlanHistory',jsonb_build_array(
    jsonb_build_object('effectiveWeek',null,'settings',baseline_plan||'{"legacy":"true"}'::jsonb))),'2026-W43')->>'status'='invalid','history legacy type ignored';
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',personal_plan,'learningPlanHistory',jsonb_build_array(
    jsonb_build_object('effectiveWeek','2026-W45','settings',personal_plan||'{"speed":99}'::jsonb))),'2026-W43')->>'status'='invalid','invalid future history ignored';
  assert nm_private.delivery_plan_from_state(jsonb_build_object('learningPlan',personal_plan,'learningPlanHistory',
    (select jsonb_agg(jsonb_build_object('effectiveWeek',null,'settings',personal_plan)) from generate_series(1,1001))),'2026-W43')->>'status'='invalid','unbounded history accepted';
  -- New plans cannot rewrite an already shared snapshot or bypass membership/contact gates.
  update public.nm_profiles set state=state-'learningPlanHistory'||jsonb_build_object('learningPlan',personal_plan||'{"sessionIndex":12}'::jsonb) where name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W43'),null,null);
  assert r->>'error'='invalid_learning_plan' and r->>'canUse'='false' and not(r ? 'link'),'invalid personal plan silently fell back';
  r := public.nm_membership_rpc('resolve_worksheet',jsonb_build_object('token',personal_share),null,null);
  assert r->'config'=personal_config,'old personal snapshot rewritten';
  update public.nm_profiles set state=state||jsonb_build_object('learningPlan',personal_plan) where name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000009999','k',1,'week','2026-W43'),null,null);
  assert r->>'canUse'='false','personal contact gate bypassed';
  update public.nm_contacts set consent=false where profile_name=n2;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W43'),null,null);
  assert r->>'canUse'='false','personal consent gate bypassed';
  update public.nm_contacts set consent=true where profile_name=n2;
  r := public.nm_membership_rpc('admin_revoke',jsonb_build_object('adminToken',token,'userId',b),null,null);
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n2,'phone','01000001234','k',1,'week','2026-W43'),null,null);
  assert r->>'canUse'='false','personal revoked member gate bypassed';
  -- Authoritative admin settings always win over invalid client-side plans/history.
  update public.nm_profiles set state=state||'{"learningPlan":null,"learningPlanHistory":"invalid"}'::jsonb where name=n;
  r := public.nm_membership_rpc('system_delivery',jsonb_build_object('profileName',n,'phone','01000001234','k',2,'week','2026-W43'),null,null);
  assert r->>'canUse'='true' and r#>>'{config,highPlanVersion}'='20261024-calculus3m' and not(r->'config' ? 'deliveryPlanVersion'),'admin precedence changed';
  assert not has_function_privilege('authenticated','nm_private.canonical_delivery_plan(jsonb)','EXECUTE'),'canonical helper exposed';
  assert not has_function_privilege('anon','nm_private.delivery_plan_from_state(jsonb,text)','EXECUTE'),'history helper exposed';
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
