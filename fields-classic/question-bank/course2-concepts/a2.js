// 2과정 A2 「복제수와 님게임」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 거듭제곱은 「2^6」으로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
// 그림은 교재(N30)가 개념을 보여 주는 꼴을 따른다(원장 2026-11-23 「원본 제대로 대조해서 만들어」): 거듭제곱 표, 수 카드를 두 번 쓰는 복제수,
// 짝을 묶는 괄호선, 층마다 색이 다른 사각수 점, 약속을 찾는 예 표, 해마다 밀리는 요일 줄, 요일 없는 달력, 번호 붙은 바둑돌, 절반(△△) 막대, 거꾸로 채우는 표.
import { svg, text, rect, circle, line, arrow, P, INK, GREEN, SOFT, YELLOW, PINK, MARK, formulas, mathLabel, card, SHADOW } from "./pack-kit.js?v=20261123b";

const WATER = "#cfe3f3", USED = "#e8e2d2";
const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);

// ── 1단원 ──
// 2와 5의 거듭제곱을 곱하면 10의 거듭제곱(교재의 거듭제곱 표 꼴)
const figPowerTable = () => {
  const rows = [["곱", "2 × 5", "2^2 × 5^2", "2^3 × 5^3", "2^4 × 5^4"], ["계산", "10", "100", "1000", "10000"], ["거듭제곱", "10", "10^2", "10^3", "10^4"]];
  const cw = [70, 78, 78, 78, 78], ch = 34;
  let body = "", y = 6;
  rows.forEach((row, r) => {
    let x = 6;
    row.forEach((v, c) => {
      body += rect(x, y, cw[c], ch, { fill: c === 0 ? SOFT : r === 2 ? YELLOW : "#fff", color: "#9fb2a6", width: 1.1 });
      body += c === 0 ? text(x + cw[c] / 2, y + ch / 2, v, { size: 13, color: GREEN, weight: 700 }) : mathLabel(x + cw[c] / 2, y + ch / 2, v, { size: 15 });
      x += cw[c];
    });
    y += ch;
  });
  return svg(394, 116, body, "2와 5의 거듭제곱을 곱한 표");
};
// 예제: 짝을 짓기 전의 2와 5(몇 쌍인지는 아이가 센다)
const figTwosFives = () => {
  let body = mathLabel(30, 30, "2^6", { size: 17 }) + mathLabel(30, 78, "5^4", { size: 17 });
  for (let i = 0; i < 6; i += 1) body += card(60 + i * 42, 12, 36, 36, "2", { fill: YELLOW, color: "#b89a4a", size: 17 });
  for (let i = 0; i < 4; i += 1) body += card(60 + i * 42, 60, 36, 36, "5", { fill: PINK, color: "#c98a84", size: 17 });
  return svg(320, 108, body, "2 여섯 개와 5 네 개");
};
// 복제수: 수 카드 × 101 = 그 카드를 두 번 쓴 수
const figClone = () => {
  const row = (y, a, m) => {
    const w = a.length * 13 + 22;
    let x = 14, out = card(x, y, w, 34, a, { size: 16 });
    x += w; out += text(x + 14, y + 17, "×", { size: 17 }); x += 28;
    const mw = m.length * 12 + 20; out += card(x, y, mw, 34, m, { fill: SOFT, color: "#8fb19c", size: 16, ink: GREEN }); x += mw;
    out += text(x + 14, y + 17, "=", { size: 17 }); x += 28;
    out += card(x, y, w, 34, a, { fill: YELLOW, color: "#b89a4a", size: 16 }) + card(x + w, y, w, 34, a, { fill: PINK, color: "#c98a84", size: 16 });
    return out + label(x + w, y + 46, "두 번 쓴 수", { size: 12 });
  };
  return svg(340, 136, row(8, "48", "101") + row(76, "123", "1001"), "수를 두 번 쓰게 하는 복제수");
};
// 덧셈 짝: 괄호선으로 묶어 100·1000(교재의 짝 묶음 꼴). terms 위치는 slot 간격으로
const pairRow = (terms, y, pairs, { x0 = 30, gap = 62 } = {}) => {
  const xs = terms.map((_, i) => x0 + i * gap);
  let out = terms.map((t, i) => text(xs[i], y, t, { size: 18, color: pairs.some((p) => p[0] === i || p[1] === i) ? GREEN : INK })).join("");
  out += terms.slice(1).map((_, i) => text(xs[i] + gap / 2, y, "+", { size: 17 })).join("");
  // up이면 괄호선을 위로(짝이 엇갈릴 때 선이 겹치지 않게)
  pairs.forEach(([i, j, value, up = false]) => {
    const x1 = xs[i], x2 = xs[j], mid = (x1 + x2) / 2, y0 = up ? y - 13 : y + 12, yb = up ? y - 18 : y + 17;
    out += `<path d="M ${x1} ${y0} V ${yb} H ${x2} V ${y0}" fill="none" stroke="${GREEN}" stroke-width="1.6"/>`;
    out += card(mid - 26, up ? yb - 30 : yb + 4, 52, 26, value, { fill: value === "?" ? "#fff" : YELLOW, color: "#b89a4a", size: 14, ink: value === "?" ? MARK : INK });
  });
  return out;
};
const figPairRecall = () => svg(220, 88, pairRow(["38", "45", "62"], 18, [[0, 2, "?"]], { x0: 40, gap: 70 }), "합이 100이 되는 짝");
const figRegroup = () => svg(330, 158,
  pairRow(["164", "57", "836", "43"], 56, [[0, 2, "1000"], [1, 3, "100", true]], { x0: 48, gap: 78 })
  + mathLabel(165, 140, "26 × 97 + 26 × 3 = 26 × (97 + 3)", { size: 15 }), "짝을 묶어 1000과 100 만들기");

