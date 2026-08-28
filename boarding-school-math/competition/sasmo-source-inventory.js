(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOSourceInventory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LAST_VERIFIED = "2026-08-28";
  const K12_INDEX_URL = "https://www.k12mathcontests.com/contest/sasmo";
  const EDUGAIN_URL = "https://kr.edugain.com/curriculum-16/SASMO";
  const EDUGAIN_POLICY_URL = "https://kr.edugain.com/policy";
  const OFFICIAL_SIMCC_URL = "https://sasmo.simcc.org/";
  const CURRENT_OFFICIAL_LEVEL_IDS = Object.freeze(["K2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"]);
  const HISTORICAL_INDEX_LEVEL_IDS = Object.freeze(["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"]);
  const ARCHIVE_YEARS = Object.freeze([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]);
  const ASSET_TYPE_COUNTS = Object.freeze({ p: 66, s: 47, ps: 23, a: 5, pa: 3 });

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  function normalizeLevelId(levelId) {
    const value = String(levelId || "").trim().toUpperCase();
    const match = /^G?(10|[1-9])$/.exec(value);
    return match ? "G" + match[1] : null;
  }

  const coverageByYear = {
    2014: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2015: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2016: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2017: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2018: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2019: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2020: ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    2021: ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"],
    2022: ["G2", "G5", "G6", "G7", "G8", "G9", "G10"],
    2023: ["G1", "G5", "G6"],
    2024: ["G1", "G2", "G3", "G4", "G5", "G6"]
  };

  const inventory = {
    schemaVersion: "1.0.0",
    programId: "sasmo-public-source-inventory",
    title: "GFIELD SASMO Public Source Inventory",
    lastVerified: LAST_VERIFIED,
    publicSafety: {
      contentIncluded: false,
      directAssetDelivery: false,
      permittedUse: "metadata-and-external-links-only",
      prohibitedUse: ["rehost", "translate", "extract"]
    },
    currentOfficialScope: {
      sourceId: "sasmo-official-current",
      levelIds: CURRENT_OFFICIAL_LEVEL_IDS,
      scopeNote: "Current official eligibility and format remain organizer-controlled and must be checked at the official site."
    },
    historicalIndexScope: {
      sourceId: "k12-sasmo-third-party-index",
      levelIds: HISTORICAL_INDEX_LEVEL_IDS,
      years: ARCHIVE_YEARS,
      isCurrentOfficialScope: false,
      scopeNote: "This historical third-party index is incomplete for the current K2 and G11-G12 official scope."
    },
    sources: [
      {
        id: "sasmo-official-current",
        provider: "Singapore and Asian Schools Math Olympiad",
        url: OFFICIAL_SIMCC_URL,
        sourceStatus: "official_public_link_only",
        access: "external-official-link-only",
        contentReuse: false,
        note: "Official current-program link only; no contest content is delivered by this registry."
      },
      {
        id: "k12-sasmo-third-party-index",
        provider: "K12 Math Contests",
        url: K12_INDEX_URL,
        sourceStatus: "third_party_index_only",
        access: "external-index-link-only",
        catalogStatus: "private-reference-catalogued",
        contentReuse: false,
        licenceStatus: "no-licence-located",
        restrictions: ["cannot-rehost", "cannot-translate", "cannot-extract"],
        note: "Historical availability index only; it is not a redistribution, translation, or extraction permission."
      },
      {
        id: "edugain-sasmo-structure",
        provider: "Edugain",
        url: EDUGAIN_URL,
        policyUrl: EDUGAIN_POLICY_URL,
        sourceStatus: "structure_reference_only",
        access: "external-reference-link-only",
        contentReuse: false,
        licenceStatus: "policy-restricts-copying-and-harvesting",
        note: "Comparative structure reference only; no Edugain question, answer, solution, or generator output is included."
      }
    ],
    k12HistoricalAggregate: {
      indexRecordCount: 88,
      physicalPdfCount: 144,
      pageCount: 1796,
      byteCount: 153123480,
      uniqueSha256Count: 144,
      duplicateGroupCount: 0,
      exactOrganizerArchiveMatchCount: 9,
      assetTypeCounts: ASSET_TYPE_COUNTS,
      coverageByYear
    },
    edugainComparativeAggregate: {
      levelIds: HISTORICAL_INDEX_LEVEL_IDS,
      selectableDomTopicNodeCount: 158,
      sourceStatus: "structure_reference_only",
      contentReuse: false
    }
  };

  function getHistoricalCoverage(year) {
    const normalizedYear = Number(year);
    const levels = coverageByYear[normalizedYear];
    if (!levels) return null;
    return deepFreeze({
      year: normalizedYear,
      levelIds: levels.slice(),
      sourceId: "k12-sasmo-third-party-index",
      access: "external-index-link-only"
    });
  }

  function hasHistoricalIndexEntry(year, levelId) {
    const coverage = getHistoricalCoverage(year);
    const normalizedLevelId = normalizeLevelId(levelId);
    return Boolean(coverage && normalizedLevelId && coverage.levelIds.includes(normalizedLevelId));
  }

  function validatePublicInventory(candidate) {
    const data = candidate || inventory;
    const errors = [];
    const aggregate = data.k12HistoricalAggregate || {};
    const sourceRows = data.sources || [];
    const text = JSON.stringify(data);
    const requiredAggregate = {
      indexRecordCount: 88,
      physicalPdfCount: 144,
      pageCount: 1796,
      byteCount: 153123480,
      uniqueSha256Count: 144,
      duplicateGroupCount: 0,
      exactOrganizerArchiveMatchCount: 9
    };

    Object.keys(requiredAggregate).forEach(function (key) {
      if (aggregate[key] !== requiredAggregate[key]) errors.push("K12 aggregate " + key + " is not verified.");
    });
    Object.keys(ASSET_TYPE_COUNTS).forEach(function (type) {
      if (!aggregate.assetTypeCounts || aggregate.assetTypeCounts[type] !== ASSET_TYPE_COUNTS[type]) errors.push("K12 asset type count is not verified for " + type + ".");
    });
    if (!data.currentOfficialScope || !Array.isArray(data.currentOfficialScope.levelIds) || data.currentOfficialScope.levelIds.join(",") !== CURRENT_OFFICIAL_LEVEL_IDS.join(",")) {
      errors.push("Current official scope must cover K2 and G1-G12.");
    }
    if (!data.historicalIndexScope || data.historicalIndexScope.isCurrentOfficialScope !== false || !Array.isArray(data.historicalIndexScope.levelIds) || data.historicalIndexScope.levelIds.join(",") !== HISTORICAL_INDEX_LEVEL_IDS.join(",")) {
      errors.push("Historical index scope must remain separate from current official scope.");
    }
    if (!data.edugainComparativeAggregate || data.edugainComparativeAggregate.selectableDomTopicNodeCount !== 158 || data.edugainComparativeAggregate.contentReuse !== false) {
      errors.push("Edugain comparison must remain metadata-only.");
    }
    const k12 = sourceRows.find(function (row) { return row.id === "k12-sasmo-third-party-index"; });
    if (!k12 || k12.sourceStatus !== "third_party_index_only" || k12.catalogStatus !== "private-reference-catalogued" || k12.access !== "external-index-link-only" || k12.contentReuse !== false || k12.licenceStatus !== "no-licence-located") {
      errors.push("K12 source status must remain index-only and private-catalogued.");
    }
    const edugain = sourceRows.find(function (row) { return row.id === "edugain-sasmo-structure"; });
    if (!edugain || edugain.sourceStatus !== "structure_reference_only" || edugain.contentReuse !== false) errors.push("Edugain must remain a structure-only reference.");
    if (!data.publicSafety || data.publicSafety.contentIncluded !== false || data.publicSafety.directAssetDelivery !== false) errors.push("Public registry must not include content or direct asset delivery.");
    if (/https?:[^"\\s]+\\.pdf(?:["\\s]|$)/i.test(text)) errors.push("Public inventory cannot include PDF URLs.");
    if (/\\b(questionText|questionContent|officialProblem|answerKey|workedSolution|sha256|filename|fileName)\\b/i.test(text)) errors.push("Public inventory cannot include item content, hashes, or filenames.");
    return deepFreeze({ valid: errors.length === 0, errors });
  }

  const api = {
    schemaVersion: "1.0.0",
    lastVerified: LAST_VERIFIED,
    CURRENT_OFFICIAL_LEVEL_IDS,
    HISTORICAL_INDEX_LEVEL_IDS,
    ARCHIVE_YEARS,
    ASSET_TYPE_COUNTS,
    inventory,
    normalizeLevelId,
    getHistoricalCoverage,
    hasHistoricalIndexEntry,
    validatePublicInventory
  };

  if (!validatePublicInventory(inventory).valid) throw new Error("SASMO source inventory is not public-safe.");
  return deepFreeze(api);
});
