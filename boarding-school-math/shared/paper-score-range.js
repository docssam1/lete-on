(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperScoreRange = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Cutoff intervals are score intervals, never an interpolated personal percentile.
  function intervalsFor(maximum, reference, bands) {
    if (!Number.isFinite(maximum) || maximum <= 0 || !reference || !Array.isArray(bands)) return [];
    const available = bands.filter(function (band) {
      return Number.isFinite(reference[band.id]) && reference[band.id] >= 0 && reference[band.id] <= maximum;
    });
    // Reject contradictory boundaries rather than silently sorting a broken source.
    if (available.some(function (band, index) { return index && reference[band.id] > reference[available[index - 1].id]; })) return [];
    const groups = [];
    available.forEach(function (band) {
      const previous = groups[groups.length - 1];
      if (previous && previous.lower === reference[band.id]) previous.labels.push(band.label);
      else groups.push({ lower: reference[band.id], labels: [band.label], id: band.id });
    });
    if (!groups.length) return [];
    const result = groups.map(function (group, index) {
      return Object.freeze({ id: group.id, labels: Object.freeze(group.labels), lower: group.lower,
        upper: index ? groups[index - 1].lower : maximum, upperInclusive: index === 0 });
    });
    const lowest = groups[groups.length - 1];
    if (lowest.lower > 0) result.push(Object.freeze({ id: "below", labels: Object.freeze([]), lower: 0, upper: lowest.lower, upperInclusive: false }));
    return Object.freeze(result);
  }
  function intervalFor(score, maximum, reference, bands) {
    if (!Number.isFinite(score) || score < 0 || score > maximum) return null;
    return intervalsFor(maximum, reference, bands).find(function (range) {
      return score >= range.lower && (range.upperInclusive ? score <= range.upper : score < range.upper);
    }) || null;
  }
  function validDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + "T00:00:00Z")) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
  }
  function scoringKey(format) {
    const scoring = format && format.scoring;
    return scoring ? [scoring.base || 0, scoring.correct, scoring.wrong, scoring.blank, scoring.max, format.itemCount].join(":") : null;
  }
  function identityFromDiagnostic(record, library) {
    if (!record || !library) return null;
    let paper = record.paper;
    if (!paper) {
      // Legacy labels are free text. Recover only exact, identifiable paper labels.
      const match = /^(\d{4}) (AMC 8|AMC 10|AMC 12|AIME)(?: ([ABCD]|I|II))?$/.exec(record.paperLabel || "");
      const titles = { amc8: "AMC 8", amc10: "AMC 10", amc12: "AMC 12", aime: "AIME" };
      if (!match || match[2] !== titles[record.programId]) return null;
      paper = { year: Number(match[1]), form: match[3] || "" };
    }
    if (!Number.isInteger(paper.year) || typeof paper.form !== "string" || !library.formsFor(record.programId, paper.year).includes(paper.form)) return null;
    return { year: paper.year, form: paper.form };
  }
  function attemptFromDiagnostic(record, library) {
    if (!record || !record.summary || record.summary.unmarked !== 0 || !library) return null;
    const identity = identityFromDiagnostic(record, library);
    if (!identity) return null;
    const paper = record.paper || identity;
    const format = library.formatFor(record.programId, paper.year, paper.form);
    if (!format || !format.scoring || format.itemCount !== record.summary.itemCount || !library.formsFor(record.programId, paper.year).includes(paper.form)) return null;
    const scoring = format.scoring;
    const ordinary = (scoring.base || 0) + record.summary.correct * scoring.correct + record.summary.wrong * (scoring.wrong || 0) + record.summary.blank * scoring.blank;
    if (!record.paper && format.scoreAdjustment) return null; // Lost item-level status cannot reconstruct a void-item adjustment.
    const points = record.paper ? paper.points : ordinary;
    const max = record.paper ? paper.max : scoring.max;
    if (max !== scoring.max || !Number.isFinite(points) || points < 0 || points > max) return null;
    let possible = [ordinary];
    if (format.scoreAdjustment) {
      const adjustments = Object.values(format.scoreAdjustment.pointsByQuestion || {});
      if (adjustments.length !== 1) return null;
      possible = ["correct", "wrong", "blank"].filter(function (status) { return record.summary[status] > 0; }).map(function (status) {
        return ordinary + adjustments[0] - (scoring[status] || 0);
      });
    }
    if (!possible.includes(points)) return null;
    return { programId: record.programId, grade: record.grade, year: paper.year, form: paper.form, points: points, max: max,
      scoringKey: scoringKey(format), examDate: record.examDate, savedAt: record.savedAt, complete: true };
  }
  function forecast(records, context) {
    const date = context && context.asOf;
    if (!context || !validDate(date) || !Array.isArray(records) || !["amc8", "amc10", "amc12", "aime"].includes(context.programId)
      || !Number.isInteger(context.grade) || typeof context.scoringKey !== "string" || !context.scoringKey
      || !Number.isFinite(context.max) || context.max <= 0) return { ready: false, count: 0, entries: [] };
    const end = Date.parse(date + "T00:00:00Z");
    const start = end - 180 * 86400000;
    const firstByPaper = new Map();
    records.filter(function (entry) {
      return entry && entry.programId === context.programId && entry.grade === context.grade && entry.scoringKey === context.scoringKey
        && entry.max === context.max && Number.isFinite(entry.points) && entry.points >= 0 && entry.points <= entry.max
        && Number.isInteger(entry.points * (entry.programId === "amc8" || entry.programId === "aime" ? 1 : 2))
        && Number.isInteger(entry.year) && entry.year >= 1950 && entry.year <= Number(date.slice(0, 4))
        && typeof entry.form === "string" && validDate(entry.examDate) && entry.examDate <= date && entry.complete === true;
    }).sort(function (a, b) { return a.examDate.localeCompare(b.examDate) || (a.savedAt || "").localeCompare(b.savedAt || ""); }).forEach(function (entry) {
      const key = [entry.year, entry.form].join(":");
      // Keep the earliest dated attempt, so repeated practice cannot inflate the range.
      if (!firstByPaper.has(key)) firstByPaper.set(key, entry);
    });
    const entries = Array.from(firstByPaper.values()).filter(function (entry) {
      return Date.parse(entry.examDate + "T00:00:00Z") >= start;
    }).sort(function (a, b) { return b.examDate.localeCompare(a.examDate) || b.year - a.year || a.form.localeCompare(b.form); }).slice(0, 8);
    const result = { ready: entries.length >= 3, count: entries.length, entries: entries, max: context.max, method: "recent-distinct-paper-min-max-v1", windowDays: 180 };
    if (!result.ready) return result;
    const values = entries.map(function (entry) { return entry.points; }).sort(function (a, b) { return a - b; });
    return Object.assign(result, { lower: values[0], upper: values[values.length - 1],
      median: values.length % 2 ? values[(values.length - 1) / 2] : (values[values.length / 2 - 1] + values[values.length / 2]) / 2 });
  }
  return Object.freeze({ intervalsFor: intervalsFor, intervalFor: intervalFor, scoringKey: scoringKey, identityFromDiagnostic: identityFromDiagnostic, attemptFromDiagnostic: attemptFromDiagnostic, forecast: forecast });
});
