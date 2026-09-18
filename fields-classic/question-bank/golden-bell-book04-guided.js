const COLOR = Object.freeze({
  given: "#187fa9",
  action: "#d39b20",
  verify: "#16734b",
  ink: "#233746",
  muted: "#b9c5cc",
  wash: "#f5f6f8",
  paper: "#ffffff"
});

const SUPPORTED_FAMILIES = new Set([
  "book4-circle-logic-source",
  "book4-cube-box-fill",
  "book4-fold-hole-count",
  "book4-multiplication-matrix",
  "book4-row-logic-source",
  "book4-table-logic-source"
]);

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const safeId = (value) => String(value ?? "book04")
  .replace(/[^a-zA-Z0-9_-]+/g, "-")
  .replace(/^-+|-+$/g, "") || "book04";

function integer(value, label, minimum = 0) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum) {
    throw new Error(`Book 4 ${label} must be an integer greater than or equal to ${minimum}.`);
  }
  return number;
}

function phaseOf(beat, step, totalSteps) {
  if (beat?.action === "verify") return "verify";
  if (step >= totalSteps - 1) return "verify";
  if (step <= 0) return "problem";
  return "organize";
}

function phaseShell(experience, phase, step, content) {
  if (!content || !content.trim()) throw new Error(`Book 4 ${experience.family} rendered an empty frame.`);
  const beats = Array.isArray(experience.beats) ? experience.beats : [];
  const totalSteps = Math.max(1, beats.length);
  const safeStep = Math.max(0, Math.min(integer(step, "guided step"), totalSteps - 1));
  const labels = Array.from({ length: totalSteps }, (_, index) => {
    if (index === 0) return "주어진 구조";
    if (index === totalSteps - 1) return "검산";
    return "정리";
  });
  const rail = labels.map((label, index) => {
    const future = index > safeStep;
    const color = future
      ? COLOR.muted
      : index === totalSteps - 1 && safeStep === totalSteps - 1
        ? COLOR.verify
        : index === 0
          ? COLOR.given
          : COLOR.action;
    const weight = index === safeStep ? 900 : 700;
    return `<span style="display:grid;place-items:center;min-height:30px;border-bottom:3px solid ${color};color:${future ? COLOR.ink : color};font-size:12px;font-weight:${weight}">${label}</span>`;
  }).join("");
  const role = phase === "problem" ? "given" : phase === "verify" ? "verify" : "action";
  const phaseLabel = phase === "problem" ? "주어진 구조" : phase === "verify" ? "검산" : "정리와 계산";
  return `<div class="book04-guided" data-book04-family="${escapeHtml(experience.family)}" data-book04-phase="${phase}" data-book04-step="${safeStep + 1}" data-color-role="${role}" role="img" aria-label="Book 4 ${phaseLabel} 단계 수학 그림" style="display:grid;gap:12px;width:100%;min-height:220px;padding:10px;background:${COLOR.paper};overflow:hidden;box-sizing:border-box"><div aria-hidden="true" style="display:grid;grid-template-columns:repeat(${totalSteps},minmax(0,1fr));gap:5px;width:min(100%,430px)">${rail}</div><!--book04-frame--><div data-book04-frame style="display:grid;gap:12px;place-items:center;width:100%;min-width:0">${content}</div><!--/book04-frame--></div>`;
}

function visualFor(experience, beat, step) {
  // Keep one verified example across the whole sequence so each frame shows a
  // real transformation of the same object instead of swapping examples.
  const visual = experience.beats?.find((candidate) => candidate?.action === "verify")?.visual
    || experience.model?.visuals?.[step]
    || experience.model?.visual
    || beat?.visual;
  if (!visual || typeof visual !== "object") {
    throw new Error(`Book 4 ${experience.family} is missing its guided visual model.`);
  }
  return visual;
}

function reflectPoint(point, line) {
  const [[x1, y1], [x2, y2]] = line;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (!Number.isFinite(lengthSquared) || lengthSquared <= 0) {
    throw new Error("Book 4 fold line must contain two different points.");
  }
  const projection = ((point[0] - x1) * dx + (point[1] - y1) * dy) / lengthSquared;
  const projectionX = x1 + projection * dx;
  const projectionY = y1 + projection * dy;
  return [2 * projectionX - point[0], 2 * projectionY - point[1]];
}

function uniquePoints(points, epsilon = 1e-7) {
  const result = [];
  for (const point of points) {
    if (!result.some((other) => Math.hypot(point[0] - other[0], point[1] - other[1]) <= epsilon)) {
      result.push(point);
    }
  }
  return result;
}

