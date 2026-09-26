import assert from "node:assert/strict";
import test from "node:test";
import { questionContentSignature as key, takeUniqueQuestion, buildUniqueQuestions } from "./question-selection.js";
import { book02UnitTestProblem } from "./book02-unit-test-generators.js";
import { book02Markup } from "./book02-renderers.js";

const question = (value) => ({ prompt: "Find the number.", visual: { value } });
const references = [{ typeId: "a" }, { typeId: "b" }];

test("identity ignores source, type labels, IDs, answers and student responses", () => {
  assert.equal(key({ ...question(3), reference: "Book A", type: { id: "a" }, answer: 4, responseValue: "5" }),
    key({ ...question(3), reference: "Book B", type: { id: "b" }, answer: 9, id: "new-id" }));
});

test("canonical fields preserve meaningful figure and response differences", () => {
  assert.equal(key({ prompt: "x", visual: { b: 2, a: 1 } }), key({ visual: { a: 1, b: 2 }, prompt: "x" }));
  assert.notEqual(key(question(3)), key(question(4)));
  assert.notEqual(key({ prompt: "x", image: "a.png" }), key({ prompt: "x", image: "b.png" }));
  assert.notEqual(key(question(3)), key({ ...question(3), responseKind: "drawing" }));
});

test("multipart student content distinguishes variants, not part answers", () => {
  const first = { prompt: "Fill each row.", parts: [question(3), question(4)] };
  assert.notEqual(key(first), key({ ...first, parts: [question(3), question(5)] }));
  assert.equal(key(first), key({ ...first, parts: [{ ...question(3), answer: 10 }, question(4)] }));
});

test("last retry cannot leak a duplicate; failed selection leaves history unchanged", () => {
  const seen = new Set([key(question(1))]);
  let attempts = 0;
  assert.equal(takeUniqueQuestion(() => { attempts += 1; return question(1); }, seen), null);
  assert.equal(attempts, 80);
  assert.deepEqual([...seen], [key(question(1))]);
});

test("null and duplicate candidates are skipped until a unique one is found", () => {
  const seen = new Set([key(question(1))]);
  const candidates = [null, question(1), question(2)];
  assert.deepEqual(takeUniqueQuestion((attempt) => candidates[attempt], seen), question(2));
  assert.equal(seen.size, 2);
});

test("mixing two fixed types returns two unique questions, never forty repeats", () => {
  let calls = 0;
  const result = buildUniqueQuestions(references, 40, (reference) => {
    calls += 1;
    return question(reference.typeId);
  });
  assert.equal(result.questions.length, 2);
  assert.equal(result.missing, 38);
  assert.equal(calls, 3042, "Every requested slot must be considered without accepting duplicates");
});

test("a failed sequence does not hide a later valid fixed variant", () => {
  const result = buildUniqueQuestions([{ typeId: "a" }], 3, (_reference, sequence) =>
    sequence === 0 ? null : question(sequence));
  assert.equal(result.questions.length, 2);
  assert.equal(result.missing, 1);
  assert.deepEqual(result.questions.map((item) => item.visual.value), [1, 2]);
});

test("a repeated fixed variant can be followed by a different sequence", () => {
  const result = buildUniqueQuestions([{ typeId: "a" }], 3, (_reference, sequence) =>
    question(sequence < 2 ? "A" : "B"));
  assert.deepEqual(result.questions.map((item) => item.visual.value), ["A", "B"]);
  assert.equal(result.missing, 1);
});

test("aliases of the same fixed question are rejected across types", () => {
  const result = buildUniqueQuestions(references, 10, (reference) => ({ ...question(1), reference: reference.typeId }));
  assert.equal(result.questions.length, 1);
  assert.equal(result.missing, 9);
});

test("finite variants are drawn without replacement; another type does not fill the gap", () => {
  const result = buildUniqueQuestions(references, 10, (reference, sequence, attempt) =>
    question(reference.typeId === "a" ? (sequence + attempt) % 2 : `b-${sequence}`));
  assert.equal(result.questions.length, 7);
  assert.equal(result.signatures.size, 7);
  assert.equal(result.questions.filter((item) => typeof item.visual.value === "string").length, 5);
});

test("replacements cannot revisit a removed or previously replaced variant", () => {
  const seen = new Set([key(question(1))]);
  assert.deepEqual(takeUniqueQuestion(() => question(2), seen), question(2));
  assert.equal(takeUniqueQuestion((attempt) => question(attempt % 2 + 1), seen), null);
});

test("a new worksheet request keeps the last worksheet's variants out", () => {
  const first = buildUniqueQuestions(references, 2, (reference) => question(reference.typeId));
  const next = buildUniqueQuestions(references, 2, (reference) => question(reference.typeId), key, first.signatures);
  assert.equal(next.questions.length, 0);
  assert.equal(next.missing, 2);
  assert.equal(next.signatures.size, first.signatures.size);
});

test("successful fixed-seed slots retain their sequence and initial attempt", () => {
  const calls = [];
  const result = buildUniqueQuestions(references, 4, (reference, sequence, attempt) => {
    calls.push([reference.typeId, sequence, attempt]);
    return question(`${reference.typeId}-${sequence}`);
  });
  assert.deepEqual(calls, [["a", 0, 0], ["b", 0, 0], ["a", 1, 0], ["b", 1, 0]]);
  assert.equal(result.missing, 0);
  assert.equal(buildUniqueQuestions([], 3, () => assert.fail()).missing, 3);
});

function book02(number) {
  return book02UnitTestProblem({ difficulty: 2, sourceCase: { sourceKind: "unit-test", sourceId: "book-02", number } });
}

function book02Key(problem) {
  return key({ ...problem, visual: problem.parts?.length > 1
    ? problem.parts.map((part) => book02Markup(part.visual)).join("")
    : book02Markup(problem.visual), parts: undefined });
}

test("actual book 2 fixed generators do not repeat in a mixed worksheet", () => {
  const fixed = [6, 8, 10, 11, 13, 14, 15, 23, 25].map((number) => ({ typeId: `q${number}`, number }));
  const result = buildUniqueQuestions(fixed, 45, (reference) => book02(reference.number), book02Key);
  assert.equal(result.questions.length, fixed.length);
  assert.equal(result.missing, 36);
  assert.equal(new Set(result.questions.map(book02Key)).size, fixed.length);
});

test("actual multipart generator retains different numeric variations", () => {
  const original = Math.random;
  try {
    Math.random = () => 0;
    const first = book02(12);
    Math.random = () => 0.9;
    const second = book02(12);
    assert.equal(first.prompt, second.prompt);
    assert.notEqual(book02Key(first), book02Key(second));
  } finally {
    Math.random = original;
  }
});
