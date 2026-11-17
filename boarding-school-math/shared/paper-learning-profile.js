(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperLearningProfile = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const domainLabels = Object.freeze({ algebra: "식과 대수 관계", number: "수와 정수의 성질", geometry: "기하 도형과 측정", counting: "경우의 수와 확률", data: "자료와 통계", functions: "함수와 그래프" });
  function conceptsFromMarks(marks, referenceFor) {
    const counts = new Map();
    marks.forEach(function (mark, index) {
      if (!["correct", "wrong", "blank"].includes(mark.status)) return;
      const reference = referenceFor(index + 1);
      if (!reference) return;
      Array.from(new Set(reference.sourceConcepts || [])).forEach(function (id) {
        if (!/^[a-z0-9-]{1,80}$/.test(id)) return;
        if (!counts.has(id)) counts.set(id, { id: id, correct: 0, wrong: 0, blank: 0 });
        counts.get(id)[mark.status] += 1;
      });
    });
    return Array.from(counts.values());
  }
  function domainsFor(domains) {
    return Object.keys(domainLabels).map(function (id) {
      const row = (domains || []).find(function (entry) { return entry.id === id; }) || {};
      const correct = row.correct || 0, wrong = row.wrong || 0, blank = row.blank || 0;
      const total = correct + wrong + blank;
      const rate = total ? Math.round(correct / total * 100) : null;
      const state = total < 3 ? "insufficient" : correct / total >= .8 ? "strength" : correct / total <= .6 ? "review" : "developing";
      return { id: id, name: domainLabels[id], correct: correct, wrong: wrong, blank: blank, total: total, rate: rate, state: state };
    });
  }
  function addDomains(records) {
    return domainsFor(Object.keys(domainLabels).map(function (id) {
      return records.reduce(function (sum, record) {
        const row = record.domains.find(function (entry) { return entry.id === id; });
        if (row) ["correct", "wrong", "blank"].forEach(function (key) { sum[key] += row[key]; });
        return sum;
      }, { id: id, correct: 0, wrong: 0, blank: 0 });
    }));
  }
  function groups(records, options) {
    const range = options.range, library = options.library;
    const grouped = new Map();
    records.forEach(function (record) {
      const attempt = range.attemptFromDiagnostic(record, library);
      if (!attempt || !/^\d{4}-\d{2}-\d{2}$/.test(attempt.examDate || "") || !Number.isFinite(Date.parse(attempt.examDate + "T00:00:00Z"))
        || new Date(attempt.examDate + "T00:00:00Z").toISOString().slice(0, 10) !== attempt.examDate || attempt.examDate > options.asOf) return;
      const key = record.grade + ":" + record.programId;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push({ record: record, attempt: attempt });
    });
    return Array.from(grouped.values()).map(function (entries) {
      entries.sort(function (a, b) { return a.attempt.examDate.localeCompare(b.attempt.examDate) || String(a.record.savedAt || "").localeCompare(String(b.record.savedAt || "")); });
      const identities = new Set();
      const unique = entries.filter(function (entry) {
        const key = entry.attempt.year + ":" + entry.attempt.form;
        if (identities.has(key)) return false;
        identities.add(key); return true;
      });
      const selected = unique.map(function (entry) { return entry.record; });
      const domains = addDomains(selected);
      const half = Math.floor(selected.length / 2);
      const earlier = half ? addDomains(selected.slice(0, half)) : [];
      const recent = half ? addDomains(selected.slice(-half)) : [];
      domains.forEach(function (row, index) {
        row.trend = half && earlier[index].total >= 3 && recent[index].total >= 3 ? { count: half, earlier: earlier[index], recent: recent[index] } : null;
      });
      const concepts = new Map();
      selected.forEach(function (record) {
        (record.concepts || []).forEach(function (row) {
          if (!concepts.has(row.id)) concepts.set(row.id, { id: row.id, correct: 0, wrong: 0, blank: 0, papers: 0, reviewPapers: 0 });
          const sum = concepts.get(row.id);
          ["correct", "wrong", "blank"].forEach(function (key) { sum[key] += row[key]; });
          sum.papers += 1;
          if (row.wrong + row.blank > 0) sum.reviewPapers += 1;
          sum.latest = row; sum.latestRecord = record;
        });
      });
      const conceptRows = Array.from(concepts.values());
      const reasons = {};
      selected.forEach(function (record) {
        (record.reasons || []).forEach(function (row) { reasons[row.id] = (reasons[row.id] || 0) + row.count; });
        (record.blankReasons || []).forEach(function (row) { const id = "blank:" + row.id; reasons[id] = (reasons[id] || 0) + row.count; });
      });
      return { grade: selected[0].grade, programId: selected[0].programId, records: selected, attempts: unique.map(function (entry) { return entry.attempt; }),
        count: selected.length, repeats: entries.length - selected.length, domains: domains, reasons: reasons,
        conceptPaperCount: selected.filter(function (record) { return Array.isArray(record.concepts) && record.concepts.length > 0; }).length,
        recurring: conceptRows.filter(function (row) { return row.reviewPapers >= 2 && row.latest.wrong + row.latest.blank > 0; }).sort(function (a, b) { return b.reviewPapers - a.reviewPapers || b.wrong + b.blank - a.wrong - a.blank || a.id.localeCompare(b.id); }),
        recovered: conceptRows.filter(function (row) { return row.reviewPapers >= 1 && row.latest.correct > 0 && row.latest.wrong + row.latest.blank === 0; }) };
    }).sort(function (a, b) { return a.grade - b.grade || a.programId.localeCompare(b.programId); });
  }
  return Object.freeze({ domainLabels: domainLabels, conceptsFromMarks: conceptsFromMarks, domainsFor: domainsFor, groups: groups });
});
