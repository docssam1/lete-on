# Grade 7 `7.NS.A` authenticated-delivery compatibility — 2026-10-14

Status: **verified local compatibility decision only; no item, form, database migration, assignment, student record, deployment, or authorization is released**.

## Decision

The existing Supabase item signer can sign Grade 7 `unit-screener` items. A new Cloud Run service is not required for item signing.

The existing Grade 6 learning-delivery contract and assessment SQL must **not** be wired directly to `7.NS.A`. They are intentionally frozen to a 42-item Grade 6 course-placement form with ten teacher-scored items. The official-source-reviewed Grade 7 screener contract has 18 items, four teacher-scored items, one unit, and no placement authority.

## Current compatibility map

| Component | Current evidence | Grade 7 decision |
| --- | --- | --- |
| `question-bank/boarding-signer-payload-guard.mjs` | accepts `unit-screener`, authenticated visibility, Grade 7 lineage, and a bound assessment slot | reuse |
| `supabase/functions/boarding-item-signer/index.ts` | uses the generic signer guard and authenticated active-admin authorization | reuse after reviewed items exist |
| `shared/learning-delivery-contract.js` | imports the Grade 6 plan and requires exactly 42 items and ten teacher-scored items | do not reuse directly |
| `supabase/migrations/20260828183704_create_grade6_assessment_pipeline.sql` | database constraints and finalization functions require 42/10 and `course-placement` | preserve unchanged; do not weaken |
| `assessment/diagnostic-engine.js` | requires every unit-screener blueprint item to retain one unique immutable `slotId` before scoring or analysis | reuse |
| `assessment/unit-screener-scoring-readiness.js` | enforces 14 automatic plus four teacher-review states and withholds partial results | reuse in a unit-screener adapter |
| `assessment/unit-screener-report-projections.js` | separates student and teacher results without answer or decision data | reuse after server authorization |

## Verified signer evidence

`tests/boarding-signer-payload-guard.test.cjs` now verifies that the existing signer accepts an authenticated Grade 7 item bound to:

- blueprint `asm-bdg-grade7-nsa-screener-v1`
- purpose `unit-screener`
- target grade `7`
- domain `G7-NS`
- cluster `7.NS.A`
- standard range `7.NS.A.1-3`

The full signer-guard suite passes 14/14, including recursive answer-leak rejection, exact public/private binding, distractor checks, teacher-rubric checks, asset byte reload, rights, reviewer credentials, expiry, and revocation.

## Required adapter after item approval

1. Create a separate signed form contract for the immutable 18 reviewed item releases. Do not derive a form from the current null item slots.
2. Bind each signed release to the exact plan slot, granular focus, scoring mode, item version, public hash, and plan fingerprint.
3. Add a new unit-screener database adapter or a genuinely generic assessment pipeline migration. Do not edit the frozen Grade 6 42/10 constraints into looser values.
4. Derive required item and teacher-review counts from the signed form contract, then assert the expected 18/4 values server-side.
5. Reuse existing authenticated account, teacher-scope, RLS, no-store, and allowed-origin controls. Keep service credentials server-only.
6. Project student and teacher delivery separately. Student delivery must omit learner identity, internal slot/item IDs, private scoring, answer data, and teacher queue IDs. Teacher output may retain immutable slot/item bindings for audit.
7. Keep partial automatic scores, analysis, and prescriptions unavailable while any teacher review is pending.
8. Reload signed form rows, item releases, reviews, and attempt bindings from the database before final analysis. Local eligibility is never server authorization.
9. Store no learner response, learner identity, service credential, or private scoring material in GitHub Pages or the public repository.

## Release gate

This adapter cannot be implemented truthfully until SOL · 울트라 authoring and independent verification produce 18 approved immutable item versions. Until then, the public curriculum may show the unit workbook and a locked diagnostic entry, but it must not execute the assessment or imply that a score, strength/weakness classification, prescription, placement, promotion, or competition prediction exists.
