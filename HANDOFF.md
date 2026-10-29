- **유아 2차 디자인 패스 + R0 배너** (9bfc0815) — 오답 소리·😅표정을 공용 shake()
  한 곳에 연결(유닛 id N-* 게이트 — young 밴드는 A-*에도 걸려 과적용 위험), 색 대비
  30화면 스캔 후 8건 토큰 보정, young 밴드 공통 UI 확대(.nm-back은 유닛 바 스코프),
  N-15 최초 완료 시 R0 추천 오버레이(1회성·잠금 없음, S.seenR0Banner).


## 2026-10-30 private R6 workbench source repair

The private R6 teacher workbench generator was updated and rebuilt locally. Source fixes cover native button-group semantics, focus visibility/clipping, disclosure markers, English language tags, mobile instruction copy, short-viewport scrolling, long-string wrapping, and print generation on `beforeprint` with clearer non-distribution marking and pagination rules. Inline JavaScript syntax check passed. The private manifest now correctly marks rendered browser and current A4 visual QA as pending; Oct 29 browser/PDF captures are stale for R6.

Claude Max Opus UI-source review was attempted using sanitized HTML/CSS only (no candidate data). The first CLI call returned `Execution error`; a retry produced no output and was interrupted. No AI UI-review approval is claimed. R33 applies to the separate pilot-plan text only. Candidate content remains private and locked. Next work is still inspection of current R6 at desktop/390px and a fresh A4 export; the browser rejected the private `file://` route, so use user-supplied captures/PDF rather than a workaround.


Historical R4 desktop/390px screenshots were re-opened for reference. They show the intended list/preview flow but predate R6 and do not count as current visual QA. The old screen-visible watermark has been made print-only in source. Current browser/A4 evidence remains outstanding.

## 2026-10-30 roadmap and contest feature audit

Current source evidence: the roadmap's grade comparison places two grade-plan examples side by side and labels Grade 9 as inferred; it does not compare a learner's measured score/grade or assign placement. The competition-paper review accepts manually entered O/X/blank marks and optional domain/error labels for an already-scored external paper. It reports raw counts and cautious within-paper review cues; it has no answer key, official score, readiness/award/AIME estimate, learner history, or automatic course decision. The Grade 6 AMC 8 set remains topic practice, while the separate private Grade 7 42-candidate set remains locked pending human review and pilot approval.

Verification on 2026-10-30 with the bundled Mac Node runtime: roadmap and paper-review core tests passed 8/8. The associated browser test files could not load because `playwright` is not installed in this checkout; no browser-test pass is claimed. Current private R6 visual browser/A4 QA also remains pending under the recorded CUA security restriction.

## 2026-10-30 Grade 7 NS.A private-draft recheck

The external-root Grade 7 NS.A preflight was rerun against the existing private 18-slot pack: 14 automatic and 4 teacher-reviewed items; state remains `draft-pending-independent-review`, delivery locked, and both independent approval and mathematics verification false. Its separate exact-rational checker matched all 18 slots, the immutable plan contract, and three asset mappings. These are local structural/calculation checks, not independent human item review, rights approval, or release authorization. The Oct 29 revision-11 rendered QA notes remain current: initial 320px number-line arrows require horizontal pan; some asset typography and printed label alignment need review; the dense repeating-decimal prompt needs a separately reviewed content revision if changed. No candidate wording/assets changed during this recheck.

## 2026-10-30 Grade 7 AMC workbench R3–R5 continuation

The private R6 teacher workbench received a second source-only repair pass using Claude Code CLI authenticated with the existing Claude Max subscription (Opus; no separate metered API call). R3/R4 findings were applied to keyboard focus, full-form PDF generation, truthful draft/distribution wording, bilingual answer display, normalized multi-term search across stems/options/axes/difficulty/tags, Korean IME behavior, list instructions, data/order integrity checks, and print verification notes. Candidate content and answer order were not changed. Private generator and generated inline-runtime syntax checks pass; source assertions pass. The sanitized R5 Opus review is pending. Current browser/A4/assistive-technology visual verification remains pending because the private `file://` page was rejected by browser security; prior captures are stale for current R6. Candidate items remain private and unavailable for student administration. Public product capability remains unchanged: no student diagnosis/readiness/grade placement claim is implemented or approved.
