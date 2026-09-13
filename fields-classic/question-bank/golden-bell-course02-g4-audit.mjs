import assert from "node:assert/strict";
import {
  COURSE02_G4_LESSONS,
  course02G4ConceptMarkup,
  course02G4Model
} from "./golden-bell-course02-g4-lessons.js";

const EXPECTED_UNITS = [
  "특수각과 도형의 복원",
  "평행선과 색종이 접기",
  "평면도형의 넓이",
  "평면도형의 둘레"
];
const EXPECTED_SOURCE_RANGES = [
  ["p.6-8", "p.9-10", "p.11-15", "p.16-17", "p.18-21", "p.22-23", "p.24-26", "p.27-33"],
  ["p.36-41", "p.42-44", "p.45-48", "p.49-51", "p.52-54", "p.55-57", "p.58-60", "p.61-71"],
  ["p.74-76", "p.77-78", "p.79-81", "p.82-83", "p.84-87", "p.88-89", "p.90-91", "p.92-93", "p.94-96", "p.97-107"],
  ["p.110-112", "p.113-115", "p.116-119", "p.120-121", "p.122-127", "p.128-129", "p.130-133", "p.134-144"]
];
const REQUIRED_TASKS = new Set([
  "folded-corner", "fold-bisector", "isosceles-apex", "around-point",
  "parallel-pair", "zigzag-parallel", "fold-parallel", "exterior-missing",
  "rectangle-cutout-area", "parallelogram-area", "triangle-area", "trapezoid-area", "rearranged-area",
  "notched-perimeter", "staircase-perimeter", "rectangle-ratio-side", "tile-ratio-perimeter"
]);
const PHASES = ["problem", "organize", "calculate", "verify"];

function publicKeysAreSafe(value, location = "item") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (["answer", "solution"].includes(key)) assert.fail(`${location} exposes ${key}`);
    publicKeysAreSafe(child, `${location}.${key}`);
  }
}

function expectedUnit(task) {
  if (["folded-corner", "fold-bisector", "isosceles-apex", "around-point", "parallel-pair", "zigzag-parallel", "fold-parallel", "exterior-missing"].includes(task)) return "°";
  if (["rectangle-cutout-area", "parallelogram-area", "triangle-area", "trapezoid-area", "rearranged-area"].includes(task)) return "cm²";
  return "cm";
}

assert.equal(COURSE02_G4_LESSONS.length, 4, "G4 must contain four lessons");
assert.deepEqual(COURSE02_G4_LESSONS.map((lesson) => lesson.unit), EXPECTED_UNITS, "unit titles must match the verified teacher guide");

const ids = new Set();
const refs = new Set();
const visualSignatures = new Set();
const coveredTasks = new Set();
let itemCount = 0;
let trackCount = 0;
let beatCount = 0;

