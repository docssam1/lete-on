/* Manual post-paper observation. This module has no answer key, official scoring, or storage. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperReviewAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const statusIds = Object.freeze(["unmarked", "correct", "wrong", "blank"]);
  const domainIds = Object.freeze(["unclassified", "algebra", "number", "geometry", "counting"]);
  const reasonIds = Object.freeze(["none", "concept", "approach", "calculation", "reading", "time"]);
  const domainNames = Object.freeze({ algebra: "식·대수", number: "수와 정수론", geometry: "기하·공간", counting: "경우의 수·확률" });
  const reasonNames = Object.freeze({ concept: "개념", approach: "접근 아이디어", calculation: "계산", reading: "조건 읽기", time: "시간" });

  function analyze(entries, itemCount) {
    if (!Number.isInteger(itemCount) || itemCount < 1 || itemCount > 30 || !Array.isArray(entries) || entries.length !== itemCount) {
      return { valid: false, error: "선택한 문제지의 문항 수를 확인하세요." };
    }
    const counts = { correct: 0, wrong: 0, blank: 0, unmarked: 0 };
    const domains = Object.keys(domainNames).map(function (id) { return { id: id, name: domainNames[id], attempted: 0, correct: 0, wrong: 0, blank: 0, rate: null, evidence: "미측정" }; });
    const byDomain = new Map(domains.map(function (domain) { return [domain.id, domain]; }));
    const reasons = Object.keys(reasonNames).map(function (id) { return { id: id, name: reasonNames[id], count: 0 }; });
    const byReason = new Map(reasons.map(function (reason) { return [reason.id, reason]; }));
    let unclassified = 0;
    for (const entry of entries) {
      if (!entry || !statusIds.includes(entry.status) || !domainIds.includes(entry.domain) || !reasonIds.includes(entry.reason)) {
        return { valid: false, error: "문항별 표시와 영역을 확인하세요." };
      }
      counts[entry.status] += 1;
      if (entry.status === "unmarked") continue;
      if (entry.domain === "unclassified") { unclassified += 1; }
      else {
        const domain = byDomain.get(entry.domain);
        if (entry.status === "blank") domain.blank += 1;
        else { domain.attempted += 1; domain[entry.status] += 1; }
      }
      if (entry.status === "wrong" && entry.reason !== "none") byReason.get(entry.reason).count += 1;
    }
    const attempted = counts.correct + counts.wrong;
    domains.forEach(function (domain) {
      domain.rate = domain.attempted ? Math.round(domain.correct / domain.attempted * 100) : null;
      domain.evidence = domain.attempted >= 3 ? "표본 비교 가능" : domain.attempted ? "표본 부족" : "미측정";
    });
    const comparable = domains.filter(function (domain) { return domain.attempted >= 3; }).sort(function (a, b) { return a.rate - b.rate; });
    return {
      valid: true,
      itemCount: itemCount,
      counts: counts,
      attempted: attempted,
      accuracy: attempted ? Math.round(counts.correct / attempted * 100) : null,
      complete: counts.unmarked === 0,
      unclassified: unclassified,
      domains: domains,
      reasons: reasons.filter(function (reason) { return reason.count > 0; }),
      reviewFirst: comparable.length >= 2 && comparable[0].rate < comparable[comparable.length - 1].rate ? comparable[0].name : null,
      officialScore: null,
      level: null
    };
  }
  return Object.freeze({ analyze: analyze, statusIds: statusIds, domainIds: domainIds, reasonIds: reasonIds });
});
