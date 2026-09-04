import assert from "node:assert/strict";
import fs from "node:fs";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { BOOK02_GOLDEN_BELL_SOURCE_PAGES } from "./golden-bell-book02-source.js";
import { book02Markup } from "./book02-renderers.js";
import { guidedConceptVisual } from "./golden-bell-guided-experiences.js";

const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-02");
assert.ok(book, "book-02 is missing");

const lessonCounts = new Map([
  ["number-splitting", 20],
  ["addition-matrix", 22],
  ["give-take-sum-difference", 14],
  ["two-term-arithmetic", 6],
  ["balance-order", 24],
  ["repeating-sequence", 9],
  ["shape-number-equations", 14],
  ["arithmetic-sequences", 8],
  ["sequence-rules", 13],
  ["dual-shape-color-pattern", 10],
  ["multiples-2", 10],
  ["growth-patterns", 7],
  ["multiples-3", 9],
  ["diamond-number-promise", 12],
  ["multiples-4", 8],
  ["sudoku", 8],
  ["fractions-and-folds", 12],
  ["multiples-5", 9]
]);
assert.deepEqual(book.lessons.map((lesson) => lesson.id), [...lessonCounts.keys()], "Book 2 lesson order changed");

const expectedPages = Array.from({ length: 40 }, (_, index) => index + 2).filter((page) => ![12, 22, 31].includes(page));
const coveredPages = BOOK02_GOLDEN_BELL_SOURCE_PAGES.flatMap((entry) => entry.pages);
assert.deepEqual([...coveredPages].sort((a, b) => a - b), expectedPages, "Book 2 source-page coverage changed");
assert.equal(new Set(coveredPages).size, coveredPages.length, "Book 2 source page is assigned twice");
assert.equal(coveredPages.length, 37, "Book 2 must cover 37 learning pages");
for (const entry of BOOK02_GOLDEN_BELL_SOURCE_PAGES) {
  assert.match(entry.status, /^implemented/u, `${entry.lessonId}: source status is not releasable`);
  assert.ok(book.lessons.some((lesson) => lesson.id === entry.lessonId), `${entry.lessonId}: covered lesson is missing`);
}

function canonical(answer) {
  return String(Array.isArray(answer) ? answer[0] : answer).replace(/\s+/gu, "");
}

const allIds = new Set();
let sourceItemCount = 0;
for (const lesson of book.lessons) {
  const expectedCount = lessonCounts.get(lesson.id);
  assert.equal(lesson.original.mode, "paged", `${lesson.id}: original questions must use per-question pages`);
  assert.equal(lesson.original.items.length, expectedCount, `${lesson.id}: source item count changed`);
  assert.equal(lesson.original.sourceQuestionCount, expectedCount, `${lesson.id}: declared source count differs`);
  assert.ok(lesson.sourceLocator && lesson.sourceTypeIds?.length, `${lesson.id}: source metadata missing`);
  assert.ok(lesson.representativeConcept?.trim().length >= 20, `${lesson.id}: representative concept is too short`);
  assert.ok(lesson.explanation?.steps?.length >= 3, `${lesson.id}: worked concept sequence missing`);
  assert.ok(lesson.extension?.answer && lesson.extension?.explanation, `${lesson.id}: extension answer or solution missing`);
  assert.ok(lesson.similarPractice?.[0]?.answer && lesson.similarPractice[0].explanation, `${lesson.id}: prepared similar practice missing`);

  for (const [beatIndex] of lesson.experience.beats.entries()) {
    assert.ok(guidedConceptVisual(lesson.experience, beatIndex).trim().length > 80, `${lesson.id}: guided visual ${beatIndex + 1} is blank`);
  }

  for (const item of lesson.original.items) {
    sourceItemCount += 1;
    assert.ok(!allIds.has(item.id), `${lesson.id}/${item.id}: duplicate source item id`);
    allIds.add(item.id);
    assert.ok(item.sourceNo && item.sourceLocator && item.typeLabel, `${lesson.id}/${item.id}: source identity missing`);
    assert.ok(item.prompt?.trim().length >= 10, `${lesson.id}/${item.id}: problem prompt missing`);
    assert.ok(item.solution?.trim().length >= 24, `${lesson.id}/${item.id}: worked solution missing`);
    assert.ok(Number.isInteger(item.printGroup) && item.printGroup > 0, `${lesson.id}/${item.id}: invalid print group`);
    assert.equal(item.visual?.kind, "book2", `${lesson.id}/${item.id}: Book 2 visual data missing`);
    assert.ok(book02Markup(item.visual).trim().length > 40, `${lesson.id}/${item.id}: visual renderer returned blank output`);
    if (item.parts?.length) {
      assert.equal(new Set(item.parts.map((part) => part.id)).size, item.parts.length, `${lesson.id}/${item.id}: duplicate answer-part id`);
      for (const part of item.parts) assert.notEqual(canonical(part.answer), "undefined", `${lesson.id}/${item.id}/${part.id}: answer missing`);
    } else {
      assert.equal(item.answerMode, "input", `${lesson.id}/${item.id}: each source question needs its own input`);
      assert.notEqual(canonical(item.answer), "undefined", `${lesson.id}/${item.id}: answer missing`);
    }
  }
  const printGroups = [...new Set(lesson.original.items.map((item) => item.printGroup))];
  assert.deepEqual(printGroups, Array.from({ length: printGroups.length }, (_, index) => index + 1), `${lesson.id}: print groups must be contiguous`);
  const maxItemsPerPage = lesson.id === "sudoku" ? 1 : 2;
  for (const group of printGroups) {
    assert.ok(lesson.original.items.filter((item) => item.printGroup === group).length <= maxItemsPerPage, `${lesson.id}: too many source items on print page ${group}`);
  }
}
assert.equal(sourceItemCount, 215, "Book 2 released source item total changed");

