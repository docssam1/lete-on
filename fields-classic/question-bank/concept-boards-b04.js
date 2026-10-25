// 손글씨 판서 대본 — 4권(도형 움직이기·쌓기나무·저울·논리추리). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수와 그림은 골든벨 4권 문항과 겹치지 않게 골랐다(정사각형 3·4개 모양 수 → 판서는 삼각형으로,
// 디지털 수 2·5·6·8·12·15·16·18·21·25·51·58·59·61·65·81·82·98·952 → 판서는 85·56·52).

import { jo, mirrorLR, mirrorTB, turnHalf, DIGIT_SEGMENTS, moveSegs, transformDigit } from "./concept-board-kit.js?v=20261025f";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });

// 삼각형 모눈: 점 P(a, b), 위로 선 세모 up(a, b), 아래로 선 세모 down(a, b)
const triLattice = (x0, y0, s) => {
  const h = s * Math.sqrt(3) / 2, P = (a, b) => [x0 + (a + b / 2) * s, y0 - b * h];
  const pts = ([kind, a, b]) => kind === "up" ? [P(a, b), P(a + 1, b), P(a, b + 1)] : [P(a + 1, b), P(a, b + 1), P(a + 1, b + 1)];
  const tri = (t, fill = "#cfe0f5", stroke = "blue") => ({ kind: "path", d: `M ${pts(t).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`, stroke, width: 2.5, fill, quick: true });
  return { tri, shape: (list, extra) => [...list.map((t) => tri(t)), ...(extra ? [tri(extra, "#f6dcd3", "red")] : [])] };
};

// 쌓기나무 그림(등각): map[y][x] = 그 자리의 층수. 뒤에서 앞으로, 아래에서 위로 그려 앞의 것이 덮게 한다.
const iso = (ox, oy, w = 30, h = 17, H = 34) => {
  const P = (x, y, z) => [ox + (x - y) * w, oy + (x + y) * h - z * H];
  const face = (pts, fill) => ({ kind: "path", d: `M ${pts.map(([a, b, c]) => P(a, b, c).map((v) => v.toFixed(1)).join(" ")).join(" L ")} Z`, stroke: "ink", width: 1.8, fill, quick: true });
  const cube = (x, y, z, tone = ["#f3ead2", "#d8c9a3", "#bfae86"]) => [
    face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], tone[0]),
    face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], tone[2]),
    face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], tone[1])];
  const stack = (map, tone) => { const out = [], cells = [];
    map.forEach((row, y) => row.forEach((n, x) => { for (let z = 0; z < n; z++) cells.push([x, y, z]); }));
    cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
    for (const [x, y, z] of cells) out.push(...cube(x, y, z, tone)); return out; };
  const topLabel = (x, y, z, v, color = "red") => { const [cx, cy] = P(x + 0.5, y + 0.5, z); return T(cx, cy + 10, String(v), color, Math.round(w * 0.8), "center"); };
  return { P, cube, stack, topLabel };
};
const topGrid = (x0, y0, map, cell = 46, color = "blue") => [{ kind: "grid", x: x0, y: y0, cols: map[0].length, rows: map.length, cell, color: "ink" },
  ...map.flatMap((row, r) => row.map((n, c) => T(x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 10, String(n), n ? color : "gray", 28, "center")))];
const sum2 = (map) => map.flat().reduce((a, b) => a + b, 0);

// 양팔저울(평형): 접시마다 도형 목록. 같은 도형은 지울 수 있게 각 도형의 자리를 돌려준다.
const scaleEq = (cx, cy, left, right, size = 15, gapW = 34) => {
  const L = [cx - 150, cy], R = [cx + 150, cy], out = [], spots = { left: [], right: [] };
  out.push({ kind: "path", d: `M ${cx} ${cy} L ${cx - 24} ${cy + 64} L ${cx + 24} ${cy + 64} Z`, stroke: "gray", width: 3, quick: true });
  out.push({ kind: "line", x1: L[0], y1: L[1], x2: R[0], y2: R[1], color: "ink", width: 4 });
  for (const [[x, y], stuff, side] of [[L, left, "left"], [R, right, "right"]]) {
    out.push({ kind: "line", x1: x, y1: y, x2: x, y2: y + 20, color: "gray", width: 2 });
    out.push({ kind: "path", d: `M ${x - 92} ${y + 20} Q ${x} ${y + 66} ${x + 92} ${y + 20}`, stroke: "ink", width: 3 });
    const n = stuff.length, per = Math.min(n, 5);
    stuff.forEach((type, i) => { const row = Math.floor(i / 5), col = i % 5, m = Math.min(per, n - row * 5);
      const sx = x + (col - (m - 1) / 2) * gapW, sy = y + 38 - size - row * (size * 2 + 6);
      spots[side].push([sx, sy]); out.push({ kind: "shape", type, cx: sx, cy: sy, r: size, color: "blue", width: 2.5, quick: true }); });
  }
  return { items: out, spots, erase: (side, idx) => idx.map((i) => ({ kind: "x", cx: spots[side][i][0], cy: spots[side][i][1], r: size, color: "red" })) };
};
const rep = (type, n) => Array(n).fill(type);

