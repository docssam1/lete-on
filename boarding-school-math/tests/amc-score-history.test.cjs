"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const history = require("../competition/amc-score-history.js");

function record(overrides = {}) {
  return { id: "attempt-1", programId: "amc10", cycle: "2025-26", form: "A", examDate: "2025-11-06", rawScore: 99.5, maxScore: 150, regionId: null, studentGrade: null, ...overrides };
}

test("records only contest, cycle, form, date, and reported raw score", function () {
  const saved = history.validateRecord(record());
  assert.deepEqual(saved, record());
  assert.equal(Object.hasOwn(saved, "studentName"), false);
  assert.equal(Object.hasOwn(saved, "answers"), false);
});

test("validates program-specific scoring scales and forms", function () {
  assert.throws(() => history.validateRecord(record({ programId: "amc8", form: "AMC 8", maxScore: 25, rawScore: 20.5 })), { code: "SCORE_INCREMENT_INVALID" });
  assert.throws(() => history.validateRecord(record({ programId: "amc10", form: "AMC 8" })), { code: "FORM_INVALID" });
  assert.throws(() => history.validateRecord(record({ programId: "amc12", form: "C" })), { code: "FORM_INVALID" });
  assert.throws(() => history.validateRecord(record({ programId: "amc8", form: "AMC 8", maxScore: 25, rawScore: 26 })), { code: "SCORE_INVALID" });
  assert.throws(() => history.validateRecord(record({ examDate: "2025-02-30" })), { code: "DATE_INVALID" });
  assert.throws(() => history.validateRecord(record({ studentGrade: 13 })), { code: "GRADE_INVALID" });
  assert.throws(() => history.validateRecord(record({ studentGrade: "7" })), { code: "GRADE_INVALID" });
});

test("keeps the reported grade as context without deriving a peer rank", function () {
  assert.equal(history.validateRecord(record({ studentGrade: 7 })).studentGrade, 7);
  assert.equal(history.validateRecord(record({ studentGrade: "K" })).studentGrade, "K");
  assert.equal(history.validateRecord(record({ studentGrade: null })).studentGrade, null);
  assert.equal(Object.hasOwn(history.validateRecord(record({ studentGrade: 7 })), "percentile"), false);
});

test("compares scores only within each contest and orders each record by date", function () {
  const groups = history.compare([
    record({ id: "feb-amc10b", form: "B", examDate: "2026-02-01", rawScore: 102 }),
    record({ id: "amc8", programId: "amc8", cycle: "2025-26", form: "AMC 8", examDate: "2026-01-22", rawScore: 20, maxScore: 25 }),
    record({ id: "nov-amc10a", examDate: "2025-11-06", rawScore: 96 })
  ]);
  assert.deepEqual(groups.map((group) => [group.programId, group.entries.length]), [["amc8", 1], ["amc10", 2]]);
  assert.deepEqual(groups.find((group) => group.programId === "amc10").entries.map((entry) => entry.id), ["nov-amc10a", "feb-amc10b"]);
  assert.equal(Object.hasOwn(groups.find((group) => group.programId === "amc10").entries[1], "delta"), false);
});

test("archive rejects unknown fields, malformed cycles, and duplicate IDs", function () {
  assert.throws(() => history.validateArchive({ schemaVersion: history.schemaVersion, records: [record({ privateNote: "unexpected" })] }), { code: "RECORD_SHAPE" });
  assert.throws(() => history.validateArchive({ schemaVersion: history.schemaVersion, records: [record(), record()] }), { code: "RECORD_ID_DUPLICATE" });
  assert.throws(() => history.validateArchive({ schemaVersion: "old", records: [] }), { code: "ARCHIVE_INVALID" });
  assert.throws(() => history.validateRecord(record({ cycle: "2025-27" })), { code: "CYCLE_INVALID" });
  assert.throws(() => history.validateArchive({ schemaVersion: history.schemaVersion, records: Array.from({ length: 101 }, (_, index) => record({ id: `id-${index}` })) }), { code: "ARCHIVE_INVALID" });
  assert.throws(() => history.validateRecord(record({ regionId: "unknown" })), { code: "REGION_INVALID" });
});

