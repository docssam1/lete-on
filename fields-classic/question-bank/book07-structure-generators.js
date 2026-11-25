// 1과정 7권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK07_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK07_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK07_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK07_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   1단원 달력 징검다리(달마다 같은 날짜로 건너 칸 채우기) · 남은 날 + 날짜로 요일 옮기기 · 오전→오후 걸린 시간 ·
//        시간 세로셈 여섯 칸 · 시계 그리기(끝 시각 / 시작 시각) · 섞인 단위 바꾸기 판
//   2단원 나눗셈 세로식 복면산(몫 두 자리, 나누는 수도 빈칸 — 모든 경우를 넣어 보는 풀이기로 답 하나) ·
//        색칠한 칸 채우기 수 띠 · 첫 수가 빈칸인 수열의 먼 번째 수 · 띄엄띄엄 값만 있는 순서표 · 기본 점수 0 우기기
//   3단원 직사각형 둘레 나무 · 원 둘레 나무 사이 꽃(m·cm) · 간격 구하기 · 바꾼 병 수 · 가득 차기 며칠 전 몫 ·
//        개구리풀 네 물음 · 가로등 사이 의자와 앉는 사람 · 나무 수로 둘레 구하기
//   4단원 범위 안 자리 합 대칭수 · 이어 쓴 날짜 대칭수(한 달 / 기간 개수) · 네 점·여섯 점 겹친 거리 ·
//        두 방향 자리 바꿈 차 · 바꾸니 커진 수 · 두 방향 가장 작은 수 · 전체·둘 다 아님 벤 · 가지 그림 둘(두 층·세 층) ·
//        겹치지 않는 두 무리와 나머지 · 거꾸로 더하기 되풀이 · 495 만들기 칸 채우기 · 카드 제한 대칭수 · 삼각형 바둑돌 뒤집기

import { dimArc } from "./length-dim.js";

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[randomInt(0, list.length - 1)];
const sum = (list) => list.reduce((a, b) => a + b, 0);
const mod = (v, m) => ((v % m) + m) % m;

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 수 뒤 받침: 끝자리 2·4·5·9는 받침 없음(이·사·오·구), 나머지(영·일·삼·육·칠·팔·십·백)는 받침 있음.
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(n) % 10);
const josa = (n, withBatchim, without) => `${n}${hasBatchim(n) ? withBatchim : without}`;
// 낱말 뒤 「을/를」: 마지막 글자의 받침으로
const obj = (word) => { const c = word.charCodeAt(word.length - 1) - 0xac00; return `${word}${c >= 0 && c % 28 ? "을" : "를"}`; };
// 「(으)로」: 받침이 없거나 ㄹ 받침(1·7·8)이면 「로」
const ro = (n) => `${n}${[0, 3, 6].includes(Math.abs(n) % 10) ? "으로" : "로"}`;