function unfoldHoleCenters(visual) {
  if (!Array.isArray(visual.holes) || !visual.holes.length || !Array.isArray(visual.folds)) {
    throw new Error("Book 4 folded-paper model is incomplete.");
  }
  let centers = visual.holes.map((hole) => {
    if (!Array.isArray(hole.center) || hole.center.length !== 2 || hole.center.some((value) => !Number.isFinite(Number(value)))) {
      throw new Error("Book 4 hole center is invalid.");
    }
    return hole.center.map(Number);
  });
  for (const fold of visual.folds.slice().reverse()) {
    if (!Array.isArray(fold.line) || fold.line.length !== 2) throw new Error("Book 4 fold line is missing.");
    centers = uniquePoints(centers.flatMap((center) => [center, reflectPoint(center, fold.line.map((point) => point.map(Number)))]));
  }
  return centers;
}

function paperPoint([x, y], originX, originY, size) {
  return [originX + Number(x) * size, originY + Number(y) * size];
}

function paperPoints(vertices, originX, originY, size) {
  if (!Array.isArray(vertices) || vertices.length < 3) throw new Error("Book 4 paper polygon is incomplete.");
  return vertices.map((point) => paperPoint(point, originX, originY, size).join(",")).join(" ");
}

function foldArrow(fold, originX, originY, size, color) {
  const [start, end] = fold.line.map((point) => paperPoint(point, originX, originY, size));
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  const direction = Array.isArray(fold.direction) ? fold.direction.map(Number) : [0, 0];
  const length = Math.hypot(direction[0], direction[1]) || 1;
  const dx = direction[0] / length * 28;
  const dy = direction[1] / length * 28;
  const arrowEnd = [midpoint[0] + dx, midpoint[1] + dy];
  return `<line x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" stroke="${color}" stroke-width="3" stroke-dasharray="7 5"/><path d="M${midpoint[0] - dx * 0.45} ${midpoint[1] - dy * 0.45}L${arrowEnd[0]} ${arrowEnd[1]}m-8 -5 8 5-8 5" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function foldFrame(visual, phase) {
  const paper = visual.paper?.vertices;
  const folds = visual.folds;
  if (!Array.isArray(paper) || !Array.isArray(folds) || !folds.length || !Array.isArray(visual.finalPaper)) {
    throw new Error("Book 4 folded-paper model is incomplete.");
  }
  const centers = unfoldHoleCenters(visual);
  const diagramId = safeId(visual.diagramId);
  if (phase === "problem") {
    const originX = 165;
    const originY = 20;
    const size = 190;
    const polygon = paperPoints(paper, originX, originY, size);
    const firstFold = foldArrow(folds[0], originX, originY, size, COLOR.given);
    return `<svg viewBox="0 0 520 235" aria-label="처음 종이와 첫 접는 선" style="display:block;width:min(100%,520px);height:auto"><polygon points="${polygon}" fill="${COLOR.given}" fill-opacity=".10" stroke="${COLOR.given}" stroke-width="4"/>${firstFold}<circle cx="42" cy="42" r="17" fill="${COLOR.given}"/><text x="42" y="48" fill="#fff" font-size="17" font-weight="900" text-anchor="middle">1</text></svg>`;
  }
  if (phase === "organize") {
    const originX = 160;
    const originY = 22;
    const size = 190;
    const clipId = `book04-folded-${diagramId}`;
    const folded = paperPoints(visual.finalPaper, originX, originY, size);
    const holes = visual.holes.map((hole) => {
      const [cx, cy] = paperPoint(hole.center, originX, originY, size);
      const radius = Math.max(5, Number(hole.radius || 0.05) * size);
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${COLOR.action}" clip-path="url(#${clipId})"/>`;
    }).join("");
    const foldSteps = folds.map((_, index) => `<span style="display:grid;place-items:center;width:30px;height:30px;border:2px solid ${COLOR.action};border-radius:50%;color:${COLOR.action};font-weight:900">${index + 1}</span>`).join(`<b aria-hidden="true" style="color:${COLOR.action}">→</b>`);
    return `<div style="display:grid;gap:8px;place-items:center;width:100%"><div aria-label="접는 순서" style="display:flex;align-items:center;gap:6px">${foldSteps}</div><svg viewBox="0 0 520 235" aria-label="마지막으로 접힌 종이와 뚫은 구멍" style="display:block;width:min(100%,520px);height:auto"><defs><clipPath id="${clipId}"><polygon points="${folded}"/></clipPath></defs><polygon points="${folded}" fill="${COLOR.action}" fill-opacity=".12" stroke="${COLOR.action}" stroke-width="4"/>${holes}</svg></div>`;
  }
  const originX = 165;
  const originY = 20;
  const size = 190;
  const polygon = paperPoints(paper, originX, originY, size);
  const finalHoles = centers.map((center) => {
    const [cx, cy] = paperPoint(center, originX, originY, size);
    return `<circle cx="${cx}" cy="${cy}" r="10" fill="${COLOR.verify}"/><path d="M${cx - 4} ${cy}l3 4 7-9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join("");
  const check = `${visual.holes.length} punched; ${folds.length} folds; ${centers.length} unique positions`;
  return `<svg viewBox="0 0 520 235" aria-label="펼친 종이의 서로 다른 구멍 위치" style="display:block;width:min(100%,520px);height:auto"><polygon points="${polygon}" fill="${COLOR.verify}" fill-opacity=".08" stroke="${COLOR.verify}" stroke-width="4"/>${finalHoles}</svg><div data-book04-answer="${centers.length}" data-book04-check="${escapeHtml(check)}" style="display:grid;place-items:center;color:${COLOR.verify};font-size:22px;font-weight:900">구멍 ${centers.length}개</div>`;
}

function cubeModel(visual) {
  if (!Array.isArray(visual.dimensions) || visual.dimensions.length !== 3) {
    throw new Error("Book 4 cube-box dimensions are incomplete.");
  }
  const dimensions = visual.dimensions.map((value, index) => integer(value, `cube dimension ${index + 1}`, 1));
  const total = dimensions.reduce((product, value) => product * value, 1);
  const shown = integer(visual.shown, "shown cube count");
  if (shown > total) throw new Error("Book 4 shown cube count exceeds the box capacity.");
  if (visual.total != null && Number(visual.total) !== total) throw new Error("Book 4 cube-box total disagrees with its dimensions.");
  return { dimensions, total, shown, needed: total - shown };
}

function cubeFrame(visual, phase) {
  const { dimensions: [width, depth, height], total, shown, needed } = cubeModel(visual);
  let flatIndex = 0;
  const layers = Array.from({ length: height }, (_, layer) => {
    const cells = Array.from({ length: width * depth }, () => {
      const index = flatIndex;
      flatIndex += 1;
      const isGiven = index < shown;
      const color = isGiven ? COLOR.given : phase === "verify" ? COLOR.verify : phase === "organize" ? COLOR.action : COLOR.muted;
      const fill = isGiven ? COLOR.given : phase === "verify" ? COLOR.verify : phase === "organize" ? "#fff8e4" : COLOR.paper;
      const symbol = isGiven ? "■" : phase === "verify" ? "+" : "";
      return `<span style="display:grid;place-items:center;aspect-ratio:1;border:2px solid ${color};background:${fill};color:${isGiven || phase === "verify" ? "#fff" : color};font-size:16px;font-weight:900">${symbol}</span>`;
    }).join("");
    return `<div style="display:grid;gap:5px;place-items:center"><strong style="color:${phase === "problem" ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action};font-size:12px">${layer + 1}층</strong><div style="display:grid;grid-template-columns:repeat(${width},minmax(24px,36px));gap:4px">${cells}</div></div>`;
  }).join("");
  const layerBoard = `<div aria-label="${width} 곱하기 ${depth} 바닥이 ${height}층인 상자" style="display:flex;flex-wrap:wrap;justify-content:center;align-items:start;gap:14px;width:100%">${layers}</div>`;
  if (phase === "problem") {
    return `${layerBoard}<div style="display:flex;gap:8px;color:${COLOR.given};font-size:17px;font-weight:900"><span>가로 ${width}</span><span>×</span><span>세로 ${depth}</span><span>×</span><span>높이 ${height}</span></div>`;
  }
  if (phase === "organize") {
    return `${layerBoard}<div style="padding:9px 14px;border-left:4px solid ${COLOR.action};background:#fff8e4;color:${COLOR.ink};font-size:20px;font-weight:900">${width} × ${depth} × ${height} = ${total}</div>`;
  }
  const check = `${width}x${depth}x${height}=${total}; ${total}-${shown}=${needed}`;
  return `${layerBoard}<div data-book04-answer="${needed}" data-book04-check="${escapeHtml(check)}" style="display:grid;gap:3px;place-items:center;color:${COLOR.verify};font-weight:900"><strong style="font-size:24px">${total} - ${shown} = ${needed}</strong><span style="font-size:14px">더 놓을 쌓기나무 ${needed}개</span></div>`;
}

