(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCMAAStrategyResources = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const community = "?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments";
  const resources = Object.freeze([
    { id: "work-backwards", title: "거꾸로 풀기 · Work Backwards", url: "https://connect.maa.org/viewdocument/work-backwards" + community },
    { id: "casework", title: "경우 나누기 · Casework", url: "https://connect.maa.org/viewdocument/casework" + community },
    { id: "find-a-pattern", title: "패턴 찾기 · Find a Pattern", url: "https://connect.maa.org/viewdocument/find-a-pattern" + community },
    { id: "guess-and-check", title: "추측하고 확인하기 · Guess and Check", url: "https://connect.maa.org/viewdocument/guess-and-check" + community },
    { id: "make-an-ordered-list", title: "순서대로 목록 만들기 · Make an Ordered List", url: "https://connect.maa.org/viewdocument/make-an-ordered-list" + community },
    { id: "solve-a-simpler-problem", title: "더 간단한 문제 풀기 · Solve a Simpler Problem", url: "https://connect.maa.org/viewdocument/solve-a-simpler-problem" + community },
    { id: "use-symmetry", title: "대칭 활용하기 · Use Symmetry", url: "https://connect.maa.org/viewdocument/use-symmetry" + community },
    { id: "write-an-equation", title: "방정식 세우기 · Write an Equation", url: "https://connect.maa.org/viewdocument/write-an-equation-problem-set" + community }
  ].map(function (resource) { return Object.freeze(resource); }));

  function forContest(contestId) {
    return contestId === "amc8" ? resources : Object.freeze([]);
  }

  return Object.freeze({ forContest: forContest });
});
