// 2과정 A1 「양팔저울과 규칙찾기」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다). 대수 권은 그림 논증 대신 그림으로 「왜」를 보인다.
// 그림 꼴은 교재(N30) 활동 쪽과 대조해 맞췄다(2026-11-23): 나눗셈식 ↔ 검산식 칸 · 번호 금화를 올린 저울 · 저울 ↔ 식 · 길이가 같은 두 막대의 칸 ·
// 비를 적는 표 · 나눗셈식 → 가분수 → 대분수 · 선과 닫힌 둘레의 점 · 자르는 시간(○)과 쉬는 시간(◇) 줄.
// 글 속 분수는 「3/5」로 쓰면 화면·인쇄에서 수식 분수로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, line, rect, circle, dot, P, INK, GREEN, SOFT, MARK, YELLOW, mathLabel, SHADOW, barModel } from "./pack-kit.js?v=20261123b";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const GRAY = "#9aa39e", BLUE = "#2f5fb3";
// 바둑돌: 검은 돌은 위쪽에 빛, 흰 돌은 옅은 그늘(원장 2026-11-22 「그림질 높여」)
const stone = (x, y, black) => `<circle cx="${x}" cy="${y}" r="10" fill="${black ? "#2b3330" : "#fbfbf8"}" stroke="${black ? "#1a201e" : "#9aa39e"}" stroke-width="1.2" ${SHADOW}/>`
  + `<ellipse cx="${x - 3}" cy="${y - 4}" rx="4" ry="2.4" fill="#fff" fill-opacity="${black ? ".28" : ".9"}"/>`;
const cells = (x, y, n, fill, w = 26) => barModel(x, y, n, { w, fill });

// ── 그림 ──
const figPeriod = () => {
  const block = [true, false, false, true];
  let body = "";
  for (let i = 0; i < 12; i += 1) body += stone(24 + i * 28, 40, block[i % 4]);
  body += rect(10, 22, 4 * 28, 36, { color: GREEN, dash: "5 4", width: 1.6 }) + rect(10 + 4 * 28, 22, 4 * 28, 36, { color: GREEN, dash: "5 4", width: 1.6 });
  return svg(360, 90, body + label(66, 76, "마디 1") + label(178, 76, "마디 2") + label(290, 76, "마디 3"), "마디로 묶은 바둑돌");
};
const slot = (x, y, v, round = false, color = GREEN) => (round ? circle(P(x, y), 13, { fill: "#fff", color, width: 1.6 }) : rect(x - 13, y - 13, 26, 26, { fill: "#fff", color, width: 1.6, rx: 3 })) + text(x, y + 0.5, v, { size: 17, color: v === "?" ? MARK : INK });
const figDivide = () => svg(320, 150, text(70, 34, "13 ÷ 4 =", { size: 20 }) + slot(138, 34, "?") + text(170, 34, "…", { size: 20 }) + slot(200, 34, "?", true, MARK)
  + text(70, 116, "13 = 4 ×", { size: 20 }) + slot(138, 116, "?") + text(170, 116, "+", { size: 20 }) + slot(200, 116, "?", true, MARK)
  + line(P(138, 50), P(138, 98), { color: GRAY, width: 1.4, dash: "4 3" }) + line(P(200, 50), P(200, 98), { color: GRAY, width: 1.4, dash: "4 3" })
  + label(124, 75, "몫", { anchor: "end", color: GREEN }) + label(214, 75, "나머지", { anchor: "start", color: MARK }) + label(270, 34, "나눗셈식", { anchor: "start", size: 12 }) + label(270, 116, "검산식", { anchor: "start", size: 12 }), "나눗셈식과 검산식");
const figRows = (rows = 5) => {
  let body = "";
  for (let r = 1; r <= rows; r += 1) for (let i = 0; i < r; i += 1) body += stone(150 - (r - 1) * 14 + i * 28, 18 + (r - 1) * 26, r % 2 === 1);
  if (rows < 5) body += text(150, 18 + rows * 26, "4줄: ?", { size: 15, color: MARK });
  return svg(330, rows < 5 ? 40 + rows * 26 : 150, body + label(236, 18, "1줄: 검은 돌", { anchor: "start" }) + label(236, 44, "2줄: 흰 돌", { anchor: "start" }), "줄마다 색이 바뀌는 바둑돌");
};
// 양팔저울: 받침·기둥·가로대·줄·접시, 올린 것은 글자 대신 도형(○ 흰 공 · ● 검은 공 · △ 세모 · □ 네모)
const piece = (x, y, g) => g === "c" ? `<circle cx="${x}" cy="${y}" r="9" fill="#f6d46b" stroke="#a5801f" stroke-width="1.3" ${SHADOW}/>`
  : /^\d$/.test(g) ? `<circle cx="${x}" cy="${y}" r="9" fill="#f6d46b" stroke="#a5801f" stroke-width="1.3" ${SHADOW}/>` + text(x, y + 0.5, g, { size: 10, color: "#5a4510", weight: 700 })
  : g === "△" ? `<polygon points="${x},${y - 9} ${x + 9},${y + 7} ${x - 9},${y + 7}" fill="#f4b860" stroke="#8a5a1e" stroke-width="1.3" stroke-linejoin="round" ${SHADOW}/>`
  : g === "□" ? rect(x - 8, y - 8, 16, 16, { fill: "#cfe3f3", color: "#2f5f8a", width: 1.3, rx: 2, shadow: true })
  : `<circle cx="${x}" cy="${y}" r="8" fill="${g === "●" ? "#2b3330" : "#fbfbf8"}" stroke="${g === "●" ? "#1a201e" : "#7a8580"}" stroke-width="1.3" ${SHADOW}/>`;