function solveMatrix(visual) {
  if (!Array.isArray(visual.cells) || visual.cells.length !== 4 || !Array.isArray(visual.rowProducts) || visual.rowProducts.length !== 2 || !Array.isArray(visual.columnProducts) || visual.columnProducts.length !== 2) {
    throw new Error("Book 4 multiplication matrix is incomplete.");
  }
  const rows = visual.rowProducts.map((value, index) => integer(value, `row product ${index + 1}`, 1));
  const columns = visual.columnProducts.map((value, index) => integer(value, `column product ${index + 1}`, 1));
  const fixed = visual.cells.map((value) => value == null ? null : integer(value, "matrix cell", 1));
  const solutions = [];
  for (let topLeft = 1; topLeft <= rows[0]; topLeft += 1) {
    if (rows[0] % topLeft || columns[0] % topLeft) continue;
    const topRight = rows[0] / topLeft;
    const bottomLeft = columns[0] / topLeft;
    if (rows[1] % bottomLeft) continue;
    const bottomRight = rows[1] / bottomLeft;
    const candidate = [topLeft, topRight, bottomLeft, bottomRight];
    const fixedMatch = candidate.every((value, index) => fixed[index] == null || fixed[index] === value);
    if (fixedMatch && topRight * bottomRight === columns[1]) solutions.push(candidate);
  }
  if (solutions.length !== 1) throw new Error(`Book 4 multiplication matrix must have one solution; found ${solutions.length}.`);
  const blankIndexes = fixed.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  if (!blankIndexes.length) throw new Error("Book 4 multiplication matrix has no blank cell.");
  return { rows, columns, fixed, solution: solutions[0], blankIndexes };
}

