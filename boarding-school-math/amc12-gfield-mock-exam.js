(function () {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  const requestedGrade = Number(params.get("grade"));
  const grade = Number.isInteger(requestedGrade) && requestedGrade >= 7 && requestedGrade <= 12 ? requestedGrade : 10;
  const year = /^\d{4}$/.test(params.get("sourceYear") || "") ? params.get("sourceYear") : "";
  const form = /^[ABCD]$/.test(params.get("sourceForm") || "") ? params.get("sourceForm") : "";
  const note = document.getElementById("amc12-source-paper-note");
  const back = document.getElementById("amc12-mock-back");
  document.querySelectorAll(".mock-brand, footer a").forEach(function (link) { link.href = `./boarding-roadmap.html?grade=${grade}#competition-diagnostic`; });
  if (year) {
    const label = `${year} ${Number(year) < 2000 ? "AHSME" : "AMC 12"}${form ? ` ${form}형` : ""}`;
    note.hidden = false;
    note.textContent = `앞서 확인한 ${label} 원본 다음에 푸는 지필드 자체 모의고사입니다.`;
    const url = new URL("./competition-paper-review.html", window.location.href);
    url.searchParams.set("grade", String(grade));
    url.searchParams.set("program", "amc12");
    url.searchParams.set("year", year);
    if (form) url.searchParams.set("form", form);
    back.href = url.href;
    back.textContent = `${label} 원본 복습으로`;
  }
})();
