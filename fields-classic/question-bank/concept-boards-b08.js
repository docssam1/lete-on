// 손글씨 판서 대본 — 8권(묶음수와 매트릭스·복면산·합차와 배수·거꾸로 생각하기). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 도형 값·합·곱은 골든벨 8권 문항(매트릭스 합 24·17·10 …, ○ + □ = 17, 곱 63·48·24 …)과
// 같은 판이 되지 않게 새로 짰다.

import { jo } from "./concept-board-kit.js?v=20261025f";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
// 도형마다 색을 하나로 정해 둔다(식에서도, 판에서도 같은 색)
const SHAPE_COLOR = { circle: "blue", triangle: "red", square: "green", star: "gold", diamond: "gold" };
const SHAPE_NAME = { circle: "동그라미", triangle: "세모", square: "네모", star: "별", diamond: "마름모" };
const shape = (type, cx, cy, r = 24, value) => ({ kind: "shape", type, cx, cy, r, color: SHAPE_COLOR[type], width: 3, value, size: Math.round(r * 1.05) });
// 도형 식 한 줄: ○ + △ + △ = 18 처럼 도형을 펜으로 그리고 + 와 = 는 글씨로
const eqRow = (x, y, types, total, gap = 80) => {
  const out = [];
  types.forEach((t, i) => { out.push(shape(t, x + i * gap, y)); if (i < types.length - 1) out.push(T(x + i * gap + gap / 2, y + 12, "+", "ink", 32, "center")); });
  out.push(T(x + (types.length - 1) * gap + 44, y + 12, `= ${total}`, "ink", 34));
  return out;
};