// 접시는 곡선 없이 평평한 판(원장 2026-11-22 「양팔저울 곡선 넣지마」)
const pan = (cx, hy, items) => line(P(cx - 44, hy + 40), P(cx, hy), { color: "#9aa39e", width: 1.1 }) + line(P(cx + 44, hy + 40), P(cx, hy), { color: "#9aa39e", width: 1.1 })
  + `<polygon points="${cx - 46},${hy + 40} ${cx + 46},${hy + 40} ${cx + 38},${hy + 48} ${cx - 38},${hy + 48}" fill="${SOFT}" stroke="#4d6b5a" stroke-width="1.5" stroke-linejoin="round" ${SHADOW}/>`
  + items.map((g, i) => piece(cx - (items.length - 1) * 10 + i * 20, hy + 31, g)).join("");
// 저울 한 대(왼쪽 끝 ox, 폭 320). tilt: 0 평형 · -1 왼쪽이 내려감 · 1 오른쪽이 내려감
const scale = (ox, left, right, tilt = 0) => {
  const yl = 40 - tilt * 14, yr = 40 + tilt * 14;
  return `<polygon points="${ox + 160},44 ${ox + 150},124 ${ox + 170},124" fill="#c9b48a" stroke="#7a6a4a" stroke-width="1.3"/>` + rect(ox + 118, 124, 84, 10, { fill: "#d9b37c", color: "#7a6a4a", width: 1.3, rx: 4, shadow: true })
    + line(P(ox + 70, yl), P(ox + 250, yr), { color: "#4d5a53", width: 4 }) + `<circle cx="${ox + 160}" cy="40" r="5" fill="#f4b860" stroke="#7a5a1e" stroke-width="1.2"/>`
    + pan(ox + 70, yl, left) + pan(ox + 250, yr, right);
};
const figBalance = (left = ["○", "○"], right = ["△"], tilt = 0) => svg(320, 140, scale(0, left, right, tilt), tilt ? "기울어진 양팔저울" : "평형을 이룬 양팔저울");
// 저울 ↔ 식(교재 활동 2: 평형인 저울은 등식)
const figBalanceEq = () => svg(320, 175, scale(0, ["○", "○"], ["△"]) + text(160, 160, "○ + ○ = △", { size: 18 }) + label(60, 160, "좌변", { size: 12 }) + label(262, 160, "우변", { size: 12 }), "저울과 식");
const figTwoBalances = () => svg(640, 165, scale(0, ["○", "○"], ["△"]) + scale(320, ["△", "△", "△"], ["□"]) + label(160, 154, "[저울 1]") + label(480, 154, "[저울 2]"), "평형을 이룬 두 양팔저울");
const figCoinGroups = (each = 9) => svg(440, 160, scale(0, ["c", "c", "c"], ["c", "c", "c"])
  + rect(338, 90, 92, 34, { color: GREEN, dash: "5 4", width: 1.4, rx: 6 }) + ["c", "c", "c"].map((g, i) => piece(364 + i * 20, 107, g)).join("")
  + label(384, 140, `저울 밖 ${each}개`) + label(70, 150, `왼쪽 ${each}개`) + label(250, 150, `오른쪽 ${each}개`), `금화를 ${each}개씩 셋으로 나누어 저울에`);
const figCoins = () => svg(440, 160, scale(0, ["1", "2", "3"], ["4", "5", "6"])
  + rect(338, 90, 92, 34, { color: GREEN, dash: "5 4", width: 1.4, rx: 6 }) + ["7", "8", "9"].map((g, i) => piece(364 + i * 20, 107, g)).join("")
  + label(384, 140, "저울 밖") + label(70, 150, "왼쪽 접시") + label(250, 150, "오른쪽 접시"), "금화 9개를 셋씩 나누어 저울에");
