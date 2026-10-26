-- Add revision-aware NEW worksheet issuance. Existing tokens, settings snapshots,
-- student state/progress, grants, ownership and consent rules are not updated.
-- Deploy dual-version browser/PDF/notification readers BEFORE this migration.
-- v1 readers retain the resolved 22d782b1 course placement; generators are current.
DO $migration$
DECLARE
  canonical_source text;
  state_source text;
  rpc_source text;
  needle text;
  replacement text;
  old_version text;
  new_version text;
  expected integer;
  matches integer;
BEGIN
  SELECT pg_catalog.pg_get_functiondef('nm_private.canonical_delivery_plan(jsonb)'::regprocedure) INTO canonical_source;
  SELECT pg_catalog.pg_get_functiondef('nm_private.delivery_plan_from_state(jsonb,text)'::regprocedure) INTO state_source;
  SELECT pg_catalog.pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure) INTO rpc_source;
  IF pg_catalog.strpos(rpc_source,'20261026-personal2')>0
     OR pg_catalog.strpos(canonical_source,'curriculumRevision')>0 THEN
    RAISE EXCEPTION 'Revision-aware delivery already exists; inspect migration state';
  END IF;

  -- Preserve only the explicitly known optional revision. Missing remains valid
  -- for all pre-migration state/history and old immutable config records.
  needle := $old$  return out_plan;$old$;
  replacement := $new$  if p ? 'curriculumRevision' then
    if p->'curriculumRevision' is distinct from '"20261026-curriculum2"'::jsonb then return null; end if;
    out_plan := out_plan || pg_catalog.jsonb_build_object('curriculumRevision','20261026-curriculum2');
  end if;
  return out_plan;$new$;
  IF (length(canonical_source)-length(replace(canonical_source,needle,'')))/length(needle)<>1 THEN
    RAISE EXCEPTION 'Expected exactly one canonical plan return';
  END IF;
  canonical_source := replace(canonical_source,needle,replacement);

  -- Stamp only the newly returned issuance choice. No stored learningPlan or
  -- historical settings are rewritten. An explicit legacy baseline still exits
  -- above this statement through its unchanged legacy branch.
  needle := $old$  return pg_catalog.jsonb_build_object('status','personal','learningPlan',canonical);$old$;
  replacement := $new$  return pg_catalog.jsonb_build_object('status','personal','learningPlan',
    canonical || pg_catalog.jsonb_build_object('curriculumRevision','20261026-curriculum2'));$new$;
  IF (length(state_source)-length(replace(state_source,needle,'')))/length(needle)<>1 THEN
    RAISE EXCEPTION 'Expected exactly one new personal issuance choice';
  END IF;
  state_source := replace(state_source,needle,replacement);

  -- These are constructor literals, not an UPDATE of worksheet_previews or of
  -- profile progress. Old persisted versions remain accepted by dual readers.
  FOR old_version,new_version,expected IN SELECT * FROM (VALUES
    ('20261024-personal1','20261026-personal2',3),
    ('20261023-middle25','20261026-middle25-v2',2),
    ('20261023-high3m','20261026-high3m-v2',2),
    ('20261024-calculus3m','20261026-calculus3m-v2',2)
  ) AS versions(old_version,new_version,expected) LOOP
    needle := pg_catalog.quote_literal(old_version);
    replacement := pg_catalog.quote_literal(new_version);
    matches := (length(rpc_source)-length(replace(rpc_source,needle,'')))/length(needle);
    IF matches<>expected THEN
      RAISE EXCEPTION 'Expected % new-issuance literals for %, found %',expected,old_version,matches;
    END IF;
    rpc_source := replace(rpc_source,needle,replacement);
  END LOOP;
  EXECUTE canonical_source;
  EXECUTE state_source;
  EXECUTE rpc_source;
END
$migration$;
