// 7권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문항 글·수·이름·그림 배치는 원문 시험지 그대로, 그림은 우리 색표(kit.js)로 새로 그린다. 정답은 두지 않는다(비공개 DB).
import { UT, esc, text, svg, box, line, conditionsBox } from "./kit.js?v=20261028ze";

// ── 공용 조각 ──
const STONE = { fill: "#ffd45c", stroke: "#a8741a" }; // 세는 점·바둑돌
const STICK = { body: "#bf8a42", head: "#df4c43" }; // 성냥개비
const top = (inner) => `<div style="align-self:start;justify-self:center;width:100%;padding-top:6px">${inner}</div>`;
const stone = (x, y, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${STONE.fill}" stroke="${STONE.stroke}" stroke-width="1.6"/>`;
const dotted = (x1, y1, x2, y2, width = 2) => line(x1, y1, x2, y2, { stroke: UT.line, width, dash: `1 ${width * 2.4}` });
const blockArrow = (x, y, length = 60, half = 14) => {
  const body = half * 0.45, head = half * 1.3;
  return `<path d="M${x} ${y - body}H${x + length - head}V${y - half}L${x + length} ${y}L${x + length - head} ${y + half}V${y + body}H${x}Z" fill="${UT.cut}"/>`;
};
// 문장으로 된 정보 상자(원문의 하늘색 상자 대신 종이색 상자)
const paperBox = (inner, maxWidth = 420) => `<div style="display:grid;place-items:center;width:100%"><div style="width:min(100%,${maxWidth}px);padding:10px 16px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;color:${UT.ink};box-sizing:border-box">${inner}</div></div>`;

// ── 시계: 숫자판·눈금·바늘(시침 빨강 짧게, 분침 파랑 길게). mirror 면 거울에 비친 모습(판 전체 좌우 뒤집기) ──
function clock(cx, cy, r, { hour = null, minute = null, mirror = false } = {}) {
  const rim = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${UT.line}" stroke-width="${r * 0.08}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="none" stroke="${UT.soft}" stroke-width="1"/>`;
  let ticks = "";
  for (let i = 0; i < 60; i += 1) {
    const a = (i * 6 - 90) * Math.PI / 180;
    const outer = r * 0.9, inner = i % 5 ? r * 0.84 : r * 0.78;
    ticks += line(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, cx + Math.cos(a) * outer, cy + Math.sin(a) * outer, { stroke: UT.ink, width: i % 5 ? 0.8 : 1.6 });
  }
  let numbers = "";
  for (let n = 1; n <= 12; n += 1) {
    const a = (n * 30 - 90) * Math.PI / 180;
    numbers += text(cx + Math.cos(a) * r * 0.64, cy + Math.sin(a) * r * 0.64, n, { size: r * 0.19, weight: 600 });
  }
  const hand = (deg, length, width, color) => {
    const a = (deg - 90) * Math.PI / 180;
    const ex = cx + Math.cos(a) * length, ey = cy + Math.sin(a) * length;
    const bx = cx + Math.cos(a) * (length - width * 2.2), by = cy + Math.sin(a) * (length - width * 2.2);
    const px = -Math.sin(a) * width * 1.3, py = Math.cos(a) * width * 1.3;
    return line(cx, cy, bx, by, { stroke: color, width }) + `<path d="M${ex} ${ey}L${bx + px} ${by + py}L${bx - px} ${by - py}Z" fill="${color}"/>`;
  };
  let hands = "";
  if (hour !== null) {
    hands += hand((hour % 12) * 30 + minute * 0.5, r * 0.5, r * 0.065, UT.red);
    hands += hand(minute * 6, r * 0.76, r * 0.045, UT.blue);
  }
  const pin = `<circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${UT.ink}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.03}" fill="#fff"/>`;
  const body = rim + ticks + numbers + hands + pin;
  return mirror ? `<g transform="translate(${2 * cx} 0) scale(-1 1)">${body}</g>` : body;
}

