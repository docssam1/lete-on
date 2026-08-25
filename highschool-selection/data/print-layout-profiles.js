(function (root, factory) {
  "use strict";
  const policy = typeof module !== "undefined" && module.exports
    ? require("./print-exam-policy.js")
    : root.HIGHSELECT_PRINT_EXAM_POLICY;
  const api = factory(policy);
  root.HIGHSELECT_PRINT_LAYOUT_PROFILES = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (policy) {
  "use strict";

  if (!policy) throw new Error("print exam policy is required");

  const profiles = Object.freeze({
    "SH-R01": policy.createLayoutProfile({
      id: "pol-sh-dd9c2be1ce33f065",
      mode: "SH",
      referenceDesignFingerprint: "sha256:90d966e0ebcbaa945baad8b6980d8bacdb43312a496c00739ec09aea89f22b60",
      referenceSourceFingerprint: "sha256:0af8608e13aba839154ccf895751e6456dfff726eff55fd70d6d0b998e932574",
      pageSize: "A4",
      marginTopMm: 19,
      marginRightMm: 15,
      marginBottomMm: 18,
      marginLeftMm: 15,
      columns: 2,
      gutterMm: 9.5,
      headerHeightMm: 24,
      bodyTopMm: 50,
      footerBaselineMm: 280,
      columnRule: true,
      numberColor: "#008b23"
    })
  });

  return Object.freeze({
    measuredAt: "2026-08-22",
    measurementBasis: "private-reference-page-1",
    profiles
  });
});
