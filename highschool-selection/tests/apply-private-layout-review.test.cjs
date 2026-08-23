const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");
const review = require("../scripts/apply-private-layout-review.cjs");

function fixture() {
  const fingerprint = "1".repeat(64);
  const sourceRef = core.createSharedBankId("source", `sha256:${fingerprint}`);
  return {
    schemaVersion: index.INDEX_SCHEMA_VERSION,
    status: "draft",
    policy: { releaseLocked: true },
    counts: { questionCandidates: 0, excludedPageCandidates: 2, visuallyVerified: 0 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, privateSourceMemoryId: "source-one", pageCount: 5 }],
    items: [],
    excludedPageCandidates: [
      { sourceRef, privateSourceMemoryId: "source-one", page: 2, reason: "candidate", reviewStatus: "pending" },
      { sourceRef, privateSourceMemoryId: "source-one", page: 3, reason: "candidate", reviewStatus: "pending" }
    ],
    unresolvedPages: []
  };
}

test("visual review converts a false exclusion into six locked Mission items", () => {
  const result = review.applyReviews(fixture(), [{ sourceMemoryId: "source-one", page: 2, resolution: "mission" }]);
  assert.equal(result.items.length, 6);
  assert.deepEqual(result.items.map(item => item.privateRef.printedLabelHint), ["1", "2", "3", "4", "5", "6"]);
  assert.ok(result.items.every(item => item.discoveryStatus === "visual_verified"));
  assert.ok(result.items.every(item => item.releaseStatus === "locked" && item.answerStatus === "missing"));
  assert.equal(result.excludedPageCandidates.length, 1);
  assert.equal(result.counts.visuallyVerified, 6);
});

test("visual review confirms a non-question page without creating an item", () => {
  const result = review.applyReviews(fixture(), [{ sourceMemoryId: "source-one", page: 3, resolution: "exclude" }]);
  assert.equal(result.items.length, 0);
  assert.equal(result.excludedPageCandidates[1].reviewStatus, "visual_verified");
  assert.equal(result.counts.verifiedExcludedPages, 1);
});

test("visual review rejects duplicate page decisions", () => {
  assert.throws(() => review.applyReviews(fixture(), [
    { sourceMemoryId: "source-one", page: 2, resolution: "mission" },
    { sourceMemoryId: "source-one", page: 2, resolution: "exclude" }
  ]), /Duplicate decision/);
});

test("visual review resolves an unresolved six-cell Mission page", () => {
  const value = fixture();
  value.unresolvedPages.push({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "layout-anchor-not-found"
  });
  value.counts.unresolvedPages = 1;
  const result = review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 4, resolution: "mission6" }
  ]);
  assert.equal(result.items.length, 6);
  assert.equal(result.unresolvedPages.length, 0);
  assert.equal(result.counts.unresolvedPages, 0);
  assert.equal(result.visualReviewPages[0].resolution, "verified_mission_six_cell");
});

test("visual review converts an unresolved non-question page into a verified exclusion", () => {
  const value = fixture();
  value.unresolvedPages.push({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "layout-anchor-not-found"
  });
  value.counts.unresolvedPages = 1;
  const result = review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 4, resolution: "exclude" }
  ]);
  assert.equal(result.unresolvedPages.length, 0);
  assert.equal(result.excludedPageCandidates.length, 3);
  assert.equal(result.excludedPageCandidates.filter(entry => entry.reviewStatus === "visual_verified").length, 1);
});

test("visual review rejects a repeated semantic review", () => {
  const value = fixture();
  value.visualReviewPages = [{
    privateSourceMemoryId: "source-one",
    page: 2,
    resolution: "verified_mission_six_cell"
  }];
  assert.throws(() => review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 2, resolution: "mission6" }
  ]), /already visually reviewed/);
});

test("decision manifests are fingerprint-bound to the private source", () => {
  const value = fixture();
  const source = value.sources[0];
  const decisions = review.decisionsFromManifest({
    schemaVersion: 1,
    sources: [{
      privateSourceMemoryId: source.privateSourceMemoryId,
      sourceFingerprint: source.sourceFingerprint
    }],
    decisions: [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]
  }, value);
  assert.deepEqual(decisions, [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]);

  assert.throws(() => review.decisionsFromManifest({
    schemaVersion: 1,
    sources: [{ privateSourceMemoryId: "source-one", sourceFingerprint: "0".repeat(64) }],
    decisions: [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]
  }, value), /fingerprint mismatch/);
});

