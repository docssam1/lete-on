(function (root, factory) {
  "use strict";
  const security = typeof module !== "undefined" && module.exports
    ? require("./exam-security.js")
    : root.HIGHSELECT_EXAM_SECURITY;
  const lineage = typeof module !== "undefined" && module.exports
    ? require("../data/source-lineage.js")
    : root.HIGHSELECT_SOURCE_LINEAGE;
  const api = factory(security, lineage);
  root.HIGHSELECT_SOURCE_ASSET_SECURITY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (security, lineage) {
  "use strict";

  if (!security || !lineage) throw new Error("exam security and source lineage modules are required");

  function fail(message) { throw new Error(message); }

  function validateSourceRasterManifest(manifest, sourceReference, exam, session, runtime, nowMs) {
    const reference = lineage.createSourceAssetReference(sourceReference);
    if (!manifest || manifest.sourceAssetId !== reference.sourceAssetId) fail("원본 자산 식별자가 일치하지 않습니다.");
    if (manifest.sourceFingerprint !== reference.sourceFingerprint) fail("원본 자산 지문이 일치하지 않습니다.");
    if (manifest.sourcePageNumber !== reference.pageNumber) fail("원본 페이지 번호가 일치하지 않습니다.");
    if (!exam || !exam.id) fail("시험 식별자가 필요합니다.");

    const pages = security.validateManifest(manifest, { id: exam.id, pageCount: 1 }, session, runtime, nowMs);
    return Object.freeze({
      sourceAssetId: reference.sourceAssetId,
      sourceFingerprint: reference.sourceFingerprint,
      sourcePageNumber: reference.pageNumber,
      assetVariant: reference.assetVariant,
      itemLocator: reference.itemLocator,
      bbox: reference.bbox,
      raster: Object.freeze(pages[0])
    });
  }

  return Object.freeze({ validateSourceRasterManifest });
});
