"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const itemIndex = require("../data/question-item-index.js");
const builder = require("../scripts/apply-hwangso-locator-rebuild-rules.cjs");

function fixture() {
  const fingerprint = "3".repeat(64);
  const sourceRef = core.createSharedBankId("source", `sha256:${fingerprint}`);
  const oldItem = itemIndex.createItemIndexEntry({
    id: core.createSharedBankId("question", itemIndex.createLocatorKey(fingerprint, 4, 1)),
    sourceRef,
    locator: { page: 4, slot: 1, kind: "example", box: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 } },
    discoveryStatus: "ocr_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: core.PROGRAM_MODES,
    releaseStatus: "locked"
  });
  const index = {
    schemaVersion: itemIndex.INDEX_SCHEMA_VERSION,
    status: "draft",
    policy: { releaseLocked: true },
    counts: { questionCandidates: 1, activeQuestionCandidates: 1, rejectedCandidates: 0, unresolvedPages: 0 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, privateSourceMemoryId: "source-one", pageCount: 8 }],
    items: [{ ...oldItem, privateRef: { sourceMemoryId: "source-one", printedLabelHint: "4-99" } }],
    unresolvedPages: [],
    layoutPages: [],
    excludedPageCandidates: [],
    visualReviewPages: [],
    rejectedCandidates: [],
    continuationFragments: []
  };
  const queue = {
    schemaVersion: 1,
    sourceBankId: "HWANGSO-MIDDLE",
    groups: [{ sourceMemoryId: "source-one", sourceRef, page: 4, candidates: [{ sourceItemId: oldItem.id }] }]
  };
  const rules = {
    schemaVersion: 1,
    sourceMemoryId: "source-one",
    title: "교재",
    pageRules: [{
      page: 4,
      decision: "replace",
      anchors: [
        {
          kind: "concept", printedLabelHint: "개념탐구 3-(1)", layoutOrder: 1,
          box: { x: 0.1, y: 0.1, width: 0.8, height: 0.3 },
          detailType: "조건을 식으로 나타내기", solutionArchetype: "조건을 식으로 바꾸어 확인한다."
        },
        {
          kind: "example", printedLabelHint: "예제 3-1", layoutOrder: 2,
          box: { x: 0.1, y: 0.5, width: 0.8, height: 0.3 },
          detailType: "식의 값 구하기", solutionArchetype: "주어진 값을 식에 대입해 계산한다."
        }
      ]
    }]
  };
  return { index, queue, rules, oldItem };
}

test("잘못 합쳐진 후보를 격리하고 새 독립 문항과 세부 검수 묶음을 만든다", () => {
  const value = fixture();
  const output = builder.buildOutputs(value.index, value.queue, [value.rules]);
  assert.equal(output.index.rejectedCandidates.some(item => item.id === value.oldItem.id), true);
  assert.equal(output.index.counts.activeQuestionCandidates, 2);
  assert.equal(output.index.unresolvedPages.length, 0);
  assert.equal(output.detailPacket.sources[0].itemReviews.length, 2);
  assert.deepEqual(output.detailPacket.sources[0].itemReviews.map(item => item.sourceItemId),
    output.index.visualReviewPages[0].itemIds);
  assert.equal(JSON.stringify(output.detailPacket).includes("answer"), false);
  assert.equal(output.decisionManifest.sources[0].sourceFingerprint, "3".repeat(64));
});

test("대기열 밖 페이지와 이미 검수된 문항이 섞인 페이지는 자동 교체하지 않는다", () => {
  const outside = fixture();
  outside.rules.pageRules[0].page = 5;
  assert.throws(() => builder.buildOutputs(outside.index, outside.queue, [outside.rules]), /대기열에 없는 페이지/);

  const reviewed = fixture();
  reviewed.index.items[0].discoveryStatus = "visual_verified";
  assert.throws(() => builder.buildOutputs(reviewed.index, reviewed.queue, [reviewed.rules]), /이미 검수된 문항/);
});

test("규칙 파일은 정답·원문·경로 같은 금지 필드를 받지 않는다", () => {
  const value = fixture();
  value.rules.pageRules[0].anchors[0].answer = "1";
  assert.throws(() => builder.buildOutputs(value.index, value.queue, [value.rules]), /unsafe keys/);
});
