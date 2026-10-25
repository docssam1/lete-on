// 연습 공방 검사: drill-recipes.js의 차시·유형이 실제로 있고, 난이도 1·2·3마다 답 꼴(수 · 수 + 단위 · 쉼표로 쓴 수)이 맞는 문제가
// 나오며, 그림이 bookN 그리기로 그려지는지 본다. 실패가 하나라도 있으면 exit 1.
//   node fields-classic/question-bank/drill-audit.mjs
import { typeById, CURRICULUM } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { lessonsByUnit } from "./study-map.js";
import { DRILL_RECIPES } from "./drill-recipes.js";
import { answerShape } from "./drill.js";

const TRIES = 20, fails = [];
// 답 꼴 읽기 자체부터(한 줄 뒤 주석이 return을 삼켜 목록 답이 다 빠졌던 적이 있다)
const SHAPES = [["7", "int", [7], ""], ["15개", "int", [15], "개"], ["12㎠", "int", [12], "㎠"], ["1, 4, 5", "list", [1, 4, 5], ""], ["3번 딸기", null], ["가=3, 나=4", null]];
for (const [text, kind, values, unit] of SHAPES) {
  const got = answerShape(text);
  if (kind === null ? got !== null : !got || got.kind !== kind || got.values.join() !== values.join() || got.unit !== unit) fails.push(`답 꼴 읽기: ${text} → ${JSON.stringify(got)}`);
}
const lessonKeys = new Set();
for (const cur of CURRICULUM.filter((b) => /^book-\d\d$/.test(b.id))) {
  const bell = GOLDEN_BELL_BOOKS.find((b) => b.id === cur.id);
  if (bell) for (const ls of lessonsByUnit(cur, bell).units) for (const l of ls) lessonKeys.add(`${cur.id}/${l.id}`);
}
let checked = 0;
for (const [key, types] of Object.entries(DRILL_RECIPES)) {
  if (!lessonKeys.has(key)) fails.push(`${key}: 학생 덱에 없는 차시`);
  if (!types.length) fails.push(`${key}: 유형이 없음`);
  for (const id of types) {
    const type = typeById(id), gen = GENERATORS[type?.generator];
    if (!gen) { fails.push(`${key}: ${id} 생성기 없음`); continue; }
    for (const difficulty of [1, 2, 3]) {
      let ok = 0, made = 0;
      for (let i = 0; i < TRIES; i++) {
        const p = gen({ max: 30, difficulty }); if (!p) continue; made++;
        if (!answerShape(p.answer)) continue;
        if (p.visual && !/^book([1-9]|10)$/.test(p.visual.kind)) { fails.push(`${key}: ${id} 그림 종류 ${p.visual.kind}`); break; }
        ok++;
      }
      if (ok < TRIES / 2) fails.push(`${key}: ${id} 난이도 ${difficulty} 답 꼴 맞음 ${ok}/${made}`);
    }
    checked++;
  }
}
console.log(fails.length ? fails.join("\n") : `DRILL_OK lessons=${Object.keys(DRILL_RECIPES).length} types=${checked}`);
process.exit(fails.length ? 1 : 0);
