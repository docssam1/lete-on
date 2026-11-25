// 1과정 4권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK04_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK04_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK04_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK04_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)

import { shapeSvg } from "./book02-renderers.js?v=20261101m";

// ── 공용 ─────────────────────────────────────────────

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[Math.floor(Math.random() * list.length)];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

const hasBatchim = (word) => {
  const text = String(word).replace(/[^0-9a-zA-Z가-힣]+$/u, "");
  const last = text[text.length - 1] || "";
  if (/[0-9]/.test(last)) return [0, 1, 3, 6, 7, 8].includes(Number(last));
  if (/[a-zA-Z]/.test(last)) return /[lmnLMN]/.test(last);
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
};
// 조사: 받침 있으면 앞, 없으면 뒤.
const josa = (word, withBatchim, without) => `${word}${hasBatchim(word) ? withBatchim : without}`;

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const FONT = "font-family:'Noto Sans KR',sans-serif";
const rowWrap = (items) => `<div style="display:flex;flex-wrap:wrap;gap:10px 22px;justify-content:center;align-items:flex-end">${items.join("")}</div>`;

// ── 3단원 · 섞인 접시 양팔저울(바꾸어 넣고 같은 것 덜어 내기) ─────────
// 교재 활동 2·확인 2·연습 11~16·도전 3, 4: 한 접시에 여러 가지 물건이 섞여 놓인 저울 두세 개.
// 아이 생각: ① 한쪽이 한 가지 물건뿐인 저울로 그 물건을 다른 저울에서 바꾸어 넣는다
//            ② 양쪽에 같은 물건이 있으면 같은 개수만큼 덜어 낸다 ③ 모두 같은 수로 나눌 수 있으면 나눈다.
// 이 세 가지로 「묻는 물건 1개 = 다른 물건 몇 개」가 나와야 낸다(그리고 저울 식으로 그 비가 하나로 정해져야 한다).

const BAL_KINDS = Object.freeze(["circle", "square", "diamond", "star"]);
const BAL_NAME = Object.freeze({ circle: "동그라미", square: "네모", diamond: "마름모", star: "별" });

function eqNormalize(left, right) {
  const L = { ...left };
  const R = { ...right };
  for (const kind of Object.keys(L)) {
    if (R[kind]) {
      const m = Math.min(L[kind], R[kind]);
      L[kind] -= m;
      R[kind] -= m;
    }
  }
  for (const side of [L, R]) for (const kind of Object.keys(side)) if (!side[kind]) delete side[kind];
  const g = [...Object.values(L), ...Object.values(R)].reduce((a, b) => gcd(a, b), 0) || 1;
  for (const side of [L, R]) for (const kind of Object.keys(side)) side[kind] /= g;
  return { L, R };
}

const sideKey = (side) => Object.keys(side).sort().map((k) => `${k}${side[k]}`).join("+");
const eqKey = ({ L, R }) => [sideKey(L), sideKey(R)].sort().join("=");
const sideText = (side) => Object.keys(side).map((k) => `${BAL_NAME[k]} ${side[k]}개`).join("와 ");
const sideTextShort = (side) => Object.keys(side).map((k) => `${BAL_NAME[k]} ${side[k]}`).join(" + ");
const eqText = (eq) => `${sideTextShort(eq.L)} = ${sideTextShort(eq.R)}`;
const sideWeight = (side, w) => Object.keys(side).reduce((t, k) => t + side[k] * w[k], 0);

// 행렬 계수(정수, 작은 수라 소수 소거로 충분).
function rankOf(rows) {
  const m = rows.map((row) => [...row]);
  let rank = 0;
  const cols = m[0]?.length || 0;
  for (let c = 0; c < cols && rank < m.length; c += 1) {
    let p = -1;
    for (let r = rank; r < m.length; r += 1) if (Math.abs(m[r][c]) > 1e-9) { p = r; break; }
    if (p < 0) continue;
    [m[rank], m[p]] = [m[p], m[rank]];
    for (let r = 0; r < m.length; r += 1) {
      if (r === rank) continue;
      const f = m[r][c] / m[rank][c];
      for (let k = c; k < cols; k += 1) m[r][k] -= f * m[rank][k];
    }
    rank += 1;
  }
  return rank;
}

function ratioDetermined(eqs, kinds, target, unit, ratio) {
  const rowOf = (eq) => kinds.map((k) => (eq.L[k] || 0) - (eq.R[k] || 0));
  const rows = eqs.map(rowOf);
  const extra = kinds.map((k) => (k === target ? 1 : 0) - (k === unit ? ratio : 0));
  return rankOf(rows) === rankOf([...rows, extra]);
}

// 아이가 하는 바꾸어 넣기만으로 「target a개 = unit b개」까지 가는 가장 짧은 길.
function childSolve(eqs, target, unit, maxScale = 3) {
  const start = eqs.map((eq, i) => ({ ...eqNormalize(eq.L, eq.R), name: `[그림${i + 1}]`, from: null }));
  const isGoal = (eq) => {
    const kl = Object.keys(eq.L);
    const kr = Object.keys(eq.R);
    if (kl.length !== 1 || kr.length !== 1) return false;
    const pair = new Set([kl[0], kr[0]]);
    return pair.has(target) && pair.has(unit) && kl[0] !== kr[0];
  };
  const direct = start.find(isGoal);
  if (direct) return { steps: [], goal: direct, direct: true };
  let frontier = [{ list: start, path: [] }];
  for (let depth = 0; depth < 3; depth += 1) {
    const next = [];
    for (const state of frontier) {
      const keys = new Set(state.list.map(eqKey));
      for (const a of state.list) {
        // a의 한쪽이 한 가지 물건(kind × k)일 때 그 묶음을 다른 저울에서 바꾸어 넣는다.
        for (const [single, other] of [[a.L, a.R], [a.R, a.L]]) {
          const ks = Object.keys(single);
          if (ks.length !== 1) continue;
          const kind = ks[0];
          const k = single[kind];
          for (const b of state.list) {
            if (b === a) continue;
            for (const sideName of ["L", "R"]) {
              const m = b[sideName][kind] || 0;
              if (!m) continue;
              for (let f = 1; f <= maxScale; f += 1) {
                if ((m * f) % k) continue;
                const times = (m * f) / k;
                const scaleSide = (side) => Object.fromEntries(Object.entries(side).map(([kk, n]) => [kk, n * f]));
                const nb = { L: scaleSide(b.L), R: scaleSide(b.R) };
                delete nb[sideName][kind];
                for (const [kk, n] of Object.entries(other)) nb[sideName][kk] = (nb[sideName][kk] || 0) + n * times;
                const raw = { L: { ...nb.L }, R: { ...nb.R } };
                const norm = eqNormalize(nb.L, nb.R);
                if (!Object.keys(norm.L).length || !Object.keys(norm.R).length) continue;
                const key = eqKey(norm);
                if (keys.has(key)) continue;
                const made = { ...norm, name: null, from: { a, b, f, kind, k, times, raw } };
                const path = [...state.path, made];
                if (isGoal(made)) return { steps: path, goal: made, direct: false };
                next.push({ list: [...state.list, made], path });
              }
              break;
            }
          }
        }
      }
    }
    frontier = next.slice(0, 400);
    if (!frontier.length) break;
  }
  return null;
}

function randomPan(kinds, maxPan, maxKinds) {
  const use = shuffle(kinds).slice(0, randomInt(1, Math.min(maxKinds, kinds.length)));
  const pan = {};
  let total = 0;
  for (const kind of use) {
    const n = randomInt(1, 3);
    if (total + n > maxPan) break;
    pan[kind] = n;
    total += n;
  }
  if (!total) pan[use[0]] = 1;
  return pan;
}

function matchingPans(kinds, weights, sum, maxPan, maxKinds) {
  const found = [];
  const walk = (index, pan, total, items) => {
    if (total > sum || items > maxPan) return;
    if (index === kinds.length) {
      if (total === sum && items > 0 && Object.keys(pan).length <= maxKinds) found.push({ ...pan });
      return;
    }
    const kind = kinds[index];
    for (let n = 0; n <= maxPan - items; n += 1) {
      if (n) pan[kind] = n; else delete pan[kind];
      walk(index + 1, pan, total + n * weights[kind], items + n);
    }
    delete pan[kind];
  };
  walk(0, {}, 0, 0);
  return found;
}

function makeBalanceSystem({ shapes, balances, maxPan, maxWeight, needCancel, maxScale = 1, maxItems = 14 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const kinds = shuffle(BAL_KINDS).slice(0, shapes);
    const weights = {};
    kinds.forEach((kind) => { weights[kind] = randomInt(1, maxWeight); });
    if (new Set(Object.values(weights)).size < Math.min(3, shapes)) continue;
    const eqs = [];
    let bad = false;
    for (let b = 0; b < balances && !bad; b += 1) {
      let made = null;
      for (let t = 0; t < 30 && !made; t += 1) {
        const left = randomPan(kinds, maxPan, 2);
        const options = matchingPans(kinds, weights, sideWeight(left, weights), maxPan, 3)
          .filter((right) => sideKey(right) !== sideKey(left));
        if (!options.length) continue;
        const right = pick(options);
        const norm = eqNormalize(left, right);
        if (!Object.keys(norm.L).length) continue;
        // 한쪽이 한 가지 물건뿐인데 그 물건이 반대쪽에도 있으면(네모 4 = 네모 3 + 마름모 1) 억지스럽다.
        const lonely = (one, two) => Object.keys(one).length === 1 && two[Object.keys(one)[0]];
        if (lonely(left, right) || lonely(right, left)) continue;
        if (eqs.some((eq) => eqKey(eqNormalize(eq.L, eq.R)) === eqKey(norm))) continue;
        made = Math.random() < 0.5 ? { L: left, R: right } : { L: right, R: left };
      }
      if (!made) bad = true; else eqs.push(made);
    }
    if (bad) continue;
    // 저울마다 쓸모가 있어야 한다: 저울 식이 서로 따로 서야 한다.
    const rows = eqs.map((eq) => kinds.map((k) => (eq.L[k] || 0) - (eq.R[k] || 0)));
    if (rankOf(rows) < eqs.length) continue;
    const pairs = [];
    for (const target of kinds) for (const unit of kinds) {
      if (target === unit) continue;
      const ratio = weights[target] / weights[unit];
      if (!Number.isInteger(ratio) || ratio < 2 || ratio > 9) continue;
      if (!ratioDetermined(eqs, kinds, target, unit, ratio)) continue;
      pairs.push({ target, unit, ratio });
    }
    for (const pair of shuffle(pairs)) {
      const solved = childSolve(eqs, pair.target, pair.unit, maxScale);
      if (!solved || solved.direct) continue;
      if (solved.steps.length < Math.min(balances - 1, 2) && balances > 2) continue;
      // 모든 저울을 써야 풀리는 문제만(쓰지 않는 저울이 있으면 다른 것을 뽑는다).
      const tooMany = solved.steps.some((step) => [step.from.raw.L, step.from.raw.R].some((side) => Object.values(side).reduce((a, b) => a + b, 0) > maxItems));
      if (tooMany) continue;
      const used = new Set();
      const mark = (eq) => { if (!eq) return; if (eq.name) used.add(eq.name); if (eq.from) { mark(eq.from.a); mark(eq.from.b); } };
      mark(solved.goal);
      if (used.size !== balances) continue;
      const cancels = solved.steps.some((step) => eqKey(step) !== eqKey({ L: step.from.raw.L, R: step.from.raw.R }))
        || eqs.some((eq) => Object.keys(eq.L).some((k) => eq.R[k]));
      if (needCancel && !cancels) continue;
      return { kinds, weights, eqs, ...pair, solved };
    }
  }
  return null;
}

