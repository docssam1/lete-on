"use strict";
// Every CSS `page: <name>` used for printing must have a matching `@page <name>` rule.
// Undefined names fall back to `@page { margin: 0 }`, and answer pages have no print padding,
// so the solution would print flush against the paper edge.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const dir = __dirname;
const files = fs.readdirSync(dir).filter(name => /\.(css|html|js|mjs)$/.test(name) && !/-audit\.|audit-controls/.test(name));
const used = new Map();
const defined = new Set();
for (const name of files) {
  const text = fs.readFileSync(path.join(dir, name), "utf8");
  for (const match of text.matchAll(/@page\s+([A-Za-z][\w-]*)/g)) defined.add(match[1]);
  if (!/\.(css|html)$/.test(name)) continue;
  for (const match of text.matchAll(/(?:^|[;{\s])page:\s*([A-Za-z][\w-]*)/g)) {
    if (["auto", "inherit", "initial", "unset"].includes(match[1])) continue;
    if (!used.has(match[1])) used.set(match[1], name);
  }
}
const missing = [...used].filter(([page]) => !defined.has(page)).map(([page, file]) => `${page} (${file})`);
assert.deepEqual(missing, [], `Named print pages without an @page rule: ${missing.join(", ")}`);
console.log(`Named print pages: ${used.size} used, all have an @page rule (${defined.size} defined).`);
