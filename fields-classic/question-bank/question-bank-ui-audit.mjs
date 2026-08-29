import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { CURRICULUM, TEXTBOOK_STAGES } from "./source-data.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`QUESTION_BANK_UI_AUDIT_FAILED: ${message}`);
};

const read = (name) => fs.readFileSync(fileURLToPath(new URL(name, import.meta.url)), "utf8");
const app = read("./app.js");
const styles = read("./styles.css");

assert(CURRICULUM.length === 10, `expected 10 course books, found ${CURRICULUM.length}`);
assert(TEXTBOOK_STAGES.length === 4, `expected 4 textbook stages, found ${TEXTBOOK_STAGES.length}`);
assert(/class="curriculum-book-tabs"/.test(app), "book-first curriculum navigation missing");
assert(/const activeBookMarkup = \[activeBook\]\.map/.test(app), "all books can render at once again");
assert(/class="curriculum-inline-stages"/.test(app), "inline concept/type/practice/advanced controls missing");
assert(/index \+= 2/.test(app) && /questionCards\.slice\(index, index \+ 2\)/.test(app), "worksheet is not grouped into two questions per page");
assert(/\.question-page\{[^}]*grid-template-columns:repeat\(2/.test(styles), "two-column question page layout missing");
assert(/\.question-page\{[^}]*break-after:page/.test(styles), "question page print break missing");
assert(/\.question-page\{[^}]*grid-template-columns:1fr;grid-template-rows:repeat\(2/.test(styles), "two-question vertical print layout missing");
assert(/\.b1-five-card-magic\.t-shape:before\{right:75px\}/.test(styles), "T-magic horizontal connector protrudes past the last cell");
assert(/\.b1-five-card-magic\.t-shape:after\{bottom:42px\}/.test(styles), "T-magic vertical connector protrudes past the last cell");
assert(/sourceAuditBlockedStages\?\.\[item\?\.id\]\?\.includes\(stageId\)/.test(app), "source-audit-blocked textbook stages remain selectable");
assert(/function textbookConceptTutorialMarkup/.test(app), "textbook concept tutorial renderer missing");
assert(/class="textbook-concept-tutorial/.test(app), "textbook concept tutorial is not rendered");
assert(/class="concept-worked-solution"/.test(app), "concept worked solution disclosure missing");
assert(/\.textbook-concept-tutorial\{/.test(styles), "textbook concept tutorial styling missing");

const diagnosticBranch = app.indexOf('if (DIAGNOSTIC_EXAM_TYPES.includes(exam)) state.stage = "diagnostic"');
const practiceBranch = app.indexOf("else if (FINAL_EXAM_TYPES.includes(exam) || PRACTICE_EXAM_TYPES.includes(exam))");
assert(diagnosticBranch >= 0 && practiceBranch > diagnosticBranch, "diagnostic direct-link stage is shadowed by the mock branch");

console.log(`QUESTION_BANK_UI_AUDIT_OK books=${CURRICULUM.length} stages=${TEXTBOOK_STAGES.length} questionsPerPage=2`);