const figBars = (a = 5, b = 3, la = "A", lb = "B") => { const x0 = 16 + Math.max(la.length, lb.length) * 15; return svg(x0 + 16 + Math.max(a, b) * 26, 80, text(x0 - 8, 24, la, { size: 15, weight: 700, anchor: "end" }) + cells(x0, 12, a, SOFT) + text(x0 - 8, 58, lb, { size: 15, weight: 700, anchor: "end" }) + cells(x0, 46, b, YELLOW), "칸 막대"); };
// 비를 적는 표(교재 활동 2 「표로 푸는 분수 문제」의 꼴: 구분 / 비 / 값)
const figTable = (rows) => {
  const cw = 84, ch = 34, w = rows[0].length * cw;
  let body = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    body += rect(10 + c * cw, 8 + r * ch, cw, ch, { fill: r === 0 || c === 0 ? SOFT : "#fff", color: "#7d9a87", width: 1.2 });
    body += mathLabel(10 + c * cw + cw / 2, 8 + r * ch + ch / 2, v, { size: 15, color: v === "?" ? MARK : INK, weight: r === 0 || c === 0 ? 700 : 600 });
  }));
  return svg(w + 20, rows.length * ch + 16, body, "비를 적는 표");
};
const figEqualBars = (a = 3, b = 5, la = "A", lb = "B") => {
  const L = 300, x = 30;
  let body = barModel(x, 12, a, { w: L / a, fill: SOFT }) + barModel(x, 48, b, { w: L / b, fill: YELLOW });
  for (let i = 0; i < a; i += 1) body += text(x + (i + 0.5) * (L / a), 24, la, { size: 14, weight: 700 });
  for (let i = 0; i < b; i += 1) body += text(x + (i + 0.5) * (L / b), 60, lb, { size: 14, weight: 700 });
  return svg(360, 98, body + label(x + L / 2, 88, `${la} ${a}개와 ${lb} ${b}개의 길이가 같다`), "길이가 같은 두 막대");
};
const figRemain = () => svg(330, 118, cells(10, 14, 3, YELLOW, 100) + rect(10, 14, 100, 24, { fill: "#e8e2d2", width: 1.6 }) + label(60, 52, "1/3 사용") + label(210, 52, "남은 2/3") + cells(110, 66, 4, SOFT, 50) + rect(110, 66, 50, 24, { fill: "#e8e2d2", width: 1.6 }) + label(135, 104, "1/4 사용", { size: 12 }), "남은 양을 거꾸로");
const frac = (x, y, n, d, cn = INK, cd = INK) => text(x, y - 15, n, { size: 18, color: cn }) + line(P(x - 13, y), P(x + 13, y), { width: 1.8 }) + text(x, y + 15, d, { size: 18, color: cd });
// 분자 = 분모 × 몫 + 나머지를 칸 막대로: 분모 한 칸, 분자는 분모 몫만큼 + 나머지 조각
const figFracBars = (q = 4, r = 1, sum = 31) => {
  const w = 44, x0 = 60;
  let body = text(x0 - 10, 26, "분모", { size: 14, weight: 700, anchor: "end" }) + barModel(x0, 14, 1, { w, fill: SOFT })
    + text(x0 - 10, 66, "분자", { size: 14, weight: 700, anchor: "end" }) + barModel(x0, 54, q, { w, fill: YELLOW }) + rect(x0 + q * w, 54, 14, 24, { fill: "#f9c8c4", color: "#4d6b5a", width: 1.4, rx: 3 })
    + label(x0 + q * w + 7, 92, String(r), { color: MARK });
  for (let i = 0; i < q; i += 1) body += text(x0 + (i + 0.5) * w, 66, "분모", { size: 11, color: "#56627f" });
  body += line(P(x0, 104), P(x0 + q * w + 14, 104), { color: GREEN, width: 1.4 }) + label(x0 + (q * w + 14) / 2, 120, `분자 = 분모 × ${q} + ${r} · 분자 + 분모 = ${sum}`, { color: GREEN });
  return svg(x0 + q * w + 40, 132, body, "분모와 분자의 칸 막대");
};
const figFraction = (colored = true) => {
  const Q = colored ? GREEN : INK, Rm = colored ? MARK : INK, Dv = colored ? BLUE : INK;
  let body = text(26, 42, "17", { size: 20 }) + text(54, 42, "÷", { size: 20 }) + text(76, 42, "5", { size: 20, color: Dv }) + text(98, 42, "=", { size: 20 }) + text(120, 42, "3", { size: 20, color: Q }) + text(142, 42, "…", { size: 20 }) + text(164, 42, "2", { size: 20, color: Rm })
    + text(196, 42, "→", { size: 20, color: "#8a948f" }) + frac(228, 42, "17", "5", INK, Dv) + text(256, 42, "=", { size: 20 }) + text(278, 42, "3", { size: 22, color: Q }) + frac(300, 42, "2", "5", Rm, Dv);
  if (colored) body += text(70, 98, "몫", { size: 14, color: Q }) + text(150, 98, "나머지", { size: 14, color: Rm }) + text(240, 98, "나누는 수(분모)", { size: 14, color: Dv })
    + text(165, 132, "검산식: 17 = 5 × 3 + 2", { size: 16 });
  return svg(330, colored ? 150 : 80, body, "나눗셈식과 대분수");
};
// 나무 한 그루: 줄기 + 둥근 잎(아래 칸 가운데가 심은 자리)
const tree = (x, y) => rect(x - 2, y - 6, 4, 9, { fill: "#a07a4a", color: "none", width: 0 }) + `<circle cx="${x}" cy="${y - 13}" r="10" fill="#7fb38f" stroke="#2f6b4a" stroke-width="1.3" ${SHADOW}/>` + `<circle cx="${x - 3}" cy="${y - 16}" r="3.5" fill="#fff" fill-opacity=".35"/>`;
const figDots = () => {
  let body = line(P(20, 40), P(260, 40), { color: GREEN, width: 2 });
  for (let k = 0; k <= 6; k += 1) body += dot(P(20 + k * 40, 40), 5, INK);
  body += label(140, 66, "곧은 선: 간격 6곳 · 점 7개", { size: 16 });
  const o = P(90, 92), s = 120;
  body += rect(o.x, o.y, s, s, { color: GREEN, width: 2 });
  for (let k = 0; k < 12; k += 1) { const side = Math.floor(k / 3), t = (k % 3) * 40; const p = [P(o.x + t, o.y), P(o.x + s, o.y + t), P(o.x + s - t, o.y + s), P(o.x, o.y + s - t)][side]; body += dot(p, 5, INK); }
  return svg(300, 250, body + label(150, 236, "닫힌 둘레: 간격 12곳 · 점 12개", { size: 16 }), "곧은 선과 닫힌 둘레의 점");
};
const figRoad = (closed = false) => {
  if (closed) {
    let body = `<circle cx="90" cy="80" r="56" fill="#cfe3f3" stroke="#7fa7c9" stroke-width="5" stroke-opacity=".55"/>` + text(90, 80, "연못", { size: 13, color: "#2f5f8a" });
    for (let k = 0; k < 8; k += 1) { const a = (k / 8) * Math.PI * 2; body += tree(90 + 56 * Math.cos(a), 80 + 56 * Math.sin(a)); }
    return svg(320, 160, body + label(240, 70, "나무 8그루") + label(240, 94, "간격도 8곳"), "둥근 연못 둘레의 나무");
  }
  let body = rect(8, 54, 304, 12, { fill: "#e8e2d2", color: "#b8ab8c", width: 1, rx: 6 });
  for (let k = 0; k <= 3; k += 1) body += tree(30 + k * 86, 50);
  return svg(320, 100, body + label(160, 84, "간격 3곳 · 나무 4그루"), "곧은 길의 나무");
};
const figLog = () => {
  let body = rect(20, 22, 280, 36, { fill: "#d9b37c", color: "#8a6a3b", width: 1.5, rx: 6, shadow: true });
  for (let k = 0; k < 6; k += 1) body += line(P(36 + k * 46, 30 + (k % 2) * 8), P(60 + k * 46, 30 + (k % 2) * 8), { color: "#a9804e", width: 1 });
  body += `<ellipse cx="300" cy="40" rx="9" ry="18" fill="#eed3a4" stroke="#8a6a3b" stroke-width="1.4"/><ellipse cx="300" cy="40" rx="4" ry="9" fill="none" stroke="#b08a55" stroke-width="1"/>`;
  for (let k = 1; k <= 3; k += 1) { const x = 20 + k * 70; body += line(P(x, 14), P(x, 66), { color: MARK, dash: "4 3", width: 1.6 }) + text(x, 8, `${k}번`, { size: 11, color: MARK }); }
  return svg(320, 96, body + label(160, 84, "4도막 = 3번 자르기 · 쉬는 것은 2번"), "통나무 자르기");
};

