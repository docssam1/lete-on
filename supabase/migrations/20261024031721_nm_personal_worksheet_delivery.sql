-- Add frozen personal delivery snapshots for owned, unmanaged profiles only.
-- Existing admin settings, share tokens, grants, progress and completion data are preserved.
-- Personal delivery plans are immutable snapshots. These helpers read no tables,
-- accept only canonical known fields, and never change learner progress/state.
create or replace function nm_private.delivery_week(p_week text) returns date
language plpgsql immutable set search_path = pg_catalog as $f$
declare d date;
begin
  if p_week is null or p_week !~ '^(20[2-9][0-9]|2100)-W(0[1-9]|[1-4][0-9]|5[0-3])$' then return null; end if;
  d := pg_catalog.to_date(p_week||'-1','IYYY-"W"IW-ID');
  if pg_catalog.to_char(d,'IYYY-"W"IW') <> p_week then return null; end if;
  return d;
exception when others then return null;
end $f$;

create or replace function nm_private.canonical_delivery_plan(p jsonb) returns jsonb
language plpgsql immutable set search_path = pg_catalog as $f$
declare
  limits constant jsonb := '{"C0":19,"C1":6,"C2":6,"C3":8,"C4":9,"C5":8,"C6":8,"C7":4,"C8":9,"C9":11,"C10":6,"C11":8,"C12":6,"C13":4,"C14":4,"C15":4,"C16":5,"C17":9,"C18":5,"C19":4,"C20":7,"C21":6,"C22":4,"C23":7,"C24":7,"C25":4,"C26":8,"C27":12,"C28":12,"C29":11,"C30":9,"C31":11,"C32":8,"C33":7,"C34":9,"C35":8,"C36":10,"C37":13,"C38":8,"C39":9,"C40":7,"C41":8,"C42":8,"C43":6,"C44":6,"C45":7,"C46":8,"C47":5,"C48":4,"C49":7,"C50":7,"C51":8,"C52":5,"C53":8,"C54":7,"C55":9,"C56":8,"C57":8,"C58":8,"C59":10,"C60":10,"C61":9,"C62":8,"C63":8,"C64":4,"C65":7,"C66":8,"C67":8,"C68":7,"C69":5,"C70":5,"C71":4,"C72":6,"C73":5}'::jsonb;
  c text; s numeric; d date; ds text; speed numeric; amount numeric;
  cadence text; pace text; out_plan jsonb; extensions jsonb; anchor jsonb; resume_plan jsonb;
  g numeric; i numeric; next_key text; item record;
begin
  if pg_catalog.jsonb_typeof(p) is distinct from 'object' then return null; end if;
  c := nm_private.jstr(p,'courseKey',3); s := nm_private.jnum(p,'sessionIndex');
  ds := nm_private.jstr(p,'startDate',10); speed := nm_private.jnum(p,'speed'); amount := nm_private.jnum(p,'amount');
  cadence := nm_private.jstr(p,'cadence',2); pace := nm_private.jstr(p,'pace',2);
  if c is null or not(limits ? c) or s is null or s <> pg_catalog.trunc(s) or s < 1 or s > (limits->>c)::integer
     or ds is null or ds !~ '^(20[2-9][0-9]|2100)-[0-9]{2}-[0-9]{2}$'
     or speed is null or speed not in (0.7,0.85,1,1.25,1.5) or amount is null or amount not in (0.7,0.85,1,1.25,1.5)
     or cadence is null or cadence not in ('w1','w2') or pace is null or pace not in ('p0','p1','p2','p3','p4') then return null; end if;
  begin d := ds::date; exception when others then return null; end;
  if pg_catalog.to_char(d,'YYYY-MM-DD') <> ds then return null; end if;
  out_plan := pg_catalog.jsonb_build_object('courseKey',c,'sessionIndex',s,'startDate',ds,'speed',speed,'amount',amount,'cadence',cadence,'pace',pace);
  if p ? 'middleExtensions' then
    extensions := p->'middleExtensions';
    if pg_catalog.jsonb_typeof(extensions) is distinct from 'object' then return null; end if;
    for item in select * from pg_catalog.jsonb_each(extensions) loop
      if item.key not in ('1','2','3') or item.value <> '"20261024-middle-extension1"'::jsonb then return null; end if;
    end loop;
    out_plan := out_plan || pg_catalog.jsonb_build_object('middleExtensions',extensions);
  end if;
  if p ? 'extensionAnchor' then
    anchor := p->'extensionAnchor';
    if pg_catalog.jsonb_typeof(anchor) is distinct from 'object' then return null; end if;
    g := nm_private.jnum(anchor,'grade'); i := nm_private.jnum(anchor,'index');
    if g is null or g not in (1,2,3) or i is null or i <> pg_catalog.trunc(i) or i < 0 or i >= 12 then return null; end if;
    if c <> (case g when 1 then 'C31' when 2 then 'C34' else 'C37' end)
       or extensions->((g::integer)::text) is distinct from '"20261024-middle-extension1"'::jsonb then return null; end if;
    anchor := pg_catalog.jsonb_build_object('grade',g,'index',i);
    if p->'extensionAnchor' ? 'resume' then
      resume_plan := p#>'{extensionAnchor,resume}';
      if pg_catalog.jsonb_typeof(resume_plan) is distinct from 'object' then return null; end if;
      next_key := case g when 1 then 'C32' when 2 then 'C35' else 'C38' end;
      s := nm_private.jnum(resume_plan,'sessionIndex');
      if nm_private.jstr(resume_plan,'courseKey',3) is distinct from next_key or s is null or s <> pg_catalog.trunc(s) or s < 1 or s > (limits->>next_key)::integer then return null; end if;
      anchor := anchor || pg_catalog.jsonb_build_object('resume',pg_catalog.jsonb_build_object('courseKey',next_key,'sessionIndex',s));
    end if;
    out_plan := out_plan || pg_catalog.jsonb_build_object('extensionAnchor',anchor);
  end if;
  return out_plan;
