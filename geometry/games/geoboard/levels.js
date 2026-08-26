/* =========================================================================
   점판 공작소 (Geoboard Studio) — problem data and lattice geometry.

   WHY this file is shaped like this:

   - Every game in this project is self-contained (no cross-game imports), so the
     geometry helpers live here instead of in a shared module. They are written for
     a PEG LATTICE: a vertex is a peg, an edge is a straight rubber band between two
     pegs, and nothing exists between pegs. That is a different world from the cell
     grid Mirror Manor uses, which is why none of its code is reused.
   - docs/12_SOURCE_BACKED_FUTURE_GAMES.md section 5 fixes five levels. Only 1 and 2
     are implemented. Levels 3-5 are declared here with `ready:false` and an EMPTY
     pool, exactly like Mirror Manor does, so shipping them later is pure data work:
     author a pool, flip the flag. No engine or validator restructuring.
   - The pure helpers `isClosed`, `hasSelfIntersection`, `vertexCount`, `edgeCount`
     and `polygonArea` are exported so .selftest.mjs can re-check them. Levels 3-5
     use separate square-lattice, triangular-lattice, and compound-figure
     enumerators; they stay locked until those enumerators prove every answer.

   THE ACCEPTANCE RULE, stated once and enforced everywhere:

     A child's answer is accepted when its EDGE SET is exactly the target's edge
     set and its open/closed state matches. Edges are unordered pairs of pegs, so
     the tap ORDER and the tap DIRECTION do not matter (A-B-C and C-B-A are the
     same figure, and a closed shape may start at any of its corners and run either
     way round). POSITION and ORIENTATION do matter: level 2 asks the child to
     reproduce the shown shape exactly where it is shown, so a rotated, reflected
     or slid copy is NOT accepted. Consequently every problem has exactly ONE
     accepted figure, and validateLevels() proves that by walking all 8 dihedral
     images crossed with every translation that still fits on the board.

   Every user-facing string lives in i18n.js. This file only carries keys.
   ========================================================================= */

export const GAME_ID = "geoboard";

// Progress record name inside the shared `gfield-profile` object. This game never
// writes to another game's record, and never touches `gfield-profile` wholesale —
// shared/profile-storage.js does a read-modify-write for exactly this key.
export const PROGRESS_KEY = "geoboardStudio";

// One 5x5 peg board for every level. Five pegs a side is the largest lattice whose
// finger targets still clear 30px on a 844x390 phone in landscape (see styles.css:
// the board is height-budgeted, and the invisible hit circle is 19% of its width).
export const GRID = { cols: 5, rows: 5 };

/* ------------------------------------------------------------ point primitives */

export const samePoint = (a, b) => a[0] === b[0] && a[1] === b[1];

export const pointKey = (point) => `${point[0]},${point[1]}`;

/** True when the peg exists on the board: integer coordinates inside the lattice. */
export function isPeg(point, grid) {
  return Array.isArray(point) && point.length === 2
    && Number.isInteger(point[0]) && Number.isInteger(point[1])
    && point[0] >= 0 && point[1] >= 0 && point[0] < grid.cols && point[1] < grid.rows;
}

/**
 * A figure is carried around as an EXPLICIT point list: a closed figure repeats its
 * first peg at the end (A,B,C,A). That single convention is what makes `isClosed`,
 * `edgeCount` and `hasSelfIntersection` answer honestly for both an open path and a
 * closed polygon without a second "closed" flag travelling beside the array.
 */
export function isClosed(points) {
  return Array.isArray(points) && points.length >= 4 && samePoint(points[0], points[points.length - 1]);
}

/** Corners the child actually pegged; the repeated closing peg is not a new corner. */
export function vertexCount(points) {
  if (!Array.isArray(points) || points.length === 0) return 0;
  return isClosed(points) ? points.length - 1 : points.length;
}

/** Rubber-band segments. An open path of n pegs has n-1; a closed one has n. */
export function edgeCount(points) {
  if (!Array.isArray(points) || points.length < 2) return 0;
  return points.length - 1;
}

export function edgesOf(points) {
  const edges = [];
  for (let index = 0; index + 1 < points.length; index += 1) edges.push([points[index], points[index + 1]]);
  return edges;
}

/* ------------------------------------------------- segment intersection maths */

const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** True when `p` lies on segment a-b, endpoints included. Integer maths only. */
export function pointOnSegment(p, a, b) {
  if (cross(a, b, p) !== 0) return false;
  return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0])
    && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
}

