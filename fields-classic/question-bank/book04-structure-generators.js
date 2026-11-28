// 1과정 4권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK04_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK04_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK04_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK04_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)

import { shapeSvg } from "./book02-renderers.js?v=20261101m";
import { foldGeometryHelpers, foldWordStrip } from "./fold-visuals.js?v=20261123a";

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
    prompt: `그림의 저울이 모두 수평으로 멈춰 있습니다. ${BAL_NAME[made.target]} 1개와 무게가 같으려면 ${josa(BAL_NAME[made.unit], "이", "가")} 몇 개 있어야 할까요?`,
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
    prompt: `네 모양은 저마다 어떤 수를 나타냅니다. 식을 보고 ${josa(nameOf(x), "과", "와")} ${nameOf(y)}가 나타내는 두 수는 얼마나 차이가 나는지 구하세요.`,
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
  { id: "weight", names: ["소율", "준서", "예린", "한결", "다은", "로운", "가온", "수호"], unit: "kg", intro: (n) => `${n.join(", ")} 네 사람이 서로 몸무게를 견주어 보았습니다.`, ask: (a, b) => `${josaName(a, "과", "와")} ${b}의 몸무게 차는 몇 kg일까요?`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}kg 더 ${up ? "무겁습니다" : "가볍습니다"}.` },
  { id: "marbles", names: ["서아", "민재", "다온", "유찬", "시우", "하린", "은호", "주아"], unit: "개", intro: (n) => `${n.join(", ")} 네 명이 저마다 구슬을 모았습니다.`, ask: (a, b) => `${josaName(a, "과", "와")} ${josaName(b, "이", "가")} 모은 구슬 수의 차는 몇 개일까요?`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 구슬이 ${d}개 ${up ? "많습니다" : "적습니다"}.` },
  { id: "race", names: ["태오", "라희", "지안", "도하", "윤슬", "이준", "채아", "건우"], unit: "m", intro: (n) => `${n.join(", ")} 네 명이 달리기를 하고 있습니다.`, ask: (a, b) => `지금 ${josaName(a, "과", "와")} ${josaName(b, "은", "는")} 몇 m 떨어져 있을까요?`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}m ${up ? "앞에" : "뒤에"} 있습니다.` },
  { id: "bugs", names: ["달팽이", "무당벌레", "메뚜기", "사마귀", "풍뎅이", "애벌레"], unit: "cm", intro: (n) => `${n.slice(0, -1).join(", ")}, ${josaName(n[n.length - 1], "이", "가")} 나뭇가지 위에서 경주를 하고 있습니다.`, ask: (a, b) => `지금 ${josaName(a, "과", "와")} ${josaName(b, "은", "는")} 몇 cm 떨어져 있을까요?`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}cm ${up ? "앞에" : "뒤에"} 있습니다.` },
  { id: "sticks", names: ["㉠", "㉡", "㉢", "㉣"], fixed: true, unit: "cm", intro: () => "막대 ㉠, ㉡, ㉢, ㉣을 나란히 놓고 길이를 견주어 보았습니다.", ask: (a, b) => `막대 ${josaName(a, "과", "와")} ${b}의 길이 차는 몇 cm일까요?`, clue: (l, r, d, up) => `${josaName(l, "은", "는")} ${r}보다 ${d}cm 더 ${up ? "깁니다" : "짧습니다"}.` }
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
    ? `위에 색칠한 다섯 칸 조각(펜토미노)만 ${countWord} 개 써서 아래 도형을 빈틈없이 덮으려고 합니다. 조각은 돌리거나 뒤집어 놓아도 됩니다. 칸의 선을 따라 조각의 경계를 그리세요.`
    : spec.same
      ? `작은 정사각형 ${spec.size}칸을 변끼리 이은 조각을 ${word}라고 해요. 아래 도형을 칸의 선을 따라 똑같은 모양의 ${word} ${countWord} 개로 나누어 경계를 그리세요.`
      : `작은 정사각형 5칸을 변끼리 이은 조각을 펜토미노라고 해요. 위에 있는 펜토미노 가운데 두 개로 아래 도형을 빈틈없이 덮으려고 합니다. 칸의 선을 따라 두 조각의 경계를 그리세요.`;
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
const ORDER_COUNT = Object.freeze(["", "한", "두", "세", "네", "다섯"]);

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
      out.push({ kind: "abs", who: [x], text: behind ? `${x}보다 뒤에 선 사람은 ${behind}명입니다.` : `${josa(x, "이", "가")} 맨 뒤에 서 있습니다.`, test: (q) => q[x] === p });
      if (p > 1) out.push({ kind: "abs", who: [x], text: `${x}보다 앞에 선 사람은 ${p - 1}명입니다.`, test: (q) => q[x] === p });
    }
    for (const y of names) {
      if (x === y) continue;
      const k = pos[y] - p;
      if (mode === "line") {
        if (k > 0) out.push({ kind: "rel", who: [x, y], text: k === 1 ? `${josa(y, "은", "는")} ${x} 바로 뒤에 서 있습니다.` : `${josa(y, "은", "는")} ${x}보다 ${ORDER_COUNT[k]} 자리 뒤에 서 있습니다.`, test: (q) => q[y] - q[x] === k });
        if (k < 0 && -k > 1) out.push({ kind: "rel", who: [x, y], text: `${josa(y, "은", "는")} ${x}보다 ${ORDER_COUNT[-k]} 자리 앞에 서 있습니다.`, test: (q) => q[y] - q[x] === k });
      } else if (mode === "seat") {
        if (k > 0) out.push({ kind: "rel", who: [x, y], text: `${josa(y, "은", "는")} ${x}에서 오른쪽으로 ${ORDER_ORDINAL[k]} 번째 자리에 있습니다.`, test: (q) => q[y] - q[x] === k });
        if (k < 0) out.push({ kind: "rel", who: [x, y], text: `${josa(y, "은", "는")} ${x}에서 왼쪽으로 ${ORDER_ORDINAL[-k]} 번째 자리에 있습니다.`, test: (q) => q[y] - q[x] === k });
      } else if (mode === "row") {
        if (k > 0) out.push({ kind: "ord", who: [y, x], text: `${josa(y, "은", "는")} ${x}의 오른쪽에 서 있습니다.`, test: (q) => q[y] > q[x] });
        if (k < 0) out.push({ kind: "ord", who: [y, x], text: `${josa(y, "은", "는")} ${x}의 왼쪽에 서 있습니다.`, test: (q) => q[y] < q[x] });
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
      ask = { pos: p, text: n % 2 && p === (n + 1) / 2 ? "줄의 한가운데에 선 사람은 누구일까요?" : `앞에서 ${ORDER_ORDINAL[p]} 번째 자리에 선 사람은 누구일까요?` };
    } else if (mode === "race") {
      const p = randomInt(2, n - 1);
      ask = { pos: p, text: `${p}등은 누구일까요?` };
    } else if (mode === "row") {
      const p = randomInt(2, n - 1);
      ask = { pos: p, mark: true, text: "㉠ 자리에 선 사람은 누구일까요?" };
    } else {
      const from = pick(names);
      const options = [1, 2, 3].flatMap((k) => [k, -k]).filter((k) => truth[from] + k >= 1 && truth[from] + k <= n);
      const k = pick(options);
      ask = { from, k, pos: truth[from] + k, text: `${from}에서 ${k > 0 ? "오른쪽" : "왼쪽"}으로 ${ORDER_ORDINAL[Math.abs(k)]} 번째 자리에 앉은 사람은 누구일까요?` };
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
    const mark = (i) => (puzzle.ask.mark && puzzle.ask.pos === i + 1 ? "㉠" : "");
    boxes = `<div style="display:flex;align-items:center;justify-content:center;gap:6px;${FONT};font-size:14px;color:#2f3a40"><span>${ends[0]}</span><div style="display:flex">${Array.from({ length: n }, (_, i) => `<span style="display:inline-flex;align-items:center;justify-content:center;${cellStyle};margin-left:-1px;font-size:16px">${mark(i)}</span>`).join("")}</div><span>${ends[1]}</span></div>`;
  }
  return `<div style="display:inline-block;max-width:100%">${list}${boxes}</div>`;
}

// 이름 목록 끝에 주격 조사(이/가)를 받침에 맞춰 붙인다.
const listJosa = (names) => `${names.slice(0, -1).join(", ")}, ${josa(names[names.length - 1], "이", "가")}`;

function orderPuzzleProblem({ difficulty = 2 } = {}, mode) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const n = mode === "seat" ? (d === 1 ? 5 : 6) : mode === "row" ? 4 : 5;
  const puzzle = makeOrderPuzzle({ mode, n, maxClues: mode === "seat" ? 5 : 4 });
  if (!puzzle) return null;
  const intro = mode === "row"
    ? `${listJosa(puzzle.names)} 옆으로 나란히 섰습니다.`
    : mode === "line"
    ? `${listJosa(puzzle.names)} 앞뒤로 한 줄을 섰습니다.`
    : mode === "seat"
      ? `긴 의자에 ${listJosa(puzzle.names)} 한 명씩 나란히 앉았습니다.`
      : `${listJosa(puzzle.names)} 달리기를 마쳤습니다. 들어온 순서를 알려 주는 말을 보고 답하세요.`;
  const order = [...puzzle.names].sort((a, b) => puzzle.truth[a] - puzzle.truth[b]);
  const orderText = mode === "line" ? `앞에서부터 ${order.join(", ")}` : mode === "seat" || mode === "row" ? `왼쪽부터 ${order.join(", ")}` : `1등부터 ${order.join(", ")}`;
  return {
    prompt: `${intro} ${puzzle.ask.text}`,
    answer: puzzle.answer,
    solution: `${mode === "race" ? "등수가 바로 정해지는 조건부터 칸에 써 넣고, 누가 먼저 들어왔는지 말하는 조건으로 나머지 칸을 채웁니다." : mode === "row" ? "같은 사람이 나오는 조건끼리 이어 왼쪽에서 오른쪽으로 한 줄에 놓아 봅니다." : "자리가 바로 정해지는 조건부터 칸에 써 넣고, 두 사람이 몇 자리 떨어져 있는지 말하는 조건으로 나머지 칸을 채웁니다."} 조건을 모두 따르면 ${orderText}의 순서 한 가지뿐입니다. 따라서 답은 ${puzzle.answer}입니다.`,
    visual: { kind: "fig", html: orderBoxesHtml(puzzle, mode) },
    meta: { family: "order-offset-placement-b4", mode, clues: puzzle.clues.map((c) => c.text), order, answer: puzzle.answer }
  };
}

// ── 4단원 · 위에서부터 센 층 ─────────────────────────────
// 교재 확인 2-2·연습 15: 몇 층짜리 건물에서 위에서부터 세어 몇 번째인 집이 몇 층인지(또는 그 반대) 구한다.
const FLOOR_PEOPLE = Object.freeze(["하늘", "보람", "다솜", "누리", "한솔", "새롬", "이슬", "온유"]);

function floorFromTop({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  let total;
  let fromTop;
  let floor;
  do {
    total = randomInt(d === 1 ? 5 : 8, d === 1 ? 9 : d === 2 ? 15 : 25);
    fromTop = randomInt(2, total - 1);
    floor = total - fromTop + 1;
  } while (floor === fromTop); // 위에서 센 수와 층수가 같으면 거꾸로 세지 않아도 맞으므로 다시
  const who = pick(FLOOR_PEOPLE);
  const askFloor = d === 1 || Math.random() < 0.6;
  const prompt = askFloor
    ? `${josa(who, "은", "는")} ${total}층까지 있는 건물에 삽니다. 꼭대기 층부터 아래로 한 층씩 세어 내려가면 ${who}네 층은 ${fromTop}번째입니다. ${who}네는 몇 층일까요?`
    : `${josa(who, "은", "는")} ${total}층까지 있는 건물의 ${floor}층에 삽니다. 꼭대기 층부터 아래로 한 층씩 세어 내려가면 ${who}네 층은 몇 번째일까요?`;
  return {
    prompt,
    answer: askFloor ? `${floor}층` : `${fromTop}번째`,
    solution: `맨 위층이 위에서 첫 번째인 ${total}층입니다. 한 층씩 내려갈 때마다 위에서 센 순서는 1씩 늘고 층수는 1씩 줄어들므로 위에서 ${fromTop}번째는 ${total} − ${fromTop} + 1 = ${floor}층입니다.${askFloor ? "" : ` 따라서 ${floor}층은 위에서 ${fromTop}번째입니다.`}`,
    meta: { family: "floor-from-top-b4", total, fromTop, floor, askFloor }
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
    prompt: "빨간 선 그림을 가운데를 중심으로 돌리려고 합니다. 칸 아래에 적힌 만큼 돌린 모양을 빈 칸에 각각 그리세요.",
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
    prompt: "빨간 선 그림을 칸 아래에 적힌 쪽으로 뒤집었을 때의 모양을 빈 칸에 각각 그리세요.",
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
    prompt: `막대로 쓴 숫자 ${num}${hasBatchim(String(num)) ? "을" : "를"} 화살표 아래에 적힌 대로 움직여 빈 틀에 그리세요. (1)은 두 번 뒤집고, (2)는 한 번 돌립니다. (3) (1)과 (2)를 견주어 보면, ${doing[order[0]]} 이어서 ${done[order[1]]} 결과는 무엇을 한 것과 같나요?`,
    answer: "(1)·(2) 그림 답안, (3) 반 바퀴 돌린 것과 같습니다.",
    responseKind: "drawing",
    solution: `오른쪽으로 뒤집으면 왼쪽 막대와 오른쪽 막대가 서로 바뀌고, 아래로 뒤집으면 위 막대와 아래 막대가 서로 바뀝니다. 두 번 뒤집으면 위아래와 왼쪽·오른쪽이 모두 바뀌므로 (2)의 반 바퀴 돌린 모양과 똑같습니다. 그래서 (3)은 반 바퀴 돌린 것과 같습니다.`,
    visual: { kind: "fig", html: `<div style="display:inline-block;text-align:left">${q1}${q2}</div>` },
    answerVisual: { kind: "fig", html: `<div style="display:inline-block;text-align:left">${a1}${a2}</div>` },
    meta: { family: "digital-flip-turn-set-b4", digit, order, start, mid, end, half }
  };
}

// ── 1단원 · 세 번 움직이기(뒤집고 돌리고 뒤집기) + 숫자 1 따라가기 + 숫자판 ─────────
// 교재 활동 2-5, 2-6·연습 16: 뒤집기 → 돌리기 → 뒤집기 세 단계를 (1) 숫자 1로 따라가 그리고,
//   (2) 여러 방향으로 놓인 숫자 네 개(2×2)를 같은 방법으로 움직였을 때 똑바로 놓이는 수를 찾는다.
// 도전 4: 같은 꼴에 3×3 숫자판, 똑바로 놓이는 수들의 합.
// 숫자마다 놓인 방향을 2×2 행렬로 두고, 판 전체 움직임을 곱해 「처음 그대로(I)」가 되는 칸만 똑바로 선다.

const MOVE = Object.freeze({
  I: [1, 0, 0, 1], LR: [-1, 0, 0, 1], UD: [1, 0, 0, -1], R180: [-1, 0, 0, -1],
  CW: [0, -1, 1, 0], CCW: [0, 1, -1, 0], T: [0, 1, 1, 0], AT: [0, -1, -1, 0]
});
const matMul = (a, b) => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
const matKey = (m) => Object.keys(MOVE).find((k) => MOVE[k].every((v, i) => v === m[i]));
const FLIPS = Object.freeze([
  { key: "LR", doing: "왼쪽으로 뒤집고", label: "왼쪽으로 뒤집기" },
  { key: "LR", doing: "오른쪽으로 뒤집고", label: "오른쪽으로 뒤집기" },
  { key: "UD", doing: "위로 뒤집고", label: "위로 뒤집기" },
  { key: "UD", doing: "아래로 뒤집고", label: "아래로 뒤집기" }
]);
const TURNS = Object.freeze([
  { key: "CW", doing: "시계 방향으로 반의 반 바퀴 돌린 후", label: "시계 방향 반의 반 바퀴" },
  { key: "CCW", doing: "시계 반대 방향으로 반의 반 바퀴 돌린 후", label: "시계 반대 방향 반의 반 바퀴" },
  { key: "R180", doing: "반 바퀴 돌린 후", label: "반 바퀴" }
]);

function glyphSvg(digit, key, { size = 40, box = true } = {}) {
  const m = MOVE[key];
  const c = size / 2;
  const frame = box ? `<rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" fill="#fff" stroke="#1f6f86" stroke-width="1.2"/>` : "";
  const text = digit === null ? "" : `<g transform="translate(${c} ${c}) matrix(${m[0]},${m[2]},${m[1]},${m[3]},0,0)"><text x="0" y="${size * 0.25}" text-anchor="middle" font-size="${size * 0.7}" font-weight="700" fill="#d2372c" style="font-family:Arial,Helvetica,sans-serif">${digit}</text></g>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="width:${size}px;height:auto;flex:none" aria-hidden="true">${frame}${text}</svg>`;
}

function boardSvg(cells, n) {
  const size = n === 2 ? 46 : 42;
  const W = n * size + 2;
  let body = "";
  cells.forEach((cell, i) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const m = MOVE[cell.key];
    const cx = 1 + c * size + size / 2;
    const cy = 1 + r * size + size / 2;
    body += `<rect x="${1 + c * size}" y="${1 + r * size}" width="${size}" height="${size}" fill="#fff" stroke="#1f6f86" stroke-width="1.2"/>`;
    body += `<g transform="translate(${cx} ${cy}) matrix(${m[0]},${m[2]},${m[1]},${m[3]},0,0)"><text x="0" y="${size * 0.24}" text-anchor="middle" font-size="${size * 0.62}" fill="#1f2a30" style="font-family:Arial,Helvetica,sans-serif">${cell.value}</text></g>`;
  });
  return `<svg width="${W}" height="${W}" viewBox="0 0 ${W} ${W}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="여러 방향으로 놓인 숫자판">${body}</svg>`;
}

