// 2과정 A1 「양팔저울과 규칙찾기」 권별 테스트 — 드라이브 원문(2A1 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 내용이 본책 네 단원(마디수열과 규칙찾기 · 양팔저울과 비 · 분수와 비 · 가로수와 통나무)과 맞는 것을 확인하고 옮겼다.
// 단원: 1~6번·25번 마디수열과 규칙찾기 · 7~12번 양팔저울과 비 · 13~18번 분수와 비 · 19~24번 가로수와 통나무.
// 글·수·배치는 원문 그대로, 그림은 우리 색표(워밍업 그림 색)로 다시 그렸다. 흑백이 규칙인 그림(2·25번 도형, 바둑돌)은 검정·흰색을 그대로 둔다.
// 분수는 글 속 빗금(1/3)으로 적고 화면이 mathText로 위아래로 쌓는다(mathPrompt). 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, shape, cell, ringed, balance, stone } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "./len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "2과정", book: "A1", title: "양팔저울과 규칙찾기" };

const f = (n) => (Math.round(n * 10) / 10).toString();
const INK = UT.ink;
const dots = (x, y, size = 16) => text(x, y, "…", { size, weight: 700 });
// 검정(채움) · 흰(빈) 도형 — 2·25번처럼 색이 규칙인 그림
function bw(kind, cx, cy, s, black) {
  const h = s / 2;
  const style = `fill="${black ? INK : "#fff"}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"`;
  if (kind === "circle") return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(h)}" ${style}/>`;
  if (kind === "square") return `<rect x="${f(cx - h)}" y="${f(cy - h)}" width="${f(s)}" height="${f(s)}" ${style}/>`;
  return `<polygon points="${f(cx)},${f(cy - h)} ${f(cx + h)},${f(cy + h * 0.8)} ${f(cx - h)},${f(cy + h * 0.8)}" ${style}/>`;
}
// 쌓인 도형 기둥들(아래부터) + 아래 번호
function stacks(cols, { step = 26, s = 20, rise = 24, x0 = 18, base, label }) {
  return cols.map(({ kind, black, count }, i) => {
    const cx = x0 + i * step;
    let out = "";
    for (let k = 0; k < count; k += 1) out += bw(kind, cx, base - k * rise, s, black);
    return out + text(cx, label, String(i + 1), { size: 13, weight: 500 });
  }).join("");
}
// 둥근 상자 속 글줄(①② 조건, 수열)
const noteBox = (lines, { size = 13, width = 400 } = {}) =>
  `<div style="display:grid;place-items:center;width:100%"><div style="width:min(100%,${width}px);padding:10px 16px;border:1.5px solid ${UT.soft};border-radius:10px;background:#fdfbf5">${lines.map((l) => `<p style="margin:0;font-size:${size}px;font-weight:700;line-height:1.75;color:${INK};word-break:keep-all">${l}</p>`).join("")}</div></div>`;
// 점선 길이 표시(a→b 를 잇는 볼록한 곡선, bend 가 음수면 위로)
const blank = (x, y, w = 26, h = 20) => `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" fill="#fff" stroke="${UT.box}" stroke-width="1.5" rx="2"/>`;
const word = (x, y, value, size = 13, anchor = "middle") => text(x, y, value, { size, weight: 600, anchor });

// ── 마디수열과 규칙찾기
function q1() {
  const kinds = ["circle", "triangle", "square"], s = 30, step = 40;
  let out = "";
  for (let i = 0; i < 9; i += 1) out += shape(kinds[i % 3], 22 + i * step, 24, s);
  return svg(400, 48, "동그라미, 세모, 네모가 차례로 되풀이되는 줄", out + dots(386, 24), 380);
}
function q2() {
  const kinds = ["triangle", "square", "circle"], counts = [1, 2, 3, 2];
  const cols = Array.from({ length: 13 }, (_, i) => ({ kind: kinds[i % 3], black: i % 2 === 1, count: counts[i % 4] }));
  const base = 92, top = 18;
  return svg(430, 128, "1번째부터 13번째까지 쌓인 도형과 43번째 빈칸",
    stacks(cols, { base, label: 116 }) + dots(368, base - 26)
    + `<rect x="394" y="${top}" width="30" height="${base + 12 - top}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>` + text(409, 116, "43", { size: 13, weight: 500 }), 400);
}
function q3() {
  const unit = [1, 0, 0, 1, 1, 1, 0];
  let out = "";
  for (let i = 0; i < 19; i += 1) out += stone(14 + i * 22, 18, unit[i % 7] === 1, 9.5);
  return svg(450, 36, "검은 돌과 흰 돌이 늘어선 줄", out + dots(436, 18), 420);
}
const q4 = () => svg(380, 48, "1, 4, 2, 8, 5, 7 이 되풀이되는 수의 줄",
  `<rect x="2" y="2" width="376" height="44" rx="10" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>` + text(190, 24, "1, 4, 2, 8, 5, 7, 1, 4, 2, 8, 5, 7, 1, 4, …", { size: 16, weight: 700 }), 380);