const INK = "#2f2a24";
const SOFT = "#7a8a84";
const PAPER = "#f4f1e8";
const ACCENT = "#2f6b4f";
const FONT = "font-family:'Noto Sans KR','FC Sans',sans-serif";
const PARTS = ["(1)", "(2)", "(3)", "(4)", "(5)", "(6)", "(7)", "(8)"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const svgOpen = (w, h, label) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="width:${w}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">`;
const text = (x, y, value, size = 16, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const textL = (x, y, value, size = 16, extra = "") => `<text x="${x}" y="${y}" text-anchor="start" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const blankBox = (x, y, w = 26, h = 24) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" style="fill:#fff;stroke:${ACCENT};stroke-width:1.4"/>`;
const panel = (w, h) => `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" style="fill:${PAPER};stroke:none"/>`;
const wrapRow = (items) => `<div style="display:flex;flex-wrap:wrap;gap:14px 22px;align-items:flex-start;justify-content:center">${items.join("")}</div>`;
const labeled = (label, inner) => `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px"><b style="font-size:15px">${label}</b>${inner}</div>`;

const dateSerial = (month, date) => sum(MONTH_DAYS.slice(0, month - 1)) + date;
const dateText = (m, d) => `${m}월 ${d}일`;

// ── 1단원 달력 ──────────────────────────────────────

// 날짜 줄 + 왼쪽 빈칸(건너뛴 날 수) — 교재의 징검다리 꼴
function dateChainSvg(dates, weekday, { filled = null } = {}) {
  const rowH = 34;
  const w = 250;
  const h = dates.length * rowH + 18;
  let body = panel(w, h);
  dates.forEach(([m, d], i) => {
    const y = 26 + i * rowH;
    const wd = i === 0 ? WEEKDAYS[weekday] : filled ? WEEKDAYS[filled.weekdays[i]] : "";
    body += textL(118, y, `${dateText(m, d)} (`, 15);
    body += text(205, y, wd, 15);
    body += textL(220, y, ")", 15);
    if (i > 0) {
      const yTop = 26 + (i - 1) * rowH - 5;
      const yBot = y - 5;
      body += `<path d="M112 ${yTop} Q96 ${(yTop + yBot) / 2} 112 ${yBot}" style="fill:none;stroke:${ACCENT};stroke-width:1.4"/>`;
      body += `<path d="M106 ${yBot - 5} L112 ${yBot} L105 ${yBot + 3}" style="fill:none;stroke:${ACCENT};stroke-width:1.4"/>`;
      if (filled) body += text(70, (yTop + yBot) / 2 + 6, filled.gaps[i - 1], 15);
      else body += blankBox(56, (yTop + yBot) / 2 - 12, 34, 24);
    }
  });
  return `${svgOpen(w, h, "날짜와 요일을 차례로 건너가는 칸")}${body}</svg>`;
}

function weekdayAfter(weekday, days) { return mod(weekday + days, 7); }

function calendarChainSpec(difficulty) {
  for (let tries = 0; tries < 400; tries += 1) {
    const mode = pick(difficulty === 1 ? ["up", "first"] : ["up", "cross", "first", "cross"]);
    const monthsAcross = difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(1, 3) : randomInt(2, 4);
    const startMonth = randomInt(1, 12 - monthsAcross);
    const targetMonth = startMonth + monthsAcross;
    const startDate = mode === "first" ? 1 : randomInt(2, 27);
    let targetDate;
    if (mode === "cross") targetDate = randomInt(1, startDate - 1);
    else targetDate = randomInt(startDate + 1, MONTH_DAYS[targetMonth - 1]);
    if (mode === "cross" && monthsAcross < 1) continue;
    const dates = [];
    const lastSameMonth = mode === "cross" ? targetMonth - 1 : targetMonth;
    for (let m = startMonth; m <= lastSameMonth; m += 1) {
      if (startDate > MONTH_DAYS[m - 1]) break;
      dates.push([m, startDate]);
    }
    if (dates.length !== lastSameMonth - startMonth + 1) continue;
    dates.push([targetMonth, targetDate]);
    const boxes = dates.length - 1;
    const [lo, hi] = difficulty === 1 ? [1, 2] : difficulty === 2 ? [2, 3] : [3, 5];
    if (boxes < lo || boxes > hi) continue;
    return { mode, dates };
  }
  return null;
}

function calendarDateChainB7({ difficulty = 2 }) {
  const spec = calendarChainSpec(difficulty);
  if (!spec) return null;
  const { dates } = spec;
  const weekday = randomInt(0, 6);
  const gaps = dates.slice(1).map(([m, d], i) => dateSerial(m, d) - dateSerial(dates[i][0], dates[i][1]));
  const weekdays = [weekday];
  gaps.forEach((g) => weekdays.push(weekdayAfter(weekdays.at(-1), g)));
  const [sm, sd] = dates[0];
  const [tm, td] = dates.at(-1);
  const passesFeb = dates.some(([m], i) => i < dates.length - 1 && m === 2) || (sm <= 2 && tm > 2);
  const note = passesFeb ? " (그 해의 2월은 28일까지입니다.)" : "";
  const answer = `${WEEKDAYS[weekdays.at(-1)]}요일`;
  const steps = dates.slice(1).map(([m, d], i) => {
    const [pm, pd] = dates[i];
    const g = gaps[i];
    const how = pm === m ? `${d - pd}일 뒤` : pd === d ? `${pm}월이 ${MONTH_DAYS[pm - 1]}일까지라 ${g}일 뒤` : `${pm}월 남은 날 ${MONTH_DAYS[pm - 1] - pd}일과 ${d}일을 더해 ${g}일 뒤`;
    return `${dateText(pm, pd)}에서 ${dateText(m, d)}는 ${how}이고 ${josa(g, "을", "를")} 7로 나눈 나머지 ${g % 7}만큼 옮겨 ${WEEKDAYS[weekdays[i + 1]]}요일`;
  });
  return {
    prompt: `어느 해 ${dateText(sm, sd)}은 ${WEEKDAYS[weekday]}요일입니다. 같은 해 ${dateText(tm, td)}은 무슨 요일인지 빈칸에 건너뛴 날 수를 쓰며 구하세요.${note}`,
    visual: { kind: "fig", html: dateChainSvg(dates, weekday) },
    answerVisual: { kind: "fig", html: dateChainSvg(dates, weekday, { filled: { gaps, weekdays } }) },
    responseKind: "visual-fill",
    answer: `${answer} (빈칸 ${gaps.join(", ")})`,
    solution: `${steps.join(", ")}입니다. 그래서 ${dateText(tm, td)}은 ${answer}입니다.`,
    meta: { family: "calendar-date-chain-b7", dates, weekday, gaps, weekdays, mode: spec.mode }
  };
}

// 남은 날 + 날짜 → 7로 나눈 나머지만큼 옮기기(교재의 「+○」 꼴)
function remainingSvg(item, { filled = false } = {}) {
  const w = 230;
  const h = 98;
  const { from, to, weekday, gap, target } = item;
  let body = panel(w, h);
  body += textL(104, 28, `${dateText(...from)} ( ${WEEKDAYS[weekday]} )`, 15);
  body += textL(104, 82, `${dateText(...to)} ( ${filled ? WEEKDAYS[target] : " "} )`, 15);
  body += `<path d="M98 22 Q66 52 98 78" style="fill:none;stroke:${ACCENT};stroke-width:1.4"/>`;
  body += `<path d="M91 74 L98 78 L91 82" style="fill:none;stroke:${ACCENT};stroke-width:1.4"/>`;
  body += filled ? text(40, 57, `${gap}일`, 15) : blankBox(20, 40, 36, 24);
  body += `<path d="M176 38 L176 62" style="stroke:${ACCENT};stroke-width:1.4"/><path d="M172 57 L176 63 L180 57" style="fill:none;stroke:${ACCENT};stroke-width:1.4"/>`;
  body += text(190, 55, "+", 14);
  body += filled ? text(212, 55, gap % 7, 15) : `<circle cx="212" cy="50" r="10" style="fill:#fff;stroke:${ACCENT};stroke-width:1.4"/>`;
  return `${svgOpen(w, h, "남은 날 수와 요일 옮기기")}${body}</svg>`;
}

function remainingItem() {
  for (;;) {
    const m = randomInt(1, 11);
    const d = randomInt(14, MONTH_DAYS[m - 1] - 1);
    const t = randomInt(1, Math.min(d - 1, MONTH_DAYS[m]));
    const gap = MONTH_DAYS[m - 1] - d + t;
    if (gap % 7 === 0) continue;
    const weekday = randomInt(0, 6);
    return { from: [m, d], to: [m + 1, t], weekday, gap, target: weekdayAfter(weekday, gap) };
  }
}

function calendarRemainingDaysB7({ difficulty = 2 }) {
  const n = difficulty;
  const items = Array.from({ length: n }, remainingItem);
  const line = (it) => `${dateText(...it.from)}이 ${WEEKDAYS[it.weekday]}요일이면 같은 해 ${dateText(...it.to)}`;
  const answerOf = (it) => `${WEEKDAYS[it.target]}요일 (${it.gap}일, +${it.gap % 7})`;
  const solutionOf = (it) => `${it.from[0]}월은 ${MONTH_DAYS[it.from[0] - 1]}일까지라 남은 날은 ${MONTH_DAYS[it.from[0] - 1] - it.from[1]}일이고 여기에 ${it.to[1]}일을 더하면 ${it.gap}일 뒤입니다. ${josa(it.gap, "을", "를")} 7로 나눈 나머지 ${it.gap % 7}만큼 옮기면 ${WEEKDAYS[it.target]}요일입니다.`;
  const many = n > 1;
  return {
    prompt: many
      ? `요일은 7일마다 같아집니다. 앞 달의 남은 날 수에 날짜를 더해 며칠 뒤인지 구하고, 7로 나눈 나머지만큼 요일을 옮겨 구하세요. ${items.map((it, i) => `${PARTS[i]} ${line(it)}은 무슨 요일인가요.`).join(" ")}`
      : `어느 해 ${dateText(...items[0].from)}은 ${WEEKDAYS[items[0].weekday]}요일입니다. 같은 해 ${dateText(...items[0].to)}은 무슨 요일인지 남은 날 수를 써서 구하세요.`,
    visual: { kind: "fig", html: many ? wrapRow(items.map((it, i) => labeled(PARTS[i], remainingSvg(it)))) : remainingSvg(items[0]) },
    answerVisual: { kind: "fig", html: many ? wrapRow(items.map((it, i) => labeled(PARTS[i], remainingSvg(it, { filled: true })))) : remainingSvg(items[0], { filled: true }) },
    responseKind: "visual-fill",
    answer: many ? items.map((it, i) => `${PARTS[i]} ${answerOf(it)}`).join(" / ") : answerOf(items[0]),
    solution: many ? items.map((it, i) => `${PARTS[i]} ${solutionOf(it)}`).join(" ") : solutionOf(items[0]),
    meta: { family: "calendar-remaining-days-b7", items }
  };
}

// ── 1단원 시계 ──────────────────────────────────────

const HOUR_HAND = "#9a4a14";
const MIN_HAND = "#6c6c6c";

// total = 0~719분(12시간 시계). blank면 바늘 없는 빈 시계(그리기용).
function clockSvg(total, { label = "", blank = false, size = 132 } = {}) {
  const c = 66;
  const r = 56;
  let body = `<circle cx="${c}" cy="${c}" r="${r}" style="fill:#fff;stroke:#a08c6a;stroke-width:5"/>`;
  for (let k = 0; k < 60; k += 1) {
    const a = (k * Math.PI) / 30;
    const r1 = k % 5 === 0 ? r - 9 : r - 5;
    body += `<line x1="${(c + Math.sin(a) * r1).toFixed(1)}" y1="${(c - Math.cos(a) * r1).toFixed(1)}" x2="${(c + Math.sin(a) * (r - 2)).toFixed(1)}" y2="${(c - Math.cos(a) * (r - 2)).toFixed(1)}" style="stroke:#555;stroke-width:${k % 5 === 0 ? 1.4 : 0.6}"/>`;
  }
  for (let k = 1; k <= 12; k += 1) {
    const a = (k * Math.PI) / 6;
    body += text((c + Math.sin(a) * (r - 18)).toFixed(1), (c - Math.cos(a) * (r - 18) + 4.5).toFixed(1), k, 11);
  }
  if (!blank) {
    const t = mod(total, 720);
    const ha = ((t / 60) * 30 * Math.PI) / 180;
    const ma = ((t % 60) * 6 * Math.PI) / 180;
    body += `<line x1="${c}" y1="${c}" x2="${(c + Math.sin(ha) * 28).toFixed(1)}" y2="${(c - Math.cos(ha) * 28).toFixed(1)}" style="stroke:${HOUR_HAND};stroke-width:4.5;stroke-linecap:round"/>`;
    body += `<line x1="${c}" y1="${c}" x2="${(c + Math.sin(ma) * 42).toFixed(1)}" y2="${(c - Math.cos(ma) * 42).toFixed(1)}" style="stroke:${MIN_HAND};stroke-width:3;stroke-linecap:round"/>`;
  }
  body += `<circle cx="${c}" cy="${c}" r="4.5" style="fill:#777"/>`;
  const h = label ? 158 : 134;
  if (label) body += text(c, 152, label, 14);
  return `<svg width="${size}" height="${(size * h) / 134}" viewBox="0 0 132 ${h}" style="width:${size}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label || "시계"}">${body}</svg>`;
}

const hm = (t) => ({ h: Math.floor(t / 60), m: t % 60 });
const clockName = (t) => { const x = mod(t, 720); const h = Math.floor(x / 60) || 12; return `${h}시 ${x % 60}분`; };
const durName = (t) => `${Math.floor(t / 60)}시간 ${t % 60}분`;

// 세로셈 판: rows = [{ cells:[{v, blank}], unit:["시","분"], note }], op 줄 다음에 선
function columnSvg(rows, { op = "−", opRow = 1, lineAfter = 1, tail = null, width = 300 } = {}) {
  const rowH = 34;
  const h = rows.length * rowH + 16 + (tail ? 0 : 0);
  let body = "";
  rows.forEach((row, i) => {
    const y = 10 + i * rowH;
    if (i === opRow) body += text(18, y + 18, op, 16);
    row.cells.forEach((cell, k) => {
      const x = 34 + k * 82;
      if (cell.blank) body += blankBox(x, y, 30, 24);
      else body += text(x + 15, y + 18, cell.v, 16);
      body += textL(x + 34, y + 18, row.units[k], 15);
    });
    if (row.note) body += textL(206, y + 18, row.note, 13, `style="fill:${SOFT};${FONT}"`);
    if (i === lineAfter) body += `<line x1="10" y1="${y + 30}" x2="196" y2="${y + 30}" style="stroke:${INK};stroke-width:1.2"/>`;
  });
  if (tail) body += tail(10 + (rows.length - 1) * rowH);
  return `${svgOpen(width, h, "시간 세로셈")}${body}</svg>`;
}

function amPmPair() {
  for (;;) {
    const start = randomInt(7, 11) * 60 + randomInt(0, 11) * 5;
    const end = randomInt(12, 17) * 60 + randomInt(0, 11) * 5;
    const dur = end - start;
    if (dur < 90 || dur > 9 * 60) continue;
    if (start % 60 <= end % 60 && Math.random() < 0.6) continue; // 받아내림이 있는 쪽을 더 자주
    return { start, end, dur };
  }
}

function elapsedTimeAmPmB7() {
  const { start, end, dur } = amPmPair();
  const e24 = hm(end);
  const s = hm(start);
  const rows = [
    { cells: [{ blank: true }, { blank: true }], units: ["시", "분"], note: "← 끝난 시각" },
    { cells: [{ blank: true }, { blank: true }], units: ["시", "분"], note: "← 시작한 시각" },
    { cells: [{ blank: true }, { blank: true }], units: ["시간", "분"], note: "" }
  ];
  const filledRows = [
    { cells: [{ v: e24.h }, { v: e24.m }], units: ["시", "분"], note: "← 끝난 시각" },
    { cells: [{ v: s.h }, { v: s.m }], units: ["시", "분"], note: "← 시작한 시각" },
    { cells: [{ v: Math.floor(dur / 60) }, { v: dur % 60 }], units: ["시간", "분"], note: `= ${dur}분` }
  ];
  const tailBlank = (y) => `${text(214, y + 18, "=", 16)}${blankBox(228, y, 40, 24)}${textL(272, y + 18, "분", 15)}`;
  const clocks = wrapRow([clockSvg(start, { label: "시작한 시각 (오전)" }), clockSvg(end, { label: "끝난 시각 (오후)" })]);
  const borrow = s.m > e24.m;
  return {
    prompt: "오전에 시작해서 오후에 끝났을 때 본 두 시계입니다. 오후의 시각은 12를 더한 시로 바꾸어 세로셈을 하고, 걸린 시간을 구하세요.",
    visual: { kind: "fig", html: `${clocks}${columnSvg(rows, { tail: tailBlank })}` },
    answerVisual: { kind: "fig", html: columnSvg(filledRows) },
    responseKind: "visual-fill",
    answer: `${durName(dur)} = ${dur}분`,
    solution: `시작은 오전 ${clockName(start)}, 끝은 오후 ${clockName(end)}이고 오후 시각은 ${e24.h}시 ${e24.m}분으로 씁니다. ${borrow ? `분끼리 뺄 수 없어 1시간을 60분으로 바꾸면 ` : ""}${e24.h}시 ${e24.m}분 − ${s.h}시 ${s.m}분 = ${durName(dur)}이고, ${durName(dur)}은 ${dur}분입니다.`,
    meta: { family: "elapsed-time-am-pm-b7", start, end, dur }
  };
}

// 시간의 덧셈·뺄셈 여섯 칸(시각 + 시간, 시각 − 시간, 오후 시각 − 오전 시각)
function timeColumnItem(kind) {
  for (;;) {
    if (kind === "add") {
      const a = randomInt(1, 8) * 60 + randomInt(15, 55);
      const b = randomInt(1, 3) * 60 + randomInt(15, 55);
      if ((a % 60) + (b % 60) < 60 || a + b >= 12 * 60 + 60) continue;
      return { kind, a, b, r: a + b };
    }
    if (kind === "sub") {
      const a = randomInt(5, 11) * 60 + randomInt(5, 40);
      const b = randomInt(1, 4) * 60 + randomInt(20, 55);
      if ((a % 60) >= (b % 60) || a - b < 60) continue;
      return { kind, a, b, r: a - b };
    }
    const a = randomInt(13, 18) * 60 + randomInt(0, 11) * 5;
    const b = randomInt(7, 11) * 60 + randomInt(0, 11) * 5;
    if ((a % 60) >= (b % 60)) continue;
    return { kind, a, b, r: a - b };
  }
}

function timeColumnSvg(item, filled = false) {
  const A = hm(item.a);
  const B = hm(item.b);
  const R = hm(item.r);
  const pm = item.kind === "ampm";
  const w = 200;
  let body = "";
  const unitTop = pm ? ["시", "분"] : ["시", "분"];
  body += textL(8, 22, pm ? "오후" : "", 13);
  body += text(70, 22, pm ? A.h - 12 : A.h, 16) + textL(84, 22, "시", 14) + text(132, 22, A.m, 16) + textL(146, 22, "분", 14);
  body += text(14, 52, item.kind === "add" ? "+" : "−", 16) + textL(26, 52, pm ? "오전" : "", 13);
  body += text(70, 52, B.h, 16) + textL(84, 52, pm ? "시" : "시간", 14) + text(132, 52, B.m, 16) + textL(146, 52, "분", 14);
  body += `<line x1="8" y1="62" x2="170" y2="62" style="stroke:${INK};stroke-width:1.2"/>`;
  const unitsR = pm ? ["시간", "분"] : unitTop;
  if (filled) body += text(70, 88, R.h, 16) + text(132, 88, R.m, 16);
  else body += blankBox(56, 70, 28, 24) + blankBox(118, 70, 28, 24);
  body += textL(86, 88, unitsR[0], 14) + textL(148, 88, unitsR[1], 14);
  return `${svgOpen(w, 100, "시간 세로셈")}${body}</svg>`;
}

function timeColumnSheetB7() {
  const items = [timeColumnItem("add"), timeColumnItem("add"), timeColumnItem("sub"), timeColumnItem("sub"), timeColumnItem("ampm"), timeColumnItem("ampm")];
  const ans = (it) => (it.kind === "ampm" ? durName(it.r) : `${hm(it.r).h}시 ${hm(it.r).m}분`);
  const why = (it) => {
    const A = hm(it.a);
    const B = hm(it.b);
    if (it.kind === "add") return `분끼리 ${A.m} + ${B.m} = ${A.m + B.m}분은 1시간 ${A.m + B.m - 60}분이므로 ${ans(it)}`;
    if (it.kind === "sub") return `${A.m}분에서 ${B.m}분을 뺄 수 없어 1시간을 60분으로 바꾸면 ${A.m + 60} − ${B.m} = ${A.m + 60 - B.m}분, ${A.h - 1} − ${B.h} = ${A.h - 1 - B.h}시이므로 ${ans(it)}`;
    return `오후 ${A.h - 12}시는 ${A.h}시이고 1시간을 60분으로 바꾸면 ${A.m + 60} − ${B.m} = ${A.m + 60 - B.m}분, ${A.h - 1} − ${B.h} = ${A.h - 1 - B.h}시간이므로 ${ans(it)}`;
  };
  return {
    prompt: "60분을 1시간으로 받아올리거나 1시간을 60분으로 받아내려 시간의 덧셈과 뺄셈을 하세요.",
    visual: { kind: "fig", html: wrapRow(items.map((it, i) => labeled(PARTS[i], timeColumnSvg(it)))) },
    answerVisual: { kind: "fig", html: wrapRow(items.map((it, i) => labeled(PARTS[i], timeColumnSvg(it, true)))) },
    responseKind: "visual-fill",
    answer: items.map((it, i) => `${PARTS[i]} ${ans(it)}`).join(" / "),
    solution: items.map((it, i) => `${PARTS[i]} ${why(it)}입니다.`).join(" "),
    meta: { family: "time-column-sheet-b7", items }
  };
}

// 시계 그리기 — 아는 시각은 시계 그림으로만, 모르는 시각은 빈 시계에 그린다
function timeDrawProblem(findEnd) {
  const start = randomInt(1, 8) * 60 + randomInt(1, 11) * 5;
  let dur;
  for (;;) {
    dur = randomInt(1, 3) * 60 + randomInt(1, 11) * 5;
    const carry = findEnd ? (start % 60) + (dur % 60) >= 60 : ((start + dur) % 60) < (dur % 60);
    if (carry || Math.random() < 0.3) break;
  }
  const end = start + dur;
  const known = findEnd ? start : end;
  const unknown = findEnd ? end : start;
  const K = hm(known);
  const U = hm(mod(unknown, 720) || 720);
  const D = hm(dur);
  const pair = (draw) => wrapRow(findEnd
    ? [clockSvg(start, { label: "시작한 시각" }), clockSvg(end, { label: "끝난 시각", blank: !draw })]
    : [clockSvg(start, { label: "들어간 시각", blank: !draw }), clockSvg(end, { label: "나온 시각" })]);
  const rows = (fill) => [
    { cells: [{ blank: !fill, v: K.h }, { blank: !fill, v: K.m }], units: ["시", "분"], note: findEnd ? "← 시작한 시각" : "← 나온 시각" },
    { cells: [{ blank: !fill, v: D.h }, { blank: !fill, v: D.m }], units: ["시간", "분"], note: findEnd ? "← 걸린 시간" : "← 머문 시간" },
    { cells: [{ blank: !fill, v: U.h }, { blank: !fill, v: U.m }], units: ["시", "분"], note: findEnd ? "← 끝난 시각" : "← 들어간 시각" }
  ];
  const op = findEnd ? "+" : "−";
  const name = clockName(unknown);
  return {
    prompt: findEnd
      ? `시작할 때 본 시계입니다. ${durName(dur)} 동안 했다면 끝난 시각은 몇 시 몇 분인지 세로셈으로 구하고 빈 시계에 바늘을 그리세요.`
      : `${durName(dur)} 동안 있다가 나올 때 본 시계입니다. 들어간 시각은 몇 시 몇 분인지 세로셈으로 구하고 빈 시계에 바늘을 그리세요.`,
    visual: { kind: "fig", html: `${pair(false)}${columnSvg(rows(false), { op })}` },
    answerVisual: { kind: "fig", html: `${pair(true)}${columnSvg(rows(true), { op })}` },
    responseKind: "drawing",
    answer: name,
    solution: findEnd
      ? `시작한 시각은 ${clockName(start)}입니다. 분끼리 ${K.m} + ${D.m} = ${K.m + D.m}분${K.m + D.m >= 60 ? `은 1시간 ${K.m + D.m - 60}분이므로` : "이고"} 시는 ${K.h} + ${D.h}${K.m + D.m >= 60 ? " + 1" : ""}입니다. 끝난 시각은 ${name}이므로 긴 바늘은 ${hm(end).m}분 자리에, 짧은 바늘은 ${Math.floor(mod(end, 720) / 60) || 12}시를 지난 자리에 그립니다.`
      : `나온 시각은 ${clockName(end)}입니다. ${K.m < D.m ? `${K.m}분에서 ${D.m}분을 뺄 수 없어 1시간을 60분으로 바꾸면 ${K.m + 60} − ${D.m} = ${K.m + 60 - D.m}분이고, ` : `분끼리 ${K.m} − ${D.m} = ${K.m - D.m}분이고, `}들어간 시각은 ${name}입니다. 긴 바늘은 ${hm(start).m}분 자리에, 짧은 바늘은 ${Math.floor(mod(start, 720) / 60) || 12}시를 지난 자리에 그립니다.`,
    meta: { family: findEnd ? "find-end-time-draw-b7" : "find-start-time-draw-b7", start, dur, end }
  };
}

const findEndTimeDrawB7 = () => timeDrawProblem(true);
const findStartTimeDrawB7 = () => timeDrawProblem(false);

// 섞인 단위 바꾸기 여덟 칸
function timeUnitMixedSheetB7() {
  const d1 = randomInt(2, 5);
  const d2 = randomInt(1, 4);
  const h2 = randomInt(1, 20);
  const h3 = randomInt(2, 9);
  const h4 = randomInt(1, 5);
  const m4 = randomInt(1, 11) * 5;
  const m5 = randomInt(2, 9) * 60;
  let m6 = randomInt(2, 12) * 60;
  if (m6 === m5) m6 += 60;
  const m7 = randomInt(2, 9);
  const m8 = randomInt(2, 12);
  const s8 = randomInt(1, 11) * 5;
  const items = [
    { left: `${d1}일`, unit: "시간", value: d1 * 24, how: `1일은 24시간이므로 ${d1} × 24` },
    { left: `${d2}일 ${h2}시간`, unit: "시간", value: d2 * 24 + h2, how: `${d2}일은 ${d2 * 24}시간이므로 ${d2 * 24} + ${h2}` },
    { left: `${h3}시간`, unit: "분", value: h3 * 60, how: `1시간은 60분이므로 ${h3} × 60` },
    { left: `${h4}시간 ${m4}분`, unit: "분", value: h4 * 60 + m4, how: `${h4}시간은 ${h4 * 60}분이므로 ${h4 * 60} + ${m4}` },
    { left: `${m5}분`, unit: "시간", value: m5 / 60, how: `60분이 1시간이므로 ${m5} ÷ 60` },
    { left: `${m6}분`, unit: "시간", value: m6 / 60, how: `${m6} ÷ 60` },
    { left: `${m7}분`, unit: "초", value: m7 * 60, how: `1분은 60초이므로 ${m7} × 60` },
    { left: `${m8}분 ${s8}초`, unit: "초", value: m8 * 60 + s8, how: `${m8}분은 ${m8 * 60}초이므로 ${m8 * 60} + ${s8}` }
  ];
  const sheet = (filled) => {
    const w = 460;
    const h = 4 * 40 + 10;
    let body = "";
    items.forEach((it, i) => {
      const x = (i % 2) * 230;
      const y = 8 + Math.floor(i / 2) * 40;
      body += `<text x="${x + 110}" y="${y + 19}" text-anchor="end" font-size="15" style="fill:${INK};${FONT}">${it.left} =</text>`;
      body += filled ? text(x + 138, y + 19, it.value, 15) : blankBox(x + 116, y, 44, 26);
      body += textL(x + 166, y + 19, it.unit, 15);
    });
    return `${svgOpen(w, h, "시간 단위 바꾸기")}${body}</svg>`;
  };
  return {
    prompt: "1일은 24시간, 1시간은 60분, 1분은 60초입니다. 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "fig", html: sheet(false) },
    answerVisual: { kind: "fig", html: sheet(true) },
    responseKind: "visual-fill",
    answer: items.map((it) => `${it.left} = ${it.value}${it.unit}`).join(", "),
    solution: items.map((it) => `${it.how} = ${it.value}`).join(", ") + "입니다.",
    meta: { family: "time-unit-mixed-sheet-b7", items: items.map(({ left, unit, value }) => ({ left, unit, value })) }
  };
}

// ── 2단원 나눗셈 세로식 복면산 ──────────────────────

// 두 자리 몫, 나머지 0. 칸: q1 q2 / d / N의 자리 / P1 = d×q1 / R = r1·u / P2 = d×q2 / 0
function longDivisionCells(d, q) {
  const q1 = Math.floor(q / 10);
  const q2 = q % 10;
  const N = d * q;
  const nd = String(N).split("").map(Number);
  const P1 = d * q1;
  const r1 = Math.floor(N / 10) - P1;
  const R = r1 * 10 + (N % 10);
  const P2 = d * q2;
  return { q1, q2, N, nd, P1, r1, R, P2 };
}

function longDivisionShape(d, q) {
  const c = longDivisionCells(d, q);
  if (c.r1 <= 0 || c.r1 >= 10 || c.R !== c.P2) return null;
  return { n: c.nd.length, p1: String(c.P1).length, values: c };
}

// 칸 열쇠 → 숫자
function longDivisionDigits(d, q) {
  const s = longDivisionShape(d, q);
  if (!s) return null;
  const v = s.values;
  const digits = { d, q1: v.q1, q2: v.q2 };
  v.nd.forEach((x, i) => { digits[`n${i}`] = x; });
  String(v.P1).split("").forEach((x, i, a) => { digits[`p${a.length - i}`] = Number(x); });
  digits.r1 = v.r1;
  digits.u = v.N % 10;
  String(v.P2).split("").forEach((x, i) => { digits[`s${i}`] = Number(x); });
  return { shape: `${s.n}-${s.p1}`, digits };
}

function longDivisionSolutions(shape, shown, limit = 2) {
  const found = [];
  for (let d = 2; d <= 9; d += 1) {
    for (let q = 10; q <= 99; q += 1) {
      const one = longDivisionDigits(d, q);
      if (!one || one.shape !== shape) continue;
      if (Object.entries(shown).every(([k, v]) => one.digits[k] === v)) {
        found.push({ d, q });
        if (found.length >= limit) return found;
      }
    }
  }
  return found;
}

function makeLongDivision(hideDivisor) {
  for (let tries = 0; tries < 200; tries += 1) {
    const d = randomInt(hideDivisor ? 3 : 2, 9);
    const q = randomInt(11, 99);
    const one = longDivisionDigits(d, q);
    if (!one) continue;
    const keys = Object.keys(one.digits).filter((k) => k !== "d");
    const shown = {};
    if (!hideDivisor) shown.d = d;
    else { shown.q1 = one.digits.q1; }
    const order = shuffle(keys.filter((k) => !(k in shown)));
    let sols = longDivisionSolutions(one.shape, shown);
    for (const k of order) {
      if (sols.length === 1) break;
      shown[k] = one.digits[k];
      sols = longDivisionSolutions(one.shape, shown);
    }
    if (sols.length !== 1) continue;
    // 줄일 수 있으면 다시 감춘다(답이 하나인 채로)
    for (const k of shuffle(Object.keys(shown))) {
      if (k === "d" && !hideDivisor) continue;
      if (k === "q1" && hideDivisor) continue;
      const v = shown[k];
      delete shown[k];
      if (longDivisionSolutions(one.shape, shown).length !== 1) shown[k] = v;
    }
    const blanks = Object.keys(one.digits).length - Object.keys(shown).length;
    if (blanks < 6) continue;
    return { d, q, N: d * q, shape: one.shape, digits: one.digits, shown, hideDivisor };
  }
  return null;
}

function longDivisionSvg(item, filled = false) {
  const { digits, shown } = item;
  const n = Number(item.shape.split("-")[0]);
  const cw = 28;
  const x0 = 64;
  const colX = (i) => x0 + i * cw;
  const cell = (key, x, y) => {
    if (filled || key in shown) return text(x + 13, y + 19, digits[key], 17);
    return blankBox(x, y, 25, 25);
  };
  let body = "";
  const top = 6;
  // 몫: q1은 끝에서 두 번째 자리, q2는 끝자리 위
  body += cell("q1", colX(n - 2), top);
  body += cell("q2", colX(n - 1), top);
  const y1 = top + 34;
  body += `<path d="M${x0 - 6} ${y1 + 28} Q${x0 + 2} ${y1 + 14} ${x0 - 6} ${y1 - 2} L${colX(n) + 2} ${y1 - 2}" style="fill:none;stroke:${INK};stroke-width:1.3"/>`;
  body += cell("d", x0 - 40, y1);
  for (let i = 0; i < n; i += 1) body += cell(`n${i}`, colX(i), y1);
  const y2 = y1 + 32;
  const p1 = Number(item.shape.split("-")[1]);
  for (let k = p1; k >= 1; k -= 1) body += cell(`p${k}`, colX(n - 1 - k), y2);
  const y3 = y2 + 36;
  body += `<line x1="${colX(0) - 4}" y1="${y3 - 4}" x2="${colX(n) + 2}" y2="${y3 - 4}" style="stroke:${INK};stroke-width:1.2"/>`;
  body += cell("r1", colX(n - 2), y3);
  body += cell("u", colX(n - 1), y3);
  const y4 = y3 + 32;
  body += cell("s0", colX(n - 2), y4);
  body += cell("s1", colX(n - 1), y4);
  const y5 = y4 + 36;
  body += `<line x1="${colX(0) - 4}" y1="${y5 - 4}" x2="${colX(n) + 2}" y2="${y5 - 4}" style="stroke:${INK};stroke-width:1.2"/>`;
  body += text(colX(n - 1) + 13, y5 + 19, 0, 17);
  const w = colX(n) + 12;
  return `${svgOpen(w, y5 + 30, "나눗셈 세로식 복면산")}${body}</svg>`;
}

function divisionLongCryptarithmB7({ difficulty = 2 }) {
  const modes = difficulty === 1 ? [false, true] : [false, false, true, true];
  const items = modes.map((hide) => makeLongDivision(hide));
  if (items.some((it) => !it)) return null;
  const why = (it) => it.hideDivisor
    ? `몫의 십의 자리와 보이는 수를 맞추어 나누는 수를 찾으면 ${it.d}이고, ${it.N} ÷ ${it.d} = ${it.q}입니다.`
    : `${ro(it.d)} 나누어 나머지가 0이 되도록 보이는 자리부터 맞추면 ${it.N} ÷ ${it.d} = ${it.q}입니다.`;
  return {
    prompt: "나눗셈 세로식의 빈칸에 알맞은 숫자를 쓰세요. 마지막에 남는 수는 0입니다.",
    visual: { kind: "fig", html: wrapRow(items.map((it, i) => labeled(PARTS[i], longDivisionSvg(it)))) },
    answerVisual: { kind: "fig", html: wrapRow(items.map((it, i) => labeled(PARTS[i], longDivisionSvg(it, true)))) },
    responseKind: "visual-fill",
    answer: items.map((it, i) => `${PARTS[i]} ${it.N} ÷ ${it.d} = ${it.q}`).join(" / "),
    solution: `몫의 각 자리 수와 나누는 수를 곱한 값이 아래 줄에 오고, 빼고 남은 수에 다음 자리를 내려 씁니다. ${items.map((it, i) => `${PARTS[i]} ${why(it)}`).join(" ")}`,
    meta: { family: "division-long-cryptarithm-b7", items: items.map(({ d, q, N, shape, shown, hideDivisor }) => ({ d, q, N, shape, shown, hideDivisor })) }
  };
}

// ── 2단원 수열 ──────────────────────────────────────

function stripSvg(cells, { shaded = [], hints = 0, filled = null } = {}) {
  const cw = 46;
  const w = cells.length * cw + 4;
  const h = hints ? 78 : 44;
  let body = "";
  cells.forEach((v, i) => {
    const x = 2 + i * cw;
    const isShade = shaded.includes(i);
    body += `<rect x="${x}" y="4" width="${cw}" height="34" style="fill:${isShade ? "#dde9df" : "#fff"};stroke:${ACCENT};stroke-width:1.2"/>`;
    const shown = v !== null ? v : filled && isShade ? filled[i] : "";
    if (shown !== "") body += text(x + cw / 2, 27, shown, 15);
  });
  for (let k = 0; k < hints; k += 1) {
    const x = 2 + k * cw + cw / 2;
    body += `<path d="M${x} 42 Q${x + cw / 2} 58 ${x + cw - 4} 42" style="fill:none;stroke:${ACCENT};stroke-width:1.2"/>`;
    body += text(x + cw / 2 - 12, 68, "+", 12) + `<circle cx="${x + cw / 2}" cy="64" r="7" style="fill:#dde9df;stroke:none"/>`;
  }
  return `${svgOpen(w, h, "수 띠")}${body}</svg>`;
}

function stripItem(kind) {
  for (;;) {
    const len = kind === "end" ? randomInt(6, 7) : randomInt(7, 9);
    const step = randomInt(2, 9);
    const first = randomInt(1, 30);
    const vals = Array.from({ length: len }, (_, i) => first + step * i);
    let known;
    let shade;
    if (kind === "end") { known = randomInt(2, 3); shade = len - 1; } else { known = len - 1; shade = randomInt(2, len - 3); }
    const cells = vals.map((v, i) => (i === 0 || i === known ? v : null));
    return { cells, vals, step, known, shade, hints: kind === "end" ? known : 0 };
  }
}

function sequenceStripShadedB7({ difficulty = 2 }) {
  const kinds = difficulty === 1 ? ["end", "mid"] : ["end", "end", "mid", "mid"];
  const items = kinds.map(stripItem);
  return {
    prompt: "표의 각 칸에는 바로 앞 칸의 수에 같은 수를 더한 수가 차례로 들어갑니다. 색칠한 칸에 알맞은 수를 쓰세요.",
    visual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">${items.map((it, i) => labeled(PARTS[i], stripSvg(it.cells, { shaded: [it.shade], hints: it.hints }))).join("")}</div>` },
    answerVisual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">${items.map((it, i) => labeled(PARTS[i], stripSvg(it.cells, { shaded: [it.shade], filled: it.vals }))).join("")}</div>` },
    responseKind: "visual-fill",
    answer: items.map((it, i) => `${PARTS[i]} ${it.vals[it.shade]}`).join(" / "),
    solution: items.map((it, i) => `${PARTS[i]} ${it.cells[0]}에서 ${it.vals[it.known]}까지 ${it.known}번 더해 ${it.vals[it.known] - it.cells[0]}만큼 커졌으므로 한 번에 ${it.step}씩 더합니다. 색칠한 칸은 ${it.cells[0]} + ${it.step} × ${it.shade} = ${it.vals[it.shade]}입니다.`).join(" "),
    meta: { family: "sequence-strip-shaded-b7", items: items.map(({ cells, vals, step, shade, known }) => ({ cells, vals, step, shade, known })) }
  };
}

function sequenceBlankStartNthB7({ difficulty = 2 }) {
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const first = randomInt(1, 15);
  const position = randomInt(difficulty === 1 ? 12 : 20, difficulty === 3 ? 45 : 30);
  const a = first + step;
  const b = first + step * 4;
  const result = first + step * (position - 1);
  const row = (fill) => {
    const parts = [fill ? first : null, a, fill ? first + step * 2 : null, fill ? first + step * 3 : null, b];
    let x = 10;
    let body = panel(360, 46);
    parts.forEach((v) => {
      if (v === null) body += blankBox(x, 11, 26, 24); else body += text(x + 13, 29, v, 15);
      body += text(x + 34, 29, ",", 15);
      x += 46;
    });
    body += text(x + 14, 29, "…", 15) + text(x + 32, 29, ",", 15) + text(x + 54, 29, fill ? result : "㉠", 15);
    return `${svgOpen(360, 46, "첫 수가 빈칸인 수열")}${body}</svg>`;
  };
  return {
    prompt: `앞의 수에 같은 수를 더하여 만든 수열입니다. ㉠은 ${position}번째 수일 때 ㉠에 알맞은 수를 구하세요.`,
    visual: { kind: "fig", html: row(false) },
    answer: String(result),
    solution: `2번째 수 ${a}에서 5번째 수 ${b}까지 3번 더해 ${b - a}만큼 커졌으므로 한 번에 ${step}씩 더합니다. 첫 수는 ${a} − ${step} = ${first}이고, ${position}번째 수는 ${first} + ${step} × ${position - 1} = ${result}입니다.`,
    meta: { family: "sequence-blank-start-nth-b7", first, step, position, a, b, result }
  };
}

function sequenceIndexTableB7({ difficulty = 2 }) {
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const first = randomInt(1, 9);
  const target = randomInt(difficulty === 1 ? 15 : 20, difficulty === 3 ? 60 : 45);
  const v = (i) => first + step * (i - 1);
  const result = v(target);
  const cols = [1, 2, 3, 4, 5, 6, 7, "…", target];
  const vals = [v(1), null, null, null, v(5), null, v(7), "…", "㉠"];
  const cw = 44;
  const w = cols.length * cw + 4;
  let body = "";
  cols.forEach((c, i) => {
    const x = 2 + i * cw;
    body += `<rect x="${x}" y="2" width="${cw}" height="32" style="fill:#fff;stroke:${INK};stroke-width:1"/>`;
    body += `<rect x="${x}" y="34" width="${cw}" height="32" style="fill:#fff;stroke:${INK};stroke-width:1"/>`;
    body += text(x + cw / 2, 23, c, 14);
    if (vals[i] !== null) body += text(x + cw / 2, 55, vals[i], 14);
  });
  return {
    prompt: "어떤 규칙에 따라 순서와 수를 짝지은 표입니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "fig", html: `${svgOpen(w, 70, "순서와 수의 표")}${body}</svg>` },
    answer: String(result),
    solution: `5번째 수 ${josa(v(5), "과", "와")} 7번째 수 ${v(7)}의 차 ${josa(2 * step, "을", "를")} 2로 나누면 한 칸에 ${step}씩 커집니다. 첫 수 ${first}에서 ${target - 1}번 더하면 ${first} + ${step} × ${target - 1} = ${result}입니다.`,
    meta: { family: "sequence-index-table-b7", first, step, target, result }
  };
}

// 기본 점수 없이 맞히면 더하고 틀리면 빼는 우기기
function correctWrongZeroBaseB7({ difficulty = 2 }) {
  for (;;) {
    const total = randomInt(difficulty === 1 ? 8 : 10, difficulty === 3 ? 25 : 15);
    const gain = randomInt(3, difficulty === 3 ? 10 : 6);
    const penalty = randomInt(1, Math.min(gain, difficulty === 3 ? 6 : 4));
    const correct = randomInt(Math.ceil(total / 2), total - 1);
    const wrong = total - correct;
    const score = correct * gain - wrong * penalty;
    if (score <= 0) continue;
    return {
      prompt: `한 문제를 맞히면 ${gain}점을 얻고 틀리면 ${penalty}점을 잃는 퀴즈에서 ${total}문제를 모두 풀었습니다. 처음 점수는 0점이고 마지막 점수가 ${score}점일 때 맞힌 문제는 몇 개인가요?`,
      visual: { kind: "fig", html: assumptionTableSvg([["모두 맞혔다고 하면", "(       )점"], ["한 문제를 틀림으로 바꾸면", "(       )점씩 줄어듦"], ["틀린 문제", "(       )개"]]) },
      answer: `${correct}개`,
      solution: `모두 맞혔다고 하면 ${total} × ${gain} = ${total * gain}점입니다. 실제 점수와의 차는 ${total * gain - score}점이고, 한 문제를 틀림으로 바꿀 때마다 ${gain + penalty}점씩 줄어드므로 틀린 문제는 ${total * gain - score} ÷ ${gain + penalty} = ${wrong}개, 맞힌 문제는 ${correct}개입니다.`,
      meta: { family: "correct-wrong-zero-base-b7", total, gain, penalty, correct, wrong, score }
    };
  }
}

function assumptionTableSvg(rows) {
  const w = 380;
  const h = rows.length * 34 + 12;
  let body = panel(w, h);
  rows.forEach(([a, b], i) => {
    body += textL(16, 30 + i * 34, a, 14);
    body += textL(206, 30 + i * 34, b, 14, `style="fill:${ACCENT};${FONT}"`);
  });
  return `${svgOpen(w, h, "가정하여 풀기")}${body}</svg>`;
}

// ── 3단원 가로수 심기 ──────────────────────────────

function rectDimSvg(wm, hm2, { inner = null } = {}) {
  const scale = Math.min(200 / wm, 120 / hm2);
  const W = Math.max(90, wm * scale);
  const H = Math.max(56, hm2 * scale);
  const x = 30;
  const y = 34;
  let body = `<rect x="${x}" y="${y}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" style="fill:#e3ece1;stroke:${ACCENT};stroke-width:1.4"/>`;
  body += dimArc(x, y, x + W, y, -14, `${wm}m`, { size: 14 });
  body += dimArc(x + W, y, x + W, y + H, -14, `${hm2}m`, { size: 14 });
  if (inner) body += inner;
  return `${svgOpen(Math.ceil(x + W + 70), Math.ceil(y + H + 16), `가로 ${wm}m 세로 ${hm2}m인 직사각형`)}${body}</svg>`;
}

function rectPerimeterTreeCountB7({ difficulty = 2 }) {
  for (;;) {
    const s = randomInt(2, difficulty === 3 ? 9 : 6);
    const a = randomInt(3, difficulty === 3 ? 12 : 8);
    const b = randomInt(2, a - 1);
    const wm = s * a;
    const hm2 = s * b;
    const count = (2 * (wm + hm2)) / s;
    return {
      prompt: `가로 ${wm}m, 세로 ${hm2}m인 직사각형 모양 땅의 둘레에 ${s}m 간격으로 나무를 심으려고 합니다. 네 꼭짓점에도 나무를 심는다면 나무는 모두 몇 그루 필요한가요?`,
      visual: { kind: "fig", html: rectDimSvg(wm, hm2) },
      answer: `${count}그루`,
      solution: `직사각형의 둘레는 (${wm} + ${hm2}) × 2 = ${2 * (wm + hm2)}m입니다. 둘레를 한 바퀴 도는 닫힌 길이라 나무 수와 간격 수가 같으므로 ${2 * (wm + hm2)} ÷ ${s} = ${count}그루입니다.`,
      meta: { family: "rect-perimeter-tree-count-b7", wm, hm: hm2, s, count }
    };
  }
}

function loopCircleSvg(perimeterLabel, gapLabel, { flowers = 0, unit = "m" } = {}) {
  let body = `<circle cx="250" cy="70" r="56" style="fill:#e6efe2;stroke:#7d9b70;stroke-width:1.4"/>`;
  body += text(250, 76, `둘레 ${perimeterLabel}`, 14);
  body += `<line x1="20" y1="96" x2="170" y2="96" style="stroke:#7d9b70;stroke-width:2"/>`;
  const tree = (x) => `<rect x="${x - 2}" y="70" width="4" height="26" style="fill:#7a5a3a"/><ellipse cx="${x}" cy="62" rx="10" ry="16" style="fill:#5d8f4e"/>`;
  body += tree(30) + tree(160);
  for (let k = 1; k <= flowers; k += 1) {
    const x = 30 + (130 * k) / (flowers + 1);
    body += `<circle cx="${x.toFixed(1)}" cy="92" r="4" style="fill:#e58aa8"/>`;
  }
  body += text(12, 100, "…", 14) + text(182, 100, "…", 14);
  body += dimArc(30, 100, 160, 100, 12, gapLabel, { size: 14, unit });
  return `${svgOpen(320, 134, "둘레와 나무 사이 간격")}${body}</svg>`;
}

function loopTreeFlowerCountB7({ difficulty = 2 }) {
  for (;;) {
    const useCm = Math.random() < 0.4;
    let P;
    let a;
    let b;
    let bText;
    let aText;
    if (useCm) {
      a = pick([1, 2]);
      const bcm = pick([10, 20, 25, 50]);
      if ((a * 100) % bcm !== 0 || a * 100 === bcm) continue;
      P = a * randomInt(6, difficulty === 3 ? 30 : 15);
      b = bcm / 100;
      aText = `${a}m`;
      bText = `${bcm}cm`;
    } else {
      a = randomInt(4, difficulty === 3 ? 15 : 10);
      const divisors = [];
      for (let d = 1; d < a; d += 1) if (a % d === 0 && d >= 2) divisors.push(d);
      if (!divisors.length) continue;
      b = pick(divisors);
      P = a * randomInt(6, difficulty === 3 ? 20 : 12);
      aText = `${a}m`;
      bText = `${b}m`;
    }
    const trees = P / a;
    const per = Math.round(a / b) - 1;
    const flowers = trees * per;
    const cmNote = useCm ? " (1m는 100cm입니다.)" : "";
    return {
      prompt: `둘레가 ${P}m인 원 모양 연못 둘레에 ${aText} 간격으로 나무를 심고, 이웃한 두 나무 사이에는 ${bText} 간격으로 꽃을 심었습니다. 꽃은 모두 몇 송이인가요?${cmNote}`,
      visual: { kind: "fig", html: loopCircleSvg(`${P}m`, aText) },
      answer: `${flowers}송이`,
      solution: `닫힌 둘레이므로 나무는 ${P} ÷ ${a} = ${trees}그루이고 나무 사이도 ${trees}곳입니다. ${aText}를 ${bText}씩 나누면 ${per + 1}칸이라 한 곳에 꽃은 ${per}송이씩 들어갑니다. ${trees} × ${per} = ${flowers}송이입니다.`,
      meta: { family: "loop-tree-flower-count-b7", P, a, b, trees, per, flowers, useCm }
    };
  }
}

function loopSpacingFromCountB7({ difficulty = 2 }) {
  const count = randomInt(difficulty === 1 ? 6 : 10, difficulty === 3 ? 40 : 25);
  const s = randomInt(2, difficulty === 3 ? 12 : 8);
  const P = count * s;
  return {
    prompt: `둘레가 ${P}m인 호수 둘레에 같은 간격으로 나무 ${count}그루를 빙 둘러 심었습니다. 이웃한 두 나무 사이의 간격은 몇 m인가요?`,
    visual: { kind: "fig", html: loopCircleSvg(`${P}m`, "?") },
    answer: `${s}m`,
    solution: `닫힌 둘레에서는 간격 수가 나무 수와 같은 ${count}곳입니다. ${P} ÷ ${count} = ${s}m입니다.`,
    meta: { family: "loop-spacing-from-count-b7", P, count, s }
  };
}

function exchangeOnlyCountB7({ difficulty = 2 }) {
  for (;;) {
    const rate = randomInt(3, difficulty === 3 ? 6 : 5);
    const initial = randomInt(difficulty === 1 ? 10 : 18, difficulty === 3 ? 80 : 45);
    let empty = initial;
    let got = 0;
    const rounds = [];
    while (empty >= rate) {
      const r = Math.floor(empty / rate);
      rounds.push(`빈 병 ${empty}개 → 새 음료 ${r}병, 남는 빈 병 ${empty % rate}개`);
      got += r;
      empty = r + (empty % rate);
    }
    if (rounds.length < 2) continue;
    const icons = Array.from({ length: rate }, (_, i) => `<rect x="${8 + i * 26}" y="12" width="18" height="34" rx="5" style="fill:#eef3f2;stroke:#6f8a86;stroke-width:1.2"/>`).join("");
    const html = `${svgOpen(rate * 26 + 110, 58, `빈 병 ${rate}개를 새 음료 1병으로`)}${icons}${text(rate * 26 + 26, 34, "→", 18)}<rect x="${rate * 26 + 48}" y="12" width="18" height="34" rx="5" style="fill:#bfe0d8;stroke:#6f8a86;stroke-width:1.2"/>${textL(rate * 26 + 72, 34, "1병", 14)}</svg>`;
    return {
      prompt: `빈 병 ${rate}개를 가져가면 음료 1병으로 바꾸어 주는 가게가 있습니다. 빈 병 ${initial}개로 바꾸어 마시고, 마신 병도 다시 바꿀 때 음료를 최대 몇 병 바꾸어 마실 수 있나요?`,
      visual: { kind: "fig", html },
      answer: `${got}병`,
      solution: `${rounds.join(", ")}입니다. 더 바꿀 수 없을 때까지 바꾼 음료를 모두 더하면 ${got}병입니다.`,
      meta: { family: "exchange-only-count-b7", rate, initial, got, left: empty }
    };
  }
}

const FRACTION_WORDS = ["", "2분의 1", "4분의 1", "8분의 1", "16분의 1"];

function doublingBeforeFullB7({ difficulty = 2 }) {
  const full = randomInt(difficulty === 1 ? 5 : 7, difficulty === 3 ? 15 : 12);
  const back = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 4 : 3);
  const day = full - back;
  return {
    prompt: `하루에 2배씩 늘어나는 생물을 병에 넣었더니 ${full}일째 되는 날 병이 꽉 찼습니다. ${day}일째 되는 날 이 생물은 병의 얼마를 차지하고 있었나요?`,
    visual: { kind: "fig", html: doublingTableSvg(Array.from({ length: Math.min(back + 2, 6) }, (_, i) => full - i), [`가득`]) },
    answer: `병의 ${FRACTION_WORDS[back]}`,
    solution: `하루 전으로 갈 때마다 반으로 줄어듭니다. ${full}일째 가득에서 ${back}번 반으로 줄이면 ${day}일째는 병의 ${FRACTION_WORDS[back]}입니다.`,
    meta: { family: "doubling-before-full-b7", full, back, day }
  };
}

