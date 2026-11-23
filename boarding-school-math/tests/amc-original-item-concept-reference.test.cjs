"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const reference = require("../competition/amc-original-item-concept-reference.js");

test("2010 AMC 8 concept references cover each original question and reject other forms", function () {
  assert.equal(reference.entries.length, 6550);
  const entries2010 = reference.entries.filter((entry) => entry.program === "amc8" && entry.year === 2010);
  assert.equal(entries2010.length, 25);
  assert.deepEqual(entries2010.map((entry) => entry.question), Array.from({ length: 25 }, (_, index) => index + 1));
  entries2010.forEach((entry) => {
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
  assert.equal(reference.referenceFor("amc10", 2010, "A", 17).program, "amc10");
  assert.ok(reference.referenceFor("amc8", 2011, "", 17));
  assert.equal(reference.referenceFor("amc8", 2010, "", 26), null);
  assert.equal(reference.referenceFor("amc8", 1985, "", 1).topicLabel, "분수");
  assert.equal(reference.referenceFor("amc8", 2026, "", 25).mappingStatus, "source-tag-crosswalk-suggestion");
  assert.equal(reference.referenceFor("amc8", 2021, "", 1), null);
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
    assert.match(mappingStatus, /teacher-reviewed question map|editable GFIELD domain suggestion/);
  });
  assert.equal(years.size, 41);
  assert.equal(years.has(2021), false);
  assert.equal(Math.min(...years), 1985);
  assert.equal(Math.max(...years), 2026);
  years.forEach((year) => {
    for (let question = 1; question <= 25; question += 1) assert.equal(keys.has(`${year}:${question}`), true);
  });
  const crosswalkPath = path.resolve(__dirname, "../competition/historical-amc-grade/amc8-gfield-concept-crosswalk.csv");
  const crosswalk = fs.readFileSync(crosswalkPath, "utf8").trim().split(/\r?\n/);
  assert.equal(crosswalk.length, 176);
  assert.match(crosswalk[0], /^source_concept,gfield_domain,korean_learning_label,mapping_basis$/);
  assert.equal(new Set(crosswalk.slice(1).map((line) => line.split(",")[0])).size, 175);
  crosswalk.slice(1).forEach((line) => {
    const [, domain, label, basis] = line.split(",");
    assert.ok(["algebra", "number", "geometry", "counting", "data", "functions"].includes(domain));
    assert.match(label, /[가-힣]/);
    assert.ok(basis.length > 0);
  });
  const domainsByTag = new Map(crosswalk.slice(1).map((line) => {
    const [tag, domain, label] = line.split(",");
    return [tag, { domain, label }];
  }));
  reference.entries.filter((entry) => entry.program === "amc8").forEach((entry) => {
    if (entry.year !== 2010) assert.ok(entry.sourceConcepts.every((tag) => domainsByTag.has(tag)));
    assert.ok(["algebra", "number", "geometry", "counting", "data", "functions"].includes(entry.domain));
    assert.match(entry.topicLabel, /[가-힣]/);
  });
});

test("all AMC 8/10/12 and AIME yearly forms have source-linked item metadata", function () {
  const inventoryPath = path.resolve(__dirname, "../competition/amc-item-concept-source-inventory.csv");
  const rows = fs.readFileSync(inventoryPath, "utf8").trim().split(/\r?\n/);
  assert.equal(rows.length, 6501);
  const counts = new Map([["amc8", 0], ["amc10", 0], ["amc12", 0], ["aime", 0]]);
  const forms = new Set();
  for (const entry of reference.entries) {
    counts.set(entry.program, (counts.get(entry.program) || 0) + 1);
    forms.add(`${entry.program}:${entry.year}:${entry.form}`);
    assert.ok(entry.sourceConcepts.length > 0);
    if (entry.year === 2026 && ["amc10", "amc12"].includes(entry.program)) {
      assert.equal(entry.form, "A");
      assert.equal(entry.mappingStatus, "editorial-source-solution-crosswalk");
      assert.equal(entry.sourceUrl, `https://wiki.randommath.com/${entry.program}/2026/part-a`);
    } else {
      assert.match(entry.sourceUrl, new RegExp(`/${entry.program}/${entry.year}${entry.form || ""}/problem/${entry.question}$`));
    }
    assert.ok(["algebra", "number", "geometry", "counting", "data", "functions"].includes(entry.domain));
    assert.match(entry.topicLabel, /[가-힣]/);
  }
  assert.deepEqual(Object.fromEntries(counts), { amc8: 1025, amc10: 1325, amc12: 3135, aime: 1065 });
  assert.equal(forms.size, 268);
  assert.equal(reference.referenceFor("amc10", 2025, "A", 1).domain, "number");
  assert.equal(reference.referenceFor("amc10", 2025, "A", 3).domain, "geometry");
  assert.ok(reference.referenceFor("amc12", 2025, "B", 25));
  assert.ok(reference.referenceFor("aime", 2025, "I", 15));
  assert.equal(reference.referenceFor("aime", 2025, "III", 1), null);
  const taxonomy = fs.readFileSync(path.resolve(__dirname, "../competition/amc-live-concept-taxonomy.csv"), "utf8").trim().split(/\r?\n/);
  assert.equal(taxonomy.length, 257);
  const crosswalk = fs.readFileSync(path.resolve(__dirname, "../competition/amc-gfield-concept-crosswalk-all.csv"), "utf8").trim().split(/\r?\n/);
  assert.equal(crosswalk.length, 912);
  assert.equal(new Set(crosswalk.slice(1).map((row) => row.split(",")[0])).size, 911);
  for (const [tag, domain] of [["derangements", "counting"], ["slope", "algebra"], ["median-geometry", "geometry"], ["eulers-totient-function", "number"], ["distributive-property", "algebra"]]) {
    const row = crosswalk.find((line) => line.startsWith(`${tag},`));
    assert.ok(row, `missing concept crosswalk for ${tag}`);
    assert.match(row, new RegExp(`,${domain},`));
  }
});
