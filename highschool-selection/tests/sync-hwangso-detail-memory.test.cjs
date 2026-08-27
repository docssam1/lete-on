"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const sync = require("../scripts/sync-hwangso-detail-memory.cjs");

test("황소 세부 검수 동기화는 파일을 한 번만 등록하고 진행 통계를 최신 값으로 바꾼다", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hwangso-sync-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const names = ["packet-d2-v1.json", "combined.json", "queue.json", "project-index-v6.json", "project-reviewed-v6.json", "resolutions-v3.json"];
  names.forEach(name => fs.writeFileSync(path.join(root, name), "{}\n"));
  const files = {
    packet: path.join(root, names[0]), combined: path.join(root, names[1]), queue: path.join(root, names[2]),
    projectIndex: path.join(root, names[3]), projectReviewed: path.join(root, names[4]), resolutions: path.join(root, names[5])
  };
  const catalog = {
    root,
    sources: [{ id: "combined", title: "old" }],
    records: [
      { id: sync.DETAIL_RECORD_ID, pointers: [] },
      { id: sync.PROJECT_RECORD_ID, pointers: [] }
    ]
  };
  const loaded = {
    packet: { sources: [{ itemReviews: [{}, {}] }], deferred: [{}] },
    combined: { summary: { itemCount: 10, reviewedDetailItemCount: 4 } },
    queue: { summary: { pendingDetailItemCount: 5, quarantinedItemCount: 1 } },
    projectReviewed: { summary: { itemCount: 20, mappedItemCount: 8, unitOnlyItemCount: 7, pendingItemCount: 5, resolvedOverlapCount: 3, mergedAliasCount: 1 } },
    resolutions: { reviews: [{}, {}, {}] }
  };
  sync.syncCatalog(catalog, files, loaded);
  sync.syncCatalog(catalog, files, loaded);
  assert.equal(catalog.sources.filter(source => source.id === "combined").length, 1);
  assert.equal(catalog.sources.length, 6);
  assert.match(catalog.records[0].summary, /4개는 세부유형/);
  assert.match(catalog.records[0].summary, /재분할.*1개|1개는 대기/);
  assert.equal(catalog.records[0].pointers.length, 3);
  assert.match(catalog.records[1].summary, /3 overlap decisions/);
  assert.equal(catalog.records[1].pointers.length, 3);
});

test("메모리 루트 밖 파일은 등록하지 않는다", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hwangso-root-"));
  const other = fs.mkdtempSync(path.join(os.tmpdir(), "hwangso-other-"));
  t.after(() => { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(other, { recursive: true, force: true }); });
  const file = path.join(other, "outside.json");
  fs.writeFileSync(file, "{}\n");
  assert.throws(() => sync.fileMeta(file, root, "outside"), /루트 밖/);
});
