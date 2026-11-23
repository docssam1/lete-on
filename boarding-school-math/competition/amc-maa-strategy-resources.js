(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCMAAStrategyResources = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const community = "?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments";
  const amc8Resources = Object.freeze([
    { id: "work-backwards", title: "거꾸로 풀기 · Work Backwards", url: "https://connect.maa.org/viewdocument/work-backwards" + community },
    { id: "casework", title: "경우 나누기 · Casework", url: "https://connect.maa.org/viewdocument/casework" + community },
    { id: "find-a-pattern", title: "패턴 찾기 · Find a Pattern", url: "https://connect.maa.org/viewdocument/find-a-pattern" + community },
    { id: "guess-and-check", title: "추측하고 확인하기 · Guess and Check", url: "https://connect.maa.org/viewdocument/guess-and-check" + community },
    { id: "make-an-ordered-list", title: "순서대로 목록 만들기 · Make an Ordered List", url: "https://connect.maa.org/viewdocument/make-an-ordered-list" + community },
    { id: "solve-a-simpler-problem", title: "더 간단한 문제 풀기 · Solve a Simpler Problem", url: "https://connect.maa.org/viewdocument/solve-a-simpler-problem" + community },
    { id: "use-symmetry", title: "대칭 활용하기 · Use Symmetry", url: "https://connect.maa.org/viewdocument/use-symmetry" + community },
    { id: "write-an-equation", title: "방정식 세우기 · Write an Equation", url: "https://connect.maa.org/viewdocument/write-an-equation-problem-set" + community }
  ].map(function (resource) { return Object.freeze(resource); }));

  const topicResources = Object.freeze({
    amc10: Object.freeze([
      { domain: "algebra", id: "algebra", title: "대수 · Algebra", slug: "amc-10-algebra" },
      { domain: "geometry", id: "geometry", title: "기하 · Geometry", slug: "amc-10-geometry" },
      { domain: "counting", id: "probability", title: "확률·경우의 수 · Probability", slug: "amc-10-probability" },
      { domain: "functions", id: "functions", title: "함수 · Functions", slug: "amc-10-functions" },
      { domain: "number", id: "number-sense", title: "수 감각·정수론 · Number Sense & Theory", slug: "amc-10-number-sense-number-theory" }
    ]),
    amc12: Object.freeze([
      { domain: "algebra", id: "algebra", title: "대수 · Algebra", slug: "amc-12-algebra" },
      { domain: "geometry", id: "geometry", title: "기하 · Geometry", slug: "amc-12-geometry" },
      { domain: "counting", id: "probability", title: "확률·경우의 수 · Probability", slug: "amc-12-probability" },
      { domain: "functions", id: "functions", title: "함수 · Functions", slug: "amc-12-functions" },
      { domain: "number", id: "number-sense", title: "수 감각·정수론 · Number Sense & Theory", slug: "amc-12-number-sense-number-theory" }
    ])
  });

  function officialUrl(slug) {
    return "https://connect.maa.org/viewdocument/" + slug + community;
  }

  function forContest(contestId, reviewItems) {
    const items = Array.isArray(reviewItems) ? reviewItems : [];
    if (contestId === "amc8" && items.some(function (item) { return item.status === "wrong" && item.reason === "approach"; })) {
      return Object.freeze({
        title: "MAA 풀이 전략별 문제 세트 8종",
        description: "‘접근 아이디어’를 오답 이유로 표시한 결과예요. MAA 전략별 문제 세트와 해설을 열어볼 수 있어요. 특정 AMC 문항에 어떤 전략이 맞는지는 원문 풀이를 보고 직접 판단하세요.",
        resources: amc8Resources,
        indexTitle: "MAA AMC 8 자료 모음 ↗"
      });
    }
    if ((contestId === "amc10" || contestId === "amc12") && items.some(function (item) {
      return item.status === "wrong" && ["concept", "approach"].includes(item.reason);
    })) {
      const usedDomains = new Set(items.filter(function (item) {
        return item.status === "wrong" && ["concept", "approach"].includes(item.reason);
      }).map(function (item) { return item.domain; }));
      const relevantResources = topicResources[contestId].filter(function (resource) { return usedDomains.has(resource.domain); }).map(function (resource) {
        return Object.freeze({ id: resource.id, title: resource.title, url: officialUrl(resource.slug) });
      });
      if (relevantResources.length) {
        return Object.freeze({
          title: "MAA " + (contestId === "amc10" ? "AMC 10" : "AMC 12") + " 영역별 문제 세트",
          description: "개념·접근 아이디어 오답으로 표시한 영역의 MAA 문제 세트를 골랐어요. 단원별 문제·풀이·확장 문제를 열 수 있습니다. 원본 시험 문항의 정답 풀이를 자동 분류한 자료는 아니에요.",
          resources: Object.freeze(relevantResources),
          indexTitle: "MAA AMC 문제 세트 모음 ↗"
        });
      }
    }
    return null;
  }

  return Object.freeze({ forContest: forContest });
});
