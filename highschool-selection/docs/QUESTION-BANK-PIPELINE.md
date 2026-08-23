# Question bank pipeline

This pipeline stores review metadata, not question text, answer values, solution text, original files, or filesystem locations. Stable internal mode values are limited to `SH`, `DP`, `WM`, `ED`, `DG`, and `SM`. Our service displays the Korean academy names. Only MathFlat worksheet titles and writer metadata stay neutral (`SH`/`DP`/... and writer `T`).

## 0. User entry paths and academy separation

The bank supports three entry paths without duplicating an item:

1. 시험지별 — 추천 모의고사와 승인된 원본·쌍둥이·유사 회차
2. 교재·단원별 — 학년 → 대단원 → 소단원 → 세부유형
3. 유형별 — 풀이 구조, 핵심 조건, 그림 구조, 정답 유일성 규칙

Academy names are visible in our library, exam title, bank filter, and diagnostic report. Each academy resolves to a separate evaluation profile. The shared responsive/A4 shell does not make the paper structure, duration, difficulty curve, report axes, or cutoff policy identical.

The question registry itself is shared across academies. One approved question keeps one ID and lineage when reused in another compatible form. Academy blueprints select from the shared registry; they do not create academy-specific copies. Every reuse reruns curriculum, notation, difficulty, placement, scoring, and visual checks, and never inherits another exam's cutoff.

For Hwangso high-school selection, the private Hwangso middle-school textbook collection is the first type-reference source because the selection scope is middle-school cumulative. Older or discontinued materials remain reference-only until their terminology, symbols, and scope are cross-walked to the 2022 revised curriculum.

## 1. Register identity and curriculum

Use `data/question-bank-core.js` to derive a stable neutral ID from an opaque registry key. The returned ID contains only an entity prefix, a mode code, and a deterministic digest. Registry keys must not be copied into published records.

Every question has the complete hierarchy:

```text
grade -> major -> minor -> detail
```

Each node uses a stable neutral code. `createCurriculumPath` produces the canonical path key and `validateCurriculumPath` rejects missing, orphaned, malformed, or mismatched nodes.

## 2. Reference protected source assets

`data/source-lineage.js` represents an original or derived item without copying its content:

```text
sourceAssetId + sourceFingerprint + pageNumber + itemLocator and/or bbox
assetVariant = original | twin | similar
deliveryPolicy = signed-page-images
```

`sourceFingerprint` is a SHA-256 content fingerprint and `bbox` uses normalized page coordinates. URL, URI, PDF URL, download URL, and filesystem path fields are rejected. A source reference is resolved only by an authorized server.

`shared/source-asset-security.js` binds the reference to the existing student/exam-specific signed raster manifest validation. It requires the same source ID, fingerprint, and source page number, a short expiry, an approved image host, and an image MIME type. Direct PDF delivery is rejected by the shared manifest policy.

## 3. Record provenance and answer review

Provenance contains only `role`, workflow `status`, and a neutral source reference ID. Any sensitive locator belongs in a separate access-controlled source registry. Answer verification contains only `status` and `reviewCount`; answer material remains in the protected grading service.

Status changes must follow `canTransition`. A provenance record must reach `audited` or `cleared`, and answer verification must reach `verified`, before release eligibility.

## 4. Classify generation, variants, and lineage

Select one input type and one generation kind (`parameterized`, `bespoke`, or `figure_only`). Link lowered, standard, and raised variants through the same neutral family ID while keeping each variant's own neutral question ID.

Every bank item also records a neutral lineage:

```text
sourceExamId -> originalQuestionId -> questionTypeId -> questionId
relation = original | twin | similar
```

For an original, `questionId` equals `originalQuestionId`; a twin or similar item must point to a distinct original. The asset variant must match the lineage relation, and the variant family ID must equal the original question ID. This preserves round-to-item-to-type ancestry without publishing source content.

Before a generator is written, every source item records its givens, asked value, solution flow, answer class, visual structure, and difficulty rule. A type is split when the visual structure, asked quantity, solution flow, or uniqueness condition changes. One trusted data object must generate the prompt, visual, answer, solution, reference, and difficulty variant together.

## 5. Run deterministic gates

`shared/question-bank-validation.js` evaluates gates in this fixed order:

```text
identity -> curriculum -> metadata -> provenance -> source lineage
         -> answer verification -> single answer -> figure visibility
         -> user approval -> release
```

The single-answer hook receives trusted internal metadata and returns only `validOutcomeCount`, `status`, and an optional neutral `evidenceCode`. An enumerator may inspect candidates internally, but the persisted audit result must contain no candidate or answer values. The gate passes only when the count is exactly one.

Figure questions require all four checks: visible evidence, constrained hidden state, unambiguous position, and sufficient contrast. A failed check requires revision or exclusion; it cannot be waived by explanatory text.

User approval stores only a neutral approval ID, question ID, status, decision version, and reviewer `T`. Only `approved` passes; pending, rejected, or revoked records block release.

## 6. Assemble an exam

`shared/exam-assembly.js` rejects an assembly when a question fails a gate, IDs repeat, a variant family is overused, mode or writer differs, points do not match, or configured count and distribution limits fail. Supported constraints cover:

- total question count and points;
- min/max by difficulty band and input type;
- maximum figure count;
- maximum uses of a variant family or curriculum detail;

The duplicate rule is scoped to one assembled form. An approved original question may be reused in another exam form or another compatible academy blueprint when its curriculum scope, difficulty, points, notation, and placement constraints all pass again. Cross-form reuse keeps one question ID and lineage; it does not copy the source record or inherit the first form's cutoff. Exact duplicates inside one form and immediate repeats inside one practice set remain blocked.
- min/max by lineage relation.

At least one `original` item is required by default, so an exam cannot be assembled entirely from twins or similar items. The minimum can be raised for a specific blueprint but cannot be negative.

The result is a deterministic issue list plus aggregate counts. Only an assembly with `eligible: true` may proceed to the existing approval and release process.

## 7. Generator and release audit

- lowered, standard, and raised each receive at least 1,000 deterministic generation trials before release;
- every generated candidate runs exhaustive uniqueness and an independent answer check;
- formulas, tables, graphs, nets, and solid geometry use their dedicated visual/math audit;
- PC, phone, and A4 rendering are inspected separately;
- answers and solutions never appear in the student prompt payload;
- only `sourceMatched:true` and `verified:true` items can open;
- unresolved, stale, or draft items stay visible as locked metadata, never as a released question.

The private source-memory guide `method-premier-question-bank-guide-v1` is the evidence source for this workflow. Its file path and original source assets stay outside the public repository.

## Verification

From `repo/highschool-selection`, run:

```text
node --test tests/*.test.cjs
```
