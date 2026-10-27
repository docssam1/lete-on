import { unitParts, partProblems, lessonsByUnit, lessonsByPart, STUDY_GAMES, STUDY_BOARDS } from "./study-map.js?v=20261027p";

// 한 주(한 단원) 덱의 장과 독쌤 말 — study.js(화면)와 tools/export-study-voice.mjs(음성 목록)가 같이 쓴다.
// 독쌤 말 id는 글에서 나온다(`fcs-<종류>-<글의 FNV 해시>`): 같은 글이면 같은 음성 파일, 글을 고치면 새 id라 옛 음성을 틀지 않는다.
// 점수처럼 그때그때 바뀌는 말(단원 평가 결과)은 id가 없어 기기 음성으로 읽는다.

export const PHASES = Object.freeze([
  ["concept", "개념 배우기"],
  ["game", "게임하기"],
  ["bell", "골든벨"],
  ["board", "공부하기"],
  ["homework", "과제"],
  ["test", "단원 평가"],
  ["booktest", "권별 테스트"]
]);

function fnv(text) {
  let hash = 0x811c9dc5;
  for (const char of String(text)) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 0x01000193) >>> 0; }
  return hash.toString(36);
}
export const voiceLine = (kind, text) => ({ id: `fcs-${kind}-${fnv(text)}`, text });

// 덱 밖의 고정 말(덱 안 게임·골든벨이 끝났을 때, 불러오기 실패)
export const FIXED_LINES = Object.freeze({
  loading: voiceLine("cover", "공부할 것을 준비하고 있어요. 잠깐만 기다려 줘요."),
  bellDone: voiceLine("bell", "골든벨 문제를 다 풀었어요! 정말 잘했어요. 다음으로 넘어가요."),
  gameDone: voiceLine("game", "게임을 끝까지 해냈어요! 결과를 보고 다음으로 가요."),
  nativeDone: voiceLine("game", "게임을 끝까지 해냈어요! 이제 골든벨 문제로 가요."),
  bellLoadFail: voiceLine("cover", "골든벨 학습을 불러오지 못했어요. 새로고침하면 다시 불러와요. 본책 문제는 지금도 풀 수 있어요.")
});

// 한 주(단원)의 본책 묶음: 차시마다 나뉜 것을 묶음 이름으로 합친다 — 활동 1 · 확인 1 · 활동 2 · 확인 2 … · 연습 · 도전
export function weekBlocks(unit) {
  const { count } = unitParts(unit);
  const merged = new Map();
  for (let p = 1; p <= count; p += 1) {
    for (const block of partProblems(unit, p)) {
      const key = `${block.section}|${block.label}`;
      if (merged.has(key)) merged.get(key).numbers.push(...block.numbers);
      else merged.set(key, { ...block, numbers: [...block.numbers] });
    }
  }
  const shared = (block) => ["practice", "challenge", "advanced"].includes(block.section) || !/\d/.test(block.label);
  return [...merged.values()].map((block) => ({ ...block, numbers: block.numbers.sort((a, b) => a.n - b.n) }))
    .sort((a, b) => Number(shared(a)) - Number(shared(b)) || (shared(a) ? 0 : a.group - b.group));
}
// 과제·단원 평가에 쓰는 이 단원의 유형(본책 번호판에 나오는 순서, 겹치지 않게)
export function weekTypes(unit) {
  const seen = new Set(), out = [];
  for (const block of weekBlocks(unit)) for (const { typeId } of block.numbers) if (!seen.has(typeId)) { seen.add(typeId); out.push(typeId); }
  for (const typeId of unit.typeIds) if (!seen.has(typeId)) { seen.add(typeId); out.push(typeId); }
  return out;
}

