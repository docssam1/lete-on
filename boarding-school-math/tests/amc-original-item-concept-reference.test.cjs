"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const reference = require("../competition/amc-original-item-concept-reference.js");

test("2010 AMC 8 concept references cover each original question and reject other forms", function () {
  assert.equal(reference.entries.length, 25);
  assert.deepEqual(reference.entries.map((entry) => entry.question), Array.from({ length: 25 }, (_, index) => index + 1));
  reference.entries.forEach((entry) => {
    assert.equal(entry.program, "amc8");
    assert.equal(entry.year, 2010);
    assert.equal(entry.form, "");
    assert.ok(["algebra", "number", "geometry", "counting", "data"].includes(entry.domain));
    assert.ok(entry.sourceConcepts.length > 0);
    assert.match(entry.sourceUrl, new RegExp(`/amc8/2010/problem/${entry.question}$`));
    assert.ok(Number.isFinite(entry.sourceDifficultyRating));
  });
  assert.equal(reference.referenceFor("amc8", 2010, "", 17).topicLabel, "넓이 분할·삼각형의 넓이");
  assert.equal(reference.referenceFor("amc8", 2010, "A", 17), null);
  assert.equal(reference.referenceFor("amc10", 2010, "A", 17), null);
  assert.equal(reference.referenceFor("amc8", 2011, "", 17), null);
  assert.equal(reference.referenceFor("amc8", 2010, "", 26), null);
});

test("CSV evidence and code map remain synchronized without copied question content", function () {
  const csvPath = path.resolve(__dirname, "../competition/historical-amc-grade/amc8-2010-item-concepts.csv");
  const rows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
  assert.equal(rows.length, 26);
  assert.match(rows[0], /source_concepts,gfield_domain,gfield_topic_label/);
  assert.ok(rows.slice(1).every((row) => row.startsWith("amc8,2010,")));
  const text = fs.readFileSync(path.resolve(__dirname, "../competition/amc-original-item-concept-reference.js"), "utf8");
  assert.doesNotMatch(text, /"questionText"|"answerText"|"solutionText"/);
});

test("year-by-year LIVE inventory contains every AMC 8 item in all 41 available years", function () {
  const inventoryPath = path.resolve(__dirname, "../competition/historical-amc-grade/amc8-item-concept-source-inventory.csv");
  const lines = fs.readFileSync(inventoryPath, "utf8").trim().split(/\r?\n/);
  assert.equal(lines.length, 1026);
  assert.match(lines[0], /^program,year,form,question,source_concepts,source_difficulty_rating,source_url,source_solutions_url,gfield_mapping_status$/);
  const keys = new Set();
  const years = new Set();
  lines.slice(1).forEach((line) => {
    const fields = line.split(",");
    assert.equal(fields.length, 9);
    const [, year, , question, concepts, rating, sourceUrl, solutionsUrl, mappingStatus] = fields;
    const key = `${year}:${question}`;
    assert.equal(keys.has(key), false, `duplicate ${key}`);
    keys.add(key);
    years.add(Number(year));
    assert.ok(concepts.length > 0);
    assert.match(rating, /^\d+$/);
    assert.match(sourceUrl, new RegExp(`/amc8/${year}/problem/${question}$`));
    assert.equal(solutionsUrl, `https://live.poshenloh.com/past-contests/amc8/${year}/solutions`);
    if (Number(year) !== 2010) assert.match(mappingStatus, /domain review pending/);
  });
  assert.equal(years.size, 41);
  assert.equal(years.has(2021), false);
  assert.equal(Math.min(...years), 1985);
  assert.equal(Math.max(...years), 2026);
  years.forEach((year) => {
    for (let question = 1; question <= 25; question += 1) assert.equal(keys.has(`${year}:${question}`), true);
  });
});