test("imports v1 and v2 score archives and exports the v3 shape", function () {
  const legacyRecord = record();
  delete legacyRecord.regionId;
  const imported = history.validateArchive({ schemaVersion: history.legacySchemaVersion, records: [legacyRecord] });
  assert.equal(imported.schemaVersion, history.schemaVersion);
  assert.equal(imported.records[0].regionId, null);
  for (const schemaVersion of history.legacySchemaVersions) {
    const v2Record = record();
    delete v2Record.studentGrade;
    assert.equal(history.validateArchive({ schemaVersion: schemaVersion, records: [v2Record] }).records[0].studentGrade, null);
  }
  assert.deepEqual(history.validateArchive({ schemaVersion: history.schemaVersion, records: [record({ regionId: "maa-us-canada" })] }).records[0].regionId, "maa-us-canada");
  assert.throws(() => history.validateArchive({ schemaVersion: history.schemaVersion, records: [legacyRecord] }), { code: "RECORD_SHAPE" });
});

test("only returns the published MAA 2026-27 US/Canada fixed-score context", function () {
  assert.equal(history.cycleContext("amc10", "2026-27").kind, "select-region");
  assert.equal(history.cycleContext("amc10", "2026-27", "maa-us-canada").threshold, 100);
  assert.equal(history.cycleContext("amc12", "2026-27", "maa-us-canada").threshold, 85);
  assert.match(history.cycleContext("amc10", "2026-27", "maa-us-canada").note, /만 13세 이상/);
  assert.match(history.cycleContext("amc10", "2026-27", "maa-us-canada").note, /2027 USAJMO·USAMO 선발은 AIME 점수를 주로 보며 AMC 점수는 선발 요소가 아니지만/);
  assert.match(history.cycleContext("amc10", "2026-27", "maa-us-canada").note, /어느 대회의 진출 여부도 판정하지 않습니다/);
  assert.equal(history.cycleContext("amc10", "2026-27", "international").kind, "international");
  assert.equal(history.cycleContext("amc8", "2026-27"), null);
  assert.equal(history.cycleContext("amc10", "2025-26"), null);
});

test("shows only cycle, region, and contest matched AIME score target progress", function () {
  const below = history.qualificationProgress(record({ cycle: "2026-27", form: "A", examDate: "2026-11-05", regionId: "maa-us-canada", rawScore: 99.5 }));
  assert.deepEqual(below, { threshold: 100, maxScore: 150, reached: false, pointsRemaining: 0.5, label: "점수 기준까지 0.5점" });
  const reached = history.qualificationProgress(record({ cycle: "2026-27", form: "A", examDate: "2026-11-05", regionId: "maa-us-canada", rawScore: 100 }));
  assert.equal(reached.reached, true);
  assert.match(reached.label, /점수 기준 이상.*자격 확인/);
  assert.equal(history.qualificationProgress(record({ programId: "amc12", cycle: "2026-27", form: "A", examDate: "2026-11-05", regionId: "maa-us-canada", rawScore: 85 })).threshold, 85);
  assert.equal(history.qualificationProgress(record({ cycle: "2025-26", regionId: "maa-us-canada", rawScore: 130 })), null);
  assert.equal(history.qualificationProgress(record({ cycle: "2026-27", form: "B", examDate: "2026-11-05", regionId: "maa-us-canada", rawScore: 130 })), null);
  assert.equal(history.qualificationProgress(record({ cycle: "2026-27", form: "A", examDate: "2026-10-30", regionId: "maa-us-canada", rawScore: 130 })), null);
  assert.equal(history.qualificationProgress(record({ cycle: "2026-27", regionId: "international", rawScore: 130 })), null);
  assert.equal(history.qualificationProgress(record({ programId: "amc8", cycle: "2026-27", regionId: "maa-us-canada", form: "AMC 8", rawScore: 25, maxScore: 25 })), null);
  assert.equal(history.qualificationProgress(record({ cycle: "2026-27", rawScore: 130 })), null);
});
