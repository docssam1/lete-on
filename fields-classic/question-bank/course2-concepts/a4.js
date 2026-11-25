// 2과정 A4 「마방진, 복면산과 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, rect, circle, line, poly, dot, arrow, P, INK, GREEN, SOFT, MARK, YELLOW, formulas, mathLabel, barModel, SHADOW } from "./pack-kit.js?v=20261123b";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const ASK = (v) => v === "?" ? MARK : INK;   // 「?」는 빨강 — 아직 모르는 칸
// 3×3 마방진 칸
const magicGrid = (x, y, cells, { s = 40, center = true } = {}) => cells.map((v, i) => rect(x + (i % 3) * s, y + Math.floor(i / 3) * s, s, s, { fill: center && i === 4 ? YELLOW : "#fff" })
  + text(x + s / 2 + (i % 3) * s, y + s / 2 + Math.floor(i / 3) * s, v === null ? "" : String(v), { size: 18, color: ASK(v) })).join("");
const figMagic = (cells = [2, 7, 6, 9, 5, 1, 4, 3, 8], note = true) => () => svg(300, 150, magicGrid(20, 14, cells)
  + (note ? label(220, 50, "가로·세로·대각선") + label(220, 74, "합이 모두 15") : ""), "3×3 마방진");
// 보조 칸으로 3×3 마방진 만들기(원본 교재가 가르치는 방법): 상하좌우에 보조 칸 → 대각선 방향으로 1~9 → 보조 칸의 수를 마주 보는 빈칸으로
const figAux = () => {
  const s = 26, ox = 16, oy = 14, put = { "0,2": 3, "1,1": 2, "1,3": 6, "2,0": 1, "2,2": 5, "2,4": 9, "3,1": 4, "3,3": 8, "4,2": 7 };
  const aux = ["0,2", "2,0", "2,4", "4,2"];
  let body = "";
  for (let r = 1; r <= 3; r += 1) for (let c = 1; c <= 3; c += 1) body += rect(ox + c * s, oy + r * s, s, s, { fill: "#fff", width: 1.6 });
  aux.forEach((k) => { const [r, c] = k.split(",").map(Number); body += rect(ox + c * s, oy + r * s, s, s, { color: MARK, width: 1.2, dash: "3 3" }); });
  Object.entries(put).forEach(([k, v]) => { const [r, c] = k.split(",").map(Number); body += text(ox + c * s + s / 2, oy + r * s + s / 2, String(v), { size: 14, color: aux.includes(k) ? MARK : INK }); });
  body += arrow(P(158, 79), P(196, 79)) + label(177, 62, "옮기기", { size: 11 });
  body += magicGrid(206, 40, [2, 7, 6, 9, 5, 1, 4, 3, 8], { s: 26, center: false });
  body += label(82, 156, "보조 칸(점선)에 대각선으로 1~9", { size: 11 }) + label(245, 156, "합 15", { size: 11 });
  return svg(300, 168, body, "보조 칸으로 마방진 만들기");
};
// 삼각진(꼭짓점 + 변 가운데 동그라미)
const figTriangle = ({ names = false, note = "" } = {}) => () => {
  const pts = [P(150, 20), P(110, 80), P(190, 80), P(70, 140), P(150, 140), P(230, 140)];
  const nm = { 0: "가", 3: "나", 5: "다" };
  return svg(300, note ? 190 : 162, line(pts[0], pts[3], { color: "#9aa39e" }) + line(pts[3], pts[5], { color: "#9aa39e" }) + line(pts[5], pts[0], { color: "#9aa39e" })
    + pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="15" fill="${[0, 3, 5].includes(i) ? YELLOW : "#fff"}" stroke="#4d6b5a" stroke-width="1.5" ${SHADOW}/>` + (names && nm[i] ? text(p.x, p.y, nm[i], { size: 14, color: GREEN }) : "")).join("")
    + (note ? label(150, 176, note) : ""), "삼각진");
};
// 세로셈(원본 교재처럼 자리를 맞춰 세로로): rows = 위에서부터 줄(글자 하나가 한 자리), op = 마지막 줄 앞 기호, result = 답 줄.
// hi = 노랗게 칠할 자리(0 = 일의 자리), carry = { 자리: "1" } 받아올림 표시, side = 오른쪽 설명 줄
const colCalc = (rows, op, result, { hi = [], carry = {}, side = [] } = {}) => () => {
  const cw = 30, rh = 32, n = Math.max(...rows.map((r) => r.length), result.length), x0 = 44, top = Object.keys(carry).length ? 24 : 10;
  const X = (i) => x0 + (n - 1 - i) * cw + cw / 2, lineY = top + rows.length * rh + 4;
  let body = hi.map((i) => rect(X(i) - cw / 2 + 2, top - 4, cw - 4, (rows.length + 1) * rh + 12, { fill: YELLOW, color: "none", width: 0, rx: 6 })).join("");
  Object.entries(carry).forEach(([i, v]) => { body += text(X(+i), top - 12, v, { size: 12, color: MARK, weight: 700 }); });
  rows.forEach((r, k) => [...r].reverse().forEach((ch, i) => { if (ch !== " ") body += text(X(i), top + k * rh + rh / 2, ch, { size: 21, color: ASK(ch) }); }));
  body += text(x0 - 18, top + (rows.length - 1) * rh + rh / 2, op, { size: 20 }) + line(P(x0 - 28, lineY), P(x0 + n * cw + 2, lineY), { width: 1.8 });
  [...result].reverse().forEach((ch, i) => { if (ch !== " ") body += text(X(i), lineY + rh / 2 + 2, ch, { size: 21, color: ASK(ch) }); });
  const w = x0 + n * cw + 16;
  side.forEach((t, k) => { body += label(w + 8, top + 14 + k * 24, t, { anchor: "start" }); });
  return svg(w + (side.length ? 190 : 0), lineY + rh + 8, body, "세로셈");
};
// 거꾸로 나눗셈(원본 교재가 최대공약수·최소공배수를 구하는 모양): rows = [[나눈 수, 수, 수], …], last = 마지막 몫 줄, side = 오른쪽 설명
const ladder = (rows, last, side = []) => () => {
  const rh = 30, xd = 30, xs = [76, 122], top = 10;
  let body = "";
  rows.forEach(([d, a, b], k) => {
    const y = top + k * rh;
    body += text(xd, y + rh / 2, d, { size: 18, color: ASK(d) }) + text(xs[0], y + rh / 2, a, { size: 18, color: ASK(a) }) + text(xs[1], y + rh / 2, b, { size: 18, color: ASK(b) })
      + line(P(48, y + 4), P(48, y + rh - 2), { width: 1.5 }) + line(P(48, y + rh - 2), P(148, y + rh - 2), { width: 1.5 });
  });
  const ly = top + rows.length * rh + rh / 2;
  body += text(xs[0], ly, last[0], { size: 18, color: last[0] === "?" ? MARK : GREEN }) + text(xs[1], ly, last[1], { size: 18, color: last[1] === "?" ? MARK : GREEN });
  side.forEach((t, k) => { body += label(168, top + 16 + k * 26, t, { anchor: "start", size: 14 }); });
  return svg(side.length ? 360 : 170, top + (rows.length + 1) * rh + 10, body, "거꾸로 나눗셈");
};
const figBars = (a, b, la, lb) => () => svg(60 + Math.max(a, b) * 26, 84, text(18, 24, la, { size: 15, weight: 700 }) + barModel(34, 12, a, { fill: SOFT })
  + text(18, 60, lb, { size: 15, weight: 700 }) + barModel(34, 48, b, { fill: YELLOW }), "칸 막대");
