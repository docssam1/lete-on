import assert from "node:assert/strict";
import { levels } from "./levels.js";
import { diagnoseChoice, choiceFeedback } from "./choice-feedback.js";

const LANGUAGES = ["ko", "en", "zh", "ja"];
const TURN_LABELS = {
  ko: { 90: "시계 방향으로 반의 반 바퀴 (90°)", "-90": "반시계 방향으로 반의 반 바퀴 (90°)", 180: "시계 방향으로 반 바퀴 (180°)" },
  en: { 90: "a quarter turn clockwise (90°)", "-90": "a quarter turn counterclockwise (90°)", 180: "a half turn clockwise (180°)" },
  zh: { 90: "顺时针转四分之一圈（90°）", "-90": "逆时针转四分之一圈（90°）", 180: "顺时针转半圈（180°）" },
  ja: { 90: "時計回りに4分の1回転（90°）", "-90": "反時計回りに4分の1回転（90°）", 180: "時計回りに半回転（180°）" }
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const frozenBank = structuredClone(levels);
function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
freeze(frozenBank);
const originalBank = JSON.stringify(levels);
const width = (points, axis) => Math.max(...points.map((p) => p[axis])) - Math.min(...points.map((p) => p[axis]));
const edgeLength = (points, i) => Math.abs(points[i + 1][0] - points[i][0]) + Math.abs(points[i + 1][1] - points[i][1]);

// Independent fixtures use direct coordinate arithmetic, measured edge lengths,
// bounding boxes, and atan2. They do not import any production math helpers.
function expectedPoints(p) {
  return p.target.map(([x, y]) => {
    if (p.level === 1) return [x, y];
    if (p.level === 2) return [x + p.operation.dx, y + p.operation.dy];
    if (p.level === 3) {
      if (p.operation.angle === 90) return [100 - y, x];
      if (p.operation.angle === -90) return [y, 100 - x];
      return [100 - x, 100 - y];
    }
    return p.level === 4 ? [2 * x - 50, 2 * y - 50] : [(x + 50) / 2, (y + 50) / 2];
  });
}

function verifyDiagnosis(p, choiceIndex) {
  const c = p.choices[choiceIndex], d = diagnoseChoice(p, choiceIndex);
  const correct = equal(c, expectedPoints(p));
  assert.equal(d.correct, correct);
  assert.equal(d.kind, p.operation.kind);
  assert.ok(!("answerIndex" in d) && !("choiceIndex" in d), "diagnosis must not disclose an answer position");
  if (correct) {
    assert.equal(d.code, "correct");
    return d;
  }
  if (p.level === 1) {
    assert.equal(d.code, "observation-section");
    const changed = c.flatMap((point, i) => equal(point, p.target[i]) ? [] : [i]);
    assert.equal(changed.length, 2);
    assert.equal(d.segmentIndex, changed[0]);
    const [a, b] = changed;
    const vertical = p.target[a][0] === p.target[b][0];
    assert.equal(d.axis, vertical ? "vertical" : "horizontal");
    assert.deepEqual(d.shift, { dx: c[a][0] - p.target[a][0], dy: c[a][1] - p.target[a][1] });
    const modifiedEdges = p.target.slice(0, -1).flatMap((_, i) => edgeLength(p.target, i) === edgeLength(c, i) ? [] : [i]);
    assert.deepEqual(modifiedEdges, [a - 1, b]);
    const midpoint = (p.target[a][vertical ? 1 : 0] + p.target[b][vertical ? 1 : 0]) / 2;
    const neighbors = modifiedEdges.map((i) => {
      const endpoint = i < a ? a : b;
      const side = vertical ? (p.target[endpoint][1] < midpoint ? "upper" : "lower") : (p.target[endpoint][0] < midpoint ? "left" : "right");
      return { side, axis: vertical ? "horizontal" : "vertical", expectedLength: edgeLength(p.target, i), actualLength: edgeLength(c, i), difference: edgeLength(c, i) - edgeLength(p.target, i) };
    });
    assert.deepEqual(d.neighbors, neighbors);
  } else if (p.level === 2) {
    const offsets = c.map(([x, y], i) => [x - p.target[i][0], y - p.target[i][1]]);
    assert.ok(offsets.every((v) => equal(v, offsets[0])));
    const [dx, dy] = offsets[0];
    const sameDirection = Math.sign(dx) === Math.sign(p.operation.dx) && Math.sign(dy) === Math.sign(p.operation.dy);
    assert.equal(d.code, sameDirection ? "translation-distance" : "translation-direction");
    assert.equal(d.directionMatches, sameDirection);
    assert.deepEqual(d.actualMove, { dx, dy });
    assert.deepEqual(d.expectedMove, { dx: p.operation.dx, dy: p.operation.dy });
    assert.deepEqual(d.differenceCells, { horizontal: (Math.abs(dx) - Math.abs(p.operation.dx)) / 10, vertical: (Math.abs(dy) - Math.abs(p.operation.dy)) / 10 });
  } else if (p.level === 3) {
    const i = p.target.findIndex(([x, y]) => x !== 50 || y !== 50);
    const a = p.target[i].map((v) => v - 50), b = c[i].map((v) => v - 50);
    let angle = Math.round(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]) * 180 / Math.PI);
    if (angle === -180) angle = 180;
    angle = angle || 0;
    assert.equal(d.code, angle === 0 ? "rotation-unturned" : "rotation-angle");
    assert.equal(d.actualAngle, angle);
    assert.equal(d.expectedAngle, p.operation.angle);
    assert.deepEqual(d.pivot, [50, 50]);
  } else {
    const factors = { horizontal: width(c, 0) / width(p.target, 0), vertical: width(c, 1) / width(p.target, 1) };
    assert.deepEqual(d.actualScale, factors);
    assert.equal(d.expectedScale, p.level === 4 ? 2 : .5);
    if (equal(c, p.target)) {
      assert.equal(d.code, "scale-unchanged");
    } else {
      assert.equal(d.code, "scale-one-axis");
      const changed = factors.horizontal === 1 ? "vertical" : "horizontal";
      assert.equal(d.changedAxis, changed);
      assert.equal(d.unchangedAxis, changed === "horizontal" ? "vertical" : "horizontal");
    }
  }
  return d;
}

