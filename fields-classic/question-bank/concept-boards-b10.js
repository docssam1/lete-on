// 손글씨 판서 대본 — 10권(연속수의 합). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 곱셈·범위·연속수는 골든벨 10권 문항(14 × 3·23 × 7·47 × 50·21 × 67 …, 10~69·47~96·100~999 …,
// 1~14·1~60·17~38 …, 1~13·19~21·27~33·45~55 …)과 겹치지 않게 골랐다.

import { jo } from "./concept-board-kit.js?v=20261026b";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const total = (a, b) => range(a, b).reduce((s, v) => s + v, 0);

// 넓이 상자: 가로를 cols(수와 너비), 세로를 rows(수와 높이)로 나눈 직사각형
const splitBox = (x0, y0, cols, rows) => {
  const xs = cols.reduce((a, [, w]) => [...a, a[a.length - 1] + w], [x0]), ys = rows.reduce((a, [, h]) => [...a, a[a.length - 1] + h], [y0]);
  const W = xs[xs.length - 1] - x0, H = ys[ys.length - 1] - y0;
  const frame = [{ kind: "box", x: x0, y: y0, w: W, h: H, color: "ink" }, ...xs.slice(1, -1).map((x) => ({ kind: "line", x1: x, y1: y0, x2: x, y2: y0 + H, color: "ink", width: 2.5 })), ...ys.slice(1, -1).map((y) => ({ kind: "line", x1: x0, y1: y, x2: x0 + W, y2: y, color: "ink", width: 2.5 }))];
  const labels = [...cols.map(([v], i) => T((xs[i] + xs[i + 1]) / 2, y0 - 14, String(v), "blue", 26, "center")), ...rows.map(([v], j) => T(x0 - 14, (ys[j] + ys[j + 1]) / 2 + 9, String(v), "red", 26, "right"))];
  const cell = (i, j, text, color = "green", size = 26) => T((xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2 + 9, text, color, size, "center");
  return { frame, labels, cell };
};

export const BOARDS_B10 = {
  "book-10/napier-split-source": (() => {
    const A = { a: 57, b: 6 }, aT = Math.floor(A.a / 10) * 10, aO = A.a % 10;
    const B = { a: 34, b: 26 }, bT = 30, bO = 4, cT = 20, cO = 6;
    const P = splitBox(110, 165, [[aT, 230], [aO, 110]], [[A.b, 80]]);
    const Q = splitBox(110, 360, [[bT, 230], [bO, 110]], [[cT, 90], [cO, 60]]);
    const NX = 540;
    const CHK = { a: 48, b: 5 }, chkV = CHK.a * CHK.b;
    return {
      title: "곱셈을 칸으로 나누어 계산해요",
      kicker: "10권 1단원 · 손글씨 개념",
      beats: [
        { say: "두 자리 수의 곱셈을 한 번에 하기 어려우면, 수를 몇십과 몇으로 나누어 칸을 만들어요. 칸마다 곱하고, 마지막에 모두 더하면 처음 곱셈의 답이에요.",
          items: [title("나누어 곱하고 더하기")] },
        { say: `${A.a} 곱하기 ${jo(A.b, "을")} 계산해요. ${jo(A.a, "을")} ${jo(aT, "과")} ${aO}로 나누어 두 칸짜리 상자를 그려요. 세로에는 ${jo(A.b, "을")} 써요.`,
          items: [...P.frame, ...P.labels, T(NX, 190, `${A.a} × ${A.b} = ?`, "ink", 30)] },
        { say: `칸마다 곱해요. 왼쪽 칸은 ${aT} 곱하기 ${A.b}, ${jo(aT * A.b, "이에요")}. 오른쪽 칸은 ${aO} 곱하기 ${A.b}, ${jo(aO * A.b, "예요")}.`,
          items: [P.cell(0, 0, `${aT * A.b}`), P.cell(1, 0, `${aO * A.b}`), T(NX, 235, `${aT} × ${A.b} = ${aT * A.b},  ${aO} × ${A.b} = ${aO * A.b}`, "green", 24)] },
        { say: `두 칸을 더해요. ${aT * A.b} 더하기 ${jo(aO * A.b, "는")} ${jo(A.a * A.b, "예요")}. ${A.a} 곱하기 ${jo(A.b, "은")} ${jo(A.a * A.b, "예요")}.`,
          items: [T(NX, 280, `${aT * A.b} + ${aO * A.b} = ${A.a * A.b}`, "red", 32)] },
        { say: `곱하는 수도 두 자리이면 세로도 나눠요. ${B.a} 곱하기 ${jo(B.b, "은")} ${B.a}를 ${jo(bT, "과")} ${bO}로, ${jo(B.b, "을")} ${jo(cT, "과")} ${cO}으로 나눠요. 칸이 네 개가 돼요.`,
          items: [{ kind: "line", x1: 60, y1: 318, x2: 940, y2: 318, color: "gray", width: 2, dash: true }, ...Q.frame, ...Q.labels, T(NX, 380, `${B.a} × ${B.b} = ?`, "ink", 30)] },
        { say: `칸마다 곱해요. ${bT} 곱하기 ${jo(cT, "은")} ${bT * cT}, ${bO} 곱하기 ${jo(cT, "은")} ${bO * cT}, ${bT} 곱하기 ${jo(cO, "은")} ${bT * cO}, ${bO} 곱하기 ${jo(cO, "은")} ${jo(bO * cO, "예요")}.`,
          items: [Q.cell(0, 0, `${bT * cT}`), Q.cell(1, 0, `${bO * cT}`), Q.cell(0, 1, `${bT * cO}`, "green", 22), Q.cell(1, 1, `${bO * cO}`, "green", 22)] },
        { say: `네 칸을 모두 더해요. ${bT * cT} 더하기 ${bO * cT} 더하기 ${bT * cO} 더하기 ${jo(bO * cO, "는")} ${jo(B.a * B.b, "예요")}.`,
          items: [T(NX, 430, `${bT * cT} + ${bO * cT} + ${bT * cO} + ${bO * cO}`, "red", 28), T(NX, 475, `= ${B.a * B.b}`, "red", 34)] },
        { say: "정리해요. 수를 몇십과 몇으로 나누어 칸을 만들어요. 칸마다 곱하고, 모든 칸의 곱을 더해요. 칸이 몇 개가 되어도 방법은 같아요.", mood: "praise",
          items: [T(60, 575, "몇십과 몇으로 나누기 → 칸마다 곱하기 → 모두 더하기", "gold", 26)] },
        { say: `한 문제 풀어 봐요. ${CHK.a} 곱하기 ${jo(CHK.b, "를")} ${Math.floor(CHK.a / 10) * 10} 곱하기 ${jo(CHK.b, "와")} ${CHK.a % 10} 곱하기 ${CHK.b}로 나누어 계산하면 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a} × ${CHK.b}를 ${Math.floor(CHK.a / 10) * 10} × ${CHK.b}와 ${CHK.a % 10} × ${CHK.b}로 나누면?`,
            options: [String(Math.floor(CHK.a / 10) * 10 * CHK.b), String(chkV), String(Math.floor(CHK.a / 10) * 10 * CHK.b + CHK.a % 10)], answer: 1,
            hint: "두 칸의 곱을 모두 더해요.", sayHint: `${Math.floor(CHK.a / 10) * 10} 곱하기 ${jo(CHK.b, "는")} ${Math.floor(CHK.a / 10) * 10 * CHK.b}, ${CHK.a % 10} 곱하기 ${jo(CHK.b, "는")} ${jo(CHK.a % 10 * CHK.b, "이에요")}. 더해 봐요.`,
            right: `맞았어요! ${Math.floor(CHK.a / 10) * 10 * CHK.b} + ${CHK.a % 10 * CHK.b} = ${chkV}.`, sayRight: `맞았어요! 두 칸을 더하면 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-10/number-count-source": (() => {
    const S = { a: 4, b: 9 }, X0 = 110, DX = 80, DY = 220, at = (v) => X0 + (v - 1) * DX;
    const L = { a: 35, b: 82 }, cnt = L.b - L.a + 1;
    const NX = 110;
    const CHK = { a: 16, b: 40 }, chkV = CHK.b - CHK.a + 1;
    return {
      title: "수의 개수 — 처음 수도 세요",
      kicker: "10권 1단원 · 손글씨 개념",
      beats: [
        { say: "어디부터 어디까지 수가 몇 개인지 셀 때, 끝 수에서 처음 수를 빼기만 하면 하나가 모자라요. 처음 수도 세어야 하니까요. 작은 수로 그려서 확인해 봐요.",
          items: [title("수의 개수 세기")] },
        { say: `${S.a}부터 ${S.b}까지의 수는 몇 개일까요? 1부터 ${S.b}까지 점을 찍고 수를 써요.`,
          items: [...range(1, S.b).flatMap((v) => [{ kind: "shape", type: "circle", cx: at(v), cy: DY, r: 12, color: "gray", width: 2.5 }, T(at(v), DY + 48, String(v), "gray", 24, "center")])] },
        { say: `${S.a}부터 ${S.b}까지를 색칠해요. 하나씩 세면 ${range(S.a, S.b).map((_, i) => i + 1).join(", ")}. ${KO[S.b - S.a + 1]} 개예요.`,
          items: [...range(S.a, S.b).map((v) => ({ kind: "shape", type: "circle", cx: at(v), cy: DY, r: 12, color: "blue", fill: "blue" })), { kind: "box", x: at(S.a) - 26, y: DY - 28, w: at(S.b) - at(S.a) + 52, h: 56, color: "blue", dash: true }] },
        { say: `그런데 ${S.b} 빼기 ${jo(S.a, "는")} ${jo(S.b - S.a, "예요")}. 하나 모자라요. 빼기는 ${S.a}에서 ${S.b}까지 몇 칸 건너가는지를 센 거라서, 처음 점 ${jo(S.a, "를")} 빠뜨렸어요.`,
          items: [...range(S.a, S.b - 1).map((v) => ({ kind: "arrow", x1: at(v) + 14, y1: DY - 22, x2: at(v + 1) - 14, y2: DY - 22, bend: 18, color: "red", width: 2 })), T(at(S.a), DY - 62, `${S.b} − ${S.a} = ${S.b - S.a}  (건너간 칸)`, "red", 22)] },
        { say: `다른 방법도 있어요. 1부터 ${S.b}까지는 ${KO[S.b]} 개, 그중 1부터 ${S.a - 1}까지 ${KO[S.a - 1]} 개를 빼요. ${S.b} 빼기 ${jo(S.a - 1, "은")} ${S.b - S.a + 1}. 같아요.`,
          items: [T(NX, 330, `${S.b} − ${S.a - 1} = ${S.b - S.a + 1}`, "green", 28), T(NX + 300, 330, `${S.b} − ${S.a} + 1 = ${S.b - S.a + 1}`, "blue", 28)] },
        { say: `그래서 개수는 끝 수 빼기 처음 수, 더하기 1이에요. ${L.a}부터 ${L.b}까지는 ${L.b} 빼기 ${jo(L.a, "는")} ${L.b - L.a}, 더하기 1, ${cnt}개예요.`,
          items: [T(NX, 400, "개수 = 끝 수 − 처음 수 + 1", "gold", 30), T(NX, 455, `${L.a} ~ ${L.b}:  ${L.b} − ${L.a} + 1 = ${cnt}개`, "blue", 30)] },
        { say: `확인해요. 1부터 ${L.b}까지 ${L.b}개에서, 1부터 ${L.a - 1}까지 ${L.a - 1}개를 빼면 ${jo(cnt, "예요")}. 같아요.`,
          items: [T(NX, 505, `${L.b} − ${L.a - 1} = ${cnt} ✓`, "green", 26)] },
        { say: "정리해요. 끝 수에서 처음 수를 빼면 건너간 칸의 수예요. 처음 수도 세야 하니 1을 더해요. 헷갈리면 작은 수로 그려서 확인해요.", mood: "praise",
          items: [T(60, 572, "끝 수 − 처음 수 + 1 · 작은 수로 확인", "gold", 26)] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지의 수는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a}부터 ${CHK.b}까지의 수는 모두 몇 개?`,
            options: [String(chkV - 1), String(chkV), String(chkV + 1)], answer: 1,
            hint: "끝 수 − 처음 수 + 1", sayHint: `${CHK.b} 빼기 ${jo(CHK.a, "은")} ${jo(CHK.b - CHK.a, "이에요")}. 처음 수도 세야 해요.`,
            right: `맞았어요! ${CHK.b} − ${CHK.a} + 1 = ${chkV}.`, sayRight: `맞았어요! 처음 수 ${CHK.a}까지 세면 ${chkV}개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-10/consecutive-even-source": (() => {
    const N = 12, pairSum = N + 1, pairs = N / 2, X0 = 100, DX = 72, Y0 = 250, at = (v) => X0 + (v - 1) * DX;
    const arc = (k) => { const a = at(1 + k) , b = at(N - k), h = 150 - k * 22; return { kind: "path", d: `M ${a} ${Y0 - 30} Q ${(a + b) / 2} ${Y0 - 30 - h} ${b} ${Y0 - 30}`, stroke: ["red", "gold", "green", "blue", "red", "gold"][k], width: 2.5 }; };
    const B = { a: 8, b: 23 }, bCnt = B.b - B.a + 1, bPair = B.a + B.b;
    const NX = 100;
    const CHK = { n: 16 }, chkV = total(1, CHK.n);
    return {
      title: "짝수 개 연속수의 합 — 양끝을 짝지어요",
      kicker: "10권 1단원 · 손글씨 개념",
      beats: [
        { say: "이어지는 수를 모두 더할 때, 하나씩 더하지 않아도 돼요. 맨 앞 수와 맨 끝 수를 짝지으면 짝의 합이 모두 같아요. 짝의 합에 짝의 개수를 곱하면 돼요.",
          items: [title("양끝을 짝지어요")] },
        { say: `1부터 ${N}까지 써요. 수는 모두 ${KO[10]} ${KO[N - 10]} 개예요.`,
          items: range(1, N).map((v) => T(at(v), Y0, String(v), "ink", 32, "center")) },
        { say: `맨 앞 1과 맨 끝 ${jo(N, "를")} 짝지어요. 1 더하기 ${jo(N, "는")} ${jo(pairSum, "이에요")}.`,
          items: [arc(0), T((at(1) + at(N)) / 2, Y0 - 118, String(pairSum), "red", 24, "center")] },
        { say: `한 칸씩 안으로 들어가요. 2 더하기 ${N - 1}, 3 더하기 ${N - 2}. 앞의 수가 1 커지면 뒤의 수가 1 작아지니까, 짝의 합은 계속 ${jo(pairSum, "이에요")}.`,
          items: [arc(1), arc(2), arc(3), arc(4), arc(5), T(NX, Y0 + 60, range(1, pairs).map((v) => `${v}+${N + 1 - v}`).join(" = ") + ` = ${pairSum}`, "blue", 22)] },
        { say: `짝은 몇 개일까요? 수가 ${N}개니까 둘씩 짝지으면 ${N} 나누기 2, ${KO[pairs]} 개예요.`,
          items: [T(NX, Y0 + 110, `짝의 개수 = ${N} ÷ 2 = ${pairs}`, "gold", 28)] },
        { say: `합은 짝의 합 ${pairSum} 곱하기 짝의 개수 ${pairs}, ${jo(pairSum * pairs, "이에요")}.`,
          items: [T(NX, Y0 + 160, `${pairSum} × ${pairs} = ${pairSum * pairs}`, "red", 32)] },
        { say: `1부터 시작하지 않아도 같아요. ${B.a}부터 ${B.b}까지 더해 봐요. 수의 개수는 ${B.b} 빼기 ${B.a} 더하기 1, ${bCnt}개. 짝은 ${KO[bCnt / 2]} 개, 짝의 합은 ${B.a} 더하기 ${B.b}, ${jo(bPair, "이에요")}. ${bPair} 곱하기 ${jo(bCnt / 2, "는")} ${jo(bPair * bCnt / 2, "이에요")}.`,
          items: [T(560, Y0 + 60, `${B.a} + ${B.a + 1} + … + ${B.b - 1} + ${B.b}`, "ink", 24), T(560, Y0 + 105, `개수 ${B.b} − ${B.a} + 1 = ${bCnt}, 짝 ${bCnt / 2}개`, "gold", 22), T(560, Y0 + 150, `${bPair} × ${bCnt / 2} = ${bPair * bCnt / 2}`, "red", 30)] },
        { say: "정리해요. 맨 앞 수와 맨 끝 수를 더해 짝의 합을 구해요. 수의 개수를 둘로 나누면 짝의 개수예요. 짝의 합 곱하기 짝의 개수가 전체 합이에요.", mood: "praise",
          items: [T(60, 570, "(처음 수 + 끝 수) × (개수 ÷ 2)", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 1부터 ${CHK.n}까지의 합은 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `1부터 ${CHK.n}까지의 합은?`,
            options: [String((CHK.n + 1) * CHK.n / 2 - CHK.n / 2), String(chkV), String((CHK.n + 1) * CHK.n)], answer: 1,
            hint: `짝의 합 ${CHK.n + 1}, 짝의 개수 ${CHK.n / 2}`, sayHint: `1 더하기 ${jo(CHK.n, "은")} ${jo(CHK.n + 1, "이에요")}. 짝은 ${KO[CHK.n / 2]} 개예요.`,
            right: `맞았어요! ${CHK.n + 1} × ${CHK.n / 2} = ${chkV}.`, sayRight: `맞았어요! ${CHK.n + 1} 곱하기 ${jo(CHK.n / 2, "은")} ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-10/consecutive-odd-source": (() => {
    const A = range(4, 10), mid = A[(A.length - 1) / 2], n = A.length;
    const X0 = 100, BW = 46, GAP = 62, BASE = 380, U = 22;
    const bx = (i) => X0 + i * GAP;
    const bars = A.map((v, i) => ({ kind: "fill", x: bx(i), y: BASE - v * U, w: BW, h: v * U, fill: "#cfe0f5" }));
    const outlines = A.map((v, i) => ({ kind: "box", x: bx(i), y: BASE - v * U, w: BW, h: v * U, color: "blue" }));
    const labels = A.map((v, i) => T(bx(i) + BW / 2, BASE + 34, String(v), "ink", 26, "center"));
    const extra = A.map((v, i) => v > mid ? { kind: "fill", x: bx(i), y: BASE - v * U, w: BW, h: (v - mid) * U, fill: "#f6e1a8" } : null).filter(Boolean);
    const gaps = A.map((v, i) => v < mid ? { kind: "box", x: bx(i), y: BASE - mid * U, w: BW, h: (mid - v) * U, color: "gold", dash: true } : null).filter(Boolean);
    const moves = A.map((v, i) => v > mid ? { kind: "arrow", x1: bx(i) + BW / 2, y1: BASE - v * U - 8, x2: bx(n - 1 - i) + BW / 2, y2: BASE - mid * U - 8, bend: 40 + (i - (n - 1) / 2) * 12, color: "gold", width: 2.5 } : null).filter(Boolean);
    const B = range(23, 31), bMid = B[(B.length - 1) / 2];
    const NX = 560;
    const CHK = range(12, 16), chkMid = CHK[2], chkV = chkMid * CHK.length;
    return {
      title: "홀수 개 연속수의 합 — 가운데 수로",
      kicker: "10권 1단원 · 손글씨 개념",
      beats: [
        { say: "이어지는 수의 개수가 홀수이면, 양끝을 짝지으면 수 하나가 가운데에 혼자 남아요. 그런데 그 가운데 수가 열쇠예요. 모든 수를 가운데 수로 고르게 만들 수 있거든요.",
          items: [title("가운데 수로 더하기")] },
        { say: `${A[0]}부터 ${A[n - 1]}까지 ${KO[n]} 개의 수를 막대로 그려요. 한 칸씩 1 높아져요.`,
          items: [...bars, ...outlines, ...labels] },
        { say: `가운데에 있는 수는 ${jo(mid, "이에요")}. 왼쪽에 셋, 오른쪽에 셋이 있어요. 높이 ${mid}에 선을 그어요.`,
          items: [{ kind: "line", x1: X0 - 20, y1: BASE - mid * U, x2: bx(n - 1) + BW + 20, y2: BASE - mid * U, color: "red", width: 2.5, dash: true }, T(bx(n - 1) + BW + 28, BASE - mid * U + 8, String(mid), "red", 26)] },
        { say: `${mid}보다 높은 막대의 윗부분을 잘라 낮은 막대에 옮겨요. ${A[n - 1]}의 ${A[n - 1] - mid}칸은 ${A[0]}에, ${A[n - 2]}의 ${A[n - 2] - mid}칸은 ${A[1]}에, ${A[n - 3]}의 1칸은 ${A[2]}에 줘요.`,
          items: [...extra, ...gaps, ...moves] },
        { say: `그러면 막대 ${KO[n]} 개가 모두 ${mid}이 돼요. 맨 앞과 맨 끝의 짝도 ${A[0]} 더하기 ${A[n - 1]}, ${mid}의 두 배예요. 합은 ${mid} 곱하기 ${n}, ${jo(mid * n, "예요")}.`,
          items: [T(NX, 175, `${A[0]} + ${A[n - 1]} = ${A[1]} + ${A[n - 2]} = ${mid * 2} = ${mid} × 2`, "gold", 22), T(NX, 220, `모두 ${mid}처럼 → ${mid} × ${n} = ${mid * n}`, "red", 28)] },
        { say: `가운데 수는 처음 수와 끝 수를 더해 반으로 나누면 나와요. ${A[0]} 더하기 ${jo(A[n - 1], "은")} ${A[0] + A[n - 1]}, 반은 ${jo(mid, "이에요")}.`,
          items: [T(NX, 265, `가운데 = (${A[0]} + ${A[n - 1]}) ÷ 2 = ${mid}`, "blue", 26)] },
        { say: `큰 수도 같아요. ${B[0]}부터 ${B[B.length - 1]}까지 더해 봐요. 수는 ${KO[B.length]} 개, 가운데는 (${B[0]} 더하기 ${B[B.length - 1]}) 나누기 2, ${jo(bMid, "이에요")}. 합은 ${bMid} 곱하기 ${B.length}, ${jo(bMid * B.length, "이에요")}.`,
          items: [T(NX, 440, `${B[0]} + ${B[1]} + … + ${B[B.length - 1]}  (${B.length}개)`, "ink", 24), T(NX, 485, `가운데 (${B[0]} + ${B[B.length - 1]}) ÷ 2 = ${bMid}`, "blue", 24), T(NX, 530, `${bMid} × ${B.length} = ${bMid * B.length}`, "red", 30)] },
        { say: "정리해요. 홀수 개의 연속수는 가운데 수 하나가 남아요. 높은 쪽을 낮은 쪽에 옮기면 모두 가운데 수가 돼요. 합은 가운데 수 곱하기 수의 개수예요.", mood: "praise",
          items: [T(60, 575, "가운데 수 × 수의 개수", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${CHK.join(" 더하기 ")}의 합은 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.join(" + ")}의 합은?`,
            options: [String(chkV - chkMid), String(chkV), String(chkV + CHK.length)], answer: 1,
            hint: "가운데 수를 찾아 수의 개수를 곱해요.", sayHint: `가운데 수는 ${jo(chkMid, "예요")}. 수는 다섯 개예요.`,
            right: `맞았어요! ${chkMid} × ${CHK.length} = ${chkV}.`, sayRight: `맞았어요! ${chkMid} 곱하기 5는 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
