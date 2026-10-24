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
  const last = String(word).replace(/[^가-힣0-9A-Za-z□]+$/u, "").at(-1) || "";
  const code = last.charCodeAt(0) - 0xac00;
  const has = /\d/.test(last) ? DIGIT_BATCHIM[last] : code >= 0 && code <= 11171 ? code % 28 !== 0 : false;
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

export const TYPE_EXAMPLE_SETS = Object.freeze({ [CUBE_SET.id]: CUBE_SET, [MAGIC_SET.id]: MAGIC_SET, [CLOCK_SET.id]: CLOCK_SET, [BALANCE_SET.id]: BALANCE_SET });

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
