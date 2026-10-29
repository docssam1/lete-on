// 스스로 공부 한 주 덱(study.html)의 독쌤 말을 음성 생성기가 읽는 꼴로 내보낸다(원장 2026-10-28 「새 대사도 음성 목록에 넣어」).
//   node fields-classic/question-bank/tools/export-study-voice.mjs          → data/voice/study-deck.voice.json 다시 쓰기
//   node fields-classic/question-bank/tools/export-study-voice.mjs --check  → 덱 대사와 어긋나면 실패(exit 1)
// 줄 id 규칙은 study-deck.js(voiceLine: 글의 해시). 1~10권 40단원의 덱을 실제로 만들어 장마다 말을 모은다.
// 점수가 들어가는 말(단원 평가 결과)은 그때그때 달라 목록에 넣지 않는다 — 기기 음성.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => import(pathToFileURL(path.join(here, "..", name)).href);
const { CURRICULUM } = await load("source-data.js");
const { loadGoldenBell, STUDY_GAMES } = await load("study-map.js");
const { buildWeekSlides, slideLine, FIXED_LINES, voiceLine } = await load("study-deck.js");
const bellData = await loadGoldenBell();
const byId = new Map();
const add = (line) => {
  const had = byId.get(line.id);
  if (had && had.text !== line.text) throw new Error(`같은 id에 다른 글: ${line.id}`);
  byId.set(line.id, line);
};
for (const line of Object.values(FIXED_LINES)) add(line);
for (const games of Object.values(STUDY_GAMES)) for (const game of games) if (game.doneSay) add(voiceLine("game", game.doneSay));
// 덱 안 게임(연습 공방·디지털 숫자 공방·뒤집고 돌리기 공방)의 독쌤 말(원장 2026-10-28 「게임 음성이 아직 윈도우 음성」).
// 화면(study.js)은 id 없이 온 게임 말에 voiceLine("game", 글)의 id를 붙여 녹음을 찾는다 — 여기서 같은 규칙으로 모은다.
// ① 고정 말: say(…)·miss(…)·say: 안의 "…" 글(템플릿 글자 `…${}`는 빼고) ② 문제마다 바뀌지만 경우가 정해진 말: 게임이 내보내는 함수로 펼친다.
// 숫자 개수가 들어가는 말(「옮긴 칸 중 N칸」 등)은 기기 음성.
const GAME_FILES = ["drill.js", "game-digital.js", "game-shape-moves.js"];
const quoted = (chunk) => [...chunk.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((t) => /[가-힣]/.test(t) && t.length > 4);
function spokenLiterals(src) {
  const out = [];
  for (const m of src.matchAll(/\b(say|miss)\(/g)) {
    if (/(const|function)\s*$/.test(src.slice(Math.max(0, m.index - 12), m.index))) continue;
    let depth = 0, i = m.index + m[0].length - 1, inTpl = false;
    for (; i < src.length; i += 1) {
      const c = src[i];
      if (c === "`") inTpl = !inTpl;
      if (inTpl) continue;
      if (c === "(") depth += 1;
      if (c === ")" && --depth === 0) break;
    }
    out.push(...quoted(src.slice(m.index, i).replace(/`[^`]*`/g, "")));
  }
  for (const m of src.matchAll(/\bsay: ([^}]*)/g)) out.push(...quoted(m[1].replace(/`[^`]*`/g, "")));
  return out;
}
for (const file of GAME_FILES) for (const text of spokenLiterals(readFileSync(path.join(here, "..", file), "utf8"))) add(voiceLine("game", text));
{
  const shape = await load("game-shape-moves.js"), digital = await load("game-digital.js");
  for (const name of Object.keys(shape.OPS)) { add(voiceLine("game", shape.nextLine(name))); add(voiceLine("game", shape.firstLine([name]))); }
  // 문제 생성은 무작위라 여러 번 돌려 나올 수 있는 경우를 다 모은다(경우 수가 작다: 이름 줄 11가지 · 더하기 수 22가지)
  let seed = 7; const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let k = 0; k < 3000; k += 1) {
    shape.LEVELS.forEach((level, l) => level.problems?.forEach((_, i) => { const p = shape.makeProblem(l, i, rand); if (p) add(voiceLine("game", shape.firstLine(p.names))); }));
    digital.LEVELS.forEach((level, l) => level.problems.forEach((_, i) => { const p = digital.makeProblem(l, i, rand); if (p) add(voiceLine("game", digital.problemLine(p))); }));
  }
}
// 숫자가 바뀌는 말(원장 2026-10-29 「숫자가 바뀌는 말도 하라고」): 나올 수 있는 개수를 다 펼친다
{
  const shape = await load("game-shape-moves.js"), digital = await load("game-digital.js");
  const maxCells = Math.max(...shape.LEVELS.map((level) => level.cells));
  for (let n = 1; n <= maxCells; n += 1) add(voiceLine("game", shape.wrongCellsLine(n)));
  for (let n = 1; n <= 14; n += 1) add(voiceLine("game", digital.wrongBarsLine(n)));   // 두 자리 × 막대 7개
  let seed = 11; const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  let cells = 0, targets = 0;
  for (let k = 0; k < 500; k += 1) digital.LEVELS.forEach((level, l) => level.problems.forEach((_, i) => { const p = digital.makeProblem(l, i, rand); if (p.kind === "board") { cells = Math.max(cells, p.cells.length); targets = Math.max(targets, p.targets.length); } }));
  for (let missing = 1; missing <= targets; missing += 1) add(voiceLine("game", digital.boardMissLine(0, missing)));
  for (let extra = 1; extra <= cells; extra += 1) for (let missing = 0; missing <= targets; missing += 1) add(voiceLine("game", digital.boardMissLine(extra, missing)));
}
{
  // 본책 번호를 눌러 여는 유사 문제 말(sheetLine)은 지금 덱이 그 번호판을 그리지 않아 녹음하지 않는다
  const { weekTypes, testResultLine } = await load("study-deck.js");
  const totals = new Set();
  for (const book of CURRICULUM) for (const unit of book.units) totals.add(weekTypes(unit).length);
  for (const total of totals) for (let right = 0; right <= total; right += 1) add(testResultLine(total, right));
}
let decks = 0;
for (const book of CURRICULUM) {
  for (let unitIndex = 0; unitIndex < book.units.length; unitIndex += 1) {
    for (const slide of buildWeekSlides(book, unitIndex, bellData)) add(slideLine(slide, { book, unitIndex }));
    decks += 1;
  }
}
const lines = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)).map(({ id, text }) => ({ id, text }));
const out = { voice: "docssam-omnivoice", note: "스스로 공부 한 주 덱(study.html) 독쌤 말. 손으로 고치지 말고 tools/export-study-voice.mjs 로 다시 만든다. 음성 파일은 science-lab/audio/docssam/ (scripts/omnivoice-docssam.py).", lines };
const target = path.join(here, "..", "data", "voice", "study-deck.voice.json");
const json = JSON.stringify(out, null, 1) + "\n";
if (process.argv.includes("--check")) {
  const now = existsSync(target) ? readFileSync(target, "utf8") : "";
  if (now !== json) { console.error("STUDY_VOICE_STALE: study-deck.voice.json 이 덱 대사와 다르다 → node fields-classic/question-bank/tools/export-study-voice.mjs"); process.exit(1); }
  console.log(`STUDY_VOICE_OK lines=${lines.length}`); process.exit(0);
}
writeFileSync(target, json);
console.log(`study-deck.voice.json: 덱 ${decks}개 · ${lines.length}줄 · ${lines.reduce((n, l) => n + l.text.length, 0)}자`);
