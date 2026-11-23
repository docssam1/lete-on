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
  const answerChoiceIds = Object.freeze(["", "A", "B", "C", "D", "E"]);
  const reasonIds = Object.freeze(Array.from(new Set(wrongReasonIds.concat(blankReasonIds))));
  const domainNames = Object.freeze({ algebra: "식과 대수 관계", number: "수와 정수의 성질", geometry: "기하 도형과 측정", counting: "경우의 수와 확률", data: "자료와 통계", functions: "함수와 그래프" });
  const domainsFor = function (program) {
    return Object.freeze(Object.keys(domainNames).map(function (id) { return Object.freeze({ id: id, title: domainNames[id] }); }));
  };
  const reasonNames = Object.freeze({ concept: "개념", approach: "접근 아이디어", calculation: "계산", reading: "조건 읽기", time: "시간" });
  const blankReasonNames = Object.freeze({ time: "시간 부족", skipped: "건너뜀", "could-not-start": "시작 방법을 찾지 못함" });

  function analyze(entries, itemCount, program, paperFormat) {
    if (!Number.isInteger(itemCount) || itemCount < 1 || itemCount > 50 || !Array.isArray(entries) || entries.length !== itemCount) {
      return { valid: false, error: "선택한 문제지의 문항 수를 확인하세요." };
    }
    const counts = { correct: 0, wrong: 0, blank: 0, unmarked: 0 };
    const selectedDomainNames = domainNames;
    const domains = Object.keys(selectedDomainNames).map(function (id) { return { id: id, name: selectedDomainNames[id], attempted: 0, correct: 0, wrong: 0, blank: 0, rate: null, evidence: "미측정" }; });
    const byDomain = new Map(domains.map(function (domain) { return [domain.id, domain]; }));
    const wrongItemNumbersByDomain = new Map(domains.map(function (domain) { return [domain.id, []]; }));
    const blankItemNumbersByDomain = new Map(domains.map(function (domain) { return [domain.id, []]; }));
    const reviewItems = [];
    const reasons = Object.keys(reasonNames).map(function (id) { return { id: id, name: reasonNames[id], count: 0 }; });
    const byReason = new Map(reasons.map(function (reason) { return [reason.id, reason]; }));
    let unclassified = 0;
    let domainClassified = 0;
    let sourceMappedCount = 0;
    let sourceConceptReferenceCount = 0;
    let manualDomainCount = 0;
    let reasonClassified = 0;
    let blankReasonClassified = 0;
    const blankReasons = Object.keys(blankReasonNames).map(function (id) { return { id: id, name: blankReasonNames[id], count: 0 }; });
    const byBlankReason = new Map(blankReasons.map(function (reason) { return [reason.id, reason]; }));
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const validAnswer = entry && (entry.answer == null || answerChoiceIds.includes(entry.answer) || (program === "aime" && /^(?:[0-9]|[1-9][0-9]{1,2})$/.test(entry.answer)));
      if (!entry || !statusIds.includes(entry.status) || !validAnswer || !(entry.domain === "unclassified" || Object.prototype.hasOwnProperty.call(selectedDomainNames, entry.domain)) || !reasonIds.includes(entry.reason)
        || (entry.status === "wrong" && !wrongReasonIds.includes(entry.reason))
        || (entry.status === "blank" && !blankReasonIds.includes(entry.reason))
        || ((entry.status === "correct" || entry.status === "unmarked") && entry.reason !== "none")) {
        return { valid: false, error: "문항별 표시와 영역을 확인하세요." };
      }
      counts[entry.status] += 1;
      if (entry.sourceConceptLabel) sourceConceptReferenceCount += 1;
      if (entry.status === "unmarked") continue;
      if (entry.status === "wrong" || entry.status === "blank") {
        const reviewItem = { number: index + 1, status: entry.status, answer: entry.answer || "", domain: entry.domain, reason: entry.reason };
        if (entry.sourceConceptLabel) Object.assign(reviewItem, { suggestedDomain: entry.suggestedDomain || "unclassified", sourceConceptLabel: entry.sourceConceptLabel, domainOrigin: entry.domainOrigin || "manual" });
        reviewItems.push(Object.freeze(reviewItem));
      }
      if (entry.domain === "unclassified") { unclassified += 1; }
      else {
        domainClassified += 1;
        if (entry.domainOrigin === "source-mapped" && entry.domain === entry.suggestedDomain && entry.sourceConceptLabel) sourceMappedCount += 1;
        else manualDomainCount += 1;
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
    const questionBands = itemCount === 25 && ["amc8", "amc10", "amc12"].includes(program)
      ? [[1, 10], [11, 15], [16, 20], [21, 25]].map(function (range) {
        const bandCounts = { correct: 0, wrong: 0, blank: 0, unmarked: 0 };
        entries.slice(range[0] - 1, range[1]).forEach(function (entry) { bandCounts[entry.status] += 1; });
        return Object.freeze({ start: range[0], end: range[1], ...bandCounts, total: range[1] - range[0] + 1 });
      })
      : [];
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
      scoreEstimate = Object.freeze({ points: counts.correct, max: itemCount, label: "AMC 8 정답 수" });
    } else if (counts.unmarked === 0 && paperFormat && paperFormat.rawOnly) {
      scoreEstimate = null;
    } else if (counts.unmarked === 0 && (program === "amc10" || program === "amc12") && paperFormat && paperFormat.scoring) {
      const scoring = paperFormat.scoring;
      let points = (scoring.base || 0) + counts.correct * scoring.correct + counts.wrong * (scoring.wrong || 0) + counts.blank * scoring.blank;
      const scoreAdjustment = paperFormat.scoreAdjustment;
      if (scoreAdjustment && scoreAdjustment.pointsByQuestion) {
        Object.keys(scoreAdjustment.pointsByQuestion).forEach(function (question) {
          const entry = entries[Number(question) - 1];
          if (!entry) return;
          const ordinaryPoints = entry.status === "correct" ? scoring.correct : entry.status === "blank" ? scoring.blank : scoring.wrong || 0;
          points += scoreAdjustment.pointsByQuestion[question] - ordinaryPoints;
        });
      }
      scoreEstimate = Object.freeze({ points: points, max: scoring.max, label: scoring.label, adjustmentNote: scoreAdjustment ? scoreAdjustment.note : "", adjustmentSourceUrl: scoreAdjustment ? scoreAdjustment.sourceUrl : "" });
    } else if (counts.unmarked === 0 && itemCount === 25 && (program === "amc10" || program === "amc12")) {
      scoreEstimate = Object.freeze({ points: counts.correct * 6 + counts.blank * 1.5, max: itemCount * 6, label: `${program === "amc10" ? "AMC 10" : "AMC 12"} 참고 원점수` });
    } else if (counts.unmarked === 0 && itemCount === 15 && program === "aime") {
      scoreEstimate = Object.freeze({ points: counts.correct, max: itemCount, label: "AIME 원본 정답 수" });
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
      sourceMappedCount: sourceMappedCount,
      sourceConceptReferenceCount: sourceConceptReferenceCount,
      manualDomainCount: manualDomainCount,
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
      questionBands: Object.freeze(questionBands),
      officialScore: null,
      level: counts.unmarked === 0 && scoreEstimate
        ? Object.freeze({ kind: "original-paper-performance", score: scoreEstimate.points, max: scoreEstimate.max, bands: Object.freeze(questionBands) })
        : null
    };
  }
  return Object.freeze({ analyze: analyze, domainsFor: domainsFor, statusIds: statusIds, domainIds: domainIds, reasonIds: reasonIds, wrongReasonIds: wrongReasonIds, blankReasonIds: blankReasonIds });
});