// 6·9·8은 돌리거나 뒤집으면 다른 숫자나 같은 모양으로 읽힐 수 있다(6을 반 바퀴 = 9, 8을 좌우로 뒤집기 = 8).
// 그래서 이 숫자들은 어떻게 읽어도 똑바로 서지 않는 방향에만 두고, 처음부터 똑바로 보이는 방향에도 두지 않는다.
const LOOK_ALIKE = Object.freeze({ 6: ["I", "R180"], 9: ["I", "R180"], 8: ["I", "LR", "UD", "R180"] });
function safeKeysFor(value, inverse) {
  const same = LOOK_ALIKE[value];
  if (!same) return Object.keys(MOVE).filter((k) => k !== inverse && k !== "I");
  return Object.keys(MOVE).filter((k) => same.every((s) => matKey(matMul(MOVE[s], MOVE[k])) !== inverse && matKey(matMul(MOVE[s], MOVE[k])) !== "I"));
}

function digitalThreeMovesBoard({ difficulty = 2 } = {}, n) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const first = pick(FLIPS);
    const turn = pick(TURNS);
    const last = pick(FLIPS.filter((f) => f.key !== first.key || Math.random() < 0.3));
    const total = matMul(MOVE[last.key], matMul(MOVE[turn.key], MOVE[first.key]));
    const totalKey = matKey(total);
    if (totalKey === "I") continue;
    // 숫자 1을 따라가며 그릴 세 모양
    const steps = [];
    let cur = MOVE.I;
    for (const op of [first, turn, last]) { cur = matMul(MOVE[op.key], cur); steps.push(matKey(cur)); }
    // 판 전체를 total로 움직이면 처음 방향 M인 칸은 total·M 방향이 된다. 똑바로 서려면 M = total의 거꾸로.
    const inverse = Object.keys(MOVE).find((k) => matKey(matMul(total, MOVE[k])) === "I");
    const values = n === 2 ? shuffle([1, 2, 3, 4, 5, 7]).slice(0, 4) : shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const uprightCount = n === 2 ? 1 : randomInt(2, 4);
    const plain = values.map((v, i) => [v, i]).filter(([v]) => !LOOK_ALIKE[v]).map(([, i]) => i);
    const uprightIdx = new Set(shuffle(plain).slice(0, uprightCount));
    // 처음부터 똑바로 선 칸은 두지 않는다(움직임과 상관없이 고르게 되므로).
    if (inverse === "I") continue;
    if (values.some((value, i) => !uprightIdx.has(i) && !safeKeysFor(value, inverse).length)) continue;
    const cells = values.map((value, i) => ({ value, key: uprightIdx.has(i) ? inverse : pick(safeKeysFor(value, inverse)) }));
    const upright = cells.filter((cell) => matKey(matMul(total, MOVE[cell.key])) === "I").map((cell) => cell.value);
    if (upright.length !== uprightCount) continue;
    const sum = upright.reduce((a, b) => a + b, 0);
    const answerValue = n === 2 ? upright[0] : sum;
    const ops = [first, turn, last];
    const strip = `<div style="${FONT};font-size:14px;color:#1f2a30;margin-bottom:8px">${ops.map((op) => `<span style="display:inline-block;border:1px solid #b7d6de;border-radius:8px;padding:3px 8px;margin:2px">${esc(op.label)}</span>`).join(" → ")}</div>`;
    const arrow = `<span style="color:#2f7d8f;font-size:18px">→</span>`;
    const follow = (shown) => `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">${glyphSvg(1, "I")}${shown.map((k) => `${arrow}${glyphSvg(k ? 1 : null, k || "I")}`).join("")}</div>`;
    const q = `<div style="display:inline-block;text-align:left">${strip}<div style="${FONT};font-size:14px;margin:6px 0 4px">(1)</div>${follow([null, null, null])}<div style="${FONT};font-size:14px;margin:12px 0 4px">(2)</div>${boardSvg(cells, n)}</div>`;
    const a = `<div style="display:inline-block;text-align:left"><div style="${FONT};font-size:14px;margin:0 0 4px">(1)</div>${follow(steps)}</div>`;
    const whatWord = n === 2 ? "똑바로 놓이는 수를 구하세요." : "똑바로 놓이는 수들의 합을 구하세요.";
    return {
      prompt: `위에 적힌 세 가지 움직임을 차례로 합니다. (1) 숫자 1이 움직임마다 어떻게 놓이는지 빈 칸에 차례로 그리세요. (2) 숫자판 전체를 똑같이 세 번 움직였을 때 ${whatWord}`,
      answer: `(1) 그림 답안, (2) ${answerValue}`,
      responseKind: "drawing",
      solution: `(1) 숫자 1을 한 번에 하나씩 움직여 그립니다. 세 번 움직인 1의 모양은 처음 1을 한 번에 어떻게 움직인 것과 같은지 보여 줍니다. (2) 숫자판의 각 수가 지금 놓인 모양을 세 번 움직인 1의 모양과 견주어, 움직인 뒤 처음 1처럼 똑바로 서게 되는 수를 찾습니다. ${n === 2 ? `똑바로 놓이는 수는 ${answerValue}입니다.` : `똑바로 놓이는 수는 ${upright.join(", ")}이므로 합은 ${upright.join(" + ")} = ${sum}입니다.`}`,
      visual: { kind: "fig", html: q },
      answerVisual: { kind: "fig", html: a },
      meta: { family: "digital-three-moves-board-b4", n, ops: ops.map((op) => op.key), steps, cells, upright, answer: answerValue }
    };
  }
  return null;
}

// ════════════════════════════════════════════════════════════════
// 남은 번호(2차, 2026-11-28) — 1단원 칸 도형 모두 그리기·같은 조각으로 덮기·똑같이 나누기,
// 2단원 두 번 접어 모서리 자르기·피라미드 쌓기나무, 3단원 나이 목록, 4단원 자리·등수 조건.
// ════════════════════════════════════════════════════════════════

const KOR_ORD = Object.freeze(["", "첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟"]);
const circled = (n) => "①②③④⑤⑥⑦⑧"[n - 1];
const clueListHtml = (clues) => `<ul style="margin:0 0 12px;padding:10px 16px 10px 30px;background:#e3f1f4;border-radius:12px;line-height:1.75;${FONT};font-size:15px;color:#1f2a30;text-align:left">${clues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
const capWrap = (svg, caption) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${svg}<span style="${FONT};font-size:13px;color:#2f3a40">${esc(caption)}</span></div>`;

// 빈 모눈(그리는 칸)
function blankGridSvg(rows, cols, { cell = 16 } = {}) {
  const pad = 2;
  const W = cols * cell + pad * 2;
  const H = rows * cell + pad * 2;
  let d = "";
  for (let r = 1; r < rows; r += 1) d += `M${pad} ${pad + r * cell}H${pad + cols * cell}`;
  for (let c = 1; c < cols; c += 1) d += `M${pad + c * cell} ${pad}V${pad + rows * cell}`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="빈 모눈"><rect x="${pad}" y="${pad}" width="${cols * cell}" height="${rows * cell}" fill="#fff" stroke="#1f6f86" stroke-width="1.6"/><path d="${d}" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/></svg>`;
}

const polyCanon = (cells) => polyOrientations(cells).map(polyKey).sort()[0];
const rectCells = (rows, cols) => Array.from({ length: rows * cols }, (_, i) => [Math.floor(i / cols), i % cols]);

// ── 1단원 활동 1-1 · 서로 다른 칸 조각(테트로미노·펜토미노) 모두 그리기 ─────────
// 교재: 테트로미노를 모두 그린다. 여기서는 몇 가지는 미리 그려 두고(돌리거나 뒤집은 모양으로) 나머지를 그리며 모두 몇 가지인지 쓴다.
function polyominoAllDraw({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const size = d === 3 ? 5 : 4;
  const ids = Object.keys(POLY_BASE[size]);
  const givenCount = d === 1 ? randomInt(2, 3) : d === 2 ? randomInt(0, 2) : randomInt(6, 8);
  const given = shuffle(ids).slice(0, givenCount).map((id) => ({ id, cells: pick(POLY_ORIENTS[size][id]) }));
  const givenIds = new Set(given.map((g) => g.id));
  const missing = ids.filter((id) => !givenIds.has(id)).map((id) => ({ id, cells: POLY_BASE[size][id] }));
  const word = POLY_WORD[size];
  const shelf = given.length
    ? `<div style="${FONT};font-size:13px;color:#2f3a40;margin-bottom:4px">이미 그린 모양</div><div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;justify-content:center;padding:8px 12px;border:1px solid #b7d6de;border-radius:10px;margin-bottom:10px">${given.map((g) => pieceSvg(g.cells, { cell: 15, fill: "#dcedf2" })).join("")}</div>`
    : "";
  const grid = blankGridSvg(size === 4 ? 5 : 7, size === 4 ? 12 : 16, { cell: 28 });
  const prompt = `작은 정사각형 ${size}칸을 변끼리 이어 붙인 모양을 ${word}라고 합니다. 돌리거나 뒤집어서 꼭 겹쳐지는 모양은 같은 것으로 봅니다. 서로 다른 ${word}는 모두 몇 가지인지 쓰고, ${given.length ? "이미 그린 모양을 뺀 나머지를" : "서로 다른 모양을 모두"} 모눈에 그리세요.`;
  const solution = size === 4
    ? `가장 긴 줄의 칸 수로 나누어 찾습니다. 네 칸이 한 줄(1가지), 세 칸 줄의 끝이나 가운데에 한 칸을 붙인 모양(2가지), 두 칸씩 두 줄로 나란히 붙이거나 엇갈려 붙인 모양(2가지)을 더하면 모두 5가지입니다.${given.length ? " 이미 그린 모양을 빼고 나머지를 그립니다." : ""}`
    : `가장 긴 줄의 칸 수가 5칸(1가지), 4칸(2가지), 3칸(7가지), 2칸(2가지)인 모양으로 나누어 빠짐없이 찾으면 모두 12가지입니다. 돌리거나 뒤집어 같아지는 모양은 한 번만 셉니다.`;
  return {
    prompt,
    answer: `${ids.length}가지`,
    responseKind: "drawing",
    solution,
    visual: { kind: "fig", html: `${shelf}${grid}` },
    answerVisual: { kind: "fig", html: `<div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;justify-content:center">${missing.map((m) => pieceSvg(m.cells, { cell: 15, fill: "#bfe0ea" })).join("")}</div>` },
    meta: { family: "polyomino-all-draw-b4", size, given, missing: missing.map((m) => m.id), total: ids.length }
  };
}

// ── 1단원 활동 1-2 · 같은 조각 여러 개로 직사각형을 덮을 수 없는 조각 고르기 ─────────
const TILE_TARGETS = Object.freeze({
  1: { size: 4, rects: [[4, 4], [2, 4], [4, 6]] },
  2: { size: 4, rects: [[3, 4], [2, 8], [4, 5], [2, 6], [4, 4]] },
  3: { size: 5, rects: [[2, 5], [3, 5], [4, 5]] }
});
const tilingMemo = new Map();
function rectTilingWith(rows, cols, size, id) {
  const key = `${rows}x${cols}:${size}${id}`;
  if (!tilingMemo.has(key)) tilingMemo.set(key, countTilings(rectCells(rows, cols), { [id]: POLY_ORIENTS[size][id] }, { same: true, limit: 1 }).tiling);
  return tilingMemo.get(key);
}