function doublingTableSvg(days, firstRow) {
  const cw = 64;
  const w = (days.length + 1) * cw + 4;
  let body = "";
  ["날짜", "양"].forEach((label, r) => {
    body += `<rect x="2" y="${2 + r * 34}" width="${cw}" height="34" style="fill:#dde9df;stroke:${ACCENT};stroke-width:1"/>`;
    body += text(2 + cw / 2, 24 + r * 34, label, 14);
  });
  days.forEach((d, i) => {
    const x = 2 + (i + 1) * cw;
    body += `<rect x="${x}" y="2" width="${cw}" height="34" style="fill:#fff;stroke:${ACCENT};stroke-width:1"/>`;
    body += `<rect x="${x}" y="36" width="${cw}" height="34" style="fill:#fff;stroke:${ACCENT};stroke-width:1"/>`;
    body += text(x + cw / 2, 24, `${d}일`, 14);
    if (firstRow[i]) body += text(x + cw / 2, 58, firstRow[i], 14);
  });
  return `${svgOpen(w, 74, "날짜별 양 표")}${body}</svg>`;
}

function doublingFrogWeedStepsB7({ difficulty = 2 }) {
  const N = randomInt(difficulty === 1 ? 7 : 9, difficulty === 3 ? 14 : 11);
  const k = randomInt(3, 4);
  const parts = [
    `${PARTS[0]} 1개를 넣으면 ${N}일 만에 연못을 가득 덮습니다. ${N - 1}일 동안은 연못의 얼마를 덮나요.`,
    `${PARTS[1]} ${N - 1}일 만에 가득 덮으려면 처음에 몇 개를 넣어야 하나요.`,
    `${PARTS[2]} 1개를 넣었을 때 ${N - 2}일이 지나면 연못의 얼마를 덮고, ${N - 2}일 만에 가득 덮으려면 처음에 몇 개를 넣어야 하나요.`,
    `${PARTS[3]} ${N - k}일 만에 가득 덮으려면 처음에 몇 개를 넣어야 하는지 표를 이용해 구하세요.`
  ];
  const days = Array.from({ length: k + 1 }, (_, i) => N - i);
  return {
    prompt: `매일 2배씩 자라는 풀이 있습니다. 풀 1개를 연못에 넣었더니 ${N}일 만에 연못을 모두 덮었습니다. 풀이 자라는 빠르기는 모두 같습니다. ${parts.join(" ")}`,
    visual: { kind: "fig", html: doublingTableSvg(days, ["1 (전체)"]) },
    answer: `${PARTS[0]} 연못의 2분의 1 / ${PARTS[1]} 2개 / ${PARTS[2]} 연못의 4분의 1, 4개 / ${PARTS[3]} ${2 ** k}개`,
    solution: `하루 전으로 갈 때마다 덮은 넓이는 반이 됩니다. ${N - 1}일 동안은 2분의 1을 덮으므로, 처음부터 2개를 넣으면 하루 일찍 가득 찹니다. ${N - 2}일이면 4분의 1이므로 4개가 필요합니다. ${N - k}일 만에 가득 채우려면 ${k}일 일찍이므로 2를 ${k}번 곱한 ${2 ** k}개가 필요합니다.`,
    meta: { family: "doubling-frog-weed-steps-b7", N, k, need: 2 ** k }
  };
}