function clocksFigure(v) {
  if (v.layout === "titles-above") {
    // 3번: 위에 제목, 시계 둘 나란히
    const body = v.clocks.map((c, i) => {
      const cx = 128 + i * 249;
      return text(cx, 22, c.label, { size: 19, weight: 600 }) + clock(cx, 130, 82, c);
    }).join("");
    return svg(505, 222, "시계 두 개", body, 400);
  }
  if (v.layout === "arrow") {
    // 4번: 시작 시계 → 빈 시계, 아래에 이름
    const body = clock(104, 92, 82, v.clocks[0]) + blockArrow(206, 93, 80, 12) + clock(388, 92, 82, v.clocks[1])
      + text(104, 205, v.clocks[0].label, { size: 19, weight: 600 }) + text(388, 205, v.clocks[1].label, { size: 19, weight: 600 });
    return svg(492, 222, "시작 시계와 끝난 시계", body, 400);
  }
  // 21번: 거울에 비친 시계 둘, 아래에 이름
  const body = v.clocks.map((c, i) => {
    const cx = 107 + i * 274;
    return clock(cx, 103, 92, c) + text(cx, 217, c.label, { size: 19, weight: 600 });
  }).join("");
  return svg(490, 236, "거울에 비친 시계 두 개", body, 400);
}
// 답안용: 시계 하나(이름 아래)
function clockAnswer(v) {
  return svg(200, 210, v.label || "시계", clock(100, 92, 82, v) + text(100, 196, v.label || "", { size: 17, weight: 600 }), 180);
}

// ── 수의 나열(6·7번) ──
const sequenceFigure = (v) => paperBox(`<p style="margin:0;text-align:center;font-size:17px;font-weight:600;letter-spacing:0.02em">${esc(v.terms.join(", "))}, …</p>`, 260);

// ── 성냥개비 오각형(지붕 둘 · 벽 · 바닥) — 머리 위치는 원문 그대로 ──
function matchFigure(v) {
  const count = v.count, w = 62, left = 14, wallTop = 76, wallBottom = 134, apexY = 16, floorY = 140;
  const sticks = [];
  const stick = (x1, y1, x2, y2, headAtEnd) => sticks.push({ x1, y1, x2, y2, headAtEnd });
  for (let i = 0; i <= count; i += 1) {
    const x = left + i * w;
    stick(x, i === 0 ? wallTop : wallTop + 3, x, i === 0 ? wallBottom : wallBottom, i === 0); // 벽: 맨 왼쪽만 머리가 아래
  }
  for (let i = 0; i < count; i += 1) {
    const x = left + i * w, ax = x + w / 2;
    stick(ax - 2, apexY + 2, x + 1, wallTop - 1, true); // 왼쪽 지붕: 머리가 아래 끝
    stick(ax + 2, apexY + 2, x + w - 1, wallTop - 1, false); // 오른쪽 지붕: 머리가 꼭대기
    stick(x + 5, floorY, x + w - 4, floorY, true); // 바닥: 머리가 오른쪽
  }
  const body = sticks.map(({ x1, y1, x2, y2, headAtEnd }) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const hx = headAtEnd ? x2 - ux * 4 : x1 + ux * 4, hy = headAtEnd ? y2 - uy * 4 : y1 + uy * 4;
    const angle = Math.atan2(uy, ux) * 180 / Math.PI;
    return line(x1, y1, x2, y2, { stroke: STICK.body, width: 4.2 })
      + `<ellipse cx="${hx}" cy="${hy}" rx="6" ry="4.4" transform="rotate(${angle} ${hx} ${hy})" fill="${STICK.head}"/>`;
  }).join("");
  return svg(left * 2 + count * w, floorY + 12, "성냥개비로 이어 만든 오각형 다섯 개", body, 400);
}

// ── 바둑돌 정삼각형(13번) ──
function stoneTriangle() {
  const s = (x, y) => stone(x - 170, y - 172, 10);
  const body = dotted(278 - 170, 236 - 172, 214 - 170, 346 - 172) + dotted(330 - 170, 236 - 172, 395 - 170, 346 - 172) + dotted(240 - 170, 390 - 172, 368 - 170, 390 - 172)
    + [[305, 190], [288, 218], [321, 218], [205, 361], [189, 390], [222, 390], [403, 361], [387, 390], [420, 390]].map(([x, y]) => s(x, y)).join("");
  return svg(270, 232, "바둑돌을 늘어놓아 만든 정삼각형", body, 190);
}

// ── 정육각형 땅(14번) ──
function hexagonField() {
  const points = [[63, 10], [175, 10], [228, 105], [175, 200], [63, 200], [9, 105]].map((p) => p.join(",")).join(" ");
  return svg(238, 210, "정육각형 모양의 땅", `<polygon points="${points}" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="2" stroke-linejoin="round"/>`, 160);
}

