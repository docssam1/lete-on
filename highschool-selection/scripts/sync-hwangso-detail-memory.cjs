"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const DETAIL_RECORD_ID = "hwangso.middle-detail-review-progress.20260828";
const PROJECT_RECORD_ID = "question-bank.project-wide-integration.20260827";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fileMeta(filePath, rootPath, title) {
  const resolved = path.resolve(filePath);
  const stat = fs.statSync(resolved, { bigint: true });
  const relative = path.relative(path.resolve(rootPath), resolved).split(path.sep).join("/");
  if (relative.startsWith("../")) throw new Error(`메모리 루트 밖의 파일은 등록할 수 없습니다: ${resolved}`);
  return {
    id: path.basename(resolved, path.extname(resolved)),
    title,
    path: relative,
    kind: "json",
    sensitivity: "private",
    sha256: crypto.createHash("sha256").update(fs.readFileSync(resolved)).digest("hex"),
    size: Number(stat.size),
    mtime_ns: Number(stat.mtimeNs)
  };
}

function upsertById(items, value) {
  const index = items.findIndex(item => item.id === value.id);
  if (index === -1) items.push(value);
  else items[index] = value;
}

function upsertPointer(pointers, pointer) {
  const index = pointers.findIndex(item => item.source_id === pointer.source_id);
  if (index === -1) pointers.push(pointer);
  else pointers[index] = pointer;
}

function packetTitle(packetPath) {
  const match = path.basename(packetPath).match(/packet-([a-z]\d+)-v\d+\.json$/i);
  const batch = match ? match[1].toUpperCase() : "추가 묶음";
  return `황소수학 중2-1 세부유형 시각 검수 ${batch}`;
}

function projectVersion(filePath) {
  const match = path.basename(filePath).match(/-v(\d+)\.json$/i);
  return match ? match[1] : "현재";
}

