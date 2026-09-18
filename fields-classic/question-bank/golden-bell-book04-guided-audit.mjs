import assert from "node:assert/strict";

import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { renderBook04Guided } from "./golden-bell-book04-guided.js";

const FAMILIES = [
  "book4-circle-logic-source",
  "book4-cube-box-fill",
  "book4-fold-hole-count",
  "book4-multiplication-matrix",
  "book4-row-logic-source",
  "book4-table-logic-source"
];

const GIVEN = "#187fa9";
const ACTION = "#d39b20";
const VERIFY = "#16734b";

function frameBody(html) {
  const match = html.match(/<!--book04-frame-->([\s\S]*?)<!--\/book04-frame-->/);
  assert.ok(match?.[1]?.trim(), "guided frame body is empty");
  return match[1].trim();
}

function answerAttribute(html) {
  const match = html.match(/data-book04-answer="([^"]+)"/);
  assert.ok(match, "verify frame is missing data-book04-answer");
  return match[1];
}

function reflect(point, line) {
  const [[x1, y1], [x2, y2]] = line;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const scale = ((point[0] - x1) * dx + (point[1] - y1) * dy) / (dx * dx + dy * dy);
  const projection = [x1 + scale * dx, y1 + scale * dy];
  return [2 * projection[0] - point[0], 2 * projection[1] - point[1]];
}

function deduplicate(points) {
  const result = [];
  for (const point of points) {
    if (!result.some((other) => Math.hypot(point[0] - other[0], point[1] - other[1]) < 1e-7)) result.push(point);
  }
  return result;
}

function foldAnswer(visual) {
  let points = visual.holes.map((hole) => hole.center.map(Number));
  for (const fold of visual.folds.slice().reverse()) {
    points = deduplicate(points.flatMap((point) => [point, reflect(point, fold.line)]));
  }
  return String(points.length);
}

function cubeAnswer(visual) {
  const capacity = visual.dimensions.map(Number).reduce((product, value) => product * value, 1);
  assert.equal(capacity, Number(visual.total), "cube capacity disagrees with model total");
  return String(capacity - Number(visual.shown));
}

function matrixAnswer(visual) {
  const [rowOne, rowTwo] = visual.rowProducts.map(Number);
  const [columnOne, columnTwo] = visual.columnProducts.map(Number);
  const fixed = visual.cells.map((value) => value == null ? null : Number(value));
  const solutions = [];
  for (let a = 1; a <= rowOne; a += 1) {
    if (rowOne % a || columnOne % a) continue;
    const candidate = [a, rowOne / a, columnOne / a, rowTwo / (columnOne / a)];
    if (!candidate.every(Number.isInteger)) continue;
    if (candidate[1] * candidate[3] !== columnTwo) continue;
    if (candidate.every((value, index) => fixed[index] == null || fixed[index] === value)) solutions.push(candidate);
  }
  assert.equal(solutions.length, 1, "matrix must have one solution");
  const blanks = fixed.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  return blanks.length === 1 ? String(solutions[0][blanks[0]]) : blanks.map((index) => solutions[0][index]).join(",");
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, other) => other !== index)).map((rest) => [value, ...rest]));
}

function tableAnswer(visual) {
  const solutions = permutations(visual.choices).map((choices) => Object.fromEntries(visual.people.map((person, index) => [person, choices[index]]))).filter((assignment) => visual.conditions.every((condition) => condition.type === "is" ? assignment[condition.person] === condition.choice : assignment[condition.person] !== condition.choice));
  const answers = [...new Set(solutions.map((solution) => solution[visual.target]))];
  assert.equal(solutions.length, 1, "table must have one assignment");
  assert.equal(answers.length, 1, "table target must be unique");
  return String(answers[0]);
}

function circleCondition(order, condition) {
  const size = order.length;
  const index = (person) => order.indexOf(person);
  const adjacent = (left, right) => {
    const difference = Math.abs(index(left) - index(right));
    return difference === 1 || difference === size - 1;
  };
  if (condition.type === "bothNeighbors") {
    const seat = index(condition.person);
    const neighbors = new Set([order[(seat - 1 + size) % size], order[(seat + 1) % size]]);
    return condition.neighbors.every((person) => neighbors.has(person));
  }
  if (condition.type === "notAdjacent") return !adjacent(condition.people[0], condition.people[1]);
  if (condition.type === "rightOf") return index(condition.person) === (index(condition.reference) + 1) % size;
  if (condition.type === "leftOf") return index(condition.person) === (index(condition.reference) - 1 + size) % size;
  return false;
}