function matrixFrame(visual, phase) {
  const { rows, columns, fixed, solution, blankIndexes } = solveMatrix(visual);
  const cellSize = 66;
  const originX = 125;
  const originY = 30;
  const cells = fixed.map((value, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const reveal = phase === "verify";
    const shown = value == null ? reveal ? solution[index] : "?" : value;
    const color = value != null ? COLOR.given : reveal ? COLOR.verify : phase === "organize" ? COLOR.action : COLOR.given;
    const fill = value != null ? "#eaf4f8" : reveal ? "#e8f5ee" : phase === "organize" ? "#fff8e4" : COLOR.paper;
    return `<rect x="${originX + column * cellSize}" y="${originY + row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fill}" stroke="${color}" stroke-width="3"/><text x="${originX + column * cellSize + cellSize / 2}" y="${originY + row * cellSize + 42}" fill="${color}" font-size="23" font-weight="900" text-anchor="middle">${shown}</text>`;
  }).join("");
  const rowLabels = rows.map((value, row) => `<text x="${originX + cellSize * 2 + 34}" y="${originY + row * cellSize + 42}" fill="${phase === "problem" ? COLOR.given : COLOR.action}" font-size="17" font-weight="900" text-anchor="middle">${value}</text>`).join("");
  const columnLabels = columns.map((value, column) => `<text x="${originX + column * cellSize + cellSize / 2}" y="${originY + cellSize * 2 + 32}" fill="${phase === "problem" ? COLOR.muted : COLOR.action}" font-size="17" font-weight="900" text-anchor="middle">${value}</text>`).join("");
  const arrows = `<path d="M${originX + cellSize * 2 + 5} ${originY + 18}h18m-6-6 6 6-6 6M${originX + cellSize * 2 + 5} ${originY + cellSize + 18}h18m-6-6 6 6-6 6" fill="none" stroke="${phase === "problem" ? COLOR.given : COLOR.action}" stroke-width="2.5"/><path d="M${originX + 18} ${originY + cellSize * 2 + 5}v18m-6-6 6 6 6-6M${originX + cellSize + 18} ${originY + cellSize * 2 + 5}v18m-6-6 6 6 6-6" fill="none" stroke="${phase === "problem" ? COLOR.muted : COLOR.action}" stroke-width="2.5"/>`;
  const board = `<svg viewBox="0 0 460 225" aria-label="가로 곱과 세로 곱을 맞추는 두 칸씩의 수 배열" style="display:block;width:min(100%,460px);height:auto">${cells}${rowLabels}${columnLabels}${arrows}</svg>`;
  if (phase === "problem") return board;
  if (phase === "organize") return `${board}<div style="display:flex;gap:10px;align-items:center;color:${COLOR.action};font-size:15px;font-weight:900"><span>가로 곱</span><span>+</span><span>세로 곱</span></div>`;
  const answer = blankIndexes.length === 1 ? String(solution[blankIndexes[0]]) : blankIndexes.map((index) => solution[index]).join(",");
  const check = `${solution[0]}x${solution[1]}=${rows[0]}; ${solution[2]}x${solution[3]}=${rows[1]}; ${solution[0]}x${solution[2]}=${columns[0]}; ${solution[1]}x${solution[3]}=${columns[1]}`;
  return `${board}<div data-book04-answer="${answer}" data-book04-check="${escapeHtml(check)}" style="display:grid;gap:3px;place-items:center;color:${COLOR.verify};font-weight:900"><strong style="font-size:24px">빈칸 ${escapeHtml(answer)}</strong><span style="font-size:13px">가로와 세로의 네 곱이 모두 맞습니다.</span></div>`;
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, candidateIndex) => candidateIndex !== index)).map((rest) => [value, ...rest]));
}

