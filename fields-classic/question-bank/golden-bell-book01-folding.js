import { reflectPoint } from "../../geometry/games/paper-fold/curriculum.js";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
const polygon = (points) => points.map(([x, y]) => ({ x, y }));
const rectangle = (x, y, w, h) => polygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const FOLDS = {
  right: { axis: "vertical", keep: (p) => p.x - .5, label: "왼쪽 반을 오른쪽으로", arrow: [[.25, .5], [.75, .5]] },
  left: { axis: "vertical", keep: (p) => .5 - p.x, label: "오른쪽 반을 왼쪽으로", arrow: [[.75, .5], [.25, .5]] },
  down: { axis: "horizontal", keep: (p) => p.y - .5, label: "위쪽 반을 아래쪽으로", arrow: [[.5, .25], [.5, .75]] },
  up: { axis: "horizontal", keep: (p) => .5 - p.y, label: "아래쪽 반을 위쪽으로", arrow: [[.5, .75], [.5, .25]] },
  "main-lower": { axis: "diag-main", keep: (p) => p.y - p.x, label: "대각선 아래쪽으로", arrow: [[.7, .3], [.3, .7]] },
  "main-upper": { axis: "diag-main", keep: (p) => p.x - p.y, label: "대각선 위쪽으로", arrow: [[.3, .7], [.7, .3]] },
  "anti-lower": { axis: "diag-anti", keep: (p) => p.x + p.y - 1, label: "대각선 아래쪽으로", arrow: [[.3, .3], [.7, .7]] },
  "anti-upper": { axis: "diag-anti", keep: (p) => 1 - p.x - p.y, label: "대각선 위쪽으로", arrow: [[.7, .7], [.3, .3]] }
};

// Same half-plane clipping as paper-fold-lab; reflection uses the Geometry Lab engine.
function clip(poly, keep) {
  const out = [];
  poly.forEach((a, index) => {
    const b = poly[(index + 1) % poly.length];
    const da = keep(a), db = keep(b);
    if (da >= -1e-9) out.push(a);
    if (da > 1e-9 && db < -1e-9 || da < -1e-9 && db > 1e-9) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  });
  return out;
}

export function foldPaper(model, count = model.folds.length) {
  return model.folds.slice(0, count).reduce((poly, key) => clip(poly, FOLDS[key].keep), polygon(square));
}

export function unfoldCuts(model, remaining = 0) {
  let cuts = model.cuts.map((points) => polygon(points));
  for (let i = model.folds.length - 1; i >= remaining; i--) {
    cuts = cuts.flatMap((poly) => [poly, poly.map((p) => reflectPoint(p, FOLDS[model.folds[i]].axis))]);
  }
  return cuts;
}

export function foldSelectedCells(model, numbers) {
  const cuts = unfoldCuts(model);
  const inside = (poly, p) => {
    let sign = 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
      if (Math.abs(cross) < 1e-8) continue;
      if (sign && Math.sign(cross) !== sign) return false;
      sign = Math.sign(cross);
    }
    return Boolean(sign);
  };
  return numbers.flatMap((row, r) => row.flatMap((_, c) => cuts.some((poly) => inside(poly, { x: (c + .5) / row.length, y: (r + .5) / numbers.length })) ? [r * row.length + c] : []));
}

const cellCut = (r, c, n = 4) => rectangle(c / n, r / n, 1 / n, 1 / n).map(({ x, y }) => [x, y]);
const cutWithin = (folds, cells, n = 4) => {
  const model = { folds, cuts: [], grid: n };
  model.cuts = cells.map(([r, c]) => folds.reduce((poly, key) => clip(poly, FOLDS[key].keep), rectangle(c / n, r / n, 1 / n, 1 / n)).map(({ x, y }) => [x, y]));
  return model;
};

