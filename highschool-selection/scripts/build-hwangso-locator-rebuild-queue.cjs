const fs = require("node:fs");
const crypto = require("node:crypto");

function fail(message) { throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function clean(value) { return String(value || "").trim(); }

function groupId(sourceMemoryId, page) {
  const digest = crypto.createHash("sha256").update(`${sourceMemoryId}:${page}`).digest("hex").slice(0, 16);
  return `loc-rbd-${digest}`;
}

function buildQueue(input) {
  const rows = Array.isArray(input.locatorRebuilds) ? input.locatorRebuilds : fail("locatorRebuilds 목록이 필요합니다.");
  const groups = new Map();
  const seenIds = new Set();

  for (const row of rows) {
    const sourceItemId = clean(row.sourceItemId);
    const sourceMemoryId = clean(row.sourceMemoryId);
    const sourceRef = clean(row.sourceRef);
    const page = Number(row.locator?.page);
    const slot = Number(row.locator?.slot);
    if (!sourceItemId || !sourceMemoryId || !sourceRef || !Number.isInteger(page) || !Number.isInteger(slot)) {
      fail("재분할 항목의 원본 ID와 쪽·칸이 올바르지 않습니다.");
    }
    if (seenIds.has(sourceItemId)) fail(`중복 문항 ID: ${sourceItemId}`);
    seenIds.add(sourceItemId);
    const key = `${sourceMemoryId}:${page}`;
    if (!groups.has(key)) groups.set(key, {
      groupId: groupId(sourceMemoryId, page), sourceMemoryId, sourceRef, page,
      status: "decision_pending", candidates: []
    });
    const group = groups.get(key);
    if (group.sourceRef !== sourceRef) fail(`같은 원본 쪽의 sourceRef가 다릅니다: ${key}`);
    group.candidates.push({
      sourceItemId,
      semester: clean(row.semester),
      majorUnit: clean(row.majorUnit),
      minorUnit: clean(row.minorUnit),
      slot,
      kind: clean(row.locator.kind),
      box: row.locator.box,
      reason: clean(row.reason)
    });
  }

  const outputGroups = [...groups.values()]
    .map(group => ({ ...group, candidates: group.candidates.sort((a, b) => a.slot - b.slot || a.sourceItemId.localeCompare(b.sourceItemId)) }))
    .sort((a, b) => a.sourceMemoryId.localeCompare(b.sourceMemoryId) || a.page - b.page);
  return {
    schemaVersion: 1,
    sourceBankId: clean(input.sourceBankId),
    status: "locator_rebuild_queue",
    groups: outputGroups,
    summary: {
      candidateCount: rows.length,
      pageGroupCount: outputGroups.length,
      sourceCount: new Set(outputGroups.map(group => group.sourceMemoryId)).size
    }
  };
}

function main() {
  const [inputFile, outputFile] = process.argv.slice(2);
  if (!inputFile || !outputFile) fail("Usage: node build-hwangso-locator-rebuild-queue.cjs <detail-work-queue.json> <output.json>");
  const output = buildQueue(readJson(inputFile));
  fs.writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main();
module.exports = { buildQueue, groupId };
