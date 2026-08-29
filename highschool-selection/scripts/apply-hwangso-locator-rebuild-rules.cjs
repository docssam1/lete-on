"use strict";

const fs = require("node:fs");
const path = require("node:path");
const layoutReview = require("./apply-private-layout-review.cjs");

const SAFE_RULE_KEYS = new Set(["schemaVersion", "sourceMemoryId", "title", "pageRules"]);
const SAFE_PAGE_KEYS = new Set(["page", "decision", "reason", "anchors"]);
const SAFE_ANCHOR_KEYS = new Set([
  "kind", "printedLabelHint", "layoutOrder", "box", "detailType", "solutionArchetype"
]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fail(message) {
  throw new Error(message);
}

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  const unknown = Object.keys(value).filter(key => !allowed.has(key));
  if (unknown.length) fail(`${label} has unsafe keys: ${unknown.join(", ")}`);
}

function validateRulePacket(packet) {
  exactKeys(packet, SAFE_RULE_KEYS, "locator rebuild rule packet");
  if (packet.schemaVersion !== 1 || !/^[a-z0-9-]+$/.test(clean(packet.sourceMemoryId)) ||
      !clean(packet.title) || !Array.isArray(packet.pageRules) || !packet.pageRules.length) {
    fail("locator rebuild rule packet shape is invalid");
  }
  const pages = new Set();
  packet.pageRules.forEach((rule, ruleIndex) => {
    exactKeys(rule, SAFE_PAGE_KEYS, `page rule ${ruleIndex + 1}`);
    if (!Number.isSafeInteger(rule.page) || rule.page < 1 || !new Set(["replace", "defer"]).has(rule.decision)) {
      fail(`page rule ${ruleIndex + 1} is invalid`);
    }
    if (pages.has(rule.page)) fail(`duplicate page rule: ${packet.sourceMemoryId}:${rule.page}`);
    pages.add(rule.page);
    if (rule.decision === "defer") {
      if (!clean(rule.reason) || rule.anchors != null) fail(`deferred page rule requires only a reason: ${rule.page}`);
      return;
    }
    if (rule.reason != null || !Array.isArray(rule.anchors) || !rule.anchors.length) {
      fail(`replacement page rule requires anchors: ${rule.page}`);
    }
    rule.anchors.forEach((anchor, anchorIndex) => {
      exactKeys(anchor, SAFE_ANCHOR_KEYS, `page ${rule.page} anchor ${anchorIndex + 1}`);
      if (!clean(anchor.detailType) || !clean(anchor.solutionArchetype) ||
          clean(anchor.detailType).length > 120 || clean(anchor.solutionArchetype).length > 240) {
        fail(`page ${rule.page} anchor ${anchorIndex + 1} needs a concise verified classification`);
      }
    });
    layoutReview.normalizedManualAnchors(rule.anchors.map(anchor => ({
      kind: anchor.kind,
      printedLabelHint: anchor.printedLabelHint,
      layoutOrder: anchor.layoutOrder,
      box: anchor.box
    })));
  });
  return packet;
}

function activePageItems(index, source, page) {
  const rejected = new Set((index.rejectedCandidates || []).map(item => typeof item === "string" ? item : item.id));
  return (index.items || []).filter(item =>
    item.sourceRef === source.sourceRef && item.locator && item.locator.page === page &&
    item.releaseStatus === "locked" && item.discoveryStatus !== "rejected" && !rejected.has(item.id)
  ).sort((left, right) => left.locator.slot - right.locator.slot);
}