// 한 주 덱의 장: 표지 → 개념 → 게임 → 골든벨 → 공부하기 → 과제 → 단원 평가 → (마지막 단원) 권별 테스트 → 도착
export function buildWeekSlides(book, unitIndex, bellData) {
  const unit = book.units[unitIndex];
  const bellBook = bellData?.books.find((entry) => entry.id === book.id);
  const lessons = bellData ? lessonsByPart(unit, lessonsByUnit(book, bellBook).units[unitIndex]).flat() : [];
  const list = [{ kind: "cover" }];
  for (const lesson of lessons) {
    const key = `${book.id}/${lesson.id}`;
    // 손글씨 판서가 있으면 그 판서(덱 안에서 직접 그림), 없으면 골든벨 개념 화면(창)
    list.push(STUDY_BOARDS[key] ? { kind: "concept", lesson, native: { ...STUDY_BOARDS[key], board: key } } : { kind: "concept", lesson });
  }
  const replaced = new Set();
  for (const lesson of lessons) {
    for (const game of STUDY_GAMES[`${book.id}/${lesson.id}`] || []) {
      list.push({ kind: "game", lesson, native: game, title: game.title });
      for (const old of game.replaces || []) replaced.add(old);
    }
  }
  for (const lesson of lessons) {
    const flow = bellData.games.flows[`${book.id}/${lesson.id}`];
    // 연습 공방이 게임인 흐름은 덱 안의 연습 공방(STUDY_GAMES)과 같은 것이라 또 붙이지 않는다
    if (flow?.game && flow.game !== "drill") list.push({ kind: "game", lesson, game: flow.game, title: bellData.games.flowTitles[flow.game] || "게임" });
    for (const [id, activity] of Object.entries(bellData.games.activities)) {
      if (activity.lesson === lesson.id && bellData.games.handsOnBooks.get(id) === book.id && id !== flow?.game && !replaced.has(id)) list.push({ kind: "game", lesson, game: id, title: activity.title });
    }
  }
  for (const lesson of lessons) if (lesson.original?.items?.length) list.push({ kind: "bell", lesson });
  for (const block of weekBlocks(unit)) list.push({ kind: "board", block });
  if (weekTypes(unit).length) list.push({ kind: "homework" }, { kind: "test" });
  if (unitIndex === book.units.length - 1 && book.source.unitTestQuestions?.length) list.push({ kind: "booktest" });
  list.push({ kind: "end" });
  // 같은 종류가 여러 장이면 「2 / 3」을 붙인다
  for (const [kind] of PHASES) {
    const same = list.filter((slide) => slide.kind === kind);
    same.forEach((slide, k) => { slide.of = same.length > 1 ? `${k + 1} / ${same.length}` : ""; });
  }
  return list;
}

// 장마다 독쌤이 하는 말 { id, text }
export function slideLine(slide, { book, unitIndex }) {
  const unit = book.units[unitIndex];
  if (slide.kind === "cover") return voiceLine("cover", `이번 주는 ${unit.label}이에요. 개념을 배우고, 게임으로 익히고, 골든벨을 풀고, 본책 문제를 풀어요. 과제를 하고 단원 평가까지 봐요. 출발하기를 눌러 봐요.`);
  if (slide.kind === "concept") return voiceLine("concept", slide.native ? `${slide.lesson.title} 개념이에요. 칠판을 봐요.` : `${slide.lesson.title} 개념이에요. 한 장씩 천천히 보고 다음을 눌러요.`);
  if (slide.kind === "game") return voiceLine("game", `${slide.title} 게임이에요. 개념에서 본 풀이 순서대로 손으로 직접 해 봐요.`);
  if (slide.kind === "bell") return voiceLine("bell", "골든벨 문제예요. 개념에서 배운 대로 한 문제씩 풀어 봐요.");
  if (slide.kind === "board") return voiceLine("board", `본책 ${slide.block.label} 문제예요. 화면에서 풀어도 되고, 인쇄해서 풀어도 돼요. 어려우면 유사 문제를 풀어 봐요.`);
  if (slide.kind === "homework") return voiceLine("homework", "이번 주 과제예요. 인쇄해서 집에서 풀고, 다 풀면 화면에서 답을 확인해요.");
  if (slide.kind === "test") return voiceLine("test", "단원 평가예요. 다 풀고 채점하기를 누르면 맞은 것과 틀린 것을 표시해요. 약한 유형은 다시 공부해요.");
  if (slide.kind === "booktest") return voiceLine("booktest", `${book.label}을 다 공부했어요! 이제 권별 테스트를 풀어요. 채점하면 약한 유형을 알려 줘요.`);
  return voiceLine("end", `${unitIndex + 1}단원 한 주 공부를 다 마쳤어요! 정말 잘했어요.`);
}
