begin;

-- Grade 6 assessment is intentionally server-seeded.  This migration stores
-- release-safe lineage only; prompts, answers, rubrics and private scoring
-- payloads remain in the existing signer tables and are never copied here.

-- SECURITY DEFINER validation that must inspect server-only signer tables lives
-- outside the exposed public schema and has no browser execution privilege.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.gfield_math_learners (
  learner_id text primary key check (learner_id ~ '^lrm-bdg-[a-z0-9]{16}$'),
  school_id text not null check (school_id ~ '^sch-bdg-[a-z0-9]{16}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  current_grade text not null check (current_grade ~ '^(K|[1-9]|1[0-2])$'),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gfield_math_account_learner_links (
  user_id uuid not null references public.gfield_math_accounts(user_id) on delete cascade,
  learner_id text not null references public.gfield_math_learners(learner_id) on delete cascade,
  relationship text not null default 'self' check (relationship = 'self'),
  created_at timestamptz not null default now(),
  primary key (user_id, learner_id),
  unique (learner_id)
);

create table public.gfield_math_teacher_scopes (
  teacher_user_id uuid not null references public.gfield_math_accounts(user_id) on delete cascade,
  learner_id text not null references public.gfield_math_learners(learner_id) on delete cascade,
  scope_kind text not null default 'instruction-and-assessment'
    check (scope_kind = 'instruction-and-assessment'),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (teacher_user_id, learner_id, starts_at),
  check (ends_at is null or ends_at > starts_at)
);

-- This is the immutable server-side copy of assessment/grade6-placement-plan.js.
-- It contains no question text or scoring secret.
create table public.gfield_math_grade6_form_slot_contract (
  slot_number smallint primary key check (slot_number between 1 and 42),
  slot_id text not null unique check (slot_id ~ '^slot-bdg-g6-[a-z0-9-]+-[0-9]{2}$'),
  unit_id text not null check (unit_id ~ '^ccss-6-[a-z0-9-]+$'),
  cluster_id text not null check (cluster_id ~ '^6\.[A-Z]{1,3}\.[A-Z]$'),
  standard_range text not null,
  skill_id text not null check (skill_id ~ '^skill:us-core-k8:6-[a-z0-9-]+:anchor$'),
  domain_id text not null check (domain_id in ('G6-RP', 'G6-NS', 'G6-EE', 'G6-G', 'G6-SP')),
  difficulty text not null check (difficulty in ('foundation', 'core', 'advanced')),
  response_type text not null check (response_type in ('multiple-choice', 'numeric', 'short-answer', 'constructed-response')),
  scoring_mode text not null check (scoring_mode in ('automatic', 'teacher')),
  max_points smallint not null default 1 check (max_points = 1),
  constraint gfield_math_grade6_slot_contract_exact_unique unique (
    slot_number, slot_id, unit_id, cluster_id, standard_range, skill_id,
    domain_id, difficulty, response_type, scoring_mode, max_points
  ),
  check ((response_type in ('short-answer', 'constructed-response')) = (scoring_mode = 'teacher'))
);

insert into public.gfield_math_grade6_form_slot_contract (
  slot_number, slot_id, unit_id, cluster_id, standard_range, skill_id,
  domain_id, difficulty, response_type, scoring_mode, max_points
) values
  (1, 'slot-bdg-g6-ee-a-03', 'ccss-6-ee-a', '6.EE.A', '6.EE.A.1-4', 'skill:us-core-k8:6-ee-a:anchor', 'G6-EE', 'core', 'multiple-choice', 'automatic', 1),
  (2, 'slot-bdg-g6-ns-c-02', 'ccss-6-ns-c', '6.NS.C', '6.NS.C.5-8', 'skill:us-core-k8:6-ns-c:anchor', 'G6-NS', 'core', 'multiple-choice', 'automatic', 1),
  (3, 'slot-bdg-g6-rp-a-02', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'foundation', 'numeric', 'automatic', 1),
  (4, 'slot-bdg-g6-ee-c-01', 'ccss-6-ee-c', '6.EE.C', '6.EE.C.9', 'skill:us-core-k8:6-ee-c:anchor', 'G6-EE', 'core', 'multiple-choice', 'automatic', 1),
  (5, 'slot-bdg-g6-rp-a-03', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'core', 'multiple-choice', 'automatic', 1),
  (6, 'slot-bdg-g6-g-a-02', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'foundation', 'numeric', 'automatic', 1),
  (7, 'slot-bdg-g6-sp-a-03', 'ccss-6-sp-a', '6.SP.A', '6.SP.A.1-3', 'skill:us-core-k8:6-sp-a:anchor', 'G6-SP', 'core', 'multiple-choice', 'automatic', 1),
  (8, 'slot-bdg-g6-ns-a-02', 'ccss-6-ns-a', '6.NS.A', '6.NS.A.1', 'skill:us-core-k8:6-ns-a:anchor', 'G6-NS', 'core', 'numeric', 'automatic', 1),
  (9, 'slot-bdg-g6-g-a-06', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'advanced', 'multiple-choice', 'automatic', 1),
  (10, 'slot-bdg-g6-rp-a-06', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'core', 'multiple-choice', 'automatic', 1),
  (11, 'slot-bdg-g6-ee-a-02', 'ccss-6-ee-a', '6.EE.A', '6.EE.A.1-4', 'skill:us-core-k8:6-ee-a:anchor', 'G6-EE', 'core', 'numeric', 'automatic', 1),
  (12, 'slot-bdg-g6-ns-a-01', 'ccss-6-ns-a', '6.NS.A', '6.NS.A.1', 'skill:us-core-k8:6-ns-a:anchor', 'G6-NS', 'foundation', 'multiple-choice', 'automatic', 1),
  (13, 'slot-bdg-g6-ee-b-02', 'ccss-6-ee-b', '6.EE.B', '6.EE.B.5-8', 'skill:us-core-k8:6-ee-b:anchor', 'G6-EE', 'core', 'numeric', 'automatic', 1),
  (14, 'slot-bdg-g6-sp-b-01', 'ccss-6-sp-b', '6.SP.B', '6.SP.B.4-5', 'skill:us-core-k8:6-sp-b:anchor', 'G6-SP', 'core', 'multiple-choice', 'automatic', 1),
  (15, 'slot-bdg-g6-rp-a-07', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'advanced', 'numeric', 'automatic', 1),
  (16, 'slot-bdg-g6-g-a-03', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'core', 'multiple-choice', 'automatic', 1),
  (17, 'slot-bdg-g6-ns-b-02', 'ccss-6-ns-b', '6.NS.B', '6.NS.B.2-4', 'skill:us-core-k8:6-ns-b:anchor', 'G6-NS', 'core', 'numeric', 'automatic', 1),
  (18, 'slot-bdg-g6-ee-a-01', 'ccss-6-ee-a', '6.EE.A', '6.EE.A.1-4', 'skill:us-core-k8:6-ee-a:anchor', 'G6-EE', 'foundation', 'multiple-choice', 'automatic', 1),
  (19, 'slot-bdg-g6-ns-b-03', 'ccss-6-ns-b', '6.NS.B', '6.NS.B.2-4', 'skill:us-core-k8:6-ns-b:anchor', 'G6-NS', 'core', 'numeric', 'automatic', 1),
  (20, 'slot-bdg-g6-sp-b-03', 'ccss-6-sp-b', '6.SP.B', '6.SP.B.4-5', 'skill:us-core-k8:6-sp-b:anchor', 'G6-SP', 'core', 'multiple-choice', 'automatic', 1),
  (21, 'slot-bdg-g6-ee-a-04', 'ccss-6-ee-a', '6.EE.A', '6.EE.A.1-4', 'skill:us-core-k8:6-ee-a:anchor', 'G6-EE', 'advanced', 'short-answer', 'teacher', 1),
  (22, 'slot-bdg-g6-ns-c-03', 'ccss-6-ns-c', '6.NS.C', '6.NS.C.5-8', 'skill:us-core-k8:6-ns-c:anchor', 'G6-NS', 'core', 'numeric', 'automatic', 1),
  (23, 'slot-bdg-g6-rp-a-01', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'foundation', 'multiple-choice', 'automatic', 1),
  (24, 'slot-bdg-g6-g-a-04', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'core', 'numeric', 'automatic', 1),
  (25, 'slot-bdg-g6-sp-b-04', 'ccss-6-sp-b', '6.SP.B', '6.SP.B.4-5', 'skill:us-core-k8:6-sp-b:anchor', 'G6-SP', 'advanced', 'short-answer', 'teacher', 1),
  (26, 'slot-bdg-g6-ns-b-01', 'ccss-6-ns-b', '6.NS.B', '6.NS.B.2-4', 'skill:us-core-k8:6-ns-b:anchor', 'G6-NS', 'foundation', 'multiple-choice', 'automatic', 1),
  (27, 'slot-bdg-g6-ee-b-03', 'ccss-6-ee-b', '6.EE.B', '6.EE.B.5-8', 'skill:us-core-k8:6-ee-b:anchor', 'G6-EE', 'core', 'numeric', 'automatic', 1),
  (28, 'slot-bdg-g6-rp-a-08', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'advanced', 'constructed-response', 'teacher', 1),
  (29, 'slot-bdg-g6-g-a-05', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'core', 'short-answer', 'teacher', 1),
  (30, 'slot-bdg-g6-sp-a-01', 'ccss-6-sp-a', '6.SP.A', '6.SP.A.1-3', 'skill:us-core-k8:6-sp-a:anchor', 'G6-SP', 'foundation', 'multiple-choice', 'automatic', 1),
  (31, 'slot-bdg-g6-ns-a-03', 'ccss-6-ns-a', '6.NS.A', '6.NS.A.1', 'skill:us-core-k8:6-ns-a:anchor', 'G6-NS', 'advanced', 'constructed-response', 'teacher', 1),
  (32, 'slot-bdg-g6-ee-c-02', 'ccss-6-ee-c', '6.EE.C', '6.EE.C.9', 'skill:us-core-k8:6-ee-c:anchor', 'G6-EE', 'advanced', 'short-answer', 'teacher', 1),
  (33, 'slot-bdg-g6-rp-a-04', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'core', 'numeric', 'automatic', 1),
  (34, 'slot-bdg-g6-g-a-01', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'foundation', 'multiple-choice', 'automatic', 1),
  (35, 'slot-bdg-g6-sp-a-02', 'ccss-6-sp-a', '6.SP.A', '6.SP.A.1-3', 'skill:us-core-k8:6-sp-a:anchor', 'G6-SP', 'core', 'numeric', 'automatic', 1),
  (36, 'slot-bdg-g6-ee-b-04', 'ccss-6-ee-b', '6.EE.B', '6.EE.B.5-8', 'skill:us-core-k8:6-ee-b:anchor', 'G6-EE', 'advanced', 'constructed-response', 'teacher', 1),
  (37, 'slot-bdg-g6-ns-c-01', 'ccss-6-ns-c', '6.NS.C', '6.NS.C.5-8', 'skill:us-core-k8:6-ns-c:anchor', 'G6-NS', 'foundation', 'multiple-choice', 'automatic', 1),
  (38, 'slot-bdg-g6-rp-a-05', 'ccss-6-rp-a', '6.RP.A', '6.RP.A.1-3', 'skill:us-core-k8:6-rp-a:anchor', 'G6-RP', 'core', 'short-answer', 'teacher', 1),
  (39, 'slot-bdg-g6-g-a-07', 'ccss-6-g-a', '6.G.A', '6.G.A.1-4', 'skill:us-core-k8:6-g-a:anchor', 'G6-G', 'advanced', 'constructed-response', 'teacher', 1),
  (40, 'slot-bdg-g6-ee-b-01', 'ccss-6-ee-b', '6.EE.B', '6.EE.B.5-8', 'skill:us-core-k8:6-ee-b:anchor', 'G6-EE', 'foundation', 'multiple-choice', 'automatic', 1),
  (41, 'slot-bdg-g6-sp-b-02', 'ccss-6-sp-b', '6.SP.B', '6.SP.B.4-5', 'skill:us-core-k8:6-sp-b:anchor', 'G6-SP', 'core', 'numeric', 'automatic', 1),
  (42, 'slot-bdg-g6-ns-c-04', 'ccss-6-ns-c', '6.NS.C', '6.NS.C.5-8', 'skill:us-core-k8:6-ns-c:anchor', 'G6-NS', 'advanced', 'short-answer', 'teacher', 1);

create table public.gfield_math_assessment_forms (
  form_id text not null check (form_id ~ '^frm-bdg-[a-z0-9]{16}$'),
  form_version integer not null check (form_version >= 1),
  blueprint_id text not null check (blueprint_id = 'asm-bdg-grade6-entry-plan-v1'),
  blueprint_version integer not null check (blueprint_version = 1),
  blueprint_contract_sha256 text not null
    check (blueprint_contract_sha256 = 'a449bc7e0c50ff74af18fca0a648763ae1cfa0e1bdab21c13686dfb6d2547dab'),
  program_id text not null check (program_id = 'us-core-k8'),
  target_grade smallint not null check (target_grade = 6),
  purpose text not null check (purpose = 'course-placement'),
  fixed_item_count smallint not null default 42 check (fixed_item_count = 42),
  required_teacher_review_count smallint not null default 10 check (required_teacher_review_count = 10),
  release_state text not null default 'draft' check (release_state in ('draft', 'released', 'retired')),
  automatic_promotion boolean not null default false check (automatic_promotion = false),
  created_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  released_at timestamptz,
  primary key (form_id, form_version),
  check ((release_state = 'draft' and released_at is null) or (release_state in ('released', 'retired') and released_at is not null))
);

-- Existing signer data gets a composite key so each form row is bound to the
-- exact signed manifest, item id and version rather than only a release id.
alter table public.gfield_math_private_release_manifests
  add constraint gfield_math_release_manifest_exact_item_unique
  unique (release_id, item_id, item_version);

-- Signed rows remain immutable. Revocation is a separate append-only fact so
-- it has an actor, reason and timestamp and cannot rewrite signed evidence.
create table public.gfield_math_private_release_revocations (
  release_id text primary key,
  item_id text not null,
  item_version integer not null,
  revoked_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  reason text not null check (char_length(btrim(reason)) between 8 and 500),
  revoked_at timestamptz not null default now(),
  foreign key (release_id, item_id, item_version)
    references public.gfield_math_private_release_manifests(release_id, item_id, item_version) on delete restrict
);

create or replace function public.gfield_math_validate_release_revocation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_status text;
  v_manifest_state text;
  v_item_state text;
begin
  select a.role, a.status into v_role, v_status
    from public.gfield_math_accounts a where a.user_id = new.revoked_by;
  select m.release_state into v_manifest_state
    from public.gfield_math_private_release_manifests m
   where m.release_id = new.release_id and m.item_id = new.item_id and m.item_version = new.item_version
   for update;
  select r.release_state into v_item_state
    from public.gfield_math_private_item_revisions r
   where r.item_id = new.item_id and r.item_version = new.item_version;
  if v_role is distinct from 'admin' or v_status is distinct from 'active' or
     v_manifest_state is distinct from 'signed' or v_item_state is distinct from 'signed' then
    raise exception 'release revocation requires an active administrator and exact signed release';
  end if;
  return new;
end;
$$;

create trigger gfield_math_private_release_revocation_validate
before insert on public.gfield_math_private_release_revocations
for each row execute function public.gfield_math_validate_release_revocation();

create trigger gfield_math_private_release_revocations_append_only
before update or delete on public.gfield_math_private_release_revocations
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

create table public.gfield_math_assessment_form_items (
  form_id text not null,
  form_version integer not null,
  slot_number smallint not null,
  slot_id text not null,
  unit_id text not null,
  cluster_id text not null,
  standard_range text not null,
  skill_id text not null,
  domain_id text not null,
  difficulty text not null,
  response_type text not null,
  scoring_mode text not null,
  max_points smallint not null,
  release_id text not null,
  item_id text not null,
  item_version integer not null,
  primary key (form_id, form_version, slot_number),
  unique (form_id, form_version, slot_id),
  unique (form_id, form_version, item_id),
  unique (form_id, form_version, item_id, item_version),
  foreign key (form_id, form_version)
    references public.gfield_math_assessment_forms(form_id, form_version) on delete restrict,
  foreign key (
    slot_number, slot_id, unit_id, cluster_id, standard_range, skill_id,
    domain_id, difficulty, response_type, scoring_mode, max_points
  ) references public.gfield_math_grade6_form_slot_contract (
    slot_number, slot_id, unit_id, cluster_id, standard_range, skill_id,
    domain_id, difficulty, response_type, scoring_mode, max_points
  ) on delete restrict,
  foreign key (release_id, item_id, item_version)
    references public.gfield_math_private_release_manifests(release_id, item_id, item_version) on delete restrict,
  foreign key (item_id, item_version)
    references public.gfield_math_private_item_revisions(item_id, item_version) on delete restrict
);

create table public.gfield_math_assessment_policies (
  policy_id text not null check (policy_id ~ '^pol-bdg-[a-z0-9-]{4,64}$'),
  policy_version integer not null check (policy_version >= 1),
  school_id text not null check (school_id ~ '^sch-bdg-[a-z0-9]{16}$'),
  program_id text not null check (program_id = 'us-core-k8'),
  target_grade smallint not null check (target_grade = 6),
  effective_from date not null,
  policy_payload jsonb not null check (jsonb_typeof(policy_payload) = 'object'),
  claims_national_official_cut boolean not null default false check (claims_national_official_cut = false),
  teacher_review_required boolean not null default true check (teacher_review_required = true),
  automatic_promotion boolean not null default false check (automatic_promotion = false),
  release_state text not null default 'draft' check (release_state in ('draft', 'published', 'retired')),
  created_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (policy_id, policy_version)
);

create or replace function public.gfield_math_validate_form_creator()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_status text;
begin
  if tg_op = 'UPDATE' and
     row(new.form_id, new.form_version, new.created_by, new.created_at) is distinct from
     row(old.form_id, old.form_version, old.created_by, old.created_at) then
    raise exception 'form identity, creator and creation time are immutable';
  end if;
  if tg_op = 'INSERT' then
    select a.role, a.status into v_role, v_status
      from public.gfield_math_accounts a where a.user_id = new.created_by;
    if v_role is distinct from 'admin' or v_status is distinct from 'active' then
      raise exception 'assessment form creation requires an active administrator';
    end if;
  end if;
  return new;
end;
$$;

create trigger gfield_math_assessment_form_creator_validate
before insert or update on public.gfield_math_assessment_forms
for each row execute function public.gfield_math_validate_form_creator();

create or replace function public.gfield_math_validate_policy_lifecycle()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_status text;
begin
  if tg_op = 'DELETE' then
    if old.release_state <> 'draft' then
      raise exception 'published or retired assessment policies are immutable';
    end if;
    return old;
  end if;
  if tg_op = 'UPDATE' and
     row(new.policy_id, new.policy_version, new.created_by, new.created_at) is distinct from
     row(old.policy_id, old.policy_version, old.created_by, old.created_at) then
    raise exception 'policy identity, creator and creation time are immutable';
  end if;
  if tg_op = 'INSERT' then
    select a.role, a.status into v_role, v_status
      from public.gfield_math_accounts a where a.user_id = new.created_by;
    if v_status is distinct from 'active' or v_role not in ('teacher', 'admin') then
      raise exception 'assessment policy creation requires an active teacher or administrator';
    end if;
  end if;
  if tg_op = 'UPDATE' and old.release_state = 'published' then
    if new.release_state <> 'retired' or
       (to_jsonb(new) - 'release_state') is distinct from (to_jsonb(old) - 'release_state') then
      raise exception 'a published policy can only transition unchanged to retired';
    end if;
  elsif tg_op = 'UPDATE' and old.release_state = 'retired' then
    raise exception 'a retired assessment policy is immutable';
  elsif tg_op = 'UPDATE' and old.release_state = 'draft' and new.release_state = 'retired' then
    raise exception 'a draft policy must be published before it can be retired';
  end if;
  return new;
end;
$$;

create trigger gfield_math_assessment_policy_lifecycle_validate
before insert or update or delete on public.gfield_math_assessment_policies
for each row execute function public.gfield_math_validate_policy_lifecycle();

create table public.gfield_math_assessment_assignments (
  assignment_id text primary key check (assignment_id ~ '^asg-bdg-[a-z0-9]{16}$'),
  learner_id text not null references public.gfield_math_learners(learner_id) on delete restrict,
  school_id text not null check (school_id ~ '^sch-bdg-[a-z0-9]{16}$'),
  form_id text not null,
  form_version integer not null,
  policy_id text not null,
  policy_version integer not null,
  assigned_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  assignment_state text not null default 'assigned' check (assignment_state in ('assigned', 'opened', 'submitted', 'closed', 'cancelled')),
  available_from timestamptz not null default now(),
  due_at timestamptz,
  assigned_at timestamptz not null default now(),
  foreign key (form_id, form_version)
    references public.gfield_math_assessment_forms(form_id, form_version) on delete restrict,
  foreign key (policy_id, policy_version)
    references public.gfield_math_assessment_policies(policy_id, policy_version) on delete restrict,
  check (due_at is null or due_at > available_from)
);

create table public.gfield_math_assessment_attempts (
  attempt_id text primary key check (attempt_id ~ '^att-bdg-[a-z0-9]{16}$'),
  assignment_id text not null unique references public.gfield_math_assessment_assignments(assignment_id) on delete restrict,
  learner_id text not null references public.gfield_math_learners(learner_id) on delete restrict,
  school_id text not null check (school_id ~ '^sch-bdg-[a-z0-9]{16}$'),
  form_id text not null,
  form_version integer not null,
  policy_id text not null,
  policy_version integer not null,
  attempt_state text not null default 'in-progress' check (attempt_state in ('in-progress', 'submitted', 'scored', 'finalized', 'void')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  scored_at timestamptz,
  finalized_at timestamptz,
  unique (attempt_id, form_id, form_version, learner_id),
  foreign key (form_id, form_version)
    references public.gfield_math_assessment_forms(form_id, form_version) on delete restrict,
  foreign key (policy_id, policy_version)
    references public.gfield_math_assessment_policies(policy_id, policy_version) on delete restrict,
  check ((attempt_state = 'in-progress' and submitted_at is null and scored_at is null and finalized_at is null)
    or (attempt_state = 'submitted' and submitted_at is not null and scored_at is null and finalized_at is null)
    or (attempt_state = 'scored' and submitted_at is not null and scored_at is not null and finalized_at is null)
    or (attempt_state = 'finalized' and submitted_at is not null and scored_at is not null and finalized_at is not null)
    or attempt_state = 'void'),
  check (submitted_at is null or submitted_at >= started_at),
  check (scored_at is null or (submitted_at is not null and scored_at >= submitted_at)),
  check (finalized_at is null or (scored_at is not null and finalized_at >= scored_at))
);

-- This is the only table that accepts browser writes. It deliberately has no
-- correctness, awarded-points, answer-key or scoring-review column.
create table public.gfield_math_assessment_responses (
  response_id text primary key check (response_id ~ '^rsp-bdg-[a-z0-9]{16}$'),
  attempt_id text not null,
  learner_id text not null,
  form_id text not null,
  form_version integer not null,
  slot_number smallint not null,
  submitted_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  raw_response jsonb not null check (jsonb_typeof(raw_response) = 'object'),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (attempt_id, slot_number),
  foreign key (attempt_id, form_id, form_version, learner_id)
    references public.gfield_math_assessment_attempts(attempt_id, form_id, form_version, learner_id) on delete restrict,
  foreign key (form_id, form_version, slot_number)
    references public.gfield_math_assessment_form_items(form_id, form_version, slot_number) on delete restrict,
  check (octet_length(raw_response::text) <= 20000),
  check (raw_response ? 'value'),
  check (raw_response - 'value' = '{}'::jsonb),
  check (jsonb_typeof(raw_response -> 'value') in ('string', 'number', 'boolean'))
);

create table public.gfield_math_teacher_scoring_reviews (
  review_id text primary key check (review_id ~ '^grd-bdg-[a-z0-9]{16}$'),
  attempt_id text not null references public.gfield_math_assessment_attempts(attempt_id) on delete restrict,
  slot_number smallint not null,
  reviewer_user_id uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  awarded_points numeric(6,2) not null check (awarded_points >= 0),
  error_type text check (error_type is null or error_type in (
    'prerequisite-gap', 'concept-gap', 'representation-error', 'calculation-error',
    'condition-missed', 'strategy-gap', 'explanation-incomplete'
  )),
  review_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(review_payload) = 'object'),
  decision text not null check (decision in ('approved', 'void')),
  reviewed_at timestamptz not null default now(),
  unique (attempt_id, slot_number),
  unique (review_id, attempt_id, slot_number)
);

create table public.gfield_math_assessment_scores (
  score_id text primary key check (score_id ~ '^scr-bdg-[a-z0-9]{16}$'),
  attempt_id text not null references public.gfield_math_assessment_attempts(attempt_id) on delete restrict,
  slot_number smallint not null,
  awarded_points numeric(6,2) not null check (awarded_points >= 0),
  max_points numeric(6,2) not null check (max_points > 0 and awarded_points <= max_points),
  error_type text check (error_type is null or error_type in (
    'prerequisite-gap', 'concept-gap', 'representation-error', 'calculation-error',
    'condition-missed', 'strategy-gap', 'explanation-incomplete'
  )),
  score_source text not null check (score_source in ('automatic-server', 'teacher-review')),
  review_id text,
  scored_at timestamptz not null default now(),
  unique (attempt_id, slot_number),
  foreign key (review_id, attempt_id, slot_number)
    references public.gfield_math_teacher_scoring_reviews(review_id, attempt_id, slot_number) on delete restrict,
  check ((score_source = 'automatic-server' and review_id is null)
    or (score_source = 'teacher-review' and review_id is not null))
);

create table public.gfield_math_assessment_evidence (
  evidence_id text primary key check (evidence_id ~ '^evd-bdg-[a-z0-9]{16}$'),
  evidence_type text not null check (evidence_type in ('diagnostic', 'unit-mastery', 'retention-check', 'teacher-review')),
  learner_id text not null references public.gfield_math_learners(learner_id) on delete restrict,
  school_id text not null check (school_id ~ '^sch-bdg-[a-z0-9]{16}$'),
  attempt_id text not null references public.gfield_math_assessment_attempts(attempt_id) on delete restrict,
  form_id text not null,
  form_version integer not null,
  policy_id text not null,
  policy_version integer not null,
  evidence_payload jsonb not null check (jsonb_typeof(evidence_payload) = 'object'),
  verified_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  verified_at timestamptz not null default now(),
  foreign key (form_id, form_version)
    references public.gfield_math_assessment_forms(form_id, form_version) on delete restrict,
  foreign key (policy_id, policy_version)
    references public.gfield_math_assessment_policies(policy_id, policy_version) on delete restrict
);

create table public.gfield_math_report_snapshots (
  report_id text primary key check (report_id ~ '^rpt-bdg-[a-z0-9]{16}$'),
  attempt_id text not null references public.gfield_math_assessment_attempts(attempt_id) on delete restrict,
  learner_id text not null references public.gfield_math_learners(learner_id) on delete restrict,
  policy_id text not null,
  policy_version integer not null,
  audience text not null check (audience in ('student', 'teacher')),
  snapshot_version integer not null check (snapshot_version >= 1),
  snapshot_state text not null default 'draft' check (snapshot_state in ('draft', 'final')),
  snapshot_payload jsonb not null check (jsonb_typeof(snapshot_payload) = 'object'),
  automatic_promotion boolean not null default false check (automatic_promotion = false),
  promotion_decision text not null default 'not-decided' check (promotion_decision = 'not-decided'),
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  unique (attempt_id, snapshot_version, audience),
  unique (report_id, attempt_id, learner_id, audience),
  foreign key (policy_id, policy_version)
    references public.gfield_math_assessment_policies(policy_id, policy_version) on delete restrict,
  check ((snapshot_state = 'draft' and finalized_at is null) or (snapshot_state = 'final' and finalized_at is not null))
);

create table public.gfield_math_roadmap_snapshots (
  roadmap_id text primary key check (roadmap_id ~ '^rdm-bdg-[a-z0-9]{16}$'),
  report_id text not null references public.gfield_math_report_snapshots(report_id) on delete restrict,
  attempt_id text not null references public.gfield_math_assessment_attempts(attempt_id) on delete restrict,
  learner_id text not null references public.gfield_math_learners(learner_id) on delete restrict,
  audience text not null check (audience in ('student', 'teacher')),
  snapshot_version integer not null check (snapshot_version >= 1),
  snapshot_state text not null default 'draft' check (snapshot_state in ('draft', 'final')),
  assignment_state text not null default 'locked-awaiting-teacher-confirmation'
    check (assignment_state in ('locked-awaiting-teacher-confirmation', 'teacher-confirmed')),
  snapshot_payload jsonb not null check (jsonb_typeof(snapshot_payload) = 'object'),
  automatic_promotion boolean not null default false check (automatic_promotion = false),
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  unique (report_id, snapshot_version, audience),
  foreign key (report_id, attempt_id, learner_id, audience)
    references public.gfield_math_report_snapshots(report_id, attempt_id, learner_id, audience) on delete restrict,
  check ((snapshot_state = 'draft' and finalized_at is null) or (snapshot_state = 'final' and finalized_at is not null))
);

create index gfield_math_teacher_scopes_active_idx
  on public.gfield_math_teacher_scopes (teacher_user_id, learner_id, starts_at, ends_at);
create index gfield_math_teacher_scopes_learner_active_idx
  on public.gfield_math_teacher_scopes (learner_id, teacher_user_id, starts_at, ends_at);
create index gfield_math_release_revocations_item_idx
  on public.gfield_math_private_release_revocations (item_id, item_version);
create index gfield_math_release_revocations_revoked_by_idx
  on public.gfield_math_private_release_revocations (revoked_by);
create index gfield_math_form_items_release_idx
  on public.gfield_math_assessment_form_items (release_id, item_id, item_version);
create index gfield_math_form_items_item_idx
  on public.gfield_math_assessment_form_items (item_id, item_version);
create index gfield_math_forms_creator_idx
  on public.gfield_math_assessment_forms (created_by);
create index gfield_math_policies_creator_idx
  on public.gfield_math_assessment_policies (created_by);
create index gfield_math_assignments_learner_idx
  on public.gfield_math_assessment_assignments (learner_id, assignment_state, assigned_at desc);
create index gfield_math_assignments_form_idx
  on public.gfield_math_assessment_assignments (form_id, form_version);
create index gfield_math_assignments_policy_idx
  on public.gfield_math_assessment_assignments (policy_id, policy_version);
create index gfield_math_assignments_actor_idx
  on public.gfield_math_assessment_assignments (assigned_by);
create index gfield_math_attempts_learner_idx
  on public.gfield_math_assessment_attempts (learner_id, attempt_state, started_at desc);
create index gfield_math_attempts_form_idx
  on public.gfield_math_assessment_attempts (form_id, form_version);
create index gfield_math_attempts_policy_idx
  on public.gfield_math_assessment_attempts (policy_id, policy_version);
create index gfield_math_responses_learner_attempt_idx
  on public.gfield_math_assessment_responses (learner_id, attempt_id, slot_number);
create index gfield_math_responses_submitted_by_idx
  on public.gfield_math_assessment_responses (submitted_by);
create index gfield_math_teacher_reviews_actor_idx
  on public.gfield_math_teacher_scoring_reviews (reviewer_user_id, attempt_id);
create index gfield_math_scores_review_idx
  on public.gfield_math_assessment_scores (review_id, attempt_id, slot_number)
  where review_id is not null;
create index gfield_math_evidence_attempt_idx
  on public.gfield_math_assessment_evidence (attempt_id, evidence_type);
create index gfield_math_evidence_learner_idx
  on public.gfield_math_assessment_evidence (learner_id, attempt_id);
create index gfield_math_evidence_form_idx
  on public.gfield_math_assessment_evidence (form_id, form_version);
create index gfield_math_evidence_policy_idx
  on public.gfield_math_assessment_evidence (policy_id, policy_version);
create index gfield_math_evidence_verifier_idx
  on public.gfield_math_assessment_evidence (verified_by);
create index gfield_math_reports_learner_audience_idx
  on public.gfield_math_report_snapshots (learner_id, audience, snapshot_state, finalized_at desc);
create index gfield_math_reports_policy_idx
  on public.gfield_math_report_snapshots (policy_id, policy_version);
create index gfield_math_roadmaps_learner_audience_idx
  on public.gfield_math_roadmap_snapshots (learner_id, audience, snapshot_state, finalized_at desc);
create index gfield_math_roadmaps_attempt_idx
  on public.gfield_math_roadmap_snapshots (attempt_id);

create or replace function public.gfield_math_validate_student_link()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_account_status text;
  v_learner_status text;
begin
  select a.role, a.status into v_role, v_account_status
    from public.gfield_math_accounts a where a.user_id = new.user_id;
  select l.status into v_learner_status
    from public.gfield_math_learners l where l.learner_id = new.learner_id;
  if v_role <> 'student' or v_account_status <> 'active' or v_learner_status <> 'active' then
    raise exception 'student link requires one active student account and learner';
  end if;
  return new;
end;
$$;

create trigger gfield_math_account_learner_link_validate
before insert or update on public.gfield_math_account_learner_links
for each row execute function public.gfield_math_validate_student_link();

create or replace function public.gfield_math_validate_teacher_scope()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_account_status text;
  v_learner_status text;
begin
  select a.role, a.status into v_role, v_account_status
    from public.gfield_math_accounts a where a.user_id = new.teacher_user_id;
  select l.status into v_learner_status
    from public.gfield_math_learners l where l.learner_id = new.learner_id;
  if v_role not in ('teacher', 'admin') or v_account_status <> 'active' or v_learner_status <> 'active' then
    raise exception 'teacher scope requires an active teacher or administrator and learner';
  end if;
  return new;
end;
$$;

create trigger gfield_math_teacher_scope_validate
before insert or update on public.gfield_math_teacher_scopes
for each row execute function public.gfield_math_validate_teacher_scope();

create or replace function public.gfield_math_validate_form_item_binding()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_manifest_state text;
  v_manifest_payload jsonb;
  v_item_state text;
  v_visibility text;
  v_public_payload jsonb;
  v_public_payload_sha256 text;
  v_private_scoring_payload jsonb;
  v_form_state text;
  v_blueprint_id text;
  v_blueprint_version integer;
  v_blueprint_contract_sha256 text;
  v_purpose text;
begin
  select m.release_state, m.manifest_payload into v_manifest_state, v_manifest_payload
    from public.gfield_math_private_release_manifests m
   where m.release_id = new.release_id
     and m.item_id = new.item_id
     and m.item_version = new.item_version;
  select r.release_state, r.visibility_class, r.public_payload, r.public_payload_sha256, r.private_scoring_payload
    into v_item_state, v_visibility, v_public_payload, v_public_payload_sha256, v_private_scoring_payload
    from public.gfield_math_private_item_revisions r
   where r.item_id = new.item_id and r.item_version = new.item_version;
  select f.release_state, f.blueprint_id, f.blueprint_version, f.blueprint_contract_sha256, f.purpose
    into v_form_state, v_blueprint_id, v_blueprint_version, v_blueprint_contract_sha256, v_purpose
    from public.gfield_math_assessment_forms f
   where f.form_id = new.form_id and f.form_version = new.form_version
   for share;
  if v_form_state <> 'draft' then
    raise exception 'form items can be bound only while the form is draft';
  end if;
  if v_manifest_state is distinct from 'signed' or v_item_state is distinct from 'signed' or
     v_visibility is distinct from 'authenticated-assessment' or exists (
       select 1 from public.gfield_math_private_release_revocations x where x.release_id = new.release_id
     ) then
    raise exception 'form items require an exact signed authenticated-assessment release';
  end if;
  if v_manifest_payload ->> 'schemaVersion' is distinct from 'gfield-boarding-release-manifest-v1' or
     v_manifest_payload ->> 'releaseId' is distinct from new.release_id or
     v_manifest_payload ->> 'itemId' is distinct from new.item_id or
     v_manifest_payload -> 'itemVersion' is distinct from to_jsonb(new.item_version) or
     v_manifest_payload ->> 'visibilityClass' is distinct from 'authenticated-assessment' or
     v_manifest_payload ->> 'publicPayloadSha256' is distinct from v_public_payload_sha256 or
     v_public_payload ->> 'itemId' is distinct from new.item_id or
     v_public_payload -> 'itemVersion' is distinct from to_jsonb(new.item_version) or
     v_public_payload ->> 'programId' is distinct from 'us-core-k8' or
     v_public_payload -> 'targetGrade' is distinct from to_jsonb(6) or
     v_public_payload ->> 'domainId' is distinct from new.domain_id or
     v_public_payload ->> 'clusterId' is distinct from new.cluster_id or
     v_public_payload ->> 'skillId' is distinct from new.skill_id or
     v_public_payload ->> 'difficulty' is distinct from new.difficulty or
     v_public_payload ->> 'responseType' is distinct from new.response_type or
     v_public_payload -> 'maxPoints' is distinct from to_jsonb(new.max_points::integer) or
     v_public_payload #>> '{assessmentBinding,blueprintId}' is distinct from v_blueprint_id or
     v_public_payload #> '{assessmentBinding,blueprintVersion}' is distinct from to_jsonb(v_blueprint_version) or
     v_public_payload #>> '{assessmentBinding,blueprintContractSha256}' is distinct from v_blueprint_contract_sha256 or
     v_public_payload #>> '{assessmentBinding,purpose}' is distinct from v_purpose or
     v_public_payload #>> '{assessmentBinding,slotId}' is distinct from new.slot_id or
     v_public_payload #>> '{assessmentBinding,unitId}' is distinct from new.unit_id or
     v_public_payload #>> '{assessmentBinding,standardRange}' is distinct from new.standard_range or
     v_private_scoring_payload ->> 'itemId' is distinct from new.item_id or
     v_private_scoring_payload -> 'itemVersion' is distinct from to_jsonb(new.item_version) or
     v_private_scoring_payload ->> 'scoringMode' is distinct from new.scoring_mode or
     v_private_scoring_payload -> 'maxPoints' is distinct from to_jsonb(new.max_points::integer) then
    raise exception 'signed item lineage and scoring mode must exactly match the canonical slot';
  end if;
  return new;
end;
$$;

create trigger gfield_math_form_item_binding_validate
before insert or update on public.gfield_math_assessment_form_items
for each row execute function public.gfield_math_validate_form_item_binding();

create or replace function public.gfield_math_validate_form_release()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_item_count integer;
  v_teacher_count integer;
  v_unsigned_count integer;
  v_lineage_mismatch_count integer;
  v_duplicate_public_hash_count integer;
begin
  if tg_op = 'UPDATE' and old.release_state = 'released' then
    if new.release_state <> 'retired' or
       row(new.form_id, new.form_version, new.blueprint_id, new.blueprint_version, new.blueprint_contract_sha256,
           new.program_id, new.target_grade, new.purpose, new.fixed_item_count,
           new.required_teacher_review_count, new.automatic_promotion, new.created_by, new.created_at, new.released_at)
       is distinct from
       row(old.form_id, old.form_version, old.blueprint_id, old.blueprint_version, old.blueprint_contract_sha256,
           old.program_id, old.target_grade, old.purpose, old.fixed_item_count,
           old.required_teacher_review_count, old.automatic_promotion, old.created_by, old.created_at, old.released_at) then
      raise exception 'a released form can only transition unchanged to retired';
    end if;
  elsif tg_op = 'UPDATE' and old.release_state = 'retired' then
    raise exception 'a retired form is immutable';
  end if;

  if new.release_state = 'released' and (tg_op = 'INSERT' or old.release_state <> 'released') then
    select count(*), count(*) filter (where locked.scoring_mode = 'teacher'),
            count(*) filter (where locked.manifest_state <> 'signed' or locked.item_state <> 'signed' or x.release_id is not null),
            count(*) filter (where
              locked.manifest_payload ->> 'schemaVersion' is distinct from 'gfield-boarding-release-manifest-v1' or
              locked.manifest_payload ->> 'releaseId' is distinct from locked.release_id or
              locked.manifest_payload ->> 'itemId' is distinct from locked.item_id or
              locked.manifest_payload -> 'itemVersion' is distinct from to_jsonb(locked.item_version) or
              locked.manifest_payload ->> 'visibilityClass' is distinct from 'authenticated-assessment' or
              locked.manifest_payload ->> 'publicPayloadSha256' is distinct from locked.public_payload_sha256 or
              locked.public_payload ->> 'itemId' is distinct from locked.item_id or
             locked.public_payload -> 'itemVersion' is distinct from to_jsonb(locked.item_version) or
             locked.public_payload ->> 'programId' is distinct from 'us-core-k8' or
             locked.public_payload -> 'targetGrade' is distinct from to_jsonb(6) or
             locked.public_payload ->> 'domainId' is distinct from locked.domain_id or
             locked.public_payload ->> 'clusterId' is distinct from locked.cluster_id or
             locked.public_payload ->> 'skillId' is distinct from locked.skill_id or
             locked.public_payload ->> 'difficulty' is distinct from locked.difficulty or
              locked.public_payload ->> 'responseType' is distinct from locked.response_type or
              locked.public_payload -> 'maxPoints' is distinct from to_jsonb(locked.max_points::integer) or
              locked.public_payload #>> '{assessmentBinding,blueprintId}' is distinct from new.blueprint_id or
              locked.public_payload #> '{assessmentBinding,blueprintVersion}' is distinct from to_jsonb(new.blueprint_version) or
              locked.public_payload #>> '{assessmentBinding,blueprintContractSha256}' is distinct from new.blueprint_contract_sha256 or
              locked.public_payload #>> '{assessmentBinding,purpose}' is distinct from new.purpose or
              locked.public_payload #>> '{assessmentBinding,slotId}' is distinct from locked.slot_id or
              locked.public_payload #>> '{assessmentBinding,unitId}' is distinct from locked.unit_id or
              locked.public_payload #>> '{assessmentBinding,standardRange}' is distinct from locked.standard_range or
             locked.private_scoring_payload ->> 'itemId' is distinct from locked.item_id or
             locked.private_scoring_payload -> 'itemVersion' is distinct from to_jsonb(locked.item_version) or
             locked.private_scoring_payload ->> 'scoringMode' is distinct from locked.scoring_mode or
             locked.private_scoring_payload -> 'maxPoints' is distinct from to_jsonb(locked.max_points::integer)
           ),
           count(*) - count(distinct locked.public_payload_sha256)
      into v_item_count, v_teacher_count, v_unsigned_count, v_lineage_mismatch_count,
           v_duplicate_public_hash_count
      from (
        select i.*, m.release_state as manifest_state, m.manifest_payload,
               r.release_state as item_state, r.public_payload, r.public_payload_sha256,
               r.private_scoring_payload
          from public.gfield_math_assessment_form_items i
          join public.gfield_math_private_release_manifests m
            on m.release_id = i.release_id and m.item_id = i.item_id and m.item_version = i.item_version
          join public.gfield_math_private_item_revisions r
            on r.item_id = i.item_id and r.item_version = i.item_version
         where i.form_id = new.form_id and i.form_version = new.form_version
         order by i.slot_number
         for share of i, m, r
      ) locked
      left join public.gfield_math_private_release_revocations x on x.release_id = locked.release_id;
    if v_item_count <> 42 or v_teacher_count <> 10 or v_unsigned_count <> 0 or
       v_lineage_mismatch_count <> 0 or v_duplicate_public_hash_count <> 0 then
      raise exception 'Grade 6 form release requires 42 exact signed slots including 10 teacher-scored slots';
    end if;
  end if;
  return new;
end;
$$;

create trigger gfield_math_assessment_form_release_validate
before insert or update on public.gfield_math_assessment_forms
for each row execute function public.gfield_math_validate_form_release();

create or replace function public.gfield_math_prevent_released_form_item_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_form_state text;
begin
  select f.release_state into v_form_state
    from public.gfield_math_assessment_forms f
   where f.form_id = old.form_id and f.form_version = old.form_version
   for share;
  if v_form_state in ('released', 'retired') then
    raise exception 'released or retired form items are immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger gfield_math_released_form_items_immutable
before update or delete on public.gfield_math_assessment_form_items
for each row execute function public.gfield_math_prevent_released_form_item_mutation();

create or replace function public.gfield_math_validate_assignment()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_account_status text;
  v_learner_school text;
  v_form_state text;
  v_policy_state text;
  v_policy_school text;
  v_attempt_state text;
begin
  if tg_op = 'INSERT' and new.assignment_state <> 'assigned' then
    raise exception 'a new assignment must start assigned';
  end if;
  if tg_op = 'UPDATE' then
    if row(new.assignment_id, new.learner_id, new.school_id, new.form_id, new.form_version,
           new.policy_id, new.policy_version, new.assigned_by, new.assigned_at)
       is distinct from
       row(old.assignment_id, old.learner_id, old.school_id, old.form_id, old.form_version,
           old.policy_id, old.policy_version, old.assigned_by, old.assigned_at) then
      raise exception 'assignment identity and version lineage are immutable';
    end if;
    if old.assignment_state in ('closed', 'cancelled') and to_jsonb(new) is distinct from to_jsonb(old) then
      raise exception 'closed or cancelled assignments are immutable';
    end if;
    if new.assignment_state <> old.assignment_state and not (
      (old.assignment_state = 'assigned' and new.assignment_state in ('opened', 'cancelled')) or
      (old.assignment_state = 'opened' and new.assignment_state in ('submitted', 'cancelled')) or
      (old.assignment_state = 'submitted' and new.assignment_state in ('closed', 'cancelled'))
    ) then
      raise exception 'assignment state transition is invalid';
    end if;
  end if;

  select a.attempt_state into v_attempt_state
    from public.gfield_math_assessment_attempts a where a.assignment_id = new.assignment_id;
  if new.assignment_state = 'submitted' and (v_attempt_state is null or v_attempt_state not in ('submitted', 'scored')) then
    raise exception 'a submitted assignment requires its submitted attempt';
  end if;
  if new.assignment_state = 'closed' and v_attempt_state is distinct from 'finalized' then
    raise exception 'a closed assignment requires its finalized attempt';
  end if;
  if new.assignment_state = 'cancelled' and v_attempt_state is not null and v_attempt_state <> 'void' then
    raise exception 'an assignment with an attempt can be cancelled only after the attempt is void';
  end if;

  -- Terminal cleanup remains possible after actor suspension, policy/form retirement or item revocation.
  if tg_op = 'UPDATE' and new.assignment_state in ('closed', 'cancelled') then
    if row(new.available_from, new.due_at) is distinct from row(old.available_from, old.due_at) then
      raise exception 'terminal assignment cleanup cannot rewrite its schedule';
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    select a.role, a.status into v_role, v_account_status
      from public.gfield_math_accounts a where a.user_id = new.assigned_by;
    if v_account_status <> 'active' or v_role not in ('teacher', 'admin') then
      raise exception 'assignment requires an active teacher or administrator';
    end if;
    if v_role = 'teacher' and not exists (
      select 1 from public.gfield_math_teacher_scopes s
       where s.teacher_user_id = new.assigned_by and s.learner_id = new.learner_id
         and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
    ) then
      raise exception 'teacher has no active learner scope';
    end if;
  end if;
  select l.school_id into v_learner_school
    from public.gfield_math_learners l where l.learner_id = new.learner_id and l.status = 'active';
  select f.release_state into v_form_state
    from public.gfield_math_assessment_forms f
   where f.form_id = new.form_id and f.form_version = new.form_version;
  select p.release_state, p.school_id into v_policy_state, v_policy_school
    from public.gfield_math_assessment_policies p
   where p.policy_id = new.policy_id and p.policy_version = new.policy_version;
  if v_learner_school is null or v_learner_school <> new.school_id or v_policy_school <> new.school_id then
    raise exception 'assignment learner, school and policy must match';
  end if;
  if v_form_state <> 'released' or v_policy_state <> 'published' then
    raise exception 'assignment requires a released form and published policy';
  end if;
  if exists (
    select 1
      from public.gfield_math_assessment_form_items i
      join public.gfield_math_private_release_manifests m
        on m.release_id = i.release_id and m.item_id = i.item_id and m.item_version = i.item_version
      join public.gfield_math_private_item_revisions r
        on r.item_id = i.item_id and r.item_version = i.item_version
      left join public.gfield_math_private_release_revocations x on x.release_id = i.release_id
     where i.form_id = new.form_id and i.form_version = new.form_version
       and (m.release_state <> 'signed' or r.release_state <> 'signed' or x.release_id is not null)
  ) then
    raise exception 'assignment cannot use a withdrawn or revoked item release';
  end if;
  return new;
end;
$$;

create trigger gfield_math_assignment_validate
before insert or update on public.gfield_math_assessment_assignments
for each row execute function public.gfield_math_validate_assignment();

create or replace function public.gfield_math_validate_attempt_binding()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_assignment public.gfield_math_assessment_assignments%rowtype;
  v_form_state text;
  v_policy_state text;
  v_learner_status text;
  v_response_count integer;
  v_score_count integer;
  v_teacher_review_count integer;
begin
  if tg_op = 'INSERT' and new.attempt_state <> 'in-progress' then
    raise exception 'a new attempt must start in-progress';
  end if;
  if tg_op = 'UPDATE' then
    if row(new.attempt_id, new.assignment_id, new.learner_id, new.school_id, new.form_id,
           new.form_version, new.policy_id, new.policy_version, new.started_at)
       is distinct from
       row(old.attempt_id, old.assignment_id, old.learner_id, old.school_id, old.form_id,
           old.form_version, old.policy_id, old.policy_version, old.started_at) then
      raise exception 'attempt identity and version lineage are immutable';
    end if;
    if (old.submitted_at is not null and new.submitted_at is distinct from old.submitted_at) or
       (old.scored_at is not null and new.scored_at is distinct from old.scored_at) or
       (old.finalized_at is not null and new.finalized_at is distinct from old.finalized_at) then
      raise exception 'attempt event timestamps are write-once';
    end if;
    if new.attempt_state <> old.attempt_state and not (
      (old.attempt_state = 'in-progress' and new.attempt_state in ('submitted', 'void')) or
      (old.attempt_state = 'submitted' and new.attempt_state in ('scored', 'void')) or
      (old.attempt_state = 'scored' and new.attempt_state in ('finalized', 'void'))
    ) then
      raise exception 'attempt state transition is invalid';
    end if;
  end if;

  select * into v_assignment from public.gfield_math_assessment_assignments a
   where a.assignment_id = new.assignment_id
   for update;
  if v_assignment.assignment_id is null or
     row(new.learner_id, new.school_id, new.form_id, new.form_version, new.policy_id, new.policy_version)
     is distinct from
     row(v_assignment.learner_id, v_assignment.school_id, v_assignment.form_id, v_assignment.form_version,
          v_assignment.policy_id, v_assignment.policy_version) then
    raise exception 'attempt must match one assignment exactly';
  end if;

  -- Void cleanup remains possible after learner suspension, policy/form retirement or item revocation.
  if tg_op = 'UPDATE' and new.attempt_state = 'void' then
    if v_assignment.assignment_state not in ('opened', 'submitted') then
      raise exception 'a void attempt requires its opened or submitted assignment';
    end if;
    if row(new.submitted_at, new.scored_at, new.finalized_at)
       is distinct from row(old.submitted_at, old.scored_at, old.finalized_at) then
      raise exception 'void cleanup cannot rewrite prior attempt timestamps';
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' and v_assignment.assignment_state <> 'opened' then
    raise exception 'a new attempt requires an opened assignment';
  end if;
  if new.attempt_state = 'in-progress' and v_assignment.assignment_state <> 'opened' then
    raise exception 'an in-progress attempt requires its opened assignment';
  end if;
  if new.attempt_state = 'submitted' and v_assignment.assignment_state not in ('opened', 'submitted') then
    raise exception 'a submitted attempt requires its opened or submitted assignment';
  end if;
  if new.attempt_state in ('scored', 'finalized') and v_assignment.assignment_state <> 'submitted' then
    raise exception 'a scored or finalized attempt requires its submitted assignment';
  end if;
  select f.release_state into v_form_state
    from public.gfield_math_assessment_forms f
   where f.form_id = new.form_id and f.form_version = new.form_version;
  select p.release_state into v_policy_state
    from public.gfield_math_assessment_policies p
   where p.policy_id = new.policy_id and p.policy_version = new.policy_version;
  select l.status into v_learner_status
    from public.gfield_math_learners l where l.learner_id = new.learner_id;
  if v_form_state <> 'released' or v_policy_state <> 'published' or v_learner_status <> 'active' then
    raise exception 'attempt requires an active learner, released form and published policy';
  end if;
  if exists (
    select 1
      from public.gfield_math_assessment_form_items i
      join public.gfield_math_private_release_manifests m
        on m.release_id = i.release_id and m.item_id = i.item_id and m.item_version = i.item_version
      join public.gfield_math_private_item_revisions r
        on r.item_id = i.item_id and r.item_version = i.item_version
      left join public.gfield_math_private_release_revocations x on x.release_id = i.release_id
     where i.form_id = new.form_id and i.form_version = new.form_version
       and (m.release_state <> 'signed' or r.release_state <> 'signed' or x.release_id is not null)
  ) then
    raise exception 'attempt cannot use a withdrawn or revoked item release';
  end if;
  if new.attempt_state = 'scored' and (tg_op = 'INSERT' or old.attempt_state <> 'scored') then
    select count(*) into v_response_count
      from (
        select r.response_id
          from public.gfield_math_assessment_responses r
         where r.attempt_id = new.attempt_id
         order by r.slot_number, r.response_id
         for share of r
      ) locked_responses;
    select count(*) into v_teacher_review_count
      from (
        select r.review_id
          from public.gfield_math_teacher_scoring_reviews r
         where r.attempt_id = new.attempt_id and r.decision = 'approved'
         order by r.slot_number, r.review_id
         for share of r
      ) locked_reviews;
    select count(*) into v_score_count
      from (
        select s.score_id
          from public.gfield_math_assessment_scores s
         where s.attempt_id = new.attempt_id
         order by s.slot_number, s.score_id
         for share of s
      ) locked_scores;
    if v_response_count <> 42 or v_score_count <> 42 or v_teacher_review_count <> 10 then
      raise exception 'attempt scoring requires 42 responses, 42 server scores and 10 approved teacher reviews';
    end if;
  end if;
  if new.attempt_state = 'finalized' and (tg_op = 'INSERT' or old.attempt_state <> 'finalized') then
    select count(*) into v_response_count
      from (
        select r.response_id
          from public.gfield_math_assessment_responses r
         where r.attempt_id = new.attempt_id
         order by r.slot_number, r.response_id
         for share of r
      ) locked_responses;
    select count(*) into v_teacher_review_count
      from (
        select r.review_id
          from public.gfield_math_teacher_scoring_reviews r
         where r.attempt_id = new.attempt_id and r.decision = 'approved'
         order by r.slot_number, r.review_id
         for share of r
      ) locked_reviews;
    select count(*) into v_score_count
      from (
        select s.score_id
          from public.gfield_math_assessment_scores s
         where s.attempt_id = new.attempt_id
         order by s.slot_number, s.score_id
         for share of s
      ) locked_scores;
    if v_response_count <> 42 or v_score_count <> 42 or v_teacher_review_count <> 10 then
      raise exception 'attempt finalization requires 42 responses, 42 server scores and 10 approved teacher reviews';
    end if;
  end if;
  return new;
end;
$$;

create trigger gfield_math_attempt_binding_validate
before insert or update on public.gfield_math_assessment_attempts
for each row execute function public.gfield_math_validate_attempt_binding();

create or replace function public.gfield_math_validate_assignment_attempt_consistency()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_assignment_id text;
  v_assignment_state text;
  v_attempt_state text;
begin
  v_assignment_id := case when tg_op = 'DELETE' then old.assignment_id else new.assignment_id end;
  select a.assignment_state into v_assignment_state
    from public.gfield_math_assessment_assignments a where a.assignment_id = v_assignment_id;
  if v_assignment_state is null then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  select a.attempt_state into v_attempt_state
    from public.gfield_math_assessment_attempts a where a.assignment_id = v_assignment_id;

  if (v_assignment_state = 'assigned' and v_attempt_state is not null) or
     (v_assignment_state = 'opened' and v_attempt_state is not null and v_attempt_state <> 'in-progress') or
     (v_assignment_state = 'submitted' and (v_attempt_state is null or v_attempt_state not in ('submitted', 'scored'))) or
     (v_assignment_state = 'closed' and v_attempt_state is distinct from 'finalized') or
     (v_assignment_state = 'cancelled' and v_attempt_state is not null and v_attempt_state <> 'void') then
    raise exception 'assignment and attempt states are inconsistent at transaction completion';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

-- Both workflow rows may need to move in one transaction. These deferred gates
-- allow the safe intermediate order but reject every inconsistent committed state.
create constraint trigger gfield_math_assignment_attempt_consistency_from_assignment
after insert or update on public.gfield_math_assessment_assignments
deferrable initially deferred
for each row execute function public.gfield_math_validate_assignment_attempt_consistency();

create constraint trigger gfield_math_assignment_attempt_consistency_from_attempt
after insert or update or delete on public.gfield_math_assessment_attempts
deferrable initially deferred
for each row execute function public.gfield_math_validate_assignment_attempt_consistency();

create or replace function public.gfield_math_prevent_finalized_attempt_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.attempt_state in ('finalized', 'void') then
    raise exception 'a finalized or void attempt is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger gfield_math_finalized_attempt_immutable
before update or delete on public.gfield_math_assessment_attempts
for each row execute function public.gfield_math_prevent_finalized_attempt_mutation();

create or replace function public.gfield_math_prevent_finalized_assessment_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_attempt_id text;
  v_attempt_state text;
begin
  v_attempt_id := case when tg_op = 'DELETE' then old.attempt_id else new.attempt_id end;
  select a.attempt_state into v_attempt_state
    from public.gfield_math_assessment_attempts a where a.attempt_id = v_attempt_id
   for share;
  if v_attempt_state in ('scored', 'finalized', 'void') then
    raise exception 'responses, scores, reviews and evidence are immutable after attempt scoring, finalization or void';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function private.gfield_math_validate_raw_response_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.gfield_math_assessment_attempts%rowtype;
  v_assignment public.gfield_math_assessment_assignments%rowtype;
  v_form_state text;
  v_policy_state text;
  v_policy_school text;
  v_item_count integer;
  v_invalid_item_count integer;
  v_slot_count integer;
begin
  if tg_op = 'UPDATE' then
    if row(new.response_id, new.attempt_id, new.learner_id, new.form_id, new.form_version,
           new.slot_number, new.submitted_by, new.created_at)
       is distinct from
       row(old.response_id, old.attempt_id, old.learner_id, old.form_id, old.form_version,
           old.slot_number, old.submitted_by, old.created_at) then
      raise exception 'response identity and ownership fields are immutable';
    end if;
  end if;

  -- Fixed lock order: attempt, assignment, identity, form, policy, signed releases.
  select * into v_attempt
    from public.gfield_math_assessment_attempts a
   where a.attempt_id = new.attempt_id
   for update;
  if v_attempt.attempt_id is null or v_attempt.attempt_state <> 'in-progress' or
     row(v_attempt.learner_id, v_attempt.form_id, v_attempt.form_version)
     is distinct from row(new.learner_id, new.form_id, new.form_version) then
    raise exception 'raw response requires its exact in-progress attempt';
  end if;

  select * into v_assignment
    from public.gfield_math_assessment_assignments a
   where a.assignment_id = v_attempt.assignment_id
   for update;
  if v_assignment.assignment_id is null or v_assignment.assignment_state <> 'opened' or
     row(v_assignment.learner_id, v_assignment.school_id, v_assignment.form_id, v_assignment.form_version,
         v_assignment.policy_id, v_assignment.policy_version)
     is distinct from
     row(v_attempt.learner_id, v_attempt.school_id, v_attempt.form_id, v_attempt.form_version,
         v_attempt.policy_id, v_attempt.policy_version) then
    raise exception 'raw response requires its exact opened assignment';
  end if;

  perform 1 from public.gfield_math_accounts a
   where a.user_id = new.submitted_by and a.role = 'student' and a.status = 'active'
   for share;
  if not found then
    raise exception 'raw response requires an active student account';
  end if;
  perform 1
    from public.gfield_math_account_learner_links l
    join public.gfield_math_learners learner on learner.learner_id = l.learner_id
   where l.user_id = new.submitted_by and l.learner_id = new.learner_id and learner.status = 'active'
   for share of l, learner;
  if not found then
    raise exception 'raw response requires the active learner owner';
  end if;

  select f.release_state into v_form_state
    from public.gfield_math_assessment_forms f
   where f.form_id = new.form_id and f.form_version = new.form_version
   for share;
  select p.release_state, p.school_id into v_policy_state, v_policy_school
    from public.gfield_math_assessment_policies p
   where p.policy_id = v_attempt.policy_id and p.policy_version = v_attempt.policy_version
   for share;
  if v_form_state is distinct from 'released' or v_policy_state is distinct from 'published' or
     v_policy_school is distinct from v_attempt.school_id then
    raise exception 'raw response requires a released form and published school policy';
  end if;

  -- A shared lock serializes this write with append-only release revocation.
  perform 1
    from public.gfield_math_assessment_form_items i
    join public.gfield_math_private_release_manifests m
      on m.release_id = i.release_id and m.item_id = i.item_id and m.item_version = i.item_version
    join public.gfield_math_private_item_revisions r
      on r.item_id = i.item_id and r.item_version = i.item_version
   where i.form_id = new.form_id and i.form_version = new.form_version
   order by i.slot_number
   for share of m, r;

  select count(*),
         count(*) filter (where m.release_state <> 'signed' or r.release_state <> 'signed' or
                                r.visibility_class <> 'authenticated-assessment' or x.release_id is not null),
         count(*) filter (where i.slot_number = new.slot_number)
    into v_item_count, v_invalid_item_count, v_slot_count
    from public.gfield_math_assessment_form_items i
    join public.gfield_math_private_release_manifests m
      on m.release_id = i.release_id and m.item_id = i.item_id and m.item_version = i.item_version
    join public.gfield_math_private_item_revisions r
      on r.item_id = i.item_id and r.item_version = i.item_version
    left join public.gfield_math_private_release_revocations x on x.release_id = i.release_id
   where i.form_id = new.form_id and i.form_version = new.form_version;
  if v_item_count <> 42 or v_invalid_item_count <> 0 or v_slot_count <> 1 then
    raise exception 'raw response requires all 42 exact signed and unrevoked form items';
  end if;

  new.submitted_at := now();
  return new;
end;
$$;

create trigger gfield_math_raw_response_write_current
before insert or update on public.gfield_math_assessment_responses
for each row execute function private.gfield_math_validate_raw_response_write();

create trigger gfield_math_finalized_responses_immutable
before delete on public.gfield_math_assessment_responses
for each row execute function public.gfield_math_prevent_finalized_assessment_mutation();

create or replace function public.gfield_math_validate_teacher_review()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_learner_id text;
  v_form_id text;
  v_form_version integer;
  v_scoring_mode text;
  v_max_points numeric;
  v_role text;
  v_status text;
begin
  select a.learner_id, a.form_id, a.form_version into v_learner_id, v_form_id, v_form_version
    from public.gfield_math_assessment_attempts a
   where a.attempt_id = new.attempt_id and a.attempt_state = 'submitted'
   for share;
  select i.scoring_mode, i.max_points into v_scoring_mode, v_max_points
    from public.gfield_math_assessment_form_items i
   where i.form_id = v_form_id and i.form_version = v_form_version and i.slot_number = new.slot_number;
  select a.role, a.status into v_role, v_status
    from public.gfield_math_accounts a where a.user_id = new.reviewer_user_id;
  if v_learner_id is null or v_scoring_mode <> 'teacher' or new.awarded_points > v_max_points then
    raise exception 'teacher review must bind to a submitted teacher-scored item within its point limit';
  end if;
  if v_status <> 'active' or v_role not in ('teacher', 'admin') then
    raise exception 'teacher review requires an active teacher or administrator';
  end if;
  if v_role = 'teacher' and not exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = new.reviewer_user_id and s.learner_id = v_learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ) then
    raise exception 'reviewer has no active learner scope';
  end if;
  if tg_op = 'UPDATE' and exists (
    select 1 from public.gfield_math_assessment_scores s where s.review_id = old.review_id
  ) and to_jsonb(new) is distinct from to_jsonb(old) then
    raise exception 'a teacher review referenced by a server score is immutable';
  end if;
  return new;
