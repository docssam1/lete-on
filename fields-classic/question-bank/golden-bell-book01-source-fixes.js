export function applyBook01SourceFixes(books) {
  const book = books.find((candidate) => candidate.id === "book-01");
  if (!book) return;

  const clock = book.lessons.find((lesson) => lesson.id === "clock-turning");
  if (clock?.experience) {
    clock.experience.start = 12;
    clock.experience.beats = [
      { id: "start", action: "draw", quarterTurns: 0, result: 12, caption: "바늘이 12를 가리키고 있습니다." },
      { id: "full-turn", action: "transform", quarterTurns: 4, result: 12, caption: "시계 방향으로 한 바퀴 돌리면 다시 12를 가리킵니다." },
      { id: "half-turn", action: "transform", quarterTurns: 2, result: 6, caption: "시계 방향으로 반 바퀴 돌리면 6을 가리킵니다." },
      { id: "half-counter-turn", action: "transform", quarterTurns: -2, result: 6, caption: "시계 반대 방향으로 반 바퀴 돌려도 6을 가리킵니다." },
      { id: "quarter-turn", action: "transform", quarterTurns: 1, result: 3, caption: "시계 방향으로 반의 반 바퀴 돌리면 3을 가리킵니다." },
      { id: "counter-quarter-turn", action: "transform", quarterTurns: -1, result: 9, caption: "시계 반대 방향으로 반의 반 바퀴 돌리면 9를 가리킵니다." }
    ];
    clock.experience.openingPrompt = clock.original.prompt;
    clock.experience.check = {
      prompt: "12를 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디를 가리킬까요?",
      options: ["3", "6", "9"],
      answerRef: clock.original.items.find((item) => item.id === "half-clockwise").answerRef
    };
    clock.explanation.headline = "12에서 출발해 방향과 회전량에 따라 바늘을 돌려 봅니다.";
    clock.explanation.steps = clock.experience.beats.slice(1).map((beat) => beat.caption);
    clock.experience.finalStill.visibleBeatIds = clock.experience.beats.map((beat) => beat.id);
  }

  const digital = book.lessons.find((lesson) => lesson.id === "digital-turn-flip");
  if (!digital) return;
  const halfTurn = digital.original.items.find((item) => item.id === "half-0" || item.id === "half-8");
  if (halfTurn) {
    halfTurn.id = "half-8";
    halfTurn.prompt = "디지털 숫자 8을 시계 방향으로 반 바퀴 돌리면 어떤 숫자가 되는지 쓰시오.";
    halfTurn.visual.digits = [8];
    halfTurn.answerRef = "/books/book-01/lessons/2/original/source-half-eight";
  }

  if (!digital.original.items.some((item) => item.id === "arithmetic-8-three-digit")) {
    const answerRef = "/books/book-01/lessons/2/original/source-arithmetic-8-three-digit";
    const expressions = ["123 + 54", "237 + 41", "354 + 26", "447 + 35"];
    digital.original.items.push({
      id: "arithmetic-8-three-digit",
      sourceNo: "8-연산 2",
      printGroup: 10,
      typeLabel: "세 자리 덧셈",
      sourceLocator: "교사용 슬라이드 8",
      prompt: "세 자리 덧셈을 계산하세요.",
      visual: { kind: "book1", subtype: "arithmetic-list", expressions },
      parts: expressions.map((expression, index) => ({
        id: String.fromCharCode(97 + index),
        label: expression.replaceAll(" ", ""),
        answerRef: `${answerRef}/parts/${index}`
      })),
      answerRef
    });
  }
  book.source.note = "교사용 원본의 133개 학습·연산 묶음을 수록. 4쪽 디지털 숫자와 8쪽 세 자리 덧셈을 원본에 맞춰 보완.";
}