function solveTable(visual) {
  const people = Array.isArray(visual.people) ? visual.people.map(String) : [];
  const choices = Array.isArray(visual.choices) ? visual.choices.map(String) : [];
  const conditions = Array.isArray(visual.conditions) ? visual.conditions : [];
  if (!people.length || people.length !== choices.length || !people.includes(String(visual.target))) {
    throw new Error("Book 4 logic table is incomplete.");
  }
  const solutions = permutations(choices).map((order) => Object.fromEntries(people.map((person, index) => [person, order[index]]))).filter((assignment) => conditions.every((condition) => {
    if (condition.type === "is") return assignment[condition.person] === condition.choice;
    if (condition.type === "not") return assignment[condition.person] !== condition.choice;
    throw new Error(`Unsupported Book 4 table condition: ${condition.type}`);
  }));
  if (!solutions.length) throw new Error("Book 4 logic table has no solution.");
  const targetAnswers = [...new Set(solutions.map((solution) => solution[visual.target]))];
  return { people, choices, conditions, solutions, targetAnswers };
}

function directTableStatus(person, choice, conditions) {
  for (const condition of conditions) {
    if (condition.type === "not" && condition.person === person && condition.choice === choice) return "forbidden";
    if (condition.type === "is") {
      if (condition.person === person && condition.choice === choice) return "fixed";
      if (condition.person === person || condition.choice === choice) return "forbidden";
    }
  }
  return "open";
}

function tableFrame(visual, phase) {
  const { people, choices, conditions, solutions, targetAnswers } = solveTable(visual);
  const target = String(visual.target);
  const possibleByPerson = new Map(people.map((person) => [person, new Set(solutions.map((solution) => solution[person]))]));
  const header = `<span></span>${choices.map((choice) => `<strong style="display:grid;place-items:center;min-height:38px;padding:4px;border-bottom:2px solid ${phase === "verify" ? COLOR.verify : COLOR.given};font-size:13px">${escapeHtml(choice)}</strong>`).join("")}`;
  const rows = people.map((person) => {
    const possible = possibleByPerson.get(person);
    const cells = choices.map((choice) => {
      const direct = directTableStatus(person, choice, conditions);
      let symbol = direct === "fixed" ? "●" : direct === "forbidden" ? "×" : "○";
      let color = COLOR.given;
      let background = COLOR.paper;
      if (phase === "organize" && person !== target) {
        symbol = possible.has(choice) ? possible.size === 1 ? "●" : "○" : "×";
        color = COLOR.action;
        background = possible.has(choice) ? "#fff8e4" : COLOR.wash;
      }
      if (phase === "verify") {
        const selected = solutions.every((solution) => solution[person] === choice);
        symbol = selected ? "✓" : "×";
        color = selected && person === target ? COLOR.verify : selected ? COLOR.action : COLOR.muted;
        background = selected && person === target ? "#e8f5ee" : selected ? "#fff8e4" : COLOR.wash;
      }
      return `<span style="display:grid;place-items:center;min-height:42px;border:1px solid ${color};background:${background};color:${color};font-size:18px;font-weight:900">${symbol}</span>`;
    }).join("");
    const targetColor = phase === "problem" ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action;
    return `<strong style="display:grid;place-items:center;min-height:42px;padding:4px;border:1px solid ${person === target ? targetColor : COLOR.muted};color:${person === target ? targetColor : COLOR.ink};font-size:13px">${escapeHtml(person)}</strong>${cells}`;
  }).join("");
  const conditionChips = conditions.map((condition) => `<span style="padding:5px 8px;border:1px solid ${phase === "problem" ? COLOR.given : COLOR.action};color:${phase === "problem" ? COLOR.given : COLOR.action};font-size:13px;font-weight:900">${escapeHtml(condition.person)} ${condition.type === "is" ? "=" : "≠"} ${escapeHtml(condition.choice)}</span>`).join("");
  const grid = `<div aria-label="사람과 선택의 일대일 대응 표" style="display:grid;grid-template-columns:minmax(64px,1.2fr) repeat(${choices.length},minmax(44px,1fr));gap:3px;width:min(100%,520px)">${header}${rows}</div>`;
  if (phase === "problem") return `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px">${conditionChips}</div>${grid}`;
  if (phase === "organize") return `${grid}<div style="display:flex;align-items:center;gap:8px;color:${COLOR.action};font-size:13px;font-weight:900"><span>● 가능</span><span>× 제외</span></div>`;
  if (solutions.length !== 1 || targetAnswers.length !== 1) throw new Error("Book 4 logic table must have one verified assignment.");
  const assignment = solutions[0];
  const check = people.map((person) => `${person}=${assignment[person]}`).join("; ");
  return `${grid}<div data-book04-answer="${escapeHtml(targetAnswers[0])}" data-book04-check="${escapeHtml(check)}" style="display:grid;gap:3px;place-items:center;color:${COLOR.verify};font-weight:900"><strong style="font-size:23px">${escapeHtml(target)} = ${escapeHtml(targetAnswers[0])}</strong><span style="font-size:13px">각 선택은 한 번씩만 쓰였습니다.</span></div>`;
}