const figLogTime = (pieces = 5) => {
  const cuts = pieces - 1, x0 = 70, len = 270, step = len / pieces;
  let body = rect(x0, 14, len, 30, { fill: "#d9b37c", color: "#8a6a3b", width: 1.5, rx: 6, shadow: true });
  for (let k = 1; k <= cuts; k += 1) {
    const x = x0 + k * step;
    body += line(P(x, 8), P(x, 50), { color: MARK, dash: "4 3", width: 1.6 }) + circle(P(x, 72), 10, { fill: "#fff", color: GREEN, width: 1.6 });
    const last = k === cuts;
    body += `<polygon points="${x},${92} ${x + 10},${102} ${x},${112} ${x - 10},${102}" fill="#fff" stroke="${last ? MARK : "#8a6a1e"}" stroke-width="1.6"${last ? ' stroke-dasharray="3 3"' : ""}/>`;
    if (last) body += line(P(x - 9, 93), P(x + 9, 111), { color: MARK, width: 1.4 });
  }
  return svg(360, 150, body + label(34, 72, "자르기", { color: GREEN, size: 12 }) + label(34, 102, "쉬기", { color: "#8a6a1e", size: 12 })
    + label(205, 136, `${pieces}도막: 자르기 ${cuts}번 · 쉬기 ${cuts - 1}번(마지막 뒤에는 쉬지 않음)`, { size: 12 }), "자르는 시간과 쉬는 시간");
};

