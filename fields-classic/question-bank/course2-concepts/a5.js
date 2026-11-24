// 2과정 A5 「소인수분해와 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 분수·거듭제곱은 「3/5」「2^3」으로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, rect, circle, line, arrow, dot, at, P, INK, GREEN, SOFT, MARK, YELLOW, formulas, mathLabel, SHADOW } from "./pack-kit.js?v=20261123b";
import { dimOut } from "../length-dim.js?v=20261124a";
// 길이 표시(스킬 gfield-textbook-design 4-3): 구간 두 끝을 잇는 바깥 곡선 점선 + 가운데 끊은 자리에 수·단위. c = 도형 안쪽 점(그 반대쪽으로 휜다).
// beside: 글자가 넓은 세로 구간(높이 등)은 점선을 끊지 않고 글자를 곡선 꼭대기 바깥 옆에 둔다.
const dim = (a, b, c, t, { off = 12, color = null, size = 13, beside = false } = {}) => dimOut(a, b, c, t, { off, size, labelColor: color, ...(beside ? { gap: 999 } : {}) });

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
// ── 그림(원장 2026-11-22 「SVG로 그림질 높여」 — 장면 그림은 손으로 다시) ──
// 소인수분해 나무: 둥근 마디 + 가지, 다 쪼갠 소수는 초록 원
const node = (x, y, v, prime = false) => (prime
  ? circle(P(x, y), 15, { fill: SOFT, color: GREEN, width: 1.6 }) + text(x, y + 0.5, v, { size: 15, weight: 700, color: GREEN })
  : rect(x - 19, y - 14, 38, 28, { fill: YELLOW, color: "#b89a4a", width: 1.4, rx: 14, shadow: true }) + text(x, y + 0.5, v, { size: 16, weight: 700 }));
const twig = (a, b) => line(a, b, { color: "#9aa8a0", width: 1.6 });
const figTree = (note = true) => () => svg(300, 176,
  twig(P(150, 30), P(104, 70)) + twig(P(150, 30), P(196, 70)) + twig(P(104, 70), P(78, 112)) + twig(P(104, 70), P(130, 112)) + twig(P(196, 70), P(172, 112)) + twig(P(196, 70), P(222, 112))
  + twig(P(78, 112), P(60, 148)) + twig(P(78, 112), P(96, 148))
  + node(150, 26, "72") + node(104, 70, "8") + node(196, 70, "9") + node(78, 112, "4") + node(130, 112, "2", true) + node(172, 112, "3", true) + node(222, 112, "3", true)
  + node(60, 150, "2", true) + node(96, 150, "2", true) + (note ? label(236, 156, "72 = 2^3 × 3^2", { size: 13, color: GREEN, weight: 700 }) : ""), "소인수분해 나무");
// 두 원이 겹친 그림: 둥근 전체 판 + 반투명 두 원(겹친 곳이 진해짐)
const figVenn = ({ a = "11", ab = "7", b = "8", out = "4", all = "" } = {}) => () => svg(320, 160,
  rect(8, 8, 304, 144, { fill: "#f4f1e8", color: "#cfc6b0", width: 1.4, rx: 10 }) + label(26, 24, all ? `전체 ${all}` : "전체 반", { anchor: "start", size: 11 })
  + `<circle cx="122" cy="84" r="54" fill="#cfe5d5" fill-opacity=".75" stroke="${GREEN}" stroke-width="1.6"/>`
  + `<circle cx="198" cy="84" r="54" fill="#fde3a0" fill-opacity=".7" stroke="#b89a4a" stroke-width="1.6"/>`
  + text(96, 86, a, { size: 17, color: a === "?" ? MARK : INK }) + text(160, 86, ab, { size: 18, weight: 700, color: ab === "?" ? MARK : "#7a5a12" }) + text(226, 86, b, { size: 17, color: b === "?" ? MARK : INK })
  + label(104, 22, "축구 18", { color: GREEN, weight: 700 }) + label(216, 22, "야구 15", { color: "#8a6a1e", weight: 700 })
  + label(290, 136, `둘 다 안 함 ${out}`, { anchor: "end", size: 11, color: out === "?" ? MARK : "#56627f" }), "두 원이 겹친 그림");
