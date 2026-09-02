import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = readFileSync(fileURLToPath(new URL("./app.js", import.meta.url)), "utf8");
const expected = ["same", "gap", "hide", "blanket", "move", "missing", "two"];

function assert(condition, message) {
  if (!condition) throw new Error(`Piece Play self-test: ${message}`);
}

assert((source.match(/\bid:\s*"/g) || []).length === expected.length, "exactly seven activity types are required");
for (const id of expected) assert(source.includes(`id: "${id}"`), `missing activity ${id}`);
for (const language of ["ko", "en", "zh", "ja"]) assert(source.includes(`${language}:{name:`), `missing ${language} UI copy`);
assert(source.includes("track === \"kids\""), "Kinder and Kids tracks must remain separate");
console.log("Piece Play self-test passed: 7 activities, 2 tracks, 4 locales.");
