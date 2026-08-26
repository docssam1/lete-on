# GFIELD Boarding School Math

This directory is the shared K–8 boarding-school program layer for the existing GFIELD elementary and middle-school math applications. It does not replace `number_magic`, `hselementary`, `fields-classic`, or `hsmiddle`.

## Architecture decision

Do not create a separate application for every course or competition. Reuse the existing viewers and question generators behind one lineage:

`course → unit → skill → level → testType → resourceType`

Every content record also declares:

- audience: student, teacher, or admin;
- Korean and English titles, with Simplified Chinese optional;
- standards and competition pathway metadata;
- provenance and reviewed publication rights;
- publication state, with uncertain items locked.

## Current scope

- US K–8 core mathematics as the academic backbone;
- Singapore mastery/model-method enrichment;
- Math Kangaroo grades 1–8;
- SASMO K2–grade 8;
- AMC 8 preparation;
- school-configured promotion decisions using diagnostic, mastery, retention, and teacher-review evidence.

The Common Core standards are not treated as a national promotion cut score. Each adopting school must version and own its thresholds.

## Publication rule

Only `owned_original` and `permissive_reviewed` material can enter a public build, and only after rights and bilingual metadata review. Licensed, noncommercial, permission-required, or unclear-provenance source material remains locked or private. A repository or dataset code license is not assumed to grant rights to every underlying textbook image or problem.

## Run checks

```powershell
cd boarding-school-math
npm test
npm run audit:public
```

The first contract tests cover K–8 scope, student/teacher separation, Korean/English labels, promotion-policy honesty, AMC eligibility labeling, and the public source-rights gate.

`curriculum/us-k8-cluster-map.js` maps all 94 official K–8 CCSS cluster IDs and standard-number ranges to short Korean and English GFIELD labels. The labels are paraphrases, not copied standard text. Every cluster remains locked for question release until its skill breakdown, prerequisite links, items, answers, and review evidence are complete. CCSS does not dictate GFIELD unit order, pacing, or promotion policy.

`curriculum/us-k8-content-registry.js` turns each of those 94 verified cluster records into one stable GFIELD course → unit → anchor-skill lineage. Foundation, core, and advanced identify the intended evidence type (readiness, direct application, or within-grade multi-step transfer), not an official standard band, score cut, or released question difficulty. The registry has no prompts, answers, or worksheets; a cluster anchor is intentionally not treated as a completed individual-standard skill decomposition. Student and teacher resource types stay disjoint, and every generated metadata record remains rights-locked until a reviewed item and server signature exist.

## Workbook resource plan

`resources/k8-resource-plan.js` creates one metadata-only student/teacher resource plan for each of the 94 verified K–8 units. Each resource record preserves the full `course → unit → skill → level → testType → resourceType` lineage and contains only planned component counts; it rejects prompts, options, item IDs, answers, solutions, rubrics, learner IDs, reviewer IDs, and release IDs. Student and teacher arrays are always separate.

Grade 6 is the first cadence-ready template: 3 weeks per unit, 2 × 75-minute meetings and two 30-minute home blocks each week, for 6 sessions across 10 units (60 meetings / 30 weeks before diagnostic, intervention, and competition weeks). A retention check is a separate signed attempt, scheduled at least 7 days after the unit rather than treated as the next in-class task. The schedule is a GFIELD default that a school may override. Levels live on resource records rather than on calendar sessions, so a foundation/core/advanced artifact can be independently bound and reviewed later.

This is a workbook production plan, not a released workbook. It does not generate pages, questions, answer keys, PDFs, download links, or a promotion decision. The viewer shows planning status only; its student/teacher toggle is not an authorization boundary. Every student resource is reserved for authenticated student delivery, and every teacher resource for authenticated teacher/admin delivery. A public-practice release needs a separate approved release contract; it is not implied by this plan.

The Number Magic adapter imports only elementary and middle-school legacy threads without changing their generator keys or prerequisites. Records without a source unit, reviewed standard mapping, or reviewed provenance remain visibly pending and cannot publish.

