import assert from "node:assert/strict";
import { COURSE02_A4_LESSONS, course02A4ConceptMarkup, course02A4Model } from "./golden-bell-course02-a4-lessons.js";

const expectedUnits = ["마방진", "복면산", "배수와 약수", "비와 가정하여 풀기"];
const expectedPageEvidence = [/6~31쪽/, /34~62쪽/, /66~100쪽/, /104~137쪽/];
const requiredTasks = new Set([
  "magic-line-sum", "magic-missing", "formation-line-sums",
  "alphametic-addition", "alphametic-multiplication", "operation-matrix",
  "gcd-pack", "unit-fraction-sets", "lcm-cycle", "consecutive-conditions", "gcd-lcm-relation",
  "balance-ratio", "linear-pair", "heads-legs"
]);

function assertNoPrivateResultKeys(value, locator = "public lesson") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.notEqual(key, "answer", `${locator} exposes answer`);
    assert.notEqual(key, "solution", `${locator} exposes solution`);
    assertNoPrivateResultKeys(child, `${locator}.${key}`);
  }
}

function assertModelAnswer(model, locator) {
  if (typeof model.answer === "number") assert.ok(Number.isFinite(model.answer), `${locator} has a non-finite answer`);
  else assert.ok(typeof model.answer === "string" && model.answer.trim(), `${locator} has an empty answer`);
}

assert.equal(COURSE02_A4_LESSONS.length, 4, "Course 2 A4 lesson count");
assert.deepEqual(COURSE02_A4_LESSONS.map((lesson) => lesson.unit), expectedUnits, "verified A4 unit order");

const ids = new Set();
const refs = new Set();
const observedTasks = new Set();
let trackCount = 0;
let beatCount = 0;
let itemCount = 0;
let setContractCount = 0;

for (const [lessonIndex, lesson] of COURSE02_A4_LESSONS.entries()) {
  assert.equal(lesson.bookId, "course-02-a4", `${lesson.id} book id`);
  assert.equal(lesson.courseId, "course-02", `${lesson.id} course id`);
  assert.equal(lesson.label, "A4", `${lesson.id} label`);
  assert.equal(lesson.learnerStage, "필즈 더 클래식 2과정 A4; 연령 미확정", `${lesson.id} learner stage`);
  assert.equal(lesson.status, "pilot", `${lesson.id} release state`);
  assert.ok(lesson.experience.tracks.length >= 2, `${lesson.id} concept track count`);
  assert.match(lesson.source.note, expectedPageEvidence[lessonIndex], `${lesson.id} exact student-book page range`);
  assert.match(lesson.source.note, /2A4 권별 테스트/, `${lesson.id} test cross-check note`);
  assert.doesNotMatch(lesson.source.note, /[A-Z]:\\|지필드 usb|내 드라이브/i, `${lesson.id} leaks a private source path`);

  trackCount += lesson.experience.tracks.length;
  for (const track of lesson.experience.tracks) {
    assert.ok(track.id && track.title && track.openingPrompt && track.hint, `${lesson.id} incomplete concept track`);
    assert.equal(track.beats.length, 4, `${track.id} beat count`);
    assert.deepEqual(track.beats.map((beat) => beat.visual.phase), ["problem", "organize", "calculate", "verify"], `${track.id} phase order`);
    beatCount += track.beats.length;
    for (const beat of track.beats) {
      assert.equal(beat.visual.kind, "course02-a4", `${track.id} visual kind`);
      const markup = course02A4ConceptMarkup(beat.visual);
      assert.ok(markup.includes("course02-a4-visual"), `${track.id} beat render`);
      assert.equal(markup, course02A4ConceptMarkup(beat.visual), `${track.id} deterministic beat render`);
      if (beat.visual.phase === "verify") assert.ok(markup.includes("a4-answer"), `${track.id} verify beat omits answer`);
      else assert.ok(!markup.includes("a4-answer") && !markup.includes("정답"), `${track.id} student beat reveals answer`);
    }
  }

  assert.equal(lesson.original.items.length, 4, `${lesson.id} original practice count`);
  assert.ok(lesson.extension && !Array.isArray(lesson.extension), `${lesson.id} extension item`);
  assert.equal(lesson.similarPractice.length, 5, `${lesson.id} similar practice count`);
  assert.deepEqual(lesson.dailyPractice, { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: 7 }, `${lesson.id} daily practice contract`);

  const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
  assert.equal(items.length, 10, `${lesson.id} total learner items`);
  for (const item of items) {
    itemCount += 1;
    assertNoPrivateResultKeys(item, item.id);
    assert.ok(item.prompt && item.hint && item.typeLabel, `${item.id} learner copy`);
    assert.equal(item.visual.kind, "course02-a4", `${item.id} visual kind`);
    assert.ok(item.answerRef.startsWith(`/course23/${lesson.bookId}/${lesson.id}/`), `${item.id} answer ref scope`);
    assert.ok(!ids.has(item.id), `duplicate item id ${item.id}`);
    assert.ok(!refs.has(item.answerRef), `duplicate answer ref ${item.answerRef}`);
    ids.add(item.id);
    refs.add(item.answerRef);
    observedTasks.add(item.visual.task);

    const model = course02A4Model(item.visual);
    assertModelAnswer(model, item.id);
    assert.deepEqual(item.resultContract, model.resultContract, `${item.id} public/model result contract`);
    if (model.resultContract.type === "set") {
      setContractCount += 1;
      assert.ok(Array.isArray(model.answerValues) && model.answerValues.length > 1, `${item.id} set answer cardinality`);
      assert.equal(model.answer, model.answerValues.join("; "), `${item.id} deterministic set normalization`);
    }

    const studentMarkup = course02A4ConceptMarkup({ ...item.visual, phase: "problem" });
    assert.ok(!studentMarkup.includes("a4-answer") && !studentMarkup.includes("정답"), `${item.id} student render reveals answer`);
    const verifyMarkup = course02A4ConceptMarkup({ ...item.visual, phase: "verify" });
    assert.ok(verifyMarkup.includes("a4-answer"), `${item.id} verify render lacks answer container`);
    assert.ok(verifyMarkup.includes(String(model.answer)), `${item.id} verify render omits computed answer`);
    assert.equal(verifyMarkup, course02A4ConceptMarkup({ ...item.visual, phase: "verify" }), `${item.id} deterministic verify render`);
  }
}

