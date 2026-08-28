"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { TASK_NAMES, TASK_STATUSES } = require("./build-dolpa-work-ledger.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function normalizeReview(review) {
  if (!review || typeof review !== "object") throw new Error("검수 기록이 필요합니다.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(String(review.sourceId || ""))) throw new Error(`원본 ID를 확인해 주세요: ${review.sourceId}`);
  const evidenceId = String(review.evidenceId || "").trim();
  if (!evidenceId) throw new Error(`${review.sourceId} 검수 근거 ID가 필요합니다.`);
  const tasks = {};
  Object.entries(review.tasks || {}).forEach(([name, statusValue]) => {
    if (!TASK_NAMES.includes(name) || name === "pdfAudit") throw new Error(`직접 기록할 수 없는 작업입니다: ${name}`);
    const status = typeof statusValue === "string" ? statusValue : statusValue.status;
    if (!TASK_STATUSES.includes(status) || status === "pending") throw new Error(`검수 상태를 확인해 주세요: ${name}/${status}`);
    tasks[name] = {
      status,
      evidence: [evidenceId],
      note: review.note == null ? null : String(review.note)
    };
  });
  if (!Object.keys(tasks).length) throw new Error(`${review.sourceId}에 기록할 작업이 없습니다.`);
  return { sourceId: review.sourceId, tasks };
}

function merge(decisions, manifest) {
  if (decisions.schemaVersion !== 1) throw new Error("검수 결정 파일 버전을 확인해 주세요.");
  const reviews = Array.isArray(manifest.reviews) ? manifest.reviews : [manifest];
  decisions.sourceReviews = decisions.sourceReviews || [];
  reviews.map(normalizeReview).forEach(review => {
    let target = decisions.sourceReviews.find(item => item.sourceId === review.sourceId);
    if (!target) {
      target = { sourceId: review.sourceId, tasks: {} };
      decisions.sourceReviews.push(target);
    }
    Object.entries(review.tasks).forEach(([name, value]) => {
      const previous = target.tasks[name];
      if (previous && previous.status === "verified" && value.status !== "verified") {
        throw new Error(`확정 검수를 낮은 상태로 되돌릴 수 없습니다: ${review.sourceId}/${name}`);
      }
      target.tasks[name] = value;
    });
  });
  decisions.sourceReviews.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
  return decisions;
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node record-dolpa-review.cjs <review-decisions> <review-manifest>");
  const decisionsPath = path.resolve(args[0]);
  const merged = merge(readJson(decisionsPath), readJson(args[1]));
  const temporaryPath = `${decisionsPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, decisionsPath);
  process.stdout.write(`${JSON.stringify({ sourceReviews: merged.sourceReviews.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalizeReview, merge });
