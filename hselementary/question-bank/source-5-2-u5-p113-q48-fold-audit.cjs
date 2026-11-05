"use strict";
const assert = require("node:assert/strict");
const bank = require("./source-5-2-u5-page108-practice.js");
const q = bank.build(48);
assert.equal(q.answer, "③");
assert.match(q.solution, /③/, "풀이에도 정답 보기가 있어야 합니다.");
assert.match(q.prompt, /점선을 따라/);
const fold = q.prompt.match(/<path data-fold-lines="true"[^>]*>/)?.[0];
const outline = q.prompt.match(/<path data-net-outline="true"[^>]*>/)?.[0];
assert(fold && outline, "접는 선과 바깥 테두리가 있어야 합니다.");
assert.match(fold, /stroke-dasharray="4 2"/);
assert.doesNotMatch(outline, /stroke-dasharray/);
assert.match(outline, /d="M120 8 H150 V38 H210 V68 H180 V98 H150 V68 H90 V38 H120 Z"/);
// Five shared edges of the six source faces, with their original shapes intact.
const d = fold.match(/d="([^"]+)"/)[1];
assert.equal(d, "M120 38 V68 M150 38 V68 M180 38 V68 M120 38 H150 M150 68 H180");
assert.equal((q.prompt.match(/<rect x="(?:90|120|150|180)" y="(?:8|38|68)" width="30" height="30" fill="white" stroke="none"/g) || []).length, 6);
console.log("PASS: p113 q48 six faces, solid outline, five dashed fold lines and answer");
