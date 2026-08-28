const test = require("node:test");
const assert = require("node:assert/strict");
const registry = require("../competition/sasmo-source-inventory.js");

test("SASMO K12 public inventory preserves the verified aggregate facts without files or content", function () {
  const aggregate = registry.inventory.k12HistoricalAggregate;
  assert.deepEqual({
    indexRecordCount: aggregate.indexRecordCount,
    physicalPdfCount: aggregate.physicalPdfCount,
    pageCount: aggregate.pageCount,
    byteCount: aggregate.byteCount,
    uniqueSha256Count: aggregate.uniqueSha256Count,
    duplicateGroupCount: aggregate.duplicateGroupCount,
    exactOrganizerArchiveMatchCount: aggregate.exactOrganizerArchiveMatchCount
  }, {
    indexRecordCount: 88,
    physicalPdfCount: 144,
    pageCount: 1796,
    byteCount: 153123480,
    uniqueSha256Count: 144,
    duplicateGroupCount: 0,
    exactOrganizerArchiveMatchCount: 9
  });
  assert.deepEqual(aggregate.assetTypeCounts, { p: 66, s: 47, ps: 23, a: 5, pa: 3 });
  assert.equal(Object.values(aggregate.assetTypeCounts).reduce(function (total, count) { return total + count; }, 0), 144);
});

test("K12 historical coverage is exact by year and cannot be presented as the current scope", function () {
  const completeHistoricalBand = ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"];
  for (let year = 2014; year <= 2020; year += 1) assert.deepEqual(registry.getHistoricalCoverage(year).levelIds, completeHistoricalBand);
  assert.deepEqual(registry.getHistoricalCoverage(2021).levelIds, ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"]);
  assert.deepEqual(registry.getHistoricalCoverage(2022).levelIds, ["G2", "G5", "G6", "G7", "G8", "G9", "G10"]);
  assert.deepEqual(registry.getHistoricalCoverage(2023).levelIds, ["G1", "G5", "G6"]);
  assert.deepEqual(registry.getHistoricalCoverage(2024).levelIds, ["G1", "G2", "G3", "G4", "G5", "G6"]);
  assert.equal(registry.getHistoricalCoverage(2013), null);
  assert.equal(registry.hasHistoricalIndexEntry(2024, "G6"), true);
  assert.equal(registry.hasHistoricalIndexEntry(2024, "G7"), false);
  assert.equal(registry.hasHistoricalIndexEntry(2021, "g1"), true);
  assert.equal(registry.hasHistoricalIndexEntry(2021, "K2"), false);
  assert.deepEqual(registry.CURRENT_OFFICIAL_LEVEL_IDS, ["K2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"]);
  assert.deepEqual(registry.HISTORICAL_INDEX_LEVEL_IDS, ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"]);
  assert.equal(registry.inventory.historicalIndexScope.isCurrentOfficialScope, false);
});

test("source statuses make K12 index-only and Edugain structure-only", function () {
  const k12 = registry.inventory.sources.find(function (source) { return source.id === "k12-sasmo-third-party-index"; });
  const edugain = registry.inventory.sources.find(function (source) { return source.id === "edugain-sasmo-structure"; });
  const official = registry.inventory.sources.find(function (source) { return source.id === "sasmo-official-current"; });
  assert.deepEqual({
    sourceStatus: k12.sourceStatus,
    catalogStatus: k12.catalogStatus,
    access: k12.access,
    contentReuse: k12.contentReuse,
    licenceStatus: k12.licenceStatus,
    restrictions: k12.restrictions
  }, {
    sourceStatus: "third_party_index_only",
    catalogStatus: "private-reference-catalogued",
    access: "external-index-link-only",
    contentReuse: false,
    licenceStatus: "no-licence-located",
    restrictions: ["cannot-rehost", "cannot-translate", "cannot-extract"]
  });
  assert.equal(edugain.sourceStatus, "structure_reference_only");
  assert.equal(edugain.contentReuse, false);
  assert.equal(registry.inventory.edugainComparativeAggregate.selectableDomTopicNodeCount, 158);
  assert.equal(official.url, "https://sasmo.simcc.org/");
});

test("public registry does not deliver source assets or contest content and all exports are deeply frozen", function () {
  assert.deepEqual(registry.validatePublicInventory(), { valid: true, errors: [] });
  assert.equal(registry.inventory.publicSafety.contentIncluded, false);
  assert.equal(registry.inventory.publicSafety.directAssetDelivery, false);
  const text = JSON.stringify(registry.inventory);
  assert.doesNotMatch(text, /https?:[^"\s]+\.pdf(?:["\s]|$)/i);
  assert.doesNotMatch(text, /\b(questionText|questionContent|officialProblem|answerKey|workedSolution|sha256|filename|fileName)\b/i);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.inventory), true);
  assert.equal(Object.isFrozen(registry.inventory.sources[1]), true);
  assert.equal(Object.isFrozen(registry.inventory.k12HistoricalAggregate.coverageByYear[2024]), true);
});
