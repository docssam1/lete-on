(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDRoadmapPaceEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-roadmap-pace-v1";
  const LOCALES = Object.freeze(["ko", "en", "zh-Hans"]);
  const CURRICULA = Object.freeze({
    ko: Object.freeze({
      id: "kr-school-math",
      label: "한국 수학 과정",
      levels: Object.freeze({ foundation: "기초 연결", core: "학년 핵심", extension: "심화 준비" })
    }),
    en: Object.freeze({
      id: "us-school-math",
      label: "U.S. Grade & Course Path",
      levels: Object.freeze({ foundation: "Foundation", core: "On-grade core", extension: "Extension ready" })
    }),
    "zh-Hans": Object.freeze({
      id: "sg-school-math",
      label: "新加坡数学课程",
      levels: Object.freeze({ foundation: "基础巩固", core: "年级核心", extension: "拓展准备" })
    })
  });
  const GOAL_LOADS = Object.freeze({
    "school-g6": Object.freeze({ units: 20, targetBand: "core" }),
    "sasmo-primary6": Object.freeze({ units: 28, targetBand: "extension" }),
    "promotion-g6": Object.freeze({ units: 24, targetBand: "extension" })
  });

  function fail(message) { throw new Error(message); }
  function record(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function round(value, places) {
    const scale = 10 ** (places || 0);
    return Math.round(value * scale) / scale;
  }
  function integer(value, field, min, max) {
    if (!Number.isInteger(value) || value < min || value > max) fail(`${field} is invalid`);
    return value;
  }
  function localeOf(value) { return LOCALES.includes(value) ? value : "ko"; }
  function curriculumFor(locale) { return CURRICULA[localeOf(locale)]; }
  function localText(locale, ko, en, zh) { return locale === "en" ? en : locale === "zh-Hans" ? zh : ko; }

  function validateInput(input) {
    if (!record(input)) fail("roadmap input is required");
    const locale = localeOf(input.locale);
    if (!GOAL_LOADS[input.goalId]) fail("goalId is invalid");
    integer(input.weeksAvailable, "weeksAvailable", 2, 104);
    integer(input.studyDaysPerWeek, "studyDaysPerWeek", 1, 7);
    integer(input.minutesPerDay, "minutesPerDay", 20, 180);
    integer(input.observationCount, "observationCount", 1, 12);
    if (typeof input.retentionPassed !== "boolean") fail("retentionPassed is invalid");
    if (!Array.isArray(input.results) || input.results.length < 6 || input.results.length > 100) fail("results must contain 6-100 O/X records");
    input.results.forEach(function (result, index) {
      if (!record(result) || typeof result.id !== "string" || !result.id || typeof result.domainId !== "string" || !result.domainId || typeof result.correct !== "boolean") fail(`results[${index}] is invalid`);
    });
    if (new Set(input.results.map(function (result) { return result.id; })).size !== input.results.length) fail("result ids must be unique");
    return locale;
  }

  function summarizeResults(results) {
    const domains = new Map();
    let correct = 0;
    results.forEach(function (result) {
      if (result.correct) correct += 1;
      const row = domains.get(result.domainId) || { domainId: result.domainId, correct: 0, total: 0 };
      row.total += 1;
      if (result.correct) row.correct += 1;
      domains.set(result.domainId, row);
    });
    const domainRows = Array.from(domains.values()).map(function (row) {
      return Object.freeze({ domainId: row.domainId, correct: row.correct, total: row.total, rate: round(row.correct / row.total * 100, 0) });
    }).sort(function (left, right) { return left.rate - right.rate || left.domainId.localeCompare(right.domainId); });
    const rate = round(correct / results.length * 100, 0);
    const band = rate < 60 ? "foundation" : rate < 80 ? "core" : "extension";
    return Object.freeze({ correct, total: results.length, rate, band, domains: Object.freeze(domainRows) });
  }

  function capacity(studyDaysPerWeek, minutesPerDay) {
    return round(studyDaysPerWeek * minutesPerDay / 45 * 0.8, 1);
  }

  function option(id, label, days, minutes, requiredPace) {
    const weeklyCapacity = capacity(days, minutes);
    return Object.freeze({ id, label, studyDaysPerWeek: days, minutesPerDay: minutes, weeklyCapacity, feasible: weeklyCapacity >= requiredPace });
  }

  function buildRoadmap(input) {
    const locale = validateInput(input);
    const curriculum = curriculumFor(locale);
    const summary = summarizeResults(input.results);
    const goal = GOAL_LOADS[input.goalId];
    const stable = input.observationCount >= 2 && input.retentionPassed;
    const stabilizationWeeks = stable ? 0 : Math.min(2, Math.max(1, input.weeksAvailable - 1));
    const teachingWeeks = Math.max(1, input.weeksAvailable - stabilizationWeeks);
    const requiredPace = round(goal.units / teachingWeeks, 1);
    const currentCapacity = capacity(input.studyDaysPerWeek, input.minutesPerDay);
    const extraMinutes = Math.min(180, input.minutesPerDay + 15);
    const extraDays = Math.min(7, input.studyDaysPerWeek + 1);
    const options = Object.freeze([
      option("maintain", localText(locale, "현재 속도 유지", "Keep the current pace", "保持当前进度"), input.studyDaysPerWeek, input.minutesPerDay, requiredPace),
      option("time", localText(locale, "하루 15분 추가", "Add 15 minutes per day", "每天增加15分钟"), input.studyDaysPerWeek, extraMinutes, requiredPace),
      option("session", localText(locale, "주 1회 추가", "Add one study day", "每周增加1次"), extraDays, input.minutesPerDay, requiredPace),
      option("combined", localText(locale, "시간과 횟수 함께 조정", "Adjust both time and frequency", "同时调整时间与频次"), extraDays, extraMinutes, requiredPace)
    ]);
    const selected = options.find(function (candidate) { return candidate.feasible; }) || options[options.length - 1];
    const targetFeasible = selected.feasible;
    const extraWeeks = targetFeasible ? 0 : Math.max(1, Math.ceil(goal.units / selected.weeklyCapacity) - teachingWeeks);
    const weakest = summary.domains[0];
    const levelLabels = curriculum.levels;
    const comment = localText(
      locale,
      `종이 진단 ${summary.correct}/${summary.total}개가 O입니다. ${weakest.domainId}의 X가 가장 먼저 확인할 신호입니다. ${stable ? "재확인까지 안정적이므로 선택한 경로를 적용할 수 있습니다." : `${stabilizationWeeks}주 동안 현재 속도를 유지하며 재확인한 뒤에만 학습량을 늘립니다.`}`,
      `${summary.correct} of ${summary.total} paper items are marked O. ${weakest.domainId} is the first area to review. ${stable ? "The recheck is stable, so the selected route can begin." : `Keep the present pace for ${stabilizationWeeks} weeks and increase the load only after a stable recheck.`}`,
      `纸笔诊断中${summary.correct}/${summary.total}题标为O。先复查${weakest.domainId}。${stable ? "复测结果稳定，可以进入所选路径。" : `先保持当前进度${stabilizationWeeks}周，复测稳定后再增加学习量。`}`
    );
    const decision = targetFeasible
      ? localText(locale, `${selected.label}이면 목표 진도가 가능합니다.`, `${selected.label} is enough for the target route.`, `采用“${selected.label}”可以完成目标进度。`)
      : localText(locale, `시간과 횟수를 함께 늘려도 부족하므로 목표일을 약 ${extraWeeks}주 조정해야 합니다.`, `Even the combined increase is short; extend the target by about ${extraWeeks} weeks.`, `即使同时增加时间和频次仍不足，目标日期需顺延约${extraWeeks}周。`);

    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      locale,
      curriculum,
      summary,
      goal: Object.freeze({ id: input.goalId, requiredUnits: goal.units, targetBand: goal.targetBand, targetLabel: levelLabels[goal.targetBand] }),
      stability: Object.freeze({ state: stable ? "stable" : "observing", observationCount: input.observationCount, retentionPassed: input.retentionPassed, stabilizationWeeks, accelerationLocked: !stable }),
      pace: Object.freeze({ currentCapacity, requiredPace, teachingWeeks, targetFeasible, extraWeeks, options, selectedOptionId: selected.id }),
      comparison: Object.freeze([
        Object.freeze({ id: "current", label: localText(locale, "현재", "Current", "当前"), band: summary.band, levelLabel: levelLabels[summary.band], value: summary.rate }),
        Object.freeze({ id: "stable", label: localText(locale, "안정화 확인", "Stable recheck", "稳定复测"), band: summary.band, levelLabel: levelLabels[summary.band], value: Math.min(100, summary.rate + (stable ? 5 : 0)) }),
        Object.freeze({ id: "target", label: localText(locale, "목표", "Target", "目标"), band: goal.targetBand, levelLabel: levelLabels[goal.targetBand], value: goal.targetBand === "extension" ? 85 : 75 })
      ]),
      weakestDomainId: weakest.domainId,
      comment,
      decision
    });
  }

  return Object.freeze({ SCHEMA_VERSION, CURRICULA, GOAL_LOADS, buildRoadmap, summarizeResults, validateInput });
});
