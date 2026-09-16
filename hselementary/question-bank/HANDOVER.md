# Elementary Question Bank Handover

## Current State

- Branch: `agent/hsmiddle-question-bank`
- Local audit page: `http://127.0.0.1:8893/hselementary/question-bank/`
- Total runtime types: 2,044 across 6 semesters, 36 major units, and 184 subunits
- Runtime-available types: 1,132 (all carry an individual source item ID; runtime availability is not a claim of whole-bank difficulty approval)
- Review-locked types: 912
- Source-linked runtime entries: 1,664 currently carry a source item ID (4-1: 329, 4-2: 239, 5-1: 357, 5-2: 106, 6-1: 268, 6-2: 365). A source ID alone is not proof that a generator is ready; only items that also pass source, answer, learner-fit, notation, visibility, and render gates may be published. The 5-1 Unit 6 catalog contains all 75 directly classified source items, and 5-2 Units 1-2 now contain 106 individually indexed source items.
- Semester release counts: 4-1 `309/329`, 4-2 `196/263`, 5-1 `272/357`, 5-2 `68/206`, 6-1 `239/412`, and 6-2 `48/477` types are runtime-available. The remainder stay review-locked.
- Uncatalogued placeholder types: 0; review-locked source items remain intentionally unavailable
- Catalog coverage: all six units in grades 4, 5, and 6 for both semesters. Original-item mapping, visual quality, and difficulty review are not complete across the whole bank.
- Next priority: source-backed quality review or a curriculum revision; do not add filler types merely to increase the count

## 2026-09-13 Parallel-Angle Repair And Release Gates

- Added nine source-matched Exploration, Example, and Mission types from the advanced 4-2 parallel-angle group. Each has three fixed verified variants and a separate answer diagram; these are finite pools, not unlimited generation or empirically calibrated difficulty bands.
- Point/line models now determine intersections, angle sectors, leaders, and clipped line endpoints. Corrected the original incidence relations, target vertices, and parallel/perpendicular marks. Thin black strokes and normal-weight educational text replace the heavy navigation colors within these diagrams.
- Where the source determines only a sum, individual unknown angles remain symbolic in the solution. Coordinate choices must not be presented as additional given values.
- Examples 2-1 and 2-2 remain locked. Quadrilateral entries without individual source-item links also remain locked; do not reconnect them to generic generators to raise the available count.
- Focused checks: 27 fixed variants, 735 independent angle cases, 36 desktop/mobile problem-and-solution states, and 18 substantive A4 PDFs. Browser geometry checks include frame bounds, text/line clearance, sector-label placement, and answer visibility. Private evidence stays outside Git.
- Whole-bank runtime check: 63,840 generations; notation check: 159,600 generations plus real-DOM fraction centering at 1440px and 390px. These checks do not replace original-source and learner-difficulty review for other groups.
- Public review reasons must not contain answer values. Keep detailed counterexamples in private evidence, and run `public-inventory-review-reason-audit.js` before release.

## 2026-09-16 5-2 Units 1-2 Source Reconstruction

- The 5-2 source inventory now indexes 106 individual Exploration, Example, and Mission items: 50 in Unit 1 and 56 in Unit 2. It normalizes them into 95 mathematical families without losing each source-item ID.
- Unit 2 publishes 54 of 56 source items. Exploration 1 stays locked because it is an open explanation task without a single numeric answer rubric. Exploration 2 Mission 6 stays locked because the printed overlapping-circle diagram does not give enough numeric center-spacing information to determine the rectangle area from text alone.
- Unit 2 source groups publish 16 Exploration 2 types, 11 Exploration 3 types, and 11 Exploration 4 types in addition to the verified Exploration 1 set. Every public type has three fixed, source-matched variants; these are finite verified pools, not unlimited random generation or empirically calibrated difficulty bands.
- Repaired source-fidelity defects found during visual comparison: stacked squares now share exact calculated vertices instead of drifting inside one another; the irreducible-fraction task keeps symbolic `가/나` instead of leaking its value; the equal-interval number line includes calculated interval arcs and equality marks; diagrams use thin black workbook strokes and shared centered fraction/mixed-number notation.
- Independent group audits cover 48, 33, and 33 Unit 2 fixed questions and 4,593 difficulty-seed runs. Whole-bank checks cover 67,920 runtime generations, 169,800 notation generations, and 339,600 language plus 339,600 numeric-display generations.
- Full source-browser evidence covers all 106 indexed items: 212 catalog previews, 1,224 desktop/mobile problem-and-solution states, 818 screenshots, and 408 substantive A4 files. Sixty-eight items are public and 38 remain review-locked. This validates source structure, answer contract, notation, and rendering; it is not a claim of measured student difficulty.
- The 124 legacy 5-2 generated types remain review-locked. They did not carry individual advanced-source item IDs, and direct comparison showed that their displayed structures were not one-to-one matches for the printed items. Keep them as private candidates only.
- An improper fraction is not automatically an error, but every displayed fraction must belong to the printed problem structure and use the shared mathematical notation. Do not introduce an improper fraction merely because a random parameter makes one.
- Number lists containing thousands separators must use separate list items rather than a second comma as the item separator.
- The same release gate now applies across the whole elementary bank: a runtime type without an individual source item ID is review-locked. This also locks 256 legacy Grade 6 generators while retaining their code as private reconstruction candidates.

