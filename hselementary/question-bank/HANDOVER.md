# Elementary Question Bank Handover

## Current State

- Branch: `agent/hsmiddle-question-bank`
- Local page: `http://127.0.0.1:8879/hselementary/question-bank/`
- Total runtime types: 914 across 6 semesters, 36 major units, and 174 subunits
- Implemented types: 763 (deterministic runtime availability check)
- Review-locked types: 151 (103 source-inventoried 4-1 items plus 48 source-complex 4-2 items)
- Exact source-item mapping: 417 items: all 329 items in 4-1 plus 88 items in the 4-2 triangle and decimal units. Do not describe the remaining entries as original problem items until every exploration, example, and Mission problem has a unique source locator.
- Uncatalogued placeholder types: 0; review-locked source items remain intentionally unavailable
- Completed: all six units in grades 4, 5, and 6 for both semesters
- Next priority: source-backed quality review or a curriculum revision; do not add filler types merely to increase the count

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
- Grade 4-1 unit 3: 65 source items, 44 ready and 21 review-locked; multiplication exploration groups 1 and 2 and division exploration groups 3 and 4 each have 11 source-native variants, and source example 6-4 does not exist
- Grade 4-1 unit 4: 44 source items, 35 ready and 9 review-locked; exploration group 1 publishes 10 source-native items and keeps ambiguous Mission 1 locked, exploration group 2 publishes 8 items and locks 3 ambiguous or contradictory items, exploration group 3 publishes 9 items and locks 2 ambiguous items, and exploration group 4 publishes 8 items while locking 3 source-answer conflicts
- Grade 4-1 unit 5: 22 source items, 11 ready and 11 review-locked; bar-graph exploration group 1 has all 11 source-native variants
- Grade 4-1 unit 6: 66 source items, 7 exact-match generators ready
- Grade 4-2 unit 1: fraction addition and subtraction, 36 source-backed Mission types
- Grade 4-2 unit 2: triangles, 24 source-backed Mission types
- Grade 4-2 unit 3: decimal addition and subtraction, 24 source-backed Mission types
- Grade 4-2 unit 4: quadrilaterals, 8 types
- Grade 4-2 unit 5: line graphs, 2 types
- Grade 4-2 unit 6: polygons, 4 types
- Grade 5-1 unit 1: mixed operations, 4 types
- Grade 5-1 unit 2: factors and multiples, 12 types
- Grade 5-1 unit 3: patterns and correspondences, 4 types
- Grade 5-1 unit 4: simplifying and common denominators, 4 types
- Grade 5-1 unit 5: fraction addition and subtraction, 4 types
- Grade 5-1 unit 6: polygon perimeter and area, 4 types

The current ready set has passed its unit-specific regression coverage. `runtime-availability-audit.js` generates all 763 runtime-ready types at three difficulty offsets across 20 seeds. The source-native mapping has 226 items. Plane-transformation group 3 adds 9 independent source structures and keeps 2 items locked: Example 3-2 changes under two valid flip interpretations, while Mission 4 allows both 58 and 60 tiles. Its dedicated audit runs 13,500 independent generations and reverse-checks the 4-by-6 and 2-by-6 layouts, direct-drawing sequence, four-step shape cycles, base-tile recovery, transparent-tile pair classes, SVG dimensions, and visible fills. Plane-transformation group 4 publishes 8 source structures and keeps 3 items locked because the supplied answers conflict with independent calculations. Its dedicated audit covers 72,000 distinct questions and 74,598 generated or independently recalculated cases, and reverse-checks seven-segment digits, digital-clock punctuation and leading zeroes, analog-clock hand angles, asymmetric faces, exhaustive fixed-number enumeration, and transformed stone coordinates. Bar-graph exploration group 1 publishes all 11 source structures after 33,000 independent generations. Its audit reconstructs answers only from the visible table, bars, totals, and relationships, then reverse-checks up to 24 grid cells, selective number labels, concealed original tick values, horizontal and vertical coordinates, and truly blank bars.

The full regression suite has 65 dedicated audits. The 2026-08-28 run passed all 65, including the new bar-graph group 1 source audit, 4-1 inventory, child-readable Korean type-language, runtime taxonomy, availability, elementary-language, numeric-display, math-notation, and the existing shared audits. Bar-graph group 1 browser QA covers 20 representative desktop/mobile problem-and-solution states, 11 problem PDFs with 28 physical pages, and 11 solution PDFs with 24 physical pages. It confirms zero horizontal overflow, blank SVG, overlap, blank print page, or right-edge clipping, with all general print text at least 9pt. Evidence is stored at `E:\Codex\visualizations\2026\08\28\qa-final-print-fixed-r\REPORT.md`. Earlier group 4 browser QA passed all 32 desktop/mobile states and all 8 A4 PDFs; its evidence remains at `E:\Codex\visualizations\2026\08\28\hse-4-1-u4-e4-qa-final-luna\REPORT.md`.

Plane-transformation group 1 publishes 10 of 11 source items after 15,000 independent generations. Its audit verifies rectangular grid dimensions, the complete two-color motif, transformed cell and vertex coordinates, four visually distinct choices, and rendered SVG bounds. Mission 1 remains review-locked because the finished pattern does not uniquely determine which movement was used. Separate browser QA covers 40 desktop/mobile problem-and-solution states and 10 A4 PDFs; it also guards the solution SVG render path and the compact print layout that prevents a blank first page for the six-grid drawing and polygon-slide types.

## Implementation Notes

- Main generator logic: `generators.js`
- Page integration and scoped type identity: `app.js`
- Type metadata: `curriculum.js`
- Selection UI: grade/term → major unit → subunit → detailed-type tree, with a representative generated question on hover or keyboard focus
- Runtime availability policy: `runtime-availability-audit.js` checks all 763 public types across 20 seeds per difficulty
- 4-1 source policy: `source-inventory-audit.js`, `source-crosswalk-audit.js`, and `source-runtime-taxonomy-audit.js`
- 4-1 type-language policy: `source-type-language-audit.js` requires 329 unique child-readable Korean type names. Source labels such as `예제 1-1` remain provenance only; they must never replace the explanatory type name.
- Elementary explanation policy: `elementary-language-audit.js` checks all 763 public runtime types across 100 seeds per difficulty, including all 226 public 4-1 mappings
- Numeric display policy: `numeric-display-audit.js` checks all 763 public runtime types across 100 seeds per difficulty; the runtime sweep separately checks availability
- 4-2 fraction source routing and independent answer check: `fraction-add-sub-4-2-audit.js` covers 36 types and 36 distinct source structures
- 4-2 triangle source routing, coordinate visibility, and independent answer check: `triangle-4-2-audit.js` covers 24 types and 24 distinct source structures
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
