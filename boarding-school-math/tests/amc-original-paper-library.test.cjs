"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const library = require("../competition/amc-original-paper-library.js");

test("year and form routes cover the full authorized AMC archive", function () {
  assert.equal(library.archiveFor("amc8").years.length, 41);
  assert.equal(library.archiveFor("amc8").years[0], 2026);
  assert.equal(library.archiveFor("amc8").years.at(-1), 1985);
  assert.equal(library.archiveFor("amc8").years.includes(2021), false);
  assert.equal(library.archiveFor("amc10").years.length, 26);
  assert.equal(library.archiveFor("amc12").years.length, 76);
  assert.equal(library.archiveFor("amc12").years.at(-1), 1950);
  assert.equal(library.archiveRoute("amc8", 2023), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.equal(library.archiveRoute("amc10", 2025, "A"), "https://live.poshenloh.com/past-contests/amc10/2025A");
  assert.equal(library.archiveRoute("amc10", 2021, "D"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.equal(library.archiveRoute("amc12", 2024, "B"), "https://live.poshenloh.com/past-contests/amc12/2024B");
  assert.equal(library.archiveRoute("amc12", 1950, ""), "https://live.poshenloh.com/past-contests/amc12/1950");
  assert.equal(library.archiveRoute("amc10", 2000, ""), "https://live.poshenloh.com/past-contests/amc10/2000");
  assert.equal(library.archiveRoute("amc10", 2030, "A"), "https://live.poshenloh.com/past-contests");
});

test("paper review points to the year-by-year archive without shipping contest content", function () {
  const projectRoot = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(projectRoot, "competition-paper-review.html"), "utf8");
  assert.match(html, /competition\/amc-original-paper-library\.js/);
  assert.match(html, /연도별 원본 기출/);
  assert.match(html, /MAA 허가를 받은 LIVE 기출 아카이브/);
  assert.match(html, /G·MAP은 파일이나 기출 문항을 복사해 배포하지 않습니다/);
  assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/iu);
  const files = fs.readdirSync(path.join(projectRoot, "competition"));
  assert.deepEqual(files.filter((name) => /^(?:2022|2023).*amc.*\.pdf$/iu.test(name)), []);
});
