"use strict";

// Bundle only the staged site. Source files and their URLs remain available.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const directory = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(directory, "index.html"))) {
  throw new Error("Pass the staged question-bank directory.");
}
const indexPath = path.join(directory, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const linkPattern = /<link\s+rel="stylesheet"\s+href="(\.\/[^"?]+\.css)(?:\?[^"#]*)?">/g;
const links = [...html.matchAll(linkPattern)];
const allStyles = [...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/g)];
if (!links.length || links.length !== allStyles.length) {
  throw new Error("Stylesheet links must be local, plain, and retain their order.");
}
const parts = links.map((match, index) => {
  const name = match[1].slice(2);
  if (path.basename(name) !== name) throw new Error(`Stylesheet must be alongside index.html: ${name}`);
  const css = fs.readFileSync(path.join(directory, name), "utf8");
  const directives = [...css.matchAll(/@(charset|namespace|import)\b/gi)].map(item => item[1].toLowerCase());
  if (directives.some(d => d !== "import") || (directives.length && (index !== 0 || directives.length !== 1))) {
    throw new Error(`Cannot safely combine CSS directives in ${name}`);
  }
  return `\n/* ${name} */\n${css}\n`;
});
const bundle = parts.join("");
const hash = crypto.createHash("sha256").update(bundle).digest("hex").slice(0, 16);
const bundleName = `question-bank-styles.${hash}.css`;
let first = true;
const rewritten = html.replace(linkPattern, () => {
  if (!first) return "";
  first = false;
  return `<link rel="stylesheet" href="./${bundleName}">`;
});
fs.writeFileSync(path.join(directory, bundleName), bundle);
fs.writeFileSync(indexPath, rewritten);
console.log(`Staged ${links.length} stylesheets as ${bundleName}`);