// ── 2단원 ──
// 사각수: 층(ㄱ자)마다 색이 다른 점 — 1, 1 + 3, 1 + 3 + 5 …(교재의 사각수 점 그림 꼴)
const LAYER = [PINK, YELLOW, SOFT, WATER, USED];
const figGnomon = (n = 4, withSquare = false) => () => {
  const s = 15, slot = 92;
  let body = "";
  for (let k = 1; k <= n; k += 1) {
    const ox = 14 + (k - 1) * slot + (slot - k * s) / 2, oy = 14 + (n - k) * s;
    for (let r = 0; r < k; r += 1) for (let c = 0; c < k; c += 1) body += circle(P(ox + c * s + s / 2, oy + r * s + s / 2), 5.6, { fill: LAYER[Math.max(r, c) % LAYER.length], color: GREEN, width: 1.2 });
    const cx = 14 + (k - 1) * slot + slot / 2;
    body += label(cx, 30 + n * s, Array.from({ length: k }, (_, i) => 2 * i + 1).join(" + "), { size: 12 });
    if (withSquare) body += label(cx, 50 + n * s, `= ${k} × ${k}`, { size: 12, color: GREEN });
  }
  return svg(14 * 2 + n * slot, (withSquare ? 62 : 42) + n * s, body, "층마다 홀수만큼 둘러 커지는 정사각형");
};
// 약속은 예를 표로 늘어놓고 찾는다(교재의 약속 표 꼴)
const figPromise = () => {
  const rows = [["가", "나", "가 ◎ 나"], ["4", "2", "2"], ["5", "3", "7"], ["6", "2", "4"]];
  const cw = [56, 56, 92], ch = 28;
  let body = "";
  rows.forEach((row, r) => { let x = 30; row.forEach((v, c) => { body += rect(x, 6 + r * ch, cw[c], ch, { fill: r === 0 ? SOFT : c === 2 ? YELLOW : "#fff", color: "#9fb2a6", width: 1.1 }) + text(x + cw[c] / 2, 6 + r * ch + ch / 2, v, { size: 14, color: r === 0 ? GREEN : INK }); x += cw[c]; }); });
  return svg(264, 148, body + label(132, 134, "가 ◎ 나 = 가 × 나 − (가 + 나)", { size: 13.5, color: GREEN }), "예를 늘어놓은 약속 표");
};

// ── 3단원 ──
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const dayInk = (i) => (i === 0 ? "#b4512e" : i === 6 ? "#2f5f8a" : INK);
const figWeek = () => svg(330, 76, DAYS.map((d, i) => card(10 + i * 44, 14, 40, 30, d, { fill: i === 2 ? YELLOW : "#fff", size: 15, ink: dayInk(i) })).join("") + label(165, 62, "7일마다 같은 요일 — 나머지만큼 옮긴다"), "요일");
// 해가 바뀔 때 요일이 밀리는 줄(교재의 해마다 요일 줄 꼴)
const yearBox = (x, y, top, day, fill = "#fff") => card(x, y, 104, 50, "", { fill }) + text(x + 52, y + 16, top, { size: 12.5 }) + text(x + 52, y + 35, day, { size: 15, color: day === "?" ? MARK : GREEN, weight: 700 });
const figYearShift = () => {
  const row = (y, name, days, to, fill) => yearBox(10, y, "1월 1일", "월요일", "#fff") + arrow(P(120, y + 25), P(214, y + 25), { color: GREEN })
    + label(167, y + 12, name, { size: 12, color: GREEN }) + label(167, y + 40, days, { size: 11.5 }) + yearBox(222, y, "다음 해 1월 1일", to, fill);
  return svg(336, 134, row(6, "평년 365일", "52주 + 1일", "화요일", YELLOW) + row(74, "윤년 366일", "52주 + 2일", "수요일", PINK), "평년은 하루, 윤년은 이틀 밀린다");
};
const figYearChain = () => svg(380, 84,
  yearBox(4, 16, "2023년 1월 1일", "일요일", YELLOW) + arrow(P(110, 41), P(134, 41), { color: GREEN }) + label(122, 8, "평년", { size: 12, color: GREEN })
  + yearBox(138, 16, "2024년 1월 1일", "?") + arrow(P(244, 41), P(268, 41), { color: GREEN }) + label(256, 8, "윤년", { size: 12, color: GREEN })
  + yearBox(272, 16, "2025년 1월 1일", "?"), "해마다 밀리는 요일");
