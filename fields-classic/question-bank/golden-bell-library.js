import { GOLDEN_BELL_BOOKS as courseOneBooks } from "./golden-bell-data.js?v=20261128i";
import { COURSE_CATALOG, courseById, resolveCourseBook } from "./course-catalog.js";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js?v=20261028w";
import { applyBook01SourceFixes } from "./golden-bell-book01-source-fixes.js?v=20261003b";

applyBook01SourceFixes(courseOneBooks);

export { COURSE_CATALOG };
// 2·3과정 시범 워밍업(2026-10-28)은 비공개 답안 DB에 정답이 없어 열면 채점이 멈춘다 — 원장 2026-11-28 「시범 권 목록에서 빼기」.
// 데이터는 그대로 두고, 주소에 &pilot=1이 있을 때(검토·검사기)만 합친다. 평소에는 그 권이 「준비 중」이고 과정 고르기에서도 빠진다.
export const SHOW_PILOT_BOOKS = new URLSearchParams(globalThis.location?.search || "").has("pilot");
const pilotById = new Map((SHOW_PILOT_BOOKS ? COURSE23_PILOT_BOOKS : []).map((book) => [book.id, book]));
export const GOLDEN_BELL_BOOKS = COURSE_CATALOG.flatMap((course) => course.books.map((metadata) => {
  if (course.id === "course-01") return { ...courseOneBooks.find((book) => book.id === metadata.id), courseId: course.id };
  return pilotById.get(metadata.id) || {
    id: metadata.id, courseId: course.id, label: metadata.label,
    title: metadata.title || "", status: "pending", lessons: [], source: { origin: "textbook-derived", note: "" }
  };
}));
const byId = new Map(GOLDEN_BELL_BOOKS.map((book) => [book.id, book]));
export const goldenBellBookById = (id) => byId.get(id) || null;

export function goldenBellLocation(params) {
  const courseId = params.get("course") || undefined;
  const bookId = params.get("book") || (courseId ? courseById(courseId)?.books[0]?.id : "book-01");
  return resolveCourseBook({ courseId, bookId });
}

export const UNAVAILABLE_BOOK = Object.freeze({
  id: "unavailable", courseId: null, label: "", title: "요청한 교재를 찾을 수 없습니다.",
  status: "unavailable", lessons: []
});