function q5() {
  const r = 7.6, dx = 16.5, dy = 14.5, base = 100, gap = 24;
  const names = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"];
  let x = 10, out = "";
  for (let n = 1; n <= 5; n += 1) {
    const w = n * dx, cx = x + w / 2;
    for (let k = 1; k <= n; k += 1) {
      const y = base - (n - k) * dy;
      for (let j = 0; j < k; j += 1) out += stone(cx + (j - (k - 1) / 2) * dx, y, k % 2 === 1, r);
    }
    out += word(cx, 124, names[n - 1], 12);
    x += w + gap;
  }
  return svg(380, 134, "바둑돌을 삼각형 모양으로 쌓은 다섯 그림", out + dots(x - 8, base - 40), 380);
}
function q6() {
  const u = 12.5, r = 7.6, mid = 54, gap = 30;
  const lattice = (m) => { const list = []; for (let a = -(m - 1); a <= m - 1; a += 2) for (let b = -(m - 1); b <= m - 1; b += 2) list.push([a, b]); return list; };
  let x = 8, out = "";
  for (let n = 1; n <= 4; n += 1) {
    const half = (n - 1) * u + r, cx = x + half;
    for (const m of [n - 1, n]) if (m > 0) for (const [a, b] of lattice(m)) out += stone(cx + a * u, mid + b * u, m % 2 === 0, r);
    out += word(cx, 118, `${n}회`, 13);
    x += 2 * half + gap;
  }
  return svg(340, 128, "가운데부터 바깥 둘레에 흰 돌과 검은 돌을 번갈아 놓은 네 그림", out + dots(x - 14, mid), 330);
}

// ── 양팔저울과 비
// 기운 저울: 받침 꼭대기(cx, top)를 축으로 막대가 기운다. down = 1 이면 왼쪽이 내려감. 구슬은 아래 줄부터.
function tilt(cx, top, left, right, down, { L = 62, rx = 36, r = 11.5, deg = 9 } = {}) {
  const phi = (-down * deg * Math.PI) / 180, c = Math.cos(phi), s = Math.sin(phi);
  const rot = (x, y) => [cx + x * c - y * s, top + x * s + y * c];
  const [lx, ly] = rot(-L, 0), [rxe, rye] = rot(L, 0);
  let out = `<polygon points="${f(cx)},${f(top)} ${f(cx + 14)},${f(top + 26)} ${f(cx - 14)},${f(top + 26)}" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.5" stroke-linejoin="round"/>`
    + line(f(lx), f(ly), f(rxe), f(rye), { stroke: UT.line, width: 2.2 });
  const pan = (side, rows) => {
    const [px, py] = rot(side * L, -8);
    let body = line(f(side < 0 ? lx : rxe), f(side < 0 ? ly : rye), f(px), f(py), { stroke: UT.line, width: 2 })
      + `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rx}" ry="5.5" transform="rotate(${f((phi * 180) / Math.PI)} ${f(px)} ${f(py)})" fill="#f3efe6" stroke="${UT.line}" stroke-width="1.4"/>`;
    rows.forEach((row, k) => row.forEach((n, j) => {
      const [bx, by] = rot(side * L + (j - (row.length - 1) / 2) * (2 * r + 1), -8 - 4 - r - k * (2 * r - 3));
      body += `<circle cx="${f(bx)}" cy="${f(by)}" r="${r}" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.5"/>` + text(f(bx), f(by + 0.5), String(n), { size: 12, weight: 600 });
    }));
    return body;
  };
  return out + pan(-1, left) + pan(1, right);
}
// 원문은 위에 둘·아래에 하나로 놓였지만 칸이 좁아 글자가 작아지므로 세로로 차례대로 놓는다(7·8번).
const q7 = () => svg(230, 288, "구슬을 올린 기운 양팔 저울 세 개",
  tilt(115, 70, [[8, 9], [10]], [[1, 3, 5]], -1) + tilt(115, 160, [[1, 2, 3]], [[5, 6, 7]], 1)
  + tilt(115, 254, [[7, 8], [1]], [[5, 4], [2, 3]], 1), 250);
