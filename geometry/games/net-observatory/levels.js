export const GAME_ID = "net-observatory";
export const PROGRESS_KEY = "geometry-net-observatory";

const V = {
  add: (a, b) => a.map((value, index) => value + b[index]),
  neg: (a) => a.map((value) => -value),
  dot: (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0),
  cross: (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
  key: (a) => a.join(",")
};

const DIRECTIONS = [
  { dx: 1, dy: 0, side: "right" },
  { dx: -1, dy: 0, side: "left" },
  { dx: 0, dy: 1, side: "down" },
  { dx: 0, dy: -1, side: "up" }
];

export function normalizeCells(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

const cellsKey = (cells) => normalizeCells(cells).map((cell) => cell.join(",")).join(";");

function transformCells(cells, transform) {
  return normalizeCells(cells.map(([x, y]) => transform(x, y)));
}

export function canonicalCells(cells) {
  const variants = [
    (x, y) => [x, y], (x, y) => [-y, x], (x, y) => [-x, -y], (x, y) => [y, -x],
    (x, y) => [-x, y], (x, y) => [-y, -x], (x, y) => [x, -y], (x, y) => [y, x]
  ];
  return variants.map((fn) => cellsKey(transformCells(cells, fn))).sort()[0];
}

export function enumerateFreePolyominoes(size) {
  let shapes = [[[0, 0]]];
  for (let count = 1; count < size; count += 1) {
    const next = new Map();
    shapes.forEach((shape) => {
      const occupied = new Set(shape.map((cell) => cell.join(",")));
      shape.forEach(([x, y]) => {
        DIRECTIONS.forEach(({ dx, dy }) => {
          const candidate = [x + dx, y + dy];
          if (occupied.has(candidate.join(","))) return;
          const grown = normalizeCells([...shape, candidate]);
          next.set(canonicalCells(grown), grown);
        });
      });
    });
    shapes = [...next.values()].sort((a, b) => canonicalCells(a).localeCompare(canonicalCells(b)));
  }
  return shapes;
}

function foldNeighbor(frame, side) {
  const { u, v, n } = frame;
  if (side === "right") return { u: V.neg(n), v, n: u };
  if (side === "left") return { u: n, v, n: V.neg(u) };
  if (side === "down") return { u, v: V.neg(n), n: v };
  return { u, v: n, n: V.neg(v) };
}

export function foldCubeNet(cells) {
  const normalized = normalizeCells(cells);
  if (normalized.length !== 6 || new Set(normalized.map((cell) => cell.join(","))).size !== 6) {
    return { valid: false, reason: "face-count", frames: [] };
  }
  const byCell = new Map(normalized.map((cell, index) => [cell.join(","), index]));
  const frames = Array(normalized.length).fill(null);
  frames[0] = { u: [1, 0, 0], v: [0, 1, 0], n: [0, 0, 1] };
  const queue = [0];
  while (queue.length) {
    const index = queue.shift();
    const [x, y] = normalized[index];
    for (const direction of DIRECTIONS) {
      const neighbor = byCell.get(`${x + direction.dx},${y + direction.dy}`);
      if (neighbor === undefined) continue;
      const candidate = foldNeighbor(frames[index], direction.side);
      if (!frames[neighbor]) {
        frames[neighbor] = candidate;
        queue.push(neighbor);
      } else if (["u", "v", "n"].some((axis) => V.key(frames[neighbor][axis]) !== V.key(candidate[axis]))) {
        return { valid: false, reason: "fold-conflict", cells: normalized, frames };
      }
    }
  }
  if (frames.some((frame) => !frame)) return { valid: false, reason: "disconnected", cells: normalized, frames };
  const normals = frames.map((frame) => V.key(frame.n));
  if (new Set(normals).size !== 6) return { valid: false, reason: "overlap", cells: normalized, frames };
  return { valid: true, reason: "ok", cells: normalized, frames };
}

const ALL_HEXOMINOES = enumerateFreePolyominoes(6);
export const VALID_CUBE_NETS = ALL_HEXOMINOES.filter((shape) => foldCubeNet(shape).valid);
export const INVALID_CUBE_NETS = ALL_HEXOMINOES.filter((shape) => !foldCubeNet(shape).valid);

const labels = ["A", "B", "C", "D", "E", "F"];
const positionMarks = ["●", "◆", "✚", "✿", "★", "◎"];
const colors = ["#f2b84b", "#49aeca", "#79bd68", "#ee7568", "#9d89d5", "#f2d45c"];

function decorateNet(cells, seed, symbols = false) {
  const folded = foldCubeNet(cells);
  const order = folded.cells.map((cell, index) => ({
    cell,
    label: (symbols ? labels : positionMarks)[(index + seed) % labels.length],
    color: colors[(index * 5 + seed) % colors.length],
    arrow: symbols ? ["up", "right", "down", "left"][(index + seed * 3) % 4] : null,
    frame: folded.frames[index]
  }));
  return order;
}

function labelAtNormal(faces, normal) {
  return faces.find((face) => V.key(face.frame.n) === V.key(normal));
}

export function cubeViews(faces, includeArrows = false) {
  const normals = faces.map((face) => face.frame.n);
  const views = [];
  normals.forEach((top) => {
    normals.filter((front) => V.dot(top, front) === 0).forEach((front) => {
      const right = V.cross(top, front);
      const topFace = labelAtNormal(faces, top);
      const frontFace = labelAtNormal(faces, front);
      const rightFace = labelAtNormal(faces, right);
      const view = {
        top: topFace.label,
        front: frontFace.label,
        right: rightFace.label
      };
      if (includeArrows) {
        view.topArrow = projectedArrow(topFace, V.neg(front), right);
        view.frontArrow = projectedArrow(frontFace, top, right);
        view.rightArrow = projectedArrow(rightFace, top, V.neg(front));
      }
      views.push(view);
    });
  });
  return views;
}

function arrowVector(face) {
  if (face.arrow === "right") return face.frame.u;
  if (face.arrow === "left") return V.neg(face.frame.u);
  if (face.arrow === "down") return face.frame.v;
  return V.neg(face.frame.v);
}

function projectedArrow(face, screenUp, screenRight) {
  const vector = arrowVector(face);
  const vertical = V.dot(vector, screenUp);
  const horizontal = V.dot(vector, screenRight);
  if (Math.abs(vertical) > Math.abs(horizontal)) return vertical > 0 ? "up" : "down";
  return horizontal > 0 ? "right" : "left";
}

const sameView = (a, b, arrows = false) => {
  const keys = arrows
    ? ["top", "front", "right", "topArrow", "frontArrow", "rightArrow"]
    : ["top", "front", "right"];
  return keys.every((key) => a[key] === b[key]);
};

export function isPossibleCubeView(faces, view, arrows = false) {
  return cubeViews(faces, arrows).some((candidate) => sameView(candidate, view, arrows));
}

function level1Problems() {
  return Array.from({ length: 10 }, (_, index) => {
    const answer = VALID_CUBE_NETS[index];
    const wrongA = INVALID_CUBE_NETS[(index * 2) % INVALID_CUBE_NETS.length];
    const wrongB = INVALID_CUBE_NETS[(index * 2 + 7) % INVALID_CUBE_NETS.length];
    const rawChoices = [answer, wrongA, wrongB];
    const offset = index % 3;
    const choices = rawChoices
      .map((_, choiceIndex) => rawChoices[(choiceIndex + offset) % 3])
      .map((cells, choiceIndex) => ({ id: `c${choiceIndex}`, cells, valid: foldCubeNet(cells).valid }));
    return {
      id: `net-l1-${String(index + 1).padStart(2, "0")}`,
      interaction: "choose-net",
      promptKey: "promptValidNet",
      sourceRef: "Prism D4-1, book p.30-33; internally reconstructed hexominoes",
      choices,
      answer: choices.find((choice) => choice.valid).id
    };
  });
}

function oppositeFaceProblems() {
  return Array.from({ length: 10 }, (_, index) => {
    const cells = VALID_CUBE_NETS[index % VALID_CUBE_NETS.length];
    const faces = decorateNet(cells, index, false);
    const query = faces[(index * 2 + 1) % faces.length];
    const opposite = faces.find((face) => V.dot(face.frame.n, query.frame.n) === -1);
    const adjacent = faces.filter((face) => face !== query && face !== opposite);
    const rawChoices = [opposite, adjacent[index % adjacent.length], adjacent[(index + 2) % adjacent.length]];
    const offset = index % rawChoices.length;
    const choices = rawChoices.map((_, choiceIndex) => rawChoices[(choiceIndex + offset) % rawChoices.length])
      .map(({ label, color }, choiceIndex) => ({ id: `f${choiceIndex}`, label, color }));
    return {
      id: `net-l2-${String(index + 1).padStart(2, "0")}`,
      interaction: "net-opposite",
      promptKey: "promptNetOpposite",
      sourceRef: "User-provided cube-net references; independently reconstructed picture-face relation",
      cells,
      faces: faces.map(({ cell, label, color }) => ({ cell, label, color })),
      query: { label: query.label, color: query.color },
      choices,
      answer: choices.find((choice) => choice.label === opposite.label).id
    };
  });
}

function makeViewDistractors(correct, faces, arrows = false) {
  const opposite = (label) => {
    const face = faces.find((item) => item.label === label);
    return faces.find((item) => V.dot(item.frame.n, face.frame.n) === -1).label;
  };
  const mirrored = { ...correct, front: correct.right, right: correct.front };
  const impossible = { ...correct, right: opposite(correct.right) };
  if (arrows) {
    mirrored.frontArrow = correct.rightArrow;
    mirrored.rightArrow = correct.frontArrow;
    impossible.rightArrow = correct.rightArrow;
  }
  return [mirrored, impossible];
}

function viewProblems(level, arrows = false) {
  return Array.from({ length: 10 }, (_, index) => {
    const cells = VALID_CUBE_NETS[(index + (arrows ? 1 : 0)) % VALID_CUBE_NETS.length];
    const faces = decorateNet(cells, index + (arrows ? 2 : 0), arrows);
    const possible = cubeViews(faces, arrows);
    const correct = possible[(index * 5 + 3) % possible.length];
    const distractors = makeViewDistractors(correct, faces, arrows);
    const raw = [correct, ...distractors];
    const offset = index % 3;
    const choices = raw.map((_, choiceIndex) => raw[(choiceIndex + offset) % 3]).map((view, choiceIndex) => ({
      id: `v${choiceIndex}`,
      ...view
    }));
    const answer = choices.find((choice) => isPossibleCubeView(faces, choice, arrows)).id;
    return {
      id: `net-l${level}-${String(index + 1).padStart(2, "0")}`,
      interaction: arrows ? "symbol-view" : "fold-view",
      promptKey: arrows ? "promptSymbolView" : "promptFoldView",
      sourceRef: arrows
        ? "Prism E4-1, book p.15-24; internally reconstructed symbols"
        : "Prism D4-1, book p.30-41 and Prism E4-1, book p.7-14; internally reconstructed nets",
      cells,
      faces: faces.map(({ cell, label, color, arrow }) => ({ cell, label, color, arrow })),
      choices,
      answer
    };
  });
}

const DICE_OPPOSITE = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };

function diceProblems() {
  const problems = [];
  for (let index = 0; index < 5; index += 1) {
    const face = index + 1;
    const correct = DICE_OPPOSITE[face];
    const values = [correct, ((correct + index) % 6) + 1, ((correct + index + 2) % 6) + 1]
      .filter((value, at, list) => value !== face && list.indexOf(value) === at);
    while (values.length < 3) {
      const candidate = ((values.at(-1) || 0) % 6) + 1;
      if (candidate !== face && !values.includes(candidate)) values.push(candidate);
    }
    const offset = index % 3;
    const choices = values.map((_, at) => values[(at + offset) % 3]);
    problems.push({
      id: `net-l3-${String(index + 1).padStart(2, "0")}`,
      interaction: "dice-opposite",
      promptKey: "promptDiceOpposite",
      sourceRef: "Prism E4-1, book p.7-12; opposite faces total seven",
      face,
      choices,
      answer: correct
    });
  }
  const pairs = [[1, 6], [2, 5], [3, 4], [6, 1], [5, 2]];
  pairs.forEach((answerPair, index) => {
    const distractors = [[answerPair[0], (answerPair[1] % 6) + 1], [((answerPair[0] + 1) % 6) + 1, answerPair[1]]]
      .map((pair) => pair[0] === pair[1] ? [pair[0], (pair[1] % 6) + 1] : pair);
    const raw = [answerPair, ...distractors];
    const offset = (index + 1) % 3;
    const choices = raw.map((_, at) => raw[(at + offset) % 3]);
    problems.push({
      id: `net-l3-${String(index + 6).padStart(2, "0")}`,
      interaction: "dice-pair",
      promptKey: "promptDicePair",
      sourceRef: "Prism E4-1, book p.7-12; opposite-face relation",
      choices,
      answer: choices.findIndex(([a, b]) => DICE_OPPOSITE[a] === b)
    });
  });
  return problems;
}

export const SOLIDS = [
  { id: "tetra", nameKey: "solidTetra", faceShape: "triangle", faces: 4, edges: 6, vertices: 4, adjacent: 3 },
  { id: "cube", nameKey: "solidCube", faceShape: "square", faces: 6, edges: 12, vertices: 8, adjacent: 4 },
  { id: "octa", nameKey: "solidOcta", faceShape: "triangle", faces: 8, edges: 12, vertices: 6, adjacent: 3 },
  { id: "dodeca", nameKey: "solidDodeca", faceShape: "pentagon", faces: 12, edges: 30, vertices: 20, adjacent: 5 },
  { id: "icosa", nameKey: "solidIcosa", faceShape: "triangle", faces: 20, edges: 30, vertices: 12, adjacent: 3 }
];

function solidProblems() {
  const identify = SOLIDS.map((solid, index) => {
    const choices = [solid, SOLIDS[(index + 1) % SOLIDS.length], SOLIDS[(index + 2) % SOLIDS.length]];
    const offset = index % 3;
    const arranged = choices.map((_, at) => choices[(at + offset) % 3]);
    return {
      id: `net-l5-${String(index + 1).padStart(2, "0")}`,
      interaction: "solid-identify",
      promptKey: "promptSolidIdentify",
      sourceRef: "Prism D4-1, book p.8-17; regular-solid face counts",
      solid,
      choices: arranged.map(({ id, nameKey }) => ({ id, nameKey })),
      answer: solid.id
    };
  });
  const relations = SOLIDS.map((solid, index) => {
    const raw = [solid.adjacent, Math.max(2, solid.adjacent - 1), solid.adjacent + 1];
    const choices = [...new Set(raw)];
    while (choices.length < 3) choices.push(choices.at(-1) + 1);
    const offset = (index + 1) % 3;
    const arranged = choices.map((_, at) => choices[(at + offset) % 3]);
    return {
      id: `net-l5-${String(index + 6).padStart(2, "0")}`,
      interaction: "solid-adjacent",
      promptKey: "promptSolidAdjacent",
      sourceRef: "Prism D4-1, book p.8-17; regular-solid face relations",
      solid,
      choices: arranged,
      answer: solid.adjacent
    };
  });
  return [...identify, ...relations];
}

export const levels = [
  { id: 1, bandKey: "bandIntro", titleKey: "level1Title", subtitleKey: "level1Subtitle", ready: true, problems: level1Problems() },
  { id: 2, bandKey: "bandIntro", titleKey: "level2Title", subtitleKey: "level2Subtitle", ready: true, problems: oppositeFaceProblems() },
  { id: 3, bandKey: "bandBeginner", titleKey: "level3Title", subtitleKey: "level3Subtitle", ready: true, problems: diceProblems() },
  { id: 4, bandKey: "bandBeginner", titleKey: "level4Title", subtitleKey: "level4Subtitle", ready: true, problems: viewProblems(4, true) },
  { id: 5, bandKey: "bandIntermediate", titleKey: "level5Title", subtitleKey: "level5Subtitle", ready: true, problems: solidProblems() }
];

export const readyLevels = levels.filter((level) => level.ready);

function validateProblem(problem, level) {
  if (!problem.id || !problem.interaction || !problem.sourceRef) throw new Error(`Incomplete problem in level ${level.id}`);
  if (problem.interaction === "choose-net") {
    const validChoices = problem.choices.filter((choice) => foldCubeNet(choice.cells).valid);
    if (validChoices.length !== 1 || validChoices[0].id !== problem.answer) throw new Error(`${problem.id}: cube-net answer is not unique`);
  }
  if (problem.interaction === "net-opposite") {
    const folded = foldCubeNet(problem.cells);
    if (!folded.valid) throw new Error(`${problem.id}: invalid source net`);
    const faceMap = new Map(problem.faces.map((face) => [face.cell.join(","), face]));
    const framedFaces = folded.cells.map((cell, index) => ({ ...faceMap.get(cell.join(",")), frame: folded.frames[index] }));
    const query = framedFaces.find((face) => face.label === problem.query.label);
    const opposite = framedFaces.find((face) => V.dot(face.frame.n, query.frame.n) === -1);
    const valid = problem.choices.filter((choice) => choice.label === opposite.label);
    if (valid.length !== 1 || valid[0].id !== problem.answer) throw new Error(`${problem.id}: opposite picture face is not unique`);
  }
  if (problem.interaction === "fold-view" || problem.interaction === "symbol-view") {
    const folded = foldCubeNet(problem.cells);
    if (!folded.valid) throw new Error(`${problem.id}: invalid source net`);
    const faceMap = new Map(problem.faces.map((face) => [face.cell.join(","), face]));
    const sourceFaces = folded.cells.map((cell, index) => ({ ...faceMap.get(cell.join(",")), frame: folded.frames[index] }));
    const arrows = problem.interaction === "symbol-view";
    const possible = problem.choices.filter((choice) => isPossibleCubeView(sourceFaces, choice, arrows));
    if (possible.length !== 1 || possible[0].id !== problem.answer) throw new Error(`${problem.id}: folded view is not unique`);
  }
  if (problem.interaction === "dice-opposite" || problem.interaction === "dice-pair") {
    if (problem.interaction === "dice-opposite") {
      if (DICE_OPPOSITE[problem.face] !== problem.answer || problem.choices.filter((value) => value === problem.answer).length !== 1) throw new Error(`${problem.id}: invalid opposite face`);
    } else {
      const valid = problem.choices.filter(([a, b]) => DICE_OPPOSITE[a] === b);
      if (valid.length !== 1 || problem.choices[problem.answer] !== valid[0]) throw new Error(`${problem.id}: opposite pair is not unique`);
    }
  }
  if (problem.interaction === "solid-identify" || problem.interaction === "solid-adjacent") {
    const solid = SOLIDS.find((item) => item.id === problem.solid.id);
    if (!solid || solid.vertices - solid.edges + solid.faces !== 2) throw new Error(`${problem.id}: invalid regular solid`);
    if (problem.interaction === "solid-identify" && problem.choices.filter((choice) => choice.id === problem.answer).length !== 1) throw new Error(`${problem.id}: solid answer is not unique`);
    if (problem.interaction === "solid-adjacent" && problem.choices.filter((value) => value === problem.answer).length !== 1) throw new Error(`${problem.id}: adjacent answer is not unique`);
  }
}

export function validateLevels() {
  if (ALL_HEXOMINOES.length !== 35) throw new Error(`Expected 35 free hexominoes, got ${ALL_HEXOMINOES.length}`);
  if (VALID_CUBE_NETS.length !== 11) throw new Error(`Expected 11 cube nets, got ${VALID_CUBE_NETS.length}`);
  const ids = new Set();
  levels.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`Level ${level.id} must have 10 problems`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate problem id ${problem.id}`);
      ids.add(problem.id);
      validateProblem(problem, level);
    });
  });
  return { problems: ids.size, hexominoes: ALL_HEXOMINOES.length, cubeNets: VALID_CUBE_NETS.length };
}
