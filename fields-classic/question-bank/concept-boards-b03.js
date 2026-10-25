// 손글씨 판서 대본 — 3권(넓이·분수·길이·복면산·마법카드). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수와 그림은 골든벨 3권 문항(온칸·반칸 도형들, 6×20+6·6×28+6+6…, 원 3·4·6·8·9·12조각, 모눈 2×2~5×5 등)과
// 겹치지 않게 골랐다. 겹치면 공개 판서가 비공개 정답을 보여 주게 된다.

import { jo } from "./concept-board-kit.js?v=20261025c";

const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열", 11: "열한", 12: "열두" };
const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
// 신발끈 공식: 꼭짓점 목록(모눈 칸 단위)의 넓이 — 판서의 답을 그림에서 직접 계산해 맞춘다
const polyArea = (pts) => Math.abs(pts.reduce((a, [x1, y1], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return a + x1 * y2 - x2 * y1; }, 0)) / 2;
const sectorPath = (cx, cy, r, a0, a1) => { const p = (a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`; };

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
};
