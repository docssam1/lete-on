// 2권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문제 글·수·이름·그림 배치는 원문 시험지 그대로, 그림만 우리 색표로 새로 그린다(book-02-figures.js).
// 원문 문장 안의 작은 모양 그림은 같은 모양 글자(◆ ★ ✚ ○)로 옮겼다. 정답은 여기에 두지 않는다(비공개 DB).
import { book02Figure } from "./book-02-figures.js?v=20261028ze";

const MATRIX_PROMPT = "다음 매트릭스에서 같은 모양은 같은 수를, 다른 모양은 다른 수를 나타냅니다. 같은 줄에 있는 수를 더해 아래 빈 칸에 알맞은 수를 써 넣으시오.";
const PATTERN_PROMPT = "다음은 모양을 일정한 패턴으로 나열한 것입니다. 규칙을 찾아 □ 안에 알맞은 모양을 구하시오.";
const BALANCE_PROMPT = (grams) => `다음 그림의 양팔저울은 모두 평형을 이루고 있습니다. ◆ 1개의 무게가 ${grams}g일 때, ★ 1개의 무게를 구하시오.`;
const ORDER = ["첫 번째", "두 번째", "세 번째", "네 번째"];

// 모양 이름 줄임: c ○ · s □ · t △ · d ◇ · x 십자
const SHORT = { c: "circle", s: "square", t: "triangle", d: "diamond", x: "cross" };
const row = (letters) => letters.split(" ").map((piece) => SHORT[piece] || piece);
const grid = (lines) => lines.map((letters) => letters.split("").map((letter) => SHORT[letter]));

