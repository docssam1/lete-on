// 손글씨 판서 대본. 한 비트 = 독쌤 말 한 마디 + 칠판에 새로 그리는 것 한두 개.
// 원장 2026-10-25 「대본은 간단히 말고 천천히 충분히 자세히」 — 한 단계를 여러 비트로 나눠 천천히 간다(세는 것은 하나씩 센다).
// 글은 우리가 쓴 것(골든벨 원문을 베끼지 않는다). 확인 문제의 정답은 아래 규칙 함수로 계산하고, 골든벨 정답 DB는 쓰지 않는다.
// 좌표는 1000×600 칠판 기준. 시계 숫자 n의 자리는 concept-board.js의 clockPoint가 계산한다.

import { jo, landing, mirrorLR, mirrorTB, turnHalf, DIGIT_SEGMENTS, SEGMENT_MAPS, moveSegs, readDigit, transformDigit, segGeom, segMid } from "./concept-board-kit.js?v=20261025f";
import { BOARDS_B02 } from "./concept-boards-b02.js?v=20261025g";
import { BOARDS_B03 } from "./concept-boards-b03.js?v=20261025e";
import { BOARDS_B04 } from "./concept-boards-b04.js?v=20261025e";
import { BOARDS_B05 } from "./concept-boards-b05.js?v=20261026b";
import { BOARDS_B06 } from "./concept-boards-b06.js?v=20261026e";
import { BOARDS_B07 } from "./concept-boards-b07.js?v=20261026f";
export { jo, landing, mirrorLR, mirrorTB, turnHalf, DIGIT_SEGMENTS, SEGMENT_MAPS, moveSegs, readDigit, transformDigit, segGeom, segMid };

// 독쌤 음성 파일의 줄 id. 내보내기(tools/export-board-voice.mjs)와 재생(concept-board.js → study.js)이 같은 규칙을 쓴다.
//   비트 n번째 말 → fcb-<판서>-bNN · 확인 문제의 힌트/정답/공개 말 → fcb-<판서>-hint|right|reveal
export const lineId = (boardKey, kind, n = 0) => `fcb-${boardKey.replace(/[^a-z0-9]+/gi, "-")}-${kind === "b" ? `b${String(n).padStart(2, "0")}` : kind}`;

const CLOCK = { cx: 300, cy: 345, r: 170 };
const numAt = (n, rr = CLOCK.r - 38) => ({ cx: CLOCK.cx + rr * Math.sin((n * 30 * Math.PI) / 180), cy: CLOCK.cy - rr * Math.cos((n * 30 * Math.PI) / 180) });
const ringAt = (n, color) => ({ kind: "ring", ...numAt(n), r: 24, color });

const shape = [[0, 0], [1, 0], [2, 0], [2, 1]];   // 처음 모양(왼쪽 줄 세 칸 + 맨 아랫줄 가운데 한 칸): 좌우·위아래·반 바퀴가 모두 다른 모양이 된다
const G = { cols: 3, rows: 3, cell: 56 };
const L = { x: 110, y: 120 }, R = { x: 358, y: 120 }, D = { x: 110, y: 390 };   // 처음 모양 · 오른쪽 거울 건너편 · 아래 거울 건너편
const center = (g, r, c) => [g.x + (c + 0.5) * G.cell, g.y + (r + 0.5) * G.cell];