export const BOARDS_B04 = {
  "book-04/polyomino-family-count": (() => {
    const TRAP = [["up", 0, 0], ["down", 0, 0], ["up", 1, 0]];
    const C4 = [{ add: ["up", 0, 1], tag: "가" }, { add: ["down", 1, 0], tag: "나" }, { add: ["down", -1, 0], tag: "다" }, { add: ["down", 0, -1], tag: "라" }, { add: ["down", 1, -1], tag: "마" }];
    const XS = [110, 290, 470, 650, 830], Y2 = 450, S = 46;
    const at = (i) => triLattice(XS[i] - (i === 2 ? -10 : 0), Y2, S);
    const kinds = 3;
    return {
      title: "붙인 정사각형의 모양을 세어요",
      kicker: "4권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 조각을 변끼리 붙여 만들 수 있는 모양이 몇 가지인지 세는 법을 배워요. 오늘은 삼각형 조각으로 연습하고, 정사각형은 게임과 골든벨에서 직접 세어 봐요.",
          items: [title("붙여 만든 모양 세기")] },
        { say: "약속이 두 가지예요. 조각은 변과 변이 꼭 맞게 붙여요. 그리고 돌리거나 뒤집어서 꼭 포개지는 모양은 같은 모양으로 세요.",
          items: [T(560, 160, "① 변끼리 꼭 맞게", "blue", 28), T(560, 205, "② 돌리거나 뒤집어 포개지면 같은 모양", "blue", 26)] },
        { say: "삼각형 한 장으로는 한 가지 모양이에요.",
          items: [...triLattice(90, 300, S).shape([["up", 0, 0]]), T(90, 340, "1장: 1가지", "gray", 22)] },
        { say: "두 장은 변끼리 붙이면 마름모 하나예요. 어느 변에 붙여도 돌리면 같은 마름모가 돼요.",
          items: [...triLattice(220, 300, S).shape([["up", 0, 0], ["down", 0, 0]]), T(220, 340, "2장: 1가지", "gray", 22)] },
        { say: "세 장은 마름모에 한 장을 더 붙여요. 어디에 붙여도 돌리면 같은 사다리꼴 모양이 돼요.",
          items: [...triLattice(390, 300, S).shape(TRAP), T(390, 340, "3장: 1가지", "gray", 22)] },
        { say: "네 장은 사다리꼴에 한 장을 더 붙여요. 빠뜨리지 않으려면 사다리꼴의 비어 있는 변마다 하나씩 붙여 봐요. 붙일 곳이 다섯 군데예요.",
          items: [{ kind: "line", x1: 60, y1: 370, x2: 940, y2: 370, color: "gray", width: 2, dash: true }, ...C4.flatMap((c, i) => [...at(i).shape(TRAP, c.add), T(XS[i] + 20, Y2 + 70, c.tag, "ink", 30, "center")])] },
        { say: "가는 위에 붙여서 큰 세모가 됐어요. 나와 다는 양쪽 끝에 붙여서 길쭉한 모양이 됐어요.",
          items: [T(XS[0] + 20, Y2 + 104, "큰 세모", "blue", 20, "center"), T(XS[1] + 20, Y2 + 104, "길쭉", "blue", 20, "center"), T(XS[2] + 20, Y2 + 104, "길쭉", "blue", 20, "center")] },
        { say: "나를 뒤집어 보면 다와 꼭 포개져요. 그러니까 나와 다는 같은 모양이에요. 하나로 세요.",
          items: [{ kind: "arrow", x1: XS[1] + 30, y1: Y2 - 70, x2: XS[2] + 20, y2: Y2 - 70, bend: 26, color: "green", width: 3 }, T((XS[1] + XS[2]) / 2 + 26, Y2 - 112, "뒤집으면 같아요", "green", 20, "center")] },
        { say: "라와 마는 아래에 붙였어요. 라를 뒤집으면 마와 꼭 포개져요. 이것도 같은 모양이에요.",
          items: [{ kind: "arrow", x1: XS[3] + 30, y1: Y2 - 70, x2: XS[4] + 20, y2: Y2 - 70, bend: 26, color: "green", width: 3 }, T((XS[3] + XS[4]) / 2 + 26, Y2 - 112, "뒤집으면 같아요", "green", 20, "center")] },
        { say: `그래서 서로 다른 모양은 가, 나, 라. 네 장으로는 ${KO3(kinds)} 가지예요.`,
          items: [...[0, 1, 3].map((i) => ({ kind: "ring", cx: XS[i] + 20, cy: Y2 + 60, r: 26, color: "gold" })), T(560, 300, `4장: ${kinds}가지`, "green", 32)] },
        { say: "정리해요. 한 장 적은 모양의 빈 변마다 한 장씩 붙여 빠짐없이 만들어요. 그다음 돌리거나 뒤집어 포개지는 것끼리 묶어, 묶음의 수를 세요.", mood: "praise",
          items: [T(560, 250, "빈 변마다 붙이기 → 포개지는 것 묶기", "gold", 24)] },
        { say: "한 문제 풀어 봐요. 삼각형 네 장을 변끼리 붙여 만들 수 있는 서로 다른 모양은 몇 가지일까요?", mood: "think",
          items: [],
          check: { question: "삼각형 4장을 변끼리 붙여 만들 수 있는 서로 다른 모양은 몇 가지일까요?",
            options: ["2가지", `${kinds}가지`, "5가지"], answer: 1,
            hint: "다섯 군데에 붙여 본 뒤, 뒤집어서 포개지는 것끼리 묶어요.", sayHint: "붙일 곳은 다섯 군데지만, 뒤집으면 같은 모양이 두 쌍 있었어요. 묶으면 몇 가지일까요?",
            right: "맞았어요! 큰 세모, 길쭉한 모양, 꺾인 모양 — 세 가지예요.", sayRight: "맞았어요! 다섯 개 가운데 두 쌍이 같은 모양이라 세 가지예요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-04/digital-flip-source": (() => {
    // 두 자리 수를 오른쪽으로 뒤집기: 자리 순서가 바뀌고, 숫자마다 좌우가 바뀐다. 반 바퀴는 순서가 바뀌고 숫자마다 반 바퀴.
    const flipNum = (n, op) => Number([...String(n)].reverse().map((d) => transformDigit(Number(d), op)).join(""));
    const M = 85, mM = flipNum(M, "mirror-left-right"), R = 56, rR = flipNum(R, "rotate-half"), CHK = 52, chk = flipNum(CHK, "rotate-half");
    const H = 74, dig = (x, y, d, color = "blue", op) => ({ kind: "digit", x, y, h: H, on: op ? moveSegs(DIGIT_SEGMENTS[d], op) : DIGIT_SEGMENTS[d], color });
    const two = (x, y, n, color, op) => { const [a, b] = String(n); return [dig(x, y, Number(a), color), dig(x + 56, y, Number(b), color)]; };
    return {
      title: "디지털 숫자를 뒤집고 돌려요",
      kicker: "4권 1단원 · 손글씨 개념",
      beats: [
        { say: "디지털 숫자는 막대 일곱 개로 만들어요. 두 자리 수를 뒤집거나 돌리면, 숫자 모양만이 아니라 자리의 순서도 바뀌어요. 천천히 봐요.",
          items: [title("두 자리 디지털 수 움직이기")] },
        { say: `${jo(M, "를")} 디지털 숫자로 써요. 왼쪽에 8, 오른쪽에 5.`,
          items: [...two(90, 140, M, "blue"), T(90, 250, String(M), "blue", 30)] },
        { say: "오른쪽에 거울을 세우고 비춰요. 거울에서는 왼쪽과 오른쪽이 바뀌어요. 먼저 자리부터 봐요. 왼쪽에 있던 8이 오른쪽으로, 오른쪽에 있던 5가 왼쪽으로 가요.",
          items: [{ kind: "line", x1: 230, y1: 120, x2: 230, y2: 250, color: "gold", width: 3, dash: true }, T(222, 112, "거울", "gold", 20, "center")] },
        { say: "그다음 숫자마다 좌우를 바꿔요. 8은 바꿔도 8. 5는 왼쪽 위 막대가 오른쪽 위로, 오른쪽 아래 막대가 왼쪽 아래로 가서 2가 돼요.",
          items: [dig(260, 140, 5, "red", "mirror-left-right"), dig(316, 140, 8, "red", "mirror-left-right")] },
        { say: `그래서 ${jo(M, "를")} 오른쪽으로 뒤집으면 ${jo(mM, "이에요")}. 순서를 바꾸는 것과 숫자를 바꾸는 것, 두 가지를 다 해야 해요.`,
          items: [T(260, 250, String(mM), "red", 30), T(560, 170, `${M} → 오른쪽으로 뒤집기 → ${mM}`, "red", 28)] },
        { say: `원래 수와 뒤집은 수를 더해 봐요. ${M} 더하기 ${jo(mM, "은")} ${jo(M + mM, "이에요")}.`,
          items: [T(560, 220, `${M} + ${mM} = ${M + mM}`, "blue", 30)] },
        { say: `이번엔 ${jo(R, "을")} 반 바퀴 돌려요. 반 바퀴는 위아래도, 왼쪽 오른쪽도 모두 바뀌어요.`,
          items: [...two(90, 340, R, "blue"), T(90, 450, String(R), "blue", 30)] },
        { say: "자리가 바뀌어요. 왼쪽의 5는 오른쪽으로, 오른쪽의 6은 왼쪽으로 가요.",
          items: [{ kind: "arrow", x1: 200, y1: 470, x2: 270, y2: 470, bend: 0, color: "gold", width: 3 }] },
        { say: "숫자마다 반 바퀴 돌려요. 6을 반 바퀴 돌리면 9. 5를 반 바퀴 돌리면 그대로 5예요.",
          items: [dig(290, 340, 6, "green", "rotate-half"), dig(346, 340, 5, "green", "rotate-half")] },
        { say: `그래서 ${jo(R, "을")} 반 바퀴 돌리면 ${jo(rR, "예요")}. 원래 수와 더하면 ${R} 더하기 ${jo(rR, "는")} ${jo(R + rR, "이에요")}.`,
          items: [T(290, 450, String(rR), "green", 30), T(560, 380, `${R} → 반 바퀴 → ${rR}`, "green", 28), T(560, 430, `${R} + ${rR} = ${R + rR}`, "blue", 30)] },
        { say: "뒤집기와 반 바퀴는 결과가 달라요. 오른쪽으로 뒤집으면 좌우만, 반 바퀴는 위아래와 좌우가 다 바뀌어요. 막대를 하나씩 옮겨 보면 헷갈리지 않아요.",
          items: [T(560, 500, "뒤집기: 좌우만 · 반 바퀴: 위아래와 좌우", "gold", 24)] },
        { say: "정리해요. 두 자리 수는 먼저 자리의 순서를 바꾸고, 그다음 숫자마다 막대를 옮겨요. 숫자가 되지 않는 모양이 나오면 그 수는 만들 수 없어요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 디지털 숫자 ${jo(CHK, "를")} 반 바퀴 돌리면 어떤 수가 될까요?`, mood: "think",
          items: [],
          check: { question: `디지털 숫자 ${jo(CHK, "를")} 반 바퀴 돌리면 어떤 수가 될까요?`,
            options: [String(CHK), String(chk), "55"], answer: 1,
            hint: "자리의 순서가 바뀌고, 숫자마다 반 바퀴 돌려요.", sayHint: `자리가 바뀌니 2가 왼쪽, 5가 오른쪽으로 가요. 2와 5는 반 바퀴 돌려도 그대로예요.`,
            right: `맞았어요! ${CHK} → ${chk}.`, sayRight: `맞았어요! 순서가 바뀌고 2와 5는 그대로라서 ${jo(chk, "가")} 돼요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/flip-rotate-source": (() => {
    const N = 3, SHAPE = [[0, 0], [0, 1], [0, 2], [1, 0]];               // 윗줄 세 칸 + 왼쪽 끝 아래 한 칸(대각선으로 접어도 안 겹치는 모양)
    const quarter = (cells) => cells.map(([r, c]) => [c, N - 1 - r]);   // 시계 방향 반의 반 바퀴
    const C = 40, grid = (x, y, cells, fill = "blue") => [{ kind: "grid", x, y, cols: N, rows: N, cell: C, color: "gray" }, { kind: "cells", x, y, cell: C, cells, fill }];
    const LR = mirrorLR(SHAPE, N), TB = mirrorTB(SHAPE, N), HALF = turnHalf(SHAPE, N, N), Q = quarter(SHAPE);
    const P = { o: [90, 150], lr: [330, 150], tb: [90, 400], half: [330, 400], q: [620, 400] };
    const G = { cols: N, rows: N, cell: 22 };
    return {
      title: "숫자를 돌리고 뒤집어요",
      kicker: "4권 1단원 · 손글씨 개념",
      beats: [
        { say: "모양을 뒤집는 것과 돌리는 것은 달라요. 거울로 뒤집기, 반의 반 바퀴, 반 바퀴를 하나씩 비교해 봐요.",
          items: [title("뒤집기와 돌리기")] },
        { say: "모눈에 처음 모양을 그려요. 윗줄에 세 칸, 그리고 왼쪽 끝 아래에 한 칸이 붙어 있어요. 이 붙은 한 칸을 잘 따라가 봐요.",
          items: [...grid(...P.o, SHAPE), T(P.o[0], P.o[1] - 14, "처음", "gray", 22)] },
        { say: "오른쪽 거울에 비춰요. 왼쪽과 오른쪽만 바뀌고, 위아래는 그대로예요. 붙은 칸이 오른쪽 끝 아래로 가요.",
          items: [{ kind: "line", x1: P.o[0] + N * C + 40, y1: P.o[1] - 10, x2: P.o[0] + N * C + 40, y2: P.o[1] + N * C + 10, color: "gold", width: 3, dash: true }, ...grid(...P.lr, LR, "red"), T(P.lr[0], P.lr[1] - 14, "오른쪽으로 뒤집기", "red", 22)] },
        { say: "왼쪽 거울에 비춰도 결과는 똑같아요. 거울이 오른쪽에 있든 왼쪽에 있든, 바뀌는 것은 왼쪽과 오른쪽이에요.",
          items: [T(560, 190, "왼쪽 거울 = 오른쪽 거울", "gold", 26)] },
        { say: "이번엔 아래 거울이에요. 위와 아래만 바뀌어요. 세 칸이 아랫줄로 내려가고, 붙은 칸은 왼쪽 끝 위에 있어요.",
          items: [{ kind: "line", x1: P.o[0] - 10, y1: P.o[1] + N * C + 40, x2: P.o[0] + N * C + 10, y2: P.o[1] + N * C + 40, color: "gold", width: 3, dash: true }, ...grid(...P.tb, TB, "green"), T(P.tb[0], P.tb[1] - 14, "아래로 뒤집기", "green", 22)] },
        { say: "오른쪽으로 뒤집은 모양을 다시 아래로 뒤집어 봐요. 좌우가 바뀐 다음 위아래도 바뀌어서, 세 칸은 아랫줄, 붙은 칸은 오른쪽 끝 위에 있어요.",
          items: [...grid(...P.half, HALF, "blue"), T(P.half[0], P.half[1] - 14, "오른쪽 → 아래로", "blue", 22)] },
        { say: "처음 모양을 반 바퀴 돌린 것과 똑같아요. 두 번 뒤집으면 반 바퀴 돌린 것과 같아요.",
          items: [T(560, 240, "두 번 뒤집기 = 반 바퀴", "gold", 28)] },
        { say: "시계 방향으로 반의 반 바퀴 돌리면 또 달라요. 윗줄 세 칸이 오른쪽 세로줄로 서고, 붙은 칸은 맨 위 칸의 왼쪽으로 가요. 뒤집은 모양들과 비교해 보세요.",
          items: [...grid(...P.q, Q, "gold"), T(P.q[0], P.q[1] - 14, "반의 반 바퀴(시계 방향)", "gold", 22)] },
        { say: "헷갈리면 붙은 칸 하나만 따라가 보세요. 뒤집으면 거울 건너편으로, 돌리면 가운데를 중심으로 빙 돌아가요.",
          items: [T(560, 300, "붙은 칸 하나만 따라가기", "blue", 26)] },
        { say: "정리해요. 옆 거울은 좌우만, 위아래 거울은 위아래만 바뀌어요. 오른쪽으로 뒤집고 아래로 뒤집으면 반 바퀴 돌린 것과 같아요.", mood: "praise",
          items: [] },
        { say: "한 문제 풀어 봐요. 처음 모양을 오른쪽으로 뒤집은 뒤, 아래로 뒤집으면 어떤 모양이 될까요?", mood: "think",
          items: [],
          check: { question: "처음 모양을 오른쪽으로 뒤집은 뒤 아래로 뒤집은 모양은?",
            options: [{ ...G, cells: LR, fill: "red" }, { ...G, cells: HALF, fill: "blue" }, { ...G, cells: Q, fill: "gold" }], answer: 1,
            hint: "두 번 뒤집으면 반 바퀴 돌린 것과 같아요.", sayHint: "붙은 칸이 오른쪽 끝으로 갔다가, 아래로 뒤집으면 위아래가 바뀌어요. 어디에 있을까요?",
            right: "맞았어요! 세 칸은 아랫줄, 붙은 칸은 오른쪽 끝 위 — 반 바퀴 돌린 모양이에요.", sayRight: "맞았어요! 두 번 뒤집으면 반 바퀴 돌린 것과 같아서, 세 칸이 아랫줄로, 붙은 칸이 오른쪽 끝 위로 가요. 이제 게임으로 가요." } }
      ]
    };
  })()
  ,"book-04/fold-position-source": (() => {
    const L = [["ㄱ", "ㄴ"], ["ㄷ", "ㄹ"]], X0 = 100, Y0 = 150, S = 90;
    const sq = (x, y, s, labels, color = "ink") => [{ kind: "box", x, y, w: 2 * s, h: 2 * s, color }, { kind: "line", x1: x + s, y1: y, x2: x + s, y2: y + 2 * s, color: "gray", width: 2, dash: true }, { kind: "line", x1: x, y1: y + s, x2: x + 2 * s, y2: y + s, color: "gray", width: 2, dash: true }, ...labels.flatMap((row, r) => row.map((t, c) => T(x + (c + 0.5) * s, y + (r + 0.5) * s + 12, t, "blue", 34, "center")))];
    return {
      title: "접은 색종이는 어디일까요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "색종이를 여러 번 접은 뒤 마지막에 맨 아래에 남은 칸이, 처음 색종이의 어느 칸이었는지 찾아요. 넘어가는 쪽과 남는 쪽을 구별하는 게 핵심이에요.",
          items: [title("접은 색종이는 어디?")] },
        { say: "정사각형 색종이를 네 칸으로 나눠 이름을 붙여요. 위 왼쪽 ㄱ, 위 오른쪽 ㄴ, 아래 왼쪽 ㄷ, 아래 오른쪽 ㄹ.",
          items: sq(X0, Y0, S, L) },
        { say: "첫 번째 접기예요. 화살표가 오른쪽을 가리켜요. 화살표 쪽으로 넘어가는 것은 왼쪽 반이에요. 왼쪽 반이 들려서 오른쪽 반 위에 덮여요.",
          items: [{ kind: "arrow", x1: X0 + 30, y1: Y0 - 18, x2: X0 + 2 * S - 30, y2: Y0 - 18, bend: 24, color: "red", width: 3.5 }] },
        { say: "그러면 그 자리에 그대로 남는 쪽은 오른쪽 반이에요. 맨 아래에 깔린 것은 ㄴ과 ㄹ이에요.",
          items: [...sq(X0 + 2 * S + 80, Y0, S / 2 * 2, [["", "ㄴ"], ["", "ㄹ"]], "gray").slice(0, 1), { kind: "box", x: X0 + 2 * S + 80 + S, y: Y0, w: S, h: 2 * S, color: "green" }, T(X0 + 2 * S + 80 + 1.5 * S, Y0 + 0.5 * S + 12, "ㄴ", "green", 34, "center"), T(X0 + 2 * S + 80 + 1.5 * S, Y0 + 1.5 * S + 12, "ㄹ", "green", 34, "center"), T(X0 + 2 * S + 80, Y0 + 2 * S + 36, "남는 쪽: ㄴ, ㄹ", "green", 24)] },
        { say: "두 번째 접기예요. 화살표가 위를 가리켜요. 아래 반이 들려서 위로 넘어가요. 그대로 남는 쪽은 위 반이에요.",
          items: [{ kind: "arrow", x1: X0 + 2 * S + 80 + 2 * S + 26, y1: Y0 + 2 * S - 20, x2: X0 + 2 * S + 80 + 2 * S + 26, y2: Y0 + 20, bend: 0, color: "red", width: 3.5 }] },
        { say: "남아 있던 ㄴ과 ㄹ 가운데 위에 있는 것은 ㄴ이에요. 그래서 마지막까지 그 자리에 남은 칸은 ㄴ이에요.",
          items: [{ kind: "box", x: X0 + 2 * S + 80 + S + 6, y: Y0 + 6, w: S - 12, h: S - 12, color: "red" }, T(560, 450, "첫째: 오른쪽 반 남음 → ㄴ, ㄹ", "blue", 26), T(560, 495, "둘째: 위 반 남음 → ㄴ", "green", 28)] },
        { say: "처음 색종이에 동그라미를 쳐서 확인해요. ㄴ, 위 오른쪽이에요.",
          items: [{ kind: "ring", cx: X0 + 1.5 * S, cy: Y0 + 0.5 * S, r: 36, color: "red" }] },
        { say: "헷갈리지 않게 하는 방법이 있어요. 넘어가는 쪽은 잊고, 접을 때마다 남는 쪽만 남겨 겹쳐 보는 거예요. 두 번 남는 곳이 겹치는 칸이 답이에요.",
          items: [T(70, 450, "남는 쪽 ∩ 남는 쪽", "gold", 30)] },
        { say: "정리해요. 화살표 쪽으로 넘어가는 반은 위로 덮이고, 반대쪽 반은 그 자리에 남아요. 접을 때마다 남는 쪽을 찾고, 남는 쪽끼리 겹친 칸이 마지막 칸이에요.", mood: "praise",
          items: [T(70, 520, "화살표 반대쪽이 남아요!", "gold", 30)] },
        { say: "한 문제 풀어 봐요. 같은 색종이를 먼저 아래쪽 화살표로 접고, 그다음 왼쪽 화살표로 접었어요. 마지막에 남은 칸은 어디일까요?", mood: "think",
          items: [],
          check: { question: "ㄱㄴ/ㄷㄹ 색종이를 ↓ 방향으로 접고, 다시 ← 방향으로 접었어요. 마지막에 남은 칸은?",
            options: ["ㄱ", "ㄷ", "ㄹ"], answer: 2,
            hint: "화살표 반대쪽이 남아요. 아래 화살표면 아래 반, 왼쪽 화살표면 왼쪽…?", sayHint: "아래 화살표는 위 반이 아래로 넘어가요. 남는 쪽은 아래 반, ㄷ과 ㄹ이에요. 왼쪽 화살표는 오른쪽 반이 왼쪽으로 넘어가요. 그럼 남는 쪽은요?",
            right: "맞았어요! 아래 반(ㄷ, ㄹ) 중 오른쪽 반 — ㄹ이에요.", sayRight: "맞았어요! 처음에 아래 반이 남고, 다음엔 오른쪽 반이 남아서 ㄹ이에요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-04/fold-cut-source": (() => {
    const N = 4, NUM = (r, c) => r * N + c + 1, X0 = 90, Y0 = 140, S = 58;
    const cut = [3, 2], afterH = [N - 1 - cut[0], cut[1]], holes = [cut, afterH, [cut[0], N - 1 - cut[1]], [afterH[0], N - 1 - afterH[1]]];
    const total = holes.reduce((a, [r, c]) => a + NUM(r, c), 0);
    const paper = [{ kind: "grid", x: X0, y: Y0, cols: N, rows: N, cell: S, color: "gray" }, ...Array.from({ length: N * N }, (_, i) => T(X0 + (i % N + 0.5) * S, Y0 + (Math.floor(i / N) + 0.5) * S + 9, String(i + 1), "ink", 24, "center"))];
    const hole = ([r, c], color = "#f6dcd3") => ({ kind: "fill", x: X0 + c * S + 4, y: Y0 + r * S + 4, w: S - 8, h: S - 8, fill: color });
    const relabel = ([r, c], color = "red") => T(X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S + 9, String(NUM(r, c)), color, 26, "center");
    const CHK = { cut: [1, 2] }, chk = NUM(CHK.cut[0], N - 1 - CHK.cut[1]);
    return {
      title: "접어 자르고 펼쳐요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "수가 적힌 색종이를 접어서 자른 뒤 펼치면, 어느 칸들이 잘려 나갈까요? 잘린 칸의 수를 모두 더해 봐요.",
          items: [title("접어 자르고 펼쳐요")] },
        { say: "네 칸씩 네 줄, 1부터 16까지 수가 적힌 색종이예요.",
          items: paper },
        { say: "먼저 왼쪽 반을 오른쪽 위로 접어요. 다음에 위 반을 아래로 접어요. 네 겹이 된 오른쪽 아래 네 칸만 보여요.",
          items: [{ kind: "line", x1: X0 + 2 * S, y1: Y0 - 12, x2: X0 + 2 * S, y2: Y0 + N * S + 12, color: "gold", width: 3, dash: true }, { kind: "line", x1: X0 - 12, y1: Y0 + 2 * S, x2: X0 + N * S + 12, y2: Y0 + 2 * S, color: "gold", width: 3, dash: true }, T(560, 170, "① 왼쪽 → 오른쪽  ② 위 → 아래", "gold", 26)] },
        { say: `접힌 종이에서 아래 줄 왼쪽 자리를 잘라요. 네 겹이 한꺼번에 잘려요. 맨 아래 겹, 움직이지 않은 종이로 치면 ${NUM(...cut)}번 칸이에요.`,
          items: [hole(cut), relabel(cut), T(560, 225, `자른 칸: ${NUM(...cut)}`, "red", 28)] },
        { say: "펼치는 것은 접은 순서의 거꾸로예요. 마지막에 접은 위아래 접기부터 펴요. 잘린 자리가 가로 접은 선 건너편, 같은 거리에 하나 더 생겨요.",
          items: [hole(afterH), relabel(afterH), T(560, 280, `위아래 펴기 → ${NUM(...afterH)}`, "red", 26)] },
        { say: "그다음 좌우 접기를 펴요. 지금까지 생긴 두 구멍이 각각 세로 접은 선 건너편에 하나씩 더 생겨요.",
          items: [hole(holes[2]), relabel(holes[2]), hole(holes[3]), relabel(holes[3]), T(560, 330, `좌우 펴기 → ${NUM(...holes[2])}, ${NUM(...holes[3])}`, "red", 26)] },
        { say: `잘린 칸은 모두 네 개예요. ${holes.map(([r, c]) => NUM(r, c)).join(", ")}. 네 겹을 한 번에 잘랐으니 네 칸이 맞아요.`,
          items: [T(560, 385, `${holes.length}겹 → ${holes.length}칸`, "blue", 26)] },
        { say: `수를 더해요. ${jo(holes.map(([r, c]) => NUM(r, c)).join(" 더하기 "), "는")} ${jo(total, "예요")}.`,
          items: [T(560, 440, `${holes.map(([r, c]) => NUM(r, c)).join(" + ")} = ${total}`, "green", 30)] },
        { say: "정리해요. 마지막에 접은 것부터 거꾸로 펴요. 펼 때마다 잘린 자리를 접은 선 건너편 같은 거리에 그려요. 겹 수만큼 칸이 잘렸는지 확인해요.", mood: "praise",
          items: [T(560, 510, "거꾸로 펴기, 선 건너편 같은 거리", "gold", 26)] },
        { say: `한 문제 풀어 봐요. 같은 색종이를 왼쪽 반이 오른쪽 위로 오게 한 번만 접고, ${jo(NUM(...CHK.cut), "이")} 적힌 칸을 잘랐어요. 펼치면 반대쪽에 잘리는 칸의 수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `왼쪽 반을 오른쪽으로 한 번 접고 ${NUM(...CHK.cut)} 칸을 잘랐어요. 펼치면 반대쪽에 잘리는 칸은?`,
            options: [String(chk), String(NUM(...CHK.cut) + 1), String(NUM(...CHK.cut) - N)], answer: 0,
            hint: "세로 접은 선 건너편, 같은 거리의 칸이에요.", sayHint: `${NUM(...CHK.cut)} 칸은 접은 선에서 오른쪽으로 첫째 칸이에요. 선 건너편 왼쪽 첫째 칸에는 어떤 수가 있을까요?`,
            right: `맞았어요! ${NUM(...CHK.cut)}의 반대쪽은 ${chk}.`, sayRight: `맞았어요! 접은 선 건너편 같은 거리에 있는 ${chk}번 칸이 함께 잘려요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/fold-hole-count": (() => {
    const X0 = 90, Y0 = 150, S = 260, F = [X0 + S / 2, Y0 + S / 2];
    const hole = (x, y, color = "red") => ({ kind: "shape", type: "circle", cx: x, cy: y, r: 11, color, fill: color, quick: true });
    const inner = [[F[0] + 60, F[1] + 60]], onLine = [[F[0], F[1] + 80]], center = [F];
    const mirror4 = ([x, y]) => [[x, y], [2 * F[0] - x, y], [x, 2 * F[1] - y], [2 * F[0] - x, 2 * F[1] - y]];
    const uniq = (pts) => [...new Map(pts.map((p) => [p.map((v) => Math.round(v)).join(","), p])).values()];
    const A = uniq(mirror4(inner[0])), B = uniq(mirror4(onLine[0])), C = uniq(mirror4(center[0]));
    return {
      title: "접은 종이의 구멍 수를 세어요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "색종이를 접어서 구멍을 뚫고 펼치면 구멍이 여러 개 생겨요. 그런데 구멍이 접은 선 위에 있으면 개수가 달라져요. 그 차이를 배워요.",
          items: [title("펼친 뒤 구멍 수")] },
        { say: "정사각형 색종이를 반으로 접고, 다시 반으로 접어 네 겹을 만들어요. 펼치면 가로와 세로로 접은 선이 보여요.",
          items: [{ kind: "box", x: X0, y: Y0, w: S, h: S, color: "ink" }, { kind: "line", x1: F[0], y1: Y0, x2: F[0], y2: Y0 + S, color: "gold", width: 2.5, dash: true }, { kind: "line", x1: X0, y1: F[1], x2: X0 + S, y2: F[1], color: "gold", width: 2.5, dash: true }] },
        { say: "접은 선에서 떨어진 안쪽에 구멍 하나를 뚫었어요. 네 겹을 한 번에 뚫었으니, 펼치면 네 군데에 구멍이 생겨요. 접은 선마다 건너편 같은 거리에 하나씩.",
          items: [...A.map(([x, y]) => hole(x, y)), T(560, 180, `안쪽 구멍 → ${A.length}개`, "red", 30)] },
        { say: "이번엔 구멍이 세로 접은 선 위에 있어요. 세로 선으로 펼치면 구멍이 선 위에 있어서, 건너편 자리가 바로 그 자리예요. 겹쳐서 하나로 남아요. 가로 선으로 펼칠 때만 하나 더 생겨요.",
          items: [...B.map(([x, y]) => hole(x, y, "blue")), T(560, 250, `선 위 구멍 → ${B.length}개`, "blue", 30)] },
        { say: "두 접은 선이 만나는 가운데 점에 구멍을 뚫으면 어떨까요? 어느 쪽으로 펼쳐도 같은 자리예요. 펼쳐도 하나뿐이에요.",
          items: [...C.map(([x, y]) => hole(x, y, "green")), T(560, 320, `가운데 구멍 → ${C.length}개`, "green", 30)] },
        { say: "왜 그럴까요? 펼칠 때 구멍은 접은 선 건너편 같은 거리로 옮겨 그려요. 선 위에 있으면 거리가 0이라 제자리예요. 같은 자리에 겹친 구멍은 한 번만 세요.",
          items: [T(560, 390, "선 위 = 거리 0 → 제자리", "gold", 28)] },
        { say: "정리해요. 마지막 접기부터 거꾸로 펴면서 구멍을 접은 선 건너편 같은 거리에 그려요. 선 위나 선이 만나는 점의 구멍은 겹치니 한 번만 세요.", mood: "praise",
          items: [T(560, 450, "겹친 구멍은 한 번만!", "gold", 30)] },
        { say: "한 문제 풀어 봐요. 색종이를 두 번 접어 네 겹으로 만든 뒤, 접은 선 하나 위에 구멍 하나를 뚫었어요. 펼치면 구멍은 몇 개일까요?", mood: "think",
          items: [],
          check: { question: "두 번 접어 네 겹으로 만든 색종이의 접은 선 하나 위에 구멍 1개를 뚫었어요. 펼치면 구멍은 몇 개?",
            options: ["1", String(B.length), "4"], answer: 1,
            hint: "선 위의 구멍은 그 선으로 펼칠 때 제자리에 겹쳐요.", sayHint: "구멍이 있는 선으로 펼칠 때는 늘지 않고, 다른 선으로 펼칠 때만 하나 더 생겨요.",
            right: `맞았어요! ${B.length}개예요.`, sayRight: `맞았어요! 한 번은 제자리에 겹치고 한 번만 늘어서 ${KO3(B.length)} 개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/cube-min-count": (() => {
    const MAP = [[3, 1, 2], [2, 1, 0]], total = sum2(MAP);
    const I = iso(300, 270, 44, 25, 50);
    const tops = MAP.flatMap((row, y) => row.map((n, x) => (n ? [x, y, n] : null)).filter(Boolean));
    const CHK = [[3, 2], [1, 1]], chk = sum2(CHK);
    return {
      title: "쌓기나무의 개수를 세어요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "쌓기나무를 셀 때는 뒤에 가려진 것까지 세어야 해요. 위에서 내려다본 칸마다 몇 층인지 세면, 가려진 것도 빠뜨리지 않아요.",
          items: [title("쌓기나무 세기")] },
        { say: "쌓기나무를 쌓았어요. 앞에 있는 것에 가려서 안 보이는 것도 있어요.",
          items: I.stack(MAP) },
        { say: "하나씩 세면 가려진 것을 빠뜨리기 쉬워요. 그래서 기둥마다 맨 위 쌓기나무에, 그 기둥이 몇 층인지 써요.",
          items: tops.map(([x, y, n]) => I.topLabel(x, y, n, n)) },
        { say: "위에서 내려다본 모양을 옆에 그리고, 칸마다 층수를 옮겨 써요. 빈 자리는 0이에요.",
          items: topGrid(600, 150, MAP) },
        { say: `칸의 수를 모두 더해요. ${jo(MAP.flat().filter(Boolean).join(" 더하기 "), "는")} ${jo(total, "예요")}.`,
          items: [T(600, 300, `${MAP.flat().filter(Boolean).join(" + ")} = ${total}`, "green", 32)] },
        { say: `쌓기나무는 모두 ${total}개예요. 그림에서 보이는 것만 세면 이보다 적게 나와요. 가려진 것까지 센 거예요.`,
          items: [T(600, 350, `모두 ${total}개`, "green", 30)] },
        { say: "이 방법으로 구한 수가 이 그림을 만드는 데 필요한 가장 적은 개수예요. 아래가 비어 있으면 위에 쌓을 수 없으니, 층수만큼은 꼭 있어야 하니까요.",
          items: [T(600, 410, "층수의 합 = 최소 개수", "gold", 28)] },
        { say: "정리해요. 기둥마다 맨 위에 층수를 써요. 위에서 본 칸에 층수를 옮기고, 모두 더해요.", mood: "praise",
          items: [T(600, 470, "맨 위에 층수 → 모두 더하기", "gold", 26)] },
        { say: `한 문제 풀어 봐요. 위에서 본 네 칸의 층수가 ${jo(CHK.flat().join(", "), "이에요")}. 쌓기나무는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `위에서 본 칸의 층수가 ${CHK.flat().join(", ")}일 때 쌓기나무는 모두 몇 개?`,
            options: [String(CHK.flat().length), String(chk), String(chk + 2)], answer: 1,
            hint: "칸마다 적힌 층수를 모두 더해요.", sayHint: `${jo(CHK.flat().join(" 더하기 "), "를")} 계산해 봐요.`,
            right: `맞았어요! ${CHK.flat().join(" + ")} = ${chk}.`, sayRight: `맞았어요! 층수를 모두 더하면 ${jo(chk, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/hidden-cube-count": (() => {
    const MAP = [[3, 2], [2, 1]], total = sum2(MAP);
    const has = (x, y, z) => z >= 0 && y >= 0 && x >= 0 && (MAP[y]?.[x] ?? 0) > z;
    const all = MAP.flatMap((row, y) => row.flatMap((n, x) => Array.from({ length: n }, (_, z) => [x, y, z])));
    const hidden = all.filter(([x, y, z]) => has(x + 1, y, z) && has(x, y + 1, z) && has(x, y, z + 1));
    const seen = total - hidden.length;
    const I = iso(290, 290, 50, 29, 58);
    const CHK = { total: 12, seen: 9 };
    return {
      title: "보이지 않는 쌓기나무를 찾아요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "그림에서 보이지 않는 쌓기나무는 몇 개일까요? 전체 개수를 먼저 구하고, 보이는 개수를 빼면 돼요.",
          items: [title("숨은 쌓기나무 찾기")] },
        { say: "쌓기나무를 그려요. 기둥마다 맨 위에 층수를 써요.",
          items: [...I.stack(MAP), ...MAP.flatMap((row, y) => row.map((n, x) => I.topLabel(x, y, n, n)))] },
        { say: `전체 개수는 층수를 모두 더해요. ${jo(MAP.flat().join(" 더하기 "), "는")} ${jo(total, "이에요")}.`,
          items: [T(560, 170, `전체: ${MAP.flat().join(" + ")} = ${total}`, "blue", 30)] },
        { say: "이번엔 그림에서 보이는 쌓기나무를 하나씩 세어요. 면이 조금이라도 보이면 보이는 거예요. 맨 뒤 기둥은 맨 위 하나만 보여요.",
          items: [T(560, 225, "면이 조금이라도 보이면 셈", "gray", 24)] },
        { say: `오른쪽 기둥 둘, 왼쪽 기둥 둘, 맨 앞 하나, 맨 뒤 꼭대기 하나. 보이는 것은 ${KO3(seen)} 개예요.`,
          items: [T(560, 280, `보이는 것: ${seen}개`, "green", 30)] },
        { say: `보이지 않는 것은 전체에서 보이는 것을 빼요. ${total} 빼기 ${jo(seen, "은")} ${jo(hidden.length, "예요")}.`,
          items: [T(560, 340, `숨은 것: ${total} − ${seen} = ${hidden.length}`, "red", 32)] },
        { say: "어디에 숨어 있을까요? 맨 뒤 기둥의 아래 두 층이에요. 위에도, 앞에도, 옆에도 쌓기나무가 있어서 세 면이 모두 가려졌어요.",
          items: [{ kind: "ring", cx: I.P(0.5, 0.5, 1)[0], cy: I.P(0.5, 0.5, 1)[1] + 20, r: 40, color: "red" }, T(560, 400, "위·앞·옆이 다 막히면 숨어요", "gold", 26)] },
        { say: "정리해요. 층수를 모두 더해 전체를 구해요. 그림에서 보이는 것을 세요. 전체에서 보이는 것을 빼면 숨은 쌓기나무예요.", mood: "praise",
          items: [T(560, 460, "숨은 것 = 전체 − 보이는 것", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 층수를 모두 더하니 ${KO3(CHK.total)} 개, 그림에서 보이는 것은 ${KO3(CHK.seen)} 개예요. 보이지 않는 것은 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `전체 ${CHK.total}개 중 그림에서 보이는 것이 ${CHK.seen}개예요. 보이지 않는 것은?`,
            options: [`${CHK.total - CHK.seen - 1}개`, `${CHK.total - CHK.seen}개`, `${CHK.seen}개`], answer: 1,
            hint: "전체에서 보이는 것을 빼요.", sayHint: `${CHK.total} 빼기 ${jo(CHK.seen, "를")} 계산해요.`,
            right: `맞았어요! ${CHK.total} − ${CHK.seen} = ${CHK.total - CHK.seen}.`, sayRight: `맞았어요! 보이지 않는 쌓기나무는 ${KO3(CHK.total - CHK.seen)} 개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/cube-box-fill": (() => {
    const B = { w: 4, d: 2, h: 3 }, layer = B.w * B.d, all = layer * B.h;
    const placed = [8, 2, 0], put = placed.reduce((a, b) => a + b, 0), need = all - put;
    const C = 34, LX = (i) => 80 + i * 200, LY = 330;
    const floor = (i, n) => [{ kind: "grid", x: LX(i), y: LY, cols: B.w, rows: B.d, cell: C, color: "ink" }, { kind: "cells", x: LX(i), y: LY, cell: C, cells: Array.from({ length: n }, (_, k) => [Math.floor(k / B.w), k % B.w]), fill: "#d8c9a3" }, T(LX(i), LY - 12, `${i + 1}층`, "gray", 22)];
    const I = iso(740, 150, 26, 15, 30), PLACED = [[2, 2, 1, 1], [1, 1, 1, 1]];
    const CHK = { w: 3, d: 3, h: 2, put: 7 }, chkAll = CHK.w * CHK.d * CHK.h;
    return {
      title: "상자의 빈칸을 채워요",
      kicker: "4권 2단원 · 손글씨 개념",
      beats: [
        { say: "상자에 쌓기나무가 몇 개 들어 있어요. 상자를 꽉 채우려면 몇 개가 더 필요할까요? 상자 전체 칸 수부터 구해요.",
          items: [title("상자 채우기")] },
        { say: `상자는 가로 ${KO3(B.w)} 칸, 세로 ${KO3(B.d)} 칸, 높이 ${KO3(B.h)} 층이에요.`,
          items: [...I.stack(PLACED), { kind: "path", d: `M ${I.P(0, 0, 0).join(" ")} L ${I.P(B.w, 0, 0).join(" ")} L ${I.P(B.w, B.d, 0).join(" ")} L ${I.P(0, B.d, 0).join(" ")} Z M ${I.P(0, 0, B.h).join(" ")} L ${I.P(B.w, 0, B.h).join(" ")} L ${I.P(B.w, B.d, B.h).join(" ")} L ${I.P(0, B.d, B.h).join(" ")} Z M ${I.P(B.w, 0, 0).join(" ")} L ${I.P(B.w, 0, B.h).join(" ")} M ${I.P(B.w, B.d, 0).join(" ")} L ${I.P(B.w, B.d, B.h).join(" ")} M ${I.P(0, B.d, 0).join(" ")} L ${I.P(0, B.d, B.h).join(" ")}`, stroke: "gray", width: 2 }, T(80, 160, `가로 ${B.w} · 세로 ${B.d} · 높이 ${B.h}`, "blue", 30)] },
        { say: `한 층에는 몇 칸이 들어갈까요? 가로 ${KO3(B.w)} 칸이 ${KO3(B.d)} 줄, ${B.w} 곱하기 ${jo(B.d, "는")} ${jo(layer, "이에요")}.`,
          items: [T(80, 215, `한 층: ${B.w} × ${B.d} = ${layer}칸`, "blue", 28)] },
        { say: `그런 층이 ${KO3(B.h)} 개예요. ${layer} 곱하기 ${jo(B.h, "은")} ${all}. 상자 전체는 ${all}칸이에요.`,
          items: [T(80, 265, `전체: ${layer} × ${B.h} = ${all}칸`, "blue", 30)] },
        { say: `층마다 이미 놓인 쌓기나무를 표에 그려요. 1층은 꽉 차서 ${KO3(placed[0])} 개, 2층은 ${KO3(placed[1])} 개, 3층은 비어 있어요.`,
          items: placed.flatMap((n, i) => floor(i, n)) },
        { say: `놓인 것은 모두 ${placed.join(" 더하기 ")}, ${put}개예요.`,
          items: [T(80, 460, `놓인 것: ${placed.join(" + ")} = ${put}`, "green", 28)] },
        { say: `더 필요한 것은 전체에서 놓인 것을 빼요. ${all} 빼기 ${jo(put, "은")} ${jo(need, "예요")}.`,
          items: [T(80, 510, `더 필요: ${all} − ${put} = ${need}`, "red", 32)] },
        { say: `층마다 확인해도 돼요. 1층은 0개, 2층은 ${layer - placed[1]}개, 3층은 ${layer}개. 더하면 ${need}. 같아요.`,
          items: [T(600, 510, `0 + ${layer - placed[1]} + ${layer} = ${need} ✓`, "green", 26)] },
        { say: "정리해요. 가로와 세로를 곱해 한 층의 칸 수를, 거기에 높이를 곱해 전체 칸 수를 구해요. 전체에서 이미 놓인 수를 빼면 더 필요한 수예요.", mood: "praise",
          items: [T(80, 565, "가로 × 세로 × 높이 − 놓인 것", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 가로 ${KO3(CHK.w)} 칸, 세로 ${KO3(CHK.d)} 칸, 높이 ${KO3(CHK.h)} 층인 상자에 쌓기나무 ${KO3(CHK.put)} 개가 들어 있어요. 몇 개를 더 넣어야 꽉 찰까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.w} × ${CHK.d} × ${CHK.h} 상자에 쌓기나무 ${CHK.put}개가 있어요. 몇 개 더 넣어야 꽉 찰까요?`,
            options: [String(CHK.put), String(chkAll - CHK.put), String(chkAll)], answer: 1,
            hint: "전체 칸 수를 먼저 구하고, 놓인 수를 빼요.", sayHint: `한 층은 ${CHK.w} 곱하기 ${jo(CHK.d, "은")} ${CHK.w * CHK.d}, 두 층이면 ${jo(chkAll, "이에요")}. 거기서 ${jo(CHK.put, "을")} 빼요.`,
            right: `맞았어요! ${chkAll} − ${CHK.put} = ${chkAll - CHK.put}.`, sayRight: `맞았어요! 전체 ${chkAll}칸에서 ${KO3(CHK.put)} 개를 빼면 ${jo(chkAll - CHK.put, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-04/compare-order-source": (() => {
    const REL = [["가", "나", 5], ["다", "가", -3]];      // 가 = 나 + 5, 다 = 가 − 3
    const v = { 나: 10 }; v.가 = v.나 + 5; v.다 = v.가 - 3;
    const order = Object.entries(v).sort((a, b) => a[1] - b[1]).map(([k]) => k);
    const X = (n) => 120 + (n - 6) * 34, NY = 440;
    const CHK = { a: 4, b: 6 };   // 라 = 마 − 4, 바 = 마 + 6 → 바 > 마 > 라
    return {
      title: "크기를 비교해 순서를 정해요",
      kicker: "4권 3단원 · 손글씨 개념",
      beats: [
        { say: "가, 나, 다가 무슨 수인지는 몰라도, 누가 누구보다 얼마나 큰지만 알면 크기 순서를 정할 수 있어요.",
          items: [title("크기 순서 정하기")] },
        { say: "첫 번째 식이에요. 가는 나에 5를 더한 수예요. 그러니까 가가 나보다 5 커요.",
          items: [T(80, 160, "가 = 나 + 5", "blue", 38), T(420, 160, "→ 가가 나보다 5 커요", "gray", 26)] },
        { say: "두 번째 식이에요. 다는 가에서 3을 뺀 수예요. 다가 가보다 3 작아요.",
          items: [T(80, 220, "다 = 가 − 3", "blue", 38), T(420, 220, "→ 다가 가보다 3 작아요", "gray", 26)] },
        { say: `정해진 값이 없을 때는, 한 글자에 아무 수나 넣어 봐도 돼요. 나에 ${jo(v.나, "을")} 넣어 볼게요.`,
          items: [T(80, 290, `나 = ${v.나}  (아무 수나)`, "gold", 30)] },
        { say: `그러면 가는 ${v.나} 더하기 5, ${jo(v.가, "예요")}. 다는 ${v.가} 빼기 3, ${jo(v.다, "예요")}.`,
          items: [T(80, 340, `가 = ${v.나} + 5 = ${v.가},  다 = ${v.가} − 3 = ${v.다}`, "blue", 30)] },
        { say: "수직선에 놓아 보면 순서가 한눈에 보여요.",
          items: [{ kind: "line", x1: X(8), y1: NY, x2: X(17), y2: NY, color: "ink", width: 3 }, ...Object.entries(v).flatMap(([k, n]) => [{ kind: "line", x1: X(n), y1: NY - 12, x2: X(n), y2: NY + 12, color: "ink", width: 3 }, T(X(n), NY + 42, String(n), "gray", 24, "center"), T(X(n), NY - 24, k, "red", 32, "center")])] },
        { say: `작은 것부터 ${order.join(", ")}. 다른 수를 넣어도 순서는 똑같아요. 나에 20을 넣으면 가는 25, 다는 22. 여전히 나가 가장 작아요.`,
          items: [T(620, 440, `작은 것부터: ${order.join(" < ")}`, "green", 30), T(620, 490, "나 = 20 → 가 25, 다 22  (같은 순서)", "gray", 22)] },
        { say: "정리해요. 식을 누가 누구보다 얼마나 큰지로 읽어요. 한 글자에 아무 수나 넣고 나머지를 차례로 구해요. 늘어놓아 순서를 정하고, 처음 식에 다시 넣어 확인해요.", mood: "praise",
          items: [T(620, 550, "아무 수나 넣고 차례로!", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 라는 마보다 ${CHK.a} 작고, 바는 마보다 ${CHK.b} 커요. 가장 큰 것은 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `라 = 마 − ${CHK.a}, 바 = 마 + ${CHK.b}일 때 가장 큰 것은?`,
            options: ["라", "마", "바"], answer: 2,
            hint: "마에 아무 수나 넣어 라와 바를 구해요.", sayHint: `마에 10을 넣어 봐요. 라는 10 빼기 ${CHK.a}, 바는 10 더하기 ${CHK.b}. 누가 가장 클까요?`,
            right: "맞았어요! 라 < 마 < 바, 가장 큰 것은 바예요.", sayRight: "맞았어요! 마가 10이면 라는 6, 바는 16이라 바가 가장 커요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-04/compare-difference-source": (() => {
    // 다온이는 서준이보다 6살 많고, 하율이는 서준이보다 2살 적다 → 다온과 하율의 차이
    const D = 6, H = 2, base = 10, d = base + D, h = base - H, diff = d - h;
    const X = (n) => 110 + (n - 4) * 34, NY = 420;
    const CHK = { a: 9, b: 4 };   // 가 = 다 + 9, 나 = 다 + 4 → 가와 나의 차이 5
    return {
      title: "수의 크기 차이를 구해요",
      kicker: "4권 3단원 · 손글씨 개념",
      beats: [
        { say: "두 사람의 나이를 직접 비교한 말이 없어도, 같은 사람과 비교한 말이 있으면 둘의 차이를 구할 수 있어요.",
          items: [title("두 값의 차이 구하기")] },
        { say: `다온이는 서준이보다 ${KO3(D)} 살 많아요. 하율이는 서준이보다 ${KO3(H)} 살 적어요. 다온이와 하율이는 몇 살 차이일까요?`,
          items: [T(80, 160, `다온 = 서준 + ${D}`, "blue", 32), T(80, 210, `하율 = 서준 − ${H}`, "blue", 32)] },
        { say: "두 말 모두 서준이와 비교했어요. 서준이가 가운데에서 두 말을 이어 줘요.",
          items: [T(400, 188, "← 둘 다 서준이와 비교", "gold", 24)] },
        { say: `서준이 나이를 모르니 아무 수나 넣어요. 서준이를 ${base}살로 해 볼게요. 다온이는 ${base} 더하기 ${D}, ${d}살. 하율이는 ${base} 빼기 ${H}, ${h}살.`,
          items: [T(80, 280, `서준 = ${base} → 다온 ${d}, 하율 ${h}`, "gold", 30)] },
        { say: `둘의 차이는 ${d} 빼기 ${jo(h, "은")} ${jo(diff, "이에요")}.`,
          items: [T(80, 335, `${d} − ${h} = ${diff}`, "green", 34)] },
        { say: `수직선으로 보면 더 잘 보여요. 서준이에서 오른쪽으로 ${D}칸 가면 다온, 왼쪽으로 ${H}칸 가면 하율. 둘 사이는 ${D} 더하기 ${H}, ${diff}칸이에요.`,
          items: [{ kind: "line", x1: X(6), y1: NY, x2: X(18), y2: NY, color: "ink", width: 3 }, ...[["하율", h, "blue"], ["서준", base, "gray"], ["다온", d, "red"]].flatMap(([k, n, c]) => [{ kind: "line", x1: X(n), y1: NY - 12, x2: X(n), y2: NY + 12, color: "ink", width: 3 }, T(X(n), NY - 22, k, c, 26, "center"), T(X(n), NY + 40, String(n), "gray", 22, "center")]),
            { kind: "arrow", x1: X(base), y1: NY + 60, x2: X(d), y2: NY + 60, color: "red", width: 2.5 }, T((X(base) + X(d)) / 2, NY + 90, `+${D}`, "red", 22, "center"), { kind: "arrow", x1: X(base), y1: NY + 60, x2: X(h), y2: NY + 60, color: "blue", width: 2.5 }, T((X(base) + X(h)) / 2, NY + 90, `−${H}`, "blue", 22, "center")] },
        { say: `서준이를 다른 나이로 해도 차이는 같아요. 서준이가 20살이면 다온이는 26살, 하율이는 18살. 26 빼기 18도 ${jo(diff, "이에요")}.`,
          items: [T(620, 335, `서준 20 → 26 − 18 = ${diff} ✓`, "green", 26)] },
        { say: "한쪽은 더 많고 한쪽은 더 적으면, 두 차이를 더해요. 둘 다 더 많거나 둘 다 더 적으면, 두 차이를 빼요.",
          items: [T(620, 160, "반대쪽 → 차이를 더하기", "gold", 26), T(620, 210, "같은 쪽 → 차이를 빼기", "gold", 26)] },
        { say: "정리해요. 같은 사람과 비교한 말끼리 이어요. 그 사람에 아무 수나 넣어 두 값을 구하고 빼요. 다른 수를 넣어도 차이는 같아요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 가는 다보다 ${CHK.a} 크고, 나는 다보다 ${CHK.b} 커요. 가와 나의 차이는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `가 = 다 + ${CHK.a}, 나 = 다 + ${CHK.b}일 때 가와 나의 차이는?`,
            options: [String(CHK.a + CHK.b), String(CHK.a - CHK.b), String(CHK.b)], answer: 1,
            hint: "둘 다 다보다 커요. 같은 쪽이니 차이를 빼요.", sayHint: `다에 10을 넣으면 가는 ${10 + CHK.a}, 나는 ${10 + CHK.b}. 둘을 빼 봐요.`,
            right: `맞았어요! ${CHK.a} − ${CHK.b} = ${CHK.a - CHK.b}.`, sayRight: `맞았어요! 둘 다 다보다 크니까 ${CHK.a} 빼기 ${jo(CHK.b, "는")} ${jo(CHK.a - CHK.b, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/balance-equality-source": (() => {
    // 동그라미 3 + 세모 1 = 세모 7  → 세모를 하나씩 지우면 동그라미 3 = 세모 6 → 동그라미 1 = 세모 2
    const S = scaleEq(500, 210, [...rep("circle", 3), "triangle"], rep("triangle", 7));
    const S2 = scaleEq(500, 430, rep("circle", 3), rep("triangle", 6));
    const CHK = { a: 2, b: 1, r: 7 };   // 별 2 + 세모 1 = 세모 7 → 별 1 = 세모 3
    return {
      title: "양쪽에서 같은 것을 지워요",
      kicker: "4권 3단원 · 손글씨 개념",
      beats: [
        { say: "평형인 저울의 양쪽에서 똑같은 것을 똑같이 빼도, 저울은 그대로 평형이에요. 이걸 이용하면 한 개의 무게를 찾을 수 있어요.",
          items: [title("양쪽에서 같은 것 지우기")] },
        { say: "저울이 평형이에요. 왼쪽에는 동그라미 세 개와 세모 한 개, 오른쪽에는 세모 일곱 개.",
          items: S.items },
        { say: "양쪽에 똑같이 있는 것을 찾아요. 세모가 양쪽에 다 있어요.",
          items: [T(80, 160, "양쪽에 다 있는 것: 세모", "gold", 28)] },
        { say: "왼쪽 세모 한 개를 지우면, 오른쪽에서도 세모 한 개를 지워요. 똑같이 빼야 평형이 그대로예요.",
          items: [...S.erase("left", [3]), ...S.erase("right", [6])] },
        { say: "남은 것을 다시 그려요. 동그라미 세 개가 세모 여섯 개와 같아요.",
          items: S2.items },
        { say: "동그라미 세 개가 세모 여섯 개면, 동그라미 하나는? 세모 여섯 개를 세 묶음으로 똑같이 나눠요. 한 묶음에 두 개씩이에요.",
          items: [T(80, 380, "○ 3개 = △ 6개", "blue", 30), T(80, 430, "6 ÷ 3 = 2", "blue", 30)] },
        { say: "그래서 동그라미 한 개는 세모 두 개와 무게가 같아요.",
          items: [T(80, 490, "○ 1개 = △ 2개", "green", 36)] },
        { say: "처음 저울에 넣어 확인해요. 동그라미 세 개는 세모 여섯 개, 거기에 세모 하나를 더하면 세모 일곱 개. 오른쪽과 같아요.",
          items: [T(80, 545, "6 + 1 = 7 ✓", "green", 30)] },
        { say: "정리해요. 양쪽에 똑같이 있는 것을 같은 수만큼 지워요. 남은 것끼리 비교해서, 한 개가 몇 개와 같은지 똑같이 나눠 구해요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 별 ${KO3(CHK.a)} 개와 세모 ${KO3(CHK.b)} 개가 세모 ${KO3(CHK.r)} 개와 평형이에요. 별 한 개는 세모 몇 개와 같을까요?`, mood: "think",
          items: [],
          check: { question: `☆ ${CHK.a}개 + △ ${CHK.b}개 = △ ${CHK.r}개일 때 ☆ 1개는 △ 몇 개?`,
            options: [String((CHK.r - CHK.b) / CHK.a - 1), String((CHK.r - CHK.b) / CHK.a), String(CHK.r - CHK.b)], answer: 1,
            hint: "양쪽에서 세모 한 개씩 지우고, 남은 것을 나눠요.", sayHint: `세모 하나씩 지우면 별 두 개가 세모 ${KO3(CHK.r - CHK.b)} 개예요. 둘로 똑같이 나눠요.`,
            right: `맞았어요! ☆ 2개 = △ ${CHK.r - CHK.b}개, ☆ 1개 = △ ${(CHK.r - CHK.b) / CHK.a}개.`, sayRight: `맞았어요! 별 한 개는 세모 ${KO3((CHK.r - CHK.b) / CHK.a)} 개와 같아요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-04/balance-substitution": (() => {
    // 저울1: 세모 1 = 네모 3. 저울2: 동그라미 1 = 세모 2 + 네모 1 → 동그라미 = 네모 7
    const A = scaleEq(260, 180, ["triangle"], rep("square", 3), 14, 30);
    const B = scaleEq(260, 400, ["circle"], ["triangle", "triangle", "square"], 14, 30);
    const tri = 3, cir = 2 * tri + 1;
    const CHK = { star: 2, tri: 1, sq: 2 };   // 세모 1 = 네모 2, 별 1 = 세모 2 → 별 = 네모 4
    return {
      title: "도형을 바꾸어 넣어요",
      kicker: "4권 3단원 · 손글씨 개념",
      beats: [
        { say: "저울이 두 개 있어요. 첫 저울에서 알게 된 무게를, 둘째 저울에 바꾸어 넣어 풀어요.",
          items: [title("바꾸어 넣기")] },
        { say: "첫째 저울이에요. 세모 한 개가 네모 세 개와 평형이에요. 세모 하나는 네모 셋과 무게가 같아요.",
          items: [...A.items, T(560, 180, "△ 1 = □ 3", "blue", 32)] },
        { say: "둘째 저울이에요. 동그라미 한 개가 세모 두 개와 네모 한 개와 평형이에요. 동그라미는 네모 몇 개와 같을까요?",
          items: [...B.items, T(560, 400, "○ 1 = △ 2 + □ 1", "blue", 32)] },
        { say: "세모를 네모로 바꾸어 넣어요. 첫째 저울에서 세모 하나는 네모 셋이었어요. 세모 두 개는 네모 셋이 두 번, 여섯 개예요.",
          items: [...B.erase("right", [0, 1]), T(560, 450, `△ 2 = □ ${2 * tri}`, "red", 28)] },
        { say: `둘째 저울의 오른쪽은 네모 여섯 개에 원래 있던 네모 한 개를 더해서 네모 ${KO3(cir)} 개예요.`,
          items: [T(560, 500, `○ 1 = □ ${2 * tri} + □ 1 = □ ${cir}`, "green", 30)] },
        { say: `그래서 동그라미 한 개는 네모 ${KO3(cir)} 개와 같아요.`,
          items: [T(560, 550, `○ = □ ${cir}개`, "green", 34)] },
        { say: "같은 무게끼리는 저울 위에서 서로 바꿔 놓아도 평형이 그대로예요. 그래서 모르는 도형을 아는 도형으로 바꿔 갈 수 있어요.",
          items: [T(560, 240, "같은 무게끼리는 바꿔 놓기", "gold", 26)] },
        { say: "정리해요. 한 저울에서 한 도형이 다른 도형 몇 개와 같은지 찾아요. 다음 저울의 그 도형을 그만큼으로 바꾸어 넣어요. 마지막에 한 가지 도형으로 세어요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 세모 한 개는 네모 ${KO3(CHK.sq)} 개와 같고, 별 한 개는 세모 ${KO3(CHK.star)} 개와 같아요. 별 한 개는 네모 몇 개와 같을까요?`, mood: "think",
          items: [],
          check: { question: `△ 1 = □ ${CHK.sq}, ☆ 1 = △ ${CHK.star}일 때 ☆ 1개는 □ 몇 개?`,
            options: [String(CHK.sq + CHK.star), String(CHK.sq * CHK.star), String(CHK.sq)], answer: 1,
            hint: "별 안의 세모를 네모로 바꾸어 넣어요.", sayHint: `별은 세모 ${KO3(CHK.star)} 개예요. 세모 하나가 네모 ${KO3(CHK.sq)} 개니까, 세모 ${KO3(CHK.star)} 개는 네모 몇 개일까요?`,
            right: `맞았어요! ☆ = △ ${CHK.star} = □ ${CHK.sq * CHK.star}.`, sayRight: `맞았어요! 세모 두 개를 네모로 바꾸면 네모 ${KO3(CHK.sq * CHK.star)} 개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()
};

function KO3(n) { return { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열", 11: "열한", 12: "열두" }[n] || String(n); }
