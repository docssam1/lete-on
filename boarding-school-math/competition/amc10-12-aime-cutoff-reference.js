(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCAIMECutoffReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const historicalSource = "https://ivyleaguecenter.org/2016/01/23/1487/";
  const currentSource = "https://areteem.org/blog/aime-cutoffs-and-amc-10-12-awards/";
  const maaCurrentAnnouncement = "https://maa.org/news/2025-26-aime-thresholds-are-now-available/";
  const maaFixedThresholdAnnouncement = "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/";
  // Historical published AIME-qualification lines through 2025, followed by
  // the MAA's fixed 2026-27 registration thresholds. 2024 AMC 12A uses the MAA's
  // revised line (76.5), not the initially announced 85.5. 2025 values are
  // cross-checked against MAA's official announcement (values embedded as a
  // remote image) and an independent published table; older values are secondary.
  const rows = [
    [2000,"regular","amc10","single",110],[2000,"regular","amc12","single",92],
    [2001,"regular","amc10","single",116],[2001,"regular","amc12","single",84],
    [2002,"regular","amc10","A",115],[2002,"regular","amc10","B",118],[2002,"regular","amc12","A",100],[2002,"regular","amc12","B",100],
    [2003,"regular","amc10","A",119],[2003,"regular","amc10","B",121],[2003,"regular","amc12","A",100],[2003,"regular","amc12","B",100],
    [2004,"regular","amc10","A",110],[2004,"regular","amc10","B",120],[2004,"regular","amc12","A",100],[2004,"regular","amc12","B",100],
    [2005,"regular","amc10","A",120],[2005,"regular","amc10","B",120],[2005,"regular","amc12","A",100],[2005,"regular","amc12","B",100],
    [2006,"regular","amc10","A",120],[2006,"regular","amc10","B",120],[2006,"regular","amc12","A",100],[2006,"regular","amc12","B",100],
    [2007,"regular","amc10","A",117],[2007,"regular","amc10","B",115.5],[2007,"regular","amc12","A",97.5],[2007,"regular","amc12","B",100],
    [2008,"regular","amc10","A",117],[2008,"regular","amc10","B",120],[2008,"regular","amc12","A",97.5],[2008,"regular","amc12","B",97.5],
    [2009,"regular","amc10","A",120],[2009,"regular","amc10","B",120],[2009,"regular","amc12","A",97.5],[2009,"regular","amc12","B",100],
    [2010,"regular","amc10","A",118.5],[2010,"regular","amc10","B",118.5],[2010,"regular","amc12","A",88.5],[2010,"regular","amc12","B",88.5],
    [2011,"regular","amc10","A",117],[2011,"regular","amc10","B",117],[2011,"regular","amc12","A",93],[2011,"regular","amc12","B",97.5],
    [2012,"regular","amc10","A",115.5],[2012,"regular","amc10","B",120],[2012,"regular","amc12","A",94.5],[2012,"regular","amc12","B",99],
    [2013,"regular","amc10","A",108],[2013,"regular","amc10","B",120],[2013,"regular","amc12","A",88.5],[2013,"regular","amc12","B",93],
    [2014,"regular","amc10","A",120],[2014,"regular","amc10","B",120],[2014,"regular","amc12","A",93],[2014,"regular","amc12","B",100],
    [2015,"regular","amc10","A",106.5],[2015,"regular","amc10","B",120],[2015,"regular","amc12","A",99],[2015,"regular","amc12","B",100],
    [2016,"regular","amc10","A",110],[2016,"regular","amc10","B",110],[2016,"regular","amc12","A",92],[2016,"regular","amc12","B",100],
    [2017,"regular","amc10","A",112.5],[2017,"regular","amc10","B",120],[2017,"regular","amc12","A",96],[2017,"regular","amc12","B",100.5],
    [2018,"regular","amc10","A",111],[2018,"regular","amc10","B",108],[2018,"regular","amc12","A",93],[2018,"regular","amc12","B",99],
    [2019,"regular","amc10","A",103.5],[2019,"regular","amc10","B",108],[2019,"regular","amc12","A",84],[2019,"regular","amc12","B",94.5],
    [2020,"regular","amc10","A",103.5],[2020,"regular","amc10","B",102],[2020,"regular","amc12","A",87],[2020,"regular","amc12","B",87],
    [2021,"spring","amc10","A",103.5],[2021,"spring","amc10","B",102],[2021,"spring","amc12","A",93],[2021,"spring","amc12","B",91.5],
    [2021,"fall","amc10","A",96],[2021,"fall","amc10","B",96],[2021,"fall","amc12","A",91.5],[2021,"fall","amc12","B",84],
    [2022,"regular","amc10","A",93],[2022,"regular","amc10","B",94.5],[2022,"regular","amc12","A",93],[2022,"regular","amc12","B",85.5],
    [2023,"regular","amc10","A",103.5],[2023,"regular","amc10","B",105],[2023,"regular","amc12","A",85.5],[2023,"regular","amc12","B",88.5],
    [2024,"regular","amc10","A",94.5],[2024,"regular","amc10","B",105],[2024,"regular","amc12","A",76.5],[2024,"regular","amc12","B",88.5],
    [2025,"regular","amc10","A",105],[2025,"regular","amc10","B",99],[2025,"regular","amc12","A",96],[2025,"regular","amc12","B",100.5],
    [2026,"regular","amc10","A",100],[2026,"regular","amc10","B",100],[2026,"regular","amc12","A",85],[2026,"regular","amc12","B",85]
  ].map(function (row) {
    const [year, administration, contest, form, cutoff] = row;
    return Object.freeze({ year, administration, contest, form, cutoff,
      sourceUrl: year === 2026 ? maaFixedThresholdAnnouncement : year === 2025 ? currentSource : historicalSource,
      sourceStatus: year === 2026 ? "maa-official-fixed-registration-threshold" : year === 2025 ? "secondary-crosschecked-with-MAA-announcement" : "secondary-historical-transcription" });
  });

  function referenceFor(contest, year, form, administration) {
    const targetContest = String(contest || "").toLowerCase();
    const selectedForm = String(form || "").toUpperCase();
    const targetForm = selectedForm === "SINGLE" ? "single" : selectedForm === "C" ? "A" : selectedForm === "D" ? "B" : selectedForm;
    const targetAdministration = String(administration || (Number(year) === 2021 ? selectedForm === "C" || selectedForm === "D" ? "fall" : "spring" : "regular")).toLowerCase();
    const matches = rows.filter(function (row) {
      return row.contest === targetContest && row.year === Number(year) && row.form === targetForm &&
        (targetAdministration ? row.administration === targetAdministration : row.administration === "regular");
    });
    if (matches.length !== 1) return null;
    return matches[0];
  }
  return Object.freeze({ rows: Object.freeze(rows), historicalSource: historicalSource, currentSource: currentSource, maaCurrentAnnouncement: maaCurrentAnnouncement, maaFixedThresholdAnnouncement: maaFixedThresholdAnnouncement, referenceFor: referenceFor });
});