end;
$$;

create trigger gfield_math_teacher_review_validate
before insert or update on public.gfield_math_teacher_scoring_reviews
for each row execute function public.gfield_math_validate_teacher_review();

create trigger gfield_math_finalized_teacher_reviews_immutable
before update or delete on public.gfield_math_teacher_scoring_reviews
for each row execute function public.gfield_math_prevent_finalized_assessment_mutation();

create or replace function public.gfield_math_validate_score()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_form_id text;
  v_form_version integer;
  v_scoring_mode text;
  v_contract_max numeric;
  v_review_decision text;
  v_review_awarded_points numeric;
  v_review_error_type text;
begin
  select a.form_id, a.form_version into v_form_id, v_form_version
    from public.gfield_math_assessment_attempts a
   where a.attempt_id = new.attempt_id and a.attempt_state = 'submitted'
   for share;
  select i.scoring_mode, i.max_points into v_scoring_mode, v_contract_max
    from public.gfield_math_assessment_form_items i
   where i.form_id = v_form_id and i.form_version = v_form_version and i.slot_number = new.slot_number;
  if v_scoring_mode is null or new.max_points <> v_contract_max then
    raise exception 'score must match the exact form item and point contract';
  end if;
  if (v_scoring_mode = 'teacher') <> (new.score_source = 'teacher-review') then
    raise exception 'score source must match the form scoring mode';
  end if;
  if v_scoring_mode = 'teacher' then
    select r.decision, r.awarded_points, r.error_type
      into v_review_decision, v_review_awarded_points, v_review_error_type
      from public.gfield_math_teacher_scoring_reviews r
     where r.review_id = new.review_id and r.attempt_id = new.attempt_id and r.slot_number = new.slot_number;
    if v_review_decision is distinct from 'approved' or
       v_review_awarded_points is distinct from new.awarded_points or
       v_review_error_type is distinct from new.error_type then
      raise exception 'teacher-review score must exactly match one approved teacher review';
    end if;
  elsif new.review_id is not null or new.score_source <> 'automatic-server' then
    raise exception 'automatic score cannot reference a teacher review';
  end if;
  return new;
