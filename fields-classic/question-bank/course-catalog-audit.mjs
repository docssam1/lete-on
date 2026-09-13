import assert from "node:assert/strict";
import {
  COURSE_CATALOG,
  courseById,
  courseBookById,
  resolveCourseBook,
} from "./course-catalog.js";

const course1 = courseById("course-01");
const course2 = courseById("course-02");
const course3 = courseById("course-03");

assert.deepEqual(COURSE_CATALOG.map(({ id }) => id), ["course-01", "course-02", "course-03"]);
assert.equal(course1.books.length, 10);
assert.equal(course2.books.length, 10);
assert.equal(course3.books.length, 8);
assert.deepEqual(course1.books.map(({ id }) => id), Array.from({ length: 10 }, (_, i) => `book-${String(i + 1).padStart(2, "0")}`));
assert.equal(course2.books[0].label, "A1");
assert.equal(course2.books[5].label, "G1");
assert.equal(courseBookById("course-02", "course-02-a4").title, "마방진·복면산과 비");
assert.equal(courseBookById("course-02", "course-02-g4").title, "도형의 복원과 측정");
assert.equal(course3.books[0].label, "A1");
assert.equal(course3.books[4].label, "G1");

assert.equal(resolveCourseBook({ bookId: "book-01" }).courseId, "course-01");
assert.equal(resolveCourseBook({ courseId: "course-01", bookId: "book-01" }).book.id, "book-01");
assert.equal(resolveCourseBook({ bookId: "course-02-a1" }).courseId, "course-02");
assert.equal(resolveCourseBook({ bookId: "course-03-g4" }).courseId, "course-03");
assert.equal(resolveCourseBook({ courseId: "course-01", bookId: "course-02-a1" }), null);
assert.equal(resolveCourseBook({ courseId: "course-02", bookId: "book-01" }), null);
assert.equal(courseById("course-99"), null);
assert.equal(courseBookById("course-99", "book-01"), null);
assert.equal(resolveCourseBook({ bookId: "book-99" }), null);

const allBooks = COURSE_CATALOG.flatMap((course) => course.books);
assert.equal(new Set(allBooks.map(({ id }) => id)).size, allBooks.length);
assert.equal(Object.isFrozen(COURSE_CATALOG), true);
assert.equal(Object.isFrozen(course1), true);
assert.equal(Object.isFrozen(course1.books), true);
assert.equal(Object.isFrozen(course1.books[0]), true);
assert.equal(course3.books.every((book) => book.edition === null && book.status === "pending" && book.release === "locked"), true);
assert.equal(course2.books.every((book) => book.status === "pending" && book.release === "locked"), true);
assert.equal(course1.books.every((book) => book.status === "existing"), true);
assert.equal(course1.books.slice(0, 9).every((book) => book.goldenBellOrigin === "golden-bell-source"), true);
assert.equal(course1.books[9].goldenBellOrigin, "textbook-derived");
for (const id of ["__proto__", "constructor", "toString", "", null, undefined]) {
  assert.equal(courseById(id), null);
  assert.equal(courseBookById(id, "book-01"), null);
}
assert.equal(resolveCourseBook(), null);
assert.throws(() => { course2.books[0].release = "published"; }, TypeError);

console.log("COURSE_CATALOG_OK: 28 books; metadata only, no runtime routing claim");