function circleConditionHolds(order, condition) {
  const size = order.length;
  const indexOf = (person) => order.indexOf(String(person));
  const adjacent = (left, right) => {
    const difference = Math.abs(indexOf(left) - indexOf(right));
    return difference === 1 || difference === size - 1;
  };
  if (condition.type === "bothNeighbors") {
    const center = indexOf(condition.person);
    const actual = new Set([order[(center - 1 + size) % size], order[(center + 1) % size]]);
    return condition.neighbors.length === 2 && condition.neighbors.every((person) => actual.has(String(person)));
  }
  if (condition.type === "notAdjacent") return !adjacent(condition.people[0], condition.people[1]);
  // Match the repository's circular-seat convention: next is right, previous is left.
  if (condition.type === "rightOf") return indexOf(condition.person) === (indexOf(condition.reference) + 1) % size;
  if (condition.type === "leftOf") return indexOf(condition.person) === (indexOf(condition.reference) - 1 + size) % size;
  throw new Error(`Unsupported Book 4 circle condition: ${condition.type}`);
}

function solveCircle(visual) {
  const people = Array.isArray(visual.people) ? visual.people.map(String) : [];
  const seats = Array.isArray(visual.seats) ? visual.seats : [];
  const conditions = Array.isArray(visual.conditions) ? visual.conditions : [];
  if (people.length < 3 || seats.length !== people.length) throw new Error("Book 4 circle model is incomplete.");
  const fixed = new Map();
  seats.forEach((seat, index) => {
    if (seat.fixed != null) fixed.set(index, String(seat.fixed));
  });
  const fixedPeople = new Set(fixed.values());
  if (fixedPeople.size !== fixed.size || [...fixedPeople].some((person) => !people.includes(person))) {
    throw new Error("Book 4 circle model contains an invalid fixed seat.");
  }
  const openIndexes = seats.map((_, index) => fixed.has(index) ? -1 : index).filter((index) => index >= 0);
  const remainingPeople = people.filter((person) => !fixedPeople.has(person));
  const solutions = permutations(remainingPeople).map((permutation) => {
    const order = Array(seats.length);
    fixed.forEach((person, index) => { order[index] = person; });
    openIndexes.forEach((seatIndex, index) => { order[seatIndex] = permutation[index]; });
    return order;
  }).filter((order) => conditions.every((condition) => circleConditionHolds(order, condition)));
  if (!solutions.length) throw new Error("Book 4 circle model has no solution.");
  const targetSeat = integer(visual.targetSeat, "target seat");
  if (targetSeat >= seats.length) throw new Error("Book 4 target seat is outside the circle.");
  const targetAnswers = [...new Set(solutions.map((solution) => solution[targetSeat]))];
  return { people, seats, conditions, solutions, targetSeat, targetAnswers };
}

