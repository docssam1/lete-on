begin;

drop policy if exists hs_user_exam_plan_assignments_select_own on public.hs_user_exam_plan_assignments;
drop policy if exists hs_user_exam_entitlements_select_own on public.hs_user_exam_entitlements;
drop policy if exists hs_user_exam_recipes_select_own on public.hs_user_exam_recipes;
drop policy if exists hs_user_exam_recipes_insert_own on public.hs_user_exam_recipes;
drop policy if exists hs_user_exam_recipes_update_own on public.hs_user_exam_recipes;
drop policy if exists hs_user_exam_recipes_delete_own on public.hs_user_exam_recipes;

create policy hs_user_exam_plan_assignments_select_own on public.hs_user_exam_plan_assignments
for select to authenticated using ((select auth.uid()) is not null and user_id = (select auth.uid()));
create policy hs_user_exam_entitlements_select_own on public.hs_user_exam_entitlements
for select to authenticated using ((select auth.uid()) is not null and user_id = (select auth.uid()));
create policy hs_user_exam_recipes_select_own on public.hs_user_exam_recipes
for select to authenticated using ((select auth.uid()) is not null and owner_id = (select auth.uid()));
create policy hs_user_exam_recipes_insert_own on public.hs_user_exam_recipes
for insert to authenticated with check ((select auth.uid()) is not null and owner_id = (select auth.uid()));
create policy hs_user_exam_recipes_update_own on public.hs_user_exam_recipes
for update to authenticated using ((select auth.uid()) is not null and owner_id = (select auth.uid()))
with check ((select auth.uid()) is not null and owner_id = (select auth.uid()));
create policy hs_user_exam_recipes_delete_own on public.hs_user_exam_recipes
for delete to authenticated using ((select auth.uid()) is not null and owner_id = (select auth.uid()));

commit;
