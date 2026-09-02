import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { CURRICULUM, DOMAINS, SOURCE_QUESTION_INDEX, TYPES, representativeConceptForType, typeById } from "./source-data.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`TAXONOMY_SEARCH_AUDIT_FAILED: ${message}`);
};
const read = (name) => fs.readFileSync(fileURLToPath(new URL(name, import.meta.url)), "utf8");
const app = read("./app.js");
const html = read("./index.html");

const visible = TYPES.filter((item) => (item.sourceMatched || item.bankApproved)
  && (item.generator || item.worksheetCode) && !item.sourceAuditBlocked);
const visibleLabels = new Map();
for (const item of visible) visibleLabels.set(item.label, [...(visibleLabels.get(item.label) || []), item.id]);
const unexplainedDuplicateVisibleLabels = [...visibleLabels].filter(([, ids]) => {
  if (ids.length < 2) return false;
  const items = ids.map((id) => typeById(id));
  return !items.every((item) => item.catalogGroup
    && item.catalogGroup === items[0].catalogGroup
    && item.catalogStrategy
    && item.catalogStrategy === items[0].catalogStrategy);
});

assert(TYPES.length >= 800, `full type catalog unexpectedly small: ${TYPES.length}`);
assert(new Set(TYPES.map((item) => item.id)).size === TYPES.length, "duplicate type id");
assert(CURRICULUM.length === 10, `expected 10 books, found ${CURRICULUM.length}`);
assert(SOURCE_QUESTION_INDEX.length >= 2000, `source question index unexpectedly small: ${SOURCE_QUESTION_INDEX.length}`);
assert(DOMAINS.every((domain) => visible.some((item) => item.domain === domain.id)), "a major domain has no visible type");
assert(visible.every((item) => representativeConceptForType(item.id)?.label), "visible type without representative concept");
assert(unexplainedDuplicateVisibleLabels.length === 0, `unexplained visible duplicate labels: ${JSON.stringify(unexplainedDuplicateVisibleLabels)}`);

for (const book of CURRICULUM) {
  for (const unit of book.units) {
    assert(unit.typeIds.every((typeId) => typeById(typeId)), `${book.id} ${unit.label}: unknown type id`);
  }
}

const matrixIds = [
  "shape-sum-table", "shape-sum-table-row-target", "shape-sum-table-bottom-target",
  "shape-sum-table-column-target", "shape-sum-table-repeated-column-target", "symbol-sum-grid",
  "shape-sum-grid-triangle-top", "shape-sum-grid-top-target",
  "shape-sum-grid-triangle-column-target", "symbol-sum-grid-square-top"
];
const matrixTypes = matrixIds.map((id) => typeById(id));
assert(matrixTypes.every(Boolean), "shape-sum matrix type missing");
assert(matrixTypes.every((item) => item.middle === "도형이 나타내는 수"), "learner-facing matrix category is inconsistent");
assert(new Set(matrixTypes.map((item) => item.catalogGroup)).size === 1, "shape-sum types are not one catalog family");
assert(new Set(matrixTypes.map((item) => item.catalogStrategy)).size === 4, "shape-sum family must expose four solution strategies");
assert(matrixTypes.every((item) => item.searchAliases?.includes("매트릭스")), "legacy textbook term is not searchable");
assert(matrixTypes.every((item) => !/(세모|네모).*시작|첫째 줄/.test(item.label)), "surface-only matrix label remains visible");

assert(/id="bankSearch"/.test(html), "shared search input missing");
assert(/function normalizeSearchText/.test(app), "search normalization missing");
assert(/function curriculumSearchModel/.test(app), "book and unit search model missing");
assert(/function typeMatchesSearch/.test(app), "type and representative concept search missing");
assert(/data-type-ids=/.test(app), "catalog family selection missing");

console.log(`TAXONOMY_SEARCH_AUDIT_OK types=${TYPES.length} visible=${visible.length} sourceQuestions=${SOURCE_QUESTION_INDEX.length} books=${CURRICULUM.length} matrixStrategies=4 unexplainedDuplicateVisibleLabels=0`);
