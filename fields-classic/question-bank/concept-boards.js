// 손글씨 판서 대본. 한 비트 = 독쌤 말 한 마디 + 칠판에 새로 그리는 것 한두 개.
// 원장 2026-10-25 「대본은 간단히 말고 천천히 충분히 자세히」 — 한 단계를 여러 비트로 나눠 천천히 간다(세는 것은 하나씩 센다).
// 글은 우리가 쓴 것(골든벨 원문을 베끼지 않는다). 확인 문제의 정답은 아래 규칙 함수로 계산하고, 골든벨 정답 DB는 쓰지 않는다.
// 좌표는 1000×600 칠판 기준. 시계 숫자 n의 자리는 concept-board.js의 clockPoint가 계산한다.

// 독쌤 음성 파일의 줄 id. 내보내기(tools/export-board-voice.mjs)와 재생(concept-board.js → study.js)이 같은 규칙을 쓴다.
//   비트 n번째 말 → fcb-<판서>-bNN · 확인 문제의 힌트/정답/공개 말 → fcb-<판서>-hint|right|reveal
export const lineId = (boardKey, kind, n = 0) => `fcb-${boardKey.replace(/[^a-z0-9]+/gi, "-")}-${kind === "b" ? `b${String(n).padStart(2, "0")}` : kind}`;

// 시계: 숫자 start에서 quarters(반의 반 바퀴 단위, 시계 방향 +)만큼 돌린 자리
export const landing = (start, quarters) => ((start - 1 + quarters * 3) % 12 + 12) % 12 + 1;
// 모눈: 칸 [줄, 칸]을 거울·돌리기로 옮긴 자리(rows×cols)
export const mirrorLR = (cells, cols) => cells.map(([r, c]) => [r, cols - 1 - c]);
export const mirrorTB = (cells, rows) => cells.map(([r, c]) => [rows - 1 - r, c]);
export const turnHalf = (cells, rows, cols) => cells.map(([r, c]) => [rows - 1 - r, cols - 1 - c]);

