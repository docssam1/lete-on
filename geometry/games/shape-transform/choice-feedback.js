import { transformPoints } from "./levels.js?v=shape-transform-3";

const KINDS = ["same-bends", "translate", "rotate", "enlarge", "reduce"];
const LANGUAGES = ["ko", "en", "zh", "ja"];
const near = (a, b) => Math.abs(a - b) < 1e-7;
const same = (a, b) => a.length === b.length && a.every((p, i) => p.every((v, axis) => near(v, b[i][axis])));
const edges = (points, closed) => points.slice(0, closed ? points.length : -1).map((p, i) => [p, points[(i + 1) % points.length]]);
const inkKey = (points, closed) => edges(points, closed).map((e) => e.map((p) => p.join(",")).sort().join(":")).sort().join(";");
const copyVector = ([dx, dy]) => ({ dx: dx || 0, dy: dy || 0 });

function requireData(condition, reason) {
  if (!condition) throw new TypeError(`Invalid shape-choice feedback data: ${reason}`);
}

function checkPath(points, closed) {
  requireData(Array.isArray(points) && points.length >= (closed ? 4 : 3), "point list");
  requireData(points.every((p) => Array.isArray(p) && p.length === 2 && p.every((v) => Number.isFinite(v) && v >= 0 && v <= 100)), "coordinates");
  requireData(new Set(points.map((p) => p.join(","))).size === points.length, "repeated vertex");
  const segments = edges(points, closed);
  requireData(segments.every(([a, b]) => (a[0] === b[0]) !== (a[1] === b[1])), "nonzero orthogonal edges");
  segments.forEach(([a, b], i) => {
    if (closed || i < segments.length - 1) {
      const c = segments[(i + 1) % segments.length][1];
      requireData((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0, "degenerate bend");
    }
    for (let j = i + 2; j < segments.length; j++) {
      if (closed && i === 0 && j === segments.length - 1) continue;
      const [c, d] = segments[j];
      const overlap = [0, 1].every((axis) => Math.max(Math.min(a[axis], b[axis]), Math.min(c[axis], d[axis])) <= Math.min(Math.max(a[axis], b[axis]), Math.max(c[axis], d[axis])));
      requireData(!overlap, "self-intersection");
    }
  });
}

function checkProblem(problem, choiceIndex) {
  requireData(problem && typeof problem === "object" && typeof problem.closed === "boolean", "problem");
  requireData(Array.isArray(problem.choices) && problem.choices.length === 3, "three choices");
  if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= problem.choices.length) throw new RangeError("choiceIndex must be an integer from 0 to 2");
  requireData(Number.isInteger(problem.answerIndex) && problem.answerIndex >= 0 && problem.answerIndex < 3, "answer index");
  const op = problem.operation;
  requireData(op && KINDS.includes(op.kind) && problem.level === KINDS.indexOf(op.kind) + 1, "operation domain");
  const fields = op.kind === "same-bends" ? ["kind"] : op.kind === "translate" ? ["dx", "dy", "kind"] : op.kind === "rotate" ? ["angle", "kind", "pivot"] : ["kind", "pivot", "scale"];
  requireData(JSON.stringify(Object.keys(op).sort()) === JSON.stringify(fields), "operation fields");
  if (op.kind === "translate") requireData([op.dx, op.dy].every((v) => Number.isFinite(v) && v % 10 === 0) && (op.dx !== 0 || op.dy !== 0), "nonzero grid vector");
  if (problem.level >= 3) requireData(Array.isArray(op.pivot) && op.pivot.length === 2 && op.pivot.every((v) => v === 50), "fixed pivot");
  if (op.kind === "rotate") requireData([90, -90, 180].includes(op.angle), "rotation angle");
  if (problem.level >= 4) requireData(op.scale === (op.kind === "enlarge" ? 2 : .5), "scale factor");
  checkPath(problem.target, problem.closed);
  problem.choices.forEach((choice) => {
    checkPath(choice, problem.closed);
    requireData(choice.length === problem.target.length, "vertex correspondence");
  });
  requireData(new Set(problem.choices.map((c) => inkKey(c, problem.closed))).size === 3, "visually duplicate choices");
  const expected = transformPoints(problem.target, op);
  const matches = problem.choices.flatMap((c, i) => same(c, expected) ? [i] : []);
  requireData(matches.length === 1 && matches[0] === problem.answerIndex, "answer metadata disagrees with coordinates");
  return expected;
}

