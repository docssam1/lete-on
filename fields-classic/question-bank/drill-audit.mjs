// 연습 공방 검사: drill-recipes.js의 차시·유형이 실제로 있고, 난이도 1·2·3마다 답 꼴(수 · 수 + 단위 · 쉼표로 쓴 수)이 맞는 문제가
// 나오며, 그림이 bookN 그리기나 2권 그리기(book02-visuals.js)로 그려지는지 본다. 실패가 하나라도 있으면 exit 1.
//   node fields-classic/question-bank/drill-audit.mjs
import { readFileSync } from "node:fs";
import { runInThisContext } from "node:vm";
import { typeById, CURRICULUM } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { DRILL_TYPES } from "./drill-generators.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { lessonsByUnit } from "./study-map.js";
import { DRILL_RECIPES } from "./drill-recipes.js";
import { answerShape, choiceShape, EXTRA_VISUALS, drillGenerator } from "./drill.js";

// 쌓기나무 엔진(GW_GEN)은 브라우저 스크립트다 — 공방 페이지(drill.html)가 싣는 것과 같은 파일을 그대로 읽어 들인다
for (const f of ["../../geometry/shared/question-bank.js", "../../geometry/worksheet/generators.js"]) {
  const path = new URL(f, import.meta.url);
  runInThisContext(readFileSync(path, "utf8"), { filename: path.pathname });
}

const TRIES = 20, fails = [];
// 답 꼴 읽기 자체부터(한 줄 뒤 주석이 return을 삼켜 목록 답이 다 빠졌던 적이 있다)
const SHAPES = [["7", "int", [7], ""], ["15개", "int", [15], "개"], ["12㎠", "int", [12], "㎠"], ["1, 4, 5", "list", [1, 4, 5], ""], ["3번 딸기", null], ["가=3, 나=4", "parts", [3, 4], undefined], ["(1) 29, (2) 36", "parts", [29, 36], undefined], ["11시 30분", "pair", [11, 30], undefined], ["2시간 5분", "pair", [2, 5], undefined], ["토요일", "weekday", [6], undefined], ["8월 1일 금요일", null], ["3/6", "frac", [3, 6], undefined]];
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
    const type = DRILL_TYPES[id] || typeById(id), gen = type && drillGenerator(type);
    if (!gen) { fails.push(`${key}: ${id} 생성기 없음`); continue; }
    for (const difficulty of [1, 2, 3]) {
      let ok = 0, made = 0;
      for (let i = 0; i < TRIES; i++) {
        const p = gen({ max: 30, difficulty }, i); if (!p) continue; made++;
        const shape = answerShape(p.answer) || choiceShape(p);
        if (!shape) continue;
        // 수 카드를 모두 늘어놓는 배치 답(1, 4, 5, 2, 3, 6)은 순서 없이 채점하면 아무 순서나 맞으므로 쓰지 않는다
        // 보기 단추: 고른 보기가 곧 답이고, 보기가 서로 다르며, 보기에 원탁의 앉은 차례가 그대로 드러나지 않아야 한다
        if (shape.kind === "choice") {
          const picked = shape.options[shape.values[0]], order = p.meta?.order;
          if (picked !== String(p.answer).replace(/<[^>]+>/g, "").trim() || new Set(shape.options).size !== shape.options.length) { fails.push(`${key}: ${id} 보기 ${shape.options.join("/")} · 답 ${p.answer}`); break; }
          if (Array.isArray(order) && order.length > 2 && shape.options.join() === order.join() && [...order].sort((x, y) => x.localeCompare(y, "ko")).join() !== order.join()) { fails.push(`${key}: ${id} 보기가 앉은 차례 그대로`); break; }
        }
        if (shape.kind === "list" && shape.values.length >= 5) { fails.push(`${key}: ${id} 배치 답(${shape.values.length}개) — 숫자판으로 채점할 수 없음`); break; }
        if (p.visual && !/^book([1-9]|10)$/.test(p.visual.kind) && !EXTRA_VISUALS[p.visual.kind]) { fails.push(`${key}: ${id} 그림 종류 ${p.visual.kind}`); break; }
        ok++;
      }
      // 공방은 답 꼴이 맞을 때까지 200번까지 다시 뽑는다 — 5번에 1번 이상이면 충분하다
      if (ok < TRIES / 5) fails.push(`${key}: ${id} 난이도 ${difficulty} 답 꼴 맞음 ${ok}/${made}`);
    }
    checked++;
  }
}
// 공방 전용 유형: 이름이 문제은행과 겹치지 않고, □에 답을 넣으면 식의 양쪽이 같아야 한다
for (const [id, type] of Object.entries(DRILL_TYPES)) {
  if (!id.startsWith("drill-") || typeById(id)) fails.push(`${id}: 공방 전용 유형 이름은 drill-로 시작하고 문제은행과 겹치지 않아야 함`);
  for (const difficulty of [1, 2, 3]) for (let i = 0; i < 300; i++) {
    const p = type.make({ difficulty }); if (!p) continue;
    const expr = p.visual?.expression;
    if (!expr) continue;
    const [left, right] = expr.replace("□", p.answer).replaceAll("×", "*").replaceAll("−", "-").split("=").map((x) => Function(`return (${x})`)());
    if (left !== right || !(Number(p.answer) > 0)) { fails.push(`${id} 난이도 ${difficulty}: ${expr} 답 ${p.answer} — 식이 맞지 않음`); break; }
  }
}
console.log(fails.length ? fails.join("\n") : `DRILL_OK lessons=${Object.keys(DRILL_RECIPES).length} types=${checked}`);
process.exit(fails.length ? 1 : 0);
