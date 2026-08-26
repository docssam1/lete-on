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

The Number Magic adapter imports only elementary and middle-school legacy threads without changing their generator keys or prerequisites. High-school, generic algebra, and calculus course tiers are excluded rather than guessed to be Algebra2. Records without a source unit, reviewed standard mapping, or reviewed provenance remain visibly pending and cannot publish.

`audit:public` is intentionally blocking while legacy public authentication or student-record findings remain. It reports only finding codes and file paths, never credential values or student identifiers.

The staged Supabase migration creates authenticated, owner-scoped accounts and learning state. It is not applied to production until a replacement login is connected and legacy data is migrated without exposing names or access codes.

## Diagnostic and placement contract

`assessment/diagnostic-engine.js` separates short unit screeners from full course-placement evidence. A 12-item set may be used as a unit screener, but it cannot produce a placement review. The GFIELD course-placement contract requires 36–60 approved items across at least four domains, at least four items in every included domain, at least 20% of the form in each difficulty band, and at least two response types. These are internal form-construction safeguards, not a claim of psychometric reliability; real forms still require item review, piloting, and school approval.

The report derives item points, domain scores, a school-configured internal performance band, error comments, and lesson priorities from the same exact result set. It never makes an automatic promotion decision. Promotion remains a versioned school decision that requires diagnostic, unit-mastery, retention, and teacher-review evidence. Evidence references are bound to one learner, school, program, assessment, and policy version, but this local engine does not prove that the referenced database records exist. It can mark a report only as `eligible-for-server-verification`; a future authenticated server must reload the policy, evidence, reviewer accounts, and attempt before a school decision. No national US cut score is built in.