function buildOutputs(baseIndex, rebuildQueue, rulePackets) {
  if (!baseIndex || baseIndex.status !== "draft" || !baseIndex.policy || baseIndex.policy.releaseLocked !== true) {
    fail("황소 비공개 문항 인덱스를 확인해 주세요.");
  }
  if (!rebuildQueue || rebuildQueue.sourceBankId !== "HWANGSO-MIDDLE" || !Array.isArray(rebuildQueue.groups)) {
    fail("황소 위치 재작업 대기열을 확인해 주세요.");
  }
  const packetGroups = new Map();
  rulePackets.map(validateRulePacket).forEach(packet => {
    const existing = packetGroups.get(packet.sourceMemoryId);
    if (existing && existing.title !== packet.title) {
      fail(`같은 황소 원본의 규칙 제목이 다릅니다: ${packet.sourceMemoryId}`);
    }
    if (existing) existing.pageRules.push(...packet.pageRules);
    else packetGroups.set(packet.sourceMemoryId, {
      schemaVersion: 1,
      sourceMemoryId: packet.sourceMemoryId,
      title: packet.title,
      pageRules: [...packet.pageRules]
    });
  });
  const packets = Array.from(packetGroups.values())
    .map(packet => ({
      ...packet,
      pageRules: [...packet.pageRules].sort((left, right) => left.page - right.page)
    }))
    .sort((left, right) => left.sourceMemoryId.localeCompare(right.sourceMemoryId));
  const prepared = JSON.parse(JSON.stringify(baseIndex));
  if (!Array.isArray(prepared.unresolvedPages)) prepared.unresolvedPages = [];
  const decisions = [];
  const pageMetadata = [];
  const seenPages = new Set();

  packets.forEach(packet => {
    const source = (prepared.sources || []).find(entry => entry.privateSourceMemoryId === packet.sourceMemoryId);
    if (!source) fail(`황소 원본 자료를 찾을 수 없습니다: ${packet.sourceMemoryId}`);
    packet.pageRules.forEach(rule => {
      const pageKey = `${packet.sourceMemoryId}:${rule.page}`;
      if (seenPages.has(pageKey)) fail(`황소 위치 재작업 페이지가 중복됩니다: ${pageKey}`);
      seenPages.add(pageKey);
      const group = rebuildQueue.groups.find(entry =>
        entry.sourceMemoryId === packet.sourceMemoryId && entry.page === rule.page
      );
      if (!group) fail(`황소 위치 재작업 대기열에 없는 페이지입니다: ${pageKey}`);
      if (rule.decision === "defer") return;
      const oldItems = activePageItems(prepared, source, rule.page);
      if (!oldItems.length) fail(`교체할 황소 후보가 없습니다: ${pageKey}`);
      if (oldItems.some(item => !new Set(["layout_candidate", "ocr_candidate"]).has(item.discoveryStatus) ||
          item.classificationStatus !== "pending" || item.answerStatus !== "missing")) {
        fail(`이미 검수된 문항이 섞인 페이지는 자동 교체할 수 없습니다: ${pageKey}`);
      }
      const oldIds = new Set(oldItems.map(item => item.id));
      const missingQueueIds = (group.candidates || []).map(candidate => candidate.sourceItemId).filter(id => !oldIds.has(id));
      if (missingQueueIds.length) fail(`위치 재작업 후보가 현재 페이지와 다릅니다: ${pageKey}`);
      if ((prepared.visualReviewPages || []).some(entry =>
        entry.privateSourceMemoryId === packet.sourceMemoryId && entry.page === rule.page
      )) fail(`이미 시각 검수된 페이지는 다시 교체할 수 없습니다: ${pageKey}`);
      if (!(prepared.unresolvedPages || []).some(entry =>
        entry.privateSourceMemoryId === packet.sourceMemoryId && entry.page === rule.page
      )) {
        prepared.unresolvedPages.push({
          sourceRef: source.sourceRef,
          privateSourceMemoryId: packet.sourceMemoryId,
          page: rule.page,
          reason: "detail-review-locator-rebuild",
          reviewStatus: "pending"
        });
      }
      decisions.push({
        sourceMemoryId: packet.sourceMemoryId,
        page: rule.page,
        resolution: "manual_items_replace_candidates",
        anchors: rule.anchors.map(anchor => ({
          kind: anchor.kind,
          printedLabelHint: anchor.printedLabelHint,
          layoutOrder: anchor.layoutOrder,
          box: anchor.box
        })),
        continuations: []
      });
      pageMetadata.push({ packet, rule, oldItemIds: oldItems.map(item => item.id) });
    });
  });

  prepared.counts = { ...(prepared.counts || {}), unresolvedPages: prepared.unresolvedPages.length };
  if (!decisions.length) fail("적용할 황소 위치 재작업 결정이 없습니다.");
  const decisionManifest = layoutReview.createDecisionManifest(prepared, decisions);
  const index = layoutReview.applyReviews(prepared, decisions);
  const packetSources = new Map();

  pageMetadata.forEach(({ packet, rule }) => {
    const reviewPage = (index.visualReviewPages || []).find(entry =>
      entry.privateSourceMemoryId === packet.sourceMemoryId && entry.page === rule.page &&
      entry.resolution === "verified_manual_items_replacing_candidates"
    );
    if (!reviewPage || !Array.isArray(reviewPage.itemIds) || reviewPage.itemIds.length !== rule.anchors.length) {
      fail(`새 황소 문항 ID를 확인할 수 없습니다: ${packet.sourceMemoryId}:${rule.page}`);
    }
    if (!packetSources.has(packet.sourceMemoryId)) {
      packetSources.set(packet.sourceMemoryId, {
        sourceMemoryId: packet.sourceMemoryId,
        title: packet.title,
        itemReviews: []
      });
    }
    const sourceOutput = packetSources.get(packet.sourceMemoryId);
    rule.anchors.forEach((anchor, indexAt) => {
      sourceOutput.itemReviews.push({
        sourceItemId: reviewPage.itemIds[indexAt],
        detailType: clean(anchor.detailType),
        solutionArchetype: clean(anchor.solutionArchetype),
        classificationStatus: "reviewed_detail",
        detailPrecision: "verified",
        evidenceLocator: `PDF p.${rule.page}, item ${clean(anchor.printedLabelHint)}`,
        note: "원본 PDF에서 독립 문항 경계와 세부유형을 직접 확인"
      });
    });
  });

  const detailPacket = {
    schemaVersion: 1,
    sources: Array.from(packetSources.values()).sort((left, right) => left.sourceMemoryId.localeCompare(right.sourceMemoryId)),
    // A deferred page has no trustworthy one-question ID yet. It stays in the
    // locator queue and must not be disguised as an item-level detail deferral.
    deferred: []
  };
  return { index, decisionManifest, detailPacket };
}

