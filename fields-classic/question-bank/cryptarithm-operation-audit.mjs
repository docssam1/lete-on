import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { GENERATORS } from "./generators.js";
import { TYPES, typeById } from "./source-data.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`CRYPTARITHM_OPERATION_AUDIT_FAILED: ${message}`);
};

const selectable = (item) => (item.sourceMatched || item.bankApproved)
  && (item.generator || item.worksheetCode) && !item.sourceAuditBlocked;
const vertical = TYPES.filter((item) => item.problemStructure === "vertical-cryptarithm");
const additions = vertical.filter((item) => item.operation === "addition");
const subtractions = vertical.filter((item) => item.operation === "subtraction");

assert(additions.length >= 30, `addition cryptarithm classification too small: ${additions.length}`);
assert(subtractions.length === 1, `expected one source-backed subtraction cryptarithm, found ${subtractions.length}`);
assert(additions.every((item) => item.middle === "덧셈 복면산" && item.operationLabel === "덧셈"), "addition cryptarithm category mismatch");
assert(subtractions.every((item) => item.middle === "뺄셈 복면산" && item.operationLabel === "뺄셈"), "subtraction cryptarithm category mismatch");
assert(subtractions[0].id === "subtract-to-repeated-number-b8", "unexpected subtraction cryptarithm source type");
assert(TYPES.filter(selectable).filter((item) => /복면산/.test(item.middle)).every((item) => item.operation), "selectable cryptarithm without operation classification");
assert(!TYPES.filter(selectable).some((item) => item.middle === "복면산" || item.middle === "복면산과 식"), "broad learner-facing cryptarithm category remains");

const subtractionGenerator = GENERATORS[typeById("subtract-to-repeated-number-b8").generator];
for (const difficulty of [1, 2, 3]) {
  for (let sample = 0; sample < 100; sample += 1) {
    const problem = subtractionGenerator({ difficulty });
    assert(problem?.visual?.operator === "−", `subtraction visual operator mismatch at difficulty ${difficulty}`);
    assert(problem.meta.a * 10 + problem.meta.b - problem.meta.c === problem.meta.total, `subtraction equation mismatch at difficulty ${difficulty}`);
    assert(problem.meta.total === problem.meta.d * 11, `subtraction result is not a repeated digit at difficulty ${difficulty}`);
    assert(problem.meta.candidates.length === 1, `subtraction answer is not unique at difficulty ${difficulty}`);
    assert(Number(problem.answer) === problem.meta.d, `subtraction answer mismatch at difficulty ${difficulty}`);
  }
}

const appSource = fs.readFileSync(fileURLToPath(new URL("./app.js", import.meta.url)), "utf8");
assert(/item\.operation, item\.operationLabel, item\.problemStructure/.test(appSource), "operation fields are not searchable");
assert(/function typeTaxonomyLabel/.test(appSource), "operation and problem structure are not shown in the catalog");

console.log(`CRYPTARITHM_OPERATION_AUDIT_OK addition=${additions.length} subtraction=${subtractions.length} subtractionSamples=300 broadCategories=0`);
