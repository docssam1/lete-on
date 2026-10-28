// 10권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문장·수·배치는 원문 그대로, 그림은 우리 색표(kit.js)로 새로 그린다. 정답은 여기에 두지 않는다(비공개 DB).
// figure(visual) 는 문항 그림과 답 그림(비공개 정답의 visual) 을 같은 함수로 그린다 — 빈칸에 들어갈 값은 visual.fill 로만 받는다.
import { UT, esc, text, svg, box, line, cardsRow, conditionsBox } from "./kit.js?v=20261028ze";

// ── 작은 부품 ──
const INK = UT.ink;
const plain = (x, y, value, opts = {}) => text(x, y, value, { size: 15, weight: 500, anchor: "start", ...opts });
const circle = (cx, cy, r, { fill = UT.boxFill, stroke = UT.box, width = 1.8 } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;

// 저울에 올리는 물건: 구슬(●) · 큐브(■) · 마름모(◆) · 별(★) — 색표의 모양 색
function token(kind, cx, cy, s) {
  const h = s / 2;
  if (kind === "ball") {
    return `<circle cx="${cx}" cy="${cy}" r="${h - 0.5}" fill="${UT.red}" stroke="#b8392a" stroke-width="1.4"/><circle cx="${cx - h * 0.32}" cy="${cy - h * 0.34}" r="${h * 0.22}" fill="#fff" opacity="0.75"/>`;
  }
  if (kind === "cube") {
    const x = cx - h + 0.5, y = cy - h + 0.5, w = s - 1, i = s * 0.2;
    return `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${UT.blueSoft}" stroke="${UT.blue}" stroke-width="1.6"/><rect x="${x + i}" y="${y + i}" width="${w - 2 * i}" height="${w - 2 * i}" fill="#ffffff" stroke="${UT.blue}" stroke-width="0.9" opacity="0.9"/>`
      + [[x, y, x + i, y + i], [x + w, y, x + w - i, y + i], [x, y + w, x + i, y + w - i], [x + w, y + w, x + w - i, y + w - i]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${UT.blue}" stroke-width="0.9"/>`).join("");
  }
  if (kind === "diamond") {
    return `<polygon points="${cx},${cy - h + 0.5} ${cx + h - 1},${cy} ${cx},${cy + h - 0.5} ${cx - h + 1},${cy}" fill="${UT.purpleSoft}" stroke="${UT.purple}" stroke-width="1.6" stroke-linejoin="round"/>`;
  }
  // star
  const pts = Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? h * 0.42 : h;
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a) + h * 0.08).toFixed(2)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="#f0b23a" stroke="#b9821a" stroke-width="1.3" stroke-linejoin="round"/>`;
}

// 전자저울 하나: 접시 위에 물건(아래 줄부터), 몸통에 무게 또는 빈칸
function scale(cx, top, { rows = [], align = "center", reading = "", blank = false, fillValue = "", s = 26, plate = 64 } = {}) {
  const plateY = top + rows.length * s + 6;
  const bottomRow = rows[0] || [];
  const left0 = cx - (bottomRow.length * s) / 2;
  const items = rows.map((row, r) => {
    const start = align === "left" ? left0 : cx - (row.length * s) / 2;
    return row.map((kind, i) => token(kind, start + i * s + s / 2, plateY - 4 - r * s - s / 2, s)).join("");
  }).join("");
  const bw = 78, bh = 72, by = plateY + 14;
  const body = `<line x1="${cx}" y1="${plateY + 4}" x2="${cx}" y2="${by}" stroke="${UT.line}" stroke-width="3"/>`
    + `<rect x="${cx - bw / 2 - 5}" y="${by + 22}" width="6" height="18" rx="2" fill="${UT.soft}"/><rect x="${cx + bw / 2 - 1}" y="${by + 22}" width="6" height="18" rx="2" fill="${UT.soft}"/>`
    + `<rect x="${cx - 22}" y="${by + bh - 2}" width="7" height="9" fill="#fff" stroke="${UT.line}" stroke-width="1.3"/><rect x="${cx + 15}" y="${by + bh - 2}" width="7" height="9" fill="#fff" stroke="${UT.line}" stroke-width="1.3"/>`
    + `<rect x="${cx - bw / 2}" y="${by}" width="${bw}" height="${bh}" rx="9" fill="#fff" stroke="${UT.line}" stroke-width="1.8"/>`
    + `<ellipse cx="${cx}" cy="${plateY + 2}" rx="${plate}" ry="7.5" fill="${UT.orangeSoft}" stroke="${UT.orange}" stroke-width="1.6"/>`;
  const shown = blank
    ? `${box(cx - 25, by + 17, 38, 36, { radius: 6 })}${fillValue !== "" ? text(cx - 6, by + 36, fillValue, { size: 17, weight: 600 }) : ""}${text(cx + 24, by + 36, "g", { size: 17, weight: 500 })}`
    : text(cx, by + bh / 2, reading, { size: 19, weight: 500 });
  return { markup: body + items + shown, bottom: by + bh + 8 };
}

// ── 문항별 그림 ──
// 1·2 연속수의 합: 줄마다 식(원문처럼 아래로 띄워 풀이 자리를 둔다)
function sumLines(v) {
  const gap = 70, w = 380, h = 22 + (v.lines.length - 1) * gap + 30;
  const body = v.lines.map((value, i) => plain(4, 16 + i * gap, value, { size: 17 })).join("");
  return svg(w, h, "연속수의 합", body, w).replace("margin:0 auto", "margin:0");
}

// 3·4 연속수로 나타내기: 수 = ○ + ○ + …, 가운데 동그라미는 색칠
function chainRows(v) {
  const r = v.radius || 17, gap = 16, labelW = 104;
  const widest = Math.max(...v.rows.map((row) => row.count));
  const w = labelW + widest * 2 * r + (widest - 1) * gap + 10;
  const rowGap = 150;
  const body = v.rows.map((row, ri) => {
    const cy = 24 + ri * rowGap;
    const parts = [plain(4, cy, row.label, { size: 16 }), text(60, cy, row.total, { size: 18, weight: 500 }), text(labelW - 12, cy, "=", { size: 18, weight: 500 })];
    for (let i = 0; i < row.count; i += 1) {
      const cx = labelW + r + i * (2 * r + gap);
      const shaded = row.shade.includes(i);
      parts.push(circle(cx, cy, r, { fill: shaded ? UT.tint : UT.boxFill }));
      const value = v.fill?.[ri]?.[i];
      if (value !== undefined) parts.push(text(cx, cy, value, { size: 14, weight: 600 }));
      if (i < row.count - 1) parts.push(text(cx + r + gap / 2, cy, "+", { size: 18, weight: 600 }));
    }
    return parts.join("");
  }).join("");
  return svg(w, 24 + (v.rows.length - 1) * rowGap + 30, "연속수의 합으로 나타내기", body, w);
}

// 5 달력 + 물음 두 개
function calendarQuestion(v) {
  const cw = 50, ch = 40, x0 = 30, y0 = 4;
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const shaded = new Set(v.shaded);
  const parts = [];
  days.forEach((day, c) => {
    parts.push(`<rect x="${x0 + c * cw}" y="${y0}" width="${cw}" height="${ch}" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.2"/>`);
    parts.push(text(x0 + c * cw + cw / 2, y0 + ch / 2, day, { size: 16, weight: 600 }));
  });
  for (let week = 0; week < 5; week += 1) {
    for (let c = 0; c < 7; c += 1) {
      const day = week * 7 + c - v.firstWeekday + 1;
      const x = x0 + c * cw, y = y0 + (week + 1) * ch;
      parts.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${shaded.has(day) ? UT.shade : "#fff"}" stroke="${UT.line}" stroke-width="1.2"/>`);
      if (day >= 1 && day <= v.days) parts.push(text(x + cw / 2, y + ch / 2, day, { size: 16, weight: 500 }));
    }
  }
  const calBottom = y0 + 6 * ch;
  const qs = [
    { y: calBottom + 54, lines: ["(1)  색칠된 부분에 있는 9개의 수의 합을 구하시오."] },
    { y: calBottom + 168, lines: ["(2)  달력에서 색칠된 9개의 수의 합이 144라면 9개", "의 수 중 가장 큰 수는 얼마인지 구하시오."] }
  ];
  qs.forEach((q) => q.lines.forEach((value, i) => parts.push(plain(i ? 36 : 6, q.y + i * 27, value, { size: 15.5 }))));
  return svg(400, calBottom + 240, "달력", parts.join(""), 400);
}

