"use strict";
// Reproducible inventory. No network calls and no guessed thresholds.
const fs = require("node:fs"), path = require("node:path");
const library = require("../competition/amc-original-paper-library.js");
const amc = require("../competition/amc-score-distribution-reference.js");
const aime = require("../competition/aime-score-distribution-reference.js");
const overall = require("../competition/amc8-overall-cohort-reference.js");
const output = path.resolve(__dirname,"../competition/historical-amc-grade/score-distribution-coverage-by-paper.csv");
const columns = ["program","year","form","published_threshold_count","missing_threshold_ids","average_available","standard_deviation_available","reported_score_frequency_sum","source_url","frequency_source_url"];
const rows = [], totals = {};
for(const program of Object.keys(library.archives)) {
  totals[program]={papers:0,allSeven:0,someThresholds:0,noThresholds:0,exactFrequency:0};
  for(const year of library.archives[program].years) for(const form of library.formsFor(program,year)) {
    const dataset = program === "aime" ? aime : amc;
    const ref = program === "aime" ? dataset.referenceFor(year,form) : dataset.referenceFor(program,year,form);
    const missing = dataset.bands.filter(b=>!ref || !Number.isFinite(ref[b.id])).map(b=>b.id);
    const count=dataset.bands.length-missing.length;
    const frequencies = program === "amc8" ? overall.referenceFor(year,0) : null;
    const total=totals[program];total.papers++;if(count===7)total.allSeven++;else if(count)total.someThresholds++;else total.noThresholds++;
    if(frequencies && frequencies.distributionParticipants)total.exactFrequency++;
    rows.push([program,year,form,count,missing.join("|"),Boolean(ref && Number.isFinite(ref.average)),Boolean(ref && Number.isFinite(ref.standardDeviation)),frequencies && frequencies.distributionParticipants || "",ref && (ref.sourceUrl || dataset.sourceUrl) || "",frequencies && frequencies.distributionParticipants ? frequencies.sourceUrl : ""]);
  }
}
const csv=[columns,...rows].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(",")).join("\n")+"\n";
if(process.argv.includes("--check")) {
  if(!fs.existsSync(output) || fs.readFileSync(output,"utf8")!==csv)throw new Error("Coverage CSV differs; rerun scripts/audit-paper-score-coverage.cjs");
} else fs.writeFileSync(output,csv);
console.log(JSON.stringify(totals,null,2));