test("recorded decision manifests contain only bound source metadata and decisions", () => {
  const value = fixture();
  const manifest = review.createDecisionManifest(value, [
    { sourceMemoryId: "source-one", page: 3, resolution: "exclude" },
    { sourceMemoryId: "source-one", page: 2, resolution: "mission" }
  ]);
  assert.deepEqual(manifest.sources, [{
    privateSourceMemoryId: "source-one",
    sourceFingerprint: value.sources[0].sourceFingerprint
  }]);
  assert.deepEqual(manifest.decisions.map(entry => [entry.page, entry.resolution]), [
    [2, "mission6"],
    [3, "exclude"]
  ]);
  assert.equal(JSON.stringify(manifest).includes("prompt"), false);
});

test("Mission replacement preserves spurious IDs as rejected and appends six new slots", () => {
  const value = fixture();
  const source = value.sources[0];
  const old = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(source.sourceFingerprint, 4, 1)),
    sourceRef: source.sourceRef,
    locator: { page: 4, slot: 1, kind: "exercise", box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } },
    discoveryStatus: "layout_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: core.PROGRAM_MODES,
    releaseStatus: "locked"
  });
  value.items.push({ ...old, privateRef: { sourceMemoryId: "source-one", printedLabelHint: "9" } });
  value.counts.questionCandidates = 1;
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "partial-layout-coverage"
  });
  const result = review.applyReviews(value, [{
    sourceMemoryId: "source-one",
    page: 4,
    resolution: "mission6_replace_candidates"
  }]);

  assert.equal(result.items[0].id, old.id);
  assert.equal(result.rejectedCandidates[0].id, old.id);
  assert.equal(result.items.length, 7);
  assert.deepEqual(result.items.slice(1).map(item => item.locator.slot), [2, 3, 4, 5, 6, 7]);
  assert.equal(result.counts.questionCandidates, 7);
  assert.equal(result.counts.rejectedCandidates, 1);
  assert.equal(result.counts.activeQuestionCandidates, 6);
  assert.equal(result.unresolvedPages.length, 0);
});

test("fingerprint-bound manifests can apply exact variable Mission anchors", () => {
  const value = fixture();
  const source = value.sources[0];
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "layout-anchor-not-found"
  });
  const anchors = [
    { printedLabelHint: "1", layoutOrder: 1, box: { x: 0.04, y: 0.18, width: 0.44, height: 0.34 } },
    { printedLabelHint: "2", layoutOrder: 2, box: { x: 0.04, y: 0.52, width: 0.44, height: 0.42 } },
    { printedLabelHint: "3", layoutOrder: 3, box: { x: 0.52, y: 0.18, width: 0.44, height: 0.34 } },
    { printedLabelHint: "4", layoutOrder: 4, box: { x: 0.52, y: 0.52, width: 0.44, height: 0.42 } }
  ];
  const decisions = review.decisionsFromManifest({
    schemaVersion: 1,
    sources: [{
      privateSourceMemoryId: source.privateSourceMemoryId,
      sourceFingerprint: source.sourceFingerprint
    }],
    decisions: [{ sourceMemoryId: "source-one", page: 4, resolution: "mission_variable", anchors }]
  }, value);
  const result = review.applyReviews(value, decisions);
  assert.equal(result.items.length, 4);
  assert.deepEqual(result.items.map(item => item.privateRef.printedLabelHint), ["1", "2", "3", "4"]);
  assert.equal(result.visualReviewPages[0].itemCount, 4);
  assert.equal(result.visualReviewPages[0].resolution, "verified_mission_variable_cell");
});

test("variable Mission anchors reject overlap and non-sequential labels", () => {
  assert.throws(() => review.normalizedMissionAnchors([
    { printedLabelHint: "1", layoutOrder: 1, box: { x: 0.1, y: 0.1, width: 0.5, height: 0.5 } },
    { printedLabelHint: "2", layoutOrder: 2, box: { x: 0.4, y: 0.4, width: 0.5, height: 0.5 } },
    { printedLabelHint: "3", layoutOrder: 3, box: { x: 0.1, y: 0.7, width: 0.2, height: 0.2 } }
  ]), /must not overlap/);
  assert.throws(() => review.normalizedMissionAnchors([
    { printedLabelHint: "1", layoutOrder: 1, box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } },
    { printedLabelHint: "3", layoutOrder: 2, box: { x: 0.4, y: 0.1, width: 0.2, height: 0.2 } },
    { printedLabelHint: "2", layoutOrder: 3, box: { x: 0.7, y: 0.1, width: 0.2, height: 0.2 } }
  ]), /sequential labels/);
});

