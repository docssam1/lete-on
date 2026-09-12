import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isFieldsGoldenBellBookId } from "./fields-golden-bell-book-id.js";

for (const value of ["book-01", "book-10", "course-02-a1", "course-02-g5", "course-03-a2", "course-03-g4"]) {
  assert.equal(isFieldsGoldenBellBookId(value), true, `${value} must be accepted`);
}

for (const value of ["", "book-1", "book-001", "course-01-a1", "course-04-a1", "course-02-x1", "course-02-a0", "../book-01"]) {
  assert.equal(isFieldsGoldenBellBookId(value), false, `${value} must be rejected`);
}

const migration = await readFile(new URL("../../migrations/20260912191919_allow_fields_course_golden_bell_books.sql", import.meta.url), "utf8");
assert.match(migration, /book-\[0-9\]\{2\}/u);
assert.match(migration, /course-\(02\|03\)-\[ag\]/u);

console.log("FIELDS_GOLDEN_BELL_BOOK_ID_OK");
