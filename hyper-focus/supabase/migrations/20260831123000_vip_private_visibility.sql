begin;

-- VIP asset IDs and relations must be visible only when both the student and
-- the connected published content are currently entitled. The generic signed
-- URL function relies on these RLS checks before it uses the service role.
drop policy if exists hf_vip_assets_entitled_select on public.hf_vip_assets;
create policy hf_vip_assets_entitled_select
on public.hf_vip_assets for select to authenticated
using (
  (select hf_private.is_active_student())
  and exists (
    select 1
    from public.hf_vip_contents c
    join public.hf_entitlements e
      on e.student_id = (select auth.uid())
     and e.permission_key = 'vip'
     and e.revoked_at is null
     and e.starts_at <= now()
     and (e.expires_at is null or e.expires_at > now())
    where c.id = content_id
      and c.status = 'published'
      and c.published_at <= now()
  )
);

drop policy if exists hf_vip_relations_entitled_select on public.hf_vip_relations;
create policy hf_vip_relations_entitled_select
on public.hf_vip_relations for select to authenticated
using (
  (select hf_private.is_active_student())
  and exists (
    select 1
    from public.hf_vip_contents source_content
    join public.hf_vip_contents target_content
      on target_content.id = related_content_id
    join public.hf_entitlements e
      on e.student_id = (select auth.uid())
     and e.permission_key = 'vip'
     and e.revoked_at is null
     and e.starts_at <= now()
     and (e.expires_at is null or e.expires_at > now())
    where source_content.id = content_id
      and source_content.status = 'published'
      and source_content.published_at <= now()
      and target_content.status = 'published'
      and target_content.published_at <= now()
  )
);

commit;