end;
$$;

create trigger gfield_math_assessment_score_validate
before insert or update on public.gfield_math_assessment_scores
for each row execute function public.gfield_math_validate_score();

create trigger gfield_math_finalized_scores_immutable
before update or delete on public.gfield_math_assessment_scores
for each row execute function public.gfield_math_prevent_finalized_assessment_mutation();

create or replace function public.gfield_math_validate_evidence_verifier()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_role text;
  v_status text;
  v_attempt public.gfield_math_assessment_attempts%rowtype;
begin
  select * into v_attempt from public.gfield_math_assessment_attempts a
   where a.attempt_id = new.attempt_id
   for share;
  select a.role, a.status into v_role, v_status
    from public.gfield_math_accounts a where a.user_id = new.verified_by;
  if v_attempt.attempt_id is null or
     row(new.learner_id, new.school_id, new.form_id, new.form_version, new.policy_id, new.policy_version)
     is distinct from
     row(v_attempt.learner_id, v_attempt.school_id, v_attempt.form_id, v_attempt.form_version,
         v_attempt.policy_id, v_attempt.policy_version) then
    raise exception 'evidence must match the attempt lineage exactly';
  end if;
  if v_attempt.attempt_state <> 'submitted' then
    raise exception 'assessment evidence can be written only while the attempt is submitted';
  end if;
  if v_status <> 'active' or v_role not in ('teacher', 'admin') then
    raise exception 'evidence requires an active teacher or administrator';
  end if;
  if v_role = 'teacher' and not exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = new.verified_by and s.learner_id = new.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ) then
    raise exception 'evidence verifier has no active learner scope';
  end if;
  return new;