// Givens transcribed from Book 1 slides 12, 14 and 16, not the red answer overlays.
const SOURCE_MODELS = {
  "one-fold-sum-1": cutWithin(["right"], [[0, 1]], 2),
  "one-fold-sum-2": cutWithin(["main-lower"], [[1, 0]], 2),
  "one-fold-sum-3": cutWithin(["up"], [[0, 0], [0, 1]]),
  "one-fold-sum-4": cutWithin(["left"], [[0, 0], [3, 0]]),
  "one-fold-sum-5": cutWithin(["anti-lower"], [[1, 2], [2, 1], [2, 2]]),
  "one-fold-sum-6": cutWithin(["main-upper"], [[0, 1], [1, 1], [1, 2]]),
  "two-fold-sum-1": cutWithin(["up", "left"], [[0, 1]]),
  "two-fold-sum-2": cutWithin(["right", "down"], [[2, 2]]),
  "two-fold-sum-3": cutWithin(["up", "right"], [[0, 3], [1, 2]]),
  "two-fold-sum-4": cutWithin(["main-lower", "anti-lower"], [[2, 1], [3, 1]]),
  "two-fold-landing-1": { folds: ["down", "right"], cuts: [], task: "position" },
  "two-fold-landing-2": { folds: ["left", "up"], cuts: [], task: "position" },
  "two-fold-landing-3": { folds: ["main-upper", "anti-upper"], cuts: [], task: "position", diagonalLabels: true }
};

export function enhanceBook01Folding(book) {
  for (const lesson of book.lessons) {
    if (lesson.id === "fold-two-cut") lesson.representativeConcept = "접힌 위치를 따라가고, 마지막 접기부터 거꾸로 펼쳐 잘린 모양과 수의 합을 찾음";
    for (const item of lesson.original?.items || []) {
      const source = SOURCE_MODELS[item.id];
      if (!source) continue;
      item.visual.foldModel = structuredClone(source);
      item.visual.folds = source.folds.map((key) => FOLDS[key].label);
      if (source.task === "position") {
        item.prompt = "색종이를 화살표 방향으로 두 번 접었습니다. 접힌 색종이가 놓이는 곳의 번호를 고르세요.";
        item.typeLabel = "두 번 접힌 색종이의 위치";
      }
      item.solutionVisual = { ...item.visual, foldReveal: true };
    }
  }
}

export function foldAnswerValue(visual) {
  const model = visual.foldModel;
  if (model.task !== "position") return foldSelectedCells(model, visual.numbers).reduce((sum, index) => sum + visual.numbers.flat()[index], 0);
  const poly = foldPaper(model);
  const center = poly.reduce((sum, p) => ({ x: sum.x + p.x / poly.length, y: sum.y + p.y / poly.length }), { x: 0, y: 0 });
  if (model.diagonalLabels) return center.y < .5 && center.y < center.x && center.y < 1 - center.x ? 2 : center.x < .5 && center.x < center.y && center.x < 1 - center.y ? 1 : center.x > .5 && center.y < center.x && center.y > 1 - center.x ? 3 : 4;
  return (center.y < .5 ? 0 : 2) + (center.x < .5 ? 1 : 2);
}

export function reviewBook01FoldSolutions(book) {
  for (const item of book.lessons.flatMap((lesson) => lesson.original?.items || [])) {
    const model = item.visual?.foldModel;
    if (!model) continue;
    const result = foldAnswerValue(item.visual);
    if (!new RegExp(`^${result}(?:번|개)?$`).test(String(item.answer).trim())) throw new Error(`Fold model and protected answer disagree: ${item.id}`);
    const directions = model.folds.map((key, index) => `${index + 1}번은 ${FOLDS[key].label} 접습니다.`).join(" ");
    item.solution = model.task === "position"
      ? `${directions} 마지막 종이가 차지하는 자리를 처음 번호판과 겹쳐 보면 ${result}번 자리입니다. 맨 위 종이에 쓰인 수를 묻는 문제가 아닙니다.`
      : `${directions} 마지막에 접은 선부터 거꾸로 펼치며 잘린 자국을 반대쪽 같은 거리에 옮깁니다. 잘린 칸의 수는 ${foldSelectedCells(model, item.visual.numbers).map((index) => item.visual.numbers.flat()[index]).join(" + ")} = ${result}입니다.`;
  }
}

