(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const lineage = typeof module !== "undefined" && module.exports
    ? require("./source-lineage.js")
    : root.HIGHSELECT_SOURCE_LINEAGE;
  const api = factory(core, lineage);
  root.HIGHSELECT_PRINT_EXAM_POLICY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core, lineage) {
  "use strict";

  if (!core || !lineage) throw new Error("question-bank core and source lineage modules are required");

  const PAGE_SIZES = Object.freeze({
    A4: Object.freeze({ widthMm: 210, heightMm: 297 })
  });
  const RASTER_POLICY = "signed-page-images";
  const FINGERPRINT_PATTERN = /^sha256:[0-9a-f]{64}$/;
  const COLOR_PATTERN = /^#[0-9a-f]{6}$/;
  const FORBIDDEN_PLAN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "url", "uri", "path", "filePath", "pdfUrl", "downloadUrl", "storageUrl"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function own(object, key) {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
  }

  function rejectForbidden(value, location) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      invariant(!FORBIDDEN_PLAN_KEYS.includes(key), `${location} cannot contain ${key}`);
      rejectForbidden(value[key], `${location}.${key}`);
    });
  }

  function finiteRange(value, minimum, maximum, field) {
    const number = Number(value);
    invariant(Number.isFinite(number) && number >= minimum && number <= maximum, `${field} is out of range`);
    return number;
  }

  function createLayoutProfile(input) {
    invariant(input && typeof input === "object", "layout profile is required");
    rejectForbidden(input, "layoutProfile");
    const mode = String(input.mode || "").toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "layout profile mode is not allowed");
    invariant(core.isNeutralId(input.id, "policy", mode), "layoutProfile.id is invalid");
    const referenceDesignFingerprint = String(input.referenceDesignFingerprint || "").toLowerCase();
    invariant(FINGERPRINT_PATTERN.test(referenceDesignFingerprint), "reference design fingerprint is invalid");
    const referenceSourceFingerprint = String(input.referenceSourceFingerprint || "").toLowerCase();
    invariant(FINGERPRINT_PATTERN.test(referenceSourceFingerprint), "reference source fingerprint is invalid");
    const size = PAGE_SIZES[input.pageSize || "A4"];
    invariant(size, "page size is not allowed");
    const marginTopMm = finiteRange(input.marginTopMm, 0, 40, "marginTopMm");
    const marginRightMm = finiteRange(input.marginRightMm, 0, 40, "marginRightMm");
    const marginBottomMm = finiteRange(input.marginBottomMm, 0, 40, "marginBottomMm");
    const marginLeftMm = finiteRange(input.marginLeftMm, 0, 40, "marginLeftMm");
    const columns = Number(input.columns);
    invariant(Number.isSafeInteger(columns) && columns >= 1 && columns <= 3, "columns is out of range");
    const gutterMm = finiteRange(input.gutterMm, 0, 20, "gutterMm");
    invariant(marginLeftMm + marginRightMm + gutterMm * (columns - 1) < size.widthMm, "horizontal layout does not fit the page");
    invariant(marginTopMm + marginBottomMm < size.heightMm, "vertical layout does not fit the page");
    const headerHeightMm = finiteRange(input.headerHeightMm, 0, 60, "headerHeightMm");
    const bodyTopMm = finiteRange(input.bodyTopMm, headerHeightMm, 100, "bodyTopMm");
    const footerBaselineMm = finiteRange(input.footerBaselineMm, bodyTopMm, size.heightMm, "footerBaselineMm");
    const numberColor = String(input.numberColor || "").toLowerCase();
    invariant(COLOR_PATTERN.test(numberColor), "numberColor is invalid");
    return Object.freeze({
      id: input.id,
      referenceDesignFingerprint,
      referenceSourceFingerprint,
      pageSize: input.pageSize || "A4",
      widthMm: size.widthMm,
      heightMm: size.heightMm,
      marginsMm: Object.freeze({ top: marginTopMm, right: marginRightMm, bottom: marginBottomMm, left: marginLeftMm }),
      columns,
      gutterMm,
      headerHeightMm,
      bodyTopMm,
      footerBaselineMm,
      columnRule: input.columnRule === true,
      numberColor,
      identityPolicy: "neutral-brand-only",
      rasterPolicy: RASTER_POLICY
    });
  }

  function createPrintPlan(input) {
    invariant(input && typeof input === "object", "print plan is required");
    rejectForbidden(input, "printPlan");
    const mode = String(input.mode || "").toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "print plan mode is not allowed");
    invariant(input.writer === core.WRITER, "print plan writer must be T");
    invariant(core.isNeutralId(input.id, "policy", mode), "printPlan.id is invalid");
    invariant(core.isNeutralId(input.examId, "exam", mode), "printPlan.examId is invalid");
    invariant(core.isNeutralId(input.layoutProfileId, "policy", mode), "printPlan.layoutProfileId is invalid");
    const printPlanFingerprint = String(input.printPlanFingerprint || "").toLowerCase();
    invariant(FINGERPRINT_PATTERN.test(printPlanFingerprint), "printPlan.printPlanFingerprint is invalid");
    invariant(input.assemblyEligible === true, "print plan requires an eligible exam assembly");
    invariant(input.approvalStatus === "approved", "print plan requires user approval");
    invariant(Array.isArray(input.pages) && input.pages.length > 0, "print plan pages are required");
    const seenLineages = new Set();
    const pages = input.pages.map(function (page, index) {
      invariant(page && page.number === index + 1, "print plan page order is invalid");
      invariant(lineage.ASSET_VARIANTS.includes(page.assetVariant), "print page assetVariant is invalid");
      invariant(Array.isArray(page.sourceRefs) && page.sourceRefs.length > 0, "print page sourceRefs are required");
      invariant(Array.isArray(page.lineageIds) && page.lineageIds.length === page.sourceRefs.length, "print page lineage mapping is invalid");
      const sourceRefs = page.sourceRefs.map(function (reference) {
        const clean = lineage.createSourceAssetReference(reference);
        invariant(core.isNeutralId(clean.sourceAssetId, "source", mode), "print source mode must match");
        invariant(clean.assetVariant === page.assetVariant, "print page source variant must match");
        return clean;
      });
      const lineageIds = page.lineageIds.map(function (id) {
        invariant(core.isNeutralId(id, "lineage", mode), "print page lineage id is invalid");
        invariant(!seenLineages.has(id), "print plan lineage ids must be unique");
        seenLineages.add(id);
        return id;
      });
      return Object.freeze({
        number: page.number,
        assetVariant: page.assetVariant,
        sourceRefs: Object.freeze(sourceRefs),
        lineageIds: Object.freeze(lineageIds),
        renderMode: "server-raster"
      });
    });
    return Object.freeze({
      id: input.id,
      examId: input.examId,
      mode,
      writer: core.WRITER,
      layoutProfileId: input.layoutProfileId,
      printPlanFingerprint,
      assemblyEligible: true,
      approvalStatus: "approved",
      pageCount: pages.length,
      pages: Object.freeze(pages),
      rasterPolicy: RASTER_POLICY
    });
  }

  return Object.freeze({
    PAGE_SIZES,
    RASTER_POLICY,
    FORBIDDEN_PLAN_KEYS,
    COLOR_PATTERN,
    createLayoutProfile,
    createPrintPlan
  });
});