const lessons = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));
function sourceItem(lessonId, itemId) {
  const found = lessons.get(lessonId)?.original.items.find((item) => item.id === itemId);
  assert.ok(found, `${lessonId}/${itemId}: source item missing`);
  return found;
}

const matrixCorrection = sourceItem("addition-matrix", "matrix-12");
assert.equal(canonical(matrixCorrection.answer), "12", "slide 5 right-column sum must be 12");
assert.match(matrixCorrection.sourceDiscrepancy, /7.*12/u, "slide 5 discrepancy record missing");
assert.deepEqual(sourceItem("shape-number-equations", "shape-13").visual.lines, ["5+5+5=3+3+3+3+3", "3+3+3+△=7+7", "7+△=6+♡"], "slide 20 item 3 transcription changed");
assert.deepEqual(sourceItem("shape-number-equations", "shape-14").visual.lines, ["4+4+4+4+4=5+5+5+5", "4+4+4=6+6", "4+△=6+☆"], "slide 20 item 4 transcription changed");
assert.equal(canonical(sourceItem("shape-number-equations", "shape-13").answer), "6");
assert.equal(canonical(sourceItem("shape-number-equations", "shape-14").answer), "3");

const holds = book.lessons.filter((lesson) => lesson.sourceHold);
assert.deepEqual(holds.map((lesson) => lesson.id), ["diamond-number-promise"], "unexpected Book 2 source hold");
assert.equal(holds[0].sourceHold.itemCount, 2, "slide 34 must retain two unreleased ambiguous items");
assert.match(holds[0].sourceHold.reason, /단일 정답/u, "source hold must explain the single-answer failure");

function sortedDigits(values) {
  return [...values].sort((a, b) => a - b);
}

function countSudokuSolutions(visual, limit = 2) {
  const { size, regionMap } = visual;
  const grid = [...visual.cells];
  const allowed = Array.from({ length: size }, (_, index) => index + 1);
  let count = 0;
  function choices(index) {
    const row = Math.floor(index / size);
    const column = index % size;
    const used = new Set();
    for (let cursor = 0; cursor < size; cursor += 1) {
      used.add(grid[row * size + cursor]);
      used.add(grid[cursor * size + column]);
    }
    regionMap.forEach((region, cursor) => {
      if (region === regionMap[index]) used.add(grid[cursor]);
    });
    return allowed.filter((value) => !used.has(value));
  }
  function search() {
    if (count >= limit) return;
    let target = -1;
    let targetChoices = null;
    for (let index = 0; index < grid.length; index += 1) {
      if (grid[index] != null) continue;
      const available = choices(index);
      if (!available.length) return;
      if (!targetChoices || available.length < targetChoices.length) {
        target = index;
        targetChoices = available;
      }
    }
    if (target < 0) {
      count += 1;
      return;
    }
    for (const value of targetChoices) {
      grid[target] = value;
      search();
      grid[target] = null;
    }
  }
  search();
  return count;
}

for (const item of lessons.get("sudoku").original.items) {
  const { size, cells, letters, regionMap } = item.visual;
  assert.equal(regionMap.length, size * size, `${item.id}: region map size mismatch`);
  const regions = new Map();
  regionMap.forEach((region, index) => {
    if (!regions.has(region)) regions.set(region, []);
    regions.get(region).push(index);
  });
  assert.equal(regions.size, size, `${item.id}: expected ${size} thick-line regions`);
  for (const indexes of regions.values()) assert.equal(indexes.length, size, `${item.id}: every region must contain ${size} cells`);

  const completed = [...cells];
  const answerByLetter = new Map(item.parts.map((part) => [part.id, Number(part.answer)]));
  for (const [index, letter] of Object.entries(letters)) completed[Number(index)] = answerByLetter.get(letter);
  const expected = Array.from({ length: size }, (_, index) => index + 1);
  for (let row = 0; row < size; row += 1) assert.deepEqual(sortedDigits(completed.slice(row * size, (row + 1) * size)), expected, `${item.id}: official row ${row + 1} is invalid`);
  for (let column = 0; column < size; column += 1) assert.deepEqual(sortedDigits(Array.from({ length: size }, (_, row) => completed[row * size + column])), expected, `${item.id}: official column ${column + 1} is invalid`);
  for (const [region, indexes] of regions) assert.deepEqual(sortedDigits(indexes.map((index) => completed[index])), expected, `${item.id}: official region ${region} is invalid`);
  assert.equal(countSudokuSolutions(item.visual), 1, `${item.id}: expected one solution`);
}
assert.equal(sourceItem("sudoku", "sudoku-4-e").parts.find((part) => part.id === "I").answer, "4", "slide 37 final I must be 4");

const publicBook2Files = [
  new URL("./golden-bell-book02-source.js", import.meta.url),
  new URL("./book02-renderers.js", import.meta.url)
];
for (const file of publicBook2Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(contents, /[A-Z]:\\|\.(?:pptx|pdf|png)\b/iu, `${file.pathname}: private source path or asset extension leaked`);
}

console.log(`BOOK02_GOLDEN_BELL_SOURCE_OK lessons=${book.lessons.length} sourceItems=${sourceItemCount} pages=${coveredPages.length} held=${holds[0].sourceHold.itemCount} sudoku=8`);
