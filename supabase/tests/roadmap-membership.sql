-- Runs in a rolled-back transaction. No real email is sent or user retained.
begin;
do $$
declare uid uuid:=gen_random_uuid(); sid uuid:=gen_random_uuid(); old_version integer;
begin
  insert into auth.users(id,email,email_confirmed_at) values(uid,'roadmap-transaction-test@example.invalid',now());
  insert into auth.sessions(id,user_id,created_at,updated_at) values(sid,uid,now(),now());
  if not public.roadmap_email_session_active(uid,sid) then raise exception 'Active email session rejected'; end if;
  delete from auth.sessions where id=sid;
  if public.roadmap_email_session_active(uid,sid) then raise exception 'Signed-out email proof accepted'; end if;
  perform public.roadmap_register(uid,'roadmap-transaction-test@example.invalid','58294716',
    '{"studentName":"검수용 학생","guardianPhone":"01000000000","school":"elementary","grade":5,"age":null}',
    '{"version":"roadmap-2026-10-30-v1","privacy":true,"guardian":true,"marketing_email":false,"marketing_sms":false}');
  if public.roadmap_verify_pin('roadmap-transaction-test@example.invalid','58294716') is distinct from uid then raise exception 'PIN verification failed'; end if;
  if public.roadmap_verify_pin('roadmap-transaction-test@example.invalid','58294717') is not null then raise exception 'Wrong PIN accepted'; end if;
  if public.roadmap_verify_pin('missing-roadmap@example.invalid','58294716') is not null then raise exception 'Unknown email accepted'; end if;
  if (select pin_hash='58294716' from public.roadmap_members where user_id=uid) then raise exception 'Plain PIN stored'; end if;
  select session_version into old_version from public.roadmap_members where user_id=uid;
  insert into public.roadmap_sessions(token_hash,user_id,session_version,expires_at) values(repeat('a',64),uid,old_version,now()+interval '1 hour');
  perform public.roadmap_rotate_pin(uid,'71946285');
  if exists(select from public.roadmap_sessions where user_id=uid) then raise exception 'Old session survived rotation'; end if;
  if public.roadmap_verify_pin('roadmap-transaction-test@example.invalid','58294716') is not null then raise exception 'Old PIN still accepted'; end if;
  if public.roadmap_verify_pin('roadmap-transaction-test@example.invalid','71946285') is distinct from uid then raise exception 'New PIN rejected'; end if;
  if (select count(*) from public.roadmap_consent_events where user_id=uid) <> 4 then raise exception 'PIN rotation modified consent'; end if;
  perform public.roadmap_update_profile(uid,
    '{"studentName":"검수용 학생","guardianPhone":"01000000000","school":"elementary","grade":5,"age":null}',
    '{"marketing_email":true,"marketing_sms":false}');
  perform public.roadmap_update_profile(uid,
    '{"studentName":"검수용 학생","guardianPhone":"01000000000","school":"elementary","grade":5,"age":null}',
    '{"marketing_email":false,"marketing_sms":false}');
  if (select count(*) from public.roadmap_consent_events where user_id=uid) <> 6 then raise exception 'Consent audit failed'; end if;
  if (select marketing_email from public.roadmap_members where user_id=uid) then raise exception 'Marketing opt-out failed'; end if;
  for i in 1..3 loop
    if not public.roadmap_take_attempt('test:roadmap-rollback',3) then raise exception 'Limiter blocked early'; end if;
  end loop;
  if public.roadmap_take_attempt('test:roadmap-rollback',3) then raise exception 'Limiter failed'; end if;
  delete from public.roadmap_members where user_id=uid;
  if exists(select from public.roadmap_consent_events where user_id=uid) then raise exception 'Withdrawal did not erase consents'; end if;
  if not exists(select from auth.users where id=uid) then raise exception 'Withdrawal deleted shared identity'; end if;
end;
$$;
rollback;
