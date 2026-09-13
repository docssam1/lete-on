// Metadata-only course registry. Content and runtime routing remain separate.

const freeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

const makeBook = ({ id, label, title = "", edition, status, release, goldenBellOrigin }) => ({
  id,
  label,
  title,
  edition,
  status,
  release,
  goldenBellOrigin,
});

const course1Books = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return makeBook({
    id: `book-${number}`,
    label: `${index + 1}권`,
    edition: "N30",
    status: "existing",
    release: "existing",
    goldenBellOrigin: index === 9 ? "textbook-derived" : "golden-bell-source",
  });
});

const newBook = (id, label, edition, title = "") => makeBook({
  id,
  label,
  title,
  edition,
  status: "pending",
  release: "locked",
  goldenBellOrigin: "textbook-derived",
});

const course2Titles = Object.freeze({
  "course-02-a4": "마방진·복면산과 비",
  "course-02-g4": "도형의 복원과 측정",
});

const course2Books = [
  ...Array.from({ length: 5 }, (_, index) => {
    const id = `course-02-a${index + 1}`;
    return newBook(id, `A${index + 1}`, "N30", course2Titles[id]);
  }),
  ...Array.from({ length: 5 }, (_, index) => {
    const id = `course-02-g${index + 1}`;
    return newBook(id, `G${index + 1}`, "N30", course2Titles[id]);
  }),
];

const course3Books = [
  ...Array.from({ length: 4 }, (_, index) => newBook(`course-03-a${index + 1}`, `A${index + 1}`, null)),
  ...Array.from({ length: 4 }, (_, index) => newBook(`course-03-g${index + 1}`, `G${index + 1}`, null)),
];

const courses = [
  { id: "course-01", books: course1Books },
  { id: "course-02", books: course2Books },
  { id: "course-03", books: course3Books },
].map(freeze);

const byCourseId = new Map(courses.map((course) => [course.id, course]));
const byBookId = new Map();
for (const course of courses) {
  for (const book of course.books) {
    if (byBookId.has(book.id)) throw new Error(`Duplicate course book id: ${book.id}`);
    byBookId.set(book.id, { course, book });
  }
}

export const COURSE_CATALOG = freeze(courses);

export const courseById = (courseId) => byCourseId.get(courseId) ?? null;

export const courseBookById = (courseId, bookId) => {
  const course = courseById(courseId);
  if (!course) return null;
  return course.books.find((book) => book.id === bookId) ?? null;
};

export const resolveCourseBook = ({ courseId, bookId } = {}) => {
  if (!bookId) return null;
  if (courseId) {
    const book = courseBookById(courseId, bookId);
    return book ? { courseId, bookId, course: courseById(courseId), book } : null;
  }
  const match = byBookId.get(bookId);
  if (!match) return null;
  return { courseId: match.course.id, bookId, course: match.course, book: match.book };
};