const counts = { correct: 0, wrong: 0, localized: 0, permutations: 0, invalidInputs: 0 };
const codes = {};
for (const level of frozenBank) {
  for (const p of level.problems) {
    for (let i = 0; i < 3; i++) {
      const d = verifyDiagnosis(p, i);
      counts[d.correct ? "correct" : "wrong"]++;
      codes[d.code] = (codes[d.code] || 0) + 1;
      for (const language of LANGUAGES) {
        const text = choiceFeedback(p, i, language);
        assert.equal(typeof text, "string");
        assert.equal(text === "", d.correct);
        assert.doesNotMatch(text, /undefined|NaN|Infinity|\[object Object\]/);
        assert.doesNotMatch(text, /정답|보기\s*\d|answer\s*(?:is|:)|choice\s*\d|答案|选项\s*\d|正解|選択肢\s*\d/i, "no answer-index disclosure");
        assert.doesNotMatch(text, /^(?:정확해|맞았|Correct!|Great!|正确！|正解！)/, "no success statement for an error");
        if (language === "ko") {
          assert.doesNotMatch(text, /축소|1\s*\/\s*2|0\.5|½/);
          if (!d.correct && p.level === 5) assert.match(text, /절반/);
          if (!d.correct && p.level === 4) assert.match(text, /2배/);
          assert.equal(choiceFeedback(p, i), text, "default language is Korean");
        }
        if (!d.correct && p.level >= 4) {
          const factorWords = { ko: p.level === 4 ? "2배" : "절반", en: p.level === 4 ? "doubled" : "halved", zh: p.level === 4 ? "2倍" : "一半", ja: p.level === 4 ? "2倍" : "半分" };
          assert.ok(text.includes(factorWords[language]), "each locale must state the actual factor");
          if (d.code === "scale-one-axis") {
            const horizontalChanged = width(p.choices[i], 0) !== width(p.target, 0);
            const axisWords = { ko: horizontalChanged ? "가로만" : "세로만", en: horizontalChanged ? "Only width" : "Only height", zh: horizontalChanged ? "只有横向" : "只有纵向", ja: horizontalChanged ? "横だけ" : "縦だけ" };
            assert.ok(text.startsWith(axisWords[language]), "each locale must name the measured changed axis");
          }
        }
        if (!d.correct && p.level === 1) {
          assert.doesNotMatch(text, /\d|단위|\bunits?\b|单位|単位|칸|\bcells?\b|格|マス/, "observation copy must not expose internal distances or invent grid counts");
          assert.equal(Math.hypot(d.shift.dx, d.shift.dy), 4, "numeric diagnosis stays intact");
          const dir = d.shift.dx ? d.shift.dx > 0 ? "right" : "left" : d.shift.dy > 0 ? "down" : "up";
          const directionPhrases = {
            ko: { right: "오른쪽으로 조금", left: "왼쪽으로 조금", up: "위쪽으로 조금", down: "아래쪽으로 조금" },
            en: { right: "slightly right", left: "slightly left", up: "slightly up", down: "slightly down" },
            zh: { right: "略微向右偏移", left: "略微向左偏移", up: "略微向上偏移", down: "略微向下偏移" },
            ja: { right: "右に少し", left: "左に少し", up: "上に少し", down: "下に少し" }
          };
          assert.ok(text.includes(directionPhrases[language][dir]), "observation must name the actual shift direction");
          const sideWords = { ko: { upper: "위쪽", lower: "아래쪽", left: "왼쪽", right: "오른쪽" }, en: { upper: "upper", lower: "lower", left: "left", right: "right" }, zh: { upper: "上方", lower: "下方", left: "左侧", right: "右侧" }, ja: { upper: "上側", lower: "下側", left: "左側", right: "右側" } };
          for (const n of d.neighbors) {
            assert.equal(Math.abs(n.difference), 4, "numeric neighbor differences stay intact");
            const phrases = { ko: n.difference > 0 ? "길어졌어요" : "짧아졌어요", en: n.difference > 0 ? "became longer" : "became shorter", zh: n.difference > 0 ? "变长了" : "变短了", ja: n.difference > 0 ? "長くなっています" : "短くなっています" };
            const clause = text.split(language === "en" ? /;| and / : language === "zh" ? /。|，/ : /[.。]/).find((part) => part.includes(sideWords[language][n.side]) && part.includes(phrases[language]));
            assert.ok(clause, "each neighboring segment must be described with its actual longer/shorter change");
          }
        }
        if (!d.correct && p.level === 3) {
          assert.doesNotMatch(text, /시계 반대|\d+도|degrees|\d+度/, "rotation feedback uses the agreed turn and degree notation");
          for (const angle of [d.expectedAngle, d.actualAngle].filter((n) => n !== 0)) {
            assert.ok(text.includes(TURN_LABELS[language][angle]), "each locale must state the requested and actual turn using quarter/half plus degrees");
          }
        }
        counts.localized++;
      }
    }
    for (const order of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]) {
      const shuffled = { ...p, choices: order.map((i) => p.choices[i]), answerIndex: order.indexOf(p.answerIndex) };
      for (let i = 0; i < 3; i++) {
        assert.deepEqual(diagnoseChoice(shuffled, i), diagnoseChoice(p, order[i]), "classification must follow coordinates after shuffling choices");
        for (const language of LANGUAGES) assert.equal(choiceFeedback(shuffled, i, language), choiceFeedback(p, order[i], language));
        counts.permutations++;
      }
    }
  }
}
assert.equal(counts.correct, 50);
assert.equal(counts.wrong, 100);
assert.equal(counts.localized, 600);
assert.equal(counts.permutations, 900);
assert.deepEqual(codes, { "observation-section": 20, correct: 50, "translation-distance": 10, "translation-direction": 10, "rotation-unturned": 10, "rotation-angle": 10, "scale-unchanged": 20, "scale-one-axis": 20 });

