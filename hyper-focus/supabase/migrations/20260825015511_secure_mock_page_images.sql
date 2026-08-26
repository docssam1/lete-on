begin;

-- Premier exams are delivered as complete PDF page images. Keeping `page`
-- distinct from per-question artwork prevents the browser from reconstructing
-- or reflowing the copyrighted worksheet layout.
alter table public.hf_mock_assets
  drop constraint if exists hf_mock_assets_asset_kind_check;

alter table public.hf_mock_assets
  add constraint hf_mock_assets_asset_kind_check
  check (asset_kind in ('manifest', 'question', 'page', 'answer', 'explanation', 'cover'));

drop policy if exists hf_mock_assets_entitled_select on public.hf_mock_assets;
create policy hf_mock_assets_entitled_select
on public.hf_mock_assets for select to authenticated
using (
  (select hf_private.is_active_student())
  and exists (
    select 1
    from public.hf_mock_exams as exam
    where exam.id = hf_mock_assets.mock_exam_id
      and exam.status = 'published'
      and exam.published_at <= now()
      and exists (
        select 1 from public.hf_mock_entitlements as entitlement
        where entitlement.student_id = (select auth.uid())
          and entitlement.mock_exam_id = exam.id
          and entitlement.revoked_at is null
          and entitlement.starts_at <= now()
          and (entitlement.expires_at is null or entitlement.expires_at > now())
      )
      and (
        (
          hf_mock_assets.asset_kind in ('manifest', 'question', 'page', 'cover')
          and hf_mock_assets.revision = exam.current_revision
        )
        or (
          hf_mock_assets.asset_kind in ('answer', 'explanation')
          and exists (
            select 1
            from public.hf_mock_attempts as attempt
            where attempt.student_id = (select auth.uid())
              and attempt.mock_exam_id = exam.id
              and attempt.manifest_revision = hf_mock_assets.revision
              and attempt.answers_viewed_at is not null
              and attempt.status in ('grading', 'submitted')
          )
        )
      )
  )
);

commit;
