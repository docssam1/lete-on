-- 이 프로젝트는 새 표에 service_role 읽기·쓰기 권한이 자동으로 붙지 않는다(2026-11-14 확인).
-- 서버 함수(fields-auth · fields-members · fields-progress)가 이 표들을 읽고 쓰지 못하던 것을 고친다. anon·authenticated에는 주지 않는다.
grant select, insert, update, delete on table public.fields_gm_plans to service_role;
grant select, insert, update, delete on table public.fields_admin_audit to service_role;
grant select, insert, update, delete on table public.fields_login_failures to service_role;
grant select, insert, update, delete on table public.fields_study_records to service_role;
grant usage, select on all sequences in schema public to service_role;
