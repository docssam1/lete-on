-- Version only newly generated high-school worksheet links. Existing links, settings,
-- authentication, grants and learner records are preserved.
do $migration$
declare
  source text := pg_get_functiondef('public.nm_membership_rpc(text,jsonb,uuid,text)'::regprocedure);
  changed text;
begin
  if strpos(source,'20261023-high3m')>0 then return; end if;
  changed := source;
  if strpos(changed,$config0$pg_catalog.jsonb_build_object('courseKey',ls.course_key,'week',v_week,'k',v_k,'amount',ls.amount,
        'cadence',ls.cadence,'sessionIndex',ls.session_index)$config0$)=0 then raise exception 'worksheet config constructor 0 differs'; end if;
  changed := replace(changed,$config0$pg_catalog.jsonb_build_object('courseKey',ls.course_key,'week',v_week,'k',v_k,'amount',ls.amount,
        'cadence',ls.cadence,'sessionIndex',ls.session_index)$config0$,$new0$(pg_catalog.jsonb_build_object('courseKey',ls.course_key,'week',v_week,'k',v_k,'amount',ls.amount,
        'cadence',ls.cadence,'sessionIndex',ls.session_index) || case when ls.course_key ~ '^C(3[89]|[4-6][0-9])$' then pg_catalog.jsonb_build_object('highPlanVersion','20261023-high3m') else '{}'::jsonb end)$new0$);
  if strpos(changed,$config1$pg_catalog.jsonb_build_object('courseKey', ls.course_key, 'week', v_week, 'k', v_k, 'amount', ls.amount,
                                            'cadence', ls.cadence, 'sessionIndex', ls.session_index)$config1$)=0 then raise exception 'worksheet config constructor 1 differs'; end if;
  changed := replace(changed,$config1$pg_catalog.jsonb_build_object('courseKey', ls.course_key, 'week', v_week, 'k', v_k, 'amount', ls.amount,
                                            'cadence', ls.cadence, 'sessionIndex', ls.session_index)$config1$,$new1$(pg_catalog.jsonb_build_object('courseKey', ls.course_key, 'week', v_week, 'k', v_k, 'amount', ls.amount,
                                            'cadence', ls.cadence, 'sessionIndex', ls.session_index) || case when ls.course_key ~ '^C(3[89]|[4-6][0-9])$' then pg_catalog.jsonb_build_object('highPlanVersion','20261023-high3m') else '{}'::jsonb end)$new1$);
  if changed=source then raise exception 'worksheet plan version was not added'; end if;
  execute changed;
end $migration$;
