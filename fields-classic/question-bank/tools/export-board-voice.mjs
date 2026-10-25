// 손글씨 판서 대본(concept-boards.js)의 독쌤 말을 음성 생성기가 읽는 꼴로 내보낸다.
//   node fields-classic/question-bank/tools/export-board-voice.mjs          → data/voice/boards.voice.json 다시 쓰기
//   node fields-classic/question-bank/tools/export-board-voice.mjs --check  → 대본과 어긋나면 실패(exit 1)
// 음성은 GPU PC에서 scripts/local/omnivoice-docssam.cmd 가 만들어 science-lab/audio/docssam/ 에 둔다(줄 id 규칙 = concept-boards.js lineId).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const { BOARDS, lineId } = await import(path.join(here, "..", "concept-boards.js"));
const lines = [];
for (const [key, board] of Object.entries(BOARDS)) {
  board.beats.forEach((beat, k) => { if (beat.say) lines.push({ id: lineId(key, "b", k + 1), text: beat.say }); });
  const check = board.beats.at(-1)?.check;
  if (check) for (const kind of ["hint", "right", "reveal"]) {
    const text = check[`say${kind[0].toUpperCase()}${kind.slice(1)}`] || (kind === "hint" ? check.hint : kind === "right" ? "맞았어요! 개념을 잘 익혔어요." : "정답을 표시했어요. 판서를 다시 보고 왜 그런지 생각해 봐요.");
    if (text) lines.push({ id: lineId(key, kind), text });
  }
}
const out = { voice: "docssam-omnivoice", note: "손글씨 판서(concept-boards.js) 독쌤 말. 손으로 고치지 말고 tools/export-board-voice.mjs 로 다시 만든다. 음성 파일은 science-lab/audio/docssam/ (scripts/omnivoice-docssam.py).", lines };
const target = path.join(here, "..", "data", "voice", "boards.voice.json");
const json = JSON.stringify(out, null, 1) + "\n";
if (process.argv.includes("--check")) {
  const now = existsSync(target) ? readFileSync(target, "utf8") : "";
  if (now !== json) { console.error("BOARD_VOICE_STALE: boards.voice.json 이 대본과 다르다 → node fields-classic/question-bank/tools/export-board-voice.mjs"); process.exit(1); }
  console.log(`BOARD_VOICE_OK lines=${lines.length}`); process.exit(0);
}
writeFileSync(target, json);
console.log(`boards.voice.json: ${lines.length}줄, ${lines.reduce((n, l) => n + l.text.length, 0)}자`);