## 2026-09-16 Whole-Public-Bank Layout Sweep

- The browser sweep covers every currently public type: Grade 4 has 505 types and 2,020 desktop/mobile problem-and-solution states, Grade 5 has 272 types and 1,088 states, and Grade 6 has 287 types and 1,148 states. Each grade also receives substantive A4 output checks.
- The sweep loads the same Grade 6 source-specific modules as the real page and respects each type's verified fixed-pool count. It rejects SVG text or line overflow, text-to-text collisions, missing answer visuals, invalid values, and clipped page content.
- Direct visual review repaired four failures found by the sweep: the pentagonal-prism spiral label collision, the tree-spacing perimeter-label collision, the decimal digit-pair table clipping, and the long strip-graph solution calculation. Targeted independent math audits and desktop, 390px, and A4 reruns pass after the repairs.
- This is a layout and runtime release check, not a claim that every locked type or every source-book figure has been rebuilt. A public figure must still be based on its individual source item, use a dedicated point/line/data model, include a matching answer figure when required, and pass human visual comparison before release.

## 2026-09-13 5-1 Unit 6 Source And Notation Correction

- Replaced the three unlocked generic area groups with all 75 source-item types from Explorations 1 through 6. Exploration 1 keeps 10 verified generators and one non-unique locked item; the other 64 source items remain review-locked until their own problem, answer visual, and independent checker are complete.
- Corrected the source inventory collision that had copied Exploration 2 Missions 5 and 6 into Exploration 1. Exploration 1 Mission 5 is the four-rectangle perimeter problem and is ready; Mission 6 is the five-rectangle problem and remains locked because the printed conditions do not determine one perimeter.
- Fraction layout now uses the widest numerator or denominator as the shared width, so the bar spans the complete fraction and both parts are centered. Fractions, mixed numbers, inline expressions, and squared units inherit the surrounding educational font and remain on one mathematical line.
- Focused evidence: 30,000 independent Exploration 1 calculations; 121 desktop/mobile captures; 60 A4 problem/solution PDFs; 218,400 math-notation generation samples; and 87,180 whole-bank runtime generations. All passed. Evidence is outside the repository under the 2026-09-13 private geometry audit folder.
- Do not unlock the remaining 64 Unit 6 items by routing them to `rectangleRightTriangleAreaAdvanced`, `perimeterAreaSquareCompositionAdvanced`, or `quadrilateralAreaAdvanced`. Each printed Exploration, Example, and Mission needs its own source-matched branch.

## 2026-08-29 4-2 Fraction Completion

- Split all 66 source questions in the six fraction exploration groups into independent child-readable types. Each exploration prompt, example, and Mission now keeps its own source locator and generator branch.
- Verified 69,300 generated questions with independent arithmetic, exhaustive candidate checks where needed, one-answer gates, and a minimum of 24 distinct prompts per type across 350 samples.
- Structured fraction and mixed-number notation is used in problems and solutions. The PC/mobile sweep covered 132 states with zero horizontal overflow, clipping, or fraction overlap. Evidence is retained in the private QA archive dated 2026-08-29.
- Source handwritten arithmetic conflicts were not copied blindly. The audit records the independently recomputed value and keeps every unresolved source condition out of the public set.

## 2026-08-30 4-2 Line-Graph Completion

