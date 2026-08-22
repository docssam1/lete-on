# SH-R01 review-only inventory

> 최신 상태: 이 파일이 설명하는 공개 inventory는 초안 이력과 중립 라우팅을 보존하는 불변 review-only 자료다. 실제 운영 승격 판단은 별도의 보호 `rv-20260822-fastlane-v2` 상태 패킷에서 40문항 모두 검증 완료되었고, 현재 남은 게이트는 시험 1회 전체 최종 확인뿐이다. 공개 inventory의 `draft` 값을 운영 미검수로 해석하거나 released 데이터로 직접 바꾸지 않는다.

`data/review-only/sh-r01-inventory.js` is a public routing inventory, not an approved question bank and not a response schema. It converts the 40-row audit draft into metadata that can be reviewed one item at a time without publishing source questions, answer values, solutions, or storage locations.

## Public fields

Each item contains only:

```text
id, number, sourcePage
curriculumCandidate = { code, label }
majorCandidate = { code, label }
detailCandidate = { code, label }
responseCandidate
answerStatus = found/pending
classificationStatus = draft | verified
resolutionStatus = pending
lineageRef
```

The inventory also carries `releaseBlockerSummary`, `agentDecisionSummary`, and `classificationReviewSummary`. The seven original release blockers are Q3, Q4, Q8, Q10, Q11, Q34, and Q39. Their answer values, formulas, and source locations are not present here. The agent decision is fixed as follows:

- Q3: replace with a verified same-type, same-difficulty item. The private replacement audit is complete.
- Q4: keep the problem and correct the protected answer key.
- Q8, Q10, Q11: keep the problems and use independently verified protected answers.
- Q34: keep the problem and correct only the solution typo.
- Q39: keep the problem and values and correct only the table layout.

All seven protected correction artifacts have matched their private fingerprints. Q3 is `executionStatus=replacement_verified`; Q4, Q8, Q10, Q11, Q34, and Q39 are `executionStatus=agent_verified`. Their values and fingerprints remain outside the public repository. Every operational row must still complete the common answer, classification, visual, source-fingerprint, scoring, print, and signed-asset checks.

`classificationReviewSummary` reports 40 candidate rows, 28 previously high-confidence rows, and 12 delegated rows that were checked against the matching source render and fixed as `classificationStatus=verified`: Q2, Q6, Q9, Q14, Q18, Q21, Q23, Q24, Q27, Q28, Q29, and Q36. Their classification review state is `agent_verified`; `ownerReview=0`. The only remaining user confirmation scope is the complete round, so `finalExamConfirmation=pending` is retained until all answer, visual, fingerprint, and correction gates are complete.

The final classifications preserve `EXT` when the primary solving structure is outside a direct middle-school achievement standard. Q2, Q18, Q21, Q23, Q24, Q27, Q28, Q29, and Q36 are explicit extensions. Q6, Q9, and Q14 remain cross-unit `LINK` classifications. Source comparison corrected Q24 and Q29 from an unverified similarity/Pythagorean emphasis to triangle-area reasoning; no source wording or answer value is stored here.

`lineageRef` contains neutral source-exam, source-asset, lineage, original-question, and question-type IDs with `relation=original`. The shared source asset ID is only a future join key for the private source registry; it is not a file locator and does not authorize access.

Curriculum, major, detail, and response values outside the 12 delegated rows remain candidates in this historical public inventory. Their protected operational counterparts were later verified in the v2 status packet. The 2022 curriculum audit refreshed Q5, Q6, Q14, Q21, Q22, Q25, Q26, Q31, Q32, and Q39; the response-shape audit refreshed Q35 to `unordered_set`. `sourcePage` is limited to the problem pages 1–8 and does not identify any private file.

## Promotion boundary

The public inventory is permanently review-only. `evaluateReviewGate` always returns `canAssemble=false` and `canRelease=false` while the records remain `found/pending`, `draft`, and `pending`.

For production promotion, an authorized reviewer must create a separate protected record for every item and complete all existing gates:

1. bind `sourceAssetId` to a fingerprinted private asset;
2. independently verify the answer without publishing its value;
3. confirm the curriculum hierarchy and response type for all rows not covered by the 12 agent-verified decisions;
4. complete single-answer and, when applicable, figure visibility audits;
5. record `agent_verified`, `replacement_verified`, or a verified `scoring_excluded` disposition;
6. match any protected correction artifact fingerprint without exposing the fingerprint in a public status packet;
7. run exam assembly validation and request one final whole-exam user confirmation.

SH-R01 no longer asks the user to approve 40 items individually. Agent verification resolves the items; the user confirms the completed exam once at the end. If an item cannot be verified, the only safe paths are a verified replacement or an explicit scoring exclusion. Guessing an answer is never a release path.

Do not mutate this public inventory into released data. Approved records belong in the protected operational store. `data/questions.js` remains empty so neither these candidates nor a response schema reach the student bundle before release.

## Test

From `repo/highschool-selection`:

```text
node --test tests/sh-r01-review-inventory-v2.test.cjs
node --test tests/sh-r01-release-gate.test.cjs
```
