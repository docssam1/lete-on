import { GOLDEN_BELL_RECOVERY } from "./golden-bell-recovery-data.js?v=20260906a";
import { hasProtectedAnswer, hydrateProtectedAnswers } from "./golden-bell-protected.js?v=20260906c";

export function appendProtectedRecoveryItems(book, records, groups = GOLDEN_BELL_RECOVERY) {
  const group = groups.find((entry) => entry.bookId === book.id);
  if (!group) return { status: "not-applicable", added: 0, lessonIds: [] };
  const additions = group.updates.flatMap((update) => update.items);
  const existingIds = new Set(book.lessons.flatMap((lesson) => lesson.original?.items || []).map((item) => item.id));
  if (additions.every((item) => existingIds.has(item.id))) return { status: "already-loaded", added: 0, lessonIds: [] };
  const prepared = [];
  try {
    for (const update of group.updates) {
      const lesson = book.lessons.find((entry) => entry.id === update.lessonId);
      if (!lesson?.original?.items || update.items.some((item) => existingIds.has(item.id))) throw new Error("recovery_source_mismatch");
      const items = structuredClone(update.items);
      for (const item of items) {
        const record = Object.hasOwn(records || {}, item.answerRef) ? records[item.answerRef] : null;
        if (!record || typeof record.solution !== "string" || !record.solution.trim()) {
          return { status: "pending", added: 0, lessonIds: [] };
        }
      }
      hydrateProtectedAnswers(items, records);
      if (!items.every(hasProtectedAnswer)) throw new Error("recovery_answers_incomplete");
      prepared.push({ lesson, items });
    }
  } catch {
    return { status: "invalid", added: 0, lessonIds: [] };
  }
  // Append only after the entire supplemental book batch has passed validation.
  for (const { lesson, items } of prepared) {
    lesson.original.items.push(...items);
    if (Number.isInteger(lesson.original.sourceQuestionCount)) lesson.original.sourceQuestionCount += items.length;
    lesson.original.printMode = "paged";
  }
  return { status: "ready", added: additions.length, lessonIds: prepared.map(({ lesson }) => lesson.id) };
}
