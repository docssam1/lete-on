// 모델 응답이 약속한 JSON 꼴인지 검사한다. 맞으면 out에 저장, 틀리면 이유를 stderr로 내고 exit 1.
// 고쳐 쓰지 않는다 — 코드 울타리(```)만 벗긴다.
import { readFileSync, writeFileSync } from "node:fs";
const [raw, out] = process.argv.slice(2);
const text = readFileSync(raw, "utf8").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
let j;
try { j = JSON.parse(text); } catch (e) { console.error(`not json: ${e.message}`); process.exit(1); }
const bad = [];
if (!Array.isArray(j.solutions)) bad.push("solutions not array");
else if (j.solutions.some((s) => !s || typeof s !== "object" || Array.isArray(s))) bad.push("solution not object");
if (typeof j.unique !== "boolean") bad.push("unique not boolean");
if (typeof j.solvable !== "boolean") bad.push("solvable not boolean");
if (![null, "wording", "picture", "conflict"].includes(j.blocker ?? null)) bad.push("blocker");
if (j.solvable && !j.solutions?.length) bad.push("solvable but no solutions");
if (bad.length) { console.error(bad.join(", ")); process.exit(1); }
writeFileSync(out, JSON.stringify(j));