// 튀어 오르는 공: 바닥 + 공이 지나간 길(점선 포물선, 높이가 2/3씩 줄어듦) + 높이 표시
const figBounce = (tags = ["81", "54", "36", "24"]) => () => {
  const ground = 132, k = 1.2, L = [40, 124, 194, 252, 298], hs = [81, 54, 36, 24, 16];
  let body = rect(8, ground, 304, 9, { fill: "#e8e2d2", color: "none", width: 0, rx: 2 }) + line(P(8, ground), P(312, ground), { color: "#9a8f74", width: 1.4 });
  const arc = (x0, x1, h) => `<path d="M ${x0} ${ground} Q ${(x0 + x1) / 2} ${ground - h * k * 2} ${x1} ${ground}" fill="none" stroke="#9aa8a0" stroke-width="1.4" stroke-dasharray="3 3"/>`;
  body += line(P(L[0], ground - hs[0] * k), P(L[0], ground), { color: "#9aa8a0", width: 1.4, dash: "3 3" });
  for (let i = 0; i < 4; i += 1) body += arc(L[i], L[i + 1], hs[i + 1]);
  const tops = [[L[0], hs[0]], ...[1, 2, 3].map((i) => [(L[i - 1] + L[i]) / 2, hs[i]])];
  tops.forEach(([x, h], i) => {
    const y = ground - h * k;
    body += line(P(x, y), P(x, ground), { color: i ? "#d8c58a" : "#8fb39c", width: 1.1 })
      + `<circle cx="${x}" cy="${y}" r="6.5" fill="${i ? "#f4b860" : "#e58a5a"}" stroke="#8a4a2a" stroke-width="1.1" ${SHADOW}/>`
      + text(x, y - 15, tags[i] ?? "", { size: 13, weight: 700, color: tags[i] === "?" ? MARK : i ? "#7a5a12" : GREEN });
  });
  return svg(320, 156, `<g transform="translate(0,6)">${body}</g>` + label(250, 26, "튈 때마다 × 2/3", { size: 11 }), "튀어 오른 높이");
};
// 연못과 두 막대: 물(위가 밝은 그라데이션)·물결·바닥, 막대의 잠긴 부분은 물빛, 깊이 화살표
const figPond = (fa = "1/3", fb = "1/5") => () => {
  const top = 66, bottom = 150;
  const stick = (x, y0, name, frac) => rect(x, y0, 14, bottom - y0, { fill: "#d9b37c", color: "#8a6a3b", width: 1.3, rx: 2, shadow: true })
    + `<rect x="${x}" y="${top}" width="14" height="${bottom - top}" fill="#5f8fb8" fill-opacity=".28"/>`
    + label(x + 7, y0 - 12, name, { size: 11 }) + label(x + 30, (top + bottom) / 2, frac, { size: 12, color: "#2f5f8a", anchor: "start", weight: 700 });
  let body = rect(16, top, 268, bottom - top, { fill: "#cfe3f3", color: "none", width: 0, rx: 3 })
    + `<path d="M 16 ${top} q 11 -5 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 24 0" fill="none" stroke="#7fa7c9" stroke-width="1.6"/>`
    + rect(10, bottom, 280, 10, { fill: "#e8e2d2", color: "#9a8f74", width: 1.2, rx: 2 });
  body += stick(112, 26, "짧은 막대", `${fa} 잠김`) + stick(212, 6, "긴 막대", `${fb} 잠김`);
  body += dim(P(30, top), P(30, bottom), P(0, (top + bottom) / 2), "깊이 ?", { color: "#2f5f8a", beside: true });
  return svg(300, 188, `<g transform="translate(0,20)">${body}</g>`, "연못과 두 막대");
};

