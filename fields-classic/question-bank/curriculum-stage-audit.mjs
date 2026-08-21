import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const expectedStageSections = Object.freeze({
  concept: "activity",
  type: "check",
  practice: "practice",
  advanced: "advanced"
});
const fallbackGuide = "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";

const fail = (message) => {
  throw new Error(`CURRICULUM_STAGE_AUDIT_FAILED: ${message}`);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const twoDigits = (value) => String(value).padStart(2, "0");

assert(CURRICULUM.length === 10, `expected 10 books, got ${CURRICULUM.length}`);
assert(TEXTBOOK_STAGES.map((stage) => stage.id).join(",") === "concept,type,practice,advanced", "stage order changed");
assert(TEXTBOOK_STAGES.map((stage) => stage.difficulty).join(",") === "1,1,2,3", "stage difficulty mapping changed");

const sourceKeys = new Set();
const curriculumTypeIds = new Set();
let unitCount = 0;
let rangeCount = 0;
let sourceQuestionCount = 0;

for (const [bookIndex, book] of CURRICULUM.entries()) {
  assert(book.id === `book-${twoDigits(bookIndex + 1)}`, `${book.label}: unstable book id`);
  assert(book.units.length === 4, `${book.label}: expected 4 units, got ${book.units.length}`);

  for (const [unitIndex, unit] of book.units.entries()) {
    unitCount += 1;
    assert(unit.studyRefs && typeof unit.studyRefs === "object", `${book.label} ${unit.label}: studyRefs missing`);
    assert(!Object.hasOwn(unit, "studyPages"), `${book.label} ${unit.label}: runtime page reference must not be used`);
    assert(Object.keys(unit.studyRefs).sort().join(",") === Object.keys(expectedStageSections).sort().join(","), `${book.label} ${unit.label}: stage set mismatch`);
    assert(unit.studyRefs.concept.length === unit.studyRefs.type.length, `${book.label} ${unit.label}: activity/check group count mismatch`);

    for (const typeId of unit.typeIds) {
      curriculumTypeIds.add(typeId);
      assert(typeById(typeId), `${book.label} ${unit.label}: unknown type ${typeId}`);
    }

    for (const stage of TEXTBOOK_STAGES) {
      const references = unit.studyRefs[stage.id];
      assert(Array.isArray(references) && references.length > 0, `${book.label} ${unit.label} ${stage.label}: reference missing`);
      references.forEach((reference, rangeIndex) => {
        rangeCount += 1;
        assert(reference.section === expectedStageSections[stage.id], `${book.label} ${unit.label} ${stage.label}: wrong section ${reference.section}`);
        assert(reference.group === rangeIndex + 1, `${book.label} ${unit.label} ${stage.label}: non-sequential group`);
        assert(reference.from === 1, `${book.label} ${unit.label} ${stage.label}: range must start at problem 1`);
        assert(Number.isInteger(reference.to) && reference.to >= reference.from, `${book.label} ${unit.label} ${stage.label}: invalid problem range`);

        for (let question = reference.from; question <= reference.to; question += 1) {
          const key = `${book.id}/unit-${twoDigits(unitIndex + 1)}/${reference.section}-${twoDigits(reference.group)}/q-${twoDigits(question)}`;
          assert(!sourceKeys.has(key), `duplicate source key ${key}`);
          sourceKeys.add(key);
          sourceQuestionCount += 1;
        }
      });
    }
  }
}

assert(unitCount === 40, `expected 40 units, got ${unitCount}`);
assert(rangeCount === 244, `expected 244 ranges, got ${rangeCount}`);
assert(sourceQuestionCount === 1618, `expected 1618 source questions, got ${sourceQuestionCount}`);
assert(sourceKeys.size === sourceQuestionCount, "source question keys are not unique");
assert(curriculumTypeIds.size === 96, `expected 96 curriculum types, got ${curriculumTypeIds.size}`);
for (const typeId of curriculumTypeIds) {
  assert(textbookGuideForType(typeId) !== fallbackGuide, `explicit concept guide missing for ${typeId}`);
}

console.log(`CURRICULUM_STAGE_AUDIT_OK books=${CURRICULUM.length} units=${unitCount} stages=${TEXTBOOK_STAGES.length} ranges=${rangeCount} sourceQuestions=${sourceQuestionCount} types=${curriculumTypeIds.size}`);