// 6 과녁(가 · 나) + 조건 상자
function targetQuestion(v) {
  const cx = 180, cy = 100;
  const parts = [
    circle(cx, cy, 96, { fill: UT.yellowSoft, stroke: UT.orange, width: 2 }),
    circle(cx, cy, 54, { fill: UT.redSoft, stroke: UT.red, width: 2 }),
    text(cx - 6, cy, "가", { size: 18, weight: 500 }),
    text(cx + 76, cy, "나", { size: 18, weight: 500 })
  ];
  const by = 214, lineH = 31;
  const rows = v.clues.flatMap((clue) => clue.map((value, i) => ({ value, bullet: i === 0 })));
  parts.push(`<rect x="4" y="${by}" width="352" height="${rows.length * lineH + 22}" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`);
  rows.forEach((row, i) => {
    const y = by + 26 + i * lineH;
    if (row.bullet) parts.push(`<circle cx="24" cy="${y}" r="2.8" fill="${INK}"/>`);
    parts.push(plain(38, y, row.value, { size: 15 }));
  });
  return svg(360, by + rows.length * lineH + 26, "과녁과 맞힌 결과", parts.join(""), 360);
}

// 10 큐브와 구슬 저울
function cubeBallScales(v) {
  const parts = [`<rect x="40" y="4" width="320" height="226" rx="22" fill="#fff" stroke="${UT.soft}" stroke-width="1.6"/>`];
  const a = scale(130, 24, { rows: [["ball", "ball", "ball"], ["cube", "cube"]], reading: "31g" });
  const b = scale(272, 24, { rows: [["cube", "cube", "cube"], ["ball", "ball"]], reading: "29g" });
  parts.push(a.markup, b.markup);
  const lower = [["cube", "ball"], ["cube"], ["ball"]];
  lower.forEach((row, i) => parts.push(scale(66 + i * 134, 260, { rows: [row], blank: true, fillValue: v.fill?.[i] ?? "" }).markup));
  return svg(400, 404, "큐브와 구슬의 무게", parts.join(""), 400);
}