end;
$$;

create trigger gfield_math_assessment_evidence_validate
before insert or update on public.gfield_math_assessment_evidence
for each row execute function public.gfield_math_validate_evidence_verifier();

create trigger gfield_math_finalized_evidence_immutable
before update or delete on public.gfield_math_assessment_evidence
for each row execute function public.gfield_math_prevent_finalized_assessment_mutation();

create or replace function public.gfield_math_validate_final_report_snapshot()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_attempt public.gfield_math_assessment_attempts%rowtype;
  v_form_item_count integer;
  v_response_count integer;
  v_score_count integer;
  v_teacher_item_count integer;
  v_teacher_review_count integer;
begin
  select * into v_attempt from public.gfield_math_assessment_attempts a
   where a.attempt_id = new.attempt_id;
  if v_attempt.attempt_id is null or new.learner_id <> v_attempt.learner_id or
     row(new.policy_id, new.policy_version) is distinct from row(v_attempt.policy_id, v_attempt.policy_version) then
    raise exception 'report snapshot must match one attempt and policy exactly';
  end if;
  if new.snapshot_state <> 'final' then return new; end if;
  if v_attempt.attempt_state <> 'finalized' then
    raise exception 'final report must match one finalized attempt and policy exactly';
  end if;
  -- Counts are recalculated from server-owned relational rows. No browser form,
  -- score, review array or awarded-points payload participates in this gate.
  select count(*), count(*) filter (where i.scoring_mode = 'teacher')
    into v_form_item_count, v_teacher_item_count
    from public.gfield_math_assessment_form_items i
   where i.form_id = v_attempt.form_id and i.form_version = v_attempt.form_version;
  select count(*) into v_response_count
    from public.gfield_math_assessment_responses r where r.attempt_id = new.attempt_id;
  select count(*) into v_score_count
    from public.gfield_math_assessment_scores s where s.attempt_id = new.attempt_id;
  select count(*) into v_teacher_review_count
    from public.gfield_math_teacher_scoring_reviews r
   where r.attempt_id = new.attempt_id and r.decision = 'approved';
  if v_form_item_count <> 42 or v_response_count <> 42 or v_score_count <> 42 or
     v_teacher_item_count <> 10 or v_teacher_review_count <> 10 then
    raise exception 'final report requires 42 responses, 42 server scores and all 10 teacher reviews';
  end if;
  if exists (
    select 1
      from public.gfield_math_assessment_form_items i
      left join public.gfield_math_teacher_scoring_reviews r
        on r.attempt_id = new.attempt_id and r.slot_number = i.slot_number and r.decision = 'approved'
     where i.form_id = v_attempt.form_id and i.form_version = v_attempt.form_version
       and i.scoring_mode = 'teacher' and r.review_id is null
  ) then
    raise exception 'every teacher-scored slot requires an approved review';
  end if;
  return new;
