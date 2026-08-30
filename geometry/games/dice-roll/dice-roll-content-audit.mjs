import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";

const FACE_NORMALS = Object.freeze({
  top: [0, 1, 0],
  bottom: [0, -1, 0],
  north: [0, 0, -1],
  south: [0, 0, 1],
  east: [1, 0, 0],
  west: [-1, 0, 0]
});
const NORMAL_TO_FACE = new Map(Object.entries(FACE_NORMALS).map(([face, normal]) => [normal.join(","), face]));
const DELTAS = Object.freeze({ N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] });

function rotateNormal([x, y, z], direction) {
  if (direction === "N") return [x, z, -y];
  if (direction === "S") return [x, -z, y];
  if (direction === "E") return [y, -x, z];
  if (direction === "W") return [-y, x, z];
  throw new Error(`unknown direction ${direction}`);
}

function independentRoll(orientation, direction) {
  const next = {};
  for (const [face, value] of Object.entries(orientation)) {
    const normal = rotateNormal(FACE_NORMALS[face], direction);
    next[NORMAL_TO_FACE.get(normal.join(","))] = value;
  }
  return next;
}

function independentRollMany(orientation, directions) {
  return directions.reduce(independentRoll, { ...orientation });
}

function orientationKey(orientation) {
  return ["top", "bottom", "north", "south", "east", "west"].map((face) => orientation[face]).join("-");
}

function visibleKey(orientation) {
  return [orientation.top, orientation.south, orientation.east].join("-");
}

function sameOrientation(left, right) {
  return orientationKey(left) === orientationKey(right);
}

function assertValidOrientation(orientation, label, errors) {
  const values = Object.values(orientation).sort((a, b) => a - b);
  if (values.join(",") !== "1,2,3,4,5,6") errors.push(`${label}: faces are not 1 through 6`);
  for (const [a, b] of [["top", "bottom"], ["north", "south"], ["east", "west"]]) {
    if (orientation[a] + orientation[b] !== 7) errors.push(`${label}: ${a}/${b} are not opposite faces`);
  }
}

function tracePath(start, directions, rows, cols, label, errors) {
  const path = [[...start]];
  for (const direction of directions) {
    const delta = DELTAS[direction];
    if (!delta) {
      errors.push(`${label}: unknown direction ${direction}`);
      continue;
    }
    const [row, col] = path.at(-1);
    path.push([row + delta[0], col + delta[1]]);
  }
  for (const [row, col] of path) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= rows || col < 0 || col >= cols) {
      errors.push(`${label}: path leaves the ${rows}x${cols} board at ${row},${col}`);
    }
  }
  return path;
}

function pathsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function turnType(directions) {
  const signs = [];
  for (let index = 1; index < directions.length; index += 1) {
    const [previousRow, previousCol] = DELTAS[directions[index - 1]];
    const [currentRow, currentCol] = DELTAS[directions[index]];
    const ax = previousCol;
    const ay = -previousRow;
    const bx = currentCol;
    const by = -currentRow;
    const cross = ax * by - ay * bx;
    if (cross) signs.push(Math.sign(cross));
  }
  if (!signs.length || !signs.every((sign) => sign === signs[0])) return "mixed";
  return signs[0] > 0 ? "counterclockwise" : "clockwise";
}

function questionSignature(problem) {
  const common = [problem.interaction, orientationKey(problem.startOrientation)];
  if (problem.interaction === "face-answer") return [...common, problem.directions.join(""), problem.faceKey].join("|");
  if (problem.interaction === "orientation-answer") return [...common, problem.directions.join("")].join("|");
  const routeSet = problem.routeChoices.map((route) => route.join("")).sort().join(",");
  return [...common, visibleKey(problem.finalOrientation), routeSet].join("|");
}

function addCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

