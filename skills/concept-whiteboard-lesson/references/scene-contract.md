# Scene contract — deltas from G·MAP

The base contract is [`gmap-animated-math-lesson/references/scene-contract.md`](../../gmap-animated-math-lesson/references/scene-contract.md): `objects` with stable ids and semantic types, an ordered `beats` list with `phase`/`narration`/`targetIds`/`actions`, `modes` projecting those beats, `rights`, and a `review` gate. Its validator (`scripts/validate_scene_manifest.py`) checks the structural rules and should be run unchanged.

This file records only what a **concept whiteboard lesson** adds or changes.

## Added: `family`

The scene declares which motion family it belongs to (see [motion-families.md](motion-families.md)). The validator uses it to select the conservation law to check.

```json
"family": "group"
```

## Added: `source`

Where the numbers came from, so the picture can be checked against the problem rather than trusted.

```json
"source": { "generator": "comp100", "field": "scene", "seed": "…" }
```

Coordinates are **never** authored here. They are computed by the renderer from the model. A manifest containing hand-placed coordinates is rejected on review.

## Changed: beats default to construction

G·MAP allows `draw`, `reveal`, `move`, `highlight`, `count`, `transform`, `clear-highlight`, `reveal-answer`. All remain valid, but for a concept lesson:

- **`draw` is the default verb.** `highlight` presumes the object was already on the board — the failure mode this format exists to avoid. Use it only when the point genuinely is "look again at what we built".
- **Exactly one object is newly drawn per beat.** This is both the pedagogy (order is the content) and the mechanism for the 시선 gate. A beat that introduces two things is a defect.
- **A beat that only re-styles existing objects needs a reason.** State it in the beat's note.

## Changed: `narration` is multilingual and is also the caption

G·MAP treats narration as spoken text. Here it is the **source artifact** — caption, printed explanation, and spoken string at once — and carries every shipped language:

```json
"narration": { "ko": "…", "en": "…", "zh": "…" }
```

See [narration-and-voice.md](narration-and-voice.md) for the voice tiers and why recordings are keyed by text, never by id.

## Added: `finalStill`

Print has no animation. The manifest names the object set that must remain visible in the last frame, and that frame must explain the strategy on its own.

```json
"finalStill": { "visibleObjectIds": ["…"], "standsAlone": true }
```

`standsAlone` is set by a human who looked at the printed page — it is not inferred.

## Changed: review gate

G·MAP's gate requires `sourceChecked`, `mathChecked`, `uniqueAnswerChecked`, `visualChecked`, `mobileChecked`. A concept lesson adds three, all defined in [verification.md](verification.md):

- `pagedChecked` — real A4 output inspected, final still stands alone
- `gazeChecked` — one newly drawn object per beat, judged by eye and reported per beat
- `negativeControlChecked` — each check was broken deliberately and observed to fail

`approved` requires all eight. Anything missing means `locked` with a `lockReason`.

## Worked solutions use this same contract

A 풀이 is the same strategy on specific numbers, so it is the same manifest shape with `beats` derived from the generator's `steps` rather than from a unit's scene model. It carries `family`, `source`, multilingual `narration` and `finalStill` exactly as a concept lesson does, and it is gated on the same eight checks.

Authoring cost per problem is zero — the steps already exist. The only lesson-level decision is when the control unlocks, which is **after the learner has been wrong once**, on screen only.
