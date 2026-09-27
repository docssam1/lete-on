import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  QUESTION_BANK_ADAPTER_VERSION,
  createQuestionBankAdapterRegistry,
  defineQuestionBankAdapter
} from "./question-bank-adapter.js";
import { FIELDS_QUESTION_BANK_ADAPTER } from "./fields-question-bank-adapter.js";

const genericModulePath = fileURLToPath(new URL("./question-bank-adapter.js", import.meta.url));
const genericModuleSource = await readFile(genericModulePath, "utf8");
assert.equal(genericModuleSource.includes("source-data.js"), false, "generic adapter must not require a Fields filename");

const portableAdapter = defineQuestionBankAdapter({
  id: "portable-json-demo",
  label: "Portable JSON demo",
  types: [{
    id: "portable-addition",
    domain: "number",
    middle: "연산",
    label: "두 수의 합",
    solvingModel: "addition",
    visualModel: "number-expression",
    answerContract: "single-number"
  }],
  sourceItems: [{
    sourceKey: "json:demo:book-01:u01:q001",
    sourceSeriesId: "demo",
    typeIds: ["portable-addition"],
    verificationStatus: "verified",
    sourceMeta: { lesson: "1차시" }
  }]
});

assert.equal(portableAdapter.adapterVersion, QUESTION_BANK_ADAPTER_VERSION);
assert.equal(portableAdapter.typeById("portable-addition")?.label, "두 수의 합");
assert.equal(portableAdapter.sourceItemByKey("json:demo:book-01:u01:q001")?.sourceMeta.lesson, "1차시");
assert.equal(portableAdapter.validateSourceItem(portableAdapter.sourceItems[0]), true);

assert.throws(() => defineQuestionBankAdapter({
  id: "duplicate-types",
  label: "Duplicate types",
  types: [{ id: "same" }, { id: "same" }]
}), /Duplicate type key/);

assert.throws(() => defineQuestionBankAdapter({
  id: "unknown-type",
  label: "Unknown type",
  types: [],
  sourceItems: [{ sourceKey: "demo:q1", typeIds: ["missing"] }]
}), /Unknown typeId/);

const registry = createQuestionBankAdapterRegistry([portableAdapter, FIELDS_QUESTION_BANK_ADAPTER]);
assert.equal(registry.get("fields-classic"), FIELDS_QUESTION_BANK_ADAPTER);
assert.equal(registry.list().length, 2);
assert.throws(() => registry.register(portableAdapter), /Duplicate question-bank adapter/);

const fieldsTypeIds = new Set(FIELDS_QUESTION_BANK_ADAPTER.types.map((item) => item.id));
const duplicateTypes = FIELDS_QUESTION_BANK_ADAPTER.types.length - fieldsTypeIds.size;
const sourceKeys = new Set(FIELDS_QUESTION_BANK_ADAPTER.sourceItems.map((item) => item.sourceKey));
const duplicateSources = FIELDS_QUESTION_BANK_ADAPTER.sourceItems.length - sourceKeys.size;
const missingTypeLinks = FIELDS_QUESTION_BANK_ADAPTER.sourceItems.flatMap((item) =>
  [...new Set([...(item.typeIds || []), item.typeId].filter(Boolean))]
    .filter((typeId) => !fieldsTypeIds.has(typeId))
    .map((typeId) => `${item.sourceKey}:${typeId}`)
);

assert.equal(duplicateTypes, 0);
assert.equal(duplicateSources, 0);
assert.deepEqual(missingTypeLinks, []);
assert.equal(FIELDS_QUESTION_BANK_ADAPTER.listTypes(), FIELDS_QUESTION_BANK_ADAPTER.types);
assert.equal(FIELDS_QUESTION_BANK_ADAPTER.listSourceItems(), FIELDS_QUESTION_BANK_ADAPTER.sourceItems);

console.log([
  "QUESTION_BANK_ADAPTER_AUDIT_OK",
  `version=${QUESTION_BANK_ADAPTER_VERSION}`,
  `fieldsTypes=${FIELDS_QUESTION_BANK_ADAPTER.types.length}`,
  `fieldsSources=${FIELDS_QUESTION_BANK_ADAPTER.sourceItems.length}`,
  "portableWithoutSourceData=pass",
  "duplicates=0",
  "missingTypeLinks=0"
].join(" "));