// ── 바둑돌 정육각형 → 정사각형(23번) ──
function stoneHexToSquare() {
  const hex = [[133, 38], [170, 38], [296, 38], [334, 38], [114, 72], [352, 72], [50, 180], [32, 213], [52, 246], [418, 180], [436, 213], [418, 246], [114, 352], [133, 386], [170, 386], [296, 386], [334, 386], [352, 352]];
  const sq = [[641, 55], [690, 55], [893, 55], [943, 55], [641, 105], [943, 105], [641, 308], [943, 308], [641, 358], [690, 358], [893, 358], [943, 358]];
  const lines = [[190, 38, 278, 38], [100, 94, 62, 160], [366, 94, 406, 160], [62, 266, 100, 332], [406, 266, 366, 332], [190, 386, 278, 386],
    [727, 55, 857, 55], [641, 140, 641, 272], [943, 140, 943, 272], [727, 358, 857, 358]];
  const body = lines.map(([a, b, c, d]) => dotted(a, b, c, d, 4)).join("") + blockArrow(486, 213, 84, 24)
    + [...hex, ...sq].map(([x, y]) => stone(x, y, 17)).join("");
  return svg(980, 420, "바둑돌 정육각형을 정사각형으로 다시 늘어놓기", `<g transform="translate(4 4)">${body}</g>`, 440);
}

// ── 규칙 표(16번) ──
function ruleTable(v) {
  const cw = 77, ch = 57, cols = v.rows[0].length;
  let body = "";
  v.rows.forEach((row, r) => row.forEach((value, c) => {
    body += box(2 + c * cw, 2 + r * ch, cw, ch, { radius: 0, stroke: UT.box, width: 1.6, fill: r === 0 ? UT.tint : UT.boxFill });
    body += text(2 + c * cw + cw / 2, 2 + r * ch + ch / 2, value, { size: 17, weight: 600 });
  }));
  return svg(cols * cw + 4, v.rows.length * ch + 4, "규칙 표", body, 440);
}

// ── 시각을 수로(18번) ──
function timeNumberBox(v) {
  const cells = v.pairs.map(([time, value]) => `<span style="white-space:nowrap">${esc(time)} → ${esc(value)}</span>`).join("");
  return paperBox(`<div style="display:grid;grid-template-columns:repeat(2,max-content);justify-content:space-between;gap:8px 22px;font-size:15px;font-weight:600;line-height:1.4">${cells}</div>`, 420);
}

// ── 두 자리 수 뺄셈(□○ − ○□ = 63, 19번) ──
function digitSubtraction(v) {
  const sq = (x, y) => box(x, y, 54, 54, { fill: UT.blueSoft, stroke: UT.blue, width: 2, radius: 2 });
  const ci = (x, y) => `<circle cx="${x}" cy="${y}" r="27" fill="${UT.redSoft}" stroke="${UT.red}" stroke-width="2"/>`;
  const body = sq(72, 16) + ci(165, 43) + text(33, 111, "−", { size: 26, weight: 600 }) + ci(99, 109) + sq(138, 83)
    + line(17, 148, 203, 148, { stroke: UT.ink, width: 1.8 }) + text(99, 188, v.result[0], { size: 28, weight: 600 }) + text(165, 188, v.result[1], { size: 28, weight: 600 });
  return svg(220, 210, "□○에서 ○□를 빼는 세로셈", body, 175);
}

// ── 벤 다이어그램(20번). values 가 있으면 빈칸에 수를 적는다(답안용) ──
function vennFigure(v) {
  const val = v.values || {};
  const slot = (name, key) => `${name} ( ${val[key] ?? "  "} )`;
  const tab = (x, y, w, h, label) => box(x, y, w, h, { fill: UT.card, stroke: UT.cardLine, width: 1.4, radius: 8 }) + text(x + w / 2, y + h / 2 + 1, label, { size: 18, weight: 600 });
  const body = `<rect x="12" y="45" width="478" height="347" fill="#fff" stroke="${UT.line}" stroke-width="1.8"/>`
    + `<ellipse cx="183" cy="205" rx="112" ry="92" fill="${UT.greenSoft}" fill-opacity="0.7" stroke="${UT.green}" stroke-width="2"/>`
    + `<ellipse cx="319" cy="205" rx="112" ry="92" fill="${UT.blueSoft}" fill-opacity="0.7" stroke="${UT.blue}" stroke-width="2"/>`
    + `<ellipse cx="183" cy="205" rx="112" ry="92" fill="none" stroke="${UT.green}" stroke-width="2"/>`
    + tab(32, 13, 174, 60, slot("전체", "total")) + tab(94, 94, 133, 44, slot("곤충", "a")) + tab(259, 94, 148, 44, slot("물고기", "b"))
    + tab(159, 316, 231, 60, slot("둘 다 싫음", "none"))
    + (val.both !== undefined ? text(251, 210, val.both, { size: 22, weight: 800 }) : "");
  return svg(502, 404, "곤충과 물고기를 좋아하는 학생 벤 다이어그램", body, 400);
}

