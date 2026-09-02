begin;

create index hs_user_exam_plan_assignments_assigned_by_idx
  on public.hs_user_exam_plan_assignments(assigned_by);
create index hs_user_exam_entitlements_granted_by_idx
  on public.hs_user_exam_entitlements(granted_by);

commit;
