const test = require("node:test");
const assert = require("node:assert/strict");
const planData = require("../assessment/grade6-placement-plan.js");
const clusterMap = require("../curriculum/us-k8-cluster-map.js");
const engine = require("../assessment/diagnostic-engine.js");

function counts(rows, field) {
  return Object.fromEntries(Array.from(new Set(rows.map(function (row) { return row[field]; }))).sort().map(function (value) {
    return [value, rows.filter(function (row) { return row[field] === value; }).length];
  }));
}

test("Grade 6 placement plan uses 42 locked authenticated slots rather than a 12-item claim", function () {
  const plan = planData.plan;
  assert.equal(plan.purpose, "course-placement");
  assert.equal(plan.plannedItemCount, 42);
  assert.equal(plan.slots.length, 42);
  assert.equal(plan.deliveryRequirement, "authenticated-assessment-only");
  assert.equal(plan.presentationOrderState, "fixed-stratified-template-only-server-seeded-order-pending");
  assert.equal(plan.individualStandardCoverageState, "cluster-range-only-individual-standard-crosswalk-pending");
  assert.equal(plan.releaseState, "locked-awaiting-reviewed-items-and-server-signature");
  assert.equal(plan.claimsOfficialNationalCut, false);
  plan.slots.forEach(function (slot) {
    assert.deepEqual(Object.keys(slot).sort(), [
      "clusterId", "difficulty", "domainId", "itemId", "itemVersion", "maxPoints", "releaseState",
      "responseType", "scoringMode", "slotId", "standardRange"
    ].sort());
    assert.match(slot.slotId, /^slot-bdg-g6-[a-z]+-[a-z]-\d{2}$/);
    assert.equal(slot.itemId, null);
    assert.equal(slot.itemVersion, null);
    assert.equal(slot.releaseState, "locked-awaiting-reviewed-item");
    assert.equal(slot.maxPoints, 1);
  });
  assert.equal(new Set(plan.slots.map(function (slot) { return slot.slotId; })).size, 42);
});

test("all ten official Grade 6 clusters and exact domain weights are represented", function () {
  const grade6Clusters = clusterMap.clusters.filter(function (row) { return row.grade === 6; });
  assert.deepEqual(new Set(planData.plan.slots.map(function (row) { return row.clusterId; })), new Set(grade6Clusters.map(function (row) { return row.clusterId; })));
  planData.plan.slots.forEach(function (slot) {
    const official = grade6Clusters.find(function (row) { return row.clusterId === slot.clusterId; });
    assert.ok(official);
    assert.equal(slot.domainId, `G6-${official.domainCode}`);
    assert.equal(slot.standardRange, official.standardRange);
  });
  assert.deepEqual(counts(planData.plan.slots, "domainId"), { "G6-EE": 10, "G6-G": 7, "G6-NS": 10, "G6-RP": 8, "G6-SP": 7 });
  assert.deepEqual(counts(planData.plan.slots, "clusterId"), {
    "6.EE.A": 4, "6.EE.B": 4, "6.EE.C": 2, "6.G.A": 7, "6.NS.A": 3,
    "6.NS.B": 3, "6.NS.C": 4, "6.RP.A": 8, "6.SP.A": 3, "6.SP.B": 4
  });
  new Set(planData.plan.slots.map(function (row) { return row.clusterId; })).forEach(function (clusterId) {
    assert.ok(planData.plan.slots.some(function (row) { return row.clusterId === clusterId && row.difficulty === "core"; }));
  });
});

test("difficulty and response distributions independently satisfy the diagnostic contract", function () {
  const slots = planData.plan.slots;
  assert.deepEqual(counts(slots, "difficulty"), { advanced: 10, core: 22, foundation: 10 });
  assert.deepEqual(counts(slots, "responseType"), { "constructed-response": 4, "multiple-choice": 18, numeric: 14, "short-answer": 6 });
  slots.forEach(function (slot) {
    const expectedScoring = ["short-answer", "constructed-response"].includes(slot.responseType) ? "teacher" : "automatic";
    assert.equal(slot.scoringMode, expectedScoring);
  });

  const hypotheticalApprovedProjection = {
    schemaVersion: engine.SCHEMA_VERSION,
    id: planData.plan.id.replace("-plan", ""),
    programId: planData.plan.programId,
    targetGrade: planData.plan.targetGrade,
    version: 1,
    purpose: planData.plan.purpose,
    items: slots.map(function (slot, index) {
      return {
        itemId: `qst-bnk-${String(index + 1).padStart(16, "0")}`,
        skillId: `grade6:${slot.clusterId.toLowerCase().replace(/\./g, "-")}:slot-${index + 1}`,
        domainId: slot.domainId,
        maxPoints: slot.maxPoints,
        responseType: slot.responseType,
        difficulty: slot.difficulty,
        scoringMode: slot.scoringMode,
        reviewState: "approved"
      };
    })
  };
  assert.equal(engine.validateBlueprint(hypotheticalApprovedProjection), true);
});

test("slot order interleaves domain, difficulty, and response type", function () {
  ["domainId", "difficulty", "responseType"].forEach(function (field) {
    const values = planData.plan.slots.map(function (slot) { return slot[field]; });
    let longestRun = 1;
    let currentRun = 1;
    for (let index = 1; index < values.length; index += 1) {
      currentRun = values[index] === values[index - 1] ? currentRun + 1 : 1;
      longestRun = Math.max(longestRun, currentRun);
    }
    const maximum = field === "domainId" ? 1 : 2;
    assert.ok(longestRun <= maximum, `unexpected ${field} run of ${longestRun}`);
  });
});
