---
name: concept-whiteboard-lesson
description: Build animated math lessons that teach by drawing a procedure in order on a blank board, narrated in every shipped language with subtitles as the source. Covers 개념 strategy units, symbol introductions, and 풀이 보기 worked solutions — anything where the order of construction is the content. Scenes derive from generator data with computed coordinates; lessons ship only after PC, mobile and paged A4 output, picture-matches-problem, one-place-to-look, single-answer and negative-control checks all hold.
---

# Concept Whiteboard Lesson

A concept lesson is not a finished diagram with parts highlighted. It is a **blank board that fills in, one thing at a time, in the order the strategy is actually performed.** The order is the content. If a child sees the completed picture and watches colors turn on, they learn the result; they do not learn what to do next.

This skill merges two earlier ones:
- **`english-math-whiteboard-lesson`** — the teaching form: progressive construction, narrated in step order.
- **`gmap-animated-math-lesson`** — the engineering: a semantic scene manifest with stable object IDs, an ordered beat list, a rights boundary, and a release gate.

Take the pedagogy from the first and the discipline from the second. `gmap-animated-math-lesson` stays in service for lessons built on its own published format; use this skill for anything where a procedure is performed in order, which includes worked solutions.

## Decide the lesson is in scope

Use this skill when the thing being taught is a **procedure with an order**: 짝을 찾아 묶기, 한쪽에서 빌려 이사시키기, 자릿값으로 쪼개기, 자리를 옮기고 보정하기, 두 표기를 나란히 놓기. Do not use it to narrate a static fact.

**Two surfaces, one machine.** A 풀이 (worked solution) is the same strategy performed on specific numbers, so it is built the same way and animates the same way — the generator's own `steps` become the beat list, and no new authoring is required per problem.

| | 개념 | 풀이 보기 |
|---|---|---|
| taught with | the unit's strategy, generic numbers | this problem's actual numbers |
| beats from | the unit's scene model | the generator's `steps` |
| authoring cost | per unit | **zero** — steps already exist |

**When 풀이 보기 opens: after the child has been wrong once.** Not before. A button visible from the start gets pressed instead of thought about; opening it on a timer rewards waiting. One wrong attempt is the moment the child actually wants the explanation, and it is the moment the explanation is about *their* mistake. It is a screen affordance only — printed sheets already ship a separate answer key.

## Build the scene from data, never from prose

The problem generator already computed the moving parts. Read them; do not restate them.

- Generators that expose named semantic fields (`{nums, sum, target}`, `{a, b, need, rest}`, `{a, b, rest, comp}`) are ready to use as-is.
- Generators that expose only `steps:[{tex, blank}]` hide their operands inside TeX strings. **Never parse TeX** — a notation change breaks it silently. Add a `scene:{}` field to the generator instead: it re-exports locals already computed, is purely additive, and must leave the existing return value, answer and print output untouched.

See [references/motion-families.md](references/motion-families.md) for the eight families and which generators belong to each.

## Draw, don't decorate

1. **Compute every coordinate from a point/segment model.** No eyeballed numbers in the SVG. Reuse the existing renderer — in this repo that is `geometry/worksheet/render.js` (`GW_RENDER`): DOM-free string builders, `project()` for coordinates, `polygon()` over a point list, `fmt()` to bound precision. Extend it in the same style; if you add a helper, say why the existing ones did not serve.
2. **One thing appears per beat.** This is the whiteboard rule and it is also how you get a single place to look. If two things are drawn or emphasized at once, the child does not know where to look.
3. **Prefer `draw` over `highlight`.** Highlighting presumes the object was already there — which is the failure mode this skill exists to avoid. Reach for `highlight` only when the point genuinely is "look again at what we already built".
4. **The last frame must stand alone.** Print has no animation. When the final state is rendered as one still image, it must explain the strategy by itself, or the worksheet is worthless.

The beat and object contracts are G·MAP's; the deltas are in [references/scene-contract.md](references/scene-contract.md).

## Narrate in every shipped language, with subtitles as the source

**This skill is not English-only.** Author each beat's narration directly in every language the app ships — Korean, English and Chinese here — not as a translation pass. Subtitles are the source artifact: the same text is the on-screen caption, the printed explanation, and the string the voice layer speaks.

Voice is a **three-tier fallback, not "browser speech"**: a pre-rendered MP3 keyed by the exact sentence, else the Web Speech API at `ko-KR`/`en-US`/`zh-CN`, else silence. Default to authoring subtitles and shipping the free tier; promote a lesson to recorded audio only once its wording is settled, and never key recordings by id — text-keyed audio degrades correctly when a sentence changes, id-keyed audio contradicts the screen.

Voice is a toggle, never a dependency: every beat must be understandable with sound off, and beats advance on action or duration, never on audio ending. Full chain, tier-selection rules, and per-language line-breaking are in [references/narration-and-voice.md](references/narration-and-voice.md).

## Verify before calling it done

Passing checks are not the bar; **checks proven capable of failing** are. Details and the negative-control method are in [references/verification.md](references/verification.md).

Do not report a lesson as done until all five hold:

- **PC · mobile · A4.** All three, every time. A defect that appears only in paged layout is normal here — an equation frame landing on the page after its story, a card splitting at the break. Screens alone will not show it.
- **원본 구조.** The numbers drawn equal the generator's actual output, asserted across many seeds. A picture showing different numbers than the problem is a failure, not a rounding issue.
- **시선.** Exactly one place to look per beat. Judge this by eye from screenshots and state the judgment per beat — no assertion detects it.
- **단일 정답.** Where the screen asks anything, prove uniqueness by enumerating the answer space, not by asserting design intent. Textual instructions ("write them in order") do not bind; arithmetic does.
- **Negative control.** Break each check deliberately, confirm it fails, revert. A suite that cannot fail proves nothing.

## Rights

Follow G·MAP's evidence boundary unchanged: classify the source, keep uncleared originals out of public repositories and public manifests, and never imply an independently authored equivalent is the licensed original. Concept lessons are especially prone to this — a strategy is a shared idea, but a textbook's specific worked example and its wording are not.