function balanceSvg(eq, caption) {
  const W = 232;
  const H = 128;
  const beamY = 86;
  const pan = (side, cx) => {
    const list = Object.entries(side).flatMap(([kind, n]) => Array.from({ length: n }, () => kind));
    const perRow = list.length > 6 ? 4 : 3;
    const r = 10;
    const rows = [];
    for (let i = 0; i < list.length; i += perRow) rows.push(list.slice(i, i + perRow));
    let shapes = "";
    rows.forEach((row, ri) => {
      row.forEach((kind, ci) => {
        const x = cx + (ci - (row.length - 1) / 2) * r * 2.25;
        const y = beamY - 14 - r - ri * r * 2.15;
        shapes += shapeSvg(kind, x, y, r);
      });
    });
    return `<ellipse cx="${cx}" cy="${beamY - 8}" rx="40" ry="6" fill="#f4f6f7" stroke="#6b7680" stroke-width="1.3"/>`
      + `<path d="M${cx - 30} ${beamY - 4}V${beamY}H${cx + 30}V${beamY - 4}" fill="none" stroke="#6b7680" stroke-width="1.3"/>${shapes}`;
  };
  const cap = caption ? `<text x="${W / 2}" y="${H - 2}" text-anchor="middle" font-size="12" fill="#3b4148" style="${FONT}">${esc(caption)}</text>` : "";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="수평인 양팔저울">`
    + `<path d="M${W / 2} ${beamY}L${W / 2 - 13} ${beamY + 22}H${W / 2 + 13}Z" fill="#cfe3ea" stroke="#5f8b99" stroke-width="1.3"/>`
    + `<path d="M${W / 2 - 86} ${beamY}H${W / 2 + 86}" stroke="#6b7680" stroke-width="2.4" stroke-linecap="round"/>`
    + pan(eq.L, W / 2 - 62) + pan(eq.R, W / 2 + 62) + cap + `</svg>`;
}

// 한 식을 덜어 내기·나누기로 줄일 때 무엇을 했는지 아이 말로.
function tidyWords(raw) {
  const cancelled = Object.keys(raw.L).some((k) => raw.R[k]);
  const L = { ...raw.L };
  const R = { ...raw.R };
  for (const k of Object.keys(L)) if (R[k]) { const m = Math.min(L[k], R[k]); L[k] -= m; R[k] -= m; }
  const g = [...Object.values(L), ...Object.values(R)].filter(Boolean).reduce((a, b) => gcd(a, b), 0);
  const parts = [];
  if (cancelled) parts.push("양쪽에서 같은 물건을 같은 개수만큼 덜어 내면");
  if (g > 1) parts.push(`${cancelled ? "남은 것을 " : "양쪽을 "}똑같이 ${g}묶음으로 나누면`);
  return parts.join(" ");
}

function balanceSolutionText(made) {
  const lines = [];
  const show = (eq) => `${sideText(eq.L)} = ${sideText(eq.R)}`;
  const labels = new Map();
  made.eqs.forEach((eq, i) => {
    const words = tidyWords(eq);
    if (words) lines.push(`[그림${i + 1}]의 ${words} ${show(eqNormalize(eq.L, eq.R))}입니다.`);
  });
  const nameOf = (eq) => eq.name || labels.get(eq) || "앞의 식";
  made.solved.steps.forEach((step, index) => {
    const { a, b, f, kind, k, times, raw } = step.from;
    const single = Object.keys(a.L).length === 1 && a.L[kind] === k ? a.R : a.L;
    const swapIn = Object.fromEntries(Object.entries(single).map(([kk, n]) => [kk, n * times]));
    const bName = nameOf(b);
    const where = f > 1 ? `${josa(bName, "을", "를")} 모두 ${f}배로 늘린 뒤` : `${bName}에서`;
    lines.push(`${nameOf(a)}에서 ${BAL_NAME[kind]} ${k}개 = ${sideText(single)}이므로, ${where} ${BAL_NAME[kind]} ${k * times}개를 ${sideText(swapIn)}로 바꾸어 넣으면 ${show(raw)}입니다.`);
    const words = tidyWords(raw);
    const label = ["㉮", "㉯", "㉰"][index] || "";
    labels.set(step, `식 ${label}`);
    if (words) lines.push(`${words} ${show(step)}입니다(식 ${label}).`);
    else lines.push(`이것을 식 ${label}라고 합니다.`);
  });
  lines.push(`따라서 ${BAL_NAME[made.target]} 1개는 ${BAL_NAME[made.unit]} ${made.ratio}개의 무게와 같습니다.`);
  return lines.join(" ");
}

function mixedPanBalance({ difficulty = 2 } = {}, spec) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const made = makeBalanceSystem({
    shapes: spec.balances === 3 ? 4 : pick(d === 1 ? [3] : [3, 4]),
    balances: spec.balances,
    maxPan: d === 1 ? 4 : d === 3 ? 7 : 6,
    maxWeight: d === 1 ? 6 : 9,
    needCancel: spec.needCancel ?? d >= 2,
    maxScale: d === 3 ? 2 : 1,
    maxItems: d === 3 ? 16 : 12
  });
  if (!made) return null;
  const figs = made.eqs.map((eq, i) => balanceSvg(eq, `[그림${i + 1}]`));
  return {
    prompt: `다음 그림의 양팔저울은 모두 수평입니다. ${BAL_NAME[made.target]} 1개는 ${BAL_NAME[made.unit]} 몇 개의 무게와 같을까요?`,
    answer: `${made.ratio}개`,
    solution: balanceSolutionText(made),
    visual: { kind: "fig", html: rowWrap(figs) },
    meta: {
      family: "mixed-pan-balance-b4",
      balances: made.eqs.map((eq) => ({ left: eq.L, right: eq.R })),
      target: made.target,
      unit: made.unit,
      answer: made.ratio,
      steps: made.solved.steps.length
    }
  };
}

// ── 3단원 · 차를 이어 두 사이의 차 구하기(갈래·「−」) ──────────────
// 교재 활동 1·연습 3~6: 네 모양 사이의 식 세 개가 한 줄로 차례대로 이어져 있지 않고(순서가 섞이거나 갈래가 나고)
// 「−」 식도 섞여 있다. 연습 7~10·확인 1-2: 같은 꼴을 몸무게·구슬·달리기 위치·막대 길이 장면으로, 아래에 이름 표가 있다.
// 아이 생각: 한 사람(모양)을 어떤 수로 정해 두고(예: 20) 식을 따라 나머지를 차례로 구한 뒤 두 수의 차를 뺀다.

// 네 개를 잇는 식 세 개(나무 꼴)를 뽑는다. values: 숨은 값, edges: [큰 쪽/작은 쪽, 차].
function makeRelationTree({ maxDiff, needMinus, needShuffle, minDistance = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const star = Math.random() < 0.35;
    const order = shuffle([0, 1, 2, 3]);
    const pairs = star ? [[order[0], order[1]], [order[0], order[2]], [order[0], order[3]]] : [[order[0], order[1]], [order[1], order[2]], [order[2], order[3]]];
    const values = [null, null, null, null];
    values[order[0]] = 30;
    const edges = [];
    for (const [a, b] of pairs) {
      const d = randomInt(2, maxDiff);
      values[b] = values[a] + (Math.random() < 0.5 ? d : -d);
      edges.push({ a, b, d });
    }
    if (new Set(values).size < 4) continue;
    // 식: 왼쪽 = 오른쪽 ± d. 어느 쪽을 왼쪽에 둘지는 섞는다.
    const eqs = shuffle(edges).map(({ a, b, d }) => {
      const [left, right] = Math.random() < 0.5 ? [a, b] : [b, a];
      return { left, right, d, sign: values[left] > values[right] ? "+" : "-" };
    });
    const minus = eqs.filter((eq) => eq.sign === "-").length;
    if (needMinus && !minus) continue;
    if (minus === 3) continue;
    // 차례대로 이어진 사슬(앞 식의 오른쪽 = 다음 식의 왼쪽)이면 섞인 꼴이 아니다.
    const chained = eqs.every((eq, i) => i === 0 || eq.left === eqs[i - 1].right);
    if (needShuffle && chained) continue;
    const adj = new Map([0, 1, 2, 3].map((i) => [i, []]));
    edges.forEach(({ a, b }) => { adj.get(a).push(b); adj.get(b).push(a); });
    const dist = (from) => {
      const seen = new Map([[from, 0]]);
      const queue = [from];
      while (queue.length) { const x = queue.shift(); for (const y of adj.get(x)) if (!seen.has(y)) { seen.set(y, seen.get(x) + 1); queue.push(y); } }
      return seen;
    };
    const targets = [];
    for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) if (dist(i).get(j) >= minDistance) targets.push([i, j]);
    if (!targets.length) continue;
    const [x, y] = pick(targets);
    const answer = Math.abs(values[x] - values[y]);
    if (!answer || eqs.some((eq) => eq.d === answer)) continue;
    return { values, eqs, target: Math.random() < 0.5 ? [x, y] : [y, x], answer, star };
  }
  return null;
}

// 한 사람을 기준 수로 두고 식을 따라 차례로 값을 구하는 풀이 줄.
function treeWalk(tree, base) {
  const known = new Map([[tree.target[0], base]]);
  const order = [];
  let guard = 0;
  while (known.size < 4 && guard < 10) {
    guard += 1;
    for (const eq of tree.eqs) {
      const delta = eq.sign === "+" ? eq.d : -eq.d; // left = right + delta
      if (known.has(eq.right) && !known.has(eq.left)) { known.set(eq.left, known.get(eq.right) + delta); order.push({ eq, solved: eq.left }); }
      else if (known.has(eq.left) && !known.has(eq.right)) { known.set(eq.right, known.get(eq.left) - delta); order.push({ eq, solved: eq.right }); }
    }
  }
  return { known, order };
}

const DIFF_SHAPES = Object.freeze([
  { kind: "circle", name: "동그라미" },
  { kind: "diamond", name: "마름모" },
  { kind: "square", name: "네모" },
  { kind: "triangle", name: "세모" }
]);

function diffEquationSvg(eqs, shapes) {
  const W = 230;
  const rowH = 40;
  const H = eqs.length * rowH + 20;
  let body = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="#e3f1f4" stroke="#b7d6de" stroke-width="1"/>`;
  eqs.forEach((eq, i) => {
    const y = 10 + i * rowH + rowH / 2;
    body += shapeSvg(shapes[eq.left].kind, 62, y, 12, { hollow: true });
    body += `<text x="92" y="${y + 6}" text-anchor="middle" font-size="18" fill="#222" style="${FONT}">=</text>`;
    body += shapeSvg(shapes[eq.right].kind, 122, y, 12, { hollow: true });
    body += `<text x="148" y="${y + 6}" font-size="18" fill="#222" style="${FONT}">${eq.sign === "+" ? "+" : "−"} ${eq.d}</text>`;
  });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="네 모양의 크기를 비교한 식">${body}</svg>`;
}

function shapeDifferenceTree({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const tree = makeRelationTree({ maxDiff: d === 1 ? 7 : 9, needMinus: d >= 2, needShuffle: true, minDistance: d === 3 ? 3 : 2 })
    || makeRelationTree({ maxDiff: 9, needMinus: true, needShuffle: true, minDistance: 2 });
  if (!tree) return null;
  const shapes = shuffle(DIFF_SHAPES);
  const [x, y] = tree.target;
  const base = 20;
  const walk = treeWalk(tree, base);
  const nameOf = (i) => shapes[i].name;
  const steps = walk.order.map(({ eq, solved }) => `${nameOf(eq.left)} = ${nameOf(eq.right)} ${eq.sign === "+" ? "+" : "−"} ${eq.d}이므로 ${nameOf(solved)}는 ${walk.known.get(solved)}입니다.`);
  const big = Math.max(walk.known.get(x), walk.known.get(y));
  const small = Math.min(walk.known.get(x), walk.known.get(y));
  return {
    prompt: `다음은 동그라미, 마름모, 네모, 세모가 나타내는 수의 크기를 비교한 식입니다. ${josa(nameOf(x), "과", "와")} ${nameOf(y)}가 나타내는 수의 차를 구하세요.`,
    answer: String(tree.answer),
    solution: `${josa(nameOf(x), "을", "를")} ${base}이라고 두고 식을 따라 차례로 구합니다. ${steps.join(" ")} 따라서 ${josa(nameOf(x), "과", "와")} ${nameOf(y)}의 차는 ${big} − ${small} = ${tree.answer}입니다.`,
    visual: { kind: "fig", html: rowWrap([diffEquationSvg(tree.eqs, shapes)]) },
    meta: { family: "shape-difference-tree-b4", equations: tree.eqs.map((eq) => `${nameOf(eq.left)}=${nameOf(eq.right)}${eq.sign}${eq.d}`), target: [nameOf(x), nameOf(y)], answer: tree.answer, star: tree.star }
  };
}

// ㉠~㉣은 받침 있는 글자로 읽힌다(기역·니은·디귿·리을) — 조사는 받침 쪽.
const josaName = (name, withBatchim, without) => (/^[㉠-㉭]$/u.test(name) ? `${name}${withBatchim}` : josa(name, withBatchim, without));

// 장면: 몸무게·구슬·달리기 위치·벌레 달리기·막대 길이.
const DIFF_SCENES = Object.freeze([
  { id: "weight", names: ["소율", "준서", "예린", "한결", "다은", "로운", "가온", "수호"], unit: "kg", intro: (n) => `${n.join(", ")} 네 사람의 몸무게를 비교하였더니 다음과 같았습니다.`, ask: (a, b) => `${josaName(a, "과", "와")} ${b}의 몸무게는 몇 kg 차이가 나는지 구하세요.`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}kg 더 ${up ? "무겁습니다" : "가볍습니다"}.` },
  { id: "marbles", names: ["서아", "민재", "다온", "유찬", "시우", "하린", "은호", "주아"], unit: "개", intro: (n) => `${n.join(", ")} 네 명이 가진 구슬의 개수를 비교하였더니 다음과 같았습니다.`, ask: (a, b) => `${josaName(a, "과", "와")} ${josaName(b, "이", "가")} 가진 구슬은 몇 개 차이가 나는지 구하세요.`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 구슬이 ${d}개 ${up ? "많습니다" : "적습니다"}.` },
  { id: "race", names: ["태오", "라희", "지안", "도하", "윤슬", "이준", "채아", "건우"], unit: "m", intro: (n) => `${n.join(", ")} 네 명이 달리기를 하고 있습니다.`, ask: (a, b) => `지금 ${josaName(a, "과", "와")} ${b} 사이의 거리는 몇 m인지 구하세요.`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}m ${up ? "앞에" : "뒤에"} 있습니다.` },
  { id: "bugs", names: ["달팽이", "무당벌레", "메뚜기", "사마귀", "풍뎅이", "애벌레"], unit: "cm", intro: (n) => `${n.slice(0, -1).join(", ")}, ${josaName(n[n.length - 1], "이", "가")} 달리기 시합을 합니다.`, ask: (a, b) => `지금 ${josaName(a, "과", "와")} ${b} 사이의 거리는 몇 cm인지 구하세요.`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}cm ${up ? "앞에" : "뒤에"} 있습니다.` },
  { id: "sticks", names: ["㉠", "㉡", "㉢", "㉣"], fixed: true, unit: "cm", intro: () => "네 막대 ㉠, ㉡, ㉢, ㉣의 길이를 비교하였더니 다음과 같았습니다.", ask: (a, b) => `막대 ${josaName(a, "과", "와")} ${b}의 길이는 몇 cm 차이가 나는지 구하세요.`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}cm 더 ${up ? "깁니다" : "짧습니다"}.` }
]);

