// 큐브 조각 연구소 (Cube Piece Lab)
//
// A target solid is shown with one region missing (the "gap"). The child studies
// the hole, mentally rotates the candidate pieces, and chooses the ONE piece that
// slots in to complete the target — "여러 조각을 회전하고 이어 붙여 목표 모양을 만들어요".
//
// A problem is authored as:
//   box        = [W, D, H]      the bounding grid  (x: 0..W-1 left→right,
//                                                   y: 0..H-1 bottom→top,
//                                                   z: 0..D-1 back→front)
//   base       = [[x,y,z], ...] the cubes already assembled on the stage
//   gap        = [[x,y,z], ...] the missing cubes (their shape is the answer)
//   distractors= [ [[x,y,z],...], ... ] loose pieces that DON'T fit the gap
//   spin       = a rotation index; the correct piece is the gap rotated by `spin`
//                so it is shown in a different orientation and the child must
//                mentally rotate it back.
//   correctAt  = the slot the correct piece takes among the options.
//
// The correct option is never hand-authored — it is generated as a genuine
// rotation of the gap, so it is congruent to the gap by construction (no risk of
// a mirror-image / chirality slip). validateLevels() then proves every problem
// has exactly one fitting piece and no two look-alike options.

const keyOf = (x, y, z) => `${x},${y},${z}`;

// --- the 24 rotations of the cube, generated once by group closure ----------
const rotX = ([x, y, z]) => [x, -z, y];
const rotY = ([x, y, z]) => [z, y, -x];
const rotZ = ([x, y, z]) => [-y, x, z];

function buildRotations() {
  const basis = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const sign = (r) => r.map((v) => v.join(",")).join("|");
  const seen = new Map();
  const queue = [basis];
  seen.set(sign(basis), basis);
  while (queue.length) {
    const current = queue.shift();
    [rotX, rotY, rotZ].forEach((rot) => {
      const next = current.map(rot);
      const id = sign(next);
      if (!seen.has(id)) { seen.set(id, next); queue.push(next); }
    });
  }
  return [...seen.values()].map((m) => ([x, y, z]) => [
    m[0][0] * x + m[1][0] * y + m[2][0] * z,
    m[0][1] * x + m[1][1] * y + m[2][1] * z,
    m[0][2] * x + m[1][2] * y + m[2][2] * z
  ]);
}

const ROTATIONS = buildRotations();