// 11 네 저울 + 무게 쓰는 칸
function fourScales(v) {
  const parts = [];
  const sets = [
    { rows: [["ball", "cube"], ["ball", "diamond"]], reading: "18g" },
    { rows: [["ball", "star", "star"], ["diamond", "star"]], reading: "30g" },
    { rows: [["ball", "cube"]], reading: "6g" },
    { rows: [["cube", "cube"], ["ball", "star"]], reading: "14g" }
  ];
  sets.forEach((set, i) => {
    const cx = 58 + i * 114;
    const top = 6 + (2 - set.rows.length) * 26;
    const drawn = scale(cx, top, { ...set, align: "left", plate: 54 });
    parts.push(drawn.markup, text(cx, drawn.bottom + 16, `[저울 ${i + 1}]`, { size: 15, weight: 500 }));
  });
  const keys = [["ball", "cube"], ["diamond", "star"]];
  keys.forEach((row, r) => row.forEach((kind, c) => {
    const x = 60 + c * 236, y = 262 + r * 56;
    const value = v.fill?.[kind] ?? "";
    parts.push(token(kind, x, y, 28), text(x + 32, y, "=", { size: 17, weight: 500 }), box(x + 46, y - 20, 52, 40, { radius: 6 }), value !== "" ? text(x + 72, y, value, { size: 17, weight: 600 }) : "", text(x + 114, y, "g", { size: 18, weight: 500 }));
  }));
  return svg(458, 346, "네 저울", parts.join(""), 458);
}

// 숫자 카드 줄
function cards(v) {
  const width = Math.max(200, v.cards.length * 40 + 12);
  return `<div style="padding-top:18px">${svg(width, 44, "숫자 카드", cardsRow(v.cards.map(String), width, 5, 34), width)}</div>`;
}

// 18·19 자리별로 세기 칸: (일) : _ _ ▒ ~ _ _ ▒
function placeCount(v) {
  const places = ["일", "십", "백"];
  const slot = 36, sg = 8;
  const parts = places.map((place, r) => {
    const y = 26 + r * 66;
    const hi = 2 - r; // 일=오른쪽 칸, 십=가운데, 백=왼쪽
    const row = [circle(22, y, 17, { fill: UT.tint, stroke: UT.purple, width: 1.6 }), text(22, y + 1, place, { size: 15, weight: 600 }), text(56, y, ":", { size: 16, weight: 600 })];
    [76, 260].forEach((start, half) => {
      for (let k = 0; k < 3; k += 1) {
        const x = start + k * (slot + sg);
        if (k === hi) row.push(`<rect x="${x}" y="${y - 18}" width="${slot}" height="34" fill="${UT.yellowSoft}"/>`);
        row.push(line(x, y + 16, x + slot, y + 16, { stroke: UT.purple, width: 1.6 }));
        const value = v.fill?.[r]?.[half]?.[k];
        if (value !== undefined && value !== "") row.push(text(x + slot / 2, y + 1, value, { size: 16, weight: 600 }));
      }
    });
    row.push(text(230, y + 2, "~", { size: 18, weight: 600 }));
    return row.join("");
  }).join("");
  return svg(400, 186, "자리별로 세기", parts, 400);
}