end $f$;

create or replace function nm_private.delivery_plan_from_state(p_state jsonb,p_week text) returns jsonb
language plpgsql immutable set search_path = pg_catalog as $f$
declare selected jsonb; history jsonb; item jsonb; effective date; requested date; at_week date; baseline jsonb; canonical jsonb;
begin
  if pg_catalog.jsonb_typeof(p_state) is distinct from 'object' or not(p_state ? 'learningPlan') then
    return '{"status":"none"}'::jsonb;
  end if;
  requested := nm_private.delivery_week(p_week);
  if requested is null then return '{"status":"invalid"}'::jsonb; end if;
  selected := p_state->'learningPlan'; history := p_state->'learningPlanHistory';
  if history is not null and history <> 'null'::jsonb then
    if pg_catalog.jsonb_typeof(history) <> 'array' then return '{"status":"invalid"}'::jsonb; end if;
    if pg_catalog.jsonb_array_length(history)>1000 then return '{"status":"invalid"}'::jsonb; end if;
    for item in select * from pg_catalog.jsonb_array_elements(history) loop
      if pg_catalog.jsonb_typeof(item) is distinct from 'object' or not(item ? 'effectiveWeek')
         or nm_private.canonical_delivery_plan(item->'settings') is null
         or (item->'settings' ? 'legacy' and pg_catalog.jsonb_typeof(item#>'{settings,legacy}')<>'boolean') then return '{"status":"invalid"}'::jsonb; end if;
      if item->'effectiveWeek'='null'::jsonb then
        if baseline is null then baseline := item->'settings'; end if;
      else
        if pg_catalog.jsonb_typeof(item->'effectiveWeek') <> 'string' then return '{"status":"invalid"}'::jsonb; end if;
        effective := nm_private.delivery_week(item->>'effectiveWeek');
        if effective is null then return '{"status":"invalid"}'::jsonb; end if;
        if effective <= requested and (at_week is null or effective >= at_week) then
          selected := item->'settings'; at_week := effective;
        end if;
      end if;
    end loop;
    if at_week is null and baseline is not null then selected := baseline; end if;
  end if;
  canonical := nm_private.canonical_delivery_plan(selected);
  if canonical is null then return '{"status":"invalid"}'::jsonb; end if;
  if selected->'legacy'='true'::jsonb then return '{"status":"legacy"}'::jsonb; end if;
  return pg_catalog.jsonb_build_object('status','personal','learningPlan',canonical);
end $f$;


revoke all on function nm_private.delivery_week(text) from public, anon, authenticated;
revoke all on function nm_private.canonical_delivery_plan(jsonb) from public, anon, authenticated;
revoke all on function nm_private.delivery_plan_from_state(jsonb,text) from public, anon, authenticated;

DO $migration$
DECLARE
  original text;
  needle text;
  replacement text;
BEGIN
  SELECT pg_catalog.pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure) INTO original;
  IF pg_catalog.strpos(original,'20261024-personal1')>0 THEN
    RAISE EXCEPTION 'Personal delivery version already exists; inspect migration state';
  END IF;
  needle := $old1$  v_pver  text;
$old1$;
  replacement := $new1$  v_pver  text;
  v_state jsonb;
  v_plan_choice jsonb;
  v_config jsonb;
$new1$;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 1 THEN
    RAISE EXCEPTION 'Expected one unchanged personal-delivery patch 1';
  END IF;
  original := replace(original,needle,replacement);
  needle := $old2$    select owner_id into v_uid from public.nm_profiles where name=v_name;
$old2$;
  replacement := $new2$    select owner_id,state into v_uid,v_state from public.nm_profiles where name=v_name;
$new2$;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 1 THEN
    RAISE EXCEPTION 'Expected one unchanged personal-delivery patch 2';
  END IF;
  original := replace(original,needle,replacement);
  needle := $old3$    v_cadence := coalesce(ls.cadence, (select case when state->>'roadCadence'='w2' then 'w2' else 'w1' end from public.nm_profiles where name=v_name), 'w1');
$old3$;
  replacement := $new3$    v_plan_choice := case when ls.profile_name is null then nm_private.delivery_plan_from_state(v_state,v_week) else '{"status":"managed"}'::jsonb end;
    v_cadence := coalesce(ls.cadence, v_plan_choice#>>'{learningPlan,cadence}', case when v_state->>'roadCadence'='w2' then 'w2' else 'w1' end, 'w1');
$new3$;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 1 THEN
    RAISE EXCEPTION 'Expected one unchanged personal-delivery patch 3';
  END IF;
  original := replace(original,needle,replacement);
  needle := $old4$      return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',null);
$old4$;
  replacement := $new4$      if v_plan_choice->>'status'='invalid' then
        return pg_catalog.jsonb_build_object('managed',true,'canUse',false,'cadence',v_cadence,'error','invalid_learning_plan','status',409);
      elsif v_plan_choice->>'status'='personal' then
        if v_k<>1 then
          return pg_catalog.jsonb_build_object('managed',true,'canUse',false,'cadence',v_cadence,'wholeWeek',true,'deliveryPlanVersion','20261024-personal1','link',null);
        end if;
        v_config := pg_catalog.jsonb_build_object('courseKey',v_plan_choice#>>'{learningPlan,courseKey}',
          'sessionIndex',v_plan_choice#>'{learningPlan,sessionIndex}','week',v_week,'k',1,
          'amount',v_plan_choice#>'{learningPlan,amount}','cadence',v_cadence,
          'deliveryPlanVersion','20261024-personal1','learningPlan',v_plan_choice->'learningPlan');
        v_token := pg_catalog.encode(extensions.gen_random_bytes(16),'hex');
        v_link := 'https://lete-on.gfieldacademy.net/w/?m='||v_token;
        insert into nm_private.worksheet_previews(token_hash,admin_user,admin_session,profile_name,owner_id,k,config,
          message,title,message_type,phone_hash,phone_masked,settings_version,send_expires_at,share_expires_at)
        values(nm_private.sha256_hex(v_token),'automatic','cron',v_name,v_uid,1,v_config,
          '','','SMS',nm_private.sha256_hex(v_phone),nm_private.mask_phone(v_phone),0,v_now,v_now+interval '14 days');
        return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'wholeWeek',true,
          'deliveryPlanVersion','20261024-personal1','config',v_config,'link',v_link);
      end if;
      return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',null)
        || case when v_plan_choice->>'status'='legacy' then '{"personalPlanLegacy":true}'::jsonb else '{}'::jsonb end;
$new4$;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 1 THEN
    RAISE EXCEPTION 'Expected one unchanged personal-delivery patch 4';
  END IF;
  original := replace(original,needle,replacement);
  needle := $old5$      v_now, v_now+interval '14 days');
    return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',v_link);
$old5$;
  replacement := $new5$      v_now, v_now+interval '14 days') returning config into v_config;
    return pg_catalog.jsonb_build_object('managed',true,'canUse',true,'cadence',v_cadence,'link',v_link,'config',v_config);
$new5$;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 1 THEN
    RAISE EXCEPTION 'Expected one unchanged personal-delivery patch 5';
  END IF;
  original := replace(original,needle,replacement);
  EXECUTE original;
END
$migration$;
