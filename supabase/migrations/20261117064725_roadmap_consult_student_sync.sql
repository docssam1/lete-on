-- Private per-student consulting continuation. Authorization stays in roadmap-members.
create table public.roadmap_consult_students (
 account_id uuid not null references public.roadmap_review_accounts(user_id) on delete cascade,
 student_id text not null check (student_id ~ '^[a-z0-9]{1,24}$'),
 name text not null default '' check (char_length(name)<=20 and name !~ '[[:cntrl:]<>]'),
 document jsonb not null check (jsonb_typeof(document)='object' and octet_length(document::text)<=2000000),
 revision bigint not null default 1 check (revision>0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key(account_id,student_id)
);
create index roadmap_consult_students_recent on public.roadmap_consult_students(account_id,updated_at desc,student_id);
create table public.roadmap_consult_history (
 account_id uuid not null,
 student_id text not null,
 revision bigint not null,
 document jsonb not null,
 created_at timestamptz not null default now(),
 primary key(account_id,student_id,revision),
 foreign key(account_id,student_id) references public.roadmap_consult_students(account_id,student_id) on delete cascade
);
alter table public.roadmap_consult_students enable row level security;
alter table public.roadmap_consult_history enable row level security;
revoke all on public.roadmap_consult_students,public.roadmap_consult_history from public,anon,authenticated;
grant select,insert,update,delete on public.roadmap_consult_students,public.roadmap_consult_history to service_role;

create function public.roadmap_save_consult_student(p_account uuid,p_student text,p_name text,p_revision bigint,p_document jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.roadmap_consult_students;
begin
 if not exists(select 1 from public.roadmap_review_accounts where user_id=p_account and active) then raise exception 'account_missing'; end if;
 if p_student is null or p_student !~ '^[a-z0-9]{1,24}$' or p_revision is null or p_revision<0
    or p_name is null or char_length(p_name)>20 or p_name ~ '[[:cntrl:]<>]'
    or p_document is null or jsonb_typeof(p_document)<>'object' or octet_length(p_document::text)>2000000 then raise exception 'document_invalid'; end if;
 if p_revision=0 then
  insert into public.roadmap_consult_students(account_id,student_id,name,document)
   values(p_account,p_student,p_name,p_document) on conflict do nothing returning * into r;
  if found then return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at); end if;
 end if;
 select * into r from public.roadmap_consult_students where account_id=p_account and student_id=p_student for update;
 if not found then return jsonb_build_object('missing',true); end if;
 if r.revision<>p_revision then
  return jsonb_build_object('conflict',true,'revision',r.revision,'updatedAt',r.updated_at,'document',r.document);
 end if;
 if r.document=p_document and r.name=p_name then return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at); end if;
 insert into public.roadmap_consult_history(account_id,student_id,revision,document,created_at)
  values(r.account_id,r.student_id,r.revision,r.document,r.updated_at);
 delete from public.roadmap_consult_history where account_id=p_account and student_id=p_student and revision not in
  (select revision from public.roadmap_consult_history where account_id=p_account and student_id=p_student order by revision desc limit 3);
 update public.roadmap_consult_students set name=p_name,document=p_document,revision=r.revision+1,updated_at=now()
  where account_id=p_account and student_id=p_student returning * into r;
 return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at);
end $$;
revoke all on function public.roadmap_save_consult_student(uuid,text,text,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.roadmap_save_consult_student(uuid,text,text,bigint,jsonb) to service_role;