test("variable Mission anchors require three to five positive-area boxes", () => {
  const anchor = number => ({
    printedLabelHint: String(number),
    layoutOrder: number,
    box: { x: 0.05 + (number - 1) * 0.2, y: 0.1, width: 0.15, height: 0.2 }
  });
  assert.throws(() => review.normalizedMissionAnchors([anchor(1), anchor(2)]), /three to five/);
  assert.throws(() => review.normalizedMissionAnchors([
    anchor(1), anchor(2), anchor(3), anchor(4), anchor(5), anchor(6)
  ]), /three to five/);
  const missing = anchor(1);
  delete missing.box;
  assert.throws(() => review.normalizedMissionAnchors([missing, anchor(2), anchor(3)]), /exact reviewed boxes/);
  const zero = anchor(1);
  zero.box.width = 0;
  assert.throws(() => review.normalizedMissionAnchors([zero, anchor(2), anchor(3)]), /positive area/);
});

test("manual item reviews preserve arbitrary labels and link continuations without new fragment IDs", () => {
  const value = fixture();
  const source = value.sources[0];
  value.unresolvedPages.push(
    { sourceRef: source.sourceRef, privateSourceMemoryId: "source-one", page: 4, reason: "layout-anchor-not-found" },
    { sourceRef: source.sourceRef, privateSourceMemoryId: "source-one", page: 5, reason: "layout-anchor-not-found" }
  );
  const result = review.applyReviews(value, [
    {
      sourceMemoryId: "source-one",
      page: 4,
      resolution: "manual_items",
      anchors: [{
        kind: "exercise",
        printedLabelHint: "42",
        layoutOrder: 1,
        box: { x: 0.07, y: 0.08, width: 0.84, height: 0.8 }
      }]
    },
    {
      sourceMemoryId: "source-one",
      page: 5,
      resolution: "manual_items",
      anchors: [{
        kind: "example",
        printedLabelHint: "예제 43-1",
        layoutOrder: 1,
        box: { x: 0.52, y: 0.08, width: 0.39, height: 0.7 }
      }],
      continuations: [{
        fragmentPage: 5,
        printedLabelHint: "42 (2)-(3)",
        continuationFrom: { page: 4, printedLabelHint: "42" }
      }]
    }
  ]);
  assert.deepEqual(result.items.map(item => item.privateRef.printedLabelHint), ["42", "예제 43-1"]);
  assert.equal(result.items.length, 2);
  assert.equal(result.continuationFragments.length, 1);
  assert.equal(result.visualReviewPages[1].continuationKeys.length, 1);
  assert.equal(result.counts.manualVerified, 2);
  assert.equal(result.counts.continuationFragments, 1);
  assert.equal(result.unresolvedPages.length, 0);
});

test("manual item continuations fail atomically when their starting item is absent", () => {
  const value = fixture();
  const source = value.sources[0];
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 5,
    reason: "layout-anchor-not-found"
  });
  assert.throws(() => review.applyReviews(value, [{
    sourceMemoryId: "source-one",
    page: 5,
    resolution: "manual_items",
    anchors: [{
      kind: "exercise",
      printedLabelHint: "43",
      layoutOrder: 1,
      box: { x: 0.52, y: 0.08, width: 0.39, height: 0.7 }
    }],
    continuations: [{
      fragmentPage: 5,
      printedLabelHint: "42 (2)-(3)",
      continuationFrom: { page: 4, printedLabelHint: "42" }
    }]
  }]), /link one exact starting item/);
  assert.equal(value.items.length, 0);
  assert.equal(value.unresolvedPages.length, 1);
});

test("manual item continuations reject an unverified layout candidate target", () => {
  const value = fixture();
  const source = value.sources[0];
  const candidate = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(source.sourceFingerprint, 4, 1)),
    sourceRef: source.sourceRef,
    locator: { page: 4, slot: 1, kind: "exercise", box: { x: 0.07, y: 0.08, width: 0.84, height: 0.8 } },
    discoveryStatus: "layout_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: core.PROGRAM_MODES,
    releaseStatus: "locked"
  });
  value.items.push({
    ...candidate,
    privateRef: {
      sourceMemoryId: "source-one",
      printedLabelHint: "42",
      discoveryConfidence: "candidate_only"
    }
  });
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 5,
    reason: "layout-anchor-not-found"
  });
  assert.throws(() => review.applyReviews(value, [{
    sourceMemoryId: "source-one",
    page: 5,
    resolution: "manual_items",
    anchors: [],
    continuations: [{
      fragmentPage: 5,
      printedLabelHint: "42 (2)-(3)",
      continuationFrom: { page: 4, printedLabelHint: "42" }
    }]
  }]), /visually verified starting item/);
});