// 요일 없는 달력(교재 꼴): 1일이 첫 칸, 같은 세로줄은 7씩 차이라 같은 요일
const figMonth = ({ column = -1, marks = {} } = {}) => () => {
  const cw = 36, ch = 28, ox = 12, oy = 12;
  let body = "";
  for (let d = 1; d <= 31; d += 1) {
    const c = (d - 1) % 7, r = Math.floor((d - 1) / 7), x = ox + c * cw, y = oy + r * ch;
    const mark = marks[d];
    body += rect(x, y, cw, ch, { fill: mark ? (mark === "?" ? PINK : YELLOW) : c === column ? YELLOW : "#fff", color: "#b7c4bc", width: 1 });
    body += text(x + cw / 2, y + ch / 2 + (mark ? 3 : 0), String(d), { size: 13 });
    if (mark) body += text(x + cw - 7, y + 7, mark, { size: 9.5, color: mark === "?" ? MARK : GREEN, weight: 700 });
  }
  const note = column >= 0 ? label(ox + 3.5 * cw, oy + 5 * ch + 16, "같은 세로줄 = 7씩 차이 = 같은 요일", { size: 12.5, color: GREEN }) : "";
  return svg(ox * 2 + 7 * cw, oy + 5 * ch + (note ? 30 : 12), body + note, "요일 없는 달력");
};
// 님게임: 번호 붙은 바둑돌(교재 꼴). 처음 first개를 가져간 뒤 set개씩 묶음
const stone = (x, y, n, fill = "#fff") => `<circle cx="${x}" cy="${y}" r="10.5" fill="${fill}" stroke="#4d6b5a" stroke-width="1.3" ${SHADOW}/>` + text(x, y + 0.5, String(n), { size: 10, weight: 600 });
const figNim = () => {
  const n = 14, first = 2, set = 4, gap = 25, x0 = 18;
  let body = "";
  for (let g = 0; g < (n - first) / set; g += 1) {
    const a = first + g * set;
    body += rect(x0 + a * gap - 13, 14, set * gap + 1, 34, { fill: "#eef5ef", color: GREEN, width: 1.2, rx: 8, dash: "4 3" });
    body += label(x0 + (a + (set - 1) / 2) * gap, 60, "합해 4개", { size: 11, color: GREEN });
  }
  for (let i = 0; i < n; i += 1) body += stone(x0 + i * gap, 31, i + 1, i < first ? YELLOW : "#fff");
  return svg(368, 92, body + label(x0 + 0.5 * gap, 60, "먼저 2개", { size: 11, color: MARK }) + label(184, 82, "14 ÷ 4 = 3 … 2 → 처음에 2개, 그다음은 둘이 합해 4개씩"), "님게임 묶음");
};
const figStones = (n = 30) => () => {
  const per = 15, gap = 24;
  let body = "";
  for (let i = 0; i < n; i += 1) body += stone(18 + (i % per) * gap, 18 + Math.floor(i / per) * 28, i + 1);
  return svg(372, 18 + Math.ceil(n / per) * 28, body, "바둑돌");
};

// ── 4단원 ──
// 절반 막대: 처음 = △△(교재의 △ 기호 꼴). more면 절반보다 □ 많이, 아니면 □ 적게 쓴 것
const halfBar = (y, more, title) => {
  const x = 40, w = 240, h = 30, half = w / 2, k = 34, used = more ? half + k : half - k;
  let out = text(x, y - 10, title, { size: 13, anchor: "start", color: GREEN, weight: 700 });
  out += rect(x, y + 14, w, h, { fill: "#fff", color: "#6d7a72", width: 1.3, rx: 4 }) + rect(x, y + 14, used, h, { fill: USED, color: "#6d7a72", width: 1.3, rx: 4 });
  out += line(P(x + half, y + 8), P(x + half, y + h + 20), { color: GREEN, width: 1.4, dash: "4 3" });
  out += text(x + half / 2, y + 4, "△", { size: 14, color: GREEN }) + text(x + half * 1.5, y + 4, "△", { size: 14, color: GREEN });
  out += text(Math.min(x + used, x + half) + k / 2, y + 29, "□", { size: 14, color: MARK });
  out += label(x + used / 2, y + 56, more ? "쓴 것 = △ + □" : "쓴 것 = △ − □", { size: 12 }) + label(x + used + (w - used) / 2, y + 56, more ? "남은 것 = △ − □" : "남은 것 = △ + □", { size: 12, color: MARK });
  return out;
};
const figHalves = () => svg(320, 176, halfBar(18, true, "절반보다 □ 많이 썼다") + halfBar(104, false, "절반보다 □ 적게 썼다"), "절반보다 많게·적게 쓴 막대");
const figHalfRecall = () => {
  const x = 40, w = 240, h = 30, y = 30;
  return svg(320, 96, rect(x, y, w, h, { fill: "#fff", color: "#6d7a72", width: 1.3, rx: 4 }) + rect(x, y, w / 2, h, { fill: USED, color: "#6d7a72", width: 1.3, rx: 4 })
    + text(x + w / 4, y + h / 2, "쓴 것", { size: 13 }) + text(x + w * 0.75, y + h / 2, "남은 것 30", { size: 13, color: MARK })
    + `<path d="M ${x} ${y - 6} V ${y - 14} H ${x + w} V ${y - 6}" fill="none" stroke="${GREEN}" stroke-width="1.5"/>` + text(x + w / 2, y - 22, "처음 ?", { size: 13, color: GREEN, weight: 700 })
    + text(x + w / 4, y + h + 14, "△", { size: 13, color: GREEN }) + text(x + w * 0.75, y + h + 14, "△", { size: 13, color: GREEN }), "절반을 쓴 막대");
};
const figTable = () => {
  const rows = [["", "A", "B", "C"], ["처음", "?", "?", "?"], ["1판 뒤", "", "", ""], ["2판 뒤", "", "", ""], ["3판 뒤", "16", "16", "16"]];
  return svg(300, 160, rows.map((row, r) => row.map((v, c) => rect(10 + c * 70, 6 + r * 30, 70, 30, { fill: r === 0 || c === 0 ? SOFT : "#fff", width: 1.2 }) + text(45 + c * 70, 21 + r * 30, v, { size: 14 })).join("")).join(""), "거꾸로 채우는 표");
};