function observe(target, choice) {
  const changed = choice.flatMap((p, i) => same([p], [target[i]]) ? [] : [i]);
  requireData(changed.length === 2 && changed[0] > 0 && changed[1] === changed[0] + 1 && changed[1] < target.length - 1, "unknown observation difference");
  const [i, j] = changed;
  const shift = choice[i].map((v, axis) => v - target[i][axis]);
  requireData(same([shift], [choice[j].map((v, axis) => v - target[j][axis])]), "section changed shape");
  const vertical = target[i][0] === target[j][0];
  requireData(shift[vertical ? 1 : 0] === 0 && Math.abs(shift[vertical ? 0 : 1]) >= 3 && Math.abs(shift[vertical ? 0 : 1]) <= 6, "unknown section offset");
  const neighbors = [[i - 1, i], [j, j + 1]].map(([a, b], index) => {
    const endpoint = index === 0 ? i : j;
    const other = index === 0 ? j : i;
    const axis = vertical ? "horizontal" : "vertical";
    const side = vertical ? (target[endpoint][1] < target[other][1] ? "upper" : "lower") : (target[endpoint][0] < target[other][0] ? "left" : "right");
    const expectedLength = Math.hypot(target[b][0] - target[a][0], target[b][1] - target[a][1]);
    const actualLength = Math.hypot(choice[b][0] - choice[a][0], choice[b][1] - choice[a][1]);
    return { side, axis, expectedLength, actualLength, difference: actualLength - expectedLength };
  });
  return { code: "observation-section", segmentIndex: i, axis: vertical ? "vertical" : "horizontal", shift: copyVector(shift), neighbors };
}

// Data codes describe measured geometry, never the position of a distractor in
// choices. Invalid data and unrecognized mistakes throw; only a real match wins.
export function diagnoseChoice(problem, choiceIndex) {
  const expected = checkProblem(problem, choiceIndex);
  const { target, operation: op } = problem, choice = problem.choices[choiceIndex];
  const base = { correct: false, kind: op.kind };
  if (same(choice, expected)) return { correct: true, kind: op.kind, code: "correct" };
  if (op.kind === "same-bends") return { ...base, ...observe(target, choice) };
  if (op.kind === "translate") {
    const actual = choice[0].map((v, axis) => v - target[0][axis]);
    requireData(actual.every((v) => v % 10 === 0) && actual.some((v) => v !== 0) && choice.every((p, i) => p.every((v, axis) => near(v - target[i][axis], actual[axis]))), "unknown translation difference");
    const directionMatches = actual[0] * op.dy === actual[1] * op.dx && actual[0] * op.dx + actual[1] * op.dy > 0;
    return { ...base, code: directionMatches ? "translation-distance" : "translation-direction", expectedMove: { dx: op.dx, dy: op.dy }, actualMove: copyVector(actual), directionMatches, differenceCells: { horizontal: (Math.abs(actual[0]) - Math.abs(op.dx)) / 10, vertical: (Math.abs(actual[1]) - Math.abs(op.dy)) / 10 } };
  }
  if (op.kind === "rotate") {
    const angles = [0, 90, -90, 180].filter((angle) => same(choice, transformPoints(target, { angle, pivot: op.pivot })));
    requireData(angles.length === 1, "unknown or ambiguous rotation difference");
    return { ...base, code: angles[0] === 0 ? "rotation-unturned" : "rotation-angle", expectedAngle: op.angle, actualAngle: angles[0], pivot: [...op.pivot] };
  }
  const factors = [0, 1].map((axis) => {
    const i = target.findIndex((p) => p[axis] !== op.pivot[axis]);
    requireData(i >= 0, "unobservable scaling axis");
    const factor = (choice[i][axis] - op.pivot[axis]) / (target[i][axis] - op.pivot[axis]);
    requireData(choice.every((p, j) => near(p[axis] - op.pivot[axis], factor * (target[j][axis] - op.pivot[axis]))), "unknown scaling difference");
    return factor;
  });
  const scaleData = { expectedScale: op.scale, actualScale: { horizontal: factors[0], vertical: factors[1] }, pivot: [...op.pivot] };
  if (factors.every((n) => near(n, 1))) return { ...base, ...scaleData, code: "scale-unchanged" };
  const changed = factors.findIndex((n) => near(n, op.scale));
  requireData(changed >= 0 && near(factors[1 - changed], 1), "unknown axis-scale mistake");
  return { ...base, ...scaleData, code: "scale-one-axis", changedAxis: changed === 0 ? "horizontal" : "vertical", unchangedAxis: changed === 0 ? "vertical" : "horizontal" };
}