const q8 = () => svg(236, 270, "평형을 이룬 양팔 저울 세 개",
  balance(118, 40, [["circle"]], [["square", "square", "triangle"]], { s: 22 }) + balance(118, 128, [["star", "star"]], [["triangle", "triangle", "triangle"]], { s: 22 })
  + balance(118, 216, [["square"]], [["star", "triangle"]], { s: 22 }), 250);
function q9() {
  const h = 24;
  const bar = (x, y, n, w, mark) => Array.from({ length: n }, (_, i) => cell(x + i * w, y, w, h, "", { fill: UT.greenSoft, stroke: UT.green, width: 1.4 })
    + ringed(x + i * w + w / 2, y + h / 2, mark === "㉠" ? "ㄱ" : "ㄴ", { r: 8, size: 10 })).join("");
  // 길이 표시는 바깥 곡선 점선 + 끊은 자리에 글자·빈 칸(스킬 gfield-textbook-design 4-3, 원장 2026-11-24).
  // 오른쪽 그림은 빈 칸 둘이 부딪히지 않게 왼쪽 그림보다 조금 크게(비는 그대로) 그린다.
  const P = (x, y) => ({ x, y });
  const len = (x1, y, x2, label, side, opts = {}) => lenArc(P(x1, y), P(x2, y), label, { side, size: 12, boxW: 20, boxH: 17, ...opts });
  // (1) ㉠ 4개 = ㉡ 3개, ㉠과 ㉡을 이은 길이 42cm
  const a1 = 36, b1 = 48, y1 = 18, rx1 = 206, ra = 42, rb = 56;
  let out = word(14, y1 + 4, "(1)", 13) + bar(32, y1, 4, a1, "㉠") + bar(32, y1 + h, 3, b1, "㉡")
    + bar(rx1, y1 + 18, 1, ra, "㉠") + bar(rx1 + ra, y1 + 18, 1, rb, "㉡")
    + len(rx1, y1 + 18, rx1 + ra, "", -1, { blank: true }) + len(rx1 + ra, y1 + 18, rx1 + ra + rb, "", -1, { blank: true })
    + len(rx1, y1 + 18 + h, rx1 + ra + rb, "42cm", 1, { size: 13 });
  // (2) ㉠ 2개 = ㉡ 3개, ㉠이 ㉡보다 5cm 김
  const a2 = 72, b2 = 48, y2 = 150, rx2 = 222, ra2 = 90, rb2 = 60;
  out += word(14, y2 + 4, "(2)", 13) + bar(32, y2, 2, a2, "㉠") + bar(32, y2 + h, 3, b2, "㉡")
    + bar(rx2, y2, 1, ra2, "㉠") + bar(rx2, y2 + h, 1, rb2, "㉡")
    + len(rx2, y2, rx2 + ra2, "", -1, { blank: true })
    + len(rx2 + rb2, y2 + h, rx2 + ra2, "5cm", 1)
    + len(rx2, y2 + 2 * h, rx2 + rb2, "", 1, { blank: true });
  return svg(318, 252, "두 막대의 길이를 비교한 그림 두 개", out, 330);
}
const q10 = () => noteBox(["① A의 4배는 B의 5배와 같습니다.", "② 두 수 A, B의 합은 54입니다."]);
const q12 = () => noteBox(["① A의 4배는 B의 5배와 같습니다.", "② B의 3배는 C의 4배와 같습니다.", "③ 세 수 A, B, C의 합은 60입니다."]);

// ── 분수와 비: 몫·나머지 식 상자(16·17번)
function quotient(top, bottom, mark, times, total, label) {
  const named = (x, y, value) => (mark ? ringed(x, y, value, { r: 10, size: 12 }) : word(x, y, value, 14));
  return svg(320, 112, label,
    `<rect x="4" y="4" width="312" height="104" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`
    + named(mark ? 70 : 62, 34, top) + word(90, 34, ":", 14) + blank(102, 18, 32, 32)
    + named(mark ? 70 : 62, 80, bottom) + word(90, 80, ":", 14) + blank(102, 64, 32, 32) + word(142, 80, times, 14, "start")
    + `<path d="M210 24 H218 V102 H210 M218 57 H226" fill="none" stroke="${INK}" stroke-width="1.3"/>` + word(232, 57, total, 14, "start"));
}
const q16 = () => quotient("나", "가", true, "× 4 + 3", "합 : 38", "㉯ 칸과 ㉯ × 4 + 3 인 ㉮ 칸, 합 38");
const q17 = () => quotient("분모", "분자", false, "× 5 + 3", "차 : 35", "분모 칸과 분모 × 5 + 3 인 분자 칸, 차 35");