function measurementTableHtml(clues, names) {
  const cell = "border:1px solid #9cbcc6;padding:6px 4px;min-width:58px;text-align:center";
  const list = `<ul style="margin:0 0 10px;padding:10px 16px 10px 30px;background:#e3f1f4;border-radius:12px;line-height:1.75;${FONT};font-size:15px;color:#1f2a30;text-align:left">${clues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
  const table = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:15px"><tr>${names.map((n) => `<th style="${cell};background:#dcedf2;font-weight:600">${esc(n)}</th>`).join("")}</tr><tr>${names.map(() => `<td style="${cell};height:30px"></td>`).join("")}</tr></table>`;
  return `<div style="display:inline-block;max-width:100%">${list}${table}</div>`;
}

function measurementRelativeDifference({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const scene = pick(DIFF_SCENES);
  const tree = makeRelationTree({ maxDiff: d === 1 ? 7 : 9, needMinus: d >= 2, needShuffle: true, minDistance: d === 3 ? 3 : 2 })
    || makeRelationTree({ maxDiff: 9, needMinus: false, needShuffle: true, minDistance: 2 });
  if (!tree) return null;
  const names = scene.fixed ? [...scene.names] : shuffle(scene.names).slice(0, 4);
  const clues = tree.eqs.map((eq) => scene.clue(names[eq.left], names[eq.right], eq.d, eq.sign === "+"));
  const [x, y] = tree.target;
  const base = 20;
  const walk = treeWalk(tree, base);
  const tableOrder = shuffle([0, 1, 2, 3]).map((i) => names[i]);
  const u = scene.unit;
  const big = Math.max(walk.known.get(x), walk.known.get(y));
  const small = Math.min(walk.known.get(x), walk.known.get(y));
  return {
    prompt: `${scene.intro(names)} ${scene.ask(names[x], names[y])}`,
    answer: `${tree.answer}${u}`,
    solution: `${josaName(names[x], "을", "를")} ${base}${u}${u === "kg" ? "이라고" : "라고"} 두고 조건을 따라 차례로 구하면 ${walk.order.map(({ solved }) => `${names[solved]} ${walk.known.get(solved)}${u}`).join(", ")}입니다. 따라서 ${josaName(names[x], "과", "와")} ${names[y]}의 차는 ${big} − ${small} = ${tree.answer}${u}입니다.`,
    visual: { kind: "fig", html: measurementTableHtml(clues, tableOrder) },
    meta: { family: "measurement-relative-difference-b4", scene: scene.id, clues, target: [names[x], names[y]], answer: tree.answer }
  };
}

// ── 1단원 · 폴리오미노로 영역 나누기(트로미노·테트로미노·펜토미노) ─────────
// 교재 활동 1-4·연습 2, 3, 4, 6: 칸으로 된 도형을 정해진 칸 수의 조각 몇 개로 나누어 그린다.
//   활동 1-4  펜토미노 2조각(조각 모양은 달라도 됨) · 연습 4  같은 모양 테트로미노 2조각
//   연습 2    같은 모양 트로미노 4조각 · 연습 3  같은 모양 테트로미노 3조각 · 연습 6  보여 준 펜토미노 4조각
// 나누는 방법이 하나뿐인 도형만 낸다(빠짐없이 덮는 방법을 모두 세어 확인). 그리는 문제라 답은 그림.

const POLY_BASE = Object.freeze({
  3: { I: [[0, 0], [0, 1], [0, 2]], L: [[0, 0], [1, 0], [1, 1]] },
  4: { I: [[0, 0], [0, 1], [0, 2], [0, 3]], O: [[0, 0], [0, 1], [1, 0], [1, 1]], T: [[0, 0], [0, 1], [0, 2], [1, 1]], L: [[0, 0], [1, 0], [2, 0], [2, 1]], S: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  5: {
    F: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]], I: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], L: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]],
    N: [[0, 1], [1, 1], [2, 0], [2, 1], [3, 0]], P: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]], T: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
    U: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]], V: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], W: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    X: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], Y: [[0, 1], [1, 0], [1, 1], [2, 1], [3, 1]], Z: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]]
  }
});
const POLY_WORD = Object.freeze({ 3: "트로미노", 4: "테트로미노", 5: "펜토미노" });
const KOR_COUNT = Object.freeze({ 2: "두", 3: "세", 4: "네", 5: "다섯" });

