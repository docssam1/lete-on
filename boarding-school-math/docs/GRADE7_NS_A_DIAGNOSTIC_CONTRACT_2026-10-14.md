# Grade 7 `7.NS.A` unit-screener contract — 2026-10-14

Status: **the public plan remains locked and answer-free; no operational diagnostic, automatic prescription, placement decision, or deployment is released**. The 2026-10-14 planning candidate was preserved in local commit `306c575c` on 2026-10-17. Private draft authoring now occurs outside Git; the structural preflight cannot authorize release. See the current Mac continuation in `CONTINUATION_HANDOFF_2026-09-09.md` and the appended Mac QA record.

## Task contract

- Work key: `docssam1/lete-on | mathematics | 7.NS.A unit screener | US Grade 7 ages 12-13 | GFIELD release authority | original unseen diagnostic authoring | no placement/promotion/competition prediction | authenticated delivery only`.
- Outcome: identify reviewed evidence within rational-number operations so a teacher can choose the next concept and workbook sequence.
- Learner stage: US Grade 7, approximately ages 12–13.
- Curriculum scope: registered cluster `7.NS.A.1-3`; nine granular focus IDs from `7.NS.A.1a` through `7.NS.A.3`.
- Prerequisites to record during item authoring: rational-number meaning, opposites and absolute value, fraction equivalence, signed number-line position, and Grade 6 fraction computation.
- Authorized in the original public planning stage: locked metadata, slot balance, lineage checks, release gates, and tests. The 2026-10-17 continuation adds original private drafts and structural preflight outside Git, while preserving every public lock.
- Excluded from this public artifact: learner-facing prompts, choices, answers, solutions, rubrics, score cutoffs, strength/weakness thresholds, automatic assignment, public execution, student records, and third-party contest questions.
- Definition of done for this planning stage: every official clause has an explicit paraphrased evidence target, every focus has two reserved observations, difficulty and response modes are balanced, the existing diagnostic validator accepts a hypothetical approved projection, and the plan remains answer-free and non-placement.

## Reused evidence and current capability

| Evidence | Current use | State |
| --- | --- | --- |
| `curriculum/us-k8-cluster-map.js` | Official cluster ID and range mapping | verified metadata; GFIELD owns sequence |
| `curriculum/us-k8-content-registry.js` | Course, unit, cluster-anchor skill, audience, and test-type lineage | verified metadata; granular skill decomposition still locked |
| `assessment/diagnostic-engine.js` | `unit-screener` validation plus reviewed-evidence aggregation by granular focus, with explicit non-placement and non-prescription rules | verified local integration contract |
| `assessment/unit-screener-report-projections.js` | Separate student and teacher projections; learner identity and internal item lineage remain teacher-only, while both roles exclude answer and decision data | verified local integration contract |
| `assessment/unit-screener-scoring-readiness.js` | Holds student results in a score-safe pending state until every teacher-scored item has a bound review, then rebuilds one engine-valid attempt in immutable blueprint order | verified local integration contract |
| `docs/GRADE7_NS_A_AUTHENTICATED_DELIVERY_COMPATIBILITY_2026-10-14.md` | Confirms the generic signer is reusable while the frozen Grade 6 42/10 delivery and SQL contracts require a separate post-item-approval adapter | verified local compatibility decision |
| `learning/grade7-ns-a-unit-workbook.js` | Representation and misconception inventory only | verified workbook; its 36+8 items are not diagnostic items |
| `assessment/grade7-ns-a-screener-plan.js` | New 18-slot, answer-free, release-locked screener plan | local candidate |
| `assessment/grade7-ns-a-screener-authoring-manifest.js` | Binds every locked slot to shared item-release reviews and focus-specific independent proof methods without adding item or answer content | verified local authoring gate |
| `docs/GRADE7_NS_A_CC_SOURCE_AUDIT_2026-10-14.md` | Maps the official printed pages 48–49/PDF pages 47–48 to eighteen distinct answer-free evidence targets and records the response-mode correction | verified local source audit |

The public workbook may inform the diagnostic structure, but its exact questions must not be reused. A learner who studied the workbook needs unseen diagnostic evidence; otherwise a high score could reflect item memory rather than transfer.

## Assessment boundary

This is a **unit screener**, not a Grade 7 placement test.

- Unit screener: 18 items, one domain (`G7-NS`), one cluster (`7.NS.A`), two planned observations for each of nine granular focuses.
- Course placement: the existing engine requires 36–60 approved items, at least four domains, at least four items per domain, all three difficulty bands at a minimum 20% each, at least two response types, a school-owned policy, and teacher review.
- Therefore the `7.NS.A` result cannot produce a boarding-school placement, promotion, official US cutoff, SASMO readiness, Math Kangaroo readiness, AMC prediction, or grade-level claim.

## Locked 18-slot blueprint