const pointsText = (poly) => poly.map(({ x, y }) => `${20 + x * 160},${20 + y * 160}`).join(" ");
const shape = (poly, cls) => `<polygon class="${cls}" points="${pointsText(poly)}"/>`;
const gridLines = (n, model, count) => Array.from({ length: n - 1 }, (_, i) => {
  const c = (i + 1) / n;
  return [[[c, 0], [c, 1]], [[0, c], [1, c]]].map((line) => {
    const clipped = model.folds.slice(0, count).reduce((poly, key) => clip(poly, FOLDS[key].keep), polygon(line));
    return clipped.length > 1 ? `<polyline class="fold-grid" points="${pointsText(clipped)}"/>` : "";
  }).join("");
}).join("");
const axisLine = (axis) => ({ vertical: "M100 20V180", horizontal: "M20 100H180", "diag-main": "M20 20L180 180", "diag-anti": "M20 180L180 20" })[axis];

function arrow(model, count) {
  const spec = FOLDS[model.folds[count]];
  if (!spec) return "";
  const moving = clip(foldPaper(model, count), (p) => -spec.keep(p));
  const from = moving.reduce((sum, p) => ({ x: sum.x + p.x / moving.length, y: sum.y + p.y / moving.length }), { x: 0, y: 0 });
  const to = reflectPoint(from, spec.axis);
  const x = 20 + from.x * 160, y = 20 + from.y * 160, tx = 20 + to.x * 160, ty = 20 + to.y * 160;
  const dx = tx - x, dy = ty - y, length = Math.hypot(dx, dy);
  const ux = dx / length, uy = dy / length;
  return `<path class="fold-direction" d="M${x} ${y}Q${(x + tx) / 2 - uy * 18} ${(y + ty) / 2 + ux * 18} ${tx} ${ty}M${tx - ux * 10 - uy * 7} ${ty - uy * 10 + ux * 7}L${tx} ${ty}L${tx - ux * 10 + uy * 7} ${ty - uy * 10 - ux * 7}"/>`;
}

function paperSvg(model, count, { cuts = [], next = false, numbers, selected = [], labels = false, highlightPosition = false, removed = false } = {}) {
  const poly = foldPaper(model, count);
  const board = polygon(square);
  const n = numbers?.length || model.grid || 4;
  const text = numbers?.flatMap((row, r) => row.map((value, c) => `<text x="${20 + (c + .5) * 160 / row.length}" y="${20 + (r + .5) * 160 / n}">${esc(value)}</text>`)).join("") || "";
  const labelPoints = model.diagonalLabels ? [[.2, .5], [.5, .2], [.8, .5], [.5, .8]] : [[.25, .25], [.75, .25], [.25, .75], [.75, .75]];
  const labelsMarkup = labels ? labelPoints.map(([x, y], i) => `<text x="${20 + x * 160}" y="${20 + y * 160}">${i + 1}</text>`).join("") : "";
  const highlight = selected.map((index) => shape(rectangle((index % n) / n, Math.floor(index / n) / n, 1 / n, 1 / n), "fold-number-cut")).join("");
  const label = numbers ? "펼친 숫자판" : labels ? "접힌 종이가 놓일 자리" : `${count}번 접은 색종이${cuts.length ? ", 진한 부분을 자르기" : ""}`;
  // The position question shows the folded shape separately, not inside the answer quadrant.
  const centered = model.task === "position" && count > 0 && !labels;
  const offsetX = centered ? 80 - (Math.min(...poly.map((p) => p.x)) + Math.max(...poly.map((p) => p.x))) * 80 : 0;
  const offsetY = centered ? 80 - (Math.min(...poly.map((p) => p.y)) + Math.max(...poly.map((p) => p.y))) * 80 : 0;
  const foldAxes = { vertical: [[.5, 0], [.5, 1]], horizontal: [[0, .5], [1, .5]], "diag-main": [[0, 0], [1, 1]], "diag-anti": [[0, 1], [1, 0]] };
  const crease = next ? model.folds.slice(0, count).reduce((line, key) => clip(line, FOLDS[key].keep), polygon(foldAxes[FOLDS[model.folds[count]].axis])) : [];
  const grid = model.task === "position" && model.diagonalLabels
    ? ["diag-main", "diag-anti"].map((axis) => {
      const line = model.folds.slice(0, labels ? 0 : count).reduce((poly, key) => clip(poly, FOLDS[key].keep), polygon(foldAxes[axis]));
      return `<polyline class="fold-grid" points="${pointsText(line)}"/>`;
    }).join("") : gridLines(labels || model.task === "position" ? 2 : n, model, labels ? 0 : count);
  return `<svg class="book01-fold-paper" viewBox="0 0 200 200" role="img" aria-label="${label}"><g transform="translate(${offsetX},${offsetY})">${centered ? "" : shape(board, "fold-outline")}${shape(poly, highlightPosition ? "fold-position" : "fold-face")}${highlight}${grid}${cuts.map((cut) => shape(cut, removed ? "fold-opening" : "fold-cut")).join("")}${text}${labelsMarkup}${next ? `<polyline class="fold-crease" points="${pointsText(crease)}"/>${arrow(model, count)}` : ""}</g></svg>`;
}

