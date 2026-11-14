-- 상담 지식 저장소(원장님 2026-11-13). AI 초안(roadmap-consult-ai)은 status='approved'만 읽는다.
-- 학생 이름·연락처·성적 원본은 넣지 않는다. 브라우저에서 직접 읽거나 쓰지 않고 Edge Function(service role)만 다룬다.
create table if not exists public.roadmap_knowledge (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('knowhow','site','news','drive')),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 4000),
  source text not null default '' check (char_length(source) <= 500),
  stage text not null default 'all' check (stage in ('all','preschool','elementary','middle','high')),
  status text not null default 'candidate' check (status in ('candidate','approved','archived')),
  checked_on date,
  origin text not null default 'admin' check (origin in ('admin','seed','drive','hermes')),
  seed_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz
);
create index if not exists roadmap_knowledge_status_kind on public.roadmap_knowledge (status, kind, updated_at desc);
alter table public.roadmap_knowledge enable row level security;
-- 정책을 만들지 않아 anon·authenticated는 읽거나 쓸 수 없다.
revoke all on public.roadmap_knowledge from anon, authenticated;

-- 승인된 본문을 편집할 때에는 원본을 두고 새 후보를 만든다.
alter table public.roadmap_knowledge add column if not exists supersedes_id uuid references public.roadmap_knowledge(id);
grant all on public.roadmap_knowledge to service_role;

create or replace function public.roadmap_knowledge_status(p_id uuid,p_status text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.roadmap_knowledge; old_status text;
begin
 if p_status not in ('candidate','approved','archived') then raise exception 'status_invalid'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('roadmap_knowledge_approval'));
 select * into r from public.roadmap_knowledge where id=p_id for update;
 if not found then raise exception 'not_found'; end if;
 if p_status='approved' and r.status<>'approved' then
  if exists(select 1 from public.roadmap_knowledge where supersedes_id=r.id and status='approved') then raise exception 'revision_conflict'; end if;
  if r.supersedes_id is not null then
   select status into old_status from public.roadmap_knowledge where id=r.supersedes_id for update;
   if old_status is distinct from 'approved' then raise exception 'revision_conflict'; end if;
   update public.roadmap_knowledge set status='archived',updated_at=now() where id=r.supersedes_id;
  end if;
 end if;
 update public.roadmap_knowledge set status=p_status,updated_at=now(),
 approved_at=case when p_status='approved' then now() else approved_at end where id=p_id returning * into r;
 return to_jsonb(r);
end; $$;
revoke all on function public.roadmap_knowledge_status(uuid,text) from public,anon,authenticated;
grant execute on function public.roadmap_knowledge_status(uuid,text) to service_role;

create table if not exists public.roadmap_counsel_daily (
 subject text not null, day date not null, hits integer not null default 1,
 primary key(subject,day)
);
alter table public.roadmap_counsel_daily enable row level security;
revoke all on public.roadmap_counsel_daily from public,anon,authenticated;
grant all on public.roadmap_counsel_daily to service_role;
create or replace function public.roadmap_counsel_take_daily(p_subject text,p_limit integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 if char_length(p_subject)<>64 or p_limit not between 1 and 100 then return false; end if;
 delete from public.roadmap_counsel_daily where day<(now() at time zone 'Asia/Seoul')::date-7;
 insert into public.roadmap_counsel_daily(subject,day) values(p_subject,(now() at time zone 'Asia/Seoul')::date)
 on conflict(subject,day) do update set hits=public.roadmap_counsel_daily.hits+1 returning hits into n;
 return n<=p_limit;
end; $$;
revoke all on function public.roadmap_counsel_take_daily(text,integer) from public,anon,authenticated;
grant execute on function public.roadmap_counsel_take_daily(text,integer) to service_role;