end;
$$;

create trigger gfield_math_final_report_snapshot_validate
before insert or update on public.gfield_math_report_snapshots
for each row execute function public.gfield_math_validate_final_report_snapshot();

create or replace function public.gfield_math_validate_final_roadmap_snapshot()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.snapshot_state = 'final' and not exists (
    select 1 from public.gfield_math_report_snapshots r
     where r.report_id = new.report_id and r.attempt_id = new.attempt_id
       and r.learner_id = new.learner_id and r.audience = new.audience and r.snapshot_state = 'final'
  ) then
    raise exception 'final roadmap requires the exact final report snapshot';
  end if;
  return new;
end;
$$;

create trigger gfield_math_final_roadmap_snapshot_validate
before insert or update on public.gfield_math_roadmap_snapshots
for each row execute function public.gfield_math_validate_final_roadmap_snapshot();

create or replace function public.gfield_math_prevent_final_snapshot_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.snapshot_state = 'final' then
    raise exception 'final report and roadmap snapshots are immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger gfield_math_final_reports_immutable
before update or delete on public.gfield_math_report_snapshots
for each row execute function public.gfield_math_prevent_final_snapshot_mutation();

create trigger gfield_math_final_roadmaps_immutable
before update or delete on public.gfield_math_roadmap_snapshots
for each row execute function public.gfield_math_prevent_final_snapshot_mutation();

