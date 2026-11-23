(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCOriginalPaperLibrary = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Original contest content remains at its authorized host. GFIELD stores only routes and metadata.
  const archives = Object.freeze({
    amc8: Object.freeze({ title: "AMC 8", years: Object.freeze(Array.from({ length: 42 }, function (_, index) { return 2026 - index; }).filter(function (year) { return year !== 2021; })), forms: Object.freeze([""]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc8" }),
    amc10: Object.freeze({ title: "AMC 10", years: Object.freeze(Array.from({ length: 27 }, function (_, index) { return 2026 - index; })), forms: Object.freeze(["A", "B"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc10" }),
    amc12: Object.freeze({ title: "AMC 12", years: Object.freeze(Array.from({ length: 77 }, function (_, index) { return 2026 - index; })), forms: Object.freeze(["A", "B"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc12" }),
    aime: Object.freeze({ title: "AIME", years: Object.freeze(Array.from({ length: 44 }, function (_, index) { return 2026 - index; })), forms: Object.freeze(["I", "II"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "aime" })
  });
  function archiveFor(programId) { return archives[programId] || null; }

  function formsFor(programId, year) {
    const archive = archiveFor(programId);
    const selectedYear = Number(year);
    if (!archive || !archive.years.includes(selectedYear)) return Object.freeze([]);
    if (programId === "amc8" || programId === "aime" && selectedYear <= 1999 || (programId === "amc10" || programId === "amc12") && selectedYear <= 2001) return Object.freeze([""]);
    if ((programId === "amc10" || programId === "amc12") && selectedYear === 2021) return Object.freeze(["A", "B", "C", "D"]);
    return programId === "aime" ? Object.freeze(["I", "II"]) : Object.freeze(["A", "B"]);
  }

  function studyYearsFor(programId) { const archive = archiveFor(programId); return archive ? Object.freeze(archive.years.slice(0, 8)) : Object.freeze([]); }

  function contestCount(programId) {
    const archive = archiveFor(programId);
    return archive ? archive.years.reduce(function (total, year) { return total + formsFor(programId, year).length; }, 0) : 0;
  }

  function formatFor(programId, year, form) {
    const archive = archiveFor(programId);
    const selectedYear = Number(year);
    if (!archive || !archive.years.includes(selectedYear)) return null;
    if (programId === "amc12" && selectedYear < 2000) {
      const itemCount = selectedYear < 1960 ? 50 : selectedYear < 1968 ? 40 : selectedYear < 1974 ? 35 : 30;
      const durationMinutes = selectedYear < 1974 ? null : selectedYear < 1977 ? 80 : 90;
      const scoring = selectedYear < 1974 ? null : selectedYear < 1977
        ? Object.freeze({ correct: 5, wrong: -1, blank: 0, max: 150, label: "AHSME 원본 점수" })
        : selectedYear < 1986
          ? Object.freeze({ base: 30, correct: 4, wrong: -1, blank: 0, max: 150, label: "AHSME 원본 점수" })
          : Object.freeze({ correct: 5, wrong: 0, blank: 2, max: 150, label: "AHSME 원본 점수" });
      return Object.freeze({ title: selectedYear < 2000 ? "AHSME" : "AMC 12", itemCount: itemCount, durationMinutes: durationMinutes, scoring: scoring, rawOnly: selectedYear < 1974, formatNote: selectedYear < 1974 ? "초기 회차는 문항별 배점이 달라 정답 개수만 집계합니다." : "해당 연도 AHSME 배점 기준으로 계산합니다." });
    }
    if (programId === "amc12" || programId === "amc10") {
      const scoring = selectedYear < 2002
        ? Object.freeze({ correct: 6, wrong: 0, blank: 2, max: 150, label: `${archive.title} 원본 점수` })
        : selectedYear < 2007
          ? Object.freeze({ correct: 6, wrong: 0, blank: 2.5, max: 150, label: `${archive.title} 원본 점수` })
          : Object.freeze({ correct: 6, wrong: 0, blank: 1.5, max: 150, label: `${archive.title} 원본 점수` });
      const selectedForm = String(form || "").toUpperCase();
      const scoreAdjustment = programId === "amc12" && selectedYear === 2025 && selectedForm === "A"
        ? Object.freeze({ pointsByQuestion: Object.freeze({ 25: 6 }), note: "2025 AMC 12A 25번은 무효 문항입니다. 공식 점수에는 답과 관계없이 6점을 반영합니다. 풀이 기록은 학습용으로 따로 확인하세요.", sourceUrl: "https://live.poshenloh.com/past-contests/amc12/2025A/problem/25" })
        : null;
      return Object.freeze({ title: archive.title, itemCount: 25, durationMinutes: 75, scoring: scoring, scoreAdjustment: scoreAdjustment, rawOnly: false, sourceStatus: "maa-authorized-live-archive", formatNote: scoreAdjustment ? scoreAdjustment.note : "해당 연도 공식 배점으로 계산합니다." });
    }
    if (programId === "amc8") {
      const title = selectedYear < 1999 ? "AJHSME" : archive.title;
      return Object.freeze({ title: title, itemCount: 25, durationMinutes: 40, scoring: Object.freeze({ correct: 1, wrong: 0, blank: 0, max: 25, label: `${title} 정답 수` }), rawOnly: false, formatNote: "정답 수로 표시합니다." });
    }
    if (programId === "aime") return Object.freeze({ title: archive.title, itemCount: 15, durationMinutes: 180, scoring: Object.freeze({ correct: 1, wrong: 0, blank: 0, max: 15, label: "AIME 원본 정답 수" }), rawOnly: false, formatNote: "정답 수로 표시합니다." });
    return null;
  }

  function archiveRoute(programId, year, form) {
    const archive = archiveFor(programId);
    const selectedYear = Number(year);
    if (!archive || !archive.years.includes(selectedYear)) return archive ? archive.archiveUrl : "";
    const formId = String(form || "").toUpperCase();
    if (!formsFor(programId, year).includes(formId)) return "";
    const suffix = formId;
    return `https://live.poshenloh.com/past-contests/${archive.path}/${Number(year)}${suffix}`;
  }

  function formLabel(programId, year, form) {
    const selectedYear = Number(year);
    const selectedForm = String(form || "").toUpperCase();
    if (!selectedForm) return "단일 시험지";
    if (selectedYear === 2021 && (programId === "amc10" || programId === "amc12")) {
      const originalForm = selectedForm === "C" ? "A" : selectedForm === "D" ? "B" : selectedForm;
      const session = selectedForm === "C" || selectedForm === "D" ? "가을" : "봄";
      return `${originalForm}형 · ${session} (자료 코드 ${selectedForm})`;
    }
    return `${selectedForm}형`;
  }

  function printRoute(programId, year, form) {
    const route = archiveRoute(programId, year, form);
    if (!route || route === "https://live.poshenloh.com/past-contests") return "";
    const archive = archiveFor(programId);
    const contestId = route.slice(route.lastIndexOf("/") + 1);
    return `https://live.poshenloh.com/images/past-contests/pdf/${archive.path}-${contestId}-exam.pdf`;
  }

  function answerRoute(programId, year, form) {
    const route = archiveRoute(programId, year, form);
    return route && route !== "https://live.poshenloh.com/past-contests" ? `${route}/answers` : "";
  }

  function solutionsRoute(programId, year, form) {
    const route = archiveRoute(programId, year, form);
    return route && route !== "https://live.poshenloh.com/past-contests" ? `${route}/solutions` : "";
  }

  function problemRoute(programId, year, form, questionNumber) {
    const selectedYear = Number(year);
    const format = formatFor(programId, year);
    const number = Number(questionNumber);
    if (!format || !Number.isInteger(number) || number < 1 || number > format.itemCount) return "";
    const selectedForm = String(form || "").toUpperCase();
    if (!formsFor(programId, year).includes(selectedForm)) return "";
    const route = archiveRoute(programId, year, form);
    return route && route !== "https://live.poshenloh.com/past-contests" ? `${route}/problem/${number}` : "";
  }

  return Object.freeze({ schemaVersion: "2.5.0", archives: archives, archiveFor: archiveFor, studyYearsFor: studyYearsFor, formsFor: formsFor, contestCount: contestCount, formLabel: formLabel, archiveRoute: archiveRoute, printRoute: printRoute, answerRoute: answerRoute, solutionsRoute: solutionsRoute, problemRoute: problemRoute, formatFor: formatFor });
});
