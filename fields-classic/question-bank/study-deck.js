import { unitParts, partProblems, lessonsByUnit, STUDY_GAMES, STUDY_BOARDS } from "./study-map.js?v=20261029a";

// 차시 덱의 장과 독쌤 말 — study.js(화면)와 tools/export-study-voice.mjs(음성 목록)가 같이 쓴다.
// 한 단원 = 차시 2번(원장 2026-10-29 「1단원을 2번으로 끊어 줘야 하고」 · 본책이 개념 1·2 묶음으로 나뉜 대로, 7권 2단원·10권 1단원은 3번):
//   표지 → (개념 ① → 게임 ①(건너뛸 수 있다) → 워밍업 ①) → (개념 ② → 게임 ② → 워밍업 ②) → 공부하기(그 차시 본책) → 오늘의 과제
//   → 앞 차시는 데일리 테스트 4문제 · 마지막 차시는 단원 평가 10문제 → (그 권의 마지막 단원 마지막 차시면) 권별 테스트 → 도착
// 독쌤 말 id는 글에서 나온다(`fcs-<종류>-<글의 FNV 해시>`): 같은 글이면 같은 음성 파일, 글을 고치면 새 id라 옛 음성을 틀지 않는다.
// 숫자가 바뀌는 말(테스트 점수·게임의 틀린 개수)은 나올 수 있는 경우를 다 펼쳐 녹음한다. 약한 유형 이름처럼 경우가 너무 많은 것만 말풍선 글에 둔다.

export const PHASES = Object.freeze([
  ["concept", "개념 배우기"],
  ["game", "게임하기"],
  ["bell", "워밍업"],
  ["board", "공부하기"],
  ["homework", "오늘의 과제"],
  ["daily", "데일리 테스트"],
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
  bellDone: voiceLine("bell", "워밍업 문제를 다 풀었어요! 정말 잘했어요. 다음으로 넘어가요."),
  gameDone: voiceLine("game", "게임을 끝까지 해냈어요! 결과를 보고 다음으로 가요."),
  nativeDone: voiceLine("game", "게임을 끝까지 해냈어요! 이제 워밍업 문제로 가요."),
  bellLoadFail: voiceLine("cover", "워밍업 학습을 불러오지 못했어요. 새로고침하면 다시 불러와요. 본책 문제는 지금도 풀 수 있어요."),
  // 단원 평가·권별 테스트 전 팝업(원장 2026-10-29 「데일리 테스트 결과와 약점 유형이 누적되고 … 평가 보기 전 팝업」)
  gateTest: voiceLine("test", "단원 평가를 보기 전에 데일리 테스트에서 틀린 약점 유형을 먼저 공부해 봐요. 바로 봐도 돼요."),
  gateBook: voiceLine("booktest", "권별 테스트를 보기 전에 그동안 틀린 약점 유형을 먼저 공부해 봐요. 바로 봐도 돼요."),
  gateBack: voiceLine("test", "약점 유형을 공부했어요. 이제 시작해 봐요.")
});

// 숫자가 바뀌는 말 — 경우가 정해져 있어 음성 목록(tools/export-study-voice.mjs)이 다 펼쳐 녹음한다
// 본책 번호 이름: 활동 1-3번 · 연습 7번
export const refOf = (block, n) => block.label.includes(" ") ? `${block.label}-${n}번` : `${block.label} ${n}번`;
export const SHEET_BACK = voiceLine("board", "좋아요. 이제 본책으로 돌아가서 그 문제를 다시 풀어 봐요.");
export const sheetLine = (ref) => voiceLine("board", `${ref}과 같은 유형의 문제예요. 이 문제를 먼저 풀고 본책 문제를 다시 풀어 봐요.`);
// 단원 평가 결과: 점수만 말한다. 약한 유형 이름은 경우가 너무 많아 말풍선 글에만 쓴다(study.js)
export const testResultLine = (total, right) => right >= total
  ? voiceLine("test", `${total}문제를 모두 맞았어요! 정말 잘했어요.`)
  : voiceLine("test", `${total}문제 중 ${right}문제 맞았어요. 약한 유형을 다시 공부하면 더 잘할 수 있어요. 약점 유형 공부하기를 눌러 다시 풀어 봐요.`);

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

