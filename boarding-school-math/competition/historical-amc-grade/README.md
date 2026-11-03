# Historical AMC grade-level results — source staging

This folder contains historical, source-attributed aggregate data for future review. These files are not currently wired into student-facing grade comparisons or diagnostic bands.

`amc8-2011-korea-grade-percentile.csv` transcribes the MAA report table reproduced by AMC Study for the 2011 AMC 8 Korea participant cohort (899 reported participants). It contains only score-by-grade-group counts and the table's reported percentile values; no names, school records, or individual results are copied.

`amc8-2009-korea-grade-score-count.csv` transcribes the score-by-grade frequency table reproduced for the 2009 AMC 8 Korea participant cohort (741 reported participants). It has grade buckets 5–8 only and no percentile values. The four grade totals sum to 737, leaving four participants with no grade recorded in the report summary.

`amc8-grade-means-2003-2009.csv` stages recorded-grade participant counts and mean scores from an MAA-authored AMC 8 annual report. Its grade groups are 4–5, 6, 7, and 8.

`amc10-12-grade-means-2007-2011.csv` stages 110 historical AMC 10/12 records from MAA-authored national statistical reports: grade-group mean and participant count, separated by contest, year, and A/B form. The 2007–2010 values are from the 2010 annual report; 2011 values are from a copy of the posted grand-statistics report. Grade groups preserve the report wording (`8 and below` vs exact `8`, and `unknown`). These are historical descriptive means, not percentile ranks, cut scores, or level labels.

- Source: https://www.amcstudy.net/79
- 2009 source: https://www.amcstudy.net/43
- AMC 10/12 2007–2010 report mirror: https://www.scribd.com/document/51428451/2010-HS-summary
- AMC 10/12 2011 grand-statistics copy: https://www.scribd.com/document/990470105/USA-AMC-10-2011-Statistic
- AMC 8 2003–2009 annual report mirror: https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html
- Population: Korea (as described by the source page), not the US national cohort.
- Grade buckets: `<=5`, `6`, `7`, `8`, plus unknown in the source. The CSV includes the four named grade buckets only; the unknown and overall columns are omitted.
- Source status: secondary transcription of a report attributed to MAA; original MAA report capture and exact percentile formula have not yet been verified.
- Intended use: research staging only. Do not use for US/national inference, current-year norms, placement, skill mastery, or student-facing score labels before primary-source reconciliation and product review.
- The AMC8 grade means and AMC10/12 means above are also research staging only. Their third-party mirrors contain MAA-authored reports, but the original report host/copy was not independently recovered in this pass. Keep source status and population visible; never merge a US report with Korea-only data.
- Rows with a blank percentile correspond to source cells that had no numeric value because no participant was listed for that score/group.
- Source omitted score 1 because no score-1 row was present; it is deliberately not synthesized here.
