import assert from "node:assert/strict";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js";
import { course23A3Model, course23A3ConceptMarkup } from "./golden-bell-course23-a3-lessons.js";

const books = COURSE23_PILOT_BOOKS.filter((book) => book.id.endsWith("-a3"));
assert.deepEqual(books.map((book) => book.id), ["course-02-a3", "course-03-a3"]);

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
    assert.match(lesson.source.note, /교사용 지도서|A3\+.*지도서/);
    trackCount += lesson.experience.tracks.length;
    for (const track of lesson.experience.tracks) {
      assert.equal(track.beats.length, 4, `${track.id} beat count`);
      beatCount += track.beats.length;
      for (const beat of track.beats) assert.ok(course23A3ConceptMarkup(beat.visual).includes("course23-a3-visual"));
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
      const answer = course23A3Model(item.visual).answer;
      assert.ok(typeof answer === "string" ? answer.trim() : Number.isFinite(answer), `${item.id} invalid answer`);
      assert.ok(course23A3ConceptMarkup({ ...item.visual, phase: "verify" }).includes(String(answer)), `${item.id} verify visual omits answer`);
    }
  }
}

assert.equal(itemCount, 80);
assert.equal(trackCount, 23);
assert.equal(beatCount, 92);
assert.equal(course23A3Model({ kind: "course23-a3", task: "kaprekar-sum", n: 45 }).answer, 45);
assert.equal(course23A3Model({ kind: "course23-a3", task: "power-last", base: 3, exponent: 27 }).answer, 7);
assert.equal(course23A3Model({ kind: "course23-a3", task: "arithmetic-nth", first: 4, diff: 7, index: 42 }).answer, 291);
assert.equal(course23A3Model({ kind: "course23-a3", task: "triangular", n: 15 }).answer, 120);
assert.equal(course23A3Model({ kind: "course23-a3", task: "digit-total", end: 365 }).answer, 987);
assert.equal(course23A3Model({ kind: "course23-a3", task: "lattice-path", width: 4, height: 3, blocked: [] }).answer, 35);
assert.equal(course23A3Model({ kind: "course23-a3", task: "linked-ratio", ab: [3, 4], bc: [5, 2] }).answer, "15:20:8");
assert.equal(course23A3Model({ kind: "course23-a3", task: "ratio-change", initial: [7, 9], change: [10, -5], final: [16, 17] }).answer, 70);
assert.equal(course23A3Model({ kind: "course23-a3", task: "pipe-pair", all: 20, ab: 40, ac: 30 }).answer, 24);
assert.equal(course23A3Model({ kind: "course23-a3", task: "clock-angle", hour: 7, minute: 20 }).answer, 100);
assert.equal(course23A3Model({ kind: "course23-a3", task: "average-roundtrip", outbound: 80, returning: 120 }).answer, 96);
assert.equal(course23A3Model({ kind: "course23-a3", task: "step-catch", aSteps: 5, bSteps: 4, aStrideUnits: 3, bStrideUnits: 2, gapBSteps: 8 }).answer, 48);
assert.equal(course23A3Model({ kind: "course23-a3", task: "train-tunnel", longTunnel: 800, longTime: 10, shortTunnel: 400, shortTime: 6 }).answer, 100);
assert.equal(course23A3Model({ kind: "course23-a3", task: "boat-down-time", distance: 100, upstreamHours: 2.5, speedDifference: 8 }).answer, 125);
assert.equal(course23A3Model({ kind: "course23-a3", task: "concentration-add", initial: 8, mass: 400, added: 5, target: 7 }).answer, 200);
assert.equal(course23A3Model({ kind: "course23-a3", task: "percent-population", total: 500, maleIncrease: .1, femaleDecrease: .08, change: 14 }).answer, 330);
assert.equal(course23A3Model({ kind: "course23-a3", task: "lever-ratio", high: 14, low: 4, target: 10 }).answer, "3:2");

console.log(`COURSE23_A3_AUDIT_OK books=${books.length} lessons=${books.reduce((sum, book) => sum + book.lessons.length, 0)} tracks=${trackCount} beats=${beatCount} items=${itemCount}`);
