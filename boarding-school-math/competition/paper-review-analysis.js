/* Manual post-paper observation. No answer key or storage; raw-score output is a cautious reference estimate, not an official score. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperReviewAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // Reference formulas match MAA's 2026-27 AMC policies (updated 2026-10-30); verify the selected paper's instructions, especially outside U.S./Canada.
  const statusIds = Object.freeze(["unmarked", "correct", "wrong", "blank"]);
  const domainIds = Object.freeze(["unclassified", "algebra", "number", "geometry", "counting", "data"]);
  const wrongReasonIds = Object.freeze(["none", "concept", "approach", "calculation", "reading", "time"]);
  const blankReasonIds = Object.freeze(["none", "time", "skipped", "could-not-start"]);
  const reasonIds = Object.freeze(Array.from(new Set(wrongReasonIds.concat(blankReasonIds))));
  const domainNames = Object.freeze({ algebra: "식·대수", number: "수와 정수론", geometry: "기하·공간", counting: "경우의 수·확률" });
  const amc8DomainNames = Object.freeze({ algebra: "식·대수", number: "수·비례·추정", geometry: "기하·공간", counting: "경우의 수·확률", data: "그래프·표 해석" });
  const domainsFor = function (program) {
    const names = program === "amc8" ? amc8DomainNames : domainNames;
    return Object.freeze(Object.keys(names).map(function (id) { return Object.freeze({ id: id, title: names[id] }); }));
  };
  const reasonNames = Object.freeze({ concept: "개념", approach: "접근 아이디어", calculation: "계산", reading: "조건 읽기", time: "시간" });
  const blankReasonNames = Object.freeze({ time: "시간 부족", skipped: "건너뜀", "could-not-start": "시작 방법을 찾지 못함" });

  function analyze(entries, itemCount, program) {
    if (!Number.isInteger(itemCount) || itemCount < 1 || itemCount > 30 || !Array.isArray(entries) || entries.length !== itemCount) {
      return { valid: false, error: "선택한 문제지의 문항 수를 확인하세요." };
    }
    const counts = { correct: 0, wrong: 0, blank: 0, unmarked: 0 };
    const selectedDomainNames = program === "amc8" ? amc8DomainNames : domainNames;
    const domains = Object.keys(selectedDomainNames).map(function (id) { return { id: id, name: selectedDomainNames[id], attempted: 0, correct: 0, wrong: 0, blank: 0, rate: null, evidence: "미측정" }; });
    const byDomain = new Map(domains.map(function (domain) { return [domain.id, domain]; }));
    const wrongItemNumbersByDomain = new Map(domains.map(function (domain) { return [domain.id, []]; }));
    const blankItemNumbersByDomain = new Map(domains.map(function (domain) { return [domain.id, []]; }));
    const reviewItems = [];
    const reasons = Object.keys(reasonNames).map(function (id) { return { id: id, name: reasonNames[id], count: 0 }; });
    const byReason = new Map(reasons.map(function (reason) { return [reason.id, reason]; }));
    let unclassified = 0;
    let domainClassified = 0;
    let reasonClassified = 0;
    let blankReasonClassified = 0;
    const blankReasons = Object.keys(blankReasonNames).map(function (id) { return { id: id, name: blankReasonNames[id], count: 0 }; });
    const byBlankReason = new Map(blankReasons.map(function (reason) { return [reason.id, reason]; }));
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (!entry || !statusIds.includes(entry.status) || !(entry.domain === "unclassified" || Object.prototype.hasOwnProperty.call(selectedDomainNames, entry.domain)) || !reasonIds.includes(entry.reason)
        || (entry.status === "wrong" && !wrongReasonIds.includes(entry.reason))
        || (entry.status === "blank" && !blankReasonIds.includes(entry.reason))
        || ((entry.status === "correct" || entry.status === "unmarked") && entry.reason !== "none")) {
        return { valid: false, error: "문항별 표시와 영역을 확인하세요." };
      }
      counts[entry.status] += 1;
      if (entry.status === "unmarked") continue;
      if (entry.status === "wrong" || entry.status === "blank") {
        reviewItems.push(Object.freeze({ number: index + 1, status: entry.status, domain: entry.domain, reason: entry.reason }));
      }
      if (entry.domain === "unclassified") { unclassified += 1; }
      else {
        domainClassified += 1;
        const domain = byDomain.get(entry.domain);
        if (entry.status === "blank") {
          domain.blank += 1;
          blankItemNumbersByDomain.get(entry.domain).push(index + 1);
        }
        else {
          domain.attempted += 1;
          domain[entry.status] += 1;
          if (entry.status === "wrong") wrongItemNumbersByDomain.get(entry.domain).push(index + 1);
        }
      }
      if (entry.status === "wrong" && entry.reason !== "none") {
        reasonClassified += 1;
        byReason.get(entry.reason).count += 1;
      }
      if (entry.status === "blank" && entry.reason !== "none") {
        blankReasonClassified += 1;
        byBlankReason.get(entry.reason).count += 1;
      }
    }
    if (counts.unmarked === itemCount) return { valid: false, error: "표시한 문제가 없습니다. 채점한 문제부터 표시하세요." };
    const attempted = counts.correct + counts.wrong;
    domains.forEach(function (domain) {
      domain.rate = domain.attempted >= 3 ? Math.round(domain.correct / domain.attempted * 100) : null;
      domain.evidence = domain.attempted >= 3 ? "3문제 이상" : domain.attempted ? "3문제 미만 · 비교 보류" : "미측정";
    });
    const comparable = domains.filter(function (domain) { return domain.attempted >= 3; }).sort(function (a, b) { return a.rate - b.rate; });
    const lowestRate = comparable.length ? comparable[0].rate : null;
    const highestRate = comparable.length ? comparable[comparable.length - 1].rate : null;
    const lowestDomains = comparable.length >= 2 && lowestRate < highestRate
      ? comparable.filter(function (domain) { return domain.rate === lowestRate; }).map(function (domain) {
        return Object.freeze({ id: domain.id, name: domain.name, correct: domain.correct, attempted: domain.attempted, blank: domain.blank });
      })
      : [];
    let scoreEstimate = null;
    if (counts.unmarked === 0 && itemCount === 25 && program === "amc8") {
      scoreEstimate = Object.freeze({ points: counts.correct, max: itemCount, label: "AMC 8 참고 원점수" });
    } else if (counts.unmarked === 0 && itemCount === 25 && (program === "amc10" || program === "amc12")) {
      scoreEstimate = Object.freeze({ points: counts.correct * 6 + counts.blank * 1.5, max: itemCount * 6, label: `${program === "amc10" ? "AMC 10" : "AMC 12"} 참고 원점수` });
    }
    return {
      valid: true,
      itemCount: itemCount,
      counts: counts,
      attempted: attempted,
      accuracy: attempted >= 3 ? Math.round(counts.correct / attempted * 100) : null,
      complete: counts.unmarked === 0,
      unclassified: unclassified,
      domainClassified: domainClassified,
      reasonClassified: reasonClassified,
      blankReasonClassified: blankReasonClassified,
      domains: domains,
      reasons: reasons.filter(function (reason) { return reason.count > 0; }),
      blankReasons: blankReasons.filter(function (reason) { return reason.count > 0; }),
      lowestDomains: lowestDomains,
      reviewItems: reviewItems,
      domainReviewItemNumbers: Object.freeze(Object.fromEntries(domains.map(function (domain) {
        return [domain.id, Object.freeze({ wrong: wrongItemNumbersByDomain.get(domain.id).slice(), blank: blankItemNumbersByDomain.get(domain.id).slice() })];
      }))),
      scoreEstimate: scoreEstimate,
      officialScore: null,
      level: null
    };
  }
  return Object.freeze({ analyze: analyze, domainsFor: domainsFor, statusIds: statusIds, domainIds: domainIds, reasonIds: reasonIds, wrongReasonIds: wrongReasonIds, blankReasonIds: blankReasonIds });
});