function circleAnswer(visual) {
  const fixed = new Map(visual.seats.map((seat, index) => seat.fixed == null ? null : [index, seat.fixed]).filter(Boolean));
  const remaining = visual.people.filter((person) => ![...fixed.values()].includes(person));
  const openSeats = visual.seats.map((_, index) => fixed.has(index) ? -1 : index).filter((index) => index >= 0);
  const solutions = permutations(remaining).map((people) => {
    const order = Array(visual.seats.length);
    fixed.forEach((person, index) => { order[index] = person; });
    openSeats.forEach((seat, index) => { order[seat] = people[index]; });
    return order;
  }).filter((order) => visual.conditions.every((condition) => circleCondition(order, condition)));
  const answers = [...new Set(solutions.map((solution) => solution[visual.targetSeat]))];
  assert.equal(answers.length, 1, "circle target must be unique");
  return String(answers[0]);
}

function rowAnswer(visual) {
  const front = visual.placements.find((placement) => placement.from === "front");
  const back = visual.placements.find((placement) => placement.from === "back");
  assert.equal(front.person, back.person, "row placements must describe one person");
  const total = Number(front.position) + Number(back.position) - 1;
  assert.equal(total, Number(visual.total), "row total disagrees with the positions");
  return String(total);
}

const EXPECTED_ANSWER = {
  "book4-fold-hole-count": foldAnswer,
  "book4-cube-box-fill": cubeAnswer,
  "book4-multiplication-matrix": matrixAnswer,
  "book4-table-logic-source": tableAnswer,
  "book4-circle-logic-source": circleAnswer,
  "book4-row-logic-source": rowAnswer
};

const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-04");
assert.ok(book, "Book 4 is missing from Golden Bell data");

const experiences = new Map();
for (const lesson of book.lessons || []) {
  const experience = lesson.experience;
  if (!experience || !FAMILIES.includes(experience.family)) continue;
  assert.ok(!experiences.has(experience.family), `duplicate Book 4 guided family: ${experience.family}`);
  experiences.set(experience.family, experience);
}

assert.deepEqual([...experiences.keys()].sort(), FAMILIES.slice().sort(), "the six requested Book 4 families must all exist");

const report = [];
for (const family of FAMILIES) {
  const experience = experiences.get(family);
  assert.equal(experience.beats.length, 3, `${family} must expose three guided beats`);
  const frames = experience.beats.map((beat, step) => renderBook04Guided(experience, beat, step));
  const bodies = frames.map(frameBody);
  assert.equal(new Set(bodies).size, frames.length, `${family} contains identical semantic frames`);

  frames.forEach((html, step) => {
    assert.ok(html.trim().length > 100, `${family} step ${step + 1} returned empty HTML`);
    assert.doesNotMatch(html, /NaN|undefined|>null</i, `${family} step ${step + 1} leaked an invalid value`);
    if (step < frames.length - 1) {
      assert.doesNotMatch(html, /data-book04-(?:answer|check)=/i, `${family} step ${step + 1} leaked answer or check data`);
      assert.doesNotMatch(html, /#16734b/i, `${family} step ${step + 1} leaked verify green`);
    }
  });

  assert.match(frames[0], new RegExp(GIVEN, "i"), `${family} problem frame must use the given blue`);
  assert.doesNotMatch(frames[0], new RegExp(`${ACTION}|${VERIFY}`, "i"), `${family} problem frame must not use calculation or verify colors`);
  assert.match(frames[1], new RegExp(ACTION, "i"), `${family} organize frame must use calculation gold`);
  assert.match(frames[2], new RegExp(VERIFY, "i"), `${family} verify frame must use completion green`);
  assert.match(frames[2], /data-book04-check="[^"]+"/, `${family} verify frame is missing an independent check`);

  const verifyVisual = experience.beats.at(-1).visual || experience.model?.visual;
  const expected = EXPECTED_ANSWER[family](verifyVisual);
  const actual = answerAttribute(frames[2]);
  assert.equal(actual, expected, `${family} verified answer disagrees with independent calculation`);
  report.push(`${family}:${actual}`);
}

console.log(`BOOK04_GUIDED_AUDIT_OK families=${FAMILIES.length} frames=${FAMILIES.length * 3} answers=${report.join("|")}`);