for (const [lessonIndex, lesson] of COURSE02_G4_LESSONS.entries()) {
  assert.equal(lesson.bookId, "course-02-g4");
  assert.equal(lesson.courseId, "course-02");
  assert.equal(lesson.label, "G4");
  assert.equal(lesson.learnerStage, "필즈 더 클래식 2과정 G4; 연령 미확정");
  assert.equal(lesson.dailyPractice.problemCount, 10);
  assert.deepEqual(
    [lesson.dailyPractice.original, lesson.dailyPractice.extension, lesson.dailyPractice.similar],
    [4, 1, 5]
  );
  assert.equal(lesson.original.items.length, 4, `${lesson.id} original practice count`);
  assert.equal(lesson.similarPractice.length, 5, `${lesson.id} similar practice count`);
  assert.ok(lesson.extension, `${lesson.id} extension item`);
  assert.ok(lesson.experience.tracks.length >= 2, `${lesson.id} needs multiple concept tracks`);
  assert.ok(!ids.has(lesson.id), `duplicate lesson id ${lesson.id}`);
  ids.add(lesson.id);

  assert.equal(lesson.source.origin, "textbook-derived");
  assert.match(lesson.source.note, /^교사용 지도서 「.+」/);
  for (const pageRange of EXPECTED_SOURCE_RANGES[lessonIndex]) assert.ok(lesson.source.note.includes(pageRange), `${lesson.id} missing ${pageRange}`);
  assert.doesNotMatch(lesson.source.note, /[A-Z]:\\|\\\\|내 드라이브|지필드 usb|filesystem/i, `${lesson.id} exposes a private source path`);

  trackCount += lesson.experience.tracks.length;
  for (const track of lesson.experience.tracks) {
    assert.ok(!ids.has(track.id), `duplicate track id ${track.id}`);
    ids.add(track.id);
    assert.ok(track.title && track.openingPrompt && track.hint);
    assert.equal(track.beats.length, 4, `${track.id} beat count`);
    assert.deepEqual(track.beats.map((beat) => beat.visual.phase), PHASES, `${track.id} phase order`);
    beatCount += track.beats.length;
    for (const beat of track.beats) {
      assert.equal(beat.visual.kind, "course02-g4");
      coveredTasks.add(beat.visual.task);
      const markup = course02G4ConceptMarkup(beat.visual);
      assert.ok(markup.includes("course02-g4-visual"), `${track.id} missing root markup`);
      assert.ok(markup.includes("role=\"img\""), `${track.id} missing semantic image role`);
      assert.ok(markup.includes("aria-label="), `${track.id} missing accessible SVG label`);
      if (beat.visual.phase !== "verify") {
        assert.ok(!markup.includes("answer-construction"), `${track.id} leaks an answer-only construction`);
        assert.ok(!markup.includes("g4-answer"), `${track.id} leaks a verified answer`);
      }
    }
  }

  const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
  assert.equal(items.length, 10, `${lesson.id} learner item count`);
  for (const item of items) {
    itemCount += 1;
    publicKeysAreSafe(item, item.id);
    assert.ok(item.id && item.prompt && item.hint && item.typeLabel, `${lesson.id} incomplete item`);
    assert.equal(item.answerMode, "input");
    assert.equal(item.inputMode, "numeric");
    assert.equal(item.responseMode, "numeric");
    assert.equal(item.unit, expectedUnit(item.visual.task), `${item.id} response unit`);
    assert.equal(item.visual.kind, "course02-g4");
    assert.equal(item.visual.phase, "problem");
    assert.ok(item.answerRef.startsWith(`/course23/${lesson.bookId}/${lesson.id}/`), `${item.id} answerRef namespace`);
    assert.ok(!ids.has(item.id), `duplicate item id ${item.id}`);
    assert.ok(!refs.has(item.answerRef), `duplicate answerRef ${item.answerRef}`);
    ids.add(item.id);
    refs.add(item.answerRef);
    coveredTasks.add(item.visual.task);

    const signature = JSON.stringify({ ...item.visual, phase: undefined });
    assert.ok(!visualSignatures.has(signature), `${item.id} duplicates another learner task model`);
    visualSignatures.add(signature);

    const answer = course02G4Model(item.visual).answer;
    assert.ok(typeof answer === "string" ? answer.trim() : Number.isFinite(answer), `${item.id} model answer is empty or non-finite`);
    const problemMarkup = course02G4ConceptMarkup(item.visual);
    const organizeMarkup = course02G4ConceptMarkup({ ...item.visual, phase: "organize" });
    const calculateMarkup = course02G4ConceptMarkup({ ...item.visual, phase: "calculate" });
    const verifyMarkup = course02G4ConceptMarkup({ ...item.visual, phase: "verify" });
    for (const [phase, markup] of [["problem", problemMarkup], ["organize", organizeMarkup], ["calculate", calculateMarkup]]) {
      assert.ok(!markup.includes("answer-construction"), `${item.id} leaks construction in ${phase}`);
      assert.ok(!markup.includes("g4-answer"), `${item.id} leaks answer in ${phase}`);
    }
    assert.ok(verifyMarkup.includes("answer-construction"), `${item.id} verify rendering omits construction evidence`);
    assert.ok(verifyMarkup.includes("g4-answer"), `${item.id} verify rendering omits answer container`);
    assert.ok(verifyMarkup.includes(String(answer)), `${item.id} verify rendering omits model answer`);
  }
}