function polyNormalize(cells) {
  const r0 = Math.min(...cells.map(([r]) => r));
  const c0 = Math.min(...cells.map(([, c]) => c));
  return cells.map(([r, c]) => [r - r0, c - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
const polyKey = (cells) => polyNormalize(cells).map(([r, c]) => `${r},${c}`).join(";");

// 돌리고 뒤집은 모든 놓임(겹치는 것은 하나로).
function polyOrientations(cells) {
  const out = new Map();
  let cur = cells;
  for (let flip = 0; flip < 2; flip += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      cur = cur.map(([r, c]) => [c, -r]);
      const norm = polyNormalize(cur);
      out.set(polyKey(norm), norm);
    }
    cur = cur.map(([r, c]) => [r, -c]);
  }
  return [...out.values()];
}

const POLY_ORIENTS = Object.fromEntries(Object.entries(POLY_BASE).map(([size, shapes]) => [size, Object.fromEntries(Object.entries(shapes).map(([id, cells]) => [id, polyOrientations(cells)]))]));

// 영역(칸 집합)을 주어진 놓임들로 빈틈없이 덮는 방법의 수(limit에서 멈춤). 덮은 조각 목록도 하나 돌려준다.
function countTilings(region, orientsByShape, { same, limit = 2 } = {}) {
  const cellSet = new Set(region.map(([r, c]) => `${r},${c}`));
  const ordered = [...region].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let count = 0;
  let first = null;
  const used = new Set();
  const pieces = [];
  const shapeIds = Object.keys(orientsByShape);
  const run = (fixedShape) => {
    if (count >= limit) return;
    const empty = ordered.find(([r, c]) => !used.has(`${r},${c}`));
    if (!empty) {
      count += 1;
      if (!first) first = pieces.map((p) => ({ shape: p.shape, cells: p.cells.map((x) => [...x]) }));
      return;
    }
    const ids = fixedShape ? [fixedShape] : shapeIds;
    for (const id of ids) {
      for (const orient of orientsByShape[id]) {
        const [ar, ac] = orient[0];
        const placed = orient.map(([r, c]) => [r - ar + empty[0], c - ac + empty[1]]);
        if (!placed.every(([r, c]) => cellSet.has(`${r},${c}`) && !used.has(`${r},${c}`))) continue;
        placed.forEach(([r, c]) => used.add(`${r},${c}`));
        pieces.push({ shape: id, cells: placed });
        run(fixedShape);
        pieces.pop();
        placed.forEach(([r, c]) => used.delete(`${r},${c}`));
        if (count >= limit) return;
      }
    }
  };
  if (same) {
    for (const id of shapeIds) {
      run(id);
      if (count >= limit) break;
    }
  } else run(null);
  return { count, tiling: first };
}

// 조각 k개를 변끼리 붙여 영역을 만든다.
function growRegion(shapeIds, size, k, maxSide) {
  const occupied = new Set();
  const placedPieces = [];
  for (let i = 0; i < k; i += 1) {
    const id = shapeIds[i % shapeIds.length];
    let ok = false;
    for (let t = 0; t < 80 && !ok; t += 1) {
      const orient = pick(POLY_ORIENTS[size][id]);
      let dr = 0;
      let dc = 0;
      if (occupied.size) {
        const anchor = pick([...occupied]).split(",").map(Number);
        const [nr, nc] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        const target = [anchor[0] + nr, anchor[1] + nc];
        if (occupied.has(`${target[0]},${target[1]}`)) continue;
        const [pr, pc] = pick(orient);
        dr = target[0] - pr;
        dc = target[1] - pc;
      }
      const cells = orient.map(([r, c]) => [r + dr, c + dc]);
      if (cells.some(([r, c]) => occupied.has(`${r},${c}`))) continue;
      const all = [...[...occupied].map((x) => x.split(",").map(Number)), ...cells];
      const rows = Math.max(...all.map(([r]) => r)) - Math.min(...all.map(([r]) => r)) + 1;
      const cols = Math.max(...all.map(([, c]) => c)) - Math.min(...all.map(([, c]) => c)) + 1;
      if (rows > maxSide || cols > maxSide) continue;
      cells.forEach(([r, c]) => occupied.add(`${r},${c}`));
      placedPieces.push({ shape: id, cells });
      ok = true;
    }
    if (!ok) return null;
  }
  return polyNormalize([...occupied].map((x) => x.split(",").map(Number)));
}

// 둘레 밖에서 들어갈 수 없는 빈칸(구멍)이 있으면 참.
function hasHole(region) {
  const rows = Math.max(...region.map(([r]) => r)) + 1;
  const cols = Math.max(...region.map(([, c]) => c)) + 1;
  const has = new Set(region.map(([r, c]) => `${r},${c}`));
  const seen = new Set(["-1,-1"]);
  const queue = [[-1, -1]];
  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr < -1 || nc < -1 || nr > rows || nc > cols || seen.has(key) || has.has(key)) continue;
      seen.add(key);
      queue.push([nr, nc]);
    }
  }
  return (rows + 2) * (cols + 2) - seen.size - has.size > 0;
}

function isRectangle(region) {
  const rows = Math.max(...region.map(([r]) => r)) + 1;
  const cols = Math.max(...region.map(([, c]) => c)) + 1;
  return rows * cols === region.length;
}

function makePartitionRegion(spec, avoid = new Set()) {
  const size = spec.size;
  const all = Object.keys(POLY_ORIENTS[size]);
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const chosen = spec.given ? [spec.given] : spec.same ? [pick(all)] : Array.from({ length: spec.count }, () => pick(all));
    const region = growRegion(chosen, size, spec.count, spec.maxSide);
    if (!region || isRectangle(region) || hasHole(region)) continue;
    const key = polyKey(region);
    if (avoid.has(key)) continue;
    const orients = spec.given ? { [spec.given]: POLY_ORIENTS[size][spec.given] } : POLY_ORIENTS[size];
    const { count, tiling } = countTilings(region, orients, { same: spec.same || Boolean(spec.given) });
    if (count !== 1) continue;
    // 다른 모양 조각으로도 나눌 수 있으면(같은 모양 조건을 빼면) 「같은 모양」 조건이 실제로 쓰이는지는 따지지 않는다.
    return { region, tiling, key };
  }
  return null;
}

function regionSvg(region, { tiling = null, cell = 26, label = "", shade = null } = {}) {
  const rows = Math.max(...region.map(([r]) => r)) + 1;
  const cols = Math.max(...region.map(([, c]) => c)) + 1;
  const pad = 3;
  const top = label ? 20 : 0;
  const W = cols * cell + pad * 2;
  const H = rows * cell + pad * 2 + top;
  const has = new Set(region.map(([r, c]) => `${r},${c}`));
  const pieceOf = new Map();
  (tiling || []).forEach((piece, i) => piece.cells.forEach(([r, c]) => pieceOf.set(`${r},${c}`, i)));
  const X = (c) => pad + c * cell;
  const Y = (r) => pad + top + r * cell;
  let fills = "";
  let dashed = "";
  let outline = "";
  let cuts = "";
  for (const [r, c] of region) {
    const fill = shade && shade.has(`${r},${c}`) ? "#cfe6ee" : "#fff";
    fills += `<rect x="${X(c)}" y="${Y(r)}" width="${cell}" height="${cell}" fill="${fill}"/>`;
    for (const [dr, dc, d] of [[-1, 0, `M${X(c)} ${Y(r)}H${X(c + 1)}`], [0, -1, `M${X(c)} ${Y(r)}V${Y(r + 1)}`], [1, 0, `M${X(c)} ${Y(r + 1)}H${X(c + 1)}`], [0, 1, `M${X(c + 1)} ${Y(r)}V${Y(r + 1)}`]]) {
      const n = `${r + dr},${c + dc}`;
      if (!has.has(n)) outline += d;
      else if (dr < 0 || dc < 0) {
        if (tiling && pieceOf.get(n) !== pieceOf.get(`${r},${c}`)) cuts += d;
        else dashed += d;
      }
    }
  }
  const cap = label ? `<text x="${pad}" y="14" font-size="13" fill="#2f3a40" style="${FONT}">${esc(label)}</text>` : "";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="칸으로 된 도형">${cap}${fills}`
    + `<path d="${dashed}" fill="none" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/>`
    + (cuts ? `<path d="${cuts}" fill="none" stroke="#d2372c" stroke-width="3" stroke-linecap="round"/>` : "")
    + `<path d="${outline}" fill="none" stroke="#1f6f86" stroke-width="2" stroke-linecap="square"/></svg>`;
}

function pieceSvg(cells, { cell = 13, fill = "#dcedf2" } = {}) {
  const norm = polyNormalize(cells);
  const rows = Math.max(...norm.map(([r]) => r)) + 1;
  const cols = Math.max(...norm.map(([, c]) => c)) + 1;
  const W = cols * cell + 4;
  const H = rows * cell + 4;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" aria-hidden="true">${norm.map(([r, c]) => `<rect x="${2 + c * cell}" y="${2 + r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#1f6f86" stroke-width="1.2"/>`).join("")}</svg>`;
}

function pieceShelf(size, onlyId = null) {
  const ids = onlyId ? [onlyId] : Object.keys(POLY_BASE[size]);
  const items = ids.map((id) => pieceSvg(POLY_BASE[size][id], { fill: onlyId ? "#bfe0ea" : "#eef6f8" }));
  return `<div style="display:flex;flex-wrap:wrap;gap:8px 12px;align-items:flex-end;justify-content:center;padding:8px 12px;border:1px solid #b7d6de;border-radius:10px;margin-bottom:10px">${items.join("")}</div>`;
}