function loopLampBenchPeopleB7({ difficulty = 2 }) {
  const s = randomInt(4, difficulty === 3 ? 15 : 12);
  const lamps = randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 20 : 14);
  const P = s * lamps;
  const benches = randomInt(1, 3);
  const seats = randomInt(2, 5);
  const people = lamps * benches * seats;
  return {
    prompt: `둘레가 ${P}m인 원 모양 호수 둘레에 ${s}m 간격으로 가로등이 서 있습니다. 이웃한 가로등 사이마다 ${seats}명이 앉을 수 있는 긴 의자를 ${benches}개씩 놓았습니다. 가로등은 몇 개이고, 의자에는 모두 몇 명이 앉을 수 있나요?`,
    visual: { kind: "fig", html: loopCircleSvg(`${P}m`, `${s}m`) },
    answer: `가로등 ${lamps}개, ${people}명`,
    solution: `닫힌 둘레이므로 가로등은 ${P} ÷ ${s} = ${lamps}개이고 가로등 사이도 ${lamps}곳입니다. 한 곳에 ${benches} × ${seats} = ${benches * seats}명씩 앉으므로 ${lamps} × ${benches * seats} = ${people}명입니다.`,
    meta: { family: "loop-lamp-bench-people-b7", P, s, lamps, benches, seats, people }
  };
}

function loopTotalTreesPerimeterB7({ difficulty = 2 }) {
  const k = randomInt(1, difficulty === 3 ? 4 : 3);
  const lamps = randomInt(difficulty === 1 ? 6 : 10, difficulty === 3 ? 30 : 20);
  const d = randomInt(2, difficulty === 3 ? 6 : 4);
  const trees = lamps * k;
  const P = lamps * (k + 1) * d;
  return {
    prompt: `둥근 연못 둘레에 가로등이 같은 간격으로 서 있고, 이웃한 두 가로등 사이마다 나무가 ${k}그루씩 심겨 있습니다. 나무가 모두 ${trees}그루이고 이웃한 가로등과 나무, 나무와 나무 사이가 모두 ${d}m라면 연못의 둘레는 몇 m인가요?`,
    visual: { kind: "fig", html: loopCircleSvg("?", `${d}m`, { flowers: 0 }) },
    answer: `${P}m`,
    solution: `가로등 사이 한 곳에 나무가 ${k}그루이므로 가로등 사이는 ${trees} ÷ ${k} = ${lamps}곳입니다. 한 곳에는 간격이 ${k + 1}개씩 있어 간격은 모두 ${lamps * (k + 1)}개이고, 둘레는 ${lamps * (k + 1)} × ${d} = ${P}m입니다.`,
    meta: { family: "loop-total-trees-perimeter-b7", k, lamps, d, trees, P }
  };
}

// ── 4단원 대칭수 ────────────────────────────────────

const isPal = (s) => String(s) === [...String(s)].reverse().join("");

function palindromeRangeDigitSumB7({ difficulty = 2 }) {
  for (;;) {
    const lo = randomInt(1, 5) * 100;
    const hi = lo + randomInt(2, difficulty === 3 ? 5 : 4) * 100;
    if (hi > 1000) continue;
    const S = randomInt(4, 24);
    const list = [];
    for (let n = lo + 1; n < hi; n += 1) {
      const t = String(n);
      if (t.length === 3 && isPal(t) && sum(t.split("").map(Number)) === S) list.push(n);
    }
    if (list.length < 1 || list.length > 4) continue;
    return {
      prompt: `${lo}보다 크고 ${hi}보다 작은 세 자리 대칭수 가운데 각 자리 숫자의 합이 ${S}인 수를 모두 구하세요.`,
      visual: { kind: "fig", html: palPatternSvg(["가", "나", "가"], [`${lo} < 가나가 < ${hi}`, `가 + 나 + 가 = ${S}`]) },
      answer: list.join(", "),
      solution: `백의 자리와 일의 자리가 같으므로 가 + 가 + 나 = ${S}입니다. 백의 자리 가는 ${Math.floor(lo / 100)}부터 ${Math.ceil(hi / 100) - 1}까지만 될 수 있고, 그중 가운데 수 나가 0부터 9까지인 것은 ${list.join(", ")}입니다.`,
      meta: { family: "palindrome-range-digit-sum-b7", lo, hi, S, list }
    };
  }
}

function palPatternSvg(cells, lines) {
  const w = 320;
  const top = cells.length ? 66 : 30;
  const h = top - 10 + lines.length * 24;
  let body = panel(w, h);
  cells.forEach((c, i) => {
    body += `<rect x="${20 + i * 38}" y="12" width="32" height="32" style="fill:#fff;stroke:${ACCENT};stroke-width:1.2"/>`;
    body += text(36 + i * 38, 34, c, 15);
  });
  lines.forEach((l, i) => { body += textL(20, top + i * 24, l, 14); });
  return `${svgOpen(w, h, "대칭수 조건")}${body}</svg>`;
}