/**
 * Do segments a-b and c-d share ANY point? Touching and collinear overlap count as
 * true; this is the inclusive test, used for pairs of edges that are NOT supposed to
 * meet at all. The proper-crossing case is the general position branch below; the
 * collinear branch is handled by the four point-on-segment tests.
 */
export function segmentsIntersect(a, b, c, d) {
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  return pointOnSegment(a, c, d) || pointOnSegment(b, c, d) || pointOnSegment(c, a, b) || pointOnSegment(d, a, b);
}

/**
 * Does the figure touch itself anywhere it should not?
 *
 * Two edges that meet at a shared corner are allowed to meet THERE and nowhere
 * else — that is what "endpoints shared at a common vertex do not count" means. So:
 *   - neighbouring edges (and, in a closed ring, the first and last edge) conflict
 *     only when one folds back along the other, i.e. when the far endpoint of one
 *     lies on the other segment;
 *   - every other pair conflicts if it shares any point at all, which catches a
 *     proper crossing, a band running through a peg that is already a corner, and
 *     two bands lying on top of each other.
 */
export function hasSelfIntersection(points) {
  const edges = edgesOf(points);
  const closed = isClosed(points);
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      const [a, b] = edges[i];
      const [c, d] = edges[j];
      const neighbours = j === i + 1 || (closed && i === 0 && j === edges.length - 1);
      if (neighbours) {
        // Consecutive edges meet at b/c; the closing pair meets at a/d. Find that
        // shared corner, then look at the two FREE ends: if either free end lies on
        // the other edge the bands overlap instead of just meeting at the corner,
        // which is a fold-back (or a duplicated band) and must be reported.
        const shared = samePoint(b, c) ? b : a;
        const free1 = samePoint(a, shared) ? b : a;
        const free2 = samePoint(c, shared) ? d : c;
        if (pointOnSegment(free2, a, b) || pointOnSegment(free1, c, d)) return true;
        continue;
      }
      if (segmentsIntersect(a, b, c, d)) return true;
    }
  }
  return false;
}

/**
 * Shoelace area, in whole peg-squares.
 *
 * Levels 4 and 5 ("같은 넓이의 서로 다른 모양") need this, so it ships now and is
 * re-checked by the self-test. It measures the ring of DISTINCT corners: a closed
 * figure's repeated final peg is dropped first, and an open path is closed
 * implicitly, because the area of a path is only ever asked for as "the area you
 * would enclose". Levels 1-2 never call it.
 */
export function polygonArea(points) {
  const ring = isClosed(points) ? points.slice(0, -1) : points.slice();
  if (ring.length < 3) return 0;
  let twice = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[(index + 1) % ring.length];
    twice += x1 * y2 - x2 * y1;
  }
  return Math.abs(twice) / 2;
}

/* ----------------------------------------------------------- answer identity */

/**
 * The identity of a FIGURE, independent of where the child started tapping and of
 * which way round they went: the sorted set of unordered edges, plus whether the
 * band is closed. Two answers with the same key are the same rubber-band picture.
 */
export function answerKey(points) {
  const edges = edgesOf(points).map(([a, b]) => {
    const first = pointKey(a);
    const second = pointKey(b);
    return first <= second ? `${first}-${second}` : `${second}-${first}`;
  });
  return `${isClosed(points) ? "closed" : "open"}#${[...edges].sort().join(" ")}`;
}

/** The explicit point list of a problem's target (closing peg repeated if closed). */
export function targetPoints(problem) {
  return problem.kind === "closed" ? [...problem.vertices, problem.vertices[0]] : [...problem.vertices];
}

/**
 * THE acceptance test the engine uses and the validator proves unique.
 * Same open/closed state, same edge set. Nothing else is accepted.
 */
export function acceptsAnswer(problem, points) {
  return answerKey(points) === answerKey(targetPoints(problem));
}

/* ------------------------------------------------------- dihedral canonical key */

/**
 * The eight symmetries of the square peg lattice, as coordinate maps. The board is
 * square, so all eight map the board onto itself and no grid swap is needed; the
 * `grid` argument is still taken so a future non-square board (level 5 talks about
 * arranging several shapes) can extend this list instead of replacing it.
 */
export function latticeTransforms(grid) {
  const maxX = grid.cols - 1;
  const maxY = grid.rows - 1;
  return [
    ([x, y]) => [x, y],
    ([x, y]) => [maxY - y, x],
    ([x, y]) => [maxX - x, maxY - y],
    ([x, y]) => [y, maxX - x],
    ([x, y]) => [maxX - x, y],
    ([x, y]) => [y, x],
    ([x, y]) => [x, maxY - y],
    ([x, y]) => [maxY - y, maxX - x]
  ];
}