alter table public.gfield_math_learners enable row level security;
alter table public.gfield_math_account_learner_links enable row level security;
alter table public.gfield_math_teacher_scopes enable row level security;
alter table public.gfield_math_private_release_revocations enable row level security;
alter table public.gfield_math_grade6_form_slot_contract enable row level security;
alter table public.gfield_math_assessment_forms enable row level security;
alter table public.gfield_math_assessment_form_items enable row level security;
alter table public.gfield_math_assessment_policies enable row level security;
alter table public.gfield_math_assessment_assignments enable row level security;
alter table public.gfield_math_assessment_attempts enable row level security;
alter table public.gfield_math_assessment_responses enable row level security;
alter table public.gfield_math_teacher_scoring_reviews enable row level security;
alter table public.gfield_math_assessment_scores enable row level security;
alter table public.gfield_math_assessment_evidence enable row level security;
alter table public.gfield_math_report_snapshots enable row level security;
alter table public.gfield_math_roadmap_snapshots enable row level security;

revoke all on table public.gfield_math_learners from anon, authenticated;
revoke all on table public.gfield_math_account_learner_links from anon, authenticated;
revoke all on table public.gfield_math_teacher_scopes from anon, authenticated;
revoke all on table public.gfield_math_private_release_revocations from anon, authenticated;
revoke all on table public.gfield_math_grade6_form_slot_contract from anon, authenticated;
revoke all on table public.gfield_math_assessment_forms from anon, authenticated;
revoke all on table public.gfield_math_assessment_form_items from anon, authenticated;
revoke all on table public.gfield_math_assessment_policies from anon, authenticated;
revoke all on table public.gfield_math_assessment_assignments from anon, authenticated;
revoke all on table public.gfield_math_assessment_attempts from anon, authenticated;
revoke all on table public.gfield_math_assessment_responses from anon, authenticated;
revoke all on table public.gfield_math_teacher_scoring_reviews from anon, authenticated;
revoke all on table public.gfield_math_assessment_scores from anon, authenticated;
revoke all on table public.gfield_math_assessment_evidence from anon, authenticated;
revoke all on table public.gfield_math_report_snapshots from anon, authenticated;
revoke all on table public.gfield_math_roadmap_snapshots from anon, authenticated;

