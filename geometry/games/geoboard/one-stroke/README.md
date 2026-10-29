# Geoboard One-Stroke Activity

Entry: `/geometry/games/geoboard/?activity=one-stroke`. The activity is also the sixth card in the existing Geoboard lobby and is linked from the original game's level dialog. `entry.js` selects one engine; original shape-copying, counting and partitioning data/logic stay unchanged.

## Contract

- This is an undirected Euler-trail task, not visiting each vertex once or reproducing a model shape. Traverse every given edge exactly once. Vertices may be revisited; reverse traversal still reuses the same edge.
- The learner chooses the start in every problem. Invalid starts leave the drawing empty and show a short explanation without highlighting a correct starting peg.
- All 12 internally authored problems are connected and solvable. Circuits permit every vertex as a start; open trails permit the two odd-degree vertices. No textbook/source-page attribution is claimed for these new graphs.
- Three stages, four problems each: first paths, junctions, challenge. They are exploratory learning stages, not official curriculum grades.
- A wrong branch may lead to a genuine dead end. Unused edges remain visible and the learner can undo a move or press the always-visible localized **Draw again** command. Reset keeps the same problem.
- Pointer/touch tracing is continuous along given edges. Coarse events are swept through peg targets; excursions outside the edge corridor cannot teleport to another peg. Repeated edges are rejected.
- Lifting a finger or cancellation removes only the transient preview. Already reached pegs/edges remain; a pointer can resume only from the current peg. Keyboard traversal provides an equivalent continuous graph path via native peg buttons, Enter/Space and arrow focus.
- Secondary touch cannot select a start. Rotation/resize, blur and page hiding terminate transient capture without discarding accepted graph state.
- No new points, rewards, avatar progression, multiplayer or worksheet integration is implemented in this foundation batch.

## Design and Preservation

The primary job is solving one visible graph. The square wooden tray, brass peg shading, existing wood bitmaps, SUIT font and material-audio controller are reused. There is no new font/audio download, character voice replacement, decorative avatar, WebGL camera or source-image edit.

The given edge network is visible before input. Only traversed edges receive the colored material; start/current/error rings are state feedback, not future-answer hints. Pin targets are at least 44px. A one-unit gap in this activity's four-position lattice leaves room for finger targets on short landscape screens.

The layout is a fixed header, unframed problem/board area and compact tool footer. Portrait and landscape preserve the square board. English, Korean, Chinese and Japanese prompts and commands are explicit translations. Reduced motion has the same graph endpoint.

Storage key: `gfield-geoboard-one-stroke-v1`. It stores validated per-question trails and stage indices. Reload replays legal steps and rejects reused edges, false starts, corrupt trails and skipped questions. The existing profile and `geoboardStudio` record are not rewritten. Only the already-shared language and audio preference keys are reused.

## Mathematical and Interaction Gates

The browser does not ship a second graph-solving dependency: it enforces traversal against static, independently verified graph metadata. Authoring uses the already-installed **NetworkX** implementation of `has_eulerian_path` and `eulerian_path`. `verify_bank.py` checks every starting peg, a full trail from every valid start, connectivity, unsplit active junctions and unmarked crossings.

`core.selftest.mjs` adds a separate exhaustive edge-permutation DFS. For the current bank it checks 60 starts, all 270 valid trails, 243 reference transitions, legal vertex revisits, wrong starts, duplicate edges, genuine dead ends, undo, corrupt saves, forged progression and sparse tracing at two target radii. A negative bank with false start metadata must fail the NetworkX gate.

Task learner stage: `early-primary-euler-trail-exploration`. Required learner-fit criteria: short concrete language without degree notation; visible points and complete given edges; prerequisites of following a line and distinguishing points/lines; reasoning load of 3-9 edges with junction revisits; continuous tracing or equivalent keyboard response. Automated technical screening does not constitute teacher/child learning approval.

## Verification Commands

```powershell
node geometry/games/geoboard/one-stroke/core.selftest.mjs
node geometry/games/geoboard/one-stroke/one-stroke.browsercheck.mjs
node geometry/games/geoboard/geoboard.selftest.mjs
node geometry/games/geoboard/geoboard.browsercheck.mjs
```

Tests accept the repository's `GFIELD_BASE_URL`, `PLAYWRIGHT_MODULE`, `SHARP_MODULE`, `GFIELD_ARTIFACT_DIR`, and `PYTHON` overrides. Default server is port 8771. NetworkX must already be installed in the selected Python environment; the test does not install it.

The browser matrix covers four languages and five desktop/phone viewports in start, invalid-start, solved and undo states. It also plays all 12 problems using independent NetworkX paths, real mouse/touch input, live preview, reset, edge reuse, dead-end recovery, keyboard, cancellation, rotation, blur/reload, secondary touch, lobby/legacy entry, reduced motion, failed storage, required-texture failure and fresh offline reload. Actual wood and painted-edge pixels are checked; an intentionally invisible edge must fail the pixel checker.

This activity is local implementation until separately committed, reviewed, merged and deployed. Physical-device input/listening and independent teacher/child approval remain separate. The previous all-Geometry host-memory failure is not converted into a full release pass by these focused checks.