// 20~23 수 나열(두 자리·세 자리 부분은 빨강), 끝에 빈칸이 있으면 칸 — 폭은 글자 폭을 어림해 내용에 맞춘다
const runWidth = (value, size) => [...value].reduce((sum, c) => sum + (/[0-9]/.test(c) ? 0.53 : c === "…" ? 0.9 : 0.25), 0) * size;
function numberRun(v) {
  const size = v.size || 17;
  const textW = v.parts.reduce((sum, [value]) => sum + runWidth(value, size), 0);
  const pad = v.panel ? 26 : 6;
  const width = Math.ceil(textW + pad * 2 + (v.endBox ? 92 : 0));
  const pieces = v.parts.map(([value, red]) => `<tspan fill="${red ? UT.red : INK}">${esc(value)}</tspan>`).join("");
  const rowY = v.panel ? 34 : 25;
  const run = `<text x="${pad}" y="${rowY}" dominant-baseline="central" style="font-size:${size}px;font-weight:500;dominant-baseline:central;letter-spacing:0">${pieces}</text>`;
  const panel = v.panel ? `<rect x="2" y="4" width="${width - 4}" height="60" rx="10" fill="${UT.yellowSoft}"/>` : "";
  const end = v.endBox ? `${box(width - 62, rowY - 20, 56, 40, { radius: 7 })}${v.fill ? text(width - 34, rowY, v.fill, { size: 16, weight: 600 }) : ""}` : "";
  return svg(width, v.panel ? 70 : 50, "수 나열", panel + run + end, width);
}

// 24 연속하는 세 수의 덧셈 두 개
function additions(v) {
  const cell = 40;
  const parts = v.sums.map((digits, n) => {
    const x0 = 20 + n * 200;
    const col = (k) => x0 + 50 + k * (cell + 4); // k=0 십의 자리 칸, 1 일의 자리 칸
    const out = [];
    for (let r = 0; r < 3; r += 1) {
      for (let k = 0; k < 2; k += 1) {
        out.push(box(col(k), 6 + r * (cell + 4), cell, cell, { radius: 0 }));
        const value = v.fill?.[n]?.[r]?.[k];
        if (value !== undefined) out.push(text(col(k) + cell / 2, 6 + r * (cell + 4) + cell / 2 + 1, value, { size: 18, weight: 500 }));
      }
    }
    out.push(text(x0 + 26, 6 + 2 * (cell + 4) + cell / 2, "+", { size: 18, weight: 500 }));
    const ly = 6 + 3 * (cell + 4) + 2;
    out.push(line(x0 + 2, ly, x0 + 140, ly, { stroke: INK, width: 1.6 }));
    const ry = ly + 8;
    out.push(box(x0 + 6, ry, cell, cell, { radius: 0 }));
    const top = v.fill?.[n]?.[3];
    if (top !== undefined) out.push(text(x0 + 6 + cell / 2, ry + cell / 2 + 1, top, { size: 18, weight: 500 }));
    digits.forEach((d, k) => out.push(text(col(k) + cell / 2, ry + cell / 2 + 1, d, { size: 19, weight: 500 })));
    return out.join("");
  }).join("");
  return svg(400, 202, "세 수의 덧셈", parts, 400);
}

// 25 1, 2, 3, 4, … , ㉠[ ] 상자 + 물음 두 개
function oddEvenQuestion(v) {
  const parts = [
    `<rect x="40" y="4" width="270" height="76" rx="12" fill="${UT.yellowSoft}"/>`,
    plain(62, 42, "1, 2, 3, 4, … ,", { size: 19 }),
    circle(208, 42, 10, { fill: "none", stroke: INK, width: 1.2 }),
    text(208, 42, "ㄱ", { size: 12, weight: 600 }),
    box(222, 20, 50, 44, { radius: 3 }),
    v.fill ? text(247, 42, v.fill, { size: 17, weight: 600 }) : "",
    plain(8, 170, "(1)  끝수 ㉠이 짝수일 때, ㉠은 얼마인지 구하시오.", { size: 15 }),
    plain(8, 280, "(2)  끝수 ㉠이 홀수일 때, ㉠은 얼마인지 구하시오.", { size: 15 })
  ];
  return svg(400, 320, "자연수 나열", parts.join(""), 400);
}

