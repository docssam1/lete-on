create or replace function nm_private.canonical_delivery_plan(p jsonb) returns jsonb
language plpgsql immutable set search_path = pg_catalog as $f$
declare
  limits constant jsonb := '{"C0":19,"C1":6,"C2":6,"C3":8,"C4":9,"C5":8,"C6":8,"C7":4,"C8":9,"C9":11,"C10":6,"C11":8,"C12":6,"C13":4,"C14":4,"C15":4,"C16":5,"C17":9,"C18":5,"C19":4,"C20":7,"C21":6,"C22":4,"C23":7,"C24":7,"C25":4,"C26":8,"C27":12,"C28":12,"C29":10,"C30":7,"C31":12,"C32":10,"C33":7,"C34":9,"C35":8,"C36":10,"C37":13,"C38":8,"C39":9,"C40":7,"C41":8,"C42":8,"C43":6,"C44":6,"C45":7,"C46":8,"C47":5,"C48":4,"C49":7,"C50":7,"C51":8,"C52":5,"C53":8,"C54":7,"C55":9,"C56":8,"C57":8,"C58":8,"C59":10,"C60":10,"C61":9,"C62":8,"C63":8,"C64":4,"C65":7,"C66":8,"C67":8,"C68":7,"C69":5,"C70":5,"C71":4,"C72":6,"C73":5}'::jsonb;
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
  if p ? 'curriculumRevision' then
    if p->'curriculumRevision' is distinct from '"20261104-curriculum3"'::jsonb then return null; end if;
    out_plan := out_plan || pg_catalog.jsonb_build_object('curriculumRevision','20261104-curriculum3');
  end if;
  return out_plan;
end $f$;