const ASK = (v) => (v === "?" ? MARK : INK);   // 「?」는 빨강 — 아직 모르는 칸
// 표(원본 교재의 배수판정법 표·「변하지 않는 것」 표처럼): rows = 줄마다 칸 글, 첫 줄은 머리. 칸 글은 분수·거듭제곱을 수식으로(mathLabel)
const table = (rows, widths, { rh = 30, hiCol = -1, hiRow = -1 } = {}) => () => {
  let body = "";
  rows.forEach((r, k) => {
    let x = 6;
    r.forEach((v, c) => {
      const w = widths[c], head = k === 0 || c === 0;
      body += rect(x, 6 + k * rh, w, rh, { fill: c === hiCol && k > 0 || k === hiRow ? YELLOW : head ? SOFT : "#fff", color: "#9aa8a0", width: 1.1 })
        + mathLabel(x + w / 2, 6 + k * rh + rh / 2, v, { size: head ? 13 : 15, color: v === "?" ? MARK : INK, weight: head ? 700 : 600 });
      x += w;
    });
  });
  return svg(widths.reduce((a, b) => a + b, 0) + 12, rows.length * rh + 12, body, "표");
};
// 숫자 칸(자리마다 한 칸) + 아래 설명: ㉠56㉡ 같은 빈칸 수
const digitCards = (digits, notes = []) => () => {
  const cw = 40, x0 = 150 - (digits.length * cw) / 2;
  let body = digits.map((d, i) => rect(x0 + i * cw + 3, 10, cw - 6, 44, { fill: /[㉠-㉭]/.test(d) ? YELLOW : "#fff", color: "#6d7a72", width: 1.3, rx: 6, shadow: true }) + text(x0 + i * cw + cw / 2, 32.5, d, { size: 20, weight: 700 })).join("");
  notes.forEach(([from, to, t], k) => {
    const xa = x0 + from * cw + 4, xb = x0 + (to + 1) * cw - 4, y = 64 + k * 30;
    body += line(P(xa, y), P(xb, y), { color: GREEN, width: 1.4 }) + line(P(xa, y - 5), P(xa, y), { color: GREEN, width: 1.4 }) + line(P(xb, y - 5), P(xb, y), { color: GREEN, width: 1.4 })
      + label((xa + xb) / 2, y + 12, t, { size: 12, color: GREEN, weight: 700 });
  });
  return svg(300, 64 + notes.length * 30 + 6, body, "숫자 칸");
};
// 거꾸로 나눗셈으로 소인수분해(원본 교재의 첫째 방법 「나눗셈」): 소수로만 차례로 나눈다
const primeLadder = (n, divs, side = []) => () => {
  const rh = 28, top = 8;
  let v = n, body = "";
  divs.forEach((d, k) => {
    const y = top + k * rh;
    body += text(34, y + rh / 2, d, { size: 17, color: ASK(d) }) + text(82, y + rh / 2, String(v), { size: 17 })
      + line(P(52, y + 4), P(52, y + rh - 2), { width: 1.4 }) + line(P(52, y + rh - 2), P(114, y + rh - 2), { width: 1.4 });
    if (d !== "?") v /= Number(d);
  });
  body += text(82, top + divs.length * rh + rh / 2, divs.includes("?") ? "?" : String(v), { size: 17, color: divs.includes("?") ? MARK : GREEN });
  side.forEach((t, k) => { body += label(140, top + 18 + k * 26, t, { anchor: "start", size: 14 }); });
  return svg(side.length ? 330 : 150, top + (divs.length + 1) * rh + 10, body, "나눗셈으로 소인수분해");
};
// 분수 막대(원본 교재처럼 같은 길이의 막대를 같은 크기로 나누어 칠함)
const fracBars = (rows) => () => {
  const x0 = 60, W = 210, h = 22;
  let body = "";
  rows.forEach(([n, d], k) => {
    const y = 8 + k * 32;
    for (let i = 0; i < d; i += 1) body += rect(x0 + (W / d) * i, y, W / d, h, { fill: i < n ? YELLOW : "#fff", color: "#9a8f74", width: 1.1 });
    body += mathLabel(30, y + h / 2, `${n}/${d}`, { size: 15 });
  });
  return svg(300, rows.length * 32 + 10, body, "분수 막대");
};
// 수직선: marks = [[자리 0~1, 위 글, 아래 글]]
const numberLine = (marks, { from = 0, to = 1, ticks = 4 } = {}) => () => {
  const x0 = 30, x1 = 290, y = 50, X = (t) => x0 + ((t - from) / (to - from)) * (x1 - x0);
  let body = line(P(x0 - 10, y), P(x1 + 10, y), { color: INK, width: 1.8 });
  for (let i = 0; i <= ticks; i += 1) { const x = x0 + ((x1 - x0) * i) / ticks; body += line(P(x, y - 7), P(x, y + 7), { color: INK, width: 1.4 }); }
  marks.forEach(([t, up, down]) => {
    const x = X(t);
    if (up) body += mathLabel(x, y - 24, up, { size: 15, color: up === "?" ? MARK : INK });
    if (down) body += mathLabel(x, y + 24, down, { size: 13, color: down === "?" ? MARK : "#56627f" });
    if (up === "?") body += dot(P(x, y), 4.2, MARK);
  });
  return svg(320, 86, body, "수직선");
};
// 거꾸로 풀기 흐름: 칸 → (곱하는 분수) → 칸 …, 아래에는 거꾸로 가는 화살표
const chain = (boxes, ops, back = []) => () => {
  const bw = 62, gap = ops.some((o) => o.length > 6) ? 104 : 56, x0 = 8, y = 18, bh = 34;
  let body = "";
  boxes.forEach((t, i) => {
    const x = x0 + i * (bw + gap);
    body += rect(x, y, bw, bh, { fill: t === "?" ? "#fff" : i === boxes.length - 1 ? YELLOW : SOFT, color: "#6d7a72", width: 1.3, rx: 8, shadow: true }) + mathLabel(x + bw / 2, y + bh / 2, t, { size: 14, color: ASK(t) });
    if (i < ops.length) {
      body += arrow(P(x + bw + 4, y + 12), P(x + bw + gap - 4, y + 12), { color: "#8a948f", width: 1.6 }) + mathLabel(x + bw + gap / 2, y - 8, ops[i], { size: 12, color: GREEN });
      if (back[i]) body += arrow(P(x + bw + gap - 4, y + 26), P(x + bw + 4, y + 26), { color: MARK, width: 1.4 }) + mathLabel(x + bw + gap / 2, y + bh + 14, back[i], { size: 12, color: MARK });
    }
  });
  return svg(x0 * 2 + boxes.length * bw + (boxes.length - 1) * gap, back.length ? 82 : 60, body, "거꾸로 풀기");
};
// 지구 둘레 재기(원본 교재가 이 단원을 여는 이야기 — 우리가 다시 그린 단순한 모양): 둥근 땅, 가운데에서 두 곳으로 그은 선, 그 사이 각과 땅 위 거리
const figEarth = () => {
  const c = P(120, 124), r = 92, a1 = 68, a2 = 112;
  const p1 = at(c, r, a1), p2 = at(c, r, a2), q1 = at(c, 26, a1), q2 = at(c, 26, a2);
  return svg(320, 230, `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="#cfe3f3" stroke="#2f5f8a" stroke-width="1.6" ${SHADOW}/>`
    + `<path d="M ${p2.x} ${p2.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}" fill="none" stroke="${MARK}" stroke-width="4" stroke-linecap="round"/>`
    + line(c, p1, { color: INK, width: 1.4 }) + line(c, p2, { color: INK, width: 1.4 }) + dot(c, 3.4) + dot(p1, 4, MARK) + dot(p2, 4, MARK)
    + `<path d="M ${q2.x} ${q2.y} A 26 26 0 0 1 ${q1.x} ${q1.y}" fill="none" stroke="${GREEN}" stroke-width="1.8"/>`
    + label(c.x, c.y - 38, "각", { size: 13, color: GREEN, weight: 700 }) + label(c.x, p1.y - 16, "두 곳 사이 거리", { size: 12, color: MARK })
    + label(226, 112, "각 : 한 바퀴(360°)", { anchor: "start", size: 14 }) + label(226, 138, "= 거리 : 둘레", { anchor: "start", size: 14 }), "지구 둘레 재기");
};

