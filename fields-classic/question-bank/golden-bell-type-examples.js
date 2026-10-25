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
const numEuro = (n) => `${n}${/[0369]$/u.test(String(n)) ? "으로" : "로"}`;
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

export const TYPE_EXAMPLE_SETS = Object.freeze({ [CUBE_SET.id]: CUBE_SET, [MAGIC_SET.id]: MAGIC_SET, [CLOCK_SET.id]: CLOCK_SET, [BALANCE_SET.id]: BALANCE_SET, [BUNDLE_SET.id]: BUNDLE_SET, [CONSEC_SET.id]: CONSEC_SET, [CIRCLE_SET.id]: CIRCLE_SET, [TIME_SET.id]: TIME_SET, [PERIMETER_SET.id]: PERIMETER_SET, [PLANTING_SET.id]: PLANTING_SET, [DIST_SET.id]: DIST_SET, [DIGIT_SET.id]: DIGIT_SET, [REVERSE_SET.id]: REVERSE_SET, [SPLIT_SET.id]: SPLIT_SET, [EQUALIZE_SET.id]: EQUALIZE_SET, [CALENDAR_SET.id]: CALENDAR_SET });

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
