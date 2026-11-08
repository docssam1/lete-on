"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const script = path.join(__dirname, "stage-styles.cjs");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "question-bank-styles-"));
const index = '<link rel="stylesheet" href="./a.css?v=1">\n<link rel="stylesheet" href="./b.css?v=2">';
try {
  fs.writeFileSync(path.join(dir, "index.html"), index);
  fs.writeFileSync(path.join(dir, "a.css"), '@import url("https://example.test/font.css");\n.x{color:red}');
  fs.writeFileSync(path.join(dir, "b.css"), '.x{color:blue}');
  const run = () => spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
  assert.equal(run().status, 0);
  const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  const match = html.match(/question-bank-styles\.[a-f0-9]{16}\.css/);
  assert(match);
  const css = fs.readFileSync(path.join(dir, match[0]), "utf8");
  assert(css.indexOf("color:red") < css.indexOf("color:blue"), "source order must be preserved");
  assert.equal((html.match(/rel="stylesheet"/g) || []).length, 1);
  assert(fs.existsSync(path.join(dir, "a.css")), "source files remain available");
  fs.writeFileSync(path.join(dir, "index.html"), index);
  fs.writeFileSync(path.join(dir, "b.css"), '@import url("late.css");');
  assert.notEqual(run().status, 0, "a late import cannot be bundled safely");
  assert.equal(fs.readFileSync(path.join(dir, "index.html"), "utf8"), index, "invalid input must not rewrite HTML");
  console.log("PASS: ordered staged styles, content hash and unsafe import guard");
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