function getArg(args, name) {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : null;
}

function getArgs(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function writeJson(filePath, value) {
  const resolved = path.resolve(filePath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main(args) {
  const indexPath = getArg(args, "--index");
  const queuePath = getArg(args, "--queue");
  const rulePaths = getArgs(args, "--rules");
  const outputIndex = getArg(args, "--output-index");
  const outputPacket = getArg(args, "--output-packet");
  const outputManifest = getArg(args, "--output-manifest");
  if (!indexPath || !queuePath || !rulePaths.length || !outputIndex || !outputPacket || !outputManifest) {
    fail("사용법: node apply-hwangso-locator-rebuild-rules.cjs --index <인덱스> --queue <대기열> --rules <검수규칙> [--rules ...] --output-index <새인덱스> --output-packet <세부검수묶음> --output-manifest <결정기록>");
  }
  const output = buildOutputs(readJson(indexPath), readJson(queuePath), rulePaths.map(readJson));
  writeJson(outputIndex, output.index);
  writeJson(outputPacket, output.detailPacket);
  writeJson(outputManifest, output.decisionManifest);
  process.stdout.write(`${JSON.stringify({
    activeQuestionCandidates: output.index.counts.activeQuestionCandidates,
    replacedPageCount: output.decisionManifest.decisions.length,
    reviewedItemCount: output.detailPacket.sources.reduce((sum, source) => sum + source.itemReviews.length, 0)
  })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  SAFE_RULE_KEYS,
  SAFE_PAGE_KEYS,
  SAFE_ANCHOR_KEYS,
  validateRulePacket,
  activePageItems,
  buildOutputs
});
