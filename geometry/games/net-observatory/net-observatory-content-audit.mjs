import { pathToFileURL } from "node:url";
import { levels, VALID_CUBE_NETS, INVALID_CUBE_NETS } from "./levels.js";

const MOVES = [
  { dx: 1, dy: 0, side: "E" }, { dx: -1, dy: 0, side: "W" },
  { dx: 0, dy: 1, side: "S" }, { dx: 0, dy: -1, side: "N" }
];
const DICE_OPPOSITE = new Map([[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]]);
const SOLID_FACTS = new Map([
  ["tetra", { faceShape: "triangle", faces: 4, edges: 6, vertices: 4, adjacent: 3 }],
  ["cube", { faceShape: "square", faces: 6, edges: 12, vertices: 8, adjacent: 4 }],
  ["octa", { faceShape: "triangle", faces: 8, edges: 12, vertices: 6, adjacent: 3 }],
  ["dodeca", { faceShape: "pentagon", faces: 12, edges: 30, vertices: 20, adjacent: 5 }],
  ["icosa", { faceShape: "triangle", faces: 20, edges: 30, vertices: 12, adjacent: 3 }]
]);

const neg = (a) => a.map((value) => -value);
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
const vectorKey = (value) => value.join(",");

function normalize(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

function canonical(cells) {
  const variants = [];
  for (let reflected = 0; reflected < 2; reflected += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      let current = cells.map(([x, y]) => [reflected ? -x : x, y]);
      for (let step = 0; step < turn; step += 1) current = current.map(([x, y]) => [-y, x]);
      variants.push(normalize(current).map((cell) => cell.join(",")).join(";"));
    }
  }
  return variants.sort()[0];
}

function turnFrame(frame, side) {
  const { right, down, normal } = frame;
  if (side === "E") return { right: neg(normal), down, normal: right };
  if (side === "W") return { right: normal, down, normal: neg(right) };
  if (side === "S") return { right, down: neg(normal), normal: down };
  return { right, down: normal, normal: neg(down) };
}

function sameFrame(a, b) {
  return ["right", "down", "normal"].every((axis) => vectorKey(a[axis]) === vectorKey(b[axis]));
}

function independentFold(cells) {
  const foldedCells = normalize(cells);
  if (foldedCells.length !== 6 || new Set(foldedCells.map((cell) => cell.join(","))).size !== 6) return { valid: false };
  const byCell = new Map(foldedCells.map((cell, index) => [cell.join(","), index]));
  const frames = Array(6).fill(null);
  frames[0] = { right: [1, 0, 0], down: [0, 1, 0], normal: [0, 0, 1] };
  const queue = [0];
  while (queue.length) {
    const index = queue.shift();
    const [x, y] = foldedCells[index];
    for (const move of MOVES) {
      const neighbor = byCell.get(`${x + move.dx},${y + move.dy}`);
      if (neighbor === undefined) continue;
      const candidate = turnFrame(frames[index], move.side);
      if (!frames[neighbor]) { frames[neighbor] = candidate; queue.push(neighbor); }
      else if (!sameFrame(frames[neighbor], candidate)) return { valid: false };
    }
  }
  if (frames.some((frame) => !frame)) return { valid: false };
  if (new Set(frames.map((frame) => vectorKey(frame.normal))).size !== 6) return { valid: false };
  return { valid: true, cells: foldedCells, frames };
}

function framedFaces(problem) {
  const folded = independentFold(problem.cells);
  if (!folded.valid) return { valid: false, faces: [] };
  const byCell = new Map(problem.faces.map((face) => [face.cell.join(","), face]));
  return {
    valid: true,
    faces: folded.cells.map((cell, index) => ({ ...byCell.get(cell.join(",")), ...folded.frames[index] }))
  };
}

function arrowVector(face) {
  if (!face.arrow) return null;
  if (face.arrow === "right") return face.right;
  if (face.arrow === "left") return neg(face.right);
  if (face.arrow === "down") return face.down;
  return neg(face.down);
}

function projectArrow(face, screenUp, screenRight) {
  const vector = arrowVector(face);
  if (!vector) return null;
  const vertical = dot(vector, screenUp);
  const horizontal = dot(vector, screenRight);
  if (Math.abs(vertical) > Math.abs(horizontal)) return vertical > 0 ? "up" : "down";
  return horizontal > 0 ? "right" : "left";
}

function independentViews(faces, arrows = false) {
  const views = [];
  for (const top of faces) {
    for (const front of faces.filter((face) => dot(face.normal, top.normal) === 0)) {
      const rightNormal = cross(top.normal, front.normal);
      const right = faces.find((face) => vectorKey(face.normal) === vectorKey(rightNormal));
      const view = { top: top.label, front: front.label, right: right.label };
      if (arrows) {
        view.topArrow = projectArrow(top, neg(front.normal), right.normal);
        view.frontArrow = projectArrow(front, top.normal, right.normal);
        view.rightArrow = projectArrow(right, top.normal, neg(front.normal));
      }
      views.push(view);
    }
  }
  return views;
}