function samePieceRectTiling({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const spec = TILE_TARGETS[d];
  for (let attempt = 0; attempt < 60; attempt += 1) {
    let [rows, cols] = pick(spec.rects);
    if (Math.random() < 0.5) [rows, cols] = [cols, rows];
    const ids = spec.size === 4 ? shuffle(Object.keys(POLY_BASE[4])) : shuffle(Object.keys(POLY_BASE[5])).slice(0, 6);
    const options = ids.map((id, i) => ({ option: i + 1, id, cells: pick(POLY_ORIENTS[spec.size][id]), tiling: rectTilingWith(rows, cols, spec.size, id) }));
    const cannot = options.filter((o) => !o.tiling);
    if (!cannot.length || cannot.length === options.length) continue;
    const k = (rows * cols) / spec.size;
    const shapeWord = rows === cols ? `한 변이 ${rows}칸인 정사각형` : `가로 ${cols}칸, 세로 ${rows}칸인 직사각형`;
    const optionHtml = options.map((o) => capWrap(pieceSvg(o.cells, { cell: 14 }), circled(o.option))).join("");
    const answer = cannot.map((o) => `${o.option}번`).join(", ");
    const can = options.filter((o) => o.tiling);
    const answerFigs = can.map((o) => capWrap(regionSvg(rectCells(rows, cols), { tiling: o.tiling, cell: 16 }), `${circled(o.option)} 조각 ${k}개`));
    return {
      prompt: `같은 모양의 조각 ${k}개를 빈틈없이 붙여 ${shapeWord}을 만들려고 합니다. 조각은 돌리거나 뒤집어 놓아도 됩니다. 같은 조각 ${k}개로 이 모양을 만들 수 없는 조각을 모두 고르세요.`,
      answer,
      solution: `칸 수는 ${rows * cols}칸이므로 ${spec.size}칸 조각이 ${k}개 필요합니다. 모서리 칸부터 조각을 하나씩 놓아 보면 ${can.map((o) => circled(o.option)).join(", ")} 조각은 그림처럼 빈틈없이 덮을 수 있지만, ${cannot.map((o) => circled(o.option)).join(", ")} 조각은 어떻게 놓아도 덮이지 않는 칸이 남습니다. 따라서 답은 ${answer}입니다.`,
      visual: { kind: "fig", html: `<div style="display:flex;flex-wrap:wrap;gap:10px 20px;align-items:flex-end;justify-content:center;padding:10px 12px;border:1px solid #b7d6de;border-radius:12px;margin-bottom:10px">${optionHtml}</div>${rowWrap([blankGridSvg(rows, cols, { cell: 26 }), blankGridSvg(rows, cols, { cell: 26 })])}` },
      answerVisual: { kind: "fig", html: rowWrap(answerFigs) },
      meta: { family: "same-piece-rect-tiling-b4", size: spec.size, rows, cols, options: options.map((o) => ({ option: o.option, id: o.id, cells: o.cells })), cannot: cannot.map((o) => o.option) }
    };
  }
  return null;
}

// ── 똑같은 두 조각으로 나누는 방법 모두 찾기(정사각형 칸·삼각형 칸 공용) ─────────
// cells를 같은 수의 두 덩어리로 나누어(두 덩어리 모두 이어져 있어야 함) 두 조각이 돌리거나 뒤집어 꼭 겹치는 방법을
// 조각 모양마다 하나씩 모은다(교재: 「조각을 돌리거나 뒤집었을 때 같은 도형이면 한 가지로 봅니다」).
function congruentHalvesAll(cells, adjacent, canon) {
  const N = cells.length;
  if (N % 2 || N > 20) return [];
  const nbr = cells.map((a, i) => cells.map((b, j) => (i !== j && adjacent(a, b) ? j : -1)).filter((j) => j >= 0));
  const connected = (mask) => {
    let start = -1;
    for (let i = 0; i < N; i += 1) if ((mask >> i) & 1) { start = i; break; }
    if (start < 0) return false;
    let seen = 1 << start;
    const stack = [start];
    while (stack.length) {
      const i = stack.pop();
      for (const j of nbr[i]) if (((mask >> j) & 1) && !((seen >> j) & 1)) { seen |= 1 << j; stack.push(j); }
    }
    return seen === mask;
  };
  const full = (1 << N) - 1;
  const ways = new Map();
  for (let mask = 1; mask < full; mask += 2) {
    let pc = 0;
    for (let x = mask; x; x &= x - 1) pc += 1;
    if (pc !== N / 2) continue;
    const other = full ^ mask;
    if (!connected(mask) || !connected(other)) continue;
    const A = cells.filter((_, i) => (mask >> i) & 1);
    const B = cells.filter((_, i) => (other >> i) & 1);
    const key = canon(A);
    if (key !== canon(B) || ways.has(key)) continue;
    ways.set(key, { A, B });
  }
  return [...ways.values()];
}

// 1단원 도전 1, 2 · 직사각형(정사각형)을 똑같은 두 조각으로 나누는 방법 모두
const sqAdjacent = ([r1, c1], [r2, c2]) => Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
const rectHalvesMemo = new Map();
function rectHalves(rows, cols) {
  const key = `${rows}x${cols}`;
  if (!rectHalvesMemo.has(key)) rectHalvesMemo.set(key, congruentHalvesAll(rectCells(rows, cols), sqAdjacent, polyCanon));
  return rectHalvesMemo.get(key);
}
const RECT_HALF_SIZES = Object.freeze({ 1: [[2, 4], [2, 5], [2, 6]], 2: [[3, 4], [2, 8], [4, 4]], 3: [[4, 4], [3, 4], [2, 8]] });

function rectHalvesAllWays({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  let [rows, cols] = pick(RECT_HALF_SIZES[d]);
  if (rows !== cols && Math.random() < 0.5) [rows, cols] = [cols, rows];
  const ways = rectHalves(rows, cols);
  if (ways.length < 2) return null;
  const exampleIndex = randomInt(0, ways.length - 1);
  const all = rectCells(rows, cols);
  const draw = (w, label = "") => regionSvg(all, { tiling: [{ cells: w.A }, { cells: w.B }], cell: 18, label, shade: new Set(w.A.map(([r, c]) => `${r},${c}`)) });
  const example = draw(ways[exampleIndex], "보기");
  const blanks = Array.from({ length: 6 }, () => regionSvg(all, { cell: 18 }));
  const shapeWord = rows === cols ? `한 변이 ${rows}칸인 정사각형` : `가로 ${cols}칸, 세로 ${rows}칸인 직사각형`;
  return {
    prompt: `${shapeWord}을 점선을 따라 잘라 모양과 크기가 같은 두 조각으로 나누려고 합니다. 나누어진 조각을 돌리거나 뒤집었을 때 같은 모양이면 한 가지로 봅니다. 보기의 방법까지 넣어 나누는 방법은 모두 몇 가지인지 쓰고, 보기와 다른 방법을 빈 모눈에 그리세요.`,
    answer: `${ways.length}가지`,
    responseKind: "drawing",
    solution: `두 조각은 ${(rows * cols) / 2}칸씩입니다. 똑같은 두 조각은 가운데 점을 중심으로 반 바퀴 돌리거나 뒤집으면 서로 겹치므로, 자르는 선도 가운데를 지나며 반 바퀴 돌려도 같은 모양이 됩니다. 가운데에서 시작해 한 칸씩 꺾어 나가며 빠짐없이 찾고 조각 모양이 같은 것은 한 번만 세면 모두 ${ways.length}가지입니다.`,
    visual: { kind: "fig", html: `${rowWrap([example])}<div style="height:8px"></div>${rowWrap(blanks)}` },
    answerVisual: { kind: "fig", html: rowWrap(ways.map((w) => draw(w))) },
    meta: { family: "rect-halves-all-ways-b4", rows, cols, example: ways[exampleIndex].A, ways: ways.map((w) => w.A), total: ways.length }
  };
}

// 1단원 연습 5 · 삼각형 칸으로 된 도형을 똑같은 두 조각으로 나누는 방법 모두
// 삼각형 하나 = [a, b, 위(1)/아래(0)], 꼭짓점은 비스듬한 좌표 (a, b) — 화면 좌표는 (a + b/2, b × √3/2).
const triVerts = ([a, b, u]) => (u ? [[a, b], [a + 1, b], [a, b + 1]] : [[a + 1, b], [a, b + 1], [a + 1, b + 1]]);
const triAdjacent = (t1, t2) => {
  const s = new Set(triVerts(t1).map(String));
  return triVerts(t2).filter((p) => s.has(String(p))).length === 2;
};
function triCanon(tris) {
  const rot = ([a, b]) => [-b, a + b];
  const keys = [];
  for (const flip of [false, true]) {
    let cur = tris.map((t) => triVerts(t).map(([a, b]) => (flip ? [b, a] : [a, b])));
    for (let r = 0; r < 6; r += 1) {
      cur = cur.map((t) => t.map(rot));
      const a0 = Math.min(...cur.flat().map((p) => p[0]));
      const b0 = Math.min(...cur.flat().map((p) => p[1]));
      keys.push(cur.map((t) => t.map(([a, b]) => [a - a0, b - b0]).sort((x, y) => x[0] - y[0] || x[1] - y[1]).join(";")).sort().join("|"));
    }
  }
  return keys.sort()[0];
}
const TRI_SHAPES = Object.freeze({
  hex2: [[0, 0], [2, 0], [2, 1], [1, 2], [-1, 2], [-1, 1]],
  hex3: [[0, 0], [3, 0], [3, 1], [2, 2], [-1, 2], [-1, 1]],
  hex4: [[0, 0], [4, 0], [4, 1], [3, 2], [-1, 2], [-1, 1]],
  para2: [[0, 0], [2, 0], [2, 2], [0, 2]],
  para3: [[0, 0], [3, 0], [3, 2], [0, 2]]
});
const TRI_LEVELS = Object.freeze({ 1: ["hex2", "para2", "hex3"], 2: ["hex3", "para3", "hex2"], 3: ["hex4", "para3", "hex3"] });
const triCart = ([a, b]) => [a + b / 2, (b * Math.sqrt(3)) / 2];
function trianglesInside(polyLattice) {
  const poly = polyLattice.map(triCart);
  const inside = ([x, y]) => {
    let sign = 0;
    for (let i = 0; i < poly.length; i += 1) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[(i + 1) % poly.length];
      const cr = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
      if (!sign) sign = Math.sign(cr);
      else if (Math.sign(cr) !== sign) return false;
    }
    return true;
  };
  const out = [];
  for (let a = -6; a < 10; a += 1) for (let b = -1; b < 5; b += 1) for (const u of [1, 0]) {
    const v = triVerts([a, b, u]).map(triCart);
    if (inside([(v[0][0] + v[1][0] + v[2][0]) / 3, (v[0][1] + v[1][1] + v[2][1]) / 3])) out.push([a, b, u]);
  }
  return out;
}
const triHalvesMemo = new Map();
function triHalves(name) {
  if (!triHalvesMemo.has(name)) {
    const tris = trianglesInside(TRI_SHAPES[name]);
    triHalvesMemo.set(name, { tris, ways: congruentHalvesAll(tris, triAdjacent, triCanon) });
  }
  return triHalvesMemo.get(name);
}

function triGridSvg(tris, { pieceA = null, unit = 30 } = {}) {
  const pts = tris.flatMap(triVerts).map(triCart);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y1 = Math.max(...ys);
  const pad = 4;
  const X = (p) => pad + (triCart(p)[0] - x0) * unit;
  const Y = (p) => pad + (y1 - triCart(p)[1]) * unit;
  const W = (Math.max(...xs) - x0) * unit + pad * 2;
  const H = (y1 - Math.min(...ys)) * unit + pad * 2;
  const inA = new Set((pieceA || []).map(String));
  const edgeOwners = new Map();
  tris.forEach((t) => {
    const v = triVerts(t);
    for (let i = 0; i < 3; i += 1) {
      const e = [v[i], v[(i + 1) % 3]].map(String).sort().join("~");
      if (!edgeOwners.has(e)) edgeOwners.set(e, { ends: [v[i], v[(i + 1) % 3]], owners: [] });
      edgeOwners.get(e).owners.push(t);
    }
  });
  let fills = "";
  tris.forEach((t) => {
    const fill = pieceA && inA.has(String(t)) ? "#cfe6ee" : "#fff";
    fills += `<polygon points="${triVerts(t).map((p) => `${X(p).toFixed(1)},${Y(p).toFixed(1)}`).join(" ")}" fill="${fill}"/>`;
  });
  let dashed = "";
  let outline = "";
  let cuts = "";
  for (const { ends: [p, q], owners } of edgeOwners.values()) {
    const seg = `M${X(p).toFixed(1)} ${Y(p).toFixed(1)}L${X(q).toFixed(1)} ${Y(q).toFixed(1)}`;
    if (owners.length === 1) outline += seg;
    else if (pieceA && inA.has(String(owners[0])) !== inA.has(String(owners[1]))) cuts += seg;
    else dashed += seg;
  }
  return `<svg width="${W.toFixed(0)}" height="${H.toFixed(0)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" style="width:${W.toFixed(0)}px;max-width:100%;height:auto" role="img" aria-label="삼각형 칸으로 된 도형">${fills}`
    + `<path d="${dashed}" fill="none" stroke="#4f8fa3" stroke-width="1" stroke-dasharray="3 3"/>`
    + (cuts ? `<path d="${cuts}" fill="none" stroke="#d2372c" stroke-width="3" stroke-linecap="round"/>` : "")
    + `<path d="${outline}" fill="none" stroke="#1f6f86" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

function triangleGridHalvesAll({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const name = pick(TRI_LEVELS[d]);
  const { tris, ways } = triHalves(name);
  if (ways.length < 2) return null;
  const blanks = Array.from({ length: 5 }, () => triGridSvg(tris, { unit: 26 }));
  return {
    prompt: "삼각형 칸으로 된 도형을 점선을 따라 잘라 모양과 크기가 같은 두 조각으로 나누려고 합니다. 나누어진 조각을 돌리거나 뒤집었을 때 같은 모양이면 한 가지로 봅니다. 나누는 방법은 모두 몇 가지인지 쓰고, 서로 다른 방법을 모두 그리세요.",
    answer: `${ways.length}가지`,
    responseKind: "drawing",
    solution: `삼각형 칸은 모두 ${tris.length}칸이므로 한 조각은 ${tris.length / 2}칸입니다. 두 조각은 가운데를 중심으로 반 바퀴 돌리거나 뒤집으면 겹쳐야 하므로, 자르는 선이 도형의 가운데를 지나도록 한 칸씩 바꾸어 가며 찾습니다. 조각 모양이 같은 것은 한 번만 세면 모두 ${ways.length}가지입니다.`,
    visual: { kind: "fig", html: rowWrap(blanks) },
    answerVisual: { kind: "fig", html: rowWrap(ways.map((w) => triGridSvg(tris, { pieceA: w.A, unit: 26 }))) },
    meta: { family: "triangle-grid-halves-b4", shape: name, tris, ways: ways.map((w) => w.A), total: ways.length }
  };
}

// ── 1단원 확인 1-3·연습 9 · 표시가 같은 수씩 들어가게 똑같은 네 부분으로 나누기 ─────────
// 우리(칸 도형) 안 여러 칸에 도토리가 있다. 모양과 크기가 같은 네 부분으로 나누되 부분마다 도토리 수가 같게(자리는 달라도 됨).
// 그 조건을 만족하는 나누기가 한 가지뿐일 때만 낸다.
const congruentPartitionMemo = new Map();
function congruentFourPartitions(rows, cols) {
  const key = `${rows}x${cols}`;
  if (congruentPartitionMemo.has(key)) return congruentPartitionMemo.get(key);
  const n = (rows * cols) / 4;
  const all = new Set(rectCells(rows, cols).map(([r, c]) => `${r},${c}`));
  const order = rectCells(rows, cols).map(([r, c]) => `${r},${c}`);
  const used = new Set();
  const pieces = [];
  const out = [];
  const grow = (first) => {
    let sets = new Map([[first, [first]]]);
    for (let s = 1; s < n; s += 1) {
      const next = new Map();
      for (const piece of sets.values()) for (const cell of piece) {
        const [r, c] = cell.split(",").map(Number);
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const k = `${r + dr},${c + dc}`;
          if (!all.has(k) || used.has(k) || piece.includes(k)) continue;
          const g = [...piece, k];
          next.set([...g].sort().join("|"), g);
        }
      }
      sets = next;
    }
    return [...sets.values()];
  };
  const run = (shape) => {
    const first = order.find((k) => !used.has(k));
    if (!first) { out.push(pieces.map((p) => p.map((k) => k.split(",").map(Number)))); return; }
    for (const piece of grow(first)) {
      const canon = polyCanon(piece.map((k) => k.split(",").map(Number)));
      if (shape && canon !== shape) continue;
      piece.forEach((k) => used.add(k));
      pieces.push(piece);
      run(shape || canon);
      pieces.pop();
      piece.forEach((k) => used.delete(k));
    }
  };
  run(null);
  congruentPartitionMemo.set(key, out);
  return out;
}

function acornSvgGrid(rows, cols, marks, { tiling = null, cell = 30 } = {}) {
  const region = rectCells(rows, cols);
  const base = regionSvg(region, { tiling, cell });
  const pad = 3;
  const acorn = ([r, c]) => {
    const cx = pad + c * cell + cell / 2;
    const cy = pad + r * cell + cell / 2;
    return `<g><ellipse cx="${cx}" cy="${cy + 3}" rx="${cell * 0.2}" ry="${cell * 0.24}" fill="#b5793d"/><path d="M${cx - cell * 0.24} ${cy - 1}Q${cx} ${cy - cell * 0.3} ${cx + cell * 0.24} ${cy - 1}Z" fill="#6e4a24"/><path d="M${cx} ${cy - cell * 0.2}V${cy - cell * 0.32}" stroke="#6e4a24" stroke-width="2"/></g>`;
  };
  return base.replace("</svg>", `${marks.map(acorn).join("")}</svg>`);
}

const BALANCED_LEVELS = Object.freeze({ 1: { rows: 4, cols: 4, per: [3] }, 2: { rows: 4, cols: 4, per: [2, 3] }, 3: { rows: 4, cols: 5, per: [2, 3] } });

function countBalancedPartition({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const spec = BALANCED_LEVELS[d];
  let [rows, cols] = [spec.rows, spec.cols];
  if (rows !== cols && Math.random() < 0.5) [rows, cols] = [cols, rows];
  const parts = congruentFourPartitions(rows, cols);
  const n = (rows * cols) / 4;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const truth = pick(parts);
    if (d > 1 && polyCanon(truth[0]) === polyCanon(POLY_BASE[n]?.I || [])) continue;
    const per = pick(spec.per);
    const marks = truth.flatMap((piece) => shuffle(piece).slice(0, per));
    const markSet = new Set(marks.map(String));
    const fits = parts.filter((p) => p.every((piece) => piece.filter((cell) => markSet.has(String(cell))).length === per));
    if (fits.length !== 1) continue;
    return {
      prompt: `우리 안의 칸 ${marks.length}곳에 도토리가 놓여 있습니다. 칸의 선을 따라 우리를 모양과 크기가 같은 네 부분으로 나누되, 부분마다 도토리가 같은 개수만큼 들어가게 울타리를 그리세요. 부분마다 도토리가 놓인 자리는 달라도 됩니다.`,
      answer: "그림 답안",
      responseKind: "drawing",
      solution: `칸은 ${rows * cols}칸이므로 한 부분은 ${n}칸이고, 도토리는 ${marks.length}개이므로 한 부분에 ${per}개씩 들어갑니다. 도토리가 없는 칸은 ${rows * cols - marks.length}칸이니 부분마다 ${n - per}칸씩 나누어 가집니다. 모서리 칸이 들어갈 부분부터 ${n}칸 조각을 정하며 도토리 수를 맞추면 나누는 방법은 그림과 같이 한 가지뿐입니다.`,
      visual: { kind: "fig", html: acornSvgGrid(rows, cols, marks) },
      answerVisual: { kind: "fig", html: acornSvgGrid(rows, cols, marks, { tiling: truth.map((cells) => ({ cells })) }) },
      meta: { family: "count-balanced-partition-b4", rows, cols, per, marks, pieces: truth }
    };
  }
  return null;
}

// ── 2단원 활동 1-1·연습 1 · 두 번 접어 모서리를 자르고 펼친 모양 그리기 ─────────
// 반으로 두 번(가로·세로) 또는 대각선으로 두 번 접은 뒤, 접힌 모양의 한 꼭짓점이나 한 변 쪽을 잘라 낸다.
// 펼친 모양은 마지막 접는 선부터 거꾸로 거울에 비춰 붙인 것.
const FOLD_PAIRS = Object.freeze({
  straight: [["아래로", "왼쪽으로"], ["아래로", "오른쪽으로"], ["위로", "왼쪽으로"], ["위로", "오른쪽으로"], ["왼쪽으로", "아래로"], ["왼쪽으로", "위로"], ["오른쪽으로", "아래로"], ["오른쪽으로", "위로"]],
  diagonal: [["대각선-내림", "대각선-오름"], ["대각선-오름", "대각선-내림"]]
});
function foldLineOf(word, poly) {
  const xs = poly.map((p) => p.x);
  const ys = poly.map((p) => p.y);
  const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const mx = (box.x0 + box.x1) / 2;
  const my = (box.y0 + box.y1) / 2;
  if (word === "아래로") return { a: { x: box.x0, y: my }, b: { x: box.x1, y: my }, keepPoint: { x: mx, y: box.y1 } };
  if (word === "위로") return { a: { x: box.x0, y: my }, b: { x: box.x1, y: my }, keepPoint: { x: mx, y: box.y0 } };
  if (word === "왼쪽으로") return { a: { x: mx, y: box.y0 }, b: { x: mx, y: box.y1 }, keepPoint: { x: box.x0, y: my } };
  if (word === "오른쪽으로") return { a: { x: mx, y: box.y0 }, b: { x: mx, y: box.y1 }, keepPoint: { x: box.x1, y: my } };
  if (word === "대각선-내림") return { a: { x: box.x0, y: box.y0 }, b: { x: box.x1, y: box.y1 }, keepPoint: { x: box.x0, y: box.y1 } };
  return { a: { x: box.x0, y: box.y1 }, b: { x: box.x1, y: box.y0 }, keepPoint: { x: box.x0, y: box.y0 } };
}
const lineSide = (line, p) => (line.b.x - line.a.x) * (p.y - line.a.y) - (line.b.y - line.a.y) * (p.x - line.a.x);
function reflectOver(line, p) {
  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const t = ((p.x - line.a.x) * dx + (p.y - line.a.y) * dy) / (dx * dx + dy * dy);
  return { x: 2 * (line.a.x + t * dx) - p.x, y: 2 * (line.a.y + t * dy) - p.y };
}
function foldedShape(words) {
  const { clip } = foldGeometryHelpers();
  let poly = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const lines = [];
  for (const word of words) {
    const line = foldLineOf(word, poly);
    const sign = Math.sign(lineSide(line, line.keepPoint)) || 1;
    poly = clip(poly, (p) => sign * lineSide(line, p));
    lines.push({ ...line, sign });
  }
  return { poly, lines };
}
const angleOf = (v) => Math.atan2(v.y, v.x);
function cornerCut(poly) {
  const n = poly.length;
  const i = randomInt(0, n - 1);
  const V = poly[i];
  const P = poly[(i + n - 1) % n];
  const Q = poly[(i + 1) % n];
  const u1 = { x: P.x - V.x, y: P.y - V.y };
  const u2 = { x: Q.x - V.x, y: Q.y - V.y };
  const l1 = Math.hypot(u1.x, u1.y);
  const l2 = Math.hypot(u2.x, u2.y);
  const L = Math.min(l1, l2) * (0.3 + Math.random() * 0.2);
  const e1 = { x: u1.x / l1, y: u1.y / l1 };
  const e2 = { x: u2.x / l2, y: u2.y / l2 };
  const right = Math.abs(e1.x * e2.x + e1.y * e2.y) < 1e-6;
  const kind = pick(right ? ["tri", "sq", "arc"] : ["tri", "arc"]);
  if (kind === "tri") return { kind, at: i, points: [V, { x: V.x + e1.x * L, y: V.y + e1.y * L }, { x: V.x + e2.x * L, y: V.y + e2.y * L }] };
  if (kind === "sq") return { kind, at: i, points: [V, { x: V.x + e1.x * L, y: V.y + e1.y * L }, { x: V.x + (e1.x + e2.x) * L, y: V.y + (e1.y + e2.y) * L }, { x: V.x + e2.x * L, y: V.y + e2.y * L }] };
  let a1 = angleOf(e1);
  let a2 = angleOf(e2);
  let diff = a2 - a1;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  const steps = 10;
  const pts = [V];
  for (let s = 0; s <= steps; s += 1) {
    const a = a1 + (diff * s) / steps;
    pts.push({ x: V.x + Math.cos(a) * L, y: V.y + Math.sin(a) * L });
  }
  return { kind, at: i, points: pts };
}
function edgeBandCut(poly) {
  const { clip } = foldGeometryHelpers();
  const n = poly.length;
  const i = randomInt(0, n - 1);
  const A = poly[i];
  const B = poly[(i + 1) % n];
  const cx = poly.reduce((t, p) => t + p.x, 0) / n;
  const cy = poly.reduce((t, p) => t + p.y, 0) / n;
  const base = { a: A, b: B };
  const sideIn = Math.sign(lineSide(base, { x: cx, y: cy })) || 1;
  const len = Math.hypot(B.x - A.x, B.y - A.y);
  const nx = (-(B.y - A.y) / len) * sideIn;
  const ny = ((B.x - A.x) / len) * sideIn;
  // 안쪽으로 높이를 재어 띠를 둔다(넓이의 가운데쯤, 변에 닿지 않게)
  const far = Math.max(...poly.map((p) => Math.abs(lineSide(base, p)) / len));
  const t1 = far * (0.3 + Math.random() * 0.15);
  const t2 = t1 + far * (0.18 + Math.random() * 0.1);
  const shift = (t) => ({ a: { x: A.x + nx * t, y: A.y + ny * t }, b: { x: B.x + nx * t, y: B.y + ny * t } });
  const l1 = shift(t1);
  const l2 = shift(t2);
  const s1 = Math.sign(lineSide(l1, { x: A.x + nx * t2, y: A.y + ny * t2 })) || 1;
  const s2 = Math.sign(lineSide(l2, { x: A.x + nx * t1, y: A.y + ny * t1 })) || 1;
  const band = clip(clip(poly, (p) => s1 * lineSide(l1, p)), (p) => s2 * lineSide(l2, p));
  return band.length >= 3 ? { kind: "band", at: i, points: band } : null;
}
const ptsAttr = (points, shift, top, size) => points.map((p) => `${(shift + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ");
function unfoldedSquareSvg(lines, holes, shift, top, size) {
  const crease = lines.map((l) => {
    // 접는 선을 정사각형 끝까지 늘려 긋는다
    const dx = l.b.x - l.a.x;
    const dy = l.b.y - l.a.y;
    const p = { x: l.a.x - dx * 3, y: l.a.y - dy * 3 };
    const q = { x: l.b.x + dx * 3, y: l.b.y + dy * 3 };
    const { clip } = foldGeometryHelpers();
    void clip;
    const cl = (v) => Math.max(0, Math.min(1, v));
    const ends = [];
    for (const t of [0, 1]) {
      // 정사각형 경계와의 교점(가운데 선·대각선이라 끝점이 경계 위에 있다)
      const s = t ? q : p;
      ends.push({ x: cl(s.x), y: cl(s.y) });
    }
    if (Math.abs(dx) > 1e-9 && Math.abs(dy) > 1e-9) return `<line x1="${shift}" y1="${top + (dy * dx > 0 ? 0 : size)}" x2="${shift + size}" y2="${top + (dy * dx > 0 ? size : 0)}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    return `<line x1="${(shift + ends[0].x * size).toFixed(1)}" y1="${(top + ends[0].y * size).toFixed(1)}" x2="${(shift + ends[1].x * size).toFixed(1)}" y2="${(top + ends[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  }).join("");
  const holeSvg = (holes || []).map((h) => `<polygon points="${ptsAttr(h, shift, top, size)}" fill="#fff" stroke="#b03a5b" stroke-width="1.4"/>`).join("");
  return `<rect x="${shift}" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>${crease}${holeSvg}`;
}

function foldCutTwoCornerUnfold({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const family = d === 1 ? "straight" : d === 2 ? pick(["straight", "diagonal"]) : "diagonal";
  const words = pick(FOLD_PAIRS[family]);
  const { poly, lines } = foldedShape(words);
  const cut = (d === 3 || Math.random() < 0.3) ? edgeBandCut(poly) || cornerCut(poly) : cornerCut(poly);
  let holes = [cut.points];
  for (let i = lines.length - 1; i >= 0; i -= 1) holes = holes.concat(holes.map((h) => h.map((p) => reflectOver(lines[i], p))));
  const finalCut = (shift, top, size) => `<polygon points="${ptsAttr(cut.points, shift, top, size)}" fill="#b03a5b"/>`;
  const strip = (reveal) => foldWordStrip(words, {
    final: finalCut,
    finalExtra: "자르기",
    label: reveal ? "두 번 접어 자른 색종이를 펼친 모양" : "색종이를 두 번 접어 색칠한 부분을 자르기",
    after: (shift, top, size) => unfoldedSquareSvg(lines, reveal ? holes : [], shift, top, size),
    afterCaption: "펼친 모양"
  });
  const where = family === "straight" ? "가로와 세로로 반씩" : "대각선으로";
  return {
    prompt: `색종이를 ${where} 두 번 접은 뒤 색칠한 부분을 잘라 냈습니다. 남은 종이를 펼쳤을 때의 모양을 마지막 칸에 그리세요.`,
    answer: "그림 답안",
    responseKind: "drawing",
    solution: `두 번째로 접은 선부터 거꾸로 펼칩니다. 두 번째 접는 선에 거울을 대듯 잘린 부분을 반대쪽에 하나 더 그리고, 다시 첫 번째 접는 선에 비추어 그리면 잘린 부분이 모두 ${holes.length}곳에 나타납니다. 접는 선에 닿아 있던 잘린 부분은 펼치면 서로 이어져 한 덩어리로 보입니다.`,
    visual: { kind: "fig", html: strip(false) },
    answerVisual: { kind: "fig", html: strip(true) },
    meta: { family: "fold-cut-two-corner-b4", words, lines: lines.map(({ a, b, sign }) => ({ a, b, sign })), cut: cut.points, cutKind: cut.kind, holes }
  };
}

// ── 2단원 연습 13 · 한 겹 피라미드 벽(1, 4, 9, …개) 몇 번째 그림의 개수 ─────────
function pyramidWallSvg(n, { s = 16 } = {}) {
  const dx = Math.round(s * 0.45);
  const dy = Math.round(s * 0.35);
  const width = (2 * n - 1) * s + dx + 4;
  const height = n * s + dy + 4;
  const ox = 2;
  const oy = height - 2;
  let body = "";
  for (let row = 0; row < n; row += 1) {
    const count = 2 * (n - row) - 1;
    for (let k = 0; k < count; k += 1) {
      const x = ox + (row + k) * s;
      const y = oy - (row + 1) * s;
      body += `<polygon points="${x},${y} ${x + dx},${y - dy} ${x + s + dx},${y - dy} ${x + s},${y}" fill="#e8f3f6" stroke="#3d7d8c" stroke-width="1"/>`;
      body += `<polygon points="${x + s},${y} ${x + s + dx},${y - dy} ${x + s + dx},${y + s - dy} ${x + s},${y + s}" fill="#a9cbd4" stroke="#3d7d8c" stroke-width="1"/>`;
      body += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#d4eaf0" stroke="#3d7d8c" stroke-width="1"/>`;
    }
  }
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="width:${width}px;max-width:100%;height:auto" role="img" aria-label="한 겹으로 쌓은 피라미드 모양 쌓기나무">${body}</svg>`;
}
function orderTableHtml(count) {
  const cell = "border:1px solid #6f9fae;padding:4px 8px;min-width:34px;text-align:center";
  return `<table style="border-collapse:collapse;margin:10px auto 0;${FONT};font-size:14px"><tr><th style="${cell};background:#dcedf2">순서</th>${Array.from({ length: count }, (_, i) => `<td style="${cell};background:#eef6f8">${i + 1}</td>`).join("")}</tr><tr><th style="${cell};background:#dcedf2">개수</th>${Array.from({ length: count }, () => `<td style="${cell};height:24px"></td>`).join("")}</tr></table>`;
}

function pyramidWallNth({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const shown = randomInt(3, 4);
  const k = d === 1 ? randomInt(5, 7) : d === 2 ? randomInt(6, 9) : randomInt(9, 13);
  const figs = Array.from({ length: shown }, (_, i) => capWrap(pyramidWallSvg(i + 1), `${i + 1}번째`));
  const counts = Array.from({ length: k }, (_, i) => (i + 1) * (i + 1));
  return {
    prompt: `쌓기나무를 한 겹으로 피라미드 모양이 되게 일정한 규칙으로 쌓았습니다. 표를 채워 ${k}번째 모양에 필요한 쌓기나무는 몇 개인지 구하세요.`,
    answer: `${k * k}개`,
    solution: `n번째 모양은 아래에서부터 한 줄에 ${"2×n−1"}개, 그 위로 2개씩 줄어 맨 위는 1개입니다. 1, 3, 5, …처럼 홀수를 차례로 더하면 1, 4, 9, 16, …이 되어 n번째 모양은 n × n개입니다. 표를 채우면 ${counts.join(", ")}이므로 ${k}번째는 ${k} × ${k} = ${k * k}개입니다.`.replace("2×n−1", "(n의 2배보다 1 작은 수)"),
    visual: { kind: "fig", html: `${rowWrap(figs)}${orderTableHtml(k)}` },
    meta: { family: "pyramid-wall-nth-b4", shown, k, counts, answer: k * k }
  };
}

// ── 2단원 확인 2-2·연습 16 · 계단 피라미드에서 보이지 않는 쌓기나무 ─────────
// 한 층 올라갈 때마다 가장자리가 한 칸씩 안으로 들어간(가운데 맞춘) 정사각형 층. 바닥은 보이지 않는다.
// 위에서 보면 기둥마다 꼭대기 하나씩 보이고, 가장자리가 한 칸씩 계단이라 옆에서 보이는 나무도 모두 기둥 꼭대기다.
function pyramidLayers(base, top) {
  const layers = [];
  for (let s = base; s >= top; s -= 2) layers.push(s);
  return layers;
}
function pyramidHeights(base, layers) {
  return Array.from({ length: base }, (_, r) => Array.from({ length: base }, (_, c) => layers.filter((s, i) => r >= i && r < i + s && c >= i && c < i + s).length));
}
function isoCubesSvg(heights, { s = 15 } = {}) {
  const R = heights.length;
  const C = heights[0].length;
  // 위에서 비스듬히 내려다본 모습: 바닥은 마름모, 옆면은 얕게
  const ax = s * 0.62;
  const ay = s * 0.62;
  const hz = s * 0.6;
  const maxH = Math.max(...heights.flat());
  const pad = 6;
  const ox = pad + R * ax;
  const oy = pad + maxH * hz;
  const P = (r, c, z) => [ox + (c - r) * ax, oy + (c + r) * ay - z * hz];
  const poly = (pts, fill) => `<polygon points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${fill}" stroke="#2f7385" stroke-width="0.9" stroke-linejoin="round"/>`;
  const floor = poly([P(-0.6, -0.6, 0), P(-0.6, C + 0.6, 0), P(R + 0.6, C + 0.6, 0), P(R + 0.6, -0.6, 0)], "#fbe5d6").replace('stroke="#2f7385"', 'stroke="none"');
  const cubes = [];
  for (let r = 0; r < R; r += 1) for (let c = 0; c < C; c += 1) for (let z = 0; z < heights[r][c]; z += 1) cubes.push([r, c, z]);
  cubes.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[2] - b[2]);
  const body = cubes.map(([r, c, z]) => poly([P(r, c, z + 1), P(r, c + 1, z + 1), P(r + 1, c + 1, z + 1), P(r + 1, c, z + 1)], "#e4f2f6")
    + poly([P(r + 1, c, z + 1), P(r + 1, c + 1, z + 1), P(r + 1, c + 1, z), P(r + 1, c, z)], "#c4e0e8")
    + poly([P(r, c + 1, z + 1), P(r + 1, c + 1, z + 1), P(r + 1, c + 1, z), P(r, c + 1, z)], "#9fc8d3")).join("");
  const W = ox + C * ax + pad + ax;
  const H = oy + (R + C) * ay + pad + ay;
  return `<svg width="${W.toFixed(0)}" height="${H.toFixed(0)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" style="width:${W.toFixed(0)}px;max-width:100%;height:auto" role="img" aria-label="쌓기나무로 쌓은 계단 피라미드">${floor}${body}</svg>`;
}
const PYRAMID_LEVELS = Object.freeze({ 1: [3, 4, 5], 2: [4, 5, 6, 7], 3: [6, 7, 8, 9] });
function steppedPyramidHidden({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const bases = shuffle(PYRAMID_LEVELS[d]).slice(0, 2).sort((a, b) => a - b);
  const figs = bases.map((base) => {
    const minTop = base % 2 ? 1 : 2;
    const top = d === 3 && base - 2 > minTop && Math.random() < 0.4 ? minTop + 2 : minTop;
    const layers = pyramidLayers(base, top);
    const total = layers.reduce((t, s) => t + s * s, 0);
    return { base, top, layers, total, hidden: total - base * base, heights: pyramidHeights(base, layers) };
  });
  if (figs.some((f) => f.layers.length < 2)) return null;
  const answer = figs.map((f, i) => `(${i + 1}) ${f.hidden}개`).join(", ");
  return {
    prompt: "쌓기나무를 층마다 가장자리가 한 칸씩 안으로 들어가게 쌓아 계단 모양 피라미드를 만들었습니다. 각 그림에서 어느 쪽에서 보아도 보이지 않는 쌓기나무는 몇 개인지 구하세요. (단, 바닥면은 보이지 않습니다.)",
    answer,
    solution: figs.map((f, i) => `(${i + 1}) 층마다 ${f.layers.map((s) => `${s * s}`).join(", ")}개이므로 모두 ${f.layers.map((s) => s * s).join(" + ")} = ${f.total}개입니다. 위에서 보면 기둥마다 맨 위 한 개씩 ${f.base} × ${f.base} = ${f.base * f.base}개가 보이고, 계단이 한 칸씩 들어가 있어 옆에서 보이는 나무도 이 기둥의 맨 위 나무뿐입니다. 따라서 보이지 않는 나무는 ${f.total} − ${f.base * f.base} = ${f.hidden}개입니다.`).join(" "),
    visual: { kind: "fig", html: rowWrap(figs.map((f, i) => capWrap(isoCubesSvg(f.heights, { s: f.base > 7 ? 20 : 24 }), `(${i + 1})`))) },
    meta: { family: "stepped-pyramid-hidden-b4", figures: figs.map(({ base, top, layers, total, hidden, heights }) => ({ base, top, layers, total, hidden, heights })) }
  };
}

// ── 3단원 도전 2 · 나이 목록과 조건으로 한 사람의 나이 찾기 ─────────
const SIBLING_NAMES = Object.freeze(["도현", "시우", "예준", "하준", "주원", "지호", "은우", "선우", "건우", "서진"]);
function ageListMatching({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const n = d === 3 ? 6 : 5;
  const names = shuffle(SIBLING_NAMES).slice(0, n);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const ages = shuffle(Array.from({ length: d === 1 ? 10 : 14 }, (_, i) => i + (d === 1 ? 8 : 6))).slice(0, n).sort((a, b) => b - a);
    const truth = Object.fromEntries(shuffle(ages).map((age, i) => [names[i], age]));
    const pool = [];
    for (const x of names) for (const y of names) {
      if (x === y) continue;
      const diff = truth[x] - truth[y];
      if (diff > 0 && diff <= 6) pool.push({ kind: "diff", who: [x, y], text: `${josa(x, "은", "는")} ${y}보다 ${diff}살 많습니다.`, test: (q) => q[x] - q[y] === diff });
      if (diff < 0 && -diff <= 6) pool.push({ kind: "diff", who: [x, y], text: `${josa(x, "은", "는")} ${y}보다 ${-diff}살 적습니다.`, test: (q) => q[y] - q[x] === -diff });
      if (diff < 0) pool.push({ kind: "young", who: [x, y], text: `${josa(x, "은", "는")} ${y}의 동생입니다.`, test: (q) => q[x] < q[y] });
    }
    const perms = permutationsOf(ages).map((list) => Object.fromEntries(names.map((x, i) => [x, list[i]])));
    const target = pick(names);
    const chosen = [];
    let remaining = perms;
    for (const clue of shuffle(pool)) {
      if (remaining.length === 1) break;
      if (clue.kind === "young" && chosen.filter((c) => c.kind === "young").length >= 1) continue;
      if (clue.who.includes(target) && clue.kind === "diff" && chosen.some((c) => c.kind === "diff" && c.who.includes(target))) continue;
      const next = remaining.filter((q) => clue.test(q));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (perms.filter((q) => rest.every((c) => c.test(q))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length < 3 || chosen.length > (d === 3 ? 5 : 4) || !chosen.some((c) => c.kind === "young")) continue;
    // 묻는 사람의 나이가 단서 하나로 바로 나오지 않게(그 사람이 단서에 한 번 이하로 나옴)
    if (chosen.filter((c) => c.who.includes(target)).length > 1) continue;
    const asc = [...ages].sort((a, b) => a - b);
    const cell = "border:1px solid #6f9fae;padding:4px 10px;min-width:44px;text-align:center";
    const table = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:14px"><tr>${asc.map((a) => `<th style="${cell};background:#dcedf2">${a}살</th>`).join("")}</tr><tr>${asc.map(() => `<td style="${cell};height:26px"></td>`).join("")}</tr></table>`;
    const ordered = [...names].sort((a, b) => truth[b] - truth[a]);
    return {
      prompt: `${names.join(", ")} ${n}명은 형제입니다. 형제들의 나이는 많은 쪽부터 ${ages.map((a) => `${a}살`).join(", ")}입니다. 조건을 보고 ${target}의 나이를 구하세요.`,
      answer: `${truth[target]}살`,
      solution: `나이의 차가 정해진 두 사람을 목록에서 찾으면 그 차가 되는 나이의 짝은 몇 개뿐입니다. 이런 짝을 표에 하나씩 놓아 보며 조건을 모두 따르면 나이가 많은 쪽부터 ${ordered.map((x) => `${x} ${truth[x]}살`).join(", ")}의 한 가지로 정해집니다. 따라서 ${target}의 나이는 ${truth[target]}살입니다.`,
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(chosen.map((c) => c.text))}${table}</div>` },
      meta: { family: "age-list-matching-b4", names, ages, clues: chosen.map((c) => c.text), truth, target, answer: truth[target] }
    };
  }
  return null;
}

// ── 4단원 확인 1-4 · 등 번호와 등수가 같은 선수가 없는 달리기 ─────────
function bibRankDerangement({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const n = d === 3 ? 5 : 4;
  const bibs = Array.from({ length: n }, (_, i) => i + 1);
  const all = permutationsOf(bibs); // 순서[등수 − 1] = 등 번호
  const derange = (o) => o.every((b, i) => b !== i + 1);
  const deranged = all.filter(derange);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const truth = pick(deranged);
    const rank = (o, b) => o.indexOf(b) + 1;
    const pool = [];
    for (const a of bibs) for (const b of bibs) {
      if (a === b) continue;
      if (rank(truth, b) === rank(truth, a) + 1) pool.push({ speaker: a, text: `${a}번 선수: ${b}번 선수는 제 바로 뒤에 들어왔습니다.`, test: (o) => rank(o, b) === rank(o, a) + 1 });
      if (rank(truth, a) < rank(truth, b) && rank(truth, b) - rank(truth, a) > 1) pool.push({ speaker: a, text: `${a}번 선수: 저는 ${b}번 선수보다 먼저 들어왔습니다.`, test: (o) => rank(o, a) < rank(o, b) });
    }
    if (d === 3) for (const a of bibs) if (rank(truth, a) !== n && rank(truth, a) !== 1) pool.push({ speaker: a, text: `${a}번 선수: 저는 1등도 꼴찌도 아닙니다.`, test: (o) => rank(o, a) !== 1 && rank(o, a) !== n });
    const chosen = [];
    let remaining = deranged;
    for (const clue of shuffle(pool)) {
      if (remaining.length === 1) break;
      if (chosen.some((c) => c.speaker === clue.speaker)) continue;
      const next = remaining.filter((o) => clue.test(o));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (deranged.filter((o) => rest.every((c) => c.test(o))).length === 1) chosen.splice(i, 1);
    }
    // 심판의 말이 꼭 쓰여야 한다(빼면 하나로 정해지지 않음)
    if (all.filter((o) => chosen.every((c) => c.test(o))).length < 2) continue;
    if (chosen.length > (d === 1 ? 1 : d === 2 ? 2 : 3)) continue;
    const clues = [...chosen.map((c) => c.text), "심판: 자기 등 번호와 같은 등수로 들어온 선수는 한 명도 없습니다."];
    const cell = "border:1px solid #6f9fae;padding:4px 10px;min-width:44px;text-align:center";
    const table = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:14px"><tr><th style="${cell};background:#dcedf2">등수</th>${bibs.map((b) => `<th style="${cell};background:#dcedf2">${b}등</th>`).join("")}</tr><tr><th style="${cell};background:#dcedf2">등 번호</th>${bibs.map(() => `<td style="${cell};height:26px"></td>`).join("")}</tr></table>`;
    const answer = truth.map((b) => `${b}번`).join(", ");
    return {
      prompt: `달리기 대회에 등 번호가 1번부터 ${n}번까지인 선수 ${n}명이 나왔고, 함께 들어온 선수는 없습니다. 선수들과 심판의 말을 보고 1등부터 ${n}등까지 선수의 등 번호를 차례로 쓰세요.`,
      answer,
      solution: `「바로 뒤」 말로 붙어 들어온 두 선수를 한 묶음으로 놓고, 그 묶음이 놓일 수 있는 자리를 차례로 따져 봅니다. 이때 자기 번호와 같은 등수가 되는 자리는 심판의 말 때문에 지웁니다. 남는 순서는 1등부터 ${answer}의 한 가지뿐입니다.`,
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(clues)}${table}</div>` },
      meta: { family: "bib-rank-derangement-b4", n, clues, order: truth }
    };
  }
  return null;
}

// ── 4단원 도전 3 · 아이들이 한 말로 달리기 등수 정하기 ─────────
const TALK_NAMES = Object.freeze(["태윤", "지안", "로운", "하율", "서후", "도경", "이안", "규리"]);
function raceTalkRanking({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const n = d === 1 ? 4 : 5;
  const names = shuffle(TALK_NAMES).slice(0, n);
  const perms = permutationsOf(names).map((o) => Object.fromEntries(o.map((x, i) => [x, i + 1])));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const truth = pick(perms);
    const pool = [];
    for (const s of names) {
      const rs = truth[s];
      if (rs < n) pool.push({ speaker: s, kind: "self", text: `${s}: 나는 ${n - rs}명을 이겼어.`, test: (q) => q[s] === rs });
      if (rs === n) pool.push({ speaker: s, kind: "self", text: `${s}: 앞서 달리다 넘어지는 바람에 맨 마지막으로 들어왔어.`, test: (q) => q[s] === n });
      if (rs !== 1 && rs !== n) pool.push({ speaker: s, kind: "mid", text: `${s}: 나는 1등도 꼴찌도 아니었어.`, test: (q) => q[s] !== 1 && q[s] !== n });
      for (const x of names) {
        if (x === s) continue;
        if (truth[x] < rs) {
          pool.push({ speaker: s, kind: "rel", text: `${s}: 이번에는 ${josa(x, "이", "가")} 나를 이겼어.`.replace(/([가-힣])이 나를/u, (m) => m), test: (q) => q[x] < q[s] });
          const beaten = n - truth[x];
          pool.push({ speaker: s, kind: "count", text: `${s}: ${josa(x, "은", "는")} 나를 포함해서 ${beaten}명을 이겼어.`, test: (q) => q[x] === n - beaten && q[x] < q[s] });
        } else {
          pool.push({ speaker: s, kind: "rel", text: `${s}: 나는 ${x}보다 먼저 들어왔어.`, test: (q) => q[s] < q[x] });
        }
      }
    }
    const chosen = [];
    let remaining = perms;
    for (const clue of shuffle(pool)) {
      if (remaining.length === 1) break;
      if (chosen.some((c) => c.speaker === clue.speaker)) continue;
      if (clue.kind === "self" && chosen.some((c) => c.kind === "self")) continue;
      const next = remaining.filter((q) => clue.test(q));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (perms.filter((q) => rest.every((c) => c.test(q))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length < 3) continue;
    const order = [...names].sort((a, b) => truth[a] - truth[b]);
    const cell = "border:1px solid #6f9fae;width:54px;height:30px;text-align:center";
    const table = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:14px"><tr>${order.map((_, i) => `<th style="${cell};background:#dcedf2">${i + 1}등</th>`).join("")}</tr><tr>${order.map(() => `<td style="${cell}"></td>`).join("")}</tr></table>`;
    const talk = chosen.map((c) => c.text);
    return {
      prompt: `${listJosa(names)} 달리기를 했습니다. 아이들이 나눈 말을 보고 1등부터 ${n}등까지 차례로 쓰세요. (함께 들어온 아이는 없습니다.)`,
      answer: order.join(", "),
      solution: `「몇 명을 이겼다」는 말은 그 아이 뒤에 들어온 아이 수이므로 등수를 바로 알려 줍니다(${n}명 중 m명을 이기면 ${n} − m등). 등수가 정해진 아이부터 칸에 쓰고, 누가 누구를 이겼는지 말하는 아이들로 나머지 칸을 채우면 1등부터 ${order.join(", ")}입니다.`,
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(talk)}${table}</div>` },
      meta: { family: "race-talk-ranking-b4", names, clues: talk, order }
    };
  }
  return null;
}

// ── 4단원 활동 2-4·연습 13 · 둥근 식탁 자리(오른쪽·왼쪽 옆, 사이, 떨어져 앉음) ─────────
// 모두 식탁 가운데를 보고 앉는다. 자리 번호는 기준 사람(아래 자리)부터 그 사람의 오른쪽 옆으로 1, 2, …
const TABLE_NAMES = Object.freeze(["나래", "보민", "세아", "유건", "재희", "찬영", "하린", "다온", "윤슬"]);
function roundTableSvg(n, labels) {
  const R = 62;
  const cx = 96;
  const cy = 92;
  const seat = (k) => {
    const phi = (2 * Math.PI * k) / n;
    return [cx + R * Math.sin(phi), cy + R * Math.cos(phi)];
  };
  let body = `<circle cx="${cx}" cy="${cy}" r="${R - 26}" fill="#dcedf2" stroke="#6f9fae" stroke-width="1.5"/>`;
  for (let k = 0; k < n; k += 1) {
    const [x, y] = seat(k);
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="#fff" stroke="#6f9fae" stroke-width="1.5"/>`;
    if (labels[k]) body += `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-size="${labels[k].length > 1 ? 13 : 16}" fill="#1f2a30" style="${FONT}">${esc(labels[k])}</text>`;
  }
  return `<svg width="192" height="186" viewBox="0 0 192 186" style="width:192px;max-width:100%;height:auto" role="img" aria-label="둥근 식탁 자리">${body}</svg>`;
}
function roundTableProblem({ difficulty = 2 } = {}, n) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const names = shuffle(TABLE_NAMES).slice(0, n);
  const anchor = names[0];
  const rest = names.slice(1);
  const arrangements = permutationsOf(rest).map((o) => [anchor, ...o]);
  const seatOf = (o, x) => o.indexOf(x);
  const nb = (a, b) => ((a - b + n) % n === 1) || ((b - a + n) % n === 1);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const truth = pick(arrangements);
    const target = randomInt(1, n - 1);
    const pool = [];
    for (const x of names) for (const y of names) {
      if (x === y) continue;
      const sx = seatOf(truth, x);
      const sy = seatOf(truth, y);
      if (sy === (sx + 1) % n) pool.push({ kind: "side", text: `${josa(y, "은", "는")} ${x}의 오른쪽 옆에 앉아 있습니다.`, test: (o) => seatOf(o, y) === (seatOf(o, x) + 1) % n });
      if (sy === (sx - 1 + n) % n) pool.push({ kind: "side", text: `${josa(y, "은", "는")} ${x}의 왼쪽 옆에 앉아 있습니다.`, test: (o) => seatOf(o, y) === (seatOf(o, x) - 1 + n) % n });
      if (x < y && !nb(sx, sy)) pool.push({ kind: "apart", text: `${josa(x, "과", "와")} ${josa(y, "은", "는")} 서로 떨어져 앉아 있습니다.`, test: (o) => !nb(seatOf(o, x), seatOf(o, y)) });
      if (n >= 5) for (const z of names) {
        if (z === x || z === y || x > y) continue;
        if (nb(seatOf(truth, z), sx) && nb(seatOf(truth, z), sy)) pool.push({ kind: "between", text: `${josa(z, "은", "는")} ${josa(x, "과", "와")} ${y} 사이에 앉아 있습니다.`, test: (o) => nb(seatOf(o, z), seatOf(o, x)) && nb(seatOf(o, z), seatOf(o, y)) });
      }
    }
    const chosen = [];
    let remaining = arrangements;
    for (const clue of shuffle(pool)) {
      if (remaining.length === 1) break;
      const next = remaining.filter((o) => clue.test(o));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const restClues = chosen.filter((_, j) => j !== i);
      if (arrangements.filter((o) => restClues.every((c) => c.test(o))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length < 2 || chosen.length > (n === 4 ? 3 : 4)) continue;
    if (n >= 5 && d > 1 && !chosen.some((c) => c.kind === "between" || c.kind === "apart")) continue;
    const labels = Array.from({ length: n }, (_, k) => (k === 0 ? anchor : k === target ? "㉠" : ""));
    const answer = truth[target];
    return {
      prompt: `${listJosa(names)} 둥근 식탁에 둘러앉아 있습니다. 모두 식탁 가운데를 보고 앉아 있고, 「오른쪽」·「왼쪽」은 앉은 사람의 손 방향입니다. ㉠에 앉아 있는 사람은 누구일까요?`,
      answer,
      solution: `${josa(anchor, "이", "가")} 앉은 자리를 기준으로, 오른쪽·왼쪽 옆을 말하는 조건부터 자리에 써 넣습니다. 「사이」는 양옆에 앉은 것이고, 「떨어져 앉음」은 옆자리가 아니라는 뜻입니다. 조건을 모두 따르면 ${anchor}에서 오른쪽 옆으로 한 자리씩 돌아가며 ${truth.join(", ")} 차례로 앉아 있으므로 ㉠에는 ${josa(answer, "이", "가")} 앉아 있습니다.`,
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(chosen.map((c) => c.text))}<div style="display:flex;justify-content:center">${roundTableSvg(n, labels)}</div></div>` },
      meta: { family: "round-table-seat-b4", n, names, anchor, target, clues: chosen.map((c) => c.text), order: truth, answer }
    };
  }
  return null;
}

// ── 4단원 연습 3 · 네 사람과 네 가지를 모두 짝 짓기(친구 사이 조건) ─────────
const MATCH_THEMES = Object.freeze([
  { like: "좋아합니다", items: ["장미", "국화", "튤립", "백합"], what: "꽃" },
  { like: "좋아합니다", items: ["사과", "포도", "귤", "자두"], what: "과일" },
  { like: "배웁니다", items: ["수영", "태권도", "피아노", "미술"], what: "학원" },
  { like: "좋아합니다", items: ["축구", "야구", "농구", "배구"], what: "운동" }
]);
const MATCH_NAMES = Object.freeze(["예린", "도율", "시아", "준서", "하온", "민재", "채원", "윤호"]);
function personItemFullMatch({ difficulty = 2 } = {}) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const theme = pick(MATCH_THEMES);
  const people = shuffle(MATCH_NAMES).slice(0, 4);
  const items = theme.items;
  const perms = permutationsOf(items).map((o) => Object.fromEntries(people.map((p, i) => [p, o[i]])));
  const liker = (item) => `${josa(item, "을", "를")} ${theme.like === "배웁니다" ? "배우는" : "좋아하는"} 사람`;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const truth = pick(perms);
    const owner = Object.fromEntries(people.map((p) => [truth[p], p]));
    const pool = [];
    for (const p of people) {
      const nots = items.filter((it) => truth[p] !== it);
      for (let i = 0; i < nots.length; i += 1) {
        pool.push({ kind: "not", text: `${josa(p, "은", "는")} ${josa(nots[i], "을", "를")} ${theme.like === "배웁니다" ? "배우지" : "좋아하지"} 않습니다.`, test: (q) => q[p] !== nots[i] });
        for (let j = i + 1; j < nots.length; j += 1) pool.push({ kind: "not2", text: `${josa(p, "은", "는")} ${josa(nots[i], "과", "와")} ${josa(nots[j], "을", "를")} ${theme.like === "배웁니다" ? "배우지" : "좋아하지"} 않습니다.`, test: (q) => q[p] !== nots[i] && q[p] !== nots[j] });
      }
    }
    for (const p of people) for (const a of items) for (const b of items) {
      if (a >= b || owner[a] === p || owner[b] === p) continue;
      pool.push({ kind: "friend3", text: `${liker(a)}, ${p}, ${liker(b)}은 서로 다른 친구입니다.`, test: (q) => q[p] !== a && q[p] !== b });
    }
    for (const p of people) for (const p2 of people) for (const a of items) {
      if (p >= p2 || owner[a] === p || owner[a] === p2) continue;
      pool.push({ kind: "friend2", text: `${josa(p, "과", "와")} ${josa(p2, "은", "는")} ${liker(a)}과 친구입니다.`, test: (q) => q[p] !== a && q[p2] !== a });
    }
    const friends = shuffle(pool.filter((c) => c.kind.startsWith("friend")));
    const others = shuffle(pool.filter((c) => !c.kind.startsWith("friend")));
    const chosen = [];
    let remaining = perms;
    for (const clue of [...friends.slice(0, d === 1 ? 1 : 2), ...others, ...friends.slice(2)]) {
      if (remaining.length === 1) break;
      const next = remaining.filter((q) => clue.test(q));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (perms.filter((q) => rest.every((c) => c.test(q))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length < 2 || chosen.length > 4 || !chosen.some((c) => c.kind.startsWith("friend"))) continue;
    const cell = "border:1px solid #6f9fae;width:50px;height:28px;text-align:center";
    const table = `<table style="border-collapse:collapse;margin:0 auto;${FONT};font-size:14px"><tr><th style="${cell};background:#eef6f8"></th>${items.map((it) => `<th style="${cell};background:#dcedf2">${esc(it)}</th>`).join("")}</tr>${people.map((p) => `<tr><th style="${cell};background:#dcedf2">${esc(p)}</th>${items.map(() => `<td style="${cell}"></td>`).join("")}</tr>`).join("")}</table>`;
    const answer = people.map((p) => `${p} ${truth[p]}`).join(", ");
    return {
      prompt: `${listJosa(people)} ${items.join(", ")} 가운데 서로 다른 ${theme.what}을 하나씩 ${theme.like}. 조건을 보고 누가 어떤 ${theme.what}을 ${theme.like === "배웁니다" ? "배우는지" : "좋아하는지"} 모두 쓰세요.`.replace(/([가-힣]+)을 하나씩/u, (m, w) => `${josa(w, "을", "를")} 하나씩`).replace(/어떤 ([가-힣]+)을 (배우|좋아)/u, (m, w, v) => `어떤 ${josa(w, "을", "를")} ${v}`),
      answer,
      solution: `「서로 다른 친구」라는 말은 그 사람들이 모두 다른 사람이라는 뜻이므로, 그 사람은 거기 나온 ${theme.what}을 ${theme.like === "배웁니다" ? "배우지" : "좋아하지"} 않습니다. 표에 아닌 칸마다 ✕를 하고, 한 줄이나 한 칸에 하나만 남으면 ○를 한 뒤 같은 줄·칸의 나머지에 ✕를 합니다. 표를 다 채우면 ${answer}입니다.`.replace(/([가-힣]+)을 (배우지|좋아하지)/u, (m, w, v) => `${josa(w, "을", "를")} ${v}`),
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(chosen.map((c) => c.text))}${table}</div>` },
      meta: { family: "person-item-full-match-b4", people, items, clues: chosen.map((c) => c.text), truth }
    };
  }
  return null;
}

// ── 4단원 연습 9, 10 · 2줄 칸에 동물·숫자 놓기(바로 위·오른쪽, 붙어 있음, 가장 멀리, 같은 줄) ─────────
const PEN_ANIMALS = Object.freeze(["토끼", "염소", "거위", "돼지", "닭", "오리", "양", "소"]);
const indexPermMemo = new Map();
function indexPermutations(n) {
  if (!indexPermMemo.has(n)) indexPermMemo.set(n, permutationsOf(Array.from({ length: n }, (_, i) => i)));
  return indexPermMemo.get(n);
}
function gridPlacementProblem({ difficulty = 2 } = {}, mode) {
  const d = Math.max(1, Math.min(3, Number(difficulty) || 2));
  const rows = 2;
  const cols = d === 3 ? 4 : 3;
  const n = rows * cols;
  const items = mode === "digit" ? Array.from({ length: n }, (_, i) => String(i + 1)) : shuffle(PEN_ANIMALS).slice(0, n);
  const cells = rectCells(rows, cols);
  // 놓기 하나 = 물건 번호 → 칸 번호 목록(모든 놓기를 한 번만 만들어 둔다).
  const perms = indexPermutations(n);
  const posOf = (w, x) => cells[w[x]];
  const name = (x) => items[x];
  const subj = (x) => (mode === "digit" ? `${x}${hasBatchim(x) ? "은" : "는"}` : josa(x, "은", "는"));
  const farD = rows - 1 + cols - 1;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const where = pick(perms);
    const truth = [];
    where.forEach((cell, item) => { truth[cell] = item; });
    const fixedIndex = randomInt(0, n - 1);
    let targetIndex = randomInt(0, n - 1);
    if (targetIndex === fixedIndex) continue;
    const fixedItem = truth[fixedIndex];
    const fixed = name(fixedItem);
    const base = perms.filter((w) => w[fixedItem] === fixedIndex);
    const pool = [];
    for (let x = 0; x < n; x += 1) for (let y = 0; y < n; y += 1) {
      if (x === y) continue;
      const [rx, cx] = posOf(where, x);
      const [ry, cy] = posOf(where, y);
      if (cx === cy && rx === ry - 1) pool.push({ kind: "up", text: mode === "digit" ? `${subj(name(x))} ${name(y)}의 바로 위에 있습니다.` : `${subj(name(x))} ${name(y)}의 바로 위쪽 우리에 있습니다.`, test: (o) => { const [a, b] = posOf(o, x); const [c, e] = posOf(o, y); return b === e && a === c - 1; } });
      if (cx === cy && rx === ry + 1 && mode === "digit") pool.push({ kind: "down", text: `${subj(name(x))} ${name(y)}의 바로 아래에 있습니다.`, test: (o) => { const [a, b] = posOf(o, x); const [c, e] = posOf(o, y); return b === e && a === c + 1; } });
      if (rx === ry && cx === cy + 1) pool.push({ kind: "right", text: mode === "digit" ? `${subj(name(x))} ${name(y)}의 바로 오른쪽에 있습니다.` : `${subj(name(x))} ${name(y)}의 바로 오른쪽 우리에 있습니다.`, test: (o) => { const [a, b] = posOf(o, x); const [c, e] = posOf(o, y); return a === c && b === e + 1; } });
      if (x < y) {
        const dist = Math.abs(rx - ry) + Math.abs(cx - cy);
        if (mode === "animal" && dist === 1) pool.push({ kind: "adj", text: `${josa(name(x), "과", "와")} ${josa(name(y), "은", "는")} 서로 붙어 있는 우리에 있습니다.`, test: (o) => { const [a, b] = posOf(o, x); const [c, e] = posOf(o, y); return Math.abs(a - c) + Math.abs(b - e) === 1; } });
        if (mode === "animal" && dist === farD) pool.push({ kind: "far", text: `${josa(name(x), "과", "와")} ${josa(name(y), "은", "는")} 가장 멀리 떨어진 두 우리에 있습니다.`, test: (o) => { const [a, b] = posOf(o, x); const [c, e] = posOf(o, y); return Math.abs(a - c) + Math.abs(b - e) === farD; } });
        if (mode === "digit" && rx === ry) pool.push({ kind: "row", text: `${subj(name(x))} ${name(y)}와 같은 줄에 있습니다.`.replace(/(\d)와/u, (m, g) => `${g}${hasBatchim(g) ? "과" : "와"}`), test: (o) => posOf(o, x)[0] === posOf(o, y)[0] });
      }
    }
    const chosen = [];
    let remaining = base;
    for (const clue of shuffle(pool)) {
      if (remaining.length === 1) break;
      const next = remaining.filter((o) => clue.test(o));
      if (next.length === remaining.length || !next.length) continue;
      chosen.push(clue);
      remaining = next;
    }
    if (remaining.length !== 1) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const rest = chosen.filter((_, j) => j !== i);
      if (base.filter((o) => rest.every((c) => c.test(o))).length === 1) chosen.splice(i, 1);
    }
    if (chosen.length < 3 || chosen.length > (d === 3 ? 7 : 5)) continue;
    if (mode === "animal" && !chosen.some((c) => c.kind === "far" || c.kind === "adj")) continue;
    if (mode === "digit" && !chosen.some((c) => c.kind === "row")) continue;
    const answer = name(truth[targetIndex]);
    const cellPx = 64;
    const grid = `<div style="display:grid;grid-template-columns:repeat(${cols},${cellPx}px);border:${mode === "animal" ? "4px solid #8a6d2f" : "1.5px solid #1f6f86"};width:max-content;margin:0 auto">${cells.map((_, i) => `<span style="display:flex;align-items:center;justify-content:center;height:46px;border:${mode === "animal" ? "2px solid #8a6d2f" : "1px solid #6f9fae"};${FONT};font-size:16px;color:#1f2a30">${i === fixedIndex ? esc(fixed) : i === targetIndex ? "㉠" : ""}</span>`).join("")}</div>`;
    const placed = cells.map((_, i) => name(truth[i]));
    return {
      prompt: mode === "digit"
        ? `조건에 맞게 빈칸에 1부터 ${n}까지의 수를 한 번씩 써 넣을 때, ㉠에 들어갈 수를 구하세요.`
        : `농장의 우리 ${n}칸에 ${items.join(", ")}를 한 마리씩 넣으려고 합니다. 조건에 맞게 넣을 때 ㉠ 우리에 들어갈 동물은 무엇일까요?`.replace(/([가-힣]+)를 한 마리씩/u, (m, w) => `${josa(w, "을", "를")} 한 마리씩`),
      answer,
      solution: `이미 자리가 정해진 ${mode === "digit" ? `수 ${fixed}` : fixed}부터 시작해, 「바로 위」·「바로 오른쪽」처럼 자리를 하나로 정하는 조건을 먼저 씁니다. ${mode === "digit" ? "「같은 줄」 조건은 위 줄과 아래 줄 가운데 어느 쪽인지 정해 줍니다." : "「가장 멀리 떨어진 두 우리」는 서로 맞은편 모서리 두 칸이고, 「붙어 있는 우리」는 변이 맞닿은 두 칸입니다."} 칸을 모두 채우면 윗줄은 ${placed.slice(0, cols).join(", ")}, 아랫줄은 ${placed.slice(cols).join(", ")}이므로 ㉠에는 ${josa(answer, "이", "가")} 들어갑니다.`,
      visual: { kind: "fig", html: `<div style="display:inline-block;max-width:100%">${clueListHtml(chosen.map((c) => c.text))}${grid}</div>` },
      meta: { family: "grid-placement-b4", mode, rows, cols, items, fixedIndex, fixed, targetIndex, clues: chosen.map((c) => c.text), placed, answer }
    };
  }
  return null;
}

export const BOOK04_STRUCTURE_INTERNALS = { makeBalanceSystem, childSolve, ratioDetermined, eqNormalize };

export const BOOK04_STRUCTURE_GENERATORS = {
  rowLeftRightPlacementB4: (options) => orderPuzzleProblem(options, "row"),
  floorFromTopB4: floorFromTop,
  numberBoardThreeMovesTwoB4: (options) => digitalThreeMovesBoard(options, 2),
  numberBoardThreeMovesThreeB4: (options) => digitalThreeMovesBoard(options, 3),
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
  mixedPanBalanceThreeB4: (options) => mixedPanBalance(options, { balances: 3 }),
  polyominoAllDrawB4: polyominoAllDraw,
  samePieceRectTilingB4: samePieceRectTiling,
  rectHalvesAllWaysB4: rectHalvesAllWays,
  triangleGridHalvesAllB4: triangleGridHalvesAll,
  countBalancedPartitionB4: countBalancedPartition,
  foldCutTwoCornerUnfoldB4: foldCutTwoCornerUnfold,
  pyramidWallNthB4: pyramidWallNth,
  steppedPyramidHiddenB4: steppedPyramidHidden,
  ageListMatchingB4: ageListMatching,
  bibRankDerangementB4: bibRankDerangement,
  raceTalkRankingB4: raceTalkRanking,
  roundTableFourB4: (options) => roundTableProblem(options, 4),
  roundTableFiveB4: (options) => roundTableProblem(options, 5),
  personItemFullMatchB4: personItemFullMatch,
  gridPenPlacementB4: (options) => gridPlacementProblem(options, "animal"),
  digitGridPlacementB4: (options) => gridPlacementProblem(options, "digit")
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
  { id: "number-board-three-moves-2x2-b4", domain: "geometry", middle: "도형 움직이기", label: "뒤집고 돌리고 뒤집은 뒤 2×2 숫자판에서 똑바로 서는 수 찾기", generator: "numberBoardThreeMovesTwoB4", catalogGroup: "선 그림·디지털 숫자 돌리고 뒤집기", catalogStrategy: "숫자 1로 세 동작을 따라간 뒤 견주기", searchAliases: ["숫자판", "뒤집기", "돌리기"] },
  { id: "number-board-three-moves-3x3-b4", domain: "geometry", middle: "도형 움직이기", label: "뒤집고 돌리고 뒤집은 뒤 3×3 숫자판에서 똑바로 서는 수의 합", generator: "numberBoardThreeMovesThreeB4", catalogGroup: "선 그림·디지털 숫자 돌리고 뒤집기", catalogStrategy: "숫자 1로 세 동작을 따라간 뒤 똑바로 서는 수 더하기", searchAliases: ["숫자판", "뒤집기", "돌리기"] },
  { id: "mixed-pan-balance-two-b4", domain: "logic", middle: "양팔저울", label: "섞인 접시 저울 두 개로 바꾸어 넣어 같은 무게 구하기", generator: "mixedPanBalanceTwoB4", catalogGroup: BAL_GROUP, catalogStrategy: "바꾸어 넣고 양쪽의 같은 것 덜어 내기", searchAliases: ["양팔저울", "바꾸어 넣기", "평형"] },
  { id: "mixed-pan-balance-three-b4", domain: "logic", middle: "양팔저울", label: "섞인 접시 저울 세 개로 바꾸어 넣어 같은 무게 구하기", generator: "mixedPanBalanceThreeB4", catalogGroup: BAL_GROUP, catalogStrategy: "한 가지 물건뿐인 저울부터 차례로 바꾸어 넣기", searchAliases: ["양팔저울", "바꾸어 넣기", "평형"] },
  { id: "shape-difference-tree-b4", domain: "number", middle: "비교와 차", label: "순서가 섞이고 빼기가 있는 도형 식으로 두 도형의 차 구하기", generator: "shapeDifferenceTreeB4", catalogGroup: DIFF_GROUP, catalogStrategy: "한 도형을 어떤 수로 두고 차례로 구하기", searchAliases: ["도형의 차", "크기 비교", "기준 정하기"] },
  { id: "measurement-relative-difference-b4", domain: "logic", middle: "순서와 비교", label: "몸무게·구슬·거리·길이 비교 조건으로 두 사이의 차 구하기", generator: "measurementRelativeDifferenceB4", catalogGroup: DIFF_GROUP, catalogStrategy: "한 사람을 어떤 수로 두고 표를 채우기", searchAliases: ["차이 구하기", "몸무게 비교", "거리 비교"] },
  { id: "row-left-right-placement-b4", domain: "logic", middle: "자리 배치", label: "왼쪽·오른쪽 조건으로 네 명의 줄 자리 정하기", generator: "rowLeftRightPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "같은 사람이 나오는 조건을 이어 한 줄에 놓기", searchAliases: ["자리 배치", "왼쪽 오른쪽", "한 줄"] },
  { id: "floor-from-top-b4", domain: "logic", middle: "순서와 비교", label: "위에서부터 센 순서로 몇 층인지 구하기", generator: "floorFromTopB4", catalogGroup: ORDER_GROUP, catalogStrategy: "맨 위층부터 거꾸로 세기", searchAliases: ["층수", "위에서부터", "몇 번째"] },
  { id: "line-offset-placement-b4", domain: "logic", middle: "자리 배치", label: "앞뒤 몇 번째 조건으로 한 줄의 자리 정하기", generator: "lineOffsetPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "자리가 바로 정해지는 조건부터 칸 채우기", searchAliases: ["줄 서기", "앞뒤", "몇 번째"] },
  { id: "seat-offset-placement-b4", domain: "logic", middle: "자리 배치", label: "왼쪽·오른쪽 몇 번째 조건으로 나란히 앉은 자리 정하기", generator: "seatOffsetPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "같은 사람이 나오는 조건을 이어 자리 칸 채우기", searchAliases: ["자리 배치", "왼쪽 오른쪽", "몇 번째"] },
  { id: "race-order-clues-b4", domain: "logic", middle: "순서와 비교", label: "먼저 들어온 조건으로 달리기 등수 정하기", generator: "raceOrderCluesB4", catalogGroup: ORDER_GROUP, catalogStrategy: "등수가 바로 정해지는 조건부터 표 채우기", searchAliases: ["달리기 등수", "순서 정하기", "먼저 들어옴"] },
  // 2차(2026-11-28)
  { id: "polyomino-all-draw-b4", domain: "geometry", middle: "도형 분할", label: "서로 다른 테트로미노·펜토미노 모두 그리고 가짓수 쓰기", generator: "polyominoAllDrawB4", catalogGroup: POLY_GROUP, catalogStrategy: "가장 긴 줄의 칸 수로 나누어 빠짐없이 찾기", searchAliases: ["테트로미노", "펜토미노", "모두 그리기"] },
  { id: "same-piece-rect-tiling-b4", domain: "geometry", middle: "도형 분할", label: "같은 조각 여러 개로 직사각형을 덮을 수 없는 조각 고르기", generator: "samePieceRectTilingB4", catalogGroup: POLY_GROUP, catalogStrategy: "모서리 칸부터 같은 조각을 놓아 보기", searchAliases: ["테트로미노", "조각 덮기", "정사각형 만들기"] },
  { id: "rect-halves-all-ways-b4", domain: "geometry", middle: "도형 분할", label: "직사각형을 똑같은 두 조각으로 나누는 방법 모두 찾기", generator: "rectHalvesAllWaysB4", catalogGroup: POLY_GROUP, catalogStrategy: "가운데를 지나는 선을 한 칸씩 꺾어 가며 찾기", searchAliases: ["합동 분할", "두 조각", "모든 방법"] },
  { id: "triangle-grid-halves-all-b4", domain: "geometry", middle: "도형 분할", label: "삼각형 칸 도형을 똑같은 두 조각으로 나누는 방법 모두 찾기", generator: "triangleGridHalvesAllB4", catalogGroup: POLY_GROUP, catalogStrategy: "가운데를 지나는 선을 한 칸씩 바꾸어 가며 찾기", searchAliases: ["삼각형 모눈", "합동 분할", "두 조각"] },
  { id: "count-balanced-partition-b4", domain: "geometry", middle: "도형 분할", label: "도토리가 같은 수씩 들도록 똑같은 네 부분으로 나누기", generator: "countBalancedPartitionB4", catalogGroup: POLY_GROUP, catalogStrategy: "한 부분의 칸 수와 도토리 수를 먼저 구하기", searchAliases: ["합동 분할", "같은 개수", "울타리"] },
  { id: "fold-cut-two-corner-unfold-b4", domain: "geometry", middle: "색종이 접어 자르기", label: "가로세로·대각선으로 두 번 접어 모서리를 자르고 펼친 모양 그리기", generator: "foldCutTwoCornerUnfoldB4", catalogGroup: "색종이 접어 자르기", catalogStrategy: "마지막 접는 선부터 거울에 비춰 펼치기", searchAliases: ["색종이 접기", "펼친 모양", "대칭"] },
  { id: "pyramid-wall-nth-b4", domain: "geometry", middle: "쌓기나무 규칙", label: "한 겹 피라미드 쌓기나무의 몇 번째 개수 구하기", generator: "pyramidWallNthB4", catalogGroup: "쌓기나무 규칙", catalogStrategy: "1, 3, 5, …를 차례로 더해 표 채우기", searchAliases: ["쌓기나무 규칙", "피라미드", "홀수의 합"] },
  { id: "stepped-pyramid-hidden-b4", domain: "geometry", middle: "숨은 쌓기나무", label: "계단 피라미드에서 보이지 않는 쌓기나무의 개수", generator: "steppedPyramidHiddenB4", catalogGroup: "숨은 쌓기나무", catalogStrategy: "전체에서 기둥마다 보이는 맨 위 나무를 빼기", searchAliases: ["보이지 않는 쌓기나무", "피라미드", "층별 개수"] },
  { id: "age-list-matching-b4", domain: "logic", middle: "순서와 비교", label: "나이 목록과 차·동생 조건으로 한 사람의 나이 찾기", generator: "ageListMatchingB4", catalogGroup: DIFF_GROUP, catalogStrategy: "차가 맞는 나이 짝을 목록에서 찾아 표에 놓기", searchAliases: ["나이 구하기", "형제", "조건 맞추기"] },
  { id: "bib-rank-derangement-b4", domain: "logic", middle: "순서와 비교", label: "등 번호와 등수가 같은 선수가 없는 달리기 순서 정하기", generator: "bibRankDerangementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "붙어 들어온 두 선수를 묶어 자리를 따져 보기", searchAliases: ["등 번호", "등수", "달리기"] },
  { id: "race-talk-ranking-b4", domain: "logic", middle: "순서와 비교", label: "아이들이 한 말로 달리기 등수 모두 정하기", generator: "raceTalkRankingB4", catalogGroup: ORDER_GROUP, catalogStrategy: "「몇 명을 이겼다」로 등수부터 정하기", searchAliases: ["달리기 등수", "말로 추리", "몇 명을 이김"] },
  { id: "round-table-four-b4", domain: "logic", middle: "자리 배치", label: "네 자리 둥근 식탁에서 오른쪽 옆·떨어져 앉은 조건으로 자리 찾기", generator: "roundTableFourB4", catalogGroup: ORDER_GROUP, catalogStrategy: "기준 사람의 오른쪽 옆부터 자리 채우기", searchAliases: ["원탁", "둥근 식탁", "오른쪽 옆"] },
  { id: "round-table-five-b4", domain: "logic", middle: "자리 배치", label: "다섯 자리 둥근 식탁에서 오른쪽·왼쪽 옆과 사이 조건으로 자리 찾기", generator: "roundTableFiveB4", catalogGroup: ORDER_GROUP, catalogStrategy: "기준 사람의 오른쪽 옆부터 차례로 자리 채우기", searchAliases: ["원탁", "둥근 식탁", "사이에 앉기"] },
  { id: "person-item-full-match-b4", domain: "logic", middle: "조건 연결", label: "친구 사이 조건으로 네 사람과 네 가지를 모두 짝 짓기", generator: "personItemFullMatchB4", catalogGroup: "표로 조건 정리하기", catalogStrategy: "아닌 칸에 ✕, 하나 남으면 ○", searchAliases: ["논리 추리", "표 채우기", "짝 짓기"] },
  { id: "grid-pen-placement-b4", domain: "logic", middle: "자리 배치", label: "두 줄 우리에 바로 위·오른쪽·붙어 있음·가장 멀리 조건으로 동물 넣기", generator: "gridPenPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "정해진 칸부터 자리가 하나로 정해지는 조건 쓰기", searchAliases: ["자리 배치", "우리", "가장 멀리"] },
  { id: "digit-grid-placement-b4", domain: "logic", middle: "자리 배치", label: "두 줄 칸에 바로 아래·오른쪽·같은 줄 조건으로 수 넣기", generator: "digitGridPlacementB4", catalogGroup: ORDER_GROUP, catalogStrategy: "정해진 수부터 바로 위·아래·오른쪽 칸 채우기", searchAliases: ["자리 배치", "수 넣기", "같은 줄"] }
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
  "number-board-three-moves-2x2-b4": "숫자 1을 세 동작대로 차례로 움직여 보고, 그 마지막 모양과 똑같이 놓인 수를 숫자판에서 찾습니다.",
  "number-board-three-moves-3x3-b4": "숫자 1로 세 동작을 따라가 마지막 모양을 구하고, 그 모양과 똑같이 놓인 수만 골라 더합니다.",
  "mixed-pan-balance-two-b4": "한 가지 물건뿐인 쪽이 있는 저울로 다른 저울의 물건을 바꾸어 넣고, 양쪽에 같은 물건은 덜어 냅니다.",
  "mixed-pan-balance-three-b4": "바꾸어 넣을 수 있는 저울부터 차례로 바꾸고, 양쪽의 같은 물건을 덜어 내어 두 가지 물건만 남깁니다.",
  "shape-difference-tree-b4": "한 도형을 20처럼 정해 두고 식을 하나씩 따라가며 나머지 도형의 수를 구한 뒤 차를 뺍니다.",
  "measurement-relative-difference-b4": "한 사람을 20처럼 정해 두고 조건을 따라 표를 채운 뒤 두 사람의 차를 구합니다.",
  "row-left-right-placement-b4": "「누가 누구의 오른쪽」 조건을 이어 가장 왼쪽 사람부터 한 줄로 놓아 봅니다.",
  "floor-from-top-b4": "맨 위층이 위에서 첫 번째이니, 위에서 몇 번째인지에서 1을 빼고 전체 층수에서 빼면 됩니다.",
  "line-offset-placement-b4": "앞이나 뒤에 몇 명이 있는지 말하는 조건으로 한 자리를 먼저 정하고, 몇 번째 조건으로 나머지를 채웁니다.",
  "seat-offset-placement-b4": "같은 사람이 나오는 조건끼리 이어서 몇 칸 떨어져 있는지 그려 보고 자리를 정합니다.",
  "race-order-clues-b4": "등수가 바로 정해지는 조건부터 표에 쓰고, 누가 먼저 들어왔는지 조건으로 나머지 칸을 채웁니다.",
  "polyomino-all-draw-b4": "가장 긴 줄이 몇 칸인지로 나누어 차례로 그리고, 돌리거나 뒤집어 같아지는 모양은 한 번만 셉니다.",
  "same-piece-rect-tiling-b4": "모서리 칸을 덮는 방법부터 같은 조각으로 하나씩 놓아 보고, 어떻게 놓아도 빈칸이 남는 조각을 고릅니다.",
  "rect-halves-all-ways-b4": "똑같은 두 조각은 가운데를 중심으로 반 바퀴 돌리면 겹치니, 가운데를 지나는 선을 한 칸씩 꺾어 가며 찾고 같은 모양은 한 번만 셉니다.",
  "triangle-grid-halves-all-b4": "한 조각의 칸 수를 먼저 구하고, 가운데를 지나는 자르는 선을 한 칸씩 바꾸어 가며 같은 모양 두 조각이 되는지 봅니다.",
  "count-balanced-partition-b4": "한 부분의 칸 수와 한 부분에 들어갈 도토리 수를 먼저 구하고, 모서리 칸이 들어갈 부분부터 정합니다.",
  "fold-cut-two-corner-unfold-b4": "마지막으로 접은 선부터 거울에 비추듯 잘린 부분을 반대쪽에 그리고, 처음 접은 선에 한 번 더 비춰 그립니다.",
  "pyramid-wall-nth-b4": "줄마다 1, 3, 5, …개이니 n번째는 1부터 n번째 홀수까지의 합, 곧 n × n개입니다.",
  "stepped-pyramid-hidden-b4": "층마다 개수를 더해 전체를 구하고, 위에서 보이는 기둥 맨 위 나무의 수(맨 아래층 칸 수)를 뺍니다.",
  "age-list-matching-b4": "나이 차가 주어진 두 사람은 목록에서 그 차가 나는 짝만 될 수 있으니, 짝을 찾아 표에 놓아 봅니다.",
  "bib-rank-derangement-b4": "바로 뒤에 들어온 두 선수를 한 묶음으로 놓고, 자기 번호와 같은 등수가 되는 자리는 지웁니다.",
  "race-talk-ranking-b4": "「몇 명을 이겼다」는 그 아이 뒤에 들어온 아이 수이니 등수부터 정하고, 누가 누구를 이겼는지로 나머지를 채웁니다.",
  "round-table-four-b4": "모두 식탁 가운데를 보고 앉으니, 기준 사람의 오른손 쪽 자리부터 채우고 떨어져 앉은 두 사람은 마주 보게 놓습니다.",
  "round-table-five-b4": "기준 사람의 오른손 쪽 옆자리부터 정하고, 「사이」는 양옆, 「떨어져 앉음」은 옆자리가 아님을 이용합니다.",
  "person-item-full-match-b4": "「서로 다른 친구」로 나온 사람은 그 물건의 주인이 아니니 표에 ✕를 하고, 하나 남은 칸에 ○를 합니다.",
  "grid-pen-placement-b4": "정해진 칸부터 「바로 위」·「바로 오른쪽」 조건을 쓰고, 가장 멀리 떨어진 두 칸은 맞은편 모서리임을 이용합니다.",
  "digit-grid-placement-b4": "정해진 수부터 「바로 아래」·「바로 오른쪽」 칸을 채우고, 「같은 줄」 조건으로 윗줄·아랫줄을 가립니다."
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
  ["book-04", 1, "activity", 2, [5, 6], "number-board-three-moves-2x2-b4"],
  ["book-04", 1, "practice", 1, [16], "number-board-three-moves-2x2-b4"],
  ["book-04", 1, "advanced", 1, [4], "number-board-three-moves-3x3-b4"],
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
  ["book-04", 4, "activity", 2, [3], "row-left-right-placement-b4"],
  ["book-04", 4, "check", 2, [2], "floor-from-top-b4"],
  ["book-04", 4, "practice", 1, [15], "floor-from-top-b4"],
  ["book-04", 4, "check", 1, [3], "line-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [8], "line-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [7], "seat-offset-placement-b4"],
  ["book-04", 4, "practice", 1, [5, 6], "race-order-clues-b4"],
  // 2차(2026-11-28)
  ["book-04", 1, "activity", 1, [1], "polyomino-all-draw-b4"],
  ["book-04", 1, "activity", 1, [2], "same-piece-rect-tiling-b4"],
  ["book-04", 1, "practice", 1, [5], "triangle-grid-halves-all-b4"],
  ["book-04", 1, "check", 1, [3], "count-balanced-partition-b4"],
  ["book-04", 1, "practice", 1, [9], "count-balanced-partition-b4"],
  ["book-04", 1, "advanced", 1, [1, 2], "rect-halves-all-ways-b4"],
  ["book-04", 2, "activity", 1, [1], "fold-cut-two-corner-unfold-b4"],
  ["book-04", 2, "practice", 1, [1], "fold-cut-two-corner-unfold-b4"],
  ["book-04", 2, "practice", 1, [13], "pyramid-wall-nth-b4"],
  ["book-04", 2, "check", 2, [2], "stepped-pyramid-hidden-b4"],
  ["book-04", 2, "practice", 1, [16], "stepped-pyramid-hidden-b4"],
  ["book-04", 3, "advanced", 1, [2], "age-list-matching-b4"],
  ["book-04", 4, "check", 1, [4], "bib-rank-derangement-b4"],
  ["book-04", 4, "advanced", 1, [3], "race-talk-ranking-b4"],
  ["book-04", 4, "activity", 2, [4], "round-table-four-b4"],
  ["book-04", 4, "practice", 1, [13], "round-table-five-b4"],
  ["book-04", 4, "practice", 1, [3], "person-item-full-match-b4"],
  ["book-04", 4, "practice", 1, [9], "grid-pen-placement-b4"],
  ["book-04", 4, "practice", 1, [10], "digit-grid-placement-b4"]
];
