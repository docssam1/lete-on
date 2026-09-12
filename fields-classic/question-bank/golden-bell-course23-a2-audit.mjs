import assert from "node:assert/strict";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js";
import { course23A2Model, course23A2ConceptMarkup } from "./golden-bell-course23-a2-lessons.js";

const books = COURSE23_PILOT_BOOKS.filter((book) => book.id.endsWith("-a2"));
assert.deepEqual(books.map((book) => book.id), ["course-02-a2", "course-03-a2"]);

const ids = new Set();
const refs = new Set();
let itemCount = 0;
let trackCount = 0;
let beatCount = 0;
for (const book of books) {
  assert.equal(book.lessons.length, 4, `${book.id} lesson count`);
  assert.equal(book.dailyPractice.problemCount, 40);
  assert.equal(book.dailyPractice.estimatedMinutes, 30);
  for (const lesson of book.lessons) {
    assert.ok(lesson.experience.tracks.length >= 2, `${lesson.id} track count`);
    trackCount += lesson.experience.tracks.length;
    assert.ok(lesson.source.note.includes("교사용 지도서"));
    for (const track of lesson.experience.tracks) {
      assert.equal(track.beats.length, 4, `${track.id} beat count`);
      beatCount += track.beats.length;
      for (const beat of track.beats) {
        assert.ok(course23A2ConceptMarkup(beat.visual).includes("course23-a2-visual"));
      }
    }
    const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
    assert.equal(items.length, 10, `${lesson.id} practice count`);
    for (const item of items) {
      itemCount += 1;
      assert.ok(!Object.hasOwn(item, "answer"), `${item.id} exposes answer`);
      assert.ok(!Object.hasOwn(item, "solution"), `${item.id} exposes solution`);
      assert.ok(item.prompt && item.hint && item.typeLabel);
      assert.ok(item.answerRef.startsWith(`/course23/${book.id}/`));
      assert.ok(!ids.has(item.id), `duplicate id ${item.id}`);
      assert.ok(!refs.has(item.answerRef), `duplicate answer ref ${item.answerRef}`);
      ids.add(item.id); refs.add(item.answerRef);
      const model = course23A2Model(item.visual);
      assert.ok(typeof model.answer === "string" ? model.answer.trim() : Number.isFinite(model.answer), `${item.id} invalid calculated answer`);
      assert.ok(course23A2ConceptMarkup({ ...item.visual, phase: "verify" }).includes(String(model.answer)), `${item.id} verify visual omits answer`);
    }
  }
}

assert.equal(itemCount, 80);
assert.equal(trackCount, 20);
assert.equal(beatCount, 80);
assert.equal(course23A2Model({ kind: "course23-a2", task: "clone-number", base: 37, positions: [2, 0] }).answer, 3737);
assert.equal(course23A2Model({ kind: "course23-a2", task: "odd-square", lastOdd: 9 }).answer, 25);
assert.equal(course23A2Model({ kind: "course23-a2", task: "four-fours", target: 15, options: [{ value: 16 }, { value: 15 }, { value: 6 }] }).answer, 2);
assert.equal(course23A2Model({ kind: "course23-a2", task: "leap-year-count", start: 2001, end: 2100 }).answer, 24);
assert.equal(course23A2Model({ kind: "course23-a2", task: "weekday-offset", start: 1, offset: 45 }).answer, "목요일");
assert.deepEqual(course23A2Model({ kind: "course23-a2", task: "reverse-rule", target: 8 }).predecessors, [3, 16]);
assert.deepEqual(course23A2Model({ kind: "course23-a2", task: "digit-product-chain", start: 68 }).sequence, [68, 48, 32, 6]);
assert.equal(course23A2Model({ kind: "course23-a2", task: "recurring-decimal", numerator: 1, denominator: 7 }).answer, "142857");
assert.equal(course23A2Model({ kind: "course23-a2", task: "eleven-missing-digit", digits: [2, 5, 7, null, 5] }).answer, 9);
assert.equal(course23A2Model({ kind: "course23-a2", task: "schedule-cycle", intervals: [8, 12, 18] }).answer, 72);
assert.equal(course23A2Model({ kind: "course23-a2", task: "catch-up", slow: 60, delay: 8, fast: 180 }).answer, 4);
assert.equal(course23A2Model({ kind: "course23-a2", task: "absolute-equation", center: 3, radius: 5 }).answer, "-2, 8");

console.log(`COURSE23_A2_AUDIT_OK books=${books.length} lessons=${books.reduce((sum, book) => sum + book.lessons.length, 0)} tracks=${trackCount} beats=${beatCount} items=${itemCount}`);
