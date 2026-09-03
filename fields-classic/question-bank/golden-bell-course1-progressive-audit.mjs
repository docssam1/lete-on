import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { COURSE_ONE_PROGRESSIVE_CHECKS } from "./golden-bell-course1-progressive.js";

const courseBooks = GOLDEN_BELL_BOOKS.filter((book) => Number(book.id.slice(-2)) >= 4);
const lessons = courseBooks.flatMap((book) => book.lessons.map((lesson) => ({ book, lesson })));
const progressive = lessons.filter(({ lesson }) => lesson.experience?.kind === "progressive-concept");
const triangular = lessons.filter(({ lesson }) => lesson.experience?.kind === "triangular-stair");

assert.equal(courseBooks.length, 7, "course 1 books 4-10 must all be present");
assert.equal(lessons.length, 28, "books 4-10 must contain 28 lessons");
assert.equal(progressive.length, 27, "all non-triangular lessons need progressive concept learning");
assert.equal(triangular.length, 1, "the source-backed triangular stair must keep its dedicated experience");
assert.equal(lessons.filter(({ lesson }) => !lesson.experience).length, 0, "books 4-10 contain a concept-learning gap");
assert.equal(Object.keys(COURSE_ONE_PROGRESSIVE_CHECKS).length, 27, "progressive check catalog must match the attached lessons");

for (const { book, lesson } of progressive) {
  const experience = lesson.experience;
  const prefix = `${book.id}/${lesson.id}`;
  assert.equal(book.source?.verified, true, `${prefix}: source must be verified`);
  assert.equal(experience.family, lesson.sourceTypeIds[0], `${prefix}: source type family changed`);
  assert.deepEqual(experience.beats.map((beat) => beat.action), ["reveal", "highlight", "verify"], `${prefix}: three-step learning order changed`);
  assert.deepEqual(experience.beats.map((beat) => beat.caption), lesson.explanation.steps, `${prefix}: tutorial explanation changed`);
  assert.match(experience.learnerStage, /7세 8월부터 초등 1학년 초반/u, `${prefix}: learner stage missing`);
  assert.match(experience.learnerStage, new RegExp(`${Number(book.id.slice(-2))}권`, "u"), `${prefix}: book stage mismatch`);
  assert.deepEqual(Object.keys(experience.learnerFit).sort(), ["language", "prerequisites", "reasoningLoad", "representations", "responseMode"], `${prefix}: learner-fit evidence incomplete`);
  assert.ok(Object.values(experience.learnerFit).every((value) => String(value).trim()), `${prefix}: empty learner-fit evidence`);
  assert.ok(lesson.original?.visual, `${prefix}: source-backed visual missing`);
  assert.ok(lesson.original?.items?.length, `${prefix}: original questions missing`);
  assert.ok(lesson.original.items.every((item) => item.answer !== undefined && String(item.answer).trim()), `${prefix}: original answer missing`);
  assert.ok(lesson.extension?.answer !== undefined && String(lesson.extension.answer).trim(), `${prefix}: extension answer missing`);
  assert.equal(experience.check.options.length, 3, `${prefix}: concept check must have three choices`);
  assert.equal(new Set(experience.check.options).size, 3, `${prefix}: duplicate concept choices`);
  assert.equal(experience.check.options.filter((option) => option === experience.check.answer).length, 1, `${prefix}: concept answer must be uniquely visible`);
  assert.ok(experience.check.prompt.trim() && experience.check.explanation.trim() && experience.hint.trim(), `${prefix}: concept guidance missing`);
  assert.equal(experience.finalStill.standsAlone, true, `${prefix}: final still must stand alone`);
  assert.equal(experience.finalStill.visualSource, "original", `${prefix}: concept visual must reuse the verified source renderer`);
}

const customTriangular = triangular[0].lesson;
assert.equal(customTriangular.id, "cube-tetrahedral-growth", "dedicated triangular experience moved");
assert.ok(customTriangular.experience.beats.length >= 3, "dedicated triangular experience is incomplete");

console.log(`GOLDEN_BELL_PROGRESSIVE_OK books=${courseBooks.length} lessons=${lessons.length} progressive=${progressive.length} triangular=${triangular.length} missing=0 uniqueAnswers=${progressive.length}`);