test("manual item continuations reject a self-marked visual target without a bound review", () => {
  const value = fixture();
  const source = value.sources[0];
  const candidate = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(source.sourceFingerprint, 4, 1)),
    sourceRef: source.sourceRef,
    locator: { page: 4, slot: 1, kind: "exercise", box: { x: 0.07, y: 0.08, width: 0.84, height: 0.8 } },
    discoveryStatus: "visual_verified",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: core.PROGRAM_MODES,
    releaseStatus: "locked"
  });
  value.items.push({
    ...candidate,
    privateRef: {
      sourceMemoryId: "source-one",
      printedLabelHint: "42",
      discoveryConfidence: "visual_verified",
      evidenceLocator: "PDF p.4, item 42"
    }
  });
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 5,
    reason: "layout-anchor-not-found"
  });
  assert.throws(() => review.applyReviews(value, [{
    sourceMemoryId: "source-one",
    page: 5,
    resolution: "manual_items",
    anchors: [],
    continuations: [{
      fragmentPage: 5,
      printedLabelHint: "42 (2)-(3)",
      continuationFrom: { page: 4, printedLabelHint: "42" }
    }]
  }]), /review-bound starting item/);
});

test("manual item anchors reject unsafe kinds, duplicate labels, overlap, and invalid continuation pages", () => {
  const anchor = (label, order, x, kind = "exercise") => ({
    kind,
    printedLabelHint: label,
    layoutOrder: order,
    box: { x, y: 0.1, width: 0.3, height: 0.3 }
  });
  assert.throws(() => review.normalizedManualAnchors([
    anchor("1", 1, 0.1, "mission")
  ]), /kind is not allowed/);
  assert.throws(() => review.normalizedManualAnchors([
    anchor("1", 1, 0.05), anchor("1", 2, 0.55)
  ]), /duplicate manual_items label/);
  assert.throws(() => review.normalizedManualAnchors([
    anchor("1", 1, 0.1), anchor("2", 2, 0.2)
  ]), /must not overlap/);
  assert.throws(() => review.normalizedContinuations([{
    fragmentPage: 5,
    printedLabelHint: "2 (1)-(2)",
    continuationFrom: { page: 4, printedLabelHint: "2" }
  }], 4), /fragment must be on the reviewed page/);
  assert.throws(() => review.normalizedManualAnchors([
    anchor("정답 42", 1, 0.1)
  ]), /reviewed label grammar/);
  assert.throws(() => review.normalizedManualAnchors([
    anchor("이 문항은 반드시 시각 검수", 1, 0.1)
  ]), /reviewed label grammar/);
  assert.deepEqual(
    review.normalizedManualAnchors([
      anchor("42", 1, 0.05), anchor("개념탐구 7", 2, 0.37), anchor("예제 7-1", 3, 0.69)
    ]).map(entry => entry.printedLabelHint),
    ["42", "개념탐구 7", "예제 7-1"]
  );
  assert.equal(review.normalizedContinuations([{
    fragmentPage: 5,
    printedLabelHint: "42 (2)-(3)",
    continuationFrom: { page: 4, printedLabelHint: "42" }
  }], 5)[0].printedLabelHint, "42 (2)-(3)");
});

test("manual item and continuation labels must be disjoint in normalized and direct decisions", () => {
  const decision = {
    sourceMemoryId: "source-one",
    page: 5,
    resolution: "manual_items",
    anchors: [{
      kind: "exercise",
      printedLabelHint: "42",
      layoutOrder: 1,
      box: { x: 0.07, y: 0.08, width: 0.84, height: 0.8 }
    }],
    continuations: [{
      fragmentPage: 5,
      printedLabelHint: "42",
      continuationFrom: { page: 4, printedLabelHint: "41" }
    }]
  };
  assert.throws(() => review.normalizeDecisionRecord(decision), /must be disjoint/);

  const value = fixture();
  value.unresolvedPages.push({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "source-one",
    page: 5,
    reason: "layout-anchor-not-found"
  });
  assert.throws(() => review.applyReviews(value, [decision]), /must be disjoint/);
  assert.equal(value.unresolvedPages.length, 1);
});
