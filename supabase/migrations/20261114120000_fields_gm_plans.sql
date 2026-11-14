-- GM 과정(스스로 공부)을 승인번호마다 「권별」 또는 「기간」으로 연다(원장 2026-11-14 「gm과정을 권별 이나 기간 둘로 나눠 관리」).
--   권별(book)  : books에 적은 권만, 기한 없이
--   기간(period): starts_on부터 ends_on(없으면 계속)까지, start_book부터 한 달에 1권씩 + extra_books
-- 표에 줄이 없으면: 이메일 가입 회원은 예전 규칙(체험·정규), 원장이 직접 만든 승인번호(모의고사 회원 등)는 GM이 열리지 않는다(둘러보기와 같이 1권 1단원).
-- 서버 함수(service_role: fields-auth · fields-members)만 쓰고 읽는다.
create table if not exists public.fields_gm_plans (
  student_name text primary key references public.fields_access_accounts(student_name) on delete cascade on update cascade,
  mode text not null check (mode in ('book', 'period')),
  books jsonb not null default '[]'::jsonb,
  start_book text not null default 'book-01',
  starts_on date not null default current_date,
  ends_on date,
  extra_books integer not null default 0 check (extra_books between 0 and 10),
  updated_at timestamptz not null default now()
);
alter table public.fields_gm_plans enable row level security;
revoke all on table public.fields_gm_plans from anon, authenticated;