| Focus | Observation 1 | Observation 2 |
| --- | --- | --- |
| `7.NS.A.1a` | foundation · multiple choice | core · teacher-scored constructed response |
| `7.NS.A.1b` | foundation · multiple choice | core · numeric |
| `7.NS.A.1c` | core · multiple choice | advanced · numeric with calculated number line |
| `7.NS.A.1d` | foundation · multiple choice | advanced · teacher-scored constructed response |
| `7.NS.A.2a` | foundation · multiple choice | core · numeric |
| `7.NS.A.2b` | foundation · multiple choice | advanced · numeric |
| `7.NS.A.2c` | core · multiple choice | advanced · teacher-scored constructed response |
| `7.NS.A.2d` | foundation · multiple choice | advanced · teacher-scored short answer |
| `7.NS.A.3` | core · multiple choice | advanced · multiple choice |

Balance: foundation/core/advanced = `6/6/6`; multiple-choice/numeric/short-answer/constructed-response = `10/4/1/3`; automatic/teacher scoring = `14/4`.

Each row now carries its official-source locator, a paraphrased official requirement, and two distinct evidence targets. This mapping is a planning contract only. In particular, arithmetic-only prompts cannot satisfy the contextual, property-reasoning, long-division, or description requirements named in the source audit.

Two observations are the minimum evidence reservation, not proof that a focus is mastered. No strength, weakness, mastery, or pacing threshold is approved until reviewed items and trial evidence establish an interpretation policy.

The local analyzer now requires a unique immutable `slotId` on every unit-screener item, rebinds results by immutable item ID, and preserves the slot binding in internal analysis. It reports only reviewed observation counts, earned points, difficulty evidence, error evidence, and item feedback for each granular focus. It does not label a focus as a strength, weakness, or mastery state; it does not select a lesson or workbook automatically; and it rejects course-placement and competition-benchmark blueprints before analysis.

The local report layer keeps the same boundary. The student projection omits learner ID, internal slot and item IDs, skill lineage, and teacher difficulty detail. The teacher projection retains the pseudonymous learner ID, immutable slot/item bindings, and reviewed lineage needed for human interpretation and audit. Both projections require authenticated delivery, set authorization verification to false until the server verifies it, and preserve the explicit false values for mastery thresholds, automatic prescription, course placement, promotion, and competition prediction.

The local scoring-readiness layer separates fourteen automatic items from four teacher-scored items. Before all four reviews are bound to the same attempt and immutable item IDs, student status exposes only counts and a pending state—never a partial score or analysis. A complete reviewed draft is rebuilt in blueprint order and must pass the diagnostic engine before analysis or report projection.

## Gate matrix for SOL · 울트라 item authoring

| Gate | Pass condition | Required evidence |
| --- | --- | --- |
| source-scope | Exact granular focus and mathematical action match `7.NS.A`; no later-grade dependency | stable item ID, standard locator, action review |
| answer-determinacy | Exactly one intended result, or an explicit teacher rubric for open work | independent calculation or exhaustive enumeration separate from authoring |
| learner-fit | Exact learner stage `US Grade 7 ages 12-13`; criteria `language`, `representations`, `prerequisites`, `reasoning-load`, `response-mode` all pass | item-level learner-fit record |
| representation | Number line, expression, context, decimal, units, signs, and fraction notation preserve the mathematical action | data model plus rendered comparison |
| distractor-quality | Every distractor maps to a specific misconception and is independently proved wrong | distractor ledger |
| item-independence | Diagnostic item is unseen and not a renamed workbook item | structural similarity review and fingerprint comparison |
| student-teacher-boundary | Student payload contains no key, solution, rubric, private locator, or teacher note | payload audit and browser inspection |
| delivery | Authenticated signed assessment only; no static public execution or student record in GitHub Pages | signer/storage integration test |
| rendering | Korean, English, and Simplified Chinese; desktop, 390px, A4/Letter; stacked fractions; no answer markers | browser and print evidence |
| interpretation | Evidence counts and missing/teacher-pending results are shown without unsupported mastery or placement claims | report contract and calibration review |
| release | Work complete, evidence verified, release authority approved, deployed artifact read back | separate work/evidence/release status record |

## Required next implementation stages

1. **SOL · 울트라:** author 18 new diagnostic items and independent answer/rubric ledgers. Implementation and verification must be separate.
2. **SOL · 울트라:** verify uniqueness, distractors, misconception mapping, Grade 7 language, and every `learner-fit` record.
3. **Implemented locally — TERRA · 높은:** unit-screener analyzer aggregates reviewed evidence by granular focus without invoking placement, promotion, mastery, or automatic prescription logic.
4. **Partially implemented locally — TERRA · 높은:** role-separated report DTOs, validators, and teacher-scored pending/readiness states are complete. Existing signer compatibility is verified; the 18/4 authenticated delivery adapter remains locked until immutable item releases exist.
5. **TERRA · 높은:** connect only teacher-confirmed priorities to embedded concept pages, the `7.NS.A` workbook, and later recheck; automatic prescription stays false until separately approved.
6. **TERRA · 높은:** run regression, trilingual browser, mobile, print, privacy, signed-payload, and public-boundary audits.

The immutable local plan fingerprint is `d58d1b6c07c4ddf185610b574eff0d64ec61ef27a0ef2fd0990e8915fb464a81`.
