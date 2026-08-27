(function (root, factory) {
  const registry = typeof module === "object" && module.exports
    ? require("../curriculum/us-k8-content-registry.js")
    : root.GFIELDUSK8ContentRegistry;
  const api = factory(registry);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade6PlacementPlan = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (registry) {
  "use strict";

  if (!registry) throw new Error("GFIELDUSK8ContentRegistry is required");

  const clusterSpecs = Object.freeze([
    Object.freeze({ clusterId: "6.RP.A", standardRange: "1-3", domainId: "G6-RP", difficulties: ["foundation", "foundation", "core", "core", "core", "core", "advanced", "advanced"], responseTypes: ["multiple-choice", "numeric", "multiple-choice", "numeric", "short-answer", "multiple-choice", "numeric", "constructed-response"] }),
    Object.freeze({ clusterId: "6.NS.A", standardRange: "1", domainId: "G6-NS", difficulties: ["foundation", "core", "advanced"], responseTypes: ["multiple-choice", "numeric", "constructed-response"] }),
    Object.freeze({ clusterId: "6.EE.A", standardRange: "1-4", domainId: "G6-EE", difficulties: ["foundation", "core", "core", "advanced"], responseTypes: ["multiple-choice", "numeric", "multiple-choice", "short-answer"] }),
    Object.freeze({ clusterId: "6.G.A", standardRange: "1-4", domainId: "G6-G", difficulties: ["foundation", "foundation", "core", "core", "core", "advanced", "advanced"], responseTypes: ["multiple-choice", "numeric", "multiple-choice", "numeric", "short-answer", "multiple-choice", "constructed-response"] }),
    Object.freeze({ clusterId: "6.SP.A", standardRange: "1-3", domainId: "G6-SP", difficulties: ["foundation", "core", "core"], responseTypes: ["multiple-choice", "numeric", "multiple-choice"] }),
    Object.freeze({ clusterId: "6.NS.B", standardRange: "2-4", domainId: "G6-NS", difficulties: ["foundation", "core", "core"], responseTypes: ["multiple-choice", "numeric", "numeric"] }),
    Object.freeze({ clusterId: "6.EE.B", standardRange: "5-8", domainId: "G6-EE", difficulties: ["foundation", "core", "core", "advanced"], responseTypes: ["multiple-choice", "numeric", "numeric", "constructed-response"] }),
    Object.freeze({ clusterId: "6.SP.B", standardRange: "4-5", domainId: "G6-SP", difficulties: ["core", "core", "core", "advanced"], responseTypes: ["multiple-choice", "numeric", "multiple-choice", "short-answer"] }),
    Object.freeze({ clusterId: "6.NS.C", standardRange: "5-8", domainId: "G6-NS", difficulties: ["foundation", "core", "core", "advanced"], responseTypes: ["multiple-choice", "multiple-choice", "numeric", "short-answer"] }),
    Object.freeze({ clusterId: "6.EE.C", standardRange: "9", domainId: "G6-EE", difficulties: ["core", "advanced"], responseTypes: ["multiple-choice", "short-answer"] })
  ]);

  const rowsByCluster = clusterSpecs.map(function (spec) {
    if (spec.difficulties.length !== spec.responseTypes.length) throw new Error(`${spec.clusterId} plan arrays must match`);
    const unit = registry.units.find(function (candidate) { return candidate.clusterId === spec.clusterId; });
    if (!unit || unit.grade !== 6) throw new Error(`${spec.clusterId} must map to one Grade 6 unit`);
    const clusterSlug = spec.clusterId.toLowerCase().replace(/\./g, "-").replace(/^6-/, "");
    return spec.difficulties.map(function (difficulty, index) {
      const responseType = spec.responseTypes[index];
      return Object.freeze({
        slotId: `slot-bdg-g6-${clusterSlug}-${String(index + 1).padStart(2, "0")}`,
        unitId: unit.unitId,
        clusterId: spec.clusterId,
        skillId: registry.skillIdForCluster(spec.clusterId),
        standardRange: `${spec.clusterId}.${spec.standardRange}`,
        domainId: spec.domainId,
        difficulty,
        responseType,
        scoringMode: ["short-answer", "constructed-response"].includes(responseType) ? "teacher" : "automatic",
        maxPoints: 1,
        itemId: null,
        itemVersion: null,
        releaseState: "locked-awaiting-reviewed-item"
      });
    });
  });

  const remaining = rowsByCluster.flat();
  const slots = [];
  function remainingCount(field, value) {
    return remaining.filter(function (row) { return row[field] === value; }).length;
  }
  while (remaining.length) {
    const last = slots[slots.length - 1];
    const secondLast = slots[slots.length - 2];
    const candidates = remaining.map(function (row, index) { return { row, index }; }).filter(function (candidate) {
      const row = candidate.row;
      if (last && row.domainId === last.domainId) return false;
      if (last && secondLast && row.difficulty === last.difficulty && row.difficulty === secondLast.difficulty) return false;
      if (last && secondLast && row.responseType === last.responseType && row.responseType === secondLast.responseType) return false;
      return true;
    }).sort(function (left, right) {
      function priority(candidate) {
        const row = candidate.row;
        return remainingCount("responseType", row.responseType) * 5 +
          remainingCount("difficulty", row.difficulty) * 3 + remainingCount("domainId", row.domainId) * 2;
      }
      return priority(right) - priority(left) || left.index - right.index;
    });
    if (!candidates.length) throw new Error("Grade 6 slots cannot satisfy the interleaving contract");
    slots.push(remaining.splice(candidates[0].index, 1)[0]);
  }

  const plan = Object.freeze({
    schemaVersion: "gfield-blueprint-plan-v1",
    id: "asm-bdg-grade6-entry-plan-v1",
    programId: "us-core-k8",
    targetGrade: 6,
    purpose: "course-placement",
    plannedItemCount: 42,
    deliveryRequirement: "authenticated-assessment-only",
    presentationOrderState: "fixed-stratified-template-only-server-seeded-order-pending",
    individualStandardCoverageState: "cluster-range-only-individual-standard-crosswalk-pending",
    releaseState: "locked-awaiting-reviewed-items-and-server-signature",
    claimsOfficialNationalCut: false,
    interpretation: Object.freeze({
      foundation: "prerequisite-and-entry-evidence",
      core: "direct-grade-6-evidence",
      advanced: "grade-6-multistep-transfer-not-grade-7-placement"
    }),
    slots: Object.freeze(slots)
  });

  return Object.freeze({ clusterSpecs, plan });
});