function indexWithCode(p, code) { return p.choices.findIndex((_, i) => diagnoseChoice(p, i).code === code); }
const first = (level) => frozenBank[level - 1].problems[0];
const translation = first(2), rotation = first(3), enlarge = first(4), reduce = first(5);
assert.equal(choiceFeedback(translation, indexWithCode(translation, "translation-distance")), "방향은 맞지만 1칸 더 옮겼어요. 오른쪽으로 1칸 옮겨야 해요.");
assert.equal(choiceFeedback(translation, indexWithCode(translation, "translation-direction")), "오른쪽으로 1칸 옮겨야 하는데 왼쪽으로 1칸 옮겼어요.");
assert.equal(choiceFeedback(rotation, indexWithCode(rotation, "rotation-angle")), "시계 방향으로 반의 반 바퀴 (90°) 돌려야 하는데 반시계 방향으로 반의 반 바퀴 (90°) 돌렸어요.");
assert.equal(choiceFeedback(reduce, indexWithCode(reduce, "scale-one-axis")), "가로만 절반으로 줄고 세로는 그대로예요. 세로도 절반으로 줄여야 해요.");
const verticalReduction = frozenBank[4].problems[1];
assert.equal(choiceFeedback(verticalReduction, indexWithCode(verticalReduction, "scale-one-axis")), "세로만 절반으로 줄고 가로는 그대로예요. 가로도 절반으로 줄여야 해요.");
const shorterMove = frozenBank[1].problems[8];
assert.equal(choiceFeedback(shorterMove, indexWithCode(shorterMove, "translation-distance")), "방향은 맞지만 1칸 덜 옮겼어요. 오른쪽으로 2칸 옮겨야 해요.");
const diagonal = frozenBank[1].problems[4];
assert.equal(choiceFeedback(diagonal, indexWithCode(diagonal, "translation-distance")), "방향은 맞지만 가로로 1칸, 세로로 1칸 더 옮겼어요. 오른쪽으로 1칸, 아래쪽으로 1칸 옮겨야 해요.");
assert.equal(choiceFeedback(first(1), 0), "세로 구간이 오른쪽으로 조금 옮겨져 있어요. 위쪽 가로선은 길어졌어요. 아래쪽 가로선은 짧아졌어요.");
const halfTurn = frozenBank[2].problems[2];
assert.equal(choiceFeedback(halfTurn, indexWithCode(halfTurn, "rotation-unturned")), "아직 돌리지 않은 모양이에요. 중심을 고정하고 시계 방향으로 반 바퀴 (180°) 돌려야 해요.");