function syncCatalog(catalog, files, loaded) {
  if (!catalog || !Array.isArray(catalog.sources) || !Array.isArray(catalog.records) || !catalog.root) throw new Error("source-memory 구조를 확인해 주세요.");
  const today = new Date().toISOString().slice(0, 10);
  const packetId = path.basename(files.packet, path.extname(files.packet));
  const combinedId = path.basename(files.combined, path.extname(files.combined));
  const queueId = path.basename(files.queue, path.extname(files.queue));
  const projectIndexId = path.basename(files.projectIndex, path.extname(files.projectIndex));
  const projectReviewedId = path.basename(files.projectReviewed, path.extname(files.projectReviewed));
  const resolutionsId = path.basename(files.resolutions, path.extname(files.resolutions));

  [
    fileMeta(files.packet, catalog.root, packetTitle(files.packet)),
    fileMeta(files.combined, catalog.root, `황소 중등 세부유형 통합 검수 v${projectVersion(files.combined)}`),
    fileMeta(files.queue, catalog.root, `황소 중등 세부유형 남은 작업 대기열 v${projectVersion(files.queue)}`),
    fileMeta(files.projectIndex, catalog.root, `프로젝트 공통 문항 인덱스 v${projectVersion(files.projectIndex)}`),
    fileMeta(files.projectReviewed, catalog.root, `프로젝트 공통 문항 인덱스 검수본 v${projectVersion(files.projectReviewed)}`),
    fileMeta(files.resolutions, catalog.root, "프로젝트 공통 유형 후보 ID 고정 검수표")
  ].forEach(source => upsertById(catalog.sources, source));

  const detailRecord = catalog.records.find(record => record.id === DETAIL_RECORD_ID);
  if (!detailRecord) throw new Error(`진행 기록을 찾을 수 없습니다: ${DETAIL_RECORD_ID}`);
  const combinedSummary = loaded.combined.summary;
  const queueSummary = loaded.queue.summary;
  const reviewedInPacket = loaded.packet.sources.reduce((sum, source) => sum + (source.itemReviews || []).length, 0);
  const deferredInPacket = (loaded.packet.deferred || []).length;
  const locatorRebuildItemCount = Number(queueSummary.locatorRebuildItemCount || 0);
  detailRecord.summary = `원본 PDF를 직접 확인하는 세부유형 검수 파이프라인과 중복 없는 대기열을 운영 중입니다. 활성 문항 ${combinedSummary.itemCount.toLocaleString("ko-KR")}개 중 ${combinedSummary.reviewedDetailItemCount.toLocaleString("ko-KR")}개는 세부유형과 풀이 구조까지 확인했고, ${queueSummary.pendingDetailItemCount.toLocaleString("ko-KR")}개는 단원 연결 뒤 세부 검수를 기다립니다. 잘리거나 여러 문제가 섞여 위치를 다시 만들어야 하는 문항은 ${locatorRebuildItemCount.toLocaleString("ko-KR")}개이며 일반 검수 대기열과 분리했습니다. 문제 아닌 영역 또는 모호한 후보 ${queueSummary.quarantinedItemCount.toLocaleString("ko-KR")}개는 격리 상태입니다. 이번 묶음은 ${reviewedInPacket}개를 확인했고 원문 영역을 다시 나눠야 하는 ${deferredInPacket}개를 별도 작업으로 넘겼습니다.`;
  detailRecord.updated = today;
  upsertPointer(detailRecord.pointers, { source_id: packetId, role: "audit", locator: `itemReviews 1-${reviewedInPacket}; deferred 1-${deferredInPacket}`, note: `황소 중등 원본 문항 영역 ${reviewedInPacket}개 확인, ${deferredInPacket}개 재분할 대기` });
  upsertPointer(detailRecord.pointers, { source_id: combinedId, role: "decision", locator: "summary and reviews", note: `세부유형 통합 결과 ${combinedSummary.reviewedDetailItemCount.toLocaleString("ko-KR")}개` });
  upsertPointer(detailRecord.pointers, { source_id: queueId, role: "test", locator: "summary, sources, and locatorRebuilds", note: `일반 세부 검수 ${queueSummary.pendingDetailItemCount.toLocaleString("ko-KR")}개, 위치 재작업 ${locatorRebuildItemCount.toLocaleString("ko-KR")}개, 격리 ${queueSummary.quarantinedItemCount.toLocaleString("ko-KR")}개를 분리` });

  const projectRecord = catalog.records.find(record => record.id === PROJECT_RECORD_ID);
  if (!projectRecord) throw new Error(`공통 인덱스 기록을 찾을 수 없습니다: ${PROJECT_RECORD_ID}`);
  const projectSummary = loaded.projectReviewed.summary;
  projectRecord.summary = `Five source banks and ${projectSummary.itemCount.toLocaleString("en-US")} items are indexed. The shared index has ${projectSummary.mappedItemCount.toLocaleString("en-US")} detail-mapped items, ${projectSummary.unitOnlyItemCount.toLocaleString("en-US")} unit-only items, and ${projectSummary.pendingItemCount.toLocaleString("en-US")} pending items. ${projectSummary.resolvedOverlapCount.toLocaleString("en-US")} overlap decisions remain bound to stable candidate IDs with ${projectSummary.mergedAliasCount.toLocaleString("en-US")} evidence-backed aliases.`;
  projectRecord.updated = today;
  upsertPointer(projectRecord.pointers, { source_id: projectReviewedId, role: "audit", locator: "summary, sourceBanks, conceptFamilies, items, overlapCandidates, typeRelations", note: `${projectSummary.itemCount.toLocaleString("en-US")} items; ${projectSummary.resolvedOverlapCount} overlap decisions; integrity audit passed` });
  upsertPointer(projectRecord.pointers, { source_id: resolutionsId, role: "decision", locator: `reviews keyed by ${(loaded.resolutions.reviews || []).length} unique candidate IDs`, note: "Stable review binding reconstructed from the last audited reviewed index and reapplied" });
  upsertPointer(projectRecord.pointers, { source_id: projectIndexId, role: "decision", locator: "summary and overlapCandidates", note: `Unreviewed project index v${projectVersion(files.projectIndex)} retained separately from the reviewed index` });
  catalog.updated = today;
  return catalog;
}

function main(args) {
  if (args.length !== 7) throw new Error("사용법: node sync-hwangso-detail-memory.cjs <source-memory.json> <packet.json> <combined.json> <queue.json> <project-index.json> <project-reviewed.json> <resolutions.json>");
  const [catalogPath, packet, combined, queue, projectIndex, projectReviewed, resolutions] = args.map(value => path.resolve(value));
  const catalog = syncCatalog(readJson(catalogPath), { packet, combined, queue, projectIndex, projectReviewed, resolutions }, {
    packet: readJson(packet),
    combined: readJson(combined),
    queue: readJson(queue),
    projectReviewed: readJson(projectReviewed),
    resolutions: readJson(resolutions)
  });
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceCount: catalog.sources.length, detailReviewed: catalog.records.find(record => record.id === DETAIL_RECORD_ID).summary, projectReviewed: path.basename(projectReviewed) })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ DETAIL_RECORD_ID, PROJECT_RECORD_ID, fileMeta, upsertById, upsertPointer, packetTitle, projectVersion, syncCatalog });