- The 22 source items are classified as 18 ready types, 2 review-locked conflicts, and 2 duplicate structures that do not create runtime types.
- Exploration 1 Mission 6 preserves the source's 6, 8, 10, and 12 month ticks, 10-item minor grid, 50-item numbered grid, thick ice-cream line, and thin chocolate line. Independent interpolation confirms 320 and 230 items in September and an 86,000-won sales difference.
- Exploration 2 Mission 6 preserves the 0-to-25-minute domain, 2.5-minute minor vertical grid, 5-minute numbered ticks, 20 L minor horizontal grid, 100 L numbered ticks, and distinct thin/thick series. Independent timing confirms 450 seconds.
- The height exploration and Example 2-4 remain locked because graph-derived values conflict with handwritten source values. They must not be opened until an authoritative answer resolves the conflict.
- Arithmetic audits cover 27,000 independent generations. Browser audits cover 72 PC/mobile problem-and-solution states and 36 A4 problem/solution files, including actual line widths, label overlap, grid counts, proportional coordinates, direct-URL lockout, and the one-column print rule that prevents an odd final question from becoming a blank A4 page.

## Required Standard

- Use the actual advanced-course problem structure as the baseline.
- Do not label or classify content as `일품`; that source level is not present.
- Easy, standard, and hard variants must preserve the same mathematical structure. Adjust only number ranges, conditions, or reasoning depth.
- Use the display labels `심화 쉬움` (-1), `심화 기준` (0), and `심화 어려움` (1). They are variants of the same advanced-course structure, not separate curricula.
- Build a dedicated generator for each type. Do not substitute generic arithmetic filler.
- Keep formulas readable with structured HTML/SVG and verify that no symbols, fractions, or layouts break on mobile.
- For plane transformations, use source-backed triangle and composite grid figures rather than repeating one simple shape. Independently calculate the labeled point after every translation, reflection, or rotation, and keep every vertex inside the visible grid.
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
- Grade 5-2 units 1-2: 106 source items indexed; 68 source-matched types ready and 38 locked. Unit 2 publishes 54 of 56 items and keeps two items locked for open-response or missing-diagram-condition reasons

> The long paragraph below is retained as the 2026-08-29 regression snapshot. Its runtime and line-graph counts are superseded by `Current State` and `2026-08-30 4-2 Line-Graph Completion` above.