export function figure(visual) {
  if (!visual || visual.type === "none") return `<div aria-hidden="true" style="height:0"></div>`;
  let inner = "";
  if (visual.type === "clocks") inner = clocksFigure(visual);
  else if (visual.type === "clock") inner = clockAnswer(visual);
  else if (visual.type === "sequence") inner = sequenceFigure(visual);
  else if (visual.type === "matchsticks") inner = matchFigure(visual);
  else if (visual.type === "stone-triangle") inner = stoneTriangle();
  else if (visual.type === "hexagon-field") inner = hexagonField();
  else if (visual.type === "stone-hex-square") inner = stoneHexToSquare();
  else if (visual.type === "rule-table") inner = ruleTable(visual);
  else if (visual.type === "conditions") inner = conditionsBox(visual.clues);
  else if (visual.type === "time-number") inner = timeNumberBox(visual);
  else if (visual.type === "digit-subtraction") inner = digitSubtraction(visual);
  else if (visual.type === "venn") inner = vennFigure(visual);
  return inner ? top(inner) : `<div aria-hidden="true" style="height:0"></div>`;
}

const NONE = { type: "none" };
const ORIGINALS = {
  1: { prompt: "어느 해 7월 15일은 월요일입니다. 같은 해 광복절(8월 15일)은 무슨 요일입니까?", visual: NONE },
  2: { prompt: "어느 해 6월 26일은 월요일입니다. 같은 해 9월 14일은 무슨 요일입니까?", visual: NONE },
  3: {
    prompt: "다음은 재이네 가족이 워터파크에서 물놀이를 시작한 시각과 끝낸 시각입니다. 각 시계의 시각을 구하고, 재이네 가족이 물놀이를 한 시간을 구하시오.",
    visual: { type: "clocks", layout: "titles-above", clocks: [{ label: "물놀이를 시작한 시각", hour: 3, minute: 35 }, { label: "물놀이를 끝낸 시각", hour: 8, minute: 10 }] }
  },
  4: {
    prompt: "지안이가 그림을 그리기 시작할 때 본 시계입니다. 지안이는 3시간 30분 동안 그림을 그렸습니다. 그림 그리기를 끝낸 시각을 구하고 시계에 그려 보시오.",
    visual: { type: "clocks", layout: "arrow", clocks: [{ label: "시작 시각", hour: 6, minute: 55 }, { label: "끝난 시각" }] }
  },
  5: { prompt: "달력을 보니 이번 달의 31일이 일요일이었습니다. 다음 달 달력의 31일이 수요일일 때, 바로 전 달의 1일은 무슨 요일입니까?", visual: NONE },
  6: { prompt: "다음은 일정한 규칙을 수를 나열한 것입니다. 나열된 수들의 규칙을 찾아 32번째 수를 구하시오.", visual: { type: "sequence", terms: [1, 5, 9, 13, 17] } },
  7: { prompt: "다음은 일정한 규칙을 수를 나열한 것입니다. 나열된 수들의 규칙을 찾아 179는 몇 번째 수인지 구하시오.", visual: { type: "sequence", terms: [7, 11, 15, 19] } },
  8: { prompt: "다음과 같이 성냥개비를 붙여 오각형을 만들려고 합니다. 오각형 24개를 만들려면 성냥개비 몇 개가 필요한지 구하시오.", visual: { type: "matchsticks", count: 5 } },
  9: { prompt: "정훈이는 퀴즈 10문제를 풀어서 모두 맞혔습니다. 모두 2점과 5점짜리 문제이고 점수를 계산해 보니 32점이 나왔습니다. 정훈이는 2점과 5점짜리 문제를 각각 몇 개씩 맞혔습니까?", visual: NONE },
  10: { prompt: "하경이는 과녁 맞히기 게임을 합니다. 기본 점수는 50점이고 과녁에 맞히면 10점 올라가고, 맞히지 못하면 5점 내려갑니다. 10번 던져서 90점을 얻었습니다. 하경이가 과녁에 맞힌 것은 모두 몇 번입니까?", visual: NONE },
  11: { prompt: "개미 한 마리가 깊이 29m인 우물 속에 빠졌습니다. 이 개미는 낮에는 9m 기어오르지만 밤에는 다시 4m 미끄러져 내려옵니다. 이 개미는 며칠 후에 우물을 빠져 나오겠습니까?", visual: NONE },
  12: { prompt: "어떤 미생물은 하루에 2배씩 커집니다. 첫째 날 유리병에 이 미생물 한 마리를 담아 보관했더니 10일이 지난 후에 병이 미생물로 가득 채워졌습니다. 이 미생물이 병의 절반을 채우는 데는 며칠이 걸리겠습니까?", visual: NONE },
  13: { prompt: "다음 그림과 같이 바둑돌 27개를 늘어놓아 정삼각형을 만들었습니다. 정삼각형의 한 변에 놓인 바둑돌은 몇 개입니까?", visual: { type: "stone-triangle" } },
  14: { prompt: "다음 그림과 같은 정다각형 모양의 땅의 둘레에 말뚝을 박아 울타리를 치려고 합니다. 정육각형 모양의 땅의 한 변에 7개의 말뚝을 박을 때 필요한 말뚝이 모두 몇 개인지 구하시오. (단, 정다각형의 꼭짓점에는 말뚝을 박아야 합니다.)", visual: { type: "hexagon-field" } },
  15: { prompt: "둘레가 88m인 연못 주위에 8m 간격으로 나무를 심었습니다. 나무와 나무 사이에는 2m 간격으로 장미꽃이 심으려고 합니다. 장미꽃은 모두 몇 송이 필요한지 구하시오.", visual: NONE },
  16: { prompt: "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉮에 알맞은 수를 구하시오.", visual: { type: "rule-table", rows: [["1", "4", "7", "10", "…", "70"], ["3", "7", "11", "15", "…", "㉮"]] } },
  17: { prompt: "다음 주어진 조건을 만족하는 수를 모두 구하시오.", visual: { type: "conditions", clues: ["세 자리의 대칭수입니다.", "각 자리의 숫자의 합이 12입니다."] } },
  18: { prompt: "시각을 다음과 같이 수로 나타낼 때, 9시부터 12시까지 3시간 동안 대칭수는 모두 몇 번 나타납니까?", visual: { type: "time-number", pairs: [["9시 8분", "98"], ["10시 6분", "106"], ["9시 13분", "913"], ["10시 22분", "1022"]] } },
  19: { prompt: "두 자리 수에서 앞뒤 숫자를 바꾸어 새로운 수를 만들었습니다. 새로운 수와 원래 수의 차가 63일 때, 만들 수 있는 가장 큰 두 자리 수는 무엇입니까?", visual: { type: "digit-subtraction", result: ["6", "3"] } },
  20: { prompt: "준이네 반 학생 50명 중에서 곤충을 좋아하는 학생은 38명, 물고기를 좋아하는 학생은 25명, 곤충과 물고기를 모두 좋아하지 않는 학생이 7명이다. 곤충과 물고기를 모두 좋아하는 학생은 모두 몇 명인가?", visual: { type: "venn" } },
  21: {
    prompt: "다음은 규종이가 밤에 잠들 때와 아침에 일어날 때 거울에 비친 시계의 모습입니다. 규종이는 몇 시간 동안 잠을 잤습니까?",
    visual: { type: "clocks", layout: "below", clocks: [{ label: "잠든 시각", hour: 9, minute: 0, mirror: true }, { label: "일어난 시각", hour: 8, minute: 0, mirror: true }] }
  },
  22: { prompt: "모두 합쳐서 36명의 난쟁이와 거인이 36개의 귤을 나누어 먹습니다. 난쟁이는 2명이 1개의 귤을 나누어 먹고, 거인은 1명이 2개의 귤을 먹습니다. 난쟁이와 거인은 각각 몇 명인지 구하시오.", visual: NONE },
  23: { prompt: "한 변에 바둑돌을 13개씩 늘어놓아 정육각형을 만든 후, 이 바둑돌을 정사각형 모양으로 늘어놓는다면 정사각형의 한 변에 몇 개의 바둑돌을 놓아야 합니까?", visual: { type: "stone-hex-square" } },
  24: { prompt: "유진이네 반 학생들을 A, B, C, D, 4개의 모둠으로 나누었습니다. A모둠에 가입하지 않은 학생은 27명, B모둠에 가입하지 않은 학생은 32명입니다. C 또는 D모둠에 가입하지 않은 학생이 모두 21명이라고 할 때, 유진이네 반 학생은 모두 몇 명입니까?", visual: NONE },
  25: { prompt: "흰 바둑돌과 검은 바둑돌이 모두 합해 80개보다 많고 90개보다 적게 있습니다. 흰 바둑돌이 검은 바둑돌보다 18개 많고, 흰 바둑돌 개수의 각 자리 숫자를 바꾸면 검은 바둑돌이 됩니다. 흰 바둑돌과 검은 바둑돌은 각각 몇 개씩 있습니까?", visual: NONE }
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const item = ORIGINALS[Number(number)];
  return item ? { number: Number(number), ...item } : null;
}