function monthDatePalindromeB7() {
  for (;;) {
    const m = randomInt(1, 12);
    const list = [];
    for (let d = 1; d <= MONTH_DAYS[m - 1]; d += 1) if (isPal(`${m}${d}`)) list.push(d);
    if (!list.length) continue;
    const exM = m;
    const ex1 = pick([3, 4, 5, 6, 7, 8].filter((d) => !list.includes(d)));
    const ex2 = pick([12, 13, 14, 15, 16, 17, 18, 19].filter((d) => !list.includes(d)));
    return {
      prompt: `달력의 날짜를 월과 일을 그대로 이어 써서 수로 나타냅니다. ${m}월의 날짜 가운데 대칭수가 되는 날을 모두 구하세요.`,
      visual: { kind: "fig", html: palPatternSvg([], [`${exM}월 ${ex1}일 → ${exM}${ex1}`, `${exM}월 ${ex2}일 → ${exM}${ex2}`]) },
      answer: list.map((d) => `${m}월 ${d}일`).join(", "),
      solution: `${m}월이면 수가 ${ro(m)} 시작하므로 끝자리도 ${String(m).at(0)}이어야 합니다. 이어 쓴 수를 거꾸로 읽어 같은 날만 고르면 ${list.map((d) => `${m}${d}`).join(", ")}이므로 ${list.map((d) => `${m}월 ${d}일`).join(", ")}입니다.`,
      meta: { family: "month-date-palindrome-b7", m, list }
    };
  }
}

const pad2 = (v) => String(v).padStart(2, "0");

function datePalindromeCountRangeB7({ difficulty = 2 }) {
  for (;;) {
    const whole = difficulty === 3 || Math.random() < 0.4;
    const a = whole ? 1 : randomInt(1, 8);
    const b = whole ? 12 : randomInt(a + 2, 12);
    const list = [];
    for (let m = a; m <= b; m += 1) for (let d = 1; d <= MONTH_DAYS[m - 1]; d += 1) if (isPal(`${pad2(m)}${pad2(d)}`)) list.push(`${m}월 ${d}일`);
    if (!list.length) continue;
    return {
      prompt: `달력의 날짜를 월과 일을 각각 두 자리로 이어 써서 네 자리 수로 나타냅니다. ${a}월 1일부터 ${b}월 ${MONTH_DAYS[b - 1]}일까지의 날짜 가운데 대칭수는 모두 몇 개인가요?`,
      visual: { kind: "fig", html: palPatternSvg([], ["2월 9일 → 0209", "11월 3일 → 1103"]) },
      answer: `${list.length}개`,
      solution: `네 자리 대칭수는 월의 두 자리를 거꾸로 쓴 것이 일이 됩니다. 달마다 그 날짜가 그 달에 있는지 보면 ${list.join(", ")}로 모두 ${list.length}개입니다.`,
      meta: { family: "date-palindrome-count-range-b7", a, b, list }
    };
  }
}

// ── 4단원 점 사이 거리(겹친 부분) ────────────────────

const PT = ["A", "B", "C", "D", "E", "F"];

// spans: [{ i, j, label, side:"top"|"bottom", blank }] — 점 i~j 거리
function pointLineSvg(xs, spans) {
  const x0 = 24;
  const scale = 420 / xs.at(-1);
  const X = (i) => x0 + xs[i] * scale;
  const y = 92;
  let body = `<line x1="${X(0)}" y1="${y}" x2="${X(xs.length - 1)}" y2="${y}" style="stroke:${ACCENT};stroke-width:1.6"/>`;
  xs.forEach((_, i) => {
    body += `<circle cx="${X(i).toFixed(1)}" cy="${y}" r="3.5" style="fill:${ACCENT}"/>`;
    body += text(X(i).toFixed(1), y - 10, PT[i], 13);
  });
  const tops = spans.filter((s) => s.side === "top").sort((a, b) => (xs[a.j] - xs[a.i]) - (xs[b.j] - xs[b.i]));
  const bots = spans.filter((s) => s.side !== "top").sort((a, b) => (xs[a.j] - xs[a.i]) - (xs[b.j] - xs[b.i]));
  tops.forEach((s, k) => { body += dimArc(X(s.i), y - 4, X(s.j), y - 4, -(22 + k * 10 + (X(s.j) - X(s.i)) * 0.06), s.blank ? "" : s.label, { size: 14, blank: !!s.blank, unit: "", halo: true }); });
  bots.forEach((s, k) => { body += dimArc(X(s.i), y + 4, X(s.j), y + 4, 14 + k * 10 + (X(s.j) - X(s.i)) * 0.06, s.blank ? "" : s.label, { size: 14, blank: !!s.blank, unit: "", halo: true }); });
  const h = y + 24 + bots.length * 18 + 30;
  return `<svg width="470" height="${h}" viewBox="0 ${tops.length > 2 ? -14 : 0} 470 ${h + (tops.length > 2 ? 14 : 0)}" style="width:470px;max-width:100%;height:auto;flex:none" role="img" aria-label="수직선 위 점 사이 거리">${body}</svg>`;
}

function fourPointItem(mode) {
  for (;;) {
    const g = [randomInt(4, 20), randomInt(3, 15), randomInt(4, 20)];
    const xs = [0, g[0], g[0] + g[1], g[0] + g[1] + g[2]];
    const AD = xs[3];
    const AC = xs[2];
    const BD = xs[3] - xs[1];
    const BC = g[1];
    if (mode === "overlap") {
      return { xs, mode, answer: BC, spans: [{ i: 0, j: 3, label: AD, side: "top" }, { i: 1, j: 2, side: "top", blank: true }, { i: 0, j: 2, label: AC, side: "bottom" }, { i: 1, j: 3, label: BD, side: "bottom" }], why: `${AC} + ${BD} − ${AD} = ${BC}` };
    }
    return { xs, mode, answer: AD, spans: [{ i: 0, j: 3, side: "top", blank: true }, { i: 1, j: 2, label: BC, side: "top" }, { i: 0, j: 2, label: AC, side: "bottom" }, { i: 1, j: 3, label: BD, side: "bottom" }], why: `${AC} + ${BD} − ${BC} = ${AD}` };
  }
}

