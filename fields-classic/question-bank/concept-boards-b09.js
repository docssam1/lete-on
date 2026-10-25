// 손글씨 판서 대본 — 9권(도형의 분할과 넓이·쌓기나무·마방진). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 모눈 도형·쌓기나무 모양·마방진 수는 골든벨 9권 문항(직사각형 2×1·3×2, 틀 안의 기운 사각형 3·4·5칸 틀,
// 계단 쌓기 4·5층, 27개 정육면체 칠하기, 위·앞·옆 모양 12개 …)과 같은 판이 되지 않게 새로 짰다.

import { jo, polyArea, iso, topGrid, sum2 } from "./concept-board-kit.js?v=20261026b";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };

// 모눈 위의 다각형: G = {x, y, cell, cols, rows}, 꼭짓점은 [칸, 줄]
const gridOf = (G, color = "gray") => ({ kind: "grid", x: G.x, y: G.y, cols: G.cols, rows: G.rows, cell: G.cell, color });
const poly = (G, pts, stroke = "blue", fill, dash, width = 3.5) => ({ kind: "path", d: `M ${pts.map(([c, r]) => `${G.x + c * G.cell} ${G.y + r * G.cell}`).join(" L ")} Z`, stroke, width, fill, dash, quick: !!fill });
// 앞·옆에서 본 모양: 줄마다 층수만큼 네모를 쌓는다(왼쪽 줄부터)
const view = (x0, base, hs, s = 36, fill = "#cfe0f5") => hs.flatMap((h, i) => Array.from({ length: h }, (_, k) => [
  { kind: "fill", x: x0 + i * s + 2, y: base - (k + 1) * s + 2, w: s - 4, h: s - 4, fill }, { kind: "box", x: x0 + i * s, y: base - (k + 1) * s, w: s, h: s, color: "ink" }]).flat());