export const BOARDS = {
  "book-01/clock-turning": {
    title: "시계 바늘을 돌려요",
    kicker: "1권 1단원 · 손글씨 개념",
    beats: [
      { say: "오늘은 시계 바늘을 돌려 볼 거예요. 바늘을 돌리면 어디를 가리키게 되는지, 천천히 하나씩 알아봐요.",
        items: [{ kind: "text", x: 60, y: 86, text: "시계 바늘을 돌려요", size: 58 }] },
      { say: "먼저 시계판을 그려요. 시계판에는 1부터 12까지 숫자가 빙 둘러 있어요. 12가 맨 위, 6이 맨 아래예요.",
        items: [{ kind: "clock", ...CLOCK }] },
      { say: "회색 바늘을 2에 놓아요. 여기가 출발이에요. 바늘은 가운데에 꽂혀 있어서, 끝만 빙 돌아요.",
        items: [{ kind: "hand", ...CLOCK, to: 2, color: "gray" }, { kind: "text", x: 60, y: 560, text: "출발: 2", size: 34, color: "gray" }] },
      { say: "돌리는 방향부터 정해요. 1, 2, 3, 이렇게 숫자가 커지는 쪽으로 도는 것을 시계 방향이라고 해요. 시계 바늘이 평소에 도는 방향이에요.",
        items: [{ kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 240, from: 12, to: 3, color: "gray" }, { kind: "text", x: 560, y: 104, text: "시계 방향 = 숫자가 커지는 쪽", size: 30, color: "gray" }] },
      { say: "이제 한 바퀴를 돌려 봐요. 2에서 출발해서 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1을 지나 다시 2까지. 시계판을 한 바퀴 빙 돌아요.",
        items: [{ kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 205, from: 2, to: 2, color: "gold", dash: true }] },
      { say: "한 바퀴를 다 돌면 어디일까요? 출발했던 자리, 바로 2예요. 한 바퀴를 돌면 언제나 처음 자리로 돌아와요.",
        items: [{ kind: "text", x: 560, y: 180, text: "한 바퀴 → 처음 자리 2", size: 40, color: "gold" }] },
      { say: "이번에는 반 바퀴예요. 한 바퀴의 절반이에요. 2에서 가운데를 지나 똑바로 건너편으로 가면 8이 있어요. 이렇게 마주 보는 자리를 맞은편이라고 해요.",
        items: [{ kind: "line", x1: numAt(2, CLOCK.r - 10).cx, y1: numAt(2, CLOCK.r - 10).cy, x2: numAt(8, CLOCK.r - 10).cx, y2: numAt(8, CLOCK.r - 10).cy, color: "gray", width: 2.5, dash: true }] },
      { say: "2에서 시계 방향으로 반 바퀴 돌려요. 3, 4, 5, 6, 7을 지나서 8에 도착해요. 시계판의 절반을 돌았어요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, 2), color: "red" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 205, from: 2, to: landing(2, 2), color: "red" }] },
      { say: "반 바퀴를 돌면 맞은편이에요. 2의 맞은편은 8. 숫자로는 여섯 칸을 간 거예요.",
        items: [{ kind: "text", x: 560, y: 260, text: `반 바퀴 → 맞은편 ${landing(2, 2)}`, size: 40, color: "red" }] },
      { say: "다음은 반의 반 바퀴예요. 반 바퀴의 또 절반이에요. 2에서 시계 방향으로 숫자를 하나씩 세어 봐요. 3, 4, 5. 세 칸이에요.",
        items: [ringAt(3, "blue"), ringAt(4, "blue"), ringAt(5, "blue")] },
      { say: "반의 반 바퀴를 돌리면 세 칸을 가요. 2에서 세 칸 가면 5예요. 시계판을 네 조각으로 나눈 것 중 한 조각만큼 돌았어요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, 1), color: "blue" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 225, from: 2, to: landing(2, 1), color: "blue" }, { kind: "text", x: 560, y: 340, text: `반의 반 바퀴 → 세 칸, ${landing(2, 1)}`, size: 40, color: "blue" }] },
      { say: "이번에는 반대 방향이에요. 숫자가 작아지는 쪽으로 돌아요. 시계 반대 방향이라고 해요.",
        items: [{ kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 240, from: 12, to: 9, ccw: true, color: "gray" }, { kind: "text", x: 560, y: 494, text: "반대 방향 = 숫자가 작아지는 쪽", size: 30, color: "gray" }] },
      { say: "2에서 시계 반대 방향으로 반의 반 바퀴, 세 칸을 가요. 1, 12, 11. 11에 도착해요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, -1), color: "green" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 225, from: 2, to: landing(2, -1), ccw: true, color: "green" }, { kind: "text", x: 560, y: 420, text: `반대로 세 칸 → ${landing(2, -1)}`, size: 40, color: "green" }] },
      { say: "비교해 봐요. 똑같이 세 칸인데, 시계 방향이면 5, 반대 방향이면 11이에요. 그래서 돌리기 전에 꼭 방향부터 확인해요.", mood: "think",
        items: [{ kind: "text", x: 560, y: 540, text: "같은 세 칸 → 방향이 다르면 5와 11", size: 32 }] },
      { say: "정리해요. 한 바퀴는 처음 자리. 반 바퀴는 맞은편, 여섯 칸. 반의 반 바퀴는 세 칸. 그리고 돌리기 전에 방향을 먼저 봐요.", mood: "praise",
        items: [{ kind: "box", x: 540, y: 130, w: 420, h: 320, color: "gold" }] },
      { say: "한 번만 더 해 볼게요. 9에서 시계 방향으로 반의 반 바퀴면 어디일까요? 세 칸을 세어요. 10, 11, 12. 12예요.",
        items: [{ kind: "text", x: 560, y: 585, text: `9에서 세 칸: 10, 11, ${landing(9, 1)}`, size: 30, color: "blue" }] },
      { say: "이제 한 문제 풀어 봐요. 3을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디일까요? 반 바퀴는 맞은편이었죠. 시계판을 보고 골라요.", mood: "think",
        items: [],
        check: { question: "3을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어떤 수를 가리킬까요?",
          options: [String(landing(3, 1)), String(landing(3, 2)), String(landing(3, 4))], answer: 1,
          hint: "반 바퀴는 맞은편이에요. 3의 맞은편을 찾아요.", sayHint: "반 바퀴는 맞은편이에요. 3에서 가운데를 지나 똑바로 건너편에 있는 숫자가 무엇인지 시계판에서 찾아요.",
          right: "맞았어요! 반 바퀴는 맞은편, 3의 맞은편은 9예요.", sayRight: "맞았어요! 3에서 4, 5, 6, 7, 8을 지나 9. 3의 맞은편은 9예요. 이제 게임으로 손에 익혀 봐요." } }
    ]
  },

  "book-01/mirror-reflection": {
    title: "거울에 비친 모양을 찾아요",
    kicker: "1권 1단원 · 손글씨 개념",
    beats: [
      { say: "거울에 비친 모양은 어떻게 생겼을까요? 칸 하나하나 천천히 따라가며 알아봐요.",
        items: [{ kind: "text", x: 60, y: 76, text: "거울에 비친 모양을 찾아요", size: 54 }] },
      { say: "먼저 모눈을 그려요. 가로로 세 칸, 세로로 세 줄이에요.",
        items: [{ kind: "grid", ...L, ...G }, { kind: "text", x: L.x + 48, y: 330, text: "처음 모양", size: 30, color: "gray" }] },
      { say: "파란 칸을 칠해요. 왼쪽 줄에 위에서부터 한 칸, 두 칸, 세 칸. 그리고 맨 아랫줄 가운데에 한 칸 더. 이게 처음 모양이에요.",
        items: [{ kind: "cells", ...L, cell: G.cell, cells: shape, fill: "blue" }] },
      { say: "모양의 오른쪽에 거울을 세워요. 노란 점선이 거울이에요. 거울은 자기 앞에 있는 것을 건너편에 똑같은 거리로 비춰요.",
        items: [{ kind: "line", x1: 318, y1: 100, x2: 318, y2: 320, color: "gold", width: 5, dash: true }, { kind: "text", x: 318, y: 350, text: "오른쪽 거울", size: 28, color: "gold", align: "center" }] },
      { say: "거울 건너편에 똑같은 모눈을 그려요. 여기에 거울에 비친 모양을 그릴 거예요.",
        items: [{ kind: "grid", ...R, ...G }] },
      { say: "거울에 가장 가까운 칸부터 봐요. 맨 아랫줄 가운데 칸이에요. 거울을 건너면 거울에서 똑같은 거리, 그러니까 건너편에서도 가운데 칸에 비쳐요. 줄은 그대로 맨 아랫줄이에요.",
        items: [{ kind: "arrow", x1: center(L, 2, 1)[0] + 20, y1: center(L, 2, 1)[1], x2: center(R, 2, 1)[0] - 20, y2: center(R, 2, 1)[1], color: "red" }, { kind: "cells", ...R, cell: G.cell, cells: [[2, 1]], fill: "red" }] },
      { say: "거울에서 멀리 있던 왼쪽 줄 세 칸은, 건너편에서도 거울에서 멀리, 오른쪽 끝 줄에 비쳐요. 위에서부터 한 칸, 두 칸, 세 칸. 줄은 그대로예요.",
        items: [{ kind: "arrow", x1: center(L, 0, 0)[0], y1: center(L, 0, 0)[1] - 22, x2: center(R, 0, 2)[0], y2: center(R, 0, 2)[1] - 22, bend: 60, color: "red" }, { kind: "cells", ...R, cell: G.cell, cells: [[0, 2], [1, 2], [2, 2]], fill: "red" }] },
      { say: "완성이에요. 옆에 세운 거울은 왼쪽과 오른쪽만 바꿔요. 위아래 높이는 그대로예요.",
        items: [{ kind: "text", x: 560, y: 150, text: "좌우만 바뀜, 높이 그대로", size: 38, color: "red" }] },
      { say: "이번에는 처음 모양의 아래에 거울을 놓아요.",
        items: [{ kind: "line", x1: 100, y1: 372, x2: 290, y2: 372, color: "gold", width: 5, dash: true }, { kind: "text", x: 110, y: 578, text: "아래 거울", size: 28, color: "gold" }] },
      { say: "거울 아래에 모눈을 그려요.",
        items: [{ kind: "grid", ...D, ...G }] },
      { say: "거울에 가장 가까운 맨 아랫줄의 두 칸이, 거울 바로 아래 첫째 줄에 비쳐요. 왼쪽 오른쪽 자리는 그대로예요.",
        items: [{ kind: "arrow", x1: center(L, 2, 0)[0], y1: center(L, 2, 0)[1] + 20, x2: center(D, 0, 0)[0], y2: center(D, 0, 0)[1] - 20, color: "green" }, { kind: "cells", ...D, cell: G.cell, cells: [[0, 0], [0, 1]], fill: "green" }] },
      { say: "멀리 있던 맨 윗칸은 멀리, 맨 아랫줄로 가요. 가운데 칸은 가운데 그대로예요.",
        items: [{ kind: "cells", ...D, cell: G.cell, cells: [[1, 0], [2, 0]], fill: "green" }] },
      { say: "아래 거울은 위와 아래만 바꿔요. 왼쪽 오른쪽은 그대로예요.",
        items: [{ kind: "text", x: 560, y: 230, text: "위아래만 바뀜, 좌우 그대로", size: 38, color: "green" }] },
      { say: "정리해요. 옆 거울은 좌우만, 위아래 거울은 위아래만 바꿔요. 그리고 거울에 가까운 칸은 건너편에서도 거울 가까이에, 멀리 있던 칸은 멀리 가요.", mood: "praise",
        items: [{ kind: "box", x: 540, y: 300, w: 420, h: 200, color: "gold" }, { kind: "text", x: 565, y: 360, text: "옆 거울: 좌우만", size: 38 }, { kind: "text", x: 565, y: 420, text: "위아래 거울: 위아래만", size: 38 }, { kind: "text", x: 565, y: 478, text: "가까운 칸은 그대로 가까이", size: 38 }] },
      { say: "하나만 더요. 왼쪽에 세운 거울도 옆 거울이에요. 오른쪽 거울과 똑같이 좌우만 바뀌니까, 비친 모양도 똑같아요.",
        items: [{ kind: "text", x: 560, y: 560, text: "왼쪽 거울 = 오른쪽 거울과 같은 모양", size: 30, color: "gray" }] },
      { say: "한 문제 풀어 봐요. 처음 모양을 왼쪽 거울에 비추면 어떤 모양일까요? 좌우만 바뀌고 높이는 그대로인 것을 골라요.", mood: "think",
        items: [],
        check: { question: "처음 모양을 왼쪽 거울에 비추면 어떤 모양일까요?",
          options: [{ ...G, cells: mirrorTB(shape, G.rows), fill: "green" }, { ...G, cells: turnHalf(shape, G.rows, G.cols), fill: "gray" }, { ...G, cells: mirrorLR(shape, G.cols), fill: "red" }], answer: 2,
          hint: "옆 거울은 좌우만 바꿔요. 높이가 그대로인 것을 찾아요.", sayHint: "왼쪽 거울도 옆 거울이에요. 세 칸짜리 긴 줄이 위에서부터 그대로 있고, 왼쪽 오른쪽만 바뀐 모양을 찾아요.",
          right: "맞았어요! 왼쪽 거울도 오른쪽 거울과 같은 모양이 돼요.", sayRight: "맞았어요! 왼쪽 거울이든 오른쪽 거울이든 좌우만 바뀌어서 같은 모양이 돼요. 이제 게임으로 가요." } }
    ]
  }

  ,"book-01/digital-turn-flip": (() => {
    const H = 150;                                   // 큰 숫자 높이
    const D8 = { x: 70, y: 120 }, D2 = { x: 330, y: 120 }, D5 = { x: 520, y: 120 }, D6 = { x: 330, y: 330 }, D9 = { x: 520, y: 330 };
    const S = 84, T1 = { x: 700, y: 372 }, T6 = { x: 760, y: 372 }, R9 = { x: 870, y: 372 }, R1 = { x: 930, y: 372 };   // 두 자리 수 16 → 91(작은 숫자)
    const flipped = transformDigit(2, "mirror-left-right"), turned = transformDigit(6, "rotate-half"), sym = transformDigit(3, "mirror-top-bottom");
    const ar = (from, fs, to, ts, h, color, bend) => { const [x1, y1] = segMid(from.x, from.y, h, fs), [x2, y2] = segMid(to.x, to.y, h, ts); return { kind: "arrow", x1, y1, x2, y2, color, bend, width: 3 }; };
    const label = (seg, text, dx, dy) => { const [mx, my] = segMid(D8.x, D8.y, H, seg); return { kind: "text", x: mx + dx, y: my + dy, text, size: 20, color: "gray", align: dx < 0 ? "right" : dx > 0 ? "start" : "center" }; };
    return {
      title: "디지털 숫자를 뒤집고 돌려요",
      kicker: "1권 1단원 · 손글씨 개념",
      beats: [
        { say: "디지털 숫자는 뒤집거나 돌리면 다른 숫자가 되기도 해요. 막대 하나하나를 따라가며 천천히 알아봐요.",
          items: [{ kind: "text", x: 60, y: 76, text: "디지털 숫자를 뒤집고 돌려요", size: 54 }] },
        { say: "디지털 숫자는 막대 일곱 개로 만들어요. 일곱 개가 다 켜지면 8이에요. 켜진 막대만 보이고, 꺼진 막대는 안 보여요.",
          items: [{ kind: "digit", ...D8, h: H, on: "abcdefg", color: "ink" }] },
        { say: "막대마다 이름이 있어요. 위, 가운데, 아래. 그리고 왼쪽 위, 왼쪽 아래, 오른쪽 위, 오른쪽 아래예요.",
          items: [label("a", "위", 0, -14), label("g", "가운데", 0, -12), label("d", "아래", 0, 28), label("f", "왼쪽 위", -14, 7), label("e", "왼쪽 아래", -14, 7), label("b", "오른쪽 위", 14, 7), label("c", "오른쪽 아래", 14, 7)] },
        { say: "숫자 2를 만들어 봐요. 위, 오른쪽 위, 가운데, 왼쪽 아래, 아래. 다섯 막대가 켜져요.",
          items: [{ kind: "digit", ...D2, h: H, on: DIGIT_SEGMENTS[2], color: "blue" }, { kind: "text", x: D2.x + 20, y: 310, text: "2", size: 34, color: "blue" }] },
        { say: "2의 오른쪽에 거울을 세워요. 오른쪽으로 뒤집기예요. 거울 건너편에 꺼진 막대 일곱 개를 먼저 그려 둬요.",
          items: [{ kind: "line", x1: 470, y1: 100, x2: 470, y2: 300, color: "gold", width: 5, dash: true }, { kind: "digit", ...D5, h: H, on: "", color: "red" }] },
        { say: "오른쪽으로 뒤집으면 왼쪽 막대와 오른쪽 막대가 자리를 바꿔요. 오른쪽 위는 왼쪽 위로, 왼쪽 아래는 오른쪽 아래로. 위, 가운데, 아래 막대는 그대로예요.",
          items: [ar(D2, "b", D5, "f", H, "red", 40), ar(D2, "e", D5, "c", H, "red", 0)] },
        { say: "켜진 막대를 하나씩 옮겨요. 위는 위 그대로. 오른쪽 위는 왼쪽 위로. 가운데는 그대로. 왼쪽 아래는 오른쪽 아래로. 아래는 아래 그대로.",
          items: [{ kind: "digit", ...D5, h: H, on: moveSegs(DIGIT_SEGMENTS[2], "mirror-left-right"), color: "red", dim: false }] },
        { say: `새 모양을 읽어요. ${jo(flipped, "이에요")}. 2를 오른쪽으로 뒤집으면 ${jo(flipped, "가")} 돼요.`,
          items: [{ kind: "text", x: D5.x + 20, y: 310, text: String(flipped), size: 34, color: "red" }, { kind: "text", x: 660, y: 150, text: `오른쪽으로 뒤집기: 2 → ${flipped}`, size: 36, color: "red" }] },
        { say: `아래쪽으로 뒤집으면 이번에는 위 막대와 아래 막대가 바뀌어요. 왼쪽 오른쪽은 그대로예요. 3은 위아래가 똑같이 생겨서 아래로 뒤집어도 ${jo(sym, "이에요")}.`,
          items: [{ kind: "text", x: 660, y: 210, text: `아래로 뒤집기: 위 ↔ 아래, 3 → ${sym}`, size: 27, color: "gray" }] },
        { say: "이번에는 6이에요. 위, 왼쪽 위, 가운데, 왼쪽 아래, 아래, 오른쪽 아래. 여섯 막대가 켜져요.",
          items: [{ kind: "digit", ...D6, h: H, on: DIGIT_SEGMENTS[6], color: "blue" }, { kind: "text", x: D6.x + 20, y: 520, text: "6", size: 34, color: "blue" }] },
        { say: "반 바퀴 돌리기는 판을 거꾸로 세우는 거예요. 위아래도 바뀌고 좌우도 바뀌어요. 막대는 대각선 맞은편으로 가요.",
          items: [{ kind: "arc", cx: (D6.x + H * 0.55 + D9.x) / 2, cy: D6.y + H / 2, r: 30, from: 8, to: 4, color: "green" }, { kind: "digit", ...D9, h: H, on: "", color: "green" }] },
        { say: "위 막대는 아래로. 왼쪽 아래 막대는 오른쪽 위로. 왼쪽 위 막대는 오른쪽 아래로. 가운데만 그대로예요.",
          items: [ar(D6, "a", D9, "d", H, "green", 0), ar(D6, "f", D9, "c", H, "green", 0)] },
        { say: `켜진 막대 여섯 개를 하나씩 옮기면 새 모양이 돼요. 읽어 보면 ${jo(turned, "이에요")}.`,
          items: [{ kind: "digit", ...D9, h: H, on: moveSegs(DIGIT_SEGMENTS[6], "rotate-half"), color: "green", dim: false }, { kind: "text", x: D9.x + 20, y: 520, text: String(turned), size: 34, color: "green" }] },
        { say: `6을 반 바퀴 돌리면 ${turned}. 뒤집기와 돌리기는 결과가 달라요. 꼭 막대를 따라가며 확인해요.`,
          items: [{ kind: "text", x: 660, y: 300, text: `반 바퀴 돌리기: 6 → ${turned}`, size: 36, color: "green" }] },
        { say: "두 자리 수는 조금 더 생각해요. 16을 써 봐요. 왼쪽에 1, 오른쪽에 6이에요.",
          items: [{ kind: "digit", ...T1, h: S, on: DIGIT_SEGMENTS[1], color: "blue" }, { kind: "digit", ...T6, h: S, on: DIGIT_SEGMENTS[6], color: "blue" }, { kind: "text", x: 700, y: 490, text: "16", size: 30, color: "blue" }] },
        { say: `판 전체를 반 바퀴 돌리면 숫자 모양만 바뀌는 게 아니라, 왼쪽에 있던 숫자가 오른쪽 자리로 가요. 6은 ${jo(turned, "가")} 되어 왼쪽으로, 1은 1 그대로 오른쪽으로. 그래서 16은 ${turned}1이 돼요.`,
          items: [{ kind: "arrow", x1: 830, y1: 414, x2: 860, y2: 414, color: "green", width: 3 }, { kind: "digit", ...R9, h: S, on: moveSegs(DIGIT_SEGMENTS[6], "rotate-half"), color: "green" }, { kind: "digit", ...R1, h: S, on: moveSegs(DIGIT_SEGMENTS[1], "rotate-half"), color: "green" }, { kind: "text", x: 870, y: 490, text: `${turned}1`, size: 30, color: "green" }] },
        { say: "정리해요. 옆으로 뒤집기는 왼쪽과 오른쪽 막대가 바뀌고, 아래로 뒤집기는 위와 아래 막대가 바뀌고, 반 바퀴 돌리기는 둘 다 바뀌어요. 두 자리 수는 자리 순서도 함께 바뀌어요.", mood: "praise",
          items: [{ kind: "box", x: 640, y: 100, w: 340, h: 420, color: "gold" }, { kind: "text", x: 660, y: 560, text: "막대를 하나씩 따라가요!", size: 32, color: "gold" }] },
        { say: `한 문제 풀어 봐요. ${jo(turned, "를")} 반 바퀴 돌리면 어떤 숫자가 될까요? 막대를 하나씩 대각선 맞은편으로 옮겨 봐요.`, mood: "think",
          items: [],
          check: { question: `${jo(turned, "를")} 반 바퀴 돌리면 어떤 숫자가 될까요?`,
            options: [String(turned), String(transformDigit(turned, "rotate-half")), "8"], answer: 1,
            hint: "반 바퀴는 위아래도 좌우도 바뀌어요. 위 막대가 어디로 가는지 봐요.", sayHint: "반 바퀴 돌리기는 위아래도 좌우도 바뀌어요. 위 막대가 아래로 가면 어떤 모양이 되는지 봐요.",
            right: `맞았어요! ${jo(turned, "를")} 반 바퀴 돌리면 ${jo(transformDigit(turned, "rotate-half"), "이에요")}.`, sayRight: `맞았어요! ${jo(turned, "를")} 반 바퀴 돌리면 ${transformDigit(turned, "rotate-half")}. 6과 ${jo(turned, "는")} 서로 반 바퀴 짝이에요. 이제 게임으로 손에 익혀 봐요.` } }
      ]
    };
  })()

  ,"book-01/fold-one-cut": (() => {
    const C = 50, N = 4;
    const P0 = { x: 60, y: 130 }, PF = { x: 330, y: 130 }, PU = { x: 600, y: 130 }, PH = { x: 60, y: 385 };
    const PAPER = "#f6d77a", TWO = "#e3b744", HOLE = "red";
    const sheet = (at, cols, rows, fill, cell = C) => [{ kind: "fill", x: at.x, y: at.y, w: cols * cell, h: rows * cell, fill }, { kind: "grid", x: at.x, y: at.y, cols, rows, cell, color: "#b9ab86" }];
    const mid = (at, r, c, cell = C) => [at.x + (c + 0.5) * cell, at.y + (r + 0.5) * cell];
    const cutFolded = [[0, 1]];                                   // 접힌 종이(오른쪽 두 줄) 안에서 자른 칸
    const cutOpen = cutFolded.map(([r, c]) => [r, c + 2]);         // 펼친 종이에서는 오른쪽 반의 같은 칸
    const mirror = mirrorLR(cutOpen, N);                           // 접는 선 건너편
    const checkCut = [[3, 2]], checkHoles = [...checkCut, ...mirrorLR(checkCut, N)];
    return {
      title: "한 번 접어 자르고 펼쳐요",
      kicker: "1권 2단원 · 손글씨 개념",
      beats: [
        { say: "색종이를 접어서 자르고 펼치면, 구멍이 어디에 몇 개 생길까요? 접고, 자르고, 펼치는 것을 하나씩 천천히 해 봐요.",
          items: [{ kind: "text", x: 60, y: 80, text: "한 번 접어 자르고 펼쳐요", size: 54 }] },
        { say: "모눈이 있는 색종이를 그려요. 가로 네 칸, 세로 네 줄이에요.",
          items: sheet(P0, N, N, PAPER) },
        { say: "가운데 세로선이 접는 선이에요. 왼쪽 두 줄과 오른쪽 두 줄, 똑같이 반씩 나뉘어요.",
          items: [{ kind: "line", x1: P0.x + 2 * C, y1: P0.y - 12, x2: P0.x + 2 * C, y2: P0.y + N * C + 12, color: "gold", width: 5, dash: true }, { kind: "text", x: P0.x + 2 * C, y: P0.y + N * C + 40, text: "접는 선", size: 26, color: "gold", align: "center" }] },
        { say: "왼쪽 반을 접는 선을 따라 오른쪽으로 넘겨요. 책장을 넘기듯이 접어요.",
          items: [{ kind: "arrow", x1: P0.x + 0.5 * C, y1: P0.y - 8, x2: P0.x + 3.5 * C, y2: P0.y - 8, bend: 34, color: "red" }] },
        { say: "접으니까 종이가 반으로 줄었어요. 오른쪽 두 줄 위에 왼쪽 두 줄이 포개졌어요. 이제 종이가 두 겹이에요.",
          items: [...sheet(PF, 2, N, TWO), { kind: "text", x: PF.x + C, y: PF.y + N * C + 40, text: "두 겹", size: 30, color: "gold", align: "center" }] },
        { say: "접힌 종이에서 맨 윗줄, 오른쪽 칸을 잘라요. 가위로 자르면 포개진 두 겹이 한꺼번에 잘려요.",
          items: [{ kind: "cells", x: PF.x, y: PF.y, cell: C, cells: cutFolded, fill: HOLE }, { kind: "text", x: PF.x + 2 * C + 16, y: PF.y + 34, text: "← 자른 칸", size: 26, color: "red" }] },
        { say: "두 겹을 한 번에 잘랐으니까, 구멍은 한 겹에 하나씩, 모두 두 개가 생겨요. 어디에 생기는지 펼쳐서 확인해요.",
          items: [{ kind: "text", x: 560, y: 390, text: "두 겹 × 한 번 자르기 = 구멍 두 개", size: 30 }] },
        { say: "종이를 다시 펼쳐요. 펼친 색종이를 그려요. 접는 선도 같은 자리에 그대로 있어요.",
          items: [...sheet(PU, N, N, PAPER), { kind: "line", x1: PU.x + 2 * C, y1: PU.y - 12, x2: PU.x + 2 * C, y2: PU.y + N * C + 12, color: "gold", width: 5, dash: true }] },
        { say: "먼저 위에 놓여 있지 않던 오른쪽 반을 봐요. 잘린 칸은 그대로, 맨 윗줄 오른쪽 끝 칸이에요.",
          items: [{ kind: "cells", x: PU.x, y: PU.y, cell: C, cells: cutOpen, fill: HOLE }] },
        { say: "접혀서 위에 있던 왼쪽 반은, 거울처럼 접는 선을 넘어가 있었어요. 접는 선에서 오른쪽으로 두 칸이니까, 왼쪽으로도 두 칸 가요.",
          items: [{ kind: "arrow", x1: mid(PU, 0, 3)[0], y1: PU.y - 10, x2: mid(PU, 0, 0)[0], y2: PU.y - 10, bend: 34, color: "red" }] },
        { say: "그래서 맨 윗줄 왼쪽 끝 칸에도 구멍이 생겨요. 구멍이 두 개예요.",
          items: [{ kind: "cells", x: PU.x, y: PU.y, cell: C, cells: mirror, fill: HOLE }] },
        { say: "두 구멍은 접는 선을 사이에 두고 서로 마주 봐요. 접는 선에서 똑같이 두 칸 떨어져 있어요. 접는 선이 거울이에요.",
          items: [{ kind: "text", x: 830, y: 190, text: "접는 선 = 거울", size: 32, color: "red" }, { kind: "text", x: 830, y: 240, text: "같은 거리에", size: 28, color: "red" }, { kind: "text", x: 830, y: 280, text: "마주 봐요", size: 28, color: "red" }] },
        { say: "가로로 접어도 똑같이 생각해요. 위쪽 반을 아래로 접고 자르면, 구멍은 가로 접는 선을 사이에 두고 위아래로 마주 봐요.",
          items: [...sheet(PH, N, N, PAPER, 45), { kind: "line", x1: PH.x - 10, y1: PH.y + 2 * 45, x2: PH.x + N * 45 + 10, y2: PH.y + 2 * 45, color: "gold", width: 4, dash: true }, { kind: "cells", x: PH.x, y: PH.y, cell: 45, cells: [[0, 1], ...mirrorTB([[0, 1]], N)], fill: HOLE }] },
        { say: "정리해요. 접으면 두 겹. 한 번 자르면 구멍이 두 개. 펼치면 두 구멍은 접는 선에서 같은 거리에 마주 봐요.", mood: "praise",
          items: [{ kind: "box", x: 300, y: 430, w: 660, h: 130, color: "gold" }, { kind: "text", x: 325, y: 480, text: "접는 선 = 거울, 같은 거리에 마주 봐요", size: 34 }, { kind: "text", x: 325, y: 535, text: "두 겹이면 구멍 두 개", size: 34 }] },
        { say: "한 문제 풀어 봐요. 왼쪽 반을 오른쪽으로 접고, 맨 아랫줄에서 접는 선에 붙은 칸을 잘랐어요. 펼치면 어떤 모양일까요? 빨간 칸이 구멍이에요.", mood: "think",
          items: [],
          check: { question: "왼쪽 반을 오른쪽으로 접고, 맨 아랫줄에서 접는 선에 붙은 칸을 잘랐어요. 펼치면 어떤 모양일까요? (빨간 칸 = 구멍)",
            options: [{ cols: N, rows: N, cell: 20, cells: [[3, 2], [3, 3]], fill: "red" }, { cols: N, rows: N, cell: 20, cells: [[3, 2]], fill: "red" }, { cols: N, rows: N, cell: 20, cells: checkHoles, fill: "red" }], answer: 2,
            hint: "두 겹이라 구멍은 두 개예요. 접는 선에서 같은 거리, 건너편을 찾아요.", sayHint: "두 겹을 잘랐으니 구멍은 두 개예요. 잘린 칸이 접는 선에 붙어 있었으니, 건너편에서도 접는 선에 붙은 칸이에요.",
            right: "맞았어요! 두 구멍이 접는 선에 붙어 마주 봐요.", sayRight: "맞았어요! 접는 선에 붙은 칸을 잘랐으니, 펼치면 접는 선 양쪽에 붙은 두 칸이 구멍이 돼요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-01/fold-two-cut": (() => {
    const C = 40, N = 4;
    const P0 = { x: 50, y: 150 }, P1 = { x: 270, y: 150 }, P2 = { x: 420, y: 150 }, Q1 = { x: 560, y: 150 }, Q2 = { x: 760, y: 150 };
    const PAPER = "#f6d77a", TWO = "#e3b744", FOUR = "#c99a2b", HOLE = "red";
    const sheet = (at, cols, rows, fill) => [{ kind: "fill", x: at.x, y: at.y, w: cols * C, h: rows * C, fill }, { kind: "grid", x: at.x, y: at.y, cols, rows, cell: C, color: "#b9ab86" }];
    const vline = (at, rows, color = "gold") => ({ kind: "line", x1: at.x + 2 * C, y1: at.y - 10, x2: at.x + 2 * C, y2: at.y + rows * C + 10, color, width: 4, dash: true });
    const hline = (at, cols, color = "gold") => ({ kind: "line", x1: at.x - 10, y1: at.y + 2 * C, x2: at.x + cols * C + 10, y2: at.y + 2 * C, color, width: 4, dash: true });
    // 접기: ① 왼쪽 반 → 오른쪽(남는 곳: 2·3번째 줄) ② 아래쪽 반 → 위(남는 곳: 0·1번째 줄). 네 겹 종이 = 원래 종이의 오른쪽 위 2×2.
    const toOpen = ([r, c]) => [r, c + 2];
    const open2 = (cells) => [...cells, ...mirrorTB(cells, N)];       // 마지막(위아래) 접기를 먼저 편다
    const open1 = (cells) => [...cells, ...mirrorLR(cells, N)];       // 그다음 첫(좌우) 접기
    const cut = [[1, 1]].map(toOpen);                                 // 네 겹 종이의 오른쪽 아래 칸
    const afterOne = open2(cut), afterTwo = open1(afterOne);
    const checkCut = [[0, 0]].map(toOpen), checkHoles = open1(open2(checkCut));
    const local = (cells, dc = 0) => cells.map(([r, c]) => [r, c - dc]);
    return {
      title: "두 번 접고 차례로 펼쳐요",
      kicker: "1권 2단원 · 손글씨 개념",
      beats: [
        { say: "이번에는 색종이를 두 번 접어요. 두 번 접고 자르면 구멍이 몇 개 생길까요? 접는 순서와 펼치는 순서를 꼭 기억하면서 천천히 해 봐요.",
          items: [{ kind: "text", x: 50, y: 80, text: "두 번 접고 차례로 펼쳐요", size: 54 }] },
        { say: "모눈 색종이를 그려요. 가운데 세로선과 가로선, 접는 선이 두 개예요.",
          items: [...sheet(P0, N, N, PAPER), vline(P0, N), hline(P0, N)] },
        { say: "첫 번째 접기예요. 왼쪽 반을 오른쪽으로 접어요.",
          items: [{ kind: "arrow", x1: P0.x + 0.5 * C, y1: P0.y - 8, x2: P0.x + 3.5 * C, y2: P0.y - 8, bend: 30, color: "red" }, { kind: "text", x: P0.x, y: P0.y + N * C + 44, text: "① 왼쪽 → 오른쪽", size: 24, color: "red" }] },
        { say: "반으로 접혀서 두 겹이 됐어요. 세로로 긴 종이예요.",
          items: [...sheet(P1, 2, N, TWO), hline(P1, 2), { kind: "text", x: P1.x + C, y: P1.y + N * C + 44, text: "두 겹", size: 26, color: "gold", align: "center" }] },
        { say: "두 번째 접기예요. 아래쪽 반을 위로 접어요.",
          items: [{ kind: "arrow", x1: P1.x + 2 * C + 12, y1: P1.y + 3.5 * C, x2: P1.x + 2 * C + 12, y2: P1.y + 0.5 * C, color: "green" }, { kind: "text", x: P1.x - 10, y: P1.y + N * C + 80, text: "② 아래 → 위", size: 24, color: "green" }] },
        { say: "두 겹을 또 반으로 접었으니 네 겹이에요. 두 겹의 두 배, 네 겹. 작은 네모가 됐어요.",
          items: [...sheet(P2, 2, 2, FOUR), { kind: "text", x: P2.x + C, y: P2.y + 2 * C + 40, text: "네 겹", size: 26, color: "gold", align: "center" }] },
        { say: "이 네 겹 종이에서 오른쪽 아래 칸을 잘라요. 가위로 한 번 자르면 네 겹이 한꺼번에 잘려요.",
          items: [{ kind: "cells", x: P2.x, y: P2.y, cell: C, cells: local(cut, 2), fill: HOLE }] },
        { say: "이제 펼쳐요. 펼칠 때는 거꾸로예요. 마지막에 접은 것부터 먼저 펼쳐요. 두 번째로 접은 위아래 접기를 먼저 풀어요.",
          items: [{ kind: "text", x: 50, y: 470, text: "펼치기는 거꾸로: 마지막 접기부터", size: 34, color: "green" }] },
        { say: "위아래 접기를 풀면 두 겹짜리 긴 종이로 돌아와요. 가운데 가로선이 방금 푼 접는 선이에요.",
          items: [...sheet(Q1, 2, N, TWO), hline(Q1, 2, "green")] },
        { say: "잘린 칸은 가로 접는 선 바로 위 칸이었어요. 거울처럼 아래로 넘기면 가로 접는 선 바로 아래 칸이에요. 구멍이 두 개가 돼요.",
          items: [{ kind: "cells", x: Q1.x, y: Q1.y, cell: C, cells: local(afterOne, 2), fill: HOLE }] },
        { say: "다음은 첫 번째로 접은 좌우 접기를 풀어요. 처음 색종이 크기로 돌아와요. 가운데 세로선이 방금 푼 접는 선이에요.",
          items: [...sheet(Q2, N, N, PAPER), vline(Q2, N, "red"), { kind: "cells", x: Q2.x, y: Q2.y, cell: C, cells: afterOne, fill: HOLE }] },
        { say: "오른쪽 끝 줄의 구멍 두 개가, 세로 접는 선 건너편 왼쪽 끝 줄로 똑같이 넘어가요. 같은 거리, 같은 높이예요.",
          items: [{ kind: "arrow", x1: Q2.x + 3.5 * C, y1: Q2.y - 10, x2: Q2.x + 0.5 * C, y2: Q2.y - 10, bend: 30, color: "red" }, { kind: "cells", x: Q2.x, y: Q2.y, cell: C, cells: mirrorLR(afterOne, N), fill: HOLE }] },
        { say: `구멍을 세어 봐요. 하나, 둘, 셋, 넷. 모두 ${afterTwo.length}개예요.`,
          items: [{ kind: "text", x: Q2.x, y: Q2.y + N * C + 44, text: `구멍 ${afterTwo.length}개`, size: 30, color: "red" }] },
        { say: "왜 네 개일까요? 한 번 접으면 두 겹, 두 번 접으면 네 겹이에요. 네 겹을 한 번 자르니 구멍이 네 개 생긴 거예요.",
          items: [{ kind: "text", x: 50, y: 525, text: "한 번 접기 → 두 겹,  두 번 접기 → 네 겹 → 구멍 네 개", size: 32 }] },
        { say: "정리해요. 접은 순서와 펼치는 순서는 반대예요. 마지막 접기부터 하나씩 풀고, 풀 때마다 구멍을 접는 선 건너편 같은 거리에 하나씩 더 그려요.", mood: "praise",
          items: [{ kind: "box", x: 40, y: 430, w: 920, h: 135, color: "gold" }] },
        { say: "한 문제 풀어 봐요. 똑같이 왼쪽 반을 오른쪽으로, 아래쪽 반을 위로 접었어요. 이번에는 네 겹 종이의 왼쪽 위 칸을 잘랐어요. 펼치면 어떤 모양일까요?", mood: "think",
          items: [],
          check: { question: "왼쪽 반을 오른쪽으로, 아래쪽 반을 위로 접은 뒤 네 겹 종이의 왼쪽 위 칸을 잘랐어요. 펼치면? (빨간 칸 = 구멍)",
            options: [{ cols: N, rows: N, cell: 20, cells: open2(checkCut), fill: "red" }, { cols: N, rows: N, cell: 20, cells: [...checkCut, [1, 2], [0, 1], [1, 1]], fill: "red" }, { cols: N, rows: N, cell: 20, cells: checkHoles, fill: "red" }], answer: 2,
            hint: "네 겹을 잘랐으니 구멍은 네 개예요. 위아래 접기부터 풀고, 그다음 좌우 접기를 풀어요.", sayHint: "네 겹을 잘랐으니 구멍은 네 개예요. 마지막에 접은 위아래 접기를 먼저 풀고, 그다음 좌우 접기를 풀며 하나씩 그려 봐요.",
            right: "맞았어요! 구멍 네 개가 두 접는 선에 대해 마주 봐요.", sayRight: "맞았어요! 위아래 접기를 풀어 두 개, 좌우 접기를 풀어 네 개. 펼칠 때는 마지막 접기부터예요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-01/equal-line-sums": (() => {
    // 십자 모양: 가로줄(왼·가운데·오른) + 세로줄(위·가운데·아래). 가운데는 두 줄이 함께 쓴다.
    const C = { cx: 300, cy: 330 }, D = 120, R = 36;
    const at = { L: [C.cx - D, C.cy], M: [C.cx, C.cy], Rt: [C.cx + D, C.cy], T: [C.cx, C.cy - D], B: [C.cx, C.cy + D] };
    const v = { L: 7, M: 5, Rt: 2, B: 3 };
    const row = v.L + v.M + v.Rt, outer = v.L + v.Rt, top = outer - v.B;
    const node = (k, value, color) => ({ kind: "node", cx: at[k][0], cy: at[k][1], r: R, value, color });
    const num = (k, value, color) => ({ kind: "num", cx: at[k][0], cy: at[k][1], value, color });
    const seg = (a, b, color = "gray") => { const [x1, y1] = at[a], [x2, y2] = at[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return { kind: "line", x1: x1 + dx / L * R, y1: y1 + dy / L * R, x2: x2 - dx / L * R, y2: y2 - dy / L * R, color, width: 3 }; };
    const CHK = { L: 8, M: 6, Rt: 4, B: 3 }, chkTop = CHK.L + CHK.Rt - CHK.B;
    const T = (y, text, color = "ink", size = 32) => ({ kind: "text", x: 560, y, text, size, color });
    return {
      title: "모든 줄의 합을 같게",
      kicker: "1권 3단원 · 손글씨 개념",
      beats: [
        { say: "줄마다 수를 더한 합이 모두 같아지게 빈칸을 채워 볼 거예요. 계산을 짧게 하는 방법이 있어요. 하나씩 천천히 봐요.",
          items: [{ kind: "text", x: 60, y: 86, text: "모든 줄의 합을 같게", size: 56 }] },
        { say: "동그라미 다섯 개를 십자 모양으로 그려요. 가로줄에 세 개, 세로줄에 세 개예요. 가운데 동그라미는 두 줄이 함께 써요.",
          items: [node("L"), node("M"), node("Rt"), node("T"), node("B"), seg("L", "M"), seg("M", "Rt"), seg("T", "M"), seg("M", "B")] },
        { say: `가로줄에 ${v.L}, ${v.M}, ${jo(v.Rt, "를")} 써요.`,
          items: [num("L", v.L, "blue"), num("M", v.M, "blue"), num("Rt", v.Rt, "blue")] },
        { say: `세로줄에는 가운데 ${jo(v.M, "와")} 아래 ${jo(v.B, "가")} 있고, 위는 비어 있어요. 가로줄의 합과 세로줄의 합이 같아지도록 위 빈칸을 채울 거예요.`,
          items: [num("B", v.B, "blue"), num("T", "?", "red")] },
        { say: `먼저 가로줄을 더해요. ${v.L} 더하기 ${jo(v.M, "는")} ${v.L + v.M}, 거기에 ${jo(v.Rt, "를")} 더하면 ${row}. 가로줄의 합은 ${jo(row, "이에요")}.`,
          items: [T(150, `가로: ${v.L} + ${v.M} + ${v.Rt} = ${row}`, "blue")] },
        { say: `세로줄도 ${jo(row, "이")} 되어야 해요. 그런데 잘 보세요. 가운데 ${jo(v.M, "는")} 가로줄에도 세로줄에도 들어 있어요.`,
          items: [{ kind: "ring", cx: at.M[0], cy: at.M[1], r: R + 10, color: "gold" }] },
        { say: `두 줄에 똑같이 들어 있는 수는, 양쪽에서 똑같이 빼도 괜찮아요. 같았던 두 합에서 똑같은 수를 빼면, 남은 것끼리도 여전히 같아요.`,
          items: [T(210, `가운데 ${jo(v.M, "는")} 두 줄에 똑같이 → 빼고 비교`, "gold", 28)] },
        { say: `가운데를 빼면 가로줄에는 바깥 수 ${jo(v.L, "과")} ${jo(v.Rt, "가")} 남아요. ${v.L} 더하기 ${jo(v.Rt, "는")} ${outer}.`,
          items: [T(270, `가로 바깥: ${v.L} + ${v.Rt} = ${outer}`, "blue")] },
        { say: `세로줄에서 가운데를 빼면 위의 빈칸과 아래 ${jo(v.B, "가")} 남아요. 이 둘을 더해도 ${jo(outer, "이")} 되어야 해요.`,
          items: [T(330, `세로 바깥: ? + ${v.B} = ${outer}`, "red")] },
        { say: `${v.B}에 얼마를 더하면 ${jo(outer, "이")} 될까요? ${outer}에서 ${jo(v.B, "를")} 빼면 돼요. ${outer} 빼기 ${jo(v.B, "는")} ${top}.`,
          items: [T(390, `? = ${outer} − ${v.B} = ${top}`, "red")] },
        { say: `위 빈칸에 ${jo(top, "을")} 써요.`,
          items: [{ kind: "fill", x: at.T[0] - R + 6, y: at.T[1] - R + 6, w: 2 * R - 12, h: 2 * R - 12, fill: "#fffdf7" }, { kind: "node", cx: at.T[0], cy: at.T[1], r: R, color: "green", value: top, textColor: "green" }] },
        { say: `꼭 확인해요. 세로줄 ${top} 더하기 ${v.M} 더하기 ${jo(v.B, "는")} ${top + v.M + v.B}. 가로줄과 똑같이 ${jo(row, "이에요")}.`,
          items: [T(450, `세로: ${top} + ${v.M} + ${v.B} = ${top + v.M + v.B} ✓`, "green")] },
        { say: "왜 가운데를 빼면 편할까요? 줄 전체를 다 더하지 않고, 바깥 수 두 개끼리만 비교하면 되니까 계산이 짧아져요.",
          items: [] },
        { say: "정리해요. 두 줄이 함께 쓰는 수는 빼고 생각해요. 바깥 수의 합을 같게 만들고, 마지막에 줄 전체 합을 다시 더해 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 110, w: 430, h: 370, color: "gold" }, { kind: "text", x: 560, y: 540, text: "함께 쓰는 수는 빼고 비교!", size: 34, color: "gold" }] },
        { say: `한 문제 풀어 봐요. 가로줄 바깥 수가 ${jo(CHK.L, "과")} ${CHK.Rt}, 가운데는 ${CHK.M}, 세로줄 아래가 ${jo(CHK.B, "예요")}. 위 빈칸은 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `가로줄이 ${CHK.L}, ${CHK.M}, ${CHK.Rt}이고 세로줄 아래가 ${jo(CHK.B, "예요")}. 두 줄의 합이 같으려면 위 빈칸은 얼마일까요?`,
            options: [String(CHK.L + CHK.Rt), String(chkTop), String(CHK.L + CHK.M + CHK.Rt - CHK.B)], answer: 1,
            hint: "가운데는 두 줄에 함께 있으니 빼고, 바깥 수끼리 같게 해요.", sayHint: `가운데 ${jo(CHK.M, "는")} 빼고 생각해요. 가로 바깥 수 ${CHK.L} 더하기 ${CHK.Rt}와, 위 빈칸 더하기 ${jo(CHK.B, "가")} 같아야 해요.`,
            right: `맞았어요! ${CHK.L} + ${CHK.Rt} = ${CHK.L + CHK.Rt}, 그래서 빈칸은 ${CHK.L + CHK.Rt} − ${CHK.B} = ${chkTop}.`, sayRight: `맞았어요! 바깥 수 ${jo(CHK.L, "과")} ${CHK.Rt}의 합은 ${CHK.L + CHK.Rt}. 거기서 ${jo(CHK.B, "를")} 빼면 ${jo(chkTop, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-01/equal-line-placement": (() => {
    const cards = [4, 5, 6, 7, 8];
    const C = { cx: 270, cy: 375 }, D = 100, R = 34;
    const at = { L: [C.cx - D, C.cy], M: [C.cx, C.cy], Rt: [C.cx + D, C.cy], T: [C.cx, C.cy - D], B: [C.cx, C.cy + D] };
    const node = (k) => ({ kind: "node", cx: at[k][0], cy: at[k][1], r: R });
    const num = (k, value, color = "blue") => ({ kind: "num", cx: at[k][0], cy: at[k][1], value, color });
    const seg = (a, b) => { const [x1, y1] = at[a], [x2, y2] = at[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return { kind: "line", x1: x1 + dx / L * R, y1: y1 + dy / L * R, x2: x2 - dx / L * R, y2: y2 - dy / L * R, color: "gray", width: 3 }; };
    const cardAt = (i) => ({ x: 70 + i * 82, y: 112 });
    const card = (i, color) => ({ kind: "card", ...cardAt(i), value: cards[i], color });
    const cross = (i) => ({ kind: "cross", ...cardAt(i) });
    const total = cards.reduce((a, b) => a + b, 0);
    // 가운데 c를 놓으면 남은 넷의 합이 둘로 똑같이 나뉘어야 하고, 실제로 같은 합의 두 짝이 있어야 한다
    const tryCenter = (c) => { const rest = cards.filter((x) => x !== c), s = rest.reduce((a, b) => a + b, 0); if (s % 2) return { c, rest, s, ok: false };
      const half = s / 2, a = rest[0], b = rest.find((x) => x !== a && a + x === half); if (b == null) return { c, rest, s, ok: false };
      const other = rest.filter((x) => x !== a && x !== b); return { c, rest, s, half, pairs: [[a, b], other], ok: true, line: half + c }; };
    const t6 = tryCenter(6), t5 = tryCenter(5), t4 = tryCenter(4), t8 = tryCenter(8), t7 = tryCenter(7);
    const good = cards.filter((c) => tryCenter(c).ok);
    const T = (y, text, color = "ink", size = 28) => ({ kind: "text", x: 560, y, text, size, color });
    const CHK = [6, 7, 8, 9, 10], chk = (() => { const rest = CHK.filter((x) => x !== 6); return [[rest[0], rest[3]], [rest[1], rest[2]]]; })();
    const pairText = (p) => `${p[0][0]}+${jo(p[0][1], "와")} ${p[1][0]}+${p[1][1]}`;
    return {
      title: "숫자 카드로 모든 줄의 합을 같게 해요",
      kicker: "1권 3단원 · 손글씨 개념",
      beats: [
        { say: "숫자 카드를 한 번씩만 써서, 두 줄의 합이 같아지게 놓아 볼 거예요. 가운데 자리를 먼저 정하는 게 비밀이에요.",
          items: [{ kind: "text", x: 60, y: 80, text: "숫자 카드로 모든 줄의 합을 같게", size: 48 }] },
        { say: `쓸 카드는 ${cards.join(", ")}. 다섯 장이에요. 한 장도 빼지 않고, 한 번씩만 써요.`,
          items: cards.map((_, i) => card(i)) },
        { say: "동그라미 다섯 개를 십자 모양으로 그려요. 가로줄 세 개, 세로줄 세 개. 가운데 자리는 두 줄이 함께 써요.",
          items: [node("L"), node("M"), node("Rt"), node("T"), node("B"), seg("L", "M"), seg("M", "Rt"), seg("T", "M"), seg("M", "B")] },
        { say: "가운데 카드는 가로줄에도 세로줄에도 들어가요. 그러니까 가운데를 빼고 남은 카드 네 장을, 합이 똑같은 두 짝으로 나눌 수 있으면 돼요.",
          items: [T(150, "가운데를 빼고 남은 네 장 → 합이 같은 두 짝", "gold", 26)] },
        { say: `가운데에 ${jo(t6.c, "을")} 놓아 볼게요. 남은 카드는 ${t6.rest.join(", ")}. 다 더하면 ${t6.s}. 반으로 나누면 ${t6.half}씩이에요.`,
          items: [num("M", 6, "green"), cross(2), T(205, `가운데 6: 남은 ${t6.rest.join("+")} = ${t6.s}, 반은 ${t6.half}`, "green")] },
        { say: `합이 ${jo(t6.half, "이")} 되는 짝을 찾아요. ${t6.pairs[0][0]} 더하기 ${jo(t6.pairs[0][1], "는")} ${t6.half}, ${t6.pairs[1][0]} 더하기 ${t6.pairs[1][1]}도 ${t6.half}. 두 짝이 생겼어요.`,
          items: [T(250, `짝: ${t6.pairs[0][0]}+${t6.pairs[0][1]} = ${t6.half},  ${t6.pairs[1][0]}+${t6.pairs[1][1]} = ${t6.half}`, "green")] },
        { say: `한 짝은 가로줄 양쪽에, 다른 짝은 세로줄 위아래에 놓아요.`,
          items: [num("L", t6.pairs[0][0]), num("Rt", t6.pairs[0][1]), num("T", t6.pairs[1][0]), num("B", t6.pairs[1][1]), cross(0), cross(4), cross(1), cross(3)] },
        { say: `확인해요. 가로줄 ${t6.pairs[0][0]} 더하기 6 더하기 ${jo(t6.pairs[0][1], "는")} ${t6.line}. 세로줄 ${t6.pairs[1][0]} 더하기 6 더하기 ${t6.pairs[1][1]}도 ${t6.line}. 두 줄이 같아요.`,
          items: [T(300, `가로 = 세로 = ${t6.line} ✓`, "green", 32)] },
        { say: `가운데에 다른 카드도 놓을 수 있을까요? ${jo(t5.c, "을")} 놓으면 남은 카드의 합은 ${t5.s}. ${jo(t5.s, "는")} 똑같은 두 수로 나눌 수 없어요. 그래서 ${jo(t5.c, "는")} 안 돼요.`,
          items: [T(355, `가운데 5: 남은 합 ${t5.s} → 반으로 못 나눠요 ✗`, "red")] },
        { say: `${t7.c}도 마찬가지예요. 남은 합이 ${t7.s}라서 반으로 나눌 수 없어요.`,
          items: [T(395, `가운데 7: 남은 합 ${t7.s} → ✗`, "red")] },
        { say: `${jo(t4.c, "을")} 놓으면 남은 합은 ${t4.s}, 반은 ${t4.half}. ${t4.pairs[0][0]} 더하기 ${t4.pairs[0][1]}, ${t4.pairs[1][0]} 더하기 ${t4.pairs[1][1]}로 짝이 돼요. ${t8.c}도 남은 합 ${t8.s}, 반은 ${t8.half}라서 짝이 돼요.`,
          items: [T(435, `가운데 4: ${t4.pairs[0].join("+")} = ${t4.pairs[1].join("+")} ✓`, "green"), T(475, `가운데 8: ${t8.pairs[0].join("+")} = ${t8.pairs[1].join("+")} ✓`, "green")] },
        { say: `그래서 가운데에 놓을 수 있는 카드는 ${good.join(", ")}. 하나씩 놓아 보고, 남은 합이 반으로 나뉘는지, 같은 합의 짝이 있는지 확인하면 돼요.`,
          items: [T(530, `가운데에 놓을 수 있는 수: ${good.join(", ")}`, "gold", 30)] },
        { say: "정리해요. 가운데를 하나 정해요. 남은 카드를 다 더해 반으로 나눠요. 같은 합의 두 짝이 있으면 성공. 카드는 한 번씩만 써요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 110, w: 440, h: 450, color: "gold" }] },
        { say: `한 문제 풀어 봐요. 카드 ${CHK.join(", ")}에서 가운데에 6을 놓았어요. 남은 카드로 합이 같은 두 짝을 만들면 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `카드 ${CHK.join(", ")}에서 가운데에 6을 놓으면, 남은 카드로 만드는 합이 같은 두 짝은?`,
            options: [`${jo("7+8", "과")} 9+10`, pairText(chk), `${jo("7+9", "과")} 8+10`], answer: 1,
            hint: "남은 네 장을 다 더해 반으로 나눠요. 그 수가 되는 짝을 찾아요.", sayHint: "남은 카드 7, 8, 9, 10을 다 더하면 34예요. 반은 17. 더해서 17이 되는 짝을 찾아요.",
            right: `맞았어요! ${pairText(chk)}, 둘 다 17이에요.`, sayRight: `맞았어요! 7 더하기 10도 17, 8 더하기 9도 17. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-01/gakuro-sum-grid": (() => {
    const X = 160, Y = 170, S = 90;                    // 2×2 칸, 왼쪽 위 (X, Y), 한 칸 S
    const given = 2, rowSums = [9, 11], colSums = [8, 12], cards = [5, 6, 7];
    const tr = rowSums[0] - given, bl = colSums[0] - given, br = cards.find((c) => c !== tr && c !== bl);
    const cell = (r, c) => ({ cx: X + (c + 0.5) * S, cy: Y + (r + 0.5) * S });
    const num = (r, c, value, color = "ink") => ({ kind: "num", ...cell(r, c), value, size: 44, color });
    const cardAt = (i) => ({ x: 130 + i * 84, y: 460 });
    const T = (y, text, color = "ink", size = 30) => ({ kind: "text", x: 560, y, text, size, color });
    const ci = (v) => cards.indexOf(v);
    return {
      title: "가로와 세로의 합을 맞춰요",
      kicker: "1권 3단원 · 손글씨 개념",
      beats: [
        { say: "네 칸짜리 판에 숫자를 채워서, 가로줄의 합과 세로줄의 합을 모두 맞출 거예요. 확실하게 알 수 있는 칸부터 하나씩 채워요.",
          items: [{ kind: "text", x: 60, y: 86, text: "가로와 세로의 합을 맞춰요", size: 54 }] },
        { say: "가로 두 칸, 세로 두 줄인 네모 판을 그려요.",
          items: [{ kind: "grid", x: X, y: Y, cols: 2, rows: 2, cell: S, color: "ink" }] },
        { say: `줄마다 합을 적어요. 오른쪽에 쓴 수는 가로줄의 합이에요. 윗줄은 ${rowSums[0]}, 아랫줄은 ${rowSums[1]}.`,
          items: [{ kind: "text", x: X + 2 * S + 22, y: Y + 0.5 * S + 14, text: `→ ${rowSums[0]}`, size: 36, color: "blue" }, { kind: "text", x: X + 2 * S + 22, y: Y + 1.5 * S + 14, text: `→ ${rowSums[1]}`, size: 36, color: "blue" }] },
        { say: `아래에 쓴 수는 세로줄의 합이에요. 왼쪽 줄은 ${colSums[0]}, 오른쪽 줄은 ${colSums[1]}.`,
          items: [{ kind: "text", x: X + 0.5 * S, y: Y + 2 * S + 44, text: `↓ ${colSums[0]}`, size: 36, color: "green", align: "center" }, { kind: "text", x: X + 1.5 * S, y: Y + 2 * S + 44, text: `↓ ${colSums[1]}`, size: 36, color: "green", align: "center" }] },
        { say: `왼쪽 위 칸에는 ${jo(given, "가")} 이미 들어 있어요.`,
          items: [num(0, 0, given)] },
        { say: `남은 세 칸에 넣을 카드는 ${jo(cards.join(", "), "이에요")}. 한 번씩만 써요.`,
          items: cards.map((v, i) => ({ kind: "card", ...cardAt(i), value: v })) },
        { say: `어느 칸부터 할까요? 빈칸이 하나뿐인 줄을 찾아요. 윗줄은 ${jo(given, "가")} 있고 빈칸이 하나예요.`,
          items: [{ kind: "box", x: X - 6, y: Y - 6, w: 2 * S + 12, h: S + 12, color: "blue", dash: true }] },
        { say: `윗줄의 합은 ${rowSums[0]}. ${given}에 얼마를 더하면 ${rowSums[0]}일까요? ${rowSums[0]} 빼기 ${jo(given, "는")} ${tr}. 오른쪽 위 칸은 ${jo(tr, "이에요")}.`,
          items: [T(180, `윗줄: ${rowSums[0]} − ${given} = ${tr}`, "blue"), num(0, 1, tr, "blue"), { kind: "cross", ...cardAt(ci(tr)) }] },
        { say: `${tr} 카드는 썼으니 지워요. 이번엔 왼쪽 세로줄이에요. 위에 ${jo(given, "가")} 있고 빈칸이 하나예요.`,
          items: [{ kind: "box", x: X - 6, y: Y - 6, w: S + 12, h: 2 * S + 12, color: "green", dash: true }] },
        { say: `왼쪽 세로줄의 합은 ${colSums[0]}. ${colSums[0]} 빼기 ${jo(given, "는")} ${bl}. 왼쪽 아래 칸은 ${jo(bl, "이에요")}.`,
          items: [T(240, `왼쪽 세로줄: ${colSums[0]} − ${given} = ${bl}`, "green"), num(1, 0, bl, "green"), { kind: "cross", ...cardAt(ci(bl)) }] },
        { say: `남은 카드는 ${br} 하나. 마지막 칸, 오른쪽 아래에 ${jo(br, "을")} 놓아요.`,
          items: [num(1, 1, br, "red"), { kind: "cross", ...cardAt(ci(br)) }] },
        { say: `이제 확인해요. 아랫줄 ${bl} 더하기 ${jo(br, "는")} ${bl + br}. 적혀 있는 ${jo(rowSums[1], "과")} 같아요.`,
          items: [T(300, `아랫줄: ${bl} + ${br} = ${bl + br} ✓`, "red")] },
        { say: `오른쪽 세로줄 ${tr} 더하기 ${jo(br, "는")} ${tr + br}. 이것도 ${jo(colSums[1], "과")} 같아요. 네 줄이 모두 맞았어요.`,
          items: [T(350, `오른쪽 세로줄: ${tr} + ${br} = ${tr + br} ✓`, "red")] },
        { say: "정리해요. 빈칸이 하나뿐인 줄부터 찾아요. 줄의 합에서 아는 수를 빼서 빈칸을 구해요. 쓴 카드는 지우고, 마지막에 모든 줄을 다시 더해 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 130, w: 430, h: 260, color: "gold" }, { kind: "text", x: 560, y: 450, text: "빈칸이 하나뿐인 줄부터!", size: 34, color: "gold" }] },
        { say: "한 문제 풀어 봐요. 윗줄의 합이 11이고, 왼쪽 칸에 4가 있어요. 오른쪽 칸은 얼마일까요?", mood: "think",
          items: [],
          check: { question: "윗줄의 합이 11이고 왼쪽 칸이 4예요. 오른쪽 칸은 얼마일까요?",
            options: [String(11 + 4), String(11 - 4 - 1), String(11 - 4)], answer: 2,
            hint: "줄의 합에서 아는 수를 빼요.", sayHint: "윗줄의 합 11에서 이미 있는 4를 빼 봐요.",
            right: "맞았어요! 11 − 4 = 7이에요.", sayRight: "맞았어요! 11에서 4를 빼면 7. 4 더하기 7은 11이에요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-01/number-inference": (() => {
    const SUM = 14, cands = [];
    for (let t = 1; t <= 9; t++) { const o = SUM - t; if (o >= 0 && o <= 9) cands.push({ t, o, n: t * 10 + o }); }
    const even = (n) => n % 2 === 0, keep = cands.filter((c) => even(c.n));
    const rowY = (i) => 350 + i * 46;
    const T = (x, y, text, color = "ink", size = 32, align) => ({ kind: "text", x, y, text, size, color, align });
    const CHK_SUM = 15, CHK_LT = 80, chkAll = []; for (let t = 1; t <= 9; t++) { const o = CHK_SUM - t; if (o >= 0 && o <= 9) chkAll.push({ t, o, n: t * 10 + o }); }
    const chk = chkAll.filter((c) => c.n < CHK_LT).map((c) => c.n), chkOut = chkAll.find((c) => c.n > CHK_LT).n;
    const first = cands[0].t, both = keep.length === 2 ? "둘 다" : keep.length === 3 ? "셋 다" : "모두";
    return {
      title: "조건에 맞는 수를 찾아요",
      kicker: "1권 4단원 · 손글씨 개념",
      beats: [
        { say: "조건을 하나씩 따라가며 맞는 수를 빠짐없이 찾아볼 거예요. 하나도 빠뜨리지 않는 방법을 천천히 배워요.",
          items: [{ kind: "text", x: 60, y: 80, text: "조건에 맞는 수를 찾아요", size: 54 }] },
        { say: "두 자리 수는 칸이 두 개예요. 왼쪽이 십의 자리, 오른쪽이 일의 자리. 32라면 십의 자리 숫자는 3, 일의 자리 숫자는 2예요. 한 칸에는 0부터 9까지, 숫자 하나만 들어가요.",
          items: [{ kind: "box", x: 70, y: 120, w: 90, h: 80, color: "blue" }, { kind: "box", x: 160, y: 120, w: 90, h: 80, color: "green" }, T(115, 178, "3", "blue", 52, "center"), T(205, 178, "2", "green", 52, "center"), T(115, 228, "십의 자리", "blue", 22, "center"), T(205, 228, "일의 자리", "green", 22, "center")] },
        { say: `첫 번째 조건이에요. 십의 자리 숫자와 일의 자리 숫자를 더하면 ${jo(SUM, "이")} 돼요.`,
          items: [{ kind: "box", x: 560, y: 110, w: 410, h: 120, color: "gold" }, T(580, 160, `① 십의 자리 + 일의 자리 = ${SUM}`, "gold", 30)] },
        { say: "빠짐없이 찾으려면 순서를 정해서 하나씩 해요. 십의 자리에 1부터 차례로 넣어 봐요. 0은 넣지 않아요. 십의 자리가 0이면 두 자리 수가 아니니까요.",
          items: [T(80, 262, "십의 자리를 1부터 차례로", "gray", 24)] },
        { say: `십의 자리가 1이면 일의 자리는 ${SUM - 1}이어야 해요. 그런데 한 칸에는 9까지만 들어가요. 그래서 안 돼요. 십의 자리가 ${Array.from({ length: first - 2 }, (_, i) => i + 2).join(", ")}일 때도 일의 자리가 ${Array.from({ length: first - 2 }, (_, i) => SUM - i - 2).join(", ")}, 모두 9보다 커서 안 돼요. 그래서 십의 자리는 ${first}부터 시작해요.`,
          items: [T(80, 298, Array.from({ length: first - 1 }, (_, i) => `${i + 1}+${SUM - i - 1}`).join(", ") + "  ✗ (한 칸에 9까지)", "gray", 22)] },
        ...cands.map((c, i) => ({ say: `십의 자리가 ${c.t}이면, ${c.t}에 얼마를 더해 ${jo(SUM, "이")} 될까요? ${c.o}예요. 그래서 ${c.n}.`.replace(`${c.o}예요`, jo(c.o, "이에요")),
          items: [T(80, rowY(i), `${c.t} + ${c.o} = ${SUM}  →  ${c.n}`, "blue", 32)] })),
        { say: `십의 자리는 9까지예요. 그래서 첫 번째 조건에 맞는 수는 ${cands.map((c) => c.n).join(", ")}, 모두 ${cands.length}개예요.`,
          items: [T(560, 280, `①에 맞는 수: ${cands.map((c) => c.n).join(", ")}`, "blue", 28)] },
        { say: "두 번째 조건이에요. 짝수예요. 짝수는 일의 자리 숫자가 0, 2, 4, 6, 8인 수예요.",
          items: [T(580, 210, "② 짝수 (일의 자리가 0, 2, 4, 6, 8)", "gold", 26)] },
        ...cands.map((c, i) => ({ say: even(c.n) ? `${c.n}의 일의 자리는 ${c.o}. 짝수예요. 남겨요.` : `${c.n}의 일의 자리는 ${c.o}. 홀수예요. 지워요.`,
          items: even(c.n) ? [{ kind: "o", cx: 380, cy: rowY(i) - 11, r: 20, color: "green" }] : [{ kind: "line", x1: 70, y1: rowY(i) - 11, x2: 340, y2: rowY(i) - 11, color: "red", width: 3 }, { kind: "x", cx: 380, cy: rowY(i) - 11, r: 14, color: "red" }] })),
        { say: `두 조건에 모두 맞는 수는 ${keep.map((c) => c.n).join(", ")}, ${keep.length}개예요.`,
          items: [T(560, 340, `①과 ② 모두: ${keep.map((c) => c.n).join(", ")}`, "green", 32)] },
        { say: `마지막으로 꼭 확인해요. ${keep.map((c) => `${c.t} 더하기 ${jo(c.o, "는")} ${SUM}`).join(", ")}. 그리고 ${both} 짝수예요.`,
          items: [T(560, 395, keep.map((c) => `${c.t}+${c.o}`).join(", ") + ` 모두 ${SUM}, 모두 짝수 ✓`, "green", 24)] },
        { say: "정리해요. 첫 번째 조건에 맞는 수를 순서대로 빠짐없이 적어요. 그다음 두 번째 조건으로 하나씩 지워요. 남은 수를 두 조건에 다시 넣어 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 250, w: 440, h: 170, color: "gold" }, T(560, 480, "순서대로 적고, 하나씩 지우기!", "gold", 32)] },
        { say: `한 문제 풀어 봐요. 십의 자리 숫자와 일의 자리 숫자를 더하면 ${CHK_SUM}이고, ${CHK_LT}보다 작은 두 자리 수를 모두 찾으면 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `십의 자리 + 일의 자리 = ${CHK_SUM}이고 ${CHK_LT}보다 작은 두 자리 수를 모두 고르면?`,
            options: [chk.join(", "), [...chk, chkOut].join(", "), String(chk.at(-1))], answer: 0,
            hint: `일의 자리는 9까지예요. 십의 자리를 작은 수부터 넣어 차례로 적고, ${CHK_LT}보다 작은 것만 남겨요.`, sayHint: `일의 자리에는 9까지만 들어가니까 십의 자리는 ${chkAll[0].t}부터예요. ${chkAll.slice(0, 2).map((c) => `${c.t} 더하기 ${c.o}`).join(", ")}. 그리고 ${CHK_LT}보다 작은지 확인해요.`,
            right: `맞았어요! ${chk.map((n, i) => (i < chk.length - 1 ? jo(n, "과") : n)).join(" ")}이에요.`.replace(/(\d+)이에요/, (m, n) => jo(n, "이에요")), sayRight: `맞았어요! ${chk.join(", ")}. ${chkOut}도 ${jo(CHK_SUM, "이")} 되지만 ${CHK_LT}보다 커서 빠져요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-01/preference-logic": (() => {
    const people = ["서아", "하람", "태오"], foods = ["국수", "볶음밥", "만두"];
    const X0 = 230, Y0 = 210, S = 88;
    const c = (r, k) => ({ cx: X0 + (k + 0.5) * S, cy: Y0 + (r + 0.5) * S });
    const O = (r, k) => ({ kind: "o", ...c(r, k), r: 26, color: "green" }), Xm = (r, k) => ({ kind: "x", ...c(r, k), r: 18, color: "red" });
    const T = (y, text, color = "ink", size = 28) => ({ kind: "text", x: 560, y, text, size, color });
    return {
      title: "좋아하는 것을 찾아요",
      kicker: "1권 4단원 · 손글씨 개념",
      beats: [
        { say: "세 친구가 좋아하는 간식을 단서로 찾아볼 거예요. 표를 그려서 확실한 것부터 하나씩 표시하면 헷갈리지 않아요.",
          items: [{ kind: "text", x: 60, y: 80, text: "좋아하는 것을 찾아요", size: 54 }] },
        { say: `${people.join(", ")} 세 친구가 ${foods.join(", ")} 중에서 서로 다른 간식을 하나씩 좋아해요. 두 친구가 같은 걸 좋아하는 일은 없어요.`,
          items: [T(140, `${people.join(" · ")}  ↔  ${foods.join(" · ")}`, "blue", 28), T(185, "한 사람에 하나씩, 서로 다르게", "gray", 24)] },
        { say: "표를 그려요. 왼쪽에 친구 이름, 위에 간식 이름을 써요.",
          items: [{ kind: "grid", x: X0, y: Y0, cols: 3, rows: 3, cell: S, color: "ink" }, ...foods.map((f, k) => ({ kind: "text", x: X0 + (k + 0.5) * S, y: Y0 - 16, text: f, size: 28, align: "center", color: "blue" })), ...people.map((p, r) => ({ kind: "text", x: X0 - 14, y: Y0 + (r + 0.5) * S + 10, text: p, size: 30, align: "right", color: "blue" }))] },
        { say: "표를 읽는 법이에요. 맞으면 동그라미, 아니면 가위표. 서로 다른 것을 하나씩 고르니까, 가로 한 줄에도 동그라미는 하나, 세로 한 줄에도 동그라미는 하나뿐이에요.",
          items: [T(250, "맞으면 ○, 아니면 ×", "gray"), T(290, "가로 한 줄에 ○ 하나, 세로 한 줄에 ○ 하나", "gray", 24)] },
        { say: "첫 번째 단서예요. 서아는 국수를 좋아해요. 확실한 단서라서 바로 표시해요. 서아와 국수가 만나는 칸에 동그라미.",
          items: [T(350, "단서 1: 서아는 국수를 좋아해요.", "green"), O(0, 0)] },
        { say: "서아는 국수를 골랐으니, 서아의 다른 칸, 볶음밥과 만두에는 가위표.",
          items: [Xm(0, 1), Xm(0, 2)] },
        { say: "국수는 서아가 골랐으니, 다른 친구는 국수를 고를 수 없어요. 하람이와 태오의 국수 칸에도 가위표.",
          items: [Xm(1, 0), Xm(2, 0)] },
        { say: "두 번째 단서예요. 하람이는 만두를 좋아하지 않아요. 하람이와 만두가 만나는 칸에 가위표.",
          items: [T(395, "단서 2: 하람이는 만두를 좋아하지 않아요.", "red", 26), Xm(1, 2)] },
        { say: "하람이 줄을 봐요. 국수도 가위표, 만두도 가위표. 남은 칸은 볶음밥 하나뿐이에요. 그러니까 하람이는 볶음밥을 좋아해요.",
          items: [O(1, 1)] },
        { say: "볶음밥은 하람이가 골랐으니, 태오의 볶음밥 칸은 가위표.",
          items: [Xm(2, 1)] },
        { say: "태오 줄에 남은 칸은 만두 하나. 태오는 만두를 좋아해요.",
          items: [O(2, 2)] },
        { say: "확인해요. 가로 줄마다 동그라미가 하나씩, 세로 줄마다도 하나씩 있어요. 두 단서도 모두 맞아요. 서아는 국수, 하람이는 볶음밥, 태오는 만두.",
          items: [T(450, "서아-국수, 하람-볶음밥, 태오-만두 ✓", "green", 28)] },
        { say: "정리해요. 표를 그려요. 확실한 단서부터 동그라미를 치고, 같은 가로줄과 세로줄을 가위표로 지워요. 한 칸만 남으면 그게 답이에요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 320, w: 440, h: 160, color: "gold" }, T(540, "확실한 것부터 ○, 나머지는 ×", "gold", 30)] },
        { say: "한 문제 풀어 봐요. 수아, 이안, 하린이가 초록, 보라, 주황 연필을 하나씩 가졌어요. 이안이는 보라예요. 수아는 초록이 아니에요. 하린이가 가진 색은 무엇일까요?", mood: "think",
          items: [],
          check: { question: "수아·이안·하린이가 초록·보라·주황 연필을 하나씩 가졌어요. 이안이는 보라, 수아는 초록이 아니에요. 하린이의 색은?",
            options: ["초록", "보라", "주황"], answer: 0,
            hint: "이안이의 보라부터 표시하고, 수아에게 남은 색을 찾아요.", sayHint: "표를 떠올려 봐요. 이안이가 보라니까 수아는 보라가 아니에요. 수아는 초록도 아니니까 주황. 그럼 하린이는요?",
            right: "맞았어요! 수아가 주황이니 하린이는 초록이에요.", sayRight: "맞았어요! 이안이는 보라, 수아는 초록이 아니니 주황, 남은 초록이 하린이 거예요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-01/relative-order-running": (() => {
    const order = ["구름", "별", "바다", "하늘"];
    const slot = (i) => ({ x: 130 + i * 175, y: 300, w: 130, h: 76 });
    const box = (i, color = "gray") => ({ kind: "box", ...slot(i), color });
    const name = (i, n, color) => ({ kind: "text", x: slot(i).x + 65, y: slot(i).y + 50, text: n, size: 34, align: "center", color });
    const T = (x, y, text, color = "ink", size = 28) => ({ kind: "text", x, y, text, size, color });
    const fromBack = (k) => order.length - k + 1;   // 앞에서 k번째 = 뒤에서 (4 - k + 1)번째
    return {
      title: "앞뒤 순서를 찾아요",
      kicker: "1권 4단원 · 손글씨 개념",
      beats: [
        { say: "친구 네 명이 한 줄로 서 있어요. 단서를 보고 누가 어디에 서 있는지 찾을 거예요. 줄을 먼저 그리고, 확실한 자리부터 채워요.",
          items: [{ kind: "text", x: 60, y: 80, text: "앞뒤 순서를 찾아요", size: 54 }] },
        { say: "자리 네 개를 그려요. 왼쪽이 앞, 오른쪽이 뒤예요.",
          items: [0, 1, 2, 3].map((i) => box(i)).concat([T(60, 350, "앞", "blue", 32), T(870, 350, "뒤", "blue", 32), { kind: "arrow", x1: 140, y1: 420, x2: 830, y2: 420, color: "gray", width: 3 }]) },
        { say: "단서는 세 개예요. 구름이는 맨 앞이에요. 별이는 구름이 바로 뒤예요. 하늘이는 바다보다 뒤에 있어요.",
          items: [T(80, 150, "① 구름이는 맨 앞", "ink", 28), T(80, 195, "② 별이는 구름이 바로 뒤", "ink", 28), T(80, 240, "③ 하늘이는 바다보다 뒤", "ink", 28)] },
        { say: "확실한 단서부터 써요. 구름이는 맨 앞이니까 첫 번째 자리에 써요.",
          items: [name(0, order[0], "green"), { kind: "o", cx: 62, cy: 140, r: 14, color: "green" }] },
        { say: "별이는 구름이 바로 뒤예요. 「바로 뒤」는 딱 붙어서 한 칸 뒤라는 뜻이에요. 그래서 두 번째 자리.",
          items: [name(1, order[1], "green"), { kind: "o", cx: 62, cy: 185, r: 14, color: "green" }] },
        { say: "남은 자리는 세 번째와 네 번째, 남은 친구는 바다와 하늘이에요.",
          items: [box(2, "gold"), box(3, "gold")] },
        { say: "하늘이는 바다보다 뒤에 있어요. 「뒤에 있다」는 붙어 있지 않아도 뒤쪽이면 된다는 뜻이에요. 두 자리 중 뒤쪽은 네 번째. 그래서 하늘이가 네 번째, 바다는 세 번째예요.",
          items: [name(3, order[3], "green"), name(2, order[2], "green"), { kind: "o", cx: 62, cy: 230, r: 14, color: "green" }] },
        { say: `확인해요. ${order.join(", ")}. 구름이가 맨 앞, 별이가 바로 뒤, 하늘이가 바다보다 뒤. 세 단서가 모두 맞아요.`,
          items: [T(130, 480, `앞 ${order.join(" - ")} 뒤 ✓`, "green", 32)] },
        { say: "이번엔 뒤에서부터 세어 봐요. 맨 뒤 하늘이가 뒤에서 첫 번째, 바다가 뒤에서 두 번째, 별이가 뒤에서 세 번째, 구름이가 뒤에서 네 번째예요.",
          items: [0, 1, 2, 3].map((i) => T(slot(i).x + 65, 280, `뒤에서 ${fromBack(i + 1)}`, "red", 22)).map((x) => ({ ...x, align: "center" })) },
        { say: "앞에서 세는 것과 뒤에서 세는 것은 반대예요. 네 명이면, 앞에서 첫 번째가 뒤에서 네 번째, 앞에서 두 번째가 뒤에서 세 번째예요. 두 수를 더하면 늘 다섯이에요.",
          items: [T(560, 540, "앞에서 몇 번째 + 뒤에서 몇 번째 = 5", "gold", 26)] },
        { say: "정리해요. 줄을 먼저 그려요. 맨 앞이나 맨 뒤처럼 확실한 자리부터 채워요. 바로 뒤는 붙어서 한 칸, 뒤에 있다는 뒤쪽 어디든. 마지막에 단서를 하나씩 다시 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 110, y: 450, w: 420, h: 50, color: "gold" }] },
        { say: "한 문제 풀어 봐요. 이 줄에서 뒤에서 세 번째에 서 있는 친구는 누구일까요?", mood: "think",
          items: [],
          check: { question: `앞에서부터 ${order.join(", ")} 순서로 서 있어요. 뒤에서 세 번째는 누구일까요?`,
            options: [order[2], order[1], order[0]], answer: 1,
            hint: "맨 뒤부터 하나, 둘, 셋 세어 봐요.", sayHint: "맨 뒤 하늘이부터 세어요. 하늘이가 하나, 바다가 둘. 그다음은요?",
            right: `맞았어요! 뒤에서 세 번째는 ${jo(order[1], "이에요")}.`, sayRight: `맞았어요! 하늘, 바다, 그리고 별. 뒤에서 세 번째는 ${jo(order[1], "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-01/book1-equalize-transfer": (() => {
    const A = 12, Bn = 4, diff = A - Bn, give = diff / 2, each = A - give;
    const C = 44, X = 140, YA = 150, YB = 250;
    const cells = (n, from = 0) => Array.from({ length: n }, (_, i) => [0, from + i]);
    const T = (x, y, text, color = "ink", size = 30) => ({ kind: "text", x, y, text, size, color });
    const CA = 15, CB = 9, cgive = (CA - CB) / 2;
    return {
      title: "같아지도록 몇 개를 줄까요",
      kicker: "1권 4단원 · 손글씨 개념",
      beats: [
        { say: "많이 가진 사람이 적게 가진 사람에게 몇 개를 주면 둘이 똑같아질까요? 그림으로 하나씩 옮겨 보며 알아봐요.",
          items: [{ kind: "text", x: 60, y: 80, text: "같아지도록 몇 개를 줄까요", size: 54 }] },
        { say: `A는 구슬 ${A}개를 가지고 있어요. 한 줄로 늘어놓아요.`,
          items: [T(80, YA + 32, "A", "blue", 36), { kind: "cells", x: X, y: YA, cell: C, cells: cells(A), fill: "blue" }, T(X + A * C + 14, YA + 32, `${A}개`, "blue", 30)] },
        { say: `B는 ${Bn}개예요. A 바로 아래에 줄을 맞춰 늘어놓아요.`,
          items: [T(80, YB + 32, "B", "green", 36), { kind: "cells", x: X, y: YB, cell: C, cells: cells(Bn), fill: "green" }, T(X + A * C + 14, YB + 32, `${Bn}개`, "green", 30)] },
        { say: `줄을 맞추니 차이가 보여요. A가 B보다 ${diff}개 더 많아요. ${A} 빼기 ${Bn}는 ${diff}.`,
          items: [{ kind: "box", x: X + Bn * C - 2, y: YA - 4, w: diff * C + 4, h: C + 8, color: "red", dash: true }, T(X + Bn * C, YA + C + 34, `차이 ${A} − ${Bn} = ${diff}`, "red", 28)] },
        { say: `그러면 차이 ${diff}개를 다 주면 될까요? 아니에요. ${diff}개를 다 주면 A는 ${Bn}개, B는 ${A}개가 돼서 이번엔 B가 더 많아져요.`,
          items: [T(560, 420, `${diff}개를 다 주면 → A ${Bn}, B ${A} ✗`, "red", 26)] },
        { say: `차이를 반으로 나눠요. 반은 A가 덜 갖고, 반은 B가 더 가지면 둘이 만나요. ${diff}의 반은 ${give}.`,
          items: [{ kind: "line", x1: X + (Bn + give) * C, y1: YA - 14, x2: X + (Bn + give) * C, y2: YA + C + 14, color: "gold", width: 4, dash: true }, T(560, 470, `차이의 반: ${diff} ÷ 2 = ${give}`, "gold", 28)] },
        { say: `A의 끝에서 ${give}개를 B에게 옮겨요. 하나, 둘, 셋, 넷.`,
          items: [...cells(give, A - give).map(([, k]) => ({ kind: "x", cx: X + (k + 0.5) * C, cy: YA + C / 2, r: 14, color: "red" })), { kind: "arrow", x1: X + (A - give / 2) * C, y1: YA + C + 6, x2: X + (Bn + give / 2) * C, y2: YB - 6, color: "red" }, { kind: "cells", x: X, y: YB, cell: C, cells: cells(give, Bn), fill: "red" }] },
        { say: `세어 봐요. A는 ${A}개에서 ${give}개를 줬으니 ${each}개. B는 ${Bn}개에 ${give}개를 받았으니 ${Bn + give}개. 둘 다 ${each}개, 똑같아요.`,
          items: [T(560, 520, `A ${A} − ${give} = ${each},  B ${Bn} + ${give} = ${Bn + give} ✓`, "green", 28)] },
        { say: "왜 반만 줄까요? 하나를 주면 A는 하나 줄고, B는 하나 늘어요. 한 번 줄 때마다 차이가 둘씩 줄어들어요. 그래서 차이의 반만큼만 주면 차이가 0이 돼요.",
          items: [T(560, 570, "하나 줄 때마다 차이가 2씩 줄어요", "gray", 24)] },
        { say: "정리해요. 먼저 두 수의 차이를 구해요. 차이를 반으로 나눠요. 그 반만큼 많은 쪽에서 적은 쪽으로 옮기면 둘이 같아져요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 390, w: 440, h: 200, color: "gold" }] },
        { say: `한 문제 풀어 봐요. A가 ${CA}개, B가 ${CB}개를 가지고 있어요. A가 B에게 몇 개를 주면 같아질까요?`, mood: "think",
          items: [],
          check: { question: `A가 ${CA}개, B가 ${CB}개예요. A가 B에게 몇 개를 주어야 같아질까요?`,
            options: [String(CA - CB), String(cgive), String(CA + CB)], answer: 1,
            hint: "차이를 먼저 구하고, 그 반만큼 줘요.", sayHint: `차이는 ${CA} 빼기 ${CB}, ${jo(CA - CB, "이에요")}. 그 반은 얼마일까요?`,
            right: `맞았어요! 차이 ${CA - CB}의 반, ${jo(cgive, "이에요")}.`, sayRight: `맞았어요! ${cgive}개를 주면 A는 ${CA - cgive}개, B도 ${CB + cgive}개로 같아져요. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,...BOARDS_B02
  ,...BOARDS_B03
  ,...BOARDS_B04
  ,...BOARDS_B05
  ,...BOARDS_B06
  ,...BOARDS_B07
};
