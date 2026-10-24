import { seededRandom, shuffle, randInt, fillLevel, weightedPick } from "./golden-bell-level-game.js?v=20261024t";

// 9권 레벨 게임 2종의 문제 규칙. 화면과 검사기가 같은 함수를 쓴다.
// 교재 원문 숫자를 복제하지 않는다: 문제는 모두 코드로 만들고, 답(개수·빈칸)은 코드가 전수로 다시 구한다.
// 같은 모양·같은 수 배치가 원본 문항과 우연히 겹치면 그 문제는 버린다(avoid: 개념 단계가 그 레슨의 원본 그림으로 채운다).
//   b9-cubes 쌓기나무 탑 쌓기 — 쌓기나무의 최대와 최소(위·앞·오른쪽 옆에서 본 모양)
//   b9-magic 숫자 유리창     — 마방진(가로·세로·대각선의 같은 합)

const endlessOf = (count) => (level) => {
  const extra = level - 10;
  return { title: `끝없는 도전 ${extra}`, rule: `문제가 ${Math.min(30, count + extra * 2)}개! 깰 때마다 2개씩 늘어나요.`, count: Math.min(30, count + extra * 2), extra };
};

// ───────────────────────── 쌓기나무 ─────────────────────────
// heights[r][c]: 위에서 본 칸의 층수(0 = 빈 칸). r = 0이 맨 뒷줄, 마지막 줄이 맨 앞줄.
// 앞에서 본 모양 front[c] = 그 세로줄의 가장 높은 층(왼쪽 줄부터).
// 오른쪽 옆에서 본 모양 side[i] = 앞줄부터 i번째 가로줄의 가장 높은 층 — 판서·원본 그림과 같은 약속.
export function cubeViews(heights) {
  const rows = heights.length, cols = heights[0].length;
  return {
    top: heights.map((row) => row.map((h) => (h > 0 ? 1 : 0))),
    front: Array.from({ length: cols }, (_, c) => Math.max(...heights.map((row) => row[c]))),
    side: Array.from({ length: rows }, (_, i) => Math.max(...heights[rows - 1 - i]))
  };
}
export const sameViews = (a, b) => JSON.stringify(a.top) === JSON.stringify(b.top) && a.front.join() === b.front.join() && a.side.join() === b.side.join();
export const cubeSignature = (v) => `${v.top.map((r) => r.join("")).join(".")}|${v.front.join("")}|${v.side.join("")}`;
export const cubeTotal = (heights) => heights.flat().reduce((a, b) => a + b, 0);
// 칸마다 쌓을 수 있는 가장 높은 층 = 앞 모양 층수와 옆 모양 층수 중 작은 수.
export function cubeBounds(views) {
  const rows = views.top.length;
  return views.top.map((row, r) => row.map((on, c) => (on ? Math.min(views.front[c], views.side[rows - 1 - r]) : 0)));
}
// 위·앞·옆 모양이 같은 쌓기를 모두 세어 가장 적은 것·가장 많은 것을 구한다.
export function solveCubes(views, { limit = 400000 } = {}) {
  const bounds = cubeBounds(views), cells = [];
  bounds.forEach((row, r) => row.forEach((b, c) => { if (views.top[r][c]) cells.push([r, c, b]); }));
  if (cells.some(([, , b]) => b < 1)) return { count: 0, min: null, max: null };
  const space = cells.reduce((p, [, , b]) => p * b, 1);
  if (space > limit) return null;
  const heights = views.top.map((row) => row.map(() => 0));
  const rows = views.top.length;
  // 줄(가로줄) 하나를 다 채울 때마다 옆 모양과 맞는지 먼저 본다 — 안 맞으면 그 뒤는 세지 않는다.
  const lastInRow = new Set(views.top.map((row, r) => { let k = -1; cells.forEach(([cr], i) => { if (cr === r) k = i; }); return k; }));
  let count = 0, min = Infinity, max = -Infinity, minMap = null, maxMap = null;
  const rec = (k, total) => {
    if (k === cells.length) {
      if (!sameViews(cubeViews(heights), views)) return;
      count++;
      if (total < min) { min = total; minMap = heights.map((row) => [...row]); }
      if (total > max) { max = total; maxMap = heights.map((row) => [...row]); }
      return;
    }
    const [r, c, b] = cells[k];
    for (let h = 1; h <= b; h++) {
      heights[r][c] = h;
      if (lastInRow.has(k) && Math.max(...heights[r]) !== views.side[rows - 1 - r]) continue;
      rec(k + 1, total + h);
    }
    heights[r][c] = 0;
  };
  rec(0, 0);
  return { count, min, max, minMap, maxMap };
}
function randomShape(rows, cols, rand, fill) {
  for (let t = 0; t < 50; t++) {
    const top = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rand() < fill ? 1 : 0)));
    if (top.every((row) => row.some(Boolean)) && top[0].every((_, c) => top.some((row) => row[c]))) return top;
  }
  return Array.from({ length: rows }, () => Array(cols).fill(1));
}
function makeCubes(spec, kind, rand, avoid) {
  const [rows, cols] = spec.sizes[randInt(0, spec.sizes.length - 1, rand)];
  const top = randomShape(rows, cols, rand, spec.fill ?? 0.8);
  const heights = top.map((row) => row.map((on) => (on ? randInt(1, spec.maxH, rand) : 0)));
  const views = cubeViews(heights);
  if (Math.max(...views.front, ...views.side) < 2) return null; // 다 1층이면 생각할 거리가 없다
  const sig = cubeSignature(views);
  if (avoid?.has(sig)) return null;
  const sol = solveCubes(views);
  if (!sol || !sol.count) return null;
  if (kind === "exact" && sol.min !== sol.max) return null;
  if (kind !== "exact" && sol.min === sol.max) return null;
  const answer = kind === "max" ? sol.max : sol.min;
  const answerMap = kind === "max" ? sol.maxMap : sol.minMap;
  return { kind, rows, cols, views, min: sol.min, max: sol.max, solutions: sol.count, answer, answerMap, maxH: Math.max(...views.front, ...views.side), key: `${kind}:${sig}` };
}
// 쌓은 것을 문제와 비교한다. info는 틀린 까닭(힌트용).
export function checkCubes(p, heights) {
  const mine = cubeViews(heights);
  const total = cubeTotal(heights);
  const topOk = JSON.stringify(mine.top) === JSON.stringify(p.views.top);
  const frontBad = p.views.front.map((h, c) => (mine.front[c] === h ? -1 : c)).filter((c) => c >= 0);
  const sideBad = p.views.side.map((h, i) => (mine.side[i] === h ? -1 : i)).filter((i) => i >= 0);
  const viewsOk = topOk && !frontBad.length && !sideBad.length;
  const countOk = p.kind === "exact" || total === p.answer;
  return { correct: viewsOk && countOk, viewsOk, topOk, frontBad, sideBad, total, mine };
}
export const CUBES = {
  id: "b9-cubes", title: "쌓기나무 탑 쌓기",
  avoid: new Set(),
  levels: [
    { title: "그대로 쌓기", rule: "위·앞·오른쪽 옆에서 본 모양이 똑같아지게 쌓아요. 칸을 누르면 쌓기나무가 하나씩 올라가요.", count: 5, mix: { exact: 1 }, sizes: [[2, 2]], maxH: 2 },
    { title: "세 줄 판", rule: "판이 넓어졌어요. 앞 모양과 옆 모양을 하나씩 맞춰요.", count: 5, mix: { exact: 1 }, sizes: [[2, 3], [3, 2]], maxH: 3 },
    { title: "빈칸이 있는 판", rule: "위에서 본 칸에만 쌓을 수 있어요.", count: 5, mix: { exact: 1 }, sizes: [[3, 3]], maxH: 3, fill: 0.7 },
    { title: "가장 적게", rule: "모양은 그대로, 쌓기나무를 가장 적게 써요. 높은 층을 한 칸에 겹쳐 봐요.", count: 5, mix: { min: 1 }, sizes: [[2, 2]], maxH: 3 },
    { title: "가장 많이", rule: "모양은 그대로, 쌓기나무를 가장 많이 써요.", count: 5, mix: { max: 1 }, sizes: [[2, 2], [2, 3]], maxH: 3 },
    { title: "적게·많게", rule: "가장 적게와 가장 많이가 섞여 나와요. 미션을 잘 읽어요.", count: 6, mix: { min: 1, max: 1 }, sizes: [[2, 3], [3, 2]], maxH: 3 },
    { title: "큰 판에서 적게", rule: "세 줄 판에서 가장 적게 쌓아요.", count: 6, mix: { min: 1 }, sizes: [[3, 3]], maxH: 3, fill: 0.75 },
    { title: "큰 판에서 많이", rule: "세 줄 판에서 가장 많이 쌓아요.", count: 6, mix: { max: 1 }, sizes: [[3, 3]], maxH: 3, fill: 0.75 },
    { title: "모두 섞기", rule: "그대로·적게·많게가 모두 섞여 나와요.", count: 8, mix: { exact: 1, min: 1, max: 1 }, sizes: [[3, 3]], maxH: 3, fill: 0.75 },
    { title: "쌓기나무 마스터", rule: "4층까지 쌓아요. 모든 종류가 섞여요.", count: 8, mix: { exact: 1, min: 2, max: 2 }, sizes: [[3, 3]], maxH: 4, fill: 0.7 }
  ],
  endless: (level) => ({ ...endlessOf(10)(level), mix: { exact: 1, min: 2, max: 2 }, sizes: [[3, 3]], maxH: 4, fill: 0.7 }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      for (let t = 0; t < 300; t++) { const p = makeCubes(spec, kind, rand, this.avoid); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, heights) => checkCubes(p, heights).correct
};

// ───────────────────────── 마방진 ─────────────────────────
export function magicLines(n) {
  const lines = [];
  for (let r = 0; r < n; r++) lines.push({ id: `r${r}`, name: `가로 ${r + 1}줄`, cells: Array.from({ length: n }, (_, c) => r * n + c) });
  for (let c = 0; c < n; c++) lines.push({ id: `c${c}`, name: `세로 ${c + 1}줄`, cells: Array.from({ length: n }, (_, r) => r * n + c) });
  lines.push({ id: "d0", name: "대각선 ↘", cells: Array.from({ length: n }, (_, i) => i * n + i) });
  lines.push({ id: "d1", name: "대각선 ↙", cells: Array.from({ length: n }, (_, i) => i * n + (n - 1 - i)) });
  return lines;
}
export function isMagic(n, values) {
  const sums = magicLines(n).map((line) => line.cells.reduce((s, i) => s + values[i], 0));
  return sums.every((s) => s === sums[0]) ? sums[0] : null;
}
// 3칸 마방진의 일반형: 가운데 c, 두 수 a·b로 모든 3칸 마방진을 만든다(한 줄의 합 = 3c).
export const magicSquare3 = (c, a, b) => [c + a, c - a - b, c + b, c - a + b, c, c + a - b, c - b, c + a + b, c - a];
// 4칸 마방진: 잘 알려진 판 하나를 돌리고 뒤집고, 모든 칸에 같은 수를 더해 새 판을 만든다(합은 4배만큼 늘어난다).
const BASE4 = [16, 3, 2, 13, 5, 10, 11, 8, 9, 6, 7, 12, 4, 15, 14, 1];
export function magicSquare4(turns, flip, add, complement = false) {
  let grid = BASE4.map((v) => (complement ? 17 - v : v));
  const at = (g, r, c) => g[r * 4 + c];
  for (let t = 0; t < turns; t++) grid = Array.from({ length: 16 }, (_, i) => at(grid, 3 - (i % 4), Math.floor(i / 4)));
  if (flip) grid = Array.from({ length: 16 }, (_, i) => at(grid, Math.floor(i / 4), 3 - (i % 4)));
  return grid.map((v) => v + add);
}

// 줄 비교로 빈칸을 하나씩 찾는 풀이기. 아이가 쓰는 방법만 쓴다:
//  sum-line   세 수가 다 보이는 줄 → 한 줄의 합
//  sum-center 가운데 수 → 한 줄의 합 = 가운데 수 + 가운데 수 + 가운데 수 (3칸)
//  one-left   합을 알고, 빈칸이 하나 남은 줄 → 합 − 나머지 수
//  center-sum 합을 알면 가운데 수 = 합을 똑같이 셋으로 나눈 수 (3칸)
//  center-pair 가운데를 사이에 둔 두 수를 알면 가운데 수 = 두 수를 더해 반으로 (3칸)
//  overlap    두 줄이 한 칸을 같이 쓰면, 그 칸을 뺀 나머지 수끼리 합이 같다
// steps에는 사람이 읽을 설명을 만들 재료(어느 줄, 어떤 수)를 담는다. 화면 문장은 쓰는 쪽이 만든다.
// prefer: 구하려는 칸 — 여러 줄을 쓸 수 있으면 그 칸이 나오는 줄을 먼저 고른다(설명이 곧게 이어지게).
export function solveMagic(n, shown, { sum = null, maxSteps = 40, prefer = [] } = {}) {
  const values = shown.map((v) => (typeof v === "number" ? v : null));
  const lines = magicLines(n);
  const steps = [];
  let S = sum;
  const known = (i) => values[i] !== null;
  const lineSum = (line) => line.cells.reduce((s, i) => s + values[i], 0);
  const center = n === 3 ? 4 : -1;
  const opposite = (i) => 8 - i;
  for (let guard = 0; guard < maxSteps; guard++) {
    if (values.every((v) => v !== null) && S !== null) break;
    let progressed = false;
    if (S === null) {
      const full = lines.find((line) => line.cells.every(known));
      if (full) { S = lineSum(full); steps.push({ kind: "sum-line", line: full.id, cells: full.cells, sum: S }); progressed = true; }
      else if (n === 3 && known(center)) { S = values[center] * 3; steps.push({ kind: "sum-center", center: values[center], sum: S }); progressed = true; }
    }
    if (progressed) continue;
    if (S !== null) {
      const open = lines.filter((l) => l.cells.filter((i) => !known(i)).length === 1);
      const line = open.find((l) => l.cells.some((i) => !known(i) && prefer.includes(i))) || open[0];
      if (line) {
        const cell = line.cells.find((i) => !known(i));
        const others = line.cells.filter((i) => i !== cell).map((i) => values[i]);
        values[cell] = S - others.reduce((a, b) => a + b, 0);
        steps.push({ kind: "one-left", line: line.id, cells: line.cells, cell, others, sum: S, value: values[cell] });
        continue;
      }
      if (n === 3 && !known(center) && S % 3 === 0) {
        values[center] = S / 3;
        steps.push({ kind: "center-sum", cell: center, sum: S, value: values[center] });
        continue;
      }
    }
    if (n === 3 && !known(center)) {
      const pair = [0, 1, 2, 3].find((i) => known(i) && known(opposite(i)) && (values[i] + values[opposite(i)]) % 2 === 0);
      if (pair !== undefined) {
        values[center] = (values[pair] + values[opposite(pair)]) / 2;
        steps.push({ kind: "center-pair", cell: center, pair: [pair, opposite(pair)], others: [values[pair], values[opposite(pair)]], value: values[center] });
        continue;
      }
    }
    // 겹치는 칸: 두 줄의 합이 같으니 같이 쓰는 칸을 빼면 나머지끼리 합이 같다. 남는 빈칸이 하나면 구한다.
    const candidates = [];
    for (let a = 0; a < lines.length; a++) for (let b = a + 1; b < lines.length; b++) {
      const A = lines[a].cells, B = lines[b].cells;
      const shared = A.filter((i) => B.includes(i));
      if (!shared.length) continue;
      const onlyA = A.filter((i) => !B.includes(i)), onlyB = B.filter((i) => !A.includes(i));
      const unknown = [...onlyA, ...onlyB].filter((i) => !known(i));
      if (unknown.length !== 1) continue;
      const cell = unknown[0];
      const sideWith = onlyA.includes(cell) ? onlyA : onlyB, other = onlyA.includes(cell) ? onlyB : onlyA;
      const otherSum = other.reduce((s, i) => s + values[i], 0);
      const rest = sideWith.filter((i) => i !== cell).reduce((s, i) => s + values[i], 0);
      candidates.push({ kind: "overlap", lines: [lines[a].id, lines[b].id], shared, cell, with: sideWith.filter((i) => i !== cell), against: other, otherSum, rest, value: otherSum - rest });
    }
    const found = candidates.find((c) => prefer.includes(c.cell)) || candidates[0];
    if (found) { values[found.cell] = found.value; steps.push(found); continue; }
    break;
  }
  return { values, sum: S, steps, solved: values.every((v) => v !== null) };
}
export const magicSignature = (n, shown) => `${n}:${shown.map((v) => (typeof v === "number" ? v : "_")).join(",")}`;

function makeMagic(spec, kind, rand, avoid) {
  const n = kind === "big" ? 4 : 3;
  let full;
  if (n === 3) {
    const c = randInt(spec.center[0], spec.center[1], rand);
    const a = randInt(-spec.spread, spec.spread, rand), b = randInt(-spec.spread, spec.spread, rand);
    full = magicSquare3(c, a, b);
  } else full = magicSquare4(randInt(0, 3, rand), rand() < 0.5, randInt(0, spec.add ?? 4, rand), rand() < 0.5);
  if (new Set(full).size !== n * n || full.some((v) => v < 1 || v > 40)) return null;
  const S = isMagic(n, full);
  const blanksWanted = randInt(spec.blanks[0], spec.blanks[1], rand);
  const order = shuffle([...full.keys()], rand);
  let blanks = order.slice(0, blanksWanted);
  if (kind === "center-blank" && !blanks.includes(4)) blanks = [4, ...blanks.slice(0, -1)];
  if (kind === "center-given" && blanks.includes(4)) return null;
  const shown = full.map((v, i) => (blanks.includes(i) ? null : v));
  const sumShown = kind === "fill" || kind === "big";
  const solve = solveMagic(n, shown, { sum: sumShown ? S : null });
  if (!solve.solved || solve.values.some((v, i) => v !== full[i])) return null;
  if (kind === "overlap" && !solve.steps.some((s) => s.kind === "overlap")) return null;
  if (kind === "center-given" && !solve.steps.some((s) => s.kind === "sum-center")) return null;
  const sig = magicSignature(n, shown);
  if (avoid?.has(sig)) return null;
  const answers = blanks.map((i) => full[i]);
  // 덤 카드: 정답 근처의 수(판에 이미 있는 수·정답과 겹치지 않게). 가까운 수가 모자라면 범위를 넓힌다 — 카드 수는 늘 정답 + 덤.
  const decoys = [], wanted = spec.decoys ?? 0, top = Math.max(...full) + 6;
  const fresh = (v) => v > 0 && !answers.includes(v) && !decoys.includes(v) && !full.includes(v);
  for (const d of shuffle([-3, -2, -1, 1, 2, 3, 4], rand)) {
    if (decoys.length >= wanted) break;
    const v = answers[randInt(0, answers.length - 1, rand)] + d;
    if (fresh(v)) decoys.push(v);
  }
  for (const v of shuffle(Array.from({ length: top }, (_, i) => i + 1), rand)) { if (decoys.length >= wanted) break; if (fresh(v)) decoys.push(v); }
  return { kind, n, shown, full, sum: S, sumShown, blanks: [...blanks].sort((x, y) => x - y), cards: shuffle([...answers, ...decoys], rand), steps: solve.steps, key: `${kind}:${sig}` };
}
// 채운 판이 마방진이면 정답(만든 답과 달라도, 모든 줄의 합이 같고 보인 합과 맞으면 인정).
export function checkMagic(p, values) {
  if (values.some((v) => !Number.isInteger(v))) return { correct: false, complete: false };
  const s = isMagic(p.n, values);
  return { correct: s !== null && (!p.sumShown || s === p.sum), complete: true, sum: s };
}
// 줄마다 지금의 합과 상태(다 찼는지, 정답 합과 같은지) — 3D 판의 줄 불빛과 HTML 표가 같이 쓴다.
// 빈칸이 없는 줄(처음부터 다 보이는 줄)은 불을 켜지 않는다(open: false). 아이가 채운 줄만 빛난다.
export function magicLineStates(p, values) {
  return magicLines(p.n).map((line) => {
    const open = line.cells.some((i) => p.blanks.includes(i));
    const full = line.cells.every((i) => Number.isInteger(values[i]));
    const sum = full ? line.cells.reduce((s, i) => s + values[i], 0) : null;
    return { ...line, open, full, sum, ok: full && sum === p.sum };
  });
}
export const MAGIC = {
  id: "b9-magic", title: "숫자 유리창",
  avoid: new Set(),
  levels: [
    { title: "한 칸 채우기", rule: "한 줄의 합이 보여요. 빈칸 하나를 채워 모든 줄의 합을 같게 해요.", count: 5, mix: { fill: 1 }, blanks: [1, 1], decoys: 2, center: [4, 8], spread: 3 },
    { title: "두 칸 채우기", rule: "빈칸이 두 개예요. 빈칸이 하나만 남은 줄부터 채워요.", count: 5, mix: { fill: 1 }, blanks: [2, 2], decoys: 2, center: [4, 9], spread: 3 },
    { title: "가운데 수의 비밀", rule: "한 줄의 합이 숨었어요. 가운데 수를 세 번 더하면 한 줄의 합이에요.", count: 5, mix: { "center-given": 1 }, blanks: [4, 4], decoys: 1, center: [4, 10], spread: 4 },
    { title: "가운데 빈칸", rule: "가운데가 비었어요. 가운데를 사이에 둔 두 수를 더하면 가운데 수를 두 번 더한 것과 같아요.", count: 5, mix: { "center-blank": 1 }, blanks: [2, 3], decoys: 1, center: [4, 10], spread: 4 },
    { title: "겹치는 칸", rule: "두 줄이 함께 쓰는 칸을 찾아, 나머지 수끼리 비교해요.", count: 5, mix: { overlap: 1 }, blanks: [5, 6], decoys: 1, center: [5, 11], spread: 4 },
    { title: "네 칸 채우기", rule: "빈칸이 네 개예요. 구할 수 있는 칸부터 차례로!", count: 6, mix: { find: 1 }, blanks: [4, 4], decoys: 1, center: [5, 11], spread: 5 },
    { title: "다섯 칸 채우기", rule: "빈칸이 다섯 개예요. 줄 불빛을 보며 맞춰요.", count: 6, mix: { find: 1, overlap: 1 }, blanks: [5, 5], decoys: 1, center: [5, 12], spread: 5 },
    { title: "여섯 칸 채우기", rule: "보이는 수가 세 개뿐이에요.", count: 6, mix: { find: 1 }, blanks: [6, 6], decoys: 0, center: [5, 12], spread: 5 },
    { title: "큰 숫자 유리창", rule: "네 칸 마방진! 한 줄의 합을 보고 빈칸을 채워요.", count: 6, mix: { big: 1 }, blanks: [3, 3], decoys: 1, add: 3 },
    { title: "유리창 마스터", rule: "세 칸과 네 칸 마방진이 섞여요.", count: 8, mix: { find: 1, overlap: 1, big: 1 }, blanks: [4, 5], decoys: 1, center: [6, 12], spread: 5, add: 5 }
  ],
  endless: (level) => ({ ...endlessOf(10)(level), mix: { find: 1, overlap: 1, big: 1 }, blanks: [5, 6], decoys: 1, center: [6, 13], spread: 6, add: 6 }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      // 4칸은 빈칸을 3~4개만(줄 비교로 풀리는 판만 낸다).
      const s = kind === "big" ? { ...spec, blanks: [3, Math.min(4, spec.blanks[1])] } : spec;
      for (let t = 0; t < 400; t++) { const p = makeMagic(s, kind, rand, this.avoid); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, values) => checkMagic(p, values).correct
};

export const BOOK09_GAMES = Object.freeze({ "b9-cubes": CUBES, "b9-magic": MAGIC });
