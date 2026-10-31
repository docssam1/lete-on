-- 지필드 로그인(fields-auth) 틀린 승인번호 막기(원장 2026-10-31: 네 자리 승인번호를 쓰되 막는 장치를 함께).
-- 같은 이름으로 15분 안에 10번 틀리면 15분 동안 그 이름의 로그인을 막는다. 맞히면 지운다.
-- 서버 함수(service_role)만 읽고 쓴다. 승인번호 값은 여기에 남기지 않는다.
create table if not exists public.fields_login_failures (
  student_name text primary key,
  fails integer not null default 0,
  first_at timestamptz not null default now(),
  locked_until timestamptz
);
alter table public.fields_login_failures enable row level security;
revoke all on public.fields_login_failures from anon, authenticated;
