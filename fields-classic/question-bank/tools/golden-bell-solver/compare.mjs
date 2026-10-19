// 모델 풀이(out/)를 비공개 답안과 대조한다. 답안 파일은 저장소 밖에 둔다.
// node compare.mjs <작업 폴더> <답안 JSON: {answerRef: {answer}}>
// 화면에는 문항 번호와 갈래만 찍는다(정답 숫자 없음). 답이 담긴 상세는 <작업 폴더>/compare-detail.json.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [dir, keyFile] = process.argv.slice(2);
const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
const key = JSON.parse(readFileSync(keyFile, "utf8"));
const norm = (v) => String(v).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[×✕]/g, "x").toLowerCase();
const accept = (ref) => { const a = key[ref]?.answer; return a === undefined ? null : (Array.isArray(a) ? a : [a]).map(norm); };

const rows = [], detail = [];
for (const q of index) {
  const f = join(dir, "out", `${q.name}.json`);
  if (!existsSync(f)) { rows.push([q.sourceNo, "미응답"]); continue; }
  const m = JSON.parse(readFileSync(f, "utf8"));
  const refs = q.parts.length ? q.parts : [q.answerRef];
  const keys = refs.map(accept);
  if (keys.some((k) => k === null)) { rows.push([q.sourceNo, "답안 없음"]); continue; }
  // 모델이 낸 풀이 하나하나가 우리 답안에 맞는가(칸 이름 → 값)
  const fits = (s) => q.slots.every((slot, i) => s[slot] !== undefined && keys[i].includes(norm(s[slot])));
  const okSols = m.solutions.filter(fits), badSols = m.solutions.filter((s) => !fits(s));
  const tags = [];
  if (!m.solvable) tags.push(`못 풂(${m.blocker || "?"})`);
  else if (!okSols.length) tags.push("불일치");
  if (badSols.length && okSols.length) tags.push("다른 답도 냄");
  if (m.unique === false) tags.push(badSols.length ? "답 여럿이라 함" : "답 여럿(답안이 모두 받음)");
  if (tags.length) rows.push([q.sourceNo, tags.join(" · ")]);
  detail.push({ ...q, tags, model: m, key: keys });
}
writeFileSync(join(dir, "compare-detail.json"), JSON.stringify(detail, null, 1));
const groups = {};
for (const [no, tag] of rows) (groups[tag] ||= []).push(no);
for (const [tag, list] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) console.log(`${tag} (${list.length}): ${list.join(", ")}`);
console.log(`checked ${index.length}, flagged ${rows.length}`);
