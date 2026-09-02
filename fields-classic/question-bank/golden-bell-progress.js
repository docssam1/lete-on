export const GOLDEN_BELL_OUTCOMES = Object.freeze(["correct", "wrong", "revealed", "skipped"]);

function lessonRecord(progress, bookId, lessonId) {
  progress[bookId] ||= {};
  progress[bookId][lessonId] ||= {};
  progress[bookId][lessonId].outcomes ||= { original: {}, extension: {} };
  return progress[bookId][lessonId];
}

export function recordGoldenBellOutcome(progress, {
  bookId,
  lessonId,
  scope,
  itemId,
  status,
  typeIds = [],
  now = new Date().toISOString()
}) {
  if (!GOLDEN_BELL_OUTCOMES.includes(status)) throw new Error(`Unknown Golden Bell outcome: ${status}`);
  if (!bookId || !lessonId || !itemId || !["original", "extension"].includes(scope)) throw new Error("Incomplete Golden Bell outcome identity");
  const lesson = lessonRecord(progress, bookId, lessonId);
  const previous = lesson.outcomes[scope][itemId] || {};
  const countKey = `${status}Count`;
  const shouldIncrement = status === "wrong" || previous.status !== status;
  const next = {
    ...previous,
    status,
    [countKey]: (previous[countKey] || 0) + (shouldIncrement ? 1 : 0),
    needsReview: Boolean(previous.needsReview || status !== "correct"),
    typeIds: [...new Set([...(previous.typeIds || []), ...typeIds])],
    updatedAt: now
  };
  lesson.outcomes[scope][itemId] = next;
  return next;
}

export function summarizeGoldenBellLesson(lessonProgress = {}) {
  const original = Object.values(lessonProgress.outcomes?.original || {});
  const extension = Object.values(lessonProgress.outcomes?.extension || {});
  const records = [...original, ...extension];
  return {
    total: records.length,
    correct: records.filter((record) => record.status === "correct").length,
    wrong: records.filter((record) => record.status === "wrong").length,
    revealed: records.filter((record) => record.status === "revealed").length,
    skipped: records.filter((record) => record.status === "skipped").length,
    review: records.filter((record) => record.needsReview).length,
    reviewTypeIds: [...new Set(records.filter((record) => record.needsReview).flatMap((record) => record.typeIds || []))]
  };
}
