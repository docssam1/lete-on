-- Extend only newly constructed C70-C73 worksheet snapshots to the Calculus I 3-month plan.
-- No grants, auth rules, student records or existing worksheet snapshots are changed.
DO $migration$
DECLARE
  original text;
  needle text := $needle$when ls.course_key ~ '^C(3[89]|[4-6][0-9])$'$needle$;
  replacement text := $replacement$when ls.course_key ~ '^C7[0-3]$'
             then pg_catalog.jsonb_build_object('highPlanVersion','20261024-calculus3m',
               'highStartDate',ls.start_date,'highSpeed',ls.speed)
             when ls.course_key ~ '^C(3[89]|[4-6][0-9])$'$replacement$;
BEGIN
  SELECT pg_catalog.pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure) INTO original;
  IF pg_catalog.strpos(original,'20261024-calculus3m') > 0 THEN
    RAISE EXCEPTION 'Calculus snapshot version is already present; inspect migration state before applying';
  END IF;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 2 THEN
    RAISE EXCEPTION 'Expected exactly two existing high-school worksheet constructors';
  END IF;
  EXECUTE replace(original,needle,replacement);
END
$migration$;
