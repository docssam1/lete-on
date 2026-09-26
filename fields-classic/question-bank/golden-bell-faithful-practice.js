// Versioned questions only. Answers are supplied by the protected book response.
export const FAITHFUL_REVISION = "20260922a";
export const FAITHFUL_LESSONS = {
  "balance-substitution": { bookId: "book-04", structureKey: "balance-shape-unit-substitution" },
  "cardinal-placement": { bookId: "book-04", structureKey: "two-by-two-cardinal-placement" },
  "checkerboard-product-matrix": { bookId: "book-05", structureKey: "checkerboard-product-matrix" },
  "elapsed-time": { bookId: "book-07", structureKey: "clock-elapsed-and-end-time" },
  "vertical-shape-cryptarithm": { bookId: "book-08", structureKey: "vertical-symbol-addition-with-carry" }
};

export function timeLabel(minutes) {
  const hour = Math.floor(minutes / 60);
  return `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}시 ${minutes % 60}분`;
}

export function faithfulQuestion(lessonId, variant) {
  if (!Number.isInteger(variant) || variant < 0 || variant > 3) throw new Error("faithful_variant_out_of_range");
  const metadata = FAITHFUL_LESSONS[lessonId];
  if (!metadata) throw new Error("faithful_lesson_unknown");
  const item = {
    id: `${lessonId}:faithful:${FAITHFUL_REVISION}:${variant}`,
    title: "유사문제", story: "", structureKey: metadata.structureKey,
    answerMode: "input", inputMode: "numeric", estimatedMinutes: 4,
    answerRef: `/faithful/${FAITHFUL_REVISION}/${metadata.bookId}/${lessonId}/${variant}`
  };
  if (lessonId === "balance-substitution") {
    const [same, right] = [[2, 8], [2, 10], [4, 8], [3, 9]][variant];
    return { ...item, prompt: "양팔저울은 모두 평형입니다. 동그라미 1개는 네모 몇 개의 무게와 같습니까?", visual: {
      kind: "book4", subtype: "source-balance-equations",
      equations: [
        { left: { "세모": 2, "네모": same }, right: { "네모": right } },
        { left: { "동그라미": 1 }, right: { "세모": 1, "네모": 1 } }
      ], target: { left: { "동그라미": 1 }, right: { "네모": null } }
    } };
  }
  if (lessonId === "cardinal-placement") {
    const places = [
      ["약국", "문구점", "빵집", "공원"], ["꽃집", "서점", "우체국", "학교"],
      ["병원", "마트", "도서관", "은행"], ["민서", "서율", "하준", "지우"]
    ][variant];
    const [a, b, c, d] = places;
    const clues = [`${a}: ${c}의 서쪽`, `${b}: ${c}의 북쪽`, `${b}: ${d}의 동쪽`];
    return { ...item, inputMode: "text", prompt: "조건에 맞게 네 칸에 하나씩 놓을 때, ㉮에 들어갈 이름을 쓰세요.", visual: {
      kind: "book4", subtype: "source-table-logic", places, clues, targetPosition: "NW", target: "㉮",
      conditions: [
        { type: "westOf", person: a, reference: c },
        { type: "northOf", person: b, reference: c },
        { type: "eastOf", person: b, reference: d }
      ]
    } };
  }
  if (lessonId === "checkerboard-product-matrix") {
    const [rowProducts, columnProducts] = [
      [[28, 72, 18, 10], [48, 12, 14, 45]],
      [[24, 18, 35, 24], [45, 42, 12, 16]],
      [[18, 28, 18, 40], [24, 6, 45, 56]],
      [[36, 15, 16, 42], [6, 72, 28, 30]]
    ][variant];
    return { ...item, inputMode: "text", resultContract: { type: "tuple" }, prompt: "2부터 9까지의 수 카드를 한 번씩 놓아 가로와 세로의 곱을 맞추세요. ㉮, ㉯, ㉰의 수를 순서대로 쓰세요.", visual: {
      kind: "book5", subtype: "checkerboard-products", cardPool: [2, 3, 4, 5, 6, 7, 8, 9],
      active: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 0], [2, 1], [3, 2], [3, 3]],
      revealed: [[0, 1], [2, 0], [3, 2]],
      cells: [["", "㉮", "", ""], ["", "", "", ""], ["㉯", "", "", ""], ["", "", "㉰", ""]],
      rowProducts, columnProducts
    } };
  }
  if (lessonId === "elapsed-time") {
    const [start, end] = [[525, 800], [590, 855], [655, 926], [515, 790]][variant];
    return { ...item, inputMode: "text", prompt: "시작 시각부터 끝 시각까지 걸린 시간을 쓰세요.", visual: {
      kind: "book7", subtype: "time-equation", start, end,
      expression: `${timeLabel(start)} → ${timeLabel(end)}`
    } };
  }
  const [top, bottom, result] = [["□9", "3□", "○○6"], ["□7", "2□", "○○5"], ["□6", "4□", "○○2"], ["□5", "3□", "○○2"]][variant];
  return { ...item, inputMode: "text", resultContract: { type: "tuple" }, prompt: "같은 도형은 같은 숫자입니다. □, ○의 값을 순서대로 쓰세요.", visual: {
    kind: "book8", subtype: "vertical", top, bottom, operator: "+", result
  } };
}

export function faithfulPracticeForBook(bookId) {
  return Object.entries(FAITHFUL_LESSONS).filter(([, metadata]) => metadata.bookId === bookId)
    .map(([lessonId]) => ({ lessonId, items: [1, 2, 3].map((variant) => faithfulQuestion(lessonId, variant)) }));
}

export function goldenBellPracticeItems(lesson, bookId) {
  if (lesson.faithfulPractice) return lesson.faithfulPractice;
  const extension = { ...lesson.extension, id: `${lesson.id}:extension`, estimatedMinutes: 4 };
  if (FAITHFUL_LESSONS[lesson.id]?.bookId === bookId) return [extension];
  return [extension, ...(lesson.similarPractice || [])];
}

export function refreshGoldenBellPracticeCounts(book) {
  for (const lesson of book.lessons) {
    if (FAITHFUL_LESSONS[lesson.id]?.bookId !== book.id) continue;
    const items = goldenBellPracticeItems(lesson, book.id);
    lesson.dailyPractice = { problemCount: items.length, estimatedMinutes: items.reduce((sum, item) => sum + (item.estimatedMinutes || 4), 0) };
  }
  book.dailyPractice = { ...book.dailyPractice, problemCount: book.lessons.reduce((sum, lesson) => sum + goldenBellPracticeItems(lesson, book.id).length, 0) };
}