// 디지털 숫자(막대 일곱 개). 이름은 game-digital.js와 같다: a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데
export const DIGIT_SEGMENTS = Object.freeze({ 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" });
export const SEGMENT_MAPS = Object.freeze({
  "mirror-left-right": { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" },
  "mirror-top-bottom": { a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" },
  "rotate-half": { a: "d", b: "e", c: "f", d: "a", e: "b", f: "c", g: "g" }
});
export const moveSegs = (on, op) => [...on].map((s) => SEGMENT_MAPS[op][s]).sort().join("");
// 옮긴 막대가 어떤 숫자인지(숫자가 아니면 null) — 확인 문제의 정답은 이걸로 계산한다
export const readDigit = (on) => { const key = [...on].sort().join(""); const hit = Object.entries(DIGIT_SEGMENTS).find(([, v]) => v === key); return hit ? Number(hit[0]) : null; };
export const transformDigit = (d, op) => readDigit(moveSegs(DIGIT_SEGMENTS[d], op));
// 막대 하나의 양 끝 좌표. 숫자 상자 (x, y) 왼쪽 위, 높이 h, 폭 h×0.55. 끝을 조금 띄워 막대가 서로 닿지 않게 한다.
export function segGeom(x, y, h, seg) {
  const w = h * 0.55, t = h * 0.07, mid = y + h / 2;
  return {
    a: [x + t, y, x + w - t, y], d: [x + t, y + h, x + w - t, y + h], g: [x + t, mid, x + w - t, mid],
    b: [x + w, y + t, x + w, mid - t], c: [x + w, mid + t, x + w, y + h - t], e: [x, mid + t, x, y + h - t], f: [x, y + t, x, mid - t]
  }[seg];
}
export const segMid = (x, y, h, seg) => { const [x1, y1, x2, y2] = segGeom(x, y, h, seg); return [(x1 + x2) / 2, (y1 + y2) / 2]; };

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
        { say: `새 모양을 읽어요. ${flipped}이에요. 2를 오른쪽으로 뒤집으면 ${flipped}가 돼요.`,
          items: [{ kind: "text", x: D5.x + 20, y: 310, text: String(flipped), size: 34, color: "red" }, { kind: "text", x: 660, y: 150, text: `오른쪽으로 뒤집기: 2 → ${flipped}`, size: 36, color: "red" }] },
        { say: `아래쪽으로 뒤집으면 이번에는 위 막대와 아래 막대가 바뀌어요. 왼쪽 오른쪽은 그대로예요. 3은 위아래가 똑같이 생겨서 아래로 뒤집어도 ${sym}이에요.`,
          items: [{ kind: "text", x: 660, y: 210, text: `아래로 뒤집기: 위 ↔ 아래, 3 → ${sym}`, size: 27, color: "gray" }] },
        { say: "이번에는 6이에요. 위, 왼쪽 위, 가운데, 왼쪽 아래, 아래, 오른쪽 아래. 여섯 막대가 켜져요.",
          items: [{ kind: "digit", ...D6, h: H, on: DIGIT_SEGMENTS[6], color: "blue" }, { kind: "text", x: D6.x + 20, y: 520, text: "6", size: 34, color: "blue" }] },
        { say: "반 바퀴 돌리기는 판을 거꾸로 세우는 거예요. 위아래도 바뀌고 좌우도 바뀌어요. 막대는 대각선 맞은편으로 가요.",
          items: [{ kind: "arc", cx: (D6.x + H * 0.55 + D9.x) / 2, cy: D6.y + H / 2, r: 30, from: 8, to: 4, color: "green" }, { kind: "digit", ...D9, h: H, on: "", color: "green" }] },
        { say: "위 막대는 아래로. 왼쪽 아래 막대는 오른쪽 위로. 왼쪽 위 막대는 오른쪽 아래로. 가운데만 그대로예요.",
          items: [ar(D6, "a", D9, "d", H, "green", 0), ar(D6, "f", D9, "c", H, "green", 0)] },
        { say: `켜진 막대 여섯 개를 하나씩 옮기면 새 모양이 돼요. 읽어 보면 ${turned}이에요.`,
          items: [{ kind: "digit", ...D9, h: H, on: moveSegs(DIGIT_SEGMENTS[6], "rotate-half"), color: "green", dim: false }, { kind: "text", x: D9.x + 20, y: 520, text: String(turned), size: 34, color: "green" }] },
        { say: `6을 반 바퀴 돌리면 ${turned}. 뒤집기와 돌리기는 결과가 달라요. 꼭 막대를 따라가며 확인해요.`,
          items: [{ kind: "text", x: 660, y: 300, text: `반 바퀴 돌리기: 6 → ${turned}`, size: 36, color: "green" }] },
        { say: "두 자리 수는 조금 더 생각해요. 16을 써 봐요. 왼쪽에 1, 오른쪽에 6이에요.",
          items: [{ kind: "digit", ...T1, h: S, on: DIGIT_SEGMENTS[1], color: "blue" }, { kind: "digit", ...T6, h: S, on: DIGIT_SEGMENTS[6], color: "blue" }, { kind: "text", x: 700, y: 490, text: "16", size: 30, color: "blue" }] },
        { say: `판 전체를 반 바퀴 돌리면 숫자 모양만 바뀌는 게 아니라, 왼쪽에 있던 숫자가 오른쪽 자리로 가요. 6은 ${turned}가 되어 왼쪽으로, 1은 1 그대로 오른쪽으로. 그래서 16은 ${turned}1이 돼요.`,
          items: [{ kind: "arrow", x1: 830, y1: 414, x2: 860, y2: 414, color: "green", width: 3 }, { kind: "digit", ...R9, h: S, on: moveSegs(DIGIT_SEGMENTS[6], "rotate-half"), color: "green" }, { kind: "digit", ...R1, h: S, on: moveSegs(DIGIT_SEGMENTS[1], "rotate-half"), color: "green" }, { kind: "text", x: 870, y: 490, text: `${turned}1`, size: 30, color: "green" }] },
        { say: "정리해요. 옆으로 뒤집기는 왼쪽과 오른쪽 막대가 바뀌고, 아래로 뒤집기는 위와 아래 막대가 바뀌고, 반 바퀴 돌리기는 둘 다 바뀌어요. 두 자리 수는 자리 순서도 함께 바뀌어요.", mood: "praise",
          items: [{ kind: "box", x: 640, y: 100, w: 340, h: 420, color: "gold" }, { kind: "text", x: 660, y: 560, text: "막대를 하나씩 따라가요!", size: 32, color: "gold" }] },
        { say: `한 문제 풀어 봐요. ${turned}를 반 바퀴 돌리면 어떤 숫자가 될까요? 막대를 하나씩 대각선 맞은편으로 옮겨 봐요.`, mood: "think",
          items: [],
          check: { question: `${turned}를 반 바퀴 돌리면 어떤 숫자가 될까요?`,
            options: [String(turned), String(transformDigit(turned, "rotate-half")), "8"], answer: 1,
            hint: "반 바퀴는 위아래도 좌우도 바뀌어요. 위 막대가 어디로 가는지 봐요.", sayHint: "반 바퀴 돌리기는 위아래도 좌우도 바뀌어요. 위 막대가 아래로 가면 어떤 모양이 되는지 봐요.",
            right: `맞았어요! ${turned}를 반 바퀴 돌리면 ${transformDigit(turned, "rotate-half")}이에요.`, sayRight: `맞았어요! ${turned}를 반 바퀴 돌리면 ${transformDigit(turned, "rotate-half")}. 6과 ${turned}는 서로 반 바퀴 짝이에요. 이제 게임으로 손에 익혀 봐요.` } }
      ]
    };
  })()
};