const DRAW = {
  "sum-lines": sumLines, "chain-rows": chainRows, calendar: calendarQuestion, target: targetQuestion,
  conditions: (v) => conditionsBox(v.clues), "cube-ball-scales": cubeBallScales, "four-scales": fourScales,
  cards, "place-count": placeCount, "number-run": numberRun, additions, "odd-even": oddEvenQuestion,
  // 그림이 없는 문항(원문도 문장뿐) — 풀이 자리만 남긴다
  none: () => `<span aria-hidden="true" style="display:block;width:100%;height:1px"></span>`
};

// 원문처럼 그림은 문제 바로 아래(위쪽)에 붙이고, 남는 자리는 풀이 자리로 둔다
export function figure(visual) {
  const draw = DRAW[visual?.type];
  if (!draw) return "";
  if (visual.type === "none") return draw(visual);
  return `<div class="b10-ut-fig" style="align-self:start;justify-self:stretch;width:100%;min-width:0">${draw(visual)}</div>`;
}

// ── 원문 문항 ──
const B10 = (type, extra = {}) => ({ kind: "book10", type, ...extra });
const ORIGINALS = {
  1: { prompt: "다음 연속수의 합을 구하시오.", visual: B10("sum-lines", { lines: ["(1) 1+2+3+…+16", "(2) 1+2+3+…+40", "(3) 9+10+11+12+13+14=", "(4) 10+11+12+13+14+15+16+17+18+19="] }), responseKind: "fill" },
  2: { prompt: "다음 연속수의 합을 구하시오.", visual: B10("sum-lines", { lines: ["(1) 1+2+3+…+15", "(2) 1+2+3+…+59", "(3) 4+5+6+7+8 =", "(4) 4+5+6+7+8+9+10+11+12 ="] }), responseKind: "fill" },
  3: { prompt: "다음 주어진 수를 연속수의 합으로 나타내시오.", visual: B10("chain-rows", { radius: 16, rows: [{ label: "(1)", total: 57, count: 6, shade: [2, 3] }, { label: "(2)", total: 92, count: 8, shade: [3, 4] }] }), responseKind: "fill" },
  4: { prompt: "다음 주어진 수를 연속수의 합으로 나타내시오.", visual: B10("chain-rows", { radius: 17, rows: [{ label: "(1)", total: 55, count: 5, shade: [2] }, { label: "(2)", total: 84, count: 7, shade: [3] }] }), responseKind: "fill" },
  5: { prompt: "다음 달력을 보고 물음에 답하시오.", visual: B10("calendar", { firstWeekday: 2, days: 31, shaded: [6, 7, 8, 13, 14, 15, 20, 21, 22] }), responseKind: "fill" },
  6: { prompt: "다음 그림과 같은 판에 화살을 쏘아 점수를 계산해 보았더니, 다음과 같았습니다. 나에 한 번 맞혔을 때의 점수를 구하시오.", visual: B10("target", { clues: [["A는 가에 한 번, 나에 한 번 맞혀서", "13점이 되었습니다."], ["B는 가에 두 번, 나에 한 번 맞혀서", "21점이 되었습니다."]] }) },
  7: { prompt: "A, B, C 세 자연수를 각각 두 개씩 더했더니 다음과 같았습니다. C를 구하시오.", visual: B10("conditions", { clues: ["A와 B의 합은 18입니다.", "B와 C의 합은 17입니다.", "C와 A의 합은 9입니다"] }) },
  8: { prompt: "하람이네 동아리 학생들은 처음에 한 명이 구슬을 8개씩 나눠 가지기로 하였는데, 3명이 새로 동아리에 들어와서 한 명이 구슬을 6개씩 나누어 가졌다고 합니다. 처음 있던 동아리 학생수와 구슬의 개수를 각각 구하시오.", visual: B10("none") },
  9: { prompt: "A, B 두 물탱크에 물이 각각 15L, 47L씩 들어 있습니다. 지금부터 A에는 매분 8L, B에는 매분 4L씩 물을 넣기 시작한다면 몇 분 후에 두 물탱크의 물이 같아지는지 구하시오.", visual: B10("none") },
  10: { prompt: "큐브 2개와 구슬 3개의 무게는 31g이고, 큐브 3개와 구슬 2개의 무게는 29g입니다. 큐브 한 개의 무게는 몇 g인지 구하시오.", visual: B10("cube-ball-scales"), responseKind: "fill" },
  11: { prompt: "●, ◆, ■, ★을 저울에 올려놓고 무게를 재었더니 다음과 같습니다. 각각의 무게를 구하시오.", visual: B10("four-scales"), responseKind: "fill" },
  12: { prompt: "다음 다섯 장의 숫자 카드를 한 번씩만 써서 만들 수 있는 서로 다른 세 자리 수는 모두 몇 개인지 구하시오.", visual: B10("cards", { cards: [1, 3, 5, 7, 9] }) },
  13: { prompt: "다음 네 장의 숫자 카드를 한 번씩만 써서 만들 수 있는 서로 다른 네 자리 수는 모두 몇 개인지 구하시오.", visual: B10("cards", { cards: [0, 2, 5, 9] }) },
  14: { prompt: "숫자 1, 2, 3, 4를 사용하여 만들 수 있는 세 자리 수는 모두 몇 개인지 구하시오. (단, 같은 숫자를 여러 번 사용할 수 있습니다.)", visual: B10("none") },
  15: { prompt: "1, 2, 3, 4, 5 다섯 장의 숫자 카드로 만들 수 있는 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 작아지는 수(점작수)를 모두 구하시오.", visual: B10("none") },
  16: { prompt: "다음 1부터 9까지의 숫자 카드가 한 장씩 있습니다. 세 수의 합이 11인 경우를 모두 구하시오. (단, 순서만 다른 경우는 한 가지로 봅니다.)", visual: B10("cards", { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9] }) },
  17: { prompt: "각 자리 숫자의 합이 8인 세 자리 수들을 큰 수부터 차례대로 쓸 때, 12번째 수를 구하시오.", visual: B10("none") },
  18: { prompt: "1부터 130까지 차례대로 수를 써 나갈 때, 숫자 1은 모두 몇 번 나오는지 구하시오.", visual: B10("place-count") },
  19: { prompt: "300부터 500까지 차례대로 수를 써 나갈 때, 숫자 3은 모두 몇 번 나오는지 구하시오.", visual: B10("place-count") },
  20: { prompt: "다음은 1부터 70까지 모든 수들을 나열한 것입니다. 1부터 70까지 모든 숫자의 개수를 구하시오.", visual: B10("number-run", { panel: true, size: 18, parts: [["1,2,3,4,5,6,7,8,9,", false], ["10,11,12,13,14,…,68,69,70", true]] }) },
  21: { prompt: "다음은 1부터 200까지 모든 수들을 나열한 것입니다. 1부터 200까지 모든 숫자의 개수를 구하시오.", visual: B10("number-run", { size: 17, parts: [["1,2,3,4,5,6,7,8,9,10,11,…, 98,99,", false], ["100,101,…,199,200", true]] }) },
  22: { prompt: "다음과 같이 1부터 차례대로 자연수를 나열하였더니 모든 숫자의 개수가 167개였습니다. 마지막 수를 구하시오.", visual: B10("number-run", { size: 18, endBox: true, parts: [["1,2,3,4,5,6,7,8,9,", false], ["10,11,12,…,", true]] }), responseKind: "fill" },
  23: { prompt: "다음과 같이 1부터 차례대로 자연수를 나열하였더니 모든 숫자의 개수가 642개였습니다. 마지막 수를 구하시오.", visual: B10("number-run", { size: 17, endBox: true, parts: [["1,2,3,4,5,6,7,8,9,10,11, …, 98,99,", false], ["100,101, …,", true]] }), responseKind: "fill" },
  24: { prompt: "다음은 연속하는 세 수의 덧셈을 나타낸 것입니다. 빈칸에 알맞은 숫자를 써넣으시오. (단, 백의 자리 숫자는 0이 아닙니다.)", visual: B10("additions", { sums: [[0, 4], [2, 0]] }), responseKind: "fill" },
  25: { prompt: "다음과 같이 1부터 ㉠까지의 자연수 중에서 짝수 전체의 합과 홀수 전체의 합의 차가 20입니다. 다음 물음에 답하시오.", visual: B10("odd-even"), responseKind: "fill" }
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const item = ORIGINALS[Number(number)];
  return item ? { number: Number(number), ...item, visual: structuredClone(item.visual) } : null;
}