/**
 * Pool dedupe key. Two problems that differ only by turning or flipping the whole
 * board are the SAME problem for a learner, so the key is the smallest answer key
 * over all 8 dihedral images of the board.
 */
export function canonicalKey(problem) {
  const points = targetPoints(problem);
  const keys = latticeTransforms(problem.grid).map((map) => answerKey(points.map(map)));
  return keys.sort()[0];
}

/**
 * A stricter identity that ALSO ignores where on the board the figure sits. The
 * house rule only names rotation and reflection, but a pool holding the same
 * triangle twice at two different corners would still bore a child, so the pool is
 * required to be distinct under this key too. Both keys are asserted.
 */
export function shapeKey(problem) {
  const points = targetPoints(problem);
  const keys = latticeTransforms(problem.grid).map((map) => {
    const moved = points.map(map);
    const minX = Math.min(...moved.map((point) => point[0]));
    const minY = Math.min(...moved.map((point) => point[1]));
    return answerKey(moved.map(([x, y]) => [x - minX, y - minY]));
  });
  return keys.sort()[0];
}

/* ------------------------------------------------------------------- authoring */

/** Shape name shown above the model board; derived, so no spec has to repeat it. */
function shapeNameKey(kind, corners) {
  if (kind === "open") return corners === 2 ? "shapeSegment" : "shapePath";
  if (corners === 3) return "shapeTriangle";
  if (corners === 4) return "shapeQuad";
  return "shapePentagon";
}

function makeProblem(level, kind, index, vertices) {
  return {
    id: `geoboard-l${level}-${String(index + 1).padStart(2, "0")}`,
    game: GAME_ID,
    level,
    kind,
    grid: { ...GRID },
    vertices: vertices.map(([x, y]) => [x, y]),
    shapeNameKey: shapeNameKey(kind, vertices.length),
    // Stated per problem so a reviewer reading the data alone sees the rule that
    // validateLevels() then proves.
    validation: { solutionCount: 1, samePosition: true, sameOrientation: true, tapOrderFree: true }
  };
}

/**
 * LEVEL 1 — 점 두 개를 이어 선분과 열린 모양 만들기.
 * Segments first, then two-edge bends, then three-edge open paths. Every entry is
 * OPEN: the first and last peg differ, and the engine refuses to close a level 1
 * band at all. The ten shapes are pairwise non-congruent even after sliding them
 * around the board, which is what the shapeKey assertion checks.
 */
const level1Specs = [
  [[0, 2], [2, 2]],                     // straight segment, 2 across
  [[3, 0], [3, 3]],                     // straight segment, 3 down
  [[1, 1], [1, 3], [3, 3]],             // right-angle bend, both arms 2
  [[1, 1], [3, 3]],                     // slanted segment, 2 across and 2 down
  [[0, 0], [2, 0], [2, 1]],             // right-angle bend, arms 2 and 1
  [[1, 0], [2, 2]],                     // slanted segment, 1 across and 2 down
  [[0, 2], [2, 0], [4, 2]],             // wide V of two slants
  [[0, 0], [1, 0], [1, 1], [2, 1]],     // staircase, three short edges
  [[0, 3], [1, 1], [2, 3], [3, 1]],     // zigzag, three equal slants
  [[0, 4], [0, 2], [2, 2], [3, 3]]      // up, across, then a slant away
];

/**
 * LEVEL 2 — 제시된 삼각형·사각형·오각형을 그대로 만들기.
 * RAY B1-2 p.36 explicitly asks children to make all three polygon families on a
 * geoboard. Every entry is a CLOSED simple polygon, and the child must rebuild it
 * in the same place and orientation. The pool is grouped in fives so the first two
 * sessions establish triangles/quadrilaterals and the third introduces pentagons.
 */