const PARTITION_SPECS = Object.freeze({
  pentominoTwo: { size: 5, count: 2, same: false, regions: 2, maxSide: 4 },
  tetrominoTwoSame: { size: 4, count: 2, same: true, regions: 2, maxSide: 4 },
  trominoFourSame: { size: 3, count: 4, same: true, regions: 1, maxSide: 5 },
  tetrominoThreeSame: { size: 4, count: 3, same: true, regions: 1, maxSide: 5 },
  pentominoGivenFour: { size: 5, count: 4, given: true, regions: 2, maxSide: 6 }
});

function polyominoPartition({ difficulty = 2 } = {}, specName) {
  const base = PARTITION_SPECS[specName];
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const given = base.given ? pick(d === 1 ? ["L", "P", "Y", "V"] : Object.keys(POLY_BASE[5]).filter((id) => id !== "X" && id !== "I")) : null;
  const spec = { ...base, given, maxSide: base.maxSide + (d === 3 ? 1 : 0) };
  const made = [];
  const avoid = new Set();
  for (let i = 0; i < spec.regions; i += 1) {
    const one = makePartitionRegion(spec, avoid);
    if (!one) return null;
    avoid.add(one.key);
    made.push(one);
  }
  const word = POLY_WORD[spec.size];
  const labels = spec.regions > 1 ? ["(1)", "(2)"] : [""];
  const shelf = spec.given ? pieceShelf(spec.size, given) : pieceShelf(spec.size);
  const figs = made.map((one, i) => regionSvg(one.region, { label: labels[i] }));
  const answerFigs = made.map((one, i) => regionSvg(one.region, { label: labels[i], tiling: one.tiling }));
  const countWord = KOR_COUNT[spec.count];
  const prompt = spec.given
    ? `정사각형 5개를 변끼리 붙여 만든 도형을 펜토미노라고 합니다. 칸의 선을 따라 다음 도형을 위의 색칠된 펜토미노와 같은 모양 ${countWord} 조각으로 나누어 그리세요. (돌리거나 뒤집어 놓아도 됩니다.)`
    : spec.same
      ? `정사각형 ${spec.size}개를 변끼리 붙여 만든 도형을 ${word}라고 합니다. 칸의 선을 따라 다음 도형을 모양과 크기가 같은 ${word} ${countWord} 조각으로 나누어 그리세요.`
      : `정사각형 5개를 변끼리 붙여 만든 도형을 펜토미노라고 합니다. 칸의 선을 따라 다음 도형을 펜토미노 ${countWord} 조각으로 나누어 그리세요.`;
  const solution = `도형의 칸은 모두 ${spec.size * spec.count}칸이므로 ${spec.size}칸짜리 조각 ${spec.count}개로 나눕니다. 이웃 칸이 하나뿐인 튀어나온 칸이나 모서리 칸부터 그 칸을 덮을 수 있는 조각을 정하면 나머지 칸이 차례로 정해집니다.${spec.regions > 1 ? " 두 도형 모두" : ""} 나누는 방법은 그림과 같이 한 가지뿐입니다.`;
  return {
    prompt,
    answer: "그림 답안",
    responseKind: "drawing",
    solution,
    visual: { kind: "fig", html: `${shelf}${rowWrap(figs)}` },
    answerVisual: { kind: "fig", html: rowWrap(answerFigs) },
    meta: { family: "polyomino-partition-b4", spec: specName, given, regions: made.map((one) => ({ cells: one.region, pieces: one.tiling.map((p) => p.shape) })) }
  };
}

// ── 4단원 · 앞뒤·좌우 몇 번째 조건으로 줄 세우기 ─────────────────────
// 교재 확인 1-3·연습 8: 한 줄로 선 다섯 명 — 「X 뒤에는 몇 명」·「X 뒤로 몇 번째에 Y」 같은 조건으로 자리를 정하고 가운데 사람을 찾는다.
// 연습 7: 한 줄로 앉은 여섯 명 — 「X의 오른쪽(왼쪽) 몇 번째에 Y」 조건으로 자리를 정한다.
// 연습 5, 6: 달리기 등수 — 「X 앞에는 Y밖에 없다」·「X는 Y보다 먼저」·「X는 Y 바로 다음」으로 등수를 정한다.
// 모든 줄 세우기를 따져 조건에 맞는 것이 하나뿐일 때만 낸다.

const ORDER_PEOPLE = Object.freeze(["가람", "나윤", "다빈", "라온", "마루", "바다", "사랑", "아린", "자율", "하람"]);
const ORDER_LETTERS = Object.freeze(["A", "B", "C", "D", "E", "F"]);
const ORDER_ORDINAL = Object.freeze(["", "첫", "두", "세", "네", "다섯"]);

function permutationsOf(list) {
  if (list.length < 2) return [list];
  return list.flatMap((x, i) => permutationsOf([...list.slice(0, i), ...list.slice(i + 1)]).map((rest) => [x, ...rest]));
}

// 단서 하나 = { text, test(pos) } — pos: 이름 → 자리(1부터).
function lineClues(names, pos, n, mode) {
  const out = [];
  for (const x of names) {
    const p = pos[x];
    if (mode === "line") {
      const behind = n - p;
      out.push({ kind: "abs", who: [x], text: behind ? `${x} 뒤에는 ${behind}명이 서 있습니다.` : `${x} 뒤에는 아무도 없습니다.`, test: (q) => q[x] === p });
      if (p > 1) out.push({ kind: "abs", who: [x], text: `${x} 앞에는 ${p - 1}명이 서 있습니다.`, test: (q) => q[x] === p });
    }
    for (const y of names) {
      if (x === y) continue;
      const k = pos[y] - p;
      if (mode === "line") {
        if (k > 0) out.push({ kind: "rel", who: [x, y], text: k === 1 ? `${x} 바로 뒤에 ${josa(y, "이", "가")} 서 있습니다.` : `${x} 뒤로 ${ORDER_ORDINAL[k]} 번째에 ${josa(y, "이", "가")} 서 있습니다.`, test: (q) => q[y] - q[x] === k });
        if (k < 0 && -k > 1) out.push({ kind: "rel", who: [x, y], text: `${x} 앞으로 ${ORDER_ORDINAL[-k]} 번째에 ${josa(y, "이", "가")} 서 있습니다.`, test: (q) => q[y] - q[x] === k });
      } else if (mode === "seat") {
        if (k > 0) out.push({ kind: "rel", who: [x, y], text: `${x}의 오른쪽 ${ORDER_ORDINAL[k]} 번째에 ${josa(y, "이", "가")} 앉아 있습니다.`, test: (q) => q[y] - q[x] === k });
        if (k < 0) out.push({ kind: "rel", who: [x, y], text: `${x}의 왼쪽 ${ORDER_ORDINAL[-k]} 번째에 ${josa(y, "이", "가")} 앉아 있습니다.`, test: (q) => q[y] - q[x] === k });
      } else if (mode === "race") {
        if (p === 2 && pos[y] === 1) out.push({ kind: "abs", who: [x, y], text: `${x}보다 먼저 들어온 사람은 ${y}뿐입니다.`, test: (q) => q[x] === 2 && q[y] === 1 });
        if (k === 1) out.push({ kind: "rel", who: [x, y], text: `${josa(y, "은", "는")} ${x} 바로 다음으로 들어왔습니다.`, test: (q) => q[y] - q[x] === 1 });
        if (k > 0) out.push({ kind: "ord", who: [x, y], text: `${josa(x, "은", "는")} ${y}보다 먼저 들어왔습니다.`, test: (q) => q[x] < q[y] });
        for (const z of names) {
          if (z === x || z === y || x > y) continue;
          if (p < pos[z] && pos[y] < pos[z]) out.push({ kind: "ord2", who: [x, y, z], text: `${josa(x, "과", "와")} ${josa(y, "은", "는")} 모두 ${z}보다 먼저 들어왔습니다.`, test: (q) => q[x] < q[z] && q[y] < q[z] });
        }
        if (p === n) out.push({ kind: "abs", who: [x], text: `${josa(x, "이", "가")} 가장 늦게 들어왔습니다.`, test: (q) => q[x] === n });
      }
    }
  }
  return out;
}