`audit:public` is intentionally blocking while legacy public authentication or student-record findings remain. It reports only finding codes and file paths, never credential values or student identifiers.

The staged Supabase migration creates authenticated, owner-scoped accounts and learning state. It is not applied to production until a replacement login is connected and legacy data is migrated without exposing names or access codes.

## Diagnostic and placement contract

`assessment/diagnostic-engine.js` separates short unit screeners from full course-placement evidence. A 12-item set may be used as a unit screener, but it cannot produce a placement review. The GFIELD course-placement contract requires 36–60 approved items across at least four domains, at least four items in every included domain, at least 20% of the form in each difficulty band, and at least two response types. These are internal form-construction safeguards, not a claim of psychometric reliability; real forms still require item review, piloting, and school approval.

`assessment/report-projections.js` turns a verified diagnostic analysis into separate student and teacher report shapes. The student report contains its score, domain-level error patterns, numbered item feedback, bilingual comments, and next-learning priorities, but not a learner ID, policy owner, database evidence IDs, answer, solution, rubric, or internal item ID. The teacher report retains pseudonymous assessment, opaque policy identifiers, item IDs, and evidence bindings, but never copies a browser-supplied policy-owner label or a display-form decision authority. A server may join a trusted policy registry after authentication when a staff-facing display name is necessary. Both are delivery contracts only: the server must authenticate the owner or staff role before returning either report, and neither can make an automatic promotion decision.

The report rebinds stored results by immutable item ID and always emits feedback in the validated blueprint order, so a database result order cannot change a displayed question number. It preserves each reviewed item's `unitId → clusterId → standardRange → skillId → difficulty` metadata and produces cluster-range evidence, including foundation/core/advanced point summaries. Cluster evidence is still only a reviewed GFIELD routing signal—not individual-standard mastery or an automatic placement decision.

`assessment/grade6-roadmap-projection.js` consumes that validated Grade 6 analysis and produces separate student and teacher **metadata-only** route candidates. A route can point to the matching Grade 6 unit, cadence, and role-safe resource-plan identifiers, but all assignments remain `locked-awaiting-reviewed-signed-content-and-teacher-confirmation`. The student projection has no learner or policy identity and no teacher resource identifiers; the teacher projection includes only aligned student/teacher metadata and opaque policy identifiers—not input owner labels, decision-authority display text, workbook text, prompts, answers, solutions, or download URLs. These local JSON projections are not authority: before an actual assignment or promotion decision, an authenticated server must reload the blueprint, attempt, policy, and evidence; regenerate the canonical route or verify an immutable server-issued digest/signature. Schools must still confirm pacing and a teacher must confirm every assignment.

The report never makes an automatic promotion decision. Promotion remains a versioned school decision that requires diagnostic, unit-mastery, retention, and teacher-review evidence. Evidence references are bound to one learner, school, program, assessment, and policy version, but this local engine does not prove that the referenced database records exist. It can mark a report only as `eligible-for-server-verification`; a future authenticated server must reload the policy, evidence, reviewer accounts, and attempt before a school decision. No national US cut score is built in.

## Question-bank release boundary

`question-bank/item-release-contract.js` separates student-safe prompt data from private answers, scoring rules, solutions, rubrics, and item/asset rights records. Course-placement prompts use `authenticated-assessment` delivery and remain outside public Git history. Even a `public-practice` bundle produces only a locked candidate without prompt payload; this repository has no public exporter until a verified signed-release-manifest gate is implemented. The local validator is only a schema-shape preflight. It can mark a bundle `structurally-ready-for-authenticated-signer-verification`, never verify a hash, approve a reviewer, release an item, or promote a learner. An authenticated signer must reload database roles and evidence, recompute canonical public/private/rights/rubric/review hashes, use a trusted clock for rights expiry, sanitize asset bytes, scan answer leakage, and create the signed immutable release manifest.