const ORIGINALS = {
  1: () => ({
    prompt: MATRIX_PROMPT,
    visual: { type: "matrix", cells: grid(["dst", "ssd", "tsc"]), rowSums: [13, 14, 14], columnSums: [13, 12, null] },
    responseKind: "fill"
  }),
  2: () => ({
    prompt: MATRIX_PROMPT,
    visual: { type: "matrix", cells: grid(["cctd", "dcss", "cccs", "dccs"]), rowSums: [null, 11, 11, 12], columnSums: [14, 12, 13, 10] },
    responseKind: "fill"
  }),
  3: () => ({
    prompt: "17개의 큐브가 있습니다. 나경이가 정인이보다 큐브를 5개 더 많이 가지려면 두 사람은 각각 몇 개의 큐브를 가져야 하는지 구하시오.",
    visual: { type: "blank" }
  }),
  4: () => ({
    prompt: "해준이는 사탕 18개를, 규민이는 사탕 4개를 가지고 있습니다. 해준이가 사탕 몇 개를 규민이에게 주어야 두 사람의 사탕 개수가 같아지는지 구하시오.",
    visual: { type: "blank" }
  }),
  5: () => ({
    prompt: "규민이네 반과 재윤이네 반 학생들을 모두 합하면 59명입니다. 규민이네 반이 재윤이네 반보다 7명 더 많다면 두 반의 학생 수는 각각 몇 명인지 구하시오.",
    visual: { type: "blank" }
  }),
  6: () => ({
    prompt: "다음 그림에서 각 도형은 2에서 5까지 서로 다른 수를 나타냅니다. ✚가 나타내는 수를 구하시오.",
    visual: { type: "equations", cards: [2, 3, 4, 5], rows: [row("s + s = d"), row("c + c = s + d"), row("s + c = x")] }
  }),
  7: () => ({
    prompt: BALANCE_PROMPT(2),
    visual: { type: "balances", scales: [
      { left: ["circle"], right: [{ kind: "diamond", label: 2 }, { kind: "diamond", label: 2 }] },
      { left: ["square", "square"], right: ["diamond", "circle", "circle"] },
      { left: ["diamond", "square"], right: ["star"] }
    ] }
  }),
  8: () => ({
    prompt: "다음 각 도형은 2에서 5까지의 서로 다른 수를 나타냅니다. ○가 나타내는 수를 구하시오.",
    visual: { type: "equations", cards: [2, 3, 4, 5], rows: [row("d + d + d = s + s + s + s"), row("d + d = t + s"), row("t + c = d + s")] }
  }),
  9: () => ({
    prompt: BALANCE_PROMPT(4),
    visual: { type: "balances", scales: [
      { left: ["circle"], right: [{ kind: "diamond", label: 4 }, { kind: "diamond", label: 4 }] },
      { left: ["square", "square"], right: ["diamond", "circle"] },
      { left: ["diamond", "square"], right: ["star", "star"] }
    ] }
  }),
  10: () => ({
    prompt: PATTERN_PROMPT,
    visual: { type: "sequences", rows: [
      row("c t s c t s c t s"),
      row("c d d c c d d c c")
    ] },
    responseKind: "fill"
  }),
  11: () => ({
    prompt: PATTERN_PROMPT,
    // 원문: 모양은 ○◇☆♡ 차례, 색칠한 모양과 빈 모양이 섞여 있다(색칠 여부가 규칙)
    visual: { type: "sequences", rows: [[
      ["circle", "hollow"], ["diamond", "solid"], ["star", "hollow"], ["heart", "hollow"], ["circle", "solid"], ["diamond", "hollow"], ["star", "hollow"],
      ["heart", "solid"], ["circle", "hollow"], ["diamond", "hollow"], ["star", "solid"], ["heart", "hollow"], ["circle", "hollow"]
    ].map(([kind, mode]) => ({ kind, mode }))] },
    responseKind: "fill"
  }),
  12: () => ({
    prompt: "다음은 어떤 규칙에 따라 수를 나열한 것입니다. 수열의 규칙을 찾아 (   ) 안에 알맞은 수를 써 넣으시오.",
    visual: { type: "numberLines", lines: [
      "(1) 14, 13, 12, 18, 17, 16, 22, 21, 20, (      ), …",
      "(2) 6, 4, 2, 7, 5, 3, 8, 6, 4, 9, (      ), 5, …"
    ] },
    responseKind: "fill"
  }),
  13: () => ({
    prompt: "다음과 같이 성냥개비를 붙여 오각형을 만들려고 합니다. 오각형 7개를 만들려면 성냥개비 몇 개가 필요한지 구하시오.",
    visual: { type: "matchHouses", labels: ORDER.slice(0, 3) }
  }),
  14: () => ({
    prompt: "다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. 8번째 그림에서 흰색 삼각형은 검은색 삼각형보다 몇 개 더 많은지 구하시오.",
    visual: { type: "triangleGrowth", labels: ORDER }
  }),
  15: () => ({
    prompt: "정사각형 모양의 종이를 그림과 같이 계속 반으로 접었습니다. 이런 식으로 종이를 접은 후에 다시 펼쳐서 접힌 부분을 따라 종이를 잘랐더니 64장이 되었습니다. 종이를 몇 번 접은 후에 자른 것인지 구하시오.",
    visual: { type: "halfFolds", labels: ["1번", "2번", "3번"] }
  }),
  16: () => ({
    prompt: "다음 수 사이의 관계를 찾아 색칠된 빈칸에 알맞은 수를 써넣으시오.",
    visual: { type: "relationTable", rows: [[5, 1, 8, 13], [15, 2, 1, 6], [19, 3, 6, 17], [34, 7, null, 42]] },
    responseKind: "fill"
  }),
  17: () => ({
    prompt: "다음 수 퍼즐의 규칙을 찾아 빈 칸을 채우시오.",
    visual: { type: "linkedRows", rows: [[9, 7, 6, null], [8, 3, 5, 10], [5, 2, 4, 7], [9, 1, 3, 11]] },
    responseKind: "fill"
  }),
  18: () => ({
    prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 빈칸에 알맞은 수를 구하시오.",
    visual: { type: "triangleRules", items: [
      { top: 4, left: 5, right: 15, center: 6 }, { top: 8, left: 7, right: 23, center: 8 },
      { top: 2, left: 6, right: 13, center: 5 }, { top: 4, left: 8, right: 21, center: null }
    ] },
    responseKind: "fill"
  }),
  19: () => ({
    prompt: "가로줄, 세로줄, 굵은 선으로 나누어진 블록 안에 1부터 3까지의 수가 한 번씩 들어가는 스도쿠 퍼즐을 완성하시오.",
    visual: { type: "sudoku", size: 3, blocks: [0, 0, 1, 0, 1, 1, 2, 2, 2], given: [3, null, null, null, null, 1, null, null, null] },
    responseKind: "fill"
  }),
  20: () => ({
    prompt: "1, 2, 3, 4가 가로줄, 세로줄, 굵은 선으로 나누어진 부분에 각각 한 번씩만 들어가도록 스도쿠 퍼즐을 완성하시오.",
    visual: { type: "sudoku", size: 4, blocks: [0, 0, 0, 1, 2, 2, 0, 1, 2, 3, 1, 1, 2, 3, 3, 3], given: [null, 3, null, 2, 3, null, null, null, null, null, 1, null, 4, null, null, null] },
    responseKind: "fill"
  }),
  21: () => ({
    prompt: "다음 수 사이의 관계를 찾아 빈칸에 알맞은 수를 써 넣으시오.",
    visual: { type: "diamondRules", items: [
      { top: 3, left: 2, right: 4, bottom: 3, center: 6 }, { top: 8, left: 5, right: 4, bottom: 6, center: 7 },
      { top: 5, left: 3, right: 4, bottom: 6, center: 8 }, { top: 9, left: 7, right: 1, bottom: 8, center: null }
    ] },
    responseKind: "fill"
  }),
  22: () => ({
    prompt: MATRIX_PROMPT,
    visual: { type: "matrix", cells: grid(["sccs", "xdtd", "ccsc"]), rowSums: [12, null, 10], columnSums: [13, 10, 11, 12] },
    responseKind: "fill"
  }),
  23: () => ({
    prompt: "다음 각 도형은 1부터 9까지의 수 중에서 서로 다른 수를 나타냅니다. ○가 나타내는 수를 구하시오.",
    visual: { type: "equations", rows: [row("d + d + d = s + s + s + s"), row("t + t + t = s + s + s + s + s"), row("d + t = s + c")] }
  }),
  24: () => ({
    prompt: "재이가 준이에게 준이가 가지고 있던 만큼의 구슬을 주었더니 두 사람은 각각 12개의 구슬을 가지게 되었습니다. 재이가 처음 가지고 있던 구슬의 개수는 몇 개인지 구하시오.",
    visual: { type: "blank" }
  }),
  25: () => ({
    prompt: "다음과 같은 모양으로 바둑돌을 늘어놓을 때, 처음으로 흰색 바둑돌이 검은색 바둑돌보다 많아지는 것은 몇 번째인지 구하시오.",
    visual: { type: "stoneGrowth", stages: [2, 3, 4, 5, 6, 7] }
  })
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const make = ORIGINALS[Number(number)];
  return make ? { number: Number(number), ...make() } : null;
}
export const figure = book02Figure;
