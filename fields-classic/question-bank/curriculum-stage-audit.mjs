import { CURRICULUM, TEXTBOOK_STAGES, TYPES, textbookGuideForType, typeById } from "./source-data.js";

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
assert(new Set(TYPES.map((type) => type.id)).size === TYPES.length, "global type id duplicated");
assert(TEXTBOOK_STAGES.map((stage) => stage.id).join(",") === "concept,type,practice,advanced", "stage order changed");
assert(TEXTBOOK_STAGES.map((stage) => stage.difficulty).join(",") === "1,1,2,3", "stage difficulty mapping changed");

const sourceKeys = new Set();
const detailedSourceKeys = new Set();
const detailedSourceKeysByBook = new Map();
const curriculumTypeIds = new Set();
let unitCount = 0;
let rangeCount = 0;
let sourceQuestionCount = 0;
let detailedTypeCount = 0;
let detailedReferenceCount = 0;
let detailedQuestionCount = 0;

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

    if (unit.typeStudyRefs) {
      const detailedTypeIds = Object.keys(unit.typeStudyRefs).sort();
      assert(detailedTypeIds.join(",") === [...unit.typeIds].sort().join(","), `${book.label} ${unit.label}: detailed type set mismatch`);
      detailedTypeCount += detailedTypeIds.length;
      for (const typeId of detailedTypeIds) {
        const byStage = unit.typeStudyRefs[typeId];
        assert(Object.keys(byStage).sort().join(",") === Object.keys(expectedStageSections).sort().join(","), `${book.label} ${unit.label} ${typeId}: detailed stage set mismatch`);
        for (const stage of TEXTBOOK_STAGES) {
          const references = byStage[stage.id];
          assert(Array.isArray(references), `${book.label} ${unit.label} ${typeId} ${stage.label}: detailed references missing`);
          for (const reference of references) {
            detailedReferenceCount += 1;
            assert(reference.section === expectedStageSections[stage.id], `${book.label} ${unit.label} ${typeId} ${stage.label}: detailed section mismatch`);
            assert(Number.isInteger(reference.group) && reference.group >= 1, `${book.label} ${unit.label} ${typeId} ${stage.label}: invalid detailed group`);
            assert(Array.isArray(reference.numbers) && reference.numbers.length > 0, `${book.label} ${unit.label} ${typeId} ${stage.label}: problem numbers missing`);
            assert(new Set(reference.numbers).size === reference.numbers.length, `${book.label} ${unit.label} ${typeId} ${stage.label}: duplicate problem number`);
            assert(reference.numbers.every((number, index) => Number.isInteger(number) && number >= 1 && (index === 0 || number > reference.numbers[index - 1])), `${book.label} ${unit.label} ${typeId} ${stage.label}: problem numbers must be ascending positive integers`);
            const parentRange = unit.studyRefs[stage.id].find((range) => range.section === reference.section && range.group === reference.group);
            assert(parentRange, `${book.label} ${unit.label} ${typeId} ${stage.label}: parent range missing`);
            for (const question of reference.numbers) {
              assert(question >= parentRange.from && question <= parentRange.to, `${book.label} ${unit.label} ${typeId} ${stage.label}: q${question} outside parent range`);
              const key = `${book.id}/unit-${twoDigits(unitIndex + 1)}/${reference.section}-${twoDigits(reference.group)}/q-${twoDigits(question)}`;
              assert(!detailedSourceKeys.has(key), `source problem assigned to multiple detailed types: ${key}`);
              detailedSourceKeys.add(key);
              if (!detailedSourceKeysByBook.has(book.id)) detailedSourceKeysByBook.set(book.id, new Set());
              detailedSourceKeysByBook.get(book.id).add(key);
              detailedQuestionCount += 1;
            }
          }
        }
      }
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
assert(sourceQuestionCount === 1613, `expected 1613 source questions, got ${sourceQuestionCount}`);
assert(sourceKeys.size === sourceQuestionCount, "source question keys are not unique");
assert(curriculumTypeIds.size === 426, `expected 426 curriculum types, got ${curriculumTypeIds.size}`);
assert(detailedTypeCount === 473, `expected 473 detailed types, got ${detailedTypeCount}`);
assert(detailedReferenceCount === 893, `expected 893 detailed references, got ${detailedReferenceCount}`);
assert(detailedQuestionCount === 1613, `expected 1613 detailed source questions, got ${detailedQuestionCount}`);
const fullyDetailedBooks = CURRICULUM.filter((book) => book.units.every((unit) => unit.typeStudyRefs));
assert(fullyDetailedBooks.map((book) => book.id).join(",") === "book-01,book-02,book-03,book-04,book-05,book-06,book-07,book-08,book-09,book-10", "fully detailed book set changed");
for (const book of fullyDetailedBooks) {
  const source = [...sourceKeys].filter((key) => key.startsWith(`${book.id}/`));
  const detailed = detailedSourceKeysByBook.get(book.id) || new Set();
  assert(source.length === detailed.size, `${book.label} detailed coverage mismatch ${detailed.size}/${source.length}`);
  for (const key of source) assert(detailed.has(key), `${book.label} source problem not classified: ${key}`);
}
for (const typeId of curriculumTypeIds) {
  assert(textbookGuideForType(typeId) !== fallbackGuide, `explicit concept guide missing for ${typeId}`);
}

console.log(`CURRICULUM_STAGE_AUDIT_OK books=${CURRICULUM.length} units=${unitCount} stages=${TEXTBOOK_STAGES.length} ranges=${rangeCount} sourceQuestions=${sourceQuestionCount} types=${curriculumTypeIds.size} detailedTypes=${detailedTypeCount} detailedRefs=${detailedReferenceCount} detailedQuestions=${detailedQuestionCount}`);
