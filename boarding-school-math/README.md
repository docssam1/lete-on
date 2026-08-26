# GFIELD Boarding School Math

This directory is the shared K–8 boarding-school program layer for the existing GFIELD elementary and middle-school math applications. It does not replace `number_magic`, `hselementary`, `fields-classic`, or `hsmiddle`. Algebra2 remains a separate in-scope workstream and is not inferred from unrelated high-school course labels.

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

The Number Magic adapter imports only elementary and middle-school legacy threads without changing their generator keys or prerequisites. High-school, generic algebra, and calculus course tiers are excluded rather than guessed to be Algebra2. Records without a source unit, reviewed standard mapping, or reviewed provenance remain visibly pending and cannot publish.

`audit:public` is intentionally blocking while legacy public authentication or student-record findings remain. It reports only finding codes and file paths, never credential values or student identifiers.

The staged Supabase migration creates authenticated, owner-scoped accounts and learning state. It is not applied to production until a replacement login is connected and legacy data is migrated without exposing names or access codes.

## Diagnostic and placement contract

`assessment/diagnostic-engine.js` separates short unit screeners from full course-placement evidence. A 12-item set may be used as a unit screener, but it cannot produce a placement review. The GFIELD course-placement contract requires 36–60 approved items across at least four domains, at least four items in every included domain, at least 20% of the form in each difficulty band, and at least two response types. These are internal form-construction safeguards, not a claim of psychometric reliability; real forms still require item review, piloting, and school approval.

`assessment/report-projections.js` turns a verified diagnostic analysis into separate student and teacher report shapes. The student report contains its score, domain-level error patterns, numbered item feedback, bilingual comments, and next-learning priorities, but not a learner ID, policy owner, database evidence IDs, answer, solution, rubric, or internal item ID. The teacher report retains pseudonymous assessment and policy context plus item IDs and evidence bindings, but still never contains answers or scoring payloads. Both are delivery contracts only: the server must authenticate the owner or staff role before returning either report, and neither can make an automatic promotion decision.

The report derives item points, domain scores, a school-configured internal performance band, error comments, and lesson priorities from the same exact result set. It never makes an automatic promotion decision. Promotion remains a versioned school decision that requires diagnostic, unit-mastery, retention, and teacher-review evidence. Evidence references are bound to one learner, school, program, assessment, and policy version, but this local engine does not prove that the referenced database records exist. It can mark a report only as `eligible-for-server-verification`; a future authenticated server must reload the policy, evidence, reviewer accounts, and attempt before a school decision. No national US cut score is built in.

## Question-bank release boundary

`question-bank/item-release-contract.js` separates student-safe prompt data from private answers, scoring rules, solutions, rubrics, and item/asset rights records. Course-placement prompts use `authenticated-assessment` delivery and remain outside public Git history. Even a `public-practice` bundle produces only a locked candidate without prompt payload; this repository has no public exporter until a verified signed-release-manifest gate is implemented. The local validator is only a schema-shape preflight. It can mark a bundle `structurally-ready-for-authenticated-signer-verification`, never verify a hash, approve a reviewer, release an item, or promote a learner. An authenticated signer must reload database roles and evidence, recompute canonical public/private/rights/rubric/review hashes, use a trusted clock for rights expiry, sanitize asset bytes, scan answer leakage, and create the signed immutable release manifest.

`assessment/grade6-placement-plan.js` is the first locked full-form plan: 42 one-point slots across all ten Grade 6 CCSS clusters and five domains, with 10 foundation, 22 core, and 10 advanced tasks. Its 18 multiple-choice, 14 numeric, 6 short-answer, and 4 constructed-response slots are only a form plan. Every slot has a null item ID until a real bilingual item, private scoring specification, rights record, independent review bundle, and authenticated server signature are present. The plan is not a national placement cut or a released exam.

## Authenticated item signer foundation

`supabase/migrations/*_create_boarding_item_signer_foundation.sql` and the `boarding-item-signer` Edge Function establish the next boundary without applying it to a live project. Private answer/scoring, rights, review, and release-manifest records have RLS enabled and no `anon` or `authenticated` grants. The function accepts only a user JWT for an active `gfield_math_accounts` administrator, recomputes canonical SHA-256 evidence hashes, requires independent approved reviews and an exact rights review for the item and every referenced asset, then creates an Ed25519-signed immutable release manifest. The manifest insert and transition from `in-review` to `signed` use a `service_role`-only invoker-security RPC so they succeed or roll back together. It is a signing boundary only: it has no student delivery endpoint and never returns prompts, answers, scoring, rubrics, rights records, or signatures to a browser. A live deployment still requires a separate project link, function secrets, configured origin allow-list, an approved signing-key custody process, and production RLS query verification.
