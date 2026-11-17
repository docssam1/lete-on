"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("../amc10-gfield-mock-bank.js");
require("../amc12-gfield-mock-bank.js");

const packet = fs.readFileSync(path.join(__dirname, "../docs/AMC10_AMC12_GFIELD_FORM_REVIEW.md"), "utf8");

function tableRows(heading) {
  const section = packet.split(`## ${heading}`)[1];
  assert.ok(section, `missing review section: ${heading}`);
  return section.split("\n## ")[0].split("\n").filter((line) => /^\|\s*\d+\s*\|/.test(line)).map((line) => line.split("|").map((cell) => cell.trim()));
}

function normalizedMath(value) {
  return value.replaceAll("$", "").replace(/\\frac\{([^}]+)\}\{([^}]+)\}/gu, "$1/$2").replaceAll("\\sqrt", "√");
}

for (const [heading, exam] of [
  ["AMC 10 · 25문항 · 75분", globalThis.GFIELDAMC10Mock],
  ["AMC 12 · 25문항 · 75분", globalThis.GFIELDAMC12Mock]
]) {
  const rows = tableRows(heading);
  assert.equal(rows.length, exam.items.length, `${heading} item count`);
  rows.forEach((cells, index) => {
    assert.equal(Number(cells[1]), index + 1, `${heading} question order`);
    assert.equal(cells[2], exam.items[index].standard, `${heading} Q${index + 1} diagnostic domain`);
    assert.equal(normalizedMath(cells[4]), String(exam.items[index].choices[exam.items[index].answer]), `${heading} Q${index + 1} answer key`);
  });
}

assert.match(packet, /외부 교육자 검토 및 학생 파일럿 전/);
assert.match(packet, /점수를 학년 등급이나 AMC 실전 수준으로 환산하지 않는다/);
