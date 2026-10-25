// 손글씨 판서 대본. 한 비트 = 독쌤 말 한 마디 + 칠판에 새로 그리는 것 한두 개.
// 글은 우리가 쓴 것(골든벨 원문을 베끼지 않는다). 확인 문제의 정답은 아래 규칙 함수로 계산하고, 골든벨 정답 DB는 쓰지 않는다.
// 좌표는 1000×600 칠판 기준. 시계 숫자 n의 자리는 concept-board.js의 clockPoint가 계산한다.

// 시계: 숫자 start에서 quarters(반의 반 바퀴 단위, 시계 방향 +)만큼 돌린 자리
export const landing = (start, quarters) => ((start - 1 + quarters * 3) % 12 + 12) % 12 + 1;
// 모눈: 칸 [줄, 칸]을 거울·돌리기로 옮긴 자리(rows×cols)
export const mirrorLR = (cells, cols) => cells.map(([r, c]) => [r, cols - 1 - c]);
export const mirrorTB = (cells, rows) => cells.map(([r, c]) => [rows - 1 - r, c]);
export const turnHalf = (cells, rows, cols) => cells.map(([r, c]) => [rows - 1 - r, cols - 1 - c]);

const CLOCK = { cx: 300, cy: 345, r: 170 };
const shape = [[0, 0], [1, 0], [2, 0], [2, 1]];   // 처음 모양(왼쪽 줄 세 칸 + 아래 한 칸): 좌우·위아래·반 바퀴가 모두 다른 모양이 된다
const G = { cols: 3, rows: 3, cell: 56 };

