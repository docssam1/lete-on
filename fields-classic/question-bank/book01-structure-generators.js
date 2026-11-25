// 1과정 1권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK01_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK01_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK01_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK01_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
// 모든 생성기는 답이 하나인지(또는 「모두」를 묻는 꼴이면 그 목록 전부인지) 완전 탐색으로 확인하고, 안 되면 다시 뽑는다.

import { BOOK01_INTERNALS } from "./book01-generators.js?v=20261119a";
import { foldWordStrip } from "./fold-visuals.js?v=20261123a";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

// 받침 따라 조사를 붙인다. 한글 낱말 · 수(읽는 소리의 끝) · 로마자(A~D는 받침 없음).
const DIGIT_BATCHIM = [true, true, false, true, false, false, true, true, true, false];
function hasBatchim(word) {
  const text = String(word).replace(/[’'"」』)\]]+$/u, "");
  const last = [...text].at(-1) || "";
  const code = last.charCodeAt(0) || 0;
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  if (code >= 0x3131 && code <= 0x314e) return true; // 한글 자음 이름(기역·니은 …)은 모두 받침으로 끝난다
  if (/\d/.test(last)) {
    const digits = text.match(/\d+$/)[0].replace(/^0+(?=\d)/, "");
    const value = Number(digits);
    if (value === 0) return true;
    if (value % 10) return DIGIT_BATCHIM[value % 10];
    if (value % 100) return true; // 십
    if (value % 1000) return true; // 백
    return false; // 천
  }
  return false;
}
const josa = (word, withBatchim, withoutBatchim) => `${word}${hasBatchim(word) ? withBatchim : withoutBatchim}`;
const eun = (word) => josa(word, "은", "는");
const iga = (word) => josa(word, "이", "가");
const eul = (word) => josa(word, "을", "를");
const wa = (word) => josa(word, "과", "와");
const ira = (word) => josa(word, "이라", "라");

function eachPermutation(values, callback) {
  const data = [...values];
  const visit = (index) => {
    if (index === data.length) return callback([...data]);
    for (let cursor = index; cursor < data.length; cursor += 1) {
      [data[index], data[cursor]] = [data[cursor], data[index]];
      visit(index + 1);
      [data[index], data[cursor]] = [data[cursor], data[index]];
    }
  };
  visit(0);
}

const PERMS3 = [];
eachPermutation([0, 1, 2], (p) => PERMS3.push(p));
const PERMS4 = [];
eachPermutation([0, 1, 2, 3], (p) => PERMS4.push(p));

// 조건 목록에서 답 하나가 되는 가장 작은 묶음 고르기: 섞은 차례로 더해 하나가 되면 쓸모없는 조건을 뺀다.
function minimalClueSet(pool, universe, accept = () => true) {
  const picked = [];
  let left = universe;
  for (const clue of pool) {
    const next = left.filter((item) => clue.test(item));
    if (next.length === left.length) continue;
    picked.push(clue);
    left = next;
    if (left.length === 1) break;
  }
  if (left.length !== 1) return null;
  for (let index = picked.length - 1; index >= 0; index -= 1) {
    const without = picked.filter((_, cursor) => cursor !== index);
    if (universe.filter((item) => without.every((clue) => clue.test(item))).length === 1) picked.splice(index, 1);
  }
  return accept(picked) ? picked : null;
}

const fig = (html) => ({ kind: "fig", html });
const svgOpen = (width, height, label, maxWidth = width) => `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}" style="width:${maxWidth}px;max-width:100%;height:auto;display:block">`;
const INK = "#3d3528";
const LINE = "#8f846f";
const SOFT = "#fff7d9";
const GREEN = "#2d8a6c";
const svgText = (x, y, value, { size = 15, weight = 800, fill = INK, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" style="font-size:${size}px;font-weight:${weight};fill:${fill};font-family:inherit">${esc(value)}</text>`;
const clueBox = (clues, question = "") => `<div class="b1-logic-clues">${clues.map((clue, index) => `<p><b>${index + 1}</b>${esc(clue)}</p>`).join("")}${question ? `<strong>${esc(question)}</strong>` : ""}</div>`;
const column = (...parts) => `<div style="display:grid;gap:12px;justify-items:center;width:100%">${parts.join("")}</div>`;
const cardRow = (cards) => `<div class="b1-number-cards">${cards.map((card) => `<i>${esc(card)}</i>`).join("")}</div>`;

// ─────────────────────────────────────────────────────────────
// 4단원 수 추리 — 조건에 맞는 세 자리 수(조건 종류: 1씩 커지는/작아지는 숫자 · 들어 있는 숫자 · 합 · 짝홀 ·
// 모두 짝수/홀수 · 가장 큰/작은 자리 · 두 자리의 합이 다른 자리 · 같은 숫자 · 범위 · 자리 사이 차)
// ─────────────────────────────────────────────────────────────
const PLACE = ["백", "십", "일"];
const THREE_DIGIT = Array.from({ length: 900 }, (_, index) => {
  const value = 100 + index;
  return { value, d: [Math.floor(value / 100), Math.floor(value / 10) % 10, value % 10] };
});

const PV_CLUES = {
  up: (t) => t.d[1] === t.d[0] + 1 && t.d[2] === t.d[1] + 1
    ? { text: "백의 자리부터 일의 자리로 갈수록 숫자가 1씩 커집니다.", test: (x) => x.d[1] === x.d[0] + 1 && x.d[2] === x.d[1] + 1 } : null,
  down: (t) => t.d[1] === t.d[0] - 1 && t.d[2] === t.d[1] - 1
    ? { text: "백의 자리부터 일의 자리로 갈수록 숫자가 1씩 작아집니다.", test: (x) => x.d[1] === x.d[0] - 1 && x.d[2] === x.d[1] - 1 } : null,
  contains: (t) => {
    const k = sample(t.d);
    return { text: `숫자 ${iga(k)} 들어 있습니다.`, test: (x) => x.d.includes(k) };
  },
  sum: (t) => {
    const s = t.d[0] + t.d[1] + t.d[2];
    return { text: `각 자리 숫자의 합은 ${s}입니다.`, test: (x) => x.d[0] + x.d[1] + x.d[2] === s };
  },
  sumOver: (t) => {
    const s = t.d[0] + t.d[1] + t.d[2] - randomInt(1, 3);
    return s > 3 ? { text: `각 자리 숫자의 합이 ${s}보다 큽니다.`, test: (x) => x.d[0] + x.d[1] + x.d[2] > s } : null;
  },
  parity: (t) => {
    const even = t.d[2] % 2 === 0;
    return { text: `${even ? "짝수" : "홀수"}입니다.`, test: (x) => (x.d[2] % 2 === 0) === even };
  },
  allSame: (t) => {
    const even = t.d[0] % 2 === 0;
    if (!t.d.every((digit) => (digit % 2 === 0) === even)) return null;
    return { text: `세 숫자가 모두 ${even ? "짝수" : "홀수"}입니다.`, test: (x) => x.d.every((digit) => (digit % 2 === 0) === even) };
  },
  minMax: (t) => {
    if (new Set(t.d).size !== 3) return null;
    const max = t.d.indexOf(Math.max(...t.d));
    const min = t.d.indexOf(Math.min(...t.d));
    return { text: `${PLACE[min]}의 자리 숫자가 가장 작고 ${PLACE[max]}의 자리 숫자가 가장 큽니다.`, test: (x) => x.d.every((digit, index) => index === min || digit > x.d[min]) && x.d.every((digit, index) => index === max || digit < x.d[max]) };
  },
  largest: (t) => {
    const max = Math.max(...t.d);
    const at = t.d.indexOf(max);
    if (t.d.filter((digit) => digit === max).length !== 1) return null;
    return { text: `${PLACE[at]}의 자리 숫자가 가장 큽니다.`, test: (x) => x.d.every((digit, index) => index === at || digit < x.d[at]) };
  },
  addTo: (t) => {
    const ways = [[0, 2, 1], [1, 2, 0], [0, 1, 2]].filter(([a, b, c]) => t.d[a] + t.d[b] === t.d[c]);
    if (!ways.length) return null;
    const [a, b, c] = sample(ways);
    return { text: `${PLACE[a]}의 자리 숫자와 ${PLACE[b]}의 자리 숫자를 더하면 ${PLACE[c]}의 자리 숫자와 같습니다.`, test: (x) => x.d[a] + x.d[b] === x.d[c] };
  },
  equal: (t) => {
    const ways = [[0, 2], [0, 1], [1, 2]].filter(([a, b]) => t.d[a] === t.d[b]);
    if (!ways.length) return null;
    const [a, b] = sample(ways);
    return { text: `${PLACE[a]}의 자리 숫자와 ${PLACE[b]}의 자리 숫자가 같습니다.`, test: (x) => x.d[a] === x.d[b] };
  },
  between: (t) => {
    const h = t.d[0];
    return { text: `${h * 100}보다 크고 ${(h + 1) * 100}보다 작습니다.`, test: (x) => x.value > h * 100 && x.value < (h + 1) * 100 };
  },
  over: (t) => {
    const n = Math.max(100, (t.d[0] - randomInt(0, 2)) * 100);
    return n < t.value ? { text: `${n}보다 큽니다.`, test: (x) => x.value > n } : null;
  },
  diff: (t) => {
    const ways = [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]].filter(([a, b]) => t.d[a] - t.d[b] >= 2);
    if (!ways.length) return null;
    const [a, b] = sample(ways);
    const g = t.d[a] - t.d[b];
    return { text: `${PLACE[a]}의 자리 숫자가 ${PLACE[b]}의 자리 숫자보다 ${g} 큽니다.`, test: (x) => x.d[a] - x.d[b] === g };
  },
  pairSum: (t) => {
    const ways = [[0, 2], [0, 1], [1, 2]];
    const [a, b] = sample(ways);
    const s = t.d[a] + t.d[b];
    return { text: `${PLACE[a]}의 자리 숫자와 ${PLACE[b]}의 자리 숫자의 합은 ${s}입니다.`, test: (x) => x.d[a] + x.d[b] === s };
  },
  distinct: (t) => new Set(t.d).size === 3 ? { text: "각 자리 숫자가 모두 다릅니다.", test: (x) => new Set(x.d).size === 3 } : null
};

// 교재 꼴 묶음(어느 조건을 함께 쓰는지)
const PV_TEMPLATES = [
  { level: 1, kinds: [["up", "down"], ["contains", "sum"]] },
  { level: 1, kinds: [["up", "down"], ["sumOver"], ["parity"]] },
  { level: 2, kinds: [["sum"], ["parity"], ["allSame"], ["minMax"]] },
  { level: 2, kinds: [["sum", "over"], ["parity"], ["addTo"], ["equal"]] },
  { level: 3, kinds: [["diff"], ["contains"], ["pairSum"], ["largest"]] },
  { level: 3, kinds: [["between"], ["parity"], ["contains"], ["pairSum"]] },
  { level: 3, kinds: [["sum"], ["over"], ["distinct"], ["parity"], ["diff"]] }
];

function placeValueClueThree({ difficulty = 2 }) {
  const templates = PV_TEMPLATES.filter((template) => difficulty === 1 ? template.level === 1 : difficulty === 2 ? template.level <= 2 : template.level >= 2);
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const template = sample(templates);
    const target = sample(THREE_DIGIT);
    const clues = [];
    let ok = true;
    for (const kinds of template.kinds) {
      const made = shuffle(kinds).map((kind) => PV_CLUES[kind](target)).find(Boolean);
      if (!made) { ok = false; break; }
      if (!made.test(target)) { ok = false; break; }
      clues.push(made);
    }
    if (!ok) continue;
    if (new Set(clues.map((clue) => clue.text)).size !== clues.length) continue;
    const left = THREE_DIGIT.filter((item) => clues.every((clue) => clue.test(item)));
    if (left.length !== 1 || left[0].value !== target.value) continue;
    // 쓸모없는 조건이 있으면(빼도 답이 하나) 다시 뽑는다 — 교재 조건은 모두 쓰인다.
    const redundant = clues.some((_, index) => THREE_DIGIT.filter((item) => clues.every((clue, cursor) => cursor === index || clue.test(item))).length === 1);
    if (redundant) continue;
    // 풀이: 가장 많이 줄여 주는 조건부터 차례로, 남은 수가 적으면 늘어놓는다.
    const steps = [];
    let pool = THREE_DIGIT;
    const rest = [...clues];
    while (rest.length) {
      rest.sort((a, b) => pool.filter((item) => a.test(item)).length - pool.filter((item) => b.test(item)).length);
      const clue = rest.shift();
      pool = pool.filter((item) => clue.test(item));
      const list = pool.length <= 8 ? pool.map((item) => item.value).join(", ") : `${pool.length}개`;
      steps.push(`${clue.text} 여기까지 맞는 수: ${list}.`);
    }
    return {
      prompt: "다음 조건에 모두 맞는 세 자리 수를 구하세요.",
      visual: { kind: "book1", subtype: "condition-card", title: "세 자리 수", clues: clues.map((clue) => clue.text) },
      answer: String(target.value),
      solution: `범위를 가장 많이 줄여 주는 조건부터 하나씩 적용합니다. ${steps.join(" ")} 따라서 조건에 모두 맞는 수는 ${target.value}입니다.`,
      meta: { family: "place-value-3-clues", target: target.value, clues: clues.map((clue) => clue.text), uniqueCount: 1 }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 4단원 논리 추리 — 네 사람(동물)의 등수: 「가장 앞」「가장 뒤가 아님」「바로 뒤」「사이」「앞/뒤」 조건으로 한 줄 정하기
// ─────────────────────────────────────────────────────────────
const RANK_PEOPLE = [
  ["태오", "하람", "지민", "유나"], ["다온", "시우", "예린", "건우"], ["로운", "서아", "준서", "채원"],
  ["A", "B", "C", "D"], ["㉮", "㉯", "㉰", "㉱"]
];
const RANK_ANIMALS = [["토끼", "여우", "다람쥐", "거북"], ["말", "타조", "얼룩말", "캥거루"], ["염소", "강아지", "고양이", "오리"]];
const RANK_SCENES = {
  race: {
    lead: "네 사람이 달리기를 하고 있습니다.", slots: ["1등", "2등", "3등", "4등"],
    ask: (rank) => `${rank + 1}등으로 달리고 있는 사람은 누구인가요?`,
    t: {
      first: (x) => `${eun(x)} 가장 앞에서 달리고 있습니다.`,
      last: (x) => `${eun(x)} 가장 뒤에서 달리고 있습니다.`,
      notLast: (x) => `${eun(x)} 가장 뒤에서 달리고 있지 않습니다.`,
      notFirst: (x) => `${eun(x)} 가장 앞에서 달리고 있지 않습니다.`,
      rightBehind: (x, y) => `${eun(x)} ${y} 바로 뒤에서 달리고 있습니다.`,
      ahead: (x, y) => `${eun(x)} ${y}보다 앞에서 달리고 있습니다.`,
      behind: (x, y) => `${eun(x)} ${y}보다 뒤에서 달리고 있습니다.`,
      between: (x, y, z) => `${eun(x)} ${wa(y)} ${z} 사이에서 달리고 있습니다.`
    }
  },
  arrive: {
    lead: "동물 네 마리가 달리기 경주를 했습니다.", slots: ["1등", "2등", "3등", "4등"], animals: true,
    ask: (rank) => `${rank + 1}등으로 들어온 동물은 무엇인가요?`,
    t: {
      first: (x) => `${iga(x)} 가장 먼저 들어왔습니다.`,
      last: (x) => `${iga(x)} 가장 마지막에 들어왔습니다.`,
      notLast: (x) => `${eun(x)} 가장 마지막에 들어오지 않았습니다.`,
      notFirst: (x) => `${eun(x)} 가장 먼저 들어오지 않았습니다.`,
      rightBehind: (x, y) => `${eun(x)} ${y} 바로 다음으로 들어왔습니다.`,
      ahead: (x, y) => `${eun(x)} ${y}보다 먼저 들어왔습니다.`,
      behind: (x, y) => `${eun(x)} ${y}보다 늦게 들어왔습니다.`,
      between: (x, y, z) => `${eun(x)} ${wa(y)} ${z} 사이에 들어왔습니다.`
    }
  },
  line: {
    lead: "네 사람이 한 줄로 서 있습니다.", slots: ["(앞)", "", "", "(뒤)"],
    ask: (rank, fromBack) => fromBack ? `뒤에서 ${["첫", "두", "세", "네"][3 - rank]} 번째에 서 있는 사람은 누구인가요?` : `앞에서 ${["첫", "두", "세", "네"][rank]} 번째에 서 있는 사람은 누구인가요?`,
    t: {
      first: (x) => `${eun(x)} 맨 앞에 서 있습니다.`,
      last: (x) => `${eun(x)} 맨 뒤에 서 있습니다.`,
      notLast: (x) => `${eun(x)} 맨 뒤에 서 있지 않습니다.`,
      notFirst: (x) => `${eun(x)} 맨 앞에 서 있지 않습니다.`,
      rightBehind: (x, y) => `${eun(x)} ${y} 바로 뒤에 서 있습니다.`,
      ahead: (x, y) => `${eun(x)} ${y}보다 앞에 서 있습니다.`,
      behind: (x, y) => `${eun(x)} ${y}보다 뒤에 서 있습니다.`,
      between: (x, y, z) => `${eun(x)} ${wa(y)} ${z} 사이에 서 있습니다.`
    }
  }
};

function rankClues(order, names, scene) {
  const at = (candidate, person) => candidate.indexOf(person);
  const t = scene.t;
  const clues = [];
  names.forEach((name, person) => {
    const pos = at(order, person);
    if (pos === 0) clues.push({ kind: "first", about: [person], text: t.first(name), test: (c) => at(c, person) === 0 });
    if (pos === 3) clues.push({ kind: "last", about: [person], text: t.last(name), test: (c) => at(c, person) === 3 });
    if (pos !== 3) clues.push({ kind: "notLast", about: [person], text: t.notLast(name), test: (c) => at(c, person) !== 3 });
    if (pos !== 0) clues.push({ kind: "notFirst", about: [person], text: t.notFirst(name), test: (c) => at(c, person) !== 0 });
  });
  for (let a = 0; a < 4; a += 1) {
    for (let b = 0; b < 4; b += 1) {
      if (a === b) continue;
      const pa = at(order, a);
      const pb = at(order, b);
      if (pa === pb + 1) clues.push({ kind: "rightBehind", about: [a, b], text: t.rightBehind(names[a], names[b]), test: (c) => at(c, a) === at(c, b) + 1 });
      if (pa < pb) clues.push({ kind: "ahead", about: [a, b], text: t.ahead(names[a], names[b]), test: (c) => at(c, a) < at(c, b) });
      if (pa > pb) clues.push({ kind: "behind", about: [a, b], text: t.behind(names[a], names[b]), test: (c) => at(c, a) > at(c, b) });
      if (b < a) continue;
      for (let m = 0; m < 4; m += 1) {
        if (m === a || m === b) continue;
        const pm = at(order, m);
        if (pm > Math.min(pa, pb) && pm < Math.max(pa, pb)) {
          clues.push({ kind: "between", about: [m, a, b], text: t.between(names[m], names[a], names[b]), test: (c) => { const x = at(c, m); return x > Math.min(at(c, a), at(c, b)) && x < Math.max(at(c, a), at(c, b)); } });
        }
      }
    }
  }
  return clues;
}

function slotRow(slots, values = null) {
  const width = 4 * 66 + 10;
  const cells = slots.map((label, index) => {
    const x = 5 + index * 66;
    const value = values ? values[index] : "";
    return `<rect x="${x}" y="22" width="60" height="40" rx="4" fill="#fff" stroke="${LINE}" stroke-width="1.6"/>${label ? svgText(x + 30, 10, label, { size: 12, weight: 700, fill: "#6d6250" }) : ""}${value ? svgText(x + 30, 42, value, { size: 13 }) : ""}`;
  }).join("");
  return `${svgOpen(width, 68, "순서를 적는 칸", 300)}${cells}</svg>`;
}

function rankOrderFour({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const sceneId = sample(["race", "race", "arrive", "line"]);
    const scene = RANK_SCENES[sceneId];
    const names = scene.animals ? sample(RANK_ANIMALS) : sample(RANK_PEOPLE);
    const order = sample(PERMS4);
    const all = rankClues(order, names, scene);
    const usable = difficulty === 3 ? all.filter((clue) => !["first", "last"].includes(clue.kind)) : all;
    const pool = shuffle(usable);
    if (difficulty === 1) pool.sort((a, b) => Number(["first", "last"].includes(b.kind)) - Number(["first", "last"].includes(a.kind)));
    const picked = minimalClueSet(pool, PERMS4, (list) => list.length >= 2 && list.length <= (difficulty === 1 ? 3 : 4));
    if (!picked) continue;
    // 묻는 사람은 「가장 앞/뒤」 조건에 바로 나온 사람이 아니게
    const named = new Set(picked.filter((clue) => ["first", "last"].includes(clue.kind)).map((clue) => clue.about[0]));
    const askable = [0, 1, 2, 3].filter((rank) => !named.has(order[rank]));
    if (!askable.length) continue;
    const rank = sample(askable);
    const answer = names[order[rank]];
    const question = scene.ask(rank, rank >= 2 && Math.random() < 0.5);
    const lineUp = order.map((person) => names[person]).join(" → ");
    return {
      prompt: `${scene.lead} 조건을 보고 물음에 답하세요.`,
      visual: fig(column(clueBox(picked.map((clue) => clue.text), question), slotRow(scene.slots))),
      answerVisual: fig(slotRow(scene.slots, order.map((person) => names[person]))),
      answer,
      solution: `자리가 바로 정해지는 조건부터 칸에 놓고, 나머지 조건으로 남은 칸을 채웁니다. 앞에서부터 ${lineUp} 차례이므로 답은 ${answer}입니다.`,
      meta: { family: "rank-order-four", order, names, clues: picked.map((clue) => clue.text), rank, uniqueCount: 1 }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 4단원 논리 추리 — 세 사람과 세 가지를 하나씩 잇기(선 잇기 판).
// 조건: 「~가 아닙니다」「~도 ~도 아닙니다」「~와 ~ 중 하나」, 물건의 성질로 말하는 조건(「물에서 하는 운동」)
// ─────────────────────────────────────────────────────────────
const MATCH_PEOPLE = [["하준", "소윤", "도하"], ["예준", "나은", "시온"], ["리아", "우진", "채아"], ["A", "B", "C"], ["㉮", "㉯", "㉰"]];
const likeSet = (noun, items, hintYes, hintNo) => ({
  items, hintYes, hintNo,
  lead: `서로 다른 ${eul(noun)} 한 가지씩 좋아합니다`,
  yes: (i) => `${eul(items[i])} 좋아합니다`,
  no: (i) => `${eul(items[i])} 좋아하지 않습니다`,
  neither: (i, j) => `${items[i]}도 ${items[j]}도 좋아하지 않습니다`,
  either: (i, j) => `${wa(items[i])} ${items[j]} 중 하나를 좋아합니다`,
  askItem: (name) => `${iga(name)} 좋아하는 ${eun(noun)} 무엇인가요?`,
  askWho: (i) => `${eul(items[i])} 좋아하는 사람은 누구인가요?`
});
const MATCH_SETS = [
  likeSet("운동", ["수영", "축구", "탁구"],
    ["물에서 하는 운동을 좋아합니다", "공을 발로 차는 운동을 좋아합니다", "라켓으로 공을 치는 운동을 좋아합니다"],
    ["물에 들어가는 운동을 싫어합니다", "발로 하는 운동을 못합니다", "라켓을 쓰는 운동을 해 본 적이 없습니다"]),
  likeSet("동물", ["펭귄", "기린", "거미"],
    ["추운 곳에 사는 동물을 좋아합니다", "목이 긴 동물을 좋아합니다", "다리가 여덟 개인 동물을 좋아합니다"],
    ["추운 곳에 사는 동물을 싫어합니다", "키가 큰 동물을 싫어합니다", "다리가 많은 동물을 싫어합니다"]),
  likeSet("색", ["빨강", "파랑", "노랑"],
    ["잘 익은 딸기 색을 좋아합니다", "맑은 하늘 색을 좋아합니다", "병아리 색을 좋아합니다"],
    ["잘 익은 딸기 색을 싫어합니다", "바다 색을 싫어합니다", "병아리 색을 싫어합니다"]),
  likeSet("계절", ["봄", "여름", "겨울"],
    ["꽃이 피는 계절을 좋아합니다", "바다에서 수영하는 계절을 좋아합니다", "눈사람을 만드는 계절을 좋아합니다"],
    ["꽃가루 때문에 꽃이 피는 계절을 싫어합니다", "더운 계절을 싫어합니다", "추운 계절을 싫어합니다"]),
  {
    items: ["소방관", "요리사", "우체부"],
    hintYes: ["불을 끄는 일을 합니다", "음식을 만드는 일을 합니다", "편지를 나르는 일을 합니다"],
    hintNo: ["불을 끄는 일을 하지 않습니다", "부엌에서 일하지 않습니다", "편지를 나르는 일을 하지 않습니다"],
    lead: "서로 다른 직업을 한 가지씩 가지고 있습니다",
    yes: (i) => `${["소방관", "요리사", "우체부"][i]}입니다`,
    no: (i) => `${iga(["소방관", "요리사", "우체부"][i])} 아닙니다`,
    neither: (i, j) => `${["소방관", "요리사", "우체부"][i]}도 ${["소방관", "요리사", "우체부"][j]}도 아닙니다`,
    either: (i, j) => `${["소방관", "요리사", "우체부"][i]} 아니면 ${["소방관", "요리사", "우체부"][j]}입니다`,
    askItem: (name) => `${name}의 직업은 무엇인가요?`,
    askWho: (i) => `${["소방관", "요리사", "우체부"][i]}인 사람은 누구인가요?`
  }
];
function matchBoard(people, items, links = null) {
  const width = 280;
  const height = 30 + people.length * 44;
  const rows = people.map((person, index) => {
    const y = 26 + index * 44;
    return `${svgText(46, y, person, { size: 14 })}<circle cx="92" cy="${y}" r="4.5" fill="${INK}"/>${svgText(234, y, items[index], { size: 14 })}<circle cx="188" cy="${y}" r="4.5" fill="${INK}"/>`;
  }).join("");
  const lines = links ? links.map((item, person) => `<line x1="92" y1="${26 + person * 44}" x2="188" y2="${26 + item * 44}" stroke="${GREEN}" stroke-width="2.4"/>`).join("") : "";
  return `${svgOpen(width, height, "사람과 알맞은 것을 선으로 잇는 판", 280)}${lines}${rows}</svg>`;
}

function personItemThree({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const set = sample(MATCH_SETS);
    const people = sample(MATCH_PEOPLE);
    const solution = sample(PERMS3); // 사람 p → 물건 solution[p]
    const clues = [];
    people.forEach((name, p) => {
      const mine = solution[p];
      const others = [0, 1, 2].filter((i) => i !== mine);
      if (difficulty === 1) clues.push({ kind: "yes", p, text: `${eun(name)} ${set.yes(mine)}.`, test: (c) => c[p] === mine });
      clues.push({ kind: "hintYes", p, text: `${eun(name)} ${set.hintYes[mine]}.`, test: (c) => c[p] === mine });
      others.forEach((i) => {
        clues.push({ kind: "no", p, text: `${eun(name)} ${set.no(i)}.`, test: (c) => c[p] !== i });
        clues.push({ kind: "hintNo", p, text: `${eun(name)} ${set.hintNo[i]}.`, test: (c) => c[p] !== i });
      });
      if (difficulty >= 2) clues.push({ kind: "neither", p, text: `${eun(name)} ${set.neither(others[0], others[1])}.`, test: (c) => !others.includes(c[p]) });
      const pair = [mine, sample(others)].sort((a, b) => a - b);
      clues.push({ kind: "either", p, text: `${eun(name)} ${set.either(pair[0], pair[1])}.`, test: (c) => pair.includes(c[p]) });
    });
    const picked = minimalClueSet(shuffle(clues), PERMS3, (list) => list.length >= 2 && list.length <= 3);
    if (!picked) continue;
    const direct = new Set(picked.filter((clue) => ["yes", "hintYes", "neither"].includes(clue.kind)).map((clue) => clue.p));
    const askWho = Math.random() < 0.4;
    const pairs = people.map((name, p) => `${name}-${set.items[solution[p]]}`).join(", ");
    let question;
    let answer;
    if (askWho) {
      const item = randomInt(0, 2);
      const owner = solution.indexOf(item);
      if (direct.has(owner)) continue;
      question = set.askWho(item);
      answer = people[owner];
    } else {
      const person = randomInt(0, 2);
      if (direct.has(person)) continue;
      question = set.askItem(people[person]);
      answer = set.items[solution[person]];
    }
    return {
      prompt: `${people.join(", ")} 세 사람은 ${set.lead}. 알맞게 선으로 잇고 물음에 답하세요.`,
      visual: fig(column(clueBox(picked.map((clue) => clue.text), question), matchBoard(people, set.items))),
      answerVisual: fig(matchBoard(people, set.items, solution)),
      answer,
      solution: `조건에서 될 수 없는 짝을 지워 가면 한 가지만 남는 사람부터 선이 정해집니다. ${pairs}로 이어지므로 답은 ${answer}입니다.`,
      meta: { family: "person-item-three", solution, people, items: set.items, clues: picked.map((clue) => clue.text), uniqueCount: 1 }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 4단원 도전 — 등 번호와 등수가 하나도 같지 않은 네 선수(+ 한두 가지 조건)
// ─────────────────────────────────────────────────────────────
const DERANGED4 = PERMS4.filter((order) => order.every((bib, rank) => bib !== rank)); // order[rank] = 등 번호 - 1

function bibRankMismatch({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const order = sample(DERANGED4);
    const at = (candidate, bib) => candidate.indexOf(bib);
    const name = (bib) => `${bib + 1}번 선수`;
    const clues = [];
    for (let a = 0; a < 4; a += 1) {
      for (let b = 0; b < 4; b += 1) {
        if (a === b) continue;
        if (at(order, a) === at(order, b) + 1) clues.push({ text: `${name(a)}는 ${name(b)} 바로 다음으로 들어왔습니다.`, test: (c) => at(c, a) === at(c, b) + 1 });
        if (at(order, a) < at(order, b) && difficulty >= 2) clues.push({ text: `${name(a)}는 ${name(b)}보다 먼저 들어왔습니다.`, test: (c) => at(c, a) < at(c, b) });
      }
      if (at(order, a) !== 3) clues.push({ text: `${name(a)}는 꼴찌가 아닙니다.`, test: (c) => at(c, a) !== 3 });
      if (at(order, a) !== 0 && difficulty === 3) clues.push({ text: `${name(a)}는 1등이 아닙니다.`, test: (c) => at(c, a) !== 0 });
    }
    const picked = minimalClueSet(shuffle(clues), DERANGED4, (list) => list.length >= 1 && list.length <= 2);
    if (!picked) continue;
    const rank = randomInt(0, 3);
    const answer = `${order[rank] + 1}번`;
    const all = ["자기 등 번호와 같은 등수로 들어온 선수는 한 명도 없습니다.", ...picked.map((clue) => clue.text)];
    return {
      prompt: `등 번호가 1번, 2번, 3번, 4번인 네 선수가 달리기를 했습니다. 동시에 들어온 선수는 없습니다. 조건을 보고 ${rank + 1}등은 몇 번 선수인지 구하세요.`,
      visual: fig(column(clueBox(all), slotRow(["1등", "2등", "3등", "4등"]))),
      answerVisual: fig(slotRow(["1등", "2등", "3등", "4등"], order.map((bib) => `${bib + 1}번`))),
      answer,
      solution: `1등부터 4등까지 각 칸에 자기 번호는 올 수 없습니다. 조건에 맞게 놓아 보면 1등부터 ${order.map((bib) => `${bib + 1}번`).join(", ")}만 됩니다. 따라서 ${rank + 1}등은 ${answer} 선수입니다.`,
      meta: { family: "bib-rank-mismatch", order, clues: all, rank, uniqueCount: 1 }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 4단원 수 추리 — 표 채우기: 각 자리 숫자가 같은 크기만큼 커지는/작아지는 세 자리 수, 각 자리 숫자의 합이 같은 두 자리 수
// ─────────────────────────────────────────────────────────────
function tableHtml(head, rows) {
  const cell = "border:1.4px solid #a59a87;padding:6px 8px;text-align:center;font-weight:800;font-size:13px;word-break:keep-all";
  return `<table style="border-collapse:collapse;background:#fff;color:${INK};min-width:300px;max-width:100%"><thead><tr>${head.map((label) => `<th style="${cell};background:#f3ede0;font-size:12px">${esc(label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value, index) => `<td style="${cell}${index === 1 ? ";min-width:150px" : ""}${value === "" ? `;background:${SOFT}` : ""}">${esc(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function equalStepNumbers(step, up) {
  const list = [];
  for (let h = 1; h <= 9; h += 1) {
    const t = up ? h + step : h - step;
    const o = up ? h + 2 * step : h - 2 * step;
    if (t >= 0 && t <= 9 && o >= 0 && o <= 9) list.push(h * 100 + t * 10 + o);
  }
  return list;
}

function threeDigitEqualStepTable({ difficulty = 2 }) {
  const up = Math.random() < 0.5;
  const steps = difficulty === 1 ? shuffle([1, 2, 3, 4]).slice(0, 3).sort((a, b) => b - a) : [4, 3, 2, 1];
  if (difficulty === 3 && Math.random() < 0.5) steps.reverse();
  const shownRow = difficulty === 3 ? -1 : difficulty === 2 ? randomInt(0, steps.length - 1) : 0;
  const word = up ? "커집니다" : "작아집니다";
  const rows = steps.map((step) => {
    const list = equalStepNumbers(step, up);
    return { step, list };
  });
  const head = [`각 자리 숫자가 ${up ? "커지는" : "작아지는"} 규칙`, "조건에 맞는 세 자리 수", "개수"];
  const label = (step, index) => `${"①②③④"[index]} 각 자리 숫자가 ${step}씩 ${word}`;
  const visualRows = rows.map((row, index) => index === shownRow ? [label(row.step, index), row.list.join(", "), `${row.list.length}개`] : [label(row.step, index), "", ""]);
  const answerRows = rows.map((row, index) => [label(row.step, index), row.list.join(", "), `${row.list.length}개`]);
  return {
    prompt: `백의 자리, 십의 자리, 일의 자리 숫자가 같은 크기만큼 ${up ? "커지는" : "작아지는"} 세 자리 수를 구하는 표입니다. 빈칸에 알맞은 수를 모두 쓰고 개수를 구하세요.`,
    visual: fig(tableHtml(head, visualRows)),
    answerVisual: fig(tableHtml(head, answerRows)),
    answer: rows.filter((_, index) => index !== shownRow).map((row) => `${row.step}씩: ${row.list.join(", ")} (${row.list.length}개)`).join(" / "),
    responseKind: "drawing",
    solution: `백의 자리 숫자를 ${up ? "1부터" : "9부터"} 차례로 정하고 ${up ? "더해서" : "빼서"} 십의 자리·일의 자리를 만듭니다. 일의 자리가 ${up ? "9를 넘으면" : "0보다 작아지면"} 안 됩니다. ${rows.map((row) => `${row.step}씩은 ${row.list.length}개`).join(", ")}입니다.`,
    meta: { family: "equal-step-table", up, steps, rows: rows.map((row) => row.list), shownRow }
  };
}

function digitSumPairs(sum) {
  const list = [];
  for (let tens = 1; tens <= 9; tens += 1) {
    const ones = sum - tens;
    if (ones >= 0 && ones <= 9) list.push(tens * 10 + ones);
  }
  return list;
}

function digitSumTableFill({ difficulty = 2 }) {
  const down = Math.random() < 0.5;
  const count = difficulty === 1 ? 6 : difficulty === 2 ? 7 : 8;
  const start = down ? randomInt(16, 18) : randomInt(1, 4);
  const sums = Array.from({ length: count }, (_, index) => down ? start - index : start + index);
  const shown = difficulty === 3 ? 1 : 2;
  const head = ["각 자리 숫자의 합", "두 자리 수", "개수"];
  const rows = sums.map((sum) => ({ sum, list: digitSumPairs(sum) }));
  const visualRows = rows.map((row, index) => index < shown ? [String(row.sum), row.list.join(", "), `${row.list.length}개`] : [String(row.sum), "", ""]);
  const answerRows = rows.map((row) => [String(row.sum), row.list.join(", "), `${row.list.length}개`]);
  const last = rows.at(-1);
  return {
    prompt: "각 자리 숫자의 합이 같은 두 자리 수를 구하는 표입니다. 빈칸을 채우세요.",
    visual: fig(tableHtml(head, visualRows)),
    answerVisual: fig(tableHtml(head, answerRows)),
    answer: rows.slice(shown).map((row) => `${row.sum}: ${row.list.join(", ")} (${row.list.length}개)`).join(" / "),
    responseKind: "drawing",
    solution: `십의 자리 숫자를 1부터 차례로 바꾸고, 일의 자리는 합에서 십의 자리 숫자를 뺀 수로 정합니다(일의 자리는 0부터 9까지). 합이 ${down ? "1 작아질" : "1 커질"} 때마다 개수가 어떻게 바뀌는지 살펴봅니다. 마지막 줄 ${eun(last.sum)} ${last.list.length}개입니다.`,
    meta: { family: "digit-sum-table", sums, rows: rows.map((row) => row.list), shown }
  };
}

// 주사위 두 개로 만드는 두 자리 수 중 조건에 맞는 수의 개수
function dieFace(x, y, size = 54) {
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="9" fill="#fff" stroke="${INK}" stroke-width="2"/>${svgText(x + size / 2, y + size / 2, "1~6", { size: 13, weight: 800, fill: "#6d6250" })}`;
}

function diceTwoDigitCount({ difficulty = 2 }) {
  const all = [];
  for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) all.push({ tens: a, ones: b, value: a * 10 + b });
  const kinds = difficulty === 1 ? ["sum"] : difficulty === 2 ? ["sum", "diff"] : ["sum", "diff", "sumBig"];
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const kind = sample(kinds);
    let text;
    let test;
    if (kind === "sum") {
      const s = randomInt(3, 11);
      text = `십의 자리 숫자와 일의 자리 숫자의 합이 ${s}인 수`;
      test = (x) => x.tens + x.ones === s;
    } else if (kind === "diff") {
      const d = randomInt(1, 4);
      text = `십의 자리 숫자가 일의 자리 숫자보다 ${d} 큰 수`;
      test = (x) => x.tens - x.ones === d;
    } else {
      const s = randomInt(5, 9);
      text = `두 숫자의 합이 ${s}이고 십의 자리 숫자가 더 큰 수`;
      test = (x) => x.tens + x.ones === s && x.tens > x.ones;
    }
    const answers = all.filter(test).map((x) => x.value);
    if (answers.length < 2) continue;
    return {
      prompt: `1~6 눈이 있는 주사위 두 개를 던져, 나온 두 숫자로 두 자리 수를 만듭니다. 만들 수 있는 수 가운데 ${text}는 모두 몇 개인가요?`,
      visual: fig(`${svgOpen(190, 70, "1부터 6까지 쓰인 주사위 두 개", 190)}${dieFace(20, 8)}${svgText(95, 35, "+", { size: 18, fill: LINE })}${dieFace(116, 8)}</svg>`),
      answer: `${answers.length}개`,
      solution: `십의 자리에 나올 수 있는 숫자를 1부터 6까지 차례로 정하고 일의 자리 숫자를 맞춰 봅니다(일의 자리도 1부터 6까지). ${answers.join(", ")}이므로 ${answers.length}개입니다.`,
      meta: { family: "dice-two-digit", kind, answers, answer: answers.length }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 3단원 — T자(가운데 아래로 두 칸)·ㄱ자(오른쪽 끝 아래로 두 칸) 마방진을 세 가지로 완성하고 한 줄의 합 구하기
// 다섯 수 카드는 같은 간격으로 커지는 수. 두 줄이 함께 쓰는 칸에 가장 작은 수·가운데 수·가장 큰 수를 놓는 세 가지가 있다.
// ─────────────────────────────────────────────────────────────
const MAGIC_CELL = 34;
const MAGIC_SHAPES = {
  t: { name: "T자", cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]], h: [0, 1, 2], v: [1, 3, 4], shared: 1 },
  corner: { name: "ㄱ자", cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], h: [0, 1, 2], v: [2, 3, 4], shared: 2 }
};

function magicBoards(shape, boards) {
  const gap = 34;
  const boardWidth = 3 * MAGIC_CELL;
  const width = boards.length * boardWidth + (boards.length - 1) * gap + 8;
  const height = 3 * MAGIC_CELL + 44;
  const body = boards.map((board, index) => {
    const ox = 4 + index * (boardWidth + gap);
    const cells = shape.cells.map(([cx, cy], cell) => {
      const x = ox + cx * MAGIC_CELL;
      const y = 4 + cy * MAGIC_CELL;
      const value = board.values ? board.values[cell] : null;
      return `<rect x="${x}" y="${y}" width="${MAGIC_CELL}" height="${MAGIC_CELL}" fill="#fff" stroke="${LINE}" stroke-width="1.6"/>${value == null ? "" : svgText(x + MAGIC_CELL / 2, y + MAGIC_CELL / 2 + 1, value, { size: 14 })}`;
    }).join("");
    const sumY = 4 + 3 * MAGIC_CELL + 20;
    const sumBox = `${svgText(ox + 30, sumY, "합 :", { size: 12, weight: 700, fill: "#6d6250" })}<rect x="${ox + 48}" y="${sumY - 12}" width="40" height="24" fill="#fff" stroke="${LINE}" stroke-width="1.4"/>${board.sum == null ? "" : svgText(ox + 68, sumY, board.sum, { size: 13 })}`;
    return cells + sumBox;
  }).join("");
  return `${svgOpen(width, height, `${shape.name} 마방진 판 ${boards.length}개`, Math.min(width, 400))}${body}</svg>`;
}

function shapeMagicThreeWays(shapeId, difficulty) {
  const shape = MAGIC_SHAPES[shapeId];
  const step = difficulty === 1 ? sample([1, 2]) : difficulty === 2 ? sample([1, 2, 3]) : sample([2, 3, 4]);
  const start = randomInt(1, difficulty === 3 ? 9 : 6);
  const cards = Array.from({ length: 5 }, (_, index) => start + index * step);
  const boards = [0, 2, 4].map((sharedIndex) => {
    const shared = cards[sharedIndex];
    const rest = cards.filter((_, index) => index !== sharedIndex);
    // 나머지 넷을 합이 같은 두 쌍으로: 가장 작은 수 + 가장 큰 수, 남은 두 수
    const pairA = shuffle([rest[0], rest[3]]);
    const pairB = shuffle([rest[1], rest[2]]);
    const [first, second] = Math.random() < 0.5 ? [pairA, pairB] : [pairB, pairA];
    const values = Array(5).fill(null);
    values[shape.shared] = shared;
    const hOthers = shape.h.filter((cell) => cell !== shape.shared);
    const vOthers = shape.v.filter((cell) => cell !== shape.shared);
    hOthers.forEach((cell, index) => { values[cell] = first[index]; });
    vOthers.forEach((cell, index) => { values[cell] = second[index]; });
    const sum = shape.h.reduce((total, cell) => total + values[cell], 0);
    return { shared, values, sum };
  });
  const sums = boards.map((board) => board.sum);
  return {
    prompt: `다섯 수 카드를 한 번씩 써서 가로줄과 세로줄의 세 수의 합이 같은 ${shape.name} 마방진을 세 가지로 만들고, 판마다 한 줄의 합을 쓰세요.`,
    visual: fig(column(cardRow(cards), magicBoards(shape, boards.map(() => ({}))))),
    answerVisual: fig(magicBoards(shape, boards)),
    answer: `합: ${sums.join(", ")}`,
    responseKind: "drawing",
    solution: `가로줄과 세로줄이 함께 쓰는 칸의 수를 정하면, 남은 네 수를 합이 같은 두 쌍으로 나눠야 합니다. 함께 쓰는 칸에 ${boards.map((board) => board.shared).join(", ")}을 놓을 때만 두 쌍으로 나뉘므로 세 가지가 나오고, 한 줄의 합은 ${sums.join(", ")}입니다.`.replace(/(\d+)을 놓을/, (m, n) => `${eul(n)} 놓을`),
    meta: { family: "magic-shape-three", shape: shapeId, cards, boards, sums }
  };
}

function tShapeMagicThreeWays({ difficulty = 2 }) { return shapeMagicThreeWays("t", difficulty); }
function cornerShapeMagicThreeWays({ difficulty = 2 }) { return shapeMagicThreeWays("corner", difficulty); }

// ─────────────────────────────────────────────────────────────
// 3단원 — 연속한 여덟 수(1부터가 아닌 수에서 시작)로 네모 둘레의 가로·세로 줄 합 같게 하기(꼭짓점 셋이 주어짐)
// 자리: 0 왼쪽 위 · 1 위 가운데 · 2 오른쪽 위 · 3 오른쪽 가운데 · 4 오른쪽 아래 · 5 아래 가운데 · 6 왼쪽 아래 · 7 왼쪽 가운데
// ─────────────────────────────────────────────────────────────
const RING_LINES = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]];

function ringSolutions(cards, target) {
  const set = new Set(cards);
  const found = [];
  for (const c0 of cards) for (const c2 of cards) for (const c4 of cards) for (const c6 of cards) {
    const corners = [c0, c2, c4, c6];
    if (new Set(corners).size !== 4) continue;
    const e1 = target - c0 - c2;
    const e3 = target - c2 - c4;
    const e5 = target - c4 - c6;
    const e7 = target - c6 - c0;
    const values = [c0, e1, c2, e3, c4, e5, c6, e7];
    if (new Set(values).size === 8 && values.every((value) => set.has(value))) found.push(values);
  }
  return found;
}

function ringBoard(values, given) {
  const pos = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
  const size = 40;
  const pitch = 64;
  const lines = RING_LINES.map(([a, , c]) => `<line x1="${10 + pos[a][0] * pitch + size / 2}" y1="${10 + pos[a][1] * pitch + size / 2}" x2="${10 + pos[c][0] * pitch + size / 2}" y2="${10 + pos[c][1] * pitch + size / 2}" stroke="${LINE}" stroke-width="1.6"/>`).join("");
  const cells = pos.map(([cx, cy], index) => {
    const x = 10 + cx * pitch;
    const y = 10 + cy * pitch;
    const show = given.includes(index) || values;
    const value = values ? values[index] : null;
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${given.includes(index) ? "#fff" : "#fff"}" stroke="${INK}" stroke-width="1.6"/>${show && value != null ? svgText(x + size / 2, y + size / 2 + 1, value, { size: 16, weight: given.includes(index) ? 800 : 700, fill: given.includes(index) ? INK : GREEN }) : ""}`;
  }).join("");
  const width = 20 + 2 * pitch + size;
  return `${svgOpen(width, width, "네모 둘레에 수를 넣는 판", width)}${lines}${cells}</svg>`;
}

const RING_CACHE = new Map();

function equalLineEightCardsRange({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const start = difficulty === 1 ? 2 : randomInt(2, difficulty === 3 ? 6 : 4);
    const cards = Array.from({ length: 8 }, (_, index) => start + index);
    if (!RING_CACHE.has(start)) {
      const list = [];
      for (let target = 3 * start; target <= 3 * (start + 7); target += 1) {
        const solutions = ringSolutions(cards, target);
        if (solutions.length) list.push({ target, solutions });
      }
      RING_CACHE.set(start, list);
    }
    const targets = RING_CACHE.get(start);
    const pick = sample(targets);
    const solution = sample(pick.solutions);
    const cornerSets = shuffle([[0, 2, 4], [2, 4, 6], [4, 6, 0], [6, 0, 2]]);
    for (const given of cornerSets) {
      const matches = pick.solutions.filter((other) => given.every((index) => other[index] === solution[index]));
      if (matches.length !== 1) continue;
      const shownGiven = given;
      const display = solution.map((value, index) => shownGiven.includes(index) ? value : null);
      const clockwise = solution.map((value, index) => shownGiven.includes(index) ? null : value).filter((value) => value != null);
      return {
        prompt: `수 카드 ${start}~${eul(start + 7)} 한 번씩 써서 네모 둘레의 가로줄·세로줄마다 세 수의 합이 ${iga(pick.target)} 되게 빈칸을 채우세요.`,
        visual: fig(column(cardRow(cards), ringBoard(display, shownGiven))),
        answerVisual: fig(ringBoard(solution, shownGiven)),
        answer: `왼쪽 위부터 시계 방향으로 빈칸: ${clockwise.join(", ")}`,
        responseKind: "drawing",
        solution: `두 꼭짓점이 정해진 줄은 가운데 칸이 바로 정해집니다(합 ${pick.target}에서 두 수를 뺍니다). 남은 꼭짓점은 남은 카드 중 두 줄의 합이 모두 ${iga(pick.target)} 되는 수를 찾아 넣습니다. 왼쪽 위부터 시계 방향으로 ${solution.join(", ")}입니다.`,
        meta: { family: "ring-eight-range", cards, target: pick.target, values: solution, given: shownGiven, uniqueCount: matches.length }
      };
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 3단원 도전 — 원 둘레 네 칸 + 가운데 한 칸(지름 두 개): 지름 위 세 수의 합과 둘레 네 수의 합을 모두 같게
// (둘레 = 두 지름 끝의 수 넷이므로 가운데 수 = 한 지름 양 끝의 합, 다섯 수의 합 = 가운데 수의 3배)
// ─────────────────────────────────────────────────────────────
function circleBoard(values = null) {
  const cx = 110;
  const cy = 100;
  const r = 70;
  const nodes = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy]];
  const node = ([x, y], index) => `<circle cx="${x}" cy="${y}" r="18" fill="${index === 4 ? "#e6f3ee" : "#fff"}" stroke="${INK}" stroke-width="1.6"/>${values ? svgText(x, y + 1, values[index], { size: 15, fill: GREEN }) : ""}`;
  return `${svgOpen(220, 200, "원 둘레 네 칸과 가운데 한 칸", 220)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LINE}" stroke-width="1.6"/><line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="${LINE}" stroke-width="1.6"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${LINE}" stroke-width="1.6"/>${nodes.map(node).join("")}</svg>`;
}

function circleDiametersFive({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const center = difficulty === 1 ? randomInt(5, 9) : randomInt(7, difficulty === 3 ? 19 : 13);
    const pairs = [];
    for (let a = 1; a < center - a; a += 1) pairs.push([a, center - a]);
    if (pairs.length < 2) continue;
    const [p, q] = shuffle(pairs).slice(0, 2);
    const cards = [...p, ...q, center].sort((a, b) => a - b);
    if (new Set(cards).size !== 5) continue;
    // 다른 배치가 없는지 확인: 가운데 수와 두 쌍이 하나로 정해지는가(쌍의 순서·자리 바꿈은 같은 답으로 본다)
    const ways = [];
    eachPermutation(cards, (values) => {
      const [n, e, s, w, mid] = values;
      const line1 = n + mid + s;
      const line2 = e + mid + w;
      if (line1 === line2 && line1 === n + e + s + w) ways.push(mid);
    });
    if (new Set(ways).size !== 1) continue;
    const sum = 2 * center;
    const values = [p[0], q[0], p[1], q[1], center];
    return {
      prompt: "다섯 수를 원 안에 한 번씩 넣어, 두 직선 위에 놓인 세 수의 합과 둘레에 놓인 네 수의 합이 모두 같아지게 하세요. 그때의 합을 구하세요.",
      visual: fig(column(cardRow(cards), circleBoard())),
      answerVisual: fig(circleBoard(values)),
      answer: `합: ${sum}`,
      responseKind: "drawing",
      solution: `둘레의 네 수는 두 직선의 양 끝 수와 같습니다. 그래서 (한 직선의 양 끝 두 수) + 가운데 수 = 네 끝 수의 합이 되려면, 가운데 수가 한 직선 양 끝 두 수의 합과 같아야 합니다. 다섯 수의 합 ${iga(cards.reduce((a, b) => a + b, 0))} 가운데 수의 3배이므로 가운데는 ${center}, 양 끝은 ${wa(p[0])} ${p[1]}, ${wa(q[0])} ${q[1]}이고 합은 ${sum}입니다.`,
      meta: { family: "circle-diameters-five", cards, center, pairs: [p, q], sum }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 3단원 — 모양이 여러 가지인 가쿠로(모서리가 빠진 3×3·3×4·4×3). 수 카드형과 「서로 다른 수」형.
// ─────────────────────────────────────────────────────────────
const GAKURO_MASKS = [
  { rows: 3, columns: 3, map: ".XX/XXX/XX." },
  { rows: 3, columns: 3, map: "XXX/XXX/XX." },
  { rows: 3, columns: 3, map: "XXX/XXX/.XX" },
  { rows: 3, columns: 3, map: ".XX/XXX/XXX" },
  { rows: 3, columns: 3, map: "XX./XXX/XXX" },
  { rows: 3, columns: 4, map: "XXX./XXXX/.XXX", big: true },
  { rows: 3, columns: 4, map: ".XXX/XXXX/XXX.", big: true },
  { rows: 3, columns: 4, map: "XX../XXXX/..XX", big: true },
  { rows: 3, columns: 4, map: "XXXX/XXX./XX..", big: true },
  { rows: 4, columns: 3, map: "XX./XXX/XXX/.XX", big: true },
  { rows: 4, columns: 3, map: ".XX/XXX/XX./X..", big: true }
].map((item) => ({ ...item, mask: item.map.replaceAll("/", "").split("").map((ch) => (ch === "X" ? 1 : 0)) }))
  // 한 칸짜리 줄이 있으면 그 줄의 합이 곧 답이 되어 버리므로 뺀다(가로·세로 모든 줄이 두 칸 이상)
  .filter(({ rows, columns, mask }) => Array.from({ length: rows }, (_, r) => mask.slice(r * columns, (r + 1) * columns).filter(Boolean).length).every((n) => n === 0 || n >= 2)
    && Array.from({ length: columns }, (_, c) => Array.from({ length: rows }, (_, r) => mask[r * columns + c]).filter(Boolean).length).every((n) => n === 0 || n >= 2));

function gakuroMasked(difficulty, freeMode) {
  const { maskedGridSums, countGakuroSolutions } = BOOK01_INTERNALS;
  const masks = GAKURO_MASKS.filter((item) => (difficulty === 1 ? !item.big : difficulty === 3 ? item.big : true));
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const layout = sample(masks);
    const active = layout.mask.map((value, index) => (value ? index : -1)).filter((index) => index >= 0);
    if (freeMode && active.length > 9) continue;
    const poolSize = freeMode ? 9 : Math.min(9, active.length + randomInt(0, 2));
    const numberPool = freeMode ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, poolSize);
    const chosen = shuffle(numberPool).slice(0, active.length);
    if (chosen.length < active.length) continue;
    const values = Array(layout.rows * layout.columns).fill(null);
    active.forEach((index, order) => { values[index] = chosen[order]; });
    const { rowSums, columnSums } = maskedGridSums(values, layout.rows, layout.columns, layout.mask);
    const order = shuffle(active);
    const fixed = order.slice(0, difficulty === 1 ? 2 : 1);
    let shown;
    let cards;
    let count = 0;
    for (;;) {
      shown = values.map((value, index) => (layout.mask[index] && fixed.includes(index) ? value : null));
      const hidden = active.filter((index) => !fixed.includes(index));
      cards = freeMode ? [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => !fixed.some((index) => values[index] === value)) : hidden.map((index) => values[index]).sort((a, b) => a - b);
      count = countGakuroSolutions({ rows: layout.rows, columns: layout.columns, mask: layout.mask, shown, cards, rowSums, columnSums });
      if (count === 1 || fixed.length >= active.length - 3) break;
      fixed.push(order[fixed.length]);
    }
    if (count !== 1) continue;
    const hiddenCount = active.length - fixed.length;
    if (hiddenCount < 4) continue;
    const base = { kind: "book1", subtype: "sum-grid", rows: layout.rows, columns: layout.columns, mask: layout.mask, rowSums, columnSums };
    return {
      prompt: freeMode
        ? "1부터 9까지의 수 중에서 서로 다른 수를 빈칸에 넣어 가로줄, 세로줄에 있는 수의 합이 표의 오른쪽, 아래에 쓰인 수가 되도록 만드세요."
        : "주어진 숫자 카드를 빈칸에 한 번씩만 넣어 가로줄, 세로줄에 있는 수의 합이 표의 오른쪽, 아래에 쓰인 수가 되도록 만드세요.",
      visual: { ...base, cards: freeMode ? [] : cards, rangeLabel: freeMode ? "1~9 중 서로 다른 수" : "", shown },
      answerVisual: { ...base, cards: [], rangeLabel: "", shown: values },
      answer: "그림과 같이 채웁니다.",
      responseKind: "drawing",
      solution: "칸이 적은 줄이나 합이 아주 크거나 작은 줄부터 들어갈 수 있는 수를 좁힙니다. 가로 합과 세로 합을 함께 맞춰 보면 배치가 하나로 정해집니다.",
      meta: { family: "gakuro-layout", layoutId: layout.map, values, mask: layout.mask, hidden: active.filter((index) => !fixed.includes(index)), cards, rowSums, columnSums, uniqueCount: count }
    };
  }
  return null;
}

function gakuroMaskedCards({ difficulty = 2 }) { return gakuroMasked(difficulty, false); }
function gakuroMaskedFree({ difficulty = 2 }) { return gakuroMasked(difficulty, true); }

// ─────────────────────────────────────────────────────────────
// 1단원 — 2×2 모눈에 선으로 그린 모양(한글 자음·선 모양)을 뒤집거나 돌린 모양 그리기
// 점: 모눈 꼭짓점 (0~2, 0~2). 모양 = 한 칸짜리 선분들의 모음.
// ─────────────────────────────────────────────────────────────
const LETTER_POLYLINES = {
  "ㄱ": [[[0, 0], [2, 0], [2, 2]]],
  "ㄴ": [[[0, 0], [0, 2], [2, 2]]],
  "ㄷ": [[[2, 0], [0, 0], [0, 2], [2, 2]]],
  "ㄹ": [[[0, 0], [2, 0], [2, 1], [0, 1], [0, 2], [2, 2]]],
  "ㅁ": [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]],
  "ㅂ": [[[0, 0], [0, 2], [2, 2], [2, 0]], [[0, 1], [2, 1]]],
  "ㅋ": [[[0, 0], [2, 0], [2, 2]], [[0, 1], [2, 1]]],
  "ㅌ": [[[2, 0], [0, 0], [0, 2], [2, 2]], [[0, 1], [2, 1]]]
};

function unitEdges(polylines) {
  const edges = new Set();
  for (const line of polylines) {
    for (let index = 1; index < line.length; index += 1) {
      const [x1, y1] = line[index - 1];
      const [x2, y2] = line[index];
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      for (let s = 0; s < steps; s += 1) {
        const a = [x1 + Math.sign(x2 - x1) * s, y1 + Math.sign(y2 - y1) * s];
        const b = [x1 + Math.sign(x2 - x1) * (s + 1), y1 + Math.sign(y2 - y1) * (s + 1)];
        edges.add(edgeKey(a, b));
      }
    }
  }
  return edges;
}
function edgeKey(a, b) {
  const [p, q] = [a, b].sort((u, v) => u[0] - v[0] || u[1] - v[1]);
  return `${p[0]},${p[1]}-${q[0]},${q[1]}`;
}
const parseEdge = (key) => key.split("-").map((point) => point.split(",").map(Number));
const sameEdges = (a, b) => a.size === b.size && [...a].every((key) => b.has(key));

// 모눈 크기 n(꼭짓점 0~n)에서 점 옮기기. 화면 좌표(y가 아래로)
const MOVES = {
  flipRight: (n) => ([x, y]) => [n - x, y],
  flipLeft: (n) => ([x, y]) => [n - x, y],
  flipUp: (n) => ([x, y]) => [x, n - y],
  flipDown: (n) => ([x, y]) => [x, n - y],
  turnCw: (n) => ([x, y]) => [n - y, x],
  turnCcw: (n) => ([x, y]) => [y, n - x],
  turnHalf: (n) => ([x, y]) => [n - x, n - y],
  turnFull: () => ([x, y]) => [x, y]
};
function moveEdges(edges, move, n) {
  const f = MOVES[move](n);
  return new Set([...edges].map((key) => { const [a, b] = parseEdge(key); return edgeKey(f(a), f(b)); }));
}

function gridFigure(x, y, cell, n, edges, { color = "#d8342c", dotted = true, frame = INK, center = null } = {}) {
  const size = cell * n;
  const inner = Array.from({ length: n - 1 }, (_, index) => {
    const p = (index + 1) * cell;
    return `<line x1="${x + p}" y1="${y}" x2="${x + p}" y2="${y + size}" stroke="#2f88a6" stroke-width="1" stroke-dasharray="2 3"/><line x1="${x}" y1="${y + p}" x2="${x + size}" y2="${y + p}" stroke="#2f88a6" stroke-width="1" stroke-dasharray="2 3"/>`;
  }).join("");
  const border = `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${dotted ? "#2f88a6" : frame}" stroke-width="${dotted ? 1.3 : 1.6}"${dotted ? ' stroke-dasharray="2 3"' : ""}/>`;
  const lines = edges ? [...edges].map((key) => { const [[x1, y1], [x2, y2]] = parseEdge(key); return `<line x1="${x + x1 * cell}" y1="${y + y1 * cell}" x2="${x + x2 * cell}" y2="${y + y2 * cell}" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`; }).join("") : "";
  const dot = center ? `<circle cx="${x + center[0] * cell}" cy="${y + center[1] * cell}" r="4" fill="${INK}"/>` : "";
  return border + inner + lines + dot;
}

// 가운데 원래 모양, 위·왼쪽·오른쪽·아래에 빈 모눈(답은 채움)
function crossLayout(edges, labels, answers = null) {
  const cell = 30;
  const size = cell * 2;
  const slots = { top: [130, 22], left: [28, 132], center: [130, 132], right: [232, 132], bottom: [130, 242] };
  const caption = (key, [x, y]) => {
    const lines = labels[key].split("\n");
    const baseY = key === "top" ? y - 10 - (lines.length - 1) * 13 : y + size + 14;
    return lines.map((line, index) => svgText(x + size / 2, baseY + index * 13, line, { size: 11, weight: 700, fill: "#6d6250" })).join("");
  };
  const body = Object.entries(slots).map(([key, [x, y]]) => {
    if (key === "center") return gridFigure(x, y, cell, 2, edges);
    return gridFigure(x, y, cell, 2, answers ? answers[key] : null, { color: GREEN }) + caption(key, [x, y]);
  }).join("");
  return `${svgOpen(320, 340, "원래 모양과 움직인 모양을 그리는 모눈", 320)}${body}</svg>`;
}

function pickLineFigure(moves, n = 2) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const useLetter = Math.random() < 0.6;
    let name = null;
    let edges;
    if (useLetter) {
      name = sample(Object.keys(LETTER_POLYLINES).filter((key) => key !== "ㅁ"));
      edges = unitEdges(LETTER_POLYLINES[name]);
    } else {
      // 이어진 선 3~5칸(꺾인 선)
      const length = randomInt(3, 5);
      let point = [randomInt(0, n), randomInt(0, n)];
      edges = new Set();
      for (let step = 0; step < length * 4 && edges.size < length; step += 1) {
        const [dx, dy] = sample([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        const next = [point[0] + dx, point[1] + dy];
        if (next[0] < 0 || next[0] > n || next[1] < 0 || next[1] > n) continue;
        edges.add(edgeKey(point, next));
        point = next;
      }
      if (edges.size < 3) continue;
    }
    const moved = moves.map((move) => moveEdges(edges, move, n));
    // 움직인 모양이 원래 모양과 같아 버리면(대칭) 그릴 것이 없다 — 반 바퀴처럼 일부러 같아지는 경우는 문제마다 따로 정한다.
    if (moved.some((item, index) => moves[index] !== "turnFull" && sameEdges(item, edges))) continue;
    return { name, edges, moved };
  }
  return null;
}

function lineLetterFlipFour({ difficulty = 2 }) {
  const moves = ["flipUp", "flipLeft", "flipRight", "flipDown"];
  const figure = pickLineFigure(moves);
  if (!figure) return null;
  const title = figure.name ? `한글 자음 ‘${figure.name}’` : "모눈에 그린 선 모양";
  const labels = { top: "(위로 뒤집기)", left: "(왼쪽으로 뒤집기)", right: "(오른쪽으로 뒤집기)", bottom: "(아래로 뒤집기)" };
  const answers = { top: figure.moved[0], left: figure.moved[1], right: figure.moved[2], bottom: figure.moved[3] };
  return {
    prompt: `${eul(title)} 위, 왼쪽, 오른쪽, 아래로 각각 뒤집은 모양을 빈 모눈에 그리세요.`,
    visual: fig(crossLayout(figure.edges, labels)),
    answerVisual: fig(crossLayout(figure.edges, labels, answers)),
    answer: "그림과 같이 그립니다. 왼쪽·오른쪽으로 뒤집은 모양이 같고, 위·아래로 뒤집은 모양이 같습니다.",
    responseKind: "drawing",
    solution: "거울을 댄 쪽으로 모양을 그대로 넘깁니다. 왼쪽·오른쪽으로 뒤집으면 왼쪽과 오른쪽이 바뀌고(위아래는 그대로), 위·아래로 뒤집으면 위와 아래가 바뀝니다. 그래서 왼쪽과 오른쪽으로 뒤집은 모양이 같고, 위와 아래로 뒤집은 모양이 같습니다.",
    meta: { family: "line-letter-flip", name: figure.name, edges: [...figure.edges], moved: figure.moved.map((item) => [...item]) }
  };
}

function lineLetterTurnFour({ difficulty = 2 }) {
  const moves = ["turnFull", "turnCcw", "turnCw", "turnHalf"];
  const figure = pickLineFigure(moves);
  if (!figure) return null;
  const title = figure.name ? `한글 자음 ‘${figure.name}’` : "모눈에 그린 선 모양";
  const labels = { top: "(한 바퀴 돌리기)", left: "(반의 반 바퀴 돌리기)\n(시계 반대 방향)", right: "(반의 반 바퀴 돌리기)\n(시계 방향)", bottom: "(반 바퀴 돌리기)" };
  const answers = { top: figure.moved[0], left: figure.moved[1], right: figure.moved[2], bottom: figure.moved[3] };
  return {
    prompt: `${eul(title)} 여러 가지 방향으로 돌린 모양을 빈 모눈에 그리세요.`,
    visual: fig(crossLayout(figure.edges, labels)),
    answerVisual: fig(crossLayout(figure.edges, labels, answers)),
    answer: "그림과 같이 그립니다. 한 바퀴 돌린 모양은 처음 모양과 같습니다.",
    responseKind: "drawing",
    solution: "위쪽 변이 어디로 가는지 따라갑니다. 시계 방향 반의 반 바퀴면 위쪽이 오른쪽으로, 시계 반대 방향이면 위쪽이 왼쪽으로, 반 바퀴면 위쪽이 아래로 갑니다. 한 바퀴 돌리면 처음 모양 그대로입니다.",
    meta: { family: "line-letter-turn", name: figure.name, edges: [...figure.edges], moved: figure.moved.map((item) => [...item]) }
  };
}

// 두 번 뒤집기(서로 다른 방향) = 반 바퀴 돌리기 — 두 단계를 그려 보고 견주기
function flowLayout(rows) {
  const cell = 26;
  const size = cell * 2;
  const rowHeight = size + 46;
  const body = rows.map((row, r) => {
    const y = 16 + r * rowHeight;
    return row.map((item, index) => {
      const x = 8 + index * (size + 96);
      const grid = gridFigure(x, y, cell, 2, item.edges, { color: index === 0 ? "#d8342c" : GREEN });
      const arrow = index < row.length - 1 ? `<path d="M${x + size + 14} ${y + size / 2}h52" stroke="#2f88a6" stroke-width="3"/><path d="M${x + size + 66} ${y + size / 2 - 6}l10 6-10 6z" fill="#2f88a6"/>${svgText(x + size + 48, y + size / 2 + 20, row[index + 1].move, { size: 10, weight: 700, fill: "#6d6250" })}` : "";
      return grid + arrow;
    }).join("");
  }).join("");
  const width = 16 + 3 * size + 2 * 96;
  return `${svgOpen(width, rows.length * rowHeight + 8, "모양을 차례로 움직여 그리는 칸", Math.min(width, 380))}${body}</svg>`;
}

const FLIP_NAME = { flipRight: "오른쪽으로 뒤집기", flipLeft: "왼쪽으로 뒤집기", flipUp: "위로 뒤집기", flipDown: "아래로 뒤집기" };

const swapText = (move) => (move === "flipRight" || move === "flipLeft" ? `${FLIP_NAME[move].replace("뒤집기", "뒤집으면")} 왼쪽과 오른쪽이` : `${FLIP_NAME[move].replace("뒤집기", "뒤집으면")} 위와 아래가`);

function lineLetterTwoFlipsHalfTurn({ difficulty = 2 }) {
  const pairs = [["flipRight", "flipDown"], ["flipDown", "flipRight"], ["flipLeft", "flipUp"], ["flipUp", "flipLeft"]];
  const [first, second] = sample(pairs);
  const figure = pickLineFigure([first, "turnHalf"]);
  if (!figure) return null;
  const step1 = moveEdges(figure.edges, first, 2);
  const step2 = moveEdges(step1, second, 2);
  const half = moveEdges(figure.edges, "turnHalf", 2);
  if (!sameEdges(step2, half)) return null;
  const title = figure.name ? `‘${figure.name}’` : "선 모양";
  const blank = (rows) => rows.map((row) => row.map((item, index) => (index === 0 ? item : { ...item, edges: null })));
  const rows = [
    [{ edges: figure.edges }, { edges: step1, move: `(${FLIP_NAME[first]})` }, { edges: step2, move: `(${FLIP_NAME[second]})` }],
    [{ edges: figure.edges }, { edges: half, move: "(반 바퀴 돌리기)" }]
  ];
  return {
    prompt: `(1) ${eul(title)} ${FLIP_NAME[first].replace("뒤집기", "뒤집은")} 뒤 다시 ${FLIP_NAME[second].replace("뒤집기", "뒤집은")} 모양을 그리세요. (2) ${eul(title)} 반 바퀴 돌린 모양을 그리세요. (3) 두 번 뒤집은 모양은 처음 모양을 어떻게 돌린 것과 같나요?`,
    visual: fig(flowLayout(blank(rows))),
    answerVisual: fig(flowLayout(rows)),
    answer: "(3) 반 바퀴 돌린 것과 같습니다.",
    responseKind: "drawing",
    solution: `${swapText(first)} 바뀌고, 다시 ${swapText(second)} 바뀝니다. 위아래와 왼쪽·오른쪽이 모두 바뀌었으므로 반 바퀴 돌린 모양과 같습니다.`,
    meta: { family: "line-letter-two-flips", first, second, edges: [...figure.edges], result: [...step2] }
  };
}

// ─────────────────────────────────────────────────────────────
// 1단원 — 4×4 모눈의 꺾은선을 가운데 점을 중심으로 돌려 그리기(반 바퀴 / 반의 반 바퀴씩 세 번 = 바람개비)
// ─────────────────────────────────────────────────────────────
function randomCenterPolyline(segments) {
  const n = 4;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let point = [2, 2];
    const points = [point];
    let ok = true;
    for (let index = 0; index < segments; index += 1) {
      const [dx, dy] = sample([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
      const length = randomInt(1, 2);
      const next = [point[0] + dx * length, point[1] + dy * length];
      if (next.some((value) => value < 0 || value > n)) { ok = false; break; }
      if (points.some((p) => p[0] === next[0] && p[1] === next[1])) { ok = false; break; }
      points.push(next);
      point = next;
    }
    if (!ok) continue;
    // 한 줄로 곧게 이어지는 꺾은선은 뺀다(꺾이는 곳이 있어야 그릴 맛이 난다)
    const v1 = [points[1][0] - points[0][0], points[1][1] - points[0][1]];
    const v2 = [points[2][0] - points[1][0], points[2][1] - points[1][1]];
    if (v1[0] * v2[1] - v1[1] * v2[0] === 0) continue;
    return points;
  }
  return null;
}

function polylineSvg(x, y, cell, points, color, width = 3.2) {
  return `<polyline points="${points.map(([px, py]) => `${x + px * cell},${y + py * cell}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function centerBoard(x, y, cell, shapes) {
  const n = 4;
  const size = n * cell;
  const inner = Array.from({ length: n - 1 }, (_, index) => {
    const p = (index + 1) * cell;
    return `<line x1="${x + p}" y1="${y}" x2="${x + p}" y2="${y + size}" stroke="#2f88a6" stroke-width="1" stroke-dasharray="2 3"/><line x1="${x}" y1="${y + p}" x2="${x + size}" y2="${y + p}" stroke="#2f88a6" stroke-width="1" stroke-dasharray="2 3"/>`;
  }).join("");
  const lines = shapes.map(({ points, color }) => polylineSvg(x, y, cell, points, color)).join("");
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="#1f6f8b" stroke-width="1.6"/>${inner}${lines}<circle cx="${x + 2 * cell}" cy="${y + 2 * cell}" r="4.5" fill="${INK}"/>`;
}

const turnPoint = (times) => ([x, y]) => {
  let p = [x, y];
  for (let index = 0; index < times; index += 1) p = [4 - p[1], p[0]];
  return p;
};

function centerHalfTurnLines({ difficulty = 2 }) {
  const count = difficulty === 1 ? 1 : 2;
  const figures = [];
  for (let index = 0; index < count; index += 1) {
    const points = randomCenterPolyline(difficulty === 3 ? sample([2, 3]) : 2);
    if (!points) return null;
    figures.push(points);
  }
  const cell = 26;
  const board = (answer) => {
    const body = figures.map((points, index) => {
      const x = 8 + index * (4 * cell + 30);
      const shapes = [{ points, color: "#d8342c" }];
      if (answer) shapes.push({ points: points.map(turnPoint(2)), color: GREEN });
      return (count > 1 ? svgText(x + 6, 10, `(${index + 1})`, { size: 12, anchor: "start" }) : "") + centerBoard(x, 20, cell, shapes);
    }).join("");
    const width = 16 + count * 4 * cell + (count - 1) * 30;
    return `${svgOpen(width, 4 * cell + 28, "가운데 점이 있는 4×4 모눈", Math.min(width, 290))}${body}</svg>`;
  };
  return {
    prompt: `모눈의 선을 가운데 점을 중심으로 시계 방향으로 반 바퀴 돌린 모양을 그리세요.`,
    visual: fig(board(false)),
    answerVisual: fig(board(true)),
    answer: "그림과 같이 그립니다.",
    responseKind: "drawing",
    solution: "반 바퀴 돌리면 가운데 점에서 오른쪽으로 간 만큼 왼쪽으로, 위로 간 만큼 아래로 갑니다. 꺾이는 점마다 가운데 점의 반대쪽 같은 거리에 점을 찍고 차례로 이으면 됩니다.",
    meta: { family: "center-half-turn", figures }
  };
}

function centerPinwheelLines({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const points = randomCenterPolyline(difficulty === 3 ? 3 : 2);
    if (!points) continue;
    const copies = [1, 2, 3].map((times) => points.map(turnPoint(times)));
    const keyOf = (list) => list.map(([x, y]) => `${x},${y}`).join("|");
    const keys = new Set([points, ...copies].map(keyOf));
    if (keys.size !== 4) continue;
    // 서로 겹치는 선분이 없게(겹치면 세 번 돌린 모양이 덜 보인다)
    const segs = new Set();
    let overlap = false;
    for (const list of [points, ...copies]) {
      for (let index = 1; index < list.length; index += 1) {
        const key = edgeKey(list[index - 1], list[index]);
        if (segs.has(key)) overlap = true;
        segs.add(key);
      }
    }
    if (overlap) continue;
    const cell = 30;
    const board = (answer) => `${svgOpen(4 * cell + 16, 4 * cell + 16, "가운데 점이 있는 4×4 모눈", 136)}${centerBoard(8, 8, cell, [{ points, color: "#d8342c" }, ...(answer ? copies.map((list) => ({ points: list, color: GREEN })) : [])])}</svg>`;
    return {
      prompt: "모눈의 선을 가운데 점을 중심으로 시계 방향으로 반의 반 바퀴씩 3번 돌린 모양을 모두 그려 바람개비 모양을 완성하세요.",
      visual: fig(board(false)),
      answerVisual: fig(board(true)),
      answer: "그림과 같이 그립니다.",
      responseKind: "drawing",
      solution: "반의 반 바퀴씩 돌릴 때마다 위로 뻗은 선은 오른쪽으로, 오른쪽으로 뻗은 선은 아래로 갑니다. 한 번 돌린 모양을 그리고, 그 모양을 다시 같은 방법으로 돌리기를 두 번 더 하면 바람개비가 됩니다.",
      meta: { family: "center-pinwheel", points, copies }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 1단원 — 시계의 짧은 바늘(시침)만 돌리기: 긴 바늘(분침)은 12에 둔 채 시침을 돌린 뒤의 시각
// ─────────────────────────────────────────────────────────────
function clockFace(cx, cy, r, hour, { showHour = true, color = "#e07a1f" } = {}) {
  const numbers = Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    const angle = (value / 12) * Math.PI * 2 - Math.PI / 2;
    return svgText(cx + Math.cos(angle) * (r - 11), cy + Math.sin(angle) * (r - 11), value, { size: 9, weight: 700 });
  }).join("");
  const handAngle = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const hourHand = showHour ? `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(handAngle) * r * 0.5}" y2="${cy + Math.sin(handAngle) * r * 0.5}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>` : "";
  const minuteHand = `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.78}" stroke="#2f88a6" stroke-width="2.4" stroke-linecap="round"/>`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="1.8"/>${numbers}${minuteHand}${hourHand}<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
}

const CLOCK_TURNS = [
  { key: "full", label: "(한 바퀴 돌리기)", short: "한 바퀴", add: 0 },
  { key: "ccw", label: "(반의 반 바퀴 돌리기)\n(시계 반대 방향)", short: "시계 반대 방향 반의 반 바퀴", add: -3 },
  { key: "cw", label: "(반의 반 바퀴 돌리기)\n(시계 방향)", short: "시계 방향 반의 반 바퀴", add: 3 },
  { key: "half", label: "(반 바퀴 돌리기)", short: "반 바퀴", add: 6 }
];
const hourOf = (value) => ((((value - 1) % 12) + 12) % 12) + 1;

function clockHourHandTurn({ difficulty = 2 }) {
  const start = difficulty === 1 ? sample([12, 3, 6, 9]) : randomInt(1, 12);
  const r = 40;
  const slots = { top: [160, 70], left: [56, 178], center: [160, 178], right: [264, 178], bottom: [160, 286] };
  const order = { top: 0, left: 1, right: 2, bottom: 3 };
  const draw = (answer) => {
    const body = Object.entries(slots).map(([key, [cx, cy]]) => {
      if (key === "center") return `${clockFace(cx, cy, r, start)}<rect x="${cx - r - 4}" y="${cy - r - 4}" width="${2 * r + 8}" height="${2 * r + 8}" fill="none" stroke="${INK}" stroke-width="2"/>${svgText(cx, cy + r + 16, `${start}시`, { size: 12 })}`;
      const turn = CLOCK_TURNS[order[key]];
      const hour = hourOf(start + turn.add);
      const lines = turn.label.split("\n");
      const labelY = key === "top" ? cy - r - 12 - (lines.length - 1) * 12 : cy + r + 14;
      return clockFace(cx, cy, r, hour, { showHour: answer, color: GREEN }) + lines.map((line, index) => svgText(cx, labelY + index * 12, line, { size: 10, weight: 700, fill: "#6d6250" })).join("") + (answer ? svgText(cx, cy + r + 14 + lines.length * 12, `${hour}시`, { size: 11, fill: GREEN }) : "");
    }).join("");
    return `${svgOpen(330, 366, "짧은 바늘을 돌린 시계 네 개", 330)}${body}</svg>`;
  };
  const results = CLOCK_TURNS.map((turn) => ({ label: turn.short, hour: hourOf(start + turn.add) }));
  return {
    prompt: `시계의 시각은 ${start}시 정각입니다. 긴 바늘(분침)은 그대로 두고 짧은 바늘(시침)만 주어진 대로 돌린 모양을 그리고, 각 시계의 시각을 쓰세요.`,
    visual: fig(draw(false)),
    answerVisual: fig(draw(true)),
    answer: results.map((item) => `${item.label} ${item.hour}시`).join(", "),
    responseKind: "drawing",
    solution: `짧은 바늘이 한 바퀴 돌면 12칸, 반 바퀴는 6칸, 반의 반 바퀴는 3칸 움직입니다. ${start}시에서 시계 방향으로 3칸이면 ${hourOf(start + 3)}시, 시계 반대 방향으로 3칸이면 ${hourOf(start - 3)}시, 반 바퀴면 ${hourOf(start + 6)}시, 한 바퀴면 그대로 ${start}시입니다.`,
    meta: { family: "clock-hour-turn", start, results }
  };
}

// ─────────────────────────────────────────────────────────────
// 1단원 — 디지털 숫자 0~9를 모두 뒤집거나 돌려 보고 「자기 자신이 되는 숫자」「서로 바뀌는 숫자」를 찾아 합 구하기
// ─────────────────────────────────────────────────────────────
const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
const SEG_PATH = {
  a: [[6, 4], [24, 4]], b: [[26, 6], [26, 24]], c: [[26, 30], [26, 48]], d: [[6, 50], [24, 50]],
  e: [[4, 30], [4, 48]], f: [[4, 6], [4, 24]], g: [[6, 27], [24, 27]]
};
function segmentDigit(x, y, segments, color = INK) {
  return Object.entries(SEG_PATH).map(([name, [[x1, y1], [x2, y2]]]) => `<line x1="${x + x1}" y1="${y + y1}" x2="${x + x2}" y2="${y + y2}" stroke="${segments.includes(name) ? color : "#e7e0d2"}" stroke-width="${segments.includes(name) ? 4.2 : 2}" stroke-linecap="round"/>`).join("");
}
const SEG_MAP = {
  "mirror-left-right": { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" },
  "mirror-top-bottom": { a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" },
  "rotate-half": { a: "d", b: "e", c: "f", d: "a", e: "b", f: "c", g: "g" }
};
const moveSegments = (segments, operation) => [...segments].map((s) => SEG_MAP[operation][s]).sort().join("");
const OPERATION_TEXT = { "mirror-left-right": "오른쪽으로 뒤집었을", "mirror-top-bottom": "아래로 뒤집었을", "rotate-half": "반 바퀴 돌렸을" };
const OPERATION_SHAPE = { "mirror-left-right": "오른쪽으로 뒤집은", "mirror-top-bottom": "아래로 뒤집은", "rotate-half": "반 바퀴 돌린" };
const OPERATION_HEAD = { "mirror-left-right": "오른쪽으로 뒤집기", "mirror-top-bottom": "아래로 뒤집기", "rotate-half": "반 바퀴 돌리기" };

function digitTable(operation, answer) {
  const width = 10 * 46 + 6;
  const body = Array.from({ length: 10 }, (_, digit) => {
    const x = 6 + digit * 46;
    const moved = moveSegments(SEG[digit], operation);
    return `${segmentDigit(x + 6, 6, SEG[digit])}<rect x="${x}" y="66" width="40" height="64" fill="#fff" stroke="#2f88a6" stroke-width="1.2" stroke-dasharray="2 3"/>${answer ? segmentDigit(x + 6, 72, moved, GREEN) : ""}`;
  }).join("");
  return `${svgOpen(width, 150, `디지털 숫자 0부터 9까지와 ${OPERATION_HEAD[operation]} 한 모양을 그리는 칸`, 466)}${body}${svgText(width / 2, 142, `위: 숫자 · 아래: ${OPERATION_HEAD[operation]}`, { size: 10, weight: 700, fill: "#6d6250" })}</svg>`;
}

function digitalSelfPairSum({ difficulty = 2 }) {
  const { transformDigit } = BOOK01_INTERNALS;
  const operation = sample(["mirror-left-right", "mirror-top-bottom", "rotate-half"]);
  const self = [];
  const pairs = [];
  for (let digit = 0; digit <= 9; digit += 1) {
    const moved = transformDigit(digit, operation);
    if (moved == null) continue;
    if (moved === digit) self.push(digit);
    else if (digit < moved) pairs.push([digit, moved]);
  }
  const pairDigits = pairs.flat().sort((a, b) => a - b);
  const sum = (list) => list.reduce((total, value) => total + value, 0);
  const mode = difficulty === 1 ? "both" : sample(["both", "all"]);
  const when = OPERATION_TEXT[operation];
  const prompt = mode === "both"
    ? `디지털 숫자 0부터 9까지를 ${OPERATION_SHAPE[operation]} 모양을 그려 보세요. (1) ${when} 때 자기 자신이 되는 숫자를 모두 더한 값과 (2) 서로 상대방이 되는 숫자를 모두 더한 값을 구하세요.`
    : `디지털 숫자 0부터 9까지를 ${OPERATION_SHAPE[operation]} 모양을 그려 보고, ${when} 때 숫자가 되는 모양을 모두 찾아 더한 값을 구하세요.`;
  const answer = mode === "both" ? `(1) ${sum(self)} (2) ${sum(pairDigits)}` : String(sum([...self, ...pairDigits]));
  return {
    prompt,
    visual: fig(digitTable(operation, false)),
    answerVisual: fig(digitTable(operation, true)),
    answer,
    solution: `${when} 때 자기 자신이 되는 숫자는 ${self.join(", ") || "없음"}이고, 서로 바뀌는 숫자는 ${pairs.map(([a, b]) => `${wa(a)} ${b}`).join(", ") || "없음"}입니다. ${mode === "both" ? `(1) ${self.join(" + ") || "0"} = ${sum(self)}, (2) ${pairDigits.join(" + ") || "0"} = ${sum(pairDigits)}` : `숫자가 되는 것을 모두 더하면 ${[...self, ...pairDigits].sort((a, b) => a - b).join(" + ")} = ${sum([...self, ...pairDigits])}`}입니다.`,
    meta: { family: "seg-digit-self-pair", operation, mode, self, pairs }
  };
}

// 디지털 숫자 하나를 두 번 뒤집기(오른쪽 → 아래) vs 반 바퀴 돌리기
function digitalTwoFlipsHalfTurn({ difficulty = 2 }) {
  const digit = difficulty === 1 ? sample([2, 4, 6, 7, 9]) : randomInt(2, 9);
  const order = sample([["mirror-left-right", "mirror-top-bottom"], ["mirror-top-bottom", "mirror-left-right"]]);
  const step1 = moveSegments(SEG[digit], order[0]);
  const step2 = moveSegments(step1, order[1]);
  const half = moveSegments(SEG[digit], "rotate-half");
  if (step2 !== half) return null;
  const name = { "mirror-left-right": "오른쪽으로 뒤집기", "mirror-top-bottom": "아래쪽으로 뒤집기" };
  const draw = (answer) => {
    const box = (x, y, segments, color, dotted) => `<rect x="${x}" y="${y}" width="44" height="66" fill="#fff" stroke="${dotted ? "#2f88a6" : INK}" stroke-width="1.3"${dotted ? ' stroke-dasharray="2 3"' : ""}/>${segments ? segmentDigit(x + 7, y + 6, segments, color) : ""}`;
    const arrow = (x, y, label) => `<path d="M${x} ${y}h44" stroke="#2f88a6" stroke-width="3"/><path d="M${x + 44} ${y - 6}l10 6-10 6z" fill="#2f88a6"/>${svgText(x + 26, y + 18, label, { size: 10, weight: 700, fill: "#6d6250" })}`;
    const row1 = box(8, 10, SEG[digit], INK, false) + arrow(62, 43, `(${name[order[0]]})`) + box(126, 10, answer ? step1 : null, GREEN, true) + arrow(180, 43, `(${name[order[1]]})`) + box(244, 10, answer ? step2 : null, GREEN, true);
    const row2 = box(8, 110, SEG[digit], INK, false) + arrow(62, 143, "(반 바퀴 돌리기)") + box(126, 110, answer ? half : null, GREEN, true);
    return `${svgOpen(300, 190, "디지털 숫자를 두 번 뒤집은 모양과 반 바퀴 돌린 모양을 그리는 칸", 300)}${row1}${row2}</svg>`;
  };
  return {
    prompt: `(1) 디지털 숫자 ${eul(digit)} ${name[order[0]].replace("뒤집기", "뒤집은")} 뒤 다시 ${name[order[1]].replace("뒤집기", "뒤집은")} 모양을 그리세요. (2) 디지털 숫자 ${eul(digit)} 반 바퀴 돌린 모양을 그리세요. (3) 두 모양을 비교해 보세요.`,
    visual: fig(draw(false)),
    answerVisual: fig(draw(true)),
    answer: "(3) 두 번 뒤집은 모양과 반 바퀴 돌린 모양이 같습니다.",
    responseKind: "drawing",
    solution: "오른쪽으로 뒤집으면 왼쪽과 오른쪽이, 아래쪽으로 뒤집으면 위와 아래가 바뀝니다. 두 번 뒤집으면 위아래와 왼쪽·오른쪽이 모두 바뀌므로 반 바퀴 돌린 모양과 같습니다.",
    meta: { family: "seg-digit-two-flips", digit, order, result: step2 }
  };
}

// 자음 여섯 개를 오른쪽으로 뒤집기·반 바퀴 돌리기 — 자기 자신이 되는 자음, 서로 바뀌는 자음
function consonantFlipTurnClassify({ difficulty = 2 }) {
  const pool = Object.keys(LETTER_POLYLINES);
  const edgesOf = Object.fromEntries(pool.map((name) => [name, unitEdges(LETTER_POLYLINES[name])]));
  const find = (edges) => pool.find((name) => sameEdges(edgesOf[name], edges)) || null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const chosen = shuffle(pool).slice(0, 6);
    const order = pool.filter((name) => chosen.includes(name));
    const flipSelf = order.filter((name) => find(moveEdges(edgesOf[name], "flipRight", 2)) === name);
    const halfSelf = order.filter((name) => find(moveEdges(edgesOf[name], "turnHalf", 2)) === name);
    const halfPairs = [];
    order.forEach((name) => {
      const other = find(moveEdges(edgesOf[name], "turnHalf", 2));
      if (other && other !== name && order.includes(other) && name < other) halfPairs.push([name, other]);
    });
    if (!flipSelf.length || !halfSelf.length || !halfPairs.length) continue;
    const table = (answer) => {
      const cell = 16;
      const rowH = 2 * cell + 12;
      const body = order.map((name, index) => {
        const y = 22 + index * rowH;
        const flip = moveEdges(edgesOf[name], "flipRight", 2);
        const half = moveEdges(edgesOf[name], "turnHalf", 2);
        return `${svgText(20, y + cell, name, { size: 15 })}${gridFigure(44, y, cell, 2, edgesOf[name])}${gridFigure(110, y, cell, 2, answer ? flip : null, { color: GREEN })}${gridFigure(190, y, cell, 2, answer ? half : null, { color: GREEN })}`;
      }).join("");
      const head = svgText(60, 10, "자음", { size: 10, fill: "#6d6250" }) + svgText(126, 10, "오른쪽 뒤집기", { size: 10, fill: "#6d6250" }) + svgText(206, 10, "반 바퀴 돌리기", { size: 10, fill: "#6d6250" });
      return `${svgOpen(250, 22 + order.length * rowH, "자음을 뒤집고 돌린 모양을 그리는 표", 250)}${head}${body}</svg>`;
    };
    return {
      prompt: `한글 자음 ${eul(order.map((name) => `‘${name}’`).join(", "))} 오른쪽으로 뒤집은 모양과 반 바퀴 돌린 모양을 그리고 물음에 답하세요. (1) 오른쪽으로 뒤집었을 때 자기 자신과 같아지는 자음 (2) 반 바퀴 돌렸을 때 자기 자신이 되는 자음 (3) 반 바퀴 돌렸을 때 서로 상대방이 되는 자음`,
      visual: fig(table(false)),
      answerVisual: fig(table(true)),
      answer: `(1) ${flipSelf.join(", ")} (2) ${halfSelf.join(", ")} (3) ${halfPairs.map(([a, b]) => `${wa(a)} ${b}`).join(", ")}`,
      responseKind: "drawing",
      solution: `오른쪽으로 뒤집으면 왼쪽과 오른쪽만 바뀌므로 좌우가 똑같은 ${flipSelf.join(", ")}만 그대로입니다. 반 바퀴 돌리면 위아래와 좌우가 함께 바뀌어 ${halfSelf.join(", ")}${eun(halfSelf.at(-1)).slice(-1)} 그대로이고, ${halfPairs.map(([a, b]) => `${wa(a)} ${b}`).join(", ")}${eun(halfPairs.at(-1)[1]).slice(-1)} 서로 바뀝니다.`,
      meta: { family: "consonant-classify", order, flipSelf, halfSelf, halfPairs }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 2단원 — 격자 색종이를 두 대각선으로 차례로 접고 칠한 부분을 잘라 펼친 모양을 처음 색종이에 그리기
// 색종이 4×4 칸을 칸마다 두 대각선으로 나눈 작은 삼각형(위·오른쪽·아래·왼쪽)으로 다룬다.
// 무게중심 좌표(칸 한 변 = 6)로 삼각형을 가리킨다: 위 (6c+3, 6r+1) · 오른쪽 (6c+5, 6r+3) · 아래 (6c+3, 6r+5) · 왼쪽 (6c+1, 6r+3)
// ─────────────────────────────────────────────────────────────
const FOLD_N = 4;
const PIECE_OFFSETS = { T: [3, 1], R: [5, 3], B: [3, 5], L: [1, 3] };
const FOLD_PIECES = [];
for (let r = 0; r < FOLD_N; r += 1) for (let c = 0; c < FOLD_N; c += 1) for (const [k, [dx, dy]] of Object.entries(PIECE_OFFSETS)) FOLD_PIECES.push({ r, c, k, x: 6 * c + dx, y: 6 * r + dy, key: `${6 * c + dx},${6 * r + dy}` });
const PIECE_BY_KEY = new Map(FOLD_PIECES.map((piece) => [piece.key, piece]));
const SIDE = 6 * FOLD_N;
const reflectD1 = ({ x, y }) => ({ x: y, y: x });
const reflectD2 = ({ x, y }) => ({ x: SIDE - y, y: SIDE - x });
const pieceAt = ({ x, y }) => PIECE_BY_KEY.get(`${x},${y}`);
// 두 대각선으로 접은 뒤 남는 왼쪽 네 모서리 삼각형(x < y, x + y < 한 변) — 접는 차례(내림 → 오름 / 오름 → 내림)와 상관없이 같다.
const LEFT_QUARTER = FOLD_PIECES.filter((piece) => piece.x < piece.y && piece.x + piece.y < SIDE);

function piecePolygon(piece, x0, y0, cell) {
  const left = x0 + piece.c * cell;
  const top = y0 + piece.r * cell;
  const cx = left + cell / 2;
  const cy = top + cell / 2;
  const corners = {
    T: [[left, top], [left + cell, top], [cx, cy]], R: [[left + cell, top], [left + cell, top + cell], [cx, cy]],
    B: [[left, top + cell], [left + cell, top + cell], [cx, cy]], L: [[left, top], [left, top + cell], [cx, cy]]
  }[piece.k];
  return `<polygon points="${corners.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ")}" fill="#b03a5b"/>`;
}

function gridLines(x0, y0, size, n, color = "#e29b94") {
  return Array.from({ length: n - 1 }, (_, index) => {
    const p = ((index + 1) * size) / n;
    return `<line x1="${(x0 + p).toFixed(1)}" y1="${y0}" x2="${(x0 + p).toFixed(1)}" y2="${y0 + size}" stroke="${color}" stroke-width="1"/><line x1="${x0}" y1="${(y0 + p).toFixed(1)}" x2="${x0 + size}" y2="${(y0 + p).toFixed(1)}" stroke="${color}" stroke-width="1"/>`;
  }).join("");
}

function unfoldPaper(pieces, label) {
  const size = 128;
  const cell = size / FOLD_N;
  const body = `<rect x="4" y="4" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>${pieces.map((piece) => piecePolygon(piece, 4, 4, cell)).join("")}${gridLines(4, 4, size, FOLD_N)}`;
  return `<svg viewBox="0 0 ${size + 8} ${size + 30}" style="width:${size + 8}px;max-width:100%;height:auto;display:block" role="img" aria-label="${esc(label)}">${body}${svgText(4 + size / 2, size + 20, "처음 색종이", { size: 12, weight: 800, fill: "#7a4a44" })}</svg>`;
}

let foldClipSeed = 0;
function foldDiagonalTwiceUnfoldDraw({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const target = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(3, 5) : randomInt(4, 7);
    // 왼쪽 네 모서리 삼각형 안에서 이어진 작은 삼각형 묶음을 고른다
    const start = sample(LEFT_QUARTER);
    const picked = [start];
    while (picked.length < target) {
      const near = LEFT_QUARTER.filter((piece) => !picked.includes(piece) && picked.some((other) => Math.hypot(other.x - piece.x, other.y - piece.y) <= 3));
      if (!near.length) break;
      picked.push(sample(near));
    }
    if (picked.length !== target || picked.length >= LEFT_QUARTER.length - 1) continue;
    const images = new Map();
    for (const piece of picked) {
      for (const point of [piece, reflectD1(piece), reflectD2(piece), reflectD1(reflectD2(piece))]) {
        const found = pieceAt(point);
        if (found) images.set(found.key, found);
      }
    }
    const result = [...images.values()];
    if (result.length < picked.length * 2) continue;
    const words = sample([["대각선-내림", "대각선-오름"], ["대각선-오름", "대각선-내림"]]);
    foldClipSeed += 1;
    const clipId = `b1dg${Date.now().toString(36)}${foldClipSeed}`;
    const strip = foldWordStrip(words, {
      label: "격자 색종이를 두 대각선으로 접고 색칠한 부분을 자르기",
      finalExtra: "자르기",
      final: (shift, top, size) => {
        const cell = size / FOLD_N;
        const quarter = `${shift},${top} ${shift},${top + size} ${shift + size / 2},${top + size / 2}`;
        return `<clipPath id="${clipId}"><polygon points="${quarter}"/></clipPath><g clip-path="url(#${clipId})">${gridLines(shift, top, size, FOLD_N)}</g>${picked.map((piece) => piecePolygon(piece, shift, top, cell)).join("")}`;
      }
    });
    return {
      prompt: "격자 무늬 색종이를 두 번 접은 뒤 칠해진 부분을 잘라 냈습니다. 남은 부분을 펼쳤을 때의 모양을 처음 색종이에 그리세요.",
      visual: fig(`${strip}${unfoldPaper([], "펼친 모양을 그리는 처음 색종이")}`),
      answerVisual: fig(unfoldPaper(result, "펼친 모양")),
      answer: "그림과 같이 그립니다.",
      responseKind: "drawing",
      solution: `마지막에 접은 선부터 거울처럼 펼칩니다. 두 번째 접은 대각선에 비춰 한 번, 다시 첫 번째 접은 대각선에 비춰 한 번 펼치면 잘린 부분이 네 군데(겹치면 그보다 적게) 대칭으로 나타납니다. 잘린 작은 삼각형은 모두 ${result.length}개입니다.`,
      meta: { family: "fold-diagonal-twice-draw", words, cut: picked.map((piece) => piece.key), result: result.map((piece) => piece.key) }
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 내보내기
// ─────────────────────────────────────────────────────────────
export const BOOK01_STRUCTURE_GENERATORS = {
  placeValueClueThree,
  rankOrderFour,
  personItemThree,
  bibRankMismatch,
  threeDigitEqualStepTable,
  digitSumTableFill,
  diceTwoDigitCount,
  tShapeMagicThreeWays,
  cornerShapeMagicThreeWays,
  equalLineEightCardsRange,
  circleDiametersFive,
  gakuroMaskedCards,
  gakuroMaskedFree,
  lineLetterFlipFour,
  lineLetterTurnFour,
  lineLetterTwoFlipsHalfTurn,
  centerHalfTurnLines,
  centerPinwheelLines,
  clockHourHandTurn,
  digitalSelfPairSum,
  consonantFlipTurnClassify,
  digitalTwoFlipsHalfTurn,
  foldDiagonalTwiceUnfoldDraw
};

const row = (id, domain, middle, label, generator, searchAliases = []) => ({ id, domain, middle, label, generator, searchAliases });

export const BOOK01_STRUCTURE_TYPE_ROWS = [
  row("place-value-clue-three-b1", "number", "조건에 맞는 수", "여러 가지 조건으로 세 자리 수 하나 찾기", "placeValueClueThree", ["수 추리", "세 자리 수 조건"]),
  row("three-digit-equal-step-table-b1", "pattern", "수 추리", "각 자리 숫자가 같은 크기만큼 변하는 세 자리 수 표 채우기", "threeDigitEqualStepTable", ["수 추리 표"]),
  row("digit-sum-table-fill-b1", "number", "조건에 맞는 수", "각 자리 숫자의 합이 같은 두 자리 수 표 채우기", "digitSumTableFill", ["자리 숫자의 합 표"]),
  row("dice-two-digit-count-b1", "number", "조건에 맞는 수", "주사위 두 개로 만든 두 자리 수 중 조건에 맞는 수 세기", "diceTwoDigitCount", ["주사위"]),
  row("rank-order-four-b1", "logic", "순서와 비교", "네 사람의 등수를 조건으로 정하기", "rankOrderFour", ["달리기 등수", "줄 서기"]),
  row("person-item-three-b1", "logic", "조건 연결", "세 사람과 세 가지를 선으로 잇기", "personItemThree", ["선 잇기", "논리 추리"]),
  row("bib-rank-mismatch-b1", "logic", "순서와 비교", "등 번호와 등수가 모두 다른 네 선수의 등수", "bibRankMismatch", ["등 번호", "달리기 등수"]),
  row("t-magic-three-ways-b1", "number", "모양 마방진", "T자 마방진 세 가지로 완성하기", "tShapeMagicThreeWays", ["T자 마방진"]),
  row("corner-magic-three-ways-b1", "number", "모양 마방진", "ㄱ자 마방진 세 가지로 완성하기", "cornerShapeMagicThreeWays", ["ㄱ자 마방진"]),
  row("equal-line-eight-cards-range-b1", "number", "수 배열과 합", "연속한 여덟 수로 네모 둘레 줄의 합 같게 하기", "equalLineEightCardsRange", ["네모 방진"]),
  row("circle-two-diameters-five-b1", "number", "수 배열과 합", "원 둘레와 두 지름의 합을 같게 다섯 수 놓기", "circleDiametersFive", ["원형진"]),
  row("gakuro-masked-cards-b1", "number", "가쿠로", "모서리가 빠진 가쿠로를 수 카드로 채우기", "gakuroMaskedCards", ["가쿠로"]),
  row("gakuro-masked-free-b1", "number", "가쿠로", "모서리가 빠진 가쿠로를 서로 다른 수로 채우기", "gakuroMaskedFree", ["가쿠로"]),
  row("line-letter-flip-four-b1", "geometry", "도형 움직이기", "모눈 위 선 모양을 네 방향으로 뒤집어 그리기", "lineLetterFlipFour", ["뒤집기", "거울", "한글 자음"]),
  row("line-letter-turn-four-b1", "geometry", "도형 움직이기", "모눈 위 선 모양을 여러 방향으로 돌려 그리기", "lineLetterTurnFour", ["돌리기", "한글 자음"]),
  row("line-letter-two-flips-half-b1", "geometry", "도형 움직이기", "두 번 뒤집은 모양과 반 바퀴 돌린 모양 견주기", "lineLetterTwoFlipsHalfTurn", ["뒤집기", "돌리기"]),
  row("center-half-turn-lines-b1", "geometry", "도형 움직이기", "가운데 점을 중심으로 선을 반 바퀴 돌려 그리기", "centerHalfTurnLines", ["돌리기", "점 대칭"]),
  row("center-pinwheel-lines-b1", "geometry", "도형 움직이기", "반의 반 바퀴씩 세 번 돌려 바람개비 그리기", "centerPinwheelLines", ["바람개비", "돌리기"]),
  row("clock-hour-hand-turn-b1", "geometry", "도형 움직이기", "시계의 짧은 바늘을 돌린 뒤의 시각", "clockHourHandTurn", ["시계", "돌리기"]),
  row("digital-self-pair-sum-b1", "pattern", "디지털 숫자", "0~9 디지털 숫자를 모두 움직여 같아지는 수의 합", "digitalSelfPairSum", ["디지털 숫자", "뒤집기"]),
  row("consonant-flip-turn-classify-b1", "geometry", "도형 움직이기", "자음 여섯 개를 뒤집고 돌려 같아지는 것 찾기", "consonantFlipTurnClassify", ["한글 자음", "뒤집기", "돌리기"]),
  row("fold-diagonal-twice-unfold-draw-b1", "geometry", "색종이 접어 자르기", "두 대각선으로 접어 자르고 펼친 모양 그리기", "foldDiagonalTwiceUnfoldDraw", ["색종이 접기", "대각선 접기"]),
  row("digital-two-flips-half-b1", "pattern", "디지털 숫자", "디지털 숫자를 두 번 뒤집은 모양과 반 바퀴 돌린 모양", "digitalTwoFlipsHalfTurn", ["디지털 숫자", "뒤집기"])
];

export const BOOK01_STRUCTURE_GUIDES = {
  "place-value-clue-three-b1": "범위를 가장 많이 줄여 주는 조건부터 적용해 남는 수를 하나씩 지웁니다.",
  "three-digit-equal-step-table-b1": "백의 자리 숫자를 차례로 정하고 같은 수만큼 더하거나 빼서, 일의 자리가 0~9를 벗어나기 전까지 씁니다.",
  "digit-sum-table-fill-b1": "십의 자리를 1부터 바꾸고 일의 자리는 합에서 십의 자리를 뺀 수로 정합니다(일의 자리는 0~9).",
  "dice-two-digit-count-b1": "십의 자리에 1부터 6까지 차례로 놓고 맞는 일의 자리(1~6)를 찾아 빠짐없이 셉니다.",
  "rank-order-four-b1": "자리가 바로 정해지는 조건(가장 앞·바로 뒤)부터 칸에 놓고 남은 조건으로 나머지를 채웁니다.",
  "person-item-three-b1": "표에 될 수 없는 짝을 ×로 지우고, 하나만 남는 사람부터 선을 잇습니다.",
  "bib-rank-mismatch-b1": "칸마다 자기 등 번호는 지우고, 「바로 다음」 같은 조건을 놓아 볼 수 있는 경우만 남깁니다.",
  "t-magic-three-ways-b1": "두 줄이 함께 쓰는 칸의 수를 바꿔 보고, 남은 네 수가 합이 같은 두 쌍으로 나뉘는 경우만 찾습니다.",
  "corner-magic-three-ways-b1": "꺾이는 칸(두 줄이 함께 쓰는 칸)의 수를 바꿔 보고, 남은 네 수를 합이 같은 두 쌍으로 나눕니다.",
  "equal-line-eight-cards-range-b1": "두 꼭짓점이 주어진 줄의 가운데부터 채우고, 남은 꼭짓점은 두 줄의 합이 함께 맞는 수로 고릅니다.",
  "circle-two-diameters-five-b1": "둘레의 네 수는 두 지름의 끝 수이므로, 가운데 수가 한 지름 양 끝 두 수의 합과 같아야 합니다.",
  "gakuro-masked-cards-b1": "칸이 적은 줄이나 합이 아주 크거나 작은 줄부터 넣을 수 있는 카드를 좁힙니다.",
  "gakuro-masked-free-b1": "두 칸짜리 줄부터 합을 이루는 두 수의 짝을 찾고, 가로·세로가 함께 맞는 수를 고릅니다.",
  "line-letter-flip-four-b1": "거울을 댄 쪽으로 넘깁니다. 왼쪽·오른쪽으로 뒤집은 모양이 같고, 위·아래로 뒤집은 모양이 같습니다.",
  "line-letter-turn-four-b1": "위쪽 변이 어디로 가는지 따라가며 돌립니다. 한 바퀴 돌리면 처음 모양 그대로입니다.",
  "line-letter-two-flips-half-b1": "왼쪽·오른쪽과 위·아래를 차례로 뒤집으면 두 방향이 모두 바뀌어 반 바퀴 돌린 모양이 됩니다.",
  "center-half-turn-lines-b1": "꺾이는 점마다 가운데 점의 반대쪽 같은 거리에 점을 찍고 차례로 잇습니다.",
  "center-pinwheel-lines-b1": "한 번 돌린 모양을 그리고, 그 모양을 같은 방법으로 두 번 더 돌립니다.",
  "clock-hour-hand-turn-b1": "짧은 바늘은 한 바퀴에 12칸, 반 바퀴에 6칸, 반의 반 바퀴에 3칸 움직입니다.",
  "digital-self-pair-sum-b1": "0부터 9까지 모두 움직여 그려 보고, 그대로인 숫자와 서로 바뀌는 숫자를 나눠 더합니다.",
  "consonant-flip-turn-classify-b1": "오른쪽으로 뒤집으면 좌우만, 반 바퀴 돌리면 위아래와 좌우가 함께 바뀝니다.",
  "fold-diagonal-twice-unfold-draw-b1": "마지막에 접은 대각선부터 거울처럼 펼쳐, 잘린 부분을 두 번 대칭으로 옮겨 그립니다.",
  "digital-two-flips-half-b1": "오른쪽으로 한 번, 아래쪽으로 한 번 뒤집으면 반 바퀴 돌린 모양과 같습니다."
};

export const BOOK01_STRUCTURE_REMAPS = [
  ["book-01", 1, "activity", 1, [1], "line-letter-flip-four-b1"],
  ["book-01", 1, "practice", 1, [1], "line-letter-flip-four-b1"],
  ["book-01", 1, "activity", 1, [2], "clock-hour-hand-turn-b1"],
  ["book-01", 1, "activity", 1, [3], "line-letter-turn-four-b1"],
  ["book-01", 1, "practice", 1, [2], "line-letter-turn-four-b1"],
  ["book-01", 1, "activity", 1, [4], "line-letter-two-flips-half-b1"],
  ["book-01", 1, "practice", 1, [3], "line-letter-two-flips-half-b1"],
  ["book-01", 1, "activity", 1, [5], "center-half-turn-lines-b1"],
  ["book-01", 1, "practice", 1, [4], "center-half-turn-lines-b1"],
  ["book-01", 1, "activity", 1, [6], "center-pinwheel-lines-b1"],
  ["book-01", 1, "practice", 1, [5], "center-pinwheel-lines-b1"],
  ["book-01", 1, "activity", 2, [1], "digital-self-pair-sum-b1"],
  ["book-01", 1, "practice", 1, [11, 12], "digital-self-pair-sum-b1"],
  ["book-01", 1, "activity", 2, [2], "digital-two-flips-half-b1"],
  ["book-01", 1, "practice", 1, [10], "consonant-flip-turn-classify-b1"],
  ["book-01", 2, "activity", 2, [3, 4], "fold-diagonal-twice-unfold-draw-b1"],
  ["book-01", 2, "practice", 1, [10, 11], "fold-diagonal-twice-unfold-draw-b1"],
  ["book-01", 3, "activity", 1, [4], "t-magic-three-ways-b1"],
  ["book-01", 3, "practice", 1, [5], "t-magic-three-ways-b1"],
  ["book-01", 3, "activity", 1, [5], "corner-magic-three-ways-b1"],
  ["book-01", 3, "practice", 1, [6], "corner-magic-three-ways-b1"],
  ["book-01", 3, "practice", 1, [7, 8], "equal-line-eight-cards-range-b1"],
  ["book-01", 3, "advanced", 1, [1], "circle-two-diameters-five-b1"],
  ["book-01", 3, "check", 2, [4], "gakuro-masked-cards-b1"],
  ["book-01", 3, "practice", 1, [10, 14, 15, 17], "gakuro-masked-cards-b1"],
  ["book-01", 3, "advanced", 1, [4], "gakuro-masked-free-b1"],
  ["book-01", 4, "activity", 1, [1], "three-digit-equal-step-table-b1"],
  ["book-01", 4, "practice", 1, [2], "three-digit-equal-step-table-b1"],
  ["book-01", 4, "practice", 1, [1], "digit-sum-table-fill-b1"],
  ["book-01", 4, "practice", 1, [11], "dice-two-digit-count-b1"],
  ["book-01", 4, "check", 1, [1, 2, 3, 4], "place-value-clue-three-b1"],
  ["book-01", 4, "practice", 1, [7, 8, 9, 10, 12, 13, 14], "place-value-clue-three-b1"],
  ["book-01", 4, "activity", 2, [1, 2], "person-item-three-b1"],
  ["book-01", 4, "practice", 1, [15, 16, 17, 18], "person-item-three-b1"],
  ["book-01", 4, "check", 2, [1, 2, 3, 4], "rank-order-four-b1"],
  ["book-01", 4, "practice", 1, [21, 22, 23], "rank-order-four-b1"],
  ["book-01", 4, "advanced", 1, [4], "bib-rank-mismatch-b1"]
];
