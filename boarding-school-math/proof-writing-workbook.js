(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const editionSelect = document.getElementById("edition-select");
  const editionNote = document.getElementById("edition-note");
  const teacher = params.get("edition") === "teacher";

  function formatMath(source) {
    return source
      .replace(/\\sqrt\s*\{?([^{}\s]+)\}?/g, "√$1")
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
      .replace(/\\left|\\right/g, "")
      .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
      .replace(/\\([a-zA-Z]+)/g, "")
      .replace(/([a-zA-Z0-9])\^2/g, "$1²");
  }

  document.querySelectorAll(".proof-workbook .claim, .proof-workbook .proof-item > p:not(.write-prompt), .proof-workbook .teacher-solution p").forEach(function (element) {
    if (!window.GFIELDMathText) return;
    const source = formatMath(element.textContent || "");
    element.replaceChildren();
    window.GFIELDMathText.append(element, source);
  });

  function setEdition(value, updateUrl) {
    const showTeacher = value === "teacher";
    document.body.classList.toggle("is-teacher-edition", showTeacher);
    document.querySelectorAll(".teacher-solution").forEach(function (solution) { solution.hidden = !showTeacher; });
    document.querySelectorAll(".proof-item textarea").forEach(function (answer) { answer.hidden = showTeacher; });
    editionNote.textContent = showTeacher ? "교사용: 풀이 예시는 가능한 설명의 한 가지 방식입니다." : "학생용: 풀이 과정을 직접 적어 보세요.";
    editionSelect.value = showTeacher ? "teacher" : "student";
    if (updateUrl) {
      const next = new URL(window.location.href);
      if (showTeacher) next.searchParams.set("edition", "teacher");
      else next.searchParams.delete("edition");
      window.history.replaceState({}, "", next);
    }
  }

  editionSelect.addEventListener("change", function () { setEdition(editionSelect.value, true); });
  document.getElementById("print-button").addEventListener("click", function () { window.print(); });
  setEdition(teacher ? "teacher" : "student", false);
})();
