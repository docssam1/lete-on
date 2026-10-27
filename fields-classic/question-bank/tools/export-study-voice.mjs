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