function fourPointOverlapB7({ difficulty = 2 }) {
  const modes = difficulty === 1 ? ["overlap", "total"] : ["overlap", "total", pick(["overlap", "total"])];
  const items = modes.map(fourPointItem);
  return {
    prompt: "수직선 위의 점과 점 사이의 거리를 나타낸 그림입니다. 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">${items.map((it, i) => labeled(PARTS[i], pointLineSvg(it.xs, it.spans))).join("")}</div>` },
    answer: items.map((it, i) => `${PARTS[i]} ${it.answer}`).join(" / "),
    solution: `A에서 C까지와 B에서 D까지를 더하면 B에서 C까지를 두 번 세게 됩니다. 그래서 (A~C) + (B~D) = (A~D) + (B~C)입니다. ${items.map((it, i) => `${PARTS[i]} ${it.why}`).join(", ")}입니다.`,
    meta: { family: "four-point-overlap-b7", items: items.map(({ xs, mode, answer }) => ({ xs, mode, answer })) }
  };
}

// 겹쳐 보이지 않게 위·아래를 고른다: 긴 구간부터, 끝점을 함께 쓰거나 겹치는 구간이 적은 쪽으로
function placeSpans(list) {
  const placed = [];
  const clash = (a, b) => a.i === b.i || a.j === b.j || a.i === b.j || a.j === b.i || (a.i < b.j && b.i < a.j);
  [...list].sort((a, b) => (b.j - b.i) - (a.j - a.i)).forEach((sp) => {
    const cost = (side) => placed.filter((q) => q.side === side && clash(q, sp)).length;
    const top = cost("top");
    const bottom = cost("bottom");
    placed.push({ ...sp, side: top < bottom || (top === bottom && placed.filter((q) => q.side === "top").length <= placed.filter((q) => q.side === "bottom").length) ? "top" : "bottom" });
  });
  return placed;
}

// 여섯 점: 주어진 거리 넷으로 남은 한 구간이 하나로 정해지는지 연립으로 확인
function spanVector(i, j) { return Array.from({ length: 5 }, (_, k) => (k >= i && k < j ? 1 : 0)); }

function solveCombination(givens, target) {
  // target = Σ c_k given_k 가 되는 정수 계수(−1,0,1)를 찾는다
  const n = givens.length;
  for (let mask = 0; mask < 3 ** n; mask += 1) {
    let x = mask;
    const c = [];
    for (let k = 0; k < n; k += 1) { c.push((x % 3) - 1); x = Math.floor(x / 3); }
    const v = Array(5).fill(0);
    givens.forEach((g, k) => g.forEach((e, t) => { v[t] += c[k] * e; }));
    if (v.every((e, t) => e === target[t])) return c;
  }
  return null;
}

function sixPointOverlapB7({ difficulty = 2 }) {
  for (let tries = 0; tries < 500; tries += 1) {
    const g = Array.from({ length: 5 }, () => randomInt(8, difficulty === 3 ? 30 : 22));
    if (Math.max(...g) > 3 * Math.min(...g)) continue;
    const xs = [0];
    g.forEach((v) => xs.push(xs.at(-1) + v));
    const pairs = [];
    for (let i = 0; i < 6; i += 1) for (let j = i + 2; j < 6; j += 1) pairs.push([i, j]);
    const chosen = shuffle(pairs).slice(0, 4);
    const ask = pick([[4, 5], [0, 1], [2, 3], [1, 2], [3, 4]]);
    if (chosen.some(([i, j]) => i === ask[0] && j === ask[1])) continue;
    const coef = solveCombination(chosen.map(([i, j]) => spanVector(i, j)), spanVector(ask[0], ask[1]));
    if (!coef) continue;
    const used = coef.filter((c) => c !== 0).length;
    if (used < 3) continue;
    // 다른 계수 조합으로도 같은 값 — 값은 하나로 정해진다(선형). 확인은 검사기에서 다시.
    const answer = xs[ask[1]] - xs[ask[0]];
    const spans = placeSpans([...chosen.map(([i, j]) => ({ i, j, label: xs[j] - xs[i] })), { i: ask[0], j: ask[1], blank: true }]);
    const terms = chosen.map(([i, j], k) => ({ c: coef[k], name: `${PT[i]}${PT[j]}`, v: xs[j] - xs[i] })).filter((t) => t.c !== 0);
    terms.sort((p, q) => q.c - p.c);
    const expr = terms.map((t, k) => `${k === 0 ? (t.c < 0 ? "−" : "") : t.c < 0 ? " − " : " + "}${t.v}`).join("");
    return {
      prompt: `수직선 위에 점 A, B, C, D, E, F가 차례로 있습니다. 그림의 거리를 보고 ${PT[ask[0]]}와 ${PT[ask[1]]} 사이의 거리를 구하세요.`,
      visual: { kind: "fig", html: pointLineSvg(xs, spans) },
      answer: String(answer),
      solution: `겹쳐 센 부분을 빼고 모자란 부분을 더해 구간을 맞춥니다. ${terms.map((t, k) => `${k === 0 ? "" : t.c < 0 ? " − " : " + "}(${t.name[0]}~${t.name[1]})`).join("")}을 하면 ${PT[ask[0]]}~${PT[ask[1]]}만 남으므로 ${expr} = ${answer}입니다.`,
      meta: { family: "six-point-overlap-b7", xs, given: chosen, ask, coef, answer }
    };
  }
  return null;
}

// ── 4단원 자리 바꾸기 ───────────────────────────────

function reversedPairs(diff) {
  const out = [];
  for (let n = 10; n <= 99; n += 1) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) continue;
    if (Math.abs(n - (o * 10 + t)) === diff) out.push(n);
  }
  return out;
}

function columnPairSvg(top, bottom, result) {
  const w = 120;
  let body = "";
  const cell = (v, x, y, shape) => {
    if (v === "□") return blankBox(x, y, 24, 24);
    if (v === "○") return `<circle cx="${x + 12}" cy="${y + 12}" r="12" style="fill:#fff;stroke:${ACCENT};stroke-width:1.4"/>`;
    return text(x + 12, y + 19, v, 17);
  };
  top.forEach((v, i) => { body += cell(v, 40 + i * 30, 6); });
  body += text(16, 52, "−", 17);
  bottom.forEach((v, i) => { body += cell(v, 40 + i * 30, 36); });
  body += `<line x1="10" y1="66" x2="104" y2="66" style="stroke:${INK};stroke-width:1.2"/>`;
  result.forEach((v, i) => { body += text(52 + i * 30, 90, v, 17); });
  return `${svgOpen(w, 98, "두 자리 수 뺄셈")}${body}</svg>`;
}

function reversedDiffBothWaysB7({ difficulty = 2 }) {
  const ks = shuffle([2, 3, 4, 5, 6, 7]).slice(0, difficulty === 1 ? 1 : 2);
  const items = ks.map((k) => ({ diff: 9 * k, list: reversedPairs(9 * k) }));
  return {
    prompt: "두 자리 수의 십의 자리 숫자와 일의 자리 숫자를 바꾸어 새로운 두 자리 수를 만들었습니다. 새로운 수와 원래 수의 차가 다음과 같을 때, 원래 수가 될 수 있는 두 자리 수를 모두 구하세요.",
    visual: { kind: "fig", html: wrapRow(items.map((it, i) => labeled(PARTS[i], columnPairSvg(["□", "○"], ["○", "□"], String(it.diff).split("")))) ) },
    answer: items.map((it, i) => `${PARTS[i]} ${it.list.join(", ")}`).join(" / "),
    solution: `자리를 바꾼 두 수의 차는 두 숫자의 차에 9를 곱한 것입니다. ${items.map((it, i) => `${PARTS[i]} ${it.diff} ÷ 9 = ${it.diff / 9}이므로 두 숫자의 차가 ${it.diff / 9}인 수 ${it.list.join(", ")}`).join(", ")}입니다(어느 쪽이 커도 됩니다).`,
    meta: { family: "reversed-diff-both-ways-b7", items }
  };
}

function reversedDigitGrowsB7({ difficulty = 2 }) {
  const t = randomInt(1, difficulty === 3 ? 7 : 6);
  const k = randomInt(1, 9 - t);
  const o = t + k;
  const n = t * 10 + o;
  const diff = 9 * k;
  return {
    prompt: `십의 자리 숫자가 ${t}인 두 자리 수가 있습니다. 십의 자리 숫자와 일의 자리 숫자를 서로 바꾸었더니 처음 수보다 ${diff}만큼 커졌습니다. 처음 수는 얼마인가요?`,
    visual: { kind: "fig", html: columnPairSvg(["□", String(t)], [String(t), "□"], String(diff).padStart(2, " ").split("").map((c) => (c === " " ? "" : c))) },
    answer: String(n),
    solution: `바꾼 수가 더 크므로 일의 자리 숫자가 ${t}보다 큽니다. 차 ${diff} ÷ 9 = ${k}이므로 일의 자리 숫자는 ${t} + ${k} = ${o}입니다. 처음 수는 ${n}이고 ${o * 10 + t} − ${n} = ${diff}입니다.`,
    meta: { family: "reversed-digit-grows-b7", t, o, n, diff }
  };
}

function reversedDiffSmallestB7() {
  const k = randomInt(1, 8);
  const diff = 9 * k;
  const list = reversedPairs(diff);
  return {
    prompt: `두 자리 수의 십의 자리 숫자와 일의 자리 숫자를 바꾸어 새로운 수를 만들었습니다. 새로운 수와 원래 수의 차가 ${diff}일 때, 원래 수가 될 수 있는 가장 작은 두 자리 수는 무엇인가요?`,
    visual: { kind: "fig", html: columnPairSvg(["□", "○"], ["○", "□"], String(diff).padStart(2, " ").split("").map((c) => (c === " " ? "" : c))) },
    answer: String(list[0]),
    solution: `두 숫자의 차는 ${diff} ÷ 9 = ${k}입니다. 가장 작은 수는 십의 자리를 가장 작은 1로 하고 일의 자리를 1 + ${k} = ${ro(1 + k)} 한 ${list[0]}입니다(바꾼 수 ${(1 + k) * 10 + 1}이 ${diff}만큼 큽니다).`,
    meta: { family: "reversed-diff-smallest-b7", diff, list, answer: list[0] }
  };
}

// ── 4단원 벤다이어그램·가지 그림 ────────────────────

function vennBoxSvg(labels, values) {
  const w = 300;
  const h = 196;
  let body = `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" style="fill:none;stroke:${ACCENT};stroke-width:1.2"/>`;
  body += `<circle cx="118" cy="104" r="56" style="fill:none;stroke:${ACCENT};stroke-width:1.2"/><circle cx="182" cy="104" r="56" style="fill:none;stroke:${ACCENT};stroke-width:1.2"/>`;
  body += textL(14, 26, `전체 ( ${values.total ?? " "} )`, 13);
  body += text(96, 50, `${labels[0]} ( ${values.a ?? " "} )`, 13);
  body += text(204, 50, `${labels[1]} ( ${values.b ?? " "} )`, 13);
  body += text(150, 186, `둘 다 아님 ( ${values.none ?? " "} )`, 13);
  return `${svgOpen(w, h, "두 모임 벤다이어그램")}${body}</svg>`;
}

function vennTotalNeitherExactlyOneB7({ difficulty = 2 }) {
  for (;;) {
    const both = randomInt(2, difficulty === 3 ? 15 : 10);
    const aOnly = randomInt(2, 15);
    const bOnly = randomInt(2, 15);
    const none = randomInt(1, 9);
    const total = both + aOnly + bOnly + none;
    if (total > 60) continue;
    const labels = pick([["사과", "배"], ["줄넘기", "달리기"], ["노래", "그림"], ["수영", "축구"]]);
    const A = aOnly + both;
    const B = bOnly + both;
    const one = aOnly + bOnly;
    return {
      prompt: `우리 반 ${total}명 가운데 ${obj(labels[0])} 좋아하는 학생은 ${A}명, ${obj(labels[1])} 좋아하는 학생은 ${B}명이고, 둘 다 좋아하지 않는 학생은 ${none}명입니다. 두 가지 가운데 한 가지만 좋아하는 학생은 모두 몇 명인가요?`,
      visual: { kind: "fig", html: vennBoxSvg(labels, {}) },
      answer: `${one}명`,
      solution: `적어도 하나를 좋아하는 학생은 ${total} − ${none} = ${total - none}명입니다. ${A} + ${B} = ${A + B}에서 둘 다 좋아하는 학생을 두 번 셌으므로 둘 다 좋아하는 학생은 ${A + B} − ${total - none} = ${both}명입니다. 한 가지만 좋아하는 학생은 ${total - none} − ${both} = ${one}명입니다.`,
      meta: { family: "venn-total-neither-one-b7", total, A, B, none, both, one }
    };
  }
}

// 가지 그림: 맨 앞 → 두 갈래 → (두 층이면) 각 두 갈래
function treeSvg(rootLabel, mid, leaves, values = {}) {
  const w = 380;
  const h = 210;
  const v = (k) => (values[k] !== undefined ? values[k] : " ");
  let body = `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="14" style="fill:none;stroke:${ACCENT};stroke-width:1.2"/>`;
  body += text(70, 100, rootLabel, 13) + text(70, 120, `( ${v("root")} )`, 13);
  const midY = [62, 150];
  midY.forEach((y, i) => {
    body += `<path d="M112 108 L140 ${y}" style="stroke:${INK};stroke-width:1;fill:none"/>`;
    body += text(176, y - 4, mid[i], 13) + text(176, y + 16, `( ${v(`m${i}`)} )`, 13);
    const ly = [y - 26, y + 26];
    ly.forEach((yy, k) => {
      body += `<path d="M214 ${y} L240 ${yy}" style="stroke:${INK};stroke-width:1;fill:none"/>`;
      body += textL(248, yy + 5, `${leaves[i][k]} ( ${v(`l${i}${k}`)} )`, 13);
    });
  });
  return `${svgOpen(w, h, "가지 그림")}${body}</svg>`;
}

function branchTreeTwoLevelB7({ difficulty = 2 }) {
  for (;;) {
    const gw = randomInt(3, 18); // 여학생 안경 씀
    const gn = randomInt(3, 18);
    const bw = randomInt(3, 18);
    const bn = randomInt(3, 18);
    const known = pick(["w", "n"]);
    const ask = difficulty === 1 ? "boys" : pick(["boys", "boys", "bw"]);
    const girls = gw + gn;
    const W = gw + bw;
    const N = gn + bn;
    const clues = [`여학생은 모두 ${girls}명입니다.`, known === "w" ? `안경을 쓴 여학생은 ${gw}명입니다.` : `안경을 안 쓴 여학생은 ${gn}명입니다.`, `안경을 안 쓴 학생은 ${N}명입니다.`, `안경을 쓴 학생은 ${W}명입니다.`];
    const result = ask === "boys" ? bw + bn : bw;
    const values = { m0: girls, l00: gw, l01: gn, l10: bw, l11: bn, m1: bw + bn, root: girls + bw + bn };
    return {
      prompt: `우리 반 아이들을 조사한 것입니다. ${shuffle(clues).join(" ")} 조건을 보고 ${ask === "boys" ? "남학생은 모두 몇 명인지" : "안경을 쓴 남학생은 몇 명인지"} 구하세요.`,
      visual: { kind: "fig", html: treeSvg("전체 학생", ["여학생", "남학생"], [["안경 씀", "안경 안 씀"], ["안경 씀", "안경 안 씀"]]) },
      answerVisual: { kind: "fig", html: treeSvg("전체 학생", ["여학생", "남학생"], [["안경 씀", "안경 안 씀"], ["안경 씀", "안경 안 씀"]], values) },
      responseKind: "visual-fill",
      answer: `${result}명`,
      solution: `여학생 ${girls}명 가운데 ${known === "w" ? `안경 쓴 학생이 ${gw}명이므로 안 쓴 여학생은 ${gn}명` : `안경 안 쓴 학생이 ${gn}명이므로 쓴 여학생은 ${gw}명`}입니다. 안경 쓴 남학생은 ${W} − ${gw} = ${bw}명, 안경 안 쓴 남학생은 ${N} − ${gn} = ${bn}명입니다. ${ask === "boys" ? `남학생은 ${bw} + ${bn} = ${bw + bn}명입니다.` : `안경을 쓴 남학생은 ${bw}명입니다.`}`,
      meta: { family: "branch-tree-two-level-b7", gw, gn, bw, bn, known, ask, result }
    };
  }
}

function branchTreeThreeLevelB7({ difficulty = 2 }) {
  for (;;) {
    const ms = randomInt(3, 14); // 남자 어린이
    const fs = randomInt(3, 14);
    const ma = randomInt(2, 14);
    const fa = randomInt(2, 14);
    const kids = ms + fs;
    const bag = randomInt(1, kids - 1);
    const total = kids + ma + fa;
    const male = ms + ma;
    const clues = [`남자는 ${male}명입니다.`, `남자 어린이는 ${ms}명입니다.`, `가방을 멘 어린이는 ${bag}명입니다.`, `가방을 메지 않은 어린이는 ${kids - bag}명입니다.`, `여자 가운데 어린이가 아닌 사람은 ${fa}명입니다.`];
    const values = { root: total, m0: kids, m1: ma + fa, l00: ms, l01: fs, l10: ma, l11: fa };
    return {
      prompt: `도서관 독서 모임에 온 어린이와 어른을 조사한 것입니다. ${clues.join(" ")} 독서 모임에 온 사람은 모두 몇 명인가요?`,
      visual: { kind: "fig", html: treeSvg("모임에 온 사람", ["어린이", "어른"], [["남", "여"], ["남", "여"]]) },
      answerVisual: { kind: "fig", html: treeSvg("모임에 온 사람", ["어린이", "어른"], [["남", "여"], ["남", "여"]], values) },
      responseKind: "visual-fill",
      answer: `${total}명`,
      solution: `어린이는 가방을 멘 어린이와 메지 않은 어린이를 더한 ${bag} + ${kids - bag} = ${kids}명입니다. 남자 ${male}명 가운데 어린이가 ${ms}명이므로 남자 어른은 ${ma}명이고, 여자 어른은 ${fa}명입니다. 모두 ${kids} + ${ma} + ${fa} = ${total}명입니다.`,
      meta: { family: "branch-tree-three-level-b7", ms, fs, ma, fa, bag, total }
    };
  }
}

function disjointGroupsRestB7({ difficulty = 2 }) {
  const [g1, g2] = pick([[3, 4], [4, 5], [5, 6], [2, 3]]);
  const a = randomInt(5, difficulty === 3 ? 30 : 18);
  const b = randomInt(5, difficulty === 3 ? 30 : 18);
  const c = randomInt(4, difficulty === 3 ? 25 : 15);
  const notA = b + c;
  const notB = a + c;
  const total = a + b + c;
  const rows = [["", `${g1}학년이 아닌 학생`, "= 나머지 + " + `${g2}학년`], ["", `${g2}학년이 아닌 학생`, "= 나머지 + " + `${g1}학년`]];
  void rows;
  const svg = (() => {
    const w = 360;
    const h = 116;
    let body = panel(w, h);
    body += textL(16, 30, `(${g1}학년 아님) + (${g2}학년 아님) + (${g1}·${g2}학년) =`, 13);
    body += blankBox(300, 14, 44, 24);
    body += textL(16, 66, "→ 이 합은 전체 학생을 몇 번 센 것일까요?", 13);
    body += textL(16, 100, "전체 학생 =", 13) + blankBox(100, 84, 44, 24);
    return `${svgOpen(w, h, "세 묶음 더하기")}${body}</svg>`;
  })();
  return {
    prompt: `우리 동아리 학생 가운데 ${notA}명은 ${g1}학년이 아니고, ${notB}명은 ${g2}학년이 아닙니다. ${g1}학년과 ${g2}학년 학생을 합하면 ${a + b}명일 때, 동아리 학생은 모두 몇 명인가요?`,
    visual: { kind: "fig", html: svg },
    answer: `${total}명`,
    solution: `동아리를 ${g1}학년, ${g2}학년, 나머지 학년으로 나누면 ${g1}학년이 아닌 학생은 ${g2}학년과 나머지, ${g2}학년이 아닌 학생은 ${g1}학년과 나머지입니다. 세 수를 더하면 모든 묶음을 두 번씩 센 것이므로 (${notA} + ${notB} + ${a + b}) ÷ 2 = ${total}명입니다.`,
    meta: { family: "disjoint-groups-rest-b7", a, b, c, notA, notB, total }
  };
}

// ── 4단원 거꾸로 더하기·495·카드 대칭수·바둑돌 ──────

const reverseNum = (n) => Number(String(n).split("").reverse().join(""));

function reverseAddChain(start, maxSteps = 6) {
  const steps = [];
  let n = start;
  for (let k = 0; k < maxSteps; k += 1) {
    const r = reverseNum(n);
    steps.push({ n, r, s: n + r });
    n += r;
    if (isPal(n)) return steps;
  }
  return null;
}

function reverseAddChainB7({ difficulty = 2 }) {
  const [lo, hi] = difficulty === 1 ? [2, 2] : difficulty === 2 ? [2, 4] : [3, 6];
  for (let tries = 0; tries < 600; tries += 1) {
    const start = Math.random() < 0.6 ? randomInt(12, 98) : randomInt(102, 989);
    if (start % 10 === 0 || isPal(start)) continue;
    const steps = reverseAddChain(start, 8);
    if (!steps || steps.length < lo || steps.length > hi) continue;
    const final = steps.at(-1).s;
    if (String(final).length > 5) continue;
    const digitsW = String(final).length;
    const cw = 22;
    const w = (digitsW + 2) * cw + 20;
    const draw = (fill) => {
      let body = "";
      let y = 6;
      steps.forEach((st, i) => {
        const nTxt = String(st.n);
        const rTxt = String(st.r).padStart(nTxt.length, "0");
        const put = (str, yy, blank) => str.split("").forEach((ch, k) => {
          const x = 20 + (digitsW + 1 - str.length + k) * cw;
          body += blank ? blankBox(x + 1, yy, cw - 3, 22) : text(x + cw / 2, yy + 17, ch, 16);
        });
        if (i === 0) put(nTxt, y, false);
        y += 26;
        body += text(12, y + 17, "+", 16);
        put(rTxt, y, i > 0 && !fill);
        y += 28;
        body += `<line x1="8" y1="${y - 3}" x2="${w - 4}" y2="${y - 3}" style="stroke:${INK};stroke-width:1.2"/>`;
        put(String(st.s), y, !fill);
        if (i < steps.length - 1) { /* 다음 줄의 위 수 = 이 합 */ }
      });
      return `${svgOpen(w, y + 30, "거꾸로 읽은 수를 더하는 세로셈")}${body}</svg>`;
    };
    return {
      prompt: `어떤 수에 그 수를 거꾸로 읽은 수를 더하는 일을 대칭수가 나올 때까지 되풀이합니다. ${ro(start)} 시작할 때 빈칸을 채우고 만들어진 대칭수를 구하세요.`,
      visual: { kind: "fig", html: draw(false) },
      answerVisual: { kind: "fig", html: draw(true) },
      responseKind: "visual-fill",
      answer: String(final),
      solution: `${steps.map((st) => `${st.n} + ${st.r} = ${st.s}`).join(", ")}이므로 대칭수 ${final}이 만들어집니다.`,
      meta: { family: "reverse-add-chain-b7", start, steps, final }
    };
  }
  return null;
}

function kaprekarChain(digits) {
  const chain = [];
  let cur = digits.join("");
  for (let k = 0; k < 10; k += 1) {
    const ds = String(cur).padStart(3, "0").split("").map(Number).sort((a, b) => b - a);
    const big = Number(ds.join(""));
    const small = Number([...ds].reverse().join(""));
    const r = big - small;
    chain.push({ big, small, r });
    if (r === Number(cur) || chain.length > 8) break;
    cur = r;
  }
  return chain;
}

function kaprekarFillB7({ difficulty = 2 }) {
  const sets = [];
  while (sets.length < (difficulty === 1 ? 2 : 3)) {
    const ds = [randomInt(0, 9), randomInt(0, 9), randomInt(1, 9)];
    if (new Set(ds).size === 1) continue;
    const key = [...ds].sort().join("");
    if (sets.some((s) => [...s].sort().join("") === key)) continue;
    sets.push(ds);
  }
  const chains = sets.map(kaprekarChain);
  const p3 = (v) => String(v).padStart(3, "0");
  return {
    prompt: "숫자 세 개를 정하고, 세 숫자로 만든 가장 큰 세 자리 수에서 가장 작은 수를 뺍니다. 나온 수의 숫자로 같은 일을 되풀이할 때 마지막에 계속 나오는 수를 구하세요. 가장 작은 수가 0으로 시작하면 0도 자리로 셉니다.",
    visual: { kind: "fig", html: palPatternSvg([], sets.map((s, i) => `${PARTS[i]} ${s.join(", ")}`)) },
    answer: chains.map((c, i) => `${PARTS[i]} ${c.map((x) => x.r).join(" → ")}`).join(" / "),
    solution: chains.map((c, i) => `${PARTS[i]} ${c.map((x) => `${x.big} − ${p3(x.small)} = ${p3(x.r)}`).join(", ")}`).join(" ") + " 모두 495에서 멈춥니다(954 − 459 = 495).",
    meta: { family: "kaprekar-fill-b7", sets, chains }
  };
}

function palindromeCardAdjacentB7({ difficulty = 2 }) {
  for (;;) {
    const maxCard = randomInt(4, 9);
    const diff = randomInt(1, difficulty === 3 ? 4 : 3);
    const list = [];
    for (let a = 1; a <= maxCard; a += 1) for (let b = 0; b <= maxCard; b += 1) if (Math.abs(a - b) === diff) list.push(a * 101 + b * 10);
    if (list.length < 3 || list.length > 12) continue;
    const cards = Array.from({ length: maxCard + 1 }, (_, i) => i);
    const w = cards.length * 32 + 8;
    const cardSvg = `${svgOpen(w, 46, "숫자 카드")}${cards.map((c, i) => `<rect x="${4 + i * 32}" y="4" width="26" height="36" rx="4" style="fill:#fff6d6;stroke:#a87c22;stroke-width:1.3"/>${text(17 + i * 32, 28, c, 16)}`).join("")}</svg>`;
    return {
      prompt: `숫자 카드 ${cards.join(", ")} 가운데에서 골라 이웃한 두 자리 숫자의 차가 ${diff}인 세 자리 대칭수를 만들려고 합니다. 같은 숫자 카드를 여러 번 써도 될 때, 만들 수 있는 수를 모두 구하세요.`,
      visual: { kind: "fig", html: cardSvg },
      answer: list.join(", "),
      solution: `세 자리 대칭수는 가나가 꼴이므로 가와 나의 차만 ${diff}이면 됩니다. 가는 1부터 ${maxCard}까지, 나는 0부터 ${maxCard}까지에서 차가 ${diff}인 것을 모두 찾으면 ${list.join(", ")}입니다.`,
      meta: { family: "palindrome-card-adjacent-b7", maxCard, diff, list }
    };
  }
}

// 삼각형 바둑돌을 거꾸로 세우기 — 두 삼각형이 가장 많이 겹치게 놓고 겹치지 않는 돌만 옮긴다
const triangular = (n) => (n * (n + 1)) / 2;
function stoneFlipMoves(n) {
  // 축 좌표: 바로 선 삼각형 {i ≥ 0, j ≥ 0, i + j ≤ n − 1}, 거꾸로 선 삼각형 {i ≤ a, j ≤ b, i + j ≥ a + b − (n − 1)}
  let best = 0;
  for (let a = -n; a <= 2 * n; a += 1) for (let b = -n; b <= 2 * n; b += 1) {
    let c = 0;
    for (let i = 0; i < n; i += 1) for (let j = 0; i + j < n; j += 1) if (i <= a && j <= b && i + j >= a + b - (n - 1)) c += 1;
    if (c > best) best = c;
  }
  return triangular(n) - best;
}

function stoneTriangleSvg(n, down = false) {
  const r = 5;
  const gap = 12;
  const w = n * gap + 8;
  const h = n * 10.5 + 8;
  let body = "";
  for (let row = 0; row < n; row += 1) {
    const count = down ? n - row : row + 1;
    for (let k = 0; k < count; k += 1) {
      const x = w / 2 + (k - (count - 1) / 2) * gap;
      const y = 6 + row * 10.5;
      body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:#2b2b2b;stroke:#111;stroke-width:0.8"/>`;
    }
  }
  return `${svgOpen(Math.ceil(w), Math.ceil(h), down ? "거꾸로 선 삼각형 바둑돌" : "바로 선 삼각형 바둑돌")}${body}</svg>`;
}

function stoneTriangleFlipB7({ difficulty = 2 }) {
  const startShown = randomInt(2, 3);
  const pool = Array.from({ length: (difficulty === 3 ? 8 : 7) - startShown }, (_, i) => startShown + 1 + i);
  const asked = shuffle(pool).slice(0, difficulty === 1 ? 2 : 3).sort((a, b) => a - b);
  const shown = [startShown];
  const rows = [...shown, ...asked];
  const moves = rows.map(stoneFlipMoves);
  const table = (fill) => {
    const rowH = 16 + Math.max(...rows) * 10.5;
    const w = 420;
    const h = rows.length * (rowH + 6) + 30;
    let body = `${textL(70, 18, "처음", 13)}${textL(200, 18, "거꾸로", 13)}${text(360, 18, "옮긴 개수", 13)}`;
    rows.forEach((n, i) => {
      const y = 28 + i * (rowH + 6);
      body += `<line x1="0" y1="${y - 3}" x2="${w}" y2="${y - 3}" style="stroke:#d8dccf;stroke-width:1"/>`;
      body += `<g transform="translate(60 ${y})">${stoneTriangleSvg(n).replace(/<svg[^>]*>/, "").replace("</svg>", "")}</g>`;
      body += `<g transform="translate(190 ${y})">${stoneTriangleSvg(n, true).replace(/<svg[^>]*>/, "").replace("</svg>", "")}</g>`;
      const known = i < shown.length || fill;
      body += known ? text(360, y + rowH / 2, `${moves[i]}개`, 15) : blankBox(340, y + rowH / 2 - 16, 40, 24);
    });
    return `${svgOpen(w, h, "삼각형 바둑돌 뒤집기 표")}${body}</svg>`;
  };
  return {
    prompt: "삼각형 모양으로 놓인 바둑돌 몇 개를 옮겨 거꾸로 선 삼각형을 만들려고 합니다. 가장 적게 옮길 때 옮기는 바둑돌의 개수를 표의 빈칸에 쓰세요.",
    visual: { kind: "fig", html: table(false) },
    answerVisual: { kind: "fig", html: table(true) },
    responseKind: "visual-fill",
    answer: asked.map((n, i) => `${triangular(n)}개짜리 ${moves[i + shown.length]}개`).join(", "),
    solution: `처음 삼각형과 거꾸로 선 삼각형을 가장 많이 겹치게 놓으면 가운데 돌은 그대로 두고 세 꼭짓점 쪽 돌만 옮기면 됩니다. ${rows.map((n, i) => `${triangular(n)}개일 때 ${moves[i]}개`).join(", ")}입니다.`,
    meta: { family: "stone-triangle-flip-b7", rows, moves, shown: shown.length }
  };
}


// ── 남은 번호(2차) — 거울 시계 정각, 세 원 모두 같은 합 ─────────────

// 1단원 도전 4: 거울에 비친 정각 시계 두 개로 잔 시간
function mirrorClockOclockB7({ difficulty = 2 }) {
  const sleepH = randomInt(difficulty === 1 ? 8 : 7, 11);
  const wakeH = randomInt(5, difficulty === 3 ? 9 : 8);
  const sleep12 = sleepH * 60;
  const wake12 = wakeH * 60;
  const mirror = (t) => mod(720 - t, 720);
  const hours = 12 - sleepH + wakeH;
  const shown = (t) => (mirror(t) / 60) || 12;
  return {
    prompt: "밤에 잠들 때와 아침에 일어날 때 거울에 비친 시계입니다. 두 시계 모두 정각을 가리킵니다. 잠을 잔 시간은 몇 시간인가요?",
    visual: { kind: "fig", html: wrapRow([[sleep12, "밤 · 거울"], [wake12, "아침 · 거울"]].map(([real, label]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><div style="transform:scaleX(-1)">${clockSvg(real)}</div><b style="font-size:14px">${label}</b></div>`)) },
    answer: `${hours}시간`,
    solution: `거울에 비친 시계는 좌우가 바뀌어 ${shown(sleep12)}시처럼 보이면 실제로는 ${sleepH}시, ${shown(wake12)}시처럼 보이면 실제로는 ${wakeH}시입니다(보이는 시 + 실제 시 = 12). 밤 ${sleepH}시부터 밤 12시까지 ${12 - sleepH}시간, 아침 ${wakeH}시까지 ${wakeH}시간 → ${hours}시간.`,
    meta: { family: "mirror-clock-oclock-b7", sleepH, wakeH, hours }
  };
}

// 4단원 연습 20: 세 원 모두 같은 합 — 가려진 두 칸 찾기
function threeCircleAllEqualSvg(v, shadeKeys) {
  const cells = { top: [210, 62], leftOverlap: [164, 125], rightOverlap: [256, 125], leftExclusive: [115, 205], rightExclusive: [305, 205] };
  const circle = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="78" style="fill:none;stroke:${ACCENT};stroke-width:2"/>`;
  const marks = Object.entries(cells).map(([k, [x, y]]) => (shadeKeys.includes(k)
    ? `<rect x="${x - 17}" y="${y - 20}" width="34" height="28" rx="4" style="fill:#f6d58a;stroke:${INK};stroke-width:1"/>${text(x, y, "?", 18, 'font-weight="700"')}`
    : text(x, y, v[k], 20, 'font-weight="700"'))).join("");
  return `${svgOpen(420, 290, "세 원의 합이 모두 같은 그림")}${circle(210, 92)}${circle(155, 175)}${circle(265, 175)}${marks}${text(210, 282, "세 원 안의 수의 합이 모두 같습니다", 14)}</svg>`;
}
function threeCircleAllEqualB7({ difficulty = 2 }) {
  for (;;) {
    const hi = difficulty === 3 ? 30 : 18;
    const leftOverlap = randomInt(2, hi);
    const rightOverlap = randomInt(2, hi);
    const top = randomInt(2, hi);
    const S = top + leftOverlap + rightOverlap;
    const leftExclusive = S - leftOverlap;
    const rightExclusive = S - rightOverlap;
    const v = { top, leftOverlap, rightOverlap, leftExclusive, rightExclusive };
    // 가릴 두 칸: 늘 아는 칸에서 S를 구할 수 있게(한 원은 다 보이게)
    const plans = [["top", "rightExclusive"], ["top", "leftExclusive"], ["leftExclusive", "rightExclusive"]];
    const hide = pick(plans);
    if (new Set(Object.values(v)).size < 4) continue;
    const name = { top: "위 원만의 칸", leftOverlap: "위·왼쪽이 겹친 칸", rightOverlap: "위·오른쪽이 겹친 칸", leftExclusive: "왼쪽 원만의 칸", rightExclusive: "오른쪽 원만의 칸" };
    const circles = { 위: ["top", "leftOverlap", "rightOverlap"], 왼쪽: ["leftOverlap", "leftExclusive"], 오른쪽: ["rightOverlap", "rightExclusive"] };
    const full = Object.entries(circles).find(([, ks]) => ks.every((k) => !hide.includes(k)));
    if (!full) continue;
    const steps = [`${full[0]} 원은 다 보이므로 한 원의 합 = ${full[1].map((k) => v[k]).join(" + ")} = ${S}`];
    for (const k of hide) {
      const [cname, ks] = Object.entries(circles).find(([, list]) => list.includes(k) && list.filter((x) => x !== k).every((x) => !hide.includes(x)));
      steps.push(`${cname} 원에서 ${name[k]} = ${S} − ${ks.filter((x) => x !== k).map((x) => v[x]).join(" − ")} = ${v[k]}`);
    }
    return {
      prompt: "세 원 안에 쓰인 수의 합이 세 원 모두 같습니다. 색칠한 두 칸에 알맞은 수를 구하세요.",
      visual: { kind: "fig", html: threeCircleAllEqualSvg(v, hide) },
      answer: hide.map((k) => `${name[k]} ${v[k]}`).join(", "),
      solution: `${steps.join(". ")}.`,
      meta: { family: "three-circle-all-equal-b7", values: v, hide, S }
    };
  }
}

// ── 내보내기 ─────────────────────────────────────────

export const BOOK07_STRUCTURE_GENERATORS = {
  mirrorClockOclockB7,
  threeCircleAllEqualB7,
  calendarDateChainB7,
  calendarRemainingDaysB7,
  elapsedTimeAmPmB7,
  timeColumnSheetB7,
  findEndTimeDrawB7,
  findStartTimeDrawB7,
  timeUnitMixedSheetB7,
  divisionLongCryptarithmB7,
  sequenceStripShadedB7,
  sequenceBlankStartNthB7,
  sequenceIndexTableB7,
  correctWrongZeroBaseB7,
  rectPerimeterTreeCountB7,
  loopTreeFlowerCountB7,
  loopSpacingFromCountB7,
  exchangeOnlyCountB7,
  doublingBeforeFullB7,
  doublingFrogWeedStepsB7,
  loopLampBenchPeopleB7,
  loopTotalTreesPerimeterB7,
  palindromeRangeDigitSumB7,
  monthDatePalindromeB7,
  datePalindromeCountRangeB7,
  fourPointOverlapB7,
  sixPointOverlapB7,
  reversedDiffBothWaysB7,
  reversedDigitGrowsB7,
  reversedDiffSmallestB7,
  vennTotalNeitherExactlyOneB7,
  branchTreeTwoLevelB7,
  branchTreeThreeLevelB7,
  disjointGroupsRestB7,
  reverseAddChainB7,
  kaprekarFillB7,
  palindromeCardAdjacentB7,
  stoneTriangleFlipB7
};

// 풀이기 확인용(검사기가 쓴다)
export const BOOK07_STRUCTURE_SOLVERS = { longDivisionSolutions, longDivisionDigits, stoneFlipMoves, reverseAddChain, kaprekarChain, solveCombination, spanVector };

const row = (id, domain, middle, label, generator, aliases) => ({ id, domain, middle, label, generator, searchAliases: aliases });

export const BOOK07_STRUCTURE_TYPE_ROWS = [
  // domain/middle은 같은 단원 기존 유형 값을 따른다
  row("calendar-date-chain-b7", "pattern", "달력과 시계", "달마다 같은 날짜로 건너가며 요일 찾기", "calendarDateChainB7", ["징검다리 달력", "같은 날짜", "요일 찾기"]),
  row("calendar-remaining-days-b7", "pattern", "달력과 시계", "남은 날 수와 날짜를 더해 요일 옮기기", "calendarRemainingDaysB7", ["남은 날", "7로 나눈 나머지", "요일 찾기"]),
  row("elapsed-time-am-pm-b7", "number", "달력과 시계", "오전에서 오후까지 걸린 시간 구하기", "elapsedTimeAmPmB7", ["오전 오후", "걸린 시간", "시간 세로셈"]),
  row("time-column-sheet-b7", "number", "달력과 시계", "시간의 덧셈과 뺄셈 세로셈 여섯 칸", "timeColumnSheetB7", ["받아올림", "받아내림", "60분"]),
  row("find-end-time-draw-b7", "number", "달력과 시계", "끝난 시각을 구해 빈 시계에 그리기", "findEndTimeDrawB7", ["끝난 시각", "시계 그리기"]),
  row("find-start-time-draw-b7", "number", "달력과 시계", "시작한 시각을 구해 빈 시계에 그리기", "findStartTimeDrawB7", ["시작한 시각", "시계 그리기"]),
  row("time-unit-mixed-sheet-b7", "number", "달력과 시계", "일·시간·분·초 섞인 단위 바꾸기", "timeUnitMixedSheetB7", ["단위 바꾸기", "시간과 분", "분과 초"]),
  row("division-long-cryptarithm-b7", "number", "거꾸로 풀기", "나눗셈 세로식 복면산 채우기", "divisionLongCryptarithmB7", ["나눗셈 복면산", "세로식 빈칸", "나누는 수 찾기"]),
  row("sequence-strip-shaded-b7", "pattern", "차가 같은 수열", "같은 수를 더하는 칸 띠에서 색칠한 칸 채우기", "sequenceStripShadedB7", ["수 띠", "같은 수 더하기", "색칠한 칸"]),
  row("sequence-blank-start-nth-b7", "pattern", "차가 같은 수열", "첫 수가 빈칸인 수열의 먼 번째 수", "sequenceBlankStartNthB7", ["첫 수 찾기", "몇 번째 수"]),
  row("sequence-index-table-b7", "pattern", "차가 같은 수열", "띄엄띄엄 값만 있는 순서표의 먼 칸", "sequenceIndexTableB7", ["순서표", "대응 규칙"]),
  row("correct-wrong-zero-base-b7", "logic", "가정하여 풀기", "기본 점수 없이 맞고 틀린 점수로 맞힌 수 구하기", "correctWrongZeroBaseB7", ["우기기", "맞히면 더하고 틀리면 빼기"]),
  row("rect-perimeter-tree-count-b7", "number", "가로수 심기", "직사각형 둘레에 같은 간격으로 심는 나무 수", "rectPerimeterTreeCountB7", ["직사각형 둘레", "꼭짓점에도 심기"]),
  row("loop-tree-flower-count-b7", "number", "가로수 심기", "원 둘레 나무 사이에 심는 꽃 수", "loopTreeFlowerCountB7", ["나무 사이 꽃", "m와 cm"]),
  row("loop-spacing-from-count-b7", "number", "가로수 심기", "둘레와 나무 수로 간격 구하기", "loopSpacingFromCountB7", ["간격 구하기", "닫힌 둘레"]),
  row("exchange-only-count-b7", "logic", "재치 있게 풀기", "빈 병으로 바꾸어 마신 음료 수", "exchangeOnlyCountB7", ["빈 병 바꾸기", "바꾼 병"]),
  row("doubling-before-full-b7", "pattern", "두 배 규칙", "가득 차기 며칠 전에 차지한 몫", "doublingBeforeFullB7", ["2배씩 늘어남", "하루 전은 반"]),
  row("doubling-frog-weed-steps-b7", "pattern", "두 배 규칙", "2배씩 자라는 풀의 네 물음", "doublingFrogWeedStepsB7", ["2배씩 자람", "처음 개수", "며칠 일찍"]),
  row("loop-lamp-bench-people-b7", "number", "가로수 심기", "가로등 사이 의자에 앉는 사람 수", "loopLampBenchPeopleB7", ["가로등 수", "의자", "앉는 사람"]),
  row("loop-total-trees-perimeter-b7", "number", "가로수 심기", "가로등 사이 나무 수로 둘레 구하기", "loopTotalTreesPerimeterB7", ["나무 수로 둘레", "가로등 사이 나무"]),
  row("palindrome-range-digit-sum-b7", "number", "팔린드롬", "범위 안에서 자리 합이 같은 세 자리 대칭수", "palindromeRangeDigitSumB7", ["대칭수", "자리 숫자의 합", "범위"]),
  row("month-date-palindrome-b7", "pattern", "팔린드롬", "한 달 날짜를 이어 쓴 대칭수", "monthDatePalindromeB7", ["날짜 대칭수", "이어 쓴 수"]),
  row("date-palindrome-count-range-b7", "pattern", "팔린드롬", "기간 안 네 자리 날짜 대칭수의 개수", "datePalindromeCountRangeB7", ["날짜 대칭수", "네 자리", "개수"]),
  row("four-point-overlap-b7", "geometry", "거리와 집합", "네 점의 겹친 거리 빈칸 채우기", "fourPointOverlapB7", ["겹친 거리", "수직선 위 점"]),
  row("six-point-overlap-b7", "geometry", "거리와 집합", "여섯 점의 여러 겹친 거리로 한 구간 찾기", "sixPointOverlapB7", ["겹친 거리", "여섯 점"]),
  row("reversed-diff-both-ways-b7", "number", "자리 바꾸기", "자리 바꾼 수와의 차로 두 방향 모든 수 찾기", "reversedDiffBothWaysB7", ["자리 바꾸기", "차가 9의 배수"]),
  row("reversed-digit-grows-b7", "number", "자리 바꾸기", "자리를 바꾸니 커진 수에서 처음 수 찾기", "reversedDigitGrowsB7", ["자리 바꾸기", "커진 만큼"]),
  row("reversed-diff-smallest-b7", "number", "자리 바꾸기", "자리 바꾼 차가 같은 가장 작은 두 자리 수", "reversedDiffSmallestB7", ["자리 바꾸기", "가장 작은 수"]),
  row("venn-total-neither-one-b7", "logic", "벤다이어그램", "전체와 둘 다 아닌 수로 한 가지만 좋아하는 수", "vennTotalNeitherExactlyOneB7", ["벤다이어그램", "한 가지만", "둘 다 아님"]),
  row("branch-tree-two-level-b7", "logic", "두 기준 분류", "두 기준 가지 그림 채우기", "branchTreeTwoLevelB7", ["가지 그림", "조건 정리"]),
  row("branch-tree-three-level-b7", "logic", "두 기준 분류", "세 기준 조건으로 가지 그림 채워 전체 구하기", "branchTreeThreeLevelB7", ["가지 그림", "세 기준"]),
  row("disjoint-groups-rest-b7", "logic", "집합과 포함", "겹치지 않는 두 무리와 나머지로 전체 구하기", "disjointGroupsRestB7", ["아닌 학생", "두 번 세기"]),
  row("reverse-add-chain-b7", "number", "팔린드롬", "거꾸로 읽은 수 더하기를 되풀이해 대칭수 만들기", "reverseAddChainB7", ["거꾸로 더하기", "대칭수 만들기"]),
  row("kaprekar-fill-b7", "number", "수의 규칙", "큰 수에서 작은 수 빼기를 되풀이해 마지막 수 찾기", "kaprekarFillB7", ["495", "되풀이"]),
  row("palindrome-card-adjacent-b7", "number", "팔린드롬", "숫자 카드로 이웃한 차가 같은 대칭수 만들기", "palindromeCardAdjacentB7", ["숫자 카드", "이웃한 차", "대칭수"]),
  row("stone-triangle-flip-b7", "logic", "도형 옮기기", "삼각형 바둑돌을 거꾸로 만드는 가장 적은 이동", "stoneTriangleFlipB7", ["바둑돌 뒤집기", "가장 적게 옮기기"]),
  row("mirror-clock-oclock-b7", "logic", "거울 시계", "거울에 비친 정각 시계 두 개로 잔 시간 구하기", "mirrorClockOclockB7", ["거울 시계", "정각"]),
  row("three-circle-all-equal-b7", "number", "수 배열과 합", "세 원 모두 합이 같을 때 가려진 두 칸 구하기", "threeCircleAllEqualB7", ["세 원", "같은 합"])
];

export const BOOK07_STRUCTURE_GUIDES = {
  "mirror-clock-oclock-b7": "거울 시계는 좌우가 바뀝니다. 보이는 시와 실제 시를 더하면 12이므로 실제 시각을 먼저 구합니다.",
  "three-circle-all-equal-b7": "다 보이는 원 하나로 한 원의 합을 구하고, 가려진 칸이 하나뿐인 원에서 차례로 뺍니다.",
  "calendar-date-chain-b7": "같은 날짜끼리 다음 달로 건너면 앞 달의 날 수만큼 지나고, 마지막 칸은 날짜의 차(또는 남은 날 + 날짜)만큼 지납니다. 날 수를 7로 나눈 나머지만큼 요일을 옮깁니다.",
  "calendar-remaining-days-b7": "앞 달의 남은 날 수에 다음 달 날짜를 더해 며칠 뒤인지 구하고, 7로 나눈 나머지만큼 요일을 옮깁니다.",
  "elapsed-time-am-pm-b7": "오후 시각은 12를 더한 시로 바꾸어 끝난 시각에서 시작한 시각을 빼고, 분이 모자라면 1시간을 60분으로 바꿉니다.",
  "time-column-sheet-b7": "분끼리 더해 60분이 넘으면 1시간으로 올리고, 분끼리 뺄 수 없으면 1시간을 60분으로 내려 계산합니다.",
  "find-end-time-draw-b7": "시작한 시각에 걸린 시간을 더해 끝난 시각을 구하고, 긴 바늘은 분 자리에 짧은 바늘은 그 시를 지난 자리에 그립니다.",
  "find-start-time-draw-b7": "나온 시각에서 머문 시간을 빼 들어간 시각을 구하고, 긴 바늘과 짧은 바늘을 차례로 그립니다.",
  "time-unit-mixed-sheet-b7": "큰 단위를 작은 단위로 바꿀 때는 곱하고(1일 = 24시간, 1시간 = 60분, 1분 = 60초), 작은 단위를 큰 단위로 바꿀 때는 나눕니다.",
  "division-long-cryptarithm-b7": "몫의 각 자리와 나누는 수의 곱이 아래 줄에 오고 빼고 남은 수에 다음 자리를 내린다는 것을 써서, 보이는 숫자가 많은 줄부터 맞춥니다.",
  "sequence-strip-shaded-b7": "보이는 두 수의 차를 그 사이에서 더한 횟수로 나누어 한 번에 더하는 수를 찾고, 색칠한 칸까지 더합니다.",
  "sequence-blank-start-nth-b7": "보이는 두 수의 차를 칸 수로 나누어 더하는 수를 찾고, 거꾸로 빼서 첫 수를 구한 뒤 (몇 번째 − 1)번 더합니다.",
  "sequence-index-table-b7": "값이 보이는 두 칸의 차를 순서의 차로 나누어 한 칸에 커지는 수를 찾고, 첫 수에 (순서 − 1)번 더합니다.",
  "correct-wrong-zero-base-b7": "모두 맞혔다고 우기고 실제 점수와의 차를 한 문제를 틀림으로 바꿀 때 줄어드는 점수(얻는 점수 + 잃는 점수)로 나눕니다.",
  "rect-perimeter-tree-count-b7": "직사각형 둘레를 구해 간격으로 나눕니다. 둘레를 한 바퀴 도는 길은 나무 수와 간격 수가 같습니다.",
  "loop-tree-flower-count-b7": "나무 수 = 나무 사이 수 = 둘레 ÷ 나무 간격이고, 나무 사이 한 곳의 꽃은 (나무 간격 ÷ 꽃 간격 − 1)송이입니다. 단위는 cm로 맞춥니다.",
  "loop-spacing-from-count-b7": "닫힌 둘레에서는 간격 수가 나무 수와 같으므로 둘레를 나무 수로 나눕니다.",
  "exchange-only-count-b7": "빈 병을 바꾸고, 새로 마신 병과 남은 병을 합쳐 더 바꿀 수 없을 때까지 되풀이하며 바꾼 병만 셉니다.",
  "doubling-before-full-b7": "하루 전으로 갈 때마다 반이 되므로 며칠 전인지만큼 반으로 줄입니다.",
  "doubling-frog-weed-steps-b7": "하루 전은 반이므로, 며칠 일찍 가득 채우려면 처음 개수를 그 날 수만큼 2배씩 늘립니다.",
  "loop-lamp-bench-people-b7": "닫힌 둘레의 가로등 수는 둘레 ÷ 간격이고, 가로등 사이도 그만큼이므로 한 곳에 앉는 사람 수를 곱합니다.",
  "loop-total-trees-perimeter-b7": "나무 수를 한 곳의 나무 수로 나누어 가로등 사이 수를 찾고, 한 곳의 간격 수(나무 수 + 1)와 간격 길이를 곱합니다.",
  "palindrome-range-digit-sum-b7": "가나가 꼴이므로 가 + 가 + 나 = 합이고, 범위가 정하는 백의 자리 가부터 하나씩 넣어 봅니다.",
  "month-date-palindrome-b7": "월로 시작하는 수이므로 끝자리도 그 숫자여야 합니다. 이어 쓴 수를 거꾸로 읽어 같은 날만 고릅니다.",
  "date-palindrome-count-range-b7": "네 자리 대칭수에서는 월 두 자리를 거꾸로 쓴 수가 일이 되므로, 달마다 그 날이 있는지만 봅니다.",
  "four-point-overlap-b7": "(A~C) + (B~D) = (A~D) + (B~C)처럼 겹친 부분을 두 번 센 만큼 빼거나 더합니다.",
  "six-point-overlap-b7": "주어진 구간들을 더하고 빼서 겹쳐 센 부분을 지우고 구하는 구간만 남깁니다.",
  "reversed-diff-both-ways-b7": "자리를 바꾼 두 수의 차는 두 숫자의 차 × 9이므로, 차 ÷ 9만큼 차이 나는 두 숫자를 모두 찾습니다.",
  "reversed-digit-grows-b7": "바꾼 수가 커졌으면 일의 자리 숫자가 더 크고, 커진 만큼 ÷ 9가 두 숫자의 차입니다.",
  "reversed-diff-smallest-b7": "차 ÷ 9가 두 숫자의 차이므로 십의 자리를 가장 작은 1로 정하고 일의 자리를 그만큼 크게 합니다.",
  "venn-total-neither-one-b7": "전체에서 둘 다 아닌 수를 빼 적어도 하나인 수를 구하고, 두 모임의 합에서 그 수를 빼 둘 다인 수를 찾습니다.",
  "branch-tree-two-level-b7": "가지 그림의 칸을 조건으로 채우고, 합에서 아는 칸을 빼 모르는 칸을 차례로 구합니다.",
  "branch-tree-three-level-b7": "다른 기준으로 나눈 두 수를 더해 한 가지의 합을 구하고, 가지 그림의 남은 칸을 빼서 채웁니다.",
  "disjoint-groups-rest-b7": "「가가 아닌 수」 + 「나가 아닌 수」 + 「가와 나의 합」은 세 묶음을 두 번씩 센 것이므로 2로 나눕니다.",
  "reverse-add-chain-b7": "수를 거꾸로 읽은 수를 더하고, 대칭수가 될 때까지 합으로 같은 일을 되풀이합니다.",
  "kaprekar-fill-b7": "숫자를 큰 차례·작은 차례로 늘어놓아 빼고, 나온 세 자리(0 포함)로 되풀이하면 495에서 멈춥니다.",
  "palindrome-card-adjacent-b7": "세 자리 대칭수는 가나가 꼴이므로 가와 나의 차만 맞추면 되고, 가는 0이 될 수 없습니다.",
  "stone-triangle-flip-b7": "처음 모양과 거꾸로 선 모양을 가장 많이 겹치게 놓고, 겹치지 않는 세 꼭짓점 쪽 돌만 옮깁니다."
};

export const BOOK07_STRUCTURE_REMAPS = [
  ["book-07", 1, "advanced", 1, [4], "mirror-clock-oclock-b7"],
  ["book-07", 4, "practice", 1, [20], "three-circle-all-equal-b7"],
  // 1단원 — 달력 징검다리 · 남은 날 + 날짜
  ["book-07", 1, "activity", 1, [3, 4, 5, 6], "calendar-date-chain-b7"],
  ["book-07", 1, "check", 1, [2, 3], "calendar-date-chain-b7"],
  ["book-07", 1, "practice", 1, [4, 5, 7, 8], "calendar-date-chain-b7"],
  ["book-07", 1, "check", 1, [1], "calendar-remaining-days-b7"],
  ["book-07", 1, "practice", 1, [6], "calendar-remaining-days-b7"],
  // 1단원 — 시계(오전 → 오후 · 세로셈 판 · 그리기 · 섞인 단위)
  ["book-07", 1, "activity", 2, [3], "elapsed-time-am-pm-b7"],
  ["book-07", 1, "check", 2, [4], "elapsed-time-am-pm-b7"],
  ["book-07", 1, "practice", 1, [16], "elapsed-time-am-pm-b7"],
  ["book-07", 1, "activity", 2, [4], "time-column-sheet-b7"],
  ["book-07", 1, "check", 2, [1], "find-end-time-draw-b7"],
  ["book-07", 1, "practice", 1, [13], "find-end-time-draw-b7"],
  ["book-07", 1, "check", 2, [2], "find-start-time-draw-b7"],
  ["book-07", 1, "practice", 1, [14], "find-start-time-draw-b7"],
  ["book-07", 1, "practice", 1, [9], "time-unit-mixed-sheet-b7"],
  // 2단원 — 나눗셈 복면산 · 수열 셋 · 기본 점수 0
  ["book-07", 2, "activity", 2, [1], "division-long-cryptarithm-b7"],
  ["book-07", 2, "practice", 1, [5], "division-long-cryptarithm-b7"],
  ["book-07", 2, "activity", 2, [6], "sequence-strip-shaded-b7"],
  ["book-07", 2, "practice", 1, [9], "sequence-strip-shaded-b7"],
  ["book-07", 2, "check", 2, [3], "sequence-blank-start-nth-b7"],
  ["book-07", 2, "practice", 1, [12], "sequence-blank-start-nth-b7"],
  ["book-07", 2, "check", 2, [1, 2], "sequence-index-table-b7"],
  ["book-07", 2, "practice", 1, [10, 11], "sequence-index-table-b7"],
  ["book-07", 2, "check", 3, [1], "correct-wrong-zero-base-b7"],
  // 3단원 — 둘레 나무 · 나무 사이 꽃 · 간격 · 바꾼 병 · 2배
  ["book-07", 3, "check", 2, [1], "rect-perimeter-tree-count-b7"],
  ["book-07", 3, "practice", 1, [14], "rect-perimeter-tree-count-b7"],
  ["book-07", 3, "check", 2, [3, 4], "loop-tree-flower-count-b7"],
  ["book-07", 3, "practice", 1, [16, 17], "loop-tree-flower-count-b7"],
  ["book-07", 3, "practice", 1, [15], "loop-spacing-from-count-b7"],
  ["book-07", 3, "practice", 1, [6], "exchange-only-count-b7"],
  ["book-07", 3, "practice", 1, [9], "doubling-before-full-b7"],
  ["book-07", 3, "check", 1, [3], "doubling-frog-weed-steps-b7"],
  ["book-07", 3, "advanced", 1, [1], "loop-lamp-bench-people-b7"],
  ["book-07", 3, "advanced", 1, [2], "loop-total-trees-perimeter-b7"],
  // 4단원 — 대칭수 · 겹친 거리 · 자리 바꾸기 · 벤·가지 그림 · 되풀이 · 바둑돌
  ["book-07", 4, "activity", 1, [2], "palindrome-range-digit-sum-b7"],
  ["book-07", 4, "activity", 1, [4], "month-date-palindrome-b7"],
  ["book-07", 4, "practice", 1, [5], "date-palindrome-count-range-b7"],
  ["book-07", 4, "activity", 2, [1], "four-point-overlap-b7"],
  ["book-07", 4, "practice", 1, [12], "four-point-overlap-b7"],
  ["book-07", 4, "advanced", 1, [2], "six-point-overlap-b7"],
  ["book-07", 4, "check", 1, [1], "reversed-diff-both-ways-b7"],
  ["book-07", 4, "check", 1, [4, 5], "reversed-digit-grows-b7"],
  ["book-07", 4, "practice", 1, [9], "reversed-digit-grows-b7"],
  ["book-07", 4, "practice", 1, [8], "reversed-diff-smallest-b7"],
  ["book-07", 4, "check", 2, [2], "venn-total-neither-one-b7"],
  ["book-07", 4, "check", 2, [3], "branch-tree-two-level-b7"],
  ["book-07", 4, "practice", 1, [19], "branch-tree-two-level-b7"],
  // 연습 19(가지 그림)·20(세 원)이 서로 바뀌어 이어져 있었다 — 20은 이미 있는 세 원 유형으로
  ["book-07", 4, "practice", 1, [20], "three-circle-equal-sum-b7"],
  ["book-07", 4, "check", 2, [4], "branch-tree-three-level-b7"],
  ["book-07", 4, "advanced", 1, [3], "disjoint-groups-rest-b7"],
  ["book-07", 4, "practice", 1, [1, 2], "reverse-add-chain-b7"],
  ["book-07", 4, "advanced", 1, [5], "reverse-add-chain-b7"],
  ["book-07", 4, "practice", 1, [11], "kaprekar-fill-b7"],
  ["book-07", 4, "advanced", 1, [1], "palindrome-card-adjacent-b7"],
  ["book-07", 4, "advanced", 1, [6], "stone-triangle-flip-b7"]
];
