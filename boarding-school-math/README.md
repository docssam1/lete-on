# GFIELD Boarding School Math

This directory is the shared program layer for the existing GFIELD math applications. It does not replace `number_magic`, `hselementary`, `fields-classic`, `hsmiddle`, or `highschool-selection`. It gives them one curriculum, pathway, audience, localization, promotion, and source-rights contract.

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
- AMC 8 preparation, with AMC 10/12 shown only as later pathways;
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

`audit:public` is intentionally blocking while legacy public authentication or student-record findings remain. It reports only finding codes and file paths, never credential values or student identifiers.

The staged Supabase migration creates authenticated, owner-scoped accounts and learning state. It is not applied to production until a replacement login is connected and legacy data is migrated without exposing names or access codes.
