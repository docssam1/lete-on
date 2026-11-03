-- Account plans are served exclusively through the authenticated membership function.
create table public.roadmap_plan_saves (
 owner_id uuid primary key,
 document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 300000),
 revision bigint not null default 1 check (revision > 0),
 storage_agreed_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.roadmap_plan_history (
 owner_id uuid not null references public.roadmap_plan_saves(owner_id) on delete cascade,
 revision bigint not null,
 document jsonb not null,
 created_at timestamptz not null default now(),
 primary key(owner_id,revision)
);
alter table public.roadmap_plan_saves enable row level security;
alter table public.roadmap_plan_history enable row level security;
revoke all on public.roadmap_plan_saves,public.roadmap_plan_history from public,anon,authenticated;
grant select,insert,update,delete on public.roadmap_plan_saves,public.roadmap_plan_history to service_role;
create function public.roadmap_save_plan(p_owner uuid,p_revision bigint,p_document jsonb,p_consent boolean default false)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare r public.roadmap_plan_saves; inserted boolean;
begin
 if not exists(select 1 from public.roadmap_members where user_id=p_owner) and not exists(select 1 from public.roadmap_review_accounts where user_id=p_owner and active) then raise exception 'owner_missing'; end if;
 if p_revision < 0 or jsonb_typeof(p_document) <> 'object' or octet_length(p_document::text)>300000 then raise exception 'document_invalid'; end if;
 if p_revision=0 and p_consent then
  insert into public.roadmap_plan_saves(owner_id,document) values(p_owner,p_document) on conflict do nothing returning * into r;
  if found then return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at); end if;
 end if;
 select * into r from public.roadmap_plan_saves where owner_id=p_owner for update;
 if not found then return jsonb_build_object('consentRequired',true); end if;
 if r.revision <> p_revision then return jsonb_build_object('conflict',true,'revision',r.revision,'updatedAt',r.updated_at,'document',r.document); end if;
 if r.document=p_document then return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at); end if;
 insert into public.roadmap_plan_history(owner_id,revision,document,created_at) values(r.owner_id,r.revision,r.document,r.updated_at);
 delete from public.roadmap_plan_history where owner_id=p_owner and revision not in(select revision from public.roadmap_plan_history where owner_id=p_owner order by revision desc limit 10);
 update public.roadmap_plan_saves set document=p_document,revision=r.revision+1,updated_at=now() where owner_id=p_owner returning * into r;
 return jsonb_build_object('saved',true,'revision',r.revision,'updatedAt',r.updated_at);
end $$;
revoke all on function public.roadmap_save_plan(uuid,bigint,jsonb,boolean) from public,anon,authenticated;
grant execute on function public.roadmap_save_plan(uuid,bigint,jsonb,boolean) to service_role;
-- Removing a roadmap membership also removes current and previous plans atomically.
create function public.roadmap_delete_owned_plans() returns trigger language plpgsql security definer set search_path='' as $$ begin delete from public.roadmap_plan_saves where owner_id=old.user_id; return old; end $$;
revoke all on function public.roadmap_delete_owned_plans() from public,anon,authenticated;
create trigger roadmap_members_delete_plans after delete on public.roadmap_members for each row execute function public.roadmap_delete_owned_plans();
create trigger roadmap_review_delete_plans after delete on public.roadmap_review_accounts for each row execute function public.roadmap_delete_owned_plans();
