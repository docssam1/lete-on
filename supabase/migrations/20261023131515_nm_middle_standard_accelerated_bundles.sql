-- Extend only new worksheet snapshots to the middle-school study bundle plan.
-- The high-school contract, authentication, old snapshots and student records stay intact.
DO $migration$
DECLARE
  original text;
  needle text := $needle$case when ls.course_key ~ '^C(3[89]|[4-6][0-9])$'$needle$;
  replacement text := $replacement$case when ls.course_key ~ '^C(29|3[0-7])$'
             then pg_catalog.jsonb_build_object('highPlanVersion','20261023-middle25',
               'highStartDate',ls.start_date,'highSpeed',ls.speed)
             when ls.course_key ~ '^C(3[89]|[4-6][0-9])$'$replacement$;
BEGIN
  SELECT pg_catalog.pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure) INTO original;
  IF (length(original)-length(replace(original,needle,'')))/length(needle) <> 2 THEN
    RAISE EXCEPTION 'Expected exactly two existing high-school worksheet constructors';
  END IF;
  EXECUTE replace(original,needle,replacement);
END
$migration$;
