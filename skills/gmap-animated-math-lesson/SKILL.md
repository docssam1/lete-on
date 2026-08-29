---
name: gmap-animated-math-lesson
description: Design, implement, or review G·MAP math lessons that synchronize narration with semantic diagrams, object-level highlighting, full playback, step-by-step study, and teacher evidence. Use for concept lectures and verified problem explanations; do not use it to transcribe or publish uncleared source material.
---

# G·MAP Animated Math Lesson

Build one mathematically verified lesson model, then project it into full-play, step-by-step, final-overview, and teacher-evidence views. Treat animation as an explanation system: every spoken mathematical reference must point to the exact object being drawn, moved, counted, or highlighted.

## Establish the Evidence Boundary

- Classify the lesson as an original concept, an original problem, a licensed source problem, or a private review.
- Keep private or uncleared contest scans outside public skill examples and public site assets. A public lesson may use an independently authored equivalent concept, but never imply that it is the original contest item.
- For a source problem, compare its wording, conditions, diagram, choices, and official answer before authoring the lesson. Record discrepancies as blockers.
- Verify the answer independently. Lock publication when the answer is not unique, the source is incomplete, or the diagram cannot be matched reliably.

## Build the Semantic Scene

1. Choose the closest deterministic archetype from [references/archetypes.md](references/archetypes.md). Combine archetypes only when the mathematics requires it.
2. Read [references/scene-contract.md](references/scene-contract.md) and create a scene manifest before styling the page.
3. Give every meaningful point, segment, angle arc, equal-side mark, bar cell, equation term, count group, label, and answer object a stable ID.
4. Write narration in short beats. Each beat must name its `targetIds` and describe explicit actions such as `draw`, `reveal`, `move`, `highlight`, `count`, or `transform`.
5. Keep problem display, reasoning, and answer reveal as separate phases. Do not reveal an answer object before the declared answer beat.
6. Derive full playback and step-by-step study from the same ordered beat list. The final overview may show the accumulated reasoning without replaying every transition.

Start from [the complete bar-model example](examples/common-total-ratio.scene.json) for ratio lessons or [the geometry example](examples/isosceles-angle.scene.json) for angle lessons.

## Render for Learning

- Render mathematical objects deterministically with HTML, SVG, Canvas, or an existing geometry engine. Use a generative model for wording or planning only after the mathematical object model is fixed.
- Make the active target unmistakable using at least two cues when possible: color plus stroke, glow, motion, label, or spoken name.
- Preserve the full problem above or beside the lesson stage. On mobile, keep controls and current narration visible without hiding the mathematical focus.
- Provide `Play/Pause`, `Replay`, `Previous`, `Next`, a progress indicator, a visible transcript, and a no-audio path.
- Browser speech synthesis is acceptable for a zero-cost preview. Use approved recorded audio only when stable pronunciation and phrase timing are required.
- Respect `prefers-reduced-motion`; replace travel and morphing with immediate state changes while retaining highlights and narration.
- Keep the final answer visually restrained until its answer phase. For single-answer student views, show only the one verified answer.

## Verify Before Release

Run the deterministic validator:

```bash
python scripts/validate_scene_manifest.py path/to/lesson.scene.json
```

Then verify all of the following with the actual rendered page:

- source or authorship boundary is truthful
- independent mathematics and answer uniqueness pass
- every beat target exists and is visibly highlighted
- full-play and step modes use the same beat order
- narration, diagram state, and equation state agree at every beat
- desktop and narrow mobile layouts have no clipping or horizontal overflow
- keyboard controls, focus, transcript, muted use, and reduced motion work
- teacher evidence names the source check, math check, and remaining lock reason

Set `review.status` to `approved` only after source, math, unique-answer, visual, and mobile checks are true. A generated file or passing syntax check alone is not completion.
