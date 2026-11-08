"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const script = path.join(__dirname, "stage-scripts.cjs");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "question-bank-scripts-"));
const tag = name => `<script defer src="./${name}?v=1"></script>`;
const html = ["a.js", "b.js", "plain.js", "c.js", "d.js"].map(tag).join("\n");
try {
  const code = {
    "a.js": '(() => { sequence.push("a"); throw new Error("probe"); })();',
    "b.js": '(() => { sequence.push("b"); })();',
    "plain.js": 'sequence.push("plain");',
    "c.js": '(() => { sequence.push("c"); })();',
    "d.js": '(() => { sequence.push("d"); })();'
  };
  fs.writeFileSync(path.join(dir, "index.html"), html);
  for (const [name, value] of Object.entries(code)) fs.writeFileSync(path.join(dir, name), value);
  const run = () => spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
  assert.equal(run().status, 0);
  const result = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  const tags = [...result.matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^\"]*)?">/g)].map(m => m[1]);
  assert.equal(tags.length, 3);
  assert.match(tags[0], /^question-bank-scripts\.[a-f0-9]{16}\.js$/);
  assert.equal(tags[1], "plain.js", "non-IIFE scripts retain their global semantics");
  const sequence = [], errors = [];
  const context = vm.createContext({ sequence, reportError: e => errors.push(e.message) });
  for (const name of tags) vm.runInContext(fs.readFileSync(path.join(dir, name), "utf8"), context);
  assert.deepEqual(sequence, ["a", "b", "plain", "c", "d"]);
  assert.deepEqual(errors, ["probe"], "one failure is reported without stopping the next script");
  assert(fs.existsSync(path.join(dir, "a.js")), "original files remain available");
  fs.writeFileSync(path.join(dir, "index.html"), `${html}\n<script>unsafe()</script>`);
  assert.notEqual(run().status, 0, "inline scripts require explicit review");
  assert.match(fs.readFileSync(path.join(dir, "index.html"), "utf8"), /unsafe\(\)/);
  console.log("PASS: ordered bundles, global-script isolation and error continuation");
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