function circleConditionChip(condition) {
  if (condition.type === "bothNeighbors") return `${condition.neighbors.join(" · ")} ↔ ${condition.person}`;
  if (condition.type === "notAdjacent") return `${condition.people.join(" ∦ ")}`;
  if (condition.type === "rightOf") return `${condition.reference} → ${condition.person}`;
  if (condition.type === "leftOf") return `${condition.person} ← ${condition.reference}`;
  return condition.type;
}

function circleFrame(visual, phase) {
  const { seats, conditions, solutions, targetSeat, targetAnswers } = solveCircle(visual);
  const size = seats.length;
  const centerX = 260;
  const centerY = 132;
  const radius = 92;
  const candidateBySeat = seats.map((_, index) => [...new Set(solutions.map((solution) => solution[index]))]);
  const nodes = seats.map((seat, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / size;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const isTarget = index === targetSeat;
    let text = seat.fixed != null ? String(seat.fixed) : String(seat.label || index + 1);
    let color = COLOR.given;
    let fill = COLOR.paper;
    if (phase === "organize" && seat.fixed == null && !isTarget && candidateBySeat[index].length === 1) {
      text = candidateBySeat[index][0];
      color = COLOR.action;
      fill = "#fff8e4";
    }
    if (phase === "organize" && isTarget) {
      text = `${seat.label || index + 1}?`;
      color = COLOR.action;
      fill = "#fff8e4";
    }
    if (phase === "verify") {
      if (solutions.length !== 1 || targetAnswers.length !== 1) throw new Error("Book 4 circle target must be uniquely verified.");
      text = solutions[0][index];
      color = isTarget ? COLOR.verify : COLOR.action;
      fill = isTarget ? "#e8f5ee" : "#fff8e4";
    }
    return `<circle cx="${x}" cy="${y}" r="25" fill="${fill}" stroke="${color}" stroke-width="3"/><text x="${x}" y="${y + 6}" fill="${color}" font-size="16" font-weight="900" text-anchor="middle">${escapeHtml(text)}</text>`;
  }).join("");
  const targetAngle = -Math.PI / 2 + targetSeat * Math.PI * 2 / size;
  const targetX = centerX + Math.cos(targetAngle) * radius;
  const targetY = centerY + Math.sin(targetAngle) * radius;
  const targetRingColor = phase === "problem" ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action;
  const targetRing = `<circle cx="${targetX}" cy="${targetY}" r="32" fill="none" stroke="${targetRingColor}" stroke-width="3" stroke-dasharray="5 4"/>`;
  const board = `<svg viewBox="0 0 520 270" aria-label="가운데를 바라보며 앉은 원탁 자리" style="display:block;width:min(100%,520px);height:auto"><circle cx="${centerX}" cy="${centerY}" r="58" fill="${COLOR.wash}" stroke="${phase === "verify" ? COLOR.verify : COLOR.given}" stroke-width="3"/><circle cx="${centerX}" cy="${centerY}" r="8" fill="${phase === "verify" ? COLOR.verify : COLOR.given}"/>${targetRing}${nodes}</svg>`;
  const chips = conditions.map((condition) => `<span style="padding:5px 8px;border:1px solid ${phase === "problem" ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action};color:${phase === "problem" ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action};font-size:13px;font-weight:900">${escapeHtml(circleConditionChip(condition))}</span>`).join("");
  if (phase !== "verify") return `${board}<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px">${chips}</div>`;
  const order = solutions[0];
  const check = conditions.map((condition) => `${circleConditionChip(condition)}=true`).join("; ");
  return `${board}<div data-book04-answer="${escapeHtml(targetAnswers[0])}" data-book04-check="${escapeHtml(check)}" style="display:grid;gap:3px;place-items:center;color:${COLOR.verify};font-weight:900"><strong style="font-size:23px">${escapeHtml(seats[targetSeat].label || targetSeat + 1)}번 자리 = ${escapeHtml(targetAnswers[0])}</strong><span style="font-size:13px">${escapeHtml(order.join(" → "))}</span></div>`;
}