assert.equal(itemCount, 40);
assert.equal(refs.size, 40);
assert.deepEqual([...REQUIRED_TASKS].filter((task) => !coveredTasks.has(task)), [], "representative G4 task coverage");

assert.equal(course02G4Model({ kind: "course02-g4", task: "folded-corner", fullAngle: 90, fixedAngle: 27 }).answer, 63);
assert.equal(course02G4Model({ kind: "course02-g4", task: "fold-bisector", halfAngle: 41, equalFold: true }).answer, 82);
assert.equal(course02G4Model({ kind: "course02-g4", task: "isosceles-apex", baseAngle: 55, equalSides: true }).answer, 70);
assert.equal(course02G4Model({ kind: "course02-g4", task: "parallel-pair", knownAngle: 71, relation: "same-side", parallel: true }).answer, 109);
assert.equal(course02G4Model({ kind: "course02-g4", task: "zigzag-parallel", topAngle: 28, bottomAngle: 53, parallel: true }).answer, 81);
assert.equal(course02G4Model({ kind: "course02-g4", task: "rectangle-cutout-area", width: 14, height: 10, cutWidth: 5, cutHeight: 4 }).answer, 120);
assert.equal(course02G4Model({ kind: "course02-g4", task: "trapezoid-area", top: 6, bottom: 14, height: 5 }).answer, 50);
assert.equal(course02G4Model({ kind: "course02-g4", task: "notched-perimeter", width: 18, height: 12, notchWidth: 6, notchDepth: 4, notchSide: "top" }).answer, 68);
assert.equal(course02G4Model({ kind: "course02-g4", task: "staircase-perimeter", width: 14, height: 10, steps: [[4, 3], [5, 2], [5, 5]] }).answer, 48);
assert.equal(course02G4Model({ kind: "course02-g4", task: "tile-ratio-perimeter", ratioWidth: 3, ratioHeight: 2, smallPerimeter: 50, columns: 4, rows: 3 }).answer, 180);

assert.throws(() => course02G4Model({ kind: "wrong", task: "folded-corner", fullAngle: 90, fixedAngle: 30 }), TypeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "folded-corner", fullAngle: 90, fixedAngle: 90 }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "fold-bisector", halfAngle: 30 }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "isosceles-apex", baseAngle: 50, equalSides: false }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "parallel-pair", knownAngle: 60, parallel: true }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "zigzag-parallel", topAngle: 100, bottomAngle: 80, parallel: true }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "rectangle-cutout-area", width: 8, height: 6, cutWidth: 8, cutHeight: 2 }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "staircase-perimeter", width: 10, height: 8, steps: [[3, 2], [4, 6]] }), RangeError);
assert.throws(() => course02G4Model({ kind: "course02-g4", task: "rectangle-ratio-side", ratioWidth: 3, ratioHeight: 2, perimeter: 51, target: "width" }), RangeError);
const hexagonExterior = course02G4ConceptMarkup({ kind: "course02-g4", task: "exterior-missing", sides: 6, knownAngles: [48, 62, 55, 71, 66], phase: "problem" });
assert.match(hexagonExterior, /<polygon points="(?:[^"]+,){5}[^"]+"/);
assert.equal((hexagonExterior.match(/<text /g) || []).length, 7, "hexagon must render six exterior labels plus its scale note");
assert.throws(() => course02G4ConceptMarkup({ kind: "course02-g4", task: "folded-corner", fullAngle: 90, fixedAngle: 30, phase: "answer" }), RangeError);

console.log(`COURSE02_G4_AUDIT_OK lessons=${COURSE02_G4_LESSONS.length} tracks=${trackCount} beats=${beatCount} items=${itemCount}`);
