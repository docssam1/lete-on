(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCScoreHistory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-amc-score-history-v3";
  const LEGACY_SCHEMA_VERSIONS = Object.freeze(["gfield-amc-score-history-v1", "gfield-amc-score-history-v2"]);
  const REGIONS = Object.freeze(["maa-us-canada", "international"]);
  const PROGRAMS = Object.freeze({ amc8: Object.freeze({ title: "AMC 8", max: 25, forms: ["AMC 8"] }), amc10: Object.freeze({ title: "AMC 10", max: 150, forms: ["A", "B"] }), amc12: Object.freeze({ title: "AMC 12", max: 150, forms: ["A", "B"] }) });
  const CURRENT_AIME_SOURCE = "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/";
  const INVITATIONAL_SOURCE = "https://maa.org/maa-invitational-competitions/";
  const INTERNATIONAL_SOURCE = "https://maa.org/amc-international/";

  function fail(code) { const error = new Error(code); error.code = code; throw error; }
  function ownKeys(value, keys) { return value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).every(function (key) { return keys.includes(key); }); }
  function validDate(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value; }
  function validateRecord(input, options) {
    const allowLegacyShape = Boolean(options && options.allowLegacyShape);
    const allowedKeys = ["id", "programId", "cycle", "form", "examDate", "rawScore", "maxScore", "regionId", "studentGrade"];
    if (!ownKeys(input, allowedKeys) || (!allowLegacyShape && !Object.prototype.hasOwnProperty.call(input, "regionId"))) fail("RECORD_SHAPE");
    const program = PROGRAMS[input.programId];
    if (!program) fail("PROGRAM_INVALID");
    if (typeof input.id !== "string" || !/^[A-Za-z0-9_-]{1,80}$/.test(input.id)) fail("RECORD_ID_INVALID");
    const cycleParts = typeof input.cycle === "string" && /^(20\d{2})-(\d{2})$/.exec(input.cycle);
    if (!cycleParts || Number(cycleParts[2]) !== (Number(cycleParts[1]) + 1) % 100) fail("CYCLE_INVALID");
    if (!program.forms.includes(input.form)) fail("FORM_INVALID");
    if (!validDate(input.examDate)) fail("DATE_INVALID");
    if (input.maxScore !== program.max || !Number.isFinite(input.rawScore) || input.rawScore < 0 || input.rawScore > program.max) fail("SCORE_INVALID");
    if (input.programId === "amc8" ? !Number.isInteger(input.rawScore) : !Number.isInteger(input.rawScore * 2)) fail("SCORE_INCREMENT_INVALID");
    const regionId = input.regionId == null || input.regionId === "" ? null : input.regionId;
    if (regionId !== null && !REGIONS.includes(regionId)) fail("REGION_INVALID");
    const studentGrade = input.studentGrade == null || input.studentGrade === "" ? null : input.studentGrade;
    if (studentGrade !== null && studentGrade !== "K" && (!Number.isInteger(studentGrade) || studentGrade < 1 || studentGrade > 12)) fail("GRADE_INVALID");
    return Object.freeze({ id: input.id, programId: input.programId, cycle: input.cycle, form: input.form, examDate: input.examDate, rawScore: input.rawScore, maxScore: input.maxScore, regionId: regionId, studentGrade: studentGrade });
  }
  function validateArchive(input) {
    if (!ownKeys(input, ["schemaVersion", "records"]) || ![SCHEMA_VERSION].concat(LEGACY_SCHEMA_VERSIONS).includes(input.schemaVersion) || !Array.isArray(input.records) || input.records.length > 100) fail("ARCHIVE_INVALID");
    const records = input.records.map(function (record) { return validateRecord(record, { allowLegacyShape: LEGACY_SCHEMA_VERSIONS.includes(input.schemaVersion) }); });
    const ids = records.map(function (record) { return record.id; });
    if (new Set(ids).size !== ids.length) fail("RECORD_ID_DUPLICATE");
    return Object.freeze({ schemaVersion: SCHEMA_VERSION, records: Object.freeze(records) });
  }
  function compare(records) {
    const valid = validateArchive({ schemaVersion: SCHEMA_VERSION, records: records });
    return Object.keys(PROGRAMS).map(function (programId) {
      const entries = valid.records.filter(function (record) { return record.programId === programId; }).sort(function (a, b) { return a.examDate.localeCompare(b.examDate) || a.cycle.localeCompare(b.cycle) || a.form.localeCompare(b.form); });
      return Object.freeze({ programId: programId, title: PROGRAMS[programId].title, entries: Object.freeze(entries) });
    }).filter(function (group) { return group.entries.length > 0; });
  }
  function cycleContext(programId, cycle, regionId) {
    if (cycle !== "2026-27" || (programId !== "amc10" && programId !== "amc12")) return null;
    if (regionId === "international") return Object.freeze({
      kind: "international",
      cycle: cycle,
      programId: programId,
      title: "2026–27 AMC International 응시 안내",
      note: "국제 AMC 응시자는 거주 국가의 International Group Leader에게 해당 주기의 AIME 기준과 자격을 확인하세요. 이 화면은 국제 자격을 판정하지 않습니다.",
      source: INTERNATIONAL_SOURCE
    });
    if (regionId !== "maa-us-canada") return Object.freeze({
      kind: "select-region",
      cycle: cycle,
      programId: programId,
      title: "응시 지역별 기준 확인",
      note: "2026–27 주기의 안내를 보려면 실제 응시 프로그램을 선택하세요. 국가별 AMC International 기준은 다를 수 있습니다."
    });
    return Object.freeze({
      kind: "maa-us-canada",
      cycle: cycle,
      programId: programId,
      threshold: programId === "amc10" ? 100 : 85,
      maxScore: 150,
      title: "2026–27 미국·캐나다 MAA AIME 점수 기준",
      note: "공식 성적과 그 밖의 자격 조건을 확인하세요. 2027년에는 만 13세 이상 조건도 적용됩니다. 2027 USAJMO·USAMO 선발은 AIME 점수를 주로 보며 AMC 점수는 선발 요소가 아니지만, 이 기록표는 어느 대회의 진출 여부도 판정하지 않습니다.",
      source: CURRENT_AIME_SOURCE,
      eligibilitySource: INVITATIONAL_SOURCE
    });
  }
  function qualificationProgress(record) {
    const context = record && cycleContext(record.programId, record.cycle, record.regionId);
    if (!context || context.kind !== "maa-us-canada" || !Number.isFinite(record.rawScore)) return null;
    const officialExamDate = record.form === "A" ? "2026-11-05" : "2026-11-13";
    if (record.examDate !== officialExamDate) return null;
    const pointsRemaining = Math.max(0, Math.round((context.threshold - record.rawScore) * 2) / 2);
    return Object.freeze({ threshold: context.threshold, maxScore: context.maxScore, reached: pointsRemaining === 0, pointsRemaining: pointsRemaining,
      label: pointsRemaining === 0 ? "점수 기준 이상 · 나이와 기타 자격 확인" : `점수 기준까지 ${pointsRemaining}점` });
  }
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, legacySchemaVersions: LEGACY_SCHEMA_VERSIONS, legacySchemaVersion: LEGACY_SCHEMA_VERSIONS[0], programs: PROGRAMS, validateRecord: validateRecord, validateArchive: validateArchive, compare: compare, cycleContext: cycleContext, qualificationProgress: qualificationProgress });
});
