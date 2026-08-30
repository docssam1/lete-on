"use strict";

const fs = require("node:fs");
const path = require("node:path");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function activeItems(index) {
  const activeIds = new Set((index.activeQuestionCandidates || []).map(item => typeof item === "string" ? item : item.id));
  const rejectedIds = new Set((index.rejectedCandidates || []).map(item => typeof item === "string" ? item : item.id));
  return activeIds.size
    ? (index.items || []).filter(item => activeIds.has(item.id))
    : (index.items || []).filter(item => item.releaseStatus === "locked" && !rejectedIds.has(item.id) && item.discoveryStatus !== "rejected");
}

function buildQueue(index, reviews) {
  if (!reviews || reviews.sourceBankId !== "HWANGSO-MIDDLE" || !Array.isArray(reviews.reviews)) throw new Error("황소 세부 검수표를 확인해 주세요.");
  const activeById = new Map(activeItems(index).map(item => [item.id, item]));
  const seen = new Set();
  const jobs = [];
  const locatorRebuilds = [];
  reviews.reviews.forEach(review => {
    if (seen.has(review.sourceItemId)) throw new Error(`황소 검수 문항 ID가 중복됩니다: ${review.sourceItemId}`);
    seen.add(review.sourceItemId);
    const item = activeById.get(review.sourceItemId);
    if (!item) throw new Error(`황소 활성 문항을 찾을 수 없습니다: ${review.sourceItemId}`);
    if (review.detailPrecision !== "unit_only") return;
    const pending = {
      sourceItemId: review.sourceItemId,
      sourceMemoryId: review.sourceMemoryId,
      sourceRef: review.sourceRef,
      semester: review.semester,
      majorUnit: review.majorUnit,
      minorUnit: review.minorUnit,
      locator: {
        page: item.locator && item.locator.page,
        slot: item.locator && item.locator.slot,
        kind: item.locator && item.locator.kind,
        box: item.locator && item.locator.box
      },
      status: "detail_review_pending"
    };
    if (review.detailReviewStatus === "locator_rebuild_required") {
      locatorRebuilds.push({
        ...pending,
        status: "locator_rebuild_required",
        reason: review.detailReviewReason,
        evidenceLocator: review.detailReviewEvidence
      });
      return;
    }
    jobs.push(pending);
  });
  if (seen.size !== activeById.size) throw new Error("황소 세부 검수표와 활성 문항 수가 다릅니다.");
  jobs.sort((left, right) => left.sourceMemoryId.localeCompare(right.sourceMemoryId) || left.locator.page - right.locator.page || left.locator.slot - right.locator.slot || left.sourceItemId.localeCompare(right.sourceItemId));
  locatorRebuilds.sort((left, right) => left.sourceMemoryId.localeCompare(right.sourceMemoryId) || left.locator.page - right.locator.page || left.locator.slot - right.locator.slot || left.sourceItemId.localeCompare(right.sourceItemId));
  const sources = Array.from(new Set(jobs.map(job => job.sourceMemoryId))).sort().map(sourceMemoryId => {
    const sourceJobs = jobs.filter(job => job.sourceMemoryId === sourceMemoryId);
    return {
      sourceMemoryId,
      itemCount: sourceJobs.length,
      pageCount: new Set(sourceJobs.map(job => job.locator.page)).size,
      jobs: sourceJobs
    };
  });
  return {
    schemaVersion: 1,
    sourceBankId: "HWANGSO-MIDDLE",
    status: jobs.length || locatorRebuilds.length ? "work_remaining" : "complete",
    sources,
    locatorRebuilds,
    summary: {
      activeItemCount: activeById.size,
      reviewedDetailItemCount: reviews.reviews.filter(review => review.detailPrecision === "verified").length,
      pendingDetailItemCount: jobs.length,
      locatorRebuildItemCount: locatorRebuilds.length,
      quarantinedItemCount: reviews.reviews.filter(review => review.detailPrecision === "pending").length,
      sourceCount: sources.length,
      pageCount: new Set(jobs.map(job => `${job.sourceMemoryId}:${job.locator.page}`)).size
    }
  };
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node build-hwangso-detail-work-queue.cjs <황소인덱스.json> <세부검수표.json> <출력.json>");
  const output = buildQueue(readJson(args[0]), readJson(args[1]));
  fs.mkdirSync(path.dirname(path.resolve(args[2])), { recursive: true });
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ activeItems, buildQueue });