export const BOARDS_B09 = {
  "book-09/unit-area-and-half": (() => {
    const A = { x: 70, y: 135, cell: 36, cols: 7, rows: 5 }, rect = [[1, 1], [6, 1], [6, 4], [1, 4]], aW = 5, aH = 3;
    const B = { x: 70, y: 350, cell: 36, cols: 8, rows: 5 }, bRect = [[1, 1], [7, 1], [7, 4], [1, 4]], bTri = [[1, 1], [7, 4], [1, 4]], bW = 6, bH = 3;
    const C = { x: 590, y: 135, cell: 36, cols: 7, rows: 7 }, frame = [[1, 1], [6, 1], [6, 6], [1, 6]], sq = [[1, 5], [2, 1], [6, 2], [5, 6]];
    const corners = [[[1, 1], [2, 1], [1, 5]], [[2, 1], [6, 1], [6, 2]], [[6, 2], [6, 6], [5, 6]], [[5, 6], [1, 6], [1, 5]]];
    const fW = 5, cornerA = polyArea(corners[0]), sqA = polyArea(sq);
    const CHK = { w: 8, h: 3 }, chkV = CHK.w * CHK.h / 2;
    return {
      title: "모눈으로 넓이 — 세고, 반으로, 틀에서 빼고",
      kicker: "9권 1단원 · 손글씨 개념",
      beats: [
        { say: "모눈 한 칸의 넓이를 1로 정하고 넓이를 구해요. 직사각형은 칸을 세고, 대각선으로 자른 삼각형은 직사각형의 반이에요. 비스듬히 기운 모양은 바깥에 틀을 그려서 빼요.",
          items: [title("모눈으로 넓이 구하기")] },
        { say: `먼저 직사각형이에요. 가로 ${KO[aW]} 칸, 세로 ${KO[aH]} 칸이에요. 한 줄에 ${KO[aW]} 칸씩 ${KO[aH]} 줄이니까 ${aW}, ${aW * 2}, ${aW * 3}. 넓이는 ${jo(aW * aH, "이에요")}.`,
          items: [gridOf(A), poly(A, rect, "blue", "#cfe0f5"), poly(A, rect, "blue"), T(340, 190, `${aW} × ${aH} = ${aW * aH}`, "blue", 30)] },
        { say: `이번엔 삼각형이에요. 둘레에 직사각형을 그리면 가로 ${KO[bW]} 칸, 세로 ${KO[bH]} 칸. 직사각형의 넓이는 ${jo(bW * bH, "이에요")}.`,
          items: [gridOf(B), poly(B, bRect, "gray", null, true, 2.5), T(380, 400, `직사각형 ${bW} × ${bH} = ${bW * bH}`, "gray", 24)] },
        { say: `대각선이 직사각형을 똑같은 삼각형 두 개로 나눠요. 그러니 삼각형 하나는 ${bW * bH}의 반, ${jo(bW * bH / 2, "예요")}.`,
          items: [poly(B, bTri, "red", "#f6dcd3"), poly(B, bTri, "red"), T(380, 445, `반 → ${bW * bH} ÷ 2 = ${bW * bH / 2}`, "red", 28)] },
        { say: "마지막은 비스듬히 기운 사각형이에요. 칸이 잘려 있어서 하나씩 세기 어려워요.",
          items: [gridOf(C), poly(C, sq, "green", "#d7ecd9"), poly(C, sq, "green")] },
        { say: `바깥에 틀을 그려요. 꼭짓점에 꼭 맞는 정사각형 틀이에요. 가로 ${KO[fW]} 칸, 세로 ${KO[fW]} 칸, 틀의 넓이는 ${jo(fW * fW, "예요")}.`,
          items: [poly(C, frame, "ink", null, true, 2.5), T(C.x, 430, `틀 ${fW} × ${fW} = ${fW * fW}`, "ink", 26)] },
        { say: `틀 안에서 기운 사각형 바깥에 삼각형 네 개가 남아요. 하나하나가 가로 1칸, 세로 4칸 직사각형의 반이라서 넓이는 ${jo(cornerA, "예요")}.`,
          items: [...corners.map((t) => poly(C, t, "gold", "#f6e1a8")), ...corners.map((t) => poly(C, t, "gold", null, false, 2)), T(C.x, 470, `모서리 삼각형 = 1 × 4 ÷ 2 = ${cornerA}`, "gold", 24)] },
        { say: `틀에서 네 삼각형을 빼요. ${fW * fW} 빼기 ${cornerA} 곱하기 4, ${fW * fW} 빼기 ${jo(cornerA * 4, "는")} ${jo(sqA, "이에요")}. 기운 사각형의 넓이는 ${jo(sqA, "이에요")}.`,
          items: [T(C.x, 515, `${fW * fW} − ${cornerA} × 4 = ${sqA}`, "green", 30)] },
        { say: "정리해요. 직사각형은 가로 칸 수 곱하기 세로 칸 수예요. 대각선으로 자른 삼각형은 그 반이에요. 기운 모양은 틀의 넓이에서 바깥 삼각형들을 빼요.", mood: "praise",
          items: [T(60, 575, "직사각형 = 가로 × 세로 · 삼각형 = 반 · 기운 모양 = 틀 − 바깥", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 가로 ${KO[CHK.w]} 칸, 세로 ${KO[CHK.h]} 칸 직사각형을 대각선으로 반으로 나눈 삼각형의 넓이는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `가로 ${CHK.w}칸, 세로 ${CHK.h}칸 직사각형을 대각선으로 나눈 삼각형의 넓이는?`,
            options: [String(CHK.w * CHK.h), String(chkV), String(chkV - 1)], answer: 1,
            hint: "직사각형의 넓이를 먼저 구하고 반으로 나눠요.", sayHint: `직사각형은 ${CHK.w} 곱하기 ${CHK.h}, ${jo(CHK.w * CHK.h, "예요")}. 삼각형은 그 반이에요.`,
            right: `맞았어요! ${CHK.w} × ${CHK.h} = ${CHK.w * CHK.h}, 반은 ${chkV}.`, sayRight: `맞았어요! ${CHK.w * CHK.h}의 반, ${jo(chkV, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-09/cube-map-total": (() => {
    const MAP = [[3, 2, 2], [1, 2, 0], [1, 0, 0]], total = sum2(MAP);
    const I = iso(250, 240, 36, 21, 42);
    const tops = MAP.flatMap((row, y) => row.map((n, x) => (n ? [x, y, n] : null)).filter(Boolean));
    const A = [[3, 3], [3, 3]], B = [[3, 2], [2, 1]], D = A.map((r, y) => r.map((v, x) => v - B[y][x]));
    const GA = 90, GB = 240, GD = 390, GY = 440, cell = 44, NX = 560;
    const CHK = [3, 1, 2, 2, 1], chk = CHK.reduce((a, b) => a + b, 0);
    return {
      title: "높이표로 쌓기나무 세기",
      kicker: "9권 2단원 · 손글씨 개념",
      beats: [
        { say: "쌓기나무를 위에서 내려다본 모양에 칸마다 몇 층인지 써 넣은 것을 높이표라고 해요. 높이표의 수를 모두 더하면, 가려서 안 보이는 쌓기나무까지 모두 셀 수 있어요.",
          items: [title("높이표로 세기")] },
        { say: "쌓기나무를 쌓았어요. 뒤쪽 기둥은 앞 기둥에 가려서 아래쪽이 안 보여요.",
          items: I.stack(MAP) },
        { say: "기둥마다 맨 위에 몇 층인지 써요. 그리고 위에서 본 모양을 옆에 그려 같은 자리에 층수를 옮겨요. 쌓기나무가 없는 자리는 0이에요.",
          items: [...tops.map(([x, y, n]) => I.topLabel(x, y, n, n)), ...topGrid(500, 140, MAP), T(500, 300, "← 높이표", "gray", 22)] },
        { say: `높이표의 수를 모두 더해요. ${jo(MAP.flat().filter(Boolean).join(" 더하기 "), "는")} ${jo(total, "이에요")}. 쌓기나무는 모두 ${total}개예요.`,
          items: [T(660, 200, `${MAP.flat().filter(Boolean).join(" + ")}`, "green", 30), T(660, 245, `= ${total}개`, "green", 32)] },
        { say: "이번엔 쌓기나무를 빼는 문제예요. 가 모양은 칸마다 3층씩 빈틈없이 쌓았어요. 이것을 나 모양으로 만들려면 몇 개를 빼야 할까요? 둘 다 높이표로 써요.",
          items: [{ kind: "line", x1: 60, y1: 382, x2: 940, y2: 382, color: "gray", width: 2, dash: true }, T(GA, GY - 16, "가", "blue", 26), ...topGrid(GA, GY, A, cell), T(GB, GY - 16, "나", "green", 26), ...topGrid(GB, GY, B, cell, "green")] },
        { say: `가는 ${A.flat().join(" 더하기 ")}, ${sum2(A)}개. 나는 ${B.flat().join(" 더하기 ")}, ${sum2(B)}개. 빼야 하는 것은 ${sum2(A)} 빼기 ${sum2(B)}, ${KO[sum2(A) - sum2(B)]} 개예요.`,
          items: [T(NX, 430, `가 ${sum2(A)}개, 나 ${sum2(B)}개`, "blue", 26), T(NX, 475, `빼기: ${sum2(A)} − ${sum2(B)} = ${sum2(A) - sum2(B)}개`, "red", 28)] },
        { say: `칸마다 빼도 돼요. 같은 자리끼리 빼서 높이표를 하나 더 만들어요. ${D.flat().join(", ")}. 더하면 ${jo(sum2(D), "예요")}. 같은 답이에요.`,
          items: [T(GD, GY - 16, "뺄 것", "red", 22), ...topGrid(GD, GY, D, cell, "red"), T(NX, 520, `칸마다: ${D.flat().join(" + ")} = ${sum2(D)} ✓`, "green", 24)] },
        { say: "정리해요. 위에서 본 칸마다 층수를 쓰고 모두 더하면 가려진 쌓기나무까지 셀 수 있어요. 모양을 바꿀 때는 두 높이표의 합을 빼거나, 칸마다 빼서 더해요.", mood: "praise",
          items: [T(60, 580, "높이표의 합 = 전체 개수 · 두 모양의 차 = 빼거나 더할 개수", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 위에서 본 다섯 칸의 층수가 ${jo(CHK.join(", "), "이에요")}. 쌓기나무는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `위에서 본 칸의 층수가 ${CHK.join(", ")}일 때 쌓기나무는 모두 몇 개?`,
            options: [String(CHK.length), String(chk), String(chk - 1)], answer: 1,
            hint: "층수를 모두 더해요.", sayHint: `${jo(CHK.join(" 더하기 "), "를")} 계산해 봐요.`,
            right: `맞았어요! ${CHK.join(" + ")} = ${chk}.`, sayRight: `맞았어요! 모두 더하면 ${jo(chk, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-09/cube-paint-source": (() => {
    const N = 4, I = iso(240, 340, 30, 17, 34), S = iso(800, 200, 46, 27, 54);
    const faces = (x, y, z) => [x, y, z].filter((v) => v === 0 || v === N - 1).length;
    const TONE = { 3: ["#f4c9bd", "#e3a594", "#d48c79"], 2: ["#f6e1a8", "#e6c877", "#d6b45a"], 1: ["#cfe0f5", "#a9c6ea", "#8fb2de"] };
    // 보이는 쌓기나무(맨 위·오른쪽 앞·왼쪽 앞 바깥 줄)만 뒤에서 앞으로 그린다
    const seen = []; for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) if (x === N - 1 || y === N - 1 || z === N - 1) seen.push([x, y, z]);
    seen.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
    const paint = (show) => seen.flatMap(([x, y, z]) => I.cube(x, y, z, show.includes(faces(x, y, z)) ? TONE[faces(x, y, z)] : undefined));
    const c3 = 8, c2 = 12 * (N - 2), c1 = 6 * (N - 2) ** 2, c0 = (N - 2) ** 3, NX = 520;
    const CHK = { per: 3 }, chkV = 12 * CHK.per;
    return {
      title: "겉을 칠한 정육면체 — 자리마다 칠해진 면",
      kicker: "9권 2단원 · 손글씨 개념",
      beats: [
        { say: "작은 쌓기나무로 큰 정육면체를 만들고 겉을 모두 칠해요. 바닥도 칠해요. 작은 쌓기나무마다 몇 면이 칠해질까요? 어느 자리에 있는지가 핵심이에요.",
          items: [title("겉을 칠한 정육면체")] },
        { say: `쌓기나무를 가로 ${KO[N]} 개, 세로 ${KO[N]} 개, ${KO[N]} 층으로 쌓았어요. 모두 ${N} 곱하기 ${N} 곱하기 ${N}, ${N ** 3}개예요.`,
          items: [...paint([]), T(60, 520, `${N} × ${N} × ${N} = ${N ** 3}개`, "ink", 28)] },
        { say: "정육면체 하나를 따로 그려서 세어 봐요. 면은 위아래, 앞뒤, 양옆으로 여섯 개. 모서리는 열두 개. 꼭짓점은 여덟 개예요.",
          items: [...S.cube(0, 0, 0), T(NX + 130, 295, "면 6 · 모서리 12 · 꼭짓점 8", "blue", 26)] },
        { say: `꼭짓점 자리 쌓기나무는 세 면이 바깥으로 나와 있어서 세 면이 칠해져요. 꼭짓점이 여덟 개니까 세 면 칠해진 것은 ${KO[8]} 개예요.`,
          items: [...paint([3]), T(NX, 390, `세 면: 꼭짓점 → ${c3}개`, "red", 26)] },
        { say: `모서리 위에서 꼭짓점 둘을 뺀 가운데 쌓기나무는 두 면이 칠해져요. 모서리 하나에 ${N} 빼기 2, ${KO[N - 2]} 개씩. 모서리가 열두 개니까 12 곱하기 ${N - 2}, ${c2}개예요.`,
          items: [...paint([3, 2]), T(NX, 430, `두 면: 12 × ${N - 2} = ${c2}개`, "gold", 26)] },
        { say: `면 위에서 가장자리를 뺀 가운데는 한 면만 칠해져요. 한 면에 ${N - 2} 곱하기 ${N - 2}, ${KO[(N - 2) ** 2]} 개. 면이 여섯 개니까 6 곱하기 ${(N - 2) ** 2}, ${c1}개예요.`,
          items: [...paint([3, 2, 1]), T(NX, 470, `한 면: 6 × ${(N - 2) ** 2} = ${c1}개`, "blue", 26)] },
        { say: `가장 안쪽은 겉에 닿지 않아서 하나도 안 칠해져요. 안쪽은 ${N - 2} 곱하기 ${N - 2} 곱하기 ${N - 2}, ${c0}개예요.`,
          items: [T(NX, 510, `안 칠해짐: ${N - 2} × ${N - 2} × ${N - 2} = ${c0}개`, "gray", 24)] },
        { say: `모두 더해 확인해요. ${c3} 더하기 ${c2} 더하기 ${c1} 더하기 ${jo(c0, "은")} ${jo(c3 + c2 + c1 + c0, "예요")}. 처음 ${N ** 3}개와 같아요.`,
          items: [T(NX, 550, `${c3} + ${c2} + ${c1} + ${c0} = ${c3 + c2 + c1 + c0} ✓`, "green", 26)] },
        { say: "정리해요. 꼭짓점 자리는 세 면, 모서리 가운데는 두 면, 면 가운데는 한 면이 칠해져요. 가장 안쪽은 칠해지지 않아요. 꼭짓점 8, 모서리 12, 면 6을 기억해요.", mood: "praise",
          items: [T(60, 575, "꼭짓점 3면 · 모서리 가운데 2면 · 면 가운데 1면 · 안쪽 0면", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 큰 정육면체의 모서리마다 가운데에 두 면이 칠해진 쌓기나무가 ${KO[CHK.per]} 개씩 있어요. 두 면이 칠해진 쌓기나무는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `모서리마다 가운데에 두 면 칠해진 쌓기나무가 ${CHK.per}개씩. 모두 몇 개?`,
            options: [String(chkV), String(8 * CHK.per), String(6 * CHK.per)], answer: 0,
            hint: "정육면체의 모서리는 몇 개였나요?", sayHint: "모서리는 열두 개예요. 모서리마다 세 개씩이에요.",
            right: `맞았어요! 12 × ${CHK.per} = ${chkV}.`, sayRight: `맞았어요! 모서리 열두 개에 세 개씩, ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-09/cube-views-source": (() => {
    const MAP = [[1, 3, 2], [2, 1, 1], [1, 0, 2]];                   // 0번 줄 = 뒷줄, 마지막 줄 = 앞줄
    const front = MAP[0].map((_, c) => Math.max(...MAP.map((r) => r[c])));
    const side = [...MAP].reverse().map((r) => Math.max(...r));       // 오른쪽 옆: 앞줄이 왼쪽
    const GX = 90, GY = 170, cell = 60, FX = 430, SX = 690, BASE = 330, s = 40;
    const colBox = (c) => ({ kind: "box", x: GX + c * cell + 3, y: GY + 3, w: cell - 6, h: 3 * cell - 6, color: "red", dash: true });
    const rowBox = (r) => ({ kind: "box", x: GX + 3, y: GY + r * cell + 3, w: 3 * cell - 6, h: cell - 6, color: "green", dash: true });
    const CHK = [1, 4, 2], chkV = Math.max(...CHK);
    return {
      title: "앞과 옆에서 본 모양 — 줄마다 가장 높은 기둥",
      kicker: "9권 2단원 · 손글씨 개념",
      beats: [
        { say: "쌓기나무를 앞에서 보면, 한 줄에 기둥이 여러 개 있어도 가장 높은 기둥만 보여요. 낮은 기둥은 높은 기둥에 가려져요. 높이표로 줄마다 가장 큰 수를 찾으면 돼요.",
          items: [title("앞과 옆에서 본 모양")] },
        { say: "높이표를 그려요. 위쪽이 뒷줄, 아래쪽이 앞줄이에요. 우리는 아래쪽, 앞에서 보고 있어요.",
          items: [...topGrid(GX, GY, MAP, cell), T(GX + 1.5 * cell, GY - 14, "뒤", "gray", 24, "center"), T(GX + 1.5 * cell, GY + 3 * cell + 36, "앞 (보는 쪽)", "gray", 24, "center"), T(GX + 3 * cell + 14, GY + 1.5 * cell + 8, "오른쪽 →", "gray", 22)] },
        { say: `앞에서 보면 세로줄마다 하나의 기둥 높이가 보여요. 왼쪽 세로줄은 ${MAP.map((r) => r[0]).join(", ")}. 가장 높은 것은 ${jo(front[0], "이에요")}.`,
          items: [colBox(0), T(FX, 150, "앞에서 본 모양", "red", 24), ...view(FX, BASE, [front[0]], s)] },
        { say: `가운데 세로줄은 ${MAP.map((r) => r[1]).join(", ")}, 가장 높은 것은 ${jo(front[1], "이에요")}. 오른쪽 세로줄은 ${MAP.map((r) => r[2]).join(", ")}, 가장 높은 것은 ${jo(front[2], "예요")}.`,
          items: [colBox(1), colBox(2), ...view(FX + s, BASE, [front[1]], s), ...view(FX + 2 * s, BASE, [front[2]], s), T(FX, BASE + 40, `왼쪽부터 ${front.join(", ")}`, "red", 24)] },
        { say: "이번엔 오른쪽 옆에서 봐요. 그러면 가로줄마다 가장 높은 기둥이 보여요. 오른쪽에 서서 보면 앞줄이 왼쪽, 뒷줄이 오른쪽에 와요.",
          items: [T(SX, 150, "오른쪽 옆에서 본 모양", "green", 24)] },
        { say: `앞줄은 ${MAP[2].join(", ")}, 가장 높은 것은 ${jo(side[0], "예요")}. 가운뎃줄은 ${MAP[1].join(", ")}, 가장 높은 것은 ${jo(side[1], "예요")}. 뒷줄은 ${MAP[0].join(", ")}, 가장 높은 것은 ${jo(side[2], "이에요")}.`,
          items: [rowBox(2), rowBox(1), rowBox(0), ...view(SX, BASE, side, s, "#d7ecd9"), T(SX, BASE + 40, `앞줄부터 ${side.join(", ")}`, "green", 24)] },
        { say: `높이표의 쌓기나무는 모두 ${sum2(MAP)}개인데, 앞 모양에는 ${front.reduce((a, b) => a + b, 0)}칸, 옆 모양에는 ${side.reduce((a, b) => a + b, 0)}칸만 보여요. 낮은 기둥은 높은 기둥에 가려서 안 보이기 때문이에요.`,
          items: [T(FX, 440, `높이표 합 ${sum2(MAP)} · 앞 모양 ${front.reduce((a, b) => a + b, 0)}칸 · 옆 모양 ${side.reduce((a, b) => a + b, 0)}칸`, "gray", 22)] },
        { say: "정리해요. 앞에서 보면 세로줄마다, 오른쪽 옆에서 보면 가로줄마다 가장 큰 수만큼 보여요. 옆 모양은 앞줄이 왼쪽이에요.", mood: "praise",
          items: [T(60, 540, "앞 = 세로줄의 가장 큰 수 · 옆 = 가로줄의 가장 큰 수(앞줄이 왼쪽)", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 한 세로줄에 앞에서부터 ${CHK.join("층, ")}층 기둥이 있어요. 앞에서 보면 그 줄은 몇 층으로 보일까요?`, mood: "think",
          items: [],
          check: { question: `한 세로줄에 ${CHK.join("층, ")}층 기둥이 있어요. 앞에서 보면 몇 층?`,
            options: [String(CHK[0]), String(chkV), String(CHK.reduce((a, b) => a + b, 0))], answer: 1,
            hint: "가장 높은 기둥만 보여요.", sayHint: "앞에서 보면 낮은 기둥은 높은 기둥에 가려져요. 가장 높은 것은 몇 층일까요?",
            right: `맞았어요! 가장 높은 ${chkV}층만 보여요.`, sayRight: `맞았어요! ${chkV}층 기둥에 나머지가 가려서 ${chkV}층으로 보여요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-09/cube-min-max-source": (() => {
    const FRONT = [3, 1, 2], SIDE = [2, 3];                          // 앞: 왼쪽 세로줄부터 · 옆: 앞줄부터
    const ROWS = 2, COLS = 3, rowSide = (r) => SIDE[ROWS - 1 - r];   // r = 0 뒷줄
    const MAX = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => Math.min(FRONT[c], rowSide(r))));
    const MIN = [[3, 1, 1], [1, 1, 2]];
    const GX = 90, GY = 170, cell = 56, FX = 380, SX = 560, BASE = 300, s = 34, MX = 90, XX = 330, MY = 395, mc = 50, NX = 570;
    const CHK = { min: 6 };
    return {
      title: "쌓기나무의 가장 적을 때와 가장 많을 때",
      kicker: "9권 2단원 · 손글씨 개념",
      beats: [
        { say: "위, 앞, 옆에서 본 모양만 알 때, 쌓기나무는 몇 개일까요? 답이 하나가 아닐 수 있어요. 정해지는 칸부터 채우고, 남은 칸을 가장 적게, 가장 많게 정해요.",
          items: [title("가장 적을 때 · 가장 많을 때")] },
        { say: `위에서 보면 두 줄에 세 칸씩, 여섯 칸이에요. 앞에서 보면 왼쪽부터 ${FRONT.join(", ")}층, 오른쪽 옆에서 보면 앞줄부터 ${SIDE.join(", ")}층이에요.`,
          items: [{ kind: "grid", x: GX, y: GY, cols: COLS, rows: ROWS, cell, color: "ink" }, T(GX + 1.5 * cell, GY - 14, "위에서 본 모양 (위쪽이 뒤)", "gray", 20, "center"), T(GX + 1.5 * cell, GY + ROWS * cell + 32, "앞", "gray", 22, "center"),
            T(FX, 150, "앞", "red", 24), ...view(FX, BASE, FRONT, s), T(SX, 150, "옆 (앞줄부터)", "green", 24), ...view(SX, BASE, SIDE, s, "#d7ecd9")] },
        { say: "칸마다 적어도 1개씩은 있어요. 그리고 앞에서 1층으로 보이는 가운데 세로줄은 두 칸 모두 1층이에요.",
          items: [T(GX + 1.5 * cell, GY + 0.5 * cell + 10, "1", "blue", 28, "center"), T(GX + 1.5 * cell, GY + 1.5 * cell + 10, "1", "blue", 28, "center")] },
        { say: "3층은 어디에 있을까요? 앞 모양에서 3층은 왼쪽 세로줄, 옆 모양에서 3층은 뒷줄이에요. 두 줄이 만나는 왼쪽 뒤 칸이 3층이에요. 앞줄은 옆에서 2층이니 3층이 될 수 없어요.",
          items: [{ kind: "box", x: GX + 4, y: GY + 4, w: cell - 8, h: cell - 8, color: "red", dash: true }, T(GX + 0.5 * cell, GY + 0.5 * cell + 10, "3", "red", 28, "center")] },
        { say: `가장 적게 쌓아 봐요. 아직 필요한 것은 오른쪽 세로줄의 2층과 앞줄의 2층이에요. 둘이 만나는 오른쪽 앞 칸 하나에 2층을 쌓으면 한 번에 해결돼요. 나머지는 1층. 모두 ${jo(sum2(MIN), "예요")}.`,
          items: [T(MX, MY - 14, "가장 적게", "blue", 24), ...topGrid(MX, MY, MIN, mc), T(MX, MY + ROWS * mc + 34, `${MIN.flat().join("+")} = ${sum2(MIN)}`, "blue", 24)] },
        { say: `가장 많게 쌓아 봐요. 칸마다 앞 모양의 층수와 옆 모양의 층수 가운데 작은 것까지 쌓을 수 있어요. 그보다 높으면 앞이나 옆 모양이 달라지니까요. 모두 ${jo(sum2(MAX), "이에요")}.`,
          items: [T(XX, MY - 14, "가장 많게", "gold", 24), ...topGrid(XX, MY, MAX, mc, "gold"), T(XX, MY + ROWS * mc + 34, `${MAX.flat().join("+")} = ${sum2(MAX)}`, "gold", 24)] },
        { say: "두 판 모두 확인해요. 세로줄마다 가장 큰 수가 3, 1, 2이고, 앞줄의 가장 큰 수가 2, 뒷줄이 3이에요. 앞과 옆 모양이 그대로예요.",
          items: [T(NX, 440, `앞: ${FRONT.join(", ")} ✓  옆: ${SIDE.join(", ")} ✓`, "green", 24), T(NX, 485, `가장 적게 ${sum2(MIN)}개 · 가장 많게 ${sum2(MAX)}개`, "green", 26)] },
        { say: "정리해요. 1층으로 보이는 줄은 모두 1층. 높은 층은 앞과 옆의 줄이 만나는 칸에 써요. 가장 적게는 높은 층을 한 칸에 겹치고, 가장 많게는 칸마다 앞과 옆 중 작은 수까지 쌓아요.", mood: "praise",
          items: [T(60, 580, "1층 줄 → 만나는 칸 → 적게는 겹치기 · 많게는 작은 쪽까지", "gold", 24)] },
        { say: "한 문제 풀어 봐요. 위에서 보면 두 줄에 두 칸씩 네 칸, 앞에서도 옆에서도 두 줄이 모두 2층으로 보여요. 쌓기나무가 가장 적을 때는 몇 개일까요?", mood: "think",
          items: [],
          check: { question: "위에서 네 칸(2줄 × 2칸), 앞·옆 모두 2층 두 줄일 때 가장 적은 개수는?",
            options: ["4", String(CHK.min), "8"], answer: 1,
            hint: "2층을 대각선 두 칸에 두면 두 줄씩 모두 2층이 돼요.", sayHint: "2층을 서로 다른 줄, 서로 다른 세로줄에 하나씩 두면 앞도 옆도 2층으로 보여요. 나머지 두 칸은 1층이에요.",
            right: `맞았어요! 2 + 2 + 1 + 1 = ${CHK.min}.`, sayRight: `맞았어요! 대각선 두 칸에 2층, 나머지는 1층. ${jo(CHK.min, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