export const DAILY_COUNT = 4, UNIT_TEST_COUNT = 10;
// 차시 수(본책 개념 묶음 수)
export const sessionCount = (unit) => unitParts(unit).count;
// 단원의 워밍업 개념을 차시마다 앞에서부터 고르게 나눈다(4개면 2 · 2, 3개면 2 · 1)
export function sessionLessons(book, unitIndex, bellData, part) {
  const bellBook = bellData?.books.find((entry) => entry.id === book.id);
  const all = bellData ? lessonsByUnit(book, bellBook).units[unitIndex] : [];
  const count = sessionCount(book.units[unitIndex]);
  const size = Math.ceil(all.length / count);
  return all.slice((part - 1) * size, part * size);
}
// 그 차시 본책 묶음(활동 · 확인 · 연습 · 도전 — 문항의 유형이 속한 차시로)
export const sessionBlocks = (unit, part) => partProblems(unit, part);
// 그 차시 과제·데일리 테스트에 쓰는 유형(본책 번호판 순서, 겹치지 않게). 없으면 단원 전체
export function sessionTypes(unit, part) {
  const seen = new Set();
  for (const block of sessionBlocks(unit, part)) for (const { typeId } of block.numbers) seen.add(typeId);
  return seen.size ? [...seen] : weekTypes(unit);
}
// 한 차시 교재(원장 2026-10-29 「워밍업 교재 표지와 같게, 한 회차 교재 구성 전체를 묶으라고」)의 문제은행 쪽:
// 그 차시 본책(활동 · 확인 · 연습 · 도전) → 오늘의 과제 → 데일리 테스트(마지막 차시는 단원 평가) — picks(유형~단계~표시~단원) 한 줄
export function sessionBookPicks(unit, unitIndex, part) {
  const last = part === sessionCount(unit);
  const picks = [];
  for (const block of sessionBlocks(unit, part)) for (const { n, typeId, stage } of block.numbers) picks.push([typeId, stage, `본책 ${refOf(block, n)}`, unitIndex].join("~"));
  for (const typeId of sessionTypes(unit, part)) picks.push([typeId, "practice", "오늘의 과제", unitIndex].join("~"));
  if (last) for (const typeId of unitTestTypes(unit)) picks.push([typeId, "advanced", "단원 평가", unitIndex].join("~"));
  else for (const typeId of dailyTypes(unit, part)) picks.push([typeId, "practice", "데일리 테스트", unitIndex].join("~"));
  return picks.join("|");
}
// 유형 목록에서 n문제: 유형이 많으면 고르게 건너뛰며, 적으면 돌아가며 한 번 더
export const spreadTypes = (types, n) => !types.length ? [] : Array.from({ length: n }, (_, k) => types.length >= n ? types[Math.floor((k * types.length) / n)] : types[k % types.length]);
export const dailyTypes = (unit, part) => spreadTypes(sessionTypes(unit, part), DAILY_COUNT);
export const unitTestTypes = (unit) => spreadTypes(weekTypes(unit), UNIT_TEST_COUNT);

export function buildSessionSlides(book, unitIndex, part, bellData) {
  const unit = book.units[unitIndex];
  const parts = sessionCount(unit);
  const lessons = sessionLessons(book, unitIndex, bellData, part);
  const list = [{ kind: "cover" }];
  for (const lesson of lessons) {
    const key = `${book.id}/${lesson.id}`;
    // 손글씨 판서가 있으면 그 판서(덱 안에서 직접 그림), 없으면 워밍업 개념 화면(창)
    list.push(STUDY_BOARDS[key] ? { kind: "concept", lesson, native: { ...STUDY_BOARDS[key], board: key } } : { kind: "concept", lesson });
    const nativeIds = new Set(), replaced = new Set();
    for (const game of STUDY_GAMES[key] || []) {
      list.push({ kind: "game", lesson, native: game, title: game.title });
      nativeIds.add(game.id);
      for (const old of game.replaces || []) replaced.add(old);
    }
    if (bellData) {
      const flow = bellData.games.flows[key];
      // 흐름의 게임이 덱 안 게임(STUDY_GAMES)과 같은 것이면 또 붙이지 않는다
      if (flow?.game && flow.game !== "drill" && !nativeIds.has(flow.game)) list.push({ kind: "game", lesson, game: flow.game, title: bellData.games.flowTitles[flow.game] || "게임" });
      for (const [id, activity] of Object.entries(bellData.games.activities)) {
        if (activity.lesson === lesson.id && bellData.games.handsOnBooks.get(id) === book.id && id !== flow?.game && !replaced.has(id)) list.push({ kind: "game", lesson, game: id, title: activity.title });
      }
    }
    if (lesson.original?.items?.length) list.push({ kind: "bell", lesson });
  }
  for (const block of sessionBlocks(unit, part)) list.push({ kind: "board", block });
  if (sessionTypes(unit, part).length) list.push({ kind: "homework" }, { kind: part < parts ? "daily" : "test" });
  if (part === parts && unitIndex === book.units.length - 1 && book.source.unitTestQuestions?.length) list.push({ kind: "booktest" });
  list.push({ kind: "end" });
  // 같은 종류가 여러 장이면 「2 / 3」을 붙인다
  for (const [kind] of PHASES) {
    const same = list.filter((slide) => slide.kind === kind);
    same.forEach((slide, k) => { slide.of = same.length > 1 ? `${k + 1} / ${same.length}` : ""; });
  }
  return list;
}