function viewKey(view, arrows = false) {
  const keys = arrows
    ? ["top", "front", "right", "topArrow", "frontArrow", "rightArrow"]
    : ["top", "front", "right"];
  return keys.map((key) => view[key] ?? "-").join("|");
}

function gridDistance(cells, start, target) {
  const occupied = new Set(cells.map((cell) => cell.join(",")));
  const queue = [[start, 0]];
  const visited = new Set([start.join(",")]);
  while (queue.length) {
    const [[x, y], distance] = queue.shift();
    if (`${x},${y}` === target.join(",")) return distance;
    for (const move of MOVES) {
      const next = [x + move.dx, y + move.dy];
      const key = next.join(",");
      if (occupied.has(key) && !visited.has(key)) { visited.add(key); queue.push([next, distance + 1]); }
    }
  }
  return Infinity;
}

function maxStraightRun(cells) {
  const rows = new Map();
  const columns = new Map();
  for (const [x, y] of cells) {
    rows.set(y, (rows.get(y) || 0) + 1);
    columns.set(x, (columns.get(x) || 0) + 1);
  }
  return Math.max(...rows.values(), ...columns.values());
}

function answerIndex(problem) {
  if (["choose-net", "net-opposite", "fold-view", "symbol-view"].includes(problem.interaction)) {
    return problem.choices.findIndex((choice) => choice.id === problem.answer);
  }
  if (problem.interaction === "dice-pair") return problem.answer;
  if (["dice-opposite", "solid-adjacent"].includes(problem.interaction)) return problem.choices.indexOf(problem.answer);
  return problem.choices.findIndex((choice) => choice.id === problem.answer);
}

function choiceKey(problem, choice) {
  if (problem.interaction === "choose-net") return canonical(choice.cells);
  if (problem.interaction === "net-opposite") return choice.label;
  if (["fold-view", "symbol-view"].includes(problem.interaction)) return viewKey(choice, problem.interaction === "symbol-view");
  if (problem.interaction === "dice-pair") return [...choice].sort((a, b) => a - b).join("-");
  if (typeof choice === "object") return choice.id;
  return String(choice);
}

function questionSignature(problem) {
  if (problem.interaction === "choose-net") return `${problem.interaction}|${problem.choices.map((choice) => canonical(choice.cells)).sort().join("/")}`;
  if (["net-opposite", "fold-view", "symbol-view"].includes(problem.interaction)) {
    const faces = problem.faces.map((face) => `${face.cell.join(",")}:${face.label}:${face.arrow || "-"}`).sort().join("/");
    return `${problem.interaction}|${canonical(problem.cells)}|${faces}|${problem.query?.label || "-"}|${problem.choices.map((choice) => choiceKey(problem, choice)).sort().join("/")}`;
  }
  if (problem.interaction === "dice-opposite") return `${problem.interaction}|${problem.face}|${[...problem.choices].sort().join("/")}`;
  if (problem.interaction === "dice-pair") return `${problem.interaction}|${problem.choices.map((choice) => choiceKey(problem, choice)).sort().join("/")}`;
  return `${problem.interaction}|${problem.solid.id}`;
}

function addCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