assert.equal(itemCount, 40, "Course 2 A4 item count");
assert.equal(ids.size, 40, "unique item id count");
assert.equal(refs.size, 40, "unique answer ref count");
assert.equal(trackCount, 13, "concept track count");
assert.equal(beatCount, 52, "concept beat count");
assert.equal(setContractCount, 5, "multiple-answer learner item count");
assert.deepEqual(observedTasks, requiredTasks, "source-supported subtype coverage");

assert.equal(course02A4Model({ kind: "course02-a4", task: "magic-line-sum", values: [2, 4, 6, 8, 10, 12, 14, 16, 18] }).answer, 30);
assert.equal(course02A4Model({ kind: "course02-a4", task: "formation-line-sums", values: [1, 2, 3, 4, 5, 6], lines: [[0, 1, 2], [2, 3, 4], [4, 5, 0]] }).answer, "9; 10; 11; 12");
assert.equal(course02A4Model({ kind: "course02-a4", task: "alphametic-addition", addends: ["A7", "28"], result: "9B", askLetter: "A" }).answer, 6);
assert.equal(course02A4Model({ kind: "course02-a4", task: "alphametic-multiplication", factor: "A7", multiplier: "4", result: "2B8", askLetter: "B" }).answer, 2);
assert.equal(course02A4Model({ kind: "course02-a4", task: "operation-matrix", digits: [2, 3, 4, 6], rowOps: ["+", "×"], rowTargets: [8, 12], colOps: ["-", "+"], colTargets: [3, 6] }).answer, "6, 2 / 3, 4");
assert.match(course02A4ConceptMarkup({ kind: "course02-a4", task: "operation-matrix", digits: [2, 3, 4, 6], rowOps: ["+", "×"], rowTargets: [8, 12], colOps: ["-", "+"], colTargets: [3, 6], phase: "verify" }), />6<.*>2<.*>3<.*>4</s);
assert.match(course02A4ConceptMarkup({ kind: "course02-a4", task: "alphametic-addition", addends: ["A7", "28"], result: "9B", askLetter: "A", phase: "verify" }), />67<.*>28<.*>95</s);
assert.equal(course02A4Model({ kind: "course02-a4", task: "gcd-pack", values: [54, 90, 126] }).answer, 18);
assert.equal(course02A4Model({ kind: "course02-a4", task: "lcm-cycle", periods: [9, 12, 20] }).answer, 180);
assert.equal(course02A4Model({ kind: "course02-a4", task: "consecutive-conditions", divisors: [4, 7, 5] }).answer, "48, 49, 50");
assert.equal(course02A4Model({ kind: "course02-a4", task: "gcd-lcm-relation", ratio: [4, 7], lcm: 252 }).answer, "36, 63");
assert.equal(course02A4Model({ kind: "course02-a4", task: "balance-ratio", aCount: 3, bCount: 2 }).answer, "2:3");
assert.equal(course02A4Model({ kind: "course02-a4", task: "linear-pair", a: 1, b: 1, c: 1, d: -1, firstTotal: 27, secondTotal: 5 }).answer, "16, 11");
assert.equal(course02A4Model({ kind: "course02-a4", task: "heads-legs", total: 18, measure: 50, firstUnits: 4, secondUnits: 2 }).answer, "7, 11");

assert.throws(() => course02A4Model({ kind: "course02-a4", task: "magic-line-sum", values: [1, 2, 3, 4, 5, 6, 7, 8, 10] }), /arithmetic progression|do not determine/);
assert.throws(() => course02A4Model({ kind: "course02-a4", task: "magic-missing", cells: [null, 1, 2, 3, 4, 5, 6, 7, 8], target: 15 }), /not uniquely constrained/);
assert.throws(() => course02A4Model({ kind: "course02-a4", task: "alphametic-addition", addends: ["A", "B"], result: "C", askLetter: "A" }), /must have one solution/);
assert.throws(() => course02A4Model({ kind: "course02-a4", task: "operation-matrix", digits: [1, 2, 3, 4], rowOps: ["+", "+"], rowTargets: [5, 5], colOps: ["+", "+"], colTargets: [5, 5] }), /must have one arrangement/);
assert.throws(() => course02A4Model({ kind: "course02-a4", task: "linear-pair", a: 1, b: 1, c: 2, d: 2, firstTotal: 8, secondTotal: 16 }), /do not determine one pair/);

console.log(`COURSE02_A4_AUDIT_OK lessons=${COURSE02_A4_LESSONS.length} tracks=${trackCount} beats=${beatCount} items=${itemCount} setContracts=${setContractCount} tasks=${observedTasks.size}`);
