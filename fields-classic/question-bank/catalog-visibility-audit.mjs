import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  CURRICULUM,
  DIAGNOSTIC_EXAM_TYPES,
  EXAMS,
  FINAL_EXAM_TYPES,
  PRACTICE_EXAM_TYPES,
  SOURCE_QUESTION_INDEX,
  TYPES
} from "./source-data.js";
import { GENERATORS } from "./generators.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`CATALOG_VISIBILITY_AUDIT_FAILED: ${message}`);
};

const examSources = [...DIAGNOSTIC_EXAM_TYPES, ...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES];
const verifiedExamTypeIds = new Set(examSources.flatMap((exam) =>
  exam.questions.filter((question) => question.verified === true).map((question) => question.typeId)
));
const indexedTypeIds = new Set(SOURCE_QUESTION_INDEX.flatMap((entry) => entry.typeIds));
const curriculumTypeIds = new Set(CURRICULUM.flatMap((book) => book.units.flatMap((unit) => unit.typeIds)));

const hasRoute = (item) => Boolean((item.generator && GENERATORS[item.generator]) || item.worksheetCode);
const hasProvenance = (item) => Boolean(item.sourceMatched || item.bankApproved);
const hasSelectableSource = (item) => Boolean(
  verifiedExamTypeIds.has(item.id) || item.textbookSource || item.worksheetSource
);
const selectable = (item) => !item.sourceAuditBlocked && hasRoute(item) && hasProvenance(item) && hasSelectableSource(item);

const selectableTypeIds = new Set(TYPES.filter(selectable).map((item) => item.id));
const referencedTypeIds = new Set([...verifiedExamTypeIds, ...indexedTypeIds, ...curriculumTypeIds]);
const hiddenTypes = TYPES.filter((item) => !selectable(item));

for (const typeId of referencedTypeIds) {
  assert(selectableTypeIds.has(typeId), `${typeId}: source-backed type would be hidden from the type catalog`);
}
for (const item of hiddenTypes) {
  assert(!referencedTypeIds.has(item.id), `${item.id}: referenced type is incorrectly classified as an orphan`);
}

const appPath = fileURLToPath(new URL("./app.js", import.meta.url));
const appSource = fs.readFileSync(appPath, "utf8");
assert(
  /const matchesStyle = \(item\) => isSelectableType\(item\)\s*&&/.test(appSource),
  "type tree no longer filters unselectable placeholders"
);
assert(
  /const count = TYPES\.filter\(\(item\) => isSelectableType\(item\) && academyStyleIdsForType/.test(appSource),
  "academy-style counts include hidden placeholders"
);

console.log(
  `CATALOG_VISIBILITY_AUDIT_OK visible=${selectableTypeIds.size} hiddenUnselectable=${hiddenTypes.length} referenced=${referencedTypeIds.size}`
);