export function auditDiceRollContent(levelData = levels) {
  const errors = [];
  const ids = new Set();
  const signatures = new Map();
  const levelReports = [];

  if (levelData.length !== 5) errors.push(`expected 5 levels, found ${levelData.length}`);

  for (const level of levelData) {
    const answerDistribution = new Map();
    const choicePositionDistribution = new Map();
    const routePatterns = new Map();
    if (level.problems.length !== 10) errors.push(`level ${level.id}: expected 10 problems, found ${level.problems.length}`);

    for (const problem of level.problems) {
      if (ids.has(problem.id)) errors.push(`${problem.id}: duplicate id`);
      ids.add(problem.id);
      if (problem.level !== level.id) errors.push(`${problem.id}: level field does not match its container`);
      if (!problem.sourceRef?.startsWith("internal-variation;")) errors.push(`${problem.id}: sourceRef must identify an internal variation`);

      assertValidOrientation(problem.startOrientation, `${problem.id} start`, errors);
      assertValidOrientation(problem.finalOrientation, `${problem.id} final`, errors);

      const signature = questionSignature(problem);
      if (signatures.has(signature)) errors.push(`${problem.id}: duplicates ${signatures.get(signature)}`);
      signatures.set(signature, problem.id);

      if (problem.interaction !== "route-answer") {
        const traced = tracePath(problem.path[0], problem.directions, problem.rows, problem.cols, problem.id, errors);
        if (!pathsEqual(traced, problem.path)) errors.push(`${problem.id}: stored path differs from its directions`);
        const calculated = independentRollMany(problem.startOrientation, problem.directions);
        if (!sameOrientation(calculated, problem.finalOrientation)) errors.push(`${problem.id}: independently calculated final orientation differs`);
        addCount(routePatterns, problem.directions.join(""));

        if (problem.interaction === "face-answer") {
          const calculatedAnswer = calculated[problem.faceKey === "front" ? "south" : problem.faceKey === "right" ? "east" : "top"];
          if (problem.answer !== calculatedAnswer) errors.push(`${problem.id}: answer ${problem.answer} should be ${calculatedAnswer}`);
          if (problem.choices.length !== 4 || new Set(problem.choices).size !== 4) errors.push(`${problem.id}: needs four distinct number choices`);
          if (problem.choices.filter((choice) => choice === calculatedAnswer).length !== 1) errors.push(`${problem.id}: number choices do not have exactly one answer`);
          if (!problem.choices.every((choice) => Number.isInteger(choice) && choice >= 1 && choice <= 6)) errors.push(`${problem.id}: number choice outside 1 through 6`);
          addCount(answerDistribution, String(calculatedAnswer));
          addCount(choicePositionDistribution, String(problem.choices.indexOf(calculatedAnswer) + 1));
        } else if (problem.interaction === "orientation-answer") {
          if (turnType(problem.directions) !== problem.turn) errors.push(`${problem.id}: ${problem.turn} label does not match the route`);
          if (problem.choices.length !== 3) errors.push(`${problem.id}: needs three orientation choices`);
          problem.choices.forEach((choice, index) => assertValidOrientation(choice, `${problem.id} choice ${index + 1}`, errors));
          const visibleChoices = problem.choices.map(visibleKey);
          if (new Set(visibleChoices).size !== problem.choices.length) errors.push(`${problem.id}: repeated visible orientation choice`);
          const matches = visibleChoices.map((key, index) => key === visibleKey(calculated) ? index : -1).filter((index) => index >= 0);
          if (matches.length !== 1 || problem.answer !== matches[0]) errors.push(`${problem.id}: orientation choices do not have exactly one indexed answer`);
          addCount(answerDistribution, visibleKey(calculated));
          addCount(choicePositionDistribution, String(problem.answer + 1));
        } else {
          errors.push(`${problem.id}: unknown interaction ${problem.interaction}`);
        }
      } else {
        if (problem.path.length !== 1 || problem.directions.length !== 0) errors.push(`${problem.id}: reverse-route question should store only its start cell`);
        tracePath(problem.path[0], [], problem.rows, problem.cols, problem.id, errors);
        if (problem.routeChoices.length !== 3 || new Set(problem.routeChoices.map((route) => route.join(""))).size !== 3) {
          errors.push(`${problem.id}: needs three distinct route choices`);
        }
        const results = problem.routeChoices.map((route, index) => {
          tracePath(problem.path[0], route, problem.rows, problem.cols, `${problem.id} choice ${index + 1}`, errors);
          return independentRollMany(problem.startOrientation, route);
        });
        const matches = results.map((result, index) => visibleKey(result) === visibleKey(problem.finalOrientation) ? index : -1).filter((index) => index >= 0);
        if (matches.length !== 1 || problem.answer !== matches[0]) errors.push(`${problem.id}: route choices do not have exactly one indexed answer`);
        if (!results[problem.answer] || !sameOrientation(results[problem.answer], problem.finalOrientation)) errors.push(`${problem.id}: stored final orientation differs from the correct route`);
        addCount(answerDistribution, String(problem.answer + 1));
        addCount(choicePositionDistribution, String(problem.answer + 1));
        problem.routeChoices.forEach((route) => addCount(routePatterns, route.join("")));
      }
    }

    if (level.problems[0]?.interaction === "face-answer") {
      const counts = [1, 2, 3, 4, 5, 6].map((answer) => answerDistribution.get(String(answer)) || 0);
      if (counts.some((count) => count === 0) || Math.max(...counts) - Math.min(...counts) > 1) {
        errors.push(`level ${level.id}: face answers are not balanced across 1 through 6`);
      }
    }
    const choiceCount = level.problems[0]?.interaction === "face-answer" ? 4 : 3;
    const positionCounts = Array.from({ length: choiceCount }, (_, index) => choicePositionDistribution.get(String(index + 1)) || 0);
    if (positionCounts.some((count) => count === 0) || Math.max(...positionCounts) - Math.min(...positionCounts) > 1) {
      errors.push(`level ${level.id}: correct choice positions are not balanced`);
    }

    levelReports.push({
      level: level.id,
      band: level.band,
      problems: level.problems.length,
      uniqueQuestions: new Set(level.problems.map(questionSignature)).size,
      answerDistribution: Object.fromEntries([...answerDistribution].sort()),
      choicePositionDistribution: Object.fromEntries([...choicePositionDistribution].sort()),
      repeatedRoutePatterns: [...routePatterns].filter(([, count]) => count > 1).map(([route, count]) => ({ route, count }))
    });
  }

  if (ids.size !== 50) errors.push(`expected 50 unique problem ids, found ${ids.size}`);
  if (errors.length) throw new AggregateError(errors.map((message) => new Error(message)), `Dice-roll content audit failed with ${errors.length} error(s)`);

  return {
    levels: levelData.length,
    problems: ids.size,
    uniqueQuestions: signatures.size,
    singleAnswerProblems: ids.size,
    sourceClassification: "internal-variation",
    levelReports
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(auditDiceRollContent(), null, 2));
}