export const BOARDS = {
  "book-01/clock-turning": {
    title: "시계 바늘을 돌려요",
    kicker: "1권 1단원 · 손글씨 개념",
    beats: [
      { say: "오늘은 시계 바늘을 돌려 볼 거예요. 바늘이 어디로 가는지 같이 봐요.",
        items: [{ kind: "text", x: 60, y: 86, text: "시계 바늘을 돌려요", size: 58 }] },
      { say: "시계판이에요. 회색 바늘을 2에 놓고 출발해요.",
        items: [{ kind: "clock", ...CLOCK, hand: 2, handColor: "gray" }, { kind: "text", x: 60, y: 560, text: "출발: 2", size: 34, color: "gray" }] },
      { say: "한 바퀴를 돌면 시계판을 다 돌아서 처음 자리 2로 와요.",
        items: [{ kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 205, from: 2, to: 2, color: "gold", dash: true }, { kind: "text", x: 560, y: 180, text: "한 바퀴 → 처음 자리 2", size: 40, color: "gold" }] },
      { say: "반 바퀴를 돌면 맞은편이에요. 2의 맞은편은 8이에요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, 2), color: "red" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 205, from: 2, to: landing(2, 2), color: "red" }, { kind: "text", x: 560, y: 260, text: `반 바퀴 → 맞은편 ${landing(2, 2)}`, size: 40, color: "red" }] },
      { say: "반의 반 바퀴는 숫자 세 칸이에요. 2에서 시계 방향으로 세 칸 가면 5예요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, 1), color: "blue" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 225, from: 2, to: landing(2, 1), color: "blue" }, { kind: "text", x: 560, y: 340, text: `반의 반 바퀴 → 세 칸, ${landing(2, 1)}`, size: 40, color: "blue" }] },
      { say: "반대 방향으로 세 칸 가면 11이에요. 방향이 바뀌면 자리도 달라져요.",
        items: [{ kind: "hand", ...CLOCK, to: landing(2, -1), color: "green" }, { kind: "arc", cx: CLOCK.cx, cy: CLOCK.cy, r: 225, from: 2, to: landing(2, -1), ccw: true, color: "green" }, { kind: "text", x: 560, y: 420, text: `반대로 세 칸 → ${landing(2, -1)}`, size: 40, color: "green" }] },
      { say: "한 바퀴는 처음 자리, 반 바퀴는 맞은편, 반의 반 바퀴는 세 칸. 이것만 기억하면 돼요.", mood: "praise",
        items: [{ kind: "box", x: 540, y: 130, w: 420, h: 320, color: "gold" }, { kind: "text", x: 560, y: 520, text: "기억해요!", size: 44, color: "gold" }] },
      { say: "이제 한 문제 풀어 봐요. 3에서 시계 방향으로 반 바퀴 돌리면 어디일까요?", mood: "think",
        items: [],
        check: { question: "3을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어떤 수를 가리킬까요?",
          options: [String(landing(3, 1)), String(landing(3, 2)), String(landing(3, 4))], answer: 1,
          hint: "반 바퀴는 맞은편이에요. 3의 맞은편을 찾아요.", sayHint: "반 바퀴는 맞은편이에요. 3의 맞은편이 어디인지 시계판을 봐요.",
          right: "맞았어요! 반 바퀴는 맞은편이에요.", sayRight: "맞았어요! 3의 맞은편은 9예요. 이제 게임으로 손에 익혀 봐요." } }
    ]
  },

  "book-01/mirror-reflection": {
    title: "거울에 비친 모양을 찾아요",
    kicker: "1권 1단원 · 손글씨 개념",
    beats: [
      { say: "거울에 비친 모양은 어떻게 생겼을까요? 처음 모양부터 그려 봐요.",
        items: [{ kind: "text", x: 60, y: 76, text: "거울에 비친 모양을 찾아요", size: 54 }] },
      { say: "처음 모양이에요. 왼쪽 줄에 세 칸, 맨 아래에 한 칸이 더 있어요.",
        items: [{ kind: "grid", x: 110, y: 120, ...G }, { kind: "cells", x: 110, y: 120, cell: G.cell, cells: shape, fill: "blue" }, { kind: "text", x: 110, y: 330, text: "처음 모양", size: 30, color: "gray" }] },
      { say: "오른쪽에 거울을 세워요. 거울에 비추면 왼쪽과 오른쪽만 바뀌어요. 높이는 그대로예요.",
        items: [{ kind: "line", x1: 318, y1: 100, x2: 318, y2: 320, color: "gold", width: 5, dash: true }, { kind: "text", x: 300, y: 350, text: "오른쪽 거울", size: 28, color: "gold", align: "center" },
          { kind: "grid", x: 358, y: 120, ...G }, { kind: "cells", x: 358, y: 120, cell: G.cell, cells: mirrorLR(shape, G.cols), fill: "red" }] },
      { say: "거울에 가까운 칸은 건너편에서도 거울 가까이에 와요. 멀리 있던 왼쪽 줄은 오른쪽 끝으로 가요.",
        items: [{ kind: "arrow", x1: 150, y1: 136, x2: 486, y2: 136, bend: 70, color: "red" }, { kind: "text", x: 560, y: 150, text: "좌우만 바뀜, 높이 그대로", size: 38, color: "red" }] },
      { say: "이번에는 아래에 거울을 놓아요. 아래 거울은 위와 아래만 바꿔요. 왼쪽 오른쪽은 그대로예요.",
        items: [{ kind: "line", x1: 100, y1: 372, x2: 290, y2: 372, color: "gold", width: 5, dash: true }, { kind: "text", x: 110, y: 575, text: "아래 거울", size: 28, color: "gold" },
          { kind: "grid", x: 110, y: 390, ...G }, { kind: "cells", x: 110, y: 390, cell: G.cell, cells: mirrorTB(shape, G.rows), fill: "green" }, { kind: "text", x: 560, y: 230, text: "위아래만 바뀜, 좌우 그대로", size: 38, color: "green" }] },
      { say: "정리해요. 옆 거울은 좌우만, 위아래 거울은 위아래만 바꿔요. 거울에 가까운 칸은 그대로 가까이 둬요.", mood: "praise",
        items: [{ kind: "box", x: 540, y: 300, w: 420, h: 200, color: "gold" }, { kind: "text", x: 565, y: 360, text: "옆 거울: 좌우만", size: 38 }, { kind: "text", x: 565, y: 420, text: "위아래 거울: 위아래만", size: 38 }, { kind: "text", x: 565, y: 478, text: "가까운 칸은 그대로 가까이", size: 38 }] },
      { say: "한 문제 풀어 봐요. 처음 모양을 왼쪽 거울에 비추면 어떤 모양일까요? 좌우만 바뀐 것을 골라요.", mood: "think",
        items: [],
        check: { question: "처음 모양을 왼쪽 거울에 비추면 어떤 모양일까요?",
          options: [{ ...G, cells: mirrorTB(shape, G.rows), fill: "green" }, { ...G, cells: turnHalf(shape, G.rows, G.cols), fill: "gray" }, { ...G, cells: mirrorLR(shape, G.cols), fill: "red" }], answer: 2,
          hint: "옆 거울은 좌우만 바꿔요. 높이가 그대로인 것을 찾아요.", sayHint: "왼쪽 거울도 옆 거울이에요. 좌우만 바뀌고 높이는 그대로인 모양을 찾아요.",
          right: "맞았어요! 왼쪽 거울도 오른쪽 거울과 같은 모양이 돼요.", sayRight: "맞았어요! 왼쪽 거울이든 오른쪽 거울이든 좌우만 바뀌어서 같은 모양이 돼요. 이제 게임으로 가요." } }
    ]
  }
};