export function auditNetObservatoryContent(levelData = levels) {
  const errors = [];
  const ids = new Set();
  const signatures = new Map();
  const reports = [];
  const expectedBands = ["bandIntro", "bandBeginner", "bandBeginner", "bandIntermediate", "bandIntermediate"];
  const expectedSteps = { "net-opposite": 2, "choose-net": 3, "dice-opposite": 1, "dice-pair": 1, "symbol-view": 3, "solid-identify": 2, "solid-adjacent": 2 };

  if (levelData.length !== 5) errors.push(`expected 5 levels, found ${levelData.length}`);
  levelData.forEach((level, index) => {
    if (level.bandKey !== expectedBands[index]) errors.push(`level ${level.id}: expected ${expectedBands[index]}, found ${level.bandKey}`);
    if (level.problems.length !== 10) errors.push(`level ${level.id}: expected 10 problems`);
    const positions = new Map();
    const interactions = new Map();

    level.problems.forEach((problem, problemIndex) => {
      if (ids.has(problem.id)) errors.push(`${problem.id}: duplicate id`);
      ids.add(problem.id);
      addCount(interactions, problem.interaction);
      if (!problem.id.startsWith(`net-l${level.id}-`)) errors.push(`${problem.id}: id does not match level ${level.id}`);
      if (!problem.sourceRef?.startsWith("internal-variation;")) errors.push(`${problem.id}: source is not marked as an internal variation`);
      if (problem.reasoningSteps !== expectedSteps[problem.interaction]) errors.push(`${problem.id}: unexpected reasoning step count`);

      const signature = questionSignature(problem);
      if (signatures.has(signature)) errors.push(`${problem.id}: duplicates ${signatures.get(signature)}`);
      signatures.set(signature, problem.id);
      const keys = problem.choices.map((choice) => choiceKey(problem, choice));
      if (new Set(keys).size !== keys.length) errors.push(`${problem.id}: duplicate choices`);
      const position = answerIndex(problem);
      if (position < 0) errors.push(`${problem.id}: answer is missing from choices`);
      else addCount(positions, String(position + 1));

      if (problem.interaction === "choose-net") {
        const valid = problem.choices.filter((choice) => independentFold(choice.cells).valid);
        if (valid.length !== 1 || valid[0].id !== problem.answer) errors.push(`${problem.id}: independent fold does not find one answer`);
        if (problemIndex < 5 && maxStraightRun(valid[0]?.cells || []) < 4) errors.push(`${problem.id}: first-session net is not a simple four-cell strip`);
      } else if (problem.interaction === "net-opposite") {
        const framed = framedFaces(problem);
        if (!framed.valid) errors.push(`${problem.id}: source net does not fold independently`);
        else {
          const query = framed.faces.find((face) => face.label === problem.query.label);
          const opposite = framed.faces.find((face) => dot(face.normal, query.normal) === -1);
          const matches = problem.choices.filter((choice) => choice.label === opposite.label);
          if (matches.length !== 1 || matches[0].id !== problem.answer) errors.push(`${problem.id}: opposite picture answer is not unique`);
          if (gridDistance(problem.cells, query.cell, opposite.cell) > 3) errors.push(`${problem.id}: intro opposite face is more than three flat edges away`);
        }
      } else if (problem.interaction === "symbol-view") {
        const framed = framedFaces(problem);
        const views = framed.valid ? independentViews(framed.faces, true) : [];
        const valid = problem.choices.filter((choice) => views.some((view) => viewKey(view, true) === viewKey(choice, true)));
        const correct = problem.choices.find((choice) => choice.id === problem.answer);
        if (valid.length !== 1 || valid[0]?.id !== problem.answer) errors.push(`${problem.id}: symbol direction answer is not unique`);
        const labelOnlyMatches = problem.choices.filter((choice) => viewKey(choice, false) === viewKey(correct, false)).length;
        if (labelOnlyMatches < 2) errors.push(`${problem.id}: arrows are not needed to distinguish the answer`);
      } else if (problem.interaction === "dice-opposite") {
        if (DICE_OPPOSITE.get(problem.face) !== problem.answer || problem.choices.filter((choice) => choice === problem.answer).length !== 1) errors.push(`${problem.id}: invalid die opposite answer`);
      } else if (problem.interaction === "dice-pair") {
        const valid = problem.choices.map(([a, b], choiceIndex) => DICE_OPPOSITE.get(a) === b ? choiceIndex : -1).filter((choiceIndex) => choiceIndex >= 0);
        if (valid.length !== 1 || valid[0] !== problem.answer) errors.push(`${problem.id}: opposite pair answer is not unique`);
      } else if (["solid-identify", "solid-adjacent"].includes(problem.interaction)) {
        const facts = SOLID_FACTS.get(problem.solid.id);
        if (!facts || Object.entries(facts).some(([key, value]) => problem.solid[key] !== value)) errors.push(`${problem.id}: regular-solid facts differ from the independent table`);
        if (problem.interaction === "solid-identify" && (problem.answer !== problem.solid.id || problem.choices.filter((choice) => choice.id === problem.answer).length !== 1)) errors.push(`${problem.id}: solid identity answer is not unique`);
        if (problem.interaction === "solid-adjacent" && (problem.answer !== facts?.adjacent || problem.choices.filter((choice) => choice === problem.answer).length !== 1)) errors.push(`${problem.id}: adjacent-face answer is not unique`);
      } else {
        errors.push(`${problem.id}: unknown interaction ${problem.interaction}`);
      }
    });

    const positionCounts = [1, 2, 3].map((position) => positions.get(String(position)) || 0);
    if (positionCounts.some((count) => count === 0) || Math.max(...positionCounts) - Math.min(...positionCounts) > 1) errors.push(`level ${level.id}: correct positions are not balanced`);
    reports.push({ level: level.id, band: level.bandKey, problems: level.problems.length, interactions: Object.fromEntries(interactions), correctPositions: Object.fromEntries([...positions].sort()) });
  });

  const allShapes = [...VALID_CUBE_NETS, ...INVALID_CUBE_NETS];
  const independentlyValid = allShapes.filter((shape) => independentFold(shape).valid).map(canonical).sort();
  const declaredValid = VALID_CUBE_NETS.map(canonical).sort();
  if (allShapes.length !== 35 || independentlyValid.length !== 11 || independentlyValid.join("|") !== declaredValid.join("|")) errors.push("independent cube-net classification does not match 35 free hexominoes and 11 valid nets");
  if (ids.size !== 50) errors.push(`expected 50 unique ids, found ${ids.size}`);
  if (errors.length) throw new AggregateError(errors.map((message) => new Error(message)), `Net-observatory content audit failed with ${errors.length} error(s)`);

  return { levels: levelData.length, problems: ids.size, uniqueQuestions: signatures.size, singleAnswerProblems: ids.size, independentCubeNets: independentlyValid.length, sourceClassification: "internal-variation", reports };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(auditNetObservatoryContent(), null, 2));
}