const level2Specs = [
  [[1, 1], [3, 1], [1, 3]],             // right triangle, legs 2 and 2
  [[1, 1], [3, 1], [3, 3], [1, 3]],     // square, side 2
  [[2, 0], [0, 3], [4, 3]],             // isosceles triangle, base 4
  [[0, 1], [3, 1], [3, 3], [0, 3]],     // rectangle, 3 by 2
  [[2, 0], [4, 2], [2, 4], [0, 2]],     // tilted square (diamond)
  [[0, 0], [3, 0], [0, 1]],             // long thin right triangle, legs 3 and 1
  [[0, 3], [1, 1], [3, 1], [2, 3]],     // parallelogram
  [[1, 0], [3, 0], [4, 2], [0, 2]],     // trapezium, parallel sides 2 and 4
  [[0, 0], [4, 1], [2, 3]],             // scalene triangle, no two sides alike
  [[2, 0], [4, 2], [2, 3], [0, 2]],     // kite
  [[1, 4], [1, 2], [2, 0], [3, 2], [3, 4]], // symmetrical house pentagon
  [[0, 4], [0, 1], [2, 0], [4, 2], [3, 4]], // wide asymmetric pentagon
  [[0, 0], [3, 0], [4, 1], [4, 3], [0, 3]], // rectangle with one cut corner
  [[0, 0], [4, 0], [4, 3], [2, 2], [0, 3]], // concave pentagon
  [[1, 0], [4, 1], [3, 4], [1, 3], [0, 1]]  // irregular pentagon
];

/* ------------------------------------------------------------------ level table */

export const levelMeta = [
  { id: 1, kind: "open", titleKey: "level1Title", descKey: "level1Desc", ready: true, problemCount: 10 },
  { id: 2, kind: "closed", titleKey: "level2Title", descKey: "level2Desc", ready: true, problemCount: 15 },
  // Levels 3-5 are source/design-backed but remain locked until their independent
  // enumerators and browser interactions are implemented and verified.
  { id: 3, kind: "square-count", titleKey: "level3Title", descKey: "level3Desc", ready: false },
  { id: 4, kind: "triangle-count", titleKey: "level4Title", descKey: "level4Desc", ready: false },
  { id: 5, kind: "compound-count", titleKey: "level5Title", descKey: "level5Desc", ready: false }
];

const pools = {
  1: level1Specs.map((vertices, index) => makeProblem(1, "open", index, vertices)),
  2: level2Specs.map((vertices, index) => makeProblem(2, "closed", index, vertices))
};

export const levels = levelMeta.map((meta) => ({ ...meta, problems: pools[meta.id] || [] }));

export const readyLevels = levels.filter((level) => level.ready);

/* -------------------------------------------------------------------- validation */

function assert(condition, message) {
  if (!condition) throw new Error(`Geoboard Studio: ${message}`);
}

/**
 * Every legal placement of a target on the board: all 8 dihedral images crossed
 * with every translation that keeps the figure on the lattice. Used to prove that
 * only the shipped placement is accepted.
 */
export function allPlacements(problem) {
  const points = targetPoints(problem);
  const { grid } = problem;
  const seen = new Map();
  latticeTransforms(grid).forEach((map) => {
    const image = points.map(map);
    const minX = Math.min(...image.map((point) => point[0]));
    const maxX = Math.max(...image.map((point) => point[0]));
    const minY = Math.min(...image.map((point) => point[1]));
    const maxY = Math.max(...image.map((point) => point[1]));
    for (let dx = -minX; dx <= grid.cols - 1 - maxX; dx += 1) {
      for (let dy = -minY; dy <= grid.rows - 1 - maxY; dy += 1) {
        const moved = image.map(([x, y]) => [x + dx, y + dy]);
        seen.set(answerKey(moved), moved);
      }
    }
  });
  return [...seen.values()];
}

/**
 * Throws on the first violation. Called at app start-up so a broken pool can never
 * reach a child, and called again by .selftest.mjs before its independent re-check.
 */
export function validateLevels() {
  assert(levels.length === 5, "must declare five levels.");
  assert(levels[0].kind === "open", "level 1 must build OPEN paths.");
  assert(levels[1].kind === "closed", "level 2 must build CLOSED polygons.");

  const seenIds = new Set();

  levels.forEach((level, index) => {
    assert(level.id === index + 1, `level ${index + 1} is numbered ${level.id}.`);
    if (!level.ready) {
      assert(level.problems.length === 0, `level ${level.id} is not ready and must ship no problems.`);
      return;
    }
    assert(level.problems.length === level.problemCount, `level ${level.id} needs a pool of ${level.problemCount}, found ${level.problems.length}.`);

    const canonical = new Map();
    const shapes = new Map();

    level.problems.forEach((problem) => {
      const label = problem.id;
      assert(!seenIds.has(problem.id), `duplicate problem id ${label}.`);
      seenIds.add(problem.id);
      assert(problem.level === level.id, `${label} claims level ${problem.level}.`);
      assert(problem.kind === level.kind, `${label} is a ${problem.kind} figure on a ${level.kind} level.`);
      assert(problem.grid.cols === GRID.cols && problem.grid.rows === GRID.rows, `${label} uses an unexpected board size.`);

      validateFigure(problem);
      validateUniqueness(problem);

      const key = canonicalKey(problem);
      assert(!canonical.has(key), `${label} is a rotation/reflection of ${canonical.get(key)}.`);
      canonical.set(key, label);

      const shape = shapeKey(problem);
      assert(!shapes.has(shape), `${label} is the same figure as ${shapes.get(shape)} moved to another place.`);
      shapes.set(shape, label);
    });

    assert(canonical.size === level.problemCount, `level ${level.id} pool is not ${level.problemCount} canonically distinct problems.`);
  });
  return true;
}