function makeOrderPuzzle({ mode, n, maxClues }) {
  const names = mode === "seat" ? ORDER_LETTERS.slice(0, n) : shuffle(ORDER_PEOPLE).slice(0, n);
  const perms = permutationsOf(names).map((order) => Object.fromEntries(order.map((x, i) => [x, i + 1])));
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const truth = perms[randomInt(0, perms.length - 1)];
    const all = shuffle(lineClues(names, truth, n, mode));
    // 묻는 것
    let ask;
    if (mode === "line") {
      const p = n % 2 ? (n + 1) / 2 : randomInt(2, n - 1);
      ask = { pos: p, text: n % 2 && p === (n + 1) / 2 ? "가운데 서 있는 사람은 누구인지 구하세요." : `앞에서 ${ORDER_ORDINAL[p]} 번째에 서 있는 사람은 누구인지 구하세요.` };
    } else if (mode === "race") {
      const p = randomInt(2, n - 1);
      ask = { pos: p, text: `${p}등으로 들어온 사람은 누구인지 구하세요.` };
    } else {
      const from = pick(names);
      const options = [1, 2, 3].flatMap((k) => [k, -k]).filter((k) => truth[from] + k >= 1 && truth[from] + k <= n);
      const k = pick(options);
      ask = { from, k, pos: truth[from] + k, text: `${from}의 ${k > 0 ? "오른쪽" : "왼쪽"} ${ORDER_ORDINAL[Math.abs(k)]} 번째에는 누가 앉아 있는지 구하세요.` };
    }
    const answer = names.find((x) => truth[x] === ask.pos);
    // 답인 사람의 자리를 바로 말해 주는 단서는 쓰지 않는다. 자리 단서(abs)는 하나까지.
    const usable = all.filter((c) => !(c.kind === "abs" && c.who.includes(answer)) && !(mode === "seat" && c.kind === "rel" && c.who[0] === ask.from && c.who[1] === answer));
    const chosen = [];
    let remaining = perms;
    for (const clue of usable) {
      if (remaining.length === 1) break;
      if (clue.kind === "abs" && chosen.some((c) => c.kind === "abs")) continue;
      const next = remaining.filter((q) => clue.test(q));
      if (next.length === remaining.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    // 빼도 하나로 정해지는 단서는 뺀다.
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (perms.filter((q) => rest.every((c) => c.test(q))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length > maxClues || chosen.length < 2) continue;
    return { names, truth, clues: shuffle(chosen), ask, answer };
  }
  return null;
}

function orderBoxesHtml(puzzle, mode) {
  const n = puzzle.names.length;
  const cellStyle = "border:1px solid #6f9fae;width:54px;height:34px";
  const list = `<ul style="margin:0 0 12px;padding:10px 16px 10px 30px;background:#e3f1f4;border-radius:12px;line-height:1.75;${FONT};font-size:15px;color:#1f2a30;text-align:left">${puzzle.clues.map((c) => `<li>${esc(c.text)}</li>`).join("")}</ul>`;
  let boxes;
  if (mode === "race") {
    boxes = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:14px"><tr>${Array.from({ length: n }, (_, i) => `<th style="${cellStyle};height:26px;background:#dcedf2;font-weight:600">${i + 1}등</th>`).join("")}</tr><tr>${Array.from({ length: n }, () => `<td style="${cellStyle}"></td>`).join("")}</tr></table>`;
  } else {
    const ends = mode === "line" ? ["(앞)", "(뒤)"] : ["(왼쪽)", "(오른쪽)"];
    boxes = `<div style="display:flex;align-items:center;justify-content:center;gap:6px;${FONT};font-size:14px;color:#2f3a40"><span>${ends[0]}</span><div style="display:flex">${Array.from({ length: n }, () => `<span style="display:inline-block;${cellStyle};margin-left:-1px"></span>`).join("")}</div><span>${ends[1]}</span></div>`;
  }
  return `<div style="display:inline-block;max-width:100%">${list}${boxes}</div>`;
}

function orderPuzzleProblem({ difficulty = 2 } = {}, mode) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const n = mode === "seat" ? (d === 1 ? 5 : 6) : 5;
  const puzzle = makeOrderPuzzle({ mode, n, maxClues: mode === "seat" ? 5 : 4 });
  if (!puzzle) return null;
  const intro = mode === "line"
    ? `${puzzle.names.join(", ")} 다섯 명이 한 줄로 서 있습니다.`
    : mode === "seat"
      ? `${puzzle.names.join(", ")} ${n}명이 한 줄로 나란히 앉아 있습니다.`
      : `${puzzle.names.join(", ")} 다섯 명이 달리기 시합을 하였습니다. 결과는 다음과 같습니다.`;
  const order = [...puzzle.names].sort((a, b) => puzzle.truth[a] - puzzle.truth[b]);
  const orderText = mode === "line" ? `앞에서부터 ${order.join(", ")}` : mode === "seat" ? `왼쪽부터 ${order.join(", ")}` : `1등부터 ${order.join(", ")}`;
  return {
    prompt: `${intro} ${puzzle.ask.text}`,
    answer: puzzle.answer,
    solution: `${mode === "race" ? "등수가 바로 정해지는 조건부터 칸에 써 넣고, 누가 먼저 들어왔는지 말하는 조건으로 나머지 칸을 채웁니다." : "자리가 바로 정해지는 조건부터 칸에 써 넣고, 두 사람이 몇 자리 떨어져 있는지 말하는 조건으로 나머지 칸을 채웁니다."} 조건을 모두 따르면 ${orderText}의 순서 한 가지뿐입니다. 따라서 답은 ${puzzle.answer}입니다.`,
    visual: { kind: "fig", html: orderBoxesHtml(puzzle, mode) },
    meta: { family: "order-offset-placement-b4", mode, clues: puzzle.clues.map((c) => c.text), order, answer: puzzle.answer }
  };
}

// ── 1단원 · 선 그림을 네 방향으로 돌리기·뒤집기, 디지털 숫자 두 번 뒤집기 ─────────
// 교재 활동 2-1·연습 12: 3×3 칸 위의 선 그림을 오른쪽으로 반의 반 바퀴씩 돌린 네 모양(반의 반·반·반의 반 바퀴 왼쪽·한 바퀴)을 모두 그린다.
// 연습 11: 같은 선 그림을 위·아래·왼쪽·오른쪽으로 뒤집은 네 모양을 그린다.
// 활동 2-2·연습 13: 디지털 숫자 하나를 (1) 오른쪽으로 뒤집은 뒤 아래로 뒤집고 (2) 반 바퀴 돌려 그리고,
//                    (3) 두 번 뒤집은 것이 어떤 돌리기와 같은지 묻는다.

// 선 그림: 4×4 격자점(0~3) 위의 꺾은선. 같은 모양으로 돌아오는 대칭 그림은 뽑지 않는다.
function makePolyline() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const count = randomInt(2, 3);
    let p = [randomInt(0, 3), randomInt(0, 3)];
    const points = [p];
    let ok = true;
    for (let i = 0; i < count; i += 1) {
      const moves = [];
      for (let dx = -3; dx <= 3; dx += 1) for (let dy = -3; dy <= 3; dy += 1) {
        if (!dx && !dy) continue;
        if (dx && dy && Math.abs(dx) !== Math.abs(dy)) continue; // 가로·세로·대각선만
        const q = [p[0] + dx, p[1] + dy];
        if (q[0] < 0 || q[0] > 3 || q[1] < 0 || q[1] > 3) continue;
        if (points.some(([x, y]) => x === q[0] && y === q[1])) continue;
        const prev = points[points.length - 2];
        if (prev) {
          const [ax, ay] = [p[0] - prev[0], p[1] - prev[1]];
          if (ax * dy - ay * dx === 0) continue; // 앞 선과 한 줄로 이어지거나 되돌아가지 않게
        }
        moves.push(q);
      }
      if (!moves.length) { ok = false; break; }
      p = pick(moves);
      points.push(p);
    }
    if (!ok) continue;
    const diagonal = points.slice(1).some((q, i) => q[0] !== points[i][0] && q[1] !== points[i][1]);
    if (!diagonal && Math.random() < 0.5) continue;
    const keys = [lineKey(points), ...[1, 2, 3].map((t) => lineKey(turnPoints(points, t))), ...["up", "side"].map((f) => lineKey(flipPoints(points, f)))];
    if (new Set(keys).size !== keys.length) continue;
    return points;
  }
  return null;
}

const turnPoints = (points, quarter) => points.map(([x, y]) => {
  let q = [x, y];
  for (let i = 0; i < quarter; i += 1) q = [3 - q[1], q[0]]; // 화면에서 시계 방향 반의 반 바퀴
  return q;
});
const flipPoints = (points, how) => points.map(([x, y]) => (how === "up" ? [x, 3 - y] : [3 - x, y]));
const lineKey = (points) => {
  const segs = points.slice(1).map((q, i) => [points[i], q].map(([x, y]) => `${x},${y}`).sort().join("-")).sort();
  return segs.join("|");
};

function lineGridSvg(points, { caption = "", size = 96, color = "#d2372c" } = {}) {
  const cell = size / 3;
  const pad = 4;
  const capH = caption ? 34 : 0;
  const W = size + pad * 2;
  const H = size + pad * 2 + capH;
  let grid = "";
  for (let i = 0; i <= 3; i += 1) {
    grid += `<path d="M${pad} ${pad + i * cell}H${pad + size}M${pad + i * cell} ${pad}V${pad + size}" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/>`;
  }
  const line = points ? `<polyline points="${points.map(([x, y]) => `${pad + x * cell},${pad + y * cell}`).join(" ")}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : "";
  const cap = caption ? caption.split("\n").map((t, i) => `<text x="${W / 2}" y="${pad + size + 16 + i * 14}" text-anchor="middle" font-size="12" fill="#2f3a40" style="${FONT}">${esc(t)}</text>`).join("") : "";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="점선 칸 위의 선 그림">${grid}${line}${cap}</svg>`;
}

const TURN_LABELS = Object.freeze([
  { quarter: 1, caption: "오른쪽으로\n반의 반 바퀴", word: "오른쪽(시계 방향)으로 반의 반 바퀴" },
  { quarter: 2, caption: "반 바퀴", word: "반 바퀴" },
  { quarter: 3, caption: "왼쪽으로\n반의 반 바퀴", word: "왼쪽(시계 반대 방향)으로 반의 반 바퀴" },
  { quarter: 0, caption: "한 바퀴", word: "한 바퀴" }
]);
const FLIP_LABELS = Object.freeze([
  { how: "up", caption: "위로 뒤집기" },
  { how: "up", caption: "아래로 뒤집기" },
  { how: "side", caption: "왼쪽으로 뒤집기" },
  { how: "side", caption: "오른쪽으로 뒤집기" }
]);

function polylineTurnFour() {
  const points = makePolyline();
  if (!points) return null;
  const original = lineGridSvg(points, { caption: "처음 모양" });
  const blanks = TURN_LABELS.map((t) => lineGridSvg(null, { caption: t.caption }));
  const answers = TURN_LABELS.map((t) => lineGridSvg(turnPoints(points, t.quarter), { caption: t.caption }));
  return {
    prompt: "처음 모양을 오른쪽(시계 방향)으로 반의 반 바퀴씩 돌린 모양을 차례로 모두 그리세요. 왼쪽으로 반의 반 바퀴 돌린 모양과 한 바퀴 돌린 모양도 그립니다.",
    answer: "그림 답안",
    responseKind: "drawing",
    solution: "반의 반 바퀴 돌리면 위쪽에 있던 부분이 오른쪽으로 갑니다. 선의 끝점이 어느 칸 꼭짓점에 있는지 하나씩 옮겨 찍고 이으면 됩니다. 반 바퀴는 반의 반 바퀴를 두 번, 왼쪽으로 반의 반 바퀴는 오른쪽으로 세 번 돌린 것과 같고, 한 바퀴 돌리면 처음 모양으로 돌아옵니다.",
    visual: { kind: "fig", html: rowWrap([original, ...blanks]) },
    answerVisual: { kind: "fig", html: rowWrap(answers) },
    meta: { family: "polyline-turn-four-b4", points, turned: TURN_LABELS.map((t) => turnPoints(points, t.quarter)) }
  };
}

