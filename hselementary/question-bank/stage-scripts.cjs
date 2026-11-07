"use strict";

// Bundle only independent deferred IIFEs in the staged site, in source order.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const directory = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(directory, "index.html"))) throw new Error("Pass the staged question-bank directory.");
const indexPath = path.join(directory, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const pattern = /<script defer src="(\.\/[^"?]+\.js)(?:\?[^"#]*)?"><\/script>/g;
const matches = [...html.matchAll(pattern)];
const allScripts = [...html.matchAll(/<script\b[^>]*>/g)];
if (!matches.length || matches.length !== allScripts.length) throw new Error("Scripts must be local deferred scripts with no inline scripts.");
const entries = matches.map(match => {
  const name = match[1].slice(2);
  if (path.basename(name) !== name) throw new Error(`Script must be alongside index.html: ${name}`);
  const code = fs.readFileSync(path.join(directory, name), "utf8");
  new vm.Script(code, { filename: name });
  const start = code.replace(/^\uFEFF/, "").replace(/^(?:(?:\s+)|(?:\/\/[^\n]*(?:\n|$))|(?:\/\*[\s\S]*?\*\/))*/, "");
  const iife = /^(?:\(function\b|\(\(\)|\(\s*async\b|!function\b)/.test(start);
  const sensitive = /document\s*\.\s*(?:currentScript|write)\b|\bimportScripts\s*\(|\bimport\s*\(|sourceMappingURL/.test(code);
  return { name, code, eligible: iife && !sensitive && Buffer.byteLength(code) <= 500000, original: match[0] };
});
const replacements = Array(entries.length).fill("");
let pending = [], bytes = 0, bundled = 0, groups = 0;
function flush() {
  if (!pending.length) return;
  if (pending.length === 1) {
    replacements[pending[0]] = entries[pending[0]].original;
  } else {
    const content = pending.map(i => `\ntry {\n${entries[i].code}\n} catch (e) { if (typeof reportError === "function") reportError(e); else setTimeout(() => { throw e; }, 0); }\n`).join("");
    new vm.Script(content, { filename: "question-bank-script-bundle.js" });
    const hash = crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
    const name = `question-bank-scripts.${hash}.js`;
    fs.writeFileSync(path.join(directory, name), content);
    replacements[pending[0]] = `<script defer src="./${name}"></script>`;
    bundled += pending.length;
    groups++;
  }
  pending = [];
  bytes = 0;
}
entries.forEach((entry, i) => {
  if (!entry.eligible) { flush(); replacements[i] = entry.original; return; }
  const size = Buffer.byteLength(entry.code);
  if (pending.length >= 25 || (pending.length && bytes + size > 500000)) flush();
  pending.push(i);
  bytes += size;
});
flush();
let index = 0;
fs.writeFileSync(indexPath, html.replace(pattern, () => replacements[index++]));
console.log(`Staged ${bundled} independent scripts in ${groups} bundles; ${entries.length - bundled} scripts remain separate.`);