const localeFixtures = {
  en: ["It moved 1 cell left, but it should move 1 cell right.", "The shape turned a quarter turn counterclockwise (90°), but it should turn a quarter turn clockwise (90°) about the fixed pivot.", "Only width was halved; height is unchanged. Both dimensions must be halved."],
  zh: ["应向右移动1格，却向左移动1格。", "应绕固定中心顺时针转四分之一圈（90°），却逆时针转四分之一圈（90°）。", "只有横向距离变为一半，纵向距离没有变。两个方向的距离都应变为一半。"],
  ja: ["右に1マス動かすところを、左に1マス動かしています。", "中心を固定して時計回りに4分の1回転（90°）させるところを、反時計回りに4分の1回転（90°）させています。", "横だけが半分になり、縦は元のままです。縦も半分にする必要があります。"]
};
for (const [language, expected] of Object.entries(localeFixtures)) {
  assert.equal(choiceFeedback(translation, indexWithCode(translation, "translation-direction"), language), expected[0]);
  assert.equal(choiceFeedback(rotation, indexWithCode(rotation, "rotation-angle"), language), expected[1]);
  assert.equal(choiceFeedback(reduce, indexWithCode(reduce, "scale-one-axis"), language), expected[2]);
}

function rejected(p, index, pattern = /Invalid shape-choice|choiceIndex/) {
  assert.throws(() => diagnoseChoice(p, index), pattern);
  for (const language of LANGUAGES) assert.throws(() => choiceFeedback(p, index, language), pattern);
  counts.invalidInputs++;
}
for (const index of [-1, 3, .5, NaN, Infinity, -Infinity, "0", "1", undefined, null, true, false, {}, [], 1n]) rejected(first(1), index, /choiceIndex/);
for (const language of ["kr", "ko-KR", "", null, 0, {}]) {
  for (const i of [first(1).answerIndex, 0]) assert.throws(() => choiceFeedback(first(1), i, language), /Unsupported choice-feedback language/);
  counts.invalidInputs++;
}
for (const value of [null, undefined, {}, [], "problem"]) rejected(value, 0);

