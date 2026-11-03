# Historical AMC grade-level results — source staging

This folder contains historical, source-attributed aggregate data for future review. These files are not currently wired into student-facing grade comparisons or diagnostic bands.

`amc8-2011-korea-grade-percentile.csv` transcribes the MAA report table reproduced by AMC Study for the 2011 AMC 8 Korea participant cohort (899 reported participants). It contains only score-by-grade-group counts and the table's reported percentile values; no names, school records, or individual results are copied.

- Source: https://www.amcstudy.net/79
- Population: Korea (as described by the source page), not the US national cohort.
- Grade buckets: `<=5`, `6`, `7`, `8`, plus unknown in the source. The CSV includes the four named grade buckets only; the unknown and overall columns are omitted.
- Source status: secondary transcription of a report attributed to MAA; original MAA report capture and exact percentile formula have not yet been verified.
- Intended use: research staging only. Do not use for US/national inference, current-year norms, placement, skill mastery, or student-facing score labels before primary-source reconciliation and product review.
- Rows with a blank percentile correspond to source cells that had no numeric value because no participant was listed for that score/group.
- Source omitted score 1 because no score-1 row was present; it is deliberately not synthesized here.