function rowModel(visual) {
  const placements = Array.isArray(visual.placements) ? visual.placements : [];
  const front = placements.find((placement) => placement.from === "front");
  const back = placements.find((placement) => placement.from === "back");
  if (!front || !back || String(front.person) !== String(back.person)) {
    throw new Error("Book 4 row model needs the same person counted from both ends.");
  }
  const frontPosition = integer(front.position, "front position", 1);
  const backPosition = integer(back.position, "back position", 1);
  const total = frontPosition + backPosition - 1;
  if (visual.total != null && Number(visual.total) !== total) throw new Error("Book 4 row total disagrees with its two positions.");
  return { person: String(front.person), frontPosition, backPosition, total };
}

function rowStrip(count, person, color, reverse = false) {
  const cells = Array.from({ length: count }, (_, index) => {
    const personIndex = reverse ? 0 : count - 1;
    const isPerson = index === personIndex;
    const position = reverse ? count - index : index + 1;
    return `<span style="display:grid;place-items:center;min-width:25px;height:32px;border:2px solid ${color};background:${isPerson ? color : COLOR.paper};color:${isPerson ? "#fff" : color};font-size:${isPerson ? "10px" : "12px"};font-weight:900">${isPerson ? escapeHtml(person) : position}</span>`;
  }).join("");
  return `<div style="display:flex;align-items:center;justify-content:center;gap:3px;max-width:100%;overflow:hidden">${cells}<b style="color:${color};font-size:18px">${reverse ? "←" : "→"}</b></div>`;
}

function rowFrame(visual, phase) {
  const { person, frontPosition, backPosition, total } = rowModel(visual);
  if (phase === "problem") {
    return `<div style="display:grid;gap:9px;place-items:center;width:100%">${rowStrip(frontPosition, person, COLOR.given)}<strong style="color:${COLOR.given};font-size:15px">앞에서 ${frontPosition}번째</strong><span aria-hidden="true" style="color:${COLOR.muted};font-size:22px">…</span></div>`;
  }
  if (phase === "organize") {
    return `<div style="display:grid;gap:12px;place-items:center;width:100%">${rowStrip(frontPosition, person, COLOR.given)}${rowStrip(backPosition, person, COLOR.action, true)}<div style="padding:9px 14px;border-left:4px solid ${COLOR.action};background:#fff8e4;color:${COLOR.ink};font-size:20px;font-weight:900">${frontPosition} + ${backPosition} - 1</div></div>`;
  }
  const cells = Array.from({ length: total }, (_, index) => {
    const isPerson = index === frontPosition - 1;
    return `<span style="display:grid;place-items:center;min-width:24px;height:32px;border:2px solid ${isPerson ? COLOR.verify : COLOR.muted};background:${isPerson ? COLOR.verify : COLOR.paper};color:${isPerson ? "#fff" : COLOR.ink};font-size:${isPerson ? "10px" : "12px"};font-weight:900">${isPerson ? escapeHtml(person) : index + 1}</span>`;
  }).join("");
  const check = `${frontPosition}+${backPosition}-1=${total}`;
  return `<div style="display:flex;flex-wrap:nowrap;justify-content:center;gap:3px;width:100%;overflow:hidden">${cells}</div><div data-book04-answer="${total}" data-book04-check="${check}" style="display:grid;gap:3px;place-items:center;color:${COLOR.verify};font-weight:900"><strong style="font-size:24px">${frontPosition} + ${backPosition} - 1 = ${total}</strong><span style="font-size:13px">겹쳐 센 ${escapeHtml(person)} 한 명을 뺐습니다.</span></div>`;
}

export function renderBook04Guided(experience, beat, step) {
  if (!experience || !SUPPORTED_FAMILIES.has(experience.family)) return "";
  const beats = Array.isArray(experience.beats) ? experience.beats : [];
  if (!beats.length || !beat) throw new Error(`Book 4 ${experience.family} has no guided beat.`);
  const safeStep = Math.max(0, Math.min(integer(step, "guided step"), beats.length - 1));
  const phase = phaseOf(beat, safeStep, beats.length);
  const visual = visualFor(experience, beat, safeStep);
  let content = "";
  if (experience.family === "book4-fold-hole-count") content = foldFrame(visual, phase);
  else if (experience.family === "book4-cube-box-fill") content = cubeFrame(visual, phase);
  else if (experience.family === "book4-multiplication-matrix") content = matrixFrame(visual, phase);
  else if (experience.family === "book4-table-logic-source") content = tableFrame(visual, phase);
  else if (experience.family === "book4-circle-logic-source") content = circleFrame(visual, phase);
  else if (experience.family === "book4-row-logic-source") content = rowFrame(visual, phase);
  return phaseShell(experience, phase, safeStep, content);
}
