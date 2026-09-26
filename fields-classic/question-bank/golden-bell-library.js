import { GOLDEN_BELL_BOOKS as courseOneBooks } from "./golden-bell-data.js?v=20260905e";
import { COURSE_CATALOG, courseById, resolveCourseBook } from "./course-catalog.js";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js?v=20260913d";
import { enhanceBook06Workbook } from "./golden-bell-book06-workbook.js?v=20260922a";
import { enhanceFaithfulConcepts } from "./golden-bell-faithful-concepts.js?v=20260922a";
import { enhanceBook01Flow } from "./golden-bell-book01-flow.js?v=20260922d";

export { COURSE_CATALOG };
enhanceBook01Flow(courseOneBooks);
enhanceBook06Workbook(courseOneBooks);
enhanceFaithfulConcepts(courseOneBooks);
const pilotById = new Map(COURSE23_PILOT_BOOKS.map((book) => [book.id, book]));
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