// 워밍업 장의 이름 — 연산 골든벨 자료에서 온 차시는 「필수연산」(원장 2026-10-28 「연산 골든벨은 필수연산」)
export const bellLabel = (slide) => slide.lesson?.original?.title === "필수연산" ? "필수연산" : "워밍업";

// 장마다 독쌤이 하는 말 { id, text }
export function slideLine(slide, { book, unitIndex, part = 1, hasConcept = true }) {
  const unit = book.units[unitIndex];
  const parts = sessionCount(unit), last = part >= parts;
  const test = last ? "단원 평가" : "데일리 테스트";
  if (slide.kind === "cover") return voiceLine("cover", hasConcept
    ? `오늘은 ${unit.label} ${part}차시예요. 개념을 배우고, 게임과 워밍업으로 익힌 다음 본책 문제를 풀어요. 오늘의 과제를 하고 ${test}까지 봐요. 출발하기를 눌러 봐요.`
    : `오늘은 ${unit.label} ${part}차시예요. 본책 문제를 풀고, 오늘의 과제를 하고 ${test}까지 봐요. 출발하기를 눌러 봐요.`);
  if (slide.kind === "concept") return voiceLine("concept", slide.native ? `${slide.lesson.title} 개념이에요. 칠판을 봐요.` : `${slide.lesson.title} 개념이에요. 한 장씩 천천히 보고 다음을 눌러요.`);
  if (slide.kind === "game") return voiceLine("game", `${slide.title} 게임이에요. 개념에서 본 풀이 순서대로 손으로 직접 해 봐요.`);
  if (slide.kind === "bell") return voiceLine("bell", `${bellLabel(slide)} 문제예요. 개념에서 배운 대로 한 문제씩 풀어 봐요.`);
  if (slide.kind === "board") return voiceLine("board", `본책 ${slide.block.label} 문제예요. 화면에서 풀어도 되고, 인쇄해서 풀어도 돼요. 어려우면 유사 문제를 풀어 봐요.`);
  if (slide.kind === "homework") return voiceLine("homework", "오늘의 과제예요. 칠판에 적힌 대로 인쇄해서 집에서 풀고, 다 풀면 화면에서 답을 확인해요.");
  if (slide.kind === "daily") return voiceLine("test", `데일리 테스트예요. 오늘 배운 것으로 ${DAILY_COUNT === 4 ? "네" : DAILY_COUNT} 문제를 풀어요. 다 풀고 채점하기를 누르면 맞은 것과 틀린 것을 표시해요.`);
  if (slide.kind === "test") return voiceLine("test", "단원 평가예요. 이 단원에서 배운 것으로 열 문제를 풀어요. 다 풀고 채점하기를 누르면 맞은 것과 틀린 것을 표시해요. 약한 유형은 다시 공부해요.");
  if (slide.kind === "booktest") return voiceLine("booktest", `${book.label}을 다 공부했어요! 이제 권별 테스트를 풀어요. 채점하면 약한 유형을 알려 줘요.`);
  return voiceLine("end", last ? `${unitIndex + 1}단원 공부를 다 마쳤어요! 정말 잘했어요.` : `${unitIndex + 1}단원 ${part}차시 공부를 다 마쳤어요! 다음에는 ${part + 1}차시를 공부해요.`);
}

