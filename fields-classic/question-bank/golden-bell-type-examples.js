import { cubeViews, cubeBounds, solveCubes, magicSquare3, magicSquare4, isMagic, magicLines, solveMagic } from "./golden-bell-book09-game-models.js?v=20261024t";

// 「유형별 예제」 — 게임 전에, 그 레슨의 원본 문항 유형(typeLabel)마다 풀이를 한 단계씩 보여 주는 예제 1~2개.
// 규칙(원장 지시·정답 보호):
//   · 예제는 새로 지은 것이다. 원본 문항의 수·그림을 그대로 쓰지 않는다(검사기가 원본 그림과 겹치는지 본다).
//   · 답과 풀이 숫자는 모두 이 파일의 코드가 계산한다. 원본의 답(비공개 DB)은 읽지도 쓰지도 않는다.
//   · 아이 말: 짧은 문장, 한 문장에 한 행동. 각도·분수 말 대신 「반 바퀴」·「반의 반 바퀴」, 「가운데 수를 세 번 더하면」.
// 예제 모양: { id, title, problem, figure, steps: [{ text, figure? }], answer, value }
//   figure는 golden-bell-type-examples-view.js가 그린다. 단계에 figure가 없으면 앞 단계 그림을 그대로 쓴다.
//   value는 검사기용(코드가 낸 답). 화면에는 마지막 단계에서만 answer 문장으로 나온다.

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const plus = (xs) => xs.join(" + ");
// 받침에 따라 조사를 고른다. 숫자는 읽는 소리로(1·3·6·7·8·0은 받침 있음), 기호·영문(□·A)은 받침 없음.
const DIGIT_BATCHIM = { 0: true, 1: true, 2: false, 3: true, 4: false, 5: false, 6: true, 7: true, 8: true, 9: false };
const PAIRS = { 은: ["은", "는"], 이: ["이", "가"], 을: ["을", "를"], 과: ["과", "와"], 이에요: ["이에요", "예요"] };
export function josa(word, pair) {
  const last = String(word).replace(/[^가-힣ㄱ-ㅎ0-9A-Za-z□]+$/u, "").at(-1) || "";
  const code = last.charCodeAt(0) - 0xac00;
  // 자음 글자(ㄱ·ㄴ…)는 「기역·니은」처럼 읽어 모두 받침이 있다
  const has = /\d/.test(last) ? DIGIT_BATCHIM[last] : /[ㄱ-ㅎ]/u.test(last) ? true : code >= 0 && code <= 11171 ? code % 28 !== 0 : false;
  return `${word}${PAIRS[pair][has ? 0 : 1]}`;
}

// ───────────────────────── 9권 쌓기나무의 최대와 최소 ─────────────────────────
// 칸 이름은 그림의 표시와 같다: 세로줄 아래에 「앞 ○층」, 가로줄 오른쪽에 「옆 ○층」.
function cubeExample({ id, title, heights, ask }) {
  const views = cubeViews(heights);
  const rows = views.top.length;
  const sideOf = (r) => views.side[rows - 1 - r];
  const bounds = cubeBounds(views);
  const sol = solveCubes(views);
  const topCells = views.top.flatMap((row, r) => row.map((on, c) => (on ? [r, c] : null))).filter(Boolean);
  const ones = views.top.map((row) => row.map((on) => (on ? 1 : 0)));
  const map = (hs, extra = {}) => ({ kind: "cube-map", views, heights: hs.map((row) => [...row]), ...extra });
  const steps = [{ text: "위에서 본 칸마다 쌓기나무가 적어도 1개씩 있어요. 칸마다 1부터 써요.", figure: map(ones, { tone: "given", mark: { cells: topCells } }) }];
  const oneCols = views.front.map((h, c) => (h === 1 ? c : -1)).filter((c) => c >= 0);
  const oneRows = views.top.map((_, r) => (sideOf(r) === 1 ? r : -1)).filter((r) => r >= 0);
  if (oneCols.length || oneRows.length) steps.push({ text: "「앞 1층」이나 「옆 1층」인 줄의 칸은 더 높일 수 없어요. 모두 1층이에요.", figure: map(ones, { tone: "given", mark: { cols: oneCols, rows: oneRows } }) });
  // 가장 적게(유형 1은 하나로 정해지는) 쌓기: 높은 층이 필요한 줄마다 그 층을 쌓을 수 있는 칸을 찾는다.
  const target = sol.minMap;
  const work = ones.map((row) => [...row]);
  const tall = [];
  target.forEach((row, r) => row.forEach((h, c) => { if (h > 1) tall.push([r, c, h]); }));
  tall.sort((a, b) => b[2] - a[2]);
  for (const [r, c, h] of tall) {
    work[r][c] = h;
    const forFront = views.front[c] === h, forSide = sideOf(r) === h;
    const onlyInCol = views.top.every((row, rr) => rr === r || !row[c] || bounds[rr][c] < h);
    const onlyInRow = views.top[r].every((on, cc) => cc === c || !on || bounds[r][cc] < h);
    const text = forFront && forSide
      ? `「앞 ${h}층」 줄과 「옆 ${h}층」 줄이 만나는 칸에 ${h}층을 쌓아요. 한 칸으로 두 줄을 한꺼번에 맞춰요.`
      : forFront
        ? `「앞 ${h}층」 줄에서 ${h}층을 쌓을 수 있는 칸${onlyInCol ? "은 여기뿐이에요" : "을 하나 골라요"}. ${h}층을 써요.`
        : `「옆 ${h}층」 줄에서 ${h}층을 쌓을 수 있는 칸${onlyInRow ? "은 여기뿐이에요" : "을 하나 골라요"}. ${h}층을 써요.`;
    steps.push({ text, figure: map(work, { tone: "doing", mark: { cells: [[r, c]], cols: forFront ? [c] : [], rows: forSide ? [r] : [] } }) });
  }
  const minList = target.flat().filter((h) => h > 0);
  if (ask === "exact") {
    steps.push({ text: `다른 칸은 더 높일 수 없어요. 모두 더하면 ${plus(minList)} = ${sol.min}개예요.`, figure: map(target, { tone: "check" }) });
    return { id, title, problem: "위, 앞, 오른쪽 옆에서 본 모양이 다음과 같아요. 쌓기나무는 몇 개일까요?", figure: { kind: "cube-views", views }, steps, answer: `쌓기나무는 ${sol.min}개예요.`, value: { count: sol.min, unique: sol.min === sol.max && sol.count === 1 } };
  }
  steps.push({ text: `남은 칸은 가장 적게 1층. 모두 더하면 ${plus(minList)} = ${sol.min}개 — 가장 적을 때예요.`, figure: map(target, { tone: "check" }) });
  const maxMap = bounds.map((row, r) => row.map((h, c) => (views.top[r][c] ? h : 0)));
  steps.push({ text: "가장 많이 쌓으려면, 칸마다 「앞 ○층」과 「옆 ○층」 중 작은 수만큼 쌓아요.", figure: map(maxMap, { tone: "doing", mark: { cells: topCells } }) });
  const maxList = sol.maxMap.flat().filter((h) => h > 0);
  steps.push({ text: `모두 더하면 ${plus(maxList)} = ${sol.max}개 — 가장 많을 때예요. 앞과 옆 모양은 그대로예요.`, figure: map(sol.maxMap, { tone: "check" }) });
  return { id, title, problem: "위, 앞, 오른쪽 옆에서 본 모양이 다음과 같을 때, 쌓기나무가 가장 적을 때와 가장 많을 때는 몇 개일까요?", figure: { kind: "cube-views", views }, steps, answer: `가장 적을 때 ${sol.min}개, 가장 많을 때 ${sol.max}개예요.`, value: { min: sol.min, max: sol.max } };
}
const CUBE_SET = {
  id: "b9-cube-min-max",
  types: {
    "세 방향 모양으로 개수": () => [
      cubeExample({ id: "cube-exact-1", title: "예제 1", ask: "exact", heights: [[1, 3], [1, 1]] }),
      cubeExample({ id: "cube-exact-2", title: "예제 2", ask: "exact", heights: [[1, 2, 1], [0, 3, 1]] })
    ],
    "가장 적을 때와 많을 때": () => [
      cubeExample({ id: "cube-minmax-1", title: "예제 1", ask: "minmax", heights: [[2, 1], [1, 3]] }),
      cubeExample({ id: "cube-minmax-2", title: "예제 2", ask: "minmax", heights: [[3, 1, 0], [1, 2, 1], [0, 1, 1]] })
    ]
  }
};

// ───────────────────────── 9권 마방진 ─────────────────────────
const lineById = (n) => Object.fromEntries(magicLines(n).map((l) => [l.id, l]));
// 칸 그림: 보이는 수, 구할 칸(□·A·B), 빈칸. 단계마다 칠할 줄·칸을 정한다.
function magicFigure(n, values, labels, { lines = [], focus = [], found = [], shared = [], tone = "given" } = {}) {
  return {
    kind: "magic", n, tone, lines,
    cells: values.map((v, i) => ({
      v, label: labels[i] || "",
      state: shared.includes(i) ? "shared" : found.includes(i) ? "found" : focus.includes(i) ? "focus" : v === null ? (labels[i] ? "target" : "blank") : "given"
    }))
  };
}
// targets: { 칸 번호: "□" | "A" | "B" }. ask: cells(칸) · sum(한 줄의 합과 칸) · pair(A + B) · first(먼저 구할 칸).
function magicExample({ id, title, n = 3, full, show, targets, ask = "cells", problem }) {
  const S = isMagic(n, full);
  if (S === null) throw new Error(`${id}: 마방진이 아님`);
  const shown = full.map((v, i) => (show.includes(i) ? v : null));
  const labels = Object.fromEntries(Object.entries(targets).map(([k, v]) => [Number(k), v]));
  const targetCells = Object.keys(labels).map(Number);
  const names = Object.values(targets);
  const lines = lineById(n);
  const name = (lineId) => lines[lineId].name;
  const values = [...shown];
  const visible = (vals, extra = {}) => vals.map((v, i) => (v === null ? labels[i] || extra[i] || "" : ""));
  const steps = [{ text: `가로, 세로, 대각선 ${n === 3 ? "세" : "네"} 수의 합이 모두 같아요. 구할 칸은 ${names.join(", ")}예요.`, figure: magicFigure(n, values, visible(values), { focus: targetCells, tone: "given" }) }];
  if (ask === "pair") {
    // 마주 보는 A와 B: A + 가운데 + B = 한 줄의 합 = 가운데 수를 세 번 더한 수.
    const c = full[4], [a, b] = targetCells;
    const line = magicLines(3).find((l) => l.cells.includes(a) && l.cells.includes(b) && l.cells.includes(4));
    if (!line) throw new Error(`${id}: A와 B가 가운데를 사이에 두지 않음`);
    steps.push({ text: `${labels[a]}, 가운데 수, ${labels[b]}는 ${name(line.id)}에 함께 있어요.`, figure: magicFigure(n, values, visible(values), { lines: [line.id], focus: [4], tone: "doing" }) });
    steps.push({ text: `한 줄의 합은 가운데 수를 세 번 더한 수예요. ${c} + ${c} + ${c} = ${3 * c}.`, figure: magicFigure(n, values, visible(values), { lines: [line.id], focus: [4], tone: "doing" }) });
    steps.push({ text: `${labels[a]} + ${labels[b]} = ${3 * c} − ${c} = ${2 * c}. 가운데 수를 두 번 더한 것(${c} + ${c})과 같아요.`, figure: magicFigure(n, values, visible(values), { lines: [line.id], found: targetCells, tone: "check" }) });
    return { id, title, problem, figure: magicFigure(n, shown, visible(shown)), steps, answer: `${labels[a]} + ${labels[b]} = ${josa(2 * c, "이에요")}.`, value: { pair: 2 * c, sum: S } };
  }
  const solved = solveMagic(n, shown, { prefer: targetCells });
  if (!targetCells.every((i) => solved.values[i] === full[i])) throw new Error(`${id}: 풀이기가 구할 칸을 못 찾음`);
  const order = [];
  const label = (i) => labels[i] || "□";
  const centerName = (i) => (labels[i] ? `가운데 수 ${labels[i]}` : "가운데 수");
  for (const step of solved.steps) {
    if (step.kind === "sum-line") {
      steps.push({ text: `${josa(name(step.line), "은")} 수가 다 보여요. ${plus(step.cells.map((i) => values[i]))} = ${step.sum}. 한 줄의 합은 ${josa(step.sum, "이에요")}.`, figure: magicFigure(n, values, visible(values), { lines: [step.line], tone: "doing" }) });
    } else if (step.kind === "sum-center") {
      steps.push({ text: `가운데 수 ${josa(step.center, "을")} 세 번 더하면 한 줄의 합이에요. ${step.center} + ${step.center} + ${step.center} = ${step.sum}.`, figure: magicFigure(n, values, visible(values), { focus: [4], tone: "doing" }) });
    } else if (step.kind === "one-left") {
      values[step.cell] = step.value;
      steps.push({ text: `${josa(name(step.line), "은")} 빈칸이 하나 남았어요. ${label(step.cell)} = ${step.sum} − ${step.others.join(" − ")} = ${step.value}.`, figure: magicFigure(n, values, visible(values), { lines: [step.line], found: [step.cell], tone: "doing" }) });
      order.push(step.cell);
    } else if (step.kind === "center-sum") {
      values[step.cell] = step.value;
      steps.push({ text: `가운데 수를 세 번 더하면 ${josa(step.sum, "이에요")}. ${step.value} + ${step.value} + ${step.value} = ${step.sum}이니까 ${josa(centerName(step.cell), "은")} ${josa(step.value, "이에요")}.`, figure: magicFigure(n, values, visible(values), { found: [step.cell], tone: "doing" }) });
      order.push(step.cell);
    } else if (step.kind === "center-pair") {
      values[step.cell] = step.value;
      const [x, y] = step.others;
      steps.push({ text: `가운데를 사이에 둔 ${josa(x, "과")} ${josa(y, "을")} 더하면 ${x + y}. 가운데 수를 두 번 더한 것과 같아요. ${step.value} + ${step.value} = ${x + y}이니까 ${josa(centerName(step.cell), "은")} ${josa(step.value, "이에요")}.`, figure: magicFigure(n, values, visible(values), { focus: step.pair, found: [step.cell], tone: "doing" }) });
      order.push(step.cell);
    } else if (step.kind === "overlap") {
      const [a, b] = step.lines;
      const starOf = Object.fromEntries(step.shared.filter((i) => values[i] === null).map((i) => [i, "★"]));
      const hasStar = Object.keys(starOf).length > 0;
      steps.push({ text: `${josa(name(a), "과")} ${josa(name(b), "은")} ${hasStar ? "★ 칸" : "한 칸"}을 같이 써요. 두 줄의 합이 같으니, 같이 쓰는 칸을 빼면 나머지 수끼리 합이 같아요.`, figure: magicFigure(n, values, visible(values, starOf), { lines: [a, b], shared: step.shared, tone: "doing" }) });
      const known = step.with.map((i) => values[i]);
      const right = step.against.map((i) => values[i]);
      values[step.cell] = step.value;
      const solveText = known.length ? `${label(step.cell)} = ${step.otherSum} − ${known.join(" − ")} = ${step.value}` : `${label(step.cell)} = ${step.value}`;
      steps.push({ text: `${plus([...known, label(step.cell)])} = ${plus(right)} = ${step.otherSum}. 그래서 ${solveText}.`, figure: magicFigure(n, values, visible(values, starOf), { lines: [a, b], found: [step.cell], tone: "doing" }) });
      order.push(step.cell);
    }
    if (targetCells.every((i) => values[i] !== null)) break;
  }
  const answers = targetCells.map((i) => `${labels[i]} = ${full[i]}`).join(", ");
  let answer = answers, value = Object.fromEntries(targetCells.map((i) => [labels[i], full[i]]));
  if (ask === "sum") { answer = `한 줄의 합은 ${S}, ${answers}`; value = { ...value, sum: S }; }
  if (ask === "first") {
    const first = order.find((i) => targetCells.includes(i));
    answer = `먼저 구할 칸은 ${labels[first]}. ${answers}, 한 줄의 합은 ${S}`;
    value = { ...value, first: labels[first], sum: S };
  }
  steps.push({ text: `구한 수를 다른 줄에도 넣어 봐요. 어느 줄로 더해도 ${josa(S, "이에요")}.`, figure: magicFigure(n, full, [], { found: targetCells, tone: "check" }) });
  return { id, title, problem, figure: magicFigure(n, shown, visible(shown)), steps, answer: `${answer}.`, value, order: order.map((i) => labels[i] || i) };
}
const SQ_A = magicSquare3(7, 1, 3);    // 한 줄의 합 21
const SQ_B = magicSquare3(8, -2, 3);   // 한 줄의 합 24
const SQ_C = magicSquare3(9, 3, 1);    // 한 줄의 합 27
const SQ_D = magicSquare3(11, 2, -5);  // 한 줄의 합 33
const SQ_4A = magicSquare4(0, false, 0, false);
const SQ_4B = magicSquare4(0, false, 3, true);
const ASK = "가로, 세로, 대각선의 합이 모두 같은 마방진이에요.";
const SQ_E = magicSquare3(6, 1, 3);    // 한 줄의 합 18 (3권)
const SQ_F = magicSquare3(12, 1, 4);   // 한 줄의 합 36 (3권)
const MAGIC_SET = {
  id: "b9-magic",
  types: {
    "한 줄의 합과 빈칸": () => [
      magicExample({ id: "magic-sum-1", title: "예제 1", full: SQ_A, show: [1, 3, 4, 5], targets: { 7: "□" }, ask: "sum", problem: `${ASK} 한 줄의 합과 □에 들어갈 수를 구해요.` }),
      magicExample({ id: "magic-sum-2", title: "예제 2", full: SQ_B, show: [1, 2, 5, 8], targets: { 0: "□" }, ask: "sum", problem: `${ASK} 한 줄의 합과 □에 들어갈 수를 구해요.` })
    ],
    "가운데 수로 빈칸": () => [
      magicExample({ id: "magic-center-1", title: "예제 1", full: SQ_C, show: [0, 3, 6], targets: { 4: "□" }, problem: `${ASK} 가운데 □에 들어갈 수를 구해요.` }),
      magicExample({ id: "magic-center-2", title: "예제 2", full: SQ_A, show: [2, 6], targets: { 4: "□" }, problem: `${ASK} 가운데 □에 들어갈 수를 구해요.` })
    ],
    "가운데 수로 A + B": () => [
      magicExample({ id: "magic-pair-1", title: "예제 1", full: SQ_D, show: [4], targets: { 3: "A", 5: "B" }, ask: "pair", problem: `${ASK} A + B를 구해요.` }),
      magicExample({ id: "magic-pair-2", title: "예제 2", full: SQ_A, show: [4], targets: { 2: "A", 6: "B" }, ask: "pair", problem: `${ASK} A + B를 구해요.` })
    ],
    "겹치는 칸으로 빈칸": () => [
      magicExample({ id: "magic-overlap-1", title: "예제 1", full: SQ_A, show: [1, 3, 6], targets: { 2: "A" }, problem: `${ASK} A에 들어갈 수를 구해요.` }),
      magicExample({ id: "magic-overlap-2", title: "예제 2", full: SQ_B, show: [5, 6, 8], targets: { 4: "A" }, problem: `${ASK} A에 들어갈 수를 구해요.` })
    ],
    "먼저 구할 칸 찾기": () => [
      magicExample({ id: "magic-first-1", title: "예제 1", full: SQ_C, show: [1, 5, 7, 8], targets: { 2: "A", 4: "B" }, ask: "first", problem: `${ASK} A와 B 중 먼저 구할 수 있는 칸을 찾고, A와 B와 한 줄의 합을 구해요.` }),
      magicExample({ id: "magic-first-2", title: "예제 2", full: SQ_A, show: [2, 3, 5, 6, 8], targets: { 0: "A", 1: "B" }, ask: "first", problem: `${ASK} A와 B 중 먼저 구할 수 있는 칸을 찾고, A와 B와 한 줄의 합을 구해요.` })
    ],
    // 3권 같은 줄의 합으로 빈칸
    "3×3 마방진의 한 줄 합과 빈칸": () => [
      magicExample({ id: "magic3-sum-1", title: "예제 1", full: SQ_E, show: [0, 1, 2, 4], targets: { 8: "△" }, ask: "sum", problem: `${ASK} 한 줄의 합과 △에 들어갈 수를 구해요.` }),
      magicExample({ id: "magic3-sum-2", title: "예제 2", full: SQ_F, show: [3, 4, 5, 6], targets: { 2: "△" }, ask: "sum", problem: `${ASK} 한 줄의 합과 △에 들어갈 수를 구해요.` })
    ],
    "겹치는 세 줄로 도형의 수 찾기": () => [magicExample({ id: "magic3-overlap-1", title: "예제 1", full: SQ_F, show: [1, 3, 6], targets: { 2: "△" }, problem: `${ASK} △에 들어갈 수를 구해요.` })],
    "겹치는 세 줄로 두 도형의 합 찾기": () => [magicExample({ id: "magic3-pair-1", title: "예제 1", full: SQ_E, show: [4], targets: { 1: "A", 7: "B" }, ask: "pair", problem: `${ASK} A + B를 구해요.` })],
    "4×4 표시 줄의 도형값 찾기": () => [magicExample({ id: "magic3-big-1", title: "예제 1", n: 4, full: SQ_4B, show: [0, 1, 3, 6, 14], targets: { 10: "△" }, problem: `${ASK} △에 들어갈 수를 구해요.` })],
    "여러 줄의 공통 합으로 가운데 수 찾기": () => [magicExample({ id: "magic3-big-2", title: "예제 1", n: 4, full: SQ_4A, show: [0, 2, 3, 5, 13], targets: { 9: "△" }, problem: `${ASK} △에 들어갈 수를 구해요.` })],
    "4×4 표시 줄의 여러 도형값 찾기": () => [magicExample({ id: "magic3-big-3", title: "예제 1", n: 4, full: SQ_4A, show: [0, 1, 9, 13, 15], targets: { 10: "◇" }, problem: `${ASK} ◇에 들어갈 수를 구해요.` })],
    "큰 마방진의 겹치는 칸": () => [
      magicExample({ id: "magic-big-1", title: "예제 1", n: 4, full: SQ_4A, show: [2, 6, 8, 11, 14], targets: { 9: "A" }, problem: `${ASK} A에 들어갈 수를 구해요.` }),
      magicExample({ id: "magic-big-2", title: "예제 2", n: 4, full: SQ_4B, show: [0, 4, 7, 10, 15], targets: { 6: "A" }, problem: `${ASK} A에 들어갈 수를 구해요.` })
    ]
  }
};

// ───────────────────────── 1권 시계 바늘 돌리기 ─────────────────────────
// 원본 문항에는 유형 이름이 없어 문장으로 나눈다(시계 방향 / 시계 반대 방향).
const TURN_NAMES = { 1: "반의 반 바퀴", 2: "반 바퀴", 4: "한 바퀴" };
const TURN_HOW = { 1: "반의 반 바퀴는 숫자 3칸만큼 가요.", 2: "반 바퀴는 숫자 6칸만큼, 맞은편까지 가요.", 4: "한 바퀴는 숫자 12칸, 처음 자리로 돌아와요." };
const land = (start, quarters) => ((start - 1 + quarters * 3) % 12 + 12) % 12 + 1;
function clockExample({ id, title, start, quarters }) {
  const dir = quarters > 0 ? "시계 방향" : "시계 반대 방향";
  const amount = TURN_NAMES[Math.abs(quarters)];
  const end = land(start, quarters);
  const path = Array.from({ length: Math.abs(quarters) * 3 + 1 }, (_, k) => land(start, Math.sign(quarters) * k / 3));
  const steps = [
    { text: `바늘은 ${josa(start, "을")} 가리키며 출발해요.`, figure: { kind: "clock", start, quarters: 0 } },
    { text: `${TURN_HOW[Math.abs(quarters)]} ${quarters > 0 ? "시계 방향은 1, 2, 3 쪽으로 세어요." : "시계 반대 방향은 12, 11, 10 쪽으로 거꾸로 세어요."}`, figure: { kind: "clock", start, quarters, ghost: true } },
    { text: `${path.join(" → ")}. 한 칸씩 세어 가요.`, figure: { kind: "clock", start, quarters, path } },
    { text: `바늘은 ${josa(end, "을")} 가리켜요.`, figure: { kind: "clock", start, quarters, path, end: true } }
  ];
  return { id, title, problem: `바늘이 ${josa(start, "을")} 가리키고 있어요. ${dir}으로 ${amount} 돌리면 어떤 수를 가리킬까요?`, figure: { kind: "clock", start, quarters: 0 }, steps, answer: `${josa(end, "을")} 가리켜요.`, value: { start, quarters, end } };
}
const CLOCK_SET = {
  id: "b1-clock",
  typeOf: (item) => (/반대 방향/u.test(item.prompt) ? "시계 반대 방향으로 돌리기" : "시계 방향으로 돌리기"),
  types: {
    "시계 방향으로 돌리기": () => [clockExample({ id: "clock-cw-1", title: "예제 1", start: 2, quarters: 1 }), clockExample({ id: "clock-cw-2", title: "예제 2", start: 10, quarters: 2 })],
    "시계 반대 방향으로 돌리기": () => [clockExample({ id: "clock-ccw-1", title: "예제 1", start: 7, quarters: -1 }), clockExample({ id: "clock-ccw-2", title: "예제 2", start: 1, quarters: -2 })]
  }
};

// ───────────────────────── 2권 양팔저울 ─────────────────────────
// 원본은 A·B·C와 ●▲■를 쓴다. 예제는 과일 이름과 ◆★ 같은 다른 물건·다른 개수로 새로 짓는다.
// 무게 순서는 코드가 저울에서 다시 이어 구한다. 같은 무게 저울은 바꾸어 넣기로 g를 구한다.
const SHAPE_NAME = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
const tokenName = (t) => SHAPE_NAME[t] || t;
export function weightOrder(items, scales) {
  const reach = new Map(items.map((a) => [a, new Set()]));
  for (const s of scales) {
    const [h, l] = s.heavy === "left" ? [s.left[0], s.right[0]] : [s.right[0], s.left[0]];
    reach.get(h).add(l);
  }
  for (const k of items) for (const i of items) if (reach.get(i).has(k)) for (const j of reach.get(k)) reach.get(i).add(j);
  const order = [...items].sort((a, b) => reach.get(b).size - reach.get(a).size);
  const total = order.every((x, i) => i + 1 >= order.length || reach.get(x).has(order[i + 1]));
  return { reach, order, total };
}
function relationText(s) {
  const [heavy, light] = s.heavy === "left" ? [s.left[0], s.right[0]] : [s.right[0], s.left[0]];
  return `${tokenName(heavy)} 쪽이 내려갔어요. ${josa(tokenName(heavy), "이")} ${tokenName(light)}보다 무거워요.`;
}
function balanceOrderExample({ id, title, items, scales, ask, of, problem }) {
  const { reach, order, total } = weightOrder(items, scales);
  if (!total) throw new Error(`${id}: 순서가 하나로 정해지지 않음`);
  const steps = scales.map((s, k) => ({ text: `${k + 1}번 저울: ${relationText(s)}`, figure: { kind: "balance", scales, focus: [k] } }));
  steps.push({ text: `이어 보면 ${order.map(tokenName).join(" > ")} 순서예요. 왼쪽일수록 무거워요.`, figure: { kind: "balance", scales, chain: order } });
  let answer, value;
  if (ask === "lighter") {
    value = order.filter((x) => reach.get(of).has(x));
    answer = `${tokenName(of)}보다 가벼운 것은 ${josa(value.map(tokenName).join(", "), "이에요")}`;
    steps.push({ text: `${tokenName(of)}보다 오른쪽에 있는 것이 더 가벼워요.`, figure: { kind: "balance", scales, chain: order, mark: value } });
  } else if (ask === "lightest") {
    value = order.at(-1);
    answer = `가장 가벼운 것은 ${josa(tokenName(value), "이에요")}`;
    steps.push({ text: "맨 오른쪽이 가장 가벼워요.", figure: { kind: "balance", scales, chain: order, mark: [value] } });
  } else {
    value = order;
    answer = `무거운 순서는 ${order.slice(0, -1).map(tokenName).join(" > ")} > ${josa(tokenName(order.at(-1)), "이에요")}`;
  }
  return { id, title, problem, figure: { kind: "balance", scales }, steps, answer: `${answer}.`, value };
}
// 두 저울: X 하나 > Y 두 개 → X > Y. X + Y < Z → Z > X > Y.
function balanceTwoExample({ id, title, x, y, z, ask, problem }) {
  const scales = [{ left: [x], right: [y, y], heavy: "left" }, { left: [x, y], right: [z], heavy: "right" }];
  const order = [z, x, y];
  const N = tokenName;
  const steps = [
    { text: `1번 저울: ${N(x)} 하나가 ${N(y)} 두 개보다 무거워요. 그러니 ${josa(N(x), "이")} ${N(y)} 하나보다 무거워요.`, figure: { kind: "balance", scales, focus: [0] } },
    { text: `2번 저울: ${josa(N(z), "이")} ${josa(N(x), "과")} ${josa(N(y), "을")} 합친 것보다 무거워요. 그러니 ${josa(N(z), "이")} ${N(x)}보다도, ${N(y)}보다도 무거워요.`, figure: { kind: "balance", scales, focus: [1] } },
    { text: `무거운 순서는 ${order.slice(0, -1).map(N).join(" > ")} > ${josa(N(order.at(-1)), "이에요")}.`, figure: { kind: "balance", scales, chain: order } }
  ];
  let answer, value;
  if (ask === "heavier") { value = [z, x]; answer = `${N(y)}보다 무거운 것은 ${N(z)}, ${josa(N(x), "이에요")}`; steps.push({ text: `${N(y)}보다 왼쪽에 있는 것이 더 무거워요.`, figure: { kind: "balance", scales, chain: order, mark: value } }); }
  else if (ask === "heaviest") { value = z; answer = `가장 무거운 것은 ${josa(N(z), "이에요")}`; steps.push({ text: "맨 왼쪽이 가장 무거워요.", figure: { kind: "balance", scales, chain: order, mark: [z] } }); }
  else { value = order; answer = `무거운 순서는 ${order.slice(0, -1).map(N).join(" > ")} > ${josa(N(order.at(-1)), "이에요")}`; }
  return { id, title, problem, figure: { kind: "balance", scales }, steps, answer: `${answer}.`, value };
}
// 개수가 다른 같은 모양끼리: 적은 개수 쪽이 내려가면 하나하나가 더 무겁다.
function balanceCountExample({ id, title, heavyShape, heavyCount, lightShape, lightCount, problem }) {
  if (heavyCount > lightCount) throw new Error(`${id}: 많은 쪽이 내려가면 하나하나를 비교할 수 없음`);
  const scales = [{ left: Array(heavyCount).fill(heavyShape), right: Array(lightCount).fill(lightShape), heavy: "left" }];
  const H = tokenName(heavyShape), L = tokenName(lightShape);
  const steps = [
    { text: `${H} ${heavyCount}개 쪽이 내려갔어요. ${H} ${heavyCount}개가 ${L} ${lightCount}개보다 무거워요.`, figure: { kind: "balance", scales, focus: [0] } },
    { text: `개수가 ${heavyCount === lightCount ? "같은데" : "더 적은데도"} 더 무거우니, ${H} 하나가 ${L} 하나보다 무거워요.`, figure: { kind: "balance", scales, chain: [heavyShape, lightShape], mark: [heavyShape] } }
  ];
  return { id, title, problem, figure: { kind: "balance", scales }, steps, answer: `${josa(H, "이")} 더 무거워요.`, value: heavyShape };
}
// 같은 무게 저울: 알고 있는 무게를 차례로 바꾸어 넣는다. chain: [{ one: X, many: [...] }] — X 하나 = 오른쪽 전부.
function balanceWeightExample({ id, title, chain, known, ask, problem }) {
  const weights = { ...known };
  const scales = chain.map((link) => ({ left: [link.one], right: link.many, heavy: "equal" }));
  const steps = [{ text: `저울이 평평하면 양쪽 무게가 같아요. ${Object.entries(known).map(([k, v]) => `${tokenName(k)} 하나는 ${v}g`).join(", ")}이에요.`, figure: { kind: "balance", scales, weights: { ...weights } } }];
  chain.forEach((link, k) => {
    const parts = link.many.map((t) => weights[t]);
    if (parts.some((v) => v === undefined)) throw new Error(`${id}: 바꾸어 넣을 무게가 없음`);
    weights[link.one] = sum(parts);
    steps.push({ text: `${k + 1}번 저울: ${tokenName(link.one)} 하나 = ${link.many.map(tokenName).join(" + ")} = ${parts.map((v) => `${v}g`).join(" + ")} = ${weights[link.one]}g.`, figure: { kind: "balance", scales, focus: [k], weights: { ...weights } } });
  });
  return { id, title, problem, figure: { kind: "balance", scales, weights: { ...known } }, steps, answer: `${tokenName(ask)} 하나는 ${weights[ask]}g이에요.`, value: weights[ask] };
}
const BALANCE_SET = {
  id: "b2-balance",
  types: {
    "세 저울 관계로 가벼운 것 찾기": () => [
      balanceOrderExample({ id: "bal-lighter-1", title: "예제 1", items: ["사과", "배", "감"], ask: "lighter", of: "사과", problem: "저울 세 개를 보고, 사과보다 가벼운 것을 모두 찾아요.",
        scales: [{ left: ["배"], right: ["사과"], heavy: "right" }, { left: ["감"], right: ["배"], heavy: "right" }, { left: ["사과"], right: ["감"], heavy: "left" }] })
    ],
    "세 저울 관계로 가장 가벼운 것 찾기": () => [
      balanceOrderExample({ id: "bal-lightest-1", title: "예제 1", items: ["귤", "자두", "키위"], ask: "lightest", problem: "저울 세 개를 보고, 가장 가벼운 것을 찾아요.",
        scales: [{ left: ["자두"], right: ["귤"], heavy: "left" }, { left: ["키위"], right: ["자두"], heavy: "right" }, { left: ["키위"], right: ["귤"], heavy: "left" }] })
    ],
    "세 저울 관계를 무게순으로 잇기": () => [
      balanceOrderExample({ id: "bal-order-1", title: "예제 1", items: ["배", "감", "사과"], ask: "order", problem: "저울 세 개를 보고, 무거운 것부터 차례로 늘어놓아요.",
        scales: [{ left: ["감"], right: ["사과"], heavy: "left" }, { left: ["배"], right: ["감"], heavy: "left" }, { left: ["배"], right: ["사과"], heavy: "left" }] })
    ],
    "여러 개 도형의 무게 비교": () => [
      balanceCountExample({ id: "bal-count-1", title: "예제 1", heavyShape: "diamond", heavyCount: 2, lightShape: "star", lightCount: 3, problem: "마름모 2개와 별 3개를 저울에 올렸어요. 마름모와 별 중 하나가 더 무거운 것은 무엇일까요?" }),
      balanceCountExample({ id: "bal-count-2", title: "예제 2", heavyShape: "star", heavyCount: 1, lightShape: "circle", lightCount: 2, problem: "별 1개와 동그라미 2개를 저울에 올렸어요. 별과 동그라미 중 하나가 더 무거운 것은 무엇일까요?" })
    ],
    "두 저울 관계로 더 무거운 것 모두 찾기": () => [
      balanceTwoExample({ id: "bal-two-heavier-1", title: "예제 1", x: "triangle", y: "diamond", z: "star", ask: "heavier", problem: "저울 두 개를 보고, 마름모보다 무거운 도형을 모두 찾아요." })
    ],
    "두 저울 관계로 가장 무거운 것 찾기": () => [
      balanceTwoExample({ id: "bal-two-heaviest-1", title: "예제 1", x: "square", y: "star", z: "diamond", ask: "heaviest", problem: "저울 두 개를 보고, 가장 무거운 도형을 찾아요." })
    ],
    "두 저울 관계를 무게순으로 잇기": () => [
      balanceTwoExample({ id: "bal-two-order-1", title: "예제 1", x: "circle", y: "diamond", z: "star", ask: "order", problem: "저울 두 개를 보고, 무거운 도형부터 차례로 늘어놓아요." })
    ],
    "저울의 같은 무게를 바꾸어 넣기": () => [
      balanceWeightExample({ id: "bal-weight-1", title: "예제 1", known: { star: 2 }, chain: [{ one: "diamond", many: ["star", "star", "star"] }], ask: "diamond", problem: "마름모 1개와 별 3개의 무게가 같아요. 별이 2g일 때 마름모 한 개는 몇 g일까요?" }),
      balanceWeightExample({ id: "bal-weight-2", title: "예제 2", known: { star: 3 }, chain: [{ one: "diamond", many: ["star", "star"] }, { one: "circle", many: ["diamond", "star"] }], ask: "circle", problem: "마름모 1개는 별 2개와, 동그라미 1개는 마름모 1개와 별 1개를 합친 것과 무게가 같아요. 별이 3g일 때 동그라미 한 개는 몇 g일까요?" })
    ]
  }
};

// ───────────────────────── 2권 2·3·4·5의 배수 · 3권 6의 배수: 묶음으로 식 바꾸기 ─────────────────────────
// 원본은 「2+4+4=2×?」·「3×7=3+3+3+3+?」·「5×28=10×?」처럼 세 가지 움직임이다: 묶어서 계산하기 · 빠진 수 · 묶음 크기 바꾸기.
// 예제는 다른 수로 새로 짓고, 묶음 수와 답은 아래 코드가 계산한다. 그림은 줄마다 식 한 줄(figureMarkup kind "bundle").
// 항: 수 { v } 또는 이미 곱셈인 { mul: 묶음 수 }, 둘째 항부터 op "+"/"−".
const bundleGroups = (base, t) => (t.mul !== undefined ? t.mul : t.v / base);
const bundleTerm = (base, t) => (t.mul !== undefined ? `${base}×${t.mul}` : String(t.v));
const rowText = (row) => row.items.map((it) => (typeof it === "string" ? it : it.v)).join(" ").replace(/× /gu, "×");
function bundleSumExample({ id, title, base, terms }) {
  for (const t of terms) if (t.mul === undefined && t.v % base) throw new Error(`${id}: ${t.v}는 ${base}의 묶음이 아님`);
  const gs = terms.map((t) => bundleGroups(base, t));
  const total = gs.reduce((s, g, i) => (i && terms[i].op === "−" ? s - g : s + g), 0);
  const line = (tone, sub) => ({ tone, items: [...terms.flatMap((t, i) => [...(i ? [t.op] : []), { v: bundleTerm(base, t), sub: sub ? `${base}×${gs[i]}` : undefined, on: sub }]), "=", `${base}×`, { v: "□", blank: true }] });
  const start = line("given", false);
  const say = terms.map((t, i) => (t.mul !== undefined ? `${josa(bundleTerm(base, t), "은")} 이미 ${josa(base, "이")} ${gs[i]}묶음` : `${josa(t.v, "은")} ${base}×${gs[i]}`));
  const groupsExpr = gs.map((g, i) => `${i ? ` ${terms[i].op} ` : ""}${g}`).join("");
  const steps = [
    { text: `수마다 ${josa(base, "이")} 몇 묶음인지 써요. ${josa(say.join(", "), "이에요")}.`, figure: { kind: "bundle", rows: [line("doing", true)] } },
    { text: `묶음 수끼리 계산해요. ${groupsExpr} = ${total}묶음이에요.`, figure: { kind: "bundle", rows: [line("given", true), { tone: "doing", items: ["=", { v: `${base}×${total}`, on: true }] }] } },
    { text: `${base}×□ = ${base}×${total}이니까 □는 ${josa(total, "이에요")}.`, figure: { kind: "bundle", rows: [line("given", true), { tone: "check", items: ["=", { v: `${base}×${total}`, on: true }] }] } }
  ];
  return { id, title, problem: `${rowText(start)}에서 □에 알맞은 수를 구해요.`, figure: { kind: "bundle", rows: [start] }, steps, answer: `□는 ${josa(total, "이에요")}.`, value: total };
}
// 빠진 수: base×whole = 수 + 수 + □
function bundleMissingExample({ id, title, base, whole, terms }) {
  const gs = terms.map((v) => { if (v % base) throw new Error(`${id}: ${v}는 ${base}의 묶음이 아님`); return v / base; });
  const left = whole - sum(gs);
  if (left <= 0) throw new Error(`${id}: 빠진 묶음이 없음`);
  const row = (tone, sub, blank = { v: "□", blank: true }) => ({ tone, items: [{ v: `${base}×${whole}` }, "=", ...terms.flatMap((v, i) => [...(i ? ["+"] : []), { v: String(v), sub: sub ? `${base}×${gs[i]}` : undefined, on: sub }]), "+", blank] });
  const start = row("given", false);
  const steps = [
    { text: `${base}×${josa(whole, "은")} ${josa(base, "이")} ${whole}묶음이에요. 오른쪽 수도 묶음으로 바꾸면 ${terms.map((v, i) => `${josa(v, "은")} ${gs[i]}묶음`).join(", ")}이에요.`, figure: { kind: "bundle", rows: [row("doing", true)] } },
    { text: `□는 남은 묶음이에요. ${whole} − ${gs.join(" − ")} = ${left}묶음이에요.`, figure: { kind: "bundle", rows: [row("doing", true, { v: "□", blank: true, sub: `${base}×${left}`, on: true })] } },
    { text: `${base}×${left} = ${base * left}이니까 □는 ${josa(base * left, "이에요")}.`, figure: { kind: "bundle", rows: [row("check", true, { v: String(base * left), sub: `${base}×${left}`, on: true })] } }
  ];
  return { id, title, problem: `${rowText(start)}에서 □에 알맞은 수를 구해요.`, figure: { kind: "bundle", rows: [start] }, steps, answer: `□는 ${josa(base * left, "이에요")}.`, value: base * left };
}
// 묶음 크기 바꾸기: from이 count개(repeat면 덧셈으로 늘어놓음) = to×□. to가 from의 몇 배이거나, from이 to의 몇 배.
function bundleResizeExample({ id, title, from, count, to, repeat = false }) {
  const up = to > from, k = up ? to / from : from / to;
  if (!Number.isInteger(k) || (up && count % k)) throw new Error(`${id}: 묶음을 고르게 바꿀 수 없음`);
  const q = up ? count / k : count * k;
  const lhs = repeat ? Array.from({ length: count }, (_, i) => [...(i ? ["+"] : []), { v: String(from) }]).flat() : [{ v: `${from}×${count}` }];
  const row = (tone, blank) => ({ tone, items: [...lhs, "=", `${to}×`, blank] });
  const start = row("given", { v: "□", blank: true });
  const have = repeat ? `${josa(from, "을")} ${count}번 더했으니 ${josa(from, "이")} ${count}개예요.` : `${from}×${josa(count, "은")} ${josa(from, "이")} ${count}개예요.`;
  const steps = up
    ? [
      { text: `${josa(to, "은")} ${josa(from, "이")} ${k}개 모인 수예요. ${have}`, figure: { kind: "bundle", rows: [row("doing", { v: "□", blank: true, sub: `${from} ${k}개`, on: true })] } },
      { text: `${josa(from, "을")} ${k}개씩 묶으면 ${to} 묶음이 ${count / k}개 생겨요.`, figure: { kind: "bundle", rows: [row("doing", { v: "□", blank: true, sub: `${count}개를 ${k}개씩`, on: true })] } },
      { text: `${to}×${q} = ${from * count}이니까 □는 ${josa(q, "이에요")}.`, figure: { kind: "bundle", rows: [row("check", { v: String(q), on: true })] } }
    ]
    : [
      { text: `${josa(from, "은")} ${josa(to, "이")} ${k}개 모인 수예요. ${have}`, figure: { kind: "bundle", rows: [row("doing", { v: "□", blank: true, sub: `${from} 하나 = ${to} ${k}개`, on: true })] } },
      { text: `${from} 하나마다 ${josa(to, "이")} ${k}개씩이니 ${josa(to, "은")} ${Array(k).fill(count).join(" + ")} = ${q}개예요.`, figure: { kind: "bundle", rows: [row("doing", { v: "□", blank: true, sub: `${to} ${q}개`, on: true })] } },
      { text: `${to}×${q} = ${from * count}이니까 □는 ${josa(q, "이에요")}.`, figure: { kind: "bundle", rows: [row("check", { v: String(q), on: true })] } }
    ];
  return { id, title, problem: `${rowText(start)}에서 □에 알맞은 수를 구해요.`, figure: { kind: "bundle", rows: [start] }, steps, answer: `□는 ${josa(q, "이에요")}.`, value: q };
}
const BUNDLE_SET = {
  id: "bundle-equations",
  types: {
    "2의 배수로 식 바꾸기": () => [
      bundleSumExample({ id: "bundle2-sum", title: "예제 1", base: 2, terms: [{ v: 6 }, { op: "+", v: 4 }, { op: "+", v: 10 }] }),
      bundleSumExample({ id: "bundle2-mixed", title: "예제 2", base: 2, terms: [{ mul: 13 }, { op: "+", v: 20 }, { op: "−", v: 6 }] })
    ],
    "3의 배수로 식 바꾸기": () => [
      bundleSumExample({ id: "bundle3-sum", title: "예제 1", base: 3, terms: [{ v: 9 }, { op: "+", v: 12 }, { op: "+", v: 30 }] }),
      bundleMissingExample({ id: "bundle3-missing", title: "예제 2", base: 3, whole: 8, terms: [3, 6] })
    ],
    "4의 배수로 식 바꾸기": () => [
      bundleSumExample({ id: "bundle4-sum", title: "예제 1", base: 4, terms: [{ v: 40 }, { op: "+", v: 8 }, { op: "−", v: 4 }] }),
      bundleResizeExample({ id: "bundle4-resize", title: "예제 2", from: 2, count: 8, to: 4, repeat: true })
    ],
    "5의 배수로 식 바꾸기": () => [
      bundleSumExample({ id: "bundle5-mixed", title: "예제 1", base: 5, terms: [{ mul: 12 }, { op: "+", v: 10 }, { op: "−", v: 5 }] }),
      bundleResizeExample({ id: "bundle5-resize", title: "예제 2", from: 5, count: 18, to: 10 })
    ],
    "6의 배수 등가식": () => [
      bundleSumExample({ id: "bundle6-mixed", title: "예제 1", base: 6, terms: [{ mul: 15 }, { op: "+", v: 12 }, { op: "+", v: 6 }] }),
      bundleResizeExample({ id: "bundle6-resize", title: "예제 2", from: 12, count: 5, to: 6 })
    ]
  }
};

// ───────────────────────── 6권·10권 연속수: 수의 개수 · 짝지어 더하기 · 가운데 수 · 몇 번째 짝수/홀수 ─────────────────────────
// 그림(kind "consec"): from~to 수 줄(길면 앞 셋 … 뒤 셋), pairs면 양 끝부터 짝 고리, middle이면 가운데 칸, order면 짝수·홀수 줄과 번째.
const consecRange = (from, to) => (to - from + 1 > 8 ? `${from} + ${from + 1} + ${from + 2} + … + ${to - 2} + ${to - 1} + ${to}` : Array.from({ length: to - from + 1 }, (_, i) => from + i).join(" + "));
function countExample({ id, title, from, to, problem = `${from}부터 ${to}까지의 수는 모두 몇 개일까요?` }) {
  const n = to - from + 1;
  const steps = [
    { text: `${to} − ${from} = ${josa(to - from, "은")} ${josa(from, "을")} 빼고 센 개수예요.`, figure: { kind: "consec", from, to, mode: "count", tone: "doing", skipFirst: true } },
    { text: `처음 수 ${from}도 넣어야 하니 1을 더해요. ${to - from} + 1 = ${n}개예요.`, figure: { kind: "consec", from, to, mode: "count", tone: "check" } }
  ];
  return { id, title, problem, figure: { kind: "consec", from, to, mode: "count" }, steps, answer: `${from}부터 ${to}까지는 ${n}개예요.`, value: n };
}
function pairSumExample({ id, title, from, to }) {
  const n = to - from + 1;
  if (n % 2) throw new Error(`${id}: 짝수 개가 아님`);
  const s = from + to, p = n / 2;
  const steps = [
    { text: `수는 ${to} − ${from} + 1 = ${n}개예요.`, figure: { kind: "consec", from, to, mode: "count", tone: "given" } },
    { text: `양 끝부터 짝을 지어요. ${from} + ${to} = ${s}, ${from + 1} + ${to - 1} = ${s}. 짝마다 합이 ${josa(s, "이에요")}.`, figure: { kind: "consec", from, to, mode: "pairs", tone: "doing" } },
    { text: `${n}개를 둘씩 짝지으면 ${p}짝이에요.`, figure: { kind: "consec", from, to, mode: "pairs", tone: "doing", note: `${p}짝` } },
    { text: `합이 ${s}인 짝이 ${p}개니까 ${s} × ${p} = ${josa(s * p, "이에요")}.`, figure: { kind: "consec", from, to, mode: "pairs", tone: "check", note: `${s} × ${p}` } }
  ];
  return { id, title, problem: `${consecRange(from, to)}의 합을 구해요.`, figure: { kind: "consec", from, to, mode: "plain" }, steps, answer: `합은 ${josa(s * p, "이에요")}.`, value: s * p };
}
function middleSumExample({ id, title, from, to, askMiddle = false }) {
  const n = to - from + 1;
  if (n % 2 === 0) throw new Error(`${id}: 홀수 개가 아님`);
  const m = (from + to) / 2;
  const steps = [
    { text: `수는 ${to} − ${from} + 1 = ${n}개예요. 홀수 개라 한가운데 수가 하나 있어요.`, figure: { kind: "consec", from, to, mode: "count", tone: "given" } },
    { text: `가운데 수는 양 끝의 한가운데, (${from} + ${to}) ÷ 2 = ${josa(m, "이에요")}.`, figure: { kind: "consec", from, to, mode: "middle", tone: "doing" } },
    { text: `${m - 1} + ${m + 1} = ${m} + ${m}처럼, 가운데에서 같은 만큼 떨어진 두 수는 가운데 수 두 개와 같아요.`, figure: { kind: "consec", from, to, mode: "middle-pairs", tone: "doing" } },
    { text: `${josa(m, "을")} ${n}번 더한 것과 같으니 ${m} × ${n} = ${josa(m * n, "이에요")}.`, figure: { kind: "consec", from, to, mode: "middle", tone: "check", note: `${m} × ${n}` } }
  ];
  return {
    id, title,
    problem: askMiddle ? `${consecRange(from, to)}에서 가운데 수를 찾고, 합을 구해요.` : `${consecRange(from, to)}의 합을 구해요.`,
    figure: { kind: "consec", from, to, mode: "plain" }, steps,
    answer: askMiddle ? `가운데 수는 ${m}, 합은 ${josa(m * n, "이에요")}.` : `합은 ${josa(m * n, "이에요")}.`,
    value: askMiddle ? { middle: m, sum: m * n } : m * n
  };
}
// 몇 번째 짝수·홀수: odd면 1, 3, 5…. ask "value"면 k번째 수, "order"면 그 수가 몇 번째인지.
function orderExample({ id, title, odd, ask, k }) {
  const name = odd ? "홀수" : "짝수", v = odd ? 2 * k - 1 : 2 * k;
  const first = odd ? "1, 3, 5, 7" : "2, 4, 6, 8";
  const steps = ask === "value"
    ? [
      { text: `${name}를 차례로 써요: ${first}, …. 1번째 ${odd ? 1 : 2}, 2번째 ${odd ? 3 : 4}, 3번째 ${josa(odd ? 5 : 6, "이에요")}.`, figure: { kind: "consec", mode: "order", odd, tone: "given" } },
      { text: odd ? "번째에 2를 곱한 수보다 1 작아요. 3번째는 3 × 2 − 1 = 5예요." : "번째에 2를 곱하면 돼요. 3번째는 3 × 2 = 6이에요.", figure: { kind: "consec", mode: "order", odd, tone: "doing" } },
      { text: odd ? `${k}번째는 ${k} × 2 − 1 = ${josa(v, "이에요")}.` : `${k}번째는 ${k} × 2 = ${josa(v, "이에요")}.`, figure: { kind: "consec", mode: "order", odd, tone: "check", k, v } }
    ]
    : [
      { text: `${name}를 차례로 써요: ${first}, …. 1번째 ${odd ? 1 : 2}, 2번째 ${odd ? 3 : 4}, 3번째 ${josa(odd ? 5 : 6, "이에요")}.`, figure: { kind: "consec", mode: "order", odd, tone: "given" } },
      { text: odd ? "거꾸로 가요. 1을 더한 뒤 2로 나누면 몇 번째인지 나와요. 5는 (5 + 1) ÷ 2 = 3번째예요." : "거꾸로 가요. 2로 나누면 몇 번째인지 나와요. 6은 6 ÷ 2 = 3번째예요.", figure: { kind: "consec", mode: "order", odd, tone: "doing" } },
      { text: odd ? `${josa(v, "은")} (${v} + 1) ÷ 2 = ${k}번째예요.` : `${josa(v, "은")} ${v} ÷ 2 = ${k}번째예요.`, figure: { kind: "consec", mode: "order", odd, tone: "check", k, v } }
    ];
  return {
    id, title,
    problem: ask === "value" ? `${name}를 작은 것부터 늘어놓을 때 ${k}번째 ${josa(name, "은")} 무엇일까요?` : `${josa(v, "은")} 몇 번째 ${name}일까요?`,
    figure: { kind: "consec", mode: "order", odd, tone: "given" }, steps,
    answer: ask === "value" ? `${k}번째 ${josa(name, "은")} ${josa(v, "이에요")}.` : `${josa(v, "은")} ${k}번째 ${name}예요.`,
    value: ask === "value" ? v : k
  };
}
const CONSEC_SET = {
  id: "consecutive",
  types: {
    // 10권
    "범위 안의 수의 개수": () => [countExample({ id: "count-1", title: "예제 1", from: 15, to: 42 }), countExample({ id: "count-2", title: "예제 2", from: 200, to: 350 })],
    "1부터 시작하는 연속수의 합": () => [pairSumExample({ id: "pair-one-1", title: "예제 1", from: 1, to: 12 }), pairSumExample({ id: "pair-one-2", title: "예제 2", from: 1, to: 40 })],
    "중간부터 시작하는 연속수의 합": () => [pairSumExample({ id: "pair-mid-1", title: "예제 1", from: 4, to: 11 }), pairSumExample({ id: "pair-mid-2", title: "예제 2", from: 13, to: 28 })],
    "가운데 수 찾기": () => [middleSumExample({ id: "mid-find-1", title: "예제 1", from: 1, to: 7, askMiddle: true }), middleSumExample({ id: "mid-find-2", title: "예제 2", from: 1, to: 25, askMiddle: true })],
    "가운데 수로 합 구하기": () => [middleSumExample({ id: "mid-sum-1", title: "예제 1", from: 11, to: 15 }), middleSumExample({ id: "mid-sum-2", title: "예제 2", from: 23, to: 31 })],
    // 6권
    "수의 개수": () => [countExample({ id: "count6-1", title: "예제 1", from: 4, to: 19 }), countExample({ id: "count6-2", title: "예제 2", from: 26, to: 61 })],
    "연속수의 합(짝수 개)": () => [pairSumExample({ id: "pair6-1", title: "예제 1", from: 3, to: 10 }), pairSumExample({ id: "pair6-2", title: "예제 2", from: 1, to: 16 })],
    "연속수의 합(홀수 개)": () => [middleSumExample({ id: "mid6-1", title: "예제 1", from: 8, to: 16 }), middleSumExample({ id: "mid6-2", title: "예제 2", from: 1, to: 11 })],
    "몇 번째 짝수": () => [orderExample({ id: "even-k-1", title: "예제 1", odd: false, ask: "value", k: 17 }), orderExample({ id: "even-k-2", title: "예제 2", odd: false, ask: "value", k: 45 })],
    "짝수의 순서": () => [orderExample({ id: "even-at-1", title: "예제 1", odd: false, ask: "order", k: 23 })],
    "몇 번째 홀수": () => [orderExample({ id: "odd-k-1", title: "예제 1", odd: true, ask: "value", k: 14 }), orderExample({ id: "odd-k-2", title: "예제 2", odd: true, ask: "value", k: 38 })],
    "홀수의 순서": () => [orderExample({ id: "odd-at-1", title: "예제 1", odd: true, ask: "order", k: 29 })]
  }
};

// ───────────────────────── 8권 합차 · 합과 배수 · 몇 배보다 많거나 적은 수 ─────────────────────────
// 원본 그림처럼 같은 수를 동그라미 하나로 그린다. A는 동그라미 a개, B는 동그라미 b개 + extra. 합(sum)이나 차(diff)가 주어진다.
// 예제의 수는 동그라미 하나의 값(unit)으로 새로 짓고, 합·차·답은 코드가 계산한다.
const signed = (e) => (e > 0 ? `+ ${e}` : `− ${-e}`);
function circleRows(a, b, extra, names = ["A", "B"]) { return [{ label: names[0], n: a }, { label: names[1], n: b, extra: extra ? signed(extra) : "" }]; }
function circleExample({ id, title, a, b, extra = 0, unit, given, story = null, names = ["A", "B"], ask = null }) {
  const A = a * unit, B = b * unit + extra, k = a + b;
  const [nA, nB] = names;
  const rows = circleRows(a, b, extra, names);
  // 문장제 글의 수는 코드가 계산한 합·차로 채운다
  if (typeof story === "function") story = story({ sum: A + B, diff: B - A });
  const base = given === "sum" ? { sum: A + B } : { diff: B - A };
  if (given === "diff" && (extra || b <= a)) throw new Error(`${id}: 차 예제는 B가 동그라미로만 더 많아야 함`);
  const fig = (tone, extraFig = {}) => ({ kind: "circles", rows, ...base, tone, ...extraFig });
  const steps = [];
  const bCircles = b === 1 ? "동그라미 하나" : `동그라미 ${b}개`;
  if (story) steps.push({ text: `${josa(nA, "을")} 동그라미 하나로 그리면 ${josa(nB, "은")} ${bCircles}${extra ? `보다 ${Math.abs(extra)} ${extra > 0 ? "많아요" : "적어요"}` : "예요"}.`, figure: fig("doing") });
  if (given === "sum") {
    const S = A + B, rest = S - extra;
    steps.push({ text: `동그라미는 모두 ${a} + ${b} = ${k}개예요.`, figure: fig("doing", { mark: "all" }) });
    steps.push(extra > 0
      ? { text: `${nB}에 붙은 ${josa(extra, "을")} 합에서 빼요. ${S} − ${extra} = ${josa(rest, "이")} 동그라미 ${k}개예요.`, figure: fig("doing", { mark: "all", hideExtra: true }) }
      : extra < 0
        ? { text: `${josa(nB, "은")} 동그라미보다 ${-extra} 적으니, 합에 ${josa(-extra, "을")} 더해요. ${S} + ${-extra} = ${josa(rest, "이")} 동그라미 ${k}개예요.`, figure: fig("doing", { mark: "all", hideExtra: true }) }
        : { text: `합 ${josa(S, "이")} 동그라미 ${k}개예요.`, figure: fig("doing", { mark: "all" }) });
    steps.push({ text: `동그라미 하나는 ${rest} ÷ ${k} = ${josa(unit, "이에요")}.`, figure: fig("doing", { unit }) });
  } else {
    const D = B - A;
    steps.push({ text: `${josa(nB, "이")} ${nA}보다 동그라미 ${b} − ${a} = ${b - a}개 더 많아요. 그 차가 ${josa(D, "이에요")}.`, figure: fig("doing", { mark: "diff" }) });
    steps.push({ text: `동그라미 하나는 ${D} ÷ ${b - a} = ${josa(unit, "이에요")}.`, figure: fig("doing", { mark: "diff", unit }) });
  }
  steps.push({ text: `${josa(nA, "은")} ${a === 1 ? `동그라미 하나라 ${A}` : `${a} × ${unit} = ${A}`}, ${josa(nB, "은")} ${b === 1 ? unit : `${b} × ${unit}`}${extra ? ` ${signed(extra)}` : ""} = ${josa(B, "이에요")}.`, figure: fig("check", { unit, values: [A, B] }) });
  return {
    id, title,
    problem: story || `그림을 보고 ${josa(nA, "과")} ${josa(nB, "을")} 구해요. 동그라미 하나는 모두 같은 수예요.`,
    figure: story ? { kind: "circles-story", note: `${josa(nA, "을")} 동그라미 하나로 그려 보면 쉬워요.` } : fig("given"), steps,
    // 문장제는 물은 사람(ask: 0 = 동그라미 하나인 쪽, 1 = 다른 쪽)만 답한다
    answer: ask === null ? `${josa(nA, "은")} ${A}, ${josa(nB, "은")} ${josa(B, "이에요")}.` : `${josa(names[ask], "은")} ${josa(ask ? B : A, "이에요")}.`,
    value: { A, B, a, b, extra, given, sum: A + B, diff: B - A, asked: ask === null ? null : ask ? B : A }
  };
}
// ○ + △ = S, ○ − △ = D
function shapePairExample({ id, title, big, small }) {
  const S = big + small, D = big - small;
  const rows = (tone, vals) => ({ kind: "shape-eq", lines: [["circle", "+", "triangle", "=", S], ["circle", "−", "triangle", "=", D]], tone, vals });
  const steps = [
    { text: `두 식을 더하면 △는 더했다가 빼서 없어지고 ○만 두 개 남아요. ○ + ○ = ${S} + ${D} = ${josa(S + D, "이에요")}.`, figure: rows("doing") },
    { text: `○ 하나는 ${S + D} ÷ 2 = ${josa(big, "이에요")}.`, figure: rows("doing", { circle: big }) },
    { text: `첫째 식에서 △ = ${S} − ${big} = ${josa(small, "이에요")}.`, figure: rows("check", { circle: big, triangle: small }) }
  ];
  return { id, title, problem: `○ + △ = ${S}, ○ − △ = ${josa(D, "이에요")}. ○와 △가 나타내는 수를 구해요.`, figure: rows("given"), steps, answer: `○는 ${big}, △는 ${josa(small, "이에요")}.`, value: { circle: big, triangle: small, S, D } };
}
// A가 B에게 g개를 주면 같아진다 → A는 B보다 2g 많다(합차로 푼다)
function giveEqualExample({ id, title, small, g, giver = "A" }) {
  const big = small + 2 * g, S = big + small;
  const other = giver === "A" ? "B" : "A";
  const story = `${josa("A", "과")} B가 가진 구슬은 모두 ${S}개예요. ${josa(giver, "이")} ${other}에게 ${g}개를 주면 둘이 같아져요. ${giver}는 몇 개를 가지고 있을까요?`;
  const ex = circleExample({ id, title, a: 1, b: 1, extra: 2 * g, unit: small, given: "sum", names: [other, giver], ask: 1, story });
  ex.steps.unshift({ text: `${josa(giver, "이")} ${g}개를 주면 같아지니, ${josa(giver, "은")} ${other}보다 ${g} + ${g} = ${2 * g}개 많아요.`, figure: { kind: "circles", rows: circleRows(1, 1, 2 * g, [other, giver]), sum: S, tone: "doing" } });
  return ex;
}
const CIRCLE_SET = {
  id: "sum-multiple",
  types: {
    "합과 차를 그림으로": () => [circleExample({ id: "sd-pic-1", title: "예제 1", a: 1, b: 1, extra: 9, unit: 8, given: "sum" }), circleExample({ id: "sd-pic-2", title: "예제 2", a: 1, b: 1, extra: 4, unit: 15, given: "sum" })],
    "합과 차의 식": () => [shapePairExample({ id: "sd-eq-1", title: "예제 1", big: 11, small: 6 }), shapePairExample({ id: "sd-eq-2", title: "예제 2", big: 25, small: 9 })],
    "합차 문장제": () => [circleExample({ id: "sd-story-1", title: "예제 1", a: 1, b: 1, extra: 8, unit: 9, given: "sum", names: ["동생", "언니"], ask: 1, story: ({ sum }) => `언니와 동생이 가진 사탕은 모두 ${sum}개예요. 언니가 동생보다 8개 더 많아요. 언니는 몇 개를 가지고 있을까요?` })],
    "주고 받아 같아지는 합차": () => [giveEqualExample({ id: "sd-give-1", title: "예제 1", small: 10, g: 4, giver: "A" }), giveEqualExample({ id: "sd-give-2", title: "예제 2", small: 12, g: 5, giver: "B" })],
    "합과 배수를 그림으로": () => [circleExample({ id: "sm-pic-1", title: "예제 1", a: 1, b: 3, unit: 9, given: "sum" }), circleExample({ id: "sm-pic-2", title: "예제 2", a: 2, b: 3, unit: 7, given: "sum" })],
    "합과 배수 문장제": () => [circleExample({ id: "sm-story-1", title: "예제 1", a: 1, b: 6, unit: 5, given: "sum", ask: 0, story: ({ sum }) => `A와 B가 가진 구슬은 모두 ${sum}개예요. B는 A의 6배예요. A는 몇 개를 가지고 있을까요?` })],
    "차와 배수를 그림으로": () => [circleExample({ id: "dm-pic-1", title: "예제 1", a: 1, b: 5, unit: 7, given: "diff" }), circleExample({ id: "dm-pic-2", title: "예제 2", a: 2, b: 5, unit: 11, given: "diff" })],
    "차와 배수 문장제": () => [circleExample({ id: "dm-story-1", title: "예제 1", a: 1, b: 3, unit: 13, given: "diff", ask: 1, story: ({ diff }) => `B는 A보다 구슬이 ${diff}개 더 많고, B는 A의 3배예요. B는 몇 개를 가지고 있을까요?` })],
    "몇 배보다 많거나 적은 수를 그림으로": () => [circleExample({ id: "ap-pic-1", title: "예제 1", a: 1, b: 2, extra: 6, unit: 8, given: "sum" }), circleExample({ id: "ap-pic-2", title: "예제 2", a: 1, b: 4, extra: -2, unit: 6, given: "sum" })],
    "몇 배보다 많은 수 문장제": () => [circleExample({ id: "ap-more-1", title: "예제 1", a: 1, b: 3, extra: 2, unit: 9, given: "sum", names: ["아들", "아빠"], ask: 1, story: ({ sum }) => `아빠와 아들의 나이를 더하면 ${sum}살이에요. 아빠는 아들 나이의 3배보다 2살 많아요. 아빠는 몇 살일까요?` })],
    "몇 배보다 적은 수 문장제": () => [circleExample({ id: "ap-less-1", title: "예제 1", a: 1, b: 4, extra: -3, unit: 7, given: "sum", names: ["B", "A"], ask: 1, story: ({ sum }) => `A와 B가 가진 카드를 더하면 ${sum}장이에요. A는 B의 4배보다 3장 적어요. A는 몇 장을 가지고 있을까요?` })]
  }
};

// ───────────────────────── 7권 시간 단위 바꾸기 · 시각과 시간의 계산 ─────────────────────────
// 단위: 큰 단위 하나 = 작은 단위 몇(1일 = 24시간 …). 그림은 묶음 줄(kind "bundle")에 「24시간」 카드를 늘어놓는다.
// 시각 계산: 원본처럼 시는 시끼리, 분은 분끼리 세로로(kind "time-col"). 60분 = 1시간으로 받아올리고 받아내린다.
// 오후 시각은 12를 더해 오전과 같은 기준으로 놓는다.
const TIME_UNIT = { 일: ["시간", 24], 시간: ["분", 60], 분: ["초", 60], 주일: ["일", 7], 년: ["개월", 12] };
// 「1시간으로」·「1주일로」: 받침이 없거나 ㄹ이면 「로」
const euro = (word) => { const c = String(word).charCodeAt(String(word).length - 1) - 0xac00, jong = c >= 0 && c <= 11171 ? c % 28 : 0; return `${word}${jong === 0 || jong === 8 ? "로" : "으로"}`; };
const unitCards = (k, small, big, n, sub = true) => (n <= 4
  ? Array.from({ length: n }, (_, i) => [...(i ? ["+"] : []), { v: `${k}${small}`, sub: sub ? `1${big}` : undefined, on: sub }]).flat()
  : [{ v: `${k}${small} × ${n}`, sub: sub ? `${n}${big}` : undefined, on: sub }]);
// toBig = false: 「4일 6시간 = □시간」 / toBig = true: 「380분 = □시간 □분」
function timeUnitExample({ id, title, big, n, rest = 0, toBig = false }) {
  const [small, k] = TIME_UNIT[big], total = n * k + rest;
  const restCard = rest ? ["+", { v: `${rest}${small}` }] : [];
  if (!toBig) {
    const lhs = `${n}${big}${rest ? ` ${rest}${small}` : ""}`;
    const steps = [
      { text: `1${big} = ${k}${josa(small, "이에요")}. ${n}${josa(big, "은")} ${k}${josa(small, "이")} ${n}개예요.`, figure: { kind: "bundle", rows: [{ tone: "doing", items: [...unitCards(k, small, big, n), ...restCard] }] } },
      { text: `${k} × ${n} = ${n * k}${small}${rest ? `, 남은 ${rest}${josa(small, "을")} 더하면 ${n * k} + ${rest} = ${total}${small}` : ""}이에요.`, figure: { kind: "bundle", rows: [{ tone: "doing", items: [...unitCards(k, small, big, n), ...restCard] }, { tone: "check", items: ["=", { v: `${total}${small}`, on: true }] }] } }
    ];
    return { id, title, problem: `${lhs} = □${small}에서 □에 알맞은 수를 구해요.`, figure: { kind: "bundle", rows: [{ tone: "given", items: [{ v: lhs }, "=", { v: "□", blank: true }] }] }, steps, answer: `□는 ${josa(total, "이에요")}.`, value: { total, n, rest, k, toBig, big, small } };
  }
  const steps = [
    { text: `${k}${josa(small, "을")} ${euro(`1${big}`)} 묶어요. ${total}${small} 안에 ${k}${small} 묶음이 몇 개 들어가는지 봐요.`, figure: { kind: "bundle", rows: [{ tone: "given", items: [{ v: `${total}${small}` }, "=", ...unitCards(k, small, big, n, false), ...restCard] }] } },
    { text: `${k} × ${n} = ${n * k}이라 ${k}${small} 묶음이 ${n}개 들어가고, ${total} − ${n * k} = ${rest}${josa(small, "이")} 남아요.`, figure: { kind: "bundle", rows: [{ tone: "doing", items: [{ v: `${total}${small}` }, "=", ...unitCards(k, small, big, n), ...restCard] }] } },
    { text: `${k}${small} 묶음 ${n}개는 ${n}${josa(big, "이에요")}. 그래서 ${total}${small} = ${n}${big} ${rest}${small}.`, figure: { kind: "bundle", rows: [{ tone: "doing", items: [{ v: `${total}${small}` }, "=", ...unitCards(k, small, big, n), ...restCard] }, { tone: "check", items: ["=", { v: `${n}${big} ${rest}${small}`, on: true }] }] } }
  ];
  return { id, title, problem: `${total}${small} = □${big} □${small}에서 □에 알맞은 수를 구해요.`, figure: { kind: "bundle", rows: [{ tone: "given", items: [{ v: `${total}${small}` }, "=", { v: `□${big} □${small}`, blank: true }] }] }, steps, answer: `${n}${big} ${josa(`${rest}${small}`, "이에요")}.`, value: { total, n, rest, k, toBig, big, small } };
}
// 세로셈. op "+": top = 시각, bottom = 시간. op "−": top = 늦은 시각, bottom = 이른 시각(걸린 시간이면 끝난 시각이 위).
// 시각: { pre: "" | "오전" | "오후", h, m, label? } · 시간: { h, m }
const clock24 = (t) => t.h + (t.pre === "오후" && t.h !== 12 ? 12 : 0);
const timeName = (t) => `${t.pre ? `${t.pre} ` : ""}${t.h}시 ${t.m}분`;
function timeColExample({ id, title, op, top, bottom, story = null, ask = null }) {
  const durRow = (t) => ({ ...t, hu: "시간", mu: "분" });
  const timeRow = (t) => ({ ...t, hu: "시", mu: "분" });
  const rows = op === "+" ? [timeRow(top), durRow(bottom)] : [timeRow(top), timeRow(bottom)];
  const fig = (tone, extra = {}) => ({ kind: "time-col", op, rows, tone, ...extra });
  const steps = [];
  const shifts = rows.map((r) => (r.pre === "오후" ? clock24(r) : null));
  const H1 = rows[0].hu === "시" ? clock24(rows[0]) : rows[0].h, H2 = rows[1].hu === "시" ? clock24(rows[1]) : rows[1].h;
  if (shifts.some((x) => x !== null)) {
    const r = rows[shifts.findIndex((x) => x !== null)];
    steps.push({ text: `오후 시각은 12를 더해 놓아요. 오후 ${r.h}시는 ${r.h} + 12 = ${clock24(r)}시예요.`, figure: fig("doing", { shifts }) });
  }
  let H, M, value;
  if (op === "+") {
    M = top.m + bottom.m; H = H1 + H2;
    steps.push({ text: `분끼리 더해요. ${top.m} + ${bottom.m} = ${M}분.`, figure: fig("doing", { shifts, res: { m: M } }) });
    if (M >= 60) {
      steps.push({ text: `${M}분은 60분보다 많아요. ${M}분 = 1시간 ${M - 60}분이라, 1시간을 시 쪽으로 받아올려요.`, figure: fig("doing", { shifts, res: { m: M - 60 }, carry: true }) });
      M -= 60; H += 1;
    }
    steps.push({ text: `시끼리 더해요. ${H1} + ${H2}${H !== H1 + H2 ? " + 1" : ""} = ${H}시.${H > 12 ? ` ${H}시는 오후 ${H - 12}시예요.` : ""}`, figure: fig("check", { shifts, res: { h: H, m: M, hu: "시" }, carry: H !== H1 + H2 }) });
    value = { minutes: H * 60 + M };
  } else {
    M = top.m - bottom.m; H = H1 - H2;
    const borrow = M < 0;
    if (borrow) { steps.push({ text: `${top.m}분에서 ${bottom.m}분을 뺄 수 없어요. 1시간을 60분으로 받아내리면 ${top.m} + 60 = ${top.m + 60}분이에요.`, figure: fig("doing", { shifts, borrow: true }) }); M += 60; H -= 1; }
    steps.push({ text: `분끼리 빼요. ${borrow ? top.m + 60 : top.m} − ${bottom.m} = ${M}분.`, figure: fig("doing", { shifts, borrow, res: { m: M } }) });
    steps.push({ text: `시끼리 빼요. ${H1}${borrow ? " − 1" : ""} − ${H2} = ${H}시간.`, figure: fig("check", { shifts, borrow, res: { h: H, m: M, hu: "시간" } }) });
    value = { minutes: H * 60 + M };
  }
  const pm = op === "+" && (top.pre || story) && H >= 12;
  const resultText = op === "+" ? `${top.pre || story ? (pm ? "오후 " : "오전 ") : ""}${pm && H > 12 ? H - 12 : H}시 ${M}분` : `${H}시간 ${M}분`;
  const problem = story || (op === "+" ? `${timeName(top)}에서 ${bottom.h}시간 ${bottom.m}분이 지나면 몇 시 몇 분일까요?` : `${timeName(bottom)}부터 ${timeName(top)}까지는 몇 시간 몇 분일까요?`);
  return { id, title, problem, figure: fig("given"), steps, answer: `${ask ? `${ask} ` : ""}${josa(resultText, "이에요")}.`, value };
}
const TIME_SET = {
  id: "time",
  types: {
    "시간 단위 바꾸기": () => [timeUnitExample({ id: "tu-day", title: "예제 1", big: "일", n: 4, rest: 6 }), timeUnitExample({ id: "tu-min", title: "예제 2", big: "시간", n: 6, rest: 20, toBig: true })],
    "주일·개월로 바꾸기": () => [timeUnitExample({ id: "tu-week", title: "예제 1", big: "주일", n: 3, rest: 4, toBig: true }), timeUnitExample({ id: "tu-year", title: "예제 2", big: "년", n: 3, rest: 4 })],
    "시각 + 시간": () => [timeColExample({ id: "tc-add-1", title: "예제 1", op: "+", top: { h: 6, m: 25 }, bottom: { h: 2, m: 15 } }), timeColExample({ id: "tc-add-2", title: "예제 2", op: "+", top: { h: 3, m: 50 }, bottom: { h: 4, m: 35 } })],
    "시각 − 시각": () => [timeColExample({ id: "tc-sub-1", title: "예제 1", op: "−", top: { h: 9, m: 45 }, bottom: { h: 4, m: 20 } }), timeColExample({ id: "tc-sub-2", title: "예제 2", op: "−", top: { h: 11, m: 15 }, bottom: { h: 8, m: 40 } })],
    "오후 − 오전": () => [timeColExample({ id: "tc-pm-1", title: "예제 1", op: "−", top: { pre: "오후", h: 4, m: 20 }, bottom: { pre: "오전", h: 8, m: 50 } })],
    "걸린 시간": () => [timeColExample({ id: "tc-took-1", title: "예제 1", op: "−", top: { pre: "오후", h: 1, m: 20 }, bottom: { pre: "오전", h: 10, m: 35 }, story: "오전 10시 35분에 시작해서 오후 1시 20분에 끝났어요. 걸린 시간은 몇 시간 몇 분일까요?", ask: "걸린 시간은" })],
    "시간 글 문제": () => [
      timeColExample({ id: "tc-story-1", title: "예제 1", op: "+", top: { pre: "오후", h: 2, m: 40 }, bottom: { h: 1, m: 50 }, story: "1시간 50분 동안 하는 공연이 오후 2시 40분에 시작해요. 끝나는 시각은 몇 시 몇 분일까요?", ask: "끝나는 시각은" }),
      timeColExample({ id: "tc-story-2", title: "예제 2", op: "−", top: { pre: "오전", h: 11, m: 10 }, bottom: { pre: "오전", h: 8, m: 35 }, story: "버스가 오전 8시 35분에 출발해서 오전 11시 10분에 도착했어요. 버스를 탄 시간은 몇 시간 몇 분일까요?", ask: "버스를 탄 시간은" })
    ]
  }
};

// ───────────────────────── 6권 사각형의 둘레 ─────────────────────────
// 직사각형·평행사변형은 마주 보는 변의 길이가 같아 (가로 + 세로) × 2, 정사각형·마름모는 네 변이 같아 한 변 × 4.
// 거꾸로: 둘레의 반(가로 + 세로)에서 아는 변을 빼거나, 둘레 ÷ 4. 그림은 kind "quad"(모양 색표: 네모 파랑 · 평행사변형 노랑 · 마름모 보라).
// sides: { top, right } — 위와 오른쪽 변에 쓰는 글(수 또는 「가」). 그림은 네 변에 모두 쓴다(마주 보는 변 같음을 보여 줄 때).
const QUAD_NAME = { rect: "직사각형", para: "평행사변형", square: "정사각형", rhombus: "마름모", trapezoid: "사다리꼴" };
function perimeterExample({ id, title, shape, a, b = a }) {
  const name = QUAD_NAME[shape], four = shape === "square" || shape === "rhombus";
  const P = four ? a * 4 : (a + b) * 2;
  const fig = (tone, extra = {}) => ({ kind: "quad", shape, top: String(a), right: four ? undefined : String(b), tone, ...extra });
  const steps = four
    ? [
      { text: `${josa(name, "은")} 네 변의 길이가 모두 같아요. 네 변이 모두 ${a}cm예요.`, figure: fig("doing", { all: true }) },
      { text: `한 변 × 4 = ${a} × 4 = ${P}cm예요.`, figure: fig("check", { all: true, inner: `둘레 ${P}cm` }) }
    ]
    : [
      { text: `${josa(name, "은")} 마주 보는 변의 길이가 같아요. 위아래가 ${a}cm, 양옆이 ${b}cm예요.`, figure: fig("doing", { all: true }) },
      { text: `가로와 세로를 하나씩 더하면 ${a} + ${b} = ${a + b}cm. 둘레의 반이에요.`, figure: fig("doing", { all: true, half: true }) },
      { text: `둘레는 그 두 배예요. ${a + b} × 2 = ${P}cm.`, figure: fig("check", { all: true, inner: `둘레 ${P}cm` }) }
    ];
  return { id, title, problem: four ? `한 변이 ${a}cm인 ${name}의 둘레는 몇 cm일까요?` : `${name}의 둘레는 몇 cm일까요?`, figure: fig("given", four ? { inner: "둘레 가" } : {}), steps, answer: `둘레는 ${P}cm예요.`, value: { P, a, b: four ? a : b, shape } };
}
// 둘레에서 한 변 찾기. 직사각형·평행사변형은 ask: "top" | "right"(known은 다른 쪽 변), 정사각형·마름모는 한 변.
function sideFromPerimeterExample({ id, title, shape, P, known = null, ask = "top" }) {
  const name = QUAD_NAME[shape], four = shape === "square" || shape === "rhombus";
  if (four) {
    if (P % 4) throw new Error(`${id}: 네 변이 같게 나눌 수 없음`);
    const s = P / 4;
    const fig = (tone, extra = {}) => ({ kind: "quad", shape, top: "가", inner: `둘레 ${P}cm`, tone, ...extra });
    const steps = [
      { text: `${josa(name, "은")} 네 변의 길이가 모두 같아요. 둘레 ${P}cm는 같은 변 4개를 더한 것이에요.`, figure: fig("doing", { all: true }) },
      { text: `한 변은 ${P} ÷ 4 = ${s}cm예요.`, figure: { kind: "quad", shape, top: String(s), inner: `둘레 ${P}cm`, tone: "check", all: true } }
    ];
    return { id, title, problem: `둘레가 ${P}cm인 ${name}의 한 변(가)은 몇 cm일까요?`, figure: fig("given"), steps, answer: `가는 ${s}cm예요.`, value: { side: s, P, shape } };
  }
  if (P % 2) throw new Error(`${id}: 둘레가 홀수`);
  const half = P / 2, x = half - known;
  if (x <= 0) throw new Error(`${id}: 변이 0보다 작음`);
  const labels = (v) => (ask === "top" ? { top: v, right: String(known) } : { top: String(known), right: v });
  const fig = (tone, v, extra = {}) => ({ kind: "quad", shape, ...labels(v), inner: `둘레 ${P}cm`, tone, ...extra });
  const steps = [
    { text: `마주 보는 변의 길이가 같아서, 둘레는 가로와 세로를 두 번씩 더한 거예요.`, figure: fig("doing", "가", { all: true }) },
    { text: `둘레의 반은 ${P} ÷ 2 = ${half}cm. 가로 하나와 세로 하나를 더한 길이예요.`, figure: fig("doing", "가", { all: true, half: true }) },
    { text: `가 = ${half} − ${known} = ${x}cm예요.`, figure: fig("check", String(x), { all: true, half: true }) }
  ];
  return { id, title, problem: `둘레가 ${P}cm인 ${name}에서 가에 알맞은 수를 구해요.`, figure: fig("given", "가"), steps, answer: `가는 ${x}cm예요.`, value: { side: x, P, known, shape } };
}
// 사각형 알아보기: 다섯 사각형 중 조건에 맞는 것을 모두 고른다. 각 사각형의 성질은 아래 표(평행한 변 쌍·같은 변·같은 각).
const QUAD_FACTS = {
  trapezoid: { parallel: 1, equalSides: false, equalAngles: false },
  para: { parallel: 2, equalSides: false, equalAngles: false },
  rhombus: { parallel: 2, equalSides: true, equalAngles: false },
  rect: { parallel: 2, equalSides: false, equalAngles: true },
  square: { parallel: 2, equalSides: true, equalAngles: true }
};
function quadKindExample({ id, title, ask }) {
  const order = ["trapezoid", "para", "rhombus", "rect", "square"], letters = ["가", "나", "다", "라", "마"];
  const tests = { "equal-sides": [(f) => f.equalSides, "네 변의 길이가 모두 같은"], "two-parallel": [(f) => f.parallel === 2, "마주 보는 변이 두 쌍 모두 평행한"] };
  const [test, words] = tests[ask];
  const hit = order.filter((k) => test(QUAD_FACTS[k]));
  const fig = (tone, mark = []) => ({ kind: "quad-gallery", items: order.map((k, i) => [letters[i], k]), mark, tone });
  const named = hit.map((k) => `${letters[order.indexOf(k)]}(${QUAD_NAME[k]})`).join(", ");
  const steps = [
    { text: `하나씩 살펴봐요. ${ask === "equal-sides" ? "변의 길이 표시가 네 변 모두 같은지" : "마주 보는 변이 두 쌍 모두 나란한지"} 봐요.`, figure: fig("doing") },
    { text: `${named}이 조건에 맞아요. ${ask === "equal-sides" ? "직사각형과 평행사변형은 마주 보는 변끼리만 같아요." : "사다리꼴은 한 쌍만 평행해요."}`, figure: fig("check", hit) }
  ];
  return { id, title, problem: `${words} 사각형을 모두 찾아요.`, figure: fig("given"), steps, answer: `${named}이에요.`, value: hit };
}
const PERIMETER_SET = {
  id: "perimeter",
  typeOf: (item) => item.typeLabel || "직사각형의 한 변",   // 「둘레로 빠진 변을 찾아요」 차시는 유형 이름이 비어 있다
  types: {
    "사각형 알아보기": () => [quadKindExample({ id: "quad-kind-1", title: "예제 1", ask: "equal-sides" }), quadKindExample({ id: "quad-kind-2", title: "예제 2", ask: "two-parallel" })],
    "직사각형의 둘레": () => [perimeterExample({ id: "rect-p-1", title: "예제 1", shape: "rect", a: 12, b: 7 }), perimeterExample({ id: "rect-p-2", title: "예제 2", shape: "rect", a: 21, b: 13 })],
    "직사각형의 한 변": () => [sideFromPerimeterExample({ id: "rect-s-1", title: "예제 1", shape: "rect", P: 42, known: 8, ask: "top" }), sideFromPerimeterExample({ id: "rect-s-2", title: "예제 2", shape: "rect", P: 120, known: 35, ask: "right" })],
    "평행사변형의 둘레": () => [perimeterExample({ id: "para-p-1", title: "예제 1", shape: "para", a: 15, b: 9 })],
    "평행사변형의 한 변": () => [sideFromPerimeterExample({ id: "para-s-1", title: "예제 1", shape: "para", P: 64, known: 19, ask: "right" })],
    "정사각형의 둘레": () => [perimeterExample({ id: "sq-p-1", title: "예제 1", shape: "square", a: 16 })],
    "정사각형의 한 변": () => [sideFromPerimeterExample({ id: "sq-s-1", title: "예제 1", shape: "square", P: 84 })],
    "마름모의 둘레": () => [perimeterExample({ id: "rh-p-1", title: "예제 1", shape: "rhombus", a: 23 })],
    "마름모의 한 변": () => [sideFromPerimeterExample({ id: "rh-s-1", title: "예제 1", shape: "rhombus", P: 108 })]
  }
};

// ───────────────────────── 7권 가로수 심기(닫힌 도형) · 수직선 위의 거리 ─────────────────────────
// 닫힌 둘레는 처음과 끝이 만나 심는 수 = 간격 수. 꼭짓점의 돌은 두 변이 함께 쓴다.
// 그림: kind "stones"(한 변 n개 바둑돌 다각형) · "plot"(땅 둘레에 나무) · "lake"(원 둘레에 가로등).
const POLY_SIDES = { triangle: 3, square: 4 }, POLY_NAME = { triangle: "정삼각형", square: "정사각형" };
function stoneExample({ id, title, shape, n }) {
  const k = POLY_SIDES[shape], total = (n - 1) * k, name = POLY_NAME[shape];
  const fig = (tone, extra = {}) => ({ kind: "stones", shape, n, tone, ...extra });
  const steps = [
    { text: `한 변에 ${n}개씩이에요. 그런데 꼭짓점의 돌은 두 변이 함께 써요.`, figure: fig("doing", { corners: true }) },
    { text: `변마다 끝의 꼭짓점 하나를 빼고 세면 ${n} − 1 = ${n - 1}개씩, 겹치지 않아요.`, figure: fig("doing", { perSide: true }) },
    { text: `변이 ${k}개니까 ${n - 1} × ${k} = ${josa(total, "이에요")}.`, figure: fig("check", { perSide: true }) }
  ];
  return { id, title, problem: `${name} 모양으로 바둑돌을 늘어놓았어요. 한 변에 ${n}개씩일 때 바둑돌은 모두 몇 개일까요?`, figure: fig("given"), steps, answer: `바둑돌은 모두 ${total}개예요.`, value: { total, n, k, shape } };
}
function stoneReverseExample({ id, title, shape, total }) {
  const k = POLY_SIDES[shape], name = POLY_NAME[shape];
  if (total % k) throw new Error(`${id}: 변마다 똑같이 나눌 수 없음`);
  const n = total / k + 1;
  const fig = (tone, extra = {}) => ({ kind: "stones", shape, n, tone, ...extra });
  const steps = [
    { text: `변마다 꼭짓점 하나를 빼고 세면 겹치지 않게 ${k}묶음으로 나뉘어요.`, figure: fig("doing", { perSide: true, hideCount: true }) },
    { text: `한 묶음은 ${total} ÷ ${k} = ${total / k}개예요.`, figure: fig("doing", { perSide: true }) },
    { text: `한 변에는 뺐던 꼭짓점 하나를 더해 ${total / k} + 1 = ${n}개예요.`, figure: fig("check", { perSide: true }) }
  ];
  return { id, title, problem: `${name} 모양으로 바둑돌 ${total}개를 늘어놓았어요. 한 변에 바둑돌이 몇 개씩일까요?`, figure: { kind: "stones-blank", shape, total }, steps, answer: `한 변에 ${n}개씩이에요.`, value: { total, n, k, shape } };
}
// 땅 둘레: shape "rect"(가로·세로) | "square" | "triangle"(정삼각형), gap 간격. 꼭짓점에도 심는다.
function plotExample({ id, title, shape, w, h = w, gap }) {
  const P = shape === "rect" ? (w + h) * 2 : shape === "square" ? w * 4 : w * 3;
  if (P % gap || w % gap || h % gap) throw new Error(`${id}: 간격으로 나누어떨어지지 않음`);
  const name = { rect: "직사각형", square: "정사각형", triangle: "정삼각형" }[shape], trees = P / gap;
  const fig = (tone, extra = {}) => ({ kind: "plot", shape, w, h, gap, tone, ...extra });
  const sum = shape === "rect" ? `(${w} + ${h}) × 2 = ${P}` : `${w} × ${shape === "square" ? 4 : 3} = ${P}`;
  const steps = [
    { text: `둘레는 ${sum}m예요.`, figure: fig("doing") },
    { text: `닫힌 둘레는 처음 나무와 끝 나무가 만나서, 나무 수가 간격 수와 같아요.`, figure: fig("doing", { trees: true }) },
    { text: `간격은 ${P} ÷ ${gap} = ${trees}개라 나무도 ${trees}그루예요.`, figure: fig("check", { trees: true }) }
  ];
  return { id, title, problem: `${shape === "rect" ? `가로 ${w}m, 세로 ${h}m인` : `한 변이 ${w}m인`} ${name} 땅 둘레에 ${gap}m 간격으로 나무를 심어요. 꼭짓점에도 심을 때 나무는 몇 그루일까요?`, figure: fig("given"), steps, answer: `나무는 ${trees}그루예요.`, value: { trees, P, gap } };
}
// 호수 둘레: 둘레 C, 간격 gap. per가 있으면 가로등 사이마다 per개씩 놓은 것(의자)도 센다.
function lakeExample({ id, title, C, gap, per = 0, between = "의자" }) {
  if (C % gap) throw new Error(`${id}: 간격으로 나누어떨어지지 않음`);
  const lamps = C / gap;
  const fig = (tone, extra = {}) => ({ kind: "lake", count: lamps, gap, C, tone, ...extra });
  const steps = [
    { text: `호수 둘레는 닫혀 있어서 가로등 수와 간격 수가 같아요.`, figure: fig("doing", { lamps: true }) },
    { text: `가로등은 ${C} ÷ ${gap} = ${lamps}개예요.`, figure: fig(per ? "doing" : "check", { lamps: true }) }
  ];
  if (per) steps.push({ text: `가로등 사이도 ${lamps}곳이에요. 한 곳에 ${per}개씩이니 ${between}는 ${lamps} × ${per} = ${lamps * per}개예요.`, figure: fig("check", { lamps: true, per }) });
  const problem = `둘레가 ${C}m인 원 모양 호수 둘레에 ${gap}m 간격으로 가로등을 세워요.${per ? ` 가로등 사이마다 ${between}를 ${per}개씩 놓으면 가로등과 ${between}는 각각 몇 개일까요?` : " 가로등은 몇 개일까요?"}`;
  return { id, title, problem, figure: fig("given"), steps, answer: per ? `가로등은 ${lamps}개, ${between}는 ${lamps * per}개예요.` : `가로등은 ${lamps}개예요.`, value: { lamps, between: lamps * per, C, gap } };
}
// 둘레 거꾸로: 나무 count그루가 gap 간격이면 둘레 = count × gap. treesBetween이면 가로등 사이 나무 수로 먼저 가로등 수를 구한다.
function lakeReverseExample({ id, title, count, gap, treesBetween = 0, treesTotal = 0 }) {
  const lamps = treesBetween ? treesTotal / treesBetween : count;
  if (!Number.isInteger(lamps)) throw new Error(`${id}: 가로등 수가 자연수가 아님`);
  const C = lamps * gap;
  const fig = (tone, extra = {}) => ({ kind: "lake", count: lamps, gap, tone, ...extra });
  const steps = [];
  if (treesBetween) steps.push({ text: `가로등 사이마다 나무가 ${treesBetween}그루씩이에요. 나무 ${treesTotal}그루 ÷ ${treesBetween} = ${lamps}곳이라 가로등도 ${lamps}개예요.`, figure: fig("doing", { lamps: true, per: treesBetween }) });
  steps.push({ text: `닫힌 둘레라 간격도 ${lamps}개예요.`, figure: fig("doing", { lamps: true }) });
  steps.push({ text: `둘레는 간격 ${lamps}개 × ${gap}m = ${C}m예요.`, figure: fig("check", { lamps: true, C }) });
  const problem = treesBetween
    ? `원 모양 호수 둘레에 가로등이 같은 간격으로 서 있고, 가로등 사이마다 나무가 ${treesBetween}그루씩 모두 ${treesTotal}그루 있어요. 가로등 사이 간격이 ${gap}m일 때 호수의 둘레는 몇 m일까요?`
    : `원 모양 호수 둘레에 나무 ${count}그루가 ${gap}m 간격으로 심어져 있어요. 호수의 둘레는 몇 m일까요?`;
  return { id, title, problem, figure: fig("given", { count: lamps }), steps, answer: `호수의 둘레는 ${C}m예요.`, value: { C, lamps, gap } };
}
const PLANTING_SET = {
  id: "planting",
  types: {
    "바둑돌 정삼각형": () => [stoneExample({ id: "stone-tri-1", title: "예제 1", shape: "triangle", n: 7 }), stoneExample({ id: "stone-tri-2", title: "예제 2", shape: "triangle", n: 12 })],
    "바둑돌 정사각형": () => [stoneExample({ id: "stone-sq-1", title: "예제 1", shape: "square", n: 6 }), stoneExample({ id: "stone-sq-2", title: "예제 2", shape: "square", n: 11 })],
    "한 변의 바둑돌 거꾸로": () => [stoneReverseExample({ id: "stone-rev-1", title: "예제 1", shape: "triangle", total: 24 }), stoneReverseExample({ id: "stone-rev-2", title: "예제 2", shape: "square", total: 44 })],
    "닫힌 도형의 둘레": () => [plotExample({ id: "plot-1", title: "예제 1", shape: "rect", w: 30, h: 18, gap: 6 }), plotExample({ id: "plot-2", title: "예제 2", shape: "triangle", w: 45, gap: 9 })],
    "호수 둘레": () => [lakeExample({ id: "lake-1", title: "예제 1", C: 120, gap: 8 }), lakeExample({ id: "lake-2", title: "예제 2", C: 90, gap: 15, per: 2 })],
    "둘레 거꾸로": () => [lakeReverseExample({ id: "lake-rev-1", title: "예제 1", count: 18, gap: 7 }), lakeReverseExample({ id: "lake-rev-2", title: "예제 2", gap: 9, treesBetween: 3, treesTotal: 24 })]
  }
};
// 수직선 위의 거리: 점 위치(cm)로 거리를 정하고, 주어진 호(arcs)로 묻는 거리를 구한다.
// kind: part(전체 − 부분) · inner(두 거리를 더하면 겹친 부분이 두 번 → 전체를 빼면 겹친 부분) · outer(두 거리를 더하고 겹친 부분을 한 번 뺌)
function distExample({ id, title, pts, kind, ask, given, blank = false }) {
  const d = ([a, b]) => Math.abs(pts[b] - pts[a]);
  const nm = ([a, b]) => `${a}~${b}`;
  const arcs = (show, extra = {}) => ({ kind: "dist-line", points: Object.entries(pts).map(([label, at]) => ({ label, at })), arcs: [...given.map(([a, b], i) => ({ from: a, to: b, label: `${d([a, b])}cm`, side: i === 0 && kind !== "outer" ? "over" : "under" })), ...(show ? [{ from: ask[0], to: ask[1], label: show === true ? (blank ? "□" : "?") : show, side: "over", ask: true }] : [])], ...extra });
  const steps = [];
  const v = d(ask);
  if (kind === "part") {
    const [whole, part] = given;
    steps.push({ text: `전체 ${josa(nm(whole), "은")} ${d(whole)}cm, 그중 ${josa(nm(part), "이")} ${d(part)}cm예요.`, figure: arcs(true, { tone: "doing", mark: [nm(whole), nm(part)] }) });
    steps.push({ text: `나머지 ${josa(nm(ask), "은")} ${d(whole)} − ${d(part)} = ${v}cm예요.`, figure: arcs(`${v}cm`, { tone: "check" }) });
  } else if (kind === "inner") {
    const [whole, p, q] = given;
    steps.push({ text: `${josa(nm(p), "과")} ${josa(nm(q), "을")} 더하면 ${d(p)} + ${d(q)} = ${d(p) + d(q)}cm. 겹친 ${josa(nm(ask), "이")} 두 번 들어가 있어요.`, figure: arcs(true, { tone: "doing", mark: [nm(p), nm(q)], overlap: true }) });
    steps.push({ text: `전체 ${nm(whole)} ${d(whole)}cm에는 한 번만 들어가니, 빼면 겹친 부분이 남아요. ${d(p) + d(q)} − ${d(whole)} = ${v}cm.`, figure: arcs(`${v}cm`, { tone: "check", overlap: true }) });
  } else {
    const [p, q, o] = given;
    steps.push({ text: `${josa(nm(p), "과")} ${josa(nm(q), "을")} 더하면 ${d(p)} + ${d(q)} = ${d(p) + d(q)}cm. 겹친 ${josa(nm(o), "이")} 두 번 들어가 있어요.`, figure: arcs(true, { tone: "doing", mark: [nm(p), nm(q)], overlap: true }) });
    steps.push({ text: `겹친 ${nm(o)} ${d(o)}cm를 한 번 빼면 ${d(p) + d(q)} − ${d(o)} = ${v}cm예요.`, figure: arcs(`${v}cm`, { tone: "check", overlap: true }) });
  }
  return { id, title, problem: blank ? `수직선 위의 거리를 보고 빈칸에 알맞은 수를 구해요.` : `수직선 위에 점이 있어요. ${josa(nm(ask), "은")} 몇 cm일까요?`, figure: arcs(true, { tone: "given" }), steps, answer: `${josa(nm(ask), "은")} ${v}cm예요.`, value: { v, pts, ask, given, kind } };
}
const DIST_SET = {
  id: "distance",
  types: {
    "장소 사이의 거리": () => [distExample({ id: "dist-part-1", title: "예제 1", pts: { 학교: 0, 공원: 23, 도서관: 61 }, kind: "part", ask: ["공원", "도서관"], given: [["학교", "도서관"], ["학교", "공원"]] })],
    "겹친 거리": () => [
      distExample({ id: "dist-inner-1", title: "예제 1", pts: { A: 0, B: 9, C: 22, D: 35 }, kind: "inner", ask: ["B", "C"], given: [["A", "D"], ["A", "C"], ["B", "D"]] }),
      distExample({ id: "dist-outer-1", title: "예제 2", pts: { A: 0, B: 14, C: 33, D: 52 }, kind: "outer", ask: ["A", "D"], given: [["A", "C"], ["B", "D"], ["B", "C"]] })
    ],
    "빈칸의 거리": () => [distExample({ id: "dist-blank-1", title: "예제 1", pts: { A: 0, B: 18, C: 26, D: 41 }, kind: "outer", ask: ["A", "D"], given: [["A", "C"], ["B", "D"], ["B", "C"]], blank: true })]
  }
};

// ───────────────────────── 6권 수와 숫자의 개수 ─────────────────────────
// 수의 개수 = 끝 − 처음 + 1. 쓴 숫자의 개수 = 한 자리·두 자리·세 자리 수로 나누어 (개수 × 자릿수)를 더함.
// 특정 숫자의 개수는 일의 자리·십의 자리로 나누어 세고, 숫자가 들어간 수는 두 자리에 다 들어간 수를 한 번만 센다.
// 그림: kind "digit-groups"(한 자리·두 자리·세 자리 묶음 칸) · "digit-grid"(1~100 수 배열판에 표시)
const digitLen = (n) => String(n).length;
function digitGroups(from, to) {
  const groups = [];
  for (const [lo, hi, d] of [[1, 9, 1], [10, 99, 2], [100, 999, 3]]) {
    const a = Math.max(lo, from), b = Math.min(hi, to);
    if (a <= b) groups.push({ from: a, to: b, count: b - a + 1, digits: d });
  }
  return groups;
}
function numberCountExample({ id, title, from, to }) {
  const n = to - from + 1;
  const steps = [
    { text: `${to} − ${from} = ${josa(to - from, "은")} ${josa(from, "을")} 빼고 센 개수예요.`, figure: { kind: "consec", from, to, mode: "count", tone: "doing", skipFirst: true } },
    { text: `처음 수 ${from}도 넣어야 하니 1을 더해요. ${to - from} + 1 = ${n}개예요.`, figure: { kind: "consec", from, to, mode: "count", tone: "check" } }
  ];
  return { id, title, problem: `${from}부터 ${to}까지 수는 모두 몇 개일까요?`, figure: { kind: "consec", from, to, mode: "count" }, steps, answer: `${n}개예요.`, value: n };
}
function digitWrittenExample({ id, title, from, to }) {
  const gs = digitGroups(from, to), total = gs.reduce((s, g) => s + g.count * g.digits, 0);
  const fig = (tone, show) => ({ kind: "digit-groups", groups: gs, show, tone });
  const name = { 1: "한 자리", 2: "두 자리", 3: "세 자리" };
  const steps = [
    { text: `자릿수가 같은 수끼리 나눠요. ${gs.map((g) => `${josa(`${g.from}~${g.to}`, "은")} ${name[g.digits]} 수`).join(", ")}예요.`, figure: fig("doing", "range") },
    { text: `묶음마다 수의 개수를 세요. ${gs.map((g) => `${g.to} − ${g.from} + 1 = ${g.count}개`).join(", ")}.`, figure: fig("doing", "count") },
    { text: `수 하나를 쓰는 데 자릿수만큼 숫자를 써요. ${gs.map((g) => `${g.count} × ${g.digits}`).join(" + ")} = ${josa(total, "이에요")}.`, figure: fig("check", "digits") }
  ];
  return { id, title, problem: `${from}부터 ${to}까지 수를 차례로 쓸 때, 쓴 숫자는 모두 몇 개일까요?`, figure: fig("given", "plain"), steps, answer: `쓴 숫자는 ${total}개예요.`, value: total };
}
// 1부터 100까지(또는 end까지) 쓸 때 숫자 d를 쓰는 횟수: 일의 자리 + 십의 자리(+ 백의 자리)
function digitTimesExample({ id, title, ds, end = 100 }) {
  const count = (d) => { let c = 0; for (let n = 1; n <= end; n++) for (const ch of String(n)) if (ch === String(d)) c++; return c; };
  const ones = (d) => { let c = 0; for (let n = 1; n <= end; n++) if (String(n).at(-1) === String(d)) c++; return c; };
  const tens = (d) => count(d) - ones(d);
  const each = ds.map((d) => ({ d, ones: ones(d), tens: tens(d), all: count(d) }));
  const total = each.reduce((s, e) => s + e.all, 0);
  const one = ds.length === 1;
  // 백의 자리에 쓰는 숫자는 100의 「1」뿐이다(이 묶음은 100까지)
  const upper = (d) => (d === 1 && end >= 100 ? "십의 자리·백의 자리" : "십의 자리");
  const steps = one
    ? [
      { text: `일의 자리가 ${ds[0]}인 수를 세요. ${each[0].ones}번이에요.`, figure: { kind: "digit-grid", end, digits: ds, place: "ones", tone: "doing" } },
      { text: `${upper(ds[0])}에 쓴 ${josa(ds[0], "을")} 세면 ${each[0].tens}번. 모두 ${each[0].ones} + ${each[0].tens} = ${each[0].all}번이에요.`, figure: { kind: "digit-grid", end, digits: ds, place: "all", tone: "check" } }
    ]
    : [
      ...each.map((e) => ({ text: `숫자 ${e.d}: 일의 자리에 ${e.ones}번, ${upper(e.d)}에 ${e.tens}번이에요. 모두 ${e.ones} + ${e.tens} = ${e.all}번.`, figure: { kind: "digit-grid", end, digits: [e.d], place: "all", tone: "doing" } })),
      { text: `모두 더하면 ${each.map((e) => e.all).join(" + ")} = ${total}번이에요.`, figure: { kind: "digit-grid", end, digits: ds, place: "all", tone: "check" } }
    ];
  return { id, title, problem: `1부터 ${end}까지 수를 차례로 쓸 때, ${one ? `숫자 ${josa(ds[0], "은")} 모두 몇 번 쓸까요?` : `숫자 ${josa(ds.join(", "), "을")} 쓰는 횟수를 모두 더하면 몇 번일까요?`}`, figure: { kind: "digit-grid", end, digits: [], tone: "given" }, steps, answer: `${total}번이에요.`, value: total };
}
// 숫자가 들어간 수: d(또는 d1·d2 중 하나라도)가 들어간 수의 개수. 두 번 들어간 수(33)는 한 번만.
function numbersWithDigitExample({ id, title, ds, end = 100 }) {
  const has = (n) => ds.some((d) => String(n).includes(String(d)));
  const list = []; for (let n = 1; n <= end; n++) if (has(n)) list.push(n);
  const onesHit = []; for (let n = 1; n <= end; n++) if (ds.some((d) => String(n).at(-1) === String(d))) onesHit.push(n);
  const tensOnly = list.filter((n) => !onesHit.includes(n));
  const steps = [
    { text: `일의 자리에 ${josa(ds.join(" 또는 "), "이")} 있는 수를 세요. ${onesHit.length}개예요.`, figure: { kind: "digit-grid", end, digits: ds, cells: onesHit, tone: "doing" } },
    { text: `십의 자리에만 있는 수(일의 자리에서 이미 센 수는 빼요)를 더 세요. ${tensOnly.length}개예요.`, figure: { kind: "digit-grid", end, digits: ds, cells: list, tone: "doing" } },
    { text: `모두 ${onesHit.length} + ${tensOnly.length} = ${list.length}개예요. 두 자리에 다 들어간 수는 한 번만 셌어요.`, figure: { kind: "digit-grid", end, digits: ds, cells: list, tone: "check" } }
  ];
  return { id, title, problem: `1부터 ${end}까지의 수 가운데 숫자 ${josa(ds.join(" 또는 "), "이")} ${ds.length > 1 ? "하나라도 " : ""}들어간 수는 몇 개일까요?`, figure: { kind: "digit-grid", end, digits: [], tone: "given" }, steps, answer: `${list.length}개예요.`, value: list.length };
}

// 「숫자와 수」: 수 하나를 쓰는 데 숫자를 몇 개 쓰는지
function digitVsNumberExample({ id, title, n }) {
  const k = String(n).length;
  const steps = [
    { text: `수를 쓰는 데 쓰는 기호 0~9를 숫자라고 해요. ${n}에는 숫자 ${String(n).split("").join(", ")}를 썼어요.`.replace(/(\d)를 썼어요/u, (m, d) => `${josa(d, "을")} 썼어요`), figure: { kind: "digit-groups", groups: [{ from: n, to: n, count: 1, digits: k }], show: "digits", tone: "doing" } },
    { text: `그래서 ${josa(n, "은")} 수 1개이고, 숫자는 ${k}개예요.`, figure: { kind: "digit-groups", groups: [{ from: n, to: n, count: 1, digits: k }], show: "digits", tone: "check" } }
  ];
  return { id, title, problem: `${josa(n, "을")} 쓸 때 수는 몇 개이고, 쓴 숫자는 몇 개일까요?`, figure: { kind: "digit-groups", groups: [{ from: n, to: n, count: 1, digits: k }], show: "plain", tone: "given" }, steps, answer: `수는 1개, 숫자는 ${k}개예요.`, value: { numbers: 1, digits: k } };
}
const DIGIT_SET = {
  id: "digits",
  // 「수의 개수와 쓴 숫자를 구별해요」·「처음과 끝을 넣어 수를 세어요」 차시는 유형 이름이 비어 있어 문장으로 나눈다
  typeOf: (item) => item.typeLabel || (/쓴 숫자/u.test(item.prompt) ? "쓴 숫자의 개수" : "수의 개수"),
  types: {
    "숫자와 수": () => [digitVsNumberExample({ id: "dvn-1", title: "예제 1", n: 507 })],
    "수의 개수": () => [numberCountExample({ id: "dcount-1", title: "예제 1", from: 7, to: 31 }), numberCountExample({ id: "dcount-2", title: "예제 2", from: 36, to: 92 })],
    "쓴 숫자의 개수": () => [digitWrittenExample({ id: "dwrite-1", title: "예제 1", from: 4, to: 27 }), digitWrittenExample({ id: "dwrite-2", title: "예제 2", from: 8, to: 125 })],
    "특정 숫자의 개수": () => [digitTimesExample({ id: "dtimes-1", title: "예제 1", ds: [5] }), digitTimesExample({ id: "dtimes-2", title: "예제 2", ds: [6], end: 70 })],
    "여러 숫자의 개수": () => [digitTimesExample({ id: "dtimes-many-1", title: "예제 1", ds: [2, 6] })],
    "숫자가 들어간 수": () => [numbersWithDigitExample({ id: "dwith-1", title: "예제 1", ds: [4] }), numbersWithDigitExample({ id: "dwith-2", title: "예제 2", ds: [2, 5], end: 60 })]
  }
};

// ───────────────────────── 8권 거꾸로 생각하기 ─────────────────────────
// 계산 사슬: 마지막 결과에서 순서를 뒤집고, 더하기 ↔ 빼기, 곱하기 ↔ 나누기로 되돌린다(그림 kind "op-chain").
// 가진 만큼 주기: 받은 사람은 2배가 되므로, 거꾸로 갈 때는 받은 사람을 반으로 나누고 준 사람에게 그만큼 돌려준다(그림 kind "give-table").
const OP_DO = { "+": (x, n) => x + n, "−": (x, n) => x - n, "×": (x, n) => x * n, "÷": (x, n) => x / n };
const OP_UNDO = { "+": "−", "−": "+", "×": "÷", "÷": "×" };
const OP_WORD = { "+": "더하기", "−": "빼기", "×": "곱하기", "÷": "나누기" };
function opChainExample({ id, title, start, ops, style = "chain" }) {
  // ops: [["+", 6], ["−", 2]] — 처음 수(start)는 코드가 답을 확인하는 데만 쓴다
  const values = [start];
  for (const [op, n] of ops) values.push(OP_DO[op](values.at(-1), n));
  if (!values.every((x) => Number.isInteger(x) && x >= 0)) throw new Error(`${id}: 사슬 중간에 자연수가 아님`);
  const end = values.at(-1);
  const shown = (upto) => values.map((x, i) => (i === values.length - 1 || i >= upto ? x : null));   // 오른쪽부터 채운다
  const steps = [{ text: `마지막 결과 ${end}에서 거꾸로 가요. 계산 순서를 뒤집고, 반대 계산을 해요.`, figure: { kind: "op-chain", ops, nodes: shown(values.length), back: true, tone: "doing" } }];
  for (let i = ops.length - 1; i >= 0; i--) {
    const [op, n] = ops[i], undo = OP_UNDO[op];
    steps.push({ text: `${josa(`${op}${n}`, "을")} 되돌려 ${undo}${n}: ${values[i + 1]} ${undo} ${n} = ${values[i]}.`, figure: { kind: "op-chain", ops, nodes: shown(i), back: true, focus: i, tone: i === 0 ? "check" : "doing" } });
  }
  const eq = `□ ${ops.map(([op, n]) => `${op} ${n}`).join(" ")} = ${end}`;
  return {
    id, title,
    problem: style === "equation" ? `${eq}에서 □에 알맞은 수를 구해요.` : "화살표를 따라 차례로 계산했어요. □에 알맞은 수를 구해요.",
    figure: { kind: "op-chain", ops, nodes: shown(values.length), tone: "given", equation: style === "equation" ? eq : null }, steps,
    answer: `□는 ${josa(start, "이에요")}.`, value: { start, ops, end }
  };
}
// 주고받기 기록: moves = [{ from, to, n: "have" | 수 }] — "have"는 받는 사람이 가진 만큼.
function giveMovesForward(a, b, moves) {
  const s = [{ A: a, B: b }];
  for (const mv of moves) { const cur = { ...s.at(-1) }, n = mv.n === "have" ? cur[mv.to] : mv.n; cur[mv.from] -= n; cur[mv.to] += n; s.push(cur); }
  return s;
}
const moveText = (mv) => `${josa(mv.from, "이")} ${mv.to}에게 ${mv.n === "have" ? `${mv.to}가 가진 만큼` : `${mv.n}개`}`;
function giveExample({ id, title, a, b, moves, ask = "start" }) {
  const states = giveMovesForward(a, b, moves);
  if (!states.every((x) => x.A >= 0 && x.B >= 0)) throw new Error(`${id}: 구슬이 0보다 적어짐`);
  const last = states.at(-1), cols = states.length;
  const fig = (tone, filled, extra = {}) => ({ kind: "give-table", moves, states: states.map((x, i) => (filled.includes(i) ? x : null)), tone, ...extra });
  const steps = [];
  let story, answer, value;
  if (ask === "end") {
    steps.push({ text: `처음에 A는 ${a}개, B는 ${b}개예요.`, figure: fig("given", [0]) });
    moves.forEach((mv, i) => {
      const n = mv.n === "have" ? states[i][mv.to] : mv.n;
      steps.push({ text: `${moveText(mv)} 주면 ${mv.from}는 ${states[i][mv.from]} − ${n} = ${states[i + 1][mv.from]}, ${mv.to}는 ${states[i][mv.to]} + ${n} = ${josa(states[i + 1][mv.to], "이에요")}.`, figure: fig(i === moves.length - 1 ? "check" : "doing", Array.from({ length: i + 2 }, (_, k) => k), { focus: i }) });
    });
    story = `구슬을 A는 ${a}개, B는 ${b}개 가지고 있어요. ${moves.map((mv) => `${moveText(mv)} 주었어요`).join(". ")}. 이제 A와 B는 각각 몇 개일까요?`;
    answer = `A는 ${last.A}개, B는 ${last.B}개예요.`; value = { A: last.A, B: last.B };
  } else {
    if (last.A !== last.B) throw new Error(`${id}: 끝에 같아지지 않음`);
    steps.push({ text: `마지막에 둘 다 ${last.A}개예요. 끝에서부터 거꾸로 가요.`, figure: fig("doing", [cols - 1]) });
    for (let i = moves.length - 1; i >= 0; i--) {
      const mv = moves[i], before = states[i], after = states[i + 1];
      const text = mv.n === "have"
        ? `${josa(mv.to, "은")} 가진 만큼 받아 2배가 됐어요. 받기 전 ${mv.to}는 ${after[mv.to]} ÷ 2 = ${before[mv.to]}, 준 ${mv.from}는 ${after[mv.from]} + ${before[mv.to]} = ${before[mv.from]}개예요.`
        : `${josa(mv.from, "이")} ${mv.n}개를 줬으니 되돌려요. ${mv.from}는 ${after[mv.from]} + ${mv.n} = ${before[mv.from]}, ${mv.to}는 ${after[mv.to]} − ${mv.n} = ${before[mv.to]}개예요.`;
      steps.push({ text, figure: fig(i === 0 ? "check" : "doing", Array.from({ length: cols - i }, (_, k) => cols - 1 - k), { focus: i }) });
    }
    story = `${moves.map((mv) => `${moveText(mv)} 주었어요`).join(". 다시 ")}. 그랬더니 두 사람 모두 ${last.A}개씩이 되었어요. A가 처음에 가진 구슬은 몇 개일까요?`;
    answer = `A는 처음에 ${a}개를 가지고 있었어요.`; value = { A: a, B: b };
  }
  return { id, title, problem: story, figure: fig("given", ask === "end" ? [0] : [cols - 1]), steps, answer, value: { ...value, a, b, moves, ask } };
}
const REVERSE_SET = {
  id: "reverse",
  types: {
    "식을 거꾸로 풀기": () => [opChainExample({ id: "rev-eq-1", title: "예제 1", start: 8, ops: [["+", 9], ["−", 4]], style: "equation" }), opChainExample({ id: "rev-eq-2", title: "예제 2", start: 13, ops: [["−", 3], ["+", 8], ["−", 6], ["+", 2]], style: "equation" })],
    "계산 사슬을 거꾸로": () => [opChainExample({ id: "rev-chain-1", title: "예제 1", start: 4, ops: [["×", 4], ["−", 6], ["÷", 2]] }), opChainExample({ id: "rev-chain-2", title: "예제 2", start: 4, ops: [["+", 7], ["×", 2], ["−", 4], ["÷", 3]] })],
    "가진 만큼 주고 난 뒤": () => [giveExample({ id: "give-fwd-1", title: "예제 1", a: 13, b: 5, moves: [{ from: "A", to: "B", n: "have" }], ask: "end" })],
    "가진 만큼 주기 거꾸로": () => [giveExample({ id: "give-rev-1", title: "예제 1", a: 24, b: 8, moves: [{ from: "A", to: "B", n: "have" }] })],
    "두 번 주고받기 거꾸로": () => [giveExample({ id: "give-two-1", title: "예제 1", a: 11, b: 7, moves: [{ from: "A", to: "B", n: "have" }, { from: "B", to: "A", n: 5 }] })],
    "서로 가진 만큼 주기 거꾸로": () => [giveExample({ id: "give-each-1", title: "예제 1", a: 25, b: 15, moves: [{ from: "A", to: "B", n: "have" }, { from: "B", to: "A", n: "have" }] })]
  }
};

// ───────────────────────── 10권 곱셈을 칸으로 나누어 계산 ─────────────────────────
// 곱해지는 수를 몇십과 몇으로 나누어 칸(열)을 만들고, 곱하는 수도 두 자리면 몇십과 몇으로 나누어 줄(행)을 만든다.
// 칸마다 곱하고 모두 더한다(그림 kind "split-box").
const placeParts = (n) => String(n).split("").map((d, i, a) => Number(d) * 10 ** (a.length - 1 - i)).filter(Boolean);
// 수 뒤 「으로/로」: 받침 없음(2·4·5·9)과 ㄹ 받침(1·7·8)은 「로」, 삼·육·십·백은 「으로」
const numEuro = (n) => `${n}${/[036]$/u.test(String(n)) ? "으로" : "로"}`;
const partsText = (ps) => `${ps.slice(0, -1).map((p) => josa(p, "과")).join(" ")} ${numEuro(ps.at(-1))}`.trim();
function splitBoxExample({ id, title, first, second, splitSecond = false }) {
  const cols = placeParts(first), rows = splitSecond ? placeParts(second) : [second];
  const cells = rows.map((r) => cols.map((c) => c * r)), all = cells.flat(), total = all.reduce((a, b) => a + b, 0);
  if (total !== first * second) throw new Error(`${id}: 칸의 합이 곱과 다름`);
  const fig = (tone, show) => ({ kind: "split-box", first, second, cols, rows, cells: show ? cells : null, total: show === "total" ? total : null, tone });
  const steps = [
    { text: `${josa(first, "을")} ${partsText(cols)} 나눠 칸을 만들어요.`, figure: fig("doing", null) },
    ...(splitSecond ? [{ text: `곱하는 수 ${second}도 ${partsText(rows)} 나눠 줄을 만들어요.`, figure: fig("doing", null) }] : []),
    { text: `칸마다 곱해요. ${rows.flatMap((r) => cols.map((c) => `${c} × ${r} = ${c * r}`)).join(", ")}.`, figure: fig("doing", "cells") },
    { text: `칸을 모두 더하면 ${all.join(" + ")} = ${josa(total, "이에요")}.`, figure: fig("check", "total") }
  ];
  return { id, title, problem: `${first} × ${josa(second, "을")} 칸으로 나누어 계산해요.`, figure: fig("given", null), steps, answer: `${first} × ${second} = ${josa(total, "이에요")}.`, value: { first, second, total, cols, rows } };
}
const SPLIT_SET = {
  id: "split-box",
  types: {
    "(두 자리 수) × (한 자리 수)": () => [splitBoxExample({ id: "split-1x-1", title: "예제 1", first: 26, second: 4 }), splitBoxExample({ id: "split-1x-2", title: "예제 2", first: 57, second: 8 })],
    "(두 자리 수) × (몇십)": () => [splitBoxExample({ id: "split-10x-1", title: "예제 1", first: 36, second: 40 }), splitBoxExample({ id: "split-10x-2", title: "예제 2", first: 65, second: 20 })],
    "곱하는 수도 나누어 곱하기": () => [splitBoxExample({ id: "split-2x-1", title: "예제 1", first: 34, second: 52, splitSecond: true }), splitBoxExample({ id: "split-2x-2", title: "예제 2", first: 48, second: 73, splitSecond: true })]
  }
};

// ───────────────────────── 1·2·8권 주고받아 같게 만들기 ─────────────────────────
// 많은 쪽이 차의 반만큼 주면 같아진다(한 번 주면 차가 그 두 배만큼 줄어든다). 그림 kind "equal-bars".
// 세 사람의 차는 기준 사람에게서 얼마나 더 많은지를 수직선 꺾쇠로(kind "dist-line" 재사용), 나이 차는 표(kind "age-rows").
function equalizeExample({ id, title, big, small, names = ["A", "B"], unit = "개", style = "story" }) {
  const d = big - small;
  if (d <= 0 || d % 2) throw new Error(`${id}: 차가 짝수가 아님`);
  const g = d / 2, [P, Q] = names;
  const fig = (tone, extra = {}) => ({ kind: "equal-bars", names, big, small, unit, tone, ...extra });
  const steps = [
    { text: `${josa(P, "이")} ${Q}보다 ${big} − ${small} = ${d}${unit} 더 많아요.`, figure: fig("doing", { diff: true }) },
    { text: `차를 반으로 나눠요. ${d} ÷ 2 = ${g}${unit}. 이만큼을 ${style === "plates" ? `${Q}로 옮기면` : `${Q}에게 주면`} 둘 다 ${josa(`${small + g}${unit}`, "이")} 돼요.`, figure: fig("check", { diff: true, move: g }) }
  ];
  const problem = style === "plates" ? `두 접시에 ${big}${unit}, ${small}${unit}가 있어요. 몇 ${unit}를 옮겨야 두 접시가 같아질까요?`.replace(`${small}${unit}가`, josa(`${small}${unit}`, "이")).replace(`몇 ${unit}를`, `몇 ${josa(unit, "을")}`)
    : `${josa(P, "은")} ${big}${unit}, ${josa(Q, "은")} ${small}${unit}를 가지고 있어요. ${josa(P, "이")} ${Q}에게 몇 ${unit}를 주어야 같아질까요?`.replace(`${small}${unit}를`, josa(`${small}${unit}`, "을")).replace(`몇 ${unit}를`, `몇 ${josa(unit, "을")}`);
  return { id, title, problem, figure: fig("given"), steps, answer: style === "plates" ? `${g}${josa(unit, "을")} 옮기면 같아져요.` : `${g}${josa(unit, "을")} 주면 같아져요.`, value: { give: g, big, small } };
}
// 지금 나이와 N년 뒤 나이: 둘 다 해마다 1살씩 먹으니 나이 차는 그대로
function ageGapExample({ id, title, older, younger, years }) {
  const gap = older - younger;
  const fig = (tone, show) => ({ kind: "age-rows", rows: [["지금", older, younger], [`${years}년 뒤`, show ? older + years : null, show ? younger + years : null]], gap: show === "gap" ? gap : null, tone });
  const steps = [
    { text: `지금 나이 차는 ${older} − ${younger} = ${gap}살이에요.`, figure: fig("doing", false) },
    { text: `${years}년이 지나면 형은 ${older} + ${years} = ${older + years}살, 동생은 ${younger} + ${years} = ${younger + years}살이에요.`, figure: fig("doing", true) },
    { text: `둘 다 ${years}살씩 똑같이 먹어서 차는 ${older + years} − ${younger + years} = ${gap}살, 그대로예요.`, figure: fig("check", "gap") }
  ];
  return { id, title, problem: `형은 ${older}살, 동생은 ${younger}살이에요. ${years}년 뒤 형은 동생보다 몇 살 더 많을까요?`, figure: fig("given", false), steps, answer: `${gap}살 더 많아요.`, value: { gap, older, younger, years } };
}
// 세 사람: 기준(base)보다 각각 몇 개 더 많은지 주고, 둘 사이의 차(또는 같게 하려면 줄 개수)를 묻는다
function threePeopleExample({ id, title, base, more, ask, give = false }) {
  // more: { A: 2, C: 10 } — base보다 더 가진 개수. ask: ["A", "C"] — 둘 중 많은 쪽이 뒤
  const pos = { [base]: 0, ...more };
  const [lo, hi] = ask[0] === base ? ask : [...ask].sort((x, y) => pos[x] - pos[y]);
  const d = pos[hi] - pos[lo];
  if (give && d % 2) throw new Error(`${id}: 차가 홀수`);
  const pts = Object.fromEntries(Object.entries(pos).sort((a, b) => a[1] - b[1]));
  const arcs = (showAsk, tone) => ({ kind: "dist-line", points: Object.entries(pts).map(([label, at]) => ({ label, at })), arcs: [...Object.entries(more).map(([k, n]) => ({ from: base, to: k, label: `${n}개`, side: "under" })), ...(showAsk ? [{ from: lo, to: hi, label: showAsk === true ? "?" : showAsk, side: "over", ask: true }] : [])], tone });
  const steps = [
    { text: `${josa(base, "을")} 기준으로 줄 세워요. ${Object.entries(more).map(([k, n]) => `${josa(k, "은")} ${base}보다 ${n}개`).join(", ")} 많아요.`, figure: arcs(true, "doing") },
    { text: `${josa(hi, "은")} ${lo}보다 ${pos[hi]} − ${pos[lo]} = ${d}개 많아요.`, figure: arcs(`${d}개`, give ? "doing" : "check") }
  ];
  if (give) steps.push({ text: `같아지려면 차의 반을 줘요. ${d} ÷ 2 = ${d / 2}개.`, figure: arcs(`${d}개`, "check") });
  const rel = Object.entries(more).map(([k, n]) => `${josa(k, "은")} ${base}보다 ${n}개 더`).join(", ");
  const problem = give
    ? `구슬을 ${rel} 가지고 있어요. ${josa(hi, "이")} ${lo}에게 몇 개를 주어야 둘이 같아질까요?`
    : `구슬을 ${rel} 가지고 있어요. ${josa(hi, "은")} ${lo}보다 몇 개 더 많을까요?`;
  return { id, title, problem, figure: arcs(true, "given"), steps, answer: give ? `${d / 2}개를 주면 같아져요.` : `${d}개 더 많아요.`, value: { pos, lo, hi, d, give } };
}
const EQUALIZE_SET = {
  id: "equalize",
  types: {
    "같아지도록 주기": () => [equalizeExample({ id: "eq1-1", title: "예제 1", big: 11, small: 3 }), equalizeExample({ id: "eq1-2", title: "예제 2", big: 38, small: 14 })],
    "주고받아 같게 만들기": () => [equalizeExample({ id: "eq2-1", title: "예제 1", big: 18, small: 8 }), equalizeExample({ id: "eq2-2", title: "예제 2", big: 33, small: 9 })],
    "두 접시를 같게": () => [equalizeExample({ id: "eq8-1", title: "예제 1", big: 26, small: 12, names: ["왼쪽 접시", "오른쪽 접시"], style: "plates" })],
    "합과 차로 두 수 찾기": () => [circleExample({ id: "eq-sd-1", title: "예제 1", a: 1, b: 1, extra: 4, unit: 8, given: "sum", names: ["B", "A"], ask: 1, story: ({ sum }) => `구슬이 모두 ${sum}개이고 A가 B보다 4개 더 많아요. A의 구슬은 몇 개일까요?` })],
    "시간이 지나도 같은 나이 차": () => [ageGapExample({ id: "age-1", title: "예제 1", older: 12, younger: 7, years: 15 })],
    "세 사람의 차": () => [threePeopleExample({ id: "three-1", title: "예제 1", base: "B", more: { A: 3, C: 11 }, ask: ["A", "C"] })],
    "세 사람 중 두 사람을 같게": () => [threePeopleExample({ id: "three-give-1", title: "예제 1", base: "A", more: { C: 6, B: 14 }, ask: ["C", "B"], give: true })]
  }
};

// ───────────────────────── 5·7권 달력 ─────────────────────────
// 같은 요일은 7일마다 돌아온다. 달력에서 바로 아래 칸은 7, 두 칸 아래는 14, 오른쪽 아래 칸은 8 큰 수.
// 날짜 차를 7일씩 묶고 남는 날만큼 요일을 옮긴다. 윤년이 아닌 해(2월 28일)만 쓴다.
// 그림: kind "cal-grid"(한 달 달력, start = 1일의 요일 0~6), "month-days"(열두 달 날짜 수), "day-ladder"(날짜 → 요일 사다리).
const WD = ["일", "월", "화", "수", "목", "금", "토"];
const wdName = (i) => `${WD[((i % 7) + 7) % 7]}요일`;
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const md = (m) => MONTH_DAYS[m - 1];
const dateName = (m, d) => `${m}월 ${d}일`;
const restText = (n) => (n < 7 ? `${n}일` : `${n}일 = 7일 × ${Math.floor(n / 7)}${n % 7 ? ` + ${n % 7}일` : ""}`);
// 7일씩 묶고 남은 r일만큼 옮긴다. r = 0이면 같은 요일
const dayMoveText = (n, from, to) => (n % 7 ? `7일씩은 같은 요일로 돌아오니 ${n % 7}일만 옮겨요. ${wdName(from)}에서 ${n % 7}일 뒤는 ${wdName(to)}.` : `7일씩 꼭 맞게 묶여 남는 날이 없어요. 그래서 ${wdName(from)} 그대로예요.`);
const calCell = (start, d) => ({ r: Math.floor((start + d - 1) / 7), c: (start + d - 1) % 7 });
const CAL_GAP = {
  7: ["위 칸", "아래 칸", "바로 아래 칸은 일주일 뒤라 7 큰 수예요."],
  14: ["위 칸", "아래 칸", "두 칸 아래는 2주일 뒤라 14 큰 수예요."],
  8: ["왼쪽 위 칸", "오른쪽 아래 칸", "오른쪽 아래 칸은 일주일 하고 하루 뒤라 8 큰 수예요."]
};
function calCellsExample({ id, title, month, start, small, gap }) {
  const big = small + gap, S = small + big, days = md(month);
  if (big > days || (gap === 8 && calCell(start, small).c === 6)) throw new Error(`${id}: 달력 밖`);
  const [nTop, nBottom, why] = CAL_GAP[gap];
  const fig = (tone, show) => ({ kind: "cal-grid", title: `${month}월`, start, days, show: show ? "all" : [], marks: { [small]: show ? "on" : "?", [big]: show ? "on" : "?" }, tone });
  const steps = [
    { text: why, figure: fig("doing", false) },
    { text: `합에서 그 차를 빼면 두 수가 같아져요. ${S} − ${gap} = ${S - gap}.`, figure: fig("doing", false) },
    { text: `반으로 나누면 ${nTop}이 나와요. ${S - gap} ÷ 2 = ${small}, ${nBottom}은 ${small} + ${gap} = ${big}. 더하면 ${small} + ${big} = ${S}, 맞아요.`, figure: fig("check", true) }
  ];
  return { id, title, problem: `${month}월 달력에서 색칠한 두 칸의 수를 더하면 ${josa(S, "이에요")}. 두 수를 구해요.`, figure: fig("given", false), steps, answer: `${josa(small, "과")} ${josa(big, "이에요")}.`, value: { kind: "cells", month, start, small, big, gap, sum: S } };
}
// 열두 달의 날짜 수. ask: { from, to } = 그 달들의 날짜 합, { count: 30 } = 30일까지 있는 달의 수
function monthDaysExample({ id, title, ask }) {
  const months = ask.count ? MONTH_DAYS.map((n, i) => (n === ask.count ? i + 1 : 0)).filter(Boolean) : Array.from({ length: ask.to - ask.from + 1 }, (_, i) => ask.from + i);
  const fig = (tone, show) => ({ kind: "month-days", show, on: show === "on" ? months : [], tone });
  const steps = [
    { text: "주먹을 쥐고 손등의 뼈와 골을 차례로 짚어요. 튀어나온 뼈는 31일, 들어간 골은 30일, 2월만 28일이에요.", figure: fig("doing", "all") },
    ask.count
      ? { text: `${ask.count}일까지 있는 달을 찾아요. ${months.map((m) => `${m}월`).join(", ")}.`, figure: fig("check", "on") }
      : { text: `${months.map((m) => `${m}월 ${md(m)}일`).join(", ")}. 더하면 ${months.map(md).join(" + ")} = ${sum(months.map(md))}일.`, figure: fig("check", "on") }
  ];
  const problem = ask.count ? `1년 열두 달 중에서 ${ask.count}일까지 있는 달은 몇 개일까요?` : `어느 해 ${ask.from}월 1일부터 ${ask.to}월 마지막 날까지는 모두 며칠일까요?`;
  return { id, title, problem, figure: fig("given", "none"), steps, answer: ask.count ? `${months.length}개예요.` : `모두 ${sum(months.map(md))}일이에요.`, value: { kind: "months", ask, months, total: ask.count ? months.length : sum(months.map(md)) } };
}
// 1일의 요일을 알 때: 같은 요일 날짜 모두(wd) 또는 어느 날짜(day)의 요일
function sameWeekdayExample({ id, title, month, start, wd }) {
  const days = md(month), first = 1 + ((wd - start + 7) % 7);
  const list = []; for (let d = first; d <= days; d += 7) list.push(d);
  const fig = (tone, show, marks = {}) => ({ kind: "cal-grid", title: `${month}월`, start, days, show, marks, tone });
  const steps = [
    { text: first === 1 ? `1일이 바로 ${josa(wdName(wd), "이에요")}.` : `1일이 ${wdName(start)}이라 ${wdName(wd)}까지 ${first - 1}일 더 가요. 첫째 ${wdName(wd)}은 1 + ${first - 1} = ${first}일.`, figure: fig("doing", [1], { [first]: "on" }) },
    { text: `같은 요일은 7일마다 와요. ${list.join(" → ")}.`, figure: fig("doing", [1, ...list], Object.fromEntries(list.map((d) => [d, "on"]))) },
    { text: `${month}월은 ${days}일까지라 ${list.at(-1)} + 7 = ${list.at(-1) + 7}일은 없어요.`, figure: fig("check", "all", Object.fromEntries(list.map((d) => [d, "on"]))) }
  ];
  return { id, title, problem: `어느 해 ${month}월 1일은 ${josa(wdName(start), "이에요")}. 이 달의 ${wdName(wd)} 날짜를 모두 써요.`, figure: fig("given", [1]), steps, answer: `${list.map((d) => `${d}일`).join(", ")}이에요.`, value: { kind: "list", month, start, wd, list } };
}
function dayOfMonthExample({ id, title, month, start, day }) {
  const diff = day - 1, q = Math.floor(diff / 7), r = diff % 7, wd = (start + r) % 7;
  const sames = Array.from({ length: q + 1 }, (_, i) => 1 + 7 * i);
  const fig = (tone, show, marks = {}) => ({ kind: "cal-grid", title: `${month}월`, start, days: md(month), show, marks, tone });
  const steps = [
    { text: `7일마다 같은 요일이에요. ${sames.map((d) => `${d}일`).join(", ")}은 모두 ${wdName(start)}.`, figure: fig("doing", sames, { [day]: "?" }) },
    { text: `${sames.at(-1)}일에서 ${day}일까지 ${r}일 더 가요. ${wdName(start)}에서 ${r}일 옮기면 ${wdName(wd)}.`, figure: fig("check", "all", { [day]: "on" }) }
  ];
  if (r === 0) steps[1].text = `${day}일은 바로 ${sames.at(-1)}일이라 같은 요일이에요.`;
  return { id, title, problem: `어느 해 ${month}월 1일은 ${josa(wdName(start), "이에요")}. ${month}월 ${josa(`${day}일`, "은")} 무슨 요일일까요?`, figure: fig("given", [1], { [day]: "?" }), steps, answer: `${josa(wdName(wd), "이에요")}.`, value: { kind: "weekday", from: { m: month, d: 1, wd: start }, to: { m: month, d: day }, wd } };
}
// 같은 요일 두 날짜(nth째와 nth+1째)의 합으로 달력을 찾는다. ask: { nth, wd } = 날짜, { day } = 그 날의 요일(day가 달의 날 수보다 크면 다음 달)
const NTH = ["", "첫째", "둘째", "셋째", "넷째", "다섯째"];
function sumWeekExample({ id, title, month, wd, nth, sum: S, ask }) {
  const x = (S - 7) / 2, first = x - 7 * (nth - 1), start = ((wd - (first - 1)) % 7 + 7) % 7, days = md(month);
  if (!Number.isInteger(x) || first < 1 || first > 7) throw new Error(`${id}: 합이 맞지 않음`);
  const fig = (tone, show, marks) => ({ kind: "cal-grid", title: `${month}월`, start, days, show, marks, tone });
  const pairMarks = { [x]: "on", [x + 7]: "on" };
  const steps = [
    { text: `두 ${wdName(wd)}은 7일 차이예요. ${S} − 7 = ${S - 7}, 반으로 나누면 ${S - 7} ÷ 2 = ${x}. ${NTH[nth]} ${wdName(wd)}은 ${x}일, ${NTH[nth + 1]}는 ${x + 7}일.`, figure: fig("doing", [x, x + 7], pairMarks) }
  ];
  let answer, value;
  if (ask.wd !== undefined) {
    if (nth > 1) steps.push({ text: `7일씩 거슬러 가면 첫째 ${wdName(wd)}은 ${first}일.`, figure: fig("doing", [first, x, x + 7], { ...pairMarks, [first]: "on" }) });
    const ahead = (ask.wd - wd + 7) % 7;
    let f = first + ahead; const before = f > 7;
    if (before) f -= 7;
    const target = f + 7 * (ask.nth - 1);
    steps.push({ text: before ? `${first}일 ${wdName(wd)}에서 ${7 - ahead}일 앞으로 가면 ${f}일이 ${wdName(ask.wd)}이라 그날이 첫째예요.` : `${first}일 ${wdName(wd)}에서 ${ahead}일 뒤 ${f}일이 ${wdName(ask.wd)}이에요. 그보다 7일 앞은 ${f - 7}일이라 없으니 ${f}일이 첫째예요.`, figure: fig("doing", [f, x, x + 7], { ...pairMarks, [f]: "?" }) });
    if (ask.nth > 1) steps.push({ text: `7일씩 더하면 ${NTH[ask.nth]} ${wdName(ask.wd)}은 ${f} + ${7 * (ask.nth - 1)} = ${target}일.`, figure: fig("check", "all", { [target]: "on" }) });
    else steps.at(-1).figure = fig("check", "all", { [target]: "on" });
    answer = `${NTH[ask.nth]} ${josa(wdName(ask.wd), "은")} ${target}일이에요.`;
    value = { kind: "sum-date", month, wd, nth, sum: S, ask, target };
  } else {
    const next = ask.day > days, dayLabel = next ? dateName(month === 12 ? 1 : month + 1, ask.day - days) : dateName(month, ask.day);
    const diff = ask.day - x, r = diff % 7, res = (wd + r) % 7;
    steps.push(next
      ? { text: `${month}월은 ${days}일까지라 ${josa(dayLabel, "은")} ${month}월 ${ask.day}일로 이어 세요. ${x}일부터 ${diff}일 뒤예요.`, figure: fig("doing", "all", pairMarks) }
      : { text: `${x}일부터 ${ask.day}일까지 ${diff}일이에요.`, figure: fig("doing", "all", { ...pairMarks, [ask.day]: "?" }) });
    steps.push({ text: `${restText(diff)}. ${dayMoveText(diff, wd, res)}`, figure: fig("check", "all", next ? pairMarks : { ...pairMarks, [ask.day]: "on" }) });
    answer = `${josa(dayLabel, "은")} ${josa(wdName(res), "이에요")}.`;
    value = { kind: "sum-day", month, wd, nth, sum: S, ask, res };
  }
  const askText = ask.wd !== undefined ? `이 달의 ${NTH[ask.nth]} ${josa(wdName(ask.wd), "은")} 며칠일까요?` : `${josa(ask.day > days ? dateName(month === 12 ? 1 : month + 1, ask.day - days) : dateName(month, ask.day), "은")} 무슨 요일일까요?`;
  return { id, title, problem: `어느 해 ${month}월의 ${NTH[nth]} ${wdName(wd)}과 ${NTH[nth + 1]} ${wdName(wd)} 날짜를 더하면 ${josa(S, "이에요")}. ${askText}`, figure: fig("given", [], {}), steps, answer, value };
}
// 날짜를 옮겨 요일 찾기. via: "count" = 날짜 차를 한 번에, "month" = 한 달씩 차례로 옮긴 뒤 남은 날
function weekdayShiftExample({ id, title, from, to, wd, via = "count" }) {
  const days = (a, b) => { let n = 0, m = a.m, d = a.d; while (m !== b.m) { n += md(m) - d + 1; d = 1; m = m % 12 + 1; } return n + b.d - d; };
  const rows = [{ label: dateName(from.m, from.d), day: WD[wd] }], gaps = [], steps = [];
  const fig = (tone, filled) => ({ kind: "day-ladder", rows: rows.slice(0, filled + 1).concat(filled + 1 < rows.length ? rows.slice(filled + 1).map((r) => ({ ...r, day: null })) : []), gaps: gaps.slice(0, filled), tone });
  let cur = wd;
  if (via === "month") {
    steps.push({ text: "한 달 뒤 같은 날은 그 달의 날 수만큼 뒤예요. 28일은 7일 × 4라 같은 요일로 돌아오니, 28일보다 많은 날만 옮겨요.", idx: 0 });
    let m = from.m;
    while (m !== to.m) {
      const n = md(m), r = n % 7, prev = cur; cur = (cur + r) % 7; const nm = m % 12 + 1;
      rows.push({ label: dateName(nm, from.d), day: WD[cur] }); gaps.push(`${n}일 = 28일 + ${r}일 → ${r}일 옮겨요`);
      steps.push({ text: `${m}월은 ${n}일까지예요. ${n}일 = 28일 + ${r}일이라 ${wdName(prev)}에서 ${r}일 옮기면 ${dateName(nm, from.d)}은 ${wdName(cur)}.`, idx: rows.length - 1 });
      m = nm;
    }
    if (to.d !== from.d) {
      const n = to.d - from.d, prev = cur; cur = (cur + n % 7) % 7;
      rows.push({ label: dateName(to.m, to.d), day: WD[cur] }); gaps.push(`${n}일 → ${n % 7}일 옮겨요`);
      steps.push({ text: `${dateName(to.m, from.d)}에서 ${dateName(to.m, to.d)}까지 ${restText(n)}. ${dayMoveText(n, prev, cur)}`, idx: rows.length - 1 });
    }
  } else {
    const n = days(from, to), r = n % 7; cur = (wd + r) % 7;
    rows.push({ label: dateName(to.m, to.d), day: WD[cur] }); gaps.push(`${restText(n)} → ${r}일 옮겨요`);
    if (from.m !== to.m) {
      const left = md(from.m) - from.d;
      steps.push({ text: `${from.m}월은 ${md(from.m)}일까지예요. ${dateName(from.m, from.d)}에서 ${from.m}월 ${md(from.m)}일까지 ${left}일, 거기서 ${dateName(to.m, to.d)}까지 ${to.d}일 더 가요. 모두 ${left} + ${to.d} = ${n}일.`, idx: 0 });
    } else steps.push({ text: `${dateName(from.m, from.d)}부터 ${dateName(to.m, to.d)}까지 ${to.d} − ${from.d} = ${n}일이에요.`, idx: 0 });
    steps.push({ text: `${restText(n)}. ${dayMoveText(n, wd, cur)}`, idx: 1 });
  }
  const last = steps.length - 1;
  const outSteps = steps.map((s, i) => ({ text: s.text, figure: fig(i === last ? "check" : "doing", s.idx) }));
  return { id, title, problem: `어느 해 ${dateName(from.m, from.d)}은 ${josa(wdName(wd), "이에요")}. 같은 해 ${josa(dateName(to.m, to.d), "은")} 무슨 요일일까요?`, figure: fig("given", 0), steps: outSteps, answer: `${josa(wdName(cur), "이에요")}.`, value: { kind: "weekday", from: { ...from, wd }, to, wd: cur } };
}
const CALENDAR_SET = {
  id: "calendar",
  types: {
    "합과 차로 두 수 찾기": () => [
      circleExample({ id: "cal-sd-1", title: "예제 1", a: 1, b: 1, extra: 7, unit: 9, given: "sum" }),
      circleExample({ id: "cal-sd-2", title: "예제 2", a: 1, b: 1, extra: 10, unit: 12, given: "sum" })
    ],
    "달력 위아래 두 칸": () => [calCellsExample({ id: "cal-v-1", title: "예제 1", month: 5, start: 3, small: 9, gap: 7 }), calCellsExample({ id: "cal-v-2", title: "예제 2", month: 10, start: 0, small: 13, gap: 7 })],
    "달력 두 주 차이 두 칸": () => [calCellsExample({ id: "cal-2w-1", title: "예제 1", month: 3, start: 2, small: 8, gap: 14 })],
    "달력 대각선 두 칸": () => [calCellsExample({ id: "cal-dg-1", title: "예제 1", month: 8, start: 4, small: 13, gap: 8 })],
    "각 월의 날짜 수": () => [monthDaysExample({ id: "cal-md-1", title: "예제 1", ask: { from: 4, to: 6 } }), monthDaysExample({ id: "cal-md-2", title: "예제 2", ask: { count: 30 } })],
    "같은 요일 날짜": () => [sameWeekdayExample({ id: "cal-same-1", title: "예제 1", month: 9, start: 4, wd: 2 })],
    "날짜의 요일": () => [dayOfMonthExample({ id: "cal-dom-1", title: "예제 1", month: 6, start: 4, day: 25 })],
    "합으로 날짜 찾기": () => [sumWeekExample({ id: "cal-sum-d-1", title: "예제 1", month: 3, wd: 6, nth: 2, sum: 29, ask: { nth: 1, wd: 2 } })],
    "합으로 요일 찾기": () => [
      sumWeekExample({ id: "cal-sum-w-1", title: "예제 1", month: 6, wd: 5, nth: 1, sum: 15, ask: { day: 20 } }),
      sumWeekExample({ id: "cal-sum-w-2", title: "예제 2", month: 3, wd: 0, nth: 3, sum: 43, ask: { day: 32 } })
    ],
    "한 달 안에서 요일": () => [weekdayShiftExample({ id: "cal-in-1", title: "예제 1", from: { m: 5, d: 3 }, to: { m: 5, d: 27 }, wd: 2 }), weekdayShiftExample({ id: "cal-in-2", title: "예제 2", from: { m: 10, d: 2 }, to: { m: 10, d: 30 }, wd: 0 })],
    "한 달 뒤 같은 날": () => [weekdayShiftExample({ id: "cal-next-1", title: "예제 1", from: { m: 4, d: 10 }, to: { m: 5, d: 10 }, wd: 3, via: "month" }), weekdayShiftExample({ id: "cal-next-2", title: "예제 2", from: { m: 8, d: 5 }, to: { m: 9, d: 5 }, wd: 1, via: "month" })],
    "한 달 이상 지난 요일": () => [weekdayShiftExample({ id: "cal-multi-1", title: "예제 1", from: { m: 3, d: 1 }, to: { m: 6, d: 1 }, wd: 5, via: "month" }), weekdayShiftExample({ id: "cal-multi-2", title: "예제 2", from: { m: 6, d: 5 }, to: { m: 8, d: 20 }, wd: 2, via: "month" })],
    "날짜와 요일 확인": () => [weekdayShiftExample({ id: "cal-cross-1", title: "예제 1", from: { m: 1, d: 27 }, to: { m: 2, d: 9 }, wd: 5 }), weekdayShiftExample({ id: "cal-cross-2", title: "예제 2", from: { m: 9, d: 24 }, to: { m: 10, d: 12 }, wd: 0 })]
  }
};

// ───────────────────────── 5권 사각수 · 삼각수 · 삼각 계단 쌓기나무 ─────────────────────────
// 사각수 = 1부터 홀수 n개의 합 = n × n(점 네모가 한 겹 커질 때 홀수만큼 는다). 삼각수 = 1부터 n까지의 합(점 세모가 한 줄씩 는다).
// 악수·가위바위보·선분·두 장 뽑기는 한 사람(점·카드)씩 들어오며 1, 2, 3…번씩 늘어나 삼각수가 된다.
// 그림: kind "dots"(점 네모/세모) · "seq" · "stone-rows" · "hand" · "fan" · "odd-rows" · "tri-layers". 1부터의 합은 연속수 그림("consec")을 그대로 쓴다.
const tri = (n) => (n * (n + 1)) / 2;
// 「7 × 7이라」·「2 × 2니까」: 받침이 있으면 이라/이니까
const ira = (w, tail = "라") => (josa(w, "이").endsWith("이") ? `${w}이${tail}` : `${w}${tail}`);
const oddList = (k) => Array.from({ length: k }, (_, i) => 2 * i + 1);
const oddSumText = (k) => (k <= 5 ? oddList(k).join(" + ") : `1 + 3 + 5 + … + ${2 * k - 1}`);
function squareNumberExample({ id, title, n, ask = "value" }) {
  const steps = [
    { text: "점을 네모로 놓으면 1개, 1 + 3개, 1 + 3 + 5개예요. 한 겹 키울 때마다 홀수만큼 늘어요.", figure: { kind: "dots", shape: "square", n: 3, hi: 3, tone: "doing", caption: "1 + 3 + 5 = 3 × 3" } },
    { text: `홀수 ${n}개를 더하면 점이 가로 ${n}줄, 세로 ${n}줄인 네모가 돼요.`, figure: { kind: "dots", shape: "square", n, tone: "doing" } },
    { text: `그래서 □${n} = ${n} × ${n} = ${n * n}.`, figure: { kind: "dots", shape: "square", n, tone: "check", caption: `${n} × ${n} = ${n * n}` } }
  ];
  const problem = ask === "same" ? `1부터 홀수를 ${n}개 더한 합을 □${josa(n, "이")}라고 해요. □${josa(n, "은")} 어떤 수를 두 번 곱한 것과 같을까요?` : `1부터 연속한 홀수의 합 □1 = 1, □2 = 1 + 3, □3 = 1 + 3 + 5…를 사각수라고 해요. □${josa(n, "은")} 얼마일까요?`;
  return { id, title, problem, figure: { kind: "dots", shape: "square", n: 3, tone: "given", caption: "1 + 3 + 5" }, steps, answer: ask === "same" ? `□${josa(n, "은")} ${n} × ${josa(n, "과")} 같아요. ${josa(n * n, "이에요")}.` : `□${josa(n, "은")} ${josa(n * n, "이에요")}.`, value: { kind: "square", n, total: n * n } };
}
function squareGrowExample({ id, title, n }) {
  const add = 2 * n - 1;
  const steps = [
    { text: `${n}번째 모양은 ${n - 1}번째 네모에 오른쪽 세로줄과 아래 가로줄을 한 겹 더 둘러요.`, figure: { kind: "dots", shape: "square", n, hi: n, tone: "doing" } },
    { text: `세로줄 ${n}개와 가로줄 ${n}개인데 모서리 점은 두 줄이 함께 써요. ${n} + ${n} − 1 = ${add}개.`, figure: { kind: "dots", shape: "square", n, hi: n, tone: "doing", caption: `${n} + ${n} − 1` } },
    { text: `점 수로 확인해요. ${n} × ${n} − ${n - 1} × ${n - 1} = ${n * n} − ${(n - 1) ** 2} = ${add}, ${n}번째 홀수예요.`, figure: { kind: "dots", shape: "square", n, hi: n, tone: "check", caption: `${n * n} − ${(n - 1) ** 2}` } }
  ];
  return { id, title, problem: `점 네모가 한 겹씩 커져요. ${n - 1}번째 모양에서 ${n}번째 모양으로 갈 때 점은 몇 개 늘어날까요?`, figure: { kind: "dots", shape: "square", n: n - 1, tone: "given" }, steps, answer: `${add}개 늘어나요.`, value: { kind: "grow-square", n, add } };
}
function oddSumExample({ id, title, last }) {
  const k = (last + 1) / 2;
  const steps = [
    { text: `홀수가 몇 개인지 세요. ${last}에 1을 더해 반으로 나누면 (${last} + 1) ÷ 2 = ${k}개예요.`, figure: { kind: "dots", shape: "square", n: k, tone: "doing" } },
    { text: `1부터 홀수 ${k}개의 합은 점이 ${k}줄씩인 네모라 ${k} × ${k} = ${k * k}.`, figure: { kind: "dots", shape: "square", n: k, tone: "check", caption: `${k} × ${k}` } }
  ];
  return { id, title, problem: `1 + 3 + 5 + … + ${josa(last, "을")} 계산해요.`, figure: { kind: "seq", values: [1, 3, 5, 7], tone: "given", ask: last }, steps, answer: `합은 ${josa(k * k, "이에요")}.`, value: { kind: "odd-sum", last, total: k * k } };
}
function lastOddExample({ id, title, total }) {
  const k = Math.round(Math.sqrt(total)), last = 2 * k - 1;
  if (k * k !== total) throw new Error(`${id}: 사각수가 아님`);
  const steps = [
    { text: `1부터 홀수의 합은 사각수예요. ${total} = ${k} × ${ira(k)} 홀수를 ${k}개 더했어요.`, figure: { kind: "dots", shape: "square", n: k, tone: "doing", caption: `${k} × ${k} = ${total}` } },
    { text: `${k}번째 홀수는 ${k} × 2 − 1 = ${last}.`, figure: { kind: "dots", shape: "square", n: k, hi: k, tone: "check", caption: `맨 바깥 겹 ${last}개` } }
  ];
  return { id, title, problem: `1 + 3 + 5 + … + □ = ${total}에서 □에 알맞은 홀수를 구해요.`, figure: { kind: "seq", values: [1, 3, 5], tone: "given", ask: "□" }, steps, answer: `□는 ${josa(last, "이에요")}.`, value: { kind: "last-odd", total, last } };
}
// 사각수 수열(처음 수가 from × from)과 사각수를 더한 수열(1, 5, 14, 30…)
function squareSeqExample({ id, title, from, nth }) {
  const vals = Array.from({ length: 5 }, (_, i) => (from + i) ** 2), b = from + nth - 1;
  const steps = [
    { text: `수마다 같은 수를 두 번 곱한 수예요. ${vals.slice(0, 3).map((v, i) => `${v} = ${from + i} × ${from + i}`).join(", ")}.`, figure: { kind: "seq", values: vals, notes: vals.map((_, i) => `${from + i} × ${from + i}`), tone: "doing" } },
    { text: `1번째가 ${from} × ${ira(from, "니까")} ${nth}번째는 ${from} + ${nth} − 1 = ${josa(b, "을")} 두 번 곱해요. ${b} × ${b} = ${b * b}.`, figure: { kind: "seq", values: vals, notes: vals.map((_, i) => `${from + i} × ${from + i}`), tone: "check", ask: b * b } }
  ];
  return { id, title, problem: `${vals.join(", ")}, …처럼 수를 늘어놓을 때 ${nth}번째 수는 무엇일까요?`, figure: { kind: "seq", values: vals, tone: "given", ask: "?" }, steps, answer: `${nth}번째 수는 ${josa(b * b, "이에요")}.`, value: { kind: "seq", values: vals, nth, at: b * b } };
}
function squareSumSeqExample({ id, title, nth }) {
  const vals = [1, 5, 14, 30], all = Array.from({ length: nth }, (_, i) => sum(Array.from({ length: i + 1 }, (_, j) => (j + 1) ** 2)));
  const more = all.slice(vals.length);
  const steps = [
    { text: "늘어난 수를 봐요. 5 − 1 = 4, 14 − 5 = 9, 30 − 14 = 16. 늘어나는 수가 사각수예요.", figure: { kind: "seq", values: vals, diffs: [4, 9, 16], tone: "doing" } },
    { text: `다음은 ${more.map((_, i) => `${(vals.length + i + 1) ** 2}`).join(", ")}을 차례로 더해요. ${more.map((v, i) => `${i ? more[i - 1] : 30} + ${(vals.length + i + 1) ** 2} = ${v}`).join(", ")}.`, figure: { kind: "seq", values: all, diffs: all.slice(1).map((_, i) => (i + 2) ** 2), tone: "check" } }
  ];
  return { id, title, problem: `${vals.join(", ")}, …처럼 수를 늘어놓을 때 ${nth}번째 수는 무엇일까요?`, figure: { kind: "seq", values: vals, tone: "given", ask: "?" }, steps, answer: `${nth}번째 수는 ${josa(all.at(-1), "이에요")}.`, value: { kind: "sum-squares", nth, at: all.at(-1) } };
}
// 줄마다 홀수 개(1, 3, 5…)를 검은 줄·흰 줄로 번갈아 놓았다. 모두 total개일 때 검은 돌과 흰 돌의 차
function stoneRowsExample({ id, title, total }) {
  const n = Math.round(Math.sqrt(total)), rows = oddList(n);
  if (n * n !== total) throw new Error(`${id}: 사각수가 아님`);
  const black = rows.filter((_, i) => i % 2 === 0), white = rows.filter((_, i) => i % 2 === 1), B = sum(black), Wt = sum(white);
  const steps = [
    { text: `줄마다 홀수만큼 놓았으니 모두 합한 수는 사각수예요. ${total} = ${n} × ${n}이라 ${n}줄이에요.`, figure: { kind: "stone-rows", rows, tone: "doing" } },
    { text: `검은 줄은 ${plus(black)} = ${B}개, 흰 줄은 ${plus(white)} = ${Wt}개.`, figure: { kind: "stone-rows", rows, counts: true, tone: "doing" } },
    { text: `${B > Wt ? `${B} − ${Wt}` : `${Wt} − ${B}`} = ${Math.abs(B - Wt)}. ${B > Wt ? "검은" : "흰"} 돌이 더 많아요.`, figure: { kind: "stone-rows", rows, counts: true, tone: "check" } }
  ];
  return { id, title, problem: `맨 위 줄에 검은 돌 1개, 그 아래 줄에 흰 돌 3개, 그 아래 줄에 검은 돌 5개…로 번갈아 놓았어요. 모두 ${total}개일 때 검은 돌과 흰 돌은 몇 개 차이 날까요?`, figure: { kind: "stone-rows", rows: oddList(4), tone: "given" }, steps, answer: `${Math.abs(B - Wt)}개 차이 나요.`, value: { kind: "stones", total, black: B, white: Wt } };
}
function triangleGrowExample({ id, title, n }) {
  const steps = [
    { text: `점 세모는 한 번 커질 때 맨 아래에 한 줄이 생겨요. ${n}번째 모양의 맨 아래 줄은 점 ${n}개예요.`, figure: { kind: "dots", shape: "triangle", n, hi: n, tone: "doing" } },
    { text: `점 수로 확인해요. △${n} − △${n - 1} = ${tri(n)} − ${tri(n - 1)} = ${n}.`, figure: { kind: "dots", shape: "triangle", n, hi: n, tone: "check", caption: `${tri(n)} − ${tri(n - 1)}` } }
  ];
  return { id, title, problem: `점 세모가 한 줄씩 커져요. ${n - 1}번째 모양에서 ${n}번째 모양으로 갈 때 점은 몇 개 늘어날까요?`, figure: { kind: "dots", shape: "triangle", n: n - 1, tone: "given" }, steps, answer: `${n}개 늘어나요.`, value: { kind: "grow-tri", n, add: n } };
}
// 악수: who = 사람 이름들. mode "new" = 새로 온 사람의 악수 수, "total" = 모두 몇 번, "last" = 1 + 2 + … + □의 □
const PEOPLE = "ABCDEFGHIJKL".split("");
function handshakeExample({ id, title, n, mode, game = "악수" }) {
  const names = PEOPLE.slice(0, n), T = tri(n - 1), act = game === "악수" ? "악수를" : "가위바위보를";
  const chain = Array.from({ length: n - 1 }, (_, i) => i + 1);
  if (mode === "new") {
    const steps = [
      { text: `새로 온 ${josa(names.at(-1), "은")} 먼저 와 있던 사람마다 한 번씩 ${game}해요.`, figure: { kind: "hand", names, hi: n - 1, faint: true, tone: "doing" } },
      { text: `먼저 와 있던 사람은 ${names.slice(0, -1).join(", ")} ${n - 1}명이라 ${n - 1}번.`, figure: { kind: "hand", names, hi: n - 1, faint: true, tone: "check" } }
    ];
    return { id, title, problem: `${josa(names.slice(0, -1).join(", "), "이")} 서로 한 번씩 ${act} 했어요. ${josa(names.at(-1), "이")} 오면 ${josa(names.at(-1), "은")} 몇 번 ${act} 할까요?`, figure: { kind: "hand", names: names.slice(0, -1), all: true, tone: "given" }, steps, answer: `${n - 1}번 해요.`, value: { kind: "hand-new", n, count: n - 1 } };
  }
  const steps = [
    { text: `한 사람씩 들어온다고 생각해요. 2번째 사람은 1번, 3번째 사람은 2번, … ${n}번째 사람은 ${n - 1}번 ${game}해요.`, figure: { kind: "hand", names, hi: n - 1, faint: true, tone: "doing" } },
    { text: `모두 더하면 ${n - 1 <= 6 ? chain.join(" + ") : `1 + 2 + … + ${n - 1}`} = ${T}번이에요.`, figure: { kind: "hand", names, all: true, tone: "check" } }
  ];
  const problem = mode === "last" ? `${n}명이 서로 한 번씩 ${game}하면 횟수는 1 + 2 + 3 + … + □예요. □에 알맞은 수와 모두 몇 번인지 구해요.` : `${n}명이 서로 한 번씩 빠짐없이 ${act} 하면 모두 몇 번 할까요?`;
  return { id, title, problem, figure: { kind: "hand", names, tone: "given" }, steps, answer: mode === "last" ? `□는 ${n - 1}, 모두 ${T}번이에요.` : `모두 ${T}번이에요.`, value: { kind: "hand-total", n, last: mode === "last" ? n - 1 : undefined, total: T } };
}
// 모두 total번 → 1부터 더해 total이 되는 곳의 수 + 1
function handshakeReverseExample({ id, title, total, what = "people" }) {
  let k = 0; while (tri(k) < total) k++;
  if (tri(k) !== total) throw new Error(`${id}: 삼각수가 아님`);
  const run = Array.from({ length: k }, (_, i) => tri(i + 1));
  const unit = what === "people" ? "명" : "장";
  const steps = [
    { text: `${what === "people" ? "악수" : "두 장 뽑기"} 횟수는 1부터 차례로 더한 수예요. 더해 가며 ${josa(total, "이")} 되는 곳을 찾아요. ${run.join(", ")}.`, figure: { kind: "seq", values: run, diffs: run.slice(1).map((_, i) => i + 2), tone: "doing" } },
    { text: `1부터 ${k}까지 더하면 ${josa(total, "이에요")}. 마지막 ${what === "people" ? "사람은" : "카드는"} 앞의 ${k}${what === "people" ? "명과 악수했으니" : "장과 짝이 되었으니"} ${k} + 1 = ${k + 1}${unit}.`, figure: { kind: "seq", values: run, diffs: run.slice(1).map((_, i) => i + 2), tone: "check" } }
  ];
  const problem = what === "people" ? `몇 명의 학생이 서로 한 번씩 악수를 했더니 모두 ${total}번이었어요. 학생은 몇 명일까요?` : `서로 다른 숫자 카드 중에서 2장을 뽑는 방법이 ${total}가지예요. 숫자 카드는 모두 몇 장일까요?`;
  return { id, title, problem, figure: { kind: "seq", values: [1, 3, 6], tone: "given", ask: total }, steps, answer: `${k + 1}${unit}이에요.`, value: { kind: "hand-reverse", total, count: k + 1 } };
}
// 두 점을 잇는 선분 · 카드 두 장 뽑기 — 악수와 같은 셈
function pairCountExample({ id, title, n, what }) {
  const T = tri(n - 1), names = what === "cards" ? Array.from({ length: n }, (_, i) => String(i + 1)) : PEOPLE.slice(0, n);
  const one = what === "cards" ? "카드" : "점", cnt = what === "cards" ? "장" : "개";
  const steps = [
    { text: `${josa(names[0], "과")} 짝이 되는 ${josa(one, "은")} 나머지 ${n - 1}${cnt}예요. ${josa(names[1], "은")} ${josa(names[0], "과")}는 벌써 셌으니 ${n - 2}${cnt}, 그다음은 ${n - 3}${cnt}….`, figure: { kind: "hand", names, hi: 0, faint: true, tone: "doing" } },
    { text: `모두 ${n - 1} + ${n - 2} + … + 1 = ${T}. 악수 횟수와 같은 셈이에요.`, figure: { kind: "hand", names, all: true, tone: "check" } }
  ];
  const problem = what === "cards" ? `숫자 카드 ${n}장(1부터 ${n}까지) 중에서 서로 다른 2장을 뽑는 방법은 몇 가지일까요?` : `어느 세 점도 한 줄 위에 있지 않은 점 ${n}개가 있어요. 두 점을 이은 선분은 모두 몇 개일까요?`;
  return { id, title, problem, figure: { kind: "hand", names, tone: "given" }, steps, answer: what === "cards" ? `${T}가지예요.` : `${T}개예요.`, value: { kind: "pairs", n, total: T } };
}
// 부채꼴 삼각형: 꼭짓점에서 선을 그어 작은 삼각형 k칸. cross면 가로선이 하나 더 있어 띠가 둘
function fanExample({ id, title, k, cross = false }) {
  const T = tri(k), fig = (tone, hi) => ({ kind: "fan", k, cross, hi, tone });
  const sizes = Array.from({ length: k }, (_, i) => `${i + 1}칸짜리 ${k - i}개`);
  const steps = [
    { text: `작은 칸 하나짜리 삼각형이 ${k}개예요.`, figure: fig("doing", [0, 1, "base"]) },
    { text: `이웃한 칸을 붙여도 삼각형이에요. ${sizes.join(", ")}.`, figure: fig("doing", [0, 2, "base"]) },
    { text: `${Array.from({ length: k }, (_, i) => k - i).join(" + ")} = ${T}. 1부터 ${k}까지의 합, 삼각수예요.`, figure: fig(cross ? "doing" : "check", [0, k, "base"]) }
  ];
  if (cross) steps.push({ text: `가로선 위쪽에도 꼭짓점에서 같은 삼각형이 ${T}개 있어요. 모두 ${T} × 2 = ${T * 2}.`, figure: fig("check", [0, k, "cross"]) });
  return { id, title, problem: `꼭짓점에서 아래 변으로 선을 ${k - 1}개 그어 작은 칸 ${k}개로 나눈 삼각형${cross ? "에 가로선을 하나 그었어요" : "이에요"}. 크고 작은 삼각형은 모두 몇 개일까요?`, figure: fig("given", null), steps, answer: `모두 ${cross ? T * 2 : T}개예요.`, value: { kind: "fan", k, cross, total: cross ? T * 2 : T } };
}
// 줄마다 1, 3, 5…개 → n줄이면 n × n
function oddRowsExample({ id, title, n, shape }) {
  const steps = [
    { text: `줄마다 ${oddList(Math.min(n, 4)).join(", ")}${n > 4 ? ", …" : ""}개 — 홀수가 차례로 놓였어요.`, figure: { kind: "odd-rows", shape, n, counts: true, tone: "doing" } },
    { text: `1부터 홀수 ${n}개의 합이라 사각수예요. ${n} × ${n} = ${n * n}.`, figure: { kind: "odd-rows", shape, n, counts: true, tone: "check" } }
  ];
  const problem = shape === "square" ? `작은 정사각형을 맨 위에 1개, 그 아래에 3개, 5개…로 ${n}줄 쌓았어요. 작은 정사각형은 모두 몇 개일까요?` : `큰 삼각형을 ${n}줄로 나누었더니 줄마다 작은 삼각형이 1개, 3개, 5개…예요. 작은 삼각형은 모두 몇 개일까요?`;
  return { id, title, problem, figure: { kind: "odd-rows", shape, n: 3, tone: "given" }, steps, answer: `모두 ${n * n}개예요.`, value: { kind: "odd-rows", n, total: n * n } };
}
function triLayersExample({ id, title, n }) {
  const layers = Array.from({ length: n }, (_, i) => tri(i + 1)), total = sum(layers);
  const steps = [
    { text: `층마다 바닥이 한 줄 더 많은 삼각형이에요. 1층 1개, 2층 1 + 2 = 3개, 3층 1 + 2 + 3 = 6개….`, figure: { kind: "tri-layers", n: Math.min(n, 3), counts: true, tone: "doing" } },
    { text: `${n}층까지 층마다 ${layers.join(", ")}개예요.`, figure: { kind: "tri-layers", n, counts: true, tone: "doing" } },
    { text: `모두 더하면 ${plus(layers)} = ${total}.`, figure: { kind: "tri-layers", n, counts: true, tone: "check" } }
  ];
  return { id, title, problem: `쌓기나무를 맨 위 1층에 1개, 2층에 3개, 3층에 6개처럼 층마다 삼각형으로 넓혀 쌓아요. ${n}층까지 쌓으면 쌓기나무는 모두 몇 개일까요?`, figure: { kind: "tri-layers", n: 3, tone: "given" }, steps, answer: `모두 ${total}개예요.`, value: { kind: "tri-layers", n, total } };
}
const FIGNUM_SET = {
  id: "figure-numbers",
  types: {
    // 사각수
    "사각수 표": () => [squareNumberExample({ id: "sq-same-1", title: "예제 1", n: 7, ask: "same" })],
    "사각수 규칙": () => [squareGrowExample({ id: "sq-grow-1", title: "예제 1", n: 6 })],
    "사각수 구하기": () => [squareNumberExample({ id: "sq-val-1", title: "예제 1", n: 9 })],
    "연속한 홀수의 합": () => [oddSumExample({ id: "odd-sum-1", title: "예제 1", last: 19 }), oddSumExample({ id: "odd-sum-2", title: "예제 2", last: 23 })],
    "합이 되는 마지막 홀수": () => [lastOddExample({ id: "last-odd-1", title: "예제 1", total: 64 }), lastOddExample({ id: "last-odd-2", title: "예제 2", total: 81 })],
    "사각수 수열": () => [squareSeqExample({ id: "sq-seq-1", title: "예제 1", from: 2, nth: 10 })],
    "사각수를 더한 수열": () => [squareSumSeqExample({ id: "sq-sum-seq-1", title: "예제 1", nth: 6 })],
    "검은 돌과 흰 돌": () => [stoneRowsExample({ id: "bw-1", title: "예제 1", total: 64 })],
    // 삼각수
    "삼각수 표": () => [pairSumExample({ id: "tri-tab-1", title: "예제 1", from: 1, to: 6 }), middleSumExample({ id: "tri-tab-2", title: "예제 2", from: 1, to: 11 })],
    "삼각수 규칙": () => [triangleGrowExample({ id: "tri-grow-1", title: "예제 1", n: 6 })],
    "삼각수 구하기": () => [pairSumExample({ id: "tri-val-1", title: "예제 1", from: 1, to: 12 })],
    "짝수 개 계산": () => [pairSumExample({ id: "tri-even-1", title: "예제 1", from: 1, to: 14 })],
    "홀수 개 계산": () => [middleSumExample({ id: "tri-odd-1", title: "예제 1", from: 1, to: 9 }), middleSumExample({ id: "tri-odd-2", title: "예제 2", from: 1, to: 13 })],
    "악수 횟수": () => [handshakeExample({ id: "hand-new-1", title: "예제 1", n: 6, mode: "new" })],
    "악수 횟수와 삼각수": () => [handshakeExample({ id: "hand-last-1", title: "예제 1", n: 9, mode: "last" })],
    "가위바위보 횟수": () => [handshakeExample({ id: "rps-1", title: "예제 1", n: 9, mode: "total", game: "가위바위보" })],
    "악수 횟수로 사람 수": () => [handshakeReverseExample({ id: "hand-rev-1", title: "예제 1", total: 36 })],
    "두 점을 잇는 선분": () => [pairCountExample({ id: "seg-1", title: "예제 1", n: 12, what: "points" })],
    "두 장 뽑는 경우의 수": () => [pairCountExample({ id: "card-1", title: "예제 1", n: 11, what: "cards" })],
    "경우의 수로 카드 장수": () => [handshakeReverseExample({ id: "card-rev-1", title: "예제 1", total: 45, what: "cards" })],
    "크고 작은 삼각형": () => [fanExample({ id: "fan-1", title: "예제 1", k: 5 }), fanExample({ id: "fan-2", title: "예제 2", k: 5, cross: true })],
    // 삼각 계단 쌓기나무
    "홀수 줄 사각수": () => [oddRowsExample({ id: "odd-sq-1", title: "예제 1", n: 7, shape: "square" })],
    "홀수 줄 삼각 배열": () => [oddRowsExample({ id: "odd-tri-1", title: "예제 1", n: 6, shape: "triangle" })],
    "층마다 삼각수만큼 쌓은 쌓기나무": () => [triLayersExample({ id: "tri-layer-1", title: "예제 1", n: 5 }), triLayersExample({ id: "tri-layer-2", title: "예제 2", n: 6 })]
  }
};

// ───────────────────────── 6권 붙인 도형 · 잘라 만든 도형 · 꺾인 도형의 둘레 ─────────────────────────
// 좌표는 cm(오른쪽 +x, 아래 +y). 맞닿은 변은 바깥 둘레에 들어가지 않는다(두 도형의 둘레를 더하면 두 번 빠진다).
// 꺾인 변은 바깥으로 옮기면 큰 직사각형이 되고, 안으로 들어간 부분은 그 깊이를 두 번 더한다.
// value.geo = 검사기용: shapes(좌표)와 given(문제에 쓴 길이) · ask(답) — 각각 { what: edge|perimeter|outline, ... , value }.
// 그림 kind "poly"(golden-bell-type-examples-view.js).
const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const cellsOf = (rows) => rows.flatMap((row, y) => [...row].map((ch, x) => (ch === "#" ? rectPts(x, y, 1, 1) : null)).filter(Boolean));
// 모눈 도형: 칸마다 위·아래·옆이 비어 있으면 바깥 변
function gridEdges(rows) {
  const on = (x, y) => rows[y]?.[x] === "#";
  let flat = 0, side = 0;
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== "#") return; if (!on(x, y - 1)) flat++; if (!on(x, y + 1)) flat++; if (!on(x - 1, y)) side++; if (!on(x + 1, y)) side++; }));
  return { flat, side, total: flat + side };
}
const cm = (n) => `${n}cm`;
function joinedSidesExample({ id, title, w, h }) {
  const P = 2 * (w + h), rect = { pts: rectPts(0, 0, w, h), color: "rect", name: "직사각형" };
  const rh = { pts: [[0, 0], [w, 0], [w + 0.6 * w, -0.8 * w], [0.6 * w, -0.8 * w]], color: "rhombus", name: "마름모" };
  const fig = (tone, show) => ({ kind: "poly", shapes: [rect, rh], labels: [{ a: [w, 0], b: [w, h], text: cm(h) }, { a: [0, h], b: [w, h], text: show >= 1 ? cm(w) : "가", hi: show === 1 }, { a: [w, 0], b: [w * 1.6, -0.8 * w], text: show >= 2 ? cm(w) : "?" }], shared: show >= 2 ? [{ a: [0, 0], b: [w, 0] }] : [], tone });
  const steps = [
    { text: `직사각형의 가로와 세로를 더하면 둘레의 반, ${P} ÷ 2 = ${(P / 2)}. 가 = ${P / 2} − ${h} = ${w}cm.`, figure: fig("doing", 1) },
    { text: `직사각형의 위 변과 마름모의 변이 맞닿아 있어요. 맞닿은 변은 길이가 같으니 마름모의 한 변도 ${w}cm.`, figure: fig("doing", 2) },
    { text: `마름모는 네 변이 같아요. 나 = ${w} × 4 = ${w * 4}cm.`, figure: fig("check", 2) }
  ];
  return { id, title, problem: `둘레가 ${P}cm이고 세로가 ${h}cm인 직사각형 위에 마름모를 붙였어요. 직사각형의 가로 가와 마름모의 둘레 나를 구해요.`, figure: fig("given", 0), steps, answer: `가는 ${w}cm, 나는 ${josa(cm(w * 4), "이에요")}.`, value: { geo: { shapes: [rect.pts, rh.pts], given: [{ what: "perimeter", shape: 0, value: P }, { what: "edge", a: [w, 0], b: [w, h], value: h }], ask: [{ what: "edge", a: [0, h], b: [w, h], value: w }, { what: "perimeter", shape: 1, value: w * 4 }] } } };
}
function joinedFindExample({ id, title, s, A }) {
  const sq = { pts: rectPts(0, 0, s, s), color: "square", name: "정사각형" }, rc = { pts: rectPts(s, 0, A, s), color: "rect", name: "직사각형" }, P = 2 * (s + A + s);
  const fig = (tone, showA, box) => ({ kind: "poly", shapes: [sq, rc], labels: [{ a: [0, 0], b: [s, 0], text: cm(s) }, { a: [s, 0], b: [s + A, 0], text: showA ? cm(A) : "A", hi: showA }], shared: [{ a: [s, 0], b: [s, s] }], box: box ? [0, 0, s + A, s] : null, tone });
  const steps = [
    { text: `맞닿은 변(빨간 점선)은 둘레에 들어가지 않아요. 바깥 둘레는 가로 ${s} + A, 세로 ${s}인 직사각형과 같아요.`, figure: fig("doing", false, true) },
    { text: `가로 + 세로는 둘레의 반, ${P} ÷ 2 = ${P / 2}. 가로는 ${P / 2} − ${s} = ${s + A}cm.`, figure: fig("doing", false, true) },
    { text: `가로 ${s + A}cm에서 정사각형의 ${s}cm를 빼면 A = ${s + A} − ${s} = ${A}cm.`, figure: fig("check", true, true) }
  ];
  return { id, title, problem: `한 변이 ${s}cm인 정사각형과 직사각형을 붙였더니 둘레가 ${P}cm예요. A는 몇 cm일까요?`, figure: fig("given", false, false), steps, answer: `A는 ${josa(cm(A), "이에요")}.`, value: { geo: { shapes: [sq.pts, rc.pts], given: [{ what: "edge", a: [0, 0], b: [s, 0], value: s }, { what: "outline", value: P }], ask: [{ what: "edge", a: [s, 0], b: [s + A, 0], value: A }] } } };
}
// 붙인 도형의 둘레: parts = [{ shape, pts, name }], 맞닿은 변 shared(각각 길이 len)
function joinedPerimeterExample({ id, title, parts, shared, labels, problem }) {
  // sides: 직사각형·평행사변형은 [가로, 세로], 정다각형·마름모는 모든 변
  const perim = (p) => (p.sides.length === 2 ? 2 * (p.sides[0] + p.sides[1]) : sum(p.sides));
  const how = (p) => (p.sides.length === 2 ? `(${p.sides[0]} + ${p.sides[1]}) × 2` : `${p.sides[0]} × ${p.sides.length}`);
  const groups = []; for (const p of parts) { const g = groups.find((x) => x.name === p.name && x.sides.join() === p.sides.join()); if (g) g.n++; else groups.push({ ...p, n: 1 }); }
  const total = sum(parts.map(perim)), cut = sum(shared.map((e) => e.len)) * 2, out = total - cut;
  const fig = (tone, sh) => ({ kind: "poly", shapes: parts.map((p) => ({ pts: p.pts, color: p.color, name: p.tag ?? p.name })), labels, shared: sh ? shared : [], tone });
  const groupText = (g) => (g.n > 1 ? `${g.name} 하나는 ${how(g)} = ${perim(g)}, ${g.n}개라 ${perim(g)} × ${g.n} = ${perim(g) * g.n}` : `${g.name} ${how(g)} = ${perim(g)}`);
  const steps = [
    { text: `도형마다 둘레를 구해요. ${groups.map(groupText).join(", ")}.${groups.length > 1 ? ` 모두 ${groups.map((g) => perim(g) * g.n).join(" + ")} = ${total}.` : ""}`, figure: fig("doing", false) },
    { text: `맞닿은 변(빨간 점선)은 바깥 둘레가 아니에요. 두 도형에서 한 번씩 셌으니 두 번 빼요. ${shared.map((e) => `${e.len} × 2`).join(" + ")} = ${cut}.`, figure: fig("doing", true) },
    { text: `${total} − ${cut} = ${out}cm.`, figure: fig("check", true) }
  ];
  return { id, title, problem, figure: fig("given", false), steps, answer: `둘레는 ${josa(cm(out), "이에요")}.`, value: { geo: { shapes: parts.map((p) => p.pts), given: labels.filter((l) => /^\d/u.test(l.text)).map((l) => ({ what: "edge", a: l.a, b: l.b, value: Number(l.text.replace("cm", "")) })), ask: [{ what: "outline", value: out }] } } };
}
// 정사각형으로 나눈 직사각형: squares = [x, y, 한 변, 이름]. 가장 작은 정사각형의 한 변이 1
function squareSplitExample({ id, title, squares, order }) {
  const shapes = squares.map(([x, y, s, name]) => ({ pts: rectPts(x, y, s, s), color: "square", name: name || "" }));
  const named = Object.fromEntries(squares.filter((q) => q[3] && q[3] !== "1").map((q) => [q[3], q[2]]).sort((a, b) => a[0].localeCompare(b[0])));
  const fig = (tone, shown) => ({ kind: "poly", shapes: shapes.map((s, i) => ({ ...s, name: squares[i][3] && shown.includes(squares[i][3]) ? `${squares[i][3]} ${squares[i][2]}` : s.name })), tone });
  const steps = order.map((o, i) => ({ text: o.text, figure: fig(i === order.length - 1 ? "check" : "doing", order.slice(0, i + 1).map((x) => x.name)) }));
  return { id, title, problem: `그림의 칸은 모두 정사각형이고, 가장 작은 정사각형의 한 변은 1이에요. ${Object.keys(named).join(", ")}의 한 변의 길이를 구해요.`, figure: fig("given", []), steps, answer: `${Object.entries(named).map(([n, s], i, arr) => (i === arr.length - 1 ? `${josa(n, "은")} ${josa(s, "이에요")}` : `${josa(n, "은")} ${s}`)).join(", ")}.`, value: { split: { squares, named } } };
}
// 직사각형에서 가장 큰 정사각형을 차례로 잘라 낸다
function cutSquaresExample({ id, title, w, h, count }) {
  // 자를 때마다 남은 조각 [x, y, 가로, 세로]를 적어 둔다
  const cuts = [], rests = []; let x = 0, y = 0, W = w, H = h;
  for (let i = 0; i < count; i++) { const s = Math.min(W, H); cuts.push([x, y, s]); if (W >= H) { x += s; W -= s; } else { y += s; H -= s; } rests.push([x, y, W, H]); }
  const names = ["㉠", "㉡", "㉢", "㉣"].slice(0, count);
  const labels = [{ a: [0, 0], b: [w, 0], text: cm(w) }, { a: [0, 0], b: [0, h], text: cm(h) }];
  const fig = (i, tone) => ({ kind: "poly", shapes: [...cuts.slice(0, i + 1).map(([cx, cy, s], j) => ({ pts: rectPts(cx, cy, s, s), color: "square", name: names[j], hi: j === i })), ...(rests[i][2] && rests[i][3] ? [{ pts: rectPts(...rests[i]), color: "para" }] : [])], labels, tone });
  const steps = cuts.map(([, , s], i) => ({
    text: i === 0 ? `가장 큰 정사각형의 한 변은 짧은 변 ${s}cm예요. ${names[0]}의 둘레는 ${s} × 4 = ${s * 4}cm.` : `남은 조각에서 또 가장 큰 정사각형을 잘라요. 남은 조각의 짧은 변이 ${s}cm라 ${names[i]}의 둘레는 ${s} × 4 = ${s * 4}cm.`,
    figure: fig(i, i === count - 1 ? "check" : "doing")
  }));
  return { id, title, problem: `가로 ${w}cm, 세로 ${h}cm인 직사각형에서 가장 큰 정사각형을 차례로 잘라 ${names.join(", ")}을 만들었어요. ${names.join(", ")}의 둘레를 각각 구해요.`, figure: { kind: "poly", shapes: [{ pts: rectPts(0, 0, w, h), color: "rect" }], labels, tone: "given" }, steps, answer: `${cuts.map(([, , s], i) => `${names[i]} ${s * 4}cm`).join(", ")}예요.`, value: { cut: { w, h, sides: cuts.map((c) => c[2]), perims: cuts.map((c) => c[2] * 4) } } };
}
function cutDiffExample({ id, title, w, h }) {
  const P = 2 * (w + h), Q = 4 * h;
  const fig = (tone, cut) => ({ kind: "poly", shapes: cut ? [{ pts: rectPts(0, 0, h, h), color: "square", name: "정사각형", hi: true }, { pts: rectPts(h, 0, w - h, h), color: "para" }] : [{ pts: rectPts(0, 0, w, h), color: "rect" }], labels: [{ a: [0, 0], b: [w, 0], text: cm(w) }, { a: [0, 0], b: [0, h], text: cm(h) }], tone });
  const steps = [
    { text: `처음 직사각형의 둘레는 (${w} + ${h}) × 2 = ${P}cm.`, figure: fig("doing", false) },
    { text: `가장 큰 정사각형의 한 변은 짧은 변 ${h}cm. 둘레는 ${h} × 4 = ${Q}cm.`, figure: fig("doing", true) },
    { text: `${P} − ${Q} = ${P - Q}cm. 긴 변이 ${w - h}cm 더 긴 만큼이 두 번 빠진 것과 같아요.`, figure: fig("check", true) }
  ];
  return { id, title, problem: `가로 ${w}cm, 세로 ${h}cm인 직사각형을 잘라 가장 큰 정사각형을 만들었어요. 처음 직사각형과 정사각형의 둘레의 차는 몇 cm일까요?`, figure: fig("given", false), steps, answer: `둘레의 차는 ${josa(cm(P - Q), "이에요")}.`, value: { cut: { w, h, sides: [h], diff: P - Q } } };
}
function gridPerimeterExample({ id, title, rows, pressed = false }) {
  const g = gridEdges(rows), W = rows[0].length, H = rows.length;
  const shapes = cellsOf(rows).map((pts) => ({ pts, color: "cell" }));
  const fig = (tone, box) => ({ kind: "poly", shapes, box: box ? [0, 0, W, H] : null, tone });
  const steps = pressed
    ? [
      { text: `안으로 들어간 변을 바깥으로 밀어 봐요. 밀면 가로 ${W}칸, 세로 ${H}칸인 직사각형이 돼요.`, figure: fig("doing", true) },
      { text: `둘레는 그대로라 (${W} + ${H}) × 2 = ${(W + H) * 2}cm.`, figure: fig("doing", true) },
      { text: `변을 하나하나 세어 확인해요. 가로로 놓인 변 ${g.flat}개, 세로로 놓인 변 ${g.side}개, 모두 ${g.total}개.`, figure: fig("check", true) }
    ]
    : [
      { text: `바깥 변을 한 칸에 1cm씩 세요. 가로로 놓인 변이 ${g.flat}개예요.`, figure: fig("doing", false) },
      { text: `세로로 놓인 변이 ${g.side}개예요. 모두 ${g.flat} + ${g.side} = ${g.total}cm.`, figure: fig("check", false) }
    ];
  return { id, title, problem: `모눈 한 칸의 한 변은 1cm예요. 이 도형의 둘레는 몇 cm일까요?`, figure: fig("given", false), steps, answer: `둘레는 ${josa(cm(g.total), "이에요")}.`, value: { grid: { rows, total: g.total } } };
}
// 직각으로 꺾인 도형: pts(시계 방향), labels(문제에 쓴 길이), notch = 들어간 깊이(없으면 0)
function bentExample({ id, title, pts, labels, notch = 0 }) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), W = Math.max(...xs) - Math.min(...xs), H = Math.max(...ys) - Math.min(...ys);
  const base = (W + H) * 2, total = base + notch * 2, shape = { pts, color: "rect" };
  const fig = (tone, box) => ({ kind: "poly", shapes: [shape], labels, box: box ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] : null, tone });
  const steps = [
    { text: `가로로 놓인 변은 위로, 세로로 놓인 변은 옆으로 옮겨요. 가로 ${W}cm, 세로 ${H}cm인 직사각형이 돼요.`, figure: fig("doing", true) },
    { text: `(${W} + ${H}) × 2 = ${base}cm.`, figure: fig(notch ? "doing" : "check", true) }
  ];
  if (notch) steps.push({ text: `안으로 들어간 부분의 가로 변 ${notch}cm 두 개는 옮겨도 채워지지 않아요. ${notch} × 2 = ${josa(notch * 2, "을")} 더해 ${base} + ${notch * 2} = ${total}cm.`, figure: fig("check", true) });
  return { id, title, problem: `직각으로 꺾인 도형의 둘레는 몇 cm일까요?`, figure: fig("given", false), steps, answer: `둘레는 ${josa(cm(total), "이에요")}.`, value: { geo: { shapes: [pts], given: labels.map((l) => ({ what: "edge", a: l.a, b: l.b, value: Number(l.text.replace("cm", "")) })), ask: [{ what: "outline", value: total }] } } };
}
const S5 = 5, TRI_H = 4.33;
const OUTLINE_SET = {
  id: "outline",
  types: {
    "붙인 도형의 변": () => [joinedSidesExample({ id: "join-side-1", title: "예제 1", w: 10, h: 8 })],
    "붙인 도형의 둘레로 변 찾기": () => [joinedFindExample({ id: "join-find-1", title: "예제 1", s: 4, A: 7 })],
    "붙인 도형의 둘레": () => [
      joinedPerimeterExample({ id: "join-per-1", title: "예제 1", parts: [{ name: "직사각형", color: "rect", pts: rectPts(0, 0, 9, 6), sides: [9, 6] }, { name: "마름모", color: "rhombus", pts: [[0, 0], [6, 0], [9.6, -4.8], [3.6, -4.8]], sides: [6, 6, 6, 6] }], shared: [{ a: [0, 0], b: [6, 0], len: 6 }], labels: [{ a: [0, 6], b: [9, 6], text: "9cm" }, { a: [9, 0], b: [9, 6], text: "6cm" }, { a: [6, 0], b: [9.6, -4.8], text: "6cm" }], problem: "가로 9cm, 세로 6cm인 직사각형 위에 한 변이 6cm인 마름모를 붙였어요. 이 도형의 둘레는 몇 cm일까요?" }),
      joinedPerimeterExample({ id: "join-per-2", title: "예제 2", parts: [{ name: "정사각형", color: "square", pts: rectPts(0, 0, S5, S5), sides: [S5, S5, S5, S5] }, { name: "정사각형", color: "square", pts: rectPts(S5, 0, S5, S5), sides: [S5, S5, S5, S5] }, { name: "정삼각형", color: "triangle", pts: [[0, 0], [S5, 0], [S5 / 2, -TRI_H]], sides: [S5, S5, S5] }], shared: [{ a: [S5, 0], b: [S5, S5], len: S5 }, { a: [0, 0], b: [S5, 0], len: S5 }], labels: [{ a: [0, S5], b: [S5, S5], text: "5cm" }], problem: "한 변이 5cm인 정사각형 2개와 정삼각형 1개를 그림처럼 붙였어요. 이 도형의 둘레는 몇 cm일까요?" })
    ],
    "정사각형으로 나누기": () => [squareSplitExample({ id: "sq-split-1", title: "예제 1", squares: [[0, 0, 5, "C"], [5, 0, 3, "B"], [5, 3, 2, "A"], [7, 3, 1, "1"], [7, 4, 1, ""]], order: [
      { name: "A", text: "A 옆에 한 변이 1인 정사각형 두 개가 세로로 쌓여 있어요. A의 한 변 = 1 + 1 = 2." },
      { name: "B", text: "B의 아래 변은 A와 1짜리를 나란히 놓은 길이예요. B의 한 변 = 2 + 1 = 3." },
      { name: "C", text: "C의 오른쪽 변은 B와 A를 위아래로 놓은 길이예요. C의 한 변 = 3 + 2 = 5." }
    ] })],
    "잘라 만든 정사각형의 둘레": () => [cutSquaresExample({ id: "cut-sq-1", title: "예제 1", w: 11, h: 7, count: 3 })],
    "둘레의 차이": () => [cutDiffExample({ id: "cut-diff-1", title: "예제 1", w: 12, h: 7 })],
    "모눈 도형의 둘레": () => [gridPerimeterExample({ id: "grid-per-1", title: "예제 1", rows: ["##", "#.", "##"] }), gridPerimeterExample({ id: "grid-per-2", title: "예제 2", rows: ["####", "#..#"] })],
    "꼭짓점에서 누른 모양의 둘레": () => [gridPerimeterExample({ id: "press-1", title: "예제 1", rows: ["..##", ".###", "####"], pressed: true })],
    "꺾인 도형의 둘레": () => [
      bentExample({ id: "bent-1", title: "예제 1", pts: [[0, 0], [4, 0], [4, 2], [7, 2], [7, 6], [0, 6]], labels: [{ a: [0, 6], b: [7, 6], text: "7cm" }, { a: [0, 0], b: [0, 6], text: "6cm" }, { a: [0, 0], b: [4, 0], text: "4cm" }, { a: [7, 2], b: [7, 6], text: "4cm" }] }),
      bentExample({ id: "bent-2", title: "예제 2", pts: [[0, 0], [2, 0], [2, 2], [5, 2], [5, 4], [8, 4], [8, 7], [0, 7]], labels: [{ a: [0, 7], b: [8, 7], text: "8cm" }, { a: [0, 0], b: [0, 7], text: "7cm" }] })
    ],
    "들어간 도형의 둘레": () => [bentExample({ id: "notch-1", title: "예제 1", pts: [[0, 0], [10, 0], [10, 2], [6, 2], [6, 4], [10, 4], [10, 6], [0, 6]], labels: [{ a: [0, 0], b: [10, 0], text: "10cm" }, { a: [0, 0], b: [0, 6], text: "6cm" }, { a: [6, 2], b: [10, 2], text: "4cm", inside: true }], notch: 4 })],
    "붙인 정사각형의 둘레": () => [joinedPerimeterExample({ id: "join-sq-1", title: "예제 1", parts: [{ name: "정사각형", tag: "", color: "square", pts: rectPts(0, 0, 4, 4), sides: [4, 4, 4, 4] }, { name: "정사각형", tag: "", color: "square", pts: rectPts(0, 4, 4, 4), sides: [4, 4, 4, 4] }, { name: "정사각형", tag: "", color: "square", pts: rectPts(4, 4, 4, 4), sides: [4, 4, 4, 4] }], shared: [{ a: [0, 4], b: [4, 4], len: 4 }, { a: [4, 4], b: [4, 8], len: 4 }], labels: [{ a: [0, 0], b: [4, 0], text: "4cm" }], problem: "한 변이 4cm인 정사각형 3개를 그림처럼 붙였어요. 이 도형의 둘레는 몇 cm일까요?" })]
  }
};

// ───────────────────────── 4권 평형 저울: 양쪽에서 같은 것 덜기 · 바꾸어 넣기 ─────────────────────────
// 평평한 저울은 양쪽에 똑같이 더하거나 덜어도, 양쪽을 똑같이 나누어도 평평하다. 한 모양을 다른 모양 몇 개로 바꾸어 넣을 수 있다.
// 그림은 2권 저울(kind "balance")을 그대로 쓰고, 덜어 낸 것은 「x:모양」으로 흐리게 × 표시.
// value.eqs = [{ left: {모양: 개수}, right: {...} }], value.ask = { of: {모양: 개수}, unit: 모양, n } — 검사기가 무게를 하나하나 넣어 보아 확인한다.
const pans = (m) => Object.entries(m).flatMap(([t, n]) => Array(n).fill(t));
const eqScale = (l, r) => ({ left: pans(l), right: pans(r), heavy: "equal" });
const countText = (m) => Object.entries(m).map(([t, n]) => `${tokenName(t)} ${n}개`).join("와 ");
// 양쪽에서 같은 것(common)을 덜고, 남은 것을 groups로 똑같이 나눈다
function balanceRemoveExample({ id, title, left, right, common = null, groups, x, unit }) {
  const L = { ...left }, R = { ...right };
  const steps = [];
  if (common) {
    const [t, n] = Object.entries(common)[0];
    const struck = (m) => Object.entries(m).flatMap(([s, k]) => Array.from({ length: k }, (_, i) => (s === t && i < n ? `x:${s}` : s)));
    steps.push({ text: `저울이 평평하면 양쪽 무게가 같아요. 양쪽에 똑같이 있는 ${tokenName(t)} ${n}개를 함께 덜어 내도 평평해요.`, figure: { kind: "balance", scales: [{ left: struck(L), right: struck(R), heavy: "equal" }], focus: [0] } });
    L[t] -= n; R[t] -= n; for (const m of [L, R]) for (const k of Object.keys(m)) if (!m[k]) delete m[k];
    steps.push({ text: `남은 것끼리 같아요. ${countText(L)} = ${countText(R)}.`, figure: { kind: "balance", scales: [eqScale(L, R)] } });
  } else steps.push({ text: `저울이 평평하면 양쪽 무게가 같아요. 왼쪽은 ${countText(L)}, 오른쪽은 ${countText(R)}.`, figure: { kind: "balance", scales: [eqScale(L, R)], focus: [0] } });
  const div = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v / groups]));
  const oneL = div(L), oneR = div(R);
  if (Object.values({ ...oneL, ...oneR }).some((v) => !Number.isInteger(v))) throw new Error(`${id}: 똑같이 나누어지지 않음`);
  steps.push({ text: `양쪽을 똑같이 ${groups}묶음으로 나누어도 평평해요. ${countText(oneL)} = ${countText(oneR)}.`, figure: { kind: "balance", scales: [eqScale(oneL, oneR)] } });
  const n = oneR[unit];
  const askText = Object.entries(x).map(([t, k]) => `${tokenName(t)} ${k}개`).join("와 ");
  return { id, title, problem: `저울이 평평해요. 왼쪽에 ${countText(left)}, 오른쪽에 ${countText(right)}가 있어요. ${josa(askText, "은")} ${tokenName(unit)} 몇 개의 무게와 같을까요?`, figure: { kind: "balance", scales: [eqScale(left, right)] }, steps, answer: `${josa(askText, "은")} ${tokenName(unit)} ${n}개와 같아요.`, value: { eqs: [{ left, right }], ask: { of: x, unit, n } } };
}
// 바꾸어 넣기: first = [한 모양 = 다른 모양 여러 개], then 다음 저울의 그 모양을 바꾼다. target이면 빈 접시에 몇 개
function balanceSwapExample({ id, title, first, second = null, target = null, unit }) {
  const [one, many] = [Object.keys(first.left)[0], first.right];
  const per = many[unit];
  const scales = [eqScale(first.left, first.right), ...(second ? [eqScale(second.left, second.right)] : [])];
  const steps = [{ text: `1번 저울: ${tokenName(one)} 1개는 ${tokenName(unit)} ${per}개와 같아요.`, figure: { kind: "balance", scales, focus: [0] } }];
  let n, problem, answer, ask, eqs = [{ left: first.left, right: first.right }];
  if (second) {
    const big = Object.keys(second.left)[0], k = second.right[one], rest = second.right[unit] || 0;
    n = k * per + rest;
    const swapped = eqScale(second.left, { [unit]: n });
    steps.push({ text: `2번 저울의 ${tokenName(one)} ${k}개를 ${tokenName(unit)} ${k * per}개로 바꾸어 넣어요. ${k} × ${per} = ${k * per}.`, figure: { kind: "balance", scales: [scales[0], swapped], focus: [1] } });
    steps.push({ text: `${tokenName(big)} 1개 = ${tokenName(unit)} ${k * per}${rest ? ` + ${rest}` : ""} = ${n}개.`, figure: { kind: "balance", scales: [scales[0], swapped] } });
    eqs.push({ left: second.left, right: second.right });
    ask = { of: { [big]: 1 }, unit, n };
    problem = `두 저울이 모두 평평해요. ${tokenName(big)} 1개는 ${tokenName(unit)} 몇 개의 무게와 같을까요?`;
    answer = `${tokenName(big)} 1개는 ${tokenName(unit)} ${n}개와 같아요.`;
  } else {
    const k = target[one], rest = target[unit] || 0;
    n = k * per + rest;
    const tScale = { left: pans(target), right: ["?"], heavy: "equal" };
    scales.push(tScale);
    steps.push({ text: `빈 접시 저울의 ${tokenName(one)} ${k}개를 ${tokenName(unit)} ${k * per}개로 바꾸면 왼쪽은 ${tokenName(unit)} ${k * per}${rest ? ` + ${rest}` : ""} = ${n}개예요.`, figure: { kind: "balance", scales: [scales[0], { left: pans({ [unit]: n }), right: ["?"], heavy: "equal" }], focus: [1] } });
    steps.push({ text: `평평하려면 빈 접시에도 ${tokenName(unit)} ${n}개를 놓아요.`, figure: { kind: "balance", scales: [scales[0], eqScale(target, { [unit]: n })] } });
    ask = { of: target, unit, n };
    problem = `두 저울이 모두 평평해요. 두 번째 저울의 빈 접시에 ${tokenName(unit)}을 몇 개 놓아야 할까요?`.replace(`${tokenName(unit)}을`, josa(tokenName(unit), "을"));
    answer = `${tokenName(unit)} ${n}개를 놓아야 해요.`;
  }
  return { id, title, problem, figure: { kind: "balance", scales }, steps, answer, value: { eqs, ask } };
}
const BALANCE4_SET = {
  id: "b4-balance",
  types: {
    "등식의 성질로 무게 비교": () => [
      balanceRemoveExample({ id: "b4-rm-1", title: "예제 1", left: { circle: 2, triangle: 1 }, right: { triangle: 7 }, common: { triangle: 1 }, groups: 2, x: { circle: 1 }, unit: "triangle" }),
      balanceRemoveExample({ id: "b4-rm-2", title: "예제 2", left: { circle: 3, triangle: 3 }, right: { square: 9 }, groups: 3, x: { circle: 1, triangle: 1 }, unit: "square" })
    ],
    "양팔저울 바꾸어 넣기": () => [
      balanceSwapExample({ id: "b4-sw-1", title: "예제 1", first: { left: { triangle: 1 }, right: { square: 2 } }, second: { left: { circle: 1 }, right: { triangle: 2, square: 1 } }, unit: "square" }),
      balanceSwapExample({ id: "b4-sw-2", title: "예제 2", first: { left: { circle: 1 }, right: { star: 3 } }, target: { circle: 2, star: 1 }, unit: "star" })
    ]
  }
};

// ───────────────────────── 4권 크기 비교 · 크기 차이 ─────────────────────────
// 정해진 값이 없어도 하나(기준)에 적당한 수를 넣으면 나머지가 차례로 정해진다. 순서와 차이는 어떤 수를 넣어도 같다.
// rels = [[X, Y, d]] — X = Y + d. 그림: 관계식 목록(kind "eqs") → 기준 수를 넣은 수직선(kind "dist-line", min·value).
const relLine = ([x, y, d]) => `${x} = ${y} ${d > 0 ? "+" : "−"} ${Math.abs(d)}`;
function solveRels(rels, base, start) {
  const val = { [base]: start }, order = [];
  for (let guard = 0; order.length < rels.length && guard < 20; guard++) for (const [i, [x, y, d]] of rels.entries()) {
    if (order.some((o) => o.i === i)) continue;
    if (val[y] !== undefined && val[x] === undefined) { val[x] = val[y] + d; order.push({ i, find: x }); }
    else if (val[x] !== undefined && val[y] === undefined) { val[y] = val[x] - d; order.push({ i, find: y }); }
    else if (val[x] !== undefined && val[y] !== undefined) order.push({ i, find: null });
  }
  return { val, order };
}
// clue(rel) = 문장(조건으로 푸는 문제). ask: { kind: "asc" | "desc" | "max" | "min" | "diff", pair, word }
function relationsExample({ id, title, rels, base, start, ask, problem, clue = null, unit = "" }) {
  const { val, order } = solveRels(rels, base, start), names = Object.keys(val);
  if (new Set(Object.values(val)).size !== names.length) throw new Error(`${id}: 값이 겹침`);
  const lines = rels.map((r) => (clue ? clue(r) : relLine(r)));
  const sorted = [...names].sort((a, b) => val[a] - val[b]);
  const vals = Object.values(val), lo = Math.min(...vals), hi = Math.max(...vals);
  const line = (known, tone, mark = []) => ({ kind: "dist-line", min: lo - 1, points: sorted.filter((n) => known.includes(n)).map((n) => ({ label: n, at: val[n], value: val[n] })), arcs: [], mark, tone });
  const steps = [{ text: `정해진 값이 없으니 ${base}에 적당한 수 ${josa(start, "을")} 넣어 봐요.${unit === "m" ? " 앞에 있을수록 큰 수로 생각해요." : ""}`, figure: line([base], "doing") }];
  const known = [base];
  for (const { i, find } of order) {
    if (!find) continue;
    const [x, y, d] = rels[i];
    known.push(find);
    steps.push({ text: find === x ? `${lines[i]} → ${x} = ${val[y]} ${d > 0 ? "+" : "−"} ${Math.abs(d)} = ${val[x]}.` : `${lines[i]} → ${y} = ${val[x]} ${d > 0 ? "−" : "+"} ${Math.abs(d)} = ${val[y]}.`, figure: { ...line([...known], "doing"), mark: [find] } });
  }
  let answer, value;
  if (ask.kind === "diff") {
    const [p, q] = ask.pair, [big, small] = val[p] > val[q] ? [p, q] : [q, p], d = val[big] - val[small];
    steps.push({ text: `${josa(big, "은")} ${small}보다 ${val[big]} − ${val[small]} = ${d}${unit} ${MORE[unit]?.[0] || "커요"}. 다른 수를 넣어도 차는 같아요.`, figure: line(names, "check", [p, q]) });
    answer = `${ask.word || "차"}는 ${unit ? `${d}${unit}예요` : josa(d, "이에요")}.`; value = { kind: "diff", d, pair: ask.pair };
  } else if (ask.kind === "max" || ask.kind === "min") {
    const who = ask.kind === "max" ? sorted.at(-1) : sorted[0];
    steps.push({ text: `수직선에서 ${ask.kind === "max" ? "가장 오른쪽" : "가장 왼쪽"}이 ${josa(ask.word, "이에요")}.`, figure: line(names, "check", [who]) });
    answer = `${josa(ask.word, "은")} ${josa(who, "이에요")}.`; value = { kind: ask.kind, who };
  } else {
    const seq = ask.kind === "asc" ? sorted : [...sorted].reverse();
    steps.push({ text: `수직선에서 ${ask.kind === "asc" ? "왼쪽부터 작은" : "오른쪽부터 큰"} 순서로 읽어요.`, figure: line(names, "check") });
    answer = `${seq.join(ask.kind === "asc" ? " < " : " > ")}예요.`; value = { kind: ask.kind, seq };
  }
  return { id, title, problem, figure: { kind: "eqs", lines, tone: "given" }, steps, answer, value: { ...value, rels, val } };
}
// 1부터 n까지 카드를 한 번씩: 결과 칸 수(sums)는 이미 썼고, 남은 카드로 □ + □ 식을 다 만들면 하나가 남는다
function unusedCardExample({ id, title, n, sums }) {
  const rest = Array.from({ length: n }, (_, i) => i + 1).filter((v) => !sums.includes(v));
  const pairs = sums.map((s) => rest.flatMap((a) => rest.filter((b) => b > a && a + b === s).map((b) => [a, b])));
  const ways = []; const pick = (i, used, chosen) => { if (i === sums.length) { ways.push(chosen); return; } for (const [a, b] of pairs[i]) if (!used.has(a) && !used.has(b)) pick(i + 1, new Set([...used, a, b]), [...chosen, [a, b]]); };
  pick(0, new Set(), []);
  const lefts = new Set(ways.map((w) => rest.filter((v) => !w.flat().includes(v)).join()));
  if (lefts.size !== 1) throw new Error(`${id}: 남는 수가 하나로 정해지지 않음`);
  const way = ways[0], left = rest.filter((v) => !way.flat().includes(v));
  const eqs = sums.map((s) => `□ + □ = ${s}`);
  const steps = [
    { text: `${sums.join(", ")}은 벌써 썼어요. 남은 카드는 ${rest.join(", ")}.`.replace(`${sums.at(-1)}은`, josa(sums.at(-1), "은")), figure: { kind: "num-cards", n, used: sums, eqs, tone: "doing" } },
    { text: `합이 되는 짝을 모두 찾아요. ${sums.map((s, i) => `${josa(s, "은")} ${pairs[i].map(([a, b]) => `${a} + ${b}`).join(" 또는 ")}`).join(", ")}.`, figure: { kind: "num-cards", n, used: sums, eqs, tone: "doing" } },
    { text: `같은 카드를 두 번 쓰지 않게 고르면 ${way.map(([a, b], i) => `${a} + ${b} = ${sums[i]}`).join(", ")}.`, figure: { kind: "num-cards", n, used: sums, pick: way.flat(), eqs: way.map(([a, b], i) => `${a} + ${b} = ${sums[i]}`), tone: "doing" } },
    { text: `쓰지 못하고 남는 카드는 ${left.join(", ")}.`, figure: { kind: "num-cards", n, used: sums, pick: way.flat(), left, eqs: way.map(([a, b], i) => `${a} + ${b} = ${sums[i]}`), tone: "check" } }
  ];
  return { id, title, problem: `1부터 ${n}까지의 수 카드를 한 번씩만 써서 ${eqs.join(", ")}를 완성해요. ${sums.join(", ")}은 이미 썼어요. 쓸 수 없는 수는 무엇일까요?`.replace(`${eqs.at(-1)}를`, `${eqs.at(-1)}${josa(sums.at(-1), "을").slice(-1)}`).replace(`${sums.join(", ")}은 이미`, `${josa(sums.join(", "), "은")} 이미`), figure: { kind: "num-cards", n, used: sums, eqs, tone: "given" }, steps, answer: `${josa(left.join(", "), "이에요")}.`, value: { kind: "cards", n, sums, left } };
}
const MORE = { kg: ["무거워요", "가벼워요"], 살: ["많아요", "적어요"], m: ["앞에 있어요", "뒤에 있어요"] };
const clueOf = (unit) => ([x, y, d]) => `${josa(x, "은")} ${y}보다 ${Math.abs(d)}${unit} ${MORE[unit][d > 0 ? 0 : 1]}.`;
const RELATION_SET = {
  id: "relations",
  types: {
    "사용하지 않는 숫자카드": () => [unusedCardExample({ id: "card-unused-1", title: "예제 1", n: 7, sums: [6, 7] })],
    "도형의 크기 비교": () => [
      relationsExample({ id: "rel-shape-1", title: "예제 1", rels: [["□", "○", 4], ["△", "○", -3]], base: "○", start: 10, ask: { kind: "asc" }, problem: "□ = ○ + 4, △ = ○ − 3이에요. 작은 것부터 순서대로 써요." }),
      relationsExample({ id: "rel-shape-2", title: "예제 2", rels: [["○", "◇", 5], ["△", "□", 2], ["○", "□", -1]], base: "□", start: 10, ask: { kind: "asc" }, problem: "○ = ◇ + 5, △ = □ + 2, ○ = □ − 1이에요. 작은 것부터 순서대로 써요." })
    ],
    "식으로 수의 크기 순서 정하기": () => [relationsExample({ id: "rel-abc-1", title: "예제 1", rels: [["A", "B", -4], ["C", "B", 7]], base: "B", start: 10, ask: { kind: "desc" }, problem: "어떤 수 A, B, C가 A = B − 4, C = B + 7이에요. 큰 수부터 순서대로 써요." })],
    "식으로 두 수의 차이 구하기": () => [relationsExample({ id: "rel-diff-1", title: "예제 1", rels: [["A", "B", -6], ["C", "D", 3], ["B", "C", -2]], base: "C", start: 20, ask: { kind: "diff", pair: ["A", "C"], word: "A와 C의 차" }, problem: "어떤 수 A, B, C, D가 A = B − 6, C = D + 3, B = C − 2예요. A와 C의 차는 얼마일까요?" })],
    "도형의 크기 차이": () => [relationsExample({ id: "rel-sdiff-1", title: "예제 1", rels: [["○", "◇", 6], ["△", "□", 4], ["○", "□", -3]], base: "□", start: 20, ask: { kind: "diff", pair: ["○", "△"], word: "○와 △의 차" }, problem: "○ = ◇ + 6, △ = □ + 4, ○ = □ − 3이에요. ○와 △의 차를 구해요." })],
    "조건으로 차이와 순서 찾기": () => [
      relationsExample({ id: "rel-clue-1", title: "예제 1", rels: [["A", "B", 6], ["C", "A", -3], ["D", "B", 8]], base: "B", start: 20, unit: "kg", clue: clueOf("kg"), ask: { kind: "diff", pair: ["C", "D"], word: "C와 D의 무게 차" }, problem: "상자 A, B, C, D의 무게를 비교했어요. A는 B보다 6kg 무겁고, C는 A보다 3kg 가볍고, D는 B보다 8kg 무거워요. C와 D는 몇 kg 차이 날까요?" }),
      relationsExample({ id: "rel-clue-2", title: "예제 2", rels: [["민지", "준호", 12], ["소라", "민지", -20], ["태우", "소라", 5]], base: "준호", start: 50, unit: "m", clue: clueOf("m"), ask: { kind: "min", word: "제일 뒤에 있는 사람" }, problem: "한 줄로 서 있어요. 민지는 준호보다 12m 앞에, 소라는 민지보다 20m 뒤에, 태우는 소라보다 5m 앞에 있어요. 제일 뒤에 있는 사람은 누구일까요?" })
    ]
  }
};

// ───────────────────────── 4권 논리: 순서 · 줄 세기 · 동서남북 · 원탁 · O/X 표 ─────────────────────────
// 조건(clue)은 자료로 두고 문제 글도 그 자료로 만든다 — 검사기가 같은 자료로 모든 배치를 다 넣어 보아 답이 하나뿐인지 본다.
// 원탁: 식탁 가운데를 보고 앉으면 내 왼쪽은 시계 바늘이 도는 쪽 옆자리(그림에서 자리 번호 + 1).
const orderClueText = (c) => (c.t === "only" ? `${c.a}의 앞에는 ${c.b}만 있어요.` : c.t === "next" ? `${josa(c.b, "은")} ${c.a} 바로 뒤에서 달려요.` : c.t === "first" ? `${c.p} 앞에 달리는 사람은 없어요.` : c.t === "last" ? `${josa(c.p, "은")} 맨 뒤에서 달려요.` : c.t === "before" ? `${josa(c.a, "은")} ${c.b}보다 앞에서 달려요.` : c.t === "notLast" ? `${josa(c.p, "은")} 맨 뒤가 아니에요.` : `${josa(c.p, "은")} ${josa(c.a, "과")} ${c.b} 사이에서 달려요.`);
function runOrderExample({ id, title, people, clues, plan, seq }) {
  const labels = people.map((_, i) => `${i + 1}등`);
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "slots", labels, names: p.names, hi: p.hi, tone: i === plan.length - 1 ? "check" : "doing" } }));
  return { id, title, problem: `${people.join(", ")} ${people.length}명이 달리기를 해요. ${clues.map(orderClueText).join(" ")} 빠른 순서대로 써요.`, figure: { kind: "slots", labels, names: people.map(() => null), tone: "given" }, steps, answer: `${seq.join(", ")} 순서예요.`, value: { kind: "order", people, clues, seq } };
}
// 줄 세기: cons = [{ who, from: "front" | "back", k }], between = { a, b, count }(두 사람 사이 인원)
function rowCountExample({ id, title, cons, between = null }) {
  let n, steps;
  const pos = (c, N) => (c.from === "front" ? c.k : N - c.k + 1);
  if (!between) {
    const [f, b] = cons; n = f.k + b.k - 1;
    const fig = (tone, spans) => ({ kind: "row-line", n, marks: { [f.k]: f.who }, spans, tone });
    steps = [
      { text: `${josa(f.who, "은")} 앞에서 ${f.k}번째라 앞쪽에 ${f.k}명(${f.who} 포함), 뒤에서 ${b.k}번째라 뒤쪽에 ${b.k}명(${f.who} 포함)이에요.`, figure: fig("doing", [{ from: 1, to: f.k, label: `${f.k}명` }]) },
      { text: `${josa(f.who, "을")} 두 번 셌으니 한 번 빼요. ${f.k} + ${b.k} − 1 = ${n}명.`, figure: fig("check", [{ from: 1, to: n, label: `${n}명` }]) }
    ];
  } else {
    const [fa, bb] = cons; n = fa.k + between.count + bb.k;
    const fig = (tone, spans) => ({ kind: "row-line", n, marks: { [fa.k]: fa.who, [n - bb.k + 1]: bb.who }, spans, tone });
    steps = [
      { text: `${josa(fa.who, "은")} 앞에서 ${fa.k}번째라 앞쪽은 ${fa.who}까지 ${fa.k}명이에요.`, figure: fig("doing", [{ from: 1, to: fa.k, label: `${fa.k}명` }]) },
      { text: `두 사람 사이에 ${between.count}명, ${josa(bb.who, "은")} 뒤에서 ${bb.k}번째라 ${bb.who}부터 뒤쪽은 ${bb.k}명이에요.`, figure: fig("doing", [{ from: n - bb.k + 1, to: n, label: `${bb.k}명` }]) },
      { text: `겹치는 사람이 없으니 모두 ${fa.k} + ${between.count} + ${bb.k} = ${n}명.`, figure: fig("check", [{ from: 1, to: n, label: `${n}명` }]) }
    ];
  }
  if (cons.some((c) => pos(c, n) < 1 || pos(c, n) > n)) throw new Error(`${id}: 줄 밖`);
  const text0 = between ? `${josa(cons[0].who, "은")} 앞에서 ${cons[0].k}번째, ${josa(cons[1].who, "은")} 뒤에서 ${cons[1].k}번째에 서 있고, 두 사람 사이에 ${between.count}명이 있어요.` : `${josa(cons[0].who, "은")} 앞에서 ${cons[0].k}번째, 뒤에서 ${cons[1].k}번째에 서 있어요.`;
  return { id, title, problem: `${text0} 줄을 선 사람은 모두 몇 명일까요?`, figure: { kind: "row-line", n: Math.min(n, 6), marks: {}, tone: "given" }, steps, answer: `모두 ${n}명이에요.`, value: { kind: "row", cons, between, n } };
}
// 줄에서 앞·뒤로 세기: 왼쪽이 앞. 뒤에서 k번째 = 앞에서 (n − k + 1)번째
const ORDINAL = ["첫", "두", "세", "네", "다섯", "여섯", "일곱"];
function lineCountExample({ id, title, names, from, k }) {
  const n = names.length, pos = from === "front" ? k : n - k + 1, ans = names[pos - 1], side = from === "front" ? "앞" : "뒤";
  const marks = Object.fromEntries(names.map((nm, i) => [i + 1, nm])), fig = (tone, spans) => ({ kind: "row-line", n, marks, spans, tone });
  const steps = from === "front" ? [
    { text: `앞은 왼쪽이에요. 맨 앞의 ${names[0]}부터 1, 2, 3… 세어요.`, figure: fig("doing", [{ from: 1, to: pos, label: `${k}명` }]) },
    { text: `앞에서 ${ORDINAL[k - 1]} 번째는 ${ans}.`, figure: fig("check", [{ from: pos, to: pos, label: `${k}번째` }]) }
  ] : [
    { text: `뒤에서 셀 때는 맨 뒤(오른쪽 끝)의 ${names[n - 1]}부터 1, 2, 3… 세어요.`, figure: fig("doing", [{ from: pos, to: n, label: `${k}명` }]) },
    { text: `뒤에서 ${ORDINAL[k - 1]} 번째는 ${ans}. 앞에서 세면 ${n} − ${k} + 1 = ${pos}번째예요.`, figure: fig("check", [{ from: pos, to: pos, label: `${pos}번째` }]) }
  ];
  return { id, title, problem: `${names.join(", ")} ${n}명이 이 순서로 한 줄로 서 있어요. 맨 앞은 ${josa(names[0], "이에요")}. ${side}에서 ${ORDINAL[k - 1]} 번째에 서 있는 사람은 누구일까요?`, figure: fig("given", []), steps, answer: `${josa(ans, "이에요")}.`, value: { kind: "linecount", names, from, k, ans } };
}
const DIR = { 북: [-1, 0], 남: [1, 0], 서: [0, -1], 동: [0, 1] };
function compassGridExample({ id, title, rows, asks }) {
  const at = (name) => { for (const [r, row] of rows.entries()) { const c = row.indexOf(name); if (c >= 0) return [r, c]; } return null; };
  const answers = asks.map(([of, dir]) => { const [r, c] = at(of), [dr, dc] = DIR[dir]; return rows[r + dr]?.[c + dc]; });
  if (answers.some((a) => !a)) throw new Error(`${id}: 칸 밖`);
  const steps = [
    { text: "위가 북쪽, 아래가 남쪽, 오른쪽이 동쪽, 왼쪽이 서쪽이에요.", figure: { kind: "compass", rows, tone: "doing" } },
    ...asks.map(([of, dir], i) => ({ text: `${of}에서 ${dir}쪽으로 한 칸 가면 ${josa(answers[i], "이에요")}.`, figure: { kind: "compass", rows, hi: [at(answers[i])], ask: [at(of)], tone: i === asks.length - 1 ? "check" : "doing" } }))
  ];
  return { id, title, problem: `그림을 보고 ${asks.map(([of, dir], i) => `(${i + 1}) ${of}의 ${dir}쪽`).join(", ")}에 있는 글자를 써요.`, figure: { kind: "compass", rows, tone: "given" }, steps, answer: `${asks.map((_, i) => `(${i + 1}) ${answers[i]}`).join(", ")}예요.`, value: { kind: "compass", rows, asks, answers } };
}
// 2 × 2 자리: clues = [[A, 방향, B]] — A는 B의 (방향)쪽 바로 옆. ask = 물을 칸 [행, 열]
const placeClueText = ([a, dir, b]) => `${josa(a, "은")} ${b}의 ${dir}쪽에 있어요.`;
function placeExample({ id, title, places, clues, plan, ask, ans, mark }) {
  const empty = [[null, null], [null, null]];
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "compass", rows: p.rows, hi: p.hi, ask: [ask], askLabel: mark, tone: i === plan.length - 1 ? "check" : "doing" } }));
  return { id, title, problem: `${places.join(", ")}의 자리를 찾아요. ${clues.map(placeClueText).join(" ")} ${mark} 자리에는 무엇이 있을까요?`, figure: { kind: "compass", rows: empty, ask: [ask], askLabel: mark, tone: "given" }, steps, answer: `${mark} 자리에는 ${josa(ans, "이")} 있어요.`, value: { kind: "place", places, clues, ask, ans } };
}
// 원탁: seats = 자리 이름(맨 위부터 시계 바늘이 도는 쪽), fixed = { 이름: 자리 번호 }, clues = [{ t: "opp" | "left" | "right", a, b }]
const roundClueText = (c) => (c.t === "opp" ? `${josa(c.a, "은")} ${c.b}의 맞은편에 앉아 있어요.` : `${josa(c.a, "은")} ${c.b}의 ${c.t === "left" ? "왼쪽" : "오른쪽"}에 앉아 있어요.`);
function roundExample({ id, title, seats, fixed, names, clues, plan, ask, ans }) {
  const show = (placed, hi) => seats.map((seat, i) => ({ seat, name: Object.entries(placed).find(([, s]) => s === i)?.[0] }));
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "round", seats: show(p.placed), hi: p.hi, arrow: p.arrow, tone: i === plan.length - 1 ? "check" : "doing" } }));
  const all = [...Object.keys(fixed), ...names];
  return { id, title, problem: `${all.join(", ")} ${all.length}명이 둥근 식탁에 앉아 있어요. ${Object.entries(fixed).map(([n]) => `${josa(n, "은")} 그림의 자리에 앉아 있고,`).join(" ")} ${clues.map(roundClueText).join(" ")} ${josa(ask, "은")} 어느 자리에 앉아 있을까요?`, figure: { kind: "round", seats: show(fixed), tone: "given" }, steps, answer: `${josa(ask, "은")} ${ans} 자리예요.`, value: { kind: "round", seats, fixed, names, clues, ask, ans } };
}
// O/X 표: clues = [{ t: "is" | "not" | "oneOf", p, c | cs }]. verbs = { is: "좋아해요", not: "좋아하지 않아요", adn: "좋아하는" }
const oxClueText = (c, v) => ("text" in c ? c.text : c.t === "is" ? `${josa(c.p, "은")} ${josa(c.c, "을")} ${v.is}.` : c.t === "not" ? `${josa(c.p, "은")} ${josa(c.c, "을")} ${v.not}.` : `${josa(c.p, "은")} ${c.cs.join(", ")} 중 하나를 ${v.is}.`);
function oxExample({ id, title, people, choices, clues, verbs, what, plan, ask, ans }) {
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "ox", people, choices, marks: p.marks, hi: p.hi, tone: i === plan.length - 1 ? "check" : "doing" } }));
  return { id, title, problem: `${josa(people.join(", "), "이")} ${choices.join(", ")} 중에서 서로 다른 ${josa(what, "을")} 하나씩 ${verbs.is}. ${clues.map((c) => oxClueText(c, verbs)).filter(Boolean).join(" ")} ${josa(ask, "이")} ${verbs.adn} ${josa(what, "은")} 무엇일까요?`, figure: { kind: "ox", people, choices, marks: {}, tone: "given" }, steps, answer: `${josa(ask, "은")} ${josa(ans, "이에요")}.`, value: { kind: "ox", people, choices, clues, ask, ans } };
}
// 지금까지 정한 짝(assigns)은 O, 그 사람의 다른 칸과 그 물건의 다른 사람 칸은 X, xs는 조건으로 지운 칸
function oxMarks(people, choices, assigns, xs = []) {
  const m = {};
  for (const [p, c] of xs) m[`${p}|${c}`] = "X";
  for (const [p, c] of assigns) { for (const cc of choices) m[`${p}|${cc}`] = "X"; for (const pp of people) m[`${pp}|${c}`] = "X"; m[`${p}|${c}`] = "O"; }
  return m;
}
const LIKE = { is: "좋아해요", not: "좋아하지 않아요", adn: "좋아하는" };
const LOGIC_SET = {
  id: "logic",
  types: {
    "조건으로 순서 정하기": () => [
      runOrderExample({ id: "ord-1", title: "예제 1", people: ["A", "B", "C", "D"], clues: [{ t: "first", p: "B" }, { t: "last", p: "D" }, { t: "before", a: "A", b: "C" }], seq: ["B", "A", "C", "D"], plan: [
        { text: "B 앞에 달리는 사람이 없으니 B가 1등이에요.", names: ["B", null, null, null], hi: [0] },
        { text: "D는 맨 뒤라 4등이에요.", names: ["B", null, null, "D"], hi: [3] },
        { text: "남은 2등, 3등에 A와 C가 들어가요. A가 C보다 앞이라 A가 2등, C가 3등.", names: ["B", "A", "C", "D"], hi: [1, 2] }
      ] }),
      runOrderExample({ id: "ord-2", title: "예제 2", people: ["준", "민", "솔"], clues: [{ t: "notLast", p: "솔" }, { t: "between", p: "민", a: "준", b: "솔" }], seq: ["솔", "민", "준"], plan: [
        { text: "민은 두 사람 사이에서 달리니 가운데, 2등이에요.", names: [null, "민", null], hi: [1] },
        { text: "솔은 맨 뒤가 아니라 1등, 남은 준이 3등이에요.", names: ["솔", "민", "준"], hi: [0, 2] }
      ] })
    ],
    // 1권 앞뒤 순서
    "달리기 순서": () => [
      runOrderExample({ id: "run-1", title: "예제 1", people: ["가람", "나리", "다온"], clues: [{ t: "only", a: "나리", b: "다온" }], seq: ["다온", "나리", "가람"], plan: [
        { text: "나리의 앞에는 다온만 있으니 다온이 1등, 나리가 2등이에요.", names: ["다온", "나리", null], hi: [0, 1] },
        { text: "남은 가람이 3등이에요.", names: ["다온", "나리", "가람"], hi: [2] }
      ] }),
      runOrderExample({ id: "run-2", title: "예제 2", people: ["가람", "나리", "다온", "라희"], clues: [{ t: "next", a: "라희", b: "가람" }, { t: "last", p: "나리" }, { t: "before", a: "다온", b: "라희" }], seq: ["다온", "라희", "가람", "나리"], plan: [
        { text: "나리는 맨 뒤라 4등이에요.", names: [null, null, null, "나리"], hi: [3] },
        { text: "가람은 라희 바로 뒤라 두 사람은 붙어서 달려요. 1·2등이거나 2·3등이에요.", names: [null, null, null, "나리"], hi: [0, 1, 2] },
        { text: "다온은 라희보다 앞이라 다온 1등, 라희 2등, 가람 3등.", names: ["다온", "라희", "가람", "나리"], hi: [0, 1, 2] }
      ] })
    ],
    "앞에서 세기": () => [lineCountExample({ id: "front-1", title: "예제 1", names: ["솔", "별", "윤", "담", "현"], from: "front", k: 4 })],
    "뒤에서 세기": () => [lineCountExample({ id: "back-1", title: "예제 1", names: ["솔", "별", "윤", "담", "현"], from: "back", k: 2 })],
    "줄에서 앞뒤 순서 세기": () => [
      rowCountExample({ id: "row-1", title: "예제 1", cons: [{ who: "준서", from: "front", k: 8 }, { who: "준서", from: "back", k: 4 }] }),
      rowCountExample({ id: "row-2", title: "예제 2", cons: [{ who: "민서", from: "front", k: 5 }, { who: "하준", from: "back", k: 3 }], between: { a: "민서", b: "하준", count: 4 } })
    ],
    "동서남북 익히기": () => [compassGridExample({ id: "comp-1", title: "예제 1", rows: [["사", "자", "가"], ["바", "마", "나"], ["아", "라", "다"]], asks: [["마", "북"], ["라", "서"], ["나", "남"], ["바", "동"]] })],
    "동서남북 자리배치": () => [placeExample({ id: "place-1", title: "예제 1", places: ["우체국", "공원", "병원", "도서관"], clues: [["공원", "북", "병원"], ["도서관", "서", "공원"]], ask: [1, 0], ans: "우체국", mark: "㉮", plan: [
      { text: "공원은 병원의 북쪽이라 둘은 위아래로 붙어 있어요. 공원의 서쪽에 도서관이 있으려면 공원은 오른쪽 줄이에요.", rows: [[null, "공원"], [null, "병원"]], hi: [[0, 1], [1, 1]] },
      { text: "도서관은 공원의 서쪽, 왼쪽 위 칸이에요.", rows: [["도서관", "공원"], [null, "병원"]], hi: [[0, 0]] },
      { text: "남은 왼쪽 아래 칸 ㉮에는 우체국이 있어요.", rows: [["도서관", "공원"], ["우체국", "병원"]], hi: [[1, 0]] }
    ] })],
    "원탁 이웃 자리 논리": () => [roundExample({ id: "round-1", title: "예제 1", seats: ["", "㉮", "㉯", "㉰"], fixed: { 지호: 0 }, names: ["서윤", "하린", "도윤"], clues: [{ t: "opp", a: "서윤", b: "지호" }, { t: "left", a: "하린", b: "서윤" }], ask: "도윤", ans: "㉮", plan: [
      { text: "서윤은 지호의 맞은편, 아래 자리 ㉯에 앉아요.", placed: { 지호: 0, 서윤: 2 }, hi: [2] },
      { text: "식탁 가운데를 보고 앉으면 내 왼쪽은 시계 바늘이 도는 쪽 옆자리예요. 서윤의 왼쪽은 ㉰라 하린이 앉아요.", placed: { 지호: 0, 서윤: 2, 하린: 3 }, hi: [3], arrow: true },
      { text: "남은 ㉮ 자리에 도윤이 앉아요.", placed: { 지호: 0, 서윤: 2, 하린: 3, 도윤: 1 }, hi: [1] }
    ] })],
    "표로 정리하는 서로 다른 선택": () => {
      const people = ["지우", "태오", "소은"], choices = ["사과", "딸기", "수박"], M = (a, x) => oxMarks(people, choices, a, x);
      return [oxExample({ id: "ox-1", title: "예제 1", people, choices, what: "과일", verbs: { is: "좋아해요", not: "좋아하지 않아요", adn: "좋아하는" }, ask: "소은", ans: "사과",
        clues: [{ t: "not", p: "지우", c: "사과" }, { t: "is", p: "태오", c: "수박" }], plan: [
          { text: "태오는 수박을 좋아해요. 태오-수박에 O, 태오의 다른 칸과 수박의 다른 칸에 X.", marks: M([["태오", "수박"]]), hi: ["태오|수박"] },
          { text: "지우는 사과를 좋아하지 않아요. 지우에게 남은 칸은 딸기뿐이라 O.", marks: M([["태오", "수박"], ["지우", "딸기"]], [["지우", "사과"]]), hi: ["지우|딸기"] },
          { text: "소은에게 남은 칸은 사과뿐이에요.", marks: M([["태오", "수박"], ["지우", "딸기"], ["소은", "사과"]], [["지우", "사과"]]), hi: ["소은|사과"] }
        ] })];
    },
    "가능한 선택을 지우는 표 논리": () => {
      const people = ["하나", "두리", "세나", "네오"], choices = ["연필", "지우개", "공책", "자"], M = (a, x) => oxMarks(people, choices, a, x);
      const xs = [["하나", "지우개"], ["하나", "자"], ["두리", "연필"], ["두리", "지우개"], ["세나", "자"]];
      return [oxExample({ id: "ox-2", title: "예제 1", people, choices, what: "학용품", verbs: { is: "골랐어요", not: "고르지 않았어요", adn: "고른" }, ask: "두리", ans: "자",
        clues: [{ t: "oneOf", p: "하나", cs: ["연필", "공책"] }, { t: "oneOf", p: "두리", cs: ["공책", "자"] }, { t: "not", p: "세나", c: "자" }, { t: "is", p: "네오", c: "연필" }], plan: [
          { text: "조건으로 안 되는 칸부터 X로 지워요. 하나는 연필이나 공책, 두리는 공책이나 자, 세나는 자가 아니에요.", marks: M([], xs), hi: [] },
          { text: "네오는 연필을 골랐어요. 하나에게 연필이 없어지니 하나는 공책이에요.", marks: M([["네오", "연필"], ["하나", "공책"]], xs), hi: ["네오|연필", "하나|공책"] },
          { text: "두리는 공책이나 자인데 공책은 하나 것이라 자. 남은 세나는 지우개예요.", marks: M([["네오", "연필"], ["하나", "공책"], ["두리", "자"], ["세나", "지우개"]], xs), hi: ["두리|자"] }
        ] })];
    },
    // 1권 「좋아하는 것을 찾아요」: 조건 문장은 text로 쓰고, 검사기는 t·p·c(cs)만 본다
    "두 사람의 과일 추리": () => {
      const people = ["지민", "현우"], choices = ["배", "귤"], M = (a, x) => oxMarks(people, choices, a, x);
      return [oxExample({ id: "ox-two", title: "예제 1", people, choices, what: "과일", verbs: LIKE, ask: "지민", ans: "배",
        clues: [{ t: "is", p: "현우", c: "귤", text: "지민의 친구 현우는 귤을 좋아해요." }], plan: [
          { text: "현우는 귤을 좋아해요. 현우-귤에 O, 현우의 배 칸과 지민의 귤 칸에 X.", marks: M([["현우", "귤"]]), hi: ["현우|귤"] },
          { text: "지민에게 남은 칸은 배뿐이에요.", marks: M([["현우", "귤"], ["지민", "배"]]), hi: ["지민|배"] }
        ] })];
    },
    "세 사람의 운동 추리": () => {
      const people = ["가온", "나래", "다솜"], choices = ["스케이트", "야구", "수영"], M = (a, x) => oxMarks(people, choices, a, x);
      return [oxExample({ id: "ox-sport", title: "예제 1", people, choices, what: "운동", verbs: LIKE, ask: "다솜", ans: "수영",
        clues: [{ t: "is", p: "가온", c: "스케이트", text: "가온은 얼음 위에서 하는 운동을 좋아해요." }, { t: "not", p: "나래", c: "수영", text: "나래는 물에 들어가는 운동을 좋아하지 않아요." }], plan: [
          { text: "얼음 위에서 하는 운동은 스케이트예요. 가온-스케이트에 O, 가온의 다른 칸과 스케이트의 다른 칸에 X.", marks: M([["가온", "스케이트"]]), hi: ["가온|스케이트"] },
          { text: "물에 들어가는 운동은 수영이라 나래-수영에 X. 나래에게 남은 칸은 야구예요.", marks: M([["가온", "스케이트"], ["나래", "야구"]], [["나래", "수영"]]), hi: ["나래|야구"] },
          { text: "다솜에게 남은 칸은 수영뿐이에요.", marks: M([["가온", "스케이트"], ["나래", "야구"], ["다솜", "수영"]], [["나래", "수영"]]), hi: ["다솜|수영"] }
        ] })];
    },
    "세 사람의 과일 추리": () => {
      const people = ["루아", "보미", "찬"], choices = ["감", "자두", "망고"], M = (a, x) => oxMarks(people, choices, a, x), xs = [["루아", "감"], ["루아", "망고"]];
      return [oxExample({ id: "ox-fruit3", title: "예제 1", people, choices, what: "과일", verbs: LIKE, ask: "보미", ans: "망고",
        clues: [{ t: "not", p: "루아", c: "감", text: "루아는 감과 망고를 좋아하지 않아요." }, { t: "not", p: "루아", c: "망고", text: "" }, { t: "is", p: "찬", c: "감", text: "찬은 감을 좋아해요." }], plan: [
          { text: "싫어하는 것부터 X로 지워요. 루아-감, 루아-망고에 X라 루아는 자두예요.", marks: M([["루아", "자두"]], xs), hi: ["루아|자두"] },
          { text: "찬은 감을 좋아해요. 찬-감에 O.", marks: M([["루아", "자두"], ["찬", "감"]], xs), hi: ["찬|감"] },
          { text: "보미에게 남은 칸은 망고뿐이에요.", marks: M([["루아", "자두"], ["찬", "감"], ["보미", "망고"]], xs), hi: ["보미|망고"] }
        ] })];
    },
    "직업과 동물 추리": () => {
      const people = ["한별", "유나", "시우"], choices = ["코끼리", "상어", "독수리"], M = (a, x) => oxMarks(people, choices, a, x);
      return [oxExample({ id: "ox-job", title: "예제 1", people, choices, what: "동물", verbs: LIKE, ask: "유나", ans: "상어",
        clues: [{ t: "is", p: "시우", c: "독수리", text: "한별은 경찰관이고 시우는 요리사예요. 요리사는 하늘을 나는 동물을 좋아해요." }, { t: "not", p: "한별", c: "상어", text: "경찰관은 바다에 사는 동물을 좋아하지 않아요." }], plan: [
          { text: "요리사는 시우예요. 하늘을 나는 동물은 독수리라 시우-독수리에 O.", marks: M([["시우", "독수리"]]), hi: ["시우|독수리"] },
          { text: "경찰관은 한별이에요. 바다에 사는 상어는 한별이 아니니 X, 한별에게 남은 칸은 코끼리예요.", marks: M([["시우", "독수리"], ["한별", "코끼리"]], [["한별", "상어"]]), hi: ["한별|코끼리"] },
          { text: "유나에게 남은 칸은 상어뿐이에요.", marks: M([["시우", "독수리"], ["한별", "코끼리"], ["유나", "상어"]], [["한별", "상어"]]), hi: ["유나|상어"] }
        ] })];
    }
  }
};

// ───────────────────────── 3·8권 복면산(벌레 먹은 셈) ─────────────────────────
// 같은 모양 = 같은 숫자, 다른 모양 = 다른 숫자, 맨 앞자리는 0이 아니다. 일의 자리부터 받아올림을 따져 하나씩 정한다.
// 그림 kind "crypt"(세로 덧셈판). value.puzzle = 검사기가 0~9를 다 넣어 풀어 보는 식, value.ask = 무엇을 묻는지.
const symAnswer = (sol) => `${Object.entries(sol).map(([s, d], i, a) => (i === a.length - 1 ? `${josa(s, "은")} ${josa(d, "이에요")}` : `${josa(s, "은")} ${d}`)).join(", ")}.`;
function cryptExample({ id, title, addends, sum, problem, plan, ask = { kind: "all" }, sol = {}, answer, distinct = true, pool = null }) {
  const fig = (tone, p = {}) => ({ kind: "crypt", addends, sum, reveal: p.reveal, blanks: p.blanks, focus: p.focus, carry: p.carry, tone });
  const steps = plan.map((p, i) => ({ text: p.text, figure: fig(i === plan.length - 1 ? "check" : "doing", p) }));
  return { id, title, problem, figure: fig("given"), steps, answer: answer || symAnswer(sol), value: { puzzle: { addends, sum, distinct, pool }, ask, sol } };
}
const POOL8 = ["1", "2", "3", "4", "5", "6", "7", "8"];
const CRYPT_SET = {
  id: "crypt",
  types: {
    // 3권 같은 도형을 세로로 더해요
    "반복 덧셈 복면산의 가장 큰 앞자리": () => [cryptExample({ id: "cr-max-1", title: "예제 1", addends: ["□", "□", "□", "□"], sum: "△◇", problem: "□ + □ + □ + □ = △◇예요. △에 들어갈 수 있는 가장 큰 수는 무엇일까요?", ask: { kind: "max", sym: "△" }, answer: "△에 들어갈 수 있는 가장 큰 수는 3이에요.", plan: [
      { text: "□가 클수록 합도 커요. 한 자리 수 중 가장 큰 9를 넣어 봐요." },
      { text: "9 + 9 + 9 + 9 = 36이라 합은 36보다 클 수 없어요. 앞자리 △도 3보다 클 수 없어요.", reveal: { "□": 9, "△": 3, "◇": 6 }, focus: 1 },
      { text: "9를 넣으면 △가 정말 3이 돼요. 가장 큰 △는 3.", reveal: { "□": 9, "△": 3, "◇": 6 }, focus: 1 }
    ] })],
    "같은 도형 두 번 더하기": () => [cryptExample({ id: "cr-two-1", title: "예제 1", addends: ["□", "□"], sum: "8", problem: "□ + □ = 8이에요. □가 나타내는 수를 구해요.", sol: { "□": 4 }, plan: [
      { text: "같은 수를 두 번 더해 8이 되는 수를 찾아요. 8을 똑같이 둘로 나누면 돼요.", focus: 0 },
      { text: "8 ÷ 2 = 4. 4 + 4 = 8, 맞아요.", reveal: { "□": 4 }, focus: 0 }
    ] })],
    "같은 도형 두 번 더하기와 받아올림": () => [cryptExample({ id: "cr-two-carry-1", title: "예제 1", addends: ["□", "□"], sum: "△4", problem: "□ + □ = △4예요. 각 모양이 나타내는 수를 구해요.", sol: { "□": 7, "△": 1 }, plan: [
      { text: "한 자리 수 두 개를 더하면 18보다 클 수 없어요. 그래서 앞자리 △는 1이에요.", reveal: { "△": 1 }, focus: 1 },
      { text: "□ + □ = 14. 14 ÷ 2 = 7, 7 + 7 = 14.", reveal: { "□": 7, "△": 1 }, focus: 0, carry: { 1: 1 } }
    ] })],
    "같은 도형 세 번 더하기": () => [cryptExample({ id: "cr-three-1", title: "예제 1", addends: ["□", "□", "□"], sum: "9", problem: "□ + □ + □ = 9예요. □가 나타내는 수를 구해요.", sol: { "□": 3 }, plan: [
      { text: "같은 수를 세 번 더해 9가 되려면 9를 똑같이 셋으로 나눠요.", focus: 0 },
      { text: "9 ÷ 3 = 3. 3 + 3 + 3 = 9, 맞아요.", reveal: { "□": 3 }, focus: 0 }
    ] })],
    "같은 도형 세 번 더하기와 받아올림": () => [cryptExample({ id: "cr-three-carry-1", title: "예제 1", addends: ["□", "□", "□"], sum: "△4", problem: "□ + □ + □ = △4예요. 각 모양이 나타내는 수를 구해요.", sol: { "□": 8, "△": 2 }, plan: [
      { text: "□를 세 번 더한 수의 끝자리가 4예요. 3단 곱셈에서 끝자리가 4인 것을 찾아요.", focus: 0 },
      { text: "3 × 8 = 24, 끝자리가 4인 건 이것뿐이에요. □ = 8.", reveal: { "□": 8 }, focus: 0, carry: { 1: 1 } },
      { text: "8 + 8 + 8 = 24라 △ = 2.", reveal: { "□": 8, "△": 2 }, focus: 1 }
    ] })],
    // 3권 반복되는 숫자
    "반복 숫자 복면산": () => [cryptExample({ id: "cr-rep-1", title: "예제 1", addends: ["□□", "□□"], sum: "66", problem: "□□ + □□ = 66이에요. □가 나타내는 수를 구해요.", sol: { "□": 3 }, plan: [
      { text: "일의 자리부터 봐요. □ + □의 끝자리가 6이에요. □는 3이거나 8이에요.", focus: 0 },
      { text: "8이면 8 + 8 = 16이라 받아올림이 생겨 십의 자리가 8 + 8 + 1 = 17이 돼요. 66이 안 돼요.", reveal: { "□": 8 }, focus: 1 },
      { text: "□ = 3이면 33 + 33 = 66, 맞아요.", reveal: { "□": 3 }, focus: 1 }
    ] })],
    // 3권 여러 도형과 고정 숫자
    "여러 도형과 고정 숫자 복면산": () => [cryptExample({ id: "cr-mix-1", title: "예제 1", addends: ["△□", "□"], sum: "50", problem: "△□ + □ = 50이에요. 다른 모양은 다른 수예요. 각 모양이 나타내는 수를 구해요.", sol: { "△": 4, "□": 5 }, plan: [
      { text: "일의 자리: □ + □의 끝자리가 0이에요. □는 0이나 5인데, 맨 앞자리라 0은 안 돼요. □ = 5.", reveal: { "□": 5 }, focus: 0, carry: { 1: 1 } },
      { text: "5 + 5 = 10이라 십의 자리로 1을 받아올려요. △ + 1 = 5, △ = 4.", reveal: { "□": 5, "△": 4 }, focus: 1, carry: { 1: 1 } },
      { text: "45 + 5 = 50, 맞아요.", reveal: { "□": 5, "△": 4 } }
    ] })],
    // 3권 연결 조건
    "자리 사이가 연결된 복면산": () => [cryptExample({ id: "cr-link-1", title: "예제 1", addends: ["□△", "□"], sum: "△3", problem: "□△ + □ = △3이에요. 다른 모양은 다른 수예요. 각 모양이 나타내는 수를 구해요.", sol: { "□": 6, "△": 7 }, plan: [
      { text: "십의 자리: □에 받아올림이 더해져 △가 돼요. △는 □와 같거나 1 커요. 다른 모양이라 △ = □ + 1, 일의 자리에서 받아올림이 있어요.", focus: 1, carry: { 1: 1 } },
      { text: "일의 자리: △ + □ = 13(받아올림 1). △ = □ + 1이니 □ + 1 + □ = 13, □ + □ = 12, □ = 6.", reveal: { "□": 6 }, focus: 0, carry: { 1: 1 } },
      { text: "△ = 6 + 1 = 7. 67 + 6 = 73, 맞아요.", reveal: { "□": 6, "△": 7 }, carry: { 1: 1 } }
    ] })],
    // 8권 피라미드
    "같은 모양만 있는 피라미드": () => [cryptExample({ id: "cr-pyr-1", title: "예제 1", addends: ["□", "□□", "□□□"], sum: "369", problem: "□ + □□ + □□□ = 369예요. □에 알맞은 숫자를 구해요.", sol: { "□": 3 }, plan: [
      { text: "일의 자리에 □가 세 개예요. □ + □ + □의 끝자리가 9라 □는 3이에요(3 × 3 = 9).", reveal: { "□": 3 }, focus: 0 },
      { text: "3 + 33 + 333 = 369, 맞아요.", reveal: { "□": 3 } }
    ] })],
    "모양이 다양한 피라미드": () => [cryptExample({ id: "cr-pyr-2", title: "예제 1", addends: ["○", "○△"], sum: "83", problem: "○ + ○△ = 83이에요. 다른 모양은 다른 숫자예요. 각 모양에 알맞은 숫자를 구해요.", sol: { "○": 7, "△": 6 }, plan: [
      { text: "○△는 80쯤이라 ○는 7이나 8이에요. 8이면 80 + 8 = 88보다 커서 83이 안 돼요.", focus: 1 },
      { text: "○ = 7이면 7 + 7△ = 83, 7△ = 76이라 △ = 6.", reveal: { "○": 7, "△": 6 }, focus: 0 },
      { text: "7 + 76 = 83, 맞아요.", reveal: { "○": 7, "△": 6 } }
    ] })],
    "빈칸의 합": () => [cryptExample({ id: "cr-blank-1", title: "예제 1", addends: ["__", "_"], sum: "105", distinct: false, problem: "빈칸에 숫자를 넣어 두 자리 수 + 한 자리 수 = 105를 만들어요. 빈칸 세 개에 들어갈 숫자의 합을 구해요.", ask: { kind: "blankSum" }, answer: "빈칸의 합은 24예요.", plan: [
      { text: "두 자리 수 + 한 자리 수가 105가 되려면 두 자리 수가 96보다 커야 해요. 십의 자리는 9.", blanks: [9], focus: 1 },
      { text: "남은 두 빈칸(일의 자리끼리)을 더하면 105 − 90 = 15예요. 96 + 9, 97 + 8, 98 + 7, 99 + 6 모두 그래요.", blanks: [9, 6, 9], focus: 0 },
      { text: "어느 경우든 9 + 15 = 24.", blanks: [9, 6, 9] }
    ] })],
    "빈칸의 합 · 답이 여러 가지": () => [cryptExample({ id: "cr-blank-2", title: "예제 1", addends: ["__", "__"], sum: "100", distinct: false, problem: "빈칸에 숫자를 넣어 두 자리 수 + 두 자리 수 = 100을 만들어요. 빈칸 네 개에 들어갈 숫자의 합은 얼마일까요? 답이 여러 개면 모두 써요.", ask: { kind: "blankSum" }, answer: "10과 19, 두 가지예요.", plan: [
      { text: "일의 자리 두 수의 합은 0이거나 10이에요(끝자리가 0).", focus: 0 },
      { text: "일의 자리 합이 10이면 1을 받아올려 십의 자리 합은 9. 빈칸의 합 10 + 9 = 19. 예: 45 + 55.", blanks: [4, 5, 5, 5], focus: 1, carry: { 1: 1 } },
      { text: "일의 자리 합이 0이면(둘 다 0) 십의 자리 합은 10. 빈칸의 합 0 + 10 = 10. 예: 30 + 70.", blanks: [3, 0, 7, 0], focus: 1 }
    ] })],
    // 8권 복면산 연습
    "모양 복면산": () => [cryptExample({ id: "cr-shape-1", title: "예제 1", addends: ["□3", "6□"], sum: "○○8", problem: "□3 + 6□ = ○○8이에요. 다른 모양은 다른 숫자예요. 각 모양에 알맞은 숫자를 구해요.", sol: { "□": 5, "○": 1 }, plan: [
      { text: "두 자리 수 두 개의 합은 200보다 작아요. 백의 자리 ○는 1이에요.", reveal: { "○": 1 }, focus: 2 },
      { text: "일의 자리: 3 + □의 끝자리가 8이라 □ = 5(받아올림 없음).", reveal: { "○": 1, "□": 5 }, focus: 0 },
      { text: "십의 자리: 5 + 6 = 11, 끝자리 1이 ○와 같아요. 53 + 65 = 118, 맞아요.", reveal: { "○": 1, "□": 5 }, focus: 1, carry: { 2: 1 } }
    ] })],
    "1~8을 한 번씩 쓰는 복면산": () => [cryptExample({ id: "cr-pool-1", title: "예제 1", addends: ["_3_", "_8"], sum: "_㉠_", distinct: false, pool: POOL8, problem: "1부터 8까지의 숫자를 한 번씩만 써서 □3□ + □8 = □㉠□를 만들어요. ㉠에 알맞은 숫자를 구해요.", ask: { kind: "mark" }, answer: "㉠은 1이에요.", plan: [
      { text: "3과 8은 이미 썼어요. 남은 숫자는 1, 2, 4, 5, 6, 7, 여섯 칸에 하나씩 들어가요." },
      { text: "일의 자리: □ + 8의 끝자리도 1~8이어야 해서 받아올림이 생겨요. 끝자리는 더한 수보다 2 작아요(4 + 8 = 12처럼).", focus: 0, carry: { 1: 1 } },
      { text: "남은 숫자로 맞춰 보면 534 + 78 = 612 하나뿐이에요. 일의 자리 4 + 8 = 12, 십의 자리 3 + 7 + 1 = 11, 백의 자리 5 + 1 = 6.", blanks: [5, 4, 7, 6, 1, 2], carry: { 1: 1, 2: 1 } }
    ] })],
    "같은 수를 여러 번 더하는 복면산": () => [cryptExample({ id: "cr-many-1", title: "예제 1", addends: ["□", "□", "□", "□", "□"], sum: "2□", problem: "□ + □ + □ + □ + □ = 2□예요. □에 알맞은 숫자를 구해요.", sol: { "□": 5 }, plan: [
      { text: "□를 다섯 번 더한 수의 끝자리가 다시 □예요. 5단에서 끝자리가 처음 수와 같은 건 0이나 5예요.", focus: 0 },
      { text: "0은 앞자리라 안 되고, 5 × 5 = 25. 앞자리도 2로 맞아요.", reveal: { "□": 5 }, focus: 1 }
    ] })],
    "받아올림이 있는 모양 복면산": () => [cryptExample({ id: "cr-carry-1", title: "예제 1", addends: ["○□", "□"], sum: "□2", problem: "○□ + □ = □2예요. 다른 모양은 다른 숫자예요. 각 모양에 알맞은 숫자를 구해요.", sol: { "○": 5, "□": 6 }, plan: [
      { text: "십의 자리: ○에 받아올림이 더해져 □가 돼요. 다른 모양이라 □ = ○ + 1, 일의 자리에서 받아올림이 있어요.", focus: 1, carry: { 1: 1 } },
      { text: "일의 자리: □ + □ = 12(받아올림 1). □ = 6.", reveal: { "□": 6 }, focus: 0, carry: { 1: 1 } },
      { text: "○ = 6 − 1 = 5. 56 + 6 = 62, 맞아요.", reveal: { "□": 6, "○": 5 }, carry: { 1: 1 } }
    ] })]
  }
};

// ───────────────────────── 8권 덧셈 매트릭스 · 5권 곱셈구구로 빈칸 찾기 ─────────────────────────
// 같은 모양은 같은 수. 한 가지 모양만 있는 줄부터 풀고, 안 되면 같은 모양 묶음(○ + □)을 한 덩어리로 본다.
// 합·곱은 values에서 코드가 계산한다. 그림 kind "mgrid"(칸 표 + 줄의 합·곱) · "ring"(곱셈 삼각형·고리).
const gridSums = (cells, values) => ({ rows: cells.map((r) => sum(r.map((s) => values[s]))), cols: cells[0].map((_, c) => sum(cells.map((r) => values[r[c]]))) });
function sumGridExample({ id, title, cells, values, ask, hideOthers = false, plan }) {
  const { rows, cols } = gridSums(cells, values), total = ask.row !== undefined ? rows[ask.row] : cols[ask.col];
  const rowVals = rows.map((v, i) => (ask.row === i ? null : hideOthers && ask.col !== undefined ? v : v)), colVals = cols.map((v, j) => (ask.col === j ? null : hideOthers ? "" : v));
  const fig = (tone, p = {}) => ({ kind: "mgrid", cells, rowVals: p.done ? rows : rowVals, colVals: p.done ? cols.map((v, j) => (hideOthers && ask.col !== j ? "" : v)) : colVals, reveal: p.reveal, focus: p.focus, op: "+", tone });
  const steps = plan.map((p, i) => ({ text: p.text, figure: fig(i === plan.length - 1 ? "check" : "doing", p) }));
  return { id, title, problem: "같은 모양은 같은 수를 나타내요. 줄마다 더한 수가 오른쪽과 아래에 있어요. ?에 알맞은 수를 구해요.", figure: fig("given"), steps, answer: `?는 ${josa(total, "이에요")}.`, value: { kind: "sum-grid", cells, rowVals, colVals, values, ask, total } };
}
function timesTableExample({ id, title, n, ask }) {
  const prods = Array.from({ length: 9 }, (_, i) => n * (i + 1));
  if (ask === "digitSum") {
    const s = prods.map((p) => String(p).split("").map(Number).reduce((a, b) => a + b, 0));
    const steps = [
      { text: `${n}단을 써요. ${prods.join(", ")}.`, figure: { kind: "seq", values: prods, tone: "doing" } },
      { text: `두 자리 곱은 십의 자리와 일의 자리를 더해요. ${prods.slice(1, 4).map((p) => `${String(p)[0]} + ${String(p)[1]} = ${s[prods.indexOf(p)]}`).join(", ")}…`, figure: { kind: "seq", values: prods, notes: prods.map((p, i) => (p > 9 ? `${String(p)[0]} + ${String(p)[1]}` : "")), tone: "doing" } },
      { text: `모두 ${josa(s[0], "이")} 나와요. 십의 자리가 1 커질 때 일의 자리가 1 작아지기 때문이에요.`, figure: { kind: "seq", values: prods, notes: s.map(String), tone: "check" } }
    ];
    return { id, title, problem: `${n}단 곱셈구구의 곱에서 각 자리의 숫자를 더하면 얼마가 될까요?`, figure: { kind: "seq", values: prods.slice(0, 4), tone: "given", ask: "?" }, steps, answer: `늘 ${josa(s[0], "이에요")}.`, value: { kind: "times", n, ask, result: [...new Set(s)] } };
  }
  const ones = prods.map((p) => p % 10), cycle = ones.slice(0, ones.indexOf(ones[0], 1) > 0 ? ones.indexOf(ones[0], 1) : 5);
  const steps = [
    { text: `${n}단을 써요. ${prods.join(", ")}.`, figure: { kind: "seq", values: prods, tone: "doing" } },
    { text: `일의 자리 숫자만 보면 ${ones.join(", ")}.`, figure: { kind: "seq", values: prods, notes: ones.map(String), tone: "doing" } },
    { text: `${josa(cycle.join(", "), "이")} 차례로 되풀이돼요.`, figure: { kind: "seq", values: prods, notes: ones.map(String), tone: "check" } }
  ];
  return { id, title, problem: `${n}단 곱셈구구의 곱에서 일의 자리 숫자는 어떤 차례로 되풀이될까요?`, figure: { kind: "seq", values: prods.slice(0, 4), tone: "given", ask: "?" }, steps, answer: `${josa(cycle.join(", "), "이")} 되풀이돼요.`, value: { kind: "times", n, ask, result: cycle } };
}
function pairProductExample({ id, title, product }) {
  const pairs = []; for (let a = 1; a <= 9; a++) for (let b = a + 1; b <= 9; b++) if (a * b === product) pairs.push([a, b]);
  const steps = [
    { text: `${product}을 두 한 자리 수의 곱으로 나타내요. 1부터 차례로 나누어 봐요.`.replace(`${product}을`, josa(product, "을")), figure: { kind: "eqs", lines: Array.from({ length: 9 }, (_, i) => i + 1).filter((a) => product % a === 0 && product / a <= 9).map((a) => `${a} × ${product / a} = ${product}`), tone: "doing" } },
    { text: `뒤의 수가 더 큰 것만 골라요. ${pairs.map(([a, b]) => `${a} × ${b}`).join(", ")}.`, figure: { kind: "eqs", lines: pairs.map(([a, b]) => `${a} × ${b} = ${product}`), tone: "check" } }
  ];
  return { id, title, problem: `A × B = ${product}이에요. A와 B는 한 자리 수이고 B가 A보다 커요. A, B를 모두 구해요.`.replace(`${product}이에요`, josa(product, "이에요")), figure: { kind: "eqs", lines: [`A × B = ${product}`], tone: "given" }, steps, answer: `${pairs.map(([a, b]) => `A = ${a}, B = ${b}`).join(" 또는 ")}이에요.`, value: { kind: "pairs", product, pairs } };
}
// 곱셈 삼각형·고리: full = 동그라미 수(꼭짓점, 맨 위부터 시계 바늘 쪽), given = 처음에 보이는 동그라미(나머지는 이름)
function ringExample({ id, title, full, given, names, plan }) {
  const n = full.length, squares = full.map((v, i) => v * full[(i + 1) % n]);
  const show = (known) => full.map((v, i) => (known.includes(i) ? v : names[i]));
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "ring", circles: show(p.known), squares, hi: p.hi, tone: i === plan.length - 1 ? "check" : "doing" } }));
  const asked = full.map((v, i) => (given.includes(i) ? null : `${names[i]} = ${v}`)).filter(Boolean);
  return { id, title, problem: `${n === 3 ? "삼각형" : "사각형"}의 동그라미에는 2부터 9까지의 수가 들어가고, 네모 안의 수는 양쪽 동그라미의 곱이에요. ${full.map((_, i) => names[i]).filter((_, i) => !given.includes(i)).join(", ")}에 알맞은 수를 구해요.`, figure: { kind: "ring", circles: show(given), squares, tone: "given" }, steps, answer: `${asked.join(", ")}이에요.`.replace(/(\d)이에요\.$/u, (m, d) => `${d}${josa(d, "이에요").slice(1)}.`), value: { kind: "ring", full, given, squares, names } };
}
function productGridExample({ id, title, cells, values, plan }) {
  const val = (v) => (/^\d+$/u.test(v) ? Number(v) : values[v]);
  const rows = cells.map((r) => r.reduce((a, v) => a * val(v), 1)), cols = cells[0].map((_, c) => cells.reduce((a, r) => a * val(r[c]), 1));
  const fig = (tone, p = {}) => ({ kind: "mgrid", cells, rowVals: rows, colVals: cols, reveal: p.reveal, focus: p.focus, op: "×", tone });
  const steps = plan.map((p, i) => ({ text: p.text, figure: fig(i === plan.length - 1 ? "check" : "doing", p) }));
  const letters = Object.keys(values);
  return { id, title, problem: `가로줄 두 수의 곱은 오른쪽에, 세로줄 두 수의 곱은 아래에 썼어요. ${letters.join(", ")}에 알맞은 수를 구해요.`, figure: fig("given"), steps, answer: `${letters.map((l, i) => (i === letters.length - 1 ? `${josa(l, "은")} ${josa(values[l], "이에요")}` : `${josa(l, "은")} ${values[l]}`)).join(", ")}.`, value: { kind: "pgrid", cells, rows, cols, values } };
}
// 2권: 도형식(같은 모양 = 같은 수). eqs = [{ terms: ["○", "△"], total }]
function shapeEqsExample({ id, title, eqs, values, ask, plan }) {
  for (const e of eqs) if (sum(e.terms.map((t) => values[t])) !== e.total) throw new Error(`${id}: 식이 맞지 않음`);
  const lines = eqs.map((e) => `${e.terms.join(" + ")} = ${e.total}`);
  const steps = plan.map((p, i) => ({ text: p.text, figure: { kind: "eqs", lines: [...lines, ...(p.add || [])], on: p.on, tone: i === plan.length - 1 ? "check" : "doing" } }));
  return { id, title, problem: `같은 모양은 같은 수예요. ${lines.join(", ")}일 때 ${ask.join(", ")}에 알맞은 수를 구해요.`, figure: { kind: "eqs", lines, tone: "given" }, steps, answer: `${josa(ask.map((a) => `${a} = ${values[a]}`).join(", "), "이에요")}.`, value: { kind: "shape-eqs", eqs, values, ask } };
}
const MATRIX_SET = {
  id: "matrix",
  types: {
    // 2권 가로와 세로의 합
    "가로와 세로의 합으로 도형값 찾기": () => [
      shapeEqsExample({ id: "seq2m-1", title: "예제 1", eqs: [{ terms: ["○", "△"], total: 11 }, { terms: ["○", "△", "△"], total: 15 }], values: { "○": 7, "△": 4 }, ask: ["△", "○"], plan: [
        { text: "둘째 식은 첫째 식보다 △가 하나 더 있어요. 15 − 11 = 4라 △ = 4.", on: [1], add: ["△ = 15 − 11 = 4"] },
        { text: "첫째 식에 넣으면 ○ + 4 = 11이라 ○ = 7.", on: [0], add: ["△ = 4", "○ = 11 − 4 = 7"] }
      ] }),
      sumGridExample({ id: "sg2-1", title: "예제 2", cells: [["◇", "◇"], ["○", "□"]], values: { "◇": 7, "○": 5, "□": 8 }, ask: { row: 1 }, plan: [
        { text: "윗줄은 ◇만 두 개예요. ◇ + ◇ = 14라 ◇ = 7.", reveal: { "◇": 7 }, focus: { row: 0 } },
        { text: "왼쪽 세로줄: 7 + ○ = 12라 ○ = 5. 오른쪽 세로줄: 7 + □ = 15라 □ = 8.", reveal: { "◇": 7, "○": 5, "□": 8 }, focus: { col: 0 } },
        { text: "?가 있는 아랫줄은 ○ + □ = 5 + 8 = 13.", reveal: { "◇": 7, "○": 5, "□": 8 }, focus: { row: 1 }, done: true }
      ] })
    ],
    // 8권 덧셈 매트릭스
    "3×3 매트릭스 · 빈 칸의 합": () => [sumGridExample({ id: "sg3-1", title: "예제 1", cells: [["△", "△", "△"], ["△", "○", "☆"], ["○", "○", "☆"]], values: { "△": 5, "○": 3, "☆": 7 }, ask: { col: 2 }, plan: [
      { text: "첫째 가로줄은 △만 세 개예요. △ + △ + △ = 15라 △ = 15 ÷ 3 = 5.", reveal: { "△": 5 }, focus: { row: 0 } },
      { text: "둘째 세로줄은 △ 하나와 ○ 두 개예요. 5 + ○ + ○ = 11이라 ○ + ○ = 6, ○ = 3.", reveal: { "△": 5, "○": 3 }, focus: { col: 1 } },
      { text: "둘째 가로줄: 5 + 3 + ☆ = 15라 ☆ = 7.", reveal: { "△": 5, "○": 3, "☆": 7 }, focus: { row: 1 } },
      { text: "?가 있는 셋째 세로줄은 △ + ☆ + ☆ = 5 + 7 + 7 = 19.", reveal: { "△": 5, "○": 3, "☆": 7 }, focus: { col: 2 }, done: true }
    ] })],
    "4×4 매트릭스 · 빈 칸의 합": () => [sumGridExample({ id: "sg4-1", title: "예제 1", cells: [["□", "□", "□", "□"], ["○", "□", "○", "○"], ["△", "☆", "☆", "○"], ["☆", "△", "□", "△"]], values: { "□": 4, "○": 2, "☆": 3, "△": 6 }, ask: { row: 3 }, plan: [
      { text: "첫째 가로줄은 □만 네 개, □ = 16 ÷ 4 = 4.", reveal: { "□": 4 }, focus: { row: 0 } },
      { text: "둘째 가로줄: ○ 세 개와 4를 더해 10이라 ○ 세 개는 6, ○ = 2.", reveal: { "□": 4, "○": 2 }, focus: { row: 1 } },
      { text: "셋째 세로줄: 4 + 2 + ☆ + 4 = 13이라 ☆ = 3. 넷째 세로줄: 4 + 2 + 2 + △ = 14라 △ = 6.", reveal: { "□": 4, "○": 2, "☆": 3, "△": 6 }, focus: { col: 2 } },
      { text: "?가 있는 넷째 가로줄은 ☆ + △ + □ + △ = 3 + 6 + 4 + 6 = 19.", reveal: { "□": 4, "○": 2, "☆": 3, "△": 6 }, focus: { row: 3 }, done: true }
    ] })],
    "2×4 매트릭스 · 묶음으로 도형값 찾기": () => [sumGridExample({ id: "sgb2-1", title: "예제 1", cells: [["○", "□", "○", "□"], ["○", "○", "○", "□"]], values: { "○": 3, "□": 4 }, ask: { col: 3 }, hideOthers: true, plan: [
      { text: "첫째 줄은 ○ + □ 묶음이 두 개예요. 14 ÷ 2 = 7이라 ○ + □ = 7.", focus: { row: 0 } },
      { text: "둘째 줄은 ○ + □ 묶음 하나와 ○ 두 개예요. 13 − 7 = 6이 ○ 두 개라 ○ = 3, □ = 7 − 3 = 4.", reveal: { "○": 3, "□": 4 }, focus: { row: 1 } },
      { text: "?가 있는 넷째 세로줄은 □ + □ = 4 + 4 = 8.", reveal: { "○": 3, "□": 4 }, focus: { col: 3 }, done: true }
    ] })],
    "3×4 매트릭스 · 묶음으로 도형값 찾기": () => [sumGridExample({ id: "sgb3-1", title: "예제 1", cells: [["○", "□", "□", "○"], ["☆", "◇", "○", "☆"], ["□", "□", "□", "○"]], values: { "○": 2, "□": 5, "☆": 4, "◇": 1 }, ask: { row: 1 }, plan: [
      { text: "첫째 가로줄은 ○ + □ 묶음이 두 개예요. 14 ÷ 2 = 7이라 ○ + □ = 7.", focus: { row: 0 } },
      { text: "셋째 가로줄은 ○ + □ 묶음 하나와 □ 두 개예요. 17 − 7 = 10이 □ 두 개라 □ = 5, ○ = 2.", reveal: { "○": 2, "□": 5 }, focus: { row: 2 } },
      { text: "첫째 세로줄: 2 + ☆ + 5 = 11이라 ☆ = 4. 둘째 세로줄: 5 + ◇ + 5 = 11이라 ◇ = 1.", reveal: { "○": 2, "□": 5, "☆": 4, "◇": 1 }, focus: { col: 0 } },
      { text: "?가 있는 둘째 가로줄은 ☆ + ◇ + ○ + ☆ = 4 + 1 + 2 + 4 = 11.", reveal: { "○": 2, "□": 5, "☆": 4, "◇": 1 }, focus: { row: 1 }, done: true }
    ] })],
    "4×4 매트릭스 · 묶음으로 도형값 찾기": () => [sumGridExample({ id: "sgb4-1", title: "예제 1", cells: [["☆", "○", "☆", "○"], ["○", "○", "○", "☆"], ["□", "△", "○", "□"], ["△", "□", "△", "☆"]], values: { "○": 3, "☆": 2, "□": 5, "△": 4 }, ask: { row: 3 }, plan: [
      { text: "첫째 가로줄은 ○ + ☆ 묶음이 두 개예요. 10 ÷ 2 = 5라 ○ + ☆ = 5.", focus: { row: 0 } },
      { text: "둘째 가로줄은 ○ + ☆ 묶음 하나와 ○ 두 개예요. 11 − 5 = 6이 ○ 두 개라 ○ = 3, ☆ = 2.", reveal: { "○": 3, "☆": 2 }, focus: { row: 1 } },
      { text: "셋째 세로줄: 2 + 3 + 3 + △ = 12라 △ = 4. 넷째 세로줄: 3 + 2 + □ + 2 = 12라 □ = 5.", reveal: { "○": 3, "☆": 2, "△": 4, "□": 5 }, focus: { col: 2 } },
      { text: "?가 있는 넷째 가로줄은 △ + □ + △ + ☆ = 4 + 5 + 4 + 2 = 15.", reveal: { "○": 3, "☆": 2, "△": 4, "□": 5 }, focus: { row: 3 }, done: true }
    ] })],
    // 5권 곱셈구구로 빈칸 찾기
    "곱셈구구의 특징": () => [timesTableExample({ id: "tt-9", title: "예제 1", n: 9, ask: "digitSum" }), timesTableExample({ id: "tt-4", title: "예제 2", n: 4, ask: "ones" })],
    "곱해서 가운데 수": () => [pairProductExample({ id: "pp-1", title: "예제 1", product: 24 })],
    "곱셈 삼각형": () => [ringExample({ id: "ring3-1", title: "예제 1", full: [4, 3, 6], given: [], names: ["A", "B", "C"], plan: [
      { text: "세 네모를 모두 곱하면 동그라미 세 개를 두 번씩 곱한 것이에요. 12 × 18 × 24 = 5184 = 72 × 72라 A × B × C = 72.", known: [], hi: [] },
      { text: "A × B = 12라 C = 72 ÷ 12 = 6. B × C = 18이라 A = 72 ÷ 18 = 4.", known: [0, 2], hi: [0, 2] },
      { text: "B = 12 ÷ 4 = 3. 확인: 3 × 6 = 18, 4 × 6 = 24, 맞아요.", known: [0, 1, 2], hi: [1] }
    ] })],
    "곱셈 고리": () => [ringExample({ id: "ring4-1", title: "예제 1", full: [3, 4, 5, 7], given: [0], names: ["", "가", "나", "다"], plan: [
      { text: "아는 동그라미 3에서 시작해요. 3 × 가 = 12라 가 = 4.", known: [0, 1], hi: [1] },
      { text: "4 × 나 = 20이라 나 = 5. 5 × 다 = 35라 다 = 7.", known: [0, 1, 2, 3], hi: [2, 3] },
      { text: "마지막 네모로 확인해요. 7 × 3 = 21, 맞아요.", known: [0, 1, 2, 3], hi: [0, 3] }
    ] })],
    "곱셈표 빈칸": () => [productGridExample({ id: "pg-1", title: "예제 1", cells: [["7", "가"], ["나", "4"]], values: { 가: 2, 나: 3 }, plan: [
      { text: "첫째 가로줄: 7 × 가 = 14라 가 = 14 ÷ 7 = 2.", reveal: { 가: 2 }, focus: { row: 0 } },
      { text: "첫째 세로줄: 7 × 나 = 21이라 나 = 3.", reveal: { 가: 2, 나: 3 }, focus: { col: 0 } },
      { text: "다른 줄로 확인해요. 3 × 4 = 12, 2 × 4 = 8, 맞아요.", reveal: { 가: 2, 나: 3 }, focus: { row: 1 } }
    ] })]
  }
};

// ───────────────────────── 5·8권 곱셈 매트릭스(2~9를 한 번씩, 줄마다 두 수) ─────────────────────────
// 줄의 곱을 2~9의 두 수로 나누어 짝 후보를 쓰고, 같은 수를 두 번 쓰지 않게 고른 뒤, 가로 짝과 세로 짝에 함께 있는 수를 그 칸에 넣는다.
// mode: "known" = 수가 들어갈 칸을 색칠해 줌 · "holes" = 색칠한 칸은 비워 둠 · "free" = 자리도 찾는다. grid = { "행,열": 수 }(코드가 곱을 계산)
const PM_N = [2, 3, 4, 5, 6, 7, 8, 9];
const pmPairs = (p) => PM_N.flatMap((a) => PM_N.filter((b) => b > a && a * b === p).map((b) => [a, b]));
const ORD = ["첫째", "둘째", "셋째", "넷째"];
function productMatrixExample({ id, title, grid, mode, letters = {}, ask }) {
  const keys = Object.keys(grid), at = (r, c) => grid[`${r},${c}`];
  const rowP = [0, 1, 2, 3].map((r) => [0, 1, 2, 3].reduce((a, c) => a * (at(r, c) ?? 1), 1)), colP = [0, 1, 2, 3].map((c) => [0, 1, 2, 3].reduce((a, r) => a * (at(r, c) ?? 1), 1));
  const rowPair = [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => at(r, c)).filter(Boolean).sort((a, b) => a - b)), colPair = [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => at(r, c)).filter(Boolean).sort((a, b) => a - b));
  const all = [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => `${r},${c}`));
  const shaded = mode === "known" ? keys : mode === "holes" ? all.filter((k) => !keys.includes(k)) : [];
  const cells = (show) => [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => { const k = `${r},${c}`; return show && grid[k] ? String(grid[k]) : letters[k] || ""; }));
  const fig = (tone, show, focus) => ({ kind: "mgrid", cells: cells(show), rowVals: rowP, colVals: colP, shaded, focus, op: "×", tone });
  const options = (ps) => ps.map((p) => `${p} = ${pmPairs(p).map(([a, b]) => `${a} × ${b}`).join(" 또는 ")}`).join(", ");
  const pairText = (pairs) => pairs.map(([a, b]) => `(${a}, ${b})`).join(", ");
  // 후보가 둘 이상인 줄: 버린 짝의 수가 다른 줄의 짝에 이미 있다
  const why = (ps, chosen) => ps.map((p, i) => { const other = chosen.filter((_, j) => j !== i).flat(), bad = pmPairs(p).filter(([a, b]) => !(a === chosen[i][0] && b === chosen[i][1])); return bad.length ? `${josa(p, "은")} ${josa(bad.map(([a, b]) => `${a} × ${b}`).join(", "), "이")} 아니에요(${josa([...new Set(bad.flat().filter((x) => other.includes(x)))].join(", "), "을")} 다른 줄에서 써요)` : null; }).filter(Boolean);
  const whyText = (ps, chosen) => { const w = why(ps, chosen); return w.length ? ` ${w.join(". ")}.` : ""; };
  const steps = [
    { text: `가로줄의 곱을 2~9의 두 수로 나눠요. ${options(rowP)}.`, figure: fig("doing", false, { col: 4 }) },
    { text: `같은 수는 한 번만 써요.${whyText(rowP, rowPair)} 가로줄은 차례로 ${pairText(rowPair)}.`, figure: fig("doing", false) },
    { text: `세로줄도 같아요. ${options(colP)}.${whyText(colP, colPair)} 세로줄은 차례로 ${pairText(colPair)}.`, figure: fig("doing", false) },
    { text: `가로줄 짝과 세로줄 짝에 함께 들어 있는 수가 그 칸의 수예요.${mode === "free" ? " 그래서 수가 들어갈 자리도 정해져요." : ""}`, figure: fig("check", true) }
  ];
  let answer;
  if (ask === "letters") { const ls = Object.entries(letters); answer = `${ls.map(([k, l], i) => (i === ls.length - 1 ? `${josa(l, "은")} ${josa(grid[k], "이에요")}` : `${josa(l, "은")} ${grid[k]}`)).join(", ")}.`; }
  else if (ask === "pairs") answer = `가로줄은 ${pairText(rowPair)}, 세로줄은 ${josa(pairText(colPair), "이에요")}.`;
  else answer = `${[0, 1, 2, 3].map((r) => `${ORD[r]} 줄 ${[0, 1, 2, 3].map((c) => at(r, c) ?? "빈칸").join(", ")}`).join(" · ")}이에요.`;
  const what = ask === "letters" ? `${Object.values(letters).join(", ")}에 알맞은 수를 구해요.` : ask === "pairs" ? "가로줄마다, 세로줄마다 들어가는 두 수를 구해요." : "매트릭스를 완성해요.";
  const where = mode === "known" ? "색칠한 칸에" : mode === "holes" ? "색칠하지 않은 칸에(색칠한 칸은 비워요)" : "줄마다 두 칸에";
  return { id, title, problem: `2부터 9까지의 수를 한 번씩 ${where} 넣어, 가로줄 두 수의 곱은 오른쪽에, 세로줄 두 수의 곱은 아래에 오게 했어요. ${what}`, figure: fig("given", false), steps, answer, value: { kind: "pmatrix", mode, grid, rowP, colP, letters, ask, rowPair, colPair } };
}
const g = (o) => o;
const PMATRIX_SET = {
  id: "pmatrix",
  types: {
    "카드 곱 매트릭스": () => [productMatrixExample({ id: "pm-card-1", title: "예제 1", mode: "known", ask: "letters", letters: { "3,2": "A" }, grid: g({ "0,0": 6, "1,3": 5, "2,1": 9, "3,2": 3, "0,2": 7, "1,1": 2, "2,0": 4, "3,3": 8 }) })],
    "곱셈 매트릭스": () => [productMatrixExample({ id: "pm-ab-1", title: "예제 1", mode: "known", ask: "letters", letters: { "0,1": "A", "2,3": "B" }, grid: g({ "0,1": 8, "1,0": 4, "2,3": 2, "3,2": 3, "0,2": 6, "1,3": 7, "2,0": 5, "3,1": 9 }) })],
    "곱셈 매트릭스 도전": () => [productMatrixExample({ id: "pm-full-1", title: "예제 1", mode: "free", ask: "full", grid: g({ "0,0": 6, "1,3": 9, "2,1": 7, "3,2": 3, "0,2": 5, "1,0": 2, "2,3": 4, "3,1": 8 }) })],
    "색칠 칸이 있는 곱셈 매트릭스": () => [productMatrixExample({ id: "pm-holes-1", title: "예제 1", mode: "holes", ask: "pairs", grid: g({ "0,2": 4, "1,3": 8, "2,0": 5, "3,1": 3, "0,1": 2, "1,0": 6, "2,2": 7, "3,3": 9 }) })],
    "두 칸씩 넣는 곱셈 매트릭스": () => [productMatrixExample({ id: "pm-pairs-1", title: "예제 1", mode: "free", ask: "pairs", grid: g({ "0,1": 8, "1,3": 7, "2,2": 3, "3,0": 4, "0,3": 5, "1,2": 9, "2,0": 2, "3,1": 6 }) })]
  }
};

// ───────────────────────── 2권 가르기 · 같은 수의 묶음 · 도형식 · 수열 · 자라는 모양 · 숫자 약속 ─────────────────────────
// 수열은 「늘어난 수」를 먼저 본다: 늘 같으면 등차, 몇 배면 등비, 늘어난 수가 1씩 커지면 계차, 앞의 두 수를 더하면 피보나치 꼴.
// 값은 모두 코드가 계산하고, 검사기는 규칙마다 따로 다음 수를 만들어 본다.
const HOW_MANY = { 2: "두", 3: "세", 4: "네" };
function splitExample({ id, title, value, parts }) {
  const levels = [[value]]; let cur = value;
  for (const p of parts) { cur /= p; if (!Number.isInteger(cur)) throw new Error(`${id}: 나누어떨어지지 않음`); levels.push(Array(levels.at(-1).length * p).fill(cur)); }
  const hide = (k) => levels.map((lv, i) => (i <= k ? lv : lv.map(() => null)));
  const steps = parts.map((p, i) => ({ text: `${josa(levels[i][0], "을")} ${HOW_MANY[p]} 수로 똑같이 가르면 ${levels[i][0]} ÷ ${p} = ${levels[i + 1][0]}.${p === 2 ? ` ${levels[i + 1][0]} + ${levels[i + 1][0]} = ${levels[i][0]}, 맞아요.` : ""}`, figure: { kind: "tree", levels: hide(i + 1), tone: i === parts.length - 1 ? "check" : "doing" } }));
  if (steps.length === 1) steps.unshift({ text: `똑같이 가르면 나뉜 수가 모두 같아요. 같은 수 ${HOW_MANY[parts[0]]} 개를 더해 ${josa(value, "이")} 되는 수를 찾아요.`, figure: { kind: "tree", levels: hide(0), tone: "doing" } });
  const what = parts.length > 1 ? `${josa(value, "을")} 먼저 두 수로, 다시 ${levels.at(-1).length}개의 수로 똑같이 가를 때 마지막 한 수는 얼마일까요?` : `${josa(value, "을")} ${HOW_MANY[parts[0]]} 수로 똑같이 가르면 한 수는 얼마일까요?`;
  return { id, title, problem: what, figure: { kind: "tree", levels: hide(0), tone: "given" }, steps, answer: `한 수는 ${josa(cur, "이에요")}.`, value: { kind: "split", value, parts, one: cur } };
}
function repeatAddExample({ id, title, n, times }) {
  const expr = Array(times).fill(n).join(" + "), total = n * times;
  const steps = [
    { text: `${josa(n, "이")} ${times}번 더해져 있어요. 같은 수를 여러 번 더하면 곱셈으로 바꿀 수 있어요. ${expr} = ${n} × ${times}.`, figure: { kind: "eqs", lines: [`${expr} = ?`, `${n} × ${times} = ?`], tone: "doing" } },
    { text: `${n} × ${times} = ${total}.`, figure: { kind: "eqs", lines: [`${expr} = ${total}`], tone: "check" } }
  ];
  return { id, title, problem: `${expr} = ?에서 ?에 알맞은 수를 구해요.`, figure: { kind: "eqs", lines: [`${expr} = ?`], tone: "given" }, steps, answer: `?는 ${josa(total, "이에요")}.`, value: { kind: "repeat", n, times, total } };
}
// ○ + ○ = □처럼 같은 ○를 times번 더한 식에 맞는 카드 두 장
function cardEqExample({ id, title, cards, times }) {
  const fits = cards.flatMap((a) => cards.filter((b) => b !== a && a * times === b).map((b) => [a, b]));
  if (fits.length !== 1) throw new Error(`${id}: 답이 하나가 아님`);
  const [a, b] = fits[0], form = `${Array(times).fill("○").join(" + ")} = □`;
  const steps = [
    { text: `○를 ${times}번 더하면 ○ × ${times}예요. 카드마다 ${times}배를 해 봐요. ${cards.map((c) => `${c} × ${times} = ${c * times}`).join(", ")}.`, figure: { kind: "eqs", lines: [form], tone: "doing" } },
    { text: `${times}배 한 수가 카드에 있는 건 ${a} × ${times} = ${b}뿐이에요. ○ = ${a}, □ = ${b}.`, figure: { kind: "eqs", lines: [`${Array(times).fill(a).join(" + ")} = ${b}`], tone: "check" } }
  ];
  return { id, title, problem: `숫자 카드 ${cards.join(", ")} 중에서 두 장을 골라 ${form}를 만들어요. ○와 □는 각각 얼마일까요?`, figure: { kind: "eqs", lines: [form], note: `카드: ${cards.join(", ")}`, tone: "given" }, steps, answer: `○는 ${a}, □는 ${josa(b, "이에요")}.`, value: { kind: "cards2", cards, times, a, b } };
}
// 도형식: lines = [[모양, 식]] — 앞에서 구한 모양을 다음 식에 바꾸어 넣는다(식은 +, −만)
function shapeChainExample({ id, title, lines }) {
  const val = {};
  const evalExpr = (e) => e.split(" ").reduce((acc, tok, i, arr) => (i === 0 ? Number(val[tok] ?? tok) : tok === "+" || tok === "−" ? acc : arr[i - 1] === "+" ? acc + Number(val[tok] ?? tok) : acc - Number(val[tok] ?? tok)), 0);
  const steps = lines.map(([sym, e], i) => { const v = evalExpr(e); val[sym] = v; const shown = e.split(" ").map((t) => (i > 0 && val[t] !== undefined && t !== sym ? val[t] : t)).join(" "); return { text: i === 0 ? `${e} = ${ira(v)} ${sym} = ${v}.` : `${josa(Object.keys(val).filter((k) => e.includes(k) && k !== sym).join(", "), "을")} 바꾸어 넣으면 ${shown} = ${v}. ${sym} = ${v}.`, figure: { kind: "eqs", lines: lines.map(([s2, e2]) => `${e2} = ${s2}`), on: [i], tone: i === lines.length - 1 ? "check" : "doing" } }; });
  return { id, title, problem: `${lines.map(([s, e]) => `${e} = ${s}`).join(", ")}이에요. 도형이 나타내는 수를 구해요.`, figure: { kind: "eqs", lines: lines.map(([s, e]) => `${e} = ${s}`), tone: "given" }, steps, answer: `${Object.entries(val).map(([s, v], i, a) => (i === a.length - 1 ? `${josa(s, "은")} ${josa(v, "이에요")}` : `${josa(s, "은")} ${v}`)).join(", ")}.`, value: { kind: "chain", lines, val } };
}
function nthArithExample({ id, title, first, d, nth }) {
  const vals = Array.from({ length: 4 }, (_, i) => first + d * i), at = first + d * (nth - 1);
  const steps = [
    { text: `늘어난 수를 봐요. ${vals.slice(1).map((v, i) => `${v} − ${vals[i]} = ${d}`).join(", ")}. 늘 ${josa(d, "이에요")}.`, figure: { kind: "seq", values: vals, diffs: Array(3).fill(d), tone: "doing" } },
    { text: `1번째에서 ${nth}번째까지는 ${d}씩 ${nth - 1}번 늘어나요. ${d} × ${nth - 1} = ${d * (nth - 1)}.`, figure: { kind: "seq", values: vals, diffs: Array(3).fill(d), tone: "doing" } },
    { text: `${first} + ${d * (nth - 1)} = ${at}.`, figure: { kind: "seq", values: vals, diffs: Array(3).fill(d), ask: at, tone: "check" } }
  ];
  return { id, title, problem: `${vals.join(", ")}, …의 규칙에서 ${nth}번째 수를 구해요.`, figure: { kind: "seq", values: vals, tone: "given", ask: "?" }, steps, answer: `${nth}번째 수는 ${josa(at, "이에요")}.`, value: { kind: "arith", values: vals, nth, at } };
}
// 여러 수열: rule = period | arith | geom | diff | fib | skip | group. explain = 단계 글 둘(코드가 계산한 next를 끝에 쓴다)
function seqRuleExample({ id, title, values, rule, next, explain, diffs = null }) {
  const steps = [
    { text: explain[0], figure: { kind: "seq", values, diffs, tone: "doing" } },
    { text: `${explain[1]} 다음 수는 ${josa(next, "이에요")}.`, figure: { kind: "seq", values, diffs, ask: next, tone: "check" } }
  ];
  return { id, title, problem: `${values.join(", ")}, ? — 규칙에 따라 바로 다음 수를 구해요.`, figure: { kind: "seq", values, tone: "given", ask: "?" }, steps, answer: `다음 수는 ${josa(next, "이에요")}.`, value: { kind: "rule", values, rule, next } };
}
function stagesExample({ id, title, first, d }) {
  const stage = (k) => first.map((row) => row.map((v) => v + d * k));
  const all = [0, 1, 2, 3].map(stage), blank = first.map((row) => row.map(() => null));
  const steps = [
    { text: `같은 자리끼리 비교해요. 1단계에서 2단계로, 2단계에서 3단계로 모든 칸이 ${d}씩 커져요.`, figure: { kind: "stages", stages: [...all.slice(0, 3), blank], tone: "doing" } },
    { text: `4단계는 3단계의 칸마다 ${josa(d, "을")} 더해요.`, figure: { kind: "stages", stages: all, tone: "check" } }
  ];
  return { id, title, problem: "1~3단계 표의 변화 규칙으로 4단계 표를 채워요. 윗줄 왼쪽부터 차례로 써요.", figure: { kind: "stages", stages: [...all.slice(0, 3), blank], tone: "given" }, steps, answer: `${josa(all[3].flat().join(", "), "이에요")}.`, value: { kind: "stages", first, d, last: all[3].flat() } };
}
function matchRowExample({ id, title, nth }) {
  const counts = [1, 2, 3, 4].map((n) => 3 * n + 1), at = 3 * nth + 1;
  const steps = [
    { text: `정사각형이 하나 늘 때마다 성냥개비가 몇 개 느는지 봐요. ${counts.join(", ")} — 3개씩 늘어요(변 하나는 앞 정사각형과 함께 써요).`, figure: { kind: "match-row", n: 4, hi: 3, caption: counts.join(" → "), tone: "doing" } },
    { text: `1번째가 4개, 그 뒤로 3개씩 ${nth - 1}번 늘어요. 4 + 3 × ${nth - 1} = ${at}.`, figure: { kind: "match-row", n: 4, caption: `4 + 3 × ${nth - 1}`, tone: "check" } }
  ];
  return { id, title, problem: `성냥개비로 정사각형을 한 줄로 이어 붙여요. 1번째 모양은 정사각형 1개, 2번째는 2개…예요. ${nth}번째 모양의 성냥개비는 몇 개일까요?`, figure: { kind: "match-row", n: 3, tone: "given" }, steps, answer: `${at}개예요.`, value: { kind: "match", counts, nth, at } };
}
// 숫자 약속: 세 개의 완성된 마름모에서 규칙(rule)을 찾아 마지막 마름모의 위 칸을 구한다
function promiseExample({ id, title, items, ask, rule, ruleText, tryText }) {
  const done = items.map((d) => ({ ...d, top: rule(d) })), q = { ...ask, top: null }, top = rule(ask);
  const steps = [
    { text: tryText(done[0]), figure: { kind: "diamonds", items: [...done, q], tone: "doing" } },
    { text: `${ruleText}. ${done.map((d) => `${d.left} × ${d.right} + ${d.bottom} = ${d.top}`).join(", ")}, 모두 맞아요.`, figure: { kind: "diamonds", items: [...done, q], tone: "doing" } },
    { text: `마지막 마름모: ${ask.left} × ${ask.right} + ${ask.bottom} = ${top}.`, figure: { kind: "diamonds", items: [...done, { ...ask, top }], tone: "check" } }
  ];
  return { id, title, problem: "완성된 마름모 세 개에서 네 수의 약속을 찾아, 마지막 마름모의 위 칸에 알맞은 수를 구해요.", figure: { kind: "diamonds", items: [...done, q], tone: "given" }, steps, answer: `위 칸은 ${josa(top, "이에요")}.`, value: { kind: "promise", items: done, ask, top } };
}
const SEQ2_SET = {
  id: "seq2",
  types: {
    "두 수로 똑같이 가르기": () => [splitExample({ id: "split2-1", title: "예제 1", value: 14, parts: [2] }), splitExample({ id: "split2-2", title: "예제 2", value: 30, parts: [2] })],
    "두 번 가르기": () => [splitExample({ id: "split22-1", title: "예제 1", value: 32, parts: [2, 2] })],
    "세 수로 똑같이 가르기": () => [splitExample({ id: "split3-1", title: "예제 1", value: 39, parts: [3] })],
    "같은 수의 반복 덧셈": () => [repeatAddExample({ id: "rep-add-1", title: "예제 1", n: 3, times: 4 }), repeatAddExample({ id: "rep-add-2", title: "예제 2", n: 6, times: 3 })],
    "숫자 카드로 같은 식 만들기": () => [cardEqExample({ id: "card-eq-1", title: "예제 1", cards: [1, 3, 5, 6], times: 2 })],
    "도형식의 같은 합을 바꾸어 넣기": () => [shapeChainExample({ id: "chain-1", title: "예제 1", lines: [["□", "5 + 5 + 5"], ["△", "□ + 5"]] }), shapeChainExample({ id: "chain-2", title: "예제 2", lines: [["○", "6 + 6"], ["□", "○ + ○ + ○"], ["△", "□ − ○"]] })],
    "등차수열의 특정 번째 수": () => [nthArithExample({ id: "arith-1", title: "예제 1", first: 6, d: 5, nth: 12 })],
    "마디수열": () => [seqRuleExample({ id: "period-1", title: "예제 1", values: [2, 4, 6, 2, 4, 6, 2], rule: "period", next: 4, explain: ["2, 4, 6이 한 마디로 되풀이돼요.", "마디의 처음 2 다음은 4."] })],
    "등차수열": () => [seqRuleExample({ id: "arith-next-1", title: "예제 1", values: [3, 7, 11, 15, 19], rule: "arith", next: 23, diffs: [4, 4, 4, 4], explain: ["늘어난 수가 4로 늘 같아요.", "19 + 4 = 23."] })],
    "등비수열": () => [seqRuleExample({ id: "geom-1", title: "예제 1", values: [3, 6, 12, 24], rule: "geom", next: 48, explain: ["앞의 수에 2를 곱하면 다음 수예요. 3 × 2 = 6, 6 × 2 = 12.", "24 × 2 = 48."] })],
    "계차수열": () => [seqRuleExample({ id: "diff-1", title: "예제 1", values: [1, 2, 4, 7, 11, 16], rule: "diff", next: 22, diffs: [1, 2, 3, 4, 5], explain: ["늘어난 수가 1, 2, 3, 4, 5로 1씩 커져요.", "다음은 6이 늘어 16 + 6 = 22."] })],
    "피보나치 수열": () => [seqRuleExample({ id: "fib-1", title: "예제 1", values: [1, 3, 4, 7, 11, 18], rule: "fib", next: 29, explain: ["앞의 두 수를 더하면 다음 수예요. 1 + 3 = 4, 3 + 4 = 7, 4 + 7 = 11.", "11 + 18 = 29."] })],
    "징검다리 수열": () => [seqRuleExample({ id: "skip-1", title: "예제 1", values: [2, 10, 4, 20, 6, 30, 8], rule: "skip", next: 40, explain: ["한 칸씩 건너뛰어 봐요. 홀수 번째는 2, 4, 6, 8로 2씩, 짝수 번째는 10, 20, 30으로 10씩 커져요.", "다음은 짝수 번째라 30 + 10 = 40."] })],
    "묶음수열": () => [seqRuleExample({ id: "group-1", title: "예제 1", values: [1, 3, 2, 4, 3, 5, 4], rule: "group", next: 6, explain: ["두 개씩 묶어요. (1, 3), (2, 4), (3, 5) — 묶음마다 1씩 커지고, 묶음 안에서는 뒤가 2 커요.", "다음 묶음은 (4, ?), 4 + 2 = 6."] })],
    "단계별 수 표의 변화": () => [stagesExample({ id: "stage-1", title: "예제 1", first: [[1, 0], [2, 3]], d: 2 })],
    "단계별 개수 변화": () => [matchRowExample({ id: "match-1", title: "예제 1", nth: 15 })],
    "숫자 약속 찾기": () => [promiseExample({ id: "promise-1", title: "예제 1", items: [{ left: 2, right: 3, bottom: 1 }, { left: 4, right: 2, bottom: 5 }, { left: 3, right: 5, bottom: 2 }], ask: { left: 6, right: 2, bottom: 4 }, rule: (d) => d.left * d.right + d.bottom, ruleText: "왼쪽 × 오른쪽에 아래를 더하면 위 칸이에요", tryText: (d) => `먼저 세 수를 더해 봐요. ${d.left} + ${d.right} + ${d.bottom} = ${d.left + d.right + d.bottom}인데 위 칸은 ${josa(d.top, "이에요")}. 더하기만으로는 안 돼요.` })]
  }
};

// ───────────────────────── 6권 타일 곱셈 · 간편 계산 · 9에 가까운 수 · 수 만들기 · 똑같이 가르기 ─────────────────────────
// 더해서 10·100이 되는 수끼리 먼저 묶고, 9·99·999는 10·100·1000보다 1 작은 수로 생각한다.
// 수 만들기(+ − 넣기, 숫자 붙이기)는 검사기가 모든 경우를 다 만들어 보아 답이 하나뿐인지 본다.
function groupSumExample({ id, title, nums, blank = null, target = null, unit = 10 }) {
  // 합이 unit이 되는 짝을 앞에서부터 묶는다(남는 수는 따로)
  const left = [...nums], groups = [];
  for (let i = 0; i < left.length; i++) { const j = left.findIndex((x, k) => k > i && x + left[i] === unit); if (j > 0) { groups.push([left[i], left[j]]); left.splice(j, 1); left.splice(i, 1); i--; } }
  const rest = left, made = groups.length * unit, total = made + sum(rest);
  const expr = nums.join(" + ");
  if (blank === null) {
    const steps = [
      { text: `더해서 ${unit}이 되는 수끼리 묶어요. ${groups.map(([a, b]) => `${a} + ${b}`).join(", ")}.`, figure: { kind: "eqs", lines: [`${expr} = ?`, ...groups.map(([a, b]) => `${a} + ${b} = ${unit}`)], tone: "doing" } },
      { text: `${unit}이 ${groups.length}개라 ${made}${rest.length ? `, 남은 ${rest.join(" + ")}${rest.length > 1 ? ` = ${sum(rest)}` : ""}을 더하면 ${made} + ${sum(rest)} = ${total}` : ""}.`, figure: { kind: "eqs", lines: [`${expr} = ${total}`], tone: "check" } }
    ];
    return { id, title, problem: `더해서 ${unit}이 되는 수끼리 먼저 묶어 간편하게 계산해요. ${expr} = ?`, figure: { kind: "eqs", lines: [`${expr} = ?`], tone: "given" }, steps, answer: `${josa(total, "이에요")}.`, value: { kind: "sum", nums, total } };
  }
  const need = target - total;
  const steps = [
    { text: `더해서 ${unit}이 되는 수끼리 묶어요. ${groups.map(([a, b]) => `${a} + ${b} = ${unit}`).join(", ")}.`, figure: { kind: "eqs", lines: [`${expr} + 가 = ${target}`], tone: "doing" } },
    { text: `묶은 것이 ${made}, 남은 ${josa(rest.join(" + "), "을")} 더하면 ${total}. 가 = ${target} − ${total} = ${need}.`, figure: { kind: "eqs", lines: [`${total} + 가 = ${target}`], tone: "check" } }
  ];
  return { id, title, problem: `식이 맞도록 가에 알맞은 수를 구해요. ${expr} + 가 = ${target}`, figure: { kind: "eqs", lines: [`${expr} + 가 = ${target}`], tone: "given" }, steps, answer: `가는 ${josa(need, "이에요")}.`, value: { kind: "blank", nums, target, need } };
}
// a × b + a × c = a × (b + c): 같은 수 a로 묶는다(cOne이면 a × b + a)
function sameFactorExample({ id, title, a, b, c }) {
  const expr = c === 1 ? `${a} × ${b} + ${a}` : `${a} × ${b} + ${a} × ${c}`, total = a * (b + c);
  const steps = [
    { text: `${a} × ${josa(b, "은")} ${josa(a, "이")} ${b}개, ${c === 1 ? `${josa(a, "은")} ${a}가 1개` : `${a} × ${josa(c, "은")} ${josa(a, "이")} ${c}개`}예요.`.replace(`${a}가 1개`, `${josa(a, "이")} 1개`), figure: { kind: "eqs", lines: [`${expr} = ?`], tone: "doing" } },
    { text: `모두 ${josa(a, "이")} ${b} + ${c} = ${b + c}개라 ${a} × ${b + c} = ${total}.`, figure: { kind: "eqs", lines: [`${expr} = ${a} × ${b + c}`, `= ${total}`], tone: "check" } }
  ];
  return { id, title, problem: `같은 수로 묶어 간편하게 계산해요. ${expr} = ?`, figure: { kind: "eqs", lines: [`${expr} = ?`], tone: "given" }, steps, answer: `${josa(total, "이에요")}.`, value: { kind: "factor", a, b, c, total } };
}
// n × (10·100·1000 − 1) 또는 99 + m: 딱 떨어지는 수로 바꾸고 1(또는 그만큼)을 빼거나 더한다
function nearNineExample({ id, title, op, a, b }) {
  if (op === "×") {
    const round = b + 1, total = a * b;
    const steps = [
      { text: `${josa(b, "은")} ${round}보다 1 작아요. ${a} × ${b}는 ${josa(a, "을")} ${round}번 더한 것보다 ${a} 하나만큼 적어요.`, figure: { kind: "eqs", lines: [`${a} × ${b} = ${a} × ${round} − ${a}`], tone: "doing" } },
      { text: `${a} × ${round} = ${a * round}, ${a * round} − ${a} = ${total}.`, figure: { kind: "eqs", lines: [`${a} × ${b} = ${a * round} − ${a}`, `= ${total}`], tone: "check" } }
    ];
    return { id, title, problem: `${b}는 ${round}보다 1 작은 수예요. 간편하게 계산해요. ${a} × ${b} = ?`.replace(`${b}는`, josa(b, "은")), figure: { kind: "eqs", lines: [`${a} × ${b} = ?`], tone: "given" }, steps, answer: `${josa(total, "이에요")}.`, value: { kind: "near", op, a, b, total } };
  }
  const round = a + 1, total = a + b;
  const steps = [
    { text: `${a}에 1을 더하면 딱 떨어지는 ${josa(round, "이에요")}. ${a} = ${round} − 1.`, figure: { kind: "eqs", lines: [`${a} + ${b} = ${round} + ${b} − 1`], tone: "doing" } },
    { text: `${round} + ${b} = ${round + b}, 1을 빼면 ${total}.`, figure: { kind: "eqs", lines: [`${a} + ${b} = ${round + b} − 1`, `= ${total}`], tone: "check" } }
  ];
  return { id, title, problem: `딱 떨어지는 수로 바꾸어 간편하게 계산해요. ${a} + ${b} = ?`, figure: { kind: "eqs", lines: [`${a} + ${b} = ?`], tone: "given" }, steps, answer: `${josa(total, "이에요")}.`, value: { kind: "near", op, a, b, total } };
}
// 수 만들기. signs: ○ 자리에 + 또는 −. joins: 숫자 사이에 + (allowMinus면 −도) 넣거나 붙여 한 수로
const evalPM = (str) => str.match(/[+−]?\d+/gu).reduce((acc, t) => acc + (t[0] === "−" ? -Number(t.slice(1)) : Number(t.replace("+", ""))), 0);
function allJoins(digits, ops) { const out = []; const go = (i, s) => { if (i === digits.length) { out.push(s); return; } for (const o of ["", ...ops]) go(i + 1, `${s}${o}${digits[i]}`); }; go(1, String(digits[0])); return out; }
function makeNumberExample({ id, title, digits, target, ops, signsOnly = false }) {
  const all = signsOnly ? allJoins(digits, ops).filter((e) => e.replace(/\d/gu, "").length === digits.length - 1) : allJoins(digits, ops);
  const fits = all.filter((e) => evalPM(e) === target);
  if (fits.length !== 1) throw new Error(`${id}: 식이 하나가 아님 (${fits.join(", ")})`);
  const ans = fits[0], spaced = ans.replace(/([+−])/gu, " $1 ");
  const tried = all.filter((e) => e !== ans && /[+−]/u.test(e)).slice(0, 3).map((e) => `${e.replace(/([+−])/gu, " $1 ")} = ${evalPM(e)}`);
  const steps = [
    { text: signsOnly ? `${target}보다 큰지 작은지부터 봐요. 모두 더하면 ${sum(digits)}${sum(digits) > target ? "이라 빼는 곳이 있어야 해요" : ""}.`.replace(`${sum(digits)}이라`, `${ira(sum(digits))}`) : `${target}에 가까워지려면 숫자를 붙여 큰 수를 만들어야 할 수도 있어요. 하나씩 넣어 봐요.`, figure: { kind: "eqs", lines: [`${digits.join(signsOnly ? " ○ " : " ")} = ${target}`], tone: "doing" } },
    { text: `해 보면: ${tried.join(", ")} — 아니에요.`, figure: { kind: "eqs", lines: tried, tone: "doing" } },
    { text: `${spaced} = ${target}, 맞아요.`, figure: { kind: "eqs", lines: [`${spaced} = ${target}`], tone: "check" } }
  ];
  const problem = signsOnly ? `○ 안에 + 또는 −를 넣어 식이 맞게 해요. ${digits.join(" ○ ")} = ${target}` : `숫자 사이에 ${ops.join(" 또는 ")}를 넣어(붙어 있는 숫자는 한 수) 식이 맞게 해요. ${digits.join(" ")} = ${target}`;
  return { id, title, problem, figure: { kind: "eqs", lines: [`${digits.join(signsOnly ? " ○ " : " ")} = ${target}`], tone: "given" }, steps, answer: `${spaced} = ${josa(target, "이에요")}.`, value: { kind: "make", digits, target, ops, signsOnly, ans } };
}
function factorBlankExample({ id, title, n, a, b }) {
  const steps = [
    { text: `${n} = ${a} × □: ${josa(n, "을")} ${a}씩 묶으면 ${n} ÷ ${a} = ${n / a}묶음이에요.`, figure: { kind: "eqs", lines: [`${n} = ${a} × ${n / a}`], tone: "doing" } },
    { text: `${n} = ${b} × □: ${n} ÷ ${b} = ${n / b}.`, figure: { kind: "eqs", lines: [`${n} = ${a} × ${n / a} = ${b} × ${n / b}`], tone: "check" } }
  ];
  return { id, title, problem: `빈칸에 알맞은 수를 구해요. ${n} = ${a} × □ = ${b} × □`, figure: { kind: "eqs", lines: [`${n} = ${a} × □ = ${b} × □`], tone: "given" }, steps, answer: `차례로 ${n / a}, ${josa(n / b, "이에요")}.`, value: { kind: "fblank", n, a, b } };
}
const CALC6_SET = {
  id: "calc6",
  types: {
    "타일 그림 곱셈": () => [splitBoxExample({ id: "tile-1", title: "예제 1", first: 17, second: 4 }), splitBoxExample({ id: "tile-2", title: "예제 2", first: 23, second: 6 })],
    "간편하게 더하기": () => [groupSumExample({ id: "gsum-1", title: "예제 1", nums: [8, 5, 2, 6, 5, 4] }), groupSumExample({ id: "gsum-2", title: "예제 2", nums: [7, 9, 3, 1, 8] })],
    "빈칸 채우기": () => [groupSumExample({ id: "gblank-1", title: "예제 1", nums: [15, 85, 27, 73, 46], target: 300, blank: "가", unit: 100 })],
    "같은 수 더하기를 곱셈으로": () => [repeatAddExample({ id: "rep15-1", title: "예제 1", n: 15, times: 4 })],
    "같은 수로 묶어 곱하기": () => [sameFactorExample({ id: "sf-1", title: "예제 1", a: 7, b: 8, c: 2 }), sameFactorExample({ id: "sf-2", title: "예제 2", a: 6, b: 9, c: 1 })],
    "9를 곱하기": () => [nearNineExample({ id: "n9-1", title: "예제 1", op: "×", a: 7, b: 9 })],
    "99를 곱하기": () => [nearNineExample({ id: "n99-1", title: "예제 1", op: "×", a: 8, b: 99 })],
    "9에 가까운 수 곱하기": () => [nearNineExample({ id: "n999-1", title: "예제 1", op: "×", a: 7, b: 999 })],
    "9에 가까운 수 더하기": () => [nearNineExample({ id: "nadd-1", title: "예제 1", op: "+", a: 99, b: 47 }), nearNineExample({ id: "nadd-2", title: "예제 2", op: "+", a: 999, b: 26 })],
    "+ − 넣기": () => [makeNumberExample({ id: "pm-1", title: "예제 1", digits: [5, 3, 2], target: 4, ops: ["+", "−"], signsOnly: true })],
    "+ 넣어 식 만들기": () => [makeNumberExample({ id: "plus-1", title: "예제 1", digits: [2, 3, 4, 5], target: 50, ops: ["+"] })],
    "+ − 넣어 식 만들기": () => [makeNumberExample({ id: "pmj-1", title: "예제 1", digits: [4, 3, 2], target: 41, ops: ["+", "−"] })],
    "똑같이 둘로 가르기": () => [splitExample({ id: "half-1", title: "예제 1", value: 36, parts: [2] })],
    "똑같이 넷으로 가르기": () => [splitExample({ id: "quarter-1", title: "예제 1", value: 52, parts: [4] })],
    "똑같이 셋으로 가르기": () => [splitExample({ id: "third-1", title: "예제 1", value: 45, parts: [3] })],
    "곱셈식의 빈칸": () => [factorBlankExample({ id: "fb-1", title: "예제 1", n: 18, a: 2, b: 3 })]
  }
};

// ───────────────────────── 5권 최단거리 · 숫자 카드 · 조건에 맞는 두 자리 수 · 수 배열표 ─────────────────────────
// 최단거리: 오른쪽·아래로만 간다. 점마다 「위에서 오는 가짓수 + 왼쪽에서 오는 가짓수」를 쓴다. 대각선은 두 변보다 짧아 꼭 지난다.
// 거쳐 가면 (A → B 가짓수) × (B → C 가짓수). 카드로 만든 수는 맨 앞자리부터 차례로 센다(0은 맨 앞에 못 온다).
function routeEdges(rows, cols, cells = null) {
  const out = new Set();
  const add = (e) => out.add(e.join());
  if (!cells) { for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) { if (c < cols) add([r, c, r, c + 1]); if (r < rows) add([r, c, r + 1, c]); } }
  else for (const [r, c] of cells) { add([r, c, r, c + 1]); add([r + 1, c, r + 1, c + 1]); add([r, c, r + 1, c]); add([r, c + 1, r + 1, c + 1]); }
  return [...out].map((s) => s.split(",").map(Number));
}
// 가장 짧은 길의 가짓수(점마다): 길이가 같으면 더하고, 더 짧은 길이 오면 그것만 센다
function routeCounts(rows, cols, edges, diags, from) {
  const ok = new Set(edges.map((e) => e.join())), dg = new Set((diags || []).map((d) => d.join()));
  const best = {}, key = (r, c) => `${r},${c}`;
  best[key(...from)] = { d: 0, n: 1 };
  for (let r = from[0]; r <= rows; r++) for (let c = from[1]; c <= cols; c++) {
    if (r === from[0] && c === from[1]) continue;
    const cands = [];
    if (c > from[1] && ok.has([r, c - 1, r, c].join()) && best[key(r, c - 1)]) cands.push({ d: best[key(r, c - 1)].d + 1, n: best[key(r, c - 1)].n });
    if (r > from[0] && ok.has([r - 1, c, r, c].join()) && best[key(r - 1, c)]) cands.push({ d: best[key(r - 1, c)].d + 1, n: best[key(r - 1, c)].n });
    if (r > from[0] && c > from[1] && dg.has([r - 1, c - 1].join()) && best[key(r - 1, c - 1)]) cands.push({ d: best[key(r - 1, c - 1)].d + Math.SQRT2, n: best[key(r - 1, c - 1)].n });
    if (!cands.length) continue;
    const m = Math.min(...cands.map((x) => x.d));
    best[key(r, c)] = { d: m, n: cands.filter((x) => Math.abs(x.d - m) < 1e-9).reduce((a, x) => a + x.n, 0) };
  }
  return Object.fromEntries(Object.entries(best).map(([k, v]) => [k, v.n]));
}
function routeExample({ id, title, rows, cols, cells = null, cut = [], diags = [], via = null, problem }) {
  const edges = routeEdges(rows, cols, cells).filter((e) => !cut.some((x) => x.join() === e.join())), limited = Boolean(cells || cut.length);
  const A = [0, 0], B = [rows, cols], points = via ? { A, B: via, C: B } : { A, B };
  const fig = (tone, counts, extra = {}) => ({ kind: "route", rows, cols, edges: limited ? edges : null, diags, counts, points, tone, ...extra });
  const steps = [];
  let total;
  if (diags.length) {
    const [dr, dc] = diags[0], P = [dr, dc], Q = [dr + 1, dc + 1];
    const toP = routeCounts(rows, cols, edges, [], A)[P.join()], fromQ = routeCounts(rows, cols, edges, [], Q)[B.join()];
    total = toP * fromQ;
    steps.push({ text: "대각선은 칸의 두 변을 돌아가는 길보다 짧아요. 가장 짧은 길은 대각선을 꼭 지나요.", figure: fig("doing", {}, { hiDiag: true }) });
    steps.push({ text: `A에서 대각선이 시작하는 점까지 ${toP}가지예요(위와 왼쪽의 수를 더해요).`, figure: fig("doing", Object.fromEntries(Object.entries(routeCounts(rows, cols, edges, [], A)).filter(([k]) => { const [r, c] = k.split(",").map(Number); return r <= dr && c <= dc; })), { hiDiag: true }) });
    steps.push({ text: `대각선이 끝나는 점에서 B까지 ${fromQ}가지예요. 모두 ${toP} × ${fromQ} = ${total}가지.`, figure: fig("check", Object.fromEntries(Object.entries(routeCounts(rows, cols, edges, [], Q))), { hiDiag: true }) });
  } else if (via) {
    const x = routeCounts(rows, cols, edges, [], A)[via.join()], y = routeCounts(rows, cols, edges, [], via)[B.join()];
    total = x * y;
    steps.push({ text: `A에서 B까지 먼저 세요. 위와 왼쪽의 수를 더하면 ${x}가지.`, figure: fig("doing", Object.fromEntries(Object.entries(routeCounts(rows, cols, edges, [], A)).filter(([k]) => { const [r, c] = k.split(",").map(Number); return r <= via[0] && c <= via[1]; }))) });
    steps.push({ text: `B에서 C까지는 ${y}가지.`, figure: fig("doing", routeCounts(rows, cols, edges, [], via)) });
    steps.push({ text: `A에서 B까지 한 길마다 B에서 C까지 ${y}가지씩 이어져요. ${x} × ${y} = ${total}가지.`, figure: fig("check", routeCounts(rows, cols, edges, [], via)) });
  } else {
    const all = routeCounts(rows, cols, edges, [], A);
    total = all[B.join()];
    const firstLine = Object.fromEntries(Object.entries(all).filter(([k]) => k.split(",").includes("0")));
    steps.push({ text: `가장 짧게 가려면 오른쪽이나 아래로만 가요. 맨 윗줄과 맨 왼쪽 줄의 점은 ${limited ? "길이 이어진 만큼 " : ""}한 가지씩이에요.`, figure: fig("doing", firstLine) });
    steps.push({ text: `나머지 점은 위에서 오는 수와 왼쪽에서 오는 수를 더해요.${limited ? " 길이 없는 쪽에서는 오지 못해요." : ""}`, figure: fig("doing", all) });
    steps.push({ text: `B에 쓰인 수가 ${total}이라 ${total}가지예요.`.replace(`${total}이라`, ira(total)), figure: fig("check", all) });
  }
  return { id, title, problem, figure: fig("given", {}), steps, answer: `${total}가지예요.`, value: { kind: "route", rows, cols, edges, diags, via, total } };
}
function roadsExample({ id, title, ways, stops }) {
  const total = ways.reduce((a, b) => a * b, 1);
  const steps = [
    { text: `구간마다 길이 몇 가지인지 봐요. ${ways.map((w, i) => `${i === 0 ? "출발" : stops[i - 1]} → ${i === ways.length - 1 ? "도착" : stops[i]} ${w}가지`).join(", ")}.`, figure: { kind: "roads", ways, stops, tone: "doing" } },
    { text: `앞 구간의 길마다 다음 구간의 길이 모두 이어지니 곱해요. ${ways.join(" × ")} = ${total}가지.`, figure: { kind: "roads", ways, stops, tone: "check" } }
  ];
  return { id, title, problem: "출발에서 도착까지 되돌아가지 않고 갈 수 있는 방법은 몇 가지일까요?", figure: { kind: "roads", ways, stops, tone: "given" }, steps, answer: `${total}가지예요.`, value: { kind: "roads", ways, total } };
}
const permsOf = (xs, k) => (k === 0 ? [[]] : xs.flatMap((x, i) => permsOf([...xs.slice(0, i), ...xs.slice(i + 1)], k - 1).map((r) => [x, ...r])));
function cardCountExample({ id, title, cards, digits }) {
  const firstOk = cards.filter((c) => c !== 0).length, rest = Array.from({ length: digits - 1 }, (_, i) => cards.length - 1 - i);
  const total = firstOk * rest.reduce((a, b) => a * b, 1), place = ["백의 자리", "십의 자리", "일의 자리"].slice(3 - digits);
  const steps = [
    { text: `${place[0]}에 올 수 있는 카드는 ${firstOk}장이에요${cards.includes(0) ? "(0은 맨 앞에 못 와요)" : ""}.`, figure: { kind: "num-cards", n: 0, eqs: [cards.join("  ")], tone: "doing" } },
    { text: `${place.slice(1).map((p, i) => `${p}에는 남은 ${rest[i]}장`).join(", ")}. 모두 ${[firstOk, ...rest].join(" × ")} = ${total}개.`, figure: { kind: "num-cards", n: 0, eqs: [cards.join("  ")], tone: "check" } }
  ];
  return { id, title, problem: `숫자 카드 ${josa(cards.join(", "), "이")} 한 장씩 있어요. ${digits === 2 ? "두" : "세"} 장을 골라 만들 수 있는 ${digits === 2 ? "두" : "세"} 자리 수는 모두 몇 개일까요?`, figure: { kind: "num-cards", n: 0, eqs: [cards.join("  ")], tone: "given" }, steps, answer: `${total}개예요.`, value: { kind: "cards-count", cards, digits, total } };
}
function cardRankExample({ id, title, cards, digits, k }) {
  const list = permsOf(cards, digits).filter((p) => p[0] !== 0).map((p) => Number(p.join(""))).sort((a, b) => a - b), at = list[k - 1];
  const lead = at === undefined ? null : String(at)[0], per = list.filter((x) => String(x)[0] === String(list[0])[0]).length;
  const before = list.filter((x) => Number(String(x)[0]) < Number(lead)).length;
  const steps = [
    { text: `맨 앞자리가 같은 수끼리 묶어 세요. 맨 앞자리 하나마다 ${per}개씩 있어요.`, figure: { kind: "seq", values: list.slice(0, per), tone: "doing" } },
    { text: before ? `맨 앞자리가 ${lead}보다 작은 수가 ${before}개라, ${k}번째는 맨 앞자리가 ${lead}인 수 중 ${k - before}번째예요.` : `0은 맨 앞에 못 와요. 가장 작은 수들은 맨 앞자리가 ${lead}인 수이고, ${k}번째도 그 안에 있어요.`, figure: { kind: "seq", values: list.filter((x) => String(x)[0] === lead), tone: "doing" } },
    { text: `${numEuro(lead)} 시작하는 수를 작은 차례로 쓰면 ${list.filter((x) => String(x)[0] === lead).join(", ")}. ${k - before}번째는 ${at}.`, figure: { kind: "seq", values: list.filter((x) => String(x)[0] === lead), ask: at, tone: "check" } }
  ];
  return { id, title, problem: `숫자 카드 ${cards.join(", ")} 중 ${digits === 3 ? "세" : "두"} 장으로 ${digits === 3 ? "세" : "두"} 자리 수를 만들 때, ${k}번째로 작은 수는 무엇일까요?`, figure: { kind: "num-cards", n: 0, eqs: [cards.join("  ")], tone: "given" }, steps, answer: `${josa(at, "이에요")}.`, value: { kind: "cards-rank", cards, digits, k, at } };
}
// 두 자리 수 조건: rel = 십의 자리 − 일의 자리(모두), 또는 times·sum(하나)
function twoDigitExample({ id, title, rel = null, times = null, total = null }) {
  if (rel !== null) {
    const list = []; for (let t = 1; t <= 9; t++) { const o = t - rel; if (o >= 0 && o <= 9) list.push(10 * t + o); }
    const steps = [
      { text: `십의 자리 = 일의 자리 ${rel < 0 ? "−" : "+"} ${Math.abs(rel)}이에요. 일의 자리에 0부터 9까지 차례로 넣어 봐요.`, figure: { kind: "seq", values: list.slice(0, 3), tone: "doing" } },
      { text: `십의 자리는 1~9여야 해요. 그래서 ${list.join(", ")}.`, figure: { kind: "seq", values: list, tone: "check" } }
    ];
    const relText = rel < 0 ? `${-rel} 작은` : `${rel} 큰`;
    return { id, title, problem: `십의 자리 숫자가 일의 자리 숫자보다 ${relText} 두 자리 수를 모두 써요.`, figure: { kind: "seq", values: [], tone: "given", ask: "?" }, steps, answer: `${josa(list.join(", "), "이에요")}.`, value: { kind: "two-rel", rel, list } };
  }
  const o = total / (times + 1), t = times * o, n = 10 * t + o;
  const steps = [
    { text: `십의 자리 숫자는 일의 자리 숫자의 ${times}배예요. 일의 자리를 한 묶음이라 하면 두 숫자의 합은 ${times + 1}묶음.`, figure: { kind: "eqs", lines: [`일의 자리 × ${times + 1} = ${total}`], tone: "doing" } },
    { text: `${total} ÷ ${times + 1} = ${o}라 일의 자리 ${o}, 십의 자리 ${o} × ${times} = ${t}.`.replace(`${o}라`, ira(o)), figure: { kind: "eqs", lines: [`${t} + ${o} = ${total}`], tone: "check" } }
  ];
  return { id, title, problem: `십의 자리 숫자는 일의 자리 숫자의 ${times}배이고, 두 숫자를 더하면 ${josa(total, "이에요")}. 이 두 자리 수는 무엇일까요?`, figure: { kind: "eqs", lines: ["십의 자리 = 일의 자리 × " + times, `십의 자리 + 일의 자리 = ${total}`], tone: "given" }, steps, answer: `${josa(n, "이에요")}.`, value: { kind: "two-fix", times, total, n } };
}
// 수 배열표: 줄마다 방향을 바꾸어(ㄹ자) 1부터 채운다
function snakeTableExample({ id, title, cols, rows, ask }) {
  const cell = (r, c) => r * cols + (r % 2 === 0 ? c + 1 : cols - c);
  const cells = (show) => Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => (r < 2 || show === "all" ? String(cell(r, c)) : r === ask[0] && c === ask[1] ? "가" : "")));
  const v = cell(...ask);
  const steps = [
    { text: `첫째 줄은 왼쪽에서 오른쪽으로, 둘째 줄은 오른쪽에서 왼쪽으로 커져요. 줄이 바뀔 때마다 방향이 바뀌어요.`, figure: { kind: "mgrid", cells: cells(), noTotals: true, tone: "doing", focus: { row: 1 } } },
    { text: `${["첫째", "둘째", "셋째", "넷째", "다섯째"][ask[0]]} 줄은 ${ask[0] * cols + 1}부터 ${(ask[0] + 1) * cols}까지${ask[0] % 2 ? "인데 오른쪽에서 왼쪽으로" : " 왼쪽에서 오른쪽으로"} 놓여요. 가는 ${josa(v, "이에요")}.`, figure: { kind: "mgrid", cells: cells("all"), noTotals: true, tone: "check", focus: { row: ask[0] } } }
  ];
  return { id, title, problem: "수 배열표의 규칙을 찾아 가에 들어갈 수를 구해요.", figure: { kind: "mgrid", cells: cells(), noTotals: true, tone: "given" }, steps, answer: `가는 ${josa(v, "이에요")}.`, value: { kind: "snake", cols, rows, ask, v } };
}
const COUNT5_SET = {
  id: "count5",
  types: {
    "격자 최단거리": () => [routeExample({ id: "rt-1", title: "예제 1", rows: 3, cols: 3, problem: "A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" }), routeExample({ id: "rt-2", title: "예제 2", rows: 3, cols: 5, problem: "A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" })],
    "이어 붙인 모양의 최단거리": () => [routeExample({ id: "rt-join-1", title: "예제 1", rows: 3, cols: 3, cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], problem: "정사각형을 이어 붙인 모양의 선을 따라 A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" })],
    "굵은 선 최단거리": () => [routeExample({ id: "rt-bold-1", title: "예제 1", rows: 3, cols: 3, cut: [[1, 1, 1, 2], [1, 1, 2, 1], [0, 2, 1, 2]], problem: "굵은 선을 따라 A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" })],
    "굵은 선과 대각선 최단거리": () => [routeExample({ id: "rt-bold-diag-1", title: "예제 1", rows: 3, cols: 3, cut: [[0, 1, 0, 2], [2, 0, 3, 0]], diags: [[1, 1]], problem: "굵은 선과 대각선을 따라 A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" })],
    "갈림길 가짓수": () => [roadsExample({ id: "roads-1", title: "예제 1", ways: [3, 2, 2], stops: ["가", "나"] })],
    "거쳐 가는 최단거리": () => [routeExample({ id: "rt-via-1", title: "예제 1", rows: 4, cols: 4, via: [2, 1], problem: "A에서 B를 거쳐 C까지 가장 짧은 길로 가는 방법은 몇 가지일까요?" })],
    "대각선이 있는 최단거리": () => [routeExample({ id: "rt-diag-1", title: "예제 1", rows: 4, cols: 4, diags: [[1, 2]], problem: "A에서 B까지 가장 짧은 길로 가는 방법은 몇 가지일까요? 대각선으로도 갈 수 있어요." })],
    "카드로 만든 수의 개수": () => [cardCountExample({ id: "cc-1", title: "예제 1", cards: [3, 5, 7], digits: 2 })],
    "숫자 카드로 만든 수의 개수": () => [cardCountExample({ id: "cc-2", title: "예제 1", cards: [2, 4, 6, 8], digits: 3 })],
    "숫자 카드로 만든 수의 차례": () => [cardRankExample({ id: "cr-rank-1", title: "예제 1", cards: [2, 5, 7, 9], digits: 3, k: 10 })],
    "세 자리 카드 순위": () => [cardRankExample({ id: "cr-rank-0", title: "예제 1", cards: [0, 3, 5, 9], digits: 3, k: 4 })],
    "자리 숫자 조건": () => [twoDigitExample({ id: "two-fix-1", title: "예제 1", times: 2, total: 9 })],
    "조건에 맞는 수 모두": () => [twoDigitExample({ id: "two-rel-1", title: "예제 1", rel: -3 })],
    "수 배열표의 규칙": () => [snakeTableExample({ id: "snake-1", title: "예제 1", cols: 5, rows: 4, ask: [3, 1] })]
  }
};

// ───────────────────────── 7권 시계 읽기 · 벤 다이어그램, 8권 묶음수, 3권 겹친 거리 · 테이프와 한가운데 수 · 몇 배 ─────────────────────────
// 시계: 짧은 바늘이 지나온 숫자가 「시」, 긴 바늘이 가리킨 숫자 × 5가 「분」. 벤: 두 모둠을 더하면 겹친 부분을 두 번 센다.
// 묶음수: 둘째 식(저울)에 더 있는 것 = 두 합의 차. 몇 배: 기준이 몇 번 들어가는지. 값은 모두 코드가 계산한다.
const ina = (w) => (josa(w, "이").endsWith("이") ? `${w}이나` : `${w}나`);
function clockReadExample({ id, title, h, m }) {
  if (m % 5) throw new Error(`${id}: 5분 단위만`);
  const steps = [
    { text: `짧은 바늘이 ${josa(h, "과")} ${h % 12 + 1} 사이에 있어요. 아직 ${h % 12 + 1}에 닿지 않았으니 ${h}시.`, figure: { kind: "analog", h, m, hi: "hour", tone: "doing" } },
    { text: `긴 바늘이 숫자 ${josa(m / 5, "을")} 가리켜요. 숫자 한 칸은 5분이라 ${m / 5} × 5 = ${m}분.`, figure: { kind: "analog", h, m, hi: "minute", tone: "check" } }
  ];
  return { id, title, problem: "시계가 가리키는 시각은 몇 시 몇 분일까요?", figure: { kind: "analog", h, m, tone: "given" }, steps, answer: `${h}시 ${m}분이에요.`, value: { kind: "clock", h, m } };
}
// 벤: a·b = 두 모둠, both = 둘 다, out = 둘 다 아님, total = 전체. ask: both | total | out | only
function vennExample({ id, title, labels, a, b, both, out = 0, ask, universe = false }) {
  const [L, R] = labels, union = a + b - both, total = union + out, only = union - both;
  const fig = (tone, show) => ({ kind: "venn", labels, a: show ? a - both : undefined, both: show ? both : ask === "both" ? null : undefined, b: show ? b - both : undefined, out: universe ? (show || ask !== "out" ? out : null) : undefined, universe, tone });
  const likeA = `${josa(L, "을")} 좋아하는`, likeB = `${josa(R, "을")} 좋아하는`;
  const cases = {
    both: { problem: `친구 ${total}명은 모두 ${josa(L, "과")} ${R} 중 적어도 하나를 좋아해요. ${likeA} 친구는 ${a}명, ${likeB} 친구는 ${b}명이에요. 둘 다 좋아하는 친구는 몇 명일까요?`, steps: [
      [`${L} ${a}명과 ${R} ${b}명을 더하면 ${a + b}명. 그런데 친구는 ${total}명뿐이에요.`, false],
      [`더 센 ${a + b} − ${total} = ${both}명은 두 번 센 친구, 둘 다 좋아하는 친구예요.`, true]], answer: `${both}명이에요.` },
    total: { problem: `친구들은 모두 ${ina(L)} ${R} 중 적어도 하나를 좋아해요. ${likeA} 친구는 ${a}명, ${likeB} 친구는 ${b}명, 둘 다 좋아하는 친구는 ${both}명이에요. 친구는 모두 몇 명일까요?`, steps: [
      [`${a} + ${b} = ${a + b}명인데, 둘 다 좋아하는 ${both}명을 두 번 셌어요.`, true],
      [`두 번 센 만큼 한 번 빼요. ${a + b} − ${both} = ${total}명.`, true]], answer: `모두 ${total}명이에요.` },
    out: { problem: `학생 ${total}명 중 ${likeA} 학생은 ${a}명, ${likeB} 학생은 ${b}명, 둘 다 좋아하는 학생은 ${both}명이에요. 둘 다 좋아하지 않는 학생은 몇 명일까요?`, steps: [
      [`둘 중 하나라도 좋아하는 학생은 ${a} + ${b} − ${both} = ${union}명(두 번 센 학생을 한 번 빼요).`, true],
      [`전체 ${total}명에서 빼면 ${total} − ${union} = ${out}명.`, true]], answer: `${out}명이에요.` },
    only: { problem: `학생 ${total}명 중 ${likeA} 학생은 ${a}명, ${likeB} 학생은 ${b}명, 둘 다 좋아하지 않는 학생은 ${out}명이에요. 둘 중 한 가지만 좋아하는 학생은 몇 명일까요?`, steps: [
      [`둘 다 좋아하지 않는 ${out}명을 빼면 하나라도 좋아하는 학생은 ${total} − ${out} = ${union}명.`, false],
      [`${a} + ${b} = ${a + b}에서 ${josa(union, "을")} 빼면 두 번 센 ${both}명이 둘 다 좋아하는 학생이에요.`, true],
      [`한 가지만 좋아하는 학생은 ${union} − ${both} = ${only}명.`, true]], answer: `${only}명이에요.` }
  };
  const c = cases[ask];
  return { id, title, problem: c.problem, figure: fig("given", false), steps: c.steps.map(([t, show], i) => ({ text: t, figure: fig(i === c.steps.length - 1 ? "check" : "doing", show) })), answer: c.answer, value: { kind: "venn", a, b, both, out, total, ask } };
}
// 묶음수: ○ + □ = s1, ○ + ○ + □ = s2
function bundleTwoExample({ id, title, x, y, scale = false }) {
  const s1 = x + y, s2 = 2 * x + y, u = scale ? "g" : "", word = scale ? "저울" : "식";
  const lines = [`○ + □ = ${s1}${u}`, `○ + ○ + □ = ${s2}${u}`];
  const steps = [
    { text: `둘째 ${word}에는 첫째 ${word}보다 ○가 하나 더 있어요. 그 ○ 하나가 ${s2} − ${s1} = ${s2 - s1}${u}.`, figure: { kind: "eqs", lines, on: [1], tone: "doing" } },
    { text: `첫째 ${word}에서 □ = ${s1} − ${x} = ${y}${u}.`, figure: { kind: "eqs", lines: [...lines, `○ = ${x}${u}, □ = ${y}${u}`], tone: "check" } }
  ];
  const problem = scale ? `저울 두 개에 공(○)과 상자(□)를 올렸어요. 같은 모양은 무게가 같아요. ${lines.join(", ")}이에요. □ 한 개는 몇 g일까요?` : `같은 모양은 같은 수예요. ${lines.join(", ")}일 때 □가 나타내는 수를 구해요.`;
  return { id, title, problem, figure: { kind: "eqs", lines, tone: "given" }, steps, answer: scale ? `□ 한 개는 ${y}g이에요.` : `□는 ${josa(y, "이에요")}.`, value: { kind: "bundle2", s1, s2, x, y } };
}
// 겹친 거리: 처음 → 끝 거리(whole) 안에 처음 → 가운데(part)
function partDistExample({ id, title, names, whole, part }) {
  const [P, Q, R] = names, rest = whole - part, pts = [{ label: P, at: 0 }, { label: Q, at: part }, { label: R, at: whole }];
  const fig = (tone, show) => ({ kind: "dist-line", points: pts, arcs: [{ from: P, to: R, label: `${whole}m`, side: "over" }, { from: P, to: Q, label: `${part}m`, side: "under" }, { from: Q, to: R, label: show ? `${rest}m` : "?", side: "under", ask: true }], tone });
  const steps = [
    { text: `${P}에서 ${R}까지 ${whole}m 안에 ${P}에서 ${Q}까지 ${part}m가 들어 있어요.`, figure: fig("doing", false) },
    { text: `남은 부분이 ${Q}에서 ${R}까지예요. ${whole} − ${part} = ${rest}m.`, figure: fig("check", true) }
  ];
  return { id, title, problem: `${P}에서 ${R}까지는 ${whole}m, ${P}에서 ${Q}까지는 ${part}m예요. ${Q}에서 ${R}까지는 몇 m일까요? (${P}, ${Q}, ${R}는 한 줄에 있어요.)`.replace(`${R}는`, josa(R, "은")), figure: fig("given", false), steps, answer: `${rest}m예요.`, value: { kind: "part", whole, part, rest } };
}
// A-B-C-D 한 줄: AD, AC, BD를 주고 AB, BC, CD
function chainSegExample({ id, title, pos }) {
  const [A, B, C, D] = pos, AD = D - A, AC = C - A, BD = D - B, CD = AD - AC, AB = AD - BD, BC = AD - AB - CD;
  const pts = [["A", A], ["B", B], ["C", C], ["D", D]].map(([label, at]) => ({ label, at }));
  const arc = (from, to, label, side, ask) => ({ from, to, label, side, ask });
  const fig = (tone, found) => ({ kind: "dist-line", points: pts, arcs: [arc("A", "D", `${AD}`, "over"), arc("A", "C", `${AC}`, "over"), arc("B", "D", `${BD}`, "under"), ...found.map(([f, t, l]) => arc(f, t, l, "under", true))], tone });
  const steps = [
    { text: `AD 안에 AC가 들어 있어요. 남은 CD = ${AD} − ${AC} = ${CD}.`, figure: fig("doing", [["C", "D", `${CD}`]]) },
    { text: `AD 안에 BD가 들어 있어요. 남은 AB = ${AD} − ${BD} = ${AB}.`, figure: fig("doing", [["A", "B", `${AB}`]]) },
    { text: `BC는 AD에서 AB와 CD를 빼요. ${AD} − ${AB} − ${CD} = ${BC}.`, figure: fig("check", [["B", "C", `${BC}`]]) }
  ];
  return { id, title, problem: `A, B, C, D가 차례로 한 줄에 있어요. AD = ${AD}, AC = ${AC}, BD = ${BD}일 때 AB, BC, CD의 길이를 구해요.`, figure: fig("given", []), steps, answer: `AB = ${AB}, BC = ${BC}, CD = ${josa(CD, "이에요")}.`, value: { kind: "chain4", pos, AB, BC, CD } };
}
// 접힌 테이프: 꺾은선의 부분 길이를 모두 더한다(접어도 길이는 그대로)
function tapeExample({ id, title, pts }) {
  const segs = pts.slice(1).map((p, i) => Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1])), total = sum(segs);
  const steps = [
    { text: "접힌 곳에서 꺾여도 테이프의 길이는 그대로예요. 꺾인 부분마다 모눈 칸을 세요.", figure: { kind: "tape", pts, labels: true, tone: "doing" } },
    { text: `${plus(segs)} = ${total}cm.`, figure: { kind: "tape", pts, labels: true, tone: "check" } }
  ];
  return { id, title, problem: "모눈 한 칸이 1cm예요. 접혀 있는 색테이프를 곧게 펴면 몇 cm일까요?", figure: { kind: "tape", pts, tone: "given" }, steps, answer: `${total}cm예요.`, value: { kind: "tape", pts, total } };
}
// 두 수 사이: parts = 2면 한가운데 수, 그 밖이면 같은 간격 한 칸
function betweenExample({ id, title, lo, hi, parts }) {
  const gap = hi - lo, one = gap / parts, mid = lo + one;
  const ticks = Array.from({ length: parts + 1 }, (_, i) => ({ label: String(lo + one * i), at: lo + one * i }));
  const fig = (tone, show) => ({ kind: "dist-line", min: lo - one / 4, points: show ? ticks : [ticks[0], ticks.at(-1)], arcs: show ? ticks.slice(1).map((t, i) => ({ from: ticks[i].label, to: t.label, label: `${one}`, side: "over" })) : [{ from: ticks[0].label, to: ticks.at(-1).label, label: `${gap}`, side: "over" }], tone });
  if (parts === 2) {
    const steps = [
      { text: `두 수 사이의 거리는 ${hi} − ${lo} = ${josa(gap, "이에요")}.`, figure: fig("doing", false) },
      { text: `한가운데는 반만큼 간 곳이에요. ${gap} ÷ 2 = ${one}, ${lo} + ${one} = ${mid}.`, figure: fig("check", true) }
    ];
    return { id, title, problem: `${josa(lo, "과")} ${hi}의 한가운데에 있는 수를 구해요.`, figure: fig("given", false), steps, answer: `${josa(mid, "이에요")}.`, value: { kind: "mid", lo, hi, ans: mid } };
  }
  const steps = [
    { text: `${lo}부터 ${hi}까지의 거리는 ${hi} − ${lo} = ${josa(gap, "이에요")}.`, figure: fig("doing", false) },
    { text: `같은 간격 ${parts}개로 나누면 한 칸은 ${gap} ÷ ${parts} = ${one}.`, figure: fig("check", true) }
  ];
  return { id, title, problem: `${lo}부터 ${hi}까지를 같은 간격 ${parts}개로 나누었어요. 한 칸의 크기는 얼마일까요?`, figure: fig("given", false), steps, answer: `한 칸은 ${josa(one, "이에요")}.`, value: { kind: "interval", lo, hi, parts, ans: one } };
}
// 몇 배: 막대 칸 수(units). lenA가 있으면 길이로 다른 막대 구하기
function timesBarExample({ id, title, a, b, names = ["A", "B"], lenA = null }) {
  const [P, Q] = names;
  if (lenA === null) {
    if (b % a) throw new Error(`${id}: 나누어떨어지지 않음`);
    const k = b / a;
    const steps = [
      { text: `${josa(P, "을")} 한 묶음으로 보고 ${Q}에 몇 번 들어가는지 세요. ${josa(P, "은")} ${a}칸, ${josa(Q, "은")} ${b}칸이에요.`, figure: { kind: "unit-bars", rows: [{ label: P, units: a }, { label: Q, units: b }], tone: "doing" } },
      { text: `${b} ÷ ${a} = ${k}. ${josa(Q, "은")} ${P}의 ${k}배예요.`, figure: { kind: "unit-bars", rows: [{ label: P, units: a }, { label: Q, units: b }], tone: "check" } }
    ];
    return { id, title, problem: `${josa(Q, "은")} ${P}의 몇 배일까요?`, figure: { kind: "unit-bars", rows: [{ label: P, units: a }, { label: Q, units: b }], tone: "given" }, steps, answer: `${k}배예요.`, value: { kind: "times", a, b, k } };
  }
  const unit = lenA / a, lenB = unit * b;
  const rows = (show) => [{ label: P, units: a, len: `${lenA}cm` }, { label: Q, units: b, len: show ? `${lenB}cm` : null }];
  const steps = [
    { text: `${josa(P, "은")} ${a}칸이고 ${lenA}cm라 한 칸은 ${lenA} ÷ ${a} = ${unit}cm.`, figure: { kind: "unit-bars", rows: rows(false), tone: "doing" } },
    { text: `${josa(Q, "은")} ${b}칸이라 ${unit} × ${b} = ${lenB}cm.`, figure: { kind: "unit-bars", rows: rows(true), tone: "check" } }
  ];
  return { id, title, problem: `${josa(P, "이")} ${lenA}cm일 때 ${Q}의 길이를 구해요.`, figure: { kind: "unit-bars", rows: rows(false), tone: "given" }, steps, answer: `${lenB}cm예요.`, value: { kind: "len", a, b, lenA, lenB } };
}
const MISC_SET = {
  id: "misc",
  types: {
    "시계 읽기": () => [clockReadExample({ id: "clk-1", title: "예제 1", h: 4, m: 35 }), clockReadExample({ id: "clk-2", title: "예제 2", h: 10, m: 50 })],
    "모두 좋아하는 수": () => [vennExample({ id: "venn-both-1", title: "예제 1", labels: ["딸기", "수박"], a: 12, b: 14, both: 6, ask: "both" })],
    "전체 수": () => [vennExample({ id: "venn-total-1", title: "예제 1", labels: ["농구", "수영"], a: 11, b: 8, both: 3, ask: "total" })],
    "둘 다 싫은 수": () => [vennExample({ id: "venn-out-1", title: "예제 1", labels: ["사과", "배"], a: 22, b: 18, both: 9, out: 9, ask: "out", universe: true })],
    "하나만 좋아하는 수": () => [vennExample({ id: "venn-only-1", title: "예제 1", labels: ["강아지", "고양이"], a: 27, b: 20, both: 14, out: 5, ask: "only", universe: true })],
    "두 식의 묶음수": () => [bundleTwoExample({ id: "b2eq-1", title: "예제 1", x: 7, y: 8 })],
    "두 저울의 묶음수": () => [bundleTwoExample({ id: "b2sc-1", title: "예제 1", x: 6, y: 13, scale: true })],
    "겹친 전체 거리에서 부분 거리 찾기": () => [partDistExample({ id: "part-1", title: "예제 1", names: ["집", "학교", "공원"], whole: 64, part: 27 })],
    "겹친 선분의 합과 차": () => [chainSegExample({ id: "chain4-1", title: "예제 1", pos: [0, 5, 12, 20] })],
    "접힌 색테이프의 전체 길이": () => [tapeExample({ id: "tape-1", title: "예제 1", pts: [[0, 0], [4, 0], [4, 2], [1, 2], [1, 3]] })],
    "두 수의 한가운데 수": () => [betweenExample({ id: "mid-1", title: "예제 1", lo: 6, hi: 30, parts: 2 })],
    "기준량의 몇 배": () => [timesBarExample({ id: "times-1", title: "예제 1", a: 3, b: 12 })],
    "똑같은 간격의 한 칸": () => [betweenExample({ id: "intv-1", title: "예제 1", lo: 2, hi: 14, parts: 3 })],
    "두 막대의 배수 비교": () => [timesBarExample({ id: "times-2", title: "예제 1", a: 2, b: 6, names: ["ㄴ", "ㄱ"] })],
    "한 막대의 길이로 다른 막대 찾기": () => [timesBarExample({ id: "len-1", title: "예제 1", a: 3, b: 5, names: ["ㄱ", "ㄴ"], lenA: 12 })]
  }
};

// ───────────────────────── 1권 가쿠로 · 조건에 맞는 수 · 줄의 합을 같게 ─────────────────────────
// 가쿠로: 빈칸이 하나만 남은 줄부터 「줄의 합 − 아는 수」로 채운다(카드는 한 번씩). 조건에 맞는 수: 조건 하나씩 좁힌다.
// 줄의 합을 같게: 두 줄이 함께 쓰는 가운데 수는 양쪽에서 빼도 되니, 바깥 수끼리 합이 같아야 한다.
function gakuroExample({ id, title, grid, shown, cards }) {
  const R = grid.length, C = grid[0].length, rows = grid.map((r) => sum(r)), cols = grid[0].map((_, c) => sum(grid.map((r) => r[c])));
  const known = grid.map((r, i) => r.map((v, j) => (shown.some(([a, b]) => a === i && b === j) ? v : null)));
  const blanks = known.flat().filter((v) => v === null).length;
  if (blanks !== cards.length || [...cards].sort().join() !== grid.flat().filter((_, k) => known.flat()[k] === null).sort().join()) throw new Error(`${id}: 카드와 빈칸이 맞지 않음`);
  const cells = (g) => g.map((r) => r.map((v) => (v === null ? "" : String(v))));
  const steps = [], cur = known.map((r) => [...r]);
  for (let guard = 0; guard < 20 && cur.flat().includes(null); guard++) {
    let moved = false;
    for (let i = 0; i < R && !moved; i++) { const miss = cur[i].map((v, j) => (v === null ? j : -1)).filter((j) => j >= 0); if (miss.length === 1) { const j = miss[0], v = rows[i] - sum(cur[i].filter((x) => x !== null)); cur[i][j] = v; steps.push({ text: `${["첫째", "둘째", "셋째"][i]} 가로줄은 빈칸이 하나예요. ${rows[i]} − ${cur[i].filter((x, k) => k !== j).join(" − ")} = ${v}.`, figure: { kind: "mgrid", cells: cells(cur), rowVals: rows, colVals: cols, focus: { row: i }, op: "+", tone: "doing" } }); moved = true; } }
    for (let j = 0; j < C && !moved; j++) { const col = cur.map((r) => r[j]), miss = col.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0); if (miss.length === 1) { const i = miss[0], v = cols[j] - sum(col.filter((x) => x !== null)); cur[i][j] = v; steps.push({ text: `${["첫째", "둘째", "셋째"][j]} 세로줄은 빈칸이 하나예요. ${cols[j]} − ${col.filter((x, k) => k !== i).join(" − ")} = ${v}.`, figure: { kind: "mgrid", cells: cells(cur), rowVals: rows, colVals: cols, focus: { col: j }, op: "+", tone: "doing" } }); moved = true; } }
    if (!moved) throw new Error(`${id}: 빈칸 하나 남은 줄로 풀리지 않음`);
  }
  steps.push({ text: `카드 ${josa(cards.join(", "), "을")} 한 번씩 다 썼고, 가로줄 ${rows.join(", ")}, 세로줄 ${cols.join(", ")}도 맞아요.`, figure: { kind: "mgrid", cells: cells(cur), rowVals: rows, colVals: cols, op: "+", tone: "check" } });
  return { id, title, problem: `빈칸에 ${josa(cards.join(", "), "을")} 한 번씩 넣어 가로줄·세로줄의 합이 오른쪽과 아래의 수가 되게 해요.`, figure: { kind: "mgrid", cells: cells(known), rowVals: rows, colVals: cols, op: "+", tone: "given" }, steps, answer: `${josa(grid.map((r, i) => `${["첫째", "둘째", "셋째"][i]} 줄 ${r.join(", ")}`).join(" · "), "이에요")}.`, value: { kind: "gakuro", grid, known, cards, rows, cols } };
}
function equalPartsExample({ id, title, values, parts }) {
  const outs = values.map((v) => v / parts);
  if (outs.some((x) => !Number.isInteger(x))) throw new Error(`${id}: 나누어떨어지지 않음`);
  const steps = [
    { text: `같은 ${HOW_MANY[parts]} 수로 나누면 한 수는 ${numEuro(parts)} 나눈 수예요. ${values[0]} ÷ ${parts} = ${outs[0]}, ${Array(parts).fill(outs[0]).join(" + ")} = ${values[0]}.`, figure: { kind: "tree", levels: [[values[0]], Array(parts).fill(outs[0])], tone: "doing" } },
    { text: `나머지도 같아요. ${values.slice(1).map((v, i) => `${v} ÷ ${parts} = ${outs[i + 1]}`).join(", ")}.`, figure: { kind: "eqs", lines: values.map((v, i) => `${v} = ${Array(parts).fill(outs[i]).join(" + ")}`), tone: "check" } }
  ];
  return { id, title, problem: `${josa(values.join(", "), "을")} 각각 같은 ${HOW_MANY[parts]} 수로 나누어요. 한 수는 각각 얼마일까요?`, figure: { kind: "eqs", lines: values.map((v) => `${v} = ${Array(parts).fill("□").join(" + ")}`), tone: "given" }, steps, answer: `차례로 ${josa(outs.join(", "), "이에요")}.`, value: { kind: "parts", values, parts, outs } };
}
// 조건에 맞는 수: digits 자리 수, conds = [{ text, test }] — 검사기는 test를 다시 쓰지 않고 cond.kind로 따로 판단한다
const COND = {
  sum: (k) => ({ kind: "sum", k, text: `십의 자리 숫자 + 일의 자리 숫자 = ${k}`, test: (n) => [...String(n)].reduce((a, d) => a + Number(d), 0) === k }),
  even: () => ({ kind: "even", text: "짝수", test: (n) => n % 2 === 0 }),
  over: (k) => ({ kind: "over", k, text: `${k}보다 큰 수`, test: (n) => n > k }),
  onesLess: (k) => ({ kind: "onesLess", k, text: `일의 자리 숫자가 십의 자리 숫자보다 ${k} 작음`, test: (n) => Math.floor(n / 10) % 10 - (n % 10) === k }),
  down: (k) => ({ kind: "down", k, text: `높은 자리부터 숫자가 ${k}씩 작아짐`, test: (n) => { const d = [...String(n)].map(Number); return d.every((x, i) => !i || d[i - 1] - x === k); } }),
  ones: (k) => ({ kind: "ones", k, text: `일의 자리 숫자가 ${k}`, test: (n) => n % 10 === k }),
  allEven: () => ({ kind: "allEven", text: "세 숫자가 모두 짝수", test: (n) => [...String(n)].every((d) => Number(d) % 2 === 0) }),
  digitSum: (k) => ({ kind: "digitSum", k, text: `각 자리 숫자의 합이 ${k}`, test: (n) => [...String(n)].reduce((a, d) => a + Number(d), 0) === k }),
  incr: () => ({ kind: "incr", text: "백의 자리 숫자가 가장 작고 일의 자리 숫자가 가장 큼", test: (n) => { const [a, b, c] = [...String(n)].map(Number); return a < b && a < c && c > a && c > b; } })
};
function conditionExample({ id, title, digits, conds, all = true }) {
  const lo = 10 ** (digits - 1), hi = 10 ** digits - 1, list = [];
  for (let n = lo; n <= hi; n++) if (conds.every((c) => c.test(n))) list.push(n);
  if (!list.length || (!all && list.length !== 1)) throw new Error(`${id}: 답이 ${list.length}개`);
  const steps = conds.map((c, i) => { const keep = []; for (let n = lo; n <= hi; n++) if (conds.slice(0, i + 1).every((x) => x.test(n))) keep.push(n); return { text: `${i === 0 ? "먼저 " : ""}「${c.text}」${i === 0 ? "인 수를 찾아요" : "에도 맞는 수만 남겨요"}. ${keep.length > 12 ? `${keep.slice(0, 6).join(", ")}, …` : keep.join(", ")}.`, figure: { kind: "seq", values: keep.slice(0, 10), tone: i === conds.length - 1 ? "check" : "doing" } }; });
  if (steps.length === 1) steps.unshift({ text: digits === 2 ? "십의 자리 숫자를 1부터 9까지 바꿔 가며 일의 자리 숫자를 맞춰 봐요." : "백의 자리 숫자를 1부터 9까지 바꿔 가며 나머지 두 자리를 맞춰 봐요.", figure: { kind: "eqs", lines: conds.map((c) => c.text), tone: "doing" } });
  const condText = conds.map((c) => `「${c.text}」`).join(", ");
  return { id, title, problem: `${condText}${conds.length > 1 ? "에 다 맞는" : "인"} ${digits === 2 ? "두" : "세"} 자리 수를 ${all ? "모두 " : ""}구해요.`, figure: { kind: "eqs", lines: conds.map((c) => c.text), tone: "given" }, steps, answer: `${josa(list.join(", "), "이에요")}.`, value: { kind: "cond", digits, conds: conds.map(({ kind, k }) => ({ kind, k })), list } };
}
function placeValueExample({ id, title, counts, ask }) {
  const units = [1000, 100, 10, 1].slice(4 - counts.length), n = sum(counts.map((c, i) => c * units[i]));
  const names = { 1000: "천", 100: "백", 10: "십", 1: "일" };
  const lines = counts.map((c, i) => `${units[i]}이 ${c}개`);
  const steps = [
    { text: `${counts.map((c, i) => `${units[i]}이 ${c}개면 ${units[i] * c}`).join(", ")}.`, figure: { kind: "eqs", lines, tone: "doing" } },
    { text: `모두 더하면 ${counts.map((c, i) => units[i] * c).join(" + ")} = ${n}. ${names[units[ask]]}의 자리 숫자는 ${counts[ask]}.`, figure: { kind: "eqs", lines: [...lines, `= ${n}`], tone: "check" } }
  ];
  return { id, title, problem: `${lines.join(", ")}인 수와 ${names[units[ask]]}의 자리 숫자를 구해요.`, figure: { kind: "eqs", lines, tone: "given" }, steps, answer: `${n}, ${names[units[ask]]}의 자리 숫자는 ${josa(counts[ask], "이에요")}.`, value: { kind: "place", counts, ask, n } };
}
function digitCountExample({ id, title, nums, digits }) {
  const pick = nums.filter((n) => String(n).length === digits);
  const steps = [
    { text: `수마다 자리가 몇 개인지 세요. ${nums.map((n) => `${n}: ${String(n).length}자리`).join(", ")}.`, figure: { kind: "seq", values: nums, notes: nums.map((n) => `${String(n).length}자리`), tone: "doing" } },
    { text: `${digits === 2 ? "두" : "세"} 자리 수는 ${pick.join(", ")} — 모두 ${pick.length}개.`, figure: { kind: "seq", values: pick, tone: "check" } }
  ];
  return { id, title, problem: `${nums.join(", ")} 중 ${digits === 2 ? "두" : "세"} 자리 수는 몇 개일까요?`, figure: { kind: "seq", values: nums, tone: "given" }, steps, answer: `${pick.length}개예요.`, value: { kind: "dcount", nums, digits, count: pick.length } };
}
// 줄의 합을 같게(십자): 가로 [l, c, r], 세로 [t, c, ?] — ? = l + r − t
function crossSumExample({ id, title, l, c, r, t }) {
  const b = l + r - t;
  if (b <= 0) throw new Error(`${id}: 음수`);
  const steps = [
    { text: `가로줄의 합은 ${l} + ${c} + ${r} = ${l + c + r}. 세로줄도 ${josa(l + c + r, "이")} 되어야 해요.`, figure: { kind: "eqs", lines: [`${l} + ${c} + ${r} = ${l + c + r}`, `${t} + ${c} + ? = ${l + c + r}`], tone: "doing" } },
    { text: `가운데 ${josa(c, "은")} 두 줄이 함께 써요. 양쪽에서 빼면 바깥 수끼리 합이 같아요. ${l} + ${r} = ${l + r}, 그래서 ${t} + ? = ${l + r}.`, figure: { kind: "eqs", lines: [`${l} + ${r} = ${l + r}`, `${t} + ? = ${l + r}`], tone: "doing" } },
    { text: `? = ${l + r} − ${t} = ${b}.`, figure: { kind: "eqs", lines: [`${t} + ${c} + ${b} = ${l + c + r}`], tone: "check" } }
  ];
  return { id, title, problem: `십자 모양으로 놓인 수에서 가로줄은 ${l}, ${c}, ${ira(r, "고")}, 세로줄은 위 ${t}, 가운데 ${c}, 아래 ?예요. 두 줄의 합이 같도록 ?에 알맞은 수를 구해요.`, figure: { kind: "eqs", lines: [`가로: ${l}, ${c}, ${r}`, `세로: ${t}, ${c}, ?`], tone: "given" }, steps, answer: `?는 ${josa(b, "이에요")}.`, value: { kind: "cross", l, c, r, t, b } };
}
const BOOK1_SET = {
  id: "book1",
  // 1권 「모든 줄의 합을 같게」 원본은 유형 이름이 비어 있다
  typeOf: (item) => item.typeLabel || "줄의 합을 같게",
  types: {
    "줄의 합을 같게": () => [crossSumExample({ id: "cross-1", title: "예제 1", l: 9, c: 6, r: 2, t: 4 }), crossSumExample({ id: "cross-2", title: "예제 2", l: 3, c: 8, r: 12, t: 10 })],
    "2×2 카드 가쿠로": () => [gakuroExample({ id: "gk22-1", title: "예제 1", grid: [[7, 4], [5, 2]], shown: [[0, 0]], cards: [2, 4, 5] })],
    "3×2 카드 가쿠로": () => [gakuroExample({ id: "gk32-1", title: "예제 1", grid: [[6, 3], [2, 8], [5, 4]], shown: [[0, 0], [1, 1]], cards: [2, 3, 4, 5] })],
    "2×3 카드 가쿠로": () => [gakuroExample({ id: "gk23-1", title: "예제 1", grid: [[3, 6, 9], [7, 2, 4]], shown: [[0, 2], [1, 0]], cards: [2, 3, 4, 6] })],
    "3×3 카드 가쿠로": () => [gakuroExample({ id: "gk33-1", title: "예제 1", grid: [[3, 8, 1], [6, 2, 9], [4, 7, 5]], shown: [[0, 0], [0, 1], [1, 0], [2, 2]], cards: [1, 2, 4, 7, 9] })],
    "같은 두 수로 나누기": () => [equalPartsExample({ id: "half2-1", title: "예제 1", values: [36, 52, 74, 90], parts: 2 })],
    "같은 네 수로 나누기": () => [equalPartsExample({ id: "quarter4-1", title: "예제 1", values: [44, 52, 68, 80], parts: 4 })],
    "같은 세 수로 나누기": () => [equalPartsExample({ id: "third3-1", title: "예제 1", values: [9, 21, 27, 36, 45], parts: 3 })],
    "자리 수 세기": () => [digitCountExample({ id: "dcount-1", title: "예제 1", nums: [9, 53, 718, 26, 4402, 81], digits: 2 })],
    "자릿값으로 수 만들기": () => [placeValueExample({ id: "pv-1", title: "예제 1", counts: [4, 7, 2], ask: 1 })],
    "수 모형 읽기": () => [placeValueExample({ id: "pv-2", title: "예제 1", counts: [3, 2, 7, 4], ask: 0 })],
    "두 자리 수 모두 찾기": () => [conditionExample({ id: "cond-1", title: "예제 1", digits: 2, conds: [COND.sum(5)] })],
    "두 조건의 두 자리 수": () => [conditionExample({ id: "cond-2", title: "예제 1", digits: 2, conds: [COND.sum(9), COND.even()] })],
    "세 조건의 두 자리 수": () => [conditionExample({ id: "cond-3", title: "예제 1", digits: 2, conds: [COND.over(70), COND.even(), COND.onesLess(2)], all: false })],
    "세 자리 수 모두 찾기": () => [conditionExample({ id: "cond-4", title: "예제 1", digits: 3, conds: [COND.down(1)] })],
    "조건을 더해 하나 찾기": () => [conditionExample({ id: "cond-5", title: "예제 1", digits: 3, conds: [COND.down(3), COND.ones(2)], all: false })],
    "세 조건의 세 자리 수": () => [conditionExample({ id: "cond-6", title: "예제 1", digits: 3, conds: [COND.allEven(), COND.digitSum(14), COND.incr()], all: false })],
    // 숫자 카드로 모든 줄의 합을 같게
    "교차점에 가능한 수 모두 찾기": () => [crossCenterExample({ id: "center-1", title: "예제 1", cards: [2, 4, 6, 8, 10] })],
    "숫자 카드로 같은 합 만들기": () => [lineCardsExample({ id: "tline-1", title: "예제 1", layout: "t", full: [8, 6, 4, 9, 3], shown: { 0: 8, 4: 3 }, plan: [
      { text: "가운데 칸은 두 줄이 함께 써요. 그래서 가로줄의 양 끝 합(8 + 오른쪽)과 세로줄의 아래 두 칸 합(가운데 아래 + 3)이 같아야 해요.", known: [], hi: [1] },
      { text: "8 + 오른쪽 = 가운데 아래 + 3이니 가운데 아래 칸이 오른쪽 칸보다 5 커요. 카드 4, 6, 9 중 5 차이는 4와 9뿐이라 오른쪽 4, 가운데 아래 9.", known: [2, 3], hi: [2, 3] },
      { text: "남은 6이 가운데예요. 8 + 6 + 4 = 18, 6 + 9 + 3 = 18.", known: [1, 2, 3], hi: [1] }
    ] })],
    "각 자리 숫자의 합이 같은 두 자리 수": () => [digitSumListExample({ id: "dsum-1", title: "예제 1", sums: [11, 12, 13] })]
  }
};

// ───────────────────────── 1권 카드로 줄의 합 · 2권 마디수열 · 스도쿠 ─────────────────────────
// 줄 판(kind "line-board"): pts = 자리 좌표(0~100), lines = 같은 합이 되어야 하는 줄(자리 번호 묶음). 교차점은 여러 줄이 함께 쓴다.
const LINE_LAYOUT = {
  cross: { pts: [[10, 50], [30, 50], [50, 50], [70, 50], [90, 50], [50, 10], [50, 30], [50, 70], [50, 90]], lines: [[0, 1, 2, 3, 4], [5, 6, 2, 7, 8]] },
  cross5: { pts: [[15, 50], [50, 50], [85, 50], [50, 15], [50, 85]], lines: [[0, 1, 2], [3, 1, 4]] },
  t: { pts: [[15, 15], [50, 15], [85, 15], [50, 50], [50, 85]], lines: [[0, 1, 2], [1, 3, 4]] },
  tri6: { pts: [[50, 8], [29, 47], [71, 47], [8, 86], [50, 86], [92, 86]], lines: [[0, 1, 3], [0, 2, 5], [3, 4, 5]] }
};
const lineBoard = (layout, vals, p = {}) => ({ kind: "line-board", ...LINE_LAYOUT[layout], vals, hi: p.hi, pair: p.pair, tone: p.tone || "doing" });
// 교차점 후보: 카드 다섯 장을 십자에 한 번씩. 가운데를 빼고 남은 네 장이 같은 합의 두 짝으로 나뉘면 된다
function crossCenterExample({ id, title, cards }) {
  const total = sum(cards), trial = cards.map((c) => {
    const rest = cards.filter((x) => x !== c), split = [1, 2, 3].map((j) => [[rest[0], rest[j]], rest.slice(1).filter((_, k) => k !== j - 1)]).find(([a, b]) => sum(a) === sum(b));
    return { c, rest, pair: split || null };
  });
  const good = trial.filter((t) => t.pair);
  if (!good.length) throw new Error(`${id}: 가운데 후보 없음`);
  const pairText = (t) => `${t.pair[0].join(" + ")} = ${t.pair[1].join(" + ")} = ${sum(t.pair[0])}`;
  const steps = [
    { text: "가운데 칸은 가로줄과 세로줄이 함께 써요. 가운데를 빼고 남은 네 장을 합이 같은 두 짝으로 나눌 수 있어야 해요.", figure: lineBoard("cross5", ["", "?", "", "", ""], { hi: [1] }) },
    ...trial.map((t, i) => ({ text: t.pair ? `가운데 ${ira(t.c, "면")} 남은 ${t.rest.join(", ")}. ${ira(pairText(t))} 돼요.` : `가운데 ${ira(t.c, "면")} 남은 ${t.rest.join(", ")}의 합은 ${sum(t.rest)}. 같은 합의 두 짝으로 나눌 수 없어요.`, figure: lineBoard("cross5", t.pair ? [t.pair[0][0], t.c, t.pair[0][1], t.pair[1][0], t.pair[1][1]] : ["", t.c, "", "", ""], { hi: [1], tone: i === trial.length - 1 ? "check" : "doing" }) }))
  ];
  steps.at(-1).text += ` 가운데에 올 수 있는 수는 ${good.map((t) => t.c).join(", ")}.`;
  return { id, title, problem: `숫자 카드 ${josa(cards.join(", "), "을")} 십자 모양 다섯 칸에 한 번씩 놓아 가로줄과 세로줄의 합을 같게 해요. 가운데 칸에 올 수 있는 수를 모두 구해요.`, figure: lineBoard("cross5", ["", "", "", "", ""], { tone: "given" }), steps, answer: `${josa(good.map((t) => t.c).join(", "), "이에요")}.`, value: { kind: "center", layout: "cross5", cards, centers: good.map((t) => t.c), total } };
}
// 빈자리에 카드를 놓아 줄의 합 같게(T자): shown = { 자리: 수 }, plan은 글만 — 검사기가 카드를 모든 자리에 넣어 보고 하나뿐인지 본다
function lineCardsExample({ id, title, layout, full, shown, plan }) {
  const L = LINE_LAYOUT[layout], sums = L.lines.map((ln) => sum(ln.map((i) => full[i])));
  if (new Set(sums).size !== 1) throw new Error(`${id}: 줄의 합이 다름`);
  const cards = full.filter((_, i) => shown[i] === undefined).sort((a, b) => a - b);
  const vals = (known) => full.map((v, i) => (shown[i] !== undefined || known.includes(i) ? v : ""));
  const steps = plan.map((p, i) => ({ text: p.text, figure: lineBoard(layout, vals(p.known), { hi: p.hi, tone: i === plan.length - 1 ? "check" : "doing" }) }));
  return { id, title, problem: `숫자 카드 ${josa(cards.join(", "), "을")} 빈자리에 한 번씩 놓아 두 줄의 합을 같게 해요. 한 줄의 합은 얼마일까요?`, figure: lineBoard(layout, vals([]), { tone: "given" }), steps, answer: `한 줄의 합은 ${josa(sums[0], "이에요")}.`, value: { kind: "line-cards", layout, full, shown, cards, lineSum: sums[0] } };
}
// 각 자리 숫자의 합이 k인 두 자리 수: 십의 자리를 1씩 올리면 일의 자리는 1씩 내려간다
function digitSumListExample({ id, title, sums }) {
  const lists = sums.map((k) => { const out = []; for (let t = 1; t <= 9; t++) if (k - t >= 0 && k - t <= 9) out.push(t * 10 + (k - t)); return out; });
  const steps = [
    { text: "십의 자리 숫자를 1씩 크게 하면 일의 자리 숫자는 1씩 작아져야 합이 그대로예요. 일의 자리는 9까지만 돼요.", figure: { kind: "eqs", lines: sums.map((k) => `십의 자리 + 일의 자리 = ${k}`), tone: "doing" } },
    ...sums.map((k, i) => ({ text: `합이 ${ira(k, "면")} ${lists[i].join(", ")} — ${lists[i].length}개.`, figure: { kind: "seq", values: lists[i], tone: i === sums.length - 1 ? "check" : "doing" } }))
  ];
  steps.at(-1).text += ` 합이 1 커질 때마다 1개씩 줄어요.`;
  return { id, title, problem: `각 자리 숫자의 합이 ${sums.join(", ")}인 두 자리 수를 빠짐없이 쓰고, 몇 개씩인지 세어요.`, figure: { kind: "eqs", lines: sums.map((k) => `십의 자리 + 일의 자리 = ${k}`), tone: "given" }, steps, answer: `${sums.map((k, i) => `합 ${k}: ${lists[i].length}개`).join(", ")}예요.`, value: { kind: "dsum", sums, lists } };
}
// 마디수열: period를 되풀이할 때 n번째. n ÷ 마디 길이의 나머지가 0이면 마디의 마지막
function periodExample({ id, title, period, n, what = "수" }) {
  const len = period.length, q = Math.floor(n / len), r = n % len, ans = period[(n - 1) % len], shown = [...period, ...period, period[0]];
  const steps = [
    { text: `${josa(period.join(", "), "이")} 다시 처음부터 나와요. ${len}칸이 한 마디예요.`, figure: { kind: "seq", values: shown, notes: shown.map((_, i) => (i < len * 2 ? `${(i % len) + 1}` : "")), tone: "doing" } },
    { text: `${n}번째는 ${n} ÷ ${len} = ${q} … ${r}. 마디를 ${q}번 다 돌고 ${r ? `${r}칸 더 가요` : "딱 끝나요"}.`, figure: { kind: "eqs", lines: [`${n} ÷ ${len} = ${q} … ${r}`], tone: "doing" } },
    { text: r ? `나머지가 ${ira(r)} 한 마디의 ${r}번째 ${what}, ${ans}.` : `나머지가 0이라 한 마디의 마지막 ${what}, ${ans}.`, figure: { kind: "seq", values: period, notes: period.map((_, i) => (i === (n - 1) % len ? "여기" : "")), tone: "check" } }
  ];
  return { id, title, problem: `${period.join(", ")}, ${period.join(", ")}, …처럼 되풀이돼요. ${n}번째 ${josa(what, "은")} 무엇일까요?`, figure: { kind: "seq", values: shown, tone: "given", ask: "?" }, steps, answer: `${josa(ans, "이에요")}.`, value: { kind: "period", period, n, ans } };
}
// 스도쿠: 가로줄·세로줄(4×4는 굵은 네 칸 구역도)에 1부터 n까지 한 번씩. 빈칸마다 알파벳, 들어갈 수가 하나뿐인 칸부터 채운다
function sudokuCands(g, n, i) {
  const r = Math.floor(i / n), c = i % n, used = new Set();
  for (let k = 0; k < n; k++) { used.add(g[r * n + k]); used.add(g[k * n + c]); }
  if (n === 4) { const br = r - (r % 2), bc = c - (c % 2); for (const [dr, dc] of [[0, 0], [0, 1], [1, 0], [1, 1]]) used.add(g[(br + dr) * n + bc + dc]); }
  return Array.from({ length: n }, (_, k) => k + 1).filter((v) => !used.has(v));
}
function sudokuExample({ id, title, n, solution, blanks }) {
  const letters = Object.fromEntries(blanks.map((i, k) => [i, "ABCDEFGH"[k]])), g = solution.map((v, i) => (blanks.includes(i) ? 0 : v));
  const fig = (tone, hi) => ({ kind: "sudoku", n, cells: g.map((v, i) => (v ? String(v) : letters[i])), filled: blanks.filter((i) => g[i]), hi, tone });
  const given = fig("given"), steps = [];
  const seen = (i) => { const r = Math.floor(i / n), c = i % n, out = new Set(); for (let k = 0; k < n; k++) { out.add(g[r * n + k]); out.add(g[k * n + c]); } if (n === 4) { const br = r - (r % 2), bc = c - (c % 2); for (const [dr, dc] of [[0, 0], [0, 1], [1, 0], [1, 1]]) out.add(g[(br + dr) * n + bc + dc]); } out.delete(0); return [...out].sort((a, b) => a - b); };
  for (let guard = 0; guard < 20 && g.includes(0); guard++) {
    const i = g.findIndex((v, k) => v === 0 && sudokuCands(g, n, k).length === 1);
    if (i < 0) throw new Error(`${id}: 한 칸씩 정해지지 않음`);
    const v = sudokuCands(g, n, i)[0], have = seen(i);
    g[i] = v;
    steps.push({ text: `${letters[i]} 칸과 같은 가로줄·세로줄${n === 4 ? "·굵은 구역" : ""}에 ${josa(have.join(", "), "이")} 있어요. 남은 수는 ${v}.`, figure: fig("doing", [i]) });
  }
  steps.push({ text: `모든 가로줄과 세로줄${n === 4 ? ", 굵은 구역" : ""}에 1부터 ${n}까지 한 번씩 들어갔어요.`, figure: fig("check", []) });
  return { id, title, problem: `가로줄, 세로줄${n === 4 ? ", 굵은 선 안" : ""}에 1부터 ${n}까지 한 번씩 들어가도록 ${blanks.map((i) => letters[i]).join(", ")} 칸을 채워요.`, figure: given, steps, answer: `${josa(blanks.map((i) => `${letters[i]} = ${solution[i]}`).join(", "), "이에요")}.`, value: { kind: "sudoku", n, solution, blanks } };
}
const BOOK2_SET = {
  id: "book2",
  types: {
    "마디수열의 특정 번째 수": () => [periodExample({ id: "period-1", title: "예제 1", period: [5, 1, 8], n: 17 }), periodExample({ id: "period-2", title: "예제 2", period: [7, 3, 9, 2], n: 24 })],
    "마디수열의 특정 번째 모양": () => [periodExample({ id: "period-3", title: "예제 1", period: ["○", "△", "□", "◇"], n: 19, what: "모양" })],
    "3×3 스도쿠 빈칸 채우기": () => [sudokuExample({ id: "sdk3-1", title: "예제 1", n: 3, solution: [2, 3, 1, 1, 2, 3, 3, 1, 2], blanks: [1, 2, 3, 4, 5] })],
    // 모양과 색의 규칙
    "한 가지 반복 규칙": () => [periodExample({ id: "period-4", title: "예제 1", period: ["●", "○", "○", "●"], n: 26, what: "모양" })],
    "모양과 색·개수의 이중 규칙": () => [dualExample({ id: "dual-1", title: "예제 1", shapes: ["○", "△", "□"], colors: [0, 1], n: 10 })],
    "4×4 스도쿠 빈칸 채우기": () => [sudokuExample({ id: "sdk4-1", title: "예제 1", n: 4, solution: [1, 4, 2, 3, 2, 3, 1, 4, 4, 1, 3, 2, 3, 2, 4, 1], blanks: [1, 4, 5, 7, 11, 14] })]
  }
};

// ───────────────────────── 3권 마법카드 ─────────────────────────
// 칸 줄(kind "strip"): rows = [[{ w, on }]] — w는 칸의 값("?"면 빈칸), on이면 색칠. 다음 칸 = 앞 칸을 모두 더한 수 + 1이면 0부터 빠짐없이.
const strip = (weights, on = [], p = {}) => ({ kind: "strip", rows: [weights.map((w, i) => ({ w, on: on.includes(i) }))], total: p.total, tone: p.tone || "doing" });
function stripFillExample({ id, title, weights }) {
  const at = weights.indexOf("?"), known = weights.filter((w) => w !== "?"), full = [...weights];
  const sorted = [...known].sort((a, b) => a - b), below = sorted.filter((w) => weights.indexOf(w) > at), missing = sum(below) + 1;
  full[at] = missing;
  const max = sum(full);
  const steps = [
    { text: `0, 1, 2, …를 빠짐없이 만들려면 칸마다 자기보다 작은 칸을 모두 더한 수보다 1 커야 해요. ${below.length ? `빈칸보다 작은 칸을 모두 더하면 ${below.length > 1 ? `${below.join(" + ")} = ` : ""}${ira(sum(below))} ${sum(below)}까지는 만들 수 있으니 빈칸은 ${sum(below)} + 1 = ${missing}.` : "빈칸이 가장 작은 칸이라 1을 만들려면 빈칸은 1이에요."}`, figure: strip(full, [at], { tone: "doing" }) },
    { text: `모든 칸을 색칠하면 가장 큰 수예요. ${full.join(" + ")} = ${max}.`, figure: strip(full, full.map((_, i) => i), { total: max, tone: "check" }) }
  ];
  return { id, title, problem: `[${weights.map((w) => (w === "?" ? "□" : w)).join(", ")}] 칸을 골라 색칠한 칸의 값을 더해, 0부터 하나씩 커지는 수를 빠짐없이 나타내요. 빈칸의 값과 나타낼 수 있는 가장 큰 수를 구해요.`, figure: strip(weights, [], { tone: "given" }), steps, answer: `빈칸은 ${missing}, 가장 큰 수는 ${josa(max, "이에요")}.`, value: { kind: "strip-fill", weights, full, missing, max } };
}
function stripMaxExample({ id, title, cells }) {
  const w = Array.from({ length: cells }, (_, i) => 2 ** (cells - 1 - i)), max = 2 ** cells - 1;
  const steps = [
    { text: `가장 작은 칸은 1. 그다음 칸은 앞 칸을 다 더한 수보다 1 크게: 1 + 1 = 2, 1 + 2 + 1 = 4, …. 칸마다 두 배가 돼요.`, figure: strip([4, 2, 1], [], { tone: "doing" }) },
    { text: `${cells}칸은 ${[...w].reverse().join(", ")}.`, figure: strip(w, [], { tone: "doing" }) },
    { text: `모두 색칠하면 ${w.join(" + ")} = ${max}.`, figure: strip(w, w.map((_, i) => i), { total: max, tone: "check" }) }
  ];
  return { id, title, problem: `${cells}칸 마법카드의 칸마다 수를 넣어, 색칠한 칸의 합으로 0부터 하나씩 커지는 수를 가장 많이 나타내려고 해요. 나타낼 수 있는 가장 큰 수는 얼마일까요?`, figure: strip(Array(cells).fill("?"), [], { tone: "given" }), steps, answer: `${josa(max, "이에요")}.`, value: { kind: "strip-max", cells, max } };
}
// 읽기(on을 주면 그 무늬의 수) · 만들기(target을 주면 큰 칸부터 고르기)
function stripCodeExample({ id, title, weights, on = null, target = null, word = "칸" }) {
  if (on) {
    const value = sum(on.map((i) => weights[i]));
    const steps = [
      { text: `색칠한 ${word}의 값만 읽어요. ${on.map((i) => weights[i]).join(", ")}.`, figure: strip(weights, on, { tone: "doing" }) },
      { text: `모두 더하면 ${on.map((i) => weights[i]).join(" + ")} = ${value}.`, figure: strip(weights, on, { total: value, tone: "check" }) }
    ];
    return { id, title, problem: `${word}의 값은 ${ira(weights.join(", "), "고")}, 색칠한 ${word}의 값을 더해 수를 나타내요. 그림의 무늬가 나타내는 수는 얼마일까요?`, figure: strip(weights, on, { tone: "given" }), steps, answer: `${josa(value, "이에요")}.`, value: { kind: "strip-read", weights, on, value } };
  }
  const pick = [], plan = []; let left = target;
  for (const [i, w] of weights.entries()) if (w <= left) { pick.push(i); plan.push(`${left}에서 ${josa(w, "을")} 빼면 ${left - w}`); left -= w; }
  if (left) throw new Error(`${id}: 만들 수 없음`);
  const steps = [
    { text: `큰 ${word}부터 봐요. ${josa(target, "을")} 넘지 않는 가장 큰 값을 고르고, 남은 수로 다시 해요.`, figure: strip(weights, [], { tone: "doing" }) },
    { text: `${plan.join(", ")}.`, figure: strip(weights, pick, { tone: "doing" }) },
    { text: `고른 ${word}: ${pick.map((i) => weights[i]).join(" + ")} = ${target}.`, figure: strip(weights, pick, { total: target, tone: "check" }) }
  ];
  return { id, title, problem: `${word}의 값은 ${josa(weights.join(", "), "이에요")}. ${josa(target, "을")} 나타내려면 어느 ${josa(word, "을")} 색칠할까요?`, figure: strip(weights, [], { tone: "given" }), steps, answer: `${josa(pick.map((i) => weights[i]).join(", "), "을")} 색칠해요.`, value: { kind: "strip-make", weights, target, pick } };
}
// 두 줄 칸 카드: 같은 값의 칸이 위아래로 두 개라 한 값을 0번·1번·2번 쓸 수 있다
const cellRows = (weights, on, p = {}) => ({ kind: "strip", rows: [0, 1].map((r) => weights.map((w, i) => ({ w, on: on.includes(r * weights.length + i) }))), total: p.total, tone: p.tone || "doing" });
function cellCodeExample({ id, title, weights, on = null, ask = "read" }) {
  const n = weights.length;
  if (ask === "max") {
    const max = 2 * sum(weights);
    const steps = [
      { text: `값마다 칸이 두 개라 ${weights.slice(0, 2).map((w) => `${josa(w, "은")} 0, ${w}, ${w * 2}`).join(", ")}처럼 0번·1번·2번 쓸 수 있어요.`, figure: cellRows(weights, [], { tone: "doing" }) },
      { text: `모두 색칠하면 가장 커요. (${weights.join(" + ")}) × 2 = ${max}.`, figure: cellRows(weights, Array.from({ length: n * 2 }, (_, i) => i), { total: max, tone: "check" }) }
    ];
    return { id, title, problem: `위아래 두 줄에 값이 ${weights.join(", ")}인 칸이 하나씩 있어요. 칸을 색칠해 값을 더할 때 나타낼 수 있는 가장 큰 수는 얼마일까요?`, figure: cellRows(weights, [], { tone: "given" }), steps, answer: `${josa(max, "이에요")}.`, value: { kind: "cell-max", weights, max } };
  }
  const value = sum(on.map((k) => weights[k % n]));
  const cols = weights.map((w, i) => on.filter((k) => k % n === i).length);
  const steps = [
    { text: `값마다 색칠한 칸이 몇 개인지 세요. ${weights.map((w, i) => `${w}: ${cols[i]}개`).join(", ")}.`, figure: cellRows(weights, on, { tone: "doing" }) },
    { text: `${weights.map((w, i) => (cols[i] ? `${w} × ${cols[i]}` : null)).filter(Boolean).join(" + ")} = ${value}.`, figure: cellRows(weights, on, { total: value, tone: "check" }) }
  ];
  return { id, title, problem: `위아래 두 줄에 값이 ${weights.join(", ")}인 칸이 하나씩 있어요. 색칠한 칸의 값을 더하면 얼마일까요?`, figure: cellRows(weights, on, { tone: "given" }), steps, answer: `${josa(value, "이에요")}.`, value: { kind: "cell-read", weights, on, value } };
}
const BOOK3_SET = {
  id: "book3",
  types: {
    "0부터 빠짐없이 나타내는 두 칸 마법카드": () => [stripFillExample({ id: "fill2-1", title: "예제 1", weights: ["?", 1] })],
    "0부터 빠짐없이 나타내는 세 칸 마법카드": () => [stripFillExample({ id: "fill3-1", title: "예제 1", weights: [4, "?", 1] }), stripFillExample({ id: "fill4-1", title: "예제 2", weights: [8, 4, 2, "?"] })],
    "다섯 칸 마법카드의 가장 큰 수": () => [stripMaxExample({ id: "max4-1", title: "예제 1", cells: 4 })],
    "여섯 칸 마법카드의 가장 큰 수": () => [stripMaxExample({ id: "max7-1", title: "예제 1", cells: 7 })],
    "마법카드로 목표 수 나타내기": () => [stripCodeExample({ id: "read-1", title: "예제 1", weights: [16, 8, 4, 2, 1], on: [0, 2, 3] }), stripCodeExample({ id: "make-1", title: "예제 2", weights: [16, 8, 4, 2, 1], target: 13 })],
    "별 조각의 값을 더해 목표 수 만들기": () => [stripCodeExample({ id: "star-1", title: "예제 1", weights: [16, 8, 4, 2, 1], target: 27, word: "조각" })],
    "두 줄 칸 카드로 목표 수 나타내기": () => [cellCodeExample({ id: "cell-1", title: "예제 1", weights: [9, 3, 1], on: [0, 1, 4, 5] })],
    "두 줄 칸 카드의 가장 큰 수": () => [cellCodeExample({ id: "cell-2", title: "예제 1", weights: [9, 3, 1], ask: "max" })]
  }
};

// ───────────────────────── 9권 원형진·삼각진 ─────────────────────────
// 삼각진 자리 = [맨 위, 왼쪽 가운데, 오른쪽 가운데, 왼쪽 아래, 아래 가운데, 오른쪽 아래]. 꼭짓점(0, 3, 5)은 두 변이 함께 쓴다.
const TRI_SIDES = [[0, 1, 3], [0, 2, 5], [3, 4, 5]];
function triBlankExample({ id, title, cells, blank }) {
  const full = [...cells], S = sum(TRI_SIDES.find((s) => !s.includes(blank)).map((i) => cells[i]));
  const side = TRI_SIDES.find((s) => s.includes(blank)), others = side.filter((i) => i !== blank);
  full[blank] = S - sum(others.map((i) => cells[i]));
  if (TRI_SIDES.some((s) => sum(s.map((i) => full[i])) !== S)) throw new Error(`${id}: 세 변의 합이 다름`);
  const vals = (k) => full.map((v, i) => (i === blank ? k : v)), done = TRI_SIDES.find((s) => !s.includes(blank)), third = TRI_SIDES.find((s) => s !== done && s !== side);
  const steps = [
    { text: `수가 다 있는 변부터 더해요. ${done.map((i) => full[i]).join(" + ")} = ${S}. 세 변의 합은 모두 ${josa(S, "이에요")}.`, figure: lineBoard("tri6", vals("?"), { hi: done }) },
    { text: `□가 있는 변: ${others.map((i) => full[i]).join(" + ")} + □ = ${S}라 □ = ${S} − ${others.map((i) => full[i]).join(" − ")} = ${full[blank]}.`, figure: lineBoard("tri6", vals(full[blank]), { hi: [blank] }) },
    { text: `남은 변도 확인해요. ${third.map((i) => full[i]).join(" + ")} = ${S}.`, figure: lineBoard("tri6", vals(full[blank]), { hi: third, tone: "check" }) }
  ];
  return { id, title, problem: "삼각형의 세 변에 놓인 세 수의 합이 모두 같아요. □에 들어갈 수를 구해요.", figure: lineBoard("tri6", vals("?"), { tone: "given" }), steps, answer: `□는 ${josa(full[blank], "이에요")}.`, value: { kind: "tri-blank", cells: full, blank, S } };
}
// 꼭짓점을 같이 쓰는 두 변: 그 꼭짓점을 양쪽에서 빼면 나머지 두 수끼리 합이 같다
function triSharedExample({ id, title, cells, ask }) {
  const sides = TRI_SIDES.filter((s) => s.includes(ask)), other = TRI_SIDES.find((s) => !s.includes(ask));
  const shared = [0, 3, 5].find((v) => other.includes(v) && sides.some((s) => s.includes(v)) && cells[v] === null);
  const sOther = other, sAsk = sides.find((s) => s.includes(shared));
  const restOther = sOther.filter((i) => i !== shared), restAsk = sAsk.filter((i) => i !== shared && i !== ask);
  const value = sum(restOther.map((i) => cells[i])) - sum(restAsk.map((i) => cells[i]));
  const vals = (k) => cells.map((v, i) => (i === ask ? k : v === null ? "" : v));
  const steps = [
    { text: `두 변이 같이 쓰는 빈 꼭짓점이 있어요. 그 수는 양쪽 변에 똑같이 들어가니 빼도 돼요.`, figure: lineBoard("tri6", vals("?"), { hi: [shared] }) },
    { text: `그러면 ${restOther.map((i) => cells[i]).join(" + ")} = ${restAsk.map((i) => cells[i]).join(" + ")} + □. ${sum(restOther.map((i) => cells[i]))} − ${sum(restAsk.map((i) => cells[i]))} = ${value}.`, figure: lineBoard("tri6", vals(value), { hi: [...restOther, ...restAsk, ask], tone: "check" }) }
  ];
  return { id, title, problem: "삼각형의 세 변에 놓인 세 수의 합이 모두 같아요. 빈 칸에는 아직 모르는 수가 있어요. □에 들어갈 수를 구해요.", figure: lineBoard("tri6", vals("?"), { tone: "given" }), steps, answer: `□는 ${josa(value, "이에요")}.`, value: { kind: "tri-shared", cells, ask, value } };
}
function triExtremeExample({ id, title, cards }) {
  const total = sum(cards), sorted = [...cards].sort((a, b) => a - b), lo = sorted.slice(0, 3), hi = sorted.slice(-3);
  const place = (corners, S) => { const [t, l, r] = corners; return [t, S - t - l, S - t - r, l, S - l - r, r]; };
  const Smin = (total + sum(lo)) / 3, Smax = (total + sum(hi)) / 3;
  const minCells = place([lo[1], lo[0], lo[2]], Smin), maxCells = place([hi[0], hi[1], hi[2]], Smax);
  if (![...minCells, ...maxCells].every((x) => cards.includes(x)) || new Set(minCells).size !== 6 || new Set(maxCells).size !== 6) throw new Error(`${id}: 놓을 수 없음`);
  const steps = [
    { text: `세 변을 모두 더하면 꼭짓점의 세 수는 두 번씩 더해져요. 그래서 (한 줄의 합) × 3 = 모든 수의 합 ${total} + 꼭짓점 세 수.`, figure: { kind: "eqs", lines: [`${cards.join(" + ")} = ${total}`, `한 줄의 합 × 3 = ${total} + (꼭짓점 세 수)`], tone: "doing" } },
    { text: `가장 작게: 꼭짓점에 ${lo.join(", ")}. (${total} + ${sum(lo)}) ÷ 3 = ${Smin}.`, figure: lineBoard("tri6", minCells, { hi: [0, 3, 5] }) },
    { text: `가장 크게: 꼭짓점에 ${hi.join(", ")}. (${total} + ${sum(hi)}) ÷ 3 = ${Smax}.`, figure: lineBoard("tri6", maxCells, { hi: [0, 3, 5], tone: "check" }) }
  ];
  return { id, title, problem: `${josa(cards.join(", "), "을")} 한 번씩 넣어 삼각형의 세 변에 놓인 세 수의 합이 모두 같게 해요. 한 줄의 합이 가장 작을 때와 가장 클 때를 구해요.`, figure: lineBoard("tri6", ["", "", "", "", "", ""], { tone: "given" }), steps, answer: `가장 작을 때 ${Smin}, 가장 클 때 ${josa(Smax, "이에요")}.`, value: { kind: "tri-extreme", cards, min: Smin, max: Smax } };
}
const ARRANGE_SET = {
  id: "arrange",
  types: {
    "원형진의 가운데 칸": () => [crossCenterExample({ id: "center-9", title: "예제 1", cards: [4, 5, 6, 7, 8] })],
    "삼각진의 빈칸": () => [triBlankExample({ id: "tri-1", title: "예제 1", cells: [5, 8, null, 2, 9, 4], blank: 2 })],
    "삼각진의 겹치는 칸": () => [triSharedExample({ id: "tri-2", title: "예제 1", cells: [null, 8, 2, 3, null, null], ask: 5 })],
    "삼각진의 가장 작은 합·가장 큰 합": () => [triExtremeExample({ id: "tri-3", title: "예제 1", cards: [2, 3, 4, 5, 6, 7] })]
  }
};

// ───────────────────────── 6권 막대로 길이 재기 ─────────────────────────
// 그림 kind "pieces": 같은 길이의 막대를 줄마다 n조각으로(조각이 작을수록 많다)
const pieces = (rows, tone = "doing") => ({ kind: "pieces", rows, tone });
const lcmOf = (a, b) => { let m = Math.max(a, b); while (m % a || m % b) m++; return m; };
function pencilExample({ id, title, a, b, L = null }) {
  const len = L ?? lcmOf(a, b), A = len / a, B = len / b, C = A - B;
  if (!Number.isInteger(A) || !Number.isInteger(B) || C <= 0) throw new Error(`${id}: 딱 떨어지지 않음`);
  const rows = (show) => [{ label: "연필", n: 1, len: show.p ? `${len}cm` : null }, { label: "A", n: a, len: show.a ? `${A}cm` : null }, { label: "B", n: b, len: show.b ? `${B}cm` : null }];
  const mult = (k) => Array.from({ length: len / k }, (_, i) => k * (i + 1));
  const steps = L === null ? [
    { text: `연필은 A ${a}개, B ${b}개와 같아요. 그래서 연필의 길이는 ${a}단에도 ${b}단에도 나오는 수예요.`, figure: pieces(rows({})) },
    { text: `${a}단 ${mult(a).join(", ")} · ${b}단 ${mult(b).join(", ")}. 처음 같아지는 ${josa(len, "이")} 가장 짧은 연필이에요.`, figure: pieces(rows({ p: 1 })) },
    { text: `A = ${len} ÷ ${a} = ${A}cm, B = ${len} ÷ ${b} = ${B}cm, C = ${A} − ${B} = ${C}cm.`, figure: pieces(rows({ p: 1, a: 1, b: 1 }), "check") }
  ] : [
    { text: `A ${a}개가 ${len}cm라 A = ${len} ÷ ${a} = ${A}cm.`, figure: pieces(rows({ p: 1, a: 1 })) },
    { text: `B ${b}개도 ${len}cm라 B = ${len} ÷ ${b} = ${B}cm.`, figure: pieces(rows({ p: 1, a: 1, b: 1 })) },
    { text: `C는 A와 B의 길이 차이라 ${A} − ${B} = ${C}cm.`, figure: pieces(rows({ p: 1, a: 1, b: 1 }), "check") }
  ];
  return { id, title, problem: L === null ? `연필의 길이는 A ${a}개를 이은 길이, B ${b}개를 이은 길이와 같아요. C는 A와 B의 길이 차이예요. 길이가 모두 cm로 딱 떨어지고 연필이 가장 짧을 때 연필·A·B·C의 길이를 구해요.` : `연필의 길이 ${len}cm는 A ${a}개를 이은 길이, B ${b}개를 이은 길이와 같아요. C는 A와 B의 길이 차이예요. A, B, C의 길이를 구해요.`, figure: pieces(rows({ p: L !== null }), "given"), steps, answer: `${L === null ? `연필 ${len}cm, ` : ""}A ${A}cm, B ${B}cm, C ${C}cm예요.`, value: { kind: "pencil", a, b, L, len, A, B, C } };
}
// 잰 횟수: 전체 길이 = 막대 길이 × 잰 횟수. mode "unit"(다른 막대로 몇 번) · "ratio"(두 도구의 횟수로 큰 도구가 작은 도구 몇 번)
function measureExample({ id, title, thing, tool1, len1, count1, tool2, len2 = null, count2 = null }) {
  if (len2 !== null) {
    const total = len1 * count1, k = total / len2;
    if (!Number.isInteger(k)) throw new Error(`${id}: 나누어떨어지지 않음`);
    const steps = [
      { text: `먼저 전체 길이: ${len1}cm × ${count1} = ${total}cm.`, figure: pieces([{ label: thing, n: 1, len: `${total}cm` }, { label: tool1, n: count1, len: `${len1}cm씩` }]) },
      { text: `${len2}cm짜리 ${euro(tool2)}는 ${total} ÷ ${len2} = ${k}번.`, figure: pieces([{ label: thing, n: 1, len: `${total}cm` }, { label: tool1, n: count1, len: `${len1}cm씩` }, { label: tool2, n: k, len: `${k}번` }], "check") }
    ];
    return { id, title, problem: `${josa(thing, "은")} ${len1}cm인 ${euro(tool1)} ${count1}번 잰 길이와 같아요. 같은 ${josa(thing, "을")} ${len2}cm인 ${euro(tool2)} 재면 몇 번일까요?`, figure: pieces([{ label: thing, n: 1, len: null }, { label: tool1, n: count1, len: `${len1}cm씩` }], "given"), steps, answer: `${k}번이에요.`, value: { kind: "measure", total, len2, k } };
  }
  const k = count1 / count2;
  if (!Number.isInteger(k)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const steps = [
    { text: `같은 ${josa(thing, "을")} ${euro(tool1)}는 ${count1}번, ${euro(tool2)}는 ${count2}번 재요. ${tool2} 한 번에 ${josa(tool1, "이")} 똑같이 몇 번씩 들어가요.`, figure: pieces([{ label: tool1, n: count1, len: `${count1}번` }, { label: tool2, n: count2, len: `${count2}번` }]) },
    { text: `${count1} ÷ ${count2} = ${k}. ${josa(tool2, "은")} ${euro(tool1)} ${k}번이에요.`, figure: pieces([{ label: tool1, n: count1, len: `${count1}번` }, { label: tool2, n: count2, len: `${count2}번` }], "check") }
  ];
  return { id, title, problem: `${thing}의 길이를 ${euro(tool1)} 재면 ${count1}번, ${euro(tool2)} 재면 ${count2}번이에요. ${josa(tool2, "은")} ${euro(tool1)} 몇 번 잰 길이와 같을까요?`, figure: pieces([{ label: tool1, n: count1, len: null }, { label: tool2, n: count2, len: null }], "given"), steps, answer: `${k}번이에요.`, value: { kind: "measure-ratio", count1, count2, k } };
}
const MEASURE_SET = {
  id: "measure",
  types: {
    "가장 짧은 연필 길이": () => [pencilExample({ id: "pencil-1", title: "예제 1", a: 2, b: 5 }), pencilExample({ id: "pencil-2", title: "예제 2", a: 4, b: 6 })],
    "정한 연필 길이": () => [pencilExample({ id: "pencil-3", title: "예제 1", a: 4, b: 5, L: 40 })],
    "잰 횟수와 길이": () => [measureExample({ id: "measure-1", title: "예제 1", thing: "책장의 높이", tool1: "지우개", len1: 6, count1: 5, tool2: "필통", len2: 10 }), measureExample({ id: "measure-2", title: "예제 2", thing: "칠판", tool1: "숟가락", count1: 12, tool2: "국자", count2: 3 })]
  }
};

// ───────────────────────── 2권 모양과 색의 이중 규칙 ─────────────────────────
const FILLED = { "○": "●", "□": "■", "△": "▲", "◇": "◆" }, SHAPE_WORD = { "○": "동그라미", "□": "네모", "△": "세모", "◇": "마름모" };
function dualExample({ id, title, shapes, colors, n }) {
  const glyph = (k) => { const s = shapes[k % shapes.length]; return colors[k % colors.length] ? FILLED[s] : s; };
  const seq = Array.from({ length: 8 }, (_, k) => glyph(k)), s = shapes[(n - 1) % shapes.length], c = colors[(n - 1) % colors.length], ans = glyph(n - 1);
  const steps = [
    { text: `색을 가리고 모양만 보면 ${shapes.join(", ")}, ${shapes.length}칸마다 되풀이돼요. ${n} ÷ ${shapes.length}의 나머지 ${n % shapes.length || 0}${n % shapes.length ? "" : "(마지막)"} → ${SHAPE_WORD[s]}.`, figure: { kind: "seq", values: seq, notes: seq.map((_, k) => SHAPE_WORD[shapes[k % shapes.length]]), tone: "doing" } },
    { text: `모양을 가리고 색만 보면 ${colors.map((x) => (x ? "색칠" : "빈")).join(", ")}, ${colors.length}칸마다 되풀이돼요. ${n} ÷ ${colors.length}의 나머지 ${n % colors.length}${n % colors.length ? "" : "(마지막)"} → ${c ? "색칠" : "빈"} 모양.`, figure: { kind: "seq", values: seq, notes: seq.map((_, k) => (colors[k % colors.length] ? "색칠" : "빈")), tone: "doing" } },
    { text: `두 규칙을 합치면 ${n}번째는 ${c ? "색칠한" : "빈"} ${SHAPE_WORD[s]} ${ans}.`, figure: { kind: "seq", values: [ans], tone: "check" } }
  ];
  return { id, title, problem: `${seq.join(" ")} …처럼 모양과 색이 함께 되풀이돼요. ${n}번째 모양은 무엇일까요?`, figure: { kind: "seq", values: seq, tone: "given", ask: "?" }, steps, answer: `${c ? "색칠한" : "빈"} ${SHAPE_WORD[s]} ${josa(ans, "이에요")}.`, value: { kind: "dual", shapes, colors, n, ans } };
}

// ───────────────────────── 4·9권 쌓기나무: 층수 더하기 · 숨은 쌓기나무 · 상자 채우기 · 페인트칠 · 앞과 옆 ─────────────────────────
// 그림은 원본과 같은 빗각 그림(kind "b4-cubes", 앞면이 정사각형). map[줄][칸] = 층수, 0번 줄이 맨 뒤.
// 보이지 않는 쌓기나무 = 오른쪽·앞·위가 모두 막힌 것(셋 중 하나라도 비면 면이 보인다).
const cubesFig = (map, p = {}) => ({ kind: "b4-cubes", map, labels: p.labels, walls: p.walls, tone: p.tone || "doing" });
const topFig = (map, tone = "doing") => ({ kind: "mgrid", cells: map.map((row) => row.map((h) => (h ? String(h) : ""))), noTotals: true, tone });
const cubeTotal = (map) => sum(map.flat());
const hiddenCubes = (map) => {
  const has = (r, c, z) => r >= 0 && c >= 0 && (map[r]?.[c] ?? 0) > z, out = [];
  map.forEach((row, r) => row.forEach((h, c) => { for (let z = 0; z < h; z++) if (has(r, c + 1, z) && has(r + 1, c, z) && has(r, c, z + 1)) out.push([r, c, z]); }));
  return out;
};
const ROW_WORD = (R, r) => (R === 1 ? "" : r === R - 1 ? "앞줄" : r === 0 ? "뒷줄" : "가운데 줄");
const COL_WORD = (C, c) => (C === 1 ? "" : c === 0 ? "왼쪽" : c === C - 1 ? "오른쪽" : "가운데");
const placeWord = (map, r, c) => [ROW_WORD(map.length, r), COL_WORD(map[0].length, c)].filter(Boolean).join(" ") || "그";
function columnSumExample({ id, title, map, word = "최소" }) {
  const list = map.flat().filter(Boolean), total = cubeTotal(map);
  const steps = [
    { text: "기둥마다 맨 위 쌓기나무에 그 기둥이 몇 층인지 써요. 뒤에 가려진 것도 층수에 들어가요.", figure: cubesFig(map, { labels: true }) },
    { text: "위에서 내려다본 칸에 층수를 옮겨 써요. 빈 자리는 비워 둬요.", figure: topFig(map) },
    { text: `칸의 수를 모두 더하면 ${list.join(" + ")} = ${total}.`, figure: topFig(map, "check") }
  ];
  return { id, title, problem: `쌓기나무는 ${word === "최소" ? "최소 " : "모두 "}몇 개일까요?${word === "최소" ? "" : " (보이지 않는 곳에는 쌓기나무가 없어요.)"}`, figure: cubesFig(map, { tone: "given" }), steps, answer: `${total}개예요.`, value: { kind: "cube-sum", map, total } };
}
function hiddenCubeExample({ id, title, map, walls = false, ask = "hidden" }) {
  const total = cubeTotal(map), hidden = hiddenCubes(map), seen = total - hidden.length;
  const where = hidden.map(([r, c, z]) => `${placeWord(map, r, c)} 기둥 ${z + 1}층`);
  const steps = [
    { text: `기둥마다 층수를 써서 모두 더해요. ${map.flat().filter(Boolean).join(" + ")} = ${total}개가 전체예요.`, figure: cubesFig(map, { labels: true, walls }) },
    { text: `오른쪽·앞·위가 모두 다른 쌓기나무로 막힌 것은 그림에서 안 보여요. ${where.length ? `${where.join(", ")} — ${hidden.length}개.` : "없어요."}`, figure: topFig(map) },
    { text: `보이는 것은 ${total} − ${hidden.length} = ${seen}개, 보이지 않는 것은 ${hidden.length}개.`, figure: cubesFig(map, { walls, tone: "check" }) }
  ];
  const all = ask === "all";
  return { id, title, problem: all ? "벽 모서리에 빈틈없이 쌓은 쌓기나무예요. 전체, 보이는 것, 보이지 않는 것은 각각 몇 개일까요?" : "그림에서 보이지 않는 쌓기나무는 몇 개일까요? (보이지 않는 곳에도 빈틈없이 쌓았어요.)", figure: cubesFig(map, { walls, tone: "given" }), steps, answer: all ? `전체 ${total}개, 보이는 것 ${seen}개, 보이지 않는 것 ${hidden.length}개예요.` : `${hidden.length}개예요.`, value: { kind: "cube-hidden", map, total, seen, hidden: hidden.length, ask } };
}
function boxFillExample({ id, title, dims, map }) {
  const [W, H, D] = dims, layer = W * D, total = layer * H, placed = cubeTotal(map), need = total - placed;
  const box = { kind: "b4-box", dims, map };
  const steps = [
    { text: `한 층에 가로 ${W}개 × 세로 ${D}개 = ${layer}개가 들어가요.`, figure: { ...box, tone: "doing" } },
    { text: `${H}층이라 상자 전체는 ${layer} × ${H} = ${total}개.`, figure: { ...box, tone: "doing" } },
    { text: `이미 놓인 것은 층수를 더해 ${map.flat().filter(Boolean).join(" + ")} = ${placed}개. 더 필요한 것은 ${total} − ${placed} = ${need}개.`, figure: { ...box, tone: "check" } }
  ];
  return { id, title, problem: `가로 ${W}칸, 세로 ${D}칸, 높이 ${H}칸인 상자에 쌓기나무를 넣어 두었어요. 상자를 꽉 채우려면 쌓기나무가 몇 개 더 필요할까요?`, figure: { ...box, tone: "given" }, steps, answer: `${need}개 더 필요해요.`, value: { kind: "cube-box", dims, map, need } };
}
function removeCubesExample({ id, title, from, to }) {
  const a = cubeTotal(from), b = cubeTotal(to);
  const steps = [
    { text: `가 모양은 층수를 모두 더해 ${from.flat().filter(Boolean).join(" + ")} = ${a}개.`, figure: cubesFig(from, { labels: true }) },
    { text: `나 모양은 ${to.flat().filter(Boolean).join(" + ")} = ${b}개.`, figure: cubesFig(to, { labels: true }) },
    { text: `빼야 하는 것은 ${a} − ${b} = ${a - b}개.`, figure: cubesFig(to, { tone: "check" }) }
  ];
  return { id, title, problem: "가 모양에서 쌓기나무를 빼서 나 모양을 만들려고 해요. 몇 개를 빼야 할까요? (보이지 않는 곳에도 빈틈없이 쌓았어요.)", figure: { kind: "b4-pair", figures: [{ label: "가", map: from }, { label: "나", map: to }] }, steps, answer: `${a - b}개를 빼야 해요.`, value: { kind: "cube-remove", from, to, diff: a - b } };
}
function cubePartsExample({ id, title }) {
  const steps = [
    { text: "면: 위·아래, 앞·뒤, 왼쪽·오른쪽 — 2 + 2 + 2 = 6개.", figure: cubesFig([[1]]) },
    { text: "모서리: 윗면 둘레 4개, 아랫면 둘레 4개, 위아래를 잇는 기둥 4개 — 4 + 4 + 4 = 12개.", figure: cubesFig([[1]]) },
    { text: "꼭짓점: 윗면에 4개, 아랫면에 4개 — 4 + 4 = 8개.", figure: cubesFig([[1]], { tone: "check" }) }
  ];
  return { id, title, problem: "상자 모양 지우개(직육면체)의 면, 모서리, 꼭짓점은 각각 몇 개일까요?", figure: cubesFig([[1]], { tone: "given" }), steps, answer: "면 6개, 모서리 12개, 꼭짓점 8개예요.", value: { kind: "cube-parts", faces: 6, edges: 12, vertices: 8 } };
}
// 페인트칠: 한 모서리에 n개(n × n × n). 꼭짓점 8개는 세 면, 모서리 가운데는 두 면, 면 가운데는 한 면, 속은 칠해지지 않는다
function paintExample({ id, title, n }) {
  const m = n - 2, three = 8, two = 12 * m, one = 6 * m * m, zero = m ** 3, full = Array.from({ length: n }, () => Array(n).fill(n));
  const steps = [
    { text: `쌓기나무는 ${n} × ${n} × ${n} = ${n ** 3}개. 세 면이 칠해진 것은 꼭짓점 자리라 ${three}개.`, figure: cubesFig(full) },
    { text: `두 면: 모서리 12개마다 꼭짓점을 뺀 가운데 ${n} − 2 = ${m}개씩, 12 × ${m} = ${two}개.`, figure: cubesFig(full) },
    { text: `한 면: 면 6개마다 가장자리를 뺀 가운데 ${m} × ${m} = ${m * m}개씩, 6 × ${m * m} = ${one}개.`, figure: cubesFig(full) },
    { text: `칠해지지 않은 것: 속의 ${m} × ${m} × ${m} = ${zero}개. 더하면 ${three} + ${two} + ${one} + ${zero} = ${n ** 3}.`, figure: cubesFig(full, { tone: "check" }) }
  ];
  return { id, title, problem: `쌓기나무 ${n ** 3}개로 만든 큰 정육면체의 바깥쪽 면(바닥 포함)을 모두 칠했어요. 세 면, 두 면, 한 면이 칠해진 쌓기나무와 칠해지지 않은 쌓기나무는 각각 몇 개일까요?`, figure: cubesFig(full, { tone: "given" }), steps, answer: `세 면 ${three}개, 두 면 ${two}개, 한 면 ${one}개, 칠해지지 않은 것 ${zero}개예요.`, value: { kind: "cube-paint", n, counts: [three, two, one, zero] } };
}
// 앞과 옆: 앞에서는 세로줄(왼쪽→오른쪽)마다, 오른쪽 옆에서는 가로줄(앞줄→뒷줄)마다 가장 높은 기둥이 보인다
function viewsExample({ id, title, map = null, layers = null }) {
  const heights = map || layers[0].map((row, r) => row.map((_, c) => layers.reduce((a, L) => a + L[r][c], 0)));
  const views = cubeViews(heights), front = views.front, side = views.side;
  const pre = layers ? [{ text: `층별 그림을 겹쳐 칸마다 몇 층인지 세요. 1층에 있고 2층에도 있으면 2층이에요.`, figure: topFig(heights) }] : [{ text: "위에서 본 칸에 층수를 써요.", figure: topFig(heights) }];
  const steps = [
    ...pre,
    { text: `앞에서 보면 세로줄마다 가장 높은 기둥만 보여요. 왼쪽부터 ${front.join(", ")}층.`, figure: { kind: "cube-map", views, heights, mark: { cols: front.map((_, c) => c) }, tone: "doing" } },
    { text: `오른쪽 옆에서 보면 앞줄이 왼쪽에 보여요. 가로줄마다 가장 높은 기둥: ${side.join(", ")}층.`, figure: { kind: "cube-map", views, heights, mark: { rows: heights.map((_, r) => r) }, tone: "doing" } },
    { text: "앞과 옆에서 본 모양을 그리면 이렇게 돼요.", figure: { kind: "cube-views", views } }
  ];
  const problem = layers ? `쌓기나무를 층별로 위에서 본 모양이에요(1층부터). 앞과 오른쪽 옆에서 보면 각 줄에 몇 층이 보이는지 왼쪽 줄부터 차례로 써요.` : "쌓기나무를 앞과 오른쪽 옆에서 보면 각 줄에 몇 층이 보이는지 왼쪽 줄부터 차례로 써요. (보이지 않는 곳에는 쌓기나무가 없어요.)";
  const given = layers ? { kind: "b4-layers", layers } : cubesFig(heights, { tone: "given" });
  return { id, title, problem, figure: given, steps, answer: `앞 ${front.join(", ")}층, 오른쪽 옆 ${side.join(", ")}층이에요.`, value: { kind: "cube-views", heights, front, side } };
}
const CUBES_SET = {
  id: "cubes",
  types: {
    // 4권
    "윗면에 줄의 개수를 써서 더하기": () => [columnSumExample({ id: "csum-1", title: "예제 1", map: [[3, 2], [1, 1]] }), columnSumExample({ id: "csum-2", title: "예제 2", map: [[2, 3, 1], [1, 2, 0]] })],
    "윗면 층수로 숨은 수 찾기": () => [hiddenCubeExample({ id: "hid-1", title: "예제 1", map: [[3, 3], [2, 1]] }), hiddenCubeExample({ id: "hid-2", title: "예제 2", map: [[2, 2, 1], [2, 1, 1]] })],
    "보이지 않는 쌓기나무 찾기": () => [hiddenCubeExample({ id: "hid-3", title: "예제 1", map: [[3, 3], [3, 3]] })],
    "쌓기나무 상자 채우기": () => [boxFillExample({ id: "box-1", title: "예제 1", dims: [3, 2, 2], map: [[1, 0, 0], [2, 1, 1]] })],
    // 9권
    "쌓기나무 전체 개수": () => [columnSumExample({ id: "csum-3", title: "예제 1", map: [[3, 1, 2], [1, 2, 0]], word: "모두" })],
    "보이지 않는 쌓기나무": () => [hiddenCubeExample({ id: "hid-4", title: "예제 1", map: [[3, 3, 1], [2, 2, 1], [1, 1, 0]], walls: true, ask: "all" })],
    "빼야 하는 쌓기나무": () => [removeCubesExample({ id: "rm-1", title: "예제 1", from: [[3, 3], [3, 2]], to: [[3, 1], [2, 0]] })],
    "정육면체의 면·모서리·꼭짓점": () => [cubePartsExample({ id: "parts-1", title: "예제 1" })],
    "페인트칠한 정육면체": () => [paintExample({ id: "paint-1", title: "예제 1", n: 4 })],
    "앞과 옆에서 본 모양": () => [viewsExample({ id: "views-1", title: "예제 1", map: [[2, 3, 1], [1, 2, 0], [1, 0, 0]] })],
    "층별 모양으로 앞·옆 모양": () => [viewsExample({ id: "views-2", title: "예제 1", layers: [[[1, 1, 1], [1, 1, 0], [0, 1, 0]], [[0, 0, 1], [1, 1, 0], [0, 0, 0]], [[0, 0, 0], [1, 0, 0], [0, 0, 0]]] })]
  }
};

// ───────────────────────── 6권 수직선의 거리 · 수직선과 비 · 분수와 비 · 막대와 저울의 비 ─────────────────────────
// 수직선(kind "nline"): pts = 큰 눈금 [{ at, label }](label이 「?」·글자면 구할 자리), segs = 큰 눈금 사이마다 { n(똑같이 나눈 칸 수), mark(○·△를 칸마다), name(첫 칸 위 이름), hi },
// spans = 줄 밑 꺾쇠 [{ from, to, label, ask }](at 값). 분수는 「3분의 2」처럼 말로 쓰고, 그림(kind "fracs")에서 위아래로 쌓는다.
const nline = (pts, segs, p = {}) => ({ kind: "nline", pts, segs, spans: p.spans || [], tone: p.tone || "doing" });
const ptsOf = (vals, names = {}) => vals.map((at, i) => ({ at, label: names[i] ?? String(at) }));
function lineDistExample({ id, title, a, b, n = 1, ask = "one", name = "㉠", word = null }) {
  const d = b - a, u = d / n;
  if (!Number.isInteger(u)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const seg = (p) => [{ n, name: n > 1 ? name : "", ...p }];
  const steps = [{ text: `큰 수에서 작은 수를 빼면 두 수 사이의 거리예요. ${b} − ${a} = ${d}.`, figure: nline(ptsOf([a, b]), seg({}), { spans: [{ from: a, to: b, label: String(d) }] }) }];
  if (n > 1) {
    steps.push({ text: `${word || `똑같이 ${n}칸`}으로 나누었어요. 눈금 수가 아니라 칸 수 ${n}개를 세요.`, figure: nline(ptsOf([a, b]), seg({ hi: true }), { spans: [{ from: a, to: b, label: String(d) }] }) });
    steps.push({ text: `한 칸은 ${d} ÷ ${n} = ${u}.`, figure: nline(ptsOf([a, b]), seg({ hi: true }), { spans: [{ from: a, to: a + u, label: String(u) }], tone: "check" }) });
  } else steps.push({ text: `수직선에서 ${a}부터 ${b}까지 ${d}만큼 떨어져 있어요.`, figure: nline(ptsOf([a, b]), seg({}), { spans: [{ from: a, to: b, label: String(d) }], tone: "check" }) });
  const problem = n === 1 ? `${josa(a, "과")} ${b} 사이의 거리는 얼마일까요?` : ask === "both" ? `${a}부터 ${b}까지를 똑같이 ${n}칸으로 나누었어요. ① 전체 거리와 ② 한 칸의 거리를 구해요.` : `${a}부터 ${b}까지를 ${word || `똑같이 ${n}칸`}으로 나누었어요. ${name}으로 표시한 한 칸의 거리는 얼마일까요?`;
  const answer = n === 1 ? `${josa(d, "이에요")}.` : ask === "both" ? `① ${d}, ② ${josa(u, "이에요")}.` : `${josa(u, "이에요")}.`;
  return { id, title, problem, figure: nline(ptsOf([a, b]), seg({}), { tone: "given" }), steps, answer, value: { kind: "line-dist", a, b, n, d, u, ask } };
}
// 두 구간: 앞 구간은 n1칸(○), 뒤 구간은 n2칸(△). ask "units" = ○·△ 한 칸, "find" = 칸을 세어 A·B 자리의 수, "multi" = ①②·A·B 한 칸·☆
function twoSegExample({ id, title, pts, n1, n2, ask = "units", find = null, star = null }) {
  const [a, b, c] = pts, d1 = b - a, d2 = c - b, u1 = d1 / n1, u2 = d2 / n2;
  if (!Number.isInteger(u1) || !Number.isInteger(u2)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const marks = ask === "multi" ? [{ n: n1, name: "A" }, { n: n2, name: "B" }] : [{ n: n1, mark: "○" }, { n: n2, mark: "△" }];
  const w = ask === "multi" ? ["A", "B"] : ["○", "△"];
  const base = (p = {}) => nline(ptsOf(pts, p.names || {}), marks.map((s, i) => ({ ...s, hi: p.hi === i })), { spans: p.spans, tone: p.tone });
  const steps = [
    { text: `앞 구간: ${b} − ${a} = ${d1}. ${n1}칸으로 나누면 ${w[0]} 한 칸은 ${d1} ÷ ${n1} = ${u1}.`, figure: base({ hi: 0, spans: [{ from: a, to: b, label: String(d1) }] }) },
    { text: `뒤 구간: ${c} − ${b} = ${d2}. ${n2}칸으로 나누면 ${w[1]} 한 칸은 ${d2} ÷ ${n2} = ${u2}.`, figure: base({ hi: 1, spans: [{ from: b, to: c, label: String(d2) }] }) }
  ];
  let problem, answer, value = { kind: "two-seg", pts, n1, n2, u1, u2, ask };
  if (ask === "units") {
    steps.at(-1).figure.tone = "check";
    problem = `${a}, ${b}, ${c} 사이를 ○ 칸 ${n1}개, △ 칸 ${n2}개로 나누었어요. ○ 칸끼리, △ 칸끼리 거리가 같아요. ○와 △는 각각 얼마일까요?`;
    answer = `○ = ${u1}, △ = ${josa(u2, "이에요")}.`;
  } else if (ask === "find") {
    const [k1, k2] = find, A = a + k1 * u1, B = b + k2 * u2;
    steps.push({ text: `A는 ${a}에서 ○ ${k1}칸: ${a} + ${u1} × ${k1} = ${A}. B는 ${b}에서 △ ${k2}칸: ${b} + ${u2} × ${k2} = ${B}.`, figure: nline([...ptsOf(pts), { at: A, label: "A" }, { at: B, label: "B" }].sort((x, y) => x.at - y.at), marks, { tone: "check" }) });
    problem = `${a}, ${b}, ${c} 사이를 ○ 칸 ${n1}개, △ 칸 ${n2}개로 나누었어요. ${a}에서 ○ ${k1}칸 간 자리가 A, ${b}에서 △ ${k2}칸 간 자리가 B예요. A와 B에 알맞은 수는?`;
    answer = `A = ${A}, B = ${josa(B, "이에요")}.`; value = { ...value, A, B, find };
  } else {
    const [s1, s2] = star, from = a + s1 * u1, to = b + s2 * u2, len = to - from;
    steps.push({ text: `☆는 ${a}에서 A ${s1}칸 간 자리부터 ${b}에서 B ${s2}칸 간 자리까지예요. A ${n1 - s1}칸과 B ${s2}칸이라 ${u1} × ${n1 - s1} + ${u2} × ${s2} = ${len}.`, figure: base({ spans: [{ from, to, label: "☆" }], tone: "check" }) });
    problem = `${a}, ${b}, ${c} 사이를 A 칸 ${n1}개, B 칸 ${n2}개로 나누었어요. A 칸끼리, B 칸끼리 거리가 같아요. ① ${a}~${b}의 거리, ② ${b}~${c}의 거리, A 한 칸, B 한 칸, 그리고 ${a}에서 A ${s1}칸 간 곳부터 ${b}에서 B ${s2}칸 간 곳까지의 거리 ☆를 구해요.`;
    answer = `① ${d1}, ② ${d2}, A ${u1}, B ${u2}, ☆ ${josa(len, "이에요")}.`; value = { ...value, star, len };
  }
  return { id, title, problem, figure: base({ tone: "given" }), steps, answer, value };
}
// 같은 길이를 위는 a칸, 아래는 b칸으로
function splitTwoExample({ id, title, start, end, a, b }) {
  const T = end - start, A = T / a, B = T / b;
  if (!Number.isInteger(A) || !Number.isInteger(B)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const rows = (s) => [{ label: "위", n: a, len: s ? `${A}씩` : null }, { label: "아래", n: b, len: s ? `${B}씩` : null }];
  const steps = [
    { text: `총 길이는 ${end} − ${start} = ${T}.`, figure: pieces([{ label: "전체", n: 1, len: String(T) }, ...rows(false)]) },
    { text: `위는 ${a}칸이라 A = ${T} ÷ ${a} = ${A}, 아래는 ${b}칸이라 B = ${T} ÷ ${b} = ${B}.`, figure: pieces([{ label: "전체", n: 1, len: String(T) }, ...rows(true)]) },
    { text: `같은 길이를 적게 나눈 위쪽 한 칸이 더 길어요. A : B = ${A} : ${B}.`, figure: pieces([{ label: "전체", n: 1, len: String(T) }, ...rows(true)], "check") }
  ];
  return { id, title, problem: `${start}부터 ${end}까지의 같은 길이를 위는 A 칸 ${a}개로, 아래는 B 칸 ${b}개로 똑같이 나누었어요. 총 길이, A 한 칸, B 한 칸의 길이를 구해요.`, figure: pieces([{ label: "전체", n: 1, len: null }, ...rows(false)], "given"), steps, answer: `총 길이 ${T}, A ${A}, B ${josa(B, "이에요")}.`, value: { kind: "split-two", start, end, a, b, T, A, B } };
}
function ratioSeqExample({ id, title, p, q, count = 5 }) {
  const rows = Array.from({ length: count }, (_, k) => [p * (k + 1), q * (k + 1)]), next = [p * (count + 1), q * (count + 1)];
  const steps = [
    { text: `앞 수는 ${p}씩, 뒤 수는 ${q}씩 커져요. 첫 비 ${p} : ${q}에 2, 3, 4…를 곱한 것이에요.`, figure: { kind: "eqs", lines: rows.map(([x, y], k) => `${x} : ${y}${k ? `  (× ${k + 1})` : ""}`), tone: "doing" } },
    { text: `다음은 × ${count + 1}: ${p} × ${count + 1} = ${next[0]}, ${q} × ${count + 1} = ${next[1]}.`, figure: { kind: "eqs", lines: [...rows.map(([x, y]) => `${x} : ${y}`), `${next[0]} : ${next[1]}`], on: [count], tone: "check" } }
  ];
  return { id, title, problem: `같은 비를 차례로 늘어놓았어요. ${rows.map(([x, y]) => `${x} : ${y}`).join(", ")} 다음에 올 비는 무엇일까요?`, figure: { kind: "eqs", lines: [...rows.map(([x, y]) => `${x} : ${y}`), "가 : 나"], tone: "given" }, steps, answer: `${next[0]} : ${josa(next[1], "이에요")}.`, value: { kind: "ratio-seq", p, q, count, next } };
}
// 분수 그림: fracs = [[분자, 분모]] — null은 빈칸 □
const fracs = (list, p = {}) => ({ kind: "fracs", list, hi: p.hi, tone: p.tone || "doing" });
const fracWord = ([n, d]) => `${d}분의 ${n}`;
function fracChainExample({ id, title, base, items }) {
  const [bn, bd] = base, done = [base, ...items.map((x) => [...x])], steps = [];
  items.forEach(([n, d], i) => {
    const k = n !== null ? n / bn : d / bd;
    if (!Number.isInteger(k) && !Number.isInteger(1 / k)) throw new Error(`${id}: 배수가 아님`);
    const fill = [bn * k, bd * k], known = n !== null ? "분자" : "분모", kv = n !== null ? n : d;
    done[i + 1] = fill;
    const from = n !== null ? bn : bd, other = n !== null ? "분모" : "분자", ov = n !== null ? bd : bn;
    steps.push({ text: `${known}가 ${from}에서 ${josa(kv, "이")} 됐어요(${k >= 1 ? `× ${k}` : `÷ ${1 / k}`}). ${other}에도 똑같이: ${k >= 1 ? `${ov} × ${k}` : `${ov} ÷ ${1 / k}`} = ${n !== null ? fill[1] : fill[0]}.`, figure: fracs(done.map((x, j) => (j <= i + 1 ? x : items[j - 1])), { hi: [i + 1] }) });
  });
  steps.at(-1).figure.tone = "check";
  return { id, title, problem: `${josa(fracWord(base), "과")} 크기가 같은 분수가 되도록 빈칸에 알맞은 수를 써요.`, figure: fracs([base, ...items], { tone: "given" }), steps, answer: `${josa(done.slice(1).map(fracWord).join(", "), "이에요")}.`, value: { kind: "frac-chain", base, items, done: done.slice(1) } };
}
function ratioWordExample({ id, title, who, things, ask }) {
  const [[p, x], [q, y]] = who.map((w, i) => [w, things[i]]);
  if (ask === "ratio") {
    const steps = [
      { text: `비는 비교하는 양을 앞에, 기준을 뒤에 써요. ${p} : ${q} 순서대로 ${x}개와 ${y}개.`, figure: { kind: "eqs", lines: [`${p} ${x}개`, `${q} ${y}개`], tone: "doing" } },
      { text: `${p} : ${q} = ${x} : ${y}.`, figure: { kind: "eqs", lines: [`${x} : ${y}`], tone: "check" } }
    ];
    return { id, title, problem: `${josa(p, "은")} 구슬 ${x}개, ${josa(q, "은")} 구슬 ${y}개를 가지고 있어요. ${p} : ${q}를 비로 나타내요.`, figure: { kind: "eqs", lines: [`${p} ${x}개`, `${q} ${y}개`], tone: "given" }, steps, answer: `${x} : ${josa(y, "이에요")}.`, value: { kind: "ratio-word", x, y, ask } };
  }
  const steps = [
    { text: `「${q}의 몇 분의 몇」은 ${q}를 기준으로 봐요. 기준 ${y}개가 분모예요.`, figure: fracs([[null, y]]) },
    { text: `${p}의 ${x}개가 분자라 ${q}의 ${y}분의 ${x}.`, figure: fracs([[x, y]], { tone: "check" }) }
  ];
  return { id, title, problem: `${josa(p, "은")} 구슬 ${x}개, ${josa(q, "은")} 구슬 ${y}개를 가지고 있어요. ${p}의 구슬은 ${q}의 구슬의 몇 분의 몇일까요?`, figure: { kind: "eqs", lines: [`${p} ${x}개`, `${q} ${y}개`], tone: "given" }, steps, answer: `${y}분의 ${josa(x, "이에요")}.`, value: { kind: "ratio-word", x, y, ask } };
}
function ratioFillExample({ id, title, p, q, rows }) {
  const names = "가나다라마바", done = rows.map((r) => [...r]), steps = []; let k = 0;
  rows.forEach(([x, y], i) => {
    const m = x !== null ? x / p : y / q, fill = [p * m, q * m];
    if (!Number.isInteger(m)) throw new Error(`${id}: 배수가 아님`);
    const nm = names[k++]; done[i] = fill;
    steps.push({ text: `${x !== null ? `앞 수가 ${p} × ${m}` : `뒤 수가 ${q} × ${m}`}이니 ${nm} = ${x !== null ? `${q} × ${m}` : `${p} × ${m}`} = ${x !== null ? fill[1] : fill[0]}.`, figure: { kind: "eqs", lines: [`${p} : ${q}`, ...done.map((r, j) => (j <= i ? `${r[0]} : ${r[1]}` : `${rows[j][0] ?? names[j]} : ${rows[j][1] ?? names[j]}`))], on: [i + 1], tone: "doing" } });
  });
  steps.at(-1).figure.tone = "check";
  return { id, title, problem: `${p} : ${josa(q, "과")} 같은 비가 되도록 빈칸에 알맞은 수를 써요.`, figure: { kind: "eqs", lines: [`${p} : ${q}`, ...rows.map(([x, y], j) => `${x ?? names[j]} : ${y ?? names[j]}`)], tone: "given" }, steps, answer: `${josa(rows.map((r, j) => `${names[j]} = ${r[0] === null ? done[j][0] : done[j][1]}`).join(", "), "이에요")}.`, value: { kind: "ratio-fill", p, q, rows, done } };
}
function fracSumExample({ id, title, base, sums }) {
  const [n, d] = base, part = n + d, out = sums.map((s) => { if (s % part) throw new Error(`${id}: 나누어떨어지지 않음`); const k = s / part; return [n * k, d * k]; });
  const steps = [
    { text: `${josa(fracWord(base), "은")} 분자 + 분모 = ${n} + ${d} = ${part}. 크기가 같은 분수는 분자와 분모에 같은 수를 곱하니 합도 ${part}의 몇 배가 돼요.`, figure: fracs([base]) },
    ...sums.map((s, i) => ({ text: `합이 ${ira(s, "면")} ${s} ÷ ${part} = ${s / part}배: ${n} × ${s / part} = ${out[i][0]}, ${d} × ${s / part} = ${out[i][1]} → ${fracWord(out[i])}.`, figure: fracs([base, ...out.slice(0, i + 1)], { hi: [i + 1], tone: i === sums.length - 1 ? "check" : "doing" }) }))
  ];
  return { id, title, problem: `${josa(fracWord(base), "과")} 크기가 같으면서 분자와 분모의 합이 차례로 ${sums.join(", ")}인 분수를 찾아요.`, figure: fracs([base, ...sums.map(() => [null, null])], { tone: "given" }), steps, answer: `${josa(out.map(fracWord).join(", "), "이에요")}.`, value: { kind: "frac-sum", base, sums, out } };
}
// 비와 합·차: p : q = □ : △, □ + △ = total(또는 △ − □ = diff)
function ratioTotalExample({ id, title, p, q, total = null, diff = null }) {
  const parts = total !== null ? p + q : q - p, given = total ?? diff, k = given / parts;
  if (!Number.isInteger(k)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const sq = p * k, tr = q * k;
  const steps = [
    { text: total !== null ? `□ : △ = ${p} : ${ira(q, "면")} □는 ${p}몫, △는 ${q}몫. 합은 ${p} + ${q} = ${parts}몫이에요.` : `□ : △ = ${p} : ${ira(q, "면")} △는 □보다 ${q} − ${p} = ${parts}몫 많아요.`, figure: { kind: "eqs", lines: [`${p} : ${q} = □ : △`, total !== null ? `□ + △ = ${total}` : `△ − □ = ${diff}`], tone: "doing" } },
    { text: `한 몫은 ${given} ÷ ${parts} = ${k}.`, figure: { kind: "eqs", lines: [`${parts}몫 = ${given}`, `한 몫 = ${k}`], tone: "doing" } },
    { text: `□ = ${p} × ${k} = ${sq}, △ = ${q} × ${k} = ${tr}.`, figure: { kind: "eqs", lines: [`${p} : ${q} = ${sq} : ${tr}`, total !== null ? `${sq} + ${tr} = ${total}` : `${tr} − ${sq} = ${diff}`], tone: "check" } }
  ];
  return { id, title, problem: `${p} : ${q} = □ : △이고 ${total !== null ? `□ + △ = ${josa(total, "이에요")}` : `△ − □ = ${josa(diff, "이에요")}`}. □와 △에 알맞은 수를 구해요.`, figure: { kind: "eqs", lines: [`${p} : ${q} = □ : △`, total !== null ? `□ + △ = ${total}` : `△ − □ = ${diff}`], tone: "given" }, steps, answer: `□ = ${sq}, △ = ${josa(tr, "이에요")}.`, value: { kind: "ratio-total", p, q, total, diff, sq, tr } };
}
const gcdOf = (a, b) => (b ? gcdOf(b, a % b) : a);
// ㉠·㉡은 「기역」「니은」으로 읽어 받침이 있다
const joMark = (w, pair) => (/^[㉠-㉭]$/u.test(w) ? josa("각", pair).replace("각", w) : josa(w, pair));
// 막대·저울: 같은 길이(무게)를 이루는 개수가 많을수록 하나는 짧다(가볍다) → 개수의 비를 뒤집는다
function inverseRatioExample({ id, title, a, b, total, kind = "bar" }) {
  const g = gcdOf(a, b), x = b / g, y = a / g, unit = total / (x + y);
  if (!Number.isInteger(unit)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const [P, Q] = kind === "bar" ? ["㉠", "㉡"] : ["공", "상자"], [one, two] = [x * unit, y * unit], cm = kind === "bar" ? "cm" : "g";
  const fig = (tone) => (kind === "bar" ? pieces([{ label: P, n: a, len: tone === "check" ? `${one}cm씩` : null }, { label: Q, n: b, len: tone === "check" ? `${two}cm씩` : null }], tone) : { kind: "balance", scales: [{ left: Array(a).fill("circle"), right: Array(b).fill("square"), heavy: "even" }], tone });
  const steps = [
    { text: kind === "bar" ? `같은 길이가 ${P} ${a}칸, ${Q} ${b}칸이에요. 칸이 많을수록 한 칸은 짧아요.` : `공 ${a}개와 상자 ${b}개가 수평이에요. 개수가 많은 쪽이 하나는 더 가벼워요.`, figure: fig("doing") },
    { text: `그래서 ${P} : ${joMark(Q, "은")} 개수를 뒤집은 ${b} : ${a}${g > 1 ? `, 가장 간단히 하면 ${x} : ${y}` : ""}.`, figure: fig("doing") },
    { text: `${P} 하나와 ${Q} 하나를 합하면 ${total}${cm}. ${x} + ${y} = ${x + y}몫이라 한 몫은 ${total} ÷ ${x + y} = ${unit}. ${P} = ${x} × ${unit} = ${one}${cm}, ${Q} = ${y} × ${unit} = ${two}${cm}.`, figure: fig("check") }
  ];
  const problem = kind === "bar" ? `같은 길이를 ${P} 칸 ${a}개, ${Q} 칸 ${b}개로 똑같이 나누었어요. ${P} : ${joMark(Q, "을")} 가장 간단한 자연수의 비로 나타내고, ${P} 하나와 ${Q} 하나를 이은 길이가 ${total}cm일 때 ${joMark(P, "과")} ${Q}의 길이를 구해요.` : `공 ${a}개와 상자 ${b}개를 저울에 올렸더니 수평이에요. 공 : 상자의 무게의 비를 가장 간단한 자연수의 비로 나타내고, 공 하나와 상자 하나를 합한 무게가 ${total}g일 때 각각의 무게를 구해요.`;
  return { id, title, problem, figure: fig("given"), steps, answer: `${x} : ${y}, ${P} ${one}${cm}, ${Q} ${two}${cm}${cm === "g" ? "이에요" : "예요"}.`, value: { kind: "inverse", a, b, total, x, y, one, two } };
}
const NLINE6_SET = {
  id: "nline6",
  // 6권 「수직선 한 칸의 거리」 원본은 유형 이름이 비어 있다
  typeOf: (item) => item.typeLabel || "수직선 한 칸의 거리",
  types: {
    "수직선 한 칸의 거리": () => [lineDistExample({ id: "nl-0a", title: "예제 1", a: 13, b: 61, n: 6 }), lineDistExample({ id: "nl-0b", title: "예제 2", a: 28, b: 91, n: 9 })],
    "두 수 사이의 거리": () => [lineDistExample({ id: "nl-1", title: "예제 1", a: 24, b: 61 })],
    "가운데로 나눈 한 칸": () => [lineDistExample({ id: "nl-2", title: "예제 1", a: 24, b: 60, n: 2, word: "한가운데에 눈금을 그어 두 칸" })],
    "3등분한 한 칸": () => [lineDistExample({ id: "nl-3", title: "예제 1", a: 21, b: 48, n: 3 })],
    "8등분한 한 칸": () => [lineDistExample({ id: "nl-8", title: "예제 1", a: 14, b: 62, n: 8 })],
    "7등분한 한 칸": () => [lineDistExample({ id: "nl-7", title: "예제 1", a: 32, b: 81, n: 7 })],
    "전체 거리와 한 칸의 거리": () => [lineDistExample({ id: "nl-both", title: "예제 1", a: 14, b: 50, n: 4, ask: "both" })],
    "같은 칸의 거리": () => [twoSegExample({ id: "nl-units", title: "예제 1", pts: [8, 32, 57], n1: 4, n2: 5 })],
    "칸 거리로 수 찾기": () => [twoSegExample({ id: "nl-find", title: "예제 1", pts: [10, 34, 64], n1: 4, n2: 5, ask: "find", find: [2, 3] })],
    "여러 칸을 묶은 거리": () => [twoSegExample({ id: "nl-multi", title: "예제 1", pts: [12, 40, 70], n1: 4, n2: 5, ask: "multi", star: [1, 2] })],
    // 수직선과 비
    "같은 길이를 다르게 나누기": () => [splitTwoExample({ id: "split-1", title: "예제 1", start: 6, end: 30, a: 3, b: 4 })],
    "같은 비 늘어놓기": () => [ratioSeqExample({ id: "rseq-1", title: "예제 1", p: 4, q: 5 })],
    // 분수와 비
    "크기가 같은 분수": () => [fracChainExample({ id: "fchain-1", title: "예제 1", base: [2, 5], items: [[null, 10], [6, null], [null, 25]] }), fracChainExample({ id: "fchain-2", title: "예제 2", base: [24, 36], items: [[null, 12], [4, null], [null, 3]] })],
    "비로 나타내기": () => [ratioWordExample({ id: "rword-1", title: "예제 1", who: ["언니", "나"], things: [5, 4], ask: "ratio" })],
    "분수로 나타내기": () => [ratioWordExample({ id: "rword-2", title: "예제 1", who: ["나", "언니"], things: [4, 5], ask: "frac" })],
    "같은 비 채우기": () => [ratioFillExample({ id: "rfill-1", title: "예제 1", p: 4, q: 7, rows: [[null, 14], [12, null], [null, 35]] })],
    "합이 정해진 같은 분수": () => [fracSumExample({ id: "fsum-1", title: "예제 1", base: [1, 5], sums: [18, 30, 42] })],
    "비와 합": () => [ratioTotalExample({ id: "rtot-1", title: "예제 1", p: 4, q: 3, total: 42 })],
    "비와 차": () => [ratioTotalExample({ id: "rdiff-1", title: "예제 1", p: 2, q: 7, diff: 20 })],
    // 막대와 저울의 비
    "막대와 비": () => [inverseRatioExample({ id: "inv-1", title: "예제 1", a: 2, b: 5, total: 28 })],
    "저울과 비": () => [inverseRatioExample({ id: "inv-2", title: "예제 1", a: 2, b: 6, total: 36, kind: "balance" })]
  }
};

// ───────────────────────── 2·3·8권 분수: 색칠한 부분 · 접은 횟수 · 분수만큼의 개수 · 그림으로 거꾸로 풀기 ─────────────────────────
// 분수는 글에서 「8분의 3」, 그림에서 위아래로 쌓는다. 그림 kind "fshape"(원 조각·모눈·육각형) · "fbar"(띠를 똑같이 나눈 칸).
const fshape = (shape, parts, shaded, p = {}) => ({ kind: "fshape", shape, parts, rows: p.rows, cols: p.cols, shaded, tone: p.tone || "doing" });
const fbar = (parts, p = {}) => ({ kind: "fbar", parts, shaded: p.shaded || [], crossed: p.crossed || [], counts: p.counts, sub: p.sub, brace: p.brace, tone: p.tone || "doing" });
const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
function shadeFracExample({ id, title, shape, parts, shaded, rows, cols, note = "" }) {
  const k = shaded.length, fig = (tone) => fshape(shape, parts, shaded, { rows, cols, tone });
  const steps = [
    { text: `${note}전체를 같은 크기 ${parts}조각으로 나누었어요. 분모는 ${parts}.`, figure: fig("doing") },
    { text: `색칠한 조각은 ${k}개라 분자는 ${k}.`, figure: fig("doing") },
    { text: `그래서 색칠한 부분은 전체의 ${parts}분의 ${k}.`, figure: fracs([[k, parts]], { tone: "check" }) }
  ];
  return { id, title, problem: "색칠한 부분은 전체의 얼마인지 분수로 나타내요.", figure: fig("given"), steps, answer: `${parts}분의 ${josa(k, "이에요")}.`, value: { kind: "shade", parts, k } };
}
function foldFracExample({ id, title, folds = null, den = null }) {
  const n = folds ?? Math.log2(den), d = 2 ** n, grids = [[1, 1], [1, 2], [2, 2], [2, 4], [4, 4], [4, 8], [8, 8]];
  if (!Number.isInteger(n)) throw new Error(`${id}: 2를 거듭 곱한 수가 아님`);
  const g = (k) => { const [r, c] = grids[k]; return fshape("grid", r * c, [0], { rows: r, cols: c }); };
  if (folds !== null) {
    const steps = [
      { text: "반으로 한 번 접을 때마다 조각 수가 두 배가 돼요.", figure: g(1) },
      { text: `${range(1, n + 1).map((k) => `${k}번 → ${2 ** k}조각`).join(", ")}.`, figure: g(n) },
      { text: `${n}번 접은 한 조각은 전체의 ${d}분의 1.`, figure: { ...g(n), tone: "check" } }
    ];
    return { id, title, problem: `색종이를 반으로 ${n}번 접으면 원래 색종이 크기의 몇 분의 몇이 될까요?`, figure: fshape("grid", 1, [], { rows: 1, cols: 1, tone: "given" }), steps, answer: `${d}분의 1이에요.`, value: { kind: "fold", folds: n, den: d } };
  }
  const steps = [
    { text: "한 번 접을 때마다 분모가 두 배: 2, 4, 8, 16, … .", figure: g(2) },
    { text: `${range(1, n + 1).map((k) => 2 ** k).join(", ")} — ${josa(d, "이")} ${n}번째예요.`, figure: fracs([[1, d]]) },
    { text: `그래서 ${n}번 접었어요.`, figure: fracs([[1, d]], { tone: "check" }) }
  ];
  return { id, title, problem: `색종이를 반으로 몇 번 접었더니 원래 크기의 ${d}분의 1이 되었어요. 몇 번 접었을까요?`, figure: fracs([[1, d]], { tone: "given" }), steps, answer: `${n}번이에요.`, value: { kind: "fold", folds: n, den: d } };
}
// 전체 total개의 n분의 k: 한 칸 = total ÷ n, k칸. eat이면 먹고 남은 (n − k)칸
function fracOfExample({ id, title, total, n, k, eat = false, thing = "구슬" }) {
  const one = total / n;
  if (!Number.isInteger(one)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const counts = Array(n).fill(String(one)), take = one * k, rest = total - take;
  const steps = [
    { text: `${thing} ${total}개를 똑같이 ${n}칸으로 나눠요. 한 칸은 ${total} ÷ ${n} = ${one}개.`, figure: fbar(n, { counts }) },
    eat ? { text: `${josa(`${n}분의 ${k}`, "을")} 먹었으니 ${k}칸을 지워요. 남은 것은 ${n - k}칸.`, figure: fbar(n, { counts, crossed: range(0, k) }) } : { text: `${josa(`${n}분의 ${k}`, "은")} ${k}칸이에요.`, figure: fbar(n, { counts, shaded: range(0, k) }) },
    eat ? { text: `남은 ${n - k}칸은 ${one} × ${n - k} = ${rest}개.`, figure: fbar(n, { counts, crossed: range(0, k), brace: { from: k, to: n - 1, label: `${rest}개` }, tone: "check" }) } : { text: `${k}칸은 ${one} × ${k} = ${take}개.`, figure: fbar(n, { counts, shaded: range(0, k), brace: { from: 0, to: k - 1, label: `${take}개` }, tone: "check" }) }
  ];
  return { id, title, problem: eat ? `${thing} ${total}개의 ${josa(`${n}분의 ${k}`, "을")} 먹었어요. 남은 ${josa(thing, "은")} 몇 개일까요?` : `${thing} ${total}개의 ${josa(`${n}분의 ${k}`, "은")} 몇 개일까요?`, figure: fbar(n, { tone: "given" }), steps, answer: `${eat ? rest : take}개예요.`, value: { kind: "frac-of", total, n, k, eat, result: eat ? rest : take } };
}
// 거꾸로: n분의 k를 주고(먹고) left가 남았다 → 남은 (n − k)칸 = left
function giveLeftExample({ id, title, n, k, left, thing = "구슬" }) {
  const one = left / (n - k), total = one * n;
  if (!Number.isInteger(one)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const counts = (show) => Array(n).fill(show ? String(one) : "");
  const steps = [
    { text: `처음 ${josa(thing, "을")} ${n}칸으로 나눠 그려요. ${k}칸을 주었으니 남은 것은 ${n - k}칸이에요.`, figure: fbar(n, { crossed: range(0, k), brace: { from: k, to: n - 1, label: `${left}개` } }) },
    { text: `남은 ${n - k}칸이 ${left}개라 한 칸은 ${left} ÷ ${n - k} = ${one}개.`, figure: fbar(n, { crossed: range(0, k), counts: counts(true), brace: { from: k, to: n - 1, label: `${left}개` } }) },
    { text: `처음은 ${n}칸이라 ${one} × ${n} = ${total}개. ${total}개의 ${josa(`${n}분의 ${k}`, "은")} ${one * k}개, 주고 나면 ${left}개가 남아요.`, figure: fbar(n, { counts: counts(true), brace: { from: 0, to: n - 1, label: `${total}개` }, tone: "check" }) }
  ];
  return { id, title, problem: `가지고 있던 ${thing}의 ${josa(`${n}분의 ${k}`, "을")} 친구에게 주었더니 ${left}개가 남았어요. 처음에 가지고 있던 ${josa(thing, "은")} 몇 개일까요?`, figure: fbar(n, { tone: "given" }), steps, answer: `${total}개예요.`, value: { kind: "give-left", n, k, left, total } };
}
// 두 번 덜어 내기: n1분의 k1을 먹고, 나머지의 n2분의 k2를 주었더니 left
function twiceLeftExample({ id, title, n1, k1, n2, k2, left, thing = "귤" }) {
  const rest2Parts = n2 - k2, restOne = left / rest2Parts, rest = restOne * n2, one = rest / (n1 - k1), total = one * n1;
  if (![restOne, one].every(Number.isInteger)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const last = n1 - 1;
  const steps = [
    { text: `전체를 ${n1}칸으로 나눠 ${k1}칸을 먹었어요. 나머지 ${n1 - k1}칸을 다시 ${n2}조각으로 나눠 ${k2}조각을 주었어요.`, figure: fbar(n1, { crossed: range(0, k1), sub: { from: k1, to: last, parts: n2, crossed: range(0, k2) } }) },
    { text: `남은 ${rest2Parts}조각이 ${left}개라 한 조각은 ${left} ÷ ${rest2Parts} = ${restOne}개, 나머지 전체는 ${restOne} × ${n2} = ${rest}개.`, figure: fbar(n1, { crossed: range(0, k1), sub: { from: k1, to: last, parts: n2, crossed: range(0, k2), counts: Array(n2).fill(String(restOne)) }, brace: { from: k1, to: last, label: `${rest}개` } }) },
    { text: `나머지 ${rest}개가 ${n1 - k1}칸이라 한 칸은 ${one}개, 처음은 ${one} × ${n1} = ${total}개.`, figure: fbar(n1, { counts: Array(n1).fill(String(one)), brace: { from: 0, to: last, label: `${total}개` }, tone: "check" }) }
  ];
  return { id, title, problem: `${thing}의 ${josa(`${n1}분의 ${k1}`, "을")} 먹고, 나머지의 ${josa(`${n2}분의 ${k2}`, "을")} 친구에게 주었더니 ${left}개가 남았어요. 처음 ${josa(thing, "은")} 몇 개였을까요?`, figure: fbar(n1, { tone: "given" }), steps, answer: `${total}개예요.`, value: { kind: "twice-left", n1, k1, n2, k2, left, total } };
}
// 차: 전체 total에서 n분의 k와 나머지의 차 · 거꾸로 차 diff로 전체
function fracDiffExample({ id, title, n, k, total = null, diff = null, who = ["여학생", "남학생"], other = null }) {
  const m = other ?? n - k, gap = k - m;
  if (total !== null) {
    const one = total / n, d = one * gap;
    if (!Number.isInteger(one)) throw new Error(`${id}: 나누어떨어지지 않음`);
    const steps = [
      { text: `전체 ${josa(total, "을")} ${n}칸으로 나누면 한 칸은 ${total} ÷ ${n} = ${one}.`, figure: fbar(n, { counts: Array(n).fill(String(one)) }) },
      { text: `${other === null ? `${josa(who[0], "은")} ${k}칸, ${josa(who[1], "은")} ${m}칸` : `${josa(`${n}분의 ${k}`, "은")} ${k}칸, ${josa(`${n}분의 ${m}`, "은")} ${m}칸`}. 차는 ${k} − ${m} = ${gap}칸.`, figure: fbar(n, { counts: Array(n).fill(String(one)), shaded: range(0, k), brace: { from: m, to: k - 1, label: `차 ${gap}칸` } }) },
      { text: `${gap}칸은 ${one} × ${gap} = ${d}.`, figure: fbar(n, { counts: Array(n).fill(String(one)), shaded: range(0, k), tone: "check" }) }
    ];
    const problem = other === null ? `모두 ${total}명 중 ${josa(who[0], "이")} 전체의 ${n}분의 ${k}예요. ${josa(who[0], "은")} ${who[1]}보다 몇 명 더 많을까요?` : `${total}의 ${n}분의 ${k}는 ${total}의 ${n}분의 ${m}보다 얼마만큼 더 클까요?`;
    return { id, title, problem, figure: fbar(n, { tone: "given" }), steps, answer: `${d}${other === null ? "명 더 많아요" : "만큼 더 커요"}.`, value: { kind: "frac-diff", n, k, m, total, d } };
  }
  const one = diff / gap, all = one * n;
  if (!Number.isInteger(one)) throw new Error(`${id}: 나누어떨어지지 않음`);
  const steps = [
    { text: `전체를 ${n}칸으로 그려요. ${k}칸과 ${m}칸의 차는 ${k} − ${m} = ${gap}칸이에요.`, figure: fbar(n, { shaded: range(0, k) }) },
    { text: gap === 1 ? `차 1칸이 ${ira(diff)} 한 칸이 ${josa(one, "이에요")}.` : `${gap}칸이 ${ira(diff, "니")} 한 칸은 ${diff} ÷ ${gap} = ${one}.`, figure: fbar(n, { shaded: range(0, k), counts: Array(n).fill(String(one)) }) },
    { text: `전체 ${n}칸은 ${one} × ${n} = ${all}.`, figure: fbar(n, { counts: Array(n).fill(String(one)), brace: { from: 0, to: n - 1, label: String(all) }, tone: "check" }) }
  ];
  const problem = other === null ? `어느 반 ${josa(who[0], "은")} 반 전체의 ${n}분의 ${k}예요. ${josa(who[0], "이")} ${who[1]}보다 ${diff}명 더 많다면 반 학생은 모두 몇 명일까요?` : `어떤 수의 ${n}분의 ${k}는 어떤 수의 ${n}분의 ${m}보다 ${diff}만큼 더 커요. 어떤 수는 얼마일까요?`;
  return { id, title, problem, figure: fbar(n, { tone: "given" }), steps, answer: `${other === null ? `${all}명이에요` : josa(all, "이에요")}.`, value: { kind: "frac-diff-back", n, k, m, diff, all } };
}
const FRAC_SET = {
  id: "frac",
  types: {
    // 2·3권 색칠한 부분
    "같은 크기로 나눈 도형의 분수": () => [shadeFracExample({ id: "shade-1", title: "예제 1", shape: "circle", parts: 5, shaded: [0, 1, 2] }), shadeFracExample({ id: "shade-2", title: "예제 2", shape: "grid", parts: 6, rows: 2, cols: 3, shaded: [0, 4, 5] })],
    "도형을 같은 크기로 나눈 분수": () => [shadeFracExample({ id: "shade-3", title: "예제 1", shape: "hex", parts: 3, shaded: [0, 2], note: "육각형을 가운데에서 꼭짓점 하나 건너 하나씩 이으면 똑같은 마름모 3개가 돼요. " }), shadeFracExample({ id: "shade-4", title: "예제 2", shape: "hex", parts: 6, shaded: [0, 3], note: "육각형의 가운데와 꼭짓점을 모두 이으면 똑같은 삼각형 6개가 돼요. " })],
    "접은 횟수와 전체의 분수": () => [foldFracExample({ id: "fold-1", title: "예제 1", folds: 4 })],
    "분수로 접은 횟수 역산": () => [foldFracExample({ id: "fold-2", title: "예제 1", den: 64 })],
    // 8권 분수
    "색칠한 부분을 분수로": () => [shadeFracExample({ id: "shade-5", title: "예제 1", shape: "circle", parts: 7, shaded: [0, 1, 2, 3] })],
    "전체의 몇 분의 몇": () => [fracOfExample({ id: "of-1", title: "예제 1", total: 20, n: 5, k: 2 }), fracOfExample({ id: "of-2", title: "예제 2", total: 28, n: 7, k: 3 })],
    "먹고 남은 개수": () => [fracOfExample({ id: "eat-1", title: "예제 1", total: 30, n: 5, k: 2, eat: true, thing: "귤" })],
    "준 뒤 남은 수로 처음 수": () => [giveLeftExample({ id: "give-1", title: "예제 1", n: 6, k: 1, left: 20 }), giveLeftExample({ id: "give-2", title: "예제 2", n: 7, k: 3, left: 16 })],
    "두 번 덜어 낸 뒤 처음 수": () => [twiceLeftExample({ id: "twice-1", title: "예제 1", n1: 3, k1: 1, n2: 4, k2: 1, left: 9 })],
    "전체와 분수로 차 구하기": () => [fracDiffExample({ id: "diff-1", title: "예제 1", n: 7, k: 4, total: 35 }), fracDiffExample({ id: "diff-2", title: "예제 2", n: 8, k: 5, total: 32, other: 2 })],
    "차로 전체 구하기": () => [fracDiffExample({ id: "back-1", title: "예제 1", n: 9, k: 5, diff: 6, who: ["남학생", "여학생"] }), fracDiffExample({ id: "back-2", title: "예제 2", n: 9, k: 5, diff: 15, other: 2 })]
  }
};

// ───────────────────────── 3·9권 넓이: 온칸과 반칸 · 직사각형의 반 · 틀에서 빼기 · 겹친 정사각형과 마름모 ─────────────────────────
// 그림 kind "agrid": 모눈 w × h, polys = 색칠한 다각형(꼭짓점은 모눈점), frame = 틀 [x0, y0, x1, y1], marks = { full, half } 칸 표시, tris = 틀에서 뺄 삼각형.
const agrid = (w, h, polys, p = {}) => ({ kind: "agrid", w, h, polys, frame: p.frame, marks: p.marks, tris: p.tris, tone: p.tone || "doing" });
const shoelace = (pts) => Math.abs(pts.reduce((a, [x, y], i) => { const [u, v] = pts[(i + 1) % pts.length]; return a + x * v - u * y; }, 0)) / 2;
const inPoly = (x, y, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
// 칸마다 다각형이 덮는 양(0, 반, 1)을 점을 찍어 잰다
function cellCover(w, h, polys) {
  const N = 10, full = [], half = [];
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    let hit = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const x = c + (i + 0.5) / N, y = r + (j + 0.5) / N; if (polys.some((pts) => inPoly(x, y, pts))) hit++; }
    const f = hit / (N * N);
    if (f > 0.97) full.push([c, r]); else if (Math.abs(f - 0.5) < 0.08) half.push([c, r]); else if (f > 0.03) return null;
  }
  return { full, half };
}
function cellAreaExample({ id, title, w, h, polys, note = "" }) {
  const cov = cellCover(w, h, polys);
  if (!cov) throw new Error(`${id}: 온칸·반칸으로 나뉘지 않음`);
  const F = cov.full.length, Hf = cov.half.length, area = F + Hf / 2;
  if (!Number.isInteger(area)) throw new Error(`${id}: 반칸이 홀수`);
  const steps = [
    { text: `${note}한 칸의 넓이를 1로 봐요. 꽉 찬 칸(온칸)을 세면 ${F}개.`, figure: agrid(w, h, polys, { marks: { full: cov.full } }) },
    { text: `비스듬한 선이 지나는 반칸은 ${Hf}개. 반칸 두 개를 모으면 온칸 하나라 ${Hf} ÷ 2 = ${Hf / 2}.`, figure: agrid(w, h, polys, { marks: { full: cov.full, half: cov.half } }) },
    { text: `넓이는 ${F} + ${Hf / 2} = ${area}.`, figure: agrid(w, h, polys, { marks: { full: cov.full, half: cov.half }, tone: "check" }) }
  ];
  return { id, title, problem: "모눈 한 칸의 넓이가 1일 때 색칠한 도형의 넓이를 구해요.", figure: agrid(w, h, polys, { tone: "given" }), steps, answer: `${josa(area, "이에요")}.`, value: { kind: "cell-area", w, h, polys, area } };
}
function rectAreaExample({ id, title, w, h, x, y, rw, rh }) {
  const poly = [[x, y], [x + rw, y], [x + rw, y + rh], [x, y + rh]], area = rw * rh;
  const steps = [
    { text: `가로로 ${rw}칸, 세로로 ${rh}칸이에요.`, figure: agrid(w, h, [poly]) },
    { text: `한 줄에 ${rw}칸씩 ${rh}줄이라 ${rw} × ${rh} = ${area}.`, figure: agrid(w, h, [poly], { marks: { full: cellCover(w, h, [poly]).full }, tone: "check" }) }
  ];
  return { id, title, problem: "모눈 한 칸의 넓이를 1로 보고 색칠한 직사각형의 넓이를 구해요.", figure: agrid(w, h, [poly], { tone: "given" }), steps, answer: `${josa(area, "이에요")}.`, value: { kind: "poly-area", polys: [poly], area } };
}
// 직사각형을 대각선으로 반으로 나눈 삼각형: 직사각형 넓이 ÷ 2
function halfTriExample({ id, title, w, h, x, y, a, b, flip = false }) {
  const tri = flip ? [[x, y], [x + a, y], [x + a, y + b]] : [[x, y], [x, y + b], [x + a, y + b]], rect = a * b, area = rect / 2;
  if (!Number.isInteger(area)) throw new Error(`${id}: 반이 딱 떨어지지 않음`);
  const steps = [
    { text: `삼각형을 둘러싸는 직사각형을 그려요. 가로 ${a}칸, 세로 ${b}칸이라 ${a} × ${b} = ${rect}.`, figure: agrid(w, h, [tri], { frame: [x, y, x + a, y + b] }) },
    { text: `대각선이 직사각형을 똑같이 둘로 나누니 삼각형은 그 반: ${rect} ÷ 2 = ${area}.`, figure: agrid(w, h, [tri], { frame: [x, y, x + a, y + b], tone: "check" }) }
  ];
  return { id, title, problem: "모눈 한 칸의 넓이를 1로 보고 색칠한 삼각형의 넓이를 구해요.", figure: agrid(w, h, [tri], { tone: "given" }), steps, answer: `${josa(area, "이에요")}.`, value: { kind: "poly-area", polys: [tri], area } };
}
// 틀에서 빼기: 틀 직사각형 넓이 − 색칠하지 않은 삼각형들(모두 직각삼각형, 두 변의 칸 수 × ÷ 2)
function frameAreaExample({ id, title, w, h, frame, pts, cuts }) {
  const [x0, y0, x1, y1] = frame, F = (x1 - x0) * (y1 - y0), parts = cuts.map((t) => shoelace(t)), area = F - sum(parts);
  if (Math.abs(area - shoelace(pts)) > 1e-9) throw new Error(`${id}: 틀에서 뺀 값이 도형 넓이와 다름`);
  const marks = "①②③④".split(""), legs = cuts.map((t) => { const xs = t.map((p) => p[0]), ys = t.map((p) => p[1]); return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; });
  const tris = cuts.map((t, i) => ({ pts: t, label: marks[i] }));
  const steps = [
    { text: `도형을 꼭 맞게 둘러싼 틀은 가로 ${x1 - x0}칸, 세로 ${y1 - y0}칸: ${x1 - x0} × ${y1 - y0} = ${F}.`, figure: agrid(w, h, [pts], { frame }) },
    { text: `틀에서 색칠하지 않은 곳은 직각삼각형 ${cuts.length}개예요. ${legs.map(([a, b], i) => `${marks[i]} ${a} × ${b} ÷ 2 = ${parts[i]}`).join(", ")}.`, figure: agrid(w, h, [pts], { frame, tris }) },
    { text: `넓이는 ${F} − (${parts.join(" + ")}) = ${F} − ${sum(parts)} = ${area}.`, figure: agrid(w, h, [pts], { frame, tris, tone: "check" }) }
  ];
  return { id, title, problem: "직사각형 틀 안에 색칠한 도형의 넓이를 구해요. 모눈 한 칸의 넓이는 1이에요.", figure: agrid(w, h, [pts], { frame, tone: "given" }), steps, answer: `${josa(area, "이에요")}.`, value: { kind: "poly-area", polys: [pts], area, frame } };
}
// 정사각형의 변의 가운데를 이으면 넓이가 반인 마름모. 번갈아 그리면 바깥으로 갈 때마다 두 배
const nest = (n, p = {}) => ({ kind: "nest", n, hi: p.hi, labels: p.labels || {}, tone: p.tone || "doing" });
function nestAreaExample({ id, title, n, given, from, to }) {
  // from(0 = 가장 바깥)의 넓이로 나머지를 정한다
  const at = (k) => given * 2 ** (from - k);
  const ans = at(to), word = (k) => (k % 2 === 0 ? "정사각형" : "마름모");
  const chain = (to > from ? range(from + 1, to + 1) : range(to, from).reverse()).map((k) => `${at(k)}`);
  const steps = [
    { text: "정사각형의 네 변의 가운데를 이으면 마름모가 생겨요. 가운데 십자로 접어 보면 마름모는 정사각형의 반이에요.", figure: nest(2, { hi: [1] }) },
    { text: `${to > from ? "안쪽으로 한 겹 들어갈 때마다 반이에요" : "바깥으로 한 겹 나갈 때마다 두 배예요"}. ${at(from)} → ${chain.join(" → ")}.`, figure: nest(n, { labels: Object.fromEntries(range(Math.min(from, to), Math.max(from, to) + 1).map((k) => [k, String(at(k))])) }) },
    { text: `그래서 ${to + 1}번째 ${word(to)}의 넓이는 ${ans}.`, figure: nest(n, { hi: [to], labels: { [from]: String(given), [to]: String(ans) }, tone: "check" }) }
  ];
  return { id, title, problem: `정사각형과 마름모를 번갈아 겹쳐 그렸어요. 가장 바깥부터 ${from + 1}번째 ${word(from)}의 넓이가 ${given}일 때, ${to + 1}번째 ${word(to)}의 넓이를 구해요.`, figure: nest(n, { labels: { [from]: String(given), [to]: "?" }, tone: "given" }), steps, answer: `${josa(ans, "이에요")}.`, value: { kind: "nest", given, from, to, ans } };
}
function growAreaExample({ id, title, target }) {
  const list = range(1, target + 1).map((k) => 2 ** (k - 1));
  const steps = [
    { text: "넓이 1인 정사각형에서 시작해 바깥에 마름모, 정사각형을 번갈아 둘러요. 바깥 도형은 안쪽 도형의 두 배예요.", figure: nest(3, { labels: { 2: "1", 1: "2", 0: "4" } }) },
    { text: `넓이를 차례로 쓰면 ${list.join(", ")}.`, figure: { kind: "seq", values: list, notes: list.map((_, i) => `${i + 1}번째`), tone: "doing" } },
    { text: `${target}번째는 1에 2를 ${target - 1}번 곱한 ${list.at(-1)}.`, figure: { kind: "seq", values: list, notes: list.map((_, i) => `${i + 1}번째`), tone: "check" } }
  ];
  return { id, title, problem: `넓이가 1인 정사각형에서 시작해 바깥으로 마름모와 정사각형을 번갈아 둘러 그려요(1번째가 넓이 1인 정사각형). ${target}번째 바깥 도형의 넓이를 구해요.`, figure: nest(4, { tone: "given" }), steps, answer: `${josa(list.at(-1), "이에요")}.`, value: { kind: "grow", target, ans: list.at(-1) } };
}
const AREA_SET = {
  id: "area",
  types: {
    // 3권
    "모눈 한 칸으로 도형 넓이 세기": () => [cellAreaExample({ id: "cell-1", title: "예제 1", w: 4, h: 3, polys: [[[0, 1], [1, 0], [3, 0], [4, 1], [4, 3], [0, 3]]] }), cellAreaExample({ id: "cell-2", title: "예제 2", w: 5, h: 4, polys: [[[1, 0], [3, 0], [5, 2], [3, 4], [1, 4], [1, 3], [0, 3], [0, 1], [1, 1]]] })],
    "번갈아 커지는 도형 넓이": () => [growAreaExample({ id: "grow-1", title: "예제 1", target: 6 })],
    "겹친 정사각형과 마름모 넓이": () => [nestAreaExample({ id: "nest-1", title: "예제 1", n: 3, given: 3, from: 1, to: 0 }), nestAreaExample({ id: "nest-2", title: "예제 2", n: 4, given: 40, from: 0, to: 2 })],
    // 9권
    "직사각형의 넓이": () => [rectAreaExample({ id: "rect-1", title: "예제 1", w: 6, h: 4, x: 1, y: 1, rw: 4, rh: 2 })],
    "반으로 나눈 정사각형": () => [halfTriExample({ id: "half-sq", title: "예제 1", w: 4, h: 4, x: 1, y: 1, a: 2, b: 2 })],
    "반 칸 삼각형 모으기": () => [cellAreaExample({ id: "cell-3", title: "예제 1", w: 5, h: 3, polys: [[[0, 2], [2, 0], [4, 2]]] })],
    "직사각형을 반으로 나눈 삼각형": () => [halfTriExample({ id: "half-1", title: "예제 1", w: 7, h: 5, x: 1, y: 1, a: 5, b: 2 }), halfTriExample({ id: "half-2", title: "예제 2", w: 6, h: 6, x: 1, y: 1, a: 3, b: 4, flip: true })],
    "여러 모양의 넓이": () => [cellAreaExample({ id: "cell-4", title: "예제 1", w: 6, h: 4, polys: [[[1, 3], [3, 1], [5, 1], [3, 3]]], note: "평행사변형은 비스듬한 쪽의 반칸끼리 짝을 지어요. " })],
    "틀 안의 도형": () => [frameAreaExample({ id: "frame-1", title: "예제 1", w: 6, h: 5, frame: [1, 1, 5, 4], pts: [[1, 1], [5, 2], [3, 4]], cuts: [[[1, 1], [5, 1], [5, 2]], [[5, 2], [5, 4], [3, 4]], [[1, 1], [3, 4], [1, 4]]] })],
    "틀 안의 기운 사각형": () => [frameAreaExample({ id: "frame-2", title: "예제 1", w: 8, h: 8, frame: [1, 1, 7, 7], pts: [[1, 3], [5, 1], [7, 5], [3, 7]], cuts: [[[1, 1], [5, 1], [1, 3]], [[5, 1], [7, 1], [7, 5]], [[7, 5], [7, 7], [3, 7]], [[3, 7], [1, 7], [1, 3]]] })]
  }
};

export const TYPE_EXAMPLE_SETS = Object.freeze({ [CUBE_SET.id]: CUBE_SET, [MAGIC_SET.id]: MAGIC_SET, [CLOCK_SET.id]: CLOCK_SET, [BALANCE_SET.id]: BALANCE_SET, [BUNDLE_SET.id]: BUNDLE_SET, [CONSEC_SET.id]: CONSEC_SET, [CIRCLE_SET.id]: CIRCLE_SET, [TIME_SET.id]: TIME_SET, [PERIMETER_SET.id]: PERIMETER_SET, [PLANTING_SET.id]: PLANTING_SET, [DIST_SET.id]: DIST_SET, [DIGIT_SET.id]: DIGIT_SET, [REVERSE_SET.id]: REVERSE_SET, [SPLIT_SET.id]: SPLIT_SET, [EQUALIZE_SET.id]: EQUALIZE_SET, [CALENDAR_SET.id]: CALENDAR_SET, [FIGNUM_SET.id]: FIGNUM_SET, [OUTLINE_SET.id]: OUTLINE_SET, [BALANCE4_SET.id]: BALANCE4_SET, [RELATION_SET.id]: RELATION_SET, [LOGIC_SET.id]: LOGIC_SET, [CRYPT_SET.id]: CRYPT_SET, [MATRIX_SET.id]: MATRIX_SET, [PMATRIX_SET.id]: PMATRIX_SET, [SEQ2_SET.id]: SEQ2_SET, [CALC6_SET.id]: CALC6_SET, [COUNT5_SET.id]: COUNT5_SET, [MISC_SET.id]: MISC_SET, [BOOK1_SET.id]: BOOK1_SET, [BOOK2_SET.id]: BOOK2_SET, [BOOK3_SET.id]: BOOK3_SET, [ARRANGE_SET.id]: ARRANGE_SET, [MEASURE_SET.id]: MEASURE_SET, [CUBES_SET.id]: CUBES_SET, [NLINE6_SET.id]: NLINE6_SET, [FRAC_SET.id]: FRAC_SET, [AREA_SET.id]: AREA_SET });

// 레슨의 원본 문항을 유형으로 묶고(처음 나온 순서), 유형마다 예제를 붙인다. 예제가 없는 유형은 examples: [].
export function typeExampleGroups(lesson, setId) {
  const set = TYPE_EXAMPLE_SETS[setId];
  if (!set) return [];
  const groups = new Map();
  for (const item of lesson?.original?.items || []) {
    const label = set.typeOf ? set.typeOf(item) : item.typeLabel;
    if (!label) continue;
    if (!groups.has(label)) groups.set(label, { typeLabel: label, count: 0, examples: set.types[label] ? set.types[label]() : [] });
    groups.get(label).count++;
  }
  return [...groups.values()];
}