The `private-authoring/` worktree directory is intentionally Git-ignored for legacy local diagnostic drafts. New workbook drafts do **not** live in the Git worktree: the defensive `private-workbook-authoring/` ignore rule exists only to catch an accidental local copy. The actual workbook root must be an explicit, external local directory and is rejected if it resolves inside this repository or below a Git-discoverable ancestor `.git` directory/file. Use a dedicated non-Git authoring root: an arbitrary external Git directory configured with `core.worktree` but leaving no `.git` marker is not discoverable from the workbook path and must never be used as the private root. The preflight rejects duplicate JSON object keys, including escaped spellings of the same key. Assessment prompts, answers, solutions, rubric drafts, teacher guides, and reviewer notes must never be committed to the public repository. Run `npm run validate:private-grade6` for the complete Grade 6 diagnostic set and `npm run validate:private-grade6-workbook -- --root <external-local-root>` for a local Grade 6 workbook pack. Both print only status summaries, never prompt or answer content.

For response-bearing student components, the workbook preflight accepts plain text only: it rejects TeX control sequences, HTML tags/entities (including semicolon-less numeric entities), all ampersands, invisible controls, and unsupported cross-script characters—both as entered and after NFKC compatibility normalization. Every response-bearing student string is also rejected if it contains its exact canonical expected-response token as visible text, including forms directly attached to Korean, Chinese, or English text, so bare values and label synonyms cannot disclose a key. A larger scalar, decimal, or ratio token that merely contains the same digits is not treated as the canonical response token; authors must keep such conditions unambiguous and human answer-leak review remains required. All student-visible front matter, section titles, teaching blocks, and student identifiers are also screened for answer labels, including English `Answer`/`Ans`, Korean, and Chinese forms. Worked examples without a student response may use only the reviewed mathematical TeX command allowlist; arbitrary display or layout commands are rejected. This fail-closed boundary prevents formatting from disguising answer labels. It is still a structural screen, not a semantic proof that neutral prose does not reveal an expected response; every draft remains locked for independent human answer-leak review. The preflight also supports exact `rational-quotient` checks using integer numerators/denominators and `BigInt` reduction; it never uses floating-point arithmetic for a fraction-division answer.

For Grade 6 `6.NS.B`, `numeric-exact` additionally supports a BigInt-backed `decimal-operation` (`add`, `subtract`, `multiply`, `divide`) with canonical ASCII decimal inputs and terminating-division-only output, plus `greatest-common-factor` (operands 1–100) and `least-common-multiple` (operands 1–12). It does not auto-score remainder notation, standard-algorithm work, rounding, or symbolic distributive-property expressions; those stay locked for a later structured-response/teacher-review contract.

`assessment/grade6-placement-plan.js` is the first locked full-form plan: 42 one-point slots across all ten Grade 6 CCSS clusters and five domains, with 10 foundation, 22 core, and 10 advanced tasks. Its 18 multiple-choice, 14 numeric, 6 short-answer, and 4 constructed-response slots are only a form plan. Every slot has a null item ID until a real bilingual item, private scoring specification, rights record, independent review bundle, and authenticated server signature are present. The plan is not a national placement cut or a released exam.

## Authenticated item signer foundation

`supabase/migrations/*_create_boarding_item_signer_foundation.sql` and the `boarding-item-signer` Edge Function establish the next boundary without applying it to a live project. Private answer/scoring, rights, review, and release-manifest records have RLS enabled and no `anon` or `authenticated` grants. The function accepts only a user JWT for an active `gfield_math_accounts` administrator, recomputes canonical SHA-256 evidence hashes, requires independent approved reviews and an exact rights review for the item and every referenced asset, then creates an Ed25519-signed immutable release manifest. The manifest insert and transition from `in-review` to `signed` use a `service_role`-only invoker-security RPC so they succeed or roll back together. It is a signing boundary only: it has no student delivery endpoint and never returns prompts, answers, scoring, rubrics, rights records, or signatures to a browser. A live deployment still requires a separate project link, function secrets, configured origin allow-list, an approved signing-key custody process, and production RLS query verification.
