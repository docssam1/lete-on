import { enhanceBook01Folding } from "./golden-bell-book01-folding.js?v=20260922d";

const OPENINGS = {
  "clock-turning": "바늘이 2에서 출발합니다. 한 바퀴, 반 바퀴, 반의 반 바퀴를 돌렸을 때 가리키는 수를 각각 알아보세요.",
  "mirror-reflection": "그림을 옆 거울과 위아래 거울에 비추면 어떻게 달라질까요?",
  "digital-turn-flip": "디지털 숫자 2를 좌우로 뒤집은 모양과 반 바퀴 돌린 모양을 비교하세요.",
  "fold-one-cut": "색종이의 왼쪽 반을 오른쪽으로 접어 표시한 부분을 잘랐습니다. 펼치면 어떤 모양일까요?",
  "fold-two-cut": "색종이를 오른쪽으로, 다시 아래쪽으로 접고 접은 선 밖에 구멍 하나를 뚫었습니다. 펼치면 구멍은 어디에 몇 개 생길까요?",
  "equal-line-sums": "가로줄과 세로줄의 합이 같도록 위쪽 빈칸에 수를 넣으세요.",
  "equal-line-placement": "1, 2, 3, 4, 5를 한 번씩 놓아 두 줄의 합을 같게 만드세요. 가운데에 3을 놓고 시작해 보세요.",
  "gakuro-sum-grid": "빈 세 칸에 4, 5, 6을 한 번씩 넣어 가로와 세로의 합을 맞추세요.",
  "number-inference": "각 자리 숫자의 합이 4인 두 자리 홀수를 모두 찾으세요.",
  "preference-logic": "민, 준, 소는 사과, 포도, 배 중 서로 다른 과일을 하나씩 좋아합니다. 소가 좋아하는 과일은 무엇일까요?",
  "relative-order-running": "A, B, C, D가 한 줄로 섰습니다. 조건에 맞게 앞에서부터 놓아 보세요.",
  "book1-equalize-transfer": "A는 9개, B는 5개를 가지고 있습니다. A가 B에게 몇 개를 주면 같아질까요?"
};

export function enhanceBook01Flow(books) {
  const book = books.find((entry) => entry.id === "book-01");
  if (!book) return;
  enhanceBook01Folding(book);
  for (const lesson of book.lessons) {
    const experience = lesson.experience;
    if (!OPENINGS[lesson.id]) continue;
    experience.openingPrompt = OPENINGS[lesson.id];
    experience.flowRevision = "20260922c";
    experience.openingConditions = lesson.id === "preference-logic"
      ? ["민은 사과를 좋아합니다.", "준은 배를 좋아하지 않습니다."]
      : lesson.id === "relative-order-running"
        ? ["A는 제일 뒤에 있습니다.", "C는 A 바로 앞에 있습니다.", "D는 B와 C 사이에 있습니다."]
        : [];
    if (lesson.id === "digital-turn-flip") {
      experience.beats[3].caption = "처음 숫자 2를 각각 뒤집거나 돌린 결과를 나란히 비교합니다.";
    }
    if (lesson.id === "fold-two-cut") {
      experience.beats[1].caption = "왼쪽 반을 오른쪽으로 접어 두 겹으로 포갭니다.";
      experience.beats[2].caption = "위쪽 반을 아래쪽으로 접고, 네 겹을 함께 뚫습니다.";
      experience.beats[3].caption = "아래로 접었던 반을 위로 펼치면 구멍이 위아래 두 곳에 보입니다.";
    }
    if (lesson.id === "mirror-reflection") {
      experience.beats[3].caption = "옆 거울은 좌우만, 위아래 거울은 위아래만 바뀌는지 비교합니다.";
    }
  }
}
