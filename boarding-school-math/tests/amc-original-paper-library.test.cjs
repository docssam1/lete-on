"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const library = require("../competition/amc-original-paper-library.js");

test("year and form routes preserve LIVE archives and distinguish third-party 2026 A forms", function () {
  assert.equal(library.archiveFor("amc8").years.length, 41);
  assert.equal(library.archiveFor("amc8").years[0], 2026);
  assert.equal(library.archiveFor("amc8").years.at(-1), 1985);
  assert.equal(library.archiveFor("amc8").years.includes(2021), false);
  assert.equal(library.contestCount("amc8"), 41);
  assert.equal(library.archiveFor("amc10").years.length, 27);
  assert.equal(library.contestCount("amc10"), 53);
  assert.equal(library.archiveFor("amc12").years.length, 77);
  assert.equal(library.archiveFor("amc12").years.at(-1), 1950);
  assert.equal(library.contestCount("amc12"), 103);
  assert.equal(library.archiveFor("aime").years.length, 44);
  assert.equal(library.archiveFor("aime").years[0], 2026);
  assert.equal(library.archiveFor("aime").years.at(-1), 1983);
  assert.equal(library.archiveFor("aime").years.filter((year) => year >= 2000).length * 2 + library.archiveFor("aime").years.filter((year) => year <= 1999).length, 71);
  assert.equal(library.archiveRoute("amc8", 2023), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.equal(library.archiveRoute("amc10", 2025, "A"), "https://live.poshenloh.com/past-contests/amc10/2025A");
  assert.equal(library.archiveRoute("amc10", 2021, "D"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.deepEqual(library.formsFor("amc10", 2021), ["A", "B", "C", "D"]);
  assert.deepEqual(library.formsFor("amc8", 2023), [""]);
  assert.deepEqual(library.formsFor("amc10", 2000), [""]);
  assert.deepEqual(library.formsFor("aime", 1999), [""]);
  assert.equal(library.archiveRoute("amc12", 2024, "B"), "https://live.poshenloh.com/past-contests/amc12/2024B");
  assert.equal(library.archiveRoute("amc12", 1950, ""), "https://live.poshenloh.com/past-contests/amc12/1950");
  assert.equal(library.archiveRoute("amc10", 2000, ""), "https://live.poshenloh.com/past-contests/amc10/2000");
  assert.equal(library.archiveRoute("aime", 2026, "II"), "https://live.poshenloh.com/past-contests/aime/2026II");
  assert.equal(library.archiveRoute("aime", 2000, "I"), "https://live.poshenloh.com/past-contests/aime/2000I");
  assert.equal(library.archiveRoute("aime", 1999, ""), "https://live.poshenloh.com/past-contests/aime/1999");
  assert.equal(library.archiveRoute("aime", 1983, ""), "https://live.poshenloh.com/past-contests/aime/1983");
  assert.equal(library.printRoute("amc8", 2024, ""), "https://live.poshenloh.com/images/past-contests/pdf/amc8-2024-exam.pdf");
  assert.equal(library.printRoute("amc10", 2025, "A"), "https://live.poshenloh.com/images/past-contests/pdf/amc10-2025A-exam.pdf");
  assert.equal(library.printRoute("amc12", 1950, ""), "https://live.poshenloh.com/images/past-contests/pdf/amc12-1950-exam.pdf");
  assert.equal(library.printRoute("aime", 1983, ""), "https://live.poshenloh.com/images/past-contests/pdf/aime-1983-exam.pdf");
  assert.equal(library.printRoute("aime", 2024, "I"), "https://live.poshenloh.com/images/past-contests/pdf/aime-2024I-exam.pdf");
  assert.equal(library.answerRoute("amc10", 2021, "D"), "https://live.poshenloh.com/past-contests/amc10/2021D/answers");
  assert.equal(library.solutionsRoute("amc12", 1950, ""), "https://live.poshenloh.com/past-contests/amc12/1950/solutions");
  assert.equal(library.printRoute("amc10", 2030, "A"), "");
  assert.equal(library.archiveRoute("amc10", 2025, "D"), "");
  assert.equal(library.answerRoute("amc10", 2030, "A"), "");
  assert.equal(library.solutionsRoute("amc10", 2030, "A"), "");
  assert.equal(library.archiveRoute("amc10", 2030, "A"), "https://live.poshenloh.com/past-contests");
  assert.equal(library.problemRoute("amc8", 2023, "", 1), "https://live.poshenloh.com/past-contests/amc8/2023/problem/1");
  assert.equal(library.problemRoute("amc10", 2021, "D", 25), "https://live.poshenloh.com/past-contests/amc10/2021D/problem/25");
  assert.equal(library.problemRoute("amc12", 1950, "", 50), "https://live.poshenloh.com/past-contests/amc12/1950/problem/50");
  assert.equal(library.problemRoute("aime", 2026, "II", 15), "https://live.poshenloh.com/past-contests/aime/2026II/problem/15");
  assert.equal(library.formLabel("amc10", 2021, "A"), "A형 · 봄 (자료 코드 A)");
  assert.equal(library.formLabel("amc10", 2021, "C"), "A형 · 가을 (자료 코드 C)");
  assert.equal(library.formLabel("amc12", 2021, "D"), "B형 · 가을 (자료 코드 D)");
  assert.equal(library.formLabel("amc8", 2025, ""), "단일 시험지");
  assert.equal(library.formLabel("amc12", 2025, "B"), "B형");
  assert.equal(library.problemRoute("amc8", 2023, "", 26), "");
  assert.equal(library.problemRoute("aime", 2026, "III", 1), "");
  assert.equal(library.problemRoute("amc10", 2025, "D", 1), "");
  assert.equal(library.problemRoute("amc10", 2000, "A", 1), "");

  const contests = Object.entries(library.archives).flatMap(([programId, archive]) => archive.years.flatMap((year) => {
    const forms = programId === "amc8" || programId === "aime" && year <= 1999 || (programId === "amc10" || programId === "amc12") && year <= 2001
      ? [""]
      : year === 2026 && (programId === "amc10" || programId === "amc12") ? ["A"]
      : year === 2021 && (programId === "amc10" || programId === "amc12") ? ["A", "B", "C", "D"]
      : programId === "aime" ? ["I", "II"] : ["A", "B"];
    return forms.map((form) => ({ programId, year, form, route: library.archiveRoute(programId, year, form) }));
  }));
  assert.equal(contests.length, 268);
  assert.equal(new Set(contests.map((contest) => contest.route)).size, 268);
  contests.forEach(({ programId, year, form, route }) => {
    if (year === 2026 && ["amc10", "amc12"].includes(programId)) {
      const number = programId === "amc10" ? "10" : "12";
      assert.equal(form, "A");
      assert.equal(route, `https://www.thethinkacademy.com/blog/2026-amc-${number}a-problems-solutions/`);
      assert.match(library.printRoute(programId, year, form), /thethinkacademy\.com.*Paper\.pdf$/);
      assert.match(library.answerRoute(programId, year, form), /thethinkacademy\.com.*Answer-Key/);
      assert.equal(library.formatFor(programId, year, form).sourceStatus, "third-party-reproduction");
      assert.equal(library.problemRoute(programId, year, form, 1), "");
      assert.deepEqual(library.formsFor(programId, year), ["A"]);
      return;
    }
    assert.match(route, /^https:\/\/live\.poshenloh\.com\/past-contests\/(?:amc8|amc10|amc12|aime)\//);
    assert.equal(library.printRoute(programId, year, form).endsWith("-exam.pdf"), true);
    assert.equal(library.answerRoute(programId, year, form), `${route}/answers`);
    assert.equal(library.solutionsRoute(programId, year, form), `${route}/solutions`);
  });
});

test("AMC 12 yearly formats preserve historical item counts, time, and score rules", function () {
  const format = library.formatFor;
  assert.deepEqual([1955, 1965, 1970, 1975, 1977, 1985, 1986, 1999, 2000, 2002, 2007, 2025].map((year) => {
    const value = format("amc12", year);
    return [value.title, value.itemCount, value.durationMinutes, value.rawOnly, value.scoring && value.scoring.correct, value.scoring && value.scoring.blank, value.scoring && value.scoring.base];
  }), [
    ["AHSME", 50, null, true, null, null, null],
    ["AHSME", 40, null, true, null, null, null],
    ["AHSME", 35, null, true, null, null, null],
    ["AHSME", 30, 80, false, 5, 0, undefined],
    ["AHSME", 30, 90, false, 4, 0, 30],
    ["AHSME", 30, 90, false, 4, 0, 30],
    ["AHSME", 30, 90, false, 5, 2, undefined],
    ["AHSME", 30, 90, false, 5, 2, undefined],
    ["AMC 12", 25, 75, false, 6, 2, undefined],
    ["AMC 12", 25, 75, false, 6, 2.5, undefined],
    ["AMC 12", 25, 75, false, 6, 1.5, undefined],
    ["AMC 12", 25, 75, false, 6, 1.5, undefined]
  ]);
  assert.equal(format("amc12", 1949), null);
});

test("paper review points to the year-by-year archive without shipping contest content", function () {
  const projectRoot = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(projectRoot, "competition-paper-review.html"), "utf8");
  assert.match(html, /competition\/amc-original-paper-library\.js/);
  assert.match(html, /연도별 원본 기출/);
  assert.match(html, /archive-print-link/);
  assert.match(html, /archive-answer-link/);
  assert.match(html, /archive-solutions-link/);
  assert.match(html, /MAA 허가를 받은 LIVE 기출 아카이브/);
  const reviewScript = fs.readFileSync(path.join(projectRoot, "competition-paper-review.js"), "utf8");
  assert.match(reviewScript, /정수 답\(0–999\)/);
  assert.match(html, /원문 언어와 쪽 구성을 유지하며 파일을 따로 보관하지 않습니다/);
  assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/iu);
  const files = fs.readdirSync(path.join(projectRoot, "competition"));
  assert.deepEqual(files.filter((name) => /^(?:2022|2023).*amc.*\.pdf$/iu.test(name)), []);
});
