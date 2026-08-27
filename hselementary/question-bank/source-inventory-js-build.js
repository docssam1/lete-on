"use strict";

const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(__dirname, "source-inventory");
const inventory = JSON.parse(fs.readFileSync(path.join(directory, "4-1-source-items.json"), "utf8"));
const crosswalks = ["1-2", "3-4", "5-6"].map(range =>
  JSON.parse(fs.readFileSync(path.join(directory, `4-1-crosswalk-units-${range}.json`), "utf8"))
);
const legacyMappings = crosswalks.flatMap(item => item.mappings || []);
const nativeMappings = JSON.parse(fs.readFileSync(path.join(directory, "4-1-native-generators.json"), "utf8")).mappings || [];
const mappingBySourceId = new Map(legacyMappings.map(item => [item.sourceItemId, item]));
for (const mapping of nativeMappings) mappingBySourceId.set(mapping.sourceItemId, mapping);

if (new Set(nativeMappings.map(item => item.sourceItemId)).size !== nativeMappings.length) throw new Error("중복된 4-1 전용 생성기 매핑이 있습니다.");

const payload = {
  version: "2026-08-27",
  totals: inventory.totals,
  exceptions: inventory.exceptions,
  verifiedMappings: mappingBySourceId.size,
  items: inventory.items.map(item => {
    const mapping = mappingBySourceId.get(item.sourceItemId);
    return {
      ...item,
      generatorKey: mapping?.generatorKey || "",
      variant: mapping?.variant,
      difficultyBand: mapping?.difficultyBand ?? 0,
      sourceTier: mapping?.sourceTier || "advanced",
      reviewLocked: !mapping
    };
  })
};

const output = `window.HSE_SOURCE_INVENTORY_41 = ${JSON.stringify(payload, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, "source-inventory-4-1.js"), output);
console.log(`4-1 브라우저 원문 목록 생성: ${payload.items.length}유형 · 생성 가능 ${payload.verifiedMappings}유형`);