function malformed(source, change, pattern) {
  const p = structuredClone(source);
  const index = indexWithCode(source, source.level === 1 ? "observation-section" : source.level === 2 ? "translation-distance" : source.level === 3 ? "rotation-angle" : "scale-one-axis");
  change(p, index);
  rejected(p, index, pattern);
}
malformed(first(1), (p) => { p.closed = "true"; });
malformed(first(1), (p) => { p.operation = null; });
malformed(first(1), (p) => { p.operation.kind = "flip"; });
malformed(first(1), (p) => { p.operation.scale = 2; });
malformed(first(1), (p) => { p.level = 2; });
malformed(first(1), (p) => { p.answerIndex = 0; }, /answer metadata/);
malformed(first(1), (p) => { p.answerIndex = "1"; }, /answer index/);
malformed(first(1), (p) => { p.choices = []; });
malformed(first(1), (p) => { p.target[0][0] = NaN; }, /coordinates/);
malformed(first(1), (p, i) => { p.choices[i][0][0] = 101; }, /coordinates/);
malformed(first(1), (p, i) => { p.choices[i][0] = [...p.choices[i][1]]; }, /repeated vertex/);
malformed(first(1), (p, i) => { p.choices[i][1][1] += 1; }, /orthogonal/);
malformed(first(1), (p, i) => { p.choices[i] = [...p.choices[p.answerIndex]].reverse(); }, /duplicate choices/);
malformed(first(1), (p, i) => { p.choices[i] = p.target.map(([x, y]) => [x + 4, y]); }, /unknown observation/);
malformed(first(1), (p) => { p.target = [[20,20],[70,20],[70,70],[40,70],[40,10],[80,10],[80,80],[20,80]]; }, /self-intersection/);
malformed(translation, (p) => { p.operation.dx = 9; }, /grid vector/);
malformed(translation, (p) => { p.operation.dx = 0; }, /grid vector/);
malformed(translation, (p, i) => { p.choices[i] = p.target.map(([x, y], k) => [x + (k === 1 || k === 2 ? 4 : 0), y]); }, /unknown translation/);
malformed(rotation, (p) => { delete p.operation.pivot; }, /operation fields/);
malformed(rotation, (p) => { p.operation.pivot = [40,50]; }, /fixed pivot/);
malformed(rotation, (p) => { p.operation.angle = 45; }, /rotation angle/);
malformed(rotation, (p, i) => { p.choices[i] = p.target.map(([x, y]) => [90 - y, x + 10]); }, /unknown or ambiguous rotation/);
malformed(enlarge, (p) => { p.operation.scale = 1.5; }, /scale factor/);
malformed(reduce, (p) => { p.operation.scale = "0.5"; }, /scale factor/);
malformed(enlarge, (p, i) => { p.choices[i] = p.target.map(([x, y]) => [50 + 1.5 * (x - 50), y]); }, /unknown axis-scale/);
malformed(reduce, (p, i) => { p.choices[i] = p.target.map(([x, y]) => [x + 2, 50 + .5 * (y - 50)]); }, /unknown scaling/);

const mutableDiagnosis = diagnoseChoice(translation, indexWithCode(translation, "translation-distance"));
mutableDiagnosis.expectedMove.dx = 999;
assert.equal(translation.operation.dx, 10, "diagnosis contains no mutable bank references");
const rotationDiagnosis = diagnoseChoice(rotation, indexWithCode(rotation, "rotation-angle"));
rotationDiagnosis.pivot[0] = 0;
assert.deepEqual(rotation.operation.pivot, [50, 50]);
assert.equal(JSON.stringify(levels), originalBank, "feedback and tests must not mutate the bank");
console.log("Shape-transform choice feedback passed:");
console.log(JSON.stringify({ ...counts, codes }, null, 2));