The current ready set has passed its unit-specific regression coverage. `runtime-availability-audit.js` generates all 894 runtime-ready types at three difficulty offsets across 20 seeds. The 4-1 source-native mapping has 309 ready items, and the 4-2 fraction unit adds 66 ready source-native items. The 4-2 triangle source audit maps all 44 items and currently publishes 32 source-matched types; the other 12 remain locked. Triangle-count Exploration 1 reconstructs the source's eight maximal printed segments and ten vertices, confirms 40 triangles by both vertex triples and supporting-line triples, and independently splits them into 21 using the left-side junction and 19 not using it. Example 1-1 reconstructs the source's four horizontal and eight diagonal maximal segments, confirms 32 triangles by both vertex triples and line triples, and guards the two short lower segments whose omission would incorrectly produce 30 or 28. Exploration 2 enumerates every triple on the 4-by-3 dot board, groups rotations and reflections by the same three side lengths, and confirms nine distinct obtuse triangles. Triangle-type Mission 1 remains locked because two independent coordinate audits construct all five proposed counts from zero through four under the printed conditions. Example 2-2 and Mission 2 enumerate the pentagram's five source segments and all ten intersection-based triangles, confirming five acute and five obtuse triangles. Example 2-4 and Mission 3 enumerate every valid angle pair and each confirm ten methods, including cases where one selected angle is already obtuse. Example 1-2 confirms 16 triangles containing the marked cell, and Example 1-3 independently confirms 63 and 12. Mission 4 confirms 37, Mission 5 confirms 24 rather than the handwritten 19, and Mission 6 confirms 64. The isosceles source set adds the 38cm concave perimeter, 320cm strip perimeter, 3cm short-side, and ten-point circle types; the circle type enumerates every triple and reduces rotations and reflections to four shapes. The equilateral source set now publishes its exploration, Missions 1-6, and Examples 4-1 through 4-4. The exploration exhaustively checks moving two of twelve matchsticks, finds 48 valid placements, and reduces them to five shapes under rotation and reflection. Mission 2 is independently 75 degrees, Mission 5 uses six exact equilateral triangles and `(large-small)/3`, Example 4-3 uses seven exact equilateral triangles, and Example 4-4 reflects the original rectangle across the fold line and confirms 15cm for the printed 8cm/27cm source rather than the handwritten 22cm. The 4-2 decimal unit now publishes 26 source-matched types. Its first exploration reverses a `one tenth plus grams` relation using integer grams, independently confirms the printed answer 709.3kg, and renders one tenth through the shared vertical-fraction component. Its fourth exploration counts only numbers whose fourth decimal digit is 1 through 9, independently confirming 828 source cases rather than including shorter decimals ending in zero. The other 18 handwritten, overlapping, or not-yet-verified examples remain locked. The 4-2 quadrilateral source mapping now assigns unique problem IDs to ten clean Exploration, Example, and Mission items. Example 1-2 preserves the printed 45-degree trapezoid and derives the 13cm source height from `(39-13)/2`; Mission 1 confirms the source answer `㉠ 22°, ㉡ 50°` by two complementary-angle calculations and checks each rendered slant angle from its SVG coordinates; Mission 3 independently confirms the printed 4cm distance by evaluating `2-4+6`; Mission 4 enumerates all 24 line-name assignments, permits exactly one, and verifies the rendered parallel, perpendicular, and three-line concurrence relations from SVG coordinates; Example 2-1 confirms the printed 132-degree exterior angle from 65+67 and verifies both rendered slants from SVG coordinates; Mission 6 independently confirms 138 seconds for the printed 3m + 3m path, 20 seconds per meter, and 2 seconds per 10-degree turn. The 4-2 line-graph inventory now records all 22 source items. Two duplicates are excluded, nine Exploration 1 types are public after 13,500 independent calculations and graph-coordinate checks, one unlabeled-month item and ten Exploration 2 items remain locked. Mission 4 reproduces the source's unique 2016 condition and 40-ten-thousand-dollar decrease instead of allowing two qualifying years. The new graphs are checked on desktop, mobile, and A4; one-graph 12-question sets produce six physical A4 pages and two-graph sets produce twelve, so headings and axes are not clipped. The unrelated distance-ratio item is locked instead of being presented as source-matched, while overlapping, cluttered, or duplicate source items are skipped. The remaining completed groups retain their dedicated audits and source gates described below.

The full non-browser regression suite has 70 dedicated audits, and the 2026-08-29 final run passed all 70. The 31 currently public 4-2 triangle types passed all 62 desktop/mobile states with three generated prompts per type; final evidence, including direct problem and solution captures for Exploration 1 and Example 1-1, is retained in the private QA archive dated 2026-08-29. The matchstick exploration also passed direct desktop/mobile visual review after removing an overlong duplicate SVG title; its final captures are retained in the same private QA archive. Division-remainder, bar-graph, and plane-transformation browser evidence remains in their dated private QA archives.

Plane-transformation group 1 publishes 10 of 11 source items after 15,000 independent generations. Its audit verifies rectangular grid dimensions, the complete two-color motif, transformed cell and vertex coordinates, four visually distinct choices, and rendered SVG bounds. Mission 1 remains review-locked because the finished pattern does not uniquely determine which movement was used. Separate browser QA covers 40 desktop/mobile problem-and-solution states and 10 A4 PDFs; it also guards the solution SVG render path and the compact print layout that prevents a blank first page for the six-grid drawing and polygon-slide types.

## Implementation Notes

- Main generator logic: `generators.js`
- Page integration and scoped type identity: `app.js`
- Type metadata: `curriculum.js`
- Selection UI: grade/term → major unit → subunit → detailed-type tree, with a representative generated question on hover or keyboard focus
- Runtime availability policy: `runtime-availability-audit.js` checks all 1,132 public types across 20 seeds per difficulty
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
- 5-2 source inventory and grouping: `source-inventory-5-2.js` and `source-inventory-5-2-build.js`
- 5-2 Unit 2 source routing and independent checks: `source-5-2-u2-e2-audit.js`, `source-5-2-u2-e3-audit.js`, and `source-5-2-u2-e4-audit.js`
- 5-2 Units 1-2 PC/mobile/A4 source sweep: `source-5-2-e1-browser-audit.js`
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