function q25() {
  // 모양: 동그라미 1개 · 네모 2개 · 세모 3개 · 동그라미 4개 … 로 묶음이 하나씩 길어지고, 홀수 번째는 검정·짝수 번째는 흰색, 쌓인 개수는 1·2·3·4 되풀이
  const kinds = ["circle", "square", "triangle"], cols = [];
  let group = 1, left = 1;
  for (let i = 1; i <= 16; i += 1) {
    cols.push({ kind: kinds[(group - 1) % 3], black: i % 2 === 1, count: ((i - 1) % 4) + 1 });
    left -= 1;
    if (!left) { group += 1; left = group; }
  }
  return svg(440, 136, "1번째부터 16번째까지 쌓인 도형",
    stacks(cols, { step: 25, s: 17, rise: 21, x0: 14, base: 98, label: 124 }) + dots(424, 50), 420);
}

const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer, mathPrompt: true });
const cm = (label) => ({ label, unit: "cm" });
export const questions = [
  Q(1, "다음은 모양을 일정한 패턴으로 나열한 것입니다. 55번째에 올 모양을 그리시오.", q1, null),
  Q(2, "다음 그림의 규칙에서 43번째에 올 모양을 그리시오.", q2, null),
  Q(3, "흰 바둑돌과 검은 바둑돌을 규칙적으로 늘어놓았습니다. 바둑돌이 모두 52개일 때, 어떤 색깔의 바둑돌이 몇 개 더 많습니까?", q3),
  Q(4, "다음은 일정한 규칙으로 수들을 나열한 것입니다. 물음에 답하시오. (1) 100번째 수를 구하시오. (2) 62번째 수까지의 합을 구하시오.", q4, [{ label: "(1)" }, { label: "(2)" }]),
  Q(5, "다음과 같은 규칙으로 바둑돌을 놓을 때, 아래 물음에 답하시오. (1) 34번째 놓인 바둑돌에는 검은 돌과 흰 돌 중 어느 것이 몇 개 더 많습니까? (2) 검은 돌이 흰 돌보다 21개 더 많다면 몇 번째 놓인 바둑돌입니까?", q5, [{ label: "(1)" }, { label: "(2)", unit: "번째" }]),
  Q(6, "다음 그림과 같이 가운데부터 바깥쪽으로 둘레에 바둑돌을 놓아 나가는데 1회 때는 흰 돌, 2회 때는 검은 돌, 3회 때는 흰 돌, 4회 때는 검은 돌을 번갈아 가며 바깥 둘레에 놓는다고 합니다. 26회째 바깥쪽 둘레에 붙이는 바둑돌의 색깔과 개수를 구하시오.", q6, [{ label: "색깔" }, { label: "개수", unit: "개" }]),
  Q(7, "구슬 10개 중 17g인 구슬이 1개, 10g인 구슬이 1개, 8g인 구슬이 8개입니다. 구슬을 양팔 저울에 달아 보았더니 다음 그림과 같았다면 17g인 구슬은 몇 번입니까?", q7, { label: "답", unit: "번" }),
  Q(8, "다음 저울은 모두 평형을 이루고 있습니다. ○ 1개는 △ 몇 개의 무게와 같습니까?", q8, { label: "답", unit: "개" }),
  Q(9, "다음 그림은 두 막대의 길이를 비교한 것입니다. 두 막대의 길이를 각각 구하시오.", q9, [cm("(1) ㉠"), cm("㉡"), cm("(2) ㉠"), cm("㉡")]),
  Q(10, "두 수 A, B는 다음 조건에 맞는 수입니다. 두 수 A, B를 각각 구하시오.", q10, [{ label: "A" }, { label: "B" }]),
  Q(11, "배 4개의 값은 사과 7개의 값과 같습니다. 배 1개의 값이 사과 1개보다 900원 더 클 때, 배 1개와 사과 1개의 값을 각각 구하시오.", null, [{ label: "배", unit: "원" }, { label: "사과", unit: "원" }]),
  Q(12, "세 수 A, B, C가 있습니다. 주어진 조건을 보고 세 수 A, B, C를 각각 구하시오.", q12, [{ label: "A" }, { label: "B" }, { label: "C" }]),
  Q(13, "재윤이는 가지고 있는 구슬 중에서 동생에게 전체의 1/3을 주고, 형에게는 나머지의 2/5를 주었더니, 12개가 남았습니다. 재윤이가 처음에 가지고 있던 구슬은 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(14, "검은 바둑돌과 흰 바둑돌이 모두 56개 있습니다. 검은 바둑돌이 흰 바둑돌의 3/5일 때, 검은 바둑돌과 흰 바둑돌의 개수를 각각 구하시오.", null, [{ label: "검은 바둑돌", unit: "개" }, { label: "흰 바둑돌", unit: "개" }]),
  Q(15, "다경이네 학교의 남학생 수는 전체의 5/12인데, 남학생 수는 여학생 수보다 60명이 적다고 합니다. 다경이네 학교의 전체 학생 수는 몇 명인지 구하시오.", null, { label: "답", unit: "명" }),
  Q(16, "두 수 ㉮, ㉯가 있습니다. ㉮를 ㉯로 나누면 몫이 4이고 나머지가 3입니다. ㉮와 ㉯의 합이 38일 때, ㉯를 구하시오.", q16, { label: "답" }),
  Q(17, "어떤 가분수의 분자와 분모의 차는 35입니다. 또, 분자를 분모로 나눈 몫이 5이고, 나머지가 3이었습니다. 어떤 가분수를 대분수로 나타내시오.", q17),
  Q(18, "재석이가 친구 7명에게 초콜릿을 선물했습니다. 재석이는 7명의 친구들에게 차례대로 1번 친구에게 처음 초콜릿의 1/8을 주고, 2번 친구에게 남은 초콜릿의 1/7을 주고, 3번 친구에게 남은 초콜릿의 1/6을 주고, …, 7번 친구에게 남은 초콜릿의 1/2을 주었더니 마지막에 초콜릿 4개가 남았습니다. 맨 처음 재석이가 가지고 있던 초콜릿의 개수를 구하시오.", null, { label: "답", unit: "개" }),
  Q(19, "60m인 도로의 한쪽에 6m 간격으로 큰 나무를 심고, 큰 나무 사이에 작은 나무를 2그루씩 심으려 합니다. 도로의 시작하는 곳부터 큰 나무를 심는다고 할 때, 큰 나무와 작은 나무의 수를 각각 구하시오. (이때, 도로의 시작과 끝에 큰 나무를 심습니다.)", null, [{ label: "큰 나무", unit: "그루" }, { label: "작은 나무", unit: "그루" }]),
  Q(20, "목장 둘레에 울타리를 치기 위하여 8m 간격으로 말뚝을 박았습니다. 사용된 말뚝이 모두 13개였다면 목장 둘레는 몇 m입니까? (단, 목장의 둘레는 모두 이어집니다.)", null, { label: "답", unit: "m" }),
  Q(21, "통나무 한 개를 6도막으로 자르는데 30분이 걸렸습니다. 같은 빠르기로 통나무를 자른다고 할 때, 통나무 한 개를 9도막으로 자르는데 몇 분이 걸립니까?", null, { label: "답", unit: "분" }),
  Q(22, "찬호는 3m 20㎝인 통나무를 40㎝씩 8도막으로 자르려고 합니다. 한 번 자르는데 7분이 걸리고, 한 번 자른 후 1분씩 쉬었다가 잘랐습니다. 찬호가 통나무를 8도막으로 자르는데 걸리는 시간을 구하시오.", null, { label: "답", unit: "분" }),
  Q(23, "길이가 72㎝인 통나무 1개를 똑같은 길이로 자르려고 합니다. 한 번 자르는데 7분이 걸리고 한 번 자른 후 3분을 쉬었는데 총 47분이 걸렸습니다. 자른 통나무의 한 도막의 길이는 몇 ㎝인지 구하시오.", null, { label: "답", unit: "㎝" }),
  Q(24, "도로의 한쪽에 가로등과 가로수를 세우려고 합니다. 20m 간격으로 가로등을 세우고 가로등과 가로등 사이에 5m 간격으로 가로수를 심기로 하였습니다. 이때, 가로등과 가로수가 모두 61개 필요하다면 도로의 길이는 몇 m인지 구하시오.", null, { label: "답", unit: "m" }),
  Q(25, "다음 그림의 규칙에서 59번째에 올 모양을 그리시오.", q25, null),
];
