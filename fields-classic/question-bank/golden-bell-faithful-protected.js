import { faithfulPracticeForBook, refreshGoldenBellPracticeCounts } from "./golden-bell-faithful-practice.js?v=20260922a";
import { hydrateProtectedAnswers, hasProtectedAnswer } from "./golden-bell-protected.js?v=20260906c";

export function installFaithfulPractice(book, records) {
  const groups = faithfulPracticeForBook(book.id);
  if (!groups.length) return { status: "not-applicable", count: 0 };
  const prepared = [];
  for (const group of groups) {
    const lesson = book.lessons.find((entry) => entry.id === group.lessonId);
    if (!lesson || lesson.original.structureKey !== group.items[0].structureKey) return { status: "invalid", count: 0 };
    if (group.items.some((item) => !Object.hasOwn(records || {}, item.answerRef))) return { status: "pending", count: 0 };
    try {
      for (const item of group.items) {
        const record = records[item.answerRef];
        if (typeof record.solution !== "string" || !record.solution.trim()) throw new Error("missing_solution");
      }
      hydrateProtectedAnswers(group.items, records);
      if (!group.items.every(hasProtectedAnswer)) throw new Error("missing_answer");
      group.items.forEach((item) => {
        item.explanation = item.solution;
        item.solutionVisual = structuredClone(records[item.answerRef].solutionVisual || null);
      });
      prepared.push({ lesson, items: group.items });
    } catch {
      return { status: "invalid", count: 0 };
    }
  }
  // Do not partially replace a book if any answer or explanation is missing.
  for (const { lesson, items } of prepared) lesson.faithfulPractice = items;
  refreshGoldenBellPracticeCounts(book);
  return { status: "ready", count: prepared.reduce((sum, group) => sum + group.items.length, 0) };
}
