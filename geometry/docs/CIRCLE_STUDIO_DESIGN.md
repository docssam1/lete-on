# Circle Studio Design

Date: 2026-09-09. Implementation and local verification complete; publication remains a separate gate.

## Task and Evidence

Learner stage: `초등 도형 · 원의 중심, 반지름, 지름과 원 그리기`.
Prerequisites: grid points, length units cm, doubling and halving even whole numbers.
The user authorized continued original geometry learning development, independent QA and release. Hourly automation remains cancelled.

The existing source review identifies Fields course 2 G2 unit 3 printed page 70 as a curriculum-level circle-construction candidate. This is not a claim of item equivalence or a new visual inspection of that private original. The nearest source-memory metadata query found no exact circle-construction record. Current geometry files contain no competing circle learning module. The public teaching reference below was checked directly; search snippets alone were not accepted as verification.

Public primary teaching reference checked: [KOSAC-hosted Grade 3 supplementary learning PDF](https://cdn.kosac.re.kr/files/cms/attach/202601/59a5b875f2f84f2cb4076941707f46d8_1769579328045.pdf), printed pages 111-112 (PDF pages 112-113). The text and both actual page renders were inspected on 2026-09-09. It connects understanding circle elements, the diameter/radius relation, and compass drawing. This supports the learning scope, not reproduction of its activities or a claim that every authored item is a national-curriculum requirement. The reference PDF and page renders stay in ignored QA storage, never public runtime assets.

No copied textbook problems, source images, private paths, learner records or official assessments are used. The following original bank teaches elementary circle properties, not circumference, area, pi, equations, tangency or formal loci.

## Learning Domains

Each domain has 20 immutable original problems and uses stable IDs `circle-{domain}-{01..20}` with zero-based `index`. Games use five problems per visit. Worksheets share the same IDs, allow 1-20 questions, and default to an authored cover and 20 questions with separate domain pages.

1. `center`: An unmarked circle on a fixed 7 by 7 grid. Choose its center. No center mark or radius appears before an attempt is accepted.
2. `parts`: Four separate circle diagrams A-D show one segment each. Select every diagram whose segment is the requested radius or diameter. Exactly one or two diagrams fit. Multiple selections are required where appropriate; no single-most-specific shortcut. A radius has one endpoint at the center and the other on the circle. A diameter has both endpoints on the circle and passes through the center. Short radial segments and off-center chords are not accepted.
3. `measure`: The given radius or diameter length is labeled in cm. Find the other length, using whole-number radii 1-10 and even diameters 2-20. The two quantities are not mixed with measuring a scaled drawing with a ruler.
4. `draw`: On a fixed 7 by 7 grid, a given point O and target radius in cm define one circle. The learner pins the compass center, sets its opening to 1, 2 or 3 grid units, then turns it to trace the circle. The radius stays fixed during the turn. Grading checks the chosen center and radius, not motor precision. Any changed center or opening clears the old trace. A print learner uses a compass; the grid step is exactly 10 mm in A4 output.

## Shared Model and API

Core exports `learner_stage`, `domains`, `problemsFor`, `answerFor`, `grade`, `promptPartsFor`, `promptFor`, `hintFor`, `solutionFor`, `optionLabels` and `segmentKind`.
All problem fields are structured; no geometry is recovered by parsing prose. `p.size=7`.

- center/draw: `p.center=[x,y]`, `p.radius` integer 1..3. The circle fits 0..6 on both axes. `answerFor(center)` returns `[x,y]`; `answerFor(draw)` returns `{center:[x,y],radius:n}`.
- parts: `p.center=[0,0]`, `p.radius=5`, `p.target='radius'|'diameter'`, `p.segments=[{id:'A'|'B'|'C'|'D',start:[x,y],end:[x,y]}]`. Integer endpoints are used; `segmentKind(segment,center,radius)` returns `radius`, `diameter` or `other`. `answerFor` returns a nonempty ID set.
- measure: `p.center=[0,0]`, `p.radius` integer 1..10, `p.given='radius'|'diameter'`. `answerFor` returns the other length as a number. The renderer labels the given segment only before reveal.
- `grade(p,response)` returns `{valid,correct,kind}`. It rejects malformed data. The parts response is an unordered nonempty set of unique A-D IDs. Measure accepts only finite whole numbers as numbers, not coerced arbitrary strings.
- `promptPartsFor(p,lang)` returns `{question,conditions:[strings]}`. `promptFor` is a combined equivalent. All four languages ko/en/zh/ja are present from the outset.

## Rendering and Interaction

One renderer is shared by game and worksheet: `renderProblem(p,{lang,reveal=false,interactive=false,selectedPoint=null,selectedIds=[],construction=null,traceProgress=0})`.
It returns standalone SVG with viewBox `0 0 400 400`. Grid coordinates map to `[32+56*x,32+56*y]`. A fixed equal scale prevents ellipse distortion. Parts uses four equal inset circles, not an overloaded circle with crossing candidate labels. Measure omits the grid and exposes a labeled given radius/diameter, with the requested value absent until reveal.

`construction={center:[x,y],radius:n}` describes an actual learner attempt, including wrong attempts. It is never replaced by the expected circle before grading. The renderer shows the chosen center and arm; only `traceProgress>0` exposes the traced arc. A complete trace has progress 1. Draw reveal may use the expected construction only in an explicit answer view.

Use native checkbox selection, a numeric input for length, grid points with roving keyboard focus, and an integer stepper for compass opening. An icon command starts the visible fixed-radius sweep after a center is chosen; reduced motion performs the same ordered state change without animation. Do not count a draw answer before a trace is complete. Undo/reset/language/next preserve or clear state deliberately. Worksheet draw pages are answer-free and show only given O, grid and the target radius in text.

## Required Gates

- Source/scope: no competing module or copied private material; record primary reference limitations.
- Mathematics: independent answer oracle, every 49 candidate centers and every 147 center/radius construction per draw problem; all 15 nonempty parts sets; numeric malformed and boundary cases.
- learner-fit: record this exact learner_stage and language, representations, prerequisites, reasoning-load, response-mode.
- Instructional sequence: center before opening/trace, constant radius throughout the turn, no completed circle before tracing; changes clear old trace; reduced-motion equivalent.
- Observability: all labels and endpoints visible; true circle aspect ratio; no answer-bearing center/radius mark in center questions.
- Game: every bank item, PC/mobile, four languages, touch/keyboard, negative answers, storage preservation, offline.
- Worksheet: same bank, stable ordering, max20, cover, measured 10 mm grid, A4/PDF, all languages, student/answer states.
- Regression and release: existing Geometry routes, scoped diff, actual deployment success and live source/behavior read-back.

## Local Verification

Independent checks passed for 215,475 segment cases, 980 center responses, 2,940 constructions, all nonempty parts response sets and numeric boundaries. The renderer passed 640 static states, 3,500 constant-radius construction beats, 1,960 candidate controls and three deliberately corrupted negative controls. Game checks covered 160 complete flows, four languages, desktop/mobile, actual animation, interrupted/reset traces, reduced motion and profile preservation. A restoration-event regression was independently checked; actual browser BFCache navigation was not verified.

The final worksheet produced 36 PDFs totaling 324 A4 pages. All pages were rasterized; 568 numbered questions and diagram crops passed. Actual PDF vector coordinates gave grid spacing 9.999486-9.999522 mm across 288 measurements. Game/worksheet runtime hashes are recorded in ignored QA reports. Original source images are not release assets. Final publication requires the live read-back checks described above.
