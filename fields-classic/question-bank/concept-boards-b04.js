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
};

function KO3(n) { return { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯" }[n] || String(n); }