function figure(svg, label) { return `<figure>${svg}<figcaption>${esc(label)}</figcaption></figure>`; }

export function foldingQuestionMarkup(visual) {
  const model = visual.foldModel;
  if (!model) return "";
  if (visual.foldReveal) {
    if (model.task === "position") return `<div class="book01-fold-solution">${figure(paperSvg(model, model.folds.length, { labels: true, highlightPosition: true }), "접힌 종이의 자리")}</div>`;
    const selected = foldSelectedCells(model, visual.numbers);
    const values = selected.map((index) => visual.numbers.flat()[index]);
    return `<div class="book01-fold-solution">${figure(paperSvg(model, 0, { numbers: visual.numbers, selected }), "펼쳐서 잘린 칸 확인") }<p>${values.join(" + ")} = ${values.reduce((sum, value) => sum + value, 0)}</p></div>`;
  }
  const steps = model.folds.map((_, index) => figure(paperSvg(model, index, { next: true }), `${index + 1}번 접기`));
  steps.push(figure(paperSvg(model, model.folds.length, { cuts: unfoldCuts(model, model.folds.length) }), model.cuts.length ? "진한 부분을 자르기" : "접은 뒤"));
  const hasBoard = visual.numbers || model.task === "position";
  const board = hasBoard ? `<div class="book01-fold-board">${figure(paperSvg(model, 0, { numbers: visual.numbers, labels: model.task === "position" }), model.task === "position" ? "어느 자리에 놓일까요?" : "펼친 숫자판")}</div>` : "";
  return `<div class="book01-fold-question${hasBoard ? "" : " without-board"}"><div class="book01-fold-sequence">${steps.join("")}</div>${board}</div>`;
}

