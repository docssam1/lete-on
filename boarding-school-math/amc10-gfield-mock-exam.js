(function () {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  const gradeValue = Number(params.get("grade"));
  const grade = Number.isInteger(gradeValue) && gradeValue >= 7 && gradeValue <= 10 ? gradeValue : 7;
  const year = /^\d{4}$/.test(params.get("sourceYear") || "") ? params.get("sourceYear") : "";
  const form = /^[ABCD]$/.test(params.get("sourceForm") || "") ? params.get("sourceForm") : "";
  const note = document.getElementById("amc10-source-paper-note");
  document.querySelectorAll(".mock-brand, footer a").forEach(link => { link.href = `./boarding-roadmap.html?grade=${grade}#competition-diagnostic`; });
  if (year) {
    const label = `${year} AMC 10${form ? ` ${form}` : ""}`;
    note.hidden = false;
    note.textContent = `앞서 복습한 ${label} 원본과 별도로 풀어보는 지필드 자체 모의고사입니다.`;
    const back = document.getElementById("amc10-mock-back");
    const url = new URL("./competition-paper-review.html", window.location.href);
    url.searchParams.set("grade", String(grade)); url.searchParams.set("program", "amc10"); url.searchParams.set("year", year);
    if (form) url.searchParams.set("form", form);
    back.href = url.href; back.textContent = `${label} 원본 복습으로`;
  }
})();
