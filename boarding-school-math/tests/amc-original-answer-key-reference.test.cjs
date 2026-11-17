"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const reference = require("../competition/amc-original-answer-key-reference.js");

const csvPath = path.join(__dirname, "../competition/amc-item-answer-key-reference.csv");
const rows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const headers = rows.shift().split(",");
const csv = rows.map(function (line) {
  const cells = line.split(",");
  return Object.fromEntries(headers.map(function (header, index) { return [header, cells[index]]; }));
});
const forms = new Map();
csv.forEach(function (row) {
  const key = `${row.program}|${row.year}|${row.form}`;
  forms.set(key, (forms.get(key) || 0) + 1);
});

assert.equal(csv.length, 6500);
assert.equal(forms.size, 266);
assert.equal(reference.answerCount, csv.length + 50);
assert.equal(reference.formCount, forms.size + 2);
assert.equal(reference.formFor("amc12", 1950, "").itemCount, 50);
assert.equal(reference.formFor("amc12", 1975, "").itemCount, 30);
assert.equal(reference.formFor("amc10", 2025, "A").itemCount, 25);
assert.equal(reference.formFor("aime", 2025, "I").itemCount, 15);
assert.equal(reference.answerFor("amc10", 2025, "A", 1).correctAnswer, "E");
assert.equal(reference.answerFor("amc10", 2025, "A", 2).correctAnswer, "B");
assert.equal(reference.accepts(reference.answerFor("amc10", 2025, "A", 1), "e"), true);
assert.equal(reference.accepts(reference.answerFor("amc10", 2025, "A", 1), "D"), false);
assert.equal(reference.answerFor("aime", 2025, "I", 15).correctAnswer, "735");
assert.equal(reference.accepts(reference.answerFor("aime", 2025, "I", 15), "0735"), false);
assert.equal(reference.accepts(reference.answerFor("aime", 2025, "I", 15), "735"), true);
assert.equal(reference.accepts(reference.answerFor("aime", 2025, "I", 15), "1000"), false);
assert.equal(reference.answerFor("amc10", 2025, "B", 1).sourceUrl, "https://live.poshenloh.com/past-contests/amc10/2025B/answers");
assert.equal(reference.answerFor("aime", 2025, "", 1), null);
assert.ok(csv.every(function (row) { return row.answer_key_url.startsWith("https://live.poshenloh.com/past-contests/"); }));

// The 6500-row LIVE snapshot remains unchanged. Two separately sourced 2026 A forms add 50 keys.
for (const program of ["amc10", "amc12"]) {
  assert.equal(reference.formFor(program, 2026, "A").itemCount, 25);
  assert.equal(reference.formFor(program, 2026, "B"), null);
  for (let question = 1; question <= 25; question++) {
    const entry = reference.answerFor(program, 2026, "A", question);
    assert.match(entry.sourceUrl, /^https:\/\/www\.thethinkacademy\.com\/blog\/2026-amc-(?:10|12)a-problems-solutions\/$/);
    assert.match(entry.correctAnswer, /^[A-E]$/);
    assert.match(entry.sourceLabel, /Think Academy/);
  }
}