const words = {
  ko: { horizontal: "가로", vertical: "세로", upper: "위쪽", lower: "아래쪽", left: "왼쪽", right: "오른쪽", up: "위쪽", down: "아래쪽" },
  en: { horizontal: "horizontal", vertical: "vertical", upper: "upper", lower: "lower", left: "left", right: "right", up: "up", down: "down" },
  zh: { horizontal: "横向", vertical: "纵向", upper: "上方", lower: "下方", left: "左侧", right: "右侧", up: "上方", down: "下方" },
  ja: { horizontal: "横", vertical: "縦", upper: "上側", lower: "下側", left: "左側", right: "右側", up: "上側", down: "下側" }
};
const number = (value) => String(Math.round(Math.abs(value) * 1000) / 1000);
const cellsEn = (value) => `${number(value)} cell${Math.abs(value) === 1 ? "" : "s"}`;
const direction = (dx, dy) => dx ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up";

function moveText({ dx, dy }, language) {
  const parts = [[dx, 0], [0, dy]].filter(([x, y]) => x || y).map(([x, y]) => {
    const amount = Math.abs(x || y) / 10, dir = direction(x, y), w = words[language];
    if (language === "ko") return `${w[dir]}으로 ${number(amount)}칸`;
    if (language === "en") return `${cellsEn(amount)} ${w[dir]}`;
    if (language === "zh") return `向${{ right: "右", left: "左", up: "上", down: "下" }[dir]}移动${number(amount)}格`;
    return `${{ right: "右", left: "左", up: "上", down: "下" }[dir]}に${number(amount)}マス`;
  });
  return parts.join(language === "en" ? " and " : language === "zh" ? "、" : language === "ja" ? "、" : ", ");
}

function angleText(angle, language) {
  const half = Math.abs(angle) === 180;
  if (language === "ko") return `${angle > 0 ? "시계" : "반시계"} 방향으로 ${half ? "반 바퀴" : "반의 반 바퀴"} (${Math.abs(angle)}°)`;
  if (language === "en") return `a ${half ? "half" : "quarter"} turn ${angle > 0 ? "clockwise" : "counterclockwise"} (${Math.abs(angle)}°)`;
  if (language === "zh") return `${angle > 0 ? "顺时针" : "逆时针"}转${half ? "半圈" : "四分之一圈"}（${Math.abs(angle)}°）`;
  return `${angle > 0 ? "時計回り" : "反時計回り"}に${half ? "半回転" : "4分の1回転"}（${Math.abs(angle)}°）`;
}

function distanceText(d, language) {
  const axes = Object.entries(d.differenceCells).filter(([, n]) => n !== 0), more = axes[0][1] > 0, w = words[language];
  if (language === "ko") return `${axes.map(([axis, n]) => `${axes.length > 1 ? `${w[axis]}로 ` : ""}${number(n)}칸`).join(", ")} ${more ? "더" : "덜"} 옮겼어요`;
  if (language === "en") return axes.map(([axis, n]) => `the ${w[axis]} move is ${cellsEn(n)} ${more ? "too long" : "too short"}`).join(" and ");
  if (language === "zh") return axes.map(([axis, n]) => `${w[axis]}${more ? "多" : "少"}移了${number(n)}格`).join("，");
  return `${axes.map(([axis, n]) => `${axes.length > 1 ? `${w[axis]}に` : ""}${number(n)}マス`).join("、")}${more ? "多く動いています" : "足りません"}`;
}

function observationText(d, language) {
  const w = words[language], dir = direction(d.shift.dx, d.shift.dy);
  const neighborText = d.neighbors.map((n) => {
    const longer = n.difference > 0;
    if (language === "ko") return `${w[n.side]} ${w[n.axis]}선은 ${longer ? "길어졌어요" : "짧아졌어요"}`;
    if (language === "en") return `the ${w[n.side]} ${w[n.axis]} segment became ${longer ? "longer" : "shorter"}`;
    if (language === "zh") return `${w[n.side]}的${w[n.axis]}线段变${longer ? "长" : "短"}了`;
    return `${w[n.side]}の${w[n.axis]}の線分は${longer ? "長く" : "短く"}なっています`;
  });
  if (language === "ko") return `${w[d.axis]} 구간이 ${w[dir]}으로 조금 옮겨져 있어요. ${neighborText.join(". ")}.`;
  if (language === "en") return `The ${w[d.axis]} section is shifted slightly ${w[dir]}; ${neighborText.join(" and ")}.`;
  const compass = { right: "右", left: "左", up: "上", down: "下" }[dir];
  if (language === "zh") return `${w[d.axis]}线段略微向${compass}偏移。${neighborText.join("，")}。`;
  return `${w[d.axis]}の区間が${compass}に少しずれています。${neighborText.join("。 ")}。`;
}