// Translate a cell list so its minimum corner sits at the origin, then sort.
function normalize(cells) {
  let mx = Infinity, my = Infinity, mz = Infinity;
  cells.forEach(([x, y, z]) => { mx = Math.min(mx, x); my = Math.min(my, y); mz = Math.min(mz, z); });
  return cells
    .map(([x, y, z]) => [x - mx, y - my, z - mz])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

const stringify = (cells) => cells.map((c) => c.join(",")).join(";");

// The canonical form is the lexicographically smallest normalized string over
// all 24 rotations — two piece shapes are congruent iff their canonicals match.
export function canonical(cells) {
  let best = null;
  ROTATIONS.forEach((rot) => {
    const form = stringify(normalize(cells.map(rot)));
    if (best === null || form < best) best = form;
  });
  return best;
}

export const congruent = (a, b) => canonical(a) === canonical(b);

// Rotate a piece by rotation index `i` and normalize it to the origin — used to
// present the correct piece in a rotated orientation.
export function orient(cells, i) {
  return normalize(cells.map(ROTATIONS[i % ROTATIONS.length]));
}

const makeProblem = (id, level, box, base, gap, distractors, correctAt, spin) => {
  const [width, depth, height] = box;
  const inside = ([x, y, z]) => x >= 0 && x < width && y >= 0 && y < height && z >= 0 && z < depth;
  const all = [...base, ...gap];
  all.forEach((cell) => { if (!inside(cell)) throw new Error(`${id}: cell ${cell} is outside the box`); });
  const seen = new Set();
  all.forEach((cell) => {
    const k = keyOf(...cell);
    if (seen.has(k)) throw new Error(`${id}: base and gap overlap at ${cell}`);
    seen.add(k);
  });
  const gapForm = canonical(gap);
  distractors.forEach((piece, index) => {
    if (canonical(piece) === gapForm) throw new Error(`${id}: distractor ${index} actually fits the gap`);
  });
  const correctPiece = orient(gap, spin);
  const options = [...distractors];
  options.splice(correctAt, 0, correctPiece);
  return {
    id,
    level,
    box,
    base,
    gap,
    options,
    answer: { correct: correctAt }
  };
};

export const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      // A 2×2 wall with one corner cube missing → a single loose cube fits.
      makeProblem("piece-l1-01", 1, [2, 1, 2],
        [[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[1, 1, 0]],
        [[[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0]]], 0, 0),
      // A 3-wide, 2-tall wall missing the top-right two cubes → a domino fits.
      makeProblem("piece-l1-02", 1, [3, 1, 2],
        [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]], [[1, 1, 0], [2, 1, 0]],
        [[[0, 0, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0]]], 1, 5),
      // Bottom row of a wall notched out → a horizontal domino fits.
      makeProblem("piece-l1-03", 1, [3, 1, 2],
        [[0, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0]], [[1, 0, 0], [2, 0, 0]],
        [[[0, 0, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0]]], 2, 0),
      // Two cubes missing stacked at the right → a vertical domino fits.
      makeProblem("piece-l1-04", 1, [2, 1, 2],
        [[0, 0, 0], [0, 1, 0]], [[1, 0, 0], [1, 1, 0]],
        [[[0, 0, 0]], [[0, 0, 0], [1, 0, 0], [1, 1, 0]]], 1, 0)
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      // Trominoes. In 3D there are only two tromino shapes — straight (I) and
      // corner (L) — so each set pairs the two of them with one larger piece and
      // the child must tell I from L. Correct piece shown rotated.
      makeProblem("piece-l2-01", 2, [3, 1, 2],
        [[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 1, 0], [1, 1, 0], [2, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]]], 0, 1),
      makeProblem("piece-l2-02", 2, [3, 1, 2],
        [[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[2, 0, 0], [2, 1, 0], [1, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]]], 1, 2),
      makeProblem("piece-l2-03", 2, [3, 1, 2],
        [[0, 1, 0], [1, 1, 0], [2, 1, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
        [[[0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]]], 2, 5),
      makeProblem("piece-l2-04", 2, [3, 1, 2],
        [[0, 0, 0], [0, 1, 0], [1, 1, 0]], [[1, 0, 0], [2, 0, 0], [2, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 2, 0]]], 0, 2)
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      // Size-4 tetrominoes. Gap is an I-tetromino; distractors L and square.
      makeProblem("piece-l3-01", 3, [4, 1, 2],
        [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]], [[0, 1, 0], [1, 1, 0], [2, 1, 0], [3, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]]], 0, 5),
      // Gap is a T-tetromino cut from a 3×3 wall; distractors L and square.
      makeProblem("piece-l3-02", 3, [3, 1, 3],
        [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 2, 0], [2, 2, 0]], [[0, 1, 0], [1, 1, 0], [2, 1, 0], [1, 2, 0]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]]], 1, 1),
      // Gap is a skew S-tetromino; distractors square and L.
      makeProblem("piece-l3-03", 3, [4, 1, 2],
        [[0, 0, 0], [3, 0, 0], [2, 1, 0], [3, 1, 0]], [[1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]]], 2, 4),
      // Gap is a 2×2 square tetromino; distractors T and I.
      makeProblem("piece-l3-04", 3, [4, 1, 2],
        [[0, 0, 0], [3, 0, 0], [0, 1, 0], [3, 1, 0]], [[1, 0, 0], [2, 0, 0], [1, 1, 0], [2, 1, 0]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]]], 0, 0)
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      // True 3D pieces now. The socket (hole) shows the missing shape; the child
      // rotates a loose piece in their head to match it.
      // Gap is a corner "tripod" tetromino; distractors a flat square and flat L.
      makeProblem("piece-l4-01", 4, [2, 2, 2],
        [[0, 1, 1], [1, 1, 0], [1, 0, 1], [1, 1, 1]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
        [[[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]]], 0, 6),
      // Gap is a 3D staircase tetromino; distractors a flat S and a 3D tripod.
      makeProblem("piece-l4-02", 4, [2, 2, 2],
        [[0, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]],
        [[[0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]], 1, 9),
      // Gap is a 3D twist tetromino; distractors a flat T and a 3D staircase.
      makeProblem("piece-l4-03", 4, [2, 2, 2],
        [[0, 1, 0], [0, 0, 1], [0, 1, 1], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [1, 1, 1]],
        [[[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]], [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]]], 2, 4),
      // Gap is a tripod again on a smaller solid; both distractors are 3D now.
      makeProblem("piece-l4-04", 4, [2, 2, 2],
        [[1, 1, 0], [1, 0, 1]], [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
        [[[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [1, 1, 1]]], 1, 3)
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      // Hardest: 3D pentominoes, and every distractor is a different 3D pentomino
      // so only careful mental rotation tells them apart.
      makeProblem("piece-l5-01", 5, [2, 2, 2],
        [[0, 1, 1], [1, 0, 0], [1, 1, 1]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 1], [1, 1, 0]],
        [[[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 1, 0], [2, 1, 0]]], 2, 7),
      makeProblem("piece-l5-02", 5, [2, 2, 2],
        [[1, 1, 0], [1, 0, 1], [1, 1, 1]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]],
        [[[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [2, 0, 0]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 1], [1, 1, 0]]], 0, 8),
      makeProblem("piece-l5-03", 5, [3, 2, 2],
        [[0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 1], [2, 0, 0], [2, 0, 1], [2, 1, 1]],
        [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 1, 0], [2, 1, 0]],
        [[[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 0, 1], [2, 0, 0]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]]], 1, 5),
      makeProblem("piece-l5-04", 5, [3, 2, 2],
        [[0, 0, 1], [0, 1, 1], [1, 1, 0], [1, 1, 1], [2, 1, 0], [2, 0, 1], [2, 1, 1]],
        [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 0, 1], [2, 0, 0]],
        [[[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 1], [1, 1, 0]], [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [2, 0, 0]]], 2, 6)
    ]
  }
];

export function validateLevels() {
  if (levels.length !== 5) throw new Error("cube-piece-lab requires five levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    level.problems.forEach((problem) => {
      const [width, depth, height] = problem.box;
      if (width > 4 || depth > 4 || height > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.options.length < 3) throw new Error(`${problem.id} needs at least three options`);
      const gapForm = canonical(problem.gap);
      const fits = problem.options.filter((piece) => canonical(piece) === gapForm).length;
      if (fits !== 1) throw new Error(`${problem.id} must have exactly one fitting piece (found ${fits})`);
      if (canonical(problem.options[problem.answer.correct]) !== gapForm) throw new Error(`${problem.id} correct index does not fit`);
      // no two options may look identical after rotation
      const forms = problem.options.map(canonical);
      for (let i = 0; i < forms.length; i += 1) {
        for (let j = i + 1; j < forms.length; j += 1) {
          if (forms[i] === forms[j]) throw new Error(`${problem.id} has two look-alike options (${i},${j})`);
        }
      }
      if (problem.gap.length < 1) throw new Error(`${problem.id} has no gap`);
    });
  });
}
