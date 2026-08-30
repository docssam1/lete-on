(function (root, factory) {
  const value = typeof module === "object" && module.exports
    ? factory(require("./grade6-rp-clinic-pack.js"), require("./grade6-ns-a-clinic-pack.js"), require("./grade6-ns-b-clinic-pack.js"))
    : factory(root && root.GFIELDGrade6RPClinicPack, root && root.GFIELDGrade6NSAClinicPack, root && root.GFIELDGrade6NSBClinicPack);
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6ClinicPacks = value;
})(typeof window !== "undefined" ? window : globalThis, function (ratioPack, fractionPack, computationPack) {
  "use strict";
  const packs = [ratioPack, fractionPack, computationPack].filter(Boolean);
  const byCluster = Object.freeze(Object.fromEntries(packs.map(function (entry) { return [entry.pack.clusterId, entry]; })));
  if (Object.keys(byCluster).length !== packs.length) throw new Error("CLINIC_PACK_CLUSTER_DUPLICATE");
  packs.forEach(function (entry) { entry.validatePack(); });
  function forCluster(clusterId) {
    const pack = byCluster[String(clusterId || "")];
    if (!pack) throw new Error("CLINIC_PACK_UNSUPPORTED");
    return pack;
  }
  return Object.freeze({ schemaVersion: 1, packs: Object.freeze(packs.slice()), byCluster: byCluster, forCluster: forCluster });
});