function scalingText(d, language) {
  const w = words[language], enlarge = d.expectedScale === 2;
  if (d.code === "scale-unchanged") {
    if (language === "ko") return `가로와 세로가 모두 원래 길이 그대로예요. 기준점에서 가로와 세로를 모두 ${enlarge ? "2배로 늘려야" : "절반으로 줄여야"} 해요.`;
    if (language === "en") return `Both width and height are unchanged. Both must be ${enlarge ? "doubled" : "halved"} about the marked pivot.`;
    if (language === "zh") return `宽和高都没有改变。应以标记点为基准，将横向和纵向的距离都变为${enlarge ? "2倍" : "一半"}。`;
    return `横も縦も元の長さのままです。印の点を基準に、横と縦を両方${enlarge ? "2倍" : "半分"}にする必要があります。`;
  }
  if (language === "ko") return `${w[d.changedAxis]}만 ${enlarge ? "2배로 늘어나고" : "절반으로 줄고"} ${w[d.unchangedAxis]}는 그대로예요. ${w[d.unchangedAxis]}도 ${enlarge ? "2배로 늘려야" : "절반으로 줄여야"} 해요.`;
  if (language === "en") return `Only ${d.changedAxis === "horizontal" ? "width" : "height"} was ${enlarge ? "doubled" : "halved"}; ${d.unchangedAxis === "horizontal" ? "width" : "height"} is unchanged. Both dimensions must be ${enlarge ? "doubled" : "halved"}.`;
  if (language === "zh") return `只有${w[d.changedAxis]}距离变为${enlarge ? "2倍" : "一半"}，${w[d.unchangedAxis]}距离没有变。两个方向的距离都应变为${enlarge ? "2倍" : "一半"}。`;
  return `${w[d.changedAxis]}だけが${enlarge ? "2倍" : "半分"}になり、${w[d.unchangedAxis]}は元のままです。${w[d.unchangedAxis]}も${enlarge ? "2倍" : "半分"}にする必要があります。`;
}

/** Returns localized mistake feedback, or '' for a coordinate-verified answer.
 * Throws on malformed indices/problems, unsupported locales, or unknown errors.
 */
export function choiceFeedback(problem, choiceIndex, language = "ko") {
  if (!LANGUAGES.includes(language)) throw new RangeError("Unsupported choice-feedback language");
  const d = diagnoseChoice(problem, choiceIndex);
  if (d.correct) return "";
  if (d.code === "observation-section") return observationText(d, language);
  if (d.code.startsWith("scale-")) return scalingText(d, language);
  if (d.code.startsWith("translation-")) {
    const expected = moveText(d.expectedMove, language), actual = moveText(d.actualMove, language);
    if (d.code === "translation-direction") {
      if (language === "ko") return `${expected} 옮겨야 하는데 ${actual} 옮겼어요.`;
      if (language === "en") return `It moved ${actual}, but it should move ${expected}.`;
      if (language === "zh") return `应${expected}，却${actual}。`;
      return `${expected}動かすところを、${actual}動かしています。`;
    }
    const difference = distanceText(d, language);
    if (language === "ko") return `방향은 맞지만 ${difference}. ${expected} 옮겨야 해요.`;
    if (language === "en") return `The direction matches, but ${difference}. It should move ${expected}.`;
    if (language === "zh") return `方向对了，但${difference}。应${expected}。`;
    return `向きは合っていますが、${difference}。${expected}動かす必要があります。`;
  }
  const expected = angleText(d.expectedAngle, language);
  if (d.code === "rotation-unturned") {
    if (language === "ko") return `아직 돌리지 않은 모양이에요. 중심을 고정하고 ${expected} 돌려야 해요.`;
    if (language === "en") return `The shape has not turned. Keep the pivot fixed and turn ${expected}.`;
    if (language === "zh") return `图形还没有旋转。应固定中心，${expected}。`;
    return `まだ回していない形です。中心を固定して${expected}させる必要があります。`;
  }
  const actual = angleText(d.actualAngle, language);
  if (language === "ko") return `${expected} 돌려야 하는데 ${actual} 돌렸어요.`;
  if (language === "en") return `The shape turned ${actual}, but it should turn ${expected} about the fixed pivot.`;
  if (language === "zh") return `应绕固定中心${expected}，却${actual}。`;
  return `中心を固定して${expected}させるところを、${actual}させています。`;
}