// 양팔저울(원본 교재의 연비 그림): 받침 + 수평 막대 + 평평한 접시(줄 둘씩 — 곡선 접시 쓰지 않음, 원장 2026-11-22)
const ball = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#f4b860" stroke="#a8652a" stroke-width="1.3" ${SHADOW}/>`;
const cube = (x, y) => rect(x - 8, y - 8, 16, 16, { fill: "#cfe3f3", color: "#2f5f8a", width: 1.3, rx: 2, shadow: true });
const boxOf = (fill, color, name) => (x, y) => rect(x - 11, y - 10, 22, 20, { fill, color, width: 1.3, rx: 3, shadow: true }) + text(x, y + 0.5, name, { size: 10, weight: 700, color });
const redBox = boxOf("#f9c8c4", "#a0443a", "빨"), blueBox = boxOf("#cfe3f3", "#2f5f8a", "파");
const pan = (cx, beamY, items, draw, step) => {
  const w = Math.max(70, items * step + 18), py = beamY + 52;
  let out = line(P(cx, beamY), P(cx - w / 2, py), { color: "#8a948f", width: 1.2 }) + line(P(cx, beamY), P(cx + w / 2, py), { color: "#8a948f", width: 1.2 })
    + rect(cx - w / 2 - 4, py, w + 8, 5, { fill: "#e8e2d2", color: "#9a8f74", width: 1.2, rx: 2 });
  for (let i = 0; i < items; i += 1) out += draw(cx - ((items - 1) * step) / 2 + i * step, py - 11);
  return out;
};
const balance = (nl, drawL, nr, drawR, { step = 22, notes = [] } = {}) => () => {
  const cx = 180, beamY = 34, half = 112;
  let body = poly([P(cx, beamY + 4), P(cx - 16, beamY + 84), P(cx + 16, beamY + 84)], { fill: "#e8e2d2", color: "#9a8f74", width: 1.3 })
    + rect(cx - 30, beamY + 84, 60, 6, { fill: "#e8e2d2", color: "#9a8f74", width: 1.2, rx: 2 })
    + rect(cx - half, beamY - 3, half * 2, 6, { fill: "#d9b37c", color: "#8a6a3b", width: 1.2, rx: 3 }) + dot(P(cx, beamY), 3.4, "#8a6a3b")
    + pan(cx - half + 12, beamY, nl, drawL, step) + pan(cx + half - 12, beamY, nr, drawR, step);
  notes.forEach((t, k) => { body += label(cx, beamY + 108 + k * 22, t, { size: 14, color: GREEN, weight: 700 }); });
  return svg(360, beamY + 100 + notes.length * 22, body, "양팔저울");
};
// 모양 식(원본 교재 「합과 차」처럼 같은 모양 = 같은 수): ● ■ ◆
const SHAPE = {
  "●": (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#f4b860" stroke="#a8652a" stroke-width="1.3" ${SHADOW}/>`,
  "■": (x, y) => rect(x - 9, y - 9, 18, 18, { fill: "#cfe3f3", color: "#2f5f8a", width: 1.3, rx: 2, shadow: true }),
  "◆": (x, y) => poly([P(x, y - 11), P(x + 11, y), P(x, y + 11), P(x - 11, y)], { fill: "#e6efe8", color: GREEN, width: 1.3 })
};
const shapeSums = (rows, note = "") => () => {
  let body = "";
  rows.forEach(([a, b, v], k) => {
    const y = 22 + k * 36;
    body += SHAPE[a](94, y) + text(122, y, "+", { size: 18 }) + SHAPE[b](150, y) + text(178, y, "=", { size: 18 }) + text(206, y, v, { size: 19, color: ASK(v) });
  });
  if (note) body += label(150, 22 + rows.length * 36, note, { size: 13 });
  return svg(300, 22 + rows.length * 36 + (note ? 14 : -10), body, "모양 식");
};
// 표(원본 교재의 「가정하여 해결하기」 표처럼): rows = 줄마다 [머리, 칸…], hiCol = 칠할 칸 번호
const table = (rows, { headW = 92, cellW = 46, rh = 30, hiCol = -1 } = {}) => () => {
  const cols = rows[0].length - 1, w = headW + cols * cellW;
  let body = "";
  rows.forEach((r, k) => {
    const y = 6 + k * rh;
    body += rect(6, y, headW, rh, { fill: SOFT, color: "#9aa8a0", width: 1.1 }) + label(6 + headW / 2, y + rh / 2, r[0], { size: 13, color: INK });
    r.slice(1).forEach((v, c) => {
      const x = 6 + headW + c * cellW;
      body += rect(x, y, cellW, rh, { fill: c === hiCol ? YELLOW : "#fff", color: "#9aa8a0", width: 1.1 }) + text(x + cellW / 2, y + rh / 2, v, { size: 15, color: ASK(v) });
    });
  });
  return svg(w + 12, rows.length * rh + 12, body, "표");
};
// 합과 차 막대: 큰 수 = 작은 수 + 차
const figSumDiff = () => svg(320, 96, text(22, 24, "큰 수", { size: 13, weight: 700 }) + rect(48, 12, 150, 24, { fill: SOFT, color: "#4d6b5a", width: 1.4, rx: 4, shadow: true })
  + rect(198, 12, 70, 24, { fill: YELLOW, color: "#b89a4a", width: 1.4, rx: 4, shadow: true }) + label(233, 24, "차 4", { size: 13, color: "#7a5a12" })
  + text(22, 62, "작은 수", { size: 13, weight: 700 }) + rect(48, 50, 150, 24, { fill: SOFT, color: "#4d6b5a", width: 1.4, rx: 4, shadow: true })
  + line(P(282, 12), P(282, 74), { color: GREEN, width: 1.4 }) + label(300, 43, "합 10", { size: 13, color: GREEN }), "합과 차 막대");
// 닭과 토끼(우리가 그린 단순한 모양): 닭 = 노란 몸 + 부리 + 다리 둘, 토끼 = 흰 몸 + 긴 귀 둘 + 다리 넷
const chick = (x, y) => line(P(x - 4, y + 9), P(x - 5, y + 17), { color: "#c0782a", width: 1.6 }) + line(P(x + 4, y + 9), P(x + 5, y + 17), { color: "#c0782a", width: 1.6 })
  + `<circle cx="${x}" cy="${y}" r="10" fill="${YELLOW}" stroke="#b89a4a" stroke-width="1.3" ${SHADOW}/>` + `<polygon points="${x + 9},${y - 2} ${x + 15},${y} ${x + 9},${y + 3}" fill="#e58a2a"/>` + `<circle cx="${x + 3}" cy="${y - 3}" r="1.4" fill="#24302b"/>`;
const bunny = (x, y) => [-6, -2, 2, 6].map((dx) => line(P(x + dx, y + 9), P(x + dx, y + 17), { color: "#8a8f8c", width: 1.5 })).join("")
  + `<ellipse cx="${x - 4}" cy="${y - 14}" rx="3" ry="8" fill="#fff" stroke="#8a8f8c" stroke-width="1.2"/><ellipse cx="${x + 4}" cy="${y - 14}" rx="3" ry="8" fill="#fff" stroke="#8a8f8c" stroke-width="1.2"/>`
  + `<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="#8a8f8c" stroke-width="1.3" ${SHADOW}/>` + `<circle cx="${x + 3}" cy="${y - 2}" r="1.4" fill="#24302b"/>`;
const figLegs = () => svg(340, 120, Array.from({ length: 12 }, (_, i) => (i < 5 ? bunny : chick)(22 + i * 27, 42)).join("")
  + label(170, 86, "모두 닭(다리 2)이라고 가정하고") + label(170, 106, "하나씩 토끼(다리 4)로 바꾼다"), "가정하여 풀기");

export const PACKS = {
  "0/1": [{
    id: "magic-square", title: "마방진 — 한 줄의 합 찾기",
    recall: { figure: figMagic(), text: "가로·세로·대각선에 놓인 수의 합이 모두 같은 표를 마방진이라 합니다.", ask: "1부터 9까지를 모두 더하면?", options: ["45", "36", "50"], answer: 0, why: "(1 + 9) × 9 ÷ 2 = 45예요.", hint: "짝 지어 더하기" },
    explore: [["drill", "magic", "마방진 연습"]],
    proofs: [],
    summary: {
      figure: figAux,
      terms: [["마방진", "가로·세로·대각선의 합이 같은 수 배열"], ["보조 칸", "3×3 마방진을 만들 때 상하좌우에 잠깐 붙여 그리는 칸"]],
      facts: ["한 줄의 합 = 모든 수의 합 ÷ 줄 수(3×3이면 ÷ 3)", "1~9로 만든 3×3 마방진은 한 줄의 합 <b>15</b>, 가운데 <b>5</b>(가운데 × 3 = 한 줄의 합)", "보조 칸을 그려 대각선 방향으로 차례로 쓰고, 보조 칸의 수를 마주 보는 빈칸으로 옮기면 완성된다"]
    },
    pitfall: "주어진 수가 1~9가 아니면 합과 가운데 수를 다시 계산합니다(가운데 = 한 줄의 합 ÷ 3).",
    example: {
      prompt: "1부터 9까지의 수를 한 번씩 써서 3×3 마방진을 만들 때, 한 줄의 합과 가운데 칸의 수를 구하세요.",
      figure: figMagic(["", "", "", "", "?", "", "", "", ""], false),
      steps: [
        { ask: "아홉 수를 모두 더하면?", answer: "45", why: "1 + 2 + … + 9 = 45입니다.", hint: "(1 + 9) × 9 ÷ 2" },
        { ask: "한 줄의 합은?", answer: "15", why: "가로 세 줄에 모든 수가 한 번씩 들어가니 45 ÷ 3 = 15입니다.", hint: "45 ÷ 3" },
        { ask: "가운데 칸의 수는?", answer: "5", why: "가운데를 지나는 네 줄의 합 60 = 45 + 가운데 × 3이라 가운데는 5입니다.", hint: "15 ÷ 3" }
      ]
    },
    check: [["magic-square-three-target", "concept"], ["magic-square-three-complete", "type"], ["magic-square-four-target", "advanced"]]
  }],
  "0/2": [{
    id: "polygon-magic", title: "정다각별과 삼각진 — 두 번 세는 꼭짓점",
    recall: { figure: figTriangle(), text: "삼각형의 세 꼭짓점과 세 변의 가운데에 수를 하나씩 놓고, 변마다 세 수를 더합니다.", ask: "세 변의 합을 모두 더하면 꼭짓점의 수는 몇 번 세어지나?", options: ["두 번", "한 번", "세 번"], answer: 0, why: "꼭짓점마다 두 변이 만나요.", hint: "만나는 변의 수" },
    explore: [["drill", "magic", "마방진 연습"]],
    proofs: [],
    summary: {
      figure: figTriangle({ names: true, note: "세 변의 합 = 모든 수의 합 + (가 + 나 + 다)" }),
      terms: [["삼각진·원형진", "도형의 변이나 원 위에 수를 놓아 줄마다 합을 같게 만든 것"]],
      facts: ["(한 변의 합) × 변의 수 = 모든 수의 합 + <b>두 번 센 수들의 합</b>", "한 변의 합을 크게 하려면 꼭짓점에 큰 수를 놓는다", "가운데 원이 모든 줄에 들어가면, 그 수는 줄 수만큼 세어진다"]
    },
    pitfall: "꼭짓점 수를 한 번만 더하면 식이 맞지 않습니다. 겹치는 자리부터 표시합니다.",
    example: {
      prompt: "1부터 6까지의 수를 삼각형의 세 꼭짓점과 세 변의 가운데에 한 번씩 놓아, 각 변의 세 수의 합이 10이 되게 하려고 합니다. 꼭짓점 세 수의 합은 얼마여야 하나요?",
      figure: figTriangle(),
      steps: [
        { ask: "1부터 6까지의 합은?", answer: "21", why: "1 + 2 + … + 6 = 21입니다.", hint: "(1 + 6) × 6 ÷ 2" },
        { ask: "세 변의 합을 모두 더하면?", answer: "30", why: "10 × 3 = 30입니다.", hint: "10 × 3" },
        { ask: "꼭짓점 세 수의 합은?", answer: "9", why: "30 = 21 + 꼭짓점 합이므로 9입니다(예: 1, 3, 5).", hint: "30 − 21" }
      ]
    },
    check: [["circular-magic-seven-line-sum", "concept"], ["equal-line-sum", "type"], ["circular-magic-eleven-line-sum", "advanced"]]
  }],
  "1/1": [{
    id: "add-cryptarithm", title: "덧셈 복면산 — 자리마다 받아올림 따지기",
    recall: { figure: colCalc(["AB", "BA"], "+", "132"), text: "복면산은 같은 문자에 같은 숫자, 다른 문자에 다른 숫자를 넣어 식을 맞추는 퍼즐입니다.", ask: "두 자리 수 AB는 무엇과 같나?", options: ["A × 10 + B", "A + B", "A × B"], answer: 0, why: "A가 십의 자리라 10배예요.", hint: "자릿값" },
    explore: [["board", "book-03/cryptarithm-repeated"], ["drill", "crypt", "복면산 연습"]],
    proofs: [],
    summary: {
      figure: colCalc(["AB", "BA"], "+", "1□□", { hi: [0], carry: { 1: "1?" }, side: ["① 일의 자리 B + A부터 본다", "② 10이 넘으면 1을 받아올린다", "③ AB + BA = 11 × (A + B)"] }),
      terms: [["받아올림", "아래 자리의 합이 10 이상이면 윗자리에 1을 더한다"]],
      facts: ["일의 자리부터 보며 <b>받아올림이 있는지</b> 먼저 정한다", "AB + BA = 11 × (A + B) — 자리를 바꾼 두 수의 합은 11의 배수", "가장 높은 자리의 받아올림은 1뿐이다(두 수의 덧셈)"]
    },
    pitfall: "찾은 숫자를 식에 다시 넣어 확인합니다. 문자가 다르면 숫자도 달라야 합니다.",
    example: {
      prompt: "AB + BA = 132이고 A가 B보다 2 큽니다. A와 B를 구하세요.",
      figure: colCalc(["AB", "BA"], "+", "132"),
      steps: [
        { ask: "AB + BA = 11 × (A + B) — A + B는?", answer: "12", why: "132 ÷ 11 = 12입니다.", hint: "132 ÷ 11" },
        { ask: "A는? (A + B = 12, A − B = 2)", answer: "7", why: "(12 + 2) ÷ 2 = 7, B = 5입니다. 75 + 57 = 132로 확인됩니다.", hint: "(12 + 2) ÷ 2" }
      ]
    },
    check: [["two-digit-letter-cryptarithm", "concept"], ["cryptarithm-multi-symbol-carry", "type"], ["pyramid-cryptarithm-b8", "advanced"]]
  }],
  "1/2": [{
    id: "multiply-cryptarithm", title: "곱셈 복면산과 매트릭스 — 일의 자리로 좁히기",
    recall: { figure: colCalc(["38", "7"], "×", "266", { hi: [0], side: ["일의 자리: 8 × 7 = 56", "→ 곱의 일의 자리 6"] }), text: "곱셈 복면산은 곱의 일의 자리를 먼저 보면 후보가 크게 줄어듭니다.", ask: "제곱했을 때 일의 자리가 자기 자신인 한 자리 수는?", options: ["0, 1, 5, 6", "2, 4, 8", "3, 7, 9"], answer: 0, why: "0·1·5·6만 그래요.", hint: "□ × □의 끝자리" },
    explore: [["drill", "crypt", "복면산 연습"]],
    proofs: [],
    summary: {
      figure: colCalc(["△", "△"], "×", "□△", { hi: [0], side: ["일의 자리 △ × △의 끝 = △", "곱이 두 자리 → △는 4 이상"] }),
      terms: [["후보 좁히기", "일의 자리·가장 높은 자리 조건으로 가능한 숫자를 줄인다"]],
      facts: ["곱의 <b>일의 자리</b>는 곱하는 두 수의 일의 자리만으로 정해진다", "곱이 몇 자리인지로 가장 높은 자리의 크기를 좁힌다", "칸에 수를 넣는 매트릭스는 곱(합)이 가장 큰 줄부터 채운다"]
    },
    pitfall: "0은 가장 높은 자리에 올 수 없습니다.",
    example: {
      prompt: "△ × △ = □△ (두 자리 수)이고 △는 짝수입니다. △와 □를 구하세요.",
      figure: colCalc(["△", "△"], "×", "□△", { hi: [0] }),
      steps: [
        { ask: "제곱의 일의 자리가 자기 자신이고 두 자리가 되는 짝수 △는?", answer: "6", why: "후보 5, 6 가운데 짝수는 6입니다.", hint: "5 또는 6" },
        { ask: "□는?", answer: "3", why: "6 × 6 = 36입니다.", hint: "6 × 6" }
      ]
    },
    check: [["symbol-multiplication-chain", "concept"], ["number-card-mixed-operations", "type"], ["letter-pyramid-cryptarithm-b8", "advanced"]]
  }],
  "2/1": [{
    id: "gcd", title: "최대공약수 — 남김없이 똑같이 나누기",
    recall: { figure: board(["12의 약수: 1 2 3 4 6 12", "18의 약수: 1 2 3 6 9 18"]), text: "두 수를 모두 나누어떨어지게 하는 수를 공약수, 그중 가장 큰 수를 최대공약수라 합니다.", ask: "12와 18의 최대공약수는?", options: ["6", "3", "36"], answer: 0, why: "공약수 1, 2, 3, 6 중 가장 커요.", hint: "공약수 중 최대" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: ladder([["2", "30", "42"], ["3", "15", "21"]], ["5", "7"], ["공약수로 더 나눌 수 없을 때까지", "최대공약수 = 2 × 3 = 6", "(왼쪽에 나눈 수들의 곱)"]),
      terms: [["거꾸로 나눗셈", "두 수를 공약수로 차례로 나누어 내려가는 셈 — 몫에 1 말고 공약수가 없으면 멈춘다"], ["기약분수", "분자와 분모의 최대공약수가 1인 분수"]],
      facts: ["「될 수 있는 대로 많은 사람에게 남김없이 똑같이」 → <b>최대공약수</b>", "「가장 큰 정사각형으로 자르기」 → 가로·세로의 최대공약수", "「나누면 □가 남는다」 → 그 수에서 □를 빼고 공약수를 찾는다(□보다 커야 한다)"]
    },
    pitfall: "나머지가 있는 문제에서 나누는 수는 나머지보다 커야 합니다.",
    example: {
      prompt: "사과 48개와 배 36개를 될 수 있는 대로 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 줄 수 있고, 한 명이 사과를 몇 개 받나요?",
      figure: ladder([["?", "48", "36"], ["?", "?", "?"]], ["?", "?"], ["최대공약수 = ?"]),
      steps: [
        { ask: "48과 36의 최대공약수는?", answer: "12", why: "2로 나누면 24, 18 → 2로 나누면 12, 9 → 3으로 나누면 4, 3이라 2 × 2 × 3 = 12입니다.", hint: "거꾸로 나눗셈" },
        { ask: "한 명이 받는 사과는?", answer: "4", unit: "개", why: "48 ÷ 12 = 4입니다(배는 3개).", hint: "48 ÷ 12" }
      ]
    },
    check: [["c2-gcd-word", "concept"], ["c2-unit-fraction", "type"], ["c2-gcd-word", "advanced"]]
  }],
  "2/2": [{
    id: "lcm", title: "최소공배수와 연속수 — 다시 함께 만나는 때",
    recall: { figure: board(["12의 배수: 12 24 36 48 …", "18의 배수: 18 36 54 …"]), text: "두 수의 배수 가운데 공통인 것을 공배수, 그중 가장 작은 것을 최소공배수라 합니다.", ask: "12와 18의 최소공배수는?", options: ["36", "72", "6"], answer: 0, why: "처음으로 함께 나오는 배수예요.", hint: "공통인 배수 중 최소" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: ladder([["2", "12", "18"], ["3", "6", "9"]], ["2", "3"], ["최대공약수 = 2 × 3 = 6", "최소공배수 = 2 × 3 × 2 × 3 = 36", "(나눈 수 × 마지막 몫)"]),
      terms: [["공배수", "두 수 모두의 배수 — 최소공배수의 배수들"]],
      facts: ["「동시에 다시 출발·켜짐」 → <b>최소공배수</b>", "거꾸로 나눗셈에서 최소공배수 = 왼쪽 나눈 수들 × <b>마지막 몫</b>", "「어느 수로 나누어도 □가 남는다」 → 최소공배수의 배수 + □", "연속한 세 수가 차례로 배수일 때는 첫째 수를 배수로 하나씩 놓아 본다"]
    },
    pitfall: "최대공약수와 최소공배수를 바꾸어 쓰지 않습니다 — 「나누기」는 약수, 「다시 만나기」는 배수입니다. 최소공배수에는 마지막 몫까지 곱합니다.",
    example: {
      prompt: "㉮ 버스는 15분마다, ㉯ 버스는 20분마다 떠납니다. 오전 9시에 함께 떠났다면 다음에 함께 떠나는 것은 몇 분 뒤이고, 그다음은 몇 분 뒤인가요?",
      figure: ladder([["5", "15", "20"]], ["?", "?"], ["최소공배수 = 5 × ? × ?"]),
      steps: [
        { ask: "처음 다시 함께 떠나는 것은 몇 분 뒤?", answer: "60", unit: "분", why: "5로 나누면 몫이 3, 4라 최소공배수는 5 × 3 × 4 = 60입니다(오전 10시).", hint: "5 × 3 × 4" },
        { ask: "그다음은 처음부터 몇 분 뒤?", answer: "120", unit: "분", why: "60의 배수마다 만나므로 120분 뒤(오전 11시)입니다.", hint: "60 × 2" }
      ]
    },
    check: [["c2-lcm-word", "concept"], ["c2-consecutive-multiples", "type"], ["c2-lcm-word", "advanced"]]
  }],
  "2/3": [{
    id: "gcd-lcm-ratio", title: "최대공약수와 최소공배수 — 비로 두 수 찾기",
    recall: { figure: ladder([["G", "A", "B"]], ["3", "5"]), text: "A와 B를 최대공약수 G로 나눈 몫이 3과 5라면 A = G × 3, B = G × 5입니다.", ask: "그때 A : B는?", options: ["3 : 5", "5 : 3", "G : 15"], answer: 0, why: "같은 G를 곱했으니 몫의 비와 같아요.", hint: "G × 3, G × 5" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: ladder([["G", "A", "B"]], ["3", "5"], ["최대공약수 = G", "최소공배수 = G × 3 × 5", "A : B = 3 : 5"]),
      terms: [["서로소", "공약수가 1뿐인 두 수(3과 5)"]],
      facts: ["A : B = 3 : 5 (3과 5는 서로소) → A = G × 3, B = G × 5, 최대공약수 = <b>G</b>", "최소공배수 = G × 3 × 5", "두 수의 곱 = 최대공약수 × 최소공배수"]
    },
    pitfall: "비가 6 : 10처럼 약분되는 꼴이면 먼저 3 : 5로 바꾼 뒤 G를 찾습니다.",
    example: {
      prompt: "두 자연수 A, B의 비가 3 : 5이고 최소공배수가 90입니다. A와 B를 구하세요.",
      figure: ladder([["?", "A", "B"]], ["3", "5"], ["최소공배수 = 90"]),
      steps: [
        { ask: "최소공배수 = G × 3 × 5 = G × 15 — G는?", answer: "6", why: "90 ÷ 15 = 6입니다.", hint: "90 ÷ 15" },
        { ask: "A는?", answer: "18", why: "6 × 3 = 18, B = 6 × 5 = 30입니다.", hint: "6 × 3" }
      ]
    },
    check: [["c2-ratio-gcd-lcm", "concept"], ["c2-ratio-gcd-lcm", "type"], ["c2-unit-fraction", "advanced"]]
  }],
  "3/1": [{
    id: "ratio-balance", title: "양팔저울과 연비 — 몇 배가 같을 때",
    recall: { figure: balance(3, ball, 5, cube), text: "양팔저울이 평평하면 양쪽 무게가 같습니다. 공 3개와 상자 5개가 평평하게 놓였습니다.", ask: "하나가 더 가벼운 것은?", options: ["상자", "공", "같다"], answer: 0, why: "5개가 있어야 3개와 같아지니 상자 하나가 더 가벼워요.", hint: "개수가 많은 쪽" },
    explore: [["board", "book-06/bar-balance-ratio-source"], ["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: balance(3, ball, 5, cube, { notes: ["공 × 3 = 상자 × 5 → 공 : 상자 = 5 : 3"] }),
      terms: [["연비", "세 양 이상의 비 — 같은 양을 기준으로 이어 붙인다"]],
      facts: ["A × 3 = B × 5 → A : B = <b>5 : 3</b>(곱한 수를 엇갈려 쓴다)", "합이나 차가 몇 칸인지로 한 칸의 값을 구한다", "A : B와 B : C를 이을 때는 B의 칸 수를 같게 맞춘다"]
    },
    pitfall: "비를 거꾸로 쓰지 않았는지, 구한 값을 처음 조건에 넣어 확인합니다.",
    example: {
      prompt: "빨간 상자 3개의 무게와 파란 상자 5개의 무게가 같고, 빨간 상자 하나가 파란 상자 하나보다 4kg 무겁습니다. 빨간 상자 하나는 몇 kg인가요?",
      figure: balance(3, redBox, 5, blueBox, { step: 26 }),
      steps: [
        { ask: "빨간 상자 : 파란 상자 = 5 : □", answer: "3", why: "빨강 × 3 = 파랑 × 5이므로 5 : 3입니다.", hint: "곱한 수를 엇갈려" },
        { ask: "한 칸은 몇 kg? (차 2칸 = 4kg)", answer: "2", unit: "kg", why: "4 ÷ 2 = 2입니다.", hint: "4 ÷ 2" },
        { ask: "빨간 상자 하나는?", answer: "10", unit: "kg", why: "5칸 × 2 = 10kg(파란 상자 6kg)이고 10 × 3 = 6 × 5 = 30으로 확인됩니다.", hint: "5 × 2" }
      ]
    },
    check: [["c2-ratio-difference", "concept"], ["two-object-weight-unit-test-book6", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "3/2": [{
    id: "sum-difference", title: "합과 차를 이용한 문제해결",
    recall: { figure: figSumDiff, text: "두 수의 합과 차를 알면, 합에 차를 더한 값은 큰 수의 두 배입니다.", ask: "합 10, 차 4인 두 수의 큰 수는?", options: ["7", "6", "3"], answer: 0, why: "(10 + 4) ÷ 2 = 7이에요.", hint: "(합 + 차) ÷ 2" },
    explore: [["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: shapeSums([["●", "■", "□"], ["■", "◆", "□"], ["◆", "●", "□"]], "세 식을 모두 더하면 ●, ■, ◆가 두 번씩"),
      terms: [["짝지은 합", "같은 모양은 같은 수 — 두 개씩 더한 합으로 각 수를 찾는다"]],
      facts: ["세 수를 두 개씩 더한 합 셋을 모두 더하면 <b>(세 수의 합) × 2</b>", "세 수의 합에서 짝지은 합 하나를 빼면 남은 한 수", "두 수일 때: 큰 수 = (합 + 차) ÷ 2, 작은 수 = (합 − 차) ÷ 2"]
    },
    pitfall: "세 식을 더한 값은 세 수의 합의 2배입니다. 2로 나누는 것을 빠뜨리지 않습니다.",
    example: {
      prompt: "같은 모양은 같은 수를 나타냅니다. ● + ■ = 9, ■ + ◆ = 13, ◆ + ● = 10일 때 ◆는 얼마인가요?",
      figure: shapeSums([["●", "■", "9"], ["■", "◆", "13"], ["◆", "●", "10"]]),
      steps: [
        { ask: "세 식의 오른쪽을 모두 더하면?", answer: "32", why: "9 + 13 + 10 = 32입니다.", hint: "9 + 13 + 10" },
        { ask: "● + ■ + ◆는?", answer: "16", why: "세 모양이 두 번씩 더해졌으니 32 ÷ 2 = 16입니다.", hint: "32 ÷ 2" },
        { ask: "◆는?", answer: "7", why: "16 − (● + ■) = 16 − 9 = 7입니다(● = 3, ■ = 6으로 세 식 모두 맞습니다).", hint: "16 − 9" }
      ]
    },
    check: [["two-class-total-difference", "concept"], ["two-type-unit-total", "type"], ["symbol-relation", "advanced"]]
  }],
  "3/3": [{
    id: "assume", title: "가정하여 해결하기 — 모두 한 가지라면",
    recall: { figure: figLegs, text: "닭과 토끼가 섞여 있을 때, 모두 닭이라고 가정해 다리를 세면 실제와 차이가 납니다.", ask: "닭 하나를 토끼로 바꾸면 다리는?", options: ["2개 늘어난다", "4개 늘어난다", "그대로"], answer: 0, why: "4 − 2 = 2예요.", hint: "4 − 2" },
    explore: [["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: table([["닭(다리 2)", "10", "9", "8", "7", "…"], ["토끼(다리 4)", "0", "1", "2", "3", "…"], ["다리 수의 합", "20", "22", "24", "26", "…"]], { hiCol: 0 }),
      terms: [["가정하여 풀기", "모두 한 가지라고 놓고 실제와의 차이를 나누어 바꾸는 개수를 찾는다"]],
      facts: ["표의 첫 칸 = <b>모두 닭이라고 가정</b> — 하나씩 바꿀 때마다 다리가 2개씩 는다", "바꾸는 개수 = (실제 − 가정한 값) ÷ (하나 바꿀 때 달라지는 양)", "맞히면 +4점, 틀리면 −1점: 하나 틀릴 때마다 <b>4 + 1 = 5점</b>씩 줄어든다"]
    },
    pitfall: "점수 문제에서 하나 틀리면 받을 점수(4점)를 못 받고 잃는 점수(1점)까지 빠지니 4 + 1 = 5점이 줄어듭니다(1점만 줄어드는 것이 아닙니다).",
    example: {
      prompt: "닭과 토끼가 모두 12마리 있고 다리는 모두 34개입니다. 토끼는 몇 마리인가요?",
      figure: table([["닭(다리 2)", "12", "11", "10", "…", "?"], ["토끼(다리 4)", "0", "1", "2", "…", "?"], ["다리 수의 합", "24", "26", "28", "…", "34"]], { hiCol: 0 }),
      steps: [
        { ask: "모두 닭이라면 다리는?", answer: "24", unit: "개", why: "12 × 2 = 24입니다.", hint: "12 × 2" },
        { ask: "실제보다 몇 개 적은가요?", answer: "10", unit: "개", why: "34 − 24 = 10입니다.", hint: "34 − 24" },
        { ask: "토끼는?", answer: "5", unit: "마리", why: "하나 바꿀 때 2개씩 늘어 10 ÷ 2 = 5마리(닭 7마리)입니다.", hint: "10 ÷ 2" }
      ]
    },
    check: [["c2-assume-solve", "concept"], ["c2-assume-solve", "type"], ["c2-assume-solve", "advanced"]]
  }]
};
