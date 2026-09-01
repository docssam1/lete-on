#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..", "..", "..");
const context = { window: {}, globalThis: {} };
context.globalThis = context.window;

[
  "hsmiddle/data.js",
  "hsmiddle/question-bank/data/schema.js",
  "hsmiddle/question-bank/data/type-registry.js",
  "hsmiddle/question-bank/data/source-page-index.js",
  "hsmiddle/question-bank/data/item-index.js",
  "hsmiddle/question-bank/catalog.js"
].forEach(function (relativePath) {
  vm.runInNewContext(fs.readFileSync(path.join(projectRoot, relativePath), "utf8"), context, { filename: relativePath });
});

const catalog = context.window.HSMIDDLE_BANK.createCatalog();
const issues = [];
const releaseLockedNumbers = new Set([6, 25, 39]);
const releaseNotes = new Map([
  [6, "학년 연결 검수 중"],
  [25, "3번 풀이의 넓이 단위 오류 확인 중"],
  [39, "4번 풀이의 반복 주기 계산 오류 확인 중"]
]);
function check(condition, message) {
  if (!condition) issues.push(message);
}

check(catalog.length === 40, "catalog must retain all 40 diagnostic types");
check(catalog.reduce((sum, item) => sum + item.totalPages, 0) === 191, "catalog page total must be 191");
check(catalog.filter(item => item.sourceVerified).length === 40, "source-verified pilot type count must be 40");
check(catalog.filter(item => !item.sourceVerified).length === 0, "pending legacy bundle count must be 0");
check(catalog.reduce((sum, item) => sum + (item.questionCount || 0), 0) === 302, "confirmed item total must be 302");
check(catalog.reduce((sum, item) => sum + (item.releaseStatus === "locked" ? 0 : (item.questionCount || 0)), 0) === 287, "eligible item total must be 287");
check(catalog.filter(item => item.releaseStatus === "locked").length === 3, "locked type count must be 3");

const expected = new Map([
  [1, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [2, { count: 8, problem: [1, 2], answer: [3], solution: [4] }],
  [3, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5] }],
  [4, { count: 15, problem: [1, 2, 3, 4], answer: [5], solution: [6, 7] }],
  [5, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [6, { count: 4, problem: [1], answer: [2], solution: [3] }],
  [7, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [8, { count: 6, problem: [1, 2], answer: [3], solution: [4] }],
  [9, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [10, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [11, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [12, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [13, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [14, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5] }],
  [15, { count: 11, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [16, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [17, { count: 6, problem: [1, 2], answer: [3], solution: [4] }],
  [18, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [19, { count: 7, problem: [1, 2], answer: [3], solution: [4] }],
  [20, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [21, { count: 3, problem: [1], answer: [2], solution: [3] }],
  [22, { count: 2, problem: [1], answer: [2], solution: [3] }],
  [23, { count: 10, problem: [1, 2, 3], answer: [4], solution: [5, 6] }],
  [24, { count: 6, problem: [1, 2], answer: [3], solution: [4, 5] }],
  [25, { count: 4, problem: [1], answer: [3], solution: [3] }],
  [26, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [27, { count: 4, problem: [1], answer: [3], solution: [3] }],
  [28, { count: 15, problem: [1, 2, 3], answer: [5], solution: [5, 6, 7] }],
  [29, { count: 7, problem: [1, 2], answer: [3], solution: [4] }],
  [30, { count: 13, problem: [1, 2, 3], answer: [5], solution: [5, 6, 7] }],
  [31, { count: 2, problem: [1], answer: [2], solution: [3] }],
  [32, { count: 15, problem: [1, 2, 3, 4], answer: [5], solution: [6, 7] }],
  [33, { count: 12, problem: [1, 2], answer: [3], solution: [3, 4] }],
  [34, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [35, { count: 5, problem: [1, 2], answer: [3], solution: [4] }],
  [36, { count: 6, problem: [1, 2], answer: [3], solution: [4] }],
  [37, { count: 2, problem: [1], answer: [2], solution: [3] }],
  [38, { count: 6, problem: [1, 2], answer: [3], solution: [4, 5] }],
  [39, { count: 7, problem: [1, 2], answer: [3], solution: [4] }],
  [40, { count: 6, problem: [1, 2], answer: [3], solution: [4] }]
]);

expected.forEach(function (value, number) {
  const item = catalog.find(entry => entry.number === number);
  check(Boolean(item), `missing catalog type q${number}`);
  if (!item) return;
  check(item.questionCount === value.count, `wrong confirmed count q${number}`);
  check(item.problemPageNumbers.join("|") === value.problem.join("|"), `wrong problem pages q${number}`);
  check(item.answerPageNumbers.join("|") === value.answer.join("|"), `wrong answer pages q${number}`);
  check(item.solutionPageNumbers.join("|") === value.solution.join("|"), `wrong solution pages q${number}`);
  check(item.migrationStatus === "source-verified", `wrong migration state q${number}`);
  check(item.releaseStatus === (releaseLockedNumbers.has(number) ? "locked" : "eligible"), `wrong release gate q${number}`);
  check(item.releaseNote === (releaseNotes.get(number) || null), `wrong release note q${number}`);
  if (number === 28) check(item.semester === "4-1" && item.unit === "2단원 각도", "q28 must stay linked to the source 4-1 angle unit");
});

catalog.filter(item => !item.sourceVerified).forEach(function (item) {
  check(item.questionCount === null, `pending type has inferred question count q${item.number}`);
  check(item.migrationStatus === "pending", `wrong pending migration state q${item.number}`);
});

const q13 = catalog.find(item => item.number === 13);
const q17 = catalog.find(item => item.number === 17);
check(q13 && q17 && q13.type !== q17.type, "q13 and q17 need distinct detail names");
check(q13 && q17 && q13.conceptFamilyId === q17.conceptFamilyId, "q13 and q17 need a shared concept family");
const q07 = catalog.find(item => item.number === 7);
const q27 = catalog.find(item => item.number === 27);
check(q07 && q27 && q07.id !== q27.id, "q07 and q27 must remain separate source types");
check(q07 && q27 && q07.conceptFamilyId === q27.conceptFamilyId, "q07 and q27 need a shared clock-drift concept family");

if (issues.length) {
  console.error(`FAIL catalog data audit (${issues.length})`);
  issues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log("PASS catalog data audit: type=40 page=191 confirmedType=40 confirmedItem=302 eligibleItem=287 lockedType=3 pendingBundle=0 q06=learner-fit-locked q25=unit-conflict-locked q39=solution-cycle-conflict-locked sourcePdf=40 sourcePdfPage=191 fixedTenClaim=0");