export const BOARDS_B08 = {
  "book-08/addition-sum-matrix": (() => {
    const CELLS = [["triangle", "triangle", "triangle"], ["triangle", "circle", "circle"], ["square", "circle", "square"]];
    const V = { triangle: 6, circle: 5, square: 4 };
    const rowS = CELLS.map((r) => r.reduce((a, t) => a + V[t], 0)), colS = [0, 1, 2].map((c) => CELLS.reduce((a, r) => a + V[r[c]], 0));
    const X0 = 90, Y0 = 150, S = 100, RX = 540;
    const at = (r, c) => [X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S];
    const pieces = CELLS.flatMap((row, r) => row.map((t, c) => { const [x, y] = at(r, c); return shape(t, x, y, 30); }));
    const fillIn = (type) => CELLS.flatMap((row, r) => row.map((t, c) => t === type ? (() => { const [x, y] = at(r, c); return T(x, y + (type === "triangle" ? 18 : 11), String(V[t]), SHAPE_COLOR[t], 28, "center"); })() : null)).filter(Boolean);
    const rowTxt = (r, v, color = "blue") => T(X0 + 3 * S + 22, Y0 + (r + 0.5) * S + 12, String(v), color, 34);
    const colTxt = (c, v, color = "blue") => T(X0 + (c + 0.5) * S, Y0 + 3 * S + 44, String(v), color, 34, "center");
    const CHK = { tri: 6, total: 20 }, chkV = (CHK.total - CHK.tri) / 2;
    return {
      title: "덧셈 매트릭스의 빈칸 채우기",
      kicker: "8권 1단원 · 손글씨 개념",
      beats: [
        { say: "도형이 칸마다 들어 있고, 줄 끝에 그 줄 도형들의 합이 적혀 있어요. 같은 도형은 어디에 있어도 같은 수예요. 어느 줄부터 풀지 정하는 것이 핵심이에요.",
          items: [title("덧셈 매트릭스")] },
        { say: "세 줄, 세 칸의 판을 그려요. 첫째 가로줄은 세모 세 개, 둘째 가로줄은 세모 하나와 동그라미 둘, 셋째 가로줄은 네모, 동그라미, 네모예요.",
          items: [{ kind: "grid", x: X0, y: Y0, cols: 3, rows: 3, cell: S, color: "ink" }, ...pieces] },
        { say: `가로줄 끝에 합을 써요. 첫째 줄 ${rowS[0]}, 둘째 줄 ${jo(rowS[1], "이고")}, 셋째 줄은 비어 있어요. 세로줄 아래에는 ${colS[0]}, ${colS[1]}, ${jo(colS[2], "를")} 써요. 셋째 가로줄의 합을 찾아야 해요.`,
          items: [rowTxt(0, rowS[0]), rowTxt(1, rowS[1]), rowTxt(2, "?", "red"), colTxt(0, colS[0]), colTxt(1, colS[1]), colTxt(2, colS[2])] },
        { say: "어느 줄부터 볼까요? 한 가지 도형만 들어 있는 줄이에요. 첫째 가로줄은 세모만 세 개예요.",
          items: [{ kind: "box", x: X0 + 4, y: Y0 + 4, w: 3 * S - 8, h: S - 8, color: "gold", dash: true }] },
        { say: `세모 세 개가 ${jo(rowS[0], "이에요")}. ${V.triangle}, ${V.triangle * 2}, ${V.triangle * 3}. 세 번 더해 ${jo(rowS[0], "이")} 되는 수는 ${V.triangle}. 세모는 ${jo(V.triangle, "이에요")}. 판의 세모마다 ${jo(V.triangle, "을")} 써 넣어요.`,
          items: [T(RX, 170, `△ + △ + △ = ${rowS[0]}`, "red", 30), T(RX, 215, `${rowS[0]} ÷ 3 = ${V.triangle}  →  △ = ${V.triangle}`, "red", 30), ...fillIn("triangle")] },
        { say: `둘째 가로줄은 세모 하나와 동그라미 둘, 합이 ${jo(rowS[1], "이에요")}. 세모 ${jo(V.triangle, "을")} 빼면 ${rowS[1]} 빼기 ${jo(V.triangle, "은")} ${jo(rowS[1] - V.triangle, "이에요")}. 동그라미 두 개가 ${jo(rowS[1] - V.triangle, "이니까")} 동그라미는 ${jo(V.circle, "예요")}.`,
          items: [T(RX, 280, `${rowS[1]} − ${V.triangle} = ${rowS[1] - V.triangle} = ○ + ○`, "blue", 30), T(RX, 325, `○ = ${V.circle}`, "blue", 30), ...fillIn("circle")] },
        { say: `네모는 어디서 찾을까요? 첫째 세로줄을 봐요. 세모, 세모, 네모, 합이 ${jo(colS[0], "이에요")}. 세모 둘은 ${jo(V.triangle * 2, "이니까")} ${colS[0]} 빼기 ${jo(V.triangle * 2, "는")} ${V.square}. 네모는 ${jo(V.square, "예요")}.`,
          items: [{ kind: "box", x: X0 + 4, y: Y0 + 4, w: S - 8, h: 3 * S - 8, color: "green", dash: true }, T(RX, 390, `${colS[0]} − ${V.triangle * 2} = ${V.square}  →  □ = ${V.square}`, "green", 30), ...fillIn("square")] },
        { say: `이제 셋째 가로줄을 더해요. 네모 ${V.square}, 동그라미 ${V.circle}, 네모 ${V.square}. ${V.square} 더하기 ${V.circle} 더하기 ${jo(V.square, "는")} ${jo(rowS[2], "이에요")}.`,
          items: [rowTxt(2, rowS[2], "red"), T(RX, 455, `${V.square} + ${V.circle} + ${V.square} = ${rowS[2]}`, "red", 32)] },
        { say: `안 쓴 줄로 확인해요. 둘째 세로줄 ${V.triangle} 더하기 ${V.circle} 더하기 ${jo(V.circle, "는")} ${colS[1]}, 셋째 세로줄 ${V.triangle} 더하기 ${V.circle} 더하기 ${jo(V.square, "는")} ${jo(colS[2], "이에요")}. 적힌 합과 똑같아요.`,
          items: [T(RX, 510, `${V.triangle}+${V.circle}+${V.circle} = ${colS[1]} ✓   ${V.triangle}+${V.circle}+${V.square} = ${colS[2]} ✓`, "gray", 24)] },
        { say: "정리해요. 한 가지 도형만 있는 줄부터 나누어 값을 찾아요. 찾은 값을 다른 줄에 넣으면 모르는 도형이 하나씩 줄어요. 마지막에 쓰지 않은 줄로 확인해요.", mood: "praise",
          items: [T(60, 565, "한 가지 도형만 있는 줄 → 넣고 → 빼고 → 확인", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 세모가 ${jo(CHK.tri, "인")} 판에서, 세모 하나와 동그라미 둘이 있는 줄의 합이 ${jo(CHK.total, "이에요")}. 동그라미는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `△ = ${CHK.tri}일 때, △ + ○ + ○ = ${CHK.total}이면 ○는?`,
            options: [String(CHK.total - CHK.tri), String(chkV), String(chkV + 1)], answer: 1,
            hint: "합에서 세모를 먼저 빼고, 남은 수를 둘로 갈라요.", sayHint: `${CHK.total} 빼기 ${jo(CHK.tri, "은")} ${jo(CHK.total - CHK.tri, "이에요")}. 동그라미 두 개가 그 수예요.`,
            right: `맞았어요! ${CHK.total} − ${CHK.tri} = ${CHK.total - CHK.tri}, 둘로 가르면 ${chkV}.`, sayRight: `맞았어요! 동그라미 두 개가 ${jo(CHK.total - CHK.tri, "이니까")} 동그라미는 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-08/bundle-number-source": (() => {
    const A = { o: 4, t: 7 }, e1 = A.o + A.t, e2 = A.o + A.t * 2;
    const B = { o: 5, s: 7 }, s1 = B.o + B.s * 2, s2 = B.o * 2 + B.s, both = s1 + s2, pair = both / 3;
    const LX = 90, RX = 560, Y = [180, 270, 410, 490];
    const CHK = { pair: 13, total: 21 }, chkV = CHK.total - CHK.pair;
    return {
      title: "두 식에 함께 있는 묶음을 찾아요",
      kicker: "8권 1단원 · 손글씨 개념",
      beats: [
        { say: "식 두 개에 똑같은 도형 묶음이 들어 있으면, 그 묶음을 한 덩어리로 보고 바꿔 넣을 수 있어요. 오늘은 두 가지 방법을 배워요.",
          items: [title("묶음수")] },
        { say: `첫째 식은 동그라미 더하기 세모가 ${jo(e1, "이에요")}. 둘째 식은 동그라미 더하기 세모 더하기 세모가 ${jo(e2, "이에요")}.`,
          items: [T(LX - 72, Y[0] + 12, "①", "gray", 28), ...eqRow(LX, Y[0], ["circle", "triangle"], e1), T(LX - 72, Y[1] + 12, "②", "gray", 28), ...eqRow(LX, Y[1], ["circle", "triangle", "triangle"], e2)] },
        { say: "두 식을 나란히 놓고 똑같이 들어 있는 것을 찾아요. 동그라미 하나와 세모 하나, 이 묶음이 두 식에 모두 있어요.",
          items: [{ kind: "box", x: LX - 34, y: Y[0] - 36, w: 148, h: 72, color: "gold", dash: true }, { kind: "box", x: LX - 34, y: Y[1] - 36, w: 148, h: 72, color: "gold", dash: true }] },
        { say: `첫째 식에서 그 묶음은 ${jo(e1, "이에요")}. 둘째 식의 묶음 자리에 ${jo(e1, "을")} 넣으면, ${e1} 더하기 세모가 ${jo(e2, "예요")}.`,
          items: [T(RX, Y[0] + 12, `○ + △ = ${e1}`, "gold", 30), T(RX, Y[1] - 10, `${e1} + △ = ${e2}`, "red", 30)] },
        { say: `세모는 ${e2} 빼기 ${e1}, ${jo(A.t, "이에요")}. 둘째 식에서 묶음을 빼면 세모 하나만 남는 거예요.`,
          items: [T(RX, Y[1] + 36, `△ = ${e2} − ${e1} = ${A.t}`, "red", 30)] },
        { say: `동그라미는 첫째 식에서 찾아요. ${e1} 빼기 ${jo(A.t, "은")} ${jo(A.o, "예요")}. 둘째 식에 넣어 확인해요. ${A.o} 더하기 ${A.t} 더하기 ${jo(A.t, "은")} ${jo(e2, "이에요")}.`,
          items: [T(RX, Y[1] + 82, `○ = ${e1} − ${A.t} = ${A.o}   (${A.o}+${A.t}+${A.t} = ${e2} ✓)`, "blue", 26)] },
        { say: `다른 방법도 있어요. 저울 두 개에 공과 상자를 올렸어요. 첫째 저울은 공 하나, 상자 둘이 ${s1}그램. 둘째 저울은 공 둘, 상자 하나가 ${s2}그램이에요. 공은 동그라미, 상자는 네모로 써요.`,
          items: [T(LX - 72, Y[2] + 12, "가", "gray", 28), ...eqRow(LX, Y[2], ["circle", "square", "square"], `${s1}g`), T(LX - 72, Y[3] + 12, "나", "gray", 28), ...eqRow(LX, Y[3], ["circle", "circle", "square"], `${s2}g`)] },
        { say: `두 저울에 올린 것을 모두 합쳐요. 동그라미 세 개, 네모 세 개, 무게는 ${s1} 더하기 ${s2}, ${both}그램이에요. 동그라미 하나와 네모 하나 묶음이 세 개 있는 셈이에요.`,
          items: [T(RX, Y[2] - 10, `○○○ □□□ = ${both}g`, "gold", 30), T(RX, Y[2] + 36, `(○ + □) 세 묶음 → ${both} ÷ 3 = ${pair}g`, "gold", 26)] },
        { say: `묶음 하나는 ${pair}그램이에요. 첫째 저울은 묶음 하나와 네모 하나니까, 네모는 ${s1} 빼기 ${pair}, ${B.s}그램. 동그라미는 ${pair} 빼기 ${B.s}, ${B.o}그램이에요.`,
          items: [{ kind: "box", x: LX - 34, y: Y[2] - 36, w: 148, h: 72, color: "gold", dash: true }, T(RX, Y[3] + 12, `□ = ${s1} − ${pair} = ${B.s}g,  ○ = ${B.o}g`, "green", 28)] },
        { say: "정리해요. 두 식에 똑같은 묶음이 있으면 그 묶음의 합을 먼저 구해 빼요. 묶음이 바로 안 보이면 두 식을 모두 더해서 묶음을 만들어요.", mood: "praise",
          items: [T(60, 565, "같은 묶음 → 빼기 · 안 보이면 → 모두 더하기", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 동그라미 더하기 세모가 ${jo(CHK.pair, "이고")}, 동그라미 더하기 세모 더하기 동그라미가 ${jo(CHK.total, "이에요")}. 동그라미는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `○ + △ = ${CHK.pair},  ○ + △ + ○ = ${CHK.total}일 때 ○는?`,
            options: [String(chkV), String(CHK.pair), String(CHK.pair - chkV)], answer: 0,
            hint: "둘째 식에서 ○ + △ 묶음을 찾아 빼요.", sayHint: `둘째 식에도 동그라미와 세모 묶음이 있어요. ${CHK.total}에서 ${jo(CHK.pair, "을")} 빼 봐요.`,
            right: `맞았어요! ${CHK.total} − ${CHK.pair} = ${chkV}.`, sayRight: `맞았어요! 묶음을 빼면 동그라미 하나가 남아요. ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-08/product-matrix-source": (() => {
    // 3 × 3 판, 대각선 세 칸은 색칠(수를 넣지 않음). 줄마다 두 수, 2~9에서 서로 다른 여섯 수
    const G = [[null, 7, 4], [5, null, 3], [9, 2, null]];
    const two = (line) => line.filter((v) => v != null);
    const rowP = G.map((r) => two(r).reduce((a, b) => a * b, 1)), colP = [0, 1, 2].map((c) => two(G.map((r) => r[c])).reduce((a, b) => a * b, 1));
    const X0 = 90, Y0 = 150, S = 100, RX = 500;
    const cell = (r, c, color = "green") => T(X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S + 15, String(G[r][c]), color, 44, "center");
    const shaded = [[0, 0], [1, 1], [2, 2]];
    const ways = (n) => { const out = []; for (let a = 2; a <= 9; a++) for (let b = a + 1; b <= 9; b++) if (a * b === n) out.push(`${a} × ${b}`); return out; };
    const line = (x, y, n) => { const w = ways(n); return T(x, y, `${n} = ${w.join(", ")}`, w.length === 1 ? "blue" : "gray", 24); };
    const CHK = { opts: [24, 35, 18] }, chkIdx = CHK.opts.findIndex((n) => ways(n).length === 1);
    return {
      title: "곱셈 매트릭스 — 짝이 하나뿐인 곱부터",
      kicker: "8권 1단원 · 손글씨 개념",
      beats: [
        { say: "줄 끝의 수가 이번에는 합이 아니라 곱이에요. 줄마다 수 두 개를 넣고, 두 수를 곱한 값이 줄 끝의 수가 되게 해요. 2부터 9까지의 수를 쓰는데, 한 번 쓴 수는 다시 쓰지 않아요.",
          items: [title("곱셈 매트릭스")] },
        { say: "세 줄, 세 칸의 판을 그려요. 색칠한 칸에는 수를 넣지 않아요. 그래서 가로줄도 세로줄도 빈칸이 두 개씩이에요.",
          items: [{ kind: "cells", x: X0, y: Y0, cell: S, cells: shaded, fill: "#e4ddcf" }, { kind: "grid", x: X0, y: Y0, cols: 3, rows: 3, cell: S, color: "ink" }] },
        { say: `가로줄의 곱은 위에서부터 ${rowP[0]}, ${rowP[1]}, ${jo(rowP[2], "이에요")}. 세로줄의 곱은 왼쪽부터 ${colP[0]}, ${colP[1]}, ${jo(colP[2], "이에요")}.`,
          items: [...rowP.map((v, r) => T(X0 + 3 * S + 22, Y0 + (r + 0.5) * S + 12, String(v), "blue", 34)), ...colP.map((v, c) => T(X0 + (c + 0.5) * S, Y0 + 3 * S + 44, String(v), "blue", 34, "center"))] },
        { say: `줄 끝의 곱을 2부터 9까지의 두 수로 갈라 봐요. ${jo(rowP[0], "은")} 4 곱하기 7 하나뿐이에요. ${jo(rowP[1], "도")} 3 곱하기 5 하나뿐. 그런데 ${jo(rowP[2], "은")} 2 곱하기 9도 되고 3 곱하기 6도 돼요.`,
          items: [T(RX, 160, "가로줄", "gray", 24), line(RX, 200, rowP[0]), line(RX, 245, rowP[1]), line(RX, 290, rowP[2])] },
        { say: `세로줄도 갈라요. ${jo(colP[0], "는")} 5 곱하기 9 하나뿐, ${jo(colP[1], "는")} 2 곱하기 7 하나뿐이에요. ${jo(colP[2], "는")} 2 곱하기 6도, 3 곱하기 4도 돼요. 짝이 하나뿐인 줄이 실마리예요.`,
          items: [T(RX + 245, 160, "세로줄", "gray", 24), line(RX + 245, 200, colP[0]), line(RX + 245, 245, colP[1]), line(RX + 245, 290, colP[2])] },
        { say: `첫째 가로줄과 둘째 세로줄이 만나는 칸을 봐요. 첫째 가로줄은 4와 7, 둘째 세로줄은 2와 7. 둘 다에 있는 수는 7이에요. 7을 넣으면 첫째 가로줄의 남은 칸은 4예요.`,
          items: [{ kind: "box", x: X0 + S + 6, y: Y0 + 6, w: S - 12, h: S - 12, color: "red", dash: true }, cell(0, 1, "red"), cell(0, 2), T(RX, 360, "만나는 칸 = 두 짝에 함께 있는 수", "red", 24)] },
        { say: `둘째 가로줄과 첫째 세로줄이 만나는 칸도 같은 방법이에요. 3과 5, 그리고 5와 9. 함께 있는 수는 5. 그러면 둘째 가로줄의 남은 칸은 3이에요.`,
          items: [{ kind: "box", x: X0 + 6, y: Y0 + S + 6, w: S - 12, h: S - 12, color: "red", dash: true }, cell(1, 0, "red"), cell(1, 2)] },
        { say: `셋째 세로줄을 확인해요. 4와 3, 곱하면 ${jo(colP[2], "예요")}. 두 가지 짝 중에서 3 곱하기 4가 맞았어요. 남은 두 칸은 세로줄에서 정해져요. ${colP[0]} 나누기 5는 9, ${colP[1]} 나누기 7은 2.`,
          items: [cell(2, 0), cell(2, 1), T(RX, 415, `4 × 3 = ${colP[2]} ✓`, "green", 26), T(RX, 458, `${colP[0]} ÷ 5 = 9,  ${colP[1]} ÷ 7 = 2`, "green", 26)] },
        { say: `마지막 가로줄은 9 곱하기 2, ${jo(rowP[2], "이에요")}. 쓴 수는 7, 4, 5, 3, 9, 2. 모두 다르고 한 번씩만 썼어요.`,
          items: [T(RX, 501, `9 × 2 = ${rowP[2]} ✓`, "green", 26), T(RX + 200, 501, "쓴 수: 7, 4, 5, 3, 9, 2", "gray", 24)] },
        { say: "정리해요. 줄 끝의 곱을 두 수로 갈라 봐요. 짝이 하나뿐인 줄부터 시작해요. 가로줄과 세로줄이 만나는 칸에는 두 짝에 함께 있는 수가 와요. 쓴 수는 다시 쓰지 않아요.", mood: "praise",
          items: [T(60, 565, "짝이 하나뿐인 곱 → 만나는 칸 → 남은 칸", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${CHK.opts.join(", ")} 중에서 2부터 9까지의 서로 다른 두 수로 가르는 방법이 한 가지뿐인 곱은 무엇일까요?`, mood: "think",
          items: [],
          check: { question: "2~9의 서로 다른 두 수로 가르는 방법이 한 가지뿐인 곱은?",
            options: CHK.opts.map(String), answer: chkIdx,
            hint: "하나씩 두 수로 갈라 봐요. 24는 3 × 8, 4 × 6 …", sayHint: "24는 3 곱하기 8도, 4 곱하기 6도 돼요. 18은 2 곱하기 9도, 3 곱하기 6도 돼요. 남은 하나는요?",
            right: `맞았어요! ${CHK.opts[chkIdx]} = ${ways(CHK.opts[chkIdx])[0]}뿐이에요.`, sayRight: `맞았어요! ${jo(CHK.opts[chkIdx], "는")} 5 곱하기 7 하나뿐이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