grant all on table public.gfield_math_learners to service_role;
grant all on table public.gfield_math_account_learner_links to service_role;
grant all on table public.gfield_math_teacher_scopes to service_role;
grant all on table public.gfield_math_private_release_revocations to service_role;
grant all on table public.gfield_math_grade6_form_slot_contract to service_role;
grant all on table public.gfield_math_assessment_forms to service_role;
grant all on table public.gfield_math_assessment_form_items to service_role;
grant all on table public.gfield_math_assessment_policies to service_role;
grant all on table public.gfield_math_assessment_assignments to service_role;
grant all on table public.gfield_math_assessment_attempts to service_role;
grant all on table public.gfield_math_assessment_responses to service_role;
grant all on table public.gfield_math_teacher_scoring_reviews to service_role;
grant all on table public.gfield_math_assessment_scores to service_role;
grant all on table public.gfield_math_assessment_evidence to service_role;
grant all on table public.gfield_math_report_snapshots to service_role;
grant all on table public.gfield_math_roadmap_snapshots to service_role;
grant select on table public.gfield_math_accounts to service_role;

-- Explicit Data API exposure is limited to identity/state, raw responses and
-- audience-safe snapshots. Form-item lineage, scores and evidence stay server-only.
grant select on table public.gfield_math_learners to authenticated;
grant select on table public.gfield_math_account_learner_links to authenticated;
grant select on table public.gfield_math_teacher_scopes to authenticated;
grant select (assignment_id, learner_id, assignment_state, available_from, due_at, assigned_at)
  on table public.gfield_math_assessment_assignments to authenticated;