const EXAMPLES = {
  "fold-one-cut": [
    { id: "crease", label: "접은 선에 닿게 자르기", problem: "한 번 접고 진한 부분을 잘랐습니다. 펼친 모양을 알아보세요.", model: { folds: ["right"], grid: 2, cuts: [[[.5, .3], [.72, .3], [.62, .5], [.72, .7], [.5, .7]]] } },
    { id: "diagonal", label: "대각선으로 접어 자르기", problem: "대각선으로 접고 진한 부분을 잘랐습니다. 펼치면 어느 곳이 잘릴까요?", model: cutWithin(["main-lower"], [[1, 0]], 2) },
    { id: "number", label: "잘린 칸의 수 더하기", problem: "한 번 접어 진한 부분을 잘랐습니다. 잘려 나간 부분에 있는 수의 합을 구하세요.", model: cutWithin(["right"], [[0, 1]], 2), numbers: [[2, 4], [3, 5]] }
  ],
  "fold-two-cut": [
    { id: "position", label: "두 번 접힌 위치 찾기", problem: "화살표 방향으로 두 번 접으면 종이는 어느 번호의 자리에 놓일까요?", model: { folds: ["down", "right"], cuts: [], task: "position" } },
    { id: "grid", label: "마지막 접기부터 펼치기", problem: "두 번 접어 진한 부분을 잘랐습니다. 완전히 펼친 모양을 알아보세요.", model: { folds: ["down", "left"], cuts: [cellCut(3, 0)], grid: 4 } },
    { id: "number", label: "대각선 두 번 접고 수 더하기", problem: "대각선으로 두 번 접어 진한 부분을 잘랐습니다. 잘린 칸의 수의 합을 구하세요.", model: cutWithin(["main-lower", "anti-lower"], [[2, 1], [3, 1]]), numbers: [[1, 3, 4, 2], [8, 9, 2, 3], [5, 1, 4, 1], [2, 6, 7, 8]] }
  ]
};

export function book01FoldAnimations(lessonId) {
  return (EXAMPLES[lessonId] || []).map((example) => {
    const { model } = example;
    const beats = [{ phase: "given", caption: "화살표와 접은 뒤의 모양을 먼저 살펴봐요." },
      ...model.folds.map((key, index) => ({ phase: "fold", count: index + 1, caption: `${index + 1}번: ${FOLDS[key].label} 접어요.` }))];
    if (model.task !== "position") {
      beats.push({ phase: "cut", count: model.folds.length, caption: "진한 부분을 자르면 포개진 종이가 함께 잘려요." });
      for (let count = model.folds.length - 1; count >= 0; count--) beats.push({ phase: "unfold", count, caption: `${count ? "마지막 접기부터" : "남은 접기를"} 펼쳐요. 접은 선의 양쪽 같은 거리에 잘린 자국이 나타나요.` });
    }
    beats.push({ phase: "verify", count: 0, caption: model.task === "position" ? "맨 위 종이에 적힌 수가 아니라, 접힌 종이가 놓인 자리의 번호를 확인해요." : example.numbers ? "잘린 칸을 찾아 그 칸의 수만 더해요." : "접은 선에 닿은 자국은 펼치면 서로 이어져요. 떨어진 자국은 양쪽에 따로 생겨요." });
    return { ...example, kind: "source-animation", family: "book01-fold", title: example.label, sourceItemId: `concept-example-${lessonId}-${example.id}`, conceptExample: true, beats, printSteps: [0, beats.length - 2, beats.length - 1] };
  });
}

export function renderBook01FoldFrame(animation, step) {
  const beat = animation.beats[Math.max(0, Math.min(step, animation.beats.length - 1))];
  const { model, numbers } = animation;
  let content;
  if (beat.phase === "given") content = foldingQuestionMarkup({ foldModel: model, numbers });
  else if (beat.phase === "verify" && (numbers || model.task === "position")) content = foldingQuestionMarkup({ foldModel: model, numbers, foldReveal: true });
  else {
    const count = beat.phase === "verify" ? 0 : beat.count;
    const cuts = ["cut", "unfold", "verify"].includes(beat.phase) ? unfoldCuts(model, count) : [];
    content = figure(paperSvg(model, count, { cuts, removed: ["cut", "unfold", "verify"].includes(beat.phase), next: beat.phase === "fold" && count < model.folds.length }), beat.phase === "verify" ? "펼친 모양" : beat.phase === "unfold" ? "거꾸로 펼치기" : beat.phase === "cut" ? "자르기" : `${count}번 접은 뒤`);
  }
  return `<div class="book01-fold-frame" data-fold-phase="${beat.phase}">${content}</div>`;
}
