import { readFile, writeFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url), sharp = require("sharp");
const root = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
const report = JSON.parse(await readFile(`${root}/pdf-validation.json`, "utf8"));
const files = await readdir(`${root}/pdf-render`);
const results = [];
for (const pdf of report.pdfs) {
  const pages = files.filter((name) => name.startsWith(`${pdf.name}-`) && /^\d+\.png$/.test(name.slice(pdf.name.length + 1))).sort();
  const layers = [];
  for (const [index, page] of pages.entries()) layers.push({ input: await sharp(`${root}/pdf-render/${page}`).resize(240, 340, { fit: "contain", background: "#fff" }).png().toBuffer(), left: (index % 4) * 252 + 6, top: Math.floor(index / 4) * 352 + 6 });
  const path = `${root}/${pdf.name}-contact.png`;
  await sharp({ create: { width: 1008, height: Math.ceil(pages.length / 4) * 352, channels: 3, background: "#d9dfdd" } }).composite(layers).png().toFile(path);
  results.push({ name: pdf.name, pages: pages.length, contact: `${pdf.name}-contact.png` });
}
await writeFile(`${root}/contact-sheets.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ passed: true, contactSheets: results.length, renderedPages: results.reduce((sum, item) => sum + item.pages, 0) }, null, 2));