grant select (attempt_id, assignment_id, learner_id, attempt_state, started_at, submitted_at, scored_at, finalized_at)
  on table public.gfield_math_assessment_attempts to authenticated;
grant select on table public.gfield_math_assessment_responses to authenticated;
grant insert (response_id, attempt_id, learner_id, form_id, form_version, slot_number, submitted_by, raw_response)
  on table public.gfield_math_assessment_responses to authenticated;
grant update (raw_response)
  on table public.gfield_math_assessment_responses to authenticated;
grant select on table public.gfield_math_report_snapshots to authenticated;
grant select on table public.gfield_math_roadmap_snapshots to authenticated;

-- Replace the earlier owner-only state policies so account suspension revokes
-- legacy learning-state access as well as the new assessment pipeline.
drop policy if exists gfield_math_student_state_read_self on public.gfield_math_student_state;
drop policy if exists gfield_math_student_state_insert_self on public.gfield_math_student_state;
drop policy if exists gfield_math_student_state_update_self on public.gfield_math_student_state;

create policy gfield_math_student_state_read_active_self
on public.gfield_math_student_state
for select to authenticated
using (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role = 'student' and a.status = 'active'
  )
);

create policy gfield_math_student_state_insert_active_self
on public.gfield_math_student_state
for insert to authenticated
with check (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role = 'student' and a.status = 'active'
  )
);

create policy gfield_math_student_state_update_active_self
on public.gfield_math_student_state
for update to authenticated
using (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role = 'student' and a.status = 'active'
  )
)
with check (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role = 'student' and a.status = 'active'
  )
);

create policy gfield_math_account_learner_links_read_self
on public.gfield_math_account_learner_links
for select to authenticated
using (
  (select auth.uid()) = user_id and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role = 'student' and a.status = 'active'
  )
);

create policy gfield_math_teacher_scopes_read_self
on public.gfield_math_teacher_scopes
for select to authenticated
using (
  (select auth.uid()) = teacher_user_id and
  starts_at <= now() and (ends_at is null or ends_at > now()) and exists (
    select 1 from public.gfield_math_accounts a
     where a.user_id = (select auth.uid()) and a.role in ('teacher', 'admin') and a.status = 'active'
  )
);

create policy gfield_math_learners_read_owned_or_scoped
on public.gfield_math_learners
for select to authenticated
using (
  status = 'active' and (
  exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_learners.learner_id
  ) or exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_learners.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ))
);

create policy gfield_math_assignments_read_owned_or_scoped
on public.gfield_math_assessment_assignments
for select to authenticated
using (
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_assignments.learner_id
       and active_learner.status = 'active'
  ) and (exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_assignments.learner_id
  ) or exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_assessment_assignments.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ))
);

create policy gfield_math_attempts_read_owned_or_scoped
on public.gfield_math_assessment_attempts
for select to authenticated
using (
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_attempts.learner_id
       and active_learner.status = 'active'
  ) and (exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_attempts.learner_id
  ) or exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_assessment_attempts.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ))
);

create policy gfield_math_responses_read_owned_or_scoped
on public.gfield_math_assessment_responses
for select to authenticated
using (
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_responses.learner_id
       and active_learner.status = 'active'
  ) and (exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_responses.learner_id
  ) or exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_assessment_responses.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  ))
);

create policy gfield_math_responses_insert_raw_owned
on public.gfield_math_assessment_responses
for insert to authenticated
with check (
  submitted_by = (select auth.uid()) and
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_responses.learner_id
       and active_learner.status = 'active'
  ) and
  exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_responses.learner_id
  ) and exists (
    select 1
      from public.gfield_math_assessment_attempts a
      join public.gfield_math_assessment_assignments assignment
        on assignment.assignment_id = a.assignment_id and assignment.assignment_state = 'opened'
     where a.attempt_id = gfield_math_assessment_responses.attempt_id
       and a.learner_id = gfield_math_assessment_responses.learner_id
       and a.attempt_state = 'in-progress'
  )
);

create policy gfield_math_responses_update_raw_owned
on public.gfield_math_assessment_responses
for update to authenticated
using (
  submitted_by = (select auth.uid()) and
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_responses.learner_id
       and active_learner.status = 'active'
  ) and
  exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_responses.learner_id
  ) and exists (
    select 1
      from public.gfield_math_assessment_attempts a
      join public.gfield_math_assessment_assignments assignment
        on assignment.assignment_id = a.assignment_id and assignment.assignment_state = 'opened'
     where a.attempt_id = gfield_math_assessment_responses.attempt_id
       and a.learner_id = gfield_math_assessment_responses.learner_id
       and a.attempt_state = 'in-progress'
  )
)
with check (
  submitted_by = (select auth.uid()) and
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_assessment_responses.learner_id
       and active_learner.status = 'active'
  ) and
  exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_assessment_responses.learner_id
  ) and exists (
    select 1
      from public.gfield_math_assessment_attempts a
      join public.gfield_math_assessment_assignments assignment
        on assignment.assignment_id = a.assignment_id and assignment.assignment_state = 'opened'
     where a.attempt_id = gfield_math_assessment_responses.attempt_id
       and a.learner_id = gfield_math_assessment_responses.learner_id
       and a.attempt_state = 'in-progress'
  )
);

create policy gfield_math_reports_read_student_final_or_teacher_scoped
on public.gfield_math_report_snapshots
for select to authenticated
using (
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_report_snapshots.learner_id
       and active_learner.status = 'active'
  ) and ((audience = 'student' and snapshot_state = 'final' and exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_report_snapshots.learner_id
  )) or (audience = 'teacher' and exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_report_snapshots.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  )))
);

create policy gfield_math_roadmaps_read_student_final_or_teacher_scoped
on public.gfield_math_roadmap_snapshots
for select to authenticated
using (
  exists (
    select 1 from public.gfield_math_learners active_learner
     where active_learner.learner_id = gfield_math_roadmap_snapshots.learner_id
       and active_learner.status = 'active'
  ) and ((audience = 'student' and snapshot_state = 'final' and exists (
    select 1 from public.gfield_math_account_learner_links l
     where l.user_id = (select auth.uid()) and l.learner_id = gfield_math_roadmap_snapshots.learner_id
  )) or (audience = 'teacher' and exists (
    select 1 from public.gfield_math_teacher_scopes s
     where s.teacher_user_id = (select auth.uid()) and s.learner_id = gfield_math_roadmap_snapshots.learner_id
       and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
  )))
);

revoke all on function public.gfield_math_validate_student_link() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_teacher_scope() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_release_revocation() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_form_creator() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_policy_lifecycle() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_form_item_binding() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_form_release() from public, anon, authenticated;
revoke all on function public.gfield_math_prevent_released_form_item_mutation() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_assignment() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_attempt_binding() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_assignment_attempt_consistency() from public, anon, authenticated;
revoke all on function public.gfield_math_prevent_finalized_attempt_mutation() from public, anon, authenticated;
revoke all on function public.gfield_math_prevent_finalized_assessment_mutation() from public, anon, authenticated;
revoke all on function private.gfield_math_validate_raw_response_write() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_teacher_review() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_score() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_evidence_verifier() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_final_report_snapshot() from public, anon, authenticated;
revoke all on function public.gfield_math_validate_final_roadmap_snapshot() from public, anon, authenticated;
revoke all on function public.gfield_math_prevent_final_snapshot_mutation() from public, anon, authenticated;

grant execute on function public.gfield_math_validate_student_link() to service_role;
grant execute on function public.gfield_math_validate_teacher_scope() to service_role;
grant execute on function public.gfield_math_validate_release_revocation() to service_role;
grant execute on function public.gfield_math_validate_form_creator() to service_role;
grant execute on function public.gfield_math_validate_policy_lifecycle() to service_role;
grant execute on function public.gfield_math_validate_form_item_binding() to service_role;
grant execute on function public.gfield_math_validate_form_release() to service_role;
grant execute on function public.gfield_math_prevent_released_form_item_mutation() to service_role;
grant execute on function public.gfield_math_validate_assignment() to service_role;
grant execute on function public.gfield_math_validate_attempt_binding() to service_role;
grant execute on function public.gfield_math_validate_assignment_attempt_consistency() to service_role;
grant execute on function public.gfield_math_prevent_finalized_attempt_mutation() to service_role;
grant execute on function public.gfield_math_prevent_finalized_assessment_mutation() to service_role;
grant usage on schema private to service_role;
grant execute on function private.gfield_math_validate_raw_response_write() to service_role;
grant execute on function public.gfield_math_validate_teacher_review() to service_role;
grant execute on function public.gfield_math_validate_score() to service_role;
grant execute on function public.gfield_math_validate_evidence_verifier() to service_role;
grant execute on function public.gfield_math_validate_final_report_snapshot() to service_role;
grant execute on function public.gfield_math_validate_final_roadmap_snapshot() to service_role;
grant execute on function public.gfield_math_prevent_final_snapshot_mutation() to service_role;

comment on table public.gfield_math_assessment_responses is
  'Only browser-writable assessment table. Accepts exactly one scalar value key and no score-shaped object.';
comment on table public.gfield_math_assessment_scores is
  'Server-owned awarded points. Browser roles have no direct access.';
comment on table public.gfield_math_report_snapshots is
  'Final reports are blocked until all 42 slots are answered and scored and all 10 teacher reviews are approved.';
comment on table public.gfield_math_roadmap_snapshots is
  'Roadmaps require a final report and never perform automatic promotion.';

commit;
