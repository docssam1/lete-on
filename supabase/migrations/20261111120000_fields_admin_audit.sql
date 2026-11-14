-- 관리자 접속·열람 기록(원장 2026-11-11 「보안 설정도 하자」): 관리자 로그인(성공·실패·잠김)과 회원 정보 열람·변경.
-- 서버 함수(service_role, fields-auth · fields-members)만 쓰고 읽는다. 승인번호·해시는 남기지 않는다.
create table if not exists public.fields_admin_audit (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  target text,
  ip text,
  agent text
);
create index if not exists fields_admin_audit_at_idx on public.fields_admin_audit (at desc);
alter table public.fields_admin_audit enable row level security;
revoke all on table public.fields_admin_audit from anon, authenticated;
