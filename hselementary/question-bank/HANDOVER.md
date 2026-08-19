# Elementary Question Bank Handover

## Current State

- Branch: `agent/hsmiddle-question-bank`
- Local page: `http://127.0.0.1:8765/hselementary/question-bank/`
- Total types: 174
- Implemented types: 99
- Pending types: 75
- Completed: all six units in grade 4 semester 1 and units 1-5 in grade 4 semester 2
- Next unit: grade 4 semester 2, unit 6 (polygons)

## Required Standard

- Use the actual advanced-course problem structure as the baseline.
- Do not label or classify content as `일품`; that source level is not present.
- Easy, standard, and hard variants must preserve the same mathematical structure. Adjust only number ranges, conditions, or reasoning depth.
- Build a dedicated generator for each type. Do not substitute generic arithmetic filler.
- Keep formulas readable with structured HTML/SVG and verify that no symbols, fractions, or layouts break on mobile.
- Validate answers algorithmically and stress-test every generator before marking a type ready.
- For every graph, draw numeric tick labels and grid lines, use only values that are exact multiples of the stated tick step, state the tick step in the question, reverse-check plotted coordinates against the data, and confirm labels at 375px without clipping or overlap. Run `node graph-audit.js` whenever a graph generator changes.

## Completed Generator Groups

- Grade 4-1 unit 1: large numbers, 6 types
- Grade 4-1 unit 2: angles, 6 types
- Grade 4-1 unit 3: multiplication and division, 6 types
- Grade 4-1 unit 4: plane transformations, 4 types
- Grade 4-1 unit 5: bar graphs, 2 types
- Grade 4-1 unit 6: finding rules, 6 types
- Grade 4-2 unit 1: fraction addition and subtraction, 6 types
- Grade 4-2 unit 2: triangles, 4 types
- Grade 4-2 unit 3: decimal addition and subtraction, 4 types
- Grade 4-2 unit 4: quadrilaterals, 8 types
- Grade 4-2 unit 5: line graphs, 2 types

The current ready set has passed regression coverage, including an 8,400-generation sweep for the quadrilateral unit (8 types x 3 difficulty levels x 350 seeds, 0 exceptions). The graph audit covers 4 graph types across 5,400 generated questions, including data-to-SVG coordinate checks. The newer units were also checked at desktop and mobile (375px) widths for overflow, missing questions, missing solutions, accidental lock states, and graph-label overlap.

## Implementation Notes

- Main generator logic: `generators.js`
- Page integration and scoped type identity: `app.js`
- Type metadata: `curriculum.js`
- Graph regression check: `graph-audit.js`
- Duplicate names must be resolved with semester/unit/type IDs. Do not route generators by display name alone.
- Source evidence and detailed classification notes are maintained outside the public repository. Query that memory before opening source pages or designing a new type.
- Never add original textbook pages, extracted source images, or private absolute paths to this repository.

## Next Steps

1. Query the private source memory for grade 4 semester 2 unit 6 (polygons).
2. Inspect only the relevant source pages needed to confirm structures and diagrams.
3. Record the classification decision before implementation.
4. Add dedicated generators and SVG diagrams for every type in the unit. Keep graph safeguards in `graph-audit.js` when a later unit uses any chart renderer.
5. Run syntax checks, high-volume answer checks, and desktop/mobile browser verification.
6. Update the ready count and commit only the completed unit.

## Recent Commits

- Add advanced quadrilateral unit generators (grade 4-2 unit 4, 8 types)
- `0dc06d9` Add advanced fraction unit generators
- `b69d525` Replace rule finding with advanced generators
- `4b67305` Add advanced bar graph generators
- `5aba934` Add advanced plane transformation generators