/** Structural rules that hold for every target on every level. */
function validateFigure(problem) {
  const label = problem.id;
  const { vertices, grid, kind } = problem;
  const points = targetPoints(problem);

  assert(Array.isArray(vertices) && vertices.length >= 2, `${label} needs at least two pegs.`);
  vertices.forEach((vertex) => assert(isPeg(vertex, grid), `${label} uses ${JSON.stringify(vertex)}, which is not a peg on the board.`));

  // No repeated vertex: the corner list itself must have no duplicates. (For a
  // closed figure the repeated closing peg lives only in `points`, never here.)
  const cornerIds = new Set(vertices.map(pointKey));
  assert(cornerIds.size === vertices.length, `${label} pegs the same point twice.`);

  const edges = edgesOf(points);
  const edgeIds = new Set();
  edges.forEach(([a, b], index) => {
    assert(!samePoint(a, b), `${label} edge ${index} has zero length.`);
    const id = [pointKey(a), pointKey(b)].sort().join("-");
    assert(!edgeIds.has(id), `${label} draws the band between the same two pegs twice.`);
    edgeIds.add(id);
  });

  assert(!hasSelfIntersection(points), `${label} crosses or touches itself.`);
  assert(vertexCount(points) === vertices.length, `${label} vertexCount disagrees with its corner list.`);

  if (kind === "open") {
    assert(!isClosed(points), `${label} is on level 1 and must stay OPEN.`);
    assert(!samePoint(vertices[0], vertices[vertices.length - 1]), `${label} starts and ends on the same peg.`);
    assert(edgeCount(points) === vertices.length - 1, `${label} open path has the wrong edge count.`);
    assert(vertices.length >= 2 && vertices.length <= 4, `${label} open path should peg 2 to 4 points.`);
  } else {
    assert(isClosed(points), `${label} is on level 2 and must be CLOSED.`);
    assert(vertices.length >= 3, `${label} closed figure needs at least three corners.`);
    assert(vertices.length <= 5, `${label} should be a triangle, quadrilateral, or pentagon.`);
    assert(edgeCount(points) === vertices.length, `${label} closed polygon has the wrong edge count.`);
    assert(polygonArea(points) > 0, `${label} closed polygon encloses no area.`);
  }
}

/**
 * Uniqueness, argued from the acceptance rule.
 *
 * The rule says position and orientation must match, so of all the placements a
 * congruent copy could take on this board exactly one may be accepted. Walking all
 * 8 dihedral images crossed with every translation covers precisely the answers a
 * child could give that are "the right shape in the wrong place or the wrong way
 * round", and none of them may pass. The self-test then repeats this over the FULL
 * candidate space of every figure the board admits, not just the congruent ones.
 *
 * Tap order and direction are free, so a reversed reading and (for a closed figure)
 * every starting corner must still be accepted; that is asserted here too, because
 * an over-strict engine would be just as broken as an over-generous one.
 */
function validateUniqueness(problem) {
  const label = problem.id;
  const points = targetPoints(problem);

  assert(acceptsAnswer(problem, points), `${label} does not accept its own target.`);
  assert(acceptsAnswer(problem, [...points].reverse()), `${label} rejects the target tapped backwards.`);

  if (problem.kind === "closed") {
    const ring = problem.vertices;
    ring.forEach((_, start) => {
      const rotated = [...ring.slice(start), ...ring.slice(0, start)];
      assert(acceptsAnswer(problem, [...rotated, rotated[0]]), `${label} rejects the target started from corner ${start}.`);
    });
  }

  const accepted = allPlacements(problem).filter((candidate) => acceptsAnswer(problem, candidate));
  assert(accepted.length === 1, `${label} accepts ${accepted.length} congruent placements, expected exactly 1.`);
  assert(answerKey(accepted[0]) === answerKey(points), `${label} accepts a placement that is not the shipped one.`);
}