export const PACKS = {
  "0/1": [{
    id: "power-ten", title: "10의 거듭제곱 — 2와 5의 짝",
    recall: { figure: board(["2 × 5 = 10", "4 × 25 = 100", "8 × 125 = 1000"]), text: "2와 5를 곱하면 10이 됩니다. 10을 여러 번 곱한 것을 10의 거듭제곱이라 하고 10^3처럼 씁니다.", ask: "10^3은?", options: ["1000", "30", "100"], answer: 0, why: "10을 세 번 곱하면 1000이에요.", hint: "10 × 10 × 10" },
    explore: [["drill", "powers", "10의 거듭제곱 연습"]],
    proofs: [],
    summary: {
      figure: figPowerTable,
      terms: [["거듭제곱", "같은 수를 여러 번 곱한 것 — 2^4 = 2 × 2 × 2 × 2"]],
      facts: ["2와 5를 하나씩 짝지을 때마다 <b>10</b>이 하나 — 2^3 × 5^3 = 10^3", "끝자리 0의 개수 = <b>짝의 수</b>(2와 5 중 적은 쪽의 개수)", "자릿수 = 남은 수의 자릿수 + 0의 개수"]
    },
    pitfall: "2^6은 2 × 6이 아닙니다. 2를 여섯 번 곱한 것입니다.",
    example: {
      prompt: "2^6 × 5^4를 계산하면 몇 자리 수인가요?",
      figure: figTwosFives,
      steps: [
        { ask: "2와 5를 몇 쌍 짝지을 수 있나요?", answer: "4", unit: "쌍", why: "5가 4개뿐이라 4쌍입니다.", hint: "적은 쪽" },
        { ask: "짝이 안 된 수(2 × 2)는?", answer: "4", why: "2가 두 개 남아 4입니다.", hint: "2 × 2" },
        { ask: "4 × 10^4는 몇 자리 수?", answer: "5", unit: "자리", why: "40000 — 4 뒤에 0이 4개라 5자리입니다.", hint: "40000" }
      ]
    },
    check: [["c2-smart-regroup", "concept"], ["c2-power-ten-zeros", "type"], ["c2-power-ten-zeros", "advanced"]]
  }],
  "0/2": [{
    id: "clone-numbers", title: "복제수와 수 피라미드",
    recall: { figure: board(["★ × (□ + △) = ★ × □ + ★ × △"]), text: "괄호 안의 두 수를 나누어 따로 곱한 뒤 더해도 값이 같습니다(분배법칙). 101 = 100 + 1처럼 나누면 곱하기가 쉬워집니다.", ask: "23 × 101 = 23 × 100 + 23 × □의 □는?", options: ["1", "101", "100"], answer: 0, why: "101 = 100 + 1이라 23을 한 번 더 더해요.", hint: "101 = 100 + 1" },
    explore: [["drill", "clone", "복제수 연습"]],
    proofs: [],
    summary: {
      figure: figClone,
      terms: [["복제수", "곱하면 그 수의 숫자를 되풀이해 쓰게 만드는 수 — 101, 1001, 10101 …"]],
      facts: ["두 자리 수 × 101 = 그 수를 <b>두 번</b> 쓴 수(48 × 101 = 4848)", "□ × 99…9 = □ × 100…0 − □ — 99 = 100 − 1로 바꾸어 뺀다", "1로만 된 수의 제곱은 1, 2, 3 …으로 올라갔다가 내려온다(수 피라미드: 11 × 11 = 121, 111 × 111 = 12321)"]
    },
    pitfall: "두 자리 수는 101(0이 하나), 세 자리 수는 1001(0이 둘)을 곱해야 두 번 쓴 수가 됩니다. 1로만 된 수의 제곱은 열 자리를 넘으면 받아올림이 생겨 피라미드가 깨집니다.",
    example: {
      prompt: "37 × 999를 간편하게 계산하세요.",
      figure: board(["999 = 1000 − 1", "37 × 999 = 37 × (1000 − 1)"]),
      steps: [
        { ask: "37 × 1000은?", answer: "37000", why: "1000을 곱하면 뒤에 0이 3개 붙습니다.", hint: "0 세 개" },
        { ask: "37 × 999 = 37000 − □ 의 □는?", answer: "37", why: "999는 1000보다 1 작으니 37을 한 번 덜 더한 것입니다.", hint: "37 × 1" },
        { ask: "답은?", answer: "36963", why: "37000 − 37 = 36963입니다.", hint: "37000 − 37" }
      ]
    },
    check: [["c2-nines-product", "concept"], ["c2-repunit-square", "type"], ["c2-repunit-square", "advanced"]]
  }],
  "0/3": [{
    id: "regroup", title: "10, 100, 1000 …의 활용 — 짝 지어 간편 계산",
    recall: { figure: figPairRecall, text: "덧셈은 순서를 바꾸어 더해도 값이 같습니다. 합이 100이 되는 수끼리 먼저 더하면 쉽습니다.", ask: "38 + 45 + 62에서 짝 38 + 62는?", options: ["100", "90", "110"], answer: 0, why: "8 + 2 = 10, 30 + 60 + 10 = 100이에요.", hint: "8 + 2" },
    explore: [["drill", "powers", "10의 거듭제곱 연습"]],
    proofs: [],
    summary: {
      figure: figRegroup,
      terms: [["짝 만들기", "더하거나 곱해서 10, 100, 1000이 되는 수를 먼저 묶기"]],
      facts: ["덧셈: 합이 <b>10 · 100 · 1000</b>이 되는 수끼리 순서를 바꾸어 먼저 더한다", "같은 수를 곱한 덧셈은 묶는다: <b>★ × □ + ★ × △ = ★ × (□ + △)</b> — 괄호 안이 100이 되게", "곱셈: 2 × 5 · 4 × 25 · 8 × 125처럼 10, 100, 1000이 되는 짝을 먼저 곱한다"]
    },
    pitfall: "빼기·나누기는 순서를 함부로 바꾸지 않습니다. 빼는 수끼리는 먼저 더해 한 번에 빼고, 나눗셈은 나누는 수와 나뉘는 수에 같은 수를 곱해 바꿉니다.",
    example: {
      prompt: "58 × 97 + 58 × 3을 간편하게 계산하세요.",
      figure: board(["58 × 97 + 58 × 3", "★ × □ + ★ × △ = ★ × (□ + △)"]),
      steps: [
        { ask: "58 × 97 + 58 × 3 = 58 × (97 + □)의 □는?", answer: "3", why: "같은 수 58을 곱한 두 수 97과 3을 괄호로 묶습니다.", hint: "58 × 3" },
        { ask: "97 + 3은?", answer: "100", why: "괄호 안이 100이 됩니다.", hint: "100" },
        { ask: "답은?", answer: "5800", why: "58 × 100 = 5800입니다.", hint: "58 × 100" }
      ]
    },
    check: [["c2-smart-regroup", "concept"], ["c2-smart-regroup", "type"], ["c2-smart-regroup", "advanced"]]
  }],
  "1/1": [{
    id: "square-numbers", title: "사각수와 제곱수",
    recall: { figure: figGnomon(4), text: "같은 수를 두 번 곱한 수를 제곱수라 합니다. 점을 정사각형으로 늘어놓은 개수와 같아 사각수라고도 합니다. 한 층 커질 때마다 ㄱ자 모양으로 홀수만큼 둘러 붙입니다.", ask: "다음 정사각형(5 × 5)의 점은 몇 개?", options: ["25", "10", "55"], answer: 0, why: "다섯 줄에 다섯 개씩이에요.", hint: "5 × 5" },
    explore: [["drill", "square", "사각수 연습"]],
    proofs: [],
    summary: {
      figure: figGnomon(4, true),
      terms: [["사각수", "1, 4, 9, 16 … — 정사각형으로 늘어놓을 수 있는 수"]],
      facts: ["1부터 연속한 홀수 □개의 합 = <b>□ × □</b>", "마지막 홀수가 ○이면 홀수의 개수는 (○ + 1) ÷ 2", "일의 자리가 5인 수의 제곱: 십의 자리 × (십의 자리 + 1) 뒤에 <b>25</b>"]
    },
    pitfall: "마지막 홀수(19)를 개수로 착각하지 않습니다. 19는 10번째 홀수입니다.",
    example: {
      prompt: "1 + 3 + 5 + … + 19의 값을 구하세요.",
      figure: figGnomon(4),
      steps: [
        { ask: "19는 몇 번째 홀수?", answer: "10", unit: "번째", why: "(19 + 1) ÷ 2 = 10입니다.", hint: "(19 + 1) ÷ 2" },
        { ask: "합은?", answer: "100", why: "홀수 10개의 합 = 10 × 10입니다.", hint: "10 × 10" }
      ]
    },
    check: [["c2-odd-sum-square", "concept"], ["c2-odd-sum-square", "type"], ["c2-odd-sum-square", "advanced"]]
  }],
  "1/2": [{
    id: "promise", title: "약속 — 새 연산 기호",
    recall: { figure: board(["가 ◎ 나 = 가 × 나 − (가 + 나)"]), text: "새 기호의 계산 방법을 약속하면, 약속대로 수를 넣어 계산합니다.", ask: "약속대로 4 ◎ 2는? (4 × 2 − (4 + 2))", options: ["2", "6", "8"], answer: 0, why: "8 − 6 = 2예요.", hint: "8 − 6" },
    explore: [],
    proofs: [],
    summary: {
      figure: figPromise,
      terms: [["약속", "새 기호의 계산 방법을 정한 식"]],
      facts: ["약속을 찾을 때는 예를 표로 늘어놓고 두 수의 <b>합 · 차 · 곱</b>, 곱한 뒤 더하거나 빼기를 차례로 맞춰 본다", "가·나 자리에 <b>그대로 바꾸어</b> 넣는다 — 괄호가 있으면 <b>안쪽 약속부터</b>", "약속은 순서를 바꾸면 값이 달라질 수 있다(가 ◇ 나 ≠ 나 ◇ 가)"]
    },
    pitfall: "약속을 두 번 쓰는 식은 안쪽 결과를 다시 「가」 자리에 넣습니다.",
    example: {
      prompt: "가 ◎ 나 = 가 × 나 − (가 + 나)로 약속할 때 (2 ◎ 4) ◎ 3을 구하세요.",
      figure: board(["(2 ◎ 4) ◎ 3"]),
      steps: [
        { ask: "2 ◎ 4는?", answer: "2", why: "2 × 4 − (2 + 4) = 8 − 6 = 2입니다.", hint: "8 − 6" },
        { ask: "2 ◎ 3은?", answer: "1", why: "2 × 3 − (2 + 3) = 6 − 5 = 1입니다.", hint: "6 − 5" }
      ]
    },
    check: [["two-custom-operations", "concept"], ["two-custom-operations", "type"], ["two-custom-operations", "advanced"]]
  }],
  "1/3": [{
    id: "four-fours", title: "포포즈 — 괄호와 연산 기호로 수 만들기",
    recall: { figure: board(["6 + 3 × 4 = 6 + 3 + 3 + 3 + 3"]), text: "곱셈은 같은 수를 여러 번 더한 것을 줄여 쓴 것입니다. 그래서 괄호가 없으면 곱셈·나눗셈을 덧셈·뺄셈보다 먼저 합니다.", ask: "6 + 3 × 4는?", options: ["18", "36", "13"], answer: 0, why: "3 × 4 = 12를 먼저 해서 6 + 12예요.", hint: "곱셈 먼저" },
    explore: [],
    proofs: [],
    summary: {
      figure: board(["2 + 5 × 3 − 1 = 16", "(2 + 5) × 3 − 1 = 20", "(2 + 5) × (3 − 1) = 14", "4 ÷ 4 + 4 ÷ 4 = 2"]),
      terms: [["포포즈", "4를 네 번 쓰고 연산 기호·괄호를 넣어 여러 수를 만드는 놀이"]],
      facts: ["괄호 안을 <b>가장 먼저</b> 계산한다", "곱셈 앞뒤를 묶으면 값이 크게 바뀐다", "4 ÷ 4 = 1, 4 − 4 = 0처럼 작은 수를 만드는 묶음을 먼저 찾아 둔다"]
    },
    pitfall: "괄호를 넣을 때 수의 차례는 바꾸지 않습니다.",
    example: {
      prompt: "6 + 3 × 4 − 2에 괄호를 한 쌍 넣어 34를 만드세요.",
      figure: board(["6 + 3 × 4 − 2"]),
      steps: [
        { ask: "괄호 없이 계산하면?", answer: "16", why: "6 + 12 − 2 = 16입니다.", hint: "곱셈 먼저" },
        { ask: "(6 + 3) × 4 − 2는?", answer: "34", why: "9 × 4 − 2 = 36 − 2 = 34입니다.", hint: "9 × 4 − 2" }
      ]
    },
    check: [["c2-bracket-insert", "concept"], ["consecutive-sign-insertion", "type"], ["sign-insertion-triple-unit-test-book6", "advanced"]]
  }],
  "2/1": [{
    id: "year-shift", title: "율리우스력과 그레고리력 — 해가 바뀔 때의 요일",
    recall: { figure: board(["365 ÷ 7 = 52 … ?"]), text: "1년은 365일(윤년은 366일)입니다. 같은 요일은 7일마다 돌아오므로 7로 나눈 나머지만 보면 됩니다.", ask: "365를 7로 나눈 나머지는?", options: ["1", "0", "2"], answer: 0, why: "7 × 52 = 364라서 1이 남아요.", hint: "7 × 52" },
    explore: [["board", "book-07/calendar-weekday"], ["drill", "calendar", "달력 연습"]],
    proofs: [],
    summary: {
      figure: figYearShift,
      terms: [["윤년", "2월이 29일인 해 — 4로 나누어떨어지는 해(100의 배수는 400의 배수일 때만)"]],
      facts: ["평년이 지나면 요일이 <b>하루</b>, 윤년이 지나면 <b>이틀</b> 밀린다", "평년에는 1월 1일의 요일이 53번, 윤년에는 1월 1일과 1월 2일의 요일이 53번", "여러 해는 밀린 날 수를 모두 더해 7로 나눈 나머지만큼 옮긴다"]
    },
    pitfall: "어느 해의 윤년 여부는 지나가는 그해를 봅니다(2024년 1월 1일 → 2025년 1월 1일은 2024년이 윤년이라 이틀).",
    example: {
      prompt: "2023년 1월 1일은 일요일입니다. 2024년 1월 1일과 2025년 1월 1일은 각각 무슨 요일인가요?",
      figure: figYearChain,
      steps: [
        { ask: "2023년은 평년 — 2024년 1월 1일은 ○요일?", answer: "월", unit: "요일", text: true, why: "하루 밀려 월요일입니다.", hint: "하루" },
        { ask: "2024년은 윤년 — 2025년 1월 1일은 ○요일?", answer: "수", unit: "요일", text: true, why: "이틀 밀려 수요일입니다.", hint: "이틀" }
      ]
    },
    check: [["c2-year-weekday-shift", "concept"], ["c2-year-weekday-shift", "type"], ["c2-year-weekday-shift", "advanced"]]
  }],
  "2/2": [{
    id: "calendar-weekday", title: "달력과 요일 — 7로 나눈 나머지",
    recall: { figure: figWeek, text: "같은 요일은 7일마다 돌아옵니다.", ask: "화요일에서 14일 뒤는?", options: ["화요일", "수요일", "목요일"], answer: 0, why: "14는 7의 배수예요.", hint: "7 × 2" },
    explore: [["board", "book-07/calendar-next-month-source"], ["drill", "calendar", "달력 연습"]],
    proofs: [],
    summary: {
      figure: figMonth({ column: 0 }),
      terms: [["며칠 뒤", "오늘을 빼고 센 날 수"]],
      facts: ["며칠 뒤 ÷ 7의 <b>나머지</b>만큼 요일을 옮긴다", "달을 건너갈 때는 그달의 날 수(30·31·28·29)를 더한다", "같은 요일의 날짜는 7씩 차이 난다 — 한 달에 4번이나 5번"]
    },
    pitfall: "「3월 1일부터 30일 뒤」는 3월 31일입니다. 오늘을 하루로 세지 않습니다.",
    example: {
      prompt: "어느 해 3월 1일은 화요일입니다. 3월 31일과 4월 1일은 각각 무슨 요일인가요?",
      figure: figMonth({ marks: { 1: "화", 31: "?" } }),
      steps: [
        { ask: "3월 31일은 3월 1일부터 며칠 뒤?", answer: "30", unit: "일", why: "31 − 1 = 30입니다.", hint: "31 − 1" },
        { ask: "30 ÷ 7의 나머지는?", answer: "2", why: "7 × 4 = 28, 30 − 28 = 2입니다.", hint: "7 × 4" },
        { ask: "3월 31일은 ○요일?", answer: "목", unit: "요일", text: true, why: "화요일에서 이틀 뒤 목요일, 4월 1일은 금요일입니다.", hint: "화 → 수 → 목" }
      ]
    },
    check: [["calendar-cross-month-weekday-b7", "concept"], ["weekday-after-days-b7", "type"], ["calendar-weekday-list-ordinal-book5", "advanced"]]
  }],
  "2/3": [{
    id: "nim", title: "100 만들기와 님게임 — 필승 묶음",
    recall: { figure: figNim, text: "두 사람이 번갈아 1개부터 3개까지 가져갈 때, 내가 상대의 수와 합해 4개가 되게 가져가면 한 번 주고받을 때마다 꼭 4개씩 줄어듭니다.", ask: "상대가 3개를 가져가면 나는 몇 개?", options: ["1개", "3개", "4개"], answer: 0, why: "3 + 1 = 4예요.", hint: "합해 4" },
    explore: [["drill", "nim", "님게임 연습"]],
    proofs: [],
    summary: {
      figure: figNim,
      terms: [["필승 묶음", "가져갈 수 있는 가장 큰 수 + 1 — 한 번씩 주고받을 때 이만큼씩 줄인다"]],
      facts: ["마지막 것을 가져가면 이기는 놀이: 전체 ÷ (가장 큰 수 + 1)의 <b>나머지</b>를 처음에 가져간다", "나머지가 0이면 <b>나중에 하는 사람</b>이 이긴다", "마지막 것을 가져가면 지는 놀이: 상대에게 1개를 남기도록 (전체 − 1)로 셈한다", "100 만들기(번갈아 1부터 10까지 더해 100을 부르면 이김)도 같다 — 묶음 11, 100 ÷ 11의 나머지 1부터 부른다"]
    },
    pitfall: "처음에 가져간 다음부터는 늘 상대와 합해 묶음 수가 되게 해야 합니다. 한 번이라도 어기면 필승이 깨집니다.",
    example: {
      prompt: "바둑돌 30개를 두 사람이 번갈아 1개부터 3개까지 가져갑니다. 마지막 바둑돌을 가져가는 사람이 이길 때, 먼저 하는 사람은 처음에 몇 개를 가져가야 하나요?",
      figure: figStones(30),
      steps: [
        { ask: "필승 묶음(3 + 1)은?", answer: "4", unit: "개", why: "한 번씩 주고받을 때 4개씩 줄입니다.", hint: "3 + 1" },
        { ask: "30 ÷ 4의 나머지는?", answer: "2", why: "4 × 7 = 28, 30 − 28 = 2입니다.", hint: "4 × 7" },
        { ask: "처음에 가져갈 개수는?", answer: "2", unit: "개", why: "2개를 가져가면 28개(4의 배수)가 남아 늘 맞출 수 있습니다.", hint: "나머지" }
      ]
    },
    check: [["c2-nim-strategy", "concept"], ["c2-nim-strategy", "type"], ["c2-nim-strategy", "advanced"]]
  }],
  "3/1": [{
    id: "reverse", title: "거꾸로 생각하기 — 절반보다 많게·적게",
    recall: { figure: figHalfRecall, text: "마지막 결과를 알고 처음을 찾을 때는 마지막에서부터 거꾸로, 한 일을 반대로 합니다. 처음을 똑같은 두 몫 △△로 놓고 생각합니다.", ask: "절반을 쓰고 30이 남았으면 처음은?", options: ["60", "15", "30"], answer: 0, why: "남은 것도 절반이니 두 배예요.", hint: "× 2" },
    explore: [["board", "book-08/reverse-operation-chain"], ["drill", "reverse", "거꾸로 풀기 연습"]],
    proofs: [],
    summary: {
      figure: figHalves,
      terms: [["거꾸로 풀기", "끝에서부터 한 일을 반대로(더하기 ↔ 빼기, 곱하기 ↔ 나누기)"]],
      facts: ["「절반보다 □ 적게 썼다」 → 남은 것 = △ + □, 쓰기 전 = (남은 것 − □) × 2", "「절반보다 □ 많이 썼다」 → 남은 것 = △ − □, 쓰기 전 = (남은 것 + □) × 2", "구한 처음 값으로 앞에서부터 다시 해 보아 확인한다"]
    },
    pitfall: "「적게 썼다」면 남은 것이 절반보다 많습니다. 더하고 빼는 방향을 막대 그림으로 확인합니다.",
    example: {
      prompt: "첫 번째 가게에서 가진 돈의 절반보다 300원 더 많이 쓰고, 두 번째 가게에서 남은 돈의 절반보다 100원 적게 썼더니 600원이 남았습니다. 처음 가진 돈은 얼마인가요?",
      figure: board(["? → 첫 가게 → 두 번째 가게 → 600원"]),
      steps: [
        { ask: "두 번째 가게에 가기 전에는?", answer: "1000", unit: "원", why: "(600 − 100) × 2 = 1000입니다.", hint: "(600 − 100) × 2" },
        { ask: "처음에는?", answer: "2600", unit: "원", why: "(1000 + 300) × 2 = 2600입니다. 2600 → 1000 → 600으로 확인됩니다.", hint: "(1000 + 300) × 2" }
      ]
    },
    check: [["c2-reverse-half-chain", "concept"], ["sequential-fraction-remains-b8", "type"], ["c2-reverse-half-chain", "advanced"]]
  }],
  "3/2": [{
    id: "reverse-table", title: "표 그려 거꾸로 풀기",
    recall: { figure: figTable, text: "여러 사람이 주고받을 때는 표를 그리고, 마지막 줄부터 한 줄씩 위로 채웁니다.", ask: "가진 만큼 받아 두 배가 된 사람의 받기 전은?", options: ["지금의 절반", "지금의 두 배", "지금과 같다"], answer: 0, why: "두 배가 되었으니 절반으로 돌려요.", hint: "÷ 2" },
    explore: [["drill", "reverse", "거꾸로 풀기 연습"]],
    proofs: [],
    summary: {
      figure: figTable,
      terms: [["주고받기 표", "판마다 사람마다 가진 수를 적은 표 — 아래에서 위로 채운다"]],
      facts: ["받은 사람은 <b>절반으로</b>, 준 사람은 준 만큼을 <b>다시 더해</b> 한 줄 위를 채운다", "전체의 합은 주고받아도 그대로 — 줄마다 합을 확인한다", "마지막에 같아졌다면 마지막 줄은 전체 ÷ 사람 수"]
    },
    pitfall: "한 줄을 채울 때 진 사람(준 사람)을 맨 나중에 계산합니다. 다른 사람들이 받은 양을 먼저 알아야 하니까요.",
    example: {
      prompt: "A, B, C가 세 판을 하는데 판마다 진 사람이 나머지 두 사람에게 그들이 가진 만큼씩 구슬을 줍니다. 1판은 A, 2판은 B, 3판은 C가 졌고 끝나고 보니 세 사람 모두 16개였습니다. 처음에 A는 몇 개였나요?",
      figure: figTable,
      steps: [
        { ask: "3판 전 C는? (A·B는 8개씩)", answer: "32", unit: "개", why: "A·B가 받아 16이 되었으니 8씩이었고, C는 16 + 8 + 8 = 32입니다.", hint: "16 + 8 + 8" },
        { ask: "2판 전 B는? (A 4개, C 16개)", answer: "28", unit: "개", why: "8 + 4 + 16 = 28입니다.", hint: "8 + 4 + 16" },
        { ask: "처음 A는? (B 14개, C 8개)", answer: "26", unit: "개", why: "4 + 14 + 8 = 26입니다. 합 26 + 14 + 8 = 48 = 16 × 3으로 확인됩니다.", hint: "4 + 14 + 8" }
      ]
    },
    check: [["reverse-transfer-three-b8", "concept"], ["give-as-much-return-b8", "type"], ["reverse-two-container-transfers-b8", "advanced"]]
  }]
};