export const PACKS = {
  "0/1": [{
    id: "period", title: "마디수열 — 나머지로 몇 번째 찾기",
    recall: { figure: figDivide, text: "나눗셈에서 몫은 「몇 번 묶였나」, 나머지는 「묶고 남은 것」입니다. 나눗셈식은 검산식으로 바꾸어 쓸 수 있습니다.", ask: "13 ÷ 4의 나머지는?", options: ["1", "3", "4"], answer: 0, why: "4 × 3 = 12이고 13에서 12를 빼면 1이 남아요.", hint: "4 × 3 = 12" },
    explore: [["board", "book-02/repeating-sequence"], ["drill", "period", "마디 세기 연습"]],
    proofs: [],
    summary: {
      figure: figPeriod,
      terms: [["마디", "같은 차례로 되풀이되는 한 묶음"]],
      facts: ["몇 번째 ÷ 마디 길이 = <b>몫</b>(지나간 마디) … <b>나머지</b>(다음 마디의 몇 번째)", "나머지가 0이면 <b>마디의 마지막</b>", "몇 개인지 = 마디 하나의 개수 × 몫 + 남은 것 안의 개수"]
    },
    pitfall: "나머지가 0일 때 「0번째」는 없습니다. 바로 앞 마디의 마지막 것입니다.",
    example: {
      prompt: "● ○ ○ ● 를 같은 차례로 되풀이하여 늘어놓았습니다. 50번째 바둑돌은 무슨 색인가요?",
      figure: figPeriod,
      steps: [
        { ask: "마디 하나에 바둑돌이 몇 개인가요?", answer: "4", unit: "개", why: "● ○ ○ ● 네 개가 되풀이됩니다.", hint: "되풀이되는 묶음" },
        { ask: "50 ÷ 4의 나머지는?", answer: "2", why: "4 × 12 = 48, 50 − 48 = 2입니다.", hint: "4 × 12 = 48" },
        { ask: "마디의 2번째 돌은 무슨 색? (검은/흰)", answer: "흰", unit: "돌", text: true, why: "● ○ ○ ●의 2번째는 ○입니다.", hint: "마디의 2번째" }
      ]
    },
    check: [["c2-period-nth", "concept"], ["c2-period-number-sum", "type"], ["c2-period-nth", "advanced"]]
  }],
  "0/2": [{
    id: "stone-layers", title: "도형에서 규칙 찾기 — 줄마다 바뀌는 색",
    recall: { figure: () => figRows(3), text: "줄을 하나씩 늘려 가며 바둑돌을 놓으면 n번째 줄에는 n개가 놓입니다.", ask: "4번째 줄에는 바둑돌이 몇 개?", options: ["3개", "4개", "8개"], answer: 1, why: "줄의 번호만큼 놓여요.", hint: "줄 번호" },
    explore: [["board", "book-02/growth-patterns"]],
    proofs: [],
    summary: {
      figure: figRows,
      terms: [["표로 세기", "줄(또는 둘레)마다 색과 개수를 표에 적어 규칙을 찾는다"]],
      facts: ["홀수 번째 줄과 짝수 번째 줄의 색이 다르면 <b>두 줄씩 묶어</b> 차를 본다", "두 줄을 묶을 때마다 차가 <b>일정하게</b> 커지거나 그대로인지 확인한다", "몇 번째에서 차가 얼마인지 알면 거꾸로 몇 번째인지도 찾는다"]
    },
    pitfall: "마지막 묶음이 한 줄만 남는지(홀수 번째에서 끝나는지) 꼭 확인합니다.",
    example: {
      prompt: "1줄에 1개, 2줄에 2개, … 처럼 줄마다 하나씩 늘려 놓고, 홀수 번째 줄은 검은 돌, 짝수 번째 줄은 흰 돌을 놓습니다. 10줄까지 놓으면 어느 색이 몇 개 더 많은가요?",
      figure: figRows,
      steps: [
        { ask: "검은 돌(1·3·5·7·9줄)은 모두 몇 개?", answer: "25", unit: "개", why: "1 + 3 + 5 + 7 + 9 = 25입니다.", hint: "홀수 줄만 더하기" },
        { ask: "흰 돌(2·4·6·8·10줄)은 모두 몇 개?", answer: "30", unit: "개", why: "2 + 4 + 6 + 8 + 10 = 30입니다.", hint: "짝수 줄만 더하기" },
        { ask: "흰 돌이 몇 개 더 많은가요?", answer: "5", unit: "개", why: "두 줄씩 묶으면 흰 돌이 1개씩 많아 5묶음이면 5개입니다.", hint: "30 − 25" }
      ]
    },
    check: [["go-stone-difference", "concept"], ["border-go-stone-difference", "type"], ["go-stone-difference-inverse", "advanced"]]
  }],
  "1/1": [{
    id: "fake-coin", title: "양팔저울로 가짜 금화 찾기",
    recall: { figure: () => figBalance(["●"], ["○"], -1), text: "양팔저울은 무거운 쪽으로 기울고, 무게가 같으면 평형을 이룹니다.", ask: "왼쪽이 내려가면 가벼운 것은 어느 쪽?", options: ["왼쪽", "오른쪽"], answer: 1, why: "올라간 쪽이 가벼워요.", hint: "올라간 쪽" },
    explore: [],
    proofs: [],
    summary: {
      figure: figCoins,
      terms: [["셋으로 나누기", "왼쪽 접시 · 오른쪽 접시 · 저울 밖 — 한 번에 세 무리 중 하나를 고른다"]],
      facts: ["1·2·3 대 4·5·6: 평형이면 가벼운 금화는 <b>저울 밖</b>(7·8·9), 기울면 <b>올라간 접시</b>에 있다", "저울 한 번에 찾을 수 있는 개수가 <b>3배</b>씩: 3 → 9 → 27 → 81", "적어도 몇 번 = 3을 몇 번 곱해야 금화 수 이상이 되나"]
    },
    pitfall: "두 무리로만 나누면 한 번에 반밖에 못 줄입니다. 저울 밖에 둔 무리도 한 번에 함께 가려집니다.",
    example: {
      prompt: "금화 27개 가운데 1개만 가볍습니다. 양팔저울을 적어도 몇 번 써야 반드시 찾을 수 있나요?",
      figure: () => figCoinGroups(9),
      steps: [
        { ask: "첫 번째: 9개씩 세 무리로 나누면 가짜가 든 무리는 몇 개?", answer: "9", unit: "개", why: "9개씩 두 접시에 올리고 9개는 밖에 둡니다.", hint: "27 ÷ 3" },
        { ask: "두 번째: 그 9개를 다시 셋으로 나누면?", answer: "3", unit: "개", why: "3개씩 나눕니다.", hint: "9 ÷ 3" },
        { ask: "세 번째로 1개를 찾습니다. 모두 몇 번?", answer: "3", unit: "번", why: "27 = 3 × 3 × 3이므로 3번입니다.", hint: "3을 몇 번 곱했나" }
      ]
    },
    check: [["c2-fake-coin", "concept"], ["c2-fake-coin", "type"], ["c2-fake-coin", "advanced"]]
  }],
  "1/2": [{
    id: "balance-substitute", title: "양팔저울과 바꾸어 넣기",
    recall: { figure: () => figBalance(["○", "○"], ["△"]), text: "평형을 이룬 저울은 양쪽 무게가 같다는 식입니다.", ask: "○ ○ = △이면 △ 2개는 ○ 몇 개?", options: ["2개", "4개", "3개"], answer: 1, why: "△ 하나가 ○ 2개이니 △ 2개는 ○ 4개예요.", hint: "△ = ○ ○" },
    explore: [["board", "book-04/balance-substitution"], ["drill", "balance", "저울 바꾸어 넣기 연습"]],
    proofs: [],
    summary: {
      figure: figBalanceEq,
      terms: [["등식", "평형인 저울을 = 로 쓴 식 — 왼쪽이 좌변, 오른쪽이 우변"], ["바꾸어 넣기", "같은 무게인 것으로 갈아 끼워 한 가지 모양으로 맞춘다"]],
      facts: ["저울 하나 = 식 하나(○ ○ = △)", "물어보는 모양으로 <b>모두 바꾸어</b> 센다", "양쪽에 같은 것을 더하거나 빼도 평형은 그대로"]
    },
    pitfall: "바꾸어 넣을 때 개수를 곱하는 것을 잊지 않습니다(△ 3개 = ○ 2개씩 3번).",
    example: {
      prompt: "○ 2개와 △ 1개의 무게가 같고, △ 3개와 □ 1개의 무게가 같습니다. □ 1개는 ○ 몇 개의 무게와 같나요?",
      figure: figTwoBalances,
      steps: [
        { ask: "△ 1개는 ○ 몇 개?", answer: "2", unit: "개", why: "첫 저울에서 ○ ○ = △입니다.", hint: "첫 번째 저울" },
        { ask: "□ = △ 3개 = ○ 몇 개?", answer: "6", unit: "개", why: "○ 2개씩 3번이면 6개입니다.", hint: "2 × 3" }
      ]
    },
    check: [["balance-scale-three-objects", "concept"], ["g1-winter-three-balance-substitution", "type"], ["balance-scale-four-objects", "advanced"]]
  }],
  "1/3": [{
    id: "balance-ratio", title: "양팔저울과 비",
    recall: { figure: () => figBars(3, 2), text: "비 3 : 2는 한쪽이 3칸일 때 다른 쪽이 2칸이라는 뜻입니다.", ask: "A가 3칸, B가 2칸이면 A : B는?", options: ["3 : 2", "2 : 3", "5 : 3"], answer: 0, why: "앞에 쓴 것이 A예요.", hint: "칸 수" },
    explore: [["board", "book-06/bar-balance-ratio-source"], ["drill", "ratio", "비 찾기 연습"]],
    proofs: [],
    summary: {
      figure: () => figEqualBars(3, 5),
      terms: [["거꾸로 비", "A × 3 = B × 5이면 A : B = 5 : 3 — 곱한 수가 서로 바뀐다"]],
      facts: ["A 3개 = B 5개(저울이면 ○ 3개 = △ 5개)이면 A : B = <b>5 : 3</b>", "칸으로 그리고 <b>합(또는 차)이 몇 칸</b>인지 본다", "한 칸의 값을 구해 칸 수만큼 곱한다"]
    },
    pitfall: "개수가 많은 쪽이 한 개는 더 가볍습니다. 비를 거꾸로 쓰지 않았는지 다시 봅니다.",
    example: {
      prompt: "A의 3배와 B의 5배가 같고, A가 B보다 14 큽니다. A와 B를 구하세요.",
      figure: () => figEqualBars(3, 5),
      steps: [
        { ask: "A : B = 5 : □", answer: "3", why: "A × 3 = B × 5이면 A는 5칸, B는 3칸입니다.", hint: "곱한 수를 바꾸어" },
        { ask: "차 2칸이 14 — 한 칸은?", answer: "7", why: "14 ÷ 2 = 7입니다.", hint: "14 ÷ 2" },
        { ask: "A는?", answer: "35", why: "5칸 × 7 = 35, B는 3칸 × 7 = 21입니다.", hint: "5 × 7" }
      ]
    },
    check: [["bar-ratio-read", "concept"], ["balance-ratio-book6", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "2/1": [{
    id: "fraction-backward", title: "그림으로 푸는 분수 문제 — 거꾸로",
    recall: { figure: figRemain, text: "전체의 1/3을 쓰면 남은 것은 전체의 2/3입니다.", ask: "전체의 1/4을 쓰면 남는 것은?", options: ["3/4", "1/4", "4/3"], answer: 0, why: "네 조각 중 한 조각을 써서 세 조각이 남아요.", hint: "1 − 1/4" },
    explore: [["board", "book-08/fraction-reverse-source"], ["board", "book-08/fraction-picture-source"]],
    proofs: [],
    summary: {
      figure: figRemain,
      terms: [["남은 것의 분수", "「남은 것의 1/4」은 전체가 아니라 남은 양을 다시 나눈 것"]],
      facts: ["남은 양 = 전체의 (1 − 쓴 분수)", "끝에서부터 <b>한 단계씩 거꾸로</b> 늘린다", "남은 수 ÷ 남은 조각 수 = 한 조각, × 전체 조각 수 = 그 앞의 양"]
    },
    pitfall: "두 번째로 쓴 분수는 처음 양이 아니라 남은 양의 분수입니다.",
    example: {
      prompt: "처음 구슬의 1/3을 동생에게 주고, 남은 것의 1/4을 친구에게 주었더니 18개가 남았습니다. 처음 구슬은 몇 개인가요?",
      figure: figRemain,
      steps: [
        { ask: "친구에게 주기 전에는 몇 개? (남은 3/4이 18개)", answer: "24", unit: "개", why: "18 ÷ 3 = 6이 한 조각, 6 × 4 = 24입니다.", hint: "18 ÷ 3 × 4" },
        { ask: "처음에는 몇 개? (남은 2/3이 24개)", answer: "36", unit: "개", why: "24 ÷ 2 = 12가 한 조각, 12 × 3 = 36입니다.", hint: "24 ÷ 2 × 3" }
      ]
    },
    check: [["fraction-given-away-original-b8", "concept"], ["sequential-fraction-remains-b8", "type"], ["fraction-difference-whole-b8", "advanced"]]
  }],
  "2/2": [{
    id: "fraction-ratio", title: "표로 푸는 분수 문제 — 분수와 비",
    recall: { figure: () => figBars(3, 5, "동생", "언니"), text: "「동생은 언니의 3/5」이면 언니를 5칸으로 나눌 때 동생은 3칸입니다.", ask: "그때 동생 : 언니는?", options: ["3 : 5", "5 : 3", "3 : 8"], answer: 0, why: "동생 3칸, 언니 5칸이에요.", hint: "칸 수" },
    explore: [["board", "book-06/fraction-balance-source"], ["drill", "fraction", "분수와 비 연습"]],
    proofs: [],
    summary: {
      figure: () => figTable([["구분", "A", "B", "합"], ["비", "3", "5", "8"], ["값", "3 × 한 칸", "5 × 한 칸", "합"]]),
      terms: [["기준", "「~의」 앞에 오는 쪽 — 분모만큼 칸으로 나눈다"]],
      facts: ["A가 B의 3/5이면 A : B = <b>3 : 5</b> — 표의 「비」 칸에 적는다", "합이 주어지면 (3 + 5)칸, 차가 주어지면 (5 − 3)칸으로 한 칸을 구한다", "전체의 분수(전체의 3/5)라면 나머지는 전체의 2/5 — 두 쪽을 칸으로 비교한다"]
    },
    pitfall: "「언니의 3/5」에서 기준은 언니입니다. 전체(둘을 합한 것)의 3/5가 아닙니다.",
    example: {
      prompt: "동생은 언니의 3/5만큼 초콜릿을 가졌고, 둘이 가진 초콜릿은 모두 40개입니다. 동생은 몇 개인가요?",
      figure: () => figTable([["구분", "동생", "언니", "모두"], ["비", "3", "5", "?"], ["개수", "?", "?", "40"]]),
      steps: [
        { ask: "모두 몇 칸인가요?", answer: "8", unit: "칸", why: "동생 3칸 + 언니 5칸 = 8칸입니다.", hint: "3 + 5" },
        { ask: "한 칸은 몇 개?", answer: "5", unit: "개", why: "40 ÷ 8 = 5입니다.", hint: "40 ÷ 8" },
        { ask: "동생은 몇 개?", answer: "15", unit: "개", why: "3칸 × 5 = 15, 언니는 25개입니다.", hint: "3 × 5" }
      ]
    },
    check: [["c2-fraction-ratio-split", "concept"], ["fraction-share-difference-b8", "type"], ["c2-fraction-ratio-split", "advanced"]]
  }],
  "2/3": [{
    id: "division-fraction", title: "나눗셈과 분수 — 몫과 나머지로 가분수 찾기",
    recall: { figure: () => figFraction(false), text: "가분수 17/5를 대분수로 바꾸면 17 ÷ 5 = 3 … 2라서 3과 2/5입니다.", ask: "분자 = 분모 × 몫 + □ 의 □는?", options: ["나머지", "몫", "분모"], answer: 0, why: "나눗셈의 검산식과 같아요.", hint: "검산식" },
    explore: [["drill", "fraction", "분수와 비 연습"]],
    proofs: [],
    summary: {
      figure: figFraction,
      terms: [["검산식", "나누어지는 수 = 나누는 수 × 몫 + 나머지"]],
      facts: ["분자 = 분모 × 몫 + 나머지 — 모르는 것을 <b>분모 하나</b>로 만든다", "분자 + 분모 = 분모 × (몫 + 1) + 나머지", "분자 − 분모 = 분모 × (몫 − 1) + 나머지"]
    },
    pitfall: "나머지는 늘 나누는 수(분모)보다 작아야 합니다. 구한 분모로 확인합니다.",
    example: {
      prompt: "어떤 가분수의 분자와 분모의 합은 31이고, 분자를 분모로 나누면 몫이 4, 나머지가 1입니다. 이 가분수를 구하세요.",
      figure: () => figFracBars(4, 1, 31),
      steps: [
        { ask: "합 = 분모 × □ + 1 의 □는?", answer: "5", why: "분자 = 분모 × 4 + 1이니 분모를 더하면 분모 × 5 + 1입니다.", hint: "몫 + 1" },
        { ask: "분모는?", answer: "6", why: "(31 − 1) ÷ 5 = 6입니다.", hint: "30 ÷ 5" },
        { ask: "분자는?", answer: "25", why: "6 × 4 + 1 = 25 → 25/6입니다.", hint: "6 × 4 + 1" }
      ]
    },
    check: [["c2-improper-fraction", "concept"], ["c2-quotient-remainder-pair", "type"], ["c2-improper-fraction", "advanced"]]
  }],
  "3/1": [{
    id: "tree-planting", title: "가로수 심기 — 간격 수와 나무 수",
    recall: { figure: () => figRoad(false), text: "곧은 길의 처음과 끝에 모두 심으면 나무가 간격보다 1그루 많습니다.", ask: "간격이 6곳이면 나무는?", options: ["6그루", "7그루", "5그루"], answer: 1, why: "양 끝이 하나씩 더해져 간격 + 1이에요.", hint: "간격 + 1" },
    explore: [["board", "book-07/closed-loop-planting"], ["drill", "gaps", "간격 세기 연습"]],
    proofs: [],
    summary: {
      figure: figDots,
      terms: [["간격 수", "길이 ÷ 간격"]],
      facts: ["곧은 길, 처음과 끝에 심음: 나무 = <b>간격 수 + 1</b>", "둥근 연못·사각 둘레(닫힌 길): 나무 = <b>간격 수</b>", "양쪽에 심으면 한쪽의 <b>2배</b> · 사이마다 꽃을 심으면 사이 수 = 간격 수"]
    },
    pitfall: "닫힌 둘레는 처음과 끝이 같은 자리라 한 그루를 더하지 않습니다.",
    example: {
      prompt: "둘레가 60m인 둥근 연못과 길이가 60m인 곧은 길에 각각 5m 간격으로 나무를 심습니다(곧은 길은 처음과 끝에도). 나무는 각각 몇 그루인가요?",
      figure: () => figRoad(true),
      steps: [
        { ask: "간격은 몇 곳?", answer: "12", unit: "곳", why: "60 ÷ 5 = 12입니다.", hint: "60 ÷ 5" },
        { ask: "둥근 연못의 나무는?", answer: "12", unit: "그루", why: "닫힌 둘레는 간격 수와 같습니다.", hint: "닫힌 둘레" },
        { ask: "곧은 길의 나무는?", answer: "13", unit: "그루", why: "처음과 끝에 심으면 12 + 1 = 13입니다.", hint: "간격 + 1" }
      ]
    },
    check: [["closed-perimeter-object-count-b7", "concept"], ["c2-road-trees", "type"], ["closed-perimeter-from-spacing-count-b7", "advanced"]]
  }],
  "3/2": [{
    id: "log-cut", title: "통나무 자르기 — 횟수와 시간",
    recall: { figure: figLog, text: "통나무를 4도막으로 자르려면 3번만 자르면 됩니다.", ask: "6도막이면 몇 번 자르나요?", options: ["6번", "5번", "7번"], answer: 1, why: "도막 수보다 한 번 적게 잘라요.", hint: "도막 − 1" },
    explore: [["drill", "gaps", "간격 세기 연습"]],
    proofs: [],
    summary: {
      figure: () => figLogTime(5),
      terms: [["자르는 횟수", "도막 수 − 1"], ["쉬는 횟수", "자르는 횟수 − 1 (마지막 뒤에는 쉬지 않음)"]],
      facts: ["걸린 시간 = 자르는 시간 × 자르는 횟수 + 쉬는 시간 × 쉬는 횟수 = (자르는 시간 + 쉬는 시간) × 자르는 횟수 − 쉬는 시간", "한 번 자르는 시간 = 걸린 시간 ÷ (도막 수 − 1)", "종이 울리는 시간도 같다 — 울림 사이 = 울린 횟수 − 1"]
    },
    pitfall: "「몇 도막」과 「몇 번 자르기」를 섞지 않습니다. 그림에 자르는 선을 그어 셉니다.",
    example: {
      prompt: "통나무를 한 번 자르는 데 6분이 걸리고, 한 번 자른 뒤에는 2분씩 쉽니다. 5도막으로 자르는 데 모두 몇 분이 걸리나요?",
      figure: () => figLogTime(5),
      steps: [
        { ask: "자르는 횟수는?", answer: "4", unit: "번", why: "5도막이면 5 − 1 = 4번 자릅니다.", hint: "도막 − 1" },
        { ask: "쉬는 횟수는?", answer: "3", unit: "번", why: "마지막으로 자른 뒤에는 쉬지 않아 4 − 1 = 3번입니다.", hint: "자르기 − 1" },
        { ask: "모두 몇 분?", answer: "30", unit: "분", why: "6 × 4 + 2 × 3 = 24 + 6 = 30분입니다.", hint: "6 × 4 + 2 × 3" }
      ]
    },
    check: [["c2-log-cut-time", "concept"], ["c2-log-cut-time", "type"], ["c2-log-cut-time", "advanced"]]
  }]
};
