// 손글씨 판서 대본 — 3권(넓이·분수·길이·복면산·마법카드). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수와 그림은 골든벨 3권 문항(온칸·반칸 도형들, 6×20+6·6×28+6+6…, 원 3·4·6·8·9·12조각, 모눈 2×2~5×5 등)과
// 겹치지 않게 골랐다. 겹치면 공개 판서가 비공개 정답을 보여 주게 된다.

import { jo } from "./concept-board-kit.js?v=20261025d";

const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열", 11: "열한", 12: "열두" };
const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
// 신발끈 공식: 꼭짓점 목록(모눈 칸 단위)의 넓이 — 판서의 답을 그림에서 직접 계산해 맞춘다
const polyArea = (pts) => Math.abs(pts.reduce((a, [x1, y1], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return a + x1 * y2 - x2 * y1; }, 0)) / 2;
const sectorPath = (cx, cy, r, a0, a1) => { const p = (a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`; };

// 세로셈 복면산 그림: rows는 더하는 수들(왼쪽→오른쪽 글자 배열), sum은 결과. 오른쪽 끝을 맞춘다.
const SHAPE_OF = { "□": "square", "△": "triangle", "◇": "diamond", "○": "circle", "☆": "star" };
function crypt(right, top, rows, sum, cell = 84) {
  const y = (i) => top + i * cell, x = (k) => right - (k + 0.5) * cell;        // k = 오른쪽에서 몇째 자리(0 = 일의 자리)
  const glyph = (ch, k, i, color = "ink") => SHAPE_OF[ch] ? { kind: "shape", type: SHAPE_OF[ch], cx: x(k), cy: y(i) + cell / 2, r: Math.round(cell * 0.4), color, width: 3 }
    : T(x(k), y(i) + cell / 2 + cell * 0.22, ch, color, Math.round(cell * 0.62), "center");
  const width = Math.max(...rows.map((r) => r.length), sum.length);
  const items = [];
  rows.forEach((r, i) => [...r].reverse().forEach((ch, k) => items.push(glyph(ch, k, i))));
  items.push(T(right - (width + 0.7) * cell, y(rows.length - 1) + cell / 2 + cell * 0.22, "+", "ink", Math.round(cell * 0.62), "center"));
  const lineY = y(rows.length) + 4;
  items.push({ kind: "line", x1: right - (width + 1.1) * cell, y1: lineY, x2: right + 6, y2: lineY, color: "ink", width: 3 });
  [...sum].reverse().forEach((ch, k) => items.push(glyph(ch, k, rows.length + 0.15)));
  return {
    items,
    // 도형 칸 안에 수 쓰기(row = 더하는 수 번호, rows.length = 결과 줄)
    val: (row, k, v, color = "green") => T(x(k), y(row === rows.length ? row + 0.15 : row) + cell / 2 + cell * 0.16, String(v), color, Math.round(cell * 0.42), "center"),
    carry: (k, v = 1) => T(x(k), top - 8, String(v), "red", 32, "center"),
    col: (k) => ({ kind: "box", x: x(k) - cell / 2 + 4, y: top - 4, w: cell - 8, h: (rows.length + 1.15) * cell + 6, color: "gold", dash: true })
  };
}

export const BOARDS_B03 = {
  "book-03/unit-area-shapes": (() => {
    const G = { x: 90, y: 130, cell: 66, cols: 6, rows: 5 };
    const P = [[1, 2], [2, 1], [3, 1], [4, 2], [5, 3], [4, 4], [1, 4]];
    const at = ([c, r]) => [G.x + c * G.cell, G.y + r * G.cell];
    const full = [[2, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]];          // [칸, 줄] 왼쪽 위 모서리
    const halves = [[[1, 2], [2, 1], [2, 2]], [[3, 1], [4, 2], [3, 2]], [[4, 2], [5, 3], [4, 3]], [[4, 3], [5, 3], [4, 4]]];
    const area = polyArea(P), nFull = full.length, nHalf = halves.length;
    const tri = (pts, fill) => ({ kind: "path", d: `M ${pts.map((p) => at(p).join(" ")).join(" L ")} Z`, stroke: "red", width: 2.5, fill, quick: true });
    const center = (pts) => { const xs = pts.map((p) => at(p)[0]), ys = pts.map((p) => at(p)[1]); return [(xs[0] + xs[1] + xs[2]) / 3, (ys[0] + ys[1] + ys[2]) / 3]; };
    const RX = 540;
    const CHK = { full: 5, half: 6 }, chkA = CHK.full + CHK.half / 2;
    return {
      title: "모눈 한 칸으로 넓이를 재어요",
      kicker: "3권 1단원 · 손글씨 개념",
      beats: [
        { say: "넓이는 얼마나 넓은지를 나타내는 수예요. 모눈 한 칸을 1로 정하고, 도형 안에 몇 칸이 들어가는지 세어 넓이를 재요.",
          items: [title("모눈 한 칸으로 넓이 재기")] },
        { say: "모눈을 그려요. 작은 네모 한 칸의 넓이를 1로 정해요.",
          items: [{ kind: "grid", x: G.x, y: G.y, cols: G.cols, rows: G.rows, cell: G.cell, color: "gray" }, { kind: "fill", x: G.x + 4, y: G.y + 4, w: G.cell - 8, h: G.cell - 8, fill: "#e9e4d6" }, T(G.x + G.cell / 2, G.y + G.cell / 2 + 11, "1", "gray", 30, "center")] },
        { say: "모눈 위에 도형을 그려요. 곧은 변도 있고, 비스듬한 변도 있어요.",
          items: [{ kind: "path", d: `M ${P.map((p) => at(p).join(" ")).join(" L ")} Z`, stroke: "blue", width: 4.5 }] },
        { say: "먼저 한 칸이 통째로 들어간 온칸을 세어요. 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱. 온칸은 일곱 개예요.",
          items: [...full.map(([c, r], i) => T(G.x + (c + 0.5) * G.cell, G.y + (r + 0.5) * G.cell + 11, String(i + 1), "blue", 30, "center")), T(RX, 170, `온칸 ${nFull}개`, "blue", 32)] },
        { say: "비스듬한 변 옆에는 칸이 반만 들어간 반칸이 있어요. 네모 한 칸을 대각선으로 자른 세모예요. 빨간색으로 표시해요. 모두 네 개예요.",
          items: [...halves.map((h) => tri(h, "#f6dcd3")), T(RX, 225, `반칸 ${nHalf}개`, "red", 32)] },
        { say: "반칸 두 개를 모으면 온칸 하나가 돼요. 세모 두 개를 맞대면 네모 한 칸이 되니까요.",
          items: [{ kind: "arrow", x1: center(halves[0])[0], y1: center(halves[0])[1] - 10, x2: center(halves[1])[0], y2: center(halves[1])[1] - 10, bend: 40, color: "gold", width: 3 }, { kind: "arrow", x1: center(halves[2])[0] + 8, y1: center(halves[2])[1], x2: center(halves[3])[0] + 8, y2: center(halves[3])[1], bend: 0, color: "gold", width: 3 }, T(RX, 280, "반칸 2개 = 온칸 1개", "gold", 30)] },
        { say: `반칸이 네 개니까, 둘씩 묶으면 온칸 두 개예요.`,
          items: [T(RX, 335, `반칸 ${nHalf}개 → 온칸 ${nHalf / 2}개`, "red", 30)] },
        { say: `모두 더해요. 온칸 일곱 개, 반칸으로 만든 온칸 두 개. ${nFull} 더하기 ${jo(nHalf / 2, "는")} ${area}. 넓이는 ${jo(area, "예요")}.`,
          items: [T(RX, 400, `넓이 = ${nFull} + ${nHalf / 2} = ${area}`, "green", 36)] },
        { say: `다른 방법으로 확인해 봐요. 도형을 감싸는 큰 네모는 네 칸씩 세 줄, 열두 칸이에요. 도형 바깥에 남는 부분은 온칸 하나와 반칸 넷, 모두 셋. 12 빼기 3도 ${jo(area, "예요")}.`,
          items: [{ kind: "box", x: at([1, 1])[0], y: at([1, 1])[1], w: 4 * G.cell, h: 3 * G.cell, color: "gold", dash: true }, T(RX, 460, `12 − 3 = ${area} ✓`, "green", 30)] },
        { say: "정리해요. 한 칸의 넓이를 1로 정해요. 온칸을 먼저 세고, 반칸은 두 개씩 묶어 온칸 하나로 바꿔요. 모두 더하면 넓이예요.", mood: "praise",
          items: [T(RX, 540, "온칸 + (반칸 ÷ 2)", "gold", 32)] },
        { say: `한 문제 풀어 봐요. 온칸 ${KO[CHK.full]} 개와 반칸 ${KO[CHK.half]} 개로 된 도형의 넓이는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `온칸 ${CHK.full}개와 반칸 ${CHK.half}개로 된 도형의 넓이는?`,
            options: [String(CHK.full + CHK.half), String(chkA), String(CHK.half)], answer: 1,
            hint: "반칸 두 개가 온칸 하나예요.", sayHint: `반칸 ${KO[CHK.half]} 개를 둘씩 묶으면 온칸 몇 개일까요? 거기에 온칸 ${KO[CHK.full]} 개를 더해요.`,
            right: `맞았어요! ${CHK.full} + ${CHK.half / 2} = ${chkA}.`, sayRight: `맞았어요! 반칸 여섯 개는 온칸 세 개, ${CHK.full} 더하기 ${jo(CHK.half / 2, "은")} ${jo(chkA, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/six-multiple-equations": (() => {
    const A = { n: 15, add: 12 }, aAns = A.n + A.add / 6;
    const B = { n: 30, sub: 18 }, bAns = B.n - B.sub / 6;
    const Cq = { a: 12, n: 5 }, cAns = (Cq.a / 6) * Cq.n;
    const bundle = (x, y, color, label = "6") => [{ kind: "box", x, y, w: 40, h: 46, color }, T(x + 20, y + 33, label, color, 26, "center")];
    const CHK = { n: 12, add: 18 }, chk = CHK.n + CHK.add / 6;
    return {
      title: "6의 배수로 식을 바꿔요",
      kicker: "3권 1단원 · 손글씨 개념",
      beats: [
        { say: "6 곱하기 몇은 6이 몇 묶음인지를 나타내요. 식에 있는 수를 모두 6의 묶음 수로 바꾸면, 큰 수도 쉽게 계산할 수 있어요.",
          items: [title("6의 묶음으로 바꿔요")] },
        { say: `이 식을 봐요. 6 곱하기 ${A.n} 더하기 ${jo(A.add, "는")} 6 곱하기 몇일까요?`,
          items: [T(70, 175, `6 × ${A.n} + ${A.add} = 6 × □`, "ink", 40)] },
        { say: `6 곱하기 ${jo(A.n, "는")} 6이 ${A.n}묶음이에요. 묶음을 일일이 그리지 않고 ${A.n}묶음이라고 써 둬요.`,
          items: [T(70, 240, `6 × ${A.n} → ${A.n}묶음`, "blue", 30)] },
        { say: `${jo(A.add, "는")} 6이 몇 묶음일까요? 6, 12. 두 묶음이에요.`,
          items: [...bundle(70, 268, "green"), ...bundle(118, 268, "green"), T(180, 300, `${A.add} → ${A.add / 6}묶음`, "green", 30)] },
        { say: `모두 ${A.n} 더하기 2, ${aAns}묶음. 그래서 네모는 ${jo(aAns, "이에요")}.`,
          items: [T(70, 370, `${A.n} + ${A.add / 6} = ${aAns}  →  6 × ${aAns}`, "green", 32)] },
        { say: `빼는 식도 똑같아요. 6 곱하기 ${B.n} 빼기 ${jo(B.sub, "은")}, ${B.n}묶음에서 ${B.sub}이 몇 묶음인지 빼요. ${jo(B.sub, "은")} 6, 12, 18, 세 묶음. ${B.n} 빼기 3은 ${jo(bAns, "이에요")}.`,
          items: [T(560, 175, `6 × ${B.n} − ${B.sub}`, "ink", 34), T(560, 225, `${B.n} − ${B.sub / 6} = ${bAns}  →  6 × ${bAns}`, "green", 30)] },
        { say: `묶음의 크기가 다른 식도 바꿀 수 있어요. 12 곱하기 ${jo(Cq.n, "는")} 12짜리가 ${KO[Cq.n]} 묶음이에요. 12는 6짜리 두 묶음이니까, 12짜리 ${KO[Cq.n]} 묶음은 6짜리 ${KO[cAns]} 묶음.`,
          items: [T(560, 300, `12 × ${Cq.n} = 6 × □`, "ink", 34), ...bundle(560, 320, "blue", "12"), T(612, 352, "= 6 + 6", "blue", 26)] },
        { say: `그래서 12 곱하기 ${jo(Cq.n, "는")} 6 곱하기 ${jo(cAns, "이에요")}. 묶음이 반으로 작아지면 묶음 수는 두 배가 돼요.`,
          items: [T(560, 420, `12 × ${Cq.n} = 6 × ${cAns}`, "green", 32)] },
        { say: `계산해서 확인해요. 6 곱하기 ${jo(aAns, "은")} ${6 * aAns}. 처음 식 6 곱하기 ${jo(A.n, "는")} ${6 * A.n}, 더하기 ${jo(A.add, "는")} ${6 * A.n + A.add}. 같아요.`,
          items: [T(70, 440, `6 × ${aAns} = ${6 * aAns},  ${6 * A.n} + ${A.add} = ${6 * A.n + A.add} ✓`, "green", 28)] },
        { say: "정리해요. 식에 있는 수를 모두 6이 몇 묶음인지로 바꿔요. 묶음 수끼리 더하거나 빼요. 마지막에 양쪽을 계산해 같은지 확인해요.", mood: "praise",
          items: [T(70, 530, "모두 6의 묶음 수로!", "gold", 34)] },
        { say: `한 문제 풀어 봐요. 6 곱하기 ${CHK.n} 더하기 ${jo(CHK.add, "은")} 6 곱하기 몇일까요?`, mood: "think",
          items: [],
          check: { question: `6 × ${CHK.n} + ${CHK.add} = 6 × □에서 □는?`,
            options: [String(CHK.n + CHK.add), String(chk), String(chk - 1)], answer: 1,
            hint: `${CHK.add}이 6의 몇 묶음인지 먼저 세어요.`, sayHint: `${jo(CHK.add, "은")} 6, 12, 18. 몇 묶음일까요? 그 수를 ${CHK.n}에 더해요.`,
            right: `맞았어요! ${CHK.n} + ${CHK.add / 6} = ${chk}.`, sayRight: `맞았어요! ${jo(CHK.add, "은")} 세 묶음, ${CHK.n} 더하기 3은 ${jo(chk, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/fraction-shading": (() => {
    const C = { cx: 200, cy: 270, r: 110, n: 5, shade: [0, 2, 3] };
    const G = { x: 470, y: 160, cols: 4, rows: 3, cell: 62, shade: [[0, 0], [0, 2], [1, 1], [1, 3], [2, 0], [2, 1], [2, 3]] };
    const nG = G.cols * G.rows, sG = G.shade.length;
    const CHK = { n: 7, k: 4 };
    return {
      title: "색칠한 부분을 분수로 나타내요",
      kicker: "3권 1단원 · 손글씨 개념",
      beats: [
        { say: "색칠한 부분이 전체의 얼마인지 분수로 나타내요. 전체 조각 수와 색칠한 조각 수를 따로 세는 게 핵심이에요.",
          items: [title("색칠한 부분을 분수로")] },
        { say: "동그라미 하나를 전체로 봐요.",
          items: [{ kind: "shape", type: "circle", cx: C.cx, cy: C.cy, r: C.r, color: "ink", width: 3.5 }] },
        { say: `가운데에서 선을 그어 같은 크기 ${KO[C.n]} 조각으로 나눠요. 조각마다 크기가 같아요.`,
          items: Array.from({ length: C.n }, (_, i) => { const a = i * 360 / C.n * Math.PI / 180; return { kind: "line", x1: C.cx, y1: C.cy, x2: C.cx + C.r * Math.sin(a), y2: C.cy - C.r * Math.cos(a), color: "ink", width: 2.5 }; }) },
        { say: `그중 ${KO[C.shade.length]} 조각을 색칠해요. 붙어 있지 않아도 괜찮아요. 몇 조각인지만 세요.`,
          items: C.shade.map((i) => ({ kind: "path", d: sectorPath(C.cx, C.cy, C.r - 3, i * 360 / C.n + 2, (i + 1) * 360 / C.n - 2), stroke: "blue", width: 1, fill: "#cfe0f5", quick: true })) },
        { say: `먼저 분모예요. 전체가 같은 크기 몇 조각인지 세요. 하나, 둘, 셋, 넷, 다섯. 아래에 ${jo(C.n, "를")} 써요.`,
          items: [T(C.cx - 20, C.cy + C.r + 92, String(C.n), "blue", 34, "center"), T(C.cx - 20, C.cy + C.r + 62, "─", "ink", 30, "center"), T(C.cx + 30, C.cy + C.r + 92, "← 전체", "blue", 22)] },
        { say: `다음은 분자예요. 색칠한 조각을 세요. 하나, 둘, 셋. 위에 ${jo(C.shade.length, "을")} 써요. ${C.n}분의 ${jo(C.shade.length, "이에요")}.`,
          items: [T(C.cx - 20, C.cy + C.r + 40, String(C.shade.length), "green", 34, "center"), T(C.cx + 30, C.cy + C.r + 40, "← 색칠", "green", 22)] },
        { say: `이번엔 네모 칸이에요. 가로 ${KO[G.cols]} 칸, 세로 ${KO[G.rows]} 줄, 같은 크기 칸이 열두 개예요.`,
          items: [{ kind: "grid", x: G.x, y: G.y, cols: G.cols, rows: G.rows, cell: G.cell, color: "ink" }] },
        { say: `여기저기 흩어진 칸을 색칠해요. 흩어져 있어도 한 칸씩 세면 돼요. 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱.`,
          items: G.shade.map(([r, c]) => ({ kind: "fill", x: G.x + c * G.cell + 4, y: G.y + r * G.cell + 4, w: G.cell - 8, h: G.cell - 8, fill: "#cfe0f5" })) },
        { say: `전체 ${nG}칸 가운데 색칠한 것은 ${sG}칸. ${nG}분의 ${jo(sG, "이에요")}.`,
          items: [T(G.x, G.y + G.rows * G.cell + 50, `${sG}/${nG}  (전체 ${nG}, 색칠 ${sG})`, "blue", 32)] },
        { say: `색칠하지 않은 부분도 분수로 말할 수 있어요. ${nG}칸 가운데 ${nG - sG}칸, ${nG}분의 ${nG - sG}. 색칠한 것과 안 한 것을 더하면 ${nG}분의 ${nG}, 전체 하나예요.`,
          items: [T(G.x, G.y + G.rows * G.cell + 100, `안 칠한 부분 ${nG - sG}/${nG},  ${sG}/${nG} + ${nG - sG}/${nG} = 1`, "gray", 26)] },
        { say: "정리해요. 먼저 모든 조각의 크기가 같은지 봐요. 전체 조각 수를 아래에, 색칠한 조각 수를 위에 써요. 흩어져 있어도 하나씩 세면 돼요.", mood: "praise",
          items: [T(G.x, 560, "아래 = 전체, 위 = 색칠", "gold", 32)] },
        { say: `한 문제 풀어 봐요. 같은 크기 ${KO[CHK.n]} 조각 가운데 ${KO[CHK.k]} 조각을 색칠했어요. 분수로 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `같은 크기 ${CHK.n}조각 중 ${CHK.k}조각을 색칠했어요. 분수로 나타내면?`,
            options: [`${CHK.k}/${CHK.n}`, `${CHK.n - CHK.k}/${CHK.n}`, `${CHK.n}/${CHK.k}`], answer: 0,
            hint: "아래에는 전체 조각 수, 위에는 색칠한 조각 수예요.", sayHint: `전체가 ${KO[CHK.n]} 조각이니 아래에 ${CHK.n}. 위에는 무엇을 쓸까요?`,
            right: `맞았어요! ${CHK.k}/${CHK.n}, ${CHK.n}분의 ${jo(CHK.k, "예요")}.`, sayRight: `맞았어요! 전체 ${KO[CHK.n]} 조각 가운데 ${KO[CHK.k]} 조각, ${CHK.n}분의 ${jo(CHK.k, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/equal-partition-fractions": (() => {
    const S = { x: 110, y: 150, s: 240 }, c = [S.x + S.s / 2, S.y + S.s / 2];
    const tri = (pts, fill) => ({ kind: "path", d: `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`, stroke: "blue", width: 1, fill, quick: true });
    const TL = [S.x, S.y], TR = [S.x + S.s, S.y], BR = [S.x + S.s, S.y + S.s], BL = [S.x, S.y + S.s], TM = [c[0], S.y], LM = [S.x, c[1]];
    const R2 = { x: 560, y: 380, w: 240, h: 90 };
    return {
      title: "도형을 똑같은 조각으로 나누어요",
      kicker: "3권 1단원 · 손글씨 개념",
      beats: [
        { say: "도형을 똑같은 조각으로 나누려면, 조각의 수만이 아니라 모양과 크기가 모두 같아야 해요. 가운데 점과 대칭을 이용하면 쉽게 나눌 수 있어요.",
          items: [title("똑같은 조각으로 나누기")] },
        { say: "정사각형 하나를 그려요. 이 도형 전체가 1이에요.",
          items: [{ kind: "box", x: S.x, y: S.y, w: S.s, h: S.s, color: "ink" }] },
        { say: "먼저 가운데 점을 찾아요. 마주 보는 꼭짓점을 이은 대각선 두 개가 만나는 곳이에요. 대각선 하나를 그어요.",
          items: [{ kind: "line", x1: TL[0], y1: TL[1], x2: BR[0], y2: BR[1], color: "red", width: 3 }] },
        { say: "다른 대각선도 그어요. 두 선이 만나는 곳이 가운데 점이에요. 정사각형이 세모 네 조각으로 나뉘었어요.",
          items: [{ kind: "line", x1: TR[0], y1: TR[1], x2: BL[0], y2: BL[1], color: "red", width: 3 }, { kind: "shape", type: "circle", cx: c[0], cy: c[1], r: 6, color: "red", fill: "red", quick: true }] },
        { say: "네 조각이 정말 똑같을까요? 가운데 점을 중심으로 정사각형을 반의 반 바퀴 돌리면, 한 조각이 옆 조각 자리에 꼭 맞게 포개져요. 네 조각 모두 모양과 크기가 같아요.",
          items: [{ kind: "ring", cx: c[0], cy: c[1], r: 46, color: "gold" }, T(S.x + S.s + 30, S.y + 60, "가운데를 중심으로 돌리면 포개져요", "gold", 24)] },
        { say: "한 조각을 색칠해요. 똑같은 네 조각 가운데 하나, 4분의 1이에요.",
          items: [tri([TL, TR, c], "#cfe0f5"), T(S.x + S.s + 30, S.y + 110, "한 조각 = 1/4", "blue", 30)] },
        { say: "이번엔 가로와 세로의 가운데 선도 그어요. 변의 한가운데끼리 이어요. 네 조각이 다시 반씩 나뉘어 여덟 조각이 돼요.",
          items: [{ kind: "line", x1: TM[0], y1: TM[1], x2: TM[0], y2: S.y + S.s, color: "green", width: 3 }, { kind: "line", x1: LM[0], y1: LM[1], x2: S.x + S.s, y2: LM[1], color: "green", width: 3 }] },
        { say: "여덟 조각도 모두 같아요. 가운데 선을 거울처럼 접으면 반쪽끼리 포개지고, 돌리면 다른 조각과도 포개져요. 작은 한 조각은 8분의 1이에요.",
          items: [tri([TL, TM, c], "#e9f0e7"), T(S.x + S.s + 30, S.y + 160, "작은 한 조각 = 1/8", "green", 30)] },
        { say: "4분의 1 조각이 8분의 1 조각 두 개로 나뉘었어요. 조각 수가 두 배가 되면 한 조각은 반이 돼요.",
          items: [T(S.x + S.s + 30, S.y + 210, "1/4 = 1/8 두 개", "gold", 28)] },
        { say: "조심할 것이 있어요. 이 네모는 세 조각이지만, 가운데 조각이 더 커요. 크기가 다르니 한 조각을 3분의 1이라고 할 수 없어요.",
          items: [{ kind: "box", x: R2.x, y: R2.y, w: R2.w, h: R2.h, color: "gray" }, { kind: "line", x1: R2.x + 50, y1: R2.y, x2: R2.x + 50, y2: R2.y + R2.h, color: "gray", width: 2.5 }, { kind: "line", x1: R2.x + 190, y1: R2.y, x2: R2.x + 190, y2: R2.y + R2.h, color: "gray", width: 2.5 }, { kind: "x", cx: R2.x + R2.w + 34, cy: R2.y + R2.h / 2, r: 16, color: "red" }] },
        { say: "같은 크기 세 조각으로 나누려면, 길이를 똑같이 셋으로 나눈 곳에 선을 그어야 해요.",
          items: [{ kind: "box", x: R2.x, y: R2.y + 110, w: R2.w, h: R2.h, color: "ink" }, { kind: "line", x1: R2.x + R2.w / 3, y1: R2.y + 110, x2: R2.x + R2.w / 3, y2: R2.y + 110 + R2.h, color: "green", width: 2.5 }, { kind: "line", x1: R2.x + 2 * R2.w / 3, y1: R2.y + 110, x2: R2.x + 2 * R2.w / 3, y2: R2.y + 110 + R2.h, color: "green", width: 2.5 }, T(R2.x + R2.w + 20, R2.y + 170, "1/3 ✓", "green", 28)] },
        { say: "정리해요. 가운데 점과 대칭을 찾아 선을 규칙 있게 그어요. 다 나눈 뒤에는 돌리거나 접어서 모든 조각이 포개지는지 확인해요. 같은 크기일 때만 분수로 말해요.", mood: "praise",
          items: [T(70, 470, "가운데 점 → 규칙 있게 → 포개지나 확인!", "gold", 28)] },
        { say: "한 문제 풀어 봐요. 정사각형을 대각선 두 개와 가로, 세로 가운데 선으로 나눴어요. 한 조각은 전체의 얼마일까요?", mood: "think",
          items: [],
          check: { question: "정사각형을 대각선 2개와 가로·세로 가운데 선으로 나눴어요. 한 조각은 전체의 얼마일까요?",
            options: ["1/4", "1/8", "8/1"], answer: 1,
            hint: "대각선 두 개로 네 조각, 가운데 선으로 각각 반씩 나뉘어요.", sayHint: "대각선 두 개만 그으면 네 조각이에요. 가운데 선 두 개를 더 그으면 조각이 몇 개가 될까요?",
            right: "맞았어요! 여덟 조각 중 하나, 1/8이에요.", sayRight: "맞았어요! 똑같은 여덟 조각 가운데 하나, 8분의 1이에요. 이제 게임으로 가요." } }
      ]
    };
  })()
  ,"book-03/tape-length-midpoints": (() => {
    const G = { x: 90, y: 140, cell: 56, cols: 5, rows: 3 };
    const PATH = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [3, 2], [4, 2]];          // [칸, 줄] 테이프가 지나간 칸
    const L = PATH.length;
    const NL = { x0: 520, x1: 940, y: 300, a: 6, b: 22 }, mid = (NL.a + NL.b) / 2, X = (v) => NL.x0 + (v - NL.a) / (NL.b - NL.a) * (NL.x1 - NL.x0);
    const CHK = [11, 27], chkM = (CHK[0] + CHK[1]) / 2;
    return {
      title: "테이프 길이와 한가운데 수를 찾아요",
      kicker: "3권 2단원 · 손글씨 개념",
      beats: [
        { say: "꺾여 있는 테이프의 길이를 재는 법과, 두 수의 한가운데 수를 찾는 법을 배워요.",
          items: [title("테이프 길이와 한가운데 수")] },
        { say: "모눈 한 칸의 길이는 1센티미터예요. 모눈을 그려요.",
          items: [{ kind: "grid", x: G.x, y: G.y, cols: G.cols, rows: G.rows, cell: G.cell, color: "gray" }, T(G.x, G.y + G.rows * G.cell + 34, "한 칸 = 1cm", "gray", 24)] },
        { say: "색테이프가 모눈을 따라 두 번 꺾여 있어요. 테이프가 지나간 칸을 색칠해요.",
          items: PATH.map(([c, r]) => ({ kind: "fill", x: G.x + c * G.cell + 4, y: G.y + r * G.cell + 4, w: G.cell - 8, h: G.cell - 8, fill: "#cfe0f5" })) },
        { say: `꺾인 곳에서 헷갈리지 않게, 한쪽 끝부터 한 칸씩 세요. ${Array.from({ length: L }, (_, i) => i + 1).join(", ")}. ${KO[L]} 칸이에요.`,
          items: PATH.map(([c, r], i) => T(G.x + (c + 0.5) * G.cell, G.y + (r + 0.5) * G.cell + 10, String(i + 1), "blue", 28, "center")) },
        { say: `테이프를 곧게 펴도 칸 수는 그대로예요. 꺾여 있어도 지나간 칸은 ${KO[L]} 칸. 한 칸이 1센티미터니까 ${L}센티미터예요.`,
          items: [{ kind: "cells", x: G.x, y: G.y + G.rows * G.cell + 60, cell: 34, cells: Array.from({ length: L }, (_, i) => [0, i]), fill: "blue" }, T(G.x + L * 34 + 16, G.y + G.rows * G.cell + 86, `= ${L}cm`, "blue", 30)] },
        { say: `이번엔 한가운데 수예요. 수직선에 ${jo(NL.a, "과")} ${jo(NL.b, "를")} 써요. 두 수에서 똑같이 떨어진 수가 한가운데 수예요.`,
          items: [{ kind: "line", x1: NL.x0 - 20, y1: NL.y, x2: NL.x1 + 20, y2: NL.y, color: "ink", width: 3 }, ...[NL.a, NL.b].flatMap((v) => [{ kind: "line", x1: X(v), y1: NL.y - 12, x2: X(v), y2: NL.y + 12, color: "ink", width: 3 }, T(X(v), NL.y + 46, String(v), "blue", 30, "center")])] },
        { say: `먼저 두 수 사이의 거리를 구해요. ${NL.b} 빼기 ${jo(NL.a, "은")} ${jo(NL.b - NL.a, "이에요")}.`,
          items: [{ kind: "arrow", x1: X(NL.a), y1: NL.y - 40, x2: X(NL.b), y2: NL.y - 40, color: "gray", width: 2.5 }, T((X(NL.a) + X(NL.b)) / 2, NL.y - 54, `거리 ${NL.b - NL.a}`, "gray", 24, "center")] },
        { say: `한가운데는 거리의 반만큼 간 곳이에요. ${NL.b - NL.a}의 반은 ${(NL.b - NL.a) / 2}. ${NL.a}에서 ${(NL.b - NL.a) / 2}만큼 가면 ${jo(mid, "예요")}.`,
          items: [{ kind: "line", x1: X(mid), y1: NL.y - 16, x2: X(mid), y2: NL.y + 16, color: "green", width: 4 }, T(X(mid), NL.y + 46, String(mid), "green", 32, "center")] },
        { say: `더 빠른 방법도 있어요. 두 수를 더해서 반으로 나눠요. ${NL.a} 더하기 ${jo(NL.b, "는")} ${NL.a + NL.b}, 그 반은 ${jo(mid, "예요")}.`,
          items: [T(NL.x0, 420, `(${NL.a} + ${NL.b}) ÷ 2 = ${NL.a + NL.b} ÷ 2 = ${mid}`, "blue", 30)] },
        { say: `확인해요. ${mid} 빼기 ${jo(NL.a, "은")} ${mid - NL.a}, ${NL.b} 빼기 ${jo(mid, "는")} ${NL.b - mid}. 양쪽으로 똑같이 ${(NL.b - NL.a) / 2}씩 떨어져 있어요.`,
          items: [T(NL.x0, 470, `${mid} − ${NL.a} = ${mid - NL.a},  ${NL.b} − ${mid} = ${NL.b - mid} ✓`, "green", 28)] },
        { say: "정리해요. 꺾인 테이프는 한쪽 끝부터 칸을 빠짐없이 세어요. 한가운데 수는 두 수를 더해 반으로 나누고, 양쪽 거리가 같은지 확인해요.", mood: "praise",
          items: [T(NL.x0, 540, "한가운데 = (두 수의 합) ÷ 2", "gold", 30)] },
        { say: `한 문제 풀어 봐요. ${jo(CHK[0], "과")} ${CHK[1]}의 한가운데 수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${jo(CHK[0], "과")} ${CHK[1]}의 한가운데 수는?`,
            options: [String(chkM - 3), String(chkM), String(CHK[0] + CHK[1])], answer: 1,
            hint: "두 수를 더해서 반으로 나눠요.", sayHint: `${CHK[0]} 더하기 ${jo(CHK[1], "은")} ${jo(CHK[0] + CHK[1], "이에요")}. 그 반은 얼마일까요?`,
            right: `맞았어요! (${CHK[0]} + ${CHK[1]}) ÷ 2 = ${chkM}.`, sayRight: `맞았어요! ${CHK[0] + CHK[1]}의 반, ${jo(chkM, "예요")}. 양쪽으로 ${chkM - CHK[0]}씩 떨어져 있어요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/overlapping-distance": (() => {
    const AB = 8, BC = 7, CD = 11, AD = AB + BC + CD, AC = AB + BC, BD = BC + CD;
    const U = 18, X0 = 130, Y = 330, pos = { A: X0, B: X0 + AB * U, C: X0 + (AB + BC) * U, D: X0 + AD * U };
    const span = (a, b, y, label, color) => [{ kind: "line", x1: pos[a], y1: y, x2: pos[b], y2: y, color, width: 3 }, { kind: "line", x1: pos[a], y1: y - 8, x2: pos[a], y2: y + 8, color, width: 3 }, { kind: "line", x1: pos[b], y1: y - 8, x2: pos[b], y2: y + 8, color, width: 3 }, T((pos[a] + pos[b]) / 2, y - 12, label, color, 24, "center")];
    const RX = 640;
    const CHK = { AC: 14, BD: 16, BC: 5 }, chkAD = CHK.AC + CHK.BD - CHK.BC;
    return {
      title: "겹친 거리의 합과 차를 찾아요",
      kicker: "3권 2단원 · 손글씨 개념",
      beats: [
        { say: "한 줄 위에 점 네 개가 있고, 긴 거리 두 개가 가운데에서 겹쳐 있을 때, 겹친 부분의 길이를 찾는 법을 배워요.",
          items: [title("겹친 거리 찾기")] },
        { say: "한 줄 위에 A, B, C, D를 차례로 찍어요.",
          items: [{ kind: "line", x1: pos.A - 30, y1: Y, x2: pos.D + 30, y2: Y, color: "ink", width: 3 }, ...["A", "B", "C", "D"].flatMap((k) => [{ kind: "shape", type: "circle", cx: pos[k], cy: Y, r: 7, color: "ink", fill: "ink", quick: true }, T(pos[k], Y + 40, k, "ink", 30, "center")])] },
        { say: `A부터 D까지 전체 거리는 ${AD}센티미터예요.`,
          items: span("A", "D", Y - 150, `AD = ${AD}`, "gray") },
        { say: `A부터 C까지는 ${AC}센티미터.`,
          items: span("A", "C", Y - 100, `AC = ${AC}`, "blue") },
        { say: `B부터 D까지는 ${BD}센티미터. 이 거리는 줄 아래에 표시해요.`,
          items: span("B", "D", Y + 90, `BD = ${BD}`, "green") },
        { say: "AC와 BD를 같이 보면, 둘 다 B와 C 사이를 지나요. 겹친 부분이 BC예요.",
          items: [{ kind: "fill", x: pos.B, y: Y - 6, w: pos.C - pos.B, h: 12, fill: "#f6dcd3" }, T((pos.B + pos.C) / 2, Y - 18, "겹친 BC", "red", 24, "center")] },
        { say: `AC와 BD를 더하면, 겹친 BC를 두 번 센 셈이에요. ${AC} 더하기 ${jo(BD, "은")} ${AC + BD}. 전체 AD ${AD}보다 BC만큼 더 커요.`,
          items: [T(RX, 160, `AC + BD = ${AC} + ${BD} = ${AC + BD}`, "blue", 28)] },
        { say: `그래서 BC는 ${AC + BD} 빼기 ${AD}, ${jo(BC, "이에요")}.`,
          items: [T(RX, 210, `BC = ${AC + BD} − ${AD} = ${BC}`, "red", 30)] },
        { say: `나머지도 구해요. AB는 AC에서 BC를 빼서 ${AC} 빼기 ${jo(BC, "은")} ${AB}. CD는 BD에서 BC를 빼서 ${BD} 빼기 ${jo(BC, "은")} ${CD}.`,
          items: [T(RX, 260, `AB = ${AC} − ${BC} = ${AB}`, "blue", 28), T(RX, 300, `CD = ${BD} − ${BC} = ${CD}`, "green", 28)] },
        { say: `세 조각을 다 더해 확인해요. ${AB} 더하기 ${BC} 더하기 ${jo(CD, "은")} ${AB + BC + CD}. 전체 AD와 같아요.`,
          items: [T(RX, 450, `${AB} + ${BC} + ${CD} = ${AD} ✓`, "green", 30)] },
        { say: `거꾸로 BC를 알 때는 전체를 구할 수 있어요. AC 더하기 BD에서 두 번 센 BC를 한 번 빼면 AD예요.`,
          items: [T(RX, 500, "AD = AC + BD − BC", "gold", 28)] },
        { say: "정리해요. 점의 순서대로 줄을 그리고, 두 긴 거리가 함께 가진 구간을 찾아요. 두 거리를 더하면 겹친 구간을 두 번 센 거예요. 마지막에 조각을 다 더해 전체와 같은지 확인해요.", mood: "praise",
          items: [T(RX, 555, "겹친 곳은 두 번 세어져요!", "gold", 28)] },
        { say: `한 문제 풀어 봐요. AC는 ${CHK.AC}, BD는 ${CHK.BD}, 겹친 BC는 ${jo(CHK.BC, "예요")}. 전체 AD는 몇 센티미터일까요?`, mood: "think",
          items: [],
          check: { question: `A-B-C-D가 한 줄에 있어요. AC = ${CHK.AC}cm, BD = ${CHK.BD}cm, BC = ${CHK.BC}cm일 때 AD는?`,
            options: [`${CHK.AC + CHK.BD}cm`, `${chkAD}cm`, `${chkAD + 2 * CHK.BC}cm`], answer: 1,
            hint: "AC와 BD를 더하면 BC를 두 번 센 거예요.", sayHint: `${CHK.AC} 더하기 ${jo(CHK.BD, "은")} ${jo(CHK.AC + CHK.BD, "이에요")}. 두 번 센 BC를 한 번 빼면요?`,
            right: `맞았어요! ${CHK.AC} + ${CHK.BD} − ${CHK.BC} = ${chkAD}cm.`, sayRight: `맞았어요! ${CHK.AC + CHK.BD} 빼기 ${jo(CHK.BC, "는")} ${chkAD}센티미터예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/multiple-comparison": (() => {
    const A = 3, B = 18, times = B / A, C = 24, X0 = 160;
    const NL = { a: 10, b: 34, n: 4 }, gap = (NL.b - NL.a) / NL.n, NX = (v) => 140 + (v - NL.a) / (NL.b - NL.a) * 520, NY = 470;
    const CHK = [24, 4], chk = CHK[0] / CHK[1];
    return {
      title: "몇 배와 같은 간격을 찾아요",
      kicker: "3권 2단원 · 손글씨 개념",
      beats: [
        { say: "한 양이 다른 양의 몇 배인지 찾는 법과, 두 수 사이를 같은 간격으로 나누는 법을 배워요. 둘 다 기준이 몇 번 들어가는지 세는 거예요.",
          items: [title("몇 배와 같은 간격")] },
        { say: `막대 A는 ${KO[A]} 칸이에요. A를 기준으로 정해요.`,
          items: [T(80, 170, "A", "blue", 30), { kind: "cells", x: X0, y: 148, cell: C, cells: Array.from({ length: A }, (_, i) => [0, i]), fill: "blue" }] },
        { say: `막대 B는 ${B}칸이에요. B는 A의 몇 배일까요?`,
          items: [T(80, 240, "B", "green", 30), { kind: "cells", x: X0, y: 218, cell: C, cells: Array.from({ length: B }, (_, i) => [0, i]), fill: "green" }] },
        { say: `B 안에 A가 몇 번 들어가는지 세요. A의 길이만큼씩 테두리를 쳐요. 하나, 둘, 셋, 넷, 다섯, 여섯.`,
          items: Array.from({ length: times }, (_, i) => [{ kind: "box", x: X0 + i * A * C, y: 214, w: A * C, h: C + 8, color: "red" }, T(X0 + (i + 0.5) * A * C, 280, String(i + 1), "red", 22, "center")]).flat() },
        { say: `A가 ${KO[times]} 번 들어가요. 그래서 B는 A의 ${times}배예요.`,
          items: [T(620, 170, `B는 A의 ${times}배`, "green", 32)] },
        { say: `수로 확인해요. ${B} 안에 ${jo(A, "이")} 몇 번 들어갈까요? ${Array.from({ length: times }, (_, i) => A * (i + 1)).join(", ")}. 나눗셈으로 쓰면 ${B} 나누기 ${jo(A, "은")} ${jo(times, "이에요")}.`,
          items: [T(620, 220, `${B} ÷ ${A} = ${times}`, "blue", 32)] },
        { say: "기준이 무엇인지가 중요해요. B는 A의 몇 배냐고 물으면, 뒤에 나온 A가 기준이에요. 기준으로 나눠요.",
          items: [T(620, 270, "「~의 몇 배」 → 의 앞이 기준", "gold", 24)] },
        { say: `이번엔 같은 간격이에요. 수직선에 ${jo(NL.a, "과")} ${jo(NL.b, "를")} 쓰고, 그 사이를 같은 간격 ${KO[NL.n]} 개로 나눠 볼 거예요.`,
          items: [{ kind: "line", x1: NX(NL.a) - 20, y1: NY, x2: NX(NL.b) + 20, y2: NY, color: "ink", width: 3 }, ...[NL.a, NL.b].flatMap((v) => [{ kind: "line", x1: NX(v), y1: NY - 12, x2: NX(v), y2: NY + 12, color: "ink", width: 3 }, T(NX(v), NY + 44, String(v), "blue", 28, "center")])] },
        { say: `두 수 사이의 거리는 ${NL.b} 빼기 ${jo(NL.a, "은")} ${NL.b - NL.a}. 이 거리를 똑같이 ${KO[NL.n]} 칸으로 나누면 한 칸은 ${NL.b - NL.a} 나누기 ${NL.n}, ${jo(gap, "이에요")}.`,
          items: [T(620, 340, `(${NL.b} − ${NL.a}) ÷ ${NL.n} = ${gap}`, "blue", 30)] },
        { say: `${NL.a}에서 ${gap}씩 가요. ${Array.from({ length: NL.n }, (_, i) => NL.a + gap * (i + 1)).join(", ")}. 마지막이 ${jo(NL.b, "이")} 되니까 맞아요.`,
          items: Array.from({ length: NL.n - 1 }, (_, i) => NL.a + gap * (i + 1)).flatMap((v) => [{ kind: "line", x1: NX(v), y1: NY - 12, x2: NX(v), y2: NY + 12, color: "green", width: 3 }, T(NX(v), NY + 44, String(v), "green", 28, "center")]) },
        { say: "정리해요. 몇 배는 기준이 몇 번 들어가는지 세는 거예요. 같은 간격은 거리를 칸 수로 나눈 뒤, 그만큼씩 가서 끝 수에 닿는지 확인해요.", mood: "praise",
          items: [T(620, 400, "기준이 몇 번 들어가나?", "gold", 30)] },
        { say: `한 문제 풀어 봐요. ${jo(CHK[0], "는")} ${CHK[1]}의 몇 배일까요?`, mood: "think",
          items: [],
          check: { question: `${jo(CHK[0], "는")} ${CHK[1]}의 몇 배일까요?`,
            options: [String(CHK[1]), String(chk), String(CHK[0] - CHK[1])], answer: 1,
            hint: `${jo(CHK[1], "가")} 기준이에요. ${CHK[0]} 안에 ${jo(CHK[1], "가")} 몇 번 들어가는지 세요.`, sayHint: `${CHK[1]}, ${CHK[1] * 2}, ${CHK[1] * 3}… 이렇게 ${CHK[1]}씩 세어 ${CHK[0]}까지 몇 번인지 봐요.`,
            right: `맞았어요! ${CHK[0]} ÷ ${CHK[1]} = ${chk}.`, sayRight: `맞았어요! ${jo(CHK[1], "가")} ${KO[chk]} 번 들어가요. ${jo(CHK[0], "는")} ${CHK[1]}의 ${chk}배예요. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-03/basic-vertical-cryptarithm": (() => {
    const A = crypt(360, 140, ["□", "□", "□"], ["△", "8"], 64);
    const tries = Array.from({ length: 9 }, (_, i) => ({ v: i + 1, s: 3 * (i + 1) })), hit = tries.find((t) => t.s % 10 === 8);
    const B = crypt(930, 410, ["□", "□"], ["△", "4"], 54);
    const CHK = { last: 7 }, chkV = [1, 2, 3, 4, 5, 6, 7, 8, 9].find((v) => (3 * v) % 10 === CHK.last), chkT = Math.floor(3 * chkV / 10);
    return {
      title: "같은 도형을 세로로 더해요",
      kicker: "3권 3단원 · 손글씨 개념",
      beats: [
        { say: "숫자 대신 도형이 들어간 덧셈을 복면산이라고 해요. 약속이 두 가지예요. 같은 도형은 같은 숫자, 다른 도형은 다른 숫자예요.",
          items: [title("복면산 — 같은 도형을 더해요"), T(560, 160, "같은 도형 = 같은 숫자", "blue", 28), T(560, 205, "다른 도형 = 다른 숫자", "blue", 28)] },
        { say: "네모 세 개를 세로로 맞춰 더했더니, 십의 자리는 세모, 일의 자리는 8이 되었어요. 자리를 맞춰 써요.",
          items: A.items },
        { say: "일의 자리부터 봐요. 같은 수를 세 번 더해서 끝자리가 8이 되는 수를 찾아요.",
          items: [A.col(0)] },
        { say: `1부터 차례로 세 번 더해 봐요. ${tries.map((t) => t.s).join(", ")}. 끝자리가 8인 것은 ${hit.s}뿐이에요. 그러니까 네모는 ${jo(hit.v, "이에요")}.`,
          items: [T(560, 280, tries.map((t) => t.s).join(", "), "gray", 24), T(560, 325, `끝자리 8 → ${hit.v}+${hit.v}+${hit.v} = ${hit.s}`, "green", 28)] },
        { say: `${hit.v} 세 번은 ${hit.s}. 일의 자리에 8을 쓰고, 10은 십의 자리로 1이 올라가요. 이걸 받아올림이라고 해요.`,
          items: [A.carry(1), ...[0, 1, 2].map((r) => A.val(r, 0, hit.v))] },
        { say: `십의 자리에는 더할 도형이 없고, 올라온 1만 있어요. 그래서 세모는 1이에요.`,
          items: [A.val(3, 1, Math.floor(hit.s / 10))] },
        { say: `확인해요. ${hit.v} 더하기 ${hit.v} 더하기 ${jo(hit.v, "은")} ${hit.s}. 네모는 ${hit.v}, 세모는 1. 서로 다른 숫자라서 약속도 지켰어요.`,
          items: [T(560, 380, `${hit.v} + ${hit.v} + ${hit.v} = ${hit.s} ✓`, "green", 30)] },
        { say: "이번엔 네모 두 개예요. 더한 결과는 두 자리 수, 십의 자리가 세모, 일의 자리가 4예요.",
          items: B.items },
        { say: "같은 수를 두 번 더해 끝자리가 4가 되는 수는 두 개예요. 2 더하기 2는 4, 7 더하기 7은 14.",
          items: [T(70, 470, "2+2 = 4,  7+7 = 14", "blue", 28)] },
        { say: "결과가 두 자리 수여야 해요. 2를 넣으면 4, 한 자리 수라서 안 돼요. 7을 넣으면 14. 네모는 7, 세모는 1이에요.",
          items: [T(70, 520, "4는 한 자리 ✗ → 14, □ = 7, △ = 1", "green", 26), B.val(0, 0, 7), B.val(1, 0, 7), B.val(2, 1, 1)] },
        { say: "정리해요. 세로로 자리를 맞추고 일의 자리부터 봐요. 끝자리가 맞는 수를 차례로 찾고, 받아올림을 다음 자리에 꼭 더해요. 후보가 여럿이면 자리 수 같은 조건으로 걸러요.", mood: "praise",
          items: [T(70, 575, "일의 자리부터, 받아올림 잊지 않기!", "gold", 26)] },
        { say: `한 문제 풀어 봐요. 같은 동그라미를 세 번 더했더니 십의 자리는 네모, 일의 자리는 ${jo(CHK.last, "이")} 되었어요. 동그라미는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `○ + ○ + ○ = □${CHK.last}일 때 ○는 얼마일까요?`,
            options: ["3", String(chkV), String(CHK.last)], answer: 1,
            hint: `같은 수를 세 번 더해 끝자리가 ${jo(CHK.last, "이")} 되는 수를 찾아요.`, sayHint: `1부터 세 번 더해 봐요. 3, 6, 9, 12, 15, 18, 21, 24, 27. 끝자리가 ${CHK.last}인 것은요?`,
            right: `맞았어요! ${chkV} × 3 = ${3 * chkV}, ○ = ${chkV}, □ = ${chkT}.`, sayRight: `맞았어요! ${chkV} 세 번은 ${3 * chkV}. 동그라미는 ${jo(chkV, "이고")} 네모는 ${jo(chkT, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/cryptarithm-repeated": (() => {
    const A = crypt(420, 150, ["□□", "□□"], ["1", "△", "2"]);
    const cands = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => (2 * v) % 10 === 2);       // 1, 6
    const sq = cands.find((v) => 22 * v >= 100), sumV = 22 * sq, tri = Math.floor(sumV / 10) % 10;
    const CHK = { last: 4 }, chkC = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => (2 * v) % 10 === CHK.last), chkSq = chkC.find((v) => 22 * v >= 100);
    return {
      title: "반복되는 숫자 복면산을 풀어요",
      kicker: "3권 3단원 · 손글씨 개념",
      beats: [
        { say: "두 자리 수인데 두 자리가 모두 네모예요. 네모는 모두 같은 숫자예요. 이런 수 두 개를 더한 식을 풀어 봐요.",
          items: [title("반복되는 숫자 복면산")] },
        { say: "네모네모 더하기 네모네모가 세 자리 수 1, 세모, 2가 되었어요. 자리를 맞춰 써요.",
          items: A.items },
        { say: "같은 도형은 같은 숫자예요. 네모 네 개에 모두 같은 숫자가 들어가요. 하나를 알면 네 개를 다 알아요.",
          items: [T(560, 170, "□ 네 개 = 모두 같은 숫자", "blue", 28)] },
        { say: "일의 자리부터 봐요. 네모 더하기 네모의 끝자리가 2예요.",
          items: [A.col(0)] },
        { say: `같은 수 두 개를 더해 끝자리가 2인 수는 두 개예요. 1 더하기 1은 2, 6 더하기 6은 12. 네모는 ${cands[0]} 아니면 ${jo(cands[1], "이에요")}.`,
          items: [T(560, 225, `□ + □ → 끝자리 2:  ${cands.map((v) => `${v}+${v}=${v * 2}`).join(", ")}`, "blue", 26)] },
        { say: "후보를 식 전체에 넣어 봐요. 1을 넣으면 11 더하기 11은 22. 결과가 세 자리가 아니라서 안 돼요.",
          items: [T(560, 280, "11 + 11 = 22  ✗ (세 자리가 아님)", "red", 26)] },
        { say: `${jo(sq, "을")} 넣으면 ${sq}${sq} 더하기 ${sq}${sq}. 일의 자리 ${sq} 더하기 ${jo(sq, "은")} ${sq * 2}, 2를 쓰고 1이 올라가요.`,
          items: [A.carry(1), A.val(0, 0, sq), A.val(1, 0, sq)] },
        { say: `십의 자리는 ${sq} 더하기 ${sq} 더하기 올라온 1, ${2 * sq + 1}. ${jo(tri, "을")} 쓰고 1이 올라가요. 그래서 세모는 ${jo(tri, "이에요")}.`,
          items: [A.carry(2), A.val(0, 1, sq), A.val(1, 1, sq), A.val(2, 1, tri)] },
        { say: `백의 자리에는 올라온 1뿐이에요. 결과의 1과 맞아요. ${sq}${sq} 더하기 ${jo(`${sq}${sq}`, "는")} ${jo(sumV, "이에요")}.`,
          items: [T(560, 340, `${sq}${sq} + ${sq}${sq} = ${sumV} ✓  (□ = ${sq}, △ = ${tri})`, "green", 28)] },
        { say: "정리해요. 같은 도형에는 같은 숫자를 넣어요. 일의 자리에서 후보를 찾고, 후보를 식 전체에 넣어 받아올림과 자리 수까지 맞는지 확인해요.", mood: "praise",
          items: [T(560, 420, "후보 → 식 전체에 넣어 확인!", "gold", 30)] },
        { say: `한 문제 풀어 봐요. 네모네모 더하기 네모네모가 1, 세모, ${jo(CHK.last, "가")} 되었어요. 네모는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `□□ + □□ = 1△${CHK.last}일 때 □는?`,
            options: [String(chkC[0]), String(chkSq), String(Math.floor(22 * chkSq / 10) % 10)], answer: 1,
            hint: `끝자리가 ${CHK.last}인 후보 두 개를 찾고, 세 자리가 되는지 보세요.`, sayHint: `네모 더하기 네모의 끝자리가 ${CHK.last}인 수는 ${jo(chkC[0], "과")} ${jo(chkC[1], "이에요")}. 둘 다 넣어 보고 결과가 세 자리가 되는 것을 골라요.`,
            right: `맞았어요! ${chkSq}${chkSq} + ${chkSq}${chkSq} = ${22 * chkSq}.`, sayRight: `맞았어요! ${chkC[0]}${chkC[0]} 더하기 ${jo(`${chkC[0]}${chkC[0]}`, "는")} 두 자리라 안 되고, ${chkSq}${chkSq} 더하기 ${jo(`${chkSq}${chkSq}`, "는")} ${jo(22 * chkSq, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/cryptarithm-mixed": (() => {
    const A = crypt(400, 160, ["3□", "□7"], ["8", "△"]);
    // 십의 자리: 3 + □ + (받아올림) = 8 → □ = 5(받아올림 없음) 또는 4(받아올림 있음)
    const t5 = { sq: 5, ones: 5 + 7 }, t4 = { sq: 4, ones: 4 + 7 };
    const sq = 4, tri = (sq + 7) % 10;
    const CHK = { a: 5, b: 2, t: 6 }, chkSq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((v) => { const o = CHK.a + v, c = o >= 10 ? 1 : 0; return v + CHK.b + c === CHK.t && v !== o % 10; }), chkTri = (CHK.a + chkSq) % 10;
    return {
      title: "여러 도형과 고정 숫자를 함께 풀어요",
      kicker: "3권 3단원 · 손글씨 개념",
      beats: [
        { say: "도형과 숫자가 섞인 복면산이에요. 보이는 숫자는 바뀌지 않으니까 가장 좋은 단서예요.",
          items: [title("도형과 숫자가 섞인 복면산")] },
        { say: "삼 네모 더하기 네모 칠이, 팔 세모가 되었어요. 네모 두 개는 같은 숫자예요.",
          items: A.items },
        { say: "이번엔 십의 자리부터 생각해 봐요. 3 더하기 네모가 8이 되어야 해요. 그런데 일의 자리에서 1이 올라올 수도 있어요.",
          items: [A.col(1), T(560, 170, "3 + □ + (올라온 수) = 8", "blue", 28)] },
        { say: "올라온 수가 없으면 네모는 5, 1이 올라오면 네모는 4. 후보가 두 개예요.",
          items: [T(560, 220, "올라옴 없음 → □ = 5,  1 올라옴 → □ = 4", "gray", 24)] },
        { say: `네모가 5라고 해 봐요. 일의 자리는 5 더하기 7, ${jo(t5.ones, "로")} 1이 올라가요. 그러면 십의 자리는 3 더하기 5 더하기 1, 9. 8이 아니라서 안 돼요.`,
          items: [T(560, 275, `□ = 5: 5+7 = ${t5.ones}, 3+5+1 = 9  ✗`, "red", 26)] },
        { say: `네모가 4라고 해 봐요. 일의 자리는 4 더하기 7, ${jo(t4.ones, "로")} 1을 쓰고 1이 올라가요. 십의 자리는 3 더하기 4 더하기 1, 8. 맞아요!`,
          items: [T(560, 325, `□ = 4: 4+7 = ${t4.ones}, 3+4+1 = 8  ✓`, "green", 26), A.carry(1), A.val(0, 0, sq), A.val(1, 1, sq)] },
        { say: `일의 자리 결과가 세모였으니, 세모는 ${jo(tri, "이에요")}.`,
          items: [A.val(2, 0, tri)] },
        { say: `확인해요. 3${sq} 더하기 ${sq}7은 ${30 + sq + sq * 10 + 7}. 팔 세모에 세모 ${tri}, 맞아요. 네모와 세모도 서로 다른 숫자예요.`,
          items: [T(560, 400, `3${sq} + ${sq}7 = ${30 + sq + sq * 10 + 7} ✓`, "green", 30)] },
        { say: "받아올림이 있는지 없는지 모를 때는 둘 다 해 보고, 다른 자리와 맞는 쪽을 골라요.",
          items: [T(560, 460, "받아올림: 있다/없다 둘 다 해 보기", "gold", 26)] },
        { say: "정리해요. 보이는 숫자를 단서로 써요. 받아올림이 있을 수도, 없을 수도 있으면 둘 다 해 봐요. 마지막에 서로 다른 도형이 다른 숫자인지까지 확인해요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 네모 ${CHK.a} 더하기 ${CHK.b} 네모가, ${CHK.t} 세모예요. 네모는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `□${CHK.a} + ${CHK.b}□ = ${CHK.t}△일 때 □는?`,
            options: [String(chkSq - 1), String(chkSq), String(chkTri)], answer: 1,
            hint: `십의 자리: □ + ${CHK.b} + (올라온 수) = ${CHK.t}. 두 경우를 다 해 봐요.`, sayHint: `올라온 수가 없으면 네모는 ${CHK.t - CHK.b}, 있으면 ${CHK.t - CHK.b - 1}. 일의 자리 ${CHK.a} 더하기 네모에서 정말 1이 올라오는지 확인해요.`,
            right: `맞았어요! ${chkSq}${CHK.a} + ${CHK.b}${chkSq} = ${CHK.t}${chkTri}.`, sayRight: `맞았어요! 네모는 ${jo(chkSq, "이고")} 일의 자리 ${CHK.a} 더하기 ${jo(chkSq, "는")} ${CHK.a + chkSq}, 올라오는 수가 없어요. 세모는 ${jo(chkTri, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-03/cryptarithm-linked": (() => {
    const A = crypt(400, 160, ["□△", "△"], ["△", "□"]);
    const tries = [5, 6, 7, 8, 9].map((t) => { const s2 = 2 * t, sq = s2 % 10, tens = sq + 1; return { t, s2, sq, tens, ok: tens === t }; });
    const win = tries.find((r) => r.ok);
    const CHK = { tens: 3 }, chk = [5, 6, 7, 8, 9].map((t) => ({ t, sq: (2 * t) % 10 })).find((r) => r.sq + 1 === CHK.tens);
    return {
      title: "여러 자리의 연결 조건으로 풀어요",
      kicker: "3권 3단원 · 손글씨 개념",
      beats: [
        { say: "같은 도형이 위에도, 아래에도, 결과에도 나오는 복면산이에요. 한 도형의 값은 그 도형이 있는 모든 자리에 한꺼번에 들어가요.",
          items: [title("자리끼리 이어진 복면산")] },
        { say: "네모 세모 더하기 세모가, 세모 네모가 되었어요. 자리를 맞춰 써요.",
          items: A.items },
        { say: "세모가 있는 자리를 모두 찾아요. 첫 수의 일의 자리, 둘째 수, 결과의 십의 자리. 세 곳 모두 같은 숫자예요. 네모도 두 곳이에요.",
          items: [T(560, 170, "△ 세 곳, □ 두 곳", "blue", 28)] },
        { say: "십의 자리를 봐요. 위의 네모가 아래로 내려와 결과의 세모가 됐어요. 네모와 세모는 다른 숫자니까, 일의 자리에서 1이 올라와야만 해요.",
          items: [A.col(1), T(560, 220, "□ + (올라온 1) = △", "blue", 28)] },
        { say: "1이 올라오려면 일의 자리 세모 더하기 세모가 10 이상이어야 해요. 그래서 세모는 5부터 9 사이예요. 하나씩 넣어 봐요.",
          items: [T(560, 270, "△ + △ ≥ 10 → △는 5~9", "gray", 26)] },
        ...tries.map((r, i) => ({ say: r.ok ? `세모가 ${jo(r.t, "이면")} ${r.t} 더하기 ${jo(r.t, "는")} ${r.s2}, 일의 자리 네모는 ${jo(r.sq, "이에요")}. 십의 자리는 ${r.sq} 더하기 1, ${jo(r.tens, "로")} 세모 ${jo(r.t, "와")} 같아요. 맞아요!`
            : `세모가 ${jo(r.t, "이면")} ${r.t} 더하기 ${jo(r.t, "은")} ${r.s2}, 네모는 ${jo(r.sq, "이에요")}. 십의 자리는 ${r.sq} 더하기 1, ${jo(r.tens, "인데")} 세모 ${jo(r.t, "와")} 달라요.`,
          items: [T(560, 320 + i * 40, `△=${r.t}: ${r.t}+${r.t}=${r.s2}, □=${r.sq}, ${r.sq}+1=${r.tens} ${r.ok ? "✓" : "✗"}`, r.ok ? "green" : "red", 24)] })),
        { say: `세모는 ${jo(win.t, "이고")} 네모는 ${jo(win.sq, "이에요")}. 모든 자리에 넣어 봐요. ${win.sq}${win.t} 더하기 ${jo(win.t, "는")} ${win.t}${win.sq}. 맞아요.`,
          items: [A.carry(1), A.val(0, 1, win.sq), A.val(0, 0, win.t), A.val(1, 0, win.t), A.val(2, 1, win.t), A.val(2, 0, win.sq)] },
        { say: "정리해요. 같은 도형이 있는 자리를 모두 표시해요. 받아올림이 꼭 있어야 하는지 따져서 후보를 줄이고, 후보를 하나씩 모든 자리에 넣어 맞는 것을 골라요.", mood: "praise",
          items: [T(70, 520, "한 도형의 값은 모든 자리에 한꺼번에!", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 네모 세모 더하기 세모가 ${CHK.tens} 네모예요. 세모는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `□△ + △ = ${CHK.tens}□일 때 △는?`,
            options: [String(chk.sq), String(chk.t), String(CHK.tens)], answer: 1,
            hint: "십의 자리: □에 1이 올라와 3이 됐어요. □는 얼마일까요?", sayHint: `십의 자리에서 네모에 올라온 1을 더해 ${jo(CHK.tens, "이")} 됐어요. 그럼 네모는 ${jo(CHK.tens - 1, "예요")}. 세모 더하기 세모의 끝자리가 네모가 되는 세모를 찾아요.`,
            right: `맞았어요! ${chk.sq}${chk.t} + ${chk.t} = ${CHK.tens}${chk.sq}.`, sayRight: `맞았어요! 네모는 ${jo(chk.sq, "이고")} 세모는 ${jo(chk.t, "이에요")}. ${chk.sq}${chk.t} 더하기 ${jo(chk.t, "은")} ${CHK.tens}${chk.sq}. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
