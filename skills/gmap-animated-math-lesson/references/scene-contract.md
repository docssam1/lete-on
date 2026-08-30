# G·MAP scene contract

Use this contract when a lesson needs synchronized narration, object-level animation, or more than one presentation mode.

## Top-level fields

- `schemaVersion`: currently `1`.
- `lessonId`, `title`, `language`, `audience`: stable lesson identity and delivery context.
- `rights`: publication boundary and asset provenance.
- `problem`: displayed prompt, response type, verified answer, and answer reveal beat.
- `scene`: logical coordinate system. Use a fixed view box and scale responsively.
- `objects`: semantic drawing ledger.
- `beats`: canonical ordered explanation.
- `modes`: projections of the canonical beats.
- `mathChecks`: independent calculations or enumerations.
- `review`: release gate.

## Rights contract

For a public lesson, set `assetRights` to `original`, `public-domain`, or `licensed`. If `containsThirdPartyAssets` is true, include a concrete `licenseEvidence` string. Keep an uncleared original scan in a private lesson and do not embed its path or contents in a public manifest.

## Object contract

Every mathematical object needs a stable `id`, a semantic `type`, and a logical `frame` with `x`, `y`, `width`, and `height`.

Use `role: "answer"` on final-answer objects. Common object types include `problem-text`, `point`, `segment`, `angle-arc`, `equal-mark`, `bar-model`, `bar-cell`, `shape-count`, `equation`, `term`, `label`, and `answer`.

`bar-model.data.units` is a numeric list whose sum must equal `expectedTotal`. `shape-count.data.groups` contains named counts whose sum must equal `expectedTotal`.

## Beat contract

Each beat contains `id`, `phase`, `narration`, `durationMs`, `targetIds`, and one or more `actions`. Phase is `problem`, `explore`, `solve`, `answer`, or `recap`.

Supported action verbs are `draw`, `reveal`, `move`, `highlight`, `count`, `transform`, `clear-highlight`, and `reveal-answer`. An action can target several IDs when the narration refers to a group.

The answer object cannot be targeted before `problem.answerRevealBeatId`. The answer beat must use `phase: "answer"` and include `reveal-answer`.

## Mode contract

`fullPlay.beatIds` and `stepByStep.beatIds` must exactly match the canonical beat order. They differ only in playback control. `finalOverview.visibleObjectIds` names the accumulated reasoning that remains visible. `teacherEvidence` can add source, verification, misconception, and teaching notes without changing student mathematics.

## Review states

Use `locked` while any required evidence is missing and include `lockReason`. Use `approved` only when `sourceChecked`, `mathChecked`, `uniqueAnswerChecked`, `visualChecked`, and `mobileChecked` are all true.
