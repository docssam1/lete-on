Warning: truncated output (original token count: 33557)
Total output lines: 561

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 31 Mission 5: Area Independently Verified, Implementation Locked

- Re-read logical PDF page 27 / printed page 31 from the source PDF (SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`). Apple Vision OCR and the 450dpi close-up confirm the prompt asks for the area of △ㄱㄷㅁ when △ㄱㄴㄷ≅△ㄷㄹㅁ; the diagram marks ㄱㄴ=16cm and ㄹㅁ=8cm, with right angles at ㄴ and ㄹ. Crop `/tmp/gfield-grade52-u3-next/m5-zoom-v2.png` SHA-256 `2c1cc84ff1425cb12c6d6888e514bc1e1678caa387854c774612239ee1b95e3d`. Handwriting was excluded.
- Congruence order maps ㄱ↔ㄷ, ㄴ↔ㄹ, ㄷ↔ㅁ, so ㄷㄹ=ㄱㄴ=16 and ㄴㄷ=ㄹㅁ=8. Put ㄴ=(0,0), ㄷ=(8,0), ㄹ=(24,0), ㄱ=(0,16), and ㅁ=(24,8). Then `area(△ㄱㄷㅁ)=|det((8,-16),(24,-8))|/2=160cm²`. This is an independent reconstruction, not acceptance of the pencil’s written candidate.
- Updated the source calculation and counters (checked 47→48; source visuals needing confirmation 22→21). The item remains `review-locked`/`locked` until its generated figure, separated solution, and A4 print output are implemented and inspected. No student data or release state changed. Drive QA note: https://drive.google.com/file/d/1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s/view (read back).

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 31 Mission 3: Source Text Confirmed, Angle Still Locked

- Re-read logical PDF page 27 / printed page 31 from the SHA-256-matched original (`d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`). Apple Vision OCR and a 450dpi close-up confirm the prompt names equilateral △ㄱㄴㄷ and △ㄷㄹㅁ, gives ∠ㄴㅁㄷ=140°, and asks for ㉮. The render hash is `ce24f3c508c8e352bccac2d4e4e42f677f681046a3cdfbc5577ecd01b16b98e6`; close-up `/tmp/gfield-grade52-u3-next/m3-zoom.png` hash `b624b4ba42a6f1e52a7a37e2b7ddeabd276fea3adbf8421221f68ea2e962621f`.
- Pencil marks, including the written candidate, were excluded. The labels and given angle are now confirmed, but the scan does not conclusively establish whether ㄱ–ㄹ–ㅁ is intended as one straight line, and the ㉮ callout obscures the exact angle sector. No numeric answer or runtime mapping was added; the row remains `blocked-visual` / `review-locked`.
- Revisit with a cleaner publisher scan or a second source copy. Do not treat the pencil work as a key. Existing source PDF and student data are untouched.

# Elementary Question Bank Handover

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 4: Angle-Mark Location Corrected, Still Locked

- Rechecked the 450dpi source crop and a close-up around the 32° mark. The arc is at ㅈ between ㅈㅂ and ㅈㅅ, so the printed angle is ∠ㅂㅈㅅ=32°; it is not at ㅂ. The 46° is ∠ㅇㄷㄴ at ㄷ, and the right-angle mark is ∠ㅅㅈㅇ. Pencil writing was excluded.
- Since ㅂ, ㅈ, ㄷ are collinear, the printed marks establish ∠ㄷㅈㅇ=58°. That intermediate angle does not by itself determine target ∠ㅅㅇㅈ. A tempting 58° answer requires an unverified mapping between the original rectangle edge and the folded edge, so it was rejected pending a fold-by-fold reflection reconstruction. `independentAnswer` remains null, calculation remains blocked-visual, and the item remains locked.
- Corrected the readiness entry's angle vertex and updated the visual requirement. No runtime mapping, student data, or release state changed.
- Drive QA correction: https://drive.google.com/file/d/1osh1VOnzsLTye9PCydxk5P-z0FEPmRzx/view (read back). Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page image SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`; close-up SHA-256 `cb25cc092afd912b13eee7ab44b644b61e56cb7af8b9219632cd0067eba10c8c`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 6: Equilateral 5cm Transversal Angle

- Re-read logical PDF page 25 / printed page 29 from the SHA-256-matched original at 450dpi. Apple Vision OCR confirmed the question asks for ∠ㄱㅂㅁ in equilateral △ㄱㄴㄷ; the printed 5cm marks run from ㄴ to ㄹ on ㄴㄷ and from ㄷ to ㅁ on ㄷㄱ. The segments ㄱㄹ and ㄴㅁ cross at ㅂ. Pencil marks were excluded.
- With side length s>5, set ㄴ=(0,0), ㄷ=(s,0), ㄱ=(s/2,√3s/2), ㄹ=(5,0), and ㅁ=(s−5/2,5√3/2). The vector ㄹ→ㄱ rotates clockwise 60° to ㄴ→ㅁ. Their intersection parameters are t=25/D and r=5s/D, D=s²−5s+25; both lie strictly between 0 and 1, so the crossing is inside both segments. Therefore ∠ㄱㅂㅁ=60°.
- Updated the source-readiness proof and counters: calculation-checked 46→47, source-structure visual checks needed 24→23. Public candidates remain 23, locked items 30, non-unique 8. This is a source-side answer check only; implementation figure check is still pending, so the item remains review-locked. No learner-facing mapping, student data, or release state changed.
- Drive QA note: https://drive.google.com/file/d/18goPVPFZgxmFATf-w_BWzNwEt3yF-Mja/view (uploaded to the existing `.source-memory` folder and read back). Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 25 image SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 5: Equal-Offset Equilateral Triangle

- Rechecked logical PDF page 25 / printed page 29 at 450dpi. The printed text names equilateral △ㄱㄴㄷ and points ㅁ, ㅂ, ㄹ at equal distances from successive vertices on ㄱㄴ, ㄴㄷ, ㄷㄱ. The circled handwritten 60° was excluded.
- Let A=ㄱ, B=ㄴ, C=ㄷ and common offset d. The 120° rotation cycles A→C→B→A and maps ㅁ→ㄹ→ㅂ→ㅁ. Thus △ㅁㅂㄹ is equilateral, so ㉠=60°. A coordinate model with side 2 and d=1 independently gives three equal inner sides.
- Strengthened the readiness proof and added a focused calculation assertion. Existing status remains checked/public-candidate; counts remain 23 public candidates, 30 locked, 46 calculation-checked, 8 non-unique. No learner mapping or student data changed.
- Drive evidence: https://drive.google.com/file/d/1rNBPO8moU-Z7i4lsHFnba14Xb17Petql/view (content read back and verified). Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 25 render SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`; focused crop SHA-256 `c6baa815bce4b9fb7c768b0724ac3125b059cfa7a923fa141733fc88ba3e3a77`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 2: Square-Overlap Area Resolved

- Rechecked logical PDF page 25 / printed page 29 at 450dpi. The two square sides are 10cm and 14cm; the large square's diagonals mark its center C, which is a vertex of the small square. The 6cm dimension runs from the large square's upper-left corner to Q on its left edge. Handwritten circled work was excluded.
- Set the large square to [0,14]×[0,14] with top-left (0,0): C=(7,7), Q=(0,6). The small square's perpendicular side meets the bottom edge at P=(6,14). Vectors C→Q=(-7,-1) and C→P=(-1,7) have dot product 0 and squared lengths 50, so the overlap is a right triangle with area ½×√50×√50=25cm². Both legs are shorter than the small square side 10cm.
- Corrected the readiness row from `checked-nonunique` to `checked`, answer 25cm². No source-specific public generator exists yet, so keep it review-locked pending implementation-figure verification. Counts: 23 public candidates, 30 locked, 46 calculation-checked, 8 non-unique. No learner mapping, student records, release state, or deployment changed.
- Drive evidence: https://drive.google.com/file/d/1nYo-dub1uoTgR5e6t40KtyKKpGvwFNcC/view (uploaded to the existing QA folder; content read back and the `25cm²` result verified). Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 25 render SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`; focused Mission 2 crop SHA-256 `dd5ad1e5c409389d769af00503db510743dffba600b93ae1ab8f4c4d16bbc719`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 1: Corrected Source Conditions and Answer

- Re-read logical PDF page 25 / printed page 29 at 450dpi and compared Apple Vision OCR with the high-resolution figure. The prompt gives congruent isosceles triangles △ㄱㄴㄷ and △ㄹㄴㅁ, a printed 66° base angle, a printed 72° angle at their crossing ㅅ, and asks for ∠ㄱㄹㅅ. The previous ledger had mistakenly copied Mission 3's 65° and 45° rotation conditions into Mission 1.
- Independent chase: each original isosceles triangle has apex 48°. The linear pair to 72° is 108°, so △ㄹㄴㅅ gives ∠ㄱㄴㄹ=24°. Corresponding equal legs ㄱㄴ=ㄹㄴ make △ㄱㄴㄹ's base angles 78°. Subtracting △ㄹㄴㅁ's 48° apex gives ∠ㄱㄹㅅ=30°. Handwritten calculations and the circled handwritten 30° were excluded.
- Corrected the inventory conditions and answer to 30°. Keep the item locked pending implementation-figure verification. Counts: 23 public candidates, 30 locked, 45 calculation-checked, 9 non-unique. No student data, runtime mapping, release state, or deployment changed.
- Drive evidence: https://drive.google.com/file/d/1zNtIYqtPweo41VVVcY4gp9UkqcXWCeKv/view. Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 25 render SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`; OCR SHA-256 `9cc2f66e7ac99039cd5cd89fd8433bd529c188a96ec7db76b4bf63a5a92e7326`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 29 Mission 3: Rotation Angle Verified

- Re-read logical PDF page 25 / printed page 29 and used Apple Vision OCR plus a high-resolution crop. The source gives isosceles △ㄹㅂㄷ as △ㄱㄴㄷ rotated clockwise 45° about ㄷ, ㄱㄴ=ㄱㄷ, ∠ㄴ=65°, ㅁ=ㄱㄷ∩ㄹㅂ, and asks for ∠ㄷㅁㅂ. Handwriting was excluded.
- The equal sides make the original apex angle 50°. The rotation carries side ㄱㄴ to ㄹㅂ, so their angle with fixed line ㄱㄷ is 50°+45°=95° in the shown orientation. Independent coordinates place ㅁ inside both segments and compute the requested angle as 95°.
- Corrected the answer and source status, while keeping public release locked for implementation-figure verification. Counts: 23 public candidates, 30 locked, 46 calculation-checked, 9 non-unique. No student data, runtime mapping, release state, or deployment changed.
- Drive evidence: https://drive.google.com/file/d/12h10sOg4uZj0PugB1GNsebjJDtYW6BnD/view. Source PDF SHA-256 `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 25 render SHA-256 `dbe59d7a71d6aec2a7aa420cadb74e1aef72a52802540afd21435df6e1a3c604`; high-resolution crop SHA-256 `6ec11088b26a1a0cb2772934493c0180f39db74db6c60a849e6a740c58321a9b`.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 28 Example 3-4: Underdetermined Fold Angle

- Re-read logical PDF page 24 / printed page 28 from the SHA-256-matched original and ran Apple Vision on the prompt crop. It says to fold the rectangle so ㄱ moves to ㅁ, then fold so ㅁ moves to ㅂ, and asks for ∠ㅂㅇㄷ. The diagram marks 24° between the top edge and diagonal ㄱㄷ; ㅇ is the intersection of ㄱㄷ and ㅁㅂ. The handwritten 72° and nearby angle notes were excluded.
- The wording fixes the point correspondences but gives no fold-line location or additional location condition for ㅂ. For a coordinate counterexample, set rectangle height 1 and width cot24°, ㄱ=(0,1), ㄷ=(cot24°,0), and ㅁ=(1,0). The first fold ㄱ→ㅁ is possible across y=x. Choose ㅂ=(1.5, 0.5 tanθ); the second fold ㅁ→ㅂ is possible across the perpendicular bisector of ㅁㅂ. With θ=40° and 48°, both ㅂ points lie inside the rectangle and ㅇ lies on segment ㅁㅂ and diagonal ㄱㄷ, while ∠ㅂㅇㄷ is 64° and 72° respectively. This proves the stated conditions do not determine one numeric answer.
- Updated the readiness row to `checked-nonunique` and kept it locked. Source counts remain 23 public candidates / 30 locked; non-unique items rise from 8 to 9 and calculation-checked items from 43 to 44. No public mapping, release state, or student data changed.
- Drive evidence: https://drive.google.com/file/d/1-X8dd42E5ievBVx8dq1akhwRnVDnB5NK/view.
- Source PDF SHA-256: `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`; page 24 render SHA-256: `15db8d4817b6c5cf4e3c9aa9c501553227b33cb771e81910c37f96bc392136f4`; focused prompt OCR was generated from the same page render.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 28 Example 3-3 Underdetermined Angle

- Re-read logical PDF page 24 / printed page 28 at 450dpi, checked the exact prompt with Apple Vision OCR, and visually inspected a high-resolution crop. Handwritten ticks and answers were excluded.
- The source gives a right triangle, fixes vertex ㄷ, rotates in the indicated direction until ㄴㄷ is parallel to ㄹㅁ, and asks for ∠ㄷㅁㄹ. It supplies no acute angle, side ratio, or equality condition.
- Parameterized the right triangle with legs 1 and h. For both h=1 and h=√3 the construction can satisfy the printed parallel condition, while the requested angle differs (45° versus 30° or 60° according to endpoint correspondence). Corrected the prior 30° answer to checked-nonunique and locked the source row.
- Public-candidate/locked counts change from 24/29 to 23/30; non-unique count changes from 7 to 8. No runtime mapping, student data, or deployment state changed.
- Drive evidence: https://drive.google.com/file/d/1sT0W-X1Xk96z5XmpxOAKNevKJ7CX3zaL/view. Page 24 image SHA-256 15db8d4817b6c5cf4e3c9aa9c501553227b33cb771e81910c37f96bc392136f4; OCR SHA-256 74ecda62593e4f94cfecf3e38edc1663895151831cd795476c412b92dff6e173.

## 2026-10-24 Grade 5-2 Unit 3 Printed Page 28 Example 3-2 Geometry Correction

- Re-read logical PDF page 24 / printed page 28 at 450dpi and checked the …26557 tokens truncated…mple shape. Independently calculate the labeled point after every translation, reflection, or rotation, and keep every vertex inside the visible grid.
- Validate answers algorithmically and stress-test every generator before marking a type ready.
- For every graph, draw numeric tick labels and grid lines, use only values that are exact multiples of the stated tick step, state the tick step in the question, reverse-check plotted coordinates against the data, and confirm labels at 375px without clipping or overlap. Run `node graph-audit.js` whenever a graph generator changes.
- For cube stacks, 3D solids, holes, and folded paper, apply `GEOMETRY_VALIDATION.md`: enumerate all valid answer candidates, require exactly one, and reject views where required height, color, position, direction, or fold evidence is not visible or inferable.

## Completed Generator Groups

- Grade 4-1 unit 1: 66 source items, all 66 ready; exploration groups 1 through 6 have all source-native variants
- Grade 4-1 unit 2: 66 source items, 63 ready and 3 review-locked; angle exploration groups 1 through 4 have all source-native variants, group 5 publishes 9 and keeps 2 ambiguous items locked, and group 6 publishes 10 while keeping its contradictory Example 6-4 locked
- Grade 4-1 unit 3: 65 source items, 64 ready and 1 review-locked; multiplication exploration groups 1 and 2 and division exploration groups 3 and 4 each have 11 source-native variants. Division exploration group 5 publishes 10 source-native variants and keeps Example 5-2 locked because the official answer page has no numeric answer. Calculation exploration group 6 publishes all 10 source items; source example 6-4 does not exist
- Grade 4-1 unit 4: 44 source items, 35 ready and 9 review-locked; exploration group 1 publishes 10 source-native items and keeps ambiguous Mission 1 locked, exploration group 2 publishes 8 items and locks 3 ambiguous or contradictory items, exploration group 3 publishes 9 items and locks 2 ambiguous items, and exploration group 4 publishes 8 items while locking 3 source-answer conflicts
- Grade 4-1 unit 5: 22 source items, 18 ready and 4 review-locked; bar-graph exploration group 1 has all 11 source-native variants, and group 2 publishes 7 source-native variants
- Grade 4-1 unit 6: 66 source items, 63 ready and 3 review-locked; the public types use child-readable names and independent generators
- Grade 4-2 unit 1: fraction addition and subtraction, 66 source-backed types covering every exploration prompt, example, and Mission
- Grade 4-2 unit 2: triangles, all 44 source items mapped; 32 directly source-matched types ready and 12 locked for source-faithful rebuilding
- Grade 4-2 unit 3: decimal addition and subtraction, 26 source-matched types ready and 18 locked source items
- Grade 4-2 unit 4: quadrilaterals, 10 source-backed types
- Grade 4-2 unit 5: line graphs, all 22 source items mapped; 18 ready, 2 review-locked, and 2 duplicate items excluded
- Grade 4-2 unit 6: polygons, 4 types
- Grade 5-1 unit 1: mixed operations, 4 types
- Grade 5-1 unit 2: factors and multiples, 12 types
- Grade 5-1 unit 3: patterns and correspondences, 4 types
- Grade 5-1 unit 4: simplifying and common denominators, 4 types
- Grade 5-1 unit 5: fraction addition and subtraction, 4 types
- Grade 5-1 unit 6: polygon perimeter and area, 4 types

> The long paragraph below is retained as the 2026-08-29 regression snapshot. Its runtime and line-graph counts are superseded by `Current State` and `2026-08-30 4-2 Line-Graph Completion` above.

The current ready set has passed its unit-specific regression coverage. `runtime-availability-audit.js` generates all 894 runtime-ready types at three difficulty offsets across 20 seeds. The 4-1 source-native mapping has 309 ready items, and the 4-2 fraction unit adds 66 ready source-native items. The 4-2 triangle source audit maps all 44 items and currently publishes 32 source-matched types; the other 12 remain locked. Triangle-count Exploration 1 reconstructs the source's eight maximal printed segments and ten vertices, confirms 40 triangles by both vertex triples and supporting-line triples, and independently splits them into 21 using the left-side junction and 19 not using it. Example 1-1 reconstructs the source's four horizontal and eight diagonal maximal segments, confirms 32 triangles by both vertex triples and line triples, and guards the two short lower segments whose omission would incorrectly produce 30 or 28. Exploration 2 enumerates every triple on the 4-by-3 dot board, groups rotations and reflections by the same three side lengths, and confirms nine distinct obtuse triangles. Triangle-type Mission 1 remains locked because two independent coordinate audits construct all five proposed counts from zero through four under the printed conditions. Example 2-2 and Mission 2 enumerate the pentagram's five source segments and all ten intersection-based triangles, confirming five acute and five obtuse triangles. Example 2-4 and Mission 3 enumerate every valid angle pair and each confirm ten methods, including cases where one selected angle is already obtuse. Example 1-2 confirms 16 triangles containing the marked cell, and Example 1-3 independently confirms 63 and 12. Mission 4 confirms 37, Mission 5 confirms 24 rather than the handwritten 19, and Mission 6 confirms 64. The isosceles source set adds the 38cm concave perimeter, 320cm strip perimeter, 3cm short-side, and ten-point circle types; the circle type enumerates every triple and reduces rotations and reflections to four shapes. The equilateral source set now publishes its exploration, Missions 1-6, and Examples 4-1 through 4-4. The exploration exhaustively checks moving two of twelve matchsticks, finds 48 valid placements, and reduces them to five shapes under rotation and reflection. Mission 2 is independently 75 degrees, Mission 5 uses six exact equilateral triangles and `(large-small)/3`, Example 4-3 uses seven exact equilateral triangles, and Example 4-4 reflects the original rectangle across the fold line and confirms 15cm for the printed 8cm/27cm source rather than the handwritten 22cm. The 4-2 decimal unit now publishes 26 source-matched types. Its first exploration reverses a `one tenth plus grams` relation using integer grams, independently confirms the printed answer 709.3kg, and renders one tenth through the shared vertical-fraction component. Its fourth exploration counts only numbers whose fourth decimal digit is 1 through 9, independently confirming 828 source cases rather than including shorter decimals ending in zero. The other 18 handwritten, overlapping, or not-yet-verified examples remain locked. The 4-2 quadrilateral source mapping now assigns unique problem IDs to ten clean Exploration, Example, and Mission items. Example 1-2 preserves the printed 45-degree trapezoid and derives the 13cm source height from `(39-13)/2`; Mission 1 confirms the source answer `㉠ 22°, ㉡ 50°` by two complementary-angle calculations and checks each rendered slant angle from its SVG coordinates; Mission 3 independently confirms the printed 4cm distance by evaluating `2-4+6`; Mission 4 enumerates all 24 line-name assignments, permits exactly one, and verifies the rendered parallel, perpendicular, and three-line concurrence relations from SVG coordinates; Example 2-1 confirms the printed 132-degree exterior angle from 65+67 and verifies both rendered slants from SVG coordinates; Mission 6 independently confirms 138 seconds for the printed 3m + 3m path, 20 seconds per meter, and 2 seconds per 10-degree turn. The 4-2 line-graph inventory now records all 22 source items. Two duplicates are excluded, nine Exploration 1 types are public after 13,500 independent calculations and graph-coordinate checks, one unlabeled-month item and ten Exploration 2 items remain locked. Mission 4 reproduces the source's unique 2016 condition and 40-ten-thousand-dollar decrease instead of allowing two qualifying years. The new graphs are checked on desktop, mobile, and A4; one-graph 12-question sets produce six physical A4 pages and two-graph sets produce twelve, so headings and axes are not clipped. The unrelated distance-ratio item is locked instead of being presented as source-matched, while overlapping, cluttered, or duplicate source items are skipped. The remaining completed groups retain their dedicated audits and source gates described below.

The full non-browser regression suite has 70 dedicated audits, and the 2026-08-29 final run passed all 70. The 31 currently public 4-2 triangle types passed all 62 desktop/mobile states with three generated prompts per type; final evidence, including direct problem and solution captures for Exploration 1 and Example 1-1, is retained in the private QA archive dated 2026-08-29. The matchstick exploration also passed direct desktop/mobile visual review after removing an overlong duplicate SVG title; its final captures are retained in the same private QA archive. Division-remainder, bar-graph, and plane-transformation browser evidence remains in their dated private QA archives.

Plane-transformation group 1 publishes 10 of 11 source items after 15,000 independent generations. Its audit verifies rectangular grid dimensions, the complete two-color motif, transformed cell and vertex coordinates, four visually distinct choices, and rendered SVG bounds. Mission 1 remains review-locked because the finished pattern does not uniquely determine which movement was used. Separate browser QA covers 40 desktop/mobile problem-and-solution states and 10 A4 PDFs; it also guards the solution SVG render path and the compact print layout that prevents a blank first page for the six-grid drawing and polygon-slide types.

## Implementation Notes

- Main generator logic: `generators.js`
- Page integration and scoped type identity: `app.js`
- Type metadata: `curriculum.js`
- Selection UI: grade/term → major unit → subunit → detailed-type tree, with a representative generated question on hover or keyboard focus
- Runtime availability policy: `runtime-availability-audit.js` checks all 1,069 public types across 20 seeds per difficulty
- 4-1 source policy: `source-inventory-audit.js`, `source-crosswalk-audit.js`, and `source-runtime-taxonomy-audit.js`
- 4-1 type-language policy: `source-type-language-audit.js` requires 329 unique child-readable Korean type names. Source labels such as `예제 1-1` remain provenance only; they must never replace the explanatory type name.
- Elementary explanation policy: `elementary-language-audit.js` checks the public runtime types across 100 seeds per difficulty, including the source-mapped public types
- Numeric display policy: `numeric-display-audit.js` checks the public runtime types across 100 seeds per difficulty; the runtime sweep separately checks availability
- 4-2 fraction source routing and independent answer check: `fraction-add-sub-4-2-audit.js` covers 66 types and 66 distinct source structures; `source-4-2-fraction-browser-audit.js` covers all 132 PC/mobile states
- 4-2 triangle source routing, publication gate, and independent answer check: `triangle-4-2-audit.js` maps all 44 source items and permits only the 31 directly source-matched types to run
- 4-2 decimal source routing, integer-scaled calculation, exhaustive candidate checks, and independent answer check: `decimal-add-sub-4-2-audit.js` covers 24 types and 24 distinct source structures
- Graph regression check: `graph-audit.js`
- Graph readability and answer contract: `GRAPH_READABILITY_VALIDATION.md`
- Plane-transformation detail routing, composite-shape diversity, grid bounds, and point-coordinate check: `movement-audit.js`
- Mixed-operation regression check: `mixed-operation-audit.js`
- Factors-and-multiples regression check: `factors-audit.js`
- Patterns-and-correspondences regression check: `correspondence-audit.js`
- Simplifying-and-common-denominators regression check: `fractions-audit.js`
- Fraction-addition-and-subtraction regression check: `fraction-add-sub-audit.js`
- Perimeter-and-area regression check: `perimeter-area-audit.js`
- Geometry single-answer and visibility gate: `GEOMETRY_VALIDATION.md`
- Space-and-solids source and visibility contract: `SPACE_SOLIDS_SOURCE_ALIGNMENT.md`
- Duplicate names must be resolved with semester/unit/type IDs. Do not route generators by display name alone.
- Source evidence and detailed classification notes are maintained outside the public repository. Query that memory before opening source pages or designing a new type.
- Never add original textbook pages, extracted source images, or private absolute paths to this repository.

## Next Steps

1. Query private source memory before revising an existing type or responding to a curriculum change.
2. Re-check the original advanced-course structure before changing a generator; never lower difficulty by replacing it with generic arithmetic.
3. Run the relevant unit audit, `math-notation-audit.js`, and a fresh generator sweep before unlocking a changed type.
4. Also run `elementary-language-audit.js` and `numeric-display-audit.js` for any generator text or numeric-display change.
5. For graph, 3D, folding, or geometry changes, apply the dedicated visibility and single-answer audits as well as desktop/mobile checks.
6. Update the catalog count only from a fresh programmatic count of `curriculum.js`.

## Recent Commits

- `821cc55e` Normalize generated numeric displays and add the display audit
- `914cb9f0` Keep elementary solution language in scope and add the language audit
- `a5c74e76` Codify graph readability checks
- `b8df6481` Record the 6-2 space-and-solids validation contract
- `4db13e1` Add verified advanced mixed operation generators
- `31fb037` Add verified advanced quadrilateral generators
- `0dc06d9` Add advanced fraction unit generators
- `b69d525` Replace rule finding with advanced generators
- `4b67305` Add advanced bar graph generators
- `5aba934` Add advanced plane transformation generators