function polylineFlipFour() {
  const points = makePolyline();
  if (!points) return null;
  const original = lineGridSvg(points, { caption: "처음 모양" });
  const blanks = FLIP_LABELS.map((f) => lineGridSvg(null, { caption: f.caption }));
  const answers = FLIP_LABELS.map((f) => lineGridSvg(flipPoints(points, f.how), { caption: f.caption }));
  return {
    prompt: "처음 모양을 위·아래·왼쪽·오른쪽으로 뒤집은 모양을 각각 그리세요.",
    answer: "그림 답안",
    responseKind: "drawing",
    solution: "위나 아래로 뒤집으면 위쪽과 아래쪽이 서로 바뀌고 왼쪽·오른쪽은 그대로입니다. 왼쪽이나 오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀝니다. 그래서 위로 뒤집은 모양과 아래로 뒤집은 모양이 같고, 왼쪽으로 뒤집은 모양과 오른쪽으로 뒤집은 모양이 같습니다.",
    visual: { kind: "fig", html: rowWrap([original, ...blanks]) },
    answerVisual: { kind: "fig", html: rowWrap(answers) },
    meta: { family: "polyline-flip-four-b4", points, flipped: FLIP_LABELS.map((f) => flipPoints(points, f.how)) }
  };
}

// 디지털 숫자: 1칸 × 2칸 점선 틀의 변 위에 막대를 긋는다(a 위, b 오른쪽 위, c 오른쪽 아래, d 아래, e 왼쪽 아래, f 왼쪽 위, g 가운데).
const SEG_OF = Object.freeze({ 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" });
const SEG_FLIP_SIDE = Object.freeze({ a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" });
const SEG_FLIP_DOWN = Object.freeze({ a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" });
const segMap = (segs, map) => [...segs].map((s) => map[s]).sort().join("");

function segDigitSvg(segs, { caption = "", color = "#d2372c" } = {}) {
  const cell = 30;
  const pad = 6;
  const capH = caption ? 18 : 0;
  const W = cell + pad * 2;
  const H = cell * 2 + pad * 2 + capH;
  const x0 = pad;
  const y0 = pad;
  const L = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 1]], c: [[1, 1], [1, 2]], d: [[0, 2], [1, 2]], e: [[0, 1], [0, 2]], f: [[0, 0], [0, 1]], g: [[0, 1], [1, 1]] };
  const frame = `<rect x="${x0}" y="${y0}" width="${cell}" height="${cell * 2}" fill="none" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/><path d="M${x0} ${y0 + cell}H${x0 + cell}" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/>`;
  const bars = segs ? [...segs].map((s) => { const [[ax, ay], [bx, by]] = L[s]; return `<path d="M${x0 + ax * cell} ${y0 + ay * cell}L${x0 + bx * cell} ${y0 + by * cell}" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`; }).join("") : "";
  const cap = caption ? `<text x="${W / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="#2f3a40" style="${FONT}">${esc(caption)}</text>` : "";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto;overflow:visible" role="img" aria-label="디지털 숫자 틀">${frame}${bars}${cap}</svg>`;
}

const arrowText = (text) => `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;${FONT};font-size:12px;color:#2f3a40"><span style="font-size:20px;color:#2f7d8f">→</span>${esc(text)}</span>`;
const stepRow = (label, parts) => `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0"><b style="${FONT};font-size:14px;min-width:28px">${label}</b>${parts.join("")}</div>`;

function digitalFlipTurnSet() {
  // 뒤집은 모양이 처음 숫자와 달라 보이는 숫자만(1·8·0처럼 돌려도 같은 것은 빼고).
  const candidates = [2, 3, 4, 5, 6, 7, 9].filter((digit) => {
    const s = SEG_OF[digit];
    return segMap(s, SEG_FLIP_SIDE) !== [...s].sort().join("") && segMap(segMap(s, SEG_FLIP_SIDE), SEG_FLIP_DOWN) !== [...s].sort().join("");
  });
  const digit = pick(candidates);
  const order = pick([["side", "down"], ["down", "side"]]);
  const words = { side: "오른쪽으로 뒤집기", down: "아래로 뒤집기" };
  const done = { side: "오른쪽으로 뒤집은", down: "아래로 뒤집은" };
  const doing = { side: "오른쪽으로 뒤집고", down: "아래로 뒤집고" };
  const num = digit;
  const maps = { side: SEG_FLIP_SIDE, down: SEG_FLIP_DOWN };
  const start = [...SEG_OF[digit]].sort().join("");
  const mid = segMap(start, maps[order[0]]);
  const end = segMap(mid, maps[order[1]]);
  const half = segMap(segMap(start, SEG_FLIP_SIDE), SEG_FLIP_DOWN);
  const q1 = stepRow("(1)", [segDigitSvg(start, { caption: "처음" }), arrowText(words[order[0]]), segDigitSvg(null), arrowText(words[order[1]]), segDigitSvg(null)]);
  const q2 = stepRow("(2)", [segDigitSvg(start, { caption: "처음" }), arrowText("반 바퀴 돌리기"), segDigitSvg(null)]);
  const a1 = stepRow("(1)", [segDigitSvg(start, { caption: "처음" }), arrowText(words[order[0]]), segDigitSvg(mid), arrowText(words[order[1]]), segDigitSvg(end)]);
  const a2 = stepRow("(2)", [segDigitSvg(start, { caption: "처음" }), arrowText("반 바퀴 돌리기"), segDigitSvg(half)]);
  return {
    prompt: `디지털 숫자 ${num}${hasBatchim(String(num)) ? "을" : "를"} 움직이려고 합니다. (1) ${done[order[0]]} 뒤 ${done[order[1]]} 모양을 그리세요. (2) 반 바퀴 돌린 모양을 그리세요. (3) 어떤 모양을 ${doing[order[0]]} ${done[order[1]]} 것은 어떻게 돌린 것과 같은가요?`,
    answer: "(1)·(2) 그림 답안, (3) 반 바퀴 돌린 것과 같습니다.",
    responseKind: "drawing",
    solution: `오른쪽으로 뒤집으면 왼쪽 막대와 오른쪽 막대가 서로 바뀌고, 아래로 뒤집으면 위 막대와 아래 막대가 서로 바뀝니다. 두 번 뒤집으면 위아래와 왼쪽·오른쪽이 모두 바뀌므로 (2)의 반 바퀴 돌린 모양과 똑같습니다. 그래서 (3)은 반 바퀴 돌린 것과 같습니다.`,
    visual: { kind: "fig", html: `<div style="display:inline-block;text-align:left">${q1}${q2}</div>` },
    answerVisual: { kind: "fig", html: `<div style="display:inline-block;text-align:left">${a1}${a2}</div>` },
    meta: { family: "digital-flip-turn-set-b4", digit, order, start, mid, end, half }
  };
}

export const BOOK04_STRUCTURE_INTERNALS = { makeBalanceSystem, childSolve, ratioDetermined, eqNormalize };

export const BOOK04_STRUCTURE_GENERATORS = {
  polylineTurnFourB4: polylineTurnFour,
  polylineFlipFourB4: polylineFlipFour,
  digitalFlipTurnSetB4: digitalFlipTurnSet,
  lineOffsetPlacementB4: (options) => orderPuzzleProblem(options, "line"),
  seatOffsetPlacementB4: (options) => orderPuzzleProblem(options, "seat"),
  raceOrderCluesB4: (options) => orderPuzzleProblem(options, "race"),
  pentominoSplitTwoB4: (options) => polyominoPartition(options, "pentominoTwo"),
  tetrominoSplitTwoSameB4: (options) => polyominoPartition(options, "tetrominoTwoSame"),
  trominoSplitFourSameB4: (options) => polyominoPartition(options, "trominoFourSame"),
  tetrominoSplitThreeSameB4: (options) => polyominoPartition(options, "tetrominoThreeSame"),
  pentominoGivenSplitFourB4: (options) => polyominoPartition(options, "pentominoGivenFour"),
  shapeDifferenceTreeB4: shapeDifferenceTree,
  measurementRelativeDifferenceB4: measurementRelativeDifference,
  mixedPanBalanceTwoB4: (options) => mixedPanBalance(options, { balances: 2 }),
  mixedPanBalanceThreeB4: (options) => mixedPanBalance(options, { balances: 3 })
};
const POLY_GROUP = "칸 도형을 같은 조각으로 나누기";
const BAL_GROUP = "섞인 접시 양팔저울";
const DIFF_GROUP = "차를 이어 두 사이의 차 구하기";
const ORDER_GROUP = "몇 번째 조건으로 줄 세우기";

export const BOOK04_STRUCTURE_TYPE_ROWS = [
  { id: "pentomino-split-two-b4", domain: "geometry", middle: "도형 분할", label: "칸 도형을 펜토미노 두 조각으로 나누어 그리기", generator: "pentominoSplitTwoB4", catalogGroup: POLY_GROUP, catalogStrategy: "튀어나온 칸부터 다섯 칸 조각 정하기", searchAliases: ["펜토미노", "폴리오미노", "도형 나누기"] },
  { id: "tetromino-split-two-same-b4", domain: "geometry", middle: "도형 분할", label: "칸 도형을 같은 테트로미노 두 조각으로 나누어 그리기", generator: "tetrominoSplitTwoSameB4", catalogGroup: POLY_GROUP, catalogStrategy: "튀어나온 칸부터 네 칸 조각 정하기", searchAliases: ["테트로미노", "폴리오미노", "도형 나누기"] },
  { id: "tromino-split-four-same-b4", domain: "geometry", middle: "도형 분할", label: "칸 도형을 같은 트로미노 네 조각으로 나누어 그리기", generator: "trominoSplitFourSameB4", catalogGroup: POLY_GROUP, catalogStrategy: "모서리 칸부터 세 칸 조각 정하기", searchAliases: ["트로미노", "폴리오미노", "도형 나누기"] },
  { id: "tetromino-split-three-same-b4", domain: "geometry", middle: "도형 분할", label: "칸 도형을 같은 테트로미노 세 조각으로 나누어 그리기", generator: "tetrominoSplitThreeSameB4", catalogGroup: POLY_GROUP, catalogStrategy: "모서리 칸부터 같은 네 칸 조각 정하기", searchAliases: ["테트로미노", "폴리오미노", "도형 나누기"] },
  { id: "pentomino-given-split-four-b4", domain: "geometry", middle: "도형 분할", label: "보여 준 펜토미노 네 조각으로 칸 도형 나누어 그리기", generator: "pentominoGivenSplitFourB4", catalogGroup: POLY_GROUP, catalogStrategy: "주어진 조각을 돌리고 뒤집어 모서리부터 채우기", searchAliases: ["펜토미노", "폴리오미노", "도형 나누기"] },
  { id: "polyline-turn-four-b4", domain: "geometry", middle: "도형 움직이기", label: "선 그림을 반의 반 바퀴씩 돌린 네 모양 모두 그리기", generator: "polylineTurnFourB4", catalogGroup: "선 그림·디지털 숫자 돌리고 뒤집기", catalogStrategy: "끝점을 하나씩 옮겨 찍고 잇기", searchAliases: ["돌리기", "반의 반 바퀴", "회전"] },
  { id: "polyline-flip-four-b4", domain: "geometry", middle: "도형 움직이기", label: "선 그림을 위·아래·왼쪽·오른쪽으로 뒤집은 모양 그리기", generator: "polylineFlipFourB4", catalogGroup: "선 그림·디지털 숫자 돌리고 뒤집기", catalogStrategy: "바뀌는 쪽과 그대로인 쪽 나누어 보기", searchAliases: ["뒤집기", "대칭", "거울"] },
  { id: "digital-flip-turn-set-b4", domain: "geometry", middle: "도형 움직이기", label: "디지털 숫자를 두 번 뒤집은 모양과 반 바퀴 돌린 모양 비교하기", generator: "digitalFlipTurnSetB4", catalogGroup: "선 그림·디지털 숫자 돌리고 뒤집기", catalogStrategy: "막대마다 자리를 바꾸어 그리기", searchAliases: ["디지털 숫자", "뒤집기", "반 바퀴"] },
  { id: "mixed-pan-balance-two-b4", domain: "logic", middle: "양팔저울", label: "섞인 접시 저울 두 개로 바꾸어 넣어 같은 무게 구하기", generator: "mixedPanBalanceTwoB4", catalogGroup: BAL_GROUP, catalogStrategy: "바꾸어 넣고 양쪽의 같은 것 덜어 내기", searchAliases: ["양팔저울", "바꾸어 넣기", "평형"] },
  { id: "mixed-pan-balance-three-b4", domain: "logic", middle: "양팔저울", label: "섞인 접시 저울 세 개로 바꾸어 넣어 같은 무게 구하기", generator: "mixedPanBalanceThreeB4", catalogGroup: BAL_GROUP, catalogStrategy: "한 가지 물건뿐인 저울부터 차례로 바꾸어 넣기", searchAliases: ["양팔저울", "바꾸어 넣기", "평형"] },
  { id: "shape-difference-tree-b4", domain: "number", middle: "비교와 차", label: "순서가 섞이고 빼기가 있는 도형 식으로 두 도형의 차 구하기", generator: "shapeDifferenceTreeB4", catalogGroup: DIFF_GROUP, catalogStrategy: "한 도형을 어떤 수로 두고 차례로 구하기", searchAliases: ["도형의 차", "크기 비교", "기준 정하기"] },
  { id: "measurement-relative-difference-b4", domain: "logic", middle: "순서와 비교", label: "몸무게·구슬·거리·길이 비교 조건으로 두 사이의 차 구하기", generator: "measurementRelativeDifferenceB4", catalogGroup: DIFF_GROUP, catalogStrategy: "한 사람을 어떤 수로 두고 표를 채우기", searchAliases: ["차이 구하기", "몸무게 비교", "거리 비교"] },
  { id: "line-offset-placement-b4", domain: "logic", middle: "자리 배치", label: "앞뒤 몇 번째 조건으로 한 줄의 자리 정하기", generator: "lineOffsetPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "자리가 바로 정해지는 조건부터 칸 채우기", searchAliases: ["줄 서기", "앞뒤", "몇 번째"] },
  { id: "seat-offset-placement-b4", domain: "logic", middle: "자리 배치", label: "왼쪽·오른쪽 몇 번째 조건으로 나란히 앉은 자리 정하기", generator: "seatOffsetPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "같은 사람이 나오는 조건을 이어 자리 칸 채우기", searchAliases: ["자리 배치", "왼쪽 오른쪽", "몇 번째"] },
  { id: "race-order-clues-b4", domain: "logic", middle: "순서와 비교", label: "먼저 들어온 조건으로 달리기 등수 정하기", generator: "raceOrderCluesB4", catalogGroup: ORDER_GROUP, catalogStrategy: "등수가 바로 정해지는 조건부터 표 채우기", searchAliases: ["달리기 등수", "순서 정하기", "먼저 들어옴"] }
];

export const BOOK04_STRUCTURE_GUIDES = {
  "pentomino-split-two-b4": "칸이 모두 몇 개인지 세고, 튀어나온 칸부터 그 칸을 덮는 다섯 칸 조각을 정해 나갑니다.",
  "tetromino-split-two-same-b4": "튀어나온 칸을 덮는 네 칸 조각을 먼저 정하고, 남은 네 칸이 같은 모양인지 돌려 보며 확인합니다.",
  "tromino-split-four-same-b4": "세 칸 조각은 일자와 꺾인 모양 두 가지뿐이니, 모서리 칸부터 한 가지 모양으로만 채워 봅니다.",
  "tetromino-split-three-same-b4": "튀어나온 칸을 덮는 네 칸 조각을 정하면 나머지 조각도 같은 모양으로 차례로 정해집니다.",
  "pentomino-given-split-four-b4": "주어진 조각을 돌리거나 뒤집어 모서리 칸부터 겹치지 않게 놓아 봅니다.",
  "polyline-turn-four-b4": "선의 끝점이 어느 꼭짓점에 있는지 보고, 반의 반 바퀴 돌리면 위쪽이 오른쪽으로 가도록 끝점을 하나씩 옮겨 잇습니다.",
  "polyline-flip-four-b4": "위아래로 뒤집으면 위쪽과 아래쪽만, 왼쪽·오른쪽으로 뒤집으면 왼쪽과 오른쪽만 서로 바뀝니다.",
  "digital-flip-turn-set-b4": "오른쪽으로 뒤집으면 양옆 막대가, 아래로 뒤집으면 위아래 막대가 바뀌고, 두 번 뒤집으면 반 바퀴 돌린 것과 같습니다.",
  "mixed-pan-balance-two-b4": "한 가지 물건뿐인 쪽이 있는 저울로 다른 저울의 물건을 바꾸어 넣고, 양쪽에 같은 물건은 덜어 냅니다.",
  "mixed-pan-balance-three-b4": "바꾸어 넣을 수 있는 저울부터 차례로 바꾸고, 양쪽의 같은 물건을 덜어 내어 두 가지 물건만 남깁니다.",
  "shape-difference-tree-b4": "한 도형을 20처럼 정해 두고 식을 하나씩 따라가며 나머지 도형의 수를 구한 뒤 차를 뺍니다.",
  "measurement-relative-difference-b4": "한 사람을 20처럼 정해 두고 조건을 따라 표를 채운 뒤 두 사람의 차를 구합니다.",
  "line-offset-placement-b4": "앞이나 뒤에 몇 명이 있는지 말하는 조건으로 한 자리를 먼저 정하고, 몇 번째 조건으로 나머지를 채웁니다.",
  "seat-offset-placement-b4": "같은 사람이 나오는 조건끼리 이어서 몇 칸 떨어져 있는지 그려 보고 자리를 정합니다.",
  "race-order-clues-b4": "등수가 바로 정해지는 조건부터 표에 쓰고, 누가 먼저 들어왔는지 조건으로 나머지 칸을 채웁니다."
};

export const BOOK04_STRUCTURE_REMAPS = [
  // 1단원 · 칸 도형 나누기
  ["book-04", 1, "activity", 1, [4], "pentomino-split-two-b4"],
  ["book-04", 1, "practice", 1, [2], "tromino-split-four-same-b4"],
  ["book-04", 1, "practice", 1, [3], "tetromino-split-three-same-b4"],
  ["book-04", 1, "practice", 1, [4], "tetromino-split-two-same-b4"],
  ["book-04", 1, "practice", 1, [6], "pentomino-given-split-four-b4"],
  // 1단원 · 선 그림·디지털 숫자 돌리고 뒤집기
  ["book-04", 1, "activity", 2, [1], "polyline-turn-four-b4"],
  ["book-04", 1, "practice", 1, [12], "polyline-turn-four-b4"],
  ["book-04", 1, "practice", 1, [11], "polyline-flip-four-b4"],
  ["book-04", 1, "activity", 2, [2], "digital-flip-turn-set-b4"],
  ["book-04", 1, "practice", 1, [13], "digital-flip-turn-set-b4"],
  // 3단원 · 차를 이어 두 사이의 차
  ["book-04", 3, "activity", 1, [1, 2, 3, 4], "shape-difference-tree-b4"],
  ["book-04", 3, "practice", 1, [3, 4, 5, 6], "shape-difference-tree-b4"],
  ["book-04", 3, "check", 1, [1], "measurement-age-difference-book4"],
  ["book-04", 3, "check", 1, [2], "measurement-relative-difference-b4"],
  ["book-04", 3, "check", 1, [3, 4], "measurement-distance-difference-book4"],
  ["book-04", 3, "practice", 1, [7, 8, 9, 10], "measurement-relative-difference-b4"],
  // 3단원 · 섞인 접시 저울
  ["book-04", 3, "activity", 2, [1, 2, 3, 4], "mixed-pan-balance-two-b4"],
  ["book-04", 3, "check", 2, [2], "mixed-pan-balance-two-b4"],
  ["book-04", 3, "practice", 1, [11, 12, 13, 14], "mixed-pan-balance-two-b4"],
  ["book-04", 3, "advanced", 1, [4], "mixed-pan-balance-two-b4"],
  ["book-04", 3, "check", 2, [1], "mixed-pan-balance-three-b4"],
  ["book-04", 3, "practice", 1, [15, 16], "mixed-pan-balance-three-b4"],
  ["book-04", 3, "advanced", 1, [3], "mixed-pan-balance-three-b4"],
  // 4단원 · 몇 번째 조건으로 줄 세우기
  ["book-04", 4, "check", 1, [3], "line-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [8], "line-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [7], "seat-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [5, 6], "race-order-clues-b4"]
];
