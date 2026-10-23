-- Add scheduling metadata only when a new high-school worksheet snapshot is made.
-- Existing shared worksheet configs and all student completion records stay intact.
DO $migration$
DECLARE
  original text;
  changed text;
  needle text := $needle$pg_catalog.jsonb_build_object('highPlanVersion','20261023-high3m')$needle$;
  replacement text := $replacement$pg_catalog.jsonb_build_object('highPlanVersion','20261023-high3m','highStartDate',ls.start_date,'highSpeed',ls.speed)$replacement$;
BEGIN
  SELECT pg_catalog.pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure) INTO original;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 2 THEN
    RAISE EXCEPTION 'Expected exactly two high-school config constructors';
  END IF;
  changed := replace(original,needle,replacement);
  EXECUTE changed;
END
$migration$;