export const PACKS = {
  "0/1": [{
    id: "divisibility", title: "배수판정법 — 나누지 않고 배수 알아보기",
    recall: { figure: board(["3의 배수: 각 자리 숫자의 합이 3의 배수", "4의 배수: 끝 두 자리가 4의 배수"]), text: "큰 수가 어떤 수의 배수인지는 끝자리나 각 자리 숫자의 합으로 알아볼 수 있습니다.", ask: "4512는 9의 배수일까요? (4 + 5 + 1 + 2 = 12)", options: ["아니다", "그렇다"], answer: 0, why: "12는 9의 배수가 아니에요.", hint: "자리 숫자의 합" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: table([["나누어 보기", "어떤 수의 배수", "무엇을 보나"], ["10 = 2 × 5", "2, 5", "끝 한 자리"], ["100 = 4 × 25", "4, 25", "끝 두 자리"], ["1000 = 8 × 125", "8, 125", "끝 세 자리"], ["", "3, 9", "자리 숫자의 합"]], [112, 96, 104]),
      terms: [["배수판정법", "나누지 않고 끝자리·자리 숫자의 합으로 배수인지 알아보는 방법"]],
      facts: ["2·5: 끝자리 · 4: 끝 두 자리 · 8: 끝 세 자리 · 3·9: 자리 숫자의 합", "36의 배수 = <b>4의 배수이면서 9의 배수</b>(서로 공약수가 1뿐인 두 수로 나눈다)", "빈칸이 둘이면 끝자리 조건으로 먼저 줄이고 합 조건으로 맞춘다"]
    },
    pitfall: "36 = 6 × 6으로 나누면 안 됩니다. 6과 6은 공약수가 6이라 두 판정을 합칠 수 없습니다.",
    example: {
      prompt: "네 자리 수 ㉠56㉡이 36의 배수일 때, 이런 수 가운데 가장 큰 수를 구하세요.",
      figure: digitCards(["㉠", "5", "6", "㉡"], [[2, 3, "끝 두 자리 → 4의 배수"], [0, 3, "자리 숫자의 합 → 9의 배수"]]),
      steps: [
        { ask: "끝 두 자리 6㉡이 4의 배수가 되는 ㉡은 몇 가지? (0·4·8)", answer: "3", unit: "가지", why: "60, 64, 68이 4의 배수입니다.", hint: "60, 64, 68" },
        { ask: "㉡ = 8일 때 ㉠ + 5 + 6 + 8이 9의 배수인 ㉠은?", answer: "8", why: "8 + 5 + 6 + 8 = 27입니다.", hint: "합 27" },
        { ask: "가장 큰 수는?", answer: "8568", why: "㉡ = 8, ㉠ = 8일 때가 가장 크고 8568 = 36 × 238입니다.", hint: "8 5 6 8" }
      ]
    },
    check: [["c2-divisibility-digits", "concept"], ["c2-divisibility-digits", "type"], ["c2-divisibility-digits", "advanced"]]
  }],
  "0/2": [{
    id: "prime-factor", title: "소인수분해와 제곱수",
    recall: { figure: figTree(), text: "수를 소수(1과 자기 자신만으로 나누어떨어지는 수)들의 곱으로 나타내는 것을 소인수분해라 합니다.", ask: "12를 소인수분해하면?", options: ["2 × 2 × 3", "3 × 4", "2 × 6"], answer: 0, why: "4와 6은 소수가 아니라 더 쪼개요.", hint: "소수만 남기기" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: figTree(),
      terms: [["소수", "2, 3, 5, 7, 11 … — 약수가 1과 자기 자신뿐인 수"]],
      facts: ["소인수분해는 나무(가지)로 쪼개도, 소수로 거꾸로 나누어 내려가도 같다", "제곱수 = 소인수분해했을 때 거듭제곱이 <b>모두 짝수 번</b>", "제곱수로 만들려면 홀수 번인 소인수를 하나씩 더 곱한다(또는 나눈다)", "연속한 세 수의 곱은 소인수를 가까운 세 수로 묶어 찾는다"]
    },
    pitfall: "1은 소수가 아닙니다. 소인수분해에 1은 쓰지 않습니다.",
    example: {
      prompt: "72에 가장 작은 자연수를 곱하여 어떤 수의 제곱이 되게 하려고 합니다. 곱할 수와 그때 어떤 수를 구하세요.",
      figure: primeLadder(72, ["2", "2", "2", "3"], ["72 = 2^□ × 3^2", "나누는 수는 소수만"]),
      steps: [
        { ask: "72 = 2^□ × 3^2 의 □는?", answer: "3", why: "2로 세 번, 3으로 두 번 나누어져 72 = 2 × 2 × 2 × 3 × 3입니다.", hint: "2로 나눈 횟수" },
        { ask: "곱할 가장 작은 수는?", answer: "2", why: "2가 홀수 번(3번)이라 하나 더 곱해 4번으로 만듭니다.", hint: "홀수 번인 소인수" },
        { ask: "72 × 2 = 144 = □ × □ 의 □는?", answer: "12", why: "2^4 × 3^2 = (2^2 × 3) × (2^2 × 3) = 12 × 12입니다.", hint: "12 × 12" }
      ]
    },
    check: [["c2-square-multiplier", "concept"], ["c2-consecutive-product", "type"], ["c2-square-multiplier", "advanced"]]
  }],
  "0/3": [{
    id: "factorial-zeros", title: "10의 거듭제곱과 팩토리얼 — 끝자리 0 세기",
    recall: { figure: board(["10 = 2 × 5", "1 × 2 × 3 × 4 × 5 = 120"]), text: "1부터 N까지 모두 곱한 수를 N!(N 팩토리얼)이라 씁니다. 끝자리 0은 2 × 5가 하나 생길 때마다 하나 붙습니다.", ask: "5! = 120의 끝자리 0은?", options: ["1개", "2개", "0개"], answer: 0, why: "5가 한 번 들어 있어요.", hint: "5의 개수" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: board(["0의 개수 = 5의 개수", "N ÷ 5 + N ÷ 25 + N ÷ 125 … (몫)"]),
      terms: [["팩토리얼", "N! = 1 × 2 × … × N"]],
      facts: ["2는 5보다 늘 많으니 <b>5의 개수</b>만 센다", "25의 배수에는 5가 두 번, 125의 배수에는 세 번 — 몫을 차례로 더한다", "2^3 × 5^2 = 2 × (2 × 5) × (2 × 5)처럼 끝자리 0은 2와 5 중 <b>적게 곱한 쪽의 개수</b>만큼"]
    },
    pitfall: "N ÷ 5의 몫만 세면 25, 50, 75 …에 숨은 5를 하나씩 빠뜨립니다.",
    example: {
      prompt: "150!(1 × 2 × … × 150)의 끝자리에는 0이 몇 개 이어지나요?",
      figure: board(["5의 배수: 150 ÷ 5 = ?", "5^2(= 25)의 배수: 150 ÷ 25 = ?", "5^3(= 125)의 배수: 150 ÷ 125 = ? (몫)"]),
      steps: [
        { ask: "150까지 5의 배수는 몇 개?", answer: "30", unit: "개", why: "150 ÷ 5 = 30입니다.", hint: "150 ÷ 5" },
        { ask: "그중 25의 배수(5가 하나 더)는?", answer: "6", unit: "개", why: "150 ÷ 25 = 6입니다.", hint: "150 ÷ 25" },
        { ask: "그중 125의 배수(5가 또 하나 더)는?", answer: "1", unit: "개", why: "125 하나뿐입니다(150 ÷ 125의 몫 1).", hint: "150 ÷ 125의 몫" },
        { ask: "끝자리 0은 모두 몇 개?", answer: "37", unit: "개", why: "30 + 6 + 1 = 37입니다.", hint: "30 + 6 + 1" }
      ]
    },
    check: [["c2-factorial-zeros", "concept"], ["c2-power-ten-zeros", "type"], ["c2-factorial-zeros", "advanced"]]
  }],
  "1/1": [{
    id: "equivalent", title: "크기가 같은 분수 — 조건으로 찾기",
    recall: { figure: fracBars([[2, 3], [4, 6], [6, 9]]), text: "길이가 같은 막대를 3칸, 6칸, 9칸으로 나누어 칠한 부분의 크기가 같습니다. 분자와 분모에 같은 수를 곱하면 크기가 같은 분수가 됩니다.", ask: "2/3과 크기가 같은 것은?", options: ["10/15", "10/12", "3/4"], answer: 0, why: "분자·분모에 5를 곱했어요.", hint: "× 5" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: board(["2/3 = (2 × □)/(3 × □)"]),
      terms: [["기약분수", "더 약분할 수 없는 분수"]],
      facts: ["2/3과 크기가 같은 분수 = 분자 2 × □, 분모 3 × □ — 합은 (2 + 3) × □, 차는 (3 − 2) × □", "분자와 분모에 <b>같은 수를 더하면</b> 크기는 바뀌지만 <b>차는 그대로</b>", "두 조건을 함께 만족하는 분수는 한 조건으로 후보를 쓰고 다른 조건으로 고른다"]
    },
    pitfall: "분자·분모에 같은 수를 더하는 것과 곱하는 것은 다릅니다. 더하면 크기가 달라집니다.",
    example: {
      prompt: "2/3과 크기가 같고, 분모와 분자의 합이 40인 분수를 구하세요.",
      figure: board(["2/3 = (2 × □)/(3 × □)"]),
      steps: [
        { ask: "2 × □ + 3 × □ = 5 × □ = 40 — □는?", answer: "8", why: "40 ÷ 5 = 8입니다.", hint: "40 ÷ 5" },
        { ask: "구하는 분수는? (분수로)", answer: "16/24", text: true, why: "2 × 8 = 16, 3 × 8 = 24이고 16 + 24 = 40입니다.", hint: "2 × 8, 3 × 8" }
      ]
    },
    check: [["c2-equivalent-condition", "concept"], ["c2-equivalent-condition", "type"], ["c2-equivalent-condition", "advanced"]]
  }],
  "1/2": [{
    id: "partial-fraction", title: "부분분수 — 쪼개서 지우기",
    recall: { figure: board(["1/2 − 1/3 = 3/6 − 2/6 = 1/6"]), text: "1/2 − 1/3은 1/6이고, 6 = 2 × 3입니다.", ask: "1/3 − 1/4은?", options: ["1/12", "1/7", "7/12"], answer: 0, why: "4/12 − 3/12 = 1/12, 12 = 3 × 4예요.", hint: "통분" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: board(["1/(□ × (□ + 1))", "= 1/□ − 1/(□ + 1)"]),
      terms: [["부분분수", "하나의 분수를 두 분수의 차로 쪼갠 것"]],
      facts: ["이웃한 두 수의 곱이 분모이면 <b>1/(앞 수) − 1/(뒤 수)</b>로 쪼갠다", "차례로 쓰면 가운데 항이 지워져 <b>처음과 끝</b>만 남는다", "두 수의 차가 2, 3이면 쪼갠 값을 2, 3으로 나눈다"]
    },
    pitfall: "지워지지 않고 남는 것은 맨 앞의 1/(첫 수)와 맨 뒤의 1/(끝 수)뿐입니다. 끝 수를 잘못 읽지 않습니다.",
    example: {
      prompt: "1/(2 × 3) + 1/(3 × 4) + … + 1/(11 × 12)를 계산하세요.",
      figure: board(["(1/2 − 1/3)", "+ (1/3 − 1/4)", "+ … + (1/11 − 1/□)"]),
      steps: [
        { ask: "1/(3 × 4) = 1/3 − 1/□ 의 □는?", answer: "4", why: "1/3 − 1/4 = 1/12입니다.", hint: "1/12" },
        { ask: "모두 지우고 남는 식 1/2 − 1/□ 의 □는?", answer: "12", why: "맨 앞 1/2과 맨 뒤 1/12만 남습니다.", hint: "끝 수" },
        { ask: "답은? (분수로)", answer: "5/12", text: true, why: "1/2 − 1/12 = 6/12 − 1/12 = 5/12입니다.", hint: "6/12 − 1/12" }
      ]
    },
    check: [["c2-partial-fraction-sum", "concept"], ["c2-partial-fraction-sum", "type"], ["c2-partial-fraction-sum", "advanced"]]
  }],
  "1/3": [{
    id: "fraction-decimal", title: "분수와 소수 — 수직선 위의 자리",
    recall: { figure: board(["1/2 = 5/10 = 0.5", "1/4 = 25/100 = 0.25"]), text: "분모를 10, 100, 1000으로 만들면 분수를 소수로 바로 쓸 수 있습니다(2 × 5 = 10, 4 × 25 = 100).", ask: "1/5을 소수로 바꾸면?", options: ["0.2", "0.5", "1.5"], answer: 0, why: "1 ÷ 5 = 0.2예요.", hint: "1 ÷ 5" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: numberLine([[0, "0", ""], [0.25, "1/4", "0.25"], [0.5, "1/2", "0.5"], [0.75, "3/4", "0.75"], [1, "1", ""]]),
      terms: [["수직선의 가운데", "두 수를 더해 2로 나눈 수"]],
      facts: ["분수 → 소수: 분모를 10, 100, 1000으로 만든다(2 × 5, 4 × 25, 8 × 125) — 안 되면 분자 ÷ 분모", "수직선의 두 점 사이를 □등분하면 한 칸 = (차) ÷ □", "가분수는 대분수로 바꾸면 수직선 위 자리가 바로 보인다"]
    },
    pitfall: "칸 수와 점의 수를 섞지 않습니다. 4등분하면 점은 3개 생깁니다.",
    example: {
      prompt: "3/8을 소수로 나타내고, 수직선에서 1/4과 3/4의 한가운데에 있는 수를 분수로 구하세요.",
      figure: numberLine([[0, "1/4", ""], [0.5, "?", ""], [1, "3/4", ""]], { ticks: 2 }),
      steps: [
        { ask: "3/8을 소수로?", answer: "0.375", text: true, why: "8 × 125 = 1000이라 3/8 = 375/1000 = 0.375입니다.", hint: "분모 × 125" },
        { ask: "1/4과 3/4의 한가운데는? (분수로)", answer: "1/2", text: true, why: "(1/4 + 3/4) ÷ 2 = 1 ÷ 2 = 1/2입니다.", hint: "더해서 ÷ 2" }
      ]
    },
    check: [["c2-repeating-decimal", "concept"], ["number-line-midpoint-book6", "type"], ["c2-improper-fraction", "advanced"]]
  }],
  "2/1": [{
    id: "inclusion-exclusion", title: "포함과 배제 — 두 번 센 것 빼기",
    recall: { figure: figVenn(), text: "두 모임에 함께 든 사람은 두 모임을 더할 때 두 번 세어집니다.", ask: "축구 18명 + 야구 15명에서 둘 다 하는 7명은 몇 번 세어졌나?", options: ["두 번", "한 번", "세 번"], answer: 0, why: "양쪽에 다 들어 있어요.", hint: "겹친 부분" },
    explore: [["board", "book-07/venn-overlap-all"], ["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: figVenn(),
      terms: [["포함과 배제", "더한 뒤 두 번 센 것(겹친 부분)을 한 번 뺀다"]],
      facts: ["적어도 하나 = A + B − <b>둘 다</b>", "둘 다 아님 = 전체 − 적어도 하나", "겹친 부분을 모르면: 둘 다 = A + B − 적어도 하나"]
    },
    pitfall: "「둘 다」를 한 번만 빼야 합니다. 두 번 빼면 겹친 사람이 아예 사라집니다.",
    example: {
      prompt: "반 학생 30명 가운데 축구를 하는 학생은 18명, 야구를 하는 학생은 15명, 둘 다 하는 학생은 7명입니다. 둘 다 하지 않는 학생은 몇 명인가요?",
      figure: figVenn({ a: "", b: "", out: "?", all: "30명" }),
      steps: [
        { ask: "적어도 하나를 하는 학생은?", answer: "26", unit: "명", why: "18 + 15 − 7 = 26입니다.", hint: "18 + 15 − 7" },
        { ask: "둘 다 하지 않는 학생은?", answer: "4", unit: "명", why: "30 − 26 = 4입니다.", hint: "30 − 26" }
      ]
    },
    check: [["venn-union-total-b7", "concept"], ["venn-overlap-with-neither-b7", "type"], ["neither-set-count", "advanced"]]
  }],
  "2/2": [{
    id: "bounce", title: "튀어 오른 공의 높이",
    recall: { figure: figBounce(["90", "?", "", ""]), text: "떨어진 높이의 2/3만큼 튀어 오르는 공은, 튈 때마다 높이가 2/3배가 됩니다.", ask: "90cm에서 떨어뜨리면 첫 번째로 튀어 오른 높이는?", options: ["60cm", "30cm", "45cm"], answer: 0, why: "90 ÷ 3 × 2 = 60이에요.", hint: "90의 2/3" },
    explore: [["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: figBounce(["처음", "1번", "2번", "3번"]),
      terms: [["튀어 오른 높이", "바로 앞에 떨어진 높이의 □/○"]],
      facts: ["앞으로: 높이 × □/○를 튄 횟수만큼", "거꾸로(처음 높이): 튀어 오른 높이 ÷ □ × ○", "움직인 거리: 처음 떨어진 높이 + 튀어 오른 높이 × 2씩(올라갔다 내려옴)"]
    },
    pitfall: "움직인 거리에서 마지막으로 튀어 오른 뒤 내려오는 거리를 셀지 문제를 다시 읽습니다.",
    example: {
      prompt: "81cm 높이에서 떨어뜨린 공이 떨어진 높이의 2/3만큼 튀어 오릅니다. 세 번째로 튀어 오른 높이는 몇 cm인가요?",
      figure: figBounce(["81", "?", "?", "?"]),
      steps: [
        { ask: "첫 번째로 튀어 오른 높이는?", answer: "54", unit: "cm", why: "81 ÷ 3 × 2 = 54입니다.", hint: "81의 2/3" },
        { ask: "두 번째는?", answer: "36", unit: "cm", why: "54 ÷ 3 × 2 = 36입니다.", hint: "54의 2/3" },
        { ask: "세 번째는?", answer: "24", unit: "cm", why: "36 ÷ 3 × 2 = 24입니다.", hint: "36의 2/3" }
      ]
    },
    check: [["c2-bounce-height", "concept"], ["c2-bounce-height", "type"], ["c2-bounce-height", "advanced"]]
  }],
  "2/3": [{
    id: "fraction-box", title: "□가 있는 분수식 — 남은 것으로 거꾸로",
    recall: { figure: board(["1/4 사용 → 남은 3/4", "남은 것의 2/3 사용 → 남은 ?"]), text: "「남은 것의 2/3」은 처음 전체가 아니라 그때 남아 있던 양의 2/3입니다.", ask: "남은 것의 2/3을 쓰면 그 남은 것의 얼마가 남나?", options: ["1/3", "2/3", "3/2"], answer: 0, why: "1 − 2/3 = 1/3이에요.", hint: "1 − 2/3" },
    explore: [["board", "book-08/fraction-reverse-source"], ["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: chain(["처음", "중간", "끝"], ["× (1 − 쓴 분수)", "× (1 − 쓴 분수)"], ["÷ 남은 분수", "÷ 남은 분수"]),
      terms: [["거꾸로 풀기", "남은 양 ÷ 남은 분수의 분자 × 분모로 한 단계씩"]],
      facts: ["남은 양 = 앞의 양 × (1 − 쓴 분수)", "<b>끝에서부터</b> 남은 분수로 나누어 앞 양을 구한다", "구한 처음 양으로 다시 계산해 확인한다"]
    },
    pitfall: "두 번째 분수를 처음 양에 바로 곱하지 않습니다.",
    example: {
      prompt: "처음 구슬의 1/4을 쓰고, 남은 것의 2/3을 썼더니 15개가 남았습니다. 처음 구슬은 몇 개인가요?",
      figure: chain(["?", "?", "15개"], ["× 3/4", "× 1/3"]),
      steps: [
        { ask: "두 번째로 쓰기 전에는?", answer: "45", unit: "개", why: "남은 1/3이 15개이므로 15 × 3 = 45입니다.", hint: "15 × 3" },
        { ask: "처음에는?", answer: "60", unit: "개", why: "남은 3/4이 45개이므로 45 ÷ 3 × 4 = 60입니다.", hint: "45 ÷ 3 × 4" }
      ]
    },
    check: [["sequential-fraction-remains-b8", "concept"], ["fraction-given-away-original-b8", "type"], ["sequential-fraction-consumption-b8", "advanced"]]
  }],
  "3/1": [{
    id: "proportion", title: "지구의 둘레와 비율 — 비례식",
    recall: { figure: board(["3 : 5 = 6 : 10"]), text: "비의 앞뒤에 같은 수를 곱해도 비율은 같습니다. 이렇게 같은 두 비를 등호로 이은 식을 비례식이라 합니다.", ask: "3 : 5 = □ : 20의 □는?", options: ["12", "15", "8"], answer: 0, why: "5에 4를 곱해 20이니 3에도 4를 곱해요.", hint: "× 4" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: figEarth,
      terms: [["비례식", "비율이 같은 두 비를 등호로 이은 식"]],
      facts: ["비의 앞뒤에 <b>같은 수</b>를 곱하거나 나누어도 비율은 같다", "모르는 쪽이 몇 배인지 찾아 같은 배를 한다", "지구의 둘레: 두 곳 사이의 각이 한 바퀴의 몇 분의 몇인지 알면, 거리에 그 수를 곱해 둘레를 구한다"]
    },
    pitfall: "앞항과 뒤항의 짝을 바꾸지 않습니다. 같은 자리끼리 같은 배입니다.",
    example: {
      prompt: "3 : 5 = □ : 40에서 □를 구하세요.",
      figure: board(["3 : 5 = □ : 40"]),
      steps: [
        { ask: "40은 5의 몇 배?", answer: "8", unit: "배", why: "40 ÷ 5 = 8입니다.", hint: "40 ÷ 5" },
        { ask: "□는?", answer: "24", why: "3 × 8 = 24입니다.", hint: "3 × 8" }
      ]
    },
    check: [["equivalent-ratio-chain", "concept"], ["bar-ratio-total-length", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "3/2": [{
    id: "pond-depth", title: "연못의 깊이 — 같은 부분을 기준으로",
    recall: { figure: figPond(), text: "길이가 다른 두 막대를 연못 바닥까지 꽂으면, 물에 잠긴 길이는 둘 다 연못의 깊이로 같습니다.", ask: "어떤 막대의 1/3이 잠겼다면 막대 길이는 깊이의 몇 배?", options: ["3배", "1/3배", "2배"], answer: 0, why: "깊이가 막대의 1/3이니까요.", hint: "거꾸로" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: figPond(),
      terms: [["공통 부분", "두 양에 똑같이 들어 있는 부분 — 이것을 기준(칸)으로 잡는다"]],
      facts: ["잠긴 길이(깊이)를 1칸으로 놓으면 막대는 그 몇 배", "두 막대의 차 = 깊이의 (배수의 차)배", "겹친 넓이가 두 도형의 □/○, △/☆일 때도 같은 방법"]
    },
    pitfall: "막대 길이의 분수와 깊이의 배수를 거꾸로 쓰지 않습니다(1/3 잠김 → 막대는 깊이의 3배).",
    example: {
      prompt: "길이의 차가 36cm인 두 막대를 연못 바닥까지 똑바로 꽂았더니 짧은 막대는 1/4, 긴 막대는 1/7만큼 물에 잠겼습니다. 연못의 깊이는 몇 cm인가요?",
      figure: figPond("1/4", "1/7"),
      steps: [
        { ask: "짧은 막대는 깊이의 몇 배?", answer: "4", unit: "배", why: "1/4이 잠겼으니 4배입니다.", hint: "1/4 → 4배" },
        { ask: "두 막대의 차는 깊이의 몇 배? (7배 − 4배)", answer: "3", unit: "배", why: "긴 막대는 7배라 7 − 4 = 3배입니다.", hint: "7 − 4" },
        { ask: "깊이는?", answer: "12", unit: "cm", why: "36 ÷ 3 = 12입니다(막대 48cm, 84cm).", hint: "36 ÷ 3" }
      ]
    },
    check: [["c2-pond-depth", "concept"], ["c2-pond-depth", "type"], ["fraction-share-difference-b8", "advanced"]]
  }],
  "3/3": [{
    id: "invariant", title: "비의 활용 — 변하지 않는 것 찾기",
    recall: { figure: table([["", "엄마", "아이", "나이 차"], ["지금", "40", "10", "30"], ["10년 뒤", "50", "20", "?"]], [80, 64, 64, 76], { hiCol: 3 }), text: "해가 지나도 두 사람의 나이 차는 변하지 않습니다.", ask: "엄마가 아이보다 30살 많으면 20년 뒤에는?", options: ["30살 많다", "50살 많다", "10살 많다"], answer: 0, why: "둘 다 20살씩 먹어요.", hint: "같이 늘어난다" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: table([["바뀌는 일", "변하지 않는 것"], ["해가 지난다", "나이 차"], ["서로 주고받는다", "두 사람의 합"], ["똑같이 쓰거나 받는다", "두 사람의 차"]], [150, 130], { hiCol: 1 }),
      terms: [["변하지 않는 양", "상황이 바뀌어도 그대로인 양 — 비의 기준으로 삼는다"]],
      facts: ["나이: <b>차</b>가 그대로 — 몇 배가 될 때 차 = 아이 나이 × (배 − 1)", "주고받기: <b>합</b>이 그대로 — 두 비를 합의 칸 수가 같게 맞춘다", "똑같이 쓰기·받기: <b>차</b>가 그대로 — 두 비를 차의 칸 수가 같게 맞춘다"]
    },
    pitfall: "무엇이 변하지 않는지 먼저 정합니다. 합이 그대로인지 차가 그대로인지 바꾸면 답이 달라집니다.",
    example: {
      prompt: "지금 엄마는 40살, 아이는 10살입니다. 몇 년 뒤에 엄마의 나이가 아이 나이의 2배가 되나요?",
      figure: table([["", "엄마", "아이", "나이 차"], ["지금", "40", "10", "?"], ["□년 뒤", "?", "?", "?"]], [80, 64, 64, 76], { hiCol: 3 }),
      steps: [
        { ask: "엄마와 아이의 나이 차는?", answer: "30", unit: "살", why: "40 − 10 = 30입니다.", hint: "40 − 10" },
        { ask: "엄마가 2배일 때 아이 나이는? (차 = 아이 × 1)", answer: "30", unit: "살", why: "2배일 때 차는 아이 나이와 같아 30살입니다.", hint: "차 ÷ (2 − 1)" },
        { ask: "몇 년 뒤?", answer: "20", unit: "년", why: "30 − 10 = 20년 뒤(엄마 60살)입니다.", hint: "30 − 10" }
      ]
    },
    check: [["c2-invariant-ratio", "concept"], ["c2-invariant-ratio", "type"], ["c2-invariant-ratio", "advanced"]]
  }]
};
